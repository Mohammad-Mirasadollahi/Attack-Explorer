import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'elastic-grimresource-msc',
  code: 'T1218.014',
  name: 'Elastic Security Labs — GrimResource: MMC & apds.dll XSS-to-RCE Execution',
  shortSubtitle: 'Elastic Security Labs · Crafted .MSC Console File, apds.dll Redirect & DotNetToJScript',
  category: 'MALWARE',
  severity: 'HIGH',
  primaryMitrePhase: 4,
  overview:
    'Discovered by Elastic Security Labs (June 2024), GrimResource is a defense-evasion and execution technique that abuses a DOM Cross-Site Scripting (XSS) flaw inside the legacy Windows library C:\\Windows\\System32\\apds.dll. When a user opens a crafted Microsoft Management Console (.msc) file, mmc.exe loads apds.dll/redirect.html via the res:// protocol, triggering arbitrary JScript/VBScript execution (DotNetToJScript) and stealthily injecting a C2 payload into dllhost.exe.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Elastic Security Labs — GrimResource (Joe Desimone & Samir Bousseaden)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1218.014 (MMC) · T1059.005 (VBScript) · T1055.002 (PE Injection)',
    },
    {
      term: 'VULNERABLE MODULE',
      value: 'res://apds.dll/redirect.html?target=javascript:eval(...)',
    },
    {
      term: 'SACRIFICIAL TARGET',
      value: 'C:\\Windows\\System32\\dllhost.exe (Spawned by mmc.exe)',
    },
  ],
  nodes: [
    {
      id: 'grim_lure_delivery',
      label: 'Malicious .MSC Delivery',
      sublabel: 'sccm-Updater.msc (XML Console File)',
      role: 'attacker',
      x: 15,
      y: 42,
      details: {
        osOrType: 'Crafted XML Microsoft Saved Console (.msc)',
        pidOrPort: 'SHA256: 142b7c3... (GrimResource Sample)',
        privilege: 'User Phishing Lure',
        artifacts: [
          'sccm-Updater.msc',
          'StringTable: res://apds.dll/redirect.html?target=javascript:...',
        ],
        description:
          'Specially crafted XML .msc file containing an embedded APDS redirect URI and obfuscated VBScript/DotNetToJScript loader in its StringTable.',
      },
    },
    {
      id: 'wks_mmc_host',
      label: 'mmc.exe (Management Console)',
      sublabel: 'PID 5412 · WKS-FIN-08 (10.10.4.28)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows 11 Enterprise · Signed Microsoft Binary',
        pidOrPort: 'PID 5412 · C:\\Windows\\System32\\mmc.exe',
        privilege: 'Medium / High Integrity',
        artifacts: [
          'Loaded Module: C:\\Windows\\System32\\apds.dll',
          'Loaded Module: C:\\Windows\\System32\\vbscript.dll / jscript.dll',
        ],
        description:
          'Trusted Windows Microsoft Management Console process that parses sccm-Updater.msc and evaluates the res://apds.dll/redirect.html DOM XSS payload.',
      },
    },
    {
      id: 'dotnet_to_jscript_mem',
      label: 'apds.dll & DotNetToJScript',
      sublabel: 'In-Memory CLR v4.0.30319 Deserialization',
      role: 'memory',
      x: 52,
      y: 72,
      details: {
        osOrType: 'In-Memory ActiveX & .NET BinaryFormatter',
        pidOrPort: 'clr.dll + mscoree.dll inside mmc.exe',
        privilege: 'User-Mode RWX Heap',
        artifacts: [
          'ActCtx: TransformNode / msxml3.dll',
          'System.Reflection.Assembly.Load(byte[])',
        ],
        description:
          'Uses transformNode XSLT inside the apds.dll HTML context to invoke DotNetToJScript, deserializing a C# Cobalt Strike loader in memory.',
      },
    },
    {
      id: 'dllhost_sacrificial',
      label: 'Injected dllhost.exe',
      sublabel: 'PID 6088 (COM Surrogate Target)',
      role: 'process',
      x: 78,
      y: 34,
      details: {
        osOrType: 'Sacrificial Windows COM Surrogate',
        pidOrPort: 'PID 6088 · PPID 5412 (mmc.exe)',
        privilege: 'Medium Integrity',
        artifacts: [
          'DirtyCLR / Indirect Syscalls (NtAllocateVirtualMemory)',
          'Sysmon Event ID 8 / 10',
        ],
        description:
          'Child dllhost.exe spawned by the .NET loader inside mmc.exe and injected with shellcode via indirect syscalls.',
      },
    },
    {
      id: 'elastic_defend_siem',
      label: 'Elastic Defend & SIEM',
      sublabel: 'EQL Correlation & Sysmon EID 1 / 7',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Elastic Security EDR & SIEM',
        pidOrPort: 'Sysmon EID 1, 7 (ImageLoad), 10',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Rule: GrimResource MMC Loading apds.dll & Script Engines',
          'YARA: Windows_Trojan_GrimResource',
        ],
        description:
          'Detects mmc.exe loading apds.dll alongside vbscript.dll/clr.dll and spawning suspicious child processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 5412,
      ppid: 3200,
      name: 'mmc.exe',
      commandLine: '"C:\\Windows\\System32\\mmc.exe" "C:\\Users\\j.doe\\Downloads\\sccm-Updater.msc"',
      user: 'CORP\\j.doe',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryW("apds.dll")',
        'LoadLibraryW("vbscript.dll")',
        'CLRCreateInstance',
      ],
      memoryBlocks: [
        {
          address: '0x000001F4A2000000',
          section: 'CLR Heap (DotNetToJScript Loader)',
          permissions: 'RWX',
          size: '256 KB',
          status: 'injected',
          description:
            'Deserialized .NET assembly loaded inside mmc.exe via apds.dll DOM XSS and XSLT transformNode.',
          hexPreview: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00',
        },
      ],
    },
    {
      pid: 6088,
      ppid: 5412,
      name: 'dllhost.exe',
      commandLine: 'C:\\Windows\\System32\\dllhost.exe',
      user: 'CORP\\j.doe',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: [
        'NtAllocateVirtualMemory',
        'NtWriteVirtualMemory',
        'NtProtectVirtualMemory(PAGE_EXECUTE_READ)',
        'NtCreateThreadEx',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'MMC PARSES CRAFTED .MSC & LOADS APDS.DLL',
      subtitle: 'res://apds.dll/redirect.html DOM XSS triggered inside mmc.exe',
      description:
        'As uncovered by Elastic Security Labs, the victim opens sccm-Updater.msc, which launches the trusted Windows binary mmc.exe. Inside the .msc XML StringTable, an entry references res://apds.dll/redirect.html?target=javascript:eval(...). Because redirect.html in apds.dll passes the target parameter directly to window.location.replace without validation, arbitrary JavaScript executes inside the MMC ActiveX View context.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1218.014',
      mitreTechniqueName: 'System Binary Proxy Execution: MMC',
      activeNodeIds: ['grim_lure_delivery', 'wks_mmc_host', 'elastic_defend_siem'],
      compromisedNodeIds: ['wks_mmc_host'],
      keySpecs: [
        { term: 'PROXY BINARY', value: 'C:\\Windows\\System32\\mmc.exe (T1218.014)' },
        { term: 'XSS GADGET', value: 'res://apds.dll/redirect.html?target=javascript:...' },
        { term: 'IMAGE LOADS', value: 'Sysmon EID 7: apds.dll + jscript.dll + vbscript.dll' },
      ],
    },
    {
      index: 2,
      title: 'XSLT TRANSFORMNODE & DOTNETTOJSCRIPT CLR LOAD',
      subtitle: 'Obfuscated VBScript deserializes C# loader into mmc.exe memory',
      description:
        'To bypass modern Windows Script Host mitigations, the injected JavaScript creates an MSXML ActiveX object and invokes transformNode with an embedded XSLT stylesheet containing VBScript. The VBScript executes a DotNetToJScript payload, loading the .NET Common Language Runtime (clr.dll) directly inside mmc.exe and deserializing an in-memory C# loader.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.005',
      mitreTechniqueName: 'Command and Scripting Interpreter: Visual Basic',
      activeNodeIds: ['wks_mmc_host', 'dotnet_to_jscript_mem', 'elastic_defend_siem'],
      compromisedNodeIds: ['wks_mmc_host', 'dotnet_to_jscript_mem'],
      keySpecs: [
        { term: 'EXECUTION BRIDGE', value: 'MSXML transformNode -> Embedded XSLT VBScript' },
        { term: 'IN-MEMORY LOADER', value: 'DotNetToJScript (BinaryFormatter Deserialization)' },
        { term: 'CLR ARTIFACT', value: 'mmc.exe loads clr.dll & mscoree.dll (Unusual for non-.NET snap-in)' },
      ],
    },
    {
      index: 3,
      title: 'SACRIFICIAL DLLHOST.EXE SPAWN & INDIRECT SYSCALL INJECTION',
      subtitle: 'mmc.exe spawns dllhost.exe and injects Cobalt Strike via DirtyCLR',
      description:
        'The deserialized .NET assembly (dubbed DirtyCLR by Elastic researchers) spawns a sacrificial C:\\Windows\\System32\\dllhost.exe child process and uses indirect syscalls (NtAllocateVirtualMemory, NtWriteVirtualMemory, NtCreateThreadEx) to inject the final Cobalt Strike Beacon payload.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1055.002',
      mitreTechniqueName: 'Process Injection: Portable Executable Injection',
      activeNodeIds: ['dotnet_to_jscript_mem', 'dllhost_sacrificial', 'elastic_defend_siem'],
      compromisedNodeIds: ['wks_mmc_host', 'dotnet_to_jscript_mem', 'dllhost_sacrificial'],
      keySpecs: [
        { term: 'PARENT -> CHILD', value: 'mmc.exe (PID 5412) -> dllhost.exe (PID 6088)' },
        { term: 'INJECTION METHOD', value: 'Indirect Syscalls (NtAllocateVirtualMemory + NtWriteVirtualMemory)' },
        { term: 'DETECTION SIGNAL', value: 'Sysmon EID 1 (mmc->dllhost) + EID 7 (apds.dll)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'el-grim-1',
      no: 1,
      stageIndex: 1,
      timestamp: '11:22:08.104',
      sourceNodeId: 'grim_lure_delivery',
      targetNodeId: 'wks_mmc_host',
      sourceLabel: 'sccm-Updater.msc',
      targetLabel: 'mmc.exe (PID 5412)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'LOAD APDS.DLL',
      info: 'Image=C:\\Windows\\System32\\mmc.exe ImageLoaded=C:\\Windows\\System32\\apds.dll',
      sizeOrCode: 'Signed MS DLL',
      severity: 'HIGH',
      mitreId: 'T1218.014',
      explanation:
        'Elastic Security Labs identified that mmc.exe loading C:\\Windows\\System32\\apds.dll is the primary behavioral indicator of the GrimResource technique.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}"/>
    <EventID>7</EventID>
    <Computer>WKS-FIN-08.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\mmc.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\apds.dll</Data>
    <Data Name="Signed">true</Data>
    <Data Name="Signature">Microsoft Windows</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Elastic Security Labs — GrimResource MMC Loading apds.dll (Sysmon EID 7)',
        ruleCode: `title: GrimResource Exploitation via MMC Loading apds.dll
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\mmc.exe'
    ImageLoaded|endswith: '\\apds.dll'
  condition: selection
level: high`,
        mitigation:
          'Block untrusted .msc files from email/web gateways and monitor mmc.exe loading apds.dll alongside jscript.dll or vbscript.dll.',
      },
    },
    {
      id: 'el-grim-2',
      no: 2,
      stageIndex: 2,
      timestamp: '11:22:08.512',
      sourceNodeId: 'wks_mmc_host',
      targetNodeId: 'dotnet_to_jscript_mem',
      sourceLabel: 'mmc.exe (apds.dll)',
      targetLabel: 'CLR / vbscript.dll',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 (CLR)',
      shortAction: 'DOTNETTOJSCRIPT',
      info: 'Image=mmc.exe ImageLoaded=C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\clr.dll',
      sizeOrCode: 'In-Memory CLR',
      severity: 'HIGH',
      mitreId: 'T1059.005',
      explanation:
        'Following apds.dll load, the XSLT transformNode gadget executes VBScript/JScript to load clr.dll and deserialize the DirtyCLR assembly in memory.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>WKS-FIN-08.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\mmc.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\vbscript.dll</Data>
    <Data Name="Description">Microsoft (R) VBScript</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'Elastic Security Labs YARA — Windows.Trojan.GrimResource (.MSC File)',
        ruleCode: `rule Windows_Trojan_GrimResource_MSC {
  meta:
    author = "Elastic Security Labs"
    description = "Detects MSC files abusing apds.dll redirect.html (GrimResource)"
  strings:
    $msc = "<MMC_ConsoleFile" ascii wide nocase
    $apds = "apds.dll/redirect.html" ascii wide nocase
    $js = "javascript:" ascii wide nocase
  condition:
    $msc and $apds and $js
}`,
        mitigation:
          'Scan inbound .msc attachments for references to apds.dll/redirect.html and embedded ActiveX/XSLT script blocks.',
      },
    },
    {
      id: 'el-grim-3',
      no: 3,
      stageIndex: 3,
      timestamp: '11:22:09.190',
      sourceNodeId: 'dotnet_to_jscript_mem',
      targetNodeId: 'dllhost_sacrificial',
      sourceLabel: 'mmc.exe (PID 5412)',
      targetLabel: 'dllhost.exe (PID 6088)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 & 8',
      shortAction: 'INJECT DLLHOST.EXE',
      info: 'ParentImage=mmc.exe Image=C:\\Windows\\System32\\dllhost.exe (No CLI Args)',
      sizeOrCode: 'PID 6088',
      severity: 'CRITICAL',
      mitreId: 'T1055.002',
      explanation:
        'Legitimate COM surrogate dllhost.exe always includes /Processid:{GUID} arguments. Here, mmc.exe spawns a bare dllhost.exe and injects Cobalt Strike via indirect syscalls.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>WKS-FIN-08.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6088</Data>
    <Data Name="Image">C:\\Windows\\System32\\dllhost.exe</Data>
    <Data Name="CommandLine">C:\\Windows\\System32\\dllhost.exe</Data>
    <Data Name="ParentProcessId">5412</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\mmc.exe</Data>
    <Data Name="ParentCommandLine">"C:\\Windows\\System32\\mmc.exe" "C:\\Users\\j.doe\\Downloads\\sccm-Updater.msc"</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Bare dllhost.exe Spawned by mmc.exe (GrimResource Injection)',
        ruleCode: `title: GrimResource MMC Spawning Sacrificial dllhost.exe
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\mmc.exe'
    Image|endswith: '\\dllhost.exe'
  filter_legit_com:
    CommandLine|contains: '/Processid:'
  condition: selection and not filter_legit_com
level: critical`,
        mitigation:
          'Alert on any dllhost.exe process spawned without /Processid:{GUID} command-line arguments, especially when parented by mmc.exe.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'elastic-grimresource-msc',
    briefing: {
      headline: 'Scenario Briefing: GrimResource (CVE-2024-43572 / MMC Attack), Code Execution via Crafted .msc Files',
      storyAnalogy:
        'Imagine a company that banned employees from opening .exe packages, but still trusts official-looking "Settings Binder" files (.msc) opened by the built-in Windows Management Console (mmc.exe). The attacker hides a legacy 1990s self-running gadget (apds.dll XSS) inside a Settings Binder; when opened, mmc.exe automatically runs the hidden script inside its own trusted process.',
      plainSummary:
        'In this scenario (T1218.014, Elastic Security Labs - GrimResource: MMC & apds.dll XSS-to-RCE Execution), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: opening a Malicious .msc File Triggers, then using DotNetToJScript to Reconstruct a .NET, then spawning dllhost.exe. Steps #1–#3 walk that chain end-to-end by covering Opening a Malicious .msc File Triggers, then Using DotNetToJScript to Reconstruct a .NET, then Spawning dllhost.exe, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 7 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Phishing Delivery of invoice_audit.msc), follow user execution on Node ③ (Windows Workstation mmc.exe), trace the apds.dll DOM XSS and DotNetToJScript memory injection inside Node ④ (mmc.exe / dllhost.exe), and watch the final C2 connection to Node ⑤ detected by Node ⑥ (Elastic Defend / SIEM).',
      documentedAdvisory: 'Elastic Security Labs "GrimResource" Report · Microsoft MSRC CVE-2024-43572 · MDSec DotNetToJScript · MITRE T1218.014',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1218.014',
        plainTitle: 'Opening a Malicious .msc File Triggers the Legacy apds.dll Redirect Vulnerability (CVE-2024-43572)',
        storyAnalogy:
          'The employee double-clicks an administrative binder (invoice_audit.msc). Inside the binder’s cover page (StringTables), a hidden reference tells the Windows Management Console to open an ancient help-viewer page (res://apds.dll/redirect.html) that blindly executes whatever script is written in its target parameter.',
        simpleExplanation:
          'The victim double-clicks a weaponized console file (invoice_audit.msc, an XML-based Windows Management Console file used to bypass email and browser blocks on .exe and .lnk files), which Windows automatically opens using the trusted system binary C:\\Windows\\System32\\mmc.exe. Inside the .msc XML structure, the <StringTables> section points an embedded HTML panel to res://C:\\Windows\\System32\\apds.dll/redirect.html?target=javascript:eval(...) (abusing an ancient HTML page baked inside Microsoft’s own apds.dll library that blindly passes its "target=" parameter into a browser redirect, CVE-2024-43572, immediately executing the attacker’s VBScript/JavaScript inside mmc.exe).',
        howItWorksInPractice:
          'C:\\Windows\\System32\\apds.dll (the legacy Microsoft Help Center library shipped on every Windows installation) contains an embedded resource (redirect.html) that passes the target query parameter directly to document.location.replace() without sanitizing javascript: or vbscript: URI schemes, giving the .msc file full script execution inside mmc.exe’s privileged MSHTML Zone. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② into Node ③ (mmc.exe loading invoice_audit.msc and apds.dll), and return arrow ⇠#1 triggering JScript execution inside mmc.exe.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & MSRC CVE-2024-43572: Sysmon EventID 7 showing mmc.exe loading both apds.dll and jscript.dll / vbscript.dll while parsing a non-standard .msc file.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Using DotNetToJScript to Reconstruct a .NET Loader Inside mmc.exe Memory',
        storyAnalogy:
          'Once the legacy script starts running inside mmc.exe, it acts like a 3D printer inside the building: it reads an encoded blueprint from the binder and materializes a full .NET loader (BinaryFormatter.Deserialize) directly in RAM.',
        simpleExplanation:
          'Plain JScript cannot call low-level Windows memory APIs directly, so the script inside mmc.exe uses the DotNetToJScript technique: it creates a .NET BinaryFormatter COM object via ActiveX (new ActiveXObject("System.Runtime.Serialization.Formatters.Binary.BinaryFormatter")) and deserializes a Base64-encoded .NET assembly ("GrimLoader") directly in RAM (allowing the attacker to bridge from limited JScript into a full .NET program with complete Win32 API access inside mmc.exe, without ever dropping a .dll or .exe file onto the hard drive).',
        howItWorksInPractice:
          'Deserializing a crafted gadget chain via BinaryFormatter loads the .NET Common Language Runtime (clr.dll / mscoree.dll) into mmc.exe and invokes Assembly.Load(byte[]) in memory (giving the attacker full P/Invoke access to kernel32.dll and ntdll.dll from inside a Microsoft-signed console process). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #2→ deserializes the .NET assembly inside Node ④ (mmc.exe CLR Runtime clr.dll / mscoree.dll), and return arrow ⇠#2 initializes the in-memory injector.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: mmc.exe loading jscript9.dll / jscript.dll followed immediately by .NET CLR (clr.dll) and amsi.dll in the same process.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055',
        plainTitle: 'Spawning dllhost.exe & Injecting the Cobalt Strike Beacon via RwSection / DirtyVanity',
        storyAnalogy:
          'Finally, so the employee can close the Settings Binder without killing the malware, the in-memory loader spawns a quiet background helper (dllhost.exe) and hands the active C2 radio over to it.',
        simpleExplanation:
          'If the victim notices an empty console window and clicks "X" to close mmc.exe, any malware running inside mmc.exe would die immediately. To survive, the in-memory .NET loader spawns a hidden background C:\\Windows\\System32\\dllhost.exe process (COM Surrogate, a legitimate Windows background host that runs without a visible taskbar window), maps a shared Read-Write-Execute memory section via NtCreateSection / NtMapViewOfSection ("RwSection" technique documented by Elastic Security Labs, avoiding suspicious VirtualAllocEx calls), and injects the Cobalt Strike C2 beacon into dllhost.exe.',
        howItWorksInPractice:
          'Migrating execution from the interactive mmc.exe process into a headless dllhost.exe process via shared section mapping (RwSection) or Asynchronous Procedure Call (NtQueueApcThread) ensures the C2 beacon stays alive in the background long after the victim closes the .msc window. In the documented Sysmon EID 1 & 8 exchange from mmc.exe (Management Console) to apds.dll & DotNetToJScript, apds.dll & DotNetToJScript responds with ACK PID 6088 (confirming that the INJECT DLLHOST.EXE request succeeded on apds.dll & DotNetToJScript and completing the final execution objective of Elastic Security Labs, GrimResource: MMC & apds.dll XSS-to-RCE Execution).',
        diagramAlignment:
          'On the diagram, arrow #3→ injects from Node ④ (mmc.exe) into dllhost.exe and connects out to Node ⑤ (C2 Server), while Node ⑥ (Elastic Defend / SIEM) correlates the .msc → apds.dll → dllhost.exe chain.',
        detectionAndEvidence:
          'Deploy behavioral rules matching Elastic execution_via_mmc_apds_dll (correlating module loads with cross-process injection telemetry) flagging mmc.exe after loading apds.dll spawning or injecting memory sections into dllhost.exe. Correlate Sysmon or Windows Security Event telemetry for T1055.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a trusted corporate management binder that automatically displays help pages inside a hidden mini-browser panel whenever an employee double-clicks it. An attacker slips a rigged old help-desk link inside a custom binder file so opening it bounces an ancient browser script helper straight into live memory, builds a full spy loader purely out of thin air inside the management console, and slips a covert beacon into a quiet helper office next door.',
      storyMappings: [
        {
          storyTerm: 'Rigged old help-desk link inside a trusted management binder',
          technicalTerm: 'Malicious .msc file exploiting legacy apds.dll redirect XSS (CVE-2024-43572)',
          tone: 'amber',
        },
        {
          storyTerm: 'Building a full spy loader out of thin air inside the console',
          technicalTerm: 'DotNetToJScript reconstructing an in-memory .NET loader via jscript.dll and clr.dll',
          tone: 'sky',
        },
        {
          storyTerm: 'Slipping a covert beacon into a quiet helper office next door',
          technicalTerm: 'mmc.exe spawning dllhost.exe and injecting Cobalt Strike via RwSection',
          tone: 'rose',
        },
        {
          storyTerm: 'Hidden mini-browser panel inside an official management binder',
          technicalTerm: 'Microsoft Management Console (mmc.exe) rendering embedded HTML/script nodes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'When an employee opens a seemingly official system-settings binder, a rigged help reference inside triggers an ancient built-in help router that blindly executes embedded webpage scripts right inside the trusted management console.',
        storyMappings: [
          {
            storyTerm: 'Seemingly official system-settings binder',
            technicalTerm: 'Weaponized Microsoft Saved Console (.msc) file opened by mmc.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Ancient built-in help router',
            technicalTerm: 'Legacy apds.dll resource redirect flaw (CVE-2024-43572 / GrimResource)',
            tone: 'sky',
          },
          {
            storyTerm: 'Embedded webpage scripts running inside the console',
            technicalTerm: 'mmc.exe loading apds.dll alongside jscript.dll or vbscript.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing ordinary macro warnings',
            technicalTerm: 'Code execution triggered inside signed mmc.exe without Office macros',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 7 (Image Loaded recording every DLL mapped into a running process) showing mmc.exe loading both apds.dll and jscript.dll or vbscript.dll while opening a non-standard .msc file (pinpointing CVE-2024-43572 GrimResource execution).',
      },
      2: {
        storyAnalogy:
          'Using a clever bridge inside the script engine, the tiny webpage script wakes up the full modern runtime factory right inside the console memory and compiles a multi-stage loader without dropping a single script file to disk.',
        storyMappings: [
          {
            storyTerm: 'Clever bridge waking up the modern runtime factory',
            technicalTerm: 'DotNetToJScript deserializing a .NET assembly inside jscript9.dll / clr.dll',
            tone: 'amber',
          },
          {
            storyTerm: 'Compiling a loader purely inside console memory',
            technicalTerm: 'In-memory .NET execution hosted within signed C:\\Windows\\System32\\mmc.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Unusual trio of guest engines inside one tool',
            technicalTerm: 'mmc.exe simultaneously loading jscript.dll, clr.dll, and amsi.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero intermediate executable written to disk',
            technicalTerm: 'Fileless stage-two staging evading traditional on-disk file scanners',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 7 (Image Loaded module telemetry) flagging mmc.exe loading jscript9.dll or jscript.dll immediately followed by the .NET CLR runtime (clr.dll) and amsi.dll inside the same process (confirming DotNetToJScript memory reconstruction).',
      },
      3: {
        storyAnalogy:
          'Rather than lingering inside the visible settings window the victim might soon close, the in-memory loader starts a quiet background helper room next door, writes a live command beacon across a shared memory corridor into that room, and dials home.',
        storyMappings: [
          {
            storyTerm: 'Quiet background helper room next door',
            technicalTerm: 'Spawned legitimate COM surrogate process dllhost.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Shared memory corridor carrying the live beacon',
            technicalTerm: 'Dirty Vanity / RwSection memory mapping injecting Cobalt Strike into dllhost.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Surviving closure of the visible settings window',
            technicalTerm: 'Process migration decoupling C2 persistence from the initial mmc.exe UI',
            tone: 'rose',
          },
          {
            storyTerm: 'High-confidence cross-process alert',
            technicalTerm: 'Elastic rule execution_via_mmc_apds_dll catching mmc.exe injecting into dllhost.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy behavioral rules matching Elastic execution_via_mmc_apds_dll (correlating module loads with cross-process injection telemetry) flagging mmc.exe after loading apds.dll spawning or injecting memory sections into dllhost.exe. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1055.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
