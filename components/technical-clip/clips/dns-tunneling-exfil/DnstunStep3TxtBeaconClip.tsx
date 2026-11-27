'use client';

import { useCallback } from 'react';
import gsap from 'gsap';
import { AnimeClipStage, type ClipTimelineApi } from '../../AnimeClipStage';
import { FilmBackdrop } from '../../FilmBackdrop';
import { clipPace } from '../../clipPace';

const FONT = 'ui-monospace, monospace';

const BEATS = [
  {
    id: 0,
    tag: '01',
    title: 'Normal business hostnames have low Shannon entropy (~2.7–3.2 bits/byte) and high caching',
    story: 'Ordinary harbor addresses read like calm human words repeated often from memory.',
    technical: 'Standard corporate FQDNs reuse dictionary tokens and hit resolver caches frequently.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Covert DNS tunnel subdomains spike to 4.41 bits/byte entropy and 99.6% cache misses',
    story: 'Hundreds of gibberish scrolls streaming out every minute drive watchtower gauges sky-high.',
    technical: '412 unique 56-char labels in 60s targeting cdn-metrics-sync.example (78% TXT records).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Combining entropy, volume, TXT ratio, and Newly Observed Domain age kills false positives',
    story: 'Seeing a four-day-old offshore island absorb a gibberish flood leaves zero doubt of smuggling.',
    technical: 'Multi-feature SIEM scoring separates real tunnels from noisy legitimate cloud CDNs.',
  },
  {
    id: 3,
    tag: '04',
    title: 'SIEM-ENTROPY-408 correlates Zeek metrics directly with WKSTN-FIN-14 PID 6248',
    story: 'Watchtower math plus skylight desk photos hand responders an airtight case in seconds.',
    technical: 'Confirms ~184 KB staged exfiltration scope and triggers immediate RPZ containment.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'BASELINE', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'ANOMALY', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SCORING', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DnstunStep3TxtBeaconClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.d3-w1, .d3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.d3-mid, .d3-right, .d3-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.d3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.d3-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.d3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.d3-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.d3-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dnstun-step3"
      stageLabel="STEP #3"
      mitreId="T1071.004"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Zeek Shannon entropy and Newly Observed Domain detection">
        <FilmBackdrop prefix="d3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          STATISTICAL DNS TUNNELING ANALYTICS · SHANNON ENTROPY &amp; NOD SCORING
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          ALERT: SIEM-ENTROPY-408
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>NORMAL BASELINE DNS</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>api.corp-mail.example</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Shannon Entropy: 2.85</text>
        <text x="190" y="276" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Avg Label: 8–14 chars</text>
        <text x="190" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Cache Hit Ratio: ~85%</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Established Domain</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Predominantly A / AAAA</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Positive TTL caching</text>

        <line className="d3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="d3-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>COVERT TUNNEL PROFILE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>cdn-metrics-sync.example</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>ENTROPY: 4.41 BITS/BYTE</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>412 Unique Labels / 60s</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>99.6% Cache Miss · 78% TXT</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="590" y="368" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Newly Observed Domain</text>
          <text x="590" y="394" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Age: 4 days · Est Exfil: 184 KB</text>
        </g>

        <line className="d3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="d3-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>HIGH-FIDELITY P1 ALERT</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Zeek + Sysmon Join</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>5-Factor Tunnel Score</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Entropy + Length + Misses</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>+ TXT Ratio + NOD Age</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>ENCODING-AGNOSTIC</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Catches Hex, Base32 &amp; Custom</text>
        </g>

        <g className="d3-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DETECTION PRECISION: Pair Shannon entropy (&gt;= 3.9) with cache-miss ratio (&gt; 85%) &amp; Newly Observed Domain age
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Multi-signal scoring distinguishes covert tunnels from noisy legitimate cloud CDN domains cleanly
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
