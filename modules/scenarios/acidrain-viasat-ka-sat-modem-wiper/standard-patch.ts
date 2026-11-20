import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a satellite television control hub wired to tens of thousands of rooftop receiver boxes across an entire continent. Breaking into the trusted central management deck, a saboteur pushes one tiny remote-maintenance package down to every rooftop dish simultaneously; inside each box, the package first sweeps all ordinary storage cards and then fires raw hardware erase bolts directly into the soldered memory chips themselves, permanently silencing tens of thousands of satellite modems in one stroke.',
      storyMappings: [
        {
          storyTerm: 'Central management deck pushing one maintenance package to every dish',
          technicalTerm: 'Management plane compromise and mass TR-069 CWMP push of MIPS ELF wiper (ukrop)',
          tone: 'amber',
        },
        {
          storyTerm: 'Sweeping all ordinary storage cards sequentially',
          technicalTerm: 'Recursive overwrite of /dev/sda, /dev/mmcblk, and non-essential filesystem directories',
          tone: 'sky',
        },
        {
          storyTerm: 'Firing raw hardware erase bolts into soldered memory chips',
          technicalTerm: 'Raw SPI flash /dev/mtd0..99 destruction via MEMUNLOCK, MEMERASE, and MEMWRITEOOB',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanently silencing tens of thousands of satellite modems',
          technicalTerm: 'Irrecoverable bricking of Viasat KA-SAT consumer and wind-turbine terminals',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping past a misconfigured perimeter gate into the satellite ground-station master control room, the saboteur hijacks the official remote-update broadcaster and beams a tiny specialized demolition program simultaneously into tens of thousands of distant rooftop modems.',
        storyMappings: [
          {
            storyTerm: 'Satellite ground-station master control room',
            technicalTerm: 'Trusted management segment of the Viasat KA-SAT satellite network',
            tone: 'amber',
          },
          {
            storyTerm: 'Official remote-update broadcaster',
            technicalTerm: 'TR-069 CPE WAN Management Protocol (CWMP) pushing mass firmware commands',
            tone: 'sky',
          },
          {
            storyTerm: 'Tiny specialized demolition program',
            technicalTerm: 'Compact MIPS ELF AcidRain wiper binary (ukrop) staged into /tmp',
            tone: 'rose',
          },
          {
            storyTerm: 'Simultaneous fleet-wide arrival',
            technicalTerm: 'Mass execution across tens of thousands of SurfBeam 2 embedded Linux modems',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor SATCOM management-plane telemetry for sudden mass TR-069 Download or firmware execution broadcasts (which deviate sharply from staged maintenance waves) paired with embedded host alerts for unsigned ELF binaries executing out of /tmp.',
      },
      2: {
        storyAnalogy:
          'Waking up inside each modem with master system authority, the demolition program forks quietly into the background and sweeps across every attached storage partition and memory card, scrubbing every directory clean before turning to the raw hardware chips.',
        storyMappings: [
          {
            storyTerm: 'Forking quietly into the background with master authority',
            technicalTerm: 'AcidRain daemonizing as root (UID 0) on the embedded Linux modem OS',
            tone: 'amber',
          },
          {
            storyTerm: 'Sweeping every attached storage partition and memory card',
            technicalTerm: 'Iterative overwrite across /dev/sda*, /dev/mmcblk*, and non-essential directories',
            tone: 'sky',
          },
          {
            storyTerm: 'Writing straight over raw block devices',
            technicalTerm: 'Opening /dev/mtdblock* and /dev/mmcblk* with O_WRONLY / O_RDWR flags',
            tone: 'rose',
          },
          {
            storyTerm: 'Embedded system watchman catching the wipe',
            technicalTerm: 'Syscall auditing alerting on raw block-device writes outside firmware upgraders',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable embedded Linux syscall auditing (monitoring low-level kernel open and write calls) alerting whenever processes other than signed firmware upgrade daemons open /dev/mtdblock* or /dev/mmcblk* with O_WRONLY or O_RDWR write flags.',
      },
      3: {
        storyAnalogy:
          'Finally, the wiper speaks straight to the modem raw soldered flash chips from slot zero through ninety-nine, reading each chip physical geometry, flipping off hardware write-locks, and issuing direct chip-erase pulses so the modem cannot even read its own startup instructions after reboot.',
        storyMappings: [
          {
            storyTerm: 'Raw soldered flash chips from slot zero through ninety-nine',
            technicalTerm: 'Character-mode Memory Technology Devices /dev/mtd0 through /dev/mtd99',
            tone: 'amber',
          },
          {
            storyTerm: 'Reading physical geometry and flipping off hardware locks',
            technicalTerm: 'Linux MTD ioctl calls MEMGETINFO followed by MEMUNLOCK',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct chip-erase pulses destroying startup instructions',
            technicalTerm: 'Raw hardware flash erasure via MEMERASE and MEMWRITEOOB ioctls',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanently silenced hardware requiring physical replacement',
            technicalTerm: 'Unbootable bricked modems requiring hardware swap across European deployments',
            tone: 'emerald',
          },
        ],
      },
    },
  };
