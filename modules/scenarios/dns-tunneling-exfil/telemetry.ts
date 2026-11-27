import type { TelemetryEvent } from '../types';

export const DNS_TUNNELING_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'dnstun-evt-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.180',
    sourceNodeId: 'wkstn_fin',
    targetNodeId: 'dns_int',
    sourceLabel: 'WKSTN-FIN-14 (PID 6248)',
    targetLabel: 'DNS-INT-01 (UDP/53)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 22 (DnsQuery)',
    shortAction: 'HEX SUBDOMAIN BURST',
    info: 'Sysmon Event ID 22 attributes rapid unique 56-char hex subdomain queries under *.cdn-metrics-sync.example to telemetry_sync.exe (PID 6248)',
    sizeOrCode: '56 Chars',
    severity: 'HIGH',
    mitreId: 'T1071.004',
    explanation:
      'Constrained by IETF RFC 1035 (max 63 octets per label, 253 characters total FQDN), the covert client packs encoded file slices into unique leftmost subdomain labels. Sysmon Event ID 22 maps each high-entropy lookup directly to the originating binary path and PID.',
    rawLog: `Sysmon EventID=22 (DnsQuery) | Computer=WKSTN-FIN-14.corp.example
ProcessId=6248 | Image=C:\\ProgramData\\SyncCache\\telemetry_sync.exe | User=CORP\\m.reynolds
QueryName=4a9f2c8e1b7d3a049c5e21f8b6d04a1e7c9b3d52a8f0e14c6b2d9a01.s14.cdn-metrics-sync.example
QueryStatus=0 | QueryResults=type: 16 "v=ok;seq=042;ack=9f2c"`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Non-Browser Process Generating High-Entropy Long DNS Queries (Sysmon EID 22)',
      ruleCode: `title: Suspicious Long Subdomain DNS Queries From Non-Browser Binary
status: stable
logsource:
  category: dns_query
  product: windows
detection:
  selection:
    EventID: 22
    QueryName|re: '^[a-f0-9]{40,63}\\.'
  filter_browsers:
    Image|endswith:
      - '\\chrome.exe'
      - '\\msedge.exe'
      - '\\firefox.exe'
  condition: selection and not filter_browsers
level: high`,
      mitigation:
        'Enable Sysmon Event ID 22 fleet-wide and baseline process-to-domain lookup profiles on segmented finance and server VLANs.',
    },
  },
  {
    id: 'dnstun-evt-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:02.412',
    sourceNodeId: 'dns_int',
    targetNodeId: 'ext_ns',
    sourceLabel: 'DNS-INT-01 (10.10.2.53)',
    targetLabel: 'Rogue Auth NS (198.51.100.77)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'Zeek dns.log (TXT · TTL=0)',
    shortAction: 'UNCACHED NS RELAY',
    info: 'Internal resolver DNS-INT-01 forwards unique uncached TXT queries across the perimeter to ns1.cdn-metrics-sync.example receiving TTL=0 encoded replies',
    sizeOrCode: 'TTL=0.0',
    severity: 'CRITICAL',
    mitreId: 'T1048.003',
    explanation:
      'Because every subdomain label is unique and the external authoritative name server responds with TTL=0.0, DNS-INT-01 cannot cache lookups and unintentionally acts as a bidirectional exfiltration and command relay across a segmented perimeter.',
    rawLog: `# Zeek dns.log (Recursive -> External Authoritative NS)
id.orig_h=10.10.2.53 (DNS-INT-01) -> id.resp_h=198.51.100.77:53 (UDP)
qtype_name=TXT | rcode_name=NOERROR | TTLs=[0.0]
query=7e3d19a4c5b20f8e1a6c4d92b0e57f13a8c4e29d1b6f0a5c8d3e14.s14.cdn-metrics-sync.example
answers=["v=ok;seq=043;cmd=c3RhZ2VfY2h1bmtfNDQ="]`,
    detectionRule: {
      type: 'SURICATA',
      title: 'Excessive Long Subdomain DNS TXT Queries to External Authoritative NS',
      ruleCode: `alert dns $HOME_NET any -> $EXTERNAL_NET 53 (msg:"DFIR Potential Covert DNS Tunneling Long TXT Subdomain"; dns.query; content:"."; pcre:"/^[a-z0-9]{42,63}\\./i"; sid:2048102; rev:2;)`,
      mitigation:
        'Monitor recursive-to-authoritative resolver egress with Zeek dns.log and flag repeated TTL=0 TXT/CNAME exchanges toward newly observed domains.',
    },
  },
  {
    id: 'dnstun-evt-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:45.905',
    sourceNodeId: 'ext_ns',
    targetNodeId: 'zeek_soc',
    sourceLabel: 'Zeek Passive DNS Analytics',
    targetLabel: 'SIEM-ENTROPY-408',
    sourceType: 'IDS_ALERT',
    protocolOrEventId: 'SIEM Entropy & NOD Rule',
    shortAction: 'ENTROPY 4.41 SPIKE',
    info: 'SOC analytics flag cdn-metrics-sync.example for 4.41 bits/byte Shannon entropy, 412 unique subdomains/min, 99.6% cache misses, and 4-day domain age',
    sizeOrCode: '184 KB',
    severity: 'CRITICAL',
    mitreId: 'T1071.004',
    explanation:
      'Pairing five statistical features—Shannon entropy (> 3.9), long leftmost labels (> 38 chars), > 85% cache-miss ratio, high TXT proportion, and Newly Observed Domain age (< 30 days)—unmasks covert tunnels regardless of encoding while eliminating CDN false positives.',
    rawLog: `Alert=DNS_TUNNELING_HIGH_ENTROPY_EXFIL | Rule=SIEM-ENTROPY-408
ApexDomain=cdn-metrics-sync.example (Newly Observed Domain: 4 days)
SourceHost=WKSTN-FIN-14 (10.10.44.14) | Process=telemetry_sync.exe (PID 6248)
UniqueSubdomains_60s=412 (CacheHitRatio=0.4%) | AvgLeftLabel=56 chars
ShannonEntropy=4.41 bits/byte | RecordTypes=TXT(78%), CNAME(22%) | EstExfil=184 KB`,
    detectionRule: {
      type: 'KQL',
      title: 'Detect High-Volume Unique Subdomain DNS Tunneling by Apex Domain',
      ruleCode: `DnsEvents
| where QueryType in ("TXT", "CNAME", "NULL", "A")
| extend Apex = extract(@"([^\\.]+\\.[^\\.]+)$", 1, Name), LeftLabel = tostring(split(Name, ".")[0])
| summarize UniqueQueries=dcount(Name), AvgLabelLen=avg(strlen(LeftLabel)) by ClientIP, Apex
| where UniqueQueries > 150 and AvgLabelLen > 38`,
      mitigation:
        'Correlate passive DNS entropy scoring with Newly Observed Domain (NOD) threat feeds and Sysmon Event ID 22 for zero-ambiguity P1 alerting.',
    },
  },
  {
    id: 'dnstun-evt-4',
    no: 4,
    stageIndex: 4,
    timestamp: '01:15.044',
    sourceNodeId: 'zeek_soc',
    targetNodeId: 'rpz_sinkhole',
    sourceLabel: 'DNS-INT-01 RPZ & Firewall',
    targetLabel: 'Sinkhole 10.255.255.53',
    sourceType: 'NETWORK',
    protocolOrEventId: 'RPZ Sinkhole + Port 53/853 Lock',
    shortAction: 'RPZ SINKHOLE DROP',
    info: 'Defenders sinkhole *.cdn-metrics-sync.example via DNS RPZ to 10.255.255.53, deny direct workstation UDP/53, TCP/53 & DoT/DoH, and isolate WKSTN-FIN-14',
    sizeOrCode: 'BLOCKED',
    severity: 'INFO',
    mitreId: 'T1071.004',
    explanation:
      'DNS Response Policy Zones (RPZ) sever both exfiltration and TXT C2 polling across the entire enterprise in milliseconds, while blocking direct workstation port 53/853 and public DoH prevents malware from bypassing corporate resolvers.',
    rawLog: `Action=RPZ_SINKHOLE_ENFORCED | Zone=rpz.threat-intel.corp
Rule=*.cdn-metrics-sync.example -> A 10.255.255.53 (Local Sinkhole)
FirewallPolicy=DENY outbound UDP/53, TCP/53, TCP/853 & Public DoH from Workstation VLANs
EndpointContainment=WKSTN-FIN-14 isolated; telemetry_sync.exe (PID 6248) quarantined`,
    detectionRule: {
      type: 'KQL',
      title: 'Monitor RPZ Sinkhole Hits & Unauthorized Direct Outbound Port 53/853 Attempts',
      ruleCode: `CommonSecurityLog
| where DestinationPort in (53, 853) and SourceIP !in ("10.10.2.53", "10.10.2.54")
| summarize BlockedAttempts=count() by SourceIP, DestinationIP, DestinationPort, DeviceAction`,
      mitigation:
        'Enforce mandatory internal DNS resolver mediation, deploy RPZ threat feeds (including Newly Observed Domains), and capture volatile memory on isolated hosts.',
    },
  },
];
