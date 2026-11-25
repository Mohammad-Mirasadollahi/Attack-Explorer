import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for SANS DFIR & Microsoft Sysmon, NTFS $MFT $STANDARD_INFORMATION vs $FILE_NAME Timestomping (Sysmon EventID 2)',
          storyAnalogy: 'Imagine a museum thief who sneaks a freshly forged painting into a gallery and alters the small brass date plaque on the front frame to read ten years ago so casual visitors assume it has always hung there. Unbeknownst to the thief, the museum core structural catalog keeps a second, tamper-proof shipping date sealed deep inside the wall frame that ordinary tools cannot touch, instantly exposing the forgery the moment curators compare the front plaque against the hidden wall stamp.',
          storyMappings: [
              {
                  storyTerm: 'Tamper-proof shipping date sealed deep inside the wall frame',
                  technicalTerm: 'NTFS $MFT $FILE_NAME (0x30) creation timestamp modifiable only by the NT kernel',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Altering the front frame brass date plaque to ten years ago',
                  technicalTerm: 'User-mode NtSetInformationFile timestomping $STANDARD_INFORMATION (0x10) (Sysmon EventID 2)',
                  tone: 'sky',
                },
              {
                  storyTerm: 'Curators spotting a front plaque older than the wall stamp',
                  technicalTerm: 'Offline $MFT forensic rule flagging $SI Created < $FN Created anomaly',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Suspiciously rounded zero-second chisel marks on the plaque',
                  technicalTerm: 'Sub-second nanosecond zeroing (.0000000) left by crude timestomping tools',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'In this scenario (T1070.006, SANS DFIR & Microsoft Sysmon - NTFS $MFT $STANDARD_INFORMATION vs $FILE_NAME Timestomping (Sysmon EventID 2)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: payload Drop, then user-Mode NtSetInformationFile Timestomping, then offline $MFT $SI < $FN Anomaly. Steps #1–#3 walk that chain end-to-end by covering Payload Drop, then User-Mode NtSetInformationFile Timestomping, then Offline $MFT $SI < $FN Anomaly, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 11 with the documented host and network chain.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Malware Dropper Process), Node ② (ntdll!NtSetInformationFile), Node ③ (Ntfs.sys Driver , $MFT Record), Node ④ (Runtime Process & Artifact Context), Node ⑤ ($STANDARD_INFO vs $FILE_NAME), and Node ⑥ (Sysmon EID 2 & MFTECmd Parser) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'SANS FOR508 NTFS Master File Table ($MFT) Analysis, Microsoft Sysinternals Sysmon EventID 2 & MITRE ATT&CK T1070.006',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1070.006',
              plainTitle: 'Payload Drop & True Creation Timestamp in $MFT $FILE_NAME (0x30) Attribute (Sysmon EventID 11)',
              storyAnalogy: 'The moment the intruder drops their malware binary onto the hard drive, the filesystem kernel stamps the true arrival date simultaneously onto both the public front plaque and the hidden kernel-protected inner shipping card.',
              simpleExplanation: 'When the dropper creates C:\\Windows\\System32\\winhttp_helper.dll at 2026-11-03 16:40:12.8491023 UTC, the NTFS filesystem driver (Ntfs.sys) allocates an $MFT record and populates both the $STANDARD_INFORMATION (attribute 0x10) and $FILE_NAME (attribute 0x30) MACB timestamps with full 100-nanosecond FILETIME precision (logged in Sysmon Event 11 with EventID=11 , Sysmon FileCreate, TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll, TrueCreationUtcTime=2026-11-03 16:40:12.8491023 UTC, MftEntryNumber=94102 so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes NtCreateFile("C:\\Windows\\System32\\winhttp_helper.dll") (which executes the technical command / telemetry directive , NtCreateFile, "C:\\Windows\\System32\\winhttp_helper.dll" via winhttp_helper.dll, passing the e so that advances the scenario kill-chain under MITRE T1070.006 during "Payload Drop & True Creation Timestamp in $MFT $FILE_NAME , 0x30 Attribute , Sysmon EventID 11" , When the dropper creates C:\\Windows\\System32\\winhttp_helper while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact MFT Attribute 0x10 ($STANDARD_INFORMATION) Created: 2026-11-03 16:40:12.8491023 UTC runs (which executes the technical command / telemetry directive , MFT Attribute 0x10 , $STANDARD_INFORMATION Created: 2026-11-03 16:40:12.8491023 UTC via Syst so that advances the scenario kill-chain under MITRE T1070.006 during "Payload Drop & True Creation Timestamp in $MFT $FILE_NAME , 0x30 Attribute , Sysmon EventID 11" , When the dropper creates C:\\Windows\\System32\\winhttp_helper while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Malware Dropper Process and ntdll!NtSetInformationFile toward Ntfs.sys Driver , $MFT Record and Sysmon EID 2 & MFTECmd Parser.',
              detectionAndEvidence: 'Documented in Sysmon Event 11 (recording EventID=11 , Sysmon FileCreate, TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll, TrueCreationUtcTime=2026-11-03 16:40:12.8491023 UTC, MftEntryNumber=94102 under T1070.006): Enable Sysmon EventID 11 (FileCreate) and EventID 2 (FileCreateTime) across all system directories.',
              storyMappings: [
                  {
                      storyTerm: 'Public front plaque shown by everyday tools',
                      technicalTerm: 'NTFS $MFT $STANDARD_INFORMATION (attribute 0x10) timestamps viewed by dir / Explorer',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Hidden kernel-protected inner shipping card',
                      technicalTerm: 'NTFS $MFT $FILE_NAME (attribute 0x30) timestamps updated exclusively by the kernel',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'True arrival date recorded at file birth',
                      technicalTerm: 'Matching initial creation timestamps across both 0x10 and 0x30 MFT attributes',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Master building catalog storing every file record',
                      technicalTerm: 'NTFS Master File Table ($MFT) tracking 1024-byte metadata records per file',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1070.006',
              plainTitle: 'User-Mode NtSetInformationFile Timestomping & Sysmon EventID 2 Detection',
              storyAnalogy: 'Trying to blend their brand-new implant among decade-old operating-system utilities, the intruder runs a backdating tool that rewrites the public front plaque to match an old system binary while a watchful security camera logs the exact moment the date was faked.',
              simpleExplanation: 'The dropper invokes SetFileTime / NtSetInformationFile(FileBasicInformation) or PowerShell (Get-Item winhttp_helper.dll).CreationTime = "2022-05-07 09:00:00" to blend in with legitimate OS binaries. Sysmon EventID 2 (A process changed a file creation time) immediately logs both the forged CreationUtcTime (2022-05-07) and the true PreviousCreationUtcTime (2026-11-03) (logged in Sysmon Event 2 with EventID=2 , Sysmon FileCreateTime Changed, TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll, ForgedCreationUtcTime=2022-05-07 09:00:00.000, PreviousCreationUtcTime=2026-11-03 16:40:12.849 so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes NtSetInformationFile(hFile, &ioStatus, &fileBasicInfo, sizeof, FILE_BASIC_INFORMATION, FileBasicInformation) (which executes the technical command / telemetry directive , NtSetInformationFile, hFile, &ioStatus, &fileBasicInfo, sizeof, FILE_BASIC_INFORMATION, File so that advances the scenario kill-chain under MITRE T1070.006 during "User-Mode NtSetInformationFile Timestomping & Sysmon EventID 2 Detection" , The dropper invokes SetFileTime / NtSetInformationFile, FileBasicInformation or PowerShell , Get-Item winhttp_helper while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact Sysmon EventID 2: TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll CreationUtcTime=2022-05-07 09:00:00.000 PreviousCreationUtcTime=2026-11-03 16:40:12.849 runs (which executes the technical command / telemetry directive , Sysmon EventID 2: TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll CreationUtcTime=2022 so that advances the scenario kill-chain under MITRE T1070.006 during "User-Mode NtSetInformationFile Timestomping & Sysmon EventID 2 Detection" , The dropper invokes SetFileTime / NtSetInformationFile, FileBasicInformation or PowerShell , Get-Item winhttp_helper while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Malware Dropper Process and ntdll!NtSetInformationFile toward Ntfs.sys Driver , $MFT Record and Sysmon EID 2 & MFTECmd Parser.',
              detectionAndEvidence: 'Documented in Sysmon Event 2 (recording EventID=2 , Sysmon FileCreateTime Changed, TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll, ForgedCreationUtcTime=2022-05-07 09:00:00.000, PreviousCreationUtcTime=2026-11-03 16:40:12.849 under T1070.006): Alert on Sysmon EventID 2 where TargetFilename resides in C:\\Windows\\, C:\\ProgramData\\, or C:\\Users\\ and CreationUtcTime is backdated by more than 24 hours.',
              storyMappings: [
                  {
                      storyTerm: 'Backdating tool rewriting the public front plaque',
                      technicalTerm: 'User-mode NtSetInformationFile / SetFileTime altering $STANDARD_INFORMATION (0x10)',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Matching an old trusted system utility date',
                      technicalTerm: 'Copying CreationTime from cmd.exe or kernel32.dll onto the dropped payload',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Security camera logging the fake date swap',
                      technicalTerm: 'Sysmon EventID 2 (File creation time changed) recording CreationUtcTime vs PreviousCreationUtcTime',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Inner kernel card left completely untouched',
                      technicalTerm: '$FILE_NAME (0x30) retaining the true recent file creation timestamp',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1070.006',
              plainTitle: 'Offline $MFT $SI < $FN Anomaly & Sub-Second Nanosecond Zeroing Analysis (MFTECmd)',
              storyAnalogy: 'Pulling the raw Master File Table offline, the forensic examiner immediately compares every file front date against its hidden inner shipping date, catching both impossible backward time-travel mismatches and unnaturally crisp zero-nanosecond endings.',
              simpleExplanation: 'Because user-mode Win32/NT APIs only modify the $STANDARD_INFORMATION (0x10) attribute while $FILE_NAME (0x30) is updated strictly by the NTFS kernel driver on file creation/move/rename, parsing C:\\$MFT with MFTECmd reveals a classic "$SI < $FN" discrepancy ($SI Created = 2022-05-07 09:00:00.0000000 with zeroed fractional seconds vs $FN Created = 2026-11-03 16:40:12.8491023) (logged in WinEvent Event 94102 with ForensicArtifact=C:\\$MFT , Master File Table Entry #94102, StandardInfo0x10=2022-05-07 09:00:00.0000000 , uSecZeros=True, FileName0x30=2026-11-03 16:40:12.8491023 , True Drop Timestamp, AnomalyClassification=$SI < $FN Timestomp + Sub-Second Nanosecond Zeroing so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes MFTECmd.exe -f "C:\\$MFT" --csv C:\\Forensics --csvf mft_parsed.csv (which Parses or manipulates low-level NTFS Master File Table , $MFT record attributes, comparing the user-modifiable $STANDARD_INFORMATION , 0x10 timesta so that exposes anti-forensic timestomping , NtSetInformationFile · T1070.006 or deleted file activity during "Offline $MFT $SI < $FN Anomaly & Sub-Second Nanosecond Zeroing Analysis , MFTECmd" by proving that the 0x10 creation timestamp was backdated earlier than the immutable 0x30 kernel creation timestamp). Next, the follow-up artifact $SI Created0x10: 2022-05-07 09:00:00.0000000 (Zeroed sub-second nanoseconds) runs (which Parses or manipulates low-level NTFS Master File Table , $MFT record attributes, comparing the user-modifiable $STANDARD_INFORMATION , 0x10 timesta so that exposes anti-forensic timestomping , NtSetInformationFile · T1070.006 or deleted file activity during "Offline $MFT $SI < $FN Anomaly & Sub-Second Nanosecond Zeroing Analysis , MFTECmd" by proving that the 0x10 creation timestamp was backdated earlier than the immutable 0x30 kernel creation timestamp).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Malware Dropper Process and ntdll!NtSetInformationFile toward Ntfs.sys Driver , $MFT Record and Sysmon EID 2 & MFTECmd Parser.',
              detectionAndEvidence: 'Documented in WinEvent Event 94102 (recording ForensicArtifact=C:\\$MFT , Master File Table Entry #94102, StandardInfo0x10=2022-05-07 09:00:00.0000000 , uSecZeros=True, FileName0x30=2026-11-03 16:40:12.8491023 , True Drop Timestamp, AnomalyClassification=$SI < $FN Timestomp + Sub-Second Nanosecond Zeroing under T1070.006): During offline NTFS disk triage, flag any $MFT record in System32 where Created0x10 < Created0x30 or where Created0x10 has exact .0000000 sub-second fractional zeros.',
              storyMappings: [
                  {
                      storyTerm: 'Impossible backward time-travel mismatch',
                      technicalTerm: 'Offline MFTECmd analysis proving $SI (0x10) Created timestamp is earlier than $FN (0x30) Created',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Unnaturally crisp zero-nanosecond endings',
                      technicalTerm: 'Exact .0000000 sub-second fractional zeros caused by low-precision API timestomping',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'True timeline reconstructed for the court report',
                      technicalTerm: 'Correlating $FN (0x30) creation time with $UsnJrnl to pinpoint exact drop time',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Defeating anti-forensic timeline confusion',
                      technicalTerm: 'Proving deliberate MITRE T1070.006 timestomping tampering',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a museum thief who sneaks a freshly forged painting into a gallery and alters the small brass date plaque on the front frame to read ten years ago so casual visitors assume it has always hung there. Unbeknownst to the thief, the museum core structural catalog keeps a second, tamper-proof shipping date sealed deep inside the wall frame that ordinary tools cannot touch, instantly exposing the forgery the moment curators compare the front plaque against the hidden wall stamp.',
      storyMappings: [
        {
          storyTerm: 'Tamper-proof shipping date sealed deep inside the wall frame',
          technicalTerm: 'NTFS $MFT $FILE_NAME (0x30) creation timestamp modifiable only by the NT kernel',
          tone: 'amber',
        },
        {
          storyTerm: 'Altering the front frame brass date plaque to ten years ago',
          technicalTerm: 'User-mode NtSetInformationFile timestomping $STANDARD_INFORMATION (0x10) (Sysmon EventID 2)',
          tone: 'sky',
        },
        {
          storyTerm: 'Curators spotting a front plaque older than the wall stamp',
          technicalTerm: 'Offline $MFT forensic rule flagging $SI Created < $FN Created anomaly',
          tone: 'rose',
        },
        {
          storyTerm: 'Suspiciously rounded zero-second chisel marks on the plaque',
          technicalTerm: 'Sub-second nanosecond zeroing (.0000000) left by crude timestomping tools',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The moment the intruder drops their malware binary onto the hard drive, the filesystem kernel stamps the true arrival date simultaneously onto both the public front plaque and the hidden kernel-protected inner shipping card.',
        storyMappings: [
          {
            storyTerm: 'Public front plaque shown by everyday tools',
            technicalTerm: 'NTFS $MFT $STANDARD_INFORMATION (attribute 0x10) timestamps viewed by dir / Explorer',
            tone: 'amber',
          },
          {
            storyTerm: 'Hidden kernel-protected inner shipping card',
            technicalTerm: 'NTFS $MFT $FILE_NAME (attribute 0x30) timestamps updated exclusively by the kernel',
            tone: 'sky',
          },
          {
            storyTerm: 'True arrival date recorded at file birth',
            technicalTerm: 'Matching initial creation timestamps across both 0x10 and 0x30 MFT attributes',
            tone: 'rose',
          },
          {
            storyTerm: 'Master building catalog storing every file record',
            technicalTerm: 'NTFS Master File Table ($MFT) tracking 1024-byte metadata records per file',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Trying to blend their brand-new implant among decade-old operating-system utilities, the intruder runs a backdating tool that rewrites the public front plaque to match an old system binary while a watchful security camera logs the exact moment the date was faked.',
        storyMappings: [
          {
            storyTerm: 'Backdating tool rewriting the public front plaque',
            technicalTerm: 'User-mode NtSetInformationFile / SetFileTime altering $STANDARD_INFORMATION (0x10)',
            tone: 'amber',
          },
          {
            storyTerm: 'Matching an old trusted system utility date',
            technicalTerm: 'Copying CreationTime from cmd.exe or kernel32.dll onto the dropped payload',
            tone: 'sky',
          },
          {
            storyTerm: 'Security camera logging the fake date swap',
            technicalTerm: 'Sysmon EventID 2 (File creation time changed) recording CreationUtcTime vs PreviousCreationUtcTime',
            tone: 'rose',
          },
          {
            storyTerm: 'Inner kernel card left completely untouched',
            technicalTerm: '$FILE_NAME (0x30) retaining the true recent file creation timestamp',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Pulling the raw Master File Table offline, the forensic examiner immediately compares every file front date against its hidden inner shipping date, catching both impossible backward time-travel mismatches and unnaturally crisp zero-nanosecond endings.',
        storyMappings: [
          {
            storyTerm: 'Impossible backward time-travel mismatch',
            technicalTerm: 'Offline MFTECmd analysis proving $SI (0x10) Created timestamp is earlier than $FN (0x30) Created',
            tone: 'amber',
          },
          {
            storyTerm: 'Unnaturally crisp zero-nanosecond endings',
            technicalTerm: 'Exact .0000000 sub-second fractional zeros caused by low-precision API timestomping',
            tone: 'sky',
          },
          {
            storyTerm: 'True timeline reconstructed for the court report',
            technicalTerm: 'Correlating $FN (0x30) creation time with $UsnJrnl to pinpoint exact drop time',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating anti-forensic timeline confusion',
            technicalTerm: 'Proving deliberate MITRE T1070.006 timestomping tampering',
            tone: 'emerald',
          },
        ],
      },
    },
  };
