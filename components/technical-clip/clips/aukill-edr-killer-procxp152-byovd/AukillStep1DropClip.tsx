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
    title: 'AuKill drops an outdated yet legitimately Microsoft-signed Process Explorer driver to disk',
    story: 'An intruder walks up to the power plant gate carrying an older heavy brass wrench stamped with the factory crest.',
    technical: 'aukill.exe writes vulnerable PROCEXP152.SYS (v16.32) into C:\\Windows\\System32\\drivers\\.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Windows Driver Signature Enforcement verifies the authentic certificate and loads it into Ring 0',
    story: 'The gate guard inspects the genuine brass emblem and waves the wrench straight down into the reactor pit.',
    technical: 'CreateService + StartService registers PROCEXP152 as a kernel driver passing DSE checks.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Windows Event ID 7045 and Sysmon Event ID 6 record the newly loaded vulnerable driver hash',
    story: 'Both the gate logbook and pit camera capture the wrench serial number the instant it enters the room.',
    technical: 'Sysmon EID 6 logs SHA-256 and Signature=Microsoft Corporation alongside EID 7045 service creation.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Matching Sysmon EID 6 hashes against LOLDrivers catches BYOVD loaders before EDR dies',
    story: 'Checking every incoming tool against a recalled-wrench bulletin stops sabotage before switches are touched.',
    technical: 'Alert on any non-Process-Explorer binary dropping or loading known-vulnerable PROCEXP152.SYS hashes.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DSE PASS', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'RING 0', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'EID 6+7045', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function AukillStep1DropClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.auk1-w1, .auk1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.auk1-mid, .auk1-right, .auk1-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.auk1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.auk1-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.auk1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.auk1-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.auk1-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-aukill-step1"
      stageLabel="STEP #1"
      mitreId="T1543.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="AuKill dropping legitimately signed PROCEXP152.SYS vulnerable driver into Windows Ring 0">
        <FilmBackdrop prefix="auk1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          BYOVD DRIVER STAGING · SIGNED PROCEXP152.SYS LOADED INTO RING 0
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          AUKILL.EXE (PID 5104) · T1543.003
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>AUKILL LOADER (RING 3)</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>aukill.exe (Admin Priv)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Drops PROCEXP152.SYS</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Signed Microsoft Sysinternals</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Version 16.32 (Vulnerable)</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SCM Registration</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>CreateServiceW -&gt; StartService</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Bypasses unsigned driver blocks</text>

        <line className="auk1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="auk1-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>KERNEL RING 0 ENTRY</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>DSE Signature Validated</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>\\.\PROCEXP152 Exposed</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Runs With Full Kernel Trust</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Missing Caller ACL Restriction</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Privilege Escalation Bridge</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Ring 3 now commands Ring 0</text>
        </g>

        <line className="auk1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="auk1-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>EARLY TELEMETRY</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>EID 7045 + Sysmon EID 6</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DriverLoaded SHA-256</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Matches LOLDrivers Catalog</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Non-Sysinternals Dropper Path</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DETECTION WINDOW</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Fires BEFORE EDR is killed</text>
        </g>

        <g className="auk1-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            BYOVD DETECTION: Correlate System EID 7045 and Sysmon EID 6 driver hashes against the LOLDrivers blocklist
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Valid Authenticode signatures do not prevent attackers from weaponizing older vulnerable signed drivers
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
