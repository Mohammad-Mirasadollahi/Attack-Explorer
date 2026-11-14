import { AttackScenario } from './attack-scenarios';
import { BATCH_1_TO_4_ATTRIBUTIONS } from './batch1-to-4-attributions-and-intel';

export interface SourceCitation {
  id: string;
  organization: string;
  title: string;
  referenceCode: string;
  licenseOrTerms: string;
  url: string;
  usageSummary: string;
}

export interface ScenarioAttributionProfile {
  scenarioId: string;
  scenarioCode: string;
  mitreTechniques: Array<{
    id: string;
    name: string;
    tactic: string;
    url: string;
  }>;
  /** Explains how the multiple independent vendor/CERT analyses complement one another across the kill chain */
  multiSourceSynthesis: string;
  primarySources: SourceCitation[];
  syntheticDataNotice: string;
}

export const LEGAL_COMPLIANCE_STATEMENT = {
  headline: 'Educational & Defensive Cybersecurity Research Notice',
  copyrightAttribution:
    'MITRE ATT&CK® and CVE® are registered trademarks of The MITRE Corporation. Sysmon and Windows Event Auditing schemas are documented by Microsoft Corporation. Sigma detection rules are modeled after the open-source SigmaHQ standard (DRL 1.1).',
  syntheticDataGuarantee:
    '100% Synthetic & De-identified Telemetry: All IP addresses (RFC 1918 private ranges 10.10.0.0/16, 172.16.0.0/12 and test/documentation blocks), hostnames (WKS-04.corp.local, CORP-DC01.corp.local), memory addresses, process IDs, and log payloads in this workbench are synthetic simulations created strictly for defensive SOC training, threat modeling, and DFIR education.',
  noHarmfulCodeGuarantee:
    'Safe Simulation Guarantee: No live exploit payloads, weaponized shellcode, or proprietary customer logs are included or executed. All hex previews and API call chains represent benign educational signatures used to train blue-team analysts on detection engineering.',
};

export const GLOBAL_FRAMEWORK_SOURCES: SourceCitation[] = [
  {
    id: 'mitre-attack-enterprise',
    organization: 'The MITRE Corporation',
    title: 'MITRE ATT&CK® Enterprise Matrix (v15)',
    referenceCode: 'ATT&CK-ENTERPRISE-V15',
    licenseOrTerms: 'MITRE ATT&CK® Terms of Use / Apache 2.0',
    url: 'https://attack.mitre.org/matrices/enterprise/',
    usageSummary:
      'Used for adversary tactic categorization, technique IDs (T1055.012, T1562.001, T1486, T1190, T1558.003, T1071.004), and defensive mitigation mapping.',
  },
  {
    id: 'microsoft-sysmon-docs',
    organization: 'Microsoft Learn / Sysinternals',
    title: 'System Monitor (Sysmon) v15 & Windows Security Auditing Events',
    referenceCode: 'MS-SYSMON-EID-1-25',
    licenseOrTerms: 'Microsoft Open Documentation License (CC BY 4.0)',
    url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon',
    usageSummary:
      'Used to structure XML EventLog schemas for Sysmon Event IDs 1, 3, 8, 10, 11, 22, 25 and Windows Security Event IDs 4624, 4688, 4769, and PowerShell 4104.',
  },
  {
    id: 'sigmahq-detection-rules',
    organization: 'SigmaHQ Open Detection Community',
    title: 'Sigma Generic Signature Format for SIEM Systems',
    referenceCode: 'SIGMAHQ-RULES-SPEC',
    licenseOrTerms: 'Detection Rule License (DRL 1.1) / LGPv2',
    url: 'https://github.com/SigmaHQ/sigma',
    usageSummary:
      'Used as the structural specification for defensive SIEM detection rules shown in the Inspector panel.',
  },
  {
    id: 'cisa-nist-advisories',
    organization: 'CISA & NIST National Vulnerability Database (NVD)',
    title: 'CISA Cybersecurity Advisories & NIST SP 800-86 DFIR Guide',
    referenceCode: 'NIST-SP-800-86 / CISA-AA',
    licenseOrTerms: 'U.S. Government Public Domain (17 U.S.C. § 105)',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    usageSummary:
      'Used for incident response workflow modeling, CVE-2021-44228 (Log4Shell) forensic artifacts, and ransomware shadow-copy deletion indicators.',
  },
];

export const SCENARIO_ATTRIBUTION_MAP: Record<
  string,
  ScenarioAttributionProfile
> = {
  'process-hollowing': {
    scenarioId: 'process-hollowing',
    scenarioCode: 'T1055.012',
    mitreTechniques: [
      {
        id: 'T1055.012',
        name: 'Process Injection: Process Hollowing',
        tactic: 'Defense Evasion / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1055/012/',
      },
      {
        id: 'T1106',
        name: 'Native API Execution (CreateProcessW / NtUnmapViewOfSection)',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1106/',
      },
      {
        id: 'T1071.001',
        name: 'Application Layer Protocol: Web Protocols (HTTPS C2)',
        tactic: 'Command and Control',
        url: 'https://attack.mitre.org/techniques/T1071/001/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft Win32 API specifications define the exact CREATE_SUSPENDED (0x4), NtUnmapViewOfSection, VirtualAllocEx, and SetThreadContext (RCX) register mechanics; (2) Elastic Security Labs memory-hunting research explains how unbacked PAGE_EXECUTE_READWRITE (0x40) VAD regions and kernel EtwTiLogAllocVMRemote callbacks expose the hollowed image; and (3) Microsoft Sysinternals & MITRE ATT&CK document Sysmon EventID 25 (ProcessTampering: Image is replaced) and parent-process anomalies.',
    primarySources: [
      {
        id: 'ms-win32-proc-api',
        organization: 'Microsoft Win32 API Reference',
        title: 'CreateProcessW (CREATE_SUSPENDED), VirtualAllocEx & WriteProcessMemory',
        referenceCode: 'MSDN-WIN32-MEMORY',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw',
        usageSummary:
          'Documents the Win32 virtual memory and thread context APIs modeled in stages 1–4.',
      },
      {
        id: 'sysmon-eid25-tampering',
        organization: 'Microsoft Sysinternals',
        title: 'Sysmon Event ID 25: ProcessTampering (Image is replaced)',
        referenceCode: 'SYSMON-EID-25',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-25-processtampering',
        usageSummary:
          'Defines the telemetry schema when a process image is unmapped and replaced in user-mode memory.',
      },
      {
        id: 'elastic-memory-injection-etw',
        organization: 'Elastic Security Labs',
        title: 'Hunting Memory Injection & Process Tampering via Kernel ETW Threat Intelligence',
        referenceCode: 'ELASTIC-MEM-ETW',
        licenseOrTerms: 'Elastic Security Labs Research Publication',
        url: 'https://www.elastic.co/security-labs',
        usageSummary:
          'Provides Virtual Address Descriptor (VAD) private RWX inspection and EtwTiLogAllocVMRemote detection logic.',
      },
    ],
    syntheticDataNotice:
      'Process Invoice_Q4.exe (PID 3104) and hollowed svchost.exe (PID 4892) on WKS-04 (10.10.4.15) are synthetic lab traces.',
  },
  'amsi-reflective-dll': {
    scenarioId: 'amsi-reflective-dll',
    scenarioCode: 'T1562.001',
    mitreTechniques: [
      {
        id: 'T1562.001',
        name: 'Impair Defenses: Disable or Modify Tools (AMSI Bypass)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1562/001/',
      },
      {
        id: 'T1059.001',
        name: 'Command and Scripting Interpreter: PowerShell',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1059/001/',
      },
      {
        id: 'T1620',
        name: 'Reflective Code Loading',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1620/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft AMSI Architecture documentation defines how powershell.exe invokes amsi.dll!AmsiScanBuffer before script evaluation; (2) MDSec & MITRE T1562.001/T1620 research details the 6-byte VirtualProtect prologue patch (mov eax, 0x80070057; ret) and in-memory CLR [System.Reflection.Assembly]::Load($bytes) execution; and (3) Microsoft PowerShell Team & Defender TI document how EventID 4104 captures the initial bypass script block and how EtwTiLogProtectVM detects amsi.dll code-page modification.',
    primarySources: [
      {
        id: 'ms-amsi-architecture',
        organization: 'Microsoft Learn',
        title: 'Antimalware Scan Interface (AMSI) Developer Architecture',
        referenceCode: 'MS-AMSI-ARCH',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/windows/win32/amsi/antimalware-scan-interface-portal',
        usageSummary:
          'Describes how amsi.dll and AmsiScanBuffer inspect PowerShell script blocks prior to execution.',
      },
      {
        id: 'ps-eid-4104',
        organization: 'Microsoft PowerShell Team',
        title: 'PowerShell Operational Log Event ID 4104 (Script Block Logging)',
        referenceCode: 'MS-PS-EID-4104',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows',
        usageSummary:
          'Documents de-obfuscated script block capture used to detect P/Invoke VirtualProtect calls.',
      },
      {
        id: 'mitre-t1620-clr-reflection',
        organization: 'The MITRE Corporation & Defender Threat Intelligence',
        title: 'MITRE ATT&CK T1620 & T1562.001: Reflective Code Loading & AMSI Memory Patching',
        referenceCode: 'ATT&CK-T1620-T1562',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1620/',
        usageSummary:
          'Details in-memory CLR assembly loading, Stephen Fewer ReflectiveLoader stubs, and ETW EtwTiLogProtectVM telemetry.',
      },
    ],
    syntheticDataNotice:
      'All memory offsets (0x7FF8A4123340) and byte patches represent documented educational signatures for defenders.',
  },
  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    scenarioCode: 'T1486 / T1490',
    mitreTechniques: [
      {
        id: 'T1490',
        name: 'Inhibit System Recovery (vssadmin / wmic shadowcopy delete)',
        tactic: 'Impact',
        url: 'https://attack.mitre.org/techniques/T1490/',
      },
      {
        id: 'T1486',
        name: 'Data Encrypted for Impact',
        tactic: 'Impact',
        url: 'https://attack.mitre.org/techniques/T1486/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Joint CISA/FBI/MS-ISAC Advisory AA23-165A documents LockBit 3.0 affiliate lateral movement (EventID 7045 PsExec) and vssadmin/bcdedit recovery inhibition; (2) Trend Micro & Sophos X-Ops malware reverse-engineering explains how LockBit Black uses intermittent head-only encryption with Windows I/O Completion Ports for high-speed encryption; and (3) Microsoft VSS & Sysmon documentation defines EventID 1/11/7036 volume shadow deletion and mass file-rename detection.',
    primarySources: [
      {
        id: 'cisa-aa23-165a',
        organization: 'CISA / FBI / MS-ISAC Joint Advisory',
        title: 'Understanding Ransomware Threat Actors: LockBit 3.0 (AA23-165A)',
        referenceCode: 'CISA-AA23-165A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a',
        usageSummary:
          'Public joint cybersecurity advisory detailing Volume Shadow Copy deletion and high-speed I/O encryption telemetry.',
      },
      {
        id: 'ms-vss-sysmon-eid1-11',
        organization: 'Microsoft Learn & Sysinternals',
        title: 'Volume Shadow Copy Service (VSS) & Sysmon Event ID 1 / 11',
        referenceCode: 'MS-VSS-SYSMON-11',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/windows-server/storage/file-server/volume-shadow-copy-service',
        usageSummary:
          'Documents vssadmin.exe shadow deletion command-line auditing (EID 1) and ransom-note FileCreate telemetry (EID 11).',
      },
      {
        id: 'mitre-t1486-intermittent-encryption',
        organization: 'The MITRE Corporation & Ransomware DFIR Research',
        title: 'MITRE ATT&CK T1486 & T1490: Intermittent File Encryption & Recovery Inhibition',
        referenceCode: 'ATT&CK-T1486-T1490',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1486/',
        usageSummary:
          'Details partial/head-only file encryption mechanics (encrypting only the first 4 KB–64 KB per file) and WMI Win32_ShadowCopy deletion.',
      },
    ],
    syntheticDataNotice:
      'Simulated ransomware file events occur strictly within a virtualized scenario model with fictional filenames.',
  },
  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    scenarioCode: 'CVE-2021-44228',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Log4Shell JNDI Lookup)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1059.004',
        name: 'Command and Scripting Interpreter: Unix Shell',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1059/004/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Apache Foundation & NIST NVD (CVE-2021-44228) specify how Log4j2 MessagePatternConverter recursively evaluates ${jndi:ldap://...} strings inside logged HTTP headers; (2) Swiss NCSC / GOVCERT.ch & LunaSec technical analyses detail the LDAP JavaNamingReference response (javaCodeBase + javaFactory) and URLClassLoader remote bytecode execution; and (3) CISA Emergency Directive 22-02 provides the multi-layer SIEM correlation across Nginx access logs, Zeek LDAP traffic, and Linux auditd execve child processes.',
    primarySources: [
      {
        id: 'nvd-cve-2021-44228',
        organization: 'NIST NVD & Apache Software Foundation',
        title: 'CVE-2021-44228 Apache Log4j2 JNDI Lookup Advisory',
        referenceCode: 'CVE-2021-44228',
        licenseOrTerms: 'Public Domain / Apache License 2.0',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
        usageSummary:
          'Official vulnerability specification for JNDI LDAP lookup injection in Apache Log4j2.',
      },
      {
        id: 'cisa-log4j-guidance',
        organization: 'CISA Emergency Directive',
        title: 'Apache Log4j Vulnerability Guidance & Detection Signatures',
        referenceCode: 'CISA-ED-22-02',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance',
        usageSummary:
          'Provides the Nginx access log, Zeek LDAP, and Linux auditd execve correlation patterns.',
      },
      {
        id: 'govcert-ch-log4shell-mechanics',
        organization: 'Swiss NCSC / GOVCERT.ch Technical Analysis',
        title: 'Zero-Day Exploit Targeting Popular Java Library Log4j (JNDI Class-Loading Anatomy)',
        referenceCode: 'GOVCERT-LOG4SHELL-2021',
        licenseOrTerms: 'Public Government Cybersecurity Advisory',
        url: 'https://www.ncsc.admin.ch/ncsc/en/home/aktuell/im-fokus/log4j.html',
        usageSummary:
          'Explains nested ${lower:...} WAF de-obfuscation, LDAP javaFactory class resolution, and JVM Runtime.getRuntime().exec() spawning.',
      },
    ],
    syntheticDataNotice:
      'Nginx HTTP headers and LDAP callback URIs use de-identified RFC test addresses.',
  },
  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    scenarioCode: 'T1558.003',
    mitreTechniques: [
      {
        id: 'T1558.003',
        name: 'Steal or Forge Kerberos Tickets: Kerberoasting',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1558/003/',
      },
      {
        id: 'T1550.002',
        name: 'Use Alternate Authentication Material: Pass the Hash',
        tactic: 'Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1550/002/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) MITRE ATT&CK T1558.003 & SpecterOps Kerberos research explain LDAP SPN discovery and why requesting EncryptionType 0x17 (RC4-HMAC-MD5) forces the Domain Controller to encrypt the TGS ticket using the service account’s NTLM hash; (2) Microsoft Windows Security Auditing documentation specifies EventID 4769 (TicketOptions 0x40810000) and EventID 4624 (LogonType 3 NtLmSsp lateral movement); and (3) NSA/CISA Active Directory hardening guidance provides AES-only enforcement and Group Managed Service Account (gMSA) mitigations.',
    primarySources: [
      {
        id: 'ms-eid-4769',
        organization: 'Microsoft Windows Security Auditing',
        title: 'Event ID 4769: A Kerberos service ticket was requested (RC4 0x17)',
        referenceCode: 'MS-AUDITING-4769',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769',
        usageSummary:
          'Documents TicketEncryptionType 0x17 (RC4-HMAC) and TicketOptions 0x40810000 auditing on Domain Controllers.',
      },
      {
        id: 'ms-eid-4624',
        organization: 'Microsoft Windows Security Auditing',
        title: 'Event ID 4624: An account was successfully logged on (LogonType 3)',
        referenceCode: 'MS-AUDITING-4624',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624',
        usageSummary:
          'Defines NTLMv2 network logon telemetry used to detect lateral movement across SMB.',
      },
      {
        id: 'nsa-cisa-kerberoasting-guidance',
        organization: 'NSA & CISA Cybersecurity Technical Guidance',
        title: 'Mitigating Kerberoasting and Active Directory Service Account Compromise',
        referenceCode: 'NSA-CISA-AD-KERBEROS',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://attack.mitre.org/techniques/T1558/003/',
        usageSummary:
          'Details offline Hashcat mode 13100 cracking risks, AES256-CTS-HMAC-SHA1-96 enforcement, and gMSA remediation.',
      },
    ],
    syntheticDataNotice:
      'Active Directory domain CORP.LOCAL, SPN svc_mssql, and NTLM hashes are fictional lab identifiers.',
  },
  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    scenarioCode: 'T1071.004',
    mitreTechniques: [
      {
        id: 'T1071.004',
        name: 'Application Layer Protocol: DNS (DNS Tunneling C2)',
        tactic: 'Command and Control',
        url: 'https://attack.mitre.org/techniques/T1071/004/',
      },
      {
        id: 'T1048.003',
        name: 'Exfiltration Over Alternative Protocol',
        tactic: 'Exfiltration',
        url: 'https://attack.mitre.org/techniques/T1048/003/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) IETF RFC 1035 defines the 63-byte subdomain label and 253-byte FQDN protocol limits that dictate how data chunks are segmented into DNS queries; (2) Palo Alto Networks Unit 42 & SANS DFIR research on APT34 (OilRig) DNS tunneling explains Base32/Hex encoding, cache-busting sequence prefixes, and Shannon entropy (>4.2 bits/byte) detection; and (3) Microsoft Sysinternals Sysmon EventID 22 maps each anomalous DNS query back to the exact originating process PID on the host.',
    primarySources: [
      {
        id: 'ietf-rfc-1035',
        organization: 'IETF Network Working Group',
        title: 'RFC 1035: Domain Names — Implementation and Specification',
        referenceCode: 'IETF-RFC-1035',
        licenseOrTerms: 'IETF Public Specification',
        url: 'https://datatracker.ietf.org/doc/html/rfc1035',
        usageSummary:
          'Defines DNS TXT/CNAME record structures and subdomain label length constraints.',
      },
      {
        id: 'sysmon-eid-22-dns',
        organization: 'Microsoft Sysinternals',
        title: 'Sysmon Event ID 22: DNSEvent (DNS Query Logging)',
        referenceCode: 'SYSMON-EID-22',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-22-dnsevent',
        usageSummary:
          'Captures process-attributed DNS queries for Shannon entropy and volumetric analysis.',
      },
      {
        id: 'unit42-dns-tunneling-analysis',
        organization: 'Palo Alto Networks Unit 42',
        title: 'DNS Tunneling: How DNS Can Be Abused by Malicious Actors (OilRig / APT34 Tradecraft)',
        referenceCode: 'UNIT42-DNS-TUNNELING',
        licenseOrTerms: 'Palo Alto Networks Unit 42 Threat Research',
        url: 'https://unit42.paloaltonetworks.com/dns-tunneling-how-dns-can-be-abused-by-malicious-actors/',
        usageSummary:
          'Details Base32/Base64 subdomain payload chunking, TXT record C2 tasking, and recursive resolver inspection.',
      },
    ],
    syntheticDataNotice:
      'Base32 subdomain labels and c2-DropZone.net domain names are non-routable synthetic strings.',
  },
  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    scenarioCode: 'CVE-2024-3400',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (PAN-OS GlobalProtect CVE-2024-3400)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1059.006',
        name: 'Command and Scripting Interpreter: Python (UPSTYLE Backdoor)',
        tactic: 'Execution / Persistence',
        url: 'https://attack.mitre.org/techniques/T1059/006/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Volexity Threat Research discovered the zero-day campaign (UTA0218), capturing the initial firewall compromise, outbound curling of bash stage-1 scripts, running-config.xml theft, and internal SMB/winexe lateral movement; (2) Palo Alto Networks Unit 42 reverse-engineered the UPSTYLE Python backdoor injected into /usr/lib/python3.6/site-packages/system.pth, its inotify monitor on sslvpn_ngx_error.log, and its 6-hour cleanup thread; and (3) Rapid7 AttackerKB & PAN PSIRT documented how the SESSID cookie path traversal injects backtick shell commands into the root sendTelemetry cron job.',
    primarySources: [
      {
        id: 'unit42-cve-2024-3400-brief',
        organization: 'Palo Alto Networks Unit 42',
        title: 'Threat Brief: Operation MidnightEclipse, Post-Exploitation Activity Related to CVE-2024-3400',
        referenceCode: 'UNIT42-MIDNIGHTECLIPSE-2024',
        licenseOrTerms: 'Palo Alto Networks Unit 42 Threat Research',
        url: 'https://unit42.paloaltonetworks.com/cve-2024-3400/',
        usageSummary:
          'Documents the SESSID cookie path traversal, sendTelemetry cron execution, UPSTYLE Python backdoor in system.pth, and running-config.xml extraction.',
      },
      {
        id: 'volexity-uta0218-cve-2024-3400',
        organization: 'Volexity Threat Research',
        title: 'Zero-Day Exploitation of Unauthenticated Remote Code Execution Vulnerability in GlobalProtect (CVE-2024-3400)',
        referenceCode: 'VOLEXITY-UTA0218-2024',
        licenseOrTerms: 'Volexity Public Threat Research',
        url: 'https://www.volexity.com/blog/2024/04/12/zero-day-exploitation-of-unauthenticated-remote-code-execution-vulnerability-in-globalprotect-cve-2024-3400/',
        usageSummary:
          'Details the initial zero-day discovery (UTA0218), telemetry file-creation probes, DPAPI/Active Directory pivoting, and network egress indicators.',
      },
      {
        id: 'paloalto-psirt-cve-2024-3400',
        organization: 'Palo Alto Networks PSIRT & Rapid7 AttackerKB',
        title: 'CVE-2024-3400 PAN-OS: Arbitrary File Creation Leads to OS Command Injection in GlobalProtect',
        referenceCode: 'PAN-SA-2024-0005',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://security.paloaltonetworks.com/CVE-2024-3400',
        usageSummary:
          'Official vendor advisory and exploit root-cause analysis detailing affected PAN-OS versions and telemetry remediations.',
      },
    ],
    syntheticDataNotice:
      'Firewall management IPs and C2 staging domains use RFC 5737 documentation blocks (198.51.100.0/24).',
  },
  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    scenarioCode: 'T1218.014',
    mitreTechniques: [
      {
        id: 'T1218.014',
        name: 'System Binary Proxy Execution: MMC (GrimResource)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1218/014/',
      },
      {
        id: 'T1055',
        name: 'Process Injection (RwSection Injection into dllhost.exe)',
        tactic: 'Defense Evasion / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1055/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Elastic Security Labs discovered the GrimResource technique in the wild, dissecting how crafted .msc StringTable entries abuse an XSS flaw in C:\\Windows\\System32\\apds.dll (res://apds.dll/redirect.html#target=javascript:...) and inject Cobalt Strike into dllhost.exe via RwSection; (2) MDSec DotNetToJScript research explains how VBScript/JScript inside mmc.exe deserializes arbitrary .NET assemblies in memory via BinaryFormatter; and (3) Microsoft MSRC (CVE-2024-43572) & MITRE T1218.014 document the official MMC security patch and Sysmon EventID 7 (apds.dll + jscript.dll in mmc.exe) detections.',
    primarySources: [
      {
        id: 'elastic-grimresource-advisory',
        organization: 'Elastic Security Labs',
        title: 'GrimResource — Microsoft Management Console for Initial Access and Evasion',
        referenceCode: 'ELASTIC-GRIMRESOURCE-2024',
        licenseOrTerms: 'Elastic Security Labs Research Publication',
        url: 'https://www.elastic.co/security-labs/grimresource',
        usageSummary:
          'Documents the apds.dll XSS DOM redirect, DotNetToJScript deserialization in mmc.exe, and RwSection injection into dllhost.exe.',
      },
      {
        id: 'msrc-cve-2024-43572-mmc',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'CVE-2024-43572: Microsoft Management Console (MMC) Remote Code Execution Vulnerability',
        referenceCode: 'MSRC-CVE-2024-43572',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-43572',
        usageSummary:
          'Official Microsoft advisory addressing untrusted .msc snap-in script execution and apds.dll protocol redirection.',
      },
      {
        id: 'mitre-t1218-014',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK T1218.014: System Binary Proxy Execution — MMC',
        referenceCode: 'ATT&CK-T1218.014',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1218/014/',
        usageSummary:
          'Defines MMC snap-in abuse, DotNetToJScript in-memory CLR loading, and trusted binary proxy execution.',
      },
    ],
    syntheticDataNotice:
      'Workstation hostnames and Cobalt Strike C2 IP addresses are synthetic lab telemetry modeled on Elastic Security Labs findings.',
  },
  'elastic-lotus-blossom-chrysalis': {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    scenarioCode: 'T1574.002',
    mitreTechniques: [
      {
        id: 'T1574.002',
        name: 'Hijack Execution Flow: DLL Side-Loading (WinGUp GUP.exe + libcurl.dll)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/002/',
      },
      {
        id: 'T1055',
        name: 'In-Memory Shellcode Decryptor (CHRYSALIS Backdoor)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1055/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Elastic Security Labs dissected the 3-piece Lotus Blossom loader triad—a legitimately signed Notepad++ WinGUp updater (GUP.exe), a malicious side-loaded libcurl.dll, and an RC4/XOR-encrypted conf.bin payload containing the CHRYSALIS implant; (2) Cisco Talos research on Lotus Blossom (Spring Dragon / Billbug) documents their Sagerunex backdoor lineage, API-hashing resolution, and cloud/HTTPS beacon profiles; and (3) MITRE ATT&CK G0030 & T1574.002 provide the Sysmon EventID 7 (unsigned libcurl.dll loaded outside Program Files) detection engineering.',
    primarySources: [
      {
        id: 'elastic-lotus-blossom-advisory',
        organization: 'Elastic Security Labs',
        title: 'Lotus Blossom Espionage Intrusion Analysis: Sagerunex & CHRYSALIS Loader Chains',
        referenceCode: 'ELASTIC-LOTUS-BLOSSOM-2024',
        licenseOrTerms: 'Elastic Security Labs Research Publication',
        url: 'https://www.elastic.co/security-labs',
        usageSummary:
          'Documents Notepad++ WinGUp (GUP.exe) side-loading of malicious libcurl.dll and CHRYSALIS shellcode decryption.',
      },
      {
        id: 'talos-lotus-blossom-sagerunex',
        organization: 'Cisco Talos Intelligence Group',
        title: 'Lotus Blossom (Spring Dragon / Billbug) Sagerunex Backdoor & DLL Side-Loading Tradecraft',
        referenceCode: 'TALOS-LOTUS-BLOSSOM',
        licenseOrTerms: 'Cisco Talos Threat Research',
        url: 'https://blog.talosintelligence.com/',
        usageSummary:
          'Correlates Lotus Blossom regional espionage campaigns, custom API hashing, and long-dwell C2 persistence.',
      },
      {
        id: 'mitre-g0030-lotus-blossom',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK Group G0030: Lotus Blossom (Spring Dragon / Billbug)',
        referenceCode: 'ATT&CK-G0030',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/groups/G0030/',
        usageSummary:
          'Provides canonical TTP mapping for Lotus Blossom DLL side-loading and custom backdoors.',
      },
    ],
    syntheticDataNotice:
      'All endpoint hostnames and C2 domains in this Lotus Blossom scenario are synthetic lab traces.',
  },
  'unit42-scattered-spider-cloud': {
    scenarioId: 'unit42-scattered-spider-cloud',
    scenarioCode: 'T1078.004',
    mitreTechniques: [
      {
        id: 'T1556.006',
        name: 'Modify Authentication Process: Multi-Factor Authentication',
        tactic: 'Credential Access / Persistence',
        url: 'https://attack.mitre.org/techniques/T1556/006/',
      },
      {
        id: 'T1078.004',
        name: 'Valid Accounts: Cloud Accounts',
        tactic: 'Initial Access / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1078/004/',
      },
      {
        id: 'T1219',
        name: 'Remote Access Software (Commercial RMM Tunneling)',
        tactic: 'Command and Control',
        url: 'https://attack.mitre.org/techniques/T1219/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Joint CISA/FBI Advisory AA23-320A documents Scattered Spider’s helpdesk voice-phishing ("vishing") scripts, SIM swapping, and signed commercial RMM tool list (AnyDesk, ScreenConnect, Tailscale, ngrok); (2) Palo Alto Networks Unit 42 ("Muddled Libra") details the identity-to-cloud pivot via Okta/Entra ID SSO into AWS sts:AssumeRole, rogue SAML IdP federation (CreateSAMLProvider), and VMware ESXi hypervisor takeover; and (3) Mandiant (UNC3944) documents internal Confluence/SharePoint runbook harvesting and IdP audit telemetry.',
    primarySources: [
      {
        id: 'unit42-muddled-libra-profile',
        organization: 'Palo Alto Networks Unit 42',
        title: 'Muddled Libra (Scattered Spider) Cloud Identity & VMware ESXi Intrusion Playbook',
        referenceCode: 'UNIT42-MUDDLED-LIBRA-2024',
        licenseOrTerms: 'Palo Alto Networks Unit 42 Threat Research',
        url: 'https://unit42.paloaltonetworks.com/muddled-libra/',
        usageSummary:
          'Details helpdesk social engineering, rogue FIDO2 MFA registration, RMM deployment, and AWS/ESXi cloud pivot.',
      },
      {
        id: 'cisa-aa23-320a',
        organization: 'CISA & FBI Joint Advisory',
        title: 'Scattered Spider (AA23-320A) Cybersecurity Advisory',
        referenceCode: 'CISA-AA23-320A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a',
        usageSummary:
          'Corroborates Muddled Libra / Scattered Spider cloud-to-hypervisor TTPs and RMM abuse.',
      },
      {
        id: 'mandiant-unc3944-identity-cloud',
        organization: 'Mandiant / Google Cloud Threat Intelligence',
        title: 'UNC3944: SMS Phishing, SIM Swapping, and Cloud Identity Provider Intrusions',
        referenceCode: 'MANDIANT-UNC3944',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/',
        usageSummary:
          'Documents internal SharePoint/Confluence runbook reconnaissance, telecom BPO pivoting, and SSO federation persistence.',
      },
    ],
    syntheticDataNotice:
      'Okta/Entra ID UPNs, session IDs, and ESXi hostnames are synthetic simulation identifiers.',
  },
  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    scenarioCode: 'T1620',
    mitreTechniques: [
      {
        id: 'T1574.002',
        name: 'Hijack Execution Flow: DLL Side-Loading (DodgeBox / taskhost.exe)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/002/',
      },
      {
        id: 'T1620',
        name: 'Reflective Code Loading (Call-Stack Spoofing & DUSTPAN / STEALTHVECTOR)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1620/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Google Mandiant uncovered APT41’s DUSTPAN stage-1 memory dropper and the 16-plugin DUSTTRAP modular multi-TLS framework; (2) Elastic Security Labs reverse-engineered DodgeBox and STEALTHVECTOR, demonstrating how the loader overwrites the in-memory ntdll.dll .text section with clean bytes from disk (VirtualProtect RX -> RWX -> RX) to erase user-mode EDR hooks and spoofs synthetic call stacks; and (3) Trend Micro (Earth Freybug) & MITRE G0096 documented the abuse of C:\\Windows\\System32\\wermgr.exe as the sacrificial host process.',
    primarySources: [
      {
        id: 'elastic-apt41-stealthvector',
        organization: 'Elastic Security Labs',
        title: 'APT41 (Brass Typhoon) DodgeBox, Call-Stack Spoofing, and STEALTHVECTOR Analysis',
        referenceCode: 'ELASTIC-APT41-2024',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://www.elastic.co/security-labs',
        usageSummary:
          'Documents DodgeBox/STEALTHVECTOR ntdll.dll unhooking, synthetic BaseThreadInitThunk call-stack spoofing, and memory evasion.',
      },
      {
        id: 'mandiant-apt41-dustpan-dusttrap',
        organization: 'Mandiant / Google Cloud Threat Intelligence',
        title: 'APT41 DUSTPAN Loader and DUSTTRAP Multi-Stage In-Memory Plugin Ecosystem',
        referenceCode: 'MANDIANT-DUSTPAN-DUSTTRAP',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/apt41-us-state-governments',
        usageSummary:
          'Dissects the ChaCha20/AES-GCM DUSTPAN launcher and the 16 on-demand DUSTTRAP post-exploitation modules.',
      },
      {
        id: 'mitre-g0096-apt41',
        organization: 'The MITRE Corporation & Trend Micro Research',
        title: 'MITRE ATT&CK Group G0096: APT41 (Wicked Panda / Brass Typhoon / Earth Freybug)',
        referenceCode: 'ATT&CK-G0096',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/groups/G0096/',
        usageSummary:
          'Defines APT41 wermgr.exe process injection, loader chains, and Kernel ETW EtwTiLogProtectVM detections.',
      },
    ],
    syntheticDataNotice:
      'Memory stack frames and Cloudflare Workers domains are synthetic defensive indicators.',
  },
  'ms-volt-typhoon-lotl': {
    scenarioId: 'ms-volt-typhoon-lotl',
    scenarioCode: 'T1003.003',
    mitreTechniques: [
      {
        id: 'T1003.003',
        name: 'OS Credential Dumping: NTDS (ntdsutil.exe create full)',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1003/003/',
      },
      {
        id: 'T1090.002',
        name: 'Proxy: External Proxy (netsh interface portproxy v4tov4)',
        tactic: 'Command and Control / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1090/002/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft Threat Intelligence exposed Volt Typhoon’s zero-malware "Living-off-the-Land" (LOTL) playbook—using wmic process call create, ntdsutil "ac i ntds" ifm "create full" for offline Active Directory database extraction, and netsh interface portproxy; (2) Joint CISA/NSA/FBI/Five Eyes Advisory AA24-038A provided the registry persistence paths (HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp), EventID 7040/325 hunting rules, and infrastructure pre-positioning analysis; and (3) Lumen Black Lotus Labs & Secureworks dissected the KV Botnet of compromised SOHO routers used as domestic C2 relays.',
    primarySources: [
      {
        id: 'ms-volt-typhoon-blog',
        organization: 'Microsoft Threat Intelligence',
        title: 'Volt Typhoon targets US critical infrastructure with living-off-the-land techniques',
        referenceCode: 'MSFT-VOLT-TYPHOON-2023',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/',
        usageSummary:
          'Documents KV Botnet SOHO router proxying, wmic/ntdsutil IFM credential dumping, and netsh interface portproxy v4tov4 persistence.',
      },
      {
        id: 'cisa-aa24-038a-volt-typhoon',
        organization: 'CISA / NSA / FBI Joint Advisory',
        title: 'PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure (AA24-038A)',
        referenceCode: 'CISA-AA24-038A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a',
        usageSummary:
          'Provides comprehensive Event ID 7040, Registry PortProxy, ESXi/vssadmin, and ntdsutil hunting queries.',
      },
      {
        id: 'mitre-g1017-volt-typhoon-kvbotnet',
        organization: 'The MITRE Corporation & Black Lotus Labs Research',
        title: 'MITRE ATT&CK Group G1017: Volt Typhoon (Bronze Silhouette) & KV Botnet Relay Infrastructure',
        referenceCode: 'ATT&CK-G1017',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/groups/G1017/',
        usageSummary:
          'Details how compromised end-of-life Cisco/Netgear/DrayTek SOHO routers proxy operator traffic from domestic residential ASNs.',
      },
    ],
    syntheticDataNotice:
      'All Domain Controller paths and portproxy IP addresses use RFC 1918 private lab ranges.',
  },
  'ms-midnight-blizzard-oauth': {
    scenarioId: 'ms-midnight-blizzard-oauth',
    scenarioCode: 'T1098.003',
    mitreTechniques: [
      {
        id: 'T1110.003',
        name: 'Brute Force: Password Spraying',
        tactic: 'Initial Access / Credential Access',
        url: 'https://attack.mitre.org/techniques/T1110/003/',
      },
      {
        id: 'T1098.003',
        name: 'Account Manipulation: Additional Cloud Roles (full_access_as_app)',
        tactic: 'Persistence / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1098/003/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft Threat Intelligence disclosed the January 2024 intrusion chain—low-and-slow residential-proxy password spraying against a legacy non-production test tenant followed by OAuth Service Principal elevation to full_access_as_app on Exchange Online; (2) CISA Emergency Directive 24-02 established federal cloud-identity hunting and legacy OAuth application revocation requirements; and (3) Mandiant APT29 cloud research documented multi-app Service Principal backdoor creation and Exchange Web Services (EWS) client_credentials token exfiltration.',
    primarySources: [
      {
        id: 'ms-midnight-blizzard-guidance',
        organization: 'Microsoft Threat Intelligence',
        title: 'Midnight Blizzard: Guidance for responders on nation-state attack',
        referenceCode: 'MSFT-MIDNIGHT-BLIZZARD-2024',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/',
        usageSummary:
          'Details low-volume residential proxy password spraying against non-production tenants and OAuth app elevation to full_access_as_app.',
      },
      {
        id: 'cisa-ed-24-02-midnight-blizzard',
        organization: 'CISA Emergency Directive',
        title: 'Emergency Directive 24-02: Mitigating the Significant Risk from Nation-State Compromise of Microsoft Corporate Email',
        referenceCode: 'CISA-ED-24-02',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/directives/ed-24-02-mitigating-significant-risk-nation-state-compromise-microsoft-corporate-email',
        usageSummary:
          'Provides cloud identity auditing and OAuth application governance requirements.',
      },
      {
        id: 'mandiant-apt29-cloud-oauth',
        organization: 'Mandiant / Google Cloud Threat Intelligence',
        title: 'APT29 (Midnight Blizzard / Cozy Bear) Cloud Identity & Service Principal Persistence Tradecraft',
        referenceCode: 'MANDIANT-APT29-CLOUD',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/',
        usageSummary:
          'Analyzes residential-proxy rotation, Add service principal credentials persistence, and automated Graph/EWS mailbox collection.',
      },
    ],
    syntheticDataNotice:
      'Entra ID AppIds, TenantIds, and mailbox identifiers are synthetic training values.',
  },
  'ms-salt-typhoon-telecom': {
    scenarioId: 'ms-salt-typhoon-telecom',
    scenarioCode: 'T1014',
    mitreTechniques: [
      {
        id: 'T1014',
        name: 'Rootkit (Demodex Kernel Driver & GhostSpider)',
        tactic: 'Defense Evasion / Persistence',
        url: 'https://attack.mitre.org/techniques/T1014/',
      },
      {
        id: 'T1552.001',
        name: 'Unsecured Credentials: Credentials In Files (TACACS+ / RADIUS Capture)',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1552/001/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Joint CISA/NSA/FBI Guidance (AA24-338A) details how Salt Typhoon compromises carrier backbone routers, abuses Cisco IOS XE Guest Shell Linux containers, and captures TACACS+/RADIUS authentication keys; (2) Kaspersky GReAT reverse-engineered the GhostEmperor Demodex kernel rootkit (Nguv64.sys loaded via vulnerable signed driver BYOVD) that unlinks EPROCESS structures and hides registry keys on Windows mediation servers; and (3) Cisco Talos & Microsoft Threat Intelligence documented CVE-2023-20198 / CVE-2023-20273 IOS XE Web UI exploitation and the GhostSpider user-mode C2 framework.',
    primarySources: [
      {
        id: 'cisa-nsa-fbi-telecom-2024',
        organization: 'CISA / NSA / FBI / Microsoft Threat Intelligence',
        title: 'Enhanced Visibility and Hardening Guidance for Communications Infrastructure (Salt Typhoon / AA24-338A)',
        referenceCode: 'CISA-AA24-338A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-338a',
        usageSummary:
          'Documents Salt Typhoon (GhostEmperor) telecom core router intrusion, Guest Shell abuse, and TACACS+ credential capture.',
      },
      {
        id: 'kaspersky-ghostemperor-demodex',
        organization: 'Kaspersky GReAT',
        title: 'GhostEmperor: From ProxyLogon to Kernel Mode with Demodex Rootkit',
        referenceCode: 'KASPERSKY-DEMODEX',
        licenseOrTerms: 'Kaspersky Securelist Research',
        url: 'https://securelist.com/ghostemperor-from-proxylogon-to-kernel-mode/104407/',
        usageSummary:
          'Technical analysis of the Demodex kernel rootkit driver, BYOVD loader, and DKOM registry/process hiding.',
      },
      {
        id: 'talos-ios-xe-cve-2023-20198',
        organization: 'Cisco Talos Intelligence Group',
        title: 'Active Exploitation of Cisco IOS XE Software Web Management User Interface (CVE-2023-20198 & CVE-2023-20273)',
        referenceCode: 'TALOS-IOSXE-2023',
        licenseOrTerms: 'Cisco Talos Threat Research',
        url: 'https://blog.talosintelligence.com/',
        usageSummary:
          'Explains how unauthenticated attackers create privilege-15 local accounts and launch the Guest Shell container on IOS XE routers.',
      },
    ],
    syntheticDataNotice:
      'Telecom router loopback IPs and TACACS+ keys are synthetic lab representations.',
  },
  'ms-forest-blizzard-gooseegg': {
    scenarioId: 'ms-forest-blizzard-gooseegg',
    scenarioCode: 'CVE-2022-38028',
    mitreTechniques: [
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation (Print Spooler CVE-2022-38028 GooseEgg)',
        tactic: 'Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1068/',
      },
      {
        id: 'T1574.001',
        name: 'Hijack Execution Flow: DLL Search Order Hijacking (wayzgoose.dll)',
        tactic: 'Persistence / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1574/001/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft Threat Intelligence dissected Forest Blizzard’s (APT28) custom GooseEgg launcher (execute.bat + justice.exe) and the rogue wayzgoose.dll COM server; (2) Microsoft Security Response Center (MSRC CVE-2022-38028) documented the underlying Print Spooler vulnerability where MPDW-constraints.js inside the Windows DriverStore is modified to corrupt PrintFilterPipelineSvc.exe; and (3) ESET & MITRE G0007 research correlated APT28’s post-escalation SYSTEM credential harvesting and rundll32DllRegisterServer telemetry.',
    primarySources: [
      {
        id: 'ms-forest-blizzard-gooseegg-blog',
        organization: 'Microsoft Threat Intelligence',
        title: 'Analyzing Forest Blizzard’s custom post-compromise tool for exploiting CVE-2022-38028 to obtain credentials',
        referenceCode: 'MSFT-GOOSEEGG-2024',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2024/04/22/analyzing-forest-blizzards-custom-post-compromise-tool-for-exploiting-cve-2022-38028-to-obtain-credentials/',
        usageSummary:
          'Documents execute.bat, justice.exe (GooseEgg), DriverStore pnms009.inf modification, and wayzgoose.dll SYSTEM execution inside spoolsv.exe.',
      },
      {
        id: 'msrc-cve-2022-38028',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'CVE-2022-38028 Windows Print Spooler Elevation of Privilege Vulnerability',
        referenceCode: 'MSRC-CVE-2022-38028',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38028',
        usageSummary:
          'Official vulnerability advisory for JavaScript Constraints file manipulation in Windows Print Spooler.',
      },
      {
        id: 'mitre-g0007-apt28-forest-blizzard',
        organization: 'The MITRE Corporation & ESET Research',
        title: 'MITRE ATT&CK Group G0007: APT28 (Forest Blizzard / Fancy Bear / Fighting Ursa)',
        referenceCode: 'ATT&CK-G0007',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/groups/G0007/',
        usageSummary:
          'Maps APT28 local privilege escalation chains, PrintFilterPipelineSvc.exe child-process anomalies, and credential dumping.',
      },
    ],
    syntheticDataNotice:
      'All DriverStore GUID paths and workstation identifiers are synthetic training artifacts.',
  },
  'unit42-star-blizzard-evilginx-aitm': {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    scenarioCode: 'T1539',
    mitreTechniques: [
      {
        id: 'T1539',
        name: 'Steal Web Session Cookie (Evilginx AiTM ESTSAUTHPERSISTENT Capture)',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1539/',
      },
      {
        id: 'T1550.004',
        name: 'Use Alternate Authentication Material: Web Session Cookie',
        tactic: 'Defense Evasion / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1550/004/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Joint CISA/NCSC-UK/NSA/FBI Advisory AA23-341A documents Star Blizzard’s (SEABORGIUM / COLDRIVER) spear-phishing lures, protonmail reconnaissance, and cloud-hosted PDF redirects; (2) Microsoft Threat Intelligence dissects how Evilginx Adversary-in-the-Middle (AiTM) reverse proxies relay live Entra ID MFA challenges, capture the resulting ESTSAUTHPERSISTENT cookie, and create hidden New-InboxRule forwarding rules in Exchange Online; and (3) Palo Alto Networks Unit 42 & MITRE T1539 detail FIDO2/WebAuthn token-binding mitigations and impossible-travel SessionId correlation.',
    primarySources: [
      {
        id: 'ms-cisa-star-blizzard-advisory',
        organization: 'CISA, NCSC-UK, NSA & FBI Joint Advisory',
        title: 'Star Blizzard (SEABORGIUM / COLDRIVER) Adversary-in-the-Middle Spear-Phishing & Session Cookie Theft (AA23-341A)',
        referenceCode: 'CISA-AA23-341A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-341a',
        usageSummary:
          'Documents Star Blizzard spear-phishing infrastructure, Evilginx reverse-proxy phishlets, and target reconnaissance.',
      },
      {
        id: 'ms-aitm-cookie-theft-blog',
        organization: 'Microsoft Threat Intelligence',
        title: 'From Cookie Theft to BEC: Attackers Use AiTM Phishing Sites as Entry Point',
        referenceCode: 'MSFT-AITM-2022',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/',
        usageSummary:
          'Explains real-time TLS reverse-proxy relaying of login.microsoftonline.com, ESTSAUTHPERSISTENT capture, and Exchange New-InboxRule persistence.',
      },
      {
        id: 'mitre-t1539-session-cookie',
        organization: 'The MITRE Corporation & Palo Alto Unit 42',
        title: 'MITRE ATT&CK T1539: Steal Web Session Cookie & FIDO2 Token Binding Mitigations',
        referenceCode: 'ATT&CK-T1539',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1539/',
        usageSummary:
          'Defines adversary-in-the-middle session cookie theft and FIDO2/CAE token protection mitigations.',
      },
    ],
    syntheticDataNotice:
      'All lure domains, session cookies, and mailbox addresses are synthetic defensive simulation data.',
  },
  'talos-arcanedoor-asa': {
    scenarioId: 'talos-arcanedoor-asa',
    scenarioCode: 'CVE-2024-20353',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Cisco ASA CVE-2024-20353)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1542.004',
        name: 'Pre-OS Boot: ROMMON / Bootimage Persistence (Line Runner)',
        tactic: 'Persistence',
        url: 'https://attack.mitre.org/techniques/T1542/004/',
      },
      {
        id: 'T1562.003',
        name: 'Impair Defenses: Disable Syslog & Crashdump Forensics (Line Dancer)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1562/003/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Cisco Talos Intelligence Group uncovered the ArcaneDoor campaign (UAT4356) and reverse-engineered both implants—Line Dancer (an in-memory shellcode interpreter inside the ASA lina process controlled via <host-scan-reply> WebVPN POST requests that hooks syslog and crashdumps) and Line Runner (a persistent boot backdoor); (2) Cisco PSIRT Advisory documented the two zero-day vulnerabilities (CVE-2024-20353 Web Services parser flaw and CVE-2024-20359 vpn_dessert.zip pre-loading execution); and (3) NCSC-UK & Canadian Cyber Centre provided the verify /md5 system:memory/text forensic integrity check.',
    primarySources: [
      {
        id: 'talos-arcanedoor-report',
        organization: 'Cisco Talos Intelligence Group',
        title: 'ArcaneDoor — New Espionage-Focused Campaign Found Targeting Perimeter Network Devices',
        referenceCode: 'TALOS-ARCANEDOOR-2024',
        licenseOrTerms: 'Cisco Talos Threat Research',
        url: 'https://blog.talosintelligence.com/arcanedoor-new-espionage-focused-campaign-found-targeting-perimeter-network-devices/',
        usageSummary:
          'Documents UAT4356 exploitation of CVE-2024-20353/CVE-2024-20359, Line Dancer in-memory shellcode interpreter, and Line Runner lina_monitor persistence.',
      },
      {
        id: 'cisco-psirt-arcanedoor',
        organization: 'Cisco Security Advisories',
        title: 'Cisco Adaptive Security Appliance and Firepower Threat Defense Software Web Services Denial of Service and Persistence (CVE-2024-20353, CVE-2024-20359)',
        referenceCode: 'CISCO-SA-ASAFTD-2024',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-persist-rce-FLsNXF4h',
        usageSummary:
          'Provides Cisco IOS/ASA Integrity Assurance verification steps (verify /sha-512 system:memory/text).',
      },
      {
        id: 'ncsc-uk-arcanedoor-alert',
        organization: 'NCSC-UK & Canadian Centre for Cyber Security',
        title: 'ArcaneDoor: Espionage Campaign Targeting Perimeter Network Devices — Forensic & Detection Guidance',
        referenceCode: 'NCSC-UK-ARCANEDOOR-2024',
        licenseOrTerms: 'Public Government Cybersecurity Advisory',
        url: 'https://www.ncsc.gov.uk/news/arcanedoor-espionage-campaign-targeting-perimeter-network-devices',
        usageSummary:
          'Details out-of-band syslog sequence-gap detection and text-segment memory hash comparison on Cisco ASA/FTD appliances.',
      },
    ],
    syntheticDataNotice:
      'ASA memory addresses and IPsec VPN peer addresses are synthetic representations.',
  },
  'talos-fortinet-coathanger-apt': {
    scenarioId: 'talos-fortinet-coathanger-apt',
    scenarioCode: 'CVE-2024-21762',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (FortiOS SSL-VPN CVE-2024-21762 / CVE-2022-42475)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1574.006',
        name: 'Hijack Execution Flow: Dynamic Linker Hijacking (COATHANGER preload.so & smartctl)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/006/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Dutch Military Intelligence (MIVD/AIVD) & NCSC-NL discovered and reverse-engineered the COATHANGER rootkit inside the Dutch Ministry of Defence—showing how /etc/ld.so.preload loads preload.so to hook libc readdir/open/stat and how patching the flatkc boot unpacker survives FortiOS firmware upgrades; (2) FortiGuard PSIRT (FG-IR-22-398 & FG-IR-24-015) documented the underlying sslvpnd heap/out-of-bounds write exploits (CVE-2022-42475 & CVE-2024-21762); and (3) Mandiant appliance-forensics research detailed monolithic /bin/init ROP chains and out-of-band NetFlow detection.',
    primarySources: [
      {
        id: 'ncsc-nl-coathanger-report',
        organization: 'NCSC-NL (Netherlands MIVD/AIVD)',
        title: 'COATHANGER: Chinese Cyber Espionage Malware Targeting FortiGate Appliances',
        referenceCode: 'NCSC-NL-COATHANGER-2024',
        licenseOrTerms: 'Public Government Cybersecurity Advisory',
        url: 'https://english.ncsc.nl/publications/publications/2024/february/6/mivd-and-aivd-alert-on-coathanger-malware',
        usageSummary:
          'Documents FortiOS SSL-VPN exploitation, `/data2/` implant storage, `/etc/ld.so.preload` libc hooking, and `flatkc` / `/bin/smartctl` firmware-upgrade persistence.',
      },
      {
        id: 'cisa-cve-2024-21762',
        organization: 'CISA & Fortinet PSIRT',
        title: 'FG-IR-24-015 (CVE-2024-21762) & FG-IR-22-398 (CVE-2022-42475) FortiOS SSL-VPN RCE Advisories',
        referenceCode: 'FG-IR-24-015',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://www.fortiguard.com/psirt/FG-IR-24-015',
        usageSummary:
          'Official Fortinet PSIRT advisories for heap overflow and chunked transfer encoding out-of-bounds write in sslvpnd.',
      },
      {
        id: 'mitre-t1574-006-ld-preload',
        organization: 'The MITRE Corporation & Appliance Forensics Research',
        title: 'MITRE ATT&CK T1574.006: Dynamic Linker Hijacking (LD_PRELOAD & /etc/ld.so.preload Rootkits)',
        referenceCode: 'ATT&CK-T1574.006',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1574/006/',
        usageSummary:
          'Explains userland dynamic-linker rootkits on Linux-based network appliances and why offline flash inspection is required.',
      },
    ],
    syntheticDataNotice:
      'FortiGate appliance serials and Ministry subnet addresses are synthetic simulation data.',
  },
  'f5-bigip-request-smuggling': {
    scenarioId: 'f5-bigip-request-smuggling',
    scenarioCode: 'CVE-2023-46747',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (F5 BIG-IP TMUI AJP Smuggling CVE-2023-46747)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1059.004',
        name: 'Command and Scripting Interpreter: Unix Shell (/mgmt/tm/util/bash)',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1059/004/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Praetorian & ProjectDiscovery discovered and reproduced the exact two-tier Apache httpd (mod_proxy_ajp) -> Tomcat (:8009) binary AJP request smuggling mechanics, showing how an oversized HTTP header injects a forged second 0x1234 AJP frame with SC_A_REMOTE_USER=admin; (2) F5 SIRT Advisory K000137353 provided the official mitigation script and /var/log/audit mcpd/tmsh detection signatures; and (3) CISA KEV & NIST NVD documented post-exploitation rogue administrator creation (/config/bigip_user.conf) and SSL private key extraction via tmsh run /util bash.',
    primarySources: [
      {
        id: 'f5-k000137353-praetorian',
        organization: 'F5 SIRT Security Advisory',
        title: 'F5 BIG-IP Configuration Utility Unauthenticated RCE (CVE-2023-46747)',
        referenceCode: 'F5-K000137353',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://my.f5.com/manage/s/article/K000137353',
        usageSummary:
          'Official vendor advisory detailing affected BIG-IP versions, mitigation scripts, and `/var/log/audit` indicators.',
      },
      {
        id: 'projectdiscovery-praetorian-cve-2023-46747',
        organization: 'ProjectDiscovery & Praetorian Security Research',
        title: 'F5 BIG-IP Unauthenticated RCE via AJP Request Smuggling (CVE-2023-46747 Technical Deep-Dive)',
        referenceCode: 'PD-PRAETORIAN-CVE2023-46747',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://blog.projectdiscovery.io/f5-big-ip-unauthenticated-rce-cve-2023-46747/',
        usageSummary:
          'Dissects Apache mod_proxy_ajp packet boundary miscalculation, SC_A_REMOTE_USER=admin smuggling into Tomcat, and form_page UserCreate abuse.',
      },
      {
        id: 'nvd-cve-2023-46747',
        organization: 'NIST National Vulnerability Database (NVD) & CISA KEV',
        title: 'CVE-2023-46747 F5 BIG-IP Traffic Management User Interface (TMUI) Auth Bypass',
        referenceCode: 'CVE-2023-46747',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-46747',
        usageSummary:
          'Official CVE specification and CISA KEV remediation mandate for BIG-IP AJP request smuggling.',
      },
    ],
    syntheticDataNotice:
      'All BIG-IP management IPs and SSL key filenames in this scenario are synthetic defensive simulation data.',
  },
  'splunk-ivanti-connect-secure': {
    scenarioId: 'splunk-ivanti-connect-secure',
    scenarioCode: 'CVE-2024-21887',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Ivanti CVE-2023-46805 & CVE-2024-21887)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1574.006',
        name: 'Hijack Execution Flow: Dynamic Linker Hijacking (ZIPLINE LD_PRELOAD)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/006/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Volexity Threat Research discovered the zero-day campaign (UTA0178), capturing the chained CVE-2023-46805 (/api/v1/totp/user-backup-code/../../license/keys-status/ path traversal) + CVE-2024-21887 (Python subprocess.Popen shell injection) exploit and the WIREFIRE Python webshell injected into visits.py; (2) Mandiant (UNC5221) reverse-engineered the broader malware ecosystem—including ZIPLINE (LD_PRELOAD libsecure.so passive backdoor), WARPWIRE (JavaScript VPN credential stealer), and ComponentIntegrity.pm patching to blind the internal Integrity Checker Tool; and (3) CISA Emergency Directive 24-01 & Splunk SURGe provided external ICT snapshot forensics and SIEM hunting queries.',
    primarySources: [
      {
        id: 'volexity-uta0178-ivanti-zeroday',
        organization: 'Volexity Threat Research',
        title: 'Active Exploitation of Two Zero-Day Vulnerabilities in Ivanti Connect Secure (CVE-2023-46805 & CVE-2024-21887)',
        referenceCode: 'VOLEXITY-UTA0178-2024',
        licenseOrTerms: 'Volexity Public Threat Research',
        url: 'https://www.volexity.com/blog/2024/01/10/active-exploitation-of-two-zero-day-vulnerabilities-in-ivanti-connect-secure/',
        usageSummary:
          'Documents the initial zero-day discovery, `../../license/keys-status/` command injection, and the WIREFIRE webshell implanted in `visits.py`.',
      },
      {
        id: 'mandiant-unc5221-ivanti-blog',
        organization: 'Mandiant & Splunk SURGe Threat Research',
        title: 'Cutting Edge: Suspected APT Targets Ivanti Connect Secure VPN in New Zero-Day Exploitation (UNC5221)',
        referenceCode: 'MANDIANT-UNC5221-2024',
        licenseOrTerms: 'Mandiant & Splunk Security Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/suspected-apt-targets-ivanti-zero-day',
        usageSummary:
          'Dissects the ZIPLINE `libsecure.so` LD_PRELOAD backdoor, WARPWIRE credential harvester, and `ComponentIntegrity.pm` ICT tampering.',
      },
      {
        id: 'cisa-ed-24-01-ivanti',
        organization: 'CISA Emergency Directive',
        title: 'Emergency Directive 24-01: Mitigate Ivanti Connect Secure and Ivanti Policy Secure Vulnerabilities',
        referenceCode: 'CISA-ED-24-01',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities',
        usageSummary:
          'Provides external Integrity Checker Tool (ICT) snapshot validation and factory-reset remediation mandates.',
      },
    ],
    syntheticDataNotice:
      'VPN gateway IP addresses and admin credentials in WARPWIRE beacons are synthetic simulation strings.',
  },
  'splunk-citrix-bleed-session-hijack': {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    scenarioCode: 'CVE-2023-4966',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Citrix NetScaler CVE-2023-4966)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1550.004',
        name: 'Use Alternate Authentication Material: Web Session Cookie (NSC_AAAC)',
        tactic: 'Defense Evasion / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1550/004/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Assetnote Security Research reverse-engineered the NetScaler binary to uncover the exact C bug—how sending a ~24,576-byte Host header to /oauth/idp/.well-known/openid-configuration causes snprintf() (which returns the theoretical ~147 KB length rather than the 131 KB buffer cap) to over-read ~16 KB of adjacent heap RAM containing 65-character NSC_AAAC session tokens; (2) CISA/FBI/MS-ISAC & Mandiant (AA23-325A) documented LockBit 3.0 post-MFA session hijacking and why admins must execute kill aaa session -all / kill pcon -all after patching; and (3) Splunk SURGe authored the SIEM SPL rules detecting a single NSC_AAAC cookie used from multiple autonomous system numbers (ASNs).',
    primarySources: [
      {
        id: 'assetnote-citrix-bleed-research',
        organization: 'Assetnote Security Research',
        title: 'Citrix Bleed: Leaking Session Tokens with CVE-2023-4966 (snprintf Heap Over-Read Root Cause)',
        referenceCode: 'ASSETNOTE-CVE2023-4966',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://www.assetnote.io/resources/research/citrix-bleed-leaking-session-tokens-with-cve-2023-4966',
        usageSummary:
          'Proves how NetScaler inserts the HTTP Host header 6 times into a 131 KB buffer via snprintf() and passes the unchecked return value to the HTTP response writer.',
      },
      {
        id: 'splunk-citrix-bleed-analysis',
        organization: 'Splunk SURGe Security Research',
        title: 'Citrix Bleed (CVE-2023-4966) Vulnerability Analysis and Detection Guidance',
        referenceCode: 'SPLUNK-SURGE-CVE2023-4966',
        licenseOrTerms: 'Splunk Security Blog',
        url: 'https://www.splunk.com/en_us/blog/security/citrix-bleed-cve-2023-4966-vulnerability-analysis-and-detection.html',
        usageSummary:
          'Documents the `/oauth/idp/.well-known/openid-configuration` anomalous response size (>131 KB) and SPL session-hijack detection queries.',
      },
      {
        id: 'cisa-aa23-325a-citrix-bleed',
        organization: 'CISA / FBI / MS-ISAC / ASD Joint Advisory',
        title: 'Threat Actors Exploit Citrix Bleed (CVE-2023-4966) and Deploy LockBit 3.0 (AA23-325A)',
        referenceCode: 'CISA-AA23-325A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a',
        usageSummary:
          'Details post-exploitation `kill aaa session -all` / `kill pcon -all` mitigation and DaaS VDI session hijacking.',
      },
    ],
    syntheticDataNotice:
      'NetScaler NSC_AAAC 64-byte hex session cookies and gateway IPs are synthetic simulation values.',
  },
  'kaspersky-operation-triangulation': {
    scenarioId: 'kaspersky-operation-triangulation',
    scenarioCode: 'CVE-2023-38606',
    mitreTechniques: [
      {
        id: 'T1203',
        name: 'Exploitation for Client Execution (Zero-Click iMessage Font CVE-2023-41990)',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1203/',
      },
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation (Hardware MMIO PPL Bypass CVE-2023-38606)',
        tactic: 'Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1068/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Kaspersky GReAT’s 37C3 hardware analysis solved CVE-2023-38606, showing how the exploit writes to undocumented Apple A12–A16 SoC Memory-Mapped I/O (MMIO) GPU/DMA hardware registers (0x206040000) to bypass the hardware Page Protection Layer (PPL); (2) Kaspersky’s TriangleDB report dissected the volatile in-memory Mach-O implant (CRXPoll, CRXFetchRecord) and sms.db message deletion; and (3) Apple Security Engineering & NVD/CISA KEV advisories documented CVE-2023-41990 (undocumented TrueType font ADJUST 0x90 bytecode instruction in IMTranscoderAgent) and DataUsage.sqlite BackupAgent forensic artifacts.',
    primarySources: [
      {
        id: 'kaspersky-operation-triangulation',
        organization: 'Kaspersky GReAT (Global Research & Analysis Team)',
        title: 'Operation Triangulation: The Last (Hardware) Mystery (CVE-2023-38606 & MMIO DMA Bypass)',
        referenceCode: 'KASPERSKY-TRIANGULATION-2023',
        licenseOrTerms: 'Kaspersky Securelist Research Publication',
        url: 'https://securelist.com/operation-triangulation-the-last-hardware-mystery/111669/',
        usageSummary:
          'Documents the 4-zero-day chain (CVE-2023-41990, CVE-2023-32434, CVE-2023-38606 hardware MMIO DMA register bypass, CVE-2023-32435).',
      },
      {
        id: 'kaspersky-triangledb-analysis',
        organization: 'Kaspersky GReAT',
        title: 'Dissecting TriangleDB, the Operation Triangulation iOS Implant',
        referenceCode: 'KASPERSKY-TRIANGLEDB-2023',
        licenseOrTerms: 'Kaspersky Securelist Research Publication',
        url: 'https://securelist.com/triangledb-iostriangulation-implant/110050/',
        usageSummary:
          'Details TriangleDB in-memory modules (CRXPoll, CRXShowTables, CRXFetchRecord) and BackupAgent DataUsage.sqlite telemetry indicators.',
      },
      {
        id: 'nvd-apple-cve-2023-41990-38606',
        organization: 'Apple Security Engineering, NIST NVD & CISA KEV',
        title: 'CVE-2023-41990 (FontParser ADJUST Instruction) & CVE-2023-38606 (Kernel MMIO) Advisories',
        referenceCode: 'CVE-2023-38606 / CVE-2023-41990',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-38606',
        usageSummary:
          'Official vulnerability records for the legacy TrueType font bytecode interpreter flaw and undocumented SoC MMIO register access.',
      },
    ],
    syntheticDataNotice:
      'All iOS process logs and C2 domains represent defensive research indicators from Kaspersky GReAT.',
  },
  'kaspersky-toddycat-eset-dll': {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    scenarioCode: 'T1574.002',
    mitreTechniques: [
      {
        id: 'T1574.002',
        name: 'Hijack Execution Flow: DLL Side-Loading (ESET ecls.exe + version.dll / CVE-2024-11859)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/002/',
      },
      {
        id: 'T1055',
        name: 'Process Injection (TCESB, Samurai Backdoor & TomBerBil)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1055/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Kaspersky GReAT uncovered ToddyCat’s espionage toolset—showing how they side-load a malicious proxy DLL via ESET’s signed scanner to decrypt the TCESB / Samurai passive backdoor and TomBerBil credential stealer in memory; (2) ESET PSIRT & NVD (CVE-2024-11859) documented the underlying DLL search-order vulnerability in ESET Command Line Scanner (ecls.exe) and its official patch; and (3) MITRE ATT&CK T1574.002 defines the Sysmon EventID 7 detection rule catching a signed security binary loading an unsigned version.dll/http_dll.dll from a non-standard directory.',
    primarySources: [
      {
        id: 'kaspersky-toddycat-report',
        organization: 'Kaspersky GReAT (Global Research & Analysis Team)',
        title: 'ToddyCat: Keep Calm and Continue Espionage (Samurai, Ninja, LoFiSe & TCESB)',
        referenceCode: 'KASPERSKY-TODDYCAT-2024',
        licenseOrTerms: 'Kaspersky Securelist Research Publication',
        url: 'https://securelist.com/toddycat-keep-calm-and-continue-espionage/110698/',
        usageSummary:
          'Documents ToddyCat DLL side-loading via signed ESET binaries, TCESB/Samurai in-memory backdoor, and TomBerBil credential stealer.',
      },
      {
        id: 'eset-nvd-cve-2024-11859',
        organization: 'ESET Security Advisories & NIST NVD',
        title: 'CVE-2024-11859: ESET Command Line Scanner (ecls.exe) DLL Search Order Hijacking Vulnerability',
        referenceCode: 'CVE-2024-11859',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-11859',
        usageSummary:
          'Official vulnerability record for the unsecured DLL search path in standalone ESET ecls.exe exploited for side-loading.',
      },
      {
        id: 'mitre-s1091-samurai',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK T1574.002: Hijack Execution Flow — DLL Side-Loading & Export Forwarding',
        referenceCode: 'ATT&CK-T1574.002',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1574/002/',
        usageSummary:
          'Defines side-loading of proxy DLLs (`version.dll` / `http_dll.dll`) inside trusted security executables and Sysmon EID 7 hunting.',
      },
    ],
    syntheticDataNotice:
      'Exchange server hostnames and Samurai C2 endpoints are synthetic lab identifiers.',
  },
  'kaspersky-lazarus-byovd-fudmodule': {
    scenarioId: 'kaspersky-lazarus-byovd-fudmodule',
    scenarioCode: 'CVE-2024-21338',
    mitreTechniques: [
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation (appid.sys AppLocker Zero-Day CVE-2024-21338)',
        tactic: 'Privilege Escalation / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1068/',
      },
      {
        id: 'T1562.001',
        name: 'Impair Defenses: Disable or Modify Tools (FudModule DKOM Kernel Blind)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1562/001/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Avast Decoded Threat Labs discovered Lazarus Group (Diamond Sleet) exploiting CVE-2024-21338 as a zero-day—sending IOCTL 0x22A018 (AipSmartHashImageFile) to Windows’ own built-in C:\\Windows\\System32\\drivers\\appid.sys to spoof ObfDereferenceObjectWithTag and flip KTHREAD.PreviousMode to 0 (KernelMode); (2) Kaspersky GReAT analyzed the KaolinRAT delivery chain and FudModule’s Direct Kernel Object Manipulation (DKOM) array that zeroes out EPROCESS.Protection, kernel callbacks, and EtwThreatIntProvRegHandle; and (3) Microsoft MSRC (CVE-2024-21338) documented the kernel fix and AppIDSvc service-start telemetry (EventID 7040/7036).',
    primarySources: [
      {
        id: 'avast-kaspersky-lazarus-fudmodule',
        organization: 'Avast Decoded Threat Labs',
        title: 'Lazarus and the FudModule Rootkit: Beyond BYOVD with an Admin-to-Kernel Zero-Day (CVE-2024-21338)',
        referenceCode: 'AVAST-CVE-2024-21338',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://decoded.avast.io/janvojtesek/lazarus-and-the-fudmodule-rootkit-beyond-byovd-with-an-admin-to-kernel-zero-day/',
        usageSummary:
          'Documents IOCTL 0x22A018 in Windows appid.sys, PreviousMode kernel read/write primitive, and FudModule DKOM EPROCESS/ETW blinding.',
      },
      {
        id: 'msrc-cve-2024-21338',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'CVE-2024-21338 Windows Kernel Elevation of Privilege Vulnerability (appid.sys)',
        referenceCode: 'MSRC-CVE-2024-21338',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21338',
        usageSummary:
          'Official Microsoft patch advisory for the AppLocker driver IOCTL pointer manipulation vulnerability.',
      },
      {
        id: 'kaspersky-lazarus-kaolinrat-fudmodule',
        organization: 'Kaspersky GReAT & MITRE ATT&CK G0032',
        title: 'Lazarus Group (Diamond Sleet) KaolinRAT & FudModule Kernel Callback Blinding Analysis',
        referenceCode: 'KASPERSKY-LAZARUS-FUDMODULE',
        licenseOrTerms: 'Kaspersky Securelist & MITRE ATT&CK',
        url: 'https://attack.mitre.org/groups/G0032/',
        usageSummary:
          'Details how FudModule suspends PPL-protected EDR services and clears PsSetCreateProcessNotifyRoutine and ObRegisterCallbacks.',
      },
    ],
    syntheticDataNotice:
      'Kernel EPROCESS offsets and KaolinRAT C2 endpoints are synthetic educational artifacts.',
  },
  'mandiant-apt29-teamcity-jetstream': {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    scenarioCode: 'CVE-2023-42793',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (JetBrains TeamCity CVE-2023-42793)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1098.001',
        name: 'Account Manipulation: Additional Cloud Credentials',
        tactic: 'Persistence',
        url: 'https://attack.mitre.org/techniques/T1098/001/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) SonarSource & Rapid7 AttackerKB discovered and dissected the exact Java RequestInterceptors wildcard path-matching bug—explaining why POST /app/rest/users/id:1/tokens/RPC2 (ending in /RPC2) tricks TeamCity into treating an admin REST token-creation call as an unauthenticated XML-RPC endpoint; (2) Joint CISA/FBI/NSA/NCSC-UK/Mandiant Advisory AA23-347A documented how APT29 (Midnight Blizzard) abused /app/rest/debug/processes to spawn shells, harvest CI/CD secrets, and deploy the GraphicalProton backdoor (OneDrive/Dropbox C2); and (3) JetBrains Security & NVD provided the teamcity-javaLogging and audit log detection rules.',
    primarySources: [
      {
        id: 'mandiant-ms-apt29-teamcity',
        organization: 'CISA, FBI, NSA, NCSC-UK & Mandiant',
        title: 'Russian Foreign Intelligence Service (SVR / APT29) Exploiting JetBrains TeamCity CVE-2023-42793 (AA23-347A)',
        referenceCode: 'CISA-AA23-347A',
        licenseOrTerms: 'U.S. Government Public Domain & Mandiant Research',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-347a',
        usageSummary:
          'Documents APT29 mass exploitation, `/app/rest/debug/processes` command execution, and GraphicalProton C2 deployment.',
      },
      {
        id: 'sonarsource-rapid7-teamcity-cve-2023-42793',
        organization: 'SonarSource & Rapid7 Vulnerability Research',
        title: 'JetBrains TeamCity Critical Auth Bypass (CVE-2023-42793): RequestInterceptors /**/RPC2 Root-Cause Analysis',
        referenceCode: 'SONAR-CVE-2023-42793',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://www.sonarsource.com/blog/jetbrains-teamcity-averted-supply-chain-attack/',
        usageSummary:
          'Explains why the `/**/RPC2` wildcard in TeamCity RequestInterceptors bypassed authentication on `/app/rest/users/id:1/tokens/RPC2` and how `internal.debug.processes.enable=true` unlocks RCE.',
      },
      {
        id: 'nvd-cve-2023-42793',
        organization: 'NIST NVD & JetBrains Security',
        title: 'CVE-2023-42793 JetBrains TeamCity On-Premises Authentication Bypass & RCE',
        referenceCode: 'CVE-2023-42793',
        licenseOrTerms: 'Public Domain',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-42793',
        usageSummary:
          'Official vulnerability advisory and `teamcity-server.log` / `teamcity-activities.log` token-creation forensic indicators.',
      },
    ],
    syntheticDataNotice:
      'CI/CD build server hostnames and OneDrive C2 tokens are synthetic simulation identifiers.',
  },
  'splunk-screenconnect-slashandgrab': {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    scenarioCode: 'CVE-2024-1709',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (ScreenConnect SetupWizard.aspx CVE-2024-1709)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/',
      },
      {
        id: 'T1219',
        name: 'Remote Access Software (ScreenConnect.ClientService.exe Abuse)',
        tactic: 'Command and Control / Execution',
        url: 'https://attack.mitre.org/techniques/T1219/',
      },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Huntress Security Research ("SlashAndGrab") reverse-engineered the ASP.NET URL-parsing flaw—proving why appending a trailing slash (/SetupWizard.aspx/ or /SetupWizard.aspx/anything) populates Request.PathInfo and bypasses ScreenConnect’s setup-lock check to overwrite App_Data\\User.xml, and how attackers pushed SYSTEM scripts via ScreenConnect.ClientService.exe into C:\\Windows\\Temp\\ScreenConnect\\; (2) Splunk SURGe authored the SIEM SPL & Sysmon EventID 1/11 detection rules; and (3) ConnectWise Security Bulletin & CISA KEV documented the companion CVE-2024-1708 ZipSlip extension path-traversal vulnerability.',
    primarySources: [
      {
        id: 'huntress-slashandgrab-screenconnect',
        organization: 'Huntress Security Research',
        title: 'SlashAndGrab: ScreenConnect Post-Exploitation in the Wild (CVE-2024-1709 & CVE-2024-1708)',
        referenceCode: 'HUNTRESS-SLASHANDGRAB-2024',
        licenseOrTerms: 'Huntress Public Threat Research',
        url: 'https://www.huntress.com/blog/slashandgrab-screen-connect-post-exploitation-in-the-wild-cve-2024-1709-cve-2024-1708',
        usageSummary:
          'Dissects the ASP.NET `Request.PathInfo` `/SetupWizard.aspx/` auth bypass, `App_Data\\User.xml` overwrite, and mass RMM command execution across customer endpoints.',
      },
      {
        id: 'splunk-screenconnect-cve2024-1709',
        organization: 'Splunk SURGe Security Research',
        title: 'ConnectWise ScreenConnect Authentication Bypass (CVE-2024-1709 & CVE-2024-1708) Detection Guide',
        referenceCode: 'SPLUNK-SURGE-CVE2024-1709',
        licenseOrTerms: 'Splunk Security Blog',
        url: 'https://www.splunk.com/en_us/blog/security/connectwise-screenconnect-cve-2024-1709-cve-2024-1708.html',
        usageSummary:
          'Provides SPL detection rules for `User.xml` overwrite (Sysmon EID 11), `/SetupWizard.aspx/` HTTP logs, and `ScreenConnect.ClientService.exe` child shells.',
      },
      {
        id: 'connectwise-security-bulletin-2024',
        organization: 'ConnectWise Trust Center & CISA KEV',
        title: 'ConnectWise ScreenConnect 23.9.8 Security Patch Advisory (CVE-2024-1709 & CVE-2024-1708)',
        referenceCode: 'CW-SA-2024-02-19',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://www.connectwise.com/company/trust/security-bulletins/connectwise-screenconnect-23.9.8',
        usageSummary:
          'Official vendor bulletin describing the authentication bypass and extension ZipSlip path traversal vulnerabilities.',
      },
    ],
    syntheticDataNotice:
      'MSP server hostnames and rogue administrator usernames are synthetic simulation artifacts.',
  },
  ...BATCH_1_TO_4_ATTRIBUTIONS,
};

export function getScenarioAttribution(
  scenario: AttackScenario
): ScenarioAttributionProfile {
  const found = SCENARIO_ATTRIBUTION_MAP[scenario.id];
  if (found) return found;
  const fallback = SCENARIO_ATTRIBUTION_MAP['process-hollowing'];
  return {
    ...fallback,
    scenarioId: scenario.id,
    scenarioCode: scenario.code,
  };
}
