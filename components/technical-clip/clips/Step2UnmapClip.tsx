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
    title: 'The memory key enters the reader',
    story: 'The same key from the spawn slides into a reader aimed at the process control block.',
    technical: 'hProcess 0x01C4 is reused. No new access is requested.',
  },
  {
    id: 1,
    tag: '02',
    title: 'A beam finds the image base',
    story: 'A line of light walks the control block and stops on the row that names where the program lives.',
    technical: 'ReadProcessMemory at PEB+0x10 returns ImageBaseAddress 0x00400000.',
  },
  {
    id: 2,
    tag: '03',
    title: 'The signed pages lift out',
    story: 'A hook takes each original page up and out of the slot. The first page is slow. The others follow.',
    technical: 'NtUnmapViewOfSection(0x01C4, 0x00400000) removes the SEC_IMAGE VAD via nt!MiUnmapViewOfSection.',
  },
  {
    id: 3,
    tag: '04',
    title: 'The bolted module is skipped',
    story: 'The hook passes a module bolted to the side and does not lift it.',
    technical: 'ntdll.dll .text stays R-X. Only the EXE image is unmapped.',
  },
  {
    id: 4,
    tag: '05',
    title: 'A success stamp hits an empty slot',
    story: 'The slot outline remains. A stamp marks the call as successful. The process name never changed.',
    technical: 'NTSTATUS 0x00000000. 0x00400000 is vacant. The image name is still svchost.exe.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PEB', transform: 'scale(1.45) translate(18%, 8%)' },
  { id: 'SLOT', transform: 'scale(1.4) translate(-8%, 2%)' },
  { id: 'STAMP', transform: 'scale(1.3) translate(-12%, -8%)' },
];

export default function Step2UnmapClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    gsap.set(q('.key'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.beam'), { scaleY: 0, transformOrigin: '50% 0%', autoAlpha: 0 });
    gsap.set(q('.base'), { autoAlpha: 0 });
    gsap.set(q('.hook'), { y: 0, autoAlpha: 0 });
    gsap.set(q('.page'), { y: 0, autoAlpha: 1 });
    gsap.set(q('.skip'), { autoAlpha: 0, scale: 0.6 });
    gsap.set(q('.stamp'), { autoAlpha: 0, scale: 1.3 });
    gsap.set(q('.ghost'), { autoAlpha: 0 });
    gsap.set(q('.kernel'), { autoAlpha: 0, y: 6 });
    gsap.set(q('.name-stay'), { autoAlpha: 0 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });
    const log = (sel: string) => tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.3 }, '<');

    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.key'), { autoAlpha: 1, duration: 0.3 }, 'beat0');
    tl.to(q('.key'), { x: 175, duration: clipPace.travel }, 'beat0+=0.2');
    log('.log-0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.beam'), { autoAlpha: 1 }, 'beat1');
    tl.to(q('.beam'), { scaleY: 1, duration: clipPace.teach, ease: 'none' }, 'beat1');
    tl.to(q('.base'), { autoAlpha: 1, duration: 0.55 }, 'beat1+=1.4');
    log('.log-1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.hook'), { autoAlpha: 1, y: 22, duration: 0.7 }, 'beat2');
    tl.to(q('.page-text'), { y: -150, autoAlpha: 0, duration: 1.35 }, 'beat2+=0.55');
    tl.to(q('.ghost-text'), { autoAlpha: 0.9, duration: 0.5 }, 'beat2+=1.15');
    tl.to(q('.kernel'), { autoAlpha: 1, y: 0, duration: 0.5 }, 'beat2+=0.7');
    tl.to({}, { duration: 0.85 });
    tl.to(q('.hook'), { y: 90, duration: 0.7 });
    tl.to(q('.page-rdata'), { y: -150, autoAlpha: 0, duration: clipPace.repeat }, '<0.25');
    tl.to(q('.ghost-rdata'), { autoAlpha: 0.9, duration: 0.45 }, '<0.45');
    tl.to({}, { duration: 0.7 });
    tl.to(q('.hook'), { y: 158, duration: 0.65 });
    tl.to(q('.page-data'), { y: -150, autoAlpha: 0, duration: clipPace.repeat }, '<0.2');
    tl.to(q('.ghost-data'), { autoAlpha: 0.9, duration: 0.45 }, '<0.4');
    log('.log-2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.skip'), { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 'beat3');
    log('.log-3');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.stamp'), { autoAlpha: 1, scale: 1 }, 'beat4');
    tl.set(q('.name-stay'), { autoAlpha: 1 }, 'beat4');
    log('.log-4');
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
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Memory key reads the PEB then a hook lifts the signed pages">
        <FilmBackdrop prefix="s2" />
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          PEB READER · UNMAP HOOK
        </text>

        <rect x="250" y="52" width="280" height="230" rx="14" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
        <text x="390" y="80" textAnchor="middle" fill="#e0f2fe" fontSize="14" fontFamily={FONT} fontWeight="700">PEB</text>
        <rect className="beam" x="270" y="96" width="240" height="150" fill="#67e8f9" opacity="0.25" />
        {['+0x00', '+0x08', '+0x10 ImageBase', '+0x18'].map((row, i) => (
          <text key={row} x="270" y={120 + i * 36} fill={i === 2 ? '#fef9c3' : '#7dd3fc'} fontSize="14" fontFamily={FONT}>{row}</text>
        ))}
        <text className="base" x="390" y="258" textAnchor="middle" fill="#fef9c3" fontSize="16" fontFamily={FONT} fontWeight="700">0x00400000</text>
        <g className="key">
          <circle cx="70" cy="150" r="16" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <rect x="84" y="142" width="70" height="14" rx="3" fill="#fbbf24" />
          <text x="48" y="155" textAnchor="end" fill="#fde68a" fontSize="13" fontFamily={FONT}>0x01C4</text>
        </g>

        <rect x="570" y="52" width="360" height="300" rx="16" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <text x="750" y="78" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily={FONT}>SLOT 0x00400000</text>
        {[
          ['page-text', '.text', 'R-X · SEC_IMAGE', 100],
          ['page-rdata', '.rdata', 'R-- · SEC_IMAGE', 168],
          ['page-data', '.data', 'RW- · SEC_IMAGE', 236],
        ].map(([cls, name, prot, y]) => (
          <g key={cls} className={`page ${cls} cutaway-guts`}>
            <rect x="600" y={Number(y)} width="300" height="56" rx="8" fill="#422006" stroke="#fbbf24" />
            <text x="620" y={Number(y) + 24} fill="#fde68a" fontSize="16" fontFamily={FONT} fontWeight="700">{name}</text>
            <text x="620" y={Number(y) + 44} fill="#fcd34d" fontSize="13" fontFamily={FONT}>{prot}</text>
          </g>
        ))}
        <g className="hook">
          <path d="M742 88 h16 M750 88 v16" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        </g>
        {[
          ['ghost-text', 100],
          ['ghost-rdata', 168],
          ['ghost-data', 236],
        ].map(([cls, y]) => (
          <g key={cls} className={`ghost ${cls}`}>
            <rect x="600" y={Number(y)} width="300" height="56" rx="8" fill="none" stroke="#64748b" strokeDasharray="5 4" />
            <text x="750" y={Number(y) + 34} textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily={FONT}>vacant</text>
          </g>
        ))}
        <g className="kernel">
          <rect x="600" y="310" width="300" height="28" rx="6" fill="#1e1b4b" stroke="#a78bfa" />
          <text x="750" y="329" textAnchor="middle" fill="#ddd6fe" fontSize="12" fontFamily={FONT}>nt!MiUnmapViewOfSection</text>
        </g>

        <rect x="960" y="52" width="210" height="120" rx="12" fill="#0c4a6e" stroke="#38bdf8" />
        <text x="1065" y="88" textAnchor="middle" fill="#e0f2fe" fontSize="14" fontFamily={FONT} fontWeight="700">ntdll .text</text>
        <text x="1065" y="112" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontFamily={FONT}>R-X bolted</text>
        <g className="skip">
          <circle cx="1065" cy="146" r="12" fill="#052e16" stroke="#4ade80" />
          <path d="M1058 146 l5 5 10-12" fill="none" stroke="#4ade80" strokeWidth="2" />
        </g>

        <g className="stamp">
          <rect x="960" y="200" width="210" height="90" rx="10" fill="#052e16" stroke="#4ade80" strokeWidth="2" />
          <text x="1065" y="236" textAnchor="middle" fill="#bbf7d0" fontSize="15" fontFamily={FONT} fontWeight="700">NTSTATUS</text>
          <text x="1065" y="262" textAnchor="middle" fill="#86efac" fontSize="16" fontFamily={FONT}>0x00000000</text>
        </g>
        <g className="name-stay">
          <rect x="600" y="360" width="300" height="32" rx="6" fill="#052e16" stroke="#4ade80" />
          <text x="750" y="381" textAnchor="middle" fill="#86efac" fontSize="13" fontFamily={FONT}>name svchost.exe unchanged</text>
        </g>

        {[
          ['log-0', 'key 0x01C4 slides into the PEB reader'],
          ['log-1', 'beam stops on PEB+0x10 · 0x00400000'],
          ['log-2', 'hook lifts .text .rdata .data out'],
          ['log-3', 'ntdll .text gets a skip check'],
          ['log-4', 'stamp 0x0 · slot empty'],
        ].map(([cls, text], i) => (
          <text key={cls} className={`log-line ${cls}`} x="28" y={430 + i * 34} fill="#cbd5e1" fontSize="15" fontFamily={FONT}>{`› ${text}`}</text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
