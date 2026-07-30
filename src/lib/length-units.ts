export type LengthUnit = "mm" | "cm" | "m" | "km" | "in" | "ft" | "yd" | "mi";

export type LengthUnitDefinition = {
  symbol: LengthUnit;
  name: string;
  meters: number;
};

export const lengthUnits: LengthUnitDefinition[] = [
  { symbol: "mm", name: "Millimeter", meters: 0.001 },
  { symbol: "cm", name: "Centimeter", meters: 0.01 },
  { symbol: "m", name: "Meter", meters: 1 },
  { symbol: "km", name: "Kilometer", meters: 1000 },
  { symbol: "in", name: "Inch", meters: 0.0254 },
  { symbol: "ft", name: "Foot", meters: 0.3048 },
  { symbol: "yd", name: "Yard", meters: 0.9144 },
  { symbol: "mi", name: "Mile", meters: 1609.344 },
];

const unitMap = new Map(lengthUnits.map((unit) => [unit.symbol, unit]));

export function convertLength(value: number, from: LengthUnit, to: LengthUnit) {
  const fromUnit = unitMap.get(from);
  const toUnit = unitMap.get(to);
  if (!fromUnit || !toUnit) throw new Error("Unsupported length unit");
  return (value * fromUnit.meters) / toUnit.meters;
}

export function conversionFactor(from: LengthUnit, to: LengthUnit) {
  return convertLength(1, from, to);
}

export function formatLength(value: number, maximumFractionDigits = 8) {
  if (!Number.isFinite(value)) return "";
  const normalized = Math.abs(value) < 1e-12 ? 0 : value;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    useGrouping: true,
  }).format(normalized);
}

const unicodeFractions = new Map<string, number>([
  ["¼", 1 / 4],
  ["½", 1 / 2],
  ["¾", 3 / 4],
  ["⅐", 1 / 7],
  ["⅑", 1 / 9],
  ["⅒", 1 / 10],
  ["⅓", 1 / 3],
  ["⅔", 2 / 3],
  ["⅕", 1 / 5],
  ["⅖", 2 / 5],
  ["⅗", 3 / 5],
  ["⅘", 4 / 5],
  ["⅙", 1 / 6],
  ["⅚", 5 / 6],
  ["⅛", 1 / 8],
  ["⅜", 3 / 8],
  ["⅝", 5 / 8],
  ["⅞", 7 / 8],
]);

export function parseLengthInput(input: string) {
  const normalized = input.trim().replace(/[–—]/g, "-");
  if (!normalized) return null;

  const unicodeMatch = normalized.match(/^(\d+(?:\.\d+)?)?\s*([¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])$/u);
  if (unicodeMatch) {
    const whole = unicodeMatch[1] ? Number(unicodeMatch[1]) : 0;
    const fraction = unicodeFractions.get(unicodeMatch[2]);
    return fraction === undefined ? null : whole + fraction;
  }

  const mixedMatch = normalized.match(/^(\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/);
  const hyphenMixedMatch = normalized.match(/^(\d+(?:\.\d+)?)-(\d+)\/(\d+)$/);
  const fractionMatch = normalized.match(/^(\d+)\/(\d+)$/);
  const matchedFraction = mixedMatch ?? hyphenMixedMatch ?? fractionMatch;
  if (matchedFraction) {
    const hasWhole = matchedFraction.length === 4;
    const whole = hasWhole ? Number(matchedFraction[1]) : 0;
    const numerator = Number(matchedFraction[hasWhole ? 2 : 1]);
    const denominator = Number(matchedFraction[hasWhole ? 3 : 2]);
    if (!Number.isFinite(whole) || !Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
    return whole + numerator / denominator;
  }

  const parsed = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

export function decimalInchesToFraction(value: number, denominator = 16) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  let whole = Math.floor(absolute);
  let numerator = Math.round((absolute - whole) * denominator);

  if (numerator === denominator) {
    whole += 1;
    numerator = 0;
  }

  if (numerator === 0) return `${sign}${whole}"`;
  const divisor = greatestCommonDivisor(numerator, denominator);
  const fraction = `${numerator / divisor}/${denominator / divisor}`;
  return `${sign}${whole ? `${whole} ` : ""}${fraction}"`;
}

export function decimalInchesToFeetAndInches(value: number) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const feet = Math.floor(absolute / 12);
  const inches = absolute - feet * 12;
  return `${sign}${feet} ft ${formatLength(inches, 4)} in`;
}
