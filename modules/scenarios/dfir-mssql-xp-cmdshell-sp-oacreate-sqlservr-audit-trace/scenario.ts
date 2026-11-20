import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace',
    title: 'Microsoft SQL Server Security & Mandiant DFIR — MSSQL xp_cmdshell / Ole Automation Reconfiguration (EventID 15457) & sqlservr.exe Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1505.001',
    description:
      'Grounded in Microsoft SQL Server Security & Error Log documentation, Mandiant database intrusion forensics, and MITRE ATT&CK T1505.001 / T1059.003: an attacker authenticates to Microsoft SQL Server (TCP 1433) or exploits SQL injection, runs sp_configure to enable "xp_cmdshell" or "Ole Automation Procedures" (generating Windows Application EventID 15457 and SQL ERRORLOG entries), and executes OS commands that spawn cmd.exe under sqlservr.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'TDS Client (:1433 SQL)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Tabular Data Stream (TDS)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'sqlservr.exe (MSSQLSERVER)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Application EID 15457 & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'xplog70.dll / odsole70.dll', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: sp_configure Reconfiguration of show advanced options & xp_cmdshell (Application EventID 15457)',
        narration:
          'Because xp_cmdshell and Ole Automation Procedures are disabled by default (value 0), the attacker executes sp_configure "show advanced options", 1; RECONFIGURE; followed by sp_configure "xp_cmdshell", 1; RECONFIGURE;. SQL Server immediately writes EventID 15457 (Source: MSSQLSERVER) to the Windows Application Event Log and the SQL Server ERRORLOG ("Configuration option \'xp_cmdshell\' changed from 0 to 1").',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Execution (T1059.003 - MSSQL sp_configure Option Reconfiguration)',
        technicalCommands: [
          'T-SQL: EXEC sp_configure \'show advanced options\', 1; RECONFIGURE; EXEC sp_configure \'xp_cmdshell\', 1; RECONFIGURE;',
          'Application EventID 15457 (MSSQLSERVER): Configuration option \'xp_cmdshell\' changed from 0 to 1.',
        ],
        defenseMitigation:
          'Forward Windows Application EventLog EventID 15457 (Source: MSSQLSERVER) to the SIEM and alert whenever xp_cmdshell, Ole Automation Procedures, or clr enabled changes from 0 to 1.',
        logs: [
          {
            id: 'dfir-mssql-1',
            timestamp: '13:40:02.110',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 15457,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'MSSQLSERVER EventID 15457: Configuration option xp_cmdshell changed from 0 to 1',
            raw: 'LogName: Application | Source: MSSQLSERVER | EventID: 15457 | Level: Information | Description: Configuration option \'xp_cmdshell\' changed from 0 to 1. Run the RECONFIGURE statement to install.',
            parsedFields: {
              LogChannel: 'Application (Source: MSSQLSERVER) & SQL ERRORLOG',
              EventID: '15457 (Configuration Option Changed)',
              ConfigurationOption: 'xp_cmdshell (0 -> 1)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: xplog70.dll / odsole70.dll Module Load & sqlservr.exe Child Shell Execution (Sysmon EventID 1 & 7)',
        narration:
          'When the attacker invokes EXEC master..xp_cmdshell (or sp_OACreate "WScript.Shell"), sqlservr.exe loads C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll, Sysmon EventID 7) and spawns cmd.exe /c ... under the SQL Server service account (NT Service\\MSSQLSERVER, Sysmon EventID 1).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.003 - sqlservr.exe -> cmd.exe Parent-Child Anomaly)',
        technicalCommands: [
          'Sysmon EventID 7: Image=sqlservr.exe ImageLoaded=...\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll)',
          'Sysmon EventID 1: ParentImage=C:\\Program Files\\Microsoft SQL Server\\...\\sqlservr.exe -> Image=C:\\Windows\\System32\\cmd.exe',
        ],
        defenseMitigation:
          'Run SQL Server under a least-privilege Managed Service Account (gMSA) rather than LocalSystem/Domain Admin, and alert on any child process (cmd.exe, powershell.exe) spawned by sqlservr.exe.',
        logs: [
          {
            id: 'dfir-mssql-2',
            timestamp: '13:40:05.480',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'cmd.exe /c "whoami /all & net group \"Domain Admins\" /domain"',
            raw: 'EventID: 1 | User: NT SERVICE\\MSSQLSERVER | ParentImage: C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\sqlservr.exe | Image: C:\\Windows\\System32\\cmd.exe | Correlated EventID 7: ImageLoaded=xplog70.dll',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate) + 7 (ImageLoaded xplog70.dll)',
              ParentImage: 'sqlservr.exe',
              ChildImage: 'C:\\Windows\\System32\\cmd.exe',
              ServiceAccount: 'NT SERVICE\\MSSQLSERVER (Holds SeImpersonatePrivilege)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: CLR Stored Procedure Persistence (sys.assemblies) & Default Trace (.trc) Forensics',
        narration:
          'Even if the attacker sets xp_cmdshell back to 0 (generating another EventID 15457 from 1 to 0) and registers a malicious .NET CLR assembly via CREATE ASSEMBLY ... WITH PERMISSION_SET = UNSAFE, SQL Server’s built-in Default Trace (C:\\Program Files\\Microsoft SQL Server\\...\\MSSQL\\Log\\log_*.trc) and sys.assemblies / sys.assembly_files catalog views preserve the exact DDL timestamp, login name, client hostname, and raw PE bytes of the assembly.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.001 - Server Software Component: SQL Stored Procedures)',
        technicalCommands: [
          'T-SQL Forensics: SELECT name, permission_set_desc, create_date FROM sys.assemblies WHERE is_user_defined = 1;',
          'Default Trace Query: SELECT TextData, LoginName, HostName, StartTime FROM sys.fn_trace_gettable(\'C:\\...\\log.trc\', DEFAULT);',
        ],
        defenseMitigation:
          'Query sys.assemblies and sys.fn_trace_gettable on the SQL Server Default Trace (.trc) during database DFIR investigations to recover schema/configuration changes and extract malicious CLR assemblies.',
        logs: [
          {
            id: 'dfir-mssql-3',
            timestamp: '13:40:12.900',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 15457,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'SQL Default Trace (.trc): CREATE ASSEMBLY [SqlShellHelper] WITH PERMISSION_SET = UNSAFE',
            raw: 'MSSQL_DEFAULT_TRACE: EventClass=116 (Audit DBCC/sp_configure) LoginName="sa" HostName="WKS-09" ApplicationName=".Net SqlClient Data Provider" TextData="CREATE ASSEMBLY [SqlShellHelper] FROM 0x4D5A9000... WITH PERMISSION_SET = UNSAFE"',
            parsedFields: {
              ForensicArtifact: 'SQL Server Default Trace (MSSQL\\Log\\log_*.trc) & sys.assembly_files',
              PersistenceMechanism: 'User-Defined CLR Assembly (PERMISSION_SET = UNSAFE)',
              RecoverableBinary: 'SELECT content FROM sys.assembly_files (Starts with 0x4D5A MZ header)',
            },
          },
        ],
      },
    ],
  };
