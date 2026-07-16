import type { MetadataRoute } from "next";
import {
  allInchValues,
  centimeterValues,
  cmSlug,
  heights,
  heightSlug,
  inchSlug,
} from "@/lib/conversions";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const corePages = [
  "",
  "/inches-to-cm",
  "/cm-to-inches",
  "/inch-to-cm-chart",
  "/cm-to-inch-chart",
  "/height-converter",
  "/height-chart",
  "/screen-size-converter",
  "/feet-to-cm",
  "/inches-to-mm",
  "/how-to-convert-inches-to-cm",
  "/inch-vs-cm",
  "/why-is-one-inch-2-54-cm",
  "/how-to-measure-inches-without-a-ruler",
  "/how-big-is-10-inches",
  "/how-big-is-12-inches",
  "/how-big-is-15-inches",
  "/common-product-dimensions-in-cm",
  "/screen-size-vs-width-height",
  "/height-conversion-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = corePages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("converter") || path.includes("chart") ? 0.8 : 0.7,
  }));
  const inches: MetadataRoute.Sitemap = allInchValues.map((value) => ({
    url: `${siteUrl}${inchSlug(value)}`,
    changeFrequency: "monthly",
    priority: value <= 100 ? 0.7 : 0.5,
  }));
  const centimeters: MetadataRoute.Sitemap = centimeterValues.map((value) => ({
    url: `${siteUrl}${cmSlug(value)}`,
    changeFrequency: "monthly",
    priority: value <= 100 ? 0.7 : 0.5,
  }));
  const heightPages: MetadataRoute.Sitemap = heights.map(({ feet, inches: inch }) => ({
    url: `${siteUrl}${heightSlug(feet, inch)}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...core, ...inches, ...centimeters, ...heightPages];
}
