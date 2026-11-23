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
    title: 'The paused worker thread still points at the original startup routine',
    story:
      'The loader plugs its thread key into the frozen worker. The worker is parked on the system launchpad, still aimed at the legitimate program’s start address.',
    technical:
      'GetThreadContext(hThread = 0x01C8) reads TID 4896 KTRAP_FRAME: RIP = ntdll!RtlUserThreadStart, RCX = original svchost entry, SuspendCount = 1.',
  },
  {
    id: 1,
    tag: '02',
    title: 'SetThreadContext rewrites the entry-point register to the Beacon start',
    story:
      'A write cursor sweeps across the saved start register, erasing the original destination and writing the exact address of the injected code.',
    technical:
      'SetThreadContext(0x01C8) → NtSetContextThread patches KTRAP_FRAME.Rcx = 0x004014A0 (Base 0x00400000 + EntryPoint RVA 0x14A0).',
  },
  {
    id: 2,
    tag: '03',
    title: 'ResumeThread releases the pause counter and launches execution into Beacon',
    story:
      'The release lever drops, the frost lock shatters, and the pause counter flips from one to zero. The launchpad jumps directly to the rewritten address.',
    technical:
      'ResumeThread(0x01C8) → NtResumeThread returns PreviousSuspendCount = 1; SuspendCount becomes 0; RtlUserThreadStart jumps to RCX (0x004014A0).',
  },
  {
    id: 3,
    tag: '04',
    title: 'Waking the tampered thread triggers kernel ProcessTampering detection',
    story:
      'The instant the worker starts executing, a core integrity check sees that the live memory no longer matches the signed file on disk and stamps an alert.',
    technical:
      'Kernel image-tampering callback fires Sysmon EID 25 (ProcessTampering · Type: "Image is replaced") on svchost.exe (PID 4892).',
  },
  {
    id: 4,
    tag: '05',
    title: 'The original loader exits cleanly without calling CreateRemoteThread',
    story:
      'Because no noisy remote-thread call was used, the initial dropper can close and disappear while the hijacked worker keeps running inside the trusted host.',
    technical:
      'CreateRemoteThread is NOT used (evades Sysmon EID 8). Invoice_Q4.exe (PID 3104) may exit while TID 4896 runs Beacon inside PID 4892.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'THREAD', transform: 'scale(1.42) translate(18%, 8%)' },
  { id: 'RCX', transform: 'scale(1.38) translate(-2%, 8%)' },
  { id: 'RESUME', transform: 'scale(1.42) translate(-18%, 6%)' },
];

export default function Step4ContextClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    gsap.set(q('.key-thr'), { x: -64, autoAlpha: 0 });
    gsap.set(q('.frost-shield'), { autoAlpha: 0.92, scale: 1, transformOrigin: '50% 50%' });
    gsap.set(q('.running-badge'), { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
    gsap.set(q('.ctx-read'), { strokeDashoffset: 100 });
    gsap.set(q('.rcx-cursor'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.rcx-old'), { autoAlpha: 1 });
    gsap.set(q('.rcx-new'), { autoAlpha: 0 });
    gsap.set(q('.rva-formula'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.ktrap-badge'), { autoAlpha: 0, y: 6 });
    gsap.set(q('.lever-arm'), { rotate: -38, svgOrigin: '916 188' });
    gsap.set(q('.digit-one'), { autoAlpha: 1, y: 0 });
    gsap.set(q('.digit-zero'), { autoAlpha: 0, y: 14 });
    gsap.set(q('.prev-ret'), { autoAlpha: 0, y: 6 });
    gsap.set(q('.jump-arc'), { strokeDashoffset: 260, autoAlpha: 0 });
    gsap.set(q('.cpu-active'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });
    gsap.set(q('.eid25-stamp'), { autoAlpha: 0, scale: 1.3, transformOrigin: '50% 50%' });
    gsap.set(q('.crt-box'), { autoAlpha: 0.35 });
    gsap.set(q('.crt-strike'), { strokeDashoffset: 320, autoAlpha: 0 });
    gsap.set(q('.loader-card'), { x: 0, autoAlpha: 1 });
    gsap.set(q('.exited-note'), { autoAlpha: 0 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });

    const log = (sel: string, at: string | number) =>
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.35 }, at);

    // Beat 0: hThread 0x01C8 docks, GetThreadContext reads frozen KTRAP_FRAME
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.set(q('.key-thr'), { autoAlpha: 1 }, 'beat0');
    tl.to(q('.key-thr'), { x: 0, duration: clipPace.travel, ease: 'power2.out' }, 'beat0');
    tl.to(q('.ctx-read'), { strokeDashoffset: 0, duration: 0.75, ease: 'none' }, 'beat0+=0.55');
    log('.log-0', 'beat0+=0.9');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: SetThreadContext cursor sweeps across RCX -> overwrites with 0x004014A0
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.rcx-cursor'), { autoAlpha: 1, x: 0 }, 'beat1');
    tl.to(q('.rcx-cursor'), { x: 356, duration: clipPace.teach, ease: 'power1.inOut' }, 'beat1');
    tl.to(q('.rcx-old'), { autoAlpha: 0, duration: 0.45 }, 'beat1+=0.75');
    tl.to(q('.rcx-new'), { autoAlpha: 1, duration: 0.55 }, 'beat1+=0.95');
    tl.to(q('.rcx-cursor'), { autoAlpha: 0, duration: 0.2 }, 'beat1+=1.8');
    tl.to(q('.rva-formula'), { autoAlpha: 1, y: 0, duration: 0.55 }, 'beat1+=1.25');
    tl.to(q('.ktrap-badge'), { autoAlpha: 1, y: 0, duration: 0.5 }, 'beat1+=1.55');
    log('.log-1', 'beat1+=1.5');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: ResumeThread drops lever -> frost shatters -> SuspendCount 1->0 -> RIP jumps to RCX
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.lever-arm'), { rotate: 38, duration: clipPace.teach * 0.75, ease: 'power2.inOut' }, 'beat2');
    tl.to(q('.frost-shield'), { autoAlpha: 0, scale: 1.12, duration: 0.75, ease: 'power2.out' }, 'beat2+=0.45');
    tl.to(q('.running-badge'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, 'beat2+=0.85');
    tl.to(q('.digit-one'), { autoAlpha: 0, y: -14, duration: 0.4 }, 'beat2+=0.7');
    tl.to(q('.digit-zero'), { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.6)' }, 'beat2+=0.85');
    tl.to(q('.prev-ret'), { autoAlpha: 1, y: 0, duration: 0.45 }, 'beat2+=0.95');
    tl.set(q('.jump-arc'), { autoAlpha: 1 }, 'beat2+=1.1');
    tl.to(q('.jump-arc'), { strokeDashoffset: 0, duration: 0.85, ease: 'power2.out' }, 'beat2+=1.1');
    tl.to(q('.cpu-active'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 'beat2+=1.35');
    log('.log-2', 'beat2+=1.3');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: Sysmon EID 25 ProcessTampering stamp slams in
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.eid25-stamp'), { autoAlpha: 1 }, 'beat3');
    tl.to(q('.eid25-stamp'), { scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, 'beat3');
    log('.log-3', 'beat3+=0.4');
    tl.to({}, { duration: clipPace.hold });

    // Beat 4: CreateRemoteThread struck out; Invoice_Q4.exe detaches & exits
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.to(q('.crt-box'), { autoAlpha: 1, duration: 0.35 }, 'beat4');
    tl.set(q('.crt-strike'), { autoAlpha: 1 }, 'beat4+=0.15');
    tl.to(q('.crt-strike'), { strokeDashoffset: 0, duration: 0.65, ease: 'power2.out' }, 'beat4+=0.15');
    tl.to(q('.loader-card'), { x: 180, autoAlpha: 0, duration: clipPace.travel, ease: 'power2.in' }, 'beat4+=0.45');
    tl.to(q('.exited-note'), { autoAlpha: 1, duration: 0.5 }, 'beat4+=1.35');
    log('.log-4', 'beat4+=0.9');
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
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="GetThreadContext and SetThreadContext rewrite KTRAP_FRAME.Rcx to 0x004014A0 while RIP stays on ntdll!RtlUserThreadStart, ResumeThread flips SuspendCount 1 to 0, triggering Sysmon EID 25 while Invoice_Q4.exe exits"
      >
        <FilmBackdrop prefix="s4" />

        {/* Header */}
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} letterSpacing="0.14em">
          GetThreadContext / SetThreadContext (RCX) → ResumeThread
        </text>
        <text x="1172" y="28" textAnchor="end" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
          Target Thread: TID 4896 · svchost.exe (PID 4892)
        </text>

        {/* Left Panel: Thread Handle & Frozen/Running State */}
        <rect x="28" y="48" width="260" height="270" rx="12" fill="#082438" stroke="#38bdf8" strokeWidth="2" />
        <rect x="28" y="48" width="260" height="30" rx="12" fill="#0c4a6e" />
        <text x="158" y="68" textAnchor="middle" fill="#e0f2fe" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          TARGET THREAD · TID 4896
        </text>

        {/* hThread Key Dock */}
        <rect x="44" y="90" width="228" height="36" rx="7" fill="#020617" stroke="#334155" strokeDasharray="4 3" />
        <g className="key-thr">
          <rect x="48" y="94" width="220" height="28" rx="5" fill="#4c0519" stroke="#fb7185" strokeWidth="1.5" />
          <circle cx="66" cy="108" r="6" fill="none" stroke="#fb7185" strokeWidth="2.2" />
          <rect x="72" y="105" width="12" height="5" rx="1" fill="#fb7185" />
          <text x="94" y="112" fill="#fecdd3" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            hThread = 0x01C8
          </text>
        </g>

        <text x="158" y="150" textAnchor="middle" fill="#bae6fd" fontSize="12" fontFamily={FONT} fontWeight="700">
          svchost.exe · PID 4892
        </text>
        <text x="158" y="168" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>
          Created in Step #1 (0x00000004)
        </text>

        {/* Running Badge (under frost shield, revealed when frost shatters) */}
        <g className="running-badge">
          <rect x="48" y="186" width="220" height="112" rx="9" fill="#052e16" stroke="#4ade80" strokeWidth="2" filter="url(#s4-soft-glow)" />
          <text x="158" y="218" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT} fontWeight="700">
            SCHEDULER ACTIVE
          </text>
          <text x="158" y="248" textAnchor="middle" fill="#dcfce7" fontSize="16" fontFamily={FONT} fontWeight="700">
            RUNNING BEACON
          </text>
          <text x="158" y="274" textAnchor="middle" fill="#4ade80" fontSize="11" fontFamily={FONT}>
            TID 4896 @ 0x004014A0
          </text>
        </g>

        {/* Frost Shield */}
        <g className="frost-shield">
          <rect x="48" y="186" width="220" height="112" rx="9" fill="#083344" stroke="#67e8f9" strokeWidth="2" />
          <path d="M 60 198 L 256 286 M 256 198 L 60 286" stroke="#22d3ee" strokeWidth="1" opacity="0.22" />
          <text x="158" y="232" textAnchor="middle" fill="#a5f3fc" fontSize="15" fontFamily={FONT} fontWeight="700">
            SUSPENDED
          </text>
          <text x="158" y="256" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily={FONT}>
            Parked before instruction 0
          </text>
          <text x="158" y="276" textAnchor="middle" fill="#22d3ee" fontSize="10.5" fontFamily={FONT}>
            SuspendCount = 1
          </text>
        </g>

        {/* Conduit Left -> Center */}
        <path d="M 288 182 H 316" fill="none" stroke="#1e293b" strokeWidth="4" />
        <path
          className="ctx-read"
          d="M 288 182 H 316"
          fill="none"
          stroke="#fb7185"
          strokeWidth="2.5"
          strokeDasharray="100"
          markerEnd="url(#s4-arrow-rose)"
        />

        {/* Center Panel: x64 KTRAP_FRAME Register Console */}
        <rect x="320" y="48" width="528" height="270" rx="12" fill="#0c1120" stroke="#fb7185" strokeWidth="2" />
        <rect x="320" y="48" width="528" height="30" rx="12" fill="#4c0519" />
        <text x="584" y="68" textAnchor="middle" fill="#ffe4e6" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          x64 KTRAP_FRAME · GetThreadContext → SetThreadContext
        </text>

        {/* RIP Register (Launchpad — unchanged!) */}
        <rect x="340" y="92" width="420" height="50" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="356" y="112" fill="#7dd3fc" fontSize="10" fontFamily={FONT} fontWeight="700">
          RIP (THREAD LAUNCHPAD · UNCHANGED)
        </text>
        <text x="356" y="132" fill="#e0f2fe" fontSize="14.5" fontFamily={FONT} fontWeight="700">
          ntdll!RtlUserThreadStart
        </text>

        {/* RCX Register (Upcoming Startup Entry — Rewritten!) */}
        <rect x="340" y="156" width="420" height="86" rx="8" fill="#180a13" stroke="#fb7185" strokeWidth="2" />
        <text x="356" y="176" fill="#fda4af" fontSize="10" fontFamily={FONT} fontWeight="700">
          RCX (x64 INITIAL ENTRY REGISTER · REWRITTEN)
        </text>
        <text className="rcx-old" x="356" y="214" fill="#cbd5e1" fontSize="20" fontFamily={FONT} fontWeight="700">
          svchost!MainCRTStartup
        </text>
        <text className="rcx-new" x="356" y="216" fill="#fb7185" fontSize="26" fontFamily={FONT} fontWeight="700" filter="url(#s4-soft-glow)">
          0x004014A0
        </text>
        <text className="rcx-new" x="546" y="214" fill="#fde68a" fontSize="12" fontFamily={FONT} fontWeight="700">
          (Beacon Entry)
        </text>

        {/* Animated Hex Write Cursor sweeping across RCX */}
        <g className="rcx-cursor">
          <rect x="352" y="184" width="10" height="44" rx="2" fill="#fbbf24" filter="url(#s4-soft-glow)" />
        </g>

        {/* Formula Callout */}
        <g className="rva-formula">
          <rect x="340" y="254" width="276" height="44" rx="7" fill="#291a04" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="478" y="272" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily={FONT} fontWeight="700">
            ENTRY POINT CALCULATION
          </text>
          <text x="478" y="290" textAnchor="middle" fill="#fef3c7" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            0x00400000 + RVA 0x14A0
          </text>
        </g>

        <g className="ktrap-badge">
          <rect x="628" y="254" width="204" height="44" rx="7" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="730" y="272" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily={FONT} fontWeight="700">
            KERNEL SYSCALL
          </text>
          <text x="730" y="290" textAnchor="middle" fill="#e9d5ff" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            NtSetContextThread
          </text>
        </g>

        {/* Animated Jump Arc from RIP -> RCX */}
        <path
          className="jump-arc"
          d="M 762 117 C 824 117 824 202 764 202"
          fill="none"
          stroke="#4ade80"
          strokeWidth="3.5"
          strokeDasharray="260"
          markerEnd="url(#s4-arrow-emerald)"
          filter="url(#s4-soft-glow)"
        />
        <text className="jump-arc" x="802" y="164" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily={FONT} fontWeight="700">
          JMP
        </text>

        {/* Right Panel: Kernel Scheduler & Mechanical Resume Lever */}
        <rect x="872" y="48" width="300" height="270" rx="12" fill="#091525" stroke="#38bdf8" strokeWidth="2" />
        <rect x="872" y="48" width="300" height="30" rx="12" fill="#0c4a6e" />
        <text x="1022" y="68" textAnchor="middle" fill="#e0f2fe" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          ResumeThread → NtResumeThread
        </text>

        {/* Mechanical Release Lever Housing */}
        <rect x="892" y="114" width="48" height="148" rx="8" fill="#020617" stroke="#334155" />
        <text x="916" y="132" textAnchor="middle" fill="#67e8f9" fontSize="8.5" fontFamily={FONT}>HOLD</text>
        <text x="916" y="252" textAnchor="middle" fill="#4ade80" fontSize="8.5" fontFamily={FONT}>RUN</text>
        <g className="lever-arm">
          <rect x="910" y="142" width="12" height="46" rx="4" fill="#f43f5e" />
          <circle cx="916" cy="142" r="8" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        <circle cx="916" cy="188" r="6" fill="#94a3b8" />

        {/* SuspendCount Flip Display */}
        <circle cx="1058" cy="176" r="56" fill="#020617" stroke="#38bdf8" strokeWidth="2.5" />
        <text className="digit-one" x="1058" y="192" textAnchor="middle" fill="#67e8f9" fontSize="44" fontFamily={FONT} fontWeight="700">
          1
        </text>
        <text className="digit-zero" x="1058" y="192" textAnchor="middle" fill="#4ade80" fontSize="44" fontFamily={FONT} fontWeight="700" filter="url(#s4-soft-glow)">
          0
        </text>
        <text x="1058" y="250" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          SuspendCount
        </text>

        <g className="prev-ret">
          <rect x="962" y="88" width="192" height="24" rx="5" fill="#052e16" stroke="#4ade80" />
          <text x="1058" y="104" textAnchor="middle" fill="#bbf7d0" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            PreviousSuspendCount = 1
          </text>
        </g>

        <g className="cpu-active">
          <rect x="962" y="266" width="192" height="34" rx="7" fill="#052e16" stroke="#4ade80" strokeWidth="1.75" />
          <text x="1058" y="288" textAnchor="middle" fill="#86efac" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            CPU DISPATCHED · LIVE
          </text>
        </g>

        {/* Bottom Witness, Negative Claim & Loader Exit Row */}
        <g className="crt-box">
          <rect x="28" y="340" width="290" height="84" rx="10" fill="#1e293b" stroke="#fb7185" strokeWidth="1.75" />
          <text x="173" y="366" textAnchor="middle" fill="#fda4af" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            NEGATIVE CLAIM · NOT CALLED
          </text>
          <text x="173" y="392" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily={FONT} fontWeight="700">
            CreateRemoteThread
          </text>
          <text x="173" y="412" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
            No Sysmon EID 8 fired
          </text>
          <path
            className="crt-strike"
            d="M 48 378 L 298 396 M 298 378 L 48 396"
            stroke="#f43f5e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="320"
          />
        </g>

        <g className="eid25-stamp">
          <rect x="338" y="340" width="446" height="84" rx="10" fill="#451a03" stroke="#fbbf24" strokeWidth="2.5" filter="url(#s4-soft-glow)" />
          <text x="561" y="368" textAnchor="middle" fill="#fcd34d" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            KERNEL IMAGE-TAMPERING CALLBACK
          </text>
          <text x="561" y="394" textAnchor="middle" fill="#fef3c7" fontSize="16" fontFamily={FONT} fontWeight="700">
            SYSMON EID 25 · Image is replaced
          </text>
          <text x="561" y="414" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>
            Live RAM @ 0x00400000 ≠ Signed svchost.exe on disk
          </text>
        </g>

        {/* Exited Note (revealed underneath when loader exits) */}
        <g className="exited-note">
          <rect x="804" y="340" width="368" height="84" rx="10" fill="#091525" stroke="#4ade80" strokeDasharray="5 4" />
          <text x="988" y="374" textAnchor="middle" fill="#86efac" fontSize="12.5" fontFamily={FONT} fontWeight="700">
            Invoice_Q4.exe (PID 3104) EXITED
          </text>
          <text x="988" y="398" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Beacon persists autonomously on TID 4896 (PID 4892)
          </text>
        </g>

        {/* Loader Card that slides off right */}
        <g className="loader-card">
          <rect x="804" y="340" width="368" height="84" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.75" />
          <text x="988" y="368" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontFamily={FONT} fontWeight="700">
            Invoice_Q4.exe (PID 3104)
          </text>
          <text x="988" y="390" textAnchor="middle" fill="#a5b4fc" fontSize="11.5" fontFamily={FONT}>
            Stage-1 Dropper · Mission Complete
          </text>
          <text x="988" y="410" textAnchor="middle" fill="#818cf8" fontSize="10.5" fontFamily={FONT}>
            Can terminate while hollowed svchost runs
          </text>
        </g>

        {/* Event Log */}
        <text className="clip-label" x="28" y="454" fill="#475569" fontSize="10" fontFamily={FONT} letterSpacing="0.14em">
          SYSCALL &amp; TELEMETRY TRACE
        </text>
        {[
          ['log-0', 'GetThreadContext(0x01C8): RIP = ntdll!RtlUserThreadStart, RCX = svchost entry, SuspendCount = 1'],
          ['log-1', 'SetThreadContext(0x01C8) → NtSetContextThread rewrites KTRAP_FRAME.Rcx = 0x004014A0'],
          ['log-2', 'ResumeThread(0x01C8) flips SuspendCount 1 → 0 (prev = 1) · RtlUserThreadStart jumps to RCX'],
          ['log-3', 'Sysmon EID 25 fires: ProcessTampering ("Image is replaced") on PID 4892'],
          ['log-4', 'CreateRemoteThread never called · Invoice_Q4.exe exits · TID 4896 stays live'],
        ].map(([cls, text], i) => (
          <text
            key={cls}
            className={`log-line ${cls}`}
            x="28"
            y={478 + i * 26}
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
