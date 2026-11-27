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
    title: 'APP-JVM-01 initiates unexpected outbound TCP/1389 connection to external IP',
    story: 'A crimson canister streaks out through the mailroom’s overhead street vacuum tube.',
    technical: 'Zeek network telemetry logs 10.20.40.22 -> 198.51.100.42:1389 (LDAP javaNamingReference).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Linux auditd syscall=59 (execve) flags parent java spawning /bin/sh',
    story: 'The mailroom clerk unexpectedly picks up a heavy workshop wrench—tripping the internal siren.',
    technical: 'auditd logs ppid=4418 (java) spawning pid=5102 comm="sh" under uid=1001 (appuser).',
  },
  {
    id: 2,
    tag: '03',
    title: 'Behavioral detection is 100% immune to HTTP header string obfuscation',
    story: 'No matter how an envelope label was worded, the street tube shot and wrench alarm cannot hide.',
    technical: 'Outbound LDAP/RMI + java child shell prove active compromise rather than passive scanning.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Trigger immediate P1 isolation, re-imaging, and credential rotation',
    story: 'Security locks down the affected station and rotates every workshop key on sight.',
    technical: 'Deploy Sigma auditd rule (parent_comm=java -> sh/bash/curl/wget) + Zeek egress alerting.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'ZEEK', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'AUDITD', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SIGMA', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function Log4jStep3EgressClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.l3-w1, .l3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.l3-aud, .l3-ver, .l3-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.l3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.l3-aud'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.l3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.l3-ver'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.l3-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-log4j-step3"
      stageLabel="STEP #3"
      mitreId="T1059.004"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Zeek outbound LDAP egress and Linux auditd java child process detection">
        <FilmBackdrop prefix="l3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          EVASION-RESISTANT DFIR · ZEEK OUTBOUND DIRECTORY EGRESS + LINUX AUDITD EXECVE
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          APP-JVM-01 · 10.20.40.22
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>ZEEK EGRESS TELEMETRY</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>App Tier -&gt; TCP/1389</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>10.20.40.22 -&gt; External</text>
        <text x="190" y="278" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Proto: LDAP / RMI (1389)</text>
        <text x="190" y="300" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>javaNamingReference Seen</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Zero Legit Reason</text>
        <text x="190" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Web APIs never call external</text>
        <text x="190" y="414" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>LDAP or RMI servers</text>

        <line className="l3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="l3-aud">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>LINUX AUDITD EXECVE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>syscall=59 Process Lineage</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="700" fontFamily={FONT}>ppid=4418 (java) -&gt; sh</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>pid=5102 comm=&quot;sh&quot; uid=1001</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Anomalous Child Shell Spawn</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Obfuscation-Proof</text>
          <text x="590" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Catches every WAF bypass</text>
        </g>

        <line className="l3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#ef4444" strokeWidth="4" />

        <g className="l3-ver">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>CONFIRMED BREACH</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Not Just Scanning</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Dual Behavioral Proof</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>1. Outbound TCP/1389 Hit</text>
          <text x="1000" y="306" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>2. Java Spawned /bin/sh</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>P1 RESPONSE</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Isolate + Rebuild + Rotate Keys</text>
        </g>

        <g className="l3-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SIGMA RULE: auditd syscall=execve WHERE parent_comm == &quot;java&quot; AND comm IN (sh, bash, dash, curl, wget)
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Pair with Zeek outbound TCP/389/636/1389/1099 alerting to catch exploitation regardless of HTTP syntax
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
