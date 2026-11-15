"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatLength } from "@/lib/length-units";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  convertProductDimensions,
  parseDimensionsInput,
  parseDimensionSide,
  parseDimensionShareHash,
  type DimensionDirection,
  type DimensionMode,
} from "@/lib/product-dimensions";

const labels = {
  "in-to-cm": { from: "in", fromName: "inches", to: "cm", formula: "Each inch value × 2.54" },
  "cm-to-in": { from: "cm", fromName: "centimeters", to: "in", formula: "Each centimeter value ÷ 2.54" },
} as const;

function dimensionText(values: readonly number[], unit: string) {
  return `${values.map((value) => {
    const formatted = formatLength(value, unit === "cm" ? 2 : 3);
    return formatted === "0" ? value.toExponential(4) : formatted;
  }).join(" × ")} ${unit}`;
}

export function DimensionsConverter({
  direction,
  defaultLength,
  defaultWidth,
  defaultHeight,
  defaultMode = 3,
}: {
  direction: DimensionDirection;
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
  defaultMode?: DimensionMode;
}) {
  const id = useId();
  const [mode, setMode] = useState<DimensionMode>(defaultMode);
  const [values, setValues] = useState([String(defaultLength), String(defaultWidth), String(defaultHeight)]);
  const [pasteInput, setPasteInput] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [hasTracked, setHasTracked] = useState(false);
  const inputRevision = useRef(0);
  const config = labels[direction];
  useEffect(() => {
    const restore = () => {
      const shared = parseDimensionShareHash(window.location.hash, labels[direction].from);
      if (!shared || !convertProductDimensions(shared, direction)) {
        if (!window.location.hash.startsWith("#size=")) return;
        setMode(defaultMode);
        setValues([String(defaultLength), String(defaultWidth), String(defaultHeight)]);
      } else {
        setMode(shared.length as DimensionMode);
        setValues([String(shared[0]), String(shared[1]), shared.length === 3 ? String(shared[2]) : ""]);
      }
      setPasteInput("");
      setCopyStatus("");
      inputRevision.current += 1;
    };
    const timer = window.setTimeout(restore, 0);
    window.addEventListener("hashchange", restore);
    return () => { window.clearTimeout(timer); window.removeEventListener("hashchange", restore); };
  }, [direction, defaultMode, defaultLength, defaultWidth, defaultHeight]);
  const pasteInvalid = pasteInput.trim() !== "" && parseDimensionsInput(pasteInput, config.from) === null;
  const source = values.slice(0, mode).map(parseDimensionSide);
  const validSource = !pasteInvalid && source.every((value) => value !== null) ? source as number[] : null;
  const result = validSource ? convertProductDimensions(validSource, direction) : null;
  const completeResult = result && validSource
    ? `${validSource.join(" × ")} ${config.from} = ${dimensionText(result, config.to)}`
    : "";

  function clearCopyStatus() {
    inputRevision.current += 1;
    setCopyStatus("");
  }

  function updateSide(index: number, value: string) {
    setValues((current) => current.map((side, sideIndex) => sideIndex === index ? value : side));
    setPasteInput("");
    clearCopyStatus();
  }

  function updatePastedSize(value: string) {
    setPasteInput(value);
    const parsed = parseDimensionsInput(value, config.from);
    // Clear old values while a new size is incomplete, so no previous answer survives an invalid paste.
    setValues(parsed ? [String(parsed[0]), String(parsed[1]), parsed.length === 3 ? String(parsed[2]) : ""] : ["", "", ""]);
    if (parsed) setMode(parsed.length as DimensionMode);
    clearCopyStatus();
  }

  function trackUse() {
    if (result && !hasTracked) {
      trackAnalyticsEvent("dimensions_converter_input", { direction });
      setHasTracked(true);
    }
  }

  async function copyResult() {
    if (!completeResult) return;
    const revision = inputRevision.current;
    trackUse();
    try {
      await navigator.clipboard.writeText(completeResult);
      if (revision === inputRevision.current) setCopyStatus("Copied the full conversion.");
    } catch {
      if (revision === inputRevision.current) setCopyStatus("Could not copy automatically. Select and copy the result below.");
    }
  }

  function reset() {
    setMode(defaultMode);
    setValues([String(defaultLength), String(defaultWidth), String(defaultHeight)]);
    setPasteInput("");
    setHasTracked(false);
    clearCopyStatus();
  }

  return (
    <div className="converter-card dimensions-converter">
      <div className="length-value-row">
        <div className="field">
          <label htmlFor={`${id}-mode`}>Dimensions</label>
          <select id={`${id}-mode`} value={mode} onChange={(event) => { setMode(Number(event.target.value) as DimensionMode); setPasteInput(""); clearCopyStatus(); }}>
            <option value={2}>2D — length × width</option>
            <option value={3}>3D — length × width × height</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-paste`}>Paste a size in {config.fromName}</label>
          <div className="field-wrap">
            <input id={`${id}-paste`} type="text" value={pasteInput} onChange={(event) => updatePastedSize(event.target.value)} onBlur={trackUse} placeholder={`10 x 15 ${config.from}`} autoComplete="off" spellCheck={false} aria-invalid={pasteInvalid} aria-describedby={`${id}-paste-help ${id}-result`} />
          </div>
        </div>
      </div>
      <p className="subtle" id={`${id}-paste-help`}>Paste two or three numbers separated by x or ×, using {config.from} for every side. The mode changes automatically.</p>
      <div className="dimensions-grid">
        {["Length", "Width", "Height"].slice(0, mode).map((label, index) => (
          <div className="field" key={label}>
            <label htmlFor={`${id}-${label.toLowerCase()}`}>{label}</label>
            <div className="field-wrap">
              <input id={`${id}-${label.toLowerCase()}`} type="number" min="0" step="any" inputMode="decimal" value={values[index]} onChange={(event) => updateSide(index, event.target.value)} onBlur={trackUse} aria-invalid={source[index] === null} aria-describedby={`${id}-result`} />
              <span className="unit">{config.from}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="converter-actions">
        <button className="button primary" type="button" onClick={copyResult} disabled={!result}>Copy result</button>
        <button className="button" type="button" onClick={reset}>Reset</button>
      </div>
      <p className="subtle" role="status">{copyStatus}</p>
      <div className="result-detail" id={`${id}-result`} aria-live="polite">
        <div>
          <strong>{completeResult || (pasteInvalid ? `Enter two or three valid dimensions in ${config.fromName}, such as 10 x 15. Other units are not converted in this field.` : `Enter ${mode === 2 ? "length and width" : "length, width, and height"} greater than zero, within the supported number range.`)}</strong>
          {result && <div className="subtle">{config.formula}; each side is converted separately. Results update as you type.</div>}
        </div>
      </div>
    </div>
  );
}
