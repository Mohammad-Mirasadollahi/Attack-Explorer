import { AD_KERBEROASTING_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'ad-kerberoasting',
  code: 'T1558.003',
  name: 'Active Directory Kerberoasting & Pass-the-Hash Lateral Movement',
  shortSubtitle: 'Active Directory · LDAP SPN Discovery, RC4 0x17 TGS Extraction & Offline Cracking',
  category: 'ACTIVE_DIRECTORY',
  severity: 'HIGH',
  primaryMitrePhase: 5,
  overview:
    'In Active Directory Kerberoasting & Pass-the-Hash Lateral Movement (MITRE ATT&CK T1558.003, T1550.002, and T1543.003), any low-privilege domain user escalates into privileged SQL and server tiers without triggering a single Domain Controller password-lockout event. The attack unfolds in one continuous arc: querying Active Directory LDAP for user accounts carrying a servicePrincipalName (SPN) such as MSSQLSvc/FIN-SQL01.corp.local:1433, requesting a Kerberos TGS service ticket with legacy RC4-HMAC encryption (TicketEncryptionType 0x17) logged in Security Event ID 4769, extracting and cracking the $krb5tgs$23$ ticket offline on a GPU rig with Hashcat mode 13100, and pivoting laterally over SMB/445 into FIN-SQL01 using Pass-the-Hash (Security Event ID 4624 LogonType 3) and remote service creation (EID 7045). Steps #1-#4 trace every AD audit artifact, and Memory Forensics contrasts weak RC4-HMAC 0x17 service tickets against AES-256 0x12 gMSA hardening.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1558.003 (Kerberoasting) · T1550.002 (Pass the Hash) · T1543.003 (Windows Service)' },
    { term: 'LDAP SPN FILTER', value: '(&(objectClass=user)(servicePrincipalName=*)(!(objectClass=computer)))' },
    { term: 'WEAK ENCRYPTION', value: 'Kerberos TicketEncryptionType 0x17 (RC4-HMAC-MD5) · TicketOptions 0x40810000' },
    { term: 'OFFLINE CRACKING', value: 'hashcat -m 13100 hashes.txt (Zero Domain Controller Failed-Logon Alerts)' },
    { term: 'SIEM TELEMETRY', value: 'Security EID 4769 (0x17 Non-$ Service) + EID 4624 (LogonType 3 NTLM) + EID 7045' },
    { term: 'HARDENING CONTROLS', value: 'AES-256 Only Kerberos (0x12) + 120-Char Auto-Rotated gMSA + Auth Policy Silos' },
  ],
  nodes: [
    {
      id: 'guest_wks',
      label: 'WKS-OPS-12 (j.miller)',
      sublabel: 'Standard Domain User · Rubeus',
      role: 'victim_host',
      x: 10,
      y: 28,
      details: {
        osOrType: 'Windows 11 Domain-Joined Workstation (10.20.14.44)',
        pidOrPort: 'PID 4188 (powershell.exe -> Rubeus.exe)',
        privilege: 'CORP\\j.miller (Standard Unprivileged Domain User)',
        artifacts: [
          'Queries LDAP TCP/389 for user accounts with servicePrincipalName',
          'Requests TGS ticket with RC4-HMAC (etype 23 / 0x17)',
          'Exports $krb5tgs$23$ ticket blob from LSA ticket cache',
        ],
        description:
          'Compromised standard employee workstation demonstrating that Kerberoasting requires zero local administrator rights—only valid domain credentials.',
      },
    },
    {
      id: 'dc_kdc',
      label: 'CORP-DC01 (KDC)',
      sublabel: 'LDAP 389 & Kerberos TCP/88',
      role: 'domain_controller',
      x: 36,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 Domain Controller (10.20.10.10)',
        pidOrPort: 'TCP/389 (LDAP) · TCP/88 (Kerberos KDC)',
        privilege: 'Domain Authority · Issues Signed TGS Tickets',
        artifacts: [
          'Returns SPN MSSQLSvc/FIN-SQL01.corp.local:1433 for svc_sql_prod',
          'Encrypts TGS service ticket using svc_sql_prod NTLM hash (RC4 0x17)',
          'Logs Security Event ID 4769 (TicketEncryptionType 0x17)',
        ],
        description:
          'Active Directory Key Distribution Center that honors any valid user request for a service ticket without verifying whether the requester is authorized to use that service.',
      },
    },
    {
      id: 'tgs_ticket_cache',
      label: 'Kerberos TGS Ticket (0x17)',
      sublabel: '$krb5tgs$23$ RC4-HMAC Blob',
      role: 'memory',
      x: 36,
      y: 68,
      details: {
        osOrType: 'LSASS Kerberos Ticket Cache Structure',
        pidOrPort: 'etype 23 (0x17) · RC4-HMAC-MD5',
        privilege: 'Encrypted Directly With svc_sql_prod NTLM Hash',
        artifacts: [
          'TicketOptions: 0x40810000 (Forwardable, Renewable)',
          'ServiceName: svc_sql_prod (Privileged SQL Service Account)',
          'Extracted cleanly into Hashcat -m 13100 format',
        ],
        description:
          'In-memory Kerberos service ticket whose encrypted inner payload is sealed directly with the target service account NTLM hash, enabling rapid offline cracking.',
      },
    },
    {
      id: 'offline_cracker',
      label: 'Offline GPU Rig (13100)',
      sublabel: 'Hashcat -m 13100 · Zero Lockout',
      role: 'attacker',
      x: 64,
      y: 68,
      details: {
        osOrType: 'External Adversary Cracking Workstation (198.51.100.77)',
        pidOrPort: 'hashcat -m 13100 (1.42 GH/s RC4)',
        privilege: '100% Offline — Zero Active Directory Traffic',
        artifacts: [
          'Recovers plaintext password: Winter2024!SQL in 6 seconds',
          'Derives NTLM hash 8846F7EAEE8FB117AD06BDD830B7586C',
          'Bypasses domain account lockout thresholds completely',
        ],
        description:
          'Off-network GPU cracking rig that brute-forces the RC4-HMAC ticket completely out of sight of Active Directory authentication logs.',
      },
    },
    {
      id: 'fin_sql_server',
      label: 'FIN-SQL01.corp.local',
      sublabel: 'SMB 445 · Pass-the-Hash Pivot',
      role: 'server',
      x: 66,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 Enterprise SQL Tier (10.20.30.15)',
        pidOrPort: 'TCP/445 (SMB) · TCP/1433 (MSSQL)',
        privilege: 'CORP\\svc_sql_prod (Local Admin + Sysadmin)',
        artifacts: [
          'Security EID 4624: LogonType 3 NtLmSsp from 10.20.14.44',
          'Security EID 7045: Malicious SqlHealthDiag service installed',
          'Grants direct access to corporate financial databases',
        ],
        description:
          'High-value database server compromised via Pass-the-Hash lateral movement once the weak service account password is recovered offline.',
      },
    },
    {
      id: 'siem_ad_watch',
      label: 'SIEM & gMSA Guard',
      sublabel: 'EID 4769 (0x17) + EID 4624',
      role: 'firewall_siem',
      x: 89,
      y: 48,
      details: {
        osOrType: 'Active Directory SIEM & Kerberos Hardening Layer',
        pidOrPort: 'EventID 4769 (0x17) · EventID 4624 · AES-256 gMSA',
        privilege: 'SOC Detection & Preventive Encryption Enforcement',
        artifacts: [
          'Flags Event ID 4769 TicketEncryptionType 0x17 for non-$ services',
          'Correlates service account NTLM LogonType 3 from user workstation',
          'Enforces AES-256 (0x12) + 120-character auto-rotated gMSAs',
        ],
        description:
          'Defensive correlation and Kerberos hardening control plane that spots anomalous RC4 TGS bursts and eliminates offline cracking via AES-256 gMSA migration.',
      },
    },
  ],
  processTree: [
    {
      pid: 3120,
      ppid: 1840,
      name: 'powershell.exe',
      commandLine: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoP -Exec Bypass',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'DirectorySearcher LDAP Filter (&(objectClass=user)(servicePrincipalName=*))',
        'Enumerates MSSQLSvc/FIN-SQL01.corp.local:1433 -> svc_sql_prod',
      ],
    },
    {
      pid: 4188,
      ppid: 3120,
      name: 'Rubeus.exe',
      commandLine: 'Rubeus.exe kerberoast /ldapfilter:"admincount=1" /format:hashcat /outfile:hashes.txt',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'InitializeSecurityContextW(Kerberos, Target="MSSQLSvc/FIN-SQL01.corp.local:1433")',
        'Requests TGS-REQ advertising RC4-HMAC-MD5 (etype 23 / 0x17)',
        'Extracts $krb5tgs$23$ encrypted service ticket bytes to hashes.txt',
      ],
    },
    {
      pid: 664,
      ppid: 580,
      name: 'lsass.exe',
      commandLine: 'C:\\Windows\\System32\\lsass.exe (Kerberos Ticket Cache)',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'kerberos.dll caches TGS-REP ticket (etype 0x17 RC4-HMAC) for svc_sql_prod',
        'LsaCallAuthenticationPackage(KerbRetrieveEncodedTicketMessage)',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF9B4100000',
          section: 'kerberos.dll TGS Ticket Cache (RC4-HMAC 0x17)',
          permissions: 'RW-',
          size: '48 KB',
          status: 'patched',
          description:
            'Cached Kerberos TGS service ticket for MSSQLSvc/FIN-SQL01.corp.local encrypted with RC4-HMAC (etype 23 / 0x17) derived directly from the service account NTLM hash, enabling rapid offline GPU cracking.',
          hexPreview: '6D 82 05 14 30 82 05 10 A0 03 02 01 05 A1 03 02  m...0...........',
        },
        {
          address: '0x00007FF9B4140000',
          section: 'Exported $krb5tgs$23$ Hashcat Buffer',
          permissions: 'RW-',
          size: '16 KB',
          status: 'shellcode',
          description:
            'Formatted Kerberos 5 etype 23 checksum and ciphertext extracted via KerbRetrieveEncodedTicketMessage for offline Hashcat mode 13100 password recovery.',
          hexPreview: '24 6B 72 62 35 74 67 73 24 32 33 24 2A 73 76 63  $krb5tgs$23$*svc',
        },
        {
          address: '0x00007FF9B4200000',
          section: 'Hardened AES-256 gMSA Ticket Reference (0x12)',
          permissions: 'R--',
          size: '48 KB',
          status: 'clean',
          description:
            'Baseline comparison showing an AES256-CTS-HMAC-SHA1-96 (etype 18 / 0x12) ticket backed by a 120-character auto-rotated Group Managed Service Account (gMSA) that resists offline cracking.',
          hexPreview: 'A0 03 02 01 12 A2 82 04 D8 04 82 04 D4 7A 1C 9E  .............z..',
        },
      ],
    },
    {
      pid: 7420,
      ppid: 3120,
      name: 'services.exe (FIN-SQL01)',
      commandLine: 'C:\\Windows\\System32\\cmd.exe /c powershell -enc ... (via SqlHealthDiag)',
      user: 'CORP\\svc_sql_prod',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 4,
      apiCalls: [
        'Security EID 4624: NTLM LogonType 3 from WKS-OPS-12 (10.20.14.44)',
        'Security EID 7045: Remote service SqlHealthDiag registered over SMB/445',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Active Directory LDAP SPN Discovery by Standard Domain User',
      subtitle: 'Enumerating Human-Managed Service Accounts (svc_sql_prod) via TCP/389',
      description:
        'Unprivileged domain user CORP\\j.miller queries Active Directory LDAP for user objects bearing a servicePrincipalName (SPN), pinpointing privileged service account svc_sql_prod.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1558.003',
      mitreTechniqueName: 'Steal or Forge Kerberos Tickets: Kerberoasting',
      activeNodeIds: ['guest_wks', 'dc_kdc', 'siem_ad_watch'],
      compromisedNodeIds: ['guest_wks'],
      keySpecs: [
        { term: 'LDAP FILTER', value: '(&(objectClass=user)(servicePrincipalName=*)(!(objectClass=computer)))' },
        { term: 'TARGET SPN', value: 'MSSQLSvc/FIN-SQL01.corp.local:1433 (Account: svc_sql_prod)' },
        { term: 'PRIVILEGE REQUIRED', value: 'Standard Domain User Only (CORP\\j.miller · Zero Admin Rights)' },
      ],
    },
    {
      index: 2,
      title: 'Kerberos TGS Service Ticket Request with RC4-HMAC Downgrade (0x17)',
      subtitle: 'KDC Encrypts Service Ticket With svc_sql_prod NTLM Hash (EID 4769)',
      description:
        'Rubeus requests a TGS ticket for MSSQLSvc/FIN-SQL01 advertising RC4-HMAC-MD5 (0x17), causing CORP-DC01 to encrypt the ticket directly with svc_sql_prod’s NTLM hash and log Event ID 4769.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1558.003',
      mitreTechniqueName: 'Kerberoasting (RC4-HMAC 0x17 TGS-REQ)',
      activeNodeIds: ['guest_wks', 'dc_kdc', 'tgs_ticket_cache', 'siem_ad_watch'],
      compromisedNodeIds: ['guest_wks', 'tgs_ticket_cache'],
      keySpecs: [
        { term: 'KERBEROS AUDIT', value: 'Windows Security Event ID 4769 (TicketEncryptionType = 0x17)' },
        { term: 'TICKET OPTIONS', value: '0x40810000 (Forwardable | Renewable) · ServiceName: svc_sql_prod' },
        { term: 'EXTRACTED FORMAT', value: '$krb5tgs$23$*svc_sql_prod$CORP.LOCAL$MSSQLSvc/FIN-SQL01...' },
      ],
    },
    {
      index: 3,
      title: 'Offline GPU Cracking via Hashcat Mode 13100 (Zero Account Lockouts)',
      subtitle: 'Recovering svc_sql_prod Plaintext Password & NTLM Hash Off-Network',
      description:
        'The attacker transfers the $krb5tgs$23$ ticket blob to an offline GPU rig and cracks Winter2024!SQL in seconds using Hashcat -m 13100 without generating a single failed-logon event on Active Directory.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1558.003',
      mitreTechniqueName: 'Offline Kerberos TGS Ticket Cracking',
      activeNodeIds: ['tgs_ticket_cache', 'offline_cracker'],
      compromisedNodeIds: ['guest_wks', 'tgs_ticket_cache', 'offline_cracker'],
      keySpecs: [
        { term: 'CRACKING ENGINE', value: 'hashcat -m 13100 hashes.txt (1.42 GH/s RC4-HMAC GPU Speed)' },
        { term: 'DC NOISE LEVEL', value: 'ZERO Failed Logon Events (EID 4625) · Zero Lockout Triggers' },
        { term: 'RECOVERED SECRET', value: 'svc_sql_prod : Winter2024!SQL (NTLM: 8846F7EA...586C)' },
      ],
    },
    {
      index: 4,
      title: 'Pass-the-Hash Lateral Movement to FIN-SQL01 & AES-256 gMSA Defense',
      subtitle: 'NTLM LogonType 3 (EID 4624) + Remote Service Install (EID 7045)',
      description:
        'Using the recovered svc_sql_prod NTLM hash, the attacker authenticates to FIN-SQL01 over SMB/445 (EID 4624) and installs a malicious service (EID 7045), while SOC correlation and AES-256 gMSA policies close the gap.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1550.002',
      mitreTechniqueName: 'Use Alternate Authentication Material: Pass the Hash',
      activeNodeIds: ['offline_cracker', 'fin_sql_server', 'siem_ad_watch'],
      compromisedNodeIds: ['guest_wks', 'tgs_ticket_cache', 'offline_cracker', 'fin_sql_server'],
      keySpecs: [
        { term: 'LATERAL PROOF', value: 'Security EID 4624 (LogonType 3 · NTLM · svc_sql_prod from WKS-OPS-12)' },
        { term: 'EXECUTION PROOF', value: 'System EID 7045 (Service Installed: SqlHealthDiag on FIN-SQL01)' },
        { term: 'HARDENING FIX', value: 'Enforce AES-256 Only (0x12) + Migrate SPNs to 120-Char gMSAs' },
      ],
    },
  ],
  telemetry: AD_KERBEROASTING_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'ad-kerberoasting',
  briefing: {
    headline: 'Active Directory Kerberoasting (T1558.003): RC4-HMAC TGS Downgrade & Pass-the-Hash Lateral Movement',
    storyAnalogy:
      'Imagine a grand hotel lobby where every guest can walk up to the mahogany VIP bellboard, read the names of every private penthouse suite, and ask the brass concierge desk to stamp an official sealed room voucher for any suite without proving they own it. Because the hotel still lets guests request flimsy bronze wax seals instead of modern unbreakable emerald locks, a crafty guest slips a stamped bronze voucher down into a private basement safecracker bench, spins the weak lock tumblers open in total silence without tripping a single lobby alarm, and walks straight upstairs into the penthouse vault with a freshly cut master brass keycard.',
    plainSummary:
      'In this scenario (T1558.003, Active Directory Kerberoasting & Pass-the-Hash Lateral Movement) on WKS-OPS-12 and CORP-DC01, a standard unprivileged domain user escalates into the SQL server tier along one continuous intrusion path without triggering a single Domain Controller account lockout. First, the operator enumerates human-managed service accounts carrying a Service Principal Name through LDAP, then requests a Kerberos service ticket encrypted with weak RC4-HMAC so the Domain Controller seals it with the service account password hash, then cracks the exported ticket completely offline on a GPU rig, and finally pivots into FIN-SQL01 over SMB using Pass-the-Hash and remote service creation. Steps #1 through #4 trace each Active Directory handoff and audit log from initial discovery to lateral execution, while the Memory Forensics section compares cached RC4-HMAC tickets against hardened AES-256 managed service accounts.',
    diagramTopologySummary:
      'Six-node Active Directory kill chain spanning WKS-OPS-12, CORP-DC01 KDC, the in-memory Kerberos TGS Ticket Cache, an off-network GPU cracking rig, FIN-SQL01.corp.local, and the SIEM & gMSA enforcement control plane.',
    documentedAdvisory:
      'Grounded in Microsoft Security Auditing Event IDs 4769 & 4624 and NSA/CISA Active Directory Kerberos hardening guidance.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1558.003',
      plainTitle: 'Active Directory LDAP SPN Discovery by Standard Domain User',
      storyAnalogy:
        'Standing in the public hotel lobby with nothing more than a standard guest room badge, the visitor strolls over to the polished mahogany VIP bellboard and reads the list of private staff suites. Because the lobby directory is posted in plain view for every guest, the visitor quietly copies down the name of the head financial suite without asking a single guard for special clearance.',
      simpleExplanation:
        'By default in Active Directory, any standard authenticated domain user can query LDAP (Lightweight Directory Access Protocol, the directory lookup service on TCP port 389) for user accounts that hold a servicePrincipalName (SPN, the unique service identifier binding an application such as SQL Server to a domain account). Filtering specifically for non-computer user objects reveals human-managed service accounts like svc_sql_prod whose passwords rarely rotate.',
      howItWorksInPractice:
        'On WKS-OPS-12 (10.20.14.44), standard user CORP\\j.miller executes an LDAP search against CORP-DC01 (10.20.10.10:389) using filter (&(objectClass=user)(servicePrincipalName=*)(!(objectClass=computer))) via PowerShell DirectorySearcher or Rubeus.exe kerberoast /ldapfilter:"admincount=1" (filtering for privileged accounts marked by Active Directory AdminSDHolder). Because Kerberos relies on clients knowing service SPNs before requesting tickets, Active Directory grants Authenticated Users read access to servicePrincipalName attributes across the domain. The directory immediately returns CN=svc_sql_prod,OU=ServiceAccounts,DC=corp,DC=local mapped to MSSQLSvc/FIN-SQL01.corp.local:1433, giving the adversary a high-value target without triggering any privilege-escalation or access-denied alert.',
      diagramAlignment:
        'Follow Step #1 / Link #1 as Node 1 (WKS-OPS-12) sends an unprivileged LDAP TCP/389 directory lookup to Node 2 (CORP-DC01 KDC) and receives the svc_sql_prod SPN mapping.',
      detectionAndEvidence:
        'Monitor Active Directory Event ID 1644 (expensive/inefficient LDAP queries) and Zeek LDAP telemetry for non-administrative workstations issuing broad servicePrincipalName=* or adminCount=1 filters, and plant decoy honey-SPN canary accounts that trigger instant SOC alerts on any ticket request.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1558.003',
      plainTitle: 'Kerberos TGS Service Ticket Request with RC4-HMAC Downgrade (0x17)',
      storyAnalogy:
        'Holding the suite name copied from the bellboard, the guest sends a brass pneumatic request tube straight to the hotel concierge desk asking for an official entry voucher stamped with the hotel’s legacy soft-bronze wax seal. Because the concierge desk never checks whether a guest actually belongs in the penthouse before stamping a voucher, it prints the bronze-sealed pass and shoots it straight back down the tube.',
      simpleExplanation:
        'Using the discovered SPN, Rubeus calls the Windows Kerberos API (InitializeSecurityContextW / KerbRetrieveEncodedTicketMessage, which sends a TGS-REQ message to TCP port 88 on the Domain Controller) while advertising legacy RC4-HMAC-MD5 (TicketEncryptionType 0x17, an outdated cipher that derives the ticket key directly from the service account NTLM hash). The KDC complies without checking service authorization and records Windows Security Event ID 4769.',
      howItWorksInPractice:
        'Kerberos authentication intentionally separates ticket issuance from resource authorization: CORP-DC01 validates only that CORP\\j.miller holds a valid Ticket Granting Ticket (TGT) before issuing a Ticket Granting Service (TGS) ticket for MSSQLSvc/FIN-SQL01.corp.local:1433. When the target account msDS-SupportedEncryptionTypes does not strictly forbid RC4, requesting etype 23 (0x17) forces the KDC to encrypt the service ticket’s EncTicketPart using the raw RC4 NTLM hash of svc_sql_prod instead of salted AES-256. Simultaneously, CORP-DC01 writes Security Event ID 4769 showing AccountName=j.miller, ServiceName=svc_sql_prod, TicketOptions=0x40810000, and TicketEncryptionType=0x17—creating the single highest-fidelity Kerberoasting detection signal in Active Directory.',
      diagramAlignment:
        'Follow Step #2 / Link #2 as Node 2 (CORP-DC01 KDC) stamps the RC4-HMAC 0x17 ticket into Node 3 (Kerberos TGS Ticket Cache) while Node 6 (SIEM & gMSA Guard) logs Event ID 4769.',
      detectionAndEvidence:
        'Deploy high-fidelity SIEM and Sigma rules on Domain Controller Security Event ID 4769 alerting whenever TicketEncryptionType equals 0x17 (RC4-HMAC) for any human service account (ServiceName not ending in $ and not krbtgt), especially bursts of multiple SPNs requested by one workstation within seconds.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1558.003',
      plainTitle: 'Offline GPU Cracking via Hashcat Mode 13100 (Zero Account Lockouts)',
      storyAnalogy:
        'Instead of walking upstairs and guessing codes on the penthouse door where three wrong tries would sound the hotel alarm, the guest carries the bronze-sealed voucher down into a soundproof basement workshop. Spinning thousands of brass lock-tumbler combinations per second on their own workbench, the safecracker pops the soft bronze seal open in seconds and reads the master suite password in complete silence.',
      simpleExplanation:
        'Once exported into $krb5tgs$23$ format, the RC4-HMAC TGS ticket becomes a self-contained offline cracking target for Hashcat mode 13100 (a GPU-accelerated password recovery mode specialized for Kerberos etype 23 TGS-REP tickets). Because RC4-HMAC lacks strong key stretching (unlike modern PBKDF2-salted AES-256), modern GPUs test over a billion password guesses per second with zero network traffic hitting the Domain Controller.',
      howItWorksInPractice:
        'On external rig 198.51.100.77, the operator feeds hashes.txt into hashcat -m 13100 -a 0 hashes.txt rockyou_corp_rules.txt -r best64.rule, achieving 1.42 GH/s against the unsalted MD4/RC4-HMAC key derivation. Because every candidate password guess is validated mathematically against the stolen ticket checksum offline, Active Directory records zero Event ID 4625 failed-logon attempts and never triggers domain lockout thresholds. Within six seconds, the weak seasonal password Winter2024!SQL and its corresponding NTLM hash (8846F7EAEE8FB117AD06BDD830B7586C) are recovered cleanly—demonstrating why short human-chosen passwords on SPN accounts collapse almost instantaneously once a single RC4 TGS ticket is harvested.',
      diagramAlignment:
        'Follow Step #3 / Link #3 as the extracted $krb5tgs$23$ blob moves from Node 3 (TGS Ticket Cache) into Node 4 (Offline GPU Rig 13100) completely outside the Domain Controller monitoring boundary.',
      detectionAndEvidence:
        'Offline GPU password cracking generates zero Event ID 4625 failed-logon alerts on Active Directory; defenders eliminate crackability proactively by migrating SPN services to 120-character auto-rotated Group Managed Service Accounts (gMSAs), enforcing AES-256 (0x12), and hunting Sysmon EID 11 for exported ticket files.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1550.002',
      plainTitle: 'Pass-the-Hash Lateral Movement to FIN-SQL01 & AES-256 gMSA Defense',
      storyAnalogy:
        'With the freshly cut master brass keycard in hand, the intruder rides the elevator straight to the restricted Finance Penthouse and taps the card on the doorway turnstile. The door clicks open immediately—until the lobby audit tower spots a service-only staff card swiped from a regular guest corridor and orders every suite upgraded to unbreakable emerald vault locks that rotate automatically.',
      simpleExplanation:
        'Armed with the cracked svc_sql_prod NTLM hash, the attacker executes Pass-the-Hash (authenticating directly over SMB TCP port 445 using the NTLM hash without needing interactive password entry) against FIN-SQL01.corp.local, generating Windows Security Event ID 4624 (LogonType 3 Network NTLM logon) and System Event ID 7045 (remote Windows service installation) before defenders lock down Kerberos to AES-256 and gMSAs.',
      howItWorksInPractice:
        'Authenticating as CORP\\svc_sql_prod from WKS-OPS-12 (10.20.14.44) over SMB/445 into FIN-SQL01 (10.20.30.15) triggers Security Event ID 4624 with LogonType=3, AuthenticationPackageName=NTLM (proving the service account authenticated via raw NTLM hash challenge-response rather than Kerberos), and TargetUserName=svc_sql_prod, followed milliseconds later by System Event ID 7045 installing remote service SqlHealthDiag to run an encoded PowerShell payload as SYSTEM. Defenders break this kill chain at both detection and prevention layers: SIEM rules correlate Event ID 4769 (0x17 non-$ services) with abnormal service-account NTLM network logons from user workstations, while Group Policy disables RC4-HMAC in favor of AES256-CTS-HMAC-SHA1-96 (0x12, enforcing strong salted Kerberos encryption that resists offline cracking) and migrates static service accounts to 120-character auto-rotated Group Managed Service Accounts (gMSAs) bound by Authentication Policy Silos.',
      diagramAlignment:
        'Follow Step #4 / Link #4 as Node 4 (Offline GPU Rig) pivots into Node 5 (FIN-SQL01.corp.local) over SMB/445 while Node 6 (SIEM & gMSA Guard) flags EID 4624/7045 and enforces AES-256 gMSA protection.',
      detectionAndEvidence:
        'Correlate Security Event ID 4624 (LogonType 3 with AuthenticationPackageName=NTLM for svc_* accounts originating from standard user workstations) alongside System Event ID 7045 remote service installations on SQL servers, and remediate permanently via AES-256 Kerberos enforcement and gMSA Authentication Policy Silos.',
    },
  ],
};
