import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";

const moduleSource = fs.readFileSync("src/lib/height-page-modules.ts", "utf8");
const pageSource = fs.readFileSync("src/app/[slug]/page.tsx", "utf8");
const contentSource = fs.readFileSync("src/data/page-registry/content.tsx", "utf8");

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
  assert.match(pageSource, /height-answer-hero/);
  assert.match(pageSource, /height-formula-steps/);
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

test("height FAQ helper is capped at three number-specific questions", () => {
  assert.match(moduleSource, /How tall is \$\{label\} in cm\?/);
  assert.match(moduleSource, /How is \$\{label\} converted to centimeters\?/);
  assert.match(moduleSource, /What is \$\{label\} in total inches\?/);
  assert.equal([...moduleSource.matchAll(/question: `/g)].length, 3);
});
