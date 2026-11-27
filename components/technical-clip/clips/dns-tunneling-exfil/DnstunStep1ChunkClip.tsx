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
    title: 'Segmented host WKSTN-FIN-14 has no direct HTTP egress but retains internal DNS',
    story: 'A tall stone seawall blocks cargo ships, so a rogue clerk slices private harbor sheets into tiny slips.',
    technical: 'telemetry_sync.exe (PID 6248) encodes 28-byte chunks into 56-char hex labels under RFC 1035 limits.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Each DNS query packs a unique encoded subdomain ahead of the rogue apex domain',
    story: 'Every carrier pigeon receives a brand-new gibberish leg scroll that never repeats.',
    technical: 'RFC 1035 enforces <= 63 octets per label and <= 253 chars total FQDN length.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Microsoft Sysmon Event ID 22 links the DNS query directly to the originating process',
    story: 'A blue skylight lens overhead photographs exactly which indoor desk launched each bird.',
    technical: 'Sysmon EID 22 records QueryName together with Image=C:\\ProgramData\\SyncCache\\telemetry_sync.exe.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Process-level DNS logging removes the resolver blind spot during incident response',
    story: 'Investigators pinpoint the single rogue desk immediately instead of guessing across the whole fortress.',
    technical: 'Correlating Sysmon EID 22 with resolver logs separates legitimate browser lookups from covert binaries.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'RFC 1035', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'SYSMON 22', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'DFIR LINK', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function DnstunStep1ChunkClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.d1-w1, .d1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.d1-mid, .d1-right, .d1-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.d1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.d1-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.d1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.d1-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.d1-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dnstun-step1"
      stageLabel="STEP #1"
      mitreId="T1071.004"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="RFC 1035 subdomain chunking and Sysmon Event ID 22 attribution">
        <FilmBackdrop prefix="d1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          IETF RFC 1035 LABEL PACKING · MICROSOFT SYSMON EVENT ID 22 ATTRIBUTION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WKSTN-FIN-14 · PID 6248
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>SEGMENTED WORKSTATION</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>WKSTN-FIN-14 (10.10.44.14)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Direct HTTP/HTTPS Blocked</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Internal DNS UDP/53 Open</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>telemetry_sync.exe (PID 6248)</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Chunking Strategy</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>28-byte slice -&gt; 56-char hex</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Prepended to unique QNAME</text>

        <line className="d1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="d1-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>RFC 1035 SUBDOMAIN LABEL</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Max 63 Octets / Label · 253 Total</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>4a9f2c8e1b7d3a04...a01.s14</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>.cdn-metrics-sync.example</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Unique label = 0% cache reuse</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Query Type: TXT (16)</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Carries data out, receives replies</text>
        </g>

        <line className="d1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="d1-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>SYSMON EVENT ID 22</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Exact Process Attribution</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Image + PID + User</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>ProgramData\SyncCache\</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>telemetry_sync.exe (6248)</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DFIR ADVANTAGE</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Closes resolver-IP blind spot</text>
        </g>

        <g className="d1-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HOST TELEMETRY RULE: Sysmon Event ID 22 attributes high-entropy DNS lookups to exact binaries &amp; PIDs
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Alert when unsigned non-browser binaries emit rapid unique 50+ char subdomains under one apex domain
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
