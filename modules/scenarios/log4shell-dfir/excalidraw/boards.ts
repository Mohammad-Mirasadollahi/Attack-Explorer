import type { Section3DKey } from '@/lib/section-3d-registry';
import type {
  TechnicalBoardDescriptor,
  TechnicalBoardSkeleton,
} from '@/lib/section-excalidraw-registry';
import {
  ARROW_GAP,
  box,
  hArrow,
  hArrowLeft,
  note,
  sticky,
  title,
  vArrow,
} from '@/modules/scenarios/dfir-lsass-minidump-comsvcs-sysmon-eid10/excalidraw/helpers';

const PAL = {
  amber: '#d97706',
  amberFill: '#fef3c7',
  crimson: '#e11d48',
  crimsonFill: '#ffe4e6',
  sky: '#0284c7',
  skyFill: '#e0f2fe',
  emerald: '#059669',
  emeraldFill: '#d1fae5',
  muted: '#64748b',
} as const;

function makeOrthogonalBoard(cfg: {
  sectionKey: Section3DKey;
  boardBadge: string;
  title: string;
  subtitle: string;
  chalkHint: string;
  header: string;
  footer: string;
  p: string;
  r1: [
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
  ];
  a12: { cap: string; stroke: string };
  a23: { cap: string; stroke: string };
  a34: { cap: string; stroke: string };
  a45: { cap: string; stroke: string };
  r2Right: { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
  r2Mid: { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
  stickyBox: { id: string; label: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
}): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;
  const b1 = { x: 40, w: 242 };
  const b2 = { x: b1.x + b1.w + ARROW_GAP, w: 256 };
  const b3 = { x: b2.x + b2.w + ARROW_GAP, w: 252 };

  const tooltips: TechnicalBoardDescriptor['tooltips'] = {
    [cfg.r1[0].id]: cfg.r1[0].tip,
    [cfg.r1[1].id]: cfg.r1[1].tip,
    [cfg.r1[2].id]: cfg.r1[2].tip,
    [cfg.r2Right.id]: cfg.r2Right.tip,
    [cfg.r2Mid.id]: cfg.r2Mid.tip,
    [cfg.stickyBox.id]: cfg.stickyBox.tip,
  };

  const skeletons: TechnicalBoardSkeleton[] = [
    title(40, 12, cfg.header),
    box({ id: cfg.r1[0].id, x: b1.x, y: y1, w: b1.w, h: h1, label: cfg.r1[0].label, stroke: cfg.r1[0].stroke, fill: cfg.r1[0].fill }),
    ...hArrow({ id: `${cfg.p}-a1`, fromId: cfg.r1[0].id, toId: cfg.r1[1].id, fromRight: b1.x + b1.w, toLeft: b2.x, midY: y1 + h1 / 2, caption: cfg.a12.cap, stroke: cfg.a12.stroke }),
    box({ id: cfg.r1[1].id, x: b2.x, y: y1, w: b2.w, h: h1, label: cfg.r1[1].label, stroke: cfg.r1[1].stroke, fill: cfg.r1[1].fill }),
    ...hArrow({ id: `${cfg.p}-a2`, fromId: cfg.r1[1].id, toId: cfg.r1[2].id, fromRight: b2.x + b2.w, toLeft: b3.x, midY: y1 + h1 / 2, caption: cfg.a23.cap, stroke: cfg.a23.stroke }),
    box({ id: cfg.r1[2].id, x: b3.x, y: y1, w: b3.w, h: h1, label: cfg.r1[2].label, stroke: cfg.r1[2].stroke, fill: cfg.r1[2].fill }),
    ...vArrow({ id: `${cfg.p}-a3`, fromId: cfg.r1[2].id, toId: cfg.r2Right.id, midX: b3.x + b3.w / 2, fromBottom: y1 + h1, toTop: y2, caption: cfg.a34.cap, stroke: cfg.a34.stroke, captionOffsetX: 16 }),
    sticky({ id: cfg.stickyBox.id, x: 40, y: y2, w: 350, h: h2, label: cfg.stickyBox.label }),
    box({ id: cfg.r2Mid.id, x: b2.x, y: y2, w: b2.w, h: h2, label: cfg.r2Mid.label, stroke: cfg.r2Mid.stroke, fill: cfg.r2Mid.fill }),
    ...hArrowLeft({ id: `${cfg.p}-a4`, fromId: cfg.r2Right.id, toId: cfg.r2Mid.id, fromLeft: b3.x, toRight: b2.x + b2.w, midY: y2 + h2 / 2, caption: cfg.a45.cap, stroke: cfg.a45.stroke }),
    box({ id: cfg.r2Right.id, x: b3.x, y: y2, w: b3.w, h: h2, label: cfg.r2Right.label, stroke: cfg.r2Right.stroke, fill: cfg.r2Right.fill }),
    note(40, 464, cfg.footer, PAL.muted),
  ];

  return {
    scenarioId: 'log4shell-dfir',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const LOG4SHELL_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END LOG4SHELL DFIR',
    title: 'CVE-2021-44228: Header Logging -> JndiLookup -> Zeek/auditd -> 2.17.1+ Airlock',
    subtitle: 'Full forensic telemetry from edge Nginx ingress to CISA ED 22-02 containment',
    chalkHint: 'Hover any chalk box for protocols, JAR versions, and evasion-proof detection rules.',
    header: 'LOG4SHELL (CVE-2021-44228) · FULL INGRESS-TO-EGRESS DFIR CHAIN',
    footer: 'Primary Sources: NVD/Apache CVE-2021-44228, CISA ED 22-02, Swiss NCSC (GOVCERT.ch)',
    p: 'l4b',
    r1: [
      { id: 'l4b-ing', label: 'EDGE-GW-02 Nginx\nUntrusted Header\nSuricata SID 2034649', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Edge HTTP Access Log', module: 'Nginx / WAF', fields: [{ key: 'Header', value: 'X-Api-Version' }], explain: 'Records inbound lookup probes while warning that nested obfuscation can evade regex.' } },
      { id: 'l4b-jar', label: 'APP-JVM-01 (4418)\nlog4j-core-2.14.1\nJndiLookup Active', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'MessagePatternConverter Flaw', module: 'log4j-core', fields: [{ key: 'Setting', value: 'formatMsgNoLookups=false' }], explain: 'Evaluates untrusted log text as an active JNDI directory lookup.' } },
      { id: 'l4b-eg', label: 'Outbound TCP/1389\nZeek LDAP Alert +\nauditd java -> sh', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Evasion-Resistant Detection', module: 'Zeek + Linux auditd', fields: [{ key: 'Syscall', value: 'execve (ppid=java)' }], explain: 'Behavioral egress + child shell telemetry beats every header obfuscation trick.' } },
    ],
    a12: { cap: 'Forwards HTTP', stroke: PAL.amber },
    a23: { cap: 'InitialContext.lookup', stroke: PAL.crimson },
    a34: { cap: 'CISA ED 22-02', stroke: PAL.emerald },
    a45: { cap: 'Verify Clean', stroke: PAL.emerald },
    r2Right: { id: 'l4b-fw', label: 'Egress Airlock\nDeny TCP 389/636\n1389/1099 Outbound', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Zero-Trust Server Egress', module: 'DMZ Firewall', fields: [{ key: 'Policy', value: 'Default-deny directory egress' }], explain: 'Immediately cuts off remote directory lookups from application tiers.' } },
    r2Mid: { id: 'l4b-fix', label: 'Log4j 2.17.1+ +\nSBOM Fat-JAR Scan\n+ Clean Re-Image', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Permanent Eradication', module: 'Apache Log4j 2.17.1+', fields: [{ key: 'Change', value: 'Message lookups removed' }], explain: 'Upgrades every nested JAR, rebuilds breached hosts, and rotates secrets.' } },
    stickyBox: { id: 'l4b-note', label: 'DFIR PRIORITY:\nWAF regexes miss nested\nobfuscation — Zeek 1389\n+ auditd java->sh win!', tip: { kind: 'note', title: 'Behavioral Detection Advantage', module: 'SOC Playbook', fields: [{ key: 'Pair', value: 'Egress + Process Lineage' }], explain: 'Confirm real exploitation vs benign scanning using outbound network + host execve.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · INGRESS ACCESS LOGS & WAF LIMITS',
    title: 'Edge HTTP Header Telemetry & Why Regex WAF Alone Is Insufficient',
    subtitle: 'Capturing inbound indicators cleanly while recognizing nested substitution evasion',
    chalkHint: 'Hover boxes for Nginx, Suricata SID 2034649, and OWASP CRS details.',
    header: 'STEP 1 · UNTRUSTED HTTP HEADER INGRESS & SURICATA SID 2034649',
    footer: 'Reference: GOVCERT.ch Log4Shell Analysis & OWASP CRS 944150',
    p: 'l41',
    r1: [
      { id: 'l41-req', label: 'External Client\n198.51.100.42\nCrafted Header', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'network', title: 'Unauthenticated HTTP Request', module: 'TCP/443', fields: [{ key: 'Fields', value: 'User-Agent / X-Api-Version' }], explain: 'Any logged untrusted HTTP field can reach vulnerable Log4j2.' } },
      { id: 'l41-ngx', label: 'Nginx / Suricata\nSID 2034649 +\nOWASP CRS 944150', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Edge Visibility', module: 'EDGE-GW-02', fields: [{ key: 'Role', value: 'Early Tripwire + Forensics' }], explain: 'Preserves full request headers and source IPs for hunting.' } },
      { id: 'l41-ev', label: 'Nested Obfuscation\nBypasses Naive\nStatic WAF Regex', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Ingress Filter Limitation', module: 'WAF Caveat', fields: [{ key: 'Lesson', value: 'Never rely on WAF alone' }], explain: 'Nested lookups can disguise keywords while still resolving in Log4j2.' } },
    ],
    a12: { cap: 'HTTPS Request', stroke: PAL.amber },
    a23: { cap: 'Obfuscation Risk', stroke: PAL.crimson },
    a34: { cap: 'Layer Defenses', stroke: PAL.emerald },
    a45: { cap: 'Correlate Logs', stroke: PAL.emerald },
    r2Right: { id: 'l41-hunt', label: 'Retrospective Hunt\nQuery Access Logs\n+ Egress Telemetry', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'DFIR Correlation', module: 'SIEM', fields: [{ key: 'Join', value: 'HTTP ts <-> Zeek/auditd ts' }], explain: 'Separates opportunistic scans from actual code execution.' } },
    r2Mid: { id: 'l41-def', label: 'Defense-in-Depth\nPatch 2.17.1+ +\nEgress Airlock', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Durable Posture', module: 'CISA ED 22-02', fields: [{ key: 'Controls', value: 'Library + Network + Host' }], explain: 'Removes root cause rather than playing regex whack-a-mole.' } },
    stickyBox: { id: 'l41-note', label: 'INGRESS LESSON:\nLog full headers for\nDFIR, but enforce fixes\nat JVM & Egress!', tip: { kind: 'note', title: 'Layered Security', module: 'Web Defense', fields: [{ key: 'Priority', value: 'Patch + Egress' }], explain: 'WAF rules buy patching time; they do not replace upgrading log4j-core.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · MESSAGEPATTERNCONVERTER & SBOM',
    title: 'Inside log4j-core-2.14.1: How Log Data Triggers JndiLookup & Fat-JAR Hunting',
    subtitle: 'Tracing MessagePatternConverter evaluation and finding nested shaded dependencies',
    chalkHint: 'Hover boxes to inspect vulnerable Log4j2 internals and SBOM hunting steps.',
    header: 'STEP 2 · LOG4J2 MESSAGEPATTERNCONVERTER & SHADED JAR INVENTORY',
    footer: 'Reference: Apache Logging Security Advisory CVE-2021-44228',
    p: 'l42',
    r1: [
      { id: 'l42-log', label: 'Java App Logger\nlogger.info(hdr)\nlog4j-core 2.14.1', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Vulnerable Library', module: 'PID 4418', fields: [{ key: 'Range', value: '2.0-beta9 to 2.14.1' }], explain: 'Routine diagnostic logging feeds untrusted headers into Log4j2.' } },
      { id: 'l42-mpc', label: 'MessagePattern\nConverter\nNoLookups=false', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Recursive Lookup Parser', module: 'log4j-core', fields: [{ key: 'Class', value: 'JndiLookup' }], explain: 'Evaluates lookup syntax inside log messages instead of treating text literally.' } },
      { id: 'l42-jndi', label: 'InitialContext\n.lookup()\nExternal Directory', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'JNDI Resolution', module: 'javax.naming', fields: [{ key: 'Protocols', value: 'LDAP / RMI / DNS' }], explain: 'Initiates unverified outbound network directory lookups.' } },
    ],
    a12: { cap: 'Formats Message', stroke: PAL.crimson },
    a23: { cap: 'Invokes JNDI', stroke: PAL.crimson },
    a34: { cap: 'Fleet Inventory', stroke: PAL.sky },
    a45: { cap: 'Upgrade All', stroke: PAL.emerald },
    r2Right: { id: 'l42-sbom', label: 'SBOM & Archive Scan\nInspect Fat JARs\nWAR / EAR / Pods', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Deep Dependency Discovery', module: 'TVM / Syft / Trivy', fields: [{ key: 'Target', value: 'Nested log4j-core jars' }], explain: 'Finds hidden shaded copies embedded inside third-party software.' } },
    r2Mid: { id: 'l42-up', label: 'Target Release\nlog4j-core 2.17.1+\n(2.23+ LTS)', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Fixed Library', module: 'Apache Log4j2', fields: [{ key: 'Status', value: 'Lookups permanently off' }], explain: 'Eliminates CVE-2021-44228 and follow-on CVE-2021-45046.' } },
    stickyBox: { id: 'l42-note', label: 'SHADED JAR TRAP:\nCheck inside WAR/EAR\nand vendor appliances\nfor hidden log4j-core!', tip: { kind: 'note', title: 'Complete Coverage', module: 'Vulnerability Management', fields: [{ key: 'Method', value: 'Runtime + Filesystem scan' }], explain: 'Checking source repos alone misses pre-built commercial appliances.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · ZEEK EGRESS & LINUX AUDITD EXECVE',
    title: 'Evasion-Proof Behavioral Detection: Outbound TCP/1389 + java Spawning Shell',
    subtitle: 'Confirming active exploitation with zero dependence on HTTP string signatures',
    chalkHint: 'Hover boxes to inspect exact Zeek fields and Linux auditd execve rules.',
    header: 'STEP 3 · ZEEK OUTBOUND DIRECTORY TELEMETRY & LINUX AUDITD EXECVE',
    footer: 'Reference: CISA Log4j DFIR Guidance & Linux auditd Syscall 59 Monitoring',
    p: 'l43',
    r1: [
      { id: 'l43-jvm', label: 'APP-JVM-01\n10.20.40.22\njava PID 4418', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Affected Workload', module: 'DMZ App Tier', fields: [{ key: 'User', value: 'appuser (uid=1001)' }], explain: 'Java billing server unexpectedly performs external lookup and process spawn.' } },
      { id: 'l43-zeek', label: 'Zeek Network Log\nOutbound TCP/1389\njavaNamingReference', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Network Egress Signal', module: 'Zeek LDAP/RMI', fields: [{ key: 'Dest', value: '198.51.100.42:1389' }], explain: 'Web microservices should never open external LDAP or RMI sessions.' } },
      { id: 'l43-aud', label: 'Linux auditd\nsyscall=59 execve\njava -> /bin/sh', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'Kernel Process Signal', module: 'Linux auditd', fields: [{ key: 'Parent', value: 'java (4418)' }, { key: 'Child', value: 'sh (5102)' }], explain: 'High-fidelity indicator of post-exploitation code execution.' } },
    ],
    a12: { cap: 'Egress Lookup', stroke: PAL.sky },
    a23: { cap: 'Spawns Shell', stroke: PAL.crimson },
    a34: { cap: 'Correlate P1', stroke: PAL.crimson },
    a45: { cap: 'Contain & Rebuild', stroke: PAL.emerald },
    r2Right: { id: 'l43-p1', label: 'Confirmed Breach\nSeparates Scans\nFrom Real RCE', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'High-Fidelity Triage', module: 'SIEM / SOAR', fields: [{ key: 'Priority', value: 'P1 Critical' }], explain: 'Eliminates alert fatigue from massive Internet-wide scanning.' } },
    r2Mid: { id: 'l43-ir', label: 'Immediate Action\nIsolate Host +\nCapture Memory', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Incident Containment', module: 'IR Team', fields: [{ key: 'Next', value: 'Re-image + Rotate keys' }], explain: 'Stops lateral movement and preserves forensic evidence.' } },
    stickyBox: { id: 'l43-note', label: 'GOLDEN RULE:\njava -> sh/bash/curl\nin auditd execve is\n100% obfuscation-proof!', tip: { kind: 'note', title: 'Behavioral Advantage', module: 'Linux DFIR', fields: [{ key: 'Syscall', value: '59 (execve)' }], explain: 'Focuses on attacker outcome rather than fragile HTTP syntax.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · CISA ED 22-02 HARDENING & AIRLOCK',
    title: 'Permanent Eradication: Log4j 2.17.1+ + Egress Airlock + Clean Re-Image',
    subtitle: 'Layered controls closing CVE-2021-44228 and future server-side lookup risks',
    chalkHint: 'Hover boxes to inspect egress ports, patch version, and post-breach rotation.',
    header: 'STEP 4 · CISA ED 22-02 REMEDIATION & ZERO-TRUST EGRESS AIRLOCK',
    footer: 'Reference: CISA Emergency Directive 22-02 & Apache Log4j 2.17.1+ Release Notes',
    p: 'l44',
    r1: [
      { id: 'l44-fw', label: 'Egress Airlock\nBlock TCP 389/636\n1389/1099 Outbound', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Immediate Network Barrier', module: 'DMZ Firewall', fields: [{ key: 'Scope', value: 'All Web & App Subnets' }], explain: 'Neutralizes remote directory callbacks even before patching finishes.' } },
      { id: 'l44-up', label: 'Upgrade Log4j2\nlog4j-core 2.17.1+\nLookups Removed', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Root-Cause Fix', module: 'Apache Log4j2', fields: [{ key: 'Version', value: '>= 2.17.1 (2.23+ LTS)' }], explain: 'Treats every logged message strictly as literal text.' } },
      { id: 'l44-reb', label: 'Rebuild & Rotate\nClean Image +\nNew DB/API Keys', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'detect', title: 'Post-Breach Eradication', module: 'IR Playbook', fields: [{ key: 'Action', value: 'Re-image + Secret rotation' }], explain: 'Removes persistence and revokes any stolen environment variables.' } },
    ],
    a12: { cap: 'Deploy Patch', stroke: PAL.emerald },
    a23: { cap: 'Eradicate Host', stroke: PAL.amber },
    a34: { cap: 'Lock Pipeline', stroke: PAL.emerald },
    a45: { cap: 'Verified Safe', stroke: PAL.emerald },
    r2Right: { id: 'l44-ci', label: 'CI/CD SBOM Gate\nDeny log4j-core\n< 2.17.1 Builds', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Regression Prevention', module: 'DevSecOps', fields: [{ key: 'Check', value: 'Automated SCA policy' }], explain: 'Prevents vulnerable transitive libraries from ever re-entering builds.' } },
    r2Mid: { id: 'l44-ok', label: 'Hardened App Tier\nLiteral Logs Only\nEgress + auditd ON', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Resilient Architecture', module: 'Zero-Trust DMZ', fields: [{ key: 'Status', value: 'CISA ED 22-02 Compliant' }], explain: 'Combines patched libraries, egress isolation, and kernel monitoring.' } },
    stickyBox: { id: 'l44-note', label: 'IF COMPROMISED:\nPatching alone is NOT\nenough — re-image host\n& rotate all secrets!', tip: { kind: 'note', title: 'Incident Recovery Rule', module: 'DFIR', fields: [{ key: 'Reason', value: 'Env vars & cloud tokens exposed' }], explain: 'Always assume accessible credentials were read if java spawned a shell.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #5 · JVM RUNTIME LOG4J STATE COMPARISON',
    title: 'Memory & Bytecode Diff: Log4j 2.14.1 Active Lookup vs. 2.17.1+ Literal Mode',
    subtitle: 'Comparing vulnerable JndiLookup runtime state against patched literal-only execution',
    chalkHint: 'Hover boxes to inspect exact JVM memory addresses and hardened states.',
    header: 'MEMORY FORENSICS · LOG4J 2.14.1 JNDILOOKUP VS. 2.17.1+ LITERAL LOGGING',
    footer: 'Reference: JVM PID 4418 Runtime Classpath Audit on APP-JVM-01',
    p: 'l4m',
    r1: [
      { id: 'l4m-old', label: '0x7F9A11200000\nlog4j-core 2.14.1\nJndiLookup=ENABL', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Vulnerable Bytecode', module: 'log4j-core', fields: [{ key: 'State', value: 'formatMsgNoLookups=false' }], explain: 'Actively evaluates untrusted lookup expressions in log messages.' } },
      { id: 'l4m-ref', label: '0x7F9A11480000\nClassLoader State\njavaNamingRef', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Remote Lookup State', module: 'JVM Heap', fields: [{ key: 'Egress', value: 'TCP/1389 external-dir' }], explain: 'Attempts to resolve unverified external naming attributes.' } },
      { id: 'l4m-aud', label: 'Runtime SBOM Audit\nClasspath Check +\nZeek + auditd', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Verification Plane', module: 'DFIR / TVM', fields: [{ key: 'Scope', value: 'All running JVMs' }], explain: 'Detects both loaded vulnerable classes and anomalous runtime behavior.' } },
    ],
    a12: { cap: 'Triggers Lookup', stroke: PAL.crimson },
    a23: { cap: 'Blue-Team Audit', stroke: PAL.sky },
    a34: { cap: 'Upgrade JAR', stroke: PAL.emerald },
    a45: { cap: 'Verify Airlock', stroke: PAL.emerald },
    r2Right: { id: 'l4m-new', label: '0x7F9A11640000\nLOG4J_2_17_LITER\nLookups Removed', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Patched Bytecode', module: 'log4j-core 2.17.1+', fields: [{ key: 'Mode', value: 'Literal text only' }], explain: 'Never evaluates message strings as directory commands.' } },
    r2Mid: { id: 'l4m-ok', label: 'Hardened Runtime\nEgress Blocked +\nClean Container', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Verified Safe State', module: 'Production Tier', fields: [{ key: 'Status', value: 'CVE-2021-44228 Closed' }], explain: 'Combines patched JVM runtime with strict network egress controls.' } },
    stickyBox: { id: 'l4m-note', label: 'MEMORY TAKEAWAY:\nData must NEVER be\nevaluated as code in\na logging library!', tip: { kind: 'note', title: 'Architectural Principle', module: 'Secure Engineering', fields: [{ key: 'Fix', value: 'Literal logging + Egress airlock' }], explain: 'Loggers must remain strictly passive sinks for untrusted input.' } },
  }),
};
