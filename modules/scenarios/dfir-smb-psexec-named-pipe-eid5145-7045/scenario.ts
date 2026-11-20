import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-smb-psexec-named-pipe-eid5145-7045',
    title: 'Microsoft & CISA DFIR — SMB ADMIN$ Share, PSEXESVC Named Pipe & Service Install Forensics (EID 5145 / 7045)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1569.002',
    description:
      'Grounded in Microsoft Security Auditing Event ID 5145 & System Event ID 7045 specifications, CISA Advisory AA23-165A, and SigmaHQ rules: an attacker uses PsExec / Impacket smbexec to authenticate over SMB, write a service binary to the ADMIN$ share (EventID 5145), create a temporary Windows service (System EventID 7045 / Security EventID 4697), and redirect stdin/stdout/stderr over named pipes (Sysmon EventID 17 & 18).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Operator Host (PsExec.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SMB :445 ADMIN$ & IPC$ Share', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'services.exe (SCM PID 612)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EID 5145, 7045 & Sysmon EID 17/18', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PSEXESVC.exe & Named Pipes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SMB ADMIN$ Share Write & IPC$ svcctl RPC Bind (Security EventID 5140 & 5145)',
        narration:
          'The attacker executes PsExec.exe \\\\10.10.20.15 -s cmd.exe. The target host logs Security EventID 5140 (Network share object accessed) and EventID 5145 (Detailed File Share Access) showing WriteData (AccessMask 0x2) of PSEXESVC.exe into the \\\\*\\ADMIN$ share (C:\\Windows\\PSEXESVC.exe), followed by an IPC$ access to the svcctl named pipe.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Lateral Movement (T1021.002 - Remote Services: SMB/Windows Admin Shares)',
        technicalCommands: [
          'PsExec.exe -accepteula \\\\10.10.20.15 -s cmd.exe',
          'Security EventID 5145: ShareName=\\\\*\\ADMIN$ RelativeTargetName=PSEXESVC.exe AccessMask=0x2 (WriteData)',
          'Security EventID 5145: ShareName=\\\\*\\IPC$ RelativeTargetName=svcctl',
        ],
        defenseMitigation:
          'Enable Audit Detailed File Share (EventID 5145) and restrict inbound SMB (TCP 445) between workstation subnets and across administrative tiers.',
        logs: [
          {
            id: 'dfir-psexec-1',
            timestamp: '13:05:10.115',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 5145,
            ProcessName: 'System',
            CommandLine: 'SMB2 Write \\\\*\\ADMIN$\\PSEXESVC.exe & IPC$\\svcctl bind',
            raw: 'EventID: 5145 | SubjectUserName: admin_ops | IpAddress: 10.10.4.15 | ShareName: \\\\*\\ADMIN$ | ShareLocalPath: \\??\\C:\\Windows | RelativeTargetName: PSEXESVC.exe | AccessMask: 0x2 (WriteData / AddFile)',
            parsedFields: {
              EventID: '5145 (Detailed File Share Audit)',
              ShareName: '\\\\*\\ADMIN$ (C:\\Windows)',
              RelativeTargetName: 'PSEXESVC.exe',
              AccessMask: '0x2 (WriteData)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Remote Service Installation via SCM CreateServiceW (System EventID 7045 & Security EventID 4697)',
        narration:
          'Over the \\pipe\\svcctl RPC interface, the Service Control Manager (services.exe) invokes CreateServiceW and logs System EventID 7045 (A service was installed in the system) and Security EventID 4697 with ServiceName="PSEXESVC", ImagePath="%SystemRoot%\\PSEXESVC.exe", ServiceType="user mode service" (0x10), and StartType="demand start" (0x3).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1569.002 - System Services: Service Execution)',
        technicalCommands: [
          'RPC svcctl: RCreateServiceW(lpServiceName="PSEXESVC", lpBinaryPathName="%SystemRoot%\\PSEXESVC.exe")',
          'System EventID 7045: Service Name=PSEXESVC, Service File Name=%SystemRoot%\\PSEXESVC.exe, Account Name=LocalSystem',
        ],
        defenseMitigation:
          'Alert on System EventID 7045 and Security EventID 4697 where ServiceFileName references %SystemRoot%, ADMIN$, cmd.exe /c, powershell.exe, or random 8-character service names (Impacket smbexec/psexec).',
        logs: [
          {
            id: 'dfir-psexec-2',
            timestamp: '13:05:10.480',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 7045,
            ProcessName: 'services.exe',
            CommandLine: '%SystemRoot%\\PSEXESVC.exe',
            raw: 'LogName: System | Source: Service Control Manager | EventID: 7045 | Service Name: PSEXESVC | Service File Name: %SystemRoot%\\PSEXESVC.exe | Service Type: user mode service | Service Start Type: demand start | Service Account: LocalSystem',
            parsedFields: {
              EventID: '7045 (System SCM) / 4697 (Security)',
              ServiceName: 'PSEXESVC',
              ServiceFileName: '%SystemRoot%\\PSEXESVC.exe',
              ServiceAccount: 'LocalSystem',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Named Pipe Stdin/Stdout/Stderr Redirection (Sysmon EventID 17 & 18)',
        narration:
          'Even if the attacker renames the binary using PsExec -r, PSEXESVC.exe creates a control pipe and three I/O redirection named pipes matching \\PSEXESVC-<Host>-<PID>-stdin, -stdout, and -stderr. Sysmon EventID 17 (PipeCreated) and EventID 18 (PipeConnected) capture the exact PipeName and Image regardless of service renaming.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Execution (T1569.002 - Sysmon EventID 17/18 Named Pipe Forensics)',
        technicalCommands: [
          'Sysmon EventID 17 (PipeCreated): PipeName=\\PSEXESVC-WKS04-3104-stdin',
          'Sysmon EventID 17 (PipeCreated): PipeName=\\PSEXESVC-WKS04-3104-stdout',
          'Sysmon EventID 18 (PipeConnected): Image=C:\\Windows\\PSEXESVC.exe',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 17 and EventID 18 for named pipes ending in -stdin, -stdout, -stderr, or matching \\RemCom_communicaton, \\csexec, and \\paexec.',
        logs: [
          {
            id: 'dfir-psexec-3',
            timestamp: '13:05:10.812',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 17,
            ProcessName: 'PSEXESVC.exe',
            CommandLine: 'C:\\Windows\\PSEXESVC.exe creating \\PSEXESVC-WKS04-3104-stdin',
            raw: 'EventID: 17 | EventType: CreatePipe | ProcessId: 4412 | PipeName: \\PSEXESVC-WKS04-3104-stdin | Image: C:\\Windows\\PSEXESVC.exe | Correlated EventID 18 (ConnectPipe): \\PSEXESVC-WKS04-3104-stdout',
            parsedFields: {
              EventID: '17 (PipeCreated) / 18 (PipeConnected)',
              Image: 'C:\\Windows\\PSEXESVC.exe',
              PipeNamePattern: '\\PSEXESVC-<HOST>-<PID>-{stdin,stdout,stderr}',
              SpawnedChildProcess: 'C:\\Windows\\System32\\cmd.exe (NT AUTHORITY\\SYSTEM)',
            },
          },
        ],
      },
    ],
  };
