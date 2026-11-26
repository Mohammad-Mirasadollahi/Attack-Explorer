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
    title: 'ICONICSTEALER executes in memory and reads Chrome & Edge credential stores',
    story:
      'From inside the phone app, a hidden mechanical arm reaches sideways into the neighboring browser drawer to copy saved login ledgers.',
    technical:
      'ICONICSTEALER (0x000001C948280000) opens Chrome/Edge Login Data & History SQLite stores plus OS profile metadata (MITRE T1555.003).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Operators triage victim profiles and deploy Gopuram only to high-value firms',
    story:
      'While most victims only suffer quiet ledger theft, select finance and digital-asset desks receive a custom second-stage brass vault key.',
    technical:
      'Lazarus selectively pushes the Gopuram backdoor onto high-value cryptocurrency and financial targets identified via ICONICSTEALER.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Stolen profile data exfiltrates over TLS 443 to the lookalike relay',
    story:
      'Copied browser keys travel out through the encrypted relay tube disguised as normal office phone traffic.',
    technical:
      'Exfiltration beacons depart 3CXDesktopApp.exe (PID 7120) over HTTPS to akamaitechcloudservices[.]com.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Behavioral EDR fires when a signed VoIP binary reads browser Login Data',
    story:
      'The security alarm trips immediately because a desk telephone has zero legitimate reason to open a web browser password drawer.',
    technical:
      'CrowdStrike Falcon / EDR behavioral rule alerts on signed 3CXDesktopApp.exe reading %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'BROWSER VAULT', transform: 'scale(1.26) translate(60px, -25px)' },
  { id: 'GOPURAM', transform: 'scale(1.28) translate(-110px, -25px)' },
  { id: 'EDR ALERT', transform: 'scale(1.26) translate(-25px, -110px)' },
];

export function ThreeCxStep4StealerGopuramClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.steal-wire, .gop-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.vault-card, .gopuram-card, .edr-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.steal-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to(q('.vault-card'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'beat0+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.gop-wire'), { strokeDashoffset: 0, duration: 0.75, ease: 'none' }, 'beat1');
    tl.to(q('.gopuram-card'), { autoAlpha: 1, y: 0, duration: 0.65, ease: 'back.out(1.3)' }, 'beat1+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.gopuram-card'), { scale: 1.02, transformOrigin: 'center', duration: 0.5, yoyo: true, repeat: 1 }, 'beat2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.edr-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-threecx-step4"
      stageLabel="STEP #4"
      mitreId="T1555.003"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="ICONICSTEALER inside 3CXDesktopApp.exe reads Chrome and Edge Login Data, hands off selective targets to Gopuram backdoor, and triggers CrowdStrike behavioral EDR detection"
      >
        <FilmBackdrop prefix="cx4" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          CREDENTIAL HARVESTING · ICONICSTEALER → SELECTIVE GOPURAM · BEHAVIORAL EDR TRIP
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WKS-TRD-14 · Trading Desk Workstation
        </text>

        {/* ICONICSTEALER Implant */}
        <rect x="40" y="160" width="275" height="270" rx="14" fill="#450a0a" stroke="#ef4444" strokeWidth="2.4" />
        <text x="177" y="198" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
          ICONICSTEALER
        </text>
        <text x="177" y="222" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
          Inside 3CXDesktopApp.exe (PID 7120)
        </text>
        <rect x="60" y="246" width="235" height="160" rx="10" fill="#1f0a0a" stroke="#f87171" />
        <text x="177" y="278" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily={FONT}>
          Region: 0x000001C948280000
        </text>
        <text x="177" y="308" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
          Collects: System info + Browser DBs
        </text>
        <text x="177" y="338" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
          Zero separate child process spawned
        </text>
        <text x="177" y="372" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700" fontFamily={FONT}>
          Cross-App File Read Anomaly
        </text>

        <line className="steal-wire" x1="319" y1="295" x2="412" y2="295" stroke="#f59e0b" strokeWidth="4" />

        {/* Browser Vault */}
        <g className="vault-card">
          <rect x="416" y="150" width="320" height="290" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="576" y="186" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="700" fontFamily={FONT}>
            BROWSER CREDENTIAL STORES
          </text>
          <text x="576" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            Chrome · Edge · Brave Profiles
          </text>
          <rect x="440" y="232" width="272" height="84" rx="10" fill="#1e293b" stroke="#fbbf24" />
          <text x="576" y="264" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            User Data\Default\Login Data
          </text>
          <text x="576" y="290" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Saved credentials + DPAPI cookies
          </text>
          <rect x="440" y="334" width="272" height="84" rx="10" fill="#1e293b" stroke="#475569" />
          <text x="576" y="366" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700" fontFamily={FONT}>
            User Data\Default\History
          </text>
          <text x="576" y="392" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            Identifies crypto / fintech victims
          </text>
        </g>

        <line className="gop-wire" x1="740" y1="295" x2="824" y2="295" stroke="#ef4444" strokeWidth="4" />

        {/* Selective Gopuram Stage-2 */}
        <g className="gopuram-card">
          <rect x="828" y="150" width="332" height="290" rx="16" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2.6" />
          <text x="994" y="186" textAnchor="middle" fill="#e9d5ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SELECTIVE STAGE-2: GOPURAM
          </text>
          <text x="994" y="210" textAnchor="middle" fill="#c084fc" fontSize="11" fontFamily={FONT}>
            High-Value Finance / Crypto Only
          </text>
          <rect x="850" y="234" width="288" height="184" rx="10" fill="#0f172a" stroke="#7e22ce" />
          <text x="994" y="268" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            Hands-On-Keyboard Backdoor
          </text>
          <text x="994" y="300" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Deployed to small subset of victims
          </text>
          <text x="994" y="330" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Interactive command & lateral recon
          </text>
          <text x="994" y="362" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            Exfil via akamaitechcloudservices[.]com
          </text>
          <text x="994" y="392" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily={FONT}>
            Kaspersky + Mandiant Attribution: UNC4736
          </text>
        </g>

        {/* CrowdStrike Behavioral EDR Banner */}
        <g className="edr-bar">
          <rect x="170" y="504" width="860" height="92" rx="12" fill="#450a0a" stroke="#ef4444" strokeWidth="2.6" />
          <text x="600" y="538" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
            BEHAVIORAL EDR ALERT: Signed 3CXDesktopApp.exe Accessing Browser Login Data
          </text>
          <text x="600" y="568" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Even valid EV vendor signatures cannot mask a VoIP softphone harvesting Chrome/Edge credentials + unbacked RWX execution
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
