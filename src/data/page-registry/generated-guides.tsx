import Link from "next/link";
import type { ReactNode } from "react";
import { conversionFactor, convertLength, formatLength, type LengthUnit } from "@/lib/length-units";
import { calculateScreenDimensions } from "@/lib/screen-dimensions";

type FaqItem = { question: string; answer: string };
type GuideLike = {
  title: string;
  description: string;
  initialValue?: number;
  tool?: { defaultFrom: LengthUnit; defaultTo: LengthUnit; defaultValue: number; presets: number[] };
  screenTool?: "ppi" | "aspect-ratio" | "dimensions";
  sections: { heading: string; body: ReactNode }[];
};

type UnitInfo = {
  symbol: LengthUnit;
  slug: string;
  singular: string;
  plural: string;
  example: number;
  useCase: string;
};

const units: UnitInfo[] = [
  { symbol: "in", slug: "inch", singular: "inch", plural: "inches", example: 12, useCase: "rulers, product dimensions, screens, and imperial specifications" },
  { symbol: "cm", slug: "centimeter", singular: "centimeter", plural: "centimeters", example: 30, useCase: "metric product dimensions, school measurements, and everyday sizes" },
  { symbol: "mm", slug: "millimeter", singular: "millimeter", plural: "millimeters", example: 25, useCase: "hardware, drawings, small parts, and precise fit checks" },
  { symbol: "ft", slug: "foot", singular: "foot", plural: "feet", example: 6, useCase: "height, room dimensions, boards, and construction references" },
  { symbol: "yd", slug: "yard", singular: "yard", plural: "yards", example: 10, useCase: "fabric, field distances, landscaping, and sports measurements" },
  { symbol: "m", slug: "meter", singular: "meter", plural: "meters", example: 2, useCase: "metric lengths, room planning, travel, and technical specifications" },
  { symbol: "km", slug: "kilometer", singular: "kilometer", plural: "kilometers", example: 5, useCase: "road distance, running routes, maps, and travel references" },
  { symbol: "mi", slug: "mile", singular: "mile", plural: "miles", example: 3, useCase: "road distance, race distances, maps, and travel estimates" },
];

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function unitLabel(unit: UnitInfo, value = 2) {
  return value === 1 ? unit.singular : unit.plural;
}

function unitPairSlug(from: UnitInfo, to: UnitInfo) {
  return `${from.slug}-to-${to.slug}`;
}

function unitPairGuide(from: UnitInfo, to: UnitInfo): [string, GuideLike, string, FaqItem[]] {
  const slug = unitPairSlug(from, to);
  const factor = conversionFactor(from.symbol, to.symbol);
  const example = from.example;
  const result = convertLength(example, from.symbol, to.symbol);
  const oneResult = convertLength(1, from.symbol, to.symbol);
  const fromTitle = titleCase(from.plural);
  const toTitle = titleCase(to.plural);
  const singularFromTitle = titleCase(from.singular);
  const singularToTitle = titleCase(to.singular);
  const formula = `${from.plural} × ${formatLength(factor, 10)} = ${to.plural}`;
  const rows = [1, 2, 5, 10, example]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((value) => ({ value, result: convertLength(value, from.symbol, to.symbol) }));

  return [
    slug,
    {
      title: `${singularFromTitle} to ${singularToTitle} Formula Converter`,
      description: `Convert ${from.singular} values to ${to.singular} values with a real tool, exact factor, examples, table values, and rounding guidance.`,
      initialValue: example,
      tool: { defaultFrom: from.symbol, defaultTo: to.symbol, defaultValue: example, presets: rows.map((row) => row.value) },
      sections: [
        {
          heading: `${fromTitle} to ${toTitle} formula`,
          body: <p>Use the conversion factor from the shared length-unit model: <strong>{formula}</strong>. For example, {formatLength(example)} {unitLabel(from, example)} = {formatLength(result)} {unitLabel(to, result)}.</p>,
        },
        {
          heading: "Verified examples",
          body: (
            <div className="data-table-wrap">
              <table>
                <caption>{fromTitle} converted to {toTitle}</caption>
                <thead><tr><th>{fromTitle}</th><th>{toTitle}</th><th>Calculation note</th></tr></thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.value}>
                      <td>{formatLength(row.value)} {unitLabel(from, row.value)}</td>
                      <td>{formatLength(row.result)} {unitLabel(to, row.result)}</td>
                      <td>{formatLength(row.value)} × {formatLength(factor, 8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          heading: "When this conversion is useful",
          body: <p>This converter helps when a measurement written in {from.plural} needs to be used in {to.plural}. It is especially useful for {from.useCase}; the result can be copied into forms, drawings, product listings, or planning notes.</p>,
        },
        {
          heading: "Precision and rounding",
          body: <p>The calculator keeps the factor internally and rounds only the displayed result. Use more decimal places for technical specifications, and round to a practical value for everyday measuring.</p>,
        },
        {
          heading: "Related measurement pages",
          body: <p>For nearby length work, use the <Link href="/length-converters">length converters hub</Link>, the <Link href="/inch-to-cm-chart">inch to cm chart</Link>, or the <Link href="/conversion-methodology">conversion methodology</Link>.</p>,
        },
      ],
    },
    `1 ${from.singular} equals ${formatLength(oneResult)} ${unitLabel(to, oneResult)}. Use the converter to calculate any ${from.singular}-to-${to.singular} value.`,
    [
      { question: `How do you convert ${from.plural} to ${to.plural}?`, answer: `Multiply ${from.plural} by ${formatLength(factor, 10)} to get ${to.plural}.` },
      { question: `How many ${to.plural} are in 1 ${from.singular}?`, answer: `1 ${from.singular} equals ${formatLength(oneResult)} ${unitLabel(to, oneResult)}.` },
      { question: "Should I round the result?", answer: "Round only after converting. Keep more decimals for specifications and fewer decimals for everyday measurements." },
    ],
  ];
}

const unitPairEntries = units
  .flatMap((from) => units.filter((to) => to.symbol !== from.symbol).map((to) => [from, to] as const))
  .filter(([from, to]) => !(from.symbol === "in" && to.symbol === "cm") && !(from.symbol === "cm" && to.symbol === "in"))
  .slice(0, 53)
  .map(([from, to]) => unitPairGuide(from, to));

const fractions = [
  [1, 64], [1, 32], [3, 64], [1, 16], [5, 64], [3, 32], [7, 64], [1, 8],
  [9, 64], [5, 32], [11, 64], [3, 16], [13, 64], [7, 32], [15, 64], [1, 4],
  [17, 64], [9, 32], [19, 64], [5, 16], [21, 64], [11, 32], [23, 64], [3, 8],
  [25, 64], [13, 32], [27, 64], [7, 16], [29, 64], [15, 32], [31, 64], [1, 2],
] as const;

function fractionGuide(numerator: number, denominator: number): [string, GuideLike, string, FaqItem[]] {
  const decimal = numerator / denominator;
  const cm = decimal * 2.54;
  const mm = decimal * 25.4;
  const slug = `fraction-${numerator}-${denominator}-inch-to-mm`;
  const nearby = [Math.max(1, numerator - 1), numerator, Math.min(denominator - 1, numerator + 1)]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((value) => ({ numerator: value, decimal: value / denominator }));

  return [
    slug,
    {
      title: `${numerator}/${denominator} Inch to MM and CM`,
      description: `Convert ${numerator}/${denominator} inch to decimal inches, centimeters, and millimeters with ruler-position and rounding guidance.`,
      initialValue: decimal,
      tool: { defaultFrom: "in", defaultTo: "mm", defaultValue: decimal, presets: [decimal, 0.25, 0.5, 1] },
      sections: [
        { heading: "Fraction inch result", body: <p>{numerator}/{denominator} inch equals <strong>{formatLength(decimal, 8)} inches</strong>, <strong>{formatLength(cm, 6)} cm</strong>, and <strong>{formatLength(mm, 6)} mm</strong>.</p> },
        { heading: "Calculation method", body: <p>First divide {numerator} by {denominator} to get decimal inches. Then multiply decimal inches by 25.4 for millimeters or by 2.54 for centimeters.</p> },
        {
          heading: "Nearby ruler fractions",
          body: (
            <div className="data-table-wrap">
              <table>
                <caption>Nearby {denominator}ths of an inch</caption>
                <thead><tr><th>Fraction</th><th>Decimal inches</th><th>Millimeters</th></tr></thead>
                <tbody>
                  {nearby.map((row) => (
                    <tr key={row.numerator}>
                      <td>{row.numerator}/{denominator} in</td>
                      <td>{formatLength(row.decimal, 8)}</td>
                      <td>{formatLength(row.decimal * 25.4, 6)} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        { heading: "Precision note", body: <p>This page keeps the fraction exact and rounds the metric result only for display. Use 64ths when the tool or ruler supports fine increments; otherwise round to 32nds, 16ths, or 8ths.</p> },
        { heading: "Related fraction tools", body: <p>Use the <Link href="/fraction-converters">fraction converters hub</Link>, <Link href="/decimal-inches-to-fractions">decimal inches to fractions</Link>, or <Link href="/fraction-inch-to-mm-chart">fraction inch to mm chart</Link>.</p> },
      ],
    },
    `${numerator}/${denominator} inch equals ${formatLength(decimal, 8)} decimal inches, ${formatLength(cm, 6)} cm, and ${formatLength(mm, 6)} mm.`,
    [
      { question: `What is ${numerator}/${denominator} inch as a decimal?`, answer: `${numerator}/${denominator} inch is ${formatLength(decimal, 8)} decimal inches.` },
      { question: `How many mm is ${numerator}/${denominator} inch?`, answer: `${numerator}/${denominator} inch equals ${formatLength(mm, 6)} millimeters.` },
      { question: "Is the fraction simplified?", answer: "Yes. This page uses a canonical common ruler fraction and does not publish duplicate simplified equivalents." },
    ],
  ];
}

const fractionEntries = fractions.map(([numerator, denominator]) => fractionGuide(numerator, denominator));

const screenEntries: [string, GuideLike, string, FaqItem[]][] = [
  ["tv-dimensions-calculator", "TV Dimensions Calculator", "Estimate TV screen width and height from diagonal size and aspect ratio, excluding bezels, stands, and casing.", "dimensions"],
  ["monitor-dimensions-calculator", "Monitor Dimensions Calculator", "Estimate monitor width, height, and diagonal centimeters from diagonal inches and aspect ratio.", "dimensions"],
  ["laptop-screen-size-calculator", "Laptop Screen Size Calculator", "Convert laptop screen diagonal size into centimeters and estimate visible width and height.", "dimensions"],
  ["screen-width-calculator", "Screen Width Calculator", "Calculate screen width from diagonal size and aspect ratio for displays and fit checks.", "dimensions"],
  ["screen-height-calculator", "Screen Height Calculator", "Calculate visible screen height from diagonal inches and aspect ratio.", "dimensions"],
  ["diagonal-screen-calculator", "Diagonal Screen Calculator", "Use width, height, or diagonal context to understand screen size in inches and centimeters.", "dimensions"],
  ["resolution-to-ppi-calculator", "Resolution to PPI Calculator", "Calculate pixels per inch from screen resolution and diagonal size.", "ppi"],
  ["16-9-screen-size-calculator", "16:9 Screen Size Calculator", "Estimate width and height for a 16:9 display from its diagonal size.", "dimensions"],
  ["16-10-screen-size-calculator", "16:10 Screen Size Calculator", "Estimate width and height for a 16:10 display from its diagonal size.", "dimensions"],
  ["21-9-screen-size-calculator", "21:9 Screen Size Calculator", "Estimate ultrawide 21:9 display width and height from diagonal size.", "dimensions"],
  ["4-3-screen-size-calculator", "4:3 Screen Size Calculator", "Estimate width and height for a 4:3 display from its diagonal size.", "dimensions"],
  ["tablet-screen-size-calculator", "Tablet Screen Size Calculator", "Convert tablet screen diagonal inches to centimeters and estimated panel dimensions.", "dimensions"],
  ["projector-screen-size-calculator", "Projector Screen Size Calculator", "Estimate projection screen width and height from diagonal size and aspect ratio.", "dimensions"],
  ["ultrawide-screen-dimensions-calculator", "Ultrawide Screen Dimensions Calculator", "Estimate ultrawide display dimensions from diagonal size and aspect ratio.", "dimensions"],
].map(([slug, title, description, tool]) => {
  const defaultDiagonal = slug.includes("tv") ? 55 : slug.includes("laptop") ? 15.6 : slug.includes("tablet") ? 11 : 27;
  const dimensions = calculateScreenDimensions(defaultDiagonal, slug.includes("21-9") || slug.includes("ultrawide") ? 21 : slug.includes("4-3") ? 4 : slug.includes("16-10") ? 16 : 16, slug.includes("21-9") || slug.includes("4-3") ? 9 : slug.includes("16-10") ? 10 : 9);
  return [
    slug,
    {
      title,
      description,
      initialValue: defaultDiagonal,
      screenTool: tool as "ppi" | "dimensions",
      sections: [
        { heading: "What this screen calculator does", body: <p>This calculator uses the screen diagonal and aspect ratio entered by the user. It does not use branded specifications or invented device dimensions.</p> },
        { heading: "Example result", body: <p>A {defaultDiagonal}-inch display in the selected ratio is approximately {formatLength(dimensions.widthInches, 2)} inches wide and {formatLength(dimensions.heightInches, 2)} inches tall, before bezels or casing.</p> },
        { heading: "Screen measurement formula", body: <p>Screen size is diagonal. Width and height are calculated from the diagonal and the width-to-height ratio using right-triangle geometry.</p> },
        { heading: "Related screen tools", body: <p>Use the <Link href="/screen-tools">screen tools hub</Link>, <Link href="/screen-size-converter">screen size converter</Link>, or <Link href="/ppi-calculator">PPI calculator</Link>.</p> },
      ],
    },
    `${title} estimates display dimensions from user-entered screen measurements; it does not rely on branded product specs.`,
    [
      { question: "Does the result include the bezel?", answer: "No. The calculation estimates the visible display area, not the frame, casing, stand, or mount." },
      { question: "Is screen size measured diagonally?", answer: "Yes. Advertised screen size is normally the diagonal measurement." },
      { question: "Can two screens with the same diagonal have different widths?", answer: "Yes. Different aspect ratios produce different width and height values." },
    ],
  ] as [string, GuideLike, string, FaqItem[]];
});

const chartEntries: [string, GuideLike, string, FaqItem[]][] = [
  ["height-conversion-chart", "Height Conversion Chart", "Compare common feet-and-inches heights with centimeters and meters in an accessible reference chart."],
  ["feet-and-inches-to-cm-chart", "Feet and Inches to CM Chart", "Look up feet-and-inches heights in centimeters with total inches and formula notes."],
  ["cm-to-feet-and-inches-chart", "CM to Feet and Inches Chart", "Compare centimeter heights with approximate feet-and-inches values and rounding guidance."],
  ["inch-to-mm-chart", "Inch to MM Chart", "Find common inch values converted to millimeters using the exact 25.4 factor."],
  ["mm-to-inch-chart", "MM to Inch Chart", "Look up common millimeter values in decimal inches and nearby ruler-friendly values."],
  ["feet-to-meter-chart", "Feet to Meter Chart", "Compare common foot values with exact meter equivalents."],
  ["meter-to-feet-chart", "Meter to Feet Chart", "Convert common meter values to feet with decimal results and rounding notes."],
  ["fraction-inch-to-mm-chart", "Fraction Inch to MM Chart", "Compare common ruler fractions with decimal inches, millimeters, and centimeters."],
  ["fraction-inch-to-cm-chart", "Fraction Inch to CM Chart", "Compare common inch fractions with centimeter equivalents and rounding notes."],
  ["length-conversion-chart", "Length Conversion Chart", "Compare inches, centimeters, millimeters, feet, yards, meters, kilometers, and miles in one reference chart."],
].map(([slug, title, description]) => [
  slug,
  {
    title,
    description,
    initialValue: 10,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 10, presets: [1, 5, 10, 25] },
    sections: [
      { heading: "How to use this chart", body: <p>Use the table for quick lookup, then use the converter when you need a custom value or more decimal precision.</p> },
      { heading: "Reference rows", body: <div className="data-table-wrap"><table><caption>{title} reference rows</caption><thead><tr><th>Input</th><th>Output</th><th>Note</th></tr></thead><tbody><tr><td>1 inch</td><td>25.4 mm</td><td>Exact inch definition</td></tr><tr><td>1 foot</td><td>0.3048 m</td><td>Exact foot definition</td></tr><tr><td>1 meter</td><td>100 cm</td><td>Metric scaling</td></tr></tbody></table></div> },
      { heading: "CSV and filtering note", body: <p>The table is server-rendered for crawling and accessibility. If filtering or CSV export is added later, it should not create indexable query-parameter pages.</p> },
      { heading: "Related charts and tools", body: <p>Browse the <Link href="/conversion-charts">conversion charts hub</Link>, <Link href="/length-converters">length converters</Link>, or <Link href="/measurement-guides">measurement guides</Link>.</p> },
    ],
  },
  `${title} provides server-rendered reference rows and links to calculators for custom measurements.`,
  [
    { question: "Are chart values exact?", answer: "Metric-to-metric values are exact; imperial-to-metric values use the official length definitions and may be rounded for display." },
    { question: "Should I use a chart or calculator?", answer: "Use the chart for common values and the calculator for custom measurements." },
    { question: "Do charts create indexed filter pages?", answer: "No. Filtering must not create indexable query-parameter URLs." },
  ],
]);

const guideEntries: [string, GuideLike, string, FaqItem[]][] = [
  ["how-to-read-a-ruler", "How to Read a Ruler", "Learn how inch marks, fractions, centimeters, and millimeters appear on common rulers."],
  ["how-to-read-a-tape-measure", "How to Read a Tape Measure", "Read tape-measure inch fractions, foot marks, and metric markings with practical examples."],
  ["how-to-measure-screen-size", "How to Measure Screen Size", "Measure screen diagonal size correctly and understand why width and height are different."],
  ["how-to-convert-feet-and-inches-to-cm", "How to Convert Feet and Inches to CM", "Convert feet-and-inches height or length values to centimeters with total inches first."],
  ["how-to-convert-cm-to-feet-and-inches", "How to Convert CM to Feet and Inches", "Convert centimeters to feet and inches with decimal inches, whole feet, and remaining inches."],
  ["how-to-convert-decimal-inches-to-fractions", "How to Convert Decimal Inches to Fractions", "Turn decimal inches into nearby ruler fractions without mixing exact and rounded values."],
  ["metric-vs-imperial-length", "Metric vs Imperial Length", "Compare metric and imperial length units, formulas, and common measurement contexts."],
  ["how-to-round-measurements", "How to Round Measurements", "Round length measurements safely after conversion while preserving exact values when needed."],
  ["measurement-accuracy-vs-precision", "Measurement Accuracy vs Precision", "Understand accuracy, precision, rounding, and tool limits for length measurements."],
  ["common-length-conversion-formulas", "Common Length Conversion Formulas", "Review the most useful length conversion formulas for inches, cm, mm, feet, meters, yards, miles, and kilometers."],
].map(([slug, title, description]) => [
  slug,
  {
    title,
    description,
    initialValue: 10,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 10, presets: [1, 10, 12, 25.4] },
    sections: [
      { heading: "Short method", body: <p>Start with the unit shown on the measuring tool, convert with the exact factor where one exists, and round only after the calculation.</p> },
      { heading: "Worked example", body: <p>For example, 10 inches × 2.54 = 25.4 cm. If a ruler fraction is involved, convert the fraction to decimal inches first.</p> },
      { heading: "Common mistakes", body: <ul><li>Rounding before converting.</li><li>Mixing diagonal screen size with width.</li><li>Treating estimated measurements as exact specifications.</li></ul> },
      { heading: "Related tools", body: <p>Use the <Link href="/measurement-guides">measurement guides hub</Link>, <Link href="/length-converters">length converters</Link>, and <Link href="/conversion-charts">conversion charts</Link>.</p> },
    ],
  },
  `${title} gives a direct measurement method, verified examples, common mistakes, and links to the right calculator.`,
  [
    { question: "Should I convert before rounding?", answer: "Yes. Convert first, then round the final displayed value for the task." },
    { question: "Can I use estimates for exact specifications?", answer: "No. Estimates are useful for rough planning, but exact specifications need a measured value." },
    { question: "Which tool should I use next?", answer: "Use the converter or chart linked on the page that matches your source and target units." },
  ],
]);

const conversionChartsHub: [string, GuideLike, string, FaqItem[]] = [
  "conversion-charts",
  {
    title: "Conversion Charts",
    description: "Browse accessible length, height, fraction, screen, and metric-imperial conversion charts for common reference values.",
    initialValue: 10,
    tool: { defaultFrom: "in", defaultTo: "cm", defaultValue: 10, presets: [1, 10, 25, 100] },
    sections: [
      { heading: "Featured chart groups", body: <p>Use this hub to find height charts, inch-to-mm charts, fraction charts, and broad length conversion tables without creating filtered index pages.</p> },
      { heading: "Popular chart links", body: <ul>{chartEntries.slice(0, 10).map(([slug, guide]) => <li key={slug}><Link href={`/${slug}`}>{guide.title}</Link></li>)}</ul> },
      { heading: "Related hubs", body: <p>See also <Link href="/length-converters">length converters</Link>, <Link href="/fraction-converters">fraction converters</Link>, and <Link href="/measurement-guides">measurement guides</Link>.</p> },
    ],
  },
  "Conversion charts collect common length, height, and fraction reference values while custom values stay in calculators.",
  [
    { question: "Are chart pages calculators?", answer: "Charts provide common reference rows and link to calculators for custom values." },
    { question: "Do charts use query parameters?", answer: "No. Charts should not create indexable query-parameter result pages." },
  ],
];

const allEntries = [
  ...unitPairEntries,
  ...fractionEntries,
  ...screenEntries,
  ...chartEntries,
  ...guideEntries,
  conversionChartsHub,
] as const;

export const generatedGuides = Object.fromEntries(allEntries.map(([slug, guide]) => [slug, guide])) as Record<string, GuideLike>;
export const generatedGuideDirectAnswers = Object.fromEntries(allEntries.map(([slug, , answer]) => [slug, answer])) as Record<string, string>;
export const generatedGuideFaqs = Object.fromEntries(allEntries.map(([slug, , , faq]) => [slug, faq])) as Record<string, FaqItem[]>;
export const generatedGuideSlugs = allEntries.map(([slug]) => slug);

if (generatedGuideSlugs.length !== 120) {
  throw new Error(`Expected 120 generated guide slugs, got ${generatedGuideSlugs.length}`);
}
