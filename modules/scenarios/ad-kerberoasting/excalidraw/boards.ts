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
  violet: '#7c3aed',
  violetFill: '#ede9fe',
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
    scenarioId: 'ad-kerberoasting',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const KERBEROASTING_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    p: 'kb',
    boardBadge: 'END-TO-END · MITRE T1558.003',
    title: 'Active Directory Kerberoasting & Pass-the-Hash Kill Chain',
    subtitle: 'LDAP SPN enumeration -> RC4 0x17 TGS extraction -> offline Hashcat 13100 -> SMB/445 lateral movement.',
    chalkHint: 'Hover any node to inspect LDAP filters, EID 4769 RC4-HMAC tickets, Hashcat 13100, and AES-256 gMSA defense.',
    header: 'MITRE T1558.003 · Kerberoasting & Pass-the-Hash Blueprint',
    footer: 'All arrows strictly orthogonal · Hover nodes for Security EID 4769 / 4624 / 7045 and gMSA specs.',
    r1: [
      { id: 'kb-ldap', label: '1. LDAP SPN Recon\nCORP\\j.miller (TCP/389)\nservicePrincipalName=*', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'process', title: 'LDAP SPN Discovery', module: 'TCP/389 · CORP-DC01', fields: [{ key: 'filter', type: 'LDAP', value: '(&(objectClass=user)(servicePrincipalName=*))' }, { key: 'target', type: 'Account', value: 'svc_sql_prod (adminCount=1)' }], explain: 'Any authenticated domain user can enumerate user SPNs in Active Directory by default.' } },
      { id: 'kb-tgs', label: '2. TGS-REQ RC4 0x17\nCORP-DC01 KDC (TCP/88)\nSecurity EID 4769', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'RC4-HMAC TGS Service Ticket', module: 'Security Event ID 4769', fields: [{ key: 'etype', type: 'Cipher', value: '0x17 (RC4-HMAC-MD5)' }, { key: 'options', type: 'Flags', value: '0x40810000' }], explain: 'Requesting etype 23 forces the KDC to seal the TGS ticket directly with svc_sql_prod’s NTLM hash.' } },
      { id: 'kb-crack', label: '3. Offline GPU Crack\nhashcat -m 13100\nZero DC Lockouts', stroke: PAL.violet, fill: PAL.violetFill, tip: { kind: 'process', title: 'Offline GPU Password Recovery', module: 'External Rig 198.51.100.77', fields: [{ key: 'speed', type: 'GPU', value: '1.42 GH/s (-m 13100)' }, { key: 'secret', type: 'Recovered', value: 'Winter2024!SQL (6 sec)' }], explain: 'Offline cracking generates zero Security Event ID 4625 failed logons or account lockouts.' } },
    ],
    a12: { cap: 'TGS-REQ 0x17', stroke: PAL.gold },
    a23: { cap: '$krb5tgs$23$', stroke: PAL.crimson },
    a34: { cap: 'SMB/445 PtH', stroke: PAL.violet },
    a45: { cap: 'Enforce gMSA', stroke: PAL.emerald },
    r2Right: { id: 'kb-pth', label: '4. SMB Lateral Pivot\nFIN-SQL01 (EID 4624)\nService EID 7045', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Pass-the-Hash Lateral Movement', module: 'FIN-SQL01.corp.local', fields: [{ key: 'logon', type: 'EID 4624', value: 'LogonType 3 · NTLM · svc_sql_prod' }, { key: 'service', type: 'EID 7045', value: 'SqlHealthDiag remote install' }], explain: 'Cracked NTLM hash enables direct SMB/445 lateral compromise without interactive login.' } },
    r2Mid: { id: 'kb-def', label: 'Hardening Controls\nAES-256 Only (0x12)\n120-Char Auto gMSA', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'AES-256 & gMSA Hardening', module: 'AD Group Policy & Auth Silos', fields: [{ key: 'cipher', type: 'Kerberos', value: 'Disable RC4 0x17 -> AES 0x12' }, { key: 'account', type: 'gMSA', value: '120-char 30-day auto-rotation' }], explain: 'Migrating SPN accounts to gMSAs and disabling RC4 makes Kerberoasting computationally infeasible.' } },
    stickyBox: { id: 'kb-note', label: 'DFIR INVARIANT ON CORP-DC01\n1) Alert EID 4769 (0x17) non-$ services.\n2) Migrate static SPNs to AES-256 gMSAs.', tip: { kind: 'note', title: 'Kerberoasting Detection Anchor', module: 'SIEM Correlation', fields: [{ key: 'signal', type: 'Primary', value: 'EID 4769 TicketEncryptionType=0x17' }], explain: 'Combining EID 4769 (0x17) with service-account NTLM network logons yields crisp high-confidence alerts.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    p: 'k1b',
    boardBadge: 'STEP #1 · LDAP SPN ENUMERATION',
    title: 'Active Directory LDAP SPN Discovery (TCP/389)',
    subtitle: 'Standard user CORP\\j.miller queries servicePrincipalName attributes without admin privileges.',
    chalkHint: 'Hover nodes for exact LDAP filter syntax, returned SPNs, and Event ID 1644 / Honey-SPN detections.',
    header: 'STEP #1 · Unprivileged LDAP SPN Enumeration on CORP-DC01',
    footer: 'Default AD permissions allow any Authenticated User to read servicePrincipalName attributes.',
    r1: [
      { id: 'k1b-user', label: 'WKS-OPS-12 Shell\nCORP\\j.miller (Medium)\nRubeus / PowerShell', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'process', title: 'Standard User Context', module: 'powershell.exe PID 3120', fields: [{ key: 'priv', type: 'Token', value: 'Medium Integrity · Domain User' }], explain: 'No local admin or Domain Admin rights are required to initiate Kerberoasting.' } },
      { id: 'k1b-ldap', label: 'LDAP Filter (389)\nobjectClass=user\nservicePrincipalName=*', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'network', title: 'LDAP Search Request', module: 'CORP-DC01 TCP/389', fields: [{ key: 'filter', type: 'Query', value: 'admincount=1 + SPN present' }], explain: 'Excluding computer accounts isolates human-managed service accounts with crackable passwords.' } },
      { id: 'k1b-spn', label: 'Target Resolved\nsvc_sql_prod\nMSSQLSvc/FIN-SQL01', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Target SPN Account', module: 'OU=ServiceAccounts', fields: [{ key: 'spn', type: 'SPN', value: 'MSSQLSvc/FIN-SQL01.corp.local:1433' }], explain: 'Static high-privilege SQL service account is prime target for RC4 TGS harvesting.' } },
    ],
    a12: { cap: 'LDAP Bind', stroke: PAL.gold },
    a23: { cap: '3 SPNs Found', stroke: PAL.sky },
    a34: { cap: 'Audit Sweep', stroke: PAL.crimson },
    a45: { cap: 'Trap Canary', stroke: PAL.emerald },
    r2Right: { id: 'k1b-1644', label: 'LDAP EID 1644 Log\nZeek LDAP Stream\nBroad SPN Sweep', stroke: PAL.violet, fill: PAL.violetFill, tip: { kind: 'detect', title: 'LDAP Reconnaissance Telemetry', module: 'Directory Service Log', fields: [{ key: 'event', type: 'EID', value: '1644 Expensive/Inefficient LDAP' }], explain: 'Logging LDAP search filters exposes automated Kerberoasting reconnaissance.' } },
    r2Mid: { id: 'k1b-honey', label: 'Honey-SPN Decoy\nFake VIP Service Acct\nZero-FP Alert Trigger', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Deception Canary Defense', module: 'AD Honey-SPN', fields: [{ key: 'action', type: 'Alert', value: 'Any EID 4769 against canary -> P1' }], explain: 'Legitimate users never request a decoy SPN, giving defenders an immediate zero-false-positive tripwire.' } },
    stickyBox: { id: 'k1b-note', label: 'STEP 1 TAKEAWAY\nRestricting SPN reads breaks Kerberos;\nmonitor LDAP 1644 & plant Honey-SPNs.', tip: { kind: 'note', title: 'Why SPNs Are Readable', module: 'Kerberos Protocol', fields: [{ key: 'reason', type: 'Design', value: 'Clients look up SPNs to request tickets' }], explain: 'Focus defense on eliminating weak human-managed SPNs and deploying canary SPN alerts.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    p: 'k2b',
    boardBadge: 'STEP #2 · RC4-HMAC 0x17 TGS-REQ',
    title: 'Kerberos TGS Ticket Downgrade & Event ID 4769',
    subtitle: 'Advertising etype 23 forces CORP-DC01 to encrypt the service ticket with svc_sql_prod’s NTLM hash.',
    chalkHint: 'Hover nodes to inspect TGS-REQ options, RC4 0x17 key derivation, and Security Event ID 4769.',
    header: 'STEP #2 · RC4-HMAC (0x17) TGS-REQ & Security EID 4769 Audit',
    footer: 'TicketEncryptionType=0x17 for a non-machine service account is the gold-standard Kerberoasting alert.',
    r1: [
      { id: 'k2b-req', label: 'Rubeus TGS-REQ\nTCP/88 · Valid TGT\netype=23 (0x17 RC4)', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'network', title: 'RC4 Downgrade Request', module: 'Kerberos TCP/88', fields: [{ key: 'options', type: 'Hex', value: '0x40810000' }], explain: 'Client advertises RC4-HMAC to force legacy encryption if the target account allows it.' } },
      { id: 'k2b-kdc', label: 'CORP-DC01 KDC\nEncTicketPart Sealed\nWith NTLM Hash', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'process', title: 'KDC Ticket Issuance', module: 'kdcsvc.dll', fields: [{ key: 'key', type: 'Secret', value: 'svc_sql_prod RC4 NTLM Hash' }], explain: 'KDC verifies only the caller TGT—not whether the caller is allowed to access SQL Server.' } },
      { id: 'k2b-rep', label: 'TGS-REP Extracted\n$krb5tgs$23$ Blob\nSaved to hashes.txt', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'memory', title: 'Extracted Hashcat Blob', module: 'LsaCallAuthenticationPackage', fields: [{ key: 'format', type: 'Hashcat', value: 'Mode 13100 ($krb5tgs$23$)' }], explain: 'Rubeus dumps the raw encrypted ticket directly from memory without touching FIN-SQL01.' } },
    ],
    a12: { cap: 'Send TGT + SPN', stroke: PAL.sky },
    a23: { cap: 'RC4 0x17 Blob', stroke: PAL.crimson },
    a34: { cap: 'DC Audit Log', stroke: PAL.violet },
    a45: { cap: 'Block RC4 GPO', stroke: PAL.emerald },
    r2Right: { id: 'k2b-4769', label: 'Security EID 4769\nEncryptionType=0x17\nServiceName=svc_sql', stroke: PAL.violet, fill: PAL.violetFill, tip: { kind: 'detect', title: 'Windows Security Event ID 4769', module: 'DC Security Event Log', fields: [{ key: 'filter', type: 'Sigma', value: '0x17 + non-$ ServiceName' }], explain: 'High-signal alert catching RC4 service ticket requests before cracking completes.' } },
    r2Mid: { id: 'k2b-aes', label: 'AES-Only GPO Policy\nDisable RC4-HMAC\nRequire 0x12 (AES256)', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Kerberos Encryption Hardening', module: 'GPO Security Options', fields: [{ key: 'types', type: 'Allowed', value: 'AES128 + AES256 Only (0x18)' }], explain: 'Preventing RC4 ticket issuance eliminates the fastest GPU cracking path.' } },
    stickyBox: { id: 'k2b-note', label: 'EID 4769 HUNTING TIP\nFilter out machine accounts (*$) and\nkrbtgt to isolate human service SPNs.', tip: { kind: 'note', title: 'Eliminating False Positives', module: 'SIEM Tuning', fields: [{ key: 'exclude', type: 'Filter', value: 'ServiceName != "*$" & != "krbtgt"' }], explain: 'Focusing strictly on non-machine accounts highlights Kerberoasting bursts cleanly.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    p: 'k3b',
    boardBadge: 'STEP #3 · OFFLINE HASHCAT -m 13100',
    title: 'Offline GPU Cracking of RC4-HMAC TGS Ticket (Zero Lockouts)',
    subtitle: 'External rig cracks Winter2024!SQL in 6 seconds without sending a single packet to CORP-DC01.',
    chalkHint: 'Hover nodes for Hashcat speed, zero-lockout mechanics, and 120-character gMSA mitigation.',
    header: 'STEP #3 · Offline GPU Cracking (-m 13100) vs. 120-Char gMSA',
    footer: 'Zero Security Event ID 4625 failed logons occur during offline Kerberoasting cracking.',
    r1: [
      { id: 'k3b-file', label: 'Exfiltrated Blob\nhashes.txt ($krb5tgs$23$)\nMoved Off-Network', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'memory', title: 'Portable Ticket File', module: '198.51.100.77', fields: [{ key: 'traffic', type: 'AD Impact', value: '0 packets sent to DC' }], explain: 'Once extracted, cracking happens entirely outside corporate visibility.' } },
      { id: 'k3b-gpu', label: 'Hashcat -m 13100\n1.42 GH/s GPU Rig\nrockyou + best64.rule', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'process', title: 'GPU RC4-HMAC Brute Force', module: 'hashcat -m 13100', fields: [{ key: 'rate', type: 'Speed', value: '1,420.6 MH/s on RTX GPU' }], explain: 'Unsalted MD4/RC4 lets GPUs test over a billion candidates per second.' } },
      { id: 'k3b-pw', label: 'Recovered Secret\nWinter2024!SQL\nNTLM: 8846F7EA...', stroke: PAL.violet, fill: PAL.violetFill, tip: { kind: 'memory', title: 'Compromised Service Credential', module: 'CORP\\svc_sql_prod', fields: [{ key: 'time', type: 'Elapsed', value: '6 seconds' }], explain: 'Attacker now holds plaintext password and NTLM hash of privileged SQL service account.' } },
    ],
    a12: { cap: 'Load Ciphertext', stroke: PAL.gold },
    a23: { cap: 'Checksum Match', stroke: PAL.crimson },
    a34: { cap: 'Why It Worked', stroke: PAL.violet },
    a45: { cap: 'Eliminate Risk', stroke: PAL.emerald },
    r2Right: { id: 'k3b-blind', label: 'Zero AD Noise\n0 Failed Logons (4625)\nLockout Policy Bypassed', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'Blind Spot After Extraction', module: 'Account Lockout Policy', fields: [{ key: 'eid4625', type: 'Count', value: '0 events on CORP-DC01' }], explain: 'Because cracking is offline, only proactive detection at Step 2 or strong credentials prevent compromise.' } },
    r2Mid: { id: 'k3b-gmsa', label: '120-Char gMSA Fix\nAuto-Rotated / 30 Days\nZero Human Passwords', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Group Managed Service Accounts', module: 'Active Directory gMSA', fields: [{ key: 'entropy', type: 'Length', value: '120 random cryptographic chars' }], explain: 'Even if an attacker steals a gMSA TGS ticket, cracking 120 random characters is mathematically infeasible.' } },
    stickyBox: { id: 'k3b-note', label: 'CRACKING REALITY CHECK\n14-char seasonal passwords fall in seconds;\n25+ random chars or gMSAs stop GPUs cold.', tip: { kind: 'note', title: 'Password Entropy Requirement', module: 'NSA / CISA AD Guidance', fields: [{ key: 'min', type: 'Policy', value: '>= 25 random chars or gMSA' }], explain: 'Replace every human-remembered service password with a gMSA.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    p: 'k4b',
    boardBadge: 'STEP #4 · PASS-THE-HASH & CONTAINMENT',
    title: 'SMB/445 Pass-the-Hash Pivot (EID 4624/7045) & Hardening',
    subtitle: 'Lateral execution on FIN-SQL01 caught by triple SIEM correlation and blocked by Auth Policy Silos.',
    chalkHint: 'Hover nodes for EID 4624 LogonType 3, EID 7045 service creation, and containment playbook.',
    header: 'STEP #4 · Pass-the-Hash on FIN-SQL01 vs. SIEM & Policy Silos',
    footer: 'Service accounts authenticating via NTLM from user workstations are a critical lateral-movement indicator.',
    r1: [
      { id: 'k4b-pth', label: 'Pass-the-Hash SMB\nWKS-OPS-12 -&gt; TCP/445\nCORP\\svc_sql_prod', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'network', title: 'NTLM Lateral Authentication', module: 'SMB TCP/445', fields: [{ key: 'hash', type: 'NTLM', value: '8846F7EAEE8FB117...' }], explain: 'Attacker authenticates directly to FIN-SQL01 ADMIN$ share using the cracked hash.' } },
      { id: 'k4b-4624', label: 'FIN-SQL01 EID 4624\nLogonType=3 · NTLM\nSrc=10.20.14.44', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'detect', title: 'Anomalous Service Logon', module: 'Security Event ID 4624', fields: [{ key: 'user', type: 'Account', value: 'svc_sql_prod from user WKS' }], explain: 'Service accounts should never log on over NTLM from interactive employee workstations.' } },
      { id: 'k4b-7045', label: 'Remote Service 7045\nSqlHealthDiag Installed\nSYSTEM PowerShell', stroke: PAL.violet, fill: PAL.violetFill, tip: { kind: 'process', title: 'Remote Service Execution', module: 'System Event ID 7045', fields: [{ key: 'service', type: 'Name', value: 'SqlHealthDiag' }], explain: 'Executes attacker payload as NT AUTHORITY\\SYSTEM on the financial SQL server.' } },
    ],
    a12: { cap: 'NTLM Auth', stroke: PAL.gold },
    a23: { cap: 'SCM Create', stroke: PAL.crimson },
    a34: { cap: 'SIEM Alert', stroke: PAL.violet },
    a45: { cap: 'Lock Down AD', stroke: PAL.emerald },
    r2Right: { id: 'k4b-soc', label: 'SOC Containment\nReset svc_sql_prod\nIsolate WKS & SQL01', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Incident Response Playbook', module: 'SOC / DFIR', fields: [{ key: 'steps', type: 'Actions', value: 'Rotate credential + kill service + isolate' }], explain: 'Immediate credential rotation and host containment prevent domain-wide escalation.' } },
    r2Mid: { id: 'k4b-silo', label: 'Auth Policy Silos\nRestrict Service Hosts\nDisable NTLM & RC4', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Active Directory Policy Silos', module: 'Tier-0 Isolation', fields: [{ key: 'control', type: 'Scope', value: 'Bind svc_sql_prod strictly to FIN-SQL01' }], explain: 'Authentication Policy Silos prevent stolen service tickets or credentials from authenticating from workstations.' } },
    stickyBox: { id: 'k4b-note', label: 'TRIPLE CORRELATION RULE\nEID 4769 (0x17) -> EID 4624 (NTLM svc_*)\n-> EID 7045 (Remote Service) = P1 Alert.', tip: { kind: 'note', title: 'End-to-End Detection Chain', module: 'SIEM Correlation', fields: [{ key: 'precision', type: 'Fidelity', value: 'Near-zero false positives' }], explain: 'Correlating ticket harvest with anomalous lateral logon catches Kerberoasting rapidly.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    p: 'kmb',
    boardBadge: 'MEMORY FORENSICS · 0x17 VS. 0x12',
    title: 'LSASS Kerberos Cache Diff: RC4-HMAC (0x17) vs. AES-256 gMSA (0x12)',
    subtitle: 'Comparing crackable RC4-HMAC tickets in lsass.exe RAM against hardened AES-256 gMSA tickets.',
    chalkHint: 'Hover blocks to compare RC4-HMAC 0x17 key derivation with salted AES-256 0x12 + gMSA.',
    header: 'MEMORY FORENSICS · lsass.exe Kerberos Ticket Cache Comparison',
    footer: 'Eliminating RC4-HMAC (0x17) and migrating SPN accounts to gMSAs closes Kerberoasting permanently.',
    r1: [
      { id: 'kmb-rc4', label: '0x7FF9B4100000\nRC4-HMAC Ticket (0x17)\nUnsalted NTLM Key', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Vulnerable RC4 Ticket Cache', module: 'lsass.exe -> kerberos.dll', fields: [{ key: 'etype', type: 'Hex', value: '0x17 (RC4-HMAC-MD5)' }], explain: 'Ticket ciphertext is sealed directly with MD4 NTLM hash, cracking at 1.42 GH/s.' } },
      { id: 'kmb-exp', label: '0x7FF9B4140000\n$krb5tgs$23$ Export\nHashcat -m 13100', stroke: PAL.gold, fill: PAL.goldFill, tip: { kind: 'memory', title: 'Extracted Hash Buffer', module: 'KerbRetrieveEncodedTicketMessage', fields: [{ key: 'crack', type: 'Time', value: '6 seconds (Winter2024!SQL)' }], explain: 'Extracted cleanly from standard user session without requiring SYSTEM privilege.' } },
      { id: 'kmb-aud', label: 'Blue Team Audit\nmsDS-SupportedEncTypes\nCheck EID 4769 0x17', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Domain Encryption Audit', module: 'AD PowerShell / SIEM', fields: [{ key: 'target', type: 'Metric', value: '0 non-machine RC4 tickets' }], explain: 'Measure and eliminate RC4 usage across SPNs prior to enforcing AES-only policy.' } },
    ],
    a12: { cap: 'LsaCallAuthPkg', stroke: PAL.crimson },
    a23: { cap: 'Audit Cipher', stroke: PAL.gold },
    a34: { cap: 'Upgrade SPNs', stroke: PAL.sky },
    a45: { cap: 'Verified Safe', stroke: PAL.emerald },
    r2Right: { id: 'kmb-aes', label: '0x7FF9B4200000\nAES-256 Ticket (0x12)\nPBKDF2 4096 + Salt', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Hardened AES-256 Ticket', module: 'lsass.exe -> kerberos.dll', fields: [{ key: 'etype', type: 'Hex', value: '0x12 (AES256-CTS-HMAC-SHA1-96)' }], explain: 'Salted PBKDF2 key derivation drastically slows offline cracking.' } },
    r2Mid: { id: 'kmb-gmsa', label: '120-Char gMSA Vault\nAuto-Rotated / 30d\nOffline Crack Blocked', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'gMSA Cryptographic Protection', module: 'Active Directory gMSA', fields: [{ key: 'strength', type: 'Entropy', value: '120 random chars' }], explain: 'Combines AES-256 with automatic 120-character key rotation.' } },
    stickyBox: { id: 'kmb-note', label: 'MEMORY DIFF VERDICT\nRC4 0x17 + human password = 6s crack.\nAES 0x12 + 120-char gMSA = Uncrackable.', tip: { kind: 'note', title: 'Cryptographic Takeaway', module: 'Kerberos Defense', fields: [{ key: 'rule', type: 'Priority', value: 'Migrate SPNs to gMSA first' }], explain: 'High-entropy gMSA passwords neutralize Kerberoasting even under AES.' } },
  }),
};
