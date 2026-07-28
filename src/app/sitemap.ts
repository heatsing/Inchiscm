import type { MetadataRoute } from "next";
import { pageRegistry } from "@/data/page-registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return pageRegistry.map((page) => ({
    url: page.canonical,
    lastModified: page.updatedAt,
    changeFrequency: "monthly",
    priority: page.type === "home" ? 1 : page.type === "tool" || page.type === "chart" ? 0.8 : 0.7,
  }));
}
