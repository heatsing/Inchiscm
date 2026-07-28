export type RouteType =
  | "home"
  | "tool"
  | "chart"
  | "guide"
  | "policy"
  | "inch"
  | "cm"
  | "height";

export type SeoGrade = "A" | "B" | "C";

export type SeoScore = {
  score: number;
  grade: SeoGrade;
  releaseDecision: "publish" | "observe" | "block";
  content: number;
  searchIntent: number;
  internalLinks: number;
  demandEvidence: number;
};

export type RouteFaq = {
  question: string;
  answer: string;
};

export type RouteLink = {
  href: string;
  label: string;
};

export type RouteLinkSection = {
  title: string;
  links: RouteLink[];
};

export type ConversionValue =
  | { kind: "inch"; value: number; resultCm: number }
  | { kind: "cm"; value: number; resultInches: number }
  | { kind: "height"; feet: number; inches: number; totalInches: number; resultCm: number };

export type RouteDefinition = {
  path: string;
  slug: string;
  type: RouteType;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  directAnswer: string;
  formula: string;
  conversionValue?: ConversionValue;
  category: string;
  searchIntent: string;
  examples: string[];
  useCases: string[];
  tips: string[];
  faq: RouteFaq[];
  relatedLinks: RouteLinkSection[];
  breadcrumbLabel: string;
  updatedAt: string;
  seoScore: SeoScore;
};
