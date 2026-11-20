import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'elastic-apt41-dustpan-stealthvector',
  code: 'T1620',
  name: 'Elastic & Mandiant — APT41 (Brass Typhoon): DodgeBox, Call-Stack Spoofing & DUSTPAN Loader',
  shortSubtitle: 'Elastic Security Labs / Mandiant · DLL Side-Loading, Synthetic Stack Frames & ChaCha20 DUSTTRAP',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview:
    'Documented by Elastic Security Labs and Google Threat Intelligence / Mandiant (2024), APT41 (Brass Typhoon / Wicked Panda) deployed an updated arsenal featuring DodgeBox and DUSTPAN loaders to deliver the multi-stage DUSTTRAP implant and Cobalt Strike. The attack chain side-loads a malicious DLL, uses synthetic call-stack spoofing (faking RtlUserThreadStart and BaseThreadInitThunk return addresses) during NtAllocateVirtualMemory syscalls to evade EDR stack-walking, and decrypts ChaCha20-Poly1305 payloads in memory.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Elastic Security Labs & Mandiant — APT41 DodgeBox / DUSTPAN / DUSTTRAP Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1574.002 (DLL Side-Loading) · T1055 (Call-Stack Spoofing) · T1620 (Reflective Load)',
    },
    {
      term: 'EVASION TRADECRAFT',
      value: 'Synthetic Call-Stack Spoofing (Kernel32!BaseThreadInitThunk + Ntdll!RtlUserThreadStart)',
    },
    {
      term: 'PAYLOAD CRYPTO',
      value: 'AES-GCM / ChaCha20-Poly1305 In-Memory Decryption (DUSTPAN -> DUSTTRAP)',
    },
  ],
  nodes: [
    {
      id: 'apt41_cf_worker_c2',
      label: 'APT41 Cloudflare Worker C2',
      sublabel: 'workers.dev HTTPS Relay (:443)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'APT41 Serverless C2 Fronting Infrastructure',
        pidOrPort: 'HTTPS :443 (TLS 1.3 / DoH)',
        privilege: 'External APT C2',
        artifacts: [
          'C2 Domain Fronting via Cloudflare Workers',
          'ChaCha20-Poly1305 Encrypted Tasking',
        ],
        description:
          'APT41 C2 relay hosted behind legitimate CDN/serverless worker endpoints to blend outbound DUSTTRAP traffic with normal enterprise HTTPS.',
      },
    },
    {
      id: 'wks_dodgebox_host',
      label: 'Signed Host Binary (taskhost.exe)',
      sublabel: 'PID 4920 · SRV-APP-04 (10.10.12.30)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 Application Host',
        pidOrPort: 'PID 4920 · Side-Loaded ffmpeg.dll (DodgeBox)',
        privilege: 'High Integrity',
        artifacts: [
          'C:\\ProgramData\\AppService\\taskhost.exe (Signed)',
          'C:\\ProgramData\\AppService\\ffmpeg.dll (DodgeBox / DUSTPAN)',
        ],
        description:
          'Legitimate signed executable used to side-load APT41 DodgeBox / DUSTPAN loader DLL.',
      },
    },
    {
      id: 'stack_spoof_engine',
      label: 'DodgeBox Stack-Spoofing & DUSTTRAP',
      sublabel: 'Synthetic RSP Frames -> NtAllocateVirtualMemory',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'In-Memory Reflective Loader & Call-Stack Spoofer',
        pidOrPort: '0x000001A8C0000000 (RW -> RX)',
        privilege: 'User-Mode Evasion Engine',
        artifacts: [
          'Spoofed Frame 1: kernel32.dll!BaseThreadInitThunk+0x14',
          'Spoofed Frame 2: ntdll.dll!RtlUserThreadStart+0x21',
          'Decrypted DUSTTRAP Modular Plugin Manager',
        ],
        description:
          'Constructs fake stack frames pointing to legitimate DLLs before executing indirect syscalls, hiding the unbacked loader origin from ETW stack-walks.',
      },
    },
    {
      id: 'internal_key_vault',
      label: 'Enterprise Code-Signing & AD',
      sublabel: '10.10.1.15 (Build & Key Server)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Internal Build & Certificate Server',
        pidOrPort: 'SMB :445 / WinRM :5985',
        privilege: 'High-Value Asset',
        artifacts: [
          'DUSTTRAP Plugin: Credential & Certificate Collector',
          'Lateral WMI Execution',
        ],
        description:
          'Internal build server targeted by DUSTTRAP post-exploitation plugins to harvest code-signing certificates and domain credentials.',
      },
    },
    {
      id: 'elastic_etw_siem',
      label: 'Elastic Defend & ETW Ti Sensor',
      sublabel: 'ETW Stack-Walk & Sysmon EID 7 / 10',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Elastic Security EDR & Kernel ETW Sensor',
        pidOrPort: 'Microsoft-Windows-Threat-Intelligence',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: Call-Stack Spoofing & Unbacked PE Header Scrubbing',
          'YARA: Windows_Trojan_Dustpan / DodgeBox',
        ],
        description:
          'Correlates unsigned DLL side-loading with anomalous thread call-stacks and PE header zeroing in virtual memory.',
      },
    },
  ],
  processTree: [
    {
      pid: 4920,
      ppid: 1940,
      name: 'taskhost.exe (Relocated)',
      commandLine: 'C:\\ProgramData\\AppService\\taskhost.exe',
      user: 'CORP\\svc_app',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryW("ffmpeg.dll")',
        'RtlLookupFunctionEntry (Stack Frame Calculation)',
        'NtAllocateVirtualMemory (Indirect Syscall)',
        'NtProtectVirtualMemory (PAGE_EXECUTE_READ)',
      ],
      memoryBlocks: [
        {
          address: '0x000001A8C0000000',
          section: 'DUSTTRAP Reflective Implant (MZ Scrubbed)',
          permissions: 'R-X',
          size: '312 KB',
          status: 'injected',
          description:
            'Reflectively mapped DUSTTRAP implant with zeroed DOS/PE headers and spoofed thread call stack.',
          hexPreview: '00 00 00 00 00 00 00 00 00 00 00 00 48 89 5C 24',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'DODGEBOX / DUSTPAN DLL SIDE-LOADING & ENV KEYING',
      subtitle: 'Relocated signed binary loads malicious ffmpeg.dll and validates host key',
      description:
        'APT41 stages a legitimate signed Windows binary alongside a trojanized DLL (ffmpeg.dll, containing DodgeBox or DUSTPAN) in C:\\ProgramData\\AppService\\. Upon execution, the DLL checks environmental guardrails (domain name / computer name hash) before decrypting the next-stage payload.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1574.002',
      mitreTechniqueName: 'Hijack Execution Flow: DLL Side-Loading',
      activeNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine', 'elastic_etw_siem'],
      compromisedNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine'],
      keySpecs: [
        { term: 'LOADER FAMILY', value: 'DodgeBox / DUSTPAN (APT41 / Brass Typhoon)' },
        { term: 'SIDE-LOADED DLL', value: 'C:\\ProgramData\\AppService\\ffmpeg.dll (Unsigned)' },
        { term: 'GUARDRAIL', value: 'Environmental Keying (GetComputerNameExW Hash Check)' },
      ],
    },
    {
      index: 2,
      title: 'CALL-STACK SPOOFING & REFLECTIVE DUSTTRAP MAPPING',
      subtitle: 'Synthesizing legitimate unwind frames via RtlLookupFunctionEntry before syscall',
      description:
        'Before invoking NtAllocateVirtualMemory and NtProtectVirtualMemory, DodgeBox parses the .pdata exception directory of kernel32.dll and ntdll.dll to construct a synthetic call stack (BaseThreadInitThunk -> RtlUserThreadStart). It maps the ChaCha20-decrypted DUSTTRAP implant into memory, transitions permissions from RW to RX, and zeroes out the MZ/PE headers.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1620',
      mitreTechniqueName: 'Reflective Code Loading',
      activeNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine', 'elastic_etw_siem'],
      compromisedNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine'],
      keySpecs: [
        { term: 'EVASION TECHNIQUE', value: 'Synthetic Call-Stack Spoofing (.pdata Unwind Gadget)' },
        { term: 'MEMORY OPSEC', value: 'RW -> RX Transition + PE Header Zeroing (0x00)' },
        { term: 'DECRYPTED IMPLANT', value: 'DUSTTRAP Multi-Plugin Backdoor (ChaCha20-Poly1305)' },
      ],
    },
    {
      index: 3,
      title: 'CLOUDFLARE WORKER C2 & PLUGIN EXECUTION',
      subtitle: 'DUSTTRAP loads modular plugins and beacons over TLS 1.3',
      description:
        'DUSTTRAP initializes its in-memory plugin orchestrator, loading modules for credential harvesting, active directory reconnaissance, and WMI lateral movement toward the enterprise build server, while communicating over TLS 1.3 to an APT41 Cloudflare Worker relay.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.001',
      mitreTechniqueName: 'Application Layer Protocol: Web Protocols',
      activeNodeIds: ['stack_spoof_engine', 'apt41_cf_worker_c2', 'internal_key_vault', 'elastic_etw_siem'],
      compromisedNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine', 'internal_key_vault'],
      keySpecs: [
        { term: 'C2 FRONTING', value: 'HTTPS TLS 1.3 via Serverless Worker Endpoint' },
        { term: 'PLUGIN MODULES', value: 'Shell, FileOps, TokenManip, PortForward, Keylogger' },
        { term: 'TARGET ASSET', value: 'Enterprise Build & Code-Signing Server (10.10.1.15)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'el-apt41-1',
      no: 1,
      stageIndex: 1,
      timestamp: '02:31:10.405',
      sourceNodeId: 'wks_dodgebox_host',
      targetNodeId: 'stack_spoof_engine',
      sourceLabel: 'taskhost.exe (PID 4920)',
      targetLabel: 'ffmpeg.dll (DodgeBox)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'SIDELOAD DODGEBOX',
      info: 'Image=C:\\ProgramData\\AppService\\taskhost.exe ImageLoaded=C:\\ProgramData\\AppService\\ffmpeg.dll Signed=false',
      sizeOrCode: 'Unsigned DLL',
      severity: 'HIGH',
      mitreId: 'T1574.002',
      explanation:
        'A relocated Windows system binary (taskhost.exe) running from C:\\ProgramData\\AppService\\ loads an unsigned ffmpeg.dll containing the APT41 DodgeBox/DUSTPAN loader.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>SRV-APP-04.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\AppService\\taskhost.exe</Data>
    <Data Name="ImageLoaded">C:\\ProgramData\\AppService\\ffmpeg.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Relocated System Binary Side-Loading Unsigned DLL from ProgramData',
        ruleCode: `title: APT41 DodgeBox / DUSTPAN DLL Side-Loading Pattern
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|startswith: 'C:\\ProgramData\\'
    Signed: 'false'
  condition: selection
level: high`,
        mitigation:
          'Audit and block execution of Windows system binaries relocated outside C:\\Windows\\System32\\.',
      },
    },
    {
      id: 'el-apt41-2',
      no: 2,
      stageIndex: 2,
      timestamp: '02:31:11.092',
      sourceNodeId: 'stack_spoof_engine',
      targetNodeId: 'elastic_etw_siem',
      sourceLabel: 'DodgeBox Loader',
      targetLabel: 'ETW Threat-Intel',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'ETW Ti / CallStack',
      shortAction: 'STACK SPOOF + RX',
      info: 'NtProtectVirtualMemory(0x01A8C0000000, PAGE_EXECUTE_READ) with Synthetic Unwind Gadgets',
      sizeOrCode: '312 KB RX',
      severity: 'CRITICAL',
      mitreId: 'T1620',
      explanation:
        'DodgeBox constructs synthetic stack frames via RtlLookupFunctionEntry and scrubs the PE header after mapping DUSTTRAP into private executable memory.',
      rawLog: `[ELASTIC_DEFEND_CALLSTACK_ANOMALY]
Process: C:\\ProgramData\\AppService\\taskhost.exe (PID 4920)
Syscall: NtProtectVirtualMemory (RW -> RX) at 0x000001A8C0000000
CallStack:
  [0] ntdll.dll!NtProtectVirtualMemory+0x14
  [1] kernelbase.dll!VirtualProtectEx+0x32 (Gadget Return without preceding CALL instruction)
  [2] kernel32.dll!BaseThreadInitThunk+0x14
  [3] ntdll.dll!RtlUserThreadStart+0x21`,
      detectionRule: {
        type: 'YARA',
        title: 'APT41 DodgeBox / DUSTPAN Reflective Loader Signature',
        ruleCode: `rule APT41_DodgeBox_Dustpan_Loader {
  meta:
    author = "Elastic Security Labs / Mandiant"
    actor = "APT41 (Brass Typhoon)"
  strings:
    $chacha = "expand 32-byte k" ascii
    $api1 = "RtlLookupFunctionEntry" ascii
    $api2 = "NtAllocateVirtualMemory" ascii
  condition:
    uint16(0) == 0x5A4D and all of them
}`,
        mitigation:
          'Inspect thread call-stacks where return addresses point to instructions not preceded by a valid CALL opcode (call-stack spoofing detection).',
      },
    },
    {
      id: 'el-apt41-3',
      no: 3,
      stageIndex: 3,
      timestamp: '02:31:14.780',
      sourceNodeId: 'wks_dodgebox_host',
      targetNodeId: 'apt41_cf_worker_c2',
      sourceLabel: '10.10.12.30 (DUSTTRAP)',
      targetLabel: 'workers.dev:443',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 3',
      shortAction: 'WORKER TLS C2',
      info: 'Image=C:\\ProgramData\\AppService\\taskhost.exe DestinationHostname=telemetry-sync.workers.dev:443',
      sizeOrCode: 'TLS 1.3',
      severity: 'HIGH',
      mitreId: 'T1071.001',
      explanation:
        'DUSTTRAP uses serverless worker domains over TLS 1.3 to receive modular plugins and exfiltrate stolen certificates and credentials.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>3</EventID>
    <Computer>SRV-APP-04.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\AppService\\taskhost.exe</Data>
    <Data Name="DestinationHostname">telemetry-sync.workers.dev</Data>
    <Data Name="DestinationPort">443</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'System Binary Connecting to Serverless Worker C2 Domains',
        ruleCode: `title: Suspicious Outbound Connection to Serverless Worker Domain
logsource:
  category: network_connection
  product: windows
detection:
  selection:
    DestinationHostname|endswith:
      - '.workers.dev'
      - '.pages.dev'
    Image|startswith: 'C:\\ProgramData\\'
  condition: selection
level: high`,
        mitigation:
          'Restrict server egress via proxy allowlists and inspect TLS SNI headers for unauthorized *.workers.dev connections.',
      },
    },
  ],
};
