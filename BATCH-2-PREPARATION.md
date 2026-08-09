# Batch 2 Preparation Review

This file prepares Batch 2 without publishing any new URL. It intentionally does not change `seo-page-policy.json`, `pageRegistry`, `generateStaticParams()`, sitemap output, canonicals, or public routes.

## Current status

- Current public sitemap URL count after Batch 1: 441.
- Batch 2 inventory candidates reviewed: 75.
- Candidate: 35.
- Withhold: 27.
- Reject: 13.
- Next public release should wait for at least 14 days of GSC observation after Batch 1 unless the owner explicitly overrides the rule.

## Main finding

The automatically generated Batch 2 inventory contains several singular/plural or wording variants that would cannibalize existing pages, such as `/inch-to-cm` versus `/inches-to-cm` and `/cm-to-inch` versus `/cm-to-inches`. Those should not be published as separate URLs.

## Publication gate before any Batch 2 release

A Batch 2 page may be implemented only if it has:

- distinct search intent that is not already served by an existing URL;
- a visible working calculator or genuinely useful reference content;
- server-rendered direct answer and formula;
- unique title and meta description;
- self-canonical URL;
- WebPage and BreadcrumbList JSON-LD, plus WebApplication only when a working tool is visible;
- links from a parent hub and at least one sibling page;
- no AdSense or ad placeholder;
- no query-parameter indexing;
- no fake examples, reviews, ratings, products, or unsupported claims.

## Review file

See `BATCH-2-CANDIDATE-REVIEW.csv` for row-level decisions.
