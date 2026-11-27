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
    title: 'Attacker passes svc_sql_prod NTLM hash over SMB TCP/445',
    story: 'With the freshly cut master brass keycard, the intruder rides straight up to the restricted finance suite turnstile.',
    technical: 'Pass-the-Hash authenticates as CORP\\svc_sql_prod from WKS-OPS-12 (10.20.14.44) to FIN-SQL01 (10.20.30.15) over SMB/445.',
  },
  {
    id: 1,
    tag: '02',
    title: 'FIN-SQL01 logs Security Event ID 4624 (LogonType 3 NTLM) & EID 7045',
    story: 'The doorway clicks open and flashes crimson as an unauthorized background worker starts inside the suite.',
    technical: 'Security EID 4624 records LogonType=3, AuthPackage=NTLM, TargetUserName=svc_sql_prod; System EID 7045 logs service SqlHealthDiag.',
  },
  {
    id: 2,
    tag: '03',
    title: 'SIEM correlates EID 4769 (0x17) -> EID 4624 -> EID 7045',
    story: 'The hotel security desk links the earlier soft-bronze voucher directly to the abnormal staff card swipe.',
    technical: 'Linking RC4 TGS requests with service-account NTLM network logons from user workstations produces near-zero false positives.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Tier-0 hardening locks service accounts into Auth Policy Silos & AES gMSAs',
    story: 'Security bolts an unbreakable glowing emerald lock across the penthouse door and retires every legacy bronze key.',
    technical: 'Deploy gMSAs, disable RC4 Kerberos, apply Authentication Policy Silos, and revoke Domain Admin privileges from service accounts.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PTH SMB', transform: 'scale(1.24) translate(110px, -20px)' },
  { id: 'EID 4624', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'HARDEN', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function KerbStep4PthLateralClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.k4-w1, .k4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.k4-sql, .k4-siem, .k4-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.k4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.k4-sql'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.k4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.k4-siem'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.k4-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-kerb-step4"
      stageLabel="STEP #4"
      mitreId="T1550.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Pass-the-Hash SMB lateral movement to FIN-SQL01 and SIEM correlation">
        <FilmBackdrop prefix="k4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          PASS-THE-HASH LATERAL MOVEMENT (SMB/445) · EID 4624 + EID 7045 · AD HARDENING
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          FIN-SQL01.corp.local (10.20.30.15)
        </text>

        <rect x="40" y="138" width="295" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="187" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>PASS-THE-HASH PIVOT</text>
        <text x="187" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>WKS-OPS-12 -&gt; FIN-SQL01</text>
        <rect x="62" y="220" width="251" height="104" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="187" y="248" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>CORP\svc_sql_prod</text>
        <text x="187" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>NTLM: 8846F7EA...586C</text>
        <text x="187" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>SMB TCP/445 ADMIN$ Share</text>
        <rect x="62" y="340" width="251" height="88" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="187" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>MITRE T1550.002</text>
        <text x="187" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Alternate Auth Material</text>

        <line className="k4-w1" x1="339" y1="295" x2="412" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="k4-sql">
          <rect x="416" y="138" width="346" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="589" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>FIN-SQL01 TELEMETRY</text>
          <text x="589" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Security EID 4624 + System EID 7045</text>
          <rect x="438" y="220" width="302" height="98" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
          <text x="589" y="248" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>EID 4624 · LogonType 3 (NTLM)</text>
          <text x="589" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Target: svc_sql_prod | Src: 10.20.14.44</text>
          <text x="589" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Service account from user WKS!</text>
          <rect x="438" y="334" width="302" height="94" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="589" y="362" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>EID 7045 · Service Installed</text>
          <text x="589" y="388" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>ServiceName: SqlHealthDiag</text>
          <text x="589" y="410" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>cmd.exe /c powershell -enc ...</text>
        </g>

        <line className="k4-w2" x1="766" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="k4-siem">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>SOC CONTAINMENT</text>
          <text x="1000" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Triple-Event Correlation</text>
          <rect x="862" y="220" width="276" height="104" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="248" textAnchor="middle" fill="#dcfce7" fontSize="11.5" fontWeight="700" fontFamily={FONT}>1) EID 4769 (RC4 0x17)</text>
          <text x="1000" y="274" textAnchor="middle" fill="#dcfce7" fontSize="11.5" fontWeight="700" fontFamily={FONT}>2) EID 4624 (NTLM svc_*)</text>
          <text x="1000" y="300" textAnchor="middle" fill="#dcfce7" fontSize="11.5" fontWeight="700" fontFamily={FONT}>3) EID 7045 (Remote Svc)</text>
          <rect x="862" y="340" width="276" height="88" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="368" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>RESPONSE ACTIONS</text>
          <text x="1000" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Reset svc_sql_prod + Isolate Host</text>
        </g>

        <g className="k4-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#dcfce7" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HARDENING: Enforce AES-256 Only (0x12) + Migrate to gMSAs + Bind Service Accounts to Auth Policy Silos
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily={FONT}>
            Deny interactive/network workstation logons for service accounts to block Pass-the-Hash lateral pivots
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
