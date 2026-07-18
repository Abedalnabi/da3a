type CornerFlourishProps = {
  className?: string;
};

/** A single decorative rose corner flourish, rotated per-corner via className. */
export default function CornerFlourish({ className = "" }: CornerFlourishProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      width="32"
      height="32"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 2 C 2 20, 2 40, 2 58 M2 2 C 20 2, 40 2, 58 2"
        fill="none"
        stroke="var(--color-rose)"
        strokeWidth="1.25"
        opacity="0.7"
      />
      <path
        d="M2 14 Q 14 14, 14 2"
        fill="none"
        stroke="var(--color-rose-light)"
        strokeWidth="1"
        opacity="0.9"
      />
      <circle cx="2" cy="2" r="2.5" fill="var(--color-rose)" />
    </svg>
  );
}
