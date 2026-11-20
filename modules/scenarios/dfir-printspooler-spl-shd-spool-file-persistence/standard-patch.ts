import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who abuses the corporate print room not to print paper, but to install a permanent back-office helper running with full master building keys. First, they send remote print jobs dropping paired spool slips onto the print shelf; second, they register a rogue port-monitor extension straight onto the print foreman panel; third, every time the print service starts, the foreman automatically loads the intruder module under supreme authority and launches hidden command shells.',
      storyMappings: [
        {
          storyTerm: 'Sending remote print jobs dropping paired spool slips',
          technicalTerm: 'MS-RPRN / MS-PAR RPC bind to \\pipe\\spoolss dropping .SPL and .SHD spool files',
          tone: 'amber',
        },
        {
          storyTerm: 'Registering a rogue port-monitor extension on the foreman panel',
          technicalTerm: 'AddMonitor API creating HKLM\\...\\Control\\Print\\Monitors entry (PrintService EventID 316)',
          tone: 'sky',
        },
        {
          storyTerm: 'Foreman automatically loading the rogue module with master keys',
          technicalTerm: 'spoolsv.exe loading malicious DLL as NT AUTHORITY\\SYSTEM (Sysmon EventID 7)',
          tone: 'rose',
        },
        {
          storyTerm: 'Launching hidden command shells out of the print room',
          technicalTerm: 'spoolsv.exe spawning anomalous child cmd.exe / powershell.exe (Sysmon EventID 1)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Connecting over the network to the print-room service pipe, the intruder interacts with the print spooler engine, leaving telltale raw print data and shadow control slips inside the system spool tray.',
        storyMappings: [
          {
            storyTerm: 'Print-room network service pipe',
            technicalTerm: 'MS-RPRN / MS-PAR RPC binding over SMB \\pipe\\spoolss',
            tone: 'amber',
          },
          {
            storyTerm: 'Paired raw data and shadow control slips',
            technicalTerm: 'Spool artifacts (.SPL data and .SHD job metadata) created in C:\\Windows\\System32\\spool\\PRINTERS',
            tone: 'sky',
          },
          {
            storyTerm: 'Forensic evidence inside .SHD metadata',
            technicalTerm: 'Shadow file preserving submitting user, machine name, and print job timestamp',
            tone: 'rose',
          },
          {
            storyTerm: 'Print service audit channel',
            technicalTerm: 'Microsoft-Windows-PrintService/Operational logging incoming RPC print interactions',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Calling the official printer port-monitor registration desk, the intruder pins a custom DLL name onto the permanent Monitors registry shelf so the print service commits to loading that library every single time the server boots.',
        storyMappings: [
          {
            storyTerm: 'Official port-monitor registration desk',
            technicalTerm: 'Win32 AddMonitor() API registering a custom print port monitor DLL',
            tone: 'amber',
          },
          {
            storyTerm: 'Permanent Monitors registry shelf',
            technicalTerm: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\<RogueMonitor>\\Driver',
            tone: 'sky',
          },
          {
            storyTerm: 'Print-room audit receipt catching new hardware modules',
            technicalTerm: 'PrintService/Operational EventID 316 and Sysmon EventID 13 registry write alerts',
            tone: 'rose',
          },
          {
            storyTerm: 'Reboot-resilient SYSTEM persistence',
            technicalTerm: 'Automatic reloading of registered Port Monitor DLLs whenever spoolsv.exe starts',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The instant the Print Spooler foreman loads the registered module into its own master-keyed memory space, the module awakens with full SYSTEM clearance and opens interactive shells straight from the print room.',
        storyMappings: [
          {
            storyTerm: 'Foreman loading the registered module',
            technicalTerm: 'Sysmon EventID 7 capturing spoolsv.exe loading an unsigned DLL from System32',
            tone: 'amber',
          },
          {
            storyTerm: 'Awakening with full building-master clearance',
            technicalTerm: 'DllMain executing directly under NT AUTHORITY\\SYSTEM inside spoolsv.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Interactive shells emerging from the print room',
            technicalTerm: 'Sysmon EventID 1 alerting on spoolsv.exe spawning cmd.exe or powershell.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Hardening servers that never print',
            technicalTerm: 'Disabling the Print Spooler service on Domain Controllers and core enterprise servers',
            tone: 'emerald',
          },
        ],
      },
    },
  };
