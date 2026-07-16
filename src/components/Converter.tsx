"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber, INCH_IN_CM, parseMeasurementInput } from "@/lib/conversions";

type Mode = "in-to-cm" | "cm-to-in";

function track(event: string, details: Record<string, string | number> = {}) {
  const win = window as typeof window & { dataLayer?: Record<string, unknown>[] };
  win.dataLayer?.push({ event, ...details });
}

export function Converter({
  initialValue = 10,
  initialMode = "in-to-cm",
  compact = false,
}: {
  initialValue?: number;
  initialMode?: Mode;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [input, setInput] = useState(String(initialValue));
  const [copied, setCopied] = useState(false);
  const parsed = useMemo(() => parseMeasurementInput(input), [input]);
  const inputValue = parsed?.value ?? 0;
  const result = mode === "in-to-cm" ? inputValue * INCH_IN_CM : inputValue / INCH_IN_CM;
  const valid = parsed !== null && inputValue >= 0;
  const sourceUnit = mode === "in-to-cm" ? "in" : "cm";
  const targetUnit = mode === "in-to-cm" ? "cm" : "in";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (valid) track(parsed?.type === "height" ? "height_conversion" : "converter_input", { mode, value: inputValue });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [inputValue, mode, parsed?.type, valid]);

  function changeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setInput(valid ? formatNumber(result) : "");
  }

  async function copy() {
    if (!valid) return;
    await navigator.clipboard.writeText(`${formatNumber(result)} ${targetUnit}`);
    setCopied(true);
    track("result_copy", { mode, value: result });
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="converter-card">
      {!compact && (
        <div className="mode-tabs" aria-label="Conversion direction">
          <button className={mode === "in-to-cm" ? "active" : ""} onClick={() => changeMode("in-to-cm")}>Inches to CM</button>
          <button className={mode === "cm-to-in" ? "active" : ""} onClick={() => changeMode("cm-to-in")}>CM to Inches</button>
        </div>
      )}
      <div className="converter-grid">
        <div className="field">
          <label htmlFor="measurement-input">{mode === "in-to-cm" ? "Inches" : "Centimeters"}</label>
          <div className="field-wrap">
            <input
              id="measurement-input"
              inputMode="decimal"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={mode === "in-to-cm" ? 'Try 10 or 5 ft 8 in' : "Try 25.4"}
              aria-describedby="conversion-result"
            />
            <span className="unit">{sourceUnit}</span>
          </div>
        </div>
        <div className="swap" aria-hidden="true">→</div>
        <div className="field">
          <label htmlFor="conversion-output">{mode === "in-to-cm" ? "Centimeters" : "Inches"}</label>
          <div className="field-wrap">
            <input id="conversion-output" value={valid ? formatNumber(result) : ""} readOnly tabIndex={-1} />
            <span className="unit">{targetUnit}</span>
          </div>
        </div>
      </div>
      <div className="result-detail" id="conversion-result" aria-live="polite">
        <div>
          <strong>{valid ? `${formatNumber(inputValue)} ${sourceUnit} = ${formatNumber(result)} ${targetUnit}` : "Enter a valid measurement"}</strong>
          {valid && <div className="subtle">{mode === "in-to-cm" ? `${formatNumber(inputValue)} × 2.54` : `${formatNumber(inputValue)} ÷ 2.54`} = {formatNumber(result)}</div>}
        </div>
        <button className="copy-button" onClick={copy} disabled={!valid}>{copied ? "Copied" : "Copy result"}</button>
      </div>
      {!compact && (
        <div className="examples" aria-label="Example values">
          {(mode === "in-to-cm" ? [1, 5, 10, 12, 24, 36] : [1, 10, 25, 30, 50, 100]).map((value) => (
            <button key={value} onClick={() => setInput(String(value))}>{value} {sourceUnit}</button>
          ))}
        </div>
      )}
    </div>
  );
}
