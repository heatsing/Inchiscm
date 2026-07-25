# GSC Query to Page Map

This map keeps observed Google Search Console query variants tied to the correct existing inchiscm.com pages. It is a control document: punctuation, spacing, and wording variants should consolidate into the existing canonical height page, not become separate pages.

## 7-day height query mapping

| Observed query variant | Correct existing page | Notes |
| --- | --- | --- |
| `6'11 in cm` | `/6-11-in-cm` | Apostrophe shorthand maps to the canonical 6 feet 11 inches page. |
| `6 11 feet in cm` | `/6-11-in-cm` | Space-separated wording variant; do not create a duplicate page. |
| `6 11 in cm` | `/6-11-in-cm` | Space-separated shorthand; do not create a duplicate page. |
| `6.11 feet in cm` | `/6-11-in-cm` | Ambiguous punctuation variant observed in GSC; keep consolidated to the existing 6'11" page unless query data later proves a different intent. |
| `4'7 in cm` | `/4-7-in-cm` | Apostrophe shorthand maps to the canonical 4 feet 7 inches page. |
| `4 foot 7 in cm` | `/4-7-in-cm` | Singular wording variant; do not create a duplicate page. |
| `5'5 in cm` | `/5-5-in-cm` | Apostrophe shorthand maps to the canonical 5 feet 5 inches page. |
| `6'8 in cm` | `/6-8-in-cm` | Apostrophe shorthand maps to the canonical 6 feet 8 inches page. |
| `4'10 in cm` | `/4-10-in-cm` | Apostrophe shorthand maps to the canonical 4 feet 10 inches page. |

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
| 24 inch to cm | `24 inch to cm`, `24inch to cm`, `24 inches to cm`, `24in to cm`, `convert 24 inches to cm` | `/24-inches-in-cm` | Improve the existing page only; do not create a duplicate page. |
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

## Rule

Use the existing height-page template to answer these variants naturally. Do not publish separate pages for punctuation-only, spacing-only, or wording-only variants.
