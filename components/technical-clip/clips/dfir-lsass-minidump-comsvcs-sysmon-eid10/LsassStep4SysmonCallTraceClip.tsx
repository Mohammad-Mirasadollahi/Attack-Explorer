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
    title: 'Attacker exfiltrates debug.dmp for offline pypykatz / Mimikatz extraction',
    story:
      'Carrying the sealed X-ray negative out to a distant darkroom, the insider develops every golden master passkey without tripping lobby alarms.',
    technical:
      'Running pypykatz lsa minidump debug.dmp off-host recovers CORP\\adm_jchen NTLM hashes and Kerberos TGTs with zero cracking binaries ever touching WKS-ADM-07.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Triple-event SIEM correlation joins Sysmon EID 1, EID 10 & EID 11',
    story:
      'High in the glass security guard booth, the chief watch officer links the camera badge, wide lens reading, and packing-table receipt into one airtight alert.',
    technical:
      'Correlating Sysmon EID 1 (comsvcs/#24), EID 10 (0x1010 + comsvcs.dll|dbgcore.dll CallTrace), and EID 11 (MDMP write) confirms T1003.001 with near-zero false positives.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Immediate containment rotates exposed credentials & isolates WKS-ADM-07',
    story:
      'Guards seal the compromised corridor and immediately re-key every VIP safe-deposit box whose blueprint appeared on the stolen negative.',
    technical:
      'Responders isolate WKS-ADM-07, reset all cached domain accounts (and double-rotate krbtgt if Tier-0 accounts were logged in), and delete staged dumps.',
  },
  {
    id: 3,
    tag: '04',
    title: 'RunAsPPL + Windows Defender Credential Guard stop future dumps at the kernel',
    story:
      'Finally, engineers bolt a permanent cyan steel blast shield across every bank vault so even certified cameras are turned away at the door.',
    technical:
      'Enabling HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL=1, ASR LSASS blocking, and VBS Credential Guard prevents user-mode processes from reading LSASS.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'OFFLINE PARSE', transform: 'scale(1.24) translate(110px, -22px)' },
  { id: 'SIEM TRIPLE', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'PPL + VBS', transform: 'scale(1.26) translate(-110px, -30px)' },
];

export function LsassStep4SysmonCallTraceClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.corr-wire, .def-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.siem-box, .ppl-box, .remed-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.corr-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.siem-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.def-wire'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat2');
    tl.to(q('.ppl-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat2+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.remed-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lsass-step4"
      stageLabel="STEP #4"
      mitreId="T1003.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Offline pypykatz credential extraction versus triple Sysmon EID 1 10 11 SIEM correlation and RunAsPPL Credential Guard kernel hardening"
      >
        <FilmBackdrop prefix="ls4" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          OFFLINE EXTRACTION RISK · TRIPLE SYSMON CORRELATION (1 + 10 + 11) · RUNASPPL HARDENING
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          SOC Containment &amp; Kernel Defense
        </text>

        {/* Left: Offline Extraction */}
        <rect x="40" y="138" width="290" height="316" rx="14" fill="#450a0a" stroke="#ef4444" strokeWidth="2.4" />
        <text x="185" y="172" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
          OFF-HOST DARKROOM
        </text>
        <text x="185" y="196" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
          pypykatz lsa minidump
        </text>

        <rect x="62" y="218" width="246" height="98" rx="10" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="185" y="246" textAnchor="middle" fill="#fca5a5" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
          debug.dmp → Offline Host
        </text>
        <text x="185" y="272" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
          • NT Hash (Pass-the-Hash)
        </text>
        <text x="185" y="294" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
          • Kerberos TGTs + LSA Secrets
        </text>

        <rect x="62" y="332" width="246" height="98" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.8" />
        <text x="185" y="360" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
          WHY AV MISSES MIMIKATZ
        </text>
        <text x="185" y="384" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
          Credential parser never executes
        </text>
        <text x="185" y="406" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
          on WKS-ADM-07 endpoint
        </text>

        <line className="corr-wire" x1="334" y1="296" x2="408" y2="296" stroke="#a855f7" strokeWidth="4" />

        {/* Center: Triple Sysmon Correlation */}
        <g className="siem-box">
          <rect x="412" y="138" width="350" height="316" rx="16" fill="#0f172a" stroke="#a855f7" strokeWidth="2.4" />
          <text x="587" y="172" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="700" fontFamily={FONT}>
            SIEM TRIPLE CORRELATION
          </text>
          <text x="587" y="196" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            Zero-Gap Detection Chain
          </text>

          <rect x="434" y="216" width="306" height="62" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="587" y="242" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            1. Sysmon EID 1 (ProcessCreate)
          </text>
          <text x="587" y="264" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
            rundll32.exe + comsvcs (MiniDump / #24)
          </text>

          <rect x="434" y="290" width="306" height="68" rx="8" fill="#2e1065" stroke="#c084fc" strokeWidth="2" />
          <text x="587" y="316" textAnchor="middle" fill="#f5d0fe" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            2. Sysmon EID 10 (ProcessAccess)
          </text>
          <text x="587" y="340" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>
            0x1010 → lsass.exe | comsvcs + dbgcore
          </text>

          <rect x="434" y="370" width="306" height="62" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="1.8" />
          <text x="587" y="396" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            3. Sysmon EID 11 (FileCreate)
          </text>
          <text x="587" y="418" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
            rundll32 writes 48.2 MB MDMP file
          </text>
        </g>

        <line className="def-wire" x1="766" y1="296" x2="838" y2="296" stroke="#22c55e" strokeWidth="4" />

        {/* Right: Kernel Hardening */}
        <g className="ppl-box">
          <rect x="842" y="138" width="318" height="316" rx="16" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1001" y="172" textAnchor="middle" fill="#bbf7d0" fontSize="13" fontWeight="700" fontFamily={FONT}>
            KERNEL HARDENING
          </text>
          <text x="1001" y="196" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="700" fontFamily={FONT}>
            Defeat Before Dump Happens
          </text>

          <rect x="864" y="218" width="274" height="98" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <text x="1001" y="246" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            RunAsPPL = 1 (LSA PPL)
          </text>
          <text x="1001" y="272" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
            Blocks OpenProcess(0x1010) from
          </text>
          <text x="1001" y="294" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="700" fontFamily={FONT}>
            rundll32 → STATUS_ACCESS_DENIED
          </text>

          <rect x="864" y="332" width="274" height="98" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1001" y="360" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>
            VBS Credential Guard + ASR
          </text>
          <text x="1001" y="384" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
            Isolates NTLM/Kerberos in LsaIso
          </text>
          <text x="1001" y="406" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>
            + ASR Rule Blocks LSASS Theft
          </text>
        </g>

        {/* Bottom Remediation Bar */}
        <g className="remed-bar">
          <rect x="110" y="504" width="980" height="90" rx="12" fill="#082f49" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#bae6fd" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DEFENSE-IN-DEPTH: RunAsPPL=1 + Credential Guard + Sysmon EID 10 CallTrace + Rapid Credential Rotation
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Neutralizes comsvcs.dll, ordinal #24, renamed dumps, and offline pypykatz parsing in one architectural layer
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
