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
    title: 'dbgcore.dll!MiniDumpWriteDump reads lsass.exe credential memory regions',
    story:
      'In a single bright crimson X-ray flash, the vault camera photographs every golden VIP safety-deposit drawer straight through the open cutaway glass.',
    technical:
      'MiniDumpWriteDump(MiniDumpWithFullMemory 0x2) reads lsasrv.dll!LogonSessionList (0x00007FF7A8100000) and msv1_0.dll/kerberos.dll caches (0x00007FFAD4200000).',
  },
  {
    id: 1,
    tag: '02',
    title: '48.2 MB binary file written to C:\\Windows\\Temp\\debug.dmp with MDMP magic bytes',
    story:
      'An instant X-ray photo negative slides out onto the corridor packing table carrying an unmistakable factory watermark across its top border.',
    technical:
      'Sysmon Event ID 11 logs rundll32.exe (PID 5412) creating C:\\Windows\\Temp\\debug.dmp (48.2 MB) beginning with hex header 4D 44 4D 50 93 A7 ("MDMP").',
  },
  {
    id: 2,
    tag: '03',
    title: 'Renaming the dump file cannot hide its internal MDMP header or module streams',
    story:
      'Even after the insider slips the photo negative into a plain unmarked courier sleeve, X-ray inspection of the envelope still reveals the vault blueprint.',
    technical:
      'Renaming debug.dmp to report.txt or logo.png leaves 4D 44 4D 50 93 A7 at offset 0x0 and embedded lsasrv.dll + msv1_0.dll strings intact for YARA.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Sysmon EID 11 + YARA MDMP scan catches credential staging before exfiltration',
    story:
      'The corridor checkpoint scanner spots the fresh negative resting on the packing table before it ever leaves the marble hall.',
    technical:
      'Alerting when rundll32.exe creates multi-megabyte MDMP files in Temp/Public paths catches T1003.001 staging before the dump leaves WKS-ADM-07.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'LSASS RAM', transform: 'scale(1.24) translate(110px, -22px)' },
  { id: 'MDMP STREAM', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'EID 11 + YARA', transform: 'scale(1.26) translate(-40px, -110px)' },
];

export function LsassStep3MiniDumpFileClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.read-wire, .write-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.serializer-box, .mdmp-box, .yara-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.read-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to(q('.serializer-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat0+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.write-wire'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat1');
    tl.to(q('.mdmp-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.yara-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lsass-step3"
      stageLabel="STEP #3"
      mitreId="T1003.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="dbgcore.dll MiniDumpWriteDump copies lsass.exe LogonSessionList and MSV1_0 RAM into 48.2 MB MDMP file C:\Windows\Temp\debug.dmp detected by Sysmon EID 11 and YARA"
      >
        <FilmBackdrop prefix="ls3" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          MINIDUMP SERIALIZATION · DBGCORE.DLL!MINIDUMPWRITEDUMP · MDMP HEADER (4D 44 4D 50 93 A7)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          Sysmon EID 11 · 48.2 MB Disk Artifact
        </text>

        {/* Left: LSASS Private RAM */}
        <rect x="40" y="138" width="294" height="316" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="187" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
          LSASS.EXE RAM (PID 684)
        </text>
        <text x="187" y="196" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          Read via OpenProcess(0x1010)
        </text>

        <rect x="62" y="218" width="250" height="98" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="187" y="246" textAnchor="middle" fill="#bae6fd" fontSize="12" fontWeight="700" fontFamily={FONT}>
          lsasrv.dll!LogonSessionList
        </text>
        <text x="187" y="272" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
          0x00007FF7A8100000 · RW-
        </text>
        <text x="187" y="296" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
          Active Domain Logon Sessions
        </text>

        <rect x="62" y="332" width="250" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="187" y="360" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="700" fontFamily={FONT}>
          msv1_0.dll &amp; kerberos.dll
        </text>
        <text x="187" y="384" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily={FONT}>
          0x00007FFAD4200000 · R--
        </text>
        <text x="187" y="408" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>
          NTLM Hashes + Kerberos TGTs
        </text>

        <line className="read-wire" x1="338" y1="296" x2="410" y2="296" stroke="#ef4444" strokeWidth="4" />

        {/* Center: MiniDumpWriteDump */}
        <g className="serializer-box">
          <rect x="414" y="138" width="346" height="316" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="587" y="172" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
            DBGCORE.DLL SERIALIZER
          </text>
          <text x="587" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            MiniDumpWriteDump(0x2)
          </text>

          <rect x="436" y="218" width="302" height="104" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
          <text x="587" y="246" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            MiniDumpWithFullMemory
          </text>
          <text x="587" y="272" textAnchor="middle" fill="#fecaca" fontSize="11" fontFamily={FONT}>
            Copies every accessible private page
          </text>
          <text x="587" y="296" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            + LSA decryption keys into stream
          </text>

          <rect x="436" y="338" width="302" height="92" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.8" />
          <text x="587" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            WRITING PROCESS
          </text>
          <text x="587" y="390" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            C:\Windows\System32\rundll32.exe
          </text>
          <text x="587" y="412" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
            PID 5412 · Zero AV Malware Alert
          </text>
        </g>

        <line className="write-wire" x1="764" y1="296" x2="836" y2="296" stroke="#f59e0b" strokeWidth="4" />

        {/* Right: MDMP Artifact on Disk */}
        <g className="mdmp-box">
          <rect x="840" y="138" width="320" height="316" rx="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
            STAGED DISK ARTIFACT
          </text>
          <text x="1000" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            C:\Windows\Temp\debug.dmp
          </text>

          <rect x="862" y="220" width="276" height="104" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="1000" y="248" textAnchor="middle" fill="#4ade80" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            OFFSET 0x0: 4D 44 4D 50 93 A7
          </text>
          <text x="1000" y="274" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            ASCII: &quot;MDMP..&quot; · 48.2 MB
          </text>
          <text x="1000" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
            Streams: lsasrv.dll + msv1_0.dll
          </text>

          <rect x="862" y="340" width="276" height="90" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
          <text x="1000" y="368" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            RENAMING EVASION FAILS
          </text>
          <text x="1000" y="392" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>
            Even as .txt / .png, header 0x504D444D
          </text>
          <text x="1000" y="412" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>
            triggers YARA + EDR file inspection
          </text>
        </g>

        {/* Bottom Witness Bar */}
        <g className="yara-bar">
          <rect x="116" y="504" width="968" height="90" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#bbf7d0" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SYSMON EID 11 + YARA SIGNATURE: rundll32.exe Writes MDMP (4D 44 4D 50 93 A7) to C:\Windows\Temp\
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Match file-header magic bytes plus lsasrv.dll/msv1_0.dll strings regardless of attacker file extension
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
