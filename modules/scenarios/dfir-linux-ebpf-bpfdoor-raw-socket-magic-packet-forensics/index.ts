import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics',
    title: 'PwC, CrowdStrike & Elastic DFIR — Linux BPFDoor Raw Socket Filter, /dev/shm Masquerading & /proc/net/packet Forensics',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1205.002',
    description:
      'Grounded in PwC Threat Intelligence (Red Menshen / BPFDoor), CrowdStrike Linux DFIR guides, and Elastic Security Labs analysis: a passive Linux implant copies itself to /dev/shm, unlink-deletes its on-disk binary, masquerades its process argv[0] as a kernel worker thread ([kdmtmpflush]), and attaches a Berkeley Packet Filter (SO_ATTACH_FILTER) to an AF_PACKET SOCK_RAW socket without opening any listening TCP/UDP port—detectable via /proc/net/packet, ss -0pb, auditd syscall=41 (socket), and /proc/<pid>/exe (deleted).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Magic Packet Trigger (WAN)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AF_PACKET Raw Socket Filter', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '/dev/shm (deleted) Process', type: 'server', status: 'compromised' },
      { id: 'siem', label: '/proc/net/packet & ss -0pb', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Masqueraded [kdmtmpflush] PID', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Memory-Backed /dev/shm Execution, Self-Deletion & /proc/<pid>/exe (deleted) Artifact',
        narration:
          'Upon startup, the implant copies its binary into tmpfs shared memory (/dev/shm/kdmtmpflush), executes the copy with --init, overwrites its command-line argv[0] via prctl(PR_SET_NAME) to mimic a kernel thread ("[kdmtmpflush]"), and unlinks the file from /dev/shm. However, the Linux VFS preserves the open inode link at /proc/<pid>/exe -> /dev/shm/kdmtmpflush (deleted).',
        activeNodes: ['attacker', 'target', 'ad'],
        mitreTactic: 'Defense Evasion (T1036.004 - Masquerading: Masquerade Task or Service)',
        technicalCommands: [
          'ls -la /proc/*/exe 2>/dev/null | grep "(deleted)"',
          'Forensic Link: /proc/4819/exe -> /dev/shm/kdmtmpflush (deleted)',
          'Kernel Thread Verification: Real kernel threads descend from PPID 2 ([kthreadd]) and have empty /proc/<pid>/maps',
        ],
        defenseMitigation:
          'Mount /dev/shm, /tmp, and /var/tmp with the noexec,nosuid,nodev mount options in /etc/fstab and hunt for processes named in square brackets ([...]) whose PPID is not 2 (kthreadd).',
        logs: [
          {
            id: 'dfir-bpf-1',
            timestamp: '03:12:09.110',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'kdmtmpflush',
            CommandLine: '[kdmtmpflush] (/proc/4819/exe -> /dev/shm/kdmtmpflush (deleted))',
            raw: 'proc_triage: pid=4819 ppid=1 uid=0 comm="kdmtmpflush" cmdline="[kdmtmpflush]" exe="/dev/shm/kdmtmpflush (deleted)" maps_entries=18 anomaly="Bracketed process name with PPID=1 (not kthreadd PPID=2) and non-empty /proc/4819/maps"',
            parsedFields: {
              ProcessId: '4819 (PPID 1 systemd, not PPID 2 kthreadd)',
              SpoofedCommName: '[kdmtmpflush]',
              ProcExeSymlink: '/dev/shm/kdmtmpflush (deleted)',
              ZeroPortFootprint: 'No listening TCP/UDP sockets in netstat/ss -tulnp',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Raw Packet Socket Creation & Classic BPF Bytecode Attachment (SO_ATTACH_FILTER)',
        narration:
          'Rather than binding a TCP or UDP port that would appear in netstat -tulnp, the implant invokes socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) and calls setsockopt(SOL_SOCKET, SO_ATTACH_FILTER) to load a classic BPF bytecode filter into the kernel that inspects incoming TCP, UDP, and ICMP packets for magic bytes (0x7255 or 0x5293).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1205.002 - Traffic Signaling: Socket Filters)',
        technicalCommands: [
          'auditd SYSCALL Record: syscall=41 (socket) a0=17 (AF_PACKET) a1=3 (SOCK_RAW) a2=300 (ETH_P_ALL/IP)',
          'auditd SYSCALL Record: syscall=54 (setsockopt) level=SOL_SOCKET optname=SO_ATTACH_FILTER (26)',
          'BPF Magic Constants: 0x7255 (UDP/TCP), 0x5293 (ICMP)',
        ],
        defenseMitigation:
          'Configure Linux auditd rules to log all AF_PACKET raw socket creations (-a always,exit -F arch=b64 -S socket -F a0=17 -k raw_packet_socket) by non-network-monitoring binaries.',
        logs: [
          {
            id: 'dfir-bpf-2',
            timestamp: '03:12:09.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 41,
            ProcessName: 'kdmtmpflush',
            CommandLine: 'socket(AF_PACKET, SOCK_RAW, ETH_P_IP) + setsockopt(SO_ATTACH_FILTER)',
            raw: 'type=SYSCALL msg=audit(1762139529.450:5201): arch=c000003e syscall=41 (socket) success=yes exit=4 a0=11 (AF_PACKET) a1=3 (SOCK_RAW) a2=8 pid=4819 uid=0 comm="kdmtmpflush" exe="/dev/shm/kdmtmpflush (deleted)" key="raw_packet_socket"',
            parsedFields: {
              Syscall: '41 (sys_socket AF_PACKET=17, SOCK_RAW=3)',
              SocketOption: 'setsockopt(SOL_SOCKET, SO_ATTACH_FILTER)',
              BpfMagicSignatures: '0x7255 (TCP/UDP) / 0x5293 (ICMP)',
              AuditKey: 'raw_packet_socket',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Discovery via /proc/net/packet, ss -0pb & /var/run/haldrund.pid Mutex',
        narration:
          'During live Linux DFIR triage, the responder inspects /proc/net/packet (which lists all active AF_PACKET sockets in the kernel) and runs ss -0pb (which dumps packet sockets, owning PIDs, and attached BPF bytecode instructions), immediately exposing PID 4819 along with its zero-byte lock file at /var/run/haldrund.pid.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1205.002 - /proc/net/packet & ss -0pb BPF Filter Inspection)',
        technicalCommands: [
          'cat /proc/net/packet  # Lists sk, Type=3 (SOCK_RAW), Proto=0800, Running=1, Inode=29418',
          'ss -0pb  # Displays p_raw socket owned by users:(("kdmtmpflush",pid=4819,fd=4)) + BPF filter instructions',
          'ls -la /var/run/haldrund.pid',
        ],
        defenseMitigation:
          'Include /proc/net/packet and ss -0pb output in all Linux incident response collection scripts and memory forensics (Volatility linux_pkt_queues / linux_netstat).',
        logs: [
          {
            id: 'dfir-bpf-3',
            timestamp: '03:20:00.100',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 800,
            ProcessName: 'ss',
            CommandLine: 'ss -0pb revealing AF_PACKET SOCK_RAW filter on PID 4819 (kdmtmpflush)',
            raw: 'proc_net_packet: sk=ffff88810492a800 RefCnt=2 Type=3 Proto=0800 Iface=0 R=1 User=0 Inode=29418 | ss_0pb: p_raw UNCONN 0 0 *:ip * users:(("kdmtmpflush",pid=4819,fd=4)) bpf_filter="(000) ldh [12] (001) jeq #0x800 ... jeq #0x7255"',
            parsedFields: {
              KernelProcTable: '/proc/net/packet (Proto=0800 Type=3 Inode=29418)',
              SocketDiagnostic: 'ss -0pb (Dumps classic BPF opcodes and PID 4819)',
              MutexArtifact: '/var/run/haldrund.pid',
              MemoryRecovery: 'cp /proc/4819/exe /forensics/recovered_bpfdoor.elf',
            },
          },
        ],
      },
    ],
  };
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
