import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
