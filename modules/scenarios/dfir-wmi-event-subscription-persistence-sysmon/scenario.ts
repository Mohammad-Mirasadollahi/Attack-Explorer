import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-wmi-event-subscription-persistence-sysmon',
    title: 'Microsoft Sysmon & Mandiant DFIR — WMI Permanent Event Subscription Persistence (EventID 19 / 20 / 21)',
    category: 'MALWARE',
    mitreId: 'T1546.003',
    description:
      'Grounded in Microsoft Sysinternals Sysmon v15 documentation (Event IDs 19, 20, 21), Mandiant WMI forensics research, and MITRE ATT&CK T1546.003: an adversary registers a permanent WMI Event Subscription in the root\\subscription namespace consisting of an __EventFilter, a CommandLineEventConsumer, and a __FilterToConsumerBinding stored inside C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA so scrcons.exe or wmiprvse.exe executes a payload as SYSTEM.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Elevated PowerShell Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Winmgmt / WMI Core Service', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'OBJECTS.DATA CIM Repository', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 19/20/21 & WMI Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'scrcons.exe / wmiprvse.exe', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: WMI __EventFilter WQL Trigger Registration (Sysmon EventID 19)',
        narration:
          'Using PowerShell Set-WmiInstance or mofcomp.exe, the attacker creates a permanent __EventFilter instance in the root\\subscription CIM namespace with a WQL polling query (SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA "Win32_PerfFormattedData_PerfOS_System"). Sysmon EventID 19 (WmiEventFilter activity detected) logs the exact Query and EventNamespace.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1546.003 - Windows Management Instrumentation Event Subscription)',
        technicalCommands: [
          'Set-WmiInstance -Namespace root\\subscription -Class __EventFilter -Arguments @{Name="SCMUpdaterFilter"; EventNamespace="root\\cimv2"; QueryLanguage="WQL"; Query="SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA \'Win32_PerfFormattedData_PerfOS_System\'"}',
          'Sysmon EventID 19: Operation=Created EventNamespace=root\\cimv2 Name=SCMUpdaterFilter',
        ],
        defenseMitigation:
          'Configure Sysmon to log EventID 19 (WmiEventFilter), EventID 20 (WmiEventConsumer), and EventID 21 (WmiEventConsumerToFilter) and monitor Microsoft-Windows-WMI-Activity/Operational EventID 5861.',
        logs: [
          {
            id: 'dfir-wmi-1',
            timestamp: '04:15:10.120',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 19,
            ProcessName: 'powershell.exe',
            CommandLine: 'Set-WmiInstance -Namespace root\\subscription -Class __EventFilter -Name SCMUpdaterFilter',
            raw: 'EventID: 19 | EventType: WmiFilterEvent | Operation: Created | User: CORP\\admin_ops | EventNamespace: root\\cimv2 | Name: SCMUpdaterFilter | Query: SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA "Win32_PerfFormattedData_PerfOS_System"',
            parsedFields: {
              EventID: '19 (Sysmon WmiEventFilter)',
              Namespace: 'root\\subscription',
              FilterName: 'SCMUpdaterFilter',
              WqlQuery: 'SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA Win32_PerfFormattedData_PerfOS_System',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CommandLineEventConsumer & __FilterToConsumerBinding Persistence in OBJECTS.DATA (Sysmon EventID 20 & 21)',
        narration:
          'The attacker creates a CommandLineEventConsumer specifying the payload command line (Sysmon EventID 20) and binds it to SCMUpdaterFilter via __FilterToConsumerBinding (Sysmon EventID 21 and WMI-Activity EventID 5861). Both objects are serialized into C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1546.003 - CIM Repository OBJECTS.DATA Serialization)',
        technicalCommands: [
          'Set-WmiInstance -Namespace root\\subscription -Class CommandLineEventConsumer -Arguments @{Name="SCMUpdaterConsumer"; CommandLineTemplate="powershell.exe -NoP -W Hidden -Enc JABjAD0..."}',
          'Set-WmiInstance -Namespace root\\subscription -Class __FilterToConsumerBinding -Arguments @{Filter=$Filter; Consumer=$Consumer}',
          'CIM Artifact: C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA',
        ],
        defenseMitigation:
          'Inspect Microsoft-Windows-WMI-Activity/Operational EventID 5861 for permanent consumer bindings and parse offline OBJECTS.DATA during DFIR triage using PyWMIPersistenceFinder.',
        logs: [
          {
            id: 'dfir-wmi-2',
            timestamp: '04:15:12.480',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 20,
            ProcessName: 'wmiprvse.exe',
            CommandLine: 'CommandLineEventConsumer Destination="powershell.exe -NoP -W Hidden -Enc JABjAD0..."',
            raw: 'EventID: 20 | EventType: WmiConsumerEvent | Operation: Created | Name: SCMUpdaterConsumer | Type: Command Line | Destination: powershell.exe -NoP -W Hidden -Enc JABjAD0... | Correlated EventID 21 & WMI-Activity EID 5861: Consumer="CommandLineEventConsumer.Name=\\"SCMUpdaterConsumer\\"" Filter="__EventFilter.Name=\\"SCMUpdaterFilter\\""',
            parsedFields: {
              EventID: '20 (WmiEventConsumer) / 21 (WmiConsumerToFilter) / 5861 (WMI-Activity)',
              ConsumerName: 'SCMUpdaterConsumer',
              DestinationCommand: 'powershell.exe -NoP -W Hidden -Enc JABjAD0...',
              DiskRepository: 'C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM Payload Execution Under wmiprvse.exe / scrcons.exe Parentage (Sysmon EventID 1)',
        narration:
          'When the WQL timer condition evaluates to true, the WMI Provider Host (wmiprvse.exe) or WMI Standard Event Consumer (scrcons.exe) spawns the configured CommandLineTemplate as NT AUTHORITY\\SYSTEM, creating a telltale parent-child process anomaly in Sysmon EventID 1.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1047 - Windows Management Instrumentation)',
        technicalCommands: [
          'ParentImage: C:\\Windows\\System32\\wbem\\scrcons.exe (or wmiprvse.exe)',
          'Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoP -W Hidden -Enc JABjAD0...',
          'Get-WmiObject -Namespace root\\subscription -Class __FilterToConsumerBinding | Remove-WmiObject',
        ],
        defenseMitigation:
          'Alert on any child process (powershell.exe, cmd.exe, mshta.exe, wscript.exe, rundll32.exe) spawned by C:\\Windows\\System32\\wbem\\scrcons.exe.',
        logs: [
          {
            id: 'dfir-wmi-3',
            timestamp: '04:16:00.015',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'scrcons.exe',
            CommandLine: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoP -W Hidden -Enc JABjAD0...',
            raw: 'EventID: 1 | User: NT AUTHORITY\\SYSTEM | ParentImage: C:\\Windows\\System32\\wbem\\scrcons.exe | Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | CommandLine: powershell.exe -NoP -W Hidden -Enc JABjAD0...',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              ParentImage: 'C:\\Windows\\System32\\wbem\\scrcons.exe',
              ChildImage: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
              UserContext: 'NT AUTHORITY\\SYSTEM',
            },
          },
        ],
      },
    ],
  };
