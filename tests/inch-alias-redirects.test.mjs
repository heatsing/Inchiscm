import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS,
  HEIGHT_CURLY_APOSTROPHE,
  INCH_ALIAS_SUFFIXES,
  LEGACY_HUB_REDIRECTS,
  MISSING_PATH_404_FALLBACK,
  PROTECTED_HEIGHT_PATHS,
  UNKNOWN_PATH_SAMPLES,
  UNPUBLISHED_FRACTION_CM_ALIAS_SAMPLES,
  UNPUBLISHED_HEIGHT_ALIAS_SAMPLES,
  UNPUBLISHED_INCH_ALIAS_SAMPLES,
  aliasPathsForHeight,
  allHeights,
  allInchValues,
  firstMatchingPathRedirect,
  formatNetlifyRedirectsFile,
  heightSlug,
  inchSlug,
  isHostScopedRedirect,
  isMissingPath404Fallback,
  isOpenPathSplat,
  isPathLevelRedirectSplat,
  netlifyPathRuleMatches,
  parseNetlifyRedirectsFile,
  parseNetlifyTomlRedirects,
  publishedHeightAliasRedirects,
  publishedHeightCanonicals,
  publishedInchAliasRedirects,
  publishedInchCanonicals,
  publishedPathRedirects,
  unitPairSynonymRedirects,
} from "../src/data/page-registry/inch-alias-redirects.mjs";

const UNIT_PAIR_SYNONYM_REDIRECTS = JSON.parse(
  fs.readFileSync("src/data/page-registry/unit-pair-synonyms.json", "utf8"),
);

const redirects = publishedInchAliasRedirects();
const heightRedirects = publishedHeightAliasRedirects();
const pathRedirects = publishedPathRedirects({ inchRedirects: redirects, heightRedirects });
const redirectMap = new Map(redirects.map((rule) => [rule.from, rule.to]));
const heightRedirectMap = new Map(heightRedirects.map((rule) => [rule.from, rule.to]));
const pathRedirectMap = new Map(pathRedirects.map((rule) => [rule.from, rule.to]));
const canonicals = new Set(publishedInchCanonicals());
const heightCanonicals = new Set(publishedHeightCanonicals());
const generatedRules = parseNetlifyRedirectsFile(formatNetlifyRedirectsFile(pathRedirects));

test("inchSlug helpers stay aligned with conversions.ts", () => {
  const source = fs.readFileSync("src/lib/conversions.ts", "utf8");
  assert.match(source, /String\(value\)\.replace\("\.", "-"\)/);
  assert.match(
    source,
    /value === 1 \|\| value < 1 \|\| \(!Number\.isInteger\(value\) && screenInches\.includes\(value\)\) \? "inch" : "inches"/,
  );
  assert.equal(inchSlug(1), "/1-inch-in-cm");
  assert.equal(inchSlug(2), "/2-inches-in-cm");
  assert.equal(inchSlug(0.5), "/0-5-inch-in-cm");
  assert.equal(inchSlug(21.5), "/21-5-inch-in-cm");
  assert.equal(inchSlug(24), "/24-inches-in-cm");
});

test("heightSlug helpers stay aligned with conversions.ts and the published height set", () => {
  const source = fs.readFileSync("src/lib/conversions.ts", "utf8");
  assert.match(source, /inches === 0 \? `\/\$\{feet\}-feet-in-cm` : `\/\$\{feet\}-\$\{inches\}-in-cm`/);
  assert.match(source, /heightMinTotalInches/);
  assert.match(source, /heightMaxTotalInches/);
  assert.equal(heightSlug(5, 7), "/5-7-in-cm");
  assert.equal(heightSlug(6, 0), "/6-feet-in-cm");
  assert.equal(heightSlug(4, 10), "/4-10-in-cm");
  const heights = allHeights();
  assert.equal(heights.length, 61);
  assert.deepEqual(heights[0], { feet: 3, inches: 0 });
  assert.deepEqual(heights.at(-1), { feet: 8, inches: 0 });
  assert.equal(heights.some((height) => height.feet === 5 && height.inches === 7), true);
  assert.equal(heights.some((height) => height.feet === 8 && height.inches === 1), false);
  assert.equal(heightCanonicals.has("/5-7-in-cm"), true);
  assert.equal(heightCanonicals.has("/6-feet-in-cm"), true);
});

test("published inch to-cm aliases 301 one hop to the canonical in-cm slug", () => {
  const samples = [
    ["/1-inches-to-cm", "/1-inch-in-cm"],
    ["/1-inch-to-cm", "/1-inch-in-cm"],
    ["/2-inches-to-cm", "/2-inches-in-cm"],
    ["/2-inch-to-cm", "/2-inches-in-cm"],
    ["/5-inches-to-cm", "/5-inches-in-cm"],
    ["/10-inches-to-cm", "/10-inches-in-cm"],
    ["/12-inches-to-cm", "/12-inches-in-cm"],
    ["/0-5-inch-to-cm", "/0-5-inch-in-cm"],
    ["/0-5-inches-to-cm", "/0-5-inch-in-cm"],
    ["/24-inches-to-cm", "/24-inches-in-cm"],
    ["/24-inches-in-centimeters", "/24-inches-in-cm"],
    ["/21-5-inch-to-cm", "/21-5-inch-in-cm"],
  ];
  for (const [from, to] of samples) {
    assert.equal(redirectMap.get(from), to, `${from} should 301 to ${to}`);
    assert.equal(redirectMap.has(to), false, `${to} must remain the canonical, not a redirect source`);
    assert.ok(canonicals.has(to), `${to} must be a published inch canonical`);
  }
});

test("alias rules are a closed set of already published inch values", () => {
  const values = allInchValues();
  assert.ok(values.includes(1) && values.includes(2) && values.includes(0.5));
  assert.equal(values.includes(999999), false);
  assert.equal(values.includes(5.7), false);
  assert.equal(redirects.length, values.length * (INCH_ALIAS_SUFFIXES.length - 1));
  for (const { from, to, status } of redirects) {
    assert.equal(status, 301);
    assert.match(from, /^\/\d+(?:-\d+)?-(?:inch|inches)-(?:to-cm|in-cm|in-centimeters)$/);
    assert.match(to, /^\/\d+(?:-\d+)?-(?:inch|inches)-in-cm$/);
    assert.notEqual(from, to);
    assert.equal(from.includes("*"), false);
    assert.equal(from.includes(":"), false);
    assert.ok(canonicals.has(to), `target ${to} is not a published canonical`);
    assert.equal(canonicals.has(from), false, `must not redirect live canonical ${from}`);
    assert.equal(redirectMap.has(to), false, `redirect chain through ${to}`);
  }
});

test("unpublished and height URLs are not given an open redirect surface", () => {
  for (const alias of UNPUBLISHED_INCH_ALIAS_SAMPLES) {
    assert.equal(redirectMap.has(alias), false, `${alias} must stay 404`);
  }
  for (const height of PROTECTED_HEIGHT_PATHS) {
    assert.equal(redirectMap.has(height), false, `${height} must not be redirected`);
  }
  assert.equal(redirects.some((rule) => /^\/\d+-\d+-in-cm$/.test(rule.from)), false);
  assert.equal(redirects.some((rule) => /^\/\d+-feet-in-cm$/.test(rule.from)), false);
});

test("Netlify /*/ is an open path splat that would 301 unpublished aliases onto themselves", () => {
  assert.equal(isOpenPathSplat("/*/"), true);
  assert.equal(isOpenPathSplat("/*"), true);
  assert.equal(isOpenPathSplat("/:splat"), true);
  assert.equal(isOpenPathSplat("https://www.inchiscm.com/*"), false);
  assert.equal(isOpenPathSplat("/2-inches-to-cm"), false);
  assert.equal(netlifyPathRuleMatches("/999999-inches-to-cm", "/*/"), true);
  assert.equal(netlifyPathRuleMatches("/999999-inches-to-cm/", "/*/"), true);
  assert.equal(netlifyPathRuleMatches("/2-inches-to-cm", "/2-inches-to-cm"), true);
  assert.equal(netlifyPathRuleMatches("/2-inches-to-cm/", "/2-inches-to-cm"), true);
  assert.equal(netlifyPathRuleMatches("/999999-inches-to-cm", "/2-inches-to-cm"), false);
});

test("combined netlify.toml and published path rules keep unpublished aliases unmatched", () => {
  const tomlRules = parseNetlifyTomlRedirects(fs.readFileSync("netlify.toml", "utf8"));
  assert.equal(tomlRules.some((rule) => isOpenPathSplat(rule.from)), false);
  assert.equal(tomlRules.every((rule) => isHostScopedRedirect(rule.from)), true);
  const combined = [...generatedRules, ...tomlRules];
  for (const alias of UNPUBLISHED_INCH_ALIAS_SAMPLES) {
    const hit = firstMatchingPathRedirect(alias, combined);
    assert.equal(isMissingPath404Fallback(hit), true, `${alias} must stay a hard 404`);
    assert.equal(firstMatchingPathRedirect(`${alias}/`, combined)?.status, 404, `${alias}/ must stay a hard 404`);
  }
  assert.equal(firstMatchingPathRedirect("/2-inches-to-cm", combined)?.to, "/2-inches-in-cm");
  assert.equal(firstMatchingPathRedirect("/2-inches-to-cm/", combined)?.to, "/2-inches-in-cm");
  assert.equal(firstMatchingPathRedirect("/1-inch-to-cm", combined)?.to, "/1-inch-in-cm");
  assert.equal(firstMatchingPathRedirect("/1-inches-in-cm", combined)?.to, "/1-inch-in-cm");
});

test("unknown paths hard-404 via a terminal /* /404.html fallback after published 301s", () => {
  const tomlRules = parseNetlifyTomlRedirects(fs.readFileSync("netlify.toml", "utf8"));
  assert.equal(isMissingPath404Fallback(generatedRules.at(-1)), true);
  assert.equal(generatedRules.filter(isMissingPath404Fallback).length, 1);
  assert.equal(generatedRules.filter((rule) => rule.status === 301).length, pathRedirects.length);
  assert.equal(generatedRules.some(isPathLevelRedirectSplat), false);
  assert.equal(tomlRules.some((rule) => isOpenPathSplat(rule.from)), false);
  assert.equal(tomlRules.some((rule) => !isHostScopedRedirect(rule.from)), false);

  const combined = [...generatedRules, ...tomlRules];
  for (const pathname of UNKNOWN_PATH_SAMPLES) {
    const hit = firstMatchingPathRedirect(pathname, combined);
    assert.equal(isMissingPath404Fallback(hit), true, `${pathname} must hard-404`);
    assert.equal(firstMatchingPathRedirect(`${pathname}/`, combined)?.status, 404);
  }

  const published = firstMatchingPathRedirect("/2-inches-to-cm", combined);
  assert.equal(published?.to, "/2-inches-in-cm");
  assert.equal(published?.status, 301);
  assert.equal(isMissingPath404Fallback(published), false);
});

test("published path 301s including unit synonyms win one hop before the 404 fallback", () => {
  const samples = [
    ["/1-inch-to-cm", "/1-inch-in-cm"],
    ["/1-inches-in-cm", "/1-inch-in-cm"],
    ["/2-inches-to-cm", "/2-inches-in-cm"],
    ["/inches-to-centimeters", "/inches-to-cm"],
    ["/centimeters-to-inches", "/cm-to-inches"],
    ...FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS.map((rule) => [rule.from, rule.to]),
    ...Object.entries(UNIT_PAIR_SYNONYM_REDIRECTS),
    ["/5-feet-7-inches-in-cm", "/5-7-in-cm"],
    ["/5-foot-7-inches-in-cm", "/5-7-in-cm"],
    ["/6-11-to-cm", "/6-11-in-cm"],
    ["/6-11-en-cm", "/6-11-in-cm"],
    ["/6-11-a-cm", "/6-11-in-cm"],
  ];
  for (const [from, to] of samples) {
    assert.equal(pathRedirectMap.get(from), to, `${from} should be generated as 301 to ${to}`);
    const hit = firstMatchingPathRedirect(from, generatedRules);
    assert.equal(hit?.to, to, `${from} should 301 to ${to}`);
    assert.equal(hit?.status, 301);
    assert.equal(isMissingPath404Fallback(hit), false);
  }
  assert.equal(unitPairSynonymRedirects().length, 13);
  assert.equal(LEGACY_HUB_REDIRECTS.length, 2);
  assert.equal(FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS.length, 3);
  assert.equal(
    pathRedirects.length,
    redirects.length
      + heightRedirects.length
      + 13
      + LEGACY_HUB_REDIRECTS.length
      + FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS.length,
  );
});

test("published height feet/foot aliases 301 one hop to the canonical height slug", () => {
  const samples = [
    ["/5-feet-7-inches-in-cm", "/5-7-in-cm"],
    ["/5-foot-7-inches-in-cm", "/5-7-in-cm"],
    ["/5-feet-7-inch-in-cm", "/5-7-in-cm"],
    ["/5-foot-7-inch-in-cm", "/5-7-in-cm"],
    ["/5-feet-7-in-cm", "/5-7-in-cm"],
    ["/5-foot-7-in-cm", "/5-7-in-cm"],
    ["/5-feet-1-inch-in-cm", "/5-1-in-cm"],
    ["/5-foot-1-inches-in-cm", "/5-1-in-cm"],
    ["/6-foot-in-cm", "/6-feet-in-cm"],
    ["/6-feet-0-inches-in-cm", "/6-feet-in-cm"],
    ["/6-foot-0-inches-in-cm", "/6-feet-in-cm"],
    ["/4-foot-7-inches-in-cm", "/4-7-in-cm"],
    ["/4-foot-7-in-cm", "/4-7-in-cm"],
    ["/6-feet-11-inches-in-cm", "/6-11-in-cm"],
    ["/6-11-feet-in-cm", "/6-11-in-cm"],
    ["/6-11-foot-in-cm", "/6-11-in-cm"],
    ["/6ft11-in-cm", "/6-11-in-cm"],
    ["/6ft-11-in-cm", "/6-11-in-cm"],
    ["/6ft-11in-in-cm", "/6-11-in-cm"],
    ["/6ft11in-in-cm", "/6-11-in-cm"],
    ["/6ft11in-cm", "/6-11-in-cm"],
    ["/6-ft-11-in-cm", "/6-11-in-cm"],
    ["/6'11-in-cm", "/6-11-in-cm"],
    [`/6${HEIGHT_CURLY_APOSTROPHE}11-in-cm`, "/6-11-in-cm"],
    ["/6%2711-in-cm", "/6-11-in-cm"],
    ["/6%E2%80%9911-in-cm", "/6-11-in-cm"],
    ["/4-7-feet-in-cm", "/4-7-in-cm"],
    ["/4ft7-in-cm", "/4-7-in-cm"],
    ["/4ft7in-in-cm", "/4-7-in-cm"],
    ["/5-5-feet-in-cm", "/5-5-in-cm"],
    ["/6ft0-in-cm", "/6-feet-in-cm"],
    ["/6ft0in-in-cm", "/6-feet-in-cm"],
    ["/6ft-in-cm", "/6-feet-in-cm"],
    ["/6-0-feet-in-cm", "/6-feet-in-cm"],
    ["/6-11-to-cm", "/6-11-in-cm"],
    ["/6-11-en-cm", "/6-11-in-cm"],
    ["/6-11-a-cm", "/6-11-in-cm"],
    ["/5-5-to-cm", "/5-5-in-cm"],
    ["/5-5-en-cm", "/5-5-in-cm"],
    ["/5-5-a-cm", "/5-5-in-cm"],
    ["/6-1-to-cm", "/6-1-in-cm"],
    ["/4-7-to-cm", "/4-7-in-cm"],
    ["/4-7-en-cm", "/4-7-in-cm"],
    ["/4-7-a-cm", "/4-7-in-cm"],
    ["/6-6-to-cm", "/6-6-in-cm"],
  ];
  for (const [from, to] of samples) {
    assert.equal(heightRedirectMap.get(from), to, `${from} should 301 to ${to}`);
    assert.equal(pathRedirectMap.get(from), to, `${from} should be a published path 301 to ${to}`);
    assert.equal(redirectMap.has(from), false, `numeric inch generator must not own ${from}`);
    assert.equal(heightRedirectMap.has(to), false, `${to} must remain the canonical, not a redirect source`);
    assert.ok(heightCanonicals.has(to), `${to} must be a published height canonical`);
    const hit = firstMatchingPathRedirect(from, generatedRules);
    assert.equal(hit?.to, to);
    assert.equal(hit?.status, 301);
    assert.equal(isMissingPath404Fallback(hit), false);
    assert.equal(firstMatchingPathRedirect(`${from}/`, generatedRules)?.to, to);
  }
});

test("height alias rules are a closed set of already published heights", () => {
  const heights = allHeights();
  const remainderCount = heights.filter((height) => height.inches !== 0).length;
  const wholeFeetCount = heights.filter((height) => height.inches === 0).length;
  assert.equal(remainderCount, 55);
  assert.equal(wholeFeetCount, 6);
  assert.equal(
    heightRedirects.length,
    heights.reduce((total, height) => total + aliasPathsForHeight(height.feet, height.inches).length, 0),
  );
  assert.equal(aliasPathsForHeight(6, 11).includes("/6-feet-11-inches-in-cm"), true);
  assert.equal(aliasPathsForHeight(6, 11).includes("/6ft11-in-cm"), true);
  assert.equal(aliasPathsForHeight(6, 11).includes("/6-11-feet-in-cm"), true);
  assert.equal(aliasPathsForHeight(6, 11).includes("/6-11-to-cm"), true);
  assert.equal(aliasPathsForHeight(6, 11).includes("/6-11-en-cm"), true);
  assert.equal(aliasPathsForHeight(6, 11).includes("/6-11-a-cm"), true);
  assert.equal(aliasPathsForHeight(4, 7).includes("/4-foot-7-in-cm"), true);
  assert.equal(aliasPathsForHeight(6, 0).includes("/6-0-to-cm"), false);
  for (const { from, to, status } of heightRedirects) {
    assert.equal(status, 301);
    assert.match(
      from,
      /^\/(?:\d+-(?:feet|foot)(?:-\d+(?:-(?:inch|inches))?)?-in-cm|\d+-\d+-(?:feet|foot)-in-cm|\d+-\d+-(?:to|en|a)-cm|\d+ft\d+(?:in)?-in-cm|\d+ft\d+in-cm|\d+ft-\d+(?:in)?-in-cm|\d+ft0(?:in)?-in-cm|\d+ft-0(?:in)?-in-cm|\d+ft-in-cm|\d+-ft-\d+-in-cm|\d+(?:['\u2019]|%27|%E2%80%99)\d+-in-cm)$/,
    );
    assert.match(to, /^\/(?:\d+-\d+-in-cm|\d+-feet-in-cm)$/);
    assert.notEqual(from, to);
    assert.equal(from.includes("*"), false);
    assert.equal(from.includes(":"), false);
    assert.ok(heightCanonicals.has(to), `target ${to} is not a published height canonical`);
    assert.equal(heightCanonicals.has(from), false, `must not redirect live height canonical ${from}`);
    assert.equal(canonicals.has(from), false, `must not redirect live inch canonical ${from}`);
    assert.equal(heightRedirectMap.has(to), false, `redirect chain through ${to}`);
    assert.equal(redirectMap.has(from), false, `inch generator must not also own ${from}`);
  }
  for (const height of PROTECTED_HEIGHT_PATHS) {
    assert.equal(heightRedirectMap.has(height), false, `${height} must remain the canonical`);
    assert.ok(heightCanonicals.has(height), `${height} must stay in the published height set`);
  }
  for (const alias of UNPUBLISHED_HEIGHT_ALIAS_SAMPLES) {
    assert.equal(heightRedirectMap.has(alias), false, `${alias} must stay 404`);
    assert.equal(pathRedirectMap.has(alias), false, `${alias} must stay 404`);
    assert.equal(isMissingPath404Fallback(firstMatchingPathRedirect(alias, generatedRules)), true);
  }
  assert.equal(pathRedirectMap.has("/5-7-inches-to-cm"), false, "ambiguous 5.7-inch slug must stay 404");
  assert.equal(pathRedirectMap.has("/6-inches-to-cm"), true, "single-number inch to-cm alias must stay an inch redirect");
  assert.equal(pathRedirectMap.get("/6-inches-to-cm"), "/6-inches-in-cm");
  assert.equal(pathRedirectMap.get("/1-inch-to-cm"), "/1-inch-in-cm");
  assert.equal(pathRedirectMap.has("/6-0-to-cm"), false, "whole-feet zero remainder must not invent /N-0-to-cm");
  assert.equal(pathRedirectMap.has("/6-11-inches-to-cm"), false, "two-number inch wording stays unpublished");
});

test("a 301 path splat would steal unknown paths before the 404 fallback", () => {
  const stolen = firstMatchingPathRedirect("/nope", [
    { from: "/*/", to: "/:splat", status: 301 },
    MISSING_PATH_404_FALLBACK,
  ]);
  assert.equal(stolen?.status, 301);
  assert.equal(isPathLevelRedirectSplat(stolen), true);
  assert.equal(isMissingPath404Fallback(stolen), false);
});

test("a terminal 404 splat shadows path 301s that appear only after it", () => {
  const stolen = firstMatchingPathRedirect("/inch-to-millimeter", [
    ...redirects,
    MISSING_PATH_404_FALLBACK,
    { from: "/inch-to-millimeter", to: "/inches-to-mm", status: 301 },
  ]);
  assert.equal(isMissingPath404Fallback(stolen), true);
});

test("puts owner-authorized unit-pair synonym 301s above the 404 fallback", () => {
  for (const [from, to] of Object.entries(UNIT_PAIR_SYNONYM_REDIRECTS)) {
    assert.equal(redirectMap.has(from), false, `inch generator must not treat ${from} as an inch alias`);
    assert.equal(pathRedirectMap.get(from), to, `${from} must be an explicit published path 301`);
    const hit = firstMatchingPathRedirect(from, generatedRules);
    assert.equal(hit?.status, 301);
    assert.equal(hit?.to, to);
  }
});

test("unreduced eighth fraction aliases 301 one hop to reduced canonicals", () => {
  const samples = [
    ["/fraction-2-8-inch-to-cm", "/fraction-1-4-inch-to-cm"],
    ["/fraction-4-8-inch-to-cm", "/fraction-1-2-inch-to-cm"],
    ["/fraction-6-8-inch-to-cm", "/fraction-3-4-inch-to-cm"],
  ];
  assert.equal(FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS.length, samples.length);
  for (const [from, to] of samples) {
    assert.equal(redirectMap.has(from), false, `numeric inch generator must not own ${from}`);
    assert.equal(pathRedirectMap.get(from), to, `${from} should 301 to ${to}`);
    const hit = firstMatchingPathRedirect(from, generatedRules);
    assert.equal(hit?.to, to);
    assert.equal(hit?.status, 301);
    assert.equal(pathRedirectMap.has(to), false, `${to} must remain the canonical, not a redirect source`);
    assert.equal(firstMatchingPathRedirect(`${from}/`, generatedRules)?.to, to);
  }
  for (const alias of UNPUBLISHED_FRACTION_CM_ALIAS_SAMPLES) {
    const hit = firstMatchingPathRedirect(alias, generatedRules);
    assert.equal(isMissingPath404Fallback(hit), true, `${alias} must stay a hard 404`);
    assert.equal(pathRedirectMap.has(alias), false);
  }
});
