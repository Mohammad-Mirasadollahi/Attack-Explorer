import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a successor heist crew that buys the blueprint of an infamous retired vault-cracking machine and upgrades it to run even cleaner and quieter. First, they send remote maintenance orders to wipe backup catalogs; next, instead of loudly shouting the usual shadow-shredder command that wakes every hallway guard, they quietly walk up to the vault backup engine itself and whisper a direct internal delete order; finally, they run a fast multi-lane Rust padlocking press and sweep the empty floor clean so deleted scraps can never be pieced back together.',
      storyMappings: [
        {
          storyTerm: 'Sending remote orders to wipe backup catalogs',
          technicalTerm: 'SharpWMI.exe lateral execution invoking wbadmin delete catalog',
          tone: 'amber',
        },
        {
          storyTerm: 'Whispering a direct internal delete order instead of shouting',
          technicalTerm: 'Commandless COM IVssBackupComponents::DeleteSnapshots bypassing vssadmin CLI alerts',
          tone: 'sky',
        },
        {
          storyTerm: 'Upgraded multi-lane Rust padlocking press',
          technicalTerm: 'Hunters International Rust encryptor evolved from Hive codebase (.locked)',
          tone: 'rose',
        },
        {
          storyTerm: 'Sweeping empty floor space so scraps cannot be recovered',
          technicalTerm: 'Free-space wiping after encryption alongside Contact Us.txt ransom notes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'From a hijacked supervisor desk, the crew dispatches lightweight remote management commands down the corporate wiring to erase the building official backup directory catalog before any locking begins.',
        storyMappings: [
          {
            storyTerm: 'Hijacked supervisor desk',
            technicalTerm: 'Compromised administrative workstation initiating lateral movement',
            tone: 'amber',
          },
          {
            storyTerm: 'Lightweight remote management orders',
            technicalTerm: 'SharpWMI.exe executing remote commands over WMI across domain servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing the official backup directory catalog',
            technicalTerm: 'wbadmin delete catalog removing Windows Backup recovery metadata',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing the runway for extortion',
            technicalTerm: 'Eliminating server-level recovery options prior to mass encryption',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Knowing that security sensors watch closely for the noisy standard shadow-copy command tool, the Rust program skips the command line altogether and speaks directly to the operating system internal backup clerk through its private office door to erase every snapshot in silence.',
        storyMappings: [
          {
            storyTerm: 'Skipping the noisy command line altogether',
            technicalTerm: 'Avoiding vssadmin.exe delete shadows and wmic.exe shadowcopy delete SIEM rules',
            tone: 'amber',
          },
          {
            storyTerm: 'Speaking directly through the backup clerk private door',
            technicalTerm: 'Direct COM API call to IVssBackupComponents::DeleteSnapshots in memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing every snapshot in silence',
            technicalTerm: 'Commandless Volume Shadow Copy deletion leaving zero CLI process artifacts',
            tone: 'rose',
          },
          {
            storyTerm: 'Catching the quiet internal call',
            technicalTerm: 'Monitoring VSS EventID 8224 / COM telemetry rather than CLI strings alone',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With every backup gone, the streamlined Rust locking press races across every storage aisle sealing files under a locked tag, scrubs blank shelf space to prevent undelete forensics, and leaves neat negotiation cards in every cabinet.',
        storyMappings: [
          {
            storyTerm: 'Streamlined Rust locking press evolved from Hive',
            technicalTerm: 'Hunters International multi-threaded Rust encryptor simplifying Hive encryption',
            tone: 'amber',
          },
          {
            storyTerm: 'Scrubbing blank shelf space against undelete tools',
            technicalTerm: 'Post-encryption free-space wiping preventing forensic carving of plaintext files',
            tone: 'sky',
          },
          {
            storyTerm: 'Locked tag stamped on every file',
            technicalTerm: 'Encrypted documents renamed with the .locked extension',
            tone: 'rose',
          },
          {
            storyTerm: 'Negotiation cards left in every cabinet',
            technicalTerm: 'Contact Us.txt extortion note directing victims to leak-site chat',
            tone: 'emerald',
          },
        ],
      },
    },
  };
