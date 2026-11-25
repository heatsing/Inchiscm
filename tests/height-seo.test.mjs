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
  [5, 4, "162.56"],
];

test("height SEO helper includes the exact cm result, conversion intent, and brand", () => {
  assert.match(heightSeoSource, /heightToCm\(feet, inches\)/);
  assert.match(heightSeoSource, /\$\{feet\}'\$\{inches\}"/);
  assert.doesNotMatch(heightSeoSource, /&#x27;|&quot;|&apos;/);
  assert.match(heightSeoSource, /feet === 5 && inches === 3 \? "CM" : "cm"/);
  assert.match(heightSeoSource, /\$\{label\} in \$\{titleUnit\}: \$\{resultText\} cm \(Height Conversion\) \| InchisCm/);
  assert.match(heightSeoSource, /\$\{label\} in CM: \$\{resultText\} cm/);
  assert.match(heightSeoSource, /How tall is \$\{label\} in cm\?/);
  assert.match(heightSeoSource, /total inches/);
  assert.match(heightSeoSource, /× 2\.54/);
  assert.match(heightSeoSource, /\$\{label\} \(\$\{fullLabel\}\) is exactly \$\{resultText\} cm/);
  assert.doesNotMatch(heightSeoSource, /height calculator/);
  assert.doesNotMatch(heightSeoSource, /Use the height calculator/);
  assert.match(heightSeoSource, /ogTitle/);
  assert.doesNotMatch(heightSeoSource, /Feet \d+ Inches to Centimeters/);
  assert.match(contentSource, /heightSeoCopy\(feet, inches\)/);
  assert.doesNotMatch(contentSource, /recoveryHeightCopy/);
});

test("inch page metadata includes the exact cm and mm results and length conversion intent", () => {
  assert.match(contentSource, /\$\{valueText\} \$\{unit\} in cm: \$\{cmText\} cm \(Length Conversion\) \| InchisCm/);
  assert.match(contentSource, /\$\{valueText\} \$\{unitLower\} = \$\{cmText\} cm exactly \(\$\{metaMmText\} mm\)\. \$\{descriptionContext\}/);
  assert.match(contentSource, /How many centimeters are in \$\{valueText\} \$\{unitLower\}\? Convert with inches × 2\.54\./);
});

test("spot-check height pages stay on total inches * 2.54", () => {
  for (const [feet, inches, cm] of spotChecks) {
    const totalInches = feet * 12 + inches;
    assert.equal(Number((totalInches * 2.54).toFixed(4)).toString(), cm);
    assert.equal(Number(convertLength(totalInches, "in", "cm").toFixed(4)).toString(), cm);
  }
});
