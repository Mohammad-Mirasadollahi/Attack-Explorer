import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
