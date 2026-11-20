import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a trusted corporate management binder that automatically displays help pages inside a hidden mini-browser panel whenever an employee double-clicks it. An attacker slips a rigged old help-desk link inside a custom binder file so opening it bounces an ancient browser script helper straight into live memory, builds a full spy loader purely out of thin air inside the management console, and slips a covert beacon into a quiet helper office next door.',
      storyMappings: [
        {
          storyTerm: 'Rigged old help-desk link inside a trusted management binder',
          technicalTerm: 'Malicious .msc file exploiting legacy apds.dll redirect XSS (CVE-2024-43572)',
          tone: 'amber',
        },
        {
          storyTerm: 'Building a full spy loader out of thin air inside the console',
          technicalTerm: 'DotNetToJScript reconstructing an in-memory .NET loader via jscript.dll and clr.dll',
          tone: 'sky',
        },
        {
          storyTerm: 'Slipping a covert beacon into a quiet helper office next door',
          technicalTerm: 'mmc.exe spawning dllhost.exe and injecting Cobalt Strike via RwSection',
          tone: 'rose',
        },
        {
          storyTerm: 'Hidden mini-browser panel inside an official management binder',
          technicalTerm: 'Microsoft Management Console (mmc.exe) rendering embedded HTML/script nodes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'When an employee opens a seemingly official system-settings binder, a rigged help reference inside triggers an ancient built-in help router that blindly executes embedded webpage scripts right inside the trusted management console.',
        storyMappings: [
          {
            storyTerm: 'Seemingly official system-settings binder',
            technicalTerm: 'Weaponized Microsoft Saved Console (.msc) file opened by mmc.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Ancient built-in help router',
            technicalTerm: 'Legacy apds.dll resource redirect flaw (CVE-2024-43572 / GrimResource)',
            tone: 'sky',
          },
          {
            storyTerm: 'Embedded webpage scripts running inside the console',
            technicalTerm: 'mmc.exe loading apds.dll alongside jscript.dll or vbscript.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing ordinary macro warnings',
            technicalTerm: 'Code execution triggered inside signed mmc.exe without Office macros',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 7 (Image Loaded recording every DLL mapped into a running process) showing mmc.exe loading both apds.dll and jscript.dll or vbscript.dll while opening a non-standard .msc file (pinpointing CVE-2024-43572 GrimResource execution).',
      },
      2: {
        storyAnalogy:
          'Using a clever bridge inside the script engine, the tiny webpage script wakes up the full modern runtime factory right inside the console memory and compiles a multi-stage loader without dropping a single script file to disk.',
        storyMappings: [
          {
            storyTerm: 'Clever bridge waking up the modern runtime factory',
            technicalTerm: 'DotNetToJScript deserializing a .NET assembly inside jscript9.dll / clr.dll',
            tone: 'amber',
          },
          {
            storyTerm: 'Compiling a loader purely inside console memory',
            technicalTerm: 'In-memory .NET execution hosted within signed C:\\Windows\\System32\\mmc.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Unusual trio of guest engines inside one tool',
            technicalTerm: 'mmc.exe simultaneously loading jscript.dll, clr.dll, and amsi.dll',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero intermediate executable written to disk',
            technicalTerm: 'Fileless stage-two staging evading traditional on-disk file scanners',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 7 (Image Loaded module telemetry) flagging mmc.exe loading jscript9.dll or jscript.dll immediately followed by the .NET CLR runtime (clr.dll) and amsi.dll inside the same process (confirming DotNetToJScript memory reconstruction).',
      },
      3: {
        storyAnalogy:
          'Rather than lingering inside the visible settings window the victim might soon close, the in-memory loader starts a quiet background helper room next door, writes a live command beacon across a shared memory corridor into that room, and dials home.',
        storyMappings: [
          {
            storyTerm: 'Quiet background helper room next door',
            technicalTerm: 'Spawned legitimate COM surrogate process dllhost.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Shared memory corridor carrying the live beacon',
            technicalTerm: 'Dirty Vanity / RwSection memory mapping injecting Cobalt Strike into dllhost.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Surviving closure of the visible settings window',
            technicalTerm: 'Process migration decoupling C2 persistence from the initial mmc.exe UI',
            tone: 'rose',
          },
          {
            storyTerm: 'High-confidence cross-process alert',
            technicalTerm: 'Elastic rule execution_via_mmc_apds_dll catching mmc.exe injecting into dllhost.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy behavioral rules matching Elastic execution_via_mmc_apds_dll (correlating module loads with cross-process injection telemetry) flagging mmc.exe after loading apds.dll spawning or injecting memory sections into dllhost.exe.',
      },
    },
  };
