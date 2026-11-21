import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import {
  getScenarioAttribution,
  LEGAL_COMPLIANCE_STATEMENT,
} from '@/lib/attack-sources-and-legal';
import {
  buildScenarioBreadcrumbs,
  buildScenarioJsonLd,
  formatCategoryAnchorId,
  getRelatedClusterScenarios,
  resolveSiteUrl,
} from '@/lib/seo-metadata';
import { formatAttackCategoryLabel } from '@/lib/attack-category-labels';
import { getCuratedThreatIntel } from '@/lib/threat-intel-service';
import {
  ArrowLeft,
  BookOpenCheck,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Layers,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { StandardStoryTechnicalSection } from '@/components/StandardStoryTechnicalSection';
import {
  getSection3DDescriptor,
  stepNumberToSectionKey,
} from '@/lib/section-3d-registry';
import { getRawScenarioStepGuide } from '@/lib/scenario-step-guides';
interface ScenarioPageProps {
  params: Promise<{ id: string }>;
}

// Prerender every scenario HTML into Workers Static Assets (Free-plan safe).
export const dynamic = 'force-static';

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
  const intel = getCuratedThreatIntel(scenario);
  const relatedScenarios = getRelatedClusterScenarios(scenario, 6);
  const breadcrumbs = buildScenarioBreadcrumbs(scenario);
  const categoryLabel = formatAttackCategoryLabel(scenario.category);
  const categoryAnchor = formatCategoryAnchorId(scenario.category);
  const scenarioJsonLd = JSON.stringify(buildScenarioJsonLd(scenario));
  const stepGuideData = getRawScenarioStepGuide(scenario.id);
  const briefing3d = getSection3DDescriptor(scenario.id, 'briefing');
  const memory3d = getSection3DDescriptor(scenario.id, 'memory-forensics');

  return (
    <main
      dir="ltr"
      data-testid={`scenario-landing-page-${scenario.id}`}
      className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-8"
    >
      <script
        id={`scenario-jsonld-${scenario.id}`}
        data-testid="scenario-jsonld-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: scenarioJsonLd }}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <nav
          aria-label="Breadcrumb"
          data-testid="scenario-breadcrumb-nav"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {breadcrumbs.map((crumb, index) => (
              <li
                key={crumb.position}
                className="inline-flex items-center gap-1.5"
              >
                {index > 0 && (
                  <ChevronRight
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-zinc-400 shrink-0"
                  />
                )}
                {crumb.isCurrent ? (
                  <span
                    aria-current="page"
                    data-testid="breadcrumb-current-scenario"
                    className="text-indigo-600 dark:text-indigo-400 font-bold"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                  >
                    {index === 0 && <ArrowLeft className="w-3.5 h-3.5" />}
                    <span>{crumb.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>

          <Link
            href={`/?scenario=${encodeURIComponent(scenario.id)}`}
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
            <Link
              href={`/sources#${categoryAnchor}`}
              className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 font-mono text-xs font-bold transition-colors"
            >
              {categoryLabel}
            </Link>
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

          {stepGuideData?.briefing || briefing3d ? (
            <StandardStoryTechnicalSection
              scenarioId={scenario.id}
              sectionKey={briefing3d ? 'briefing' : null}
              storyHeading="Story-to-Spec Analogy & Executive Summary"
              storyAnalogy={
                stepGuideData?.briefing?.storyAnalogy ||
                briefing3d?.storyCue ||
                ''
              }
              storyMappings={stepGuideData?.briefing?.storyMappings}
              technicalHeading="Technical Overview"
              technicalText={
                stepGuideData?.briefing?.plainSummary || scenario.overview
              }
              clausePrefix="0"
              className="pt-1"
            />
          ) : (
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {scenario.overview}
            </p>
          )}
        </header>

        {(() => {
          const coreScenarioSections = (
            <>
              <section
                id="forensic-fact-sheet"
                aria-label="Forensic Fact Sheet and Threat Intelligence"
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-6"
              >
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <a href="#forensic-fact-sheet" className="hover:underline">
              Answer-First Forensic Fact Sheet &amp; Threat Intelligence
            </a>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {attribution.multiSourceSynthesis}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
                Associated CVEs &amp; Vulnerability Mechanics
              </div>
              {intel.cves.length > 0 ? (
                <ul className="space-y-2">
                  {intel.cves.map((cve) => (
                    <li
                      key={cve.id}
                      className="text-xs text-zinc-700 dark:text-zinc-300 space-y-0.5"
                    >
                      <div className="font-mono font-bold text-zinc-900 dark:text-white">
                        {cve.id} · CVSS {cve.cvss} ({cve.status})
                      </div>
                      <div>{cve.description}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Post-exploitation / Living-off-the-Land (LOTL) tradecraft
                  operating via native OS/API primitives without requiring a
                  single CVE exploit.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                Attributed Threat Actor Groups &amp; Tradecraft
              </div>
              <ul className="space-y-2">
                {intel.actorGroups.map((actor) => (
                  <li
                    key={actor.name}
                    className="text-xs text-zinc-700 dark:text-zinc-300 space-y-0.5"
                  >
                    <div className="font-mono font-bold text-zinc-900 dark:text-white">
                      {actor.name}{' '}
                      <span className="text-zinc-500 font-normal">
                        ({actor.aliases}) · {actor.targetSectors}
                      </span>
                    </div>
                    <div>{actor.notableCampaign}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

              </section>

        <section
          id="kill-chain-stages"
          className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-6"
        >
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <a href="#kill-chain-stages" className="hover:underline">
              Step-by-Step Kill-Chain Stages ({scenario.stages.length} Stages)
            </a>
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
                  className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-2.5 scroll-mt-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`#stage-${st.index}`}
                        className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors"
                      >
                        Stage {st.index}
                      </a>
                      <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                        <a
                          href={`#stage-${st.index}`}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {st.title}
                        </a>
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25 font-mono text-xs font-bold">
                        {st.mitreTechniqueId} · {st.mitreTechniqueName}
                      </span>
                      <Link
                        href={`/?scenario=${encodeURIComponent(scenario.id)}&step=${st.index}#step-${st.index}`}
                        data-testid={`simulate-stage-${st.index}-btn`}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-[11px] font-bold transition-colors"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Simulate Stage {st.index}</span>
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    {st.subtitle}
                  </p>

                  {(() => {
                    const secKey = stepNumberToSectionKey(st.index);
                    const sec3d = secKey
                      ? getSection3DDescriptor(scenario.id, secKey)
                      : null;
                    const rawStep = stepGuideData?.steps.find(
                      (s) => s.stepNumber === st.index
                    );
                    const stepStory = rawStep?.storyAnalogy;
                    const stepTechnical = rawStep
                      ? `${rawStep.simpleExplanation} ${rawStep.howItWorksInPractice}`
                      : st.description;
                    if (stepStory || (secKey && sec3d)) {
                      return (
                        <StandardStoryTechnicalSection
                          scenarioId={scenario.id}
                          sectionKey={secKey && sec3d ? secKey : null}
                          storyHeading={
                            sec3d
                              ? `Story Analogy · Stage ${st.index} (${sec3d.title})`
                              : `Story Analogy · Stage ${st.index} (${rawStep?.plainTitle || st.title})`
                          }
                          storyAnalogy={stepStory || sec3d?.storyCue || ''}
                          storyMappings={rawStep?.storyMappings}
                          technicalHeading={`Technical Forensic Deep-Dive · Stage ${st.index}`}
                          technicalText={sec3d ? st.description : stepTechnical}
                          clausePrefix={String(st.index)}
                          storyTestId={`landing-stage-story-${st.index}`}
                          className="pt-1"
                        />
                      );
                    }
                    return (
                      <div className="space-y-1 pt-1">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Technical Forensic Deep-Dive
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {st.description}
                        </p>
                      </div>
                    );
                  })()}

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

        {memory3d && (
          <section
            id="memory-forensics-3d"
            aria-label="Virtual Memory Forensics Story and 3D Comparison"
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-6"
          >
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>
                Virtual Memory Forensics: Signed On-Disk Image vs Hollowed RWX RAM
              </span>
            </h2>
            <StandardStoryTechnicalSection
              scenarioId={scenario.id}
              sectionKey="memory-forensics"
              storyHeading="Real-World Story Analogy · Signed Disk vs Hollowed RAM"
              storyAnalogy={memory3d.storyCue}
              technicalHeading="Technical VAD / PE-Sieve Diff"
              technicalText={memory3d.technicalCue}
              clausePrefix="M"
            />
          </section>
        )}
            </>
          );

          return coreScenarioSections;
        })()}

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

        {relatedScenarios.length > 0 && (
          <section
            aria-label="Related Cyber Attack and DFIR Scenarios"
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              <span>
                Related {categoryLabel} &amp; MITRE ATT&amp;CK Scenarios (Topic
                Cluster)
              </span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Explore laterally related attack chains sharing the same tactic
              cluster, MITRE ATT&amp;CK® techniques, or forensic detection
              surface:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedScenarios.map((rel) => {
                const relMitre = Array.from(
                  new Set(rel.stages.map((st) => st.mitreTechniqueId))
                )
                  .slice(0, 2)
                  .join(', ');
                return (
                  <Link
                    key={rel.id}
                    href={`/scenarios/${rel.id}`}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/60 transition-colors flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1.5 text-[11px] font-mono">
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {rel.code}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {relMitre}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-2">
                        {rel.name}
                      </h3>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {rel.shortSubtitle}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      Inspect Forensic Breakdown →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

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
