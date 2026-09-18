import { formatNumber, inchesToCm } from "./conversions";

export type FractionCmSpec = {
  numerator: number;
  denominator: number;
};

export const FRACTION_CM_PAGES: readonly FractionCmSpec[] = [
  { numerator: 1, denominator: 8 },
  { numerator: 1, denominator: 4 },
  { numerator: 3, denominator: 8 },
  { numerator: 1, denominator: 2 },
  { numerator: 5, denominator: 8 },
  { numerator: 3, denominator: 4 },
  { numerator: 7, denominator: 8 },
];

export function fractionCmPath(numerator: number, denominator: number) {
  return `/fraction-${numerator}-${denominator}-inch-to-cm`;
}

export function fractionCmSlug(spec: FractionCmSpec) {
  return fractionCmPath(spec.numerator, spec.denominator).slice(1);
}

export function fractionMmPath(numerator: number, denominator: number) {
  return `/fraction-${numerator}-${denominator}-inch-to-mm`;
}

export function fractionLabel(spec: Pick<FractionCmSpec, "numerator" | "denominator">) {
  return `${spec.numerator}/${spec.denominator}`;
}

export function fractionCmPageLabel(spec: FractionCmSpec) {
  return `${fractionLabel(spec)} inch in cm`;
}

export function fractionInches(spec: Pick<FractionCmSpec, "numerator" | "denominator">) {
  return spec.numerator / spec.denominator;
}

export function parseFractionCmSlug(slug: string): FractionCmSpec | null {
  const match = slug.match(/^fraction-(\d+)-(\d+)-inch-to-cm$/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  return FRACTION_CM_PAGES.find((page) => page.numerator === numerator && page.denominator === denominator) ?? null;
}

export function findFractionCmPage(inches: number) {
  return FRACTION_CM_PAGES.find((page) => Math.abs(fractionInches(page) - inches) < 1e-9) ?? null;
}

export function getFractionCmPageData(spec: FractionCmSpec) {
  const inches = fractionInches(spec);
  const cm = inchesToCm(inches);
  const fraction = fractionLabel(spec);
  const decimalText = formatNumber(inches);
  const cmText = formatNumber(cm);
  const mmText = formatNumber(cm * 10);
  const path = fractionCmPath(spec.numerator, spec.denominator);

  return {
    path,
    slug: path.slice(1),
    fraction,
    inches,
    cm,
    decimalText,
    cmText,
    mmText,
    title: `${fraction} Inch in CM: ${cmText} cm | Fraction Converter`,
    description: `${fraction} inch equals exactly ${cmText} centimeters. See ${decimalText} decimal inches, ${mmText} mm, nearby eighths, and the fraction chart.`,
    h1: `${fraction} Inch in CM`,
    directAnswer: `${fraction} inch is exactly ${cmText} centimeters.`,
    formula: `${decimalText} × 2.54 = ${cmText} cm`,
    breadcrumbLabel: `${fraction} inch in cm`,
    searchIntent: `${fraction} inch to cm`,
  };
}
