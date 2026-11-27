import { DNS_TUNNELING_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'dns-tunneling-exfil',
  code: 'T1071.004',
  name: 'IETF RFC 1035, Sysmon EID 22 & Unit 42 — Covert DNS Tunneling & Exfiltration DFIR',
  shortSubtitle: 'Network & Web · Subdomain Entropy, Recursive NS/TXT Beacons, Sysmon EID 22 & RPZ Sinkholing',
  category: 'NETWORK_WEB',
  severity: 'HIGH',
  primaryMitrePhase: 6,
  overview:
    'In Covert DNS Tunneling & Exfiltration (MITRE ATT&CK T1071.004 and T1048.003), threat actors abuse an enterprise network’s permitted internal DNS resolution path to smuggle stolen data out—and receive command replies back—even when direct outbound web traffic is strictly blocked. Grounded in IETF RFC 1035 label constraints (63-octet labels, 253-character total FQDN), Microsoft Sysmon Event ID 22 process-level DNS telemetry, and Palo Alto Networks Unit 42 DNS tunneling analyses (including OilRig/APT34 campaigns), this DFIR walkthrough traces how encoded data is packed into unique subdomains, why Shannon entropy and cache-miss analytics in Zeek reliably unmask tunnels, and how DNS Response Policy Zones (RPZ) paired with strict outbound port 53/853 firewall controls shut down the covert channel.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1071.004 (DNS Protocol) · T1048.003 (Exfil Over Non-C2 Protocol)' },
    { term: 'PROTOCOL BOUNDS', value: 'IETF RFC 1035 (<= 63 Octets/Label · <= 253 Chars Full FQDN)' },
    { term: 'HOST TELEMETRY', value: 'Microsoft Sysmon Event ID 22 (DnsQuery -> Process Attribution)' },
    { term: 'NETWORK TELEMETRY', value: 'Zeek dns.log (Shannon Entropy > 4.0 · TTL=0 · TXT/CNAME Spike)' },
    { term: 'CONTAINMENT', value: 'DNS RPZ Sinkhole + Block Direct Workstation UDP/TCP 53 & DoT/DoH' },
    { term: 'CASE STUDIES', value: 'Unit 42 DNS Tunneling Forensics & OilRig / APT34 Telemetry Patterns' },
  ],
  nodes: [
    {
      id: 'wkstn_fin',
      label: 'WKSTN-FIN-14',
      sublabel: 'telemetry_sync.exe · PID 6248',
      role: 'victim_host',
      x: 10,
      y: 28,
      details: {
        osOrType: 'Segmented Finance Workstation (10.10.44.14)',
        pidOrPort: 'PID 6248 · No Direct HTTP Egress',
        privilege: 'CORP\\m.reynolds (Standard User)',
        artifacts: [
          'Encodes staged files into 56-character hex/base32 subdomain labels',
          'Emits rapid unique DNS queries captured by Sysmon Event ID 22',
          'Polls TXT resource records for encoded response acknowledgements',
        ],
        description:
          'Segmented corporate endpoint without direct Internet web egress, where a covert process encodes data into DNS lookup hostnames.',
      },
    },
    {
      id: 'dns_int',
      label: 'DNS-INT-01 (Recursive)',
      sublabel: 'Internal Resolver · 10.10.2.53',
      role: 'dns_resolver',
      x: 34,
      y: 28,
      details: {
        osOrType: 'Enterprise Recursive DNS Resolver',
        pidOrPort: 'UDP/TCP 53 · Uncached Forwarding',
        privilege: 'Permitted Perimeter DNS Egress',
        artifacts: [
          'Cannot cache unique per-chunk subdomains (cache-hit ratio < 1%)',
          'Iteratively forwards queries out to the domain’s external Authoritative NS',
          'Enforces RPZ sinkhole rules once SOC activates containment',
        ],
        description:
          'Legitimate internal DNS resolver unintentionally acting as a relay bridge for uncached high-entropy subdomain lookups.',
      },
    },
    {
      id: 'ext_ns',
      label: 'Rogue Auth NS',
      sublabel: 'ns1.cdn-metrics-sync.example',
      role: 'attacker',
      x: 60,
      y: 28,
      details: {
        osOrType: 'External Authoritative Name Server (198.51.100.77)',
        pidOrPort: 'UDP/53 · Newly Observed Domain (4 Days)',
        privilege: 'Attacker-Controlled DNS Authority',
        artifacts: [
          'Reassembles incoming hex/base32 subdomain chunks in sequence order',
          'Returns TTL=0 TXT or CNAME records carrying encoded downstream replies',
          'Completely exposed to passive DNS and Newly Observed Domain (NOD) tracking',
        ],
        description:
          'External authoritative DNS server registered solely to harvest incoming subdomain labels and issue TXT control responses.',
      },
    },
    {
      id: 'zeek_soc',
      label: 'Zeek + Sysmon 22',
      sublabel: 'Entropy > 4.2 & Process Link',
      role: 'firewall_siem',
      x: 48,
      y: 68,
      details: {
        osOrType: 'Passive DNS Analytics & Endpoint Telemetry Plane',
        pidOrPort: 'Zeek dns.log + Sysmon EID 22 Correlation',
        privilege: 'SOC Detection & Hunting Pipeline',
        artifacts: [
          'Measures leftmost-label Shannon entropy (4.41 bits/byte vs ~3.0 normal)',
          'Flags 412 unique subdomains/min with high TXT ratio and TTL=0',
          'Joins network apex domain directly to WKSTN-FIN-14 PID 6248',
        ],
        description:
          'Combined network and host detection layer pairing statistical DNS entropy with endpoint process attribution.',
      },
    },
    {
      id: 'rpz_sinkhole',
      label: 'RPZ Sinkhole & FW Lock',
      sublabel: 'Drop Domain + Deny Direct 53',
      role: 'memory',
      x: 86,
      y: 44,
      details: {
        osOrType: 'DNS Firewall (RPZ) & Egress UDP/TCP 53 Policy',
        pidOrPort: 'Sinkhole 10.255.255.53 · Block Bypass 53/853',
        privilege: 'Zero-Trust DNS Containment',
        artifacts: [
          'RPZ rule immediately redirects *.cdn-metrics-sync.example to local sinkhole',
          'Perimeter firewall blocks direct workstation UDP/53, TCP/53, and DoT/DoH bypasses',
          'Prevents unauthorized covert channels while preserving full resolver visibility',
        ],
        description:
          'Hardened DNS defense architecture combining Response Policy Zones with mandatory internal resolver egress enforcement.',
      },
    },
  ],
  processTree: [
    {
      pid: 1420,
      ppid: 680,
      name: 'svchost.exe (Dnscache · Windows DNS Client)',
      commandLine: 'C:\\Windows\\System32\\svchost.exe -k NetworkService -p -s Dnscache',
      user: 'NT AUTHORITY\\NETWORK SERVICE',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: [
        'DnsQuery_W() -> Forwards uncached unique subdomain queries to DNS-INT-01',
        'Sysmon Event ID 22 logs caller process identity before Dnscache dispatch',
      ],
      memoryBlocks: [
        {
          address: '0x000001D840100000',
          section: 'Staging Buffer · Encoded 56-Char Hex Subdomain Labels',
          permissions: 'RW-',
          size: '64 KB',
          status: 'shellcode',
          description:
            'In-memory chunking buffer inside telemetry_sync.exe slicing sensitive records into RFC 1035-compliant 56-character hex labels prior to DnsQuery_W calls.',
          hexPreview: '34 61 39 66 32 63 38 65 31 62 37 64 33 61 30 34  4a9f2c8e1b7d3a04',
        },
        {
          address: '0x000001D840180000',
          section: 'Dnscache Table · High-Entropy Uncached TXT Lookups (TTL=0)',
          permissions: 'RW-',
          size: '48 KB',
          status: 'patched',
          description:
            'Windows DNS client resolver cache exhibiting 99.6% miss rate and zero-second TTL TXT responses from cdn-metrics-sync.example.',
          hexPreview: '54 58 54 3D 76 3D 6F 6B 3B 73 65 71 3D 30 34 33  TXT=v=ok;seq=043',
        },
        {
          address: '0x000001D840220000',
          section: 'Post-RPZ Hardened State · Sinkhole 10.255.255.53 & Egress Lock',
          permissions: 'R--',
          size: '32 KB',
          status: 'clean',
          description:
            'DNS Response Policy Zone enforcement returning sinkhole IP 10.255.255.53 for blocked apex domains while firewall denies direct port 53/853 egress.',
          hexPreview: '52 50 5A 5F 53 49 4E 4B 48 4F 4C 45 5F 44 52 4F  RPZ_SINKHOLE_DRO',
        },
      ],
    },
    {
      pid: 6248,
      ppid: 3912,
      name: 'telemetry_sync.exe (Covert DNS Tunnel Client · Sysmon 22 Caught)',
      commandLine: 'C:\\ProgramData\\SyncCache\\telemetry_sync.exe --interval 1200ms',
      user: 'CORP\\m.reynolds',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'DnsQuery_W("4a9f2c8e...s14.cdn-metrics-sync.example", DNS_TYPE_TEXT)',
        'Flagged by Sysmon EID 22 + Zeek Shannon Entropy (> 4.2 bits/byte)',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'RFC 1035 Subdomain Chunking & Sysmon Event ID 22 Process Attribution',
      subtitle: 'Encoding Stolen Data Into 63-Octet DNS Labels From an Isolated Endpoint',
      description:
        'Blocked from direct web egress, telemetry_sync.exe (PID 6248) encodes staged records into unique 56-character hex subdomain labels—immediately attributed to the exact process by Sysmon Event ID 22.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.004',
      mitreTechniqueName: 'Application Layer Protocol: DNS (RFC 1035 Encoding)',
      activeNodeIds: ['wkstn_fin', 'dns_int', 'zeek_soc'],
      compromisedNodeIds: ['wkstn_fin'],
      keySpecs: [
        { term: 'RFC 1035 LIMIT', value: 'Max 63 Octets per Subdomain Label · 253 Chars Full Name' },
        { term: 'HOST EVIDENCE', value: 'Sysmon Event ID 22 Links QueryName to Exact Process Image' },
        { term: 'ENCODING FOOTPRINT', value: 'Fixed-Length Hex/Base32 Prefixes With Sequence Counters' },
      ],
    },
    {
      index: 2,
      title: 'Recursive Resolver Forwarding to External Authoritative NS & TXT Replies',
      subtitle: 'Abusing Permitted Internal DNS Recursion as an Uncached Bidirectional Bridge',
      description:
        'Because every subdomain label is unique and carries TTL=0, internal resolver DNS-INT-01 cannot cache lookups and forwards each query to ns1.cdn-metrics-sync.example, which replies inside TXT records.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1048.003',
      mitreTechniqueName: 'Exfiltration Over Unencrypted Non-C2 Protocol (Recursive DNS)',
      activeNodeIds: ['wkstn_fin', 'dns_int', 'ext_ns'],
      compromisedNodeIds: ['wkstn_fin', 'ext_ns'],
      keySpecs: [
        { term: 'RELAY PATH', value: 'WKSTN-FIN-14 -> DNS-INT-01 -> External Authoritative NS' },
        { term: 'DOWNLINK CHANNEL', value: 'TXT & CNAME Records With TTL=0 Prevent Resolver Caching' },
        { term: 'EGRESS BYPASS', value: 'Works Even When Direct HTTP/HTTPS Is Denied at Perimeter' },
      ],
    },
    {
      index: 3,
      title: 'Zeek Statistical Detection: Shannon Entropy > 4.2, Label Length & NOD Correlation',
      subtitle: 'Why Mathematical DNS Telemetry Exposes Tunnels Regardless of Encoding Scheme',
      description:
        'Zeek passive DNS analytics flag cdn-metrics-sync.example for 4.41 bits/byte Shannon entropy, 412 unique subdomains per minute, 99.6% cache misses, heavy TXT ratio, and Newly Observed Domain age.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.004',
      mitreTechniqueName: 'Statistical DNS Tunneling Detection (Entropy & Volume)',
      activeNodeIds: ['dns_int', 'ext_ns', 'zeek_soc'],
      compromisedNodeIds: ['wkstn_fin', 'ext_ns'],
      keySpecs: [
        { term: 'SHANNON ENTROPY', value: '4.41 bits/byte vs ~2.7–3.2 for Natural Business Hostnames' },
        { term: 'VOLUME ANOMALY', value: '412 Unique Subdomains / 60s (99.6% Cache Miss Ratio)' },
        { term: 'DOMAIN REPUTATION', value: 'Newly Observed Domain (4 Days Old) + High TXT Proportion' },
      ],
    },
    {
      index: 4,
      title: 'DNS RPZ Sinkholing & Mandatory Internal Resolver Egress Enforcement',
      subtitle: 'Breaking the Covert Channel in Milliseconds & Closing Direct Port 53/853 Bypasses',
      description:
        'Defenders deploy an RPZ sinkhole rule for *.cdn-metrics-sync.example on DNS-INT-01, block direct workstation UDP/53, TCP/53, and DoT/DoH egress at the firewall, and isolate WKSTN-FIN-14.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1071.004',
      mitreTechniqueName: 'DNS Firewall (RPZ) Sinkholing & Egress Filtering',
      activeNodeIds: ['dns_int', 'zeek_soc', 'rpz_sinkhole'],
      compromisedNodeIds: ['ext_ns'],
      keySpecs: [
        { term: 'RPZ SINKHOLE', value: '*.cdn-metrics-sync.example -> Local Sinkhole 10.255.255.53' },
        { term: 'EGRESS POLICY', value: 'Deny Direct Workstation UDP/53, TCP/53, TCP/853 & Public DoH' },
        { term: 'IR FOLLOW-UP', value: 'Isolate WKSTN-FIN-14, Inspect Staging Buffer & Audit Accessed Files' },
      ],
    },
  ],
  telemetry: DNS_TUNNELING_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'dns-tunneling-exfil',
  briefing: {
    headline: 'Covert DNS Tunneling & Exfiltration (T1071.004): RFC 1035 Packing, Sysmon EID 22 & RPZ Sinkholing',
    storyAnalogy:
      'Imagine a walled coastal fortress where every outgoing cargo ship is blocked by a tall stone seawall. Trapped inside, a rogue clerk slices private harbor ledger sheets into tiny scrambled slips, ties each slip onto carrier pigeons disguised as routine harbor address inquiries, and sends them through the central postmaster tower straight out to an offshore lighthouse that flashes coded replies back—until the coastguard watchtower notices the impossibly gibberish scroll labels, traces which indoor desk is launching the pigeons, and drops an emerald harbor net over the rogue offshore island.',
    plainSummary:
      'In this scenario (T1071.004, Covert DNS Tunneling & Data Exfiltration) from WKSTN-FIN-14 through DNS-INT-01, a compromised endpoint smuggles staged files past web proxies along one continuous intrusion path using everyday DNS lookups. First, the implant slices stolen data into high-entropy hexadecimal subdomain labels attributed by Sysmon Event ID 22, then relays those unique uncached queries through the corporate recursive resolver to a rogue authoritative server returning TXT command replies, then triggers Zeek Shannon-entropy and Newly Observed Domain detection alerts, and finally gets severed by DNS Response Policy Zone sinkholing and outbound port 53/853 egress locks. Steps #1 through #4 trace each endpoint, resolver, and perimeter telemetry handoff, while the Memory Forensics section compares high-entropy tunnel query buffers against normal low-entropy enterprise DNS traffic.',
    diagramTopologySummary:
      'Five-node endpoint-to-perimeter chain connecting WKSTN-FIN-14 (PID 6248), internal recursive resolver DNS-INT-01, external authoritative server ns1.cdn-metrics-sync.example, Zeek + Sysmon EID 22 analytics, and the hardened RPZ Sinkhole & Egress Firewall posture.',
    documentedAdvisory:
      'Grounded in IETF RFC 1035 domain name specifications, Microsoft Sysmon Event ID 22 documentation, and Palo Alto Networks Unit 42 DNS tunneling / OilRig (APT34) DFIR studies.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1071.004',
      plainTitle: 'RFC 1035 Subdomain Chunking & Sysmon Event ID 22 Process Attribution',
      storyAnalogy:
        'At a dim desk inside the walled harbor, a rogue clerk cuts secret ledger pages into tiny equal-length scrambled paper strips small enough to fit inside carrier-pigeon leg capsules—unaware that a blue overhead skylight lens logs exactly which clerk’s desk launches every bird.',
      simpleExplanation:
        'Because IETF RFC 1035 (the foundational Internet specification defining how domain names are structured) caps every subdomain label at 63 characters and an entire domain name at 253 characters, DNS tunneling clients slice files into fixed-length encoded chunks (usually Hex or Base32 strings) prepended to an attacker-owned parent domain. On Windows endpoints, Microsoft Sysmon Event ID 22 (the kernel-assisted telemetry record capturing every DNS lookup together with the originating executable path and Process ID) immediately proves which specific binary generated those abnormal queries.',
      howItWorksInPractice:
        'On segmented workstation WKSTN-FIN-14 (10.10.44.14), outbound web proxies and direct HTTP/HTTPS connections are blocked, but standard internal DNS resolution remains open so corporate applications can function. Malicious binary C:\\ProgramData\\SyncCache\\telemetry_sync.exe (PID 6248) reads staged finance files, encodes sequential 28-byte slices into 56-character hexadecimal labels, and calls DnsQuery_W(). Without Sysmon Event ID 22, network defenders only see queries arriving at DNS-INT-01 from WKSTN-FIN-14’s IP address without knowing which process emitted them. With Event ID 22 enabled, DFIR analysts immediately link the high-entropy lookup burst to an unsigned binary running out of C:\\ProgramData\\SyncCache.',
      diagramAlignment:
        'Follow Step #1 / Link #1 as Node 1 (WKSTN-FIN-14 PID 6248) encodes chunks and dispatches lookups toward Node 2 (DNS-INT-01) while Node 4 (Zeek + Sysmon 22) records process lineage.',
      detectionAndEvidence:
        'Enable Sysmon Event ID 22 across endpoints and hunt for non-browser binaries emitting high volumes of long, unique subdomain queries under a single apex domain.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1048.003',
      plainTitle: 'Recursive Resolver Forwarding to External Authoritative NS & TXT Replies',
      storyAnalogy:
        'Each carrier pigeon flies first to the trusted central harbor postmaster tower; because the postmaster has never seen those bizarre scrambled street names before, it dutifully relays every pigeon across the seawall to the rogue offshore lighthouse, which flashes coded lantern replies back.',
      simpleExplanation:
        'A DNS tunnel rarely needs direct Internet access from the compromised workstation: it leverages the organization’s own recursive DNS resolver (the internal server responsible for looking up external domain names on behalf of staff computers). Because every encoded subdomain string is unique and the attacker’s external authoritative name server (the Internet server officially designated to answer queries for that domain) returns TTL=0 (Time To Live of zero seconds, prohibiting caching), the internal resolver dutifully ferries data in both directions using outbound subdomain labels and inbound TXT or CNAME records.',
      howItWorksInPractice:
        'When DNS-INT-01 (10.10.2.53) receives a TXT lookup for 7e3d19a4c5b20f8e...s14.cdn-metrics-sync.example, it checks its local cache, finds no match, and resolves the NS delegation to 198.51.100.77:53. The attacker’s custom authoritative listener strips the leftmost label, stores the decoded sequence chunk, and sends back a TXT record with TTL=0.0 containing an acknowledgement or next encoded tasking block. Unit 42 documented this exact bidirectional TXT/A/AAAA relay architecture in OilRig (APT34) DNS tunneling families such as DNSpionage and BONDUPDATER—highlighting why internal resolvers must be monitored as high-priority perimeter egress points.',
      diagramAlignment:
        'Follow Step #2 / Link #2 as Node 2 (DNS-INT-01 Recursive) relays uncached lookups across the perimeter to Node 3 (Rogue Auth NS 198.51.100.77) and receives TTL=0 TXT replies.',
      detectionAndEvidence:
        'Monitor internal resolver forwarding logs (Zeek dns.log) for unusual spikes in TXT, NULL, or CNAME queries with TTL=0 directed at a single newly observed authoritative server.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1071.004',
      plainTitle: 'Zeek Statistical Detection: Shannon Entropy > 4.2, Label Length & NOD Correlation',
      storyAnalogy:
        'High in the coastal watchtower, harbor analysts weigh the scrambled slips passing through the postmaster—realizing ordinary harbor addresses look like calm human words, whereas hundreds of random gibberish slips every minute bound for a four-day-old offshore island can only mean smuggling.',
      simpleExplanation:
        'Even if a threat actor switches between Hex, Base32, Base64, or custom ciphers, packing compressed or encrypted data into DNS labels creates unmistakable mathematical fingerprints: elevated Shannon entropy (a statistical measure of character randomness, typically > 4.0 bits/byte for encoded tunnels versus ~2.7–3.2 for normal hostnames), unusually long leftmost labels, near-100% cache-miss ratios, and high query counts targeting a Newly Observed Domain (a recently registered domain with zero prior enterprise history).',
      howItWorksInPractice:
        'Within 45 seconds of telemetry_sync.exe starting exfiltration, Zeek passive DNS telemetry and SIEM behavioral rules aggregate queries by registered apex domain (eTLD+1). While legitimate cloud CDNs occasionally generate high-entropy tokens, they rarely combine all five tunneling indicators simultaneously: 412 unique subdomains per minute, 56-character fixed leftmost labels, 4.41 bits/byte Shannon entropy, 78% TXT record type ratio with TTL=0, and a domain first observed only 4 days earlier. Correlating that Zeek alert with Sysmon Event ID 22 produces a zero-ambiguity P1 incident pinpointing both the exact exfiltrated volume (~184 KB) and the offending workstation process.',
      diagramAlignment:
        'Follow Step #3 / Link #3 as Node 4 (Zeek + Sysmon 22) evaluates traffic between Node 2 (DNS-INT-01) and Node 3 (Rogue Auth NS) and raises SIEM-ENTROPY-408.',
      detectionAndEvidence:
        'Deploy Zeek dns.log / passive DNS scoring combining Shannon entropy (>= 3.9), unique subdomain ratio (> 0.85), TXT/CNAME frequency, and Newly Observed Domain age (< 30 days).',
    },
    {
      stepNumber: 4,
      mitreId: 'T1071.004',
      plainTitle: 'DNS RPZ Sinkholing & Mandatory Internal Resolver Egress Enforcement',
      storyAnalogy:
        'Coastguard engineers drop a glowing emerald harbor net directly over the rogue offshore lighthouse so every coded inquiry lands harmlessly in the guardhouse, while sealing every unauthorized seawall gap so no pigeon can bypass the central postmaster.',
      simpleExplanation:
        'Effective DNS tunneling containment pairs two complementary controls: DNS Response Policy Zones (RPZ, often called a DNS firewall, allowing internal resolvers to block or redirect malicious domains to a controlled sinkhole IP in seconds) and strict perimeter egress filtering (blocking workstations from sending direct UDP/TCP port 53, DNS-over-TLS port 853, or unauthorized DNS-over-HTTPS traffic to external resolvers so every lookup must pass through inspected corporate servers).',
      howItWorksInPractice:
        'Upon confirming SIEM-ENTROPY-408, responders push a wildcard RPZ rule (*.cdn-metrics-sync.example -> sinkhole 10.255.255.53) to DNS-INT-01 and DNS-INT-02, instantly severing both outbound data exfiltration and inbound TXT command acknowledgements across the entire fleet. Simultaneously, network engineers verify that workstation VLAN firewalls enforce default-deny on outbound UDP/53, TCP/53, TCP/853 (DoT), and public DoH IP ranges, preventing malware from bypassing internal visibility. Finally, IR teams isolate WKSTN-FIN-14, capture volatile memory from telemetry_sync.exe (PID 6248), and reconstruct exfiltrated file scope from recorded query logs.',
      diagramAlignment:
        'Follow Step #4 / Link #4 as Node 5 (RPZ Sinkhole & FW Lock) seals DNS-INT-01 against Node 3 (Rogue Auth NS) while Node 4 confirms zero direct port 53/853 bypasses.',
      detectionAndEvidence:
        'Verify RPZ sinkhole hits drop to zero post-isolation, audit perimeter firewalls for blocked direct UDP/53/853 attempts, and preserve Zeek dns.log for data-loss reconstruction.',
    },
  ],
};
