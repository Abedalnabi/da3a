"use client";

import { useMemo } from "react";
import { SHAPES } from "./PetalFall";

type Riser = {
  render: (typeof SHAPES)[number];
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  sway: number;
  opacity: number;
  spin: number;
};

const RISER_COUNT = 16;

function generateRisers(): Riser[] {
  return Array.from({ length: RISER_COUNT }, () => {
    const depth = Math.random();
    return {
      render: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      left: `${Math.random() * 100}%`,
      size: 7 + depth * 10,
      duration: 26 - depth * 10 + Math.random() * 4,
      delay: Math.random() * -28,
      drift: (Math.random() - 0.5) * 130,
      sway: 12 + Math.random() * 22,
      opacity: 0.22 + depth * 0.28,
      spin: Math.random() > 0.5 ? 360 : -360,
    };
  });
}

/** Blossoms, petals, leaves, sparkles and hearts drifting upward from below the viewport, paired with PetalFall's downward drift. */
export default function PetalRise() {
  const risers = useMemo(generateRisers, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {risers.map((riser, i) => (
        <span
          key={i}
          className="animate-petal-rise absolute top-[108%]"
          style={
            {
              left: riser.left,
              opacity: riser.opacity,
              animationDuration: `${riser.duration}s`,
              animationDelay: `${riser.delay}s`,
              "--petal-drift": `${riser.drift}px`,
              "--petal-sway": `${riser.sway}px`,
              "--petal-spin": `${riser.spin}deg`,
            } as React.CSSProperties
          }
        >
          {riser.render(riser.size)}
        </span>
      ))}
    </div>
  );
}
