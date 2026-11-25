import assert from "node:assert/strict";
import test from "node:test";
import {
  convertProductDimensions,
  dimensionAspectRatio,
  dimensionMeasures,
  dimensionValueIsRounded,
  parseDimensionsInput,
  parseDimensionSide,
  parseDimensionShareHash,
} from "../src/lib/product-dimensions.ts";

test("dimension fragments restore only valid same-unit 2D or 3D input", () => {
  assert.deepEqual(parseDimensionShareHash("#size=10x15-in", "in"), [10, 15]);
  assert.deepEqual(parseDimensionShareHash("#size=22x14x9-in", "in"), [22, 14, 9]);
  assert.equal(parseDimensionShareHash("#size=10x15-cm", "in"), null);
  assert.equal(parseDimensionShareHash("#size=-10x15-in", "in"), null);
  assert.equal(parseDimensionShareHash("#size=1e309x15-in", "in"), null);
});

test("parses two or three dimensions without adding a zero height", () => {
  assert.deepEqual(parseDimensionsInput("10 x 15", "in"), [10, 15]);
  assert.deepEqual(parseDimensionsInput("22 × 14 × 9", "in"), [22, 14, 9]);
  assert.deepEqual(parseDimensionsInput(" 2.5 X .75 inches ", "in"), [2.5, .75]);
  assert.deepEqual(parseDimensionsInput('8" x 10"', "in"), [8, 10]);
  assert.deepEqual(parseDimensionsInput("25.4 cm × 38.1 cm", "cm"), [25.4, 38.1]);
});

test("rejects malformed sizes and mismatched units instead of silently converting them", () => {
  for (const value of ["", "10", "10x", "x15", "10xx15", "10x15x20x25", "-10x15", "0x15", "NaN x 15", "Infinity x 15", "1e309 x 15", "10x15junk", "1,000x15", "10cm x 15", "10 x 15 cm"]) {
    assert.equal(parseDimensionsInput(value, "in"), null, value);
  }
  assert.equal(parseDimensionsInput("10 in x 15 cm", "cm"), null);
});

test("validates every individual dimension including overflow", () => {
  assert.equal(parseDimensionSide(".5"), .5);
  assert.equal(parseDimensionSide("1e2"), 100);
  for (const value of ["", " ", "-1", "0", "Infinity", "NaN", "1e309", "0x10", "10 cm"]) {
    assert.equal(parseDimensionSide(value), null, value);
  }
});

test("converts each side using exactly 2.54 and preserves two-dimensional results", () => {
  const close = (actual, expected) => expected.forEach((value, index) => assert.ok(Math.abs(actual[index] - value) < 1e-10));
  close(convertProductDimensions([10, 15], "in-to-cm"), [25.4, 38.1]);
  close(convertProductDimensions([22, 14, 9], "in-to-cm"), [55.88, 35.56, 22.86]);
  close(convertProductDimensions([12, 12], "in-to-cm"), [30.48, 30.48]);
  close(convertProductDimensions([2, 2], "in-to-cm"), [5.08, 5.08]);
  close(convertProductDimensions([55.88, 35.56, 22.86], "cm-to-in"), [22, 14, 9]);
  assert.equal(convertProductDimensions([10, 15], "in-to-cm").length, 2);
});

test("does not emit negative, non-finite, or overflowing results", () => {
  for (const values of [[], [10], [1, 2, 3, 4], [0, 15], [-1, 15], [NaN, 15], [Infinity, 15], [Number.MAX_VALUE, 15]]) {
    assert.equal(convertProductDimensions(values, "in-to-cm"), null);
  }
  assert.equal(convertProductDimensions([Number.MIN_VALUE, 15], "cm-to-in"), null);
});

test("2D measurements retain exact area and reduced width-to-height ratios", () => {
  const frame = dimensionMeasures([8, 10], "in-to-cm");
  assert.deepEqual(frame, {
    mode: 2,
    converted: [20.32, 25.4],
    sourceMeasure: 80,
    targetMeasure: 516.128,
    liters: null,
    ratio: "4:5",
  });
  const print = dimensionMeasures([4, 6], "in-to-cm");
  assert.deepEqual(print.converted, [10.16, 15.24]);
  assert.equal(print.targetMeasure, 154.8384);
  assert.equal(print.ratio, "2:3");
  assert.equal(dimensionAspectRatio(8.5, 11), "17:22");
  assert.equal(dimensionAspectRatio(0, 4), null);
  assert.equal(dimensionValueIsRounded(frame.targetMeasure, 6), false);
  const metricFrame = dimensionMeasures([20, 30], "cm-to-in");
  assert.equal(metricFrame.ratio, "2:3");
  assert.equal(Number(metricFrame.targetMeasure.toFixed(6)), 93.000186);
  assert.ok(metricFrame.converted.every((side) => dimensionValueIsRounded(side, 4)));
});

test("3D measurements use cubic units and preserve exact liter conversions", () => {
  const caseSize = dimensionMeasures([22, 14, 9], "in-to-cm");
  assert.deepEqual(caseSize, {
    mode: 3,
    converted: [55.88, 35.56, 22.86],
    sourceMeasure: 2_772,
    targetMeasure: 45_424.941408,
    liters: 45.424941408,
    ratio: null,
  });
  const metricBox = dimensionMeasures([40, 30, 20], "cm-to-in");
  assert.equal(metricBox.sourceMeasure, 24_000);
  assert.equal(metricBox.liters, 24);
  assert.equal(Number(metricBox.targetMeasure.toFixed(6)), 1_464.569858);
  assert.ok(metricBox.converted.every((side) => dimensionValueIsRounded(side, 4)));
  assert.equal(dimensionValueIsRounded(caseSize.liters, 9), false);
  assert.equal(dimensionMeasures([1e200, 1e200], "in-to-cm"), null);
});
