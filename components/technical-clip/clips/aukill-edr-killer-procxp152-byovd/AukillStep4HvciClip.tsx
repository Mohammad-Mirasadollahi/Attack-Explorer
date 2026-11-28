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
    title: 'Microsoft Vulnerable Driver Blocklist + HVCI Memory Integrity inspect every driver load',
    story: 'A gleaming green steel shutter drops across the reactor pit holding an official list of recalled brass wrenches.',
    technical: 'HVCI (Hypervisor-Protected Code Integrity) evaluates driver hashes inside Virtualization-Based Security.',
  },
  {
    id: 1,
    tag: '02',
    title: 'When AuKill attempts to load PROCEXP152.SYS, the kernel rejects it with STATUS_ACCESS_DENIED',
    story: 'The moment the outdated wrench touches the pit hatch, the emerald lock snaps shut and throws it back.',
    technical: 'CodeIntegrity Event ID 3077 logs the blocked vulnerable driver before DriverEntry ever runs.',
  },
  {
    id: 2,
    tag: '03',
    title: 'WDAC kernel policy enforces allowlisting so attackers cannot simply swap to another BYOVD',
    story: 'Only newly inspected tools stamped on the master plant checklist are allowed inside the switchboard room.',
    technical: 'Windows Defender Application Control pairs Microsoft blocklist updates with explicit signed-driver policies.',
  },
  {
    id: 3,
    tag: '04',
    title: 'All EDR watchtowers stay online and immediately quarantine aukill.exe',
    story: 'Every searchlight stays bright and the security guards escort the saboteur off the plant grounds immediately.',
    technical: 'Because PPL remains unbroken, Defender/EDR detects and terminates the loader before ransomware stages.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'HVCI', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'EID 3077', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'WDAC LOCK', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function AukillStep4HvciClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.auk4-w1, .auk4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.auk4-mid, .auk4-right, .auk4-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.auk4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.auk4-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.auk4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.auk4-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.auk4-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-aukill-step4"
      stageLabel="STEP #4"
      mitreId="T1486"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Windows HVCI and Vulnerable Driver Blocklist blocking PROCEXP152.SYS with CodeIntegrity EID 3077">
        <FilmBackdrop prefix="auk4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          KERNEL DEFENSE · HVCI MEMORY INTEGRITY &amp; VULNERABLE DRIVER BLOCKLIST
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          CODEINTEGRITY EID 3077 · BLOCKED
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>BYOVD LOAD ATTEMPT</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>StartService(PROCEXP152)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Valid Microsoft Signature</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Known-Vulnerable Hash</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Requests Ring 0 Mapping</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Why DSE Alone Fails</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Certificate is valid, so</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>hash blocklist is required</text>

        <line className="auk4-w1" x1="344" y1="295" x2="416" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="auk4-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#22c55e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>HVCI + WDAC KERNEL GATE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>VBS Hypervisor Enforcement</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>VulnerableDriverBlocklistEnable</text>
          <text x="590" y="274" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>STATUS_ACCESS_DENIED</text>
          <text x="590" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>CodeIntegrity EID 3077 Fired</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Tamper Resistance</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Protected by UEFI + VBS</text>
        </g>

        <line className="auk4-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="auk4-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>EDR REMAINS ONLINE</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Ransomware Precursor Halted</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>PPL Integrity Preserved</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>aukill.exe Quarantined</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Zero Host Encryption</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>FLEET POLICY</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Enforce HVCI + WDAC via GPO</text>
        </g>

        <g className="auk4-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HARDENING STANDARD: Enable HVCI Memory Integrity, Microsoft Vulnerable Driver Blocklist, and WDAC
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Alert on CodeIntegrity Event ID 3077 — every blocked vulnerable driver load signals active intrusion
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
