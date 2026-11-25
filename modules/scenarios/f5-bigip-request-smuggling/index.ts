import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'f5-bigip-request-smuggling',
    briefing: {
      headline: 'Scenario Briefing: F5 BIG-IP TMUI Auth Bypass & AJP Request Smuggling (CVE-2023-46747)',
      storyAnalogy:
        'Imagine a building with a strict front-door security guard (Apache httpd) and a trusting back-office clerk (Apache Tomcat) who talk to each other over an internal pneumatic tube (AJP protocol). A visitor sends a single long envelope whose outer label says it is just a public login-page check, so the front-door guard lets it through. Inside the pneumatic tube, however, the oversized message spills over and creates a brand-new second internal work order marked REMOTE_USER = admin. The back-office clerk reads that second forged work order and believes the front guard already verified the visitor as the building’s master administrator.',
      plainSummary:
        'In this scenario (CVE-2023-46747, F5 Security & Mandiant - F5 BIG-IP TMUI AJP Request Smuggling to Root RCE), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: smuggling a Forged Second AJP Request Past, then using the Smuggled Admin Context to Create, then executing Arbitrary root Commands. Steps #1–#3 walk that chain end-to-end by covering Smuggling a Forged Second AJP Request Past, then Using the Smuggled Admin Context to Create, then Executing Arbitrary root Commands, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for CVE-2023-46747 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Attacker), send the crafted HTTP request to Node ②/③ (F5 BIG-IP TMUI Front-End Apache :443), trace the smuggled AJP packet (0x1234 prefix + SC_A_REMOTE_USER = admin) entering Node ④ (Back-End Tomcat & tmsh Engine), and watch the tmsh root command execution on Node ⑤ detected by Node ⑥ (BIG-IP Audit & SIEM).',
      documentedAdvisory: 'F5 Security Advisory K000137353 · ProjectDiscovery CVE-2023-46747 Analysis · CISA KEV · MITRE T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Smuggling a Forged Second AJP Request Past Front-End Apache via CVE-2023-46747',
        storyAnalogy:
          'The attacker sends a request to a public login helper page (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp) with a precisely sized HTTP header that overflows the internal AJP pneumatic tube packet, sneaking a hidden second AJP message (REMOTE_USER=admin) right behind it.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to a reachable TMUI endpoint (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp). By carefully sizing the HTTP headers and body, mod_proxy_ajp on the front-end Apache server miscalculates the binary AJP packet boundary and forwards the attacker’s raw payload bytes as a brand-new, second AJP request (starting with the AJP magic bytes 0x12 0x34) to the back-end Tomcat server on port 8009, with the internal AJP header attribute SC_A_REMOTE_USER set to "admin" (spoofing a fully authenticated administrator session because Tomcat blindly trusts whichever username the front-end Apache proxy puts in SC_A_REMOTE_USER).',
        howItWorksInPractice:
          'In a two-tier Apache + Tomcat AJP architecture, Tomcat does not re-verify passwords; it assumes the front-end Apache server already checked the user’s login before setting SC_A_REMOTE_USER. Smuggling a raw second AJP frame inside the socket stream lets an unauthenticated attacker inject SC_A_REMOTE_USER=admin directly into Tomcat. In the documented Suricata CVE-2023-46747 exchange from Threat Actor (AJP Smuggler) to DMZ Reverse Proxy & SPAN Tap, DMZ Reverse Proxy & SPAN Tap responds with ALERT HTTP 200 (confirming that the AJP SMUGGLING POST request succeeded on DMZ Reverse Proxy & SPAN Tap and establishing the runtime state required for Step #2 ROGUE ADMIN ACCOUNT CREATION VIA TMSHCMD.JSP).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① to Node ②/③ (F5 BIG-IP Apache mod_proxy_ajp), and return arrow ⇠#1 smuggling the forged REMOTE_USER=admin AJP packet into Node ④ (Tomcat :8009).',
        detectionAndEvidence:
          'Documented by ProjectDiscovery and F5 K000137353 (vendor advisory detailing authentication bypass traces): /var/log/httpd/httpd_errors and Tomcat logs showing anomalous AJP header parsing and unauthenticated hits to /tmui/Control/jspmap/ (indicating a smuggled request reached the internal management servlet). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Using the Smuggled Admin Context to Create a Rogue BIG-IP Administrator via form_page',
        storyAnalogy:
          'Fooled by the forged REMOTE_USER=admin stamp on the smuggled work order, the back-end Tomcat clerk opens the internal UserCreate ledger and registers a brand-new administrator account with full bash terminal access.',
        simpleExplanation:
          'Executing inside Tomcat under the forged REMOTE_USER=admin identity (which bypasses the outer Apache authentication filter entirely because the smuggled request was born behind the Apache gatekeeper inside the internal AJP pipe), the request invokes the internal TMUI UserCreate handler (/tmui/Control/form) to create a new local BIG-IP administrator account granted Administrator role and Advanced Shell (/bin/bash) terminal access.',
        howItWorksInPractice:
          'When Tomcat processes the smuggled /tmui/Control/form request with SC_A_REMOTE_USER=admin, it communicates with the BIG-IP master control daemon (mcpd) to write the new administrator account into /config/bigip_user.conf. In the documented BIG-IP /var/log/audit exchange from DMZ Reverse Proxy & SPAN Tap to BIG-IP Apache Frontend (httpd), BIG-IP Apache Frontend (httpd) responds with ACK Audit 01070417 (confirming that the CREATE AUTH USER request succeeded on BIG-IP Apache Frontend (httpd) and establishing the runtime state required for Step #3 ROOT BASH EXECUTION & SSL PRIVATE KEY EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ invokes the TMUI UserCreate handler as admin, and ⇠#2 registers the rogue administrator in /config/bigip_user.conf.',
        detectionAndEvidence:
          'Documented in /var/log/audit and /var/log/ltm (local appliance configuration audit trails): creation of a new user account with role=admin and shell=bash without a preceding interactive web login (a high-confidence indicator of administrative authentication bypass). Correlate Sysmon or Windows Security Event telemetry for T1136.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.004',
        plainTitle: 'Executing Arbitrary root Commands via tmshCmd.jsp (util bash -c)',
        storyAnalogy:
          'With their newly minted administrator account, the attacker calls the tmsh command runner to launch bash -c as root and extract all SSL private keys and internal server credentials managed by the load balancer.',
        simpleExplanation:
          'Using the newly created admin account (or directly via a smuggled tmshCmd.jsp request), the attacker runs tmsh run /util bash -c "..." (abusing the Traffic Management Shell’s built-in "/util bash" utility to break out of the restricted appliance CLI into an unrestricted Linux root shell). With root access on the load balancer, they extract SSL/TLS private keys (/config/filestore/files_d/Common_d/certificate_key_d/, allowing them to decrypt HTTPS traffic for the company’s web apps) and backend server credentials.',
        howItWorksInPractice:
          'Because an F5 BIG-IP sits at the front of the datacenter terminating TLS connections and load-balancing internal servers, root access on the appliance exposes both private TLS keys and direct network paths into internal application VLANs. In the documented Auditd SYSCALL 59 exchange from BIG-IP Apache Frontend (httpd) to Tomcat AJP Backend & tmsh, Tomcat AJP Backend & tmsh responds with ACK UID 0 (root) (confirming that the TMSH BASH RCE request succeeded on Tomcat AJP Backend & tmsh and completing the final execution objective of F5 Security & Mandiant, F5 BIG-IP TMUI AJP Request Smuggling to Root RCE).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes tmsh run /util bash on Node ⑤ (BIG-IP Root OS & SSL Vault) while Node ⑥ (SIEM) alerts on auditd tmsh bash execution.',
        detectionAndEvidence:
          'Documented in F5 K000137353 (/var/log/audit appliance command logs): mcpd / tmsh audit log entries showing run /util bash -c executed from tmui / tomcat (confirming that the web management interface spawned underlying root shell commands). Correlate Sysmon or Windows Security Event telemetry for T1059.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A front lobby receptionist counts sealed parcels differently from the back-office clerk receiving them on a conveyor belt. An outsider packs a second hidden work order inside one parcel so it bypasses the lobby badge desk, creates a new master clerk account, and runs unrestricted commands in the engine room.',
        storyMappings: [
          {
            storyTerm: 'Front lobby receptionist',
            technicalTerm: 'Front-end Apache reverse-proxy web server',
            tone: 'amber',
          },
          {
            storyTerm: 'Back-office conveyor clerk',
            technicalTerm: 'Internal Tomcat AJP servlet container',
            tone: 'sky',
          },
          {
            storyTerm: 'Second hidden work order',
            technicalTerm: 'Smuggled AJP administrative request (CVE-2023-46747)',
            tone: 'rose',
          },
          {
            storyTerm: 'Engine room terminal',
            technicalTerm: 'Root shell execution through management utility',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The outsider hands over a single oversized parcel at the lobby desk. The receptionist stamps the outer wrapper as harmless, while the back-office clerk splits the parcel along a hidden crease and treats the inner slip as a pre-approved manager order.',
          storyMappings: [
            {
              storyTerm: 'Outer parcel wrapper',
              technicalTerm: 'Benign front-end HTTP request headers',
              tone: 'amber',
            },
            {
              storyTerm: 'Hidden parcel crease',
              technicalTerm: 'AJP request framing desynchronization flaw',
              tone: 'sky',
            },
            {
              storyTerm: 'Pre-approved manager order',
              technicalTerm: 'Smuggled request targeting /tmui/Control/jspmap/',
              tone: 'rose',
            },
            {
              storyTerm: 'Back-office clerk',
              technicalTerm: 'Backend Tomcat AJP connector listener',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by ProjectDiscovery and F5 K000137353 (vendor advisory detailing authentication bypass traces): /var/log/httpd/httpd_errors and Tomcat logs showing anomalous AJP header parsing and unauthenticated hits to /tmui/Control/jspmap/ (indicating a smuggled request reached the internal management servlet).',
        },
        2: {
          storyAnalogy:
            'Acting under that smuggled manager stamp, the back-office clerk opens the staff roster book and writes in a brand-new senior supervisor badge with full building and workshop keys, even though nobody ever signed in at the front desk.',
          storyMappings: [
            {
              storyTerm: 'Staff roster book',
              technicalTerm: 'Appliance configuration user database',
              tone: 'amber',
            },
            {
              storyTerm: 'Senior supervisor badge',
              technicalTerm: 'Rogue administrator account with role=admin',
              tone: 'sky',
            },
            {
              storyTerm: 'Workshop master key',
              technicalTerm: 'Assigned advanced interactive shell access',
              tone: 'rose',
            },
            {
              storyTerm: 'Missing front-desk sign-in',
              technicalTerm: 'Account creation with no prior web login event',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in /var/log/audit and /var/log/ltm (local appliance configuration audit trails): creation of a new user account with role=admin and shell=bash without a preceding interactive web login (a high-confidence indicator of administrative authentication bypass).',
        },
        3: {
          storyAnalogy:
            'Wearing the newly forged supervisor badge, the outsider walks directly to the engine-room command console and dispatches unrestricted maintenance directives across the entire traffic-routing building.',
          storyMappings: [
            {
              storyTerm: 'Engine-room command console',
              technicalTerm: 'Management tmshCmd.jsp execution endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Unrestricted maintenance directive',
              technicalTerm: 'Arbitrary root command via util bash -c',
              tone: 'sky',
            },
            {
              storyTerm: 'Building traffic hub',
              technicalTerm: 'Compromised enterprise load-balancer appliance',
              tone: 'rose',
            },
            {
              storyTerm: 'Shift audit ledger',
              technicalTerm: 'Control-plane audit log recording shell runs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in F5 K000137353 (/var/log/audit appliance command logs): mcpd / tmsh audit log entries showing run /util bash -c executed from tmui / tomcat (confirming that the web management interface spawned underlying root shell commands).',
        },
      },
    };
