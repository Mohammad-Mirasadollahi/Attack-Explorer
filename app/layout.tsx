import type { Metadata, Viewport } from 'next';
import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Patrick_Hand,
} from 'next/font/google';
import './globals.css';
import {
  DEFAULT_LAYOUT_MODE,
  DESKTOP_LAYOUT_WIDTH,
  LAYOUT_MODE_STORAGE_KEY,
} from '@/lib/layout-preference';
import { buildRootJsonLd, resolveSiteUrl } from '@/lib/seo-metadata';

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

const siteUrl = resolveSiteUrl();
let metadataBaseUrl: URL;
try {
  metadataBaseUrl = new URL(siteUrl);
} catch {
  metadataBaseUrl = new URL('https://www.attackexplorer.com');
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    template: '%s | Attack Explorer',
  },
  description:
    'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
  applicationName: 'Attack Explorer',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'MITRE ATT&CK',
    'Cyber Attack Simulator',
    'SIEM Log Analysis',
    'Sysmon Telemetry',
    'Malware Behavior Analysis',
    'DFIR Forensics',
    'Process Hollowing',
    'Ransomware Simulation',
    'Kerberoasting',
  ],
  authors: [
    {
      name: 'Mohammad Mirasadollahi',
      url: 'https://github.com/Mohammad-Mirasadollahi',
    },
    { name: 'Attack Explorer Team' },
  ],
  creator: 'Attack Explorer',
  publisher: 'Attack Explorer',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    description:
      'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
    url: siteUrl,
    siteName: 'Attack Explorer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1600,
        height: 900,
        alt: 'Attack Explorer Interactive Simulation Canvas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer',
    description:
      'An interactive step-by-step visual simulator and analyzer for cyber attacks, SIEM/Sysmon log analysis, and malware behavioral execution mapped to MITRE ATT&CK.',
    creator: '@M_Mirasadollahi',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/** Allow pinch-zoom / pan; client script may switch to a fixed desktop width. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 0.2,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

const LAYOUT_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var key = ${JSON.stringify(LAYOUT_MODE_STORAGE_KEY)};
    var desktopWidth = ${DESKTOP_LAYOUT_WIDTH};
    var fallback = ${JSON.stringify(DEFAULT_LAYOUT_MODE)};
    var mode = fallback;
    try {
      var stored = window.localStorage.getItem(key);
      if (stored === 'DESKTOP' || stored === 'RESPONSIVE') mode = stored;
    } catch (e) {}
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    document.documentElement.dataset.layoutMode = mode;
    if (mode === 'DESKTOP') {
      var screenW = (window.screen && window.screen.width) || 0;
      var screenH = (window.screen && window.screen.height) || 0;
      var candidates = [
        (window.visualViewport && window.visualViewport.width) || 0,
        window.innerWidth || 0,
        window.outerWidth || 0,
        screenW,
        screenH
      ].filter(function (n) { return n > 0 && n < desktopWidth * 0.92; });
      var physical = candidates.length
        ? Math.max.apply(null, candidates)
        : Math.min(screenW || desktopWidth, screenH || desktopWidth) || 390;
      physical = Math.max(320, physical);
      var scale = Math.min(1, physical / desktopWidth);
      meta.setAttribute(
        'content',
        'width=' + desktopWidth +
          ', initial-scale=' + scale.toFixed(3) +
          ', minimum-scale=0.2, maximum-scale=3, user-scalable=yes, viewport-fit=cover'
      );
      document.documentElement.classList.add('layout-force-desktop');
      document.documentElement.classList.remove('layout-responsive');
    } else {
      meta.setAttribute(
        'content',
        'width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
      );
      document.documentElement.classList.add('layout-responsive');
      document.documentElement.classList.remove('layout-force-desktop');
    }
  } catch (e) {}
})();
`;

const ROOT_JSON_LD = JSON.stringify(buildRootJsonLd(siteUrl));

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
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: LAYOUT_BOOTSTRAP_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ROOT_JSON_LD }}
        />
      </head>
      <body
        className="bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
