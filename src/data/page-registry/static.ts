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
  { path: "", type: "home", title: "Inch is CM - Inch to CM Converter", description: "Use the main inch to cm converter with exact 2.54 formula, quick charts, height tools, screen sizes, and related length conversions.", h1: "Inch to CM Converter", directAnswer: "1 inch equals exactly 2.54 centimeters.", formula: "inches × 2.54 = centimeters", category: "inch", searchIntent: "convert inches to centimeters" },
  { path: "/inches-to-cm", type: "tool", title: "Inches to CM Converter - Formula and Examples", description: "Convert inches to centimeters with the exact 2.54 formula, worked examples, chart links, and clean inch-to-cm results.", h1: "Inches to CM Converter", directAnswer: "Enter an inch value to get its exact centimeter equivalent.", formula: "inches × 2.54 = centimeters", category: "inch", searchIntent: "convert inches to centimeters" },
  { path: "/cm-to-inches", type: "tool", title: "CM to Inches Converter - Centimeters to Inches", description: "Convert centimeters to inches with the exact formula, decimal result, fractional inch guidance, examples, and nearby values.", h1: "CM to Inches Converter", directAnswer: "Enter a centimeter value to get its inch equivalent.", formula: "centimeters ÷ 2.54 = inches", category: "cm", searchIntent: "convert centimeters to inches" },
  { path: "/inch-to-cm-chart", type: "chart", title: "Inch to CM Chart - 1 to 100 Inches Table", description: "Find exact centimeter values for 1 to 100 inches, with the 2.54 formula, quick table lookup, and detailed conversion links.", h1: "Inch to CM Chart", directAnswer: "The chart lists exact centimeter values for common inch measurements.", formula: "inches × 2.54 = centimeters", category: "inch", searchIntent: "inch to centimeter chart" },
  { path: "/cm-to-inch-chart", type: "chart", title: "CM to Inch Chart - Centimeters to Inches Table", description: "Look up common centimeter-to-inch values with decimal results, formula guidance, and links to detailed cm conversion pages.", h1: "CM to Inch Chart", directAnswer: "The chart lists rounded inch values for common centimeter measurements.", formula: "centimeters ÷ 2.54 = inches", category: "cm", searchIntent: "centimeter to inch chart" },
  { path: "/height-converter", type: "tool", title: "Height Converter - Feet and Inches to CM", description: "Convert heights like 5'8\" or 6 ft 2 in to centimeters with total inches, exact formula, nearby heights, and common examples.", h1: "Height Converter - Feet and Inches to CM", directAnswer: "Convert feet and inches to an exact centimeter height.", formula: "(feet × 12 + inches) × 2.54 = centimeters", category: "height", searchIntent: "convert feet and inches height to centimeters" },
  { path: "/height-chart", type: "chart", title: "Height Chart - Feet and Inches to CM Table", description: "Compare heights from 4'0\" to 7'0\" in centimeters, with one-inch increments, exact values, and detailed height pages.", h1: "Feet and Inches to CM Height Chart", directAnswer: "The chart compares feet-and-inches heights with exact centimeter values.", formula: "total inches × 2.54 = centimeters", category: "height", searchIntent: "feet and inches height chart in centimeters" },
  { path: "/screen-size-converter", type: "tool", title: "Screen Size Converter - Inches to CM for Displays", description: "Convert TV, laptop, and monitor diagonals from inches to centimeters, then estimate width and height by aspect ratio.", h1: "Screen Size Converter", directAnswer: "Convert a screen diagonal to centimeters and estimate its width and height.", formula: "diagonal inches × 2.54 = diagonal centimeters", category: "screen", searchIntent: "convert screen diagonal inches to centimeters and dimensions" },
  { path: "/inches-to-cm-dimensions", type: "tool", title: "Inches to CM Dimensions Converter - L x W x H", description: "Convert length, width, and height from inches to centimeters for product listings, boxes, luggage, furniture, and packaging.", h1: "Inches to CM Dimensions Converter", directAnswer: "Convert each inch dimension separately to centimeters.", formula: "each inch dimension × 2.54 = centimeters", category: "dimensions", searchIntent: "convert product dimensions from inches to centimeters" },
  { path: "/cm-to-inches-dimensions", type: "tool", title: "CM to Inches Dimensions Converter - L x W x H", description: "Convert length, width, and height from centimeters to inches for product specs, packages, furniture, and international listings.", h1: "CM to Inches Dimensions Converter", directAnswer: "Convert each centimeter dimension separately to inches.", formula: "each centimeter dimension ÷ 2.54 = inches", category: "dimensions", searchIntent: "convert product dimensions from centimeters to inches" },
  { path: "/feet-to-cm", type: "tool", title: "Feet to CM Converter - Feet and Inches to Centimeters", description: "Convert feet, inches, and common height values to centimeters with the exact formula, worked examples, and related height tools.", h1: "Feet to CM Converter", directAnswer: "Convert feet and optional inches to centimeters.", formula: "(feet × 12 + inches) × 2.54 = centimeters", category: "height", searchIntent: "convert feet to centimeters" },
  { path: "/inches-to-mm", type: "tool", title: "Inches to MM Converter - Convert Inches to Millimeters", description: "Convert inches to millimeters with the exact 25.4 factor, practical examples, formula notes, and related metric tools.", h1: "Inches to MM Converter", directAnswer: "One inch equals exactly 25.4 millimeters.", formula: "inches × 25.4 = millimeters", category: "inch", searchIntent: "convert inches to millimeters" },
  { path: "/mm-to-inches", type: "tool", title: "MM to Inches Converter - Convert Millimeters to Inches", description: "Convert millimeters to decimal and fractional inches for hardware, product specs, drawings, and metric-to-imperial checks.", h1: "MM to Inches Converter", directAnswer: "Convert millimeters to decimal and fractional inches.", formula: "millimeters ÷ 25.4 = inches", category: "cm", searchIntent: "convert millimeters to inches" },
  { path: "/cm-to-feet-and-inches", type: "tool", title: "CM to Feet and Inches Converter - Height Conversion", description: "Convert centimeters to feet and inches for height forms, profiles, sports references, and metric-to-imperial height checks.", h1: "CM to Feet and Inches Converter", directAnswer: "Convert a centimeter height to feet, inches, and total inches.", formula: "centimeters ÷ 2.54 = total inches", category: "height", searchIntent: "convert centimeters to feet and inches" },
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
