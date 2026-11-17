import type { Metadata } from 'next';
import Link from 'next/link';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import { LEGAL_COMPLIANCE_STATEMENT } from '@/lib/attack-sources-and-legal';
import {
  AUTHOR_PROFILE,
  buildAboutJsonLd,
  resolveSiteUrl,
} from '@/lib/seo-metadata';
import { ArrowLeft, ExternalLink, ShieldCheck, UserRound } from 'lucide-react';

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  title: 'About the Creator — Mohammad Mirasadollahi',
  description:
    'Learn about Mohammad Mirasadollahi (@M_Mirasadollahi), creator of Attack Explorer, and the defensive cybersecurity engineering methodology behind the MITRE ATT&CK simulator.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Attack Explorer & Creator Mohammad Mirasadollahi',
    description:
      'Creator profile, defensive cybersecurity engineering methodology, and contact links for Attack Explorer.',
    url: `${siteUrl}/about`,
    siteName: 'Attack Explorer',
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: '/og-image.png',
        width: 1600,
        height: 900,
        alt: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Attack Explorer & Creator Mohammad Mirasadollahi',
    description:
      'Creator profile, defensive cybersecurity engineering methodology, and contact links for Attack Explorer.',
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  const aboutJsonLd = JSON.stringify(buildAboutJsonLd());

  return (
    <main
      dir="ltr"
      data-testid="about-seo-page"
      className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: aboutJsonLd }}
      />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interactive Workbench</span>
          </Link>
          <Link
            href="/sources"
            className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sources, Citations &amp; Legal Policy →
          </Link>
        </div>

        <header className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/25 text-xs font-mono font-bold">
            <UserRound className="w-4 h-4" />
            <span>CREATOR &amp; LEAD ARCHITECT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {AUTHOR_PROFILE.name} — Creator of Attack Explorer
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Attack Explorer is built and maintained by{' '}
            <strong>{AUTHOR_PROFILE.name}</strong> ({AUTHOR_PROFILE.handle}).
            Designed for security engineers, SOC analysts, DFIR investigators,
            and red/blue teams, the platform bridges the gap between high-level
            network architecture diagrams and low-level SIEM/Sysmon log and
            process memory forensics across {ATTACK_SCENARIOS.length} documented
            adversary scenarios.
          </p>
        </header>

        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            Verified Profiles &amp; Direct Contact
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li>
              <a
                href="https://github.com/Mohammad-Mirasadollahi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold">GitHub</div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Mohammad-Mirasadollahi
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/M_Mirasadollahi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold">X (Twitter)</div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    @M_Mirasadollahi
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/mohammad-mirasadollahi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold">LinkedIn</div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    mohammad-mirasadollahi
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            </li>
          </ul>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono pt-2">
            Security &amp; responsible disclosure contact:{' '}
            <a
              href="mailto:security@attackexplorer.org"
              className="text-indigo-600 dark:text-indigo-400 underline"
            >
              security@attackexplorer.org
            </a>{' '}
            (see{' '}
            <a
              href="/.well-known/security.txt"
              className="text-indigo-600 dark:text-indigo-400 underline"
            >
              /.well-known/security.txt
            </a>
            )
          </p>
        </section>

        <section className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-6 space-y-2">
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
        </section>
      </div>
    </main>
  );
}
