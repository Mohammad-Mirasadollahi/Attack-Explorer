import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-salt-typhoon-telecom',
    briefing: {
      headline: 'Scenario Briefing: Salt Typhoon (GhostEmperor), Telecom Core Router Compromise & Guest Shell Pivot',
      storyAnalogy:
        'Imagine a telephone company’s central switching building. Instead of bugging a single office phone, the attacker slips into the core highway router (Cisco IOS XE), enables a hidden Linux maintenance room built right inside the router (Guest Shell), and taps the core fiber backbone (RADIUS / TACACS+ and packet capture pipes) so they can harvest network engineer credentials and silently copy traffic passing through the ISP.',
      plainSummary:
        'Documented by CISA, FBI, NSA, and Microsoft Threat Intelligence (2024), the Salt Typhoon APT campaign targeted major telecommunications and ISP core networks. Rather than attacking regular office workstations, Salt Typhoon compromised internet-facing edge and core routing appliances (such as Cisco IOS XE routers), abused the router’s built-in Linux container environment ("Guest Shell", a legitimate Linux environment inside the router where processes are invisible to standard router CLI commands) to run persistent implants and SSH tunnels, captured network administrator TACACS+ / RADIUS credentials in transit, and accessed sensitive core routing planes.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Salt Typhoon Operator & Edge Telecom Router), trace the IOS XE privilege escalation and Linux Guest Shell container activation on Node ③/④ (Core ISP Router & Guest Shell Container), and follow the credential capture and core network pivot to Node ⑤, monitored by Node ⑥ (Telecom SOC / NetFlow & Syslog SIEM).',
      documentedAdvisory: 'Joint CISA/NSA/FBI Telecom Infrastructure Advisory (2024) · Microsoft Salt Typhoon · MITRE T1190 / T1610 / T1040',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Compromising the Edge Router Web UI & Creating a Level-15 Admin Account',
        storyAnalogy:
          'The intruder exploits a flaw in the router’s front management web desk (webui_wsma_http) to forge a "Privilege 15 Master Engineer" badge right inside the router’s local user roster.',
        simpleExplanation:
          'The attacker exploits an exposed management interface or captured configuration credential on a telecom edge router (such as the Cisco IOS XE Web UI / webui_wsma_http endpoint) to execute privileged configuration commands and create a hidden local user account with privilege 15 (in Cisco IOS XE, Privilege Level 15 is the highest "enable" administrative tier, granting unrestricted control over routing tables, packet capture, and system containers).',
        howItWorksInPractice:
          'Creating a local fallback account with username <name> privilege 15 secret <hash> allows the attacker to log directly into the router with full administrative authority whenever local authentication fallback is enabled or by bypassing centralized AAA checks. In the documented Sysmon EID 6 exchange from Salt Typhoon C2 Relay to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK Event 6 (confirming that the BYOVD DRIVER LOAD request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 DEMODEX KERNEL ROOTKIT MINIFILTER & REGISTRY HIDING).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② into Node ③ (Telecom Edge/Core Router IOS XE), and return arrow ⇠#1 granting Privilege 15 CLI execution.',
        detectionAndEvidence:
          'Documented in CISA/Cisco IOS XE advisories: %SYS-5-CONFIG_I: Configured from http by console and unexpected username ... privilege 15 entries in AAA accounting logs.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1610',
        plainTitle: 'Activating the Router’s Linux "Guest Shell" Container to Hide Persistent Implants',
        storyAnalogy:
          'Inside the router, there is a legitimate, factory-built Linux workshop (guestshell) meant for automation scripts. When an admin inspects the normal router command line (show processes), they cannot see inside that Linux workshop, making it the perfect hidden room to run a covert SSH tunnel.',
        simpleExplanation:
          'Instead of dropping files onto the router’s standard flash storage (where any network engineer running "dir flash:" would immediately spot an unfamiliar file), the attacker enables iox (Cisco’s Application Hosting framework) and runs guestshell enable (which boots a built-in Linux container inside the router, originally designed by Cisco so engineers could run Python automation scripts, but abused by the attacker because processes and files inside the Linux Guest Shell are completely hidden from standard IOS CLI commands like "show processes").',
        howItWorksInPractice:
          'Inside the Guest Shell Linux container, the attacker has a full bash environment with network access to the router’s interfaces, allowing them to compile and run custom C2 tunnels, SSH relays, and packet sniffers inside an isolated container where no traditional endpoint EDR agent can be installed. In the documented Kernel Pool Scan exchange from Perimeter Firewall & NDR Tap to Telecom NOC Jump Server, Telecom NOC Jump Server responds with ALERT 96 KB Ring-0 (confirming that the DEMODEX ROOTKIT request succeeded on Telecom NOC Jump Server and establishing the runtime state required for Step #3 TELECOM TACACS+ CREDENTIAL CAPTURE & CORE ROUTER PIVOT).',
        diagramAlignment:
          'On the diagram, arrow #2→ enables iox / guestshell inside Node ④ (Router Linux Guest Shell Container), and ⇠#2 launches the persistent Linux C2 tunnel.',
        detectionAndEvidence:
          'Documented in CISA Telecom Hardening Guide: IOS XE syslog %IOX-6-GUESTSHELL_ENABLED and unexpected guestshell NAT/VirtualPortGroup interfaces when Guest Shell is not used by operations.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1040',
        plainTitle: 'Sniffing Core TACACS+ / RADIUS Credentials & Pivoting Into Core Telecom Enclaves',
        storyAnalogy:
          'From their hidden room inside the highway router, the attacker clips a wiretap (EPC / tcpdump) onto the router’s management line, records the passwords of senior network engineers as they log in, and uses those keys to walk into the core switching center.',
        simpleExplanation:
          'From inside the compromised router, the attacker activates Embedded Packet Capture (EPC, monitor capture, the router’s built-in traffic recording feature) or runs tcpdump inside Guest Shell to sniff management-plane traffic passing through the router. They intercept TACACS+ (TCP port 49) and RADIUS (UDP port 1812) authentication packets alongside weak/obfuscated Type-7 passwords in router configs (harvesting the credentials of senior telecom engineers so the attacker can log into core MPLS/BGP backbone routers as a legitimate administrator).',
        howItWorksInPractice:
          'Because core telecom routers sit at the intersection of administrative management networks and subscriber trunks, passive packet capture on the router itself harvests authentication secrets in transit without generating noisy port scans across the internal network. In the documented Suricata TACACS+/SSH exchange from Telecom NOC Jump Server to Demodex Kernel Rootkit (Ring-0), Demodex Kernel Rootkit (Ring-0) responds with ALERT TCP/49 & :22 (confirming that the CORE ROUTER PIVOT request succeeded on Demodex Kernel Rootkit (Ring-0) and completing the final execution objective of Microsoft & Kaspersky, Salt Typhoon (GhostEmperor): Demodex Rootkit & Telecom Core Capture).',
        diagramAlignment:
          'On the diagram, arrow #3→ captures credentials and pivots from Node ④ into Node ⑤ (Core Telecom Management & Routing Plane), while Node ⑥ (Telecom SIEM) correlates AAA and Guest Shell anomalies.',
        detectionAndEvidence:
          'Documented in CISA Telecom Advisory: unauthorized monitor capture (EPC) sessions, GRE/IPsec tunnel creation, and TACACS+ logins from router loopback addresses.',
      },
    ],
  };
