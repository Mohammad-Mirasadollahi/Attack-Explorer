import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2',
    title: 'SANS DFIR & Microsoft Sysmon — NTFS $MFT $STANDARD_INFORMATION vs $FILE_NAME Timestomping (Sysmon EventID 2)',
    category: 'MALWARE',
    mitreId: 'T1070.006',
    description:
      'Grounded in SANS FOR508 NTFS Master File Table ($MFT) analysis, Microsoft Sysinternals Sysmon Event ID 2 specifications, and MITRE ATT&CK T1070.006: a malware dropper calls NtSetInformationFile (FileBasicInformation) to backdate a newly dropped binary to match kernel32.dll, modifying the $STANDARD_INFORMATION (0x10) attribute while leaving the kernel-managed $FILE_NAME (0x30) attribute and $UsnJrnl:$J creation timestamp at the true drop time.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Malware Dropper Process', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ntdll!NtSetInformationFile', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Ntfs.sys Driver ($MFT Record)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 2 & MFTECmd Parser', type: 'siem', status: 'normal' },
      { id: 'ad', label: '$STANDARD_INFO vs $FILE_NAME', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Payload Drop & True Creation Timestamp in $MFT $FILE_NAME (0x30) Attribute (Sysmon EventID 11)',
        narration:
          'When the dropper creates C:\\Windows\\System32\\winhttp_helper.dll at 2026-11-03 16:40:12.8491023 UTC, the NTFS filesystem driver (Ntfs.sys) allocates an $MFT record and populates both the $STANDARD_INFORMATION (attribute 0x10) and $FILE_NAME (attribute 0x30) MACB timestamps with full 100-nanosecond FILETIME precision.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1070.006 - Indicator Removal: Timestomp)',
        technicalCommands: [
          'NtCreateFile("C:\\Windows\\System32\\winhttp_helper.dll")',
          'MFT Attribute 0x10 ($STANDARD_INFORMATION) Created: 2026-11-03 16:40:12.8491023 UTC',
          'MFT Attribute 0x30 ($FILE_NAME) Created: 2026-11-03 16:40:12.8491023 UTC',
        ],
        defenseMitigation:
          'Enable Sysmon EventID 11 (FileCreate) and EventID 2 (FileCreateTime) across all system directories.',
        logs: [
          {
            id: 'dfir-timestomp-1',
            timestamp: '16:40:12.849',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'updater_svc.exe',
            CommandLine: 'updater_svc.exe dropping C:\\Windows\\System32\\winhttp_helper.dll',
            raw: 'EventID: 11 | Image: C:\\Users\\Public\\updater_svc.exe | TargetFilename: C:\\Windows\\System32\\winhttp_helper.dll | CreationUtcTime: 2026-11-03 16:40:12.849',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              TargetFilename: 'C:\\Windows\\System32\\winhttp_helper.dll',
              TrueCreationUtcTime: '2026-11-03 16:40:12.8491023 UTC',
              MftEntryNumber: '94102',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: User-Mode NtSetInformationFile Timestomping & Sysmon EventID 2 Detection',
        narration:
          'The dropper invokes SetFileTime / NtSetInformationFile(FileBasicInformation) or PowerShell (Get-Item winhttp_helper.dll).CreationTime = "2022-05-07 09:00:00" to blend in with legitimate OS binaries. Sysmon EventID 2 (A process changed a file creation time) immediately logs both the forged CreationUtcTime (2022-05-07) and the true PreviousCreationUtcTime (2026-11-03).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.006 - Sysmon EventID 2 FileCreateTime Changed)',
        technicalCommands: [
          'NtSetInformationFile(hFile, &ioStatus, &fileBasicInfo, sizeof(FILE_BASIC_INFORMATION), FileBasicInformation)',
          'Sysmon EventID 2: TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll CreationUtcTime=2022-05-07 09:00:00.000 PreviousCreationUtcTime=2026-11-03 16:40:12.849',
        ],
        defenseMitigation:
          'Alert on Sysmon EventID 2 where TargetFilename resides in C:\\Windows\\, C:\\ProgramData\\, or C:\\Users\\ and CreationUtcTime is backdated by more than 24 hours.',
        logs: [
          {
            id: 'dfir-timestomp-2',
            timestamp: '16:40:13.012',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 2,
            ProcessName: 'updater_svc.exe',
            CommandLine: 'NtSetInformationFile(FileBasicInformation) backdating winhttp_helper.dll to 2022-05-07',
            raw: 'EventID: 2 | Image: C:\\Users\\Public\\updater_svc.exe | TargetFilename: C:\\Windows\\System32\\winhttp_helper.dll | CreationUtcTime: 2022-05-07 09:00:00.000 | PreviousCreationUtcTime: 2026-11-03 16:40:12.849',
            parsedFields: {
              EventID: '2 (Sysmon FileCreateTime Changed)',
              TargetFilename: 'C:\\Windows\\System32\\winhttp_helper.dll',
              ForgedCreationUtcTime: '2022-05-07 09:00:00.000',
              PreviousCreationUtcTime: '2026-11-03 16:40:12.849',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Offline $MFT $SI < $FN Anomaly & Sub-Second Nanosecond Zeroing Analysis (MFTECmd)',
        narration:
          'Because user-mode Win32/NT APIs only modify the $STANDARD_INFORMATION (0x10) attribute while $FILE_NAME (0x30) is updated strictly by the NTFS kernel driver on file creation/move/rename, parsing C:\\$MFT with MFTECmd reveals a classic "$SI < $FN" discrepancy ($SI Created = 2022-05-07 09:00:00.0000000 with zeroed fractional seconds vs $FN Created = 2026-11-03 16:40:12.8491023).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.006 - $MFT $STANDARD_INFORMATION vs $FILE_NAME Discrepancy)',
        technicalCommands: [
          'MFTECmd.exe -f "C:\\$MFT" --csv C:\\Forensics --csvf mft_parsed.csv',
          '$SI Created0x10: 2022-05-07 09:00:00.0000000 (Zeroed sub-second nanoseconds)',
          '$FN Created0x30: 2026-11-03 16:40:12.8491023 (Kernel-protected true creation time)',
        ],
        defenseMitigation:
          'During offline NTFS disk triage, flag any $MFT record in System32 where Created0x10 < Created0x30 or where Created0x10 has exact .0000000 sub-second fractional zeros.',
        logs: [
          {
            id: 'dfir-timestomp-3',
            timestamp: '16:45:00.100',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 94102,
            ProcessName: 'MFTECmd.exe',
            CommandLine: 'MFTECmd.exe -f C:\\$MFT (Entry 94102: Created0x10 < Created0x30 & Sub-Second Zeroing)',
            raw: 'MFT_RECORD: EntryNumber=94102 FileName="winhttp_helper.dll" InUse=True Created0x10="2022-05-07 09:00:00.0000000" Created0x30="2026-11-03 16:40:12.8491023" uSecZeros=True',
            parsedFields: {
              ForensicArtifact: 'C:\\$MFT (Master File Table Entry #94102)',
              StandardInfo0x10: '2022-05-07 09:00:00.0000000 (uSecZeros=True)',
              FileName0x30: '2026-11-03 16:40:12.8491023 (True Drop Timestamp)',
              AnomalyClassification: '$SI < $FN Timestomp + Sub-Second Nanosecond Zeroing',
            },
          },
        ],
      },
    ],
  };
