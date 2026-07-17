# Inch is CM

A fast, static-first inch and centimeter conversion platform built with Next.js App Router.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run verify
```

`verify` runs conversion tests, the source-level SEO policy check, lint, the production build, and a rendered HTML/site integrity check.

## SEO architecture

- Core converter, chart, height, and screen routes are statically rendered.
- Exact inch, decimal-inch, centimeter, and height pages are generated from shared conversion data.
- `sitemap.xml` includes all indexable static routes.
- Query-string converter states canonicalize to the core converter route.
- Conversion factors, height output, fractional inches, and screen geometry have regression tests.
- JSON-LD covers the web application, FAQs, breadcrumbs, and chart datasets.

Long-term operating guidance is defined in:

- `SEO-OPERATING-RULES.md`
- `CONTENT-GEO-RULES.md`
- `CODEX-DAILY-WORKFLOW.md`
- `ROADMAP.md`

The global `metadataBase` assumes production is served from `https://inchiscm.com`.

## Monetization status

AdSense is intentionally paused until the site has stable organic traffic. The live site contains no real AdSense integration and renders no visible advertising placeholders. SEO quality, indexing, trust, and converter usability remain the current priorities.

## Netlify

- Build command: `npm run verify`
- Publish directory: `out`
- Node version: 24

The deploy uses Next.js static export. Redirects and baseline security headers are defined in `netlify.toml`, while approved page ranges are governed by `seo-page-policy.json`.

Production releases must come from the connected GitHub repository. Do not run a manual Netlify CLI production deploy from a workspace containing an old `.netlify` directory, because stale Next.js functions can reopen dynamic routes that should return 404.
