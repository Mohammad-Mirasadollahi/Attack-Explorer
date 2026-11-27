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
    title: 'Workstation sends unique encoded lookup to internal recursive resolver DNS-INT-01',
    story: 'Each carrier pigeon flies first to the trusted central harbor postmaster tower.',
    technical: 'WKSTN-FIN-14 queries DNS-INT-01 (10.10.2.53:53) for an uncached unique subdomain.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Cache miss forces DNS-INT-01 to forward the query across the perimeter to rogue NS',
    story: 'Never having heard that scrambled address before, the postmaster relays the bird over the seawall.',
    technical: 'DNS-INT-01 iteratively contacts ns1.cdn-metrics-sync.example (198.51.100.77:53).',
  },
  {
    id: 2,
    tag: '03',
    title: 'External authoritative NS harvests the label and returns TTL=0 TXT encoded replies',
    story: 'The offshore lighthouse reads the leg scroll and blinks coded lantern orders back across the water.',
    technical: 'TXT answers with TTL=0.0 prevent caching so every beacon establishes bidirectional C2.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Audit recursive-to-authoritative resolver egress as a critical perimeter boundary',
    story: 'Harbor watchtowers must inspect every message crossing through the central postmaster tower.',
    technical: 'Zeek dns.log on DNS-INT-01 egress catches OilRig/APT34-style TXT/CNAME covert channels.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'RESOLVER', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'ROGUE NS', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'ZEEK LOG', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DnstunStep2Sysmon22Clip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.d2-w1, .d2-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.d2-mid, .d2-right, .d2-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.d2-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.d2-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.d2-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.d2-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.d2-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dnstun-step2"
      stageLabel="STEP #2"
      mitreId="T1048.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Recursive DNS resolver forwarding to authoritative NS with TXT replies">
        <FilmBackdrop prefix="d2" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          RECURSIVE DNS RELAY · UNCACHED FORWARDING &amp; TTL=0 TXT BEACON
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          DNS-INT-01 -&gt; 198.51.100.77:53
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>DNS-INT-01 RECURSIVE</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>10.10.2.53 (Internal)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Cache Miss (99.6%)</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Every subdomain is unique</text>
        <text x="190" y="298" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Forces external recursion</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Permitted Perimeter Path</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Crosses firewall even when</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>workstation HTTP is denied</text>

        <line className="d2-w1" x1="344" y1="295" x2="416" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="d2-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>ROGUE AUTHORITATIVE NS</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>ns1.cdn-metrics-sync.example</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="700" fontFamily={FONT}>REASSEMBLES HEX CHUNKS</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Extracts leftmost 56-char label</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Orders chunks by seq counter</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
          <text x="590" y="368" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Returns TXT (TTL = 0.0)</text>
          <text x="590" y="394" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>&quot;v=ok;seq=043;cmd=c3RhZ2U...&quot;</text>
        </g>

        <line className="d2-w2" x1="764" y1="295" x2="836" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="d2-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>ZEEK DNS.LOG VISIBILITY</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Resolver Perimeter Sensor</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Key Tunneling Fields</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>qtype=TXT/CNAME · TTL=0.0</text>
          <text x="1000" y="306" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>High unique queries / apex</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
          <text x="1000" y="376" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Unit 42 Reference</text>
          <text x="1000" y="402" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Matches OilRig / APT34 pattern</text>
        </g>

        <g className="d2-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            EGRESS REALITY: Internal recursive resolvers bridge segmented subnets to the public Internet — inspect them like firewalls
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Monitor Zeek dns.log for repeated TTL=0 TXT/CNAME exchanges targeting newly registered authoritative servers
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
