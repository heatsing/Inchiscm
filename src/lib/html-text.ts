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
    : value.replace(withInchMark, "$1'$2&quot;");
  return withInch.replace(feetOnly, "$1'$2");
}

const FEET_PRIME = "\u2032";

function isSocialTitleMeta(tag: string) {
  return (
    /\bproperty\s*=\s*["']og:title["']/i.test(tag)
    || /\bname\s*=\s*["']twitter:title["']/i.test(tag)
  );
}

function decodeHeightMarkEntities(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'");
}

function rewriteSocialHeightTitleMeta(tag: string) {
  if (!isSocialTitleMeta(tag)) return tag;
  return tag.replace(/(\bcontent\s*=\s*)(["'])([^"']*)\2/i, (match, prefix: string, _quote: string, value: string) => {
    const decoded = decodeHeightMarkEntities(value);
    const social = decoded.replace(/(\d+)'(\d+)"/g, `$1${FEET_PRIME}$2"`);
    if (social === decoded) return match;
    // ASCII " cannot sit in content="..." without &quot;; use ′ for feet so og/twitter can keep a literal inch " in content='...'.
    return `${prefix}'${social}'`;
  });
}

const HOME_ORIGIN = "https://inchiscm.com";

/**
 * Next metadata emits the homepage canonical/og:url as https://inchiscm.com
 * even when absoluteUrl("/") is https://inchiscm.com/. Restore the slash.
 */
export function canonicalizeHomepageUrlsInHtml(html: string) {
  return html.replaceAll(`${HOME_ORIGIN}"`, `${HOME_ORIGIN}/"`);
}

/**
 * React 19 / Next metadata HTML-encodes apostrophes and quotes. Restore
 * feet-inches notation in exported HTML:
 * - text nodes (title, H1, body): literal 3'1"
 * - quoted attributes: literal apostrophe, keep &quot; so content="3'1&quot;" stays valid
 * - og/twitter titles: single-quoted content with ′ + literal " (no &quot;)
 */
export function unescapeHeightMarksInHtml(html: string) {
  // Rewrite social titles first, while encoded marks still let content="..." parse.
  const socialTitles = html.replace(/<meta\b[^>]*>/gi, (tag) => rewriteSocialHeightTitleMeta(tag));
  const textNodes = socialTitles.replace(/>([^<]*)</g, (match, text: string) => (
    `>${unescapeHeightMarksInText(text, true)}<`
  ));
  const attributes = textNodes.replace(/=\s*(["'])([^"']*)\1/g, (match, quote: string, value: string) => (
    `=${quote}${unescapeHeightMarksInText(value, false)}${quote}`
  ));
  return canonicalizeHomepageUrlsInHtml(attributes);
}
