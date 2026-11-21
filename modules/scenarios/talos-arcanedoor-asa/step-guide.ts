import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'talos-arcanedoor-asa',
    briefing: {
      headline: 'Scenario Briefing: ArcaneDoor Campaign (UAT4356 / STORM-1849), Cisco ASA Line Dancer & Line Runner Implants',
      storyAnalogy:
        'Imagine a border checkpoint guardhouse (a Cisco ASA VPN firewall) that has no security cameras inside its own booth. The attacker slips a hidden radio receiver (Line Dancer) into the guardhouse’s memory that listens for secret commands disguised inside regular traveler visa forms (/CSCOSSLC/config-auth), and welds a hidden spare key (Line Runner) into the checkpoint’s boot firmware (disk0:) so even if the building loses power and restarts, the backdoor comes right back to life.',
      plainSummary:
        'In this scenario (CVE-2024-20353, Cisco Talos - ArcaneDoor (UAT4356): Cisco ASA Zero-Days, Line Dancer & Line Runner), the attacker follows one continuous arc: delivering Base64-Encoded Shellcode Payloads Inside, then "Line Dancer" In-Memory Implant Disables Syslog, then "Line Runner" Abuses vpn_dessert.zip to Survive. Steps #1–#3 examine #1 Delivering Base64-Encoded Shellcode Payloads Inside; #2 "Line Dancer" In-Memory Implant Disables Syslog; #3 "Line Runner" Abuses vpn_dessert.zip to Survive. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for CVE-2024-20353 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UAT4356 Operator), send crafted HTTPS requests to Node ②/③ (Cisco ASA Perimeter Firewall /CSCOSSLC/config-auth), trace the Line Dancer in-memory shellcode dispatcher and Line Runner boot persistence inside Node ④ (lina Process Memory & disk0:), and follow the silent packet capture and config exfiltration to Node ⑤ while Node ⑥ (NetFlow / Memory Integrity SIEM) detects the anomaly.',
      documentedAdvisory: 'Cisco Talos "ArcaneDoor" Report · CVE-2024-20353 & CVE-2024-20359 · MITRE ATT&CK T1542 / T1059',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Delivering Base64-Encoded Shellcode Payloads Inside AnyConnect /CSCOSSLC/config-auth Requests',
        storyAnalogy:
          'Every day, thousands of remote employees send <config-auth> XML forms to the Cisco ASA VPN gate to log in. The attacker sends that exact same XML form, but tucks a 32-byte secret handshake and Base64 shellcode inside the <host-scan-reply> field.',
        simpleExplanation:
          'To control the compromised Cisco ASA firewall without opening any suspicious new network port, the attacker sends standard HTTPS POST requests on port 443 to /CSCOSSLC/config-auth (the exact URL that every remote employee’s Cisco AnyConnect VPN client connects to every morning, allowing the attacker’s command-and-control traffic to blend seamlessly into legitimate corporate VPN logins). Inside the XML body’s <host-scan-reply> tag, the attacker places a 32-byte magic identifier followed by a Base64-encoded shellcode command.',
        howItWorksInPractice:
          'Normally, the ASA’s XML parser processes <host-scan-reply> during AnyConnect posture checks. Because the Line Dancer hook intercepts the buffer inside the lina process as soon as it spots the 32-byte magic header (before standard VPN authentication even finishes), the attacker can send commands without needing a valid VPN username or password. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (UAT4356 Operator) to Node ②/③ (Cisco ASA /CSCOSSLC/config-auth), and return arrow ⇠#1 passing the XML body to the hooked lina handler.',
        detectionAndEvidence:
          'Documented by Cisco Talos (CVE-2024-20353 advisory covering perimeter firewall exploitation): anomalous POST requests to /CSCOSSLC/config-auth with oversized <host-scan-reply> payloads from non-VPN client IPs (flagging malformed pre-authentication requests used to trigger the flaw). Correlate Sysmon or Windows Security Event telemetry for T1542 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: '"Line Dancer" In-Memory Implant Disables Syslog & Executes Arbitrary CLI Commands',
        storyAnalogy:
          'When the Line Dancer implant inside the firewall’s lina process spots that 32-byte secret handshake, its first move is to unplug the guardhouse’s alarm bell (disabling Syslog and crash dumps) before silently running the attacker’s router commands.',
        simpleExplanation:
          'Inside the ASA’s main lina executable (the monolithic process that handles all firewalling, routing, and VPN sessions on a Cisco ASA), the Line Dancer memory-only implant decodes the incoming shellcode and executes it directly in RAM. Before running reconnaissance or capturing packets, Line Dancer patches the in-memory syslog logging function (temporarily silencing outbound syslog alerts so the SOC’s SIEM server never sees that someone just ran "show running-config" or started a packet capture) and disables crash dumps (so if an exploit attempt crashes a thread, no forensic core dump is written to disk).',
        howItWorksInPractice:
          'Because perimeter network appliances cannot run standard Windows/Linux EDR agents, modifying the running lina process in volatile RAM hides the implant from normal CLI checks, and can only be caught on-box by hashing the live memory text segment via verify /md5 system:memory/text. In the documented HTTPS POST scan.xml exchange from DMZ Reverse Proxy & SPAN Tap to Cisco ASA 5500-X Firewall, Cisco ASA 5500-X Firewall responds with RESP 1,420 Bytes (confirming that the LINE DANCER C2 request succeeded on Cisco ASA 5500-X Firewall and establishing the runtime state required for Step #3 SYSLOG SUPPRESSION, PCAP CAPTURE & CONFIG EXFIL).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ (lina Process Memory) invokes the Line Dancer shellcode dispatcher, and ⇠#2 returns the command output inside the HTTPS VPN response.',
        detectionAndEvidence:
          'Documented in Cisco Talos ArcaneDoor IOC Guide (integrity validation steps for hardware security appliances): verify /md5 system:memory/text hash mismatch on the running ASA lina text segment and unexpected gaps in ASA syslog sequence numbers (proving in-memory code tampering and suppressed logging). Correlate Sysmon or Windows Security Event telemetry for T1059 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542',
        plainTitle: '"Line Runner" Abuses vpn_dessert.zip (CVE-2024-20359) to Survive Firewall Reboots',
        storyAnalogy:
          'Every time a Cisco ASA firewall boots up, it automatically unzips and runs an old factory setup archive (disk0:/.private/startup-config) if one exists. Line Runner plants a booby-trapped zip file in that exact spot so every reboot automatically re-installs the backdoor.',
        simpleExplanation:
          'Because Line Dancer lives purely in RAM, rebooting the firewall would normally wipe it out. To survive reboots, the attacker exploits CVE-2024-20359 (a legacy feature in Cisco ASA where the boot sequence automatically looks for a leftover pre-configuration zip archive on the flash drive disk0: and runs the scripts inside it as root during startup). By planting their persistent backdoor (Line Runner) inside that legacy boot archive path, the firewall automatically re-infects its own memory every time the power is cycled.',
        howItWorksInPractice:
          'Combining Line Runner (disk0: boot persistence via CVE-2024-20359) with Line Dancer (volatile RAM command execution inside lina) gives the attacker both reboot survival and zero-footprint daily operation. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ persists Line Runner on Node ④ (disk0:) and exfiltrates captured VPN sessions and configs to Node ⑤, while Node ⑥ (SIEM / Forensic Check) detects the .private boot archive and memory/text hash divergence.',
        detectionAndEvidence:
          'Documented in Cisco Advisory CVE-2024-20359 and NCSC Guidance (post-incident persistence checks for edge firewalls): unauthorized files on disk0: boot paths and system:memory/text integrity verification failure (confirming that a persistent archive survived appliance reboots). Correlate Sysmon or Windows Security Event telemetry for T1562.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
