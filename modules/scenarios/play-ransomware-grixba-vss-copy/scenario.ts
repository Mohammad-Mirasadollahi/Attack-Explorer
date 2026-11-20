import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
