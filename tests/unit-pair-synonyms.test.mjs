import assert from "node:assert/strict";
import test from "node:test";
import {
  UNIT_PAIR_SYNONYM_CANONICAL_PATHS,
  UNIT_PAIR_SYNONYM_LOSER_SLUGS,
  UNIT_PAIR_SYNONYM_REDIRECTS,
  formulaGridUnitPairSlugs,
} from "../src/data/page-registry/unit-pair-synonyms.ts";

test("maps each formula-grid synonym to a stronger dedicated converter", () => {
  assert.equal(Object.keys(UNIT_PAIR_SYNONYM_REDIRECTS).length, 13);
  assert.equal(UNIT_PAIR_SYNONYM_REDIRECTS["/inch-to-millimeter"], "/inches-to-mm");
  assert.equal(UNIT_PAIR_SYNONYM_REDIRECTS["/millimeter-to-inch"], "/mm-to-inches");
  assert.equal(UNIT_PAIR_SYNONYM_REDIRECTS["/foot-to-inch"], "/feet-to-inches");
  for (const [from, to] of Object.entries(UNIT_PAIR_SYNONYM_REDIRECTS)) {
    assert.match(from, /^\/[a-z]+-to-[a-z]+$/);
    assert.match(to, /^\/[a-z-]+$/);
    assert.notEqual(from, to);
    assert.equal(from.includes("inches-in-cm"), false);
    assert.equal(from.includes("-in-cm"), false);
    assert.ok(UNIT_PAIR_SYNONYM_LOSER_SLUGS.has(from.slice(1)));
    assert.ok(UNIT_PAIR_SYNONYM_CANONICAL_PATHS.has(to));
  }
});

test("keeps remaining formula-grid unit pairs without backfilling mile-to-kilometer", () => {
  const slugs = formulaGridUnitPairSlugs();
  assert.equal(slugs.length, 40);
  assert.equal(slugs.includes("inch-to-millimeter"), false);
  assert.equal(slugs.includes("mile-to-kilometer"), false);
  assert.ok(slugs.includes("inch-to-yard"));
  assert.ok(slugs.includes("foot-to-centimeter"));
});
