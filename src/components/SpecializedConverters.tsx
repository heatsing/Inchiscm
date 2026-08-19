"use client";

import { useId, useMemo, useState } from "react";
import {
  convertLength,
  decimalInchesToFeetAndInches,
  decimalInchesToFraction,
  formatLength,
} from "@/lib/length-units";

type HeightMode = "feet-to-cm" | "cm-to-feet";

function cmToHeightParts(cm: number) {
  const totalInches = convertLength(cm, "cm", "in");
  let feet = Math.floor(totalInches / 12);
  let inches = totalInches - feet * 12;
  if (Number(inches.toFixed(4)) >= 12) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches, totalInches };
}

export function FeetToCmConverter({
  defaultFeet = 5,
  defaultInches = 8,
}: {
  defaultFeet?: number;
  defaultInches?: number;
}) {
  const id = useId();
  const defaultCm = convertLength(defaultFeet * 12 + defaultInches, "in", "cm");
  const [mode, setMode] = useState<HeightMode>("feet-to-cm");
  const [feet, setFeet] = useState(String(defaultFeet));
  const [inches, setInches] = useState(String(defaultInches));
  const [cm, setCm] = useState(formatLength(defaultCm, 4));
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const feetValue = Number(feet);
  const inchValue = Number(inches);
  const cmValue = Number(cm);
  const feetIsValid = feet.trim() !== "" && Number.isFinite(feetValue) && feetValue >= 0;
  const inchesIsValid = inches.trim() !== "" && Number.isFinite(inchValue) && inchValue >= 0 && inchValue < 12;
  const cmIsValid = cm.trim() !== "" && Number.isFinite(cmValue) && cmValue >= 0;
  const result = useMemo(() => {
    if (mode === "feet-to-cm") {
      if (!feetIsValid || !inchesIsValid) return null;
      const totalInches = feetValue * 12 + inchValue;
      const centimeters = convertLength(totalInches, "in", "cm");
      return {
        feet: feetValue,
        inches: inchValue,
        totalInches,
        centimeters,
        meters: centimeters / 100,
      };
    }
    if (!cmIsValid) return null;
    const parts = cmToHeightParts(cmValue);
    return {
      feet: parts.feet,
      inches: parts.inches,
      totalInches: parts.totalInches,
      centimeters: cmValue,
      meters: cmValue / 100,
    };
  }, [cmIsValid, cmValue, feetIsValid, feetValue, inchValue, inchesIsValid, mode]);

  const inputIsValid = mode === "feet-to-cm" ? feetIsValid && inchesIsValid : cmIsValid;
  const heightText = result === null ? "" : `${result.feet} ft ${formatLength(result.inches, 4)} in`;

  function syncFromFeet() {
    if (!feetIsValid || !inchesIsValid) return;
    setCm(formatLength(convertLength(feetValue * 12 + inchValue, "in", "cm"), 4));
  }

  function syncFromCm() {
    if (!cmIsValid) return;
    const parts = cmToHeightParts(cmValue);
    setFeet(String(parts.feet));
    setInches(formatLength(parts.inches, 4));
  }

  function convert() {
    if (mode === "feet-to-cm") syncFromFeet();
    else syncFromCm();
  }

  function swap() {
    convert();
    setMode((current) => current === "feet-to-cm" ? "cm-to-feet" : "feet-to-cm");
  }

  function reset() {
    setMode("feet-to-cm");
    setFeet(String(defaultFeet));
    setInches(String(defaultInches));
    setCm(formatLength(defaultCm, 4));
    setCopyStatus("idle");
  }

  async function copy() {
    if (!inputIsValid || result === null) return;
    try {
      await navigator.clipboard.writeText(`${heightText} = ${formatLength(result.centimeters, 4)} cm`);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <div className="converter-card height-converter-card">
      <div className="mode-tabs" role="tablist" aria-label="Height conversion direction">
        <button type="button" className={mode === "feet-to-cm" ? "active" : ""} onClick={() => setMode("feet-to-cm")}>Feet + inches to cm</button>
        <button type="button" className={mode === "cm-to-feet" ? "active" : ""} onClick={() => setMode("cm-to-feet")}>CM to feet + inches</button>
      </div>
      <div className="height-converter-grid">
        <div className="field">
          <label htmlFor={`${id}-feet`}>Feet</label>
          <div className="field-wrap"><input id={`${id}-feet`} type="number" min="0" step="1" inputMode="numeric" value={mode === "cm-to-feet" && result ? String(result.feet) : feet} readOnly={mode === "cm-to-feet"} onChange={(event) => setFeet(event.target.value)} aria-invalid={mode === "feet-to-cm" && !feetIsValid} aria-describedby={`${id}-result`} /><span className="unit">ft</span></div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-inches`}>Inches</label>
          <div className="field-wrap"><input id={`${id}-inches`} type="number" min="0" max="11.999999" step="any" inputMode="decimal" value={mode === "cm-to-feet" && result ? formatLength(result.inches, 4) : inches} readOnly={mode === "cm-to-feet"} onChange={(event) => setInches(event.target.value)} aria-invalid={mode === "feet-to-cm" && !inchesIsValid} aria-describedby={`${id}-result`} /><span className="unit">in</span></div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-cm`}>Centimeters</label>
          <div className="field-wrap"><input id={`${id}-cm`} type="number" min="0" step="any" inputMode="decimal" readOnly={mode === "feet-to-cm"} value={mode === "feet-to-cm" && result ? formatLength(result.centimeters, 4) : cm} onChange={(event) => setCm(event.target.value)} aria-invalid={mode === "cm-to-feet" && !cmIsValid} aria-describedby={`${id}-result`} /><span className="unit">cm</span></div>
        </div>
      </div>
      <div className="converter-actions">
        <button className="button primary" type="button" onClick={convert} disabled={!inputIsValid}>Convert</button>
        <button className="button" type="button" onClick={reset}>Reset</button>
        <button className="button" type="button" onClick={swap} disabled={!inputIsValid}>Swap</button>
      </div>
      <div className="result-detail" id={`${id}-result`} aria-live="polite">
        <div>
          <strong>{result === null ? "Enter a valid height" : `${heightText} = ${formatLength(result.centimeters, 4)} cm`}</strong>
          {result !== null && <div className="subtle">{formatLength(result.totalInches, 4)} total inches × 2.54 = {formatLength(result.centimeters, 4)} cm</div>}
        </div>
        <button className="copy-button" type="button" onClick={copy} disabled={!inputIsValid}>
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Unable to copy" : "Copy result"}
        </button>
      </div>
      {result !== null && (
        <div className="inch-extras">
          <div><span>Total inches</span><strong>{formatLength(result.totalInches, 4)} in</strong></div>
          <div><span>Meters</span><strong>{formatLength(result.meters, 4)} m</strong></div>
          <div><span>Nearest 1/16 inch</span><strong>{decimalInchesToFraction(result.totalInches)}</strong></div>
        </div>
      )}
    </div>
  );
}

export function CmToFeetAndInchesConverter({
  defaultCm = 170,
}: {
  defaultCm?: number;
}) {
  const id = useId();
  const [cm, setCm] = useState(String(defaultCm));
  const cmValue = Number(cm);
  const cmIsValid = cm.trim() !== "" && Number.isFinite(cmValue) && cmValue >= 0;
  const totalInches = useMemo(() => {
    return cmIsValid ? convertLength(cmValue, "cm", "in") : null;
  }, [cmIsValid, cmValue]);

  return (
    <div className="converter-card">
      <div className="converter-grid">
        <div className="field">
          <label htmlFor={`${id}-cm`}>Centimeters</label>
          <div className="field-wrap"><input id={`${id}-cm`} type="number" min="0" step="any" inputMode="decimal" value={cm} onChange={(event) => setCm(event.target.value)} aria-invalid={!cmIsValid} aria-describedby={`${id}-result`} /><span className="unit">cm</span></div>
        </div>
        <div className="swap">=</div>
        <div className="field">
          <label htmlFor={`${id}-inches`}>Total inches</label>
          <div className="field-wrap"><input id={`${id}-inches`} readOnly value={totalInches === null ? "" : formatLength(totalInches, 4)} /><span className="unit">in</span></div>
        </div>
      </div>
      <div className="result-detail" id={`${id}-result`} aria-live="polite">
        <div>
          <strong>{totalInches === null ? "Enter centimeters" : `${formatLength(cmValue, 2)} cm = ${decimalInchesToFeetAndInches(totalInches)}`}</strong>
          {totalInches !== null && <div className="subtle">{formatLength(cmValue, 2)} / 2.54 = {formatLength(totalInches, 4)} total inches</div>}
        </div>
      </div>
      {totalInches !== null && (
        <div className="inch-extras">
          <div><span>Total inches</span><strong>{formatLength(totalInches, 4)} in</strong></div>
          <div><span>Feet + inches</span><strong>{decimalInchesToFeetAndInches(totalInches)}</strong></div>
          <div><span>Nearest 1/16 inch</span><strong>{decimalInchesToFraction(totalInches)}</strong></div>
        </div>
      )}
    </div>
  );
}
