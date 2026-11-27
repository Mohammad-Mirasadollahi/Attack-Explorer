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
    title: '0x000001D840100000 holds active 56-character hex subdomain chunks staged for dispatch',
    story: 'Inside the rogue indoor desk, crimson coded paper slips sit stacked waiting for carrier pigeons.',
    technical: 'telemetry_sync.exe (PID 6248) stages encoded slices in RW heap before calling DnsQuery_W.',
  },
  {
    id: 1,
    tag: '02',
    title: '0x000001D840180000 shows Windows Dnscache churning with 99.6% misses and TTL=0 TXT replies',
    story: 'The postmaster ledger fills with single-use nonsense street names that never stay cached.',
    technical: 'svchost.exe (Dnscache) records zero-TTL TXT strings ("v=ok;seq=043") without reuse.',
  },
  {
    id: 2,
    tag: '03',
    title: '0x000001D840220000 reflects post-RPZ sinkhole enforcement returning 10.255.255.53',
    story: 'Once the emerald harbor net drops, every rogue inquiry lands harmlessly inside the guardhouse.',
    technical: 'DNS RPZ + perimeter port 53/853 deny permanently sever the covert tunnel channel.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Volatile memory + Zeek dns.log sequence reconstruction yields complete DFIR evidence',
    story: 'Inspectors compare the leftover desk slips against watchtower records to account for every page.',
    technical: 'Volatile staging buffers confirm exact source files and total transferred bytes (~184 KB).',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'BUFFER', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'DNSCACHE', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'RPZ SAFE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DnstunMemoryEntropyDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.dm-w1, .dm-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.dm-mid, .dm-right, .dm-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.dm-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.dm-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.dm-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.dm-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.dm-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dnstun-memory"
      stageLabel="MEMORY"
      mitreId="T1071.004"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Memory diff comparing DNS tunnel staging buffer and Dnscache against RPZ sinkhole state">
        <FilmBackdrop prefix="dm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          MEMORY &amp; CACHE FORENSICS · STAGING BUFFER VS. DNSCACHE VS. RPZ SINKHOLE
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WKSTN-FIN-14 · PID 1420 / 6248
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>0x000001D840100000</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Hex Staging Buffer (RW-)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>34 61 39 66 32 63 38 65</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>ASCII: &quot;4a9f2c8e1b7d3a04&quot;</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>56-char RFC 1035 labels</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Volatile Artifact</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Preserves unsent file slices</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>and sequence metadata</text>

        <line className="dm-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="dm-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>0x000001D840180000</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Dnscache Table (svchost 1420)</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="700" fontFamily={FONT}>TXT=v=ok;seq=043 (TTL=0)</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>99.6% Resolver Cache Misses</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Entropy 4.41 bits/byte</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Endpoint Memory Check</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>ipconfig /displaydns + dump</text>
        </g>

        <line className="dm-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="dm-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>0x000001D840220000</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>RPZ Sinkhole Enforced (R--)</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>RPZ_SINKHOLE_DROP</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Returns 10.255.255.53</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Zero external NS reachability</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>VERIFIED CLEAN</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Direct 53/853/DoH Blocked</text>
        </g>

        <g className="dm-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            MEMORY TAKEAWAY: Capture volatile memory before rebooting to recover staged chunks &amp; confirm exact data loss
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Correlate hex staging buffers with Zeek dns.log query sequences for complete incident disclosure
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
