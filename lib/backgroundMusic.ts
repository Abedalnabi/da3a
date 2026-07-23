"use client";

/**
 * A tiny singleton wrapper around the YouTube IFrame API so a single hidden
 * player instance can be started from the door-knock interaction and later
 * controlled from the floating MusicToggle button, regardless of which
 * component tree currently has them mounted.
 */

type YTPlayerInstance = {
  unMute: () => void;
  mute: () => void;
  setVolume: (v: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, options: Record<string, unknown>) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VIDEO_ID = "Hp8WTVqR_0U";
const CONTAINER_ID = "background-music-player";
// The song should always begin from its very start the first time it becomes
// audible (the guest's first knock), and loop back to the start thereafter.
const START_SECONDS = 0;
// Set once the music has been made audible, so the "start from the beginning"
// seek only happens on that first knock — later pause/resume toggles must not
// yank the song back to 0:00.
let startedAudibly = false;

let player: YTPlayerInstance | null = null;
let apiRequested = false;
const readyCallbacks: Array<() => void> = [];

// Tracks intent (not actual player state): true whenever the guest has
// started/resumed the music, false only when they explicitly pause it via
// MusicToggle. Background tabs, brief buffering stalls, or the odd dropped
// frame can knock the player out of the "playing" state without touching
// this flag — whatever resumes it just calls playVideo() again since the
// intent to be playing never changed.
let shouldBePlaying = false;
let resilienceListenersAttached = false;

// Chrome (and others) keep a background tab's audio playing fine on their
// own, but the player can still get nudged into "paused" by an occasional
// buffering hiccup or a browser memory-pressure suspension. Reacting to the
// player's own state changes (rather than only rechecking on tab-focus)
// catches that immediately, even while the tab is still in the background.
function attachResilienceListeners() {
  if (resilienceListenersAttached || typeof document === "undefined") return;
  resilienceListenersAttached = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || !shouldBePlaying || !player) return;
    try {
      if (player.getPlayerState() !== 1) player.playVideo();
    } catch {
      // ignore — player may not be fully initialized yet
    }
  });
}

// iOS Safari suppresses audio/video playback for elements it judges as not
// meaningfully on screen — a 1x1px iframe shoved off-screen (the usual
// "hidden video" trick) gets silently muted there, even though the same
// player plays fine on desktop/Android. Giving it a real on-screen size and
// hiding it with opacity instead keeps iOS treating it as a normal video.
function ensureContainer() {
  if (document.getElementById(CONTAINER_ID)) return;
  const div = document.createElement("div");
  div.id = CONTAINER_ID;
  div.style.position = "fixed";
  div.style.width = "160px";
  div.style.height = "90px";
  div.style.right = "0";
  div.style.bottom = "0";
  div.style.opacity = "0";
  div.style.pointerEvents = "none";
  document.body.appendChild(div);
}

function whenReady(callback: () => void) {
  if (player) {
    callback();
    return;
  }
  readyCallbacks.push(callback);
  if (apiRequested) return;
  apiRequested = true;
  ensureContainer();

  const createPlayer = () => {
    attachResilienceListeners();
    player = new window.YT!.Player(CONTAINER_ID, {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        start: START_SECONDS,
        loop: 1,
        playlist: VIDEO_ID,
        playsinline: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          readyCallbacks.splice(0).forEach((cb) => cb());
        },
        // Fires for every state the player passes through, including while
        // the tab is backgrounded — if it lands on "paused" while we still
        // intend to be playing, nudge it straight back to playing. Looping
        // (state 0, "ended") restarts from 0:00 on its own, so seek back to
        // the intro-skip point before replaying it.
        onStateChange: (event: { data: number }) => {
          if (event.data === 0) {
            player?.seekTo(START_SECONDS, true);
            if (shouldBePlaying) player?.playVideo();
            return;
          }
          if (shouldBePlaying && event.data === 2) {
            player?.playVideo();
          }
        },
      },
    });
  };

  if (window.YT?.Player) {
    createPlayer();
  } else {
    window.onYouTubeIframeAPIReady = createPlayer;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  }
}

/** Preloads the (muted) player early so it's ready the moment a real gesture unmutes it. */
export function initBackgroundMusic() {
  if (typeof window === "undefined") return;
  whenReady(() => {});
}

/** Must be called from within a real user-gesture handler (click/keydown) to satisfy autoplay policies. */
export function playBackgroundMusicAudibly() {
  if (typeof window === "undefined") return;
  shouldBePlaying = true;
  whenReady(() => {
    try {
      // First audible start (the first knock) always begins from 0:00, even
      // though the player has been quietly autoplaying muted since page load.
      if (!startedAudibly) {
        startedAudibly = true;
        player?.seekTo(START_SECONDS, true);
      }
      player?.unMute();
      player?.setVolume(70);
      player?.playVideo();
    } catch {
      // ignore playback errors (e.g. embedding disabled for this video)
    }
  });
}

// Whether the persistent gesture-unlock listener is currently attached.
let audioUnlockAttached = false;

/**
 * Attaches a listener that starts the music on the guest's FIRST real
 * interaction anywhere on the page, and keeps retrying on every subsequent
 * interaction until the audio is actually audible (unmuted). This covers the
 * cases a single click can't: the YouTube player not being ready yet at the
 * moment of the first tap, or an auto-opened door where no tap happened at all
 * — the instant the guest touches, scrolls, or presses a key, sound kicks in.
 * (Browsers forbid audio outside a real gesture, so this is the earliest it can
 * legitimately start.)
 */
export function ensureAudioUnlocksOnGesture() {
  if (audioUnlockAttached || typeof window === "undefined") return;
  audioUnlockAttached = true;

  const events: Array<keyof WindowEventMap> = ["pointerdown", "touchstart", "keydown", "click"];

  const detach = () => {
    events.forEach((evt) => window.removeEventListener(evt, tryUnlock, true));
    audioUnlockAttached = false;
  };

  const tryUnlock = () => {
    playBackgroundMusicAudibly();
    try {
      // Once the player exists and is genuinely unmuted, the gesture did its
      // job — stop listening. Until then, keep trying on each interaction.
      if (player && !player.isMuted()) detach();
    } catch {
      // player not ready yet — leave the listener attached to retry
    }
  };

  events.forEach((evt) => window.addEventListener(evt, tryUnlock, { capture: true, passive: true }));
}

/** Toggles play/pause and returns the resulting playing state. */
export function toggleBackgroundMusic(): boolean {
  if (!player) return false;
  try {
    if (player.isMuted() || player.getPlayerState() !== 1) {
      shouldBePlaying = true;
      player.unMute();
      player.setVolume(70);
      player.playVideo();
      return true;
    }
    shouldBePlaying = false;
    player.pauseVideo();
    return false;
  } catch {
    return false;
  }
}
