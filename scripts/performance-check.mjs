import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const homeHtmlFile = path.join(outDir, "index.html");
const chunksDir = path.join(outDir, "_next", "static", "chunks");
const errors = [];

const budget = {
  homeHtmlBytes: 100_000,
  largestCssBytes: 16_000,
  homepageFirstPartyJsBytes: 750_000,
  homepageScriptTags: 45,
  homepageNextFlightChunks: 30,
};

function fail(message) {
  errors.push(message);
}

function fileSize(file) {
  return fs.statSync(file).size;
}

function chunkFileFromUrl(url) {
  const pathname = url.split(/[?#]/, 1)[0];
  if (!pathname.startsWith("/_next/static/chunks/")) return null;
  return path.join(outDir, pathname);
}

if (!fs.existsSync(homeHtmlFile)) {
  fail("Missing out/index.html. Run npm run build before npm run performance:check.");
}

if (!fs.existsSync(chunksDir)) {
  fail("Missing out/_next/static/chunks. Run npm run build before npm run performance:check.");
}

let homeHtml = "";
if (fs.existsSync(homeHtmlFile)) {
  homeHtml = fs.readFileSync(homeHtmlFile, "utf8");
  const homeHtmlBytes = Buffer.byteLength(homeHtml);
  const scriptTags = (homeHtml.match(/<script\b/gi) ?? []).length;
  const nextFlightChunks = (homeHtml.match(/self\.__next_f\.push/g) ?? []).length;

  if (homeHtmlBytes > budget.homeHtmlBytes) {
    fail(`Homepage HTML is ${homeHtmlBytes} bytes, above the ${budget.homeHtmlBytes} byte budget.`);
  }
  if (scriptTags > budget.homepageScriptTags) {
    fail(`Homepage has ${scriptTags} script tags, above the ${budget.homepageScriptTags} tag budget.`);
  }
  if (nextFlightChunks > budget.homepageNextFlightChunks) {
    fail(`Homepage has ${nextFlightChunks} Next Flight chunks, above the ${budget.homepageNextFlightChunks} chunk budget.`);
  }
}

let largestCssBytes = 0;
if (fs.existsSync(chunksDir)) {
  const cssFiles = fs.readdirSync(chunksDir)
    .filter((name) => name.endsWith(".css"))
    .map((name) => path.join(chunksDir, name));
  largestCssBytes = Math.max(0, ...cssFiles.map(fileSize));
  if (largestCssBytes > budget.largestCssBytes) {
    fail(`Largest CSS chunk is ${largestCssBytes} bytes, above the ${budget.largestCssBytes} byte budget.`);
  }
}

const homepageChunkUrls = [
  ...homeHtml.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]*\/_next\/static\/chunks\/[^"]+)"/gi),
].map((match) => match[1]);
const homepageJsFiles = [...new Set(homepageChunkUrls)]
  .filter((url) => url.endsWith(".js"))
  .map(chunkFileFromUrl)
  .filter((file) => file && fs.existsSync(file));
const homepageFirstPartyJsBytes = homepageJsFiles.reduce((total, file) => total + fileSize(file), 0);

if (homepageFirstPartyJsBytes > budget.homepageFirstPartyJsBytes) {
  fail(`Homepage first-party JS is ${homepageFirstPartyJsBytes} bytes, above the ${budget.homepageFirstPartyJsBytes} byte budget.`);
}

if (homeHtml.includes('@import "tailwindcss"') || homeHtml.includes("@import 'tailwindcss'")) {
  fail("Global Tailwind import appears in exported homepage HTML.");
}

if (errors.length) {
  console.error(errors.map((error) => `FAIL: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: homepage HTML ${Buffer.byteLength(homeHtml)} bytes within ${budget.homeHtmlBytes}.`);
console.log(`PASS: largest CSS chunk ${largestCssBytes} bytes within ${budget.largestCssBytes}.`);
console.log(`PASS: homepage first-party JS ${homepageFirstPartyJsBytes} bytes within ${budget.homepageFirstPartyJsBytes}.`);
console.log(`PASS: homepage script and Flight chunk counts stay within budget.`);
