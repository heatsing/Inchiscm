import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const policyPath = path.join(here, "../../../seo-page-policy.json");
const seoPolicy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
export const UNIT_PAIR_SYNONYM_REDIRECT_MAP = JSON.parse(
  fs.readFileSync(path.join(here, "unit-pair-synonyms.json"), "utf8"),
);

// Keep these helpers aligned with src/lib/conversions.ts
// (numberToSlug / inchSlug / allInchValues / heightSlug / heights).
export function numberToSlug(value) {
  return String(value).replace(".", "-");
}

export function inchSlug(value, screenInches = seoPolicy.screenInches) {
  const unit = value === 1 || value < 1 || (!Number.isInteger(value) && screenInches.includes(value)) ? "inch" : "inches";
  return `/${numberToSlug(value)}-${unit}-in-cm`;
}

export function allInchValues() {
  const integerInches = Array.from({ length: seoPolicy.wholeInchesMax }, (_, i) => i + 1);
  return [...new Set([...integerInches, ...seoPolicy.decimalInches, ...seoPolicy.screenInches])].sort((a, b) => a - b);
}

// Closed alias surface for already-published numeric inch pages only.
// `*-to-cm` recovers the common query slug; `*-in-centimeters` is the spelled-unit equivalent.
// Opposite grammatical `*-in-cm` covers 404s like /1-inches-in-cm → /1-inch-in-cm.
export const INCH_ALIAS_SUFFIXES = [
  "inches-to-cm",
  "inch-to-cm",
  "inches-in-centimeters",
  "inch-in-centimeters",
  "inches-in-cm",
  "inch-in-cm",
];

export const UNPUBLISHED_INCH_ALIAS_SAMPLES = [
  "/999999-inches-to-cm",
  "/999999-inch-to-cm",
  "/123456-inches-in-centimeters",
  "/5-7-inches-to-cm",
];

export const UNPUBLISHED_CM_ALIAS_SAMPLES = [
  "/999999-cm-to-inches",
  "/999999-cm-to-inch",
  "/999.9-cm-in-inches",
  "/999.9-cm-to-inches",
  "/8-1-cm-to-inches",
  "/8.1-cm-in-inches",
  "/8.1-cm-to-inches",
];

// Ambiguous /5-7-inches-to-cm stays an unpublished inch alias (5.7 inches),
// not a height. Two-number F-I connectors (to/en/a) are height aliases;
// single-number /{n}-inches-to-cm and /{n}-inch-to-cm stay inch aliases.
export const HEIGHT_FEET_WORDS = Object.freeze(["feet", "foot"]);
export const HEIGHT_INCH_WORDS = Object.freeze(["inches", "inch"]);
export const HEIGHT_STRAIGHT_APOSTROPHE = "'";
export const HEIGHT_CURLY_APOSTROPHE = "\u2019";

export const UNPUBLISHED_HEIGHT_ALIAS_SAMPLES = [
  "/9-feet-7-inches-in-cm",
  "/2-foot-11-inches-in-cm",
  "/8-feet-1-inch-in-cm",
  "/5-feet-13-inches-in-cm",
  "/999999-feet-7-inches-in-cm",
  "/9-11-feet-in-cm",
  "/9ft11-in-cm",
  "/9ft-11in-in-cm",
  "/9ft11in-in-cm",
  "/2ft11-in-cm",
  "/9'11-in-cm",
  "/9\u201911-in-cm",
  "/8-1-feet-in-cm",
  "/9-11-to-cm",
  "/9-11-en-cm",
  "/9-11-a-cm",
  "/8-1-to-cm",
  "/8-1-en-cm",
  "/2-11-a-cm",
  "/9-11-feet-to-cm",
  "/9-foot-11-to-cm",
  "/9-feet-11-to-cm",
  "/9-foot-11-inches-to-cm",
  "/9.11-feet-in-cm",
  "/9.11-feet-to-cm",
  "/2-foot-11-to-cm",
  "/8-1-feet-to-cm",
  "/8.1-feet-in-cm",
];

// Unreduced 16ths/64ths stay unpublished. Only the three eighth aliases below 301.
export const UNPUBLISHED_FRACTION_CM_ALIAS_SAMPLES = [
  "/fraction-2-16-inch-to-cm",
  "/fraction-4-16-inch-to-cm",
  "/fraction-8-16-inch-to-cm",
  "/fraction-8-64-inch-to-cm",
];

// Any unmatched path, not just unpublished inch aliases. Must hard-404.
export const UNKNOWN_PATH_SAMPLES = [
  "/nope",
  "/888888-inches-to-cm",
  "/this-page-definitely-does-not-exist",
  "/missing/nested-path",
  ...UNPUBLISHED_INCH_ALIAS_SAMPLES,
  ...UNPUBLISHED_FRACTION_CM_ALIAS_SAMPLES,
  ...UNPUBLISHED_HEIGHT_ALIAS_SAMPLES,
  ...UNPUBLISHED_CM_ALIAS_SAMPLES,
];

// Last rule in out/_redirects. Specific 301s must stay above it.
export const MISSING_PATH_404_FALLBACK = Object.freeze({
  from: "/*",
  to: "/404.html",
  status: 404,
});

// Legacy hub spelling aliases. Must live in out/_redirects above the 404 fallback;
// netlify.toml path rules are never reached after /* /404.html 404.
export const LEGACY_HUB_REDIRECTS = Object.freeze([
  { from: "/inches-to-centimeters", to: "/inches-to-cm", status: 301 },
  { from: "/centimeters-to-inches", to: "/cm-to-inches", status: 301 },
]);

// Closed unreduced-eighth aliases of already-published reduced fraction cm pages.
// Do not index 2/8, 4/8, 6/8, and do not expand this set to 16ths or 64ths.
export const FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS = Object.freeze([
  { from: "/fraction-2-8-inch-to-cm", to: "/fraction-1-4-inch-to-cm", status: 301 },
  { from: "/fraction-4-8-inch-to-cm", to: "/fraction-1-2-inch-to-cm", status: 301 },
  { from: "/fraction-6-8-inch-to-cm", to: "/fraction-3-4-inch-to-cm", status: 301 },
]);

export const PROTECTED_HEIGHT_PATHS = [
  "/5-7-in-cm",
  "/6-11-in-cm",
  "/4-7-in-cm",
  "/6-feet-in-cm",
];

export function heightSlug(feet, inches) {
  return inches === 0 ? `/${feet}-feet-in-cm` : `/${feet}-${inches}-in-cm`;
}

export function allHeights() {
  const min = seoPolicy.heightMinTotalInches;
  const max = seoPolicy.heightMaxTotalInches;
  return Array.from({ length: max - min + 1 }, (_, index) => {
    const total = min + index;
    return { feet: Math.floor(total / 12), inches: total % 12 };
  });
}

export function cmSlug(value) {
  return `/${numberToSlug(value)}-cm-in-inches`;
}

export function allCmValues() {
  const wholeCentimeters = Array.from({ length: seoPolicy.wholeCentimetersMax }, (_, i) => i + 1);
  return [...new Set([...wholeCentimeters, ...seoPolicy.approvedReverseCentimeters])].sort((a, b) => a - b);
}

export function publishedCmCanonicals(values = allCmValues()) {
  return values.map((value) => cmSlug(value));
}

export function dottedCmNumberSlug(value) {
  return String(value);
}

export const CM_TO_INCH_ALIAS_SUFFIXES = Object.freeze(["cm-to-inches", "cm-to-inch"]);

export function aliasPathsForCmValue(value) {
  const hyphenSlug = numberToSlug(value);
  const aliases = CM_TO_INCH_ALIAS_SUFFIXES.map((suffix) => `/${hyphenSlug}-${suffix}`);
  const dotted = dottedCmNumberSlug(value);
  if (!dotted.includes(".")) return aliases;
  return [
    ...aliases,
    `/${dotted}-cm-in-inches`,
    ...CM_TO_INCH_ALIAS_SUFFIXES.map((suffix) => `/${dotted}-${suffix}`),
  ];
}

export function publishedInchCanonicals(values = allInchValues()) {
  return values.map((value) => inchSlug(value));
}

export function aliasPathsForInchValue(value) {
  const numberSlug = numberToSlug(value);
  return INCH_ALIAS_SUFFIXES.map((suffix) => `/${numberSlug}-${suffix}`);
}

export function publishedInchAliasRedirects(values = allInchValues()) {
  const canonicals = new Set(publishedInchCanonicals(values));
  const redirects = [];
  const seen = new Set();

  for (const value of values) {
    const canonical = inchSlug(value);
    if (!canonicals.has(canonical)) continue;
    for (const from of aliasPathsForInchValue(value)) {
      if (from === canonical) continue;
      if (canonicals.has(from)) {
        throw new Error(`Refusing to redirect live canonical ${from}`);
      }
      if (seen.has(from)) {
        throw new Error(`Duplicate inch alias ${from}`);
      }
      seen.add(from);
      redirects.push({ from, to: canonical, status: 301 });
    }
  }

  return redirects.sort((left, right) => left.from.localeCompare(right.from, "en"));
}

export function publishedHeightCanonicals(values = allHeights()) {
  return values.map(({ feet, inches }) => heightSlug(feet, inches));
}

// High-value GSC compact / dotted / quoted height wordings. Closed set only.
export function compactHeightAliasPaths(feet, inches) {
  if (inches === 0) {
    return [
      `/${feet}ft-in-cm`,
      `/${feet}ft0-in-cm`,
      `/${feet}ft-0-in-cm`,
      `/${feet}ft-0in-in-cm`,
      `/${feet}ft0in-in-cm`,
      `/${feet}ft0in-cm`,
    ];
  }
  return [
    `/${feet}ft${inches}-in-cm`,
    `/${feet}ft-${inches}-in-cm`,
    `/${feet}ft-${inches}in-in-cm`,
    `/${feet}ft${inches}in-in-cm`,
    `/${feet}ft${inches}in-cm`,
    `/${feet}-ft-${inches}-in-cm`,
  ];
}

export function dottedFeetAliasPaths(feet, inches) {
  return HEIGHT_FEET_WORDS.map((feetWord) => `/${feet}-${inches}-${feetWord}-in-cm`);
}

export function quotedHeightAliasPaths(feet, inches) {
  if (inches === 0) return [];
  return [
    `/${feet}${HEIGHT_STRAIGHT_APOSTROPHE}${inches}-in-cm`,
    `/${feet}${HEIGHT_CURLY_APOSTROPHE}${inches}-in-cm`,
    `/${feet}%27${inches}-in-cm`,
    `/${feet}%E2%80%99${inches}-in-cm`,
  ];
}

// GSC space-query slugs: "6 11 to cm" / "6 11 en cm" / "6 11 a cm".
// Closed remainder-inch set only. Whole feet stay /{N}-feet-in-cm.
export const HEIGHT_SPACE_CONNECTORS = Object.freeze(["to", "en", "a"]);

export function spaceConnectorHeightAliasPaths(feet, inches) {
  if (inches === 0) return [];
  return HEIGHT_SPACE_CONNECTORS.map((connector) => `/${feet}-${inches}-${connector}-cm`);
}

// GSC "6 11 feet in cm" / "4 foot 7 in cm" to-cm wording. Closed published set.
// Do not emit /{F}-{I}-to-cm here — that surface shipped in PR #17.
export function toCmWordingHeightAliasPaths(feet, inches) {
  return [
    `/${feet}-${inches}-feet-to-cm`,
    `/${feet}-foot-${inches}-to-cm`,
    `/${feet}-feet-${inches}-to-cm`,
    `/${feet}-foot-${inches}-inches-to-cm`,
    `/${feet}-feet-${inches}-inches-to-cm`,
  ];
}

// Decimal-foot lookalikes typed as 6.11 / 4.10 / 4.7. Unpadded inches (6.1, 4.7);
// I>=10 already has two digits (6.10, 6.11). Never invent 6.01 for 6'1".
export function decimalFootHeightAliasPaths(feet, inches) {
  const tokens = new Set([String(inches)]);
  if (inches >= 10) tokens.add(String(inches).padStart(2, "0"));
  return [...tokens].flatMap((token) => [
    `/${feet}.${token}-feet-in-cm`,
    `/${feet}.${token}-feet-to-cm`,
  ]);
}

export function aliasPathsForHeight(feet, inches) {
  const compact = compactHeightAliasPaths(feet, inches);
  const dotted = dottedFeetAliasPaths(feet, inches);
  const quoted = quotedHeightAliasPaths(feet, inches);
  const spaceConnectors = spaceConnectorHeightAliasPaths(feet, inches);
  const toCmWording = toCmWordingHeightAliasPaths(feet, inches);
  const decimalFeet = decimalFootHeightAliasPaths(feet, inches);
  if (inches === 0) {
    return [
      `/${feet}-foot-in-cm`,
      ...dotted,
      ...HEIGHT_FEET_WORDS.flatMap((feetWord) => (
        HEIGHT_INCH_WORDS.map((inchWord) => `/${feet}-${feetWord}-0-${inchWord}-in-cm`)
      )),
      ...compact,
      ...toCmWording,
      ...decimalFeet,
    ];
  }
  return [
    ...HEIGHT_FEET_WORDS.flatMap((feetWord) => [
      ...HEIGHT_INCH_WORDS.map((inchWord) => `/${feet}-${feetWord}-${inches}-${inchWord}-in-cm`),
      `/${feet}-${feetWord}-${inches}-in-cm`,
    ]),
    ...dotted,
    ...compact,
    ...quoted,
    ...spaceConnectors,
    ...toCmWording,
    ...decimalFeet,
  ];
}

export function publishedCmAliasRedirects(values = allCmValues()) {
  const canonicals = new Set(publishedCmCanonicals(values));
  const liveCanonicals = new Set([
    ...canonicals,
    ...publishedInchCanonicals(),
    ...publishedHeightCanonicals(),
  ]);
  const redirects = [];
  const seen = new Set();

  for (const value of values) {
    const canonical = cmSlug(value);
    if (!canonicals.has(canonical)) continue;
    for (const from of aliasPathsForCmValue(value)) {
      if (from === canonical) continue;
      if (liveCanonicals.has(from)) {
        throw new Error(`Refusing to redirect live canonical ${from}`);
      }
      if (seen.has(from)) {
        throw new Error(`Duplicate cm alias ${from}`);
      }
      seen.add(from);
      redirects.push({ from, to: canonical, status: 301 });
    }
  }

  return redirects.sort((left, right) => left.from.localeCompare(right.from, "en"));
}

export function publishedHeightAliasRedirects(values = allHeights()) {
  const canonicals = new Set(publishedHeightCanonicals(values));
  const liveCanonicals = new Set([
    ...canonicals,
    ...publishedInchCanonicals(),
    ...publishedCmCanonicals(),
  ]);
  const redirects = [];
  const seen = new Set();

  for (const { feet, inches } of values) {
    const canonical = heightSlug(feet, inches);
    if (!canonicals.has(canonical)) continue;
    for (const from of aliasPathsForHeight(feet, inches)) {
      if (from === canonical) continue;
      if (liveCanonicals.has(from)) {
        throw new Error(`Refusing to redirect live canonical ${from}`);
      }
      if (seen.has(from)) {
        throw new Error(`Duplicate height alias ${from}`);
      }
      seen.add(from);
      redirects.push({ from, to: canonical, status: 301 });
    }
  }

  return redirects.sort((left, right) => left.from.localeCompare(right.from, "en"));
}

export function unitPairSynonymRedirects(map = UNIT_PAIR_SYNONYM_REDIRECT_MAP) {
  return Object.entries(map).map(([from, to]) => ({ from, to, status: 301 }));
}

// Every path-level 301 that must win over the terminal /* /404.html 404.
// Netlify processes out/_redirects before netlify.toml, so these cannot live
// only in netlify.toml.
export function publishedPathRedirects({
  hubRedirects = LEGACY_HUB_REDIRECTS,
  synonymRedirects = unitPairSynonymRedirects(),
  fractionRedirects = FRACTION_CM_UNREDUCED_ALIAS_REDIRECTS,
  inchRedirects = publishedInchAliasRedirects(),
  heightRedirects = publishedHeightAliasRedirects(),
  cmRedirects = publishedCmAliasRedirects(),
} = {}) {
  const redirects = [];
  const seen = new Set();
  for (const rule of [...hubRedirects, ...synonymRedirects, ...fractionRedirects, ...inchRedirects, ...heightRedirects, ...cmRedirects]) {
    if (!rule?.from || !rule?.to) {
      throw new Error("Published path redirect is missing from/to");
    }
    if (rule.from.includes("*") || rule.from.includes(":")) {
      throw new Error(`Refusing to write open alias pattern ${rule.from}`);
    }
    if (rule.from === rule.to) {
      throw new Error(`Refusing self-redirect ${rule.from}`);
    }
    if (Number(rule.status) !== 301) {
      throw new Error(`Published path redirect ${rule.from} must be 301`);
    }
    if (seen.has(rule.from)) {
      throw new Error(`Duplicate published path redirect ${rule.from}`);
    }
    seen.add(rule.from);
    redirects.push({ from: rule.from, to: rule.to, status: 301 });
  }
  return redirects;
}

export function formatNetlifyRedirectsFile(redirects = publishedPathRedirects()) {
  const lines = [
    "# Published path-level 301s. Generated by scripts/generate-inch-alias-redirects.mjs.",
    "# Netlify reads _redirects before netlify.toml, so a terminal /* /404.html 404",
    "# shadows any path 301 left only in netlify.toml (PR #9 / #5 regression).",
    "# Includes hub aliases, unit-pair synonyms (unit-pair-synonyms.json), closed",
    "# unreduced-eighth fraction aliases, published-inch aliases, published-height",
    "# feet/foot / NftM / N-M-feet / apostrophe / F-I-to|en|a-cm / feet-to-cm /",
    "# decimal-foot wording aliases, and published-cm to-inches / dotted aliases",
    "# (seo-page-policy.json height and cm ranges).",
    "# Unpublished numbers, unreduced 16ths/64ths, and unknown paths stay 404.",
    "",
  ];
  for (const { from, to, status } of redirects) {
    if (from.includes("*") || from.includes(":")) {
      throw new Error(`Refusing to write open alias pattern ${from}`);
    }
    lines.push(`${from}  ${to}  ${status}`);
  }
  lines.push(
    "# Missing paths hard-404. Must stay last so published 301s win first match.",
    "# Do not use /* → /:splat 301; Netlify treats that as a self-redirect loop.",
    `${MISSING_PATH_404_FALLBACK.from}  ${MISSING_PATH_404_FALLBACK.to}  ${MISSING_PATH_404_FALLBACK.status}`,
    "",
  );
  return lines.join("\n");
}

export function parseNetlifyRedirectsFile(source) {
  return source.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return [];
    const [from, to, status] = trimmed.split(/\s+/);
    if (!from || !to) {
      throw new Error(`Invalid _redirects line: ${line}`);
    }
    return [{ from, to, status: Number(status || 301) }];
  });
}

export function parseNetlifyTomlRedirects(source) {
  return source.split("[[redirects]]").slice(1).flatMap((block) => {
    const from = block.match(/from\s*=\s*"([^"]+)"/)?.[1];
    const to = block.match(/to\s*=\s*"([^"]+)"/)?.[1];
    const status = Number(block.match(/status\s*=\s*(\d+)/)?.[1] || 301);
    if (!from || !to) return [];
    return [{ from, to, status }];
  });
}

export function isHostScopedRedirect(from) {
  return /^https?:\/\//.test(from);
}

// Netlify matches redirect `from` with and without a trailing slash, so `/*/`
// is the same open path splat as `/*` and 301s unmatched URLs onto themselves.
export function normalizeNetlifyPathPattern(from) {
  if (isHostScopedRedirect(from)) return from;
  return from.replace(/\/+$/, "") || "/";
}

export function isOpenPathSplat(from) {
  if (isHostScopedRedirect(from)) return false;
  const pattern = normalizeNetlifyPathPattern(from);
  return pattern.includes("*") || /(^|\/):[A-Za-z*]/.test(pattern);
}

export function isMissingPath404Fallback(rule) {
  return (
    Boolean(rule)
    && normalizeNetlifyPathPattern(rule.from) === "/*"
    && rule.to === "/404.html"
    && Number(rule.status) === 404
  );
}

export function isPathLevelRedirectSplat(rule) {
  return Boolean(rule) && isOpenPathSplat(rule.from) && !isMissingPath404Fallback(rule);
}

function netlifyPathPatternToRegExp(from) {
  const pattern = normalizeNetlifyPathPattern(from);
  let regex = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "*") {
      regex += ".*";
      continue;
    }
    if (character === ":" && /[A-Za-z]/.test(pattern[index + 1] || "")) {
      const name = pattern.slice(index + 1).match(/^[A-Za-z][A-Za-z0-9_]*/)?.[0] ?? "";
      regex += "[^/]+";
      index += name.length;
      continue;
    }
    regex += character.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${regex}$`);
}

export function netlifyPathRuleMatches(pathname, from) {
  if (isHostScopedRedirect(from)) return false;
  const path = normalizeNetlifyPathPattern(pathname);
  const pattern = normalizeNetlifyPathPattern(from);
  if (!isOpenPathSplat(from)) {
    return path === pattern;
  }
  return netlifyPathPatternToRegExp(from).test(path);
}

export function firstMatchingPathRedirect(pathname, rules) {
  return rules.find((rule) => netlifyPathRuleMatches(pathname, rule.from));
}
