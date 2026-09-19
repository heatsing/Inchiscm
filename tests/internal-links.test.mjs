import assert from "node:assert/strict";
import test from "node:test";

const inchNumeric = /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/;
const cmNumeric = /^\/\d+(?:-\d+)?-cm-in-inches$/;
const heightNumeric = /^\/(?:\d+-\d+-in-cm|\d+-feet-in-cm)$/;

test("keeps height slugs distinct from decimal-inch slugs", () => {
  assert.equal("/6-5-in-cm".match(heightNumeric)?.[0], "/6-5-in-cm");
  assert.equal("/6-5-inches-in-cm".match(inchNumeric)?.[0], "/6-5-inches-in-cm");
  assert.equal(inchNumeric.test("/6-5-in-cm"), false);
  assert.equal(heightNumeric.test("/6-5-inches-in-cm"), false);
  assert.equal(inchNumeric.test("/2-inches-to-cm"), false);
  assert.equal(heightNumeric.test("/5-7-in-cm"), true);
  assert.equal(cmNumeric.test("/25-4-cm-in-inches"), true);
  assert.equal(inchNumeric.test("/1-8-inch-in-cm"), true);
  assert.equal(inchNumeric.test("/fraction-1-8-inch-to-cm"), false);
});

test("uses descriptive feet-and-inches labels rather than decimal-inch wording", () => {
  const heightLabel = `5'7" in cm`;
  const spelledLabel = "5 feet 7 inches in cm";
  const decimalLabel = "6.5 inches in cm";
  assert.match(heightLabel, /5'7"/);
  assert.doesNotMatch(heightLabel, /5\.7 inches/);
  assert.match(spelledLabel, /5 feet 7 inches in cm/);
  assert.doesNotMatch(spelledLabel, /5\.7 inches/);
  assert.match(decimalLabel, /6\.5 inches in cm/);
  assert.doesNotMatch(decimalLabel, /6'5"/);
});
