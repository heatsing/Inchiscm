"use client";

import { useId, useMemo, useState } from "react";
import { calculatePpi, formatPpi } from "@/lib/display-math";

const presets = [
  { label: "1920 × 1080, 24 in", width: 1920, height: 1080, diagonal: 24 },
  { label: "2560 × 1440, 27 in", width: 2560, height: 1440, diagonal: 27 },
  { label: "3840 × 2160, 55 in", width: 3840, height: 2160, diagonal: 55 },
];

export function PpiCalculator() {
  const id = useId();
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [diagonal, setDiagonal] = useState("24");
  const widthValue = Number(width);
  const heightValue = Number(height);
  const diagonalValue = Number(diagonal);
  const ppi = useMemo(
    () => calculatePpi(widthValue, heightValue, diagonalValue),
    [widthValue, heightValue, diagonalValue],
  );

  function applyPreset(preset: (typeof presets)[number]) {
    setWidth(String(preset.width));
    setHeight(String(preset.height));
    setDiagonal(String(preset.diagonal));
  }

  return (
    <div className="converter-card screen-calculator">
      <div className="length-value-row">
        <div className="field">
          <label htmlFor={`${id}-width`}>Width pixels</label>
          <input id={`${id}-width`} type="number" min="1" step="1" value={width} onChange={(event) => setWidth(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-height`}>Height pixels</label>
          <input id={`${id}-height`} type="number" min="1" step="1" value={height} onChange={(event) => setHeight(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-diagonal`}>Diagonal inches</label>
          <div className="field-wrap">
            <input id={`${id}-diagonal`} type="number" min="0.1" step="any" value={diagonal} onChange={(event) => setDiagonal(event.target.value)} />
            <span className="unit">in</span>
          </div>
        </div>
      </div>
      <div className="converter-presets" aria-label="Common PPI examples">
        <span>Try</span>
        <div>
          {presets.map((preset) => <button key={preset.label} type="button" onClick={() => applyPreset(preset)}>{preset.label}</button>)}
        </div>
      </div>
      <div className="result-detail" aria-live="polite">
        <div>
          <strong>{ppi === null ? "Enter positive pixel and diagonal values." : `${formatPpi(ppi)} PPI`}</strong>
          {ppi !== null && <div className="subtle">√({widthValue}² + {heightValue}²) ÷ {diagonalValue} = {formatPpi(ppi)} pixels per inch</div>}
        </div>
      </div>
    </div>
  );
}
