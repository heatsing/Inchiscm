"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "@/lib/conversions";

export function FeetToCmConverter() {
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("8");
  const result = useMemo(() => {
    const feetValue = Number(feet);
    const inchValue = Number(inches);
    return Number.isFinite(feetValue) && Number.isFinite(inchValue)
      ? (feetValue * 12 + inchValue) * 2.54
      : null;
  }, [feet, inches]);

  return (
    <div className="converter-card">
      <div className="converter-grid">
        <div className="field">
          <label htmlFor="feet-input">Feet</label>
          <div className="field-wrap"><input id="feet-input" inputMode="decimal" value={feet} onChange={(event) => setFeet(event.target.value)} /><span className="unit">ft</span></div>
        </div>
        <div className="field">
          <label htmlFor="height-inch-input">Inches</label>
          <div className="field-wrap"><input id="height-inch-input" inputMode="decimal" value={inches} onChange={(event) => setInches(event.target.value)} /><span className="unit">in</span></div>
        </div>
        <div className="field">
          <label htmlFor="height-cm-output">Centimeters</label>
          <div className="field-wrap"><input id="height-cm-output" readOnly value={result === null ? "" : formatNumber(result)} /><span className="unit">cm</span></div>
        </div>
      </div>
      <div className="result-detail" aria-live="polite">
        <div>
          <strong>{result === null ? "Enter a valid height" : `${feet || 0} ft ${inches || 0} in = ${formatNumber(result)} cm`}</strong>
          {result !== null && <div className="subtle">({feet || 0} × 12 + {inches || 0}) × 2.54 = {formatNumber(result)}</div>}
        </div>
      </div>
    </div>
  );
}

export function InchesToMmConverter() {
  const [inches, setInches] = useState("10");
  const value = Number(inches);
  const result = Number.isFinite(value) ? value * 25.4 : null;

  return (
    <div className="converter-card">
      <div className="converter-grid">
        <div className="field">
          <label htmlFor="mm-inch-input">Inches</label>
          <div className="field-wrap"><input id="mm-inch-input" inputMode="decimal" value={inches} onChange={(event) => setInches(event.target.value)} /><span className="unit">in</span></div>
        </div>
        <div className="swap" aria-hidden="true">→</div>
        <div className="field">
          <label htmlFor="mm-output">Millimeters</label>
          <div className="field-wrap"><input id="mm-output" readOnly value={result === null ? "" : formatNumber(result)} /><span className="unit">mm</span></div>
        </div>
      </div>
      <div className="result-detail" aria-live="polite">
        <div>
          <strong>{result === null ? "Enter a valid measurement" : `${formatNumber(value)} in = ${formatNumber(result)} mm`}</strong>
          {result !== null && <div className="subtle">{formatNumber(value)} × 25.4 = {formatNumber(result)}</div>}
        </div>
      </div>
    </div>
  );
}
