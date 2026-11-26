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
    title: 'Word macro spawns hidden encoded PowerShell on WKS-FIN-09',
    story:
      'A covert technician enters the precision workshop through the mail chute and walks straight to the workshop console without opening a visible window.',
    technical:
      'winword.exe (PID 3820) spawns powershell.exe -NoP -W Hidden -Enc ... (PID 5412, CORP\\a.miller) logged by Sysmon EID 1.',
  },
  {
    id: 1,
    tag: '02',
    title: 'PowerShell shares the exact same user-mode room with amsi.dll',
    story:
      'Windows places the X-Ray scanner inside the very same room as the workbench, so the script does not need special admin keys to reach it.',
    technical:
      'C:\\Windows\\System32\\amsi.dll maps inside PID 5412 Ring 3 address space alongside the CLR interpreter.',
  },
  {
    id: 2,
    tag: '03',
    title: 'P/Invoke resolves the live ASLR address of AmsiScanBuffer',
    story:
      'The technician reads the brass serial plaque on the scanner cabinet to pinpoint the exact fuse box address for this boot.',
    technical:
      'LoadLibrary("amsi.dll") + GetProcAddress(hAmsi, "AmsiScanBuffer") returns FARPROC 0x7FF9C2142840 (currently PAGE_EXECUTE_READ 0x20).',
  },
  {
    id: 3,
    tag: '04',
    title: 'Paper-tape Script Block Logging records the de-obfuscated bypass',
    story:
      'Before the technician even touches a single fuse, the overhead mechanical paper-tape printer captures their entire preparation script.',
    technical:
      'PowerShell Operational EID 4104 logs decoded amsi.dll + AmsiScanBuffer + GetProcAddress + VirtualProtect pre-bypass.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SHARED RAM', transform: 'scale(1.22) translate(-70px, -25px)' },
  { id: 'EXPORT ADDR', transform: 'scale(1.3) translate(-220px, -40px)' },
  { id: 'EID 4104 LOG', transform: 'scale(1.25) translate(-40px, -110px)' },
];

export function AmsiStep1LookupClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.stager-line'), { strokeDasharray: 260, strokeDashoffset: 260 });
    tl.set(q('.lookup-line'), { strokeDasharray: 300, strokeDashoffset: 300 });
    tl.set(q('.ps-box, .amsi-box, .addr-badge, .eid4104-tape'), { autoAlpha: 0, y: 12 });
    tl.set(q('.scan-reticle'), { autoAlpha: 0, x: -160 });

    // Beat 0: winword spawns powershell
    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.stager-line'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to(q('.ps-box'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'beat0+=0.55');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: amsi.dll inside same user-mode container
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.amsi-box'), { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: LoadLibrary + GetProcAddress reticle locks on 0x7FF9C2142840
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.lookup-line'), { strokeDashoffset: 0, duration: clipPace.teach, ease: 'none' }, 'beat2');
    tl.to(q('.scan-reticle'), { autoAlpha: 1, x: 0, duration: clipPace.teach, ease: 'power2.inOut' }, 'beat2+=0.1');
    tl.to(q('.addr-badge'), { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 'beat2+=0.9');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: PowerShell EID 4104 captures plaintext script block above boundary
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.eid4104-tape'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-amsi-step1"
      stageLabel="STEP #1"
      mitreId="T1059.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="winword.exe spawns hidden encoded powershell.exe which resolves amsi.dll AmsiScanBuffer at 0x7FF9C2142840 while PowerShell EID 4104 logs the script block"
      >
        <FilmBackdrop prefix="amsi1" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          RING 3 · SAME-PROCESS ADDRESS RESOLUTION · AmsiScanBuffer
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WKS-FIN-09 · PID 5412
        </text>

        {/* Left: winword.exe */}
        <g transform="translate(46, 170)">
          <rect width="215" height="145" rx="14" fill="#1e1b2e" stroke="#f43f5e" strokeWidth="2.5" />
          <text x="18" y="30" fill="#fda4af" fontSize="12" fontFamily={FONT} fontWeight="700">
            PARENT PROCESS
          </text>
          <text x="18" y="64" fill="#f8fafc" fontSize="22" fontFamily={FONT} fontWeight="800">
            winword.exe
          </text>
          <text x="18" y="92" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
            PID 3820 · Macro
          </text>
          <text x="18" y="120" fill="#fb7185" fontSize="12" fontFamily={FONT}>
            Q4_Budget_Review.docm
          </text>
        </g>

        {/* Spawn connector */}
        <path
          className="stager-line"
          d="M 266 242 L 368 242"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text x="317" y="226" textAnchor="middle" fill="#fbbf24" fontSize="11.5" fontFamily={FONT}>
          Sysmon EID 1
        </text>

        {/* Shared User-Mode Room: powershell.exe (PID 5412) */}
        <g transform="translate(375, 110)">
          <g className="ps-box">
            <rect width="775" height="310" rx="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="24" y="34" fill="#38bdf8" fontSize="13" fontFamily={FONT} fontWeight="800">
              SHARED RING 3 ROOM · powershell.exe (PID 5412) · -NoP -W Hidden -Enc
            </text>

            {/* Script Lane */}
            <g transform="translate(24, 64)">
              <rect width="290" height="210" rx="12" fill="#172033" stroke="#6366f1" strokeWidth="2" />
              <text x="18" y="32" fill="#a5b4fc" fontSize="12" fontFamily={FONT} fontWeight="700">
                P/INVOKE STAGER SCRIPT
              </text>
              <text x="18" y="72" fill="#e2e8f0" fontSize="13.5" fontFamily={FONT}>
                LoadLibrary(&quot;amsi.dll&quot;)
              </text>
              <text x="18" y="106" fill="#e2e8f0" fontSize="13.5" fontFamily={FONT}>
                GetProcAddress(
              </text>
              <text x="34" y="130" fill="#fde047" fontSize="13.5" fontFamily={FONT}>
                hAmsi, &quot;AmsiScanBuffer&quot;
              </text>
              <text x="18" y="154" fill="#e2e8f0" fontSize="13.5" fontFamily={FONT}>
                )
              </text>
              <text x="18" y="188" fill="#94a3b8" fontSize="11.5" fontFamily={FONT}>
                No Admin Required (Same PID)
              </text>
            </g>

            {/* Lookup Arrow */}
            <path
              className="lookup-line"
              d="M 320 170 L 424 170"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="372" y="152" textAnchor="middle" fill="#67e8f9" fontSize="11.5" fontFamily={FONT}>
              Export Lookup
            </text>

            {/* amsi.dll inside SAME container */}
            <g transform="translate(432, 64)">
              <g className="amsi-box">
                <rect width="318" height="210" rx="12" fill="#10253a" stroke="#06b6d4" strokeWidth="2.5" />
                <text x="18" y="32" fill="#67e8f9" fontSize="12" fontFamily={FONT} fontWeight="700">
                  SIGNED SECURITY DLL (SAME RAM)
                </text>
                <text x="18" y="68" fill="#f8fafc" fontSize="22" fontFamily={FONT} fontWeight="800">
                  amsi.dll
                </text>
                <text x="18" y="102" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
                  Export: AmsiScanBuffer
                </text>
                <text x="18" y="132" fill="#38bdf8" fontSize="12.5" fontFamily={FONT}>
                  Protect: PAGE_EXECUTE_READ (0x20)
                </text>
              </g>

              {/* Moving address lock reticle */}
              <g transform="translate(18, 152)">
                <g className="scan-reticle">
                  <rect width="282" height="42" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                  <g className="addr-badge">
                    <text x="141" y="26" textAnchor="middle" fill="#fde047" fontSize="14.5" fontFamily={FONT} fontWeight="800">
                      FOUND: 0x7FF9C2142840
                    </text>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* Bottom Witness Strip: PowerShell EID 4104 Paper-Tape Log */}
        <g transform="translate(160, 466)">
          <g className="eid4104-tape">
            <rect width="880" height="118" rx="14" fill="#271c0a" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="24" y="34" fill="#fbbf24" fontSize="13" fontFamily={FONT} fontWeight="800">
              DETECT WITNESS · POWERSHELL OPERATIONAL EVENT ID 4104 (PRE-BYPASS CAPTURE)
            </text>
            <text x="24" y="68" fill="#fef3c7" fontSize="14" fontFamily={FONT}>
              ScriptBlockText: $h=[Kernel32]::LoadLibrary(&quot;amsi.dll&quot;); $a=GetProcAddress($h,&quot;AmsiScanBuffer&quot;)
            </text>
            <text x="24" y="96" fill="#fcd34d" fontSize="12" fontFamily={FONT}>
              Logged automatically in plaintext BEFORE AMSI is patched — user-mode bypass cannot erase it.
            </text>
          </g>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
