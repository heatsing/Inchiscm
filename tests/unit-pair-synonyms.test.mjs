import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  firstMatchingPathRedirect,
  formatNetlifyRedirectsFile,
  publishedPathRedirects,
} from "../src/data/page-registry/inch-alias-redirects.mjs";

const UNIT_PAIR_SYNONYM_REDIRECTS = JSON.parse(
  fs.readFileSync("src/data/page-registry/unit-pair-synonyms.json", "utf8"),
);

function formulaGridUnitPairSlugs() {
  const units = ["inch", "centimeter", "millimeter", "foot", "yard", "meter", "kilometer", "mile"];
  const losers = new Set(Object.keys(UNIT_PAIR_SYNONYM_REDIRECTS).map((path) => path.slice(1)));
  const pairs = [];
  for (const from of units) {
    for (const to of units) {
      if (from === to) continue;
      if (from === "inch" && to === "centimeter") continue;
      if (from === "centimeter" && to === "inch") continue;
      pairs.push(`${from}-to-${to}`);
    }
  }
  return pairs.slice(0, 53).filter((slug) => !losers.has(slug));
}

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
    assert.equal(/\/\d/.test(from), false);
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

test("emits synonym 301s into _redirects above the missing-path 404 fallback", () => {
  const rules = publishedPathRedirects();
  const parsed = rules.concat([{ from: "/*", to: "/404.html", status: 404 }]);
  const formatted = formatNetlifyRedirectsFile(rules);
  for (const [from, to] of Object.entries(UNIT_PAIR_SYNONYM_REDIRECTS)) {
    const rule = rules.find((item) => item.from === from);
    assert.equal(rule?.to, to);
    assert.equal(rule?.status, 301);
    assert.match(formatted, new RegExp(`${from}  ${to}  301`));
    const hit = firstMatchingPathRedirect(from, parsed);
    assert.equal(hit?.status, 301);
    assert.equal(hit?.to, to);
  }
});
