"use client";

import { useId, type KeyboardEvent, type PointerEvent } from "react";
import { convertLength, decimalInchesToFeetAndInches, decimalInchesToFraction, exactDyadicInchFraction, formatLength } from "@/lib/length-units";
import { clampRulerInches, RULER_MAX_INCHES, RULER_TICKS_PER_INCH, snapRulerInches, stepRulerInches } from "@/lib/ruler-scale";
import "./visual-ruler.css";

const scaleLeft = 22;
const scaleWidth = 676;
const inchBaseline = 76;
const cmBaseline = 81;
const tickX = (inches: number) => Math.round((scaleLeft + (inches / RULER_MAX_INCHES) * scaleWidth) * 100) / 100;
const maxMillimeters = Math.floor(convertLength(RULER_MAX_INCHES, "in", "mm"));

const inchMarks = Array.from({ length: RULER_MAX_INCHES * RULER_TICKS_PER_INCH + 1 }, (_, index) => {
  const length = index % 16 === 0 ? 29 : index % 8 === 0 ? 23 : index % 4 === 0 ? 18 : index % 2 === 0 ? 13 : 8;
  return `M${tickX(index / RULER_TICKS_PER_INCH)} ${inchBaseline}v-${length}`;
}).join("");

const cmMarks = Array.from({ length: maxMillimeters + 1 }, (_, millimeters) => {
  const length = millimeters % 10 === 0 ? 24 : millimeters % 5 === 0 ? 16 : 9;
  return `M${tickX(convertLength(millimeters, "mm", "in"))} ${cmBaseline}v${length}`;
}).join("");

const inchLabels = Array.from({ length: RULER_MAX_INCHES + 1 }, (_, inches) => inches);
const cmLabels = Array.from({ length: Math.floor(maxMillimeters / 50) + 1 }, (_, index) => index * 5);

const keyboardSteps: Readonly<Partial<Record<string, number>>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
  PageDown: -RULER_TICKS_PER_INCH,
  PageUp: RULER_TICKS_PER_INCH,
};

function fractionReading(inches: number) {
  const fraction = exactDyadicInchFraction(inches);
  const nearest = decimalInchesToFraction(inches, RULER_TICKS_PER_INCH).slice(0, -1);
  if (fraction) return `${fraction.slice(0, -1)} in`;
  if (Math.abs(inches - Math.round(inches)) < 1e-9) return `${nearest} in`;
  return `≈ ${nearest} in`;
}

export function VisualRuler({ inches, onSelect }: { inches: number | null; onSelect: (inches: number) => void }) {
  const hintId = useId();
  const valid = inches !== null && Number.isFinite(inches);
  const selected = valid ? clampRulerInches(inches) : 0;
  const outside = valid && inches > RULER_MAX_INCHES + 1e-9;
  const cursor = valid && !outside ? tickX(selected) : null;

  function selectPointer(event: PointerEvent<SVGSVGElement>) {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    if (Number.isFinite(point.x)) onSelect(snapRulerInches(((point.x - scaleLeft) / scaleWidth) * RULER_MAX_INCHES));
  }

  function selectWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const ticks = keyboardSteps[event.key];
    if (ticks !== undefined) {
      event.preventDefault();
      onSelect(stepRulerInches(selected, ticks));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      onSelect(event.key === "Home" ? 0 : RULER_MAX_INCHES);
    }
  }

  const readings = [
    ["Decimal Inches", valid ? `${formatLength(inches)} in` : "—"],
    ["Fraction Inches", valid ? fractionReading(inches) : "—"],
    ["CM", valid ? `${formatLength(convertLength(inches, "in", "cm"))} cm` : "—"],
    ["MM", valid ? `${formatLength(convertLength(inches, "in", "mm"))} mm` : "—"],
  ] as const;

  return (
    <section className="visual-ruler" id="visual-ruler">
      <h2>Visual ruler</h2>
      <p className="subtle" id={hintId}>Tap, click, drag, or use the arrow keys to select from 0 to 12 inches in 1/16-inch steps.</p>

      <div
        className="visual-ruler-scale"
        role="slider"
        tabIndex={0}
        aria-label="Ruler position"
        aria-describedby={hintId}
        aria-valuemin={0}
        aria-valuemax={RULER_MAX_INCHES}
        aria-valuenow={selected}
        aria-valuetext={`${formatLength(selected)} inches, ${formatLength(convertLength(selected, "in", "cm"))} centimeters`}
        onKeyDown={selectWithKeyboard}
      >
        <svg
          viewBox="0 0 720 156"
          aria-hidden="true"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            if (event.pointerType !== "touch") event.currentTarget.parentElement?.focus({ preventScroll: true });
            event.currentTarget.setPointerCapture(event.pointerId);
            selectPointer(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) selectPointer(event);
          }}
        >
          <path className="visual-ruler-inch-marks" d={`M${scaleLeft} ${inchBaseline}h${scaleWidth}${inchMarks}`} vectorEffect="non-scaling-stroke" />
          <path className="visual-ruler-cm-marks" d={`M${scaleLeft} ${cmBaseline}h${scaleWidth}${cmMarks}`} vectorEffect="non-scaling-stroke" />
          <text className="visual-ruler-unit" x={scaleLeft} y="20">INCHES</text>
          {inchLabels.map((label) => (
            <text key={label} className={label % 2 ? "visual-ruler-minor-label" : undefined} x={tickX(label)} y="44" textAnchor="middle">{label}</text>
          ))}
          {cmLabels.map((label) => (
            <text key={label} x={tickX(convertLength(label, "cm", "in"))} y="126" textAnchor="middle">{label}</text>
          ))}
          <text className="visual-ruler-unit" x={scaleLeft} y="149">CENTIMETERS</text>
          {cursor !== null && (
            <line className="visual-ruler-cursor" x1={cursor} x2={cursor} y1="48" y2="111" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
      </div>

      {outside && <p className="subtle visual-ruler-note">This length is beyond the 12-inch ruler.</p>}

      <dl className="visual-ruler-readings">
        {readings.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      {valid && <p className="subtle visual-ruler-note">Feet + inches: {decimalInchesToFeetAndInches(inches)}</p>}
    </section>
  );
}
