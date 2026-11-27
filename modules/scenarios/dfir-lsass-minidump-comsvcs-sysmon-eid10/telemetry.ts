import type { TelemetryEvent } from '../types';

export const LSASS_COMSVCS_MINIDUMP_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'lsass-evt-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.318',
    sourceNodeId: 'admin_cmd',
    targetNodeId: 'rundll32_lolbin',
    sourceLabel: 'cmd.exe (PID 4920 · High)',
    targetLabel: 'SeDebugPrivilege & PID 684',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'Security EID 4672 / Sysmon 1',
    shortAction: 'SEDEBUG + PID ENUM',
    info: 'Elevated admin session (CORP\\adm_jchen) receives SeDebugPrivilege (EID 4672) and queries lsass.exe PID 684 via tasklist',
    sizeOrCode: 'PID 684',
    severity: 'HIGH',
    mitreId: 'T1134',
    explanation:
      'Dumping Local Security Authority Subsystem Service (LSASS) memory requires an elevated access token carrying SeDebugPrivilege. The operator confirms special privileges via Security Event ID 4672 and resolves lsass.exe PID 684 via tasklist before invoking comsvcs.dll.',
    rawLog: `EventID=4672 (Special Privileges Assigned to New Logon)
SubjectUserName=adm_jchen | SubjectDomainName=CORP | LogonId=0x4E8F12
PrivilegeList=SeDebugPrivilege, SeSecurityPrivilege, SeBackupPrivilege, SeTakeOwnershipPrivilege
---
Sysmon EventID=1 (ProcessCreate) | Host=WKS-ADM-07.corp.local
ParentImage=C:\\Windows\\System32\\cmd.exe (PID 4920, Integrity=High)
CommandLine=tasklist /fi "imagename eq lsass.exe"
Output=lsass.exe                      684 Services                   0     34,812 K`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Administrative Discovery of LSASS Process ID Preceding Credential Dumping',
      ruleCode: `title: LSASS Process ID Enumeration via Command Line
status: stable
logsource:
  category: process_creation
  product: windows
detection:
  selection_tool:
    Image|endswith:
      - '\\tasklist.exe'
      - '\\powershell.exe'
      - '\\wmic.exe'
  selection_lsass:
    CommandLine|contains: 'lsass'
  condition: selection_tool and selection_lsass
level: medium
tags:
  - attack.credential_access
  - attack.t1003.001
  - attack.t1134`,
      mitigation:
        'Remove SeDebugPrivilege from non-essential accounts, enforce Privileged Access Workstations (PAWs), and restrict local administrator membership via LAPS and Tier-0 separation.',
    },
  },
  {
    id: 'lsass-evt-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:02.940',
    sourceNodeId: 'rundll32_lolbin',
    targetNodeId: 'lsass_vault',
    sourceLabel: 'rundll32.exe (PID 5412)',
    targetLabel: 'lsass.exe (PID 684)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 10 (ProcessAccess)',
    shortAction: 'OPENPROCESS 0x1010',
    info: 'rundll32.exe (PID 5412) invokes comsvcs.dll, MiniDump (#24) and opens lsass.exe (PID 684) with GrantedAccess 0x1010 (PROCESS_VM_READ)',
    sizeOrCode: '0x1010',
    severity: 'CRITICAL',
    mitreId: 'T1218.011',
    explanation:
      'Instead of dropping an unsigned Mimikatz binary, the attacker abuses Microsoft-signed rundll32.exe and C:\\Windows\\System32\\comsvcs.dll (export MiniDump / ordinal #24). Sysmon Event ID 10 records the exact handle mask 0x1010 (PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ) and the revealing CallTrace through comsvcs.dll and dbgcore.dll.',
    rawLog: `Sysmon EventID=10 (ProcessAccess) | Host=WKS-ADM-07.corp.local
SourceImage=C:\\Windows\\System32\\rundll32.exe (SourceProcessId=5412)
TargetImage=C:\\Windows\\System32\\lsass.exe (TargetProcessId=684)
GrantedAccess=0x1010 (PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ)
CallTrace=C:\\Windows\\SYSTEM32\\ntdll.dll+9d2c4|C:\\Windows\\System32\\KERNELBASE.dll+2c41e|C:\\Windows\\System32\\comsvcs.dll+41a8c|C:\\Windows\\System32\\dbgcore.dll+13290|C:\\Windows\\System32\\rundll32.exe+2910
CommandLine=C:\\Windows\\System32\\rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 684 C:\\Windows\\Temp\\debug.dmp full`,
    detectionRule: {
      type: 'SIGMA',
      title: 'LSASS ProcessAccess via comsvcs.dll MiniDump (Sysmon Event ID 10)',
      ruleCode: `title: LSASS Memory Access via comsvcs.dll and dbgcore.dll CallTrace
status: stable
logsource:
  category: process_access
  product: windows
detection:
  selection_target:
    TargetImage|endswith: '\\lsass.exe'
  selection_access:
    GrantedAccess|endswith:
      - '1010'
      - '1410'
      - '1438'
      - '143a'
      - '1fffff'
  selection_trace:
    CallTrace|contains|all:
      - 'comsvcs.dll'
      - 'dbgcore.dll'
  condition: selection_target and selection_access and selection_trace
level: critical
tags:
  - attack.credential_access
  - attack.t1003.001
  - attack.t1218.011`,
      mitigation:
        'Enable LSA Protection (RunAsPPL = 1 under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa) and Windows Defender Credential Guard so non-PPL processes like rundll32.exe receive STATUS_ACCESS_DENIED when requesting PROCESS_VM_READ on lsass.exe.',
    },
  },
  {
    id: 'lsass-evt-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:05.412',
    sourceNodeId: 'comsvcs_minidump',
    targetNodeId: 'mdmp_dump_file',
    sourceLabel: 'comsvcs.dll -> dbgcore.dll',
    targetLabel: 'C:\\Windows\\Temp\\debug.dmp',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 11 (FileCreate)',
    shortAction: 'WRITE MDMP DUMP',
    info: 'MiniDumpWriteDump serializes lsass.exe RAM (LogonSessionList & MSV1_0 cache) into 48.2 MB MDMP file C:\\Windows\\Temp\\debug.dmp',
    sizeOrCode: '48.2 MB MDMP',
    severity: 'CRITICAL',
    mitreId: 'T1003.001',
    explanation:
      'Inside comsvcs.dll!MiniDumpW, Windows calls dbgcore.dll!MiniDumpWriteDump with MiniDumpWithFullMemory (0x2), reading LSASS private virtual memory pages and writing a 48.2 MB binary file beginning with the signature 4D 44 4D 50 93 A7 ("MDMP") into C:\\Windows\\Temp\\debug.dmp.',
    rawLog: `Sysmon EventID=11 (FileCreate) | Host=WKS-ADM-07.corp.local
Image=C:\\Windows\\System32\\rundll32.exe (ProcessId=5412)
TargetFilename=C:\\Windows\\Temp\\debug.dmp
FileSize=50,541,568 bytes (48.2 MB)
FileHeaderHex=4D 44 4D 50 93 A7 00 00 0F 00 00 00 20 00 00 00 ("MDMP....")
CapturedModules=lsasrv.dll, msv1_0.dll, kerberos.dll, wdigest.dll`,
    detectionRule: {
      type: 'YARA',
      title: 'Windows LSASS Minidump (MDMP) File Containing lsasrv.dll & msv1_0.dll Streams',
      ruleCode: `rule DFIR_LSASS_MDMP_Minidump_Artifact {
  meta:
    description = "Detects renamed or staged Windows minidump files containing LSASS credential modules"
    mitre = "T1003.001"
  strings:
    $mdmp = { 4D 44 4D 50 93 A7 }
    $lsasrv = "lsasrv.dll" wide ascii
    $msv1 = "msv1_0.dll" wide ascii
    $kerb = "kerberos.dll" wide ascii
  condition:
    $mdmp at 0 and 2 of ($lsasrv, $msv1, $kerb)
}`,
      mitigation:
        'Deploy EDR file-inspection rules alerting on any MDMP magic header (4D 44 4D 50 93 A7) written by rundll32.exe into Temp or Public directories regardless of file extension (.dmp, .txt, .png).',
    },
  },
  {
    id: 'lsass-evt-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:09.105',
    sourceNodeId: 'mdmp_dump_file',
    targetNodeId: 'sysmon_eid10_booth',
    sourceLabel: 'C:\\Windows\\Temp\\debug.dmp',
    targetLabel: 'Sysmon EID 10 & PPL Defense',
    sourceType: 'IDS_ALERT',
    protocolOrEventId: 'EDR Alert / Offline Parse',
    shortAction: 'EID 10 + PPL AUDIT',
    info: 'SOC correlates Sysmon EID 1 (ordinal #24), EID 10 (0x1010 + dbgcore.dll), and EID 11 (MDMP) before attacker extracts NTLM hashes offline with pypykatz',
    sizeOrCode: 'ALERT + PPL',
    severity: 'CRITICAL',
    mitreId: 'T1003.001',
    explanation:
      'Even if the attacker renames debug.dmp, invokes comsvcs.dll by ordinal #24 instead of the string MiniDump, and parses the dump offline with pypykatz so Mimikatz never touches the endpoint, correlating Sysmon EID 10 (CallTrace containing comsvcs.dll/dbgcore.dll) with EID 11 catches the theft immediately—and RunAsPPL prevents it outright.',
    rawLog: `EDR_CORRELATION_ALERT=LSASS_COMSVCS_MINIDUMP_CONFIRMED | Host=WKS-ADM-07.corp.local
Trigger1=Sysmon EID 1: rundll32.exe PID 5412 -> comsvcs.dll, MiniDump (#24) 684
Trigger2=Sysmon EID 10: GrantedAccess=0x1010 -> lsass.exe PID 684 (CallTrace: comsvcs.dll|dbgcore.dll)
Trigger3=Sysmon EID 11: FileCreate C:\\Windows\\Temp\\debug.dmp (Magic=MDMP, 48.2 MB)
OfflineRisk=pypykatz lsa minidump debug.dmp -> CORP\\adm_jchen NT Hash + Kerberos TGTs
Containment=Isolate WKS-ADM-07, Reset Exposed Credentials & Enforce RunAsPPL + Credential Guard`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Suspicious rundll32.exe Execution of comsvcs.dll MiniDump (Name or Ordinal #24)',
      ruleCode: `title: Comsvcs.dll MiniDump Execution via Rundll32 (Name or Ordinal #24)
status: stable
logsource:
  category: process_creation
  product: windows
detection:
  selection_parent:
    Image|endswith: '\\rundll32.exe'
  selection_dll:
    CommandLine|contains: 'comsvcs'
  selection_export:
    CommandLine|contains:
      - 'MiniDump'
      - '#24'
      - '#00024'
      - 'full'
  condition: selection_parent and selection_dll and selection_export
level: high
tags:
  - attack.credential_access
  - attack.t1003.001
  - attack.t1218.011`,
      mitigation:
        'Enforce Microsoft Attack Surface Reduction (ASR) rule "Block credential stealing from the Windows local security authority subsystem (lsass.exe)", enable RunAsPPL + Credential Guard via GPO/Intune, and rotate any exposed NTLM/Kerberos credentials immediately.',
    },
  },
];
