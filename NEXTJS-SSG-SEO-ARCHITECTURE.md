# Next.js SSG SEO Architecture

Last updated: 2026-08-15

## Runtime and hosting

- Next.js version: 16.2.10.
- Rendering model: App Router with static export.
- Build output: `out`.
- Netlify build command: `npm run verify`.
- Netlify publish directory: `out`.

The site must not require a Node.js server in production.

## Static generation

The project uses `output: "export"` in `next.config.ts`. Programmatic conversion pages are generated through:

- `src/data/page-registry/index.ts` as the single typed route registry;
- `src/app/[slug]/page.tsx` with `generateStaticParams()`;
- `export const dynamicParams = false` to prevent unlisted dynamic routes.

Critical SEO content is rendered in Server Components. Interactive converters remain child Client Components.

## Route data source

Use `src/data/page-registry/index.ts` as the shared inventory for:

- dynamic slug params;
- sitemap route coverage;
- static page metadata;
- page lookup from dynamic routes;
- future route-count checks.

Use `src/data/page-registry/content.tsx`, `src/data/page-registry/generated-guides.tsx`, and `src/data/page-registry/content-profiles.json` for programmatic page content and SEO data. Metadata, H1, direct answer, formula, JSON-LD, and visible content must agree.

Do not reintroduce a separate route inventory file. The sitemap, dynamic params, and validation scripts must read from `pageRegistry` or data derived directly from it.

## Metadata and canonicals

All indexable pages must use `pageMetadata()` from `src/lib/seo.ts`.

Rules:

- `metadataBase` is `https://inchiscm.com`.
- canonical URLs are absolute and self-referencing;
- titles and descriptions must be unique;
- Open Graph and Twitter metadata must be page-specific;
- no page may canonicalize to a hub, homepage, or alternate conversion URL.

## JSON-LD

Use `graphSchema()`, `webPageSchema()`, and `webApplicationSchema()` from `src/lib/seo.ts` where appropriate.

Exact conversion pages output:

- WebPage;
- BreadcrumbList;
- FAQPage only when the FAQ is visible.

Tool pages output:

- WebPage;
- WebApplication when the visible page contains a working converter;
- BreadcrumbList;
- FAQPage only when visible.

Do not add fake ratings, reviews, authors, or unsupported HowTo markup.

## Validation

Run before any production push:

```bash
npm run verify
```

`npm run verify` runs tests, lint, `seo:check`, and `site:check`. `seo:check` builds first and then validates the exported static HTML.
`npm run audit:pre` and `npm run audit:post` inspect exported HTML and write JSON/Markdown/CSV reports under `reports/`.

The static HTML validation must confirm:

- one title;
- one meta description;
- one absolute self-canonical;
- one H1;
- visible answer or lead content;
- valid JSON-LD with URL matching canonical;
- sitemap coverage;
- no noindex;
- no localhost or Netlify canonical URLs;
- no unresolved placeholders.

## Future page rule

No indexable route may be published unless its final static HTML contains a unique title, useful description, self-referencing canonical, visible H1 and answer, valid matching JSON-LD, and sitemap entry.
