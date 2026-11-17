import { ATTACK_SCENARIOS, AttackScenario } from './attack-scenarios';
import {
  getScenarioAttribution,
  GLOBAL_FRAMEWORK_SOURCES,
  LEGAL_COMPLIANCE_STATEMENT,
} from './attack-sources-and-legal';

export const DEFAULT_SITE_URL = 'https://attackexplorer.org';

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

/**
 * Builds the root Schema.org JSON-LD @graph (WebApplication + TechArticle + Person)
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
    ],
  };
}

/**
 * Builds per-scenario Schema.org JSON-LD (TechArticle + HowTo + BreadcrumbList)
 * for path-based scenario landing pages (/scenarios/[id]).
 */
export function buildScenarioJsonLd(
  scenario: AttackScenario,
  siteUrlInput?: string
) {
  const siteUrl = resolveSiteUrl(siteUrlInput);
  const scenarioUrl = `${siteUrl}/scenarios/${encodeURIComponent(scenario.id)}`;
  const attribution = getScenarioAttribution(scenario);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${scenarioUrl}#article`,
        headline: `${scenario.code}: ${scenario.name} — MITRE ATT&CK & DFIR Forensic Analysis`,
        description: scenario.overview,
        url: scenarioUrl,
        inLanguage: 'en',
        proficiencyLevel: 'Expert',
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
      {
        '@type': 'BreadcrumbList',
        '@id': `${scenarioUrl}#breadcrumb`,
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
            name: `${scenario.code}: ${scenario.name}`,
            item: scenarioUrl,
          },
        ],
      },
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
      const mitreList = attribution.mitreTechniques
        .map((t) => `- **${t.id}** (${t.name} — *${t.tactic}*): ${t.url}`)
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

      return [
        `# ${scenario.code}: ${scenario.name}`,
        '',
        `> ${scenario.shortSubtitle}`,
        '',
        `- **Canonical URL:** ${siteUrl}/scenarios/${scenario.id}`,
        `- **Interactive Simulator:** ${siteUrl}/?scenario=${scenario.id}`,
        `- **Category:** ${scenario.category} | **Severity:** ${scenario.severity}`,
        '',
        '## Scenario Overview',
        scenario.overview,
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
