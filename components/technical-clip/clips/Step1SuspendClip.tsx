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
    title: 'The loader sends a paused launch call across the kernel boundary',
    story:
      'Instead of running a new program directly, the initial file hands a trusted system program path and a pause switch into the operating system launch gate.',
    technical:
      'Invoice_Q4.exe (PID 3104) calls CreateProcessW("C:\\Windows\\System32\\svchost.exe", dwCreationFlags = 0x00000004) → ntdll!NtCreateUserProcess.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The kernel builds a real signed process record and maps its code',
    story:
      'Inside the protected core, the system creates an official process record, maps the signed system code plus its core bridge library, and prepares one worker thread.',
    technical:
      'Kernel creates EPROCESS (PID 4892), maps signed svchost.exe SEC_IMAGE @ 0x00400000 + ntdll.dll (R-X), and creates primary thread TID 4896.',
  },
  {
    id: 2,
    tag: '03',
    title: 'The suspend flag freezes the worker thread before instruction zero',
    story:
      'The launch dial locks onto paused. A clamp intercepts the processor pulse so the new worker thread waits at the starting line without running a single instruction.',
    technical:
      'CREATE_SUSPENDED (0x00000004) parks TID 4896 at RIP = ntdll!RtlUserThreadStart with SuspendCount = 1.',
  },
  {
    id: 3,
    tag: '04',
    title: 'The kernel returns full-control memory and thread handles',
    story:
      'The startup receipt travels back to the loader carrying two full-control keys: one to rewrite the child’s memory and one to steer and wake its frozen thread.',
    technical:
      'PROCESS_INFORMATION returns hProcess = 0x01C4 (Steps #2–#3) and hThread = 0x01C8 (Step #4) with PROCESS_ALL_ACCESS (0x1FFFFF).',
  },
  {
    id: 4,
    tag: '05',
    title: 'Process creation telemetry flags the wrong parent and missing flag',
    story:
      'A monitoring sensor compares who started this system host against the normal service manager. The parent does not match and the required group option is missing.',
    technical:
      'Sysmon EID 1 (ProcessCreate): ParentImage = Invoice_Q4.exe (expected services.exe) and CommandLine lacks "-k <ServiceGroup>".',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SYSCALL', transform: 'scale(1.42) translate(14%, 8%)' },
  { id: 'KERNEL', transform: 'scale(1.38) translate(-16%, 8%)' },
  { id: 'HANDLES', transform: 'scale(1.35) translate(0%, -14%)' },
];

export default function Step1SuspendClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    gsap.set(q('.bus-call'), { strokeDashoffset: 120 });
    gsap.set(q('.bus-kernel'), { strokeDashoffset: 120 });
    gsap.set(q('.bus-return'), { strokeDashoffset: 760 });
    gsap.set(q('.arg-chip'), { x: -48, autoAlpha: 0 });
    gsap.set(q('.flag-chip'), { x: -48, autoAlpha: 0 });
    gsap.set(q('.dial-needle'), { rotate: -55, svgOrigin: '412 222' });
    gsap.set(q('.gate-state'), { autoAlpha: 0 });
    gsap.set(q('.gate-state.standby'), { autoAlpha: 1 });
    gsap.set(q('.eprocess-part'), { autoAlpha: 0, y: 12 });
    gsap.set(q('.sec-row'), { autoAlpha: 0, x: -10 });
    gsap.set(q('.ntdll-bar'), { autoAlpha: 0, y: 8 });
    gsap.set(q('.thread-box'), { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 50%' });
    gsap.set(q('.cpu-pulse'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.freeze-clamp'), { autoAlpha: 0, scaleY: 0, transformOrigin: '50% 0%' });
    gsap.set(q('.freeze-shield'), { autoAlpha: 0 });
    gsap.set(q('.count-zero'), { autoAlpha: 1 });
    gsap.set(q('.count-one'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });
    gsap.set(q('.handle-card'), { autoAlpha: 0, x: 40 });
    gsap.set(q('.access-seal'), { autoAlpha: 0, scale: 0.75, transformOrigin: '50% 50%' });
    gsap.set(q('.eid-expected'), { autoAlpha: 0, x: -14 });
    gsap.set(q('.eid-observed'), { autoAlpha: 0, x: 14 });
    gsap.set(q('.eid-mismatch'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });

    const log = (sel: string, at: string | number) =>
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.35 }, at);

    // Beat 0: Invoice_Q4.exe sends CreateProcessW(svchost.exe, CREATE_SUSPENDED)
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.set(q('.arg-chip, .flag-chip'), { autoAlpha: 1 }, 'beat0');
    tl.to(q('.bus-call'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to(q('.arg-chip'), { x: 0, duration: clipPace.travel, ease: 'power2.out' }, 'beat0');
    tl.to(q('.flag-chip'), { x: 0, duration: clipPace.travel, ease: 'power2.out' }, 'beat0+=0.25');
    tl.to(q('.gate-state.standby'), { autoAlpha: 0, duration: 0.2 }, 'beat0+=1.0');
    tl.to(q('.gate-state.syscall'), { autoAlpha: 1, duration: 0.3 }, 'beat0+=1.1');
    log('.log-0', 'beat0+=1.15');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: Kernel constructs EPROCESS PID 4892, maps SEC_IMAGE + ntdll.dll, builds TID 4896
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.eprocess-part'), { autoAlpha: 1, y: 0 }, 'beat1');
    tl.to(q('.bus-kernel'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat1');
    tl.to(
      q('.sec-row'),
      { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.32, ease: 'power2.out' },
      'beat1+=0.2'
    );
    tl.to(q('.ntdll-bar'), { autoAlpha: 1, y: 0, duration: 0.55 }, 'beat1+=1.15');
    tl.to(q('.thread-box'), { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' }, 'beat1+=1.35');
    log('.log-1', 'beat1+=1.6');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: CREATE_SUSPENDED dial locks -> CPU pulse intercepted -> SuspendCount flips 0 -> 1
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.set(q('.cpu-pulse'), { autoAlpha: 1, x: 0 }, 'beat2');
    tl.to(q('.dial-needle'), { rotate: 58, duration: clipPace.teach, ease: 'power2.inOut' }, 'beat2');
    tl.to(q('.cpu-pulse'), { x: 74, duration: 0.9, ease: 'power1.out' }, 'beat2+=0.15');
    tl.to(q('.freeze-clamp'), { autoAlpha: 1, scaleY: 1, duration: 0.65, ease: 'power3.out' }, 'beat2+=0.9');
    tl.to(q('.freeze-shield'), { autoAlpha: 1, duration: 0.55 }, 'beat2+=1.1');
    tl.to(q('.gate-state.syscall'), { autoAlpha: 0, duration: 0.2 }, 'beat2+=1.4');
    tl.to(q('.gate-state.frozen'), { autoAlpha: 1, duration: 0.35 }, 'beat2+=1.55');
    tl.to(q('.count-zero'), { autoAlpha: 0, duration: 0.25 }, 'beat2+=1.35');
    tl.to(q('.count-one'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, 'beat2+=1.45');
    log('.log-2', 'beat2+=1.7');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: PROCESS_INFORMATION returns hProcess 0x01C4 & hThread 0x01C8 (0x1FFFFF)
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.handle-proc'), { autoAlpha: 1 }, 'beat3');
    tl.to(q('.bus-return'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat3');
    tl.to(q('.handle-proc'), { x: 0, duration: clipPace.travel, ease: 'back.out(1.3)' }, 'beat3');
    tl.to(q('.handle-thr'), { autoAlpha: 1, x: 0, duration: clipPace.repeat, ease: 'back.out(1.3)' }, 'beat3+=0.65');
    tl.to(q('.access-seal'), { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 'beat3+=1.25');
    log('.log-3', 'beat3+=1.35');
    tl.to({}, { duration: clipPace.hold });

    // Beat 4: Sysmon EID 1 compares expected services.exe -k vs actual Invoice_Q4.exe
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.eid-expected'), { autoAlpha: 1, x: 0 }, 'beat4');
    tl.to(q('.eid-observed'), { autoAlpha: 1, x: 0, duration: 0.75, ease: 'power2.out' }, 'beat4+=0.15');
    tl.to(q('.eid-mismatch'), { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.8)' }, 'beat4+=0.65');
    log('.log-4', 'beat4+=0.9');
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
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="CreateProcessW with CREATE_SUSPENDED crosses from Ring 3 to Kernel Ring 0, freezes TID 4896 at RtlUserThreadStart, returns hProcess and hThread, and triggers Sysmon EID 1"
      >
        <FilmBackdrop prefix="s1" />

        {/* Header */}
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} letterSpacing="0.14em">
          RING 3 → RING 0 · CreateProcessW(CREATE_SUSPENDED)
        </text>
        <text x="1172" y="28" textAnchor="end" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
          WKS-04 · 10.10.4.15
        </text>

        {/* Ring 3 / Ring 0 Boundary */}
        <line x1="522" y1="42" x2="522" y2="324" stroke="#475569" strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="274" y="52" textAnchor="middle" fill="#64748b" fontSize="10.5" fontFamily={FONT} letterSpacing="0.12em">
          USER MODE (RING 3)
        </text>
        <text x="860" y="52" textAnchor="middle" fill="#38bdf8" fontSize="10.5" fontFamily={FONT} letterSpacing="0.12em">
          WINDOWS KERNEL (RING 0)
        </text>

        {/* Caller: Invoice_Q4.exe */}
        <rect x="28" y="64" width="218" height="248" rx="12" fill="#17153b" stroke="#818cf8" strokeWidth="2" />
        <rect x="28" y="64" width="218" height="30" rx="12" fill="#312e81" />
        <text x="137" y="84" textAnchor="middle" fill="#e0e7ff" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          PARENT LOADER
        </text>
        <text x="137" y="122" textAnchor="middle" fill="#f8fafc" fontSize="15" fontFamily={FONT} fontWeight="700">
          Invoice_Q4.exe
        </text>
        <text x="137" y="146" textAnchor="middle" fill="#a5b4fc" fontSize="12.5" fontFamily={FONT}>
          PID 3104 · PPID 2410
        </text>
        <text x="137" y="168" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily={FONT}>
          explorer.exe → Downloads
        </text>

        <rect x="44" y="188" width="186" height="44" rx="7" fill="#0f172a" stroke="#6366f1" />
        <text x="137" y="207" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontFamily={FONT} fontWeight="700">
          CreateProcessW()
        </text>
        <text x="137" y="223" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={FONT}>
          kernel32.dll → ntdll.dll
        </text>

        <rect x="44" y="246" width="186" height="50" rx="7" fill="#0b1120" stroke="#475569" strokeDasharray="4 3" />
        <text x="137" y="266" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>
          PROCESS_INFORMATION
        </text>
        <text x="137" y="284" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>
          awaits hProcess &amp; hThread
        </text>

        {/* Call Conduit (Caller -> Syscall Gate) */}
        <path
          d="M 246 112 H 322 M 246 158 H 322"
          fill="none"
          stroke="#1e293b"
          strokeWidth="4"
        />
        <path
          className="bus-call"
          d="M 246 112 H 322 M 246 158 H 322"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="120"
          markerEnd="url(#s1-arrow-cyan)"
        />

        {/* Syscall Gate: ntdll!NtCreateUserProcess */}
        <rect x="326" y="64" width="174" height="248" rx="12" fill="#0c1528" stroke="#38bdf8" strokeWidth="2" />
        <text x="413" y="86" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          SYSCALL GATE
        </text>
        <text x="413" y="102" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={FONT}>
          NtCreateUserProcess
        </text>

        {/* Argument chips landing inside Syscall Gate */}
        <g className="arg-chip">
          <rect x="338" y="110" width="150" height="26" rx="5" fill="#1e1b4b" stroke="#818cf8" />
          <text x="413" y="127" textAnchor="middle" fill="#e0e7ff" fontSize="10.5" fontFamily={FONT}>
            System32\svchost.exe
          </text>
        </g>
        <g className="flag-chip">
          <rect x="338" y="144" width="150" height="26" rx="5" fill="#083344" stroke="#22d3ee" strokeWidth="1.5" />
          <text x="413" y="161" textAnchor="middle" fill="#a5f3fc" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            FLAG 0x00000004
          </text>
        </g>

        {/* Rotary Creation Mode Dial */}
        <circle cx="412" cy="222" r="38" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
        <path d="M 382 204 A 34 34 0 0 1 442 204" fill="none" stroke="#334155" strokeWidth="3" />
        <path d="M 434 244 A 34 34 0 0 1 446 218" fill="none" stroke="#22d3ee" strokeWidth="4" />
        <text x="383" y="200" fill="#64748b" fontSize="8.5" fontFamily={FONT}>RUN</text>
        <text x="424" y="251" fill="#67e8f9" fontSize="8.5" fontFamily={FONT} fontWeight="700">0x4</text>
        <line
          className="dial-needle"
          x1="412"
          y1="222"
          x2="412"
          y2="190"
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="412" cy="222" r="4.5" fill="#38bdf8" />

        <text className="gate-state standby" x="413" y="286" textAnchor="middle" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          STANDBY
        </text>
        <text className="gate-state syscall" x="413" y="286" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          RING 0 SYSCALL
        </text>
        <text className="gate-state frozen" x="413" y="286" textAnchor="middle" fill="#67e8f9" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          SUSPENDED (0x4)
        </text>

        {/* Conduit into Kernel */}
        <path d="M 500 188 H 544" fill="none" stroke="#1e293b" strokeWidth="4" />
        <path
          className="bus-kernel"
          d="M 500 188 H 544"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="120"
          markerEnd="url(#s1-arrow-cyan)"
        />

        {/* Kernel Chamber: EPROCESS PID 4892 */}
        <g className="eprocess-part">
          <rect x="548" y="64" width="624" height="248" rx="12" fill="#0b1324" stroke="#334155" strokeWidth="2" />
          <rect x="548" y="64" width="624" height="32" rx="12" fill="#172554" />
          <text x="568" y="85" fill="#e0f2fe" fontSize="12" fontFamily={FONT} fontWeight="700">
            EPROCESS · svchost.exe (PID 4892)
          </text>
          <text x="1154" y="85" textAnchor="end" fill="#86efac" fontSize="11" fontFamily={FONT} fontWeight="700">
            Signed Microsoft Binary
          </text>

          {/* Left sub-chamber: Virtual Memory Mapped */}
          <rect x="566" y="108" width="290" height="190" rx="9" fill="#09101d" stroke="#1e3a5f" />
          <text x="582" y="128" fill="#7dd3fc" fontSize="11" fontFamily={FONT} fontWeight="700">
            MAPPED IMAGE @ 0x00400000
          </text>
          {[
            ['.text · Signed Code', 'R-X (0x20)', 140],
            ['.rdata · Constants', 'R-- (0x02)', 174],
            ['.data · Variables', 'RW- (0x04)', 208],
          ].map(([label, perm, y]) => (
            <g key={label} className="sec-row cutaway-guts">
              <rect x="580" y={Number(y)} width="262" height="26" rx="5" fill="#052e16" stroke="#4ade80" />
              <text x="592" y={Number(y) + 17} fill="#dcfce7" fontSize="11" fontFamily={FONT} fontWeight="700">
                {label}
              </text>
              <text x="830" y={Number(y) + 17} textAnchor="end" fill="#86efac" fontSize="10.5" fontFamily={FONT}>
                {perm}
              </text>
            </g>
          ))}
          <g className="ntdll-bar cutaway-guts">
            <rect x="580" y="250" width="262" height="34" rx="5" fill="#0c4a6e" stroke="#38bdf8" />
            <text x="592" y="271" fill="#e0f2fe" fontSize="11" fontFamily={FONT} fontWeight="700">
              ntdll.dll · Syscall Bridge
            </text>
            <text x="830" y="271" textAnchor="end" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>
              R-X
            </text>
          </g>

          {/* Right sub-chamber: Primary Thread TID 4896 */}
          <g className="thread-box">
            <rect x="874" y="108" width="280" height="190" rx="9" fill="#09101d" stroke="#0e7490" strokeWidth="1.75" />
            <text x="890" y="128" fill="#a5f3fc" fontSize="11" fontFamily={FONT} fontWeight="700">
              PRIMARY THREAD · TID 4896
            </text>
            <rect x="890" y="140" width="248" height="36" rx="6" fill="#0f172a" stroke="#334155" />
            <text x="902" y="156" fill="#94a3b8" fontSize="9.5" fontFamily={FONT}>
              PARKED LAUNCHPAD (RIP)
            </text>
            <text x="902" y="170" fill="#e0f2fe" fontSize="11.5" fontFamily={FONT} fontWeight="700">
              ntdll!RtlUserThreadStart
            </text>

            {/* Scheduler Pulse Rail intercepted by Freeze Clamp */}
            <text x="890" y="198" fill="#64748b" fontSize="9.5" fontFamily={FONT}>
              CPU SCHEDULER DISPATCH
            </text>
            <line x1="890" y1="214" x2="1032" y2="214" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <circle className="cpu-pulse" cx="900" cy="214" r="6" fill="#fbbf24" filter="url(#s1-soft-glow)" />

            {/* Animated Freeze Clamp */}
            <g className="freeze-clamp">
              <rect x="978" y="198" width="12" height="32" rx="3" fill="#22d3ee" filter="url(#s1-soft-glow)" />
              <line x1="972" y1="202" x2="996" y2="226" stroke="#083344" strokeWidth="2.5" />
            </g>

            {/* SuspendCount Indicator */}
            <rect x="1044" y="188" width="94" height="52" rx="8" fill="#020617" stroke="#22d3ee" strokeWidth="1.5" />
            <text x="1091" y="203" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily={FONT}>
              SuspendCount
            </text>
            <text className="count-zero" x="1091" y="231" textAnchor="middle" fill="#64748b" fontSize="22" fontFamily={FONT} fontWeight="700">
              0
            </text>
            <text className="count-one" x="1091" y="231" textAnchor="middle" fill="#22d3ee" fontSize="24" fontFamily={FONT} fontWeight="700">
              1
            </text>

            <g className="freeze-shield">
              <rect x="890" y="252" width="248" height="32" rx="6" fill="#083344" stroke="#67e8f9" />
              <text x="1014" y="272" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontFamily={FONT} fontWeight="700">
                FROZEN · 0 INSTRUCTIONS RUN
              </text>
            </g>
          </g>
        </g>

        {/* Return Conduit: Kernel -> Invoice_Q4.exe (PROCESS_INFORMATION handles) */}
        <path
          d="M 860 312 V 370 H 137 V 316"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3"
        />
        <path
          className="bus-return"
          d="M 860 312 V 370 H 137 V 316"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeDasharray="760"
          markerEnd="url(#s1-arrow-amber)"
        />

        {/* Returned Handle Cards */}
        <g className="handle-card handle-proc cutaway-guts">
          <rect x="256" y="338" width="332" height="64" rx="10" fill="#291a04" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="288" cy="370" r="11" fill="none" stroke="#fbbf24" strokeWidth="3" />
          <rect x="299" y="366" width="24" height="8" rx="2" fill="#fbbf24" />
          <text x="336" y="364" fill="#fde68a" fontSize="13.5" fontFamily={FONT} fontWeight="700">
            hProcess = 0x01C4
          </text>
          <text x="336" y="386" fill="#fcd34d" fontSize="11" fontFamily={FONT}>
            Memory handle · Unmap &amp; Write (Steps #2–#3)
          </text>
        </g>

        <g className="handle-card handle-thr cutaway-guts">
          <rect x="610" y="338" width="332" height="64" rx="10" fill="#3b0718" stroke="#fb7185" strokeWidth="2" />
          <circle cx="642" cy="370" r="11" fill="none" stroke="#fb7185" strokeWidth="3" />
          <rect x="653" y="366" width="24" height="8" rx="2" fill="#fb7185" />
          <text x="690" y="364" fill="#fecdd3" fontSize="13.5" fontFamily={FONT} fontWeight="700">
            hThread = 0x01C8
          </text>
          <text x="690" y="386" fill="#fda4af" fontSize="11" fontFamily={FONT}>
            Thread handle · SetContext &amp; Resume (Step #4)
          </text>
        </g>

        <g className="access-seal">
          <rect x="962" y="344" width="210" height="52" rx="9" fill="#111827" stroke="#fbbf24" strokeWidth="1.75" />
          <text x="1067" y="366" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            PROCESS_ALL_ACCESS
          </text>
          <text x="1067" y="385" textAnchor="middle" fill="#fcd34d" fontSize="12" fontFamily={FONT} fontWeight="700">
            0x1FFFFF GRANTED
          </text>
        </g>

        {/* Bottom Witness: Sysmon EID 1 Parent Comparison */}
        <g className="eid-expected">
          <rect x="28" y="422" width="464" height="68" rx="10" fill="#052e16" stroke="#4ade80" strokeWidth="1.5" />
          <text x="48" y="446" fill="#86efac" fontSize="11" fontFamily={FONT} fontWeight="700">
            EXPECTED LEGITIMATE LINEAGE
          </text>
          <text x="48" y="472" fill="#dcfce7" fontSize="12.5" fontFamily={FONT}>
            services.exe → svchost.exe -k netsvcs
          </text>
        </g>

        <g className="eid-mismatch">
          <circle cx="520" cy="456" r="20" fill="#7f1d1d" stroke="#fb7185" strokeWidth="2" filter="url(#s1-soft-glow)" />
          <text x="520" y="463" textAnchor="middle" fill="#fecdd3" fontSize="20" fontFamily={FONT} fontWeight="700">
            ≠
          </text>
        </g>

        <g className="eid-observed">
          <rect x="548" y="422" width="624" height="68" rx="10" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <text x="568" y="446" fill="#fde68a" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            SYSMON EID 1 (ProcessCreate) · ANOMALOUS PARENT
          </text>
          <text x="568" y="472" fill="#fef3c7" fontSize="12.5" fontFamily={FONT}>
            Invoice_Q4.exe (3104) → svchost.exe (4892) · bare cmdline (no -k)
          </text>
        </g>

        {/* Compact Event Log */}
        <text className="clip-label" x="28" y="516" fill="#475569" fontSize="10" fontFamily={FONT} letterSpacing="0.14em">
          SYSCALL &amp; TELEMETRY TRACE
        </text>
        {[
          ['log-0', 'CreateProcessW("System32\\svchost.exe", 0x00000004) → ntdll!NtCreateUserProcess'],
          ['log-1', 'Kernel allocates EPROCESS PID 4892 · maps signed SEC_IMAGE @ 0x00400000 + ntdll.dll'],
          ['log-2', 'CREATE_SUSPENDED clamps TID 4896 at ntdll!RtlUserThreadStart · SuspendCount = 1'],
          ['log-3', 'PROCESS_INFORMATION returns hProcess 0x01C4 & hThread 0x01C8 (0x1FFFFF)'],
          ['log-4', 'Sysmon EID 1 alerts: non-services.exe parent spawning bare svchost.exe'],
        ].map(([cls, text], i) => (
          <text
            key={cls}
            className={`log-line ${cls}`}
            x="28"
            y={538 + i * 20}
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
