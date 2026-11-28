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
    title: 'After sleeping 12 to 14 days, SUNBURST encodes the victim domain into a DGA subdomain',
    story: 'Two weeks after arriving, the hidden clockwork wakes up and taps a coded village name onto a brass courier note.',
    technical: 'FNV-1a hash + custom Base32 encodes victim AD domain beneath appsync-api.eu-west-1.avsvmcloud[.]com.',
  },
  {
    id: 1,
    tag: '02',
    title: 'DNS A/CNAME responses act as an operator filter deciding whether to activate or kill-switch',
    story: 'A distant postmaster reads the note and replies with either a stop sign or a secret onward street address.',
    technical: 'Specific RFC1918/reserved IP replies disable the implant; high-value targets receive a CNAME to Stage 2 C2.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Stage 2 C2 traffic mimics legitimate Orion Improvement Program HTTP telemetry',
    story: 'For prized vaults, the clockwork switches to disguised postal envelopes that blend into daily repair reports.',
    technical: 'HTTPS JSON payloads masquerade as OIP statistics to deliver TEARDROP memory-only Cobalt Strike loaders.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Passive DNS history and egress allowlisting catch anomalous management-server lookups',
    story: 'Watchtower clerks spot a basement boiler sending letters to an unfamiliar foreign post office.',
    technical: 'Alert on management servers resolving newly observed multi-level DGA subdomains or non-vendor CNAMEs.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'DGA ENCODE', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'CNAME GATE', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'PASSIVE DNS', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function SunburstStep3DgaClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.sunb3-w1, .sunb3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.sunb3-mid, .sunb3-right, .sunb3-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.sunb3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.sunb3-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.sunb3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.sunb3-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.sunb3-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-sunburst-step3"
      stageLabel="STEP #3"
      mitreId="T1568.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="SUNBURST DGA DNS beaconing and CNAME triage to Stage 2 C2">
        <FilmBackdrop prefix="sunb3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          SUNBURST DGA BEACON · AVSVMCLOUD[.]COM CNAME TARGET TRIAGE
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          ORION-NMS-01 · T1568.002
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>VICTIM DOMAIN ENCODER</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>12-14 Day Sleep Complete</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>GUID + AD Domain Name</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Custom Base32 Encoding</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>.appsync-api.avsvmcloud</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Passive Recon Channel</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Identifies high-value victims</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>before sending Stage 2</text>

        <line className="sunb3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="sunb3-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>OPERATOR DNS TRIAGE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>A Record Kill vs. CNAME Go</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>CNAME -&gt; Stage 2 C2 Host</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Activates HTTPS OIP Mimic</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Deploys TEARDROP Loader</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Kill-Switch Protection</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Reserved IP halts beacon</text>
        </g>

        <line className="sunb3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="sunb3-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>NETWORK &amp; DNS HUNT</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Zeek + Sysmon EID 22</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>BusinessLayerHost.exe</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Queries unknown cloud CDN</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Unique encoded subdomains</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>CONTAINMENT</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Sinkhole DGA &amp; isolate NMS</text>
        </g>

        <g className="sunb3-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HUNTING SIGNAL: Audit passive DNS logs for encoded subdomains originating from monitoring servers
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            CNAME transitions in passive DNS distinguish passive beacons from active Stage 2 interactive intrusions
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
