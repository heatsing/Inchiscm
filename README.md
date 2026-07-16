# InchesCM

A fast, static-first inch and centimeter conversion platform built with Next.js App Router.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run lint
npm run build
```

## SEO architecture

- Core converter, chart, height, and screen routes are statically rendered.
- Exact inch, decimal-inch, centimeter, and height pages are generated from shared conversion data.
- `sitemap.xml` includes all indexable static routes.
- Query-string converter states canonicalize to the core converter route.
- JSON-LD covers the web application, FAQs, breadcrumbs, and chart datasets.

The global `metadataBase` assumes production is served from `https://inchiscm.com`.
