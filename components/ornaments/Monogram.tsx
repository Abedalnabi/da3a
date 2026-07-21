import { WEDDING } from "@/lib/wedding";

type MonogramProps = {
  size?: number;
  className?: string;
  glow?: boolean;
};

export default function Monogram({ size = 120, className = "", glow = false }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`شعار ${WEDDING.groom} و${WEDDING.bride}`}
    >
      <defs>
        <radialGradient id="monogram-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-rose-light)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-rose-light)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="monogram-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-rose-deep)" />
          <stop offset="50%" stopColor="var(--color-rose)" />
          <stop offset="100%" stopColor="var(--color-brown-deep)" />
        </linearGradient>
        <linearGradient id="monogram-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-gold-deep)" />
          <stop offset="50%" stopColor="var(--color-gold-light)" />
          <stop offset="100%" stopColor="var(--color-gold-deep)" />
        </linearGradient>
      </defs>

      {glow && <circle cx="100" cy="100" r="95" fill="url(#monogram-glow)" />}

      {/* pathLength=1 normalizes each ring's length to 1 so a dasharray/offset
          of 1 hides it exactly, letting GSAP draw it on from the top. */}
      <circle
        className="monogram-ring"
        cx="100"
        cy="100"
        r="88"
        pathLength={1}
        fill="none"
        stroke="url(#monogram-gold)"
        strokeWidth="1.5"
      />
      <circle
        className="monogram-ring"
        cx="100"
        cy="100"
        r="76"
        pathLength={1}
        fill="none"
        stroke="url(#monogram-ring)"
        strokeWidth="1"
        opacity="0.6"
      />

      {[0, 90, 180, 270].map((angle) => (
        <circle
          key={angle}
          cx={100 + 88 * Math.cos((angle * Math.PI) / 180)}
          cy={100 + 88 * Math.sin((angle * Math.PI) / 180)}
          r="2.5"
          fill="var(--color-gold)"
        />
      ))}

      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontFamily="var(--font-numeral)"
        fontSize="56"
        fill="url(#monogram-ring)"
      >
        M &amp; R
      </text>
    </svg>
  );
}
