import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    title: 'Microsoft Sysinternals & Splunk SURGe DFIR — LSASS MiniDump via comsvcs.dll & Sysmon EventID 10',
    category: 'MALWARE',
    mitreId: 'T1003.001',
    description:
      'Grounded in Microsoft Sysinternals Sysmon Event ID 10 documentation, Splunk SURGe credential dumping research, and MITRE ATT&CK T1003.001: an attacker dumps lsass.exe process memory using the signed Windows COM+ Services DLL (rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump), generating a characteristic GrantedAccess mask (0x1FFFFF or 0x1410) and CallTrace signature in Sysmon EventID 10 and Security EventID 4656.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Shell Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Win32 Process Manager (CSR)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'rundll32.exe (comsvcs.dll)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 10 & EID 11 Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'lsass.exe (PID 684 Memory)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SeDebugPrivilege Enablement & LSASS PID Discovery (Security EventID 4703 / 4672)',
        narration:
          'Before opening a handle to the protected Local Security Authority Subsystem Service (lsass.exe, PID 684), the attacker enables SeDebugPrivilege in their access token via AdjustTokenPrivileges (logged under Windows Security EventID 4703) and queries tasklist /fi "imagename eq lsass.exe" to resolve the target PID.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1134 - Access Token Manipulation: SeDebugPrivilege)',
        technicalCommands: [
          'whoami /priv  # Verify SeDebugPrivilege is Enabled',
          'tasklist /svc /fi "imagename eq lsass.exe"  # Resolves lsass.exe PID 684',
          'AdjustTokenPrivileges(hToken, FALSE, SE_DEBUG_NAME) -> EventID 4703',
        ],
        defenseMitigation:
          'Enable Windows RunAsPPL (Protected Process Light) via HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL=1 and Windows Defender Credential Guard to block non-PPL userland handles to lsass.exe.',
        logs: [
          {
            id: 'dfir-lsass-1',
            timestamp: '11:14:02.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4703,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -NoP -Command "Get-Process lsass | Select-Object Id"',
            raw: 'EventID: 4703 | Account Name: admin_ops | Process Name: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | Enabled Privilege List: SeDebugPrivilege | Target Process: lsass.exe (PID 684)',
            parsedFields: {
              EventID: '4703 (Token Right Adjusted)',
              EnabledPrivilege: 'SeDebugPrivilege',
              TargetProcess: 'lsass.exe (PID 684)',
              ExecutingProcess: 'powershell.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Cross-Process OpenProcess & MiniDumpWriteDump via comsvcs.dll (Sysmon EventID 10)',
        narration:
          'The attacker executes rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full. Internally, comsvcs.dll invokes OpenProcess(PROCESS_ALL_ACCESS 0x1FFFFF) on lsass.exe and calls dbghelp.dll!MiniDumpWriteDump, which Sysmon EventID 10 captures with CallTrace entries pointing directly through comsvcs.dll and dbgcore.dll.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - OS Credential Dumping: LSASS Memory)',
        technicalCommands: [
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,#24 684 C:\\Windows\\Temp\\debug.bin full  # Ordinal #24 bypasses naive CLI filters',
          'Sysmon EventID 10: TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF CallTrace=...comsvcs.dll+...dbgcore.dll',
        ],
        defenseMitigation:
          'Hunt on Sysmon EventID 10 where TargetImage ends with \\lsass.exe, GrantedAccess contains 0x1FFFFF, 0x1410, 0x1010, or 0x1438, and CallTrace includes comsvcs.dll, dbghelp.dll, or dbgcore.dll.',
        logs: [
          {
            id: 'dfir-lsass-2',
            timestamp: '11:14:05.490',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
            raw: 'EventID: 10 | SourceImage: C:\\Windows\\System32\\rundll32.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | GrantedAccess: 0x1fffff | CallTrace: C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|C:\\Windows\\System32\\KERNELBASE.dll+2c13e|C:\\Windows\\System32\\comsvcs.dll+4218a|C:\\Windows\\SYSTEM32\\dbgcore.dll+8412',
            parsedFields: {
              EventID: '10 (Sysmon ProcessAccess) / 4656 (Security Object Handle)',
              SourceImage: 'C:\\Windows\\System32\\rundll32.exe',
              TargetImage: 'C:\\Windows\\System32\\lsass.exe',
              GrantedAccess: '0x1FFFFF (PROCESS_ALL_ACCESS)',
              CallTrace: 'ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: MDMP Magic Header (4D 44 4D 50) File Creation & Offline Pypykatz Parsing (Sysmon EventID 11)',
        narration:
          'dbgcore.dll writes the complete LSASS virtual memory snapshot to C:\\Windows\\Temp\\debug.bin beginning with the 4-byte Windows Minidump signature 4D 44 4D 50 ("MDMP"). Sysmon EventID 11 logs the creation of the dump file by rundll32.exe before the attacker exfiltrates it to parse wdigest, msv1_0, and kerberos structures with pypykatz.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - Minidump File Artifact & Offline Parsing)',
        technicalCommands: [
          'Sysmon EventID 11: Image=C:\\Windows\\System32\\rundll32.exe TargetFilename=C:\\Windows\\Temp\\debug.bin',
          'File Header Magic: 4D 44 4D 50 93 A7 00 00 ("MDMP" Minidump Header)',
          'pypykatz lsa minidump debug.bin',
        ],
        defenseMitigation:
          'Deploy YARA/EDR file-write inspection for the 4D 44 4D 50 ("MDMP") magic header written by non-WER processes (such as rundll32.exe, taskmgr.exe, or powershell.exe).',
        logs: [
          {
            id: 'dfir-lsass-3',
            timestamp: '11:14:06.102',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\rundll32.exe | TargetFilename: C:\\Windows\\Temp\\debug.bin | CreationUtcTime: 2026-11-03 11:14:06.102 | FileMagic: 4D444D50 (MDMP) | Size: 68419584 bytes',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              Image: 'C:\\Windows\\System32\\rundll32.exe',
              TargetFilename: 'C:\\Windows\\Temp\\debug.bin',
              FileHeaderSignature: '4D 44 4D 50 (MDMP Minidump)',
            },
          },
        ],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
      scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
      briefing: {
          headline: 'Scenario Briefing: Official DFIR & Log Forensics Guide for Microsoft Sysinternals & Splunk SURGe DFIR, LSASS MiniDump via comsvcs.dll & Sysmon EventID 10',
          storyAnalogy: 'Imagine a bank whose active guardroom holds every unlocked employee keycard inside live working memory so workers do not have to re-type passwords all day. Instead of bringing in a banned lockpicking kit that front-desk scanners instantly recognize, an intruder unlocks a special debugger pass, calls over a genuinely signed built-in crash-snapshot clerk to photograph the entire guardroom memory onto a hidden file stamped with a telltale four-letter wax header, and quietly carries the photograph offsite to extract every keycard.',
          storyMappings: [
              {
                  storyTerm: 'Unlocking a special debugger pass to spot the guardroom',
                  technicalTerm: 'SeDebugPrivilege enablement (EventID 4672) and LSASS PID discovery',
                  tone: 'amber',
                },
              {
                  storyTerm: 'Calling a signed built-in crash-snapshot clerk to photograph memory',
                  technicalTerm: 'rundll32.exe comsvcs.dll, MiniDump invoking OpenProcess + MiniDumpWriteDump (Sysmon EventID 10)',
                  tone: 'sky',
                },
              {
                  storyTerm: 'Hidden file stamped with a telltale four-letter wax header',
                  technicalTerm: 'Output dump file beginning with MDMP magic bytes (4D 44 4D 50)',
                  tone: 'rose',
                },
              {
                  storyTerm: 'Extracting every keycard quietly offsite',
                  technicalTerm: 'Offline Pypykatz / Mimikatz parsing of LSASS memory dump for NTLM hashes and Kerberos tickets',
                  tone: 'emerald',
                },
            ],
          plainSummary: 'On a Windows workstation (MITRE T1003.001), an attacker enables debug privileges, then uses the signed comsvcs.dll MiniDump export through rundll32 to snapshot lsass.exe memory into an on-disk MDMP file without loading a known credential-theft tool. Steps #1 cover privilege adjustment and process discovery in Security logs, Step #2 analyze cross-process OpenProcess and MiniDump calls in Sysmon EventID 10, and Step #3 verify the minidump header and offline credential parsing from file-create telemetry. Primary detection pivots on Sysmon process access to lsass.exe with broad GrantedAccess masks and a CallTrace that includes comsvcs.dll or MiniDumpWriteDump.',
          diagramTopologySummary: 'The forensic topology spans Node ① (Attacker Shell Session), Node ② (Win32 Process Manager , CSR), Node ③ (rundll32.exe , comsvcs.dll), Node ④ (Runtime Process & Artifact Context), Node ⑤ (lsass.exe , PID 684 Memory), and Node ⑥ (Sysmon EID 10 & EID 11 Sensor) across 3 chronological steps (#1 to #3).',
          documentedAdvisory: 'Microsoft Sysinternals Sysmon EventID 10 Specification, Splunk SURGe Credential Dumping Research & MITRE ATT&CK T1003.001',
        },
      steps: [
          {
              stepNumber: 1,
              mitreId: 'T1134',
              plainTitle: 'SeDebugPrivilege Enablement & LSASS PID Discovery (Security EventID 4703 / 4672)',
              storyAnalogy: 'Holding administrator clearance, the intruder switches on the master debugging badge that lets an examiner peer inside other locked rooms, then looks up the exact room number assigned to the central credential guardroom.',
              simpleExplanation: 'Before opening a handle to the protected Local Security Authority Subsystem Service (lsass.exe, PID 684), the attacker enables SeDebugPrivilege in their access token via AdjustTokenPrivileges (logged under Windows Security EventID 4703) and queries tasklist /fi "imagename eq lsass.exe" to resolve the target PID (logged in WinEvent Event 4703 with EventID=4703 , Token Right Adjusted, EnabledPrivilege=SeDebugPrivilege, TargetProcess=lsass.exe , PID 684, ExecutingProcess=powershell.exe so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes whoami /priv # Verify SeDebugPrivilege is Enabled (which executes the technical command / telemetry directive , whoami /priv # Verify SeDebugPrivilege is Enabled via System / Runtime Execution Interface so that advances the scenario kill-chain under MITRE T1134 during "SeDebugPrivilege Enablement & LSASS PID Discovery , Security EventID 4703 / 4672" , Before opening a handle to the protected Local Security Authority Subsystem Service , lsass while generating verifiable host or network telemetry for DFIR attribution). Next, the follow-up artifact tasklist /svc /fi "imagename eq lsass.exe" # Resolves lsass.exe PID 684 runs (which invokes or targets the host daemon/process , tasklist /svc /fi "imagename eq lsass.exe" # Resolves lsass.exe PID 684 with its runtime command-line so that advances the scenario kill-chain under MITRE T1134 during "SeDebugPrivilege Enablement & LSASS PID Discovery , Security EventID 4703 / 4672" , Before opening a handle to the protected Local Security Authority Subsystem Service , lsass while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #1 / Link #1 across the topology from Attacker Shell Session and Win32 Process Manager , CSR toward rundll32.exe , comsvcs.dll and Sysmon EID 10 & EID 11 Sensor.',
              detectionAndEvidence: 'Documented in WinEvent Event 4703 (recording EventID=4703 , Token Right Adjusted, EnabledPrivilege=SeDebugPrivilege, TargetProcess=lsass.exe , PID 684, ExecutingProcess=powershell.exe under T1134): Enable Windows RunAsPPL (Protected Process Light) via HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL=1 and Windows Defender Credential Guard to block non-PPL userland handles to lsass.exe.',
              storyMappings: [
                  {
                      storyTerm: 'Switching on the master debugging badge',
                      technicalTerm: 'Enabling SeDebugPrivilege recorded in Windows Security EventID 4672',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Central credential guardroom',
                      technicalTerm: 'Windows Local Security Authority Subsystem Service (lsass.exe)',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Looking up the exact room number',
                      technicalTerm: 'Enumerating lsass.exe Process ID via tasklist or Get-Process lsass',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Setting up a living-off-the-land extraction',
                      technicalTerm: 'Preparing target PID argument for signed comsvcs.dll MiniDump export',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 2,
              mitreId: 'T1003.001',
              plainTitle: 'Cross-Process OpenProcess & MiniDumpWriteDump via comsvcs.dll (Sysmon EventID 10)',
              storyAnalogy: 'Rather than launching a notorious hacker utility, the intruder invokes a signed Microsoft system helper library to open a deep inspection door into the guardroom and snap a complete memory photograph straight to disk while the hallway sensor stamps the exact permission mask used.',
              simpleExplanation: 'The attacker executes rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full. Internally, comsvcs.dll invokes OpenProcess(PROCESS_ALL_ACCESS 0x1FFFFF) on lsass.exe and calls dbghelp.dll!MiniDumpWriteDump, which Sysmon EventID 10 captures with CallTrace entries pointing directly through comsvcs.dll and dbgcore.dll (logged in Sysmon Event 10 with EventID=10 , Sysmon ProcessAccess / 4656 , Security Object Handle, SourceImage=C:\\Windows\\System32\\rundll32.exe, TargetImage=C:\\Windows\\System32\\lsass.exe, GrantedAccess=0x1FFFFF , PROCESS_ALL_ACCESS, CallTrace=ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full (which invokes the signed Windows proxy binary rundll32.exe to load C:\\Windows\\System32\\comsvcs.dll and call its MiniDump export , or ordinal #24, passing so that dumps the full virtual memory of lsass.exe to disk , T1003.001 using a built-in Microsoft DLL , comsvcs.dll -> MiniDumpWriteDump instead of dropping third-party tools like procdump.exe or mimikatz.exe, triggering Sysmon EventID 10 with GrantedAccess=0x1FFFFF). Next, the follow-up artifact rundll32.exe C:\\Windows\\System32\\comsvcs.dll,#24 684 C:\\Windows\\Temp\\debug.bin full # Ordinal #24 bypasses naive CLI filters runs (which invokes the signed Windows proxy binary rundll32.exe to load C:\\Windows\\System32\\comsvcs.dll and call its MiniDump export , or ordinal #24, passing so that dumps the full virtual memory of lsass.exe to disk , T1003.001 using a built-in Microsoft DLL , comsvcs.dll -> MiniDumpWriteDump instead of dropping third-party tools like procdump.exe or mimikatz.exe, triggering Sysmon EventID 10 with GrantedAccess=0x1FFFFF).',
              diagramAlignment: 'On the diagram, follow Step #2 / Link #2 across the topology from Attacker Shell Session and Win32 Process Manager , CSR toward rundll32.exe , comsvcs.dll and Sysmon EID 10 & EID 11 Sensor.',
              detectionAndEvidence: 'Documented in Sysmon Event 10 (recording EventID=10 , Sysmon ProcessAccess / 4656 , Security Object Handle, SourceImage=C:\\Windows\\System32\\rundll32.exe, TargetImage=C:\\Windows\\System32\\lsass.exe, GrantedAccess=0x1FFFFF , PROCESS_ALL_ACCESS, CallTrace=ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll under T1003.001): Hunt on Sysmon EventID 10 where TargetImage ends with \\lsass.exe, GrantedAccess contains 0x1FFFFF, 0x1410, 0x1010, or 0x1438, and CallTrace includes comsvcs.dll, dbghelp.dll, or dbgcore.dll.',
              storyMappings: [
                  {
                      storyTerm: 'Signed Microsoft system helper library',
                      technicalTerm: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump <lsass_pid> <out> full',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Deep inspection door opened into the guardroom',
                      technicalTerm: 'Cross-process OpenProcess handle request to lsass.exe (GrantedAccess 0x1010 / 0x1FFFFF)',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Snapping a complete memory photograph',
                      technicalTerm: 'MiniDumpWriteDump writing live LSASS virtual memory pages to disk',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Hallway sensor stamping the exact permission mask',
                      technicalTerm: 'Sysmon EventID 10 (ProcessAccess) capturing SourceImage, TargetImage lsass.exe, and CallTrace',
                      tone: 'emerald',
                    },
                ],
            },
          {
              stepNumber: 3,
              mitreId: 'T1003.001',
              plainTitle: 'MDMP Magic Header (4D 44 4D 50) File Creation & Offline Pypykatz Parsing (Sysmon EventID 11)',
              storyAnalogy: 'Even if the intruder disguises the resulting photograph with an innocent-looking text or picture filename, the file opening four bytes still carry the unmistakable MDMP studio watermark, letting defenders spot the theft while the attacker parses credentials offline.',
              simpleExplanation: 'dbgcore.dll writes the complete LSASS virtual memory snapshot to C:\\Windows\\Temp\\debug.bin beginning with the 4-byte Windows Minidump signature 4D 44 4D 50 ("MDMP"). Sysmon EventID 11 logs the creation of the dump file by rundll32.exe before the attacker exfiltrates it to parse wdigest, msv1_0, and kerberos structures with pypykatz (logged in Sysmon Event 11 with EventID=11 , Sysmon FileCreate, Image=C:\\Windows\\System32\\rundll32.exe, TargetFilename=C:\\Windows\\Temp\\debug.bin, FileHeaderSignature=4D 44 4D 50 , MDMP Minidump so analysts can verify the exact actor and target artifact).',
              howItWorksInPractice: 'Under the hood, the observed step executes Sysmon EventID 11: Image=C:\\Windows\\System32\\rundll32.exe TargetFilename=C:\\Windows\\Temp\\debug.bin (which executes Microsoft\'s signed rundll32.exe host binary to load a target DLL into memory and directly invoke its exported function entrypoint , Sysmon so that proxies execution of malicious DLL code , T1003.001 through a trusted, Microsoft-signed system binary during "MDMP Magic Header , 4D 44 4D 50 File Creation & Offline Pypykatz Parsing , Sysmon EventID 11" to evade application allowlisting and process-name heuristics). Next, the follow-up artifact File Header Magic: 4D 44 4D 50 93 A7 00 00 ("MDMP" Minidump Header) runs (which executes the technical command / telemetry directive , File Header Magic: 4D 44 4D 50 93 A7 00 00 , "MDMP" Minidump Header via System / Runtime Exe so that advances the scenario kill-chain under MITRE T1003.001 during "MDMP Magic Header , 4D 44 4D 50 File Creation & Offline Pypykatz Parsing , Sysmon EventID 11" , dbgcore while generating verifiable host or network telemetry for DFIR attribution).',
              diagramAlignment: 'On the diagram, follow Step #3 / Link #3 across the topology from Attacker Shell Session and Win32 Process Manager , CSR toward rundll32.exe , comsvcs.dll and Sysmon EID 10 & EID 11 Sensor.',
              detectionAndEvidence: 'Documented in Sysmon Event 11 (recording EventID=11 , Sysmon FileCreate, Image=C:\\Windows\\System32\\rundll32.exe, TargetFilename=C:\\Windows\\Temp\\debug.bin, FileHeaderSignature=4D 44 4D 50 , MDMP Minidump under T1003.001): Deploy YARA/EDR file-write inspection for the 4D 44 4D 50 ("MDMP") magic header written by non-WER processes (such as rundll32.exe, taskmgr.exe, or powershell.exe).',
              storyMappings: [
                  {
                      storyTerm: 'Unmistakable four-byte studio watermark inside the file',
                      technicalTerm: 'Windows Minidump file magic header MDMP (hex bytes 4D 44 4D 50)',
                      tone: 'amber',
                    },
                  {
                      storyTerm: 'Disguised innocent filename on disk',
                      technicalTerm: 'Renamed dump file (e.g., C:\\Windows\\Temp\\debug.txt) flagged by magic-byte scanning',
                      tone: 'sky',
                    },
                  {
                      storyTerm: 'Parsing every keycard safely offsite',
                      technicalTerm: 'Offline pypykatz lsa minidump extraction of NTLM hashes, Kerberos tickets, and DPAPI keys',
                      tone: 'rose',
                    },
                  {
                      storyTerm: 'Hardening the guardroom door permanently',
                      technicalTerm: 'Enabling LSASS RunAsPPL (Protected Process Light) and Credential Guard',
                      tone: 'emerald',
                    },
                ],
            },
        ],
    };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a bank whose active guardroom holds every unlocked employee keycard inside live working memory so workers do not have to re-type passwords all day. Instead of bringing in a banned lockpicking kit that front-desk scanners instantly recognize, an intruder unlocks a special debugger pass, calls over a genuinely signed built-in crash-snapshot clerk to photograph the entire guardroom memory onto a hidden file stamped with a telltale four-letter wax header, and quietly carries the photograph offsite to extract every keycard.',
      storyMappings: [
        {
          storyTerm: 'Unlocking a special debugger pass to spot the guardroom',
          technicalTerm: 'SeDebugPrivilege enablement (EventID 4672) and LSASS PID discovery',
          tone: 'amber',
        },
        {
          storyTerm: 'Calling a signed built-in crash-snapshot clerk to photograph memory',
          technicalTerm: 'rundll32.exe comsvcs.dll, MiniDump invoking OpenProcess + MiniDumpWriteDump (Sysmon EventID 10)',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden file stamped with a telltale four-letter wax header',
          technicalTerm: 'Output dump file beginning with MDMP magic bytes (4D 44 4D 50)',
          tone: 'rose',
        },
        {
          storyTerm: 'Extracting every keycard quietly offsite',
          technicalTerm: 'Offline Pypykatz / Mimikatz parsing of LSASS memory dump for NTLM hashes and Kerberos tickets',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding administrator clearance, the intruder switches on the master debugging badge that lets an examiner peer inside other locked rooms, then looks up the exact room number assigned to the central credential guardroom.',
        storyMappings: [
          {
            storyTerm: 'Switching on the master debugging badge',
            technicalTerm: 'Enabling SeDebugPrivilege recorded in Windows Security EventID 4672',
            tone: 'amber',
          },
          {
            storyTerm: 'Central credential guardroom',
            technicalTerm: 'Windows Local Security Authority Subsystem Service (lsass.exe)',
            tone: 'sky',
          },
          {
            storyTerm: 'Looking up the exact room number',
            technicalTerm: 'Enumerating lsass.exe Process ID via tasklist or Get-Process lsass',
            tone: 'rose',
          },
          {
            storyTerm: 'Setting up a living-off-the-land extraction',
            technicalTerm: 'Preparing target PID argument for signed comsvcs.dll MiniDump export',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Rather than launching a notorious hacker utility, the intruder invokes a signed Microsoft system helper library to open a deep inspection door into the guardroom and snap a complete memory photograph straight to disk while the hallway sensor stamps the exact permission mask used.',
        storyMappings: [
          {
            storyTerm: 'Signed Microsoft system helper library',
            technicalTerm: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump <lsass_pid> <out> full',
            tone: 'amber',
          },
          {
            storyTerm: 'Deep inspection door opened into the guardroom',
            technicalTerm: 'Cross-process OpenProcess handle request to lsass.exe (GrantedAccess 0x1010 / 0x1FFFFF)',
            tone: 'sky',
          },
          {
            storyTerm: 'Snapping a complete memory photograph',
            technicalTerm: 'MiniDumpWriteDump writing live LSASS virtual memory pages to disk',
            tone: 'rose',
          },
          {
            storyTerm: 'Hallway sensor stamping the exact permission mask',
            technicalTerm: 'Sysmon EventID 10 (ProcessAccess) capturing SourceImage, TargetImage lsass.exe, and CallTrace',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder disguises the resulting photograph with an innocent-looking text or picture filename, the file opening four bytes still carry the unmistakable MDMP studio watermark, letting defenders spot the theft while the attacker parses credentials offline.',
        storyMappings: [
          {
            storyTerm: 'Unmistakable four-byte studio watermark inside the file',
            technicalTerm: 'Windows Minidump file magic header MDMP (hex bytes 4D 44 4D 50)',
            tone: 'amber',
          },
          {
            storyTerm: 'Disguised innocent filename on disk',
            technicalTerm: 'Renamed dump file (e.g., C:\\Windows\\Temp\\debug.txt) flagged by magic-byte scanning',
            tone: 'sky',
          },
          {
            storyTerm: 'Parsing every keycard safely offsite',
            technicalTerm: 'Offline pypykatz lsa minidump extraction of NTLM hashes, Kerberos tickets, and DPAPI keys',
            tone: 'rose',
          },
          {
            storyTerm: 'Hardening the guardroom door permanently',
            technicalTerm: 'Enabling LSASS RunAsPPL (Protected Process Light) and Credential Guard',
            tone: 'emerald',
          },
        ],
      },
    },
  };
