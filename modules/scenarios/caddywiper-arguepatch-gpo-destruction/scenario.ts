import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'caddywiper-arguepatch-gpo-destruction',
    title: 'Sandworm ArguePatch Loader & CaddyWiper Domain-Aware Disk Wiper (T1561.001)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.001',
    description:
      'Sandworm pushes CaddyWiper across enterprise networks via Active Directory Group Policy Objects (GPO) and the ArguePatch loader (a patched legitimate IDA Pro remote debugger server binary). CaddyWiper calls DsRoleGetPrimaryDomainInformation to intentionally skip Domain Controllers (preserving Sandworm’s foothold) while zeroing out C:\\Users, D:\\..Z:\\, and \\\\.\\PhysicalDrive* on all member hosts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandworm GPO Scheduled Task Push', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ArguePatch Loader (Patched win32_remote.exe)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CaddyWiper (DsRole Domain Controller Check)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'ESET / Cisco Talos / CERT-UA Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL_DISK_SET_DRIVE_LAYOUT_EX Zeroing', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution',
        narration:
          'From a compromised Domain Controller, Sandworm creates a Group Policy Scheduled Task that copies and executes ArguePatch (a patched copy of Hex-Rays IDA Pro’s legitimate win32_remote.exe debugger server) or caddy.exe across all domain-joined machines, decrypting the CaddyWiper shellcode in memory.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Execution & Defense Evasion (T1053.005 - Scheduled Task / T1574)',
        technicalCommands: [
          'GPO Scheduled Task: Copy \\\\DC01\\SYSVOL\\corp.local\\scripts\\caddy.exe -> C:\\Users\\Public\\',
          'ArguePatch Loader: Patched IDA win32_remote.exe decrypts and jumps to CaddyWiper shellcode in RAM',
        ],
        defenseMitigation:
          'Audit Active Directory Group Policy Object modifications (EventID 5136) for newly added Immediate Scheduled Tasks referencing `SYSVOL` or `NETLOGON` binaries.',
        logs: [
          {
            id: 'caddy-1',
            timestamp: '10:00:02.115',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'win32_remote.exe',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\svchost.exe (Schedule) | Image: C:\\Users\\Public\\win32_remote.exe (ArguePatch Loader) | Payload: CaddyWiper In-Memory Shellcode | Deployment: Active Directory GPO',
            parsedFields: {
              DeliveryVector: 'Active Directory GPO Scheduled Task',
              LoaderName: 'ArguePatch (Patched Hex-Rays IDA win32_remote.exe)',
              WiperPayload: 'CaddyWiper (T1561.001)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers',
        narration:
          'Upon starting, CaddyWiper resolves APIs dynamically on the stack and calls DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &info). If MachineRole equals DsRole_RolePrimaryDomainController (5), CaddyWiper immediately exits—ensuring the Domain Controller stays alive to keep pushing the wiper GPO to newly booted machines.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Discovery & Execution Guardrails (T1082 / T1480 - Execution Guardrails)',
        technicalCommands: [
          'DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &pInfo)',
          'if (pInfo->MachineRole == DsRole_RolePrimaryDomainController) { ExitProcess(0); }',
        ],
        defenseMitigation:
          'Immediately unlink malicious GPOs and isolate the Primary Domain Controller (`PDC`) during a wiper outbreak, as the PDC is intentionally left intact by the malware to act as the distribution engine.',
        logs: [
          {
            id: 'caddy-2',
            timestamp: '10:00:02.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'CaddyWiper Execution Guardrail Alert | API: netapi32!DsRoleGetPrimaryDomainInformation | CheckedValue: DsRole_RolePrimaryDomainController (0x5) | HostRole: Member Workstation (Proceeding with Wipe)',
            parsedFields: {
              GuardrailApi: 'netapi32.dll!DsRoleGetPrimaryDomainInformation',
              SparedRole: 'DsRole_RolePrimaryDomainController (5)',
              OperationalReason: 'Preserve AD GPO distribution & attacker foothold on DC',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe',
        narration:
          'On all non-DC machines, CaddyWiper enables SeTakeOwnershipPrivilege, recursively takes ownership (`SetNamedSecurityInfoA` + `SetEntriesInAclA`) and zeroes out every file in `C:\\Users` and drives `D:\\` through `Z:\\`, and finally calls `DeviceIoControl` with `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) on `\\\\.\\PhysicalDrive9` down to `\\\\.\\PhysicalDrive0` to zero out the GPT/MBR partition layout.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1561.001 - Disk Content Wipe / T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'Recursive ACL Takeover + Zero-Fill: C:\\Users\\* and D:\\ .. Z:\\',
          'DeviceIoControl("\\\\.\\PhysicalDrive0", IOCTL_DISK_SET_DRIVE_LAYOUT_EX [0x7C054], &zeroBuffer, 0x780, ...)',
        ],
        defenseMitigation:
          'Block `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) calls from non-disk-management processes and monitor high-velocity `SetNamedSecurityInfoA` ACL modifications across `C:\\Users`.',
        logs: [
          {
            id: 'caddy-3',
            timestamp: '10:00:08.912',
            source: 'EDR',
            severity: 'critical',
            raw: 'Partition Layout Destruction Alert (CaddyWiper) | Process: win32_remote.exe | Target: \\\\.\\PhysicalDrive9 .. \\\\.\\PhysicalDrive0 | IOCTL: 0x0007C054 (IOCTL_DISK_SET_DRIVE_LAYOUT_EX with 1,920 zero bytes) | Result: All disk partitions erased',
            parsedFields: {
              FileWipeScope: 'C:\\Users and Drives D:\\ through Z:\\ (Zero-filled)',
              PartitionWipeIoctl: '0x0007C054 (IOCTL_DISK_SET_DRIVE_LAYOUT_EX)',
              PhysicalDrivesTargeted: '\\\\.\\PhysicalDrive9 down to \\\\.\\PhysicalDrive0',
            },
          },
        ],
        packets: [],
      },
    ],
  };
