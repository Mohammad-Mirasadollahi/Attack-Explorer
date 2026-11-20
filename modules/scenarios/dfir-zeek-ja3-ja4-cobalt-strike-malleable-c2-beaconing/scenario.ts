import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing',
    title: 'Salesforce JA3, FoxIO JA4+ & CISA DFIR — Zeek ssl.log JA3/JA4 Fingerprint & Malleable C2 Jitter Beaconing Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1071.001',
    description:
      'Grounded in Salesforce JA3/JA3S specifications, FoxIO JA4+ Network Fingerprinting documentation, and CISA / Mandiant Cobalt Strike detection guides: network forensic analysts detect a custom Malleable C2 HTTPS beacon by correlating Zeek ssl.log client/server TLS fingerprints (ja3 / ja3s / ja4), X.509 certificate serial anomalies, and conn.log / http.log periodic interval jitter histograms.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Beacon Process (WinInet TLS)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Zeek & Suricata NDR Sensor', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Malleable C2 TeamServer (:443)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Zeek ssl.log & conn.log RITA', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'JA3S / JA4S & X.509 Serial', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: TLS ClientHello Fingerprinting (JA3 & JA4) in Zeek ssl.log',
        narration:
          'When the implant initiates an outbound TLS 1.2/1.3 handshake via WinInet or WinHttp from 10.10.4.15, Zeek inspects the unencrypted TLS ClientHello packet (TLS Version, Cipher Suites, Extensions, Elliptic Curves, and ALPN) and computes the MD5 JA3 hash (72a589da586844d7f0818ce684948eea) and sorted JA4 fingerprint (t13d1516h2_8daaf6152771_b186095e22b6).',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Command and Control (T1071.001 - Application Layer Protocol: Web Protocols)',
        technicalCommands: [
          'Zeek ssl.log Fields: uid, id.orig_h, id.resp_h, version, cipher, server_name, ja3, ja4',
          'JA3 String Format: SSLVersion,Cipher,SSLExtension,EllipticCurve,EllipticCurvePointFormat',
          'JA4 Format: t13d1516h2_8daaf6152771_b186095e22b6 (Resilient to TLS extension randomization)',
        ],
        defenseMitigation:
          'Enable JA3/JA3S and JA4+ plugins in Zeek and Suricata so every TLS handshake is indexed by its cryptographic client/server stack rather than easily spoofed HTTP User-Agent strings.',
        logs: [
          {
            id: 'dfir-ja3-1',
            timestamp: '02:01:00.112',
            source: 'Network',
            severity: 'high',
            EventCode: 443,
            ProcessName: 'rundll32.exe',
            CommandLine: 'Zeek ssl.log ClientHello ja3=72a589da586844d7f0818ce684948eea ja4=t12d190800_d83cc789557e_76e566c31589',
            raw: 'zeek_ssl: ts=1762135260.112 uid=Ch89a1 id.orig_h=10.10.4.15 id.resp_h=198.51.100.200 id.resp_p=443 version="TLSv12" server_name="cdn- telemetry-check.com" ja3="72a589da586844d7f0818ce684948eea" ja4="t12d190800_d83cc789557e_76e566c31589"',
            parsedFields: {
              ZeekLogStream: 'ssl.log',
              ClientJa3Hash: '72a589da586844d7f0818ce684948eea (WinInet Stack without Browser ALPN)',
              ClientJa4Fingerprint: 't12d190800_d83cc789557e_76e566c31589',
              SniServerName: 'cdn-telemetry-check.com',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: ServerHello JA3S Correlation & Java KeyStore X.509 Certificate Anomaly (x509.log)',
        narration:
          'Even when a C2 operator customizes the Malleable C2 HTTP profile, the underlying Java/Netty TLS listener on the TeamServer produces a characteristic ServerHello response (ja3s=fd4bc6cea4877646ccd62f0792ec0b62 when paired with the client JA3) and, if unconfigured, presents a self-signed X.509 certificate logged in Zeek x509.log.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Command and Control (T1573.002 - Encrypted Channel: Asymmetric Cryptography)',
        technicalCommands: [
          'Zeek ssl.log: ja3="72a589da586844d7f0818ce684948eea" + ja3s="fd4bc6cea4877646ccd62f0792ec0b62"',
          'Zeek x509.log: certificate.serial="08BB00EE" (or default 146473198 / 08BB00EE Java KeyStore pattern)',
        ],
        defenseMitigation:
          'Hunt on combined (JA3, JA3S) pairs and (JA4, JA4S) pairs rather than JA3 alone, and correlate with Sysmon EventID 3 (NetworkConnect) on the endpoint to identify the exact initiating binary.',
        logs: [
          {
            id: 'dfir-ja3-2',
            timestamp: '02:01:00.185',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 2028412,
            ProcessName: 'suricata',
            CommandLine: 'Suricata TLS JA3/JA3S Cobalt Strike Malleable C2 Handshake Match',
            raw: 'zeek_ssl_x509: uid=Ch89a1 ja3="72a589da586844d7f0818ce684948eea" ja3s="fd4bc6cea4877646ccd62f0792ec0b62" ja4s="t120200_c02f_5333" cert_serial="08BB00EE" validation_status="self signed certificate"',
            parsedFields: {
              ServerJa3sHash: 'fd4bc6cea4877646ccd62f0792ec0b62 (Java TLS Server Stack)',
              ServerJa4s: 't120200_c02f_5333',
              CertValidationStatus: 'self signed certificate',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Periodic Sleep/Jitter Statistical Histogram Analysis in Zeek conn.log (RITA Beaconing Score)',
        narration:
          'Aggregating 24 hours of Zeek conn.log records between 10.10.4.15 and 198.51.100.200:443 reveals 1,440 connections with inter-arrival delta times uniformly distributed between 48.0s and 72.0s (60-second base sleep with 20% uniform jitter) and identical orig_ip_bytes=342 / resp_ip_bytes=196 heartbeat sizes.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1029 - Scheduled Transfer / Beaconing Jitter Analysis)',
        technicalCommands: [
          'Zeek conn.log Aggregation: count=1440 mean_interval=60.02s min_delta=48.1s max_delta=71.9s (20% Jitter)',
          'Payload Uniformity: orig_ip_bytes=342 (std_dev=0.0) resp_ip_bytes=196 (Empty tasking poll)',
        ],
        defenseMitigation:
          'Run automated time-series beacon scoring (such as RITA or SIEM inter-arrival skewness analysis) over Zeek conn.log and proxy logs to detect uniform sleep-jitter distributions.',
        logs: [
          {
            id: 'dfir-ja3-3',
            timestamp: '02:30:00.000',
            source: 'Network',
            severity: 'critical',
            EventCode: 98,
            ProcessName: 'zeek',
            CommandLine: 'Zeek conn.log time-series analysis: 60s sleep +/- 20% jitter (BeaconScore=0.984)',
            raw: 'zeek_conn_beacon_summary: orig_h=10.10.4.15 resp_h=198.51.100.200 resp_p=443 connections=1440 interval_median=60.0s jitter_pct=20.0% orig_bytes_mode=342 resp_bytes_mode=196 beacon_score=0.984',
            parsedFields: {
              ZeekLogStream: 'conn.log (Time-Series Aggregation)',
              ConfiguredSleepJitter: '60s Sleep / 20% Uniform Jitter (48s - 72s window)',
              BeaconConfidenceScore: '0.984 (High-Confidence Automated C2)',
            },
          },
        ],
      },
    ],
  };
