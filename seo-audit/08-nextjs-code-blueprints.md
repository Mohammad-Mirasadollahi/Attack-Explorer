# Module 08: Next.js 15 Implementation Blueprints

Drop-in App Router blueprints that address the findings in Modules 01–07 without changing product marketing copy or the interactive UI look.

Set `NEXT_PUBLIC_SITE_URL` in every environment to the real HTTPS origin (no trailing slash).

---

## 1. `app/robots.ts`

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://attackexplorer.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Optional: keep training crawlers off APIs; adjust allow/disallow if product policy differs
        userAgent: ['GPTBot', 'Bytespider', 'CCBot'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 2. `app/sitemap.ts`

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://attackexplorer.org';
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Prefer path-based landings when available. Query-param URLs are a temporary compromise.
  const scenarioRoutes: MetadataRoute.Sitemap = ATTACK_SCENARIOS.map((scenario) => ({
    url: `${baseUrl}?scenario=${encodeURIComponent(scenario.id)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...scenarioRoutes];
}
```

**Note:** If scenario query URLs create duplicate/thin indexing, ship homepage-only in the sitemap until `/scenarios/[id]` (or docs routes) exist.

---

## 3. Metadata + schema in `app/layout.tsx`

```typescript
// Replace / extend the metadata object in app/layout.tsx
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://attackexplorer.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    template: '%s | Attack Explorer',
  },
  description:
    'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'MITRE ATT&CK',
    'Cyber Attack Simulator',
    'SIEM Log Analysis',
    'Sysmon Telemetry',
    'Malware Behavior Analysis',
    'DFIR Forensics',
    'Process Hollowing',
    'Ransomware Simulation',
    'Kerberoasting',
  ],
  authors: [{ name: 'Attack Explorer Team' }],
  creator: 'Attack Explorer',
  publisher: 'Attack Explorer',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    description:
      'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
    url: siteUrl,
    siteName: 'Attack Explorer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // or /initial-diagram-1600.png
        width: 1600,
        height: 900,
        alt: 'Attack Explorer Interactive Simulation Canvas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    description:
      'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### JSON-LD injection (layout body or head)

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${siteUrl}/#webapp`,
          name: 'Attack Explorer',
          url: siteUrl,
          description:
            'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Any modern browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      ],
    }),
  }}
/>
```

Also add the server-rendered `<h1>` from Module 03 in the header/shell.

---

## 4. `public/llms.txt`

```markdown
# Attack Explorer

> Visual Cyber Attack, Log & Malware Analyzer mapped to MITRE ATT&CK.

Attack Explorer is an interactive forensic simulation and security analysis web platform.

## Features
- Step-by-step adversary scenario playback.
- Dual-perspective telemetry: SIEM/Sysmon logs alongside attack graph nodes.
- Process trees, memory maps, network packet inspection, and AMSI bypass flowcharts.
- Mapped to MITRE ATT&CK Enterprise Matrix.

## Links
- Homepage: https://attackexplorer.org/
- Source & analytical references: https://attackexplorer.org/docs/analytical-sources-and-references.md
- Repository docs: see the project `docs/` folder
```

Update absolute links to match the live origin and any real docs routes you expose publicly.

---

## 5. `public/.well-known/security.txt`

```text
Contact: mailto:security@attackexplorer.org
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://attackexplorer.org/.well-known/security.txt
Policy: https://attackexplorer.org/docs/
```

Replace the contact mailbox and policy URL with addresses you actually monitor before shipping.

---

## 6. Optional `app/manifest.ts`

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Attack Explorer',
    short_name: 'AttackExplorer',
    description:
      'Visual cyber attack, log, and malware analyzer mapped to MITRE ATT&CK.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#0b1220',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
```

---

## 7. Post-implementation checklist

1. Local: open `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/.well-known/security.txt`.
2. Confirm `<link rel="canonical">`, OG/Twitter tags, and JSON-LD in View Source (not only after hydration).
3. Deploy, then re-run squirrelscan / Lighthouse / Rich Results Test.
4. Submit sitemap in Google Search Console and Bing Webmaster Tools.
5. Refresh social debuggers after OG image changes.
6. Keep this `seo-audit/` pack updated when scores or architecture change—treat it as living docs, not a one-off PDF.
