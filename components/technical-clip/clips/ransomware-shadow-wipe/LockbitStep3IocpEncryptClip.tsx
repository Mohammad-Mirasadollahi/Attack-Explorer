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
    title: 'CreateIoCompletionPort fans out 8 asynchronous worker threads',
    story:
      'Four overhead pneumatic stamping arms launch across every filing vault simultaneously instead of locking one drawer at a time.',
    technical:
      'lb3_black.exe binds CreateIoCompletionPort across logical CPU cores to queue overlapped ReadFile/WriteFile bursts.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Intermittent head-only cipher encrypts ONLY the first 4 KB-64 KB',
    story:
      'Each stamping arm scorches just the thin top header strip crimson while leaving the lower 85 percent white paper untouched—maximizing lockdown speed.',
    technical:
      'Per-file ChaCha20 key encrypts bytes 0x0000..0xFFFF (breaking ZIP/PDF/DB headers) and appends a 256 B RSA-2048 wrapped key footer.',
  },
  {
    id: 2,
    tag: '03',
    title: 'MoveFileExW appends .lockbit across 4,820 corporate files in 11.4s',
    story:
      'Four heavy cast-iron padlocks slam shut across every vault latch in one blistering volley before anyone can pull the plug.',
    technical:
      'Finance, HR, and CAD documents rename to *.lockbit at ~420 files/sec, overwhelming manual incident response.',
  },
  {
    id: 3,
    tag: '04',
    title: 'High-entropy I/O burst triggers EDR canary & WinSec EID 4663',
    story:
      'The sudden synchronized stamp rhythm across all four vaults lights up high-speed tamper alarms on the archive board.',
    technical:
      'Automated EDR canary tripwires and WinSec EID 4663 velocity heuristics isolate FS-CORP-01 when header entropy spikes.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'IOCP POOL', transform: 'scale(1.26) translate(90px, -20px)' },
  { id: 'HEAD STRIPE', transform: 'scale(1.3) translate(-120px, -20px)' },
  { id: 'EDR BURST', transform: 'scale(1.25) translate(-20px, -115px)' },
];

export function LockbitStep3IocpEncryptClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.iocp-lane'), { strokeDasharray: 220, strokeDashoffset: 220 });
    tl.set(q('.head-encrypted, .lockbit-ext, .burst-banner'), { autoAlpha: 0 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.iocp-lane'), { strokeDashoffset: 0, stagger: 0.12, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.head-encrypted'), { autoAlpha: 1, stagger: 0.14, duration: 0.55, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.lockbit-ext'), { autoAlpha: 1, stagger: 0.12, duration: 0.45, ease: 'back.out(1.4)' }, 'beat2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.burst-banner'), { autoAlpha: 1, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  const files = [
    { y: 112, name: 'Q4_General_Ledger.xlsx', size: '48 MB' },
    { y: 204, name: 'Payroll_Master_2026.csv', size: '124 MB' },
    { y: 296, name: 'Turbine_Housing_Rev8.dwg', size: '610 MB' },
    { y: 388, name: 'ERP_Backup_Live.bak', size: '2.4 GB' },
  ];

  return (
    <AnimeClipStage
      testId="technical-clip-lockbit-step3"
      stageLabel="STEP #3"
      mitreId="T1486"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="CreateIoCompletionPort dispatches parallel workers encrypting only the first 4 KB to 64 KB header of each file and appending .lockbit"
      >
        <FilmBackdrop prefix="lb3" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          CREATEIOCOMPLETIONPORT · INTERMITTENT HEAD-ONLY ENCRYPTION (FIRST 4 KB–64 KB)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          4,820 FILES IN 11.4s · CHACHA20 + RSA-2048
        </text>

        {/* Left IOCP Dispatcher */}
        <rect x="44" y="176" width="245" height="236" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="166" y="216" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="700" fontFamily={FONT}>
          IOCP Worker Pool
        </text>
        <text x="166" y="244" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily={FONT}>
          CreateIoCompletionPort
        </text>
        <text x="166" y="274" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700" fontFamily={FONT}>
          8 Async CPU Threads
        </text>
        <rect x="66" y="300" width="200" height="84" rx="8" fill="#0f172a" stroke="#475569" />
        <text x="166" y="330" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily={FONT}>
          ChaCha20 File Key
        </text>
        <text x="166" y="356" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          Wrapped w/ RSA-2048 PubKey
        </text>

        {/* 4 Parallel File Lanes */}
        {files.map((file, i) => (
          <g key={file.name}>
            <line
              className="iocp-lane"
              x1="292"
              y1={220 + i * 48}
              x2="454"
              y2={file.y + 34}
              stroke="#f59e0b"
              strokeWidth="3.2"
            />
            {/* File container showing 15% header vs 85% untouched body */}
            <rect x="460" y={file.y} width="540" height="68" rx="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* Untouched 85% body */}
            <rect x="572" y={file.y + 8} width="338" height="52" rx="6" fill="#1e293b" stroke="#64748b" strokeDasharray="5 4" />
            <text x="741" y={file.y + 30} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily={FONT}>
              {file.name} ({file.size})
            </text>
            <text x="741" y={file.y + 50} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={FONT}>
              REMAINING 85% BODY UNTOUCHED (MAX SPEED)
            </text>

            {/* Opening 4 KB - 64 KB Header Slot */}
            <rect x="468" y={file.y + 8} width="96" height="52" rx="6" fill="#0369a1" />
            <text x="516" y={file.y + 38} textAnchor="middle" fill="#e0f2fe" fontSize="11" fontWeight="700" fontFamily={FONT}>
              0..64 KB
            </text>

            {/* Crimson Encrypted Header Overlay */}
            <g className="head-encrypted">
              <rect x="468" y={file.y + 8} width="96" height="52" rx="6" fill="#dc2626" stroke="#fca5a5" strokeWidth="2" />
              <text x="516" y={file.y + 31} textAnchor="middle" fill="#fef2f2" fontSize="11" fontWeight="700" fontFamily={FONT}>
                LOCKED
              </text>
              <text x="516" y={file.y + 49} textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily={FONT}>
                HEAD ONLY
              </text>
              {/* RSA-2048 Footer Block */}
              <rect x="918" y={file.y + 8} width="74" height="52" rx="6" fill="#7c2d12" stroke="#fbbf24" />
              <text x="955" y={file.y + 38} textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="700" fontFamily={FONT}>
                RSA KEY
              </text>
            </g>

            {/* .lockbit extension badge */}
            <g className="lockbit-ext">
              <rect x="1014" y={file.y + 12} width="140" height="44" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
              <text x="1084" y={file.y + 39} textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
                .lockbit
              </text>
            </g>
          </g>
        ))}

        {/* Velocity Detection Bar */}
        <g className="burst-banner">
          <rect x="210" y="510" width="800" height="86" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="610" y="544" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            EDR CANARY & WINSEC EID 4663: 4,820 .lockbit Header Rewrites in 11.4 Seconds
          </text>
          <text x="610" y="572" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Header-only encryption corrupts multi-GB files instantly while leaving a sharp I/O entropy burst
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
