import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";

const moduleSource = fs.readFileSync("src/lib/height-page-modules.ts", "utf8");
const pageSource = fs.readFileSync("src/app/[slug]/page.tsx", "utf8");
const contentSource = fs.readFileSync("src/data/page-registry/content.tsx", "utf8");
const cssSource = [
  fs.readFileSync("src/app/globals.css", "utf8"),
  fs.readFileSync("src/components/height-page.css", "utf8"),
].join("\n");
const actionsSource = fs.readFileSync("src/components/HeightResultActions.tsx", "utf8");
const converterSource = fs.readFileSync("src/components/SpecializedConverters.tsx", "utf8");
const stylesSource = fs.readFileSync("src/components/HeightPageStyles.tsx", "utf8");

function exactCm(feet, inches) {
  return Number(convertLength(feet * 12 + inches, "in", "cm").toFixed(4)).toString();
}

test("height template uses the shared height page modules", () => {
  assert.match(moduleSource, /HEIGHT_NEARBY_RADIUS = 5/);
  assert.match(moduleSource, /\(\$\{feet\} × 12 \+ \$\{inches\}\) × 2\.54 = \$\{totalInches\} × 2\.54/);
  assert.match(moduleSource, /nearbyPublishedHeights\(feet, inches, radius\)/);
  assert.match(moduleSource, /taller than|shorter than/);
  assert.match(pageSource, /getHeightPageModules\(feet, inches\)/);
  assert.match(pageSource, /height-answer-cm/);
  assert.match(pageSource, /height-answer-ftin/);
  assert.match(pageSource, /height-answer-formula/);
  assert.match(pageSource, /height-answer-hero/);
  assert.match(pageSource, /height-answer-eq/);
  assert.match(pageSource, /FeetToCmConverter defaultFeet=\{feet\} defaultInches=\{inches\} embedded/);
  assert.match(pageSource, /Breadcrumbs current=\{pageData\.h1\} compact/);
  assert.match(pageSource, /HeightPageStyles/);
  assert.match(stylesSource, /height-page\.css/);
  assert.match(pageSource, /height-formula-steps/);
  assert.match(pageSource, /HeightResultActions/);
  assert.match(pageSource, /id="nearby-heights"/);
  assert.match(pageSource, /id="height-context"/);
  assert.match(contentSource, /getHeightPageModules\(feet, inches\)/);
  assert.match(contentSource, /modules\.faq/);
  assert.doesNotMatch(moduleSource, /NBA|celebrity|how-tall-is/i);
  assert.doesNotMatch(pageSource, /faq\.push/);
});

test("spot-check height formula numbers stay on total inches × 2.54", () => {
  const cases = [
    [6, 11, 83, "210.82"],
    [4, 7, 55, "139.7"],
    [5, 5, 65, "165.1"],
  ];
  for (const [feet, inches, totalInches, cm] of cases) {
    assert.equal(feet * 12 + inches, totalInches);
    assert.equal(exactCm(feet, inches), cm);
    assert.match(moduleSource, new RegExp(String.raw`\$\{feet\} × 12 = \$\{feetToInches\}`));
    assert.match(moduleSource, new RegExp(String.raw`\$\{totalInches\} × 2\.54 = \$\{resultText\} cm`));
  }
});

test("height hero modules expose cm and ft/in dual readings plus the compact formula", () => {
  assert.match(moduleSource, /heightFeetInchesMark\(feet, inches\)/);
  assert.match(moduleSource, /ftInText/);
  assert.match(moduleSource, /ftInSpelled: `\$\{feet\} ft \$\{inches\} in`/);
  assert.match(moduleSource, /equalityText: `\$\{ftInText\} = \$\{resultText\} cm`/);
  assert.match(pageSource, /modules\.ftInText/);
  assert.match(pageSource, /modules\.formula\.compact/);
  assert.equal(exactCm(6, 11), "210.82");
  assert.equal(6 * 12 + 11, 83);
  assert.equal(exactCm(6, 0), "182.88");
});

test("height hero keeps copy/share on the current canonical URL and adds print styles", () => {
  assert.match(pageSource, /shareUrl=\{absoluteUrl\(`\/\$\{slug\}`\)\}/);
  assert.match(actionsSource, /navigator\.share\(\{ title: shareTitle, text: shareText, url: shareUrl \}\)/);
  assert.doesNotMatch(actionsSource, /utm_|\/share\b|sharer\.php/);
  assert.match(cssSource, /@media print/);
  assert.match(cssSource, /\.height-answer-hero, \.data-table-wrap \{ break-inside: avoid;/);
  assert.match(cssSource, /\.height-result-actions/);
  assert.match(cssSource, /\.height-converter-embedded \.result-detail/);
  assert.match(cssSource, /\.height-answer-dual \{ display: flex;/);
  assert.doesNotMatch(cssSource, /\.height-converter-embedded \.result-detail \{[\s\S]*?position:\s*sticky/);
  assert.match(cssSource, /@media \(min-width: 641px\)/);
  assert.match(actionsSource, /Copy result/);
  assert.match(converterSource, /embedded \? null : \(/);
});

test("height FAQ helper is capped at three number-specific questions", () => {
  assert.match(moduleSource, /How tall is \$\{label\} in cm\?/);
  assert.match(moduleSource, /How is \$\{label\} converted to centimeters\?/);
  assert.match(moduleSource, /What is \$\{label\} in total inches\?/);
  assert.equal([...moduleSource.matchAll(/question: `/g)].length, 3);
});
