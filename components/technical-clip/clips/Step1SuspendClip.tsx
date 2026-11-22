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
    title: 'The loader sends the create call',
    story:
      'The first program does not run the payload. A small flag chip leaves it and travels into the spawn gate.',
    technical:
      'Invoice_Q4.exe PID 3104 calls CreateProcessW on C:\\Windows\\System32\\svchost.exe.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The host assembles in the bay',
    story:
      'A real process body, a name plate, and a thread lamp build themselves. The lamp stays dark.',
    technical:
      'EPROCESS PID 4892 is created. The signed SEC_IMAGE is mapped at 0x00400000. TID 4896 exists.',
  },
  {
    id: 2,
    tag: '03',
    title: 'The dial locks on suspended',
    story:
      'The gate dial turns off standby and clicks onto frozen. The thread never takes its first step.',
    technical:
      'CREATE_SUSPENDED = 0x00000004. TID 4896 waits at RtlUserThreadStart. SuspendCount = 1.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Two keys drop into the tray',
    story:
      'One key is cut for the child’s memory. The other is cut for that frozen thread. Both fall into the tray.',
    technical:
      'PROCESS_INFORMATION returns hProcess 0x01C4 and hThread 0x01C8 with access 0x1FFFFF.',
  },
  {
    id: 4,
    tag: '05',
    title: 'The parent lamp lights',
    story:
      'A lamp over the desk lights. A normal copy of this host is started by the service manager. This one was not.',
    technical:
      'Sysmon EID 1: ParentImage is Invoice_Q4.exe, not services.exe. The command line has no -k group.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'GATE', transform: 'scale(1.45) translate(6%, 6%)' },
  { id: 'HOST', transform: 'scale(1.4) translate(-16%, 4%)' },
  { id: 'KEYS', transform: 'scale(1.35) translate(0%, -12%)' },
];

export default function Step1SuspendClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    gsap.set(q('.flag'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.part'), { autoAlpha: 0, y: 14 });
    gsap.set(q('.dial'), { rotate: -70, svgOrigin: '445 188' });
    gsap.set(q('.st'), { autoAlpha: 0 });
    gsap.set(q('.st.standby'), { autoAlpha: 1 });
    gsap.set(q('.lamp'), { autoAlpha: 0.25 });
    gsap.set(q('.key'), { y: -40, autoAlpha: 0 });
    gsap.set(q('.eid'), { autoAlpha: 0, scale: 0.7 });
    gsap.set(q('.arg'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.mapped'), { autoAlpha: 0 });
    gsap.set(q('.halt'), { autoAlpha: 0, scale: 0.4 });
    gsap.set(q('.mask'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.expect'), { autoAlpha: 0 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });
    const log = (sel: string) => tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.3 }, '<');

    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.flag'), { autoAlpha: 1, duration: 0.35 }, 'beat0');
    tl.to(q('.flag'), { x: 150, duration: clipPace.travel, ease: 'power2.inOut' }, 'beat0+=0.25');
    tl.to(q('.arg'), { autoAlpha: 1, duration: 0.35 }, 'beat0');
    tl.to(q('.arg'), { x: 100, duration: clipPace.travel }, 'beat0+=0.35');
    tl.to(q('.st.standby'), { autoAlpha: 0, duration: 0.25 }, 'beat0+=1.2');
    tl.set(q('.st.spawning'), { autoAlpha: 1 }, 'beat0+=1.45');
    log('.log-0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.part'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.55 }, 'beat1');
    tl.to(q('.mapped'), { autoAlpha: 1, duration: 0.6 }, 'beat1+=1.4');
    log('.log-1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.dial'), { rotate: 62, duration: clipPace.teach, ease: 'power1.inOut' }, 'beat2');
    tl.to(q('.st.spawning'), { autoAlpha: 0, duration: 0.25 }, 'beat2+=1.7');
    tl.set(q('.st.frozen'), { autoAlpha: 1 }, 'beat2+=1.95');
    tl.to(q('.lamp'), { autoAlpha: 1, duration: 0.45 }, 'beat2+=1.85');
    tl.to(q('.halt'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, 'beat2+=2');
    log('.log-2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.key-proc'), { y: 0, autoAlpha: 1, duration: clipPace.travel, ease: 'back.out(1.4)' }, 'beat3');
    tl.to(q('.key-thr'), { y: 0, autoAlpha: 1, duration: 1.0, ease: 'back.out(1.4)' }, 'beat3+=0.85');
    tl.to(q('.mask'), { autoAlpha: 1, y: 0, duration: 0.55 }, 'beat3+=1.5');
    log('.log-3');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.eid'), { autoAlpha: 1, scale: 1 }, 'beat4');
    tl.set(q('.expect'), { autoAlpha: 1 }, 'beat4');
    log('.log-4');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-step1"
      stageLabel="STEP #1"
      mitreId="T1106"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="CreateProcessW flag travels into the spawn gate and two handles drop">
        <FilmBackdrop prefix="s1" />
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          SPAWN GATE · CREATE_SUSPENDED
        </text>

        <rect x="28" y="52" width="240" height="160" rx="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
        <text x="148" y="86" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontFamily={FONT}>PARENT</text>
        <text x="148" y="116" textAnchor="middle" fill="#e0e7ff" fontSize="16" fontFamily={FONT} fontWeight="700">Invoice_Q4.exe</text>
        <text x="148" y="144" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontFamily={FONT}>PID 3104</text>
        <text x="148" y="170" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontFamily={FONT}>stage-1 loader</text>

        <rect x="320" y="52" width="250" height="250" rx="16" fill="#0c1222" stroke="#38bdf8" strokeWidth="2" />
        <text x="445" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontFamily={FONT} fontWeight="700">CreateProcessW</text>
        <circle cx="445" cy="188" r="52" fill="#020617" stroke="#38bdf8" strokeWidth="3" />
        <text x="400" y="150" fill="#64748b" fontSize="11" fontFamily={FONT}>idle</text>
        <text x="468" y="150" fill="#64748b" fontSize="11" fontFamily={FONT}>run</text>
        <text x="418" y="246" fill="#67e8f9" fontSize="11" fontFamily={FONT}>0x4</text>
        <line className="dial" x1="445" y1="188" x2="445" y2="146" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <circle cx="445" cy="188" r="5" fill="#f8fafc" />
        <text className="st standby" x="445" y="286" textAnchor="middle" fill="#94a3b8" fontSize="14" fontFamily={FONT} fontWeight="700">STANDBY</text>
        <text className="st spawning" x="445" y="286" textAnchor="middle" fill="#fde68a" fontSize="14" fontFamily={FONT} fontWeight="700">SPAWNING</text>
        <text className="st frozen" x="445" y="286" textAnchor="middle" fill="#67e8f9" fontSize="14" fontFamily={FONT} fontWeight="700">FROZEN</text>
        <g className="arg">
          <rect x="36" y="308" width="210" height="28" rx="6" fill="#1e1b4b" stroke="#818cf8" />
          <text x="141" y="327" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontFamily={FONT}>arg · System32\svchost.exe</text>
        </g>
        <g className="flag">
          <rect x="68" y="230" width="160" height="40" rx="8" fill="#083344" stroke="#67e8f9" strokeWidth="2" />
          <text x="148" y="256" textAnchor="middle" fill="#a5f3fc" fontSize="14" fontFamily={FONT} fontWeight="700">0x4 SUSPEND</text>
        </g>

        <rect x="600" y="52" width="568" height="250" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text x="884" y="78" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily={FONT}>NEW HOST</text>
        <g className="part shell">
          <rect x="640" y="100" width="280" height="70" rx="10" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="860" y="78" width="70" height="48" rx="8" fill="#334155" stroke="#e2e8f0" />
          <circle cx="690" cy="180" r="16" fill="#020617" stroke="#e2e8f0" strokeWidth="3" />
          <circle cx="860" cy="180" r="16" fill="#020617" stroke="#e2e8f0" strokeWidth="3" />
        </g>
        <g className="part plate">
          <rect x="700" y="116" width="180" height="36" rx="6" fill="#fef3c7" />
          <text x="790" y="140" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily={FONT} fontWeight="700">svchost · 4892</text>
        </g>
        <g className="part thread">
          <circle className="lamp" cx="980" cy="150" r="22" fill="#083344" stroke="#67e8f9" strokeWidth="3" />
          <text x="1040" y="140" fill="#e0f2fe" fontSize="14" fontFamily={FONT} fontWeight="700">TID 4896</text>
          <text x="1040" y="162" fill="#7dd3fc" fontSize="12" fontFamily={FONT}>RtlUserThreadStart</text>
          <text x="1040" y="186" fill="#67e8f9" fontSize="13" fontFamily={FONT}>SuspendCount 1</text>
          <g className="halt">
            <path d="M964 134 L996 166 M996 134 L964 166" stroke="#f43f5e" strokeWidth="3" />
          </g>
        </g>
        <g className="mapped">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={640 + i * 26} y="208" width="20" height="12" rx="2" fill="#14532d" stroke="#4ade80" />
          ))}
          <text x="724" y="219" fill="#86efac" fontSize="12" fontFamily={FONT}>signed pages mapped</text>
        </g>
        <text x="884" y="250" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily={FONT}>image SEC_IMAGE @ 0x00400000</text>

        <g className="key key-proc cutaway-guts">
          <circle cx="120" cy="390" r="18" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <rect x="136" y="382" width="90" height="16" rx="3" fill="#fbbf24" />
          <text x="280" y="386" fill="#fde68a" fontSize="16" fontFamily={FONT} fontWeight="700">hProcess 0x01C4</text>
          <text x="280" y="408" fill="#fcd34d" fontSize="13" fontFamily={FONT}>RAM key · mask 0x1FFFFF</text>
        </g>
        <g className="key key-thr cutaway-guts">
          <circle cx="700" cy="390" r="18" fill="none" stroke="#fb7185" strokeWidth="4" />
          <rect x="716" y="382" width="90" height="16" rx="3" fill="#fb7185" />
          <text x="860" y="386" fill="#fecdd3" fontSize="16" fontFamily={FONT} fontWeight="700">hThread 0x01C8</text>
          <text x="860" y="408" fill="#fda4af" fontSize="13" fontFamily={FONT}>thread key · Step #4</text>
        </g>

        <g className="mask">
          <rect x="400" y="328" width="280" height="28" rx="6" fill="#111827" stroke="#fbbf24" />
          <text x="540" y="347" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>both keys carry 0x1FFFFF</text>
        </g>
        <g className="expect">
          <rect x="640" y="448" width="360" height="44" rx="8" fill="#1e293b" stroke="#64748b" />
          <text x="660" y="476" fill="#94a3b8" fontSize="13" fontFamily={FONT}>expected parent services.exe + -k</text>
          <path d="M960 458 L990 482 M990 458 L960 482" stroke="#f43f5e" strokeWidth="2" />
        </g>
        <g className="eid">
          <circle cx="70" cy="470" r="10" fill="#fbbf24" />
          <rect x="96" y="448" width="520" height="44" rx="8" fill="#451a03" stroke="#fbbf24" />
          <text x="116" y="476" fill="#fde68a" fontSize="14" fontFamily={FONT}>EID 1 · parent is not services.exe · no -k</text>
        </g>

        {[
          ['log-0', 'flag 0x4 leaves PID 3104 and enters CreateProcessW'],
          ['log-1', 'host body + plate PID 4892 assemble'],
          ['log-2', 'dial locks · TID 4896 parked · SuspendCount 1'],
          ['log-3', 'keys 0x01C4 and 0x01C8 drop'],
          ['log-4', 'EID 1 lamp · wrong parent'],
        ].map(([cls, text], i) => (
          <text key={cls} className={`log-line ${cls}`} x="28" y={520 + i * 20} fill="#cbd5e1" fontSize="13" fontFamily={FONT}>{`› ${text}`}</text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
