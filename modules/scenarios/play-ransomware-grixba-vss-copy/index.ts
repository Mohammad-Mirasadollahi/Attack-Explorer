import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'play-ransomware-grixba-vss-copy',
    title: 'Play Ransomware Grixba Recon, AlphaVSS Shadow Copy Theft & Intermittent Encryption (AA23-352A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Play (Playcrypt) ransomware operators deploy their custom .NET reconnaissance scanner (Grixba / inf_g.exe) disguised as a SentinelOne binary, abuse the AlphaVSS .NET library to read locked files directly from Volume Shadow Copies before deleting them, and execute intermittent AES-RSA encryption (.play).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Play Ransomware Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Compromised RDP / FortiOS / Exchange', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Grixba .NET Scanner (inf_g.exe)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-352A / Symantec EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AlphaVSS Shadow Access & .play Shares', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)',
        narration:
          'After gaining initial access, Play operators unpack Grixba (inf_g.exe, masquerading with a SentinelOne icon) using Costura.Fody embedded .NET assemblies to enumerate all domain hosts, WMI security products, backup catalogs, and RDP sessions into encrypted .zip archives.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery & Collection (T1046 / T1560.001)',
        technicalCommands: [
          'C:\\Users\\Public\\Music\\inf_g.exe -m:all -d:corp.local (Grixba .NET Reconnaissance Scanner)',
          'Output: ExportData.db compressed into password-protected ExportData.zip',
        ],
        defenseMitigation:
          'Alert on unsigned `.NET` binaries loading `Costura.Fody` embedded resources from `C:\\Users\\Public\\Music\\` that perform high-volume WMI, WinRM, and Remote Registry queries.',
        logs: [
          {
            id: 'play-1',
            timestamp: '03:11:20.412',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'inf_g.exe',
            CommandLine: 'C:\\Users\\Public\\Music\\inf_g.exe -m:all -d:corp.local',
            raw: 'EventID: 1 | Image: C:\\Users\\Public\\Music\\inf_g.exe | Description: SentinelOne (Masqueraded) | Tool: Grixba (.NET Recon Scanner) | Action: Enumerated WMI AntivirusProduct, Backup Services, and Domain Admins',
            parsedFields: {
              CustomReconTool: 'Grixba (inf_g.exe)',
              CliFlags: '-m:all -d:corp.local',
              AdvisoryId: 'CISA AA23-352A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration',
        narration:
          'To steal in-use SQL databases and NTDS.dit without triggering vssadmin.exe command-line alerts, Play operators deploy a custom VSS Copying Tool built on the AlphaVSS .NET library (AlphaFS.dll / AlphaVSS.x64.dll) to programmatically create, read from, and then delete Volume Shadow Copies via COM.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection & Defense Evasion (T1006 - Direct Volume Access / T1490)',
        technicalCommands: [
          'vss_copy.exe -> Loads AlphaVSS.x64.dll (Calls IVssBackupComponents COM interface directly)',
          'Copies locked SQL .mdf & ntds.dit from \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\ -> Deletes shadow copy',
        ],
        defenseMitigation:
          'Monitor `VSSEvent` EventID 8222 and COM instantiations of `CLSID_VssBackupComponents` (`{65EE1DBA-8FF4-4a58-AC1C-3470EE2F376A}`) by non-backup processes rather than relying solely on `vssadmin.exe` process creation rules.',
        logs: [
          {
            id: 'play-2',
            timestamp: '03:24:09.881',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'vss_copy.exe',
            raw: 'EventID: 7 (ImageLoaded) | Image: C:\\Users\\Public\\Music\\vss_copy.exe | ImageLoaded: AlphaVSS.x64.dll & AlphaFS.dll | Action: Programmatic VSS snapshot creation, locked file exfiltration, and snapshot deletion without vssadmin.exe',
            parsedFields: {
              DotNetLibrary: 'AlphaVSS.x64.dll / AlphaFS.dll',
              ComInterface: 'IVssBackupComponents (Direct VSS COM API)',
              EvasionBenefit: 'Bypasses vssadmin.exe / wmic.exe command-line detections',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)',
        narration:
          'Deploying the Play ransomware binary via Group Policy Objects (GPO), the encryptor resolves Windows APIs dynamically by walking the PEB, checks if files already end with .play or contain deadbeef, and encrypts only 2, 3, or 5 specific 1MB (0x100000) chunks of large files using AES-CBC and RSA-4096.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'Play Encryptor: Intermittent encryption of 0x100000-byte (1MB) blocks based on file size',
          'Appends .play extension and writes single-word ransom note ReadMe.txt ("PLAY" + contact email)',
        ],
        defenseMitigation:
          'Deploy canary files and behavioral ransomware drivers that detect rapid intermittent seek-and-overwrite I/O patterns (`IRP_MJ_WRITE` at 1MB stride intervals).',
        logs: [
          {
            id: 'play-3',
            timestamp: '03:50:14.205',
            source: 'EDR',
            severity: 'critical',
            EventCode: 11,
            raw: 'EDR Intermittent Encryption Alert | Process: C:\\Windows\\System32\\svchost_play.exe | Pattern: Stride 0x100000 (1MB) Intermittent AES-RSA Overwrite | MarkerFooter: 0xdeadbeef | AppendedExtension: .play | NoteFile: ReadMe.txt',
            parsedFields: {
              EncryptionMode: 'Intermittent 1MB (0x100000) Chunk Encryption (AES + RSA)',
              FileFooterMarker: 'deadbeef',
              AppendedExtension: '.play',
              RansomNote: 'ReadMe.txt',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'play-ransomware-grixba-vss-copy',
    briefing: {
      headline:
        'Play (Playcrypt) ransomware operators deploy their custom Grixba .NET reconnaissance scanner (inf_g.exe), abuse the AlphaVSS .NET library to exfiltrate locked files directly from Volume Shadow Copies via COM without invoking vssadmin.exe, and execute 1MB-stride intermittent encryption (.play, AA23-352A).',
      storyAnalogy:
        'Imagine a burglar who knows that shouting "Make a shadow copy!" (vssadmin.exe) will trip the voice-activated alarm in the vault. So instead, the burglar brings a silent mechanical arm (AlphaVSS .NET COM Library) that quietly reaches into the shadow vault without making a sound, pulls out the locked master ledger (ntds.dit and SQL databases), smashes the shadow vault behind them, and then scrambles every fifth page of the remaining books.',
      plainSummary:
        'In this scenario (T1046, Play Ransomware Grixba Recon, AlphaVSS Shadow Copy Theft & Intermittent Encryption (AA23-352A)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: deploying Custom Grixba .NET Reconnaissance, then alphaVSS .NET Shadow Copy Mounting, then winPE APIUnhooking. Steps #1–#3 walk that chain end-to-end by covering Deploying Custom Grixba .NET Reconnaissance, then AlphaVSS .NET Shadow Copy Mounting, then WinPE APIUnhooking, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a disciplined burglary crew that arrives in three quiet waves. First, they send a custom mechanical scout tucked inside a music closet to map every guard station and storage room; next, they use a custom instant-camera lens to photocopy bolted-down database ledgers without waking normal backup clerks; finally, they push a nimble lock-crew across every floor that snaps a padlock on alternating pages of every large filing cabinet so the whole building freezes at lightning speed.',
      storyMappings: [
        {
          storyTerm: 'Custom mechanical scout tucked inside a music closet',
          technicalTerm: 'Grixba .NET reconnaissance scanner (C:\\Users\\Public\\Music\\inf_g.exe)',
          tone: 'amber',
        },
        {
          storyTerm: 'Custom instant-camera lens photocopying bolted ledgers',
          technicalTerm: 'AlphaVSS.x64.dll and AlphaFS.dll mounting Volume Shadow Copies directly via COM',
          tone: 'sky',
        },
        {
          storyTerm: 'Bypassing lobby camera tripwires before locking cabinets',
          technicalTerm: 'PEB dynamic API resolution and userland API unhooking inside Play encryptor',
          tone: 'rose',
        },
        {
          storyTerm: 'Padlocking alternating pages across every cabinet at lightning speed',
          technicalTerm: 'Intermittent 0x100000-byte stride encryption appending .play and 0xdeadbeef footer',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dropping a self-contained scouting robot into a public media folder, the crew maps every connected computer, active guard software, and backup server across the campus in a single clean sweep.',
        storyMappings: [
          {
            storyTerm: 'Self-contained scouting robot in a public media folder',
            technicalTerm: 'Unsigned .NET Costura-packed Grixba scanner staged at C:\\Users\\Public\\Music\\inf_g.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Full-sweep scouting orders',
            technicalTerm: 'Command-line flags -m:all or -m:s instructing full domain and AV enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Mapped guard stations and backup vaults',
            technicalTerm: 'Exported CSV inventory of endpoints, AV products, and Veeam/backup servers',
            tone: 'rose',
          },
          {
            storyTerm: 'Bundled spare parts hidden inside one shell',
            technicalTerm: 'Costura.Fody embedded .NET assemblies loaded directly from memory',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 1 (Process Creation) and EventID 7 (Image Loaded tracking DLL assemblies) flagging unsigned .NET binaries executing from C:\\Users\\Public\\Music\\ that load embedded Costura assemblies with -m:all or -m:s discovery flags (catching Play Grixba reconnaissance).',
      },
      2: {
        storyAnalogy:
          'Because live corporate databases stay clamped shut while clerks are working, the crew slips a pair of specialized shadow-camera helper lenses into their own toolkit to lift clean copies of locked password ledgers and accounting books without calling the noisy standard shadow-copy tool.',
        storyMappings: [
          {
            storyTerm: 'Pair of specialized shadow-camera helper lenses',
            technicalTerm: 'AlphaVSS.x64.dll (shadow copy COM wrapper) and AlphaFS.dll (long-path volume I/O)',
            tone: 'amber',
          },
          {
            storyTerm: 'Clamped-shut corporate ledgers',
            technicalTerm: 'Exclusively locked C:\\Windows\\NTDS\\ntds.dit and live SQL Server .mdf databases',
            tone: 'sky',
          },
          {
            storyTerm: 'Skipping the noisy standard shadow-copy tool',
            technicalTerm: 'Direct IVssBackupComponents COM invocation bypassing vssadmin.exe CLI alerts',
            tone: 'rose',
          },
          {
            storyTerm: 'Quiet extraction before extortion',
            technicalTerm: 'Staged database theft fueling Play double-extortion pressure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 7 (Image Loaded recording every DLL mapped into memory) for AlphaVSS.x64.dll or AlphaFS.dll alongside Windows VSSEvent operational logs flagging non-backup binaries invoking IVssBackupComponents (exposing covert locked-file theft).',
      },
      3: {
        storyAnalogy:
          'Broadcast across every floor via the building master policy board, the Play lock-crew wipes off the security monitors inspection tape from its own tools and races through every filing cabinet locking alternating one-megabyte blocks so massive archives become unusable in mere seconds.',
        storyMappings: [
          {
            storyTerm: 'Master policy board broadcasting across every floor',
            technicalTerm: 'Active Directory Group Policy Object (GPO) pushing Play ransomware domain-wide',
            tone: 'amber',
          },
          {
            storyTerm: 'Wiping security inspection tape off its own tools',
            technicalTerm: 'Dynamic PEB API resolution and userland EDR hook removal',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking alternating one-megabyte blocks at high speed',
            technicalTerm: 'Intermittent 0x100000-byte stride encryption maximizing corruption velocity',
            tone: 'rose',
          },
          {
            storyTerm: 'Calling card stamped at the bottom of every file',
            technicalTerm: '.play filename extension paired with an embedded 0xdeadbeef file footer marker',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy filesystem minifilter behavioral monitors (kernel-level disk I/O sensors that inspect write patterns in real time) to detect rapid 0x100000-byte stride partial file overwrites, .play extension renames, and trailing 0xdeadbeef file footers. Correlate Sysmon Event 11 and Windows Security Event telemetry for T1486 (pairing write patterns with parent/child process fields) and contain the offending session.',
      },
    },
  };
