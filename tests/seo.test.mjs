import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  breadcrumbSchema,
  faqSchema,
  graphSchema,
  isThinNumericConversionPath,
  webApplicationSchema,
} from "../src/lib/seo.ts";

test("free converter WebApplication schema does not include Offer", () => {
  const schema = webApplicationSchema({
    name: "Inches to CM Converter",
    description: "Convert inches to centimeters.",
    path: "/inches-to-cm",
  });
  assert.equal(schema["@type"], "WebApplication");
  assert.equal("offers" in schema, false);
});

test("graphSchema keeps a single top-level @context", () => {
  const graph = graphSchema([
    breadcrumbSchema([{ name: "Home", path: "/" }]),
    faqSchema([{ question: "How many cm is 1 inch?", answer: "1 inch equals 2.54 cm." }]),
    { "@context": "https://schema.org", "@type": "Dataset", name: "Test dataset" },
  ]);
  assert.equal(graph["@context"], "https://schema.org");
  for (const node of graph["@graph"]) {
    assert.equal(Object.hasOwn(node, "@context"), false);
  }
  assert.equal(graph["@graph"][0]["@type"], "BreadcrumbList");
  assert.equal(graph["@graph"][1]["@type"], "FAQPage");
  assert.equal(graph["@graph"][2]["@type"], "Dataset");
});

test("thin numeric conversion paths omit FAQPage schema", () => {
  assert.equal(isThinNumericConversionPath("/1-inch-in-cm"), true);
  assert.equal(isThinNumericConversionPath("/2-inches-in-cm"), true);
  assert.equal(isThinNumericConversionPath("/1-5-inches-in-cm"), true);
  assert.equal(isThinNumericConversionPath("/30-cm-in-inches"), true);
  assert.equal(isThinNumericConversionPath("/5-5-in-cm"), true);
  assert.equal(isThinNumericConversionPath("/6-feet-in-cm"), true);
  assert.equal(isThinNumericConversionPath("/inches-to-cm"), false);
  assert.equal(isThinNumericConversionPath("/how-to-convert-inches-to-cm"), false);
});

test("netlify.toml sends www/http traffic to https apex in one hop", () => {
  const toml = fs.readFileSync("netlify.toml", "utf8");
  const blocks = toml.split("[[redirects]]").slice(1);
  const hasForced = (from, to) => blocks.some((block) => (
    block.includes(`from = "${from}"`)
    && block.includes(`to = "${to}"`)
    && block.includes("status = 301")
    && block.includes("force = true")
  ));
  assert.equal(hasForced("http://www.inchiscm.com/*", "https://inchiscm.com/:splat"), true);
  assert.equal(hasForced("https://www.inchiscm.com/*", "https://inchiscm.com/:splat"), true);
  assert.equal(hasForced("http://inchiscm.com/*", "https://inchiscm.com/:splat"), true);
  assert.equal(blocks.some((block) => /from\s*=\s*"\/\*"/.test(block) || /from\s*=\s*"\/\*\/"/.test(block)), false);
  assert.equal(blocks.some((block) => /from\s*=\s*"\/[^h]/.test(block)), false);
  assert.equal(toml.includes("out/_redirects"), true);
  assert.ok(blocks.length <= 6, "netlify.toml should keep only host canonicalization redirects");
});
