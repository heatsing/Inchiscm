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
- JSON-LD covers WebPage and BreadcrumbList on every indexable route, WebSite on the homepage, and WebApplication on tools. Free converters do not emit Offer. Thin numeric templates keep visible FAQs but omit FAQPage schema.

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

Host canonicalization in `netlify.toml`:

- `https://www.inchiscm.com/*` → `https://inchiscm.com/:splat` (301, forced, one hop)
- `http://inchiscm.com/*` → `https://inchiscm.com/:splat` (301, forced, one hop)
- `http://www.inchiscm.com/*` is also mapped to the HTTPS apex, but Netlify always upgrades HTTP to HTTPS on the same host first for HSTS preload, so that request still becomes `https://www` then apex.

Interior URLs stay slashless (`trailingSlash: false` plus Netlify Pretty URLs). Do not add a path-level `/*` / `/*/` **301** splat in `netlify.toml`: Netlify matches trailing slashes optionally, so that rule 301-loops unmatched paths (`/nope`, `/888888-inches-to-cm`) onto themselves. Host canonicalization stays in `netlify.toml`. Path-level 301s (hub aliases, length-unit synonyms, and published numeric inch 404 aliases) are generated at build time into `out/_redirects` *above* the terminal `/* /404.html 404`. Netlify processes `_redirects` before `netlify.toml`, so leaving those 301s only in TOML lets the 404 splat shadow them (`/1-inch-to-cm`, `/inch-to-millimeter`). Unpublished numbers stay 404.

Production releases must come from the connected GitHub repository. Do not run a manual Netlify CLI production deploy from a workspace containing an old `.netlify` directory, because stale Next.js functions can reopen dynamic routes that should return 404.
