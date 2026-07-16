# SEO Operating Rules

These rules protect Inch is CM from thin-content, crawl-waste, and advertising-quality risks.

1. No infinite programmatic pages. Only values listed by `seo-page-policy.json` may be statically generated or included in the sitemap.
2. No thin pages. Every indexable conversion page must provide a direct answer, formula, usable prefilled converter, nearby conversions, reverse conversion path, context, FAQ, and internal links.
3. No parameter indexing. Query-string URLs such as `/inches-to-cm?value=10` are never added to the sitemap and canonicalize to a clean non-parameter route.
4. Expansion is evidence-led. New value ranges or content clusters require Google Search Console evidence showing impressions, ranking opportunity, or unmatched search intent.
5. Ads never block the converter. No ad may appear before the first usable converter, overlap controls, imitate buttons, or cause layout shift.
6. Page-count changes require review. `npm run seo:check` must pass before deployment and the programmatic route count must remain below the policy limit.
7. Quality beats coverage. Pages with no durable search value should be improved, consolidated, removed from the sitemap, or deleted rather than multiplied.
