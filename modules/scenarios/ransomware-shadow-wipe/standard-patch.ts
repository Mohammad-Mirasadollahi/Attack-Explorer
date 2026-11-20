import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a high-speed heist crew that rushes into a records building with two clear orders: first, smash every automatic time-capsule backup cabinet and unplug the emergency repair switch so nobody can rewind the clock; second, unleash a fleet of parallel hardware-powered padlocking presses that lock alternating slices of every filing cabinet across the building in seconds before dropping an extortion card in every room.',
      storyMappings: [
        {
          storyTerm: 'Smashing every automatic time-capsule backup cabinet',
          technicalTerm: 'vssadmin.exe delete shadows /all /quiet wiping Windows Volume Shadow Copies',
          tone: 'amber',
        },
        {
          storyTerm: 'Unplugging the emergency repair switch',
          technicalTerm: 'bcdedit /set {default} recoveryenabled No disabling Windows Recovery Environment',
          tone: 'sky',
        },
        {
          storyTerm: 'Parallel hardware-powered presses locking alternating file slices',
          technicalTerm: 'LockBit multi-threaded AES-NI intermittent file encryption across drives',
          tone: 'rose',
        },
        {
          storyTerm: 'Dropping an extortion card in every room',
          technicalTerm: 'Creating Restore-My-Files.txt ransom notes and appending .lockbit extensions',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before touching a single office drawer, the crew sprints straight to the basement recovery room, shreds every automatic historical backup copy silently, and rips out the emergency boot-repair lever so staff cannot restore yesterday\'s files.',
        storyMappings: [
          {
            storyTerm: 'Shredding every automatic historical backup copy',
            technicalTerm: 'vssadmin.exe delete shadows /all /quiet or WMI Win32_ShadowCopy deletion',
            tone: 'amber',
          },
          {
            storyTerm: 'Ripping out the emergency boot-repair lever',
            technicalTerm: 'bcdedit disabling bootstatuspolicy ignoreallfailures and Windows Recovery',
            tone: 'sky',
          },
          {
            storyTerm: 'Clearing the recovery runway first',
            technicalTerm: 'Inhibit System Recovery (MITRE T1490) preceding mass file encryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Loudest early-warning siren for defenders',
            technicalTerm: 'Sysmon EventID 1 and EDR behavioral blocking on vssadmin/bcdedit wipe commands',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'With recovery doors welded shut, the crew launches parallel processor-accelerated locking gears that stamp only the opening chunks of huge files to corrupt entire servers in moments, tagging every sealed drawer and sliding a ransom note under every door.',
        storyMappings: [
          {
            storyTerm: 'Processor-accelerated parallel locking gears',
            technicalTerm: 'Multi-threaded AES-NI hardware-accelerated encryption engine inside LockBit',
            tone: 'amber',
          },
          {
            storyTerm: 'Stamping only the opening chunks of huge files',
            technicalTerm: 'Intermittent partial encryption maximizing total files corrupted per second',
            tone: 'sky',
          },
          {
            storyTerm: 'Tagging every sealed drawer',
            technicalTerm: 'Appending .lockbit extensions and changing file icons across local and SMB volumes',
            tone: 'rose',
          },
          {
            storyTerm: 'Sliding a ransom note under every door',
            technicalTerm: 'Dropping Restore-My-Files.txt with Tor leak-site negotiation links',
            tone: 'emerald',
          },
        ],
      },
    },
  };
