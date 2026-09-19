import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unescapeHeightMarksInHtml } from "../src/lib/html-text.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

function walkHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkHtmlFiles(file));
    else if (entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

if (!fs.existsSync(outDir)) {
  console.error("Missing out/. Run next build before unescaping height marks.");
  process.exit(1);
}

let rewritten = 0;
for (const file of walkHtmlFiles(outDir)) {
  const input = fs.readFileSync(file, "utf8");
  const output = unescapeHeightMarksInHtml(input);
  if (output !== input) {
    fs.writeFileSync(file, output);
    rewritten += 1;
  }
}

console.log(`Unescaped feet/inches marks in ${rewritten} exported HTML files.`);
