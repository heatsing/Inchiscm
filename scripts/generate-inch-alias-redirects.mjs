import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatNetlifyRedirectsFile,
  publishedHeightAliasRedirects,
  publishedInchAliasRedirects,
  publishedPathRedirects,
} from "../src/data/page-registry/inch-alias-redirects.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "out", "_redirects");

if (!fs.existsSync(path.join(root, "out"))) {
  console.error("Missing out/. Run next build before generating inch alias redirects.");
  process.exit(1);
}
if (!fs.existsSync(path.join(root, "out", "404.html"))) {
  console.error("Missing out/404.html. Unknown paths cannot hard-404 without the exported not-found page.");
  process.exit(1);
}

const inchRedirects = publishedInchAliasRedirects();
const heightRedirects = publishedHeightAliasRedirects();
const redirects = publishedPathRedirects({ inchRedirects, heightRedirects });
if (inchRedirects.length === 0) {
  console.error("Published inch alias generator produced no redirects.");
  process.exit(1);
}
if (heightRedirects.length === 0) {
  console.error("Published height alias generator produced no redirects.");
  process.exit(1);
}

fs.writeFileSync(outFile, formatNetlifyRedirectsFile(redirects));
console.log(
  `Wrote ${redirects.length} path-level 301s (${inchRedirects.length} published-inch aliases, ${heightRedirects.length} published-height aliases, plus hub/synonym/fraction aliases) and a terminal /* /404.html 404 fallback to out/_redirects`,
);
