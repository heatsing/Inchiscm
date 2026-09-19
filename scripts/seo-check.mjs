import fs from "node:fs";
import path from "node:path";
import {
  FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS,
  MISSING_PATH_404_FALLBACK,
  PROTECTED_HEIGHT_PATHS,
  UNKNOWN_PATH_SAMPLES,
  UNPUBLISHED_CM_ALIAS_SAMPLES,
  UNPUBLISHED_HEIGHT_ALIAS_SAMPLES,
  UNPUBLISHED_INCH_ALIAS_SAMPLES,
  firstMatchingPathRedirect,
  formatNetlifyRedirectsFile,
  isHostScopedRedirect,
  isMissingPath404Fallback,
  isOpenPathSplat,
  isPathLevelRedirectSplat,
  parseNetlifyRedirectsFile,
  parseNetlifyTomlRedirects,
  publishedCmAliasRedirects,
  publishedCmCanonicals,
  publishedHeightAliasRedirects,
  publishedHeightCanonicals,
  publishedInchAliasRedirects,
  publishedInchCanonicals,
  publishedPathRedirects,
  unitPairSynonymRedirects,
} from "../src/data/page-registry/inch-alias-redirects.mjs";

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
const buildScript = packageJson.scripts?.build ?? "";
if (!verifyScript.includes("npm run site:check")) {
  fail("npm run verify must include npm run site:check so Netlify runs the exported-HTML audit.");
}
if (!verifyScript.includes("npm run performance:check")) {
  fail("npm run verify must include npm run performance:check so Netlify enforces basic speed budgets.");
}
if (!buildScript.includes("scripts/generate-inch-alias-redirects.mjs")) {
  fail("npm run build must generate published-inch alias redirects into out/_redirects.");
}

const siteCheckSource = read(path.join(root, "scripts/site-check.mjs"));
if (!siteCheckSource.includes('import "./seo-check.mjs"')) {
  fail("site-check.mjs must import seo-check.mjs so deployment validation uses the full exported-HTML audit.");
}

if (fs.existsSync(path.join(root, "src/data/page-registry/inventory.ts"))) {
  fail("src/data/page-registry/inventory.ts must not exist; pageRegistry is the single route source of truth.");
}

const seoSource = read(path.join(root, "src/lib/seo.ts"));
if (/offers:\s*\{/.test(seoSource)) {
  fail("src/lib/seo.ts must not attach Offer markup to free converters.");
}

const netlifyToml = read(path.join(root, "netlify.toml"));
const netlifyRedirectBlocks = netlifyToml.split("[[redirects]]").slice(1);
function hasForcedHostRedirect(from, to) {
  return netlifyRedirectBlocks.some((block) => (
    block.includes(`from = "${from}"`)
    && block.includes(`to = "${to}"`)
    && block.includes("status = 301")
    && block.includes("force = true")
  ));
}
if (!hasForcedHostRedirect("http://www.inchiscm.com/*", "https://inchiscm.com/:splat")) {
  fail("netlify.toml must send http://www.inchiscm.com/* to https://inchiscm.com/:splat in one 301 hop.");
}
if (!hasForcedHostRedirect("https://www.inchiscm.com/*", "https://inchiscm.com/:splat")) {
  fail("netlify.toml must send https://www.inchiscm.com/* to https://inchiscm.com/:splat in one 301 hop.");
}
if (!hasForcedHostRedirect("http://inchiscm.com/*", "https://inchiscm.com/:splat")) {
  fail("netlify.toml must send http://inchiscm.com/* to https://inchiscm.com/:splat in one 301 hop.");
}
const netlifyTomlRedirects = parseNetlifyTomlRedirects(netlifyToml);
if (netlifyTomlRedirects.some((rule) => isOpenPathSplat(rule.from))) {
  fail("netlify.toml must not use a path-level splat; put missing-path 404 last in out/_redirects so published 301s still win.");
}
const tomlPathRedirects = netlifyTomlRedirects.filter((rule) => !isHostScopedRedirect(rule.from));
if (tomlPathRedirects.length > 0) {
  fail(
    `netlify.toml has ${tomlPathRedirects.length} path-level redirects (${tomlPathRedirects[0].from}); put published 301s in out/_redirects above /* /404.html 404 so they are not shadowed.`,
  );
}
if (netlifyRedirectBlocks.length > 6) {
  fail(`netlify.toml has ${netlifyRedirectBlocks.length} redirects; keep only host canonicalization here.`);
}

const synonymRedirects = JSON.parse(read(path.join(root, "src/data/page-registry/unit-pair-synonyms.json")));
const synonymPairs = Object.entries(synonymRedirects);
if (synonymPairs.length !== 13) {
  fail(`Expected 13 unit-pair synonym redirects, found ${synonymPairs.length}.`);
}
if (unitPairSynonymRedirects().length !== synonymPairs.length) {
  fail("unitPairSynonymRedirects() must match unit-pair-synonyms.json.");
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
for (const [from, to] of synonymPairs) {
  if (sitemapPathSet.has(from)) fail(`Redirected synonym ${from} must not appear in the sitemap.`);
  if (!sitemapPathSet.has(to)) fail(`Canonical ${to} must remain in the sitemap.`);
  if (policy.guidePages.includes(from.slice(1))) fail(`Redirected synonym ${from} must leave the page-policy registry.`);
}

const expectedInchAliasRedirects = publishedInchAliasRedirects();
const expectedHeightAliasRedirects = publishedHeightAliasRedirects();
const expectedCmAliasRedirects = publishedCmAliasRedirects();
const expectedPathRedirects = publishedPathRedirects({
  inchRedirects: expectedInchAliasRedirects,
  heightRedirects: expectedHeightAliasRedirects,
  cmRedirects: expectedCmAliasRedirects,
});
const expectedInchAliasFile = formatNetlifyRedirectsFile(expectedPathRedirects);
const inchAliasRedirectsFile = path.join(outDir, "_redirects");
if (!fs.existsSync(inchAliasRedirectsFile)) {
  fail("out/_redirects is missing; npm run build must generate published-inch alias 301s.");
} else {
  const actualInchAliasFile = read(inchAliasRedirectsFile);
  if (actualInchAliasFile !== expectedInchAliasFile) {
    fail("out/_redirects does not match the published-inch alias generator.");
  }
  let generatedInchRedirects = [];
  try {
    generatedInchRedirects = parseNetlifyRedirectsFile(actualInchAliasFile);
  } catch (error) {
    fail(`out/_redirects is invalid: ${error.message}`);
  }
  const aliasRules = generatedInchRedirects.filter((rule) => !isMissingPath404Fallback(rule));
  const generatedFrom = new Map(aliasRules.map((rule) => [rule.from, rule]));
  const publishedInchCanonicalSet = new Set(publishedInchCanonicals());
  const publishedHeightCanonicalSet = new Set(publishedHeightCanonicals());
  const publishedCmCanonicalSet = new Set(publishedCmCanonicals());
  if (aliasRules.length !== expectedPathRedirects.length) {
    fail(`Expected ${expectedPathRedirects.length} published path redirects, found ${aliasRules.length}.`);
  }
  if (!isMissingPath404Fallback(generatedInchRedirects.at(-1))) {
    fail(`out/_redirects must end with ${MISSING_PATH_404_FALLBACK.from} → ${MISSING_PATH_404_FALLBACK.to} ${MISSING_PATH_404_FALLBACK.status}.`);
  }
  if (generatedInchRedirects.filter(isMissingPath404Fallback).length !== 1) {
    fail("out/_redirects must include exactly one missing-path 404 fallback.");
  }
  if (!fs.existsSync(path.join(outDir, "404.html"))) {
    fail("out/404.html is missing; unknown paths cannot hard-404.");
  }
  for (const { from, to, status } of expectedInchAliasRedirects) {
    const actual = generatedFrom.get(from);
    if (!actual || actual.to !== to || actual.status !== status) {
      fail(`Missing one-hop ${status} from ${from} to ${to} in out/_redirects.`);
    }
    if (sitemapPathSet.has(from)) fail(`Inch alias ${from} must not appear in the sitemap.`);
    if (!sitemapPathSet.has(to)) fail(`Inch canonical ${to} must remain in the sitemap.`);
    if (!publishedInchCanonicalSet.has(to)) fail(`Inch alias ${from} targets unpublished ${to}.`);
    if (publishedInchCanonicalSet.has(from)) fail(`Must not redirect live inch canonical ${from}.`);
  }
  for (const alias of UNPUBLISHED_INCH_ALIAS_SAMPLES) {
    if (generatedFrom.has(alias)) fail(`Unpublished alias ${alias} must stay 404, not redirect.`);
  }
  for (const height of PROTECTED_HEIGHT_PATHS) {
    if (generatedFrom.has(height)) fail(`Height page ${height} must not be redirected.`);
    if (!sitemapPathSet.has(height)) fail(`Height canonical ${height} must remain in the sitemap.`);
  }
  if (expectedHeightAliasRedirects.length === 0) {
    fail("Published height alias generator produced no redirects.");
  }
  for (const { from, to, status } of expectedHeightAliasRedirects) {
    const actual = generatedFrom.get(from);
    if (!actual || actual.to !== to || actual.status !== status) {
      fail(`Missing one-hop ${status} from ${from} to ${to} in out/_redirects.`);
    }
    if (sitemapPathSet.has(from)) fail(`Height alias ${from} must not appear in the sitemap.`);
    if (!sitemapPathSet.has(to)) fail(`Height canonical ${to} must remain in the sitemap.`);
    if (!publishedHeightCanonicalSet.has(to)) fail(`Height alias ${from} targets unpublished ${to}.`);
    if (publishedHeightCanonicalSet.has(from)) fail(`Must not redirect live height canonical ${from}.`);
    if (publishedInchCanonicalSet.has(from)) fail(`Must not redirect live inch canonical ${from}.`);
    if (fs.existsSync(htmlFileForPath(from))) fail(`Height alias ${from} must not export indexable HTML.`);
  }
  for (const alias of UNPUBLISHED_HEIGHT_ALIAS_SAMPLES) {
    if (generatedFrom.has(alias)) fail(`Unpublished height alias ${alias} must stay 404, not redirect.`);
    if (sitemapPathSet.has(alias)) fail(`Unpublished height alias ${alias} must not appear in the sitemap.`);
  }
  if (expectedCmAliasRedirects.length === 0) {
    fail("Published cm alias generator produced no redirects.");
  }
  for (const { from, to, status } of expectedCmAliasRedirects) {
    const actual = generatedFrom.get(from);
    if (!actual || actual.to !== to || actual.status !== status) {
      fail(`Missing one-hop ${status} from ${from} to ${to} in out/_redirects.`);
    }
    if (sitemapPathSet.has(from)) fail(`CM alias ${from} must not appear in the sitemap.`);
    if (!sitemapPathSet.has(to)) fail(`CM canonical ${to} must remain in the sitemap.`);
    if (!publishedCmCanonicalSet.has(to)) fail(`CM alias ${from} targets unpublished ${to}.`);
    if (publishedCmCanonicalSet.has(from)) fail(`Must not redirect live cm canonical ${from}.`);
    if (publishedInchCanonicalSet.has(from)) fail(`Must not redirect live inch canonical ${from}.`);
    if (publishedHeightCanonicalSet.has(from)) fail(`Must not redirect live height canonical ${from}.`);
    if (fs.existsSync(htmlFileForPath(from))) fail(`CM alias ${from} must not export indexable HTML.`);
  }
  for (const alias of UNPUBLISHED_CM_ALIAS_SAMPLES) {
    if (generatedFrom.has(alias)) fail(`Unpublished cm alias ${alias} must stay 404, not redirect.`);
    if (sitemapPathSet.has(alias)) fail(`Unpublished cm alias ${alias} must not appear in the sitemap.`);
  }
  for (const [from, to] of synonymPairs) {
    const actual = generatedFrom.get(from);
    if (!actual || actual.to !== to || actual.status !== 301) {
      fail(`Missing one-hop 301 from ${from} to ${to} in out/_redirects.`);
    }
    if (sitemapPathSet.has(from)) fail(`Redirected synonym ${from} must not appear in the sitemap.`);
    if (!sitemapPathSet.has(to)) fail(`Canonical ${to} must remain in the sitemap.`);
  }
  for (const [from, to] of [["/inches-to-centimeters", "/inches-to-cm"], ["/centimeters-to-inches", "/cm-to-inches"]]) {
    const actual = generatedFrom.get(from);
    if (!actual || actual.to !== to || actual.status !== 301) {
      fail(`Missing one-hop 301 from ${from} to ${to} in out/_redirects.`);
    }
  }
  if (FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS.length !== 3) {
    fail(`Expected 3 unreduced-eighth fraction aliases, found ${FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS.length}.`);
  }
  for (const { from, to, status } of FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS) {
    const actual = generatedFrom.get(from);
    if (!actual || actual.to !== to || actual.status !== status) {
      fail(`Missing one-hop ${status} from ${from} to ${to} in out/_redirects.`);
    }
    if (sitemapPathSet.has(from)) fail(`Unreduced fraction alias ${from} must not appear in the sitemap.`);
    if (!sitemapPathSet.has(to)) fail(`Reduced fraction canonical ${to} must remain in the sitemap.`);
    if (policy.guidePages.includes(from.slice(1))) fail(`Unreduced fraction alias ${from} must leave the page-policy registry.`);
    if (fs.existsSync(htmlFileForPath(from))) fail(`Unreduced fraction alias ${from} must not export indexable HTML.`);
  }
  if (aliasRules.some((rule) => isPathLevelRedirectSplat(rule) || rule.from.includes("*") || rule.from.includes(":"))) {
    fail("Published path redirects must not use splat or placeholder patterns.");
  }
  const combinedRedirects = [...generatedInchRedirects, ...netlifyTomlRedirects];
  for (const pathname of UNKNOWN_PATH_SAMPLES) {
    const hit = firstMatchingPathRedirect(pathname, combinedRedirects);
    if (!isMissingPath404Fallback(hit)) {
      fail(`Unknown path ${pathname} must hard-404 via /* /404.html 404, got ${hit?.from} → ${hit?.to} (${hit?.status}).`);
    }
  }
  const publishedAliasSamples = [
    ["/1-inch-to-cm", "/1-inch-in-cm"],
    ["/1-inches-in-cm", "/1-inch-in-cm"],
    ["/2-inches-to-cm", "/2-inches-in-cm"],
    ["/inch-to-millimeter", "/inches-to-mm"],
    ["/inches-to-centimeters", "/inches-to-cm"],
    ["/fraction-2-8-inch-to-cm", "/fraction-1-4-inch-to-cm"],
    ["/fraction-4-8-inch-to-cm", "/fraction-1-2-inch-to-cm"],
    ["/fraction-6-8-inch-to-cm", "/fraction-3-4-inch-to-cm"],
    ["/5-feet-7-inches-in-cm", "/5-7-in-cm"],
    ["/5-foot-7-inches-in-cm", "/5-7-in-cm"],
    ["/6-feet-11-inches-in-cm", "/6-11-in-cm"],
    ["/4-foot-7-in-cm", "/4-7-in-cm"],
    ["/6-11-feet-in-cm", "/6-11-in-cm"],
    ["/6ft11-in-cm", "/6-11-in-cm"],
    ["/6ft-11in-in-cm", "/6-11-in-cm"],
    ["/6ft11in-in-cm", "/6-11-in-cm"],
    ["/6'11-in-cm", "/6-11-in-cm"],
    ["/6-11-to-cm", "/6-11-in-cm"],
    ["/6-11-en-cm", "/6-11-in-cm"],
    ["/6-11-a-cm", "/6-11-in-cm"],
    ["/5-5-to-cm", "/5-5-in-cm"],
    ["/4-7-en-cm", "/4-7-in-cm"],
    ["/6-11-feet-to-cm", "/6-11-in-cm"],
    ["/6.11-feet-in-cm", "/6-11-in-cm"],
    ["/6.11-feet-to-cm", "/6-11-in-cm"],
    ["/4-foot-7-to-cm", "/4-7-in-cm"],
    ["/4.10-feet-in-cm", "/4-10-in-cm"],
    ["/6-foot-4-to-cm", "/6-4-in-cm"],
    ["/76-2-cm-to-inches", "/76-2-cm-in-inches"],
    ["/76.2-cm-to-inches", "/76-2-cm-in-inches"],
    ["/93-cm-to-inches", "/93-cm-in-inches"],
  ];
  for (const [from, to] of publishedAliasSamples) {
    const hit = firstMatchingPathRedirect(from, combinedRedirects);
    if (!hit || hit.to !== to || hit.status !== 301) {
      fail(`Published alias ${from} must 301 one hop to ${to} before the 404 fallback.`);
    }
  }
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
  if (pathname === "/" && !types.includes("WebSite")) {
    fail("Homepage must include WebSite JSON-LD.");
  }
  for (const schema of schemas) {
    if (Array.isArray(schema?.["@graph"])) {
      for (const node of schema["@graph"]) {
        if (node && typeof node === "object" && Object.hasOwn(node, "@context")) {
          fail(`Nested @context in JSON-LD @graph on ${pathname}.`);
        }
      }
    }
  }
  for (const node of nodes) {
    const nodeTypes = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
    if (nodeTypes.includes("Offer") || node?.offers?.["@type"] === "Offer") {
      fail(`Unexpected Offer JSON-LD on ${pathname}.`);
    }
    if (nodeTypes.includes("Review") || node?.aggregateRating || node?.review) {
      fail(`Do not invent ratings or reviews JSON-LD on ${pathname}.`);
    }
  }
  const faqPageCount = nodes.filter((node) => {
    const type = node?.["@type"];
    return type === "FAQPage" || (Array.isArray(type) && type.includes("FAQPage"));
  }).length;
  if (faqPageCount > 1) fail(`Duplicate FAQPage JSON-LD on ${pathname}.`);

  const isInchOrCmNumeric = (
    /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)
    || /^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)
  );
  const isHeightNumeric = (
    /^\/\d+(?:-\d+)?-in-cm$/.test(pathname)
    || /^\/\d+-feet-in-cm$/.test(pathname)
  ) && !isInchOrCmNumeric;
  const isExactConversion = isInchOrCmNumeric || isHeightNumeric;
  if (isExactConversion) {
    if (!/<div class="answer">[^<]+<\/div>/i.test(visibleHtml)) fail(`Missing static direct answer on ${pathname}.`);
    if (!/<div class="formula">[\s\S]*?<\/div>/i.test(visibleHtml)) fail(`Missing static worked formula on ${pathname}.`);
    if (!/class="related-link-sections"/i.test(visibleHtml)) fail(`Missing related-link sections on exact conversion page ${pathname}.`);
    if (types.includes("FAQPage")) fail(`FAQPage JSON-LD is not allowed on thin numeric template ${pathname}.`);
  }
  if (isInchOrCmNumeric) {
    if (!/id="equivalent-units"/i.test(visibleHtml)) fail(`Missing equivalent-units module on ${pathname}.`);
    if (!/id="nearby-window"/i.test(visibleHtml)) fail(`Missing nearby published window on ${pathname}.`);
    if (!/\d+(?:\.\d+)?\s*mm/i.test(visibleHtml)) fail(`Missing millimeter equivalent on ${pathname}.`);
  }
  if (isHeightNumeric) {
    if (!/<section class="faq">[\s\S]*?<details>/i.test(visibleHtml)) fail(`Missing visible FAQ section on exact conversion page ${pathname}.`);
    const heightMatch = pathname.match(/^\/(\d+)-(\d+)-in-cm$/);
    const feetMatch = pathname.match(/^\/(\d+)-feet-in-cm$/);
    const feet = heightMatch ? Number(heightMatch[1]) : Number(feetMatch[1]);
    const inches = heightMatch ? Number(heightMatch[2]) : 0;
    const cm = Number(((feet * 12 + inches) * 2.54).toFixed(4)).toString();
    const footWord = feet === 1 ? "foot" : "feet";
    const inchWord = inches === 1 ? "inch" : "inches";
    const shortLabel = inches === 0 ? `${feet} feet` : `${feet}'${inches}"`;
    const fullLabel = inches === 0 ? `${feet} ${footWord}` : `${feet} ${footWord} ${inches} ${inchWord}`;
    const expectedTitle = `${shortLabel} in CM: ${cm} cm | Height`;
    const expectedDescription = `${fullLabel} = ${cm} cm. Use the height calculator for feet and inches, total inches, nearby heights, and the exact centimeters.`;
    const expectedH1 = `${shortLabel} in CM: ${cm} cm`;
    const ogTitle = tagAttribute(metaTags.find((tag) => tagAttribute(tag, "property") === "og:title"), "content");
    if (title !== expectedTitle) fail(`Height title must put the exact cm result first on ${pathname}. Expected "${expectedTitle}", got "${title}".`);
    if (description !== expectedDescription) fail(`Height meta must start with feet+inches=cm on ${pathname}. Expected "${expectedDescription}", got "${description}".`);
    if (h1 !== expectedH1) fail(`Height H1 must include the exact cm result on ${pathname}. Expected "${expectedH1}", got "${h1}".`);
    if (ogTitle !== expectedTitle) fail(`Height og:title must match the page title on ${pathname}.`);
    if (!visibleHtml.includes(`${cm} cm`) && !visibleHtml.includes(`${cm} centimeters`)) {
      fail(`Height page ${pathname} is missing the exact ${cm} cm answer.`);
    }
    if (!/height conversion \(feet and inches\)/i.test(visibleHtml)) {
      fail(`Height page ${pathname} must state height (feet and inches) in visible lead text.`);
    }
    if (!visibleHtml.includes(`The height ${fullLabel} (feet and inches)`)) {
      fail(`Height page ${pathname} lead must call ${fullLabel} a height in feet and inches.`);
    }
  }
  if (pathname === "/24-inches-in-cm") {
    const answer = decodeEntities(visibleHtml.match(/<div class="answer">([^<]+)<\/div>/i)?.[1]?.trim());
    const formula = decodeEntities(visibleHtml.match(/<div class="formula">([^<]+)<\/div>/i)?.[1]?.trim());
    if (title !== "24 Inches in CM: 60.96 cm | Inch Converter") fail("24-inch title contract changed.");
    if (description !== "24 inches equals exactly 60.96 centimeters. See the inch-to-cm formula, millimeter value, nearby conversions, and size context.") fail("24-inch description contract changed.");
    if (h1 !== "24 Inches in CM") fail("24-inch H1 contract changed.");
    if (answer !== "24 inches is exactly 60.96 centimeters.") fail("24-inch direct-answer contract changed.");
    if (formula !== "24 × 2.54 = 60.96 cm") fail("24-inch formula contract changed.");
    if (webPage?.name !== "24 Inches in CM: 60.96 cm") fail("24-inch JSON-LD name contract changed.");
  }

  const heightSpotChecks = {
    "/6-11-in-cm": { cm: "210.82", full: "6 feet 11 inches" },
    "/4-7-in-cm": { cm: "139.7", full: "4 feet 7 inches" },
    "/5-5-in-cm": { cm: "165.1", full: "5 feet 5 inches" },
  };
  const cmSpotChecks = {
    "/76-2-cm-in-inches": { inches: "30" },
    "/50-8-cm-in-inches": { inches: "20" },
    "/93-cm-in-inches": { inches: "36.6142" },
    "/36-cm-in-inches": { inches: "14.1732" },
  };
  if (pathname in heightSpotChecks) {
    const expected = heightSpotChecks[pathname];
    if (!title.includes(`${expected.cm} cm`)) fail(`${pathname} title must include exact ${expected.cm} cm.`);
    if (!description.includes(`${expected.full} = ${expected.cm} cm`)) {
      fail(`${pathname} meta must include ${expected.full} = ${expected.cm} cm.`);
    }
  }
  if (pathname in cmSpotChecks) {
    const expected = cmSpotChecks[pathname];
    if (!title.includes(`${expected.inches} in`)) {
      fail(`${pathname} title must include the exact ${expected.inches} in result.`);
    }
    if (!h1.includes(`${expected.inches} in`)) {
      fail(`${pathname} H1 must include the exact ${expected.inches} in result.`);
    }
  }

  for (const match of visibleHtml.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = decodeEntities(match[1]);
    if (!href.startsWith("/")) continue;
    internalLinks += 1;
    if (/\brel="/i.test(match[0]) && /\bnofollow\b/i.test(tagAttribute(match[0], "rel"))) {
      fail(`Internal nofollow link on ${pathname}: ${href}`);
    }
    if (href.includes("?")) fail(`Internal query URL on ${pathname}: ${href}`);
    const target = normalizePath(href.split(/[?#]/, 1)[0]);
    if (!sitemapPathSet.has(target) && !["/sitemap.xml", "/robots.txt"].includes(target)) {
      fail(`Internal link target is not an indexable registered route on ${pathname}: ${href}`);
      continue;
    }
    if (target !== pathname) inboundLinks.get(target)?.add(pathname);
  }
}

const siteMapHtml = read(htmlFileForPath("/site-map"));
const siteMapHrefs = new Set([...siteMapHtml.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => {
  const href = decodeEntities(match[1]);
  if (!href.startsWith("/")) return "";
  return normalizePath(href.split(/[?#]/, 1)[0]);
}).filter(Boolean));
const missingFromSiteMap = sitemapPaths.filter((pathname) => pathname !== "/site-map" && !siteMapHrefs.has(pathname));
if (missingFromSiteMap.length) {
  fail(`HTML site-map is missing ${missingFromSiteMap.length} sitemap URLs, including ${missingFromSiteMap.slice(0, 20).join(", ")}`);
}

function uniqueInternalHrefs(pathname) {
  const html = read(htmlFileForPath(pathname));
  return new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => {
    const href = decodeEntities(match[1]);
    if (!href.startsWith("/")) return "";
    return normalizePath(href.split(/[?#]/, 1)[0]);
  }).filter(Boolean));
}

const inchesHubHrefs = uniqueInternalHrefs("/inches-to-cm");
const cmHubHrefs = uniqueInternalHrefs("/cm-to-inches");
if (inchesHubHrefs.size < 20) fail(`/inches-to-cm should expose grouped entry links, found ${inchesHubHrefs.size} unique internal hrefs.`);
if (cmHubHrefs.size < 20) fail(`/cm-to-inches should expose grouped entry links, found ${cmHubHrefs.size} unique internal hrefs.`);
if (inchesHubHrefs.size > 120) fail(`/inches-to-cm should stay curated, not dump the sitemap (${inchesHubHrefs.size} unique internal hrefs).`);
if (cmHubHrefs.size > 120) fail(`/cm-to-inches should stay curated, not dump the sitemap (${cmHubHrefs.size} unique internal hrefs).`);
if (![...inchesHubHrefs].some((href) => /-(?:inch|inches)-in-cm$/.test(href))) fail("/inches-to-cm is missing numeric inch children.");
if (![...inchesHubHrefs].some((href) => /^\/\d+-\d+-in-cm$/.test(href))) fail("/inches-to-cm is missing height entry links.");
if (![...cmHubHrefs].some((href) => /-cm-in-inches$/.test(href))) fail("/cm-to-inches is missing numeric cm children.");

const sampleInchHtml = read(htmlFileForPath("/2-inches-in-cm"));
if (!sampleInchHtml.includes('href="/inches-to-cm"') || !sampleInchHtml.includes('href="/inch-to-cm-chart"')) {
  fail("/2-inches-in-cm must link the parent hub and inch chart in initial HTML.");
}
const fiveInchHtml = read(htmlFileForPath("/5-inches-in-cm"));
const tenInchHtml = read(htmlFileForPath("/10-inches-in-cm"));
const fiveVisible = fiveInchHtml.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
const tenVisible = tenInchHtml.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!/<div class="answer">5 inches is exactly 12.7 centimeters\.<\/div>/.test(fiveVisible)) {
  fail("/5-inches-in-cm must keep the exact 12.7 cm answer in initial HTML.");
}
if (!/<div class="answer">10 inches is exactly 25.4 centimeters\.<\/div>/.test(tenVisible)) {
  fail("/10-inches-in-cm must keep the exact 25.4 cm answer in initial HTML.");
}
if (!/id="equivalent-units"/.test(fiveVisible) || !/id="nearby-window"/.test(fiveVisible)) {
  fail("/5-inches-in-cm must include equivalent-units and nearby published window modules.");
}
if (/id="screen-entry"/.test(fiveVisible) || /id="height-entry"/.test(fiveVisible)) {
  fail("/5-inches-in-cm must not show screen or height modules.");
}
const twentyFourVisible = read(htmlFileForPath("/24-inches-in-cm")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!/id="screen-entry"/.test(twentyFourVisible)) fail("/24-inches-in-cm must include a screen diagonal module.");
if (!/2 ft 0 in/.test(twentyFourVisible)) fail("/24-inches-in-cm must include the 2 ft equivalent.");
if (/id="height-entry"/.test(twentyFourVisible)) fail("/24-inches-in-cm must not treat 24 inches as a height page.");
const fractionCmPages = [
  ["/fraction-1-8-inch-to-cm", "1/8", "0.3175"],
  ["/fraction-1-4-inch-to-cm", "1/4", "0.635"],
  ["/fraction-3-8-inch-to-cm", "3/8", "0.9525"],
  ["/fraction-1-2-inch-to-cm", "1/2", "1.27"],
  ["/fraction-5-8-inch-to-cm", "5/8", "1.5875"],
  ["/fraction-3-4-inch-to-cm", "3/4", "1.905"],
  ["/fraction-7-8-inch-to-cm", "7/8", "2.2225"],
];
const fractionHubHrefs = uniqueInternalHrefs("/fraction-converters");
const fractionChartHrefs = uniqueInternalHrefs("/fraction-inch-to-cm-chart");
const inchesHubWithFractions = uniqueInternalHrefs("/inches-to-cm");
for (const [pathname, fraction, cm] of fractionCmPages) {
  const html = read(htmlFileForPath(pathname));
  const visible = html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
  const title = decodeEntities(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim());
  const h1 = decodeEntities(visible.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim());
  const answer = decodeEntities(visible.match(/<div class="answer">([^<]+)<\/div>/i)?.[1]?.trim());
  const types = collectJsonLd(html, pathname).flatMap(schemaTypes);
  if (title !== `${fraction} Inch in CM: ${cm} cm | Fraction Converter`) fail(`${pathname} title contract changed: ${title}`);
  if (h1 !== `${fraction} Inch in CM`) fail(`${pathname} H1 contract changed: ${h1}`);
  if (answer !== `${fraction} inch is exactly ${cm} centimeters.`) fail(`${pathname} must keep the exact ${cm} cm answer in initial HTML.`);
  if (!/id="equivalent-units"/.test(visible) || !/id="nearby-window"/.test(visible)) {
    fail(`${pathname} must include equivalent-units and nearby published fraction modules.`);
  }
  if (!visible.includes('href="/fraction-inch-to-cm-chart"') || !visible.includes('href="/inches-to-cm"')) {
    fail(`${pathname} must link the fraction chart and inches-to-cm hub.`);
  }
  if (types.includes("FAQPage")) fail(`FAQPage JSON-LD is not allowed on fraction cm landing ${pathname}.`);
  if (!fractionHubHrefs.has(pathname)) fail(`/fraction-converters must link ${pathname}.`);
  if (!fractionChartHrefs.has(pathname)) fail(`/fraction-inch-to-cm-chart must link ${pathname}.`);
  if (!inchesHubWithFractions.has(pathname)) fail(`/inches-to-cm must link ${pathname}.`);
}
const quarterVisible = read(htmlFileForPath("/0-25-inch-in-cm")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!quarterVisible.includes('href="/fraction-1-4-inch-to-cm"')) fail("/0-25-inch-in-cm must link the 1/4 inch cm landing.");
const halfLandingVisible = read(htmlFileForPath("/0-5-inch-in-cm")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!halfLandingVisible.includes('href="/fraction-1-2-inch-to-cm"')) fail("/0-5-inch-in-cm must link the 1/2 inch cm landing.");
const threeQuarterVisible = read(htmlFileForPath("/0-75-inch-in-cm")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!threeQuarterVisible.includes('href="/fraction-3-4-inch-to-cm"')) fail("/0-75-inch-in-cm must link the 3/4 inch cm landing.");
const sixtyFiveVisible = read(htmlFileForPath("/65-inches-in-cm")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!/id="screen-entry"/.test(sixtyFiveVisible) || !/id="height-entry"/.test(sixtyFiveVisible)) {
  fail("/65-inches-in-cm must include both screen and height modules.");
}
const halfInchVisible = read(htmlFileForPath("/0-5-inch-in-cm")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!/1\/2(?:"|&quot;)/.test(halfInchVisible)) fail("/0-5-inch-in-cm must show the exact 1/2 inch fraction.");
const fiveCmVisible = read(htmlFileForPath("/5-cm-in-inches")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
const tenCmVisible = read(htmlFileForPath("/10-cm-in-inches")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (/How do you convert 5 cm to inches\?/.test(fiveCmVisible) || /Why is the inch result rounded\?/.test(tenCmVisible)) {
  fail("Numeric cm pages must not reuse number-swapped conversion FAQ blobs.");
}
if (/id="height-entry"/.test(fiveCmVisible)) fail("/5-cm-in-inches must not show a height module.");
const heightCmVisible = read(htmlFileForPath("/180-cm-in-inches")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!/id="height-entry"/.test(heightCmVisible)) fail("/180-cm-in-inches must include a height entry module.");
const screenCmVisible = read(htmlFileForPath("/68-58-cm-in-inches")).replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
if (!/id="screen-entry"/.test(screenCmVisible)) fail("/68-58-cm-in-inches must include a screen diagonal module.");
if (/How do you convert 5 inches to cm\?/.test(fiveVisible) || /How do you convert 10 inches to cm\?/.test(tenVisible)) {
  fail("Numeric inch pages must not reuse number-swapped conversion FAQ blobs.");
}
if (/For everyday use you can round/.test(fiveVisible) || /For everyday use you can round/.test(tenVisible)) {
  fail("Numeric inch pages must not reuse generic rounding FAQ blobs.");
}
function faqBlob(html) {
  const section = html.match(/<section class="faq">[\s\S]*?<\/section>/i)?.[0] ?? "";
  return decodeEntities(section.replace(/<[^>]+>/g, " ").replace(/\d+(?:\.\d+)?/g, "#").replace(/\s+/g, " ").trim());
}
const fiveFaq = faqBlob(fiveVisible);
const tenFaq = faqBlob(tenVisible);
if (fiveFaq && tenFaq && fiveFaq === tenFaq) {
  fail("/5-inches-in-cm and /10-inches-in-cm share an identical FAQ blob after number normalization.");
}
const sampleHeightHtml = read(htmlFileForPath("/5-7-in-cm"));
if (!sampleHeightHtml.includes('href="/height-converter"') || !sampleHeightHtml.includes('href="/height-chart"')) {
  fail("/5-7-in-cm must link height hubs/charts in initial HTML.");
}
if (!/5(?:'|&#x27;|&apos;)7/.test(sampleHeightHtml)) {
  fail("/5-7-in-cm must keep feet-and-inches height labels in HTML.");
}
const heightHubHrefs = uniqueInternalHrefs("/height-converter");
const heightChartHrefs = uniqueInternalHrefs("/height-chart");
const homeHrefs = uniqueInternalHrefs("/");
const gscPriorityHeightHrefs = [
  "/6-11-in-cm",
  "/4-7-in-cm",
  "/5-5-in-cm",
  "/6-8-in-cm",
  "/6-1-in-cm",
  "/6-5-in-cm",
  "/4-10-in-cm",
  "/6-3-in-cm",
  "/6-6-in-cm",
  "/6-4-in-cm",
  "/6-10-in-cm",
  "/6-7-in-cm",
  "/4-8-in-cm",
  "/4-11-in-cm",
  "/4-5-in-cm",
  "/5-3-in-cm",
  "/4-2-in-cm",
  "/5-4-in-cm",
  "/4-9-in-cm",
  "/5-7-in-cm",
];
for (const href of gscPriorityHeightHrefs) {
  if (!heightHubHrefs.has(href)) fail(`/height-converter must link GSC-priority height ${href}.`);
  if (!heightChartHrefs.has(href)) fail(`/height-chart must link GSC-priority height ${href}.`);
  if (!homeHrefs.has(href)) fail(`homepage must link GSC-priority height ${href}.`);
}
const heightHubHtml = read(htmlFileForPath("/height-converter"));
const heightChartHtml = read(htmlFileForPath("/height-chart"));
const homeHtml = read(htmlFileForPath("/"));
if (!/6(?:'|&#x27;|&apos;)11/.test(heightHubHtml) || !/6(?:'|&#x27;|&apos;)5/.test(heightHubHtml)) {
  fail("/height-converter must use readable feet/inches height labels such as 6'11\" and 6'5\".");
}
if (!/6(?:'|&#x27;|&apos;)11/.test(homeHtml) || !/4(?:'|&#x27;|&apos;)5/.test(homeHtml)) {
  fail("homepage must use readable feet/inches height labels such as 6'11\" and 4'5\".");
}
if (!/5 feet 7 inches in cm/.test(heightChartHtml)) {
  fail("/height-chart must use spelled 5 feet 7 inches wording toward the canonical height page.");
}
if (!heightHubHtml.includes("Popular heights")) {
  fail("/height-converter must keep popular height links out of the calculator and in a Popular heights section.");
}

for (const sample of ["/inch-to-yard", "/fraction-1-2-inch-to-mm"]) {
  const sampleHtml = read(htmlFileForPath(sample));
  const sampleTypes = collectJsonLd(sampleHtml, sample).flatMap(schemaTypes);
  if (sampleTypes.includes("FAQPage")) {
    fail(`FAQPage JSON-LD is not allowed on templated generated page ${sample}.`);
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
console.log(`PASS: HTML site-map links ${siteMapHrefs.size} registered paths (${missingFromSiteMap.length} missing).`);
console.log(`PASS: ${titles.size} unique titles and ${descriptions.size} unique descriptions.`);
console.log(`PASS: every route has one self-canonical, one H1, and matching WebPage/Breadcrumb JSON-LD.`);
console.log(`PASS: tool routes include WebApplication JSON-LD without Offer; ${jsonLdBlocks} JSON-LD blocks parsed.`);
console.log(`PASS: JSON-LD graphs have a single @context; thin numeric templates omit FAQPage schema.`);
console.log(`PASS: netlify.toml canonicalizes www/http to https://inchiscm.com in one hop.`);
console.log(`PASS: ${synonymPairs.length} formula-grid synonym aliases 301 to dedicated canonicals in out/_redirects and are absent from the sitemap.`);
console.log(`PASS: ${expectedInchAliasRedirects.length} published-inch, ${expectedHeightAliasRedirects.length} published-height, and ${expectedCmAliasRedirects.length} published-cm 404 aliases plus hub/synonym/fraction 301s win before /* /404.html 404; unknown paths hard-404.`);
console.log(`PASS: ${internalLinks} crawlable internal links target registered routes.`);
console.log(`PASS: source and exported HTML contain no forbidden Unicode mojibake.`);
