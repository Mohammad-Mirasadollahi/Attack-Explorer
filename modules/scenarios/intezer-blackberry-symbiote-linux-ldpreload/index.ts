import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'intezer-blackberry-symbiote-linux-ldpreload',
    briefing: {
      headline:
        'Symbiote is a parasitic Linux shared-object (.so) rootkit loaded via /etc/ld.so.preload into every running process, hooking libc and PAM to steal SSH credentials and hooking libpcap (pcap_compile) to inject BPF bytecode that hides its network traffic from tcpdump.',
      storyAnalogy:
        'Imagine a parasite that doesn’t walk around the building on its own legs (so no guard ever sees an intruder on the hallway cameras). Instead, it slips a pair of augmented-reality glasses (/etc/ld.so.preload) onto every single employee in the building the moment they wake up. When an administrator looks at the room directory (ls) or the network monitor (tcpdump), the glasses digitally erase the parasite and its network wires from the administrator’s field of view.',
      plainSummary:
        'In this scenario (T1574.006, Symbiote Parasitic Linux LD_PRELOAD Rootkit & libpcap eBPF Bytecode Hooking), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: global Dynamic Linker Injection (e.g., /usr/lib/liblinux.so), then pAM Backdoor Authentication (so the next stage can build on pam backdoor authentication), then libpcap Function Hooking (..., SO_ATTACH_FILTER). Steps #1–#3 walk that chain end-to-end by covering Global Dynamic Linker Injection (e.g., /usr/lib/liblinux.so), then PAM Backdoor Authentication (so the next stage can build on pam backdoor authentication), then libpcap Function Hooking (..., SO_ATTACH_FILTER). Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Symbiote DNS / HTTPS C2 Operator -> /etc/ld.so.preload (liblinux.so) -> Hooked sshd / PAM Credential Harvester -> Hooked tcpdump / libpcap BPF Scrubber -> BlackBerry / Intezer Static ELF Scanner.',
      documentedAdvisory:
        'BlackBerry & Intezer Joint Technical Report on Symbiote Linux Malware / MITRE ATT&CK T1574.006 (Dynamic Linker Hijacking)',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.006',
        plainTitle: 'Global Dynamic Linker Injection via /etc/ld.so.preload',
        storyAnalogy:
          'By adding its name to the master startup list of the Linux library loader, the malicious shared library forces every program on the server to load it first before doing anything else.',
        simpleExplanation:
          'Rather than running as a separate process, Symbiote was deployed as a shared library (e.g., /usr/lib/liblinux.so) and added to /etc/ld.so.preload (a system-wide configuration file read by the GNU dynamic linker /lib64/ld-linux-x86-64.so.2 that forces the specified .so library to be mapped into the address space of every dynamically linked process before libc.so.6), allowing Symbiote to override standard library functions (fopen, readdir, getdents64, execve) via symbol interposition.',
        howItWorksInPractice:
          'If an administrator runs cat /etc/ld.so.preload, ls /usr/lib, or ldd /bin/ls using standard dynamically linked system binaries, Symbiote’s hooked fopen and getdents64 functions filter out its own filenames and return empty/clean results. In the documented EDR exchange from Symbiote DNS / HTTPS C2 Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ALERT T1574.006 (confirming that the Stage 1: Global Dynamic Linker Injection via /etc/ld.so.preload request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Symbiote C2 Operator to /etc/ld.so.preload (liblinux.so) as the shared library infects all dynamic processes.',
        detectionAndEvidence:
          'Inspecting /etc/ld.so.preload and /proc/1/maps using a statically compiled binary (which does not use ld-linux.so and is immune to LD_PRELOAD userland hooks) or kernel-level eBPF sensors. Correlate Sysmon or Windows Security Event telemetry for T1574.006 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1556.003',
        plainTitle: 'PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting',
        storyAnalogy:
          'Because the parasite is already inside the SSH server and client programs, it listens as administrators type passwords to other servers and unlocks the front door whenever its own secret password is used.',
        simpleExplanation:
          'When loaded inside ssh or scp client processes, Symbiote hooked libc’s read() function to capture administrator passwords and keystrokes into an RC4-encrypted stash file (/var/tmp/.certs). When loaded inside the sshd daemon, it hooked pam_authenticate() and pam_acct_mgmt() (granting instant root SSH login whenever the attacker authenticated with a hardcoded master password, while scrubbing /var/log/auth.log and utmp/wtmp).',
        howItWorksInPractice:
          'Harvesting outbound ssh and scp credentials from compromised jump boxes allowed the attackers to pivot laterally across segmented banking infrastructure. In the documented Auth exchange from Perimeter Firewall & NDR Tap to /etc/ld.so.preload (liblinux.so), /etc/ld.so.preload (liblinux.so) responds with ACK T1556.003 (confirming that the Stage 2: PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting request succeeded on /etc/ld.so.preload (liblinux.so) and establishing the runtime state required for Step #3 Stage 3: libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects /etc/ld.so.preload (liblinux.so) to the Hooked sshd / PAM Credential Harvester and triggers the BlackBerry / Intezer Static ELF Scanner.',
        detectionAndEvidence:
          'Kernel-level eBPF / auditd monitoring of /proc/[pid]/maps on sshd for unexpected shared objects outside /lib/security/ and /usr/lib/x86_64-linux-gnu/.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1014',
        plainTitle: 'libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump',
        storyAnalogy:
          'When a forensic investigator plugs in a stethoscope (tcpdump) to listen to network traffic on the server, the parasite secretly rewrites the stethoscope’s filter so it goes deaf whenever the parasite speaks.',
        simpleExplanation:
          'To defeat live network forensics on the infected host, Symbiote hooked pcap_compile() in libpcap and setsockopt(..., SO_ATTACH_FILTER...) in libc. Whenever an analyst ran tcpdump or tshark, Symbiote intercepted the compiled Berkeley Packet Filter (BPF) bytecode array before it was handed to the kernel and prepended its own BPF instructions (which instructed the Linux kernel to silently drop any packet matching Symbiote’s C2 ports or DNS tunneling domain before copying packets to tcpdump).',
        howItWorksInPractice:
          'Symbiote also hooked fopen("/proc/net/tcp") and removed lines matching its active connections so netstat and ss could not see its sockets either. In the documented EDR exchange from /etc/ld.so.preload (liblinux.so) to Hooked sshd / PAM Credential Harvester, Hooked sshd / PAM Credential Harvester responds with ALERT T1014 (confirming that the Stage 3: libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump request succeeded on Hooked sshd / PAM Credential Harvester and completing the final execution objective of Symbiote Parasitic Linux LD_PRELOAD Rootkit & libpcap eBPF Bytecode Hooking).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces /etc/ld.so.preload hooking the tcpdump / libpcap BPF Scrubber while exfiltrating data to the Symbiote DNS / HTTPS C2 Operator.',
        detectionAndEvidence:
          'Capture network traffic from an out-of-band switch SPAN port or hardware network tap (which observes raw wire frames outside the compromised OS so host userland hooks cannot scrub them) and compare ss output against raw kernel socket tables via eBPF. Correlate Sysmon or Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a parasitic mist that refuses to walk down a bank hallway as a visible stranger and instead weaves itself into the master uniform coatroom. Every clerk, courier, and auditor who puts on an official jacket automatically wears the parasite too: inside couriers it silently copies every vault passphrase spoken at the counter, and inside safety auditors it clouds their magnifying lenses so the spy own hidden tunnels vanish from every inspection log.',
      storyMappings: [
        {
          storyTerm: 'Master uniform coatroom',
          technicalTerm: 'Global dynamic linker preload file /etc/ld.so.preload',
          tone: 'amber',
        },
        {
          storyTerm: 'Parasitic mist woven into every official jacket',
          technicalTerm: 'Shared object library (/usr/lib/liblinux.so) injected into every running process',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying vault passphrases whispered by couriers',
          technicalTerm: 'PAM backdoor and libc read() hooking inside ssh and scp harvesting keystrokes',
          tone: 'rose',
        },
        {
          storyTerm: 'Clouding safety auditor magnifying lenses',
          technicalTerm: 'Hooking pcap_compile() and setsockopt(SO_ATTACH_FILTER) to blind tcpdump',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Rather than hiring a separate intruder who would show up on the employee attendance sheet, the spy hangs a rigged lining inside the building universal uniform rack. From that second forward, every single worker who clocks in slips the hidden parasite onto their own sleeves automatically.',
        storyMappings: [
          {
            storyTerm: 'Universal uniform rack',
            technicalTerm: 'System-wide /etc/ld.so.preload dynamic linker configuration',
            tone: 'amber',
          },
          {
            storyTerm: 'Rigged lining hung on the rack',
            technicalTerm: 'Malicious ELF shared library (/usr/lib/liblinux.so)',
            tone: 'sky',
          },
          {
            storyTerm: 'No separate name on the attendance sheet',
            technicalTerm: 'No standalone malware process visible in ps or top listings',
            tone: 'rose',
          },
          {
            storyTerm: 'Every worker clocking in automatically wearing it',
            technicalTerm: 'Dynamic linker mapping Symbiote first into every newly launched Linux binary',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Riding inside the sleeves of every courier and gate clerk, the parasite silently transcribes every vault combination typed at the dispatch desk into a locked notebook, while secretly installing a master override phrase that lets the spy walk through the front gate under any clerk name.',
        storyMappings: [
          {
            storyTerm: 'Couriers typing vault combinations',
            technicalTerm: 'Administrator ssh and scp client sessions with hooked libc read()',
            tone: 'amber',
          },
          {
            storyTerm: 'Locked notebook storing copied combinations',
            technicalTerm: 'RC4-encrypted credential stash file hidden on disk (/var/tmp/...)',
            tone: 'sky',
          },
          {
            storyTerm: 'Master override phrase at the front gate',
            technicalTerm: 'PAM authentication backdoor permitting root login with a hardcoded password',
            tone: 'rose',
          },
          {
            storyTerm: 'Riding inside clerk sleeves',
            technicalTerm: 'In-process userland symbol interposition inside sshd and ssh clients',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Use kernel-level eBPF or auditd telemetry to inspect /proc/[pid]/maps on sshd (listing every shared library mapped into the SSH daemon straight from kernel memory) and alert on unexpected shared objects loaded outside /lib/security/ and /usr/lib/x86_64-linux-gnu/.',
      },
      3: {
        storyAnalogy:
          'Whenever building inspectors raise a magnifying glass to watch outgoing mail trucks for smuggling, the parasite riding inside the inspector own glasses silently swaps in tinted lenses that blot out the spy truck license plates before the report even reaches the page.',
        storyMappings: [
          {
            storyTerm: 'Inspectors watching outgoing mail trucks',
            technicalTerm: 'DFIR analysts running tcpdump or packet sniffers directly on the infected host',
            tone: 'amber',
          },
          {
            storyTerm: 'Swapping in tinted lenses inside the inspector glasses',
            technicalTerm: 'Hooking libpcap pcap_compile() and libc setsockopt(SO_ATTACH_FILTER)',
            tone: 'sky',
          },
          {
            storyTerm: 'Blotting out the spy truck license plates',
            technicalTerm: 'Injecting BPF bytecode exclusions that scrub C2 IP addresses and ports from captures',
            tone: 'rose',
          },
          {
            storyTerm: 'Off-site rooftop camera catching the truth',
            technicalTerm: 'Out-of-band switch SPAN port or hardware network tap immune to host hooks',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Capture network traffic from an out-of-band switch SPAN port or hardware network tap (which observes raw wire frames outside the compromised OS so host userland hooks cannot scrub them) and compare ss output against raw kernel socket tables via eBPF. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
