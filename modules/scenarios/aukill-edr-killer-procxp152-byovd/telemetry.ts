import type { TelemetryEvent } from '../types';

export const AUKILL_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'aukill-log-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.340',
    sourceNodeId: 'aukill-loader',
    targetNodeId: 'scm-service',
    sourceLabel: 'SRV-APP-09 (aukill.exe PID 5104)',
    targetLabel: 'Service Control Manager (SCM)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 6 + System EID 7045',
    shortAction: 'BYOVD DRIVER LOAD',
    info: 'aukill.exe drops outdated Microsoft-signed Sysinternals PROCEXP152.SYS and registers kernel driver service PROCEXP152 into Ring 0',
    sizeOrCode: 'Signed Valid',
    severity: 'CRITICAL',
    mitreId: 'T1543.003',
    explanation:
      'Running as local admin, aukill.exe writes outdated Process Explorer driver v16.32 (PROCEXP152.SYS) to System32\\drivers and loads it via SCM, passing standard Driver Signature Enforcement because the Microsoft signature is valid.',
    rawLog: `Sysmon EventID=6 (DriverLoaded) | Computer=SRV-APP-09.corp.local
ImageLoaded=C:\\Windows\\System32\\drivers\\PROCEXP152.sys | Signed=true
Signature=Microsoft Corporation | SignatureStatus=Valid | BaseAddress=0xFFFFF80541200000
System EventID=7045 | ServiceName=PROCEXP152 | ServiceType=kernel mode driver (0x1)`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Known Vulnerable Signed Driver (PROCEXP152.SYS) Loaded via BYOVD',
      ruleCode: `title: Vulnerable Process Explorer Driver PROCEXP152.sys Loaded (BYOVD)
status: stable
logsource:
  category: driver_load
  product: windows
detection:
  selection:
    ImageLoaded|endswith: '\\PROCEXP152.sys'
  condition: selection
level: critical`,
      mitigation:
        'Enable HVCI (Memory Integrity) and the Microsoft Recommended Driver Blocklist to block known BYOVD driver hashes pre-load.',
    },
  },
  {
    id: 'aukill-log-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:01.185',
    sourceNodeId: 'scm-service',
    targetNodeId: 'ring0-driver',
    sourceLabel: 'aukill.exe (PID 5104 Ring 3)',
    targetLabel: '\\\\.\\PROCEXP152 (Ring 0 Driver)',
    sourceType: 'WIN32_API',
    protocolOrEventId: 'IOCTL 0x8335003C (ZwOpenProcess)',
    shortAction: 'PPL HANDLE BYPASS',
    info: 'aukill.exe sends unauthenticated DeviceIoControl 0x8335003C to PROCEXP152.SYS, obtaining kernel PROCESS_ALL_ACCESS handle 0x03A4 to PPL-protected MsMpEng.exe',
    sizeOrCode: 'Handle 0x03A4',
    severity: 'CRITICAL',
    mitreId: 'T1068',
    explanation:
      'PROCEXP152.SYS exposes an unauthenticated IOCTL dispatch routine that executes ZwOpenProcess inside kernel Ring 0 without validating caller identity, bypassing PsProtectedSignerAntimalware-Light (PPL) armor.',
    rawLog: `DeviceIoControl | Caller=C:\\Users\\Public\\aukill.exe (PID 5104)
DeviceSymbolicLink=\\\\.\\PROCEXP152 | IoControlCode=0x8335003C
TargetPID=2188 (MsMpEng.exe · PPL Antimalware-Light)
ReturnedKernelHandle=0x000003A4 (PROCESS_ALL_ACCESS)`,
    detectionRule: {
      type: 'KQL',
      title: 'Non-Sysinternals Binary Invoking PROCEXP152 Device IOCTL OpenProcess',
      ruleCode: `DeviceEvents
| where ActionType in ("DeviceIoControl", "CreateFile")
| where AdditionalFields has "PROCEXP152"
| where InitiatingProcessFileName !in~ ("procexp.exe", "procexp64.exe")
| project Timestamp, DeviceName, InitiatingProcessFileName, AdditionalFields`,
      mitigation:
        'Restrict admin privileges via tiered access models and block unapproved access to vulnerable driver symbolic links via kernel telemetry.',
    },
  },
  {
    id: 'aukill-log-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:02.402',
    sourceNodeId: 'ring0-driver',
    targetNodeId: 'edr-ppl',
    sourceLabel: 'PROCEXP152.SYS (Ring 0)',
    targetLabel: 'MsMpEng.exe & EDR Sensors (PPL)',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'IOCTL 0x83350004 + System EID 7031',
    shortAction: 'EDR KILL LOOP',
    info: 'Continuous IOCTL 0x83350004 (nt!ZwTerminateProcess) loop kills MsMpEng.exe and competing EDR agents, triggering repeated System Event ID 7031 crashes and heartbeat loss',
    sizeOrCode: 'EID 7031 Burst',
    severity: 'CRITICAL',
    mitreId: 'T1562.001',
    explanation:
      'Because termination runs from Ring 0 through a signed driver, user-mode EDR tamper protection cannot intercept the kill; the tight loop defeats SCM auto-restart and blinds the SOC.',
    rawLog: `System EventID=7031 | Computer=SRV-APP-09.corp.local
Service=Microsoft Defender Antivirus Service (WinDefend) terminated unexpectedly (Count=4)
IOCTL=0x83350004 (nt!ZwTerminateProcess) -> Handle 0x03A4 (PID 2188)
SOC_Telemetry=EDR_HEARTBEAT_SILENCE_DETECTED`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Repeated Unexpected Security Service Terminations (System Event ID 7031/7034)',
      ruleCode: `title: Repeated Unexpected Security Service Termination (Possible EDR Killer)
status: stable
logsource:
  product: windows
  service: system
detection:
  selection:
    EventID:
      - 7031
      - 7034
    param1|contains:
      - 'Defender'
      - 'CrowdStrike'
      - 'Sentinel'
      - 'Sophos'
  condition: selection
level: critical`,
      mitigation:
        'Deploy SOC dead-man-switch rules correlating sudden sensor heartbeat silence with Windows System Event ID 7031/7034 crashes.',
    },
  },
  {
    id: 'aukill-log-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:04.019',
    sourceNodeId: 'ransom-stage',
    targetNodeId: 'hvci-siem',
    sourceLabel: 'CI.dll & HVCI Driver Blocklist',
    targetLabel: 'HVCI Blocklist & SOC SIEM',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'CodeIntegrity EID 3077',
    shortAction: 'HVCI BLOCKED DRIVER',
    info: 'On hardened hosts, HVCI and Microsoft Vulnerable Driver Blocklist reject PROCEXP152.SYS with STATUS_INVALID_IMAGE_HASH (0xC0000428) before Ring 0 load',
    sizeOrCode: '0xC0000428',
    severity: 'HIGH',
    mitreId: 'T1486',
    explanation:
      'Hypervisor-Protected Code Integrity matches the revoked PROCEXP152.SYS hash at load time, logging CodeIntegrity Event ID 3077 so PPL EDR stays intact and stops pre-ransomware staging.',
    rawLog: `Microsoft-Windows-CodeIntegrity/Operational EventID=3077 | Computer=SRV-APP-10.corp.local
FileNameBuffer=\\Device\\HarddiskVolume3\\Windows\\System32\\drivers\\PROCEXP152.sys
Status=STATUS_INVALID_IMAGE_HASH (0xC0000428) | Policy=Microsoft_Recommended_Driver_Block_Rules
Outcome=Driver Load Blocked Pre-Ring0 · PPL EDR Online`,
    detectionRule: {
      type: 'KQL',
      title: 'CodeIntegrity Blocked Known Vulnerable BYOVD Driver (EID 3076/3077)',
      ruleCode: `Event
| where EventLog == "Microsoft-Windows-CodeIntegrity/Operational"
| where EventID in (3076, 3077)
| where RenderedDescription has_any ("PROCEXP152", "rtcore64", "truesight")
| project TimeGenerated, Computer, EventID, RenderedDescription`,
      mitigation:
        'Enforce HVCI and Microsoft Recommended Driver Block Rules via GPO/Intune and treat every Event ID 3077 BYOVD block as an active P1 admin compromise.',
    },
  },
];
