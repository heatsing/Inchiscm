import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  aliasPathsForCmValue,
  allCmValues,
  allHeights,
  cmSlug,
  heightSlug,
} from "../src/data/page-registry/inch-alias-redirects.mjs";

// Exact cm of GSC-priority and common adult heights that were missing reverse pages.
// Whole-foot 7'0" uses /7-feet-in-cm; every other pair uses /{F}-{I}-in-cm.
const HEIGHT_CLUSTER_REVERSE_CM = [
  [147.32, 4, 10, "/147-32-cm-in-inches"],
  [149.86, 4, 11, "/149-86-cm-in-inches"],
  [154.94, 5, 1, "/154-94-cm-in-inches"],
  [157.48, 5, 2, "/157-48-cm-in-inches"],
  [160.02, 5, 3, "/160-02-cm-in-inches"],
  [162.56, 5, 4, "/162-56-cm-in-inches"],
  [165.1, 5, 5, "/165-1-cm-in-inches"],
  [167.64, 5, 6, "/167-64-cm-in-inches"],
  [170.18, 5, 7, "/170-18-cm-in-inches"],
  [172.72, 5, 8, "/172-72-cm-in-inches"],
  [175.26, 5, 9, "/175-26-cm-in-inches"],
  [177.8, 5, 10, "/177-8-cm-in-inches"],
  [180.34, 5, 11, "/180-34-cm-in-inches"],
  [185.42, 6, 1, "/185-42-cm-in-inches"],
  [187.96, 6, 2, "/187-96-cm-in-inches"],
  [190.5, 6, 3, "/190-5-cm-in-inches"],
  [193.04, 6, 4, "/193-04-cm-in-inches"],
  [195.58, 6, 5, "/195-58-cm-in-inches"],
  [198.12, 6, 6, "/198-12-cm-in-inches"],
  [200.66, 6, 7, "/200-66-cm-in-inches"],
  [203.2, 6, 8, "/203-2-cm-in-inches"],
  [205.74, 6, 9, "/205-74-cm-in-inches"],
  [208.28, 6, 10, "/208-28-cm-in-inches"],
  [210.82, 6, 11, "/210-82-cm-in-inches"],
  [213.36, 7, 0, "/213-36-cm-in-inches"],
  [215.9, 7, 1, "/215-9-cm-in-inches"],
];

test("height-cluster reverse cm values are an approved sorted set of 26 pages", () => {
  const policy = JSON.parse(fs.readFileSync("seo-page-policy.json", "utf8"));
  const approved = policy.approvedReverseCentimeters;
  assert.equal(HEIGHT_CLUSTER_REVERSE_CM.length, 26);
  assert.equal(new Set(approved).size, approved.length);
  assert.equal(policy.heightMinTotalInches, 36);
  assert.equal(policy.heightMaxTotalInches, 96);
  assert.equal(policy.maxProgrammaticPages, 563);
  assert.equal(policy.minimumIndexableRouteCount, 581);

  const indexes = HEIGHT_CLUSTER_REVERSE_CM.map(([cm]) => approved.indexOf(cm));
  assert.deepEqual(indexes, [...indexes].sort((left, right) => left - right));
  assert.ok(indexes.every((index) => index >= 0));

  const published = new Set(allCmValues());
  const heights = new Set(allHeights().map(({ feet, inches }) => heightSlug(feet, inches)));
  for (const [cm, feet, inches, canonical] of HEIGHT_CLUSTER_REVERSE_CM) {
    assert.equal(cmSlug(cm), canonical);
    assert.equal(published.has(cm), true, `${cm} must be a published cm value`);
    const heightPath = inches === 0 ? `/${feet}-feet-in-cm` : `/${feet}-${inches}-in-cm`;
    assert.equal(heightSlug(feet, inches), heightPath);
    assert.equal(heights.has(heightPath), true, `${heightPath} must stay inside 3'0\"–8'0\"`);
    const aliases = aliasPathsForCmValue(cm);
    const hyphen = String(cm).replace(".", "-");
    assert.equal(aliases.includes(`/${hyphen}-cm-to-inches`), true);
    assert.equal(aliases.includes(`/${hyphen}-cm-to-inch`), true);
    assert.equal(aliases.includes(`/${cm}-cm-in-inches`), true);
    assert.equal(aliases.includes(`/${cm}-cm-to-inches`), true);
    assert.equal(aliases.includes(canonical), false);
  }
});
