import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'dns-tunneling-exfil',
    briefing: {
      headline: 'Scenario Briefing: DNS Tunneling & Data Exfiltration (MITRE T1071.004 / T1048.003)',
      storyAnalogy:
        'Imagine a locked-down prison facility where inmates are forbidden from mailing letters or making outside phone calls, but they are allowed to ask the prison operator: "What is the phone number for [Company Name]?" The operator is required to call the outside directory to check. So the inmate asks: "What is the phone number for Secret-Blueprint-Page1-4a6f686e.evil-c2.net?" The prison operator faithfully reads that exact secret message out loud to the accomplice waiting at the evil-c2.net directory desk.',
      plainSummary:
        'Even in tightly locked-down networks where isolated servers cannot browse external websites directly (blocked by Egress Firewall dropping TCP 80/443), internal hosts still resolve domain names through an internal corporate DNS resolver. In this scenario (MITRE T1071.004 & T1048.003), the exfiltration implant sync_agent.exe (PID 4412, PPID 1900 under CORP\\svc_backup) on isolated database backup host DB-BACKUP-02 (10.50.1.12) reads C:\\Backups\\customers_pii.csv, splits it into 48-byte chunks, hex-encodes each chunk into a high-entropy subdomain (<seq>.<hex_data>.c2.badactor-dns.net), and sends UDP/53 DNS TXT queries to the Internal DNS Resolver (10.50.1.53). Experiencing a 100% cache miss rate, 10.50.1.53 recursively forwards every query across the firewall to the attacker’s authoritative Name Server (ns1.badactor-dns.net at 45.133.1.99:53), which reassembles customers_pii.csv and replies with C2 commands inside DNS TXT records (TTL=0).',
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
          'While the Egress Firewall blocks direct outbound connections from DB-BACKUP-02 (10.50.1.12), it permits outbound UDP/53 recursive queries originating from the corporate DNS server (10.50.1.53, which receives back the authoritative TXT answer "ACK:001:NEXT" with TTL = 0.000000 and records the 164-byte exchange in Zeek dns.log).',
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
          'This completes a bidirectional covert channel over UDP/53: outbound data exfiltration rides inside the DNS query subdomain labels (QNAME), while inbound acknowledgments and C2 tasking (the 188-byte TXT "ACK:001:CMD:SLEEP_60" response with rcode = 0 NOERROR and TTL = 0) ride back inside the DNS TXT answer record to pace the implant’s exfiltration loop.',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) returns the DNS TXT response (TXT ACK:001:CMD:SLEEP_60, 188 B, TTL=0) from Node ① (ns1.badactor-dns.net 45.133.1.99:53) to Node ② (Internal DNS Resolver 10.50.1.53) and back to Node ③/④ (DB-BACKUP-02), while Node ⑥ (SIEM) triggers the critical DNS C2 alert.',
        detectionAndEvidence:
          'Documented in Sigma & Suricata DNS rules: 188-byte DNS TXT response with TTL = 0.000000 carrying "TXT ACK:001:CMD:SLEEP_60" from 45.133.1.99:53 through 10.50.1.53 to DB-BACKUP-02 (10.50.1.12).',
      },
    ],
  };
