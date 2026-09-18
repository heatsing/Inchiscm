# Content Similarity After

Generated from `reports/post-expansion-content-similarity.csv`. This report flags template clone risk without using random synonym changes as a solution.

## Summary

- HIGH CLONE RISK groups: 16
- MEDIUM CLONE RISK groups: 18
- LOW CLONE RISK groups: 4
- Repeated paragraph groups in the HTML audit: 38 (down from 62)

## Findings

- Numeric `*-inch(es)-in-cm` and `*-cm-in-inches` pages no longer appear in the clone-risk CSV. Shared formula labels remain; number-swapped FAQ, rounding tips, and range prose were replaced by structured modules (equivalents, fraction, nearby published window, reverse link, optional height/screen tables).
- Remaining high-count repeats are height-page conversion steps, expansion unit-pair tool copy, and fraction-guide templates. Those cohorts were out of scope for this pass.
- Exact formula language (`inches × 2.54`) is unchanged.

## High clone risk samples

| Repeated normalized paragraph | Page count | Sample pages |
| --- | ---: | --- |
| height conversion uses total inches first# then the exact # cm#per#inch factor# | 61 | /3-feet-in-cm /3-1-in-cm /3-2-in-cm |
| this height is # total inches# or # meters# use the exact centimeter value when a form# profile# chart# or specification expects metric units# | 61 | /3-feet-in-cm /3-1-in-cm /3-2-in-cm |
| first convert the height to # total inches# then multiply by # to get # cm# | 61 | /3-feet-in-cm /3-1-in-cm /3-2-in-cm |
| # feet # inches equals exactly # centimeters# the conversion first changes the height to # total inches# then multiplies by # | 55 | /3-1-in-cm /3-2-in-cm /3-3-in-cm |
| the calculator keeps the factor internally and rounds only the displayed result# | 53 | /inch-to-millimeter /inch-to-foot /inch-to-yard |

## Recommended next actions

1. Reuse the same structured-module approach on height `*-in-cm` pages if GSC still shows template sameness there.
2. Keep exact formula language stable; do not rewrite accurate formulas just to look unique.
3. Expand fraction and screen clusters only after GSC validates demand.
