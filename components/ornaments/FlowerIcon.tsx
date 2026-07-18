type FlowerIconProps = {
  size?: number;
  className?: string;
};

/** Small five-petal blossom used throughout as a scattered decorative motif. */
export default function FlowerIcon({ size = 20, className = "" }: FlowerIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <g fill="var(--color-rose-light)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="12" cy="6.5" rx="3.1" ry="4.6" transform={`rotate(${angle} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2" fill="var(--color-rose)" />
    </svg>
  );
}
