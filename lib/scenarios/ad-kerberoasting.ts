import { AttackScenario } from './types';

export const AD_KERBEROASTING_SCENARIO: AttackScenario = {
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
        pidOrPort: 'User: CORP\\m.karimi (Standard User)',
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
      user: 'CORP\\m.karimi',
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
      sourceLabel: '10.10.20.45 (m.karimi)',
      targetLabel: 'DC01.corp.local:88',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'WinSec EID 4769',
      shortAction: 'TGS RC4 (0x17)',
      info: 'ServiceName=svc_mssql TicketEncryptionType=0x17 TicketOptions=0x40810000',
      sizeOrCode: 'Event 4769',
      severity: 'HIGH',
      mitreId: 'T1558.003',
      explanation: 'Windows Security Event ID 4769 on DC01 captures user m.karimi requesting a Kerberos TGS for svc_mssql with TicketEncryptionType 0x17 (RC4-HMAC). Hunting for 0x17 on non-machine accounts is the primary SIEM rule for Kerberoasting.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"/>
    <EventID>4769</EventID>
    <Computer>DC01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">m.karimi@CORP.LOCAL</Data>
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
