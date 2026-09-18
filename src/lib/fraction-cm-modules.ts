import {
  formatNumber,
  inchSlug,
  isIndexedInchValue,
} from "./conversions";
import {
  FRACTION_CM_PAGES,
  fractionCmPageLabel,
  fractionInches,
  fractionLabel,
  fractionMmPath,
  getFractionCmPageData,
  type FractionCmSpec,
} from "./fraction-cm";
import { nearbyPublishedWindow } from "./url-clusters";

export type FractionCmLink = { href: string; label: string };

export type FractionCmNearbyRow = {
  inches: number;
  href: string | null;
  label: string;
  cmText: string;
  mmText: string;
  decimalText: string;
};

export type FractionCmModules = {
  spec: FractionCmSpec;
  fraction: string;
  inches: number;
  decimalText: string;
  cmText: string;
  mmText: string;
  formula: string;
  rulerNote: string;
  nearby: FractionCmNearbyRow[];
  decimalTwin: FractionCmLink | null;
  mmTwin: FractionCmLink | null;
};

const PUBLISHED_FRACTION_MM = new Set([
  "fraction-1-8-inch-to-mm",
  "fraction-1-4-inch-to-mm",
  "fraction-3-8-inch-to-mm",
  "fraction-1-2-inch-to-mm",
]);

function rulerNote(spec: FractionCmSpec) {
  const eighths = (spec.numerator * 8) / spec.denominator;
  const eighthsText = Number.isInteger(eighths) ? String(eighths) : formatNumber(eighths);
  if (spec.denominator === 8) {
    return `${fractionLabel(spec)} inch is ${eighthsText} eighth-inch mark${eighths === 1 ? "" : "s"} past a whole inch.`;
  }
  return `${fractionLabel(spec)} inch is ${eighthsText}/8 on an eighths scale.`;
}

export function publishedFractionMmHref(spec: FractionCmSpec) {
  const slug = fractionMmPath(spec.numerator, spec.denominator).slice(1);
  return PUBLISHED_FRACTION_MM.has(slug) ? `/${slug}` : null;
}

export function getFractionCmModules(spec: FractionCmSpec): FractionCmModules {
  const data = getFractionCmPageData(spec);
  const values = FRACTION_CM_PAGES.map(fractionInches);
  const mmHref = publishedFractionMmHref(spec);

  return {
    spec,
    fraction: data.fraction,
    inches: data.inches,
    decimalText: data.decimalText,
    cmText: data.cmText,
    mmText: data.mmText,
    formula: data.formula,
    rulerNote: rulerNote(spec),
    nearby: [
      ...nearbyPublishedWindow(values, data.inches, 2).map((inches) => {
        const page = FRACTION_CM_PAGES.find((item) => fractionInches(item) === inches);
        if (!page) {
          return {
            inches,
            href: null,
            label: formatNumber(inches),
            cmText: "",
            mmText: "",
            decimalText: formatNumber(inches),
          };
        }
        const row = getFractionCmPageData(page);
        return {
          inches,
          href: row.path,
          label: fractionCmPageLabel(page),
          cmText: `${row.cmText} cm`,
          mmText: `${row.mmText} mm`,
          decimalText: `${row.decimalText} in`,
        };
      }),
      {
        inches: data.inches,
        href: null,
        label: fractionCmPageLabel(spec),
        cmText: `${data.cmText} cm`,
        mmText: `${data.mmText} mm`,
        decimalText: `${data.decimalText} in`,
      },
    ].sort((left, right) => left.inches - right.inches),
    decimalTwin: isIndexedInchValue(data.inches)
      ? { href: inchSlug(data.inches), label: `${data.decimalText} inch in cm` }
      : null,
    mmTwin: mmHref
      ? { href: mmHref, label: `${data.fraction} inch to mm` }
      : null,
  };
}
