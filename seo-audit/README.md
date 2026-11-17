# Attack Explorer — Modular SEO Audit & Implementation Blueprint

> Point-in-time technical SEO audit and fix guide for **Attack Explorer**, based on Next.js App Router conventions, Schema.org JSON-LD, Generative Engine Optimization (GEO / agentic SEO), Google Search Central guidance, and a live `squirrelscan` crawl of the rendered site.

**Audit tool:** `squirrelscan` (reported overall score **33/100** at audit time)  
**Stack assumed:** Next.js 15 App Router, Cloudflare / OpenNext deployment  
**Language of this pack:** English (canonical for the repo)

---

## Module index

| Module | File | Contents | Priority |
| :--- | :--- | :--- | :---: |
| **01** | [`01-executive-summary.md`](./01-executive-summary.md) | Health scores, critical blockers, priority matrix | Critical |
| **02** | [`02-crawlability-and-indexing.md`](./02-crawlability-and-indexing.md) | `robots.txt`, `sitemap.xml`, canonical URLs, crawl budget | Critical |
| **03** | [`03-metadata-and-semantic-html.md`](./03-metadata-and-semantic-html.md) | Static `<h1>`, heading hierarchy, keyword density, a11y labels | High |
| **04** | [`04-structured-data-schema.md`](./04-structured-data-schema.md) | JSON-LD for `WebApplication` and `TechArticle` | Medium |
| **05** | [`05-social-and-branding.md`](./05-social-and-branding.md) | Open Graph, Twitter cards, favicon, web app manifest | Medium |
| **06** | [`06-agentic-seo-and-geo.md`](./06-agentic-seo-and-geo.md) | `llms.txt`, markdown for agents, token-weight ratio | Additive |
| **07** | [`07-performance-and-security.md`](./07-performance-and-security.md) | DOM size, critical CSS chains, CSP, `security.txt` | Medium |
| **08** | [`08-nextjs-code-blueprints.md`](./08-nextjs-code-blueprints.md) | Drop-in Next.js 15 code blueprints | Implementation |
| **09** | [`09-new-scenario-seo-checklist.md`](./09-new-scenario-seo-checklist.md) | Mandatory SEO & GEO checklist when adding new scenarios/articles | Ongoing |

---

## How to use this pack

1. Start with **Module 01** for the scorecard and P0/P1/P2 order.
2. Apply the matching blueprint from **Module 08** (do not invent alternate copy for title/description unless product marketing changes).
3. Re-scan with `squirrelscan` (or equivalent) after each P0 batch; treat score deltas as measured, not assumed.
4. Submit the production sitemap in Google Search Console and Bing Webmaster Tools once `robots.ts` / `sitemap.ts` ship.

---

## Additional engineering notes (apply across modules)

- **Canonical host:** Set `NEXT_PUBLIC_SITE_URL` to the real production origin (HTTPS, no trailing slash). Every absolute URL in metadata, sitemap, schema, OG, and `llms.txt` must use that value.
- **Query-param scenario URLs are weak SEO surfaces.** Listing `/?scenario=<id>` in the sitemap can create thin/duplicate variants of the same SPA shell. Prefer path-based routes such as `/scenarios/[id]` (or hash deep-links that do **not** enter the sitemap) when you invest in scenario landing pages.
- **Client-only UI is invisible to classic crawlers.** Anything that only appears after hydration (inspector panels, selected telemetry titles) does not count as the page’s primary H1/content. Put the primary semantic title in the server-rendered shell.
- **Do not noindex the marketing shell** while still allowing `/api/` to be crawled. Keep API and internal debug routes in `disallow`.
- **E-E-A-T for a security product:** link About / author, Sources & legal, and a privacy or responsible-use statement from crawlable HTML (footer or docs), not only from modals.
- **Cloudflare / OpenNext:** Security headers may be set in `next.config.ts` *and/or* Cloudflare Transform Rules. Prefer one authoritative place to avoid conflicting CSP policies.
- **Re-verify after deploy:** Rich Results Test, URL Inspection, and a fresh squirrelscan pass beat guessing from this document’s snapshot scores.

---

## Git policy

This folder is **tracked in git** so the audit and blueprints stay reviewable with the rest of the documentation under `docs/`. Agent skill caches (`.agents/`, `skills-lock.json`, `.squirrel/`) remain ignored separately.
