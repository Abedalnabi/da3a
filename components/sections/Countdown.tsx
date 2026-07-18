"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Divider from "../ornaments/Divider";
import { toEasternArabicNumerals } from "@/lib/numerals";
import { COPY, COUNTDOWN_LABELS, WEDDING } from "@/lib/wedding";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function computeTimeLeft(): TimeLeft {
  const diff = new Date(WEDDING.isoDateTime).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  const [displayValue, setDisplayValue] = useState(padded);
  const [fading, setFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (padded === displayValue) return;
    setFading(true);
    timeoutRef.current = setTimeout(() => {
      setDisplayValue(padded);
      setFading(false);
    }, 200);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [padded, displayValue]);

  return (
    <div className="glass-panel relative flex w-full min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-4 sm:gap-2 sm:px-3 sm:py-7">
      <div className="flex h-10 items-center justify-center sm:h-20">
        <span
          className={`font-ui text-2xl font-semibold text-rose-deep transition-opacity duration-200 ease-out sm:text-5xl ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {toEasternArabicNumerals(displayValue)}
        </span>
      </div>
      <span className="whitespace-nowrap font-ui text-[10px] tracking-wide text-brown sm:text-sm">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTime(computeTimeLeft());
    const id = setInterval(() => setTime(computeTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".countdown-reveal", {
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
    <section id="countdown" ref={rootRef} className="relative px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="countdown-reveal font-display text-3xl leading-[1.35] text-gradient-rose sm:text-5xl">
          {COPY.countdownTitle}
        </h2>
        <Divider className="countdown-reveal mt-6" />

        {time?.done ? (
          <p className="mt-14 font-body text-2xl text-brown-deep">{COPY.countdownDone}</p>
        ) : (
          <div className="countdown-reveal mt-14 grid w-full grid-cols-4 gap-2 sm:gap-6">
            <CountdownUnit value={time?.days ?? 0} label={COUNTDOWN_LABELS.days} />
            <CountdownUnit value={time?.hours ?? 0} label={COUNTDOWN_LABELS.hours} />
            <CountdownUnit value={time?.minutes ?? 0} label={COUNTDOWN_LABELS.minutes} />
            <CountdownUnit value={time?.seconds ?? 0} label={COUNTDOWN_LABELS.seconds} />
          </div>
        )}
      </div>
    </section>
  );
}
