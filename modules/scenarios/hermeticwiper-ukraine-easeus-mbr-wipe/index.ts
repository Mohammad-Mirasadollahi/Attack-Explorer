import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'hermeticwiper-ukraine-easeus-mbr-wipe',
    briefing: {
      headline:
        'Sandworm (GRU Unit 74455) deploys HermeticWiper (FoxBlade), extracting a legitimate signed EaseUS Partition Master driver (empntdrv.sys) from its PE RCDATA resource section to gain raw disk access and overwrite the MBR, NTFS boot sectors, $MFT, and $LogFile (AA22-057A).',
      storyAnalogy:
        'Imagine a saboteur disguised with a genuine business license (Hermetica Digital Ltd) who wants to demolish a library’s card catalog ($MFT) and front entrance (MBR) so not a single book can ever be found again. Because the library’s operating system guards the master card catalog, the saboteur unpacks a genuine, licensed bulldozer (Signed EaseUS Partition Master Driver empntdrv.sys) from their suitcase, drives it straight into the foundation, shreds the master index with random noise, and pulls the main power plug.',
      plainSummary:
        'In this scenario (T1068, Sandworm HermeticWiper Signed EaseUS Driver (empntdrv.sys) MBR & NTFS $MFT Destruction), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: extracting, then disabling Volume Shadow Copy , Crash Dumps, then raw \\\\.\\PhysicalDrive0..100 MBR. Steps #1–#3 walk that chain end-to-end by covering Extracting, then Disabling Volume Shadow Copy , Crash Dumps, then Raw \\\\.\\PhysicalDrive0..100 MBR, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
      diagramTopologySummary:
        'Sandworm GPO / WMI Deployment -> HermeticWiper (conhost.dll / Hermetica) -> Signed EaseUS Driver (empntdrv.sys) -> PhysicalDrive0 MBR & NTFS $MFT Wiped -> ESET / SentinelOne / CISA MAR Sensor.',
      documentedAdvisory:
        'CISA Alert AA22-057A & MAR-10375867-1 (HermeticWiper) / ESET & SentinelLabs Technical Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA',
        storyAnalogy:
          'To bypass Windows protections on active disk partitions, the wiper unpacks a genuine, Microsoft-signed disk-partitioning driver hidden inside its own resource pocket.',
        simpleExplanation:
          'Upon execution via Active Directory GPO or WMI, HermeticWiper enabled SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege in its process token, checked the OS architecture and Windows version, decompressed an MSZIP-compressed resource (DRV_X64 / DRV_XP_X64) from its PE RCDATA section into C:\\Windows\\System32\\drivers\\<2_random_chars>dr.sys (a legitimate, Microsoft-signed copy of empntdrv.sys from EaseUS Partition Master), and loaded it into the kernel.',
        howItWorksInPractice:
          'Both the outer HermeticWiper executable (signed by Hermetica Digital Ltd until revoked) and the inner empntdrv.sys kernel driver (signed by CHENGDU YIWO Tech Development Co., Ltd.) carried valid Authenticode signatures at the time of the attack. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Sandworm GPO Deployment and HermeticWiper binary to the Signed EaseUS Driver (empntdrv.sys).',
        detectionAndEvidence:
          'Sysmon EventID 6 (DriverLoaded) for empntdrv.sys or C:\\Windows\\System32\\drivers\\??dr.sys signed by CHENGDU YIWO Tech Development Co., Ltd..',
      },
      {
        stepNumber: 2,
        mitreId: 'T1490',
        plainTitle: 'Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata',
        storyAnalogy:
          'Before destroying the master index, the saboteur turns off the backup camera (vss), disables the black-box flight recorder (CrashControl), and maps out every page of the NTFS file table.',
        simpleExplanation:
          'HermeticWiper called ChangeServiceConfigW and ControlService to disable and stop the vss (Volume Shadow Copy) service, set HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl\\CrashDumpEnabled = 0 (preventing Windows from writing a MEMORY.DMP kernel crash dump when the corrupted system inevitably blue-screened, thereby denying incident responders RAM forensics), and parsed the raw NTFS boot sector and Master File Table ($MFT) to map the exact physical disk runlists of $MFT, $LogFile, $Bitmap, and C:\\Windows\\System32\\config registry hives.',
        howItWorksInPractice:
          'By parsing the NTFS $MFT runlist fragments directly rather than using standard Windows file APIs, HermeticWiper could corrupt the exact physical sectors backing critical OS metadata even while Windows held those files locked. In the documented EventID 7040 exchange from Perimeter Firewall & NDR Tap to HermeticWiper (conhost.dll / Hermetica), HermeticWiper (conhost.dll / Hermetica) responds with ALERT 7040 (confirming that the Stage 2: Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata request succeeded on HermeticWiper (conhost.dll / Hermetica) and establishing the runtime state required for Step #3 Stage 3: Raw \\.\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Signed EaseUS Driver to the ESET / SentinelOne / CISA MAR Sensor as vss and CrashControl are disabled.',
        detectionAndEvidence:
          'Windows System EventID 7040 (vss service disabled) and Registry EventID 13 (CrashControl\\CrashDumpEnabled set to 0). Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1561.002',
        plainTitle: 'Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes',
        storyAnalogy:
          'Finally, the wiper overwrites the front door (MBR) and the master card catalog ($MFT) of every hard drive with cryptographic noise and forces an immediate reboot.',
        simpleExplanation:
          'Iterating through \\\\.\\PhysicalDrive0 up to \\\\.\\PhysicalDrive100, HermeticWiper generated cryptographically random bytes via CryptGenRandom and overwrote the Master Boot Record (MBR) (first 512 bytes of sector 0), GPT partition headers, and the mapped physical sector extents of $MFT, $LogFile, and C:\\Users, before invoking ExitWindowsEx(EWX_REBOOT | EWX_FORCE) to immediately reboot the machine into an unrecoverable, unbootable state.',
        howItWorksInPractice:
          'Because the $MFT (which maps where every file resides on an NTFS volume) and $MFTMirr are overwritten with random bytes from CryptGenRandom, carving or recovering filesystem structure is rendered impossible in seconds without having to overwrite every gigabyte of the disk. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the EaseUS driver and HermeticWiper overwriting PhysicalDrive0 MBR & NTFS $MFT Wiped.',
        detectionAndEvidence:
          'Blocking empntdrv.sys via WDAC and behavioral EDR prevention blocking raw WriteFile operations to sector 0 of \\\\.\\PhysicalDrive*.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a wartime saboteur who is not after ransom money at all, but wants every computer in an organization turned into a permanent brick before sunrise. First, the saboteur unpacks an authentic, validly signed disk-partitioning guard badge from its own coat pocket to gain direct physical access to the raw floor tiles; next, it disables every backup and crash log while shattering the building index directory; finally, it smashes the front entrance map of every hard drive with pure random static so no floor can ever start up again.',
      storyMappings: [
        {
          storyTerm: 'Unpacking a validly signed disk-partitioning badge from its pocket',
          technicalTerm: 'Extracting signed EaseUS empntdrv.sys driver from PE RCDATA resource (BYOVD)',
          tone: 'amber',
        },
        {
          storyTerm: 'Disabling backups and shattering the building index directory',
          technicalTerm: 'Stopping Volume Shadow Copy (vss) and fragmenting NTFS $MFT and metadata files',
          tone: 'sky',
        },
        {
          storyTerm: 'Smashing every drive entrance map with pure random static',
          technicalTerm: 'Overwriting \\\\.\\PhysicalDrive0..100 MBR and NTFS $MFT with CSPRNG bytes',
          tone: 'rose',
        },
        {
          storyTerm: 'Turning every machine into a permanent brick before sunrise',
          technicalTerm: 'Destructive Sandworm wiper attack forcing unbootable system reboot',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Pushed simultaneously across hundreds of offices by the central policy board, the saboteur unlocks special driver-loading clearance, pulls an authentic signed disk-utility driver out of its own hidden pocket, and bolts it straight into the building core engine.',
        storyMappings: [
          {
            storyTerm: 'Unlocking special driver-loading clearance',
            technicalTerm: 'Enabling SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Pulling an authentic disk-utility driver from its hidden pocket',
            technicalTerm: 'Decompressing embedded signed EaseUS empntdrv.sys from PE RCDATA resource',
            tone: 'sky',
          },
          {
            storyTerm: 'Bolting it into the building core engine',
            technicalTerm: 'Registering C:\\Windows\\System32\\drivers\\??dr.sys signed by CHENGDU YIWO Tech',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing modern storage locks',
            technicalTerm: 'Gaining unrestricted Ring-0 raw physical disk write capability via BYOVD',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 6 (DriverLoaded tracking kernel driver signatures and file paths) for empntdrv.sys or randomized C:\\Windows\\System32\\drivers\\??dr.sys binaries signed by CHENGDU YIWO Tech Development Co., Ltd. (the exact EaseUS driver abused by HermeticWiper).',
      },
      2: {
        storyAnalogy:
          'Before swinging the sledgehammer, the saboteur pulls the power plugs on the building automatic backup vault and crash-diary recorder, then deliberately shatters the floor index catalog into thousands of broken fragments so recovery teams cannot piece files back together.',
        storyMappings: [
          {
            storyTerm: 'Pulling power plugs on the backup vault and crash recorder',
            technicalTerm: 'ChangeServiceConfigW and ControlService disabling Volume Shadow Copy (vss) and crash dumps',
            tone: 'amber',
          },
          {
            storyTerm: 'Shattering the floor index catalog into fragments',
            technicalTerm: 'Fragmenting NTFS metadata structures ($Bitmap, $LogFile, $MFT) across disks',
            tone: 'sky',
          },
          {
            storyTerm: 'Preventing forensic recovery teams from rebuilding files',
            technicalTerm: 'Destroying filesystem allocation maps prior to raw sector wiping',
            tone: 'rose',
          },
          {
            storyTerm: 'Covering every internal storage room',
            technicalTerm: 'Targeting all attached local and mounted Windows NTFS volumes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Walking methodically from storage bay zero up to bay one hundred, the saboteur uses its raw disk pass to blast every drive opening directory and master file catalog with irreversible random noise, then flips the building power breaker so no machine ever boots again.',
        storyMappings: [
          {
            storyTerm: 'Walking from storage bay zero up to bay one hundred',
            technicalTerm: 'Iterating handles across \\\\.\\PhysicalDrive0 through \\\\.\\PhysicalDrive100',
            tone: 'amber',
          },
          {
            storyTerm: 'Blasting opening directories with irreversible random noise',
            technicalTerm: 'CryptGenRandom CSPRNG bytes overwriting MBR sector 0 and NTFS $MFT',
            tone: 'sky',
          },
          {
            storyTerm: 'Flipping the building power breaker',
            technicalTerm: 'Forced InitiateSystemShutdownEx locking victims out of unbootable hosts',
            tone: 'rose',
          },
          {
            storyTerm: 'Pre-emptive shield blocking raw disk strikes',
            technicalTerm: 'WDAC driver blocklist for empntdrv.sys and EDR blocking raw WriteFile to sector 0',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Block empntdrv.sys via Windows Defender Application Control (WDAC kernel driver allowlisting) and enforce EDR kernel disk filters blocking unauthorized raw WriteFile operations targeting sector 0 of \\\\.\\PhysicalDrive* (stopping MBR destruction mid-flight).',
      },
    },
  };
