import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const policy = JSON.parse(read("seo-page-policy.json"));

const errors = [];
const checks = [];
const pass = (message) => checks.push(`✓ ${message}`);
const fail = (message) => errors.push(`✗ ${message}`);

const requiredFiles = [
  "SEO_OPERATING_RULES.md",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "netlify.toml",
];
for (const file of requiredFiles) {
  if (exists(file)) pass(`${file} exists`);
  else fail(`${file} is missing`);
}

const sitemapSource = read("src/app/sitemap.ts");
const requiredRoutes = [
  "",
  "/inches-to-cm",
  "/cm-to-inches",
  "/inch-to-cm-chart",
  "/height-converter",
  "/screen-size-converter",
  "/how-to-convert-inches-to-cm",
  "/inch-vs-cm",
  "/feet-to-cm",
  "/inches-to-mm",
];
for (const route of requiredRoutes.filter(Boolean)) {
  if (sitemapSource.includes(`"${route}"`)) pass(`${route} is included in the sitemap`);
  else fail(`${route} is missing from the sitemap`);
}

const wholeInches = Array.from({ length: policy.wholeInchesMax }, (_, index) => index + 1);
const inchValues = [...new Set([...wholeInches, ...policy.decimalInches, ...policy.screenInches])];
const wholeCm = Array.from({ length: policy.wholeCentimetersMax }, (_, index) => index + 1);
const reverseCm = inchValues.map((value) => Number((value * 2.54).toFixed(4)));
const cmValues = [...new Set([...wholeCm, ...reverseCm])];
const heightCount = policy.heightMaxTotalInches - policy.heightMinTotalInches + 1;
const programmaticCount = inchValues.length + cmValues.length + heightCount + policy.guidePages.length;

if (programmaticCount <= policy.maxProgrammaticPages) {
  pass(`programmatic page count is ${programmaticCount}, within the ${policy.maxProgrammaticPages} limit`);
} else {
  fail(`programmatic page count ${programmaticCount} exceeds ${policy.maxProgrammaticPages}`);
}

if (policy.wholeInchesMax <= 100 && policy.wholeCentimetersMax <= 100) {
  pass("whole-number inch and cm ranges are capped at 100");
} else {
  fail("whole-number ranges exceed the safe initial cap");
}

const dynamicSource = read("src/app/[slug]/page.tsx");
if (dynamicSource.includes("export const dynamicParams = false")) pass("unlisted dynamic routes are disabled");
else fail("dynamicParams must be false to prevent unlimited routes");

if (policy.guidePages.every((slug) => dynamicSource.includes(`"${slug}"`))) {
  pass("all approved guide pages are implemented");
} else {
  fail("guide page policy and implementation are out of sync");
}

if (!/["'`]\/[^"'`]*\?/.test(sitemapSource)) {
  pass("sitemap does not include query parameter URLs");
} else {
  fail("query parameter URLs appear in the sitemap source");
}

const robotsSource = read("src/app/robots.ts");
if (robotsSource.includes('"/*?*"')) pass("robots policy discourages query parameter crawling");
else fail("robots policy does not block query parameter crawling");

const rules = read("SEO_OPERATING_RULES.md");
for (const phrase of ["No infinite programmatic pages", "No thin pages", "No parameter indexing", "Google Search Console", "Ads never block the converter"]) {
  if (rules.includes(phrase)) pass(`operating rules cover: ${phrase}`);
  else fail(`operating rules missing: ${phrase}`);
}

const netlify = read("netlify.toml");
if (netlify.includes('command = "npm run build"') && netlify.includes('publish = "out"')) pass("Netlify uses npm run build and publishes out");
else fail("Netlify build settings must use npm run build and out");

console.log(checks.join("\n"));
console.log(`\nProgrammatic pages: ${programmaticCount}`);
console.log(`Approved inch pages: ${inchValues.length}`);
console.log(`Approved cm pages: ${cmValues.length}`);
console.log(`Approved height pages: ${heightCount}`);
console.log(`Approved guide pages: ${policy.guidePages.length}`);

if (errors.length) {
  console.error(`\n${errors.join("\n")}`);
  process.exit(1);
}

console.log("\nSEO checks passed.");
