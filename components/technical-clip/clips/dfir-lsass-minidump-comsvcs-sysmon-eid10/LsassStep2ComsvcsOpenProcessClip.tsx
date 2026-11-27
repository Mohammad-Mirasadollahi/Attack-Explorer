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
    title: 'Signed rundll32.exe loads Microsoft-signed comsvcs.dll (MiniDump / #24)',
    story:
      'Instead of carrying contraband tools, the insider wheels the bank’s own certified brass-framed vault photographer right up to the steel vault door.',
    technical:
      'cmd.exe spawns C:\\Windows\\System32\\rundll32.exe (PID 5412) loading comsvcs.dll via export MiniDump or ordinal #24 to bypass string filters (MITRE T1218.011).',
  },
  {
    id: 1,
    tag: '02',
    title: 'comsvcs.dll enables SeDebugPrivilege & calls OpenProcess(0x1010, 684)',
    story:
      'Turning the brass camera aperture wide open, the photographer requests deep X-ray viewing permission across every locked safe-deposit box.',
    technical:
      'comsvcs.dll!MiniDumpW calls RtlAdjustPrivilege and OpenProcess(0x1010 — PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ) on lsass.exe (PID 684).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Unprotected lsass.exe (PPL=0) grants live handle for memory reading',
    story:
      'Because no armored blast shield covers the circular steel vault door, the crimson X-ray lens locks directly onto the golden passkey drawers.',
    technical:
      'With RunAsPPL disabled on WKS-ADM-07, Windows returns a valid LSASS process handle to rundll32.exe and hands execution to dbgcore.dll!MiniDumpWriteDump.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Sysmon Event ID 10 records GrantedAccess 0x1010 & comsvcs.dll CallTrace',
    story:
      'High above the corridor, the glass security guard booth logs the photographer’s exact badge, wide lens setting, and camera chain straight to the vault.',
    technical:
      'Kernel ObRegisterCallbacks emits Sysmon Event ID 10 showing TargetImage=lsass.exe, GrantedAccess=0x1010, and CallTrace containing comsvcs.dll + dbgcore.dll.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'LOLBIN CMD', transform: 'scale(1.24) translate(110px, -22px)' },
  { id: 'OPEN 0x1010', transform: 'scale(1.28) translate(-10px, -24px)' },
  { id: 'SYSMON 10', transform: 'scale(1.26) translate(-40px, -110px)' },
];

export function LsassStep2ComsvcsOpenProcessClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.load-wire, .handle-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.open-box, .lsass-box, .eid10-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.load-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.open-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.handle-wire'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat2');
    tl.to(q('.lsass-box'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat2+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.eid10-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lsass-step2"
      stageLabel="STEP #2"
      mitreId="T1218.011"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Signed rundll32.exe PID 5412 loads comsvcs.dll ordinal #24 and calls OpenProcess 0x1010 on lsass.exe PID 684 triggering Sysmon Event ID 10"
      >
        <FilmBackdrop prefix="ls2" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          SIGNED LOLBIN PROXY · RUNDLL32.EXE + COMSVCS.DLL,#24 · OPENPROCESS(0x1010) ON LSASS.EXE
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          PID 5412 → PID 684 · Sysmon EID 10
        </text>

        {/* Left: Signed LOLBin Launcher */}
        <rect x="40" y="138" width="294" height="316" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="187" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
          SIGNED PROXY BINARY
        </text>
        <text x="187" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
          rundll32.exe (PID 5412)
        </text>

        <rect x="62" y="218" width="250" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="187" y="246" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily={FONT}>
          C:\Windows\System32\comsvcs.dll
        </text>
        <text x="187" y="272" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
          Export: MiniDump OR #24
        </text>
        <text x="187" y="296" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
          Microsoft Windows Signed DLL
        </text>

        <rect x="62" y="336" width="250" height="94" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="187" y="364" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
          ORDINAL #24 EVASION
        </text>
        <text x="187" y="388" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>
          comsvcs.dll,#24 684 debug.dmp full
        </text>
        <text x="187" y="410" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>
          Evades naive &quot;MiniDump&quot; CLI rules
        </text>

        <line className="load-wire" x1="338" y1="296" x2="412" y2="296" stroke="#f59e0b" strokeWidth="4" />

        {/* Center: OpenProcess 0x1010 */}
        <g className="open-box">
          <rect x="416" y="138" width="346" height="316" rx="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
          <text x="589" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>
            KERNEL HANDLE REQUEST
          </text>
          <text x="589" y="196" textAnchor="middle" fill="#f8fafc" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            OpenProcess(0x1010, FALSE, 684)
          </text>

          <rect x="438" y="218" width="302" height="104" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="589" y="246" textAnchor="middle" fill="#fecaca" fontSize="12.5" fontWeight="700" fontFamily={FONT}>
            GRANTED ACCESS: 0x1010
          </text>
          <text x="589" y="272" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            0x1000 PROCESS_QUERY_LIMITED_INFO
          </text>
          <text x="589" y="296" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            0x0010 PROCESS_VM_READ (Memory Read)
          </text>

          <rect x="438" y="338" width="302" height="92" rx="10" fill="#1e293b" stroke="#a855f7" strokeWidth="1.8" />
          <text x="589" y="366" textAnchor="middle" fill="#e9d5ff" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            CALL STACK (CALLTRACE)
          </text>
          <text x="589" y="390" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>
            ntdll → KERNELBASE → comsvcs.dll
          </text>
          <text x="589" y="412" textAnchor="middle" fill="#f5d0fe" fontSize="10.5" fontFamily={FONT}>
            → dbgcore.dll!MiniDumpWriteDump
          </text>
        </g>

        <line className="handle-wire" x1="766" y1="296" x2="838" y2="296" stroke="#ef4444" strokeWidth="4" />

        {/* Right: LSASS Target Vault */}
        <g className="lsass-box">
          <rect x="842" y="138" width="318" height="316" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1001" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
            TARGET CREDENTIAL VAULT
          </text>
          <text x="1001" y="196" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700" fontFamily={FONT}>
            lsass.exe (PID 684)
          </text>

          <rect x="864" y="220" width="274" height="102" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
          <text x="1001" y="248" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>
            UNPROTECTED (RunAsPPL = 0)
          </text>
          <text x="1001" y="274" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            lsasrv.dll!LogonSessionList
          </text>
          <text x="1001" y="298" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            msv1_0.dll &amp; kerberos.dll Readable
          </text>

          <rect x="864" y="338" width="274" height="92" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1001" y="366" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>
            HANDLE RETURNED: VALID
          </text>
          <text x="1001" y="390" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Ready for ReadProcessMemory
          </text>
          <text x="1001" y="412" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
            PPID 620 (services.exe · SYSTEM)
          </text>
        </g>

        {/* Bottom Witness Bar */}
        <g className="eid10-bar">
          <rect x="108" y="504" width="984" height="90" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SYSMON EID 10 WITNESS: rundll32.exe (PID 5412) → lsass.exe (PID 684) · GrantedAccess 0x1010
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            CallTrace reveals comsvcs.dll + dbgcore.dll even when attacker invokes ordinal #24 instead of &quot;MiniDump&quot;
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
