import seoPolicy from "../../seo-page-policy.json";
import { conversionFactor } from "./length-units";

export const INCH_IN_CM = conversionFactor("in", "cm");

export function round(value: number, places = 4) {
  return Number(value.toFixed(places));
}

export function formatNumber(value: number, places = 4) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: places,
    useGrouping: false,
  }).format(round(value, places));
}

export function inchesToCm(inches: number) {
  return round(inches * INCH_IN_CM);
}

export function cmToInches(cm: number) {
  return round(cm / INCH_IN_CM);
}

export function numberToSlug(value: number) {
  return String(value).replace(".", "-");
}

export function inchSlug(value: number) {
  const unit = value === 1 || value < 1 || (!Number.isInteger(value) && screenInches.includes(value)) ? "inch" : "inches";
  return `/${numberToSlug(value)}-${unit}-in-cm`;
}

export function cmSlug(value: number) {
  return `/${numberToSlug(value)}-cm-in-inches`;
}

export function parseSlugNumber(value: string) {
  const parsed = Number(value.replace("-", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function heightToCm(feet: number, inches: number) {
  return inchesToCm(feet * 12 + inches);
}

export function heightSlug(feet: number, inches: number) {
  return inches === 0 ? `/${feet}-feet-in-cm` : `/${feet}-${inches}-in-cm`;
}

export const integerInches = Array.from({ length: seoPolicy.wholeInchesMax }, (_, i) => i + 1);
export const screenInches = seoPolicy.screenInches;
export const allInchValues = [...new Set([...integerInches, ...seoPolicy.decimalInches, ...screenInches])].sort((a, b) => a - b);
export const wholeCentimeterValues = Array.from({ length: seoPolicy.wholeCentimetersMax }, (_, i) => i + 1);
export const reverseCentimeterValues = seoPolicy.approvedReverseCentimeters;
export const centimeterValues = [...new Set([...wholeCentimeterValues, ...reverseCentimeterValues])].sort((a, b) => a - b);
export const heights = Array.from(
  { length: seoPolicy.heightMaxTotalInches - seoPolicy.heightMinTotalInches + 1 },
  (_, i) => {
  const total = seoPolicy.heightMinTotalInches + i;
  return { feet: Math.floor(total / 12), inches: total % 12 };
});

export function nearbyValues(values: number[], current: number) {
  const index = values.findIndex((value) => value === current);
  return {
    previous: index > 0 ? values[index - 1] : null,
    next: index >= 0 && index < values.length - 1 ? values[index + 1] : null,
  };
}

export function isIndexedInchValue(value: number) {
  return allInchValues.includes(round(value));
}

export function isIndexedCmValue(value: number) {
  return centimeterValues.includes(round(value));
}
