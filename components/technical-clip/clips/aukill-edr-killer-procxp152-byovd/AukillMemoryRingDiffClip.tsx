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
    title: '0xFFFFF8041A200000 shows the vulnerable PROCEXP152.SYS driver mapped into kernel Pool memory',
    story: 'Inside the reactor pit schematic, the unauthorized brass wrench sits wired directly into the master power rail.',
    technical: 'Kernel module list contains PROCEXP152.SYS exposing IRP_MJ_DEVICE_CONTROL handler 0x8335003C.',
  },
  {
    id: 1,
    tag: '02',
    title: '0xFFFFF8041A280000 exposes the Ring 0 handle table granting PROCESS_ALL_ACCESS against PPL',
    story: 'A crimson bypass wire bridges straight across the armored security seal of every watchtower panel.',
    technical: 'Kernel handle table elevates user-mode aukill.exe past PsProtectedSignerAntimalware-Light.',
  },
  {
    id: 2,
    tag: '03',
    title: '0xFFFFF8041A340000 reflects HVCI + WDAC kernel enforcement blocking the mapping completely',
    story: 'With the green steel safety shutter locked down, the reactor pit remains untouched and every guard light burns steady.',
    technical: 'VBS CI.dll rejects the blocklisted driver hash before any Ring 0 code page becomes executable.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Volatility driverscan and handle audits prove BYOVD execution during memory forensics',
    story: 'Inspectors review the reactor pit log to prove exactly which recalled tool cut the watchtower power.',
    technical: 'Inspect loaded kernel modules and device objects (\\Device\\PROCEXP152) in live triage or crash dumps.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DRIVER MAP', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'RING0 HNDL', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'HVCI SAFE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function AukillMemoryRingDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.aukm-w1, .aukm-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.aukm-mid, .aukm-right, .aukm-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.aukm-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.aukm-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.aukm-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.aukm-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.aukm-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-aukill-memory"
      stageLabel="MEMORY"
      mitreId="T1543.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Windows kernel memory comparison between loaded vulnerable driver BYOVD state and HVCI enforcement">
        <FilmBackdrop prefix="aukm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          KERNEL MEMORY DIFF · RING 0 BYOVD DRIVER MAPPING VS. HVCI BLOCKLIST LOCK
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          RING 0 POOL · PPL INTEGRITY
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>0xFFFFF8041A200000</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>PROCEXP152.SYS Mapped</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>\\Device\\PROCEXP152</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>IRP_MJ_DEVICE_CONTROL</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>IOCTL 0x8335003C Live</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Forensic Artifact</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Visible in Volatility modules</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>and PiDDBCacheTable</text>

        <line className="aukm-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="aukm-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>0xFFFFF8041A280000</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Kernel Handle Elevation</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Access: 0x001FFFFF (ALL)</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Target: MsMpEng.exe (PPL)</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Bypasses Ring 3 Tamper Lock</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Sensor Result</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>EDR killed in 1-sec loop</text>
        </g>

        <line className="aukm-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="aukm-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>0xFFFFF8041A340000</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>HVCI + WDAC Sealed (R--)</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>BLOCKLIST REJECTED</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Zero Ring 0 Pages Mapped</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>CodeIntegrity EID 3077 Logged</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>VERIFIED INTACT</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>PPL &amp; EDR Telemetry Unbroken</text>
        </g>

        <g className="aukm-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            KERNEL TAKEAWAY: Inspect PiDDBCacheTable and loaded driver hashes to detect BYOVD even after driver unload
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            HVCI and Microsoft Vulnerable Driver Blocklist stop vulnerable drivers before Ring 0 memory mapping occurs
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
