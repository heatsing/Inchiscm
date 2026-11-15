export type InchChartRow = { label: string; inches: number; cm: number; mm: number; href?: string };

const fractions = [
  ["1/8", 0.125], ["1/4", 0.25], ["3/8", 0.375], ["1/2", 0.5],
  ["5/8", 0.625], ["3/4", 0.75], ["7/8", 0.875],
] as const;
const decimals = [
  [1.5, "/1-5-inches-in-cm"],
  [2.5, "/2-5-inches-in-cm"],
  [13.3, "/13-3-inch-in-cm"],
  [15.6, "/15-6-inch-in-cm"],
] as const;
const makeRow = (label: string, inches: number, href?: string): InchChartRow => ({
  label,
  inches,
  cm: inches * 2.54,
  mm: inches * 25.4,
  href,
});

export const inchChartRows = [
  ...fractions.map(([label, value]) => makeRow(`${label} in`, value)),
  ...Array.from({ length: 100 }, (_, index) => makeRow(`${index + 1} in`, index + 1, `/${index === 0 ? "1-inch-in-cm" : `${index + 1}-inches-in-cm`}`)),
  ...decimals.map(([value, href]) => makeRow(`${value} in`, value, href)),
].sort((a, b) => a.inches - b.inches);

export const inchChartCsv = [
  "Inches,Centimeters,Millimeters",
  ...inchChartRows.map((row) => [row.label.replace(" in", ""), row.cm.toFixed(4).replace(/\.?0+$/, ""), row.mm.toFixed(3).replace(/\.?0+$/, "")].join(",")),
].join("\r\n");
