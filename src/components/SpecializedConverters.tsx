"use client";

import { useId, useMemo, useState } from "react";
import { formatNumber } from "@/lib/conversions";

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
  const result = useMemo(() => {
    const feetValue = Number(feet);
    const inchValue = Number(inches);
    return Number.isFinite(feetValue) && Number.isFinite(inchValue) && feetValue >= 0 && inchValue >= 0 && inchValue < 12
      ? (feetValue * 12 + inchValue) * 2.54
      : null;
  }, [feet, inches]);

  return (
    <div className="converter-card">
      <div className="converter-grid">
        <div className="field">
          <label htmlFor={`${id}-feet`}>Feet</label>
          <div className="field-wrap"><input id={`${id}-feet`} inputMode="numeric" value={feet} onChange={(event) => setFeet(event.target.value)} /><span className="unit">ft</span></div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-inches`}>Inches</label>
          <div className="field-wrap"><input id={`${id}-inches`} inputMode="decimal" value={inches} onChange={(event) => setInches(event.target.value)} /><span className="unit">in</span></div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-cm`}>Centimeters</label>
          <div className="field-wrap"><input id={`${id}-cm`} readOnly value={result === null ? "" : formatNumber(result)} /><span className="unit">cm</span></div>
        </div>
      </div>
      <div className="result-detail" aria-live="polite">
        <div>
          <strong>{result === null ? "Enter feet and 0–11 inches" : `${feet || 0} ft ${inches || 0} in = ${formatNumber(result)} cm`}</strong>
          {result !== null && <div className="subtle">({feet || 0} × 12 + {inches || 0}) × 2.54 = {formatNumber(result)}</div>}
        </div>
      </div>
    </div>
  );
}
