import { cmToInches, formatNumber } from "./conversions";
import { heightFeetInchesMark } from "./height-seo";
import { isPublishedHeight } from "./url-clusters";

function inchNoun(value: number) {
  return value === 1 ? "inch" : "inches";
}

export function cmExactInchText(value: number) {
  return formatNumber(cmToInches(value));
}

/** Match getCmNumericModules / cmHeightEntry: published height when inches land on a whole published pair. */
export function cmHeightFeetInchesMark(value: number): string | null {
  const inches = cmToInches(value);
  const rounded = Math.round(inches);
  const exactEnough = Math.abs(inches - rounded) < 0.05;
  if (!exactEnough && !(value >= 140 && value <= 210)) return null;
  if (!Number.isInteger(rounded) || rounded <= 0) return null;
  const feet = Math.floor(rounded / 12);
  const rem = rounded % 12;
  if (!isPublishedHeight(feet, rem)) return null;
  return heightFeetInchesMark(feet, rem);
}

export function cmSeoCopy(value: number) {
  const inches = cmToInches(value);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const inchUnit = inchNoun(inches);
  const heightMark = cmHeightFeetInchesMark(value);
  const inchWithHeight = heightMark ? `${inchText} in (${heightMark})` : `${inchText} in`;
  const title = `${valueText} CM in Inches: ${inchWithHeight} | CM Converter`;
  const ogTitle = title;
  const description = heightMark
    ? `${valueText} cm equals ${inchText} ${inchUnit} (${heightMark}). See the cm-to-inches formula, rounded result, nearby values, and fractional inch guidance.`
    : `${valueText} cm equals ${inchText} ${inchUnit}. See the cm-to-inches formula, rounded result, nearby values, and fractional inch guidance.`;
  const h1 = `${valueText} CM in Inches: ${inchWithHeight}`;
  const directAnswer = heightMark
    ? `${valueText} centimeters is ${inchText} ${inchUnit} (${heightMark}).`
    : `${valueText} centimeters is approximately ${inchText} ${inchUnit}.`;

  return {
    inches,
    valueText,
    inchText,
    inchUnit,
    heightMark,
    title,
    ogTitle,
    description,
    h1,
    directAnswer,
  };
}
