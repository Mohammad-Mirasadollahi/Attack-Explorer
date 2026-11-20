import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
