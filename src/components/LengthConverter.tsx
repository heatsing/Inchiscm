"use client";

import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import {
  conversionFactor,
  convertLength,
  decimalInchesToFeetAndInches,
  decimalInchesToFraction,
  formatLength,
  lengthUnits,
  parseLengthInput,
  type LengthUnit,
} from "@/lib/length-units";
import { trackAnalyticsEvent } from "@/lib/analytics";

const fractionPresets = ["1/4", "1/2", "3/4", "1 1/2"];
const VisualRuler = dynamic(() => import("./VisualRuler").then((module) => module.VisualRuler));

export function LengthConverter({
  defaultFrom = "in",
  defaultTo = "cm",
  defaultValue = 10,
  compact = false,
  presets = [],
  showVisualRuler = false,
}: {
  defaultFrom?: LengthUnit;
  defaultTo?: LengthUnit;
  defaultValue?: number;
  compact?: boolean;
  presets?: readonly number[];
  showVisualRuler?: boolean;
}) {
  const id = useId();
  const defaultResult = convertLength(defaultValue, defaultFrom, defaultTo);
  const [from, setFrom] = useState<LengthUnit>(defaultFrom);
  const [to, setTo] = useState<LengthUnit>(defaultTo);
  const [fromText, setFromText] = useState(String(defaultValue));
  const [toText, setToText] = useState(formatLength(defaultResult));
  const [activeField, setActiveField] = useState<"from" | "to" | "ruler">("from");
  const [rulerInches, setRulerInches] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const fromParsed = parseLengthInput(fromText);
  const toParsed = parseLengthInput(toText);
  const sourceValue = useMemo(() => {
    if (activeField === "from") return fromParsed;
    if (activeField === "ruler") return convertLength(rulerInches, "in", from);
    return toParsed === null ? null : convertLength(toParsed, to, from);
  }, [activeField, from, fromParsed, rulerInches, to, toParsed]);
  const resultValue = useMemo(() => {
    if (activeField === "to") return toParsed;
    if (activeField === "ruler") return convertLength(rulerInches, "in", to);
    return fromParsed === null ? null : convertLength(fromParsed, from, to);
  }, [activeField, from, fromParsed, rulerInches, to, toParsed]);

  const inputIsValid = sourceValue !== null && resultValue !== null && sourceValue >= 0 && resultValue >= 0;
  const fromDisplay = activeField !== "from" && sourceValue !== null ? formatLength(sourceValue) : fromText;
  const toDisplay = activeField !== "to" && resultValue !== null ? formatLength(resultValue) : toText;
  const inputMessage = (activeField === "from" ? fromText : toText).trim() === ""
    ? "Enter a length"
    : sourceValue !== null && sourceValue < 0
      ? "Length cannot be negative"
      : "Enter a valid number or fraction";
  const factor = conversionFactor(from, to);
  const involvesInches = from === "in" || to === "in";
  const decimalInches = inputIsValid && sourceValue !== null
    ? activeField === "ruler" ? rulerInches : convertLength(sourceValue, from, "in")
    : null;

  function convert() {
    if (!inputIsValid) return;
    trackAnalyticsEvent("converter_input", { from, to });
  }

  function reset() {
    setFrom(defaultFrom);
    setTo(defaultTo);
    setFromText(String(defaultValue));
    setToText(formatLength(defaultResult));
    setActiveField("from");
    setCopyStatus("idle");
  }

  function swap() {
    if (!inputIsValid) return;
    const currentFromText = fromDisplay;
    const currentToText = toDisplay;
    const nextFrom = to;
    const nextTo = from;
    setFrom(nextFrom);
    setTo(nextTo);
    if (activeField !== "ruler") {
      setFromText(currentToText);
      setToText(currentFromText);
      setActiveField("from");
    }
    trackAnalyticsEvent("converter_swap", { from: nextFrom, to: nextTo });
  }

  function applyRulerSelection(inches: number) {
    setRulerInches(inches);
    setActiveField("ruler");
  }

  function applyPreset(value: number) {
    setFromText(String(value));
    setToText(formatLength(convertLength(value, from, to)));
    setActiveField("from");
    trackAnalyticsEvent("converter_preset", { from, to });
  }

  function applyFractionPreset(value: string) {
    const parsed = parseLengthInput(value);
    if (parsed === null) return;
    if (from === "in") {
      setFromText(value);
      setToText(formatLength(convertLength(parsed, from, to)));
      setActiveField("from");
    } else if (to === "in") {
      setToText(value);
      setFromText(formatLength(convertLength(parsed, to, from)));
      setActiveField("to");
    }
    trackAnalyticsEvent("converter_fraction_preset", { from, to });
  }

  async function copy() {
    if (!inputIsValid || resultValue === null) return;
    try {
      await navigator.clipboard.writeText(`${formatLength(resultValue)} ${to}`);
      setCopyStatus("copied");
      trackAnalyticsEvent("result_copy", { from, to });
    } catch {
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <div className={`converter-card length-converter${compact ? " compact" : ""}`}>
      <div className="length-controls">
        <div className="field length-row">
          <label htmlFor={`${id}-input`}>From</label>
          <div className="field-wrap">
            <input
              id={`${id}-input`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={fromDisplay}
              onChange={(event) => {
                setActiveField("from");
                setFromText(event.target.value);
              }}
              onKeyDown={(event) => { if (event.key === "Enter") convert(); }}
              aria-invalid={!inputIsValid}
              aria-describedby={`${id}-input-hint ${id}-result`}
            />
            <select aria-label="From unit" value={from} onChange={(event) => setFrom(event.target.value as LengthUnit)}>
              {lengthUnits.map((unit) => <option key={unit.symbol} value={unit.symbol}>{unit.name}</option>)}
            </select>
          </div>
        </div>
        <div className="field length-row">
          <label htmlFor={`${id}-output`}>To</label>
          <div className="field-wrap">
            <input
              id={`${id}-output`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={toDisplay}
              onChange={(event) => {
                setActiveField("to");
                setToText(event.target.value);
              }}
              onKeyDown={(event) => { if (event.key === "Enter") convert(); }}
              aria-invalid={!inputIsValid}
              aria-describedby={`${id}-input-hint ${id}-result`}
            />
            <select aria-label="To unit" value={to} onChange={(event) => setTo(event.target.value as LengthUnit)}>
              {lengthUnits.map((unit) => <option key={unit.symbol} value={unit.symbol}>{unit.name}</option>)}
            </select>
          </div>
        </div>
        <button className="swap-button" type="button" onClick={swap} aria-label="Swap units" disabled={!inputIsValid}>↕</button>
        <div className="converter-actions">
          <button className="button primary" type="button" onClick={convert} disabled={!inputIsValid}>Convert</button>
          <button className="button" type="button" onClick={reset}>Reset</button>
        </div>
      </div>
      <span id={`${id}-input-hint`} hidden>Decimals and fractions are accepted, such as 1.5 or 1/2.</span>

      {presets.length > 0 && (
        <div className="converter-presets" aria-label="Common conversion values">
          <span>Try a value</span>
          <div>
            {presets.map((value) => (
              <button key={value} type="button" onClick={() => applyPreset(value)}>
                {formatLength(value)} {from}
              </button>
            ))}
          </div>
        </div>
      )}

      {involvesInches && (
        <div className="fraction-presets" aria-label="Fraction inch shortcuts">
          <span>Fractions</span>
          <div>
            {fractionPresets.map((value) => (
              <button key={value} type="button" onClick={() => applyFractionPreset(value)}>
                {value} in
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="result-detail" id={`${id}-result`} aria-live="polite">
        <div>
          <strong>{!inputIsValid || sourceValue === null || resultValue === null ? inputMessage : `${formatLength(sourceValue)} ${from} = ${formatLength(resultValue)} ${to}`}</strong>
          {inputIsValid && sourceValue !== null && resultValue !== null && <div className="subtle">
            {formatLength(sourceValue)} {from} × {formatLength(factor)} = {formatLength(resultValue)} {to}
          </div>}
        </div>
        <button className="copy-button" type="button" onClick={copy} disabled={!inputIsValid}>
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Unable to copy" : "Copy result"}
        </button>
      </div>

      {showVisualRuler && <VisualRuler inches={decimalInches} onSelect={applyRulerSelection} />}

      {!showVisualRuler && involvesInches && decimalInches !== null && (
        <div className="inch-extras">
          <div><span>Decimal inches</span><strong>{formatLength(decimalInches)} in</strong></div>
          <div><span>Feet + inches</span><strong>{decimalInchesToFeetAndInches(decimalInches)}</strong></div>
          <div><span>Nearest 1/16 inch</span><strong>{decimalInchesToFraction(decimalInches)}</strong></div>
        </div>
      )}
    </div>
  );
}
