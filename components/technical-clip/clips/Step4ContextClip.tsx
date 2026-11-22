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
    title: 'The original thread is still frozen',
    story: 'A frost plate sits on the only worker. Its start register still names the Microsoft stub.',
    technical: 'hThread 0x01C8 is TID 4896. SuspendCount = 1. Rcx still points at RtlUserThreadStart.',
  },
  {
    id: 1,
    tag: '02',
    title: 'A pen rewrites the start register',
    story: 'The old name on the register fades and a new address is written in its place.',
    technical: 'SetThreadContext writes Rcx = 0x004014A0, the image base plus the payload entry.',
  },
  {
    id: 2,
    tag: '03',
    title: 'The suspend lever falls',
    story: 'The lever drops. The big digit on the counter flips from one to zero and the lamp turns on.',
    technical: 'ResumeThread returns PreviousSuspendCount 1. SuspendCount becomes 0. TID 4896 runs.',
  },
  {
    id: 3,
    tag: '04',
    title: 'A tamper stamp hits the lane',
    story: 'As the thread wakes, a stamp marks that the running bytes and the file are no longer the same program.',
    technical: 'Sysmon EID 25 ProcessTampering: "Image is replaced".',
  },
  {
    id: 4,
    tag: '05',
    title: 'The loader card slides away',
    story: 'The card of the program that started this can leave. The woken thread stays in the host.',
    technical: 'CreateRemoteThread is not used. Invoice_Q4.exe may exit. Beacon stays on TID 4896 inside PID 4892.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'RCX', transform: 'scale(1.4) translate(-8%, 8%)' },
  { id: 'LEVER', transform: 'scale(1.45) translate(16%, 4%)' },
  { id: 'STAMP', transform: 'scale(1.3) translate(0%, -10%)' },
];

export default function Step4ContextClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    gsap.set(q('.frost'), { autoAlpha: 0.85 });
    gsap.set(q('.pen'), { rotate: -20, svgOrigin: '640 150' });
    gsap.set(q('.rcx-new'), { autoAlpha: 0 });
    gsap.set(q('.lever'), { rotate: -50, svgOrigin: '48 240' });
    gsap.set(q('.digit-zero'), { autoAlpha: 0 });
    gsap.set(q('.run-lamp'), { autoAlpha: 0.2 });
    gsap.set(q('.stamp'), { autoAlpha: 0, scale: 1.4 });
    gsap.set(q('.loader'), { x: 0, autoAlpha: 1 });
    gsap.set(q('.rva'), { autoAlpha: 0 });
    gsap.set(q('.prev'), { autoAlpha: 0, y: 6 });
    gsap.set(q('.crt'), { autoAlpha: 0 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });
    const log = (sel: string) => tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.3 }, '<');

    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    log('.log-0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.pen'), { rotate: 25, duration: clipPace.teach }, 'beat1');
    tl.to(q('.rcx-old'), { autoAlpha: 0, duration: 0.7 }, 'beat1+=0.9');
    tl.to(q('.rcx-new'), { autoAlpha: 1, duration: 0.85 }, '<');
    tl.to(q('.rva'), { autoAlpha: 1, duration: 0.7 }, '<0.25');
    log('.log-1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.lever'), { rotate: 30, duration: 1.15, ease: 'power2.in' }, 'beat2');
    tl.to(q('.frost'), { autoAlpha: 0, duration: 0.9 }, 'beat2+=0.35');
    tl.to(q('.digit-one'), { autoAlpha: 0, duration: 0.45 }, 'beat2+=0.7');
    tl.to(q('.digit-zero'), { autoAlpha: 1, duration: 0.6 }, '<');
    tl.to(q('.run-lamp'), { autoAlpha: 1, duration: 0.55 }, '<');
    tl.to(q('.prev'), { autoAlpha: 1, y: 0, duration: 0.55 }, '<');
    log('.log-2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.stamp'), { autoAlpha: 1, scale: 1 }, 'beat3');
    log('.log-3');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.to(q('.loader'), { x: -220, autoAlpha: 0, duration: clipPace.travel }, 'beat4');
    tl.set(q('.crt'), { autoAlpha: 1 }, 'beat4');
    log('.log-4');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-step4"
      stageLabel="STEP #4"
      mitreId="T1055.012"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Pen rewrites RCX, the suspend lever drops, and a tamper stamp lands">
        <FilmBackdrop prefix="s4" />
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          THREAD CAB · RCX PEN · RESUME LEVER
        </text>

        <rect x="36" y="56" width="250" height="200" rx="14" fill="#0c4a6e" stroke="#67e8f9" strokeWidth="2" />
        <text x="161" y="88" textAnchor="middle" fill="#e0f2fe" fontSize="14" fontFamily={FONT} fontWeight="700">hThread 0x01C8</text>
        <text x="161" y="116" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontFamily={FONT}>TID 4896</text>
        <g className="frost">
          <rect x="56" y="140" width="210" height="80" rx="8" fill="#67e8f9" opacity="0.25" stroke="#a5f3fc" />
          <text x="161" y="186" textAnchor="middle" fill="#ecfeff" fontSize="14" fontFamily={FONT}>FROST ON</text>
        </g>

        <rect className="lever" x="40" y="168" width="16" height="72" rx="4" fill="#f43f5e" />

        <rect x="320" y="56" width="560" height="200" rx="14" fill="#0f172a" stroke="#fb7185" strokeWidth="2" />
        <text x="344" y="86" fill="#fda4af" fontSize="13" fontFamily={FONT}>CONTEXT · Rcx</text>
        <text className="rcx-old" x="344" y="140" fill="#cbd5e1" fontSize="26" fontFamily={FONT}>RtlUserThreadStart</text>
        <text className="rcx-new" x="344" y="140" fill="#fb7185" fontSize="32" fontFamily={FONT} fontWeight="700">0x004014A0</text>
        <text x="344" y="188" fill="#fda4af" fontSize="14" fontFamily={FONT}>SetThreadContext(0x01C8)</text>
        <g className="rva">
          <rect x="344" y="204" width="250" height="26" rx="6" fill="#451a03" stroke="#fbbf24" />
          <text x="469" y="222" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>0x00400000 + entry RVA</text>
        </g>
        <line className="pen" x1="760" y1="150" x2="820" y2="110" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />

        <g>
          <circle cx="1000" cy="150" r="70" fill="#020617" stroke="#38bdf8" strokeWidth="3" />
          <text className="digit-one" x="1000" y="166" textAnchor="middle" fill="#e0f2fe" fontSize="48" fontFamily={FONT} fontWeight="700">1</text>
          <text className="digit-zero" x="1000" y="166" textAnchor="middle" fill="#67e8f9" fontSize="48" fontFamily={FONT} fontWeight="700">0</text>
          <text x="1000" y="248" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontFamily={FONT}>SuspendCount</text>
        </g>
        <g className="prev">
          <rect x="900" y="40" width="210" height="24" rx="6" fill="#052e16" stroke="#4ade80" />
          <text x="1005" y="56" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily={FONT}>ResumeThread returns 1</text>
        </g>
        <circle className="run-lamp" cx="1120" cy="90" r="14" fill="#4ade80" />

        <g className="stamp">
          <rect x="320" y="280" width="420" height="70" rx="10" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <text x="530" y="322" textAnchor="middle" fill="#fde68a" fontSize="18" fontFamily={FONT} fontWeight="700">EID 25 · Image is replaced</text>
        </g>

        <g className="crt">
          <rect x="36" y="360" width="260" height="32" rx="6" fill="#1e293b" stroke="#f43f5e" />
          <text x="166" y="381" textAnchor="middle" fill="#fda4af" fontSize="13" fontFamily={FONT}>CreateRemoteThread</text>
          <path d="M52 368 L280 384 M280 368 L52 384" stroke="#f43f5e" strokeWidth="2" />
        </g>
        <g className="loader">
          <rect x="780" y="280" width="380" height="70" rx="10" fill="#1e293b" stroke="#94a3b8" />
          <text x="970" y="310" textAnchor="middle" fill="#e2e8f0" fontSize="15" fontFamily={FONT}>Invoice_Q4.exe</text>
          <text x="970" y="332" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily={FONT}>no CreateRemoteThread · may exit</text>
        </g>

        {[
          ['log-0', 'frost on TID 4896 · Rcx still the Microsoft stub'],
          ['log-1', 'pen writes Rcx = 0x004014A0'],
          ['log-2', 'lever drops · digit 1 flips to 0 · lamp on'],
          ['log-3', 'EID 25 stamp'],
          ['log-4', 'loader card slides out · thread stays'],
        ].map(([cls, text], i) => (
          <text key={cls} className={`log-line ${cls}`} x="320" y={410 + i * 28} fill="#cbd5e1" fontSize="14" fontFamily={FONT}>{`› ${text}`}</text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
