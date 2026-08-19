import { cmToInches, formatNumber, inchesToCm } from "@/lib/conversions";
import { convertLength, decimalInchesToFraction, formatLength } from "@/lib/length-units";

export type ConversionIntentType =
  | "simple-conversion"
  | "height"
  | "fraction"
  | "screen-size"
  | "product-dimension"
  | "reference";

export type ConversionPageProfile = {
  value: number;
  fromUnit: string;
  toUnit: string;
  intentType: ConversionIntentType;
  exactResult: number;
  notableRelationships: string[];
  realWorldContexts: string[];
  relatedValues: number[];
  precisionNote: string;
  specialMeaning?: string;
};

const screenSizes = new Set([13.3, 14, 15.6, 17.3, 21.5, 24, 27, 32, 43, 55, 65, 75, 85]);

function unique(values: number[]) {
  return [...new Set(values.filter((value) => Number.isFinite(value) && value > 0))].sort((a, b) => a - b);
}

function inchRelationships(value: number) {
  const relationships: string[] = [];
  if (value === 12) relationships.push("12 inches is exactly 1 foot.");
  if (value === 24) relationships.push("24 inches is exactly 2 feet.");
  if (value === 36) relationships.push("36 inches is exactly 3 feet and exactly 1 yard.");
  if (value === 72) relationships.push("72 inches is exactly 6 feet.");
  if (value === 96) relationships.push("96 inches is exactly 8 feet.");
  if (Number.isInteger(value) && value % 12 === 0) relationships.push(`${formatNumber(value)} inches is exactly ${formatNumber(value / 12)} feet.`);
  if (screenSizes.has(value)) relationships.push(`${formatNumber(value)} inches is a common screen diagonal; width and height depend on aspect ratio.`);
  return [...new Set(relationships)];
}

function inchContexts(value: number) {
  if (value <= 1) return ["small hardware, craft marks, and ruler increments"];
  if (value < 12) return ["short product dimensions, notebook details, craft cuts, and tape-measure work"];
  if (value === 12) return ["rulers, shelves, picture frames, and one-foot references"];
  if (value <= 24) return ["screen diagonals, shelf depths, frames, packaging, and compact furniture dimensions"];
  if (value <= 60) return ["monitor and TV diagonals, furniture widths, shelves, and larger product dimensions"];
  return ["large displays, room planning, height-style references, and long product dimensions"];
}

export function getInchConversionProfile(value: number): ConversionPageProfile {
  const cm = inchesToCm(value);
  const relatedValues = unique([value - 1, value - 0.5, value, value + 0.5, value + 1]);
  return {
    value,
    fromUnit: "in",
    toUnit: "cm",
    intentType: screenSizes.has(value) ? "screen-size" : value < 1 || !Number.isInteger(value) ? "fraction" : "simple-conversion",
    exactResult: cm,
    notableRelationships: inchRelationships(value),
    realWorldContexts: inchContexts(value),
    relatedValues,
    precisionNote: "The inch-to-centimeter factor is exact: 1 inch = 2.54 centimeters. Only the displayed decimal places are rounded.",
    specialMeaning: screenSizes.has(value) ? "Screen sizes use the diagonal measurement, not the display width." : undefined,
  };
}

export function getCmConversionProfile(value: number): ConversionPageProfile {
  const inches = cmToInches(value);
  const relatedValues = unique([value - 5, value, value + 5]);
  const contexts = value >= 150 && value <= 200
    ? ["metric height entries, profile forms, sports references, and clothing-size context"]
    : value <= 30
      ? ["small product dimensions, craft measurements, hardware checks, and ruler work"]
      : ["product dimensions, package sizes, furniture fit, and metric-to-imperial comparisons"];
  return {
    value,
    fromUnit: "cm",
    toUnit: "in",
    intentType: value >= 150 && value <= 200 ? "height" : "simple-conversion",
    exactResult: inches,
    notableRelationships: [
      `${formatNumber(value)} cm is about ${decimalInchesToFraction(inches)} to the nearest 1/16 inch.`,
      ...(value % 100 === 0 ? [`${formatNumber(value)} cm is exactly ${formatNumber(value / 100)} meter${value === 100 ? "" : "s"}.`] : []),
    ],
    realWorldContexts: contexts,
    relatedValues,
    precisionNote: "Centimeters convert to inches by dividing by the exact 2.54 cm-per-inch definition. Fractional-inch output is a practical rounded reference.",
  };
}

export function getHeightConversionProfile(feet: number, inches: number): ConversionPageProfile {
  const totalInches = feet * 12 + inches;
  const cm = inchesToCm(totalInches);
  return {
    value: totalInches,
    fromUnit: "ft+in",
    toUnit: "cm",
    intentType: "height",
    exactResult: cm,
    notableRelationships: [
      `${feet}'${inches}" is ${formatNumber(totalInches)} total inches.`,
      `${feet}'${inches}" is ${formatLength(cm / 100, 4)} meters.`,
      `${feet}'${inches}" is ${formatLength(convertLength(totalInches, "in", "ft"), 4)} decimal feet.`,
    ],
    realWorldContexts: ["height charts, profile forms, school or travel forms, and international measurement references"],
    relatedValues: unique([totalInches - 1, totalInches, totalInches + 1]),
    precisionNote: "Height conversion uses total inches first, then the exact 2.54 cm-per-inch factor.",
    specialMeaning: "Feet-and-inches notation is not decimal feet notation.",
  };
}
