import { LOG4SHELL_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'log4shell-dfir',
  code: 'CVE-2021-44228',
  name: 'NVD, CISA ED 22-02 & GOVCERT.ch — Apache Log4j2 "Log4Shell": JNDI Lookup DFIR & Egress Defense',
  shortSubtitle: 'Network & Web · Log4j2 MessagePatternConverter Lookup Flaw, Zeek LDAP/RMI Egress & Linux auditd execve',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 2,
  overview:
    'In Apache Log4j2 "Log4Shell" (CVE-2021-44228, CVSS 10.0, MITRE ATT&CK T1190 and T1059.004), an architectural flaw in Log4j2 versions 2.0-beta9 through 2.14.1 caused untrusted user-supplied text written to application logs—such as HTTP request headers—to be recursively evaluated for JNDI directory lookups rather than recorded as literal strings. Grounded in NIST NVD / Apache advisories, CISA Emergency Directive 22-02, and Swiss NCSC (GOVCERT.ch) forensic guidance, this DFIR walkthrough traces how an inbound header reaches log4j-core, why outbound LDAP/RMI egress telemetry in Zeek and unexpected java child processes in Linux auditd execve provide evasion-resistant detection even against obfuscated headers, and how upgrading to Log4j 2.17.1+ paired with strict application-tier egress airlocks permanently neutralizes the flaw.',
  specs: [
    { term: 'VULNERABILITY ID', value: 'CVE-2021-44228 (CVSS 10.0 CRITICAL · CISA Emergency Directive 22-02)' },
    { term: 'AFFECTED COMPONENT', value: 'Apache log4j-core 2.0-beta9 – 2.14.1 (JndiLookup / MessagePatternConverter)' },
    { term: 'INGRESS SIGNAL', value: 'Nginx Access Logs + Suricata SID 2034649 (Header Lookup Pattern)' },
    { term: 'EGRESS SIGNAL', value: 'Zeek / Firewall Outbound TCP/389, 1389, 1099 From Java Web Tier' },
    { term: 'HOST DFIR SIGNAL', value: 'Linux auditd syscall=execve Where Parent Process = java -> sh/bash' },
    { term: 'PERMANENT FIX', value: 'Upgrade to Log4j 2.17.1+ (or 2.23+) + Strict App-Tier Egress Airlock' },
  ],
  nodes: [
    {
      id: 'ext_probe',
      label: 'External Probe (198.51.100.42)',
      sublabel: 'HTTP Header + External Directory',
      role: 'attacker',
      x: 10,
      y: 28,
      details: {
        osOrType: 'External Internet Scanner & Unverified Directory Endpoint',
        pidOrPort: 'HTTPS TCP/443 Inbound -> TCP/1389 Directory Callback',
        privilege: 'Unauthenticated Remote HTTP Client',
        artifacts: [
          'Places lookup directive inside routine logged HTTP header (e.g. X-Api-Version)',
          'Waits for vulnerable Java server to initiate outbound directory lookup',
          'Header obfuscation can evade naive regex WAF filters, making egress detection vital',
        ],
        description:
          'Unauthenticated remote client sending HTTP requests whose headers are routinely written into backend Java server logs.',
      },
    },
    {
      id: 'nginx_waf',
      label: 'EDGE-GW-02 (Nginx/WAF)',
      sublabel: 'Ingress Proxy & Access Logs',
      role: 'server',
      x: 34,
      y: 28,
      details: {
        osOrType: 'Reverse Proxy & Web Application Firewall',
        pidOrPort: 'TCP/443 -> Backend APP-JVM-01:8080',
        privilege: 'DMZ Edge Perimeter',
        artifacts: [
          'Captures raw HTTP headers in access logs for retrospective DFIR hunting',
          'Suricata SID 2034649 flags standard and nested lookup syntax',
          'Forwards legitimate-looking API traffic to internal Java application server',
        ],
        description:
          'Edge ingress proxy logging every incoming request before forwarding traffic to the internal billing JVM microservice.',
      },
    },
    {
      id: 'app_jvm',
      label: 'APP-JVM-01 (Log4j 2.14.1)',
      sublabel: 'java PID 4418 · JndiLookup',
      role: 'victim_host',
      x: 58,
      y: 28,
      details: {
        osOrType: 'Linux Java 11 Billing Microservice (10.20.40.22)',
        pidOrPort: 'java PID 4418 · log4j-core-2.14.1.jar',
        privilege: 'appuser (UID 1001 · Application Service Account)',
        artifacts: [
          'Logs X-Api-Version header through Log4j2 MessagePatternConverter',
          'Default formatMsgNoLookups=false evaluates JNDI lookup directives',
          'Attempts outbound LDAP/RMI lookup and unexpected child process spawn',
        ],
        description:
          'Internal Java web service bundling vulnerable log4j-core-2.14.1.jar that unintentionally evaluates logged strings as directory lookups.',
      },
    },
    {
      id: 'auditd_zeek',
      label: 'Zeek + Linux auditd',
      sublabel: 'Outbound 1389 & java->sh Alert',
      role: 'firewall_siem',
      x: 58,
      y: 68,
      details: {
        osOrType: 'Dual Network Egress & Linux Kernel Audit Plane',
        pidOrPort: 'Zeek LDAP/RMI + auditd syscall=59 (execve)',
        privilege: 'Evasion-Resistant Behavioral Detection',
        artifacts: [
          'Catches ANY outbound TCP/389/1389/1099 from DMZ Java servers',
          'Alerts immediately when parent process java spawns sh, bash, curl, or wget',
          'Immune to HTTP header string obfuscation tricks',
        ],
        description:
          'Behavioral detection layer pairing network egress telemetry with Linux kernel process execution logs.',
      },
    },
    {
      id: 'egress_airlock',
      label: 'Egress Airlock & 2.17.1+',
      sublabel: 'CISA ED 22-02 Hardened State',
      role: 'memory',
      x: 86,
      y: 44,
      details: {
        osOrType: 'Patched Log4j 2.17.1+ & Strict Outbound Firewall',
        pidOrPort: 'Deny Outbound 389/636/1389/1099 + Literal Logging',
        privilege: 'Defense-in-Depth Remediation',
        artifacts: [
          'Log4j 2.17.1+ disables message lookups permanently by default',
          'Egress airlock drops unexpected outbound directory connections from web tier',
          'SBOM inventory scanning prevents vulnerable nested shaded JARs from returning',
        ],
        description:
          'Hardened post-remediation architecture combining patched logging libraries with zero-trust server egress rules.',
      },
    },
  ],
  processTree: [
    {
      pid: 4418,
      ppid: 1,
      name: 'java (billing-api · log4j-core-2.14.1)',
      commandLine: '/usr/lib/jvm/java-11-openjdk/bin/java -jar /opt/billing/billing-api.jar',
      user: 'appuser (uid=1001)',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'org.apache.logging.log4j.core.pattern.MessagePatternConverter.format()',
        'org.apache.logging.log4j.core.lookup.JndiLookup.lookup() -> TCP/1389 Egress',
        'javax.naming.InitialContext.lookup() -> Caught by Zeek + Linux auditd',
      ],
      memoryBlocks: [
        {
          address: '0x00007F9A11200000',
          section: 'log4j-core-2.14.1.jar · JndiLookup Enabled (Vulnerable)',
          permissions: 'R-X',
          size: '48 KB',
          status: 'patched',
          description:
            'Loaded Log4j2 2.14.1 bytecode with message-pattern lookup substitution active by default (formatMsgNoLookups=false), allowing logged headers to invoke JndiManager.',
          hexPreview: '4A 6E 64 69 4C 6F 6F 6B 75 70 3D 45 4E 41 42 4C  JndiLookup=ENABL',
        },
        {
          address: '0x00007F9A11480000',
          section: 'JVM ClassLoader · Unverified External Naming Reference State',
          permissions: 'RW-',
          size: '32 KB',
          status: 'shellcode',
          description:
            'Runtime JNDI InitialContext resolution state attempting to fetch remote object attributes from external-dir.example:1389 before egress firewall and auditd intervention.',
          hexPreview: '6A 61 76 61 4E 61 6D 69 6E 67 52 65 66 65 72 65  javaNamingRefere',
        },
        {
          address: '0x00007F9A11640000',
          section: 'Patched log4j-core-2.17.1+ · Literal Message Logging Only',
          permissions: 'R--',
          size: '48 KB',
          status: 'clean',
          description:
            'Upgraded Apache Log4j2 2.17.1+ library state where message pattern lookups are removed completely and every HTTP header is recorded strictly as inert text.',
          hexPreview: '4C 4F 47 34 4A 5F 32 5F 31 37 5F 4C 49 54 45 52  LOG4J_2_17_LITER',
        },
      ],
    },
    {
      pid: 5102,
      ppid: 4418,
      name: 'sh (Anomalous Child Process · auditd Caught)',
      commandLine: '/bin/sh (Flagged by Linux auditd syscall=59 execve · ppid=4418 java)',
      user: 'appuser (uid=1001)',
      integrity: 'Low',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'Linux auditd syscall=59 (execve) -> ppid=4418 (java) -> comm=sh',
        'Immediate EDR/SIEM P1 containment alert on Java application server',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Untrusted HTTP Header Enters Logging Pipeline (Nginx & Suricata)',
      subtitle: 'Routine Header Logging Exposes Backend Java Service to Lookup Directives',
      description:
        'An unauthenticated external HTTP request places a JNDI lookup directive inside a routinely logged header (X-Api-Version), passing through EDGE-GW-02 into APP-JVM-01.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (CVE-2021-44228)',
      activeNodeIds: ['ext_probe', 'nginx_waf', 'app_jvm'],
      compromisedNodeIds: ['ext_probe'],
      keySpecs: [
        { term: 'INGRESS VECTOR', value: 'Any Logged Untrusted Field (User-Agent, X-Api-Version, Referer)' },
        { term: 'IDS SIGNATURE', value: 'Suricata SID 2034649 & OWASP CRS 944150' },
        { term: 'WAF CAVEAT', value: 'Nested Lookup Obfuscation Can Bypass Simple String Regex' },
      ],
    },
    {
      index: 2,
      title: 'Log4j2 MessagePatternConverter Evaluates Untrusted Text via JndiLookup',
      subtitle: 'Data Becomes Code When Log Messages Trigger Recursive Substitution',
      description:
        'Inside APP-JVM-01 (log4j-core-2.14.1.jar), MessagePatternConverter parses the untrusted header string as an active JNDI lookup command rather than plain literal text.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Log4j2 Recursive Message Lookup Evaluation',
      activeNodeIds: ['nginx_waf', 'app_jvm', 'auditd_zeek'],
      compromisedNodeIds: ['ext_probe', 'app_jvm'],
      keySpecs: [
        { term: 'VULNERABLE JAR', value: 'log4j-core-2.14.1.jar (All 2.0-beta9 through 2.14.1)' },
        { term: 'ROOT CAUSE', value: 'formatMsgNoLookups=false Invokes JndiLookup on User Data' },
        { term: 'SBOM HUNTING', value: 'Scan Shaded/Nested Fat JARs & WAR Archives Across Fleet' },
      ],
    },
    {
      index: 3,
      title: 'Outbound Directory Callback & Unexpected Java Child Process (Zeek + auditd)',
      subtitle: 'Evasion-Resistant Behavioral Detection Beats Header Obfuscation Every Time',
      description:
        'When the JVM opens an outbound TCP/1389 directory connection or spawns a child shell, Zeek egress logs and Linux auditd execve (ppid=java) catch the intrusion with zero reliance on header syntax.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Unix Shell Spawned by Java Application Server',
      activeNodeIds: ['app_jvm', 'ext_probe', 'auditd_zeek'],
      compromisedNodeIds: ['ext_probe', 'app_jvm'],
      keySpecs: [
        { term: 'EGRESS TELEMETRY', value: 'Zeek / Firewall Outbound TCP/389, 1389, 1099 From App Tier' },
        { term: 'HOST TELEMETRY', value: 'Linux auditd syscall=59 (execve) parent_comm=java -> sh/bash' },
        { term: 'DFIR ADVANTAGE', value: '100% Immune to Nested Lookup String Obfuscation' },
      ],
    },
    {
      index: 4,
      title: 'CISA ED 22-02 Remediation: Log4j 2.17.1+ Upgrade & Strict Egress Airlock',
      subtitle: 'Permanent Library Fix Paired With Zero-Trust Outbound Firewall Policy',
      description:
        'Defenders block all outbound LDAP/RMI traffic from web tiers, upgrade to Log4j 2.17.1+ (disabling message lookups permanently), re-image affected hosts, and rotate exposed app tokens.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Vulnerability Patching & Application Egress Filtering',
      activeNodeIds: ['app_jvm', 'auditd_zeek', 'egress_airlock'],
      compromisedNodeIds: ['ext_probe'],
      keySpecs: [
        { term: 'LIBRARY PATCH', value: 'Upgrade log4j-core to >= 2.17.1 (2.23+ Current LTS)' },
        { term: 'EGRESS AIRLOCK', value: 'Deny Outbound TCP/389, 636, 1389, 1099 From Web/App Subnets' },
        { term: 'IR HYGIENE', value: 'Re-Image Compromised Container/VM + Rotate Cloud/API Secrets' },
      ],
    },
  ],
  telemetry: LOG4SHELL_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'log4shell-dfir',
  briefing: {
    headline: 'Apache Log4j2 "Log4Shell" (CVE-2021-44228): JNDI Lookup Forensics, Egress Telemetry & CISA ED 22-02',
    storyAnalogy:
      'Picture an automated corporate mailroom where a high-speed printing press stamps the return address of every arriving parcel straight into the daily ledger. Because the press mistakenly obeys special pickup orders written on an envelope label instead of treating them as plain ink, a crafted parcel tricks the mailroom into firing a vacuum canister across the street to an unverified annex warehouse to fetch a foreign assembly blueprint—until perimeter guards slam an emerald egress airlock over the outbound tube, catch the mailroom clerk unexpectedly grabbing a workshop wrench, and upgrade the press to print every label strictly as plain text.',
    plainSummary:
      'In this scenario (CVE-2021-44228, Apache Log4j2 Log4Shell JNDI Forensics) targeting APP-JVM-01 through EDGE-GW-02, an untrusted HTTP header crosses from passive log text into active remote code execution along one continuous intrusion path. First, an external probe injects a JNDI lookup header past the edge proxy, then vulnerable log4j-core 2.14.1 evaluates the string through MessagePatternConverter and JndiLookup, then the Java process initiates an abnormal outbound directory callback and spawns a child shell process caught by Zeek and Linux auditd, and finally defenders enforce Log4j 2.17.1+ upgrades and strict egress airlocks. Steps #1 through #4 trace each web, JVM, network, and remediation handoff, while the Memory Forensics section contrasts vulnerable Log4j 2.14.1 lookup evaluation against hardened 2.17.1+ literal logging.',
    diagramTopologySummary:
      'Five-node web-to-host forensic chain linking External Probe (198.51.100.42), EDGE-GW-02 Nginx/WAF, APP-JVM-01 running log4j-core-2.14.1, Zeek + Linux auditd behavioral detection, and the hardened Egress Airlock + Log4j 2.17.1+ posture.',
    documentedAdvisory:
      'Grounded in NIST NVD & Apache Logging CVE-2021-44228, CISA Emergency Directive 22-02, and Swiss NCSC (GOVCERT.ch) forensic guidance.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1190',
      plainTitle: 'Untrusted HTTP Header Enters Logging Pipeline (Nginx & Suricata)',
      storyAnalogy:
        'An ordinary-looking parcel rolls down the inbound mailroom sorting belt with an unusual bracketed pickup note stamped onto its return label. Even before reaching the main press, the front desk cameras photograph every parcel label so investigators can review who sent it.',
      simpleExplanation:
        'Almost every production web service logs routine HTTP request fields—such as User-Agent, X-Api-Version, or Referer—for troubleshooting and observability (the standard diagnostic telemetry written to application logs). In CVE-2021-44228, simply logging an untrusted header through vulnerable Log4j2 was enough to trigger lookup evaluation, which is why edge Nginx logs and Suricata SID 2034649 serve as the first forensic checkpoint.',
      howItWorksInPractice:
        'When 198.51.100.42 sends an HTTP request to EDGE-GW-02 carrying a JNDI lookup pattern inside X-Api-Version, Nginx preserves the full header in ingress access logs while Suricata SID 2034649 and OWASP CRS rule 944150 raise an immediate warning. Crucially, GOVCERT.ch and CISA noted early in December 2021 that attackers rapidly adopted nested string transformations (like lower/upper case substitutions) to slip past naive static WAF regexes. Consequently, defenders must treat ingress WAF alerts as an early tripwire—never as their sole line of defense.',
      diagramAlignment:
        'Follow Step #1 / Link #1 as Node 1 (External Probe 198.51.100.42) passes an untrusted header through Node 2 (EDGE-GW-02 Nginx/WAF) toward Node 3 (APP-JVM-01).',
      detectionAndEvidence:
        'Inspect Nginx and Apache access logs alongside Suricata SID 2034649 and OWASP CRS rule 944150 for JNDI lookup strings in HTTP headers, while keeping obfuscation-proof outbound egress and host behavioral rules continuously armed.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1190',
      plainTitle: 'Log4j2 MessagePatternConverter Evaluates Untrusted Text via JndiLookup',
      storyAnalogy:
        'Inside the cutaway mailroom press, instead of printing the return label as harmless ink, the over-helpful sorting gears recognize the special pickup bracket and treat the outsider’s note as a live internal dispatch command.',
      simpleExplanation:
        'Log4j2’s MessagePatternConverter (the formatting module that renders log lines before writing them to disk) supported dynamic variable substitution including JndiLookup (Java Naming and Directory Interface, a Java API used to look up directory objects over LDAP, RMI, or DNS). Because log4j2.formatMsgNoLookups defaulted to false in log4j-core 2.0-beta9 through 2.14.1, untrusted data inside a log message silently crossed the boundary from passive text into active network behavior.',
      howItWorksInPractice:
        'On APP-JVM-01 (PID 4418), the billing microservice logs the incoming X-Api-Version string using logger.info(). Inside log4j-core-2.14.1.jar, MessagePatternConverter recursively resolves lookup expressions and passes the extracted URI directly to JndiManager and javax.naming.InitialContext.lookup(). A major operational challenge during CISA ED 22-02 response was discovering hidden copies of log4j-core nested inside shaded "fat JARs", WAR files, and third-party vendor appliances—making automated SBOM and filesystem/runtime JAR inventory scanning mandatory.',
      diagramAlignment:
        'Follow Step #2 / Link #2 as Node 3 (APP-JVM-01 Log4j 2.14.1) evaluates the logged header inside java PID 4418 and alerts Node 4 (Zeek + Linux auditd).',
      detectionAndEvidence:
        'Correlate automated SBOM and JVM classpath inventory scans across shaded JAR, WAR, and EAR archives (locating log4j-core < 2.17.1) with Linux auditd / Sysmon EID 7 class-load telemetry and SIEM alerts on active JndiLookup resolution.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1059.004',
      plainTitle: 'Outbound Directory Callback & Unexpected Java Child Process (Zeek + auditd)',
      storyAnalogy:
        'The mailroom press shoots a glowing canister out through the street-side vacuum tube toward an unverified annex warehouse, and moments later the mailroom clerk unexpectedly picks up a heavy workshop wrench—tripping both the street-tube radar and the internal workshop alarm simultaneously.',
      simpleExplanation:
        'Regardless of how heavily an attacker obfuscates an inbound HTTP header, exploitation must still cause the Java application server to perform two highly abnormal behaviors: opening an outbound directory connection (TCP/389, 1389, or 1099 caught by Zeek/firewalls) and/or spawning a child OS shell (Linux auditd syscall=59 execve where parent process is java). Both signals are completely immune to HTTP string obfuscation.',
      howItWorksInPractice:
        'Production web and billing microservices like APP-JVM-01 (10.20.40.22) have zero legitimate reason to initiate outbound LDAP or RMI connections to external Internet IPs (198.51.100.42:1389) or to fork interactive shell interpreters (/bin/sh, bash, curl, wget) as child processes of PID 4418 (java). Zeek logs the outbound directory handshake and javaNamingReference lookup instantaneously, while Linux auditd records syscall=59 (execve) linking ppid=4418 (java) to pid=5102 (sh). Correlating these two behavioral events delivers rock-solid DFIR proof of active exploitation rather than mere Internet scanning.',
      diagramAlignment:
        'Follow Step #3 / Link #3 as Node 3 (APP-JVM-01) attempts an outbound lookup back to Node 1 while Node 4 (Zeek + Linux auditd) flags both the TCP/1389 egress and java->sh execve.',
      detectionAndEvidence:
        'Alert immediately via Zeek and perimeter firewalls on any outbound TCP/389, 1389, or 1099 connection initiated by web/application tiers, correlated with Linux auditd syscall=59 execve logs showing parent_comm=java spawning sh, bash, curl, or wget.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1190',
      plainTitle: 'CISA ED 22-02 Remediation: Log4j 2.17.1+ Upgrade & Strict Egress Airlock',
      storyAnalogy:
        'Responding to the dual alarms, facility engineers slam an emerald egress airlock permanently across every outbound street tube, swap the mailroom press core to a literal-ink-only model that ignores bracketed notes forever, and replace any exposed workshop badges.',
      simpleExplanation:
        'Following CISA Emergency Directive 22-02, durable remediation layers two independent controls: upgrading every Java workload to Apache Log4j 2.17.1 or newer (which completely removes message lookup evaluation and restricts JNDI by default) and enforcing a strict egress firewall airlock (blocking outbound LDAP, LDAPS, and RMI ports from application subnets so future deserialization or lookup flaws cannot call home).',
      howItWorksInPractice:
        'Apache’s initial 2.15.0/2.16.0 releases were quickly superseded by Log4j 2.17.1+ (and modern 2.23+ LTS releases), which permanently disable message pattern lookups and harden JNDI configuration. Where active post-exploitation (such as a java->sh execve event) is confirmed, patching in place is not enough: incident responders isolate and re-image APP-JVM-01 from a clean immutable build artifact, rotate all database/cloud/API secrets accessible to appuser, verify no persistent cron jobs or SSH keys remain, and enforce default-deny outbound firewall policies on DMZ application tiers.',
      diagramAlignment:
        'Follow Step #4 / Link #4 as Node 5 (Egress Airlock & 2.17.1+) locks down outbound traffic from Node 3 (APP-JVM-01) and verifies clean literal-only logging across the tier.',
      detectionAndEvidence:
        'Confirm zero log4j-core artifacts below 2.17.1 remain across SBOM scans, verify Zeek and perimeter firewall logs actively deny outbound TCP/389, 636, 1389, and 1099 from application subnets, and monitor SIEM/auditd after rotating exposed service credentials.',
    },
  ],
};
