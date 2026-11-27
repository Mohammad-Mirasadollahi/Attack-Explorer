import type { TelemetryEvent } from '../types';

export const LOG4SHELL_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'log4j-evt-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.312',
    sourceNodeId: 'ext_probe',
    targetNodeId: 'nginx_waf',
    sourceLabel: 'External Probe (198.51.100.42)',
    targetLabel: 'EDGE-GW-02 (Nginx/WAF)',
    sourceType: 'IDS_ALERT',
    protocolOrEventId: 'Nginx Access / Suricata 2034649',
    shortAction: 'HEADER LOOKUP PROBE',
    info: 'External HTTP request places a JNDI lookup pattern inside X-Api-Version header logged by EDGE-GW-02 and flagged by Suricata SID 2034649',
    sizeOrCode: 'HTTP 200',
    severity: 'HIGH',
    mitreId: 'T1190',
    explanation:
      'Production web applications routinely log HTTP headers such as User-Agent and X-Api-Version. While Nginx access logs and Suricata SID 2034649 provide early visibility, nested string transformations can evade static WAF regexes—making downstream egress and host detection essential.',
    rawLog: `src_ip=198.51.100.42 dst_host=api-billing-01.corp.local method=GET uri=/api/v2/health
header_name=X-Api-Version
header_signature=[DEFANGED_JNDI_LOOKUP_TOKEN -> external-dir.example:1389/audit]
waf_rule=CRS-944150-LOG4J-JNDI-OBFUSCATION-DETECTED | forwarded_to=app-jvm-01:8080`,
    detectionRule: {
      type: 'SURICATA',
      title: 'Inbound JNDI Lookup Header Pattern (CVE-2021-44228)',
      ruleCode: `alert http $EXTERNAL_NET any -> $HTTP_SERVERS any (msg:"DFIR CVE-2021-44228 Inbound JNDI Lookup Header Pattern"; flow:established,to_server; http.header; content:"jndi"; nocase; pcre:"/\\x24\\x7b[^\\x7d]{0,40}jndi/i"; sid:2034649; rev:3;)`,
      mitigation:
        'Log full HTTP headers for retrospective DFIR hunting, but never rely on ingress WAF regexes alone—prioritize upgrading log4j-core to 2.17.1+.',
    },
  },
  {
    id: 'log4j-evt-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:00.840',
    sourceNodeId: 'nginx_waf',
    targetNodeId: 'app_jvm',
    sourceLabel: 'EDGE-GW-02 (Proxy)',
    targetLabel: 'APP-JVM-01 (log4j-core 2.14.1)',
    sourceType: 'MEMORY_SCAN',
    protocolOrEventId: 'SBOM / JVM Classpath Audit',
    shortAction: 'JNDILOOKUP EVAL',
    info: 'Vulnerable log4j-core-2.14.1.jar (formatMsgNoLookups=false) inside java PID 4418 evaluates untrusted logged header via MessagePatternConverter',
    sizeOrCode: '2.14.1',
    severity: 'CRITICAL',
    mitreId: 'T1190',
    explanation:
      'In Apache Log4j2 2.0-beta9 through 2.14.1, MessagePatternConverter recursively resolved lookup expressions embedded in untrusted log text by default. Finding nested shaded copies of log4j-core inside fat JARs and WAR files requires automated SBOM and runtime classpath scanning.',
    rawLog: `Host=APP-JVM-01.corp.local | Process=java (PID 4418) | User=appuser (uid=1001)
LoadedArtifact=/opt/billing/billing-api.jar!/BOOT-INF/lib/log4j-core-2.14.1.jar
Converter=org.apache.logging.log4j.core.pattern.MessagePatternConverter.format()
LookupClass=org.apache.logging.log4j.core.lookup.JndiLookup (formatMsgNoLookups=false)`,
    detectionRule: {
      type: 'YARA',
      title: 'Detect Vulnerable log4j-core JndiLookup Class Across Shaded JARs',
      ruleCode: `rule DFIR_Vulnerable_Log4j2_JndiLookup_Present {
  meta:
    description = "Flags unpatched log4j-core archives bundling JndiLookup prior to 2.17.1"
    cve = "CVE-2021-44228"
  strings:
    $jndi = "org/apache/logging/log4j/core/lookup/JndiLookup.class" ascii
    $ver = "2.14." ascii
  condition:
    $jndi and $ver
}`,
      mitigation:
        'Run continuous SBOM and container/filesystem JAR scans to discover and upgrade every nested log4j-core artifact to >= 2.17.1 (or 2.23+ LTS).',
    },
  },
  {
    id: 'log4j-evt-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:01.295',
    sourceNodeId: 'app_jvm',
    targetNodeId: 'auditd_zeek',
    sourceLabel: 'APP-JVM-01 (java PID 4418)',
    targetLabel: 'Zeek TCP/1389 + Linux auditd',
    sourceType: 'LINUX_AUDIT',
    protocolOrEventId: 'Zeek LDAP + auditd syscall=59',
    shortAction: 'EGRESS 1389 + JAVA->SH',
    info: 'Zeek catches outbound TCP/1389 directory lookup from APP-JVM-01 while Linux auditd flags syscall=59 (execve) with parent java spawning /bin/sh',
    sizeOrCode: 'PID 5102',
    severity: 'CRITICAL',
    mitreId: 'T1059.004',
    explanation:
      'Regardless of HTTP header string obfuscation, active Log4Shell exploitation leaves two evasion-resistant behavioral traces: an outbound directory connection (TCP/389, 1389, or 1099) from a DMZ Java server and an anomalous child OS shell spawned by java.',
    rawLog: `# Zeek conn.log / ldap.log
id.orig_h=10.20.40.22 (APP-JVM-01) -> id.resp_h=198.51.100.42:1389 | proto=tcp | attr=javaNamingReference
---
# Linux auditd (/var/log/audit/audit.log)
type=SYSCALL arch=c000003e syscall=59 (execve) success=yes ppid=4418 (java) pid=5102 comm="sh" exe="/usr/bin/dash" uid=1001`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Java Application Server Spawning Interactive Unix Shell (auditd execve)',
      ruleCode: `title: Java Process Spawning Unexpected Shell Interpreter (Log4Shell Post-Exploitation)
status: stable
logsource:
  product: linux
  service: auditd
detection:
  selection:
    type: SYSCALL
    syscall: '59'
    parent_comm: 'java'
    comm:
      - 'sh'
      - 'bash'
      - 'dash'
      - 'curl'
      - 'wget'
  condition: selection
level: critical`,
      mitigation:
        'Alert immediately on outbound LDAP/RMI from web tiers and any java -> shell process spawn; isolate and capture memory before rebuilding.',
    },
  },
  {
    id: 'log4j-evt-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:06.104',
    sourceNodeId: 'auditd_zeek',
    targetNodeId: 'egress_airlock',
    sourceLabel: 'CISA ED 22-02 Response',
    targetLabel: 'Egress Airlock & Log4j 2.17.1+',
    sourceType: 'NETWORK',
    protocolOrEventId: 'Egress Deny + 2.17.1+ Patch',
    shortAction: 'AIRLOCK + 2.17.1+ FIX',
    info: 'Engineers deny outbound TCP/389/636/1389/1099 from DMZ app tiers, deploy log4j-core 2.17.1+, re-image APP-JVM-01, and rotate service credentials',
    sizeOrCode: '2.17.1+',
    severity: 'INFO',
    mitreId: 'T1190',
    explanation:
      'Durable remediation pairs upgrading log4j-core to 2.17.1+ (which removes message lookup evaluation permanently) with strict DMZ egress airlocks so application servers can never initiate unapproved external directory lookups.',
    rawLog: `Action=CISA_ED_22_02_REMEDIATION | Workload=APP-JVM-01
FirewallEgress=DENY outbound TCP/389, 636, 1389, 1099 from DMZ_APP_SUBNET
ArtifactUpgrade=log4j-core-2.17.1+ (Message Lookups Permanently Disabled)
PostBreachIR=Re-imaged container from clean CI build + rotated DB/API tokens`,
    detectionRule: {
      type: 'KQL',
      title: 'Verify Zero Outbound Directory Connections From Web/App Subnets',
      ruleCode: `CommonSecurityLog
| where SourceIP startswith "10.20.40."
| where DestinationPort in (389, 636, 1389, 1099)
| summarize AttemptCount=count() by SourceIP, DestinationIP, DestinationPort, DeviceAction`,
      mitigation:
        'Enforce CI/CD SBOM policy gates blocking log4j-core < 2.17.1 and maintain default-deny outbound firewall rules on application subnets.',
    },
  },
];
