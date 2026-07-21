"use client";

import { useRef } from "react";
import Monogram from "../ornaments/Monogram";
import Divider from "../ornaments/Divider";
import { COPY, WEDDING } from "@/lib/wedding";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef, ".footer-reveal", { start: "top 80%" });

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
