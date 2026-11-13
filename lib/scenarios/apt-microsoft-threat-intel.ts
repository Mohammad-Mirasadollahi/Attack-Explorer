import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT SCENARIOS — MICROSOFT THREAT INTELLIGENCE & CISA
 * ============================================================================
 * Strictly extracted from official technical threat research reports:
 * 1. Microsoft Threat Intelligence & CISA AA24-038A: Volt Typhoon (Bronze Silhouette) LOTL
 * 2. Microsoft Threat Intelligence: Midnight Blizzard (APT29) OAuth App & EWS Intrusion
 * 3. Microsoft Threat Intelligence & Kaspersky: Salt Typhoon (GhostEmperor) Demodex & Telecom
 * 4. Microsoft Threat Intelligence: Forest Blizzard (APT28) GooseEgg (CVE-2022-38028)
 * 5. Microsoft Threat Intelligence & Unit 42: Star Blizzard / Storm-0539 Evilginx AiTM
 */

export const MS_VOLT_TYPHOON_LOTL_SCENARIO: AttackScenario = {
  id: 'ms-volt-typhoon-lotl',
  code: 'T1003.003',
  name: 'Microsoft & CISA — Volt Typhoon: Living-off-the-Land ntdsutil IFM & netsh Portproxy',
  shortSubtitle: 'Microsoft Threat Intel / CISA AA24-038A · KV-Botnet Edge Relay, WMIC, ntds.dit & netsh',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by Microsoft Threat Intelligence and Joint CISA/NSA/FBI Advisory AA24-038A, Volt Typhoon (Bronze Silhouette) maintains multi-year stealth across critical infrastructure by relying almost exclusively on built-in Windows Living-off-the-Land Binaries (LOLBins). Traffic originates from compromised SOHO routers (KV-Botnet), executes wmic process call create for lateral discovery, creates Volume Shadow Copies via ntdsutil / vssadmin to extract ntds.dit offline, and chains internal hops via netsh interface portproxy.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence & CISA Joint Advisory AA24-038A (Volt Typhoon)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1003.003 (NTDS) · T1047 (WMI) · T1090.001 (Internal Proxy: netsh portproxy)',
    },
    {
      term: 'LOTL BINARIES',
      value: 'wmic.exe, ntdsutil.exe, vssadmin.exe, esentutl.exe, netsh.exe',
    },
    {
      term: 'KEY LOG ARTIFACT',
      value: 'ntdsutil "ac i ntds" "ifm" "create full" & netsh interface portproxy add v4tov4',
    },
  ],
  nodes: [
    {
      id: 'kv_botnet_router',
      label: 'KV-Botnet SOHO Edge Node',
      sublabel: '198.51.100.14 (Compromised SOHO Router)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Compromised SOHO Router Proxy (KV-Botnet)',
        pidOrPort: 'SOCKS5 / TLS Relay -> Fortinet / Ivanti VPN',
        privilege: 'Anonymized Edge Relay',
        artifacts: [
          'Geolocated within Target Region to Evade Geo-IP Blocks',
          'Valid VPN Credentials Harvested from Edge Appliance',
        ],
        description:
          'Compromised small-office/home-office router node used by Volt Typhoon to blend inbound C2 traffic with local ISP address space.',
      },
    },
    {
      id: 'jump_srv_lotl',
      label: 'IT Jump Server (Netsh Proxy)',
      sublabel: '10.10.15.22 · SRV-MGMT-01',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 Management Host',
        pidOrPort: 'netsh portproxy TCP :8443 -> 10.10.0.5:3389',
        privilege: 'Domain Administrator Session',
        artifacts: [
          'HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp',
          'wmic /node:10.10.0.5 process call create',
        ],
        description:
          'Internal management server configured by Volt Typhoon with netsh interface portproxy rules to relay traffic into restricted OT/AD segments.',
      },
    },
    {
      id: 'ntdsutil_ifm_proc',
      label: 'ntdsutil.exe & vssadmin.exe',
      sublabel: 'PID 6412 (IFM Snapshot on DC01)',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Native Windows AD Maintenance Utilities (LOLBins)',
        pidOrPort: 'PID 6412 · cmd.exe /c ntdsutil "ac i ntds" "ifm"',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'C:\\Windows\\Temp\\Active Directory\\ntds.dit',
          'C:\\Windows\\Temp\\registry\\SYSTEM',
        ],
        description:
          'Native ntdsutil.exe process invoked via WMI to generate an Install From Media (IFM) dump of ntds.dit and the SYSTEM registry hive.',
      },
    },
    {
      id: 'dc01_tier0_ad',
      label: 'Domain Controller (CORP-DC01)',
      sublabel: '10.10.0.5 (NTDS.dit & KDC)',
      role: 'domain_controller',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Windows Server 2022 Domain Controller',
        pidOrPort: 'TCP/135 (RPC/WMI) & C:\\Windows\\NTDS\\ntds.dit',
        privilege: 'Tier-0 Domain Controller',
        artifacts: [
          'ESENT Event ID 325 / 326 / 327 (New ntds.dit Database Attach)',
          'Sysmon EID 1 (WmiPrvSE.exe -> cmd.exe -> ntdsutil.exe)',
        ],
        description:
          'Primary Domain Controller from which Volt Typhoon extracts all domain user and krbtgt password hashes for offline cracking.',
      },
    },
    {
      id: 'defender_sentinel_siem',
      label: 'Microsoft Sentinel & MDE',
      sublabel: 'Sysmon EID 1, 13 & ESENT 325',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Microsoft Sentinel & Defender for Endpoint',
        pidOrPort: 'Sysmon EID 1, 13 (PortProxy) & Application Log',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Rule: Volt Typhoon ntdsutil IFM & vssadmin Shadow Copy',
          'Rule: netsh interface portproxy Registry Modification',
        ],
        description:
          'Correlates WmiPrvSE child processes, ESENT database copy events, and PortProxy registry modifications.',
      },
    },
  ],
  processTree: [
    {
      pid: 2816,
      ppid: 892,
      name: 'WmiPrvSE.exe',
      commandLine: 'C:\\Windows\\system32\\wbem\\wmiprvse.exe -secured -Embedding',
      user: 'NT AUTHORITY\\NETWORK SERVICE',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['IWbemServices::ExecMethod("Win32_Process")', 'CreateProcessAsUserW'],
    },
    {
      pid: 6412,
      ppid: 2816,
      name: 'ntdsutil.exe',
      commandLine:
        'ntdsutil.exe "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\tmp_ad" q q',
      user: 'CORP\\admin_svc',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'IVssBackupComponents::AddToSnapshotSet',
        'JetCompactW("ntds.dit")',
        'RegSaveKeyW("SYSTEM")',
      ],
    },
    {
      pid: 6890,
      ppid: 4100,
      name: 'netsh.exe',
      commandLine:
        'netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8443 connectaddress=10.10.0.5 connectport=3389',
      user: 'CORP\\admin_svc',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'RegSetValueExW("HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'HANDS-ON-KEYBOARD WMI DISCOVERY & LATERAL EXEC',
      subtitle: 'wmic process call create across Domain Controller and management hosts',
      description:
        'Following initial access through a perimeter appliance, Volt Typhoon operators avoid dropping custom malware and instead use wmic.exe to execute reconnaissance commands (whoami, net group, ipconfig, nbtstat) remotely via WmiPrvSE.exe on target servers.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1047',
      mitreTechniqueName: 'Windows Management Instrumentation',
      activeNodeIds: ['kv_botnet_router', 'jump_srv_lotl', 'dc01_tier0_ad'],
      compromisedNodeIds: ['jump_srv_lotl'],
      keySpecs: [
        { term: 'COMMAND', value: 'wmic /node:10.10.0.5 process call create "cmd.exe /c ..."' },
        { term: 'PARENT PROCESS', value: 'C:\\Windows\\System32\\wbem\\WmiPrvSE.exe' },
        { term: 'ADVISORY REF', value: 'CISA / NSA / FBI / Microsoft AA24-038A' },
      ],
    },
    {
      index: 2,
      title: 'OFFLINE NTDS.DIT EXTRACTION VIA NTDSUTIL IFM',
      subtitle: 'Creating Volume Shadow Copy and dumping ntds.dit + SYSTEM hive',
      description:
        'To harvest every Active Directory password hash (including krbtgt) without touching LSASS memory directly, Volt Typhoon invokes ntdsutil.exe with the Install From Media (ifm) command (or vssadmin create shadow), copying ntds.dit and HKLM\\SYSTEM to a staging folder and clearing Windows Event Logs via wevtutil.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.003',
      mitreTechniqueName: 'OS Credential Dumping: NTDS',
      activeNodeIds: ['jump_srv_lotl', 'ntdsutil_ifm_proc', 'dc01_tier0_ad', 'defender_sentinel_siem'],
      compromisedNodeIds: ['jump_srv_lotl', 'ntdsutil_ifm_proc', 'dc01_tier0_ad'],
      keySpecs: [
        { term: 'IFM COMMAND', value: 'ntdsutil "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\tmp_ad" q q' },
        { term: 'APPLICATION LOG', value: 'ESENT Event IDs 325, 326, 327 (Database created/detached)' },
        { term: 'EXTRACTED FILES', value: 'ntds.dit + registry\\SYSTEM + registry\\SECURITY' },
      ],
    },
    {
      index: 3,
      title: 'MULTI-HOP INTERNAL RELAY VIA NETSH PORTPROXY',
      subtitle: 'Configuring persistent TCP port forwarding in Windows Registry',
      description:
        'To maintain covert access into air-gapped or segmented OT/Active Directory subnets without installing third-party tunneling tools, Volt Typhoon runs netsh interface portproxy add v4tov4, registering persistent kernel-level IP Helper (iphlpsvc) TCP relays.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1090.001',
      mitreTechniqueName: 'Proxy: Internal Proxy',
      activeNodeIds: ['jump_srv_lotl', 'dc01_tier0_ad', 'defender_sentinel_siem'],
      compromisedNodeIds: ['jump_srv_lotl', 'ntdsutil_ifm_proc', 'dc01_tier0_ad'],
      keySpecs: [
        { term: 'LOLBIN COMMAND', value: 'netsh interface portproxy add v4tov4 listenport=8443 connectport=3389' },
        { term: 'REGISTRY KEY', value: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp' },
        { term: 'SERVICE HOST', value: 'iphlpsvc (IP Helper Service)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ms-vt-1',
      no: 1,
      stageIndex: 1,
      timestamp: '01:12:04.210',
      sourceNodeId: 'jump_srv_lotl',
      targetNodeId: 'dc01_tier0_ad',
      sourceLabel: 'SRV-MGMT-01 (wmic)',
      targetLabel: 'CORP-DC01 (WmiPrvSE)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'WMIC REMOTE EXEC',
      info: 'ParentImage=WmiPrvSE.exe CommandLine="cmd.exe /Q /c ntdsutil \\"ac i ntds\\" \\"ifm\\""',
      sizeOrCode: 'PID 6412',
      severity: 'CRITICAL',
      mitreId: 'T1047',
      explanation:
        'WmiPrvSE.exe spawning cmd.exe and ntdsutil.exe on a Domain Controller is a signature Volt Typhoon lateral execution and credential extraction pattern.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>CORP-DC01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6412</Data>
    <Data Name="Image">C:\\Windows\\System32\\ntdsutil.exe</Data>
    <Data Name="CommandLine">ntdsutil.exe "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\tmp_ad" q q</Data>
    <Data Name="ParentProcessId">2816</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\wbem\\WmiPrvSE.exe</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Volt Typhoon ntdsutil IFM Active Directory Database Extraction',
        ruleCode: `title: Ntdsutil Install From Media (IFM) NTDS.dit Dump
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    CommandLine|contains|all:
      - 'ntdsutil'
      - 'ifm'
      - 'create'
  condition: selection
level: critical`,
        mitigation:
          'Alert immediately on any ntdsutil.exe, vssadmin.exe, or diskshadow.exe execution on Domain Controllers not tied to a scheduled backup window.',
      },
    },
    {
      id: 'ms-vt-2',
      no: 2,
      stageIndex: 2,
      timestamp: '01:12:09.840',
      sourceNodeId: 'ntdsutil_ifm_proc',
      targetNodeId: 'dc01_tier0_ad',
      sourceLabel: 'ntdsutil.exe',
      targetLabel: 'Application Log (ESENT)',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'ESENT EID 325',
      shortAction: 'NTDS.DIT CREATED',
      info: 'ESENT Event 325: Database engine created a new database C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit',
      sizeOrCode: 'Event 325',
      severity: 'CRITICAL',
      mitreId: 'T1003.003',
      explanation:
        'Even if command-line logs are evaded or cleared, Windows Application Log records ESENT Event ID 325/326/327 whenever ntds.dit is copied or defragmented to a new path.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="ESENT"/>
    <EventID>325</EventID>
    <Channel>Application</Channel>
    <Computer>CORP-DC01.corp.local</Computer>
  </System>
  <EventData>
    <Data>ntdsutil.exe (6412)</Data>
    <Data>C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ESENT Event ID 325/326/327 Suspicious ntds.dit Access',
        ruleCode: `title: Suspicious Access to NTDS.dit via ESENT Database Engine
logsource:
  product: windows
  service: application
detection:
  selection:
    Provider_Name: 'ESENT'
    EventID:
      - 325
      - 326
      - 327
    Data|contains: 'ntds.dit'
  filter_legit:
    Data|contains: 'C:\\Windows\\NTDS\\ntds.dit'
  condition: selection and not filter_legit
level: critical`,
        mitigation:
          'Forward Windows Application channel ESENT events (325, 326, 327) from all Domain Controllers to an immutable SIEM.',
      },
    },
    {
      id: 'ms-vt-3',
      no: 3,
      stageIndex: 3,
      timestamp: '01:16:42.510',
      sourceNodeId: 'jump_srv_lotl',
      targetNodeId: 'defender_sentinel_siem',
      sourceLabel: 'netsh.exe (PID 6890)',
      targetLabel: 'Sysmon EID 13 (Registry)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 13',
      shortAction: 'NETSH PORTPROXY',
      info: 'TargetObject=HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443 Details=10.10.0.5/3389',
      sizeOrCode: 'PortProxy',
      severity: 'HIGH',
      mitreId: 'T1090.001',
      explanation:
        'CISA AA24-038A emphasizes auditing HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp to uncover Volt Typhoon internal relay hops.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>13</EventID>
    <Computer>SRV-MGMT-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="EventType">SetValue</Data>
    <Data Name="Image">C:\\Windows\\System32\\netsh.exe</Data>
    <Data Name="TargetObject">HKLM\\System\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443</Data>
    <Data Name="Details">10.10.0.5/3389</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Volt Typhoon Netsh PortProxy Registry Modification (Sysmon EID 13)',
        ruleCode: `title: Netsh PortProxy Registry Configuration Added
logsource:
  category: registry_set
  product: windows
detection:
  selection:
    TargetObject|contains: '\\Services\\PortProxy\\v4tov4\\tcp\\'
  condition: selection
level: high`,
        mitigation:
          'Disable the IP Helper service (iphlpsvc) where IPv6 transition/PortProxy is unneeded and block lateral WMI/RDP between non-admin tiers.',
      },
    },
  ],
};

export const MS_MIDNIGHT_BLIZZARD_OAUTH_SCENARIO: AttackScenario = {
  id: 'ms-midnight-blizzard-oauth',
  code: 'T1098.003',
  name: 'Microsoft Threat Intel — Midnight Blizzard (APT29): OAuth App Persistence & EWS Exfiltration',
  shortSubtitle: 'Microsoft Threat Intelligence · Legacy Tenant Password Spray, OAuth full_access_as_app & EWS',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Documented by Microsoft Threat Intelligence (January 2024), Midnight Blizzard (APT29 / NOBELIUM / Cozy Bear) executed a low-volume residential-proxy password spray to compromise a legacy non-production test tenant account without MFA. From that foothold, the actor abused an over-privileged legacy OAuth application, registered new malicious OAuth applications in Microsoft Entra ID, granted them the Exchange Online full_access_as_app role, and exfiltrated corporate emails via Exchange Web Services (EWS).',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence — Midnight Blizzard OAuth Application Intrusion Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1110.003 (Password Spraying) · T1098.003 (Additional Cloud Roles) · T1528 (Steal App Token)',
    },
    {
      term: 'OAUTH PERMISSION',
      value: 'Office 365 Exchange Online -> full_access_as_app (Role ID dc890d15-...)',
    },
    {
      term: 'AUDIT LOG CHANNELS',
      value: 'Entra ID AuditLogs (Add service principal, Consent to application) & Exchange EWS',
    },
  ],
  nodes: [
    {
      id: 'nobelium_res_proxy',
      label: 'Midnight Blizzard Proxy Pool',
      sublabel: 'Residential Proxy Network (Low-and-Slow)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Distributed Residential Proxy Infrastructure (SVR / APT29)',
        pidOrPort: 'HTTPS :443 -> login.microsoftonline.com',
        privilege: 'External Nation-State Actor',
        artifacts: [
          'Low-Volume Password Spray (<1 attempt per account per hour)',
          'OAuth Client Credentials Grant Requests',
        ],
        description:
          'Geo-distributed residential proxy network used by Midnight Blizzard to evade IP-based throttling during password spraying and EWS mail collection.',
      },
    },
    {
      id: 'entra_id_tenant',
      label: 'Microsoft Entra ID Control Plane',
      sublabel: 'Legacy Test Tenant & App Registrations',
      role: 'domain_controller',
      x: 44,
      y: 26,
      details: {
        osOrType: 'Cloud Identity & OAuth Authorization Server',
        pidOrPort: 'Graph API / OAuth 2.0 Token Endpoint',
        privilege: 'Application.ReadWrite.All / Directory Role',
        artifacts: [
          'Compromised Account: legacy-test-svc@tenant.onmicrosoft.com (No MFA)',
          'Entra Audit: Add application & Add OAuth2PermissionGrant',
        ],
        description:
          'Entra ID directory where the attacker abused a legacy test OAuth app with elevated directory privileges to create new malicious OAuth service principals.',
      },
    },
    {
      id: 'rogue_oauth_sp',
      label: 'Malicious OAuth Service Principal',
      sublabel: 'AppId: 8c4a... · full_access_as_app',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Entra ID Enterprise Application / Service Principal',
        pidOrPort: 'OAuth2 Client Secret Credential + Bearer JWT',
        privilege: 'Exchange Online full_access_as_app',
        artifacts: [
          'Add service principal credentials (PasswordCredential)',
          'Consent to application (AppRoleAssignment: full_access_as_app)',
        ],
        description:
          'Attacker-created OAuth application consented to the Exchange Online full_access_as_app role, allowing access to any mailbox without user interaction.',
      },
    },
    {
      id: 'exchange_online_ews',
      label: 'Exchange Online (EWS API)',
      sublabel: 'outlook.office365.com/EWS/Exchange.asmx',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Microsoft 365 Exchange Online Mailboxes',
        pidOrPort: 'HTTPS EWS SOAP API (:443)',
        privilege: 'Executive & Security Team Mailboxes',
        artifacts: [
          'MailItemsAccessed (AppId = Rogue OAuth App)',
          'EWS FindItem / GetItem / ExportItems SOAP Calls',
        ],
        description:
          'Corporate Exchange Online environment queried by the rogue OAuth application using Bearer tokens via EWS.',
      },
    },
    {
      id: 'ms_sentinel_cloud_siem',
      label: 'Microsoft Sentinel & Defender XDR',
      sublabel: 'Entra AuditLogs + UnifiedAuditLog',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Cloud SOC & Identity Threat Detection',
        pidOrPort: 'Entra ID SignInLogs, AuditLogs & M365 UnifiedAuditLog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'KQL Rule: OAuth App Granted full_access_as_app',
          'KQL Rule: Anomalous Service Principal Credential Addition',
        ],
        description:
          'Monitors Entra ID service principal creation, high-privilege app role assignments, and anomalous EWS MailItemsAccessed telemetry.',
      },
    },
  ],
  processTree: [
    {
      pid: 9001,
      ppid: 1,
      name: 'EntraID-OAuth-Controller',
      commandLine: 'POST https://graph.microsoft.com/v1.0/applications (Create Rogue OAuth App)',
      user: 'legacy-test-svc@corp.onmicrosoft.com',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'POST /v1.0/applications',
        'POST /v1.0/servicePrincipals/{id}/addPassword',
        'POST /v1.0/servicePrincipals/{id}/appRoleAssignments',
      ],
    },
    {
      pid: 9045,
      ppid: 9001,
      name: 'EWS-Mailbox-Collector',
      commandLine: 'POST https://outlook.office365.com/EWS/Exchange.asmx (Bearer JWT AppId=8c4a...)',
      user: 'ServicePrincipal: SyncConnector-Prod',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['EWS::FindItem', 'EWS::GetItem', 'EWS::GetAttachment'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'LOW-VOLUME PASSWORD SPRAY ON LEGACY TEST TENANT',
      subtitle: 'Compromising non-production account lacking MFA via residential proxies',
      description:
        'As documented by Microsoft Threat Intelligence, Midnight Blizzard routed low-volume password spray traffic through a rotating residential proxy pool to compromise a legacy test account in a non-production tenant that did not have Multifactor Authentication (MFA) enforced.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1110.003',
      mitreTechniqueName: 'Brute Force: Password Spraying',
      activeNodeIds: ['nobelium_res_proxy', 'entra_id_tenant', 'ms_sentinel_cloud_siem'],
      compromisedNodeIds: ['entra_id_tenant'],
      keySpecs: [
        { term: 'SPRAY CADENCE', value: 'Low-volume distributed across residential proxy IPs' },
        { term: 'ENTRY ACCOUNT', value: 'Legacy non-production test tenant account (MFA disabled)' },
        { term: 'SIGN-IN LOG', value: 'AADNonInteractiveUserSignInLogs / SignInLogs ResultType 0' },
      ],
    },
    {
      index: 2,
      title: 'MALICIOUS OAUTH APP REGISTRATION & ROLE CONSENT',
      subtitle: 'Abusing legacy test OAuth app to grant full_access_as_app in Exchange',
      description:
        'Using a legacy test OAuth application that possessed elevated directory permissions, the actor registered new malicious OAuth applications, added client secret credentials (Add service principal credentials), and consented to the Office 365 Exchange Online full_access_as_app role (Role ID dc890d15-9560-4a4c-9b7f-a736ec74ec40).',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.003',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Roles',
      activeNodeIds: ['entra_id_tenant', 'rogue_oauth_sp', 'ms_sentinel_cloud_siem'],
      compromisedNodeIds: ['entra_id_tenant', 'rogue_oauth_sp'],
      keySpecs: [
        { term: 'ENTRA OPERATION', value: 'Add application -> Add service principal credentials -> Add app role assignment' },
        { term: 'APP PERMISSION', value: 'full_access_as_app (dc890d15-9560-4a4c-9b7f-a736ec74ec40)' },
        { term: 'PERSISTENCE', value: 'OAuth 2.0 Client Credentials token survives user password resets' },
      ],
    },
    {
      index: 3,
      title: 'OAUTH BEARER TOKEN EWS MAILBOX EXFILTRATION',
      subtitle: 'Querying outlook.office365.com/EWS/Exchange.asmx via residential proxies',
      description:
        'Authenticating with the rogue OAuth application client secret, Midnight Blizzard requested OAuth 2.0 Bearer tokens and queried Exchange Web Services (EWS) across residential proxy nodes to harvest messages and attachments from targeted corporate mailboxes.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1528',
      mitreTechniqueName: 'Steal Application Access Token',
      activeNodeIds: ['nobelium_res_proxy', 'rogue_oauth_sp', 'exchange_online_ews', 'ms_sentinel_cloud_siem'],
      compromisedNodeIds: ['entra_id_tenant', 'rogue_oauth_sp', 'exchange_online_ews'],
      keySpecs: [
        { term: 'EXFIL ENDPOINT', value: 'https://outlook.office365.com/EWS/Exchange.asmx' },
        { term: 'UNIFIED AUDIT LOG', value: 'MailItemsAccessed & ApplicationImpersonation via AppId' },
        { term: 'MITRE TECHNIQUE', value: 'T1528 (Steal Application Access Token) & T1114.002 (Remote Email Collection)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ms-mb-1',
      no: 1,
      stageIndex: 1,
      timestamp: '19:04:12.110',
      sourceNodeId: 'nobelium_res_proxy',
      targetNodeId: 'entra_id_tenant',
      sourceLabel: '198.51.100.89 (Residential Proxy)',
      targetLabel: 'Entra ID SignInLogs',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Entra SignInLogs',
      shortAction: 'LEGACY TENANT SPRAY',
      info: 'UserPrincipalName=legacy-test-svc@tenant.onmicrosoft.com AuthenticationRequirement=singleFactorAuthentication',
      sizeOrCode: 'ResultType 0',
      severity: 'HIGH',
      mitreId: 'T1110.003',
      explanation:
        'Entra ID Sign-In logs capture a single-factor authentication success on an unmanaged legacy test account from a residential proxy IP.',
      rawLog: `{
  "Category": "SignInLogs",
  "OperationName": "Sign-in activity",
  "ResultType": "0",
  "UserPrincipalName": "legacy-test-svc@tenant.onmicrosoft.com",
  "IPAddress": "198.51.100.89",
  "AuthenticationRequirement": "singleFactorAuthentication",
  "ConditionalAccessStatus": "notApplied",
  "AppDisplayName": "Azure Portal"
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Single-Factor Sign-In to Legacy or Test Tenant Accounts',
        ruleCode: `SigninLogs
| where ResultType == 0 and AuthenticationRequirement == "singleFactorAuthentication"
| where UserPrincipalName has_any ("test", "legacy", "svc")
| project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName, ConditionalAccessStatus`,
        mitigation:
          'Decommission unused legacy tenants/accounts and enforce Conditional Access with phishing-resistant MFA across 100% of accounts and service principals.',
      },
    },
    {
      id: 'ms-mb-2',
      no: 2,
      stageIndex: 2,
      timestamp: '19:11:28.540',
      sourceNodeId: 'entra_id_tenant',
      targetNodeId: 'rogue_oauth_sp',
      sourceLabel: 'Entra AuditLogs',
      targetLabel: 'SyncConnector-Prod (AppId 8c4a...)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Entra AuditLogs',
      shortAction: 'GRANT FULL_ACCESS_AS_APP',
      info: 'OperationName="Add app role assignment to service principal" AppRoleId="dc890d15-9560-4a4c-9b7f-a736ec74ec40"',
      sizeOrCode: 'Role Granted',
      severity: 'CRITICAL',
      mitreId: 'T1098.003',
      explanation:
        'Microsoft Threat Intelligence highlights auditing AppRoleId dc890d15-9560-4a4c-9b7f-a736ec74ec40 (Exchange full_access_as_app) and Mail.ReadWrite grants on newly created OAuth service principals.',
      rawLog: `{
  "Category": "AuditLogs",
  "OperationName": "Add app role assignment to service principal",
  "Result": "success",
  "InitiatedBy": { "app": { "displayName": "Legacy-Directory-Provisioner", "servicePrincipalId": "41b2..." } },
  "TargetResources": [
    {
      "displayName": "Office 365 Exchange Online",
      "modifiedProperties": [
        { "displayName": "AppRole.Id", "newValue": "\\"dc890d15-9560-4a4c-9b7f-a736ec74ec40\\"" },
        { "displayName": "AppRole.Value", "newValue": "\\"full_access_as_app\\"" }
      ]
    }
  ]
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Microsoft Threat Intel — OAuth App Assigned Exchange full_access_as_app',
        ruleCode: `AuditLogs
| where OperationName == "Add app role assignment to service principal"
| mv-expand TargetResources
| mv-expand TargetResources.modifiedProperties
| where tostring(TargetResources_modifiedProperties.newValue) has_any ("dc890d15-9560-4a4c-9b7f-a736ec74ec40", "full_access_as_app", "Mail.ReadWrite")`,
        mitigation:
          'Audit all OAuth service principals holding Application.ReadWrite.All or AppRoleAssignment.ReadWrite.All and replace EWS full_access_as_app with scoped RBAC for Applications.',
      },
    },
    {
      id: 'ms-mb-3',
      no: 3,
      stageIndex: 3,
      timestamp: '19:18:05.902',
      sourceNodeId: 'rogue_oauth_sp',
      targetNodeId: 'exchange_online_ews',
      sourceLabel: 'AppId 8c4a... (OAuth JWT)',
      targetLabel: 'Exchange Online EWS',
      sourceType: 'NETWORK',
      protocolOrEventId: 'M365 MailItemsAccessed',
      shortAction: 'EWS MAIL EXFIL',
      info: 'Operation=MailItemsAccessed ClientAppId=8c4a91f0-... ClientInfoString="Client=WebServices" ItemCount=412',
      sizeOrCode: '412 Items',
      severity: 'CRITICAL',
      mitreId: 'T1528',
      explanation:
        'Exchange Online Unified Audit Log (MailItemsAccessed) captures the rogue OAuth ClientAppId reading hundreds of mailbox items over EWS.',
      rawLog: `{
  "RecordType": 50,
  "Operation": "MailItemsAccessed",
  "Workload": "Exchange",
  "ClientIPAddress": "198.51.100.89",
  "ClientInfoString": "Client=WebServices;UserAgent=Python-urllib/3.11",
  "AppId": "8c4a91f0-3e12-4b99-a102-998877665544",
  "OperationCount": 412
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Anomalous EWS MailItemsAccessed by Newly Registered OAuth AppId',
        ruleCode: `CloudAppEvents
| where ActionType == "MailItemsAccessed"
| where RawEventData.ClientInfoString has "Client=WebServices"
| summarize AccessedCount = count() by tostring(RawEventData.AppId), IPAddress
| where AccessedCount > 100`,
        mitigation:
          'Disable legacy Exchange Web Services (EWS) application impersonation where unneeded and enforce Workload Identity Conditional Access policies.',
      },
    },
  ],
};

export const MS_SALT_TYPHOON_TELECOM_SCENARIO: AttackScenario = {
  id: 'ms-salt-typhoon-telecom',
  code: 'T1014',
  name: 'Microsoft & Kaspersky — Salt Typhoon (GhostEmperor): Demodex Rootkit & Telecom Core Capture',
  shortSubtitle: 'Microsoft Threat Intel / Kaspersky GReAT · BYOVD Demodex Kernel Rootkit & TACACS+ Capture',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Tracked as Salt Typhoon by Microsoft Threat Intelligence and GhostEmperor by Kaspersky GReAT, this nation-state APT targets telecommunications providers and ISP core networks. Attackers compromise edge appliances and Windows management servers, load the Demodex kernel-mode rootkit using a vulnerable signed third-party driver (BYOVD) to hide files, processes, and registry keys, and intercept TACACS+/RADIUS credentials and core routing metadata.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence (Salt Typhoon) & Kaspersky GReAT (GhostEmperor Demodex)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1014 (Rootkit) · T1068 (Vulnerable Driver Exploitation) · T1040 (Network Sniffing)',
    },
    {
      term: 'ROOTKIT ARTIFACT',
      value: 'Demodex Kernel Rootkit (Filter Manager Minifilter & Registry Callback Hooking)',
    },
    {
      term: 'TELECOM TARGETS',
      value: 'TACACS+ / RADIUS Authentication Servers & Core ISP Management Plane',
    },
  ],
  nodes: [
    {
      id: 'salt_typhoon_relay',
      label: 'Salt Typhoon C2 Relay',
      sublabel: '203.0.113.195:443 (Multi-Hop TLS)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Salt Typhoon / GhostEmperor C2 Node',
        pidOrPort: 'TCP/443 (Custom Encrypted Multiplexer)',
        privilege: 'External APT Operator',
        artifacts: [
          'Encrypted C2 over TLS / Custom Socket Tunnel',
          'Exfiltrated TACACS+ & Router Configurations',
        ],
        description:
          'Multi-hop C2 relay receiving intercepted network engineering credentials and routing tables from compromised telecom jump-hosts.',
      },
    },
    {
      id: 'telecom_mgmt_srv',
      label: 'Telecom NOC Jump Server',
      sublabel: '10.30.1.10 · NOC-WIN-01',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 Telecom NOC Host',
        pidOrPort: 'Signed Vulnerable Loader -> Demodex.sys',
        privilege: 'NT AUTHORITY\\SYSTEM / Kernel Ring-0',
        artifacts: [
          'Sysmon EID 6 (DriverLoad: Vulnerable rwdrv.sys)',
          'Hidden Registry & File Filter Callbacks',
        ],
        description:
          'Network Operations Center (NOC) server where Salt Typhoon loads a vulnerable signed driver to map the unsigned Demodex kernel rootkit into Ring-0.',
      },
    },
    {
      id: 'demodex_kernel_rootkit',
      label: 'Demodex Kernel Rootkit (Ring-0)',
      sublabel: '0xFFFFF8046A100000 (Unbacked Kernel Pool)',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Kernel-Mode Rootkit & User-Mode C2 Implant',
        pidOrPort: 'FltRegisterFilter & CmRegisterCallback',
        privilege: 'Kernel Ring-0',
        artifacts: [
          'Hides Registry Keys matching *Demodex* / *GhostEmperor*',
          'FltRegisterFilter Minifilter Hiding Implant Binaries',
        ],
        description:
          'Ring-0 Demodex driver mapped into kernel pool memory that intercepts filesystem IRP_MJ_DIRECTORY_CONTROL and registry enumeration calls to hide the implant.',
      },
    },
    {
      id: 'tacacs_core_router',
      label: 'ISP Core Router & TACACS+ AAA',
      sublabel: '10.30.0.2 (TCP/49 TACACS+ & BGP Core)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Telecom Core Router & AAA Authentication Server',
        pidOrPort: 'TCP/49 (TACACS+) & TCP/179 (BGP)',
        privilege: 'Core Telecom Backbone',
        artifacts: [
          'Captured TACACS+ Shared Secrets & Engineer Sessions',
          'GRE / Lawful-Intercept Management Access',
        ],
        description:
          'Core telecommunications routing and TACACS+ AAA infrastructure accessed using credentials harvested by the Salt Typhoon implant.',
      },
    },
    {
      id: 'soc_kernel_siem',
      label: 'Defender XDR & Telecom NDR',
      sublabel: 'Sysmon EID 6, 7045 & NetFlow NDR',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'SOC SIEM & Network Detection and Response',
        pidOrPort: 'Sysmon EID 6 (DriverLoad) & TACACS+ Audit',
        privilege: 'SOC Monitoring',
        artifacts: [
          'Alert: Vulnerable Signed Driver Loaded (BYOVD)',
          'YARA: Apt_GhostEmperor_Demodex_Rootkit',
        ],
        description:
          'Detects the initial vulnerable signed driver load (Sysmon EID 6) prior to Demodex kernel callback registration and monitors anomalous TACACS+ access.',
      },
    },
  ],
  processTree: [
    {
      pid: 3812,
      ppid: 684,
      name: 'cohost.exe (Loader)',
      commandLine: 'C:\\ProgramData\\Comms\\cohost.exe -install',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'NtLoadDriver("\\Registry\\Machine\\System\\CurrentControlSet\\Services\\rwdrv")',
        'DeviceIoControl(0x222008) -> Map Kernel Pool',
      ],
    },
    {
      pid: 4,
      ppid: 0,
      name: 'System (Demodex Ring-0)',
      commandLine: 'ntoskrnl.exe -> NonPagedPool 0xFFFFF8046A100000',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'ExAllocatePoolWithTag(NonPagedPoolExecute)',
        'FltRegisterFilter',
        'CmRegisterCallbackEx',
      ],
      memoryBlocks: [
        {
          address: '0xFFFFF8046A100000',
          section: 'NonPagedPoolExecute (Demodex Driver)',
          permissions: 'RWX',
          size: '96 KB',
          status: 'injected',
          description:
            'Unsigned Demodex kernel rootkit mapped into Windows NonPagedPool via vulnerable driver IOCTL.',
          hexPreview: '4D 5A 90 00 03 00 00 00 48 89 5C 24 08 48 89 74',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'BYOVD VULNERABLE SIGNED DRIVER LOAD (DSE BYPASS)',
      subtitle: 'Abusing signed kernel driver IOCTL to bypass Windows Driver Signature Enforcement',
      description:
        'As documented in Kaspersky GReAT and Microsoft analyses of GhostEmperor / Salt Typhoon, the attacker drops a legitimate, digitally signed third-party driver containing an arbitrary kernel read/write vulnerability (BYOVD). Loading this driver (Sysmon Event ID 6) allows the user-mode loader to overwrite ci.dll!g_CiOptions or map an unsigned kernel payload directly into NonPagedPool.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['telecom_mgmt_srv', 'demodex_kernel_rootkit', 'soc_kernel_siem'],
      compromisedNodeIds: ['telecom_mgmt_srv'],
      keySpecs: [
        { term: 'TECHNIQUE', value: 'Bring Your Own Vulnerable Driver (BYOVD) DSE Bypass' },
        { term: 'SYSMON EVENT', value: 'Sysmon Event ID 6 (Driver Loaded) & System EID 7045' },
        { term: 'KERNEL TARGET', value: 'ci.dll!g_CiOptions (Code Integrity) / NonPagedPoolExecute' },
      ],
    },
    {
      index: 2,
      title: 'DEMODEX KERNEL ROOTKIT MINIFILTER & REGISTRY HIDING',
      subtitle: 'FltRegisterFilter and CmRegisterCallbackEx conceal implant artifacts',
      description:
        'Once mapped into Ring-0, the Demodex rootkit registers a filesystem minifilter (FltRegisterFilter) and a registry callback (CmRegisterCallbackEx). Any attempt by EDR or administrators to list the implant directory, registry service keys, or user-mode C2 process returns STATUS_NOT_FOUND.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1014',
      mitreTechniqueName: 'Rootkit',
      activeNodeIds: ['telecom_mgmt_srv', 'demodex_kernel_rootkit', 'soc_kernel_siem'],
      compromisedNodeIds: ['telecom_mgmt_srv', 'demodex_kernel_rootkit'],
      keySpecs: [
        { term: 'ROOTKIT NAME', value: 'Demodex (GhostEmperor / Salt Typhoon)' },
        { term: 'KERNEL HOOKS', value: 'FltRegisterFilter (IRP_MJ_DIRECTORY_CONTROL) & CmRegisterCallbackEx' },
        { term: 'STEALTH EFFECT', value: 'Conceals user-mode implant files, registry keys & sockets' },
      ],
    },
    {
      index: 3,
      title: 'TELECOM TACACS+ CREDENTIAL CAPTURE & CORE ROUTER PIVOT',
      subtitle: 'Sniffing AAA authentication traffic and pivoting to core ISP routers',
      description:
        'From the concealed NOC foothold, Salt Typhoon captures TACACS+/RADIUS authentication exchanges and SSH sessions (T1040), extracting network engineer credentials to log directly into core ISP routers and exfiltrate routing configurations over TLS.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1040',
      mitreTechniqueName: 'Network Sniffing',
      activeNodeIds: ['demodex_kernel_rootkit', 'tacacs_core_router', 'salt_typhoon_relay', 'soc_kernel_siem'],
      compromisedNodeIds: ['telecom_mgmt_srv', 'demodex_kernel_rootkit', 'tacacs_core_router'],
      keySpecs: [
        { term: 'CAPTURED PROTOCOL', value: 'TACACS+ (TCP/49), RADIUS (UDP/1812) & SSH (:22)' },
        { term: 'TARGET INFRASTRUCTURE', value: 'Telecom Core Routers & Lawful-Intercept Management Plane' },
        { term: 'EXFIL CHANNEL', value: 'Multi-hop encrypted TLS tunnel to 203.0.113.195:443' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ms-st-1',
      no: 1,
      stageIndex: 1,
      timestamp: '04:08:19.310',
      sourceNodeId: 'telecom_mgmt_srv',
      targetNodeId: 'soc_kernel_siem',
      sourceLabel: 'NOC-WIN-01',
      targetLabel: 'Sysmon EID 6 (DriverLoad)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 6',
      shortAction: 'BYOVD DRIVER LOAD',
      info: 'ImageLoaded=C:\\Windows\\Temp\\rwdrv.sys Signed=true SignatureStatus=Valid',
      sizeOrCode: 'Event 6',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Sysmon Event ID 6 captures the loading of a known-vulnerable signed kernel driver from C:\\Windows\\Temp\\ immediately prior to Demodex rootkit deployment.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>6</EventID>
    <Computer>NOC-WIN-01.telecom.local</Computer>
  </System>
  <EventData>
    <Data Name="ImageLoaded">C:\\Windows\\Temp\\rwdrv.sys</Data>
    <Data Name="Signed">true</Data>
    <Data Name="SignatureStatus">Valid</Data>
    <Data Name="Hashes">SHA256=D4E5F60123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Kernel Driver Loaded from Suspicious Temp Directory (BYOVD)',
        ruleCode: `title: Suspicious Kernel Driver Load from Temp Folder
logsource:
  category: driver_load
  product: windows
detection:
  selection:
    ImageLoaded|contains:
      - '\\Windows\\Temp\\'
      - '\\AppData\\Local\\Temp\\'
      - '\\ProgramData\\'
  condition: selection
level: critical`,
        mitigation:
          'Enable Microsoft Vulnerable Driver Blocklist (HVCI / Memory Integrity) to prevent BYOVD loaders from mapping unsigned kernel rootkits.',
      },
    },
    {
      id: 'ms-st-2',
      no: 2,
      stageIndex: 2,
      timestamp: '04:08:20.055',
      sourceNodeId: 'telecom_mgmt_srv',
      targetNodeId: 'demodex_kernel_rootkit',
      sourceLabel: 'rwdrv.sys IOCTL',
      targetLabel: 'Demodex Ring-0 Pool',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Kernel Pool Scan',
      shortAction: 'DEMODEX ROOTKIT',
      info: 'Unbacked Kernel NonPagedPoolExecute 0xFFFFF8046A100000 registering FltRegisterFilter & CmRegisterCallbackEx',
      sizeOrCode: '96 KB Ring-0',
      severity: 'CRITICAL',
      mitreId: 'T1014',
      explanation:
        'Kaspersky GReAT documented that the Demodex rootkit runs from unbacked kernel pool memory after unmapping its loader driver and registers filter callbacks to hide files and registry keys.',
      rawLog: `[KERNEL_INTEGRITY_SCAN]
Host: NOC-WIN-01.telecom.local
UnbackedKernelPool: 0xFFFFF8046A100000 (Size: 98304, Tag: 'Dmdx')
RegisteredCallbacks:
  - FltRegisterFilter -> IRP_MJ_DIRECTORY_CONTROL Hook at 0xFFFFF8046A102410
  - CmRegisterCallbackEx -> RegNtPostEnumerateKey Hook at 0xFFFFF8046A103890`,
      detectionRule: {
        type: 'YARA',
        title: 'Kaspersky GReAT — GhostEmperor Demodex Kernel Rootkit',
        ruleCode: `rule GhostEmperor_SaltTyphoon_Demodex_Rootkit {
  meta:
    author = "Kaspersky GReAT / Microsoft Threat Intel"
    actor = "GhostEmperor / Salt Typhoon"
  strings:
    $api1 = "FltRegisterFilter" wide ascii
    $api2 = "CmRegisterCallbackEx" wide ascii
    $api3 = "IoCreateSymbolicLink" wide ascii
    $tag = { 44 6D 64 78 }
  condition:
    uint16(0) == 0x5A4D and 3 of them
}`,
        mitigation:
          'Enforce Hypervisor-Protected Code Integrity (HVCI) and monitor Kernel Patch Protection / unbacked kernel callback addresses.',
      },
    },
    {
      id: 'ms-st-3',
      no: 3,
      stageIndex: 3,
      timestamp: '04:15:33.780',
      sourceNodeId: 'demodex_kernel_rootkit',
      targetNodeId: 'tacacs_core_router',
      sourceLabel: 'NOC-WIN-01 (Implant)',
      targetLabel: '10.30.0.2 (Core Router)',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Suricata TACACS+/SSH',
      shortAction: 'CORE ROUTER PIVOT',
      info: 'Anomalous TACACS+ / SSH Administrative Session to Core Router 10.30.0.2 & Config Export',
      sizeOrCode: 'TCP/49 & :22',
      severity: 'CRITICAL',
      mitreId: 'T1040',
      explanation:
        'Using credentials captured on the NOC jump server, Salt Typhoon authenticates to core telecom routers and exports running configurations and subscriber routing tables.',
      rawLog: `[SURICATA_NDR_ALERT]
Timestamp: 04:15:33.780211
SrcIP: 10.30.1.10 (NOC-WIN-01) -> DstIP: 10.30.0.2 (ISP-CORE-RTR01)
Proto: TCP DstPort: 22 (SSH-2.0-Cisco-1.25)
AAA_User: neteng_admin (Authenticated via TACACS+ 10.30.0.2:49)
CLI_Audit: "show running-config", "monitor capture CAP_CORE interface TenGigE0/0/0/1 both"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unauthorized Packet Capture & Config Export on Core Router',
        ruleCode: `title: Cisco IOS-XR / XE Unauthorized Monitor Capture Command
logsource:
  product: cisco
  service: aaa
detection:
  selection:
    CmdSet|contains:
      - 'monitor capture'
      - 'show running-config'
      - 'law-intercept'
  condition: selection
level: critical`,
        mitigation:
          'Migrate management plane authentication from legacy TACACS+ (MD5 obfuscation) to mutual TLS / SSH certificates with hardware security keys.',
      },
    },
  ],
};

export const MS_FOREST_BLIZZARD_GOOSEEGG_SCENARIO: AttackScenario = {
  id: 'ms-forest-blizzard-gooseegg',
  code: 'CVE-2022-38028',
  name: 'Microsoft Threat Intel — Forest Blizzard (APT28): Print Spooler CVE-2022-38028 & GooseEgg',
  shortSubtitle: 'Microsoft Threat Intelligence · pnms009.inf Driver Store Symlink, GooseEgg (justice.exe) & wayzgoose.dll',
  category: 'MALWARE',
  severity: 'HIGH',
  primaryMitrePhase: 3,
  overview:
    'Published by Microsoft Threat Intelligence (April 2024), Russian state-sponsored actor Forest Blizzard (APT28 / STRONTIUM / Sofacy) deployed a custom post-compromise tool named GooseEgg (execute.bat / justice.exe) to exploit CVE-2022-38028 in the Windows Print Spooler service. GooseEgg modifies permissions on the pnms009.inf printer driver store directory via NTFS symbolic links and deploys a custom JavaScript constraint script that causes spoolsv.exe to load a malicious DLL (wayzgoose23.dll) as NT AUTHORITY\\SYSTEM.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence — Forest Blizzard GooseEgg (CVE-2022-38028) Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1068 (PrivEsc CVE-2022-38028) · T1547.012 (Print Processors) · T1546.015 (COM Hijacking)',
    },
    {
      term: 'GOOSEEGG ARTIFACTS',
      value: 'execute.bat, justice.exe (doit.exe), wayzgoose23.dll & who.exe',
    },
    {
      term: 'TARGET DRIVER STORE',
      value: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_*',
    },
  ],
  nodes: [
    {
      id: 'apt28_foothold_script',
      label: 'GooseEgg Batch Launcher',
      sublabel: 'execute.bat -> justice.exe',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Forest Blizzard (APT28) Post-Compromise Toolset',
        pidOrPort: 'C:\\ProgramData\\execute.bat & justice.exe',
        privilege: 'Standard User Foothold',
        artifacts: [
          'execute.bat (Sets up Registry & Invokes justice.exe)',
          'justice.exe / doit.exe (CVE-2022-38028 Exploit Binary)',
        ],
        description:
          'Initial batch script and GooseEgg executable deployed by Forest Blizzard on a compromised workstation or mail server.',
      },
    },
    {
      id: 'driverstore_pnms009',
      label: 'DriverStore (pnms009.inf)',
      sublabel: 'NTFS Symlink & JS Constraint Script',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows DriverStore FileRepository',
        pidOrPort: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_*',
        privilege: 'Modified DACL via CVE-2022-38028',
        artifacts: [
          'Modified JavaScript Constraint File inside pnms009.inf_amd64_*',
          'Dropped Payload: wayzgoose23.dll',
        ],
        description:
          'Windows Printer DriverStore folder whose permissions are overwritten via CVE-2022-38028 so spoolsv.exe loads wayzgoose23.dll.',
      },
    },
    {
      id: 'spoolsv_system_proc',
      label: 'spoolsv.exe -> wayzgoose23.dll',
      sublabel: 'PID 1984 (NT AUTHORITY\\SYSTEM)',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Windows Print Spooler Service',
        pidOrPort: 'PID 1984 · C:\\Windows\\System32\\spoolsv.exe',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'Sysmon EID 7: spoolsv.exe loads wayzgoose23.dll',
          'Spawns who.exe (Four-Command Backdoor)',
        ],
        description:
          'Privileged Windows Print Spooler service coerced into loading Forest Blizzard wayzgoose23.dll with SYSTEM privileges.',
      },
    },
    {
      id: 'who_exe_backdoor',
      label: 'who.exe SYSTEM Backdoor',
      sublabel: 'PID 6240 · COM Hijack & Task Persistence',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'GooseEgg Embedded Launcher Application (who.exe)',
        pidOrPort: 'PID 6240 (Spawned by wayzgoose23.dll)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'CLSID {7D096C5F-AC08-4F1F-BEB7-5C22C517CE39} COM Hijack',
          'Scheduled Task: \\Microsoft\\Windows\\Defrag\\ScheduledDefrag',
        ],
        description:
          'GooseEgg secondary payload (who.exe) supporting 4 commands: spawn SYSTEM shell, execute arbitrary binary, test status, and establish COM/Scheduled Task persistence.',
      },
    },
    {
      id: 'mde_defender_siem',
      label: 'Microsoft Defender XDR',
      sublabel: 'Sysmon EID 1, 7, 11 & 13',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Microsoft Defender for Endpoint & Sentinel',
        pidOrPort: 'Win32/Hive.ZY & HackTool:Win64/GooseEgg',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: HackTool:Win64/GooseEgg!MTB',
          'Alert: spoolsv.exe Loading Unsigned DLL from DriverStore',
        ],
        description:
          'Detects modifications inside DriverStore\\FileRepository\\pnms009.inf* and spoolsv.exe loading wayzgoose23.dll.',
      },
    },
  ],
  processTree: [
    {
      pid: 4512,
      ppid: 3100,
      name: 'justice.exe (GooseEgg)',
      commandLine: 'C:\\ProgramData\\justice.exe -d C:\\ProgramData\\wayzgoose23.dll',
      user: 'CORP\\v.petrov',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateSymbolicLinkW',
        'OpenPrinterW',
        'WriteFile("pnms009.inf_amd64_.../MPDW-constraints.js")',
      ],
    },
    {
      pid: 1984,
      ppid: 680,
      name: 'spoolsv.exe',
      commandLine: 'C:\\Windows\\System32\\spoolsv.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: ['LoadLibraryW("wayzgoose23.dll")', 'CreateProcessAsUserW("who.exe")'],
    },
    {
      pid: 6240,
      ppid: 1984,
      name: 'who.exe',
      commandLine: 'C:\\ProgramData\\who.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['RegSetValueExW("InprocServer32")', 'CreateProcessW("cmd.exe")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'GOOSEEGG SYMLINK & PNMS009.INF DRIVERSTORE TAMPERING',
      subtitle: 'justice.exe exploits CVE-2022-38028 to modify MPDW-constraints.js',
      description:
        'As detailed by Microsoft Threat Intelligence, Forest Blizzard runs execute.bat to launch justice.exe (GooseEgg). The exploit creates NTFS symbolic links and triggers CVE-2022-38028 in the Print Spooler, making the C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_* directory writable to a standard user and overwriting its JavaScript constraint script.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['apt28_foothold_script', 'driverstore_pnms009', 'mde_defender_siem'],
      compromisedNodeIds: ['driverstore_pnms009'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2022-38028 (Windows Print Spooler EoP)' },
        { term: 'EXPLOIT BINARY', value: 'justice.exe / doit.exe (HackTool:Win64/GooseEgg)' },
        { term: 'MODIFIED PATH', value: 'DriverStore\\FileRepository\\pnms009.inf_amd64_*\\MPDW-constraints.js' },
      ],
    },
    {
      index: 2,
      title: 'SPOOLSV.EXE LOADS WAYZGOOSE23.DLL AS SYSTEM',
      subtitle: 'Print Spooler evaluates tampered JS constraint and loads malicious DLL',
      description:
        'When spoolsv.exe processes the printer constraint script, it loads the attacker-supplied wayzgoose23.dll from the DriverStore folder under the NT AUTHORITY\\SYSTEM security context.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1547.012',
      mitreTechniqueName: 'Boot or Logon Autostart Execution: Print Processors',
      activeNodeIds: ['driverstore_pnms009', 'spoolsv_system_proc', 'mde_defender_siem'],
      compromisedNodeIds: ['driverstore_pnms009', 'spoolsv_system_proc'],
      keySpecs: [
        { term: 'HOST SERVICE', value: 'C:\\Windows\\System32\\spoolsv.exe (NT AUTHORITY\\SYSTEM)' },
        { term: 'MALICIOUS DLL', value: 'wayzgoose23.dll (Loaded via MPDW-constraints.js)' },
        { term: 'SYSMON EVENT', value: 'Sysmon Event ID 7 (Unsigned DLL loaded by spoolsv.exe)' },
      ],
    },
    {
      index: 3,
      title: 'WHO.EXE SYSTEM BACKDOOR & COM SERVER HIJACK',
      subtitle: 'Spawning SYSTEM command shell and registering ScheduledDefrag COM hijack',
      description:
        'wayzgoose23.dll launches who.exe as SYSTEM. who.exe establishes persistence by modifying the ScheduledDefrag task and hijacking a COM server CLSID in HKLM\\SOFTWARE\\Classes\\CLSID\\, then spawns a SYSTEM command shell for credential theft and network espionage.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1546.015',
      mitreTechniqueName: 'Event Triggered Execution: Component Object Model Hijacking',
      activeNodeIds: ['spoolsv_system_proc', 'who_exe_backdoor', 'mde_defender_siem'],
      compromisedNodeIds: ['driverstore_pnms009', 'spoolsv_system_proc', 'who_exe_backdoor'],
      keySpecs: [
        { term: 'BACKDOOR BINARY', value: 'who.exe (Spawned by spoolsv.exe as SYSTEM)' },
        { term: 'PERSISTENCE', value: 'COM Server InprocServer32 Hijack + ScheduledDefrag Task' },
        { term: 'THREAT ACTOR', value: 'Forest Blizzard (APT28 / GRU Unit 26165)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ms-fb-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:04:15.202',
      sourceNodeId: 'apt28_foothold_script',
      targetNodeId: 'driverstore_pnms009',
      sourceLabel: 'justice.exe (PID 4512)',
      targetLabel: 'DriverStore\\pnms009.inf',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11',
      shortAction: 'WRITE WAYZGOOSE.DLL',
      info: 'Image=C:\\ProgramData\\justice.exe TargetFilename=C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_...\\wayzgoose23.dll',
      sizeOrCode: 'FileCreate',
      severity: 'HIGH',
      mitreId: 'T1068',
      explanation:
        'Microsoft Threat Intelligence identified GooseEgg writing wayzgoose.dll and modifying JavaScript constraint files inside the pnms009.inf DriverStore repository.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
    <Computer>WKS-GOV-03.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\justice.exe</Data>
    <Data Name="TargetFilename">C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_3108b2c4\\wayzgoose23.dll</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Forest Blizzard GooseEgg File Creation in pnms009.inf DriverStore',
        ruleCode: `title: Forest Blizzard GooseEgg CVE-2022-38028 DriverStore Modification
logsource:
  category: file_event
  product: windows
detection:
  selection:
    TargetFilename|contains: '\\DriverStore\\FileRepository\\pnms009.inf'
    TargetFilename|endswith:
      - '.dll'
      - '.js'
  filter_system:
    Image|endswith:
      - '\\drvinst.exe'
      - '\\TiWorker.exe'
  condition: selection and not filter_system
level: critical`,
        mitigation:
          'Apply the October 2022 Windows security update for CVE-2022-38028 and disable the Print Spooler service on servers that do not require printing.',
      },
    },
    {
      id: 'ms-fb-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:04:16.810',
      sourceNodeId: 'driverstore_pnms009',
      targetNodeId: 'spoolsv_system_proc',
      sourceLabel: 'pnms009.inf DriverStore',
      targetLabel: 'spoolsv.exe (PID 1984)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'SPOOLSV LOAD DLL',
      info: 'Image=C:\\Windows\\System32\\spoolsv.exe ImageLoaded=...\\pnms009.inf_amd64_3108b2c4\\wayzgoose23.dll Signed=false',
      sizeOrCode: 'SYSTEM Load',
      severity: 'CRITICAL',
      mitreId: 'T1547.012',
      explanation:
        'spoolsv.exe loading an unsigned DLL (wayzgoose23.dll) from the pnms009.inf DriverStore folder grants Forest Blizzard immediate SYSTEM code execution.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>WKS-GOV-03.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\spoolsv.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_3108b2c4\\wayzgoose23.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Print Spooler (spoolsv.exe) Loading Unsigned DLL from DriverStore',
        ruleCode: `title: Spoolsv Loading Unsigned DLL (CVE-2022-38028 GooseEgg)
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\spoolsv.exe'
    ImageLoaded|contains: '\\DriverStore\\FileRepository\\pnms009.inf'
    Signed: 'false'
  condition: selection
level: critical`,
        mitigation:
          'Block unsigned DLL loads inside spoolsv.exe via Attack Surface Reduction (ASR) rules and audit DriverStore integrity.',
      },
    },
    {
      id: 'ms-fb-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:04:17.445',
      sourceNodeId: 'spoolsv_system_proc',
      targetNodeId: 'who_exe_backdoor',
      sourceLabel: 'spoolsv.exe (SYSTEM)',
      targetLabel: 'who.exe (PID 6240)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'SPAWN WHO.EXE',
      info: 'ParentImage=C:\\Windows\\System32\\spoolsv.exe Image=C:\\ProgramData\\who.exe User=NT AUTHORITY\\SYSTEM',
      sizeOrCode: 'PID 6240',
      severity: 'CRITICAL',
      mitreId: 'T1546.015',
      explanation:
        'spoolsv.exe spawning an executable (who.exe) out of C:\\ProgramData\\ confirms successful privilege escalation via GooseEgg.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>WKS-GOV-03.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6240</Data>
    <Data Name="Image">C:\\ProgramData\\who.exe</Data>
    <Data Name="ParentProcessId">1984</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\spoolsv.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Print Spooler Spawning Suspicious Child Process (GooseEgg who.exe)',
        ruleCode: `title: Suspicious Child Process of Spoolsv.exe
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\spoolsv.exe'
    Image|contains:
      - '\\ProgramData\\'
      - '\\Users\\Public\\'
      - '\\Windows\\Temp\\'
  condition: selection
level: critical`,
        mitigation:
          'Isolate any endpoint where spoolsv.exe spawns a child process from C:\\ProgramData\\ or C:\\Windows\\Temp\\.',
      },
    },
  ],
};

export const UNIT42_STAR_BLIZZARD_EVILGINX_AITM_SCENARIO: AttackScenario = {
  id: 'unit42-star-blizzard-evilginx-aitm',
  code: 'T1539',
  name: 'Microsoft, Unit 42 & CISA — Star Blizzard / Storm-0539: Evilginx AiTM Cookie Theft',
  shortSubtitle: 'Microsoft Threat Intel / Unit 42 / CISA AA23-341A · AiTM Reverse Proxy, ESTSAUTH Cookie & Inbox Rules',
  category: 'NETWORK_WEB',
  severity: 'HIGH',
  primaryMitrePhase: 5,
  overview:
    'Documented by Microsoft Threat Intelligence, Palo Alto Networks Unit 42, and CISA Joint Advisory AA23-341A, actors such as Star Blizzard (SEABORGIUM / COLDRIVER) and Storm-0539 deploy Evilginx Adversary-in-the-Middle (AiTM) reverse-proxy phishing frameworks. The proxy relays real-time authentication traffic between the victim and login.microsoftonline.com, satisfies TOTP/Push MFA, steals the resulting ESTSAUTH / ESTSAUTHPERSISTENT session cookies, and replays them to create hidden Exchange Inbox rules.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence, Palo Alto Unit 42 & CISA Advisory AA23-341A',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1566.002 (Spearphishing Link) · T1539 (Steal Web Session Cookie) · T1550.004 (Pass the Cookie)',
    },
    {
      term: 'STOLEN ARTIFACT',
      value: 'ESTSAUTH & ESTSAUTHPERSISTENT Session Cookies (Bypassing Non-FIDO2 MFA)',
    },
    {
      term: 'POST-EXPLOIT PERSISTENCE',
      value: 'Exchange Online New-InboxRule (DeleteMessage/MoveToFolder) & Secondary MFA Registration',
    },
  ],
  nodes: [
    {
      id: 'evilginx_aitm_proxy',
      label: 'Evilginx3 AiTM Reverse Proxy',
      sublabel: 'login.corp-verify-sso.com (198.51.100.44)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Evilginx3 Adversary-in-the-Middle Reverse Proxy',
        pidOrPort: 'HTTPS :443 (LetsEncrypt TLS Certificate)',
        privilege: 'Attacker Phishing Infrastructure',
        artifacts: [
          'Phishlet: o365 / login.microsoftonline.com Reverse Proxy',
          'Captured Cookie: ESTSAUTHPERSISTENT=0.AXEA...',
        ],
        description:
          'Attacker-controlled reverse proxy that transparently proxies the legitimate Microsoft Entra ID sign-in and MFA flow while logging Set-Cookie headers.',
      },
    },
    {
      id: 'victim_exec_browser',
      label: 'Target User Browser (WKS-EXEC-01)',
      sublabel: '10.10.20.14 · Chrome Session',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows 11 Executive Workstation',
        pidOrPort: 'chrome.exe -> PDF QR / Link Lure',
        privilege: 'Executive Mailbox & Cloud User',
        artifacts: [
          'Approves Authenticator Push / Enters 6-Digit TOTP Code',
          'Session Request Correlation ID: 9f4c2a10-...',
        ],
        description:
          'Victim workstation tricked into authenticating through the Evilginx reverse proxy domain.',
      },
    },
    {
      id: 'ests_cookie_replay',
      label: 'Cookie Replay Session (Pass-the-Cookie)',
      sublabel: 'ESTSAUTHPERSISTENT Replay via VPN',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Attacker Headless Browser Injecting Stolen Cookie',
        pidOrPort: 'Cookie: ESTSAUTHPERSISTENT (Same SessionId)',
        privilege: 'Authenticated MFA Session',
        artifacts: [
          'Reuses Original CorrelationId / SessionId from Different IP & ASN',
          'Bypasses MFA Challenge via Valid Session Cookie',
        ],
        description:
          'Attacker browser session injecting the captured ESTSAUTHPERSISTENT cookie from a different IP address within seconds of victim login.',
      },
    },
    {
      id: 'm365_outlook_cloud',
      label: 'Entra ID & Exchange Online',
      sublabel: 'login.microsoftonline.com & Outlook Web',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Microsoft 365 Identity & Exchange Cloud',
        pidOrPort: 'HTTPS :443 (ESTS & OWA REST API)',
        privilege: 'Executive Cloud Mailbox',
        artifacts: [
          'New-InboxRule (MoveToFolder: RSS Feeds, MarkAsRead: true)',
          'Entra ID: User registered security info',
        ],
        description:
          'Cloud identity and mailbox service where the replayed cookie is used to hide incoming security alerts via Inbox rules and exfiltrate sensitive emails.',
      },
    },
    {
      id: 'defender_identity_siem',
      label: 'Microsoft Defender XDR & Sentinel',
      sublabel: 'Anomalous Token & InboxRule Detector',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Identity Protection & Cloud SIEM',
        pidOrPort: 'Entra ID RiskEvents & M365 UnifiedAuditLog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: AiTM Phishing & Session Cookie Replay (Same SessionId, Two IPs)',
          'Alert: Suspicious Inbox Rule Hiding Emails in RSS Subscriptions',
        ],
        description:
          'Correlates identical Entra ID SessionId / OriginalRequestId values across two distinct autonomous systems (ASNs) followed by New-InboxRule.',
      },
    },
  ],
  processTree: [
    {
      pid: 8120,
      ppid: 1,
      name: 'evilginx3',
      commandLine: './evilginx -p ./phishlets -d corp-verify-sso.com',
      user: 'root (AiTM Proxy)',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'TLS_Intercept("login.microsoftonline.com")',
        'CaptureSetCookie("ESTSAUTHPERSISTENT")',
      ],
    },
    {
      pid: 8490,
      ppid: 8120,
      name: 'OWA-Cookie-Replayer',
      commandLine: 'POST https://outlook.office365.com/owa/service.svc?action=New-InboxRule',
      user: 'cfo@corp.local (Hijacked Session)',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['InjectCookie("ESTSAUTHPERSISTENT")', 'New-InboxRule("MoveToFolder:RSS")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'EVILGINX AITM REVERSE-PROXY MFA INTERCEPTION',
      subtitle: 'Relaying login.microsoftonline.com and capturing ESTSAUTHPERSISTENT',
      description:
        'The victim clicks a phishing link pointing to login.corp-verify-sso.com. Evilginx proxies the request live to login.microsoftonline.com, relays the victim password and TOTP/Authenticator push approval, and intercepts the Set-Cookie header containing ESTSAUTH and ESTSAUTHPERSISTENT.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1539',
      mitreTechniqueName: 'Steal Web Session Cookie',
      activeNodeIds: ['victim_exec_browser', 'evilginx_aitm_proxy', 'm365_outlook_cloud'],
      compromisedNodeIds: ['victim_exec_browser'],
      keySpecs: [
        { term: 'AITM PROXY', value: 'Evilginx3 Reverse Proxy (login.corp-verify-sso.com)' },
        { term: 'CAPTURED COOKIE', value: 'ESTSAUTH & ESTSAUTHPERSISTENT (Post-MFA Token)' },
        { term: 'BYPASSED CONTROL', value: 'SMS, Voice, TOTP & Push Notification MFA' },
      ],
    },
    {
      index: 2,
      title: 'WEB SESSION COOKIE REPLAY (PASS-THE-COOKIE)',
      subtitle: 'Replaying stolen ESTSAUTHPERSISTENT cookie from a second IP address',
      description:
        'The attacker imports the captured ESTSAUTHPERSISTENT cookie into their own browser session on a different IP/ASN. Because the cookie already carries the MFA claim from the Evilginx proxy session, Microsoft 365 grants immediate access without prompting for MFA again.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1550.004',
      mitreTechniqueName: 'Use Alternate Authentication Material: Web Session Cookie',
      activeNodeIds: ['evilginx_aitm_proxy', 'ests_cookie_replay', 'm365_outlook_cloud', 'defender_identity_siem'],
      compromisedNodeIds: ['victim_exec_browser', 'ests_cookie_replay', 'm365_outlook_cloud'],
      keySpecs: [
        { term: 'FORENSIC ARTIFACT', value: 'Same SessionId / CorrelationId seen from 2 different IPs/ASNs' },
        { term: 'TECHNIQUE', value: 'T1550.004 (Pass the Cookie)' },
        { term: 'RISK EVENT', value: 'anomalousToken / unfamiliarFeatures in Entra ID' },
      ],
    },
    {
      index: 3,
      title: 'STEALTH INBOX RULE CREATION & BEC EXFILTRATION',
      subtitle: 'Creating New-InboxRule to hide security emails in RSS Feeds folder',
      description:
        'Within minutes of session hijack, the attacker calls the Outlook Web API to create a hidden Inbox rule (New-InboxRule) that automatically marks incoming emails containing "security", "phishing", or "invoice" as read and moves them to the RSS Subscriptions or Conversation History folder.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1564.008',
      mitreTechniqueName: 'Hide Artifacts: Email Hiding Rules',
      activeNodeIds: ['ests_cookie_replay', 'm365_outlook_cloud', 'defender_identity_siem'],
      compromisedNodeIds: ['victim_exec_browser', 'ests_cookie_replay', 'm365_outlook_cloud'],
      keySpecs: [
        { term: 'EXCHANGE AUDIT', value: 'Operation="New-InboxRule" MoveToFolder="RSS Feeds" MarkAsRead="True"' },
        { term: 'MITRE TECHNIQUE', value: 'T1564.008 (Email Hiding Rules)' },
        { term: 'DEFENSE COUNTERMEASURE', value: 'FIDO2 / WebAuthn Device-Bound Passkeys + Token Protection' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'u42-aitm-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:30:14.082',
      sourceNodeId: 'evilginx_aitm_proxy',
      targetNodeId: 'm365_outlook_cloud',
      sourceLabel: '198.51.100.44 (Evilginx)',
      targetLabel: 'login.microsoftonline.com',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Entra SignInLogs (AiTM)',
      shortAction: 'AITM PROXY AUTH',
      info: 'UserPrincipalName=cfo@corp.local IPAddress=198.51.100.44 SessionId=7a91b2c0-1122-3344-5566-77889900aabb',
      sizeOrCode: 'ESTSAUTH Issued',
      severity: 'HIGH',
      mitreId: 'T1539',
      explanation:
        'The initial interactive MFA sign-in in Entra ID originates from the Evilginx VPS IP (198.51.100.44) rather than the corporate office egress IP.',
      rawLog: `{
  "Category": "SignInLogs",
  "ResultType": "0",
  "UserPrincipalName": "cfo@corp.local",
  "IPAddress": "198.51.100.44",
  "AutonomousSystemNumber": 14061,
  "SessionId": "7a91b2c0-1122-3344-5566-77889900aabb",
  "AuthenticationRequirement": "multiFactorAuthentication",
  "AppDisplayName": "Office 365 Exchange Online"
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Entra ID Same SessionId Used Across Multiple IP Addresses (AiTM Replay)',
        ruleCode: `SigninLogs
| where ResultType == 0
| summarize IPCount = dcount(IPAddress), IPs = make_set(IPAddress), ASNs = make_set(AutonomousSystemNumber) by UserPrincipalName, SessionId
| where IPCount >= 2 and array_length(ASNs) >= 2`,
        mitigation:
          'Enforce FIDO2 / WebAuthn phishing-resistant MFA (which binds TLS channel / origin domain) and Conditional Access Token Protection.',
      },
    },
    {
      id: 'u42-aitm-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:31:02.419',
      sourceNodeId: 'ests_cookie_replay',
      targetNodeId: 'm365_outlook_cloud',
      sourceLabel: '203.0.113.55 (Attacker)',
      targetLabel: 'Outlook Web (OWA)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'AADNonInteractiveSignIn',
      shortAction: 'COOKIE REPLAY',
      info: 'SessionId=7a91b2c0-1122-3344-5566-77889900aabb Replayed from New IP 203.0.113.55',
      sizeOrCode: 'MFA Bypassed',
      severity: 'CRITICAL',
      mitreId: 'T1550.004',
      explanation:
        'Less than 60 seconds later, the exact same SessionId (7a91b2c0-...) is used from a second external IP (203.0.113.55) to access Exchange Online.',
      rawLog: `{
  "Category": "AADNonInteractiveUserSignInLogs",
  "ResultType": "0",
  "UserPrincipalName": "cfo@corp.local",
  "IPAddress": "203.0.113.55",
  "AutonomousSystemNumber": 9009,
  "SessionId": "7a91b2c0-1122-3344-5566-77889900aabb",
  "ResourceDisplayName": "Office 365 Exchange Online"
}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Microsoft Entra ID AiTM Session Cookie Replay Detection',
        ruleCode: `title: Entra ID Session Token Replay Across Distinct ASNs
logsource:
  product: azure
  service: signinlogs
detection:
  selection:
    ResultType: 0
  condition: selection
level: critical`,
        mitigation:
          'Configure Continuous Access Evaluation (CAE) and automatic session revocation when anomalous token replay is detected.',
      },
    },
    {
      id: 'u42-aitm-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:31:48.990',
      sourceNodeId: 'ests_cookie_replay',
      targetNodeId: 'defender_identity_siem',
      sourceLabel: 'cfo@corp.local (Hijacked)',
      targetLabel: 'Exchange UnifiedAuditLog',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Exchange New-InboxRule',
      shortAction: 'HIDE INBOX RULE',
      info: 'Operation=New-InboxRule SubjectContainsWords="Security;Phishing;Invoice" MoveToFolder="RSS Feeds" MarkAsRead=True',
      sizeOrCode: 'Rule Created',
      severity: 'CRITICAL',
      mitreId: 'T1564.008',
      explanation:
        'Microsoft Threat Intelligence notes that Storm-0539 and Star Blizzard immediately create obfuscated Inbox rules moving security/finance emails to RSS Feeds or Conversation History.',
      rawLog: `{
  "CreationTime": "2024-11-13T10:31:48",
  "Operation": "New-InboxRule",
  "Workload": "Exchange",
  "UserId": "cfo@corp.local",
  "ClientIP": "203.0.113.55",
  "Parameters": [
    { "Name": "Name", "Value": "." },
    { "Name": "SubjectContainsWords", "Value": "Security;Phishing;Invoice;Wire" },
    { "Name": "MoveToFolder", "Value": "RSS Feeds" },
    { "Name": "MarkAsRead", "Value": "True" },
    { "Name": "StopProcessingRules", "Value": "True" }
  ]
}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Exchange Inbox Rule Moving Messages to RSS Feeds',
        ruleCode: `title: Suspicious Exchange Online Inbox Rule Hiding Messages
logsource:
  product: m365
  service: exchange
detection:
  selection:
    Operation:
      - 'New-InboxRule'
      - 'Set-InboxRule'
    Parameters.MoveToFolder|contains:
      - 'RSS'
      - 'Conversation History'
      - 'Deleted Items'
    Parameters.MarkAsRead: 'True'
  condition: selection
level: high`,
        mitigation:
          'Alert on any New-InboxRule or Set-InboxRule with single-character names (".", "_") or rules moving mail to RSS Feeds / Deleted Items.',
      },
    },
  ],
};

export const APT_MICROSOFT_THREAT_INTEL_SCENARIOS: AttackScenario[] = [
  MS_VOLT_TYPHOON_LOTL_SCENARIO,
  MS_MIDNIGHT_BLIZZARD_OAUTH_SCENARIO,
  MS_SALT_TYPHOON_TELECOM_SCENARIO,
  MS_FOREST_BLIZZARD_GOOSEEGG_SCENARIO,
  UNIT42_STAR_BLIZZARD_EVILGINX_AITM_SCENARIO,
];
