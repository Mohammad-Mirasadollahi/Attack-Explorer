import { TelemetryEvent } from '../types';

export const RANSOMWARE_SHADOW_WIPE_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'lb3-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.180',
    sourceNodeId: 'jump_host',
    targetNodeId: 'file_server',
    sourceLabel: 'JUMP-OPS-02 (10.10.15.8)',
    targetLabel: 'FS-CORP-01 (10.10.50.14)',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'WinSec 5145 + Sys 7045',
    shortAction: 'PSEXEC STAGING',
    info: 'SMB ADMIN$ write lb3_black.exe + Service PSEXESVC installed as SYSTEM on FS-CORP-01',
    sizeOrCode: 'EID 7045',
    severity: 'HIGH',
    mitreId: 'T1569.002',
    explanation:
      'Windows Security Event ID 5145 logs the breached jump-host writing lb3_black.exe into the hidden ADMIN$ share over SMB TCP 445, immediately followed by System Event ID 7045 recording Service Control Manager installing PSEXESVC to launch LockBit as NT AUTHORITY\\SYSTEM.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Service Control Manager" Guid="{555908d1-a6d7-4695-8e1e-26931d2012f4}"/>
    <EventID>7045</EventID>
    <TimeCreated SystemTime="2026-11-26T02:14:09.180Z"/>
    <Computer>FS-CORP-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ServiceName">PSEXESVC</Data>
    <Data Name="ImagePath">%SystemRoot%\\PSEXESVC.exe -> C:\\Windows\\lb3_black.exe -pass 8f91c2a0</Data>
    <Data Name="ServiceType">user mode service</Data>
    <Data Name="StartType">demand start</Data>
    <Data Name="AccountName">LocalSystem</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Remote PsExec Service Creation Launching Ransomware Binary on File Server',
      ruleCode: `title: Remote PsExec Service Staging Over ADMIN$ Share
logsource:
  product: windows
  service: system
detection:
  selection:
    EventID: 7045
    ServiceName|contains: 'PSEXESVC'
  condition: selection
level: high`,
      mitigation:
        'Block lateral SMB TCP 445 between administrative jump-hosts and production file servers with host firewall rules and require privileged access workstations with MFA.',
    },
  },
  {
    id: 'lb3-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:00.640',
    sourceNodeId: 'lockbit_worker',
    targetNodeId: 'vss_archive',
    sourceLabel: 'lb3_black.exe (6412)',
    targetLabel: 'vssadmin.exe / bcdedit.exe',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon 1 + Sys 7036',
    shortAction: 'VSS SHADOW WIPE',
    info: 'vssadmin.exe delete shadows /all /quiet & bcdedit /set {default} recoveryenabled No',
    sizeOrCode: '0 Snapshots',
    severity: 'CRITICAL',
    mitreId: 'T1490',
    explanation:
      'Before locking active documents, lb3_black.exe spawns vssadmin.exe and bcdedit.exe to purge every Volume Shadow Copy snapshot and disable Windows Recovery Environment, while System Event ID 7036 records the Volume Shadow Copy service transitioning to Stopped.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <TimeCreated SystemTime="2026-11-26T02:14:09.640Z"/>
    <Computer>FS-CORP-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6504</Data>
    <Data Name="Image">C:\\Windows\\System32\\vssadmin.exe</Data>
    <Data Name="CommandLine">vssadmin.exe delete shadows /all /quiet</Data>
    <Data Name="ParentProcessId">6412</Data>
    <Data Name="ParentImage">C:\\Windows\\lb3_black.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Volume Shadow Copy Deletion & Recovery Inhibition Command Execution',
      ruleCode: `title: Ransomware Shadow Copy Wipe via vssadmin or bcdedit
logsource:
  product: windows
  category: process_creation
detection:
  selection_vss:
    Image|endswith: '\\vssadmin.exe'
    CommandLine|contains|all:
      - 'delete'
      - 'shadows'
  selection_bcd:
    Image|endswith: '\\bcdedit.exe'
    CommandLine|contains: 'recoveryenabled No'
  condition: selection_vss or selection_bcd
level: critical`,
      mitigation:
        'Maintain immutable offline/air-gapped backups outside Active Directory and configure EDR tamper rules to auto-kill any process invoking vssadmin delete shadows.',
    },
  },
  {
    id: 'lb3-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:02.150',
    sourceNodeId: 'lockbit_worker',
    targetNodeId: 'file_server',
    sourceLabel: 'lb3_black.exe (IOCP Pool)',
    targetLabel: 'D:\\Finance_Shares\\*.lockbit',
    sourceType: 'WIN32_API',
    protocolOrEventId: 'WinSec 4663 + IOCP Burst',
    shortAction: 'HEAD-ONLY ENCRYPT',
    info: '4-thread CreateIoCompletionPort pool encrypts first 4 KB-64 KB headers (ChaCha20 + RSA-2048) & renames 4,820 files to .lockbit',
    sizeOrCode: '4,820 Files',
    severity: 'CRITICAL',
    mitreId: 'T1486',
    explanation:
      'Using Windows I/O Completion Ports across all CPU cores, LockBit generates a per-file symmetric key wrapped with RSA-2048 and encrypts only the opening 4 KB to 64 KB header stripe of each document before appending .lockbit, maximizing destruction speed before defenders can isolate FS-CORP-01.',
    rawLog: `// EDR Behavioral File-System I/O Burst Telemetry
Host:              FS-CORP-01 (10.10.50.14)
Process:           C:\\Windows\\lb3_black.exe (PID 6412 · SYSTEM)
ConcurrencyModel:  CreateIoCompletionPort (8 Worker Threads)
EncryptionMode:    Intermittent / Head-Only (First 4096..65536 Bytes per File)
CipherSuite:       ChaCha20 + RSA-2048 Public Key Footer
SampleTargets:     D:\\Finance_Shares\\Q4_General_Ledger.xlsx.lockbit
                   D:\\HR_Records\\Payroll_Master_2026.csv.lockbit
                   D:\\CAD_Archives\\Turbine_Housing_Rev8.dwg.lockbit
VelocityMetric:    4,820 files modified & renamed in 11.4 seconds`,
    detectionRule: {
      type: 'YARA',
      title: 'High-Velocity Intermittent File Header Encryption & .lockbit Mass Rename',
      ruleCode: `rule LockBit3_Intermittent_Header_Encryption_Behavior {
  meta:
    author = "SOC DFIR Engineering"
    mitre = "T1486"
    severity = "critical"
  strings:
    $ext = ".lockbit" ascii wide
    $note = "Restore-My-Files.txt" ascii wide
    $vss = "vssadmin delete shadows /all /quiet" ascii wide
  condition:
    2 of them
}`,
      mitigation:
        'Deploy canary files across shared folders paired with automated EDR host containment when rapid high-entropy header writes exceed baseline I/O thresholds.',
    },
  },
  {
    id: 'lb3-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:13.420',
    sourceNodeId: 'lockbit_worker',
    targetNodeId: 'siem_audit',
    sourceLabel: 'lb3_black.exe (6412)',
    targetLabel: 'Restore-My-Files.txt + EID 1102',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon 11/13 + EID 1102',
    shortAction: 'NOTE + LOG WIPE',
    info: 'Drops Restore-My-Files.txt across all shares, sets wallpaper registry key, and triggers WinSec EID 1102 via wevtutil cl Security',
    sizeOrCode: 'EID 1102',
    severity: 'CRITICAL',
    mitreId: 'T1070.004',
    explanation:
      'After locking the file shares, LockBit drops Restore-My-Files.txt in every folder (Sysmon EID 11), overrides desktop wallpaper via registry (Sysmon EID 13), and attempts to clear Windows Security logs via wevtutil cl Security—which ironically writes an unerasable Windows Security Event ID 1102 alert into the SIEM.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Eventlog"/>
    <EventID>1102</EventID>
    <TimeCreated SystemTime="2026-11-26T02:14:22.420Z"/>
    <Computer>FS-CORP-01.corp.local</Computer>
  </System>
  <UserData>
    <LogFileCleared xmlns="http://manifests.microsoft.com/win/2004/08/windows/eventlog">
      <SubjectUserName>FS-CORP-01$</SubjectUserName>
      <SubjectDomainName>CORP</SubjectDomainName>
      <Channel>Security</Channel>
      <TriggerCommand>wevtutil.exe cl Security</TriggerCommand>
      <CompanionArtifact>D:\\Finance_Shares\\Restore-My-Files.txt (Sysmon EID 11)</CompanionArtifact>
    </LogFileCleared>
  </UserData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Ransom Note Mass Creation Correlated With Windows Security Audit Log Clear (EID 1102)',
      ruleCode: `title: LockBit Ransom Note Drop and Audit Log Clearing
logsource:
  product: windows
  service: security
detection:
  selection_clear:
    EventID: 1102
  condition: selection_clear
level: critical`,
      mitigation:
        'Stream Windows Security, System, and Sysmon logs continuously to a remote append-only SIEM so local wevtutil cl commands immediately trigger high-severity containment alerts without erasing historical evidence.',
    },
  },
];
