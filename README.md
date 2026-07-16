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
npm run seo:check
npm run lint
npm run build
```

## SEO architecture

- Core converter, chart, height, and screen routes are statically rendered.
- Exact inch, decimal-inch, centimeter, and height pages are generated from shared conversion data.
- `sitemap.xml` includes all indexable static routes.
- Query-string converter states canonicalize to the core converter route.
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

- Build command: `npm run build`
- Publish directory: `out`
- Node version: 24

The deploy uses Next.js static export. Redirects are defined in `netlify.toml`, while approved page ranges are governed by `seo-page-policy.json`.
