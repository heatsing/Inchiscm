import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const siteOrigin = "https://inchiscm.com";
const exportedUtilityFiles = new Set(["/sitemap.xml", "/robots.txt", "/icon.svg"]);
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function htmlFileForPath(pathname) {
  const cleanPath = pathname === "/" ? "index" : pathname.replace(/^\//, "").replace(/\/$/, "");
  return path.join(outDir, `${cleanPath}.html`);
}

if (!fs.existsSync(outDir)) {
  console.error("Build output is missing. Run npm run build before npm run site:check.");
  process.exit(1);
}

const sitemapFile = path.join(outDir, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) {
  console.error("out/sitemap.xml is missing.");
  process.exit(1);
}

const sitemapXml = read(sitemapFile);
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapPaths = new Set(sitemapUrls.map((url) => new URL(url).pathname.replace(/\/$/, "") || "/"));
const titles = new Map();
const descriptions = new Map();
let internalLinkCount = 0;

for (const url of sitemapUrls) {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname.replace(/\/$/, "") || "/";
  if (parsedUrl.search) fail(`Query parameter URL appears in sitemap: ${url}`);

  const htmlFile = htmlFileForPath(pathname);
  if (!fs.existsSync(htmlFile)) {
    fail(`Sitemap URL has no exported HTML file: ${pathname}`);
    continue;
  }

  const html = read(htmlFile);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.trim();
  const expectedCanonical = `${siteOrigin}${pathname === "/" ? "" : pathname}`;
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;

  if (!title) fail(`Missing title: ${pathname}`);
  if (!description) fail(`Missing meta description: ${pathname}`);
  if (title && title.length > 60) fail(`Title exceeds 60 characters on ${pathname}: ${title.length}`);
  if (description && description.length > 160) fail(`Meta description exceeds 160 characters on ${pathname}: ${description.length}`);
  if (canonical !== expectedCanonical) fail(`Canonical mismatch on ${pathname}: ${canonical ?? "missing"}`);
  if (h1Count !== 1) fail(`Expected one H1 on ${pathname}, found ${h1Count}`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) fail(`Sitemap page is noindex: ${pathname}`);

  if (title) {
    const existing = titles.get(title) ?? [];
    existing.push(pathname);
    titles.set(title, existing);
  }
  if (description) {
    const existing = descriptions.get(description) ?? [];
    existing.push(pathname);
    descriptions.set(description, existing);
  }

  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/")) continue;
    internalLinkCount += 1;
    if (href.includes("?")) fail(`Internal query parameter link on ${pathname}: ${href}`);
    const target = href.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
    if (!sitemapPaths.has(target) && !exportedUtilityFiles.has(target)) {
      fail(`Broken or non-sitemap internal link on ${pathname}: ${href}`);
    }
  }
}

for (const [title, paths] of titles) {
  if (paths.length > 1) fail(`Duplicate title "${title}" on ${paths.join(", ")}`);
}
for (const [description, paths] of descriptions) {
  if (paths.length > 1) fail(`Duplicate description "${description}" on ${paths.join(", ")}`);
}

const policy = JSON.parse(read(path.join(root, "seo-page-policy.json")));
const programmaticCount = [...sitemapPaths].filter((pathname) => (
  /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/.test(pathname)
  || /^\/\d+(?:-\d+)?-cm-in-inches$/.test(pathname)
  || /^\/\d+(?:-\d+)?-in-cm$/.test(pathname)
  || /^\/\d+-feet-in-cm$/.test(pathname)
  || policy.guidePages.some((slug) => pathname === `/${slug}`)
)).length;

if (programmaticCount > policy.maxProgrammaticPages) {
  fail(`Programmatic page count ${programmaticCount} exceeds ${policy.maxProgrammaticPages}`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exit(1);
}

console.log(`✓ ${sitemapUrls.length} sitemap URLs map to valid exported HTML pages`);
console.log(`✓ ${programmaticCount} programmatic pages stay within the approved limit`);
console.log(`✓ ${titles.size} sitemap pages have concise unique titles and descriptions, self-canonicals, and one H1`);
console.log(`✓ ${internalLinkCount} internal links resolve without query parameters`);
