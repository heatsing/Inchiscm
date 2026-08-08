import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteOrigin = "https://inchiscm.com";
const sitemap = fs.readFileSync(path.join(root, "out", "sitemap.xml"), "utf8");
const currentUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const batchOneNew = new Set([
  "/13-5-inches-in-cm", "/14-5-inches-in-cm", "/15-5-inches-in-cm", "/16-5-inches-in-cm",
  "/18-5-inches-in-cm", "/19-5-inches-in-cm", "/20-5-inches-in-cm", "/21-5-inch-in-cm",
  "/22-5-inches-in-cm", "/23-5-inches-in-cm", "/24-5-inches-in-cm", "/27-5-inches-in-cm",
  "/110-cm-in-inches", "/120-cm-in-inches", "/130-cm-in-inches", "/140-cm-in-inches",
  "/150-cm-in-inches", "/160-cm-in-inches", "/170-cm-in-inches", "/180-cm-in-inches",
  "/190-cm-in-inches", "/200-cm-in-inches",
  "/laptop-screen-size-in-cm", "/tv-size-in-cm", "/metric-vs-imperial-units",
  "/how-to-convert-cm-to-inches", "/how-big-is-24-inches",
  "/length-converters", "/fraction-converters", "/height-tools", "/screen-tools", "/measurement-guides",
  "/feet-to-inches", "/inches-to-feet", "/meters-to-feet", "/feet-to-meters",
  "/yards-to-meters", "/meters-to-yards", "/miles-to-km", "/km-to-miles",
  "/meters-to-cm", "/cm-to-meters", "/mm-to-cm", "/cm-to-mm",
  "/decimal-inches-to-fractions", "/fractions-to-decimal-inches", "/ppi-calculator",
  "/screen-aspect-ratio-calculator", "/screen-dimensions-calculator", "/tape-measure-fractions-guide",
]);

const columns = [
  "Proposed URL",
  "Page type",
  "Primary keyword",
  "Secondary queries",
  "Search intent",
  "User task",
  "Unique value",
  "Required calculator or interactive component",
  "Required server-rendered answer",
  "Parent topic hub",
  "Internal links in",
  "Internal links out",
  "Canonical URL",
  "Structured-data type",
  "Content source or calculation source",
  "Cannibalization target",
  "Quality status",
  "Publication batch",
  "Deployment status",
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function slugTitle(pathname) {
  return pathname
    .replace(/^\//, "")
    .replaceAll("-", " ")
    .replace(/\bcm\b/gi, "CM")
    .replace(/\bkm\b/gi, "KM")
    .replace(/\bmm\b/gi, "MM")
    .replace(/\bppi\b/gi, "PPI")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function classify(pathname) {
  if (pathname === "/") return ["Core tool", "inch to cm converter", "/"];
  if (/\/\d/.test(pathname) && pathname.includes("in-cm")) return ["Exact conversion", `${slugTitle(pathname)}`, "/length-converters"];
  if (pathname.includes("screen") || pathname.includes("ppi") || pathname.includes("tv-size") || pathname.includes("laptop-screen")) return ["Screen measurement", slugTitle(pathname), "/screen-tools"];
  if (pathname.includes("height") || pathname.includes("feet")) return ["Height or length tool", slugTitle(pathname), "/height-tools"];
  if (pathname.includes("fraction") || pathname.includes("tape-measure")) return ["Fraction measurement", slugTitle(pathname), "/fraction-converters"];
  if (pathname.includes("chart")) return ["Chart or table", slugTitle(pathname), "/measurement-guides"];
  if (pathname.includes("policy") || pathname.includes("terms") || pathname.includes("site-map")) return ["Utility", slugTitle(pathname), "/"];
  return ["Guide or converter", slugTitle(pathname), "/measurement-guides"];
}

function record(pathname, status = "Published") {
  const [type, keyword, hub] = classify(pathname);
  const canonical = `${siteOrigin}${pathname === "/" ? "" : pathname}`;
  const isTool = /converter|calculator|in-cm|in-inches|to-/.test(pathname);
  const batch = status === "Published" ? (batchOneNew.has(pathname) ? "Batch 1" : "Existing") : status;
  const deployment = status === "Published" ? (batchOneNew.has(pathname) ? "Public in first deployment batch" : "Already public") : "Withheld for future approved batch";
  return {
    "Proposed URL": pathname,
    "Page type": type,
    "Primary keyword": keyword.toLowerCase(),
    "Secondary queries": `${keyword.toLowerCase()} calculator; ${keyword.toLowerCase()} formula; ${keyword.toLowerCase()} examples`,
    "Search intent": `Solve the measurement task for ${keyword.toLowerCase()}.`,
    "User task": "Convert, compare, or understand a length or size measurement.",
    "Unique value": type === "Exact conversion" ? "Direct answer, formula, nearby values, context, FAQ, and internal links." : "Task-specific calculator, explanation, examples, FAQ, and related measurement links.",
    "Required calculator or interactive component": isTool ? "Length, screen, height, fraction, or table tool as appropriate." : "Reference table or contextual guide module.",
    "Required server-rendered answer": `A direct answer for ${keyword.toLowerCase()} must appear in static HTML.`,
    "Parent topic hub": hub,
    "Internal links in": `Parent hub ${hub} plus at least one contextual sibling.`,
    "Internal links out": "Parent hub, two siblings, one core converter, and one relevant guide.",
    "Canonical URL": canonical,
    "Structured-data type": isTool ? "WebPage; BreadcrumbList; WebApplication when a working tool is visible" : "WebPage; BreadcrumbList; FAQPage only when FAQ is visible",
    "Content source or calculation source": "Site conversion utilities, exact SI/imperial factors, screen geometry formulas, and visible page model.",
    "Cannibalization target": "None allowed; consolidate punctuation and wording variants to existing canonical pages.",
    "Quality status": "Approved inventory item; must pass final page quality gate before publication.",
    "Publication batch": batch,
    "Deployment status": deployment,
  };
}

const rows = [];
const seen = new Set();
for (const url of currentUrls) {
  const pathname = new URL(url).pathname || "/";
  if (!seen.has(pathname)) {
    seen.add(pathname);
    rows.push(record(pathname, "Published"));
  }
}

const units = ["inch", "cm", "mm", "meter", "km", "foot", "yard", "mile", "micrometer", "nanometer"];
const future = [];
for (const from of units) {
  for (const to of units) {
    if (from !== to) future.push(`/${from}-to-${to}`);
  }
}
for (const denominator of [2, 4, 8, 16, 32, 64]) {
  for (let numerator = 1; numerator < denominator; numerator += 1) {
    future.push(`/${numerator}-${denominator}-inch-in-cm`);
  }
}
for (const size of [11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 23, 25, 26, 28, 29, 30, 34, 40, 42, 48, 50, 58, 70, 77, 83, 86, 98]) {
  future.push(`/${size}-inch-screen-size-in-cm`);
}
for (const ratio of ["16-9", "16-10", "3-2", "4-3", "21-9", "32-9"]) {
  future.push(`/screen-${ratio}-aspect-ratio`);
}
for (const topic of [
  "how-to-read-a-ruler", "how-to-read-a-tape-measure", "ruler-increments-chart",
  "inch-fraction-chart", "decimal-inch-chart", "metric-ruler-guide", "rounding-inches-to-cm",
  "rounding-cm-to-inches", "measure-screen-diagonal", "monitor-size-in-cm",
  "tablet-screen-size-in-cm", "phone-screen-size-in-cm", "box-dimensions-converter",
  "furniture-dimensions-converter", "luggage-size-in-cm", "picture-frame-size-converter",
  "paper-size-in-cm-and-inches", "shelf-depth-in-cm", "desk-size-in-cm",
]) future.push(`/${topic}`);
for (let cm = 210; cm <= 800; cm += 10) future.push(`/${cm}-cm-in-inches`);
for (let inch = 101; inch <= 400; inch += 1) future.push(`/${inch}-inches-in-cm`);
for (let total = 97; total <= 132; total += 1) {
  const feet = Math.floor(total / 12);
  const inches = total % 12;
  future.push(inches === 0 ? `/${feet}-feet-in-cm` : `/${feet}-${inches}-in-cm`);
}

let futureIndex = 0;
while (rows.length < 1000 && futureIndex < future.length) {
  const pathname = future[futureIndex];
  futureIndex += 1;
  if (seen.has(pathname)) continue;
  seen.add(pathname);
  const futureNumber = rows.length - currentUrls.length + 1;
  const batch = futureNumber <= 75 ? "Batch 2" : futureNumber <= 175 ? "Batch 3" : futureNumber <= 275 ? "Batch 4" : futureNumber <= 375 ? "Batch 5" : futureNumber <= 475 ? "Batch 6" : "Final batch";
  rows.push(record(pathname, batch));
}

if (rows.length !== 1000) {
  throw new Error(`Inventory generation produced ${rows.length} records instead of 1000.`);
}

const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n");
fs.writeFileSync(path.join(root, "SEO-PAGE-INVENTORY-1000.csv"), `${csv}\n`);

const counts = rows.reduce((map, row) => {
  map[row["Publication batch"]] = (map[row["Publication batch"]] ?? 0) + 1;
  return map;
}, {});
const md = [
  "# SEO Page Inventory 1000",
  "",
  "This inventory records exactly 1,000 eligible measurement URLs for inchiscm.com. Current public pages are listed first; future pages are withheld until their batch is approved and validated.",
  "",
  "## Counts by publication batch",
  "",
  "| Batch | Records |",
  "| --- | ---: |",
  ...Object.entries(counts).map(([batch, count]) => `| ${batch} | ${count} |`),
  "",
  "## Quality gate",
  "",
  "- Existing URLs stay live, indexable, self-canonical, and sitemap-included.",
  "- Future records are inventory only until implemented with a working tool or useful reference content.",
  "- No query-parameter pages, unrelated calculators, fake examples, ratings, reviews, or ad placeholders are allowed.",
  "- Next batches require at least 14 days of GSC observation after the previous batch.",
  "",
  "## CSV source",
  "",
  "See `SEO-PAGE-INVENTORY-1000.csv` for the complete row-level inventory.",
  "",
].join("\n");
fs.writeFileSync(path.join(root, "SEO-PAGE-INVENTORY-1000.md"), md);

console.log(`Wrote ${rows.length} inventory records.`);
