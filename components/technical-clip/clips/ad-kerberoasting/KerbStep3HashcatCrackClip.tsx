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
    title: 'Attacker moves $krb5tgs$23$ ciphertext off-network to GPU rig',
    story: 'Carrying the bronze-sealed voucher into a soundproof basement workshop, the safecracker leaves every hotel guard behind.',
    technical: 'hashes.txt is copied to external host 198.51.100.77; zero further packets touch CORP-DC01 during password cracking.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Hashcat mode 13100 tests 1.42 billion RC4-HMAC guesses per second',
    story: 'Three brass tumbler wheels spin at blinding speed against the thin bronze seal, testing common seasonal phrases.',
    technical: 'hashcat -m 13100 derives MD4(UTF16LE(candidate)) and verifies HMAC-MD5 checksum locally with zero EID 4625 lockouts.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Weak static service password cracks in 6 seconds',
    story: 'The bronze seal snaps open cleanly, revealing the suite master keycard without ringing a single upstairs bell.',
    technical: 'Recovers Winter2024!SQL and NTLM hash 8846F7EAEE8FB117AD06BDD830B7586C for privileged account CORP\\svc_sql_prod.',
  },
  {
    id: 3,
    tag: '04',
    title: '120-character auto-rotated gMSAs make offline cracking impossible',
    story: 'Replacing soft seasonal locks with automatically changing emerald safes keeps basement tumblers spinning forever.',
    technical: 'Group Managed Service Accounts rotate 120-character random passwords every 30 days automatically via Active Directory.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'OFFLINE', transform: 'scale(1.24) translate(110px, -20px)' },
  { id: 'HASHCAT', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'GMSA FIX', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function KerbStep3HashcatCrackClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.k3-w1, .k3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.k3-gpu, .k3-pw, .k3-fix'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.k3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.k3-gpu'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.k3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.k3-pw'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.k3-fix'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-kerb-step3"
      stageLabel="STEP #3"
      mitreId="T1558.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Offline GPU Hashcat -m 13100 cracking with zero DC lockouts">
        <FilmBackdrop prefix="k3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          OFFLINE GPU PASSWORD RECOVERY · HASHCAT MODE 13100 (ZERO ACCOUNT LOCKOUTS)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          198.51.100.77 · ZERO DC LOGS
        </text>

        <rect x="40" y="138" width="295" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="187" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>STOLEN TICKET BLOB</text>
        <text x="187" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>hashes.txt ($krb5tgs$23$)</text>
        <rect x="62" y="218" width="251" height="104" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="187" y="248" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Self-Contained Target</text>
        <text x="187" y="274" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Ciphertext + Checksum</text>
        <text x="187" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>100% Off-Network</text>
        <rect x="62" y="338" width="251" height="90" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.6" />
        <text x="187" y="368" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DC Failed Logons: 0</text>
        <text x="187" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Security EID 4625 never fires</text>

        <line className="k3-w1" x1="339" y1="295" x2="412" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="k3-gpu">
          <rect x="416" y="138" width="346" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="589" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>HASHCAT -m 13100 GPU</text>
          <text x="589" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Kerberos 5, etype 23, TGS-REP</text>
          <rect x="438" y="220" width="302" height="106" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
          <text x="589" y="248" textAnchor="middle" fill="#fecaca" fontSize="12.5" fontWeight="700" fontFamily={FONT}>Speed: 1,420.6 MH/s</text>
          <text x="589" y="276" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>MD4(UTF16LE(word)) -&gt; HMAC-MD5</text>
          <text x="589" y="302" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Wordlist + best64.rule</text>
          <rect x="438" y="342" width="302" height="86" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="589" y="370" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Time to Crack: 6 Seconds</text>
          <text x="589" y="396" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Static seasonal passwords fail fast</text>
        </g>

        <line className="k3-w2" x1="766" y1="295" x2="836" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="k3-pw">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#ef4444" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>RECOVERED CREDENTIAL</text>
          <text x="1000" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>CORP\svc_sql_prod</text>
          <rect x="862" y="220" width="276" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="1000" y="250" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="700" fontFamily={FONT}>Winter2024!SQL</text>
          <text x="1000" y="278" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>NTLM: 8846F7EAEE8FB117...</text>
          <text x="1000" y="302" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Local Admin on FIN-SQL01</text>
          <rect x="862" y="342" width="276" height="86" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="370" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>NEXT: PASS-THE-HASH</text>
          <text x="1000" y="396" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>SMB/445 Pivot -&gt; EID 4624/7045</text>
        </g>

        <g className="k3-fix">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#dcfce7" fontSize="14" fontWeight="700" fontFamily={FONT}>
            PREVENTIVE FIX: Migrate SPN Accounts to 120-Char Auto-Rotated gMSAs + Enforce AES-256 (0x12)
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily={FONT}>
            25+ char random passwords or gMSAs neutralize offline GPU cracking even if a TGS ticket is harvested
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
