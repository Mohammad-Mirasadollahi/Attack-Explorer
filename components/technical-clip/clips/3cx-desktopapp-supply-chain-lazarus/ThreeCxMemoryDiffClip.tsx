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
    title: 'Left baseline: clean Microsoft d3dcompiler_47.dll ends cleanly at PE EOF',
    story:
      'On the left inspection bench sits an authentic factory display plate whose rear edge ends smoothly with no hidden pocket behind it.',
    technical:
      'Clean Microsoft-signed d3dcompiler_47.dll contains only standard PE sections (.text, .rdata, .data) with zero trailing overlay.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Right memory view: trojanized 0x7FF8A1000000 carries 0xFEEDFACE + 312 KB RC4',
    story:
      'On the right bench, the swapped factory plate carries a stamped four-letter sentinel followed by a thick encrypted compartment.',
    technical:
      'Trojanized d3dcompiler_47.dll mapped at 0x7FF8A1000000 appends FE ED FA CE + 312 KB high-entropy RC4 ciphertext.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Two unbacked MEM_PRIVATE RWX regions host the loader and ICONICSTEALER',
    story:
      'Beside that plate float two unmarked glass slabs in private memory running active machinery without any factory file stamp.',
    technical:
      '0x000001C948200000 (loader) and 0x000001C948280000 (ICONICSTEALER / Gopuram) are MEM_PRIVATE PAGE_EXECUTE_READWRITE regions.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Memory scanner correlates 0xFEEDFACE + unbacked RWX inside PID 7120',
    story:
      'Comparing the clean plate against the live workbench exposes the hidden compartment and floating workbenches in a single forensic scan.',
    technical:
      'Volatility / PE-sieve / Moneta immediately flag unsigned ffmpeg.dll, trailing 0xFEEDFACE overlay, and unbacked RWX shells in PID 7120.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'CLEAN DLL', transform: 'scale(1.24) translate(115px, -15px)' },
  { id: '0xFEEDFACE', transform: 'scale(1.26) translate(-80px, 15px)' },
  { id: 'RWX SLABS', transform: 'scale(1.28) translate(-100px, -95px)' },
];

export function ThreeCxMemoryDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.diff-overlay, .rwx-slabs, .forensic-verdict'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.diff-overlay'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.rwx-slabs'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'back.out(1.2)' }, 'beat2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.forensic-verdict'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-threecx-memory"
      stageLabel="MEMORY FORENSICS"
      mitreId="T1574.002 / T1140"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Memory forensics diff comparing clean Microsoft d3dcompiler_47.dll against trojanized 0x7FF8A1000000 with 0xFEEDFACE overlay and unbacked MEM_PRIVATE RWX regions at 0x000001C948200000 and 0x000001C948280000"
      >
        <FilmBackdrop prefix="cxmem" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          VIRTUAL MEMORY FORENSICS · CLEAN BASELINE VS. TROJANIZED PID 7120
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          3CXDesktopApp.exe · 3 Memory Artifacts
        </text>

        {/* Left: Clean Baseline */}
        <rect x="44" y="88" width="460" height="388" rx="16" fill="#0f172a" stroke="#22c55e" strokeWidth="2.4" />
        <text x="274" y="122" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="700" fontFamily={FONT}>
          CLEAN BASELINE · MICROSOFT SIGNED
        </text>
        <text x="274" y="146" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          d3dcompiler_47.dll (Unmodified)
        </text>

        <rect x="74" y="170" width="400" height="68" rx="10" fill="#1e293b" stroke="#22c55e" />
        <text x="274" y="200" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>
          PE Header + Authenticode Cert
        </text>
        <text x="274" y="222" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT}>
          Signature Verified: Microsoft Windows
        </text>

        <rect x="74" y="254" width="400" height="96" rx="10" fill="#1e293b" stroke="#38bdf8" />
        <text x="274" y="286" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily={FONT}>
          .text (RX) · .rdata (R) · .data (RW)
        </text>
        <text x="274" y="314" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          File-Backed MEM_IMAGE Only
        </text>
        <text x="274" y="336" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
          Clean EOF · 0 Trailing Overlay Bytes
        </text>

        <rect x="74" y="368" width="400" height="82" rx="10" fill="#052e16" stroke="#16a34a" strokeDasharray="6 4" />
        <text x="274" y="404" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>
          NO UNBACKED RWX SHELLCODE
        </text>
        <text x="274" y="428" textAnchor="middle" fill="#bbf7d0" fontSize="11" fontFamily={FONT}>
          All executable pages map to signed DLLs on disk
        </text>

        {/* Right: Trojanized PID 7120 */}
        <rect x="546" y="88" width="610" height="388" rx="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
        <text x="851" y="122" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
          COMPROMISED PID 7120 · LIVE MEMORY DIFF
        </text>
        <text x="851" y="146" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
          3CXDesktopApp.exe (v18.12.407)
        </text>

        {/* Trojanized Carrier + FEEDFACE */}
        <g className="diff-overlay">
          <rect x="574" y="168" width="554" height="118" rx="10" fill="#450a0a" stroke="#f59e0b" strokeWidth="2.2" />
          <text x="851" y="198" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
            0x7FF8A1000000 · d3dcompiler_47.dll (TAMPERED)
          </text>
          <text x="851" y="226" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>
            FE ED FA CE (0xFEEDFACE) + 312 KB RC4 Overlay
          </text>
          <text x="851" y="254" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Signature broken · Paired with unsigned ffmpeg.dll sideload
          </text>
        </g>

        {/* Two Unbacked RWX Regions */}
        <g className="rwx-slabs">
          <rect x="574" y="302" width="268" height="150" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2.2" />
          <text x="708" y="332" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x000001C948200000
          </text>
          <text x="708" y="358" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700" fontFamily={FONT}>
            MEM_PRIVATE · RWX (0x40)
          </text>
          <text x="708" y="388" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily={FONT}>
            RC4-Decrypted Stage-1 Loader
          </text>
          <text x="708" y="416" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={FONT}>
            GitHub .ico Dead-Drop Resolver
          </text>

          <rect x="860" y="302" width="268" height="150" rx="10" fill="#3b0764" stroke="#c084fc" strokeWidth="2.2" />
          <text x="994" y="332" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x000001C948280000
          </text>
          <text x="994" y="358" textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="700" fontFamily={FONT}>
            MEM_PRIVATE · RWX (0x40)
          </text>
          <text x="994" y="388" textAnchor="middle" fill="#f5d0fe" fontSize="11" fontFamily={FONT}>
            ICONICSTEALER / Gopuram
          </text>
          <text x="994" y="416" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily={FONT}>
            Browser Login Data + Stage-2 C2
          </text>
        </g>

        {/* Forensic Verdict */}
        <g className="forensic-verdict">
          <rect x="190" y="504" width="820" height="90" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            FORENSIC TRIAD: Unsigned ffmpeg.dll + 0xFEEDFACE Overlay + Dual Unbacked RWX Allocations
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            PE-sieve / Moneta / EDR memory scanners catch all three anomalies inside PID 7120 despite the signed outer MSI
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
