import assert from "node:assert/strict";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";
import { heightExactCmText, heightFullLabel, heightSeoCopy } from "../src/lib/height-seo.ts";

const spotChecks = [
  { feet: 6, inches: 11, cm: "210.82", slug: "6-11-in-cm" },
  { feet: 4, inches: 7, cm: "139.7", slug: "4-7-in-cm" },
  { feet: 5, inches: 5, cm: "165.1", slug: "5-5-in-cm" },
];

test("height SEO copy uses total inches * 2.54 and puts the exact cm first", () => {
  for (const { feet, inches, cm } of spotChecks) {
    const totalInches = feet * 12 + inches;
    const exact = Number((totalInches * 2.54).toFixed(4)).toString();
    assert.equal(exact, cm);
    assert.equal(Number(convertLength(totalInches, "in", "cm").toFixed(4)).toString(), cm);
    assert.equal(heightExactCmText(feet, inches), cm);

    const copy = heightSeoCopy(feet, inches);
    assert.equal(copy.totalInches, totalInches);
    assert.equal(copy.resultText, cm);
    assert.equal(copy.title, `${feet}'${inches}" in CM: ${cm} cm | Height`);
    assert.equal(copy.ogTitle, copy.title);
    assert.equal(copy.h1, `${feet}'${inches}" in CM: ${cm} cm`);
    assert.equal(copy.description.startsWith(`${heightFullLabel(feet, inches)} = ${cm} cm.`), true);
    assert.match(copy.description, /height calculator/i);
    assert.match(copy.description, /feet and inches/i);
    assert.match(copy.directAnswer, new RegExp(`${cm} centimeters`));
    assert.doesNotMatch(copy.title, /Feet \d+ Inches to Centimeters/);
  }
});

test("whole-foot height pages keep height intent without changing slugs", () => {
  const copy = heightSeoCopy(6, 0);
  assert.equal(copy.label, "6 feet");
  assert.equal(copy.fullLabel, "6 feet");
  assert.equal(copy.resultText, "182.88");
  assert.equal(copy.title, "6 feet in CM: 182.88 cm | Height");
  assert.equal(copy.description.startsWith("6 feet = 182.88 cm."), true);
});
