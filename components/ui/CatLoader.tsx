/**
 * The RedCat cat running with a parcel on its back. Used wherever something is loading.
 * Pure SVG + CSS (see .rc-cat-* in globals.css); stands still for reduced motion.
 */
export default function CatLoader({
  label = "Loading…",
  className = "",
  width = 150,
}: {
  label?: string;
  className?: string;
  width?: number;
}) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center gap-2 text-ink ${className}`}>
      <svg viewBox="0 0 200 120" width={width} aria-hidden className="overflow-visible">
        {/* speed lines */}
        <g className="rc-cat-speed" stroke="#090908" strokeWidth="3.5" strokeLinecap="round">
          <line x1="14" y1="54" x2="36" y2="54" />
          <line x1="22" y1="70" x2="40" y2="70" />
          <line x1="10" y1="86" x2="30" y2="86" />
        </g>
        {/* ground */}
        <line className="rc-cat-ground" x1="24" y1="110" x2="192" y2="110" stroke="#090908" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 10" />
        <ellipse className="rc-cat-shadow" cx="112" cy="110" rx="46" ry="4" fill="#090908" opacity="0.14" />

        <g className="rc-cat-body">
          {/* far legs (lighter for depth) */}
          <line className="rc-leg rc-leg-b" x1="82" y1="78" x2="82" y2="102" stroke="#3a3a38" strokeWidth="8" strokeLinecap="round" />
          <line className="rc-leg rc-leg-a" x1="124" y1="78" x2="124" y2="102" stroke="#3a3a38" strokeWidth="8" strokeLinecap="round" />

          {/* tail */}
          <path className="rc-cat-tail" d="M70 70 C 50 68, 42 50, 52 32" fill="none" stroke="#090908" strokeWidth="8" strokeLinecap="round" />

          {/* body + neck */}
          <ellipse cx="104" cy="72" rx="38" ry="17" fill="#090908" />
          <ellipse cx="136" cy="64" rx="13" ry="13" fill="#090908" />

          {/* near legs */}
          <line className="rc-leg rc-leg-a" x1="76" y1="80" x2="76" y2="104" stroke="#090908" strokeWidth="8" strokeLinecap="round" />
          <line className="rc-leg rc-leg-b" x1="130" y1="80" x2="130" y2="104" stroke="#090908" strokeWidth="8" strokeLinecap="round" />

          {/* the parcel */}
          <g className="rc-cat-box">
            <rect x="80" y="28" width="40" height="30" rx="4" fill="#ff4d4d" stroke="#090908" strokeWidth="3.5" />
            <line x1="100" y1="29" x2="100" y2="57" stroke="#090908" strokeOpacity="0.35" strokeWidth="3" />
            <rect x="105" y="45" width="10" height="7" rx="1.5" fill="#fff" />
          </g>

          {/* head */}
          <g className="rc-cat-head">
            <path d="M134 44 L137 20 L152 36 Z" fill="#090908" />
            <path d="M150 36 L167 20 L168 46 Z" fill="#090908" />
            <path d="M138 38 L139.5 27 L147 35 Z" fill="#ff4d4d" />
            <path d="M156 35 L164 27 L164.5 40 Z" fill="#ff4d4d" />
            <circle cx="151" cy="52" r="19" fill="#090908" />
            <circle cx="144" cy="50" r="6" fill="#fff" />
            <circle cx="159" cy="50" r="6" fill="#fff" />
            <circle className="rc-cat-pupil" cx="146" cy="50" r="3" fill="#090908" />
            <circle className="rc-cat-pupil" cx="161" cy="50" r="3" fill="#090908" />
            <rect x="149" y="59" width="5" height="3.5" rx="1.5" fill="#fff" />
          </g>
        </g>
      </svg>
      {label && <p className="text-sm font-bold tracking-tight">{label}</p>}
    </div>
  );
}
