import assert from "node:assert/strict";
import test from "node:test";
import { compareScreens, parseScreenComparisonHash, screenComparisonHash } from "../src/lib/screen-dimensions.ts";

test("comparison computes physical area and screen-1-relative differences", () => {
  const result = compareScreens([{ diagonal: "27", ratio: "16:9" }, { diagonal: "34", ratio: "21:9" }]);
  assert.ok(result);
  assert.ok(Math.abs(result.second.widthCm - 79.38) < 0.01);
  assert.ok(Math.abs(result.second.heightCm - 34.02) < 0.01);
  assert.ok(Math.abs(result.second.areaCm2 - result.second.widthCm * result.second.heightCm) < 1e-8);
  assert.ok(Math.abs(result.width.percent - result.width.difference / result.first.widthCm * 100) < 1e-8);
});

test("comparison fragment round-trips and rejects malformed or overflowing input", () => {
  const screens = [{ diagonal: "27", ratio: "16:9" }, { diagonal: "34", ratio: "21:9" }];
  assert.deepEqual(parseScreenComparisonHash(screenComparisonHash(screens)), screens);
  for (const value of ["#compare=NaN,16:9;34,21:9", "#compare=0,16:9;34,21:9", "#compare=27,99:9;34,21:9", "#compare=1e309,16:9;34,21:9", "#compare=27,16:9;34,21:9&x=1"]) {
    assert.equal(parseScreenComparisonHash(value), null);
  }
  assert.equal(compareScreens([{ diagonal: "", ratio: "16:9" }, { diagonal: "34", ratio: "21:9" }]), null);
});
