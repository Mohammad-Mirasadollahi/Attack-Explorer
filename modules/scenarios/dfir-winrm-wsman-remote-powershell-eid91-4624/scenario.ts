import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-winrm-wsman-remote-powershell-eid91-4624',
    title: 'Microsoft WinRM, CrowdStrike & SigmaHQ DFIR — WinRM / WS-Management Lateral Movement & wsmprovhost.exe Forensics',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1021.006',
    description:
      'Grounded in Microsoft Windows Remote Management (WinRM) Operational Logging specifications, CrowdStrike lateral movement hunting guides, and MITRE ATT&CK T1021.006: an attacker pivots laterally using Enter-PSSession or Invoke-Command over TCP 5985/5986 (/wsman), generating WinRM/Operational EventID 142 (Source Client) and EventID 91 (Destination Server Shell Creation), Security EventID 4624 (LogonType 3), and child processes under C:\\Windows\\System32\\wsmprovhost.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Source Host (Invoke-Command)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'HTTP.sys /wsman (:5985/:5986)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (WinRM Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'WinRM EID 91/142 & PowerShell', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'wsmprovhost.exe Host Process', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Outbound WSMan Session Initialization on Source Host (WinRM EventID 142 & 6)',
        narration:
          'When the attacker runs Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... } on the source workstation, Microsoft-Windows-WinRM/Operational on the source host logs EventID 6 (Creating WSMan session) showing the exact destination connection URI (http://SRV-SQL01:5985/wsman?PSVersion=5.1).',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Lateral Movement (T1021.006 - Remote Services: Windows Remote Management)',
        technicalCommands: [
          'Invoke-Command -ComputerName SRV-SQL01.corp.local -ScriptBlock { procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp }',
          'Source WinRM/Operational EventID 6: Creating WSMan session to connection http://SRV-SQL01.corp.local:5985/wsman',
        ],
        defenseMitigation:
          'Collect Microsoft-Windows-WinRM/Operational EventID 6 and 142 across endpoints to reconstruct outbound WinRM lateral movement hops.',
        logs: [
          {
            id: 'dfir-winrm-1',
            timestamp: '20:11:02.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 6,
            ProcessName: 'powershell.exe',
            CommandLine: 'Invoke-Command -ComputerName SRV-SQL01.corp.local -ScriptBlock { ... }',
            raw: 'LogName: Microsoft-Windows-WinRM/Operational | EventID: 6 | Computer: WKS-04.corp.local | Description: Creating WSMan session. The connection string is: SRV-SQL01.corp.local/wsman?PSVersion=5.1.19041.3570',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-WinRM/Operational (Source Host)',
              EventID: '6 (Creating WSMan Session)',
              TargetConnectionUri: 'http://SRV-SQL01.corp.local:5985/wsman',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Destination Server WSMan Shell Creation (WinRM EventID 91 & Security EventID 4624 Type 3)',
        narration:
          'On destination server SRV-SQL01, HTTP.sys receives the SOAP POST /wsman request on port 5985. Security logs EventID 4624 (LogonType 3 Network), and Microsoft-Windows-WinRM/Operational logs EventID 91 (Creating WSMan shell on server with ResourceUri http://schemas.microsoft.com/powershell/Microsoft.PowerShell and clientIP 10.10.4.15).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021.006 - Destination WinRM EventID 91 Shell Creation)',
        technicalCommands: [
          'Destination WinRM/Operational EventID 91: Creating WSMan shell with ResourceUri http://schemas.microsoft.com/powershell/Microsoft.PowerShell (clientIP: 10.10.4.15)',
          'Destination PowerShell/Operational EventID 400 / 40961: HostName=ServerRemoteHost',
        ],
        defenseMitigation:
          'Restrict WinRM access via Windows Firewall IP allowlists and Group Policy (Allow remote server management through WinRM IPv4 filter) and alert on WinRM EventID 91 from non-PAW (Privileged Access Workstation) IPs.',
        logs: [
          {
            id: 'dfir-winrm-2',
            timestamp: '20:11:02.480',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 91,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k NetworkService -s WinRM (Creating WSMan shell for CORP\\admin_ops)',
            raw: 'LogName: Microsoft-Windows-WinRM/Operational | EventID: 91 | Computer: SRV-SQL01.corp.local | Description: Creating WSMan shell on server with ResourceUri: http://schemas.microsoft.com/powershell/Microsoft.PowerShell (user: CORP\\admin_ops, clientIP: 10.10.4.15)',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-WinRM/Operational (Destination Host)',
              EventID: '91 (Creating WSMan Shell)',
              ResourceUri: 'http://schemas.microsoft.com/powershell/Microsoft.PowerShell',
              ClientIp: '10.10.4.15',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: wsmprovhost.exe Child Process Spawning & ServerRemoteHost ScriptBlock Logging (Sysmon EID 1 & PS 4104)',
        narration:
          'The WinRM service spawns the WS-Management Provider Host (C:\\Windows\\System32\\wsmprovhost.exe -Embedding), which initializes the PowerShell runspace (HostName=ServerRemoteHost) and spawns any external binaries invoked by the attacker script block (Sysmon EventID 1 with ParentImage=wsmprovhost.exe).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.001 - wsmprovhost.exe Parentage & ServerRemoteHost)',
        technicalCommands: [
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\wsmprovhost.exe -> Image=C:\\Users\\Public\\procdump64.exe',
          'Windows PowerShell EventID 400: HostName=ServerRemoteHost HostApplication=C:\\Windows\\System32\\wsmprovhost.exe -Embedding',
        ],
        defenseMitigation:
          'Hunt for Sysmon EventID 1 events where ParentImage ends with \\wsmprovhost.exe or \\winrsHost.exe, and correlate with PowerShell EventID 4104 executed within the same timeframe.',
        logs: [
          {
            id: 'dfir-winrm-3',
            timestamp: '20:11:03.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'wsmprovhost.exe',
            CommandLine: 'C:\\Users\\Public\\procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp',
            raw: 'EventID: 1 | Computer: SRV-SQL01.corp.local | ParentImage: C:\\Windows\\System32\\wsmprovhost.exe | ParentCommandLine: C:\\Windows\\System32\\wsmprovhost.exe -Embedding | Image: C:\\Users\\Public\\procdump64.exe | CommandLine: procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              ParentImage: 'C:\\Windows\\System32\\wsmprovhost.exe',
              ChildImage: 'C:\\Users\\Public\\procdump64.exe',
              PowerShellHostName: 'ServerRemoteHost',
            },
          },
        ],
      },
    ],
  };
