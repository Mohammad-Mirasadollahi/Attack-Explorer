import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'pikered-clr-profiler-trusted-binary-loader-chain',
    briefing: {
      headline:
        'Scenario Briefing: PikeRed CLR Profiler Abuse (MITRE T1574.012), VHDX MotW Bypass and Trusted KeePass.exe Loader Chain',
      storyAnalogy:
        'Imagine a smuggler who ships a sealed virtual cargo container so the individual tools inside skip the harbor customs warning stamp, hides the real machinery behind a double-hidden false wall, scribbles three official-looking diagnostic-inspection override notes onto the workshop launch clipboard, and starts a genuine digitally signed password vault so the vault own built-in runtime engine dutifully bolts on and launches the smuggler custom code without ever touching the permanent system registry.',
      plainSummary:
        'In this scenario (T1553.005, PikeRed Research & MITRE T1574.012 - Abusing the .NET CLR Profiler: VHDX MotW Bypass & Trusted-Binary Loader Chain (KeePass.exe -> clr.dll)), the attacker follows one continuous arc: vHDX Container Mounting and attrib +h +s, then process Environment Seeding, then clr.dll ProfilingAPIUtility LoadProfiler. Steps #1–#3 examine #1 VHDX Container Mounting and attrib +h +s; #2 Process Environment Seeding; #3 clr.dll ProfilingAPIUtility LoadProfiler. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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