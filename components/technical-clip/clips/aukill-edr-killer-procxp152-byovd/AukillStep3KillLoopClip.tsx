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
    title: 'AuKill runs a continuous termination loop targeting every matching EDR and AV process',
    story: 'Each time a watchtower generator restarts, the saboteur immediately pulls its main breaker lever dark again.',
    technical: 'Loop scans process snapshots every second and invokes TerminateProcess via kernel-granted handles.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Windows Service Control Manager logs repeated unexpected termination events (EID 7031)',
    story: 'A distant relay box clicks loudly each time a guard tower loses power and tries to restart.',
    technical: 'System Event ID 7031 records WinDefend or EDR agent services terminating unexpectedly in rapid bursts.',
  },
  {
    id: 2,
    tag: '03',
    title: 'With telemetry blinded, ransomware payloads deploy unopposed across the host',
    story: 'Once all three watchtower searchlights go dark, thieves roll heavy crates straight across the plant floor.',
    technical: 'Medusa Locker or LockBit affiliates launch encryption immediately after EDR heartbeat drops.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Cloud SIEM heartbeat-loss alerts detect blinded endpoints even when local logs stop',
    story: 'Headquarters sounds an alarm the second a power station stops checking in on the radio schedule.',
    technical: 'Trigger high-priority SOC alerts on EDR sensor silence paired with prior Sysmon EID 6 driver loads.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'KILL LOOP', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'BLACKOUT', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'HEARTBEAT', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function AukillStep3KillLoopClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.auk3-w1, .auk3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.auk3-mid, .auk3-right, .auk3-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.auk3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.auk3-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.auk3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.auk3-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.auk3-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-aukill-step3"
      stageLabel="STEP #3"
      mitreId="T1562.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="AuKill continuous EDR termination loop causing sensor blackout prior to ransomware">
        <FilmBackdrop prefix="auk3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          IMPAIR DEFENSES · CONTINUOUS EDR KILL LOOP &amp; SENSOR BLACKOUT
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          EID 7031 BURST · T1562.001
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>CONTINUOUS KILL LOOP</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>1-Second Process Sweep</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Targets MsMpEng / CrowdStrike</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>SentinelOne / CarbonBlack</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Kills Respawned Services</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SCM Recovery Defeated</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Auto-restart services are</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>immediately killed again</text>

        <line className="auk3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="auk3-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>ENDPOINT TELEMETRY BLIND</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Ransomware Staging Opens</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>System Event ID 7031</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Service Terminated Unexpectedly</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>EDR Heartbeat Drops To Zero</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Follow-On Payload</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Encryption runs unblocked</text>
        </g>

        <line className="auk3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="auk3-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>OUT-OF-BAND SIEM ALERT</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Heartbeat Silence Correlation</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>EID 7045 -&gt; EID 7031</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Followed by Sensor Offline</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Triggers Auto Network Isolate</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SOC PLAYBOOK</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Quarantine host at switch/FW</text>
        </g>

        <g className="auk3-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SOC RULE: Alert immediately when System EID 7045 driver creation is followed by EID 7031 EDR crashes
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Forward Windows System and Sysmon logs off-host in real time so endpoint blinding never erases evidence
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
