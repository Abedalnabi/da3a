"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { COPY, WEDDING } from "@/lib/wedding";
import { initBackgroundMusic, playBackgroundMusicAudibly } from "@/lib/backgroundMusic";
import { playKnockSound } from "@/lib/knockSound";

// Slow, continuous auto-scroll all the way to the bottom of the page —
// a steady smooth crawl rather than a jump or a burst of discrete ticks.
// Cancels itself the moment the guest scrolls, swipes, or presses a key.
const AUTO_SCROLL_SPEED_PX_PER_SEC = 200;

const startSmoothAutoScrollToBottom = () => {
  let cancelled = false;
  let lastTime: number | null = null;
  let rafId: number;

  const cancel = () => {
    cancelled = true;
  };
  const cancelEvents: Array<keyof WindowEventMap> = ["wheel", "touchstart", "keydown", "pointerdown"];
  cancelEvents.forEach((evt) => window.addEventListener(evt, cancel, { passive: true }));

  const step = (time: number) => {
    if (cancelled) return;
    if (lastTime === null) lastTime = time;
    const dtSeconds = (time - lastTime) / 1000;
    lastTime = time;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 1) return;

    window.scrollBy(0, AUTO_SCROLL_SPEED_PX_PER_SEC * dtSeconds);
    rafId = window.requestAnimationFrame(step);
  };
  rafId = window.requestAnimationFrame(step);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(rafId);
    cancelEvents.forEach((evt) => window.removeEventListener(evt, cancel));
  };
};

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

    // Once the reveal text has finished writing itself in, ease the page
    // into a slow, smooth, continuous crawl all the way to the bottom of
    // the site — it stops itself the moment the guest takes over scrolling.
    let autoScrollTimeout: number | undefined;
    let cancelAutoScroll: (() => void) | undefined;
    tl.eventCallback("onComplete", () => {
      if (reducedMotionRef.current) return;
      autoScrollTimeout = window.setTimeout(() => {
        cancelAutoScroll = startSmoothAutoScrollToBottom();
      }, 900);
    });

    return () => {
      window.clearTimeout(autoScrollTimeout);
      cancelAutoScroll?.();
    };
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
      {/* door video (paused at frame 0 until the third knock) */}
      <video
        ref={doorVideoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/door.mp4"
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
            : "bg-[linear-gradient(to_top,_rgba(74,59,50,0.45)_0%,_transparent_35%)]"
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
              <p className="font-ui text-base text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)] sm:text-lg">
                {COPY.doorKnockHint}
              </p>
              <div className="flex items-center gap-3">
                {Array.from({ length: KNOCKS_NEEDED }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full border border-white transition-colors duration-300 ${
                      i < knocks ? "bg-white" : "bg-transparent"
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
