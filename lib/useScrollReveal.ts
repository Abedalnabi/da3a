"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollRevealOptions = {
  /** ScrollTrigger start position relative to the root. */
  start?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  /** Fade+slide+un-blur in, matching the door intro's hero reveal. */
  blur?: boolean;
};

/**
 * Fades/slides (and optionally un-blurs) `selector` into view the first time
 * `rootRef` crosses `start`. Shared by every section so they all get the same
 * scroll-reveal treatment from one place instead of a copy-pasted gsap.context.
 */
export function useScrollReveal(
  rootRef: RefObject<Element | null>,
  selector: string,
  options: ScrollRevealOptions = {}
) {
  const { start = "top 75%", y = 24, duration = 0.9, stagger = 0.15, blur = true } = options;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        autoAlpha: 0,
        y,
        ...(blur ? { filter: "blur(6px)" } : {}),
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [rootRef, selector, start, y, duration, stagger, blur]);
}
