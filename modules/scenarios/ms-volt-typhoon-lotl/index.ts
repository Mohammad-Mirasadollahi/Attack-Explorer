import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-volt-typhoon-lotl',
    briefing: {
      headline: 'Scenario Briefing: Volt Typhoon (CISA AA24-038A): "Living off the Land" & Extracting ntds.dit Without Malware',
      storyAnalogy:
        'Imagine an infiltrator who enters a high-security facility carrying zero weapons or burglar tools in their pockets. Instead, they pick up the facility’s own maintenance clipboard (wmic.exe), use the building’s built-in port-forwarding intercom (netsh interface portproxy) to relay messages through retired home routers (KV-Botnet), and ask the facility’s official backup machine (ntdsutil.exe) to print a full copy of the master key vault (ntds.dit). Because every single action is performed by an official, factory-installed Windows utility, file-based antivirus scanners see zero foreign malware.',
      plainSummary:
        'In this scenario (T1003.003, Microsoft & CISA - Volt Typhoon: Living-off-the-Land ntdsutil IFM & netsh Portproxy) on SRV-MGMT-01 (10.10.15), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: routing Through KV-Botnet SOHO Routers, then using Built-in ntdsutil.exe to Dump Every, then multi-Hop Internal Relay via netsh interface. Steps #1–#3 walk that chain end-to-end by covering Routing Through KV-Botnet SOHO Routers, then Using Built-in ntdsutil.exe to Dump Every, then Multi-Hop Internal Relay via netsh interface, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (KV-Botnet SOHO Edge Node 198.51.100.14), pivot into Node ③ (IT Jump Server SRV-MGMT-01 10.10.15.22 via wmic / netsh portproxy), extract ntds.dit and SYSTEM hive on Node ④/⑤ (Domain Controller CORP-DC01 10.10.0.5 via ntdsutil.exe PID 6412), while Node ⑥ (SIEM / Defender for Identity) correlates the anomalous native-binary command lines.',
      documentedAdvisory: 'CISA/NSA/FBI/Microsoft Joint Advisory AA24-038A · Microsoft Threat Intelligence Volt Typhoon · MITRE T1003.003 / T1090.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1047',
        plainTitle: 'Routing Through KV-Botnet SOHO Routers & Lateral WMI Execution to CORP-DC01',
        storyAnalogy:
          'Rather than calling the target’s server from an overseas phone number that would raise an instant red flag, the operator routes the call through a neighborhood home router down the street (KV-Botnet 198.51.100.14) and uses the jump server’s built-in maintenance intercom (wmic process call create) to issue commands on the Domain Controller.',
        simpleExplanation:
          'Instead of connecting from a rented cloud VPS that threat-intelligence feeds would block, the attacker connects through a compromised small-office/home-office (SOHO) router in the same geographic region (KV-Botnet node 198.51.100.14, so geo-IP filters see normal local ISP traffic) into the IT Jump Server SRV-MGMT-01 (10.10.15.22). From SRV-MGMT-01, the operator executes wmic /node:10.10.0.5 process call create "cmd.exe /Q /c ntdsutil \"ac i ntds\" \"ifm\"..." toward Domain Controller CORP-DC01 (10.10.0.5), causing WmiPrvSE.exe on CORP-DC01 to spawn the command under PID 6412 and return ReturnValue = 0 (confirming remote process creation over DCOM/RPC without dropping any third-party remote-execution binary).',
        howItWorksInPractice:
          'When wmic.exe connects over TCP/135 (RPC Endpoint Mapper) and dynamic DCOM ports to CORP-DC01 (10.10.0.5), the remote WMI provider host (WmiPrvSE.exe) spawns cmd.exe / ntdsutil.exe (PID 6412) under the authenticated administrator context (recording Sysmon Event ID 1 on CORP-DC01 with ParentImage = WmiPrvSE.exe). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (SRV-MGMT-01 10.10.15.22) to Node ⑤ (CORP-DC01 10.10.0.5), where WmiPrvSE.exe spawns PID 6412.',
        detectionAndEvidence:
          'Documented in CISA AA24-038A & Sysmon EventID 1 on CORP-DC01 (10.10.0.5): ParentImage = WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm" (PID 6412).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1003.003',
        plainTitle: 'Using Built-in ntdsutil.exe ("ifm") to Dump Every Domain Password Hash (ESENT Event ID 325)',
        storyAnalogy:
          'The Domain Controller keeps its master password book (ntds.dit) locked inside a glass case while Windows is running so nobody can copy the file directly. Instead of smashing the glass, the infiltrator asks the official Active Directory maintenance robot (ntdsutil "ac i ntds" "ifm") to take a temporary backup snapshot and place an unlocked copy right into C:\\Windows\\Temp\\tmp_ad\\.',
        simpleExplanation:
          'Active Directory exclusively locks C:\\Windows\\NTDS\\ntds.dit (the master database file containing the password hashes of every employee, service, and Domain Admin in the company) while the Domain Controller is running, so normal copy commands fail. Running under PID 6412 on CORP-DC01 (10.10.0.5), ntdsutil "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\tmp_ad" (where "ac i ntds" selects the Active Directory database instance, and "ifm" / "create full" instructs Microsoft’s signed backup tool to take a Volume Shadow Copy snapshot) writes an unlocked copy of C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit plus the registry\\SYSTEM decryption hive (emitting ESENT Application Event ID 325 confirming the new database file was created).',
        howItWorksInPractice:
          'The ifm (Install From Media, originally designed so administrators could promote a new Domain Controller from a backup folder) command in ntdsutil.exe (PID 6412) automatically invokes vssvc.exe to snapshot the volume, extracts both Active Directory\\ntds.dit and registry\\SYSTEM (which holds the BootKey required to decrypt the NTLM and Kerberos keys inside ntds.dit offline), and removes the temporary shadow copy upon completion.',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) runs inside CORP-DC01 (10.10.0.5) as ntdsutil.exe (PID 6412) creates C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit and logs ESENT Event ID 325.',
        detectionAndEvidence:
          'Documented in CISA AA24-038A: Application Log ESENT EventID 325 ("Database engine created a new database C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit") correlated with Sysmon EventID 1 for ntdsutil.exe (PID 6412).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1090.001',
        plainTitle: 'Multi-Hop Internal Relay via netsh interface portproxy (Sysmon Event ID 13)',
        storyAnalogy:
          'Finally, to keep a persistent hidden hallway open into the Domain Controller without installing any third-party proxy software, the infiltrator programs the Windows jump server’s built-in port forwarder (netsh interface portproxy) to quietly relay port 8443 straight to the Domain Controller’s RDP port (10.10.0.5:3389).',
        simpleExplanation:
          'To maintain stealthy multi-hop access and relay staged archives out through the jump server SRV-MGMT-01 (10.10.15.22), the attacker runs C:\\Windows\\System32\\netsh.exe (PID 6890): netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8443 connectaddress=10.10.0.5 connectport=3389 (instructing Windows’ built-in IP Helper service to forward inbound TCP port 8443 traffic directly to CORP-DC01 at 10.10.0.5:3389 without dropping any custom proxy binary to disk).',
        howItWorksInPractice:
          'When netsh.exe (PID 6890) executes the portproxy add v4tov4 command, the Windows kernel/service configuration writes the forwarding rule into HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443 with value 10.10.0.5/3389 (persisting the tunnel across reboots inside the native IpHlpSvc service while triggering Sysmon Event ID 13 RegistryEvent). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) configures netsh.exe (PID 6890) on SRV-MGMT-01 (10.10.15.22) to relay traffic to 10.10.0.5:3389, while Node ⑥ (SIEM) alerts on Sysmon Event ID 13.',
        detectionAndEvidence:
          'Documented in CISA AA24-038A & Sysmon EventID 13 (RegistryValueSet): ProcessId = 6890 (netsh.exe) setting TargetObject = HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443 to Details = 10.10.0.5/3389.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a patient industrial spy who never carries foreign lockpicks or masks across the border. First, the spy blends in by riding ordinary neighborhood delivery vans right up to the factory gate; next, the spy uses the factory own official backup photocopier to copy the locked master employee vault ledger cleanly; finally, the spy props silent mirror-boxes inside a hallway utility closet to bounce stolen parcels back out through standard building plumbing.',
      storyMappings: [
        {
          storyTerm: 'Riding ordinary neighborhood delivery vans to the gate',
          technicalTerm: 'Proxying connections through compromised KV-Botnet SOHO home and office routers',
          tone: 'amber',
        },
        {
          storyTerm: 'Using the factory own official backup photocopier',
          technicalTerm: 'Built-in ntdsutil.exe "ac i ntds" "ifm" dumping locked ntds.dit without malware',
          tone: 'sky',
        },
        {
          storyTerm: 'Silent mirror-boxes wired inside a hallway closet',
          technicalTerm: 'Windows netsh interface portproxy multi-hop traffic relay (Sysmon EventID 13)',
          tone: 'rose',
        },
        {
          storyTerm: 'Carrying zero foreign lockpicks',
          technicalTerm: 'Pure Living-off-the-Land (LotL) execution using signed native Windows binaries',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Instead of arriving in a marked foreign truck that gate guards instantly stop, the spy hops through a chain of ordinary local neighborhood vans and issues a quiet remote maintenance instruction over the building standard management intercom straight to the main vault office.',
        storyMappings: [
          {
            storyTerm: 'Chain of ordinary local neighborhood vans',
            technicalTerm: 'KV-Botnet proxy mesh of compromised small-office/home-office (SOHO) routers',
            tone: 'amber',
          },
          {
            storyTerm: 'Standard management intercom',
            technicalTerm: 'Windows Management Instrumentation (WMI / WmiPrvSE.exe) lateral execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Main vault office',
            technicalTerm: 'Active Directory Domain Controller CORP-DC01 (10.10.0.5)',
            tone: 'rose',
          },
          {
            storyTerm: 'Quiet remote maintenance instruction',
            technicalTerm: 'WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm"',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate CISA AA24-038A indicators with Sysmon EventID 1 (Process Creation recording exact parent-child lineage and arguments) on CORP-DC01 showing WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm" (high-confidence proof of Living-off-the-Land credential harvesting on a Domain Controller).',
      },
      2: {
        storyAnalogy:
          'Because the master password ledger stays clamped shut under heavy lock while the office is open, the spy simply flips on the office own official emergency migration photocopier, cleanly copying both the ledger book and its matching key drawer into a neat staging tray.',
        storyMappings: [
          {
            storyTerm: 'Master password ledger clamped shut during business hours',
            technicalTerm: 'Exclusively locked Active Directory database C:\\Windows\\NTDS\\ntds.dit',
            tone: 'amber',
          },
          {
            storyTerm: 'Official emergency migration photocopier',
            technicalTerm: 'Signed Windows utility ntdsutil.exe invoked with Install From Media (ifm) mode',
            tone: 'sky',
          },
          {
            storyTerm: 'Matching key drawer copied alongside the ledger',
            technicalTerm: 'SYSTEM registry hive saved alongside ntds.dit to decrypt every domain hash',
            tone: 'rose',
          },
          {
            storyTerm: 'Built-in engine stamp left in the copier log',
            technicalTerm: 'ESENT Application Event logs documenting snapshot creation and database streaming',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To keep moving quietly through internal corridors without ever installing foreign radio gear, the spy configures a built-in hallway forwarding mirror on an intermediate jump desk that bounces traffic silently from inner rooms straight out to the external neighborhood van.',
        storyMappings: [
          {
            storyTerm: 'Built-in hallway forwarding mirror',
            technicalTerm: 'Windows netsh interface portproxy add v4tov4 TCP relay rule',
            tone: 'amber',
          },
          {
            storyTerm: 'Intermediate jump desk',
            technicalTerm: 'Internal management jump host SRV-MGMT-01 (10.10.15.20)',
            tone: 'sky',
          },
          {
            storyTerm: 'Permanent brass label bolted inside the control panel',
            technicalTerm: 'Registry write under HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp',
            tone: 'rose',
          },
          {
            storyTerm: 'Silent alarm noting the panel change',
            technicalTerm: 'Sysmon EventID 13 (RegistryValueSet) capturing unauthorized PortProxy configuration',
            tone: 'emerald',
          },
        ],
      },
    },
  };
