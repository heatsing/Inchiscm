import synonymRedirects from "./unit-pair-synonyms.json";

export const UNIT_PAIR_SYNONYM_REDIRECTS: Record<string, string> = synonymRedirects;

export const UNIT_PAIR_SYNONYM_LOSER_SLUGS = new Set(
  Object.keys(UNIT_PAIR_SYNONYM_REDIRECTS).map((path) => path.slice(1)),
);

export const UNIT_PAIR_SYNONYM_CANONICAL_PATHS = new Set(Object.values(UNIT_PAIR_SYNONYM_REDIRECTS));

const FORMULA_GRID_UNITS = ["inch", "centimeter", "millimeter", "foot", "yard", "meter", "kilometer", "mile"] as const;
const FORMULA_GRID_PAIR_CAP = 53;

export function formulaGridUnitPairSlugs() {
  const pairs: string[] = [];
  for (const from of FORMULA_GRID_UNITS) {
    for (const to of FORMULA_GRID_UNITS) {
      if (from === to) continue;
      if (from === "inch" && to === "centimeter") continue;
      if (from === "centimeter" && to === "inch") continue;
      pairs.push(`${from}-to-${to}`);
    }
  }
  return pairs
    .slice(0, FORMULA_GRID_PAIR_CAP)
    .filter((slug) => !UNIT_PAIR_SYNONYM_LOSER_SLUGS.has(slug));
}
