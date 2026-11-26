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
    title: 'Prior X_TRADER compromise pivots into the 3CX CI/CD build server',
    story:
      'A compromised tool from an earlier vendor sneaks through the back wall of a cleanroom factory straight onto the main assembly conveyor.',
    technical:
      'Lazarus pivots from a previously trojanized Trading Technologies X_TRADER binary onto 3CX build infrastructure (MITRE T1195.002).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Two unsigned DLL modules are swapped inside the installer package before signing',
    story:
      'Before the quality press stamps the package, an intruder swaps two inner components inside the waiting casing for hollow decoys.',
    technical:
      'Trojanized ffmpeg.dll (unsigned loader) and d3dcompiler_47.dll (encrypted blob carrier) replace clean builds inside v18.12.407.',
  },
  {
    id: 2,
    tag: '03',
    title: '3CX EV Authenticode press seals the tampered installer as genuinely signed',
    story:
      'The heavy gold factory hologram press descends and seals the outer box, making the rigged unit look indistinguishable from factory stock.',
    technical:
      '3CXDesktopApp-18.12.407.msi receives a valid 3CX Ltd EV Authenticode certificate and ships through official auto-update channels.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Sysmon Event ID 7 exposes unsigned ffmpeg.dll inside a signed host binary',
    story:
      'At the customer receiving desk, an inspection beam notices one internal gear lacks the factory gold seal even though the outer casing shines.',
    technical:
      'Sysmon EID 7 logs ImageLoaded=ffmpeg.dll (Signed=false) inside signed 3CXDesktopApp.exe (PID 7120) on WKS-TRD-14.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'CI/CD SWAP', transform: 'scale(1.25) translate(105px, -25px)' },
  { id: 'EV SIGNING', transform: 'scale(1.28) translate(-95px, -30px)' },
  { id: 'SYSMON 7', transform: 'scale(1.26) translate(-30px, -110px)' },
];

export function ThreeCxStep1BuildSignClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.pivot-wire, .sign-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.swap-badge, .seal-badge, .sysmon7-bar'), { autoAlpha: 0, y: 12 });
    tl.set(q('.press-head'), { y: -26 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.pivot-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.swap-badge'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.sign-wire'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'beat2');
    tl.to(q('.press-head'), { y: 0, duration: 0.55, ease: 'bounce.out' }, 'beat2+=0.4');
    tl.to(q('.seal-badge'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 'beat2+=0.75');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.sysmon7-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-threecx-step1"
      stageLabel="STEP #1"
      mitreId="T1195.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="X_TRADER pivot tampers with 3CX CI/CD build swapping ffmpeg.dll and d3dcompiler_47.dll prior to genuine EV Authenticode signing, caught by Sysmon Event ID 7"
      >
        <FilmBackdrop prefix="cx1" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          CASCADING SUPPLY CHAIN · CI/CD BUILD TAMPER · VALID EV AUTHENTICODE SIGNING
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          X_TRADER → 3CXDesktopApp v18.12.407
        </text>

        {/* Prior Vendor Compromise */}
        <rect x="40" y="188" width="235" height="205" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="157" y="224" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="700" fontFamily={FONT}>
          PRIOR BREACH
        </text>
        <text x="157" y="250" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700" fontFamily={FONT}>
          X_TRADER Binary
        </text>
        <text x="157" y="276" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          Trading Technologies
        </text>
        <rect x="58" y="298" width="199" height="74" rx="8" fill="#0f172a" stroke="#475569" />
        <text x="157" y="328" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily={FONT}>
          Employee workstation
        </text>
        <text x="157" y="352" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
          → 3CX Build Network
        </text>

        <line className="pivot-wire" x1="278" y1="290" x2="366" y2="290" stroke="#f59e0b" strokeWidth="4" />

        {/* 3CX CI/CD Build Stage */}
        <rect x="370" y="142" width="340" height="316" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.2" />
        <text x="540" y="174" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
          3CX CI/CD BUILD STAGE
        </text>
        <text x="540" y="196" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          Pre-Signing Staging Folder
        </text>

        <g className="swap-badge">
          <rect x="394" y="216" width="292" height="96" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2.2" />
          <text x="540" y="246" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
            ffmpeg.dll  [SWAPPED]
          </text>
          <text x="540" y="270" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Unsigned DLL Sideload Proxy
          </text>
          <text x="540" y="294" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            Replaces legitimate Electron library
          </text>

          <rect x="394" y="330" width="292" height="104" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2.2" />
          <text x="540" y="360" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
            d3dcompiler_47.dll  [SWAPPED]
          </text>
          <text x="540" y="384" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            +0xFEEDFACE + 312 KB RC4 Payload
          </text>
          <text x="540" y="408" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            Appended past authentic PE sections
          </text>
        </g>

        <line className="sign-wire" x1="714" y1="290" x2="808" y2="290" stroke="#fbbf24" strokeWidth="4" />

        {/* Genuine EV Code Signing Press */}
        <rect x="812" y="142" width="348" height="316" rx="16" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.4" />
        <g transform="translate(836, 162)">
          <g className="press-head">
            <rect x="0" y="0" width="300" height="72" rx="10" fill="#78350f" stroke="#fbbf24" strokeWidth="2.2" />
            <text x="150" y="32" textAnchor="middle" fill="#fef3c7" fontSize="13" fontWeight="700" fontFamily={FONT}>
              3CX EV AUTHENTICODE PRESS
            </text>
            <text x="150" y="54" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
              Valid Vendor Certificate · DigiCert
            </text>
          </g>
        </g>

        <g className="seal-badge">
          <rect x="836" y="258" width="300" height="176" rx="12" fill="#0f172a" stroke="#22c55e" strokeWidth="2.2" />
          <text x="986" y="290" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>
            3CXDesktopApp-18.12.407.msi
          </text>
          <text x="986" y="318" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            SIGNED = TRUE (3CX Ltd)
          </text>
          <text x="986" y="348" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Shipped via Official CDN Auto-Update
          </text>
          <text x="986" y="376" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Hidden inside: unsigned ffmpeg.dll
          </text>
          <text x="986" y="402" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            Deployed to WKS-TRD-14 (10.10.8.41)
          </text>
        </g>

        {/* Sysmon Event ID 7 Bar */}
        <g className="sysmon7-bar">
          <rect x="210" y="506" width="780" height="90" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="600" y="540" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SYSMON EID 7 WITNESS: Signed 3CXDesktopApp.exe Loads Unsigned ffmpeg.dll
          </text>
          <text x="600" y="568" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Outer MSI passes Authenticode verification, but child DLL signature mismatch exposes the supply-chain swap
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
