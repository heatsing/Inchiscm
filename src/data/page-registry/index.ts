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
import { ROUTE_UPDATED_AT, SITE_ORIGIN } from "./constants";
import { getCmRelatedLinks, getGuideRelatedLinks, getHeightRelatedLinks, getInchRelatedLinks } from "@/lib/internal-links";
import { staticRouteDefinitions } from "./static";
import type { RouteDefinition, RouteLinkSection, SeoScore } from "./types";
import { pageMetadata } from "@/lib/seo";

function canonical(path: string) {
  return path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}

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
  return {
    path,
    slug: path.slice(1),
    type: "inch",
    title: data.title,
    description: data.description,
    h1: data.h1,
    canonical: canonical(path),
    directAnswer: data.directAnswer,
    formula: data.formula,
    conversionValue: { kind: "inch", value, resultCm: value * 2.54 },
    category: "inch",
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

function cmDefinition(value: number): RouteDefinition {
  const data = getCmPageData(value);
  const path = cmSlug(value);
  const relatedLinks = getCmRelatedLinks(value);
  return {
    path,
    slug: path.slice(1),
    type: "cm",
    title: data.title,
    description: data.description,
    h1: data.h1,
    canonical: canonical(path),
    directAnswer: data.directAnswer,
    formula: data.formula,
    conversionValue: { kind: "cm", value, resultInches: value / 2.54 },
    category: "cm",
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
    canonical: canonical(path),
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
    title: guide.title,
    description: guide.description,
    h1: guide.title,
    canonical: canonical(path),
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
