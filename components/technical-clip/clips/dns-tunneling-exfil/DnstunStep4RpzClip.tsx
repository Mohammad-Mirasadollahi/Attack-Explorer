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
    title: 'Push wildcard RPZ sinkhole rule for *.cdn-metrics-sync.example to internal resolvers',
    story: 'Coastguard engineers drop a glowing emerald harbor net straight over the rogue offshore island.',
    technical: 'DNS-INT-01/02 redirect *.cdn-metrics-sync.example to local sinkhole 10.255.255.53 immediately.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Enforce perimeter firewall deny on direct workstation UDP/53, TCP/53, and DoT/DoH',
    story: 'An emerald barrier rises along the seawall so no indoor clerk can bypass the central postmaster.',
    technical: 'Workstation VLANs permit DNS only to approved corporate resolvers; direct port 53/853 is blocked.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Isolate WKSTN-FIN-14, quarantine PID 6248, and decode Zeek logs for exfil scope',
    story: 'Investigators seal the rogue desk and check exactly which harbor ledger pages were cut into slips.',
    technical: 'Preserve telemetry_sync.exe volatile memory and reconstruct transferred bytes from dns.log.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Continuous RPZ threat-intel feeds and NOD blocking harden DNS egress permanently',
    story: 'The coastal fortress remains open for trusted harbor mail while blocking covert offshore signals.',
    technical: 'Zero-trust DNS architecture eliminates blind spots across both unencrypted and DoH/DoT channels.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'RPZ RULE', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'FW LOCK', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'IR SCOPE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DnstunStep4RpzClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.d4-w1, .d4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.d4-mid, .d4-right, .d4-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.d4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.d4-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.d4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.d4-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.d4-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dnstun-step4"
      stageLabel="STEP #4"
      mitreId="T1071.004"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="DNS RPZ sinkholing and outbound port 53/853 firewall containment">
        <FilmBackdrop prefix="d4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          ZERO-TRUST DNS CONTAINMENT · RPZ SINKHOLE &amp; PORT 53/853 EGRESS LOCK
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          ACTION: RPZ-SINKHOLE-BLOCK
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>DNS RPZ SINKHOLE</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>DNS-INT-01 &amp; DNS-INT-02</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>*.cdn-metrics-sync.example</text>
        <text x="190" y="276" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>-&gt; A 10.255.255.53</text>
        <text x="190" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Instant fleet-wide cut-off</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Secondary Benefit</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Sinkhole logs catch any other</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>infected hosts immediately</text>

        <line className="d4-w1" x1="344" y1="295" x2="416" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="d4-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>EGRESS FIREWALL LOCK</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Close Direct Bypass Channels</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#bae6fd" fontSize="12" fontWeight="700" fontFamily={FONT}>DENY FROM WORKSTATIONS</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>UDP/53 · TCP/53 · TCP/853 (DoT)</text>
          <text x="590" y="298" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>+ Block Public DoH Providers</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="590" y="368" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Mandatory Resolver Rule</text>
          <text x="590" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>100% traffic via DNS-INT-01/02</text>
        </g>

        <line className="d4-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="d4-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>ENDPOINT IR &amp; SCOPE</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>WKSTN-FIN-14 Containment</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Isolate &amp; Preserve</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Quarantine telemetry_sync.exe</text>
          <text x="1000" y="306" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Capture volatile memory</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
          <text x="1000" y="376" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Data-Loss Audit</text>
          <text x="1000" y="402" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Decode Zeek dns.log sequence</text>
        </g>

        <g className="d4-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HARDENING OUTCOME: RPZ sinkhole breaks exfil in milliseconds while egress port 53/853 deny prevents bypasses
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Reconstruct exact exfiltrated scope from Zeek dns.log before re-imaging WKSTN-FIN-14
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
