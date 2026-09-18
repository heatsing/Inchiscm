import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";

const inchNumeric = /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/;
const pages = [
  [1, 8, 0.125, 0.3175],
  [1, 4, 0.25, 0.635],
  [3, 8, 0.375, 0.9525],
  [1, 2, 0.5, 1.27],
  [5, 8, 0.625, 1.5875],
  [3, 4, 0.75, 1.905],
  [7, 8, 0.875, 2.2225],
];

const fractionCmSource = fs.readFileSync("src/lib/fraction-cm.ts", "utf8");
const policy = JSON.parse(fs.readFileSync("seo-page-policy.json", "utf8"));

test("uses the established fraction slug instead of a decimal-inch collision", () => {
  assert.match(fractionCmSource, /\/fraction-\$\{numerator\}-\$\{denominator\}-inch-to-cm/);
  assert.doesNotMatch(fractionCmSource, /\$\{numerator\}-\$\{denominator\}-inch-in-cm/);
  assert.equal(inchNumeric.test("/1-8-inch-in-cm"), true);
  assert.equal(inchNumeric.test("/fraction-1-8-inch-to-cm"), false);
});

test("covers exactly the seven common eighths and uses inch * 2.54", () => {
  assert.equal(pages.length, 7);
  for (const [numerator, denominator, decimal, cm] of pages) {
    const inches = numerator / denominator;
    const slug = `fraction-${numerator}-${denominator}-inch-to-cm`;
    assert.equal(inches, decimal);
    assert.equal(Number((inches * 2.54).toFixed(4)), cm);
    assert.equal(Number(convertLength(inches, "in", "cm").toFixed(4)), cm);
    assert.match(fractionCmSource, new RegExp(`numerator: ${numerator}, denominator: ${denominator}`));
    assert.equal(policy.guidePages.includes(slug), true);
  }
  assert.match(fractionCmSource, /inchesToCm\(inches\)/);
});

test("keeps dedicated fraction cm pages distinct from decimal 0.25/0.5/0.75 landings", () => {
  assert.equal(policy.guidePages.includes("fraction-1-4-inch-to-cm"), true);
  assert.equal(policy.decimalInches.includes(0.25), true);
  assert.notEqual("/fraction-1-4-inch-to-cm", "/0-25-inch-in-cm");
  assert.notEqual("/fraction-1-2-inch-to-cm", "/0-5-inch-in-cm");
  assert.notEqual("/fraction-3-4-inch-to-cm", "/0-75-inch-in-cm");
});

test("does not publish unreduced eighths or expand into 16ths/64ths", () => {
  const unpublished = [
    "fraction-2-8-inch-to-cm",
    "fraction-4-8-inch-to-cm",
    "fraction-6-8-inch-to-cm",
    "fraction-2-16-inch-to-cm",
    "fraction-8-64-inch-to-cm",
  ];
  for (const slug of unpublished) {
    assert.equal(policy.guidePages.includes(slug), false, `${slug} must not be an indexable guide`);
    assert.doesNotMatch(fractionCmSource, new RegExp(slug.replaceAll("-", "\\-")));
  }
  assert.doesNotMatch(fractionCmSource, /numerator: 2, denominator: 8/);
  assert.doesNotMatch(fractionCmSource, /numerator: 4, denominator: 8/);
  assert.doesNotMatch(fractionCmSource, /numerator: 6, denominator: 8/);
  assert.equal(pages.length, 7);
});
