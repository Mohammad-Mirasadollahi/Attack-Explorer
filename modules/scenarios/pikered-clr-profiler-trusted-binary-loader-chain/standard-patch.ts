import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
