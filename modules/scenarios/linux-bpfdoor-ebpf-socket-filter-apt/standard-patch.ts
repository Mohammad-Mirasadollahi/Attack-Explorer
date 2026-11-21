import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a silent spy who moves into a temporary hallway locker inside a busy central post office, burns the paper lease behind them, and clips on a maintenance janitor badge. Instead of renting an office doorway that shows up on the building floor plan, the spy snaps a tiny acoustic sieve straight onto the main mail chute and sleeps invisibly for years until a single envelope carrying a secret wax seal drops past the chute, waking the spy to open a private back staircase.',
      storyMappings: [
        {
          storyTerm: 'Temporary hallway locker with a burned paper lease',
          technicalTerm: 'Unlinked ELF binary executing from RAM-backed /dev/shm/kdmtmpflush',
          tone: 'amber',
        },
        {
          storyTerm: 'Maintenance janitor badge',
          technicalTerm: 'Masqueraded argv[0] process name disguising the active implant',
          tone: 'sky',
        },
        {
          storyTerm: 'Tiny acoustic sieve on the main mail chute with no doorway',
          technicalTerm: 'Raw AF_PACKET socket with SO_ATTACH_FILTER classic BPF bytecode and zero open ports',
          tone: 'rose',
        },
        {
          storyTerm: 'Envelope carrying a secret wax seal opening a back staircase',
          technicalTerm: 'Magic packet (0x7255 / 0x5293) triggering iptables redirect and memory-only PTY shell',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Upon entering the post office with master keys, the spy steps into a temporary memory-only hallway locker, backdates the locker stamp by more than a decade, shreds the locker key tag so nothing appears on the shelf, and pins on a routine building-service nametag.',
        storyMappings: [
          {
            storyTerm: 'Memory-only hallway locker',
            technicalTerm: 'RAM-backed tmpfs staging file /dev/shm/kdmtmpflush',
            tone: 'amber',
          },
          {
            storyTerm: 'Backdating the locker stamp by a decade',
            technicalTerm: 'Timestomping file modification time to 2008-10-30',
            tone: 'sky',
          },
          {
            storyTerm: 'Shredding the locker key tag',
            technicalTerm: 'Self-unlinking binary leaving a /proc/<pid>/exe (deleted) trace',
            tone: 'rose',
          },
          {
            storyTerm: 'Routine building-service nametag',
            technicalTerm: 'Masqueraded process name hiding BPFDoor in ps output',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Scan /proc/[0-9]*/exe symbolic links across Linux hosts for targets pointing to /dev/shm/* (deleted) (which exposes memory-backed binaries that erased themselves from disk) and compare /proc/[pid]/comm against the actual resolved binary path in /proc/[pid]/exe. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1036.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Refusing to open a visible service window that guards check every hour, the spy clips a tiny 30-step mechanical sieve directly onto the main incoming mail chute. Every letter streaming into the building passes silently over that sieve, which ignores ordinary mail and waits only for the spy secret emblem.',
        storyMappings: [
          {
            storyTerm: 'Visible service window checked by guards',
            technicalTerm: 'Standard listening TCP/UDP socket visible to netstat or ss',
            tone: 'amber',
          },
          {
            storyTerm: 'Main incoming mail chute',
            technicalTerm: 'Raw packet socket created via socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))',
            tone: 'sky',
          },
          {
            storyTerm: '30-step mechanical sieve',
            technicalTerm: 'Classic BPF bytecode filter attached via setsockopt(SO_ATTACH_FILTER)',
            tone: 'rose',
          },
          {
            storyTerm: 'Secret emblem watched by the sieve',
            technicalTerm: 'Hardcoded magic packet signatures (0x7255 or 0x5293) across TCP, UDP, or ICMP',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The instant a passing letter carries the secret wax stamp and matching passphrase, the spy wakes up, briefly swings a hidden wall panel to steer the caller around the lobby metal detector, and opens a private, trace-free speaking tube straight into the post office basement.',
        storyMappings: [
          {
            storyTerm: 'Passing letter with secret wax stamp and passphrase',
            technicalTerm: 'Magic TCP, UDP, or ICMP packet bearing 0x7255 / 0x5293 and valid password hash',
            tone: 'amber',
          },
          {
            storyTerm: 'Swinging a wall panel around the metal detector',
            technicalTerm: 'Dynamic iptables NAT/PREROUTING rule redirecting traffic past host firewalls',
            tone: 'sky',
          },
          {
            storyTerm: 'Private trace-free speaking tube',
            technicalTerm: 'Forked child process allocating a /dev/ptmx pseudo-terminal without utmp logging',
            tone: 'rose',
          },
          {
            storyTerm: 'Post office basement access',
            technicalTerm: 'Interactive root shell session lasting only while the magic session stays active',
            tone: 'emerald',
          },
        ],
      },
    },
  };
