import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics',
    title: 'Mandiant UNC1945, CrowdStrike LightBasin & GSMA — Telecom GPRS Tunneling Protocol (GTP) & Roaming Interconnect Forensics',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1572',
    description:
      'Grounded in Mandiant UNC1945 threat research, CrowdStrike LightBasin analysis, and GSMA FS.11 / FS.19 interconnect security guidelines: telecom SOC analysts investigate unauthorized GPRS Tunneling Protocol (GTP-C UDP port 2123 / GTP-U UDP port 2152) packets traversing the GRX/IPX roaming exchange to reach internal SGSN/GGSN/PGW mobile core nodes.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External GRX/IPX Roaming Peer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GTP Border Firewall (:2123/:2152)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SGSN / GGSN / MME Core Node', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Telecom Signaling IDS & Zeek GTP', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'HLR / HSS Subscriber Database', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Rogue PDP Context Creation Request over GTP-C (UDP Port 2123) on GRX Interface',
        narration:
          'Across the inter-carrier GPRS Roaming Exchange (GRX), an unauthorized peer sends a crafted GTPv1-C Create PDP Context Request (Message Type 16) or GTPv2-C Create Session Request (Message Type 32) on UDP port 2123 targeting the operator GGSN/PGW.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1133 - External Remote Services / GRX GTP Interconnect)',
        technicalCommands: [
          'zeek -C -r grx-interconnect.pcap gtpv1',
          'tshark -r grx-interconnect.pcap -Y "gtp.message == 0x10" -T fields -e ip.src -e ip.dst -e gtp.imsi -e gtp.apn',
        ],
        defenseMitigation:
          'Deploy a GTP Firewall at the GRX/IPX perimeter to validate source GSN IP ranges against official GSMA IR.21 roaming partner tables and block inner-IP spoofing.',
        logs: [
          {
            id: 'tel-gtp-1',
            timestamp: '04:22:10.008',
            source: 'Network',
            severity: 'high',
            EventCode: 2123,
            ProcessName: 'zeek-gtp',
            CommandLine: 'GTPv1-C MessageType=16 (Create PDP Context Request) APN=internet.mnc001.mcc001.gprs',
            raw: 'zeek_gtpv1: ts=1763266930.008 orig_h=198.51.100.44 resp_h=10.90.10.12 resp_p=2123 msg_type="CreatePDPContextRequest" teid=0x00000000 apn="admin.core.gprs"',
            parsedFields: {
              SignalingProtocol: 'GTPv1-C Control Plane (UDP 2123)',
              GtpMessageType: 'Create PDP Context Request (0x10)',
              RequestedApn: 'admin.core.gprs (Internal Management APN)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Encapsulated GTP-U (UDP Port 2152) Inner Packet Routing to Telecom Core Infrastructure',
        narration:
          'Once a Tunnel Endpoint Identifier (TEID) is established, inner IP packets encapsulated inside GTP-U (UDP port 2152) bypass outer perimeter ACLs and route directly to internal OAM (Operations, Administration, and Maintenance) interfaces of mobile core servers.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1572 - Protocol Tunneling: GTP-U Encapsulation)',
        technicalCommands: [
          'tshark -r grx-interconnect.pcap -Y "gtp.message == 0xff && ip.dst == 10.90.0.0/16" -T fields -e gtp.teid -e ip.src -e ip.dst -e tcp.dstport',
        ],
        defenseMitigation:
          'Inspect inner IP headers of GTP-U (UDP 2152) tunnels at the Gi/SGi interface and strictly prohibit subscriber tunnel traffic from routing to internal OAM or signaling VLANs.',
        logs: [
          {
            id: 'tel-gtp-2',
            timestamp: '04:22:14.319',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 2152,
            ProcessName: 'suricata-telecom',
            CommandLine: 'GTP-U (UDP 2152) TEID=0x410082a1 Encapsulated Inner SSH/TCP -> 10.90.20.5:22',
            raw: 'telecom_ids: alert="GSMA-FS19 GTP-U Inner IP Routing to Internal OAM Subnet" outer_src=198.51.100.44 inner_dst=10.90.20.5 inner_dport=22 teid=0x410082a1',
            parsedFields: {
              TunnelProtocol: 'GTP-U User Plane (UDP 2152)',
              TunnelEndpointId: 'TEID 0x410082a1',
              InnerDestination: '10.90.20.5:22 (Internal Core OAM Node)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Custom PAM Module (/lib64/security/pam_unix_auth.so) & iptables Covert Port Rule Audit',
        narration:
          'On the Linux/Solaris mobile core server, forensic inspection of /etc/pam.d/sshd and iptables -t nat -L PREROUTING reveals a modified PAM shared library and a covert PREROUTING port-redirection rule forwarding specific source ports to a hidden listener.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1556.003 - Modify Authentication Process: Pluggable Authentication Modules)',
        technicalCommands: [
          'rpm -Va pam || dpkg --verify libpam-modules',
          'iptables -t nat -L PREROUTING -n -v --line-numbers',
        ],
        defenseMitigation:
          'Run continuous package integrity verification (rpm -Va / AIDE / FIM) over /lib64/security/pam_*.so and audit netfilter/iptables table modifications via auditd syscall rules.',
        logs: [
          {
            id: 'tel-gtp-3',
            timestamp: '04:22:45.102',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'iptables',
            CommandLine: 'iptables -t nat -A PREROUTING -p tcp --sport 33891 -j REDIRECT --to-ports 55221',
            raw: 'type=SYSCALL msg=audit(1763266965.102:704): arch=c000003e syscall=59 success=yes exe="/usr/sbin/iptables" comm="iptables" key="netfilter_mod"',
            parsedFields: {
              NetfilterTable: 'nat PREROUTING',
              CovertRuleTrigger: 'TCP Source Port 33891 -> Local Port 55221',
              ThreatGroupAttribution: 'LightBasin (UNC1945)',
            },
          },
        ],
      },
    ],
  };
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
