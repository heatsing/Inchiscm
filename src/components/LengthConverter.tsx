"use client";

import { useId, useMemo, useState } from "react";
import {
  conversionFactor,
  convertLength,
  decimalInchesToFeetAndInches,
  decimalInchesToFraction,
  formatLength,
  lengthUnits,
  type LengthUnit,
} from "@/lib/length-units";

function track(event: string, details: Record<string, string | number> = {}) {
  const win = window as typeof window & { dataLayer?: Record<string, unknown>[] };
  win.dataLayer?.push({ event, ...details });
}

export function LengthConverter({
  defaultFrom = "in",
  defaultTo = "cm",
  defaultValue = 10,
  compact = false,
}: {
  defaultFrom?: LengthUnit;
  defaultTo?: LengthUnit;
  defaultValue?: number;
  compact?: boolean;
}) {
  const id = useId();
  const [from, setFrom] = useState<LengthUnit>(defaultFrom);
  const [to, setTo] = useState<LengthUnit>(defaultTo);
  const [input, setInput] = useState(String(defaultValue));
  const [copied, setCopied] = useState(false);

  const parsedInput = Number(input);
  const inputIsValid = input.trim() !== "" && Number.isFinite(parsedInput) && parsedInput >= 0;
  const result = useMemo(
    () => inputIsValid ? convertLength(parsedInput, from, to) : null,
    [inputIsValid, parsedInput, from, to],
  );
  const factor = conversionFactor(from, to);
  const involvesInches = from === "in" || to === "in";
  const decimalInches = inputIsValid ? convertLength(parsedInput, from, "in") : null;

  function convert() {
    if (!inputIsValid) return;
    track("converter_input", { from, to, value: parsedInput });
  }

  function reset() {
    setFrom(defaultFrom);
    setTo(defaultTo);
    setInput(String(defaultValue));
  }

  function swap() {
    if (result === null) return;
    const nextFrom = to;
    const nextTo = from;
    setFrom(nextFrom);
    setTo(nextTo);
    setInput(formatLength(result));
    track("converter_swap", { from: nextFrom, to: nextTo });
  }

  async function copy() {
    if (result === null) return;
    await navigator.clipboard.writeText(`${formatLength(result)} ${to}`);
    setCopied(true);
    track("result_copy", { from, to, value: result });
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className={`converter-card length-converter${compact ? " compact" : ""}`}>
      <div className="length-unit-row">
        <div className="field">
          <label htmlFor={`${id}-from`}>From unit</label>
          <select id={`${id}-from`} value={from} onChange={(event) => setFrom(event.target.value as LengthUnit)}>
            {lengthUnits.map((unit) => <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>)}
          </select>
        </div>
        <button className="swap-button" type="button" onClick={swap} aria-label="Swap units">⇄</button>
        <div className="field">
          <label htmlFor={`${id}-to`}>To unit</label>
          <select id={`${id}-to`} value={to} onChange={(event) => setTo(event.target.value as LengthUnit)}>
            {lengthUnits.map((unit) => <option key={unit.symbol} value={unit.symbol}>{unit.name} ({unit.symbol})</option>)}
          </select>
        </div>
      </div>

      <div className="length-value-row">
        <div className="field">
          <label htmlFor={`${id}-input`}>Value</label>
          <div className="field-wrap">
            <input
              id={`${id}-input`}
              inputMode="decimal"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") convert(); }}
              aria-describedby={`${id}-result`}
            />
            <span className="unit">{from}</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor={`${id}-output`}>Result</label>
          <div className="field-wrap">
            <input id={`${id}-output`} value={result === null ? "" : formatLength(result)} readOnly tabIndex={-1} />
            <span className="unit">{to}</span>
          </div>
        </div>
      </div>

      <div className="converter-actions">
        <button className="button primary" type="button" onClick={convert} disabled={!inputIsValid}>Convert</button>
        <button className="button" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="result-detail" id={`${id}-result`} aria-live="polite">
        <div>
          <strong>{result === null ? "Enter a valid length" : `${formatLength(parsedInput)} ${from} = ${formatLength(result)} ${to}`}</strong>
          {result !== null && <div className="subtle">
            {formatLength(parsedInput)} {from} × {formatLength(factor)} = {formatLength(result)} {to}
          </div>}
        </div>
        <button className="copy-button" type="button" onClick={copy} disabled={result === null}>{copied ? "Copied" : "Copy result"}</button>
      </div>

      {involvesInches && decimalInches !== null && (
        <div className="inch-extras">
          <div><span>Decimal inches</span><strong>{formatLength(decimalInches)} in</strong></div>
          <div><span>Feet + inches</span><strong>{decimalInchesToFeetAndInches(decimalInches)}</strong></div>
          <div><span>Nearest 1/16 inch</span><strong>{decimalInchesToFraction(decimalInches)}</strong></div>
        </div>
      )}
    </div>
  );
}
