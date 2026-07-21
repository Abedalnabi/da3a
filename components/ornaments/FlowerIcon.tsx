type FlowerIconProps = {
  size?: number;
  className?: string;
  /** Rose is the everyday scattered motif; gold marks the deliberate accents
      (dividers, monogram) so the gold reads as intentional, not random. */
  tone?: "rose" | "gold";
};

/** Small five-petal blossom used throughout as a scattered decorative motif. */
export default function FlowerIcon({ size = 20, className = "", tone = "rose" }: FlowerIconProps) {
  const petal = tone === "gold" ? "var(--color-gold-light)" : "var(--color-rose-light)";
  const center = tone === "gold" ? "var(--color-gold-deep)" : "var(--color-rose)";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <g fill={petal}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="12" cy="6.5" rx="3.1" ry="4.6" transform={`rotate(${angle} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2" fill={center} />
    </svg>
  );
}
