type SparkleProps = {
  size?: number;
  className?: string;
  tone?: "rose" | "gold";
};

/** A small four-point twinkle, used among the falling petals for a touch of shimmer. */
export default function Sparkle({ size = 14, className = "", tone = "gold" }: SparkleProps) {
  const fill = tone === "gold" ? "var(--color-gold-light)" : "var(--color-rose-light)";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 2 C12.8 7 13 10.2 22 12 C13 13.8 12.8 17 12 22 C11.2 17 11 13.8 2 12 C11 10.2 11.2 7 12 2 Z"
        fill={fill}
      />
    </svg>
  );
}
