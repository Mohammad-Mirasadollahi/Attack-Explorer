import { TelemetryEvent } from '../types';

export const AMSI_REFLECTIVE_DLL_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'amsi-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.140',
    sourceNodeId: 'winword_stager',
    targetNodeId: 'powershell_host',
    sourceLabel: 'winword.exe (3820)',
    targetLabel: 'powershell.exe (5412)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 1 + PS 4104',
    shortAction: 'STAGER + EID 4104',
    info: 'powershell.exe -NoP -W Hidden -Enc ... resolves amsi.dll!AmsiScanBuffer @ 0x7FF9C2142840',
    sizeOrCode: 'PID 5412',
    severity: 'HIGH',
    mitreId: 'T1059.001',
    explanation:
      'Sysmon Event ID 1 captures winword.exe spawning hidden encoded PowerShell, while PowerShell Operational Event ID 4104 automatically logs the full de-obfuscated P/Invoke script block calling LoadLibrary("amsi.dll") and GetProcAddress("AmsiScanBuffer") before AMSI is disabled.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-PowerShell" Guid="{A0C1853B-5C40-4B15-8766-3CF1C58F985A}"/>
    <EventID>4104</EventID>
    <TimeCreated SystemTime="2026-11-26T09:12:04.140Z"/>
    <Computer>WKS-FIN-09.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="MessageNumber">1</Data>
    <Data Name="MessageTotal">1</Data>
    <Data Name="ScriptBlockText">$h = [Kernel32]::LoadLibrary("amsi.dll");
$addr = [Kernel32]::GetProcAddress($h, "AmsiScanBuffer");
# Resolved 0x7FF9C2142840 inside powershell.exe (PID 5412)</Data>
    <Data Name="ScriptBlockId">b8e2f41c-91a4-4d30-9f12-77c3a8d19e04</Data>
    <Data Name="Path"></Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'PowerShell Script Block Resolving AmsiScanBuffer via GetProcAddress',
      ruleCode: `title: PowerShell AMSI Bypass Address Resolution
logsource:
  product: windows
  category: ps_script
  definition: PowerShell Operational EventID 4104
detection:
  selection_amsi:
    ScriptBlockText|contains:
      - 'amsi.dll'
      - 'AmsiScanBuffer'
  selection_api:
    ScriptBlockText|contains:
      - 'GetProcAddress'
      - 'VirtualProtect'
  condition: selection_amsi and selection_api
level: critical`,
      mitigation:
        'Enable PowerShell Script Block Logging (Event ID 4104) and Constrained Language Mode via WDAC/AppLocker so Office child processes cannot compile P/Invoke memory helpers.',
    },
  },
  {
    id: 'amsi-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:00.295',
    sourceNodeId: 'powershell_host',
    targetNodeId: 'amsi_memory',
    sourceLabel: 'powershell.exe (5412)',
    targetLabel: 'amsi.dll!.text (0x7FF9C2142840)',
    sourceType: 'WIN32_API',
    protocolOrEventId: 'ETW-Ti ProtectVM',
    shortAction: 'VirtualProtect RWX',
    info: 'VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE [0x40], &old=0x20)',
    sizeOrCode: '0x20 -> 0x40',
    severity: 'CRITICAL',
    mitreId: 'T1562.001',
    explanation:
      'Kernel ETW Threat Intelligence (EtwTiLogProtectVM) records powershell.exe changing the page protection of signed amsi.dll!.text at 0x7FF9C2142840 from PAGE_EXECUTE_READ (0x20) to PAGE_EXECUTE_READWRITE (0x40), forcing a private Copy-on-Write page inside the process.',
    rawLog: `// Kernel ETW Threat-Intelligence Event: EtwTiLogProtectVM
Provider:       Microsoft-Windows-Threat-Intelligence
Host:           WKS-FIN-09 (10.10.4.27)
CallingPID:     5412 (C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe)
TargetPID:      5412 (Self-Process VirtualProtect)
BaseAddress:    0x00007FF9C2142840 (amsi.dll!AmsiScanBuffer + 0x0)
RegionSize:     0x1000 (4096 bytes · Copy-on-Write trigger)
OldProtection:  0x20 (PAGE_EXECUTE_READ)
NewProtection:  0x40 (PAGE_EXECUTE_READWRITE)
BackingImage:   C:\\Windows\\System32\\amsi.dll (Microsoft Signed)`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Kernel ETW-Ti Memory Protection Flip on Signed amsi.dll',
      ruleCode: `title: VirtualProtect RX to RWX Transition on amsi.dll
logsource:
  product: windows
  service: threat-intelligence-etw
detection:
  selection:
    EventName: 'EtwTiLogProtectVM'
    TargetModule|endswith: '\\amsi.dll'
    OldProtection: '0x20'
    NewProtection: '0x40'
  condition: selection
level: critical`,
      mitigation:
        'Alert immediately on any EtwTiLogProtectVM transition granting write permissions to a signed security DLL such as amsi.dll or ntdll.dll inside scripting hosts.',
    },
  },
  {
    id: 'amsi-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:00.340',
    sourceNodeId: 'powershell_host',
    targetNodeId: 'amsi_memory',
    sourceLabel: 'powershell.exe (5412)',
    targetLabel: 'amsi.dll!AmsiScanBuffer',
    sourceType: 'MEMORY_SCAN',
    protocolOrEventId: 'EDR Integrity Diff',
    shortAction: '6-BYTE PATCH',
    info: 'AmsiScanBuffer prologue overwritten: 4C 8B DC 49 89 5B -> B8 57 00 07 80 C3 (E_INVALIDARG), re-locked 0x20',
    sizeOrCode: '6 Bytes',
    severity: 'CRITICAL',
    mitreId: 'T1562.001',
    explanation:
      'Marshal.Copy overwrites the first 6 bytes of AmsiScanBuffer with mov eax, 0x80070057; ret (E_INVALIDARG) and restores PAGE_EXECUTE_READ (0x20). Every subsequent scan call returns immediately without contacting Windows Defender (MpOav.dll), leaving a dirty private page mismatch against disk.',
    rawLog: `// Defender / EDR In-Memory Integrity Audit (WKS-FIN-09 · PID 5412)
TargetModule:   C:\\Windows\\System32\\amsi.dll
ExportSymbol:   AmsiScanBuffer @ 0x00007FF9C2142840
DiskBytes[0..5]: 4C 8B DC 49 89 5B   ; mov r11, rsp ; mov [r11+0x8], rbx
LiveBytes[0..5]: B8 57 00 07 80 C3   ; mov eax, 0x80070057 (E_INVALIDARG) ; ret
PageState:      SEC_IMAGE Copy-on-Write Dirty (Shared = False)
PostPatchProt:  0x20 (PAGE_EXECUTE_READ restored via VirtualProtect)
Impact:         MpOav.dll Antimalware Provider bypassed for PID 5412`,
    detectionRule: {
      type: 'YARA',
      title: 'YARA / Memory Rule: AmsiScanBuffer E_INVALIDARG Prologue Patch',
      ruleCode: `rule Memory_AMSI_AmsiScanBuffer_Patch_E_INVALIDARG {
  meta:
    author = "SOC Memory Forensics"
    mitre = "T1562.001"
  strings:
    $patch_ret = { B8 57 00 07 80 C3 }
    $patch_alt = { 31 C0 C3 }
  condition:
    $patch_ret at entrypoint or any of ($patch_*)
}`,
      mitigation:
        'Periodically compare live executable pages of amsi.dll against the signed on-disk file in System32 and alert on Copy-on-Write private page divergence.',
    },
  },
  {
    id: 'amsi-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:00.890',
    sourceNodeId: 'c2_stager',
    targetNodeId: 'powershell_host',
    sourceLabel: 'HTTPS Stager (198.51.100.74:443)',
    targetLabel: 'powershell.exe CLR RAM (0x000001E4A2100000)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 3 + CLR 152',
    shortAction: 'REFLECTIVE LOAD',
    info: 'WebClient.DownloadData -> [Assembly]::Load($bytes) maps unbacked MEM_PRIVATE RWX PE (0 disk bytes)',
    sizeOrCode: '184 KB RAM',
    severity: 'CRITICAL',
    mitreId: 'T1620',
    explanation:
      'With AMSI blinded, PowerShell downloads the 184 KB stage-2 assembly over HTTPS directly into a RAM byte array (zero NTFS file written, so Sysmon EID 11 never fires) and loads it reflectively at 0x000001E4A2100000. Sysmon EID 3 logs the outbound HTTPS pull and .NET Runtime ETW EID 152 logs the unbacked memory-only assembly load.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>3</EventID>
    <TimeCreated SystemTime="2026-11-26T09:12:04.890Z"/>
  </System>
  <EventData>
    <Data Name="ProcessId">5412</Data>
    <Data Name="Image">C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe</Data>
    <Data Name="User">CORP\\a.miller</Data>
    <Data Name="Protocol">tcp</Data>
    <Data Name="SourceIp">10.10.4.27</Data>
    <Data Name="DestinationIp">198.51.100.74</Data>
    <Data Name="DestinationPort">443</Data>
  </EventData>
</Event>
// Correlated Microsoft-Windows-DotNETRuntime ETW EventID 152 (AssemblyLoad)
// ClrInstanceID=12 | AssemblyName="Stage2Recon, Version=1.0.0.0" | FullyQualifiedPath="" (MEMORY-ONLY)
// VirtualAddress=0x000001E4A2100000 | AllocationType=MEM_PRIVATE | Protect=PAGE_EXECUTE_READWRITE (0x40) | Sysmon EID 11=NONE`,
    detectionRule: {
      type: 'SIGMA',
      title: 'PowerShell Outbound HTTPS Followed by Unbacked In-Memory CLR Assembly Load',
      ruleCode: `title: Fileless PowerShell Reflective CLR Assembly Load
logsource:
  product: windows
  service: dotnet-etw
detection:
  selection_clr:
    EventID: 152
    ProcessName|endswith: '\\powershell.exe'
    FullyQualifiedPath: ''
  selection_mem:
    AllocationType: 'MEM_PRIVATE'
    PageProtection: 'PAGE_EXECUTE_READWRITE'
  condition: selection_clr and selection_mem
level: critical`,
      mitigation:
        'Correlate Sysmon Event ID 3 outbound HTTPS connections from PowerShell with .NET Runtime ETW Event ID 152 empty-path assembly loads and hunt unbacked MEM_PRIVATE RWX PE headers in RAM.',
    },
  },
];
