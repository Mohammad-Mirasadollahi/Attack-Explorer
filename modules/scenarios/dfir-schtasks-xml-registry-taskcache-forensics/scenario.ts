import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-schtasks-xml-registry-taskcache-forensics',
    title: 'Microsoft MSTIC & SANS DFIR — Scheduled Task Creation & TaskCache SD Descriptor Deletion (EventID 4698 / Sysmon EID 12)',
    category: 'MALWARE',
    mitreId: 'T1053.005',
    description:
      'Grounded in Microsoft Security Auditing Event ID 4698/4702 documentation, Microsoft Threat Intelligence (MSTIC) "Tarrask" research, and SANS DFIR guides: an adversary registers a SYSTEM Scheduled Task (generating Security EventID 4698, TaskScheduler EventID 106, and an XML file in C:\\Windows\\System32\\Tasks\\) and then deletes the SD (Security Descriptor) registry value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\ to hide the task from schtasks /query and Task Scheduler GUI.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Admin Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'RPC ITaskSchedulerService', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (Schedule Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Security EID 4698 & Sysmon EID 12', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'TaskCache\\Tree SD Registry Key', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Scheduled Task Registration & XML Artifact Creation (Security EventID 4698 & TaskScheduler 106)',
        narration:
          'The attacker executes schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM. Windows Security EventID 4698 captures the full embedded TaskContent XML, while svchost.exe writes the XML definition to C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1053.005 - Scheduled Task/Job: Scheduled Task)',
        technicalCommands: [
          'schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM',
          'Security EventID 4698: A scheduled task was created (embeds full <Task> XML)',
          'Disk Artifact: C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync',
        ],
        defenseMitigation:
          'Enable Audit Other Object Access Events (Success/Failure) so Windows Security EventID 4698 (Task Created) and EventID 4702 (Task Updated) log the complete XML payload.',
        logs: [
          {
            id: 'dfir-schtasks-1',
            timestamp: '19:04:12.118',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4698,
            ProcessName: 'schtasks.exe',
            CommandLine: 'schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM',
            raw: 'EventID: 4698 | TaskName: \\Microsoft\\Windows\\NetTrace\\TelemetrySync | TaskContent: <Task><Principals><Principal><UserId>S-1-5-18</UserId></Principal></Principals><Actions><Exec><Command>C:\\ProgramData\\sync.exe</Command></Exec></Actions></Task>',
            parsedFields: {
              EventID: '4698 (Security) / 106 (TaskScheduler/Operational)',
              TaskName: '\\Microsoft\\Windows\\NetTrace\\TelemetrySync',
              PrincipalSid: 'S-1-5-18 (NT AUTHORITY\\SYSTEM)',
              ExecCommand: 'C:\\ProgramData\\sync.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Tarrask Evasion — Deleting TaskCache\\Tree SD Value as SYSTEM (Sysmon EventID 12)',
        narration:
          'Following the technique documented by Microsoft MSTIC (Hafnium / Tarrask), the attacker elevates to NT AUTHORITY\\SYSTEM (to satisfy TrustedInstaller/SYSTEM ACLs on the Schedule key) and deletes the "SD" (Security Descriptor) binary value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync and removes the XML file on disk, rendering the task invisible to schtasks /query while keeping it active in TaskCache\\Tasks\\{GUID}.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1564 - Hide Artifacts: Scheduled Task SD Deletion)',
        technicalCommands: [
          'reg.exe delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /v SD /f',
          'del /f /q "C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync"',
          'Sysmon EventID 12: EventType=DeleteValue TargetObject=...\\Schedule\\TaskCache\\Tree\\...\\SD',
        ],
        defenseMitigation:
          'Alert on Sysmon EventID 12 (RegistryObjectAddedOrDeleted) or Security EventID 4657 where TargetObject ends with \\Schedule\\TaskCache\\Tree\\*\\SD and EventType is DeleteValue.',
        logs: [
          {
            id: 'dfir-schtasks-2',
            timestamp: '19:04:16.705',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 12,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /v SD /f',
            raw: 'EventID: 12 | EventType: DeleteValue | ProcessId: 5120 | Image: C:\\Windows\\System32\\reg.exe | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync\\SD',
            parsedFields: {
              EventID: '12 (Sysmon RegistryEvent DeleteValue)',
              TargetObject: 'HKLM\\...\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync\\SD',
              EvasionEffect: 'Hides task from schtasks.exe /query and Taskschd.msc GUI',
              ResidualArtifact: 'HKLM\\...\\Schedule\\TaskCache\\Tasks\\{GUID}\\Actions',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Recovery from TaskCache\\Tasks\\{GUID}\\Actions & TaskScheduler EventID 200',
        narration:
          'Even after the SD value and XML file are deleted, the Task Scheduler service continues executing the task every 15 minutes (logging TaskScheduler EventID 200 Action Started) because the binary Actions blob (starting with 0x0300 magic version header) and DynamicInfo timestamps remain intact under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\{GUID}.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1053.005 - TaskCache\\Tasks\\{GUID} Actions Blob Recovery)',
        technicalCommands: [
          'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\*" | Select-Object URI, Actions, DynamicInfo',
          'TaskScheduler/Operational EventID 200: Task "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" launched action "C:\\ProgramData\\sync.exe"',
        ],
        defenseMitigation:
          'Cross-reference all entries under TaskCache\\Tree against the presence of an SD value and parse the binary Actions value in TaskCache\\Tasks\\{GUID} during incident response.',
        logs: [
          {
            id: 'dfir-schtasks-3',
            timestamp: '19:15:00.008',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'svchost.exe',
            CommandLine: 'C:\\ProgramData\\sync.exe (Launched via hidden TaskCache GUID)',
            raw: 'LogName: Microsoft-Windows-TaskScheduler/Operational | EventID: 200 | TaskName: \\Microsoft\\Windows\\NetTrace\\TelemetrySync | ActionName: C:\\ProgramData\\sync.exe | TaskInstanceId: {91F0C421-3812-4A99-8231-001122334455}',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-TaskScheduler/Operational',
              EventID: '200 (Action Executed)',
              TaskRegistryKey: 'HKLM\\...\\Schedule\\TaskCache\\Tasks\\{91F0C421-3812-4A99-8231-001122334455}',
              BinaryActionsBlob: '03 00 ... C:\\ProgramData\\sync.exe (UTF-16LE)',
            },
          },
        ],
      },
    ],
  };
