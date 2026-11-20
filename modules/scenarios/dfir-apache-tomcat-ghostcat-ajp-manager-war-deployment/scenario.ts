import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment',
    title: 'Apache Tomcat Security & CISA DFIR — Tomcat AJP Ghostcat (CVE-2020-1938) & /manager/text/deploy WAR Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1190',
    description:
      'Grounded in Official Apache Tomcat Security Advisories (CVE-2020-1938), Chaitin Tech Ghostcat research, and CISA web server DFIR guides: an attacker connects to an exposed Apache JServ Protocol (AJP/1.3) listener on TCP 8009, sets the request attributes javax.servlet.include.request_uri and javax.servlet.include.path_info="/WEB-INF/web.xml" to read internal configuration credentials, and authenticates to /manager/text/deploy (logged in localhost_access_log.*.txt and catalina.out) to deploy a malicious .war archive.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'AJP13 & HTTP Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AJP Connector (:8009)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'org.apache.catalina.startup', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'localhost_access_log & catalina', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'webapps/metrics.war & JSP', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: AJP/1.3 Port 8009 javax.servlet.include.path_info File Read (CVE-2020-1938 Ghostcat)',
        narration:
          'Because Apache Tomcat prior to 9.0.31 bound the AJP/1.3 connector on 0.0.0.0:8009 without a requiredSecret, the attacker sends a binary AJP13 Forward Request (magic 0x1234) setting javax.servlet.include.request_uri="/" and javax.servlet.include.path_info="/WEB-INF/web.xml". Tomcat’s DefaultServlet serves the raw contents of WEB-INF/web.xml (which is normally blocked over HTTP 8080), leaking credentials for the Tomcat Manager role.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application: CVE-2020-1938 Ghostcat)',
        technicalCommands: [
          'AJP13 Binary Packet (:8009): Magic=0x1234 Prefix=0x02 (JK_AJP13_FORWARD_REQUEST)',
          'AJP Request Attributes: javax.servlet.include.request_uri="/" | javax.servlet.include.path_info="/WEB-INF/web.xml"',
          'Server Config: conf/server.xml <Connector protocol="AJP/1.3" address="0.0.0.0" port="8009" />',
        ],
        defenseMitigation:
          'Disable the AJP/1.3 connector in conf/server.xml if unused, or bind it strictly to address="127.0.0.1" with secretRequired="true" and a high-entropy secret.',
        logs: [
          {
            id: 'dfir-tomcat-1',
            timestamp: '08:12:04.115',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 8009,
            ProcessName: 'java',
            CommandLine: 'Suricata AJP13 Forward Request javax.servlet.include.path_info=/WEB-INF/web.xml',
            raw: 'suricata_alert: sid=2029491 msg="ET WEB_SERVER Apache Tomcat AJP Connector Ghostcat File Read (CVE-2020-1938)" src_ip=198.51.100.41 dest_ip=10.20.4.80 dest_port=8009 proto=TCP payload_ascii="..javax.servlet.include.path_info../WEB-INF/web.xml"',
            parsedFields: {
              Vulnerability: 'CVE-2020-1938 (Apache Tomcat AJP Ghostcat)',
              PortAndProtocol: 'TCP 8009 (Binary AJP/1.3 Magic 0x1234)',
              InjectedAttribute: 'javax.servlet.include.path_info = /WEB-INF/web.xml',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Authenticated WAR Upload via PUT /manager/text/deploy (localhost_access_log & catalina.out)',
        narration:
          'Using the leaked manager-script credentials, the actor sends PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1 on port 8080. Tomcat records the HTTP PUT request in logs/localhost_access_log.2026-11-03.txt and logs "org.apache.catalina.startup.HostConfig.deployWAR Deploying web application archive [/opt/tomcat/webapps/metrics_probe.war]" in logs/catalina.out.',
        activeNodes: ['attacker', 'target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.003 - Server Software Component: Tomcat WAR Deployment)',
        technicalCommands: [
          'Tomcat Access Log: "PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1" 200 58',
          'catalina.out: INFO [http-nio-8080-exec-4] org.apache.catalina.startup.HostConfig.deployWAR Deploying web application archive [/opt/tomcat/webapps/metrics_probe.war]',
        ],
        defenseMitigation:
          'Remove the webapps/manager and webapps/host-manager applications on production Tomcat instances, or restrict them via org.apache.catalina.valves.RemoteAddrValve.',
        logs: [
          {
            id: 'dfir-tomcat-2',
            timestamp: '08:12:11.540',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'java',
            CommandLine: 'HostConfig.deployWAR Deploying /opt/tomcat/webapps/metrics_probe.war',
            raw: 'localhost_access_log: 198.51.100.41 - tomcat_admin [03/Nov/2026:08:12:11 +0000] "PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1" 200 58 | catalina.out: org.apache.catalina.startup.HostConfig.deployWAR Deploying web application archive [/opt/tomcat/webapps/metrics_probe.war]',
            parsedFields: {
              AccessLogFile: '/opt/tomcat/logs/localhost_access_log.2026-11-03.txt',
              CatalinaLogEvent: 'HostConfig.deployWAR [/opt/tomcat/webapps/metrics_probe.war]',
              AuthenticatedUser: 'tomcat_admin (Role: manager-script)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Jasper JSP Compilation (work/Catalina/localhost/*/*_jsp.class) & JVM Child Process Execution',
        narration:
          'When the actor requests GET /metrics_probe/health.jsp, Apache Jasper compiles health.jsp into health_jsp.java and health_jsp.class inside /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/ (persisting on disk even if the .jsp file is deleted) and executes Runtime.getRuntime().exec(), logged by Linux auditd under the java parent PID.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1505.003 - Jasper work/Catalina/*_jsp.class Artifact & JVM Child Shell)',
        technicalCommands: [
          'Compiled JSP Artifact: /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.class',
          'Linux auditd SYSCALL: syscall=59 (execve) ppid=1420 (java) uid=991 (tomcat) exe="/usr/bin/bash"',
        ],
        defenseMitigation:
          'Inspect /opt/tomcat/work/Catalina/localhost/ for compiled *_jsp.java and *_jsp.class files during Tomcat DFIR investigations—even if an attacker undeploys or deletes the .jsp file, the generated Java source often remains in work/.',
        logs: [
          {
            id: 'dfir-tomcat-3',
            timestamp: '08:12:18.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'java',
            CommandLine: 'java (org.apache.catalina.startup.Bootstrap) spawning /bin/sh via health_jsp.class',
            raw: 'type=SYSCALL msg=audit(1762157538.902:8912): arch=c000003e syscall=59 (execve) success=yes ppid=1420 pid=3910 uid=991 comm="sh" exe="/usr/bin/bash" | JasperArtifact="/opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.class"',
            parsedFields: {
              ParentJvmProcess: '/usr/lib/jvm/jre/bin/java (org.apache.catalina.startup.Bootstrap)',
              JasperCacheArtifact: 'work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.java',
              AuditSyscall: '59 (sys_execve spawning /bin/sh)',
            },
          },
        ],
      },
    ],
  };
