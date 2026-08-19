# GSC Expansion Workflow

This workflow controls future inchiscm.com SEO expansion. It prevents the site from turning mathematical permutations into thin indexable pages.

## Inputs

Use real exported data, not guesses:

- GSC query export
- GSC page export
- clicks
- impressions
- CTR
- average position
- device
- country
- indexed pages count
- crawled but not indexed count
- discovered but not indexed count
- sitemap submitted and processed status

## Process

1. Join query data to the best matching existing URL.
2. Classify each query:
   - core inch/cm
   - exact numeric inch
   - exact numeric cm
   - height feet/inches
   - reverse cm height
   - fraction/ruler
   - screen or product dimension
   - unrelated, ignore
3. Find opportunities:
   - impressions above a useful threshold
   - average position 8-40
   - low CTR with a clear matching page
   - repeated query with no adequate existing URL
4. Decide the smallest action:
   - improve an existing page
   - improve internal links
   - improve visible direct answer
   - improve metadata only when it is clearly weak
   - publish one curated landing page only when no existing page can satisfy the query
   - do nothing when data is too thin
5. Rebuild and validate.
6. Wait for enough fresh GSC data before another expansion decision.

## Page creation gate

Do not publish a new SEO URL unless it has:

- distinct search intent;
- server-rendered direct answer;
- exact formula or calculation method;
- working tool or useful reference module;
- information gain beyond a changed number;
- relevant internal links;
- self-canonical metadata;
- sitemap inclusion;
- valid JSON-LD that matches visible content.

## Protected rules

- Do not create query-parameter index pages.
- Do not create punctuation-only variants.
- Do not create decimal-feet duplicates for feet-and-inches notation.
- Do not create unrelated calculators.
- Do not add Spanish or other language pages without a separate localization plan.
- Do not expand from math alone.
- Existing URLs stay live, indexable, self-canonical, and sitemap-included.
