import FlowerIcon from "./FlowerIcon";

const POSITIONS = [
  { top: "6%", left: "5%", size: 26, delay: "0s", anim: "animate-float-slow" },
  { top: "14%", right: "8%", size: 18, delay: "1.2s", anim: "animate-float-slower" },
  { top: "34%", left: "11%", size: 16, delay: "2s", anim: "animate-float-slower" },
  { top: "46%", right: "5%", size: 22, delay: "0.6s", anim: "animate-float-slow" },
  { top: "62%", left: "7%", size: 20, delay: "1.6s", anim: "animate-float-slow" },
  { top: "74%", right: "10%", size: 16, delay: "0.9s", anim: "animate-float-slower" },
  { bottom: "18%", left: "14%", size: 18, delay: "0.3s", anim: "animate-float-slower" },
  { bottom: "8%", right: "6%", size: 24, delay: "1.4s", anim: "animate-float-slow" },
];

/** Purely decorative scattered blossom motifs, absolutely positioned within a relative ancestor. */
export default function FloatingFlowers({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {POSITIONS.map((pos, i) => (
        <div
          key={i}
          className={`absolute opacity-40 ${pos.anim}`}
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            animationDelay: pos.delay,
          }}
        >
          <FlowerIcon size={pos.size} />
        </div>
      ))}
    </div>
  );
}
