"use client";

import { useMemo, useState } from "react";
import { formatLength } from "@/lib/length-units";
import { trackAnalyticsEvent } from "@/lib/analytics";

type DimensionDirection = "in-to-cm" | "cm-to-in";

const labels = {
  "in-to-cm": {
    from: "in",
    to: "cm",
    factor: 2.54,
    formula: "Each inch value x 2.54",
  },
  "cm-to-in": {
    from: "cm",
    to: "in",
    factor: 1 / 2.54,
    formula: "Each centimeter value / 2.54",
  },
} satisfies Record<DimensionDirection, { from: string; to: string; factor: number; formula: string }>;

function cleanNumber(value: string) {
  const parsed = Number(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function formatDimension(value: number, unit: string) {
  return `${formatLength(value, unit === "cm" ? 2 : 3)} ${unit}`;
}

export function DimensionsConverter({
  direction,
  defaultLength,
  defaultWidth,
  defaultHeight,
}: {
  direction: DimensionDirection;
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
}) {
  const [length, setLength] = useState(String(defaultLength));
  const [width, setWidth] = useState(String(defaultWidth));
  const [height, setHeight] = useState(String(defaultHeight));
  const [hasTracked, setHasTracked] = useState(false);
  const config = labels[direction];

  const result = useMemo(() => {
    const l = cleanNumber(length);
    const w = cleanNumber(width);
    const h = cleanNumber(height);
    if (l === null || w === null || h === null) return null;
    return {
      length: l * config.factor,
      width: w * config.factor,
      height: h * config.factor,
      source: { length: l, width: w, height: h },
    };
  }, [config.factor, height, length, width]);

  function convert() {
    if (!result) return;
    if (!hasTracked) {
      trackAnalyticsEvent("dimensions_converter_input", { direction });
      setHasTracked(true);
    }
  }

  function reset() {
    setLength(String(defaultLength));
    setWidth(String(defaultWidth));
    setHeight(String(defaultHeight));
    setHasTracked(false);
  }

  const sourceText = result
    ? `${formatDimension(result.source.length, config.from)} x ${formatDimension(result.source.width, config.from)} x ${formatDimension(result.source.height, config.from)}`
    : "";
  const resultText = result
    ? `${formatDimension(result.length, config.to)} x ${formatDimension(result.width, config.to)} x ${formatDimension(result.height, config.to)}`
    : "";

  return (
    <div className="converter-card dimensions-converter">
      <div className="dimensions-grid">
        <div className="field">
          <label htmlFor="dimension-length">Length</label>
          <div className="field-wrap">
            <input id="dimension-length" type="number" min="0" step="any" inputMode="decimal" value={length} onChange={(event) => setLength(event.target.value)} />
            <span className="unit">{config.from}</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="dimension-width">Width</label>
          <div className="field-wrap">
            <input id="dimension-width" type="number" min="0" step="any" inputMode="decimal" value={width} onChange={(event) => setWidth(event.target.value)} />
            <span className="unit">{config.from}</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="dimension-height">Height</label>
          <div className="field-wrap">
            <input id="dimension-height" type="number" min="0" step="any" inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value)} />
            <span className="unit">{config.from}</span>
          </div>
        </div>
      </div>

      <div className="converter-actions">
        <button className="button primary" type="button" onClick={convert} disabled={!result}>Convert dimensions</button>
        <button className="button" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="result-detail" aria-live="polite">
        <div>
          <strong>{result ? `${sourceText} = ${resultText}` : "Enter length, width, and height"}</strong>
          {result && <div className="subtle">{config.formula}; convert each side separately.</div>}
        </div>
      </div>
    </div>
  );
}
