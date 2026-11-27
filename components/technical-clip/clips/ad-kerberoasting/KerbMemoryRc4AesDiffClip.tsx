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
    title: 'Legacy RC4-HMAC (0x17) ticket derives encryption key directly from NTLM hash',
    story: 'On the left bench, the soft-bronze voucher exposes an unsalted lock that tumbler wheels chew through effortlessly.',
    technical: 'LSASS cache 0x00007FF9B4100000 stores etype 23 (0x17) ciphertext encrypted with unsalted MD4 NTLM hash of svc_sql_prod.',
  },
  {
    id: 1,
    tag: '02',
    title: 'GPU cracking runs 100x faster on RC4-HMAC than salted AES-256',
    story: 'Every weak seasonal password pops open in seconds while generating zero noise in the lobby upstairs.',
    technical: 'Hashcat -m 13100 achieves 1.42 GH/s on RC4-HMAC vs. PBKDF2-salted AES256-CTS-HMAC-SHA1-96 (-m 19700).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Hardened AES-256 (0x12) + 120-character gMSA seals the service ticket',
    story: 'On the right, an armored emerald vault rotates its 120-digit master code automatically every month.',
    technical: 'Setting msDS-SupportedEncryptionTypes=0x18 (AES128/AES256) and migrating to gMSAs eliminates human-chosen weak passwords.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Verify zero RC4 0x17 tickets across all SPN accounts in SIEM',
    story: 'A sweeping golden audit beam confirms every private suite door now requires an emerald vault seal.',
    technical: 'Track Event ID 4769 TicketEncryptionType=0x17 down to 0 across the domain before enforcing AES-only Group Policy.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'RC4 0x17', transform: 'scale(1.24) translate(135px, -18px)' },
  { id: 'AES 0x12', transform: 'scale(1.24) translate(-135px, -18px)' },
  { id: 'SUMMARY', transform: 'scale(1.18) translate(0px, -95px)' },
];

export function KerbMemoryRc4AesDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.km-left, .km-right, .km-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.km-left'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.km-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.km-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-kerb-memory"
      stageLabel="MEMORY FORENSICS"
      mitreId="T1558.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Side-by-side Kerberos RC4-HMAC 0x17 vs AES-256 0x12 gMSA comparison">
        <FilmBackdrop prefix="km" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          LSASS KERBEROS TICKET CACHE DIFF · RC4-HMAC (0x17) VS. AES-256 (0x12) + gMSA
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          lsass.exe · kerberos.dll
        </text>

        <g className="km-left">
          <rect x="44" y="96" width="532" height="378" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.6" />
          <text x="310" y="132" textAnchor="middle" fill="#fda4af" fontSize="14" fontWeight="700" fontFamily={FONT}>VULNERABLE: RC4-HMAC (etype 23 / 0x17)</text>
          <text x="310" y="156" textAnchor="middle" fill="#94a3b8" fontSize="11.5" fontFamily={FONT}>Static Human Password on svc_sql_prod</text>
          <rect x="70" y="180" width="480" height="122" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="1.8" />
          <text x="90" y="210" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>0x00007FF9B4100000 · TGS Ticket Cache</text>
          <text x="90" y="238" fill="#fde68a" fontSize="11.5" fontFamily={FONT}>Key = MD4(UTF16LE(password)) [Unsalted NTLM]</text>
          <text x="90" y="266" fill="#fca5a5" fontSize="11" fontFamily={FONT}>Hashcat -m 13100: 1.42 GH/s -&gt; Cracked in 6s</text>
          <text x="90" y="290" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>EventID 4769 TicketEncryptionType = 0x17</text>
          <rect x="70" y="320" width="480" height="130" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="90" y="350" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily={FONT}>0x00007FF9B4140000 · Exported Blob</text>
          <text x="90" y="378" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>• $krb5tgs$23$*svc_sql_prod$CORP.LOCAL*...</text>
          <text x="90" y="404" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>• Zero DC account lockouts (0 EID 4625)</text>
          <text x="90" y="430" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>• Direct Pass-the-Hash pivot to FIN-SQL01</text>
        </g>

        <g className="km-right">
          <rect x="624" y="96" width="532" height="378" rx="16" fill="#0f172a" stroke="#10b981" strokeWidth="2.6" />
          <text x="890" y="132" textAnchor="middle" fill="#6ee7b7" fontSize="14" fontWeight="700" fontFamily={FONT}>HARDENED: AES-256 (0x12) + 120-CHAR gMSA</text>
          <text x="890" y="156" textAnchor="middle" fill="#94a3b8" fontSize="11.5" fontFamily={FONT}>msDS-SupportedEncryptionTypes = 0x18</text>
          <rect x="650" y="180" width="480" height="122" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="670" y="210" fill="#dcfce7" fontSize="12" fontWeight="700" fontFamily={FONT}>0x00007FF9B4200000 · AES-256 Ticket</text>
          <text x="670" y="238" fill="#86efac" fontSize="11.5" fontFamily={FONT}>Key = PBKDF2-HMAC-SHA1(4096 iters + Salt)</text>
          <text x="670" y="266" fill="#6ee7b7" fontSize="11" fontFamily={FONT}>120-char random gMSA password rotates / 30d</text>
          <text x="670" y="290" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>EventID 4769 TicketEncryptionType = 0x12</text>
          <rect x="650" y="320" width="480" height="130" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.6" />
          <text x="670" y="350" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily={FONT}>Defense-in-Depth Outcome</text>
          <text x="670" y="378" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>• RC4 0x17 downgrade rejected by KDC GPO</text>
          <text x="670" y="404" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>• Offline GPU cracking computationally impossible</text>
          <text x="670" y="430" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>• Auth Policy Silos block lateral SMB abuse</text>
        </g>

        <g className="km-bar">
          <rect x="110" y="510" width="980" height="82" rx="12" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="600" y="544" textAnchor="middle" fill="#e0f2fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            FORENSIC VERDICT: Eliminate RC4-HMAC (0x17) &amp; Static Service Passwords — Migrate Every SPN to AES-256 gMSA
          </text>
          <text x="600" y="570" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Alert on any remaining EID 4769 (0x17) tickets until domain-wide RC4 usage reaches zero
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
