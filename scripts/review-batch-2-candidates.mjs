import fs from "node:fs";

const rows = fs.readFileSync("SEO-PAGE-INVENTORY-1000.csv", "utf8").trimEnd().split("\n");
const headers = parseCsvLine(rows[0]);

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quoted && character === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      result.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  result.push(current);
  return result;
}

function toObject(line) {
  const values = parseCsvLine(line);
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const duplicateTargets = new Map([
  ["/inch-to-cm", "/inches-to-cm"],
  ["/inch-to-mm", "/inches-to-mm"],
  ["/inch-to-foot", "/inches-to-feet"],
  ["/cm-to-inch", "/cm-to-inches"],
  ["/cm-to-meter", "/cm-to-meters"],
  ["/mm-to-inch", "/mm-to-inches"],
  ["/mm-to-cm", "/mm-to-cm"],
  ["/meter-to-cm", "/meters-to-cm"],
  ["/foot-to-inch", "/feet-to-inches"],
  ["/foot-to-meter", "/feet-to-meters"],
  ["/yard-to-meter", "/yards-to-meters"],
  ["/meter-to-yard", "/meters-to-yards"],
  ["/mile-to-km", "/miles-to-km"],
  ["/km-to-mile", "/km-to-miles"],
]);

function decisionFor(row) {
  const url = row["Proposed URL"];
  if (duplicateTargets.has(url)) {
    return {
      decision: "Reject",
      reason: `Duplicate wording or singular/plural variant of existing ${duplicateTargets.get(url)}.`,
      nextAction: "Map query variants to the existing canonical page; do not publish a new URL.",
    };
  }
  if (/(micrometer|nanometer)/.test(url)) {
    return {
      decision: "Withhold",
      reason: "Allowed topic, but likely needs precision-specific content, examples, and stronger demand evidence before publication.",
      nextAction: "Keep in inventory; require GSC or keyword evidence and a dedicated precision-measurement template.",
    };
  }
  if (/to-(km|mile)$/.test(url) && /^(\/inch|\/cm|\/mm)/.test(url)) {
    return {
      decision: "Withhold",
      reason: "Technically valid but low practical value for the current inch/cm audience unless query data proves demand.",
      nextAction: "Prefer stronger everyday length-pair or guide pages first.",
    };
  }
  return {
    decision: "Candidate",
    reason: "Distinct unit-pair intent, but must be implemented with a real converter, formula, precision guidance, examples, FAQ, and hub links.",
    nextAction: "Prepare content model only after 14 days of Batch 1 GSC observation.",
  };
}

const batch2 = rows.slice(1).map(toObject).filter((row) => row["Publication batch"] === "Batch 2");
const reviewed = batch2.map((row) => ({ ...row, ...decisionFor(row) }));

const outputHeaders = ["Proposed URL", "Primary keyword", "Page type", "Parent topic hub", "decision", "reason", "nextAction", "Deployment status"];
fs.writeFileSync(
  "BATCH-2-CANDIDATE-REVIEW.csv",
  `${outputHeaders.join(",")}\n${reviewed.map((row) => outputHeaders.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
);

const counts = reviewed.reduce((acc, row) => {
  acc[row.decision] = (acc[row.decision] ?? 0) + 1;
  return acc;
}, {});

const md = [
  "# Batch 2 Preparation Review",
  "",
  "This file prepares Batch 2 without publishing any new URL. It intentionally does not change `seo-page-policy.json`, `pageRegistry`, `generateStaticParams()`, sitemap output, canonicals, or public routes.",
  "",
  "## Current status",
  "",
  "- Current public sitemap URL count after Batch 1: 441.",
  "- Batch 2 inventory candidates reviewed: 75.",
  `- Candidate: ${counts.Candidate ?? 0}.`,
  `- Withhold: ${counts.Withhold ?? 0}.`,
  `- Reject: ${counts.Reject ?? 0}.`,
  "- Next public release should wait for at least 14 days of GSC observation after Batch 1 unless the owner explicitly overrides the rule.",
  "",
  "## Main finding",
  "",
  "The automatically generated Batch 2 inventory contains several singular/plural or wording variants that would cannibalize existing pages, such as `/inch-to-cm` versus `/inches-to-cm` and `/cm-to-inch` versus `/cm-to-inches`. Those should not be published as separate URLs.",
  "",
  "## Publication gate before any Batch 2 release",
  "",
  "A Batch 2 page may be implemented only if it has:",
  "",
  "- distinct search intent that is not already served by an existing URL;",
  "- a visible working calculator or genuinely useful reference content;",
  "- server-rendered direct answer and formula;",
  "- unique title and meta description;",
  "- self-canonical URL;",
  "- WebPage and BreadcrumbList JSON-LD, plus WebApplication only when a working tool is visible;",
  "- links from a parent hub and at least one sibling page;",
  "- no AdSense or ad placeholder;",
  "- no query-parameter indexing;",
  "- no fake examples, reviews, ratings, products, or unsupported claims.",
  "",
  "## Review file",
  "",
  "See `BATCH-2-CANDIDATE-REVIEW.csv` for row-level decisions.",
  "",
].join("\n");

fs.writeFileSync("BATCH-2-PREPARATION.md", md);
console.log(`Reviewed ${reviewed.length} Batch 2 candidates.`);
console.log(JSON.stringify(counts, null, 2));
