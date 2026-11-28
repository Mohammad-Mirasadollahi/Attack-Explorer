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
    title: 'SUNSPOT runs silently on the SolarWinds build server polling every second for MsBuild.exe',
    story: 'A hidden night watchman sits beside the factory conveyor belt waiting for the foundry furnace to ignite.',
    technical: 'taskhostsvc.exe acquires a mutex and watches process creation for Orion solution builds.',
  },
  {
    id: 1,
    tag: '02',
    title: 'At compile time SUNSPOT swaps InventoryManager.cs with a backdoored copy containing SUNBURST',
    story: 'The moment the press begins, the intruder slips a counterfeit brass plate into the mold without tripping alarms.',
    technical: 'Original source is backed up as .bk, compiled with trojanized C# code, and restored after MsBuild exits.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Git repositories remain untouched so static source audits show zero malicious commits',
    story: 'Once the coin is stamped, the clean original mold goes back on the rack so morning inspectors see nothing amiss.',
    technical: 'Ephemeral build-time injection leaves version control history completely clean while poisoning the compiled DLL.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Reproducible builds and SLSA provenance attestations expose hidden compiler tampering',
    story: 'Comparing two coins pressed in separate clean rooms reveals the secret engraving instantly.',
    technical: 'Verify build artifacts in isolated ephemeral runners and compare output hashes against deterministic builds.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SUNSPOT', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'SWAP .CS', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SLSA FIX', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function SunburstStep1SunspotClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.sunb1-w1, .sunb1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.sunb1-mid, .sunb1-right, .sunb1-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.sunb1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.sunb1-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.sunb1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.sunb1-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.sunb1-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-sunburst-step1"
      stageLabel="STEP #1"
      mitreId="T1195.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="SUNSPOT build-time C# source file substitution during Orion MSBuild compilation">
        <FilmBackdrop prefix="sunb1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          SUNSPOT BUILD-SERVER IMPLANT · EPHEMERAL C# SOURCE SUBSTITUTION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          BUILD-ORION-02 · MSBUILD.EXE
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>SUNSPOT WATCHDOG</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>taskhostsvc.exe</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>1-Second Process Poll</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Detects MsBuild.exe</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Matches Orion Solution Arg</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Stealth Logging</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>AES-encrypted debug log</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>avoids build error breaks</text>

        <line className="sunb1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="sunb1-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>LIVE FILE SWAP WINDOW</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>InventoryManager.cs -&gt; .bk</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Injects OrionImprovement</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>BusinessLayer.Initialize()</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Compiled straight into IL</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Post-Compile Restore</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Clean .cs restored on disk</text>
        </g>

        <line className="sunb1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="sunb1-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>CLEAN GIT / DIRTY DLL</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Repo Diff Shows Zero Changes</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SolarWinds.Orion.Core.</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>BusinessLayer.dll (Trojan)</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>SHA-256 Diverges From Source</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>BUILD DEFENSE</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Ephemeral SLSA Build + Diff</text>
        </g>

        <g className="sunb1-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SUPPLY-CHAIN RULE: Reproducible builds in ephemeral CI runners detect silent compiler-time source swaps
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Monitor file-rename bursts (*.cs -&gt; *.bk) and unexpected child processes on dedicated release builders
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
