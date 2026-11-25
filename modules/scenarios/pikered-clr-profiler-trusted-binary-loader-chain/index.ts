import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'pikered-clr-profiler-trusted-binary-loader-chain',
    title: 'PikeRed Research & MITRE T1574.012 — Abusing the .NET CLR Profiler: VHDX MotW Bypass & Trusted-Binary Loader Chain (KeePass.exe -> clr.dll)',
    category: 'MALWARE',
    mitreId: 'T1574.012',
    description:
      'Grounded in PikeRed cybersecurity research ("Abusing the CLR Profiler: A Trusted-Binary Loader Chain for Initial Access") and MITRE ATT&CK T1574.012: an attacker delivers a weaponized `.vhdx` container that strips Mark-of-the-Web (`Zone.Identifier` ADS) upon mounting, conceals operational binaries using Windows `Hidden` + `System` (`+h +s`) file attributes, and sets `.NET` Common Language Runtime (CLR) diagnostic environment variables (`COR_ENABLE_PROFILING=1`, `COR_PROFILER`, `COR_PROFILER_PATH`) before launching a signed, trusted `.NET` application (`KeePass.exe`) so `clr.dll!ProfilingAPIUtility::LoadProfiler` automatically loads an unmanaged COM profiler DLL (`ICorProfilerCallback::Initialize`) in-process.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Initial Access Delivery (Weaponized .vhdx)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Mounted VHDX Volume (MotW Stripped + attrib +h +s)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Launcher Setting COR_ENABLE_PROFILING=1 & COR_PROFILER_PATH', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'PikeRed / Sysmon EID 1, 7 & VHDMP Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Signed KeePass.exe -> clr.dll -> ICorProfilerCallback::Initialize', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: VHDX Container Mounting (MotW Bypass) & `attrib +h +s` Super-Hidden File Concealment',
        narration:
          'The user opens a weaponized `.vhdx` virtual hard disk (`Payroll_2026.vhdx`). Windows mounts the virtual disk via `vhdmp.sys` (logging VHDMP Operational EventID 1 / 12), and because NTFS `Zone.Identifier` Mark-of-the-Web (MotW) streams are not propagated to files inside mounted VHDX volumes, SmartScreen is bypassed. Inside the mounted drive (`E:\\`), the signed `.NET` host binary (`KeePass.exe`) and custom profiler DLL (`ProfilerLoader.dll`) are marked with both `FILE_ATTRIBUTE_HIDDEN` and `FILE_ATTRIBUTE_SYSTEM` (`attrib +h +s`), leaving only a single decoy shortcut visible in Explorer even when "Show hidden files" is enabled.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access & Defense Evasion (T1553.005 - Mark-of-the-Web Bypass / T1564.001 - Hidden Files)',
        technicalCommands: [
          'Mount-DiskImage -ImagePath "C:\\Users\\victim\\Downloads\\Payroll_2026.vhdx" (Mounts volume E:\\ without Zone.Identifier MotW)',
          'attrib.exe +h +s E:\\.runtime\\KeePass.exe && attrib.exe +h +s E:\\.runtime\\ProfilerLoader.dll',
        ],
        defenseMitigation:
          'Block `.vhdx`, `.vhd`, and `.iso` auto-mounting via Group Policy or file-extension association hardening, and correlate `Microsoft-Windows-VHDMP-Operational` EventID 12 with process creation from newly mounted drive letters.',
        logs: [
          {
            id: 'pikered-1',
            timestamp: '11:04:10.115',
            source: 'Windows Event Log',
            severity: 'critical',
            EventCode: 12,
            ProcessName: 'explorer.exe',
            raw: 'LogName: Microsoft-Windows-VHDMP-Operational | EventID: 12 | VhdFile: C:\\Users\\victim\\Downloads\\Payroll_2026.vhdx | MountedVolume: E:\\ | FileAttributes: FILE_ATTRIBUTE_HIDDEN | FILE_ATTRIBUTE_SYSTEM (+h +s) on E:\\.runtime\\* | Reference: PikeRed CLR Profiler Research',
            parsedFields: {
              ContainerFormat: 'VHDX Virtual Hard Disk (Bypassing NTFS Zone.Identifier MotW)',
              FileConcealment: 'attrib +h +s (Hidden + System super-hidden attributes)',
              VisibleTrigger: 'Decoy LNK Shortcut on Mounted Volume E:\\',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Process Environment Seeding (`COR_ENABLE_PROFILING=1`, `COR_PROFILER`, `COR_PROFILER_PATH`)',
        narration:
          'When the user double-clicks the decoy shortcut on `E:\\`, the execution trigger populates three Common Language Runtime (CLR) profiling variables inside the child process environment block—`COR_ENABLE_PROFILING=1`, `COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}`, and `COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll`—and immediately spawns the legitimate, digitally signed `.NET` application (`KeePass.exe`) without writing any registry keys (`HKCU\\Software\\Classes\\CLSID` is not needed when `COR_PROFILER_PATH` is used on .NET 4+).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence, Privilege Escalation & Defense Evasion (T1574.012 - Hijack Execution Flow: COR_PROFILER)',
        technicalCommands: [
          'cmd.exe /c "set COR_ENABLE_PROFILING=1 && set COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6} && set COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll && start \"\" E:\\.runtime\\KeePass.exe"',
        ],
        defenseMitigation:
          'Inspect the `Environment` field in Sysmon EventID 1 or EDR process creation telemetry for `COR_ENABLE_PROFILING=1` and `COR_PROFILER_PATH=` on non-developer workstations.',
        logs: [
          {
            id: 'pikered-2',
            timestamp: '11:04:14.380',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'KeePass.exe',
            CommandLine: 'E:\\.runtime\\KeePass.exe',
            raw: 'EventID: 1 | Image: E:\\.runtime\\KeePass.exe | Signed: true (Dominik Reichl / Trusted .NET Assembly) | Environment: COR_ENABLE_PROFILING=1; COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}; COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll',
            parsedFields: {
              TrustedHostBinary: 'KeePass.exe (Legitimate Signed .NET Framework Executable)',
              CorEnableProfiling: 'COR_ENABLE_PROFILING=1',
              CorProfilerGuid: '{B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}',
              CorProfilerPath: 'E:\\.runtime\\ProfilerLoader.dll (Registry-free .NET 4+ loading)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: `mscoree.dll` -> `clr.dll!ProfilingAPIUtility::LoadProfiler` & `ICorProfilerCallback::Initialize` Execution',
        narration:
          'During `KeePass.exe` startup, the .NET shim (`mscoree.dll`) initializes the Common Language Runtime (`clr.dll`). `clr.dll!ProfilingAPIUtility::LoadProfiler` reads `COR_ENABLE_PROFILING=1` and `COR_PROFILER_PATH`, loads the unmanaged C++ COM server `ProfilerLoader.dll` into `KeePass.exe` via `LoadLibraryW`, resolves `DllGetClassObject` + `IClassFactory::CreateInstance`, and invokes `ICorProfilerCallback::Initialize(IUnknown *pICorProfilerInfoUnk)`, executing the attacker’s payload inside the trusted `KeePass.exe` process without any cross-process injection API calls.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion & Execution (T1574.012 - COR_PROFILER / Trusted-Binary Loader Chain)',
        technicalCommands: [
          'clr.dll!ProfilingAPIUtility::LoadProfiler() -> LoadLibraryW("E:\\.runtime\\ProfilerLoader.dll") -> DllGetClassObject()',
          'ProfilerLoader.dll!ICorProfilerCallback2::Initialize(pICorProfilerInfoUnk) -> Executes C2 loader inside signed KeePass.exe',
        ],
        defenseMitigation:
          'Correlate Windows Application Event Log ID `1022` (`.NET Runtime` profiler loaded notification) and Sysmon EventID 7 where a signed `.NET` binary loads an unsigned unmanaged DLL from a mounted VHDX or user-writable path.',
        logs: [
          {
            id: 'pikered-3',
            timestamp: '11:04:14.920',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'KeePass.exe',
            raw: 'EventID: 7 | Image: E:\\.runtime\\KeePass.exe | ImageLoaded: E:\\.runtime\\ProfilerLoader.dll | Signed: false | CallTrace: mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler -> ProfilerLoader.dll!ICorProfilerCallback::Initialize | .NET Runtime EventID: 1022',
            parsedFields: {
              ClrRuntimeEngine: 'mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler',
              ComEntryPoint: 'DllGetClassObject -> ICorProfilerCallback::Initialize()',
              DotNetEventLog: '.NET Runtime EventID 1022 (Profiler was loaded successfully)',
              ReferenceUrl: 'https://www.pikered.com/en/learn/abusing-the-clr-profiler-a-trusted-binary-loader-chain-for-initial-access/',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'pikered-clr-profiler-trusted-binary-loader-chain',
    briefing: {
      headline:
        'Scenario Briefing: PikeRed CLR Profiler Abuse (MITRE T1574.012), VHDX MotW Bypass and Trusted KeePass.exe Loader Chain',
      storyAnalogy:
        'Imagine a smuggler who ships a sealed virtual cargo container so the individual tools inside skip the harbor customs warning stamp, hides the real machinery behind a double-hidden false wall, scribbles three official-looking diagnostic-inspection override notes onto the workshop launch clipboard, and starts a genuine digitally signed password vault so the vault own built-in runtime engine dutifully bolts on and launches the smuggler custom code without ever touching the permanent system registry.',
      plainSummary:
        'In this scenario (T1553.005, PikeRed Research & MITRE T1574.012 - Abusing the .NET CLR Profiler: VHDX MotW Bypass & Trusted-Binary Loader Chain (KeePass.exe -> clr.dll)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: vHDX Container Mounting and attrib +h +s, then process Environment Seeding, then clr.dll ProfilingAPIUtility LoadProfiler. Steps #1–#3 walk that chain end-to-end by covering VHDX Container Mounting and attrib +h +s, then Process Environment Seeding, then clr.dll ProfilingAPIUtility LoadProfiler, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (weaponized Payroll_2026.vhdx delivery), follow Node ② (mounted E: volume with MotW stripped and attrib +h +s concealment), Node ③ (COR_ENABLE_PROFILING seeding), Step #1 through #3 into Node ⑤ (signed KeePass.exe loading ProfilerLoader.dll via clr.dll), monitored by Node ⑥ (VHDMP, Sysmon EID 1/7, PikeRed research telemetry).',
      documentedAdvisory:
        'PikeRed Security Research (Abusing the CLR Profiler) · Microsoft .NET Profiling API · MITRE ATT&CK T1574.012 / T1553.005',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1553.005',
        plainTitle:
          'VHDX Container Mounting (MotW Bypass) and attrib +h +s Super-Hidden File Concealment',
        storyAnalogy:
          'After the user opens a downloaded sealed virtual cargo crate whose customs warning tag stays stuck strictly to the outer crate wall, a clean-looking shortcut launches while the actual binary parts sit invisible behind super-hidden system-file flags.',
        simpleExplanation:
          'The user mounts Payroll_2026.vhdx (a weaponized virtual hard disk). Windows assigns drive E: through vhdmp.sys (logging VHDMP Operational Event ID 12) and does not copy NTFS Zone.Identifier Mark-of-the-Web streams onto files inside the mounted volume, so SmartScreen never sees the inner binaries. The attacker marks KeePass.exe and ProfilerLoader.dll under E:\\.runtime\\ with hidden and system attributes (attrib +h +s), leaving only a decoy shortcut visible in Explorer.',
        howItWorksInPractice:
          'Mounting a VHDX keeps the MotW alternate data stream on the outer .vhdx file only; every executable staged inside the volume therefore launches without the download warning that would normally block unknown files. Pairing +h +s attributes further hides the real host binary and profiler DLL from casual directory listings even when hidden files are shown.',
        diagramAlignment:
          'On the diagram, Step #1 runs from Node ① (delivery) through Node ② (mounted VHDX volume E:) while the decoy shortcut prepares KeePass.exe and ProfilerLoader.dll on Node ③.',
        detectionAndEvidence:
          'Documented in Microsoft-Windows-VHDMP-Operational Event ID 12: correlate a fresh mount of a user-downloaded .vhdx with process creation whose image path uses the new drive letter and with attrib +h +s on binaries inside that mount.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.012',
        plainTitle:
          'Process Environment Seeding (COR_ENABLE_PROFILING=1, COR_PROFILER, COR_PROFILER_PATH)',
        storyAnalogy:
          'Skipping the heavily watched central registry shelves completely, the launcher writes three legitimate diagnostic-profiling overrides straight onto the temporary launch clipboard handed exclusively to the brand-new signed application.',
        simpleExplanation:
          'When the user runs the decoy shortcut on E:, the launcher sets COR_ENABLE_PROFILING=1, COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}, and COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll on the child process environment block, then starts the legitimate signed KeePass.exe without touching HKCU registry profiler keys (registry-free loading on .NET 4+).',
        howItWorksInPractice:
          'CLR profiling variables in the process environment block are inherited only by the child KeePass.exe instance, avoiding persistent HKCU or HKLM Environment keys that blue teams often monitor. Sysmon Event ID 1 can still capture the full Environment field on process create.',
        diagramAlignment:
          'On the diagram, Step #2 moves from Node ② (mounted staging folder) to Node ③ (launcher) spawning KeePass.exe with poisoned profiler variables visible to Node ⑥ (Sysmon).',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 1: alert when COR_ENABLE_PROFILING=1 and COR_PROFILER_PATH point to a non-standard path on a mounted drive or user-writable folder on endpoints that are not developer workstations.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1574.012',
        plainTitle:
          'clr.dll ProfilingAPIUtility LoadProfiler and ICorProfilerCallback Initialize Execution',
        storyAnalogy:
          'As soon as the signed application wakes up its managed runtime engine, the engine obediently reads those three clipboard notes, loads the attacker unmanaged diagnostic module straight into the trusted process, and invokes its startup callback automatically.',
        simpleExplanation:
          'During KeePass.exe startup, mscoree.dll initializes clr.dll, which reads the profiling environment variables, loads ProfilerLoader.dll from E:\\.runtime\\ via LoadLibraryW, resolves the COM class factory, and calls ICorProfilerCallback::Initialize inside the trusted KeePass.exe process. No CreateRemoteThread or cross-process injection APIs are required because the signed host voluntarily loads the attacker DLL.',
        howItWorksInPractice:
          'The CLR startup path treats COR_PROFILER_PATH as a trusted diagnostics hook, so the malicious DLL gains code execution inside a process whose image is digitally signed and allowlisted. Sysmon Event ID 7 logs the unsigned DLL load from the mounted volume, and .NET Runtime Event ID 1022 records that a profiler initialized successfully.',
        diagramAlignment:
          'On the diagram, Step #3 completes inside Node ⑤ (KeePass.exe with ProfilerLoader.dll) with clr.dll load order captured on Node ⑥ (Sysmon EID 7 and .NET Runtime 1022).',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 7 and .NET Runtime Event ID 1022: correlate a signed .NET binary loading an unsigned DLL from a VHDX-mounted path with a successful profiler initialization message.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a smuggler who ships a sealed virtual cargo container so the individual tools inside skip the harbor customs warning stamp, hides the real machinery behind a double-hidden false wall, scribbles three official-looking diagnostic-inspection override notes onto the workshop launch clipboard, and starts a genuine digitally signed password vault so the vault own built-in runtime engine dutifully bolts on and launches the smuggler custom code without ever touching the permanent system registry.',
      storyMappings: [
        {
          storyTerm: 'Sealed virtual cargo container skipping the customs warning stamp',
          technicalTerm: 'Mounted .vhdx virtual disk bypassing Mark-of-the-Web (Zone.Identifier) with attrib +h +s files',
          tone: 'amber',
        },
        {
          storyTerm: 'Three official-looking diagnostic override notes on the launch clipboard',
          technicalTerm: 'Process environment variables COR_ENABLE_PROFILING=1, COR_PROFILER, and COR_PROFILER_PATH',
          tone: 'sky',
        },
        {
          storyTerm: 'Genuine digitally signed password vault starting up',
          technicalTerm: 'Trusted signed .NET application KeePass.exe launched with poisoned environment block',
          tone: 'rose',
        },
        {
          storyTerm: 'Vault own runtime engine bolting on the smuggler custom code',
          technicalTerm: 'mscoree.dll and clr.dll ProfilingAPIUtility::LoadProfiler executing PerformanceTrace.dll Initialize()',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After the user opens a downloaded sealed virtual cargo crate whose customs warning tag stays stuck strictly to the outer crate wall, a clean-looking shortcut launches while the actual binary parts sit invisible behind super-hidden system-file flags.',
        storyMappings: [
          {
            storyTerm: 'Sealed virtual cargo crate trapping the warning tag outside',
            technicalTerm: 'Mounted .vhdx container preventing Mark-of-the-Web propagation onto inner files',
            tone: 'amber',
          },
          {
            storyTerm: 'Clean-looking shortcut on the crate top shelf',
            technicalTerm: 'Weaponized .LNK shortcut running without SmartScreen MotW prompts',
            tone: 'sky',
          },
          {
            storyTerm: 'Parts hidden behind super-hidden system-file flags',
            technicalTerm: 'attrib +h +s hiding the staged trusted binary and malicious profiler DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Virtual disk mount telemetry',
            technicalTerm: 'VHDMP-Operational logs capturing mount of the attacker .vhdx image',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Skipping the heavily watched central registry shelves completely, the launcher writes three legitimate diagnostic-profiling overrides straight onto the temporary launch clipboard handed exclusively to the brand-new signed application.',
        storyMappings: [
          {
            storyTerm: 'Skipping the heavily watched central registry shelves',
            technicalTerm: 'Registryless CLR profiling avoiding HKCU/HKLM\\Environment detection rules',
            tone: 'amber',
          },
          {
            storyTerm: 'Three diagnostic-profiling overrides on the launch clipboard',
            technicalTerm: 'Process Environment Block seeded with COR_ENABLE_PROFILING=1, COR_PROFILER, COR_PROFILER_PATH',
            tone: 'sky',
          },
          {
            storyTerm: 'Brand-new signed trusted application',
            technicalTerm: 'Legitimate digitally signed .NET host binary (KeePass.exe) spawned as child',
            tone: 'rose',
          },
          {
            storyTerm: 'Catching the poisoned launch clipboard',
            technicalTerm: 'EDR / ETW inspection of process environment blocks for COR_PROFILER_PATH',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As soon as the signed application wakes up its managed runtime engine, the engine obediently reads those three clipboard notes, loads the attacker unmanaged diagnostic module straight into the trusted process, and invokes its startup callback automatically.',
        storyMappings: [
          {
            storyTerm: 'Managed runtime engine waking up and reading the clipboard',
            technicalTerm: 'mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler reading COR_PROFILER_PATH',
            tone: 'amber',
          },
          {
            storyTerm: 'Loading the attacker unmanaged diagnostic module',
            technicalTerm: 'Mapping unsigned PerformanceTrace.dll directly into signed KeePass.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Invoking the startup callback automatically',
            technicalTerm: 'CLR executing ICorProfilerCallback::Initialize() inside the trusted signed process',
            tone: 'rose',
          },
          {
            storyTerm: 'Forensic giveaway inside the trusted process',
            technicalTerm: 'Sysmon EventID 7 showing signed KeePass.exe loading an unsigned DLL from a VHDX/Temp path',
            tone: 'emerald',
          },
        ],
      },
    },
  };
