import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
