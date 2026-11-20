import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a phantom eavesdropper inside a railway telegraph depot who moves into a temporary memory-only closet, shreds the paper entry receipt, puts on a station-cleaner badge, and clips an invisible wire sieve directly onto the main incoming telegraph cable so no open door appears on the depot map. During an emergency audit, a forensic inspector bypasses the front floor map completely, reads the raw cable-tap ledger, and uncovers both the invisible sieve and the brass locking pin keeping it alone.',
      storyMappings: [
        {
          storyTerm: 'Temporary memory-only closet with a shredded receipt',
          technicalTerm: 'Self-unlinked /dev/shm/kdmtmpflush binary visible as /proc/<pid>/exe (deleted)',
          tone: 'amber',
        },
        {
          storyTerm: 'Invisible wire sieve clipped onto the main telegraph cable',
          technicalTerm: 'AF_PACKET raw socket with SO_ATTACH_FILTER classic BPF bytecode',
          tone: 'sky',
        },
        {
          storyTerm: 'Front floor map showing no open door',
          technicalTerm: 'netstat -tulnp showing zero listening TCP or UDP ports',
          tone: 'rose',
        },
        {
          storyTerm: 'Raw cable-tap ledger and brass locking pin',
          technicalTerm: '/proc/net/packet, ss -0pb BPF dump, and /var/run/haldrund.pid mutex',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At launch, the eavesdropper dashes into a memory-only storage closet, tears up the closet doorway sign so disk inventories find nothing, and alters its own staff nametag to resemble a harmless background maintenance utility.',
        storyMappings: [
          {
            storyTerm: 'Memory-only storage closet',
            technicalTerm: 'tmpfs shared memory execution path /dev/shm/kdmtmpflush',
            tone: 'amber',
          },
          {
            storyTerm: 'Tearing up the closet doorway sign',
            technicalTerm: 'Unlinking on-disk executable leaving /proc/<pid>/exe (deleted) forensic trace',
            tone: 'sky',
          },
          {
            storyTerm: 'Altering its own staff nametag',
            technicalTerm: 'Overwriting argv[0] and calling prctl(PR_SET_NAME) to masquerade as a daemon',
            tone: 'rose',
          },
          {
            storyTerm: 'Launching into background duty',
            technicalTerm: 'Self-re-execution with --init flag detaching from the parent terminal',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Instead of opening a numbered ticket window that every night watchman checks, the eavesdropper clamps a raw acoustic sieve straight onto the main telegraph line so every passing signal is inspected silently until a secret trigger code arrives.',
        storyMappings: [
          {
            storyTerm: 'Numbered ticket window checked by watchmen',
            technicalTerm: 'Standard listening TCP/UDP socket listed by netstat -tulnp',
            tone: 'amber',
          },
          {
            storyTerm: 'Main telegraph line clamp',
            technicalTerm: 'socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) raw packet socket',
            tone: 'sky',
          },
          {
            storyTerm: 'Raw acoustic sieve',
            technicalTerm: 'Classic BPF bytecode filter attached via setsockopt(SOL_SOCKET, SO_ATTACH_FILTER)',
            tone: 'rose',
          },
          {
            storyTerm: 'Secret trigger code',
            technicalTerm: 'Magic packet sequence waking the passive implant on demand',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'A seasoned forensic investigator skips the front ticket map altogether and reads the depot master cable-clamp registry directly, exposing the hidden sieve bytecode, tracing it to the unlinked closet occupant, and spotting the single-occupancy brass lock pin left on the wall.',
        storyMappings: [
          {
            storyTerm: 'Depot master cable-clamp registry',
            technicalTerm: 'Kernel /proc/net/packet table listing all active AF_PACKET raw sockets',
            tone: 'amber',
          },
          {
            storyTerm: 'Exposing the hidden sieve bytecode',
            technicalTerm: 'ss -0pb dumping attached BPF filter instructions and owning process PIDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Single-occupancy brass lock pin',
            technicalTerm: 'Mutex PID file /var/run/haldrund.pid preventing duplicate implant instances',
            tone: 'rose',
          },
          {
            storyTerm: 'Unlinked closet occupant',
            technicalTerm: 'Running implant correlated via /proc/<pid>/exe pointing to deleted /dev/shm file',
            tone: 'emerald',
          },
        ],
      },
    },
  };
