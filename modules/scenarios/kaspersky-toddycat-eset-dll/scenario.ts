import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'kaspersky-toddycat-eset-dll',
  code: 'CVE-2024-11859',
  name: 'Kaspersky GReAT — ToddyCat APT: ESET Scanner DLL Proxying (CVE-2024-11859) & TCESB Loader',
  shortSubtitle: 'Kaspersky Securelist · Signed ESET ecls.exe, version.dll Search-Order Hijack & TCESB In-Memory Implant',
  category: 'MALWARE',
  severity: 'HIGH',
  primaryMitrePhase: 4,
  overview:
    'Documented by Kaspersky GReAT on Securelist (2024–2025), the ToddyCat APT group abused an insecure DLL search-order vulnerability (CVE-2024-11859) in the legitimate, digitally signed ESET Command Line Scanner (ecls.exe). By placing a malicious version.dll in the same directory as ecls.exe, ToddyCat proxied legitimate export calls to C:\\Windows\\System32\\version.dll while decrypting and executing their custom TCESB (ToddyCat ESET Loader) C2 implant in memory.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Kaspersky GReAT (Securelist) — ToddyCat APT Exploits Vulnerability in ESET (CVE-2024-11859)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1574.001 (DLL Search Order Hijacking) · T1620 (Reflective Loading) · T1539 (Browser Cookie Theft)',
    },
    {
      term: 'VULNERABLE BINARY',
      value: 'ecls.exe (Signed ESET Command Line Scanner) -> Malicious version.dll Proxy',
    },
    {
      term: 'CUSTOM LOADER',
      value: 'TCESB (ToddyCat ESET Loader) Decrypting AES-CBC Shellcode in RAM',
    },
  ],
  nodes: [
    {
      id: 'toddycat_c2_srv',
      label: 'ToddyCat C2 Server',
      sublabel: '203.0.113.142:443 (HTTPS C2)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'ToddyCat APT Command & Control Infrastructure',
        pidOrPort: 'HTTPS :443 (TLS 1.3)',
        privilege: 'External APT Operator',
        artifacts: [
          'Receives Beacons from Masqueraded ecls.exe',
          'Collects DPAPI Browser Cookies & Exchange Tokens',
        ],
        description:
          'ToddyCat C2 infrastructure receiving stolen authentication cookies and tasking from the TCESB implant.',
      },
    },
    {
      id: 'wks_ecls_host',
      label: 'ecls.exe (Signed ESET Scanner)',
      sublabel: 'PID 5180 · GOV-WKS-19 (10.10.30.18)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Digitally Signed ESET Command-Line Scanner',
        pidOrPort: 'PID 5180 · C:\\ProgramData\\ESET\\ecls.exe',
        privilege: 'High Integrity',
        artifacts: [
          'CVE-2024-11859: Loads local version.dll before System32',
          'Unsigned C:\\ProgramData\\ESET\\version.dll',
        ],
        description:
          'Standalone signed ESET scanner binary deployed by the attacker to execute malicious code under a trusted security-vendor signature.',
      },
    },
    {
      id: 'tcesb_version_dll',
      label: 'version.dll Proxy & TCESB RAM',
      sublabel: '0x000001E280000000 (TCESB Payload)',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'DLL Proxy & TCESB In-Memory Decryptor',
        pidOrPort: 'GetFileVersionInfoSizeW -> TCESB_Init()',
        privilege: 'Inside ecls.exe Address Space',
        artifacts: [
          'Proxies 17 exports to C:\\Windows\\System32\\version.dll',
          'Decrypts TCESB stage2 payload via AES-128-CBC',
        ],
        description:
          'Malicious version.dll that forwards standard version API calls to System32\\version.dll so ecls.exe does not crash, while launching TCESB in a background thread.',
      },
    },
    {
      id: 'browser_dpapi_vault',
      label: 'Chrome / Edge DPAPI & Exchange',
      sublabel: 'Login Data, Cookies & OWA Tokens',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Local Browser Credential Store & Exchange Server',
        pidOrPort: 'DPAPI CryptUnprotectData & HTTPS :443',
        privilege: 'User & Domain Credentials',
        artifacts: [
          'AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Network\\Cookies',
          'Local State (Encrypted DPAPI Master Key)',
        ],
        description:
          'Browser cookie databases and Exchange tokens decrypted by ToddyCat post-exploitation modules.',
      },
    },
    {
      id: 'kaspersky_edr_siem',
      label: 'Kaspersky Anti-Targeted Attack',
      sublabel: 'Sysmon EID 7 & Memory Integrity',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Kaspersky EDR & SIEM Detection Platform',
        pidOrPort: 'Sysmon EID 1, 3, 7 (ImageLoad)',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: Non-System32 version.dll Loaded by ecls.exe (CVE-2024-11859)',
          'YARA: APT_ToddyCat_TCESB_Loader',
        ],
        description:
          'Detects signed security binaries loading core Windows DLLs (version.dll) from outside C:\\Windows\\System32\\.',
      },
    },
  ],
  processTree: [
    {
      pid: 5180,
      ppid: 3412,
      name: 'ecls.exe',
      commandLine: '"C:\\ProgramData\\ESET\\ecls.exe" /base-dir="C:\\ProgramData\\ESET"',
      user: 'CORP\\k.turner',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryW("version.dll") [CVE-2024-11859]',
        'GetFileVersionInfoW -> Proxy to System32\\version.dll',
        'VirtualAlloc(PAGE_EXECUTE_READWRITE)',
        'BCryptDecrypt (TCESB Payload)',
      ],
      memoryBlocks: [
        {
          address: '0x000001E280000000',
          section: 'TCESB Decrypted Stage-2 Implant',
          permissions: 'RWX',
          size: '184 KB',
          status: 'injected',
          description:
            'ToddyCat TCESB loader and post-exploitation orchestrator decrypted inside ecls.exe memory.',
          hexPreview: '48 83 EC 28 E8 14 00 00 00 48 8B C8 E8 4F 02 00',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ESET ECLS.EXE VERSION.DLL HIJACK (CVE-2024-11859)',
      subtitle: 'Signed ecls.exe loads malicious version.dll from current directory',
      description:
        'As discovered by Kaspersky GReAT, ToddyCat stages a legitimate, digitally signed copy of ESET Command Line Scanner (ecls.exe) alongside a malicious version.dll. Due to CVE-2024-11859, ecls.exe searches its own application directory for version.dll before C:\\Windows\\System32\\.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1574.001',
      mitreTechniqueName: 'Hijack Execution Flow: DLL Search Order Hijacking',
      activeNodeIds: ['wks_ecls_host', 'tcesb_version_dll', 'kaspersky_edr_siem'],
      compromisedNodeIds: ['wks_ecls_host', 'tcesb_version_dll'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-11859 (ESET ecls.exe Insecure DLL Loading)' },
        { term: 'HIJACKED DLL', value: 'C:\\ProgramData\\ESET\\version.dll (Unsigned Proxy DLL)' },
        { term: 'DLL PROXYING', value: 'Forwards 17 exports to C:\\Windows\\System32\\version.dll' },
      ],
    },
    {
      index: 2,
      title: 'TCESB IN-MEMORY DECRYPTION & EDR EVASION',
      subtitle: 'Decrypting TCESB shellcode inside ecls.exe trusted process space',
      description:
        'When ecls.exe calls GetFileVersionInfoSizeW in the malicious version.dll, the proxy spawns a worker thread that reads an encrypted payload file, decrypts the TCESB (ToddyCat ESET Loader) implant in memory, and executes it under the trusted ESET digital signature.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1620',
      mitreTechniqueName: 'Reflective Code Loading',
      activeNodeIds: ['wks_ecls_host', 'tcesb_version_dll', 'kaspersky_edr_siem'],
      compromisedNodeIds: ['wks_ecls_host', 'tcesb_version_dll'],
      keySpecs: [
        { term: 'LOADER NAME', value: 'TCESB (ToddyCat ESET Loader)' },
        { term: 'HOST TRUST', value: 'Executes inside ESET-signed ecls.exe (PID 5180)' },
        { term: 'ENCRYPTION', value: 'AES-128-CBC / Custom XOR In-Memory Unpacking' },
      ],
    },
    {
      index: 3,
      title: 'DPAPI COOKIE THEFT & HTTPS C2 EXFILTRATION',
      subtitle: 'Harvesting Chrome/Edge session cookies and beaconing to ToddyCat C2',
      description:
        'Running inside ecls.exe, the ToddyCat implant decrypts local browser DPAPI master keys to steal Chrome/Edge session cookies and tokens, transmitting them over HTTPS to 203.0.113.142:443.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1539',
      mitreTechniqueName: 'Steal Web Session Cookie',
      activeNodeIds: ['tcesb_version_dll', 'browser_dpapi_vault', 'toddycat_c2_srv', 'kaspersky_edr_siem'],
      compromisedNodeIds: ['wks_ecls_host', 'tcesb_version_dll', 'browser_dpapi_vault'],
      keySpecs: [
        { term: 'TARGET ARTIFACTS', value: 'Edge/Chrome Network\\Cookies & Local State DPAPI Keys' },
        { term: 'NETWORK ANOMALY', value: 'Offline scanner ecls.exe making outbound TCP :443 connections' },
        { term: 'THREAT ACTOR', value: 'ToddyCat APT (Tracked by Kaspersky GReAT)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'kas-tc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '09:14:22.108',
      sourceNodeId: 'wks_ecls_host',
      targetNodeId: 'tcesb_version_dll',
      sourceLabel: 'ecls.exe (PID 5180)',
      targetLabel: 'version.dll (Unsigned)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'HIJACK VERSION.DLL',
      info: 'Image=C:\\ProgramData\\ESET\\ecls.exe ImageLoaded=C:\\ProgramData\\ESET\\version.dll Signed=false',
      sizeOrCode: 'CVE-2024-11859',
      severity: 'HIGH',
      mitreId: 'T1574.001',
      explanation:
        'Sysmon Event ID 7 detects version.dll being loaded from C:\\ProgramData\\ESET\\ rather than C:\\Windows\\System32\\version.dll.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>GOV-WKS-19.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\ESET\\ecls.exe</Data>
    <Data Name="ImageLoaded">C:\\ProgramData\\ESET\\version.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Kaspersky GReAT — ToddyCat ESET ecls.exe version.dll Hijack (CVE-2024-11859)',
        ruleCode: `title: System DLL version.dll Loaded from Non-System32 Path (CVE-2024-11859)
logsource:
  category: image_load
  product: windows
detection:
  selection:
    ImageLoaded|endswith: '\\version.dll'
  filter_system32:
    ImageLoaded|startswith:
      - 'C:\\Windows\\System32\\'
      - 'C:\\Windows\\SysWOW64\\'
      - 'C:\\Windows\\WinSxS\\'
  condition: selection and not filter_system32
level: high`,
        mitigation:
          'Hunt for any process loading version.dll, winhttp.dll, or dbghelp.dll from outside C:\\Windows\\System32\\ and update ESET tools past CVE-2024-11859.',
      },
    },
    {
      id: 'kas-tc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '09:14:22.650',
      sourceNodeId: 'tcesb_version_dll',
      targetNodeId: 'kaspersky_edr_siem',
      sourceLabel: 'version.dll (TCESB)',
      targetLabel: 'Memory Vad 0x01E280000000',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Kaspersky Memory Scan',
      shortAction: 'TCESB UNPACK RAM',
      info: 'Proxies System32\\version.dll exports and decrypts 184 KB TCESB implant in ecls.exe',
      sizeOrCode: '184 KB RWX',
      severity: 'CRITICAL',
      mitreId: 'T1620',
      explanation:
        'Kaspersky GReAT documented that the proxy version.dll resolves real exports from System32\\version.dll dynamically while allocating RWX memory for TCESB.',
      rawLog: `[KASPERSKY_EDR_MEMORY_SCAN]
Process: C:\\ProgramData\\ESET\\ecls.exe (PID 5180)
ProxyModule: C:\\ProgramData\\ESET\\version.dll -> Forwards to C:\\Windows\\System32\\version.dll
AllocatedRegion: 0x000001E280000000 (188416 bytes, PAGE_EXECUTE_READWRITE)
SignatureMatch: Trojan.Win64.ToddyCat.TCESB`,
      detectionRule: {
        type: 'YARA',
        title: 'Kaspersky GReAT — ToddyCat TCESB version.dll Proxy Loader',
        ruleCode: `rule Kaspersky_APT_ToddyCat_TCESB_ProxyDLL {
  meta:
    author = "Kaspersky GReAT"
    cve = "CVE-2024-11859"
  strings:
    $s1 = "GetFileVersionInfoSizeW" ascii
    $s2 = "VerQueryValueW" ascii
    $s3 = "\\\\System32\\\\version.dll" wide ascii nocase
  condition:
    uint16(0) == 0x5A4D and all of them
}`,
        mitigation:
          'Block execution of standalone AV command-line scanners from user-writable directories via AppLocker / WDAC.',
      },
    },
    {
      id: 'kas-tc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '09:14:26.310',
      sourceNodeId: 'wks_ecls_host',
      targetNodeId: 'toddycat_c2_srv',
      sourceLabel: '10.10.30.18 (ecls.exe)',
      targetLabel: '203.0.113.142:443',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 3',
      shortAction: 'ECLS.EXE C2 BEACON',
      info: 'Image=C:\\ProgramData\\ESET\\ecls.exe DestinationIp=203.0.113.142 DestinationPort=443',
      sizeOrCode: 'TLS 1.3',
      severity: 'CRITICAL',
      mitreId: 'T1539',
      explanation:
        'The offline command-line scanner ecls.exe has no legitimate reason to initiate outbound HTTPS connections to external IP addresses.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>3</EventID>
    <Computer>GOV-WKS-19.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\ESET\\ecls.exe</Data>
    <Data Name="DestinationIp">203.0.113.142</Data>
    <Data Name="DestinationPort">443</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ESET Command-Line Scanner (ecls.exe) Making Outbound Network Connections',
        ruleCode: `title: Suspicious Outbound Connection by ESET ecls.exe (ToddyCat)
logsource:
  category: network_connection
  product: windows
detection:
  selection:
    Image|endswith: '\\ecls.exe'
    Initiated: 'true'
  condition: selection
level: critical`,
        mitigation:
          'Alert immediately if ecls.exe initiates any outbound TCP/UDP network connection.',
      },
    },
  ],
};
