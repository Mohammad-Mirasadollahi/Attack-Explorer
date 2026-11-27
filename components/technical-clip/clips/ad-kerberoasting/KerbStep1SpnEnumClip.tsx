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
    title: 'Standard domain user opens LDAP query against CORP-DC01 (TCP/389)',
    story: 'With an ordinary hotel guest badge, the visitor strolls up to the public mahogany lobby bellboard.',
    technical: 'CORP\\j.miller (Medium integrity, zero admin rights) queries TCP/389 using filter (&(objectClass=user)(servicePrincipalName=*)).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Directory returns human-managed accounts bearing SPN values',
    story: 'The bellboard lights up three private service suites, highlighting the high-value financial suite plaque.',
    technical: 'Active Directory returns CN=svc_sql_prod mapped to MSSQLSvc/FIN-SQL01.corp.local:1433 with adminCount=1.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Target SPN stages Kerberos TGS-REQ without triggering access denials',
    story: 'Copying the exact suite name off the board, the visitor prepares to visit the concierge ticket counter.',
    technical: 'Authenticated Users have default LDAP read permission on SPNs, enabling silent target selection before TGS requests.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Defenders catch broad SPN sweeps with LDAP EID 1644 and honey-SPNs',
    story: 'A sharp lobby attendant notices a guest copying down every VIP service plaque including a decoy suite.',
    technical: 'Audit LDAP Event ID 1644 / Zeek LDAP queries for servicePrincipalName=* and seed decoy honey-SPN accounts.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'LDAP QUERY', transform: 'scale(1.24) translate(110px, -20px)' },
  { id: 'SPN RESULT', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'DEFENSE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function KerbStep1SpnEnumClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.k1-wire-a, .k1-wire-b'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.k1-spn, .k1-stage, .k1-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.k1-wire-a'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.k1-spn'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.k1-wire-b'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.k1-stage'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.k1-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-kerb-step1"
      stageLabel="STEP #1"
      mitreId="T1558.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="LDAP SPN discovery by unprivileged domain user">
        <FilmBackdrop prefix="k1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          ACTIVE DIRECTORY LDAP ENUMERATION · SERVICEPRINCIPALNAME DISCOVERY (TCP/389)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WKS-OPS-12 -&gt; CORP-DC01:389
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>STANDARD DOMAIN USER</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>CORP\j.miller (Medium)</text>
        <rect x="62" y="220" width="256" height="96" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="248" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>LDAP Filter (TCP/389)</text>
        <text x="190" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>(&amp;(objectClass=user)</text>
        <text x="190" y="296" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>(servicePrincipalName=*))</text>
        <rect x="62" y="334" width="256" height="94" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="362" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Zero Admin Rights Needed</text>
        <text x="190" y="388" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Authenticated Users can read</text>
        <text x="190" y="408" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>domain SPNs by default</text>

        <line className="k1-wire-a" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="k1-spn">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>CORP-DC01 LDAP RESPONSE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>3 Human-Managed Service Accounts</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>TARGET: svc_sql_prod</text>
          <text x="590" y="272" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>MSSQLSvc/FIN-SQL01.corp.local:1433</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>adminCount=1 · Static Password</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Also Returned: svc_erp_app</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>HTTP/ERP-WEB02 · CIFS/BACKUP-01</text>
        </g>

        <line className="k1-wire-b" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="k1-stage">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#ef4444" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>NEXT: TGS-REQ (TCP/88)</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Rubeus.exe kerberoast</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Requests etype 23 (0x17)</text>
          <text x="1000" y="280" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Forces RC4-HMAC ticket sealed</text>
          <text x="1000" y="302" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>with svc_sql_prod NTLM hash</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>HONEY-SPN TRAP</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Decoy SPN triggers instant alert</text>
        </g>

        <g className="k1-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DETECTION: Monitor LDAP Event ID 1644 / Zeek LDAP for servicePrincipalName=* sweeps &amp; deploy Honey-SPN canaries
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Audit all non-computer accounts with SPNs and eliminate Domain Admin membership on service accounts
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
