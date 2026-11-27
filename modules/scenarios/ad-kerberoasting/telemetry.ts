import type { TelemetryEvent } from '../types';

export const AD_KERBEROASTING_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'kerb-evt-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.412',
    sourceNodeId: 'guest_wks',
    targetNodeId: 'dc_kdc',
    sourceLabel: 'WKS-OPS-12 (CORP\\j.miller)',
    targetLabel: 'CORP-DC01 (LDAP TCP/389)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'LDAP Query (TCP/389) / Sysmon 1',
    shortAction: 'LDAP SPN ENUM',
    info: 'Standard domain user CORP\\j.miller queries Active Directory LDAP for user accounts with non-empty servicePrincipalName attributes',
    sizeOrCode: '3 SPNs',
    severity: 'MEDIUM',
    mitreId: 'T1558.003',
    explanation:
      'Any authenticated domain user can legally read Active Directory LDAP objects by default. Filtering for (&(samAccountType=805306368)(servicePrincipalName=*)) immediately enumerates human-managed service accounts such as svc_sql_prod whose passwords are often static and weak.',
    rawLog: `Sysmon EventID=1 (ProcessCreate) | Host=WKS-OPS-12.corp.local
User=CORP\\j.miller (Integrity=Medium) | ParentImage=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
CommandLine=Rubeus.exe kerberoast /ldapfilter:'admincount=1' /format:hashcat /outfile:hashes.txt
---
Zeek LDAP Log | Src=10.20.14.44:51822 -> Dst=10.20.10.10:389 (CORP-DC01.corp.local)
BaseDN=DC=corp,DC=local | Filter=(&(objectClass=user)(servicePrincipalName=*)(!(objectClass=computer)))
Result=CN=svc_sql_prod,OU=ServiceAccounts,DC=corp,DC=local | SPN=MSSQLSvc/FIN-SQL01.corp.local:1433`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Suspicious Active Directory LDAP SPN Discovery for Kerberoasting',
      ruleCode: `title: Active Directory User SPN Enumeration via LDAP
status: stable
logsource:
  product: windows
  service: security
detection:
  selection_eid:
    EventID: 1644
  selection_filter:
    Filter|contains|all:
      - 'servicePrincipalName='
      - 'samAccountType=805306368'
  condition: selection_eid and selection_filter
level: medium
tags:
  - attack.credential_access
  - attack.t1558.003`,
      mitigation:
        'Monitor Directory Service LDAP Event ID 1644 and Zeek LDAP streams for broad user-object SPN queries, and deploy honey-SPN canary accounts with alerting on any ticket request.',
    },
  },
  {
    id: 'kerb-evt-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:02.185',
    sourceNodeId: 'dc_kdc',
    targetNodeId: 'tgs_ticket_cache',
    sourceLabel: 'CORP-DC01 KDC (TCP/88)',
    targetLabel: 'TGS RC4 Ticket (0x17)',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'Security EID 4769 (Kerberos TGS)',
    shortAction: 'TGS-REQ RC4 0x17',
    info: 'CORP-DC01 issues a Kerberos TGS ticket for MSSQLSvc/FIN-SQL01.corp.local encrypted with legacy RC4-HMAC (0x17) and TicketOptions 0x40810000',
    sizeOrCode: '0x17 RC4',
    severity: 'CRITICAL',
    mitreId: 'T1558.003',
    explanation:
      'By advertising RC4-HMAC-MD5 (etype 23 / 0x17) in the Kerberos TGS-REQ, the attacker forces the KDC to encrypt the service ticket using the RC4 NTLM hash of svc_sql_prod. Windows Security Event ID 4769 records TicketEncryptionType 0x17 against a non-machine service account.',
    rawLog: `EventID=4769 (A Kerberos service ticket was requested) | Host=CORP-DC01.corp.local
AccountName=j.miller@CORP.LOCAL | ClientAddress=::ffff:10.20.14.44
ServiceName=svc_sql_prod | ServiceID=S-1-5-21-3891024-771240-90124-2104
TicketOptions=0x40810000 | TicketEncryptionType=0x17 (RC4-HMAC-MD5)
FailureCode=0x0 | Status=SUCCESS
$krb5tgs$23$*svc_sql_prod$CORP.LOCAL$MSSQLSvc/FIN-SQL01.corp.local:1433*$84F9C2...`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Kerberoasting RC4-HMAC (0x17) TGS Service Ticket Request (Event ID 4769)',
      ruleCode: `title: Kerberoasting RC4-HMAC Service Ticket Request
status: stable
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4769
    TicketEncryptionType: '0x17'
    TicketOptions: '0x40810000'
  filter_machine:
    ServiceName|endswith: '$'
  filter_krbtgt:
    ServiceName: 'krbtgt'
  condition: selection and not filter_machine and not filter_krbtgt
level: high
tags:
  - attack.credential_access
  - attack.t1558.003`,
      mitigation:
        'Disable RC4-HMAC Kerberos encryption via GPO (Network security: Configure encryption types allowed for Kerberos -> AES128/AES256 only) and migrate static service accounts to Group Managed Service Accounts (gMSAs).',
    },
  },
  {
    id: 'kerb-evt-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:08.640',
    sourceNodeId: 'tgs_ticket_cache',
    targetNodeId: 'offline_cracker',
    sourceLabel: 'Extracted $krb5tgs$23$ Blob',
    targetLabel: 'Offline GPU Hashcat (-m 13100)',
    sourceType: 'MEMORY_SCAN',
    protocolOrEventId: 'Kerberos TGS-REP Extract / Offline',
    shortAction: 'OFFLINE CRACK -m 13100',
    info: 'Attacker exports the RC4-HMAC TGS ticket from memory and cracks svc_sql_prod password offline with Hashcat mode 13100 generating zero DC failed-logon alerts',
    sizeOrCode: '13100 RC4',
    severity: 'CRITICAL',
    mitreId: 'T1558.003',
    explanation:
      'Because the encrypted portion of the TGS ticket is sealed directly with the service account NTLM hash, offline GPU cracking tests billions of candidates per second without sending a single authentication packet to Active Directory or triggering account lockout policies.',
    rawLog: `[OFFLINE ATTACKER RIG · 198.51.100.77 — ZERO DC NETWORK TRAFFIC]
$ hashcat -m 13100 -a 0 hashes.txt rockyou_corp_rules.txt -r best64.rule
Session..........: kerberoast_svc_sql
Hash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)
Speed.#1.........: 1,420.6 MH/s (RTX GPU Rig)
Recovered........: 1/1 (100.00%) Digests | Time: 00:00:06
CRACKED..........: svc_sql_prod : Winter2024!SQL (NTLM: 8846F7EAEE8FB117AD06BDD830B7586C)`,
    detectionRule: {
      type: 'KQL',
      title: 'High-Velocity Multi-SPN RC4 TGS Ticket Harvesting Prior to Offline Cracking',
      ruleCode: `SecurityEvent
| where EventID == 4769
| where TicketEncryptionType == "0x17"
| where ServiceName !endswith "$" and ServiceName != "krbtgt"
| summarize DistinctServices = dcount(ServiceName), Services = make_set(ServiceName) by Account, IpAddress, bin(TimeGenerated, 5m)
| where DistinctServices >= 3`,
      mitigation:
        'Enforce 25+ character random passwords or migrate every SPN-bearing account to 120-character auto-rotated Group Managed Service Accounts (gMSA) so offline cracking is computationally infeasible.',
    },
  },
  {
    id: 'kerb-evt-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:13.910',
    sourceNodeId: 'offline_cracker',
    targetNodeId: 'fin_sql_server',
    sourceLabel: 'CORP\\svc_sql_prod (Cracked NTLM)',
    targetLabel: 'FIN-SQL01.corp.local (SMB 445)',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'Security EID 4624 (LogonType 3) / 7045',
    shortAction: 'PTH SMB LATERAL',
    info: 'Adversary authenticates to FIN-SQL01 over SMB/445 using the recovered svc_sql_prod NTLM hash (LogonType 3 NtLmSsp) and registers a remote service (EID 7045)',
    sizeOrCode: 'EID 4624/7045',
    severity: 'CRITICAL',
    mitreId: 'T1550.002',
    explanation:
      'Armed with the cracked service account credential, the attacker pivots laterally across SMB (TCP/445) using Pass-the-Hash. Security Event ID 4624 logs an anomalous interactive/network NTLM logon by a service account from a user workstation, followed by Event ID 7045 remote service creation.',
    rawLog: `EventID=4624 (An account was successfully logged on) | Host=FIN-SQL01.corp.local
TargetUserName=svc_sql_prod | TargetDomainName=CORP | LogonType=3 (Network)
AuthenticationPackageName=NTLM | LmPackageName=NTLM V2 | WorkstationName=WKS-OPS-12
IpAddress=10.20.14.44 | ElevatedToken=Yes
---
EventID=7045 (A service was installed in the system) | Host=FIN-SQL01.corp.local
ServiceName=SqlHealthDiag | ImagePath=C:\\Windows\\System32\\cmd.exe /c powershell -enc ...`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Service Account NTLM Network Logon from User Workstation (Pass-the-Hash)',
      ruleCode: `title: Service Account Lateral Movement via NTLM LogonType 3
status: stable
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4624
    LogonType: 3
    AuthenticationPackageName: 'NTLM'
    TargetUserName|startswith: 'svc_'
  condition: selection
level: critical
tags:
  - attack.lateral_movement
  - attack.t1550.002
  - attack.t1543.003`,
      mitigation:
        'Restrict service accounts with Deny logon over network / Authentication Policy Silos, revoke Domain Admin group membership from service accounts, and audit NTLM usage via Event ID 8004.',
    },
  },
];
