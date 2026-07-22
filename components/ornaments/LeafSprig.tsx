type LeafSprigProps = {
  size?: number;
  className?: string;
};

/** A small twin-leaf sprig, in the same warm gold used for the garden arch's foliage. */
export default function LeafSprig({ size = 16, className = "" }: LeafSprigProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <g fill="var(--color-gold-light)">
        <ellipse cx="9" cy="10" rx="4.4" ry="7" transform="rotate(-25 9 10)" />
        <ellipse cx="15" cy="14" rx="4.4" ry="7" transform="rotate(25 15 14)" />
      </g>
      <path d="M12 6 V18" stroke="var(--color-gold-deep)" strokeWidth="0.7" opacity="0.5" />
    </svg>
  );
}
