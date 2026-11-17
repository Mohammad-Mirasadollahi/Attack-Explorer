# Module 04: Structured Data (Schema.org JSON-LD)

How to declare Attack Explorer’s entity type so search engines and AI systems understand the product.

---

## 1. Current state (findings)

- **Schema score:** **0** — no structured data detected at audit time.
- Crawl note: `pages-without-entities: 1`
- Engines have no machine-readable signal that this is a web security application, a technical article corpus, or a MITRE-mapped knowledge base.

---

## 2. Required schemas for Attack Explorer

The product has a dual nature:

1. An interactive **attack / log simulation web app** → `WebApplication` / `SoftwareApplication`
2. A specialized **malware behavior / MITRE ATT&CK reference** → `TechArticle` (and later per-scenario `TechArticle` / `HowTo` / `Dataset`)

### JSON-LD blueprint for the site shell

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://attackexplorer.org/#webapp",
      "name": "Attack Explorer",
      "url": "https://attackexplorer.org",
      "description": "An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "All modern web browsers",
      "browserRequirements": "Requires JavaScript. Requires HTML5 Canvas support.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Interactive step-by-step cyber attack simulation",
        "Live SIEM / Sysmon log analyzer and forensic telemetry",
        "MITRE ATT&CK mapping and behavioral matrix",
        "Process tree, memory injection and network flow visualization"
      ]
    },
    {
      "@type": "TechArticle",
      "@id": "https://attackexplorer.org/#documentation",
      "headline": "Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer",
      "description": "In-depth step-by-step analysis and simulation of advanced cyber attack scenarios, APT groups, ransomware execution flows, and DFIR telemetry.",
      "inLanguage": "en",
      "about": [
        { "@type": "Thing", "name": "MITRE ATT&CK Framework" },
        { "@type": "Thing", "name": "Cyber Threat Intelligence" },
        { "@type": "Thing", "name": "Digital Forensics and Incident Response (DFIR)" }
      ]
    }
  ]
}
```

Replace absolute URLs with `NEXT_PUBLIC_SITE_URL` at inject time (see Module 08).

---

## 3. Next.js 15 integration

Inject via an `application/ld+json` `<script>` in `app/layout.tsx` (full snippet in Module 08). Validate with Google’s Rich Results Test / Schema Markup Validator after deploy.

---

## 4. Extra guidance

- **No fake ratings:** Do not add `AggregateRating` or review markup unless you have real, collectible reviews. Fake review schema risks manual actions.
- **Organization / Person:** When About/author pages exist, add `Organization` or `Person` with `sameAs` links (GitHub, LinkedIn) to strengthen E-E-A-T.
- **Per-scenario pages (later):** Prefer `TechArticle` or `HowTo` with `about` pointing at specific ATT&CK technique IDs (`T1055.012`, etc.) and cite sources already documented in `docs/analytical-sources-and-references.md`.
- **BreadcrumbList:** Useful once path-based docs/scenario routes exist.
- **Keep JSON-LD in sync with visible copy.** Invisible schema that contradicts the page is a trust problem.
- **One `@graph` is enough** for the shell; avoid duplicating the same `@id` from multiple layouts.
