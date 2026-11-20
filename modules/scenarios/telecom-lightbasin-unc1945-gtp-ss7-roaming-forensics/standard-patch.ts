import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an international postal bridge connecting rival national carriers so travelers can receive mail abroad. An intruder posing as a friendly foreign post office requests a private sealed mailbag lane across the bridge, stuffs unauthorized internal maintenance parcels inside those sealed bags to sail straight past the outer security checkpoints, and installs a rigged front-door lock and secret hallway chute inside the telecom headquarters.',
      storyMappings: [
        {
          storyTerm: 'International Postal Bridge',
          technicalTerm: 'Inter-Carrier GPRS Roaming Exchange (GRX / IPX Interconnect)',
          tone: 'sky',
        },
        {
          storyTerm: 'Requesting Sealed Mailbag Lane',
          technicalTerm: 'Rogue GTP-C Create PDP Context / Create Session (UDP/2123)',
          tone: 'amber',
        },
        {
          storyTerm: 'Stuffing Maintenance Parcels Inside',
          technicalTerm: 'Encapsulated GTP-U Inner IP Packets (UDP/2152) Reaching Core OAM',
          tone: 'rose',
        },
        {
          storyTerm: 'Rigged Lock & Secret Chute',
          technicalTerm: 'Backdoored PAM (/lib64/security/pam_unix_auth.so) & iptables PREROUTING',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing on the foreign end of the postal bridge, the intruder sends a counterfeit carrier dispatch slip asking the domestic sorting hub to open a brand-new sealed mailbag channel for a visiting subscriber.',
        storyMappings: [
          {
            storyTerm: 'Foreign End of Postal Bridge',
            technicalTerm: 'Unauthorized External GRX Roaming Peer Interface',
            tone: 'amber',
          },
          {
            storyTerm: 'Counterfeit Carrier Dispatch Slip',
            technicalTerm: 'GTPv1-C Create PDP Context (Type 16) / GTPv2-C Create Session (Type 32)',
            tone: 'rose',
          },
          {
            storyTerm: 'Domestic Sorting Hub',
            technicalTerm: 'Mobile Operator GGSN / PGW Listening on UDP Port 2123',
            tone: 'sky',
          },
          {
            storyTerm: 'Bridge Border Checkpoint',
            technicalTerm: 'GSMA FS.11 / FS.19 GTP Signaling Firewall Peer Validation',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once the sorting hub stamps a tracking tag onto the new sealed mailbag lane, the intruder packs private administrative commands inside the sealed pouches so outer gate guards only see harmless roaming luggage while the pouches drop straight onto the core management floor.',
        storyMappings: [
          {
            storyTerm: 'Stamped Mailbag Tracking Tag',
            technicalTerm: 'Established Tunnel Endpoint Identifier (TEID)',
            tone: 'amber',
          },
          {
            storyTerm: 'Sealed Roaming Pouches',
            technicalTerm: 'GTP-U User Plane Encapsulated Traffic on UDP Port 2152',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing Outer Gate Guards',
            technicalTerm: 'Inner IP Packets Routing Past Perimeter ACLs to Internal OAM',
            tone: 'rose',
          },
          {
            storyTerm: 'Inner Parcel X-Ray Scanner',
            technicalTerm: 'Deep GTP-U Inner-Packet Inspection Blocking RFC 1918 OAM Targets',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Inside the telecom core server room, the intruder swaps out the building’s staff badge reader for a rigged lock that accepts their secret skeleton password and cuts a hidden redirection chute in the reception desk so any call from their chosen source window slides quietly to a covert backroom listener.',
        storyMappings: [
          {
            storyTerm: 'Rigged Staff Badge Reader',
            technicalTerm: 'Modified /lib64/security/pam_unix_auth.so Referenced in /etc/pam.d/sshd',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden Reception Redirection Chute',
            technicalTerm: 'Covert iptables nat PREROUTING Source-Port Redirection Rule',
            tone: 'amber',
          },
          {
            storyTerm: 'Telecom Core Server Room',
            technicalTerm: 'Linux / Solaris Mobile Core SGSN / GGSN Infrastructure Host',
            tone: 'sky',
          },
          {
            storyTerm: 'Forensic Lock & Chute Audit',
            technicalTerm: 'Package Hash Verification of PAM Modules & iptables -t nat -L Audit',
            tone: 'emerald',
          },
        ],
      },
    },
  };
