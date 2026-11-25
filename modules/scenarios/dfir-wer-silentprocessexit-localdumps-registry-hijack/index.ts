import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-wer-silentprocessexit-localdumps-registry-hijack',
    title: 'Microsoft WER, Mandiant & Elastic DFIR — IFEO SilentProcessExit & WerFault.exe LSASS Dump Hijack (Sysmon EID 12 / 13)',
    category: 'MALWARE',
    mitreId: 'T1546.012',
    description:
      'Grounded in Microsoft Windows Error Reporting (WER) & Image File Execution Options (IFEO) documentation, Mandiant persistence & credential access research, and MITRE ATT&CK T1546.012 / T1003.001: an attacker sets the GlobalFlag (FLG_MONITOR_SILENT_PROCESS_EXIT = 0x200) under IFEO\\lsass.exe and configures HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe with ReportingMode=2 (LOCAL_DUMP) and MonitorProcess, tricking the trusted Windows Error Reporting binary (WerFault.exe) into dumping lsass.exe memory and launching an arbitrary SYSTEM command.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Registry Modification', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IFEO GlobalFlag (0x200)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SilentProcessExit\\lsass.exe', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 12/13 & Application', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'WerFault.exe (Trusted Dumper)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Enabling IFEO FLG_MONITOR_SILENT_PROCESS_EXIT (0x200) on lsass.exe (Sysmon EventID 13)',
        narration:
          'To avoid opening a direct suspicious handle to lsass.exe from an untrusted binary, the attacker configures HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe\\GlobalFlag = 0x00000200 (FLG_MONITOR_SILENT_PROCESS_EXIT). Sysmon EventID 13 logs the exact DWORD modification.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1546.012 - Event Triggered Execution: Image File Execution Options Injection)',
        technicalCommands: [
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe" /v GlobalFlag /t REG_DWORD /d 512 /f',
          'Flag Constant: FLG_MONITOR_SILENT_PROCESS_EXIT = 0x200 (512 decimal)',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 12 and 13 for any key creation or GlobalFlag / Debugger value modification under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\*.',
        logs: [
          {
            id: 'dfir-wer-1',
            timestamp: '03:10:04.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe" /v GlobalFlag /t REG_DWORD /d 512 /f',
            raw: 'EventID: 13 | EventType: SetValue | Image: C:\\Windows\\System32\\reg.exe | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe\\GlobalFlag | Details: DWORD (0x00000200)',
            parsedFields: {
              EventID: '13 (Sysmon Registry Value Set)',
              TargetObject: 'HKLM\\...\\Image File Execution Options\\lsass.exe\\GlobalFlag',
              FlagValue: '0x00000200 (FLG_MONITOR_SILENT_PROCESS_EXIT)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Configuring SilentProcessExit\\lsass.exe LocalDumpFolder, DumpType=2 & MonitorProcess (Sysmon EventID 13)',
        narration:
          'Next, the attacker creates HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe and sets ReportingMode=2 (LAUNCH_NOTIFYPROCESS | LOCAL_DUMP), LocalDumpFolder="C:\\Windows\\Temp\\Dumps", DumpType=2 (Full Memory Minidump), and MonitorProcess="C:\\ProgramData\\beacon.exe".',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - SilentProcessExit LocalDumpFolder & MonitorProcess)',
        technicalCommands: [
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v ReportingMode /t REG_DWORD /d 2 /f',
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v LocalDumpFolder /t REG_SZ /d "C:\\Windows\\Temp\\Dumps" /f',
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v DumpType /t REG_DWORD /d 2 /f',
        ],
        defenseMitigation:
          'Alert on any registry write under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\* or HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting\\LocalDumps\\*.',
        logs: [
          {
            id: 'dfir-wer-2',
            timestamp: '03:10:06.450',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe add "...\\SilentProcessExit\\lsass.exe" /v LocalDumpFolder /d C:\\Windows\\Temp\\Dumps',
            raw: 'EventID: 13 | EventType: SetValue | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe\\LocalDumpFolder | Details: C:\\Windows\\Temp\\Dumps | DumpType: DWORD (0x00000002 Full Dump) | MonitorProcess: C:\\ProgramData\\beacon.exe',
            parsedFields: {
              EventID: '13 (Sysmon Registry Value Set)',
              RegistryKey: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe',
              LocalDumpFolder: 'C:\\Windows\\Temp\\Dumps',
              DumpType: '0x2 (MiniDumpWithFullMemory)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Triggering RtlReportSilentProcessExit & WerFault.exe Full LSASS Dump (Application EventID 3001)',
        narration:
          'The attacker calls ntdll.dll!RtlReportSilentProcessExit(hLsass, 0) (which only requires PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ or is triggered via CreateRemoteThread/NtTerminateProcess on a helper). The Windows Error Reporting service spawns the Microsoft-signed C:\\Windows\\System32\\WerFault.exe, which dumps lsass.exe-(PID).dmp into C:\\Windows\\Temp\\Dumps, spawns MonitorProcess, and logs Application EventID 3001 (Source: Winlogon / SilentProcessExit).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - Trusted WerFault.exe Proxy Dumping LSASS)',
        technicalCommands: [
          'ntdll!RtlReportSilentProcessExit(hProcess, 0) -> LPC message to WerSvcGroup',
          'Sysmon EventID 10: SourceImage=C:\\Windows\\System32\\WerFault.exe TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF',
          'Sysmon EventID 11: Image=C:\\Windows\\System32\\WerFault.exe TargetFilename=C:\\Windows\\Temp\\Dumps\\lsass.exe-(684).dmp',
        ],
        defenseMitigation:
          'Do not blindly exclude WerFault.exe or wermgr.exe from Sysmon EventID 10 (TargetImage=lsass.exe) or EventID 11 (*.dmp creation); correlate WerFault.exe LSASS access against SilentProcessExit registry keys.',
        logs: [
          {
            id: 'dfir-wer-3',
            timestamp: '03:10:09.812',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'WerFault.exe',
            CommandLine: 'C:\\Windows\\System32\\WerFault.exe -u -p 684 -s 1420 (Dumping lsass.exe via SilentProcessExit)',
            raw: 'EventID: 10 | SourceImage: C:\\Windows\\System32\\WerFault.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | GrantedAccess: 0x1fffff | Correlated EventID 11: TargetFilename=C:\\Windows\\Temp\\Dumps\\lsass.exe-684.dmp | Application EventID 3001: Silent Process Exit monitored for lsass.exe',
            parsedFields: {
              EventID: '10 (ProcessAccess) + 11 (FileCreate) + 3001 (Application Log)',
              ProxyBinary: 'C:\\Windows\\System32\\WerFault.exe (Microsoft Signed)',
              TargetProcess: 'C:\\Windows\\System32\\lsass.exe',
              CreatedDumpFile: 'C:\\Windows\\Temp\\Dumps\\lsass.exe-684.dmp',
            },
          },
        ],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-wer-silentprocessexit-localdumps-registry-hijack',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for Microsoft WER, Mandiant & Elastic DFIR, IFEO SilentProcessExit & WerFault.exe LSASS Dump Hijack (Sysmon EID 12 / 13)',
          storyAnalogy: 'Imagine an intruder who wants a complete photograph of the central credential guardroom without ever opening a suspicious camera lens directly at the guardroom door. Instead, the intruder flips two official diagnostic switches on the building’s built-in crash-inspector board—the first switch enables silent-exit monitoring for the guardroom and the second switch aims the crash-inspector dump tray at a private drop folder—so the Error Reporting clerk politely photographs the entire guardroom memory whenever a silent-exit bell is rung.',
          storyMappings: [
              {
                  storyTerm: 'First diagnostic switch (silent-exit monitoring)',
                  technicalTerm: 'IFEO GlobalFlag set to FLG_MONITOR_SILENT_PROCESS_EXIT (0x200) on lsass.exe',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Second diagnostic switch (crash-inspector dump tray)',
                  technicalTerm: 'SilentProcessExit\\lsass.exe ReportingMode=2, DumpType=2, and LocalDumpFolder',
                  tone: 'sky',
                },
              {
                  storyTerm: 'Ringing the silent-exit bell so the official clerk photographs memory',
                  technicalTerm: 'Calling RtlReportSilentProcessExit causing signed WerFault.exe to dump full LSASS RAM',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Catching the registry trap before the bell even rings',
                  technicalTerm: 'Sysmon EventID 13 alerting on IFEO and SilentProcessExit registry writes for lsass.exe',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'In this scenario (T1546.012, Microsoft WER, Mandiant & Elastic DFIR - IFEO SilentProcessExit & WerFault.exe LSASS Dump Hijack (Sysmon EID 12 / 13)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: enabling IFEO (FLG_MONITOR_SILENT_PROCESS_EXIT), then configuring SilentProcessExit\\lsass.exe (LAUNCH_NOTIFYPROCESS | LOCAL_DUMP), then triggering RtlReportSilentProcessExit (Source: Winlogon / SilentProcessExit). Steps #1–#3 walk that chain end-to-end by covering Enabling IFEO (FLG_MONITOR_SILENT_PROCESS_EXIT), then Configuring SilentProcessExit\\lsass.exe (LAUNCH_NOTIFYPROCESS | LOCAL_DUMP), then Triggering RtlReportSilentProcessExit (Source: Winlogon / SilentProcessExit). Primary detection correlates Sysmon Event 13 with the documented host and network chain.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Attacker Registry Modification), Node ② (IFEO GlobalFlag , 0x200), Node ③ (SilentProcessExit\\lsass.exe), Node ④ (Runtime Process & Artifact Context), Node ⑤ (WerFault.exe , Trusted Dumper), and Node ⑥ (Sysmon EID 12/13 & Application) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Official Vendor & CERT DFIR Documentation (T1546.012) · Microsoft WER, Mandiant & Elastic DFIR, IFEO SilentProcessExit & WerFault.exe LSASS Dump Hijack (Sysmon EID 12 / 13)',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1546.012',
              plainTitle: 'Enabling IFEO FLG_MONITOR_SILENT_PROCESS_EXIT (0x200) on lsass.exe (Sysmon EventID 13)',
              storyAnalogy: 'Walking up to the system debugging switchboard, the intruder flips on the special silent-exit watch flag specifically targeting the credential guardroom so the operating system watches for exit notifications on that process.',
              simpleExplanation: 'To avoid opening a direct suspicious handle to lsass.exe from an untrusted binary, the attacker configures HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe\\GlobalFlag = 0x00000200 (FLG_MONITOR_SILENT_PROCESS_EXIT). Sysmon EventID 13 logs the exact DWORD modification (logged in Sysmon Event 13 with EventID=13 , Sysmon Registry Value Set, TargetObject=HKLM\\...\\Image File Execution Options\\lsass.exe\\GlobalFlag, FlagValue=0x00000200 , FLG_MONITOR_SILENT_PROCESS_EXIT so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe" /v GlobalFlag /t REG_DWORD /d 512 /f (which Modifies or queries Windows Registry keys and values , reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\ so that manipulates persistent Windows Registry configuration or credential material , T1546.012 during "Enabling IFEO FLG_MONITOR_SILENT_PROCESS_EXIT , 0x200 on lsass.exe , Sysmon EventID 13" to establish persistence, alter system behavior, or harvest secrets). Next, the follow-up artifact Flag Constant: FLG_MONITOR_SILENT_PROCESS_EXIT = 0x200 (512 decimal) runs (which executes the technical command / telemetry directive , Flag Constant: FLG_MONITOR_SILENT_PROCESS_EXIT = 0x200 , 512 decimal via System / Runtime Ex so that advances the scenario kill-chain under MITRE T1546.012 during "Enabling IFEO FLG_MONITOR_SILENT_PROCESS_EXIT , 0x200 on lsass.exe , Sysmon EventID 13" , To avoid opening a direct suspicious handle to lsass while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Attacker Registry Modification and IFEO GlobalFlag , 0x200 toward SilentProcessExit\\lsass.exe and Sysmon EID 12/13 & Application.',
              detectionAndEvidence: 'Documented in Sysmon Event 13 (recording EventID=13 , Sysmon Registry Value Set, TargetObject=HKLM\\...\\Image File Execution Options\\lsass.exe\\GlobalFlag, FlagValue=0x00000200 , FLG_MONITOR_SILENT_PROCESS_EXIT under T1546.012): Monitor Sysmon EventID 12 and 13 for any key creation or GlobalFlag / Debugger value modification under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\*.',
              storyMappings: [
                  {
                      storyTerm: 'System debugging switchboard',
                      technicalTerm: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Special silent-exit watch flag',
                      technicalTerm: 'GlobalFlag DWORD set to 0x200 (FLG_MONITOR_SILENT_PROCESS_EXIT)',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Registry guard noticing tampering on a crown-jewel process',
                      technicalTerm: 'Sysmon EventID 13 alerting on IFEO GlobalFlag modification targeting lsass.exe',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Setting up an indirect official dump mechanism',
                      technicalTerm: 'Enabling Windows Error Reporting silent-exit hooking without killing lsass.exe',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1003.001',
              plainTitle: 'Configuring SilentProcessExit\\lsass.exe LocalDumpFolder, DumpType=2 & MonitorProcess (Sysmon EventID 13)',
              storyAnalogy: 'Next, on the companion Silent Process Exit panel, the intruder specifies Full-Memory Photograph mode and types in their own local drop folder so the official crash clerk knows exactly how much to capture and where to place the file.',
              simpleExplanation: 'Next, the attacker creates HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe and sets ReportingMode=2 (LAUNCH_NOTIFYPROCESS | LOCAL_DUMP), LocalDumpFolder="C:\\Windows\\Temp\\Dumps", DumpType=2 (Full Memory Minidump), and MonitorProcess="C:\\ProgramData\\beacon.exe" (logged in Sysmon Event 13 with EventID=13 , Sysmon Registry Value Set, RegistryKey=HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe, LocalDumpFolder=C:\\Windows\\Temp\\Dumps, DumpType=0x2 , MiniDumpWithFullMemory so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v ReportingMode /t REG_DWORD /d 2 /f (which Modifies or queries Windows Registry keys and values , reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" so that manipulates persistent Windows Registry configuration or credential material , T1003.001 during "Configuring SilentProcessExit\\lsass.exe LocalDumpFolder, DumpType=2 & MonitorProcess , Sysmon EventID 13" to establish persistence, alter system behavior, or harvest secrets). Next, the follow-up artifact reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v LocalDumpFolder /t REG_SZ /d "C:\\Windows\\Temp\\Dumps" /f runs (which Modifies or queries Windows Registry keys and values , reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" so that manipulates persistent Windows Registry configuration or credential material , T1003.001 during "Configuring SilentProcessExit\\lsass.exe LocalDumpFolder, DumpType=2 & MonitorProcess , Sysmon EventID 13" to establish persistence, alter system behavior, or harvest secrets).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Attacker Registry Modification and IFEO GlobalFlag , 0x200 toward SilentProcessExit\\lsass.exe and Sysmon EID 12/13 & Application.',
              detectionAndEvidence: 'Documented in Sysmon Event 13 (recording EventID=13 , Sysmon Registry Value Set, RegistryKey=HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe, LocalDumpFolder=C:\\Windows\\Temp\\Dumps, DumpType=0x2 , MiniDumpWithFullMemory under T1003.001): Alert on any registry write under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\* or HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting\\LocalDumps\\*.',
              storyMappings: [
                  {
                      storyTerm: 'Companion Silent Process Exit panel',
                      technicalTerm: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Specifying Full-Memory Photograph mode',
                      technicalTerm: 'ReportingMode=2 (Local Dump) and DumpType=2 (MiniDumpWithFullMemory)',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Typing in a custom local drop folder',
                      technicalTerm: 'LocalDumpFolder pointing to an attacker-accessible staging directory (e.g., C:\\Temp)',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Persistent registry evidence left behind',
                      technicalTerm: 'Unusual SilentProcessExit\\lsass.exe subkeys flagged during live triage or hive forensics',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1003.001',
              plainTitle: 'Triggering RtlReportSilentProcessExit & WerFault.exe Full LSASS Dump (Application EventID 3001)',
              storyAnalogy: 'Finally, the intruder taps the undocumented silent-exit chime inside a tiny helper tool. Hearing the chime, the signed error-reporting clerk itself marches over, dumps the entire live credential vault memory cleanly into the attacker folder, and leaves the vault guard running completely undisturbed.',
              simpleExplanation: 'The attacker calls ntdll.dll!RtlReportSilentProcessExit(hLsass, 0) (which only requires PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ or is triggered via CreateRemoteThread/NtTerminateProcess on a helper). The Windows Error Reporting service spawns the Microsoft-signed C:\\Windows\\System32\\WerFault.exe, which dumps lsass.exe-(PID).dmp into C:\\Windows\\Temp\\Dumps, spawns MonitorProcess, and logs Application EventID 3001 (Source: Winlogon / SilentProcessExit) (logged in Sysmon Event 10 with EventID=10 , ProcessAccess + 11 , FileCreate + 3001 , Application Log, ProxyBinary=C:\\Windows\\System32\\WerFault.exe , Microsoft Signed, TargetProcess=C:\\Windows\\System32\\lsass.exe, CreatedDumpFile=C:\\Windows\\Temp\\Dumps\\lsass.exe-684.dmp so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes ntdll!RtlReportSilentProcessExit(hProcess, 0) -> LPC message to WerSvcGroup (which executes the technical command / telemetry directive , ntdll!RtlReportSilentProcessExit, hProcess, 0 -> LPC message to WerSvcGroup via System / Run so that advances the scenario kill-chain under MITRE T1003.001 during "Triggering RtlReportSilentProcessExit & WerFault.exe Full LSASS Dump , Application EventID 3001" , The attacker calls ntdll while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact Sysmon EventID 10: SourceImage=C:\\Windows\\System32\\WerFault.exe TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF runs (which invokes or targets the host daemon/process , Sysmon EventID 10: SourceImage=C:\\Windows\\System32\\WerFault.exe TargetImage=C:\\Windows\\System32\\lsass. so that advances the scenario kill-chain under MITRE T1003.001 during "Triggering RtlReportSilentProcessExit & WerFault.exe Full LSASS Dump , Application EventID 3001" , The attacker calls ntdll while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Attacker Registry Modification and IFEO GlobalFlag , 0x200 toward SilentProcessExit\\lsass.exe and Sysmon EID 12/13 & Application.',
              detectionAndEvidence: 'Documented in Sysmon Event 10 (recording EventID=10 , ProcessAccess + 11 , FileCreate + 3001 , Application Log, ProxyBinary=C:\\Windows\\System32\\WerFault.exe , Microsoft Signed, TargetProcess=C:\\Windows\\System32\\lsass.exe, CreatedDumpFile=C:\\Windows\\Temp\\Dumps\\lsass.exe-684.dmp under T1003.001): Do not blindly exclude WerFault.exe or wermgr.exe from Sysmon EventID 10 (TargetImage=lsass.exe) or EventID 11 (*.dmp creation); correlate WerFault.exe LSASS access against SilentProcessExit registry keys.',
              storyMappings: [
                  {
                      storyTerm: 'Tapping the undocumented silent-exit chime',
                      technicalTerm: 'Invoking ntdll!RtlReportSilentProcessExit against a handle to lsass.exe',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Signed Error Reporting clerk capturing full memory',
                      technicalTerm: 'Legitimate C:\\Windows\\System32\\WerFault.exe writing a full lsass.exe.dmp file',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Bypassing naive non-signed-binary LSASS dump rules',
                      technicalTerm: 'Delegating OpenProcess + MiniDumpWriteDump to Microsoft-signed WerFault.exe',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Catching the indirect dump cleanly',
                      technicalTerm: 'Alerting on WerFault.exe writing lsass*.dmp files outside standard WER crash queues',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who wants a complete photograph of the central credential guardroom without ever opening a suspicious camera lens directly at the guardroom door. Instead, the intruder flips two official diagnostic switches on the building own built-in crash-inspector board—the first switch turns on silent-exit monitoring for the guardroom and the second switch directs the full-memory photograph straight into the intruder drop folder—so the operating system Error Reporting clerk itself politely photographs the entire guardroom memory whenever a silent-exit bell is rung.',
      storyMappings: [
        {
          storyTerm: 'First Diagnostic Switch (Silent-Exit Monitor)',
          technicalTerm: 'IFEO GlobalFlag set to FLG_MONITOR_SILENT_PROCESS_EXIT (0x200) on lsass.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Second Diagnostic Switch (Dump Folder Target)',
          technicalTerm: 'SilentProcessExit\\lsass.exe ReportingMode=2, DumpType=2, and LocalDumpFolder',
          tone: 'sky',
        },
        {
          storyTerm: 'Ringing the silent-exit bell so the official clerk photographs memory',
          technicalTerm: 'Calling RtlReportSilentProcessExit causing signed WerFault.exe to dump full LSASS RAM',
          tone: 'rose',
        },
        {
          storyTerm: 'Catching the registry trap before the bell even rings',
          technicalTerm: 'Sysmon EventID 13 alerting on IFEO and SilentProcessExit registry writes for lsass.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the system debugging switchboard, the intruder flips on the special silent-exit watch flag specifically targeting the credential guardroom so the operating system watches for exit notifications on that process.',
        storyMappings: [
          {
            storyTerm: 'System debugging switchboard',
            technicalTerm: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Special silent-exit watch flag',
            technicalTerm: 'GlobalFlag DWORD set to 0x200 (FLG_MONITOR_SILENT_PROCESS_EXIT)',
            tone: 'sky',
          },
          {
            storyTerm: 'Registry guard noticing tampering on a crown-jewel process',
            technicalTerm: 'Sysmon EventID 13 alerting on IFEO GlobalFlag modification targeting lsass.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Setting up an indirect official dump mechanism',
            technicalTerm: 'Enabling Windows Error Reporting silent-exit hooking without killing lsass.exe',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, on the companion Silent Process Exit panel, the intruder specifies Full-Memory Photograph mode and types in their own local drop folder so the official crash clerk knows exactly how much to capture and where to place the file.',
        storyMappings: [
          {
            storyTerm: 'Companion Silent Process Exit panel',
            technicalTerm: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Specifying Full-Memory Photograph mode',
            technicalTerm: 'ReportingMode=2 (Local Dump) and DumpType=2 (MiniDumpWithFullMemory)',
            tone: 'sky',
          },
          {
            storyTerm: 'Typing in a custom local drop folder',
            technicalTerm: 'LocalDumpFolder pointing to an attacker-accessible staging directory (e.g., C:\\Temp)',
            tone: 'rose',
          },
          {
            storyTerm: 'Persistent registry evidence left behind',
            technicalTerm: 'Unusual SilentProcessExit\\lsass.exe subkeys flagged during live triage or hive forensics',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, the intruder taps the undocumented silent-exit chime inside a tiny helper tool. Hearing the chime, the signed error-reporting clerk itself marches over, dumps the entire live credential vault memory cleanly into the attacker folder, and leaves the vault guard running completely undisturbed.',
        storyMappings: [
          {
            storyTerm: 'Tapping the undocumented silent-exit chime',
            technicalTerm: 'Invoking ntdll!RtlReportSilentProcessExit against a handle to lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Signed Error Reporting clerk capturing full memory',
            technicalTerm: 'Legitimate C:\\Windows\\System32\\WerFault.exe writing a full lsass.exe.dmp file',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing naive non-signed-binary LSASS dump rules',
            technicalTerm: 'Delegating OpenProcess + MiniDumpWriteDump to Microsoft-signed WerFault.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Catching the indirect dump cleanly',
            technicalTerm: 'Alerting on WerFault.exe writing lsass*.dmp files outside standard WER crash queues',
            tone: 'emerald',
          },
        ],
      },
    },
  };
