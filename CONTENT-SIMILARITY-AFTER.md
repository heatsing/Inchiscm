# Content Similarity After

Generated from `reports/post-expansion-content-similarity.csv`. This report flags template clone risk without using random synonym changes as a solution.

## Summary

- HIGH CLONE RISK groups: 20
- MEDIUM CLONE RISK groups: 36
- LOW CLONE RISK groups: 6

## Findings

- Exact inch and centimeter pages necessarily share formulas and calculation language. That is acceptable for accuracy, but repeated FAQ and generic precision text should be reduced over time.
- This batch added structured alternate-unit tables, notable relationships, ruler visualization, and height scale modules to increase product utility without adding URLs.
- Future improvement should remove repetitive FAQ where the direct answer already handles the question.

## High clone risk samples

| Repeated normalized paragraph | Page count | Sample pages |
| --- | ---: | --- |
| the inch#to#centimeter factor is exact: # inch = # centimeters# only the displayed decimal places are rounded# | 154 | /0-25-inch-in-cm /0-5-inch-in-cm /0-75-inch-in-cm /1-inch-in-cm /1-25-inches-in-cm /1-5-inches-in-cm /1-75-inches-in-cm /2-inches-in-cm |
| multiply # by # the calculation is # × # = # cm# | 154 | /0-25-inch-in-cm /0-5-inch-in-cm /0-75-inch-in-cm /1-inch-in-cm /1-25-inches-in-cm /1-5-inches-in-cm /1-75-inches-in-cm /2-inches-in-cm |
| yes# one inch is defined as exactly # cm# so this multiplication is exact# | 154 | /0-25-inch-in-cm /0-5-inch-in-cm /0-75-inch-in-cm /1-inch-in-cm /1-25-inches-in-cm /1-5-inches-in-cm /1-75-inches-in-cm /2-inches-in-cm |
| # inches is # millimeters because # inch equals # mm# | 153 | /0-25-inch-in-cm /0-5-inch-in-cm /0-75-inch-in-cm /1-25-inches-in-cm /1-5-inches-in-cm /1-75-inches-in-cm /2-inches-in-cm /2-25-inches-in-cm |
| for everyday use you can round# but keep the exact value for specifications# forms# and product dimensions# | 154 | /0-25-inch-in-cm /0-5-inch-in-cm /0-75-inch-in-cm /1-inch-in-cm /1-25-inches-in-cm /1-5-inches-in-cm /1-75-inches-in-cm /2-inches-in-cm |
| centimeters convert to inches by dividing by the exact # cm#per#inch definition# fractional#inch output is a practical rounded reference# | 170 | /1-cm-in-inches /2-cm-in-inches /2-54-cm-in-inches /3-cm-in-inches /4-cm-in-inches /5-cm-in-inches /5-08-cm-in-inches /6-cm-in-inches |
| divide # by # the result is approximately # inches# | 170 | /1-cm-in-inches /2-cm-in-inches /2-54-cm-in-inches /3-cm-in-inches /4-cm-in-inches /5-cm-in-inches /5-08-cm-in-inches /6-cm-in-inches |
| most centimeter values produce repeating decimals in inches# so the displayed result is rounded to four decimal places# | 170 | /1-cm-in-inches /2-cm-in-inches /2-54-cm-in-inches /3-cm-in-inches /4-cm-in-inches /5-cm-in-inches /5-08-cm-in-inches /6-cm-in-inches |
| rounded to the nearest # inch# # cm is about # in# | 69 | /1-cm-in-inches /2-cm-in-inches /2-54-cm-in-inches /5-08-cm-in-inches /7-62-cm-in-inches /10-16-cm-in-inches /12-7-cm-in-inches /15-24-cm-in-inches |
| one inch equals exactly # centimeters# so centimeters are converted to inches by dividing by # | 170 | /1-cm-in-inches /2-cm-in-inches /2-54-cm-in-inches /3-cm-in-inches /4-cm-in-inches /5-cm-in-inches /5-08-cm-in-inches /6-cm-in-inches |
| rounded to the nearest # inch# # cm is about # # in# | 101 | /3-cm-in-inches /4-cm-in-inches /5-cm-in-inches /6-cm-in-inches /7-cm-in-inches /8-cm-in-inches /9-cm-in-inches /10-cm-in-inches |
| this range is useful for furniture# screens# storage# shipping boxes# and room planning# | 95 | /31-cm-in-inches /32-cm-in-inches /33-cm-in-inches /33-02-cm-in-inches /34-cm-in-inches /35-cm-in-inches /35-56-cm-in-inches /36-cm-in-inches |
| height conversion uses total inches first# then the exact # cm#per#inch factor# | 61 | /3-feet-in-cm /3-1-in-cm /3-2-in-cm /3-3-in-cm /3-4-in-cm /3-5-in-cm /3-6-in-cm /3-7-in-cm |
| this height is # total inches# or # meters# use the exact centimeter value when a form# profile# chart# or specification expects metric units# | 61 | /3-feet-in-cm /3-1-in-cm /3-2-in-cm /3-3-in-cm /3-4-in-cm /3-5-in-cm /3-6-in-cm /3-7-in-cm |
| first convert the height to # total inches# then multiply by # to get # cm# | 61 | /3-feet-in-cm /3-1-in-cm /3-2-in-cm /3-3-in-cm /3-4-in-cm /3-5-in-cm /3-6-in-cm /3-7-in-cm |
| # feet # inches equals exactly # centimeters# the conversion first changes the height to # total inches# then multiplies by # | 55 | /3-1-in-cm /3-2-in-cm /3-3-in-cm /3-4-in-cm /3-5-in-cm /3-6-in-cm /3-7-in-cm /3-8-in-cm |
| # is # total inches because # feet equals # inches and the remaining # inches are added after that# | 55 | /3-1-in-cm /3-2-in-cm /3-3-in-cm /3-4-in-cm /3-5-in-cm /3-6-in-cm /3-7-in-cm /3-8-in-cm |
| the calculator keeps the factor internally and rounds only the displayed result# use more decimal places for technical specifications# and round to a practical value for everyday measuring# | 53 | /inch-to-millimeter /inch-to-foot /inch-to-yard /inch-to-meter /inch-to-kilometer /inch-to-mile /centimeter-to-millimeter /centimeter-to-foot |
| for nearby length work# use the length converters hub # the inch to cm chart # or the conversion methodology # | 53 | /inch-to-millimeter /inch-to-foot /inch-to-yard /inch-to-meter /inch-to-kilometer /inch-to-mile /centimeter-to-millimeter /centimeter-to-foot |
| round only after converting# keep more decimals for specifications and fewer decimals for everyday measurements# | 53 | /inch-to-millimeter /inch-to-foot /inch-to-yard /inch-to-meter /inch-to-kilometer /inch-to-mile /centimeter-to-millimeter /centimeter-to-foot |

## Recommended next actions

1. Reduce duplicated FAQ on exact numeric pages and keep only page-specific questions.
2. Add curated value relationships where they are mathematically meaningful, such as 12 inches = 1 foot or 36 inches = 1 yard.
3. Expand fraction and screen clusters only after GSC validates demand.
4. Keep exact formula language stable; do not rewrite accurate formulas just to look unique.
