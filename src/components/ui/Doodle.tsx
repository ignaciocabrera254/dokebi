const shapes = {
  star: {
    viewBox: "0 0 100 100",
    d: "M50 6 L61 38 L95 39 L68 59 L78 92 L50 72 L22 92 L32 59 L5 39 L39 38 Z",
  },
  crown: {
    viewBox: "0 0 100 100",
    d: "M10 75 L18 30 L38 55 L50 18 L62 55 L82 30 L90 75 Z M10 86 L90 86",
  },
  squiggle: {
    viewBox: "0 0 200 60",
    d: "M6 34 C 26 4, 44 58, 64 30 S 102 4, 122 30 S 162 58, 194 22",
  },
  sparkle: {
    viewBox: "0 0 100 100",
    d: "M50 5 Q55 45 95 50 Q55 55 50 95 Q45 55 5 50 Q45 45 50 5 Z",
  },
} as const;

type DoodleProps = {
  variant: keyof typeof shapes;
  /** Ancho en px; el alto sale de la proporción del viewBox. */
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
};

/** pathLength=400 fijo para animar el trazo con stroke-dashoffset (etapa 3). */
export function Doodle({
  variant,
  size = 100,
  stroke = "#0A0A0A",
  fill = "none",
  strokeWidth = 5,
  className,
}: DoodleProps) {
  const { viewBox, d } = shapes[variant];
  const [, , w, h] = viewBox.split(" ").map(Number);
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      width={size}
      height={Math.round((size * h) / w)}
      className={className}
    >
      <path
        className="doodle-path"
        pathLength={400}
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
