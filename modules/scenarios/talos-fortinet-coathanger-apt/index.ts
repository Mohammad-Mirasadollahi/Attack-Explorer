import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'talos-fortinet-coathanger-apt',
    briefing: {
      headline: 'Scenario Briefing: COATHANGER RAT (CVE-2022-42475 / CVE-2023-27997), FortiGate SSL-VPN Rootkit & ld.so.preload Hijack',
      storyAnalogy:
        'Imagine a fortress gate (a FortiGate firewall) where a burglar uses an oversized battering ram (Heap Overflow in sslvpnd) to slip inside. Once inside, the burglar hooks a tiny invisible coat hanger (ld.so.preload rootkit) onto the fortress’s coat rack so that every time an administrator runs the inspection command (ps or ls) to check if anyone is hiding in the room, the coat hanger intercepts the administrator’s glasses and erases the burglar from their field of view, and even hides a spare copy inside the emergency recovery partition (flatkc) to survive firmware updates.',
      plainSummary:
        'In this scenario (CVE-2024-21762, NCSC-NL, Talos & Mandiant - China-Nexus APT: FortiOS SSL-VPN & COATHANGER Persistent RAT) at 172.16.5.1, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: heap Buffer Overflow in FortiOS sslvpnd, then hooking System Calls via /etc/ld.so.preload, then patching the flatkc Reboot Binary to Survive. Steps #1–#3 walk that chain end-to-end by covering Heap Buffer Overflow in FortiOS sslvpnd, then Hooking System Calls via /etc/ld.so.preload, then Patching the flatkc Reboot Binary to Survive, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (APT Operator), send the heap-overflow payload to Node ②/③ (FortiGate SSL-VPN /remote/logincheck sslvpnd), trace the /data2 filesystem implant and ld.so.preload system-call hooking inside Node ④ (COATHANGER Rootkit), and follow the hidden C2 channel to Node ⑤ while Node ⑥ (SIEM / Out-of-Band Forensics) detects the sslvpnd crash and preload hook.',
      documentedAdvisory: 'Dutch MIVD / NCTV Technical Report on COATHANGER (Feb 2024) · CVE-2022-42475 & CVE-2023-27997 · MITRE T1574.006',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Heap Buffer Overflow in FortiOS sslvpnd (CVE-2022-42475 / CVE-2023-27997)',
        storyAnalogy:
          'The attacker sends an HTTPS request to the FortiGate VPN login gate with a falsified Content-Length label, causing the sslvpnd gatekeeper to pour extra bytes past the end of its memory bucket (Heap Overflow) and overwrite its own instruction pointer.',
        simpleExplanation:
          'Against internet-facing FortiGate WAN self-IP 172.16.5.1, the attacker sends a specially crafted HTTPS request with a manipulated Content-Length header or encrypted parameter (enc) to the FortiGate SSL-VPN web endpoint (/remote/logincheck or /remote/hostcheck_validate, public VPN login pages reachable from the internet without prior authentication). This triggers a heap-based buffer overflow inside the sslvpnd daemon (writing attacker-controlled bytes past the end of the allocated heap buffer to overwrite adjacent function pointers in RAM and hijack the CPU into running the attacker’s code).',
        howItWorksInPractice:
          'In FortiOS, sslvpnd and almost all system utilities are compiled into a single monolithic multi-call binary (/bin/init). By chaining Return-Oriented Programming (ROP) gadgets inside that binary, exploiting sslvpnd gives the attacker immediate code execution inside the underlying Linux OS of the firewall. In the documented FortiOS Crashlog exchange from China-Nexus APT C2 to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK CVE-2024-21762 (confirming that the SSLVPND SIGSEGV request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 COATHANGER PRELOAD.SO ROOTKIT & SMARTCTL HOOK).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (APT Operator) to Node ②/③ (FortiGate /remote/logincheck sslvpnd), and return arrow ⇠#1 triggering the ROP chain and shell execution.',
        detectionAndEvidence:
          'Documented in Fortinet FG-IR-22-398 & MIVD Report: Application sslvpnd crashed entries in FortiOS crash logs (diagnose debug crashlog read) and anomalous requests to /remote/logincheck. Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.006',
        plainTitle: 'Hooking System Calls via /etc/ld.so.preload (smartctl / preload.so) to Hide From Admins',
        storyAnalogy:
          'Once inside, COATHANGER places a filter lens (preload.so) in /etc/ld.so.preload. Whenever any program on the firewall asks Linux "What files are in /data2?" or "What processes are running?", the filter lens intercepts the answer and deletes COATHANGER’s name before showing the list.',
        simpleExplanation:
          'COATHANGER stores its backdoor files inside the persistent /data2/ partition and writes the path of its malicious shared library (preload.so) into /etc/ld.so.preload (a special Linux dynamic-linker configuration file that forces every single program launched on the system to load preload.so before the standard C library libc.so). Because preload.so is loaded first, it intercepts file-listing and process-listing calls (removing COATHANGER’s files and PIDs from the results so an admin inspecting the firewall sees nothing unusual).',
        howItWorksInPractice:
          'By hooking user-space libc functions like readdir(), open(), and stat() via /etc/ld.so.preload, whenever an administrator runs a diagnostic CLI command on the FortiGate, the hooked library filters out any path containing the implant’s directory before returning the output to the terminal. In the documented NCSC-NL YARA Match exchange from Perimeter Firewall & NDR Tap to FortiGate NGFW (sslvpnd), FortiGate NGFW (sslvpnd) responds with ALERT 36 KB ELF (confirming that the COATHANGER ROOTKIT request succeeded on FortiGate NGFW (sslvpnd) and establishing the runtime state required for Step #3 MASQUERADED HTTPSD BEACON & VPN CREDENTIAL THEFT).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ writes the implant to /data2 and hooks /etc/ld.so.preload, with ⇠#2 intercepting userland libc calls.',
        detectionAndEvidence:
          'Perform offline disk and memory forensic triage on suspected FortiGate appliances (bypassing live userland rootkit hooks that conceal active implants) to uncover /etc/ld.so.preload entries and unauthorized binaries inside /data2/ or modified /bin/smartctl. Correlate Sysmon or Windows Security Event telemetry for T1574.006 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542',
        plainTitle: 'Patching the flatkc Reboot Binary to Survive FortiOS Firmware Upgrades',
        storyAnalogy:
          'Even if the IT team installs a brand-new FortiOS firmware update, COATHANGER has already tucked a backup copy of itself inside the emergency kernel unpacker (flatkc) so that as soon as the newly updated firewall reboots, it re-infects itself on startup.',
        simpleExplanation:
          'Normally, rebooting a FortiGate or installing a FortiOS firmware update wipes the temporary root filesystem in RAM and loads a clean image. To survive both reboots and firmware updates, COATHANGER replaces /bin/smartctl and hooks the flatkc boot binary (the low-level FortiOS unpacker that initializes the filesystem whenever the appliance boots up, causing the firewall to automatically copy the hidden backdoor from the persistent /data2 flash partition back into the freshly updated system on startup).',
        howItWorksInPractice:
          'Because standard firmware upgrades replace the main rootfs image but preserve persistent flash partitions like /data2 alongside hooked boot components, simply installing a FortiOS patch without wiping and reformatting the appliance leaves COATHANGER active. In the documented Suricata TLS Alert exchange from FortiGate NGFW (sslvpnd) to COATHANGER (preload.so & smartctl), COATHANGER (preload.so & smartctl) responds with ALERT TLS 1.3 (confirming that the FORTIGATE EGRESS C2 request succeeded on COATHANGER (preload.so & smartctl) and completing the final execution objective of NCSC-NL, Talos & Mandiant, China-Nexus APT: FortiOS SSL-VPN & COATHANGER Persistent RAT).',
        diagramAlignment:
          'On the diagram, arrow #3→ persists across boot inside Node ④ and opens the TLS C2 channel to Node ⑤, while Node ⑥ (SIEM / Out-of-Band NetFlow) detects the undocumented outbound TLS sessions from the firewall’s external interface.',
        detectionAndEvidence:
          'Monitor perimeter firewalls and upstream taps for unexplained outbound TLS connections initiated directly by the FortiGate appliance itself to unknown external IPs (unusual for perimeter gateways) and verify cryptographic hashes on /bin/smartctl and flash partitions. Correlate Sysmon or Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a fortified perimeter watchtower whose public entrance gate suffers a structural overflow crack that lets a covert agent climb inside undetected. Once inside the watchtower, the agent weaves an invisible cloak over the tower\'s own inspection tools so guards see nothing out of place, and even welds a secret spring onto the tower\'s master reboot engine so that wiping and upgrading the watchtower roof simply re-plants the spy automatically every single time.',
      storyMappings: [
        {
          storyTerm: 'Structural overflow crack at the watchtower public gate',
          technicalTerm: 'Heap buffer overflow in FortiOS sslvpnd (CVE-2022-42475 / CVE-2023-27997)',
          tone: 'amber',
        },
        {
          storyTerm: 'Invisible cloak woven over the watchtower inspection tools',
          technicalTerm: '/etc/ld.so.preload (preload.so) hooking syscalls to hide /data2/ and /bin/smartctl',
          tone: 'sky',
        },
        {
          storyTerm: 'Secret spring welded onto the master reboot engine',
          technicalTerm: 'Patching the flatkc reboot binary so COATHANGER survives FortiOS firmware upgrades',
          tone: 'rose',
        },
        {
          storyTerm: 'Watchtower phoning an outside spy post on its own',
          technicalTerm: 'Unexpected outbound TLS C2 initiated by the FortiGate appliance itself',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending an oversized, carefully shaped knock against the watchtower public remote-access gate, the spy overflows the gate memory tray and slips directly into the underlying appliance operating system without presenting any credentials.',
        storyMappings: [
          {
            storyTerm: 'Public remote-access gate on the watchtower',
            technicalTerm: 'Internet-exposed FortiGate FortiOS SSL-VPN daemon (sslvpnd)',
            tone: 'amber',
          },
          {
            storyTerm: 'Oversized carefully shaped knock',
            technicalTerm: 'Pre-authentication heap buffer overflow exploiting CVE-2022-42475 or CVE-2023-27997',
            tone: 'sky',
          },
          {
            storyTerm: 'Slipping directly into the appliance engine room',
            technicalTerm: 'Arbitrary remote code execution inside the FortiGate Linux runtime',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero login required',
            technicalTerm: 'Unauthenticated perimeter takeover bypassing VPN MFA and admin policies',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the appliance, the spy slips a rigged lens onto the universal tool coatroom and disguises its own implant behind an ordinary disk-health monitor, blinding every live inspection command run by engineers.',
        storyMappings: [
          {
            storyTerm: 'Rigged lens on the universal tool coatroom',
            technicalTerm: '/etc/ld.so.preload loading preload.so to hook system calls across FortiOS tools',
            tone: 'amber',
          },
          {
            storyTerm: 'Implant disguised behind a disk-health monitor',
            technicalTerm: 'COATHANGER RAT hidden in /data2/ and trojanized /bin/smartctl',
            tone: 'sky',
          },
          {
            storyTerm: 'Blinding live inspection commands on the appliance',
            technicalTerm: 'Userland syscall hooking concealing rogue files, processes, and sockets from CLI',
            tone: 'rose',
          },
          {
            storyTerm: 'Unmasking the cloak offline',
            technicalTerm: 'Offline disk and raw memory forensic inspection bypassing live ld.so.preload hooks',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Perform offline disk and memory forensic triage on suspected FortiGate appliances (bypassing live userland rootkit hooks that conceal active implants) to uncover /etc/ld.so.preload entries and unauthorized binaries inside /data2/ or modified /bin/smartctl. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1574.006 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Knowing defenders will eventually reboot and rebuild the watchtower\'s base blueprint to evict intruders, the spy alters the building\'s official reboot blueprint itself so every restart and software rebuild obediently re-installs the spy automatically.',
        storyMappings: [
          {
            storyTerm: 'Altering the official reboot blueprint itself',
            technicalTerm: 'Patching the FortiOS flatkc kernel/initramfs reboot binary during persistence setup',
            tone: 'amber',
          },
          {
            storyTerm: 'Surviving full base-blueprint rebuilds automatically',
            technicalTerm: 'COATHANGER re-injecting itself into the newly upgraded FortiOS image on reboot',
            tone: 'sky',
          },
          {
            storyTerm: 'Watchtower phoning outside on its own',
            technicalTerm: 'Anomalous outbound TLS C2 beacons originating directly from the FortiGate management IP',
            tone: 'rose',
          },
          {
            storyTerm: 'Only true eradication path',
            technicalTerm: 'Full physical TFTP format-and-reflash from verified clean firmware rather than in-place upgrade',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor perimeter firewalls and upstream taps for unexplained outbound TLS connections initiated directly by the FortiGate appliance itself to unknown external IPs (unusual for perimeter gateways) and verify cryptographic hashes on /bin/smartctl and flash partitions. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
