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
    title: 'High-integrity logon assigns SeDebugPrivilege (Windows Security EID 4672)',
    story:
      'At the marble administrative desk, the insider flashes an elevated golden inspector badge granting private vault corridor clearance.',
    technical:
      'CORP\\adm_jchen opens an elevated cmd.exe (PID 4920) whose High-integrity token carries SeDebugPrivilege recorded in Security Event ID 4672 (MITRE T1134).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Operator queries live lsass.exe numeric PID (684) via tasklist',
    story:
      'Before wheeling in the official photographer, the insider checks the glowing bank directory plaque to note the exact vault door number.',
    technical:
      'Because comsvcs.dll!MiniDump requires a numeric target PID rather than a process name, cmd.exe executes tasklist /fi "imagename eq lsass.exe" -> PID 684.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Token privilege + PID enumeration stages the LOLBin credential dump',
    story:
      'Holding both golden clearance and the exact vault number, the insider is ready to summon the certified X-ray camera without dropping outside tools.',
    technical:
      'With SeDebugPrivilege available and PID 684 resolved, the operator prepares C:\\Windows\\System32\\rundll32.exe targeting comsvcs.dll.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Early SIEM correlation flags EID 4672 + Sysmon EID 1 LSASS discovery',
    story:
      'A careful lobby guard notices an administrator repeatedly checking the VIP vault directory plaque moments before calling the camera crew.',
    technical:
      'Correlating Security EID 4672 (SeDebugPrivilege) with Sysmon EID 1 process creation querying "lsass" provides an early pre-dump hunting signal.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'EID 4672', transform: 'scale(1.24) translate(110px, -22px)' },
  { id: 'PID 684', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'SIEM HUNT', transform: 'scale(1.26) translate(-40px, -110px)' },
];

export function LsassStep1SeDebugClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.token-wire, .pid-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.pid-box, .stage-box, .hunt-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.token-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.pid-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.pid-wire'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat2');
    tl.to(q('.stage-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat2+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.hunt-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lsass-step1"
      stageLabel="STEP #1"
      mitreId="T1134"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Elevated High-integrity cmd.exe PID 4920 confirms SeDebugPrivilege via Security EID 4672 and resolves lsass.exe PID 684 via tasklist"
      >
        <FilmBackdrop prefix="ls1" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          PRIVILEGE GATE · SECURITY EID 4672 (SEDEBUGPRIVILEGE) · LSASS.EXE PID 684 DISCOVERY
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WKS-ADM-07 · cmd.exe (PID 4920)
        </text>

        {/* Left: High Integrity Token */}
        <rect x="40" y="138" width="290" height="316" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="185" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
          ACCESS TOKEN (EID 4672)
        </text>
        <text x="185" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
          CORP\adm_jchen · HIGH
        </text>

        <rect x="62" y="218" width="246" height="94" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="185" y="246" textAnchor="middle" fill="#fef08a" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
          SeDebugPrivilege
        </text>
        <text x="185" y="272" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily={FONT}>
          Required to inspect SYSTEM
        </text>
        <text x="185" y="294" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily={FONT}>
          process memory (lsass.exe)
        </text>

        <rect x="62" y="330" width="246" height="100" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.8" />
        <text x="185" y="358" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="700" fontFamily={FONT}>
          cmd.exe (PID 4920)
        </text>
        <text x="185" y="382" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          whoami /priv → Enabled
        </text>
        <text x="185" y="406" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily={FONT}>
          Host: 10.20.14.37
        </text>

        <line className="token-wire" x1="334" y1="296" x2="410" y2="296" stroke="#f59e0b" strokeWidth="4" />

        {/* Center: PID 684 Enumeration */}
        <g className="pid-box">
          <rect x="414" y="138" width="346" height="316" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="587" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
            LSASS PID DISCOVERY
          </text>
          <text x="587" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>
            Sysmon EID 1 · ProcessCreate
          </text>

          <rect x="436" y="218" width="302" height="96" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="587" y="246" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            tasklist /fi &quot;imagename eq lsass.exe&quot;
          </text>
          <text x="587" y="274" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="700" fontFamily={FONT}>
            lsass.exe → PID 684
          </text>
          <text x="587" y="298" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
            Session 0 · Services · 34,812 K
          </text>

          <rect x="436" y="332" width="302" height="98" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.8" />
          <text x="587" y="360" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            WHY NUMERIC PID IS MANDATORY
          </text>
          <text x="587" y="384" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            comsvcs.dll!MiniDump accepts only
          </text>
          <text x="587" y="406" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            integer PID (684), never image name
          </text>
        </g>

        <line className="pid-wire" x1="764" y1="296" x2="836" y2="296" stroke="#38bdf8" strokeWidth="4" />

        {/* Right: Staged LOLBin Launch */}
        <g className="stage-box">
          <rect x="840" y="138" width="320" height="316" rx="16" fill="#1e293b" stroke="#ef4444" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>
            READY FOR SIGNED DUMP
          </text>
          <text x="1000" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            Zero Unsigned Tools Dropped
          </text>

          <rect x="862" y="220" width="276" height="104" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="1000" y="248" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>
            NEXT: rundll32.exe (PID 5412)
          </text>
          <text x="1000" y="274" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            comsvcs.dll, MiniDump 684
          </text>
          <text x="1000" y="298" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            C:\Windows\Temp\debug.dmp full
          </text>

          <rect x="862" y="340" width="276" height="90" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="368" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>
            PRECURSOR OPPORTUNITY
          </text>
          <text x="1000" y="392" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Detect LSASS PID lookups before
          </text>
          <text x="1000" y="412" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            OpenProcess(0x1010) occurs
          </text>
        </g>

        {/* Bottom Witness Bar */}
        <g className="hunt-bar">
          <rect x="120" y="504" width="960" height="90" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SIEM PRECURSOR: Security EID 4672 (SeDebugPrivilege) + Sysmon EID 1 (tasklist /fi &quot;imagename eq lsass.exe&quot;)
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Strip SeDebugPrivilege from non-Tier-0 admin accounts &amp; alert on command-line LSASS PID discovery
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
