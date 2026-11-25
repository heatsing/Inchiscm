import { cmToInches, formatNumber, isRoundedCmToInches } from "./conversions";
import { heightFeetInchesMark } from "./height-seo";
import { isPublishedHeight } from "./url-clusters";

function inchNoun(value: number) {
  return value === 1 ? "inch" : "inches";
}

export function cmExactInchText(value: number) {
  return formatNumber(cmToInches(value));
}

export function cmHeightReference(value: number, inches: number) {
  const totalInches = Math.round(inches);
  if (Math.abs(inches - totalInches) >= 0.05 && !(value >= 140 && value <= 210)) return null;
  const feet = Math.floor(totalInches / 12);
  const remainingInches = totalInches % 12;
  if (!isPublishedHeight(feet, remainingInches)) return null;
  return { feet, inches: remainingInches, isApproximate: isRoundedCmToInches(value, totalInches) };
}

export function cmSeoCopy(value: number) {
  const inches = cmToInches(value);
  const valueText = formatNumber(value);
  const inchText = formatNumber(inches);
  const inchUnit = inchNoun(inches);
  const height = cmHeightReference(value, inches);
  const heightMark = height ? heightFeetInchesMark(height.feet, height.inches) : null;
  const isRounded = isRoundedCmToInches(value, inches);
  const heightSuffix = heightMark ? ` (${height?.isApproximate ? "about " : ""}${heightMark})` : "";
  const inchWithHeight = `${isRounded ? "≈ " : ""}${inchText} in${heightSuffix}`;
  const title = `${valueText} CM in Inches: ${inchWithHeight} | CM Converter`;
  const ogTitle = title;
  const descriptionContext = height?.isApproximate
    ? "Compare with the nearest whole-inch height and see the conversion formula."
    : isRounded
      ? "See the conversion formula and the nearest tape-measure fraction."
      : "See the division by 2.54 and nearby centimeter conversions.";
  const description = `${valueText} cm ${isRounded ? "is approximately" : "equals exactly"} ${inchText} ${inchUnit}${heightSuffix}. ${descriptionContext}`;
  const h1 = `${valueText} CM in Inches: ${inchWithHeight}`;
  const directAnswer = `${valueText} centimeters is ${isRounded ? "approximately" : "exactly"} ${inchText} ${inchUnit}${heightSuffix}.`;
  const formula = `${valueText} ÷ 2.54 ${isRounded ? "≈" : "="} ${inchText} ${inchUnit}`;

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
