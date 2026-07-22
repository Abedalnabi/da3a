type PetalSingleProps = {
  size?: number;
  className?: string;
  tone?: "rose" | "gold";
};

/** A single loose petal — as if it drifted off the five-petal blossom on its own. */
export default function PetalSingle({ size = 16, className = "", tone = "rose" }: PetalSingleProps) {
  const fill = tone === "gold" ? "var(--color-gold-light)" : "var(--color-rose-light)";
  const vein = tone === "gold" ? "var(--color-gold-deep)" : "var(--color-rose)";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M12 3 C17 7 18 14 12 21 C6 14 7 7 12 3 Z" fill={fill} />
      <path d="M12 5 Q13.5 12 12 19" stroke={vein} strokeWidth="0.6" fill="none" opacity="0.55" />
    </svg>
  );
}
