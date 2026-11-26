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
    title: 'After a multi-day dormancy delay, 3CXDesktopApp fetches icon12.ico',
    story:
      'After waiting quietly for days, the office phone reaches out to a public web gallery wall and fetches one small numbered picture frame.',
    technical:
      '3CXDesktopApp.exe queries raw.githubusercontent.com (Sysmon EID 22) and opens TLS 443 to /IconStorages/images/main/icon12.ico (EID 3).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Valid ICO header and pixels fool casual inspection, but EOF hides Base64',
    story:
      'From the front the framed picture looks completely normal, but peeled off the backing paper is a folded strip of coded letters.',
    technical:
      'Loader skips the valid .ico bitmap bytes, reads past the end-of-file boundary, and extracts the appended Base64 cipher block.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Base64 decodes into the active C2 domain akamaitechcloudservices[.]com',
    story:
      'Unfolding the hidden strip reveals a secret forwarding address disguised to sound like a major global web service.',
    technical:
      'Decoded C2 URL resolves to akamaitechcloudservices[.]com over TLS 443, letting operators rotate dead-drop servers via GitHub.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Sysmon EID 22 + EID 3 flag a VoIP client pulling raw GitHub icons',
    story:
      'Network guards flag why a corporate desk telephone is quietly visiting a public picture gallery and then calling a lookalike relay.',
    technical:
      'Correlating Sysmon EID 22 (raw.githubusercontent.com) + EID 3 from 3CXDesktopApp.exe exposes the T1102.001 dead-drop resolver.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'GITHUB ICO', transform: 'scale(1.26) translate(55px, -25px)' },
  { id: 'EOF BASE64', transform: 'scale(1.30) translate(-45px, -25px)' },
  { id: 'C2 RELAY', transform: 'scale(1.26) translate(-120px, -25px)' },
];

export function ThreeCxStep3IconDeadDropClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.gh-wire, .c2-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.ico-eof, .c2-card, .dns-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.gh-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.ico-eof'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.c2-wire'), { strokeDashoffset: 0, duration: 0.75, ease: 'none' }, 'beat2');
    tl.to(q('.c2-card'), { autoAlpha: 1, y: 0, duration: 0.65, ease: 'back.out(1.3)' }, 'beat2+=0.4');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.dns-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-threecx-step3"
      stageLabel="STEP #3"
      mitreId="T1102.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="3CXDesktopApp.exe downloads icon12.ico from GitHub IconStorages, extracts trailing Base64 past EOF, and beacons to akamaitechcloudservices.com"
      >
        <FilmBackdrop prefix="cx3" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          GITHUB DEAD-DROP RESOLVER · STEGANOGRAPHIC .ICO EOF · DYNAMIC C2 BEACON
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          Sysmon EID 22 (DNS) + EID 3 (TLS 443)
        </text>

        {/* Implant Process */}
        <rect x="40" y="170" width="250" height="240" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="165" y="206" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="700" fontFamily={FONT}>
          3CXDesktopApp.exe
        </text>
        <text x="165" y="232" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          PID 7120 · In-Memory Loader
        </text>
        <rect x="60" y="256" width="210" height="128" rx="10" fill="#0f172a" stroke="#475569" />
        <text x="165" y="286" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700" fontFamily={FONT}>
          7-Day Sleep Timer Done
        </text>
        <text x="165" y="316" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
          HTTPS GET icon12.ico
        </text>
        <text x="165" y="344" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily={FONT}>
          raw.githubusercontent.com
        </text>
        <text x="165" y="370" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={FONT}>
          /IconStorages/images/main/
        </text>

        <line className="gh-wire" x1="294" y1="290" x2="394" y2="290" stroke="#38bdf8" strokeWidth="4" />

        {/* GitHub IconStorages Frame */}
        <rect x="398" y="130" width="336" height="330" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.2" />
        <text x="566" y="162" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
          GITHUB · IconStorages/images
        </text>
        <text x="566" y="184" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          icon1.ico … icon12.ico … icon16.ico
        </text>

        {/* Valid ICO pixels */}
        <rect x="424" y="206" width="284" height="92" rx="10" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
        <text x="566" y="238" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>
          icon12.ico · Valid ICO Pixels
        </text>
        <text x="566" y="264" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          00 00 01 00 header + normal bitmap
        </text>
        <text x="566" y="286" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily={FONT}>
          --- Standard Image EOF Boundary ---
        </text>

        {/* Hidden Trailing Base64 */}
        <g className="ico-eof">
          <rect x="424" y="314" width="284" height="122" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="566" y="346" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
            PAST-EOF BASE64 DEAD DROP
          </text>
          <text x="566" y="376" textAnchor="middle" fill="#fed7aa" fontSize="12" fontFamily={FONT}>
            $3aHR0cHM6Ly9ha2FtYWl0ZWNo...
          </text>
          <text x="566" y="406" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Decoded in RAM → Encrypted C2 URL
          </text>
        </g>

        <line className="c2-wire" x1="738" y1="350" x2="824" y2="350" stroke="#ef4444" strokeWidth="4" />

        {/* C2 Relay */}
        <g className="c2-card">
          <rect x="828" y="170" width="332" height="250" rx="16" fill="#450a0a" stroke="#ef4444" strokeWidth="2.6" />
          <text x="994" y="206" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
            LAZARUS C2 SERVER
          </text>
          <text x="994" y="236" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
            akamaitechcloudservices[.]com
          </text>
          <rect x="850" y="258" width="288" height="138" rx="10" fill="#1f0a0a" stroke="#f87171" />
          <text x="994" y="290" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700" fontFamily={FONT}>
            TLS 443 · Lookalike CDN Domain
          </text>
          <text x="994" y="320" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Receives host fingerprint & UUID
          </text>
          <text x="994" y="348" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            Delivers Stage-2 Stealer / Backdoor
          </text>
          <text x="994" y="376" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={FONT}>
            No hardcoded C2 inside initial MSI
          </text>
        </g>

        {/* DNS + TLS Witness Bar */}
        <g className="dns-bar">
          <rect x="190" y="506" width="820" height="90" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="600" y="540" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            NETWORK WITNESS: Sysmon EID 22 (raw.githubusercontent.com) → akamaitechcloudservices[.]com
          </text>
          <text x="600" y="568" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            A VoIP desktop client downloading raw GitHub icon files before connecting to a newly registered CDN lookalike
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
