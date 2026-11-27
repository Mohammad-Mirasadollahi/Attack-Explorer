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
    title: 'Client sends Kerberos TGS-REQ advertising RC4-HMAC (etype 23 / 0x17)',
    story: 'A golden pneumatic request capsule shoots into the brass concierge desk asking for a soft-bronze suite voucher.',
    technical: 'Rubeus submits j.miller’s valid TGT to CORP-DC01 TCP/88 requesting MSSQLSvc/FIN-SQL01.corp.local with RC4-HMAC.',
  },
  {
    id: 1,
    tag: '02',
    title: 'KDC seals EncTicketPart directly with svc_sql_prod NTLM hash',
    story: 'Without checking whether the guest owns the suite, the concierge stamps a thin bronze seal straight onto the voucher.',
    technical: 'Because RC4 is permitted on svc_sql_prod, CORP-DC01 encrypts the TGS ticket using the service account’s unsalted RC4 NTLM hash.',
  },
  {
    id: 2,
    tag: '03',
    title: 'TGS-REP returns $krb5tgs$23$ blob into local LSA memory cache',
    story: 'The glowing bronze voucher slides back down the chute straight into the guest’s coat pocket.',
    technical: 'KerbRetrieveEncodedTicketMessage extracts the RC4 ticket ciphertext cleanly into hashes.txt for offline cracking.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Windows Security Event ID 4769 logs TicketEncryptionType 0x17',
    story: 'Behind the desk, the concierge ledger permanently records an unusual soft-bronze voucher stamped for a guest.',
    technical: 'SIEM rules alert on Security EID 4769 where TicketEncryptionType=0x17, TicketOptions=0x40810000, and ServiceName !endswith "$".',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'TGS-REQ', transform: 'scale(1.24) translate(110px, -20px)' },
  { id: 'RC4 0x17', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'EID 4769', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function KerbStep2Rc4TgsClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.k2-w1, .k2-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.k2-kdc, .k2-blob, .k2-eid'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.k2-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.k2-kdc'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.k2-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.k2-blob'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.k2-eid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-kerb-step2"
      stageLabel="STEP #2"
      mitreId="T1558.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Kerberos TGS-REQ RC4 0x17 downgrade and Security Event ID 4769">
        <FilmBackdrop prefix="k2" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          KERBEROS TGS-REQ / TGS-REP · RC4-HMAC DOWNGRADE (0x17) · SECURITY EVENT ID 4769
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          TCP/88 · CORP-DC01 KDC
        </text>

        <rect x="40" y="138" width="295" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="187" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>KERBEROS TGS-REQ</text>
        <text x="187" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>WKS-OPS-12 -&gt; TCP/88</text>
        <rect x="62" y="218" width="251" height="104" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="187" y="246" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SPN: MSSQLSvc/FIN-SQL01</text>
        <text x="187" y="274" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily={FONT}>etype: 23 (0x17 RC4-HMAC)</text>
        <text x="187" y="300" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Options: 0x40810000</text>
        <rect x="62" y="338" width="251" height="90" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="187" y="366" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Valid User TGT Attached</text>
        <text x="187" y="392" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>KDC verifies TGT only, NOT</text>
        <text x="187" y="412" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>SQL Server authorization</text>

        <line className="k2-w1" x1="339" y1="295" x2="412" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="k2-kdc">
          <rect x="416" y="138" width="346" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="589" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>KDC TICKET ENCRYPTION</text>
          <text x="589" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>CORP-DC01 · Key Distribution Center</text>
          <rect x="438" y="220" width="302" height="104" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
          <text x="589" y="248" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>EncTicketPart Sealed With:</text>
          <text x="589" y="276" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>NTLM Hash(svc_sql_prod)</text>
          <text x="589" y="302" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>No PBKDF2 salt · Fast offline attack</text>
          <rect x="438" y="340" width="302" height="88" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="589" y="368" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>WHY RC4-HMAC IS FATAL</text>
          <text x="589" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>100x faster on GPUs than AES-256</text>
        </g>

        <line className="k2-w2" x1="766" y1="295" x2="836" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="k2-blob">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>TGS-REP EXPORTED</text>
          <text x="1000" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Hashcat -m 13100 Ready</text>
          <rect x="862" y="220" width="276" height="108" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="1000" y="248" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>$krb5tgs$23$*svc_sql_prod</text>
          <text x="1000" y="274" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>84F9C2B1...E820A1 (Checksum)</text>
          <text x="1000" y="298" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Saved to hashes.txt</text>
          <rect x="862" y="344" width="276" height="84" rx="10" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.8" />
          <text x="1000" y="372" textAnchor="middle" fill="#e9d5ff" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SECURITY EID 4769 FIRED</text>
          <text x="1000" y="398" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>EncryptionType=0x17 · Non-$ Acct</text>
        </g>

        <g className="k2-eid">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#3b0764" stroke="#c084fc" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#f3e8ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SIEM RULE: EventID=4769 AND TicketEncryptionType=0x17 AND ServiceName != &quot;*$&quot; AND ServiceName != &quot;krbtgt&quot;
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Disable RC4-HMAC via GPO Kerberos encryption policy so KDC refuses 0x17 downgrades
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
