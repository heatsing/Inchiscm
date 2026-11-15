"use client";

import { useId, useState } from "react";
import { formatScreenMeasurement as formatLength } from "@/lib/screen-dimensions";
import { calculateAspectRatio, calculateScreenDiagonal, type ScreenUnit } from "@/lib/screen-dimensions";

export function ScreenDiagonalCalculator() {
  const id = useId();
  const [width, setWidth] = useState("40");
  const [height, setHeight] = useState("30");
  const [unit, setUnit] = useState<ScreenUnit>("cm");
  const result = calculateScreenDiagonal(Number(width), Number(height), unit);
  return (
    <div className="converter-card screen-calculator">
      <div className="length-value-row">
        {[{ label: "Width", value: width, setValue: setWidth }, { label: "Height", value: height, setValue: setHeight }].map(({ label, value, setValue }) => (
          <div className="field" key={label}>
            <label htmlFor={`${id}-${label}`}>{label}</label>
            <div className="field-wrap">
              <input id={`${id}-${label}`} type="number" min="0" step="any" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={!(Number(value) > 0 && Number.isFinite(Number(value)))} aria-describedby={`${id}-result`} />
              <span className="unit">{unit}</span>
            </div>
          </div>
        ))}
        <div className="field">
          <label htmlFor={`${id}-unit`}>Input unit</label>
          <select id={`${id}-unit`} value={unit} onChange={(event) => setUnit(event.target.value as ScreenUnit)}><option value="cm">Centimeters</option><option value="in">Inches</option></select>
        </div>
      </div>
      <div className="result-detail screen-result" id={`${id}-result`} aria-live="polite">
        {result ? <>
          <strong>Diagonal: {formatLength(result.diagonalInches, 2)} in / {formatLength(result.diagonalCm, 2)} cm</strong>
          <p className="subtle">√({width}² + {height}²) = {formatLength(unit === "cm" ? result.diagonalCm : result.diagonalInches, 2)} {unit}. Measure the visible panel, excluding the frame.</p>
        </> : <strong>Enter positive, finite width and height values within the supported numeric range.</strong>}
      </div>
    </div>
  );
}

export function ScreenAspectRatioCalculator() {
  const id = useId();
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const result = calculateAspectRatio(Number(width), Number(height));
  return (
    <div className="converter-card screen-calculator">
      <div className="length-value-row">
        {[{ label: "Width", value: width, setValue: setWidth }, { label: "Height", value: height, setValue: setHeight }].map(({ label, value, setValue }) => (
          <div className="field" key={label}>
            <label htmlFor={`${id}-${label}`}>{label} in pixels</label>
            <div className="field-wrap"><input id={`${id}-${label}`} type="number" min="1" step="1" inputMode="numeric" value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={!(Number.isSafeInteger(Number(value)) && Number(value) > 0)} aria-describedby={`${id}-result`} /><span className="unit">px</span></div>
          </div>
        ))}
      </div>
      <div className="converter-presets" aria-label="Common resolutions"><span>Try a resolution</span><div>{[[1920, 1080], [2560, 1600], [3440, 1440]].map(([w, h]) => <button key={w} type="button" onClick={() => { setWidth(String(w)); setHeight(String(h)); }}>{w} × {h}</button>)}</div></div>
      <div className="result-detail screen-result" id={`${id}-result`} aria-live="polite">
        {result ? <>
          <strong>Aspect ratio: {result.common ?? result.exact}</strong>
          <p>Reduced ratio: {result.exact}. Width ÷ height = {formatLength(result.decimal, 4)}.</p>
          <p className="subtle">{result.common && result.common !== result.exact ? `${result.common} is the common display name for the equivalent ${result.exact} ratio. ` : ""}Advertised “21:9” screens can use different pixel ratios; this result uses your exact resolution.</p>
        </> : <strong>Enter positive whole-number pixel dimensions within the supported numeric range.</strong>}
      </div>
    </div>
  );
}
