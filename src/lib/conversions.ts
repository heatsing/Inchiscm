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

// Canonical numeric inch paths above are the SSG/sitemap URLs.
// 404 aliases such as /{n}-inches-to-cm are generated from the same inventory
// by src/data/page-registry/inch-alias-redirects.mjs into out/_redirects.

export function cmSlug(value: number) {
  return `/${numberToSlug(value)}-cm-in-inches`;
}

// Canonical numeric cm paths above are the SSG/sitemap URLs.
// 404 aliases such as /{n}-cm-to-inches and dotted /76.2-cm-in-inches are
// generated from the same inventory by inch-alias-redirects.mjs into out/_redirects.

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

// Canonical height paths above are the SSG/sitemap URLs (/5-7-in-cm = 5'7").
// Closed feet/foot wording aliases such as /5-feet-7-inches-in-cm, plus GSC
// compact / dotted / apostrophe / F-I-to-cm / feet-to-cm / 6.11-feet /
// how-tall / height-cm / EU-comma (literal + %2C/%2c) / glued-10-11 aliases
// (/6ft11-in-cm, /how-tall-is-6-11-in-cm, /6,11-in-cm, /6%2C11-in-cm, /611-in-cm),
// are generated from the same `heights` inventory into out/_redirects.

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
