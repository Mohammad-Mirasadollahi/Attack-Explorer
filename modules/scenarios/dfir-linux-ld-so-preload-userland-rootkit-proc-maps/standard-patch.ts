import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an invisible tailor sneaking into a factory dressing room and sewing a rigged lining into the universal work coat hanging on the entrance rack. Every factory inspector who slips on a standard coat automatically sees blurred lenses that hide the tailor hidden doorway, until a forensic auditor arrives with sealed, self-contained binoculars from outside the factory and reads the raw room occupancy ledger directly.',
      storyMappings: [
        {
          storyTerm: 'Universal work coat hanging on the entrance rack',
          technicalTerm: 'System-wide dynamic linker file /etc/ld.so.preload',
          tone: 'amber',
        },
        {
          storyTerm: 'Rigged lining sewn into the coat',
          technicalTerm: 'Malicious shared library /usr/lib64/libudev-guardian.so',
          tone: 'sky',
        },
        {
          storyTerm: 'Blurred lenses hiding the tailor doorway',
          technicalTerm: 'Userland PLT/GOT hooks on readdir64() and fopen() hiding files and sockets',
          tone: 'rose',
        },
        {
          storyTerm: 'Sealed external binoculars reading the raw room ledger',
          technicalTerm: 'Statically linked busybox binary inspecting /proc/1/maps and /proc/self/map_files',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Under cover of night, the tailor slips a custom rigged coat lining into the supply shelf and writes its tag number onto the mandatory entrance-rack sheet. Even though the front-desk tools will soon be fooled, the tamper-proof security camera bolted above the rack records the exact moment the sheet is edited.',
        storyMappings: [
          {
            storyTerm: 'Custom rigged coat lining on the supply shelf',
            technicalTerm: 'Compiled ELF shared object placed at /usr/lib64/libudev-guardian.so',
            tone: 'amber',
          },
          {
            storyTerm: 'Mandatory entrance-rack sheet',
            technicalTerm: 'Path entry written into /etc/ld.so.preload',
            tone: 'sky',
          },
          {
            storyTerm: 'Tamper-proof camera bolted above the rack',
            technicalTerm: 'Kernel-level auditd syscall monitoring recording nametype=CREATE',
            tone: 'rose',
          },
          {
            storyTerm: 'Front-desk tools about to be fooled',
            technicalTerm: 'Standard dynamically linked Linux utilities (ps, ls, netstat, lsof)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Every time a normal factory worker starts a routine floor check, the entrance dresser hands them the rigged coat first. Inside each worker goggles, the rigged lining intercepts every glance down the aisles and every glance at the attendance clipboard, erasing the intruder files and connections before the worker eyes can read them.',
        storyMappings: [
          {
            storyTerm: 'Entrance dresser handing out the rigged coat',
            technicalTerm: 'Dynamic linker /lib64/ld-linux-x86-64.so.2 loading /etc/ld.so.preload first',
            tone: 'amber',
          },
          {
            storyTerm: 'Intercepting every glance down the aisles',
            technicalTerm: 'PLT/GOT function hooking of libc readdir64() hiding directories and PIDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Intercepting glances at the attendance clipboard',
            technicalTerm: 'Userland hooking of fopen() filtering /proc/net/tcp entries',
            tone: 'rose',
          },
          {
            storyTerm: 'Fooled routine floor checks',
            technicalTerm: 'Compromised output from dynamically linked ps, ls, netstat, and lsof',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Refusing to put on any factory coat at all, the forensic auditor walks in wearing completely self-contained outside gear and reads the raw hallway map posted inside the master guard station, immediately spotting the foreign rigged lining wrapped around every single worker in the building.',
        storyMappings: [
          {
            storyTerm: 'Self-contained outside gear skipping the coat rack',
            technicalTerm: 'Statically linked busybox binary immune to /etc/ld.so.preload injection',
            tone: 'amber',
          },
          {
            storyTerm: 'Raw hallway map inside the master guard station',
            technicalTerm: 'Kernel-generated /proc/1/maps and /proc/self/map_files memory mappings',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct inspection without intermediary glasses',
            technicalTerm: 'Shell builtin read loop bypassing hooked userland libc file wrappers',
            tone: 'rose',
          },
          {
            storyTerm: 'Foreign lining wrapped around every worker',
            technicalTerm: 'Exposed /usr/lib64/libudev-guardian.so mapping across PID 1 and child processes',
            tone: 'emerald',
          },
        ],
      },
    },
  };
