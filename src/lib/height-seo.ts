import { formatNumber, heightToCm } from "./conversions";

function footNoun(value: number) {
  return value === 1 ? "foot" : "feet";
}

function inchNoun(value: number) {
  return value === 1 ? "inch" : "inches";
}

export function heightFullLabel(feet: number, inches: number) {
  if (inches === 0) return `${feet} ${footNoun(feet)}`;
  return `${feet} ${footNoun(feet)} ${inches} ${inchNoun(inches)}`;
}

export function heightShortLabel(feet: number, inches: number) {
  // ASCII feet/inches marks. Do not pre-encode HTML entities —
  // React 19 would double-escape them. Title/H1 HTML is unescaped after export.
  return inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;
}

export function heightFeetInchesMark(feet: number, inches: number) {
  return `${feet}'${inches}"`;
}

export function heightExactCmText(feet: number, inches: number) {
  return formatNumber(heightToCm(feet, inches));
}

export function heightSeoCopy(feet: number, inches: number) {
  const totalInches = feet * 12 + inches;
  const result = heightToCm(feet, inches);
  const resultText = formatNumber(result);
  const label = heightShortLabel(feet, inches);
  const fullLabel = heightFullLabel(feet, inches);
  const title = `${label} in CM: ${resultText} cm | Height`;
  const ogTitle = title;
  const description = `${label} = ${resultText} cm exactly (${fullLabel}, ${totalInches} total inches). How tall is ${label} in cm? Convert with (ft × 12 + in) × 2.54.`;
  const h1 = `${label} in CM: ${resultText} cm`;
  const directAnswer = `${label} (${fullLabel}) is exactly ${resultText} cm — ${totalInches} total inches × 2.54.`;

  return {
    totalInches,
    result,
    resultText,
    label,
    fullLabel,
    title,
    ogTitle,
    description,
    h1,
    directAnswer,
  };
}
