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
    title: 'The host rolls up with its real path',
    story: 'The process that opens the socket still wears the signed file path. The code inside is the payload.',
    technical: 'PID 4892 path is C:\\Windows\\System32\\svchost.exe and it has loaded winhttp.dll.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The path gate lifts',
    story: 'The gate only reads the path painted on the process. The path matches, so the arm rises.',
    technical: 'The host firewall allows System32\\svchost.exe outbound to TCP/443. It does not compare memory to the file.',
  },
  {
    id: 2,
    tag: '03',
    title: 'The script sleeve peels off the packet',
    story: 'An envelope travels the wire labeled like a normal script download. The sleeve slides off and a callback note is inside.',
    technical: 'TLS 1.3 GET /jquery-3.3.1.min.js to 185.220.101.42:443. Cookie holds RSA metadata. Sleep is 60s ± 20%.',
  },
  {
    id: 3,
    tag: '04',
    title: 'The parent board disagrees',
    story: 'Two name plates sit side by side. The expected starter and the real starter are not the same, so a cross lights.',
    technical: 'A real svchost parent is services.exe with -k. This parent is Invoice_Q4.exe and the command line is bare.',
  },
  {
    id: 4,
    tag: '05',
    title: 'The dish paints the handshake',
    story: 'After the gate is already up, a dish turns and writes the handshake mark next to the connection.',
    technical: 'Sysmon EID 3 and Suricata JA3 72a589da586844d7f0818ce684948eea.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'GATE', transform: 'scale(1.45) translate(16%, 8%)' },
  { id: 'PACKET', transform: 'scale(1.35) translate(-4%, 2%)' },
  { id: 'DISH', transform: 'scale(1.35) translate(-16%, -6%)' },
];

export default function Step5BeaconClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    gsap.set(q('.arm'), { rotate: 0, svgOrigin: '250 150' });
    gsap.set(q('.allow'), { autoAlpha: 0 });
    gsap.set(q('.packet'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.sleeve'), { scaleX: 1, svgOrigin: '520 250' });
    gsap.set(q('.note'), { autoAlpha: 0 });
    gsap.set(q('.bad'), { autoAlpha: 0 });
    gsap.set(q('.cross'), { autoAlpha: 0, scale: 0.5 });
    gsap.set(q('.dish'), { rotate: -25, svgOrigin: '1080 120' });
    gsap.set(q('.ja3'), { autoAlpha: 0 });
    gsap.set(q('.dll'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.blind'), { autoAlpha: 0 });
    gsap.set(q('.wire'), { strokeDashoffset: 430 });
    gsap.set(q('.clock'), { autoAlpha: 0 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });
    const log = (sel: string) => tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.3 }, '<');

    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.dll'), { autoAlpha: 1, y: 0, duration: 0.7 }, 'beat0');
    log('.log-0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.arm'), { rotate: -70, duration: clipPace.teach }, 'beat1');
    tl.set(q('.allow'), { autoAlpha: 1 }, 'beat1+=1.1');
    tl.to(q('.blind'), { autoAlpha: 1, duration: 0.55 }, 'beat1+=0.9');
    log('.log-1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.set(q('.packet'), { autoAlpha: 1 }, 'beat2');
    tl.to(q('.packet'), { x: 180, duration: clipPace.travel }, 'beat2');
    tl.to(q('.sleeve'), { scaleX: 0, duration: clipPace.teach }, 'beat2+=0.7');
    tl.to(q('.note'), { autoAlpha: 1, duration: 0.7 }, '<0.4');
    tl.to(q('.wire'), { strokeDashoffset: 0, duration: clipPace.travel }, 'beat2');
    tl.to(q('.clock'), { autoAlpha: 1, duration: 0.55 }, 'beat2+=0.8');
    log('.log-2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.bad'), { autoAlpha: 1, duration: 0.7 }, 'beat3');
    tl.to(q('.cross'), { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.6)' }, 'beat3+=0.55');
    log('.log-3');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.to(q('.dish'), { rotate: 35, duration: clipPace.teach }, 'beat4');
    tl.set(q('.ja3'), { autoAlpha: 1 }, 'beat4');
    log('.log-4');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-step5"
      stageLabel="STEP #5"
      mitreId="T1071.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Path gate lifts and a script-labeled packet peels open on the way to the C2">
        <FilmBackdrop prefix="s5" />
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          PATH GATE · PACKET SLEEVE · DISH
        </text>

        <rect x="28" y="52" width="280" height="120" rx="12" fill="#0f172a" stroke="#e2e8f0" />
        <text x="168" y="88" textAnchor="middle" fill="#f8fafc" fontSize="15" fontFamily={FONT} fontWeight="700">svchost.exe</text>
        <text x="168" y="112" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>PID 4892 · winhttp.dll</text>
        <text x="168" y="136" textAnchor="middle" fill="#fda4af" fontSize="12" fontFamily={FONT}>System32 path</text>
        <rect x="242" y="150" width="12" height="70" fill="#334155" />
        <rect className="arm" x="248" y="156" width="160" height="14" rx="4" fill="#fbbf24" />
        <text className="allow" x="168" y="210" textAnchor="middle" fill="#86efac" fontSize="14" fontFamily={FONT} fontWeight="700">ALLOW :443</text>
        <g className="dll">
          <rect x="36" y="228" width="150" height="26" rx="6" fill="#1e1b4b" stroke="#818cf8" />
          <text x="111" y="246" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontFamily={FONT}>winhttp.dll</text>
        </g>
        <g className="blind">
          <rect x="196" y="228" width="160" height="26" rx="6" fill="#111827" stroke="#fbbf24" />
          <text x="276" y="246" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>reads the path only</text>
        </g>
        <path className="wire" d="M430 198 H860" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="430" />
        <g className="clock">
          <circle cx="700" cy="168" r="16" fill="#0f172a" stroke="#fde68a" />
          <line x1="700" y1="168" x2="700" y2="156" stroke="#fde68a" strokeWidth="2" />
          <text x="724" y="172" fill="#fde68a" fontSize="12" fontFamily={FONT}>60s ±20%</text>
        </g>

        <g className="packet cutaway-guts">
          <rect x="360" y="220" width="280" height="70" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text className="note" x="500" y="262" textAnchor="middle" fill="#fb7185" fontSize="14" fontFamily={FONT} fontWeight="700">RSA cookie · 60s ±20%</text>
          <g className="sleeve">
            <rect x="360" y="220" width="280" height="70" rx="10" fill="#e2e8f0" />
            <text x="500" y="262" textAnchor="middle" fill="#0f172a" fontSize="14" fontFamily={FONT} fontWeight="700">GET /jquery-3.3.1.min.js</text>
          </g>
        </g>
        <rect x="860" y="210" width="300" height="90" rx="12" fill="#4c0519" stroke="#fb7185" />
        <text x="1010" y="248" textAnchor="middle" fill="#fecdd3" fontSize="16" fontFamily={FONT} fontWeight="700">185.220.101.42</text>
        <text x="1010" y="274" textAnchor="middle" fill="#fda4af" fontSize="14" fontFamily={FONT}>:443 · TLS 1.3</text>

        <rect x="28" y="320" width="340" height="80" rx="10" fill="#052e16" stroke="#166534" />
        <text x="48" y="352" fill="#86efac" fontSize="14" fontFamily={FONT}>expected · services.exe</text>
        <text x="48" y="376" fill="#86efac" fontSize="14" fontFamily={FONT}>cmdline -k group</text>
        <g className="bad">
          <rect x="400" y="320" width="340" height="80" rx="10" fill="#4c0519" stroke="#fb7185" />
          <text x="420" y="352" fill="#fecdd3" fontSize="14" fontFamily={FONT}>actual · Invoice_Q4.exe</text>
          <text x="420" y="376" fill="#fda4af" fontSize="14" fontFamily={FONT}>cmdline bare</text>
        </g>
        <g className="cross">
          <circle cx="800" cy="360" r="22" fill="#7f1d1d" stroke="#fecdd3" />
          <path d="M788 348 L812 372 M812 348 L788 372" stroke="#fecdd3" strokeWidth="3" />
        </g>

        <path className="dish" d="M1080 90 q60 10 40 55" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
        <g className="ja3">
          <rect x="860" y="320" width="310" height="80" rx="10" fill="#451a03" stroke="#fbbf24" />
          <text x="1015" y="352" textAnchor="middle" fill="#fde68a" fontSize="14" fontFamily={FONT} fontWeight="700">EID 3</text>
          <text x="1015" y="376" textAnchor="middle" fill="#fcd34d" fontSize="12" fontFamily={FONT}>JA3 72a589da…</text>
        </g>

        {[
          ['log-0', 'host shows System32\\svchost.exe and winhttp'],
          ['log-1', 'path gate arm rises · ALLOW 443'],
          ['log-2', 'jquery sleeve peels · cookie note shows'],
          ['log-3', 'parent plates disagree · cross lights'],
          ['log-4', 'dish turns · EID 3 and JA3'],
        ].map(([cls, text], i) => (
          <text key={cls} className={`log-line ${cls}`} x="28" y={440 + i * 34} fill="#cbd5e1" fontSize="15" fontFamily={FONT}>{`› ${text}`}</text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
