import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
