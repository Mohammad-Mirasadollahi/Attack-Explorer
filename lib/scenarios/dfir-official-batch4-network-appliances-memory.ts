import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS: LegacyDraftScenario[] = [
  {
    id: 'dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing',
    title: 'Salesforce JA3, FoxIO JA4+ & CISA DFIR — Zeek ssl.log JA3/JA4 Fingerprint & Malleable C2 Jitter Beaconing Forensics',
    category: 'LOG_ANALYSIS',
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
  },
  {
    id: 'dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell',
    title: 'Microsoft Exchange/IIS IR, ESET & Unit 42 DFIR — IIS HTTP.sys Kernel URI Registration & In-Memory Module Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1505.004',
    description:
      'Grounded in Microsoft Incident Response IIS Module guidance, ESET IIS malware research, and Unit 42 HTTP.sys analysis: a fileless .NET implant or native IIS module registers a rogue HTTP listener directly inside the Windows kernel driver HTTP.sys (bypassing IIS W3C disk webroots) or hooks IHttpModule inside w3wp.exe—detectable via Microsoft-Windows-HttpService/Operational EventID 113, netsh http show servicestate, appcmd list modules, and Sysmon EventID 7.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Operator (:443)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'HTTP.sys Kernel Driver', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'w3wp.exe (IIS Worker Pool)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'HttpService EID 113 & netsh', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'applicationHost.config & GAC', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Native/Managed IIS Module Registration in applicationHost.config (Sysmon EventID 7 & 11)',
        narration:
          'To intercept every incoming HTTP request to the server without dropping an .aspx file into C:\\inetpub\\wwwroot\\, the actor registers a malicious native or .NET IHttpModule inside C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config (or via VirtualPathProvider in w3wp.exe RAM). Sysmon EventID 7 logs w3wp.exe loading the anomalous DLL.',
        activeNodes: ['attacker', 'target', 'ad'],
        mitreTactic: 'Persistence (T1505.004 - Server Software Component: IIS Components)',
        technicalCommands: [
          'C:\\Windows\\System32\\inetsrv\\appcmd.exe list modules',
          'Config Path: C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config (<globalModules> / <modules>)',
          'Sysmon EventID 7: Image=C:\\Windows\\System32\\inetsrv\\w3wp.exe ImageLoaded=C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll',
        ],
        defenseMitigation:
          'Audit C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config and web.config files with File Integrity Monitoring and verify the digital signature of every DLL loaded by w3wp.exe.',
        logs: [
          {
            id: 'dfir-iis-1',
            timestamp: '04:12:08.110',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'w3wp.exe',
            CommandLine: 'w3wp.exe -ap "DefaultAppPool" loading unsigned IIS module DiagnosticsCompression.dll',
            raw: 'EventID: 7 | Image: C:\\Windows\\System32\\inetsrv\\w3wp.exe | ImageLoaded: C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll | Signed: false | ConfigEntry: applicationHost.config <add name="DiagCompModule" />',
            parsedFields: {
              HostProcess: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe',
              LoadedIisModule: 'C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll',
              IisConfigFile: 'C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config',
              MitreTechnique: 'T1505.004 (IIS Components)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Kernel-Mode HTTP.sys URI UrlGroup Registration (HttpService/Operational EventID 113)',
        narration:
          'Alternatively, a post-exploitation implant calls HttpAddUrlToUrlGroup (httpapi.dll) to register a dedicated URI prefix (https://+:443/owa/auth/Current/themes/health/) directly in the kernel HTTP.sys driver. Because HTTP.sys routes matching requests directly to the implant process queue before IIS sees them, requests never appear in IIS W3C logs—but Microsoft-Windows-HttpService/Operational EventID 113 logs the exact URI and owning ProcessId.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1505.004 - HTTP.sys Kernel Request Queue Hijacking)',
        technicalCommands: [
          'Win32 API: httpapi.dll!HttpAddUrlToUrlGroup(UrlGroupId, L"https://+:443/owa/auth/Current/themes/health/", ...)',
          'LogChannel: Microsoft-Windows-HttpService/Operational EventID 113 (Added URL to URL group)',
        ],
        defenseMitigation:
          'Enable Microsoft-Windows-HttpService/Operational logging on all internet-facing Windows/IIS/Exchange servers and alert on EventID 113 (Added URL to URL group) by non-IIS processes.',
        logs: [
          {
            id: 'dfir-iis-2',
            timestamp: '04:12:14.520',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 113,
            ProcessName: 'dllhost.exe',
            CommandLine: 'HttpAddUrlToUrlGroup https://+:443/owa/auth/Current/themes/health/ (PID 6104)',
            raw: 'LogName: Microsoft-Windows-HttpService/Operational | EventID: 113 | UrlGroupId: 0xFE00000120000004 | Url: https://+:443/owa/auth/Current/themes/health/ | ProcessId: 6104 | Executable: C:\\Windows\\System32\\dllhost.exe',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-HttpService/Operational',
              EventID: '113 (Added URL to HTTP.sys URL Group)',
              RegisteredKernelUri: 'https://+:443/owa/auth/Current/themes/health/',
              OwningProcess: 'dllhost.exe (PID 6104 - Bypasses IIS W3C Logs)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Live Triage via netsh http show servicestate & .NET CLR AppDomain Inspection',
        narration:
          'During live DFIR triage, the responder executes netsh http show servicestate view=requestq verbose=yes, which enumerates every active HTTP.sys kernel request queue, Registered URLs, and the exact owning Process IDs (exposing PID 6104 alongside legitimate w3wp.exe PIDs).',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1505.004 - netsh http show servicestate Kernel Queue Inspection)',
        technicalCommands: [
          'netsh http show servicestate view=requestq verbose=yes',
          'Get-WebGlobalModule; Get-ChildItem IIS:\\AppPools',
          'Inspects Registered URLs -> Process IDs mapping inside kernel HTTP.sys',
        ],
        defenseMitigation:
          'Include netsh http show servicestate and appcmd list modules in all Windows web server DFIR triage scripts.',
        logs: [
          {
            id: 'dfir-iis-3',
            timestamp: '04:20:00.100',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'netsh.exe',
            CommandLine: 'netsh http show servicestate view=requestq verbose=yes',
            raw: 'NETSH_HTTP_SERVICESTATE: RequestQueueName="UnnamedQueue" ProcessIDs="6104 (dllhost.exe)" RegisteredURLs="https://+:443/owa/auth/Current/themes/health/" | Anomaly="Non-IIS process owning HTTPS :443 kernel URL route"',
            parsedFields: {
              TriageCommand: 'netsh http show servicestate view=requestq verbose=yes',
              RogueProcessId: '6104 (C:\\Windows\\System32\\dllhost.exe)',
              InterceptedUrlPrefix: 'https://+:443/owa/auth/Current/themes/health/',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-exchange-ews-autodiscover-proxylogon-iis-forensics',
    title: 'Microsoft MSTIC, Volexity & CISA ED 21-02 DFIR — Exchange HttpProxy, MSExchange Management & OAB Webshell Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1190',
    description:
      'Grounded in Microsoft Threat Intelligence (MSTIC) Hafnium / ProxyLogon forensic guidance, Volexity Exchange exploitation research, and CISA Emergency Directive 21-02: an investigator correlates three Exchange-specific log sources: (1) V15\\Logging\\HttpProxy\\Autodiscover\\*.LOG showing SSRF backend cookie routing (ServerInfo~a]@), (2) the MSExchange Management event log (EventID 1) showing Set-OabVirtualDirectory or New-MailboxExportRequest with an embedded ASPX webshell in ExternalUrl/FilePath, and (3) Sysmon EventID 1 showing w3wp.exe (MSExchangeOWAAppPool) spawning cmd.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Client (:443)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Exchange Frontend HttpProxy', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Exchange Backend EWS / ECP', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'HttpProxy & MSExchange Mgmt', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'OAB ExternalUrl & w3wp.exe', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Exchange Frontend HttpProxy Log Analysis (V15\\Logging\\HttpProxy\\*\\*.LOG)',
        narration:
          'When an external request manipulates the X-BEResource or X-AnonResource-Backend cookie to proxy an unauthenticated Frontend request directly to the Exchange Backend (:444) /ecp/ or /ews/exchange.asmx endpoint, Exchange records the exact AnchorMailbox, TargetServer, and RoutingHint inside C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Logging\\HttpProxy\\Ecp\\ and Autodiscover\\ CSV logs.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application: Exchange HttpProxy SSRF)',
        technicalCommands: [
          'Log Path: C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Logging\\HttpProxy\\Autodiscover\\*.LOG',
          'CSV Columns: DateTime,RequestId,ClientIpAddress,UrlHost,UrlStem,RoutingHint,AnchorMailbox,HttpStatus',
          'Indicator: RoutingHint="X-BEResource-Cookie" AnchorMailbox="ServerInfo~a]@EXCH01.corp.local:444/ecp/DDI/DDIService.svc/..."',
        ],
        defenseMitigation:
          'Ingest Exchange V15\\Logging\\HttpProxy\\*\\*.LOG and V15\\Logging\\CmdletInfra\\*\\*_Cmdlet_*.log into the SIEM alongside standard IIS W3C logs.',
        logs: [
          {
            id: 'dfir-exch-1',
            timestamp: '01:04:12.115',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'w3wp.exe',
            CommandLine: 'Exchange HttpProxy Log: AnchorMailbox=ServerInfo~a]@EXCH01.corp.local:444/ecp/DDI/DDIService.svc',
            raw: 'exch_httpproxy_log: DateTime=2026-11-03T01:04:12.115Z ClientIp=198.51.100.112 UrlStem=/ecp/y.js RoutingHint=X-BEResource-Cookie AnchorMailbox="ServerInfo~EXCH01.corp.local/owa/auth.owa?~1942062522" BackEndStatus=200',
            parsedFields: {
              ForensicLogDir: 'V15\\Logging\\HttpProxy\\Ecp\\*.LOG',
              ClientIpAddress: '198.51.100.112',
              AnchorMailboxAnomaly: 'ServerInfo~EXCH01.corp.local:444/ecp/DDI/DDIService.svc',
              BackEndHttpStatus: '200 OK',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Exchange Management Log (MSExchange Management EventID 1) Set-OabVirtualDirectory & New-MailboxExportRequest',
        narration:
          'Using the proxied backend session, the actor invokes the Exchange Management cmdlet Set-OabVirtualDirectory (injecting JScript webshell code into the ExternalUrl property) followed by ResetOABVirtualDirectory (or New-MailboxExportRequest -FilePath "\\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx") to write the configuration to disk. The Windows Event Log channel "MSExchange Management" records EventID 1 with every cmdlet parameter.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.003 - Server Software Component: Web Shell via Exchange Cmdlet)',
        technicalCommands: [
          'Event Log Channel: "MSExchange Management" EventID 1 (Cmdlet Execution)',
          'Cmdlet 1: Set-OabVirtualDirectory -Identity "EXCH01\\OAB (Default Web Site)" -ExternalUrl "http://f/#..."',
          'Cmdlet 2: New-MailboxExportRequest -Mailbox admin@corp.local -FilePath "\\\\localhost\\c$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx"',
        ],
        defenseMitigation:
          'Monitor the "MSExchange Management" event log (EventID 1) and V15\\Logging\\ECP\\Server\\*.LOG for Set-OabVirtualDirectory containing script tags or New-MailboxExportRequest writing to .aspx/.ashx extensions.',
        logs: [
          {
            id: 'dfir-exch-2',
            timestamp: '01:04:18.640',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'MSExchange Management EID 1: New-MailboxExportRequest -FilePath \\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx',
            raw: 'LogName: MSExchange Management | Source: MSExchange CmdletLogs | EventID: 1 | Cmdlet: New-MailboxExportRequest | Parameters: {-Mailbox "admin@corp.local", -FilePath "\\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx"} | Caller: corp.local/Users/Administrator',
            parsedFields: {
              LogChannel: 'MSExchange Management (EventID 1)',
              ExecutedCmdlet: 'New-MailboxExportRequest / Set-OabVirtualDirectory',
              TargetFilePath: '\\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: ASP.NET Dynamic Compilation (Temporary ASP.NET Files) & w3wp.exe Child Shell (Sysmon EventID 1 & 11)',
        narration:
          'When the external actor requests POST /aspnet_client/supp.aspx, IIS w3wp.exe compiles the page via csc.exe into C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\*\\App_Web_*.dll (persisting even if supp.aspx is later deleted from inetpub) and spawns cmd.exe under w3wp.exe (-ap "MSExchangeOWAAppPool") as NT AUTHORITY\\SYSTEM.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1505.003 - Temporary ASP.NET Files Artifact & w3wp.exe Child Shell)',
        technicalCommands: [
          'Sysmon EventID 11: C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\...\\App_Web_supp.aspx.cdcab7d2.dll',
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe (-ap "MSExchangeOWAAppPool") -> Image=C:\\Windows\\System32\\cmd.exe',
        ],
        defenseMitigation:
          'Always inspect C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\ during IIS/Exchange DFIR triage to recover compiled webshell assemblies (App_Web_*.dll) even after the attacker deletes the source .aspx file.',
        logs: [
          {
            id: 'dfir-exch-3',
            timestamp: '01:04:25.910',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'w3wp.exe -ap "MSExchangeOWAAppPool" spawning cmd.exe /c whoami',
            raw: 'EventID: 1 | User: NT AUTHORITY\\SYSTEM | ParentImage: C:\\Windows\\System32\\inetsrv\\w3wp.exe | ParentCommandLine: c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "MSExchangeOWAAppPool" | Image: C:\\Windows\\System32\\cmd.exe | CompiledArtifact: App_Web_supp.aspx.cdcab7d2.dll',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate) + 11 (Temporary ASP.NET DLL)',
              ParentAppPool: 'w3wp.exe -ap "MSExchangeOWAAppPool" (SYSTEM)',
              CompiledAssemblyArtifact: 'Temporary ASP.NET Files\\...\\App_Web_supp.aspx.cdcab7d2.dll',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace',
    title: 'Microsoft SQL Server Security & Mandiant DFIR — MSSQL xp_cmdshell / Ole Automation Reconfiguration (EventID 15457) & sqlservr.exe Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1505.001',
    description:
      'Grounded in Microsoft SQL Server Security & Error Log documentation, Mandiant database intrusion forensics, and MITRE ATT&CK T1505.001 / T1059.003: an attacker authenticates to Microsoft SQL Server (TCP 1433) or exploits SQL injection, runs sp_configure to enable "xp_cmdshell" or "Ole Automation Procedures" (generating Windows Application EventID 15457 and SQL ERRORLOG entries), and executes OS commands that spawn cmd.exe under sqlservr.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'TDS Client (:1433 SQL)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Tabular Data Stream (TDS)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'sqlservr.exe (MSSQLSERVER)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Application EID 15457 & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'xplog70.dll / odsole70.dll', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: sp_configure Reconfiguration of show advanced options & xp_cmdshell (Application EventID 15457)',
        narration:
          'Because xp_cmdshell and Ole Automation Procedures are disabled by default (value 0), the attacker executes sp_configure "show advanced options", 1; RECONFIGURE; followed by sp_configure "xp_cmdshell", 1; RECONFIGURE;. SQL Server immediately writes EventID 15457 (Source: MSSQLSERVER) to the Windows Application Event Log and the SQL Server ERRORLOG ("Configuration option \'xp_cmdshell\' changed from 0 to 1").',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Execution (T1059.003 - MSSQL sp_configure Option Reconfiguration)',
        technicalCommands: [
          'T-SQL: EXEC sp_configure \'show advanced options\', 1; RECONFIGURE; EXEC sp_configure \'xp_cmdshell\', 1; RECONFIGURE;',
          'Application EventID 15457 (MSSQLSERVER): Configuration option \'xp_cmdshell\' changed from 0 to 1.',
        ],
        defenseMitigation:
          'Forward Windows Application EventLog EventID 15457 (Source: MSSQLSERVER) to the SIEM and alert whenever xp_cmdshell, Ole Automation Procedures, or clr enabled changes from 0 to 1.',
        logs: [
          {
            id: 'dfir-mssql-1',
            timestamp: '13:40:02.110',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 15457,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'MSSQLSERVER EventID 15457: Configuration option xp_cmdshell changed from 0 to 1',
            raw: 'LogName: Application | Source: MSSQLSERVER | EventID: 15457 | Level: Information | Description: Configuration option \'xp_cmdshell\' changed from 0 to 1. Run the RECONFIGURE statement to install.',
            parsedFields: {
              LogChannel: 'Application (Source: MSSQLSERVER) & SQL ERRORLOG',
              EventID: '15457 (Configuration Option Changed)',
              ConfigurationOption: 'xp_cmdshell (0 -> 1)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: xplog70.dll / odsole70.dll Module Load & sqlservr.exe Child Shell Execution (Sysmon EventID 1 & 7)',
        narration:
          'When the attacker invokes EXEC master..xp_cmdshell (or sp_OACreate "WScript.Shell"), sqlservr.exe loads C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll, Sysmon EventID 7) and spawns cmd.exe /c ... under the SQL Server service account (NT Service\\MSSQLSERVER, Sysmon EventID 1).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.003 - sqlservr.exe -> cmd.exe Parent-Child Anomaly)',
        technicalCommands: [
          'Sysmon EventID 7: Image=sqlservr.exe ImageLoaded=...\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll)',
          'Sysmon EventID 1: ParentImage=C:\\Program Files\\Microsoft SQL Server\\...\\sqlservr.exe -> Image=C:\\Windows\\System32\\cmd.exe',
        ],
        defenseMitigation:
          'Run SQL Server under a least-privilege Managed Service Account (gMSA) rather than LocalSystem/Domain Admin, and alert on any child process (cmd.exe, powershell.exe) spawned by sqlservr.exe.',
        logs: [
          {
            id: 'dfir-mssql-2',
            timestamp: '13:40:05.480',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'cmd.exe /c "whoami /all & net group \"Domain Admins\" /domain"',
            raw: 'EventID: 1 | User: NT SERVICE\\MSSQLSERVER | ParentImage: C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\sqlservr.exe | Image: C:\\Windows\\System32\\cmd.exe | Correlated EventID 7: ImageLoaded=xplog70.dll',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate) + 7 (ImageLoaded xplog70.dll)',
              ParentImage: 'sqlservr.exe',
              ChildImage: 'C:\\Windows\\System32\\cmd.exe',
              ServiceAccount: 'NT SERVICE\\MSSQLSERVER (Holds SeImpersonatePrivilege)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: CLR Stored Procedure Persistence (sys.assemblies) & Default Trace (.trc) Forensics',
        narration:
          'Even if the attacker sets xp_cmdshell back to 0 (generating another EventID 15457 from 1 to 0) and registers a malicious .NET CLR assembly via CREATE ASSEMBLY ... WITH PERMISSION_SET = UNSAFE, SQL Server’s built-in Default Trace (C:\\Program Files\\Microsoft SQL Server\\...\\MSSQL\\Log\\log_*.trc) and sys.assemblies / sys.assembly_files catalog views preserve the exact DDL timestamp, login name, client hostname, and raw PE bytes of the assembly.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.001 - Server Software Component: SQL Stored Procedures)',
        technicalCommands: [
          'T-SQL Forensics: SELECT name, permission_set_desc, create_date FROM sys.assemblies WHERE is_user_defined = 1;',
          'Default Trace Query: SELECT TextData, LoginName, HostName, StartTime FROM sys.fn_trace_gettable(\'C:\\...\\log.trc\', DEFAULT);',
        ],
        defenseMitigation:
          'Query sys.assemblies and sys.fn_trace_gettable on the SQL Server Default Trace (.trc) during database DFIR investigations to recover schema/configuration changes and extract malicious CLR assemblies.',
        logs: [
          {
            id: 'dfir-mssql-3',
            timestamp: '13:40:12.900',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 15457,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'SQL Default Trace (.trc): CREATE ASSEMBLY [SqlShellHelper] WITH PERMISSION_SET = UNSAFE',
            raw: 'MSSQL_DEFAULT_TRACE: EventClass=116 (Audit DBCC/sp_configure) LoginName="sa" HostName="WKS-09" ApplicationName=".Net SqlClient Data Provider" TextData="CREATE ASSEMBLY [SqlShellHelper] FROM 0x4D5A9000... WITH PERMISSION_SET = UNSAFE"',
            parsedFields: {
              ForensicArtifact: 'SQL Server Default Trace (MSSQL\\Log\\log_*.trc) & sys.assembly_files',
              PersistenceMechanism: 'User-Defined CLR Assembly (PERMISSION_SET = UNSAFE)',
              RecoverableBinary: 'SELECT content FROM sys.assembly_files (Starts with 0x4D5A MZ header)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-postgresql-copy-from-program-pg-log-auditd-trace',
    title: 'PostgreSQL Security & SigmaHQ DFIR — PostgreSQL COPY FROM PROGRAM & Large Object (pg_largeobject) Execution Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1190',
    description:
      'Grounded in official PostgreSQL Security Documentation (CVE-2019-9193 / pg_execute_server_program role privilege), Rapid7 research, and SigmaHQ detection rules: an attacker with superuser or pg_execute_server_program credentials invokes COPY ... FROM PROGRAM (or writes an ELF shared object via lo_import/lo_export in pg_largeobject and loads it via CREATE FUNCTION ... AS), leaving forensic artifacts in postgresql.log, pg_stat_activity, and Linux auditd (postgres spawning /bin/sh -c).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'PostgreSQL Wire Client (:5432)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'libpq / pg_hba.conf Auth', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'postgres Backend Process', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'postgresql.log & Linux auditd', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'popen("/bin/sh -c") Child', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Privileged Role Authentication & pg_execute_server_program Check in postgresql.log',
        narration:
          'The actor authenticates to TCP 5432 as the postgres superuser (or a role granted pg_execute_server_program) due to a permissive trust/md5 entry in pg_hba.conf or leaked connection string. With log_connections=on, postgresql.log records the remote IP, port, database role, and authentication method.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1078 - Valid Accounts: PostgreSQL Superuser Role)',
        technicalCommands: [
          'postgresql.conf: log_connections = on, log_disconnections = on, log_statement = \'ddl\'',
          'postgresql.log: connection authorized: user=postgres database=template1 application_name=psql',
        ],
        defenseMitigation:
          'Enforce scram-sha-256 + clientcert authentication in pg_hba.conf, never grant superuser or pg_execute_server_program to application roles, and enable pgaudit (pgaudit.log = \'write, ddl, role, misc\').',
        logs: [
          {
            id: 'dfir-pg-1',
            timestamp: '06:04:11.102',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 5432,
            ProcessName: 'postgres',
            CommandLine: 'postgres: postgres template1 10.10.4.29(49182) authentication',
            raw: '2026-11-03 06:04:11.102 UTC [7412] LOG:  connection received: host=10.10.4.29 port=49182 | 2026-11-03 06:04:11.118 UTC [7412] LOG:  connection authorized: user=postgres database=template1 SSL enabled (protocol=TLSv1.3)',
            parsedFields: {
              LogFile: '/var/lib/pgsql/16/data/log/postgresql-Mon.log',
              BackendPid: '7412',
              DatabaseUser: 'postgres (Superuser / pg_execute_server_program)',
              ClientIp: '10.10.4.29',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: COPY ... FROM PROGRAM OS Command Execution & Linux auditd /bin/sh Child Trace',
        narration:
          'The actor executes COPY cmd_exec FROM PROGRAM \'id; uname -a\' (introduced in PostgreSQL 9.3, tracked under CVE-2019-9193 as a feature design risk). Internally, the postgres backend process (PID 7412, running as uid=26(postgres)) invokes popen(), which spawns /bin/sh -c—immediately captured by Linux auditd execve rules where ppid belongs to /usr/pgsql-16/bin/postgres.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Unix Shell Spawned by postgres Backend)',
        technicalCommands: [
          'SQL Statement: CREATE TEMP TABLE cmd_out(t text); COPY cmd_out FROM PROGRAM \'id; hostname\';',
          'Linux auditd SYSCALL: syscall=59 (execve) ppid=7412 (postgres) uid=26 (postgres) exe="/usr/bin/bash"',
        ],
        defenseMitigation:
          'Alert on any Linux auditd execve (syscall 59) event where the parent process is postgres / postmaster and the child executable is /bin/sh, /bin/bash, curl, wget, or python.',
        logs: [
          {
            id: 'dfir-pg-2',
            timestamp: '06:04:15.512',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'postgres',
            CommandLine: 'sh -c id; hostname (Spawned by postgres PID 7412 via COPY FROM PROGRAM)',
            raw: 'type=SYSCALL msg=audit(1762149855.512:7104): arch=c000003e syscall=59 (execve) success=yes ppid=7412 pid=7419 uid=26 euid=26 comm="sh" exe="/usr/bin/bash" | pgaudit_log: AUDIT: SESSION,1,1,MISC,COPY,,,COPY cmd_out FROM PROGRAM \'id; hostname\'',
            parsedFields: {
              AuditSource: 'Linux auditd + PostgreSQL pgaudit Extension',
              ParentProcess: '/usr/pgsql-16/bin/postgres (PID 7412, uid=26)',
              SpawnedChild: '/bin/sh -c id; hostname',
              SqlFeatureAbused: 'COPY ... FROM PROGRAM (CVE-2019-9193 Context)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Large Object (pg_largeobject / lo_export) Shared Library Drop & Dynamic C Function Load',
        narration:
          'Alternatively, if COPY FROM PROGRAM is monitored, an attacker chunks an ELF shared library (.so with PG_MODULE_MAGIC) into the pg_largeobject catalog table via lo_from_bytea / lo_put, exports it to /tmp/pg_ext.so via SELECT lo_export(loid, \'/tmp/pg_ext.so\'), and loads it into the postgres process space via CREATE OR REPLACE FUNCTION sys_eval(text) RETURNS text AS \'/tmp/pg_ext.so\' LANGUAGE C STRICT.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.001 - PostgreSQL C-Language Dynamic Function Extension)',
        technicalCommands: [
          'SQL Forensics: SELECT loid, pageno, encode(data, \'hex\') FROM pg_largeobject;',
          'Catalog Forensics: SELECT proname, prosrc, probin FROM pg_proc WHERE prolang = (SELECT oid FROM pg_language WHERE lanname = \'c\') AND probin NOT LIKE \'$libdir/%\';',
        ],
        defenseMitigation:
          'Audit pg_proc for any C-language function whose probin path points outside $libdir (such as /tmp/ or /var/lib/pgsql/) and inspect pg_largeobject for unexpected ELF (7f 45 4c 46) or PE (4d 5a) headers.',
        logs: [
          {
            id: 'dfir-pg-3',
            timestamp: '06:04:22.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'postgres',
            CommandLine: 'pg_proc C-Language function load: probin=/tmp/pg_ext.so (PG_MODULE_MAGIC)',
            raw: 'pgaudit_ddl: AUDIT: SESSION,2,1,DDL,CREATE FUNCTION,FUNCTION,public.sys_eval,"CREATE OR REPLACE FUNCTION sys_eval(text) RETURNS text AS \'/tmp/pg_ext.so\', \'sys_eval\' LANGUAGE C STRICT;" | pg_largeobject loid=16492 magic=7f454c46 (ELF)',
            parsedFields: {
              CatalogTable: 'pg_proc (probin="/tmp/pg_ext.so") & pg_largeobject (loid=16492)',
              BinaryMagic: '7F 45 4C 46 (ELF Shared Object with PG_MODULE_MAGIC)',
              MitreTechnique: 'T1505.001 (Database Stored Procedure / C Extension)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-volatility3-malfind-vad-hollowing-kernel-callbacks',
    title: 'Volatility Foundation, SANS FOR526 & Elastic DFIR — Volatility 3 windows.malfind, psscan vs pslist & Kernel Callbacks Memory Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1055',
    description:
      'Grounded in Official Volatility 3 Framework Documentation, SANS FOR526 Advanced Memory Forensics, and Elastic Security Labs memory analysis: a DFIR investigator analyzes a raw RAM capture (memdump.raw) using Volatility 3 plugins: (1) windows.malfind to detect private unbacked VAD regions with PAGE_EXECUTE_READWRITE (VAD_PROTECTION_EXECUTE_READWRITE) containing MZ/PE headers or shellcode prologues, (2) windows.psscan vs windows.pslist to uncover DKOM EPROCESS ActiveProcessLinks unlinking, and (3) windows.callbacks / windows.ssdt to detect kernel rootkit hooks.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Raw RAM Image (memdump.raw)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Volatility 3 DTB & PDB Layer', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'windows.malfind (RWX VADs)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'pslist vs psscan EPROCESS', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'windows.callbacks & vadinfo', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Volatility 3 windows.malfind & windows.vadinfo — Unbacked PAGE_EXECUTE_READWRITE VAD Detection',
        narration:
          'Running vol -f memdump.raw windows.malfind walks the kernel MMVAD (_MMVAD_SHORT / _MMVAD) balanced tree for every process. In svchost.exe (PID 2480), malfind flags a private memory region (PrivateMemory=1, Tag=VadS, Protection=PAGE_EXECUTE_READWRITE) with no backing file object (FileObject=None) whose first bytes contain an MZ / PE header (4D 5A 90 00) and a 64-bit function prologue (48 89 5C 24 08).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1055 - Process Injection: Unbacked RWX VAD Region)',
        technicalCommands: [
          'vol.py -f memdump.raw windows.malfind --pid 2480 --dump',
          'vol.py -f memdump.raw windows.vadinfo --pid 2480',
          'Kernel Structure: _MMVAD_SHORT (VadS) PrivateMemory=1 Protection=PAGE_EXECUTE_READWRITE (0x40)',
        ],
        defenseMitigation:
          'Compare _EPROCESS.SectionObject / VAD mapped file path against _PEB.Ldr loaded module lists using windows.ldrmodules (where InLoad=False, InInit=False, InMem=False indicates reflective injection).',
        logs: [
          {
            id: 'dfir-vol-1',
            timestamp: '10:00:01.100',
            source: 'Memory Scan',
            severity: 'critical',
            EventCode: 64,
            ProcessName: 'svchost.exe',
            CommandLine: 'vol.py -f memdump.raw windows.malfind --pid 2480 (VadS PAGE_EXECUTE_READWRITE)',
            raw: 'volatility3.plugins.windows.malfind: PID=2480 Process="svchost.exe" StartVPN=0x1d400000000 EndVPN=0x1d400042000 Tag="VadS" Protection="PAGE_EXECUTE_READWRITE" CommitCharge=66 PrivateMemory=1 Hexdump="4d 5a 90 00 03 00 00 00" Disasm="48 89 5c 24 08: mov qword ptr [rsp+8], rbx"',
            parsedFields: {
              VolatilityPlugin: 'windows.malfind + windows.ldrmodules',
              TargetProcess: 'svchost.exe (PID 2480)',
              VadTagAndProtection: 'VadS | PrivateMemory=1 | PAGE_EXECUTE_READWRITE',
              InjectedHeaderMagic: '4D 5A 90 00 (Reflectively Mapped PE)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Direct Kernel Object Manipulation (DKOM) Detection — windows.pslist vs windows.psscan',
        narration:
          'To hide a user-mode loader (kworker_win.exe, PID 5912) from Task Manager and Get-Process, a kernel driver unlinks its _EPROCESS structure from the doubly linked Nt!PsActiveProcessHead (ActiveProcessLinks.Flink / Blink). While windows.pslist (which walks ActiveProcessLinks) does not show PID 5912, windows.psscan scans physical memory pool allocations for the "Proc" pool tag and _EPROCESS structures, immediately exposing the unlinked running process.',
        activeNodes: ['firewall', 'siem', 'ad'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit: DKOM EPROCESS ActiveProcessLinks Unlinking)',
        technicalCommands: [
          'vol.py -f memdump.raw windows.pslist  # Walks Nt!PsActiveProcessHead doubly-linked list',
          'vol.py -f memdump.raw windows.psscan  # Scans physical RAM pool headers for _EPROCESS objects',
          'Discrepancy: PID 5912 (kworker_win.exe, Offset 0xffffa80149201080) present in psscan + thrdscan, absent from pslist',
        ],
        defenseMitigation:
          'Always cross-compare windows.pslist against windows.psscan (and windows.thrdproc / ETHREAD scheduling lists, since the Windows kernel scheduler threads must remain linked to execute on a CPU).',
        logs: [
          {
            id: 'dfir-vol-2',
            timestamp: '10:02:15.400',
            source: 'Memory Scan',
            severity: 'critical',
            EventCode: 5912,
            ProcessName: 'kworker_win.exe',
            CommandLine: 'vol.py -f memdump.raw windows.psscan (DKOM Unlinked _EPROCESS at 0xffffa80149201080)',
            raw: 'volatility3.plugins.windows.psscan: PID=5912 PPID=612 ImageFileName="kworker_win.exe" Offset(P)=0xffffa80149201080 Threads=4 ExitTime=N/A InPsList=False Anomaly="DKOM Unlinked from ActiveProcessLinks"',
            parsedFields: {
              VolatilityPlugin: 'windows.psscan vs windows.pslist Cross-View Diff',
              HiddenProcess: 'kworker_win.exe (PID 5912, Active Threads=4, ExitTime=N/A)',
              PhysicalPoolOffset: '0xffffa80149201080',
              RootkitTechnique: 'DKOM ActiveProcessLinks.Flink/Blink Unlinking',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Kernel Notification Callback & Driver Inspection (windows.callbacks & windows.driverscan)',
        narration:
          'Running vol -f memdump.raw windows.callbacks and windows.driverscan enumerates kernel PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays, identifying an unknown kernel address (0xfffff8046b912400) pointing into an unbacked kernel pool allocation that intercepts process creation events.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Kernel Callback Array Inspection via Volatility 3)',
        technicalCommands: [
          'vol.py -f memdump.raw windows.callbacks',
          'vol.py -f memdump.raw windows.driverscan',
          'Callback Type: IoRegisterFsRegistrationChange / PsSetCreateProcessNotifyRoutine -> Module=UNKNOWN (0xfffff8046b912400)',
        ],
        defenseMitigation:
          'Enforce Hypervisor-Protected Code Integrity (HVCI / Memory Integrity) and Microsoft Vulnerable Driver Blocklist so unsigned or vulnerable kernel drivers cannot modify kernel callback arrays.',
        logs: [
          {
            id: 'dfir-vol-3',
            timestamp: '10:04:30.800',
            source: 'Memory Scan',
            severity: 'critical',
            EventCode: 300,
            ProcessName: 'System',
            CommandLine: 'vol.py -f memdump.raw windows.callbacks (PsSetCreateProcessNotifyRoutine -> UNKNOWN)',
            raw: 'volatility3.plugins.windows.callbacks: Type="GenericKernelCallback" Callback=0xfffff8046b912400 Module="UNKNOWN" Symbol="N/A" Detail="PspCreateProcessNotifyRoutine[9] points to unbacked NonPagedPoolNx"',
            parsedFields: {
              VolatilityPlugin: 'windows.callbacks + windows.driverscan',
              KernelArray: 'Nt!PspCreateProcessNotifyRoutine',
              CallbackPointer: '0xfffff8046b912400 (Module=UNKNOWN)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace',
    title: 'VMware/Broadcom, CISA AA23-039A & Mandiant DFIR — ESXi /var/log/shell.log, hostd.log & VMDK Hypervisor Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1486',
    description:
      'Grounded in VMware vSphere/ESXi Official Log Documentation, CISA Joint Advisory AA23-039A (ESXiArgs), and Mandiant hypervisor DFIR playbooks: an attacker gains SSH/SLP access to a VMware ESXi hypervisor, enumerates running guest VMs via esxcli vm process list, forcefully terminates vmx processes via esxcli vm process kill --type=force, and encrypts the backing -flat.vmdk, .nvram, and .vmx files on /vmfs/volumes/<datastore>/—reconstructed via /var/log/shell.log, /var/log/auth.log, /var/log/hostd.log, and /var/log/vobd.log.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Intruder SSH Session (:22)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ESXi Shell & /var/log/shell.log', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'hostd & esxcli vm process kill', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Syslog (shell, hostd, vobd)', type: 'siem', status: 'normal' },
      { id: 'ad', label: '/vmfs/volumes/* (-flat.vmdk)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ESXi SSH Authentication & Interactive Command Logging (/var/log/auth.log & /var/log/shell.log)',
        narration:
          'When the actor logs into the ESXi host as root over SSH (or enables the ESXi Shell via DCUI/vCenter, generating VOB event esx.audit.ssh.enabled in /var/log/vobd.log), /var/log/auth.log records the SSH source IP and /var/log/shell.log logs every interactive command executed inside the ASH/sh shell.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1078 - Valid Accounts: ESXi Hypervisor Root SSH)',
        technicalCommands: [
          'Log Path 1: /var/log/vobd.log (esx.audit.ssh.enabled / esx.audit.tsm.enabled)',
          'Log Path 2: /var/log/auth.log (sshd: Accepted keyboard-interactive/pam for root)',
          'Log Path 3: /var/log/shell.log (root: esxcli vm process list)',
        ],
        defenseMitigation:
          'Keep ESXi SSH and ESXi Shell disabled by default, enforce vSphere Active Directory SmartCard/MFA Lockdown Mode, and stream /var/log/shell.log, hostd.log, vobd.log, and auth.log to a remote syslog collector (because ESXi /var/log resides on a volatile scratch partition if persistent scratch is unconfigured).',
        logs: [
          {
            id: 'dfir-esxi-1',
            timestamp: '03:01:10.112',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'sshd',
            CommandLine: '/var/log/shell.log: shell[84192]: [root]: esxcli vm process list',
            raw: '2026-11-03T03:01:08Z sshd[84190]: Accepted keyboard-interactive/pam for root from 10.10.15.44 port 55102 ssh2 | 2026-11-03T03:01:10Z shell[84192]: [root]: esxcli vm process list',
            parsedFields: {
              EsxiLogFiles: '/var/log/auth.log + /var/log/shell.log + /var/log/vobd.log',
              AuthenticatedUser: 'root (from 10.10.15.44)',
              ShellCommandLogged: 'esxcli vm process list',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Mass Virtual Machine Termination via esxcli vm process kill (/var/log/hostd.log)',
        narration:
          'Because running vmx hypervisor processes hold exclusive file locks on guest virtual disks (-flat.vmdk), the actor iterates through every World ID and runs esxcli vm process kill --type=force --world-id=<ID>. Both /var/log/shell.log and the VMware Host Agent log (/var/log/hostd.log) record the forced power-off of each guest VM.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1529 - System Shutdown/Reboot: Hypervisor VM Termination)',
        technicalCommands: [
          'ESXi Command: esxcli vm process kill --type=force --world-id=2104892',
          '/var/log/hostd.log: Vmkill called for world 2104892 (CORP-DC01) type=force',
        ],
        defenseMitigation:
          'Alert immediately on syslog messages matching "esxcli vm process kill" in /var/log/shell.log or multiple simultaneous unexpected VM power-off events in /var/log/hostd.log.',
        logs: [
          {
            id: 'dfir-esxi-2',
            timestamp: '03:01:16.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 500,
            ProcessName: 'esxcli',
            CommandLine: 'esxcli vm process kill --type=force --world-id=2104892',
            raw: '2026-11-03T03:01:16.450Z shell[84192]: [root]: esxcli vm process kill --type=force --world-id=2104892 | 2026-11-03T03:01:16.480Z hostd[2098112]: info hostd[2098112] [Originator@6876 sub=Vmsvc.vm:/vmfs/volumes/61a9.../CORP-DC01/CORP-DC01.vmx] State Transition (VM_STATE_ON -> VM_STATE_OFF)',
            parsedFields: {
              EsxiLogFiles: '/var/log/shell.log + /var/log/hostd.log',
              TerminatedWorldId: '2104892 (Guest VM: CORP-DC01)',
              KillType: '--type=force (Immediate vmx termination to release VMDK locks)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Intermittent VMDK Encryption & Flat Descriptor Reconstruction (CISA ESXiArgs Recovery)',
        narration:
          'The actor launches an ELF encryptor from /tmp/ targeting /vmfs/volumes/*/*/*.vmdk, .vmx, and .nvram. As documented in CISA’s ESXiArgs recovery guidance, many hypervisor encryptors fully encrypt the small text descriptor (.vmdk) while only intermittently encrypting blocks of the multi-hundred-gigabyte raw data file (-flat.vmdk), allowing DFIR teams to recreate the .vmdk descriptor via vmkfstools -c and boot or mount the guest NTFS/ext4 partitions.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact: VMFS Datastore VMDKs)',
        technicalCommands: [
          'Targeted Datastore Path: /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk',
          'CISA Descriptor Recovery: ls -l *-flat.vmdk -> vmkfstools -c <exact_byte_size> -d thin temp.vmdk -> point Extent description to original -flat.vmdk',
        ],
        defenseMitigation:
          'Enable ESXi UEFI Secure Boot and execInstalledOnly=TRUE (which prevents the ESXi kernel from executing any unsigned ELF binary not packaged inside a signed VIB) and maintain immutable off-host backups.',
        logs: [
          {
            id: 'dfir-esxi-3',
            timestamp: '03:01:22.900',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'nohup',
            CommandLine: '/var/log/shell.log: nohup /tmp/encrypt /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk',
            raw: '2026-11-03T03:01:22.900Z shell[84192]: [root]: nohup /tmp/encrypt /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk | CISA Recovery Note: Recreate plaintext .vmdk descriptor via vmkfstools -c and attach to clean recovery VM',
            parsedFields: {
              DatastorePath: '/vmfs/volumes/datastore1/CORP-DC01/',
              TargetedFiles: '*.vmdk, *-flat.vmdk, *.vmx, *.nvram, *.vswp',
              PreventiveKernelControl: 'esxcli system settings kernel set -s execInstalledOnly -v TRUE',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-sharepoint-iis-viewstate-losformatter-deserialization',
    title: 'Microsoft MSRC & CISA KEV DFIR — ASP.NET / SharePoint __VIEWSTATE MachineKey LosFormatter Deserialization Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1190',
    description:
      'Grounded in Microsoft Security Response Center (MSRC) advisories (CVE-2020-0688 / CVE-2023-29357 / ASP.NET ViewState guidance) and CISA KEV incident response reports: an attacker extracts or abuses a static ASP.NET <machineKey> validationKey from web.config, crafts a signed LosFormatter / ObjectStateFormatter serialized gadget payload in the __VIEWSTATE parameter, and triggers in-memory .NET deserialization inside w3wp.exe—generating ASP.NET Warning EventID 1309 / 1316 in the Windows Application log when tampered and spawning child processes under w3wp.exe when valid.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'ysoserial.net ViewState Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IIS W3C Extended Log (:443)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'w3wp.exe (LosFormatter)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Application EID 1309 & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'web.config <machineKey>', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: web.config <machineKey> validationKey Exposure & ViewState Probing (Application EventID 1309)',
        narration:
          'Before obtaining the valid key (or while probing with known pre-shared keys), failed __VIEWSTATE payloads trigger Windows Application EventID 1309 (Source: ASP.NET 4.0.30319.0, Event code: 4005 "Viewstate verification failed. Reason: The viewstate supplied failed integrity check") logging the exact Client IP, Request URL, and User-Agent.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application: ViewState MAC Probing)',
        technicalCommands: [
          'Application Log: Source="ASP.NET 4.0.30319.0" EventID=1309 EventCode=4005 (Viewstate verification failed)',
          'Config Artifact: web.config <machineKey validationKey="..." decryptionKey="..." validation="HMACSHA256" />',
        ],
        defenseMitigation:
          'Forward all Windows Application EventID 1309 (EventCode 4005 Viewstate verification failed and EventCode 3005 Unhandled exception) events to the SIEM to detect ViewState key brute-forcing or deserialization attempts.',
        logs: [
          {
            id: 'dfir-viewstate-1',
            timestamp: '14:05:01.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 1309,
            ProcessName: 'w3wp.exe',
            CommandLine: 'ASP.NET EventID 1309 (EventCode 4005): Viewstate verification failed from 198.51.100.33',
            raw: 'LogName: Application | Source: ASP.NET 4.0.30319.0 | EventID: 1309 | EventCode: 4005 | Message: Viewstate verification failed. Reason: The viewstate supplied failed integrity check. | Request URL: https://portal.corp.local/_layouts/15/Picker.aspx | User host address: 198.51.100.33',
            parsedFields: {
              LogChannel: 'Application (Source: ASP.NET 4.0.30319.0)',
              EventID: '1309 (EventCode 4005 - ViewState MAC Failure)',
              RequestUrl: 'https://portal.corp.local/_layouts/15/Picker.aspx',
              ClientIp: '198.51.100.33',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Signed __VIEWSTATE LosFormatter / TypeConfuseDelegate Deserialization (IIS W3C Access Log)',
        narration:
          'Once the attacker obtains the web.config validationKey (via a path traversal, backup leak, or CVE-2023-29357 auth bypass), they sign a TypeConfuseDelegate / ActivitySurrogateSelector gadget chain with HMACSHA256 and submit it via POST /_layouts/15/Picker.aspx (or GET ?__VIEWSTATE=/wEPDwUK...). Because the HMAC is valid, HTTP 200 is returned in the IIS W3C log (C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex*.log) with an abnormally large cs-bytes (request size) or cs-uri-query.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Execution (T1059 - Signed LosFormatter .NET Gadget Deserialization)',
        technicalCommands: [
          'IIS W3C Log Fields: date time c-ip cs-method cs-uri-stem cs-uri-query sc-status sc-bytes cs-bytes',
          'Anomaly: POST /_layouts/15/Picker.aspx sc-status=200 cs-bytes=8420 (Large signed __VIEWSTATE)',
        ],
        defenseMitigation:
          'Enable IIS W3C logging of cs-bytes (client-to-server request bytes) and hunt for anomalous large POST/GET requests to _layouts/15/*.aspx or /ecp/default.aspx returning HTTP 200 or 500.',
        logs: [
          {
            id: 'dfir-viewstate-2',
            timestamp: '14:05:09.420',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'w3wp.exe',
            CommandLine: 'IIS W3C: POST /_layouts/15/Picker.aspx sc-status=200 cs-bytes=8420',
            raw: 'iis_w3c: 2026-11-03 14:05:09 10.20.1.50 POST /_layouts/15/Picker.aspx __VIEWSTATEGENERATOR=B4F91A02 443 - 198.51.100.33 Mozilla/5.0 - 200 0 0 8420',
            parsedFields: {
              LogFile: 'C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex261103.log',
              UriStem: '/_layouts/15/Picker.aspx',
              RequestBytes: 'cs-bytes=8420 (Signed ObjectStateFormatter Payload)',
              HttpStatus: '200 OK (HMAC Validation Passed)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: w3wp.exe Child Process Creation & MachineKey Rotation Remediation (Sysmon EventID 1)',
        narration:
          'Inside w3wp.exe, System.Web.UI.ObjectStateFormatter.Deserialize() reconstructs the gadget chain and invokes System.Diagnostics.Process.Start("cmd.exe", ...), generating Sysmon EventID 1 with ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1190 - w3wp.exe Child Process & MachineKey Rotation)',
        technicalCommands: [
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe -> Image=C:\\Windows\\System32\\cmd.exe',
          'Remediation: Update-SPMachineKey (SharePoint) or rotate <machineKey> validationKey & decryptionKey across all web.config files',
        ],
        defenseMitigation:
          'During incident response involving ViewState deserialization, patching the vulnerability alone is insufficient: defenders must rotate the ASP.NET <machineKey> validationKey and decryptionKey in web.config and HKLM\\SOFTWARE\\Microsoft\\ASP.NET.',
        logs: [
          {
            id: 'dfir-viewstate-3',
            timestamp: '14:05:09.615',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'w3wp.exe -ap "SharePoint - 80" spawning cmd.exe via LosFormatter deserialization',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\inetsrv\\w3wp.exe | ParentCommandLine: w3wp.exe -ap "SharePoint - 80" | Image: C:\\Windows\\System32\\cmd.exe | CommandLine: cmd.exe /c powershell.exe -NoP -W Hidden ...',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              ParentImage: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe',
              ChildImage: 'C:\\Windows\\System32\\cmd.exe',
              MandatoryIrStep: 'Rotate web.config <machineKey> validationKey & decryptionKey',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment',
    title: 'Apache Tomcat Security & CISA DFIR — Tomcat AJP Ghostcat (CVE-2020-1938) & /manager/text/deploy WAR Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1190',
    description:
      'Grounded in Official Apache Tomcat Security Advisories (CVE-2020-1938), Chaitin Tech Ghostcat research, and CISA web server DFIR guides: an attacker connects to an exposed Apache JServ Protocol (AJP/1.3) listener on TCP 8009, sets the request attributes javax.servlet.include.request_uri and javax.servlet.include.path_info="/WEB-INF/web.xml" to read internal configuration credentials, and authenticates to /manager/text/deploy (logged in localhost_access_log.*.txt and catalina.out) to deploy a malicious .war archive.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'AJP13 & HTTP Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AJP Connector (:8009)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'org.apache.catalina.startup', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'localhost_access_log & catalina', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'webapps/metrics.war & JSP', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: AJP/1.3 Port 8009 javax.servlet.include.path_info File Read (CVE-2020-1938 Ghostcat)',
        narration:
          'Because Apache Tomcat prior to 9.0.31 bound the AJP/1.3 connector on 0.0.0.0:8009 without a requiredSecret, the attacker sends a binary AJP13 Forward Request (magic 0x1234) setting javax.servlet.include.request_uri="/" and javax.servlet.include.path_info="/WEB-INF/web.xml". Tomcat’s DefaultServlet serves the raw contents of WEB-INF/web.xml (which is normally blocked over HTTP 8080), leaking credentials for the Tomcat Manager role.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application: CVE-2020-1938 Ghostcat)',
        technicalCommands: [
          'AJP13 Binary Packet (:8009): Magic=0x1234 Prefix=0x02 (JK_AJP13_FORWARD_REQUEST)',
          'AJP Request Attributes: javax.servlet.include.request_uri="/" | javax.servlet.include.path_info="/WEB-INF/web.xml"',
          'Server Config: conf/server.xml <Connector protocol="AJP/1.3" address="0.0.0.0" port="8009" />',
        ],
        defenseMitigation:
          'Disable the AJP/1.3 connector in conf/server.xml if unused, or bind it strictly to address="127.0.0.1" with secretRequired="true" and a high-entropy secret.',
        logs: [
          {
            id: 'dfir-tomcat-1',
            timestamp: '08:12:04.115',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 8009,
            ProcessName: 'java',
            CommandLine: 'Suricata AJP13 Forward Request javax.servlet.include.path_info=/WEB-INF/web.xml',
            raw: 'suricata_alert: sid=2029491 msg="ET WEB_SERVER Apache Tomcat AJP Connector Ghostcat File Read (CVE-2020-1938)" src_ip=198.51.100.41 dest_ip=10.20.4.80 dest_port=8009 proto=TCP payload_ascii="..javax.servlet.include.path_info../WEB-INF/web.xml"',
            parsedFields: {
              Vulnerability: 'CVE-2020-1938 (Apache Tomcat AJP Ghostcat)',
              PortAndProtocol: 'TCP 8009 (Binary AJP/1.3 Magic 0x1234)',
              InjectedAttribute: 'javax.servlet.include.path_info = /WEB-INF/web.xml',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Authenticated WAR Upload via PUT /manager/text/deploy (localhost_access_log & catalina.out)',
        narration:
          'Using the leaked manager-script credentials, the actor sends PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1 on port 8080. Tomcat records the HTTP PUT request in logs/localhost_access_log.2026-11-03.txt and logs "org.apache.catalina.startup.HostConfig.deployWAR Deploying web application archive [/opt/tomcat/webapps/metrics_probe.war]" in logs/catalina.out.',
        activeNodes: ['attacker', 'target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.003 - Server Software Component: Tomcat WAR Deployment)',
        technicalCommands: [
          'Tomcat Access Log: "PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1" 200 58',
          'catalina.out: INFO [http-nio-8080-exec-4] org.apache.catalina.startup.HostConfig.deployWAR Deploying web application archive [/opt/tomcat/webapps/metrics_probe.war]',
        ],
        defenseMitigation:
          'Remove the webapps/manager and webapps/host-manager applications on production Tomcat instances, or restrict them via org.apache.catalina.valves.RemoteAddrValve.',
        logs: [
          {
            id: 'dfir-tomcat-2',
            timestamp: '08:12:11.540',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'java',
            CommandLine: 'HostConfig.deployWAR Deploying /opt/tomcat/webapps/metrics_probe.war',
            raw: 'localhost_access_log: 198.51.100.41 - tomcat_admin [03/Nov/2026:08:12:11 +0000] "PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1" 200 58 | catalina.out: org.apache.catalina.startup.HostConfig.deployWAR Deploying web application archive [/opt/tomcat/webapps/metrics_probe.war]',
            parsedFields: {
              AccessLogFile: '/opt/tomcat/logs/localhost_access_log.2026-11-03.txt',
              CatalinaLogEvent: 'HostConfig.deployWAR [/opt/tomcat/webapps/metrics_probe.war]',
              AuthenticatedUser: 'tomcat_admin (Role: manager-script)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Jasper JSP Compilation (work/Catalina/localhost/*/*_jsp.class) & JVM Child Process Execution',
        narration:
          'When the actor requests GET /metrics_probe/health.jsp, Apache Jasper compiles health.jsp into health_jsp.java and health_jsp.class inside /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/ (persisting on disk even if the .jsp file is deleted) and executes Runtime.getRuntime().exec(), logged by Linux auditd under the java parent PID.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1505.003 - Jasper work/Catalina/*_jsp.class Artifact & JVM Child Shell)',
        technicalCommands: [
          'Compiled JSP Artifact: /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.class',
          'Linux auditd SYSCALL: syscall=59 (execve) ppid=1420 (java) uid=991 (tomcat) exe="/usr/bin/bash"',
        ],
        defenseMitigation:
          'Inspect /opt/tomcat/work/Catalina/localhost/ for compiled *_jsp.java and *_jsp.class files during Tomcat DFIR investigations—even if an attacker undeploys or deletes the .jsp file, the generated Java source often remains in work/.',
        logs: [
          {
            id: 'dfir-tomcat-3',
            timestamp: '08:12:18.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'java',
            CommandLine: 'java (org.apache.catalina.startup.Bootstrap) spawning /bin/sh via health_jsp.class',
            raw: 'type=SYSCALL msg=audit(1762157538.902:8912): arch=c000003e syscall=59 (execve) success=yes ppid=1420 pid=3910 uid=991 comm="sh" exe="/usr/bin/bash" | JasperArtifact="/opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.class"',
            parsedFields: {
              ParentJvmProcess: '/usr/lib/jvm/jre/bin/java (org.apache.catalina.startup.Bootstrap)',
              JasperCacheArtifact: 'work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.java',
              AuditSyscall: '59 (sys_execve spawning /bin/sh)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion',
    title: 'Microsoft KB5005413, CERT-FR & CISA DFIR — MS-EFSRPC PetitPotam Coercion (Zeek dce_rpc) & NTLM Relay Forensics (EID 4624)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1187',
    description:
      'Grounded in Microsoft Security Advisory KB5005413, CERT-FR PetitPotam analysis, and CISA NTLM Relay guidance: an attacker connects to the Encrypting File System Remote Protocol (MS-EFSRPC over \\pipe\\lsarpc or \\pipe\\efsrpc) on a Domain Controller and invokes EfsRpcOpenFileRaw(FileName="\\\\10.10.4.99\\test\\Settings.ini"), coercing the DC machine account (CORP-DC01$) to authenticate via NTLMv2 to the attacker relay listener—detectable via Zeek dce_rpc.log, Security EventID 5145 (\\pipe\\lsarpc), and relayed Security EventID 4624 (LogonType 3, AuthenticationPackageName=NTLM).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Coercion & NTLM Relay Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Zeek dce_rpc & SMB (:445)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (\\pipe\\lsarpc)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Zeek dce_rpc & EID 5145/4624', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Relayed Target (LDAP / HTTP)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MS-EFSRPC Bind Over \\pipe\\lsarpc & EfsRpcOpenFileRaw Coercion (Zeek dce_rpc.log & EventID 5145)',
        narration:
          'The attacker binds to the MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e exposed on \\pipe\\lsarpc (or UUID df1941c5-fe89-4e79-bf10-463657acf44d on \\pipe\\efsrpc) on CORP-DC01 and invokes Opnum 0 (EfsRpcOpenFileRaw) passing a UNC path pointing back to the attacker IP (\\\\10.10.4.99\\share\\file). Zeek dce_rpc.log records endpoint="efsrpc" and operation="EfsRpcOpenFileRaw", while CORP-DC01 logs Security EventID 5145 on \\\\*\\IPC$ RelativeTargetName=lsarpc.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1187 - Forced Authentication: MS-EFSRPC PetitPotam)',
        technicalCommands: [
          'Zeek dce_rpc.log: named_pipe="lsarpc" uuid="c681d488-d850-11d0-8c52-00c04fd90f7e" operation="EfsRpcOpenFileRaw"',
          'Security EventID 5145: ShareName="\\\\*\\IPC$" RelativeTargetName="lsarpc"',
        ],
        defenseMitigation:
          'Apply Microsoft KB5005413 recommendations: block unauthenticated RPC binds via Group Policy (RestrictUnauthenticatedRpcClients), apply RPC packet-privacy filters (netsh rpc filter) blocking UUID c681d488-d850-11d0-8c52-00c04fd90f7e, and monitor Zeek dce_rpc.log for EfsRpc* operations.',
        logs: [
          {
            id: 'dfir-petit-1',
            timestamp: '15:40:02.110',
            source: 'Network',
            severity: 'critical',
            EventCode: 5145,
            ProcessName: 'lsass.exe',
            CommandLine: 'Zeek dce_rpc: EfsRpcOpenFileRaw over \\pipe\\lsarpc (UUID c681d488-d850-11d0-8c52-00c04fd90f7e)',
            raw: 'zeek_dce_rpc: ts=1762184402.110 uid=Ck91m2 id.orig_h=10.10.4.99 id.resp_h=10.10.0.10 id.resp_p=445 named_pipe="lsarpc" endpoint="efsrpc" uuid="c681d488-d850-11d0-8c52-00c04fd90f7e" operation="EfsRpcOpenFileRaw"',
            parsedFields: {
              ZeekLogStream: 'dce_rpc.log + Security EventID 5145',
              NamedPipe: '\\pipe\\lsarpc (or \\pipe\\efsrpc)',
              RpcInterfaceUuid: 'c681d488-d850-11d0-8c52-00c04fd90f7e',
              CoercionOperation: 'EfsRpcOpenFileRaw (Opnum 0)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Coerced Machine Account (CORP-DC01$) Outbound SMB NTLMv2 Callback to Attacker Listener',
        narration:
          'In response to EfsRpcOpenFileRaw, the NT kernel on CORP-DC01 (System PID 4) immediately initiates an outbound SMB TCP 445 connection from 10.10.0.10 to the attacker IP 10.10.4.99 authenticating as CORP\\CORP-DC01$ via NTLMSSP. On CORP-DC01, Microsoft-Windows-NTLM/Operational logs EventID 8001 (Outgoing NTLM authentication traffic to remote server 10.10.4.99).',
        activeNodes: ['target', 'firewall', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1187 - Coerced Machine Account Outbound NTLMv2)',
        technicalCommands: [
          'Microsoft-Windows-NTLM/Operational EventID 8001: Outgoing NTLM authentication to target "\\\\10.10.4.99"',
          'Sysmon EventID 3: Image=System (PID 4) SourceIp=10.10.0.10 DestinationIp=10.10.4.99 DestinationPort=445',
        ],
        defenseMitigation:
          'Enable the policy "Network security: Restrict NTLM: Outgoing NTLM traffic to remote servers" (Audit All or Deny All on Domain Controllers) to log EventID 8001 in Microsoft-Windows-NTLM/Operational and block outbound NTLM coercion.',
        logs: [
          {
            id: 'dfir-petit-2',
            timestamp: '15:40:02.180',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 8001,
            ProcessName: 'System',
            CommandLine: 'NTLM/Operational EID 8001: Outgoing NTLM from CORP-DC01$ to \\\\10.10.4.99:445',
            raw: 'LogName: Microsoft-Windows-NTLM/Operational | EventID: 8001 | Computer: CORP-DC01.corp.local | TargetName: cifs/10.10.4.99 | UserName: CORP-DC01$ | DomainName: CORP | ProcessName: System',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-NTLM/Operational',
              EventID: '8001 (Outgoing NTLM Authentication Audit)',
              CoercedAccount: 'CORP\\CORP-DC01$ (Domain Controller Machine Account)',
              DestinationTarget: 'cifs/10.10.4.99 (TCP 445)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Cross-Protocol NTLM Relay to HTTP/LDAP & Anomalous EventID 4624 IpAddress Mismatch',
        narration:
          'The attacker relays the NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages from CORP-DC01$ to a secondary server (such as AD CS HTTP /certsrv/ or LDAP lacking channel binding/signing). On the relayed destination server, Security EventID 4624 logs a successful LogonType 3 (AuthenticationPackageName=NTLM, PackageName=NTLM V2) where TargetUserName="CORP-DC01$" (10.10.0.10) does not match IpAddress="10.10.4.99" (the attacker relay host).',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1557.001 - Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning and SMB Relay)',
        technicalCommands: [
          'Security EventID 4624: LogonType=3 AuthenticationPackageName=NTLM TargetUserName=CORP-DC01$ WorkstationName=CORP-DC01 IpAddress=10.10.4.99',
          'SIEM Relay Signature: TargetUserName ends with "$" (Machine Account), AuthPackage="NTLM", and IpAddress != resolved DNS IP of TargetUserName',
        ],
        defenseMitigation:
          'Enforce SMB Signing, LDAP Signing (Domain controller: LDAP server signing requirements = Require signing), LDAP Channel Binding (LdapEnforceChannelBinding=2), and Extended Protection for Authentication (EPA) on all IIS/ADCS endpoints.',
        logs: [
          {
            id: 'dfir-petit-3',
            timestamp: '15:40:02.310',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4624,
            ProcessName: 'lsass.exe',
            CommandLine: 'Security EID 4624 NTLM Relay: TargetUserName=CORP-DC01$ from IpAddress=10.10.4.99',
            raw: 'EventID: 4624 | LogonType: 3 | TargetUserName: CORP-DC01$ | TargetDomainName: CORP | AuthenticationPackageName: NTLM | LmPackageName: NTLM V2 | WorkstationName: CORP-DC01 | IpAddress: 10.10.4.99 | Anomaly: Machine account CORP-DC01$ (10.10.0.10) authenticated from 10.10.4.99',
            parsedFields: {
              EventID: '4624 (Relayed Network LogonType 3)',
              RelayedIdentity: 'CORP\\CORP-DC01$ (Expected IP 10.10.0.10)',
              ActualSourceIp: '10.10.4.99 (Attacker NTLM Relay Host)',
              AuthenticationPackage: 'NTLM V2 (Missing EPA / Channel Binding)',
            },
          },
        ],
      },
    ],
  },
];
