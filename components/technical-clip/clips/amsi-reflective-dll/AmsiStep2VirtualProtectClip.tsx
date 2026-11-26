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
    title: 'Signed amsi.dll code pages start locked as Read-Execute (0x20)',
    story:
      'The blue glass safety hatch over the six inspection fuses is bolted shut so no script can overwrite live scanner code.',
    technical:
      'amsi.dll!.text @ 0x7FF9C2142840 is mapped shared SEC_IMAGE with PAGE_EXECUTE_READ (0x20).',
  },
  {
    id: 1,
    tag: '02',
    title: 'VirtualProtect crosses into Ring 0 via NtProtectVirtualMemory',
    story:
      'The technician fits the brass master wrench onto the hatch bolt and requests write access to that exact 4 KB slot.',
    technical:
      'kernel32!VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE [0x40], &oldProtect) -> ntdll!NtProtectVirtualMemory.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Copy-on-Write forks a private writable RWX page for PID 5412',
    story:
      'The blue seal fractures and the hatch swings open under an amber glow exclusively inside this workshop room without touching other rooms.',
    technical:
      'Page Table Entry flips 0x20 (RX) -> 0x40 (RWX) via Copy-on-Write; System32\\amsi.dll on disk stays untouched.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Kernel ETW-Ti fires EtwTiLogProtectVM (tamper-resistant witness)',
    story:
      'The instant the glass seal breaks, a violet ultraviolet sensor mounted on the hatch hinge flashes straight up to the control room.',
    technical:
      'Microsoft-Windows-Threat-Intelligence emits EtwTiLogProtectVM (Target: amsi.dll, Old: 0x20, New: 0x40).',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SYSCALL', transform: 'scale(1.22) translate(-60px, -25px)' },
  { id: 'PTE FLIP', transform: 'scale(1.28) translate(-210px, -30px)' },
  { id: 'ETW-TI RING 0', transform: 'scale(1.25) translate(-50px, -110px)' },
];

export function AmsiStep2VirtualProtectClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.vp-call-line'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.rwx-state, .cow-badge, .etw-beacon'), { autoAlpha: 0, y: 10 });
    tl.set(q('.rx-state'), { autoAlpha: 1 });

    // Beat 0: Locked RX 0x20 baseline
    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: VirtualProtect syscall across boundary
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.vp-call-line'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: Page protection flips 0x20 -> 0x40 + Copy-on-Write badge
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.rx-state'), { autoAlpha: 0.18, duration: 0.45 }, 'beat2');
    tl.to(q('.rwx-state'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'back.out(1.4)' }, 'beat2+=0.15');
    tl.to(q('.cow-badge'), { autoAlpha: 1, y: 0, duration: 0.55 }, 'beat2+=0.55');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: Violet Ring 0 EtwTiLogProtectVM pulse
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.etw-beacon'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-amsi-step2"
      stageLabel="STEP #2"
      mitreId="T1562.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="VirtualProtect crosses into kernel NtProtectVirtualMemory to flip amsi.dll at 0x7FF9C2142840 from PAGE_EXECUTE_READ 0x20 to PAGE_EXECUTE_READWRITE 0x40 while firing EtwTiLogProtectVM"
      >
        <FilmBackdrop prefix="amsi2" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          RING 3 → RING 0 · VirtualProtect(0x7FF9C2142840, 6, 0x40, &amp;old)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          Copy-on-Write · EtwTiLogProtectVM
        </text>

        {/* User / Kernel Divider */}
        <line x1="40" y1="365" x2="1160" y2="365" stroke="#475569" strokeWidth="2" strokeDasharray="10 8" />
        <text x="52" y="352" fill="#38bdf8" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          USER MODE (RING 3 · powershell.exe PID 5412)
        </text>
        <text x="52" y="390" fill="#c084fc" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          KERNEL MODE (RING 0 · MEMORY MANAGER &amp; ETW THREAT INTELLIGENCE)
        </text>

        {/* Left Caller Box */}
        <g transform="translate(52, 104)">
          <rect width="305" height="205" rx="14" fill="#172033" stroke="#6366f1" strokeWidth="2.5" />
          <text x="20" y="34" fill="#a5b4fc" fontSize="12" fontFamily={FONT} fontWeight="700">
            KERNEL32 P/INVOKE CALL
          </text>
          <text x="20" y="72" fill="#f8fafc" fontSize="20" fontFamily={FONT} fontWeight="800">
            VirtualProtect()
          </text>
          <text x="20" y="106" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
            lpAddress: 0x7FF9C2142840
          </text>
          <text x="20" y="132" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
            dwSize: 6 bytes (4 KB page)
          </text>
          <text x="20" y="158" fill="#fbbf24" fontSize="13.5" fontFamily={FONT} fontWeight="700">
            flNewProtect: 0x40 (RWX)
          </text>
          <text x="20" y="186" fill="#94a3b8" fontSize="12" fontFamily={FONT}>
            &amp;lpflOldProtect -&gt; saves 0x20
          </text>
        </g>

        {/* Syscall Path */}
        <path
          className="vp-call-line"
          d="M 362 206 L 548 206"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <text x="455" y="186" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily={FONT} fontWeight="700">
          NtProtectVirtualMemory
        </text>

        {/* Right Page Table Box */}
        <g transform="translate(558, 90)">
          <rect width="585" height="232" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="22" y="32" fill="#94a3b8" fontSize="12" fontFamily={FONT} fontWeight="700">
            4 KB PAGE TABLE ENTRY · amsi.dll!AmsiScanBuffer (0x7FF9C2142840)
          </text>

          {/* Before: RX 0x20 */}
          <g transform="translate(22, 54)">
            <g className="rx-state">
              <rect width="248" height="106" rx="12" fill="#0c263f" stroke="#38bdf8" strokeWidth="2" />
              <text x="16" y="30" fill="#7dd3fc" fontSize="12" fontFamily={FONT} fontWeight="700">
                BEFORE (LOCKED)
              </text>
              <text x="16" y="64" fill="#f8fafc" fontSize="20" fontFamily={FONT} fontWeight="800">
                R - X (0x20)
              </text>
              <text x="16" y="90" fill="#93c5fd" fontSize="12" fontFamily={FONT}>
                Write Attempt = Crash
              </text>
            </g>
          </g>

          {/* After: RWX 0x40 */}
          <g transform="translate(296, 54)">
            <g className="rwx-state">
              <rect width="266" height="106" rx="12" fill="#422006" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="16" y="30" fill="#fde047" fontSize="12" fontFamily={FONT} fontWeight="700">
                AFTER (UNLOCKED!)
              </text>
              <text x="16" y="64" fill="#fef08a" fontSize="20" fontFamily={FONT} fontWeight="800">
                R W X (0x40)
              </text>
              <text x="16" y="90" fill="#fbbf24" fontSize="12" fontFamily={FONT}>
                Writable + Executable
              </text>
            </g>
          </g>

          {/* Copy-on-Write Note */}
          <g transform="translate(22, 174)">
            <g className="cow-badge">
              <rect width="540" height="42" rx="8" fill="#052e16" stroke="#10b981" strokeWidth="1.8" />
              <text x="270" y="26" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontFamily={FONT} fontWeight="700">
                COPY-ON-WRITE FORKED PRIVATE PAGE FOR PID 5412 · DISK UNCHANGED
              </text>
            </g>
          </g>
        </g>

        {/* Bottom Kernel Witness: EtwTiLogProtectVM */}
        <g transform="translate(140, 434)">
          <g className="etw-beacon">
            <rect width="920" height="142" rx="16" fill="#220f3a" stroke="#a855f7" strokeWidth="2.8" />
            <text x="26" y="36" fill="#d8b4fe" fontSize="13" fontFamily={FONT} fontWeight="800">
              RING 0 KERNEL WITNESS · Microsoft-Windows-Threat-Intelligence :: EtwTiLogProtectVM
            </text>
            <text x="26" y="74" fill="#f3e8ff" fontSize="15.5" fontFamily={FONT} fontWeight="700">
              TargetModule: C:\Windows\System32\amsi.dll   |   OldProtection: 0x20  →  NewProtection: 0x40
            </text>
            <text x="26" y="110" fill="#c084fc" fontSize="12.5" fontFamily={FONT}>
              Emitted inside Kernel Mode the exact instant signed amsi.dll flips writable — user-mode AMSI bypass cannot mute it.
            </text>
          </g>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
