import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-vhd-iso-motw-bypass-zone-identifier-forensics',
    title: 'Microsoft Threat Intel & Elastic DFIR — ISO / VHD Virtual Disk Mount, Zone.Identifier ADS & LNK Shellbags Forensics',
    category: 'MALWARE',
    mitreId: 'T1553.005',
    description:
      'Grounded in Microsoft Threat Intelligence Mark-of-the-Web (MotW) research, Elastic Security Labs container delivery analysis, and MITRE ATT&CK T1553.005: an initial-access payload is delivered inside an optical/virtual disk container (Invoice_Oct.iso / .vhd). Double-clicking mounts the container as a virtual drive letter via vhdmp.sys (logging VHDMP-Operational EventID 1 / 12 and Sysmon EventID 15 Zone.Identifier ADS on the outer container), while the user’s interaction inside the mounted volume is recorded in USRCLASS.DAT Shellbags and a weaponized .lnk file.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Malicious Container (Invoice.vhd)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'NTFS Zone.Identifier (Sysmon 15)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'vhdmp.sys Virtual Disk Mount', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'VHDMP EID 1/12 & Shellbags', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Mounted Volume E:\\ (.lnk + DLL)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Container Download & NTFS Zone.Identifier Alternate Data Stream Creation (Sysmon EventID 15)',
        narration:
          'When the user downloads Invoice_Oct.vhd from an external webmail link, the browser writes the NTFS Alternate Data Stream Invoice_Oct.vhd:Zone.Identifier containing [ZoneTransfer] ZoneId=3 (Internet), ReferrerUrl, and HostUrl. Sysmon EventID 15 (FileCreateStreamHash) captures the exact Contents of the Zone.Identifier stream.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1566.002 - Spearphishing Link & Mark-of-the-Web ADS)',
        technicalCommands: [
          'Sysmon EventID 15 (FileCreateStreamHash): TargetFilename=C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd:Zone.Identifier',
          'ADS Content: [ZoneTransfer] ZoneId=3 ReferrerUrl=https://mail.external-share.com/ HostUrl=https://cdn.external-share.com/Invoice_Oct.vhd',
        ],
        defenseMitigation:
          'Enable Sysmon EventID 15 to capture Zone.Identifier Alternate Data Streams at download time, preserving the original HostUrl and ReferrerUrl even if the user later deletes the container.',
        logs: [
          {
            id: 'dfir-vhd-1',
            timestamp: '09:30:11.204',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 15,
            ProcessName: 'msedge.exe',
            CommandLine: 'msedge.exe writing C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd:Zone.Identifier',
            raw: 'EventID: 15 | Image: C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe | TargetFilename: C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd:Zone.Identifier | Contents: [ZoneTransfer]  ZoneId=3  ReferrerUrl=https://portal.doc-delivery.net/  HostUrl=https://portal.doc-delivery.net/Invoice_Oct.vhd',
            parsedFields: {
              EventID: '15 (Sysmon FileCreateStreamHash)',
              AlternateDataStream: 'Invoice_Oct.vhd:Zone.Identifier',
              ZoneId: '3 (URLZONE_INTERNET)',
              HostUrl: 'https://portal.doc-delivery.net/Invoice_Oct.vhd',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Virtual Disk Mount via vhdmp.sys & Microsoft-Windows-VHDMP-Operational EventID 1 / 12',
        narration:
          'When the user double-clicks Invoice_Oct.vhd, Windows Explorer mounts the virtual hard disk via the VHD Miniport Driver (vhdmp.sys) as drive E:\\. Microsoft-Windows-VHDMP-Operational logs EventID 1 (VHD surfaced as disk number 2) and EventID 12 (File C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd opened as virtual disk). Prior to Windows 11 22H2 / KB5019959, FAT32/UDF files inside ISO/VHD containers did not inherit the outer MotW Zone.Identifier.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1553.005 - Subvert Trust Controls: Mark-of-the-Web Bypass)',
        technicalCommands: [
          'Microsoft-Windows-VHDMP-Operational EventID 1: VHD C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd surfaced as Disk #2',
          'Microsoft-Windows-VHDMP-Operational EventID 12: Virtual disk handle opened by System (PID 4)',
          'System EventID 157 / Partition-Diagnostic: Virtual disk mounted at volume E:\\',
        ],
        defenseMitigation:
          'Change default file associations for .iso, .vhd, .vhdx, and .img away from Windows Explorer Disc Image Mounter via GPO and monitor Microsoft-Windows-VHDMP-Operational EventID 1 and 12.',
        logs: [
          {
            id: 'dfir-vhd-2',
            timestamp: '09:30:18.540',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'explorer.exe',
            CommandLine: 'explorer.exe mounting C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd -> Volume E:\\',
            raw: 'LogName: Microsoft-Windows-VHDMP-Operational | EventID: 1 | VhdFile: C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd | VhdType: 1 (FIXED) | DiskNumber: 2 | Status: 0x0',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-VHDMP-Operational',
              EventID: '1 (VHD Surfaced) / 12 (VHD Handle Opened)',
              MountedContainerPath: 'C:\\Users\\jdoe\\Downloads\\Invoice_Oct.vhd',
              MountedDriveLetter: 'E:\\ (DiskNumber 2)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: USRCLASS.DAT Shellbags E:\\ Navigation & Weaponized .LNK Execution (LECmd & SBECmd)',
        narration:
          'Inside the newly mounted E:\\ drive, the user opens E:\\Invoice_Oct.lnk (which hides a hidden E:\\rundll32_loader.dll). Even after the attacker unmounts E:\\ and deletes Invoice_Oct.vhd, Windows Explorer records the user browsing E:\\ inside USRCLASS.DAT (Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU) and creates a Jump List / Recent LNK record in %APPDATA%\\Microsoft\\Windows\\Recent\\ containing the LNK TrackerDataBlock MachineID and VolumeDroid.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1204.002 - User Execution: Malicious File & LNK/Shellbag Artifacts)',
        technicalCommands: [
          'SBECmd.exe -d "C:\\Users\\jdoe\\AppData\\Local\\Microsoft\\Windows" --csv C:\\Forensics  # Parses USRCLASS.DAT BagMRU for E:\\',
          'LECmd.exe -d "C:\\Users\\jdoe\\AppData\\Roaming\\Microsoft\\Windows\\Recent" --csv C:\\Forensics  # Parses Invoice_Oct.lnk target args',
          'LNK Target: C:\\Windows\\System32\\rundll32.exe E:\\rundll32_loader.dll,DllRegisterServer',
        ],
        defenseMitigation:
          'Correlate VHDMP-Operational EventID 1/12 with USRCLASS.DAT Shellbags (SBECmd) and Recent LNK files (LECmd) to reconstruct the full container-to-LNK-to-DLL execution chain.',
        logs: [
          {
            id: 'dfir-vhd-3',
            timestamp: '09:30:22.910',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'rundll32.exe',
            CommandLine: 'C:\\Windows\\System32\\rundll32.exe E:\\rundll32_loader.dll,DllRegisterServer',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\explorer.exe | Image: C:\\Windows\\System32\\rundll32.exe | CommandLine: rundll32.exe E:\\rundll32_loader.dll,DllRegisterServer | ShellbagPath: USRCLASS.DAT\\BagMRU\\0\\3 (My Computer\\E:\\) | RecentLnk: Invoice_Oct.lnk',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              LnkTargetCommand: 'rundll32.exe E:\\rundll32_loader.dll,DllRegisterServer',
              ShellbagArtifact: 'USRCLASS.DAT\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU (Drive E:\\)',
              RecentLnkArtifact: '%APPDATA%\\Microsoft\\Windows\\Recent\\Invoice_Oct.lnk',
            },
          },
        ],
      },
    ],
  };
