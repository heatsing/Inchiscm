import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const reportsDir = path.join(root, "reports");
const mode = process.argv[2] === "post" ? "post-expansion" : "pre-expansion";
const siteOrigin = "https://inchiscm.com";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function decodeEntities(value = "") {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
}

function tagAttribute(tag, name) {
  return decodeEntities(tag?.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]?.trim() ?? "");
}

function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  return clean || "/";
}

function htmlFileForPath(pathname) {
  const clean = pathname === "/" ? "index" : pathname.replace(/^\//, "");
  return path.join(outDir, `${clean}.html`);
}

function textFromHtml(html) {
  return decodeEntities(html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function wordCount(text) {
  return (text.match(/\b[\w']+\b/g) ?? []).length;
}

function jsonLdTypes(html) {
  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  const errors = [];
  for (const [, raw] of blocks) {
    try {
      const parsed = JSON.parse(raw.replaceAll("\\u003c", "<"));
      const nodes = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
      for (const node of nodes) {
        const type = node?.["@type"];
        if (Array.isArray(type)) types.push(...type);
        else if (type) types.push(type);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { types: [...new Set(types)], errors };
}

function archetype(pathname) {
  if (pathname === "/") return "home";
  if (/^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)) return "inch-value";
  if (/^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)) return "cm-value";
  if (/^\/\d+(?:-\d+)?-in-cm$/.test(pathname) || /^\/\d+-feet-in-cm$/.test(pathname)) return "height-value";
  if (pathname.includes("chart")) return "chart";
  if (pathname.includes("calculator") || pathname.includes("converter") || pathname.includes("-to-")) return "tool";
  if (pathname.includes("policy") || pathname.includes("terms") || pathname.includes("site-map")) return "policy";
  return "guide";
}

function paragraphFingerprint(text) {
  return text
    .toLowerCase()
    .replace(/[0-9.,'"’″′/-]+/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

if (!fs.existsSync(outDir)) {
  console.error("Run npm run build before export-html-audit.");
  process.exit(1);
}

const sitemapFile = path.join(outDir, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) {
  console.error("Missing out/sitemap.xml.");
  process.exit(1);
}

fs.mkdirSync(reportsDir, { recursive: true });

const sitemapXml = read(sitemapFile);
const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => decodeEntities(match[1]))
  .map((url) => {
    const parsed = new URL(url);
    return normalizePath(parsed.pathname);
  });
const sitemapPathSet = new Set(sitemapPaths);
const inbound = new Map(sitemapPaths.map((pathname) => [pathname, new Set()]));
const rows = [];
const paragraphMap = new Map();
const brokenLinks = [];
const duplicateTitles = new Map();
const duplicateDescriptions = new Map();

for (const pathname of sitemapPaths) {
  const file = htmlFileForPath(pathname);
  const exists = fs.existsSync(file);
  const html = exists ? read(file) : "";
  const visibleHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
  const visibleText = textFromHtml(html);
  const title = decodeEntities(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "");
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const description = tagAttribute(metaTags.find((tag) => tagAttribute(tag, "name") === "description"), "content");
  const canonical = tagAttribute([...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]).find((tag) => tagAttribute(tag, "rel") === "canonical"), "href");
  const h1s = [...visibleHtml.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)].map((match) => textFromHtml(match[1]));
  const jsonLd = jsonLdTypes(html);
  const outLinks = [];
  const expectedCanonical = pathname === "/" ? siteOrigin : `${siteOrigin}${pathname}`;
  const type = archetype(pathname);
  const primaryContentRequiresJs = type !== "policy" && (!/<h1/i.test(visibleHtml) || !/(answer|formula|converter-card|data-table-wrap|tool-seo-content)/i.test(visibleHtml));
  const calculatorAvailability = /(converter-card|length-converter|screen-calculator|data-table-wrap)/i.test(visibleHtml);
  const serverRenderedAnswer = /class="answer"|answer-box|direct-answer/i.test(visibleHtml);
  const adPlaceholder = /Advertisement|ad-slot-reserved|googlesyndication|adsbygoogle/i.test(visibleHtml);

  for (const match of visibleHtml.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = decodeEntities(match[1]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = normalizePath(href.split(/[?#]/, 1)[0]);
    outLinks.push(target);
    if (sitemapPathSet.has(target)) inbound.get(target)?.add(pathname);
    else if (!["/sitemap.xml", "/robots.txt"].includes(target)) brokenLinks.push({ from: pathname, href });
  }

  if (title) duplicateTitles.set(title, [...(duplicateTitles.get(title) ?? []), pathname]);
  if (description) duplicateDescriptions.set(description, [...(duplicateDescriptions.get(description) ?? []), pathname]);

  const paragraphs = [...visibleHtml.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
    .map((match) => textFromHtml(match[1]))
    .filter((text) => wordCount(text) >= 10);
  for (const paragraph of paragraphs) {
    const key = paragraphFingerprint(paragraph);
    paragraphMap.set(key, [...(paragraphMap.get(key) ?? []), pathname]);
  }

  rows.push({
    url: pathname,
    exportStatus: exists ? "ok" : "missing-html",
    title,
    description,
    canonical,
    h1: h1s[0] ?? "",
    h1Count: h1s.length,
    wordCount: wordCount(visibleText),
    jsonLdTypes: jsonLd.types,
    jsonLdErrors: jsonLd.errors,
    internalLinksIn: 0,
    internalLinksOut: outLinks.length,
    pageArchetype: type,
    calculatorAvailability,
    serverRenderedAnswer,
    primaryContentRequiresJs,
    adPlaceholder,
    canonicalMatchesSitemap: canonical === expectedCanonical,
  });
}

for (const row of rows) {
  row.internalLinksIn = inbound.get(row.url)?.size ?? 0;
}

const repeatedParagraphs = [...paragraphMap.entries()]
  .filter(([, pages]) => new Set(pages).size >= 5)
  .map(([paragraph, pages]) => ({ paragraph, pageCount: new Set(pages).size, samplePages: [...new Set(pages)].slice(0, 8) }));

const duplicateTitleGroups = [...duplicateTitles.entries()].filter(([, pages]) => pages.length > 1);
const duplicateDescriptionGroups = [...duplicateDescriptions.entries()].filter(([, pages]) => pages.length > 1);

const summary = {
  mode,
  exportedIndexableHtmlPages: rows.filter((row) => row.exportStatus === "ok").length,
  sitemapUrls: sitemapPaths.length,
  duplicateTitleGroups: duplicateTitleGroups.length,
  duplicateDescriptionGroups: duplicateDescriptionGroups.length,
  missingCanonicals: rows.filter((row) => !row.canonical).length,
  canonicalSitemapMismatches: rows.filter((row) => !row.canonicalMatchesSitemap).length,
  missingH1: rows.filter((row) => row.h1Count === 0).length,
  multipleH1: rows.filter((row) => row.h1Count > 1).length,
  missingJsonLd: rows.filter((row) => row.jsonLdTypes.length === 0).length,
  invalidJsonLd: rows.filter((row) => row.jsonLdErrors.length > 0).length,
  orphanPages: rows.filter((row) => row.url !== "/" && row.internalLinksIn < 2).length,
  brokenInternalLinks: brokenLinks.length,
  clientOnlyPrimaryContent: rows.filter((row) => row.primaryContentRequiresJs).length,
  visibleAdPlaceholders: rows.filter((row) => row.adPlaceholder).length,
  repeatedParagraphGroups: repeatedParagraphs.length,
  pageArchetypes: rows.reduce((acc, row) => ({ ...acc, [row.pageArchetype]: (acc[row.pageArchetype] ?? 0) + 1 }), {}),
};

const blockingIssues = [
  ["duplicateTitleGroups", summary.duplicateTitleGroups],
  ["duplicateDescriptionGroups", summary.duplicateDescriptionGroups],
  ["missingCanonicals", summary.missingCanonicals],
  ["canonicalSitemapMismatches", summary.canonicalSitemapMismatches],
  ["missingH1", summary.missingH1],
  ["multipleH1", summary.multipleH1],
  ["missingJsonLd", summary.missingJsonLd],
  ["invalidJsonLd", summary.invalidJsonLd],
  ["orphanPages", summary.orphanPages],
  ["brokenInternalLinks", summary.brokenInternalLinks],
  ["clientOnlyPrimaryContent", summary.clientOnlyPrimaryContent],
  ["visibleAdPlaceholders", summary.visibleAdPlaceholders],
].filter(([, count]) => count > 0);

const audit = {
  summary,
  duplicateTitleGroups,
  duplicateDescriptionGroups,
  brokenLinks,
  repeatedParagraphs,
  pages: rows,
};

fs.writeFileSync(path.join(reportsDir, `${mode}-seo-audit.json`), JSON.stringify(audit, null, 2));
fs.writeFileSync(path.join(reportsDir, `${mode}-seo-audit.md`), `# ${mode} SEO Audit

## Summary

${Object.entries(summary).map(([key, value]) => `- ${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`).join("\n")}

## Notes

- Exported HTML was inspected directly from \`out/\`.
- Sitemap URLs were compared with canonical links.
- JSON-LD blocks were parsed from final HTML.
- Internal links were checked against registered sitemap routes.
`);
fs.writeFileSync(
  path.join(reportsDir, mode === "pre-expansion" ? "content-similarity-audit.csv" : "post-expansion-content-similarity.csv"),
  ["paragraph,pageCount,samplePages", ...repeatedParagraphs.map((item) => `"${item.paragraph.replaceAll('"', '""')}",${item.pageCount},"${item.samplePages.join(" ")}"`)].join("\n"),
);

console.log(`Wrote ${mode} audit for ${summary.sitemapUrls} sitemap URLs.`);
console.log(JSON.stringify(summary, null, 2));

if (mode === "post-expansion" && blockingIssues.length) {
  console.error(`Post-expansion audit failed: ${blockingIssues.map(([name, count]) => `${name}=${count}`).join(", ")}`);
  process.exit(1);
}
