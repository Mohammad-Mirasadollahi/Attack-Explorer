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
    title: 'Left JVM view: log4j-core-2.14.1 keeps JndiLookup enabled on log messages',
    story: 'On the left, spinning copper press gears treat envelope labels as active pickup commands.',
    technical: '0x00007F9A11200000: formatMsgNoLookups=false enables recursive JNDI message evaluation.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Runtime ClassLoader handles unverified javaNamingReference lookup state',
    story: 'An unverified foreign blueprint enters the mailroom straight through the street tube.',
    technical: '0x00007F9A11480000: InitialContext resolves remote directory attributes over TCP/1389.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Right JVM view: log4j-core-2.17.1+ logs every header strictly as literal text',
    story: 'On the right, the emerald-shielded press prints every envelope note harmlessly as plain ink.',
    technical: '0x00007F9A11640000: Message lookups removed permanently; egress firewall blocks LDAP/RMI.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Verify runtime classpath parity and egress airlocks across all Java services',
    story: 'Auditors sweep both presses to confirm zero legacy gear sets remain in the building.',
    technical: 'Run SBOM scans across fat JARs/containers and keep Zeek + auditd behavioral rules active.',
  },
];

const CAMERAS = [
  { id: 'COMPARE', transform: 'scale(1)' },
  { id: '2.14.1', transform: 'scale(1.24) translate(110px, -20px)' },
  { id: '2.17.1+', transform: 'scale(1.24) translate(-110px, -20px)' },
  { id: 'VERDICT', transform: 'scale(1.22) translate(0px, -110px)' },
];

export function Log4jMemoryClassDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.lm-vuln, .lm-safe, .lm-verdict'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.lm-vuln'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.lm-ref'), { stroke: '#f43f5e', duration: 0.6 }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.lm-safe'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.lm-verdict'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-log4j-memory"
      stageLabel="MEMORY DIFF"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="JVM log4j-core 2.14.1 vulnerable state vs 2.17.1+ literal logging state">
        <FilmBackdrop prefix="lm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          JVM RUNTIME MEMORY DIFF · LOG4J 2.14.1 LOOKUP VS. LOG4J 2.17.1+ LITERAL
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          PID 4418 · APP-JVM-01
        </text>

        <g className="lm-vuln">
          <rect x="52" y="108" width="510" height="352" rx="16" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.6" />
          <text x="307" y="146" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
            VULNERABLE · LOG4J-CORE 2.14.1
          </text>
          <rect x="78" y="170" width="458" height="122" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="307" y="200" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x00007F9A11200000 · JndiLookup Enabled
          </text>
          <text x="307" y="230" textAnchor="middle" fill="#fecaca" fontSize="11" fontFamily={FONT}>
            formatMsgNoLookups = false (Evaluates Untrusted Input)
          </text>
          <text x="307" y="260" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            MessagePatternConverter -&gt; InitialContext.lookup()
          </text>

          <rect className="lm-ref" x="78" y="312" width="458" height="122" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="307" y="342" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x00007F9A11480000 · Remote Naming Reference
          </text>
          <text x="307" y="372" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Outbound TCP/1389 LDAP + java -&gt; /bin/sh (auditd)
          </text>
          <text x="307" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Bypasses naive ingress regexes via nested lookups
          </text>
        </g>

        <g className="lm-safe">
          <rect x="638" y="108" width="510" height="352" rx="16" fill="#052e16" stroke="#22c55e" strokeWidth="2.6" />
          <text x="893" y="146" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HARDENED · LOG4J-CORE 2.17.1+ LITERAL
          </text>
          <rect x="664" y="170" width="458" height="122" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
          <text x="893" y="200" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x00007F9A11640000 · Literal Logging Only
          </text>
          <text x="893" y="230" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            Message Lookups Permanently Removed in 2.17.1+
          </text>
          <text x="893" y="260" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Untrusted HTTP Headers Logged Strictly as Plain Text
          </text>

          <rect x="664" y="312" width="458" height="122" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <text x="893" y="342" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            ZERO-TRUST EGRESS AIRLOCK
          </text>
          <text x="893" y="372" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT}>
            Outbound TCP/389, 636, 1389, 1099 Denied at Perimeter
          </text>
          <text x="893" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            SBOM CI Gate + auditd (java -&gt; shell) Armed 24/7
          </text>
        </g>

        <g className="lm-verdict">
          <rect x="110" y="502" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="536" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DFIR VERDICT: Log4j 2.17.1+ fixes data-vs-code separation while Egress Airlock + auditd neutralize zero-day bypasses
          </text>
          <text x="600" y="564" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Always scan nested shaded JARs across containers and third-party vendor appliances
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
