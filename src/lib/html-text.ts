/**
 * Escape only markup-significant characters so feet/inches marks stay
 * literal `'` and `"` in HTML text nodes (React 19 otherwise emits &#x27; / &quot;).
 */
export function escapeHtmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const ESCAPED_APOS = "(?:&#x27;|&apos;|&#39;)";
const ESCAPED_QUOT = "(?:&quot;)";

function unescapeHeightMarksInText(value: string, allowLiteralInchQuote: boolean) {
  const withInchMark = new RegExp(`(\\d+)${ESCAPED_APOS}(\\d+)${ESCAPED_QUOT}`, "g");
  const feetOnly = new RegExp(`(\\d+)${ESCAPED_APOS}(\\d+)`, "g");
  const withInch = allowLiteralInchQuote
    ? value.replace(withInchMark, "$1'$2\"")
    : value.replace(withInchMark, "$1'$2");
  return withInch.replace(feetOnly, "$1'$2");
}

/**
 * React 19 / Next metadata HTML-encodes apostrophes and quotes. Restore
 * feet-inches notation in exported HTML:
 * - text nodes (title, H1, body): literal 3'1"
 * - quoted attributes: literal apostrophe, keep &quot; when present so content="..." stays valid
 */
export function unescapeHeightMarksInHtml(html: string) {
  const textNodes = html.replace(/>([^<]*)</g, (match, text: string) => (
    `>${unescapeHeightMarksInText(text, true)}<`
  ));
  return textNodes.replace(/=\s*(["'])([^"']*)\1/g, (match, quote: string, value: string) => (
    `=${quote}${unescapeHeightMarksInText(value, false)}${quote}`
  ));
}
