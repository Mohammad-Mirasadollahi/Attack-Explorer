import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
