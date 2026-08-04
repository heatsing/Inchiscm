import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const siteOrigin = "https://inchiscm.com";
const errors = [];

const read = (file) => fs.readFileSync(file, "utf8");
const fail = (message) => errors.push(message);

function decodeEntities(value = "") {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function tagAttribute(tag, name) {
  return decodeEntities(tag?.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]?.trim());
}

function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  return clean || "/";
}

function htmlFileForPath(pathname) {
  const clean = pathname === "/" ? "index" : pathname.replace(/^\//, "");
  return path.join(outDir, `${clean}.html`);
}

function schemaNodes(schema) {
  const roots = Array.isArray(schema) ? schema : [schema];
  return roots.flatMap((item) => (Array.isArray(item?.["@graph"]) ? item["@graph"] : [item]));
}

function schemaTypes(schema) {
  return schemaNodes(schema)
    .flatMap((item) => (Array.isArray(item?.["@type"]) ? item["@type"] : [item?.["@type"]]))
    .filter(Boolean);
}

function collectJsonLd(html, pathname) {
  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  return blocks.flatMap(([, raw], index) => {
    try {
      return [JSON.parse(raw.replaceAll("\\u003c", "<"))];
    } catch (error) {
      fail(`Invalid JSON-LD block ${index + 1} on ${pathname}: ${error.message}`);
      return [];
    }
  });
}

function isToolPage(pathname) {
  return (
    pathname === "/"
    || /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)
    || /^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)
    || /^\/\d+(?:-\d+)?-in-cm$/.test(pathname)
    || /^\/\d+-feet-in-cm$/.test(pathname)
    || [
      "/inches-to-cm",
      "/cm-to-inches",
      "/inch-to-cm-chart",
      "/cm-to-inch-chart",
      "/height-chart",
      "/height-converter",
      "/screen-size-converter",
      "/inches-to-cm-dimensions",
      "/cm-to-inches-dimensions",
      "/feet-to-cm",
      "/inches-to-mm",
      "/mm-to-inches",
      "/cm-to-feet-and-inches",
    ].includes(pathname)
    || ![
      "/privacy-policy",
      "/terms-of-service",
      "/site-map",
      "/conversion-methodology",
    ].includes(pathname)
  );
}

function scanForbiddenUnicode(file, source) {
  const forbiddenCodePoints = new Map([
    [0xfffd, "replacement character"],
    [0x8133, "CJK mojibake character for multiplication sign"],
    [0x6885, "CJK mojibake character for division sign"],
    [0x922b, "CJK mojibake character for right arrow"],
    [0x922e, "CJK mojibake character for approximately sign"],
    [0x6f0f, "CJK mojibake character for copyright sign"],
    [0x8def, "CJK mojibake character for middle dot"],
    [0x923c, "CJK mojibake character for swap arrow"],
    [0x00c3, "Latin-1 mojibake marker"],
  ]);

  let index = 0;
  for (const character of source) {
    const label = forbiddenCodePoints.get(character.codePointAt(0));
    if (label) {
      fail(`${label} found in ${file} near character ${index}`);
      return;
    }
    index += character.length;
  }
}

const packageJson = JSON.parse(read(path.join(root, "package.json")));
const verifyScript = packageJson.scripts?.verify ?? "";
if (!verifyScript.includes("npm run site:check")) {
  fail("npm run verify must include npm run site:check so Netlify runs the exported-HTML audit.");
}
if (!verifyScript.includes("npm run performance:check")) {
  fail("npm run verify must include npm run performance:check so Netlify enforces basic speed budgets.");
}

const siteCheckSource = read(path.join(root, "scripts/site-check.mjs"));
if (!siteCheckSource.includes('import "./seo-check.mjs"')) {
  fail("site-check.mjs must import seo-check.mjs so deployment validation uses the full exported-HTML audit.");
}

if (fs.existsSync(path.join(root, "src/data/page-registry/inventory.ts"))) {
  fail("src/data/page-registry/inventory.ts must not exist; pageRegistry is the single route source of truth.");
}

const sitemapSource = read(path.join(root, "src/app/sitemap.ts"));
if (!sitemapSource.includes('import { pageRegistry } from "@/data/page-registry"') || !sitemapSource.includes("pageRegistry.map")) {
  fail("sitemap.ts must be generated directly from pageRegistry.");
}

const dynamicPageSource = read(path.join(root, "src/app/[slug]/page.tsx"));
if (!dynamicPageSource.includes('from "@/data/page-registry"') || !dynamicPageSource.includes("dynamicSlugParams()")) {
  fail("dynamic [slug] routes must use pageRegistry-derived dynamicSlugParams().");
}

for (const defaultAsset of ["file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"]) {
  if (fs.existsSync(path.join(root, "public", defaultAsset))) {
    fail(`Unused default public asset should be removed: public/${defaultAsset}`);
  }
}

if (!fs.existsSync(outDir)) {
  console.error("SEO check requires final static output. Run npm run build first.");
  process.exit(1);
}

const sitemapFile = path.join(outDir, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) {
  console.error("Missing out/sitemap.xml.");
  process.exit(1);
}

for (const directory of ["src", "scripts"]) {
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.(?:ts|tsx|js|mjs|json|md)$/.test(entry.name)) {
        scanForbiddenUnicode(path.relative(root, file), read(file));
      }
    }
  };
  walk(path.join(root, directory));
}

const policy = JSON.parse(read(path.join(root, "seo-page-policy.json")));
const sitemapXml = read(sitemapFile);
scanForbiddenUnicode("out/sitemap.xml", sitemapXml);

const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeEntities(match[1]));
const sitemapPaths = sitemapUrls.map((url) => {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== siteOrigin) fail(`Sitemap URL uses the wrong origin: ${url}`);
    if (parsed.search || parsed.hash) fail(`Sitemap URL contains a query or fragment: ${url}`);
    return normalizePath(parsed.pathname);
  } catch {
    fail(`Invalid sitemap URL: ${url}`);
    return "";
  }
}).filter(Boolean);
const sitemapPathSet = new Set(sitemapPaths);

if (sitemapPathSet.size !== sitemapPaths.length) fail("Sitemap contains duplicate URLs.");
if (sitemapPathSet.size < policy.minimumIndexableRouteCount) {
  fail(`Route count decreased: ${sitemapPathSet.size} is below the protected baseline of ${policy.minimumIndexableRouteCount}.`);
}

const titles = new Map();
const descriptions = new Map();
const inboundLinks = new Map(sitemapPaths.map((pathname) => [pathname, new Set()]));
let jsonLdBlocks = 0;
let internalLinks = 0;

for (const pathname of sitemapPaths) {
  const htmlFile = htmlFileForPath(pathname);
  if (!fs.existsSync(htmlFile)) {
    fail(`Sitemap route has no exported HTML: ${pathname}`);
    continue;
  }

  let html;
  try {
    html = read(htmlFile);
  } catch (error) {
    fail(`Exported HTML changed while validating ${pathname}: ${error.message}`);
    continue;
  }
  scanForbiddenUnicode(path.relative(root, htmlFile), html);
  const visibleHtml = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");

  const titleMatches = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  const descriptionTags = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => tagAttribute(tag, "name") === "description");
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const canonicalTags = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => tagAttribute(tag, "rel") === "canonical");
  const h1Matches = [...visibleHtml.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)];
  const h1 = decodeEntities(h1Matches[0]?.[1]?.replace(/<[^>]+>/g, "").trim());
  const expectedCanonical = pathname === "/" ? siteOrigin : `${siteOrigin}${pathname}`;
  const title = decodeEntities(titleMatches[0]?.[1]?.replace(/<[^>]+>/g, "").trim());
  const description = tagAttribute(descriptionTags[0], "content");
  const canonical = tagAttribute(canonicalTags[0], "href");

  if (titleMatches.length !== 1 || !title) fail(`Expected one non-empty title on ${pathname}.`);
  if (descriptionTags.length !== 1 || !description) fail(`Expected one non-empty meta description on ${pathname}.`);
  if (canonicalTags.length !== 1) fail(`Expected exactly one canonical on ${pathname}, found ${canonicalTags.length}.`);
  if (canonical !== expectedCanonical) fail(`Self-canonical mismatch on ${pathname}: ${canonical || "missing"}.`);
  if (h1Matches.length !== 1) fail(`Expected exactly one H1 on ${pathname}, found ${h1Matches.length}.`);
  const ogImage = metaTags.find((tag) => tagAttribute(tag, "property") === "og:image");
  const twitterCard = metaTags.find((tag) => tagAttribute(tag, "name") === "twitter:card");
  const twitterImage = metaTags.find((tag) => tagAttribute(tag, "name") === "twitter:image");
  if (!ogImage || !tagAttribute(ogImage, "content")) fail(`Missing og:image on ${pathname}.`);
  if (tagAttribute(twitterCard, "content") !== "summary_large_image") fail(`Twitter card must be summary_large_image on ${pathname}.`);
  if (!twitterImage || !tagAttribute(twitterImage, "content")) fail(`Missing twitter:image on ${pathname}.`);
  if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) fail(`Unexpected noindex on ${pathname}.`);
  if (/\{\{|\}\}|(?:^|[\s>])TODO(?:[\s<]|$)/i.test(visibleHtml)) fail(`Unresolved visible placeholder on ${pathname}.`);

  if (title) {
    const routes = titles.get(title) ?? [];
    routes.push(pathname);
    titles.set(title, routes);
  }
  if (description) {
    const routes = descriptions.get(description) ?? [];
    routes.push(pathname);
    descriptions.set(description, routes);
  }

  const schemas = collectJsonLd(html, pathname);
  jsonLdBlocks += schemas.length;
  if (schemas.length === 0) fail(`Missing JSON-LD on ${pathname}.`);
  const nodes = schemas.flatMap(schemaNodes);
  const types = schemas.flatMap(schemaTypes);
  const webPage = nodes.find((node) => {
    const type = node?.["@type"];
    return type === "WebPage" || (Array.isArray(type) && type.includes("WebPage"));
  });
  const breadcrumb = nodes.find((node) => {
    const type = node?.["@type"];
    return type === "BreadcrumbList" || (Array.isArray(type) && type.includes("BreadcrumbList"));
  });
  if (!webPage) fail(`Missing WebPage JSON-LD on ${pathname}.`);
  if (webPage && webPage.url !== expectedCanonical) fail(`WebPage JSON-LD URL mismatch on ${pathname}.`);
  if (!breadcrumb) fail(`Missing BreadcrumbList JSON-LD on ${pathname}.`);
  const breadcrumbItems = breadcrumb?.itemListElement ?? [];
  if (!breadcrumbItems.some((item) => item?.item === expectedCanonical)) {
    fail(`BreadcrumbList does not contain the canonical URL on ${pathname}.`);
  }
  if (isToolPage(pathname) && !types.includes("WebApplication")) {
    fail(`Missing WebApplication JSON-LD on tool page ${pathname}.`);
  }

  const isExactConversion = (
    /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)
    || /^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)
    || /^\/\d+(?:-\d+)?-in-cm$/.test(pathname)
    || /^\/\d+-feet-in-cm$/.test(pathname)
  );
  if (isExactConversion) {
    if (!/<div class="answer">[^<]+<\/div>/i.test(visibleHtml)) fail(`Missing static direct answer on ${pathname}.`);
    if (!/<div class="formula">[\s\S]*?<\/div>/i.test(visibleHtml)) fail(`Missing static worked formula on ${pathname}.`);
    if (!/<section class="faq">[\s\S]*?<details>/i.test(visibleHtml)) fail(`Missing visible FAQ section on exact conversion page ${pathname}.`);
    if (!/class="related-link-sections"/i.test(visibleHtml)) fail(`Missing related-link sections on exact conversion page ${pathname}.`);
  }
  if (pathname === "/24-inches-in-cm") {
    const answer = decodeEntities(visibleHtml.match(/<div class="answer">([^<]+)<\/div>/i)?.[1]?.trim());
    const formula = decodeEntities(visibleHtml.match(/<div class="formula">([^<]+)<\/div>/i)?.[1]?.trim());
    if (title !== "24 Inches in CM: 60.96 cm | Inch Converter") fail("24-inch title contract changed.");
    if (description !== "24 inches equals exactly 60.96 centimeters. View the formula, millimeter value, nearby conversions, and convert other measurements.") fail("24-inch description contract changed.");
    if (h1 !== "24 Inches in CM") fail("24-inch H1 contract changed.");
    if (answer !== "24 inches is exactly 60.96 centimeters.") fail("24-inch direct-answer contract changed.");
    if (formula !== "24 × 2.54 = 60.96 cm") fail("24-inch formula contract changed.");
    if (webPage?.name !== "24 Inches in CM: 60.96 cm") fail("24-inch JSON-LD name contract changed.");
  }

  for (const match of visibleHtml.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = decodeEntities(match[1]);
    if (!href.startsWith("/")) continue;
    internalLinks += 1;
    if (href.includes("?")) fail(`Internal query URL on ${pathname}: ${href}`);
    const target = normalizePath(href.split(/[?#]/, 1)[0]);
    if (!sitemapPathSet.has(target) && !["/sitemap.xml", "/robots.txt"].includes(target)) {
      fail(`Internal link target is not an indexable registered route on ${pathname}: ${href}`);
      continue;
    }
    if (target !== pathname) inboundLinks.get(target)?.add(pathname);
  }
}

for (const [title, routes] of titles) {
  if (routes.length > 1) fail(`Duplicate title "${title}" on ${routes.join(", ")}.`);
}
for (const routes of descriptions.values()) {
  if (routes.length > 1) fail(`Duplicate meta description on ${routes.join(", ")}.`);
}
for (const [pathname, sources] of inboundLinks) {
  if (pathname !== "/" && sources.size < 2) fail(`${pathname} has only ${sources.size} distinct internal-link sources.`);
}

const exportedHtml = fs.readdirSync(outDir)
  .filter((name) => name.endsWith(".html") && !["404.html", "_not-found.html"].includes(name))
  .map((name) => (name === "index.html" ? "/" : `/${name.slice(0, -5)}`));
for (const pathname of exportedHtml) {
  if (!sitemapPathSet.has(pathname)) fail(`Exported indexable HTML is absent from sitemap: ${pathname}`);
}

const programmaticCount = sitemapPaths.filter((pathname) => (
  /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)
  || /^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)
  || /^\/\d+(?:-\d+)?-in-cm$/.test(pathname)
  || /^\/\d+-feet-in-cm$/.test(pathname)
  || policy.guidePages.includes(pathname.slice(1))
)).length;
if (programmaticCount > policy.maxProgrammaticPages) {
  fail(`Programmatic route count ${programmaticCount} exceeds ${policy.maxProgrammaticPages}.`);
}

if (errors.length) {
  console.error(errors.map((error) => `FAIL: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${sitemapPaths.length} registered sitemap URLs have exported HTML.`);
console.log(`PASS: ${titles.size} unique titles and ${descriptions.size} unique descriptions.`);
console.log(`PASS: every route has one self-canonical, one H1, and matching WebPage/Breadcrumb JSON-LD.`);
console.log(`PASS: tool routes include WebApplication JSON-LD; ${jsonLdBlocks} JSON-LD blocks parsed.`);
console.log(`PASS: ${internalLinks} crawlable internal links target registered routes.`);
console.log(`PASS: source and exported HTML contain no forbidden Unicode mojibake.`);
