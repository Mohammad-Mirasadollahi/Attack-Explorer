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
    title: 'Billing microservice logs incoming header through log4j-core-2.14.1.jar',
    story: 'The parcel enters the copper mailroom printing press for routine ledger stamping.',
    technical: 'APP-JVM-01 (PID 4418) passes untrusted X-Api-Version string into logger.info().',
  },
  {
    id: 1,
    tag: '02',
    title: 'MessagePatternConverter evaluates lookup tokens when formatMsgNoLookups=false',
    story: 'Spinning press gears mistakenly interpret envelope ink as an active remote pickup order.',
    technical: 'Log4j2 2.0-beta9 – 2.14.1 recursively resolves lookup syntax inside untrusted log strings.',
  },
  {
    id: 2,
    tag: '03',
    title: 'JndiLookup invokes javax.naming.InitialContext.lookup() against remote directory',
    story: 'Passive ink crosses the boundary into an active network request straight out of the mailroom.',
    technical: 'JndiManager initiates external directory lookup (LDAP/RMI) controlled by untrusted input.',
  },
  {
    id: 3,
    tag: '04',
    title: 'SBOM & runtime JAR inventory hunting uncovers hidden shaded log4j-core copies',
    story: 'Engineers inspect every nested side press in the building so legacy gear sets cannot hide.',
    technical: 'Scan containers, fat JARs, WAR archives, and running JVM classpaths for log4j-core < 2.17.1.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PARSER', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'JNDI', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SBOM', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function Log4jStep2LookupClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.l2-w1, .l2-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.l2-jndi, .l2-sbom, .l2-def'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.l2-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.l2-jndi'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.l2-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.l2-sbom'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.l2-def'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-log4j-step2"
      stageLabel="STEP #2"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Log4j2 MessagePatternConverter JndiLookup flaw">
        <FilmBackdrop prefix="l2" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          JVM RUNTIME ANALYSIS · LOG4J2 MESSAGEPATTERNCONVERTER JNDILOOKUP FLAW
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          APP-JVM-01 · PID 4418
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>APPLICATION LOGGER</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>log4j-core-2.14.1.jar</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>logger.info(header)</text>
        <text x="190" y="278" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>formatMsgNoLookups = false</text>
        <text x="190" y="300" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Default in 2.0-beta9 – 2.14.1</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Boundary Violation</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Passive log text triggers</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>active directory lookups</text>

        <line className="l2-w1" x1="344" y1="295" x2="416" y2="295" stroke="#ef4444" strokeWidth="4" />

        <g className="l2-jndi">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily={FONT}>JNDILOOKUP ENGINE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>MessagePatternConverter</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>InitialContext.lookup()</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Parses directory URI in message</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Attempts external LDAP/RMI fetch</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Data Becomes Behavior</text>
          <text x="590" y="394" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Unintended outbound RPC call</text>
        </g>

        <line className="l2-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="l2-sbom">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>SBOM &amp; JAR HUNTING</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Locate Hidden Dependencies</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Nested Shaded Archives</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Inspect WAR / EAR / Fat JARs</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Flag every log4j-core &lt; 2.17.1</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>CISA ED 22-02 SCAN</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Continuous TVM &amp; CI checks</text>
        </g>

        <g className="l2-def">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            INVENTORY PRIORITY: Scan running JVM classpaths and nested fat JARs — never rely on top-level pom.xml alone
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Replace every log4j-core &lt; 2.17.1 artifact to permanently eliminate MessagePatternConverter lookups
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
