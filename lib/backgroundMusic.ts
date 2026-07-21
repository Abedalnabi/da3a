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

let player: YTPlayerInstance | null = null;
let apiRequested = false;
const readyCallbacks: Array<() => void> = [];

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
    player = new window.YT!.Player(CONTAINER_ID, {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
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
  whenReady(() => {
    try {
      player?.unMute();
      player?.setVolume(70);
      player?.playVideo();
    } catch {
      // ignore playback errors (e.g. embedding disabled for this video)
    }
  });
}

/** Toggles play/pause and returns the resulting playing state. */
export function toggleBackgroundMusic(): boolean {
  if (!player) return false;
  try {
    if (player.isMuted() || player.getPlayerState() !== 1) {
      player.unMute();
      player.setVolume(70);
      player.playVideo();
      return true;
    }
    player.pauseVideo();
    return false;
  } catch {
    return false;
  }
}
