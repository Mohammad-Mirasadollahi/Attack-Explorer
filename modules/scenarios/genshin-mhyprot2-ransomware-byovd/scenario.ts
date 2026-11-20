import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'genshin-mhyprot2-ransomware-byovd',
    title: 'Genshin Impact Anti-Cheat Driver (mhyprot2.sys) Ransomware BYOVD (CVE-2020-36603)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'CVE-2020-36603',
    description:
      'Ransomware operators bring a standalone copy of the legitimate, Microsoft-signed Genshin Impact anti-cheat kernel driver (mhyprot2.sys), load it onto enterprise servers where the game is never installed, complete a 64-bit seed handshake via IOCTL 0x80034000, and invoke IOCTL 0x81034000 (ZwTerminateProcess) to wipe out endpoint protection.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'kill_svc.exe Ransomware Dropper', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Signed Anti-Cheat Driver (mhyprot2.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'IOCTL 0x80034000 MT64 Handshake', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Trend Micro / Mandiant EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL 0x81034000 Ring-0 AV Wipe & Lock', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller',
        narration:
          'After gaining administrative RDP access, the ransomware operator drops kill_svc.exe alongside mhyprot2.sys—a kernel-mode anti-cheat driver validly signed by miHoYo Co., Ltd. (timestamped 2020)—and registers it as a Windows kernel service.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'Drop C:\\Users\\Public\\mhyprot2.sys (Signed by miHoYo Co., Ltd. / Microsoft WHCP)',
          'sc.exe create mhyprot2 type= kernel binPath= "C:\\Users\\Public\\mhyprot2.sys" && sc.exe start mhyprot2',
        ],
        defenseMitigation:
          'Block gaming anti-cheat and hardware-overclocking kernel drivers (`mhyprot2.sys`, `RTCore64.sys`, `gdrv.sys`) on enterprise servers and workstations via WDAC.',
        logs: [
          {
            id: 'mhy-1',
            timestamp: '22:14:08.110',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | Host: DC01.corp.local | ImageLoaded: C:\\Users\\Public\\mhyprot2.sys | Signed: true | Signer: miHoYo Co., Ltd. | CveId: CVE-2020-36603 | Note: Gaming anti-cheat driver loaded on Windows Server',
            parsedFields: {
              DriverFile: 'C:\\Users\\Public\\mhyprot2.sys',
              Signer: 'miHoYo Co., Ltd. (Genshin Impact Anti-Cheat)',
              ExploitedCve: 'CVE-2020-36603',
              HostRole: 'Enterprise Domain Controller',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)',
        narration:
          'kill_svc.exe opens a handle to \\\\.\\mhyprot2 and sends IOCTL 0x80034000 to initialize the driver’s 64-bit Mersenne Twister (MT19937-64) PRNG key schedule, which mhyprot2.sys uses to XOR-decode subsequent user-mode IOCTL payloads.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1027 - Obfuscated IOCTL Payloads)',
        technicalCommands: [
          'hDriver = CreateFileW("\\\\.\\mhyprot2", GENERIC_READ | GENERIC_WRITE, ...)',
          'DeviceIoControl(hDriver, 0x80034000, &initSeedStruct, 0x18, ...) (Initializes MT19937-64 XOR cipher key)',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 6 driver loads and ETW `Microsoft-Windows-Kernel-File` device opens for `\\Device\\mhyprot2`.',
        logs: [
          {
            id: 'mhy-2',
            timestamp: '22:14:08.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'BYOVD Device Handle Alert | Process: C:\\Users\\Public\\kill_svc.exe | Device: \\\\.\\mhyprot2 | HandshakeIOCTL: 0x80034000 (MT19937-64 PRNG Key Initialization)',
            parsedFields: {
              ControllerBinary: 'C:\\Users\\Public\\kill_svc.exe',
              DeviceObject: '\\\\.\\mhyprot2',
              HandshakeIoctl: '0x80034000',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption',
        narration:
          'kill_svc.exe loops through running endpoint security processes, encrypts each target PID with the MT19937-64 XOR key, and sends IOCTL 0x81034000 to mhyprot2.sys, which invokes ZwTerminateProcess from Ring 0 to kill AV/EDR services before launching the DeadBolt/LockBit ransomware payload.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion & Impact (T1562.001 / T1486)',
        technicalCommands: [
          'DeviceIoControl(hDriver, 0x81034000, &xorEncryptedTargetPid, ...) -> Ring-0 PsLookupProcessByProcessId + ZwTerminateProcess',
          'Deploy ransomware across unprotected Domain Controller and SMB shares',
        ],
        defenseMitigation:
          'Revoke or block `mhyprot2.sys` across all enterprise endpoints and enforce hardware-backed MFA on RDP/SMB administrative logons.',
        logs: [
          {
            id: 'mhy-3',
            timestamp: '22:14:09.902',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 5,
            raw: 'EventID: 5 (ProcessTerminated) | Driver: mhyprot2.sys (IOCTL 0x81034000) | TerminatedProcesses: Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe | FollowUp: Mass file encryption initiated',
            parsedFields: {
              KillIoctl: '0x81034000 (Ring-0 ZwTerminateProcess)',
              TerminatedProcesses: 'Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe',
              Impact: 'Complete Endpoint Protection Blindfolding & Ransomware Encryption',
            },
          },
        ],
        packets: [],
      },
    ],
  };
