type HeartPetalProps = {
  size?: number;
  className?: string;
  tone?: "rose" | "gold";
};

/** A small filled heart, mixed in among the falling petals and leaves. */
export default function HeartPetal({ size = 14, className = "", tone = "rose" }: HeartPetalProps) {
  const fill = tone === "gold" ? "var(--color-gold-light)" : "var(--color-rose-light)";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 21s-6.7-4.35-9.3-8.28C1.1 10.5 1.5 7.3 4 5.6c2-1.4 4.4-.9 5.8.9L12 8.8l2.2-2.3c1.4-1.8 3.8-2.3 5.8-.9 2.5 1.7 2.9 4.9 1.3 7.12C18.7 16.65 12 21 12 21z"
        fill={fill}
      />
    </svg>
  );
}
