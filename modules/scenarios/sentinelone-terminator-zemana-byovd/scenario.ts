import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'sentinelone-terminator-zemana-byovd',
    title: 'Terminator EDR Killer Abusing Signed Zemana AntiMalware Driver (zam64.sys / CVE-2021-31728)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'CVE-2021-31728',
    description:
      'Sold on underground forums as a universal EDR bypass, "Terminator" drops a legitimate, Microsoft-signed Zemana AntiMalware kernel driver (zam64.sys), registers its own process PID in the driver’s internal allowlist via IOCTL 0x80002010 (CVE-2021-31728), and loops IOCTL 0x80002048 to terminate CrowdStrike, SentinelOne, and Defender processes from Ring 0.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Terminator.exe User-Mode Binary', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Signed Zemana Driver (zam64.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'IOCTL 0x80002010 Allowlist Bypass', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'SentinelOne / CrowdStrike Behavioral IOA', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL 0x80002048 Ring-0 Process Kill', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping Randomized Signed Zemana Driver (zam64.sys) into System32\\drivers',
        narration:
          'To evade static filename rules, Terminator drops the legitimate signed Zemana AntiMalware driver (zam64.sys) into C:\\Windows\\System32\\drivers\\ under a randomly generated 5-to-10 character filename (e.g., kdhf82.sys) and loads it via the Windows Service Control Manager.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 / T1036.005)',
        technicalCommands: [
          'Drop C:\\Windows\\System32\\drivers\\<random_8_chars>.sys (SHA256 matching signed Zemana zam64.sys)',
          'CreateServiceW + StartServiceW -> Creates device symlink \\\\.\\ZemanaAntiMalware',
        ],
        defenseMitigation:
          'Block `zam64.sys` and `zamguard64.sys` by file hash and signer certificate thumbprint rather than filename using WDAC / Microsoft Vulnerable Driver Blocklist.',
        logs: [
          {
            id: 'term-1',
            timestamp: '18:04:19.220',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\x89kqp.sys | OriginalFileName: zam64.sys | Signed: true | Signer: Zemana Ltd. | Note: CVE-2021-31728 Vulnerable Driver Loaded under randomized name',
            parsedFields: {
              RandomizedFileName: 'C:\\Windows\\System32\\drivers\\x89kqp.sys',
              OriginalDriverName: 'zam64.sys (Zemana AntiMalware)',
              ExploitedCve: 'CVE-2021-31728',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728)',
        narration:
          'Although zam64.sys restricts dangerous IOCTLs to "trusted" processes, it exposes IOCTL 0x80002010 (IOCTL_REGISTER_PROCESS) without verifying the caller’s digital signature (CVE-2021-31728). Terminator sends its own PID to 0x80002010, adding itself to the driver’s privileged allowlist.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1068 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'hDev = CreateFileW("\\\\.\\ZemanaAntiMalware", ...)',
          'myPid = GetCurrentProcessId(); DeviceIoControl(hDev, 0x80002010, &myPid, sizeof(DWORD), ...) (Registers caller in Ring-0 trusted list)',
        ],
        defenseMitigation:
          'Kernel drivers must validate caller authenticity in Ring 0 using `SeLocateProcessImageName` and Windows Code Integrity verification rather than trusting a user-supplied PID registration IOCTL.',
        logs: [
          {
            id: 'term-2',
            timestamp: '18:04:19.510',
            source: 'EDR',
            severity: 'critical',
            raw: 'BYOVD IOCTL Registration Alert | Process: C:\\Users\\Admin\\Desktop\\Terminator.exe (PID 4812) | Device: \\\\.\\ZemanaAntiMalware | IOCTL: 0x80002010 (CVE-2021-31728 Trusted PID Registration Bypass)',
            parsedFields: {
              DeviceSymbolicLink: '\\\\.\\ZemanaAntiMalware',
              RegistrationIoctl: '0x80002010 (Unauthenticated Allowlist Addition)',
              RegisteredCallerPid: '4812 (Terminator.exe)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Continuous Ring-0 Termination Loop via IOCTL 0x80002048',
        narration:
          'Now trusted by zam64.sys, Terminator runs an infinite loop taking process snapshots (CreateToolhelp32Snapshot), matching process names against a hardcoded list of 24+ EDR/AV vendors, and sending IOCTL 0x80002048 (`ZwTerminateProcess` in Ring 0) to kill them.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) -> Match against 24 security vendor process names',
          'DeviceIoControl(hDev, 0x80002048, &edrPid, sizeof(DWORD), ...) -> Ring-0 ZwTerminateProcess',
        ],
        defenseMitigation:
          'Configure EDR anti-tamper policies to block service creation and `CreateFileW` access to `\\\\.\\ZemanaAntiMalware` before `0x80002010` can be invoked.',
        logs: [
          {
            id: 'term-3',
            timestamp: '18:04:20.105',
            source: 'EDR',
            severity: 'critical',
            raw: 'SentinelOne / CrowdStrike Behavioral Block | Process: Terminator.exe | Action: Issued IOCTL 0x80002048 (ZwTerminateProcess) via zam64.sys targeting SentinelAgent.exe & MsMpEng.exe',
            parsedFields: {
              TerminationIoctl: '0x80002048 (Ring-0 ZwTerminateProcess)',
              TargetedVendors: 'SentinelOne, CrowdStrike, Defender, Sophos, Cortex XDR',
              AttackClass: 'Commodity BYOVD EDR Killer ("Terminator")',
            },
          },
        ],
        packets: [],
      },
    ],
  };
