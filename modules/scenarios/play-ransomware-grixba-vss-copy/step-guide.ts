import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'play-ransomware-grixba-vss-copy',
    briefing: {
      headline:
        'Play (Playcrypt) ransomware operators deploy their custom Grixba .NET reconnaissance scanner (inf_g.exe), abuse the AlphaVSS .NET library to exfiltrate locked files directly from Volume Shadow Copies via COM without invoking vssadmin.exe, and execute 1MB-stride intermittent encryption (.play, AA23-352A).',
      storyAnalogy:
        'Imagine a burglar who knows that shouting "Make a shadow copy!" (vssadmin.exe) will trip the voice-activated alarm in the vault. So instead, the burglar brings a silent mechanical arm (AlphaVSS .NET COM Library) that quietly reaches into the shadow vault without making a sound, pulls out the locked master ledger (ntds.dit and SQL databases), smashes the shadow vault behind them, and then scrambles every fifth page of the remaining books.',
      plainSummary:
        'In this scenario (T1046, Play Ransomware Grixba Recon, AlphaVSS Shadow Copy Theft & Intermittent Encryption (AA23-352A)), the attacker follows one continuous arc: deploying Custom Grixba .NET Reconnaissance Scanner, then alphaVSS .NET Shadow Copy Mounting for Locked, then winPE APIUnhooking. Steps #1–#3 examine #1 Deploying Custom Grixba .NET Reconnaissance Scanner; #2 AlphaVSS .NET Shadow Copy Mounting for Locked; #3 WinPE APIUnhooking. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Play Ransomware Operator -> Compromised RDP / FortiOS / Exchange -> Grixba .NET Scanner (inf_g.exe) -> AlphaVSS Shadow Access & .play Shares -> CISA AA23-352A / Symantec EDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / ASD Joint Advisory AA23-352A (#StopRansomware: Play Ransomware) / Symantec Grixba & AlphaVSS Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1046',
        plainTitle: 'Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)',
        storyAnalogy:
          'Dressed in a fake security guard vest (SentinelOne Icon), an automated scout walks every hallway in the building and writes down which rooms have alarms and where the safes are kept.',
        simpleExplanation:
          'Play operators staged C:\\Users\\Public\\Music\\inf_g.exe (Grixba, a custom .NET reconnaissance tool compiled with Costura.Fody to embed its DLL dependencies inside a single executable and stamped with a forged SentinelOne icon and file description) and ran inf_g.exe -m:all -d:corp.local (enumerating all Active Directory computers, WMI AntivirusProduct statuses, backup software, and active user sessions into a SQLite database compressed as ExportData.zip).',
        howItWorksInPractice:
          'Staging tools specifically inside C:\\Users\\Public\\Music\\ is a consistent operational tradecraft hallmark of Play ransomware intrusions.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Play Ransomware Operator through the Compromised Perimeter to the Grixba .NET Scanner (inf_g.exe).',
        detectionAndEvidence:
          'Sysmon EventID 1 & 7 detecting unsigned .NET binaries in C:\\Users\\Public\\Music\\ loading Costura assemblies and passing -m:all or -m:s command-line flags.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1006',
        plainTitle: 'AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration',
        storyAnalogy:
          'Instead of using the noisy public command-line tool (vssadmin.exe) that every security camera watches, the thief uses a direct programming interface (AlphaVSS) to quietly clone and steal locked files.',
        simpleExplanation:
          'To steal files locked exclusively by the OS (such as C:\\Windows\\NTDS\\ntds.dit or live SQL Server .mdf files) and subsequently wipe recovery snapshots without triggering command-line EDR rules for vssadmin.exe or wmic.exe, Play deployed a custom .NET utility loading AlphaVSS.x64.dll and AlphaFS.dll (which wrap the native Windows IVssBackupComponents COM API to create a Volume Shadow Copy, copy locked files directly from \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy*, and delete all shadow copies programmatically).',
        howItWorksInPractice:
          'Because vssadmin.exe, wmic.exe, and powershell.exe are never spawned during this step, detection rules that rely purely on process command-line strings completely miss both the ntds.dit theft and the shadow copy deletion. In the documented EventID 7 exchange from Perimeter Firewall & NDR Tap to Compromised RDP / FortiOS / Exchange, Compromised RDP / FortiOS / Exchange responds with ACK 7 (confirming that the vss_copy.exe request succeeded on Compromised RDP / FortiOS / Exchange and establishing the runtime state required for Step #3 Stage 3: WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Grixba Scanner host to the AlphaVSS Shadow Access node while the CISA AA23-352A / Symantec EDR Sensor observes the AlphaVSS.x64.dll load.',
        detectionAndEvidence:
          'Sysmon EventID 7 (ImageLoaded) for AlphaVSS.x64.dll / AlphaFS.dll and Windows VSSEvent log monitoring for non-standard processes invoking IVssBackupComponents.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1486',
        plainTitle: 'WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)',
        storyAnalogy:
          'To lock huge files before anyone can react, the encryptor only scrambles two or three 1-megabyte slices out of each giant file and stamps deadbeef at the bottom.',
        simpleExplanation:
          'Pushed via Group Policy Objects (GPO), the Play ransomware binary dynamically resolved APIs via the Process Environment Block (PEB) to evade user-mode hooks, checked if target files already contained the 0xdeadbeef footer marker, and performed intermittent encryption (encrypting only 2, 3, or 5 specific 0x100000-byte / 1MB chunks per file depending on total file size using AES and RSA-4096, appending .play, and dropping a minimalist ReadMe.txt containing only the word "PLAY" and an email address).',
        howItWorksInPractice:
          'Encrypting only a few 1MB chunks per multi-gigabyte file reduces disk I/O by over 95%, allowing Play to corrupt terabytes of storage in minutes while keeping average file-entropy scores low enough to fool naive entropy-based ransomware detectors. In the documented EventID 11 exchange from Compromised RDP / FortiOS / Exchange to Grixba .NET Scanner (inf_g.exe), Grixba .NET Scanner (inf_g.exe) responds with ALERT 11 (confirming that the Stage 3: WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play) request succeeded on Grixba .NET Scanner (inf_g.exe) and completing the final execution objective of Play Ransomware Grixba Recon, AlphaVSS Shadow Copy Theft & Intermittent Encryption (AA23-352A)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the AlphaVSS Shadow Access node into the .play Shares intermittent encryption phase.',
        detectionAndEvidence:
          'Deploy filesystem minifilter behavioral monitors (kernel-level disk I/O sensors that inspect write patterns in real time) to detect rapid 0x100000-byte stride partial file overwrites, .play extension renames, and trailing 0xdeadbeef file footers. Correlate Sysmon Event 11 and Windows Security Event telemetry for T1486 (pairing write patterns with parent/child process fields) and contain the offending session.',
      },
    ],
  };
