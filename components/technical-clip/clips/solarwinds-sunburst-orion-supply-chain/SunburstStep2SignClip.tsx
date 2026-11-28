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
    title: 'The automated release pipeline signs the trojanized Orion DLL with a valid certificate',
    story: 'The royal wax press stamps the altered gold coin with the authentic crimson seal of the mint.',
    technical: 'Authenticode signs SolarWinds.Orion.Core.BusinessLayer.dll using SolarWinds Worldwide LLC cert.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Around 18,000 enterprises download the official hotfix package over HTTPS',
    story: 'Armored couriers deliver thousands of sealed velvet boxes straight into bank and ministry vaults worldwide.',
    technical: 'Orion Platform 2019.4 HF5 through 2020.2.1 distributed via standard customer update portals.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Allowlisting and antivirus trust the vendor signature and load the DLL into Orion services',
    story: 'Vault guards admire the intact wax crest and carry the poisoned parcel straight into the central counting room.',
    technical: 'Windows Defender and EDR policies often exclude trusted SolarWinds binaries from aggressive inspection.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Binary transparency checks and post-install behavioral telemetry catch signed backdoors',
    story: 'Even royal shipments must be watched after unpacking to spot hidden gears ticking inside.',
    technical: 'Never treat valid Authenticode signatures as unconditional runtime trust for network or identity actions.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SIGNING', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: '18K HOSTS', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'ZERO TRUST', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function SunburstStep2SignClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.sunb2-w1, .sunb2-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.sunb2-mid, .sunb2-right, .sunb2-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.sunb2-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.sunb2-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.sunb2-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.sunb2-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.sunb2-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-sunburst-step2"
      stageLabel="STEP #2"
      mitreId="T1553.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Valid Authenticode signing and mass distribution of trojanized SolarWinds Orion hotfix">
        <FilmBackdrop prefix="sunb2" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          AUTHENTICODE CODE SIGNING · TRUSTED VENDOR UPDATE DISTRIBUTION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          ORION 2020.2.1 · T1553.002
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>SIGNING HSM SERVER</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Valid Vendor Cert</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SolarWinds Worldwide LLC</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Symantec SHA-256 Chain</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Valid Timestamp Verified</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Trust Gap</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Signing checks file integrity</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>not build-pipeline cleanliness</text>

        <line className="sunb2-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="sunb2-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>CUSTOMER UPDATE PORTAL</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>~18,000 Organizations Patched</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>2019.4 HF5 - 2020.2.1 HF1</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Signed BusinessLayer.dll</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Installed inside core NMS</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>AV / EDR Exclusion Risk</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Monitoring agents often whitelisted</text>
        </g>

        <line className="sunb2-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="sunb2-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>PRIVILEGED RUNTIME</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>SolarWinds.BusinessLayerHost</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>12-14 Day Dormancy Timer</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Checks EDR/AV Blocklist</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Validates Domain Join</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>ZERO-TRUST LESSON</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Segment &amp; monitor NMS egress</text>
        </g>

        <g className="sunb2-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DEFENSE LESSON: Never grant management servers unrestricted outbound internet access based on vendor trust
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Restrict Orion/NMS servers to strict egress allowlists and inspect behavior even for signed binaries
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
