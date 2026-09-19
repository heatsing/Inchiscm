# No Page Deletion Policy

This is a permanent production rule for inchiscm.com.

Existing pages must not be deleted, removed from Google, redirected, noindexed, or canonicalized to another page as a routine SEO tactic. The site strategy is to improve existing indexable pages rather than shrink the live URL set.

Every existing URL must remain:

- live;
- indexable;
- self-canonical;
- included in the sitemap;
- internally accessible;
- useful to users.

Prohibited actions:

- deleting existing routes;
- returning 404 or 410 for existing routes;
- adding `noindex` to existing pages;
- removing existing pages from the sitemap;
- redirecting existing pages to other pages;
- canonicalizing existing pages to another page;
- reducing the existing route count;
- replacing existing pages with a generic hub;
- changing existing URLs.

If a page appears weak, the required response is improvement first: make the page more useful, more accurate, more distinct, and better linked from the correct parent hub.

Owner-authorized exception: clear length-unit synonym duplicates may 301 to one stronger canonical. The decided pairs live in `src/data/page-registry/unit-pair-synonyms.json` and are written to `out/_redirects` (above the missing-path 404 fallback). Do not extend that list to numeric inch/cm inventory or height `F-I-in-cm` pages.

Owner-authorized exception: 404 slug aliases of *already published* numeric inch pages may 301 in one hop to the existing canonical. Typical aliases are `/{n}-inches-to-cm` and `/{n}-inch-to-cm` (and spelled `/{n}-inches-in-centimeters`) → `/{n}-inch(es)-in-cm`. These aliases are not indexable pages and must not appear in the sitemap. Do not redirect the canonical numeric pages themselves, height `F-I-in-cm` pages, or unpublished values.

Owner-authorized exception: 404 wording aliases of *already published* height pages may 301 in one hop to the existing canonical. Typical aliases are `/{feet}-feet-{inches}-inches-in-cm` and `/{feet}-foot-{inches}-inches-in-cm` → `/{feet}-{inches}-in-cm`, plus the closed feet/foot and zero-inch variants of whole-foot pages → `/{feet}-feet-in-cm`. GSC compact/dotted/apostrophe aliases (`/{feet}ft{inches}-in-cm`, `/{feet}-{inches}-feet-in-cm`, `/{feet}'{inches}-in-cm`) and remaining navigational remainder-height aliases (`/how-tall-is-{feet}-{inches}-in-cm`, `/{feet}-{inches}-height-in-cm`, `/{feet},{inches}-in-cm`, glued `/{feet}{inches}-in-cm` only when inches are 10 or 11) are the same closed published-height set. These aliases are not indexable pages and must not appear in the sitemap. Do not redirect the canonical height pages themselves, treat `/5-7-inches-to-cm` or `/57-in-cm` as a height, or invent unpublished heights.

Owner-authorized exception: unreduced eighth-inch fraction aliases `/fraction-2-8-inch-to-cm`, `/fraction-4-8-inch-to-cm`, and `/fraction-6-8-inch-to-cm` may 301 one hop to the reduced canonicals `/fraction-1-4-inch-to-cm`, `/fraction-1-2-inch-to-cm`, and `/fraction-3-4-inch-to-cm`. These aliases must stay out of the sitemap and must not become indexable pages. Do not expand that closed set to 16ths, 64ths, or other unreduced fractions.

Any other future exception would require explicit owner approval, documented GSC evidence, confirmation that the URL has no meaningful demand or external value, and a separate production task. The default decision is always: keep the page live and improve it.
