import React from 'react';
import Link from 'next/link';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import {
  GLOBAL_FRAMEWORK_SOURCES,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import { AUTHOR_PROFILE, PLATFORM_FAQ_ITEMS } from '@/lib/seo-metadata';

const FEATURED_SCENARIO_IDS = [
  'process-hollowing',
  'ransomware-shadow-wipe',
  'pikered-clr-profiler-trusted-binary-loader-chain',
  'alphv-blackcat-sphynx-rust-impacket-exmatter',
  'rspack-solana-web3js-npm-supply-chain-2024',
  'log4shell-dfir',
  'ad-kerberoasting',
  'dns-tunneling-exfil',
  'amsi-reflective-dll',
];

/**
 * Server-rendered semantic HTML documentation, E-E-A-T trust links, privacy/responsible-use
 * statement, and scenario directory for search engines and AI agents (Modules 01, 03, 06).
 * Uses minimal DOM nodes while providing high-signal human-readable prose to balance
 * telemetry code tokens (`<code>`) and satisfy crawlable E-E-A-T link requirements.
 */
export function SeoSemanticDocumentation() {
  const featuredScenarios = ATTACK_SCENARIOS.filter((s) =>
    FEATURED_SCENARIO_IDS.includes(s.id)
  );

  return (
    <section
      aria-label="Attack Explorer Platform Overview, Methodology, and E-E-A-T References"
      data-testid="seo-semantic-documentation"
      className="sr-only"
    >
      <h2>
        Interactive Cyber Attack Simulation, SIEM Telemetry Correlation, and
        MITRE ATT&amp;CK Behavioral Analysis
      </h2>
      <p>
        Attack Explorer is an interactive visual cybersecurity simulator and
        digital forensics and incident response (DFIR) analysis workbench built
        for security operations center (SOC) analysts, detection engineers,
        threat hunters, malware researchers, and red/blue security teams. The
        platform models real-world adversary intrusion chains step by step across
        enterprise workstation endpoints, Active Directory domain controllers,
        and cloud container infrastructures. Every stage correlates network
        topology flows, host process trees, virtual memory allocations, and raw
        SIEM, Sysmon, and Windows Security event telemetry directly to the
        MITRE ATT&amp;CK Enterprise Matrix.
      </p>
      <p>
        Unlike static threat intelligence reports, Attack Explorer synchronizes
        architectural network diagrams with packet-level inspection, process
        hollowing and reflective library injection memory maps, command-line
        argument breakdowns, and defensive Sigma detection rules. Security
        practitioners can step forward and backward through multi-stage
        adversary playbooks, inspect bidirectional request and response flows,
        expand internal host and process pipelines, and evaluate defensive
        mitigations grounded in authoritative vendor research from CISA,
        Mandiant, Microsoft Threat Intelligence, Palo Alto Networks Unit 42,
        CrowdStrike, Kaspersky GReAT, Elastic Security Labs, PikeRed Security
        Research, and The DFIR Report.
      </p>

      <h3>Featured Cyber Attack &amp; DFIR Investigation Scenarios</h3>
      <ul>
        {featuredScenarios.map((sc) => (
          <li key={sc.id}>
            <Link href={`/scenarios/${sc.id}`}>
              {sc.code}: {sc.name} — {sc.shortSubtitle}
            </Link>{' '}
            <span>{sc.overview}</span>
          </li>
        ))}
      </ul>

      <h3>Frequently Asked Questions (MITRE ATT&amp;CK &amp; DFIR Simulation)</h3>
      <dl>
        {PLATFORM_FAQ_ITEMS.map((faq, idx) => (
          <React.Fragment key={idx}>
            <dt>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </React.Fragment>
        ))}
      </dl>

      <h3>
        Authoritative Analytical Methodology, Privacy Policy &amp; Responsible
        Defensive Use
      </h3>
      <p>
        {LEGAL_COMPLIANCE_STATEMENT.headline}:{' '}
        {LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}{' '}
        {LEGAL_COMPLIANCE_STATEMENT.noHarmfulCodeGuarantee} Attack Explorer
        operates strictly as a defensive cybersecurity education and forensic
        training platform. User layout preferences and diagram snapshots are
        persisted locally in browser storage; no personal user data or private
        telemetry is harvested or sold. Primary analytical frameworks include{' '}
        {GLOBAL_FRAMEWORK_SOURCES.map(
          (fw) => `${fw.organization} (${fw.title})`
        ).join(', ')}
        .
      </p>

      <footer>
        <nav aria-label="Crawlable E-E-A-T, Author, Legal, and AI Documentation Links">
          <Link href="/about">
            About the Creator — {AUTHOR_PROFILE.name} ({AUTHOR_PROFILE.handle})
          </Link>
          <Link href="/sources">
            Authoritative Sources, Citations, Legal Compliance &amp; Privacy
            Policy
          </Link>
          <a href="/llms.txt">LLMs.txt Agent Summary</a>
          <a href="/llms-full.txt">Complete Scenario Catalog for AI Agents</a>
          <a href="/.well-known/security.txt">
            RFC 9116 Security Disclosure Policy
          </a>
          <a href="mailto:security@attackexplorer.org">
            Contact Security &amp; Support (security@attackexplorer.org)
          </a>
          <a
            href="https://github.com/Mohammad-Mirasadollahi"
            rel="noopener noreferrer"
          >
            GitHub — Mohammad Mirasadollahi
          </a>
          <a
            href="https://www.linkedin.com/in/mohammad-mirasadollahi/"
            rel="noopener noreferrer"
          >
            LinkedIn — Mohammad Mirasadollahi
          </a>
        </nav>
      </footer>
    </section>
  );
}
