import assert from "node:assert/strict";
import test from "node:test";
import { inchChartRows, inchChartCsv } from "../src/lib/inch-chart-data.ts";

test("inch chart retains all whole inches and uses one row source for CSV", () => {
  assert.equal(inchChartRows.filter((row) => Number.isInteger(row.inches)).length, 100);
  assert.ok(inchChartRows.some((row) => row.label === "1/8 in" && row.cm === 0.3175));
  assert.ok(inchChartRows.some((row) => row.label === "15.6 in" && Math.abs(row.mm - 396.24) < 1e-8));
  assert.equal(inchChartRows.find((row) => row.label === "1.5 in")?.href, "/1-5-inches-in-cm");
  assert.equal(inchChartRows.find((row) => row.label === "15.6 in")?.href, "/15-6-inch-in-cm");
  assert.equal(inchChartRows.find((row) => row.label === "1/8 in")?.href, undefined);
  assert.equal(inchChartCsv.split("\r\n").length, inchChartRows.length + 1);
});
