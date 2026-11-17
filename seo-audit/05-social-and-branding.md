# Module 05: Social Previews, Favicon & Branding

How Attack Explorer appears when shared on X (Twitter), LinkedIn, Telegram, Slack/Discord, and in browser tabs / mobile home screens.

---

## 1. Findings

### 1.1 Twitter card without image (WARNING)

- **Rule id:** `core/twitter-cards`
- **Issue:** `app/layout.tsx` set `summary_large_image` but provided no `images` / `twitter-image`.
- **Risk:** Incomplete cards on X, Telegram, and Discord; large CTR drop on shared links.

### 1.2 Missing Open Graph image (WARNING)

- **Rule id:** `core/og-tags`
- **Issue:** Missing `og:image`, `og:url`, `og:site_name`, and `og:locale` on the root metadata.
- **Risk:** LinkedIn / Facebook fall back to ugly or empty previews.

### 1.3 Missing favicon / mobile icons (WARNING)

- **Rule id:** `core/favicon`
- **Issue:** No `favicon.ico`, modern SVG icon, or `apple-touch-icon` at audit time.
- **Risk:** Generic globe/gray tab icons; empty favicon next to the site name in mobile SERPs.

---

## 2. Next.js 15 remediation

1. Place a 1200×630 (or similar) preview at `app/opengraph-image.png` / `app/twitter-image.png`, or reference a stable asset under `public/` (e.g. `public/og-image.png` or a high-quality diagram such as `initial-diagram-1600.png` / `docs/screenshots/`).
2. Declare `icons` inside the `metadata` object in `app/layout.tsx`.
3. Add `app/manifest.ts` for PWA / installability metadata (name, short_name, theme colors, icons).

---

## 3. Extra guidance

### Image specs

| Surface | Recommended size | Notes |
| :--- | :--- | :--- |
| Open Graph / Twitter large | 1200×630 | Avoid tiny UI screenshots; show the workbench hero clearly |
| Favicon | 32×32 + ICO multi-size | Also ship SVG if possible |
| Apple touch | 180×180 | Solid background; no reliance on transparency |

### Copy & branding

- `og:title` / Twitter title should match the product name users recognize.
- `og:site_name` = `Attack Explorer`.
- `og:locale` = `en_US` unless you ship localized routes.
- Absolute image URLs require a correct `metadataBase` / `NEXT_PUBLIC_SITE_URL`.

### Cache busting

Social platforms cache aggressively. After replacing OG art, use each platform’s debugger (Facebook Sharing Debugger, LinkedIn Post Inspector, X Card Validator) and force a scrape.

### Do not commit secrets in manifests

`manifest.ts` and icon paths are public. Keep analytics IDs / API keys out of client metadata.
