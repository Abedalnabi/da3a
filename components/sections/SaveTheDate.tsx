"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Divider from "../ornaments/Divider";
import { buildGoogleCalendarUrl, buildIcsDataUrl } from "@/lib/calendar";
import { COPY, WEDDING } from "@/lib/wedding";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SaveTheDate() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".save-date-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="save-the-date" ref={rootRef} className="relative px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="save-date-reveal font-display text-3xl leading-[1.35] pb-2 text-gradient-rose sm:text-5xl">
          {COPY.saveTheDateTitle}
        </h2>
        <Divider className="save-date-reveal mt-6" />

        <div className="save-date-reveal glass-panel mt-14 w-full max-w-xs overflow-hidden rounded-3xl">
          <div className="bg-gradient-to-b from-rose-deep to-rose px-6 py-4 text-center">
            <p className="font-ui text-sm tracking-wide text-card">{WEDDING.monthLabel}</p>
          </div>
          <div className="flex w-full flex-col items-center gap-1 px-6 py-8 text-center">
            <p className="font-ui text-brown">{WEDDING.dayName}</p>
            <p className="w-full font-numeral text-7xl font-bold leading-none tabular-nums lining-nums text-rose">
              {WEDDING.dayNumber}
            </p>
            <p className="font-ui text-ink">{WEDDING.timeLabel}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
