import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
          'Capture network traffic from an out-of-band switch SPAN port or hardware network tap (which observes raw wire frames outside the compromised OS so host userland hooks cannot scrub them) and compare ss output against raw kernel socket tables via eBPF.',
      },
    },
  };
