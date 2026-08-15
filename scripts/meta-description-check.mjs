import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const siteOrigin = "https://inchiscm.com";
const errors = [];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function fail(message) {
  errors.push(message);
}

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

function plainText(value = "") {
  return decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function exactPageExpectedAnswer(pathname) {
  const inch = pathname.match(/^\/(\d+(?:-\d+)?)-(inch|inches)-in-cm$/);
  if (inch) {
    const inches = Number(inch[1].replace("-", "."));
    const cm = Number((inches * 2.54).toFixed(4)).toString();
    const unit = inches === 1 ? "inch" : "inches";
    return `${inches} ${unit} equals exactly ${cm} centimeters`;
  }

  const cm = pathname.match(/^\/(\d+(?:-\d+)?)-cm-in-inches$/);
  if (cm) {
    const centimeters = Number(cm[1].replace("-", "."));
    const inches = Number((centimeters / 2.54).toFixed(4)).toString();
    return `${centimeters} cm equals ${inches} inches`;
  }

  const height = pathname.match(/^\/(\d+)-(\d+)-in-cm$/);
  if (height) {
    const feet = Number(height[1]);
    const inches = Number(height[2]);
    const totalInches = feet * 12 + inches;
    const centimeters = Number((totalInches * 2.54).toFixed(2)).toString();
    return `${feet}'${inches}" equals ${centimeters} centimeters`;
  }

  const feetOnly = pathname.match(/^\/(\d+)-feet-in-cm$/);
  if (feetOnly) {
    const feet = Number(feetOnly[1]);
    const centimeters = Number((feet * 12 * 2.54).toFixed(2)).toString();
    return `${feet} feet equals ${centimeters} centimeters`;
  }

  return "";
}

function exactPageRequiredTokens(pathname) {
  const inch = pathname.match(/^\/(\d+(?:-\d+)?)-(inch|inches)-in-cm$/);
  if (inch) {
    const inches = Number(inch[1].replace("-", "."));
    const cm = Number((inches * 2.54).toFixed(4)).toString();
    return [inches.toString(), cm, "centimeters"];
  }

  const cm = pathname.match(/^\/(\d+(?:-\d+)?)-cm-in-inches$/);
  if (cm) {
    const centimeters = Number(cm[1].replace("-", "."));
    const inches = Number((centimeters / 2.54).toFixed(4)).toString();
    return [centimeters.toString(), inches, "inch"];
  }

  const height = pathname.match(/^\/(\d+)-(\d+)-in-cm$/);
  if (height) {
    const feet = Number(height[1]);
    const inches = Number(height[2]);
    const centimeters = Number(((feet * 12 + inches) * 2.54).toFixed(4)).toString();
    return [feet.toString(), inches.toString(), centimeters, "centimeters"];
  }

  const feetOnly = pathname.match(/^\/(\d+)-feet-in-cm$/);
  if (feetOnly) {
    const feet = Number(feetOnly[1]);
    const centimeters = Number((feet * 12 * 2.54).toFixed(4)).toString();
    return [feet.toString(), centimeters, "centimeters"];
  }

  return [];
}

function repeatedKeywordRisk(description) {
  const stopWords = new Set(["and", "the", "with", "for", "to", "in", "of", "a", "an", "or"]);
  const counts = new Map();
  const words = description.toLowerCase().match(/[a-z]+/g) ?? [];
  for (const word of words) {
    if (word.length < 3 || stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 4);
}

if (!fs.existsSync(outDir)) {
  console.error("Meta description check requires final static output. Run npm run build first.");
  process.exit(1);
}

const sitemapFile = path.join(outDir, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) {
  console.error("Missing out/sitemap.xml.");
  process.exit(1);
}

const sitemapXml = read(sitemapFile);
const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => decodeEntities(match[1]))
  .map((url) => {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== siteOrigin) fail(`Sitemap URL uses wrong origin: ${url}`);
      if (parsed.search || parsed.hash) fail(`Sitemap URL contains query or fragment: ${url}`);
      return normalizePath(parsed.pathname);
    } catch {
      fail(`Invalid sitemap URL: ${url}`);
      return "";
    }
  })
  .filter(Boolean);

const descriptions = new Map();
const lengthBuckets = {
  short: 0,
  recommended: 0,
  long: 0,
};

for (const pathname of sitemapPaths) {
  const file = htmlFileForPath(pathname);
  if (!fs.existsSync(file)) {
    fail(`Sitemap route has no exported HTML: ${pathname}`);
    continue;
  }

  const html = read(file);
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const descriptionTags = metaTags.filter((tag) => tagAttribute(tag, "name") === "description");
  const title = plainText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = tagAttribute(descriptionTags[0], "content") ?? "";
  const descriptionLower = description.toLowerCase();

  if (descriptionTags.length !== 1) {
    fail(`Expected exactly one meta description on ${pathname}, found ${descriptionTags.length}.`);
    continue;
  }

  if (!description) fail(`Empty meta description on ${pathname}.`);
  if (description.length < 50) fail(`Meta description is too short for a useful snippet on ${pathname}: ${description.length} chars.`);
  if (description.length > 170) fail(`Meta description is likely too long for a concise snippet on ${pathname}: ${description.length} chars.`);
  if (description.length < 80) lengthBuckets.short += 1;
  else if (description.length <= 160) lengthBuckets.recommended += 1;
  else lengthBuckets.long += 1;

  if (/lorem|placeholder|todo|coming soon|undefined|null/i.test(description)) {
    fail(`Placeholder-like meta description on ${pathname}: ${description}`);
  }

  if (/[!?]{2,}|#1|guaranteed|secret trick|shocking|must see/i.test(description)) {
    fail(`Clickbait or exaggerated punctuation in meta description on ${pathname}: ${description}`);
  }

  const repeated = repeatedKeywordRisk(description);
  if (repeated.length) {
    fail(`Possible keyword stuffing in meta description on ${pathname}: ${repeated.map(([word, count]) => `${word} x${count}`).join(", ")}`);
  }

  const expectedAnswer = exactPageExpectedAnswer(pathname);
  const exactTokens = exactPageRequiredTokens(pathname);
  if (expectedAnswer && exactTokens.some((token) => !descriptionLower.includes(token.toLowerCase()))) {
    fail(`Exact conversion description does not include the core direct-answer tokens on ${pathname}. Expected around: "${expectedAnswer}".`);
  }

  const routes = descriptions.get(description) ?? [];
  routes.push(pathname);
  descriptions.set(description, routes);

  if (title && description === title) {
    fail(`Meta description duplicates the title exactly on ${pathname}.`);
  }
}

for (const [description, routes] of descriptions.entries()) {
  if (description && routes.length > 1) {
    fail(`Duplicate meta description on ${routes.join(", ")}.`);
  }
}

if (errors.length) {
  console.error(errors.map((message) => `FAIL: ${message}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${sitemapPaths.length} sitemap URLs have one unique, useful meta description.`);
console.log(`PASS: description lengths are within safe bounds: ${lengthBuckets.recommended} in 80-160 chars, ${lengthBuckets.short} in 50-79, ${lengthBuckets.long} in 161-170.`);
console.log("PASS: no placeholder, clickbait, excessive repetition, or missing exact-answer descriptions found.");
