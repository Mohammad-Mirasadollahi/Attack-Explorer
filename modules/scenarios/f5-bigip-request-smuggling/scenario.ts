import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
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
