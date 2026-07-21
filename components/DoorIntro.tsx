"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { COPY, WEDDING } from "@/lib/wedding";
import { initBackgroundMusic, playBackgroundMusicAudibly } from "@/lib/backgroundMusic";
import { playKnockSound } from "@/lib/knockSound";

type DoorIntroProps = {
  /** Called once, the moment the door finishes opening and the hero video takes over. */
  onRevealed: () => void;
};

const KNOCKS_NEEDED = 3;

export default function DoorIntro({ onRevealed }: DoorIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const doorVideoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const knockLayerRef = useRef<HTMLDivElement>(null);
  const knockTextRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState<"knocking" | "opening" | "hero">("knocking");
  const [knocks, setKnocks] = useState(0);
  const reducedMotionRef = useRef(false);
  const hasRevealed = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    initBackgroundMusic();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".door-intro-enter",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const spawnRipple = (x: number, y: number) => {
    const layer = knockLayerRef.current;
    if (!layer || reducedMotionRef.current) return;
    const ripple = document.createElement("span");
    ripple.className = "pointer-events-none absolute rounded-full border border-rose-light/80";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = "16px";
    ripple.style.height = "16px";
    ripple.style.transform = "translate(-50%, -50%)";
    layer.appendChild(ripple);
    gsap.fromTo(
      ripple,
      { scale: 0.3, autoAlpha: 0.9 },
      {
        scale: 6,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      }
    );
    gsap.fromTo(
      doorVideoRef.current,
      { scale: 1 },
      { scale: 1.015, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  };

  const handleKnock = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== "knocking") return;
    const rect = e.currentTarget.getBoundingClientRect();
    spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    playKnockSound();
    playBackgroundMusicAudibly();

    setKnocks((prev) => {
      const next = prev + 1;
      if (next >= KNOCKS_NEEDED) {
        window.setTimeout(() => beginOpening(), reducedMotionRef.current ? 0 : 350);
      }
      return next;
    });
  };

  const beginOpening = () => {
    setStage("opening");
    gsap.to(knockTextRef.current, { autoAlpha: 0, y: -10, duration: 0.5, ease: "power2.out" });

    const door = doorVideoRef.current;
    if (reducedMotionRef.current || !door) {
      revealHero();
      return;
    }
    door.currentTime = 0;
    door.play().catch(() => {});
    door.onended = () => revealHero();
  };

  const revealHero = () => {
    setStage("hero");
    const hero = heroVideoRef.current;
    if (hero && !reducedMotionRef.current) {
      hero.currentTime = 0;
      hero.play().catch(() => {});
    }

    if (!hasRevealed.current) {
      hasRevealed.current = true;
      onRevealed();
    }
  };

  // Runs after React has actually committed the "hero" stage DOM, so the
  // .reveal-* targets exist by the time GSAP looks for them.
  useEffect(() => {
    if (stage !== "hero") return;
    const tl = gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".reveal-groom", { autoAlpha: 0, y: 20, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 0.1)
      .fromTo(".reveal-amp", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, "-=0.3")
      .fromTo(".reveal-bride", { autoAlpha: 0, y: 20, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, "-=0.4")
      .fromTo(".reveal-meta", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, [stage]);

  // Once the reveal text has finished writing itself in, start nudging the
  // page down on its own — a small step every quarter second rather than a
  // continuous per-frame crawl — until it reaches the bottom, easing out
  // gently as it gets there. Any touch, wheel, or key input stops it
  // immediately — on mobile that means the very first touchstart of a
  // swipe, before the browser's own momentum scroll even kicks in, so it
  // never fights the guest for control of the page.
  useEffect(() => {
    if (stage !== "hero" || reducedMotionRef.current) return;

    let intervalId = 0;
    let stopped = false;
    let elapsedSeconds = 0;

    const stop = () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
    const interactionEvents: Array<keyof WindowEventMap> = ["touchstart", "wheel", "pointerdown", "keydown"];
    interactionEvents.forEach((evt) => window.addEventListener(evt, stop, { passive: true }));

    const STEP_INTERVAL_MS = 15;
    const CRAWL_SPEED_PX_PER_SEC = 200;
    const RAMP_IN_SECONDS = 0.6;
    const SLOWDOWN_ZONE_PX = 220;

    const tick = () => {
      if (stopped) return;
      elapsedSeconds += STEP_INTERVAL_MS / 1000;

      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      const remaining = maxScrollY - window.scrollY;
      if (remaining <= 1) {
        stop();
        return;
      }

      const rampInFactor = Math.min(elapsedSeconds / RAMP_IN_SECONDS, 1);
      const slowdownFactor = Math.min(remaining / SLOWDOWN_ZONE_PX, 1);
      // behavior: "auto" forces an instant scroll for this step — the page's
      // global `scroll-behavior: smooth` would otherwise turn every step
      // into its own overlapping animation and stutter.
      window.scrollBy({
        top: CRAWL_SPEED_PX_PER_SEC * rampInFactor * slowdownFactor * (STEP_INTERVAL_MS / 1000),
        behavior: "auto",
      });
    };

    // Matches roughly how long the reveal timeline above takes to finish.
    const startTimeout = window.setTimeout(() => {
      if (!stopped) intervalId = window.setInterval(tick, STEP_INTERVAL_MS);
    }, 2600);

    return () => {
      stopped = true;
      window.clearTimeout(startTimeout);
      window.clearInterval(intervalId);
      interactionEvents.forEach((evt) => window.removeEventListener(evt, stop));
    };
  }, [stage]);

  // Decoding a full-screen looping video is real per-frame work — once it's
  // scrolled entirely out of view there's no reason to keep paying for it.
  // The threshold is 0 (fully offscreen) rather than a partial one so it
  // doesn't pause while the video is still mostly visible.
  useEffect(() => {
    if (stage !== "hero") return;
    const hero = heroVideoRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hero.play().catch(() => {});
        else hero.pause();
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [stage]);

  const isFixed = stage !== "hero";

  return (
    <div
      ref={rootRef}
      id={isFixed ? undefined : "hero"}
      className={
        isFixed
          ? "fixed inset-0 z-50 overflow-hidden bg-cream"
          : "relative min-h-[100svh] overflow-hidden bg-cream"
      }
    >
      {/* door video (paused at frame 0 until the third knock) — poster shows
          instantly so guests on slow connections see the door, not a blank screen */}
      <video
        ref={doorVideoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/door.mp4"
        poster="/images/door-poster.jpg"
        muted
        playsInline
        preload="auto"
        style={{ display: stage === "hero" ? "none" : "block" }}
      />

      {/* hero video — a single persistent element; it plays once the door opens and keeps looping */}
      <video
        ref={heroVideoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-door.mp4"
        muted
        loop
        playsInline
        preload="auto"
        style={{ display: stage === "hero" ? "block" : "none" }}
      />

      <div
        className={`pointer-events-none absolute inset-0 ${
          stage === "hero"
            ? "bg-[linear-gradient(to_top,_rgba(40,30,24,0.6)_0%,_rgba(40,30,24,0.3)_45%,_rgba(40,30,24,0.12)_70%,_transparent_100%)]"
            : "bg-[linear-gradient(to_top,_rgba(35,26,20,0.75)_0%,_rgba(35,26,20,0.4)_28%,_transparent_50%)]"
        }`}
      />

      {/* knock interaction layer */}
      {stage !== "hero" && (
        <div
          ref={knockLayerRef}
          onClick={handleKnock}
          role="button"
          tabIndex={0}
          aria-label={COPY.doorKnockHint}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleKnock(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
          }}
          className="absolute inset-0 cursor-pointer touch-manipulation select-none overflow-hidden focus:outline-none"
        >
          {stage === "knocking" && (
            <div
              ref={knockTextRef}
              className="door-intro-enter invisible absolute inset-x-0 bottom-16 flex translate-y-4 flex-col items-center gap-4 px-6 text-center opacity-0 sm:bottom-20"
            >
              <h1 className="font-display text-4xl leading-[1.35] pb-2 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl">
                {WEDDING.groom} <span aria-hidden="true">&amp;</span> {WEDDING.bride}
              </h1>
              <p className="font-ui text-lg font-semibold text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.85))_drop-shadow(0_4px_14px_rgba(0,0,0,0.6))] sm:text-xl">
                {COPY.doorKnockHint}
              </p>
              <div className="flex items-center gap-3">
                {Array.from({ length: KNOCKS_NEEDED }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 w-3 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors duration-300 ${
                      i < knocks ? "bg-white" : "bg-black/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* hero reveal text, shown once the door has opened — names animate in one at a time */}
      {stage === "hero" && (
        <div
          ref={revealRef}
          className="relative flex min-h-[100svh] flex-col items-center justify-center gap-3 px-6 text-center"
        >
          <h1 className="font-display text-5xl font-bold leading-[1.4] text-white sm:text-6xl">
            <span className="reveal-groom invisible inline-block opacity-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.9))_drop-shadow(0_6px_20px_rgba(0,0,0,0.6))]">
              {WEDDING.groom}
            </span>
            <br />
            <span
              aria-hidden="true"
              className="reveal-amp invisible inline-block text-3xl opacity-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.9))_drop-shadow(0_6px_20px_rgba(0,0,0,0.6))] sm:text-4xl"
            >
              &amp;
            </span>
            <br />
            <span className="reveal-bride invisible inline-block opacity-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.9))_drop-shadow(0_6px_20px_rgba(0,0,0,0.6))]">
              {WEDDING.bride}
            </span>
          </h1>

          <p className="reveal-meta invisible mt-2 font-numeral text-xl font-semibold text-white opacity-0 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))_drop-shadow(0_4px_14px_rgba(0,0,0,0.65))] sm:text-2xl">
            {WEDDING.dayName}، {WEDDING.dateLabel}
          </p>
          <p className="reveal-meta invisible font-ui text-lg font-medium text-white/90 opacity-0 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))_drop-shadow(0_4px_14px_rgba(0,0,0,0.65))] sm:text-xl">
            {COPY.heroVenueLine} • {COPY.heroTimeLine}
          </p>
          <p className="reveal-meta invisible max-w-sm font-body text-xl font-semibold text-white opacity-0 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))_drop-shadow(0_4px_14px_rgba(0,0,0,0.65))] sm:text-2xl">
            {COPY.heroTagline}
          </p>

          <div className="reveal-meta invisible mt-10 flex flex-col items-center gap-2 text-white opacity-0">
            <span className="font-ui text-base font-medium tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:text-lg">
              {COPY.heroScrollHint}
            </span>
            <svg
              width="22"
              height="30"
              viewBox="0 0 16 24"
              className="animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              <path d="M8 0 V20 M2 14 L8 22 L14 14" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
