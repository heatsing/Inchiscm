export type DimensionDirection = "in-to-cm" | "cm-to-in";
export type DimensionMode = 2 | 3;
export type DimensionUnit = "in" | "cm";

const centimetersPerInch = 2.54;
export const squareCentimetersPerSquareInch = 6.4516;
export const cubicCentimetersPerCubicInch = 16.387064;

const decimalPattern = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export function parseDimensionSide(value: string): number | null {
  const text = value.trim();
  if (!decimalPattern.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) && number > 0 ? number : null;
}

/** Read two or three sides in their original order; never infer or mix units. */
export function parseDimensionsInput(value: string, expectedUnit: DimensionUnit): number[] | null {
  const parts = value.trim().split(/\s*[x×]\s*/i);
  if (parts.length !== 2 && parts.length !== 3) return null;
  const dimensions: number[] = [];
  for (const part of parts) {
    const unitMatch = part.match(/\s*(inches|inch|in|centimeters|centimeter|cm|")\s*$/i);
    if (unitMatch) {
      const unit = /^(cm|centimeter)/i.test(unitMatch[1]) ? "cm" : "in";
      if (unit !== expectedUnit) return null;
    }
    const number = parseDimensionSide(unitMatch ? part.slice(0, unitMatch.index) : part);
    if (number === null) return null;
    dimensions.push(number);
  }
  return dimensions;
}

export function convertProductDimensions(values: readonly number[], direction: DimensionDirection): number[] | null {
  if ((values.length !== 2 && values.length !== 3) || values.some((value) => !Number.isFinite(value) || value <= 0)) return null;
  const result = values.map((value) => direction === "in-to-cm" ? value * centimetersPerInch : value / centimetersPerInch);
  return result.every((value) => Number.isFinite(value) && value > 0) ? result : null;
}

function decimalPlaces(value: number) {
  const [coefficient, exponent = "0"] = String(value).split("e");
  return Math.max(0, (coefficient.split(".")[1]?.length ?? 0) - Number(exponent));
}

export function dimensionAspectRatio(width: number, height: number): string | null {
  const places = Math.max(decimalPlaces(width), decimalPlaces(height));
  const scale = 10 ** places;
  const scaledWidth = Math.round(width * scale);
  const scaledHeight = Math.round(height * scale);
  if (!Number.isSafeInteger(scaledWidth) || !Number.isSafeInteger(scaledHeight) || scaledWidth <= 0 || scaledHeight <= 0) return null;
  let first = scaledWidth;
  let second = scaledHeight;
  while (second !== 0) [first, second] = [second, first % second];
  return `${scaledWidth / first}:${scaledHeight / first}`;
}

export function dimensionMeasures(values: readonly number[], direction: DimensionDirection) {
  const converted = convertProductDimensions(values, direction);
  if (!converted) return null;
  const mode = values.length as DimensionMode;
  const sourceMeasure = values.reduce((product, side) => product * side, 1);
  const factor = mode === 2 ? squareCentimetersPerSquareInch : cubicCentimetersPerCubicInch;
  const targetMeasure = direction === "in-to-cm" ? sourceMeasure * factor : sourceMeasure / factor;
  const liters = mode === 3 ? (direction === "in-to-cm" ? targetMeasure : sourceMeasure) / 1000 : null;
  if (![sourceMeasure, targetMeasure, liters ?? 1].every((value) => Number.isFinite(value) && value > 0)) return null;
  return { mode, converted, sourceMeasure, targetMeasure, liters, ratio: mode === 2 ? dimensionAspectRatio(values[0], values[1]) : null };
}

export function dimensionValueIsRounded(value: number, decimals: number) {
  return Math.abs(value - Number(value.toFixed(decimals))) > Math.abs(value) * Number.EPSILON * 4;
}

export function parseDimensionShareHash(hash: string, expectedUnit: DimensionUnit): number[] | null {
  const match = /^#size=([0-9.]+(?:x[0-9.]+){1,2})-(in|cm)$/.exec(hash);
  if (!match || match[2] !== expectedUnit) return null;
  return parseDimensionsInput(match[1], expectedUnit);
}
