import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglary crew that slips into an office building through an unpatched remote-support console, maps every room with an ordinary floor scanner and trucks data out via cloud sync, pulls a signed laptop-cooling utility out of its bag to blind every security camera in the building core, and then hijacks the company own official software-delivery trolley to roll its padlocking crew into every office simultaneously.',
      storyMappings: [
        {
          storyTerm: 'Slipping in via remote-support console and trucking data out',
          technicalTerm: 'ScreenConnect RMM foothold, Advanced IP Scanner discovery, and Rclone exfiltration',
          tone: 'amber',
        },
        {
          storyTerm: 'Signed laptop-cooling utility blinding security cameras in the core',
          technicalTerm: 'gaze.exe loading signed ThrottleStop.sys (rwdrv.sys) to strip kernel EDR callbacks',
          tone: 'sky',
        },
        {
          storyTerm: 'Hijacking the company own official software-delivery trolley',
          technicalTerm: 'PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass ransomware rollout',
          tone: 'rose',
        },
        {
          storyTerm: 'Wiping backups and sealing every office with branded locks',
          technicalTerm: 'VSS deletion and AES-256-CBC encryption appending .medusa extensions',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Entering through an unpatched perimeter remote-support doorway, the crew runs an off-the-shelf network scanner to map every room in the building and quietly uploads sensitive company folders through a cloud moving utility before sounding any alarms.',
        storyMappings: [
          {
            storyTerm: 'Unpatched perimeter remote-support doorway',
            technicalTerm: 'Exploited ConnectWise ScreenConnect or Fortinet perimeter appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Off-the-shelf room scanner',
            technicalTerm: 'Advanced IP Scanner mapping active internal servers and SMB shares',
            tone: 'sky',
          },
          {
            storyTerm: 'Cloud moving utility shipping out folders',
            technicalTerm: 'Rclone exfiltrating sensitive corporate archives prior to ransomware execution',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual-purpose remote access',
            technicalTerm: 'Living-off-the-land RMM persistence blending into legitimate IT operations',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Before rolling out the padlocking crew, the intruders drop a specialized guard-killer carrying a legitimately signed laptop-tuning driver, using its raw core access to cut the security cameras master notification wires.',
        storyMappings: [
          {
            storyTerm: 'Specialized guard-killer tool',
            technicalTerm: 'gaze.exe (Abyss Locker / Medusa EDR killer wrapper)',
            tone: 'amber',
          },
          {
            storyTerm: 'Legitimately signed laptop-tuning driver',
            technicalTerm: 'Vulnerable signed ThrottleStop.sys / rwdrv.sys kernel driver (BYOVD)',
            tone: 'sky',
          },
          {
            storyTerm: 'Cutting security cameras master notification wires',
            technicalTerm: 'Patching or wiping Ring-0 kernel EDR callback arrays to blind telemetry',
            tone: 'rose',
          },
          {
            storyTerm: 'Unmonitored network ready for mass deployment',
            technicalTerm: 'Disabled endpoint protection across domain servers and workstations',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Climbing aboard the IT department own official software-deployment cart, the crew broadcasts the Medusa padlocking machine across the entire campus at once, shredding shadow backups and snapping branded padlocks across every document.',
        storyMappings: [
          {
            storyTerm: 'IT department official software-deployment cart',
            technicalTerm: 'Abused PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass distribution',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding shadow backups across the campus',
            technicalTerm: 'Volume Shadow Copy (VSS) deletion blocking native Windows file recovery',
            tone: 'sky',
          },
          {
            storyTerm: 'Branded padlocks snapped across every document',
            technicalTerm: 'Medusa AES-256-CBC encryption renaming files with the .medusa extension',
            tone: 'rose',
          },
          {
            storyTerm: 'Coordinated single-wave impact',
            technicalTerm: 'Simultaneous domain-wide detonation maximizing operational disruption',
            tone: 'emerald',
          },
        ],
      },
    },
  };
