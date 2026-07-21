"use client";

import { useRef } from "react";
import Divider from "../ornaments/Divider";
import FlowerIcon from "../ornaments/FlowerIcon";
import { COPY, NOTES_ITEMS } from "@/lib/wedding";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function Notes() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef, ".notes-reveal", { y: 20, duration: 0.8 });

  return (
    <section id="notes" ref={rootRef} className="relative px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="notes-reveal font-display text-3xl leading-[1.35] pb-2 text-gradient-rose sm:text-5xl">
          {COPY.notesTitle}
        </h2>
        <Divider className="notes-reveal mt-6" />

        <ul className="mt-12 flex w-full flex-col gap-5">
          {NOTES_ITEMS.map((note) => (
            <li key={note} className="notes-reveal flex items-center justify-center gap-3">
              <FlowerIcon size={16} className="shrink-0" />
              <span className="font-body text-lg text-brown-deep sm:text-xl">{note}</span>
            </li>
          ))}
        </ul>

        <div className="notes-reveal mt-14 flex flex-col items-center gap-2">
          <p className="font-ui text-sm tracking-wide text-brown">{COPY.contactTitle}</p>
          <p className="font-display text-xl text-ink">{COPY.contactPlaceholder}</p>
        </div>
      </div>
    </section>
  );
}
