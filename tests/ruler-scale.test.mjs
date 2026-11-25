import assert from "node:assert/strict";
import test from "node:test";
import { clampRulerInches, RULER_MAX_INCHES, snapRulerInches, stepRulerInches } from "../src/lib/ruler-scale.ts";
import { convertLength, decimalInchesToFraction } from "../src/lib/length-units.ts";

test("snaps the visual position to the closest sixteenth only inside the ruler range", () => {
  assert.equal(snapRulerInches(0.66), 0.6875);
  assert.equal(snapRulerInches(3.25), 3.25);
  assert.equal(snapRulerInches(-1), 0);
  assert.equal(snapRulerInches(20), RULER_MAX_INCHES);
  assert.equal(clampRulerInches(0.66), 0.66);
});

test("keyboard stepping moves to the next mark from both exact and arbitrary readings", () => {
  assert.equal(stepRulerInches(1.5, 1), 1.5625);
  assert.equal(stepRulerInches(1.5000000000000002, 1), 1.5625);
  assert.equal(stepRulerInches(1.53, 1), 1.5625);
  assert.equal(stepRulerInches(1.53, -1), 1.5);
  assert.equal(stepRulerInches(1.5, 16), 2.5);
  assert.equal(stepRulerInches(12, 1), 12);
});

test("the two ruler scales and readout describe the same length", () => {
  const inches = snapRulerInches(3.24);
  assert.equal(inches, 3.25);
  assert.equal(decimalInchesToFraction(inches), '3 1/4"');
  assert.equal(Number(convertLength(inches, "in", "cm").toFixed(8)), 8.255);
  assert.equal(Number(convertLength(inches, "in", "mm").toFixed(8)), 82.55);
  assert.equal(Number(convertLength(304.8, "mm", "in").toFixed(8)), RULER_MAX_INCHES);
});
