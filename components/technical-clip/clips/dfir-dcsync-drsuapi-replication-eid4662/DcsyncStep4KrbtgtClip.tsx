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
    title: 'Strip unauthorized 1131f6aa / 1131f6ad ACEs and quarantine rogue host',
    story: 'Mint guards tear down the misconfigured crimson ribbon and impound the side-street van.',
    technical: 'Remove svc_dir_sync replication ACEs on DC=corp,DC=local and isolate WKS-ADMIN-07 (10.20.14.88).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Execute double krbtgt password reset separated by at least 10 hours',
    story: 'The sovereign mint recasts its master crown seal twice so any replicated stamp fails immediately.',
    technical: 'Resetting krbtgt twice (>= 10h gap) flushes both current and previous Kerberos signing keys safely.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Enroll Tier-0 accounts in Protected Users and restrict DC RPC ports',
    story: 'An emerald peer-only shield locks the elevated bridge exclusively to verified mint towers.',
    technical: 'Add privileged accounts to Protected Users (blocks RC4/NTLM/delegation) and restrict DRSUAPI to DCs.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Continuous EID 4662 + 5136 + Zeek DRSUAPI alerting preserves Tier-0 hygiene',
    story: 'The audit tower stays lit steady green, watching every bridge span around the clock.',
    technical: 'Maintain automated ACL drift checks plus SIEM correlation on EID 4662/5136 and Suricata SID 2043901.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'ACL FIX', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: '2x KRBTGT', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'HARDENED', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DcsyncStep4KrbtgtClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.dc4-w1, .dc4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.dc4-krb, .dc4-hard, .dc4-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.dc4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.dc4-krb'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.dc4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.dc4-hard'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.dc4-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dcsync-step4"
      stageLabel="STEP #4"
      mitreId="T1003.006"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="DCSync Tier-0 ACL cleanup and double krbtgt password reset">
        <FilmBackdrop prefix="dc4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          TIER-0 INCIDENT RECOVERY · ACL REVOCATION &amp; DOUBLE KRBTGT ROTATION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          CISA AD RECOVERY PLAYBOOK
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>1. ACL REVOCATION</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Clean DC=corp,DC=local</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Remove Rogue ACEs</text>
        <text x="190" y="278" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Strip 1131f6aa &amp; 1131f6ad</text>
        <text x="190" y="300" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>from CORP\svc_dir_sync</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Quarantine Source</text>
        <text x="190" y="394" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Isolate WKS-ADMIN-07</text>

        <line className="dc4-w1" x1="344" y1="295" x2="416" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="dc4-krb">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>2. DOUBLE KRBTGT RESET</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Evicts Golden Ticket Risk</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="700" fontFamily={FONT}>RESET #1 -&gt; WAIT &gt;= 10H -&gt; #2</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Flushes both current &amp; N-1 keys</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Zero disruption to valid TGTs</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Audit AdminSDHolder</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Ensure no backdoor ACL persists</text>
        </g>

        <line className="dc4-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="dc4-hard">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>3. TIER-0 HARDENING</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Peer-Only Replication</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Protected Users Group</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Blocks NTLM &amp; RC4 delegation</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Enforces AES Kerberos + 4h TGT</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DC SUBNET FIREWALL</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Block non-DC DRSUAPI RPC</text>
        </g>

        <g className="dc4-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#dcfce7" fontSize="14" fontWeight="700" fontFamily={FONT}>
            VERIFIED TIER-0 RECOVERY: Clean Domain Root DACL + Double krbtgt Reset + Continuous EID 4662 / Zeek Guard
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Never skip the second krbtgt rotation — Kerberos keeps the previous key valid until rotated twice
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
