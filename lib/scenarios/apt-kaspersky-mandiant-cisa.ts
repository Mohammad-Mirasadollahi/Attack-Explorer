import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT SCENARIOS — KASPERSKY GREAT, MANDIANT, SPLUNK & CISA
 * ============================================================================
 * Strictly extracted from official technical threat research reports:
 * 1. Kaspersky GReAT (Securelist): Operation Triangulation (CVE-2023-41990 & TriangleDB)
 * 2. Kaspersky GReAT (Securelist): ToddyCat APT (ESET CVE-2024-11859 & TCESB Loader)
 * 3. Kaspersky GReAT & Microsoft: Lazarus Group (CVE-2024-21338 & FUDModule Rootkit)
 * 4. Mandiant & CISA AA23-347A: APT29 TeamCity (CVE-2023-42793 & GraphicalProton)
 * 5. Splunk STRT & Huntress: ConnectWise ScreenConnect (CVE-2024-1709 SlashAndGrab)
 */

export const KASPERSKY_OPERATION_TRIANGULATION_SCENARIO: AttackScenario = {
  id: 'kaspersky-operation-triangulation',
  code: 'CVE-2023-41990',
  name: 'Kaspersky GReAT — Operation Triangulation: Zero-Click Font Exploit, MMIO & TriangleDB',
  shortSubtitle: 'Kaspersky Securelist · CVE-2023-41990 ADJUST TrueType Font, CVE-2023-38606 MMIO & TriangleDB',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered and reverse-engineered by Kaspersky GReAT (Securelist, 2023–2024), Operation Triangulation is a 4-zero-day, zero-click APT chain. A hidden iMessage attachment triggers an undocumented TrueType font instruction (ADJUST, CVE-2023-41990) inside IMTransferAgent, chains JavaScriptCore NaN-boxing RCE with a Mach integer overflow (CVE-2023-32434) and undocumented hardware MMIO DMA registers (CVE-2023-38606) to bypass Page Protection Layer (PPL), scrubs sms.db logs, and runs the in-memory TriangleDB implant.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Kaspersky GReAT (Securelist) — Operation Triangulation 4-Zero-Day Chain & TriangleDB',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1203 (CVE-2023-41990 Font RCE) · T1068 (CVE-2023-38606 Hardware MMIO) · T1620 (TriangleDB)',
    },
    {
      term: 'FOUR ZERO-DAYS',
      value: 'CVE-2023-41990 (ADJUST Font), CVE-2023-32434 (XNU Kernel), CVE-2023-32435, CVE-2023-38606 (MMIO)',
    },
    {
      term: 'IMPLANT MODULES',
      value: 'TriangleDB (CRConfig, CROs, CRNet, CRDB, CRAudio — Memory-Only Mach-O)',
    },
  ],
  nodes: [
    {
      id: 'triangulation_c2',
      label: 'Triangulation Validator & C2',
      sublabel: '198.51.100.201:443 (WebGL Canvas Fingerprinter)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Operation Triangulation Multi-Stage C2 Server',
        pidOrPort: 'HTTPS :443 (TLS 1.3)',
        privilege: 'Zero-Click APT Infrastructure',
        artifacts: [
          'Stage-1 JavaScriptCore Validator (Canvas Triangle Fingerprinting)',
          'Stage-3 Binary Validator & TriangleDB Mach-O Implant',
        ],
        description:
          'APT C2 server that fingerprints the target SoC via WebGL yellow-triangle rendering ("Triangulation") before delivering the kernel exploit and TriangleDB.',
      },
    },
    {
      id: 'imtransferagent_proc',
      label: 'IMTransferAgent (Font & JSC)',
      sublabel: 'PID 412 · Zero-Click Attachment Parser',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Apple iOS / macOS IMTransferAgent Daemon',
        pidOrPort: 'PID 412 · libTrueTypeScaler.dylib & JavaScriptCore',
        privilege: 'mobile (User Sandbox)',
        artifacts: [
          'CVE-2023-41990: Undocumented TrueType Opcode 0x8F/0x90 (ADJUST)',
          'JOP Rope-Chain Executing JavaScriptCore in IMTransferAgent',
        ],
        description:
          'Background daemon processing incoming iMessage attachments without user interaction, exploited via the legacy TrueType ADJUST opcode.',
      },
    },
    {
      id: 'xnu_mmio_kernel',
      label: 'XNU Kernel & MMIO DMA Registers',
      sublabel: '0x206040000 (Hardware MMIO PPL Bypass)',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Apple Silicon Hardware MMIO & XNU Kernel Space',
        pidOrPort: 'CVE-2023-32434 + CVE-2023-38606 (MMIO Physical DMA)',
        privilege: 'Kernel Ring-0 / PPL Bypass',
        artifacts: [
          'Writes physical memory via undocumented GPU/SoC MMIO registers',
          'TriangleDB Mach-O Implant (CRConfig, CROs, CRAudio)',
        ],
        description:
          'Hardware-assisted kernel exploit using undocumented MMIO registers to write directly to physical memory, bypassing Apple Page Protection Layer (PPL).',
      },
    },
    {
      id: 'sms_db_forensics',
      label: 'sms.db & Keychain / Microphone',
      sublabel: '/private/var/mobile/Library/SMS/sms.db',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'SQLite Message Database & Protected Data Stores',
        pidOrPort: 'sms.db + Keychain + Locationd',
        privilege: 'Root / Unsandboxed Access',
        artifacts: [
          'SQLite DELETE scrubbing exploit attachment row from sms.db',
          'TriangleDB Exfiltration of Keychain, Audio & Geolocation',
        ],
        description:
          'Local SQLite message store scrubbed by the binary validator to erase all traces of the incoming zero-click attachment.',
      },
    },
    {
      id: 'kaspersky_mvt_siem',
      label: 'Kaspersky triangle_check & NDR',
      sublabel: 'DataUsage.sqlite & DNS/TLS Telemetry',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Kaspersky GReAT Forensic Analyzer & Network Tap',
        pidOrPort: 'DataUsage.sqlite, OSAnalytics & Zeek TLS',
        privilege: 'DFIR & NDR Sensor',
        artifacts: [
          'DataUsage.sqlite: com.apple.imagent / IMTransferAgent Anomaly',
          'Backup Timestamp Modification Artifacts (triangle_check)',
        ],
        description:
          'Detects Operation Triangulation via network egress from IMTransferAgent and forensic timestamp anomalies in DataUsage.sqlite.',
      },
    },
  ],
  processTree: [
    {
      pid: 412,
      ppid: 1,
      name: 'IMTransferAgent',
      commandLine: '/System/Library/PrivateFrameworks/IMTransferServices.framework/IMTransferAgent',
      user: 'mobile',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'fnt_ADJUST (CVE-2023-41990 TrueType Opcode)',
        'JSC::evaluate (NaN-Boxing Pointer Read/Write)',
        'mach_vm_remap (CVE-2023-32434 Integer Overflow)',
      ],
    },
    {
      pid: 618,
      ppid: 1,
      name: 'BackupAgent2 (TriangleDB)',
      commandLine: '/usr/libexec/BackupAgent2 (Injected In-Memory TriangleDB Mach-O)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'MMIO_PhysicalWrite(0x206040000) [CVE-2023-38606]',
        'sqlite3_exec("DELETE FROM attachment WHERE ...")',
        'CRNet::PollC2Tasking()',
      ],
      memoryBlocks: [
        {
          address: '0x0000000104800000',
          section: 'TriangleDB In-Memory Mach-O (CRConfig/CROs)',
          permissions: 'R-X',
          size: '220 KB',
          status: 'injected',
          description:
            'Memory-only Mach-O spyware implant loaded after CVE-2023-38606 MMIO kernel privilege escalation.',
          hexPreview: 'CF FA ED FE 0C 00 00 01 00 00 00 00 02 00 00 00',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ZERO-CLICK IMESSAGE TRUETYPE ADJUST EXPLOIT (CVE-2023-41990)',
      subtitle: 'Undocumented TrueType font opcode 0x8F/0x90 triggers JOP inside IMTransferAgent',
      description:
        'As discovered by Kaspersky GReAT, the victim receives an invisible iMessage attachment containing a crafted TrueType font inside a PDF. Parsing the undocumented legacy Apple TrueType instruction ADJUST (CVE-2023-41990) corrupts the font scaler heap in IMTransferAgent, launching a Jump-Oriented Programming (JOP) chain into JavaScriptCore.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1203',
      mitreTechniqueName: 'Exploitation for Client Execution',
      activeNodeIds: ['triangulation_c2', 'imtransferagent_proc', 'kaspersky_mvt_siem'],
      compromisedNodeIds: ['imtransferagent_proc'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-41990 (Undocumented TrueType Font ADJUST Instruction)' },
        { term: 'TARGET DAEMON', value: 'IMTransferAgent (Zero-Click Execution)' },
        { term: 'STAGE-1 ENGINE', value: 'JavaScriptCore NaN-Boxing 64-bit R/W Primitive' },
      ],
    },
    {
      index: 2,
      title: 'XNU INTEGER OVERFLOW & HARDWARE MMIO BYPASS (CVE-2023-38606)',
      subtitle: 'Bypassing hardware Page Protection Layer (PPL) via undocumented SoC MMIO registers',
      description:
        'From JavaScriptCore, the exploit triggers an integer overflow in XNU Mach virtual memory (CVE-2023-32434) for full physical memory access. To defeat Apple Silicon hardware-enforced Page Protection Layer (PPL), the exploit writes directly to undocumented hardware MMIO DMA registers (CVE-2023-38606) at physical address 0x206040000.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['imtransferagent_proc', 'xnu_mmio_kernel', 'sms_db_forensics'],
      compromisedNodeIds: ['imtransferagent_proc', 'xnu_mmio_kernel'],
      keySpecs: [
        { term: 'KERNEL CVE', value: 'CVE-2023-32434 (XNU mach_vm_remap Integer Overflow)' },
        { term: 'HARDWARE MMIO CVE', value: 'CVE-2023-38606 (Undocumented SoC MMIO DMA PPL Bypass)' },
        { term: 'ANTI-FORENSICS', value: 'Scrubs exploit attachment records from sms.db SQLite database' },
      ],
    },
    {
      index: 3,
      title: 'IN-MEMORY TRIANGLEDB IMPLANT DEPLOYMENT',
      subtitle: 'Loading memory-only Mach-O implant (CRConfig, CROs, CRAudio)',
      description:
        'After scrubbing sms.db and validating the environment, the loader injects the TriangleDB Mach-O implant into memory without touching the filesystem. TriangleDB decrypts its configuration with 3DES, monitors processes (CROs), records microphone audio (CRAudio), and exfiltrates SQLite/Keychain artifacts over HTTPS.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1620',
      mitreTechniqueName: 'Reflective Code Loading',
      activeNodeIds: ['xnu_mmio_kernel', 'sms_db_forensics', 'triangulation_c2', 'kaspersky_mvt_siem'],
      compromisedNodeIds: ['imtransferagent_proc', 'xnu_mmio_kernel', 'sms_db_forensics'],
      keySpecs: [
        { term: 'IMPLANT NAME', value: 'TriangleDB (Memory-Resident Mach-O Spyware)' },
        { term: 'OBJC CLASSES', value: 'CRConfig, CROs, CRNet, CRDB, CRFile, CRAudio' },
        { term: 'PERSISTENCE', value: 'Zero-click re-infection; disappears completely on reboot' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'kas-tri-1',
      no: 1,
      stageIndex: 1,
      timestamp: '03:09:41.112',
      sourceNodeId: 'imtransferagent_proc',
      targetNodeId: 'triangulation_c2',
      sourceLabel: 'IMTransferAgent (PID 412)',
      targetLabel: '198.51.100.201:443',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Zeek TLS / DataUsage',
      shortAction: 'IMTRANSFERAGENT C2',
      info: 'IMTransferAgent connecting to non-Apple CDN 198.51.100.201:443 after CVE-2023-41990 font parse',
      sizeOrCode: 'TLS 1.3',
      severity: 'CRITICAL',
      mitreId: 'T1203',
      explanation:
        'Kaspersky GReAT discovered Operation Triangulation when network monitoring flagged IMTransferAgent making HTTPS connections to non-Apple external domains.',
      rawLog: `[ZEEK_SSL_AND_DATAUSAGE_SQLITE]
Process: com.apple.imtranscoding.IMTransferAgent
DstIP: 198.51.100.201:443 | TLSv1.3
DataUsage.sqlite ZPROCESS: ZPROCNAME="IMTransferAgent" ZWWANIN=48120 ZWWANOUT=16420
OSAnalytics Crash/Spin Hint: libTrueTypeScaler.dylib!fnt_ADJUST + 0x114`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Kaspersky GReAT — Operation Triangulation Non-Apple Egress from IMTransferAgent',
        ruleCode: `alert tls $HOME_NET any -> $EXTERNAL_NET 443 (msg:"KASPERSKY Operation Triangulation Stage-1 Validator TLS"; flow:established,to_server; tls.sni; content:!"apple.com"; content:!"icloud.com"; content:!"mzstatic.com"; classtype:trojan-activity; sid:202341990; rev:1;)`,
        mitigation:
          'Update Apple devices beyond iOS 16.6 / macOS Ventura 13.5, enable Lockdown Mode (which disables legacy font parsers in iMessage), and audit DataUsage.sqlite with triangle_check.',
      },
    },
    {
      id: 'kas-tri-2',
      no: 2,
      stageIndex: 2,
      timestamp: '03:09:43.805',
      sourceNodeId: 'imtransferagent_proc',
      targetNodeId: 'xnu_mmio_kernel',
      sourceLabel: 'Stage-3 Validator',
      targetLabel: 'MMIO 0x206040000',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'CVE-2023-38606 MMIO',
      shortAction: 'MMIO DMA PPL BYPASS',
      info: 'mach_vm_remap OOB (CVE-2023-32434) -> Physical DMA Write via MMIO 0x206040000 (CVE-2023-38606)',
      sizeOrCode: 'Ring-0 / PPL',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Kaspersky GReAT reverse-engineered how the exploit programs undocumented hardware MMIO registers on Apple A12–A16 SoCs to write physical memory bypassing PPL.',
      rawLog: `[KASPERSKY_GREAT_KERNEL_TRACE]
Exploit Stage: Binary Validator -> XNU Kernel Escalation
1. CVE-2023-32434: mach_vm_remap(..., size=0xFFFFFFFFFFFFC000) -> Physical R/W Map
2. CVE-2023-38606: MMIO Register Base 0x206040000 -> Hardware DMA Write to PPL Page Table
3. Anti-Forensics: sqlite3_exec("/private/var/mobile/Library/SMS/sms.db", "DELETE FROM message WHERE ROWID=...")`,
      detectionRule: {
        type: 'YARA',
        title: 'Kaspersky GReAT — Operation Triangulation MMIO Kernel Exploit',
        ruleCode: `rule Kaspersky_OperationTriangulation_MMIO_Exploit {
  meta:
    author = "Kaspersky GReAT"
    cve = "CVE-2023-38606 / CVE-2023-32434"
  strings:
    $s1 = "/private/var/mobile/Library/SMS/sms.db" ascii
    $s2 = "IMTransferAgent" ascii
    $mmio = { 00 00 04 06 02 00 00 00 }
  condition:
    uint32(0) == 0xFEEDFACF and 2 of them
}`,
        mitigation:
          'Inspect iTunes backups using Kaspersky triangle_check for modified Info.plist/Manifest.db timestamps coinciding with IMTransferAgent network activity.',
      },
    },
    {
      id: 'kas-tri-3',
      no: 3,
      stageIndex: 3,
      timestamp: '03:09:46.290',
      sourceNodeId: 'xnu_mmio_kernel',
      targetNodeId: 'sms_db_forensics',
      sourceLabel: 'TriangleDB Implant',
      targetLabel: 'CRConfig / CRAudio',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Mach-O TriangleDB',
      shortAction: 'LOAD TRIANGLEDB',
      info: 'In-Memory Mach-O Implant (CRConfig, CROs, CRNet, CRDB, CRAudio) Running Inside BackupAgent2',
      sizeOrCode: '220 KB Mach-O',
      severity: 'CRITICAL',
      mitreId: 'T1620',
      explanation:
        'TriangleDB operates strictly in RAM with Objective-C classes prefixed with "CR" (CRConfig, CROs, CRNet, CRDB, CRAudio).',
      rawLog: `[MEMORY_FORENSICS_MACHO_SCAN]
Host Process: /usr/libexec/BackupAgent2 (PID 618, UID 0)
Unbacked Mach-O Header at 0x104800000 (MH_EXECUTE, ARM64)
Objective-C Classes: CRConfig, CROs, CRNet, CRDB, CRFile, CRAudio
3DES Decrypted C2 Config: Heartbeat=60s, Modules=[MicRecord, KeychainDump, SQLiteSteal]`,
      detectionRule: {
        type: 'YARA',
        title: 'Kaspersky GReAT Official YARA — TriangleDB Spyware Implant',
        ruleCode: `rule Kaspersky_APT_OperationTriangulation_TriangleDB {
  meta:
    author = "Kaspersky GReAT (Securelist)"
    reference = "Dissecting TriangleDB"
  strings:
    $c1 = "CRConfig" ascii
    $c2 = "CRPoller" ascii
    $c3 = "CROs" ascii
    $c4 = "CRAudio" ascii
    $c5 = "populateWithFields" ascii
  condition:
    uint32(0) == 0xFEEDFACF and 4 of ($c*)
}`,
        mitigation:
          'Rebooting the device purges the memory-resident TriangleDB implant; block the C2 domains at the DNS/firewall layer and patch to the latest OS release.',
      },
    },
  ],
};

export const KASPERSKY_TODDYCAT_ESET_DLL_SCENARIO: AttackScenario = {
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
      user: 'CORP\\k.tanaka',
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

export const KASPERSKY_LAZARUS_BYOVD_FUDMODULE_SCENARIO: AttackScenario = {
  id: 'kaspersky-lazarus-byovd-fudmodule',
  code: 'CVE-2024-21338',
  name: 'Kaspersky, Microsoft & Avast — Lazarus Group (Diamond Sleet): appid.sys Zero-Day & FUDModule Rootkit',
  shortSubtitle: 'Kaspersky GReAT / Avast / Microsoft · CVE-2024-21338 AppLocker Driver IOCTL & FUDModule DKOM Blindness',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview:
    'Documented by Avast, Kaspersky GReAT, and Microsoft Threat Intelligence (Diamond Sleet / Lazarus Group, Feb 2024), North Korean APT operators exploited a zero-day arbitrary kernel pointer dereference in the native Windows AppLocker driver C:\\Windows\\System32\\drivers\\appid.sys (CVE-2024-21338) as well as BYOVD drivers (dbutil_2_3.sys). Using kernel read/write primitives, Lazarus deployed the in-memory FUDModule v3 rootkit to perform Direct Kernel Object Manipulation (DKOM)—zeroing out PsSetCreateProcessNotifyRoutine, ObRegisterCallbacks, minifilters, and EtwThreatIntProvRegHandle to completely blind Sysmon and EDR.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Avast, Kaspersky GReAT & Microsoft Threat Intelligence — Lazarus FUDModule & CVE-2024-21338',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1068 (CVE-2024-21338 appid.sys EoP) · T1562.001 (Disable Kernel Callbacks & ETW-Ti) · T1014 (DKOM)',
    },
    {
      term: 'VULNERABLE DRIVER',
      value: 'C:\\Windows\\System32\\drivers\\appid.sys (IOCTL 0x22A018) / Dell dbutil_2_3.sys',
    },
    {
      term: 'DKOM TARGETS',
      value: 'PspCreateProcessNotifyRoutine, ObRegisterCallbacks, FltGlobals & EtwThreatIntProvRegHandle',
    },
  ],
  nodes: [
    {
      id: 'lazarus_c2_node',
      label: 'Lazarus (Diamond Sleet) C2',
      sublabel: '198.51.100.188:443 (Kaolin RAT C2)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Lazarus Group (Andariel / Diamond Sleet) C2',
        pidOrPort: 'HTTPS :443',
        privilege: 'Nation-State APT Operator',
        artifacts: [
          'Delivers FUDModule DLL & Kaolin RAT',
          'Targets Defense, Aerospace & Semiconductor R&D',
        ],
        description:
          'Lazarus Group C2 server delivering the FUDModule rootkit and receiving exfiltrated R&D source code after EDR sensors are blinded.',
      },
    },
    {
      id: 'wks_appid_host',
      label: 'appid.sys (AppLocker Driver)',
      sublabel: 'IOCTL 0x22A018 · RND-WKS-05 (10.10.40.15)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows 11 Built-in AppLocker Kernel Driver',
        pidOrPort: 'Device: \\\\?\\GLOBALROOT\\Device\\AppId (IOCTL 0x22A018)',
        privilege: 'LOCAL SERVICE -> Kernel Ring-0',
        artifacts: [
          'CVE-2024-21338: AipSmartHashImageFile Spoofed Function Pointer',
          'Token Manipulation: PreviousMode -> 0 (KernelMode)',
        ],
        description:
          'Native Windows AppLocker driver (appid.sys) exploited via IOCTL 0x22A018 to flip ETHREAD.PreviousMode to 0, granting user-mode FUDModule full Ring-0 read/write.',
      },
    },
    {
      id: 'fudmodule_dkom_engine',
      label: 'FUDModule v3 DKOM Engine',
      sublabel: 'Zeroes Kernel Callbacks & ETW-Ti',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'In-Memory Rootkit & EDR Blinder (FUDModule)',
        pidOrPort: 'NtReadVirtualMemory / NtWriteVirtualMemory on Kernel Addresses',
        privilege: 'PreviousMode=0 (Kernel Read/Write)',
        artifacts: [
          'Zeroes PspCreateProcessNotifyRoutine & PspCreateThreadNotifyRoutine',
          'Disables EtwThreatIntProvRegHandle & Protected Process Light (PPL)',
        ],
        description:
          'FUDModule rootkit using PreviousMode=0 to directly overwrite ntoskrnl.exe callback arrays and suspend EDR user-mode processes.',
      },
    },
    {
      id: 'kaolin_rat_post',
      label: 'Kaolin RAT & LSASS Dump',
      sublabel: 'Unmonitored Post-Exploitation (PID 7012)',
      role: 'process',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Lazarus Kaolin RAT & Credential Dumper',
        pidOrPort: 'PID 7012 (Invisible to Blinded EDR)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'Direct LSASS Memory Read after ObRegisterCallbacks Removal',
          'Exfiltrates Aerospace & Semiconductor Source Repositories',
        ],
        description:
          'Post-exploitation RAT executing freely once FUDModule has unlinked Sysmon and EDR kernel callbacks.',
      },
    },
    {
      id: 'edr_blindness_siem',
      label: 'Sysmon & Defender XDR Sensor',
      sublabel: 'appid.sys Access & Telemetry Heartbeat Drop',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'SOC SIEM & Kernel Patch Protection Monitor',
        pidOrPort: 'Sysmon EID 1, 10 & Heartbeat Watchdog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: Non-AppIDSvc Process Opening \\Device\\AppId (CVE-2024-21338)',
          'Alert: Sudden EDR / Sysmon Kernel Callback Unregistration',
        ],
        description:
          'Detects the pre-blindness token impersonation into LOCAL SERVICE and handle creation to \\Device\\AppId.',
      },
    },
  ],
  processTree: [
    {
      pid: 4820,
      ppid: 890,
      name: 'svchost.exe (Hijacked LocalService)',
      commandLine: 'C:\\Windows\\System32\\svchost.exe -k LocalService (FUDModule Injected)',
      user: 'NT AUTHORITY\\LOCAL SERVICE',
      integrity: 'System' as 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'CreateFileW("\\\\?\\GLOBALROOT\\Device\\AppId")',
        'DeviceIoControl(0x22A018) [CVE-2024-21338]',
        'NtWriteVirtualMemory(KTHREAD.PreviousMode, 0)',
        'NtWriteVirtualMemory(PspCreateProcessNotifyRoutine, NULL)',
      ],
      memoryBlocks: [
        {
          address: '0xFFFFF80142A00000',
          section: 'ntoskrnl.exe!PspCreateProcessNotifyRoutine (DKOM Zeroed)',
          permissions: 'RW-',
          size: '512 Bytes',
          status: 'patched',
          description:
            'Kernel callback array overwritten by FUDModule via PreviousMode=0 to blind Sysmon and EDR drivers.',
          hexPreview: '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
        },
      ],
    },
    {
      pid: 7012,
      ppid: 4820,
      name: 'dllhost.exe (Kaolin RAT)',
      commandLine: 'C:\\Windows\\System32\\dllhost.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['OpenProcess(lsass.exe)', 'MiniDumpWriteDump', 'WinHttpSendRequest'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'APPID.SYS KERNEL ZERO-DAY EXPLOIT (CVE-2024-21338)',
      subtitle: 'Sending crafted IOCTL 0x22A018 to \\Device\\AppId to flip KTHREAD.PreviousMode',
      description:
        'Instead of dropping a noisy third-party BYOVD driver onto disk, Lazarus Group (Diamond Sleet) impersonates LOCAL SERVICE and opens a handle to the built-in Windows AppLocker driver (\\Device\\AppId). By sending a crafted IOCTL 0x22A018 buffer (CVE-2024-21338), AipSmartHashImageFile calls a controlled kernel gadget (kcfg_ObfDereferenceObjectWithTag) that decrements KTHREAD.PreviousMode from 1 (UserMode) to 0 (KernelMode).',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine', 'edr_blindness_siem'],
      compromisedNodeIds: ['wks_appid_host'],
      keySpecs: [
        { term: 'ZERO-DAY CVE', value: 'CVE-2024-21338 (Windows AppLocker Driver appid.sys EoP)' },
        { term: 'IOCTL CODE', value: '0x22A018 -> AipSmartHashImageFile Pointer Dereference' },
        { term: 'PRIMITIVE GAINED', value: 'KTHREAD.PreviousMode = 0 (Direct Kernel R/W via NtWriteVirtualMemory)' },
      ],
    },
    {
      index: 2,
      title: 'FUDMODULE V3 DKOM: BLINDING SYSMON, ETW-TI & EDR',
      subtitle: 'Zeroing PspCreateProcessNotifyRoutine, ObRegisterCallbacks & EtwThreatIntProvRegHandle',
      description:
        'With PreviousMode set to 0, user-mode NtReadVirtualMemory and NtWriteVirtualMemory can directly read and modify kernel memory without any custom driver loaded. FUDModule v3 locates ntoskrnl.exe structures and zeroes out Process/Thread/Image notify routines, unlinks EDR Object Callbacks, disables ETW Threat Intelligence, and strips Protected Process Light (PPL) flags.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Tools',
      activeNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine', 'edr_blindness_siem'],
      compromisedNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine'],
      keySpecs: [
        { term: 'ROOTKIT NAME', value: 'FUDModule v3 (Lazarus Group / Diamond Sleet)' },
        { term: 'DKOM TARGETS', value: 'PspCreateProcessNotifyRoutine, ObRegisterCallbacks, EtwThreatIntProvRegHandle' },
        { term: 'EDR IMPACT', value: 'Complete telemetry blindness for Sysmon, ETW & EDR kernel drivers' },
      ],
    },
    {
      index: 3,
      title: 'UNMONITORED KAOLIN RAT & LSASS CREDENTIAL DUMP',
      subtitle: 'Dumping LSASS memory and deploying Kaolin RAT while EDR is blinded',
      description:
        'Once EDR and Sysmon kernel callbacks are disabled, FUDModule spawns Kaolin RAT and dumps LSASS memory without triggering ObRegisterCallbacks blocks, then restores PreviousMode=1 so Kernel Patch Protection (PatchGuard) does not immediately bugcheck the host.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.001',
      mitreTechniqueName: 'OS Credential Dumping: LSASS Memory',
      activeNodeIds: ['fudmodule_dkom_engine', 'kaolin_rat_post', 'lazarus_c2_node'],
      compromisedNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine', 'kaolin_rat_post'],
      keySpecs: [
        { term: 'RAT PAYLOAD', value: 'Kaolin RAT (Loaded in memory after DKOM blindness)' },
        { term: 'LSASS ACCESS', value: 'Unrestricted PROCESS_VM_READ after ObRegisterCallbacks removal' },
        { term: 'THREAT ACTOR', value: 'Lazarus Group / Diamond Sleet (DPRK)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'kas-laz-1',
      no: 1,
      stageIndex: 1,
      timestamp: '05:19:04.215',
      sourceNodeId: 'wks_appid_host',
      targetNodeId: 'edr_blindness_siem',
      sourceLabel: 'svchost.exe (PID 4820)',
      targetLabel: '\\Device\\AppId (appid.sys)',
      sourceType: 'WIN32_API',
      protocolOrEventId: 'CVE-2024-21338 IOCTL',
      shortAction: 'APPID.SYS IOCTL 0x22A018',
      info: 'DeviceIoControl("\\\\?\\GLOBALROOT\\Device\\AppId", 0x22A018) -> AipSmartHashImageFile',
      sizeOrCode: 'PreviousMode=0',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Avast and Kaspersky GReAT documented that CVE-2024-21338 is triggered by a process running as LOCAL SERVICE opening \\Device\\AppId and sending IOCTL 0x22A018.',
      rawLog: `[ETW_KERNEL_FILE_AND_IOCTL_TRACE]
Process: C:\\Windows\\System32\\svchost.exe (PID 4820, User: NT AUTHORITY\\LOCAL SERVICE)
TargetDevice: \\Device\\AppId (C:\\Windows\\System32\\drivers\\appid.sys)
IoControlCode: 0x0022A018 (AipSmartHashImageFile)
KernelCall: nt!ObfDereferenceObjectWithTag -> Decrements KTHREAD(0xFFFFCA8124908080)+0x232 (PreviousMode: 1 -> 0)`,
      detectionRule: {
        type: 'YARA',
        title: 'Avast / Kaspersky GReAT — Lazarus FUDModule CVE-2024-21338 Rootkit',
        ruleCode: `rule Lazarus_DiamondSleet_FUDModule_CVE_2024_21338 {
  meta:
    author = "Avast / Kaspersky GReAT"
    cve = "CVE-2024-21338"
  strings:
    $dev = "\\\\?\\GLOBALROOT\\Device\\AppId" wide ascii
    $ioctl = { 18 A0 22 00 }
    $fn1 = "EtwThreatIntProvRegHandle" ascii
    $fn2 = "PspCreateProcessNotifyRoutine" ascii
  condition:
    uint16(0) == 0x5A4D and ($dev and $ioctl) or ($fn1 and $fn2)
}`,
        mitigation:
          'Apply the February 2024 Microsoft security update patching CVE-2024-21338 in appid.sys and enable Hypervisor-Protected Code Integrity (HVCI).',
      },
    },
    {
      id: 'kas-laz-2',
      no: 2,
      stageIndex: 2,
      timestamp: '05:19:04.580',
      sourceNodeId: 'fudmodule_dkom_engine',
      targetNodeId: 'edr_blindness_siem',
      sourceLabel: 'FUDModule DKOM',
      targetLabel: 'ntoskrnl Callbacks',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'DKOM Callback Wipe',
      shortAction: 'BLIND SYSMON & ETW-TI',
      info: 'NtWriteVirtualMemory zeroes PspCreateProcessNotifyRoutine, ObRegisterCallbacks & EtwThreatIntProvRegHandle',
      sizeOrCode: 'EDR Blinded',
      severity: 'CRITICAL',
      mitreId: 'T1562.001',
      explanation:
        'Using PreviousMode=0, FUDModule overwrites kernel notification arrays and ETW-Ti provider handles directly from user mode, silencing endpoint telemetry.',
      rawLog: `[DEFENDER_TAMPER_TELEMETRY_FINAL_EVENT]
Host: RND-WKS-05.corp.local
Anomaly: Kernel Callback Integrity Violation Detected Prior to Sensor Silence
Modified Symbols:
  - nt!PspCreateProcessNotifyRoutine[0..8] -> 0x0000000000000000
  - nt!EtwThreatIntProvRegHandle -> Provider Registration Cleared
  - fltmgr!FltGlobals -> Minifilter Frame Unlinked`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Sudden Endpoint Telemetry Silence After LocalService Token Manipulation',
        ruleCode: `title: Suspicious Access to AppLocker Driver Device AppId
logsource:
  category: file_access
  product: windows
detection:
  selection:
    TargetFilename|contains: '\\Device\\AppId'
  filter_legit:
    Image|endswith: '\\svchost.exe'
    CommandLine|contains: 'AppIDSvc'
  condition: selection and not filter_legit
level: critical`,
        mitigation:
          'Monitor endpoint agent heartbeats in the SIEM: a sudden total drop in Sysmon/EDR events from an active workstation indicates possible DKOM blinding.',
      },
    },
    {
      id: 'kas-laz-3',
      no: 3,
      stageIndex: 3,
      timestamp: '05:19:12.900',
      sourceNodeId: 'kaolin_rat_post',
      targetNodeId: 'lazarus_c2_node',
      sourceLabel: '10.10.40.15 (RND-WKS-05)',
      targetLabel: '198.51.100.188:443',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Zeek / Suricata NDR',
      shortAction: 'KAOLIN RAT C2',
      info: 'Network Firewall logs TLS C2 session from RND-WKS-05 with ZERO corresponding Sysmon EID 3 host log',
      sizeOrCode: 'Host/NDR Gap',
      severity: 'CRITICAL',
      mitreId: 'T1003.001',
      explanation:
        'Because FUDModule blinded the host sensor, the perimeter NDR/Firewall captures outbound Kaolin RAT traffic from 10.10.40.15 while the host Sysmon EID 3 log is completely absent.',
      rawLog: `[SIEM_HOST_VS_NDR_CORRELATION_ALERT]
SourceHost: 10.10.40.15 (RND-WKS-05.corp.local)
Firewall/Zeek Log: TCP 10.10.40.15:54192 -> 198.51.100.188:443 (BytesSent: 4,812,900)
Host Sysmon EID 3 (NetworkConnect): 0 events received in last 10 minutes (EXPECTED >= 1)
Verdict: CRITICAL — Host Kernel Sensor Blinded (DKOM / FUDModule)`,
      detectionRule: {
        type: 'KQL',
        title: 'Network Firewall Egress Without Matching Endpoint Network Telemetry (DKOM Blindness)',
        ruleCode: `CommonSecurityLog
| where SourceIP == "10.10.40.15" and DestinationPort == 443
| join kind=leftanti (
    DeviceNetworkEvents
    | where LocalIP == "10.10.40.15"
) on $left.DestinationIP == $right.RemoteIP`,
        mitigation:
          'Correlate perimeter NDR/Firewall connection logs against endpoint EDR network telemetry to detect hosts whose kernel callbacks have been blinded by rootkits.',
      },
    },
  ],
};

export const MANDIANT_APT29_TEAMCITY_JETSTREAM_SCENARIO: AttackScenario = {
  id: 'mandiant-apt29-teamcity-jetstream',
  code: 'CVE-2023-42793',
  name: 'Mandiant & CISA — APT29 (Midnight Blizzard): JetBrains TeamCity RCE & GraphicalProton',
  shortSubtitle: 'CISA AA23-347A / Mandiant · CVE-2023-42793 / CVE-2024-27198 Auth Bypass, Token Minting & OneDrive C2',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Detailed in Joint CISA/FBI/NSA/NCSC Advisory AA23-347A and Mandiant / Rapid7 threat research, Russian Foreign Intelligence Service (SVR / APT29 / Midnight Blizzard) actors exploited authentication bypass flaws in JetBrains TeamCity CI/CD servers (CVE-2023-42793 and CVE-2024-27198). Attackers minted an administrative access token via /app/rest/users/id:1/tokens/RPC2, enabled debug process execution (/app/rest/debug/processes), harvested CI/CD cloud secrets, and deployed the GraphicalProton backdoor using OneDrive for C2.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'CISA / FBI / NSA / NCSC Joint Advisory AA23-347A & Mandiant / Rapid7 Research',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (CVE-2023-42793 / CVE-2024-27198) · T1059 (TeamCity Debug RCE) · T1102.002 (OneDrive C2)',
    },
    {
      term: 'EXPLOIT ENDPOINTS',
      value: 'POST /app/rest/users/id:1/tokens/RPC2 -> POST /app/rest/debug/processes',
    },
    {
      term: 'APT29 IMPLANT',
      value: 'GraphicalProton (DLL Side-Loaded via Defender / Win32 Binary + OneDrive Graph API C2)',
    },
  ],
  nodes: [
    {
      id: 'apt29_svr_actor',
      label: 'APT29 (Midnight Blizzard)',
      sublabel: '198.51.100.91 (SVR Operator)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Russian SVR (APT29 / Cozy Bear) Infrastructure',
        pidOrPort: 'HTTP/S :8111 / :443 -> TeamCity Server',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /app/rest/users/id:1/tokens/RPC2',
          'DELETE /app/rest/users/id:1/tokens/RPC2 (Token Cleanup)',
        ],
        description:
          'APT29 operator exploiting unauthenticated REST API endpoints on internet-exposed JetBrains TeamCity CI/CD servers.',
      },
    },
    {
      id: 'teamcity_cicd_srv',
      label: 'JetBrains TeamCity CI/CD',
      sublabel: '10.10.12.50:8111 (BUILD-TC-01)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 · JetBrains TeamCity Server',
        pidOrPort: 'java.exe (Tomcat / TeamCity Service)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'teamcity-javaLogging-*.log & teamcity-server.log',
          'internal.properties (rest.debug.processes.enable=true)',
        ],
        description:
          'Enterprise CI/CD build server compromised via CVE-2023-42793 / CVE-2024-27198.',
      },
    },
    {
      id: 'graphical_proton_implant',
      label: 'GraphicalProton Backdoor',
      sublabel: 'aclui.dll Side-Load + OneDrive C2',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'APT29 GraphicalProton C2 Implant (AA23-347A)',
        pidOrPort: 'PID 6740 · Side-Loaded aclui.dll',
        privilege: 'SYSTEM / Build Agent Admin',
        artifacts: [
          'Uses Microsoft OneDrive / Dropbox REST API for C2 Tasking',
          'whoami, netstat, systeminfo & AD Kerberos Ticket Collection',
        ],
        description:
          'APT29 custom backdoor deployed onto the TeamCity server that communicates over legitimate Microsoft Graph / OneDrive endpoints.',
      },
    },
    {
      id: 'cicd_secrets_repo',
      label: 'CI/CD Secrets & Prod Cloud Keys',
      sublabel: 'SSH Keys, kubeconfig & Signing Certs',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Build Pipeline Secret Store & Source Control',
        pidOrPort: 'C:\\ProgramData\\JetBrains\\TeamCity\\config\\projects\\',
        privilege: 'Production Deployment Credentials',
        artifacts: [
          'credentials.json & params.xml (Encrypted Build Secrets)',
          'database.properties & Cloud Deployment Tokens',
        ],
        description:
          'TeamCity project configuration store containing production deployment keys and software signing certificates.',
      },
    },
    {
      id: 'cisa_splunk_siem',
      label: 'Enterprise SIEM & EDR',
      sublabel: 'teamcity-server.log & Sysmon EID 1',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'SOC SIEM & Endpoint Detection',
        pidOrPort: 'TeamCity Access Logs & Sysmon EID 1 / 7',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: CVE-2023-42793 /app/rest/users/id:1/tokens/RPC2 Request',
          'Alert: java.exe Spawning Shell via /app/rest/debug/processes',
        ],
        description:
          'Monitors TeamCity access logs for token creation on user id:1 and java.exe child processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 2240,
      ppid: 680,
      name: 'java.exe (TeamCity Server)',
      commandLine: 'C:\\TeamCity\\jre\\bin\\java.exe -Dcatalina.base=C:\\TeamCity ...',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'RequestInterceptor.preHandle() [Auth Bypassed]',
        'ProcessBuilder("/app/rest/debug/processes").start()',
      ],
    },
    {
      pid: 6740,
      ppid: 2240,
      name: 'Defender.exe (GraphicalProton)',
      commandLine: 'C:\\Windows\\Temp\\Defender.exe (Side-loads malicious aclui.dll)',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'LoadLibraryW("aclui.dll")',
        'WinHttpConnect("graph.microsoft.com")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'TEAMCITY REST API AUTH BYPASS & TOKEN MINTING (CVE-2023-42793)',
      subtitle: 'POST /app/rest/users/id:1/tokens/RPC2 mints SuperAdmin Bearer token',
      description:
        'As documented in CISA AA23-347A, the TeamCity RequestPermissionsInterceptor fails to authenticate requests matching /app/rest/users/id:1/tokens/RPC2 (CVE-2023-42793) or matrix parameter paths /hax?jsp=/app/rest/users;.jsp (CVE-2024-27198). APT29 sends a single HTTP POST to mint an administrative Bearer token for user id:1.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['apt29_svr_actor', 'teamcity_cicd_srv', 'cisa_splunk_siem'],
      compromisedNodeIds: ['teamcity_cicd_srv'],
      keySpecs: [
        { term: 'VULNERABILITIES', value: 'CVE-2023-42793 & CVE-2024-27198 (TeamCity Auth Bypass)' },
        { term: 'TOKEN ENDPOINT', value: 'POST /app/rest/users/id:1/tokens/RPC2' },
        { term: 'CLEANUP STEP', value: 'DELETE /app/rest/users/id:1/tokens/RPC2 immediately after RCE' },
      ],
    },
    {
      index: 2,
      title: 'DEBUG PROCESS RCE & CI/CD SECRET HARVESTING',
      subtitle: 'Enabling rest.debug.processes.enable and executing commands via java.exe',
      description:
        'Authenticating with the minted Bearer token, APT29 modifies internal.properties to set rest.debug.processes.enable=true and invokes POST /app/rest/debug/processes?exePath=cmd.exe, executing arbitrary commands as NT AUTHORITY\\SYSTEM and dumping TeamCity project secrets (credentials.json) and database.properties.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.003',
      mitreTechniqueName: 'Command and Scripting Interpreter: Windows Command Shell',
      activeNodeIds: ['apt29_svr_actor', 'teamcity_cicd_srv', 'cicd_secrets_repo', 'cisa_splunk_siem'],
      compromisedNodeIds: ['teamcity_cicd_srv', 'cicd_secrets_repo'],
      keySpecs: [
        { term: 'RCE ENDPOINT', value: 'POST /app/rest/debug/processes?exePath=cmd.exe&params=/c+...' },
        { term: 'PARENT PROCESS', value: 'C:\\TeamCity\\jre\\bin\\java.exe (NT AUTHORITY\\SYSTEM)' },
        { term: 'HARVESTED SECRETS', value: 'config\\projects\\*\\pluginData\\secure\\credentials.json' },
      ],
    },
    {
      index: 3,
      title: 'GRAPHICALPROTON IMPLANT & ONEDRIVE GRAPH API C2',
      subtitle: 'Deploying DLL side-loaded GraphicalProton communicating via Microsoft OneDrive',
      description:
        'To maintain stealthy long-term access after deleting the RPC2 token, APT29 deploys GraphicalProton (a trojanized aclui.dll side-loaded by a signed binary) which uses legitimate Microsoft OneDrive / Graph API endpoints for encrypted Command and Control (T1102.002).',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1102.002',
      mitreTechniqueName: 'Web Service: Bidirectional Communication',
      activeNodeIds: ['teamcity_cicd_srv', 'graphical_proton_implant', 'cisa_splunk_siem'],
      compromisedNodeIds: ['teamcity_cicd_srv', 'cicd_secrets_repo', 'graphical_proton_implant'],
      keySpecs: [
        { term: 'BACKDOOR FAMILY', value: 'GraphicalProton (APT29 / Midnight Blizzard)' },
        { term: 'C2 TRANSPORT', value: 'Microsoft Graph / OneDrive REST API (api.onedrive.com)' },
        { term: 'CISA ADVISORY', value: 'AA23-347A (SVR Exploitation of JetBrains TeamCity)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'man-tc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '22:14:03.118',
      sourceNodeId: 'apt29_svr_actor',
      targetNodeId: 'teamcity_cicd_srv',
      sourceLabel: '198.51.100.91',
      targetLabel: 'TeamCity :8111',
      sourceType: 'NETWORK',
      protocolOrEventId: 'TeamCity Access Log',
      shortAction: 'MINT RPC2 TOKEN',
      info: 'POST /app/rest/users/id:1/tokens/RPC2 HTTP/1.1 -> 200 OK (Admin Token Created)',
      sizeOrCode: 'CVE-2023-42793',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'CISA AA23-347A highlights that CVE-2023-42793 exploitation is logged in TeamCity access logs as an unauthenticated POST to /app/rest/users/id:1/tokens/RPC2.',
      rawLog: `198.51.100.91 - - [13/Nov/2024:22:14:03 +0000] "POST /app/rest/users/id:1/tokens/RPC2 HTTP/1.1" 200 142 "-" "Mozilla/5.0"
198.51.100.91 - - [13/Nov/2024:22:14:04 +0000] "POST /admin/dataDir.html?action=edit&fileName=config/internal.properties&content=rest.debug.processes.enable=true HTTP/1.1" 200 -
198.51.100.91 - - [13/Nov/2024:22:14:08 +0000] "DELETE /app/rest/users/id:1/tokens/RPC2 HTTP/1.1" 204 -`,
      detectionRule: {
        type: 'SIGMA',
        title: 'CISA AA23-347A — JetBrains TeamCity Auth Bypass Token Creation (CVE-2023-42793)',
        ruleCode: `title: JetBrains TeamCity Unauthenticated Admin Token Creation
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains:
      - '/app/rest/users/id:1/tokens'
      - '/app/rest/debug/processes'
      - ';.jsp'
  condition: selection
level: critical`,
        mitigation:
          'Upgrade JetBrains TeamCity to patched versions fixing CVE-2023-42793 and CVE-2024-27198 and never expose CI/CD management ports directly to the internet.',
      },
    },
    {
      id: 'man-tc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '22:14:05.490',
      sourceNodeId: 'teamcity_cicd_srv',
      targetNodeId: 'cicd_secrets_repo',
      sourceLabel: 'java.exe (TeamCity)',
      targetLabel: 'cmd.exe / debug/processes',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'TEAMCITY DEBUG RCE',
      info: 'ParentImage=C:\\TeamCity\\jre\\bin\\java.exe CommandLine="cmd.exe /c curl -o C:\\Windows\\Temp\\Defender.exe ..."',
      sizeOrCode: 'PID 6740',
      severity: 'CRITICAL',
      mitreId: 'T1059.003',
      explanation:
        'Invoking /app/rest/debug/processes causes the TeamCity java.exe server process (not a build agent) to spawn cmd.exe / powershell.exe.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>BUILD-TC-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6740</Data>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c C:\\Windows\\Temp\\Defender.exe</Data>
    <Data Name="ParentProcessId">2240</Data>
    <Data Name="ParentImage">C:\\TeamCity\\jre\\bin\\java.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'JetBrains TeamCity Server Spawning Suspicious Shell Process',
        ruleCode: `title: TeamCity Server Java Process Spawning Shell
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|contains: '\\TeamCity\\'
    ParentImage|endswith: '\\java.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\whoami.exe'
  condition: selection
level: critical`,
        mitigation:
          'Rotate all secrets, SSH keys, and code-signing certificates stored in TeamCity config\\projects\\*\\pluginData\\secure\\.',
      },
    },
    {
      id: 'man-tc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '22:14:11.820',
      sourceNodeId: 'graphical_proton_implant',
      targetNodeId: 'cisa_splunk_siem',
      sourceLabel: 'Defender.exe (PID 6740)',
      targetLabel: 'aclui.dll -> OneDrive C2',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 & 3',
      shortAction: 'GRAPHICALPROTON C2',
      info: 'Image=C:\\Windows\\Temp\\Defender.exe ImageLoaded=C:\\Windows\\Temp\\aclui.dll -> api.onedrive.com:443',
      sizeOrCode: 'OneDrive C2',
      severity: 'HIGH',
      mitreId: 'T1102.002',
      explanation:
        'CISA AA23-347A details APT29 side-loading aclui.dll (GraphicalProton) and polling Microsoft OneDrive APIs for C2 tasking.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>BUILD-TC-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\Temp\\Defender.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\Temp\\aclui.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'APT29 GraphicalProton aclui.dll Side-Loading (CISA AA23-347A)',
        ruleCode: `title: APT29 GraphicalProton DLL Side-Loading of aclui.dll
logsource:
  category: image_load
  product: windows
detection:
  selection:
    ImageLoaded|endswith: '\\aclui.dll'
    Signed: 'false'
  condition: selection
level: critical`,
        mitigation:
          'Block unsigned aclui.dll loads outside C:\\Windows\\System32\\ and restrict outbound connections from build servers to cloud storage APIs.',
      },
    },
  ],
};

export const SPLUNK_SCREENCONNECT_SLASHANDGRAB_SCENARIO: AttackScenario = {
  id: 'splunk-screenconnect-slashandgrab',
  code: 'CVE-2024-1709',
  name: 'Splunk STRT & Huntress — ConnectWise ScreenConnect "SlashAndGrab" Auth Bypass & RMM RCE',
  shortSubtitle: 'Splunk STRT / Huntress · CVE-2024-1709 /SetupWizard.aspx/ Traversal, User.xml Overwrite & .ashx RCE',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Huntress Labs ("SlashAndGrab") and the Splunk Threat Research Team (STRT, February 2024), CVE-2024-1709 (CVSS 10.0) is a trivial path-confusion authentication bypass in ConnectWise ScreenConnect. By simply appending a trailing slash or path segment to the setup wizard URL (/SetupWizard.aspx/anything), an unauthenticated attacker accesses the initial setup wizard on an already-configured server, overwrites User.xml with a new administrator account, uploads a malicious .ashx extension to execute commands as SYSTEM, and pushes ransomware/Cobalt Strike to managed endpoints.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Splunk Threat Research Team (STRT) & Huntress Labs — CVE-2024-1709 SlashAndGrab Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (CVE-2024-1709 SetupWizard.aspx/) · T1505.003 (.ashx Webshell Extension) · T1219 (RMM Abuse)',
    },
    {
      term: 'OVERWRITTEN DB',
      value: 'C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml',
    },
    {
      term: 'RCE ARTIFACT',
      value: 'App_Extensions\\<GUID>\\*.ashx compiled by csc.exe under ScreenConnect.Service.exe',
    },
  ],
  nodes: [
    {
      id: 'slashandgrab_actor',
      label: 'Threat Actor (BlackBasta / LockBit)',
      sublabel: '198.51.100.129 (RMM Exploit Operator)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Ransomware Affiliate / Initial Access Broker',
        pidOrPort: 'HTTP/S :8040 / :443 -> ScreenConnect Server',
        privilege: 'Unauthenticated External',
        artifacts: [
          'GET /SetupWizard.aspx/ HTTP/1.1',
          'POST /Services/ExtensionService.ashx/InstallExtension',
        ],
        description:
          'Attacker sending a trailing-slash request to /SetupWizard.aspx/ to reset the ScreenConnect administrator database.',
      },
    },
    {
      id: 'screenconnect_srv',
      label: 'ConnectWise ScreenConnect Server',
      sublabel: '172.16.15.20 · RMM-SRV-01',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 · ScreenConnect RMM Host',
        pidOrPort: 'ScreenConnect.Service.exe (TCP 8040 / 8041)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml',
          'C:\\Program Files (x86)\\ScreenConnect\\App_Extensions\\',
        ],
        description:
          'On-premises ConnectWise ScreenConnect server managing hundreds of enterprise endpoints.',
      },
    },
    {
      id: 'ashx_extension_rce',
      label: 'Malicious .ashx Extension & csc.exe',
      sublabel: 'App_Extensions\\<GUID>\\payload.ashx',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'ASP.NET Dynamic Web Handler (.ashx) in ScreenConnect',
        pidOrPort: 'PID 5912 · ScreenConnect.Service.exe -> csc.exe -> cmd.exe',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'App_Extensions\\e3a1c8...\\handler.ashx',
          'Process.Start("cmd.exe", "/c powershell -enc ...")',
        ],
        description:
          'Malicious ScreenConnect extension ZIP uploaded by the attacker containing an ASP.NET .ashx webshell that executes as SYSTEM.',
      },
    },
    {
      id: 'managed_fleet_hosts',
      label: 'Managed Endpoint Fleet (Relay)',
      sublabel: '10.10.20.0/24 (TCP 8041 Agent Channel)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Enterprise Endpoints Running ScreenConnect Client',
        pidOrPort: 'C:\\Windows\\Temp\\ScreenConnect\\<Version>\\*.cmd',
        privilege: 'SYSTEM Across All Managed Hosts',
        artifacts: [
          'Mass Command Dispatch from Compromised RMM Server',
          'nltest /dclist: & Cobalt Strike Stager Deployment',
        ],
        description:
          'Downstream enterprise endpoints that automatically execute commands pushed over TCP 8041 from the compromised ScreenConnect server.',
      },
    },
    {
      id: 'splunk_huntress_siem',
      label: 'Splunk Enterprise Security (STRT)',
      sublabel: 'Sysmon EID 1, 11 & IIS/HTTP Logs',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Splunk SIEM running STRT ESCU Detections',
        pidOrPort: 'Sysmon EID 1, 11 (User.xml / .ashx)',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Splunk ESCU: ConnectWise ScreenConnect User.xml Modification',
          'Splunk ESCU: ScreenConnect.Service.exe Spawning Shell',
        ],
        description:
          'Detects modifications to App_Data\\User.xml, new .ashx files in App_Extensions\\, and ScreenConnect.Service.exe child processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 1890,
      ppid: 680,
      name: 'ScreenConnect.Service.exe',
      commandLine: '"C:\\Program Files (x86)\\ScreenConnect\\ScreenConnect.Service.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'WriteFile("C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml")',
        'CreateProcessW("csc.exe") [Compile .ashx Extension]',
      ],
    },
    {
      pid: 5912,
      ppid: 1890,
      name: 'cmd.exe',
      commandLine:
        'cmd.exe /c "whoami & nltest /dclist:corp.local & powershell -nop -w hidden -enc ..."',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['CreateProcessW("nltest.exe")', 'CreateProcessW("powershell.exe")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SETUPWIZARD.ASPX/ TRAVERSAL & USER.XML OVERWRITE (CVE-2024-1709)',
      subtitle: 'Accessing /SetupWizard.aspx/ to overwrite App_Data\\User.xml',
      description:
        'As detailed by Huntress and Splunk STRT, ScreenConnect checks whether /SetupWizard.aspx is requested directly, but fails when a trailing slash (/SetupWizard.aspx/) is appended (CVE-2024-1709). The attacker completes the setup wizard, overwriting C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml with a new SuperAdmin account.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['slashandgrab_actor', 'screenconnect_srv', 'splunk_huntress_siem'],
      compromisedNodeIds: ['screenconnect_srv'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-1709 (CVSS 10.0 Authentication Bypass)' },
        { term: 'BYPASS URI', value: 'GET /SetupWizard.aspx/ (or /SetupWizard.aspx/anything)' },
        { term: 'MODIFIED FILE', value: 'C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml' },
      ],
    },
    {
      index: 2,
      title: 'MALICIOUS .ASHX EXTENSION UPLOAD & SYSTEM RCE',
      subtitle: 'Installing rogue extension in App_Extensions\\ to spawn cmd.exe as SYSTEM',
      description:
        'Logged in as the newly created ScreenConnect administrator, the attacker uploads a malicious extension ZIP via /Services/ExtensionService.ashx. ScreenConnect extracts a .ashx web handler into App_Extensions\\<GUID>\\, compiles it with csc.exe, and spawns cmd.exe / powershell.exe under ScreenConnect.Service.exe as NT AUTHORITY\\SYSTEM.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell',
      activeNodeIds: ['screenconnect_srv', 'ashx_extension_rce', 'splunk_huntress_siem'],
      compromisedNodeIds: ['screenconnect_srv', 'ashx_extension_rce'],
      keySpecs: [
        { term: 'EXTENSION PATH', value: 'C:\\Program Files (x86)\\ScreenConnect\\App_Extensions\\<GUID>\\*.ashx' },
        { term: 'PARENT PROCESS', value: 'ScreenConnect.Service.exe (NT AUTHORITY\\SYSTEM)' },
        { term: 'COMPILER ARTIFACT', value: 'csc.exe compiling dynamic ASP.NET handler DLL' },
      ],
    },
    {
      index: 3,
      title: 'DOWNSTREAM FLEET COMMAND PUSH OVER TCP 8041',
      subtitle: 'Pushing .cmd scripts to managed endpoints via ScreenConnect ClientService',
      description:
        'Using the compromised ScreenConnect console, the attacker selects connected enterprise workstations and servers and dispatches batch commands over the TCP 8041 relay channel, executing payloads out of C:\\Windows\\Temp\\ScreenConnect\\<Version>\\*.cmd across the fleet.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1219',
      mitreTechniqueName: 'Remote Access Software',
      activeNodeIds: ['ashx_extension_rce', 'managed_fleet_hosts', 'splunk_huntress_siem'],
      compromisedNodeIds: ['screenconnect_srv', 'ashx_extension_rce', 'managed_fleet_hosts'],
      keySpecs: [
        { term: 'FLEET ARTIFACT', value: 'C:\\Windows\\Temp\\ScreenConnect\\<Version>\\*.cmd / *.ps1' },
        { term: 'CLIENT SERVICE', value: 'ScreenConnect.ClientService.exe spawning cmd.exe' },
        { term: 'SPLUNK ESCU', value: 'ConnectWise ScreenConnect Path Traversal CVE-2024-1709' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'spl-sc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '13:08:11.204',
      sourceNodeId: 'slashandgrab_actor',
      targetNodeId: 'screenconnect_srv',
      sourceLabel: '198.51.100.129',
      targetLabel: 'ScreenConnect User.xml',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11',
      shortAction: 'OVERWRITE USER.XML',
      info: 'Image=ScreenConnect.Service.exe TargetFilename=C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml',
      sizeOrCode: 'CVE-2024-1709',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Splunk STRT and Huntress note that exploiting /SetupWizard.aspx/ causes ScreenConnect.Service.exe to overwrite App_Data\\User.xml.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
    <Computer>RMM-SRV-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Program Files (x86)\\ScreenConnect\\ScreenConnect.Service.exe</Data>
    <Data Name="TargetFilename">C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Splunk STRT — ConnectWise ScreenConnect User.xml or .ashx Creation (CVE-2024-1709)',
        ruleCode: `title: ConnectWise ScreenConnect CVE-2024-1709 User.xml or Extension Creation
logsource:
  category: file_event
  product: windows
detection:
  selection:
    Image|endswith: '\\ScreenConnect.Service.exe'
    TargetFilename|contains:
      - '\\ScreenConnect\\App_Data\\User.xml'
      - '\\ScreenConnect\\App_Extensions\\'
  condition: selection
level: critical`,
        mitigation:
          'Upgrade ConnectWise ScreenConnect to version 23.9.8 or later immediately and audit App_Data\\User.xml and App_Extensions\\ for unauthorized modifications.',
      },
    },
    {
      id: 'spl-sc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '13:08:19.650',
      sourceNodeId: 'screenconnect_srv',
      targetNodeId: 'ashx_extension_rce',
      sourceLabel: 'ScreenConnect.Service.exe',
      targetLabel: 'cmd.exe (PID 5912)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'ASHX EXTENSION RCE',
      info: 'ParentImage=ScreenConnect.Service.exe Image=cmd.exe CommandLine="cmd.exe /c whoami & nltest /dclist:corp.local"',
      sizeOrCode: 'PID 5912',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'ScreenConnect.Service.exe (the server daemon, as opposed to the client agent) should never directly spawn cmd.exe or powershell.exe.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>RMM-SRV-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">5912</Data>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c "whoami &amp; nltest /dclist:corp.local &amp; powershell -nop -w hidden -enc ..."</Data>
    <Data Name="ParentProcessId">1890</Data>
    <Data Name="ParentImage">C:\\Program Files (x86)\\ScreenConnect\\ScreenConnect.Service.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ScreenConnect Server Service Spawning Command Shell (CVE-2024-1709 RCE)',
        ruleCode: `title: ConnectWise ScreenConnect Server Spawning Shell Process
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\ScreenConnect.Service.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\pwsh.exe'
  condition: selection
level: critical`,
        mitigation:
          'Isolate the ScreenConnect server if ScreenConnect.Service.exe spawns a command shell and inspect App_Extensions\\ for rogue .ashx files.',
      },
    },
    {
      id: 'spl-sc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '13:10:04.112',
      sourceNodeId: 'ashx_extension_rce',
      targetNodeId: 'managed_fleet_hosts',
      sourceLabel: 'ScreenConnect Relay :8041',
      targetLabel: 'Temp\\ScreenConnect\\*.cmd',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11 & 1',
      shortAction: 'FLEET MASS PUSH',
      info: 'ScreenConnect.ClientService.exe writes and executes C:\\Windows\\Temp\\ScreenConnect\\23.9.7\\8f2a1c.cmd across endpoints',
      sizeOrCode: 'Fleet Push',
      severity: 'CRITICAL',
      mitreId: 'T1219',
      explanation:
        'When commands are pushed from the ScreenConnect server to managed endpoints, ScreenConnect.ClientService.exe writes temporary .cmd/.ps1 scripts into C:\\Windows\\Temp\\ScreenConnect\\<version>\\.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
    <Computer>WKS-CORP-22.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Program Files (x86)\\ScreenConnect Client (3a9f)\\ScreenConnect.ClientService.exe</Data>
    <Data Name="TargetFilename">C:\\Windows\\Temp\\ScreenConnect\\23.9.7.8804\\8f2a1c90-b412.cmd</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ScreenConnect Client Executing Script from Windows Temp Directory',
        ruleCode: `title: ScreenConnect ClientService Script Execution in Temp
logsource:
  category: file_event
  product: windows
detection:
  selection:
    Image|endswith: '\\ScreenConnect.ClientService.exe'
    TargetFilename|contains: '\\Windows\\Temp\\ScreenConnect\\'
    TargetFilename|endswith:
      - '.cmd'
      - '.bat'
      - '.ps1'
  condition: selection
level: high`,
        mitigation:
          'Audit all .cmd and .ps1 scripts executed out of C:\\Windows\\Temp\\ScreenConnect\\ across managed endpoints.',
      },
    },
  ],
};

export const APT_KASPERSKY_MANDIANT_CISA_SCENARIOS: AttackScenario[] = [
  KASPERSKY_OPERATION_TRIANGULATION_SCENARIO,
  KASPERSKY_TODDYCAT_ESET_DLL_SCENARIO,
  KASPERSKY_LAZARUS_BYOVD_FUDMODULE_SCENARIO,
  MANDIANT_APT29_TEAMCITY_JETSTREAM_SCENARIO,
  SPLUNK_SCREENCONNECT_SLASHANDGRAB_SCENARIO,
];
