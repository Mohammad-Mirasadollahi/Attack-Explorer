import { SCENARIO_CATALOG } from './scenario-catalog';

export const DEFAULT_SITE_URL = 'https://www.attackexplorer.com';
export const CANONICAL_CONTENT_LAST_MODIFIED = '2026-11-17';

const PLACEHOLDER_SITE_URL_PATTERN =
  /^(MY_APP_URL|YOUR_APP_URL|APP_URL|CHANGE_ME|TODO)$/i;

function isUsableAbsoluteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    if (!parsed.hostname) {
      return false;
    }
    // Reject placeholder hostnames that are not real deploy targets.
    if (
      parsed.hostname === 'example.com' ||
      parsed.hostname === 'www.example.com'
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves the canonical public origin for metadata, sitemap, robots, and JSON-LD.
 * Rejects empty values and AI Studio / Cloud Run placeholders such as `MY_APP_URL`
 * so `new URL(siteUrl)` in the root layout never throws Invalid URL.
 */
export function resolveSiteUrl(envUrl?: string): string {
  const candidates =
    envUrl !== undefined
      ? [envUrl]
      : [process.env.NEXT_PUBLIC_SITE_URL, process.env.APP_URL];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const raw = candidate.trim();
    if (!raw || PLACEHOLDER_SITE_URL_PATTERN.test(raw)) continue;
    const normalized = raw.replace(/\/+$/, '');
    if (isUsableAbsoluteHttpUrl(normalized)) {
      return normalized;
    }
  }

  return DEFAULT_SITE_URL;
}

export const AUTHOR_PROFILE = {
  name: 'Mohammad Mirasadollahi',
  handle: '@M_Mirasadollahi',
  role: 'Creator of Attack Explorer',
  url: 'https://github.com/Mohammad-Mirasadollahi',
  sameAs: [
    'https://github.com/Mohammad-Mirasadollahi',
    'https://x.com/M_Mirasadollahi',
    'https://www.linkedin.com/in/mohammad-mirasadollahi/',
  ],
} as const;

export const PLATFORM_FAQ_ITEMS = [
  {
    question: 'What is Attack Explorer and how does it map to MITRE ATT&CK?',
    answer: `Attack Explorer is an interactive step-by-step visual cybersecurity simulator, SIEM/Sysmon log analyzer, and malware behavioral analysis workbench. It maps ${SCENARIO_CATALOG.length} documented adversary intrusion scenarios across Workstation, Active Directory Domain Controller, and Cloud environments directly to MITRE ATT&CK Enterprise Matrix tactics, techniques, and sub-techniques (TTPs).`,
  },
  {
    question:
      'How does Attack Explorer correlate network diagrams with Sysmon and SIEM logs?',
    answer:
      'Each kill-chain stage synchronizes live 2D network topology flows with host process trees, Virtual Address Descriptor (VAD) memory allocations, Windows Event IDs (4624, 4688, 4769, 7045), Sysmon Event IDs (1, 3, 8, 10, 11, 22, 25), and defensive Sigma, YARA, Suricata, and KQL detection rules.',
  },
  {
    question:
      'Are the malware payloads, IP addresses, and forensic logs in Attack Explorer safe for training?',
    answer:
      'Yes. 100% of telemetry, IP subnets (RFC 1918 / RFC 5737 documentation blocks), hostnames, process IDs, and hex memory previews in Attack Explorer are synthetic, de-identified educational simulations designed strictly for defensive SOC training, DFIR education, and detection engineering.',
  },
] as const;

/**
 * Builds the root Schema.org JSON-LD @graph (WebApplication + TechArticle + Person + FAQPage)
 * per Module 04 and Module 08 of the SEO Audit blueprint.
 */
export function buildRootJsonLd(siteUrlInput?: string) {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  return {
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
        operatingSystem: 'All modern web browsers',
        browserRequirements:
          'Requires JavaScript. Requires HTML5 Canvas support.',
        inLanguage: 'en',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@id': `${siteUrl}/#author`,
        },
        creator: {
          '@id': `${siteUrl}/#author`,
        },
        featureList: [
          'Interactive step-by-step cyber attack simulation',
          'Live SIEM / Sysmon log analyzer and forensic telemetry',
          'MITRE ATT&CK mapping and behavioral matrix',
          'Process tree, memory injection and network flow visualization',
        ],
      },
      {
        '@type': 'TechArticle',
        '@id': `${siteUrl}/#documentation`,
        headline:
          'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
        description:
          'In-depth step-by-step analysis and simulation of advanced cyber attack scenarios, APT groups, ransomware execution flows, and DFIR telemetry.',
        url: siteUrl,
        inLanguage: 'en',
        author: {
          '@id': `${siteUrl}/#author`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Attack Explorer',
          url: siteUrl,
        },
        about: [
          { '@type': 'Thing', name: 'MITRE ATT&CK Framework' },
          { '@type': 'Thing', name: 'Cyber Threat Intelligence' },
          {
            '@type': 'Thing',
            name: 'Digital Forensics and Incident Response (DFIR)',
          },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#author`,
        name: AUTHOR_PROFILE.name,
        jobTitle: AUTHOR_PROFILE.role,
        url: `${siteUrl}/about`,
        sameAs: [...AUTHOR_PROFILE.sameAs],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: PLATFORM_FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}
