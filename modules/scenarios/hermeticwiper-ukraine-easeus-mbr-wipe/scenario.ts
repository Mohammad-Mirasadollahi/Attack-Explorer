import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'hermeticwiper-ukraine-easeus-mbr-wipe',
    title: 'Sandworm HermeticWiper Signed EaseUS Driver (empntdrv.sys) MBR & NTFS $MFT Destruction',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.002',
    description:
      'Sandworm (GRU Unit 74455) deploys HermeticWiper (FoxBlade), signed with a certificate issued to Hermetica Digital Ltd. The wiper extracts a legitimate, Microsoft-signed EaseUS Partition Master kernel driver (empntdrv.sys) from its RCDATA resource section to gain raw physical disk access and overwrite the MBR, NTFS boot sectors, $MFT, and $LogFile.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandworm GPO / WMI Deployment', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'HermeticWiper (conhost.dll / Hermetica)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Signed EaseUS Driver (empntdrv.sys)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'ESET / SentinelOne / CISA MAR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PhysicalDrive0 MBR & NTFS $MFT Wiped', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA',
        narration:
          'HermeticWiper enables SeLoadDriverPrivilege and SeBackupPrivilege, checks the OS bitness and Windows version, decompresses an MSZIP-compressed legitimate EaseUS Partition Master driver (DRV_X64 / empntdrv.sys) from its PE RCDATA resource section, and loads it as a kernel service.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 / T1543.003)',
        technicalCommands: [
          'AdjustTokenPrivileges(SeLoadDriverPrivilege, SeBackupPrivilege, SeShutdownPrivilege)',
          'Extract RCDATA "DRV_X64" -> C:\\Windows\\System32\\drivers\\<random_2_chars>dr.sys (Signed EaseUS empntdrv.sys)',
        ],
        defenseMitigation:
          'Block partition-management kernel drivers (`empntdrv.sys`, `epmntdrv.sys`, `RawDisk`) on enterprise workstations and servers using WDAC.',
        logs: [
          {
            id: 'herm-1',
            timestamp: '16:02:11.104',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\abdr.sys | OriginalFileName: empntdrv.sys (EaseUS Partition Master) | Signer: CHENGDU YIWO Tech Development Co., Ltd. | ParentBinary: HermeticWiper (Signed: Hermetica Digital Ltd)',
            parsedFields: {
              WiperBinary: 'HermeticWiper / FoxBlade (Hermetica Digital Ltd)',
              EmbeddedDriverResource: 'RCDATA DRV_X64 (EaseUS empntdrv.sys)',
              LoadedServicePath: 'C:\\Windows\\System32\\drivers\\abdr.sys',
              AdvisoryId: 'CISA AA22-057A / MAR-10375867-1',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata',
        narration:
          'Before overwriting the boot sectors, HermeticWiper disables the Volume Shadow Copy service (vss), turns off Windows crash dumps inHKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl to hide forensic memory artifacts, and parses the NTFS Master File Table ($MFT) to locate $Bitmap and $LogFile.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Inhibit System Recovery & Defense Evasion (T1490 / T1070)',
        technicalCommands: [
          'ChangeServiceConfigW(hVssService, SERVICE_DISABLED) && ControlService(hVssService, SERVICE_CONTROL_STOP)',
          'RegSetValueExW("HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl", "CrashDumpEnabled", 0)',
        ],
        defenseMitigation:
          'Monitor unexpected modifications to the `vss` service startup type (`SERVICE_DISABLED`) and `CrashControl\\CrashDumpEnabled` registry keys.',
        logs: [
          {
            id: 'herm-2',
            timestamp: '16:02:12.400',
            source: 'EDR',
            severity: 'critical',
            EventCode: 7040,
            raw: 'System Service Tampering Alert | Service: Volume Shadow Copy (vss) changed to DISABLED | RegistryModified: HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl\\CrashDumpEnabled = 0 | NTFS Enumeration: Parsing $MFT, $Bitmap, $LogFile',
            parsedFields: {
              DisabledService: 'vss (Volume Shadow Copy)',
              AntiForensicsRegistry: 'CrashControl\\CrashDumpEnabled = 0',
              TargetedNtfsStructures: '$MFT, $MFTMirr, $LogFile, $Bitmap',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes',
        narration:
          'Using direct device handles (\\\\.\\PhysicalDrive0 through \\\\.\\PhysicalDrive100) and the EaseUS driver, HermeticWiper overwrites the Master Boot Record (first 512 bytes), partition tables, NTFS $MFT records, and Windows Registry hives with random bytes generated via CryptGenRandom, then forces an immediate system reboot (`ExitWindowsEx`).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'CreateFileW("\\\\.\\PhysicalDrive0", GENERIC_READ | GENERIC_WRITE, ...) -> CryptGenRandom overwrite of Sector 0 (MBR)',
          'Overwrite NTFS $MFT, $LogFile, C:\\Windows\\System32\\config\\* -> ExitWindowsEx(EWX_REBOOT | EWX_FORCE)',
        ],
        defenseMitigation:
          'Enforce kernel-level raw disk write protection blocking non-system processes from opening `GENERIC_WRITE` handles to `\\\\.\\PhysicalDrive*`.',
        logs: [
          {
            id: 'herm-3',
            timestamp: '16:02:18.990',
            source: 'EDR',
            severity: 'critical',
            raw: 'Destructive Disk Structure Wipe Alert | TargetDevice: \\\\.\\PhysicalDrive0 (Sectors 0..2048 & NTFS $MFT) | BufferSource: CryptGenRandom | FinalCall: InitiateSystemShutdownExW / ExitWindowsEx(EWX_REBOOT) -> System Unbootable',
            parsedFields: {
              WipedDevice: '\\\\.\\PhysicalDrive0 .. \\\\.\\PhysicalDrive100',
              OverwrittenStructures: 'MBR (Sector 0), GPT/Partition Table, NTFS $MFT & $LogFile',
              FinalAction: 'Forced Reboot into Unbootable State',
            },
          },
        ],
        packets: [],
      },
    ],
  };
