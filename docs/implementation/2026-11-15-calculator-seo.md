# Calculator and SEO implementation

Approved scope: the Inchiscm Bing/Google action plan reviewed on 2026-11-15 and the owner's instruction to implement it directly.

Constraints: preserve published URLs, canonical rules, redirects and existing numeric-conversion results; do not expand the URL inventory. Static content and initial calculator results must agree. No production deployment is implied by a pull request.

1. Repair screen tools: shared ratio-specific defaults, 21:9 and custom ratios, width/height-to-diagonal and resolution-to-ratio tools. Add meaningful numerical regression tests before implementation.
2. Improve product dimensions: 2D/3D mode, paste, full-result copy, finite input/output validation. Update examples and guidance on the two existing dimensions pages.
3. Improve useful page content: real common-size reference table; screen comparison and CSV/printable reference; remove public SEO-planning language. Keep factual formulas and relevant internal links.
4. Validate: tests, lint, static build and existing SEO/site/performance checks; inspect emitted HTML for tool defaults and content. Independent branch review before PR.

Shared interfaces: screen route defaults are consumed by generated guide content and calculator props; use one helper to prevent drift. DimensionsConverter remains compatible with existing required defaults.

Acceptance examples: 34 in at 21:9 ≈ 79.38 × 34.02 cm; 16 in at 16:10 ≈ 34.46 × 21.54 cm; 30 × 40 cm diagonal = 50 cm; 1920 × 1080 = 16:9; 2560 × 1600 = 16:10; 10 × 15 in = 25.4 × 38.1 cm; 22 × 14 × 9 in = 55.88 × 35.56 × 22.86 cm.

Baseline: 64 tests passed on b137fbd. Review focus: invalid/overflow inputs, hydration/default consistency, ratio precision, 2D-to-3D state changes, clipboard failures, unchanged canonical inventory. Browser testing may require a deployment preview; do not claim browser coverage from static checks.

## Completion evidence

Implemented all four tasks. Final `npm run verify` passed: 77 tests, ESLint, production static build, SEO/meta/site checks, HTML audit and performance budgets. The 581-URL sitemap inventory and redirect policy remain unchanged; 14,136 crawlable internal links resolve to registered routes. Exported HTML spot checks confirmed 21:9/34-inch, 16:10/16-inch and 4:3/27-inch defaults and the new direct answers.

Independent review found small positive screen dimensions rounding to zero and a floating-point common-ratio match at very large safe integers. Both were reproduced in failing tests and fixed; the complete suite passed afterward. Small values use scientific notation and common ratios now match exact reduced integer pairs.

Only material calculator revisions receive the new sitemap date. Minor copy-only cleanup retains the previous date. Actual browser interactions and production deployment are not covered by the local static checks; validate paste, copy, comparison, CSV and print in a deployment preview before release.
