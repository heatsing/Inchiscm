import {
  allInchValues,
  centimeterValues,
  cmSlug,
  heights,
  heightSlug,
  inchSlug,
} from "@/lib/conversions";
import {
  getCmPageData,
  getHeightPageData,
  getInchPageData,
  guideDirectAnswers,
  guideFaqs,
  guides,
  isGuideSlug,
} from "./content";
import { ROUTE_UPDATED_AT } from "./constants";
import { getCmRelatedLinks, getFractionCmRelatedLinks, getGuideRelatedLinks, getHeightRelatedLinks, getInchRelatedLinks } from "@/lib/internal-links";
import { getCmNumericModules, getInchNumericModules } from "@/lib/numeric-page-modules";
import { FRACTION_CM_PAGES, getFractionCmPageData, type FractionCmSpec } from "@/lib/fraction-cm";
import { staticRouteDefinitions } from "./static";
import { hubSeoTitle } from "./hub-seo-titles";
import type { RouteDefinition, RouteLinkSection, SeoScore } from "./types";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

function baselineScore(contentItems: number, relatedLinks: RouteLinkSection[]): SeoScore {
  const internalLinkCount = relatedLinks.reduce((total, section) => total + section.links.length, 0);
  const content = Math.min(40, 20 + contentItems * 2);
  const internalLinks = internalLinkCount >= 2 ? 20 : internalLinkCount * 10;
  const score = content + 20 + internalLinks + 10;
  return {
    score,
    grade: score >= 85 ? "A" : score >= 70 ? "B" : "C",
    releaseDecision: score >= 85 ? "publish" : "observe",
    content,
    searchIntent: 20,
    internalLinks,
    demandEvidence: 10,
  };
}

function inchDefinition(value: number): RouteDefinition {
  const data = getInchPageData(value);
  const path = inchSlug(value);
  const relatedLinks = getInchRelatedLinks(value);
  const modules = getInchNumericModules(value);
  return {
    path,
    slug: path.slice(1),
    type: "inch",
    title: data.title,
    description: data.description,
    h1: data.h1,
    canonical: absoluteUrl(path),
    directAnswer: data.directAnswer,
    formula: data.formula,
    conversionValue: { kind: "inch", value, resultCm: value * 2.54 },
    category: "inch",
    searchIntent: data.keywords[0],
    examples: data.examples.map((item) => item.text),
    useCases: [data.useCase],
    tips: data.tips,
    faq: modules.faq,
    relatedLinks,
    breadcrumbLabel: data.breadcrumbLabel,
    updatedAt: ROUTE_UPDATED_AT,
    seoScore: baselineScore(data.examples.length + data.tips.length + modules.faq.length + 4, relatedLinks),
  };
}

function cmDefinition(value: number): RouteDefinition {
  const data = getCmPageData(value);
  const path = cmSlug(value);
  const relatedLinks = getCmRelatedLinks(value);
  const modules = getCmNumericModules(value);
  return {
    path,
    slug: path.slice(1),
    type: "cm",
    title: data.title,
    description: data.description,
    h1: data.h1,
    canonical: absoluteUrl(path),
    directAnswer: data.directAnswer,
    formula: data.formula,
    conversionValue: { kind: "cm", value, resultInches: value / 2.54 },
    category: "cm",
    searchIntent: data.keywords[0],
    examples: data.examples.map((item) => item.text),
    useCases: [data.useCase],
    tips: data.tips,
    faq: modules.faq,
    relatedLinks,
    breadcrumbLabel: data.breadcrumbLabel,
    updatedAt: ROUTE_UPDATED_AT,
    seoScore: baselineScore(data.examples.length + data.tips.length + modules.faq.length + 4, relatedLinks),
  };
}

function heightDefinition(feet: number, inches: number): RouteDefinition {
  const data = getHeightPageData(feet, inches);
  const path = heightSlug(feet, inches);
  const totalInches = feet * 12 + inches;
  const relatedLinks = getHeightRelatedLinks(feet, inches);
  return {
    path,
    slug: path.slice(1),
    type: "height",
    title: data.title,
    description: data.description,
    h1: data.h1,
    canonical: absoluteUrl(path),
    directAnswer: data.directAnswer,
    formula: data.formula,
    conversionValue: { kind: "height", feet, inches, totalInches, resultCm: totalInches * 2.54 },
    category: "height",
    searchIntent: data.keywords[0],
    examples: data.examples.map((item) => item.text),
    useCases: [data.useCase],
    tips: data.tips,
    faq: data.faq,
    relatedLinks,
    breadcrumbLabel: data.breadcrumbLabel,
    updatedAt: ROUTE_UPDATED_AT,
    seoScore: baselineScore(data.examples.length + data.tips.length + data.faq.length, relatedLinks),
  };
}

function fractionCmDefinition(spec: FractionCmSpec): RouteDefinition {
  const data = getFractionCmPageData(spec);
  const relatedLinks = getFractionCmRelatedLinks(spec);
  return {
    path: data.path,
    slug: data.slug,
    type: "guide",
    title: data.title,
    description: data.description,
    h1: data.h1,
    canonical: absoluteUrl(data.path),
    directAnswer: data.directAnswer,
    formula: data.formula,
    conversionValue: {
      kind: "fraction-cm",
      numerator: spec.numerator,
      denominator: spec.denominator,
      inches: data.inches,
      resultCm: data.cm,
    },
    category: "fraction",
    searchIntent: data.searchIntent,
    examples: [],
    useCases: [],
    tips: [],
    faq: [],
    relatedLinks,
    breadcrumbLabel: data.breadcrumbLabel,
    updatedAt: ROUTE_UPDATED_AT,
    seoScore: baselineScore(4, relatedLinks),
  };
}

function guideDefinition(slug: string): RouteDefinition {
  if (!isGuideSlug(slug)) throw new Error(`Unknown guide slug: ${slug}`);
  const guide = guides[slug];
  const path = `/${slug}`;
  const relatedLinks = getGuideRelatedLinks(slug);
  const faq = guideFaqs[slug] ?? [];
  return {
    path,
    slug,
    type: "guide",
    title: hubSeoTitle(slug) ?? guide.title,
    description: guide.description,
    h1: guide.title,
    canonical: absoluteUrl(path),
    directAnswer: guideDirectAnswers[slug],
    formula: "",
    category: slug.includes("height") ? "height" : slug.includes("screen") ? "screen" : "guide",
    searchIntent: guide.title,
    examples: [],
    useCases: [],
    tips: [],
    faq,
    relatedLinks,
    breadcrumbLabel: guide.title,
    updatedAt: ROUTE_UPDATED_AT,
    seoScore: baselineScore(faq.length + guide.sections.length, relatedLinks),
  };
}

export const dynamicRouteDefinitions: RouteDefinition[] = [
  ...allInchValues.map(inchDefinition),
  ...centimeterValues.map(cmDefinition),
  ...heights.map(({ feet, inches }) => heightDefinition(feet, inches)),
  ...FRACTION_CM_PAGES.map(fractionCmDefinition),
  ...Object.keys(guides).map(guideDefinition),
];

export const pageRegistry: RouteDefinition[] = [
  ...staticRouteDefinitions,
  ...dynamicRouteDefinitions,
];

const pageRegistryByPath = new Map(pageRegistry.map((page) => [page.path, page]));

if (pageRegistryByPath.size !== pageRegistry.length) {
  throw new Error("Page registry contains duplicate paths");
}

export function getPageDefinition(path: string) {
  const normalized = path === "" ? "/" : path;
  return pageRegistryByPath.get(normalized);
}

export function requirePageDefinition(path: string) {
  const page = getPageDefinition(path);
  if (!page) throw new Error(`Page registry is missing ${path}`);
  return page;
}

export function registryMetadata(path: string) {
  const page = requirePageDefinition(path);
  return pageMetadata(page.title, page.description, page.path);
}

export function dynamicSlugParams() {
  return dynamicRouteDefinitions.map(({ slug }) => ({ slug }));
}

export function allIndexablePaths() {
  return pageRegistry.map(({ path }) => path);
}

export type { RouteDefinition, SeoScore } from "./types";
