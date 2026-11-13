import type { Metadata } from 'next';
import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Patrick_Hand,
} from 'next/font/google';
import './globals.css';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sketch',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
  description:
    'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
  openGraph: {
    title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    description:
      'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    description:
      'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} ${patrickHand.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
