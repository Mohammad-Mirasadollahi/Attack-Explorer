import { ATTACK_SCENARIOS, AttackScenario } from './attack-scenarios';
import { formatAttackCategoryLabel } from './attack-category-labels';
import {
  getScenarioAttribution,
  GLOBAL_FRAMEWORK_SOURCES,
  LEGAL_COMPLIANCE_STATEMENT,
} from './attack-sources-and-legal';
import { getCuratedThreatIntel } from './threat-intel-service';

export const DEFAULT_SITE_URL = 'https://attackexplorer.org';
export const CANONICAL_CONTENT_LAST_MODIFIED = '2026-11-17';

export function resolveSiteUrl(envUrl?: string): string {
  const raw = (
    envUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.APP_URL ??
    DEFAULT_SITE_URL
  ).trim();
  if (!raw) return DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, '');
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
    answer: `Attack Explorer is an interactive step-by-step visual cybersecurity simulator, SIEM/Sysmon log analyzer, and malware behavioral analysis workbench. It maps ${ATTACK_SCENARIOS.length} documented adversary intrusion scenarios across Workstation, Active Directory Domain Controller, and Cloud environments directly to MITRE ATT&CK Enterprise Matrix tactics, techniques, and sub-techniques (TTPs).`,
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

/**
 * Builds Schema.org ProfilePage + BreadcrumbList JSON-LD for /about.
 */
export function buildAboutJsonLd(siteUrlInput?: string) {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/about#profile`,
        url: `${siteUrl}/about`,
        name: `About ${AUTHOR_PROFILE.name} — Creator of Attack Explorer`,
        inLanguage: 'en',
        mainEntity: {
          '@type': 'Person',
          '@id': `${siteUrl}/#author`,
          name: AUTHOR_PROFILE.name,
          jobTitle: AUTHOR_PROFILE.role,
          url: `${siteUrl}/about`,
          sameAs: [...AUTHOR_PROFILE.sameAs],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/about#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Attack Explorer',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About the Creator',
            item: `${siteUrl}/about`,
          },
        ],
      },
    ],
  };
}

/**
 * Builds Schema.org CollectionPage + BreadcrumbList JSON-LD for /sources.
 */
export function buildSourcesJsonLd(siteUrlInput?: string) {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/sources#collection`,
        url: `${siteUrl}/sources`,
        name: 'Analytical Sources, Citations, Legal Compliance & Scenario Directory | Attack Explorer',
        description:
          'Authoritative cybersecurity threat intelligence sources, MITRE ATT&CK citations, synthetic telemetry compliance, and scenario directory for Attack Explorer.',
        inLanguage: 'en',
        isPartOf: {
          '@id': `${siteUrl}/#webapp`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/sources#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Attack Explorer',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Sources, Citations & Scenario Directory',
            item: `${siteUrl}/sources`,
          },
        ],
      },
    ],
  };
}

/**
 * Returns up to `limit` related scenarios in the same attack category or MITRE tactic phase
 * to enforce Cybersecurity Topic Cluster lateral internal linking.
 */
export function getRelatedClusterScenarios(
  scenario: AttackScenario,
  limit = 6
): AttackScenario[] {
  const sameCategory = ATTACK_SCENARIOS.filter(
    (s) => s.id !== scenario.id && s.category === scenario.category
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const samePhase = ATTACK_SCENARIOS.filter(
    (s) =>
      s.id !== scenario.id &&
      s.category !== scenario.category &&
      s.primaryMitrePhase === scenario.primaryMitrePhase
  );
  return [...sameCategory, ...samePhase].slice(0, limit);
}

export interface ScenarioBreadcrumbItem {
  position: number;
  name: string;
  /** Relative path/hash for Next.js <Link> navigation in the UI */
  href: string;
  /** Absolute canonical URL for Schema.org ListItem.item */
  item: string;
  isCurrent?: boolean;
}

/**
 * Converts an AttackCategory code (e.g. "RANSOMWARE_EXTORTION") into a deterministic
 * HTML anchor slug (e.g. "category-ransomware-extortion") used in /sources and breadcrumbs.
 */
export function formatCategoryAnchorId(category: string): string {
  const clean = category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `category-${clean || 'general'}`;
}

/**
 * Dynamically builds the 4-level navigation hierarchy for a scenario page:
 * 1. Attack Explorer (/)
 * 2. Scenarios (/sources#scenario-directory)
 * 3. <Category Label> (/sources#category-<slug>)
 * 4. <Scenario Code>: <Scenario Name> (/scenarios/<id>)
 */
export function buildScenarioBreadcrumbs(
  scenario: AttackScenario,
  siteUrlInput?: string
): ScenarioBreadcrumbItem[] {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  const categoryLabel = formatAttackCategoryLabel(scenario.category);
  const categoryAnchor = formatCategoryAnchorId(scenario.category);
  const encodedId = encodeURIComponent(scenario.id);
  const scenarioPath = `/scenarios/${encodedId}`;

  return [
    {
      position: 1,
      name: 'Attack Explorer',
      href: '/',
      item: siteUrl,
    },
    {
      position: 2,
      name: 'Scenarios',
      href: '/sources#scenario-directory',
      item: `${siteUrl}/sources#scenario-directory`,
    },
    {
      position: 3,
      name: categoryLabel,
      href: `/sources#${categoryAnchor}`,
      item: `${siteUrl}/sources#${categoryAnchor}`,
    },
    {
      position: 4,
      name: `${scenario.code}: ${scenario.name}`,
      href: scenarioPath,
      item: `${siteUrl}${scenarioPath}`,
      isCurrent: true,
    },
  ];
}

/**
 * Builds the Schema.org BreadcrumbList JSON-LD object dynamically from the
 * scenario's navigation hierarchy (Root -> Scenarios -> Category -> Scenario).
 */
export function buildScenarioBreadcrumbJsonLd(
  scenario: AttackScenario,
  siteUrlInput?: string
) {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  const scenarioUrl = `${siteUrl}/scenarios/${encodeURIComponent(scenario.id)}`;
  const breadcrumbs = buildScenarioBreadcrumbs(scenario, siteUrl);

  return {
    '@type': 'BreadcrumbList' as const,
    '@id': `${scenarioUrl}#breadcrumb`,
    name: `${scenario.code} Navigation Hierarchy`,
    numberOfItems: breadcrumbs.length,
    itemListElement: breadcrumbs.map((crumb) => ({
      '@type': 'ListItem' as const,
      position: crumb.position,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/**
 * Builds per-scenario Schema.org JSON-LD (TechArticle + HowTo + BreadcrumbList)
 * for path-based scenario landing pages (/scenarios/[id]).
 * Includes Google Search Central & CTI SEO recommended properties:
 * image, datePublished, dateModified, proficiencyLevel, articleSection, keywords, about, mentions, and citation.
 */
export function buildScenarioJsonLd(
  scenario: AttackScenario,
  siteUrlInput?: string
) {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  const scenarioUrl = `${siteUrl}/scenarios/${encodeURIComponent(scenario.id)}`;
  const attribution = getScenarioAttribution(scenario);
  const intel = getCuratedThreatIntel(scenario);
  const categoryLabel = formatAttackCategoryLabel(scenario.category);
  const breadcrumbNode = buildScenarioBreadcrumbJsonLd(scenario, siteUrl);

  const keywords = Array.from(
    new Set([
      scenario.code,
      scenario.category,
      categoryLabel,
      ...scenario.stages.map((st) => st.mitreTechniqueId),
      ...intel.cves.map((c) => c.id),
      'MITRE ATT&CK',
      'DFIR',
      'SIEM',
      'Sysmon',
    ])
  );

  const mentions = [
    ...intel.cves.map((cve) => ({
      '@type': 'Thing',
      name: `${cve.id} (${cve.cvss})`,
      description: cve.description,
    })),
    ...intel.actorGroups.map((actor) => ({
      '@type': 'Organization',
      name: actor.name,
      alternateName: actor.aliases,
      description: actor.notableCampaign,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${scenarioUrl}#article`,
        headline: `${scenario.code}: ${scenario.name} — MITRE ATT&CK & DFIR Forensic Analysis`,
        description: scenario.overview,
        image: `${siteUrl}/og-image.png`,
        datePublished: CANONICAL_CONTENT_LAST_MODIFIED,
        dateModified: CANONICAL_CONTENT_LAST_MODIFIED,
        url: scenarioUrl,
        inLanguage: 'en',
        proficiencyLevel: 'Expert',
        articleSection: categoryLabel,
        keywords,
        breadcrumb: {
          '@id': `${scenarioUrl}#breadcrumb`,
        },
        author: {
          '@type': 'Person',
          name: AUTHOR_PROFILE.name,
          url: `${siteUrl}/about`,
          sameAs: [...AUTHOR_PROFILE.sameAs],
        },
        publisher: {
          '@type': 'Organization',
          name: 'Attack Explorer',
          url: siteUrl,
        },
        isPartOf: {
          '@id': `${siteUrl}/#webapp`,
        },
        about: attribution.mitreTechniques.map((tech) => ({
          '@type': 'Thing',
          name: `${tech.id} — ${tech.name} (${tech.tactic})`,
          url: tech.url,
        })),
        mentions,
        citation: attribution.primarySources.map((src) => ({
          '@type': 'CreativeWork',
          name: `${src.organization}: ${src.title}`,
          url: src.url,
        })),
      },
      {
        '@type': 'HowTo',
        '@id': `${scenarioUrl}#walkthrough`,
        name: `How to Analyze and Detect ${scenario.name} (${scenario.code})`,
        description: scenario.shortSubtitle,
        step: scenario.stages.map((st) => {
          const stageEvents = scenario.telemetry.filter(
            (ev) => ev.stageIndex === st.index
          );
          const mitigationSummary =
            stageEvents[0]?.detectionRule?.mitigation ||
            st.keySpecs.map((ks) => `${ks.term}: ${ks.value}`).join('; ');
          return {
            '@type': 'HowToStep',
            position: st.index,
            name: `Stage ${st.index}: ${st.title} (${st.mitreTechniqueId})`,
            text: `${st.description} Detection & Key Specs: ${mitigationSummary}`,
            url: `${scenarioUrl}#stage-${st.index}`,
          };
        }),
      },
      breadcrumbNode,
    ],
  };
}

/**
 * Generates clean Markdown for AI agents and GEO crawlers negotiating `Accept: text/markdown`
 * (Module 06 Rule `ax/markdown-response`).
 */
export function buildAgentMarkdownResponse(
  pathname: string,
  searchParams?: URLSearchParams,
  siteUrlInput?: string
): string {
  const siteUrl = resolveSiteUrl(siteUrlInput);

  if (pathname === '/about' || pathname === '/about/') {
    return [
      `# About ${AUTHOR_PROFILE.name} — Creator of Attack Explorer`,
      '',
      `- **Role:** ${AUTHOR_PROFILE.role}`,
      `- **Canonical URL:** ${siteUrl}/about`,
      `- **GitHub:** https://github.com/Mohammad-Mirasadollahi`,
      `- **X (Twitter):** https://x.com/M_Mirasadollahi`,
      `- **LinkedIn:** https://www.linkedin.com/in/mohammad-mirasadollahi/`,
      `- **Security Contact:** mailto:security@attackexplorer.org`,
      '',
      '## Platform Mission',
      `Attack Explorer bridges high-level network architecture diagrams with low-level SIEM/Sysmon log and process memory forensics across ${ATTACK_SCENARIOS.length} documented adversary scenarios mapped to MITRE ATT&CK.`,
      '',
      '## Legal & Synthetic Telemetry Notice',
      LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee,
      '',
    ].join('\n');
  }

  if (pathname === '/sources' || pathname === '/sources/') {
    const fwList = GLOBAL_FRAMEWORK_SOURCES.map(
      (fw) =>
        `- **${fw.organization} (${fw.referenceCode}):** [${fw.title}](${fw.url}) — ${fw.usageSummary}`
    ).join('\n');
    const allScenariosList = ATTACK_SCENARIOS.map(
      (sc) =>
        `- [${sc.code}: ${sc.name}](${siteUrl}/scenarios/${sc.id}) — ${sc.shortSubtitle}`
    ).join('\n');

    return [
      '# Analytical Sources, Citations, Legal Compliance & Scenario Directory',
      '',
      `- **Canonical URL:** ${siteUrl}/sources`,
      '',
      '## Global Analytical Frameworks',
      fwList,
      '',
      '## Legal & Synthetic Telemetry Notice',
      LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee,
      '',
      `## Complete Scenario Directory (${ATTACK_SCENARIOS.length} Scenarios)`,
      allScenariosList,
      '',
    ].join('\n');
  }

  // Check if a specific scenario was requested via /scenarios/[id] or ?scenario=<id>
  const scenarioMatch = pathname.match(/^\/scenarios\/([^/]+)\/?$/);
  const scenarioIdFromPath = scenarioMatch
    ? decodeURIComponent(scenarioMatch[1])
    : null;
  const scenarioIdFromQuery = searchParams?.get('scenario') || null;
  const targetScenarioId = scenarioIdFromPath || scenarioIdFromQuery;

  if (targetScenarioId) {
    const scenario = ATTACK_SCENARIOS.find((s) => s.id === targetScenarioId);
    if (scenario) {
      const attribution = getScenarioAttribution(scenario);
      const intel = getCuratedThreatIntel(scenario);
      const relatedCluster = getRelatedClusterScenarios(scenario, 5);
      const mitreList = attribution.mitreTechniques
        .map((t) => `- **${t.id}** (${t.name} — *${t.tactic}*): ${t.url}`)
        .join('\n');
      const cveList = intel.cves
        .map((c) => `- **${c.id}** (CVSS: ${c.cvss} · ${c.status}): ${c.description}`)
        .join('\n');
      const actorList = intel.actorGroups
        .map(
          (a) =>
            `- **${a.name}** (*Aliases: ${a.aliases}* · Sectors: ${a.targetSectors}): ${a.notableCampaign}`
        )
        .join('\n');
      const stagesList = scenario.stages
        .map((st) => {
          const specsText = st.keySpecs
            .map((ks) => `${ks.term}: ${ks.value}`)
            .join(' | ');
          const stageEvents = scenario.telemetry.filter(
            (ev) => ev.stageIndex === st.index
          );
          const mitigationText =
            stageEvents[0]?.detectionRule?.mitigation ||
            'Correlate Sysmon process creation, memory permissions, and SIEM detection rules.';
          return `### Stage ${st.index}: ${st.title} (${st.mitreTechniqueId} · ${st.mitreTechniqueName})\n- **Summary:** ${st.description}\n- **Forensic Specs:** ${specsText}\n- **Defense & Mitigation:** ${mitigationText}`;
        })
        .join('\n\n');
      const sourcesList = attribution.primarySources
        .map(
          (src) =>
            `- **${src.organization} (${src.referenceCode}):** [${src.title}](${src.url}) — ${src.usageSummary}`
        )
        .join('\n');
      const relatedLinks = relatedCluster
        .map(
          (rel) =>
            `- [${rel.code}: ${rel.name}](${siteUrl}/scenarios/${rel.id}) — ${rel.shortSubtitle}`
        )
        .join('\n');

      return [
        `# ${scenario.code}: ${scenario.name}`,
        '',
        `> ${scenario.shortSubtitle}`,
        '',
        '## Answer-First Forensic Fact Sheet',
        `- **Canonical URL:** ${siteUrl}/scenarios/${scenario.id}`,
        `- **Interactive Simulator:** ${siteUrl}/?scenario=${scenario.id}`,
        `- **Category:** ${scenario.category} | **Severity:** ${scenario.severity} | **Stages:** ${scenario.stages.length}`,
        `- **MITRE ATT&CK IDs:** ${scenario.stages.map((s) => s.mitreTechniqueId).join(', ')}`,
        `- **CVEs / Advisories:** ${intel.cves.map((c) => `${c.id} (${c.cvss})`).join(', ')}`,
        `- **Attributed Threat Actors:** ${intel.actorGroups.map((a) => a.name).join(', ')}`,
        '',
        '## Scenario Overview',
        scenario.overview,
        '',
        '## Multi-Source Cross-Vendor Synthesis',
        attribution.multiSourceSynthesis,
        '',
        '## CVEs, Vulnerability Advisories & Attributed Threat Actors',
        cveList,
        '',
        actorList,
        '',
        '## MITRE ATT&CK® Techniques Mapped',
        mitreList,
        '',
        `## Kill-Chain Execution Stages (${scenario.stages.length} Stages)`,
        stagesList,
        '',
        '## Authoritative Analytical Sources & Citations',
        sourcesList,
        '',
        '## Related Scenarios in This Topic Cluster',
        relatedLinks,
        '',
        '## Legal & Synthetic Telemetry Notice',
        LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee,
        '',
      ].join('\n');
    }
  }

  // Default homepage / application summary markdown
  const featuredScenarios = ATTACK_SCENARIOS.slice(0, 15)
    .map(
      (sc) =>
        `- [${sc.code}: ${sc.name}](${siteUrl}/scenarios/${sc.id}) — ${sc.shortSubtitle} (${sc.stages.map((s) => s.mitreTechniqueId).join(', ')})`
    )
    .join('\n');

  const frameworkLinks = GLOBAL_FRAMEWORK_SOURCES.map(
    (fw) => `- **${fw.organization} (${fw.referenceCode}):** [${fw.title}](${fw.url})`
  ).join('\n');

  return [
    '# Attack Explorer',
    '',
    '> Visual Cyber Attack, Log & Malware Analyzer mapped to MITRE ATT&CK.',
    '',
    'Attack Explorer is an interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to the MITRE ATT&CK Enterprise Matrix.',
    '',
    '## Core Capabilities',
    '- **Attack Simulation:** Step-by-step visual execution of real-world adversary scenarios across Workstation, Domain Controller, and Cloud environments.',
    '- **Log Forensics:** Live Sysmon, Windows Event Log, and SIEM packet breakdown with correlated Sigma detection rules.',
    '- **Behavioral Mapping:** Direct mapping to MITRE ATT&CK tactics, techniques, and sub-techniques (TTPs).',
    '- **Process Memory Inspection:** Process hollowing, VAD memory forensics, and AMSI bypass flowcharts.',
    '',
    '## Key Scenarios Included',
    featuredScenarios,
    '',
    '## Canonical Documentation & E-E-A-T Links',
    `- **Interactive Simulator:** ${siteUrl}/`,
    `- **About the Creator (${AUTHOR_PROFILE.name}):** ${siteUrl}/about`,
    `- **Analytical Sources, Citations & Legal Compliance:** ${siteUrl}/sources`,
    `- **Concise LLM Guide:** ${siteUrl}/llms.txt`,
    `- **Full Scenario Encyclopedia for LLMs (${ATTACK_SCENARIOS.length} Scenarios):** ${siteUrl}/llms-full.txt`,
    `- **Security Disclosure Policy:** ${siteUrl}/.well-known/security.txt`,
    '',
    '## Global Analytical Frameworks',
    frameworkLinks,
    '',
  ].join('\n');
}
