# Codex Daily Workflow

## Daily inputs

When available, review:

- GSC clicks, impressions, CTR, and average position
- top queries and top pages
- high-impression, low-CTR queries
- queries and pages ranking in positions 8–20
- GA users, sessions, landing pages, engagement time, and events

Do not invent missing data. State clearly when decisions use general quality practices rather than current analytics.

## Early-launch guardrail

When the available GSC sample has fewer than 100 impressions, treat CTR and average position as directional rather than decision-grade data. Do not respond with broad title rewrites, page expansion, or mass indexing requests. Focus on crawlability, canonical and sitemap accuracy, page usefulness, internal links, and converter UX. A Google `site:` result count is only an estimate; use the GSC Page indexing report filtered by the submitted sitemap for index coverage decisions.

## Daily analysis

1. Find relevant queries with impressions but no matching page.
2. Find pages or queries with low CTR.
3. Find pages ranking in positions 8–20.
4. Find landing pages with weak engagement or converter usage.
5. Find pages that need stronger contextual internal links.
6. Identify topics that should not be expanded because demand is weak, intent is unrelated, or the result would be thin.

## Daily execution options

Choose the smallest evidence-backed action:

- update meta titles
- update meta descriptions
- improve visible direct answers
- add relevant internal links
- add at most one high-intent page
- write at most one high-quality guide or blog page
- improve one converter UX issue
- prune, consolidate, or noindex risky pages when needed
- make no change when the data does not support one

## Validation and reporting

Always run:

```bash
npm test
npm run seo:check
npm run lint
npm run build
npm run site:check
```

`npm run verify` runs this complete sequence and is the required Netlify build command.

Push validated changes to GitHub and let the connected Netlify Git deployment publish the static `out` directory. Do not replace production with a manual CLI deploy that contains generated `.netlify` functions.

The final report must state:

- what changed
- why it changed
- current page count
- whether conversion tests passed
- whether `seo:check` passed
- whether the build passed
- what metric or behavior to watch tomorrow
