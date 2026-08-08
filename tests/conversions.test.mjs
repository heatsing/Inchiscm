import assert from "node:assert/strict";
import test from "node:test";
import {
  conversionFactor,
  convertLength,
  decimalInchesToFeetAndInches,
  decimalInchesToFraction,
  formatLength,
  parseLengthInput,
} from "../src/lib/length-units.ts";
import { calculatePpi, formatPpi } from "../src/lib/display-math.ts";
import { calculateScreenDimensions, getAspectRatio } from "../src/lib/screen-dimensions.ts";

function closeTo(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be close to ${expected}`);
}

test("uses approved exact length conversion factors", () => {
  closeTo(convertLength(1, "in", "cm"), 2.54);
  closeTo(convertLength(1, "ft", "cm"), 30.48);
  closeTo(convertLength(1, "yd", "m"), 0.9144);
  closeTo(convertLength(1, "mi", "km"), 1.609344);
  closeTo(convertLength(1, "m", "mm"), 1000);
  closeTo(conversionFactor("cm", "in"), 1 / 2.54);
});

test("converts and displays height through the shared inch conversion", () => {
  const heightCm = convertLength(5 * 12 + 8, "in", "cm");
  closeTo(heightCm, 172.72);
  assert.equal(formatLength(heightCm, 4), "172.72");
  assert.equal(decimalInchesToFeetAndInches(68), "5 ft 8 in");
  assert.equal(decimalInchesToFraction(15.5), '15 1/2"');
});

test("verifies representative proven cohort conversions", () => {
  closeTo(convertLength(24, "in", "cm"), 60.96);
  closeTo(convertLength(6 * 12 + 11, "in", "cm"), 210.82);
  closeTo(convertLength(4 * 12 + 7, "in", "cm"), 139.7);
  closeTo(convertLength(93, "cm", "in"), 36.61417322834646);
  closeTo(convertLength(36, "cm", "in"), 14.173228346456694);
  assert.equal(formatLength(convertLength(93, "cm", "in"), 4), "36.6142");
  assert.equal(decimalInchesToFraction(convertLength(36, "cm", "in")), '14 3/16"');
});

test("reduces fractional inch output and handles rounding boundaries", () => {
  assert.equal(decimalInchesToFraction(0.25), '1/4"');
  assert.equal(decimalInchesToFraction(0.5), '1/2"');
  assert.equal(decimalInchesToFraction(1.999), '2"');
  assert.equal(decimalInchesToFraction(36.61417322834646), '36 5/8"');
});

test("parses decimal, mixed, hyphenated, and unicode fraction inputs", () => {
  assert.equal(parseLengthInput("1.5"), 1.5);
  assert.equal(parseLengthInput("1/2"), 0.5);
  assert.equal(parseLengthInput("1 1/2"), 1.5);
  assert.equal(parseLengthInput("1-1/2"), 1.5);
  assert.equal(parseLengthInput("½"), 0.5);
  assert.equal(parseLengthInput("2½"), 2.5);
  assert.equal(parseLengthInput("1/0"), null);
  assert.equal(parseLengthInput("abc"), null);
});

test("preserves zero and handles very small display values", () => {
  assert.equal(convertLength(0, "in", "cm"), 0);
  assert.equal(formatLength(0), "0");
  assert.equal(formatLength(convertLength(1, "mm", "mi")), "0.00000062");
});

test("calculates screen dimensions for supported aspect ratios", () => {
  for (const ratioName of ["16:9", "16:10", "3:2", "4:3"]) {
    const ratio = getAspectRatio(ratioName);
    const dimensions = calculateScreenDimensions(15.6, ratio.width, ratio.height);
    closeTo(Math.hypot(dimensions.widthInches, dimensions.heightInches), 15.6);
    closeTo(dimensions.diagonalCm, 39.624);
    closeTo(dimensions.widthCm, dimensions.widthInches * 2.54);
    closeTo(dimensions.heightCm, dimensions.heightInches * 2.54);
  }
});

test("calculates screen PPI from resolution and diagonal", () => {
  const ppi = calculatePpi(1920, 1080, 24);
  closeTo(ppi, 91.7877987534291);
  assert.equal(formatPpi(ppi), "91.79");
  assert.equal(calculatePpi(0, 1080, 24), null);
});
