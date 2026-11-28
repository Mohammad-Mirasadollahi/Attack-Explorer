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
    scenarioId: 'solarwinds-sunburst-orion-supply-chain',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const SUNBURST_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END SUNSPOT -> SUNBURST -> GOLDEN SAML',
    title: 'T1195.002: Build Hijack -> Valid Code Signing -> DGA DNS -> AD FS Golden SAML',
    subtitle: 'Full APT29 supply-chain compromise from MsBuild tampering to cloud federation forgery',
    chalkHint: 'Hover any chalk box for SUNSPOT timing, Authenticode trust bypass, and AD FS EID 1200 correlation.',
    header: 'SOLARWINDS SUNSPOT & SUNBURST SUPPLY-CHAIN ARCHITECTURE (T1195.002)',
    footer: 'Primary Sources: CrowdStrike SUNSPOT, FireEye/Mandiant SUNBURST, CISA ED 21-01 & MSTIC',
    p: 'sbb',
    r1: [
      { id: 'sbb-bld', label: 'BLD-ORION-02\nSUNSPOT PID 3912\n4.2s Source Swap', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Build-Server Hook', module: 'taskhostsvc.exe', fields: [{ key: 'Target', value: 'InventoryManager.cs' }], explain: 'Swaps C# source mid-MsBuild and restores clean copy leaving zero Git diffs.' } },
      { id: 'sbb-sig', label: 'Valid Authenticode\nBusinessLayer.dll\n~18,000 Networks', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'memory', title: 'Trusted Vendor Binary', module: 'Sysmon EID 7', fields: [{ key: 'Status', value: 'SignatureStatus=Valid' }], explain: 'Official vendor signature carries backdoored MSIL past AV/EDR allowlists.' } },
      { id: 'sbb-dga', label: '14-Day Sleep + DGA\n*.avsvmcloud.com\nSelective CNAME', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Selective Triage C2', module: 'Sysmon EID 22', fields: [{ key: 'Encoding', value: 'Custom Base32 AD Domain' }], explain: 'Triages victims passively and activates C2 only on high-value targets.' } },
    ],
    a12: { cap: 'Genuine Cert', stroke: PAL.amber },
    a23: { cap: '14d Dormancy', stroke: PAL.crimson },
    a34: { cap: 'TEARDROP Pivot', stroke: PAL.crimson },
    a45: { cap: 'Audit EID 1200', stroke: PAL.emerald },
    r2Right: { id: 'sbb-saml', label: 'AD FS Token Key\nOffline Golden SAML\nBypasses Cloud MFA', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Golden SAML Forgery', module: 'ADFS-01 Private Key', fields: [{ key: 'Impact', value: 'Cloud Tenant Takeover' }], explain: 'Forges valid SAML 2.0 assertions offline with zero on-prem issuance logs.' } },
    r2Mid: { id: 'sbb-soc', label: 'DFIR & SLSA-3\nYARA + RPZ Sinkhole\nKQL Anti-Join', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Multi-Plane Defense', module: 'CISA ED 21-01', fields: [{ key: 'Checks', value: 'SLSA-3 + HSM + EID 1200' }], explain: 'Pairs reproducible builds with DNS containment and SAML log reconciliation.' } },
    stickyBox: { id: 'sbb-note', label: 'SUPPLY-CHAIN LESSON:\nCode signing proves WHO\npackaged a DLL, not that\nthe build runner was clean!', tip: { kind: 'note', title: 'Build Integrity', module: 'SLSA Level 3', fields: [{ key: 'Control', value: 'Hermetic Reproducible Builds' }], explain: 'Verify artifact hashes against independent clean builds before signing.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · SUNSPOT MID-COMPILE SOURCE SWAP',
    title: 'T1195.002: Hooking MsBuild.exe to Inject SUNBURST With Zero Git Trace',
    subtitle: 'How taskhostsvc.exe swaps InventoryManager.cs for 4.2 seconds during build execution',
    chalkHint: 'Hover boxes for SUNSPOT polling loop, MD5 check, and Sysmon EID 11 detection.',
    header: 'STEP 1 · SUNSPOT BUILD-SERVER HIJACK & IN-FLIGHT SOURCE SWAP',
    footer: 'Reference: CrowdStrike SUNSPOT Technical Analysis & SLSA Level 3 Provenance',
    p: 'sb1',
    r1: [
      { id: 'sb1-sun', label: 'SUNSPOT Implant\ntaskhostsvc.exe\n1s Process Poll', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Build Watcher', module: 'PID 3912 SYSTEM', fields: [{ key: 'Trigger', value: 'MsBuild.exe Orion.sln' }], explain: 'Monitors active processes every second for Orion Core compilation.' } },
      { id: 'sb1-swp', label: '4.2s File Swap\nInventoryManager.cs\nMD5 Safety Check', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Atomic Injection', module: 'NTFS Swap', fields: [{ key: 'Added', value: 'OrionImprovementBusinessLayer' }], explain: 'Swaps source file briefly and restores clean original so builds never fail.' } },
      { id: 'sb1-dll', label: 'Compiled Output\nBusinessLayer.dll\nZero Git Commits', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Trojanized Artifact', module: 'MsBuild.exe', fields: [{ key: 'Git Diff', value: 'Clean Repository' }], explain: 'Produces a poisoned .NET DLL while Git source history stays untouched.' } },
    ],
    a12: { cap: 'Hook MsBuild', stroke: PAL.crimson },
    a23: { cap: 'Compile MSIL', stroke: PAL.amber },
    a34: { cap: 'Sysmon EID 11', stroke: PAL.sky },
    a45: { cap: 'SLSA-3 Check', stroke: PAL.emerald },
    r2Right: { id: 'sb1-e11', label: 'Sysmon Event ID 11\nNon-VCS Write to\n*.cs During Build', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Build Runner Alert', module: 'Sigma FileCreate', fields: [{ key: 'Signal', value: 'taskhostsvc.exe -> .cs' }], explain: 'Catches unauthorized source tampering on build runners in real time.' } },
    r2Mid: { id: 'sb1-slsa', label: 'Hermetic CI/CD\nEphemeral Runners +\nReproducible Hash', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Build Hardening', module: 'SLSA Level 3', fields: [{ key: 'Verify', value: 'Independent rebuild diff' }], explain: 'Detects injected bytecode immediately when clean rebuild hash mismatches.' } },
    stickyBox: { id: 'sb1-note', label: 'WHY GIT STAYED CLEAN:\nSUNSPOT mutated local disk\nfiles strictly inside MsBuild\nwithout touching version control.', tip: { kind: 'note', title: 'Pre-Sign Injection', module: 'CI/CD Threat Model', fields: [{ key: 'Window', value: '4.2 seconds' }], explain: 'Repository code review alone cannot catch compromised build hosts.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · GENUINE AUTHENTICODE SIGNING & DISTRIBUTION',
    title: 'T1553.002: Valid SolarWinds Signature Carries SUNBURST Into SYSTEM Hosts',
    subtitle: 'Why certificate-based AV exclusions miss trojanized vendor DLLs',
    chalkHint: 'Hover boxes for Authenticode signing, Sysmon EID 7, and YARA MSIL hunting.',
    header: 'STEP 2 · AUTHENTICODE SIGNING & TRUSTED UPDATE DISTRIBUTION',
    footer: 'Reference: FireEye/Mandiant SUNBURST Analysis & CISA Emergency Directive 21-01',
    p: 'sb2',
    r1: [
      { id: 'sb2-crt', label: 'Vendor Signing Rig\nSolarWinds Worldwide\nValid Authenticode', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Genuine Certificate', module: 'Release Signing', fields: [{ key: 'Status', value: 'Cryptographically Valid' }], explain: 'Automated release process stamps the poisoned DLL with an official cert.' } },
      { id: 'sb2-cdn', label: 'Official Update CDN\nOrion 2019.4-2020.2\n~18,000 Victims', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'network', title: 'Trusted Channel', module: 'HTTPS Hotfix', fields: [{ key: 'Reach', value: 'Enterprise & Gov' }], explain: 'Customers download and install the backdoored update as routine maintenance.' } },
      { id: 'sb2-clr', label: 'BusinessLayerHost\nPID 4120 SYSTEM\nLoads MSIL Class', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'SYSTEM Execution', module: '.NET CLR', fields: [{ key: 'Process', value: 'BusinessLayerHost.exe' }], explain: 'Runs SUNBURST inside a trusted signed monitoring daemon with full rights.' } },
    ],
    a12: { cap: 'Publish Hotfix', stroke: PAL.amber },
    a23: { cap: 'Install & Load', stroke: PAL.crimson },
    a34: { cap: 'Sysmon EID 7', stroke: PAL.sky },
    a45: { cap: 'YARA MSIL Scan', stroke: PAL.emerald },
    r2Right: { id: 'sb2-e7', label: 'Sysmon Event ID 7\nImageLoaded SHA256\nSignature=Valid', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Hash Telemetry', module: 'ImageLoaded', fields: [{ key: 'SHA256', value: '32519b85c0b422e4...' }], explain: 'Identifies exact compromised build hashes across enterprise fleets.' } },
    r2Mid: { id: 'sb2-yar', label: 'YARA + VLAN Isolation\nScan Signed DLLs &\nBlock Orion Egress', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Zero-Trust Monitoring', module: 'CISA ED 21-01', fields: [{ key: 'Rule', value: 'OrionImprovementBusinessLayer' }], explain: 'Hunts malicious namespaces inside signed binaries and blocks management egress.' } },
    stickyBox: { id: 'sb2-note', label: 'ALLOWLIST BLIND SPOT:\nNever grant blanket EDR\nexclusions to privileged IT\nmanagement servers by signer.', tip: { kind: 'note', title: 'Defense in Depth', module: 'EDR Governance', fields: [{ key: 'Risk', value: 'Signed supply-chain implant' }], explain: 'Behavioral monitoring must remain active even on trusted vendor daemons.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · 14-DAY DORMANCY & DGA DNS TRIAGE',
    title: 'T1568.002: Base32 Victim Encoding Over avsvmcloud.com & Selective CNAME',
    subtitle: 'How SUNBURST evades sandboxes, avoids EDR, and triages targets via DNS',
    chalkHint: 'Hover boxes for dormancy timer, FNV-1a blocklist, and Suricata DGA detection.',
    header: 'STEP 3 · DORMANCY, FNV-1A BLOCKLIST & AVSVMCLOUD.COM DGA BEACON',
    footer: 'Reference: Microsoft MSTIC Solorigate & FireEye SUNBURST DGA Reverse Engineering',
    p: 'sb3',
    r1: [
      { id: 'sb3-slp', label: '12-14 Day Sleep +\nAD Domain Check +\nFNV-1a EDR List', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Stealth Pre-Checks', module: 'SUNBURST Init', fields: [{ key: 'Guard', value: 'Hashed security tools' }], explain: 'Aborts in sandboxes or hosts running targeted analyst/EDR drivers.' } },
      { id: 'sb3-dns', label: 'Base32 DGA Query\n*.appsync-api.*\n.avsvmcloud.com', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Encoded Victim Beacon', module: 'Sysmon EID 22', fields: [{ key: 'Payload', value: 'Encoded AD Domain' }], explain: 'Leaks victim company identity passively through routine-looking DNS queries.' } },
      { id: 'sb3-cn', label: 'Selective CNAME\nfreescanonline.com\nStage-2 HTTPS C2', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Target Activation', module: 'DNS Type 5 CNAME', fields: [{ key: 'Filter', value: 'High-value targets only' }], explain: 'Only selected espionage victims receive an active stage-2 C2 domain.' } },
    ],
    a12: { cap: 'Wake & Encode', stroke: PAL.amber },
    a23: { cap: 'CNAME Reply', stroke: PAL.crimson },
    a34: { cap: 'Sysmon 22 + Zeek', stroke: PAL.sky },
    a45: { cap: 'RPZ Sinkhole', stroke: PAL.emerald },
    r2Right: { id: 'sb3-sur', label: 'Suricata & Sysmon 22\nAlert *.avsvmcloud.com\nFrom Orion Server', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'DNS Hunt Rule', module: 'SID 2031401', fields: [{ key: 'Host', value: 'ORION-MON-01 PID 4120' }], explain: 'Pairs process-level DNS query logs with network passive DNS alerts.' } },
    r2Mid: { id: 'sb3-rpz', label: 'DNS RPZ Sinkhole +\nDeny Management\nInternet Egress', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Network Containment', module: 'Zero-Egress VLAN', fields: [{ key: 'Policy', value: 'Block Orion UDP/53 & 443' }], explain: 'Prevents compromised monitoring appliances from reaching external C2.' } },
    stickyBox: { id: 'sb3-note', label: 'PASSIVE TRIAGE:\nBecause the victim domain is\nencoded in the QNAME, APT29\npicked targets without dropping\na single stage-2 file first!', tip: { kind: 'note', title: 'OPSEC Design', module: 'APT29 Tradecraft', fields: [{ key: 'Stealth', value: 'DNS-only reconnaissance' }], explain: 'Drastically reduced exposure of stage-2 payloads like TEARDROP.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · TEARDROP & AD FS GOLDEN SAML FORGERY',
    title: 'T1552.004: Memory-Only TEARDROP Pivot & Offline Cloud SAML Forgery',
    subtitle: 'How stolen AD FS token-signing keys bypass MFA and how EID 1200 exposes orphan logins',
    chalkHint: 'Hover boxes for TEARDROP memory staging, Golden SAML mechanics, and KQL anti-join.',
    header: 'STEP 4 · TEARDROP LOADER, AD FS PRIVATE KEY THEFT & GOLDEN SAML',
    footer: 'Reference: Microsoft MSTIC Solorigate Identity Forensics & CISA AA20-352A',
    p: 'sb4',
    r1: [
      { id: 'sb4-td', label: 'TEARDROP Loader\nFake JPG -> RAM\nCobalt Strike Beacon', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Memory-Only Dropper', module: 'TEARDROP C++', fields: [{ key: 'Evasion', value: 'Zero stage-2 disk payload' }], explain: 'Decodes custom Beacon straight into memory on selected high-value networks.' } },
      { id: 'sb4-key', label: 'ADFS-01 Pivot\nExport Token-Signing\nPrivate Key (PFX)', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Federation Key Theft', module: 'AD FS DKM / Cert', fields: [{ key: 'Target', value: 'Token-Signing Cert' }], explain: 'Extracts the private key that vouches for every federated user in the cloud.' } },
      { id: 'sb4-gs', label: 'Offline Golden SAML\nValid XML Assertion\nBypasses Cloud MFA', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Forged Federation Login', module: 'SAML 2.0 -> Entra ID', fields: [{ key: 'MFA', value: 'Bypassed Completely' }], explain: 'Cloud tenant trusts the valid signature without contacting on-prem AD FS.' } },
    ],
    a12: { cap: 'Domain Admin', stroke: PAL.crimson },
    a23: { cap: 'Sign Offline', stroke: PAL.amber },
    a34: { cap: 'Reconcile Logs', stroke: PAL.sky },
    a45: { cap: 'HSM + Rotate', stroke: PAL.emerald },
    r2Right: { id: 'sb4-kql', label: 'SIEM KQL Anti-Join\nCloud SAML Sign-In\n0 AD FS EID 1200', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Orphan SAML Detection', module: 'SigninLogs vs EID 1200', fields: [{ key: 'Proof', value: 'Zero on-prem issuance' }], explain: 'Unmasks offline-forged tokens that never passed through real ADFS-01.' } },
    r2Mid: { id: 'sb4-hsm', label: 'HSM Key Protection +\nDouble-Rotate Certs +\nCloud-Native Auth', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Identity Eradication', module: 'AD FS Recovery', fields: [{ key: 'Action', value: 'Double-rotate signing cert' }], explain: 'Invalidates stolen private keys and removes on-prem SAML trust exposure.' } },
    stickyBox: { id: 'sb4-note', label: 'WHY DOUBLE-ROTATE?\nAD FS keeps the previous cert\nvalid during single rotation;\nyou MUST rotate twice to\nevict a stolen signing key!', tip: { kind: 'note', title: 'IR Playbook Critical', module: 'AD FS Recovery', fields: [{ key: 'Step', value: 'Rotate 2x + Revoke Tokens' }], explain: 'Single rotation still allows attacker-forged Golden SAML tokens to work.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #M · MEMORY & MSIL DIFF (CLEAN ORION VS SUNBURST)',
    title: 'Forensic Comparison: Clean Orion MSIL vs Trojanized SUNBURST & TEARDROP',
    subtitle: 'Comparing clean compiled BusinessLayer.dll against SUNSPOT-injected bytecode and RWX Beacon',
    chalkHint: 'Hover boxes for MSIL namespace diff, TEARDROP RWX memory, and SLSA-3 clean verification.',
    header: 'MEMORY & MSIL FORENSICS · SUNBURST INJECTED CLASS VS CLEAN BUILD',
    footer: 'Forensic Artifact Reference: BusinessLayerHost.exe PID 4120 & YARA MSIL Diff',
    p: 'sbm',
    r1: [
      { id: 'sbm-msil', label: 'Trojanized MSIL\n0x01A420100000\nOrionImprovement...', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Injected .NET Class', module: 'BusinessLayer.dll', fields: [{ key: 'Entry', value: 'Initialize() Hook' }], explain: 'Hidden inside legitimately signed DLL; triggers dormancy and DGA DNS.' } },
      { id: 'sbm-td', label: 'TEARDROP RWX Heap\n0x01A420140000\nUnbacked Beacon', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Memory-Only Stage 2', module: 'Private RWX Region', fields: [{ key: 'Size', value: '256 KB Shellcode' }], explain: 'Decoded from fake JPG straight into RAM with no file backing on disk.' } },
      { id: 'sbm-cln', label: 'SLSA-3 Clean Build\n0x01A420190000\nZero Extra Classes', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Verified Build Hash', module: 'Reproducible Build', fields: [{ key: 'Diff', value: 'Matches Clean Git' }], explain: 'Independent hermetic build exposes any mid-compile source tampering.' } },
    ],
    a12: { cap: 'Stage-2 Drop', stroke: PAL.crimson },
    a23: { cap: 'Diff Against Clean', stroke: PAL.emerald },
    a34: { cap: 'YARA & Hash', stroke: PAL.sky },
    a45: { cap: 'Isolate & Rotate', stroke: PAL.emerald },
    r2Right: { id: 'sbm-yar', label: 'MSIL & RAM Triage\nYARA Signature +\nPE/CLR Diff Scan', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Forensic Detection', module: 'YARA + Volatility', fields: [{ key: 'Artifacts', value: 'FNV-1a hashes + RWX' }], explain: 'Detects both signed-DLL tampering and unbacked TEARDROP memory regions.' } },
    r2Mid: { id: 'sbm-gov', label: 'Hardened Pipeline\nSLSA-3 Provenance +\nHSM AD FS Keys', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Long-Term Defense', module: 'Supply-Chain Sec', fields: [{ key: 'Controls', value: 'Hermetic CI + HSM' }], explain: 'Closes both the build-server injection path and federation key theft.' } },
    stickyBox: { id: 'sbm-note', label: 'CLR MEMORY CLUE:\nCompare loaded MSIL types in\nBusinessLayerHost.exe against\nclean vendor builds to spot\nhidden injected classes fast.', tip: { kind: 'note', title: '.NET Forensics', module: 'dnSpy / YARA', fields: [{ key: 'Target', value: 'OrionImprovementBusinessLayer' }], explain: 'Valid Authenticode never hides extra IL methods from binary diffing.' } },
  }),
};
