import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    briefing: {
      headline: 'Scenario Briefing: ToddyCat APT (CVE-2024-11859), Abusing an ESET Command-Line Scanner for DLL Search-Order Hijacking',
      storyAnalogy:
        'Imagine a thief who brings a genuine, uniformed security officer (ESET Command Line Scanner ecls.exe) into a building, knowing that the officer has a habit of picking up whichever walkie-talkie (version.dll) is sitting on the nearest table before checking the official equipment locker (System32). The thief places a rigged walkie-talkie (version.dll) on the table right next to the officer; when the officer turns it on, the rigged walkie-talkie still forwards normal radio calls to headquarters so the officer doesn’t suspect a thing, while secretly running ToddyCat’s TCESB spy radio inside the officer’s own uniform.',
      plainSummary:
        'In this scenario (CVE-2024-11859, Kaspersky GReAT - ToddyCat APT: ESET Scanner DLL Proxying (CVE-2024-11859) & TCESB Loader) on WKS-19 (10.10.30), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: launching the Signed ESET Scanner Alongside, then proxying Legitimate DLL Exports While, then establishing an Encrypted C2 Channel. Steps #1–#3 walk that chain end-to-end by covering Launching the Signed ESET Scanner Alongside, then Proxying Legitimate DLL Exports While, then Establishing an Encrypted C2 Channel, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 7 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Node ①/② stages the signed ecls.exe binary and malicious version.dll on Node ③ (Target Workstation/Server). Running ecls.exe on Node ③ loads Node ④ (Trojanized version.dll & TCESB Loader), which decrypts the C2 implant communicating with Node ⑤ while Node ⑥ (SIEM / EDR) detects the unsigned DLL load.',
      documentedAdvisory: 'Kaspersky GReAT ToddyCat Report · ESET Advisory CVE-2024-11859 · MITRE ATT&CK T1574.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.001',
        plainTitle: 'Launching the Signed ESET Scanner (ecls.exe) Alongside a Malicious version.dll',
        storyAnalogy:
          'The attacker places a real, digitally signed ESET scanner (ecls.exe) and a forged helper library (version.dll) in the same folder (C:\\ProgramData\\ESET\\). Because of CVE-2024-11859, the moment ecls.exe starts, it grabs the version.dll sitting right next to it instead of the real Windows System32\\version.dll.',
        simpleExplanation:
          'On workstation GOV-WKS-19 (10.10.30.18), the attacker drops a standalone, validly signed copy of ESET Command Line Scanner (ecls.exe, an authentic antivirus utility whose valid digital signature passes Windows AppLocker and antivirus file checks) into a writable folder like C:\\ProgramData\\ESET\\ right next to a malicious library named version.dll. Because of CVE-2024-11859 (where ecls.exe did not restrict its DLL load path to System32), the moment ecls.exe starts, Windows loads the attacker’s version.dll from C:\\ProgramData\\ESET\\ before checking C:\\Windows\\System32\\version.dll.',
        howItWorksInPractice:
          'Unlike KnownDLLs (such as kernel32.dll or ntdll.dll, which Windows forces every program to load exclusively from System32), version.dll is not on the Default KnownDLLs list, so any executable that imports version.dll without specifying LOAD_LIBRARY_SEARCH_SYSTEM32 will load a local version.dll from its own folder first. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #1→ shows Node ③ (Signed ecls.exe) loading Node ④ (Malicious version.dll via CVE-2024-11859), with ⇠#1 logging Sysmon EventID 7.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 & ESET Advisory CVE-2024-11859: ecls.exe loading unsigned version.dll from outside System32.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'Proxying Legitimate DLL Exports While Decrypting the ToddyCat TCESB Payload in Memory',
        storyAnalogy:
          'If the rigged version.dll didn’t know how to answer normal version-check questions, ecls.exe would crash immediately. So the rigged DLL acts as a middleman ("Export Proxying"): it forwards every real question to C:\\Windows\\System32\\version.dll while quietly decrypting ToddyCat’s TCESB backdoor in the background.',
        simpleExplanation:
          'If the attacker’s version.dll failed to answer the normal version-check functions that ecls.exe calls on startup (like GetFileVersionInfoW), ecls.exe would crash immediately with an error popup. To prevent a crash, the malicious version.dll uses DLL Export Proxying (forwarding every normal API call straight through to the real C:\\Windows\\System32\\version.dll so ecls.exe runs smoothly), while its background thread reads an encrypted file from disk and decrypts ToddyCat’s TCESB backdoor directly into RAM.',
        howItWorksInPractice:
          'By adding linker export forwarders in the malicious DLL’s Export Address Table (pointing functions like GetFileVersionInfoW to C:\\Windows\\System32\\version.GetFileVersionInfoW), the host program continues to work normally while the attacker’s decrypted shellcode runs in the same process memory. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ decrypts the TCESB payload into executable memory while proxying exports, and ⇠#2 confirms stage 2 initialization.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: Dual loading of version.dll (both local unsigned and System32 signed) inside ecls.exe process memory. Correlate Sysmon or Windows Security Event telemetry for T1620 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing an Encrypted C2 Channel From Inside the Trusted ESET Process',
        storyAnalogy:
          'The malware now phones home from inside the signed ecls.exe process. However, defenders catch the trick because ecls.exe is an offline command-line file scanner, it has zero reason to ever open an outbound HTTPS connection to the internet!',
        simpleExplanation:
          'Running inside the memory space of the signed ecls.exe process (so process lists show a legitimate ESET security scanner), the decrypted TCESB backdoor opens an encrypted HTTPS tunnel on TCP port 443 to ToddyCat command-and-control server 203.0.113.142:443 to harvest domain credentials and browser cookies. Quoting the story beat above, that physical action maps onto [object Object] and [object Object] (the exact host or protocol control point this stage must exercise before the next kill-chain move can start).',
        howItWorksInPractice:
          'Why is this still detectable by defenders? Because ecls.exe is a standalone, offline on-demand file scanner that never connects to the internet during normal operation, meaning any Sysmon EventID 3 (NetworkConnect) log showing ecls.exe opening an outbound TCP/443 socket is an immediate indicator of compromise. In the documented Sysmon EID 3 exchange from ecls.exe (Signed ESET Scanner) to version.dll Proxy & TCESB RAM, version.dll Proxy & TCESB RAM responds with ACK TLS 1.3 (confirming that the ECLS.EXE C2 BEACON request succeeded on version.dll Proxy & TCESB RAM and completing the final execution objective of Kaspersky GReAT, ToddyCat APT: ESET Scanner DLL Proxying (CVE-2024-11859) & TCESB Loader).',
        diagramAlignment:
          'On the diagram, arrow #3→ connects Node ④ (ecls.exe / TCESB) to Node ⑤ (External C2) and triggers an alert on Node ⑥ (SIEM / EDR).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 3 (NetworkConnect): Standalone command-line scanner ecls.exe initiating outbound TCP/443 connections.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an espionage operative who borrows the uniform of a trusted safety inspector to walk freely through a secure office. The operative places a counterfeit spare lens right beside the genuine scanner tool; while smoothly forwarding every legitimate command so the scanner keeps appearing normal, the counterfeit lens unscrambles a hidden spy radio purely inside live workspace and dials home right under the inspector\'s trusted badge.',
      storyMappings: [
        {
          storyTerm: 'Genuine safety inspector paired with a counterfeit spare lens',
          technicalTerm: 'Signed ESET Command-Line Scanner (ecls.exe) side-loading unsigned version.dll (CVE-2024-11859)',
          tone: 'amber',
        },
        {
          storyTerm: 'Forwarding legitimate commands while unscrambling a spy radio',
          technicalTerm: 'DLL export proxying while decrypting ToddyCat TCESB backdoor purely in memory',
          tone: 'sky',
        },
        {
          storyTerm: 'Dialing home under the inspector\'s trusted badge',
          technicalTerm: 'Standalone offline scanner ecls.exe initiating unexpected outbound TCP/443 C2 traffic',
          tone: 'rose',
        },
        {
          storyTerm: 'Catching the impostor module outside the official cabinet',
          technicalTerm: 'Sysmon EventID 7 flagging ecls.exe loading version.dll outside C:\\Windows\\System32',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dropping a legitimate, digitally signed security-scanner executable into a staging folder alongside a forged helper library wearing a standard system filename, the operative tricks the scanner into loading the attacker code first.',
        storyMappings: [
          {
            storyTerm: 'Digitally signed security-scanner executable',
            technicalTerm: 'Legitimate ESET Command-Line Scanner (ecls.exe) abused via CVE-2024-11859',
            tone: 'amber',
          },
          {
            storyTerm: 'Forged helper library wearing a standard system filename',
            technicalTerm: 'Malicious unsigned version.dll staged in the same directory as ecls.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Official system cabinet bypassed',
            technicalTerm: 'Windows DLL search order loading local version.dll ahead of C:\\Windows\\System32\\version.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Module load alarm',
            technicalTerm: 'Sysmon EventID 7 alerting on ecls.exe loading unsigned version.dll outside System32',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 7 (Image Loaded tracking DLL signatures and file paths) whenever signed ecls.exe loads an unsigned version.dll located outside C:\\Windows\\System32 (the exact CVE-2024-11859 ToddyCat DLL side-loading trigger).',
      },
      2: {
        storyAnalogy:
          'To keep the trusted scanner from crashing and drawing attention, the forged helper library acts like a polite relay mirror for every ordinary scanner call while quietly unwrapping the real encrypted espionage kit inside live working memory.',
        storyMappings: [
          {
            storyTerm: 'Polite relay mirror keeping the scanner alive',
            technicalTerm: 'DLL export proxying forwarding legitimate version.dll calls to the real System32 library',
            tone: 'amber',
          },
          {
            storyTerm: 'Quietly unwrapping the encrypted espionage kit in RAM',
            technicalTerm: 'In-memory decryption and execution of the ToddyCat TCESB passive backdoor',
            tone: 'sky',
          },
          {
            storyTerm: 'Clean signed process shell hiding malicious guts',
            technicalTerm: 'Malicious threads running inside the trusted ESET ecls.exe process image',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero decrypted spyware files on disk',
            technicalTerm: 'Encrypted companion payload preventing static antivirus identification',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Speaking outward through the internet wearing the trusted antivirus inspector badge, the hijacked offline scanner opens a covert encrypted phone line to the spy headquarters, giving away its cover because a standalone local scanner should never phone outside servers.',
        storyMappings: [
          {
            storyTerm: 'Hijacked offline scanner phoning outside headquarters',
            technicalTerm: 'ecls.exe establishing outbound encrypted TCP/443 C2 communications',
            tone: 'amber',
          },
          {
            storyTerm: 'Behavioral contradiction exposing the disguise',
            technicalTerm: 'Standalone command-line scanner initiating external internet network sockets',
            tone: 'sky',
          },
          {
            storyTerm: 'Network sensor recording the impossible call',
            technicalTerm: 'Sysmon EventID 3 (NetworkConnect) alerting on ecls.exe outbound TCP/443 traffic',
            tone: 'rose',
          },
          {
            storyTerm: 'Vendor fix locking the search order',
            technicalTerm: 'ESET CVE-2024-11859 patch enforcing LOAD_LIBRARY_SEARCH_SYSTEM32',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 3 (Network Connection recording process-to-IP egress) for standalone command-line scanner ecls.exe initiating outbound TCP/443 connections (a high-fidelity anomaly because local offline scanners should not beacon externally).',
      },
    },
  };
