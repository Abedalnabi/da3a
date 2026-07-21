"use client";

import { useMemo } from "react";
import FlowerIcon from "./FlowerIcon";
import PetalSingle from "./PetalSingle";
import LeafSprig from "./LeafSprig";

const SHAPES = [FlowerIcon, PetalSingle, LeafSprig];

type Petal = {
  Shape: (typeof SHAPES)[number];
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  sway: number;
  opacity: number;
  spin: number;
};

const PETAL_COUNT = 16;

function generatePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, () => {
    // A single "depth" roll ties size, opacity and speed together so petals
    // read as nearer/larger/faster or farther/smaller/slower, instead of
    // varying independently and looking like random noise.
    const depth = Math.random();
    return {
      Shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      left: `${Math.random() * 100}%`,
      size: 10 + depth * 18,
      duration: 24 - depth * 10 + Math.random() * 4,
      delay: Math.random() * -26,
      drift: (Math.random() - 0.5) * 150,
      sway: 14 + Math.random() * 26,
      opacity: 0.18 + depth * 0.35,
      spin: Math.random() > 0.5 ? 360 : -360,
    };
  });
}

/** Blossoms, loose petals and leaf sprigs drifting continuously from the top of the viewport to the bottom, independent of scroll position. */
export default function PetalFall() {
  const petals = useMemo(generatePetals, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {petals.map((petal, i) => (
        <span
          key={i}
          className="animate-petal-fall absolute top-[-8%]"
          style={
            {
              left: petal.left,
              opacity: petal.opacity,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
              "--petal-drift": `${petal.drift}px`,
              "--petal-sway": `${petal.sway}px`,
              "--petal-spin": `${petal.spin}deg`,
            } as React.CSSProperties
          }
        >
          <petal.Shape size={petal.size} />
        </span>
      ))}
    </div>
  );
}
