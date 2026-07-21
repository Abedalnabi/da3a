"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Monogram from "../ornaments/Monogram";
import Divider from "../ornaments/Divider";
import { COPY, WEDDING } from "@/lib/wedding";
import { useScrollReveal } from "@/lib/useScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef, ".footer-reveal", { start: "top 80%" });

  // Draw the monogram's two rings on from the top as the footer arrives — the
  // closing flourish of the page. Runs once; reduced motion leaves the rings
  // already whole (dasharray/offset never applied).
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".monogram-ring",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          stagger: 0.25,
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="footer" ref={rootRef} className="px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
        <div className="footer-reveal">
          <Monogram size={72} />
        </div>
        <Divider className="footer-reveal" />
        <p className="footer-reveal font-display text-2xl leading-relaxed text-gradient-rose sm:text-3xl">
          {COPY.footerQuote}
        </p>
        <p className="footer-reveal font-ui text-sm tracking-widest text-brown">
          {WEDDING.groomFatherName} &amp; {WEDDING.brideFatherName}
        </p>
      </div>
    </footer>
  );
}
