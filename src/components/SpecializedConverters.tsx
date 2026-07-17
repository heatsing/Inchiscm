"use client";

import { useId, useMemo, useState } from "react";
import { convertLength, formatLength } from "@/lib/length-units";

export function FeetToCmConverter({
  defaultFeet = 5,
  defaultInches = 8,
}: {
  defaultFeet?: number;
  defaultInches?: number;
}) {
  const id = useId();
  const [feet, setFeet] = useState(String(defaultFeet));
  const [inches, setInches] = useState(String(defaultInches));
  const feetValue = Number(feet);
  const inchValue = Number(inches);
  const feetIsValid = feet.trim() !== "" && Number.isFinite(feetValue) && feetValue >= 0;
  const inchesIsValid = inches.trim() !== "" && Number.isFinite(inchValue) && inchValue >= 0 && inchValue < 12;
  const result = useMemo(() => {
    return feetIsValid && inchesIsValid
      ? convertLength(feetValue * 12 + inchValue, "in", "cm")
      : null;
  }, [feetIsValid, feetValue, inchesIsValid, inchValue]);

  return (
    <div className="converter-card">
      <div className="converter-grid">
        <div className="field">
          <label htmlFor={`${id}-feet`}>Feet</label>
          <div className="field-wrap"><input id={`${id}-feet`} type="number" min="0" step="1" inputMode="numeric" value={feet} onChange={(event) => setFeet(event.target.value)} aria-invalid={!feetIsValid} aria-describedby={`${id}-result`} /><span className="unit">ft</span></div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-inches`}>Inches</label>
          <div className="field-wrap"><input id={`${id}-inches`} type="number" min="0" max="11.999999" step="any" inputMode="decimal" value={inches} onChange={(event) => setInches(event.target.value)} aria-invalid={!inchesIsValid} aria-describedby={`${id}-result`} /><span className="unit">in</span></div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-cm`}>Centimeters</label>
          <div className="field-wrap"><input id={`${id}-cm`} readOnly value={result === null ? "" : formatLength(result, 4)} /><span className="unit">cm</span></div>
        </div>
      </div>
      <div className="result-detail" id={`${id}-result`} aria-live="polite">
        <div>
          <strong>{result === null ? "Enter feet and 0–11 inches" : `${feet || 0} ft ${inches || 0} in = ${formatLength(result, 4)} cm`}</strong>
          {result !== null && <div className="subtle">({feet || 0} × 12 + {inches || 0}) × 2.54 = {formatLength(result, 4)}</div>}
        </div>
      </div>
    </div>
  );
}
