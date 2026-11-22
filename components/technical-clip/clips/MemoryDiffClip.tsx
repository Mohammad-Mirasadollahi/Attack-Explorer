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
    title: 'Both stacks wear the same nameplate',
    story: 'Two stacks stand side by side. The nameplate on each one is identical. That is the trick.',
    technical: 'Both are svchost.exe, PID 4892, path C:\\Windows\\System32\\svchost.exe.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The disk stack fills with sealed pages',
    story: 'On the left, pages slide into the stack with split locks: code can run, and it cannot be rewritten.',
    technical: 'On-disk SEC_IMAGE: Header R--, .text R-X 0x20, .data RW- 0x04. File-backed.',
  },
  {
    id: 2,
    tag: '03',
    title: 'The live stack fills with an open lock',
    story: 'On the right, the same addresses fill with pages that can be changed and run. A program stamp pops onto the header.',
    technical: '0x00400000 is a private page starting 4D 5A. 0x00401000 is unbacked RWX 0x40, about 264 KB, entry 0x004014A0.',
  },
  {
    id: 3,
    tag: '04',
    title: 'A slit marks only the swapped pages',
    story: 'A blade of light crosses both stacks. Dots appear on the live pages that disagree. The side module gets a check, not a dot.',
    technical: 'PE-sieve compares backing and protection. ntdll.dll .text at 0x7FF8B4200000 stays R-X.',
  },
  {
    id: 4,
    tag: '05',
    title: 'The replaced-image stamp lands',
    story: 'The nameplates never changed. The stamp still says the running image was replaced.',
    technical: 'Sysmon EID 25: "Image is replaced".',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DISK', transform: 'scale(1.4) translate(18%, 6%)' },
  { id: 'RAM', transform: 'scale(1.4) translate(-16%, 6%)' },
  { id: 'SLIT', transform: 'scale(1.2) translate(0%, -4%)' },
];

const DISK = [
  ['Header', 'R--'],
  ['.text', 'R-X 0x20'],
  ['.data', 'RW- 0x04'],
];
const RAM = [
  ['0x00400000', 'MZ 4D 5A'],
  ['0x00401000', 'RWX 0x40'],
  ['entry', '0x004014A0'],
];

export default function MemoryDiffClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    gsap.set(q('.plate'), { autoAlpha: 0.35 });
    gsap.set(q('.disk-page'), { autoAlpha: 0, y: 16 });
    gsap.set(q('.ram-page'), { autoAlpha: 0, y: 16 });
    gsap.set(q('.mz'), { autoAlpha: 0, scale: 0.6 });
    gsap.set(q('.slit'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.dot'), { autoAlpha: 0, scale: 0.4 });
    gsap.set(q('.clean'), { autoAlpha: 0, scale: 0.6 });
    gsap.set(q('.stamp'), { autoAlpha: 0, scale: 1.3 });
    gsap.set(q('.bridge'), { strokeDashoffset: 340 });
    gsap.set(q('.seal'), { autoAlpha: 0 });
    gsap.set(q('.openlock'), { autoAlpha: 0 });
    gsap.set(q('.size'), { autoAlpha: 0 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });
    const log = (sel: string) => tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.3 }, '<');

    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.plate'), { autoAlpha: 1, duration: 0.8 }, 'beat0');
    tl.to(q('.bridge'), { strokeDashoffset: 0, duration: clipPace.travel }, 'beat0+=0.35');
    log('.log-0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.disk-page'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.6 }, 'beat1');
    tl.to(q('.seal'), { autoAlpha: 1, duration: 0.5, stagger: 0.6 }, 'beat1+=0.35');
    log('.log-1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.ram-page'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.55 }, 'beat2');
    tl.to(q('.mz'), { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 'beat2+=1.1');
    tl.to(q('.openlock'), { autoAlpha: 1, duration: 0.45, stagger: 0.4 }, 'beat2+=0.7');
    tl.to(q('.size'), { autoAlpha: 1, duration: 0.55 }, 'beat2+=1.3');
    log('.log-2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.slit'), { autoAlpha: 1 }, 'beat3');
    tl.to(q('.slit'), { x: 820, duration: 2.4, ease: 'none' }, 'beat3');
    tl.to(q('.dot'), { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.55 }, 'beat3+=0.7');
    tl.to(q('.clean'), { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }, 'beat3+=1.8');
    log('.log-3');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.slit'), { autoAlpha: 0 }, 'beat4');
    tl.set(q('.stamp'), { autoAlpha: 1, scale: 1 }, 'beat4');
    log('.log-4');
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
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Two page stacks with the same nameplate, a scan slit, and a replaced-image stamp">
        <FilmBackdrop prefix="mem" />
        <text className="clip-label" x="28" y="26" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          TWO STACKS · SAME NAMEPLATE
        </text>

        <g className="plate">
          <rect x="150" y="44" width="280" height="28" rx="6" fill="#fef3c7" />
          <rect x="770" y="44" width="280" height="28" rx="6" fill="#fef3c7" />
          <text x="290" y="64" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily={FONT} fontWeight="700">svchost.exe · 4892</text>
          <text x="910" y="64" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily={FONT} fontWeight="700">svchost.exe · 4892</text>
        </g>
        <path className="bridge" d="M430 58 H770" fill="none" stroke="#fde68a" strokeWidth="2" strokeDasharray="340" />

        <rect x="40" y="88" width="520" height="280" rx="14" fill="#0c1222" stroke="#38bdf8" strokeWidth="2" />
        <text x="300" y="114" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontFamily={FONT} fontWeight="700">ON DISK · SEC_IMAGE</text>
        {DISK.map((row, i) => (
          <g key={row[0]} className="disk-page cutaway-guts">
            <rect x="70" y={136 + i * 70} width="460" height="56" rx="8" fill="#082f49" stroke="#38bdf8" />
            <text x="90" y={170 + i * 70} fill="#e0f2fe" fontSize="16" fontFamily={FONT}>{row[0]}</text>
            <text x="280" y={170 + i * 70} fill="#7dd3fc" fontSize="16" fontFamily={FONT}>{row[1]}</text>
            <g className="seal" transform={`translate(490 ${158 + i * 70})`}>
              <path d="M6 10 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#7dd3fc" strokeWidth="2" />
              <rect x="2" y="10" width="20" height="14" rx="2" fill="#082f49" stroke="#7dd3fc" />
            </g>
          </g>
        ))}

        <rect x="640" y="88" width="520" height="280" rx="14" fill="#1a0a12" stroke="#fb7185" strokeWidth="2" />
        <text x="900" y="114" textAnchor="middle" fill="#fda4af" fontSize="14" fontFamily={FONT} fontWeight="700">LIVE RAM · PRIVATE</text>
        {RAM.map((row, i) => (
          <g key={row[0]} className="ram-page cutaway-guts">
            <rect x="670" y={136 + i * 70} width="420" height="56" rx="8" fill="#4c0519" stroke="#fb7185" />
            <text x="690" y={170 + i * 70} fill="#ffe4e6" fontSize="16" fontFamily={FONT}>{row[0]}</text>
            <text x="900" y={170 + i * 70} fill="#fda4af" fontSize="16" fontFamily={FONT}>{row[1]}</text>
            <circle className="dot" cx="1110" cy={164 + i * 70} r="8" fill="#fecdd3" />
            <g className="openlock" transform={`translate(1048 ${156 + i * 70})`}>
              <path d="M16 8 a6 6 0 0 1 8 6" fill="none" stroke="#fda4af" strokeWidth="2" />
              <rect x="2" y="12" width="20" height="14" rx="2" fill="#4c0519" stroke="#fda4af" />
            </g>
          </g>
        ))}
        <g className="size">
          <rect x="860" y="208" width="92" height="18" rx="4" fill="#451a03" stroke="#fbbf24" />
          <text x="906" y="221" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>≈ 264 KB</text>
        </g>
        <g className="mz">
          <rect x="980" y="140" width="70" height="24" rx="4" fill="#fbbf24" />
          <text x="1015" y="157" textAnchor="middle" fill="#451a03" fontSize="12" fontFamily={FONT} fontWeight="700">MZ</text>
        </g>

        <rect className="slit" x="60" y="128" width="8" height="220" fill="#fde68a" />

        <rect x="40" y="384" width="620" height="48" rx="8" fill="#0c4a6e" stroke="#38bdf8" />
        <text x="60" y="414" fill="#e0f2fe" fontSize="14" fontFamily={FONT}>ntdll.dll .text · 0x7FF8B4200000 · R-X</text>
        <g className="clean">
          <circle cx="700" cy="408" r="14" fill="#052e16" stroke="#4ade80" />
          <path d="M692 408 l5 5 12-14" fill="none" stroke="#4ade80" strokeWidth="2" />
        </g>

        <g className="stamp">
          <rect x="760" y="384" width="400" height="48" rx="8" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <text x="960" y="414" textAnchor="middle" fill="#fde68a" fontSize="16" fontFamily={FONT} fontWeight="700">EID 25 · image replaced</text>
        </g>

        {[
          ['log-0', 'both nameplates read svchost.exe PID 4892'],
          ['log-1', 'disk pages slide in · R-X 0x20 / RW- 0x04'],
          ['log-2', 'live pages slide in · MZ pops on the header'],
          ['log-3', 'slit crosses · dots on live pages · ntdll check'],
          ['log-4', 'stamp lands · nameplates unchanged'],
        ].map(([cls, text], i) => (
          <text key={cls} className={`log-line ${cls}`} x="40" y={460 + i * 30} fill="#cbd5e1" fontSize="14" fontFamily={FONT}>{`› ${text}`}</text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
