# GSC CTR and Top 10 Optimization Audit

Last updated: 2026-08-09

## Current GSC summary

Supplied 3-month data:

- Impressions: 43,300
- Clicks: 4
- Average position: 20.8

Interpretation: the site is receiving discovery and mid-page ranking exposure, but CTR is extremely low and many useful conversion pages likely sit in positions 10-30. The correct response is stronger conversion-page usefulness and clearer snippets, not generic AI articles or duplicate URL variants.

## Priority clusters

| Cluster | Existing target pages | Priority reason | Action |
| --- | --- | --- | --- |
| Inch to cm | `/`, `/inches-to-cm`, exact pages such as `/10-inches-in-cm` and `/24-inches-in-cm` | Core query family and highest topical relevance | Improve existing canonical pages with instant answers, formula, table, examples, FAQ, and related links |
| CM to inches | `/cm-to-inches`, exact pages such as `/25-4-cm-in-inches` and `/100-cm-in-inches` | Reverse intent with clear conversion task | Strengthen tables, rounding guidance, and related cm links |
| Feet and height | `/feet-to-cm`, `/height-converter`, `/height-chart`, exact height pages | Prior GSC data showed height pages received early impressions | Keep height pages direct-answer-first with nearby height tables |
| Length converters | `/length-converters`, unit-pair pages such as `/feet-to-inches`, `/meters-to-feet`, `/miles-to-km` | Supports topical breadth without unrelated calculators | Use hub links and exact formulas, but avoid mass unit-name swaps |

## Duplicate URL rule

Do not create `/1-inch-to-cm`, `/2-inch-to-cm`, `/10-inch-to-cm`, or similar duplicate variants while canonical exact pages already exist:

- `/1-inch-in-cm`
- `/2-inches-in-cm`
- `/10-inches-in-cm`
- `/12-inches-in-cm`
- `/20-inches-in-cm`

Those existing pages should rank for `1 inch to cm`, `1 inch in cm`, `convert 1 inch to cm`, and close variants. Publishing separate `*-inch-to-cm` pages would create cannibalization risk and violate the project consolidation policy.

## Template upgrade completed

Existing exact conversion templates now include:

- visible direct answer above the fold;
- usable converter;
- formula;
- nearby conversion table;
- value-specific examples;
- common conversion links;
- FAQ;
- related converters;
- WebPage, WebApplication, FAQPage, and BreadcrumbList JSON-LD where appropriate.

Core converter pages now include:

- instant example result;
- converter tool;
- common examples;
- conversion formula;
- conversion table;
- long-form tool SEO content;
- FAQ schema through the shared tool content component.

## What to watch next in GSC

Prioritize query/page exports for:

- pages with impressions but 0 clicks;
- queries ranking positions 10-30;
- exact inch pages, especially `/10-inches-in-cm`, `/12-inches-in-cm`, `/20-inches-in-cm`, and `/24-inches-in-cm`;
- cm reverse pages such as `/25-4-cm-in-inches`, `/100-cm-in-inches`, and `/170-cm-in-inches`;
- height pages that previously received impressions.

Do not publish duplicate URL variants or a new batch until the current public set has observation data.
