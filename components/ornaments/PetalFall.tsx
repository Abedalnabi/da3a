"use client";

import { useMemo } from "react";
import FlowerIcon from "./FlowerIcon";
import PetalSingle from "./PetalSingle";
import LeafSprig from "./LeafSprig";
import Sparkle from "./Sparkle";
import HeartPetal from "./HeartPetal";

// A mix of blossoms, petals, leaves, sparkles and hearts in both the rose and
// gold tones already used elsewhere on the page, so the fall reads as varied
// instead of the same three silhouettes repeating.
export const SHAPES: Array<(size: number) => React.ReactNode> = [
  (size) => <FlowerIcon size={size} tone="rose" />,
  (size) => <FlowerIcon size={size} tone="gold" />,
  (size) => <PetalSingle size={size} tone="rose" />,
  (size) => <PetalSingle size={size} tone="gold" />,
  (size) => <LeafSprig size={size} />,
  (size) => <Sparkle size={size} tone="gold" />,
  (size) => <HeartPetal size={size} tone="rose" />,
];

type Petal = {
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

const PETAL_COUNT = 25;

function generatePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, () => {
    // A single "depth" roll ties size, opacity and speed together so petals
    // read as nearer/larger/faster or farther/smaller/slower, instead of
    // varying independently and looking like random noise.
    const depth = Math.random();
    return {
      render: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      left: `${Math.random() * 100}%`,
      size: 8 + depth * 13,
      duration: 24 - depth * 10 + Math.random() * 4,
      delay: Math.random() * -26,
      drift: (Math.random() - 0.5) * 150,
      sway: 14 + Math.random() * 26,
      opacity: 0.3 + depth * 0.35,
      spin: Math.random() > 0.5 ? 360 : -360,
    };
  });
}

/** Blossoms, loose petals and leaf sprigs drifting continuously from the top of the viewport to the bottom, independent of scroll position. */
export default function PetalFall() {
  const petals = useMemo(generatePetals, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
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
          {petal.render(petal.size)}
        </span>
      ))}
    </div>
  );
}
