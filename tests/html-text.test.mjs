import assert from "node:assert/strict";
import test from "node:test";
import { canonicalizeHomepageUrlsInHtml, escapeHtmlText, unescapeHeightMarksInHtml } from "../src/lib/html-text.ts";

test("escapeHtmlText keeps feet/inches marks literal and escapes markup", () => {
  assert.equal(escapeHtmlText(`3'1" in CM: 93.98 cm | Height`), `3'1" in CM: 93.98 cm | Height`);
  assert.equal(escapeHtmlText("A & B < C > D"), "A &amp; B &lt; C &gt; D");
});

test("unescapeHeightMarksInHtml restores literal marks in title and H1 text", () => {
  const html = [
    "<html><head>",
    "<title>3&#x27;1&quot; in CM: 93.98 cm | Height</title>",
    "</head><body>",
    "<h1>6&#x27;11&quot; in CM: 210.82 cm</h1>",
    "</body></html>",
  ].join("");
  const next = unescapeHeightMarksInHtml(html);
  assert.match(next, /<title>3'1" in CM: 93.98 cm \| Height<\/title>/);
  assert.match(next, /<h1>6'11" in CM: 210.82 cm<\/h1>/);
  assert.doesNotMatch(next, /&#x27;|&quot;/);
});

test("unescapeHeightMarksInHtml keeps meta attributes quote-safe", () => {
  const description = '<meta name="description" content="Compare heights from 4&#x27;0 to 7&#x27;0 in centimeters."/>';
  const ogTitle = '<meta property="og:title" content="3&#x27;1&quot; in CM: 93.98 cm | Height"/>';
  const twitterTitle = '<meta name="twitter:title" content="6&#x27;11&quot; in CM: 210.82 cm | Height"/>';
  assert.equal(
    unescapeHeightMarksInHtml(description),
    '<meta name="description" content="Compare heights from 4\'0 to 7\'0 in centimeters."/>',
  );
  assert.equal(
    unescapeHeightMarksInHtml(ogTitle),
    "<meta property=\"og:title\" content='3\u20321\" in CM: 93.98 cm | Height'/>",
  );
  assert.equal(
    unescapeHeightMarksInHtml(twitterTitle),
    "<meta name=\"twitter:title\" content='6\u203211\" in CM: 210.82 cm | Height'/>",
  );
  assert.doesNotMatch(unescapeHeightMarksInHtml(ogTitle), /&quot;/);
  assert.doesNotMatch(unescapeHeightMarksInHtml(twitterTitle), /&quot;/);
});

test("canonicalizeHomepageUrlsInHtml adds the homepage trailing slash once", () => {
  const html = [
    '<link rel="canonical" href="https://inchiscm.com"/>',
    '<meta property="og:url" content="https://inchiscm.com"/>',
    '<meta property="og:image" content="https://inchiscm.com/og-image.png"/>',
    '<a href="https://inchiscm.com/6-11-in-cm">6\'11"</a>',
  ].join("");
  const next = canonicalizeHomepageUrlsInHtml(html);
  assert.match(next, /rel="canonical" href="https:\/\/inchiscm.com\/"/);
  assert.match(next, /property="og:url" content="https:\/\/inchiscm.com\/"/);
  assert.match(next, /content="https:\/\/inchiscm.com\/og-image.png"/);
  assert.match(next, /href="https:\/\/inchiscm.com\/6-11-in-cm"/);
  assert.doesNotMatch(next, /https:\/\/inchiscm.com\/\//);
});
