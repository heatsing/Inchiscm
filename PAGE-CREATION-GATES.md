# Page Creation Gates

Last updated: 2026-07-26

This file defines strict requirements for proposing future pages on inchiscm.com. It exists to prevent scaled thin content, duplicate query pages, and unsafe programmatic SEO.

## Hard rule

No new page may be created unless it passes every gate below. Passing a gate only allows a proposal; it does not authorize implementation, indexing, deployment, or GSC submission.

## Required gates

| Gate | Requirement | Pass standard |
| --- | --- | --- |
| Distinct intent | The page answers a search intent not already satisfied by an existing page | The intent differs by task, not just wording |
| Existing-page fit | An existing page cannot satisfy the query with a small improvement | Existing pages are reviewed first |
| Evidence | GSC, credible keyword data, SERP evidence, or first-party user data supports demand | Evidence is documented with date and source |
| Unique value | The page can provide functional or informational value beyond a number swap | Includes tool, table, context, examples, FAQ, or asset |
| No duplicate variant | It is not a punctuation, spacing, synonym, or number-only duplicate | Variants map to canonical existing pages |
| Internal-link position | The page has a natural parent hub and supporting links | Parent hub and 3-5 links are defined before build |
| Human-value review | A human reader would find it useful without caring about SEO | Pass/fail reviewer notes are recorded |
| Quality template | Direct answer, formula, converter or tool, context, FAQ, and related links are possible | Thin pages fail |
| Index safety | No query parameters, no infinite route generation, no uncontrolled pagination | Static route must be approved in policy |
| Monetization safety | Ads are not required for the page to make sense | AdSense remains paused |

## Exact query variant consolidation

These variants must map to one canonical page:

- `24 inch to cm`
- `24inch to cm`
- `24 inches to cm`
- `24in to cm`
- `convert 24 inches to cm`

Canonical target: `/24-inches-in-cm`

Do not create separate pages for punctuation, spacing, casing, singular/plural, or shorthand-only variants.

## Examples of blocked page proposals

| Proposal | Decision | Reason |
| --- | --- | --- |
| `/24inch-to-cm` | Block | Duplicate punctuation/spacing variant of `/24-inches-in-cm` |
| `/convert-24-inches-to-cm` | Block | Same exact conversion intent |
| `/24-in-to-cm` | Block | Same shorthand intent |
| Unlimited `/101-inches-in-cm` to `/10000-inches-in-cm` | Block | Mass page generation |
| `/best-inch-to-cm-converter` | Block | Clickbait/commercial wording without distinct function |
| `/shoe-size-to-cm` | Block | Outside approved scope |

## Validation pool process

Queries may be held in a validation pool before page creation. Current examples:

- `how big is 24 inches`
- `cm to feet and inches`
- `mm to inches`
- `laptop screen size in cm`
- `tv size in cm`
- `product dimensions converter`

For each validation-pool query, collect:

1. query text;
2. source, such as GSC, keyword tool, SERP review, or user request;
3. matching existing page, if any;
4. whether a current page can be improved instead;
5. expected unique page value;
6. parent hub;
7. risk of overlap or thinness.

## Evidence thresholds

Use conservative thresholds:

- For early launch data under 100 impressions, do not create pages.
- For 100 to 1,000 impressions, prefer improving existing pages.
- For repeated 7-day query evidence with no matching page, consider a brief.
- For new guide pages, require both search intent and useful non-generic content.
- For new programmatic groups, require owner review and an updated page policy cap.

## Brief requirement before implementation

Every proposed page must have a short brief:

- primary query cluster;
- target URL;
- parent hub;
- direct answer;
- required calculator/tool/table;
- examples;
- FAQ;
- internal links;
- why an existing page cannot satisfy the intent;
- how the page avoids thin content.

## Stop conditions

Stop page creation if:

- GSC shows declining crawl/index quality;
- indexed pages rise faster than useful traffic;
- multiple pages compete for the same query;
- pages become repetitive;
- the page exists mainly for AdSense inventory;
- the topic drifts outside length and size conversion.

The default decision for a new page is "no" until evidence makes it clearly useful.
