import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
