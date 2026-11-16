import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS: LegacyDraftScenario[] = [
  {
    id: 'dfir-linux-auditd-pam-sshd-authorized-keys-persistence',
    title: 'Red Hat, CISA & MITRE DFIR — Linux auditd SSH authorized_keys & PAM Module Persistence Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1098.004',
    description:
      'Grounded in the Red Hat Enterprise Linux Security & Auditd Guide, CISA Linux Incident Response Guidance, and MITRE ATT&CK T1098.004 / T1556.003: an incident responder investigates unauthorized SSH key persistence and Pluggable Authentication Modules (PAM) tampering on a production Linux server by correlating Linux kernel auditd SYSCALL/PATH records (openat, write, chmod on ~/.ssh/authorized_keys and /lib64/security/pam_unix.so) with /var/log/secure and /var/log/auth.log Accepted publickey Fingerprints.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External SSH Client (:22)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'sshd Daemon (PAM Stack)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '~/.ssh/authorized_keys File', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd & /var/log/secure', type: 'siem', status: 'normal' },
      { id: 'ad', label: '/lib64/security/pam_unix.so', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Linux Auditd File-Watch Trigger on ~/.ssh/authorized_keys Modification (SYSCALL openat)',
        narration:
          'When a compromised service process modifies /root/.ssh/authorized_keys with the O_WRONLY|O_CREAT|O_APPEND flags, the Linux kernel audit subsystem (configured with -w /root/.ssh -p wa -k ssh_persistence) emits correlated SYSCALL, CWD, and PATH records in /var/log/audit/audit.log capturing the exact process (exe), login UID (auid), effective UID (euid), and inode number.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1098.004 - Account Manipulation: SSH Authorized Keys)',
        technicalCommands: [
          'auditctl -w /root/.ssh -p wa -k ssh_persistence',
          'auditd SYSCALL Record: syscall=257 (openat) success=yes auid=1001 uid=0 euid=0 exe="/usr/bin/python3.11" key="ssh_persistence"',
          'auditd PATH Record: item=0 name="/root/.ssh/authorized_keys" inode=1310942 mode=0100600 nametype=NORMAL',
        ],
        defenseMitigation:
          'Configure immutable auditd watch rules (-w /root/.ssh -p wa -k ssh_keys and -w /etc/ssh/sshd_config -p wa -k sshd_config) and ship /var/log/audit/audit.log to a remote SIEM.',
        logs: [
          {
            id: 'dfir-linux-ssh-1',
            timestamp: '01:14:22.104',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'python3',
            CommandLine: 'python3.11 modifying /root/.ssh/authorized_keys (key=ssh_persistence)',
            raw: 'type=SYSCALL msg=audit(1762132462.104:4102): arch=c000003e syscall=257 success=yes exit=3 auid=1001 uid=0 euid=0 comm="python3" exe="/usr/bin/python3.11" key="ssh_persistence" | type=PATH msg=audit(1762132462.104:4102): item=0 name="/root/.ssh/authorized_keys" inode=1310942 mode=0100600 nametype=NORMAL',
            parsedFields: {
              AuditKey: 'ssh_persistence',
              Syscall: '257 (sys_openat with O_WRONLY|O_APPEND)',
              AuditLoginUid: 'auid=1001 (Pivoted User) -> euid=0 (root)',
              ModifiedPath: '/root/.ssh/authorized_keys (inode 1310942)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: PAM Shared Library Modification Detection in /lib64/security/ (rpm -Va & auditd)',
        narration:
          'To retain access even if SSH keys are rotated, the actor modifies /lib64/security/pam_unix.so inside the Pluggable Authentication Modules directory. During DFIR triage, running rpm -Va pam (or dpkg --verify libpam-modules) flags an S.5....T. (Size, MD5/SHA256 digest, and mtime mismatch) on /lib64/security/pam_unix.so alongside an auditd watch event on /lib64/security.',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1556.003 - Modify Authentication Process: Pluggable Authentication Modules)',
        technicalCommands: [
          'rpm -Va pam  # Output: S.5....T.    /usr/lib64/security/pam_unix.so',
          'auditctl -w /usr/lib64/security -p wa -k pam_tampering',
          'stat /usr/lib64/security/pam_unix.so  # Compares ctime (inode change time) against package install date',
        ],
        defenseMitigation:
          'Monitor /lib/security and /usr/lib64/security with File Integrity Monitoring (AIDE / auditd) and run periodic rpm -Va / dpkg --verify integrity checks against signed package databases.',
        logs: [
          {
            id: 'dfir-linux-ssh-2',
            timestamp: '01:15:04.880',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 82,
            ProcessName: 'cp',
            CommandLine: 'rpm -Va pam verification alert: S.5....T. /usr/lib64/security/pam_unix.so',
            raw: 'type=SYSCALL msg=audit(1762132504.880:4119): arch=c000003e syscall=82 (rename) success=yes auid=1001 uid=0 comm="mv" exe="/usr/bin/mv" key="pam_tampering" | type=PATH item=1 name="/usr/lib64/security/pam_unix.so" | rpm_verify="S.5....T. /usr/lib64/security/pam_unix.so"',
            parsedFields: {
              AuditKey: 'pam_tampering',
              RpmVerifyFlags: 'S.5....T. (File Size, Digest, and Timestamp Altered)',
              TamperedLibrary: '/usr/lib64/security/pam_unix.so',
              MitreTechnique: 'T1556.003 (PAM Authentication Modification)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Correlating /var/log/secure Accepted publickey SHA256 Fingerprint & USER_AUTH Auditd Events',
        narration:
          'When the external actor reconnects over TCP 22, sshd logs "Accepted publickey for root from 198.51.100.77 port 51922 ssh2: ED25519 SHA256:k9L2m..." in /var/log/secure (or /var/log/auth.log) and emits a Linux auditd type=USER_AUTH / type=USER_LOGIN record, allowing the responder to match the logged SHA256 fingerprint directly to the key line added in Stage 1.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021.004 - Remote Services: SSH Public Key Correlation)',
        technicalCommands: [
          'ssh-keygen -lf /root/.ssh/authorized_keys  # Computes SHA256 fingerprint for every authorized key entry',
          'grep "Accepted publickey" /var/log/secure',
          'ausearch -m USER_AUTH,USER_LOGIN -sv yes',
        ],
        defenseMitigation:
          'Disable PermitRootLogin in /etc/ssh/sshd_config, enforce short-lived SSH certificates via a central CA instead of static authorized_keys files, and correlate ssh-keygen -lf fingerprints with /var/log/secure.',
        logs: [
          {
            id: 'dfir-linux-ssh-3',
            timestamp: '01:18:10.312',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1100,
            ProcessName: 'sshd',
            CommandLine: 'sshd: root@pts/0 (Accepted publickey ED25519 SHA256:k9L2m8xPqR4vT1nZ...)',
            raw: 'Nov 03 01:18:10 prod-db01 sshd[18422]: Accepted publickey for root from 198.51.100.77 port 51922 ssh2: ED25519 SHA256:k9L2m8xPqR4vT1nZ0wXyB7cV5gH3jK | type=USER_LOGIN msg=audit(1762132690.312:4155): pid=18422 uid=0 auid=0 ses=94 acct="root" exe="/usr/sbin/sshd" addr=198.51.100.77 terminal=/dev/pts/0 res=success',
            parsedFields: {
              AuthLogEvent: 'Accepted publickey for root from 198.51.100.77',
              KeyFingerprint: 'ED25519 SHA256:k9L2m8xPqR4vT1nZ0wXyB7cV5gH3jK',
              AuditRecordType: 'USER_LOGIN (ses=94 res=success)',
              DaemonExecutable: '/usr/sbin/sshd',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics',
    title: 'PwC, CrowdStrike & Elastic DFIR — Linux BPFDoor Raw Socket Filter, /dev/shm Masquerading & /proc/net/packet Forensics',
    category: 'LOG_ANALYSIS',
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
  },
  {
    id: 'dfir-linux-ld-so-preload-userland-rootkit-proc-maps',
    title: 'NCSC-NL, Red Hat & MITRE DFIR — Linux /etc/ld.so.preload Userland Rootkit & /proc/1/maps Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1574.006',
    description:
      'Grounded in NCSC-NL Linux Incident Response guidelines, Red Hat Dynamic Linker (ld.so) documentation, and MITRE ATT&CK T1574.006: a userland shared-object rootkit writes the path of a malicious library (/lib64/libudev- guardian.so) into /etc/ld.so.preload so the dynamic linker (/lib64/ld-linux-x86-64.so.2) injects it into every dynamically linked process to hook readdir(), fopen(), and accept()—detectable via /proc/1/maps, LD_TRACE_LOADED_OBJECTS, and statically linked busybox/auditd.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rootkit Installer Process', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ld-linux-x86-64.so.2 Linker', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '/etc/ld.so.preload Config', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'auditd & /proc/1/maps Check', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Hooked libc readdir/fopen', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Shared Library Compilation & /etc/ld.so.preload Registration (auditd nametype=CREATE)',
        narration:
          'The actor places a malicious ELF shared object at /usr/lib64/libudev-guardian.so and writes its path into /etc/ld.so.preload. Because the kernel audit daemon (auditd) operates at the system-call boundary below userland libc hooks, an audit watch on /etc/ld.so.preload logs the exact file creation and write.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Persistence (T1574.006 - Hijack Execution Flow: Dynamic Linker Hijacking)',
        technicalCommands: [
          'auditctl -w /etc/ld.so.preload -p wa -k ld_preload_hijack',
          'auditd PATH Record: name="/etc/ld.so.preload" inode=529104 nametype=CREATE',
          'Injected Shared Object: /usr/lib64/libudev-guardian.so',
        ],
        defenseMitigation:
          'Monitor /etc/ld.so.preload, /etc/ld.so.conf, and /etc/ld.so.conf.d/ via Linux auditd kernel rules and Falco eBPF sensors.',
        logs: [
          {
            id: 'dfir-ldso-1',
            timestamp: '05:40:11.200',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'bash',
            CommandLine: 'auditd alert: /etc/ld.so.preload created pointing to /usr/lib64/libudev-guardian.so',
            raw: 'type=SYSCALL msg=audit(1762148411.200:6104): arch=c000003e syscall=257 (openat) success=yes exit=3 uid=0 comm="bash" exe="/usr/bin/bash" key="ld_preload_hijack" | type=PATH item=1 name="/etc/ld.so.preload" inode=529104 mode=0100644 nametype=CREATE',
            parsedFields: {
              AuditKey: 'ld_preload_hijack',
              CreatedFile: '/etc/ld.so.preload',
              PreloadedLibrary: '/usr/lib64/libudev-guardian.so',
              MitreTechnique: 'T1574.006 (Dynamic Linker Hijacking)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Global Dynamic Linker Injection & Userland PLT/GOT Hooking of readdir64() and fopen()',
        narration:
          'On every subsequent execution of a dynamically linked binary (such as ps, ls, netstat, or lsof), /lib64/ld-linux-x86-64.so.2 reads /etc/ld.so.preload and maps libudev-guardian.so before libc.so.6. The library overrides readdir64() and fopen("/proc/net/tcp") via dlsym(RTLD_NEXT, ...) so standard userland tools hide the rootkit’s files, PIDs, and network connections—including hiding /etc/ld.so.preload itself.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit: Userland libc Function Hooking)',
        technicalCommands: [
          'Dynamic Linker Loader: /lib64/ld-linux-x86-64.so.2 parses /etc/ld.so.preload prior to libc.so.6',
          'Hooked Symbols: readdir(), readdir64(), fopen(), fopen64(), __xstat(), accept()',
          'Evasion Behavior: Hides "/etc/ld.so.preload" and "libudev-guardian.so" from dynamically linked ls/cat',
        ],
        defenseMitigation:
          'Never rely solely on dynamically linked host binaries on a suspected compromised Linux system; use statically compiled busybox or inspect kernel structures directly.',
        logs: [
          {
            id: 'dfir-ldso-2',
            timestamp: '05:40:15.610',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 9,
            ProcessName: 'ps',
            CommandLine: 'ld-linux-x86-64.so.2 mapping /usr/lib64/libudev-guardian.so into /usr/bin/ps',
            raw: 'type=MMAP msg=audit(1762148415.610:6120): fd=3 flags=0x802 (MAP_PRIVATE|MAP_DENYWRITE) path="/usr/lib64/libudev-guardian.so" comm="ps" exe="/usr/bin/ps"',
            parsedFields: {
              DynamicLinker: '/lib64/ld-linux-x86-64.so.2',
              InjectedIntoProcess: '/usr/bin/ps, /usr/bin/ls, /usr/bin/ss',
              HookMechanism: 'dlsym(RTLD_NEXT) overriding libc readdir64/fopen',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Detection via /proc/1/maps, /proc/self/map_files & Statically Linked Busybox',
        narration:
          'During DFIR triage, the analyst bypasses userland libc hooks by inspecting /proc/1/maps (or /proc/self/maps via a shell builtin read loop) and running a statically linked busybox binary (which does not use ld-linux.so and is immune to /etc/ld.so.preload). Every running process memory map clearly displays /usr/lib64/libudev-guardian.so mapped with r-xp permissions.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1574.006 - /proc/self/maps & Static Binary Verification)',
        technicalCommands: [
          'while read line; do echo "$line"; done < /proc/self/maps  # Pure bash builtin bypasses external binary hooks',
          './busybox-static cat /etc/ld.so.preload  # Static ELF ignores ld-linux.so preload',
          'Memory Map Entry: 7f8a91c00000-7f8a91c04000 r-xp 00001000 fd:00 918273 /usr/lib64/libudev-guardian.so',
        ],
        defenseMitigation:
          'Compare loaded shared libraries in /proc/*/maps against the RPM/DPKG package database (rpm -qf <library_path>) to immediately identify unowned shared objects injected across system daemons.',
        logs: [
          {
            id: 'dfir-ldso-3',
            timestamp: '05:45:00.112',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 918,
            ProcessName: 'busybox',
            CommandLine: 'busybox-static revealing /etc/ld.so.preload & /usr/lib64/libudev-guardian.so in /proc/1/maps',
            raw: 'proc_maps_scan: pid=1 comm="systemd" region="7f8a91c00000-7f8a91c04000" perms="r-xp" inode=918273 path="/usr/lib64/libudev-guardian.so" rpm_owner="file /usr/lib64/libudev-guardian.so is not owned by any package"',
            parsedFields: {
              ForensicSource: '/proc/1/maps & /proc/self/maps',
              UnownedSharedObject: '/usr/lib64/libudev-guardian.so (RPM Unowned)',
              VerificationTool: 'Statically linked busybox + bash builtin read',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-linux-systemd-generator-cron-udev-persistence',
    title: 'Freedesktop Systemd Spec & Elastic DFIR — Linux systemd Generator (/run/systemd/generator) & Unit Persistence Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1543.002',
    description:
      'Grounded in the Freedesktop.org systemd.generator(7) and systemd.unit(5) specifications, Elastic Security Labs Linux persistence research, and MITRE ATT&CK T1543.002: an adversary achieves stealthy boot/daemon-reload persistence by placing a script inside /etc/systemd/system-generators/ (or a drop-in .conf inside /etc/systemd/system/<service>.service.d/) that dynamically generates an ephemeral unit in /run/systemd/generator/ whenever systemctl daemon-reload runs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Privileged Root Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'systemd-generators Directory', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '/run/systemd/generator Unit', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'journalctl & systemd-analyze', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'systemd (PID 1) ExecStart', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping Executable Generator into /etc/systemd/system-generators/ (auditd PATH Record)',
        narration:
          'Instead of creating a conspicuous unit file directly in /etc/systemd/system/, the actor drops a small executable script at /etc/systemd/system-generators/dbus- early-check (or /usr/lib/systemd/system-generators/). According to the systemd.generator(7) specification, PID 1 executes all binaries in this directory very early during boot and on every systemctl daemon-reload.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence (T1543.002 - Create or Modify System Process: Systemd Service)',
        technicalCommands: [
          'auditctl -w /etc/systemd/ -p wa -k systemd_persistence',
          'auditctl -w /usr/lib/systemd/system-generators/ -p wa -k systemd_generators',
          'Generator Path: /etc/systemd/system-generators/dbus-early-check (mode 0755)',
        ],
        defenseMitigation:
          'Include /etc/systemd/system-generators/, /usr/local/lib/systemd/system-generators/, and /usr/lib/systemd/system-generators/ in auditd and File Integrity Monitoring rules.',
        logs: [
          {
            id: 'dfir-systemd-1',
            timestamp: '02:08:14.110',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'chmod',
            CommandLine: 'chmod 0755 /etc/systemd/system-generators/dbus-early-check',
            raw: 'type=SYSCALL msg=audit(1762135694.110:4910): arch=c000003e syscall=268 (fchmodat) success=yes auid=1000 uid=0 comm="chmod" exe="/usr/bin/chmod" key="systemd_persistence" | type=PATH item=0 name="/etc/systemd/system-generators/dbus-early-check" mode=0100755',
            parsedFields: {
              AuditKey: 'systemd_persistence',
              GeneratorBinary: '/etc/systemd/system-generators/dbus-early-check',
              Permissions: '0100755 (Executable required by systemd.generator spec)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Ephemeral Unit Synthesis in /run/systemd/generator/ on systemctl daemon-reload',
        narration:
          'When systemctl daemon-reload is triggered, systemd (PID 1) invokes /etc/systemd/system-generators/dbus-early-check, passing /run/systemd/generator as argv[1]. The generator writes an ephemeral unit file (/run/systemd/generator/network-health.service) and symlinks it into /run/systemd/generator/multi-user.target.wants/.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Persistence (T1543.002 - Ephemeral /run/systemd/generator/ Unit Synthesis)',
        technicalCommands: [
          'systemctl daemon-reload  # Invokes all generators with argv[1]=/run/systemd/generator',
          'Generated Ephemeral Unit: /run/systemd/generator/network-health.service',
          'Generated Symlink: /run/systemd/generator/multi-user.target.wants/network-health.service',
        ],
        defenseMitigation:
          'Inspect /run/systemd/generator/, /run/systemd/generator.early/, and /run/systemd/generator.late/ during live DFIR triage—standard checks limited to /etc/systemd/system/ miss generator-synthesized units.',
        logs: [
          {
            id: 'dfir-systemd-2',
            timestamp: '02:08:19.420',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'systemd',
            CommandLine: '/etc/systemd/system-generators/dbus-early-check /run/systemd/generator /run/systemd/generator.early /run/systemd/generator.late',
            raw: 'journald: systemd[1]: Reloading. | auditd: pid=3912 ppid=1890 uid=0 exe="/etc/systemd/system-generators/dbus-early-check" proctitle="/etc/systemd/system-generators/dbus-early-check /run/systemd/generator" | Created="/run/systemd/generator/network-health.service"',
            parsedFields: {
              ParentProcess: 'systemd (PID 1 / sd-executor)',
              GeneratorOutputDir: '/run/systemd/generator/',
              SynthesizedUnit: '/run/systemd/generator/network-health.service',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Attribution via systemctl statusFragmentPath, systemd-analyze & journalctl _SYSTEMD_UNIT',
        narration:
          'During incident response, running systemctl show -p FragmentPath,SourcePath,ExecStart network-health.service and systemd-analyze unit-paths exposes that the active service originates from /run/systemd/generator/network-health.service, while journalctl _PID=1 correlates the reload timestamp with the generator script.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1543.002 - FragmentPath & journalctl Forensic Attribution)',
        technicalCommands: [
          'systemctl show -p Id,FragmentPath,SourcePath,ExecStart,DropInPaths network-health.service',
          'systemd-analyze verify /run/systemd/generator/network-health.service',
          'journalctl _SYSTEMD_UNIT=network-health.service -o verbose',
        ],
        defenseMitigation:
          'Enumerate all loaded units via systemctl list-units --all -o json and verify FragmentPath and DropInPaths for every running service.',
        logs: [
          {
            id: 'dfir-systemd-3',
            timestamp: '02:09:00.105',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'systemctl',
            CommandLine: 'systemctl show -p FragmentPath,ExecStart network-health.service',
            raw: 'systemd_unit_audit: Id=network-health.service FragmentPath=/run/systemd/generator/network-health.service ExecStart={ path=/usr/local/bin/net-telemetry-sync ; argv[]=/usr/local/bin/net-telemetry-sync --daemon } MainPID=4018',
            parsedFields: {
              UnitName: 'network-health.service',
              FragmentPath: '/run/systemd/generator/network-health.service (tmpfs)',
              ExecStartBinary: '/usr/local/bin/net-telemetry-sync',
              GeneratorOrigin: '/etc/systemd/system-generators/dbus-early-check',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape',
    title: 'NSA/CISA Kubernetes Guide & CNCF Falco DFIR — Kubernetes Audit Log Privileged Pod & hostPath Container Escape',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1611',
    description:
      'Grounded in the NSA/CISA Kubernetes Hardening Guidance, Official Kubernetes Auditing Documentation, and CNCF Falco eBPF runtime security rules: an attacker with a compromised ServiceAccount token creates a privileged pod mounting the worker node root filesystem (hostPath: / and hostPID: true), logged in the Kubernetes API Server audit.log (ObjectRef Resource="pods" Subresource="" Verb="create"), and uses nsenter -t 1 -m -u -i -n to enter the host OS namespaces.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Stolen ServiceAccount Token', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver (audit.log)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Privileged Pod (hostPath: /)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Worker Node Host PID 1 (nsenter)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ServiceAccount RBAC SelfSubjectRulesReview Reconnaissance in kube-apiserver audit.log',
        narration:
          'After compromising an application pod, the actor reads /var/run/secrets/kubernetes.io/serviceaccount/token and queries POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews (kubectl auth can-i --list). The Kubernetes API Server audit log records the exact user.username (system:serviceaccount:cicd:runner-sa), sourceIPs, and userAgent.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery: K8s RBAC Enumeration)',
        technicalCommands: [
          'K8s Audit Event: apiVersion="audit.k8s.io/v1" verb="create" resource="selfsubjectrulesreviews"',
          'user.username: "system:serviceaccount:cicd:runner-sa"',
          'responseStatus.code: 201 (Reveals verbs=["create","get","list"] on resource="pods")',
        ],
        defenseMitigation:
          'Set automountServiceAccountToken: false on pods that do not require Kubernetes API access and enforce least-privilege RBAC Roles instead of ClusterAdmin bindings.',
        logs: [
          {
            id: 'dfir-k8s-1',
            timestamp: '11:02:14.112',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews by system:serviceaccount:cicd:runner-sa',
            raw: '{"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","auditID":"91a2b3c4","stage":"ResponseComplete","requestURI":"/apis/authorization.k8s.io/v1/selfsubjectrulesreviews","verb":"create","user":{"username":"system:serviceaccount:cicd:runner-sa"},"sourceIPs":["10.244.1.18"],"responseStatus":{"code":201}}',
            parsedFields: {
              LogSource: 'Kubernetes API Server Audit Log (audit.k8s.io/v1)',
              RequestUri: '/apis/authorization.k8s.io/v1/selfsubjectrulesreviews',
              Principal: 'system:serviceaccount:cicd:runner-sa',
              SourcePodIp: '10.244.1.18',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Privileged Pod Creation with hostPID: true & hostPath: / (K8s Audit RequestObject)',
        narration:
          'The actor submits POST /api/v1/namespaces/cicd/pods creating a pod named node-debug-helper with securityContext.privileged=true, hostPID=true, and a volume mount with hostPath.path="/". At the RequestResponse audit level, kube-apiserver logs the complete requestObject JSON specification.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host: Privileged Pod & hostPath Mount)',
        technicalCommands: [
          'K8s Audit Event: requestURI="/api/v1/namespaces/cicd/pods" verb="create" responseStatus.code=201',
          'requestObject.spec.hostPID: true | requestObject.spec.hostNetwork: true',
          'requestObject.spec.containers[0].securityContext.privileged: true | volumes[0].hostPath.path: "/"',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Admission (PSA) with the "baseline" or "restricted" profile to block privileged: true, hostPID: true, and hostPath volumes at admission time.',
        logs: [
          {
            id: 'dfir-k8s-2',
            timestamp: '11:02:19.504',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /api/v1/namespaces/cicd/pods (node-debug-helper privileged=true hostPath=/)',
            raw: '{"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","requestURI":"/api/v1/namespaces/cicd/pods","verb":"create","user":{"username":"system:serviceaccount:cicd:runner-sa"},"objectRef":{"resource":"pods","namespace":"cicd","name":"node-debug-helper"},"requestObject":{"spec":{"hostPID":true,"containers":[{"name":"alp","securityContext":{"privileged":true}}],"volumes":[{"name":"host-root","hostPath":{"path":"/"}}]}}}',
            parsedFields: {
              PodName: 'cicd/node-debug-helper',
              SecurityContext: 'privileged: true, hostPID: true',
              HostVolumeMount: 'hostPath: "/" mounted at /host',
              HttpResponseCode: '201 Created',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Namespace Escape via nsenter -t 1 -m -u -i -n & Falco eBPF Alert',
        narration:
          'Because hostPID: true exposes the worker node PID 1 (/proc/1/ns/*) inside the container and privileged: true grants CAP_SYS_ADMIN, the actor executes nsenter --target 1 --mount --uts --ipc --net --pid to transition into the underlying worker node host namespaces—immediately triggering a CNCF Falco eBPF alert on setns() syscall execution from a container cgroup.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host via nsenter setns Syscall)',
        technicalCommands: [
          'Container Process: nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash',
          'Linux Syscall: syscall=308 (setns) joining /proc/1/ns/mnt and /proc/1/ns/pid',
          'Falco eBPF Rule: "Launch Privileged Container" + "Container Escape via nsenter"',
        ],
        defenseMitigation:
          'Deploy eBPF runtime security (Falco / Tetragon) to alert on setns (syscall 308) or unshare (syscall 272) invoked by processes whose container_id is not host.',
        logs: [
          {
            id: 'dfir-k8s-3',
            timestamp: '11:02:23.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 308,
            ProcessName: 'nsenter',
            CommandLine: 'nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash',
            raw: 'falco_alert: priority=CRITICAL rule="Container Escape via nsenter" proc.name="nsenter" proc.cmdline="nsenter --target 1 --mount --uts --ipc --net --pid" container.id="8f19c2a04b12" k8s.pod.name="node-debug-helper" syscall.type="setns (308)"',
            parsedFields: {
              RuntimeSensor: 'CNCF Falco eBPF / Linux Auditd',
              Syscall: '308 (sys_setns joining host PID 1 namespaces)',
              ContainerId: '8f19c2a04b12 (k8s.pod.name=node-debug-helper)',
              EscapedTarget: 'Worker Node Host OS (PID 1 Namespace)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics',
    title: 'AWS CIRT & Unit 42 DFIR — AWS CloudTrail IMDSv1 Role Theft, Off-Instance Replay & S3 Data Events Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1552.005',
    description:
      'Grounded in the AWS Security Incident Response Guide (AWS CIRT), Palo Alto Networks Unit 42 Cloud Threat Reports, and MITRE ATT&CK T1552.005: an attacker exploits an SSRF vulnerability on an EC2 web application to query the Instance Metadata Service (http://169.254.169.254/latest/meta-data/iam/security-credentials/) and exfiltrates the temporary ASIA... STS session token, replaying it from an external ASN IP—detectable in AWS CloudTrail via userIdentity.arn AssumedRole usage from a non-EC2 sourceIPAddress and GuardDuty InstanceCredentialExfiltration.OutsideAWS.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Host (198.51.100.55)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'EC2 Web App & IMDS 169.254', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'STS AssumedRole (ASIA...)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AWS CloudTrail & GuardDuty', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'S3 Bucket (GetObject Data Log)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: EC2 Instance Metadata Service (IMDSv1) SSRF Query & STS Token Retrieval',
        narration:
          'The attacker sends an HTTP request to a vulnerable web proxy on EC2 instance i-0a1b2c3d4e5f60001 pointing to http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole. Because IMDSv1 does not require a PUT session token with a TTL hop limit of 1, the metadata endpoint returns the temporary AccessKeyId (ASIA...), SecretAccessKey, and Token.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1552.005 - Unsecured Credentials: Cloud Instance Metadata API)',
        technicalCommands: [
          'HTTP SSRF Target: http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole',
          'Returned JSON Fields: AccessKeyId="ASIAIOSFODNN7EXAMPLE", SecretAccessKey, Token, Expiration',
        ],
        defenseMitigation:
          'Enforce IMDSv2 across all EC2 instances via aws ec2 modify-instance-metadata-options --http-tokens required --http-put-response-hop-limit 1.',
        logs: [
          {
            id: 'dfir-aws-imds-1',
            timestamp: '14:10:02.115',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'nginx',
            CommandLine: 'GET http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole',
            raw: 'nginx_proxy_log: client=198.51.100.55 request="GET /proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole HTTP/1.1" status=200 bytes=1420',
            parsedFields: {
              MetadataEndpoint: '169.254.169.254/latest/meta-data/iam/security-credentials/',
              IamRoleName: 'ProdAppInstanceRole',
              IssuedAccessKeyPrefix: 'ASIA... (Temporary STS Credential)',
              ImdsVersion: 'IMDSv1 (No X-aws-ec2-metadata-token header)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Off-Instance STS GetCallerIdentity Replay & GuardDuty OutsideAWS Detection (CloudTrail)',
        narration:
          'From their external workstation (198.51.100.55, aws-cli/2.15.0 Python/3.11 Linux), the attacker invokes sts:GetCallerIdentity and s3:ListBuckets using the stolen ASIA... EC2 role credentials. AWS CloudTrail logs userIdentity.principalId="<RoleId>:i-0a1b2c3d4e5f60001" alongside sourceIPAddress="198.51.100.55" (an external IP not belonging to the EC2 instance elastic IP), triggering Amazon GuardDuty finding UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Use Alternate Authentication Material: Application Access Token)',
        technicalCommands: [
          'CloudTrail Event: eventSource="sts.amazonaws.com" eventName="GetCallerIdentity"',
          'userIdentity.arn: "arn:aws:sts::123456789012:assumed-role/ProdAppInstanceRole/i-0a1b2c3d4e5f60001"',
          'sourceIPAddress: "198.51.100.55" (Mismatch against EC2 public IP) -> GuardDuty OutsideAWS Alert',
        ],
        defenseMitigation:
          'Attach an IAM VPC Endpoint / SourceIP condition policy (aws:SourceVpc or ec2:SourceInstanceARN) to EC2 instance profiles so stolen STS tokens cannot be used outside the VPC.',
        logs: [
          {
            id: 'dfir-aws-imds-2',
            timestamp: '14:10:08.450',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail sts:GetCallerIdentity from 198.51.100.55 using i-0a1b2c3d4e5f60001 role',
            raw: '{"eventVersion":"1.09","userIdentity":{"type":"AssumedRole","principalId":"AROA123456789:i-0a1b2c3d4e5f60001","arn":"arn:aws:sts::123456789012:assumed-role/ProdAppInstanceRole/i-0a1b2c3d4e5f60001","accessKeyId":"ASIAIOSFODNN7EXAMPLE"},"eventSource":"sts.amazonaws.com","eventName":"GetCallerIdentity","sourceIPAddress":"198.51.100.55","userAgent":"aws-cli/2.15.0 Python/3.11.6 Linux"}',
            parsedFields: {
              CloudTrailEvent: 'sts.amazonaws.com : GetCallerIdentity',
              PrincipalId: 'AROA123456789:i-0a1b2c3d4e5f60001',
              ExternalSourceIp: '198.51.100.55 (External ASN Mismatch)',
              GuardDutyFinding: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: S3 Data Event GetObject Burst & bytesTransferred Quantification in CloudTrail',
        narration:
          'The attacker enumerates and downloads sensitive objects from s3://corp-prod-customer-backups/. By querying AWS CloudTrail S3 Data Events (eventSource="s3.amazonaws.com", eventName="GetObject"), the DFIR team reconstructs every exact object key accessed and sums additionalEventData.bytesTransferredOut.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'CloudTrail S3 Data Event: eventSource="s3.amazonaws.com" eventName="GetObject"',
          'requestParameters.bucketName: "corp-prod-customer-backups" | requestParameters.key: "db-dump-2026-11.sql.gz"',
          'additionalEventData.bytesTransferredOut: 524288000',
        ],
        defenseMitigation:
          'Enable CloudTrail Data Events for S3 buckets holding sensitive data and immediately revoke active role sessions by attaching an inline AWSRevokeOlderSessions (DateLessThan aws:TokenIssueTime) policy.',
        logs: [
          {
            id: 'dfir-aws-imds-3',
            timestamp: '14:10:15.920',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail s3:GetObject corp-prod-customer-backups/db-dump-2026-11.sql.gz',
            raw: '{"eventSource":"s3.amazonaws.com","eventName":"GetObject","sourceIPAddress":"198.51.100.55","requestParameters":{"bucketName":"corp-prod-customer-backups","key":"db-dump-2026-11.sql.gz"},"additionalEventData":{"bytesTransferredOut":524288000}}',
            parsedFields: {
              CloudTrailEvent: 's3.amazonaws.com : GetObject (Data Event)',
              BucketName: 'corp-prod-customer-backups',
              ExfiltratedObjectKey: 'db-dump-2026-11.sql.gz',
              BytesTransferredOut: '524,288,000 bytes (500 MB)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda',
    title: 'AWS CIRT & CISA Cloud DFIR — AWS IAM PassRole + Lambda Privilege Escalation & StopLogging Tampering',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1098.001',
    description:
      'Grounded in AWS CIRT IAM Privilege Escalation Playbooks, Rhino Security Labs AWS IAM research, and CISA Cloud Security Technical Reference Architecture: an attacker with iam:PassRole and lambda:CreateFunction/InvokeFunction privileges passes an existing AdministratorExecutionRole to a new Lambda function that calls iam:AttachUserPolicy (AdministratorAccess) and attempts cloudtrail:StopLogging—all captured in immutable CloudTrail Management Events.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Dev IAM User', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AWS IAM & Lambda API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Lambda (AdminExecRole)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CloudTrail Management Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AttachUserPolicy (AdminAccess)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: IAM Privilege Escalation via iam:PassRole + lambda:CreateFunction20150331v2',
        narration:
          'A compromised developer IAM user (dev-ci-user) lacks direct iam:AttachUserPolicy rights but holds iam:PassRole and lambda:CreateFunction. The actor invokes CreateFunction20150331v2 passing role="arn:aws:iam::123456789012:role/AdminLambdaExecutionRole", embedding a handler that calls boto3.client("iam").attach_user_policy().',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1098.001 - Account Manipulation: IAM PassRole Escalation)',
        technicalCommands: [
          'CloudTrail Event: eventSource="lambda.amazonaws.com" eventName="CreateFunction20150331v2"',
          'userIdentity.userName: "dev-ci-user"',
          'requestParameters.role: "arn:aws:iam::123456789012:role/AdminLambdaExecutionRole"',
        ],
        defenseMitigation:
          'Restrict iam:PassRole with explicit Resource ARNs (never Resource: "*") and apply IAM Permissions Boundaries to all developer and CI/CD roles.',
        logs: [
          {
            id: 'dfir-aws-iam-1',
            timestamp: '18:05:10.112',
            source: 'Network',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail lambda:CreateFunction20150331v2 passing AdminLambdaExecutionRole',
            raw: '{"eventSource":"lambda.amazonaws.com","eventName":"CreateFunction20150331v2","userIdentity":{"type":"IAMUser","userName":"dev-ci-user"},"requestParameters":{"functionName":"metrics-sync-helper","role":"arn:aws:iam::123456789012:role/AdminLambdaExecutionRole","runtime":"python3.12"}}',
            parsedFields: {
              CloudTrailEvent: 'lambda.amazonaws.com : CreateFunction20150331v2',
              InitiatingUser: 'dev-ci-user',
              PassedPrivilegedRole: 'arn:aws:iam::123456789012:role/AdminLambdaExecutionRole',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Lambda Invocation & Shadow Admin Policy Attachment (iam:AttachUserPolicy)',
        narration:
          'When dev-ci-user invokes the function, the Lambda execution environment assumes AdminLambdaExecutionRole and calls iam:AttachUserPolicy to attach arn:aws:iam::aws:policy/AdministratorAccess directly to dev-ci-user.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1098.001 - AttachUserPolicy AdministratorAccess)',
        technicalCommands: [
          'CloudTrail Event: eventSource="iam.amazonaws.com" eventName="AttachUserPolicy"',
          'userIdentity.arn: "arn:aws:sts::123456789012:assumed-role/AdminLambdaExecutionRole/metrics-sync-helper"',
          'requestParameters: {"userName":"dev-ci-user","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}',
        ],
        defenseMitigation:
          'Alert immediately via Amazon EventBridge / SIEM on any iam:AttachUserPolicy, iam:PutUserPolicy, or iam:CreateAccessKey call originating from a Lambda function or non-Terraform role.',
        logs: [
          {
            id: 'dfir-aws-iam-2',
            timestamp: '18:05:14.308',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'CloudTrail iam:AttachUserPolicy AdministratorAccess to dev-ci-user',
            raw: '{"eventSource":"iam.amazonaws.com","eventName":"AttachUserPolicy","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::123456789012:assumed-role/AdminLambdaExecutionRole/metrics-sync-helper"},"requestParameters":{"userName":"dev-ci-user","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}}',
            parsedFields: {
              CloudTrailEvent: 'iam.amazonaws.com : AttachUserPolicy',
              ExecutingPrincipal: 'AssumedRole/AdminLambdaExecutionRole/metrics-sync-helper',
              ElevatedTargetUser: 'dev-ci-user',
              AttachedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: CloudTrail Anti-Forensics Attempt (cloudtrail:StopLogging / DeleteTrail) Blocked by SCP',
        narration:
          'Now holding AdministratorAccess, the actor calls cloudtrail:StopLogging on the organization trail to blind subsequent actions. AWS Organizations Service Control Policies (SCPs) deny the call with errorCode="AccessDenied" while CloudTrail records the StopLogging attempt for DFIR investigators.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.008 - Impair Defenses: Disable or Modify Cloud Logs)',
        technicalCommands: [
          'CloudTrail Event: eventSource="cloudtrail.amazonaws.com" eventName="StopLogging"',
          'errorCode: "AccessDenied" (Blocked by AWS Organizations SCP Deny cloudtrail:StopLogging)',
        ],
        defenseMitigation:
          'Configure an AWS Organizations Trail writing to a dedicated Log Archive account with S3 Object Lock and an SCP denying cloudtrail:StopLogging, DeleteTrail, and UpdateTrail.',
        logs: [
          {
            id: 'dfir-aws-iam-3',
            timestamp: '18:05:19.720',
            source: 'Network',
            severity: 'critical',
            EventCode: 403,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail cloudtrail:StopLogging attempt by dev-ci-user',
            raw: '{"eventSource":"cloudtrail.amazonaws.com","eventName":"StopLogging","userIdentity":{"type":"IAMUser","userName":"dev-ci-user"},"requestParameters":{"name":"arn:aws:cloudtrail:us-east-1:123456789012:trail/org-audit-trail"},"errorCode":"AccessDenied","errorMessage":"User is not authorized to perform: cloudtrail:StopLogging with an explicit deny in a service control policy"}',
            parsedFields: {
              CloudTrailEvent: 'cloudtrail.amazonaws.com : StopLogging',
              TargetedTrail: 'org-audit-trail',
              ErrorCode: 'AccessDenied (Blocked by Organization SCP)',
              MitreTechnique: 'T1562.008 (Disable Cloud Logs)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule',
    title: 'Microsoft IR & CISA AA23-320A DFIR — M365 Purview Unified Audit Log MailItemsAccessed & New-InboxRule Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1114.003',
    description:
      'Grounded in Microsoft Incident Response BEC/Cloud Playbooks, CISA Microsoft 365 Audit Logging Guidance, and MITRE ATT&CK T1114.003 / T1564.008: after hijacking an Exchange Online session, an attacker creates a stealthy Inbox Rule via OWA/PowerShell (Operation="New-InboxRule" or "Set-InboxRule" with MoveToFolder="RSS Feeds" and ForwardTo) and exfiltrates sensitive messages tracked via Microsoft Purview Unified Audit Log (UAL) MailItemsAccessed (InternetMessageId + FolderPathName + SessionId).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Hijacked OWA / Graph Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Exchange Online REST / EWS', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'New-InboxRule (RSS Feeds)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Purview Unified Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'MailItemsAccessed (Sync/Bind)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Stealthy Exchange Online Inbox Rule Creation (UAL Operation="New-InboxRule")',
        narration:
          'To hide incoming security alerts and wire-transfer replies from the mailbox owner while forwarding copies externally, the actor invokes New-InboxRule via OWA. The Microsoft Purview Unified Audit Log records Operation="New-InboxRule" with Parameters showing SubjectContainsWords="Invoice,Wire,MFA", MoveToFolder="RSS Subscriptions", MarkAsRead="True", and ForwardTo.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1564.008 - Hide Artifacts: Email Hiding Rules)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations New-InboxRule,Set-InboxRule,UpdateInboxRules',
          'UAL Parameters: Name=".”, SubjectContainsWords="Invoice;Wire;Security", MoveToFolder="RSS Subscriptions", MarkAsRead="True"',
        ],
        defenseMitigation:
          'Disable external auto-forwarding on Remote Domains in Exchange Online (AutoForwardEnabled $false) and alert on any New-InboxRule, Set-InboxRule, or EWS UpdateInboxRules event that moves messages to RSS Feeds, Deleted Items, or Junk Email.',
        logs: [
          {
            id: 'dfir-m365-1',
            timestamp: '10:15:04.220',
            source: 'Network',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'UAL New-InboxRule Mailbox=cfo@corp.com MoveToFolder="RSS Subscriptions" MarkAsRead=True',
            raw: '{"CreationTime":"2026-11-03T10:15:04Z","Operation":"New-InboxRule","Workload":"Exchange","UserId":"cfo@corp.com","ClientIP":"198.51.100.91:44120","Parameters":[{"Name":"Name","Value":"."},{"Name":"SubjectContainsWords","Value":"Invoice;Wire;MFA"},{"Name":"MoveToFolder","Value":"RSS Subscriptions"},{"Name":"MarkAsRead","Value":"True"}]}',
            parsedFields: {
              AuditWorkload: 'Microsoft Purview Unified Audit Log (Exchange)',
              Operation: 'New-InboxRule',
              ClientIpAddress: '198.51.100.91',
              RuleParameters: 'SubjectContainsWords="Invoice;Wire;MFA" -> MoveToFolder="RSS Subscriptions"',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Mailbox Search & Item Access Attribution via MailItemsAccessed (Bind vs Sync)',
        narration:
          'Next, the actor searches the mailbox for "password", "contract", and "routing number" and opens matching messages. Exchange Online Advanced Auditing records Operation="MailItemsAccessed" containing OperationProperties (MailAccessType="Bind" for individual item reads or "Sync" for bulk folder synchronization), Folders.FolderItems.InternetMessageId, and Folders.Path ("/Sent Items").',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Collection (T1114.002 - Email Collection: Remote Email Collection)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText "198.51.100.91"',
          'UAL Field: OperationProperties.MailAccessType = "Bind" | IsThrottled = "False"',
          'UAL Field: Folders[].Path = "/Sent Items" | FolderItems[].InternetMessageId = "<91a8b2@corp.com>"',
        ],
        defenseMitigation:
          'Verify that MailItemsAccessed auditing is enabled on all Exchange Online mailboxes and monitor IsThrottled="True" (if a mailbox exceeds >2,500 binds in 24 hours, assume the entire mailbox was accessed).',
        logs: [
          {
            id: 'dfir-m365-2',
            timestamp: '10:16:12.804',
            source: 'Network',
            severity: 'critical',
            EventCode: 2,
            ProcessName: 'w3wp.exe',
            CommandLine: 'UAL MailItemsAccessed (MailAccessType=Bind) on cfo@corp.com /Sent Items',
            raw: '{"CreationTime":"2026-11-03T10:16:12Z","Operation":"MailItemsAccessed","Workload":"Exchange","MailboxOwnerUPN":"cfo@corp.com","ClientIPAddress":"198.51.100.91","ClientInfoString":"Client=OWA;Action=ViaProxy","OperationProperties":[{"Name":"MailAccessType","Value":"Bind"},{"Name":"IsThrottled","Value":"False"}],"Folders":[{"Path":"/Sent Items","FolderItems":[{"InternetMessageId":"<91a8b204@corp.com>","SizeInBytes":482910}]}]}',
            parsedFields: {
              Operation: 'MailItemsAccessed',
              MailAccessType: 'Bind (Direct Message Read)',
              FolderPath: '/Sent Items',
              InternetMessageId: '<91a8b204@corp.com> (482,910 bytes)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: OAuth App Consent Persistence (Operation="Consent to application") & Session Revocation',
        narration:
          'To retain persistent API access to the mailbox even after the user resets their password, the actor grants OAuth Mail.ReadWrite consent to a rogue multi-tenant application, logged in the Unified Audit Log under Workload="AzureActiveDirectory" Operation="Consent to application".',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.003 - Account Manipulation: OAuth Application Consent)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "Consent to application","Add OAuth2PermissionGrant"',
          'ModifiedProperties: ConsentAction.Permissions="Scope: Mail.ReadWrite, offline_access"',
          'Remediation: Revoke-MgUserSignInSession -UserId cfo@corp.com; Remove-InboxRule',
        ],
        defenseMitigation:
          'Restrict user consent to verified publishers in Microsoft Entra ID (Admin Consent Workflow) and audit all OAuth2PermissionGrant entries granting Mail.Read or Mail.ReadWrite.',
        logs: [
          {
            id: 'dfir-m365-3',
            timestamp: '10:18:01.110',
            source: 'Network',
            severity: 'critical',
            EventCode: 3,
            ProcessName: 'w3wp.exe',
            CommandLine: 'UAL Consent to application (Scope: Mail.ReadWrite, offline_access)',
            raw: '{"CreationTime":"2026-11-03T10:18:01Z","Operation":"Consent to application","Workload":"AzureActiveDirectory","UserId":"cfo@corp.com","ClientIP":"198.51.100.91","Target":[{"ID":"AppId_7f91a02b"}],"ModifiedProperties":[{"Name":"ConsentAction.Permissions","NewValue":"PrincipalId: cfo@corp.com, ResourceId: Exchange, Scope: Mail.ReadWrite offline_access"}]}',
            parsedFields: {
              AuditWorkload: 'AzureActiveDirectory (Entra ID)',
              Operation: 'Consent to application',
              GrantedScopes: 'Mail.ReadWrite, offline_access',
              ClientIp: '198.51.100.91',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-entra-id-prt-roadtools-device-registration-forensics',
    title: 'Microsoft MSRC & Dirk-jan Mollema DFIR — Entra ID Primary Refresh Token (PRT) & Rogue Device Registration Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1528',
    description:
      'Grounded in Microsoft Entra ID Primary Refresh Token (PRT) architecture documentation, Dirk-jan Mollema (ROADtools) research, and CISA Cloud Identity guidance: an attacker uses a stolen session or PRT cookie (x-ms-RefreshTokenCredential) to register a rogue Entra ID Joined device via the Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net), minting a hardware-less Primary Refresh Token with an embedded MFA claim (AuthenticationRequirement="multiFactorAuthentication", IncomingTokenType="primaryRefreshToken").',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rogue Device (roadtx)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Entra ID DRS Service', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Registered Device Object', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Entra Audit & Sign-In Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PRT Sign-In (IncomingToken PRT)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Token Acquisition for Device Registration Service (Resource=urn:ms-drs:enterpriseregistration.windows.net)',
        narration:
          'Using a captured refresh token or browser session, the actor requests an access token for resource urn:ms-drs:enterpriseregistration.windows.net (AppId 01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9) using the Microsoft Authentication Broker client ID (29d9ed98-a469-4536-ade2-f981bc1d605e). Entra ID Non-Interactive Sign-In Logs record this token exchange.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token: Entra DRS Token)',
        technicalCommands: [
          'Entra Sign-In Log: AppDisplayName="Microsoft Authentication Broker" (29d9ed98-a469-4536-ade2-f981bc1d605e)',
          'ResourceDisplayName: "Device Registration Service" (01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9)',
        ],
        defenseMitigation:
          'Enforce Conditional Access policies requiring compliant or Hybrid Azure AD Joined devices before allowing access to the Device Registration Service resource.',
        logs: [
          {
            id: 'dfir-entra-1',
            timestamp: '16:12:04.115',
            source: 'Network',
            severity: 'high',
            EventCode: 100,
            ProcessName: 'python3',
            CommandLine: 'Entra SignInLogs: Token issued for Device Registration Service (01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9)',
            raw: '{"category":"NonInteractiveUserSignInLogs","userPrincipalName":"admin_cloud@corp.com","appDisplayName":"Microsoft Authentication Broker","appId":"29d9ed98-a469-4536-ade2-f981bc1d605e","resourceDisplayName":"Device Registration Service","resourceId":"01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9","ipAddress":"198.51.100.62"}',
            parsedFields: {
              LogCategory: 'Entra ID NonInteractiveUserSignInLogs',
              AppDisplayName: 'Microsoft Authentication Broker',
              ResourceDisplayName: 'Device Registration Service (DRS)',
              SourceIp: '198.51.100.62',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Rogue Device Registration in Entra ID Directory Audit Logs (Operation="Register device")',
        narration:
          'The actor submits a locally generated RSA transport key and device certificate CSR to the DRS endpoint. Entra ID Audit Logs record Category="Device", ActivityDisplayName="Register device" (and "Add registered users to device" / "Add registered owner to device"), creating a persistent DeviceId in the tenant.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.005 - Account Manipulation: Device Registration)',
        technicalCommands: [
          'Entra Audit Log: OperationName="Register device" Category="Device" LoggedByService="Device Registration Service"',
          'AdditionalDetails: DeviceId="d4819c02-...", DeviceOSType="Windows", TrustType="Workplace / AzureAd"',
        ],
        defenseMitigation:
          'Monitor Entra ID Audit Logs for "Register device" events originating from anomalous countries, VPN ASNs, or Linux/Python User-Agents, and limit the maximum number of devices per user.',
        logs: [
          {
            id: 'dfir-entra-2',
            timestamp: '16:12:08.540',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'Entra AuditLogs: Register device WIN-DESKTOP-991A for admin_cloud@corp.com',
            raw: '{"category":"AuditLogs","operationName":"Register device","result":"success","initiatedBy":{"user":{"userPrincipalName":"admin_cloud@corp.com","ipAddress":"198.51.100.62"}},"targetResources":[{"displayName":"WIN-DESKTOP-991A","type":"Device","id":"d4819c02-5511-4a90-8111-223344556677"}]}',
            parsedFields: {
              LogCategory: 'Entra ID AuditLogs (Device Registration Service)',
              OperationName: 'Register device',
              RegisteredDeviceName: 'WIN-DESKTOP-991A (DeviceId d4819c02-...)',
              InitiatingUser: 'admin_cloud@corp.com',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Primary Refresh Token (PRT) Sign-In & Persistent Session Key Forensics (IncomingTokenType=primaryRefreshToken)',
        narration:
          'Using the registered device certificate and software session key, the actor requests a Primary Refresh Token (PRT) valid for 14 days (renewable for 90 days) that persists across user password changes until the device object itself is disabled or deleted in Entra ID. Subsequent sign-ins show IncomingTokenType="primaryRefreshToken" and DeviceDetail.deviceId="d4819c02-...".',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Primary Refresh Token Persistence Across Password Reset)',
        technicalCommands: [
          'Entra SignInLogs: incomingTokenType="primaryRefreshToken" deviceDetail.deviceId="d4819c02-5511-4a90-8111-223344556677"',
          'Remediation: Set-MgDevice -DeviceId d4819c02-... -AccountEnabled:$false; Revoke-MgUserSignInSession',
        ],
        defenseMitigation:
          'During Entra ID incident response, always audit all devices registered to the compromised user; resetting a user password without disabling rogue registered devices allows a stolen PRT + device key to mint new tokens.',
        logs: [
          {
            id: 'dfir-entra-3',
            timestamp: '16:12:15.902',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'Entra SignInLogs: IncomingTokenType=primaryRefreshToken from DeviceId d4819c02-...',
            raw: '{"category":"SignInLogs","userPrincipalName":"admin_cloud@corp.com","resourceDisplayName":"Microsoft Graph","incomingTokenType":"primaryRefreshToken","authenticationRequirement":"multiFactorAuthentication","deviceDetail":{"deviceId":"d4819c02-5511-4a90-8111-223344556677","displayName":"WIN-DESKTOP-991A"},"ipAddress":"198.51.100.62"}',
            parsedFields: {
              LogCategory: 'Entra ID SignInLogs',
              IncomingTokenType: 'primaryRefreshToken (PRT)',
              DeviceId: 'd4819c02-5511-4a90-8111-223344556677',
              IrRemediation: 'Disable/delete rogue DeviceId + Revoke-MgUserSignInSession',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-gcp-cloud-audit-service-account-key-impersonation',
    title: 'Google Cloud Mandiant IR & MITRE DFIR — GCP Cloud Audit ServiceAccountKey Creation & Impersonation Chain Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1098.001',
    description:
      'Grounded in Google Cloud Mandiant Incident Response guides, GCP Cloud Audit Logs documentation, and MITRE ATT&CK T1098.001 / T1530: an attacker compromises a workload identity, invokes iam.serviceAccounts.getAccessToken (producing a serviceAccountDelegationInfo impersonation chain in Admin Activity / Data Access logs), creates an exported JSON private key via google.iam.admin.v1.CreateServiceAccountKey, and runs a BigQuery export job (JobInserted).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised GCP Workload', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IAM Credentials API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Privileged Service Account', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'GCP Cloud Audit Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'BigQuery JobInserted Exfil', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Service Account Impersonation via iamcredentials.googleapis.com GenerateAccessToken',
        narration:
          'Starting from a compromised Compute Engine default service account, the actor calls iamcredentials.googleapis.com method GenerateAccessToken to impersonate prod-data-admin@corp-prod.iam.gserviceaccount.com. GCP Data Access Audit Logs record the caller in authenticationInfo.serviceAccountDelegationInfo.firstPartyPrincipal.principalEmail.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1078.004 - Valid Accounts: Cloud Service Account Impersonation)',
        technicalCommands: [
          'GCP Audit Log: logName="projects/corp-prod/logs/cloudaudit.googleapis.com%2Fdata_access"',
          'protoPayload.serviceName: "iamcredentials.googleapis.com" | methodName: "GenerateAccessToken"',
          'authenticationInfo.serviceAccountDelegationInfo[0].firstPartyPrincipal.principalEmail',
        ],
        defenseMitigation:
          'Enable Data Access audit logs for iam.googleapis.com and iamcredentials.googleapis.com and restrict roles/iam.serviceAccountTokenCreator.',
        logs: [
          {
            id: 'dfir-gcp-1',
            timestamp: '07:22:10.104',
            source: 'Network',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'gcloud',
            CommandLine: 'GCP Audit: iamcredentials.googleapis.com GenerateAccessToken for prod-data-admin',
            raw: '{"protoPayload":{"@type":"type.googleapis.com/google.cloud.audit.AuditLog","serviceName":"iamcredentials.googleapis.com","methodName":"GenerateAccessToken","resourceName":"projects/-/serviceAccounts/prod-data-admin@corp-prod.iam.gserviceaccount.com","authenticationInfo":{"principalEmail":"prod-data-admin@corp-prod.iam.gserviceaccount.com","serviceAccountDelegationInfo":[{"firstPartyPrincipal":{"principalEmail":"ci-runner@corp-prod.iam.gserviceaccount.com"}}]}}}',
            parsedFields: {
              ServiceName: 'iamcredentials.googleapis.com',
              MethodName: 'GenerateAccessToken',
              ImpersonatedAccount: 'prod-data-admin@corp-prod.iam.gserviceaccount.com',
              DelegatingCaller: 'ci-runner@corp-prod.iam.gserviceaccount.com',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Persistent User-Managed JSON Key Creation (google.iam.admin.v1.CreateServiceAccountKey)',
        narration:
          'To maintain long-lived external access, the actor invokes google.iam.admin.v1.CreateServiceAccountKey, which is always logged in GCP Admin Activity Audit Logs (cloudaudit.googleapis.com%2Factivity) along with the newly minted key ID (response.name) and keyAlgorithm (KEY_ALG_RSA_2048).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.001 - Additional Cloud Credentials: CreateServiceAccountKey)',
        technicalCommands: [
          'GCP Admin Activity Log: serviceName="iam.googleapis.com" methodName="google.iam.admin.v1.CreateServiceAccountKey"',
          'response.name: "projects/corp-prod/serviceAccounts/prod-data-admin@.../keys/9f81a20b3c4d..."',
        ],
        defenseMitigation:
          'Enforce the GCP Organization Policy constraint constraints/iam.disableServiceAccountKeyCreation across all production folders and projects.',
        logs: [
          {
            id: 'dfir-gcp-2',
            timestamp: '07:22:14.612',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'gcloud',
            CommandLine: 'GCP Admin Activity: google.iam.admin.v1.CreateServiceAccountKey',
            raw: '{"protoPayload":{"serviceName":"iam.googleapis.com","methodName":"google.iam.admin.v1.CreateServiceAccountKey","authenticationInfo":{"principalEmail":"prod-data-admin@corp-prod.iam.gserviceaccount.com"},"requestMetadata":{"callerIp":"198.51.100.84"},"response":{"name":"projects/corp-prod/serviceAccounts/prod-data-admin@corp-prod.iam.gserviceaccount.com/keys/9f81a20b3c4d"}}}',
            parsedFields: {
              AuditLogStream: 'cloudaudit.googleapis.com/activity (Admin Activity)',
              MethodName: 'google.iam.admin.v1.CreateServiceAccountKey',
              CreatedKeyResource: 'keys/9f81a20b3c4d',
              CallerIp: '198.51.100.84',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: BigQuery Table Export & Query Exfiltration Attribution (JobInserted & totalBilledBytes)',
        narration:
          'Using the exported JSON key from 198.51.100.84, the actor queries BigQuery dataset corp_prod.customer_records. GCP BigQuery Audit Logs (bigquery.googleapis.com, methodName="jobservice.insert" / BigQueryAuditMetadata.JobInsertion) record the exact SQL query text, referencedTables, outputRowCount, and totalBilledBytes.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1530 - Data from Cloud Storage: BigQuery JobInserted)',
        technicalCommands: [
          'GCP BigQuery Audit: serviceName="bigquery.googleapis.com" methodName="google.cloud.bigquery.v2.JobService.InsertJob"',
          'metadata.jobChange.job.jobStats.queryStats.totalBilledBytes: "2147483648"',
          'metadata.jobChange.job.jobStats.queryStats.referencedTables: ["projects/corp-prod/datasets/finance/tables/ledger"]',
        ],
        defenseMitigation:
          'Place sensitive BigQuery datasets and Cloud Storage buckets inside a Google Cloud VPC Service Controls (VPC-SC) perimeter to block data access from external IPs even with a valid ServiceAccountKey.',
        logs: [
          {
            id: 'dfir-gcp-3',
            timestamp: '07:23:01.400',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'bq',
            CommandLine: 'GCP BigQuery InsertJob SELECT * FROM corp-prod.finance.ledger from 198.51.100.84',
            raw: '{"protoPayload":{"serviceName":"bigquery.googleapis.com","methodName":"google.cloud.bigquery.v2.JobService.InsertJob","authenticationInfo":{"principalEmail":"prod-data-admin@corp-prod.iam.gserviceaccount.com","serviceAccountKeyName":"//iam.googleapis.com/projects/corp-prod/serviceAccounts/prod-data-admin@corp-prod.iam.gserviceaccount.com/keys/9f81a20b3c4d"},"requestMetadata":{"callerIp":"198.51.100.84"},"metadata":{"jobChange":{"job":{"jobConfig":{"queryConfig":{"query":"SELECT * FROM `corp-prod.finance.ledger`"}},"jobStats":{"queryStats":{"totalBilledBytes":"2147483648"}}}}}}}',
            parsedFields: {
              ServiceName: 'bigquery.googleapis.com',
              AuthenticatedViaKey: 'keys/9f81a20b3c4d (User-Managed Key)',
              ReferencedTable: 'projects/corp-prod/datasets/finance/tables/ledger',
              TotalBilledBytes: '2,147,483,648 bytes (2.0 GB)',
            },
          },
        ],
      },
    ],
  },
];
