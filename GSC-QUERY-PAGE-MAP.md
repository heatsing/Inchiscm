# GSC Query to Page Map

This map keeps observed Google Search Console query variants tied to the correct existing inchiscm.com pages. It is a control document: punctuation, spacing, and wording variants should consolidate into the existing canonical height page, not become separate pages.

## 2026-08-15 launch batch routing note

New query families from the complete launch batch should map to the new canonical pages only when the query intent is clearly distinct:

- Spelled unit-pair queries such as `foot to inch formula` and `inches to feet` map to `/feet-to-inches` or `/inches-to-feet`. Formula-grid aliases such as `/foot-to-inch` 301 to those dedicated converters.
- Fraction ruler queries such as `1/16 inch to mm` map to the matching `/fraction-1-16-inch-to-mm` reference page.
- Screen dimension task queries such as `tv dimensions calculator` map to the matching screen calculator page, while generic diagonal conversion still maps to `/screen-size-converter`.
- Chart queries should map to `/conversion-charts` or the specific chart page, not to query-parameter filtered tables.

Do not create punctuation, pluralization, or query-parameter variants of these pages.

## 7-day height query mapping

| Observed query variant | Correct existing page | Notes |
| --- | --- | --- |
| `6'11 in cm` | `/6-11-in-cm` | Apostrophe shorthand maps to the canonical 6 feet 11 inches page. `/6'11-in-cm` and `/6%E2%80%9911-in-cm` 301 here. |
| `6 11 feet in cm` | `/6-11-in-cm` | Space-separated wording variant; `/6-11-feet-in-cm` 301s to this canonical. Do not create a duplicate page. |
| `6 11 in cm` | `/6-11-in-cm` | Space-separated shorthand; do not create a duplicate page. Canonical is already `/6-11-in-cm`. |
| `6.11 feet in cm` | `/6-11-in-cm` | Ambiguous punctuation variant observed in GSC; `/6-11-feet-in-cm` 301s here. Keep consolidated to the existing 6'11" page unless query data later proves a different intent. |
| `6ft11 in cm` | `/6-11-in-cm` | Compact `NftM` wording; `/6ft11-in-cm` 301s to this canonical. |
| `6ft 11in in cm` | `/6-11-in-cm` | Compact `Nft-Min` wording; `/6ft-11in-in-cm` 301s to this canonical. |
| `4'7 in cm` | `/4-7-in-cm` | Apostrophe shorthand maps to the canonical 4 feet 7 inches page. |
| `4 foot 7 in cm` | `/4-7-in-cm` | Singular wording variant; `/4-foot-7-inches-in-cm` 301s to this canonical. Do not create a duplicate page. |
| `5 feet 7 inches in cm` | `/5-7-in-cm` | Spelled feet/inches wording; `/5-feet-7-inches-in-cm` and `/5-foot-7-inches-in-cm` 301 one hop to this canonical. |
| `5'5 in cm` | `/5-5-in-cm` | Apostrophe shorthand maps to the canonical 5 feet 5 inches page. |
| `6'8 in cm` | `/6-8-in-cm` | Apostrophe shorthand maps to the canonical 6 feet 8 inches page. |
| `4'10 in cm` | `/4-10-in-cm` | Apostrophe shorthand maps to the canonical 4 feet 10 inches page. |

## GSC Recovery Batch 1 target map

These query variants are routed to existing URLs only. Do not create punctuation, spacing, decimal-notation, Spanish, or duplicate height pages for these variants.

| Existing page | Primary query | Useful variants to answer naturally |
| --- | --- | --- |
| `/6-11-in-cm` | `6'11 in cm` | `6 11 feet in cm`, `6'11 en cm`, `6.11 feet in cm`, `6'11 to cm` |
| `/4-7-in-cm` | `4'7 in cm` | `4 foot 7 in cm`, `4 7 in cm`, `4'7 to cm` |
| `/6-8-in-cm` | `6'8 in cm` | `6 8 in cm`, `6 foot 8 in cm`, `6'8 to cm` |
| `/4-10-in-cm` | `4'10 in cm` | `4 10 in cm`, `4.10 feet in cm`, `4 foot 10 in cm` |
| `/6-4-in-cm` | `6'4 in cm` | `6 foot 4 in cm`, `6 4 in cm`, `6'4 to cm` |
| `/6-10-in-cm` | `6'10 in cm` | `6 10 feet in cm`, `6.10 feet in cm`, `6 foot 10 in cm` |

Notation rule:

- Apostrophe notation means feet plus remaining inches, for example `6'11"` means 6 feet and 11 inches.
- Decimal feet notation is not mathematically the same as feet-and-inches notation. Explain the difference where it helps users, but do not claim equivalence.

## Priority existing pages from the supplied 7-day data

| Page | Impressions | Clicks | Average position |
| --- | ---: | ---: | ---: |
| `/6-11-in-cm` | 6,268 | 0 | 9.61 |
| `/4-7-in-cm` | 2,254 | 1 | 9.02 |
| `/5-5-in-cm` | 1,628 | 0 | 20.42 |
| `/6-3-in-cm` | 1,420 | 0 | 14.31 |
| `/6-1-in-cm` | 1,414 | 0 | 15.21 |
| `/6-8-in-cm` | 1,293 | 0 | 11.37 |
| `/6-4-in-cm` | 1,286 | 0 | 13.01 |
| `/4-10-in-cm` | 1,250 | 0 | 10.97 |
| `/6-5-in-cm` | 1,221 | 0 | 13.67 |
| `/6-10-in-cm` | 1,048 | 1 | 11.71 |

## OpenSEO keyword opportunity map

OpenSEO MCP metrics were not available in the current Codex tool context, so volume, keyword difficulty, and CPC are intentionally not recorded here. This map uses current GSC observations, existing page coverage, and search-intent clustering. Do not treat it as permission to mass-publish new pages.

| Keyword cluster | Example queries | Current or proposed target | Action |
| --- | --- | --- | --- |
| 24 inch to cm | `24 inch to cm`, `24inch to cm`, `24 inches to cm`, `24in to cm`, `convert 24 inches to cm` | `/24-inches-in-cm` | Improve the existing page only; `/24-inches-to-cm` 301s to this canonical. Do not create a duplicate page. |
| Height to cm | `6'11 in cm`, `4'7 in cm`, `5'5 in cm`, `feet inches to cm` | Existing height pages and `/height-converter` | Continue observing GSC data before more template changes. |
| Inch to cm core | `inch to cm`, `inches to cm`, `inches to centimeters` | `/` and `/inches-to-cm` | Keep converter UX strong and support with chart and guide links. |
| CM to inches | `cm to inches`, `centimeters to inches`, `convert cm to inches` | `/cm-to-inches` | Optimize existing hub and exact cm pages when GSC data supports it. |
| Screen dimensions | `screen size inches to cm`, `15.6 inch screen in cm`, `TV size in cm` | `/screen-size-converter` and existing screen-size inch pages | Strengthen the existing screen hub before considering guides. |
| Real-world size | `how big is 10 inches`, `how big is 12 inches`, `how big is 24 inches` | Existing how-big pages; `/24-inches-in-cm` for 24-inch intent | Keep `how big is 24 inches` in the validation pool; do not create it until GSC shows demand. |
| Future reverse tools | `cm to feet and inches`, `mm to inches` | Proposed future tools only if validated | Hold for Phase 2 data-driven expansion. |

## Validation pool

These queries are relevant but should not become pages without stronger GSC or keyword-tool evidence:

- `how big is 24 inches`
- `cm to feet and inches`
- `mm to inches`
- `laptop screen size in cm`
- `tv size in cm`
- `product dimensions converter`

## Height alias inventory (PR #12 vs later GSC gaps)

Already present after PR #12 (spelled feet/foot wording, closed published set 36–96 total inches):

- `/{N}-feet-{M}-inches-in-cm`, `/{N}-foot-{M}-inches-in-cm`
- `/{N}-feet-{M}-inch-in-cm`, `/{N}-foot-{M}-inch-in-cm`
- `/{N}-feet-{M}-in-cm`, `/{N}-foot-{M}-in-cm`
- Whole feet: `/{N}-foot-in-cm`, `/{N}-feet-0-inches-in-cm`, `/{N}-foot-0-inches-in-cm`

Added for remaining GSC height-wording gaps (still one-hop 301s, not indexable pages):

- `/{N}-{M}-feet-in-cm`, `/{N}-{M}-foot-in-cm` (`6 11 feet in cm`)
- `/{N}ft{M}-in-cm` (`6ft11` / `NftM`)
- `/{N}ft-{M}-in-cm`, `/{N}ft-{M}in-in-cm` (`Nft-M` / `Nft-Min`)
- `/{N}ft{M}in-in-cm` (`NftMin`)
- Apostrophe paths `/{N}'{M}-in-cm` plus curly `’` (U+2019) and percent-encoded `%27` / `%E2%80%99`

Not added (ambiguous or already canonical):

- `/{N}-{M}-in-cm` is the live height canonical when inches are 0–11
- `/{N}-{M}-inches-to-cm` stays a hard 404 (decimal inches, e.g. 5.7 in)

Reverse cm titles stay on the existing numeric helper. `/76-2-cm-in-inches`, `/50-8-cm-in-inches`, `/93-cm-in-inches`, and `/36-cm-in-inches` put the exact inch result in the title and H1.

## Rule

Use the existing height-page template to answer these variants naturally. Do not publish separate pages for punctuation-only, spacing-only, or wording-only variants.
