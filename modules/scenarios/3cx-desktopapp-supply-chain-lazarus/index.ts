import { THREECX_SUPPLY_CHAIN_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: '3cx-desktopapp-supply-chain-lazarus',
  code: 'CVE-2023-29059',
  name: 'CrowdStrike, Kaspersky & Mandiant — Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram',
  shortSubtitle: 'Supply Chain · Signed 3CX Build Tamper, 0xFEEDFACE RC4 & GitHub .ico Dead-Drop',
  category: 'SUPPLY_CHAIN_CICD',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'In Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram (CVE-2023-29059, MITRE ATT&CK T1195.002, T1574.002, T1102.001, and T1555.003), threat actors pivot from an earlier X_TRADER compromise into the 3CX Windows build pipeline to ship trojanized DLLs inside a validly signed VoIP installer. The attack unfolds in one continuous arc: inserting rigged ffmpeg.dll and oversized d3dcompiler_47.dll prior to 3CX Authenticode signing, then side-loading ffmpeg.dll to RC4-decrypt shellcode past marker 0xFEEDFACE into unbacked RWX RAM, then fetching innocent GitHub IconStorages .ico files carrying hidden Base64 C2 trailers, then stealing browser credentials via ICONICSTEALER and selectively deploying Gopuram to high-value finance targets. Steps #1-#4 trace the full supply chain; Memory Forensics compares clean vs. trojanized d3dcompiler_47.dll and live RWX RAM. Primary detection: Sysmon Event ID 7/22, YARA 0xFEEDFACE memory rules, and behavioral EDR alerts on VoIP apps reading Chrome Login Data.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1195.002 (Supply Chain) · T1574.002 (Side-Load) · T1102.001 (.ico C2) · T1555.003' },
    { term: 'ROOT CAUSE', value: 'Cascading Compromise (X_TRADER -> 3CX CI/CD Build Server · CVE-2023-29059)' },
    { term: 'PAYLOAD CHAIN', value: '3CXDesktopApp.exe (Signed) -> ffmpeg.dll -> d3dcompiler_47.dll (0xFEEDFACE RC4)' },
    { term: 'DEAD-DROP C2', value: 'raw.githubusercontent.com/IconStorages/images/main/icon12.ico (EOF Base64)' },
    { term: 'STAGE-2 IMPLANTS', value: 'ICONICSTEALER (Browser Vaults) -> Selective Gopuram Backdoor (Crypto/Finance)' },
    { term: 'DETECTION SOURCES', value: 'Sysmon EID 7/11/22/3 · YARA 0xFEEDFACE · EDR VoIP-to-Browser Behavioral Alert' },
  ],
  nodes: [
    {
      id: 'build_pipeline',
      label: '3CX Build Pipeline',
      sublabel: 'X_TRADER -> Signed v18.12.407',
      role: 'attacker',
      x: 16,
      y: 36,
      details: {
        osOrType: 'Compromised Vendor CI/CD & Signing Server',
        pidOrPort: 'Valid 3CX Ltd. Authenticode EV Certificate',
        privilege: 'Upstream Supply-Chain Access (UNC4736)',
        artifacts: ['Trojanized ffmpeg.dll', 'Oversized d3dcompiler_47.dll (0xFEEDFACE)', 'Validly Signed MSI/EXE'],
        description:
          '3CX Windows build server breached via an upstream X_TRADER compromise, signing trojanized DLLs with 3CX official EV code-signing keys.',
      },
    },
    {
      id: 'trading_workstation',
      label: 'WKS-TRD-14',
      sublabel: '10.10.8.41 (Trading Desk)',
      role: 'victim_host',
      x: 36,
      y: 64,
      details: {
        osOrType: 'Windows 11 Enterprise Trading Workstation',
        pidOrPort: 'CORP\\d.chen · Chrome/Edge Credential Store',
        privilege: 'Medium Integrity · High-Value Target',
        artifacts: ['3CXDesktopApp.exe v18.12.407', 'Chrome User Data\\Default\\Login Data'],
        description:
          'Enterprise trading workstation installing the officially signed 3CXDesktopApp update and qualifying for selective Stage-2 Gopuram deployment.',
      },
    },
    {
      id: 'threecx_process',
      label: '3CXDesktopApp.exe',
      sublabel: 'PID 7120 (ffmpeg.dll Side-Load)',
      role: 'process',
      x: 56,
      y: 44,
      details: {
        osOrType: 'Signed Electron VoIP Client (3CX Ltd.)',
        pidOrPort: 'PID 7120 · Loads ffmpeg.dll & d3dcompiler_47.dll',
        privilege: 'Valid Authenticode · Unbacked RWX Shellcode',
        artifacts: [
          'av_buffer_create export hijack in ffmpeg.dll',
          'RC4 key "3jB(2bsG#@c7" over 0xFEEDFACE trailer',
          'ICONICSTEALER + Selective Gopuram',
        ],
        description:
          'Legitimately signed 3CX desktop telephone application side-loading trojanized ffmpeg.dll to decrypt in-memory SmoothOperator shellcode.',
      },
    },
    {
      id: 'memory_payload',
      label: '0xFEEDFACE & RWX RAM',
      sublabel: '0x000001C948200000 (Decrypted)',
      role: 'memory',
      x: 74,
      y: 68,
      details: {
        osOrType: 'd3dcompiler_47.dll Overlay -> Unbacked RWX RAM',
        pidOrPort: '0x7FF8A1000000 -> 0x000001C948200000',
        privilege: 'MEM_PRIVATE PAGE_EXECUTE_READWRITE',
        artifacts: [
          'FE ED FA CE magic marker in d3dcompiler_47.dll',
          '312 KB RC4-decrypted shellcode loader in RAM',
          'Stage-2 ICONICSTEALER / Gopuram @ 0x000001C948280000',
        ],
        description:
          'Memory chain spanning the oversized d3dcompiler_47.dll overlay and the unbacked MEM_PRIVATE RWX allocations holding SmoothOperator and Gopuram.',
      },
    },
    {
      id: 'github_deaddrop',
      label: 'GitHub IconStorages & C2',
      sublabel: 'icon12.ico -> Gopuram C2',
      role: 'server',
      x: 52,
      y: 16,
      details: {
        osOrType: 'Dead-Drop .ico Repo & Selective C2 Server',
        pidOrPort: 'HTTPS :443 (raw.githubusercontent.com)',
        privilege: 'External Lazarus Infrastructure',
        artifacts: [
          'IconStorages/images/main/icon12.ico (EOF Base64)',
          'akamaitechcloudservices[.]com (Stage-2 C2)',
        ],
        description:
          'Public GitHub repository hosting valid Windows .ico icon files with hidden Base64 C2 URLs appended past image EOF, pointing victims to Stage-2 infrastructure.',
      },
    },
    {
      id: 'edr_watcher',
      label: 'CrowdStrike / EDR Watch',
      sublabel: 'VoIP -> Chrome Vault Alert',
      role: 'firewall_siem',
      x: 84,
      y: 24,
      details: {
        osOrType: 'Behavioral EDR & Network Telemetry',
        pidOrPort: '10.10.99.10 (SOC Hunting Console)',
        privilege: 'Kernel Behavioral Sensor',
        artifacts: [
          'Sysmon EID 7 (unsigned ffmpeg.dll in signed 3CX)',
          'Sysmon EID 22 (3CX querying raw.githubusercontent.com)',
          'Behavioral alert: VoIP app reading Chrome Login Data',
        ],
        description:
          'Behavioral detection layer catching the intrusion despite valid 3CX signatures by correlating unsigned DLL side-loads, GitHub icon fetches, and browser vault access.',
      },
    },
  ],
  processTree: [
    {
      pid: 1480,
      ppid: 944,
      name: 'userinit.exe',
      commandLine: 'C:\\Windows\\System32\\userinit.exe',
      user: 'CORP\\d.chen',
      integrity: 'Medium',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['CreateProcessW(C:\\Windows\\Explorer.EXE)'],
    },
    {
      pid: 2410,
      ppid: 1480,
      name: 'explorer.exe',
      commandLine: 'C:\\Windows\\Explorer.EXE',
      user: 'CORP\\d.chen',
      integrity: 'Medium',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['ShellExecuteExW(3CXDesktopApp.exe)'],
    },
    {
      pid: 7120,
      ppid: 2410,
      name: '3CXDesktopApp.exe',
      commandLine: '"C:\\Users\\d.chen\\AppData\\Local\\Programs\\3CXDesktopApp\\app-18.12.407\\3CXDesktopApp.exe"',
      user: 'CORP\\d.chen',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryW("ffmpeg.dll")',
        'CreateFileW("d3dcompiler_47.dll")',
        'VirtualAlloc(0x000001C948200000, 319488, PAGE_EXECUTE_READWRITE)',
        'RC4_Decrypt(0xFEEDFACE, key="3jB(2bsG#@c7")',
        'WinHttpOpenRequest("raw.githubusercontent.com/IconStorages/images/main/icon12.ico")',
        'CreateFileW("Chrome\\User Data\\Default\\Login Data")',
      ],
      memoryBlocks: [
        {
          address: '0x7FF8A1000000',
          section: 'd3dcompiler_47.dll (0xFEEDFACE Trailer)',
          permissions: 'R-X',
          size: '4.4 MB',
          status: 'patched',
          description:
            'Trojanized graphics compiler library shipped inside the validly signed 3CX installer. Clean Microsoft Direct3D sections sit intact at the front while an appended 312 KB RC4-encrypted SmoothOperator payload hides directly after the 4-byte magic marker FE ED FA CE (0xFEEDFACE).',
          hexPreview: 'FE ED FA CE 91 4A C7 2B 8E 03 D4 5F 19 A0 6C E2  .....J.+..._..l.',
        },
        {
          address: '0x000001C948200000',
          section: 'SmoothOperator RC4 Shellcode (Unbacked)',
          permissions: 'RWX',
          size: '312 KB',
          status: 'shellcode',
          description:
            'Unbacked MEM_PRIVATE PAGE_EXECUTE_READWRITE memory region allocated via VirtualAlloc by side-loaded ffmpeg.dll. Holds the freshly RC4-decrypted shellcode loader that waits through its delay window, downloads GitHub IconStorages .ico files, and slices the hidden Base64 C2 trailer past image EOF.',
          hexPreview: '48 83 EC 28 48 8D 0D 4C 02 00 00 E8 14 01 00 00  H..(H..L........',
        },
        {
          address: '0x000001C948280000',
          section: 'ICONICSTEALER & Selective Gopuram',
          permissions: 'RWX',
          size: '228 KB',
          status: 'injected',
          description:
            'Stage-2 in-memory payload fetched after resolving akamaitechcloudservices[.]com from icon12.ico. ICONICSTEALER harvests Chrome and Edge credential stores while high-value finance and crypto victims selectively receive the modular Gopuram espionage backdoor inside PID 7120.',
          hexPreview: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00  MZ..............',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Cascading Build Compromise & Signed Trojanized Installer (X_TRADER -> 3CX)',
      subtitle: 'Trojanized ffmpeg.dll & d3dcompiler_47.dll Sealed Under Valid 3CX Authenticode',
      description:
        'Pivoting from an earlier X_TRADER supply-chain breach, Lazarus inserts trojanized ffmpeg.dll and oversized d3dcompiler_47.dll into the 3CX Windows build server before the genuine 3CX EV certificate signs v18.12.407.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1195.002',
      mitreTechniqueName: 'Supply Chain Compromise: Software Supply Chain',
      activeNodeIds: ['build_pipeline', 'trading_workstation', 'edr_watcher'],
      compromisedNodeIds: ['build_pipeline', 'trading_workstation'],
      keySpecs: [
        { term: 'UPSTREAM BREACH', value: 'Cascading X_TRADER -> 3CX Windows CI/CD Server' },
        { term: 'CODE SIGNATURE', value: '100% Valid 3CX Ltd. Authenticode EV Seal' },
        { term: 'DROPPED PAIR', value: 'Unsigned ffmpeg.dll + Oversized d3dcompiler_47.dll' },
      ],
    },
    {
      index: 2,
      title: 'DLL Side-Loading (ffmpeg.dll) & 0xFEEDFACE RC4 Shellcode Decryption',
      subtitle: 'VirtualAlloc RWX Decryption Inside Legitimately Signed 3CXDesktopApp.exe',
      description:
        'When 3CXDesktopApp.exe (PID 7120) starts, side-loaded ffmpeg.dll locates magic marker 0xFEEDFACE inside d3dcompiler_47.dll and RC4-decrypts 312 KB of SmoothOperator shellcode into unbacked RWX RAM at 0x000001C948200000.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1574.002',
      mitreTechniqueName: 'Hijack Execution Flow: DLL Side-Loading',
      activeNodeIds: ['threecx_process', 'memory_payload', 'edr_watcher'],
      compromisedNodeIds: ['build_pipeline', 'trading_workstation', 'threecx_process', 'memory_payload'],
      keySpecs: [
        { term: 'SIDE-LOAD TRIGGER', value: 'ffmpeg.dll Hijacked Export Inside Signed PID 7120' },
        { term: 'CIPHER MARKER', value: '0xFEEDFACE (FE ED FA CE) + RC4 Key 3jB(2bsG#@c7' },
        { term: 'RAM TARGET', value: '0x000001C948200000 (Unbacked MEM_PRIVATE RWX)' },
      ],
    },
    {
      index: 3,
      title: 'GitHub IconStorages .ico Dead-Drop Resolver & C2 Resolution',
      subtitle: 'Appended Base64 C2 String Hidden Past Valid .ico Image EOF',
      description:
        'Decrypted shellcode downloads innocent icon12.ico from raw.githubusercontent.com/IconStorages/images/main/, parses the hidden Base64 trailer appended past the valid image EOF, and resolves live C2 akamaitechcloudservices[.]com.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1102.001',
      mitreTechniqueName: 'Web Service: Dead Drop Resolver',
      activeNodeIds: ['threecx_process', 'github_deaddrop', 'edr_watcher'],
      compromisedNodeIds: ['build_pipeline', 'trading_workstation', 'threecx_process', 'memory_payload', 'github_deaddrop'],
      keySpecs: [
        { term: 'DEAD-DROP HOST', value: 'raw.githubusercontent.com/IconStorages/images/main/icon12.ico' },
        { term: 'STEGANOGRAPHY', value: 'Valid Windows .ico + Trailing Base64 Past Image EOF' },
        { term: 'TELEMETRY', value: 'Sysmon EID 22 (DNS) + EID 3 (TLS 443 From VoIP App)' },
      ],
    },
    {
      index: 4,
      title: 'ICONICSTEALER Browser Vault Theft & Selective Gopuram Backdoor',
      subtitle: 'VoIP App Reading Chrome Login Data & Targeted Finance Espionage',
      description:
        'ICONICSTEALER harvests Chrome/Edge Login Data inside PID 7120 while profiling the enterprise; high-value crypto and trading targets selectively receive the Gopuram backdoor, triggering CrowdStrike behavioral alerts.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1555.003',
      mitreTechniqueName: 'Credentials from Password Stores: Credentials from Web Browsers',
      activeNodeIds: ['threecx_process', 'trading_workstation', 'github_deaddrop', 'edr_watcher'],
      compromisedNodeIds: ['build_pipeline', 'trading_workstation', 'threecx_process', 'memory_payload', 'github_deaddrop'],
      keySpecs: [
        { term: 'CREDENTIAL THEFT', value: 'ICONICSTEALER -> Chrome & Edge Login Data Vaults' },
        { term: 'VIP TARGETING', value: 'Selective Stage-2 Gopuram Backdoor (Crypto/Finance)' },
        { term: 'EDR CATCH', value: 'Behavioral Alert: Signed VoIP App Touching Browser Vault' },
      ],
    },
  ],
  telemetry: THREECX_SUPPLY_CHAIN_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: '3cx-desktopapp-supply-chain-lazarus',
  briefing: {
    headline:
      'Scenario Briefing: Lazarus (SmoothOperator) — 3CXDesktopApp Supply Chain & Gopuram (CVE-2023-29059)',
    storyAnalogy:
      'Picture a gleaming white telecommunications assembly cleanroom where sleek business desk phones glide down an aluminum conveyor toward a heavy brass authenticity press. Just before an open phone reaches the press, a dark covert robotic arm drops from an upstream supplier vent and swaps in two rigged interior pieces: a crimson-toothed brass audio gear and a frosted glass prism hiding a glowing amber wax-sealed core inside its base. Moments later, the lid snaps shut and the official factory press stamps a completely genuine gold-and-emerald hologram right onto the phone top, so the quality inspector scans the authentic seal and waves it straight onto a trader office desk. Once plugged in at the desk, the phone shell splits open in cutaway: the rigged brass gear spins first, cracks open the amber core inside the frosted prism, and unwinds a glowing ribbon into a hidden micro-radio. That radio scans an innocent framed portrait tile hanging on a public art-gallery wall, peels a secret crimson address strip off the bottom border of the frame, siphons keycards right out of the trader desk folder, and opens a private beam to an elevated high-value vault while a violet behavioral watch monitor catches a desk telephone reaching into a credential drawer.',
    plainSummary:
      'In this scenario (CVE-2023-29059, MITRE ATT&CK T1195.002, T1574.002, T1102.001, and T1555.003) documented jointly by CrowdStrike, Mandiant, and Kaspersky, Lazarus Group compromises the 3CX Windows build server via an upstream X_TRADER breach and ships a validly signed trojanized VoIP installer to WKS-TRD-14. The attack unfolds in one continuous arc: pre-signing tampering of ffmpeg.dll and d3dcompiler_47.dll, then DLL side-loading and 0xFEEDFACE RC4 decryption into unbacked RWX RAM, then GitHub IconStorages .ico steganographic C2 resolution, then ICONICSTEALER credential theft paired with selective Stage-2 Gopuram backdoor deployment. Steps #1-#4 trace the full kill chain, while Memory Forensics compares clean vs. trojanized d3dcompiler_47.dll alongside unbacked RWX implant regions.',
    diagramTopologySummary:
      'On the diagram: Follow Step #1 from Node ① (3CX Build Pipeline) shipping the signed trojanized installer to Node ② (WKS-TRD-14), watch Step #2 execute inside Node ③ (3CXDesktopApp.exe PID 7120) decrypting Node ④ (0xFEEDFACE & RWX RAM), trace Step #3 fetching Node ⑤ (GitHub IconStorages .ico Dead-Drop), and see Step #4 trigger Node ⑥ (CrowdStrike / EDR Watch) as the VoIP app reads browser vaults.',
    documentedAdvisory:
      'CrowdStrike SmoothOperator (2023) · Mandiant UNC4736 Cascading Supply Chain · Kaspersky GReAT Gopuram Backdoor · CVE-2023-29059',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1195.002',
      plainTitle: 'Pre-Signing Cleanroom Tamper & Genuine Authenticode Seal Delivery',
      storyAnalogy:
        'Inside the sterile telecommunications assembly cleanroom, an open matte-white business phone glides down the belt. Seconds before it enters the official sealing station, a dark robotic arm drops from an upstream supplier vent, places a crimson-toothed brass audio gear and a frosted prism housing a hidden amber core inside the chassis, and retracts—allowing the official gold press to emboss a 100% genuine emerald-gold authenticity hologram onto the closed lid so the warehouse inspector waves it straight to the customer desk.',
      simpleExplanation:
        'Mandiant UNC4736 investigation uncovered that the 3CX breach was a historic cascading supply-chain attack: Lazarus Group first compromised an older financial trading application called X_TRADER, used that foothold to infect a 3CX engineer workstation, and pivoted directly into the 3CX Windows build server. Inside that CI/CD build environment, the attackers replaced two bundled Electron dependencies—ffmpeg.dll (the audio/video helper library) and d3dcompiler_47.dll (a Direct3D shader compiler library padded with an encrypted payload)—BEFORE the automated signing pipeline applied the genuine 3CX Ltd. Extended Validation Authenticode certificate. When trading workstation WKS-TRD-14 (10.10.8.41) installs 3CXDesktopApp v18.12.407, Windows signature validation passes 100% green because the outer MSI and 3CXDesktopApp.exe binary truly were signed by 3CX.',
      howItWorksInPractice:
        'Code signing proves publisher integrity only from the moment the signing step runs onward (never guaranteeing the cleanliness of upstream build inputs). Because Lazarus altered ffmpeg.dll and d3dcompiler_47.dll inside the build workspace prior to packaging (leaving ffmpeg.dll unsigned and inflating d3dcompiler_47.dll to 4.4 MB with a high-entropy trailing overlay), Sysmon Event ID 11 (FileCreate capturing installation under AppData\\Local\\Programs\\3CXDesktopApp\\app-18.12.407\\) and Sysmon Event ID 7 (ImageLoaded flagging Signed = false on ffmpeg.dll loaded by a validly signed parent executable) expose the discrepancy between the trusted outer signature and its tampered companion DLLs.',
      diagramAlignment:
        'On the diagram, Step #1 ships from Node ① (3CX Build Pipeline) to Node ② (WKS-TRD-14 10.10.8.41), installing Node ③ (3CXDesktopApp.exe PID 7120) while Node ⑥ (CrowdStrike / EDR Watch) logs the unsigned ffmpeg.dll image load.',
      detectionAndEvidence:
        'Documented in Sysmon Event ID 7 (validly signed 3CXDesktopApp.exe loading unsigned trojanized ffmpeg.dll and oversized d3dcompiler_47.dll) correlated with Software Bill of Materials (SBOM) hash verification against clean Microsoft d3dcompiler_47.dll.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1574.002',
      plainTitle: 'Side-Loading ffmpeg.dll & RC4-Decrypting the 0xFEEDFACE Payload Into RWX RAM',
      storyAnalogy:
        'Plugged in on the trader office desk, the sealed business phone powers up and splits open cleanly in cutaway. The rigged crimson-toothed brass audio gear spins first, extends an extractor fork to crack the bottom seam of the frosted glass prism, pulls out the glowing amber wax-sealed core, and unwinds its spinning golden cipher ribbon into a hovering holographic micro-radio right inside the phone cavity.',
      simpleExplanation:
        'The instant user CORP\\d.chen launches 3CXDesktopApp.exe (PID 7120), Windows DLL search order loads the co-located trojanized ffmpeg.dll (situated in the exact same application folder as the executable). Inside its hijacked export routine (such as av_buffer_create), ffmpeg.dll opens its neighbor file d3dcompiler_47.dll, scans forward until it spots the exact 4-byte magic marker 0xFEEDFACE (FE ED FA CE, acting as a bookmark separating clean Direct3D code from the hidden payload), reads the trailing 312 KB encrypted blob, calls VirtualAlloc to reserve an unbacked MEM_PRIVATE PAGE_EXECUTE_READWRITE region at 0x000001C948200000 (anonymous RAM not tied to any signed file on disk with simultaneous read, write, and execute permissions so decrypted shellcode can run immediately), and decrypts the SmoothOperator shellcode in memory using the RC4 stream cipher with key "3jB(2bsG#@c7".',
      howItWorksInPractice:
        'Splitting the loader across two companion DLLs (tiny trigger logic inside ffmpeg.dll plus an encrypted blob appended past the clean PE sections of Microsoft d3dcompiler_47.dll after 0xFEEDFACE) ensures static antivirus scanners inspecting either file alone see mostly legitimate open-source FFmpeg or Direct3D code. At runtime, however, executing decrypted instructions inside an unbacked MEM_PRIVATE RWX allocation (0x000001C948200000) inside an Electron VoIP phone triggers high-confidence EDR memory scans and YARA rules matching FE ED FA CE combined with the RC4 key string.',
      diagramAlignment:
        'On the diagram, Step #2 executes inside Node ③ (3CXDesktopApp.exe PID 7120), carving Node ④ (0xFEEDFACE & RWX RAM at 0x000001C948200000) while Node ⑥ (CrowdStrike / EDR Watch) raises a memory-integrity YARA match.',
      detectionAndEvidence:
        'Documented in EDR Memory / YARA Scans (FE ED FA CE overlay marker inside d3dcompiler_47.dll and RC4 key 3jB(2bsG#@c7) paired with unbacked MEM_PRIVATE RWX allocations at 0x000001C948200000 inside signed 3CXDesktopApp.exe.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1102.001',
      plainTitle: 'Peeling Hidden C2 Addresses Off Innocent GitHub IconStorages .ico Tiles',
      storyAnalogy:
        'Now humming inside the desk phone, the hidden holographic radio casts a thin cyan scan beam across a public art-gallery wall lined with six innocent framed portrait tiles. As the beam lands on tile number four, a concealed crimson paper ribbon peels cleanly off the bottom frame border—revealing secret coordinates tucked behind an ordinary public picture while ordinary observers see only a normal gallery wall.',
      simpleExplanation:
        'To prevent network defenders from immediately blocking a hardcoded malicious IP address—and to outwait automated sandboxes—the SmoothOperator shellcode sleeps for several days before fetching its live Command-and-Control address from a public GitHub dead-drop repository (raw.githubusercontent.com/IconStorages/images/main/icon1.ico through icon16.ico). Each downloaded .ico file renders as a completely normal Windows icon image if opened, but Lazarus appended an encrypted Base64 string strictly past the image End-of-File marker. The in-memory loader slices off that trailing Base64 strip, decrypts it to obtain the live lookalike domain (akamaitechcloudservices[.]com), and initiates HTTPS staging.',
      howItWorksInPractice:
        'Abusing raw.githubusercontent.com as a Dead-Drop Resolver (MITRE T1102.001) lets the attacker blend C2 discovery into encrypted TLS 1.3 traffic destined for a universally trusted developer CDN while allowing instant C2 rotation simply by uploading updated .ico tiles. Even so, correlating Sysmon Event ID 22 (DNSQuery) and Sysmon Event ID 3 (NetworkConnect) immediately reveals a glaring process-to-network anomaly: a corporate desk VoIP phone (3CXDesktopApp.exe) has zero legitimate operational reason to download .ico files from a random GitHub repository and pivot to newly registered lookalike domains.',
      diagramAlignment:
        'On the diagram, Step #3 shoots from Node ③ (3CXDesktopApp.exe PID 7120) to Node ⑤ (GitHub IconStorages & C2 via icon12.ico) while Node ⑥ (CrowdStrike / EDR Watch) logs Sysmon Event ID 22 and Event ID 3.',
      detectionAndEvidence:
        'Documented in Sysmon Event ID 22 & Event ID 3 (3CXDesktopApp.exe resolving raw.githubusercontent.com/IconStorages/images/main/icon12.ico and pivoting to akamaitechcloudservices[.]com) and Suricata TLS/SNI dead-drop alerts.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1555.003',
      plainTitle: 'ICONICSTEALER Browser Vault Theft & Selective Stage-2 Gopuram Backdoor',
      storyAnalogy:
        'Guided by the peeled gallery address strip, the desk phone opens a quiet siphon straight into the trader desktop browser folder, lifting glowing blue keycards out of the vault while an elevated crimson private vault locks onto this high-value trading desk—at the exact instant the violet behavioral watch monitor flashes an unmistakable alarm because a desk telephone has no business reaching into a password drawer.',
      simpleExplanation:
        'After connecting to akamaitechcloudservices[.]com, 3CXDesktopApp.exe loads the Stage-2 ICONICSTEALER module in RAM (0x000001C948280000) to collect system identity, domain membership, and saved browser credential databases from Google Chrome, Microsoft Edge, Brave, and Firefox (specifically targeting User Data\\Default\\Login Data and Local State). Kaspersky GReAT discovered that Lazarus operated with surgical selectivity: for thousands of ordinary 3CX victims, the intrusion paused at reconnaissance, whereas select high-value cryptocurrency exchanges and financial institutions like WKS-TRD-14 received the sophisticated second-stage Gopuram modular backdoor for long-term espionage.',
      howItWorksInPractice:
        'This final stage illustrates why CrowdStrike Falcon OverWatch caught the global campaign before anyone knew the 3CX installer itself was compromised: even though 3CXDesktopApp.exe carried a 100% valid Authenticode signature, behavioral EDR telemetry flagged a desktop telephone executable opening Chrome and Edge Login Data files and establishing anomalous TLS C2 sessions (loading Gopuram at 0x000001C948280000). Enforcing behavioral process-boundary rules on browser credential stores stops signed supply-chain implants on Day Zero.',
      diagramAlignment:
        'On the diagram, Step #4 pulls browser credentials from Node ② (WKS-TRD-14) through Node ③ (3CXDesktopApp.exe) toward Node ⑤ (Gopuram C2) while Node ⑥ (CrowdStrike / EDR Watch) fires the definitive behavioral alert.',
      detectionAndEvidence:
        'Documented in CrowdStrike / Kaspersky Behavioral EDR Alerts (signed 3CXDesktopApp.exe reading Chrome/Edge Login Data via ICONICSTEALER) correlated with selective Stage-2 Gopuram TLS C2 traffic.',
    },
  ],
};

export * from './choreography';
export * from './telemetry';
