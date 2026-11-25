import "./dimension-pages.css";

export function DimensionDiagram({ sides, unit }: { sides: readonly number[]; unit: string }) {
  const size = (side: number) => `${side} ${unit}`;
  const is3D = sides.length === 3;
  const title = is3D
    ? `Dimension diagram. Length ${size(sides[0])}, width ${size(sides[1])}, height ${size(sides[2])}.`
    : `Dimension diagram. Width ${size(sides[0])}, height ${size(sides[1])}.`;
  const width = Math.min(215, Math.max(55, 114 * sides[0] / sides[1]));
  const height = Math.min(114, Math.max(52, 215 * sides[1] / sides[0]));
  const left = (350 - width) / 2;
  const top = (180 - height) / 2 + 9;

  return (
    <figure className="dimension-diagram">
      <svg viewBox="0 0 370 190" role="img" aria-label={title}>
        {is3D ? (
          <>
            <path className="dimension-solid" d="M76 78 124 41H292V128L244 164H76Z" />
            <path className="dimension-plane" d="M76 78 124 41H292L244 78Z" />
            <path className="dimension-plane" d="M244 78 292 41V128L244 164Z" />
            <path className="dimension-edge" d="M76 78H244V164M124 41 76 78" />
            <text x="160" y="184" textAnchor="middle">Length {size(sides[0])}</text>
            <text x="216" y="24" textAnchor="middle">Width {size(sides[1])}</text>
            <text x="67" y="115" textAnchor="end">Height</text>
            <text x="67" y="135" textAnchor="end">{size(sides[2])}</text>
          </>
        ) : (
          <>
            <rect className="dimension-solid" x={left} y={top} width={width} height={height} rx="3" />
            <path className="dimension-edge" d={`M${left} ${top - 9}h${width}M${left - 9} ${top}v${height}`} />
            <text x={left + width / 2} y={top - 15} textAnchor="middle">Width {size(sides[0])}</text>
            <text x={left - 15} y={top + height / 2} textAnchor="end">Height</text>
            <text x={left - 15} y={top + height / 2 + 19} textAnchor="end">{size(sides[1])}</text>
          </>
        )}
      </svg>
      <figcaption>{is3D ? "Outer dimensions shown in perspective." : "Width and height of the rectangular face."}</figcaption>
    </figure>
  );
}
