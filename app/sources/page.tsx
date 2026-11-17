import type { Metadata } from 'next';
import Link from 'next/link';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import {
  GLOBAL_FRAMEWORK_SOURCES,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import { resolveSiteUrl } from '@/lib/seo-metadata';
import { ArrowLeft, ExternalLink, Scale, ShieldCheck } from 'lucide-react';

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  title: 'Analytical Sources, Citations, Legal Compliance & Privacy Policy',
  description:
    'Authoritative cybersecurity threat intelligence sources, MITRE ATT&CK citations, synthetic telemetry compliance, and privacy policy for Attack Explorer.',
  alternates: {
    canonical: '/sources',
  },
  openGraph: {
    title:
      'Analytical Sources, Citations & Legal Compliance | Attack Explorer',
    description:
      'Verified technical references from MITRE ATT&CK, CISA, Mandiant, Microsoft Threat Intelligence, Unit 42, and The DFIR Report.',
    url: `${siteUrl}/sources`,
    type: 'article',
  },
};

export default function SourcesPage() {
  return (
    <main
      dir="ltr"
      data-testid="sources-seo-page"
      className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/?autostart=1"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interactive Workbench</span>
          </Link>
          <Link
            href="/about"
            className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            About the Creator →
          </Link>
        </div>

        <header className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 text-xs font-mono font-bold">
            <Scale className="w-4 h-4" />
            <span>VERIFIED REFERENCES &amp; RESPONSIBLE USE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Authoritative Sources, Citations, Legal Compliance &amp; Privacy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Every scenario in Attack Explorer synthesizes multi-vendor threat
            intelligence, public CISA joint advisories, and open detection
            standards into deterministic, synthetic educational telemetry.
          </p>
        </header>

        <section className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-6 space-y-2.5">
          <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{LEGAL_COMPLIANCE_STATEMENT.headline}</span>
          </h2>
          <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
            {LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}
          </p>
          <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
            {LEGAL_COMPLIANCE_STATEMENT.noHarmfulCodeGuarantee}
          </p>
          <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 pt-1">
            {LEGAL_COMPLIANCE_STATEMENT.copyrightAttribution}
          </p>
        </section>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            Global Cybersecurity Frameworks &amp; Open Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {GLOBAL_FRAMEWORK_SOURCES.map((fw) => (
              <article
                key={fw.id}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {fw.organization} · {fw.referenceCode}
                  </span>
                  <a
                    href={fw.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-indigo-600"
                  >
                    <span>Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {fw.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {fw.usageSummary}
                </p>
                <div className="text-[10.5px] font-mono text-zinc-500">
                  License / Terms: {fw.licenseOrTerms}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            Privacy Policy &amp; Responsible Security Research Statement
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Attack Explorer stores user interface preferences (such as dark mode,
            layout mode, and the last visited scenario stage) strictly in local
            browser storage (<code>localStorage</code>). No personal data,
            cookies, or behavioral tracking profiles are sold or shared with
            third parties. All command lines, memory addresses, IP subnets, and
            hostnames depicted in the simulator are RFC 5737 / RFC 3849
            documentation addresses and synthetic educational artifacts intended
            solely for defensive cyber range training and SOC detection
            engineering.
          </p>
        </section>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            Documented Attack &amp; DFIR Scenario Directory ({ATTACK_SCENARIOS.length}{' '}
            Scenarios)
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {ATTACK_SCENARIOS.map((sc) => (
              <li key={sc.id}>
                <Link
                  href={`/scenarios/${sc.id}`}
                  className="block p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors"
                >
                  <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {sc.code} · {sc.stages.length} Stages · {sc.severity}
                  </div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    {sc.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {sc.shortSubtitle}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
