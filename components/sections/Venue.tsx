"use client";

import { useRef } from "react";
import Divider from "../ornaments/Divider";
import { COPY, WEDDING } from "@/lib/wedding";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function Venue() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef, ".venue-reveal");

  return (
    <section id="venue" ref={rootRef} className="relative px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="venue-reveal font-display text-3xl leading-[1.35] pb-2 text-gradient-rose sm:text-5xl">
          {COPY.venueTitle}
        </h2>
        <Divider className="venue-reveal mt-6" />

        <div className="venue-reveal mt-12 flex w-full flex-col items-center gap-3">
          <p className="font-display text-2xl leading-[1.35] pb-1 text-ink sm:text-3xl">{WEDDING.venueName}</p>
          <p className="font-ui text-base text-brown">{WEDDING.venueAddress}</p>

          <a
            href={WEDDING.mapsQuery}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-cta mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-rose to-rose-deep px-8 py-3 font-ui text-sm font-medium text-card shadow-[0_12px_26px_-12px_rgba(var(--rgb-rose-deep),0.9)] ring-1 ring-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s7-6.6 7-11.6A7 7 0 0 0 5 9.4C5 14.4 12 21 12 21ZM12 12a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z" />
            </svg>
            {COPY.venueMapCta}
          </a>
        </div>
      </div>
    </section>
  );
}
