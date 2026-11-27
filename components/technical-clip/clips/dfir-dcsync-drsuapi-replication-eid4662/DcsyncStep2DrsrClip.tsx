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
    title: 'Non-DC workstation binds to DRSUAPI interface on CORP-DC01',
    story: 'The red side-street courier car pulls under the armored glass bridge masquerading as an official peer mint.',
    technical: 'WKS-ADMIN-07 (10.20.14.88) connects to TCP/49668 interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2.',
  },
  {
    id: 1,
    tag: '02',
    title: 'IDL_DRSGetNCChanges (Opnum 3) requests CN=krbtgt secret attributes',
    story: 'The courier requests a complete duplicate of the royal crown-seal ledger straight down the express span.',
    technical: 'CORP-DC01 lsass.exe (ntdsai.dll) serves krbtgt password material directly from in-memory directory store.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Zero files dropped and zero NTDS.dit reads occur on CORP-DC01 disk',
    story: 'Not a single footprint touches the mint vault floor, bypassing traditional local-file alarms.',
    technical: 'No VSS shadow copy, no ntdsutil.exe, and no EDR process spawn happen on the Domain Controller.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Zeek DCE-RPC and Suricata SID 2043901 catch non-DC DRSUAPI traffic',
    story: 'Bridge wire sensors spot an ordinary street license plate receiving peer-mint bridge traffic.',
    technical: 'Alert on DRSUAPI Opnum 3 (DRSGetNCChanges) whenever orig_h is outside authorized Domain Controller IPs.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DRSUAPI', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'IN-MEMORY', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SURICATA', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DcsyncStep2DrsrClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.dc2-w1, .dc2-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.dc2-rpc, .dc2-wire, .dc2-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.dc2-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.dc2-rpc'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.dc2-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.dc2-wire'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.dc2-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dcsync-step2"
      stageLabel="STEP #2"
      mitreId="T1003.006"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Rogue MS-DRSR IDL_DRSGetNCChanges over network RPC">
        <FilmBackdrop prefix="dc2" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          MS-DRSR PROTOCOL FORENSICS · ROGUE IDL_DRSGETNCCHANGES (OPNUM 3)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          10.20.14.88 -&gt; CORP-DC01:49668
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#ef4444" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>NON-DC WORKSTATION</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>WKS-ADMIN-07 (10.20.14.88)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DRSUAPI Bind (TCP/49668)</text>
        <text x="190" y="278" textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily={FONT}>e3514235-4b06-11d1-ab04-...</text>
        <text x="190" y="300" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Impersonates Peer DC Partner</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Zero DC Execution</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Never logs onto CORP-DC01</text>

        <line className="dc2-w1" x1="344" y1="295" x2="416" y2="295" stroke="#ef4444" strokeWidth="4" />

        <g className="dc2-rpc">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>CORP-DC01 LSASS.EXE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>ntdsai.dll · IDL_DRSGetNCChanges</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="700" fontFamily={FONT}>OPNUM 3 SECRET STREAM</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Target: CN=krbtgt,CN=Users</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Served directly from RAM cache</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>NTDS.dit File Untouched</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>No VSS snapshot or file copy</text>
        </g>

        <line className="dc2-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="dc2-wire">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>NETWORK SENSOR CATCH</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Zeek / Suricata SID 2043901</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>orig_h != $DOMAIN_CONTROLLERS</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>10.20.14.88 is workstation VLAN</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Authorized DCs: 10.20.10.10-11</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>INSTANT WIRE PROOF</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Zero endpoint agent required</text>
        </g>

        <g className="dc2-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SURICATA / ZEEK: Alert whenever !$DOMAIN_CONTROLLERS invokes DRSUAPI (e3514235-...) Opnum 3 against any DC
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Peer Domain Controllers should replicate exclusively across dedicated DC management subnets
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
