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
    title: 'The hollowed base slot stands vacant at the original address',
    story:
      'The signed sections from the previous step have vanished, leaving an empty frame at the exact starting slot while the process keeps its trusted name.',
    technical:
      'Slot 0x00400000 inside svchost.exe (PID 4892) is empty after NtUnmapViewOfSection — ready to reuse without pointer relocation.',
  },
  {
    id: 1,
    tag: '02',
    title: 'VirtualAllocEx carves out private writable-executable memory',
    story:
      'The loader plugs its memory key into the allocator. The protection dial turns past safe split settings and locks onto a combined write-and-run permission.',
    technical:
      'VirtualAllocEx(hProcess = 0x01C4, 0x00400000, 264 KB, MEM_PRIVATE, PAGE_EXECUTE_READWRITE 0x40) via NtAllocateVirtualMemory.',
  },
  {
    id: 2,
    tag: '03',
    title: 'WriteProcessMemory streams the header and code through the write gate',
    story:
      'Each payload block travels through the cross-process write gate, passes under the inspection beam, and fills its target shelf while the byte gauge climbs.',
    technical:
      'WriteProcessMemory (NtWriteVirtualMemory) copies MZ/PE header (4D 5A 90 00, 4 KB) then Beacon .text shellcode (FC 48 83 E4...) into 0x00400000.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Remaining sections commit all 270,336 bytes and stage the entry point',
    story:
      'The read-only imports and configuration blocks lock into the final shelves, completing the transfer and lighting the exact starting point for execution.',
    technical:
      'lpNumberOfBytesWritten = 270,336 B (MZ + .text + .rdata + .data). AddressOfEntryPoint staged at 0x004014A0 (Base + RVA 0x14A0).',
  },
  {
    id: 4,
    tag: '05',
    title: 'Kernel memory sensors fire while the core bridge stays clean',
    story:
      'Three defender sensors light up on the unbacked executable memory and full-access handle, while the side system library checks out completely clean.',
    technical:
      'Sysmon EID 10 (GrantedAccess 0x1FFFFF), EtwTiLogAllocVMRemote (RWX 0x40), and unbacked MZ @ 0x00400000 fire; ntdll.dll .text stays R-X.',
  },
  {
    id: 5,
    tag: '06',
    title: 'Trusted path on the outside, unbacked Beacon payload inside',
    story:
      'No malicious file ever touched the hard drive, and the process still displays its signed system path—yet its base memory now holds the injected implant.',
    technical:
      'EPROCESS path remains C:\\Windows\\System32\\svchost.exe while 0x00400000 holds unbacked MEM_PRIVATE Cobalt Strike Beacon (RWX 0x40).',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'ALLOC', transform: 'scale(1.42) translate(16%, 8%)' },
  { id: 'GATE', transform: 'scale(1.4) translate(-2%, 8%)' },
  { id: 'VAULT', transform: 'scale(1.38) translate(-18%, 6%)' },
];

const PAGES = [
  {
    id: 'mz',
    label: 'MZ 4D 5A',
    cellLabel: '0x00400000 · PE Header',
    hex: '4D 5A 90 00 · 4 KB',
    tone: '#fde68a',
    bytesLabel: '4,096 B',
    cellY: 102,
  },
  {
    id: 'text',
    label: '.text',
    cellLabel: '0x00401000 · Beacon .text',
    hex: 'FC 48 83 E4 · 176 KB',
    tone: '#fda4af',
    bytesLabel: '180,224 B',
    cellY: 152,
  },
  {
    id: 'rdata',
    label: '.rdata',
    cellLabel: '0x0042D000 · .rdata',
    hex: 'Imports · 44 KB',
    tone: '#c4b5fd',
    bytesLabel: '225,280 B',
    cellY: 202,
  },
  {
    id: 'data',
    label: '.data',
    cellLabel: '0x00438000 · .data',
    hex: 'C2 Config · 44 KB',
    tone: '#93c5fd',
    bytesLabel: '270,336 B',
    cellY: 252,
  },
] as const;

export default function Step3AllocInjectClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    gsap.set(q('.ghost-page'), { autoAlpha: 1, y: 0 });
    gsap.set(q('.vacant-badge'), { autoAlpha: 0 });
    gsap.set(q('.key-token'), { x: -64, autoAlpha: 0 });
    gsap.set(q('.dial-needle'), { rotate: -65, svgOrigin: '366 174' });
    gsap.set(q('.status-alloc'), { autoAlpha: 0 });
    gsap.set(q('.status-alloc.standby'), { autoAlpha: 1 });
    gsap.set(q('.rwx-badge'), { autoAlpha: 0, scale: 0.8, transformOrigin: '50% 50%' });
    gsap.set(q('.pipe-flow'), { strokeDashoffset: 320 });
    gsap.set(q('.status-write'), { autoAlpha: 0 });
    gsap.set(q('.status-write.standby'), { autoAlpha: 1 });
    gsap.set(q('.scan-beam'), { scaleY: 0, transformOrigin: '50% 0%', autoAlpha: 0 });
    gsap.set(q('.crate'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.cell-fill'), { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(q('.cell-hex'), { autoAlpha: 0 });
    gsap.set(q('.bytes-val'), { autoAlpha: 0 });
    gsap.set(q('.bytes-0'), { autoAlpha: 1 });
    gsap.set(q('.ep-pin'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.radar-card'), { autoAlpha: 0, y: 12, scale: 0.94, transformOrigin: '50% 50%' });
    gsap.set(q('.ntdll-check'), { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 50%' });
    gsap.set(q('.path-stamp'), { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });

    const log = (sel: string, at: string | number) =>
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.35 }, at);

    // Beat 0: Residual SEC_IMAGE ghost dissolves -> vacant slot confirmed
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.ghost-page'), { autoAlpha: 0.12, y: 6, duration: 0.65, stagger: 0.16 }, 'beat0+=0.1');
    tl.to(q('.vacant-badge'), { autoAlpha: 1, duration: 0.5 }, 'beat0+=0.85');
    log('.log-0', 'beat0+=0.9');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: hProcess 0x01C4 docks -> VirtualAllocEx dial sweeps to RWX 0x40 -> pipe energizes
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.key-token'), { autoAlpha: 1 }, 'beat1');
    tl.to(q('.key-token'), { x: 0, duration: clipPace.travel, ease: 'power2.out' }, 'beat1');
    tl.to(q('.status-alloc.standby'), { autoAlpha: 0, duration: 0.15 }, 'beat1+=0.45');
    tl.to(q('.status-alloc.allocating'), { autoAlpha: 1, duration: 0.2 }, 'beat1+=0.55');
    tl.to(q('.dial-needle'), { rotate: 64, duration: clipPace.teach, ease: 'power2.inOut' }, 'beat1+=0.6');
    tl.to(q('.status-alloc.allocating'), { autoAlpha: 0, duration: 0.18 }, 'beat1+=2.35');
    tl.to(q('.status-alloc.armed'), { autoAlpha: 1, duration: 0.25 }, 'beat1+=2.45');
    tl.to(q('.rwx-badge'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, 'beat1+=2.4');
    tl.to(q('.pipe-flow'), { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 'beat1+=1.9');
    log('.log-1', 'beat1+=2.55');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2 & 3: Four PE sections travel directly through WriteProcessMemory gate & fill vault
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');

    const paceRows = [
      { travelIn: 0.75, scan: clipPace.teach, travelOut: 0.65, cell: 0.95, hold: clipPace.hold },
      { travelIn: 0.6, scan: clipPace.repeat, travelOut: 0.55, cell: 0.8, hold: 0.85 },
      { travelIn: 0.55, scan: clipPace.repeat, travelOut: 0.5, cell: 0.75, hold: 0.8 },
      { travelIn: 0.5, scan: clipPace.repeat, travelOut: 0.5, cell: 0.75, hold: 0.85 },
    ];

    PAGES.forEach((page, idx) => {
      const pace = paceRows[idx];
      const start = idx === 0 ? 'beat2' : '>';
      if (idx === 2) {
        tl.addLabel('beat3');
        tl.call(() => setBeat(3), [], 'beat3');
      }

      // Packet appears at gate entrance & travels straight into Write Gate scan chamber
      tl.set(q(`.crate-${page.id}`), { autoAlpha: 1, x: 0 }, start);
      tl.to(q('.status-write.standby'), { autoAlpha: 0, duration: 0.1 }, '<');
      tl.to(q('.status-write.writing'), { autoAlpha: 1, duration: 0.12 }, '<');
      tl.to(q(`.crate-${page.id}`), { x: 118, duration: pace.travelIn, ease: 'power2.out' }, '<');

      // Laser scan sweeps directly over the packet inside Write Gate
      tl.set(q('.scan-beam'), { autoAlpha: 1, scaleY: 0 });
      tl.to(q('.scan-beam'), { scaleY: 1, duration: pace.scan, ease: 'none' });
      tl.to(q('.scan-beam'), { autoAlpha: 0, duration: 0.14 });

      // Packet exits gate into Vault & fills its shelf
      tl.to(q(`.crate-${page.id}`), { x: 248, duration: pace.travelOut, ease: 'power2.in' }, '<');
      tl.to(q(`.crate-${page.id}`), { autoAlpha: 0, duration: 0.14 });
      tl.to(q(`.cell-${page.id}`), { scaleX: 1, duration: pace.cell, ease: 'power2.out' }, '<');
      tl.to(q(`.hex-${page.id}`), { autoAlpha: 1, duration: 0.35 }, '<0.25');

      // Deterministic byte counter swap (scrub-safe in both directions!)
      tl.to(q(`.bytes-${idx}`), { autoAlpha: 0, duration: 0.12 }, '<');
      tl.to(q(`.bytes-${idx + 1}`), { autoAlpha: 1, duration: 0.2 }, '<');

      if (idx === 0) log('.log-2', '<');
      tl.to({}, { duration: pace.hold });
    });

    tl.to(q('.status-write.writing'), { autoAlpha: 0, duration: 0.15 });
    tl.to(q('.status-write.committed'), { autoAlpha: 1, duration: 0.25 });
    tl.to(q('.ep-pin'), { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' });
    log('.log-3', '<0.1');
    tl.to({}, { duration: clipPace.hold });

    // Beat 4: Sysmon EID 10 + ETW + Unbacked MZ radar alerts, ntdll stays R-X clean
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.radar-0'), { autoAlpha: 1, y: 0, scale: 1 }, 'beat4');
    tl.to(
      q('.radar-1, .radar-2'),
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.55, ease: 'back.out(1.4)' },
      'beat4+=0.35'
    );
    tl.to(q('.ntdll-check'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, 'beat4+=1.2');
    log('.log-4', 'beat4+=0.6');
    tl.to({}, { duration: clipPace.hold });

    // Beat 5: Path invariant confirmed beside unbacked Beacon vault
    tl.addLabel('beat5');
    tl.call(() => setBeat(5), [], 'beat5');
    tl.set(q('.path-stamp'), { autoAlpha: 1 }, 'beat5');
    tl.to(q('.path-stamp'), { scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 'beat5');
    log('.log-5', 'beat5+=0.3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-step3"
      stageLabel="STEP #3"
      mitreId="T1055.012"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="VirtualAllocEx allocates 264 KB private RWX 0x40 at 0x00400000, WriteProcessMemory streams 270,336 bytes of Cobalt Strike Beacon sections into svchost.exe, triggering Sysmon EID 10 and ETW while ntdll stays R-X"
      >
        <FilmBackdrop prefix="s3" />

        {/* Header */}
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} letterSpacing="0.14em">
          VirtualAllocEx (0x40 RWX) → WriteProcessMemory (270,336 B)
        </text>
        <text x="1172" y="28" textAnchor="end" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
          Target: svchost.exe · PID 4892 @ 0x00400000
        </text>

        {/* Station 1: Hollowed Slot */}
        <rect x="24" y="48" width="210" height="278" rx="12" fill="#181312" stroke="#fb923c" strokeWidth="1.75" />
        <text x="129" y="72" textAnchor="middle" fill="#fdba74" fontSize="11" fontFamily={FONT} fontWeight="700">
          HOLLOWED BASE SLOT
        </text>
        <text x="129" y="92" textAnchor="middle" fill="#fed7aa" fontSize="13" fontFamily={FONT} fontWeight="700">
          0x00400000
        </text>
        {['old PE Header', 'old .text (R-X)', 'old .rdata (R--)', 'old .data (RW-)'].map((txt, i) => (
          <g key={txt} className="ghost-page">
            <rect
              x="40"
              y={108 + i * 38}
              width="178"
              height="28"
              rx="5"
              fill="none"
              stroke="#a8a29e"
              strokeDasharray="4 4"
            />
            <text x="129" y={126 + i * 38} textAnchor="middle" fill="#a8a29e" fontSize="10.5" fontFamily={FONT}>
              {txt}
            </text>
          </g>
        ))}
        <g className="vacant-badge">
          <rect x="40" y="264" width="178" height="46" rx="7" fill="#29150c" stroke="#fb923c" />
          <text x="129" y="284" textAnchor="middle" fill="#fdba74" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            VACANT · UNMAPPED
          </text>
          <text x="129" y="300" textAnchor="middle" fill="#fed7aa" fontSize="9.5" fontFamily={FONT}>
            no pointer relocation
          </text>
        </g>

        {/* Station 2: Alloc Engine */}
        <rect x="258" y="48" width="216" height="278" rx="12" fill="#17153b" stroke="#818cf8" strokeWidth="2" />
        <text x="366" y="72" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontFamily={FONT} fontWeight="700">
          VirtualAllocEx
        </text>
        <text x="366" y="88" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontFamily={FONT}>
          NtAllocateVirtualMemory
        </text>

        {/* Key Dock inside Alloc */}
        <g className="key-token">
          <rect x="274" y="96" width="184" height="26" rx="6" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="366" y="113" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            hProcess 0x01C4 (0x1FFFFF)
          </text>
        </g>

        {/* Protection Rotary Dial */}
        <circle cx="366" cy="174" r="42" fill="#090d1f" stroke="#6366f1" strokeWidth="2.2" />
        <path d="M 332 156 A 38 38 0 0 1 398 152" fill="none" stroke="#334155" strokeWidth="3.5" />
        <path d="M 392 198 A 38 38 0 0 0 404 166" fill="none" stroke="#f43f5e" strokeWidth="4.5" />
        <text x="331" y="156" fill="#64748b" fontSize="9" fontFamily={FONT}>R-X</text>
        <text x="383" y="152" fill="#64748b" fontSize="9" fontFamily={FONT}>RW-</text>
        <text x="380" y="210" fill="#fb7185" fontSize="9.5" fontFamily={FONT} fontWeight="700">RWX</text>
        <line
          className="dial-needle"
          x1="366"
          y1="174"
          x2="366"
          y2="138"
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="366" cy="174" r="4.5" fill="#f43f5e" />

        <text className="status-alloc standby" x="366" y="242" textAnchor="middle" fill="#64748b" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          STANDBY
        </text>
        <text className="status-alloc allocating" x="366" y="242" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          RESERVING 264 KB
        </text>
        <text className="status-alloc armed" x="366" y="242" textAnchor="middle" fill="#fb7185" fontSize="12" fontFamily={FONT} fontWeight="700">
          RWX (0x40) ARMED
        </text>

        <g className="rwx-badge">
          <rect x="274" y="256" width="184" height="54" rx="7" fill="#4c0519" stroke="#fb7185" strokeWidth="1.5" />
          <text x="366" y="276" textAnchor="middle" fill="#fecdd3" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            MEM_PRIVATE · UNBACKED
          </text>
          <text x="366" y="294" textAnchor="middle" fill="#fda4af" fontSize="10.5" fontFamily={FONT}>
            264 KB · 270,336 Bytes
          </text>
        </g>

        {/* Station 3: Write Gate (Transfer Rail passes directly through!) */}
        <rect x="502" y="48" width="218" height="278" rx="12" fill="#2d0917" stroke="#fb7185" strokeWidth="2" />
        <text x="611" y="72" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily={FONT} fontWeight="700">
          WriteProcessMemory
        </text>
        <text x="611" y="88" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily={FONT}>
          NtWriteVirtualMemory
        </text>

        {/* Inspection Bay Window inside Write Gate */}
        <rect x="520" y="144" width="182" height="72" rx="8" fill="#0b0f19" stroke="#9f1239" strokeWidth="1.5" />
        <text x="611" y="136" textAnchor="middle" fill="#fda4af" fontSize="9.5" fontFamily={FONT}>
          CROSS-PROCESS TRANSFER BAY
        </text>

        {/* Pipe Rail running from Alloc -> THROUGH Write Gate -> into Vault */}
        <path d="M 474 180 H 750" fill="none" stroke="#4c1d95" strokeWidth="14" opacity="0.4" />
        <path
          className="pipe-flow"
          d="M 474 180 H 750"
          fill="none"
          stroke="#c4b5fd"
          strokeWidth="2.5"
          strokeDasharray="10 8"
          markerEnd="url(#s3-arrow-rose)"
        />

        {/* Moving PE Section Crates (painted above rail, directly inside the inspection bay!) */}
        {PAGES.map((page) => (
          <g key={page.id} transform="translate(450, 162)">
            <g className={`crate crate-${page.id}`}>
              <rect width="86" height="36" rx="6" fill="#0f172a" stroke={page.tone} strokeWidth="2" filter="url(#s3-soft-glow)" />
              <text x="43" y="23" textAnchor="middle" fill={page.tone} fontSize="11.5" fontFamily={FONT} fontWeight="700">
                {page.label}
              </text>
            </g>
          </g>
        ))}

        {/* Optical Laser Scan Curtain sweeping RIGHT OVER the packet inside Write Gate */}
        <rect className="scan-beam" x="556" y="148" width="110" height="64" rx="4" fill="#fb7185" opacity="0.34" />

        {/* Write Gate Status & Scrub-Safe Deterministic Byte Counter */}
        <text className="status-write standby" x="611" y="242" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily={FONT} fontWeight="700">
          STANDBY
        </text>
        <text className="status-write writing" x="611" y="242" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT} fontWeight="700">
          STREAMING PE BYTES
        </text>
        <text className="status-write committed" x="611" y="242" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT} fontWeight="700">
          270,336 B COMMITTED
        </text>

        <rect x="526" y="256" width="170" height="54" rx="8" fill="#090d16" stroke="#fb7185" />
        <text x="611" y="274" textAnchor="middle" fill="#fda4af" fontSize="9.5" fontFamily={FONT}>
          lpNumberOfBytesWritten
        </text>
        {['0 B', ...PAGES.map((p) => p.bytesLabel)].map((val, i) => (
          <text
            key={val}
            className={`bytes-val bytes-${i}`}
            x="611"
            y="298"
            textAnchor="middle"
            fill="#ffe4e6"
            fontSize="15"
            fontFamily={FONT}
            fontWeight="700"
          >
            {val}
          </text>
        ))}

        {/* Station 4: Target RAM Vault inside svchost.exe */}
        <rect x="748" y="48" width="428" height="302" rx="12" fill="#062018" stroke="#4ade80" strokeWidth="2" />
        <text x="962" y="72" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          TARGET RAM VAULT · svchost.exe (PID 4892)
        </text>
        <text x="962" y="88" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily={FONT}>
          0x00400000 · MEM_PRIVATE · PAGE_EXECUTE_READWRITE (0x40)
        </text>

        {PAGES.map((page) => (
          <g key={page.id}>
            <rect x="766" y={page.cellY} width="392" height="40" rx="6" fill="#021f18" stroke="#166534" />
            <rect
              className={`cell-fill cell-${page.id} cutaway-guts`}
              x="766"
              y={page.cellY}
              width="392"
              height="40"
              rx="6"
              fill="#14532d"
              stroke={page.tone}
              strokeWidth="1.5"
            />
            <text x="780" y={page.cellY + 24} fill="#dcfce7" fontSize="11.5" fontFamily={FONT} fontWeight="700">
              {page.cellLabel}
            </text>
            <text
              className={`cell-hex hex-${page.id}`}
              x="1144"
              y={page.cellY + 24}
              textAnchor="end"
              fill={page.tone}
              fontSize="10.5"
              fontFamily={FONT}
              fontWeight="700"
            >
              {page.hex}
            </text>
          </g>
        ))}

        {/* Staged Entry Point & Unchanged Path Stamp */}
        <g className="ep-pin">
          <rect x="766" y="302" width="192" height="34" rx="6" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="862" y="323" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT} fontWeight="700">
            EP → 0x004014A0
          </text>
        </g>
        <g className="path-stamp">
          <rect x="968" y="302" width="190" height="34" rx="6" fill="#14532d" stroke="#fde68a" strokeWidth="1.5" />
          <text x="1063" y="323" textAnchor="middle" fill="#fef3c7" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            Path: svchost.exe
          </text>
        </g>

        {/* Bottom Control & Detection Sensors */}
        <rect x="24" y="368" width="268" height="72" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.75" />
        <text x="40" y="392" fill="#e0f2fe" fontSize="12" fontFamily={FONT} fontWeight="700">
          ntdll.dll .text (Control)
        </text>
        <text x="40" y="412" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>
          0x7FF8B4200000 · R-X · untouched
        </text>
        <text x="40" y="429" fill="#38bdf8" fontSize="9.5" fontFamily={FONT}>
          File-backed SEC_IMAGE intact
        </text>
        <g className="ntdll-check">
          <circle cx="264" cy="404" r="14" fill="#052e16" stroke="#4ade80" strokeWidth="2" />
          <path d="M 257 404 l 5 5 l 9 -11" fill="none" stroke="#4ade80" strokeWidth="2.2" />
        </g>

        {[
          { cls: 'radar-0', t: 'Sysmon EID 10', s: 'ProcessAccess · 0x1FFFFF', x: 312 },
          { cls: 'radar-1', t: 'ETW AllocVMRemote', s: '264 KB · RWX (0x40)', x: 604 },
          { cls: 'radar-2', t: 'Unbacked MZ Header', s: '4D 5A @ 0x00400000', x: 896 },
        ].map((r) => (
          <g key={r.cls} className={`radar-card ${r.cls} radar-blip`}>
            <rect x={r.x} y="368" width="280" height="72" rx="10" fill="#241447" stroke="#a78bfa" strokeWidth="1.75" />
            <circle cx={r.x + 24} cy="404" r="7" fill="#f472b6" filter="url(#s3-soft-glow)" />
            <text x={r.x + 42} y="398" fill="#f3e8ff" fontSize="12.5" fontFamily={FONT} fontWeight="700">
              {r.t}
            </text>
            <text x={r.x + 42} y="420" fill="#c4b5fd" fontSize="11" fontFamily={FONT}>
              {r.s}
            </text>
          </g>
        ))}

        {/* Event Log */}
        <text className="clip-label" x="28" y="468" fill="#475569" fontSize="10" fontFamily={FONT} letterSpacing="0.14em">
          SYSCALL &amp; TELEMETRY TRACE
        </text>
        {[
          ['log-0', 'Slot 0x00400000 confirmed empty — original SEC_IMAGE pages gone'],
          ['log-1', 'VirtualAllocEx(0x01C4, 0x00400000, 264 KB, RWX 0x40) commits MEM_PRIVATE'],
          ['log-2', 'WriteProcessMemory streams MZ (4D 5A) and Beacon .text through write gate'],
          ['log-3', 'All 270,336 bytes committed · AddressOfEntryPoint staged at 0x004014A0'],
          ['log-4', 'Sysmon EID 10 + EtwTiLogAllocVMRemote fire · ntdll.dll .text stays R-X'],
          ['log-5', 'Zero malware written to disk · path stays svchost.exe, RAM holds Beacon PE'],
        ].map(([cls, text], i) => (
          <text
            key={cls}
            className={`log-line ${cls}`}
            x="28"
            y={490 + i * 23}
            fill="#cbd5e1"
            fontSize="12"
            fontFamily={FONT}
          >
            {`› ${text}`}
          </text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
