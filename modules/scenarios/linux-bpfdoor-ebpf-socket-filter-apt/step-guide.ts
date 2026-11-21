import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
