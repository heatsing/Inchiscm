import { formatLength } from "@/lib/length-units";
import { dimensionMeasures, dimensionValueIsRounded, type DimensionDirection, type DimensionMode, type DimensionUnit } from "@/lib/product-dimensions";

type Kind = "Prints & frames" | "Paper & posters" | "Panels & furniture" | "Boxes & packaging" | "Luggage";
type Candidate = readonly [dimensions: readonly number[], kind: Kind, example: string, existingPath?: string];

const inches2D: readonly Candidate[] = [
  [[4, 6], "Prints & frames", "Compare a 4 × 6 print with a metric frame opening.", "/4x6-photo-size-in-cm"],
  [[5, 7], "Prints & frames", "Check the full paper size before choosing an insert or mat.", "/photo-print-sizes-in-cm"],
  [[8, 10], "Prints & frames", "Use the paper edges for an 8 × 10 portrait print or nominal frame insert."],
  [[8.5, 11], "Paper & posters", "Check the actual width and height of US Letter paper.", "/a4-paper-size-in-inches-and-cm"],
  [[11, 14], "Prints & frames", "Compare the back opening of a frame with the nominal insert.", "/11x14-frame-size-in-cm"],
  [[11, 17], "Paper & posters", "Use both sides of Tabloid paper for a print layout or sign.", "/common-product-dimensions-in-cm"],
  [[12, 18], "Paper & posters", "Compare a 12 × 18 print with an available poster frame."],
  [[16, 20], "Prints & frames", "Measure the canvas face separately from the wrapped edges.", "/canvas-print-sizes-in-cm"],
  [[18, 24], "Paper & posters", "Compare an 18 × 24 poster with the advertised frame insert.", "/poster-sizes-in-cm"],
  [[24, 36], "Paper & posters", "Compare a 24 × 36 poster with the smaller 60 × 90 cm format.", "/24x36-poster-size-in-cm"],
];

const centimeters2D: readonly Candidate[] = [
  [[10, 15], "Prints & frames", "Compare a true 10 × 15 cm print with a 4 × 6 inch print.", "/4x6-photo-size-in-cm"],
  [[13, 18], "Prints & frames", "Check whether a metric photo fits the measured frame recess."],
  [[20, 30], "Prints & frames", "Compare an actual 20 × 30 cm print with inch-size frames."],
  [[30, 40], "Prints & frames", "Compare both sides of a 30 × 40 cm frame insert before trimming a print."],
  [[40, 60], "Paper & posters", "Plan the opening for a 40 × 60 cm poster before adding a border."],
  [[50, 70], "Paper & posters", "Measure the 50 × 70 cm paper edges separately from the outside frame."],
  [[60, 90], "Paper & posters", "Compare a 60 × 90 cm poster with the larger 24 × 36 inch format.", "/24x36-poster-size-in-cm"],
  [[70, 100], "Paper & posters", "Check a 70 × 100 cm print against a wall opening or frame."],
  [[80, 120], "Panels & furniture", "Convert both edges of a large flat panel before comparing shelf or wall space."],
];

const inches3D: readonly Candidate[] = [
  [[9, 14, 22], "Luggage", "Read the same 22 × 14 × 9 inch case with the sides listed in reverse order.", "/dimensions/22x14x9-inches-to-cm"],
  [[18, 14, 8], "Boxes & packaging", "Compare an 18 × 14 × 8 inch carton with available shipping space."],
  [[18, 14, 12], "Boxes & packaging", "Compare nominal outside dimensions with usable packing space.", "/18x14x12-box-size-in-cm"],
  [[21, 14, 9], "Luggage", "Measure the case, including wheels and handles, against available space.", "/21x14x9-luggage-size-in-cm"],
  [[22, 14, 9], "Luggage", "Compare a nominal carry-on case with a measured storage opening or a carrier's published dimensions."],
  [[22, 18, 10], "Luggage", "Check all three outside dimensions before deciding whether the case fits."],
  [[24, 16, 10], "Boxes & packaging", "Compare the carton exterior with its smaller internal packing space."],
  [[28, 22, 14], "Luggage", "Use the measured outside case size when planning storage or transport."],
  [[12, 8, 4], "Boxes & packaging", "Check the outside size of a compact shipping box.", "/common-product-dimensions-in-cm"],
  [[16, 12, 8], "Boxes & packaging", "Compare the outside dimensions of a medium carton against its destination shelf."],
];

const centimeters3D: readonly Candidate[] = [
  [[40, 30, 15], "Boxes & packaging", "Compare an 18 L rectangular envelope with a deeper carton."],
  [[40, 30, 20], "Boxes & packaging", "Compare external box dimensions and the 24 L rectangular envelope."],
  [[45, 36, 20], "Luggage", "Check a small travel bag by measuring the body, handles, and wheels."],
  [[55, 35, 25], "Luggage", "Use all three sides when comparing case depth with a measured opening."],
  [[55, 40, 20], "Luggage", "Compare the outside depth of a shallow travel case with a storage compartment."],
  [[55, 40, 23], "Luggage", "Compare this 23 cm depth with the shallower 20 cm version."],
  [[56, 36, 23], "Luggage", "Check the height, width, and depth against a specific baggage allowance."],
  [[56, 45, 25], "Luggage", "Measure the widest outside points of the case before checking fit."],
];

export function dimensionHub(direction: DimensionDirection) {
  return direction === "in-to-cm" ? "/inches-to-cm-dimensions" : "/cm-to-inches-dimensions";
}

export function oppositeDimensionDirection(direction: DimensionDirection): DimensionDirection {
  return direction === "in-to-cm" ? "cm-to-in" : "in-to-cm";
}

export function dimensionShareHref(direction: DimensionDirection, values: readonly number[]) {
  const sides = values.map((value) => Number(value.toFixed(8))).join("x");
  return `${dimensionHub(direction)}#size=${sides}-${direction === "in-to-cm" ? "in" : "cm"}`;
}

function catalogEntry(direction: DimensionDirection, candidate: Candidate) {
  const [values, kind, example, existingPath] = candidate;
  const from: DimensionUnit = direction === "in-to-cm" ? "in" : "cm";
  const to: DimensionUnit = direction === "in-to-cm" ? "cm" : "in";
  const slug = `${values.map((value) => String(value).replace(".", "-")).join("x")}-${from === "in" ? "inches-to-cm" : "cm-to-inches"}`;
  return { values, kind, example, direction, from, to, slug, existingPath, href: existingPath ?? `/dimensions/${slug}` };
}

export const dimensionCatalog = [
  ...inches2D.map((row) => catalogEntry("in-to-cm", row)),
  ...centimeters2D.map((row) => catalogEntry("cm-to-in", row)),
  ...inches3D.map((row) => catalogEntry("in-to-cm", row)),
  ...centimeters3D.map((row) => catalogEntry("cm-to-in", row)),
];

export type DimensionEntry = (typeof dimensionCatalog)[number];
export const publishedDimensionEntries = dimensionCatalog.filter((row) => !row.existingPath);
const dimensionBySlug = new Map(publishedDimensionEntries.map((row) => [row.slug, row]));
export function getDimensionEntry(size: string) { return dimensionBySlug.get(size); }

export function dimensionRows(direction: DimensionDirection, mode: DimensionMode) {
  return dimensionCatalog.filter((row) => row.direction === direction && row.values.length === mode);
}

export function dimensionText(values: readonly number[], decimals = 4) {
  return values.map((value) => formatLength(value, decimals)).join(" × ");
}

export function formatDimensionMeasure(value: number, unit: string, decimals = 6) {
  return `${dimensionValueIsRounded(value, decimals) ? "≈ " : ""}${formatLength(value, decimals)} ${unit}`;
}

export function dimensionPageSummary(row: DimensionEntry) {
  const measures = dimensionMeasures(row.values, row.direction)!;
  const isRounded = measures.converted.some((value) => dimensionValueIsRounded(value, 4));
  const source = dimensionText(row.values);
  const target = dimensionText(measures.converted);
  const sourceUnit = row.from === "in" ? "inches" : "cm";
  const h1 = `${source} ${row.from === "in" ? "Inches in cm" : "cm in Inches"}`;
  const answer = `${source} ${sourceUnit} ${isRounded ? "≈" : "="} ${target} ${row.to}`;
  const exampleDescription = source === "8 × 10" && row.from === "in"
    ? "See the width, height, area, aspect ratio, and conversion formula."
    : source === "22 × 14 × 9" && row.from === "in"
      ? "See each converted side, volume, and the calculation formula."
      : row.example;
  return {
    ...measures, source, target, h1, answer, isRounded,
    title: `${h1}: ${target} ${row.to} | InchisCm`,
    description: isRounded
      ? `${source} ${sourceUnit} is approximately ${target} ${row.to}. ${exampleDescription}`
      : `${answer} exactly. ${exampleDescription}`,
  };
}

export function nearbyDimensionEntries(row: DimensionEntry) {
  const distance = (candidate: DimensionEntry) => candidate.values.reduce((sum, side, index) => sum + Math.abs(side - row.values[index]), 0);
  const candidates = dimensionRows(row.direction, row.values.length as DimensionMode)
    .filter((candidate) => candidate.href !== row.href).sort((a, b) => distance(a) - distance(b));
  return [...new Map(candidates.map((candidate) => [candidate.href, candidate])).values()].slice(0, 4);
}

export function dimensionReverseHref(row: DimensionEntry, converted: readonly number[]) {
  const reverse = oppositeDimensionDirection(row.direction);
  const match = dimensionRows(reverse, row.values.length as DimensionMode)
    .find((candidate) => candidate.values.every((value, index) => Math.abs(value - converted[index]) < 1e-8));
  return match?.href ?? dimensionShareHref(reverse, converted);
}

export function referencesForDimensionGuide(path: string) {
  return dimensionCatalog.filter((entry) => entry.existingPath === path);
}

export function dimensionFaq(row: DimensionEntry, summary = dimensionPageSummary(row)) {
  return [
    { question: `What is ${summary.source} ${row.from} in ${row.to}?`, answer: `${summary.answer}. ${summary.isRounded ? "The converted sides are rounded to four decimal places." : "The converted sides are exact."}` },
    summary.mode === 2
      ? { question: "Does changing units change the aspect ratio?", answer: `Both sides are scaled by the same factor, so the width-to-height ratio stays ${summary.ratio}.` }
      : { question: "Does the volume show how much the item can hold?", answer: `The rectangular envelope is ${formatDimensionMeasure(summary.liters!, "L", 9)}. Usable capacity depends on the interior shape and wall thickness.` },
  ];
}
