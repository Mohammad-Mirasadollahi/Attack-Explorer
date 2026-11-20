import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: '3cx-desktopapp-supply-chain-lazarus',
  code: 'CVE-2023-29059',
  name: 'CrowdStrike, Kaspersky & Mandiant — Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram',
  shortSubtitle: 'CrowdStrike · Kaspersky GReAT · Mandiant · Trojanized ffmpeg.dll, d3dcompiler_47.dll & ICONICSTEALER',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by CrowdStrike (Labyrinth Chollima), Kaspersky GReAT, Mandiant (UNC4736), and SentinelOne ("SmoothOperator", March 2023), CVE-2023-29059 was a cascading software supply chain attack in which North Korean threat actors compromised 3CX’s build environment (after first compromising Trading Technologies’ X_TRADER installer). Legitimate, digitally signed MSI/DMG installers for 3CXDesktopApp (versions 18.12.407 and 18.12.416) were distributed with a trojanized ffmpeg.dll. When 3CXDesktopApp.exe started, ffmpeg.dll sideloaded and read an RC4-encrypted shellcode payload embedded after magic marker 0xFEEDFACE inside d3dcompiler_47.dll, fetched AES-encrypted C2 URLs hidden inside GitHub icon1.ico files, and deployed ICONICSTEALER or Kaspersky’s Gopuram backdoor.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'CrowdStrike (Labyrinth Chollima) · Kaspersky GReAT (Gopuram) · Mandiant (UNC4736)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1195.002 (Supply Chain Software) · T1574.002 (DLL Side-Loading: ffmpeg.dll) · T1102.001 (Dead Drop Resolver)',
    },
    {
      term: 'TROJANIZED BINARIES',
      value: '3CXDesktopApp.exe (Signed) -> ffmpeg.dll (Trojanized) -> d3dcompiler_47.dll (0xFEEDFACE RC4)',
    },
    {
      term: 'FINAL PAYLOADS',
      value: 'ICONICSTEALER (Browser Credential Stealer) & Gopuram / TaxOff Backdoors',
    },
  ],
  nodes: [
    {
      id: 'lazarus_3cx_repo',
      label: '3CX Update & GitHub Dead-Drop',
      sublabel: 'downloads.3cx.com & raw.githubusercontent.com',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Compromised Build Pipeline & GitHub Icon Dead-Drop (IconStorages)',
        pidOrPort: 'HTTPS :443 (3CXDesktopApp-18.12.416.msi & icon1.ico..icon14.ico)',
        privilege: 'Signed Vendor Update Server & Public GitHub Repo',
        artifacts: [
          '3CXDesktopApp.msi (Validly signed by 3CX Ltd.)',
          'github.com/IconStorages/images/main/icon1.ico (Appended Base64 AES C2 string)',
        ],
        description:
          'Compromised 3CX update server delivering the trojanized installer, paired with GitHub dead-drop .ico files containing AES-GCM encrypted C2 domains.',
      },
    },
    {
      id: 'victim_3cx_workstation',
      label: 'Enterprise Workstation (3CX)',
      sublabel: '10.10.24.19 (3CXDesktopApp.exe)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows 11 Enterprise Endpoint (3CX Softphone Client)',
        pidOrPort: 'PID 6120 (3CXDesktopApp.exe)',
        privilege: 'CORP\\j.miller (Standard User)',
        artifacts: [
          '%LOCALAPPDATA%\\Programs\\3CXDesktopApp\\3CXDesktopApp.exe',
          '%LOCALAPPDATA%\\Programs\\3CXDesktopApp\\ffmpeg.dll',
        ],
        description:
          'Corporate endpoint running the validly signed Electron-based 3CXDesktopApp.exe, which automatically imports ffmpeg.dll from its application directory.',
      },
    },
    {
      id: 'ffmpeg_d3d_loader',
      label: 'ffmpeg.dll & d3dcompiler_47.dll',
      sublabel: '0xFEEDFACE RC4 Shellcode Decryptor',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Trojanized DLL Side-Loader & In-Memory RC4 Shellcode',
        pidOrPort: 'PID 6120 (In-Process Memory of 3CXDesktopApp.exe)',
        privilege: 'User Context (Inside Signed 3CX Process)',
        artifacts: [
          'ffmpeg.dll (SHA256: 7986bbaee8940da11ce089383521ab420c443ab7b15ed42aed91fd31ce833896)',
          'd3dcompiler_47.dll (0xFEEDFACE marker + RC4 key "3jB(2bsG#@c7")',
        ],
        description:
          'Malicious DllMain inside ffmpeg.dll locates d3dcompiler_47.dll, scans for the hex marker FE ED FA CE, decrypts the appended shellcode using RC4 key "3jB(2bsG#@c7", and executes it in memory.',
      },
    },
    {
      id: 'iconicstealer_gopuram',
      label: 'ICONICSTEALER & Gopuram Implant',
      sublabel: 'In-Memory Reflective DLL Payload',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Stage-3 Reflective DLL Stealer & Modular Backdoor',
        pidOrPort: 'PID 6120 -> HTTPS C2 (akamaicontainer.com / azureonlinestorage.com)',
        privilege: 'Endpoint Credential & Crypto-Targeted Implant',
        artifacts: [
          'Chrome / Edge / Brave / Firefox SQLite Login Data & History theft',
          'Kaspersky Gopuram modular implant (deployed on high-value crypto targets)',
        ],
        description:
          'Final stage decrypted into memory from the C2 response: ICONICSTEALER harvests browser credentials and system info, while selective targets receive the Gopuram backdoor.',
      },
    },
    {
      id: 'edr_falcon_siem',
      label: 'CrowdStrike / Kaspersky EDR SIEM',
      sublabel: 'Sysmon EID 7 / 22 & YARA Telemetry',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC EDR & DNS Threat Intelligence Sensor',
        pidOrPort: 'Sysmon EID 7 (Unsigned ffmpeg.dll) & EID 22 (DNS Query)',
        privilege: 'SOC Detection Engine',
        artifacts: [
          '3CXDesktopApp.exe querying raw.githubusercontent.com/IconStorages/*',
          'YARA: Lazarus_3CX_ffmpeg_loader & Gopuram_Backdoor',
        ],
        description:
          'Detects 3CXDesktopApp.exe loading the tampered ffmpeg.dll, reading d3dcompiler_47.dll, and resolving Lazarus C2 domains.',
      },
    },
  ],
  processTree: [
    {
      pid: 6120,
      ppid: 4100,
      name: '3CXDesktopApp.exe (Signed)',
      commandLine: '"C:\\Users\\j.miller\\AppData\\Local\\Programs\\3CXDesktopApp\\3CXDesktopApp.exe"',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['LoadLibraryW("ffmpeg.dll")', 'CreateEventW("AVMonitorEvent")'],
    },
    {
      pid: 6120,
      ppid: 4100,
      name: 'ffmpeg.dll -> d3dcompiler_47.dll',
      commandLine: 'In-Memory Thread: RC4_Decrypt(d3dcompiler_47.dll + 0xFEEDFACE, key="3jB(2bsG#@c7")',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'CreateFileW("d3dcompiler_47.dll")',
        'VirtualAlloc(PAGE_EXECUTE_READWRITE)',
        'WinHttpOpenRequest("GET", "/IconStorages/images/main/icon7.ico")',
      ],
      memoryBlocks: [
        {
          address: '0x000001D490000000',
          section: 'd3dcompiler_47.dll Decrypted Shellcode (Reflective Loader)',
          permissions: 'RWX',
          size: '196 KB',
          status: 'injected',
          description:
            'RC4-decrypted reflective loader extracted from the 0xFEEDFACE offset of d3dcompiler_47.dll inside 3CXDesktopApp.exe.',
          hexPreview: 'FE ED FA CE -> RC4("3jB(2bsG#@c7") -> MZ... ReflectiveLoader',
        },
      ],
    },
    {
      pid: 6120,
      ppid: 4100,
      name: 'ICONICSTEALER / Gopuram (In-Memory)',
      commandLine: 'In-Memory DLL: Steals Chrome/Edge/Firefox Login Data -> POST https://akamaicontainer.com/gl',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'CreateFileW("...\\Google\\Chrome\\User Data\\Default\\History")',
        'WinHttpSendRequest("akamaicontainer.com")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'TROJANIZED FFMPEG.DLL SIDE-LOADING & 0xFEEDFACE RC4 DECRYPTION',
      subtitle: 'Signed 3CXDesktopApp.exe loads trojanized ffmpeg.dll and decrypts d3dcompiler_47.dll',
      description:
        'When a user launches the legitimate, digitally signed 3CXDesktopApp.exe (v18.12.407 / 18.12.416), Windows automatically loads the trojanized ffmpeg.dll from the same folder. Inside ffmpeg.dll, a malicious initialization thread creates mutex/event "AVMonitorEvent", opens the co-located d3dcompiler_47.dll file, searches for the 4-byte marker 0xFEEDFACE (FE ED FA CE), and decrypts the appended payload in memory using RC4 with the hardcoded key "3jB(2bsG#@c7".',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1195.002',
      mitreTechniqueName: 'Supply Chain Compromise: Compromise Software Supply Chain',
      activeNodeIds: ['lazarus_3cx_repo', 'victim_3cx_workstation', 'ffmpeg_d3d_loader'],
      compromisedNodeIds: ['victim_3cx_workstation', 'ffmpeg_d3d_loader'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-29059 (3CXDesktopApp Supply Chain Compromise)' },
        { term: 'PAYLOAD MARKER', value: '0xFEEDFACE inside d3dcompiler_47.dll' },
        { term: 'RC4 DECRYPT KEY', value: '"3jB(2bsG#@c7" (Decrypts Reflective Shellcode)' },
      ],
    },
    {
      index: 2,
      title: 'GITHUB ICON1.ICO DEAD-DROP RESOLVER & AES-GCM C2 EXTRACTION',
      subtitle: 'Fetching raw.githubusercontent.com/IconStorages/images/main/icon*.ico to resolve C2',
      description:
        'After sleeping for a randomized delay (7 days on newly installed systems to evade automated sandboxes), the decrypted shellcode makes an HTTPS GET request to github.com/IconStorages/images/main/icon1.ico (through icon14.ico). At the very end of the legitimate .ico image file sits a Base64 string prefixed with "$", which the loader decrypts using AES-GCM to obtain the active Lazarus C2 domain (e.g., akamaicontainer.com or msstorageboxes.com).',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1102.001',
      mitreTechniqueName: 'Web Service: Dead Drop Resolver',
      activeNodeIds: ['ffmpeg_d3d_loader', 'lazarus_3cx_repo', 'edr_falcon_siem'],
      compromisedNodeIds: ['victim_3cx_workstation', 'ffmpeg_d3d_loader'],
      keySpecs: [
        { term: 'DEAD-DROP URL', value: 'raw.githubusercontent.com/IconStorages/images/main/icon*.ico' },
        { term: 'STRING MARKER', value: 'Appended Base64 string starting with "$" at EOF of .ico' },
        { term: 'DECRYPTED C2', value: 'akamaicontainer.com / azureonlinestorage.com / msstorageboxes.com' },
      ],
    },
    {
      index: 3,
      title: 'IN-MEMORY ICONICSTEALER & KASPERSKY GOPURAM BACKDOOR DEPLOYMENT',
      subtitle: 'Harvesting browser credentials and deploying Gopuram on high-value targets',
      description:
        'The loader connects to the resolved C2 domain with a cookie named "tutma" and receives a third-stage reflective DLL executed strictly in memory: ICONICSTEALER (which enumerates system info and steals saved credentials and browsing history from Chrome, Edge, Brave, and Firefox). As Kaspersky GReAT discovered, on select cryptocurrency and financial targets, the operator used this foothold to deploy the modular Gopuram backdoor.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1555.003',
      mitreTechniqueName: 'Credentials from Password Stores: Credentials from Web Browsers',
      activeNodeIds: ['ffmpeg_d3d_loader', 'iconicstealer_gopuram', 'edr_falcon_siem'],
      compromisedNodeIds: ['victim_3cx_workstation', 'ffmpeg_d3d_loader', 'iconicstealer_gopuram'],
      keySpecs: [
        { term: 'STAGE 3 STEALER', value: 'ICONICSTEALER (In-Memory Browser & System Harvester)' },
        { term: 'TARGETED IMPLANT', value: 'Gopuram Backdoor (Documented by Kaspersky GReAT)' },
        { term: 'ATTRIBUTION', value: 'Lazarus Group / Labyrinth Chollima / UNC4736' },
      ],
    },
  ],
  telemetry: [
    {
      id: '3cx-29059-1',
      no: 1,
      stageIndex: 1,
      timestamp: '11:04:15.209',
      sourceNodeId: 'victim_3cx_workstation',
      targetNodeId: 'ffmpeg_d3d_loader',
      sourceLabel: '3CXDesktopApp.exe (PID 6120)',
      targetLabel: 'ffmpeg.dll / d3dcompiler_47.dll',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 (ImageLoad)',
      shortAction: 'TROJANIZED FFMPEG.DLL',
      info: '3CXDesktopApp.exe loads trojanized ffmpeg.dll (SHA256: 7986bbae...) and reads 0xFEEDFACE blob in d3dcompiler_47.dll',
      sizeOrCode: 'RC4 Key 3jB(2bsG#@c7',
      severity: 'CRITICAL',
      mitreId: 'T1195.002',
      explanation:
        'CrowdStrike, Mandiant, and Kaspersky documented that the trojanized ffmpeg.dll inside 3CXDesktopApp 18.12.407/416 reads encrypted shellcode after 0xFEEDFACE in d3dcompiler_47.dll.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>7</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Users\\j.miller\\AppData\\Local\\Programs\\3CXDesktopApp\\3CXDesktopApp.exe</Data>
    <Data Name="ImageLoaded">C:\\Users\\j.miller\\AppData\\Local\\Programs\\3CXDesktopApp\\ffmpeg.dll</Data>
    <Data Name="Hashes">SHA256=7986BBAEE8940DA11CE089383521AB420C443AB7B15ED42AED91FD31CE833896</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'CrowdStrike / Kaspersky YARA — 3CX Trojanized ffmpeg.dll & d3dcompiler_47.dll',
        ruleCode: `rule Lazarus_3CX_SupplyChain_d3dcompiler_Payload {
  meta:
    author = "CrowdStrike / Kaspersky GReAT / Mandiant"
    cve = "CVE-2023-29059"
  strings:
    $marker = { FE ED FA CE }
    $rc4_key = "3jB(2bsG#@c7" ascii
    $mutex = "AVMonitorEvent" wide ascii
  condition:
    uint16(0) == 0x5a4d and 2 of them
}`,
        mitigation:
          'Uninstall compromised 3CXDesktopApp versions (18.12.407 and 18.12.416) immediately and update to clean builds signed with the rotated 3CX certificate.',
      },
    },
    {
      id: '3cx-29059-2',
      no: 2,
      stageIndex: 2,
      timestamp: '11:04:18.882',
      sourceNodeId: 'ffmpeg_d3d_loader',
      targetNodeId: 'lazarus_3cx_repo',
      sourceLabel: '3CXDesktopApp.exe',
      targetLabel: 'raw.githubusercontent.com',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 22 (DNS) / HTTPS',
      shortAction: 'GITHUB .ICO DEAD-DROP',
      info: 'GET https://raw.githubusercontent.com/IconStorages/images/main/icon7.ico to decrypt C2 URL',
      sizeOrCode: 'AES-GCM C2 URL',
      severity: 'HIGH',
      mitreId: 'T1102.001',
      explanation:
        'The decrypted stage-2 shellcode fetches icon1.ico..icon14.ico from the IconStorages GitHub repository and extracts the Base64 string appended after "$" at the end of the icon.',
      rawLog: `GET /IconStorages/images/main/icon7.ico HTTP/1.1
Host: raw.githubusercontent.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
[ICO_EOF_EXTRACT] "$2b7k9mP...==" -> AES-GCM Decrypt -> "https://akamaicontainer.com/gl"`,
      detectionRule: {
        type: 'SIGMA',
        title: '3CXDesktopApp Connecting to Lazarus C2 or GitHub IconStorages Dead-Drop',
        ruleCode: `title: 3CXDesktopApp Supply Chain Malicious Network Beacon (CVE-2023-29059)
logsource:
  category: dns_query
  product: windows
detection:
  selection:
    Image|endswith: '\\3CXDesktopApp.exe'
    QueryName|contains:
      - 'akamaicontainer.com'
      - 'azureonlinestorage.com'
      - 'msstorageboxes.com'
      - 'githubusercontent.com'
  condition: selection
level: critical`,
        mitigation:
          'Block all known SmoothOperator C2 domains at the DNS/proxy layer and hunt for 3CXDesktopApp.exe initiating connections to non-PBX external domains.',
      },
    },
    {
      id: '3cx-29059-3',
      no: 3,
      stageIndex: 3,
      timestamp: '11:04:22.410',
      sourceNodeId: 'ffmpeg_d3d_loader',
      targetNodeId: 'iconicstealer_gopuram',
      sourceLabel: '3CXDesktopApp.exe (In-Memory)',
      targetLabel: 'ICONICSTEALER / Gopuram',
      sourceType: 'SYSMON',
      protocolOrEventId: 'EDR Memory / File Access',
      shortAction: 'ICONICSTEALER & GOPURAM',
      info: 'In-memory ICONICSTEALER harvests browser SQLite data; high-value targets receive Gopuram backdoor',
      sizeOrCode: 'In-Memory DLL',
      severity: 'CRITICAL',
      mitreId: 'T1555.003',
      explanation:
        'Mandiant and CrowdStrike analyzed the ICONICSTEALER browser harvester, while Kaspersky GReAT uncovered the deployment of the Gopuram backdoor on targeted machines.',
      rawLog: `[EDR_BEHAVIOR] Process="3CXDesktopApp.exe" PID=6120
Action="ReadBrowserData" Target="C:\\Users\\j.miller\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History"
C2_Beacon="POST https://akamaicontainer.com/gl" Cookie="tutma=..."
Secondary_Implant="Gopuram" (Kaspersky GReAT detection on select targets)`,
      detectionRule: {
        type: 'SIGMA',
        title: '3CXDesktopApp Accessing Browser Credential/History SQLite Databases',
        ruleCode: `title: ICONICSTEALER Browser Data Access via 3CXDesktopApp
logsource:
  category: file_access
  product: windows
detection:
  selection:
    Image|endswith: '\\3CXDesktopApp.exe'
    TargetFilename|contains:
      - '\\Google\\Chrome\\User Data\\'
      - '\\Microsoft\\Edge\\User Data\\'
      - '\\BraveSoftware\\Brave-Browser\\User Data\\'
  condition: selection
level: critical`,
        mitigation:
          'Re-image endpoints where ICONICSTEALER or Gopuram executed, and rotate all browser-stored session tokens and corporate credentials.',
      },
    },
  ],
};
