import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";

const cmSeoSource = fs.readFileSync("src/lib/cm-seo.ts", "utf8");
const contentSource = fs.readFileSync("src/data/page-registry/content.tsx", "utf8");
const pageSource = fs.readFileSync("src/app/[slug]/page.tsx", "utf8");

const spotChecks = [
  [76.2, "30"],
  [50.8, "20"],
  [93, "36.6142"],
  [36, "14.1732"],
];

test("cm SEO helper puts the exact inch result first", () => {
  assert.match(cmSeoSource, /cmToInches\(value\)/);
  assert.match(cmSeoSource, /CM in Inches: \$\{inchWithHeight\}/);
  assert.match(cmSeoSource, /\$\{valueText\} cm equals \$\{inchText\} \$\{inchUnit\}/);
  assert.match(cmSeoSource, /ogTitle/);
  assert.match(cmSeoSource, /cmHeightFeetInchesMark/);
  assert.match(contentSource, /cmSeoCopy\(value\)/);
  assert.match(pageSource, /modules\.height/);
});

test("spot-check reverse cm pages stay on cm / 2.54", () => {
  for (const [cm, inches] of spotChecks) {
    assert.equal(Number((cm / 2.54).toFixed(4)).toString(), inches);
    assert.equal(Number(convertLength(cm, "cm", "in").toFixed(4)).toString(), inches);
  }
});

test("height-cluster reverse cm SEO includes feet-inches marks", () => {
  assert.match(cmSeoSource, /heightMark \? `\$\{inchText\} in \(\$\{heightMark\}\)`/);
  assert.match(cmSeoSource, /CM in Inches: \$\{inchWithHeight\}/);
  assert.match(cmSeoSource, /centimeters is \$\{inchText\} \$\{inchUnit\} \(\$\{heightMark\}\)/);
  assert.match(cmSeoSource, /isPublishedHeight/);
  assert.match(pageSource, /modules\.height\.feet/);
  assert.match(pageSource, /modules\.height\.inches/);

  const cases = [
    [210.82, 6, 11],
    [165.1, 5, 5],
    [177.8, 5, 10],
    [213.36, 7, 0],
  ];
  for (const [cm, feet, inches] of cases) {
    const totalIn = Number(convertLength(cm, "cm", "in").toFixed(4));
    const rounded = Math.round(totalIn);
    assert.ok(Math.abs(totalIn - rounded) < 0.05 || (cm >= 140 && cm <= 210));
    assert.equal(Math.floor(rounded / 12), feet);
    assert.equal(rounded % 12, inches);
  }
});
