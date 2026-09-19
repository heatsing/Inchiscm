import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";

const heightSeoSource = fs.readFileSync("src/lib/height-seo.ts", "utf8");
const contentSource = fs.readFileSync("src/data/page-registry/content.tsx", "utf8");

const spotChecks = [
  [6, 11, "210.82"],
  [4, 7, "139.7"],
  [5, 5, "165.1"],
];

test("height SEO helper puts the exact cm result first and keeps height intent", () => {
  assert.match(heightSeoSource, /heightToCm\(feet, inches\)/);
  assert.match(heightSeoSource, /\$\{label\} in CM: \$\{resultText\} cm \| Height/);
  assert.match(heightSeoSource, /\$\{label\} in CM: \$\{resultText\} cm/);
  assert.match(heightSeoSource, /\$\{fullLabel\} = \$\{resultText\} cm/);
  assert.match(heightSeoSource, /height calculator/);
  assert.match(heightSeoSource, /feet and inches/);
  assert.match(heightSeoSource, /ogTitle/);
  assert.doesNotMatch(heightSeoSource, /Feet \d+ Inches to Centimeters/);
  assert.match(contentSource, /heightSeoCopy\(feet, inches\)/);
  assert.doesNotMatch(contentSource, /recoveryHeightCopy/);
});

test("spot-check height pages stay on total inches * 2.54", () => {
  for (const [feet, inches, cm] of spotChecks) {
    const totalInches = feet * 12 + inches;
    assert.equal(Number((totalInches * 2.54).toFixed(4)).toString(), cm);
    assert.equal(Number(convertLength(totalInches, "in", "cm").toFixed(4)).toString(), cm);
  }
});
