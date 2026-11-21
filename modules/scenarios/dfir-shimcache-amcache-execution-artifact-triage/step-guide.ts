import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
          plainSummary: 'In this scenario (T1059.003, Mandiant, ANSSI & SANS DFIR - Application Compatibility Shimcache (AppCompatCache) & Amcache.hve Triage), the attacker follows one continuous arc: ephemeral Binary Execution, then amcache.hve InventoryApplicationFile SHA-1 Hash, then sYSTEM Hive AppCompatCache Temporal Order. Steps #1–#3 examine #1 Ephemeral Binary Execution; #2 Amcache.hve InventoryApplicationFile SHA-1 Hash; #3 SYSTEM Hive AppCompatCache Temporal Order. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
