import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder standing in a corridor who drops a remote worker kit onto a neighbor administrative loading dock, phones the shift foreman to register that kit as a brand-new building service, and hooks up a control tube plus three pneumatic speaking tubes (one to send typed orders, one to hear normal replies, and one to hear error shouts) straight back to their own desk, leaving a crisp four-step trail even if they repaint the kit name.',
      storyMappings: [
        {
          storyTerm: 'Dropping the worker kit onto the administrative loading dock',
          technicalTerm: 'SMB ADMIN$ write and IPC$ svcctl bind logged by EventID 5140 and 5145',
          tone: 'amber',
        },
        {
          storyTerm: 'Phoning the shift foreman to register a brand-new service',
          technicalTerm: 'services.exe CreateServiceW over \\pipe\\svcctl logged by System EventID 7045',
          tone: 'sky',
        },
        {
          storyTerm: 'Control tube plus three pneumatic speaking tubes',
          technicalTerm: 'PSEXESVC named pipes for control, stdin, stdout, and stderr (Sysmon EventID 17 & 18)',
          tone: 'rose',
        },
        {
          storyTerm: 'Detectable even after repainting the kit name',
          technicalTerm: 'Behavioral named-pipe triplet signature surviving PsExec -r binary renaming',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'From a neighboring workstation, the intruder unlocks the target administrative loading bay, drops a packaged service helper onto the dock, and opens the shift-foreman intercom channel to prepare an installation order.',
        storyMappings: [
          {
            storyTerm: 'Administrative loading bay',
            technicalTerm: 'Remote SMB ADMIN$ share accessed on 10.10.20.15 (Security EventID 5140)',
            tone: 'amber',
          },
          {
            storyTerm: 'Dropping the packaged service helper onto the dock',
            technicalTerm: 'Security EventID 5145 logging PSEXESVC.exe creation inside ADMIN$',
            tone: 'sky',
          },
          {
            storyTerm: 'Shift-foreman intercom channel',
            technicalTerm: 'SMB IPC$ RPC bind to \\pipe\\svcctl (Service Control Manager interface)',
            tone: 'rose',
          },
          {
            storyTerm: 'Remote launch order',
            technicalTerm: 'Attacker running PsExec.exe \\\\10.10.20.15 -s cmd.exe',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Receiving the installation order over the foreman intercom, the building shift supervisor writes a brand-new service entry onto the master roster and starts the uploaded helper with full building-wide master keys.',
        storyMappings: [
          {
            storyTerm: 'Building shift supervisor',
            technicalTerm: 'Windows Service Control Manager (services.exe) invoking CreateServiceW',
            tone: 'amber',
          },
          {
            storyTerm: 'Brand-new service entry on the master roster',
            technicalTerm: 'System EventID 7045 (A service was installed in the system) for PSEXESVC',
            tone: 'sky',
          },
          {
            storyTerm: 'Starting the helper with master keys',
            technicalTerm: 'PSEXESVC.exe spawning cmd.exe under NT AUTHORITY\\SYSTEM (Sysmon EventID 1)',
            tone: 'rose',
          },
          {
            storyTerm: 'Temporary registration cleaned up afterward',
            technicalTerm: 'Short-lived remote execution service whose EventID 7045 log persists on disk',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder paints a brand-new cover name over the worker kit to dodge simple name filters, the live helper still opens one master control pipe and three matching pneumatic speaking tubes (one for incoming commands, one for normal output, and one for error messages), creating a dead-giveaway architectural fingerprint.',
        storyMappings: [
          {
            storyTerm: 'Painting a brand-new cover name over the kit',
            technicalTerm: 'Using PsExec -r <custom_name> to rename the service and binary',
            tone: 'amber',
          },
          {
            storyTerm: 'Master control pipe',
            technicalTerm: 'Control named pipe coordinating interactive command session startup',
            tone: 'sky',
          },
          {
            storyTerm: 'Three pneumatic speaking tubes (commands, output, errors)',
            technicalTerm: 'Paired stdin, stdout, and stderr named pipes (e.g., *-stdin, *-stdout, *-stderr)',
            tone: 'rose',
          },
          {
            storyTerm: 'Architectural fingerprint caught by hallway sensors',
            technicalTerm: 'Sysmon EventID 17 (PipeEvent Created) and EventID 18 (PipeEvent Connected)',
            tone: 'emerald',
          },
        ],
      },
    },
  };
