"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Monogram from "../ornaments/Monogram";
import Divider from "../ornaments/Divider";
import { COPY, WEDDING } from "@/lib/wedding";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}



export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-reveal", {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="footer" ref={rootRef} className="">
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
        <p className="footer-reveal font-ui text-sm tracking-widest text-rose-deep"></p>

     
      </div>
    </footer>
  );
}
