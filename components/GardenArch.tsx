import FlowerIcon from "./ornaments/FlowerIcon";

type GardenArchProps = {
  className?: string;
};

const VINE_T = Array.from({ length: 9 }, (_, i) => i / 8);

/** Point along the arch path (a shallow semi-ellipse spanning the two columns), used to lay out vine blossoms. */
function archPoint(t: number) {
  const x = 44 + t * (276 - 44);
  const y = 96 - Math.sin(t * Math.PI) * 70;
  return { x, y };
}

/** An original illustrated garden scene — arch, columns, rose vines and a tiered fountain — in the invitation's cream/rose palette. */
export default function GardenArch({ className = "" }: GardenArchProps) {
  return (
    <svg
      viewBox="0 0 320 480"
      className={className}
      role="img"
      aria-label="قوسٌ من الورد ونافورة الحديقة"
    >
      <defs>
        <linearGradient id="garden-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d9e8f2" />
          <stop offset="55%" stopColor="#f1e6d6" />
          <stop offset="100%" stopColor="var(--color-cream)" />
        </linearGradient>
        <linearGradient id="garden-stone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3e9d8" />
          <stop offset="100%" stopColor="#d8c3a0" />
        </linearGradient>
        <radialGradient id="garden-ground" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="#e9d3ba" />
          <stop offset="100%" stopColor="#e9d3ba" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="320" height="480" fill="url(#garden-sky)" />

      {/* distant foliage */}
      <g opacity="0.35">
        <ellipse cx="60" cy="120" rx="70" ry="34" fill="#9caf7f" />
        <ellipse cx="260" cy="128" rx="66" ry="30" fill="#9caf7f" />
      </g>

      {/* ground */}
      <ellipse cx="160" cy="430" rx="150" ry="60" fill="url(#garden-ground)" />

      {/* arch */}
      <path
        d="M44 420 V96 Q44 26 160 26 Q276 26 276 96 V420"
        fill="none"
        stroke="url(#garden-stone)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M44 420 V96 Q44 26 160 26 Q276 26 276 96 V420"
        fill="none"
        stroke="var(--color-rose-light)"
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.12"
      />

      {/* rose vine along the arch */}
      {VINE_T.map((t) => {
        const { x, y } = archPoint(t);
        const size = 15 + (t % 0.5) * 6;
        return (
          <g key={t} transform={`translate(${x - size / 2}, ${y - size / 2})`}>
            <FlowerIcon size={size} />
          </g>
        );
      })}

      {/* fountain */}
      <g>
        <ellipse cx="160" cy="410" rx="58" ry="14" fill="var(--color-rose-deep)" opacity="0.15" />
        <path d="M110 400 Q160 412 210 400 L204 388 Q160 398 116 388 Z" fill="url(#garden-stone)" />
        <rect x="150" y="330" width="20" height="60" fill="url(#garden-stone)" />
        <ellipse cx="160" cy="330" rx="46" ry="11" fill="url(#garden-stone)" />
        <rect x="155" y="300" width="10" height="32" fill="url(#garden-stone)" />
        <ellipse cx="160" cy="300" rx="26" ry="8" fill="url(#garden-stone)" />

        {/* water arcs */}
        <g stroke="#bcd6e6" strokeWidth="2" fill="none" opacity="0.75">
          <path d="M160 300 Q140 320 138 330" />
          <path d="M160 300 Q180 320 182 330" />
          <path d="M160 300 Q160 322 160 332" />
        </g>

        {/* resting doves */}
        <g fill="var(--color-card)" stroke="var(--color-brown)" strokeWidth="1">
          <path d="M148 296 q-8 -6 -14 -2 q4 2 4 6 q6 0 10 -4Z" />
          <path d="M172 296 q8 -6 14 -2 q-4 2 -4 6 q-6 0 -10 -4Z" />
        </g>
      </g>

      {/* foreground petals */}
      <g opacity="0.55">
        <g transform="translate(30, 360)">
          <FlowerIcon size={14} />
        </g>
        <g transform="translate(276, 340)">
          <FlowerIcon size={12} />
        </g>
        <g transform="translate(20, 420)">
          <FlowerIcon size={16} />
        </g>
        <g transform="translate(286, 400)">
          <FlowerIcon size={14} />
        </g>
      </g>
    </svg>
  );
}
