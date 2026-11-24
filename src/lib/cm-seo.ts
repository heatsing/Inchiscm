import { cmToInches, formatNumber, isExpandedWholeCentimeterValue } from "./conversions";
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
  const isExpanded = isExpandedWholeCentimeterValue(value);
  const heightSuffix = heightMark ? ` (${isExpanded ? "about " : ""}${heightMark})` : "";
  const inchWithHeight = `${isExpanded ? "≈ " : ""}${inchText} in${heightSuffix}`;
  const title = `${valueText} CM in Inches: ${inchWithHeight} | CM Converter`;
  const ogTitle = title;
  const description = `${valueText} cm ${isExpanded ? "is approximately" : "equals"} ${inchText} ${inchUnit}${heightSuffix}. See the cm-to-inches formula, rounded result, nearby values, and fractional inch guidance.`;
  const h1 = `${valueText} CM in Inches: ${inchWithHeight}`;
  const directAnswer = `${valueText} centimeters is ${!heightMark || isExpanded ? "approximately " : ""}${inchText} ${inchUnit}${heightSuffix}.`;
  const formula = `${valueText} ÷ 2.54 ${isExpanded ? "≈" : "="} ${inchText} inches`;

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
    formula,
  };
}
