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
    scenarioId: 'aukill-edr-killer-procxp152-byovd',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const AUKILL_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END BYOVD EDR KILLER & HVCI BLOCKLIST',
    title: 'T1543.003: Signed PROCEXP152.SYS -> IOCTL PPL Bypass -> Kill Loop -> HVCI Block',
    subtitle: 'Full Ring 3 to Ring 0 EDR blinding architecture and hypervisor-isolated mitigation',
    chalkHint: 'Hover any chalk box for IOCTL codes, PPL bypass mechanics, and CodeIntegrity EID 3077.',
    header: 'AUKILL BYOVD EDR KILLER (PROCEXP152.SYS) ARCHITECTURE & HVCI CONTAINMENT',
    footer: 'Primary Sources: Sophos X-Ops AuKill Analysis, Microsoft Driver Blocklist & LOLDrivers',
    p: 'akb',
    r1: [
      { id: 'akb-ld', label: 'aukill.exe (PID 5104)\nDrops PROCEXP152.SYS\nSCM EID 7045', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'BYOVD Dropper', module: 'SRV-APP-09', fields: [{ key: 'Signer', value: 'Valid Microsoft v16.32' }], explain: 'Loads outdated signed Process Explorer driver into Ring 0 via SCM.' } },
      { id: 'akb-r0', label: 'Ring 0 PROCEXP152\nIOCTL 0x8335003C\nIOCTL 0x83350004', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Kernel Dispatch Abuse', module: '\\\\.\\PROCEXP152', fields: [{ key: 'APIs', value: 'ZwOpenProcess + ZwTerminate' }], explain: 'Executes process open and kill inside Ring 0, ignoring user-mode PPL armor.' } },
      { id: 'akb-edr', label: 'PPL EDR Sensors\nMsMpEng PID 2188\nEID 7031 Blindness', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'Blinded Watchtower', module: 'WinDefend / EDR', fields: [{ key: 'Impact', value: 'Pre-Ransomware Window' }], explain: 'Continuous kill loop defeats SCM auto-restart and drops SOC heartbeats.' } },
    ],
    a12: { cap: 'Load Ring 0', stroke: PAL.amber },
    a23: { cap: 'Kill Loop', stroke: PAL.crimson },
    a34: { cap: 'Enable HVCI', stroke: PAL.emerald },
    a45: { cap: 'Alert EID 3077', stroke: PAL.sky },
    r2Right: { id: 'akb-hvci', label: 'HVCI + Blocklist\nCI.dll Hash Check\n0xC0000428 Deny', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Pre-Load Prevention', module: 'Memory Integrity', fields: [{ key: 'Rule', value: 'MS Driver Block Rules' }], explain: 'Rejects revoked vulnerable driver hashes before Ring 0 initialization.' } },
    r2Mid: { id: 'akb-soc', label: 'SOC SIEM Alert\nCodeIntegrity 3077 +\nSysmon 6 + EID 7031', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Zero-FP Alarm', module: 'SIEM Correlation', fields: [{ key: 'Meaning', value: 'Active Admin Intrusion' }], explain: 'Blocked BYOVD load proves attacker already holds local admin rights.' } },
    stickyBox: { id: 'akb-note', label: 'BYOVD FUNDAMENTAL:\nValid signatures prove who\ncompiled a driver years ago,\nNOT that it is safe in Ring 0!', tip: { kind: 'note', title: 'Trust Boundary', module: 'Windows Kernel', fields: [{ key: 'Fix', value: 'HVCI + LOLDrivers Block' }], explain: 'Driver blocklists revoke dangerous legacy drivers without breaking signing.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · SIGNED PROCEXP152.SYS DROP & SERVICE LOAD',
    title: 'T1543.003: Smuggling Outdated Microsoft-Signed Driver Into Ring 0',
    subtitle: 'Why standard Driver Signature Enforcement admits PROCEXP152.SYS v16.32',
    chalkHint: 'Hover boxes for SCM service registration, Sysmon EID 6, and LOLDrivers tracking.',
    header: 'STEP 1 · BYOVD DRIVER DROP, SCM REGISTRATION & RING 0 LOAD',
    footer: 'Reference: Microsoft Sysmon Event ID 6, Windows System EID 7045 & LOLDrivers',
    p: 'ak1',
    r1: [
      { id: 'ak1-au', label: 'aukill.exe (5104)\nImpersonates TI\nWrites .sys to Disk', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Driver Extraction', module: 'System32\\drivers\\', fields: [{ key: 'File', value: 'PROCEXP152.sys' }], explain: 'Extracts embedded outdated Sysinternals driver onto the server.' } },
      { id: 'ak1-scm', label: 'SCM CreateService\nType 0x1 Kernel\nValid MS Authenticode', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'DSE Verification', module: 'services.exe', fields: [{ key: 'Check', value: 'Crypto Sig Valid' }], explain: 'Standard DSE checks only signature validity, not vulnerability status.' } },
      { id: 'ak1-r0', label: 'Kernel Mapping\n0xFFFFF80541200000\n\\\\.\\PROCEXP152', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Ring 0 Entry', module: 'Kernel Pool', fields: [{ key: 'Link', value: 'Symbolic Link Open' }], explain: 'Exposes vulnerable IOCTL dispatch interface to user-mode callers.' } },
    ],
    a12: { cap: 'CreateService', stroke: PAL.amber },
    a23: { cap: 'DSE Admits', stroke: PAL.crimson },
    a34: { cap: 'Sysmon EID 6', stroke: PAL.sky },
    a45: { cap: 'LOLDrivers Match', stroke: PAL.emerald },
    r2Right: { id: 'ak1-e6', label: 'Sysmon EID 6 +\nSystem EID 7045\nDriverLoaded Hash', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Load Telemetry', module: 'Sigma DriverLoad', fields: [{ key: 'Match', value: 'PROCEXP152.sys' }], explain: 'Captures exact driver hash, path, and signature on every kernel load.' } },
    r2Mid: { id: 'ak1-blk', label: 'WDAC / HVCI Policy\nRevoke Vulnerable\nSigned Driver Hash', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Preventive Deny', module: 'Driver Blocklist', fields: [{ key: 'Catalog', value: 'LOLDrivers + MS Rules' }], explain: 'Stops outdated signed drivers before SCM can initialize Ring 0 code.' } },
    stickyBox: { id: 'ak1-note', label: 'TELEMETRY PAIR:\nAlways collect Sysmon EID 6\nalongside System EID 7045 so\nyou capture both SHA-256 hash\nand service creation context.', tip: { kind: 'note', title: 'DFIR Logging', module: 'Kernel Audit', fields: [{ key: 'Events', value: 'EID 6 + EID 7045' }], explain: 'Essential for spotting renamed BYOVD binaries by cryptographic hash.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · IOCTL 0x8335003C PPL HANDLE BYPASS',
    title: 'T1068: Acquiring PROCESS_ALL_ACCESS Handle to PPL MsMpEng.exe via Ring 0',
    subtitle: 'How missing caller ACL checks turn Process Explorer driver into a PPL bypass',
    chalkHint: 'Hover boxes for IOCTL 0x8335003C input, EPROCESS.Protection, and KQL hunting.',
    header: 'STEP 2 · UNAUTHENTICATED IOCTL 0x8335003C BYPASSES PPL ARMOR',
    footer: 'Reference: Sophos X-Ops AuKill Reverse Engineering & Windows PPL Architecture',
    p: 'ak2',
    r1: [
      { id: 'ak2-u3', label: 'aukill.exe (Ring 3)\nCreateFile \\\\.\\PROCEXP\nIOCTL 0x8335003C', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'DeviceIoControl Call', module: 'Ring 3 -> Ring 0', fields: [{ key: 'Payload', value: 'Target PID 2188' }], explain: 'Passes MsMpEng.exe PID directly to the unauthenticated driver device.' } },
      { id: 'ak2-zw', label: 'PROCEXP152 Dispatch\nNo Caller ACL Check\nCalls ZwOpenProcess', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Kernel Proxy Open', module: 'Ring 0 Handler', fields: [{ key: 'Privilege', value: 'Bypasses PPL Check' }], explain: 'Kernel callers bypass EPROCESS.Protection checks that stop user mode.' } },
      { id: 'ak2-hd', label: 'Handle 0x000003A4\nPROCESS_ALL_ACCESS\nReturned to Ring 3', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Privileged Handle', module: 'MsMpEng PID 2188', fields: [{ key: 'Access', value: '0x1FFFFF Full Control' }], explain: 'Hands user-mode aukill.exe terminate power over an armored EDR sensor.' } },
    ],
    a12: { cap: 'PID 2188 Buffer', stroke: PAL.amber },
    a23: { cap: 'Return 0x03A4', stroke: PAL.crimson },
    a34: { cap: 'ETW / DeviceEvents', stroke: PAL.sky },
    a45: { cap: 'Block Device ACL', stroke: PAL.emerald },
    r2Right: { id: 'ak2-kql', label: 'KQL DeviceEvents\nNon-procexp Binary\nOpening PROCEXP152', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Caller Anomaly', module: 'EDR Telemetry', fields: [{ key: 'Exclude', value: 'procexp64.exe' }], explain: 'Flags unauthorized processes communicating with Process Explorer device.' } },
    r2Mid: { id: 'ak2-ppl', label: 'PPL Boundary Truth\nPPL Stops Ring 3,\nNeeds HVCI for Ring 0', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Layered Defense', module: 'Windows Security', fields: [{ key: 'Pair', value: 'PPL + HVCI Blocklist' }], explain: 'Protecting Ring 0 driver integrity is mandatory to keep PPL intact.' } },
    stickyBox: { id: 'ak2-note', label: 'WHY PPL FAILED HERE:\nPPL blocks user-mode SYSTEM\nfrom opening MsMpEng.exe,\nbut Ring 0 kernel drivers\nautomatically outrank PPL.', tip: { kind: 'note', title: 'Ring Hierarchy', module: 'NT Kernel', fields: [{ key: 'Rule', value: 'Ring 0 > Ring 3 PPL' }], explain: 'Any unauthenticated kernel OpenProcess driver shatters PPL isolation.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · IOCTL 0x83350004 CONTINUOUS EDR KILL LOOP',
    title: 'T1562.001: Ring 0 nt!ZwTerminateProcess Silences Watchtowers & Defeats Restart',
    subtitle: 'How continuous polling triggers System EID 7031 bursts and SOC heartbeat silence',
    chalkHint: 'Hover boxes for IOCTL 0x83350004 loop, EID 7031 telemetry, and dead-man-switch alerts.',
    header: 'STEP 3 · CONTINUOUS IOCTL 0x83350004 KILL LOOP & TELEMETRY BLINDNESS',
    footer: 'Reference: MITRE ATT&CK T1562.001 & Windows System Service Crash Telemetry',
    p: 'ak3',
    r1: [
      { id: 'ak3-lp', label: 'aukill.exe Kill Loop\nIOCTL 0x83350004\nEvery 100ms Poll', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Persistent Killer', module: 'PID 5104', fields: [{ key: 'Targets', value: 'Defender/CS/S1/Sophos' }], explain: 'Continuously scans for restarting security processes and kills them again.' } },
      { id: 'ak3-zt', label: 'nt!ZwTerminateProcess\nExecuted in Ring 0\nNo User-Mode Hook', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Uninterceptable Kill', module: 'NT Kernel', fields: [{ key: 'Handle', value: '0x000003A4' }], explain: 'Bypasses EDR user-mode self-defense and tamper protection hooks.' } },
      { id: 'ak3-70', label: 'System EID 7031\nWinDefend Crashed\n0 SOC Heartbeats', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'Telemetry Blackout', module: 'SRV-APP-09', fields: [{ key: 'EventID', value: '7031 / 7034 Burst' }], explain: 'Sensor goes dark right before ransomware affiliates encrypt volumes.' } },
    ],
    a12: { cap: 'Handle 0x03A4', stroke: PAL.crimson },
    a23: { cap: 'Kill Sensor', stroke: PAL.amber },
    a34: { cap: 'Dead-Man Switch', stroke: PAL.sky },
    a45: { cap: 'Auto-Isolate Host', stroke: PAL.emerald },
    r2Right: { id: 'ak3-sig', label: 'SIEM Dead-Man Alert\nEID 7031 Security Crash\n+ Heartbeat Loss', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Silence Detection', module: 'SOC Correlation', fields: [{ key: 'Window', value: '< 60s Silence' }], explain: 'Catches blinded endpoints even when the EDR agent itself stops logging.' } },
    r2Mid: { id: 'ak3-iso', label: 'SOAR Containment\nQuarantine SRV-APP-09\nBefore Ransomware', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Rapid Isolation', module: 'Network Quarantine', fields: [{ key: 'Goal', value: 'Stop Pre-Encryption' }], explain: 'Cuts lateral SMB/RDP paths the instant an EDR killer silences a server.' } },
    stickyBox: { id: 'ak3-note', label: 'BLINDNESS IS A SIGNAL:\nA healthy server never drops\n4 security service crashes\n(EID 7031) and goes silent\nby coincidence!', tip: { kind: 'note', title: 'SOC Heuristic', module: 'Tamper Triage', fields: [{ key: 'Priority', value: 'P1 Pre-Ransomware' }], explain: 'Treat abrupt EDR silence as imminent ransomware encryption.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · HVCI & VULNERABLE DRIVER BLOCKLIST CONTAINMENT',
    title: 'T1486: CI.dll Blocks PROCEXP152.SYS (0xC0000428) & Preserves EDR Online',
    subtitle: 'Preventing pre-ransomware defense impairment with CodeIntegrity Event ID 3077',
    chalkHint: 'Hover boxes for HVCI policy check, Event ID 3077 alerting, and GPO deployment.',
    header: 'STEP 4 · HVCI BLOCKLIST PRE-LOAD DENIAL (CODEINTEGRITY EID 3077)',
    footer: 'Reference: Microsoft Recommended Driver Block Rules & CodeIntegrity/Operational EID 3077',
    p: 'ak4',
    r1: [
      { id: 'ak4-try', label: 'Load Attempt\nPROCEXP152.sys\nOn Hardened Host', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Driver Load Hook', module: 'SRV-APP-10', fields: [{ key: 'Caller', value: 'aukill.exe PID 5104' }], explain: 'Identical BYOVD utility attempts to register vulnerable signed driver.' } },
      { id: 'ak4-ci', label: 'HVCI CI.dll Check\nMatches Revoked Hash\n0xC0000428 Denied', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Hypervisor Enforcement', module: 'CI.dll + Block Rules', fields: [{ key: 'Status', value: 'STATUS_INVALID_IMAGE_HASH' }], explain: 'Hardware-isolated policy rejects the driver before Ring 0 entry.' } },
      { id: 'ak4-on', label: 'PPL EDR Stays Online\nBlocks Ransomware\nZero Encryption', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Defense Preserved', module: 'MsMpEng.exe Online', fields: [{ key: 'Impact', value: 'Ransomware Quarantined' }], explain: 'Armored security watchtowers stay active and stop follow-on payloads.' } },
    ],
    a12: { cap: 'Hash Lookup', stroke: PAL.amber },
    a23: { cap: 'Pre-Load Deny', stroke: PAL.emerald },
    a34: { cap: 'Log EID 3077', stroke: PAL.sky },
    a45: { cap: 'Trigger IR', stroke: PAL.sky },
    r2Right: { id: 'ak4-30', label: 'CodeIntegrity EID 3077\nNames PROCEXP152.sys\nZero False Positives', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'High-Fidelity Alert', module: 'SIEM KQL', fields: [{ key: 'EventID', value: '3076 / 3077' }], explain: 'Proves an attacker with admin rights tried to load an EDR killer.' } },
    r2Mid: { id: 'ak4-gp', label: 'Fleet Enforcement\nGPO / Intune HVCI +\nWDAC Driver Rules', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Enterprise Baseline', module: 'Hardening Policy', fields: [{ key: 'Scope', value: 'All Servers & Endpoints' }], explain: 'Eliminates the entire family of known BYOVD EDR-killer drivers.' } },
    stickyBox: { id: 'ak4-note', label: 'NEVER IGNORE EID 3077:\nEven when HVCI blocks the\ndriver, the attacker STILL has\nlocal admin on that host!\nLaunch P1 IR immediately.', tip: { kind: 'note', title: 'Post-Block Response', module: 'SOC Playbook', fields: [{ key: 'Action', value: 'Isolate & Evict Admin' }], explain: 'A blocked BYOVD attempt is a late-stage pre-ransomware indicator.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #M · KERNEL MEMORY DIFF (RING 0 BYPASS VS HVCI)',
    title: 'Forensic Comparison: Unchecked PROCEXP152 Dispatch vs HVCI Pre-Load Block',
    subtitle: 'Comparing Ring 0 EPROCESS.Protection bypass against hardware-isolated CI.dll enforcement',
    chalkHint: 'Hover boxes for kernel dispatch base, EPROCESS.Protection, and CI.dll block state.',
    header: 'KERNEL MEMORY FORENSICS · PROCEXP152 RING 0 BYPASS VS HVCI BLOCK',
    footer: 'Forensic Artifact Reference: SRV-APP-09 Kernel Pool & CodeIntegrity Policy Table',
    p: 'akm',
    r1: [
      { id: 'akm-drv', label: 'PROCEXP152.SYS\n0xFFFFF80541200000\nOpen IOCTL Dispatch', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Vulnerable Kernel Code', module: 'IRP_MJ_DEVICE_CONTROL', fields: [{ key: 'IOCTLs', value: '0x8335003C / 0004' }], explain: 'Unchecked Ring 0 dispatch handler serving arbitrary process termination.' } },
      { id: 'akm-ep', label: 'EPROCESS.Protection\n0xFFFFC28910440000\nPPL Bypassed in R0', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Armored Process Struct', module: 'MsMpEng PID 2188', fields: [{ key: 'Level', value: 'Antimalware-Light' }], explain: 'Ring 0 ZwOpenProcess bypasses PPL flag protecting user-mode EDR.' } },
      { id: 'akm-hv', label: 'HVCI CI.dll Guard\n0xFFFFF80109A00000\nBlocked Pre-Load', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Hardened Kernel State', module: 'Hypervisor VTL 1', fields: [{ key: 'Result', value: '0xC0000428 Denied' }], explain: 'Prevents vulnerable driver pages from ever mapping into kernel memory.' } },
    ],
    a12: { cap: 'Bypass PPL', stroke: PAL.crimson },
    a23: { cap: 'Enforce HVCI', stroke: PAL.emerald },
    a34: { cap: 'Verify Zero Map', stroke: PAL.sky },
    a45: { cap: 'Audit Drivers', stroke: PAL.sky },
    r2Right: { id: 'akm-tri', label: 'Kernel Triage\nEnumerate Loaded\nDrivers vs LOLDrivers', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Live Forensics', module: 'Sysmon 6 / WinDbg', fields: [{ key: 'Check', value: 'SHA-256 + Signer Date' }], explain: 'Spots outdated vulnerable signed drivers resident in kernel space.' } },
    r2Mid: { id: 'akm-end', label: 'Zero-BYOVD Posture\nVTL 1 Memory Integrity\n+ WDAC Blocklist', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Resilient Kernel', module: 'Hardware Isolation', fields: [{ key: 'Guarantee', value: 'PPL Stays Intact' }], explain: 'Ensures ransomware affiliates cannot blind EDR via legacy signed drivers.' } },
    stickyBox: { id: 'akm-note', label: 'KERNEL FORENSIC FACT:\nOnce a vulnerable signed driver\nmaps into Ring 0, user-mode\nPPL armor cannot defend itself;\nstop it at load time with HVCI.', tip: { kind: 'note', title: 'VTL 1 Advantage', module: 'Hypervisor Security', fields: [{ key: 'Layer', value: 'Below Ring 0' }], explain: 'HVCI enforces code integrity from VTL 1 where even Ring 0 cannot tamper.' } },
  }),
};
