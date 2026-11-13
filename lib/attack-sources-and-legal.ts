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
      'Base32 subdomain labels and c2-DropZone.net domain names are non-routable synthetic strings.' },
  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    scenarioCode: 'CVE-2024-3400',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (PAN-OS GlobalProtect CVE-2024-3400)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1059.006',
        name: 'Command and Scripting Interpreter: Python (UPSTYLE Backdoor)',
        tactic: 'Execution / Persistence',
        url: 'https://attack.mitre.org/techniques/T1059/006/' },
    ],
    primarySources: [
      {
        id: 'unit42-cve-2024-3400-brief',
        organization: 'Palo Alto Networks Unit 42',
        title: 'Threat Brief: Operation MidnightEclipse, Post-Exploitation Activity Related to CVE-2024-3400',
        referenceCode: 'UNIT42-MIDNIGHTECLIPSE-2024',
        licenseOrTerms: 'Palo Alto Networks Unit 42 Threat Research',
        url: 'https://unit42.paloaltonetworks.com/cve-2024-3400/',
        usageSummary:
          'Documents the SESSID cookie path traversal, sendTelemetry cron execution, UPSTYLE Python backdoor in system.pth, and running-config.xml extraction.' },
      {
        id: 'paloalto-psirt-cve-2024-3400',
        organization: 'Palo Alto Networks Security Advisories',
        title: 'CVE-2024-3400 PAN-OS: Arbitrary File Creation Leads to OS Command Injection in GlobalProtect',
        referenceCode: 'PAN-SA-2024-0005',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://security.paloaltonetworks.com/CVE-2024-3400',
        usageSummary:
          'Official vendor advisory detailing affected PAN-OS versions and telemetry remediations.' },
    ],
    syntheticDataNotice:
      'Firewall management IPs and C2 staging domains use RFC 5737 documentation blocks (198.51.100.0/24).' },
  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    scenarioCode: 'T1218.014',
    mitreTechniques: [
      {
        id: 'T1218.014',
        name: 'System Binary Proxy Execution: MMC (GrimResource)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1218/014/' },
      {
        id: 'T1055',
        name: 'Process Injection (RwSection Injection into dllhost.exe)',
        tactic: 'Defense Evasion / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1055/' },
    ],
    primarySources: [
      {
        id: 'elastic-grimresource-advisory',
        organization: 'Elastic Security Labs',
        title: 'GrimResource — Microsoft Management Console for Initial Access and Evasion',
        referenceCode: 'ELASTIC-GRIMRESOURCE-2024',
        licenseOrTerms: 'Elastic Security Labs Research Publication',
        url: 'https://www.elastic.co/security-labs/grimresource',
        usageSummary:
          'Documents the apds.dll XSS DOM redirect, DotNetToJScript deserialization in mmc.exe, and RwSection injection into dllhost.exe.' },
      {
        id: 'mitre-t1218-014',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK T1218.014: System Binary Proxy Execution — MMC',
        referenceCode: 'ATT&CK-T1218.014',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1218/014/',
        usageSummary:
          'Defines MMC snap-in abuse and trusted binary proxy execution.' },
    ],
    syntheticDataNotice:
      'Workstation hostnames and Cobalt Strike C2 IP addresses are synthetic lab telemetry modeled on Elastic Security Labs findings.' },
  'elastic-lotus-blossom-chrysalis': {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    scenarioCode: 'T1574.002',
    mitreTechniques: [
      {
        id: 'T1574.002',
        name: 'Hijack Execution Flow: DLL Side-Loading (WinGUp GUP.exe + libcurl.dll)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/002/' },
      {
        id: 'T1055',
        name: 'In-Memory Shellcode Decryptor (CHRYSALIS Backdoor)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1055/' },
    ],
    primarySources: [
      {
        id: 'elastic-lotus-blossom-advisory',
        organization: 'Elastic Security Labs',
        title: 'Lotus Blossom Espionage Intrusion Analysis: Sagerunex & CHRYSALIS Loader Chains',
        referenceCode: 'ELASTIC-LOTUS-BLOSSOM-2024',
        licenseOrTerms: 'Elastic Security Labs Research Publication',
        url: 'https://www.elastic.co/security-labs',
        usageSummary:
          'Documents Notepad++ WinGUp (GUP.exe) side-loading of malicious libcurl.dll and CHRYSALIS shellcode decryption.' },
      {
        id: 'mitre-g0030-lotus-blossom',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK Group G0030: Lotus Blossom (Spring Dragon / Billbug)',
        referenceCode: 'ATT&CK-G0030',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/groups/G0030/',
        usageSummary:
          'Provides canonical TTP mapping for Lotus Blossom DLL side-loading and custom backdoors.' },
    ],
    syntheticDataNotice:
      'All endpoint hostnames and C2 domains in this Lotus Blossom scenario are synthetic lab traces.' },
  'unit42-scattered-spider-cloud': {
    scenarioId: 'unit42-scattered-spider-cloud',
    scenarioCode: 'T1078.004',
    mitreTechniques: [
      {
        id: 'T1556.006',
        name: 'Modify Authentication Process: Multi-Factor Authentication',
        tactic: 'Credential Access / Persistence',
        url: 'https://attack.mitre.org/techniques/T1556/006/' },
      {
        id: 'T1078.004',
        name: 'Valid Accounts: Cloud Accounts',
        tactic: 'Initial Access / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1078/004/' },
      {
        id: 'T1219',
        name: 'Remote Access Software (Commercial RMM Tunneling)',
        tactic: 'Command and Control',
        url: 'https://attack.mitre.org/techniques/T1219/' },
    ],
    primarySources: [
      {
        id: 'unit42-muddled-libra-profile',
        organization: 'Palo Alto Networks Unit 42',
        title: 'Muddled Libra (Scattered Spider) Cloud Identity & VMware ESXi Intrusion Playbook',
        referenceCode: 'UNIT42-MUDDLED-LIBRA-2024',
        licenseOrTerms: 'Palo Alto Networks Unit 42 Threat Research',
        url: 'https://unit42.paloaltonetworks.com/muddled-libra/',
        usageSummary:
          'Details helpdesk social engineering, rogue FIDO2 MFA registration, RMM deployment, and AWS/ESXi cloud pivot.' },
      {
        id: 'cisa-aa23-320a',
        organization: 'CISA & FBI Joint Advisory',
        title: 'Scattered Spider (AA23-320A) Cybersecurity Advisory',
        referenceCode: 'CISA-AA23-320A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a',
        usageSummary:
          'Corroborates Muddled Libra / Scattered Spider cloud-to-hypervisor TTPs and RMM abuse.' },
    ],
    syntheticDataNotice:
      'Okta/Entra ID UPNs, session IDs, and ESXi hostnames are synthetic simulation identifiers.' },
  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    scenarioCode: 'T1620',
    mitreTechniques: [
      {
        id: 'T1574.002',
        name: 'Hijack Execution Flow: DLL Side-Loading (DodgeBox / taskhost.exe)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/002/' },
      {
        id: 'T1620',
        name: 'Reflective Code Loading (Call-Stack Spoofing & DUSTPAN / STEALTHVECTOR)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1620/' },
    ],
    primarySources: [
      {
        id: 'elastic-apt41-stealthvector',
        organization: 'Elastic Security Labs & Mandiant',
        title: 'APT41 (Brass Typhoon) DodgeBox, Call-Stack Spoofing, and DUSTPAN Loader Analysis',
        referenceCode: 'ELASTIC-MANDIANT-APT41-2024',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://www.elastic.co/security-labs',
        usageSummary:
          'Documents DodgeBox/DUSTPAN DLL side-loading, synthetic BaseThreadInitThunk call-stack spoofing, and Cloudflare Workers C2.' },
      {
        id: 'mitre-g0096-apt41',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK Group G0096: APT41 (Wicked Panda / Brass Typhoon)',
        referenceCode: 'ATT&CK-G0096',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/groups/G0096/',
        usageSummary:
          'Defines APT41 loader chains and memory evasion techniques.' },
    ],
    syntheticDataNotice:
      'Memory stack frames and Cloudflare Workers domains are synthetic defensive indicators.' },
  'ms-volt-typhoon-lotl': {
    scenarioId: 'ms-volt-typhoon-lotl',
    scenarioCode: 'T1003.003',
    mitreTechniques: [
      {
        id: 'T1003.003',
        name: 'OS Credential Dumping: NTDS (ntdsutil.exe create full)',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1003/003/' },
      {
        id: 'T1090.002',
        name: 'Proxy: External Proxy (netsh interface portproxy v4tov4)',
        tactic: 'Command and Control / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1090/002/' },
    ],
    primarySources: [
      {
        id: 'ms-volt-typhoon-blog',
        organization: 'Microsoft Threat Intelligence',
        title: 'Volt Typhoon targets US critical infrastructure with living-off-the-land techniques',
        referenceCode: 'MSFT-VOLT-TYPHOON-2023',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/',
        usageSummary:
          'Documents KV Botnet SOHO router proxying, wmic/ntdsutil IFM credential dumping, and netsh interface portproxy v4tov4 persistence.' },
      {
        id: 'cisa-aa24-038a-volt-typhoon',
        organization: 'CISA / NSA / FBI Joint Advisory',
        title: 'PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure (AA24-038A)',
        referenceCode: 'CISA-AA24-038A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a',
        usageSummary:
          'Provides comprehensive Event ID 7040, Registry PortProxy, and ntdsutil hunting queries.' },
    ],
    syntheticDataNotice:
      'All Domain Controller paths and portproxy IP addresses use RFC 1918 private lab ranges.' },
  'ms-midnight-blizzard-oauth': {
    scenarioId: 'ms-midnight-blizzard-oauth',
    scenarioCode: 'T1098.003',
    mitreTechniques: [
      {
        id: 'T1110.003',
        name: 'Brute Force: Password Spraying',
        tactic: 'Initial Access / Credential Access',
        url: 'https://attack.mitre.org/techniques/T1110/003/' },
      {
        id: 'T1098.003',
        name: 'Account Manipulation: Additional Cloud Roles (full_access_as_app)',
        tactic: 'Persistence / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1098/003/' },
    ],
    primarySources: [
      {
        id: 'ms-midnight-blizzard-guidance',
        organization: 'Microsoft Threat Intelligence',
        title: 'Midnight Blizzard: Guidance for responders on nation-state attack',
        referenceCode: 'MSFT-MIDNIGHT-BLIZZARD-2024',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/',
        usageSummary:
          'Details low-volume residential proxy password spraying against non-production tenants and OAuth app elevation to full_access_as_app.' },
      {
        id: 'cisa-ed-24-02-midnight-blizzard',
        organization: 'CISA Emergency Directive',
        title: 'Emergency Directive 24-02: Mitigating the Significant Risk from Nation-State Compromise of Microsoft Corporate Email',
        referenceCode: 'CISA-ED-24-02',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/directives/ed-24-02-mitigating-significant-risk-nation-state-compromise-microsoft-corporate-email',
        usageSummary:
          'Provides cloud identity auditing and OAuth application governance requirements.' },
    ],
    syntheticDataNotice:
      'Entra ID AppIds, TenantIds, and mailbox identifiers are synthetic training values.' },
  'ms-salt-typhoon-telecom': {
    scenarioId: 'ms-salt-typhoon-telecom',
    scenarioCode: 'T1014',
    mitreTechniques: [
      {
        id: 'T1014',
        name: 'Rootkit (Demodex Kernel Driver & GhostSpider)',
        tactic: 'Defense Evasion / Persistence',
        url: 'https://attack.mitre.org/techniques/T1014/' },
      {
        id: 'T1552.001',
        name: 'Unsecured Credentials: Credentials In Files (TACACS+ / RADIUS Capture)',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1552/001/' },
    ],
    primarySources: [
      {
        id: 'cisa-nsa-fbi-telecom-2024',
        organization: 'CISA / NSA / FBI / Microsoft Threat Intelligence',
        title: 'Enhanced Visibility and Hardening Guidance for Communications Infrastructure (Salt Typhoon / FamousSparrow)',
        referenceCode: 'CISA-TELECOM-2024',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
        usageSummary:
          'Documents Salt Typhoon (GhostEmperor) Demodex kernel rootkit, GhostSpider modular backdoor, and TACACS+ core router credential capture.' },
      {
        id: 'kaspersky-ghostemperor-demodex',
        organization: 'Kaspersky GReAT',
        title: 'GhostEmperor: From ProxyLogon to Kernel Mode with Demodex Rootkit',
        referenceCode: 'KASPERSKY-DEMODEX',
        licenseOrTerms: 'Kaspersky Securelist Research',
        url: 'https://securelist.com/ghostemperor-from-proxylogon-to-kernel-mode/104407/',
        usageSummary:
          'Technical analysis of the Demodex kernel rootkit driver and registry/process hiding.' },
    ],
    syntheticDataNotice:
      'Telecom router loopback IPs and TACACS+ keys are synthetic lab representations.' },
  'ms-forest-blizzard-gooseegg': {
    scenarioId: 'ms-forest-blizzard-gooseegg',
    scenarioCode: 'CVE-2022-38028',
    mitreTechniques: [
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation (Print Spooler CVE-2022-38028 GooseEgg)',
        tactic: 'Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1068/' },
      {
        id: 'T1574.001',
        name: 'Hijack Execution Flow: DLL Search Order Hijacking (wayzgoose.dll)',
        tactic: 'Persistence / Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1574/001/' },
    ],
    primarySources: [
      {
        id: 'ms-forest-blizzard-gooseegg-blog',
        organization: 'Microsoft Threat Intelligence',
        title: 'Analyzing Forest Blizzard’s custom post-compromise tool for exploiting CVE-2022-38028 to obtain credentials',
        referenceCode: 'MSFT-GOOSEEGG-2024',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2024/04/22/analyzing-forest-blizzards-custom-post-compromise-tool-for-exploiting-cve-2022-38028-to-obtain-credentials/',
        usageSummary:
          'Documents execute.bat, justice.exe (GooseEgg), DriverStore pnms009.inf modification, and wayzgoose.dll SYSTEM execution inside spoolsv.exe.' },
      {
        id: 'msrc-cve-2022-38028',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'CVE-2022-38028 Windows Print Spooler Elevation of Privilege Vulnerability',
        referenceCode: 'MSRC-CVE-2022-38028',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38028',
        usageSummary:
          'Official vulnerability advisory for JavaScript Constraints file manipulation in Windows Print Spooler.' },
    ],
    syntheticDataNotice:
      'All DriverStore GUID paths and workstation identifiers are synthetic training artifacts.' },
  'unit42-star-blizzard-evilginx-aitm': {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    scenarioCode: 'T1539',
    mitreTechniques: [
      {
        id: 'T1539',
        name: 'Steal Web Session Cookie (Evilginx AiTM ESTSAUTHPERSISTENT Capture)',
        tactic: 'Credential Access',
        url: 'https://attack.mitre.org/techniques/T1539/' },
      {
        id: 'T1550.004',
        name: 'Use Alternate Authentication Material: Web Session Cookie',
        tactic: 'Defense Evasion / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1550/004/' },
    ],
    primarySources: [
      {
        id: 'ms-cisa-star-blizzard-advisory',
        organization: 'Microsoft Threat Intelligence, Unit 42 & CISA',
        title: 'Star Blizzard (SEABORGIUM / COLDRIVER) Adversary-in-the-Middle Spear-Phishing & Session Cookie Theft',
        referenceCode: 'CISA-AA23-341A',
        licenseOrTerms: 'U.S. Government Public Domain & Microsoft Threat Intel',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-341a',
        usageSummary:
          'Documents Evilginx reverse-proxy AiTM phishing, ESTSAUTHPERSISTENT cookie interception, and hidden Exchange inbox forwarding rules.' },
      {
        id: 'mitre-t1539-session-cookie',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK T1539: Steal Web Session Cookie',
        referenceCode: 'ATT&CK-T1539',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1539/',
        usageSummary:
          'Defines adversary-in-the-middle session cookie theft and FIDO2/CAE token protection mitigations.' },
    ],
    syntheticDataNotice:
      'All lure domains, session cookies, and mailbox addresses are synthetic defensive simulation data.' },
  'talos-arcanedoor-asa': {
    scenarioId: 'talos-arcanedoor-asa',
    scenarioCode: 'CVE-2024-20353',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Cisco ASA CVE-2024-20353)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1542.004',
        name: 'Pre-OS Boot: ROMMON / Bootimage Persistence (Line Runner)',
        tactic: 'Persistence',
        url: 'https://attack.mitre.org/techniques/T1542/004/' },
      {
        id: 'T1562.003',
        name: 'Impair Defenses: Disable Syslog & Crashdump Forensics (Line Dancer)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1562/003/' },
    ],
    primarySources: [
      {
        id: 'talos-arcanedoor-report',
        organization: 'Cisco Talos Intelligence Group',
        title: 'ArcaneDoor — New Espionage-Focused Campaign Found Targeting Perimeter Network Devices',
        referenceCode: 'TALOS-ARCANEDOOR-2024',
        licenseOrTerms: 'Cisco Talos Threat Research',
        url: 'https://blog.talosintelligence.com/arcanedoor-new-espionage-focused-campaign-found-targeting-perimeter-network-devices/',
        usageSummary:
          'Documents UAT4356 exploitation of CVE-2024-20353/CVE-2024-20359, Line Dancer in-memory shellcode interpreter, and Line Runner lina_monitor persistence.' },
      {
        id: 'cisco-psirt-arcanedoor',
        organization: 'Cisco Security Advisories',
        title: 'Cisco Adaptive Security Appliance and Firepower Threat Defense Software Web Services Denial of Service and Persistence (CVE-2024-20353, CVE-2024-20359)',
        referenceCode: 'CISCO-SA-ASAFTD-2024',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-persist-rce-FLsNXF4h',
        usageSummary:
          'Provides Cisco IOS/ASA Integrity Assurance verification steps (verify /sha-512 system:memory/text).' },
    ],
    syntheticDataNotice:
      'ASA memory addresses and IPsec VPN peer addresses are synthetic representations.' },
  'talos-fortinet-coathanger-apt': {
    scenarioId: 'talos-fortinet-coathanger-apt',
    scenarioCode: 'CVE-2024-21762',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (FortiOS SSL-VPN CVE-2024-21762 / CVE-2022-42475)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1574.006',
        name: 'Hijack Execution Flow: Dynamic Linker Hijacking (COATHANGER preload.so & smartctl)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/006/' },
    ],
    primarySources: [
      {
        id: 'ncsc-nl-coathanger-report',
        organization: 'NCSC-NL (Netherlands MIVD/AIVD) & FortiGuard Labs',
        title: 'COATHANGER: Chinese Cyber Espionage Malware Targeting FortiGate Appliances',
        referenceCode: 'NCSC-NL-COATHANGER-2024',
        licenseOrTerms: 'Public Government Cybersecurity Advisory',
        url: 'https://english.ncsc.nl/publications/publications/2024/february/6/mivd-and-aivd-alert-on-coathanger-malware',
        usageSummary:
          'Documents FortiOS SSL-VPN exploitation, `/data/lib/preload.so` LD_PRELOAD injection, and `/bin/smartctl` reboot persistence.' },
      {
        id: 'cisa-cve-2024-21762',
        organization: 'CISA & Fortinet PSIRT',
        title: 'FG-IR-24-015 / CVE-2024-21762 FortiOS SSL-VPN Out-of-Bounds Write RCE',
        referenceCode: 'FG-IR-24-015',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://www.fortiguard.com/psirt/FG-IR-24-015',
        usageSummary:
          'Official Fortinet PSIRT advisory for HTTP chunked transfer encoding out-of-bounds write in sslvpnd.' },
    ],
    syntheticDataNotice:
      'FortiGate appliance serials and Ministry subnet addresses are synthetic simulation data.' },
  'f5-bigip-request-smuggling': {
    scenarioId: 'f5-bigip-request-smuggling',
    scenarioCode: 'CVE-2023-46747',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (F5 BIG-IP TMUI AJP Smuggling CVE-2023-46747)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1059.004',
        name: 'Command and Scripting Interpreter: Unix Shell (/mgmt/tm/util/bash)',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1059/004/' },
    ],
    primarySources: [
      {
        id: 'f5-k000137353-praetorian',
        organization: 'F5 SIRT & Praetorian / ProjectDiscovery Research',
        title: 'F5 BIG-IP Configuration Utility Unauthenticated RCE (CVE-2023-46747) & AJP Request Smuggling',
        referenceCode: 'F5-K000137353',
        licenseOrTerms: 'Public Security Advisory & Technical Write-Up',
        url: 'https://my.f5.com/manage/s/article/K000137353',
        usageSummary:
          'Documents Apache/Tomcat AJP request smuggling (`REMOTEROLE: 0`), `form-user` admin creation, and `/mgmt/tm/util/bash` root command execution.' },
      {
        id: 'nvd-cve-2023-46747',
        organization: 'NIST National Vulnerability Database (NVD)',
        title: 'CVE-2023-46747 F5 BIG-IP Traffic Management User Interface (TMUI) Auth Bypass',
        referenceCode: 'CVE-2023-46747',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-46747',
        usageSummary:
          'Official CVE specification for BIG-IP AJP request smuggling.' },
    ],
    syntheticDataNotice:
      'All BIG-IP management IPs and SSL key filenames in this scenario are synthetic defensive simulation data.' },
  'splunk-ivanti-connect-secure': {
    scenarioId: 'splunk-ivanti-connect-secure',
    scenarioCode: 'CVE-2024-21887',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Ivanti CVE-2023-46805 & CVE-2024-21887)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1574.006',
        name: 'Hijack Execution Flow: Dynamic Linker Hijacking (ZIPLINE LD_PRELOAD)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/006/' },
    ],
    primarySources: [
      {
        id: 'mandiant-unc5221-ivanti-blog',
        organization: 'Mandiant & Splunk SURGe Threat Research',
        title: 'Cutting Edge: Suspected APT Targets Ivanti Connect Secure VPN in New Zero-Day Exploitation',
        referenceCode: 'MANDIANT-UNC5221-2024',
        licenseOrTerms: 'Mandiant & Splunk Security Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/suspected-apt-targets-ivanti-zero-day',
        usageSummary:
          'Documents the `/api/v1/totp/user-backup-code/../../license/keys-status/` exploit chain, ZIPLINE `libsecure.so` backdoor, and WARPWIRE credential harvester.' },
      {
        id: 'cisa-ed-24-01-ivanti',
        organization: 'CISA Emergency Directive',
        title: 'Emergency Directive 24-01: Mitigate Ivanti Connect Secure and Ivanti Policy Secure Vulnerabilities',
        referenceCode: 'CISA-ED-24-01',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities',
        usageSummary:
          'Provides forensic integrity checking and ICT snapshot validation procedures.' },
    ],
    syntheticDataNotice:
      'VPN gateway IP addresses and admin credentials in WARPWIRE beacons are synthetic simulation strings.' },
  'splunk-citrix-bleed-session-hijack': {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    scenarioCode: 'CVE-2023-4966',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (Citrix NetScaler CVE-2023-4966)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1550.004',
        name: 'Use Alternate Authentication Material: Web Session Cookie (NSC_AAAC)',
        tactic: 'Defense Evasion / Lateral Movement',
        url: 'https://attack.mitre.org/techniques/T1550/004/' },
    ],
    primarySources: [
      {
        id: 'splunk-citrix-bleed-analysis',
        organization: 'Splunk SURGe Security Research',
        title: 'Citrix Bleed (CVE-2023-4966) Vulnerability Analysis and Detection Guidance',
        referenceCode: 'SPLUNK-SURGE-CVE2023-4966',
        licenseOrTerms: 'Splunk Security Blog',
        url: 'https://www.splunk.com/en_us/blog/security/citrix-bleed-cve-2023-4966-vulnerability-analysis-and-detection.html',
        usageSummary:
          'Documents the `/oauth/idp/.well-known/openid-configuration` Host header snprintf overread, NSC_AAAC session token theft, and SPL detection queries.' },
      {
        id: 'cisa-aa23-325a-citrix-bleed',
        organization: 'CISA / FBI / MS-ISAC / ASD Joint Advisory',
        title: 'Threat Actors Exploit Citrix Bleed (CVE-2023-4966) and Deploy LockBit 3.0 (AA23-325A)',
        referenceCode: 'CISA-AA23-325A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a',
        usageSummary:
          'Details post-exploitation `killpcbs -all` mitigation and DaaS VDI session hijacking.' },
    ],
    syntheticDataNotice:
      'NetScaler NSC_AAAC 64-byte hex session cookies and gateway IPs are synthetic simulation values.' },
  'kaspersky-operation-triangulation': {
    scenarioId: 'kaspersky-operation-triangulation',
    scenarioCode: 'CVE-2023-38606',
    mitreTechniques: [
      {
        id: 'T1203',
        name: 'Exploitation for Client Execution (Zero-Click iMessage Font CVE-2023-41990)',
        tactic: 'Execution',
        url: 'https://attack.mitre.org/techniques/T1203/' },
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation (Hardware MMIO PPL Bypass CVE-2023-38606)',
        tactic: 'Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1068/' },
    ],
    primarySources: [
      {
        id: 'kaspersky-operation-triangulation',
        organization: 'Kaspersky GReAT (Global Research & Analysis Team)',
        title: 'Operation Triangulation: The Last (Hardware) Mystery (CVE-2023-38606 & TriangleDB)',
        referenceCode: 'KASPERSKY-TRIANGULATION-2023',
        licenseOrTerms: 'Kaspersky Securelist Research Publication',
        url: 'https://securelist.com/operation-triangulation-the-last-hardware-mystery/111669/',
        usageSummary:
          'Documents the 4-zero-day chain (CVE-2023-41990, CVE-2023-32434, CVE-2023-38606 hardware MMIO DMA register bypass, CVE-2023-32435) and TriangleDB implant.' },
      {
        id: 'kaspersky-triangledb-analysis',
        organization: 'Kaspersky GReAT',
        title: 'Dissecting TriangleDB, the Operation Triangulation iOS Implant',
        referenceCode: 'KASPERSKY-TRIANGLEDB-2023',
        licenseOrTerms: 'Kaspersky Securelist Research Publication',
        url: 'https://securelist.com/triangledb-iostriangulation-implant/110050/',
        usageSummary:
          'Details TriangleDB in-memory modules (CRXPoll, CRXShowTables, CRXFetchRecord) and BackupAgent telemetry indicators.' },
    ],
    syntheticDataNotice:
      'All iOS process logs and C2 domains represent defensive research indicators from Kaspersky GReAT.' },
  'kaspersky-toddycat-eset-dll': {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    scenarioCode: 'T1574.002',
    mitreTechniques: [
      {
        id: 'T1574.002',
        name: 'Hijack Execution Flow: DLL Side-Loading (ESET ehttpSrv.exe + version.dll)',
        tactic: 'Persistence / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1574/002/' },
      {
        id: 'T1055',
        name: 'Process Injection (Samurai Backdoor & TomBerBil)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1055/' },
    ],
    primarySources: [
      {
        id: 'kaspersky-toddycat-report',
        organization: 'Kaspersky GReAT (Global Research & Analysis Team)',
        title: 'ToddyCat: Keep Calm and Continue Espionage (Samurai, Ninja, and LoFiSe)',
        referenceCode: 'KASPERSKY-TODDYCAT-2024',
        licenseOrTerms: 'Kaspersky Securelist Research Publication',
        url: 'https://securelist.com/toddycat-keep-calm-and-continue-espionage/110698/',
        usageSummary:
          'Documents ToddyCat DLL side-loading via signed ESET binaries, Samurai passive C# backdoor, and TomBerBil credential stealer.' },
      {
        id: 'mitre-s1091-samurai',
        organization: 'The MITRE Corporation',
        title: 'MITRE ATT&CK T1574.002: Hijack Execution Flow — DLL Side-Loading',
        referenceCode: 'ATT&CK-T1574.002',
        licenseOrTerms: 'MITRE ATT&CK Terms of Use',
        url: 'https://attack.mitre.org/techniques/T1574/002/',
        usageSummary:
          'Defines side-loading of proxy DLLs (`version.dll` / `http_dll.dll`) inside trusted security executables.' },
    ],
    syntheticDataNotice:
      'Exchange server hostnames and Samurai C2 endpoints are synthetic lab identifiers.' },
  'kaspersky-lazarus-byovd-fudmodule': {
    scenarioId: 'kaspersky-lazarus-byovd-fudmodule',
    scenarioCode: 'CVE-2024-21338',
    mitreTechniques: [
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation (appdata.sys AppLocker Zero-Day CVE-2024-21338)',
        tactic: 'Privilege Escalation / Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1068/' },
      {
        id: 'T1562.001',
        name: 'Impair Defenses: Disable or Modify Tools (FudModule DKOM Kernel Blind)',
        tactic: 'Defense Evasion',
        url: 'https://attack.mitre.org/techniques/T1562/001/' },
    ],
    primarySources: [
      {
        id: 'avast-kaspersky-lazarus-fudmodule',
        organization: 'Avast Threat Labs & Kaspersky GReAT',
        title: 'Lazarus Group FudModule Rootkit Exploits Windows AppLocker Zero-Day (CVE-2024-21338)',
        referenceCode: 'CVE-2024-21338-FUDMODULE',
        licenseOrTerms: 'Public Security Research Publication',
        url: 'https://decoded.avast.io/janvojtesek/lazarus-and-the-fudmodule-rootkit-beyond-byovd-with-an-admin-to-kernel-zero-day/',
        usageSummary:
          'Documents IOCTL 0x22A018 in Windows appid.sys, PreviousMode kernel read/write primitive, and FudModule DKOM EPROCESS/ETW blinding.' },
      {
        id: 'msrc-cve-2024-21338',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'CVE-2024-21338 Windows Kernel Elevation of Privilege Vulnerability (appid.sys)',
        referenceCode: 'MSRC-CVE-2024-21338',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21338',
        usageSummary:
          'Official Microsoft patch advisory for the AppLocker driver IOCTL pointer manipulation vulnerability.' },
    ],
    syntheticDataNotice:
      'Kernel EPROCESS offsets and KaolinRAT C2 endpoints are synthetic educational artifacts.' },
  'mandiant-apt29-teamcity-jetstream': {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    scenarioCode: 'CVE-2023-42793',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (JetBrains TeamCity CVE-2023-42793)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1098.001',
        name: 'Account Manipulation: Additional Cloud Credentials',
        tactic: 'Persistence',
        url: 'https://attack.mitre.org/techniques/T1098/001/' },
    ],
    primarySources: [
      {
        id: 'mandiant-ms-apt29-teamcity',
        organization: 'Mandiant, Microsoft Threat Intelligence & CISA',
        title: 'Russian Foreign Intelligence Service (SVR / APT29) Exploiting JetBrains TeamCity CVE-2023-42793',
        referenceCode: 'CISA-AA23-347A',
        licenseOrTerms: 'U.S. Government Public Domain & Mandiant Research',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-347a',
        usageSummary:
          'Documents `/app/rest/users/id:1/tokens/RPC2` authentication bypass, `/admin/diagnostic.jsp` command execution, and GraphicalProton C2.' },
      {
        id: 'nvd-cve-2023-42793',
        organization: 'NIST NVD & JetBrains Security',
        title: 'CVE-2023-42793 JetBrains TeamCity On-Premises Authentication Bypass & RCE',
        referenceCode: 'CVE-2023-42793',
        licenseOrTerms: 'Public Domain',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-42793',
        usageSummary:
          'Official vulnerability advisory for JetBrains TeamCity REST API token creation bypass.' },
    ],
    syntheticDataNotice:
      'CI/CD build server hostnames and OneDrive C2 tokens are synthetic simulation identifiers.' },
  'splunk-screenconnect-slashandgrab': {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    scenarioCode: 'CVE-2024-1709',
    mitreTechniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application (ScreenConnect SetupWizard.aspx CVE-2024-1709)',
        tactic: 'Initial Access',
        url: 'https://attack.mitre.org/techniques/T1190/' },
      {
        id: 'T1219',
        name: 'Remote Access Software (ScreenConnect.ClientService.exe Abuse)',
        tactic: 'Command and Control / Execution',
        url: 'https://attack.mitre.org/techniques/T1219/' },
    ],
    primarySources: [
      {
        id: 'splunk-screenconnect-cve2024-1709',
        organization: 'Splunk SURGe & Huntress Security Research',
        title: 'SlashAndGrab: ConnectWise ScreenConnect Authentication Bypass (CVE-2024-1709 & CVE-2024-1708)',
        referenceCode: 'SPLUNK-SURGE-CVE2024-1709',
        licenseOrTerms: 'Splunk Security Blog',
        url: 'https://www.splunk.com/en_us/blog/security/connectwise-screenconnect-cve-2024-1709-cve-2024-1708.html',
        usageSummary:
          'Documents the `/SetupWizard.aspx/` alternate path authentication bypass, `User.xml` overwrite, and `ScreenConnect.ClientService.exe` execution.' },
      {
        id: 'connectwise-security-bulletin-2024',
        organization: 'ConnectWise Trust Center',
        title: 'ConnectWise ScreenConnect 23.9.8 Security Patch Advisory (CVE-2024-1709 & CVE-2024-1708)',
        referenceCode: 'CW-SA-2024-02-19',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://www.connectwise.com/company/trust/security-bulletins/connectwise-screenconnect-23.9.8',
        usageSummary:
          'Official vendor bulletin describing the authentication bypass and path traversal vulnerabilities.' },
    ],
    syntheticDataNotice:
      'MSP server hostnames and rogue administrator usernames are synthetic simulation artifacts.' },
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


