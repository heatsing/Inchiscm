/**
 * Longer unique metadata titles for short hub/chart/guide pages.
 * H1s stay on the existing short heading; nearby tools use a dash suffix
 * (see /inches-to-cm, /inch-to-cm-chart) rather than "| Inch Converter".
 */
export const HUB_SEO_TITLES: Record<string, string> = {
  "inch-vs-cm": "Inch vs CM: Differences, Uses and 2.54 Conversion",
  "height-tools": "Height Tools - Feet, Inches and CM Converters",
  "screen-tools": "Screen Tools - Diagonal, PPI and Size Calculators",
  "tv-size-in-cm": "TV Size in CM - Diagonal Inches to Centimeters",
  "ppi-calculator": "PPI Calculator - Pixels Per Inch from Resolution",
  "inch-to-mm-chart": "Inch to MM Chart - Exact 25.4 Millimeter Table",
  "mm-to-inch-chart": "MM to Inch Chart - Millimeters to Decimal Inches",
  "length-converters": "Length Converters - Inches, CM, MM, Feet and Miles",
  "conversion-charts": "Conversion Charts - Length, Height and Fraction Tables",
  "measurement-guides": "Measurement Guides - Rulers, Rounding and Unit Tips",
  "mm-to-cm": "MM to CM Converter - Millimeters to Centimeters",
  "cm-to-mm": "CM to MM Converter - Centimeters to Millimeters",
  "fraction-converters": "Fraction Converters - Ruler Inches to CM and MM",
  "feet-to-meter-chart": "Feet to Meter Chart - Common Foot Values in Meters",
  "meter-to-feet-chart": "Meter to Feet Chart - Common Meter Values in Feet",
  "how-to-read-a-ruler": "How to Read a Ruler - Inch Marks, Fractions and CM",
};

export function hubSeoTitle(slug: string) {
  return HUB_SEO_TITLES[slug];
}
