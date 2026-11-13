import { AttackScenario } from './types';

export const RANSOMWARE_SHADOW_WIPE_SCENARIO: AttackScenario = {
  id: 'ransomware-shadow-wipe',
  code: 'T1486 / T1490',
  name: 'LockBit Ransomware Behavioral Analysis: VSS Wipe & Fast Encryption',
  shortSubtitle: 'Malware & Log Analysis · Mutex Creation, WMI Shadow Copy Deletion & I/O Spike',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 7,
  overview: 'Dynamic behavioral analysis of modern ransomware (LockBit v3) reveals a disciplined pre-encryption sequence: first creating a global Mutex to prevent double encryption, terminating database/backup services (SQL, Veeam, Exchange) so locked files are freed, deleting Volume Shadow Copies via vssadmin/WMI (T1490), and finally launching multi-threaded I/O completion ports for rapid ChaCha20/AES file encryption (T1486).',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1490 (Inhibit System Recovery) · T1486 (Data Encrypted for Impact)' },
    { term: 'BEHAVIORAL IOCS', value: 'Mutex: Global\\{LockBit_v3} · vssadmin delete shadows /all /quiet' },
    { term: 'DETECTION LOGS', value: 'Sysmon EID 1 (vssadmin/wmic), Sysmon EID 11 (FileCreate .lockbit)' },
    { term: 'CRYPTO ENGINE', value: 'AES-256-NI + RSA-2048 Session Key Wrapping' },
  ],
  nodes: [
    {
      id: 'ransom_bin',
      label: 'lb3_payload.exe',
      sublabel: 'PID 5540 (Ransomware)',
      role: 'attacker',
      x: 20,
      y: 50,
      details: {
        osOrType: 'LockBit 3.0 Black Payload',
        pidOrPort: 'PID 5540 · High Integrity',
        privilege: 'Administrator',
        artifacts: ['CreateMutexW("Global\\39481-LB3")', 'BCryptGenRandom / AES-NI'],
        description: 'Primary ransomware binary orchestrating service termination, shadow copy deletion, and multi-threaded encryption.' } },
    {
      id: 'vss_service',
      label: 'VSS & WMI Subsystem',
      sublabel: 'vssadmin.exe / vssvc.exe',
      role: 'process',
      x: 52,
      y: 26,
      details: {
        osOrType: 'Volume Shadow Copy Service',
        pidOrPort: 'PID 5812 · vssadmin.exe',
        privilege: 'SYSTEM Recovery Service',
        artifacts: ['vssadmin.exe delete shadows /all /quiet', 'bcdedit /set {default} recoveryenabled No'],
        description: 'Windows Volume Shadow Copy subsystem targeted by the ransomware to inhibit system recovery.' } },
    {
      id: 'file_system',
      label: 'NTFS File System',
      sublabel: 'D:\\Shares\\Finance\\*',
      role: 'server',
      x: 56,
      y: 68,
      details: {
        osOrType: 'NTFS Volume (I/O Completion Ports)',
        pidOrPort: 'High-Speed Intermittent Encryption',
        privilege: 'File Shares',
        artifacts: ['Rename: Q4_Budget.xlsx -> Q4_Budget.xlsx.lockbit', 'Drop: Restore-My-Files.txt'],
        description: 'Target NTFS volume undergoing rapid intermittent encryption and ransom note creation (Sysmon EID 11).' } },
    {
      id: 'edr_canary',
      label: 'EDR Canary & SIEM',
      sublabel: 'Sysmon EID 1 & 11',
      role: 'firewall_siem',
      x: 84,
      y: 48,
      details: {
        osOrType: 'EDR Anti-Ransomware Behavioral Engine',
        pidOrPort: 'ShadowCopy Guard + Canary Files',
        privilege: 'Kernel Minifilter',
        artifacts: ['Alert: Shadow Copy Deletion Attempt', 'Alert: Mass File Rename Entropy Spike'],
        description: 'EDR kernel minifilter and SIEM rules triggering high-priority containment upon VSS deletion and mass file rename.' } },
  ],
  processTree: [
    {
      pid: 5540,
      ppid: 3100,
      name: 'lb3_payload.exe',
      commandLine: 'C:\\Windows\\Temp\\lb3_payload.exe -pass a8f9102b',
      user: 'CORP\\admin_srv',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateMutexW("Global\\39481-LB3")',
        'OpenSCManagerW / ControlService(SERVICE_CONTROL_STOP)',
        'CreateProcessW("vssadmin.exe delete shadows /all /quiet")',
        'MoveFileExW(*.lockbit)',
      ] },
    {
      pid: 5812,
      ppid: 5540,
      name: 'vssadmin.exe',
      commandLine: 'vssadmin.exe delete shadows /all /quiet',
      user: 'CORP\\admin_srv',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: ['IVssBackupComponents::DeleteSnapshots'] },
  ],
  stages: [
    {
      index: 1,
      title: 'INHIBIT SYSTEM RECOVERY VIA VSS DELETION',
      subtitle: 'Terminating SQL/Backup services and wiping Volume Shadow Copies',
      description: 'Before encrypting a single file, the ransomware executes vssadmin.exe delete shadows /all /quiet and bcdedit /set {default} recoveryenabled No (MITRE T1490). Because this happens prior to file encryption, an automated EDR/SOAR rule that kills the parent process of any unauthorized vssadmin delete command can stop ransomware before data loss occurs.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1490',
      mitreTechniqueName: 'Inhibit System Recovery',
      activeNodeIds: ['ransom_bin', 'vss_service', 'edr_canary'],
      compromisedNodeIds: ['ransom_bin', 'vss_service'],
      keySpecs: [
        { term: 'COMMAND LINE', value: 'vssadmin.exe delete shadows /all /quiet' },
        { term: 'MITRE ID', value: 'T1490 (Inhibit System Recovery)' },
        { term: 'DEFENSE WINDOW', value: 'Pre-encryption stage — Kill parent PID 5540 immediately' },
      ] },
    {
      index: 2,
      title: 'MULTI-THREADED INTERMITTENT FILE ENCRYPTION',
      subtitle: 'I/O Completion Ports encrypt file headers and drop ransom notes',
      description: 'To maximize speed, the ransomware uses Windows I/O Completion Ports and Intermittent Encryption—encrypting only the first 64 KB of each file with AES-NI, appending the .lockbit extension, and dropping Restore-My-Files.txt in every directory (logged in Sysmon Event ID 11).',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1486',
      mitreTechniqueName: 'Data Encrypted for Impact',
      activeNodeIds: ['ransom_bin', 'file_system', 'edr_canary'],
      compromisedNodeIds: ['ransom_bin', 'vss_service', 'file_system'],
      keySpecs: [
        { term: 'SYSMON EVENT', value: 'Event ID 11 (FileCreate: Restore-My-Files.txt)' },
        { term: 'ENCRYPTION MODE', value: 'Intermittent (First 64 KB per file + RSA footer)' },
        { term: 'EDR RESPONSE', value: 'Minifilter blocks WriteFile & terminates PID 5540' },
      ] },
  ],
  telemetry: [
    {
      id: 'rw-1',
      no: 1,
      stageIndex: 1,
      timestamp: '03:15:10.020',
      sourceNodeId: 'ransom_bin',
      targetNodeId: 'vss_service',
      sourceLabel: 'lb3_payload.exe (5540)',
      targetLabel: 'vssadmin.exe (5812)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'DELETE SHADOWS',
      info: 'CommandLine="vssadmin.exe delete shadows /all /quiet" Parent="lb3_payload.exe"',
      sizeOrCode: 'PID 5812',
      severity: 'CRITICAL',
      mitreId: 'T1490',
      explanation: 'Sysmon Event ID 1 captures vssadmin.exe delete shadows /all /quiet spawned by lb3_payload.exe. In enterprise environments, deleting all shadow copies with /quiet is an unmistakable high-confidence ransomware precursor.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
  </System>
  <EventData>
    <Data Name="ProcessId">5812</Data>
    <Data Name="Image">C:\\Windows\\System32\\vssadmin.exe</Data>
    <Data Name="CommandLine">vssadmin.exe delete shadows /all /quiet</Data>
    <Data Name="ParentProcessId">5540</Data>
    <Data Name="ParentImage">C:\\Windows\\Temp\\lb3_payload.exe</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Volume Shadow Copy Deletion via Vssadmin / WMIC',
        ruleCode: `title: Shadow Copies Deletion Using Operating Systems Utilities
logsource:
  category: process_creation
  product: windows
detection:
  selection_vssadmin:
    Image|endswith: '\\vssadmin.exe'
    CommandLine|contains|all:
      - 'delete'
      - 'shadows'
  condition: selection_vssadmin
level: critical`,
        mitigation: 'Configure automated EDR prevention policies to suspend/kill the parent process of any unauthorized shadow copy deletion and maintain immutable offline backups.' } },
    {
      id: 'rw-2',
      no: 2,
      stageIndex: 2,
      timestamp: '03:15:10.480',
      sourceNodeId: 'ransom_bin',
      targetNodeId: 'file_system',
      sourceLabel: 'lb3_payload.exe (5540)',
      targetLabel: 'D:\\Shares\\Finance\\',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11',
      shortAction: 'RANSOM NOTE',
      info: 'FileCreate: TargetFilename="D:\\Shares\\Finance\\Restore-My-Files.txt"',
      sizeOrCode: '4.1 KB',
      severity: 'CRITICAL',
      mitreId: 'T1486',
      explanation: 'Sysmon Event ID 11 logs the creation of the ransom note file (Restore-My-Files.txt) across shared directories.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
  </System>
  <EventData>
    <Data Name="ProcessId">5540</Data>
    <Data Name="Image">C:\\Windows\\Temp\\lb3_payload.exe</Data>
    <Data Name="TargetFilename">D:\\Shares\\Finance\\Restore-My-Files.txt</Data>
    <Data Name="CreationUtcTime">2026-11-12 03:15:10.480</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Known Ransomware Note Filename Creation (Sysmon EID 11)',
        ruleCode: `title: Ransomware Note File Creation
logsource:
  product: windows
  category: file_event
detection:
  selection:
    TargetFilename|endswith:
      - '\\Restore-My-Files.txt'
      - '\\README-LOCKBIT.txt'
      - '\\HOW_TO_DECRYPT.txt'
  condition: selection
level: critical`,
        mitigation: 'Configure Windows File Server Resource Manager (FSRM) file screens to block known ransomware extensions/notes and automatically revoke SMB sessions.' } },
  ] };
