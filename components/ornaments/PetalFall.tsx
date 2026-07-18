"use client";

import { useMemo } from "react";
import FlowerIcon from "./FlowerIcon";

type Petal = {
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  spin: number;
};

const PETAL_COUNT = 14;

function generatePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, () => ({
    left: `${Math.random() * 100}%`,
    size: 12 + Math.random() * 14,
    duration: 16 + Math.random() * 12,
    delay: Math.random() * -26,
    drift: (Math.random() - 0.5) * 140,
    opacity: 0.3 + Math.random() * 0.35,
    spin: Math.random() > 0.5 ? 360 : -360,
  }));
}

/** Purple blossoms drifting continuously from the top of the viewport to the bottom, independent of scroll position. */
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
              "--petal-spin": `${petal.spin}deg`,
            } as React.CSSProperties
          }
        >
          <FlowerIcon size={petal.size} />
        </span>
      ))}
    </div>
  );
}
