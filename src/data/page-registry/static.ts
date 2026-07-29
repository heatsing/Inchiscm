import type { RouteDefinition, RouteType } from "./types";
import { ROUTE_UPDATED_AT, SITE_ORIGIN } from "./constants";

type StaticRouteInput = {
  path: string;
  type: RouteType;
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  formula?: string;
  category: string;
  searchIntent: string;
};

const staticInputs: StaticRouteInput[] = [
  { path: "", type: "home", title: "Inch is CM - Inch to CM Converter", description: "Convert inches to centimeters and centimeters to inches instantly with exact formulas, charts, height tools, and practical size references.", h1: "Inch to CM Converter", directAnswer: "1 inch equals exactly 2.54 centimeters.", formula: "inches × 2.54 = centimeters", category: "inch", searchIntent: "convert inches to centimeters" },
  { path: "/inches-to-cm", type: "tool", title: "Inches to CM Converter - Formula, Chart, and Examples", description: "Convert inches to centimeters instantly. Enter a whole or decimal inch value and see the exact result and formula.", h1: "Inches to CM Converter", directAnswer: "Enter an inch value to get its exact centimeter equivalent.", formula: "inches × 2.54 = centimeters", category: "inch", searchIntent: "convert inches to centimeters" },
  { path: "/cm-to-inches", type: "tool", title: "CM to Inches Converter - Formula, Chart, and Examples", description: "Convert centimeters to inches instantly with the exact formula, rounded results, examples, and charts.", h1: "CM to Inches Converter", directAnswer: "Enter a centimeter value to get its inch equivalent.", formula: "centimeters ÷ 2.54 = inches", category: "cm", searchIntent: "convert centimeters to inches" },
  { path: "/inch-to-cm-chart", type: "chart", title: "Inch to CM Chart - 1 to 100 Inches Table", description: "Search an inch to centimeter table from 1 to 100 inches with exact values and detailed conversion links.", h1: "Inch to CM Chart", directAnswer: "The chart lists exact centimeter values for common inch measurements.", formula: "inches × 2.54 = centimeters", category: "inch", searchIntent: "inch to centimeter chart" },
  { path: "/cm-to-inch-chart", type: "chart", title: "CM to Inch Chart - Centimeters to Inches Table", description: "Search common centimeter-to-inch values with precise decimal results and detailed conversion pages.", h1: "CM to Inch Chart", directAnswer: "The chart lists rounded inch values for common centimeter measurements.", formula: "centimeters ÷ 2.54 = inches", category: "cm", searchIntent: "centimeter to inch chart" },
  { path: "/height-converter", type: "tool", title: "Height Converter - Feet and Inches to CM", description: "Convert a height such as 5'8\" or 6 ft 2 in to centimeters instantly, with exact formulas and common height links.", h1: "Height Converter - Feet and Inches to CM", directAnswer: "Convert feet and inches to an exact centimeter height.", formula: "(feet × 12 + inches) × 2.54 = centimeters", category: "height", searchIntent: "convert feet and inches height to centimeters" },
  { path: "/height-chart", type: "chart", title: "Height Chart - Feet and Inches to CM", description: "Compare heights from 4 feet to 7 feet in centimeters, with one-inch increments and detailed conversion pages.", h1: "Feet and Inches to CM Height Chart", directAnswer: "The chart compares feet-and-inches heights with exact centimeter values.", formula: "total inches × 2.54 = centimeters", category: "height", searchIntent: "feet and inches height chart in centimeters" },
  { path: "/screen-size-converter", type: "tool", title: "Screen Size Converter - Inches to CM for TVs and Displays", description: "Convert a screen diagonal from inches to centimeters and estimate display width and height for common aspect ratios.", h1: "Screen Size Converter", directAnswer: "Convert a screen diagonal to centimeters and estimate its width and height.", formula: "diagonal inches × 2.54 = diagonal centimeters", category: "screen", searchIntent: "convert screen diagonal inches to centimeters and dimensions" },
  { path: "/inches-to-cm-dimensions", type: "tool", title: "Inches to CM Dimensions Converter - L x W x H", description: "Convert length, width, and height from inches to centimeters for product dimensions, boxes, luggage, furniture, and packaging.", h1: "Inches to CM Dimensions Converter", directAnswer: "Convert each inch dimension separately to centimeters.", formula: "each inch dimension × 2.54 = centimeters", category: "dimensions", searchIntent: "convert product dimensions from inches to centimeters" },
  { path: "/cm-to-inches-dimensions", type: "tool", title: "CM to Inches Dimensions Converter - L x W x H", description: "Convert length, width, and height from centimeters to inches for product dimensions, packages, furniture, and international size specs.", h1: "CM to Inches Dimensions Converter", directAnswer: "Convert each centimeter dimension separately to inches.", formula: "each centimeter dimension ÷ 2.54 = inches", category: "dimensions", searchIntent: "convert product dimensions from centimeters to inches" },
  { path: "/feet-to-cm", type: "tool", title: "Feet to CM Converter - Feet and Inches to Centimeters", description: "Convert feet and inches to centimeters. Use the exact formula, common height examples, and nearby conversion tools.", h1: "Feet to CM Converter", directAnswer: "Convert feet and optional inches to centimeters.", formula: "(feet × 12 + inches) × 2.54 = centimeters", category: "height", searchIntent: "convert feet to centimeters" },
  { path: "/inches-to-mm", type: "tool", title: "Inches to MM Converter - Convert Inches to Millimeters", description: "Convert inches to millimeters using the exact 25.4 conversion factor, with examples and related metric conversions.", h1: "Inches to MM Converter", directAnswer: "One inch equals exactly 25.4 millimeters.", formula: "inches × 25.4 = millimeters", category: "inch", searchIntent: "convert inches to millimeters" },
  { path: "/mm-to-inches", type: "tool", title: "MM to Inches Converter - Convert Millimeters to Inches", description: "Convert millimeters to inches for hardware, small parts, product dimensions, drawings, and metric-to-imperial size checks.", h1: "MM to Inches Converter", directAnswer: "Convert millimeters to decimal and fractional inches.", formula: "millimeters ÷ 25.4 = inches", category: "cm", searchIntent: "convert millimeters to inches" },
  { path: "/cm-to-feet-and-inches", type: "tool", title: "CM to Feet and Inches Converter - Height Conversion", description: "Convert centimeters to feet and inches for height values, profiles, forms, and metric-to-imperial height checks.", h1: "CM to Feet and Inches Converter", directAnswer: "Convert a centimeter height to feet, inches, and total inches.", formula: "centimeters ÷ 2.54 = total inches", category: "height", searchIntent: "convert centimeters to feet and inches" },
  { path: "/conversion-methodology", type: "policy", title: "Conversion Methodology and Sources - Inch is CM", description: "See the exact length conversion factors, rounding approach, screen dimension formula, and authoritative sources used by Inch is CM.", h1: "Conversion Methodology", directAnswer: "Inch is CM uses exact international conversion factors and rounds only displayed results.", category: "trust", searchIntent: "conversion methodology and sources" },
  { path: "/privacy-policy", type: "policy", title: "Privacy Policy - Inch is CM", description: "Read how Inch is CM handles converter inputs, technical logs, cookies, and external links.", h1: "Privacy Policy", directAnswer: "This policy explains how Inch is CM handles information when you use the website.", category: "policy", searchIntent: "privacy policy" },
  { path: "/terms-of-service", type: "policy", title: "Terms of Service - Inch is CM", description: "Review the terms for using Inch is CM conversion tools, charts, guides, and measurement information.", h1: "Terms of Service", directAnswer: "These terms explain the permitted use and limitations of Inch is CM.", category: "policy", searchIntent: "terms of service" },
  { path: "/site-map", type: "policy", title: "Site Map - Inch is CM", description: "Browse the main length converters, measurement charts, height and screen tools, guides, and website policies on Inch is CM.", h1: "Site Map", directAnswer: "Browse the main converters, charts, guides, and website policies.", category: "navigation", searchIntent: "browse site pages" },
];

export const staticRouteDefinitions: RouteDefinition[] = staticInputs.map((input) => {
  const path = input.path || "/";
  return {
    path,
    slug: path === "/" ? "" : path.slice(1),
    type: input.type,
    title: input.title,
    description: input.description,
    h1: input.h1,
    canonical: path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`,
    directAnswer: input.directAnswer,
    formula: input.formula ?? "",
    category: input.category,
    searchIntent: input.searchIntent,
    examples: [],
    useCases: [],
    tips: [],
    faq: [],
    relatedLinks: [],
    breadcrumbLabel: input.h1,
    updatedAt: ROUTE_UPDATED_AT,
    seoScore: {
      score: 80,
      grade: "B",
      releaseDecision: "observe",
      content: 20,
      searchIntent: 20,
      internalLinks: 20,
      demandEvidence: 20,
    },
  };
});
