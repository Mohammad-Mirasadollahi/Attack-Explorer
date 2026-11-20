import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'intezer-blackberry-symbiote-linux-ldpreload',
    title: 'Symbiote Parasitic Linux LD_PRELOAD Rootkit & libpcap eBPF Bytecode Hooking',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1574.006',
    description:
      'Symbiote is a parasitic Linux shared-object (.so) rootkit targeting financial institutions. Loaded globally via /etc/ld.so.preload into every dynamic process, it hooks libc (read, fopen, getdents) to harvest SSH/PAM credentials and hide its files, and hooks libpcap (pcap_compile) to prepend custom BPF instructions that scrub its C2 traffic from tcpdump.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Symbiote DNS / HTTPS C2 Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: '/etc/ld.so.preload (liblinux.so)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Hooked sshd / PAM Credential Harvester', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'BlackBerry / Intezer Static ELF Scanner', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Hooked tcpdump / libpcap BPF Scrubber', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Global Dynamic Linker Injection via /etc/ld.so.preload',
        narration:
          'Rather than running as a standalone executable process, Symbiote is compiled as a position-independent ELF shared library (/usr/lib/liblinux.so) and registered inside /etc/ld.so.preload, forcing the GNU dynamic linker (ld-linux.so) to map Symbiote into every dynamically linked process ahead of glibc.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Persistence & Privilege Escalation (T1574.006 - Dynamic Linker Hijacking)',
        technicalCommands: [
          'echo "/usr/lib/liblinux.so" > /etc/ld.so.preload',
          'Hook glibc: fopen, fopen64, readdir, getdents64, execve (Hides /etc/ld.so.preload and liblinux.so from ls/find/ldd)',
        ],
        defenseMitigation:
          'Inspect `/etc/ld.so.preload` and `/proc/1/maps` using a **statically linked** binary (such as `busybox` or a static Go security agent) that does not invoke `ld-linux.so` and therefore cannot be hooked by `LD_PRELOAD`.',
        logs: [
          {
            id: 'sym-1',
            timestamp: '12:09:33.112',
            source: 'EDR',
            severity: 'critical',
            raw: 'Static ELF Integrity Alert (Intezer / BlackBerry) | File: /etc/ld.so.preload | LoadedSharedObject: /usr/lib/liblinux.so (Symbiote) | HookedSymbols: fopen, getdents64, pam_authenticate, pcap_compile | Note: Hidden from dynamically linked ls/ldd',
            parsedFields: {
              PreloadConfig: '/etc/ld.so.preload',
              ParasiticLibrary: '/usr/lib/liblinux.so (Symbiote)',
              HookedLibcCalls: 'fopen, fopen64, readdir, getdents64, execve',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting',
        narration:
          'Inside ssh and scp client processes, Symbiote hooks libc read() to capture administrator passwords and SSH keys to an RC4-encrypted file; inside sshd, it hooks pam_authenticate() to grant immediate root SSH access whenever a hidden master password is supplied.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Credential Access & Persistence (T1556.003 - Pluggable Authentication Modules)',
        technicalCommands: [
          'Hook ssh/scp read() -> Captures keystrokes and encrypts with RC4 into /var/tmp/.certs',
          'Hook sshd pam_authenticate() -> If password == <hardcoded_symbiote_hash>, return PAM_SUCCESS',
        ],
        defenseMitigation:
          'Monitor `/proc/[pid]/maps` across `sshd` processes from kernel space (eBPF) for unexpected `.so` libraries loaded outside standard PAM and system library paths.',
        logs: [
          {
            id: 'sym-2',
            timestamp: '12:14:05.804',
            source: 'Auth',
            severity: 'critical',
            raw: 'PAM Memory Hook Alert | Process: /usr/sbin/sshd | HookedFunction: pam_authenticate (Redirected to /usr/lib/liblinux.so) | CredentialStash: /var/tmp/.certs (RC4 Encrypted)',
            parsedFields: {
              HookedDaemon: '/usr/sbin/sshd',
              HijackedFunction: 'pam_authenticate() & libc read()',
              StolenCredentialsFile: '/var/tmp/.certs',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump',
        narration:
          'When an incident responder runs tcpdump or Wireshark on the infected host, Symbiote hooks pcap_compile() and setsockopt(SO_ATTACH_FILTER), prepending its own classic BPF instructions to the analyst’s capture filter so the Linux kernel silently drops any packet matching Symbiote’s C2 ports or domains.',
        activeNodes: ['firewall', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit / Network Capture Blindfolding)',
        technicalCommands: [
          'Hook libpcap!pcap_compile & setsockopt(SO_ATTACH_FILTER)',
          'Prepend BPF bytecode instructions: Drop packets matching Symbiote C2 IP/Port before handing buffer to tcpdump',
        ],
        defenseMitigation:
          'Perform packet capture on an external network tap or mirror port (SPAN) rather than running `tcpdump` directly on a potentially compromised Linux host.',
        logs: [
          {
            id: 'sym-3',
            timestamp: '12:19:44.019',
            source: 'EDR',
            severity: 'critical',
            raw: 'Network Forensics Evasion Alert | Process: /usr/sbin/tcpdump | HookedLibrary: libpcap.so (via /usr/lib/liblinux.so) | Action: Modified SO_ATTACH_FILTER BPF bytecode to exclude Symbiote C2 ports from packet capture',
            parsedFields: {
              TargetedTool: 'tcpdump / libpcap',
              EvasionMechanism: 'BPF Bytecode Prepending in setsockopt(SO_ATTACH_FILTER)',
              ForensicImpact: 'Local packet captures completely blind to Symbiote C2 traffic',
            },
          },
        ],
        packets: [],
      },
    ],
  };
