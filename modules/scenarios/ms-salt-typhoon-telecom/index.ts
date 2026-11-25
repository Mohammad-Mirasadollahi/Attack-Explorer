import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-salt-typhoon-telecom',
    briefing: {
      headline: 'Scenario Briefing: Salt Typhoon (GhostEmperor), Telecom Core Router Compromise & Guest Shell Pivot',
      storyAnalogy:
        'Imagine a telephone company’s central switching building. Instead of bugging a single office phone, the attacker slips into the core highway router (Cisco IOS XE), enables a hidden Linux maintenance room built right inside the router (Guest Shell), and taps the core fiber backbone (RADIUS / TACACS+ and packet capture pipes) so they can harvest network engineer credentials and silently copy traffic passing through the ISP.',
      plainSummary:
        'In this scenario (T1014, Microsoft & Kaspersky - Salt Typhoon (GhostEmperor): Demodex Rootkit & Telecom Core Capture) on NOC-WIN-01 (10.30.1), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: compromising the Edge Router Web UI, then activating the Router’s Linux "Guest Shell", then sniffing Core TACACS+ / RADIUS Credentials. Steps #1–#3 walk that chain end-to-end by covering Compromising the Edge Router Web UI, then Activating the Router’s Linux "Guest Shell", then Sniffing Core TACACS+ / RADIUS Credentials, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Salt Typhoon Operator & Edge Telecom Router), trace the IOS XE privilege escalation and Linux Guest Shell container activation on Node ③/④ (Core ISP Router & Guest Shell Container), and follow the credential capture and core network pivot to Node ⑤, monitored by Node ⑥ (Telecom SOC / NetFlow & Syslog SIEM).',
      documentedAdvisory: 'Joint CISA/NSA/FBI Telecom Infrastructure Advisory (2024) · Microsoft Salt Typhoon · MITRE T1190 / T1610 / T1040',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Compromising the Edge Router Web UI & Creating a Level-15 Admin Account',
        storyAnalogy:
          'The intruder exploits a flaw in the router’s front management web desk (webui_wsma_http) to forge a "Privilege 15 Master Engineer" badge right inside the router’s local user roster.',
        simpleExplanation:
          'From NOC jump host NOC-WIN-01 (10.30.1.10), with stolen data later staged toward C2 203.0.113.195:443, the attacker exploits an exposed management interface or captured configuration credential on a telecom edge router (such as the Cisco IOS XE Web UI / webui_wsma_http endpoint) to execute privileged configuration commands and create a hidden local user account with privilege 15 (in Cisco IOS XE, Privilege Level 15 is the highest "enable" administrative tier, granting unrestricted control over routing tables, packet capture, and system containers).',
        howItWorksInPractice:
          'Creating a local fallback account with username <name> privilege 15 secret <hash> allows the attacker to log directly into the router with full administrative authority whenever local authentication fallback is enabled or by bypassing centralized AAA checks. In the documented Sysmon EID 6 exchange from Salt Typhoon C2 Relay to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK Event 6 (confirming that the BYOVD DRIVER LOAD request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 DEMODEX KERNEL ROOTKIT MINIFILTER & REGISTRY HIDING).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② into Node ③ (Telecom Edge/Core Router IOS XE), and return arrow ⇠#1 granting Privilege 15 CLI execution.',
        detectionAndEvidence:
          'Correlate Cisco IOS XE syslog %SYS-5-CONFIG_I: Configured from http by console (which proves a configuration change arrived through the web UI rather than authorized SSH/CLI) with unexpected username ... privilege 15 entries in central AAA accounting logs. Correlate Sysmon or Windows Security Event telemetry for T1068 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1610',
        plainTitle: 'Activating the Router’s Linux "Guest Shell" Container to Hide Persistent Implants',
        storyAnalogy:
          'Inside the router, there is a legitimate, factory-built Linux workshop (guestshell) meant for automation scripts. When an admin inspects the normal router command line (show processes), they cannot see inside that Linux workshop, making it the perfect hidden room to run a covert SSH tunnel.',
        simpleExplanation:
          'Instead of dropping files onto the router’s standard flash storage (where any network engineer running "dir flash:" would immediately spot an unfamiliar file), the attacker enables iox (Cisco’s Application Hosting framework) and runs guestshell enable (which boots a built-in Linux container inside the router, originally designed by Cisco so engineers could run Python automation scripts, but abused by the attacker because processes and files inside the Linux Guest Shell are completely hidden from standard IOS CLI commands like "show processes").',
        howItWorksInPractice:
          'Inside the Guest Shell Linux container, the attacker has a full bash environment with network access to the router’s interfaces, allowing them to compile and run custom C2 tunnels, SSH relays, and packet sniffers inside an isolated container where no traditional endpoint EDR agent can be installed. In the documented Kernel Pool Scan exchange from Perimeter Firewall & NDR Tap to Telecom NOC Jump Server, Telecom NOC Jump Server responds with ALERT 96 KB Ring-0 (confirming that the DEMODEX ROOTKIT request succeeded on Telecom NOC Jump Server and establishing the runtime state required for Step #3 TELECOM TACACS+ CREDENTIAL CAPTURE & CORE ROUTER PIVOT).',
        diagramAlignment:
          'On the diagram, arrow #2→ enables iox / guestshell inside Node ④ (Router Linux Guest Shell Container), and ⇠#2 launches the persistent Linux C2 tunnel.',
        detectionAndEvidence:
          'Alert immediately on Cisco IOS XE syslog %IOX-6-GUESTSHELL_ENABLED (which fires whenever the embedded Linux Guest Shell container starts) and audit configurations for unexpected guestshell NAT or VirtualPortGroup interfaces where operations do not use IOx containers. Correlate Sysmon or Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1040',
        plainTitle: 'Sniffing Core TACACS+ / RADIUS Credentials & Pivoting Into Core Telecom Enclaves',
        storyAnalogy:
          'From their hidden room inside the highway router, the attacker clips a wiretap (EPC / tcpdump) onto the router’s management line, records the passwords of senior network engineers as they log in, and uses those keys to walk into the core switching center.',
        simpleExplanation:
          'From inside the compromised router, the attacker activates Embedded Packet Capture (EPC, monitor capture, the router’s built-in traffic recording feature) or runs tcpdump inside Guest Shell to sniff management-plane traffic passing through the router. They intercept TACACS+ (TCP port 49) and RADIUS (UDP port 1812) authentication packets alongside weak/obfuscated Type-7 passwords in router configs (harvesting the credentials of senior telecom engineers so the attacker can log into core MPLS/BGP backbone routers as a legitimate administrator).',
        howItWorksInPractice:
          'Because core telecom routers sit at the intersection of administrative management networks and subscriber trunks, passive packet capture on the router itself harvests authentication secrets in transit without generating noisy port scans across the internal network. In the documented Suricata TACACS+/SSH exchange from Telecom NOC Jump Server to Demodex Kernel Rootkit (Ring-0), Demodex Kernel Rootkit (Ring-0) responds with ALERT TCP/49 & :22 (confirming that the CORE ROUTER PIVOT request succeeded on Demodex Kernel Rootkit (Ring-0) and completing the final execution objective of Microsoft & Kaspersky, Salt Typhoon (GhostEmperor): Demodex Rootkit & Telecom Core Capture).',
        diagramAlignment:
          'On the diagram, arrow #3→ captures credentials and pivots from Node ④ into Node ⑤ (Core Telecom Management & Routing Plane), while Node ⑥ (Telecom SIEM) correlates AAA and Guest Shell anomalies.',
        detectionAndEvidence:
          'Audit carrier routers for unauthorized monitor capture (Embedded Packet Capture) sessions, unexplained GRE or IPsec tunnel interfaces, and anomalous TACACS+ logins originating from router loopback addresses (CISA Telecom Hardening Guide high-priority indicators). Correlate Sysmon or Windows Security Event telemetry for T1040 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a national telephone switching center whose exterior maintenance console gets compromised to mint a brand-new supreme-level supervisor badge. Rather than running noisy programs on the main switchboard where telecom engineers watch closely, the spy turns on a hidden built-in utility side room inside the switch itself to stash permanent tools, then silently clips wiretaps straight onto the trunk lines to capture core network passwords and ride deep into the national telecom backbone.',
      storyMappings: [
        {
          storyTerm: 'Minting a supreme-level supervisor badge via the exterior console',
          technicalTerm: 'Exploiting Cisco IOS XE web UI to create a local privilege-15 administrator account',
          tone: 'amber',
        },
        {
          storyTerm: 'Turning on a hidden built-in utility side room inside the switch',
          technicalTerm: 'Activating IOS XE Guest Shell container (%IOX-6-GUESTSHELL_ENABLED) for stealth persistence',
          tone: 'sky',
        },
        {
          storyTerm: 'Clipping silent wiretaps onto trunk lines for core passwords',
          technicalTerm: 'Unauthorized Embedded Packet Capture (EPC) sniffing TACACS+ and RADIUS credentials',
          tone: 'rose',
        },
        {
          storyTerm: 'Riding deep into the national telecom backbone',
          technicalTerm: 'Creating covert GRE/IPsec tunnels and pivoting via router loopback addresses',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Entering through an exposed exterior switchboard web dashboard, the spy modifies the device\'s live configuration straight from the front panel to carve out a brand-new highest-privilege administrator account.',
        storyMappings: [
          {
            storyTerm: 'Exposed exterior router web dashboard',
            technicalTerm: 'Internet-reachable Cisco IOS XE HTTP/HTTPS management web UI',
            tone: 'amber',
          },
          {
            storyTerm: 'Carving out a highest-privilege administrator account',
            technicalTerm: 'Creating an unauthorized local username ... privilege 15 admin account',
            tone: 'sky',
          },
          {
            storyTerm: 'Configuration ledger noting an odd web-driven edit',
            technicalTerm: 'IOS XE syslog %SYS-5-CONFIG_I: Configured from http by console',
            tone: 'rose',
          },
          {
            storyTerm: 'Central accounting log mismatch',
            technicalTerm: 'AAA accounting logs recording privilege-15 account creation outside change windows',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Cisco IOS XE syslog %SYS-5-CONFIG_I: Configured from http by console (which proves a configuration change arrived through the web UI rather than authorized SSH/CLI) with unexpected username ... privilege 15 entries in central AAA accounting logs.',
      },
      2: {
        storyAnalogy:
          'Knowing that telecom engineers rarely inspect the switch\'s built-in utility closet, the spy switches on that hidden back room, attaches a private side corridor to it, and parks custom espionage tools safely away from ordinary switchboard inspections.',
        storyMappings: [
          {
            storyTerm: 'Switch\'s built-in utility closet',
            technicalTerm: 'Cisco IOS XE Linux Guest Shell (IOx container) environment',
            tone: 'amber',
          },
          {
            storyTerm: 'Private side corridor attached to the closet',
            technicalTerm: 'Unauthorized VirtualPortGroup and Guest Shell NAT forwarding interfaces',
            tone: 'sky',
          },
          {
            storyTerm: 'Parking espionage tools away from ordinary switchboard checks',
            technicalTerm: 'Persistent Linux implants hidden outside standard IOS XE show running-config views',
            tone: 'rose',
          },
          {
            storyTerm: 'Loud warning message on unconfigured switches',
            technicalTerm: 'IOS XE syslog %IOX-6-GUESTSHELL_ENABLED firing when Guest Shell is unused by ops',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert immediately on Cisco IOS XE syslog %IOX-6-GUESTSHELL_ENABLED (which fires whenever the embedded Linux Guest Shell container starts) and audit configurations for unexpected guestshell NAT or VirtualPortGroup interfaces where operations do not use IOx containers.',
      },
      3: {
        storyAnalogy:
          'From inside the compromised edge switch, the spy turns on the switch\'s built-in traffic recorder to scoop up administrator passcodes crossing the trunk lines, builds secret shielded bypass pipes, and rides straight into the core carrier switching fabric.',
        storyMappings: [
          {
            storyTerm: 'Switch\'s built-in traffic recorder scooping up passcodes',
            technicalTerm: 'Unauthorized Embedded Packet Capture (monitor capture / EPC) sniffing TACACS+ / RADIUS',
            tone: 'amber',
          },
          {
            storyTerm: 'Secret shielded bypass pipes across the carrier',
            technicalTerm: 'Unauthorized GRE or IPsec tunnels bridging external attacker hosts into core networks',
            tone: 'sky',
          },
          {
            storyTerm: 'Pivoting from the switch\'s own internal identity',
            technicalTerm: 'Anomalous TACACS+ administrative logins originating from router loopback addresses',
            tone: 'rose',
          },
          {
            storyTerm: 'Deep national carrier foothold',
            technicalTerm: 'Salt Typhoon strategic persistence across telecommunications core infrastructure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Audit carrier routers for unauthorized monitor capture (Embedded Packet Capture) sessions, unexplained GRE or IPsec tunnel interfaces, and anomalous TACACS+ logins originating from router loopback addresses (CISA Telecom Hardening Guide high-priority indicators). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1040 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
