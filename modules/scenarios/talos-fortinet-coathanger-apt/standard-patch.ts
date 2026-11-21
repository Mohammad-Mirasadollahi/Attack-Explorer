import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a fortified perimeter watchtower whose public entrance gate suffers a structural overflow crack that lets a covert agent climb inside undetected. Once inside the watchtower, the agent weaves an invisible cloak over the tower\'s own inspection tools so guards see nothing out of place, and even welds a secret spring onto the tower\'s master reboot engine so that wiping and upgrading the watchtower roof simply re-plants the spy automatically every single time.',
      storyMappings: [
        {
          storyTerm: 'Structural overflow crack at the watchtower public gate',
          technicalTerm: 'Heap buffer overflow in FortiOS sslvpnd (CVE-2022-42475 / CVE-2023-27997)',
          tone: 'amber',
        },
        {
          storyTerm: 'Invisible cloak woven over the watchtower inspection tools',
          technicalTerm: '/etc/ld.so.preload (preload.so) hooking syscalls to hide /data2/ and /bin/smartctl',
          tone: 'sky',
        },
        {
          storyTerm: 'Secret spring welded onto the master reboot engine',
          technicalTerm: 'Patching the flatkc reboot binary so COATHANGER survives FortiOS firmware upgrades',
          tone: 'rose',
        },
        {
          storyTerm: 'Watchtower phoning an outside spy post on its own',
          technicalTerm: 'Unexpected outbound TLS C2 initiated by the FortiGate appliance itself',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending an oversized, carefully shaped knock against the watchtower public remote-access gate, the spy overflows the gate memory tray and slips directly into the underlying appliance operating system without presenting any credentials.',
        storyMappings: [
          {
            storyTerm: 'Public remote-access gate on the watchtower',
            technicalTerm: 'Internet-exposed FortiGate FortiOS SSL-VPN daemon (sslvpnd)',
            tone: 'amber',
          },
          {
            storyTerm: 'Oversized carefully shaped knock',
            technicalTerm: 'Pre-authentication heap buffer overflow exploiting CVE-2022-42475 or CVE-2023-27997',
            tone: 'sky',
          },
          {
            storyTerm: 'Slipping directly into the appliance engine room',
            technicalTerm: 'Arbitrary remote code execution inside the FortiGate Linux runtime',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero login required',
            technicalTerm: 'Unauthenticated perimeter takeover bypassing VPN MFA and admin policies',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the appliance, the spy slips a rigged lens onto the universal tool coatroom and disguises its own implant behind an ordinary disk-health monitor, blinding every live inspection command run by engineers.',
        storyMappings: [
          {
            storyTerm: 'Rigged lens on the universal tool coatroom',
            technicalTerm: '/etc/ld.so.preload loading preload.so to hook system calls across FortiOS tools',
            tone: 'amber',
          },
          {
            storyTerm: 'Implant disguised behind a disk-health monitor',
            technicalTerm: 'COATHANGER RAT hidden in /data2/ and trojanized /bin/smartctl',
            tone: 'sky',
          },
          {
            storyTerm: 'Blinding live inspection commands on the appliance',
            technicalTerm: 'Userland syscall hooking concealing rogue files, processes, and sockets from CLI',
            tone: 'rose',
          },
          {
            storyTerm: 'Unmasking the cloak offline',
            technicalTerm: 'Offline disk and raw memory forensic inspection bypassing live ld.so.preload hooks',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Perform offline disk and memory forensic triage on suspected FortiGate appliances (bypassing live userland rootkit hooks that conceal active implants) to uncover /etc/ld.so.preload entries and unauthorized binaries inside /data2/ or modified /bin/smartctl. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1574.006 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Knowing defenders will eventually reboot and rebuild the watchtower\'s base blueprint to evict intruders, the spy alters the building\'s official reboot blueprint itself so every restart and software rebuild obediently re-installs the spy automatically.',
        storyMappings: [
          {
            storyTerm: 'Altering the official reboot blueprint itself',
            technicalTerm: 'Patching the FortiOS flatkc kernel/initramfs reboot binary during persistence setup',
            tone: 'amber',
          },
          {
            storyTerm: 'Surviving full base-blueprint rebuilds automatically',
            technicalTerm: 'COATHANGER re-injecting itself into the newly upgraded FortiOS image on reboot',
            tone: 'sky',
          },
          {
            storyTerm: 'Watchtower phoning outside on its own',
            technicalTerm: 'Anomalous outbound TLS C2 beacons originating directly from the FortiGate management IP',
            tone: 'rose',
          },
          {
            storyTerm: 'Only true eradication path',
            technicalTerm: 'Full physical TFTP format-and-reflash from verified clean firmware rather than in-place upgrade',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor perimeter firewalls and upstream taps for unexplained outbound TLS connections initiated directly by the FortiGate appliance itself to unknown external IPs (unusual for perimeter gateways) and verify cryptographic hashes on /bin/smartctl and flash partitions. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
