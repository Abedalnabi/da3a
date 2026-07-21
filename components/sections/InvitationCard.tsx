"use client";

import { useRef } from "react";
import Divider from "../ornaments/Divider";
import FlowerIcon from "../ornaments/FlowerIcon";
import { COPY, WEDDING } from "@/lib/wedding";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function InvitationCard() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef, ".invitation-reveal", { stagger: 0.18 });

  return (
    <section id="invitation" ref={rootRef} className="relative px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="invitation-reveal w-full">
          <p className="font-display text-2xl leading-[1.35] pb-2 text-gradient-rose sm:text-3xl">
            بسم الله الرحمن الرحيم
          </p>
          <FlowerIcon size={18} className="mx-auto mt-4" />
          <p className="mt-4 font-body text-2xl leading-loose text-rose-deep sm:text-3xl">
            {COPY.invitationVerse}
          </p>
        </div>

        <Divider className="invitation-reveal mt-14" />

        <h2 className="invitation-reveal mt-8 font-display text-3xl leading-[1.35] text-gradient-rose sm:text-5xl">
          {COPY.invitationTitle}
        </h2>

        <p className="invitation-reveal mt-6 max-w-xl font-body text-lg leading-relaxed text-brown-deep sm:text-xl">
          {COPY.invitationBody}
        </p>

        <div className="invitation-reveal mt-10 flex items-center justify-center gap-6 sm:gap-10">
          <div className="text-center">
            <span className="font-ui text-sm text-rose-deep">{COPY.invitationGroomFamily}</span>
            <p className="mt-1 font-display text-xl leading-[1.35] pb-1 text-ink sm:text-2xl">
              {WEDDING.groomFatherName}
            </p>
          </div>
          <span aria-hidden="true" className="text-xl text-rose">
            ♥
          </span>
          <div className="text-center">
            <span className="font-ui text-sm text-rose-deep">{COPY.invitationBrideFamily}</span>
            <p className="mt-1 font-display text-xl leading-[1.35] pb-1 text-ink sm:text-2xl">
              {WEDDING.brideFatherName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
