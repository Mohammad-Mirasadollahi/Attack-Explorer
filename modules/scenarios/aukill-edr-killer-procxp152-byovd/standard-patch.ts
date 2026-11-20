import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a secure office building whose maintenance wing still honors an outdated, genuinely stamped inspector pass card. An intruder drops that retired inspector card onto the desk, opens the inspector service hatch using two special code knocks (one knock to hand over a master guard badge and a second knock to yank out a security guard radio wire), and loops through every hallway knocking out every building alarm before unlocking the safe for ransomware.',
      storyMappings: [
        {
          storyTerm: 'Outdated, genuinely stamped inspector pass card',
          technicalTerm: 'Signed vulnerable Sysinternals PROCEXP152.SYS v16.32 kernel driver (BYOVD)',
          tone: 'amber',
        },
        {
          storyTerm: 'Inspector service hatch',
          technicalTerm: 'Kernel device symbolic link \\\\.\\PROCEXP152 exposed to user-mode callers',
          tone: 'sky',
        },
        {
          storyTerm: 'Two special code knocks (master badge knock and wire-yank knock)',
          technicalTerm: 'IOCTL 0x8335003C (open privileged handle) and IOCTL 0x83350004 (close handle)',
          tone: 'rose',
        },
        {
          storyTerm: 'Knocking out every building alarm before unlocking the safe',
          technicalTerm: 'Ring-0 termination of PPL-protected EDR sensors prior to ransomware execution',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Carrying stolen manager keys, the intruder unpacks a retired but legitimately stamped maintenance-inspector pass card from a briefcase, slides it onto the official building driver rack, and activates it even though no real maintenance engineer is present in the room.',
        storyMappings: [
          {
            storyTerm: 'Retired legitimately stamped pass card',
            technicalTerm: 'Embedded Microsoft-signed Sysinternals PROCEXP152.SYS v16.32',
            tone: 'amber',
          },
          {
            storyTerm: 'Official building driver rack',
            technicalTerm: 'C:\\Windows\\System32\\drivers\\PROCEXP152.SYS registered as a kernel service',
            tone: 'sky',
          },
          {
            storyTerm: 'Briefcase carrying the embedded card',
            technicalTerm: 'AuKill C++ user-mode BYOVD loader running with Administrator rights',
            tone: 'rose',
          },
          {
            storyTerm: 'No real maintenance engineer present',
            technicalTerm: 'Driver loaded by an untrusted binary rather than signed procexp64.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 6 (DriverLoaded, recording kernel drivers loaded alongside their signature and hash) for PROCEXP152.SYS version 16.32 whenever the creating or loading process is not a legitimately signed procexp.exe or procexp64.exe binary (exposing BYOVD weaponization).',
      },
      2: {
        storyAnalogy:
          'The intruder steps up to the newly opened inspector service hatch with a team of helpers and taps two distinct control knocks: the first knock forces the kernel hatch to hand back an all-powerful master handle to protected security guards, and the second knock tells the hatch to snip any open lock handles held by those guards.',
        storyMappings: [
          {
            storyTerm: 'Inspector service hatch',
            technicalTerm: 'Device handle opened to \\\\.\\PROCEXP152 via CreateFile',
            tone: 'amber',
          },
          {
            storyTerm: 'First control knock granting a master handle',
            technicalTerm: 'DeviceIoControl IOCTL 0x8335003C opening full-access Ring-0 process handles',
            tone: 'sky',
          },
          {
            storyTerm: 'Second control knock snipping open lock handles',
            technicalTerm: 'DeviceIoControl IOCTL 0x83350004 forcibly closing target process handles',
            tone: 'rose',
          },
          {
            storyTerm: 'Team of helpers enumerating guards',
            technicalTerm: 'Multi-threaded AuKill worker routines scanning running endpoint security PIDs',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor ETW Microsoft-Windows-Kernel-File and IOCTL telemetry (kernel tracing that records user-mode binaries opening protected device links) for non-Sysinternals processes opening \\Device\\PROCEXP152 and issuing IOCTL 0x8335003C or 0x83350004 (capturing the live privilege abuse handshake).',
      },
      3: {
        storyAnalogy:
          'Armed with both the master handle knock and the wire-snipping knock, the intruder runs endlessly from floor to floor shutting down every armored security monitor even when the monitors try to restart themselves, leaving the whole building blind for the ransomware crew.',
        storyMappings: [
          {
            storyTerm: 'Armored security monitors',
            technicalTerm: 'Protected Process Light (PPL) EDR services such as MsMpEng.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Master handle knock and wire-snipping knock',
            technicalTerm: 'Paired IOCTL 0x8335003C termination and IOCTL 0x83350004 handle closure loop',
            tone: 'sky',
          },
          {
            storyTerm: 'Running endlessly even as monitors restart',
            technicalTerm: 'Continuous AuKill watchdog loop terminating respawning EDR services',
            tone: 'rose',
          },
          {
            storyTerm: 'Blinded building ready for the ransomware crew',
            technicalTerm: 'Unmonitored endpoint enabling Medusa Locker or LockBit mass encryption',
            tone: 'emerald',
          },
        ],
      },
    },
  };
