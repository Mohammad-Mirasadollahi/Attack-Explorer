import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-printspooler-spl-shd-spool-file-persistence',
    title: 'Microsoft Print Spooler, Kaspersky & MITRE DFIR — Print Spooler Port Monitor & .SPL/.SHD Spool Forensics (EID 307 / 808)',
    category: 'MALWARE',
    mitreId: 'T1547.012',
    description:
      'Grounded in Microsoft PrintService Operational Logging specifications, Kaspersky Print Spooler exploitation research, and MITRE ATT&CK T1547.012: an attacker abuses the Windows Print Spooler service (spoolsv.exe running as SYSTEM) via AddMonitor / Point-and-Print driver loading or persistent Port Monitor registration, leaving forensic traces in Microsoft-Windows-PrintService/Operational EventID 316 / 808, HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors, and C:\\Windows\\System32\\spool\\PRINTERS\\*.SHD / *.SPL files.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker RPC AddMonitor Call', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MS-RPRN \\pipe\\spoolss RPC', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'spoolsv.exe (NT AUTHORITY\\SYSTEM)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'PrintService EID 316/808 & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Print\\Monitors & spool\\PRINTERS', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MS-RPRN / MS-PAR RPC Bind to \\pipe\\spoolss & Spool File Drop (.SPL / .SHD)',
        narration:
          'The attacker binds to the Print System Remote Protocol (MS-RPRN UUID 12345678-1234-abcd-ef00-0123456789ab over \\pipe\\spoolss) or drops a malicious DLL via a print job into C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SPL alongside its shadow metadata file FP00001.SHD (which stores the submitting User SID, computer name, printer name, and timestamp at offset 0x00 in SHD_HEADER).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1547.012 - Boot or Logon Autostart Execution: Print Processors)',
        technicalCommands: [
          'RPC Interface: MS-RPRN (12345678-1234-abcd-ef00-0123456789ab) over \\pipe\\spoolss',
          'Spool Artifact 1: C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SPL (Raw payload stream)',
          'Spool Artifact 2: C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SHD (Shadow header magic 0x00004968 Win10/11)',
        ],
        defenseMitigation:
          'Disable the Print Spooler service (Stop-Service Spooler; Set-Service Spooler -StartupType Disabled) on all Domain Controllers and servers that do not actively host print queues.',
        logs: [
          {
            id: 'dfir-spool-1',
            timestamp: '06:18:11.090',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'spoolsv.exe',
            CommandLine: 'C:\\Windows\\System32\\spoolsv.exe writing FP00001.SHD and FP00001.SPL',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\spoolsv.exe | TargetFilename: C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SHD | HeaderSignature: 68490000 (SHD_HEADER_WIN2003_WIN10)',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              SpoolShadowFile: 'C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SHD',
              SpoolDataFile: 'C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SPL',
              ShdMagicSignature: '0x00004968 (Records Submitting User & Machine Name)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Port Monitor Registration via AddMonitor & PrintService EventID 316 / 808',
        narration:
          'The attacker invokes winspool.drv!AddMonitorW (or RpcAddMonitor) to register evilmon.dll as a Print Port Monitor. This creates HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver="evilmon.dll" (Sysmon EventID 13) and logs Microsoft-Windows-PrintService/Operational EventID 316 (Printer driver added) and EventID 808 (Failed/Untrusted plug-in module load in spoolsv.exe).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1547.012 - Print Port Monitor Registry & EventID 808)',
        technicalCommands: [
          'AddMonitorW(NULL, 2, &monitorInfo2) -> Registers Driver="evilmon.dll"',
          'Registry Key: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver',
          'Microsoft-Windows-PrintService/Operational EventID 808 & 316',
        ],
        defenseMitigation:
          'Enable the Microsoft-Windows-PrintService/Operational event log (which is disabled by default on Windows) and alert on EventID 316, EventID 808, and Sysmon EventID 13 modifications under Control\\Print\\Monitors or Control\\Print\\Environments\\*\\Print Processors.',
        logs: [
          {
            id: 'dfir-spool-2',
            timestamp: '06:18:12.405',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 808,
            ProcessName: 'spoolsv.exe',
            CommandLine: 'spoolsv.exe loading C:\\Windows\\System32\\evilmon.dll via Control\\Print\\Monitors\\EvilMonitor',
            raw: 'LogName: Microsoft-Windows-PrintService/Operational | EventID: 808 | PluginDllName: C:\\Windows\\System32\\evilmon.dll | Correlated Sysmon EventID 13: TargetObject=HKLM\\System\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver Details=evilmon.dll',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-PrintService/Operational',
              EventID: '808 (Spooler Plug-in Load) / 316 (Driver Added)',
              RegistryPersistenceKey: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver',
              LoadedModule: 'C:\\Windows\\System32\\evilmon.dll',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM DLL Load in spoolsv.exe (Sysmon EventID 7) & Child Shell Execution (Sysmon EventID 1)',
        narration:
          'Immediately upon AddMonitorW or on every subsequent OS boot, C:\\Windows\\System32\\spoolsv.exe (running as NT AUTHORITY\\SYSTEM) loads C:\\Windows\\System32\\evilmon.dll (Sysmon EventID 7 ImageLoaded) and invokes InitializePrintMonitor2, spawning a SYSTEM child process under spoolsv.exe.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1547.012 - spoolsv.exe ImageLoad & SYSTEM Child Process)',
        technicalCommands: [
          'Sysmon EventID 7 (ImageLoaded): Image=C:\\Windows\\System32\\spoolsv.exe ImageLoaded=C:\\Windows\\System32\\evilmon.dll Signed=false',
          'Sysmon EventID 1 (ProcessCreate): ParentImage=C:\\Windows\\System32\\spoolsv.exe -> Image=C:\\Windows\\System32\\cmd.exe (NT AUTHORITY\\SYSTEM)',
        ],
        defenseMitigation:
          'Alert on any unsigned DLL loaded by spoolsv.exe (Sysmon EventID 7) and any interactive shell (cmd.exe, powershell.exe, rundll32.exe) with ParentImage=C:\\Windows\\System32\\spoolsv.exe.',
        logs: [
          {
            id: 'dfir-spool-3',
            timestamp: '06:18:12.912',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'spoolsv.exe',
            CommandLine: 'C:\\Windows\\System32\\spoolsv.exe loading unsigned evilmon.dll & spawning cmd.exe',
            raw: 'EventID: 7 | Image: C:\\Windows\\System32\\spoolsv.exe | ImageLoaded: C:\\Windows\\System32\\evilmon.dll | Signed: false | Correlated EventID 1: ParentImage=C:\\Windows\\System32\\spoolsv.exe Image=C:\\Windows\\System32\\cmd.exe User=NT AUTHORITY\\SYSTEM',
            parsedFields: {
              EventID: '7 (Sysmon ImageLoaded) / 1 (Sysmon ProcessCreate)',
              HostProcess: 'C:\\Windows\\System32\\spoolsv.exe (NT AUTHORITY\\SYSTEM)',
              UnsignedModule: 'C:\\Windows\\System32\\evilmon.dll',
              ExportEntryPoint: 'InitializePrintMonitor2',
            },
          },
        ],
      },
    ],
  };
