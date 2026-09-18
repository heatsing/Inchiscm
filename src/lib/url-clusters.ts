import {
  allInchValues,
  centimeterValues,
  cmSlug,
  formatNumber,
  heights,
  heightSlug,
  inchSlug,
  isIndexedCmValue,
  isIndexedInchValue,
} from "./conversions";
import { formulaGridUnitPairSlugs } from "../data/page-registry/unit-pair-synonyms";

export type ClusterLink = {
  href: string;
  label: string;
};

export type LinkSection = {
  title: string;
  links: ClusterLink[];
};

export type ClusterId =
  | "core"
  | "inches-to-cm"
  | "cm-to-inches"
  | "height"
  | "charts"
  | "length-units"
  | "fractions"
  | "screen"
  | "guides"
  | "policies";

export type ClusterPage = {
  path: string;
  type: string;
  h1: string;
  breadcrumbLabel: string;
};

export type ClusterSection = {
  id: ClusterId;
  heading: string;
  intro: string;
  links: ClusterLink[];
};

export const INCH_NUMERIC_PATH = /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/;
export const CM_NUMERIC_PATH = /^\/\d+(?:-\d+)?-cm-in-inches$/;
export const HEIGHT_NUMERIC_PATH = /^\/(?:\d+-\d+-in-cm|\d+-feet-in-cm)$/;

const CORE_PATHS = new Set([
  "/",
  "/inches-to-cm",
  "/cm-to-inches",
  "/height-converter",
  "/screen-size-converter",
  "/feet-to-cm",
  "/inches-to-mm",
  "/mm-to-inches",
  "/cm-to-feet-and-inches",
  "/inches-to-cm-dimensions",
  "/cm-to-inches-dimensions",
  "/length-converters",
  "/fraction-converters",
  "/height-tools",
  "/screen-tools",
  "/conversion-charts",
  "/measurement-guides",
]);

const POLICY_PATHS = new Set([
  "/privacy-policy",
  "/terms-of-service",
  "/site-map",
  "/conversion-methodology",
]);

const STATIC_CHART_PATHS = new Set([
  "/inch-to-cm-chart",
  "/cm-to-inch-chart",
  "/height-chart",
]);

export const expansionUnitSlugs = formulaGridUnitPairSlugs();

export const expansionFractionSlugs = [
  "fraction-1-64-inch-to-mm", "fraction-1-32-inch-to-mm", "fraction-3-64-inch-to-mm", "fraction-1-16-inch-to-mm",
  "fraction-5-64-inch-to-mm", "fraction-3-32-inch-to-mm", "fraction-7-64-inch-to-mm", "fraction-1-8-inch-to-mm",
  "fraction-9-64-inch-to-mm", "fraction-5-32-inch-to-mm", "fraction-11-64-inch-to-mm", "fraction-3-16-inch-to-mm",
  "fraction-13-64-inch-to-mm", "fraction-7-32-inch-to-mm", "fraction-15-64-inch-to-mm", "fraction-1-4-inch-to-mm",
  "fraction-17-64-inch-to-mm", "fraction-9-32-inch-to-mm", "fraction-19-64-inch-to-mm", "fraction-5-16-inch-to-mm",
  "fraction-21-64-inch-to-mm", "fraction-11-32-inch-to-mm", "fraction-23-64-inch-to-mm", "fraction-3-8-inch-to-mm",
  "fraction-25-64-inch-to-mm", "fraction-13-32-inch-to-mm", "fraction-27-64-inch-to-mm", "fraction-7-16-inch-to-mm",
  "fraction-29-64-inch-to-mm", "fraction-15-32-inch-to-mm", "fraction-31-64-inch-to-mm", "fraction-1-2-inch-to-mm",
];

export const expansionScreenSlugs = [
  "tv-dimensions-calculator", "monitor-dimensions-calculator", "laptop-screen-size-calculator", "screen-width-calculator",
  "screen-height-calculator", "diagonal-screen-calculator", "resolution-to-ppi-calculator", "16-9-screen-size-calculator",
  "16-10-screen-size-calculator", "21-9-screen-size-calculator", "4-3-screen-size-calculator", "tablet-screen-size-calculator",
  "projector-screen-size-calculator", "ultrawide-screen-dimensions-calculator",
];

export const expansionChartSlugs = [
  "height-conversion-chart", "feet-and-inches-to-cm-chart", "cm-to-feet-and-inches-chart", "inch-to-mm-chart",
  "mm-to-inch-chart", "feet-to-meter-chart", "meter-to-feet-chart", "fraction-inch-to-mm-chart",
  "fraction-inch-to-cm-chart", "length-conversion-chart", "conversion-charts",
];

export const expansionMeasurementGuideSlugs = [
  "how-to-read-a-ruler", "how-to-read-a-tape-measure", "how-to-measure-screen-size", "how-to-convert-feet-and-inches-to-cm",
  "how-to-convert-cm-to-feet-and-inches", "how-to-convert-decimal-inches-to-fractions", "metric-vs-imperial-length",
  "how-to-round-measurements", "measurement-accuracy-vs-precision", "common-length-conversion-formulas",
];

const DEDICATED_UNIT_PAIR_SLUGS = new Set([
  "feet-to-inches", "inches-to-feet", "meters-to-feet", "feet-to-meters",
  "yards-to-meters", "meters-to-yards", "miles-to-km", "km-to-miles",
  "meters-to-cm", "cm-to-meters", "mm-to-cm", "cm-to-mm",
]);

const FRACTION_TOOL_SLUGS = new Set([
  "decimal-inches-to-fractions",
  "fractions-to-decimal-inches",
  "tape-measure-fractions-guide",
]);

const SCREEN_TOOL_SLUGS = new Set([
  ...expansionScreenSlugs,
  "ppi-calculator",
  "screen-aspect-ratio-calculator",
  "screen-dimensions-calculator",
  "laptop-screen-size-in-cm",
  "tv-size-in-cm",
  "screen-size-vs-width-height",
]);

const CLUSTER_COPY: Record<ClusterId, { heading: string; intro: string }> = {
  core: {
    heading: "Core converters and hubs",
    intro: "Start at the Inch is CM homepage and tool entry, then open dedicated hubs for inches to cm, length, height, screens, fractions, or charts.",
  },
  "inches-to-cm": {
    heading: "Inches to centimeters",
    intro: "Every published inch-to-cm conversion page, including whole inches, decimal inches, and screen diagonals. Height pages such as /5-7-in-cm stay in the height cluster.",
  },
  "cm-to-inches": {
    heading: "Centimeters to inches",
    intro: "Every published centimeter-to-inches conversion page, including whole centimeters and approved reverse values.",
  },
  height: {
    heading: "Height conversions",
    intro: "Feet-and-inches height pages. /5-7-in-cm means 5 feet 7 inches, not 5.7 inches.",
  },
  charts: {
    heading: "Conversion charts",
    intro: "Lookup tables for inches, centimeters, height, fractions, and other length units.",
  },
    "length-units": {
    heading: "Length unit converters",
    intro: "Dedicated and remaining formula converters between inches, centimeters, millimeters, feet, yards, meters, kilometers, and miles. Synonym formula-grid URLs redirect to the stronger canonical converter.",
  },
  fractions: {
    heading: "Fraction converters",
    intro: "Ruler-fraction pages and decimal-to-fraction tools.",
  },
  screen: {
    heading: "Screen tools",
    intro: "Diagonal, width, height, aspect-ratio, and PPI calculators from user-entered measurements.",
  },
  guides: {
    heading: "Measurement guides",
    intro: "How-to pages, size explainers, and methodology notes that support the converters.",
  },
  policies: {
    heading: "Website policies",
    intro: "Site policies, methodology, and this HTML index.",
  },
};

const CLUSTER_ORDER: ClusterId[] = [
  "core",
  "inches-to-cm",
  "cm-to-inches",
  "height",
  "charts",
  "length-units",
  "fractions",
  "screen",
  "guides",
  "policies",
];

export function link(href: string, label: string): ClusterLink {
  return { href, label };
}

export function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => (part === "cm" || part === "mm" || part === "km" || part === "ppi" ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ")
    .replace("16 9", "16:9")
    .replace("16 10", "16:10")
    .replace("21 9", "21:9")
    .replace("4 3", "4:3");
}

export function inchPageLabel(value: number) {
  return `${formatNumber(value)} ${value === 1 ? "inch" : "inches"} in cm`;
}

export function cmPageLabel(value: number) {
  return `${formatNumber(value)} cm in inches`;
}

export function heightPageLabel(feet: number, inches: number) {
  return inches === 0 ? `${feet} feet in cm` : `${feet}'${inches}" in cm`;
}

export function isInchNumericPath(path: string) {
  return INCH_NUMERIC_PATH.test(path);
}

export function isCmNumericPath(path: string) {
  return CM_NUMERIC_PATH.test(path);
}

export function isHeightNumericPath(path: string) {
  return HEIGHT_NUMERIC_PATH.test(path) && !isInchNumericPath(path);
}

export function classifyPath(path: string): ClusterId {
  if (CORE_PATHS.has(path)) return "core";
  if (POLICY_PATHS.has(path)) return "policies";
  if (isInchNumericPath(path)) return "inches-to-cm";
  if (isCmNumericPath(path)) return "cm-to-inches";
  if (isHeightNumericPath(path)) return "height";
  if (STATIC_CHART_PATHS.has(path) || (path.endsWith("-chart") && path !== "/conversion-charts")) return "charts";

  const slug = path.replace(/^\//, "");
  if (FRACTION_TOOL_SLUGS.has(slug) || slug.startsWith("fraction-")) return "fractions";
  if (SCREEN_TOOL_SLUGS.has(slug)) return "screen";
  if (DEDICATED_UNIT_PAIR_SLUGS.has(slug) || expansionUnitSlugs.includes(slug)) return "length-units";
  return "guides";
}

export function siteMapLabel(page: ClusterPage) {
  if (page.path === "/") return "Inch is CM home";
  if (page.path === "/inches-to-cm") return "Inches to CM hub";
  if (isHeightNumericPath(page.path)) return page.breadcrumbLabel || page.h1;
  if (page.breadcrumbLabel) return page.breadcrumbLabel;
  return page.h1;
}

export function nearbyPublishedWindow(values: number[], current: number, radius = 3) {
  const index = values.findIndex((value) => value === current);
  if (index < 0) return [];
  return [
    ...values.slice(Math.max(0, index - radius), index),
    ...values.slice(index + 1, index + 1 + radius),
  ];
}

export function nearbyPublishedHeights(feet: number, inches: number, radius = 3) {
  const index = heights.findIndex((height) => height.feet === feet && height.inches === inches);
  if (index < 0) return [];
  return [
    ...heights.slice(Math.max(0, index - radius), index),
    ...heights.slice(index + 1, index + 1 + radius),
  ];
}

export function isCleanInchFraction(value: number) {
  const sixteenths = value * 16;
  return Math.abs(sixteenths - Math.round(sixteenths)) < 1e-9;
}

export function isPublishedHeight(feet: number, inches: number) {
  return heights.some((height) => height.feet === feet && height.inches === inches);
}

function publishedInchLinks(values: number[]) {
  return values.filter(isIndexedInchValue).map((value) => link(inchSlug(value), inchPageLabel(value)));
}

function publishedCmLinks(values: number[]) {
  return values.filter(isIndexedCmValue).map((value) => link(cmSlug(value), cmPageLabel(value)));
}

function publishedHeightLinks(pairs: Array<[number, number]>) {
  return pairs
    .filter(([feet, inches]) => isPublishedHeight(feet, inches))
    .map(([feet, inches]) => link(heightSlug(feet, inches), heightPageLabel(feet, inches)));
}

export function getDecimalInchChartLinks() {
  return publishedInchLinks(allInchValues.filter((value) => !Number.isInteger(value)));
}

export function getInchesToCmHubSections(): LinkSection[] {
  return [
    {
      title: "Popular whole inches",
      links: publishedInchLinks([1, 2, 5, 6, 8, 10, 12, 16, 18, 20, 24, 27, 32, 36, 48, 55, 60, 72, 100]),
    },
    {
      title: "Published decimal inches",
      links: publishedInchLinks([0.25, 0.5, 0.75, 1.5, 2.5, 5.5, 6.5, 10.5, 12.5]),
    },
    {
      title: "Screen diagonals",
      links: publishedInchLinks([13.3, 15.6, 17.3, 21.5, 32, 43, 55, 65]),
    },
    {
      title: "Height conversions",
      links: [
        link("/height-converter", "Height converter"),
        link("/height-chart", "Height chart"),
        ...publishedHeightLinks([[4, 7], [5, 5], [5, 7], [5, 10], [6, 0], [6, 2], [6, 4]]),
      ],
    },
    {
      title: "Charts and guides",
      links: [
        link("/", "Inch is CM home"),
        link("/inch-to-cm-chart", "Inch to cm chart"),
        link("/fraction-inch-to-cm-chart", "Fraction inch to cm chart"),
        link("/how-to-convert-inches-to-cm", "How to convert inches to cm"),
        link("/inch-vs-cm", "Inch vs cm"),
        link("/site-map", "Full HTML site map"),
      ],
    },
  ];
}

export function getCmToInchesHubSections(): LinkSection[] {
  return [
    {
      title: "Popular whole centimeters",
      links: publishedCmLinks([1, 5, 10, 15, 20, 30, 50, 75, 100]),
    },
    {
      title: "Exact reverse values",
      links: publishedCmLinks([2.54, 12.7, 25.4, 30.48, 50.8, 152.4, 182.88, 254]),
    },
    {
      title: "Larger centimeter values",
      links: publishedCmLinks([110, 120, 150, 170, 180, 190, 200]),
    },
    {
      title: "Height conversions",
      links: [
        link("/height-converter", "Height converter"),
        link("/cm-to-feet-and-inches", "CM to feet and inches"),
        link("/height-chart", "Height chart"),
        ...publishedHeightLinks([[5, 5], [5, 8], [6, 0]]),
      ],
    },
    {
      title: "Charts and guides",
      links: [
        link("/cm-to-inch-chart", "CM to inch chart"),
        link("/inches-to-cm", "Inches to cm converter"),
        link("/how-to-convert-cm-to-inches", "How to convert cm to inches"),
        link("/inch-vs-cm", "Inch vs cm"),
        link("/site-map", "Full HTML site map"),
      ],
    },
  ];
}

export function lengthUnitConverterLinks() {
  const slugs = [...new Set([...expansionUnitSlugs, ...DEDICATED_UNIT_PAIR_SLUGS])];
  return slugs.map((slug) => link(`/${slug}`, labelFromSlug(slug)));
}

export function lengthUnitConverterSections(): LinkSection[] {
  const groups = new Map<string, ClusterLink[]>();
  for (const item of lengthUnitConverterLinks()) {
    const from = item.href.replace(/^\//, "").split("-to-")[0] ?? "length";
    const title = `${labelFromSlug(from)} converters`;
    const links = groups.get(title) ?? [];
    links.push(item);
    groups.set(title, links);
  }
  return [...groups.entries()].map(([title, links]) => ({ title, links }));
}

export function fractionConverterLinks() {
  return [
    link("/decimal-inches-to-fractions", "Decimal inches to fractions"),
    link("/fractions-to-decimal-inches", "Fractions to decimal inches"),
    link("/tape-measure-fractions-guide", "Tape measure fractions"),
    ...expansionFractionSlugs.map((slug) => link(`/${slug}`, labelFromSlug(slug))),
  ];
}

export function screenToolLinks() {
  return [
    link("/screen-size-converter", "Screen size converter"),
    link("/ppi-calculator", "PPI calculator"),
    link("/screen-aspect-ratio-calculator", "Screen aspect ratio calculator"),
    link("/screen-dimensions-calculator", "Screen dimensions calculator"),
    link("/laptop-screen-size-in-cm", "Laptop screen size in cm"),
    link("/tv-size-in-cm", "TV size in cm"),
    link("/screen-size-vs-width-height", "Screen size vs width and height"),
    ...expansionScreenSlugs.map((slug) => link(`/${slug}`, labelFromSlug(slug))),
  ];
}

export function chartIndexLinks() {
  return [
    link("/inch-to-cm-chart", "Inch to cm chart"),
    link("/cm-to-inch-chart", "CM to inch chart"),
    link("/height-chart", "Height chart"),
    ...expansionChartSlugs
      .filter((slug) => slug !== "conversion-charts")
      .map((slug) => link(`/${slug}`, labelFromSlug(slug))),
  ];
}

export function measurementGuideLinks() {
  return expansionMeasurementGuideSlugs.map((slug) => link(`/${slug}`, labelFromSlug(slug)));
}

export function buildSiteMapSections(pages: ClusterPage[]): ClusterSection[] {
  const buckets = new Map<ClusterId, ClusterLink[]>();
  for (const id of CLUSTER_ORDER) buckets.set(id, []);

  for (const page of pages) {
    const cluster = classifyPath(page.path);
    buckets.get(cluster)?.push(link(page.path, siteMapLabel(page)));
  }

  const sections = CLUSTER_ORDER.map((id) => {
    const links = (buckets.get(id) ?? []).sort((left, right) => left.label.localeCompare(right.label, "en"));
    return { id, ...CLUSTER_COPY[id], links };
  }).filter((section) => section.links.length > 0);

  const linked = new Set(sections.flatMap((section) => section.links.map((item) => item.href)));
  const missing = pages.map((page) => page.path).filter((path) => !linked.has(path));
  if (missing.length > 0) {
    throw new Error(`HTML site-map is missing published URLs: ${missing.join(", ")}`);
  }

  return sections;
}

export function publishedNumericPaths() {
  return [
    ...allInchValues.map(inchSlug),
    ...centimeterValues.map(cmSlug),
    ...heights.map(({ feet, inches }) => heightSlug(feet, inches)),
  ];
}
