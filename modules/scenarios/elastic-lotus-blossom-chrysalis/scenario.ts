import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'elastic-lotus-blossom-chrysalis',
  code: 'T1574.002',
  name: 'Elastic Security Labs — Lotus Blossom APT: WinGUp DLL Side-Loading & CHRYSALIS Backdoor',
  shortSubtitle: 'Elastic Security Labs · GUP.exe libcurl.dll Side-Loading, MurmurHash API & CHRYSALIS Implant',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Documented by Elastic Security Labs in their analysis of the Lotus Blossom APT group (Billbug / Dragonfish / Thrip), attackers abused the legitimate Notepad++ Generic Updater (GUP.exe / WinGUp) to side-load a malicious libcurl.dll. The loader resolves Windows APIs dynamically using custom FNV-1a and MurmurHash3 routines, decrypts an encrypted shellcode configuration file on disk, and deploys the modular CHRYSALIS backdoor in memory for long-term cyberespionage.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Elastic Security Labs — Lotus Blossom & CHRYSALIS Backdoor Intrusion Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1574.002 (DLL Side-Loading) · T1027.007 (Dynamic API Resolution) · T1071.001 (HTTPS C2)',
    },
    {
      term: 'SIDE-LOADED BINARY',
      value: 'GUP.exe (Signed WinGUp for Notepad++) -> Trojanized libcurl.dll',
    },
    {
      term: 'IMPLANT CRYPTO',
      value: 'FNV-1a & MurmurHash3 API Hashing + Custom XOR/RC4 Config Decryption',
    },
  ],
  nodes: [
    {
      id: 'lotus_c2_infra',
      label: 'Lotus Blossom C2 Server',
      sublabel: '203.0.113.84:443 (HTTPS C2)',
      role: 'attacker',
      x: 15,
      y: 45,
      details: {
        osOrType: 'Lotus Blossom (Billbug / Thrip) C2 Infrastructure',
        pidOrPort: 'TCP/443 (TLS 1.2 Custom Beacon)',
        privilege: 'APT Operator Infrastructure',
        artifacts: [
          'Spoofed HTTP User-Agent & TLS Session',
          'Tasking Commands: Reverse Shell, File Upload, Recon',
        ],
        description:
          'Command and Control infrastructure operated by Lotus Blossom receiving encrypted CHRYSALIS beacons.',
      },
    },
    {
      id: 'wks_gup_host',
      label: 'GUP.exe (Signed WinGUp)',
      sublabel: 'PID 4180 · ENG-WKS-12 (10.10.20.88)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Signed Legitimate Binary (WinGUp for Notepad++)',
        pidOrPort: 'PID 4180 · C:\\ProgramData\\NotepadPlus\\GUP.exe',
        privilege: 'Medium Integrity (Persistent Run Key)',
        artifacts: [
          'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\NotepadUpdater',
          'Unsigned C:\\ProgramData\\NotepadPlus\\libcurl.dll',
        ],
        description:
          'Legitimate, digitally signed WinGUp binary used as a trusted host vessel to side-load malicious libcurl.dll from the same folder.',
      },
    },
    {
      id: 'chrysalis_mem_implant',
      label: 'libcurl.dll & CHRYSALIS RAM',
      sublabel: '0x0000021C90000000 (RWX Shellcode)',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'CHRYSALIS Modular Backdoor in GUP.exe RAM',
        pidOrPort: 'FNV-1a + MurmurHash3 API Resolver',
        privilege: 'In-Memory Implant',
        artifacts: [
          'Export: curl_easy_init -> Shellcode Decryptor',
          'Encrypted Blob: C:\\ProgramData\\NotepadPlus\\gup.dat',
        ],
        description:
          'Malicious libcurl.dll hijacks curl_easy_init, resolves NTDLL/Kernel32 exports via FNV-1a/MurmurHash, and maps CHRYSALIS into RWX memory.',
      },
    },
    {
      id: 'corp_ad_target',
      label: 'Internal File & AD Server',
      sublabel: '10.10.5.10 (Recon & Collection Target)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Enterprise File & Directory Server',
        pidOrPort: 'SMB :445 / LDAP :389',
        privilege: 'Targeted Enterprise Asset',
        artifacts: [
          'CHRYSALIS Interactive Shell Discovery',
          'Staged Recon Archives',
        ],
        description:
          'Internal server enumerated by CHRYSALIS interactive shell modules during post-exploitation.',
      },
    },
    {
      id: 'elastic_siem_sensor',
      label: 'Elastic Security EDR & SIEM',
      sublabel: 'Sysmon EID 7, 13 & Memory Scanner',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Elastic Defend & SIEM Detection Engine',
        pidOrPort: 'Sysmon EID 1, 3, 7, 13',
        privilege: 'SOC Monitoring',
        artifacts: [
          'Alert: Unsigned libcurl.dll Side-Loaded by GUP.exe',
          'YARA: Windows_Trojan_Chrysalis',
        ],
        description:
          'Flags unsigned libcurl.dll loaded from non-standard ProgramData paths and unbacked RWX memory inside GUP.exe.',
      },
    },
  ],
  processTree: [
    {
      pid: 4180,
      ppid: 2890,
      name: 'GUP.exe',
      commandLine: '"C:\\ProgramData\\NotepadPlus\\GUP.exe" -v',
      user: 'CORP\\a.collins',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryA("libcurl.dll")',
        'CreateFileW("gup.dat")',
        'VirtualAlloc(MEM_COMMIT, PAGE_EXECUTE_READWRITE)',
        'WinHttpSendRequest',
      ],
      memoryBlocks: [
        {
          address: '0x0000021C90000000',
          section: 'CHRYSALIS Unpacked Backdoor',
          permissions: 'RWX',
          size: '164 KB',
          status: 'shellcode',
          description:
            'Decrypted CHRYSALIS implant loaded from gup.dat via libcurl.dll curl_easy_init hook.',
          hexPreview: '55 8B EC 83 EC 40 53 56 57 E8 00 00 00 00 5B 81',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'WINGUP (GUP.EXE) DLL SIDE-LOADING OF LIBCURL.DLL',
      subtitle: 'Signed GUP.exe loads trojanized libcurl.dll from C:\\ProgramData\\NotepadPlus',
      description:
        'Lotus Blossom establishes persistence via a Registry Run key pointing to a legitimate signed copy of WinGUp (GUP.exe) staged in C:\\ProgramData\\NotepadPlus\\. When GUP.exe executes, Windows DLL search-order mechanics load the attacker-supplied, unsigned libcurl.dll residing in the same directory and invoke its hijacked curl_easy_init export.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1574.002',
      mitreTechniqueName: 'Hijack Execution Flow: DLL Side-Loading',
      activeNodeIds: ['wks_gup_host', 'chrysalis_mem_implant', 'elastic_siem_sensor'],
      compromisedNodeIds: ['wks_gup_host', 'chrysalis_mem_implant'],
      keySpecs: [
        { term: 'HOST BINARY', value: 'C:\\ProgramData\\NotepadPlus\\GUP.exe (Signed WinGUp)' },
        { term: 'SIDE-LOADED DLL', value: 'C:\\ProgramData\\NotepadPlus\\libcurl.dll (Unsigned)' },
        { term: 'HIJACKED EXPORT', value: 'curl_easy_init / curl_easy_perform' },
      ],
    },
    {
      index: 2,
      title: 'FNV-1A / MURMURHASH API RESOLUTION & CHRYSALIS DECRYPTION',
      subtitle: 'Dynamic PEB walking and in-memory decryption of gup.dat payload',
      description:
        'As documented by Elastic Security Labs, the malicious libcurl.dll avoids static Import Address Table (IAT) entries by walking the PEB and hashing export names with FNV-1a and MurmurHash3. It then reads the encrypted payload file (gup.dat), allocates PAGE_EXECUTE_READWRITE memory via VirtualAlloc, and decrypts the modular CHRYSALIS backdoor in RAM.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1027.007',
      mitreTechniqueName: 'Obfuscated Files or Information: Dynamic API Resolution',
      activeNodeIds: ['wks_gup_host', 'chrysalis_mem_implant', 'elastic_siem_sensor'],
      compromisedNodeIds: ['wks_gup_host', 'chrysalis_mem_implant'],
      keySpecs: [
        { term: 'API HASHING', value: 'FNV-1a (0x811C9DC5) & MurmurHash3 PEB Export Resolution' },
        { term: 'PAYLOAD BLOB', value: 'C:\\ProgramData\\NotepadPlus\\gup.dat (Encrypted Shellcode)' },
        { term: 'MEMORY PROTECTION', value: 'VirtualAlloc (MEM_COMMIT | PAGE_EXECUTE_READWRITE)' },
      ],
    },
    {
      index: 3,
      title: 'CHRYSALIS HTTPS C2 BEACON & INTERACTIVE RECON',
      subtitle: 'Encrypted C2 channel from GUP.exe and internal network enumeration',
      description:
        'Running entirely inside the trusted GUP.exe address space, CHRYSALIS decrypts its embedded C2 configuration block, fingerprints the victim host (computer name, OS build, MAC address, domain membership), and initiates an encrypted HTTPS beacon to 203.0.113.84:443 to execute interactive reconnaissance and file exfiltration commands.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.001',
      mitreTechniqueName: 'Application Layer Protocol: Web Protocols',
      activeNodeIds: ['chrysalis_mem_implant', 'lotus_c2_infra', 'corp_ad_target', 'elastic_siem_sensor'],
      compromisedNodeIds: ['wks_gup_host', 'chrysalis_mem_implant', 'corp_ad_target'],
      keySpecs: [
        { term: 'C2 PROTOCOL', value: 'HTTPS TLS 1.2 (WinHTTP API from GUP.exe)' },
        { term: 'BACKDOOR FAMILY', value: 'CHRYSALIS (Lotus Blossom / Billbug)' },
        { term: 'CAPABILITIES', value: 'Reverse Shell, File Manager, Process Enumeration, C2 Sleep' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'el-lotus-1',
      no: 1,
      stageIndex: 1,
      timestamp: '08:15:19.220',
      sourceNodeId: 'wks_gup_host',
      targetNodeId: 'chrysalis_mem_implant',
      sourceLabel: 'GUP.exe (PID 4180)',
      targetLabel: 'libcurl.dll (Unsigned)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'SIDELOAD LIBCURL',
      info: 'Image=C:\\ProgramData\\NotepadPlus\\GUP.exe ImageLoaded=C:\\ProgramData\\NotepadPlus\\libcurl.dll Signed=false',
      sizeOrCode: 'Unsigned DLL',
      severity: 'HIGH',
      mitreId: 'T1574.002',
      explanation:
        'Sysmon Event ID 7 captures signed GUP.exe loading an unsigned libcurl.dll from a writable ProgramData directory—a classic DLL side-loading signature used by Lotus Blossom.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>ENG-WKS-12.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\NotepadPlus\\GUP.exe</Data>
    <Data Name="ImageLoaded">C:\\ProgramData\\NotepadPlus\\libcurl.dll</Data>
    <Data Name="Signed">false</Data>
    <Data Name="Hashes">SHA256=8A4F1C9E2B7D09A3E5F61234890ABCDEF1234567890ABCDEF1234567890ABCDE</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'WinGUp (GUP.exe) DLL Side-Loading Unsigned libcurl.dll',
        ruleCode: `title: Lotus Blossom WinGUp libcurl.dll Side-Loading
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\GUP.exe'
    ImageLoaded|endswith: '\\libcurl.dll'
    Signed: 'false'
  condition: selection
level: high`,
        mitigation:
          'Enforce Windows Defender Application Control (WDAC) / AppLocker rules blocking unsigned DLL loads from C:\\ProgramData\\ and user-writable folders.',
      },
    },
    {
      id: 'el-lotus-2',
      no: 2,
      stageIndex: 2,
      timestamp: '08:15:19.640',
      sourceNodeId: 'chrysalis_mem_implant',
      targetNodeId: 'elastic_siem_sensor',
      sourceLabel: 'libcurl.dll (GUP.exe)',
      targetLabel: 'VAD 0x021C90000000',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Elastic Memory Scan',
      shortAction: 'CHRYSALIS UNPACK',
      info: 'Unbacked RWX Shellcode + FNV-1a (0x811C9DC5) & MurmurHash3 API Resolution in GUP.exe',
      sizeOrCode: '164 KB RWX',
      severity: 'CRITICAL',
      mitreId: 'T1027.007',
      explanation:
        'Elastic Security Labs documented that CHRYSALIS uses FNV-1a and MurmurHash3 to resolve APIs dynamically and decrypts its modular implant into unbacked RWX memory.',
      rawLog: `[ELASTIC_DEFEND_MEMORY_ALERT]
Process: C:\\ProgramData\\NotepadPlus\\GUP.exe (PID 4180)
Region: 0x0000021C90000000 | Size: 167936 | Protection: PAGE_EXECUTE_READWRITE
BackingModule: Unbacked (Private Commit)
MatchedYara: Windows_Trojan_Chrysalis (FNV1a_Seed=0x811c9dc5, MurmurHash3_Constant=0xcc9e2d51)`,
      detectionRule: {
        type: 'YARA',
        title: 'Elastic Security Labs YARA — Windows.Trojan.Chrysalis',
        ruleCode: `rule Windows_Trojan_Chrysalis {
  meta:
    author = "Elastic Security Labs"
    actor = "Lotus Blossom APT"
  strings:
    $fnv1a = { C7 ?? C5 9D 1C 81 }
    $murmur1 = { 69 ?? 51 2D 9E CC }
    $murmur2 = { 69 ?? 93 35 87 1B }
  condition:
    uint16(0) == 0x5A4D and all of them
}`,
        mitigation:
          'Enable EDR memory scanning for unbacked executable memory regions and hunt for FNV-1a/MurmurHash3 constants in unsigned DLLs.',
      },
    },
    {
      id: 'el-lotus-3',
      no: 3,
      stageIndex: 3,
      timestamp: '08:15:21.105',
      sourceNodeId: 'wks_gup_host',
      targetNodeId: 'lotus_c2_infra',
      sourceLabel: '10.10.20.88 (GUP.exe)',
      targetLabel: '203.0.113.84:443',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 3',
      shortAction: 'HTTPS C2 BEACON',
      info: 'Image=C:\\ProgramData\\NotepadPlus\\GUP.exe DestinationIp=203.0.113.84 DestinationPort=443',
      sizeOrCode: 'TLS 1.2',
      severity: 'CRITICAL',
      mitreId: 'T1071.001',
      explanation:
        'GUP.exe executing from C:\\ProgramData\\NotepadPlus\\ initiates persistent outbound HTTPS C2 connections to the Lotus Blossom server.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>3</EventID>
    <Computer>ENG-WKS-12.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\NotepadPlus\\GUP.exe</Data>
    <Data Name="Protocol">tcp</Data>
    <Data Name="SourceIp">10.10.20.88</Data>
    <Data Name="DestinationIp">203.0.113.84</Data>
    <Data Name="DestinationPort">443</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'GUP.exe Executing from Non-Standard Path Making Network Connections',
        ruleCode: `title: Suspicious Outbound Network Connection by Relocated GUP.exe
logsource:
  category: network_connection
  product: windows
detection:
  selection:
    Image|endswith: '\\GUP.exe'
    Initiated: 'true'
  filter_legit:
    Image|startswith:
      - 'C:\\Program Files\\Notepad++\\'
      - 'C:\\Program Files (x86)\\Notepad++\\'
  condition: selection and not filter_legit
level: high`,
        mitigation:
          'Restrict GUP.exe execution to official Program Files paths and block outbound connections from binaries running out of C:\\ProgramData\\.',
      },
    },
  ],
};
