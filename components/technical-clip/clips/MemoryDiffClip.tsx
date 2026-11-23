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
    title: 'Both views carry the exact same trusted identity plate',
    story:
      'Side by side, the original signed file on disk and the live running process display the exact same system name, path, and identifier.',
    technical:
      'Identity match: C:\\Windows\\System32\\svchost.exe · PID 4892. Exterior process metadata never changed.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The signed on-disk image enforces strict split memory locks',
    story:
      'On the left, the legitimate file maps sealed sections backed by disk: readable headers, run-only code that cannot be edited, and writable data that cannot run.',
    technical:
      'On-disk SEC_IMAGE (file-backed): 0x00400000 Header (R-- 0x02), 0x00401000 .text (R-X 0x20), 0x00443000 .data (RW- 0x04).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Live process memory at the same addresses holds unbacked writable-executable code',
    story:
      'On the right, those same memory addresses hold unbacked private pages with unlocked protections, raw executable header bytes, and the injected payload entry point.',
    technical:
      'Live MEM_PRIVATE: 0x00400000 MZ 4D 5A 90 00 (4 KB RW-), 0x00401000 Beacon .text (264 KB RWX 0x40 · FC 48 83 E4), Entry RCX = 0x004014A0.',
  },
  {
    id: 3,
    tag: '04',
    title: 'A forensic sweep flags every swapped page while verifying ntdll stays clean',
    story:
      'A comparison beam sweeps across both columns, marking every address where live memory disagrees with the disk image, while the core bridge module passes cleanly.',
    technical:
      'PE-Sieve & Volatility malfind flag unbacked MEM_PRIVATE RWX mismatch across 0x00400000–0x00442FFF; ntdll.dll .text @ 0x7FF8B4200000 (1,920 KB R-X) stays clean.',
  },
  {
    id: 4,
    tag: '05',
    title: 'Kernel tampering verdict confirms the running image was replaced',
    story:
      'Even though the nameplates at the top never changed, the side-by-side proof triggers the replaced-image verdict.',
    technical:
      'Sysmon EID 25 (ProcessTampering · Type: "Image is replaced") — same PID & path, hollowed primary executable VAD.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DISK', transform: 'scale(1.38) translate(16%, 6%)' },
  { id: 'RAM', transform: 'scale(1.38) translate(-16%, 6%)' },
  { id: 'DIFF', transform: 'scale(1.24) translate(0%, -4%)' },
];

const DISK_ROWS = [
  {
    addr: '0x00400000',
    section: 'PE Header (Signed MS)',
    perm: 'R-- (0x02) · SEC_IMAGE',
    y: 138,
  },
  {
    addr: '0x00401000',
    section: '.text (Signed Code)',
    perm: 'R-X (0x20) · Non-Writable',
    y: 206,
  },
  {
    addr: '0x00443000',
    section: '.data (Signed Vars)',
    perm: 'RW- (0x04) · Non-Executable',
    y: 274,
  },
] as const;

const RAM_ROWS = [
  {
    addr: '0x00400000',
    section: 'PE Header (4 KB · Injected)',
    detail: 'MZ 4D 5A 90 00 · RW- · Unbacked',
    diffTag: 'UNBACKED',
    y: 138,
  },
  {
    addr: '0x00401000',
    section: '.text Beacon (264 KB)',
    detail: 'RWX (0x40) · FC 48 83 E4',
    diffTag: 'RWX 0x40',
    y: 206,
  },
  {
    addr: '0x004014A0',
    section: 'EntryPoint (Patched RCX)',
    detail: 'Beacon Start · MEM_PRIVATE',
    diffTag: 'HIJACKED',
    y: 274,
  },
] as const;

export default function MemoryDiffClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    gsap.set(q('.id-plate'), { autoAlpha: 0.4 });
    gsap.set(q('.id-bridge'), { strokeDashoffset: 260 });
    gsap.set(q('.id-match-pill'), { autoAlpha: 0, scale: 0.8, transformOrigin: '50% 50%' });
    gsap.set(q('.disk-row'), { autoAlpha: 0, x: -16 });
    gsap.set(q('.disk-lock'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
    gsap.set(q('.ram-row'), { autoAlpha: 0, x: 16 });
    gsap.set(q('.ram-unlock'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
    gsap.set(q('.scan-beam'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.diff-node'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' });
    gsap.set(q('.diff-tag'), { autoAlpha: 0, scale: 0.75, transformOrigin: '50% 50%' });
    gsap.set(q('.ntdll-clean'), { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 50%' });
    gsap.set(q('.verdict-stamp'), { autoAlpha: 0, scale: 1.3, transformOrigin: '50% 50%' });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });

    const log = (sel: string, at: string | number) =>
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.35 }, at);

    // Beat 0: Both nameplates light up and connect via equality bridge
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.id-plate'), { autoAlpha: 1, duration: 0.65 }, 'beat0');
    tl.to(q('.id-bridge'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0+=0.2');
    tl.to(q('.id-match-pill'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 'beat0+=0.85');
    log('.log-0', 'beat0+=0.9');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: On-disk SEC_IMAGE rows slide in with sealed padlocks
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.disk-row-0'), { autoAlpha: 1, x: 0 }, 'beat1');
    tl.to(q('.disk-row-1, .disk-row-2'), { autoAlpha: 1, x: 0, duration: 0.65, stagger: 0.55 }, 'beat1+=0.35');
    tl.to(q('.disk-lock'), { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.45, ease: 'back.out(1.6)' }, 'beat1+=0.3');
    log('.log-1', 'beat1+=1.3');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: Live MEM_PRIVATE rows slide in with unlocked shackles & hex previews
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.set(q('.ram-row-0'), { autoAlpha: 1, x: 0 }, 'beat2');
    tl.to(q('.ram-row-1, .ram-row-2'), { autoAlpha: 1, x: 0, duration: 0.65, stagger: 0.55 }, 'beat2+=0.35');
    tl.to(q('.ram-unlock'), { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.45, ease: 'back.out(1.6)' }, 'beat2+=0.35');
    log('.log-2', 'beat2+=1.3');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: Full-width PE-Sieve / Volatility malfind sweep flags every mismatch & verifies ntdll clean
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.scan-beam'), { autoAlpha: 1, x: 0 }, 'beat3');
    tl.to(q('.scan-beam'), { x: 1104, duration: 2.35, ease: 'none' }, 'beat3');
    tl.to(
      q('.ram-row rect:first-of-type'),
      { stroke: '#fbbf24', strokeWidth: 2.5, duration: 0.35, stagger: 0.3, yoyo: true, repeat: 1 },
      'beat3+=1.05'
    );
    tl.to(q('.diff-node'), { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.35, ease: 'back.out(1.8)' }, 'beat3+=0.85');
    tl.to(q('.diff-tag'), { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.35, ease: 'back.out(1.5)' }, 'beat3+=1.2');
    tl.to(q('.ntdll-clean'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, 'beat3+=1.95');
    tl.to(q('.scan-beam'), { autoAlpha: 0, duration: 0.3 }, 'beat3+=2.35');
    log('.log-3', 'beat3+=1.6');
    tl.to({}, { duration: clipPace.hold });

    // Beat 4: Final Sysmon EID 25 verdict slams in while nameplates remain identical
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.verdict-stamp'), { autoAlpha: 1 }, 'beat4');
    tl.to(q('.verdict-stamp'), { scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, 'beat4');
    log('.log-4', 'beat4+=0.45');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-memory"
      stageLabel="MEMORY"
      mitreId="T1055.012"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Side-by-side comparison of signed on-disk svchost.exe SEC_IMAGE versus live unbacked MEM_PRIVATE Cobalt Strike Beacon RAM, swept by PE-Sieve and flagged by Sysmon EID 25 while ntdll.dll stays clean"
      >
        <FilmBackdrop prefix="mem" />
        <defs>
          <linearGradient id="mem-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="55%" stopColor="#fde68a" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Header */}
        <text className="clip-label" x="28" y="26" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} letterSpacing="0.14em">
          MEMORY FORENSICS · SIGNED ON-DISK SEC_IMAGE VS LIVE HOLLOWED RAM
        </text>
        <text x="1172" y="26" textAnchor="end" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
          PE-Sieve · Volatility malfind · Sysmon EID 25
        </text>

        {/* Top Identical Nameplates */}
        <g className="id-plate">
          <rect x="40" y="40" width="410" height="34" rx="7" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="245" y="62" textAnchor="middle" fill="#0f172a" fontSize="12" fontFamily={FONT} fontWeight="700">
            C:\Windows\System32\svchost.exe · PID 4892
          </text>
          <rect x="750" y="40" width="410" height="34" rx="7" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="955" y="62" textAnchor="middle" fill="#0f172a" fontSize="12" fontFamily={FONT} fontWeight="700">
            C:\Windows\System32\svchost.exe · PID 4892
          </text>
        </g>

        <path className="id-bridge" d="M 450 57 H 750" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeDasharray="260" />
        <g className="id-match-pill">
          <rect x="518" y="43" width="164" height="28" rx="6" fill="#291a04" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="600" y="61" textAnchor="middle" fill="#fef3c7" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            IDENTICAL PATH &amp; PID
          </text>
        </g>

        {/* Left Column: On-Disk SEC_IMAGE */}
        <rect x="40" y="90" width="520" height="262" rx="12" fill="#091525" stroke="#38bdf8" strokeWidth="2" />
        <rect x="40" y="90" width="520" height="32" rx="12" fill="#0c4a6e" />
        <text x="300" y="111" textAnchor="middle" fill="#e0f2fe" fontSize="12" fontFamily={FONT} fontWeight="700">
          ON DISK · FILE-BACKED SEC_IMAGE (SIGNED)
        </text>

        {DISK_ROWS.map((row, idx) => (
          <g key={row.addr} className={`disk-row disk-row-${idx} cutaway-guts`}>
            <rect x="60" y={row.y} width="480" height="56" rx="8" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="76" y={row.y + 23} fill="#7dd3fc" fontSize="12" fontFamily={FONT} fontWeight="700">
              {row.addr}
            </text>
            <text x="174" y={row.y + 23} fill="#f0f9ff" fontSize="13" fontFamily={FONT} fontWeight="700">
              {row.section}
            </text>
            <text x="76" y={row.y + 44} fill="#bae6fd" fontSize="11.5" fontFamily={FONT}>
              {row.perm}
            </text>
            <g transform={`translate(502 ${row.y + 15})`}>
              <g className="disk-lock">
                <path d="M 6 11 v -4 a 6 6 0 0 1 12 0 v 4" fill="none" stroke="#4ade80" strokeWidth="2.2" />
                <rect x="2" y="11" width="20" height="14" rx="2.5" fill="#052e16" stroke="#4ade80" strokeWidth="1.5" />
              </g>
            </g>
          </g>
        ))}

        {/* Center Diff Connector Nodes */}
        {[166, 234, 302].map((cy, idx) => (
          <g key={cy} className="diff-node">
            <line x1="560" y1={cy} x2="640" y2={cy} stroke="#fb7185" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="600" cy={cy} r="15" fill="#7f1d1d" stroke="#fb7185" strokeWidth="2" filter="url(#mem-soft-glow)" />
            <text x="600" y={cy + 6} textAnchor="middle" fill="#ffe4e6" fontSize="16" fontFamily={FONT} fontWeight="700">
              {idx === 2 ? '!' : '≠'}
            </text>
          </g>
        ))}

        {/* Right Column: Live Hollowed RAM */}
        <rect x="640" y="90" width="520" height="262" rx="12" fill="#1b0a12" stroke="#fb7185" strokeWidth="2" />
        <rect x="640" y="90" width="520" height="32" rx="12" fill="#881337" />
        <text x="900" y="111" textAnchor="middle" fill="#ffe4e6" fontSize="12" fontFamily={FONT} fontWeight="700">
          LIVE RAM · UNBACKED MEM_PRIVATE (HOLLOWED)
        </text>

        {RAM_ROWS.map((row, idx) => (
          <g key={row.addr} className={`ram-row ram-row-${idx} cutaway-guts`}>
            <rect x="660" y={row.y} width="480" height="56" rx="8" fill="#450a1b" stroke="#fb7185" strokeWidth="1.5" />
            <text x="676" y={row.y + 23} fill="#fda4af" fontSize="12" fontFamily={FONT} fontWeight="700">
              {row.addr}
            </text>
            <text x="774" y={row.y + 23} fill="#fff1f2" fontSize="13" fontFamily={FONT} fontWeight="700">
              {row.section}
            </text>
            <text x="676" y={row.y + 44} fill="#fde68a" fontSize="11.5" fontFamily={FONT}>
              {row.detail}
            </text>

            {/* Unlocked Crimson Shackle */}
            <g transform={`translate(1018 ${row.y + 15})`}>
              <g className="ram-unlock">
                <path d="M 14 9 a 6 6 0 0 1 9 4" fill="none" stroke="#fb7185" strokeWidth="2.2" />
                <rect x="2" y="11" width="20" height="14" rx="2.5" fill="#7f1d1d" stroke="#fb7185" strokeWidth="1.5" />
              </g>
            </g>

            {/* Mismatch Verdict Pill per Row (zero overlap!) */}
            <g className="diff-tag">
              <rect x="1052" y={row.y + 15} width="78" height="26" rx="5" fill="#fbbf24" />
              <text x="1091" y={row.y + 32} textAnchor="middle" fill="#451a03" fontSize="10" fontFamily={FONT} fontWeight="700">
                {row.diffTag}
              </text>
            </g>
          </g>
        ))}

        {/* Full-Width Forensic X-Ray Scan Beam */}
        <g className="scan-beam">
          <rect x="34" y="124" width="28" height="222" fill="url(#mem-beam-grad)" />
          <line x1="60" y1="124" x2="60" y2="346" stroke="#fef9c3" strokeWidth="3" filter="url(#mem-soft-glow)" />
        </g>

        {/* Bottom Control Module (ntdll.dll) + Final EID 25 Verdict */}
        <rect x="40" y="368" width="632" height="62" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.75" />
        <text x="60" y="393" fill="#e0f2fe" fontSize="12.5" fontFamily={FONT} fontWeight="700">
          CONTROL MODULE · ntdll.dll .text @ 0x7FF8B4200000
        </text>
        <text x="60" y="415" fill="#7dd3fc" fontSize="11.5" fontFamily={FONT}>
          1,920 KB · R-X (0x20) · File-Backed SEC_IMAGE · Unmodified
        </text>
        <g className="ntdll-clean">
          <rect x="546" y="381" width="110" height="36" rx="7" fill="#052e16" stroke="#4ade80" strokeWidth="1.75" />
          <path d="M 560 399 l 5 5 l 9 -11" fill="none" stroke="#4ade80" strokeWidth="2.2" />
          <text x="582" y="403" fill="#bbf7d0" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            CLEAN
          </text>
        </g>

        <g className="verdict-stamp">
          <rect x="692" y="368" width="468" height="62" rx="10" fill="#451a03" stroke="#fbbf24" strokeWidth="2.5" filter="url(#mem-soft-glow)" />
          <text x="926" y="394" textAnchor="middle" fill="#fef3c7" fontSize="15.5" fontFamily={FONT} fontWeight="700">
            SYSMON EID 25 · Image is replaced
          </text>
          <text x="926" y="415" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily={FONT}>
            Same svchost.exe nameplate · Hollowed MEM_PRIVATE VAD
          </text>
        </g>

        {/* Event Log */}
        <text className="clip-label" x="40" y="458" fill="#475569" fontSize="10" fontFamily={FONT} letterSpacing="0.14em">
          MEMORY DIFF &amp; DETECTION TRACE
        </text>
        {[
          ['log-0', 'Nameplates match 100%: C:\\Windows\\System32\\svchost.exe · PID 4892'],
          ['log-1', 'On-disk SEC_IMAGE enforces split locks: Header R--, .text R-X (0x20), .data RW- (0x04)'],
          ['log-2', 'Live RAM holds unbacked MEM_PRIVATE: 4D 5A header (4 KB) + Beacon .text (264 KB RWX 0x40)'],
          ['log-3', 'PE-Sieve / malfind sweep flags all hollowed EXE pages · ntdll.dll (0x7FF8B4200000) clean'],
          ['log-4', 'Sysmon EID 25 verdict: ProcessTampering ("Image is replaced") despite unchanged path'],
        ].map(([cls, text], i) => (
          <text
            key={cls}
            className={`log-line ${cls}`}
            x="40"
            y={482 + i * 26}
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
