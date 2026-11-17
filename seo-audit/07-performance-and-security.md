# Module 07: Performance, Core Web Vitals & Security

Load speed, DOM weight, render-blocking chains, and security headers that also affect SEO / trust signals.

---

## 1. Findings

### 1.1 Large DOM size (WARNING)

- **Rule id:** `perf/dom-size`
- **Issue:** Document contained **~1515 nodes** (Google’s common warning threshold: ~1500).
- **Cause:** Drawers, inspector tabs, log modals, shortcut UI, sidebars, and graph nodes mounting up-front.
- **Direction:** Lazy-load heavy modals with Next.js `dynamic()` (`LogAnalyzerModal`, `SourcesAndLegalModal`, `AboutAuthorModal`, `KeyboardShortcutsModal`, etc.) until the user opens them.

### 1.2 Critical CSS request chains (WARNING)

- **Rule id:** `perf/critical-request-chains`
- **Issue:** Scanner flagged two blocking stylesheet chains under `/_next/static/css/...`.
- **Note:** `next/font/google` usage in the layout was already in good shape (`display: 'swap'`). Keep fonts via `next/font`; avoid extra render-blocking webfont CSS.

### 1.3 Missing security headers (WARNING)

- **Rule ids:** `security/csp`, `security/x-frame-options`
- **Issue:**
  - No `Content-Security-Policy`
  - No clickjacking protection (`X-Frame-Options: SAMEORIGIN` or CSP `frame-ancestors`)
- **Direction:** Set headers in `next.config.ts` and/or Cloudflare (pick one source of truth).

### 1.4 Missing `security.txt` (WARNING)

- **Rule id:** `security/security-txt`
- **Issue:** No RFC 9116 file at `/.well-known/security.txt`.
- **Why it matters here:** For a cybersecurity education platform, a responsible-disclosure contact is a positive E-E-A-T / trust signal.

---

## 2. Extra guidance

### Core Web Vitals for a canvas-heavy app

| Metric | Watch-outs for Attack Explorer |
| :--- | :--- |
| **LCP** | Hero/workbench paint; avoid huge uncompressed OG/diagram assets on the critical path |
| **INP** | Playback, pan/zoom, and inspector updates; keep main-thread work chunked |
| **CLS** | Reserve space for sidebars/inspector; don’t shift the canvas when panels open |

### CSP without breaking the simulator

- Start in **Report-Only** if needed, then enforce.
- Canvas / WebGL / inline bootstrap scripts (layout preference script) need explicit allowances—audit before shipping a strict CSP.
- Prefer nonces or hashes over `unsafe-inline` long term.

### Headers checklist (minimum)

```http
Content-Security-Policy: …tuned policy…
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
frame-ancestors 'self'   # via CSP (preferred) or X-Frame-Options: SAMEORIGIN
```

### `security.txt`

- Use a monitored mailbox (`security@…`) or a public security policy URL.
- Keep `Expires` updated (RFC 9116); stale files look abandoned.
- Preferred-Languages should match how you actually triage reports.

### Cloudflare / OpenNext note

If headers are set both in Next config and at the edge, conflicts can silently drop CSP. Document the authoritative layer in the PR that ships headers.
