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
    title: 'Untrusted HTTP header arrives at EDGE-GW-02 Nginx reverse proxy',
    story: 'An incoming parcel rolls down the mailroom intake belt carrying a crafted return label.',
    technical: 'External client 198.51.100.42 sends GET /api/v2/health with lookup syntax in X-Api-Version.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Nginx access logs and Suricata SID 2034649 record the inbound pattern',
    story: 'The blue front-desk arch camera snapshots the full label for security investigators.',
    technical: 'OWASP CRS 944150 and Suricata SID 2034649 flag standard JNDI lookup directives at ingress.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Nested string obfuscation shows why ingress regexes alone are insufficient',
    story: 'Cleverly disguised pickup wording can slip past front-desk cameras if no inner guards exist.',
    technical: 'Log4j2 nested lookup substitutions can bypass naive static WAF string matching.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Pair ingress logs with SBOM scanning, egress blocking, and host auditd',
    story: 'Defense-in-depth guards both the front mailroom desk and the outbound street tubes.',
    technical: 'Treat WAF alerts as early tripwires while relying on Log4j 2.17.1+ and egress airlocks.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'NGINX', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'WAF LIMIT', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'DEFENSE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function Log4jStep1IngressClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.l1-w1, .l1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.l1-waf, .l1-lim, .l1-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.l1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.l1-waf'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.l1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.l1-lim'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.l1-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-log4j-step1"
      stageLabel="STEP #1"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Inbound HTTP header logging and WAF audit for CVE-2021-44228">
        <FilmBackdrop prefix="l1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          CVE-2021-44228 INGRESS AUDIT · NGINX ACCESS LOGS &amp; SURICATA SID 2034649
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          198.51.100.42 -&gt; EDGE-GW-02:443
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>UNTRUSTED HTTP HEADER</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>GET /api/v2/health</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Logged Input Fields</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>User-Agent · X-Api-Version</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Contains JNDI lookup token</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>No Auth Required</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Routine request logging exposes</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>downstream Java backends</text>

        <line className="l1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="l1-waf">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>EDGE-GW-02 NGINX &amp; WAF</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Ingress Forensics &amp; Tripwire</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#bae6fd" fontSize="12" fontWeight="700" fontFamily={FONT}>SURICATA SID 2034649</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>OWASP CRS 944150 Triggered</text>
          <text x="590" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Captures raw header + source IP</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Retrospective Hunting</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Preserves attack timeline</text>
        </g>

        <line className="l1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="l1-lim">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#ef4444" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>WAF BYPASS REALITY</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Nested Lookup Evasion</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Obfuscated Syntax</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Nested transformations evade</text>
          <text x="1000" y="306" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>naive static string regexes</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DEFENSE-IN-DEPTH</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Patch + Egress + Host Audit</text>
        </g>

        <g className="l1-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DFIR GUIDANCE: Use Nginx/WAF logs to spot scanning waves — never rely on ingress regex alone to stop Log4Shell
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Correlate edge HTTP hits with outbound directory telemetry and Linux auditd process execution
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
