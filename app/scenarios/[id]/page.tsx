import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import {
  getScenarioAttribution,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import { buildScenarioJsonLd, resolveSiteUrl } from '@/lib/seo-metadata';
import {
  ArrowLeft,
  BookOpenCheck,
  ExternalLink,
  Layers,
  Play,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

interface ScenarioPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ATTACK_SCENARIOS.map((sc) => ({
    id: sc.id,
  }));
}

export async function generateMetadata({
  params,
}: ScenarioPageProps): Promise<Metadata> {
  const { id } = await params;
  const scenario = ATTACK_SCENARIOS.find((s) => s.id === id);
  if (!scenario) {
    return {
      title: 'Scenario Not Found',
    };
  }

  const siteUrl = resolveSiteUrl();
  const mitreIds = Array.from(
    new Set(scenario.stages.map((st) => st.mitreTechniqueId))
  ).join(', ');
  const title = `${scenario.code}: ${scenario.name} (${mitreIds})`;
  const description = `${scenario.shortSubtitle}. Interactive MITRE ATT&CK kill-chain simulation, Sysmon/SIEM telemetry, and DFIR forensic analysis across ${scenario.stages.length} stages.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/scenarios/${scenario.id}`,
    },
    openGraph: {
      title: `${title} | Attack Explorer`,
      description,
      url: `${siteUrl}/scenarios/${scenario.id}`,
      siteName: 'Attack Explorer',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: '/og-image.png',
          width: 1600,
          height: 900,
          alt: `${scenario.name} Interactive Attack Topology`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Attack Explorer`,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function ScenarioLandingPage({
  params,
}: ScenarioPageProps) {
  const { id } = await params;
  const scenario = ATTACK_SCENARIOS.find((s) => s.id === id);
  if (!scenario) {
    notFound();
  }

  const attribution = getScenarioAttribution(scenario);
  const scenarioJsonLd = JSON.stringify(buildScenarioJsonLd(scenario));

  return (
    <main
      dir="ltr"
      data-testid={`scenario-landing-page-${scenario.id}`}
      className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: scenarioJsonLd }}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-mono">
            <Link
              href="/?autostart=1"
              className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Attack Explorer Workbench</span>
            </Link>
            <span className="text-zinc-400">/</span>
            <Link
              href="/sources"
              className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600"
            >
              Scenarios
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {scenario.code}
            </span>
          </div>

          <Link
            href={`/?scenario=${encodeURIComponent(scenario.id)}&autostart=1`}
            data-testid="launch-scenario-in-simulator-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Interactive Simulator ({scenario.code})</span>
          </Link>
        </nav>

        <header className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-mono text-xs font-bold">
              {scenario.code}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-xs font-bold">
              {scenario.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-semibold">
              {scenario.stages.length} Kill-Chain Stages · Severity:{' '}
              {scenario.severity}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
            {scenario.name} — MITRE ATT&amp;CK &amp; DFIR Forensic Breakdown
          </h1>

          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {scenario.shortSubtitle}
          </p>

          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {scenario.overview}
          </p>
        </header>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>
              Step-by-Step Kill-Chain Stages ({scenario.stages.length} Stages)
            </span>
          </h2>

          <div className="space-y-4">
            {scenario.stages.map((st) => {
              const stageTelemetry = scenario.telemetry.filter(
                (ev) => ev.stageIndex === st.index
              );
              const primaryMitigation =
                stageTelemetry[0]?.detectionRule?.mitigation;
              return (
                <article
                  key={st.index}
                  id={`stage-${st.index}`}
                  className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-xs font-bold">
                        Stage {st.index}
                      </span>
                      <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                        {st.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25 font-mono text-xs font-bold">
                      {st.mitreTechniqueId} · {st.mitreTechniqueName}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    {st.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {st.description}
                  </p>

                  {st.keySpecs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-mono font-bold text-zinc-500">
                        Forensic Specs:
                      </span>
                      {st.keySpecs.map((spec, idx) => (
                        <code
                          key={idx}
                          className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/70 font-mono text-[11px]"
                        >
                          {spec.term}: {spec.value}
                        </code>
                      ))}
                    </div>
                  )}

                  {primaryMitigation && (
                    <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-200">
                      <strong className="font-mono uppercase text-emerald-700 dark:text-emerald-400">
                        Detection &amp; Mitigation:
                      </strong>{' '}
                      {primaryMitigation}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            <span>
              MITRE ATT&amp;CK® Techniques &amp; Primary Analytical Sources
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attribution.mitreTechniques.map((tech) => (
              <div
                key={tech.id}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {tech.id} · {tech.tactic}
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {tech.name}
                  </div>
                </div>
                <a
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <span>MITRE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            {attribution.primarySources.map((src) => (
              <div
                key={src.id}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {src.organization} · {src.referenceCode}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-indigo-600"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                  {src.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {src.usageSummary}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-semibold">
            <Link
              href="/about"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              About Author
            </Link>
            <Link
              href="/sources"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sources &amp; Privacy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
