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
    title: 'CORP-DC01 records Security Event ID 4662 with AccessMask 0x100',
    story: 'The elevated bridge audit console stamps an indelible transfer line bearing the non-mint courier badge.',
    technical: 'Event ID 4662 logs SubjectUserName=svc_dir_sync, Properties={1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Filter out legitimate machine accounts ending with $ to isolate anomaly',
    story: 'Official peer mint towers always carry a tower badge ending in a sovereign mark; this street courier does not.',
    technical: 'Excluding SubjectUserName endswith "$" and known MSOL sync accounts yields near-zero false positives.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Join SubjectLogonId 0x39e4c2a with Security Event ID 4624 for Source IP',
    story: 'Matching the session badge against the city traffic roster points straight at the red van outside.',
    technical: 'Correlating SubjectLogonId 0x39e4c2a to EID 4624 TargetLogonId attributes IpAddress=10.20.14.88.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Combined EID 4662 + EID 4624 + Zeek telemetry proves DCSync definitively',
    story: 'Both the bridge stamp and street radar agree on the exact rogue vehicle, triggering immediate P1 lockdown.',
    technical: 'Deploy Sigma/KQL rule joining EID 4662 (1131f6ad-...) + EID 4624 for automated P1 SOC escalation.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'EID 4662', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'JOIN 4624', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SIGMA', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DcsyncStep3Eid4662Clip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.dc3-w1, .dc3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.dc3-join, .dc3-attr, .dc3-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.dc3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.dc3-join'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.dc3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.dc3-attr'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.dc3-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dcsync-step3"
      stageLabel="STEP #3"
      mitreId="T1003.006"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Windows Security Event ID 4662 and 4624 DCSync correlation">
        <FilmBackdrop prefix="dc3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          WINDOWS SECURITY LOG CORRELATION · EVENT ID 4662 JOIN EVENT ID 4624
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          LOGON ID: 0x39e4c2a
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>SECURITY EVENT ID 4662</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Directory Service Access</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Subject: svc_dir_sync</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>AccessMask: 0x100</text>
        <text x="190" y="300" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily={FONT}>GUID: 1131f6ad-9c07-11d1-...</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Join Key Field</text>
        <text x="190" y="394" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>SubjectLogonId = 0x39e4c2a</text>

        <line className="dc3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="dc3-join">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>SECURITY EVENT ID 4624</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Network Logon Attribution</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="700" fontFamily={FONT}>TargetLogonId: 0x39e4c2a</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="11.5" fontWeight="700" fontFamily={FONT}>IpAddress: 10.20.14.88</text>
          <text x="590" y="300" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Workstation: WKS-ADMIN-07</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Filter: Non-Machine (!endswith $)</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Eliminates routine peer DC noise</text>
        </g>

        <line className="dc3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="dc3-attr">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#ef4444" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>P1 DCSYNC VERDICT</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Full Host + User Attribution</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Confirmed Non-DC Source</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Account: CORP\svc_dir_sync</text>
          <text x="1000" y="306" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Origin: 10.20.14.88 (WKS-ADMIN-07)</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>IMMEDIATE TRIAGE</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Assume krbtgt hash exposed</text>
        </g>

        <g className="dc3-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SIGMA + KQL: EventID == 4662 (1131f6ad-...) AND SubjectUserName !endswith &quot;$&quot; JOIN EventID == 4624 on LogonId
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Enable Audit Directory Service Access on every Domain Controller to guarantee Event ID 4662 visibility
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
