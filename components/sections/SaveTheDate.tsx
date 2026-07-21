"use client";

import { useRef } from "react";
import Divider from "../ornaments/Divider";
import { buildGoogleCalendarUrl, buildIcsDataUrl } from "@/lib/calendar";
import { COPY, WEDDING } from "@/lib/wedding";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function SaveTheDate() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef, ".save-date-reveal");

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

        <div className="save-date-reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-rose to-rose-deep px-6 py-2.5 font-ui text-sm font-medium text-card shadow-[0_12px_26px_-12px_rgba(125,86,148,0.9)] transition hover:brightness-110"
          >
            <CalendarIcon />
            {COPY.addToGoogleCalendar}
          </a>
          <a
            href={buildIcsDataUrl()}
            download="wedding.ics"
            className="inline-flex items-center gap-2 rounded-full border border-rose/50 bg-card px-6 py-2.5 font-ui text-sm font-medium text-rose-deep transition hover:border-rose hover:bg-rose-light/20"
          >
            <CalendarIcon />
            {COPY.addToAppleCalendar}
          </a>
        </div>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" strokeLinecap="round" />
    </svg>
  );
}
