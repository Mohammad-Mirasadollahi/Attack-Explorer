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
    scenarioId: 'dns-tunneling-exfil',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const DNS_TUNNEL_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END DNS TUNNELING DFIR',
    title: 'T1071.004: RFC 1035 Packing -> Recursive NS/TXT -> Zeek Entropy -> RPZ Sinkhole',
    subtitle: 'Full forensic telemetry from Sysmon EID 22 attribution to RPZ & Port 53/853 lockdown',
    chalkHint: 'Hover any chalk box for RFC 1035 limits, Zeek entropy thresholds, and RPZ rules.',
    header: 'COVERT DNS TUNNELING (T1071.004) · FULL ENDPOINT-TO-RPZ ARCHITECTURE',
    footer: 'Primary Sources: IETF RFC 1035, Microsoft Sysmon EID 22, Unit 42 DNS Tunneling / OilRig Studies',
    p: 'dtb',
    r1: [
      { id: 'dtb-wk', label: 'WKSTN-FIN-14 (6248)\n56-Char Hex Labels\nSysmon EID 22', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Endpoint Attribution', module: 'Sysmon EID 22', fields: [{ key: 'Binary', value: 'telemetry_sync.exe' }], explain: 'Links unique high-entropy DNS lookups directly to the originating process.' } },
      { id: 'dtb-dns', label: 'DNS-INT-01 Recursive\n99.6% Cache Misses\nForwards External NS', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'api', title: 'Recursive Relay Bridge', module: '10.10.2.53:53', fields: [{ key: 'Behavior', value: 'Uncached forwarding' }], explain: 'Permitted internal recursion unintentionally ferries chunks across the perimeter.' } },
      { id: 'dtb-ns', label: 'Rogue Auth NS\n198.51.100.77:53\nTTL=0 TXT Replies', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Authoritative Collector', module: 'cdn-metrics-sync.example', fields: [{ key: 'Age', value: '4 days (NOD)' }], explain: 'Reassembles subdomain labels and sends encoded replies in TXT records.' } },
    ],
    a12: { cap: 'Unique QNAME', stroke: PAL.amber },
    a23: { cap: 'TXT / TTL=0', stroke: PAL.crimson },
    a34: { cap: 'Zeek Entropy 4.41', stroke: PAL.sky },
    a45: { cap: 'Activate RPZ', stroke: PAL.emerald },
    r2Right: { id: 'dtb-zk', label: 'Zeek + SIEM-408\nEntropy > 4.2 +\n412 Unique/Min', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Behavioral Analytics', module: 'Zeek dns.log', fields: [{ key: 'Est Exfil', value: '~184 KB' }], explain: 'Unmasks covert tunnels regardless of Hex, Base32, or custom encoding.' } },
    r2Mid: { id: 'dtb-rpz', label: 'RPZ Sinkhole +\nDeny Direct 53/853\n& Isolate Host', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Zero-Trust DNS Defense', module: 'DNS Firewall', fields: [{ key: 'Sinkhole', value: '10.255.255.53' }], explain: 'Terminates exfil instantly and forces all DNS through monitored resolvers.' } },
    stickyBox: { id: 'dtb-note', label: 'DFIR PRIORITY:\nPair Zeek Shannon entropy\nwith Sysmon EID 22 to\nget domain + exact PID!', tip: { kind: 'note', title: 'Dual-Plane Telemetry', module: 'SOC Playbook', fields: [{ key: 'Pair', value: 'Network + Host' }], explain: 'Network logs find the domain; Sysmon 22 finds the rogue binary.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · RFC 1035 PACKING & SYSMON EID 22',
    title: 'Subdomain Label Encoding Under RFC 1035 & Endpoint Process Attribution',
    subtitle: 'How isolated hosts pack data into 63-octet labels and how Sysmon EID 22 exposes the binary',
    chalkHint: 'Hover boxes for RFC 1035 bounds and exact Sysmon Event ID 22 fields.',
    header: 'STEP 1 · RFC 1035 63-OCTET LABEL CHUNKING & SYSMON EVENT ID 22',
    footer: 'Reference: IETF RFC 1035 Section 2.3.4 & Microsoft Sysmon Event ID 22',
    p: 'dt1',
    r1: [
      { id: 'dt1-src', label: 'Staged Finance File\nWKSTN-FIN-14\nNo Direct HTTP', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Segmented Host', module: '10.10.44.14', fields: [{ key: 'Constraint', value: 'HTTP/HTTPS blocked' }], explain: 'Workstation can only resolve internal DNS names via DNS-INT-01.' } },
      { id: 'dt1-enc', label: 'RFC 1035 Packing\n<= 63 Octets/Label\n<= 253 Chars Total', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Label Encoding', module: 'telemetry_sync.exe', fields: [{ key: 'Encoding', value: '56-char Hex chunks' }], explain: 'Encodes sequential 28-byte slices into unique subdomain prefixes.' } },
      { id: 'dt1-sys', label: 'Sysmon Event ID 22\nPID 6248 · Image\nQueryName Logged', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Host DNS Telemetry', module: 'Microsoft Sysmon', fields: [{ key: 'Path', value: 'C:\\ProgramData\\SyncCache\\' }], explain: 'Proves which exact process emitted the high-entropy DNS burst.' } },
    ],
    a12: { cap: 'Slice & Encode', stroke: PAL.crimson },
    a23: { cap: 'DnsQuery_W()', stroke: PAL.sky },
    a34: { cap: 'Hunt Unsigned', stroke: PAL.sky },
    a45: { cap: 'Alert SOC', stroke: PAL.emerald },
    r2Right: { id: 'dt1-hnt', label: 'Process Hunt\nNon-Browser Binary\n> 60 Unique/5m', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'EDR Hunting Rule', module: 'Sysmon EID 22', fields: [{ key: 'Filter', value: 'Unsigned + High Entropy' }], explain: 'Separates anomalous background binaries from normal web browsers.' } },
    r2Mid: { id: 'dt1-ir', label: 'Immediate Attribution\nExact Host + PID\n+ Binary Path', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Rapid Triage', module: 'SOC / IR', fields: [{ key: 'Benefit', value: 'Zero host guesswork' }], explain: 'Eliminates hunting across dozens of processes on a busy endpoint.' } },
    stickyBox: { id: 'dt1-note', label: 'SYSMON 22 VALUE:\nResolver logs show the\nworkstation IP — Sysmon\n22 names the exact EXE!', tip: { kind: 'note', title: 'Host Visibility', module: 'Windows DFIR', fields: [{ key: 'Event', value: 'Sysmon EID 22' }], explain: 'Critical telemetry for unmasking covert DNS beacons.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · RECURSIVE RESOLVER & TXT RELAY',
    title: 'Uncached Recursive Forwarding & Bidirectional TTL=0 TXT Command Channel',
    subtitle: 'Tracing how DNS-INT-01 relays unique labels to an external authoritative NS',
    chalkHint: 'Hover boxes to inspect recursive cache-miss mechanics and TXT replies.',
    header: 'STEP 2 · RECURSIVE DNS-INT-01 FORWARDING TO ROGUE AUTHORITATIVE NS',
    footer: 'Reference: Unit 42 OilRig/APT34 DNS Tunneling & Zeek dns.log Forensics',
    p: 'dt2',
    r1: [
      { id: 'dt2-int', label: 'DNS-INT-01\n10.10.2.53:53\n99.6% Cache Miss', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'api', title: 'Internal Resolver', module: 'Recursive DNS', fields: [{ key: 'Role', value: 'Unintended relay' }], explain: 'Cannot cache unique per-chunk labels and must query external NS.' } },
      { id: 'dt2-ns', label: 'Rogue Auth NS\n198.51.100.77:53\nReassembles Data', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'External NS Collector', module: 'ns1.cdn-metrics-sync.example', fields: [{ key: 'Protocol', value: 'UDP/53' }], explain: 'Strips leftmost subdomain chunk and reassembles files in sequence.' } },
      { id: 'dt2-txt', label: 'TXT Record Reply\nTTL = 0.0 Seconds\nEncoded Tasking', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Downlink Channel', module: 'DNS_TYPE_TEXT', fields: [{ key: 'Payload', value: 'v=ok;seq=043;cmd=...' }], explain: 'Zero-second TTL ensures every poll reaches the attacker server.' } },
    ],
    a12: { cap: 'Iterative Forward', stroke: PAL.crimson },
    a23: { cap: 'TTL=0 TXT Reply', stroke: PAL.amber },
    a34: { cap: 'Log Resolver Egress', stroke: PAL.sky },
    a45: { cap: 'Inspect Patterns', stroke: PAL.emerald },
    r2Right: { id: 'dt2-zk', label: 'Zeek dns.log\nCapture Recursive\n-> External NS', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Perimeter DNS Sensor', module: 'Zeek NSM', fields: [{ key: 'Signals', value: 'TXT/CNAME + TTL=0' }], explain: 'Monitors all outbound lookups leaving corporate recursive resolvers.' } },
    r2Mid: { id: 'dt2-def', label: 'Treat Resolver as\nPerimeter Egress\nBoundary', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Architectural Defense', module: 'Network Security', fields: [{ key: 'Scope', value: 'DNS-INT-01/02' }], explain: 'DNS recursion reaches the Internet even from segmented subnets.' } },
    stickyBox: { id: 'dt2-note', label: 'TTL=0 TELLTALE:\nLegitimate TXT records\n(SPF/DKIM) cache for\nhours — tunnels use 0s!', tip: { kind: 'note', title: 'Caching Anomaly', module: 'Passive DNS', fields: [{ key: 'Indicator', value: 'TTL=0 + High TXT' }], explain: 'Zero TTL prevents recursive caching so live commands get through.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · ZEEK ENTROPY & NOD CORRELATION',
    title: 'Multi-Feature DNS Tunneling Detection: Entropy, Volume, TXT Ratio & NOD Age',
    subtitle: 'Combining five statistical metrics to expose tunnels with near-zero false positives',
    chalkHint: 'Hover boxes to compare normal baseline values against tunneling thresholds.',
    header: 'STEP 3 · SHANNON ENTROPY (4.41), CACHE-MISS RATIO & NEWLY OBSERVED DOMAINS',
    footer: 'Reference: SIEM-ENTROPY-408 Behavioral DNS Tunneling Analytics',
    p: 'dt3',
    r1: [
      { id: 'dt3-ok', label: 'Baseline Hostnames\nEntropy ~2.7–3.2\nHigh Cache Reuse', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Normal Traffic Profile', module: 'Enterprise Baseline', fields: [{ key: 'Types', value: 'Mostly A / AAAA' }], explain: 'Human-readable domains repeat frequently and cache well.' } },
      { id: 'dt3-an', label: 'Tunnel Anomaly\nEntropy 4.41\n412 Unique / 60s', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Mathematical Footprint', module: 'Zeek dns.log', fields: [{ key: 'Misses', value: '99.6% · 78% TXT' }], explain: 'Encoded data streams inevitably spike character randomness and misses.' } },
      { id: 'dt3-nod', label: 'Domain Age Check\nNewly Observed\n(4 Days Old)', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'detect', title: 'Threat Intelligence', module: 'NOD Feed', fields: [{ key: 'Threshold', value: '< 30 days age' }], explain: 'Eliminates false alarms from established cloud CDN providers.' } },
    ],
    a12: { cap: 'Compare Baseline', stroke: PAL.crimson },
    a23: { cap: 'Enrich Age', stroke: PAL.amber },
    a34: { cap: 'Join Sysmon 22', stroke: PAL.sky },
    a45: { cap: 'Confirm Exfil', stroke: PAL.emerald },
    r2Right: { id: 'dt3-p1', label: 'SIEM-ENTROPY-408\nP1 Critical Alert\nEst Exfil: 184 KB', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'High-Confidence Alert', module: 'SIEM / SOAR', fields: [{ key: 'Source', value: 'WKSTN-FIN-14 (6248)' }], explain: 'Pairs five network features with exact endpoint process attribution.' } },
    r2Mid: { id: 'dt3-agn', label: 'Encoding-Agnostic\nCatches Hex, Base32\n& Custom Ciphers', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Resilient Detection', module: 'Statistical DFIR', fields: [{ key: 'Strength', value: 'Math beats obfuscation' }], explain: 'Any packed binary payload exhibits elevated entropy and unique labels.' } },
    stickyBox: { id: 'dt3-note', label: 'TUNNEL FORMULA:\nHigh Entropy (> 3.9) +\nLong Labels (> 38) +\n99% Misses + NOD = P1!', tip: { kind: 'note', title: 'False-Positive Control', module: 'Detection Engineering', fields: [{ key: 'Signals', value: '5 combined factors' }], explain: 'Prevents alert fatigue from legitimate CDN domains.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · RPZ SINKHOLE & EGRESS PORT 53/853 LOCK',
    title: 'Zero-Trust DNS Containment: RPZ Sinkholing, Firewall Lockdown & IR Scope',
    subtitle: 'Severing covert channels in milliseconds while closing direct port 53/DoT/DoH bypasses',
    chalkHint: 'Hover boxes for RPZ policy rules, firewall ports, and IR reconstruction steps.',
    header: 'STEP 4 · DNS RPZ SINKHOLE & MANDATORY INTERNAL RESOLVER ENFORCEMENT',
    footer: 'Reference: Enterprise DNS Firewall (RPZ) & Egress Port 53/853/DoH Hardening',
    p: 'dt4',
    r1: [
      { id: 'dt4-rpz', label: 'DNS RPZ Rule\n*.cdn-metrics-sync\n-> 10.255.255.53', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Instant Sinkhole', module: 'DNS-INT-01/02', fields: [{ key: 'Effect', value: 'Cuts exfil + TXT C2' }], explain: 'Redirects all rogue queries locally across the entire organization.' } },
      { id: 'dt4-fw', label: 'Perimeter Firewall\nDeny Direct 53/853\n& Public DoH', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'No Resolver Bypass', module: 'Workstation VLAN FW', fields: [{ key: 'Allow', value: 'Only DNS-INT-01/02' }], explain: 'Blocks malware from querying rogue external resolvers directly.' } },
      { id: 'dt4-ir', label: 'Endpoint IR\nIsolate Host +\nDecode dns.log', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'detect', title: 'Forensic Recovery', module: 'WKSTN-FIN-14', fields: [{ key: 'Action', value: 'Quarantine PID 6248' }], explain: 'Preserves staging buffers and quantifies exact exfiltrated files.' } },
    ],
    a12: { cap: 'Seal Bypasses', stroke: PAL.sky },
    a23: { cap: 'Quarantine Host', stroke: PAL.amber },
    a34: { cap: 'Audit Sinkhole', stroke: PAL.emerald },
    a45: { cap: 'Hardened Posture', stroke: PAL.emerald },
    r2Right: { id: 'dt4-mon', label: 'Sinkhole Monitor\nSpot Any Secondary\nInfected Hosts', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Fleet-Wide Sweep', module: 'Sinkhole Telemetry', fields: [{ key: 'IP', value: '10.255.255.53' }], explain: 'Reveals immediately if additional endpoints beacon to the same domain.' } },
    r2Mid: { id: 'dt4-ok', label: 'Zero-Trust DNS\nRPZ + NOD Guard +\nSysmon 22 Active', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Durable Defense', module: 'Enterprise DNS', fields: [{ key: 'Status', value: 'Covert channel closed' }], explain: 'Maintains complete visibility across every corporate DNS lookup.' } },
    stickyBox: { id: 'dt4-note', label: 'BYPASS CHECK:\nAlways block direct\nUDP/53, TCP/53, DoT 853\n& known public DoH IPs!', tip: { kind: 'note', title: 'Complete Enforcement', module: 'Perimeter Security', fields: [{ key: 'Goal', value: '100% resolver mediation' }], explain: 'RPZ only works when endpoints cannot bypass corporate resolvers.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #5 · STAGING BUFFER VS. DNSCACHE VS. RPZ',
    title: 'Memory Forensics Diff: Hex Staging Buffer & Zero-TTL Dnscache vs. RPZ Sinkhole',
    subtitle: 'Comparing volatile endpoint staging artifacts against hardened sinkhole enforcement',
    chalkHint: 'Hover boxes to inspect exact virtual addresses and forensic recovery steps.',
    header: 'MEMORY FORENSICS · HEX STAGING BUFFER & DNSCACHE CHURN VS. RPZ SINKHOLE',
    footer: 'Reference: WKSTN-FIN-14 Volatile Memory Audit (PID 6248 & svchost Dnscache PID 1420)',
    p: 'dtm',
    r1: [
      { id: 'dtm-buf', label: '0x1D840100000\nHex Staging Buffer\n56-Char Labels', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Staging Heap (RW-)', module: 'PID 6248', fields: [{ key: 'Hex', value: '4a9f2c8e1b7d3a04' }], explain: 'Holds encoded slices of sensitive finance records prior to lookup.' } },
      { id: 'dtm-cac', label: '0x1D840180000\nDnscache Table\nTTL=0 TXT Churn', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'DNS Client Cache', module: 'svchost (1420)', fields: [{ key: 'Misses', value: '99.6% unique' }], explain: 'Shows rapid uncached TXT acknowledgements ("v=ok;seq=043").' } },
      { id: 'dtm-aud', label: 'Forensic Capture\nMemory Dump +\nZeek Sequence Diff', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Scope Reconstruction', module: 'DFIR Team', fields: [{ key: 'Volume', value: '~184 KB confirmed' }], explain: 'Matches volatile unsent buffers with Zeek logs for exact loss scope.' } },
    ],
    a12: { cap: 'DnsQuery_W', stroke: PAL.amber },
    a23: { cap: 'Capture Evidence', stroke: PAL.sky },
    a34: { cap: 'Enforce RPZ', stroke: PAL.emerald },
    a45: { cap: 'Verify Zero Exfil', stroke: PAL.emerald },
    r2Right: { id: 'dtm-rpz', label: '0x1D840220000\nRPZ_SINKHOLE_DROP\n10.255.255.53', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Hardened Resolution', module: 'DNS Firewall', fields: [{ key: 'State', value: 'Blocked locally' }], explain: 'Rogue queries terminate safely inside internal sinkhole IP.' } },
    r2Mid: { id: 'dtm-ok', label: 'Eradicated Host\nClean Re-Image +\nPort 53/853 Lock', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Verified Safe State', module: 'Post-IR', fields: [{ key: 'Status', value: 'Tunnel eradicated' }], explain: 'Combines host rebuild with permanent DNS egress controls.' } },
    stickyBox: { id: 'dtm-note', label: 'MEMORY TAKEAWAY:\nDump volatile memory\nbefore isolating/rebooting\nto confirm exact exfil!', tip: { kind: 'note', title: 'Evidence Preservation', module: 'Incident Response', fields: [{ key: 'Target', value: 'PID 6248 + Dnscache' }], explain: 'Staging buffers reveal which files were queued for tunneling.' } },
  }),
};
