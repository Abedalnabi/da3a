"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Divider from "../ornaments/Divider";
import FlowerIcon from "../ornaments/FlowerIcon";
import { toEasternArabicNumerals } from "@/lib/numerals";
import { COPY, PROGRAM_ITEMS } from "@/lib/wedding";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Program() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".program-item", {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
      });

      const list = listRef.current;
      const flower = flowerRef.current;
      const line = lineRef.current;
      if (!list || !flower) return;

      const markers = list.querySelectorAll<HTMLElement>(".program-marker");
      if (markers.length < 2) return;

      // Center Y (relative to the list) of each dot, so the flower can snap to them.
      let centers: number[] = [];
      const measure = () => {
        const listTop = list.getBoundingClientRect().top;
        centers = Array.from(markers).map((m) => {
          const r = m.getBoundingClientRect();
          return r.top + r.height / 2 - listTop;
        });
        // Stretch the connecting line so it runs straight from the first to the last dot.
        if (line) {
          line.style.top = `${centers[0]}px`;
          line.style.height = `${centers[centers.length - 1] - centers[0]}px`;
        }
      };

      measure();
      gsap.set(flower, { xPercent: -50, yPercent: -50, y: centers[0] });

      let activeIndex = 0;
      ScrollTrigger.create({
        trigger: list,
        start: "top 60%",
        end: "bottom 50%",
        invalidateOnRefresh: true,
        onRefresh: measure,
        onUpdate: (self) => {
          // Snap to the nearest of the 4 dots based on scroll progress.
          const nextIndex = Math.round(self.progress * (centers.length - 1));
          if (nextIndex !== activeIndex) {
            activeIndex = nextIndex;
            gsap.to(flower, {
              y: centers[nextIndex],
              duration: 0.45,
              ease: "power2.out",
              overwrite: true,
            });
          }
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    
    <section id="program" ref={rootRef} className="relative px-6 py-14 sm:py-20">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h2 className="font-display text-3xl leading-[1.35] pb-2 text-gradient-rose sm:text-5xl">{COPY.programTitle}</h2>
        <p className="mt-4 font-body text-lg text-brown-deep sm:text-xl">{COPY.programSubtitle}</p>
        <Divider className="mt-6" />

        <ul ref={listRef} className="relative mt-14 w-full">
          <span
            ref={lineRef}
            aria-hidden="true"
            className="absolute left-1/2 w-px -translate-x-1/2 bg-rose/40"
          />

          {/* traveling flower marker, positioned by scroll */}
          <div
            ref={flowerRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-20 drop-shadow-[0_2px_6px_rgba(125,86,148,0.35)]"
          >
            <FlowerIcon size={26} />
          </div>

          {PROGRAM_ITEMS.map((item) => (
            <li key={item.label} className="program-item relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5">
              <span className="whitespace-nowrap text-right font-ui text-base text-ink sm:text-lg">{item.label}</span>
              <span className="program-marker relative z-10 flex h-4 w-4 items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-rose ring-4 ring-cream" />
              </span>
              <span className="whitespace-nowrap text-left font-ui text-lg text-brown-deep sm:text-xl">
                {toEasternArabicNumerals(item.time)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
