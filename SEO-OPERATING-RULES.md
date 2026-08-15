# SEO Operating Rules

## Site scope

Inch is CM is a focused Length & Size Converter. Its approved topics are:

- inches, centimeters, millimeters, meters, and kilometers
- feet, yards, and miles
- height conversion
- screen size
- product dimensions

Do not expand into weight, temperature, currency, finance, BMI, shoe size, clothing size, or unrelated calculators.

## Quality and anti-downgrade rules

1. No infinite programmatic pages or mass page generation. Only values approved in `seo-page-policy.json` may be generated or included in the sitemap.
2. No thin pages. Every indexable programmatic page must contain a direct answer, formula, usable prefilled converter, practical context, concise FAQ, and relevant internal links.
3. No keyword stuffing, misleading titles, clickbait, copied competitor content, or fake expertise.
4. No parameter indexing. Query parameter pages must stay out of the sitemap and internal links, and every indexable page must point search engines toward its clean canonical route. Do not use `robots.txt` as the primary canonicalization method because blocked pages cannot expose their canonical metadata.
5. Keep internal links useful and topical. Do not add giant unrelated link blocks or footer spam.
6. Expand only when Google Search Console data demonstrates relevant demand, such as unmatched queries, strong impressions, or positions 8–20.
7. Improve or remove weak pages instead of multiplying templates. Page-count changes require review and `npm run seo:check`.
8. AdSense is paused until the site has stable organic traffic and passes a separate monetization review.
9. If monetization is enabled later, ads must never appear above the first usable converter, imitate controls, overlap content, or create layout shift.
10. Existing pages must not be deleted, redirected, noindexed, removed from the sitemap, canonicalized to another page, or replaced by a generic hub. Current URLs must stay live, indexable, self-canonical, internally accessible, and useful. Improve weak pages instead of removing them.
11. No indexable route may be published unless its final static HTML contains a unique title, useful description, self-referencing canonical, visible H1 and answer, valid matching JSON-LD, and sitemap entry.
12. Meta descriptions must be page-specific, readable, accurate, non-clickbait, and useful as search snippets. Exact conversion pages should include the stable direct numerical answer. Do not pad descriptions with keyword lists or generic SEO filler.

Quality, user usefulness, Google trust, and crawl efficiency take priority over publishing volume.
