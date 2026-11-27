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
    title: 'Domain root nTSecurityDescriptor governs Active Directory replication',
    story: 'The sovereign mint gatehouse registry decides who may receive master coin-die transfers.',
    technical: 'DC=corp,DC=local DACL controls extended rights 1131f6aa-... (Get-Changes) and 1131f6ad-... (Get-Changes-All).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Misconfigured ACE grants non-DC svc_dir_sync full secret replication rights',
    story: 'A forgotten crimson access ribbon gives an ordinary side-street van full peer-mint clearance.',
    technical: 'CORP\\svc_dir_sync retains both replication GUIDs on DC=corp,DC=local after legacy sync migration.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Active Directory verifies caller token against DACL — not DC membership',
    story: 'The gatehouse checks only the pinned ribbon, never asking whether the courier is actually a mint tower.',
    technical: 'MS-DRSR AccessCheck passes for any principal holding 1131f6aa + 1131f6ad regardless of workstation role.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Audit Security Event ID 5136 and run periodic Tier-0 DACL hygiene checks',
    story: 'Regular gatehouse inspections tear down unauthorized ribbons before any side-street van arrives.',
    technical: 'Monitor Security Event ID 5136 on nTSecurityDescriptor and restrict replication strictly to Enterprise DCs.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DACL', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'GUIDS', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'AUDIT 5136', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DcsyncStep1AclClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.dc1-w1, .dc1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.dc1-ace, .dc1-risk, .dc1-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.dc1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.dc1-ace'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.dc1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.dc1-risk'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.dc1-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dcsync-step1"
      stageLabel="STEP #1"
      mitreId="T1003.006"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Over-privileged Active Directory replication extended rights ACL">
        <FilmBackdrop prefix="dc1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          ACTIVE DIRECTORY TIER-0 ACL AUDIT · DS-REPLICATION EXTENDED RIGHTS
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          OBJECT: DC=corp,DC=local
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>DOMAIN ROOT DACL</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>nTSecurityDescriptor</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Expected Principals</text>
        <text x="190" y="278" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Enterprise Domain Controllers</text>
        <text x="190" y="300" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Domain / Enterprise Admins</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Anomalous Entry Found</text>
        <text x="190" y="394" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>CORP\svc_dir_sync (Non-DC)</text>

        <line className="dc1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="dc1-ace">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>REPLICATION GUID PAIR</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Required for Secret Sync</text>
          <rect x="442" y="218" width="296" height="104" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DS-Replication-Get-Changes-All</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily={FONT}>1131f6ad-9c07-11d1-f79f-00c04fc2dcd2</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Exposes krbtgt &amp; NTLM hashes</text>
          <rect x="442" y="338" width="296" height="90" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <text x="590" y="366" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DS-Replication-Get-Changes</text>
          <text x="590" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily={FONT}>1131f6aa-9c07-11d1-f79f-00c04fc2dcd2</text>
        </g>

        <line className="dc1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#ef4444" strokeWidth="4" />

        <g className="dc1-risk">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>ACCESSCHECK RESULT</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Token Grants Replication</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>No DC Role Required</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Any host using svc_dir_sync</text>
          <text x="1000" y="306" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>can impersonate a peer DC</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SECURITY EID 5136</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Logs DACL changes in real time</text>
        </g>

        <g className="dc1-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HYGIENE RULE: Audit DC=corp,DC=local DACL weekly &amp; alert on Security EID 5136 granting 1131f6ad-... to non-DCs
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Remove lingering Azure AD Connect / legacy migration service account replication permissions immediately
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
