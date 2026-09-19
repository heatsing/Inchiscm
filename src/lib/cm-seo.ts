import { cmToInches, formatNumber } from "./conversions";

function inchNoun(value: number) {
  return value === 1 ? "inch" : "inches";
}

export function cmExactInchText(value: number) {
  return formatNumber(cmToInches(value));
}

export function cmSeoCopy(value: number) {
  const inches = cmToInches(value);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const inchUnit = inchNoun(inches);
  const title = `${valueText} CM in Inches: ${inchText} in | CM Converter`;
  const ogTitle = title;
  const description = `${valueText} cm equals ${inchText} ${inchUnit}. See the cm-to-inches formula, rounded result, nearby values, and fractional inch guidance.`;
  const h1 = `${valueText} CM in Inches: ${inchText} in`;
  const directAnswer = `${valueText} centimeters is approximately ${inchText} ${inchUnit}.`;

  return {
    inches,
    valueText,
    inchText,
    inchUnit,
    title,
    ogTitle,
    description,
    h1,
    directAnswer,
  };
}
