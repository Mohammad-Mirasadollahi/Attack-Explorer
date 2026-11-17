# Module 02: Crawlability & Indexing

How search engines and AI crawlers (Googlebot, Bingbot, OAI-SearchBot, and others) should discover and index Attack Explorer.

---

## 1. Findings

### 1.1 Missing `robots.txt` (ERROR)

- **Rule id:** `crawl/robots-txt`
- **Issue:** `/robots.txt` returned 404 at audit time.
- **Risk:**
  - Crawlers may waste crawl budget on API routes such as `/api/attacks` or `/api/threat-intel`.
  - Training crawlers (`GPTBot`, `Bytespider`, etc.) hit the origin without policy.
  - Sitemap location is never advertised.

### 1.2 Missing `sitemap.xml` (ERROR)

- **Rule id:** `crawl/sitemap-exists`
- **Issue:** No `sitemap.xml` and no Next.js `app/sitemap.ts`.
- **Risk:** Dozens of specialized DFIR / attack scenarios (Log4Shell, ransomware shadow wipe, process hollowing, Kerberoasting, and more) are hard for engines to discover as distinct entry points.

### 1.3 Missing canonical URL (WARNING)

- **Rule id:** `core/canonical`
- **Issue:** `app/layout.tsx` metadata did not emit `<link rel="canonical" …>`.
- **Risk:** Cloud preview hosts, HTTP/HTTPS mixes, and simulator query params (`?scenario=…`, `?mode=…`) can fragment signals across duplicate URLs.

---

## 2. Standard Next.js 15 fixes

App Router file conventions (no hand-maintained static XML required):

1. **`app/robots.ts`** — allow the public shell, disallow `/api/`, point to the sitemap.
2. **`app/sitemap.ts`** — emit the homepage and only the scenario URLs you want indexed.
3. **`metadataBase` + `alternates.canonical`** in `app/layout.tsx` — absolute canonical against the production origin.

Full code is in Module 08.

---

## 3. Extra guidance

### Crawl budget

- Disallow `/api/` for all user agents.
- If you add preview, staging, or storybook hosts, block them at robots **and** with `X-Robots-Tag: noindex` (or Cloudflare rules). Never rely on “security through obscurity” for staging.

### Sitemap strategy for this SPA

| Approach | Pros | Cons |
| :--- | :--- | :--- |
| Homepage only | Safe, no duplicate thin pages | Scenarios stay undiscoverable as distinct URLs |
| `/?scenario=<id>` entries | Fast to ship | Weak uniqueness; often treated as variants of `/` |
| `/scenarios/[id]` (or `/docs/...`) landing pages | Strong SEO surfaces with unique H1/copy/schema | Requires routing + content work |

**Recommendation:** ship homepage + robots first (P0). When adding scenario sitemap entries, move toward **path-based landings** with unique titles, descriptions, and `TechArticle` / `HowTo` schema—not only query params on the same shell.

### Canonical rules

- Canonical of the workbench should be the clean homepage (`/`), not a playback or drawer state.
- If you later create dedicated scenario pages, each page should self-canonicalize to its path URL.
- Set `NEXT_PUBLIC_SITE_URL` in production; never leave absolute links pointing at a placeholder domain after go-live.

### After deploy checklist

1. `curl -I https://<prod>/robots.txt` and `/sitemap.xml`
2. Submit sitemap in Google Search Console + Bing Webmaster Tools
3. Spot-check a few scenario URLs with URL Inspection
4. Confirm staging is `noindex`
