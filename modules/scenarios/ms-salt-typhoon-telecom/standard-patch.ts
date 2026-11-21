import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a national telephone switching center whose exterior maintenance console gets compromised to mint a brand-new supreme-level supervisor badge. Rather than running noisy programs on the main switchboard where telecom engineers watch closely, the spy turns on a hidden built-in utility side room inside the switch itself to stash permanent tools, then silently clips wiretaps straight onto the trunk lines to capture core network passwords and ride deep into the national telecom backbone.',
      storyMappings: [
        {
          storyTerm: 'Minting a supreme-level supervisor badge via the exterior console',
          technicalTerm: 'Exploiting Cisco IOS XE web UI to create a local privilege-15 administrator account',
          tone: 'amber',
        },
        {
          storyTerm: 'Turning on a hidden built-in utility side room inside the switch',
          technicalTerm: 'Activating IOS XE Guest Shell container (%IOX-6-GUESTSHELL_ENABLED) for stealth persistence',
          tone: 'sky',
        },
        {
          storyTerm: 'Clipping silent wiretaps onto trunk lines for core passwords',
          technicalTerm: 'Unauthorized Embedded Packet Capture (EPC) sniffing TACACS+ and RADIUS credentials',
          tone: 'rose',
        },
        {
          storyTerm: 'Riding deep into the national telecom backbone',
          technicalTerm: 'Creating covert GRE/IPsec tunnels and pivoting via router loopback addresses',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Entering through an exposed exterior switchboard web dashboard, the spy modifies the device\'s live configuration straight from the front panel to carve out a brand-new highest-privilege administrator account.',
        storyMappings: [
          {
            storyTerm: 'Exposed exterior router web dashboard',
            technicalTerm: 'Internet-reachable Cisco IOS XE HTTP/HTTPS management web UI',
            tone: 'amber',
          },
          {
            storyTerm: 'Carving out a highest-privilege administrator account',
            technicalTerm: 'Creating an unauthorized local username ... privilege 15 admin account',
            tone: 'sky',
          },
          {
            storyTerm: 'Configuration ledger noting an odd web-driven edit',
            technicalTerm: 'IOS XE syslog %SYS-5-CONFIG_I: Configured from http by console',
            tone: 'rose',
          },
          {
            storyTerm: 'Central accounting log mismatch',
            technicalTerm: 'AAA accounting logs recording privilege-15 account creation outside change windows',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Cisco IOS XE syslog %SYS-5-CONFIG_I: Configured from http by console (which proves a configuration change arrived through the web UI rather than authorized SSH/CLI) with unexpected username ... privilege 15 entries in central AAA accounting logs.',
      },
      2: {
        storyAnalogy:
          'Knowing that telecom engineers rarely inspect the switch\'s built-in utility closet, the spy switches on that hidden back room, attaches a private side corridor to it, and parks custom espionage tools safely away from ordinary switchboard inspections.',
        storyMappings: [
          {
            storyTerm: 'Switch\'s built-in utility closet',
            technicalTerm: 'Cisco IOS XE Linux Guest Shell (IOx container) environment',
            tone: 'amber',
          },
          {
            storyTerm: 'Private side corridor attached to the closet',
            technicalTerm: 'Unauthorized VirtualPortGroup and Guest Shell NAT forwarding interfaces',
            tone: 'sky',
          },
          {
            storyTerm: 'Parking espionage tools away from ordinary switchboard checks',
            technicalTerm: 'Persistent Linux implants hidden outside standard IOS XE show running-config views',
            tone: 'rose',
          },
          {
            storyTerm: 'Loud warning message on unconfigured switches',
            technicalTerm: 'IOS XE syslog %IOX-6-GUESTSHELL_ENABLED firing when Guest Shell is unused by ops',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert immediately on Cisco IOS XE syslog %IOX-6-GUESTSHELL_ENABLED (which fires whenever the embedded Linux Guest Shell container starts) and audit configurations for unexpected guestshell NAT or VirtualPortGroup interfaces where operations do not use IOx containers.',
      },
      3: {
        storyAnalogy:
          'From inside the compromised edge switch, the spy turns on the switch\'s built-in traffic recorder to scoop up administrator passcodes crossing the trunk lines, builds secret shielded bypass pipes, and rides straight into the core carrier switching fabric.',
        storyMappings: [
          {
            storyTerm: 'Switch\'s built-in traffic recorder scooping up passcodes',
            technicalTerm: 'Unauthorized Embedded Packet Capture (monitor capture / EPC) sniffing TACACS+ / RADIUS',
            tone: 'amber',
          },
          {
            storyTerm: 'Secret shielded bypass pipes across the carrier',
            technicalTerm: 'Unauthorized GRE or IPsec tunnels bridging external attacker hosts into core networks',
            tone: 'sky',
          },
          {
            storyTerm: 'Pivoting from the switch\'s own internal identity',
            technicalTerm: 'Anomalous TACACS+ administrative logins originating from router loopback addresses',
            tone: 'rose',
          },
          {
            storyTerm: 'Deep national carrier foothold',
            technicalTerm: 'Salt Typhoon strategic persistence across telecommunications core infrastructure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Audit carrier routers for unauthorized monitor capture (Embedded Packet Capture) sessions, unexplained GRE or IPsec tunnel interfaces, and anomalous TACACS+ logins originating from router loopback addresses (CISA Telecom Hardening Guide high-priority indicators). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1040 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
