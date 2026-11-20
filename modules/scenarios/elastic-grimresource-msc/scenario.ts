import type { AttackScenario } from '../types';

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
