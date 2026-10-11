type SmileyProps = {
  size?: number;
  wink?: boolean;
  fangs?: boolean;
  spicy?: boolean;
  /** Cara verde (hoja). Se ignora si `spicy`. */
  vegan?: boolean;
  className?: string;
};

const ink = "#0A0A0A";
const flames = [
  "M64 -6 Q54 -18 64 -30 Q74 -42 64 -54",
  "M100 -12 Q90 -26 100 -40 Q110 -54 100 -68",
  "M136 -6 Q126 -18 136 -30 Q146 -42 136 -54",
];

/** Cada parte es un <g> con clase `smiley-*` para poder animarla después. */
export function Smiley({ size = 240, wink = false, fangs = true, spicy = false, vegan = false, className }: SmileyProps) {
  const winking = wink && !spicy;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      <circle className="smiley-face" cx="100" cy="100" r="94" fill={spicy ? "#E4002B" : vegan ? "#1F9D55" : "#FFD400"} stroke={ink} strokeWidth="7" />

      {!spicy && (
        <>
          <g className="smiley-eye-left">
            {winking ? (
              <path d="M58 84 Q72 66 86 84" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" />
            ) : (
              <ellipse cx="72" cy="80" rx="11" ry="19" fill={ink} />
            )}
          </g>
          <g className="smiley-eye-right">
            <ellipse cx="128" cy="80" rx="11" ry="19" fill={ink} />
          </g>
        </>
      )}

      {spicy && (
        <>
          <g className="smiley-eyes" fill="none" stroke={ink} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            <path d="M56 64 L84 80 L56 96" />
            <path d="M144 64 L116 80 L144 96" />
          </g>
          <g className="smiley-brows" fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round">
            <path d="M50 42 Q66 34 82 44" />
            <path d="M150 42 Q134 34 118 44" />
          </g>
        </>
      )}

      {!spicy && !fangs && (
        <g className="smiley-mouth">
          <path d="M52 118 Q100 168 148 118" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" />
        </g>
      )}

      {!spicy && fangs && (
        <>
          <g className="smiley-mouth">
            <path d="M46 112 Q100 178 154 112 Q100 140 46 112 Z" fill={ink} stroke={ink} strokeWidth="6" strokeLinejoin="round" />
          </g>
          <g className="smiley-fangs" fill="#FFFFFF" stroke={ink} strokeWidth="3.5" strokeLinejoin="round">
            <path d="M66 120.5 L89 125.6 L78 150 Z" />
            <path d="M111 125.6 L134 120.5 L122 150 Z" />
          </g>
        </>
      )}

      {spicy && (
        <>
          <g className="smiley-mouth">
            <path d="M40 104 Q100 196 160 104 Q100 128 40 104 Z" fill={ink} stroke={ink} strokeWidth="6" strokeLinejoin="round" />
          </g>
          <g className="smiley-fangs" fill="#FFFFFF" stroke={ink} strokeWidth="3.5" strokeLinejoin="round">
            <path d="M60 112.5 L84 119 L73 146 Z" />
            <path d="M116 119 L140 112.5 L127 146 Z" />
          </g>
          <g className="smiley-sweat">
            <path d="M170 46 Q182 66 176 76 Q168 84 160 76 Q156 66 170 46 Z" fill="#FFFFFF" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          </g>
          <g className="smiley-flames" fill="none" stroke="#E4002B" strokeWidth="9" strokeLinecap="round">
            {flames.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </>
      )}
    </svg>
  );
}
