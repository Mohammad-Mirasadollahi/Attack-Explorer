import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'hunters-international-hive-rust-wsus-sharpwmi',
    title: 'CISA AA22-321A, Unit 42 & Sophos — Hunters International Ransomware: Hive Rust Lineage, SharpWMI Lateral Movement & COM IVssBackupComponents Shadow Deletion',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA AA22-321A (Hive Rust lineage), Palo Alto Networks Unit 42, and Sophos research on Hunters International: after acquiring the Hive ransomware source code, Hunters International streamlined the Rust encryptor to delete Volume Shadow Copies directly via the COM `IVssBackupComponents::DeleteSnapshots` API (evading command-line `vssadmin.exe` alerts), propagate via `SharpWMI.exe` / Cobalt Strike, and encrypt enterprise storage.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Hunters International Operator (Cobalt Strike)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SharpWMI / SMB Lateral Distribution', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Server (COM IVssBackupComponents)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Unit 42 / Sophos VSS COM API Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Encrypted Volumes (.locked + Contact Us.txt)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SharpWMI Remote Execution & Backup Catalog Destruction (`wbadmin`)',
        narration:
          'Operating from a compromised administrative workstation, Hunters International operators use `SharpWMI.exe` (`action=exec`) and Impacket `wmiexec.py` to stage the Rust-compiled encryptor across target servers, disabling Windows Defender real-time monitoring and deleting system state backup catalogs.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Lateral Movement & Defense Evasion (T1047 - WMI / T1562.001)',
        technicalCommands: [
          'SharpWMI.exe action=exec computername=srv-db01.corp.local command="C:\\ProgramData\\hunters.exe"',
          'wbadmin.exe DELETE SYSTEMSTATEBACKUP -keepVersions:0 -quiet && bcdedit.exe /set {default} recoveryenabled No',
        ],
        defenseMitigation:
          'Monitor `wmiprvse.exe` spawning child binaries from `C:\\ProgramData` (Sysmon EventID 1) and enable Tamper Protection on all Windows Server endpoints.',
        logs: [
          {
            id: 'hunters-1',
            timestamp: '06:10:14.120',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'hunters.exe',
            CommandLine: 'C:\\ProgramData\\hunters.exe',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\wbem\\wmiprvse.exe | Image: C:\\ProgramData\\hunters.exe | Language: Rust (Hunters International / Hive v6 Derivative)',
            parsedFields: {
              LateralMovement: 'SharpWMI / WMI Win32_Process.Create (wmiprvse.exe)',
              CodeLineage: 'Hive v6 Rust Source Code -> Hunters International',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Direct COM `IVssBackupComponents::DeleteSnapshots` API Call (Commandless VSS Wipe)',
        narration:
          'To evade SIEM rules that watch for `vssadmin.exe delete shadows` or `wmic.exe shadowcopy delete`, the Hunters International Rust binary initializes COM (`CoCreateInstance` for `CLSID_VssBackupComponents` in `vssapi.dll`) and invokes `IVssBackupComponents::DeleteSnapshots` directly in-process to silently destroy all Volume Shadow Copies.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Impact & Defense Evasion (T1490 - Inhibit System Recovery via Native COM API)',
        technicalCommands: [
          'CoCreateInstance(CLSID_VssBackupComponents, ..., IID_IVssBackupComponents, &pVss)',
          'pVss->InitializeForBackup(NULL) -> pVss->DeleteSnapshots(SnapshotId, VSS_OBJECT_SNAPSHOT, TRUE, &lDeleted, &idNonDeleted)',
        ],
        defenseMitigation:
          'Hunt for non-system binaries loading `C:\\Windows\\System32\\vssapi.dll` (Sysmon EventID 7) and correlate with Volume Shadow Copy Service (`VSS`) EventID 8220 / System EventID 7036.',
        logs: [
          {
            id: 'hunters-2',
            timestamp: '06:10:18.550',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'hunters.exe',
            raw: 'EventID: 7 | Image: C:\\ProgramData\\hunters.exe | ImageLoaded: C:\\Windows\\System32\\vssapi.dll | ApiCall: IVssBackupComponents::DeleteSnapshots(VSS_OBJECT_SNAPSHOT, bForceDelete=TRUE) | Note: Commandless VSS deletion bypassing vssadmin.exe',
            parsedFields: {
              EvasionTechnique: 'In-Process COM IVssBackupComponents::DeleteSnapshots',
              LoadedModule: 'C:\\Windows\\System32\\vssapi.dll (Sysmon EventID 7)',
              MitreTechnique: 'T1490 (Inhibit System Recovery)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Multi-Threaded Rust Encryption & Free-Space Wiping (`.locked` / `Contact Us.txt`)',
        narration:
          'Unlike Hive’s custom dual-key table cipher, Hunters International simplifies the encryption pipeline for speed and reliability, terminating processes holding file locks, encrypting files in parallel Rust worker threads, appending `.locked`, and dropping `Contact Us.txt` in every directory.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'hunters.exe (Rust Tokio/Rayon thread pool encrypts local & mounted volumes -> *.locked)',
          'WriteFile("Contact Us.txt") containing victim negotiation portal ID and Tor .onion URLs',
        ],
        defenseMitigation:
          'Block outbound Tor traffic at the perimeter and enforce Sysmon EventID 7 + EventID 11 correlation to terminate processes that load `vssapi.dll` and immediately perform rapid file renames.',
        logs: [
          {
            id: 'hunters-3',
            timestamp: '06:14:02.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'hunters.exe',
            raw: 'EventID: 11 | Image: C:\\ProgramData\\hunters.exe | TargetFilename: E:\\Shares\\Engineering\\Contact Us.txt | EncryptedExtension: .locked | Family: Hunters International',
            parsedFields: {
              RansomwareFamily: 'Hunters International',
              RansomNote: 'Contact Us.txt',
              FileExtension: '.locked',
            },
          },
        ],
        packets: [],
      },
    ],
  };
