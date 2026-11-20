import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
