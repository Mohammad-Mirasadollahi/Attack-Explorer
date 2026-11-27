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
    title: 'Unprotected lsass.exe (RunAsPPL = 0) exposes LogonSessionList to OpenProcess(0x1010)',
    story:
      'On the unshielded vault on the left, the crimson X-ray cone penetrates cleanly through the circular door and illuminates every golden passkey drawer.',
    technical:
      'With PPL disabled, rundll32.exe (PID 5412) acquires handle 0x1010 and reads lsasrv.dll!LogonSessionList (0x00007FF7A8100000) and msv1_0.dll (0x00007FFAD4200000).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Hardened lsass.exe (RunAsPPL = 1) enforces PsProtectedSignerLsa-Light in kernel',
    story:
      'On the hardened vault on the right, a glowing cyan steel blast shield seals the doorway so no user-mode camera can look inside.',
    technical:
      'When HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL=1 is set, WinInit launches lsass.exe as Protected Process Light (WinInit Event ID 12).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Kernel ObRegisterCallbacks rejects rundll32.exe with STATUS_ACCESS_DENIED',
    story:
      'Even though the photographer carries an official bank badge and brass camera, the armored shield turns the X-ray lens away instantly.',
    technical:
      'Non-PPL rundll32.exe requesting PROCESS_VM_READ (0x1010) against PPL-protected lsass.exe fails at the kernel boundary with 0xC0000022 (STATUS_ACCESS_DENIED).',
  },
  {
    id: 3,
    tag: '04',
    title: 'Credential Guard (VBS LsaIso) moves secrets outside lsass.exe user memory altogether',
    story:
      'For ultimate defense, VIP passkeys are stored inside a separate hypervisor sub-vault that no regular hallway camera can ever reach.',
    technical:
      'Windows Defender Credential Guard isolates NTLM hashes and Kerberos TGTs inside VTL1 (LsaIso.exe), rendering raw LSASS memory dumps useless for credential theft.',
  },
];

const CAMERAS = [
  { id: 'SPLIT VIEW', transform: 'scale(1)' },
  { id: 'PPL=0 EXPOSED', transform: 'scale(1.24) translate(115px, -20px)' },
  { id: 'RUNASPPL=1', transform: 'scale(1.24) translate(-115px, -20px)' },
  { id: 'VBS LSAISO', transform: 'scale(1.25) translate(0px, -110px)' },
];

export function LsassMemoryPplDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.open-ram, .ppl-shield, .denied-box, .vbs-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.open-ram'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.ppl-shield'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.denied-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.vbs-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lsass-memory"
      stageLabel="MEMORY FORENSICS"
      mitreId="T1003.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Split Windows virtual memory comparison between unprotected LSASS PPL=0 allowing OpenProcess 0x1010 and RunAsPPL=1 plus Credential Guard returning STATUS_ACCESS_DENIED"
      >
        <FilmBackdrop prefix="lsmem" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          LSASS MEMORY PROTECTION DIFF · UNPROTECTED (PPL=0) VS. RUNASPPL + CREDENTIAL GUARD (VTL1)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          lsass.exe (PID 684) · Handle 0x1010
        </text>

        {/* Left Panel: Unprotected LSASS */}
        <rect x="40" y="96" width="530" height="370" rx="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
        <text x="305" y="132" textAnchor="middle" fill="#fca5a5" fontSize="14" fontWeight="700" fontFamily={FONT}>
          UNPROTECTED LSASS (RunAsPPL = 0)
        </text>
        <text x="305" y="154" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          Non-PPL rundll32.exe Acquires 0x1010 Handle
        </text>

        <g className="open-ram">
          <rect x="66" y="176" width="478" height="114" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
          <text x="86" y="206" fill="#fecaca" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            0x00007FF7A8100000 · lsasrv.dll!LogonSessionList
          </text>
          <text x="86" y="234" fill="#fde68a" fontSize="13.5" fontWeight="700" fontFamily={FONT}>
            OpenProcess(0x1010) → HANDLE GRANTED
          </text>
          <text x="86" y="264" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            ReadProcessMemory dumps NTLM &amp; Kerberos into debug.dmp
          </text>

          <rect x="66" y="308" width="478" height="130" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="86" y="338" fill="#fde68a" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            0x00007FFAD4200000 · msv1_0.dll &amp; kerberos.dll
          </text>
          <text x="86" y="366" fill="#cbd5e1" fontSize="11.5" fontFamily={FONT}>
            • Serialized by dbgcore.dll!MiniDumpWriteDump (48.2 MB)
          </text>
          <text x="86" y="390" fill="#cbd5e1" fontSize="11.5" fontFamily={FONT}>
            • Magic bytes 4D 44 4D 50 93 A7 written to Temp folder
          </text>
          <text x="86" y="414" fill="#fca5a5" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            • Parsed offline via pypykatz with zero endpoint AV alert
          </text>
        </g>

        {/* Right Panel: Hardened RunAsPPL */}
        <rect x="630" y="96" width="530" height="370" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="895" y="132" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="700" fontFamily={FONT}>
          HARDENED LSASS (RunAsPPL = 1 + VBS)
        </text>
        <text x="895" y="154" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          PsProtectedSignerLsa-Light Kernel Enforcement
        </text>

        <g className="ppl-shield">
          <rect x="656" y="176" width="478" height="114" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="676" y="206" fill="#bae6fd" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            HKLM\...\Control\Lsa\RunAsPPL = 1
          </text>
          <text x="676" y="234" fill="#4ade80" fontSize="13.5" fontWeight="700" fontFamily={FONT}>
            WinInit EID 12: LSASS Started as PPL
          </text>
          <text x="676" y="264" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Only kernel-signed Microsoft PPL signers may access RAM
          </text>
        </g>

        <g className="denied-box">
          <rect x="656" y="308" width="478" height="130" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="676" y="338" fill="#86efac" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            rundll32.exe (PID 5412) → BLOCKED
          </text>
          <text x="676" y="366" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            OpenProcess(0x1010) → 0xC0000022 DENIED
          </text>
          <text x="676" y="392" fill="#cbd5e1" fontSize="11.5" fontFamily={FONT}>
            • comsvcs.dll fails before reading a single credential byte
          </text>
          <text x="676" y="416" fill="#86efac" fontSize="11.5" fontFamily={FONT}>
            • Zero debug.dmp written · Sysmon EID 10 still logs attempt
          </text>
        </g>

        {/* Bottom VBS Bar */}
        <g className="vbs-bar">
          <rect x="96" y="502" width="1008" height="92" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            ULTIMATE ISOLATION: Windows Defender Credential Guard Moves NTLM/TGT Secrets Into Hypervisor VTL1 (LsaIso.exe)
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Pair RunAsPPL + Credential Guard + Sysmon EID 10 CallTrace monitoring to eliminate LSASS minidump credential theft
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
