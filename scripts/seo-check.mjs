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
  "GSC-DATA-LOG.md",
  "GSC-QUERY-PAGE-MAP.md",
  "ROADMAP.md",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "src/app/not-found.tsx",
  "src/components/RelatedLinks.tsx",
  "src/components/ToolSEOContent.tsx",
  "src/data/tools.ts",
  "src/lib/internal-links.ts",
  "public/favicon.ico",
  "public/icon.png",
  "public/apple-icon.png",
  "scripts/site-check.mjs",
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
  "/conversion-methodology",
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

const internalLinksSource = read("src/lib/internal-links.ts");
if (
  internalLinksSource.includes("getHeightRelatedLinks")
  && internalLinksSource.includes("getInchRelatedLinks")
  && internalLinksSource.includes("getCmRelatedLinks")
  && internalLinksSource.includes("getScreenRelatedLinks")
  && internalLinksSource.includes("getRelatedLinksForPage")
  && internalLinksSource.includes("isCommonScreenSize")
  && dynamicSource.includes("<FeetToCmConverter")
  && dynamicSource.includes("getHeightRelatedLinks(feet, inches)")
) {
  pass("height pages use a dedicated converter and reusable safe boundary links");
} else {
  fail("height pages need a dedicated converter and reusable bounded nearby links");
}

if (
  dynamicSource.includes("in cm: ${result} cm | Height Conversion")
  && dynamicSource.includes("${fullLabel} is ${result} cm")
  && dynamicSource.includes("${totalInches} total inches × 2.54")
  && dynamicSource.includes("What is ${label} in total inches?")
  && dynamicSource.includes("How many cm is {fullLabel}?")
  && dynamicSource.includes("How many inches is {label}?")
  && dynamicSource.includes("{fullLabel} is {resultText} centimeters.")
  && dynamicSource.includes("{totalInches} total inches")
  && dynamicSource.includes("{decimalFeetText} decimal feet")
  && dynamicSource.includes("{totalInches} × 2.54 = {resultText} cm")
  && dynamicSource.includes("Related length conversions")
  && internalLinksSource.includes("Nearby height conversions")
  && internalLinksSource.includes("getHeightContext")
  && internalLinksSource.includes("school forms")
  && internalLinksSource.includes("travel or ID forms")
  && internalLinksSource.includes("clearance references")
) {
  pass("height pages use cluster-specific CTR metadata and answer intent");
} else {
  fail("height pages need cluster-specific CTR metadata and answer intent");
}

if (
  dynamicSource.includes("How many centimeters is {valueText}")
  && dynamicSource.includes("How many inches is {valueText} cm?")
  && dynamicSource.includes("How tall is {label} in centimeters?")
  && dynamicSource.includes('How big is {valueText} {singular ? "inch" : "inches"} in real life?')
  && dynamicSource.includes('What is {valueText} {singular ? "inch" : "inches"} commonly used to measure?')
) {
  pass("exact conversion pages include grammatical natural-language question headings");
} else {
  fail("exact conversion pages are missing grammatical natural-language question headings");
}

if (!/["'`]\/[^"'`]*\?/.test(sitemapSource)) {
  pass("sitemap does not include query parameter URLs");
} else {
  fail("query parameter URLs appear in the sitemap source");
}

const robotsSource = read("src/app/robots.ts");
if (!robotsSource.includes('"/*?*"')) pass("robots allows crawlers to read clean canonical metadata on parameter requests");
else fail("robots must not block all parameter requests from exposing canonical metadata");

if (!robotsSource.includes("/_next/")) pass("robots allows Google to crawl Next.js CSS and JavaScript assets");
else fail("robots must not block /_next/ static assets needed for rendering");

if (
  !robotsSource.includes("/favicon.ico")
  && !robotsSource.includes("/icon.png")
  && !robotsSource.includes("/apple-icon.png")
) {
  pass("robots does not block favicon or site icon files");
} else {
  fail("robots must not block favicon or site icon files");
}

const seoSource = read("src/lib/seo.ts");
if (seoSource.includes("alternates: { canonical: path }")) pass("page metadata emits a clean canonical route");
else fail("page metadata must emit a clean canonical route");

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
for (const phrase of ["GSC clicks", "positions 8–20", "fewer than 100 impressions", "npm test", "npm run seo:check", "what metric or behavior to watch tomorrow"]) {
  if (workflow.includes(phrase)) pass(`daily workflow covers: ${phrase}`);
  else fail(`daily workflow missing: ${phrase}`);
}
if (
  workflow.includes("When impressions collapse after a new-site test")
  && workflow.includes("cluster-level CTR improvement")
  && workflow.includes("technical link and canonical checks")
) {
  pass("daily workflow covers new-site impression collapse recovery");
} else {
  fail("daily workflow needs new-site impression collapse recovery guidance");
}

if (
  workflow.includes("When impressions fall but average position improves")
  && workflow.includes("ongoing Google testing")
  && workflow.includes("waiting for clearer top-query and top-page data")
  && workflow.includes("Wait 48 hours after the last substantial SEO or template change")
) {
  pass("daily workflow covers falling-impression but improving-position stabilization");
} else {
  fail("daily workflow needs falling-impression but improving-position stabilization guidance");
}

const gscLog = read("GSC-DATA-LOG.md");
if (
  gscLog.includes("2026-07-19")
  && gscLog.includes("17,700")
  && gscLog.includes("2026-07-22")
  && gscLog.includes("18.5")
  && gscLog.includes("2026-07-23")
  && gscLog.includes("18.1")
  && gscLog.includes("not more pages")
  && gscLog.includes("ongoing low-volume testing")
  && gscLog.includes("42,854")
  && gscLog.includes("28,925")
  && gscLog.includes("GSC reporting delay")
  && gscLog.includes("not proof of a penalty")
  && gscLog.includes("Next Data Needed")
  && gscLog.includes("7-day top queries")
  && gscLog.includes("sitemap submitted/processed status")
) {
  pass("GSC data log records the early testing window and conservative next step");
} else {
  fail("GSC data log must record recent GSC data and conservative interpretation");
}

const queryPageMap = read("GSC-QUERY-PAGE-MAP.md");
if (
  queryPageMap.includes("6'11 in cm")
  && queryPageMap.includes("/6-11-in-cm")
  && queryPageMap.includes("6.11 feet in cm")
  && queryPageMap.includes("4 foot 7 in cm")
  && queryPageMap.includes("/4-7-in-cm")
  && queryPageMap.includes("Do not publish separate pages")
) {
  pass("GSC query-page map consolidates height query variants to existing canonical pages");
} else {
  fail("GSC query-page map must consolidate observed variants to existing height pages");
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

const analyticsSource = read("src/components/GoogleAnalytics.tsx");
if (
  analyticsSource.includes('GA_MEASUREMENT_ID = "G-M2SG4928RK"')
  && analyticsSource.includes('from "next/script"')
  && read("src/app/layout.tsx").includes("<GoogleAnalytics />")
) pass("Google Analytics is isolated in the approved sitewide component");
else fail("Google Analytics must use the approved measurement ID and isolated component");

const privacySource = read("src/app/privacy-policy/page.tsx");
if (privacySource.includes("Google Analytics") && privacySource.includes("does not send the measurement values")) {
  pass("privacy policy accurately describes analytics and converter-value handling");
} else {
  fail("privacy policy must disclose analytics and converter-value handling");
}

const layoutSource = read("src/app/layout.tsx");
if (
  layoutSource.includes("icons:")
  && layoutSource.includes('url: "/favicon.ico"')
  && layoutSource.includes('shortcut: "/favicon.ico"')
  && layoutSource.includes('url: "/icon.png"')
  && layoutSource.includes('url: "/apple-icon.png"')
) {
  pass("layout metadata declares favicon, PNG icon, and Apple touch icon");
} else {
  fail("layout metadata must declare favicon, PNG icon, and Apple touch icon");
}

if (
  layoutSource.includes('href="/privacy-policy"')
  && layoutSource.includes('href="/terms-of-service"')
  && layoutSource.includes('href="/site-map"')
) {
  pass("footer links to website policies and the sitemap");
} else {
  fail("footer is missing policy or sitemap links");
}

if (exists("tests/conversions.test.mjs") && read("package.json").includes('"test": "node --test')) {
  pass("conversion regression tests are configured");
} else {
  fail("conversion regression tests are missing");
}

const methodologySource = read("src/app/conversion-methodology/page.tsx");
if (
  methodologySource.includes("NIST Guide to the SI")
  && methodologySource.includes("BIPM SI Brochure")
  && methodologySource.includes("Rounding and displayed precision")
) {
  pass("conversion methodology documents factors, rounding, and authoritative sources");
} else {
  fail("conversion methodology is incomplete");
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

if (
  homepageSource.includes("Popular height conversions")
  && homepageSource.includes("heightSlug(feet, inches)")
) {
  pass("homepage links quietly into high-intent height conversions");
} else {
  fail("homepage needs a compact height conversion link section");
}

const heightConverterSource = read("src/app/height-converter/page.tsx");
if (
  heightConverterSource.includes("Height Converter - Feet and Inches to CM")
  && heightConverterSource.includes("commonHeights")
  && heightConverterSource.includes("High-impression height conversions")
  && heightConverterSource.includes("feet × 12 + inches = total inches")
  && heightConverterSource.includes("total inches × 2.54 = cm")
  && heightConverterSource.includes("Why feet and inches are converted to centimeters")
  && heightConverterSource.includes("Related length tools")
) {
  pass("height converter supports the tested height cluster");
} else {
  fail("height converter needs a clearer heading and common height table");
}

if (!/clothing size|shoe size/i.test(homepageSource)) {
  pass("homepage use cases stay within the approved length and size scope");
} else {
  fail("homepage includes a prohibited clothing or shoe size use case");
}

const screenPageSource = read("src/app/screen-size-converter/page.tsx");
const screenCalculatorSource = read("src/components/ScreenDimensionsCalculator.tsx");
const toolSeoContentSource = read("src/components/ToolSEOContent.tsx");
const toolDataSource = read("src/data/tools.ts");
if (
  screenPageSource.includes("<ScreenDimensionsCalculator")
  && screenPageSource.includes("toolSeoContent.screenSize")
  && toolSeoContentSource.includes("faqSchema(items)")
  && screenPageSource.includes("Approximate 16:9 display dimensions")
  && screenCalculatorSource.includes("screen-formula")
  && !screenPageSource.includes('<div className="answer">15.6 inches')
) {
  pass("screen converter provides synchronized dimensions, formula, and FAQ schema");
} else {
  fail("screen converter is missing synchronized dimensions, formula, reference data, or FAQ schema");
}

if (
  dynamicSource.includes('slug === "height-conversion-guide"')
  && dynamicSource.includes('slug === "screen-size-vs-width-height"')
  && dynamicSource.includes("getGuideRelatedLinks(slug)")
) {
  pass("guide pages use topic-specific interactive tools and related links");
} else {
  fail("height and screen guides need topic-specific tools and related links");
}

if (
  dynamicSource.includes("getInchRelatedLinks(value)")
  && dynamicSource.includes("getCmRelatedLinks(value)")
  && read("src/components/CoreConverterPage.tsx").includes("<ToolSEOContent config={toolSeoContent[toolKey]}")
  && read("src/components/ChartPage.tsx").includes("<ToolSEOContent config={isInches ? toolSeoContent.inchChart : toolSeoContent.cmChart}")
  && read("src/app/screen-size-converter/page.tsx").includes("getScreenRelatedLinks")
  && read("src/app/height-converter/page.tsx").includes("Popular height conversions")
) {
  pass("core, chart, screen, height, and dynamic pages use sectioned internal link blocks");
} else {
  fail("important page types need sectioned internal link blocks");
}

if (
  toolDataSource.includes("inchesToCm")
  && toolDataSource.includes("cmToInches")
  && toolDataSource.includes("heightConverter")
  && toolDataSource.includes("heightChart")
  && toolDataSource.includes("screenSize")
  && toolDataSource.includes("relatedTools")
  && toolDataSource.includes("tips")
  && toolSeoContentSource.includes("ToolSEOContent")
) {
  pass("tool pages use a reusable SEO content template and configuration");
} else {
  fail("tool pages need reusable SEO content configuration");
}

const inchesPageSource = read("src/app/inches-to-cm/page.tsx");
if (!/including height formats|Inputs such as 5'8/.test(inchesPageSource)) {
  pass("inches converter does not promise unsupported height text input");
} else {
  fail("inches converter still promises unsupported height text input");
}

const netlify = read("netlify.toml");
if (netlify.includes('command = "npm run verify"') && netlify.includes('publish = "out"')) pass("Netlify enforces the full verification pipeline and publishes out");
else fail("Netlify build settings must use npm run verify and publish out");

if (
  netlify.includes('X-Content-Type-Options = "nosniff"')
  && netlify.includes('Referrer-Policy = "strict-origin-when-cross-origin"')
  && netlify.includes("Permissions-Policy")
) pass("Netlify config includes baseline security headers");
else fail("Netlify config is missing baseline security headers");

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
