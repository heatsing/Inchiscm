import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync("src/lib/gsc-priority-heights.ts", "utf8");
const converterSource = fs.readFileSync("src/app/height-converter/page.tsx", "utf8");
const homeSource = fs.readFileSync("src/app/page.tsx", "utf8");
const chartSource = fs.readFileSync("src/app/height-chart/page.tsx", "utf8");
const policy = JSON.parse(fs.readFileSync("seo-page-policy.json", "utf8"));

const requiredHrefs = [
  "/6-5-in-cm",
  "/6-6-in-cm",
  "/6-7-in-cm",
  "/4-8-in-cm",
  "/4-5-in-cm",
  "/6-11-in-cm",
  "/4-7-in-cm",
  "/4-11-in-cm",
  "/5-3-in-cm",
  "/4-2-in-cm",
  "/5-4-in-cm",
  "/4-9-in-cm",
];

function heightSlug(feet, inches) {
  return inches === 0 ? `/${feet}-feet-in-cm` : `/${feet}-${inches}-in-cm`;
}

function parsePriorityPairs() {
  const block = source.split("export const GSC_PRIORITY_HEIGHTS")[1]?.split("] as const")[0] ?? "";
  return [...block.matchAll(/\[(\d+),\s*(\d+)\]/g)].map((match) => [Number(match[1]), Number(match[2])]);
}

test("GSC-priority height set is a curated published list of about 20 heights", () => {
  const pairs = parsePriorityPairs();
  assert.ok(pairs.length >= 16 && pairs.length <= 24);
  assert.match(source, /heightPriorityLabel/);
  assert.match(source, /\$\{heightShortLabel\(feet, inches\)\} → cm/);

  const minTotal = policy.heightMinTotalInches;
  const maxTotal = policy.heightMaxTotalInches;
  for (const [feet, inches] of pairs) {
    const total = feet * 12 + inches;
    assert.ok(total >= minTotal && total <= maxTotal, `${feet}'${inches}" is outside the published height range`);
    assert.ok(inches >= 0 && inches <= 11);
  }
});

test("GSC-priority height set includes the live-gap high-impression pages", () => {
  const hrefs = new Set(parsePriorityPairs().map(([feet, inches]) => heightSlug(feet, inches)));
  for (const href of requiredHrefs) {
    assert.equal(hrefs.has(href), true, `missing ${href}`);
  }
});

test("GSC-priority height labels stay readable as feet/inches", () => {
  assert.match(source, /6'11" → cm|heightShortLabel/);
  assert.doesNotMatch(source, /\d+\.\d+ inches in cm/);
});

test("height hubs and homepage consume the shared GSC-priority height set", () => {
  assert.match(converterSource, /gscPriorityHeightEntries/);
  assert.match(converterSource, /Popular heights/);
  assert.match(homeSource, /PopularHeightLinks/);
  assert.match(chartSource, /PopularHeightLinks/);
  assert.doesNotMatch(converterSource, /Recovery height conversions/);
});
