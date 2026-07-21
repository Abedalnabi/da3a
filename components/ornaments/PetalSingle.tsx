type PetalSingleProps = {
  size?: number;
  className?: string;
};

/** A single loose petal — as if it drifted off the five-petal blossom on its own. */
export default function PetalSingle({ size = 16, className = "" }: PetalSingleProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="5.5" ry="9" fill="var(--color-rose-light)" />
      <path d="M12 4 Q13.5 12 12 20" stroke="var(--color-rose)" strokeWidth="0.6" fill="none" opacity="0.6" />
    </svg>
  );
}
