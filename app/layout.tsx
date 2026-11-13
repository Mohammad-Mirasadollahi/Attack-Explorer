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
