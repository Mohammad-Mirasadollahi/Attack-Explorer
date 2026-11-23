'use client';

import { useCallback } from 'react';
import gsap from 'gsap';
import { AnimeClipStage, type ClipTimelineApi } from '../AnimeClipStage';
import { FilmBackdrop } from '../FilmBackdrop';
import { clipPace } from '../clipPace';

const FONT = 'ui-monospace, monospace';

const BEATS = [
  {
    id: 0,
    tag: '01',
    title: 'The memory handle docks into the process query port',
    story:
      'Without asking for any new permission, the loader plugs the memory key it already holds into the system block reader to inspect the paused host.',
    technical:
      'Reuses hProcess = 0x01C4 (0x1FFFFF) from Step #1 via NtQueryInformationProcess — no fresh OpenProcess call.',
  },
  {
    id: 1,
    tag: '02',
    title: 'A scanner reads the Process Environment Block to find the base slot',
    story:
      'A scan bar steps down the process directory table, stops on the image location entry, and sends the exact starting memory address across to the memory map.',
    technical:
      'ReadProcessMemory reads PEB+0x10 → ImageBaseAddress = 0x00400000 inside svchost.exe (PID 4892).',
  },
  {
    id: 2,
    tag: '03',
    title: 'The kernel unmapper strips every signed section from the base slot',
    story:
      'An extractor arm locks onto each signed code and data section inside that address slot and lifts it clean out of memory, leaving empty dashed frames behind.',
    technical:
      'ntdll!NtUnmapViewOfSection(0x01C4, 0x00400000) → nt!MiUnmapViewOfSection detaches the file-backed SEC_IMAGE VAD.',
  },
  {
    id: 3,
    tag: '04',
    title: 'The core system bridge library is skipped and remains locked',
    story:
      'The unmap probe checks the core system library beside the main program, hits a protection shield, and leaves it untouched so the process can still call the core.',
    technical:
      'ntdll.dll .text (0x7FF8B4200000 · R-X) remains mapped. Only the svchost.exe image section at 0x00400000 is removed.',
  },
  {
    id: 4,
    tag: '05',
    title: 'The kernel confirms success while the trusted process identity survives',
    story:
      'The core returns a zero success code for the emptied slot, yet the process stays alive under its original trusted name and security badge.',
    technical:
      'NTSTATUS = 0x00000000 (STATUS_SUCCESS). Slot 0x00400000 is hollow while EPROCESS stays svchost.exe (PID 4892).',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PEB', transform: 'scale(1.42) translate(18%, 6%)' },
  { id: 'VAD', transform: 'scale(1.38) translate(-4%, 4%)' },
  { id: 'KERNEL', transform: 'scale(1.38) translate(-18%, 2%)' },
];

const SECTIONS = [
  { id: 'hdr', name: 'PE Header', perm: 'R-- · SEC_IMAGE', y: 114 },
  { id: 'text', name: '.text (signed)', perm: 'R-X · SEC_IMAGE', y: 168 },
  { id: 'rdata', name: '.rdata', perm: 'R-- · SEC_IMAGE', y: 222 },
  { id: 'data', name: '.data', perm: 'RW- · SEC_IMAGE', y: 276 },
] as const;

export default function Step2UnmapClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    gsap.set(q('.key-token'), { x: -72, autoAlpha: 0 });
    gsap.set(q('.socket-ring'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });
    gsap.set(q('.peb-scan'), { y: 0, autoAlpha: 0 });
    gsap.set(q('.peb-row-hit'), { autoAlpha: 0 });
    gsap.set(q('.addr-chip'), { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
    gsap.set(q('.addr-wire'), { strokeDashoffset: 260 });
    gsap.set(q('.addr-packet'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.sec-card'), { y: 0, autoAlpha: 1, scale: 1 });
    gsap.set(q('.ghost-slot'), { autoAlpha: 0 });
    gsap.set(q('.gantry'), { y: 0, autoAlpha: 0 });
    gsap.set(q('.kernel-call'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.ntdll-probe'), { strokeDashoffset: 90 });
    gsap.set(q('.skip-shield'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });
    gsap.set(q('.status-stamp'), { autoAlpha: 0, scale: 1.35, transformOrigin: '50% 50%' });
    gsap.set(q('.identity-stay'), { autoAlpha: 0, y: 10 });
    gsap.set(q('.etw-strip'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });

    const log = (sel: string, at: string | number) =>
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.35 }, at);

    // Beat 0: Reuse hProcess 0x01C4 into PEB query port
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.set(q('.key-token'), { autoAlpha: 1 }, 'beat0');
    tl.to(q('.key-token'), { x: 0, duration: clipPace.travel, ease: 'power2.out' }, 'beat0');
    tl.to(q('.socket-ring'), { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 'beat0+=1.0');
    log('.log-0', 'beat0+=1.05');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: Scan PEB rows -> lock on +0x10 ImageBaseAddress -> send 0x00400000 to VAD
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.peb-scan'), { autoAlpha: 1, y: 0 }, 'beat1');
    tl.to(q('.peb-scan'), { y: 68, duration: clipPace.teach, ease: 'power1.inOut' }, 'beat1');
    tl.to(q('.peb-row-hit'), { autoAlpha: 1, duration: 0.35 }, 'beat1+=1.35');
    tl.to(q('.addr-chip'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, 'beat1+=1.5');
    tl.to(q('.addr-wire'), { strokeDashoffset: 0, duration: 0.75, ease: 'none' }, 'beat1+=1.7');
    tl.set(q('.addr-packet'), { autoAlpha: 1, x: 0 }, 'beat1+=1.75');
    tl.to(q('.addr-packet'), { x: 86, duration: 0.75, ease: 'power2.inOut' }, 'beat1+=1.75');
    tl.to(q('.addr-packet'), { autoAlpha: 0, duration: 0.15 }, 'beat1+=2.5');
    log('.log-1', 'beat1+=1.9');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: nt!MiUnmapViewOfSection extracts each SEC_IMAGE section upward out of 0x00400000
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.set(q('.gantry'), { autoAlpha: 1, y: 0 }, 'beat2');
    tl.to(q('.kernel-call'), { autoAlpha: 1, y: 0, duration: 0.5 }, 'beat2');

    SECTIONS.forEach((sec, idx) => {
      const targetY = idx * 54;
      const liftDur = idx === 0 ? clipPace.teach : clipPace.repeat;
      const startPos = idx === 0 ? 'beat2+=0.2' : '>';
      tl.to(q('.gantry'), { y: targetY, duration: idx === 0 ? 0.45 : 0.38 }, startPos);
      tl.to(q(`.sec-${sec.id}`), { y: -96, autoAlpha: 0, duration: liftDur, ease: 'power2.in' }, '>0.08');
      tl.to(q(`.ghost-${sec.id}`), { autoAlpha: 1, duration: 0.4 }, '<0.35');
      if (idx === 0) log('.log-2', '<0.2');
    });
    tl.to(q('.gantry'), { autoAlpha: 0.35, duration: 0.3 });
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: Probe checks ntdll.dll .text -> skipped with green shield
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.ntdll-probe'), { strokeDashoffset: 90 }, 'beat3');
    tl.to(q('.ntdll-probe'), { strokeDashoffset: 0, duration: 0.85, ease: 'none' }, 'beat3');
    tl.to(q('.skip-shield'), { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, 'beat3+=0.55');
    log('.log-3', 'beat3+=0.75');
    tl.to({}, { duration: clipPace.hold });

    // Beat 4: Kernel stamps NTSTATUS 0x00000000 & confirms svchost.exe identity untouched
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.status-stamp'), { autoAlpha: 1 }, 'beat4');
    tl.to(q('.status-stamp'), { scale: 1, duration: 0.65, ease: 'back.out(1.7)' }, 'beat4');
    tl.to(q('.identity-stay'), { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 'beat4+=0.4');
    tl.to(q('.etw-strip'), { autoAlpha: 1, y: 0, duration: 0.55 }, 'beat4+=0.75');
    log('.log-4', 'beat4+=0.85');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-step2"
      stageLabel="STEP #2"
      mitreId="T1055.012"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="hProcess 0x01C4 queries PEB+0x10 for ImageBaseAddress 0x00400000, NtUnmapViewOfSection strips signed SEC_IMAGE pages while skipping ntdll.dll, returning STATUS_SUCCESS"
      >
        <FilmBackdrop prefix="s2" />

        {/* Header */}
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} letterSpacing="0.14em">
          PEB QUERY (PEB+0x10) → NtUnmapViewOfSection
        </text>
        <text x="1172" y="28" textAnchor="end" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
          Target: svchost.exe · PID 4892 (Suspended)
        </text>

        {/* Left Panel: PEB Reader */}
        <rect x="28" y="50" width="388" height="340" rx="12" fill="#091829" stroke="#38bdf8" strokeWidth="2" />
        <rect x="28" y="50" width="388" height="30" rx="12" fill="#0c4a6e" />
        <text x="222" y="70" textAnchor="middle" fill="#e0f2fe" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          PEB INSPECTOR · NtQueryInformationProcess
        </text>

        {/* Dedicated Handle Dock */}
        <rect x="46" y="92" width="352" height="42" rx="8" fill="#020617" stroke="#334155" strokeDasharray="4 3" />
        <text x="386" y="117" textAnchor="end" fill="#64748b" fontSize="10" fontFamily={FONT}>
          REUSED KEY
        </text>
        <g className="key-token">
          <rect x="52" y="98" width="234" height="30" rx="6" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="72" cy="113" r="7" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <rect x="79" y="110" width="14" height="6" rx="1.5" fill="#fbbf24" />
          <text x="104" y="118" fill="#fde68a" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            hProcess = 0x01C4
          </text>
        </g>
        <circle className="socket-ring" cx="304" cy="113" r="7" fill="#052e16" stroke="#4ade80" strokeWidth="2" />

        {/* PEB Offset Table */}
        <rect x="46" y="146" width="352" height="162" rx="8" fill="#061221" stroke="#1e3a5f" />
        <rect className="peb-row-hit" x="52" y="220" width="340" height="32" rx="5" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
        <rect className="peb-scan" x="52" y="152" width="340" height="30" rx="4" fill="#38bdf8" opacity="0.22" stroke="#67e8f9" />
        {[
          ['+0x00', 'InheritedAddressSpace', '0x00'],
          ['+0x08', 'Mutant', '0xFFFF...FFFF'],
          ['+0x10', 'ImageBaseAddress', '0x00400000'],
          ['+0x18', 'Ldr (PEB_LDR_DATA)', '0x7FF8B432'],
        ].map(([off, field, val], i) => (
          <g key={off}>
            <text x="64" y={172 + i * 34} fill={i === 2 ? '#fde68a' : '#7dd3fc'} fontSize="12" fontFamily={FONT} fontWeight="700">
              {off}
            </text>
            <text x="122" y={172 + i * 34} fill={i === 2 ? '#fef9c3' : '#cbd5e1'} fontSize="11.5" fontFamily={FONT}>
              {field}
            </text>
            <text x="382" y={172 + i * 34} textAnchor="end" fill={i === 2 ? '#fbbf24' : '#64748b'} fontSize="11.5" fontFamily={FONT} fontWeight={i === 2 ? '700' : '400'}>
              {val}
            </text>
          </g>
        ))}

        {/* Extracted BaseAddress Chip */}
        <g className="addr-chip">
          <rect x="46" y="320" width="352" height="54" rx="8" fill="#291a04" stroke="#fbbf24" strokeWidth="1.75" />
          <text x="222" y="342" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            EXTRACTED TARGET BASE ADDRESS
          </text>
          <text x="222" y="364" textAnchor="middle" fill="#fef3c7" fontSize="15" fontFamily={FONT} fontWeight="700">
            BaseAddress = 0x00400000
          </text>
        </g>

        {/* Address Wire to VAD Slot */}
        <path d="M 416 236 H 496" fill="none" stroke="#1e293b" strokeWidth="4" />
        <path
          className="addr-wire"
          d="M 416 236 H 496"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeDasharray="260"
          markerEnd="url(#s2-arrow-amber)"
        />
        <g className="addr-packet">
          <rect x="410" y="222" width="74" height="26" rx="5" fill="#422006" stroke="#fbbf24" />
          <text x="447" y="239" textAnchor="middle" fill="#fef3c7" fontSize="10" fontFamily={FONT} fontWeight="700">
            0x400000
          </text>
        </g>

        {/* Center Panel: Virtual Memory & VAD Slot 0x00400000 */}
        <rect x="502" y="50" width="368" height="340" rx="12" fill="#0b1220" stroke="#64748b" strokeWidth="2" />
        <rect x="502" y="50" width="368" height="30" rx="12" fill="#1e293b" />
        <text x="686" y="70" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          VAD SLOT · 0x00400000 (svchost.exe)
        </text>
        <text x="686" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
          Original File-Backed SEC_IMAGE Sections
        </text>

        {/* Ghost Vacant Outlines (revealed underneath as sections lift out) */}
        {SECTIONS.map((sec) => (
          <g key={`ghost-${sec.id}`} className={`ghost-slot ghost-${sec.id}`}>
            <rect
              x="530"
              y={sec.y}
              width="312"
              height="44"
              rx="7"
              fill="#020617"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text x="686" y={sec.y + 26} textAnchor="middle" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
              UNMAPPED · VACANT SLOT
            </text>
          </g>
        ))}

        {/* Signed Sections that lift out */}
        {SECTIONS.map((sec) => (
          <g key={sec.id} className={`sec-card sec-${sec.id} cutaway-guts`}>
            <rect x="530" y={sec.y} width="312" height="44" rx="7" fill="#3b1d06" stroke="#fbbf24" strokeWidth="1.75" />
            <text x="546" y={sec.y + 20} fill="#fef3c7" fontSize="12.5" fontFamily={FONT} fontWeight="700">
              {sec.name}
            </text>
            <text x="546" y={sec.y + 36} fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>
              {sec.perm}
            </text>
            <text x="828" y={sec.y + 26} textAnchor="end" fill="#fbbf24" fontSize="10" fontFamily={FONT}>
              SIGNED MS
            </text>
          </g>
        ))}

        {/* Animated Kernel Extractor Gantry */}
        <g className="gantry">
          <rect x="514" y="114" width="10" height="44" rx="3" fill="#a78bfa" filter="url(#s2-soft-glow)" />
          <rect x="848" y="114" width="10" height="44" rx="3" fill="#a78bfa" filter="url(#s2-soft-glow)" />
          <line x1="524" y1="136" x2="848" y2="136" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="5 4" />
        </g>

        {/* Kernel Routine Badge */}
        <g className="kernel-call">
          <rect x="530" y="336" width="312" height="38" rx="7" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="686" y="352" textAnchor="middle" fill="#ddd6fe" fontSize="11" fontFamily={FONT} fontWeight="700">
            nt!MiUnmapViewOfSection
          </text>
          <text x="686" y="367" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily={FONT}>
            detaches SEC_IMAGE from kernel VAD tree
          </text>
        </g>

        {/* Probe Wire from VAD to ntdll.dll */}
        <path
          className="ntdll-probe"
          d="M 870 132 H 908"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeDasharray="90"
          markerEnd="url(#s2-arrow-emerald)"
        />

        {/* Right Top: Protected Control (ntdll.dll) */}
        <rect x="912" y="50" width="260" height="148" rx="12" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
        <text x="1042" y="76" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontFamily={FONT} fontWeight="700">
          UNTOUCHED CONTROL
        </text>
        <text x="1042" y="102" textAnchor="middle" fill="#f0f9ff" fontSize="14.5" fontFamily={FONT} fontWeight="700">
          ntdll.dll .text
        </text>
        <text x="1042" y="124" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontFamily={FONT}>
          0x7FF8B4200000 · R-X
        </text>
        <g className="skip-shield">
          <rect x="932" y="142" width="220" height="40" rx="8" fill="#052e16" stroke="#4ade80" strokeWidth="1.75" />
          <circle cx="956" cy="162" r="10" fill="#14532d" stroke="#4ade80" strokeWidth="1.5" />
          <path d="M 951 162 l 4 4 l 7 -9" fill="none" stroke="#4ade80" strokeWidth="2" />
          <text x="976" y="166" fill="#bbf7d0" fontSize="11" fontFamily={FONT} fontWeight="700">
            SKIPPED · STAYS MAPPED
          </text>
        </g>

        {/* Right Bottom: Kernel Return Stamp & Identity Invariant */}
        <g className="status-stamp">
          <rect x="912" y="214" width="260" height="86" rx="12" fill="#052e16" stroke="#4ade80" strokeWidth="2.5" filter="url(#s2-soft-glow)" />
          <text x="1042" y="242" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT} fontWeight="700">
            KERNEL RETURN CODE
          </text>
          <text x="1042" y="268" textAnchor="middle" fill="#dcfce7" fontSize="16" fontFamily={FONT} fontWeight="700">
            NTSTATUS 0x00000000
          </text>
          <text x="1042" y="288" textAnchor="middle" fill="#4ade80" fontSize="10.5" fontFamily={FONT}>
            STATUS_SUCCESS · SLOT HOLLOW
          </text>
        </g>

        <g className="identity-stay">
          <rect x="912" y="314" width="260" height="76" rx="10" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.75" />
          <text x="1042" y="338" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            INVARIANT PRESERVED
          </text>
          <text x="1042" y="360" textAnchor="middle" fill="#f8fafc" fontSize="12.5" fontFamily={FONT} fontWeight="700">
            svchost.exe · PID 4892
          </text>
          <text x="1042" y="378" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
            Name &amp; token untouched in EPROCESS
          </text>
        </g>

        {/* Witness Strip */}
        <g className="etw-strip">
          <rect x="28" y="408" width="1144" height="48" rx="9" fill="#2e1065" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="48" y="437" fill="#e9d5ff" fontSize="12" fontFamily={FONT} fontWeight="700">
            DEFENDER WITNESS · Kernel Memory ETW (MiUnmapViewOfSection) &amp; Sysmon EID 10 / 25: external handle unmapped primary EXE section at 0x00400000
          </text>
        </g>

        {/* Event Log */}
        <text className="clip-label" x="28" y="484" fill="#475569" fontSize="10" fontFamily={FONT} letterSpacing="0.14em">
          SYSCALL &amp; TELEMETRY TRACE
        </text>
        {[
          ['log-0', 'hProcess 0x01C4 docks into NtQueryInformationProcess — no new OpenProcess'],
          ['log-1', 'PEB+0x10 scan resolves ImageBaseAddress = 0x00400000'],
          ['log-2', 'NtUnmapViewOfSection → nt!MiUnmapViewOfSection strips PE Header, .text, .rdata, .data'],
          ['log-3', 'ntdll.dll .text (0x7FF8B4200000 · R-X) skipped and stays mapped'],
          ['log-4', 'NTSTATUS 0x00000000 returned · 0x00400000 vacant · EPROCESS remains svchost.exe'],
        ].map(([cls, text], i) => (
          <text
            key={cls}
            className={`log-line ${cls}`}
            x="28"
            y={508 + i * 23}
            fill="#cbd5e1"
            fontSize="12.5"
            fontFamily={FONT}
          >
            {`› ${text}`}
          </text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
