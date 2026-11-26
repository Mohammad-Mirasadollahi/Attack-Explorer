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
    title: 'Diff #1: Signed on-disk amsi.dll vs. live Copy-on-Write dirty RAM',
    story:
      'Placed side by side on the forensic bench, the clean blueprint vault holds six copper fuses while live workshop memory holds the brass short-circuit jumper.',
    technical:
      'C:\\Windows\\System32\\amsi.dll (4C 8B DC 49 89 5B) != PID 5412 @ 0x7FF9C2142840 (B8 57 00 07 80 C3).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Diff #2: Empty NTFS disk entry vs. unbacked MEM_PRIVATE RWX PE',
    story:
      'While the warehouse ledger shows zero deliveries on the floor, a full spinning reconnaissance drone hovers unbacked in mid-air.',
    technical:
      'VAD @ 0x000001E4A2100000 holds 4D 5A 90 00 (184 KB MEM_PRIVATE RWX) with FileObject = NULL (zero disk path).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Managed CLR heap preserves decrypted Stage2Recon artifacts in RAM',
    story:
      'Dumping the live workshop space captures both the tampered fuse block and the hovering drone configuration before the process exits.',
    technical:
      '0x000001E4A2150000 (96 KB RW- CLR Heap) + PE-sieve / Moneta confirm dual tamper & reflective injection.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'AMSI DIFF', transform: 'scale(1.24) translate(-40px, 35px)' },
  { id: 'UNBACKED PE', transform: 'scale(1.24) translate(-40px, -95px)' },
  { id: 'FORENSIC VERDICT', transform: 'scale(1.2) translate(-60px, -110px)' },
];

export function AmsiMemoryDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.diff-arrow-1, .diff-arrow-2'), { strokeDasharray: 220, strokeDashoffset: 220 });
    tl.set(q('.mismatch-1, .mismatch-2, .heap-footer'), { autoAlpha: 0, y: 12 });

    // Beat 0: AMSI Disk vs Live RAM 6-byte diff
    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.diff-arrow-1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to(q('.mismatch-1'), { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 'beat0+=0.45');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: NTFS None vs Unbacked MEM_PRIVATE RWX PE
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.diff-arrow-2'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat1');
    tl.to(q('.mismatch-2'), { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 'beat1+=0.45');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: Managed CLR Heap + Verdict
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.heap-footer'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat2');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-amsi-memory"
      stageLabel="MEMORY FORENSICS"
      mitreId="T1562.001 / T1620"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Forensic memory diff comparing clean on-disk amsi.dll against live 6-byte patched RAM and empty NTFS disk against unbacked MEM_PRIVATE RWX reflective PE at 0x000001E4A2100000"
      >
        <FilmBackdrop prefix="amsimem" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          LIVE MEMORY FORENSICS · ON-DISK BASELINE vs. powershell.exe (PID 5412) RAM
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          PE-sieve / Moneta / Volatility
        </text>

        {/* ROW 1: amsi.dll Disk vs Live CoW Dirty Page */}
        <g transform="translate(46, 76)">
          <rect width="410" height="172" rx="14" fill="#052e16" stroke="#10b981" strokeWidth="2.5" />
          <text x="20" y="32" fill="#6ee7b7" fontSize="12" fontFamily={FONT} fontWeight="800">
            ON-DISK SIGNED FILE (BASELINE)
          </text>
          <text x="20" y="64" fill="#f8fafc" fontSize="18" fontFamily={FONT} fontWeight="800">
            C:\Windows\System32\amsi.dll
          </text>
          <text x="20" y="102" fill="#34d399" fontSize="20" fontFamily={FONT} fontWeight="800">
            4C 8B DC 49 89 5B
          </text>
          <text x="20" y="138" fill="#a7f3d0" fontSize="12.5" fontFamily={FONT}>
            Shared SEC_IMAGE · Intact Prologue
          </text>
        </g>

        <path
          className="diff-arrow-1"
          d="M 464 162 L 606 162"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <g transform="translate(476, 114)">
          <g className="mismatch-1">
            <rect width="118" height="32" rx="6" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
            <text x="59" y="21" textAnchor="middle" fill="#fda4af" fontSize="12" fontFamily={FONT} fontWeight="800">
              6-BYTE DIFF
            </text>
          </g>
        </g>

        <g transform="translate(616, 76)">
          <rect width="536" height="172" rx="14" fill="#450a0a" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="20" y="32" fill="#fde047" fontSize="12" fontFamily={FONT} fontWeight="800">
            LIVE RAM CoW DIRTY PAGE · 0x7FF9C2142840 (R-X)
          </text>
          <text x="20" y="64" fill="#f8fafc" fontSize="18" fontFamily={FONT} fontWeight="800">
            amsi.dll!AmsiScanBuffer (Tampered)
          </text>
          <text x="20" y="102" fill="#fef08a" fontSize="20" fontFamily={FONT} fontWeight="800">
            B8 57 00 07 80 C3  (E_INVALIDARG)
          </text>
          <text x="20" y="138" fill="#fca5a5" fontSize="12.5" fontFamily={FONT}>
            Private Dirty Page · Re-locked 0x20 · Fails Disk Integrity Hash
          </text>
        </g>

        {/* ROW 2: NTFS Disk None vs Unbacked Reflective PE */}
        <g transform="translate(46, 282)">
          <rect width="410" height="172" rx="14" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" strokeDasharray="8 5" />
          <text x="20" y="32" fill="#94a3b8" fontSize="12" fontFamily={FONT} fontWeight="800">
            NTFS DISK BACKING FILE TABLE
          </text>
          <text x="20" y="66" fill="#e2e8f0" fontSize="19" fontFamily={FONT} fontWeight="800">
            FileObject = NULL (0 Bytes)
          </text>
          <text x="20" y="104" fill="#94a3b8" fontSize="14" fontFamily={FONT}>
            Sysmon Event ID 11 = NONE
          </text>
          <text x="20" y="138" fill="#64748b" fontSize="12.5" fontFamily={FONT}>
            No signed executable on disk corresponds to this RAM region
          </text>
        </g>

        <path
          className="diff-arrow-2"
          d="M 464 368 L 606 368"
          fill="none"
          stroke="#c084fc"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <g transform="translate(474, 320)">
          <g className="mismatch-2">
            <rect width="122" height="32" rx="6" fill="#2e1065" stroke="#c084fc" strokeWidth="1.8" />
            <text x="61" y="21" textAnchor="middle" fill="#e9d5ff" fontSize="12" fontFamily={FONT} fontWeight="800">
              UNBACKED PE
            </text>
          </g>
        </g>

        <g transform="translate(616, 282)">
          <rect width="536" height="172" rx="14" fill="#220f3a" stroke="#c084fc" strokeWidth="2.5" />
          <text x="20" y="32" fill="#e9d5ff" fontSize="12" fontFamily={FONT} fontWeight="800">
            LIVE RAM UNBACKED REGION · 0x000001E4A2100000 (184 KB)
          </text>
          <text x="20" y="64" fill="#f8fafc" fontSize="18" fontFamily={FONT} fontWeight="800">
            MEM_PRIVATE · PAGE_EXECUTE_READWRITE (0x40)
          </text>
          <text x="20" y="102" fill="#facc15" fontSize="20" fontFamily={FONT} fontWeight="800">
            4D 5A 90 00  (MZ / PE Reflective Image)
          </text>
          <text x="20" y="138" fill="#d8b4fe" fontSize="12.5" fontFamily={FONT}>
            Stage2Recon executing strictly in volatile RAM · CLR ETW EID 152
          </text>
        </g>

        {/* Bottom Managed CLR Heap Footer */}
        <g transform="translate(46, 488)">
          <g className="heap-footer">
            <rect width="1106" height="96" rx="14" fill="#172033" stroke="#38bdf8" strokeWidth="2.2" />
            <text x="24" y="34" fill="#38bdf8" fontSize="13" fontFamily={FONT} fontWeight="800">
              BLOCK #3 · MANAGED CLR ASSEMBLY HEAP @ 0x000001E4A2150000 (96 KB RW-)
            </text>
            <text x="24" y="68" fill="#e2e8f0" fontSize="14" fontFamily={FONT}>
              Contains decrypted Stage2Recon configuration strings inside PID 5412 · Recoverable via live RAM acquisition.
            </text>
          </g>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
