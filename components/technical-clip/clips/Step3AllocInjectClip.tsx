'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';
import { ANIME_3D_STAGE_STANDARD } from '@/lib/section-3d-registry';
import { clipPace } from '../clipPace';
import { useCanvasPlayToggle } from '@/components/three/useCanvasPlayToggle';

/**
 * Cinematic HUD film (reference-clip language) with a denser Step #3 story:
 * ghost image dissolves, key slides in, protection dial arms RWX,
 * four PE pages travel the pipe one by one, write-gate scans each,
 * vault cells fill, byte counter climbs, detect radar pings, ntdll stays clean.
 * Zones stay fixed. Only actors move.
 */

type BeatId = 0 | 1 | 2 | 3 | 4 | 5;

const BEATS: {
  id: BeatId;
  tag: string;
  title: string;
  story: string;
  technical: string;
}[] = [
  {
    id: 0,
    tag: '01',
    title: 'The legal cargo fades',
    story:
      'The armored truck is still parked, and the bank name is still painted on the door. Inside, the real gold crates shimmer and disappear. The bay is empty.',
    technical:
      'After NtUnmap, the signed SEC_IMAGE pages at 0x00400000 are gone. The process name stays svchost.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The memory key turns the lock',
    story:
      'The thief slides the golden bay key into the lock. The dial leaves the safe “read” and “write” marks and clicks onto a setting that lets cargo be stored and driven.',
    technical:
      'hProcess 0x01C4 calls VirtualAllocEx. Protection moves to PAGE_EXECUTE_READWRITE (0x40) — private RWX.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Crates roll down the chute',
    story:
      'Four unmarked crates roll one by one along the loading chute. Each one pauses at the checkpoint so the crew can see it before it is allowed through.',
    technical:
      'WriteProcessMemory streams MZ, then .text, .rdata, and .data. The gate scans each page before commit.',
  },
  {
    id: 3,
    tag: '04',
    title: 'The bay fills, shelf by shelf',
    story:
      'Each crate drops into its own shelf. The counter on the wall climbs. A small lamp marks the shelf where the new driver will start.',
    technical:
      'Vault cells fill. bytesWritten climbs to 270336. Entry point is staged at 0x004014A0.',
  },
  {
    id: 4,
    tag: '05',
    title: 'The gate alarm notices',
    story:
      'The yard radar pings. A normal truck never carries loose cargo that can be both opened and driven. The spare toolbox in the corner is still untouched.',
    technical:
      'Sysmon EID 10 and ETW remote alloc fire. ntdll .text stays R-X. The EXE pages are the tell.',
  },
  {
    id: 5,
    tag: '06',
    title: 'Same paint, different cargo',
    story:
      'From the street the truck still looks like the bank’s. Open the back and the shelves are full of the thief’s own crates.',
    technical:
      'Path and name still say svchost.exe. The image base now holds unbacked Beacon, not the signed file.',
  },
];

const PAGES = [
  { id: 'mz', label: 'MZ', tone: '#fde68a' },
  { id: 'text', label: '.text', tone: '#fda4af' },
  { id: 'rdata', label: '.rdata', tone: '#c4b5fd' },
  { id: 'data', label: '.data', tone: '#93c5fd' },
] as const;

export default function Step3AllocInjectClip() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filmRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const bytesRef = useRef<SVGTextElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [beat, setBeat] = useState<BeatId>(0);
  const [progressPct, setProgressPct] = useState(0);
  const [dockOpen, setDockOpen] = useState(true);
  const [fullPage, setFullPage] = useState(false);
  const [speed, setSpeed] = useState<(typeof ANIME_3D_STAGE_STANDARD.speedMultipliers)[number]>(1);
  const [labelsOn, setLabelsOn] = useState(true);
  const [bloomOn, setBloomOn] = useState(true);
  const [cutaway, setCutaway] = useState<(typeof ANIME_3D_STAGE_STANDARD.cutawayModes)[number]>('AUTO');
  const [camera, setCamera] = useState<'WIDE' | 'SLOT' | 'GATE' | 'VAULT'>('WIDE');
  const speedRef = useRef(1);
  speedRef.current = speed;

  const setBytes = (n: number) => {
    if (bytesRef.current) {
      bytesRef.current.textContent = `${n.toLocaleString('en-US')} B`;
    }
  };

  const buildTimeline = useCallback(() => {
    const root = rootRef.current;
    if (!root) return null;
    const q = gsap.utils.selector(root);
    setBytes(0);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onUpdate: () =>
        setProgressPct(Math.min(100, Math.round(tl.progress() * 100))),
    });

    gsap.set(q('.ghost-page'), { autoAlpha: 1, y: 0 });
    gsap.set(q('.key-token'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.dial-needle'), { rotate: -70, svgOrigin: '390 168' });
    gsap.set(q('.status-alloc'), { autoAlpha: 0 });
    gsap.set(q('.status-alloc.standby'), { autoAlpha: 1 });
    gsap.set(q('.status-write'), { autoAlpha: 0 });
    gsap.set(q('.status-write.standby'), { autoAlpha: 1 });
    gsap.set(q('.crate'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.cell-fill'), { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(q('.scan'), { scaleY: 0, transformOrigin: '50% 0%', autoAlpha: 0 });
    gsap.set(q('.glow'), { autoAlpha: 0.2 });
    gsap.set(q('.pipe-dash'), { strokeDashoffset: 160 });
    gsap.set(q('.ep-tag'), { autoAlpha: 0, y: 6 });
    gsap.set(q('.radar-blip'), { autoAlpha: 0, scale: 0.6 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });
    gsap.set(q('.ntdll-check'), { autoAlpha: 0, scale: 0.5 });
    gsap.set(q('.paint-stamp'), { autoAlpha: 0, scale: 0.8 });
    gsap.set(q('.dust'), { autoAlpha: 0, y: 0 });

    const log = (sel: string, at: string | number) => {
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.45 }, at);
    };

    // Pacing: travel and dust stay short. The teaching beats
    // (RWX lock, each scan, each cell, EP, radar) dwell so they can be read.
    // ── 0 ghost dissolve — medium, then a short hold to read the empty bay ──
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.glow-hollow'), { autoAlpha: 1, duration: 0.25 }, 'beat0');
    tl.to(
      q('.ghost-page'),
      { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.18 },
      'beat0+=0.2'
    );
    tl.to(
      q('.dust'),
      { autoAlpha: 0.7, y: -16, duration: 0.28, stagger: 0.03 },
      'beat0+=0.55'
    );
    tl.to(q('.dust'), { autoAlpha: 0, duration: 0.2 }, 'beat0+=1.05');
    log('.log-0', 'beat0+=0.9');
    tl.to({}, { duration: clipPace.hold });

    // ── 1 key travels fast; dial lock onto RWX is the slow beat ──
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.glow-alloc'), { autoAlpha: 1, duration: 0.25 }, 'beat1');
    tl.to(q('.key-token'), { autoAlpha: 1, duration: 0.15 }, 'beat1');
    tl.to(q('.key-token'), { x: 150, duration: clipPace.travel, ease: 'power2.out' }, 'beat1+=0.15');
    tl.to(q('.status-alloc.standby'), { autoAlpha: 0, duration: 0.12 }, 'beat1+=0.35');
    tl.set(q('.status-alloc.allocating'), { autoAlpha: 1 }, 'beat1+=0.48');
    tl.to(
      q('.dial-needle'),
      { rotate: 68, duration: clipPace.teach + 0.4, ease: 'power1.inOut' },
      'beat1+=0.7'
    );
    tl.to(q('.status-alloc.allocating'), { autoAlpha: 0, duration: 0.2 }, 'beat1+=2.7');
    tl.set(q('.status-alloc.armed'), { autoAlpha: 1 }, 'beat1+=2.9');
    tl.to(q('.pipe-dash'), { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 'beat1+=1.4');
    log('.log-1', 'beat1+=2.9');
    tl.to({}, { duration: clipPace.hold });

    // ── 2–3 pages: pipe travel is quick, scan + cell fill are slow ──
    // First page is the slowest (pattern). Later pages speed up a little.
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.glow-write'), { autoAlpha: 1, duration: 0.25 }, 'beat2');

    const bytes = [4096, 180224, 225280, 270336];
    const pagePace = [
      { travel: 0.85, scan: clipPace.teach, cell: 1.25, hold: clipPace.hold },
      { travel: 0.7, scan: 1.35, cell: 1.0, hold: 1.0 },
      { travel: 0.65, scan: 1.2, cell: 0.9, hold: 0.9 },
      { travel: 0.6, scan: 1.15, cell: 0.85, hold: 0.95 },
    ];
    PAGES.forEach((page, i) => {
      const pace = pagePace[i];
      const start = i === 0 ? 'beat2' : '>';
      if (i === 2) {
        tl.addLabel('beat3');
        tl.call(() => setBeat(3), [], 'beat3');
      }
      tl.set(q(`.crate-${page.id}`), { autoAlpha: 1, x: 0 }, start);
      tl.to(q('.status-write.standby'), { autoAlpha: 0, duration: 0.08 }, '<');
      tl.set(q('.status-write.writing'), { autoAlpha: 1 });
      tl.to(
        q(`.crate-${page.id}`),
        { x: 500, duration: pace.travel, ease: 'power1.in' },
        '<'
      );
      tl.set(q('.scan'), { autoAlpha: 1, scaleY: 0 });
      tl.to(q('.scan'), { scaleY: 1, duration: pace.scan, ease: 'none' });
      tl.to(q('.scan'), { autoAlpha: 0, duration: 0.1 });
      tl.to(
        q(`.crate-${page.id}`),
        { x: 820, duration: pace.travel, ease: 'power1.in' },
        '<'
      );
      tl.to(q(`.crate-${page.id}`), { autoAlpha: 0, duration: 0.12 });
      tl.to(
        q(`.cell-${page.id}`),
        { scaleX: 1, duration: pace.cell, ease: 'power2.out' },
        '<'
      );
      tl.call(() => setBytes(bytes[i]));
      if (i === 0) log('.log-2', '<');
      tl.to({}, { duration: pace.hold });
    });

    tl.to(q('.status-write.writing'), { autoAlpha: 0, duration: 0.12 });
    tl.set(q('.status-write.committed'), { autoAlpha: 1 });
    tl.to(q('.ep-tag'), { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' });
    log('.log-3', '<');
    tl.to({}, { duration: clipPace.hold });

    // ── 4 radar — each ping lands slowly enough to read ──
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.to(
      q('.radar-blip'),
      { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.85, ease: 'power2.out' },
      'beat4'
    );
    tl.to(
      q('.ntdll-check'),
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
      'beat4+=2.2'
    );
    log('.log-4', 'beat4+=0.5');
    tl.to({}, { duration: clipPace.hold });

    // ── 5 stamp — slow reveal, long hold at the end ──
    tl.addLabel('beat5');
    tl.call(() => setBeat(5), [], 'beat5');
    tl.to(q('.glow-vault'), { autoAlpha: 1, duration: 0.4 }, 'beat5');
    tl.to(
      q('.paint-stamp'),
      { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
      'beat5+=0.15'
    );
    log('.log-5', 'beat5+=0.4');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  useEffect(() => {
    const tl = buildTimeline();
    if (!tl) return;
    tl.timeScale(speedRef.current);
    tlRef.current = tl;
    tl.play(0);
    setPlaying(true);
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [buildTimeline]);

  useEffect(() => {
    tlRef.current?.timeScale(speed);
  }, [speed]);

  useEffect(() => {
    if (!fullPage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullPage(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullPage]);

  const togglePlay = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.paused()) {
      tl.play();
      setPlaying(true);
    } else {
      tl.pause();
      setPlaying(false);
    }
  }, []);

  const toggleFullPage = useCallback(() => {
    setFullPage((value) => !value);
  }, []);

  useCanvasPlayToggle(filmRef, togglePlay, toggleFullPage);

  const replay = () => {
    tlRef.current?.kill();
    const tl = buildTimeline();
    if (!tl) return;
    tlRef.current = tl;
    tl.play(0);
    setPlaying(true);
    setBeat(0);
    setProgressPct(0);
  };

  const jumpBeat = (id: BeatId) => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.seek(`beat${id}`);
    tl.pause();
    setPlaying(false);
    setBeat(id);
    setProgressPct(Math.min(100, Math.round(tl.progress() * 100)));
  };

  const scrub = (pct: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.pause();
    tl.progress(pct / 100);
    setPlaying(false);
    setProgressPct(pct);
  };

  const cycleCutaway = () => {
    setCutaway((prev) =>
      prev === 'AUTO' ? 'OPEN' : prev === 'OPEN' ? 'SEALED' : 'AUTO'
    );
  };

  const cameraTransform =
    camera === 'SLOT'
      ? 'scale(1.42) translate(14%, 2%)'
      : camera === 'GATE'
        ? 'scale(1.38) translate(-4%, 0%)'
        : camera === 'VAULT'
          ? 'scale(1.42) translate(-20%, 0%)'
          : 'scale(1)';

  const current = BEATS[beat];

  return (
    <div
      data-testid="technical-clip-step3"
      data-is-playing={playing ? 'true' : 'false'}
      data-cutaway-mode={cutaway}
      className={
        fullPage
          ? 'fixed inset-0 z-[95] h-screen w-screen select-none bg-[#0B0F17] p-2'
          : `anime-3d-stage-frame w-full select-none ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses}`
      }
    >
      <div
        ref={rootRef}
        className={`anime-3d-canvas-bezel flex h-full w-full flex-col bg-[#0B0F17] ${
          labelsOn ? '' : 'labels-off'
        } ${bloomOn ? 'bloom-on' : ''} ${
          cutaway === 'SEALED' ? 'cutaway-sealed' : ''
        } ${cutaway === 'OPEN' ? 'cutaway-open' : ''}`}
      >
        <div className="z-20 flex shrink-0 items-start justify-between gap-3 px-3 pb-2 pt-3">
          <div className="pointer-events-auto min-w-0 flex-1 space-y-1 rounded-xl border-2 border-slate-900 bg-white/95 px-3 py-2 text-left shadow-[3px_3px_0px_#0F172A] dark:border-slate-700 dark:bg-slate-950/94">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] font-bold">
              <span className="rounded bg-amber-400 px-1.5 py-0.5 font-extrabold text-slate-950">
                ACT 0{current.id + 1} / 0{BEATS.length}
              </span>
              <span className="text-slate-600 dark:text-slate-300">STEP #3</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-rose-600 dark:text-rose-400">T1055.012</span>
            </div>
            <h3 className="text-xs font-black leading-snug tracking-tight text-slate-950 dark:text-white sm:text-sm">
              {current.title}
            </h3>
            <p className="text-[11.5px] font-medium leading-snug text-slate-800 dark:text-slate-200">
              &ldquo;{current.story}&rdquo;
            </p>
            <div className="border-t border-slate-200 pt-1 font-mono text-[10.5px] leading-snug text-indigo-700 dark:border-slate-800 dark:text-sky-300">
              {current.technical}
            </div>
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={cycleCutaway}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-slate-900 px-3 py-1.5 font-mono text-[11px] font-bold shadow-[2px_2px_0px_#0F172A] dark:border-slate-600 ${
                cutaway === 'OPEN'
                  ? 'bg-rose-600 text-white'
                  : cutaway === 'SEALED'
                    ? 'bg-slate-800 text-slate-100'
                    : 'bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100'
              }`}
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span>Cutaway: {cutaway}</span>
            </button>
            <button
              type="button"
              onClick={toggleFullPage}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-slate-900 bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-extrabold text-slate-950 shadow-[2px_2px_0px_#0F172A] dark:border-slate-600"
            >
              {fullPage ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span>{fullPage ? 'Exit Full Page' : 'Full Page'}</span>
            </button>
          </div>
        </div>
        <div
          ref={filmRef}
          data-testid="technical-clip-step3-film"
          role="button"
          tabIndex={0}
          aria-label={
            playing
              ? 'Pause the film. Double-click for full page.'
              : 'Play the film. Double-click for full page.'
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              togglePlay();
            }
          }}
          className="relative min-h-0 flex-1 cursor-pointer"
        >
        <svg
          viewBox="0 0 1200 640"
          className="absolute inset-0 h-full w-full"
          style={{
            transform: cameraTransform,
            transformOrigin: 'center',
            transition: 'transform 0.45s ease',
          }}
          role="img"
          aria-label="Anime technical clip of RWX allocation and Beacon page writes"
        >
            <defs>
              <radialGradient id="bg" cx="50%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0B0F17" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="grain" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="10" r="0.6" fill="#fff" opacity="0.08" />
                <circle cx="40" cy="28" r="0.5" fill="#fff" opacity="0.05" />
                <circle cx="70" cy="60" r="0.7" fill="#fff" opacity="0.06" />
              </pattern>
            </defs>
            <rect width="1200" height="640" fill="url(#bg)" />
            <rect width="1200" height="640" fill="url(#grain)" />

            <text className="clip-label" x="28" y="32" fill="#94a3b8" fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="0.16em">
              CEL TECH FILM · STEP 3 · T1055.012
            </text>
            <text x="1172" y="32" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="ui-monospace, monospace">
              svchost.exe · PID 4892
            </text>

            {/* pipe */}
            <path
              d="M 36 372 H 1164"
              fill="none"
              stroke="#6d28d9"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.28"
            />
            <path
              className="pipe-dash"
              d="M 36 372 H 1164"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="2"
              strokeDasharray="8 10"
            />

            {/* HOLLOW */}
            <g>
              <rect className="glow glow-hollow" x="24" y="56" width="210" height="250" rx="12" fill="#1c1917" stroke="#fb923c" strokeWidth="1.75" filter="url(#glow)" />
              <text x="129" y="82" textAnchor="middle" fill="#fdba74" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.12em">HOLLOWED SLOT</text>
              <text x="129" y="104" textAnchor="middle" fill="#e7e5e4" fontSize="13" fontFamily="ui-monospace, monospace">0x00400000</text>
              {[0, 1, 2, 3].map((i) => (
                <g key={i} className="ghost-page">
                  <rect x="44" y={124 + i * 40} width="170" height="30" rx="4" fill="none" stroke="#a8a29e" strokeDasharray="4 4" />
                  <text x="129" y={144 + i * 40} textAnchor="middle" fill="#a8a29e" fontSize="11" fontFamily="ui-monospace, monospace">
                    {['old .text', 'old .rdata', 'old .data', 'SEC_IMAGE'][i]}
                  </text>
                </g>
              ))}
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} className="dust" cx={70 + i * 24} cy={230} r={2.5} fill="#fdba74" />
              ))}
            </g>

            {/* KEY */}
            <g className="key-token">
              <rect x="28" y="308" width="150" height="28" rx="8" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="103" y="327" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">
                KEY 0x01C4
              </text>
            </g>

            {/* ALLOC + DIAL */}
            <g>
              <rect className="glow glow-alloc" x="300" y="56" width="180" height="250" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.75" />
              <text x="390" y="82" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.1em">ALLOC ENGINE</text>
              <text x="390" y="100" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontFamily="ui-monospace, monospace">VirtualAllocEx</text>
              <circle cx="390" cy="168" r="42" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
              <text x="360" y="150" fill="#64748b" fontSize="9" fontFamily="ui-monospace, monospace">RX</text>
              <text x="408" y="150" fill="#64748b" fontSize="9" fontFamily="ui-monospace, monospace">RW</text>
              <text x="372" y="214" fill="#86efac" fontSize="9" fontFamily="ui-monospace, monospace">RWX</text>
              <line className="dial-needle" x1="390" y1="168" x2="390" y2="132" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: '390px 168px' }} />
              <circle cx="390" cy="168" r="4" fill="#f8fafc" />
              <text className="status-alloc standby" x="390" y="250" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">STANDBY</text>
              <text className="status-alloc allocating" x="390" y="250" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">ALLOCATING</text>
              <text className="status-alloc armed" x="390" y="250" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">RWX 0x40</text>
              <text x="390" y="276" textAnchor="middle" fill="#6366f1" fontSize="10" fontFamily="ui-monospace, monospace">MEM_PRIVATE</text>
            </g>

            {/* WRITE GATE */}
            <g>
              <rect className="glow glow-write" x="540" y="56" width="200" height="250" rx="12" fill="#4c0519" stroke="#fb7185" strokeWidth="1.75" />
              <text x="640" y="82" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.1em">WRITE GATE</text>
              <text x="640" y="100" textAnchor="middle" fill="#fda4af" fontSize="11" fontFamily="ui-monospace, monospace">WriteProcessMemory</text>
              <rect className="scan" x="620" y="120" width="40" height="70" fill="#fda4af" opacity="0.35" />
              <text className="status-write standby" x="640" y="230" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">STANDBY</text>
              <text className="status-write writing" x="640" y="230" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">SCANNING</text>
              <text className="status-write committed" x="640" y="230" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">COMMITTED</text>
              <text x="640" y="258" textAnchor="middle" fill="#fb7185" fontSize="11" fontFamily="ui-monospace, monospace">
                bytes
              </text>
              <text ref={bytesRef} x="640" y="278" textAnchor="middle" fill="#ffe4e6" fontSize="13" fontFamily="ui-monospace, monospace" fontWeight="700">
                0 B
              </text>
            </g>

            {/* moving crates — travel x only, sit on the pipe lane */}
            {PAGES.map((page, i) => (
              <g key={page.id} className={`crate crate-${page.id}`} transform="translate(36, 354)">
                <rect width="86" height="36" rx="6" fill="#0f172a" stroke={page.tone} strokeWidth="1.75" />
                <text x="43" y="23" textAnchor="middle" fill={page.tone} fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">
                  {page.label}
                </text>
              </g>
            ))}

            {/* VAULT */}
            <g>
              <rect className="glow glow-vault" x="790" y="56" width="382" height="250" rx="12" fill="#052e16" stroke="#4ade80" strokeWidth="1.75" />
              <text x="981" y="82" textAnchor="middle" fill="#bbf7d0" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.1em">RWX VAULT</text>
              <text x="981" y="100" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily="ui-monospace, monospace">MEM_PRIVATE · Beacon PE</text>
              {(
                [
                  { id: 'mz', x: 812, y: 118, label: 'MZ 4D 5A' },
                  { id: 'text', x: 990, y: 118, label: '.text code' },
                  { id: 'rdata', x: 812, y: 176, label: '.rdata' },
                  { id: 'data', x: 990, y: 176, label: '.data' },
                ] as const
              ).map((cell) => (
                <g key={cell.id}>
                  <rect x={cell.x} y={cell.y} width="160" height="46" rx="6" fill="#022c22" stroke="#166534" />
                  <rect className={`cell-fill cell-${cell.id}`} x={cell.x} y={cell.y} width="160" height="46" rx="6" fill="#14532d" stroke="#86efac" />
                  <text x={cell.x + 80} y={cell.y + 28} textAnchor="middle" fill="#dcfce7" fontSize="12" fontFamily="ui-monospace, monospace">
                    {cell.label}
                  </text>
                </g>
              ))}
              <g className="ep-tag">
                <rect x="860" y="236" width="240" height="28" rx="6" fill="#0f172a" stroke="#fbbf24" />
                <text x="980" y="255" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">
                  EP → 0x004014A0
                </text>
              </g>
              <g className="paint-stamp">
                <rect x="812" y="268" width="150" height="26" rx="5" fill="#14532d" stroke="#fde68a" />
                <text x="887" y="286" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily="ui-monospace, monospace">
                  path = svchost.exe
                </text>
              </g>
            </g>

            {/* ntdll control — sits under the travel rail */}
            <g>
              <rect x="24" y="408" width="210" height="52" rx="10" fill="#0c4a6e" stroke="#38bdf8" />
              <text x="40" y="430" fill="#e0f2fe" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">ntdll.dll .text</text>
              <text x="40" y="448" fill="#7dd3fc" fontSize="11" fontFamily="ui-monospace, monospace">R-X · untouched</text>
              <g className="ntdll-check">
                <circle cx="200" cy="434" r="12" fill="#052e16" stroke="#4ade80" />
                <path d="M194 434 L198 438 L207 428" fill="none" stroke="#4ade80" strokeWidth="2" />
              </g>
            </g>

            {/* radar */}
            {(
              [
                { t: 'Sysmon EID 10', s: '0x1FFFFF' },
                { t: 'ETW AllocVM', s: 'remote' },
                { t: 'Unbacked MZ', s: '@ image base' },
              ] as const
            ).map((r, i) => (
              <g key={r.t} className="radar-blip" transform={`translate(${260 + i * 200}, 408)`}>
                <rect width="180" height="52" rx="10" fill="#1e1b4b" stroke="#a78bfa" />
                <circle cx="22" cy="26" r="6" fill="#f472b6" />
                <text x="40" y="24" fill="#e9d5ff" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="700">{r.t}</text>
                <text x="40" y="42" fill="#c4b5fd" fontSize="11" fontFamily="ui-monospace, monospace">{r.s}</text>
              </g>
            ))}

            {/* event log */}
            <text x="28" y="486" fill="#475569" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">EVENT LOG</text>
            {[
              ['log-0', 'unmap residue gone · bay empty'],
              ['log-1', 'VirtualAllocEx · protect → 0x40 RWX'],
              ['log-2', 'WriteProcessMemory · page stream open'],
              ['log-3', 'bytesWritten = 270336 · EP staged'],
              ['log-4', 'detect: EID 10 + ETW · ntdll clean'],
              ['log-5', 'name=svchost · cargo=Beacon PE'],
            ].map(([cls, text], i) => (
              <text
                key={cls}
                className={`log-line ${cls}`}
                x="28"
                y={506 + i * 18}
                fill="#cbd5e1"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
              >
                {`› ${text}`}
              </text>
            ))}
          </svg>
        </div>

        <div className="z-20 flex shrink-0 flex-col items-center px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={() => setDockOpen((v) => !v)}
            className="pointer-events-auto mb-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-t-lg rounded-b-md border border-slate-700 bg-slate-950/92 px-3 py-1 font-mono text-[10.5px] font-bold text-slate-100"
          >
            {dockOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            <span>{dockOpen ? 'Hide Controls' : 'Show Controls'}</span>
          </button>
          {dockOpen && (
            <div className="pointer-events-auto w-full max-w-[960px] space-y-2 rounded-xl border-2 border-slate-900 bg-white/95 px-3.5 py-2.5 shadow-[4px_4px_0px_#0F172A] dark:border-slate-700 dark:bg-slate-950/94">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 font-mono text-[11px] font-extrabold ${
                      playing
                        ? 'border-slate-900 bg-amber-400 text-slate-950'
                        : 'border-rose-800 bg-rose-600 text-white'
                    }`}
                  >
                    {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    <span>{playing ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={replay}
                    aria-label="Restart animation from Act 1"
                    className="inline-flex cursor-pointer rounded-lg border border-slate-300 bg-slate-100 p-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Story Acts">
                  {BEATS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={beat === item.id}
                      onClick={() => jumpBeat(item.id)}
                      className={`shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10.5px] font-bold ${
                        beat === item.id
                          ? 'bg-slate-950 text-white dark:bg-sky-400 dark:text-slate-950'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300'
                      }`}
                    >
                      {item.tag}
                    </button>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {ANIME_3D_STAGE_STANDARD.speedMultipliers.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setSpeed(spd)}
                      className={`cursor-pointer rounded px-1.5 py-1 font-mono text-[10px] font-bold tabular-nums ${
                        speed === spd
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-1 dark:border-slate-800">
                <div className="flex min-w-[180px] flex-1 items-center gap-2">
                  <span className="shrink-0 font-mono text-[10px] font-bold tabular-nums text-slate-500">
                    {progressPct}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progressPct}
                    onChange={(event) => scrub(Number(event.target.value))}
                    aria-label="Scrub animation timeline"
                    className="h-1.5 w-full cursor-pointer accent-rose-600"
                  />
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  {(['WIDE', 'SLOT', 'GATE', 'VAULT'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCamera(preset)}
                      className={`cursor-pointer whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        camera === preset
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLabelsOn((v) => !v)}
                    className={`ml-1 inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      labelsOn ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    Labels {labelsOn ? 'ON' : 'OFF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBloomOn((v) => !v)}
                    className={`inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      bloomOn ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Bloom {bloomOn ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
