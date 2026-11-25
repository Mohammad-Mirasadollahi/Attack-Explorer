import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'linux-bpfdoor-ebpf-socket-filter-apt',
    title: 'BPFDoor Passive Linux Rootkit & Classic BPF Magic Packet Filter (Red Menshen)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1205.002',
    description:
      'Red Menshen (China-nexus APT) deploys BPFDoor onto Linux telecommunications and enterprise servers. BPFDoor copies itself to /dev/shm/kdmtmpflush, deletes its binary, masquerades as hald-addon-acpi, and attaches a kernel Berkeley Packet Filter (SO_ATTACH_FILTER) to a raw socket to passively await magic packets (0x7255 UDP/ICMP or 0x5293 TCP) before local iptables rules.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Red Menshen Operator (Magic Packet)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Linux Host eth0 (Before iptables)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Raw Socket BPF Filter (0x7255 / 0x5293)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'PwC / Sandfly / Elastic Linux Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Masqueraded Shell (/dev/shm/kdmtmpflush)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading',
        narration:
          'Upon execution, BPFDoor copies itself into the RAM-backed tmpfs directory /dev/shm/kdmtmpflush, timestomps the file to 2008, re-executes with --init, immediately unlinks /dev/shm/kdmtmpflush from disk, and overwrites its argv[0] process title to masquerade as a system daemon (/usr/libexec/postfix/master or hald-addon-acpi).',
        activeNodes: ['attacker', 'ad'],
        mitreTactic: 'Defense Evasion (T1036.004 - Masquerade Task or Service / T1070.004)',
        technicalCommands: [
          'cp $0 /dev/shm/kdmtmpflush && chmod +x /dev/shm/kdmtmpflush && touch -t 200810300000 /dev/shm/kdmtmpflush',
          '/dev/shm/kdmtmpflush --init -> rm -f /dev/shm/kdmtmpflush -> prctl(PR_SET_NAME, "hald-addon-acpi")',
        ],
        defenseMitigation:
          'Mount `/dev/shm` with the `noexec,nosuid,nodev` mount options in `/etc/fstab` and monitor `/proc/[pid]/exe` for `(deleted)` binaries running from `/dev/shm`.',
        logs: [
          {
            id: 'bpf-1',
            timestamp: '03:02:11.104',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'kdmtmpflush',
            raw: 'Linux Forensics Alert (Sandfly) | PID: 2914 | SpoofedComm: hald-addon-acpi: listening on acpi kernel interface | RealExeSymlink: /dev/shm/kdmtmpflush (deleted) | Note: BPFDoor RAM-resident unlinked execution',
            parsedFields: {
              SpoofedProcessName: 'hald-addon-acpi / /usr/libexec/postfix/master',
              ProcExeSymlink: '/dev/shm/kdmtmpflush (deleted)',
              ThreatActor: 'Red Menshen',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)',
        narration:
          'Without binding any TCP or UDP port (remaining invisible to netstat -tlpn and ss), BPFDoor opens a raw packet socket (socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))) and calls setsockopt(..., SO_ATTACH_FILTER, ...) to load a 30-instruction classic BPF bytecode filter into the Linux kernel network stack.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence & Defense Evasion (T1205.002 - Socket Filters)',
        technicalCommands: [
          'sock = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))',
          'setsockopt(sock, SOL_SOCKET, SO_ATTACH_FILTER, &bpf_prog, sizeof(bpf_prog)) (Checks magic bytes 0x7255 UDP/ICMP or 0x5293 TCP)',
        ],
        defenseMitigation:
          'Audit active raw packet sockets across Linux servers via `ss -0pb` (which dumps attached BPF bytecode filters) and alert on processes holding `CAP_NET_RAW` that are not legitimate `tcpdump`/`dhclient` binaries.',
        logs: [
          {
            id: 'bpf-2',
            timestamp: '03:02:11.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'Linux Socket Filter Alert (ss -0pb) | Process: hald-addon-acpi (PID 2914) | SocketType: AF_PACKET SOCK_RAW | Syscall: setsockopt(SOL_SOCKET, SO_ATTACH_FILTER) | FilterConstants: 0x7255 (29269), 0x5293 (21139)',
            parsedFields: {
              SocketCall: 'socket(AF_PACKET, SOCK_RAW) + setsockopt(SO_ATTACH_FILTER)',
              MagicHexConstants: '0x7255 (UDP/ICMP) & 0x5293 (TCP)',
              FirewallBypass: 'Inspects packets at NIC driver tap before iptables/nftables',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell',
        narration:
          'After months of zero-traffic dormancy, the Red Menshen operator sends a single TCP/UDP/ICMP packet containing magic value 0x7255 or 0x5293 and an MD5-hashed password. The kernel BPF filter passes the packet to BPFDoor, which dynamically inserts an iptables PREROUTING REDIRECT rule or initiates an RC4-encrypted reverse PTY shell.',
        activeNodes: ['attacker', 'firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Command and Control (T1205.001 - Traffic Signaling)',
        technicalCommands: [
          'Magic Packet Received: UDP payload magic=0x7255 + pass=<valid_hash> + attacker_ip:port',
          '/sbin/iptables -t nat -A PREROUTING -p tcp -s <attacker_ip> --dport 22 -j REDIRECT --to-ports 42391 (Redirect SSH port to ephemeral BPFDoor PTY)',
        ],
        defenseMitigation:
          'Deploy network IDS signatures for `0x7255` / `0x5293` magic packet structures and monitor `iptables -t nat` for transient `PREROUTING REDIRECT` rules.',
        logs: [
          {
            id: 'bpf-3',
            timestamp: '09:44:18.902',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'iptables',
            CommandLine: '/sbin/iptables -t nat -A PREROUTING -p tcp -s 198.51.100.204 --dport 22 -j REDIRECT --to-ports 42391',
            raw: 'BPFDoor Activation Alert | Trigger: Magic Packet 0x7255 from 198.51.100.204 | Action: Spawned /dev/ptmx interactive shell & inserted iptables nat PREROUTING REDIRECT on port 22',
            parsedFields: {
              TriggerPacket: 'Magic 0x7255 from 198.51.100.204',
              NatRedirectRule: 'iptables -t nat -A PREROUTING --dport 22 -j REDIRECT --to-ports 42391',
              ShellDevice: '/dev/ptmx (No wtmp/utmp login record)',
            },
          },
        ],
        packets: [
          {
            id: 'bpf-pkt-1',
            timestamp: '09:44:18.880',
            protocol: 'UDP',
            sourceIp: '198.51.100.204',
            destIp: '203.0.113.19',
            port: 53,
            flag: 'NONE',
            payloadSize: 64,
            hexDump: '72 55 01 00 6A 75 73 74 66 6F 72 66 75 6E 00 00 C6 33 64 CC 11 5B',
            decodedString: 'BPFDoor Magic UDP Packet: Magic=0x7255 | Pass="justforfun" | Callback=198.51.100.204:4443',
          },
        ],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'linux-bpfdoor-ebpf-socket-filter-apt',
    briefing: {
      headline:
        'Red Menshen deploys BPFDoor onto Linux servers, copying itself to /dev/shm/kdmtmpflush, unlinking the binary, masquerading as hald-addon-acpi, and attaching a kernel Berkeley Packet Filter (SO_ATTACH_FILTER) to passively sniff magic packets (0x7255 / 0x5293) ahead of iptables.',
      storyAnalogy:
        'Imagine a spy hiding inside a central post office who doesn’t rent a P.O. Box (listening port) and never makes outgoing phone calls (beacons). Instead, the spy stands invisibly beside the mail chute at the very entrance, ahead of the building’s security checkpoint (iptables), watching every piece of mail addressed to anyone else. Only when a postcard arrives with a secret watermark (0x7255) does the spy step out and unlock a side door.',
      plainSummary:
        'In this scenario (T1036.004, BPFDoor Passive Linux Rootkit & Classic BPF Magic Packet Filter (Red Menshen)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: in-Memory /dev/shm/kdmtmpflush Execution, then attaching Kernel Berkeley Packet Filter, then magic Packet Activation, iptables Port. Steps #1–#3 walk that chain end-to-end by covering In-Memory /dev/shm/kdmtmpflush Execution, then Attaching Kernel Berkeley Packet Filter, then Magic Packet Activation, iptables Port, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Red Menshen Operator (Magic Packet) -> Linux Host eth0 (Before iptables) -> Raw Socket BPF Filter (0x7255 / 0x5293) -> Masqueraded Shell (/dev/shm/kdmtmpflush) -> PwC / Sandfly / Elastic Linux Sensor.',
      documentedAdvisory:
        'PwC Threat Intelligence Red Menshen / BPFDoor Report / Sandfly Security BPFDoor Forensic Analysis / Elastic Security Labs Guide',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1036.004',
        plainTitle: 'In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading',
        storyAnalogy:
          'The spy copies their disguise into temporary RAM memory, burns the original file on disk, changes their file timestamp to 2008, and puts on a nametag reading "Linux Power Management Daemon."',
        simpleExplanation:
          'When launched as root, BPFDoor copied its ELF binary to /dev/shm/kdmtmpflush (the RAM-backed tmpfs shared memory filesystem), timestomped its modification date to 2008-10-30, re-executed itself with --init, immediately deleted /dev/shm/kdmtmpflush from the filesystem (leaving the process running purely in RAM while /proc/<pid>/exe pointed to /dev/shm/kdmtmpflush (deleted)), and called prctl(PR_SET_NAME) plus argv[0] overwriting to masquerade as hald-addon-acpi: listening on acpi kernel interface or /usr/libexec/postfix/master.',
        howItWorksInPractice:
          'Standard administrator checks like ps aux displayed a convincing Linux system daemon name, while disk-based antivirus scans found nothing because the executable file had already been unlinked. In the documented EventID 1 exchange from Red Menshen Operator (Magic Packet) to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ALERT 1 (confirming that the kdmtmpflush request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Red Menshen Operator to the Masqueraded Shell (/dev/shm/kdmtmpflush) during initial RAM staging.',
        detectionAndEvidence:
          'Scan /proc/[0-9]*/exe symbolic links across Linux hosts for targets pointing to /dev/shm/* (deleted) (which exposes memory-backed binaries that erased themselves from disk) and compare /proc/[pid]/comm against the actual resolved binary path in /proc/[pid]/exe. Correlate Sysmon or Windows Security Event telemetry for T1036.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1205.002',
        plainTitle: 'Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)',
        storyAnalogy:
          'Instead of opening a numbered door that shows up on the building directory (netstat), the spy installs a tiny sieve inside the main network pipe that only lets through packets carrying the secret watermark.',
        simpleExplanation:
          'BPFDoor called socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) to create a raw packet socket and invoked setsockopt(sock, SOL_SOCKET, SO_ATTACH_FILTER, &bpf_prog...) (attaching a 30-instruction classic Berkeley Packet Filter bytecode program into the Linux kernel that inspects every frame arriving on the network card before iptables or nftables firewall rules are evaluated, dropping normal traffic so BPFDoor consumes 0% CPU until a packet containing magic bytes 0x7255 at UDP/ICMP offset or 0x5293 at TCP offset arrives).',
        howItWorksInPractice:
          'Because AF_PACKET sockets do not bind a TCP or UDP port, netstat -tlpn, ss -tlpn, and external port scanners (nmap) show zero open backdoor ports, and the attacker can send the magic packet to any port (even ports blocked by iptables or already used by Apache/SSH on port 443/22). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Linux Host eth0 (Before iptables) to the Raw Socket BPF Filter (0x7255 / 0x5293) and triggers the PwC / Sandfly / Elastic Linux Sensor.',
        detectionAndEvidence:
          'Running ss -0pb on Linux to enumerate AF_PACKET raw sockets and their attached BPF bytecode filters (specifically looking for decimal constants 29269 (0x7255) and 21139 (0x5293)). Correlate Sysmon or Windows Security Event telemetry for T1205.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1205.001',
        plainTitle: 'Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell',
        storyAnalogy:
          'When the secret postcard arrives, the spy checks the password written on it, temporarily bends the front-door mail tube (SSH Port 22) straight to their hidden room for the attacker’s IP address only, and erases the bend when finished.',
        simpleExplanation:
          'Upon receiving a TCP, UDP, or ICMP Echo packet containing 0x7255 / 0x5293 and a valid password hash, BPFDoor forked a child process, allocated a pseudo-terminal (/dev/ptmx without recording a login in /var/log/wtmp or utmp), and either connected back to the attacker with an RC4-encrypted reverse shell or executed /sbin/iptables -t nat -A PREROUTING -p tcp -s <attacker_ip> --dport 22 -j REDIRECT --to-ports <ephemeral_port> (hijacking inbound connections on legitimate port 22/80/443 exclusively for the attacker’s source IP while all other users still reached the real SSH/web server).',
        howItWorksInPractice:
          'As soon as the interactive session ended, BPFDoor executed iptables -t nat -D PREROUTING ... to delete the temporary NAT redirection rule and return to passive dormancy. In the documented EventID 1 exchange from Linux Host eth0 (Before iptables) to Raw Socket BPF Filter (0x7255 / 0x5293), Raw Socket BPF Filter (0x7255 / 0x5293) responds with ALERT 1 (confirming that the /sbin/iptables -t nat -A PREROUTING -p tcp -s 198.51.100.204 --dport 22 -j REDIRECT --to-ports 42391 request succeeded on Raw Socket BPF Filter (0x7255 / 0x5293) and completing the final execution objective of BPFDoor Passive Linux Rootkit & Classic BPF Magic Packet Filter (Red Menshen)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Magic Packet from the Red Menshen Operator through eth0 and the Raw Socket BPF Filter to activate the Masqueraded Shell.',
        detectionAndEvidence:
          'Network IDS rules matching 0x7255 / 0x5293 magic payloads and Linux auditd monitoring for setsockopt (SO_ATTACH_FILTER) and unexpected iptables -t nat invocations.',
      },
    ],
  };
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
