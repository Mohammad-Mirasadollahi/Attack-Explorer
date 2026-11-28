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
    title: '0x00007FF812040000 shows the clean Orion DLL baseline matching Git source compilation',
    story: 'On the left velvet tray sits a genuine royal coin whose ridges match the official mint blueprint.',
    technical: 'Clean SolarWinds.Orion.Core.BusinessLayer.dll contains only legitimate InventoryManager methods.',
  },
  {
    id: 1,
    tag: '02',
    title: '0x00007FF8120A0000 exposes the injected OrionImprovementBusinessLayer .NET IL classes',
    story: 'Under a magnifying lens, the forged coin reveals hidden clockwork gears stamped behind the same royal crest.',
    technical: 'Trojanized DLL embeds ~4,000 lines of obfuscated C# IL implementing dormancy, DGA, and C2 dispatch.',
  },
  {
    id: 2,
    tag: '03',
    title: '0x00007FF812120000 displays reproducible SLSA build verification rejecting tampered binaries',
    story: 'A green inspector scale compares the two mint rooms and automatically rejects any coin with extra weight.',
    technical: 'Independent deterministic builds prove hash divergence before signing HSM ever applies a signature.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Comparing loaded .NET assemblies against clean vendor hashes confirms SUNBURST presence',
    story: 'Inspectors weigh every coin inside the counting room to verify which vaults received the hidden gears.',
    technical: 'Check SHA-256 hashes and decompiled IL methods of BusinessLayer.dll across all Orion installations.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'CLEAN IL', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'SUNBURST', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SLSA DIFF', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function SunburstMemoryIlDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.sunbm-w1, .sunbm-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.sunbm-mid, .sunbm-right, .sunbm-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.sunbm-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.sunbm-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.sunbm-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.sunbm-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.sunbm-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-sunburst-memory"
      stageLabel="MEMORY"
      mitreId="T1195.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="MSIL assembly comparison between clean Orion DLL and SUNBURST trojanized binary">
        <FilmBackdrop prefix="sunbm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          .NET MSIL ASSEMBLY DIFF · CLEAN SOURCE BUILD VS. SUNBURST TROJANIZED DLL
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          BUSINESSLAYER.DLL · IL DIFF
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>0x00007FF812040000</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Clean Git Baseline IL</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>InventoryManager.Refresh()</text>
        <text x="190" y="276" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Standard Orion NMS Logic</text>
        <text x="190" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Zero Hidden Background Threads</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Source Verification</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Matches repository commit</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>byte-for-byte on clean build</text>

        <line className="sunbm-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="sunbm-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>0x00007FF8120A0000</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Trojanized Signed DLL (RX)</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>OrionImprovementBusinessLayer</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>+4,000 Lines Trojan C# IL</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Valid Authenticode Signature</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Runtime Hook</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Spawns stealth DGA thread</text>
        </g>

        <line className="sunbm-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="sunbm-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>0x00007FF812120000</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>SLSA Reproducible Gate</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SHA-256 MISMATCH BLOCK</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Two Independent Builders</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Signing Halted Before Release</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>VERIFIED CLEAN</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Provenance Bound to Commit</text>
        </g>

        <g className="sunbm-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            ASSEMBLY TAKEAWAY: Diffing compiled .NET IL against independent builds defeats ephemeral build-time implants
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Always inspect loaded assemblies and known-bad SHA-256 IOCs even when Authenticode signatures pass
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
