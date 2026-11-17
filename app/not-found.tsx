import type { Metadata } from 'next';
import Link from 'next/link';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import { ArrowLeft, BookOpen, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page or Scenario Not Found (404)',
  description:
    'The requested Attack Explorer page or cyber attack scenario could not be found. Browse our complete directory of 141 MITRE ATT&CK & DFIR scenarios.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  const featuredScenarios = ATTACK_SCENARIOS.slice(0, 6);

  return (
    <main
      dir="ltr"
      data-testid="not-found-seo-page"
      className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-8"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25 text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>HTTP 404 · RESOURCE NOT FOUND</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Page or Attack Scenario Not Found
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The requested URL does not match an active telemetry view or
            documented MITRE ATT&amp;CK scenario. Use the links below to return
            to the interactive simulator workbench or browse the complete
            scenario catalog.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Attack Explorer Workbench</span>
            </Link>
            <Link
              href="/sources"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All {ATTACK_SCENARIOS.length} Scenarios</span>
            </Link>
            <Link
              href="/about"
              className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2"
            >
              About Creator
            </Link>
          </div>
        </header>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-zinc-950 dark:text-white">
            Featured MITRE ATT&amp;CK &amp; DFIR Scenarios
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredScenarios.map((sc) => (
              <li key={sc.id}>
                <Link
                  href={`/scenarios/${sc.id}`}
                  className="block p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors"
                >
                  <div className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {sc.code} · {sc.category}
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
