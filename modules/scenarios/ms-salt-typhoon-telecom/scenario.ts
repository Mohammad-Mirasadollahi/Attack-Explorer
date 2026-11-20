import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
