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
    title: 'Enforce strict outbound firewall airlock blocking LDAP/RMI from web tiers',
    story: 'Security slams the emerald airlock valve shut across every street-side pneumatic tube.',
    technical: 'Deny outbound TCP/389, 636, 1389, and 1099 from DMZ Java subnets immediately.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Upgrade all workloads to Apache Log4j 2.17.1+ (or 2.23+ LTS)',
    story: 'Engineers bolt a literal-ink shield onto the mailroom press so labels never trigger orders.',
    technical: 'Log4j 2.17.1+ removes message pattern lookups permanently and locks down JNDI defaults.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Re-image compromised hosts and rotate every accessible cloud/API secret',
    story: 'Any mailroom where the wrench alarm sounded is rebuilt cleanly with brand-new keys.',
    technical: 'Rebuild APP-JVM-01 from clean immutable CI artifact and rotate DB/API credentials.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Continuous CI/CD SBOM gates keep vulnerable JARs out of production forever',
    story: 'Automated quality checks inspect every incoming machine part before installation.',
    technical: 'Enforce automated dependency policies blocking log4j-core < 2.17.1 in every pipeline.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'AIRLOCK', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: '2.17.1+', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'HYGIENE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function Log4jStep4AirlockClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.l4-w1, .l4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.l4-patch, .l4-clean, .l4-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.l4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.l4-patch'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.l4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.l4-clean'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.l4-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-log4j-step4"
      stageLabel="STEP #4"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="CISA ED 22-02 Log4j 2.17.1+ upgrade and egress firewall airlock">
        <FilmBackdrop prefix="l4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          CISA ED 22-02 REMEDIATION · LOG4J 2.17.1+ UPGRADE &amp; EGRESS AIRLOCK
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          DEFENSE-IN-DEPTH HARDENING
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>1. EGRESS AIRLOCK</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Default-Deny Outbound</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Deny Directory Ports</text>
        <text x="190" y="278" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>TCP 389 · 636 · 1389 · 1099</text>
        <text x="190" y="300" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Blocks remote class lookups</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Instant Mitigation</text>
        <text x="190" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Protects fleet during patching</text>

        <line className="l4-w1" x1="344" y1="295" x2="416" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="l4-patch">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>2. LOG4J 2.17.1+ PATCH</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Literal Logging Only</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>log4j-core &gt;= 2.17.1</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Message lookups removed fully</text>
          <text x="590" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>JNDI disabled by default</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Data Stays Inert Text</text>
          <text x="590" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Headers logged harmlessly</text>
        </g>

        <line className="l4-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="l4-clean">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>3. IR &amp; CI/CD GATES</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Eradicate &amp; Prevent</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Clean Rebuild + Keys</text>
          <text x="1000" y="282" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Re-image compromised JVMs</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Rotate DB / Cloud / API keys</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SBOM CI POLICY</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Block legacy JAR regressions</text>
        </g>

        <g className="l4-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#dcfce7" fontSize="14" fontWeight="700" fontFamily={FONT}>
            VERIFIED HARDENING: Log4j 2.17.1+ Literal Logging + Application-Tier Egress Airlock Close CVE-2021-44228 Permanently
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Keep Linux auditd execve (java -&gt; shell) and Zeek egress monitoring armed for zero-day resilience
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
