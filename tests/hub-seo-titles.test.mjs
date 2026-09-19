import assert from "node:assert/strict";
import test from "node:test";
import { HUB_SEO_TITLES } from "../src/data/page-registry/hub-seo-titles.ts";

const expectedSlugs = [
  "inch-vs-cm",
  "height-tools",
  "screen-tools",
  "tv-size-in-cm",
  "ppi-calculator",
  "inch-to-mm-chart",
  "mm-to-inch-chart",
  "length-converters",
  "conversion-charts",
  "measurement-guides",
  "mm-to-cm",
  "cm-to-mm",
  "fraction-converters",
  "feet-to-meter-chart",
  "meter-to-feet-chart",
  "how-to-read-a-ruler",
];

test("hub SEO titles are lengthened, unique, and cover the short-title set", () => {
  assert.deepEqual(Object.keys(HUB_SEO_TITLES).sort(), [...expectedSlugs].sort());
  const titles = Object.values(HUB_SEO_TITLES);
  assert.equal(new Set(titles).size, titles.length);
  for (const [slug, title] of Object.entries(HUB_SEO_TITLES)) {
    assert.ok(title.length >= 30, `${slug} title is too short: ${title.length}`);
    assert.ok(title.length <= 70, `${slug} title is longer than needed: ${title.length}`);
    assert.doesNotMatch(title, /#!|\b#1\b|guaranteed|secret/i);
  }
});
