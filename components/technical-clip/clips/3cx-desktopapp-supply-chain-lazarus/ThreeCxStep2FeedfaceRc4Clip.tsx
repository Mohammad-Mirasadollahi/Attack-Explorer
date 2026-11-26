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
    title: '3CXDesktopApp.exe side-loads the trojanized ffmpeg.dll at startup',
    story:
      'When the office phone application powers on, it reaches into its own folder and wakes up the counterfeit internal component right beside it.',
    technical:
      '3CXDesktopApp.exe (PID 7120) loads unsigned ffmpeg.dll from %LOCALAPPDATA%\\Programs\\3CXDesktopApp\\app-18.12.407\\.',
  },
  {
    id: 1,
    tag: '02',
    title: 'ffmpeg.dll scans d3dcompiler_47.dll for the 0xFEEDFACE magic marker',
    story:
      'The counterfeit component shines a scanner beam along the neighboring sealed plate until a four-letter marker lights up past the real seam.',
    technical:
      'ffmpeg.dll reads sibling d3dcompiler_47.dll (0x7FF8A1000000) and locates the 4-byte sentinel FE ED FA CE (0xFEEDFACE).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Trailing 312 KB payload is RC4-decrypted with key 3jB(2bsG#@c7',
    story:
      'A spinning cipher tumbler unlocks the scrambled blueprint tucked behind that marker using a hardcoded twelve-character key.',
    technical:
      'The embedded loader runs RC4 decryption using key "3jB(2bsG#@c7" over the 312 KB ciphertext trailing 0xFEEDFACE.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Decrypted loader lands in unbacked VirtualAlloc RWX memory',
    story:
      'The freshly unlocked instructions step onto a blank, unmarked glass workbench in private memory where no official file certificate exists.',
    technical:
      'VirtualAlloc(PAGE_EXECUTE_READWRITE) maps the payload at 0x000001C948200000 (MEM_PRIVATE RWX) with zero disk file backing.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: '0xFEEDFACE', transform: 'scale(1.26) translate(75px, -20px)' },
  { id: 'RC4 KEY', transform: 'scale(1.28) translate(-35px, -30px)' },
  { id: 'RWX HEAP', transform: 'scale(1.26) translate(-125px, -25px)' },
];

export function ThreeCxStep2FeedfaceRc4Clip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.seek-wire, .rc4-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.marker-glow, .rc4-box, .rwx-box'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.seek-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.marker-glow'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.rc4-box'), { autoAlpha: 1, y: 0, duration: 0.65, ease: 'back.out(1.3)' }, 'beat2');
    tl.to(q('.rc4-wire'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat2+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.rwx-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-threecx-step2"
      stageLabel="STEP #2"
      mitreId="T1574.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="ffmpeg.dll sideload locates 0xFEEDFACE marker in d3dcompiler_47.dll, RC4-decrypts 312 KB shellcode with key 3jB(2bsG#@c7, and maps MEM_PRIVATE RWX memory at 0x000001C948200000"
      >
        <FilmBackdrop prefix="cx2" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          DLL SIDELOAD · 0xFEEDFACE MARKER · RC4 DECRYPT → UNBACKED RWX ALLOCATION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          3CXDesktopApp.exe (PID 7120) · WKS-TRD-14
        </text>

        {/* Host + ffmpeg.dll */}
        <rect x="40" y="160" width="260" height="270" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="170" y="196" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="700" fontFamily={FONT}>
          3CXDesktopApp.exe
        </text>
        <text x="170" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          PID 7120 · Electron Host
        </text>
        <rect x="60" y="246" width="220" height="158" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2.2" />
        <text x="170" y="280" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
          ffmpeg.dll
        </text>
        <text x="170" y="306" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
          Sideloaded Proxy (Unsigned)
        </text>
        <text x="170" y="340" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
          DllMain → scan sibling
        </text>
        <text x="170" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
          d3dcompiler_47.dll
        </text>

        <line className="seek-wire" x1="304" y1="295" x2="386" y2="295" stroke="#f59e0b" strokeWidth="4" />

        {/* d3dcompiler_47.dll Carrier */}
        <rect x="390" y="130" width="320" height="330" rx="16" fill="#0f172a" stroke="#475569" strokeWidth="2.2" />
        <text x="550" y="162" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700" fontFamily={FONT}>
          d3dcompiler_47.dll
        </text>
        <text x="550" y="184" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          Base: 0x7FF8A1000000
        </text>

        {/* Legitimate PE sections */}
        <rect x="412" y="204" width="276" height="82" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="1.8" />
        <text x="550" y="236" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>
          Authentic Microsoft PE Sections
        </text>
        <text x="550" y="262" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          .text / .rdata / .data (Clean)
        </text>

        {/* 0xFEEDFACE Marker + Ciphertext */}
        <g className="marker-glow">
          <rect x="412" y="302" width="276" height="46" rx="8" fill="#78350f" stroke="#fbbf24" strokeWidth="2.4" />
          <text x="550" y="330" textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="700" fontFamily={FONT}>
            MARKER: FE ED FA CE
          </text>
          <rect x="412" y="358" width="276" height="82" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="2.2" />
          <text x="550" y="390" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>
            312 KB RC4 Ciphertext Blob
          </text>
          <text x="550" y="416" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            High entropy · Appended after PE
          </text>
        </g>

        {/* RC4 Tumbler Box */}
        <g className="rc4-box">
          <rect x="412" y="492" width="276" height="92" rx="12" fill="#312e81" stroke="#818cf8" strokeWidth="2.4" />
          <text x="550" y="526" textAnchor="middle" fill="#e0e7ff" fontSize="13" fontWeight="700" fontFamily={FONT}>
            RC4 STREAM DECRYPT
          </text>
          <text x="550" y="556" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="700" fontFamily={FONT}>
            Key: 3jB(2bsG#@c7
          </text>
        </g>

        <line className="rc4-wire" x1="714" y1="360" x2="816" y2="360" stroke="#ef4444" strokeWidth="4" />

        {/* Unbacked RWX Allocation */}
        <g className="rwx-box">
          <rect x="820" y="160" width="340" height="310" rx="16" fill="#450a0a" stroke="#ef4444" strokeWidth="2.6" />
          <text x="990" y="198" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
            UNBACKED PRIVATE MEMORY
          </text>
          <text x="990" y="226" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
            0x000001C948200000
          </text>
          <rect x="844" y="252" width="292" height="190" rx="10" fill="#1f0a0a" stroke="#f87171" strokeWidth="1.8" />
          <text x="990" y="286" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="700" fontFamily={FONT}>
            PAGE_EXECUTE_READWRITE
          </text>
          <text x="990" y="316" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily={FONT}>
            MEM_PRIVATE · No File on Disk
          </text>
          <text x="990" y="350" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            VirtualAlloc(NULL, 0x4E000, 0x40)
          </text>
          <text x="990" y="382" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            Decrypted Stage-1 Loader Active
          </text>
          <text x="990" y="414" textAnchor="middle" fill="#c084fc" fontSize="11" fontFamily={FONT}>
            EDR Alert: Unbacked RWX Execution
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
