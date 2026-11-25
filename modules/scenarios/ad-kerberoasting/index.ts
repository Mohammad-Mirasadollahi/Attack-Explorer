import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'ad-kerberoasting',
  code: 'T1558.003',
  name: 'Active Directory Kerberoasting & Pass-the-Hash Lateral Movement',
  shortSubtitle: 'SIEM Log Analysis · Windows Security Event IDs 4769, 4624 & 7045',
  category: 'ACTIVE_DIRECTORY',
  severity: 'HIGH',
  primaryMitrePhase: 5,
  overview: 'In Kerberoasting, an attacker with any standard domain user account queries Active Directory for Service Principal Names (SPNs) and requests Kerberos TGS service tickets downgraded to RC4-HMAC encryption (logged as Security Event ID 4769 with TicketEncryptionType 0x17). Because the TGS is encrypted with the service account NTLM password hash, the attacker cracks it offline with Hashcat and moves laterally to the server via SMB Pass-the-Hash (Event ID 4624 LogonType 3 & Event ID 7045).',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1558.003 (Kerberoasting) · T1550.002 (Pass-the-Hash)' },
    { term: 'WINDOWS EVENT IDS', value: 'Event ID 4769 (TGS Request), 4624 (Logon), 7045 (New Service)' },
    { term: 'KEY LOG INDICATOR', value: 'TicketEncryptionType = 0x17 (RC4-HMAC) & TicketOptions = 0x40810000' },
    { term: 'TARGET SPN ACCOUNT', value: 'svc_mssql (SPN: MSSQLSvc/sql01.corp.local:1433)' },
  ],
  nodes: [
    {
      id: 'ws_compromised',
      label: 'WS-FINANCE-04',
      sublabel: '10.10.20.45 (Foothold)',
      role: 'victim_host',
      x: 18,
      y: 55,
      details: {
        osOrType: 'Windows 11 Enterprise',
        pidOrPort: 'User: CORP\\m.davis (Standard User)',
        privilege: 'Domain User',
        artifacts: ['Rubeus.exe kerberoast /rc4opsec', 'Impacket psexec.py'],
        description: 'Initial compromised workstation where the attacker runs Rubeus to request RC4-encrypted Kerberos service tickets.' } },
    {
      id: 'dc01',
      label: 'DC01.corp.local',
      sublabel: '10.10.1.5 (KDC / AD)',
      role: 'domain_controller',
      x: 50,
      y: 26,
      details: {
        osOrType: 'Windows Server 2022 Domain Controller',
        pidOrPort: 'TCP/88 (Kerberos) & TCP/389 (LDAP)',
        privilege: 'Tier 0 Domain Controller',
        artifacts: ['Security Event ID 4769', 'EncryptionType: 0x17 (RC4-HMAC)'],
        description: 'Active Directory Key Distribution Center (KDC) issuing the TGS ticket and logging Windows Security Event ID 4769.' } },
    {
      id: 'sql_server',
      label: 'SQL01.corp.local',
      sublabel: '10.10.5.20 (Target Server)',
      role: 'server',
      x: 56,
      y: 70,
      details: {
        osOrType: 'Windows Server 2022 · MS SQL',
        pidOrPort: 'TCP/445 (SMB) · Local Admin: svc_mssql',
        privilege: 'High Value Asset',
        artifacts: ['Event ID 4624 (LogonType 3, NtLmSsp)', 'Event ID 7045 (Service Installed)'],
        description: 'Database server where svc_mssql holds local administrator rights, targeted via SMB lateral movement.' } },
    {
      id: 'siem_splunk',
      label: 'SIEM Log Collector',
      sublabel: 'Winlogbeat / Splunk',
      role: 'firewall_siem',
      x: 84,
      y: 48,
      details: {
        osOrType: 'Central SIEM Correlation Engine',
        pidOrPort: 'Windows Security & System Channels',
        privilege: 'SOC Monitoring',
        artifacts: ['Rule: Kerberoasting 0x17 Downgrade', 'Rule: NTLM Lateral Movement + Service Creation'],
        description: 'SIEM platform correlating Event 4769 on DC01 with Event 4624 and 7045 on SQL01 to reconstruct the attack chain.' } },
  ],
  processTree: [
    {
      pid: 3920,
      ppid: 2104,
      name: 'Rubeus.exe',
      commandLine: 'Rubeus.exe kerberoast /spn:MSSQLSvc/sql01.corp.local:1433 /nowrap',
      user: 'CORP\\m.davis',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: ['ldap_search_ext_s("(servicePrincipalName=*)")', 'AcquireCredentialsHandle', 'InitializeSecurityContext'] },
    {
      pid: 628,
      ppid: 512,
      name: 'services.exe (SQL01)',
      commandLine: 'C:\\Windows\\system32\\services.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 3,
      apiCalls: ['CreateServiceW', 'StartServiceW'] },
    {
      pid: 5190,
      ppid: 628,
      name: 'PSEXESVC.exe',
      commandLine: 'C:\\Windows\\PSEXESVC.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['CreateNamedPipeW', 'CreateProcessAsUserW("cmd.exe")'] },
  ],
  stages: [
    {
      index: 1,
      title: 'REQUEST RC4-DOWNGRADED KERBEROS TGS (EVENT 4769)',
      subtitle: 'TicketEncryptionType = 0x17 logged on Domain Controller',
      description: 'From WS-FINANCE-04, the attacker runs Rubeus to request a Kerberos TGS ticket for SPN MSSQLSvc/sql01.corp.local:1433. While modern Active Directory environments default to AES256 (0x12), the attacker forces an encryption downgrade to RC4-HMAC (0x17) for fast offline cracking. DC01 records this in Windows Security Event ID 4769.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1558.003',
      mitreTechniqueName: 'Steal or Forge Kerberos Tickets: Kerberoasting',
      activeNodeIds: ['ws_compromised', 'dc01', 'siem_splunk'],
      compromisedNodeIds: ['ws_compromised'],
      keySpecs: [
        { term: 'EVENT ID', value: 'Security Event ID 4769 (A Kerberos service ticket was requested)' },
        { term: 'ENCRYPTION TYPE', value: '0x17 (RC4-HMAC) — Anomaly vs 0x12 (AES256)' },
        { term: 'SERVICE NAME', value: 'svc_mssql / MSSQLSvc/sql01.corp.local:1433' },
      ] },
    {
      index: 2,
      title: 'OFFLINE CRACKING & SMB LOGON (EVENT 4624)',
      subtitle: 'Network Logon (Type 3) from workstation to SQL01',
      description: 'The attacker cracks the $krb5tgs$23$ hash offline using Hashcat (-m 13100) and recovers the credentials/NTLM hash for svc_mssql. They then authenticate over SMB (TCP/445) from WS-FINANCE-04 to SQL01. SQL01 logs Event ID 4624 (LogonType = 3) originating from a finance workstation IP—a clear behavioral anomaly for a database service account.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1550.002',
      mitreTechniqueName: 'Use Alternate Authentication Material: Pass the Hash',
      activeNodeIds: ['ws_compromised', 'sql_server', 'siem_splunk'],
      compromisedNodeIds: ['ws_compromised', 'sql_server'],
      keySpecs: [
        { term: 'LOGON EVENT', value: 'Security Event ID 4624 (LogonType = 3 Network)' },
        { term: 'TARGET ACCOUNT', value: 'CORP\\svc_mssql' },
        { term: 'SOURCE IP', value: '10.10.20.45 (WS-FINANCE-04)' },
      ] },
    {
      index: 3,
      title: 'REMOTE SERVICE EXECUTION VIA PSEXEC (EVENT 7045)',
      subtitle: 'Service Control Manager logs new service installation on SQL01',
      description: 'To achieve code execution on SQL01, the attacker uses PsExec/Impacket over SMB: uploading a service binary to ADMIN$ and instructing the Windows Service Control Manager (SCM) to register and start a new service running as NT AUTHORITY\\SYSTEM. This generates System Event ID 7045 and Security Event ID 4697.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1543.003',
      mitreTechniqueName: 'Create or Modify System Process: Windows Service',
      activeNodeIds: ['sql_server', 'siem_splunk'],
      compromisedNodeIds: ['ws_compromised', 'sql_server'],
      keySpecs: [
        { term: 'SYSTEM EVENT', value: 'Event ID 7045 (A service was installed in the system)' },
        { term: 'SERVICE FILE', value: '%SystemRoot%\\PSEXESVC.exe (or cmd.exe /c ...)' },
        { term: 'PRIVILEGE GAINED', value: 'NT AUTHORITY\\SYSTEM on SQL01' },
      ] },
  ],
  telemetry: [
    {
      id: 'ad-1',
      no: 1,
      stageIndex: 1,
      timestamp: '09:41:12.310',
      sourceNodeId: 'ws_compromised',
      targetNodeId: 'dc01',
      sourceLabel: '10.10.20.45 (m.davis)',
      targetLabel: 'DC01.corp.local:88',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4769',
      shortAction: 'TGS RC4 (0x17)',
      info: 'ServiceName=svc_mssql TicketEncryptionType=0x17 TicketOptions=0x40810000',
      sizeOrCode: 'Event 4769',
      severity: 'HIGH',
      mitreId: 'T1558.003',
      explanation: 'Windows Security Event ID 4769 on DC01 captures user m.davis requesting a Kerberos TGS for svc_mssql with TicketEncryptionType 0x17 (RC4-HMAC). Hunting for 0x17 on non-machine accounts is the primary SIEM rule for Kerberoasting.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4769</EventID>
    <Computer>DC01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">m.davis@CORP.LOCAL</Data>
    <Data Name="ServiceName">svc_mssql</Data>
    <Data Name="IpAddress">::ffff:10.10.20.45</Data>
    <Data Name="TicketOptions">0x40810000</Data>
    <Data Name="TicketEncryptionType">0x17</Data>
    <Data Name="Status">0x0</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Kerberoasting RC4 Ticket Encryption Downgrade (Event 4769)',
        ruleCode: `title: Kerberoasting Activity - RC4 Ticket Requested
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4769
    TicketEncryptionType: '0x17'
    Status: '0x0'
  filter_machine_accounts:
    ServiceName|endswith: '$'
    ServiceName: 'krbtgt'
  condition: selection and not filter_machine_accounts
level: high`,
        mitigation: 'Migrate service accounts to Group Managed Service Accounts (gMSA) and enforce AES-only Kerberos encryption on service accounts.' } },
    {
      id: 'ad-2',
      no: 2,
      stageIndex: 2,
      timestamp: '09:44:05.820',
      sourceNodeId: 'ws_compromised',
      targetNodeId: 'sql_server',
      sourceLabel: '10.10.20.45 (WS-FINANCE)',
      targetLabel: '10.10.5.20 (SQL01)',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4624',
      shortAction: 'SMB LOGON (3)',
      info: 'LogonType=3 TargetUserName=svc_mssql AuthenticationPackageName=NtLmSsp',
      sizeOrCode: 'Event 4624',
      severity: 'HIGH',
      mitreId: 'T1550.002',
      explanation: 'Event ID 4624 on SQL01 records a Type 3 (Network) logon for svc_mssql using NTLM authentication (NtLmSsp) originating from workstation 10.10.20.45.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4624</EventID>
    <Computer>SQL01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">svc_mssql</Data>
    <Data Name="TargetDomainName">CORP</Data>
    <Data Name="LogonType">3</Data>
    <Data Name="LogonProcessName">NtLmSsp</Data>
    <Data Name="AuthenticationPackageName">NTLM</Data>
    <Data Name="WorkstationName">WS-FINANCE-04</Data>
    <Data Name="IpAddress">10.10.20.45</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Service Account Network Logon from Non-Server Workstation',
        ruleCode: `title: Service Account Lateral Movement via NTLM
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4624
    LogonType: 3
    TargetUserName|startswith: 'svc_'
    AuthenticationPackageName: 'NTLM'
  condition: selection
level: high`,
        mitigation: 'Add privileged accounts to the Active Directory Protected Users security group (blocking NTLM and RC4) and restrict allowed Logon Workstations.' } },
    {
      id: 'ad-3',
      no: 3,
      stageIndex: 3,
      timestamp: '09:44:06.190',
      sourceNodeId: 'sql_server',
      targetNodeId: 'siem_splunk',
      sourceLabel: 'SQL01.corp.local',
      targetLabel: 'System Event Log',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'System EID 7045',
      shortAction: 'NEW SERVICE',
      info: 'ServiceName="PSEXESVC" ImagePath="%SystemRoot%\\PSEXESVC.exe" Account="LocalSystem"',
      sizeOrCode: 'Event 7045',
      severity: 'CRITICAL',
      mitreId: 'T1543.003',
      explanation: 'System Event ID 7045 immediately following a Type 3 SMB logon confirms remote service installation (PsExec/Impacket) executing as LocalSystem.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Service Control Manager"/>
    <EventID>7045</EventID>
    <Computer>SQL01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ServiceName">PSEXESVC</Data>
    <Data Name="ImagePath">%SystemRoot%\\PSEXESVC.exe</Data>
    <Data Name="ServiceType">user mode service</Data>
    <Data Name="StartType">demand start</Data>
    <Data Name="AccountName">LocalSystem</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'PsExec / SMBExec Remote Service Installation (Event 7045)',
        ruleCode: `title: PsExec Service Installation Detected
logsource:
  product: windows
  service: system
detection:
  selection:
    EventID: 7045
    ImagePath|contains:
      - 'PSEXESVC'
      - 'cmd.exe /c'
      - 'powershell'
  condition: selection
level: critical`,
        mitigation: 'Enforce network micro-segmentation blocking SMB (TCP/445) from user workstations to servers and monitor Event ID 7045/4697.' } },
  ] };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ad-kerberoasting',
    briefing: {
      headline: 'Scenario Briefing: Active Directory Kerberoasting (MITRE T1558.003): Requesting Service Tickets to Crack Offline',
      storyAnalogy:
        'Imagine a theme park where any visitor with a basic entry wristband is allowed to walk up to the ticket booth and ask for a sealed VIP voucher to the SQL Rollercoaster. The booth seals that voucher using the rollercoaster manager’s secret password. Instead of riding the coaster, the attacker takes the sealed voucher home to their basement and tries millions of passwords per second until the seal pops open, without a single guard at the park knowing they are guessing.',
      plainSummary:
        'In this scenario (T1558.003, Active Directory Kerberoasting & Pass-the-Hash Lateral Movement) at 10.10.1, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: enumerating SPNs, then offline Hashcat Cracking, then remote Service Installation. Steps #1–#3 walk that chain end-to-end by covering Enumerating SPNs, then Offline Hashcat Cracking, then Remote Service Installation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Windows Security Event 4769 correlated across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③/④ (Compromised Workstation WS-FINANCE-04 10.10.20.45 / Rubeus.exe PID 3920), follow Step #1 (#1→) requesting the RC4 Kerberos TGS ticket from Node ⑤ (Domain Controller DC01.corp.local 10.10.1.5:88), trace Step #2 (#2→) authenticating with the cracked svc_mssql account over SMB (TCP/445) to SQL01.corp.local (10.10.5.20), and watch Step #3 (#3→) install and run PSEXESVC.exe (PID 5190) as SYSTEM monitored by Node ⑥ (SIEM Log Collector).',
      documentedAdvisory: 'MITRE ATT&CK T1558.003 · T1550.002 · T1569.002 · Windows Security EventID 4769 / 4624 / System EventID 7045',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1558.003',
        plainTitle: 'Enumerating SPNs & Requesting an RC4-Downgraded Kerberos TGS Ticket (Event ID 4769)',
        storyAnalogy:
          'The visitor opens the park’s public phonebook (LDAP), finds the SQL attraction run by a human manager (svc_mssql), and asks the central ticket booth (DC01.corp.local:88) for a voucher sealed with an older, fast-to-crack wax stamp (0x17 RC4-HMAC) instead of modern armor (AES-256).',
        simpleExplanation:
          'From the compromised workstation WS-FINANCE-04 (10.10.20.45) using standard domain account CORP\\m.davis, the attacker runs Rubeus.exe (PID 3920, PPID 2104: Rubeus.exe kerberoast /spn:MSSQLSvc/sql01.corp.local:1433 /nowrap). After querying LDAP (TCP/389) on DC01.corp.local (10.10.1.5) via ldap_search_ext_s("(servicePrincipalName=*)") to locate MSSQLSvc/sql01.corp.local:1433, Rubeus sends a Kerberos TGS-REQ (TCP/88) with TicketOptions = 0x40810000 requesting encryption type 0x17 (RC4-HMAC, a legacy cipher that encrypts the ticket directly with svc_mssql’s NTLM password hash, making it thousands of times faster to brute-force offline than AES-256 / 0x12).',
        howItWorksInPractice:
          'By design in the Kerberos protocol, the Key Distribution Center (KDC) on DC01.corp.local (10.10.1.5) does not check whether CORP\\m.davis has permission to log into SQL01; it immediately encrypts the KRB_TGS_REP service ticket using svc_mssql’s NTLM hash and returns the RC4 ciphertext to Rubeus.exe (PID 3920) on 10.10.20.45 (while logging Windows Security Event ID 4769 with Status = 0x0 and TicketEncryptionType = 0x17).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (WS-FINANCE-04 10.10.20.45 / Rubeus.exe PID 3920) to Node ⑤ (Domain Controller DC01.corp.local 10.10.1.5:88), returning the RC4-encrypted TGS ticket (Event ID 4769, etype 0x17).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4769 on DC01.corp.local: TargetUserName = m.davis@CORP.LOCAL, ServiceName = svc_mssql, ClientAddress = 10.10.20.45, TicketOptions = 0x40810000, and TicketEncryptionType = 0x17 (RC4-HMAC).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.002',
        plainTitle: 'Offline Hashcat Cracking & Lateral SMB Network Logon to SQL01 (Event ID 4624)',
        storyAnalogy:
          'Back in their private workshop, the attacker tests millions of candidate passwords per second against the sealed voucher ($krb5tgs$23$*) until the seal opens, and then walks straight up to the SQL Server’s administration door (SMB TCP/445) wearing the manager’s real badge (svc_mssql).',
        simpleExplanation:
          'The attacker exports the returned RC4 TGS ticket from WS-FINANCE-04 in $krb5tgs$23$* format and cracks it offline using Hashcat (-m 13100, generating zero failed-login alerts on DC01 because every guess runs locally on the attacker’s GPU). Once svc_mssql’s credential is recovered, the attacker initiates a lateral SMB2 network logon (TCP/445) from WS-FINANCE-04 (10.10.20.45) to the target database server SQL01.corp.local (10.10.5.20) using AuthenticationPackageName = NtLmSsp (which SQL01 accepts and records as Windows Security Event ID 4624 with LogonType = 3).',
        howItWorksInPractice:
          'Because svc_mssql was granted local administrator privileges on SQL01.corp.local (10.10.5.20), completing the NTLMSSP network authentication handshake over TCP/445 returns an authenticated administrative SMB session (granting read/write access to \\\\sql01.corp.local\\ADMIN$ and the remote Service Control Manager pipe \\\\sql01.corp.local\\pipe\\svcctl). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) shows Node ③ (WS-FINANCE-04 10.10.20.45) authenticating over SMB2 (TCP/445) as svc_mssql to Node ⑤ (SQL01.corp.local 10.10.5.20), returning an authenticated session and logging Event ID 4624 (LogonType = 3).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4624 on SQL01.corp.local: TargetUserName = svc_mssql, LogonType = 3 (Network), AuthenticationPackageName = NtLmSsp, IpAddress = 10.10.20.45.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1569.002',
        plainTitle: 'Remote Service Installation & SYSTEM Execution on SQL01 via PsExec (Event ID 7045)',
        storyAnalogy:
          'Now inside the SQL Server’s admin office, the intruder drops an automated worker (PSEXESVC.exe) into the building’s master service directory and tells the building controller (services.exe) to start it with full SYSTEM authority.',
        simpleExplanation:
          'Using the authenticated SMB session on SQL01.corp.local (10.10.5.20), the attacker uploads PSEXESVC.exe to \\\\sql01.corp.local\\ADMIN$\\PSEXESVC.exe and invokes CreateServiceW and StartServiceW on the remote Service Control Manager (services.exe, PID 628, PPID 512) to install and start a new Windows service named PSEXESVC (ImagePath = %SystemRoot%\\PSEXESVC.exe). Windows logs System Event ID 7045 (A service was installed in the system) as services.exe (PID 628) spawns PSEXESVC.exe (PID 5190) under NT AUTHORITY\\SYSTEM (completing privileged takeover of the database server).',
        howItWorksInPractice:
          'When PsExec calls StartServiceW over the svcctl RPC pipe, services.exe (PID 628) starts C:\\Windows\\PSEXESVC.exe (PID 5190) as LocalSystem (NT AUTHORITY\\SYSTEM), which calls CreateNamedPipeW and CreateProcessAsUserW("cmd.exe") (returning an interactive SYSTEM command shell over encrypted SMB named pipes back to the operator on 10.10.20.45). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) executes PSEXESVC.exe (PID 5190, spawned by services.exe PID 628) on Node ⑤ (SQL01.corp.local 10.10.5.20) and reports System Event ID 7045 to Node ⑥ (SIEM Log Collector).',
        detectionAndEvidence:
          'Documented in Windows System EventID 7045 (ServiceName = PSEXESVC, ImagePath = %SystemRoot%\\PSEXESVC.exe, Account = LocalSystem) & process tree (PSEXESVC.exe PID 5190 spawned by services.exe PID 628).',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a grand hotel where any ordinary guest can walk up to the concierge desk and request a wax-sealed banquet voucher for the executive kitchen, sealed with the head chef personal passcode. A clever guest asks the concierge to seal the voucher with an outdated weak wax cipher, walks back to their private room to crack the chef passcode offline at leisure, and then marches straight into the executive kitchen to install a permanent back-door helper.',
      storyMappings: [
        {
          storyTerm: 'Ordinary guest requesting a weak wax-sealed banquet voucher',
          technicalTerm: 'Standard domain user requesting an RC4-downgraded (0x17) Kerberos TGS ticket',
          tone: 'amber',
        },
        {
          storyTerm: 'Cracking the head chef passcode privately offline',
          technicalTerm: 'Exporting $krb5tgs$23$* hash and offline Hashcat brute-forcing of svc_mssql',
          tone: 'sky',
        },
        {
          storyTerm: 'Walking into the executive kitchen with the chef pass',
          technicalTerm: 'Lateral SMB LogonType 3 authentication to SQL01.corp.local as svc_mssql',
          tone: 'rose',
        },
        {
          storyTerm: 'Installing a permanent back-door helper in the kitchen',
          technicalTerm: 'PsExec remote PSEXESVC.exe service installation executing as SYSTEM',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing at the hotel concierge desk with nothing more than a regular guest room key, the intruder browses the public roster of special dining-hall accounts and asks for an executive kitchen pass sealed with an older, softer wax stamp that is easy to break later.',
        storyMappings: [
          {
            storyTerm: 'Regular guest room key',
            technicalTerm: 'Standard unprivileged domain user account (CORP\\m.davis)',
            tone: 'amber',
          },
          {
            storyTerm: 'Public roster of special dining-hall accounts',
            technicalTerm: 'Active Directory LDAP query enumerating Service Principal Names (SPNs)',
            tone: 'sky',
          },
          {
            storyTerm: 'Executive kitchen pass with an older soft wax stamp',
            technicalTerm: 'Kerberos TGS ticket for svc_mssql requested with TicketEncryptionType 0x17 (RC4-HMAC)',
            tone: 'rose',
          },
          {
            storyTerm: 'Hotel concierge ledger logging the odd stamp',
            technicalTerm: 'Domain Controller Windows Security EventID 4769 recording RC4 downgrade',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Windows Security EventID 4769 (Kerberos Service Ticket Operations on the Domain Controller) where TicketEncryptionType equals 0x17 (RC4-HMAC downgrade instead of AES-256) and ServiceName targets a high-privilege user service account such as svc_mssql from workstation 10.10.20.45 (identifying classic Kerberoasting ticket harvesting).',
      },
      2: {
        storyAnalogy:
          'Retreating to a private room far away from hotel cameras, the intruder runs thousands of rapid key guesses against the soft wax seal until the head chef real password pops open, then uses that genuine password to unlock the kitchen server room over the internal hallway.',
        storyMappings: [
          {
            storyTerm: 'Running rapid guesses privately away from cameras',
            technicalTerm: 'Offline Hashcat GPU cracking of exported $krb5tgs$23$* RC4 ticket hash',
            tone: 'amber',
          },
          {
            storyTerm: 'Head chef real password unlocked',
            technicalTerm: 'Recovered cleartext password or NTLM hash for service account svc_mssql',
            tone: 'sky',
          },
          {
            storyTerm: 'Unlocking the kitchen server room down the hall',
            technicalTerm: 'Lateral SMB network authentication to SQL01.corp.local (10.10.5.20)',
            tone: 'rose',
          },
          {
            storyTerm: 'Kitchen door ledger logging the network arrival',
            technicalTerm: 'Windows Security EventID 4624 (LogonType 3, NtLmSsp) on SQL01',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Windows Security EventID 4624 (Successful Account Logon) on SQL01.corp.local recording LogonType 3 (Network logon), AuthenticationPackageName NtLmSsp, and TargetUserName svc_mssql originating from workstation 10.10.20.45 (flagging interactive/lateral abuse of a database service account).',
      },
      3: {
        storyAnalogy:
          'Inside the unlocked kitchen corridor, the intruder slides an automated assistant package onto the staff supply shelf and registers it with the hotel shift foreman, launching a full master-keyed command console inside the kitchen vault.',
        storyMappings: [
          {
            storyTerm: 'Staff supply shelf',
            technicalTerm: 'Administrative SMB share \\\\sql01.corp.local\\ADMIN$',
            tone: 'amber',
          },
          {
            storyTerm: 'Automated assistant package',
            technicalTerm: 'Uploaded PSEXESVC.exe service binary dropped via PsExec',
            tone: 'sky',
          },
          {
            storyTerm: 'Registering with the hotel shift foreman',
            technicalTerm: 'Remote Service Control Manager installation logged as System EventID 7045',
            tone: 'rose',
          },
          {
            storyTerm: 'Full master-keyed command console',
            technicalTerm: 'Interactive NT AUTHORITY\\SYSTEM shell executed on SQL01',
            tone: 'emerald',
          },
        ],
      },
    },
  };
