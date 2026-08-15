# Meta Description Audit

Last updated: 2026-08-10

## Google-aligned rules

- Write a different description for every indexable page.
- Describe the specific page, not only the whole website.
- Include the direct answer for exact conversion pages, such as `10 inches equals exactly 25.4 centimeters`.
- Keep wording natural and useful for a search snippet.
- Avoid keyword lists, exaggerated claims, fake urgency, and clickbait.
- Keep descriptions concise. Google may choose another snippet, but clear page-specific descriptions give it a better source.

## Current implementation

- Static route descriptions are stored in `src/data/page-registry/static.ts`.
- Programmatic inch, centimeter, height, and guide descriptions are generated from the typed page registry in `src/data/page-registry/content.tsx`.
- The final exported HTML is checked by `scripts/meta-description-check.mjs`.

## Current audit result

- Sitemap URLs checked: 441.
- Missing meta descriptions: 0.
- Duplicate meta descriptions: 0.
- Placeholder or unfinished descriptions: 0.
- Overlong descriptions above the project safety limit: 0.
- Exact conversion pages include the direct numerical answer in the description.

## Ongoing rule

Run `npm run verify` before deployment. It now includes `npm run meta:check`, which validates final exported HTML after the build.
