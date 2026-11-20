import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'aukill-edr-killer-procxp152-byovd',
    title: 'AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1562.001',
    description:
      'Ransomware affiliates (Medusa Locker / LockBit) deploy AuKill ("EDRKiller"), which drops an outdated, Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS v16.32) as a system service and sends IOCTL 0x8335003C and 0x83350004 to close handles and terminate Protected Process Light (PPL) EDR services from Ring 0.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'AuKill User-Mode Controller', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SCM Service (PROCEXP152.SYS v16.32)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'DeviceIoControl (0x8335003C / 0004)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sophos X-Ops / Elastic WDAC Blocklist', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Terminated PPL EDR & AV Services', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32',
        narration:
          'AuKill unpacks an embedded copy of Sysinternals Process Explorer driver version 16.32 into C:\\Windows\\System32\\drivers\\PROCEXP152.SYS (or a disguised name like rentdrv2.sys) and registers it via CreateServiceW as a kernel driver.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation (T1543.003 - Windows Service / BYOVD)',
        technicalCommands: [
          'Drop C:\\Windows\\System32\\drivers\\PROCEXP152.SYS (Signed by Microsoft Windows Hardware Compatibility Publisher)',
          'sc.exe create PROCEXP152 type= kernel binPath= "C:\\Windows\\System32\\drivers\\PROCEXP152.SYS" && sc.exe start PROCEXP152',
        ],
        defenseMitigation:
          'Enable the Microsoft Vulnerable Driver Blocklist (`SiPolicy.p7b`) and HVCI so legacy `PROCEXP152.SYS` versions (< v17.0) are blocked from loading into the kernel.',
        logs: [
          {
            id: 'aukill-1',
            timestamp: '04:11:02.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\PROCEXP152.SYS | Version: 16.32 | Signed: true | Signature: Microsoft Windows Hardware Compatibility Publisher | Note: Known BYOVD driver loaded by non-Sysinternals binary',
            parsedFields: {
              DriverPath: 'C:\\Windows\\System32\\drivers\\PROCEXP152.SYS',
              DriverVersion: '16.32 (Vulnerable to Unauthenticated IOCTL)',
              ToolName: 'AuKill (EDRKiller)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004',
        narration:
          'AuKill opens a device handle to \\\\.\\PROCEXP152 and spawns continuous worker threads that enumerate running processes for EDR/AV names, invoking DeviceIoControl with IOCTL 0x8335003C (IOCTL_OPEN_PROTECTED_PROCESS_HANDLE) and IOCTL 0x83350004 (IOCTL_CLOSE_HANDLE).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'CreateFileW("\\\\.\\PROCEXP152", GENERIC_READ | GENERIC_WRITE, ...)',
          'DeviceIoControl(hDriver, 0x8335003C, &targetPid, ...) -> ZwOpenProcess + ZwTerminateProcess / ObCloseHandle (0x83350004)',
        ],
        defenseMitigation:
          'Alert on any process other than a verified `procexp64.exe` binary opening a handle to `\\\\.\\PROCEXP152` or loading `PROCEXP152.SYS`.',
        logs: [
          {
            id: 'aukill-2',
            timestamp: '04:11:03.450',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'aukill.exe',
            raw: 'Kernel Driver Abuse Alert | Caller: C:\\Users\\Public\\aukill.exe | DeviceObject: \\Device\\PROCEXP152 | IssuedIOCTLs: 0x8335003C (Open Protected Process), 0x83350004 (Close Handle) | Target: Protected Process Light (PPL) Security Agents',
            parsedFields: {
              DeviceHandle: '\\\\.\\PROCEXP152',
              OpenProcessIoctl: '0x8335003C',
              CloseHandleIoctl: '0x83350004',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation',
        narration:
          'Because PROCEXP152.SYS executes in Ring 0, its calls to ZwTerminateProcess and ObCloseHandle bypass User-Mode Protected Process Light (PPL) boundaries, stripping all active handles and killing Microsoft Defender, Sophos, and Elastic agents immediately prior to LockBit/Medusa ransomware execution.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'Ring-0 ZwTerminateProcess kills MsMpEng.exe, SophosHealth.exe, and elastic-agent.exe',
          'Launch ransomware encryptor across unmonitored host',
        ],
        defenseMitigation:
          'Combine kernel driver blocklists with tamper-resistant service heartbeats that automatically quarantine hosts from the network switch/VLAN if the EDR sensor stops reporting after a EventID 7045/Sysmon 6 driver load.',
        logs: [
          {
            id: 'aukill-3',
            timestamp: '04:11:05.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 5,
            raw: 'EventID: 5 (ProcessTerminated) | TerminatedProcesses: MsMpEng.exe, NisSrv.exe, SophosFileScanner.exe, elastic-agent.exe | Source: Kernel Driver PROCEXP152.SYS | FollowUp: Ransomware payload executed',
            parsedFields: {
              BypassedBoundary: 'Protected Process Light (PsProtectedSignerAntimalware-Light)',
              TerminatedAgents: 'MsMpEng.exe, SophosFileScanner.exe, elastic-agent.exe',
              MitreTechnique: 'T1562.001 (Disable or Modify Tools via BYOVD)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
