import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-shimcache-amcache-execution-artifact-triage',
    title: 'Mandiant, ANSSI & SANS DFIR — Application Compatibility Shimcache (AppCompatCache) & Amcache.hve Triage',
    category: 'MALWARE',
    mitreId: 'T1059.003',
    description:
      'Grounded in the Mandiant Application Compatibility Cache (Shimcache) Whitepaper, ANSSI Amcache.hve Analysis Guide, and SANS FOR508: even after an attacker deletes a staging binary (C:\\Users\\Public\\psexec64.exe) and clears Event Logs, Windows preserves its LastModifiedTime and execution flag in HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache and its full SHA-1 FileId hash, PE CompileTime, and size in C:\\Windows\\AppCompat\\Programs\\Amcache.hve.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Self-Deleting Tool (psexec64)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Kernel ApphelpCacheControl', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SYSTEM Hive (AppCompatCache)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AppCompatCacheParser & Amcache', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Amcache.hve (SHA-1 FileId)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Ephemeral Binary Execution & Kernel ApphelpCacheControl In-Memory Tracking',
        narration:
          'The attacker drops and executes C:\\Users\\Public\\psexec64.exe before immediately deleting the file via del /f /q. During CreateProcessW, kernel32.dll / ntdll.dll invokes NtApphelpCacheControl to check whether the executable requires application compatibility shims, inserting an entry into the kernel in-memory LRU Shimcache table.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Execution (T1059.003 - Windows Command Shell & AppCompat Tracking)',
        technicalCommands: [
          'C:\\Users\\Public\\psexec64.exe -accepteula \\\\10.10.0.10 cmd.exe',
          'del /f /q C:\\Users\\Public\\psexec64.exe',
          'Kernel Syscall: NtApphelpCacheControl(ApphelpCacheServiceLookup) inserts path + $SI LastModifiedTime into kernel LRU list',
        ],
        defenseMitigation:
          'Collect both live memory and the SYSTEM registry hive during triage because in-memory Shimcache entries are flushed to the SYSTEM hive upon clean shutdown or reboot.',
        logs: [
          {
            id: 'dfir-shim-1',
            timestamp: '09:14:22.104',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 1,
            ProcessName: 'psexec64.exe',
            CommandLine: 'C:\\Users\\Public\\psexec64.exe -accepteula \\\\10.10.0.10 cmd.exe',
            raw: 'EventID: 1 | Image: C:\\Users\\Public\\psexec64.exe | Hashes: SHA1=A94A8FE5CCB19BA61C4C0873D391E987982FBBD3 | Note: File deleted 4 seconds after execution; tracked in ApphelpCacheControl.',
            parsedFields: {
              ExecutablePath: 'C:\\Users\\Public\\psexec64.exe',
              KernelSubsystem: 'NtApphelpCacheControl (Win10/11 10ts magic header)',
              AntiForensicAction: 'del /f /q C:\\Users\\Public\\psexec64.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Amcache.hve InventoryApplicationFile SHA-1 Hash & PE Header Persistence',
        narration:
          'Concurrently, the Application Experience service (aelupsvc / CompatTelRunner.exe) writes a permanent record into C:\\Windows\\AppCompat\\Programs\\Amcache.hve under Root\\InventoryApplicationFile\\psexec64.exe|<Hash>, storing the lowercased full path, FileId (0000 + SHA-1 hash of the first 31.4 MB of the binary), LinkDate (PE compile timestamp), and BinaryType.',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.004 - File Deletion Defeated by Amcache.hve SHA-1)',
        technicalCommands: [
          'AmcacheParser.exe -f "C:\\Windows\\AppCompat\\Programs\\Amcache.hve" --csv C:\\Forensics',
          'Hive Key: Amcache.hve\\Root\\InventoryApplicationFile\\psexec64.exe|f8192a01b2c3d4e5',
          'Values: LowerCaseLongPath="c:\\users\\public\\psexec64.exe", FileId="0000a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"',
        ],
        defenseMitigation:
          'Parse Amcache.hve (plus Amcache.hve.LOG1 and .LOG2 transaction logs) with AmcacheParser.exe and enrich all FileId SHA-1 hashes (stripping the leading 0000) against threat intelligence feeds.',
        logs: [
          {
            id: 'dfir-shim-2',
            timestamp: '09:14:23.012',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 100,
            ProcessName: 'AmcacheParser.exe',
            CommandLine: 'AmcacheParser.exe -f C:\\Windows\\AppCompat\\Programs\\Amcache.hve --nl false',
            raw: 'AMCACHE_RECORD: SubKey="Root\\InventoryApplicationFile" FullPath="c:\\users\\public\\psexec64.exe" SHA1="a94a8fe5ccb19ba61c4c0873d391e987982fbbd3" KeyLastWriteTimestamp="2026-11-03 09:14:22.810" LinkDate="2023-10-12 18:22:10" Publisher="Sysinternals"',
            parsedFields: {
              ForensicHive: 'C:\\Windows\\AppCompat\\Programs\\Amcache.hve',
              RegistrySubKey: 'Root\\InventoryApplicationFile',
              RecoveredSha1: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3 (FileId strip 0000)',
              KeyLastWriteUtc: '2026-11-03 09:14:22.810',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM Hive AppCompatCache (10ts Signature) Temporal Order Reconstruction',
        narration:
          'Parsing HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache with AppCompatCacheParser.exe extracts the Windows 10/11 "10ts" (0x31 0x30 0x74 0x73) binary structure. The CacheEntryPosition index reveals the exact chronological order in which psexec64.exe was evaluated relative to neighboring processes.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1083 - Chronological Execution Reconstruction via Shimcache)',
        technicalCommands: [
          'AppCompatCacheParser.exe -f "C:\\Windows\\System32\\config\\SYSTEM" --csv C:\\Forensics',
          'Registry Value: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache\\AppCompatCache',
          'Header Magic: 31 30 74 73 ("10ts") | CacheEntryPosition=14 | Path="C:\\Users\\Public\\psexec64.exe"',
        ],
        defenseMitigation:
          'Correlate AppCompatCache CacheEntryPosition ordering with Amcache.hve KeyLastWriteTimestamp and SHA-1 hashes to prove binary presence and execution even when event logs and files are wiped.',
        logs: [
          {
            id: 'dfir-shim-3',
            timestamp: '09:20:00.500',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 101,
            ProcessName: 'AppCompatCacheParser.exe',
            CommandLine: 'AppCompatCacheParser.exe -f C:\\Windows\\System32\\config\\SYSTEM',
            raw: 'SHIMCACHE_ENTRY: ControlSet="ControlSet001" CacheEntryPosition=14 Path="C:\\Users\\Public\\psexec64.exe" LastModifiedTimeUTC="2023-10-12 18:22:10" Executed="Yes" Signature="10ts"',
            parsedFields: {
              RegistryKey: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache',
              HeaderSignature: '10ts (0x31307473 Windows 10/11/Server 2019+)',
              CacheEntryPosition: '14 (MRU Order)',
              ExecutedFlag: 'Yes',
            },
          },
        ],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-shimcache-amcache-execution-artifact-triage',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for Mandiant, ANSSI & SANS DFIR, Application Compatibility Shimcache (AppCompatCache) & Amcache.hve Triage',
          storyAnalogy: 'Imagine an intruder who runs a disposable burglary tool on a server and immediately incinerates the tool afterward so no file remains on the shelf. Unbeknownst to the intruder, the operating system built-in compatibility inspector silently logs every passing binary in two separate ledgers: one ledger preserves the exact fingerprint hash and structural measurements of the vanished tool, while the second ledger records the exact chronological parade order in which tools appeared across reboots.',
          storyMappings: [
              {
                  storyTerm: 'Disposable tool incinerated right after running',
                  technicalTerm: 'Ephemeral attacker binary executed then deleted to evade on-disk scanners',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Compatibility inspector watching every arriving tool in memory',
                  technicalTerm: 'Kernel ApphelpCacheControl tracking binary metadata during process launch',
                  tone: 'sky',
                },
              {
                  storyTerm: 'First ledger preserving exact fingerprint hash and measurements',
                  technicalTerm: 'Amcache.hve InventoryApplicationFile storing SHA-1 hash, PE size, and link timestamp',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Second ledger recording chronological parade order across reboots',
                  technicalTerm: 'SYSTEM hive AppCompatCache (Shimcache 10ts signature) ordered execution/presence timeline',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'In this scenario (T1059.003, Mandiant, ANSSI & SANS DFIR - Application Compatibility Shimcache (AppCompatCache) & Amcache.hve Triage), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: ephemeral Binary Execution, then amcache.hve InventoryApplicationFile SHA-1, then sYSTEM Hive AppCompatCache Temporal Order. Steps #1–#3 walk that chain end-to-end by covering Ephemeral Binary Execution, then Amcache.hve InventoryApplicationFile SHA-1, then SYSTEM Hive AppCompatCache Temporal Order, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Self-Deleting Tool , psexec64), Node ② (Kernel ApphelpCacheControl), Node ③ (SYSTEM Hive , AppCompatCache), Node ④ (Runtime Process & Artifact Context), Node ⑤ (Amcache.hve , SHA-1 FileId), and Node ⑥ (AppCompatCacheParser & Amcache) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Official Vendor & CERT DFIR Documentation (T1059.003) · Mandiant, ANSSI & SANS DFIR, Application Compatibility Shimcache (AppCompatCache) & Amcache.hve Triage',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1059.003',
              plainTitle: 'Ephemeral Binary Execution & Kernel ApphelpCacheControl In-Memory Tracking',
              storyAnalogy: 'The instant the intruder executes their temporary reconnaissance or dumping utility and quickly deletes it from disk, the operating system compatibility engine still quietly notes its arrival inside kernel memory to check whether legacy patches are needed.',
              simpleExplanation: 'The attacker drops and executes C:\\Users\\Public\\psexec64.exe before immediately deleting the file via del /f /q. During CreateProcessW, kernel32.dll / ntdll.dll invokes NtApphelpCacheControl to check whether the executable requires application compatibility shims, inserting an entry into the kernel in-memory LRU Shimcache table (logged in Sysmon Event 1 with ExecutablePath=C:\\Users\\Public\\psexec64.exe, KernelSubsystem=NtApphelpCacheControl , Win10/11 10ts magic header, AntiForensicAction=del /f /q C:\\Users\\Public\\psexec64.exe so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes C:\\Users\\Public\\psexec64.exe -accepteula \\\\10.10.0.10 cmd.exe (which executes the technical command / telemetry directive , C:\\Users\\Public\\psexec64.exe -accepteula \\\\10.10.0.10 cmd.exe via psexec64.exe, passing the so that advances the scenario kill-chain under MITRE T1059.003 during "Ephemeral Binary Execution & Kernel ApphelpCacheControl In-Memory Tracking" , The attacker drops and executes C:\\Users\\Public\\psexec64 while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact del /f /q C:\\Users\\Public\\psexec64.exe runs (which executes the technical command / telemetry directive , del /f /q C:\\Users\\Public\\psexec64.exe via psexec64.exe, passing the exact arguments, target so that advances the scenario kill-chain under MITRE T1059.003 during "Ephemeral Binary Execution & Kernel ApphelpCacheControl In-Memory Tracking" , The attacker drops and executes C:\\Users\\Public\\psexec64 while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Self-Deleting Tool , psexec64 and Kernel ApphelpCacheControl toward SYSTEM Hive , AppCompatCache and AppCompatCacheParser & Amcache.',
              detectionAndEvidence: 'Documented in Sysmon Event 1 (recording ExecutablePath=C:\\Users\\Public\\psexec64.exe, KernelSubsystem=NtApphelpCacheControl , Win10/11 10ts magic header, AntiForensicAction=del /f /q C:\\Users\\Public\\psexec64.exe under T1059.003): Collect both live memory and the SYSTEM registry hive during triage because in-memory Shimcache entries are flushed to the SYSTEM hive upon clean shutdown or reboot.',
              storyMappings: [
                  {
                      storyTerm: 'Temporary utility executed and quickly deleted',
                      technicalTerm: 'Ephemeral PE executable staged in C:\\Windows\\Temp and removed post-run',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Operating system compatibility engine checking legacy needs',
                      technicalTerm: 'NT kernel ApphelpCacheControl caching PE path and LastModified metadata in RAM',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Flushed permanently upon graceful shutdown',
                      technicalTerm: 'In-memory Shimcache serialized to the SYSTEM registry hive at OS shutdown/reboot',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Proof surviving complete file deletion',
                      technicalTerm: 'Evidence of binary presence and execution even when zero bytes remain on disk',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1070.004',
              plainTitle: 'Amcache.hve InventoryApplicationFile SHA-1 Hash & PE Header Persistence',
              storyAnalogy: 'Opening the dedicated Application Inventory ledger kept by the operating system, forensic analysts recover the exact cryptographic fingerprint, file size, and compilation date of the deleted attacker binary so they can match it straight against global threat intelligence.',
              simpleExplanation: 'Concurrently, the Application Experience service (aelupsvc / CompatTelRunner.exe) writes a permanent record into C:\\Windows\\AppCompat\\Programs\\Amcache.hve under Root\\InventoryApplicationFile\\psexec64.exe|<Hash>, storing the lowercased full path, FileId (0000 + SHA-1 hash of the first 31.4 MB of the binary), LinkDate (PE compile timestamp), and BinaryType (logged in WinEvent Event 100 with ForensicHive=C:\\Windows\\AppCompat\\Programs\\Amcache.hve, RegistrySubKey=Root\\InventoryApplicationFile, RecoveredSha1=a94a8fe5ccb19ba61c4c0873d391e987982fbbd3 , FileId strip 0000, KeyLastWriteUtc=2026-11-03 09:14:22.810 so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes AmcacheParser.exe -f "C:\\Windows\\AppCompat\\Programs\\Amcache.hve" --csv C:\\Forensics (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1070.004 during "Amcache.hve InventoryApplicationFile SHA-1 Hash & PE Header Persistence" even after the attacker deletes the malware executable from disk). Next, the follow-up artifact Hive Key: Amcache.hve\\Root\\InventoryApplicationFile\\psexec64.exe|f8192a01b2c3d4e5 runs (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1070.004 during "Amcache.hve InventoryApplicationFile SHA-1 Hash & PE Header Persistence" even after the attacker deletes the malware executable from disk).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Self-Deleting Tool , psexec64 and Kernel ApphelpCacheControl toward SYSTEM Hive , AppCompatCache and AppCompatCacheParser & Amcache.',
              detectionAndEvidence: 'Documented in WinEvent Event 100 (recording ForensicHive=C:\\Windows\\AppCompat\\Programs\\Amcache.hve, RegistrySubKey=Root\\InventoryApplicationFile, RecoveredSha1=a94a8fe5ccb19ba61c4c0873d391e987982fbbd3 , FileId strip 0000, KeyLastWriteUtc=2026-11-03 09:14:22.810 under T1070.004): Parse Amcache.hve (plus Amcache.hve.LOG1 and .LOG2 transaction logs) with AmcacheParser.exe and enrich all FileId SHA-1 hashes (stripping the leading 0000) against threat intelligence feeds.',
              storyMappings: [
                  {
                      storyTerm: 'Dedicated Application Inventory ledger',
                      technicalTerm: 'C:\\Windows\\AppCompat\\Programs\\Amcache.hve registry hive',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Exact cryptographic fingerprint of the deleted binary',
                      technicalTerm: 'InventoryApplicationFile FileId field preserving the exact SHA-1 hash (0000<sha1>)',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Structural file measurements',
                      technicalTerm: 'Recorded PE Size, BinaryType, Publisher (unsigned), and LinkDate metadata',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Matching vanished binaries to threat intelligence',
                      technicalTerm: 'Querying Amcache SHA-1 hashes against VirusTotal and YARA intel repositories',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1083',
              plainTitle: 'SYSTEM Hive AppCompatCache (10ts Signature) Temporal Order Reconstruction',
              storyAnalogy: 'Next, analysts examine the SYSTEM Compatibility Cache ribbon stamped with its signature 10ts header, reading the exact ordered sequence of binaries to reconstruct which tools ran right before and right after the deleted payload.',
              simpleExplanation: 'Parsing HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache with AppCompatCacheParser.exe extracts the Windows 10/11 "10ts" (0x31 0x30 0x74 0x73) binary structure. The CacheEntryPosition index reveals the exact chronological order in which psexec64.exe was evaluated relative to neighboring processes (logged in WinEvent Event 101 with RegistryKey=HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache, HeaderSignature=10ts , 0x31307473 Windows 10/11/Server 2019+, CacheEntryPosition=14 , MRU Order, ExecutedFlag=Yes so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes AppCompatCacheParser.exe -f "C:\\Windows\\System32\\config\\SYSTEM" --csv C:\\Forensics (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1083 during "SYSTEM Hive AppCompatCache , 10ts Signature Temporal Order Reconstruction" even after the attacker deletes the malware executable from disk). Next, the follow-up artifact Registry Value: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache\\AppCompatCache runs (which Modifies or queries Windows Registry keys and values , Registry Value: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache\\AppComp so that extracts the 16-byte SysKey / BootKey , stored across the JD, Skew1, GBG, and Data registry classes under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa required to decrypt the PEK and password hashes inside ntds.dit or SAM , T1083).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Self-Deleting Tool , psexec64 and Kernel ApphelpCacheControl toward SYSTEM Hive , AppCompatCache and AppCompatCacheParser & Amcache.',
              detectionAndEvidence: 'Documented in WinEvent Event 101 (recording RegistryKey=HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache, HeaderSignature=10ts , 0x31307473 Windows 10/11/Server 2019+, CacheEntryPosition=14 , MRU Order, ExecutedFlag=Yes under T1083): Correlate AppCompatCache CacheEntryPosition ordering with Amcache.hve KeyLastWriteTimestamp and SHA-1 hashes to prove binary presence and execution even when event logs and files are wiped.',
              storyMappings: [
                  {
                      storyTerm: 'Compatibility Cache ribbon stamped with 10ts header',
                      technicalTerm: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache (10ts header)',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Reading the exact ordered sequence of binaries',
                      technicalTerm: 'AppCompatCacheParser reconstructing relative chronological execution order',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Distinguishing LastModified time from execution time',
                      technicalTerm: 'Understanding Shimcache stores PE $SI LastModified while entry order reflects execution sequence',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Bridging missing event-log gaps',
                      technicalTerm: 'Proving intrusion tool sequence even after Event Logs rolled over or were cleared',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who runs a disposable burglary tool on a server and immediately incinerates the tool afterward so no file remains on the shelf. Unbeknownst to the intruder, the operating system built-in compatibility inspector silently logs every passing binary in two separate ledgers: one ledger preserves the exact fingerprint hash and structural measurements of the vanished tool, while the second ledger records the exact chronological parade order in which tools appeared across reboots.',
      storyMappings: [
        {
          storyTerm: 'Disposable tool incinerated right after running',
          technicalTerm: 'Ephemeral attacker binary executed then deleted to evade on-disk scanners',
          tone: 'amber',
        },
        {
          storyTerm: 'Compatibility inspector watching every arriving tool in memory',
          technicalTerm: 'Kernel ApphelpCacheControl tracking binary metadata during process launch',
          tone: 'sky',
        },
        {
          storyTerm: 'First ledger preserving exact fingerprint hash and measurements',
          technicalTerm: 'Amcache.hve InventoryApplicationFile storing SHA-1 hash, PE size, and link timestamp',
          tone: 'rose',
        },
        {
          storyTerm: 'Second ledger recording chronological parade order across reboots',
          technicalTerm: 'SYSTEM hive AppCompatCache (Shimcache 10ts signature) ordered execution/presence timeline',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The instant the intruder executes their temporary reconnaissance or dumping utility and quickly deletes it from disk, the operating system compatibility engine still quietly notes its arrival inside kernel memory to check whether legacy patches are needed.',
        storyMappings: [
          {
            storyTerm: 'Temporary utility executed and quickly deleted',
            technicalTerm: 'Ephemeral PE executable staged in C:\\Windows\\Temp and removed post-run',
            tone: 'amber',
          },
          {
            storyTerm: 'Operating system compatibility engine checking legacy needs',
            technicalTerm: 'NT kernel ApphelpCacheControl caching PE path and LastModified metadata in RAM',
            tone: 'sky',
          },
          {
            storyTerm: 'Flushed permanently upon graceful shutdown',
            technicalTerm: 'In-memory Shimcache serialized to the SYSTEM registry hive at OS shutdown/reboot',
            tone: 'rose',
          },
          {
            storyTerm: 'Proof surviving complete file deletion',
            technicalTerm: 'Evidence of binary presence and execution even when zero bytes remain on disk',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Opening the dedicated Application Inventory ledger kept by the operating system, forensic analysts recover the exact cryptographic fingerprint, file size, and compilation date of the deleted attacker binary so they can match it straight against global threat intelligence.',
        storyMappings: [
          {
            storyTerm: 'Dedicated Application Inventory ledger',
            technicalTerm: 'C:\\Windows\\AppCompat\\Programs\\Amcache.hve registry hive',
            tone: 'amber',
          },
          {
            storyTerm: 'Exact cryptographic fingerprint of the deleted binary',
            technicalTerm: 'InventoryApplicationFile FileId field preserving the exact SHA-1 hash (0000<sha1>)',
            tone: 'sky',
          },
          {
            storyTerm: 'Structural file measurements',
            technicalTerm: 'Recorded PE Size, BinaryType, Publisher (unsigned), and LinkDate metadata',
            tone: 'rose',
          },
          {
            storyTerm: 'Matching vanished binaries to threat intelligence',
            technicalTerm: 'Querying Amcache SHA-1 hashes against VirusTotal and YARA intel repositories',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Next, analysts examine the SYSTEM Compatibility Cache ribbon stamped with its signature 10ts header, reading the exact ordered sequence of binaries to reconstruct which tools ran right before and right after the deleted payload.',
        storyMappings: [
          {
            storyTerm: 'Compatibility Cache ribbon stamped with 10ts header',
            technicalTerm: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache (10ts header)',
            tone: 'amber',
          },
          {
            storyTerm: 'Reading the exact ordered sequence of binaries',
            technicalTerm: 'AppCompatCacheParser reconstructing relative chronological execution order',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinguishing LastModified time from execution time',
            technicalTerm: 'Understanding Shimcache stores PE $SI LastModified while entry order reflects execution sequence',
            tone: 'rose',
          },
          {
            storyTerm: 'Bridging missing event-log gaps',
            technicalTerm: 'Proving intrusion tool sequence even after Event Logs rolled over or were cleared',
            tone: 'emerald',
          },
        ],
      },
    },
  };
