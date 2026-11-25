import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { parseNetlifyRedirectsFile } from "../src/data/page-registry/inch-alias-redirects.mjs";

const root = process.cwd();
const outDir = path.join(root, "out");
const reportsDir = path.join(root, "reports");
const mode = process.argv[2] === "post" ? "post-expansion" : "pre-expansion";
const pagesOnly = process.argv[2] === "pages";
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
  const match = tag?.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return decodeEntities((match?.[1] ?? match?.[2] ?? "").trim());
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
  if (pathname === "/game") return "quiz";
  if (pathname.startsWith("/dimensions/")) return pathname.split("/").at(-1).split("-")[0].split("x").length === 3 ? "3d-dimension" : "2d-dimension";
  if (["/inches-to-cm-dimensions", "/cm-to-inches-dimensions"].includes(pathname)) return "dimension-hub";
  if (/^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)) return "inch-value";
  if (/^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)) return "cm-value";
  if (/^\/\d+(?:-\d+)?-in-cm$/.test(pathname) || /^\/\d+-feet-in-cm$/.test(pathname)) return "height-value";
  if (/^\/\d+(?:-\d+)?-/.test(pathname) && /(?:-in-mm|-mm-in-inches|-to-cm|-in-feet)$/.test(pathname)) return "unit-value";
  if (/^\/fraction-\d+-\d+-inch-to-(?:cm|mm)$/.test(pathname)) return "fraction-value";
  if (pathname.includes("chart")) return "chart";
  if (pathname.includes("calculator") || pathname.includes("converter") || pathname.includes("-to-")) return "tool";
  if (pathname.includes("policy") || pathname.includes("terms") || pathname.includes("site-map")) return "policy";
  return "guide";
}

function exportedPageFiles() {
  const knownErrorFiles = new Set(["404.html", "404/index.html", "_not-found.html", "_not-found/index.html"]);
  const files = new Map();
  for (const entry of fs.readdirSync(outDir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const file = path.join(entry.parentPath, entry.name);
    const relative = path.relative(outDir, file).replaceAll(path.sep, "/");
    if (knownErrorFiles.has(relative) || relative.startsWith("_next/")) continue;
    const pathname = normalizePath(`/${relative.replace(/(?:^|\/)index\.html$|\.html$/g, "")}`);
    files.set(pathname, [...(files.get(pathname) ?? []), file]);
  }
  return files;
}

function pageTextSignatures(mainHtml) {
  const coreHtml = mainHtml.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "");
  const prose = [...coreHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(([, paragraph]) => textFromHtml(paragraph))
    .filter((paragraph) => wordCount(paragraph) >= 10)
    .join(" ");
  return { coreHtml, prose: wordCount(prose) >= 30 ? prose.toLowerCase() : "" };
}

function emptySections(mainHtml) {
  const empty = new Set();
  const headingTags = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const hasContent = (markup) => (
    Boolean(textFromHtml(markup.replace(headingTags, "")))
    || /<(?:img|svg|video|canvas|input|select|textarea|button)\b/i.test(markup)
  );
  const headings = [...mainHtml.matchAll(headingTags)];
  for (const [index, heading] of headings.entries()) {
    const label = textFromHtml(heading[2]);
    if (!/^(?:related\b|nearby\b)/i.test(label)) continue;
    const nextHeading = headings.slice(index + 1).find((candidate) => Number(candidate[1]) <= Number(heading[1]));
    const end = nextHeading?.index ?? mainHtml.length;
    if (!hasContent(mainHtml.slice(heading.index + heading[0].length, end))) empty.add(label);
  }
  const openings = [];
  for (const tag of mainHtml.matchAll(/<\/?section\b[^>]*>/gi)) {
    if (tag[0][1] !== "/") {
      openings.push(tag);
    } else if (openings.length) {
      const opening = openings.pop();
      const body = mainHtml.slice(opening.index + opening[0].length, tag.index);
      if (!hasContent(body)) {
        empty.add(textFromHtml([...body.matchAll(headingTags)][0]?.[2] ?? "") || tagAttribute(opening[0], "id") || "Unlabeled section");
      }
    }
  }
  return [...empty];
}

function h1MatchesIntent(pathname, h1) {
  const normalize = (text) => text.toLowerCase().replace(/\bcentimeters?\b/g, "cm").replace(/\bmillimeters?\b/g, "mm").replace(/\binches\b/g, "inch").replace(/\b(?:feet|foot)\b/g, "ft");
  if (pathname === "/") return /\binch\b.*\bcm\b/.test(normalize(h1));
  if (pathname === "/game") return /\binch\b.*\bcm\b.*\bchallenge\b/.test(normalize(h1));
  const tokens = (text) => normalize(text).match(/[a-z]+|\d+/g) ?? [];
  const h1Tokens = new Set(tokens(h1));
  const genericWords = new Set(["dimensions", "in", "to", "the", "a", "and", "of", "for"]);
  const essential = tokens(pathname).filter((part) => !genericWords.has(part));
  if (essential.some((part) => /^\d/.test(part))) {
    const measurementTokens = new Set(["cm", "mm", "inch", "ft"]);
    return essential.filter((part) => /^\d/.test(part) || measurementTokens.has(part)).every((part) => h1Tokens.has(part));
  }
  return essential.length === 0 || essential.some((part) => h1Tokens.has(part));
}

function robotsRules(source) {
  const rules = [];
  let agents = [];
  let hasDirectives = false;
  for (const line of source.split(/\r?\n/)) {
    const match = /^\s*(user-agent|allow|disallow)\s*:\s*([^#]+?)\s*(?:#.*)?$/i.exec(line);
    if (!match) continue;
    const [, rawDirective, value] = match;
    const directive = rawDirective.toLowerCase();
    if (directive === "user-agent") {
      if (hasDirectives) agents = [];
      agents.push(value.toLowerCase());
      hasDirectives = false;
    } else {
      rules.push({ agents: [...agents], allow: directive === "allow", value });
      hasDirectives = true;
    }
  }
  const agent = rules.some((rule) => rule.agents.includes("googlebot")) ? "googlebot" : "*";
  return rules.filter((rule) => rule.agents.includes(agent)).map((rule) => ({
    ...rule,
    pattern: new RegExp(`^${rule.value.split("*").map((part) => part.replace(/[.+?^{}()|[\]\\]/g, "\\$&")).join(".*")}`),
  })).sort((first, second) => second.value.length - first.value.length || Number(second.allow) - Number(first.allow));
}

async function localHttpStatuses(paths, filesByPath) {
  const redirectsPath = path.join(outDir, "_redirects");
  const redirects = new Map(fs.existsSync(redirectsPath) ? parseNetlifyRedirectsFile(read(redirectsPath)).map((rule) => [rule.from, rule]) : []);
  const statuses = new Map();
  const server = createServer((request, response) => {
    const pathname = normalizePath(new URL(request.url, siteOrigin).pathname);
    const rule = redirects.get(pathname);
    const fileExists = filesByPath.has(pathname);
    if (rule && !fileExists) response.writeHead(rule.status, { location: rule.to });
    else response.writeHead(fileExists ? 200 : 404);
    response.end();
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (let index = 0; index < paths.length; index += 32) {
      await Promise.all(paths.slice(index, index + 32).map(async (pathname) => {
        const response = await fetch(`${origin}${pathname}`, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(10000) });
        statuses.set(pathname, response.status);
      }));
    }
    return statuses;
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

const pageAuditFields = [
  ["URL", "url"], ["Page Type", "pageArchetype"], ["H1", "h1"], ["Meta Title", "title"],
  ["Meta Description", "description"], ["Canonical", "canonical"], ["Robots", "robots"],
  ["HTTP Status", "httpStatus"], ["HTTP Status Source", "httpStatusSource"],
  ["Sitemap Inclusion", "sitemapInclusion"], ["Internal Inbound Links", "internalLinksIn"], ["Broken Internal Links", "brokenInternalLinks"],
  ["Empty Sections", "emptySections"], ["Duplicate URL", "duplicateUrl"], ["Missing Metadata", "missingMetadata"],
  ["Duplicate Title", "duplicateTitle"], ["Duplicate Description", "duplicateDescription"],
  ["H1 Intent", "h1Intent"], ["Self-Referencing Canonical", "canonicalMatchesSitemap"],
  ["Server-Rendered Core Content", "serverRenderedCore"], ["Eligible for Indexing (Local)", "eligibleForIndexing"],
  ["Google Index Status", "gscIndexStatus"], ["Assessment", "assessment"], ["Review Reasons", "reviewReasons"],
];

function csvField(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function writePageAudit(rows, filesByPath, sitemapUrlsByPath) {
  const statuses = await localHttpStatuses(rows.map((row) => row.url), filesByPath);
  const robotsPath = path.join(outDir, "robots.txt");
  const rules = robotsRules(fs.existsSync(robotsPath) ? read(robotsPath) : "");
  const reviewCounts = new Map();
  const seenProse = new Map();
  for (const row of rows) {
    if (row.prose) seenProse.set(row.prose, (seenProse.get(row.prose) ?? 0) + 1);
  }
  const pageRows = rows.map((row) => {
    const review = [];
    const sitemapUrls = sitemapUrlsByPath.get(row.url) ?? [];
    const httpStatus = statuses.get(row.url);
    const sitemapInclusion = sitemapUrls.length > 0;
    const robotsBlocked = rules.find((rule) => rule.pattern.test(row.url))?.allow === false;
    const eligibleForIndexing = httpStatus === 200 && row.canonicalMatchesSitemap && !robotsBlocked && !row.metaNoindex;
    const duplicateUrl = sitemapUrls.length > 1 || (filesByPath.get(row.url)?.length ?? 0) > 1;
    const duplicateTitle = Boolean(row.title && duplicateTitles.get(row.title).length > 1);
    const duplicateDescription = Boolean(row.description && duplicateDescriptions.get(row.description).length > 1);
    if (httpStatus !== 200) review.push("HTTP status is not 200");
    if (!sitemapInclusion) review.push("Exported page missing from sitemap");
    if (sitemapUrls.some((url) => url !== `${siteOrigin}${row.url}`)) review.push("Noncanonical URL in sitemap");
    if (sitemapInclusion && !eligibleForIndexing) review.push("Sitemap URL ineligible for indexing");
    if (duplicateUrl) review.push("Duplicate URL");
    if (row.missingMetadata.length) review.push("Missing metadata");
    if (row.duplicateMetadataTags) review.push("Repeated metadata tags");
    if (!row.canonicalMatchesSitemap) review.push("Canonical mismatch");
    if (duplicateTitle) review.push("Duplicate title");
    if (duplicateDescription) review.push("Duplicate description");
    if (row.h1Count !== 1 || !row.h1) review.push("Missing or repeated H1");
    else if (!row.h1Intent) review.push("H1 intent needs review");
    if (!row.internalLinksIn) review.push("No internal inbound links");
    if (row.brokenInternalLinks) review.push("Broken internal links");
    if (row.emptySections.length) review.push("Empty section(s)");
    if (!row.serverRenderedCore) review.push("Core content absent in static HTML");
    if ((seenProse.get(row.prose) ?? 0) > 1) review.push("Potential duplicate prose");
    if (row.jsonLdErrors.length) review.push("Invalid JSON-LD");
    for (const issue of review) reviewCounts.set(issue, (reviewCounts.get(issue) ?? 0) + 1);
    return {
      ...row,
      url: `${siteOrigin}${row.url}`,
      robots: [row.robots || "Implicit index and follow", robotsBlocked ? "robots.txt disallows crawling" : ""].filter(Boolean).join(" | "),
      httpStatus,
      httpStatusSource: "Local static export (loopback HEAD)",
      sitemapInclusion,
      duplicateUrl,
      duplicateTitle,
      duplicateDescription,
      eligibleForIndexing,
      gscIndexStatus: "Unknown (no URL-level GSC export)",
      emptySections: row.emptySections.join(" | "),
      missingMetadata: row.missingMetadata.join(" | "),
      assessment: review.length ? "Review" : "Pass",
      reviewReasons: review.join(" | "),
    };
  });
  if (!process.argv.includes("--dry-run")) {
    const output = path.join(reportsDir, "seo-page-audit.csv");
    const csv = [
      pageAuditFields.map(([name]) => name).join(","),
      ...pageRows.map((row) => pageAuditFields.map(([, key]) => csvField(row[key])).join(",")),
    ].join("\n");
    fs.writeFileSync(output, `${csv}\n`);
    console.log(`Wrote ${path.relative(root, output)}.`);
  }
  const passCount = pageRows.filter((row) => row.assessment === "Pass").length;
  console.log(`Inspected ${pageRows.length} static URLs: ${passCount} pass, ${pageRows.length - passCount} review.`);
  console.log(JSON.stringify(Object.fromEntries(reviewCounts), null, 2));
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
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeEntities(match[1]));
const sitemapUrlsByPath = new Map();
for (const url of sitemapUrls) {
  const pathname = normalizePath(new URL(url, siteOrigin).pathname);
  sitemapUrlsByPath.set(pathname, [...(sitemapUrlsByPath.get(pathname) ?? []), url]);
}
const sitemapPaths = [...sitemapUrlsByPath.keys()];
const filesByPath = pagesOnly ? exportedPageFiles() : new Map();
const paths = pagesOnly ? [...new Set([...sitemapPaths, ...filesByPath.keys()])].sort() : sitemapPaths;
const inbound = new Map(paths.map((pathname) => [pathname, new Set()]));
const rows = [];
const paragraphMap = new Map();
const brokenLinks = [];
const duplicateTitles = new Map();
const duplicateDescriptions = new Map();

for (const pathname of paths) {
  const file = filesByPath.get(pathname)?.[0] ?? htmlFileForPath(pathname);
  const exists = fs.existsSync(file);
  const html = exists ? read(file) : "";
  const visibleHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
  const visibleText = textFromHtml(html);
  const titleTags = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  const title = decodeEntities(titleTags[0]?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "");
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const descriptionTags = metaTags.filter((tag) => tagAttribute(tag, "name") === "description");
  const canonicalTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]).filter((tag) => tagAttribute(tag, "rel") === "canonical");
  const description = tagAttribute(descriptionTags[0], "content");
  const canonical = tagAttribute(canonicalTags[0], "href");
  const h1s = [...visibleHtml.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)].map((match) => textFromHtml(match[1]));
  const jsonLd = jsonLdTypes(html);
  const outLinks = [];
  const brokenForPage = new Set();
  const expectedCanonical = pathname === "/" ? `${siteOrigin}/` : `${siteOrigin}${pathname}`;
  const type = archetype(pathname);
  const primaryContentRequiresJs = type !== "policy" && (!/<h1/i.test(visibleHtml) || !/(answer|formula|converter-card|data-table-wrap|tool-seo-content)/i.test(visibleHtml));
  const calculatorAvailability = /(converter-card|length-converter|screen-calculator|data-table-wrap)/i.test(visibleHtml);
  const serverRenderedAnswer = /class="answer"|answer-box|direct-answer/i.test(visibleHtml);
  const adPlaceholder = /Advertisement|ad-slot-reserved|googlesyndication|adsbygoogle/i.test(visibleHtml);

  for (const [tag] of visibleHtml.matchAll(/<a\b[^>]*>/gi)) {
    const href = tagAttribute(tag, "href");
    if (!href || href.startsWith("#")) continue;
    if (!pagesOnly && (!href.startsWith("/") || href.startsWith("//"))) continue;
    const url = URL.parse(href, expectedCanonical);
    if (url?.origin !== siteOrigin) continue;
    const target = normalizePath(url.pathname);
    outLinks.push(target);
    if (inbound.has(target)) {
      if (!pagesOnly || target !== pathname) inbound.get(target).add(pathname);
    }
    else if (!["/sitemap.xml", "/robots.txt"].includes(target)) {
      brokenForPage.add(target);
      brokenLinks.push({ from: pathname, href });
    }
  }

  if (title) duplicateTitles.set(title, [...(duplicateTitles.get(title) ?? []), pathname]);
  if (description) duplicateDescriptions.set(description, [...(duplicateDescriptions.get(description) ?? []), pathname]);

  const row = {
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
  };
  if (pagesOnly) {
    const main = visibleHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
    const { coreHtml, prose } = pageTextSignatures(main);
    const robotsTags = metaTags.filter((tag) => ["robots", "googlebot"].includes(tagAttribute(tag, "name").toLowerCase()));
    const robots = robotsTags.map((tag) => `${tagAttribute(tag, "name")}: ${tagAttribute(tag, "content")}`).join(" | ");
    const coreText = textFromHtml(coreHtml).replace(row.h1, "").trim();
    const resultMarkup = [...coreHtml.matchAll(/<(div|p)\b[^>]*class="(?:[^"]* )?(?:answer|height-answer-cm)(?: [^"]*)?"[^>]*>([\s\S]*?)<\/\1>/gi)]
      .some(([, , result]) => Boolean(textFromHtml(result)));
    const requiresResult = /(?:-value|-dimension)$/.test(type);
    Object.assign(row, {
      prose,
      robots,
      brokenInternalLinks: brokenForPage.size,
      metaNoindex: robotsTags.some((tag) => tagAttribute(tag, "content").split(",").some((directive) => /^\s*(?:noindex|none)(?:\s|$)/i.test(directive))),
      serverRenderedCore: Boolean(row.h1 && coreText && (requiresResult ? resultMarkup : wordCount(coreText) >= 10)),
      emptySections: emptySections(main),
      h1Intent: Boolean(row.h1 && h1MatchesIntent(pathname, row.h1)),
      missingMetadata: [[title, "Title"], [description, "Description"], [canonical, "Canonical"]].filter(([value]) => !value).map(([, name]) => name),
      duplicateMetadataTags: titleTags.length > 1 || descriptionTags.length > 1 || canonicalTags.length > 1,
    });
  } else {
    const paragraphs = [...visibleHtml.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
      .map((match) => textFromHtml(match[1]))
      .filter((text) => wordCount(text) >= 10);
    for (const paragraph of paragraphs) {
      const key = paragraphFingerprint(paragraph);
      paragraphMap.set(key, [...(paragraphMap.get(key) ?? []), pathname]);
    }
  }
  rows.push(row);
}

for (const row of rows) {
  row.internalLinksIn = inbound.get(row.url)?.size ?? 0;
}

function writeExpansionAudit() {
  const repeatedParagraphs = [...paragraphMap.entries()]
    .filter(([, pages]) => new Set(pages).size >= 5)
    .map(([paragraph, pages]) => ({ paragraph, pageCount: new Set(pages).size, samplePages: [...new Set(pages)].slice(0, 8) }));

  const duplicateTitleGroups = [...duplicateTitles.entries()].filter(([, pages]) => pages.length > 1);
  const duplicateDescriptionGroups = [...duplicateDescriptions.entries()].filter(([, pages]) => pages.length > 1);

  const summary = {
    mode,
    exportedIndexableHtmlPages: rows.filter((row) => row.exportStatus === "ok").length,
    sitemapUrls: sitemapUrls.length,
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
    process.exitCode = 1;
  }
}

if (pagesOnly) await writePageAudit(rows, filesByPath, sitemapUrlsByPath);
else writeExpansionAudit();
