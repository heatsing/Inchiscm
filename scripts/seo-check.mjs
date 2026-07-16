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
  "SEO-OPERATING-RULES.md",
  "CONTENT-GEO-RULES.md",
  "CODEX-DAILY-WORKFLOW.md",
  "ROADMAP.md",
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
  "/privacy-policy",
  "/terms-of-service",
  "/site-map",
];
for (const route of requiredRoutes.filter(Boolean)) {
  if (sitemapSource.includes(`"${route}"`)) pass(`${route} is included in the sitemap`);
  else fail(`${route} is missing from the sitemap`);
}

const wholeInches = Array.from({ length: policy.wholeInchesMax }, (_, index) => index + 1);
const inchValues = [...new Set([...wholeInches, ...policy.decimalInches, ...policy.screenInches])];
const wholeCm = Array.from({ length: policy.wholeCentimetersMax }, (_, index) => index + 1);
const reverseCm = policy.approvedReverseCentimeters;
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

if (policy.approvedReverseCentimeters.length <= 15) {
  pass("reverse centimeter pages are limited to a small approved set");
} else {
  fail("too many reverse centimeter pages are approved");
}

if (
  dynamicSource.includes("{previous &&")
  && dynamicSource.includes("{next &&")
  && dynamicSource.includes("<FeetToCmConverter")
) {
  pass("height pages use a dedicated converter and safe boundary links");
} else {
  fail("height pages need a dedicated converter and bounded nearby links");
}

if (
  dynamicSource.includes("How many cm is {valueText}")
  && dynamicSource.includes("How many inches is {valueText} cm?")
  && dynamicSource.includes("How tall is {label} in centimeters?")
) {
  pass("exact conversion pages include natural-language question headings");
} else {
  fail("exact conversion pages are missing natural-language question headings");
}

if (!/["'`]\/[^"'`]*\?/.test(sitemapSource)) {
  pass("sitemap does not include query parameter URLs");
} else {
  fail("query parameter URLs appear in the sitemap source");
}

const robotsSource = read("src/app/robots.ts");
if (robotsSource.includes('"/*?*"')) pass("robots policy discourages query parameter crawling");
else fail("robots policy does not block query parameter crawling");

const rules = read("SEO-OPERATING-RULES.md");
for (const phrase of ["No infinite programmatic pages", "No thin pages", "No parameter indexing", "Google Search Console", "AdSense is paused"]) {
  if (rules.includes(phrase)) pass(`operating rules cover: ${phrase}`);
  else fail(`operating rules missing: ${phrase}`);
}

const contentRules = read("CONTENT-GEO-RULES.md");
for (const phrase of ["direct, snippet-friendly answer", "exact formula", "practical worked examples", "Do not overpublish"]) {
  if (contentRules.includes(phrase)) pass(`content rules cover: ${phrase}`);
  else fail(`content rules missing: ${phrase}`);
}

const workflow = read("CODEX-DAILY-WORKFLOW.md");
for (const phrase of ["GSC clicks", "positions 8–20", "npm run seo:check", "what metric or behavior to watch tomorrow"]) {
  if (workflow.includes(phrase)) pass(`daily workflow covers: ${phrase}`);
  else fail(`daily workflow missing: ${phrase}`);
}

const roadmap = read("ROADMAP.md");
for (const phrase of ["Phase 1: Foundation", "Phase 2: Focused length expansion", "Phase 3: Helpful guide content", "Phase 4: Data-driven expansion", "Phase 5: Monetization"]) {
  if (roadmap.includes(phrase)) pass(`roadmap covers: ${phrase}`);
  else fail(`roadmap missing: ${phrase}`);
}

const adSlotSource = read("src/components/AdSlot.tsx");
if (adSlotSource.includes("return null") && !adSlotSource.includes("<aside")) {
  pass("visible ad placeholders are disabled");
} else {
  fail("AdSlot must remain disabled while AdSense is paused");
}

const sourceFiles = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/[slug]/page.tsx",
  "src/components/AdSlot.tsx",
];
const hasAdSenseCode = sourceFiles.some((file) => /adsbygoogle|pagead2\.googlesyndication|data-ad-client/i.test(read(file)));
if (!hasAdSenseCode) pass("no real AdSense code is present");
else fail("real AdSense code is present while monetization is paused");

const layoutSource = read("src/app/layout.tsx");
if (
  layoutSource.includes('href="/privacy-policy"')
  && layoutSource.includes('href="/terms-of-service"')
  && layoutSource.includes('href="/site-map"')
) {
  pass("footer links to website policies and the sitemap");
} else {
  fail("footer is missing policy or sitemap links");
}

const lengthUnitsSource = read("src/lib/length-units.ts");
const requiredLengthUnits = ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"];
if (requiredLengthUnits.every((unit) => lengthUnitsSource.includes(`symbol: "${unit}"`))) {
  pass("length converter supports all eight approved units");
} else {
  fail("length converter is missing one or more approved units");
}

const homepageSource = read("src/app/page.tsx");
if (
  homepageSource.includes("<h1>Inch to CM Converter</h1>")
  && homepageSource.includes('defaultFrom="in"')
  && homepageSource.includes('defaultTo="cm"')
  && homepageSource.includes("defaultValue={10}")
) {
  pass("homepage keeps the Inch to CM focus and default conversion");
} else {
  fail("homepage Inch to CM positioning or defaults changed");
}

if (!/clothing size|shoe size/i.test(homepageSource)) {
  pass("homepage use cases stay within the approved length and size scope");
} else {
  fail("homepage includes a prohibited clothing or shoe size use case");
}

const screenPageSource = read("src/app/screen-size-converter/page.tsx");
if (
  screenPageSource.includes("<ScreenDimensionsCalculator")
  && screenPageSource.includes("faqSchema(faq)")
  && screenPageSource.includes("Approximate 16:9 display dimensions")
) {
  pass("screen converter provides useful physical dimensions and FAQ schema");
} else {
  fail("screen converter is missing dimensions, reference data, or FAQ schema");
}

if (
  dynamicSource.includes('slug === "height-conversion-guide"')
  && dynamicSource.includes('slug === "screen-size-vs-width-height"')
) {
  pass("guide pages use topic-specific interactive tools");
} else {
  fail("height and screen guides need topic-specific tools");
}

const inchesPageSource = read("src/app/inches-to-cm/page.tsx");
if (!/including height formats|Inputs such as 5'8/.test(inchesPageSource)) {
  pass("inches converter does not promise unsupported height text input");
} else {
  fail("inches converter still promises unsupported height text input");
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
