import { cmToInches, formatNumber, inchesToCm } from "@/lib/conversions";
import { convertLength, decimalInchesToFraction, formatLength } from "@/lib/length-units";

export function AlternateUnits({
  value,
  unit,
}: {
  value: number;
  unit: "in" | "cm";
}) {
  const inches = unit === "in" ? value : cmToInches(value);
  const centimeters = unit === "cm" ? value : inchesToCm(value);
  const rows = [
    ["Centimeters", `${formatNumber(centimeters)} cm`],
    ["Millimeters", `${formatNumber(centimeters * 10)} mm`],
    ["Meters", `${formatLength(centimeters / 100, 4)} m`],
    ["Decimal inches", `${formatLength(inches, 4)} in`],
    ["Nearest 1/16 inch", decimalInchesToFraction(inches)],
    ["Feet", `${formatLength(convertLength(inches, "in", "ft"), 4)} ft`],
    ["Yards", `${formatLength(convertLength(inches, "in", "yd"), 4)} yd`],
  ];

  return (
    <div className="data-table-wrap">
      <table>
        <caption>Equivalent length values</caption>
        <thead><tr><th>Unit</th><th>Value</th></tr></thead>
        <tbody>
          {rows.map(([label, result]) => (
            <tr key={label}><td>{label}</td><td>{result}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MeasurementRuler({
  inches,
  label,
}: {
  inches: number;
  label: string;
}) {
  const maxInches = Math.max(1, Math.min(12, Math.ceil(inches)));
  const clampedPosition = Math.max(0, Math.min(100, (inches / maxInches) * 100));
  const ticks = Array.from({ length: maxInches * 16 + 1 }, (_, index) => {
    const isWhole = index % 16 === 0;
    const isHalf = index % 8 === 0;
    const isQuarter = index % 4 === 0;
    return {
      index,
      left: (index / (maxInches * 16)) * 100,
      height: isWhole ? 32 : isHalf ? 24 : isQuarter ? 18 : 12,
      label: isWhole ? String(index / 16) : "",
    };
  });

  return (
    <figure className="measurement-ruler" aria-label={`Ruler visualization for ${label}`}>
      <div className="ruler-track">
        {ticks.map((tick) => (
          <span
            key={tick.index}
            className="ruler-tick"
            style={{ left: `${tick.left}%`, height: `${tick.height}px` }}
          >
            {tick.label && <small>{tick.label}</small>}
          </span>
        ))}
        <span className="ruler-marker" style={{ left: `${clampedPosition}%` }} aria-hidden="true">▲</span>
      </div>
      <figcaption>{label} shown on a 0–{maxInches} inch ruler scale.</figcaption>
    </figure>
  );
}

export function HeightScale({
  feet,
  inches,
  centimeters,
}: {
  feet: number;
  inches: number;
  centimeters: number;
}) {
  const min = 130;
  const max = 220;
  const marker = Math.max(0, Math.min(100, ((max - centimeters) / (max - min)) * 100));
  const marks = [220, 210, 200, 190, 180, 170, 160, 150, 140, 130];
  const label = inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;

  return (
    <figure className="height-scale" aria-label={`Height scale for ${label}`}>
      <div className="height-scale-track">
        {marks.map((mark) => (
          <div className="height-scale-row" key={mark}>
            <span>{mark} cm</span>
            <i aria-hidden="true" />
          </div>
        ))}
        <div className="height-scale-marker" style={{ top: `${marker}%` }}>
          <span aria-hidden="true">●</span>
          <strong>{label}</strong>
        </div>
      </div>
      <figcaption>{label} positioned on a centimeter height scale from 130 cm to 220 cm.</figcaption>
    </figure>
  );
}
