import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { convertLength } from "../src/lib/length-units.ts";

const cmSeoSource = fs.readFileSync("src/lib/cm-seo.ts", "utf8");
const contentSource = fs.readFileSync("src/data/page-registry/content.tsx", "utf8");

const spotChecks = [
  [76.2, "30"],
  [50.8, "20"],
  [93, "36.6142"],
  [36, "14.1732"],
];

test("cm SEO helper puts the exact inch result first", () => {
  assert.match(cmSeoSource, /cmToInches\(value\)/);
  assert.match(cmSeoSource, /\$\{valueText\} CM in Inches: \$\{inchText\} in \| CM Converter/);
  assert.match(cmSeoSource, /\$\{valueText\} CM in Inches: \$\{inchText\} in/);
  assert.match(cmSeoSource, /\$\{valueText\} cm equals \$\{inchText\} \$\{inchUnit\}/);
  assert.match(cmSeoSource, /ogTitle/);
  assert.match(contentSource, /cmSeoCopy\(value\)/);
});

test("spot-check reverse cm pages stay on cm / 2.54", () => {
  for (const [cm, inches] of spotChecks) {
    assert.equal(Number((cm / 2.54).toFixed(4)).toString(), inches);
    assert.equal(Number(convertLength(cm, "cm", "in").toFixed(4)).toString(), inches);
  }
});
