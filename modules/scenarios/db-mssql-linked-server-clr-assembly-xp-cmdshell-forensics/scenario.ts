import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics',
    title: 'Microsoft SQL Server Security, Mandiant & MITRE T1505.001 — MSSQL Linked Server RPC, xp_cmdshell & Unsafe CLR Assembly Forensics',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1505.001',
    description:
      'Grounded in Microsoft SQL Server security documentation, Mandiant SQL Server post-exploitation analysis, and MITRE ATT&CK T1505.001 (Server Software Component: SQL Stored Procedures): DFIR analysts investigate Lateral Movement across MSSQL Linked Servers (EXEC AT / OPENQUERY), sp_configure xp_cmdshell activation (EventID 15457), and fileless Unsafe CLR Assembly registration in sys.assemblies.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Web App SQLi / Compromised Login', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MSSQL Linked Server RPC (:1433)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'sqlservr.exe (Database Engine)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Windows Application Log EID 15457', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'sys.assemblies (CLR Runtime)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MSSQL Linked Server Enumeration (sys.servers) & RPC Trust Pivot',
        narration:
          'From an initial SQL connection, the operator queries sys.servers and sys.linked_logins to discover trusted Linked Servers configured with is_rpc_out_enabled = 1 and mapped to a remote sysadmin login.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Lateral Movement (T1021 - Remote Services / MSSQL Linked Server Traversal)',
        technicalCommands: [
          'SELECT name, product, provider, data_source, is_linked, is_rpc_out_enabled FROM sys.servers;',
          'EXEC (\'SELECT @@servername, SYSTEM_USER, IS_SRVROLEMEMBER(\'\'sysadmin\'\')\') AT [CORP-SQL02];',
        ],
        defenseMitigation:
          'Audit sys.linked_logins across all SQL Server instances, never map low-privileged local logins to remote sysadmin accounts, and disable RPC Out (is_rpc_out_enabled = 0) unless strictly required.',
        logs: [
          {
            id: 'db-mssql-1',
            timestamp: '17:20:02.114',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 33205,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'EXEC (\'SELECT @@servername, SYSTEM_USER\') AT [CORP-SQL02]',
            raw: 'MSSQL_Audit: EventID=33205 action_id=EX statement="EXEC (\'SELECT @@servername, SYSTEM_USER\') AT [CORP-SQL02]" server_principal_name="sa_linked"',
            parsedFields: {
              SqlAuditEventId: '33205 (SQL Server Audit Action)',
              LinkedServerTarget: 'CORP-SQL02 (TCP 1433)',
              RemotePrincipal: 'sa_linked (sysadmin role)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Configuration Change Enabling xp_cmdshell & clr strict security (Application EventID 15457)',
        narration:
          'When sp_configure is executed to enable show advanced options, xp_cmdshell, or clr enabled, Microsoft SQL Server writes a deterministic EventID 15457 entry into the Windows Application Event Log recording the old and new configuration values.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562 - Modify SQL Server Configuration / EventID 15457)',
        technicalCommands: [
          'EXEC sp_configure \'show advanced options\', 1; RECONFIGURE; EXEC sp_configure \'xp_cmdshell\', 1; RECONFIGURE;',
          'Get-WinEvent -FilterHashtable @{LogName="Application"; Id=15457}',
        ],
        defenseMitigation:
          'Forward Windows Application EventID 15457 to the SIEM and trigger an immediate high-severity alert whenever xp_cmdshell, Ole Automation Procedures, or clr strict security is modified.',
        logs: [
          {
            id: 'db-mssql-2',
            timestamp: '17:20:08.640',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 15457,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'sp_configure \'xp_cmdshell\', 1; RECONFIGURE;',
            raw: 'WinEvent_Application: Provider="MSSQLSERVER" EventID=15457 Message="Configuration option \'xp_cmdshell\' changed from 0 to 1. Run the RECONFIGURE statement to install."',
            parsedFields: {
              EventID: '15457 (MSSQL Configuration Option Changed)',
              ConfigurationOption: 'xp_cmdshell (0 -> 1)',
              HostProcess: 'sqlservr.exe',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: In-Memory Hexadecimal CLR Assembly Registration (CREATE ASSEMBLY ... PERMISSION_SET = UNSAFE)',
        narration:
          'To persist custom .NET stored procedures without dropping a .dll file to the Windows filesystem, the attacker executes CREATE ASSEMBLY FROM 0x4D5A... WITH PERMISSION_SET = UNSAFE, storing the compiled PE bytes directly inside sys.assembly_files.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.001 - Server Software Component: SQL Stored Procedures / CLR Assembly)',
        technicalCommands: [
          'CREATE ASSEMBLY [SqlDiagnosticExt] AUTHORIZATION [dbo] FROM 0x4D5A900003000000... WITH PERMISSION_SET = UNSAFE;',
          'SELECT a.name, a.permission_set_desc, a.create_date, af.content FROM sys.assemblies a JOIN sys.assembly_files af ON a.assembly_id = af.assembly_id WHERE a.is_user_defined = 1;',
        ],
        defenseMitigation:
          'Keep clr strict security enabled (1) on all SQL Server 2017+ instances and audit sys.assemblies and sys.assembly_files for user-defined assemblies with permission_set_desc = UNSAFE_ACCESS.',
        logs: [
          {
            id: 'db-mssql-3',
            timestamp: '17:20:15.309',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 33205,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'CREATE ASSEMBLY [SqlDiagnosticExt] FROM 0x4D5A9000... WITH PERMISSION_SET = UNSAFE',
            raw: 'MSSQL_Audit: EventID=33205 class_type="AS" action_id="CR" object_name="SqlDiagnosticExt" statement="CREATE ASSEMBLY [SqlDiagnosticExt] FROM 0x4D5A9000... WITH PERMISSION_SET = UNSAFE"',
            parsedFields: {
              CatalogTable: 'sys.assemblies / sys.assembly_files',
              AssemblyName: 'SqlDiagnosticExt',
              PermissionSet: 'UNSAFE_ACCESS (Full OS & Network Access inside sqlservr.exe)',
            },
          },
        ],
      },
    ],
  };
