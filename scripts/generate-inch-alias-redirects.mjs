import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatNetlifyRedirectsFile,
  publishedInchAliasRedirects,
} from "../src/data/page-registry/inch-alias-redirects.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "out", "_redirects");

if (!fs.existsSync(path.join(root, "out"))) {
  console.error("Missing out/. Run next build before generating inch alias redirects.");
  process.exit(1);
}

const redirects = publishedInchAliasRedirects();
if (redirects.length === 0) {
  console.error("Published inch alias generator produced no redirects.");
  process.exit(1);
}

fs.writeFileSync(outFile, formatNetlifyRedirectsFile(redirects));
console.log(`Wrote ${redirects.length} published-inch alias 301s to out/_redirects`);
