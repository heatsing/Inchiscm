export type DimensionDirection = "in-to-cm" | "cm-to-in";
export type DimensionMode = 2 | 3;
export type DimensionUnit = "in" | "cm";

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
  const result = values.map((value) => direction === "in-to-cm" ? value * 2.54 : value / 2.54);
  return result.every((value) => Number.isFinite(value) && value > 0) ? result : null;
}
