import { AttackScenario } from './attack-scenarios';

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
    'Safe Simulation Guarantee: No live exploit payloads, weaponized shellcode, or proprietary customer logs are included or executed. All hex previews and API call chains represent benign educational signatures used to train blue-team analysts on detection engineering.' };

export const GLOBAL_FRAMEWORK_SOURCES: SourceCitation[] = [
  {
    id: 'mitre-attack-enterprise',
    organization: 'The MITRE Corporation',
    title: 'MITRE ATT&CK® Enterprise Matrix (v15)',
    referenceCode: 'ATT&CK-ENTERPRISE-V15',
    licenseOrTerms: 'MITRE ATT&CK® Terms of Use / Apache 2.0',
    url: 'https://attack.mitre.org/matrices/enterprise/',
    usageSummary:
      'Used for adversary tactic categorization, technique IDs (T1055.012, T1562.001, T1486, T1190, T1558.003, T1071.004), and defensive mitigation mapping.' },
  {
    id: 'microsoft-sysmon-docs',
    organization: 'Microsoft Learn / Sysinternals',
    title: 'System Monitor (Sysmon) v15 & Windows Security Auditing Events',
    referenceCode: 'MS-SYSMON-EID-1-25',
    licenseOrTerms: 'Microsoft Open Documentation License (CC BY 4.0)',
    url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon',
    usageSummary:
      'Used to structure XML EventLog schemas for Sysmon Event IDs 1, 3, 8, 10, 11, 22, 25 and Windows Security Event IDs 4624, 4688, 4769, and PowerShell 4104.' },
  {
    id: 'sigmahq-detection-rules',
    organization: 'SigmaHQ Open Detection Community',
    title: 'Sigma Generic Signature Format for SIEM Systems',
    referenceCode: 'SIGMAHQ-RULES-SPEC',
    licenseOrTerms: 'Detection Rule License (DRL 1.1) / LGPv2',
    url: 'https://github.com/SigmaHQ/sigma',
    usageSummary:
      'Used as the structural specification for defensive SIEM detection rules shown in the Inspector panel.' },
  {
    id: 'cisa-nist-advisories',
    organization: 'CISA & NIST National Vulnerability Database (NVD)',
    title: 'CISA Cybersecurity Advisories & NIST SP 800-86 DFIR Guide',
    referenceCode: 'NIST-SP-800-86 / CISA-AA',
    licenseOrTerms: 'U.S. Government Public Domain (17 U.S.C. § 105)',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    usageSummary:
      'Used for incident response workflow modeling, CVE-2021-44228 (Log4Shell) forensic artifacts, and ransomware shadow-copy deletion indicators.' },
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
        url: 'https://attack.mitre.org/techniques/T1055/012/' },
      {
        id: 'T1106',
        name: 'Native API Execution (CreateProcessW / NtUnmapViewOfSection)',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1106/' },
      {
        id: 'T1071.001',
        name: 'Application Layer Protocol: Web Protocols (HTTPS C2)',
        tactic: 'Command and Control',
        url: 'https://attack.mitre.org/techniques/T1071/001/' },
    ],
    primarySources: [
      {
        id: 'ms-win32-proc-api',
        organization: 'Microsoft Win32 API Reference',
        title: 'CreateProcessW (CREATE_SUSPENDED), VirtualAllocEx & WriteProcessMemory',
        referenceCode: 'MSDN-WIN32-MEMORY',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw',
        usageSummary:
          'Documents the Win32 virtual memory and thread context APIs modeled in stages 1–4.' },
      {
        id: 'sysmon-eid25-tampering',
        organization: 'Microsoft Sysinternals',
        title: 'Sysmon Event ID 25: ProcessTampering (Image is replaced)',
        referenceCode: 'SYSMON-EID-25',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-25-processtampering',
        usageSummary:
          'Defines the telemetry schema when a process image is unmapped and replaced in user-mode memory.' },
    ],
    syntheticDataNotice:
      'Process Invoice_Q4.exe (PID 3104) and hollowed svchost.exe (PID 4892) on WKS-04 (10.10.4.15) are synthetic lab traces.' },
  'amsi-reflective-dll': {
    scenarioId: 'amsi-reflective-dll',
    scenarioCode: 'T1562.001',
    mitreTechniques: [
      {
        id: 'T1562.001',
        name: 'Impair Defenses: Disable or Modify Tools (AMSI Bypass)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1562/001/' },
      {
        id: 'T1059.001',
        name: 'Command and Scripting Interpreter: PowerShell',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1059/001/' },
      {
        id: 'T1620',
        name: 'Reflective Code Loading',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1620/' },
    ],
    primarySources: [
      {
        id: 'ms-amsi-architecture',
        organization: 'Microsoft Learn',
        title: 'Antimalware Scan Interface (AMSI) Developer Architecture',
        referenceCode: 'MS-AMSI-ARCH',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/windows/win32/amsi/antimalware-scan-interface-portal',
        usageSummary:
          'Describes how amsi.dll and AmsiScanBuffer inspect PowerShell script blocks prior to execution.' },
      {
        id: 'ps-eid-4104',
        organization: 'Microsoft PowerShell Team',
        title: 'PowerShell Operational Log Event ID 4104 (Script Block Logging)',
        referenceCode: 'MS-PS-EID-4104',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows',
        usageSummary:
          'Documents de-obfuscated script block capture used to detect P/Invoke VirtualProtect calls.' },
    ],
    syntheticDataNotice:
      'All memory offsets (0x7FF8A4123340) and byte patches represent documented educational signatures for defenders.' },
  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    scenarioCode: 'T1486 / T1490',
    mitreTechniques: [
      {
        id: 'T1490',
        name: 'Inhibit System Recovery (vssadmin / wmic shadowcopy delete)',
        tactic: 'Impact',
        url: 'https://attack.mitre.org/techniques/T1490/' },
      {
        id: 'T1486',
        name: 'Data Encrypted for Impact',
        tactic: 'Impact',
        url: 'https://attack.mitre.org/techniques/T1486/' },
    ],
    primarySources: [
      {
        id: 'cisa-aa23-165a',
        organization: 'CISA / FBI / MS-ISAC Joint Advisory',
        title: 'Understanding Ransomware Threat Actors: LockBit 3.0 (AA23-165A)',
        referenceCode: 'CISA-AA23-165A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a',
        usageSummary:
          'Public joint cybersecurity advisory detailing Volume Shadow Copy deletion and high-speed I/O encryption telemetry.' },
      {
        id: 'ms-vss-sysmon-eid1-11',
        organization: 'Microsoft Learn & Sysinternals',
        title: 'Volume Shadow Copy Service (VSS) & Sysmon Event ID 1 / 11',
        referenceCode: 'MS-VSS-SYSMON-11',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/windows-server/storage/file-server/volume-shadow-copy-service',
        usageSummary:
          'Documents vssadmin.exe shadow deletion command-line auditing (EID 1) and ransom-note FileCreate telemetry (EID 11).' },
    ],
    syntheticDataNotice:
      'Simulated ransomware file events occur strictly within a virtualized scenario model with fictional filenames.' },
  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    scenarioCode: 'CVE-2021-44228',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Log4Shell JNDI Lookup)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1059.004',
        name: 'Command and Scripting Interpreter: Unix Shell',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1059/004/' },
    ],
    primarySources: [
      {
        id: 'nvd-cve-2021-44228',
        organization: 'NIST NVD & Apache Software Foundation',
        title: 'CVE-2021-44228 Apache Log4j2 JNDI Lookup Advisory',
        referenceCode: 'CVE-2021-44228',
        licenseOrTerms: 'Public Domain / Apache License 2.0',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
        usageSummary:
          'Official vulnerability specification for JNDI LDAP lookup injection in Apache Log4j2.' },
      {
        id: 'cisa-log4j-guidance',
        organization: 'CISA Emergency Directive',
        title: 'Apache Log4j Vulnerability Guidance & Detection Signatures',
        referenceCode: 'CISA-ED-22-02',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance',
        usageSummary:
          'Provides the Nginx access log, Zeek LDAP, and Linux auditd execve correlation patterns.' },
    ],
    syntheticDataNotice:
      'Nginx HTTP headers and LDAP callback URIs use de-identified RFC test addresses.' },
  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    scenarioCode: 'T1558.003',
    mitreTechniques: [
      {
        id: 'T1558.003',
        name: 'Steal or Forge Kerberos Tickets: Kerberoasting',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1558/003/' },
      {
        id: 'T1550.002',
        name: 'Use Alternate Authentication Material: Pass the Hash',
        tactic: 'Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1550/002/' },
    ],
    primarySources: [
      {
        id: 'ms-eid-4769',
        organization: 'Microsoft Windows Security Auditing',
        title: 'Event ID 4769: A Kerberos service ticket was requested (RC4 0x17)',
        referenceCode: 'MS-AUDITING-4769',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769',
        usageSummary:
          'Documents TicketEncryptionType 0x17 (RC4-HMAC) and TicketOptions 0x40810000 auditing on Domain Controllers.' },
      {
        id: 'ms-eid-4624',
        organization: 'Microsoft Windows Security Auditing',
        title: 'Event ID 4624: An account was successfully logged on (LogonType 3)',
        referenceCode: 'MS-AUDITING-4624',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624',
        usageSummary:
          'Defines NTLMv2 network logon telemetry used to detect lateral movement across SMB.' },
    ],
    syntheticDataNotice:
      'Active Directory domain CORP.LOCAL, SPN svc_mssql, and NTLM hashes are fictional lab identifiers.' },
  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    scenarioCode: 'T1071.004',
    mitreTechniques: [
      {
        id: 'T1071.004',
        name: 'Application Layer Protocol: DNS (DNS Tunneling C2)',
        tactic: 'Command and Control',
        url: 'https://attack.mitre.org/techniques/T1071/004/' },
      {
        id: 'T1048.003',
        name: 'Exfiltration Over Alternative Protocol',
        tactic: 'Exfiltration',
        url: 'https://attack.mitre.org/techniques/T1048/003/' },
    ],
    primarySources: [
      {
        id: 'ietf-rfc-1035',
        organization: 'IETF Network Working Group',
        title: 'RFC 1035: Domain Names — Implementation and Specification',
        referenceCode: 'IETF-RFC-1035',
        licenseOrTerms: 'IETF Public Specification',
        url: 'https://datatracker.ietf.org/doc/html/rfc1035',
        usageSummary:
          'Defines DNS TXT/CNAME record structures and subdomain label length constraints.' },
      {
        id: 'sysmon-eid-22-dns',
        organization: 'Microsoft Sysinternals',
        title: 'Sysmon Event ID 22: DNSEvent (DNS Query Logging)',
        referenceCode: 'SYSMON-EID-22',
        licenseOrTerms: 'Microsoft Documentation (CC BY 4.0)',
        url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-22-dnsevent',
        usageSummary:
          'Captures process-attributed DNS queries for Shannon entropy and volumetric analysis.' },
    ],
    syntheticDataNotice:
      'Base32 subdomain labels and c2-DropZone.net domain names are non-routable synthetic strings.' } };

export function getScenarioAttribution(
  scenario: AttackScenario
): ScenarioAttributionProfile {
  return (
    SCENARIO_ATTRIBUTION_MAP[scenario.id] ||
    SCENARIO_ATTRIBUTION_MAP['process-hollowing']
  );
}
