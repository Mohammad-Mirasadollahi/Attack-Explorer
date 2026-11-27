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
  gold: '#d97706',
  goldFill: '#fef3c7',
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
    scenarioId: 'dfir-dcsync-drsuapi-replication-eid4662',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const DCSYNC_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END DCSYNC FORENSICS',
    title: 'Active Directory DCSync: Rogue MS-DRSR Replication & Security EID 4662 Correlation',
    subtitle: 'Complete Tier-0 visibility from exposed domain root DACL to double krbtgt rotation',
    chalkHint: 'Hover any chalk box for GUIDs, RPC opnums, Event IDs, and plain explanations.',
    header: 'DCSYNC (T1003.006) · MS-DRSR REPLICATION & SECURITY EID 4662 PIPELINE',
    footer: 'Primary Sources: Microsoft Learn [MS-DRSR] & EID 4662, CISA/NSA AD Guidance, MITRE ATT&CK T1003.006',
    p: 'dcb',
    r1: [
      { id: 'dcb-acl', label: 'Domain Root ACL\n1131f6aa + 1131f6ad\nsvc_dir_sync Exposed', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'memory', title: 'Over-Privileged Replication ACL', module: 'DC=corp,DC=local', fields: [{ key: 'GUID', value: '1131f6ad-9c07-11d1-...' }], explain: 'Non-DC service account holds DS-Replication-Get-Changes-All.' } },
      { id: 'dcb-rpc', label: 'MS-DRSR Opnum 3\nIDL_DRSGetNCChanges\n10.20.14.88 -> DC01', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'api', title: 'Rogue Replication RPC', module: 'DRSUAPI (ntdsai.dll)', fields: [{ key: 'UUID', value: 'e3514235-4b06-11d1-...' }, { key: 'Target', value: 'CN=krbtgt' }], explain: 'Pulls password hashes from DC RAM without touching NTDS.dit on disk.' } },
      { id: 'dcb-4662', label: 'Security EID 4662\nAccessMask 0x100\nNon-$ SubjectUser', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'memory', title: 'Directory Service Access Log', module: 'Security Log', fields: [{ key: 'Subject', value: 'svc_dir_sync' }, { key: 'LogonId', value: '0x39e4c2a' }], explain: 'Primary host log exposing non-machine accounts performing AD replication.' } },
    ],
    a12: { cap: 'Binds DRSUAPI', stroke: PAL.crimson },
    a23: { cap: 'Writes EID 4662', stroke: PAL.sky },
    a34: { cap: 'Join LogonId', stroke: PAL.sky },
    a45: { cap: 'Tier-0 Recovery', stroke: PAL.emerald },
    r2Right: { id: 'dcb-4624', label: 'Join EID 4624 + Zeek\nSource 10.20.14.88\nSuricata SID 2043901', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Host + Network Attribution', module: 'SIEM / NSM', fields: [{ key: 'Origin', value: '10.20.14.88 (WKS-ADMIN-07)' }], explain: 'Pinpoints exact non-DC workstation invoking AD replication.' } },
    r2Mid: { id: 'dcb-fix', label: 'Strip Rogue ACL +\nDouble krbtgt Reset\n+ Protected Users', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Tier-0 Containment', module: 'CISA Playbook', fields: [{ key: 'Reset', value: '2x krbtgt (>= 10h gap)' }], explain: 'Removes replication backdoor and invalidates Golden Ticket exposure.' } },
    stickyBox: { id: 'dcb-note', label: 'ZERO DC DISK IOCs:\nDCSync never drops a\nfile on DC01 — catch it\nvia EID 4662 + Zeek!', tip: { kind: 'note', title: 'Why EDR Alone Misses DCSync', module: 'DFIR Lesson', fields: [{ key: 'Signals', value: 'EID 4662 + 4624 + DRSUAPI' }], explain: 'Correlating Directory Service Access logs with network RPC catches every non-DC sync.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · DOMAIN ROOT REPLICATION ACLS',
    title: 'Auditing Extended Rights GUIDs 1131f6aa & 1131f6ad on DC=corp,DC=local',
    subtitle: 'Preventing non-Domain Controller accounts from holding secret replication privileges',
    chalkHint: 'Hover boxes to inspect exact GUIDs and Security Event ID 5136 monitoring.',
    header: 'STEP 1 · OVER-PRIVILEGED DOMAIN ROOT ACL (DS-REPLICATION-GET-CHANGES-ALL)',
    footer: 'Reference: CISA/NSA Active Directory Compromises & Security Event ID 5136',
    p: 'dc1',
    r1: [
      { id: 'dc1-obj', label: 'DC=corp,DC=local\nnTSecurityDescriptor\nTier-0 Boundary', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'memory', title: 'Domain Root Object', module: 'Active Directory', fields: [{ key: 'Attribute', value: 'nTSecurityDescriptor' }], explain: 'Controls who can invoke MS-DRSR secret replication.' } },
      { id: 'dc1-guid', label: 'Extended Rights\n1131f6aa (Changes)\n1131f6ad (All)', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'DCSync GUID Pair', module: 'AD Schema', fields: [{ key: 'Secrets GUID', value: '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2' }], explain: 'Together these two rights permit pulling every domain password hash.' } },
      { id: 'dc1-acct', label: 'CORP\\svc_dir_sync\nNon-DC Service Acct\nLegacy Migration ACE', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Exposed Non-DC Principal', module: 'IAM Drift', fields: [{ key: 'Account', value: 'svc_dir_sync' }], explain: 'Over-privileged leftover account becomes a silent DCSync vector.' } },
    ],
    a12: { cap: 'Defines Rights', stroke: PAL.gold },
    a23: { cap: 'Granted To', stroke: PAL.crimson },
    a34: { cap: 'Audit Drift', stroke: PAL.sky },
    a45: { cap: 'Remediate', stroke: PAL.emerald },
    r2Right: { id: 'dc1-5136', label: 'Security EID 5136\nAlert on DACL Write\nFor 1131f6ad-...', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Real-Time ACL Alerting', module: 'SIEM', fields: [{ key: 'EventID', value: '5136' }], explain: 'Catches attackers or admins adding replication rights immediately.' } },
    r2Mid: { id: 'dc1-clean', label: 'Least Privilege\nEnterprise DCs Only\nWeekly ACL Scan', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Tier-0 Hygiene', module: 'AD Security', fields: [{ key: 'Allowed', value: 'Enterprise Domain Controllers' }], explain: 'Ensures only authentic DCs can replicate credentials.' } },
    stickyBox: { id: 'dc1-note', label: 'ACL CHECKLIST:\nNever leave 1131f6ad\non non-DC service or\nadmin test accounts!', tip: { kind: 'note', title: 'Preventive Rule', module: 'Tier-0 Governance', fields: [{ key: 'Scope', value: 'DC=corp,DC=local' }], explain: 'Removing unnecessary replication ACEs prevents DCSync before it starts.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · MS-DRSR IDL_DRSGETNCCHANGES WIRE TRACE',
    title: 'Catching Rogue DRSUAPI Opnum 3 Replication Outside Domain Controller Subnets',
    subtitle: 'Network sensor visibility into memory-only credential replication',
    chalkHint: 'Hover boxes to inspect DCE-RPC interface UUIDs and Suricata rules.',
    header: 'STEP 2 · ROGUE MS-DRSR IDL_DRSGETNCCHANGES FROM NON-DC HOST',
    footer: 'Reference: Microsoft [MS-DRSR] Specification & Zeek/Suricata DCE-RPC Analysis',
    p: 'dc2',
    r1: [
      { id: 'dc2-wks', label: 'WKS-ADMIN-07\n10.20.14.88\nWorkstation VLAN', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Rogue Non-DC Origin', module: '10.20.14.88', fields: [{ key: 'VLAN', value: 'Admin Workstation (Non-DC)' }], explain: 'Workstations have zero legitimate reason to invoke AD replication.' } },
      { id: 'dc2-rpc', label: 'DRSUAPI RPC Call\nUUID e3514235-...\nOpnum 3 GetNCChanges', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'api', title: 'IDL_DRSGetNCChanges', module: 'MS-DRSR', fields: [{ key: 'Opnum', value: '3' }, { key: 'Port', value: 'TCP/49668' }], explain: 'Standard AD peer replication procedure abused remotely.' } },
      { id: 'dc2-ram', label: 'CORP-DC01 lsass.exe\nntdsai.dll In-Memory\nCN=krbtgt Hashes', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'In-Memory Secret Read', module: 'ntdsai.dll', fields: [{ key: 'Disk I/O', value: 'Zero NTDS.dit reads' }], explain: 'Domain Controller serves hashes from RAM without touching disk files.' } },
    ],
    a12: { cap: 'Binds MS-DRSR', stroke: PAL.crimson },
    a23: { cap: 'Requests krbtgt', stroke: PAL.gold },
    a34: { cap: 'Wire Sensor', stroke: PAL.sky },
    a45: { cap: 'Block Non-DC', stroke: PAL.emerald },
    r2Right: { id: 'dc2-sur', label: 'Suricata SID 2043901\n!$DOMAIN_CONTROLLERS\ndce_opnum:3', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'NSM Detection', module: 'Suricata / Zeek', fields: [{ key: 'SID', value: '2043901' }], explain: 'Fires instantaneously when any non-DC IP calls DRSGetNCChanges.' } },
    r2Mid: { id: 'dc2-fw', label: 'DC Host Firewall\nAllow DRSUAPI Only\nFrom Peer DC IPs', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Network Segmentation', module: 'IPSec / Firewall', fields: [{ key: 'Policy', value: 'Peer DC allowlist' }], explain: 'Stops workstation-originated replication at the network layer.' } },
    stickyBox: { id: 'dc2-note', label: 'WIRE INVARIANT:\nPeer AD replication\nMUST ONLY originate\nfrom known DC IPs!', tip: { kind: 'note', title: 'High-Signal Network Rule', module: 'NSM', fields: [{ key: 'Exception', value: 'Approved Entra Connect server' }], explain: 'Allowlist only peer DCs and any explicitly documented sync host.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · SECURITY EID 4662 + EID 4624 CORRELATION',
    title: 'Joining Security Event ID 4662 With Event ID 4624 via SubjectLogonId',
    subtitle: 'Achieving 100% host and account attribution on Domain Controller Security logs',
    chalkHint: 'Hover boxes to inspect exact Windows Security log correlation fields.',
    header: 'STEP 3 · SECURITY EID 4662 + EID 4624 SUBJECTLOGONID CORRELATION',
    footer: 'Reference: Microsoft Learn Security Event ID 4662 & 4624 Correlation Playbook',
    p: 'dc3',
    r1: [
      { id: 'dc3-4662', label: 'Security EID 4662\nAccessMask 0x100\nGUID 1131f6ad-...', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'memory', title: 'Replication Audit Event', module: 'Security Log', fields: [{ key: 'User', value: 'svc_dir_sync' }, { key: 'LogonId', value: '0x39e4c2a' }], explain: 'Recorded on CORP-DC01 whenever replication rights are exercised.' } },
      { id: 'dc3-flt', label: 'Filter Machine Accts\nSubjectUserName\n!endswith "$"', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'detect', title: 'Noise Reduction Filter', module: 'Sigma / KQL', fields: [{ key: 'Keep', value: 'Non-$ user accounts' }], explain: 'Separates routine peer DC replication from anomalous user sync.' } },
      { id: 'dc3-4624', label: 'Join Security EID 4624\nTargetLogonId 0x39e4c2a\nIpAddress 10.20.14.88', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Source Host Resolution', module: 'Security Log', fields: [{ key: 'IP', value: '10.20.14.88' }, { key: 'Host', value: 'WKS-ADMIN-07' }], explain: 'EID 4662 lacks source IP; joining EID 4624 supplies it cleanly.' } },
    ],
    a12: { cap: 'Drop Peer DCs', stroke: PAL.gold },
    a23: { cap: 'Join LogonId', stroke: PAL.sky },
    a34: { cap: 'Trigger P1', stroke: PAL.crimson },
    a45: { cap: 'Contain Host', stroke: PAL.emerald },
    r2Right: { id: 'dc3-p1', label: 'SIEM P1 Incident\nConfirmed DCSync\nAssume krbtgt Leak', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'Escalation Trigger', module: 'SOC Playbook', fields: [{ key: 'Severity', value: 'P1 Critical' }], explain: 'Initiates immediate Tier-0 containment and credential rotation.' } },
    r2Mid: { id: 'dc3-edr', label: 'EDR Quarantine\nIsolate 10.20.14.88\nCapture RAM/Triage', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Host Containment', module: 'IR Team', fields: [{ key: 'Target', value: 'WKS-ADMIN-07' }], explain: 'Halts further credential extraction and preserves forensic evidence.' } },
    stickyBox: { id: 'dc3-note', label: 'AUDIT PREREQUISITE:\nEnable "Audit Directory\nService Access" on DCs\nso EID 4662 is logged!', tip: { kind: 'note', title: 'Logging Requirement', module: 'GPO Audit Policy', fields: [{ key: 'Subcategory', value: 'Directory Service Access (Success)' }], explain: 'Without this audit subcategory enabled, Event ID 4662 will not fire.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · TIER-0 RECOVERY & DOUBLE KRBTGT RESET',
    title: 'Post-DCSync Recovery: ACL Revocation, Double krbtgt Reset & Protected Users',
    subtitle: 'Evicting Golden Ticket persistence cleanly without breaking domain authentication',
    chalkHint: 'Hover boxes to inspect the 10-hour krbtgt cadence and Tier-0 hardening controls.',
    header: 'STEP 4 · TIER-0 ACL CLEANUP, DOUBLE KRBTGT ROTATION & PROTECTED USERS',
    footer: 'Reference: Microsoft AD Forest Recovery & CISA Tier-0 Hardening Guide',
    p: 'dc4',
    r1: [
      { id: 'dc4-acl', label: 'Revoke Rogue ACE\nClean Domain Root\n& AdminSDHolder', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'DACL Remediation', module: 'ADUC / PowerShell', fields: [{ key: 'Action', value: 'Strip 1131f6aa & 1131f6ad' }], explain: 'Prevents immediate re-exploitation after password reset.' } },
      { id: 'dc4-k1', label: 'krbtgt Reset #1\nWait >= 10 Hours\n(1 TGT Lifetime)', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'detect', title: 'First Kerberos Key Roll', module: 'Active Directory', fields: [{ key: 'Wait', value: '>= 10 hours' }], explain: 'Allows legitimate active TGTs to renew without outage.' } },
      { id: 'dc4-k2', label: 'krbtgt Reset #2\nFlushes N-1 Key\nVoids Golden Tix', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Second Kerberos Key Roll', module: 'Active Directory', fields: [{ key: 'Result', value: 'Old hash fully evicted' }], explain: 'Removes compromised krbtgt key from previous-password history.' } },
    ],
    a12: { cap: 'Reset #1 (EID 4738)', stroke: PAL.gold },
    a23: { cap: '+10h -> Reset #2', stroke: PAL.emerald },
    a34: { cap: 'Harden Tier-0', stroke: PAL.emerald },
    a45: { cap: 'Verify Clean', stroke: PAL.emerald },
    r2Right: { id: 'dc4-pu', label: 'Protected Users\nBlocks NTLM/RC4 &\nLimits TGT to 4h', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Privileged Account Shield', module: 'AD Security Group', fields: [{ key: 'Group', value: 'Protected Users' }], explain: 'Hardens Tier-0 credentials against delegation and weak ciphers.' } },
    r2Mid: { id: 'dc4-mon', label: 'Permanent Guard\nEID 4662 + 5136 +\nZeek DRSUAPI Rule', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Continuous Assurance', module: 'SIEM + NSM', fields: [{ key: 'Status', value: 'Armed 24/7' }], explain: 'Guarantees immediate alerting if replication rights ever drift again.' } },
    stickyBox: { id: 'dc4-note', label: 'WHY TWICE?\nAD keeps current + 1\nprevious krbtgt hash;\n2 resets evict both!', tip: { kind: 'note', title: 'Kerberos Key History', module: 'AD Internals', fields: [{ key: 'Interval', value: '>= 10 hours between resets' }], explain: 'Resetting twice too rapidly causes mass TGT invalidation; spacing >= 10h keeps users running.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #5 · LSASS NTDSAI.DLL MEMORY COMPARISON',
    title: 'Memory & DACL Diff: Exposed Non-DC ACE vs. Peer-DC-Only Hardened Policy',
    subtitle: 'Contrasting lsass.exe in-memory replication cache before and after Tier-0 cleanup',
    chalkHint: 'Hover boxes to inspect exact ntdsai.dll memory offsets and ACL states.',
    header: 'MEMORY FORENSICS · EXPOSED DOMAIN ROOT ACE VS. ENTERPRISE-DC-ONLY DACL',
    footer: 'Reference: lsass.exe (PID 628) ntdsai.dll Domain Root Descriptor Audit on CORP-DC01',
    p: 'dcm',
    r1: [
      { id: 'dcm-ace', label: '0x7FF9D1100000\nsvc_dir_sync ACE\n1131f6ad Exposed', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Vulnerable DACL Cache', module: 'ntdsai.dll', fields: [{ key: 'GUID', value: '1131f6ad-9c07-11d1-...' }], explain: 'Permits remote non-DC workstation to request secret replication.' } },
      { id: 'dcm-buf', label: '0x7FF9D11C0000\nDRSUAPI Opnum 3\nIn-Memory krbtgt', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'memory', title: 'Active RPC Secret Buffer', module: 'lsass.exe', fields: [{ key: 'Disk Touch', value: 'None' }], explain: 'Serves password hashes from memory with zero file-system artifacts.' } },
      { id: 'dcm-aud', label: 'Tier-0 DFIR Audit\nEID 4662 + 4624 +\nDACL Enumeration', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Forensic Verification', module: 'DFIR', fields: [{ key: 'Tools', value: 'SIEM + AD ACL Audit' }], explain: 'Identifies rogue replication principals and validates cleanup.' } },
    ],
    a12: { cap: 'Enables Opnum 3', stroke: PAL.crimson },
    a23: { cap: 'Blue-Team Audit', stroke: PAL.sky },
    a34: { cap: 'Enforce Clean', stroke: PAL.emerald },
    a45: { cap: 'Verify Tier-0', stroke: PAL.emerald },
    r2Right: { id: 'dcm-ok', label: '0x7FF9D1280000\nEDC_ONLY_DACL_OK\nNon-DC Denied', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Hardened DACL Cache', module: 'ntdsai.dll', fields: [{ key: 'Policy', value: 'Enterprise DCs Only' }], explain: 'Rejects any workstation DRSUAPI call with ACCESS_DENIED.' } },
    r2Mid: { id: 'dcm-res', label: 'Resilient Forest\n2x krbtgt Rotated\nProtected Users ON', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Verified Clean State', module: 'AD Recovery', fields: [{ key: 'Status', value: 'Golden Ticket evicted' }], explain: 'Completes full eradication and preventive Tier-0 hardening.' } },
    stickyBox: { id: 'dcm-note', label: 'MEMORY TAKEAWAY:\nBecause DCSync stays in\nlsass.exe RAM, DACL +\nEID 4662 are vital!', tip: { kind: 'note', title: 'Core Defensive Insight', module: 'Active Directory DFIR', fields: [{ key: 'Priority', value: 'Preventive ACL + EID 4662' }], explain: 'Pair least-privilege domain root DACLs with real-time Event ID 4662 + Zeek correlation.' } },
  }),
};
