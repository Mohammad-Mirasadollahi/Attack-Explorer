import type { ScenarioAttributionProfile } from './attack-sources-and-legal';
import type { ThreatIntelContextData } from './threat-intel-service';

export const BATCH_1_TO_4_ATTRIBUTIONS: Record<string, ScenarioAttributionProfile> = {
  'xz-utils-cve-2024-3094-backdoor': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    scenarioCode: 'CVE-2024-3094',
    mitreTechniques: [
      { id: 'T1195.002', name: 'Supply Chain Compromise: Compromise Software Supply Chain', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1195/002/' },
      { id: 'T1574.006', name: 'Hijack Execution Flow: Dynamic Linker Hijacking (IFUNC)', tactic: 'Persistence / Defense Evasion', url: 'https://attack.mitre.org/techniques/T1574/006/' },
      { id: 'T1556', name: 'Modify Authentication Process (sshd RSA_public_decrypt Hook)', tactic: 'Credential Access / Persistence', url: 'https://attack.mitre.org/techniques/T1556/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Andres Freund’s original oss-security disclosure documented the ~500ms sshd CPU latency anomaly, the build-to-host.m4 macro extraction of liblzma_la-crc64-fast.o from bad-3-corrupt_lzma2.xz, and the transitive libsystemd.so.0 -> liblzma.so.5 load chain; (2) Kaspersky GReAT reverse-engineered the glibc IFUNC resolver (_get_cpuid), the _dl_audit_preinit GOT hook on RSA_public_decrypt, and the ChaCha20 + Ed448 public-key command verification; and (3) Red Hat & CISA CVE-2024-3094 advisories provided affected distribution matrices and YARA/hash detection rules.',
    primarySources: [
      {
        id: 'freund-oss-security-xz-2024',
        organization: 'Andres Freund (Microsoft / OpenWall oss-security)',
        title: 'backdoor in upstream xz/liblzma leading to ssh server compromise (CVE-2024-3094)',
        referenceCode: 'OSS-SEC-2024-03-29',
        licenseOrTerms: 'Public Security Mailing List Disclosure',
        url: 'https://www.openwall.com/lists/oss-security/2024/03/29/4',
        usageSummary: 'Documents the perf CPU anomaly discovery, m4 build script extraction, and libsystemd -> liblzma -> sshd load path.',
      },
      {
        id: 'kaspersky-xz-backdoor-analysis',
        organization: 'Kaspersky GReAT (Securelist)',
        title: 'CVE-2024-3094: Technical Analysis of the XZ Utils Backdoor & Ed448 Payload Structure',
        referenceCode: 'SECURELIST-XZ-2024',
        licenseOrTerms: 'Kaspersky GReAT Threat Research',
        url: 'https://securelist.com/xz-backdoor-story-part-1/112354/',
        usageSummary: 'Reverse-engineers the IFUNC crc64_resolve hook, RSA_public_decrypt GOT redirection, and Ed448 signature check.',
      },
      {
        id: 'redhat-cisa-cve-2024-3094',
        organization: 'Red Hat Product Security & CISA',
        title: 'Urgent Security Alert for Fedora 40/Rawhide & CISA CVE-2024-3094 Supply Chain Advisory',
        referenceCode: 'CISA-CVE-2024-3094',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users',
        usageSummary: 'Provides affected package versions (5.6.0/5.6.1), systemd linkage prerequisites, and remediation guidance.',
      },
    ],
    syntheticDataNotice: 'SSH client IP addresses and Ed448 test payloads are synthetic educational lab traces.',
  },
  'cl0p-moveit-transfer-cve-2023-34362': {
    scenarioId: 'cl0p-moveit-transfer-cve-2023-34362',
    scenarioCode: 'CVE-2023-34362',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (MOVEit CVE-2023-34362 SQLi)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1505.003', name: 'Server Software Component: Web Shell (human2.aspx LEMURLOOT)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1505/003/' },
      { id: 'T1530', name: 'Data from Cloud Storage (Azure Blob Exfiltration)', tactic: 'Collection', url: 'https://attack.mitre.org/techniques/T1530/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Huntress & Rapid7 reconstructed the exact HTTP request chain (/api/v1/token -> /guestaccess.aspx -> /moveitisapi/moveitisapi.dll?action=m2 with X-siLock-SessVar headers) and the .NET BinaryFormatter deserialization gadget written into the activesessions table; (2) Mandiant (Google Cloud) analyzed the human2.aspx (LEMURLOOT) webshell, its X-siLock-Comment password check, and Azure Blob Storage key theft; and (3) Joint CISA/FBI Advisory AA23-158A attributed the campaign to CL0P (TA505 / FIN11) and published Sigma/YARA rules for w3wp.exe spawning csc.exe.',
    primarySources: [
      {
        id: 'cisa-aa23-158a-cl0p-moveit',
        organization: 'CISA & FBI Joint Advisory',
        title: 'AA23-158A: CL0P Ransomware Gang Aka TA505 Targets MOVEit Transfer (CVE-2023-34362)',
        referenceCode: 'CISA-AA23-158A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a',
        usageSummary: 'Provides CL0P attribution, IIS log indicators, and detection signatures for human2.aspx.',
      },
      {
        id: 'mandiant-lemurloot-moveit',
        organization: 'Mandiant Threat Intelligence (Google Cloud)',
        title: 'Zero-Day Vulnerability in MOVEit Transfer Exploited for Data Theft (FIN11 / LEMURLOOT)',
        referenceCode: 'MANDIANT-LEMURLOOT-2023',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/zero-day-moveit-data-theft',
        usageSummary: 'Dissects the LEMURLOOT (human2.aspx) C# webshell commands, X-siLock-Comment header, and Azure Blob credential extraction.',
      },
      {
        id: 'huntress-rapid7-moveit-analysis',
        organization: 'Huntress Labs & Rapid7',
        title: 'MOVEit Transfer Critical Vulnerability CVE-2023-34362 Technical Exploit Chain Analysis',
        referenceCode: 'HUNTRESS-MOVEIT-2023',
        licenseOrTerms: 'Huntress Public Threat Research',
        url: 'https://www.huntress.com/blog/moveit-transfer-critical-vulnerability-cve-2023-34362-rapid-response',
        usageSummary: 'Documents the guestaccess.aspx + moveitisapi.dll SQLi to BinaryFormatter deserialization and w3wp.exe -> csc.exe process tree.',
      },
    ],
    syntheticDataNotice: 'MOVEit server IPs and Azure storage account names are synthetic lab identifiers.',
  },
  'openssh-regreSSHion-cve-2024-6387': {
    scenarioId: 'openssh-regreSSHion-cve-2024-6387',
    scenarioCode: 'CVE-2024-6387',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (OpenSSH SIGALRM Race CVE-2024-6387)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1068', name: 'Exploitation for Privilege Escalation (Pre-Auth Root sshd)', tactic: 'Privilege Escalation', url: 'https://attack.mitre.org/techniques/T1068/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Qualys Threat Research Unit (TRU) discovered and weaponized CVE-2024-6387 ("regreSSHion"), demonstrating how interrupting a main-thread malloc()/free() inside sshd when LoginGraceTime expires triggers an async-signal-unsafe syslog() call inside grace_alarm_handler(), corrupting glibc ptmalloc2 arena chunks and forging a fake _IO_FILE vtable; (2) OpenSSH 9.8 Release Notes explained how commit ac211206 inadvertently removed #ifndef DO_LOG_SAFE_IN_SIGHAND from sigdie(), re-introducing CVE-2006-5051; and (3) CISA & Rapid7 provided network connection-flooding detection rules ("Timeout before authentication" storms).',
    primarySources: [
      {
        id: 'qualys-tru-regresshion-2024',
        organization: 'Qualys Threat Research Unit (TRU)',
        title: 'regreSSHion: RCE in OpenSSH’s server, on glibc-based Linux systems (CVE-2024-6387)',
        referenceCode: 'QUALYS-CVE-2024-6387',
        licenseOrTerms: 'Qualys Security Advisory',
        url: 'https://www.qualys.com/2024/07/01/cve-2024-6387/regresshion.txt',
        usageSummary: 'Details the SIGALRM race condition, ptmalloc2 heap feng shui, and _IO_FILE vtable code execution.',
      },
      {
        id: 'openssh-98-release-notes',
        organization: 'The OpenSSH Project',
        title: 'OpenSSH 9.8 Security Advisory: Async-Signal-Unsafe sigdie() Regression',
        referenceCode: 'OPENSSH-9.8-ADV',
        licenseOrTerms: 'BSD / Public Advisory',
        url: 'https://www.openssh.com/txt/release-9.8',
        usageSummary: 'Explains the October 2020 regression of CVE-2006-5051 and the LoginGraceTime=0 mitigation.',
      },
      {
        id: 'cisa-rapid7-regresshion',
        organization: 'CISA & Rapid7 Emergent Threat Response',
        title: 'CVE-2024-6387 OpenSSH regreSSHion Detection & Mitigation Guidance',
        referenceCode: 'RAPID7-CVE-2024-6387',
        licenseOrTerms: 'Public Threat Intelligence',
        url: 'https://www.rapid7.com/blog/post/2024/07/01/etr-openssh-remote-unauthenticated-code-execution-cve-2024-6387-regresshion/',
        usageSummary: 'Provides SSH connection rate and auth.log "Timeout before authentication" detection heuristics.',
      },
    ],
    syntheticDataNotice: 'All SSH client IPs and glibc heap addresses are synthetic educational traces.',
  },
  'fortra-goanywhere-mft-cve-2023-0669-cl0p': {
    scenarioId: 'fortra-goanywhere-mft-cve-2023-0669-cl0p',
    scenarioCode: 'CVE-2023-0669',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (GoAnywhere /lic/accept CVE-2023-0669)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1059.003', name: 'Command and Scripting Interpreter: Windows Command Shell', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1059/003/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Horizon3.ai & frycos reverse-engineered LicenseResponseServlet (/goanywhere/lic/accept), extracting the hardcoded AES-128-CBC initialization key and PBKDF2 salt ("go@nywhereLicenseP@$$w0rd") used with the "$2" version prefix before calling ObjectInputStream.readObject() on a CommonsBeanutils1 gadget chain; (2) Huntress Labs captured post-exploitation Tomcat stack traces and JVM child process telemetry; and (3) Mandiant & CISA KEV attributed the zero-day campaign to CL0P (TA505 / FIN11) deploying TrueBot (Silence.Downloader) and Cobalt Strike.',
    primarySources: [
      {
        id: 'horizon3-goanywhere-cve-2023-0669',
        organization: 'Horizon3.ai Attack Team',
        title: 'GoAnywhere MFT CVE-2023-0669 Pre-Auth RCE Technical Deep Dive',
        referenceCode: 'HORIZON3-CVE-2023-0669',
        licenseOrTerms: 'Horizon3.ai Public Security Research',
        url: 'https://www.horizon3.ai/attack-research/attack-blogs/goanywhere-mft-cve-2023-0669-deep-dive-and-indicators-of-compromise/',
        usageSummary: 'Documents the /goanywhere/lic/accept bundle parameter, hardcoded AES key ("$2"), and CommonsBeanutils1 gadget chain.',
      },
      {
        id: 'huntress-goanywhere-investigation',
        organization: 'Huntress Security Research',
        title: 'Investigating GoAnywhere MFT RCE (CVE-2023-0669) Exploitation & Stack Traces',
        referenceCode: 'HUNTRESS-CVE-2023-0669',
        licenseOrTerms: 'Huntress Public Threat Research',
        url: 'https://www.huntress.com/blog/investigating-goanywhere-mft-rce-cve-2023-0669',
        usageSummary: 'Provides GoAnywhere log stack traces (InvocationTargetException in LicenseResponseServlet) and child process IOCs.',
      },
      {
        id: 'mandiant-cisa-cl0p-goanywhere',
        organization: 'Mandiant & CISA KEV',
        title: 'FIN11 / CL0P Exploitation of GoAnywhere MFT Zero-Day Deploying TrueBot & Cobalt Strike',
        referenceCode: 'CISA-KEV-2023-0669',
        licenseOrTerms: 'Public Threat Intelligence',
        url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
        usageSummary: 'Documents CL0P post-exploitation deployment of TrueBot and Cobalt Strike from the GoAnywhere Tomcat JVM.',
      },
    ],
    syntheticDataNotice: 'All MFT hostnames and payload staging IPs are synthetic simulation values.',
  },
  '3cx-desktopapp-supply-chain-lazarus': {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    scenarioCode: 'CVE-2023-29059',
    mitreTechniques: [
      { id: 'T1195.002', name: 'Supply Chain Compromise: Compromise Software Supply Chain', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1195/002/' },
      { id: 'T1574.002', name: 'Hijack Execution Flow: DLL Side-Loading (ffmpeg.dll)', tactic: 'Defense Evasion', url: 'https://attack.mitre.org/techniques/T1574/002/' },
      { id: 'T1102.001', name: 'Web Service: Dead Drop Resolver (GitHub IconStorages .ico)', tactic: 'Command and Control', url: 'https://attack.mitre.org/techniques/T1102/001/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) CrowdStrike ("SmoothOperator" / Labyrinth Chollima) detected the initial behavioral anomaly in 3CXDesktopApp.exe, dissecting the trojanized ffmpeg.dll side-load, the 0xFEEDFACE RC4 decryption of d3dcompiler_47.dll, and the GitHub IconStorages .ico dead-drop resolver; (2) Mandiant (UNC4736) revealed how 3CX’s build environment was originally breached via an earlier X_TRADER supply chain attack ( cascading supply chain compromise) and analyzed ICONICSTEALER; and (3) Kaspersky GReAT discovered that select victims received the sophisticated Gopuram backdoor.',
    primarySources: [
      {
        id: 'crowdstrike-3cx-smoothoperator',
        organization: 'CrowdStrike Falcon OverWatch & Threat Intelligence',
        title: 'CrowdStrike Detects and Prevents Active Intrusion Campaign Targeting 3CXDesktopApp Customers',
        referenceCode: 'CROWDSTRIKE-3CX-2023',
        licenseOrTerms: 'CrowdStrike Threat Intelligence Blog',
        url: 'https://www.crowdstrike.com/blog/crowdstrike-detects-and-prevents-active-intrusion-campaign-targeting-3cxdesktopapp-customers/',
        usageSummary: 'Details ffmpeg.dll side-loading, d3dcompiler_47.dll RC4 decryption (0xFEEDFACE), and GitHub .ico C2 resolution.',
      },
      {
        id: 'mandiant-3cx-unc4736-xtrader',
        organization: 'Mandiant Threat Intelligence (Google Cloud)',
        title: '3CX Software Supply Chain Compromise Initiated by a Prior Software Supply Chain Compromise (UNC4736)',
        referenceCode: 'MANDIANT-UNC4736-2023',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise',
        usageSummary: 'Uncovers the cascading X_TRADER supply chain root cause and dissects the ICONICSTEALER browser credential stealer.',
      },
      {
        id: 'kaspersky-3cx-gopuram-lazarus',
        organization: 'Kaspersky GReAT (Securelist)',
        title: 'Not just an infostealer: Gopuram backdoor deployed through 3CX supply chain attack',
        referenceCode: 'SECURELIST-GOPURAM-2023',
        licenseOrTerms: 'Kaspersky GReAT Threat Research',
        url: 'https://securelist.com/gopuram-backdoor-deployed-through-3cx-supply-chain-attack/109344/',
        usageSummary: 'Documents the second-stage Gopuram implant delivered by Lazarus Group to high-value cryptocurrency targets.',
      },
    ],
    syntheticDataNotice: 'All workstation hostnames and user directories are synthetic simulation artifacts.',
  },
  'nopac-samaccountname-cve-2021-42278-42287': {
    scenarioId: 'nopac-samaccountname-cve-2021-42278-42287',
    scenarioCode: 'CVE-2021-42287',
    mitreTechniques: [
      { id: 'T1068', name: 'Exploitation for Privilege Escalation (noPac CVE-2021-42278 / 42287)', tactic: 'Privilege Escalation', url: 'https://attack.mitre.org/techniques/T1068/' },
      { id: 'T1558.001', name: 'Steal or Forge Kerberos Tickets: Golden/Silver S4U2self Ticket', tactic: 'Credential Access', url: 'https://attack.mitre.org/techniques/T1558/001/' },
      { id: 'T1003.006', name: 'OS Credential Dumping: DCSync (MS-DRSR)', tactic: 'Credential Access', url: 'https://attack.mitre.org/techniques/T1003/006/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft MSRC Advisories CVE-2021-42278 & CVE-2021-42287 explain the SAM trailing-$ validation gap and the KDC S4U2self trailing-$ fallback lookup; (2) CrowdStrike Falcon OverWatch dissected the live sam-the-admin / noPac attack sequence abusing ms-DS-MachineAccountQuota=10; and (3) Splunk SURGe authored the Windows Security EventID 4741 -> 4781 -> 4768 -> 4769 correlation rules.',
    primarySources: [
      {
        id: 'msrc-cve-2021-42278-42287',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'Active Directory sAMAccountName Spoofing (CVE-2021-42278) & KDC Pac Bypass (CVE-2021-42287)',
        referenceCode: 'MSRC-CVE-2021-42287',
        licenseOrTerms: 'Microsoft Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-42287',
        usageSummary: 'Explains the KDC trailing-$ fallback during S4U2self TGS generation and KB5008380 enforcement mode.',
      },
      {
        id: 'crowdstrike-nopac-analysis',
        organization: 'CrowdStrike Threat Intelligence',
        title: 'Understanding the Active Directory SamAccountName Spoofing / noPac Exploitation Chain',
        referenceCode: 'CROWDSTRIKE-NOPAC-2021',
        licenseOrTerms: 'CrowdStrike Public Threat Research',
        url: 'https://www.crowdstrike.com/blog/',
        usageSummary: 'Details ms-DS-MachineAccountQuota abuse, machine account rename timing, and DCSync post-exploitation.',
      },
      {
        id: 'splunk-surge-nopac-detections',
        organization: 'Splunk SURGe Security Research',
        title: 'Detecting Active Directory noPac (CVE-2021-42278 & CVE-2021-42287) with EventID 4741 and 4781',
        referenceCode: 'SPLUNK-NOPAC-2021',
        licenseOrTerms: 'Splunk Security Content',
        url: 'https://www.splunk.com/en_us/blog/security/',
        usageSummary: 'Provides SPL and Sigma correlation rules for EventID 4741 (computer creation) and EventID 4781 (DC name spoofing).',
      },
    ],
    syntheticDataNotice: 'Domain Controller names (CORP-DC01) and user accounts are synthetic lab values.',
  },
  'zerologon-netlogon-cve-2020-1472': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    scenarioCode: 'CVE-2020-1472',
    mitreTechniques: [
      { id: 'T1068', name: 'Exploitation for Privilege Escalation (Zerologon CVE-2020-1472)', tactic: 'Privilege Escalation', url: 'https://attack.mitre.org/techniques/T1068/' },
      { id: 'T1098', name: 'Account Manipulation (NetrServerPasswordSet2 Empty DC Hash)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1098/' },
      { id: 'T1003.006', name: 'OS Credential Dumping: DCSync', tactic: 'Credential Access', url: 'https://attack.mitre.org/techniques/T1003/006/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Secura (Tom Tervoort) published the mathematical proof of CVE-2020-1472 showing why ComputeNetlogonCredential’s hardcoded 16-byte all-zero AES-CFB8 IV causes 1 in 256 all-zero plaintexts to encrypt to 8 zero bytes; (2) CISA Emergency Directive 20-04 documented NetrServerPasswordSet2 resetting the Domain Controller’s AD password hash to empty (31d6cfe0d16ae931b73c59d7e0c089c0) and breaking DNS/replication until restored from HKLM\\SECURITY\\Policy\\Secrets\\$MACHINE.ACC; and (3) CrowdStrike & Microsoft documented EventID 4742 (ANONYMOUS LOGON) and EventID 5805 storms.',
    primarySources: [
      {
        id: 'secura-zerologon-whitepaper',
        organization: 'Secura BV (Tom Tervoort)',
        title: 'Zerologon: Unauthenticated Domain Controller Compromise by Subverting Netlogon Cryptography (CVE-2020-1472)',
        referenceCode: 'SECURA-ZEROLOGON-2020',
        licenseOrTerms: 'Secura Public Technical Whitepaper',
        url: 'https://www.secura.com/blog/zero-logon',
        usageSummary: 'Explains the MS-NRPC AES-CFB8 all-zero IV flaw, the 256-attempt brute force, and signing/sealing flag bypass.',
      },
      {
        id: 'cisa-ed-20-04-zerologon',
        organization: 'Cybersecurity and Infrastructure Security Agency (CISA)',
        title: 'Emergency Directive 20-04: Mitigate Netlogon Elevation of Privilege Vulnerability from August 2020 Patch Tuesday',
        referenceCode: 'CISA-ED-20-04',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/directives/ed-20-04-mitigate-netlogon-elevation-privilege-vulnerability-august-2020-patch',
        usageSummary: 'Mandates Secure RPC enforcement and documents DC machine password recovery after NetrServerPasswordSet2.',
      },
      {
        id: 'microsoft-crowdstrike-zerologon-telemetry',
        organization: 'Microsoft Threat Intelligence & CrowdStrike',
        title: 'Detecting CVE-2020-1472 (Zerologon) via Windows EventID 5805, 4742 & Netlogon RPC Inspection',
        referenceCode: 'MS-DEFENDER-ZEROLOGON',
        licenseOrTerms: 'Microsoft Public Security Documentation',
        url: 'https://www.microsoft.com/en-us/security/blog/2020/09/28/new-detections-for-cve-2020-1472-active-exploitation/',
        usageSummary: 'Provides EventID 4742 (ANONYMOUS LOGON modifying DC account) and System EventID 5805 detection rules.',
      },
    ],
    syntheticDataNotice: 'All Domain Controller IPs and Netlogon RPC packets are synthetic educational traces.',
  },
  'proxyshell-exchange-cve-2021-34473': {
    scenarioId: 'proxyshell-exchange-cve-2021-34473',
    scenarioCode: 'CVE-2021-34473',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (Exchange ProxyShell CVE-2021-34473)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1068', name: 'Exploitation for Privilege Escalation (X-Rps-CAT Token Forgery CVE-2021-34523)', tactic: 'Privilege Escalation', url: 'https://attack.mitre.org/techniques/T1068/' },
      { id: 'T1505.003', name: 'Server Software Component: Web Shell (New-MailboxExportRequest CVE-2021-31207)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1505/003/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) DEVCORE (Orange Tsai’s Black Hat USA 2021 research) discovered the 3-bug ProxyShell chain—Autodiscover explicit-logon URI normalization (/autodiscover/autodiscover.json?@foo.com/powershell/ — CVE-2021-34473), Exchange PowerShell Remoting X-Rps-CAT CommonAccessToken elevation (CVE-2021-34523), and New-MailboxExportRequest arbitrary UNC .aspx write containing a PST-encoded webshell (CVE-2021-31207); (2) Joint CISA/FBI Advisory AA21-265A provided Conti/LockBit/APT exploitation indicators; and (3) Mandiant & Huntress documented MSExchangePowerShellAppPool and inetpub\\wwwroot\\aspnet_client\\ webshell forensics.',
    primarySources: [
      {
        id: 'devcore-orange-tsai-proxyshell',
        organization: 'DEVCORE Security Research (Orange Tsai)',
        title: 'ProxyShell: A New Attack Surface on MS Exchange Part 3 (CVE-2021-34473, CVE-2021-34523, CVE-2021-31207)',
        referenceCode: 'DEVCORE-PROXYSHELL-2021',
        licenseOrTerms: 'DEVCORE Public Security Research',
        url: 'https://devco.re/blog/2021/08/06/a-new-attack-surface-on-ms-exchange-part-3-ProxyShell/',
        usageSummary: 'Original discovery of the /autodiscover/autodiscover.json path confusion, X-Rps-CAT token forgery, and PST webshell write.',
      },
      {
        id: 'cisa-aa21-265a-proxyshell',
        organization: 'CISA & FBI Joint Advisory',
        title: 'Exploitation of Microsoft Exchange Server Vulnerabilities (ProxyShell)',
        referenceCode: 'CISA-AA21-265A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/alerts/2021/08/21/cisa-and-fbi-release-advisory-conti-ransomware-and-proxyshell',
        usageSummary: 'Documents active exploitation of ProxyShell by ransomware and APT actors and IIS/Exchange log indicators.',
      },
      {
        id: 'huntress-mandiant-proxyshell-dfir',
        organization: 'Huntress Labs & Mandiant',
        title: 'Incident Response Analysis: Detecting ProxyShell Exploitation & MailboxExportRequest Webshells',
        referenceCode: 'HUNTRESS-PROXYSHELL-2021',
        licenseOrTerms: 'Public DFIR Research',
        url: 'https://www.huntress.com/blog/',
        usageSummary: 'Details MSExchange Management EventID 1 logs for New-MailboxExportRequest -FilePath \\\\127.0.0.1\\C$\\...\\*.aspx.',
      },
    ],
    syntheticDataNotice: 'Exchange server hostnames and mailbox email addresses are synthetic simulation identifiers.',
  },
  'printnightmare-spooler-cve-2021-34527': {
    scenarioId: 'printnightmare-spooler-cve-2021-34527',
    scenarioCode: 'CVE-2021-34527',
    mitreTechniques: [
      { id: 'T1068', name: 'Exploitation for Privilege Escalation / RCE (PrintNightmare CVE-2021-34527)', tactic: 'Privilege Escalation / Lateral Movement', url: 'https://attack.mitre.org/techniques/T1068/' },
      { id: 'T1547.012', name: 'Boot or Logon Autostart Execution: Print Processors / Drivers', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1547/012/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft MSRC CVE-2021-34527 & KB5005010 explain why RpcAddPrinterDriverEx() in localspl.dll allowed non-administrators to bypass ValidateObjectAccess() when passing flag 0x8014 (APD_INSTALL_WARNED_DRIVER | APD_COPY_ALL_FILES | APD_COPY_FROM_DIRECTORY); (2) Rapid7 & Sangfor researchers documented how pConfigFile pointing to an attacker SMB share (\\\\ip\\share\\evil.dll) forces spoolsv.exe to load and execute DllMain() as NT AUTHORITY\\SYSTEM; and (3) Elastic Security Labs & CISA authored Sysmon EventID 7/11 rules for C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ and PrintService EventID 316.',
    primarySources: [
      {
        id: 'msrc-cve-2021-34527-printnightmare',
        organization: 'Microsoft Security Response Center (MSRC)',
        title: 'Windows Print Spooler Remote Code Execution Vulnerability (CVE-2021-34527 / PrintNightmare)',
        referenceCode: 'MSRC-CVE-2021-34527',
        licenseOrTerms: 'Microsoft Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34527',
        usageSummary: 'Documents the RpcAddPrinterDriverEx authorization bypass and Point and Print RestrictDriverInstallationToAdministrators fix.',
      },
      {
        id: 'rapid7-printnightmare-analysis',
        organization: 'Rapid7 Emergent Threat Response',
        title: 'PrintNightmare (CVE-2021-34527): Technical Analysis of MS-RPRN RpcAddPrinterDriverEx Exploitation',
        referenceCode: 'RAPID7-PRINTNIGHTMARE-2021',
        licenseOrTerms: 'Rapid7 Public Security Research',
        url: 'https://www.rapid7.com/blog/post/2021/06/30/printnightmare-cve-2021-1675-remote-code-execution-in-windows-spooler-service/',
        usageSummary: 'Details the DRIVER_CONTAINER structure, dwFileCopyFlags 0x8014 bypass, and UNC pConfigFile DLL loading.',
      },
      {
        id: 'elastic-cisa-printnightmare-detection',
        organization: 'Elastic Security Labs & CISA',
        title: 'Detecting PrintNightmare via PrintService Operational EventID 316 and Sysmon EventID 7/11',
        referenceCode: 'CISA-PRINTNIGHTMARE-2021',
        licenseOrTerms: 'Public Detection Engineering',
        url: 'https://www.cisa.gov/news-events/alerts/2021/06/30/printnightmare-critical-windows-print-spooler-vulnerability',
        usageSummary: 'Provides detection signatures for unsigned DLL drops in spool\\drivers\\x64\\3\\New\\ and spoolsv.exe child shells.',
      },
    ],
    syntheticDataNotice: 'All SMB share IPs and driver DLL filenames are synthetic lab artifacts.',
  },
  'sharepoint-cve-2023-29357-24955-chain': {
    scenarioId: 'sharepoint-cve-2023-29357-24955-chain',
    scenarioCode: 'CVE-2023-29357',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (SharePoint OAuth JWT alg:none CVE-2023-29357)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1550.001', name: 'Use Alternate Authentication Material: Application Access Token', tactic: 'Defense Evasion', url: 'https://attack.mitre.org/techniques/T1550/001/' },
      { id: 'T1505', name: 'Server Software Component (BCS .bdcm DotNetAssembly RCE CVE-2023-24955)', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1505/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) STAR Labs SG (Nguyễn Tiến Giang / Pwn2Own Vancouver 2023) discovered and chained CVE-2023-29357 (SharePoint OAuth2 JWT signature validation bypass when header specifies "alg":"none") with CVE-2023-24955 (Business Connectivity Services .bdcm DotNetAssembly arbitrary assembly execution); (2) Rapid7 documented how enumerating /_api/web/siteusers?@v=1 with nameid=0#.w|s-1-5-20 leaks Farm Admin logins for horizontal elevation; and (3) Microsoft MSRC & CISA KEV provided IIS and w3wp.exe detection guidance.',
    primarySources: [
      {
        id: 'starlabs-sharepoint-cve-2023-29357',
        organization: 'STAR Labs SG (Nguyễn Tiến Giang)',
        title: 'SharePoint Pre-Auth RCE Chain (CVE-2023-29357 & CVE-2023-24955) Technical Writeup',
        referenceCode: 'STARLABS-CVE-2023-29357',
        licenseOrTerms: 'STAR Labs Public Vulnerability Research',
        url: 'https://starlabs.sg/blog/2023/09-sharepoint-pre-auth-rce-chain-cve-2023-29357-and-cve-2023-24955/',
        usageSummary: 'Explains the JWT "alg":"none" bypass in SharePoint OAuth validation and the BCS .bdcm DotNetAssembly RCE gadget.',
      },
      {
        id: 'rapid7-sharepoint-cve-2023-29357',
        organization: 'Rapid7 Emergent Threat Response',
        title: 'Analysis of SharePoint Server Elevation of Privilege (CVE-2023-29357)',
        referenceCode: 'RAPID7-CVE-2023-29357',
        licenseOrTerms: 'Rapid7 Public Security Research',
        url: 'https://www.rapid7.com/blog/',
        usageSummary: 'Details X-PROOF_TOKEN + Bearer JWT header construction and /_api/web/siteusers Farm Admin enumeration.',
      },
      {
        id: 'msrc-cisa-cve-2023-29357',
        organization: 'Microsoft MSRC & CISA KEV',
        title: 'Microsoft SharePoint Server Elevation of Privilege & RCE Advisories (CVE-2023-29357 / CVE-2023-24955)',
        referenceCode: 'MSRC-CVE-2023-29357',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29357',
        usageSummary: 'Provides patch versions and CISA KEV active-exploitation mitigation guidance.',
      },
    ],
    syntheticDataNotice: 'SharePoint Farm Realm GUIDs and admin account names are synthetic lab values.',
  },
  'vmware-vcenter-cve-2023-34048-unc3886': {
    scenarioId: 'vmware-vcenter-cve-2023-34048-unc3886',
    scenarioCode: 'CVE-2023-34048',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (vCenter vmdird DCERPC CVE-2023-34048)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1552.001', name: 'Unsecured Credentials: Credentials In Files (symkey.dat & vpxuser)', tactic: 'Credential Access', url: 'https://attack.mitre.org/techniques/T1552/001/' },
      { id: 'T1547', name: 'Boot or Logon Autostart Execution (ESXi VIB Backdoors VIRTUALPITA / VIRTUALPIE)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1547/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Mandiant (Google Cloud) uncovered UNC3886’s multi-year zero-day exploitation of CVE-2023-34048 against VMware vCenter’s vmdird DCERPC service, their decryption of vpxuser credentials from vPostgreSQL using /etc/vmware-vpx/symkey.dat, and their deployment of custom ESXi VIB backdoors (VIRTUALPITA and VIRTUALPIE) communicating over VMCI / AF_VSOCK sockets; (2) VMware VMSA-2023-0023 documented the out-of-bounds write in vmdird on TCP port 2012; and (3) CISA KEV provided hypervisor VIB integrity auditing guidance.',
    primarySources: [
      {
        id: 'mandiant-unc3886-vmware-vcenter',
        organization: 'Mandiant Threat Intelligence (Google Cloud)',
        title: 'Cloaked and Covert: Uncovering UNC3886 Espionage Operations on VMware vCenter & ESXi (CVE-2023-34048)',
        referenceCode: 'MANDIANT-UNC3886-2024',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/uncovering-unc3886-espionage-operations',
        usageSummary: 'Documents vmdird core dump forensics, vpxuser decryption via symkey.dat, and VIRTUALPITA/VIRTUALPIE AF_VSOCK implants.',
      },
      {
        id: 'vmware-vmsa-2023-0023',
        organization: 'VMware / Broadcom Security Response',
        title: 'VMSA-2023-0023: VMware vCenter Server Out-of-Bounds Write Vulnerability (CVE-2023-34048)',
        referenceCode: 'VMSA-2023-0023',
        licenseOrTerms: 'Vendor Security Advisory',
        url: 'https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/23254',
        usageSummary: 'Details the DCERPC protocol implementation flaw in vmdird and patched vCenter builds.',
      },
      {
        id: 'cisa-kev-cve-2023-34048',
        organization: 'Cybersecurity and Infrastructure Security Agency (CISA)',
        title: 'CISA Adds VMware vCenter CVE-2023-34048 to Known Exploited Vulnerabilities Catalog',
        referenceCode: 'CISA-KEV-2023-34048',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
        usageSummary: 'Mandates patching of vCenter DCERPC endpoints and auditing of ESXi VIB acceptance levels.',
      },
    ],
    syntheticDataNotice: 'vCenter IP addresses and ESXi host identifiers are synthetic lab traces.',
  },
  'barracuda-esg-cve-2023-2868-unc4841': {
    scenarioId: 'barracuda-esg-cve-2023-2868-unc4841',
    scenarioCode: 'CVE-2023-2868',
    mitreTechniques: [
      { id: 'T1566.001', name: 'Phishing: Spearphishing Attachment (.tar CVE-2023-2868 Command Injection)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1566/001/' },
      { id: 'T1505', name: 'Server Software Component (SALTWATER bsmtp & SEASPY libpcap Backdoors)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1505/' },
      { id: 'T1546', name: 'Event Triggered Execution (SUBMARINE SQLite CREATE TRIGGER Persistence)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1546/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Mandiant (Google Cloud) tracked UNC4841’s zero-day exploitation of CVE-2023-2868 via crafted .tar email attachments containing shell metacharacters (`\'|...`) passed to Perl qx{}, and reverse-engineered the SALTWATER (trojanized bsmtp daemon), SEASPY (libpcap port-25 magic packet listener), and WHIRLPOOL backdoors; (2) Joint CISA & FBI MAR-10454006.r1.v2 analyzed the SUBMARINE persistent implant that hides a root shell trigger inside the /mail/config/config.db SQLite database; and (3) Barracuda Networks issued the unprecedented hardware replacement advisory for compromised ESG appliances.',
    primarySources: [
      {
        id: 'mandiant-unc4841-barracuda-esg',
        organization: 'Mandiant Threat Intelligence (Google Cloud)',
        title: 'Barracuda ESG Zero-Day Vulnerability (CVE-2023-2868) Exploited Globally by Aggressive Espionage Actor UNC4841',
        referenceCode: 'MANDIANT-UNC4841-2023',
        licenseOrTerms: 'Mandiant Public Threat Research',
        url: 'https://cloud.google.com/blog/topics/threat-intelligence/barracuda-esg-exploited-globally',
        usageSummary: 'Dissects the .tar filename Perl qx{} injection and the SALTWATER, SEASPY, and SEASIDE malware ecosystem.',
      },
      {
        id: 'cisa-mar-submarine-barracuda',
        organization: 'CISA & FBI Malware Analysis Report',
        title: 'MAR-10454006: CISA Releases Malware Analysis Reports on Barracuda Backdoors (SUBMARINE, WHIRLPOOL, SALTWATER)',
        referenceCode: 'CISA-MAR-10454006',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/alerts/2023/07/28/cisa-releases-malware-analysis-report-submarine-malware-used-barracuda-esg-exploit',
        usageSummary: 'Analyzes SUBMARINE persistence inside SQLite /mail/config/config.db Triggers and YARA signatures.',
      },
      {
        id: 'barracuda-esg-advisory-2023',
        organization: 'Barracuda Networks Trust Center',
        title: 'Barracuda Email Security Gateway Appliance (ESG) Vulnerability CVE-2023-2868 Incident Notice',
        referenceCode: 'BARRACUDA-ESG-2023-06',
        licenseOrTerms: 'Vendor Security Advisory',
        url: 'https://www.barracuda.com/company/legal/esg-vulnerability',
        usageSummary: 'Official vendor timeline and hardware replacement mandate for impacted ESG appliances.',
      },
    ],
    syntheticDataNotice: 'All SMTP sender addresses and ESG appliance IPs are synthetic simulation values.',
  },
  'cisco-ios-xe-cve-2023-20198-badimplant': {
    scenarioId: 'cisco-ios-xe-cve-2023-20198-badimplant',
    scenarioCode: 'CVE-2023-20198',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (Cisco IOS XE Web UI CVE-2023-20198)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1136.001', name: 'Create Account: Local Account (Privilege 15 WSMA User)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1136/001/' },
      { id: 'T1505.003', name: 'Server Software Component: Web Shell (BadCandy NGINX Lua Implant CVE-2023-20273)', tactic: 'Persistence / Defense Evasion', url: 'https://attack.mitre.org/techniques/T1505/003/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Cisco Talos discovered the active zero-day chain across 40,000+ IOS XE routers/switches—creating a privilege-15 local user via CVE-2023-20198, escalating to Linux root via CVE-2023-20273 (installAdd command injection), and loading the in-memory BadCandy Lua webshell inside /usr/binos/conf/nginx-conf/cisco_service.conf; (2) VulnCheck reverse-engineered the NGINX location regex bypass (/webui_wsma_http bypassed via double URL-encoding /%2577ebui_wsma_http); and (3) CISA KEV & Shadowserver documented how attackers modified BadCandy to require a custom Authorization header so unauthenticated Internet scanners could no longer see it.',
    primarySources: [
      {
        id: 'cisco-talos-ios-xe-badcandy',
        organization: 'Cisco Talos Intelligence Group',
        title: 'Active Exploitation of Cisco IOS XE Software Web Management User Interface (CVE-2023-20198 & CVE-2023-20273)',
        referenceCode: 'TALOS-IOSXE-2023-10',
        licenseOrTerms: 'Cisco Talos Public Threat Research',
        url: 'https://blog.talosintelligence.com/active-exploitation-of-cisco-ios-xe-software/',
        usageSummary: 'Documents %SYS-5-CONFIG_I logs, installAdd root command injection, and the BadCandy NGINX Lua implant.',
      },
      {
        id: 'vulncheck-cisco-ios-xe-cve-2023-20198',
        organization: 'VulnCheck Initial Access Intelligence',
        title: 'Cisco IOS XE CVE-2023-20198 Deep Dive: NGINX /%2577ebui_wsma_http Double URL-Encoding Bypass',
        referenceCode: 'VULNCHECK-CVE-2023-20198',
        licenseOrTerms: 'VulnCheck Technical Research',
        url: 'https://vulncheck.com/blog/cisco-ios-xe',
        usageSummary: 'Explains why NGINX passes /%2577ebui_wsma_http to the backend CGI which URL-decodes %77 to "w" and executes WSMA as root.',
      },
      {
        id: 'cisa-cisco-advisory-cve-2023-20198',
        organization: 'CISA & Cisco PSIRT',
        title: 'CISA Releases Guidance on Cisco IOS XE Web UI Zero-Day Exploitation',
        referenceCode: 'CISCO-SA-IOSXE-WEBUI-PRIVESC-J22SaA4z',
        licenseOrTerms: 'Public Security Advisory',
        url: 'https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-iosxe-webui-privesc-j22SaA4z',
        usageSummary: 'Provides no ip http server mitigation and CLI commands to detect rogue privilege-15 users and Lua implants.',
      },
    ],
    syntheticDataNotice: 'Router management IPs and WSMA usernames are synthetic lab traces.',
  },
  'zyxel-firewall-cve-2023-28771-ike-rce': {
    scenarioId: 'zyxel-firewall-cve-2023-28771-ike-rce',
    scenarioCode: 'CVE-2023-28771',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (Zyxel UDP/500 IKEv2 CVE-2023-28771)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1059.004', name: 'Command and Scripting Interpreter: Unix Shell (sshipsecpm system() RCE)', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1059/004/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) TRAPA Security discovered CVE-2023-28771 in Zyxel ZyWALL/ATP/USG FLEX firewalls, reverse-engineering the sshipsecpm IKE daemon on UDP port 500 to recover the hardcoded 24-byte 3DES-CBC key inside ike_decoder_notification() (Notify Message Type 14) and the unsanitized system("echo ... >> /tmp/sdwan_vpndebug.log") call; (2) Rapid7 published the weaponized packet structure and Suricata UDP/500 rules; and (3) CISA KEV & Shadowserver tracked mass in-the-wild Mirai and ransomware exploitation.',
    primarySources: [
      {
        id: 'trapa-zyxel-cve-2023-28771',
        organization: 'TRAPA Security Research',
        title: 'Root Cause Analysis of Zyxel Firewall Unauthenticated Remote Command Execution (CVE-2023-28771)',
        referenceCode: 'TRAPA-CVE-2023-28771',
        licenseOrTerms: 'TRAPA Public Vulnerability Research',
        url: 'https://trapa.security/blog/cve-2023-28771/',
        usageSummary: 'Reverse-engineers sshipsecpm ike_decoder_notification(), the hardcoded 3DES key, and the sdwan_vpndebug.log command injection.',
      },
      {
        id: 'rapid7-zyxel-cve-2023-28771',
        organization: 'Rapid7 Emergent Threat Response',
        title: 'Zyxel Firewall Pre-Auth Command Injection (CVE-2023-28771) Exploit & Network Signatures',
        referenceCode: 'RAPID7-CVE-2023-28771',
        licenseOrTerms: 'Rapid7 Public Security Research',
        url: 'https://attackerkb.com/topics/N3i8dxpFKS/cve-2023-28771/rapid7-analysis',
        usageSummary: 'Documents the IKEv2 SA_INIT Notify Type 14 packet layout ("HAXBHAXBHAXB") and Suricata detection rules.',
      },
      {
        id: 'zyxel-cisa-cve-2023-28771',
        organization: 'Zyxel PSIRT & CISA KEV',
        title: 'Zyxel Security Advisory for OS Command Injection Vulnerability in Firewalls (CVE-2023-28771)',
        referenceCode: 'ZYXEL-SI-1486',
        licenseOrTerms: 'Vendor Security Advisory',
        url: 'https://www.zyxel.com/global/en/support/security-advisories/zyxel-security-advisory-for-remote-command-injection-vulnerability-of-firewalls',
        usageSummary: 'Lists affected ATP, USG FLEX, VPN, and ZyWALL firmware versions and patches.',
      },
    ],
    syntheticDataNotice: 'All WAN firewall IPs and payload staging servers are synthetic simulation values.',
  },
  'juniper-junos-jweb-cve-2023-36845-chain': {
    scenarioId: 'juniper-junos-jweb-cve-2023-36845-chain',
    scenarioCode: 'CVE-2023-36845',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (Juniper J-Web PHPRC CVE-2023-36845)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1059.004', name: 'Command and Scripting Interpreter: Fileless PHP auto_prepend_file Execution', tactic: 'Execution / Defense Evasion', url: 'https://attack.mitre.org/techniques/T1059/004/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) watchTowr Labs originally chained CVE-2023-36845 (Appweb CGI environment variable injection) with CVE-2023-36846 (do_upload uploaded file path); (2) VulnCheck then demonstrated how an attacker can achieve 100% fileless pre-auth RCE using CVE-2023-36845 alone by sending POST /webauth_operation.php?PHPRC=/dev/fd/0 with body auto_prepend_file="data://text/plain;base64,..." so php-cgi parses standard input as php.ini and executes in-memory PHP code without touching disk; and (3) Juniper SIRT & CISA KEV documented in-the-wild exploitation across SRX and EX devices.',
    primarySources: [
      {
        id: 'watchtowr-juniper-cve-2023-36845',
        organization: 'watchTowr Labs',
        title: 'CVEs-2023-36844 to 36847: Juniper SRX & EX Pre-Auth Remote Code Execution Chain',
        referenceCode: 'WATCHTOWR-JUNIPER-2023',
        licenseOrTerms: 'watchTowr Public Vulnerability Research',
        url: 'https://labs.watchtowr.com/cve-2023-36844-and-friends-rce-in-juniper-firewalls/',
        usageSummary: 'Discovers how Appweb CGI populates process environment variables from query parameters (PHPRC).',
      },
      {
        id: 'vulncheck-juniper-fileless-phprc',
        organization: 'VulnCheck Initial Access Intelligence',
        title: 'Single-Request Fileless RCE on Juniper J-Web via PHPRC=/dev/fd/0 (CVE-2023-36845)',
        referenceCode: 'VULNCHECK-CVE-2023-36845',
        licenseOrTerms: 'VulnCheck Technical Research',
        url: 'https://vulncheck.com/blog/juniper-cve-2023-36845',
        usageSummary: 'Demonstrates single-request fileless RCE using PHPRC=/dev/fd/0 and auto_prepend_file="data://text/plain;base64,...".',
      },
      {
        id: 'juniper-sirt-jsa72300-cisa',
        organization: 'Juniper SIRT & CISA KEV',
        title: '2023-08 Out-of-Cycle Security Bulletin: Junos OS SRX and EX Series J-Web Vulnerabilities (JSA72300)',
        referenceCode: 'JSA72300',
        licenseOrTerms: 'Vendor Security Advisory',
        url: 'https://supportportal.juniper.net/s/article/2023-08-Out-of-Cycle-Security-Bulletin-Junos-OS-SRX-Series-and-EX-Series-Multiple-vulnerabilities-in-J-Web-can-be-combined-to-allow-a-preAuth-Remote-Code-Execution',
        usageSummary: 'Official Juniper advisory detailing J-Web remediation and delete system services web-management mitigation.',
      },
    ],
    syntheticDataNotice: 'Juniper SRX management IPs and PHP payloads are synthetic lab traces.',
  },
  'atlassian-confluence-cve-2023-22515-storm0062': {
    scenarioId: 'atlassian-confluence-cve-2023-22515-storm0062',
    scenarioCode: 'CVE-2023-22515',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (Confluence XWork CVE-2023-22515)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1136.001', name: 'Create Account: Local Account (confluence-administrators)', tactic: 'Persistence', url: 'https://attack.mitre.org/techniques/T1136/001/' },
      { id: 'T1505.003', name: 'Server Software Component: Web Shell (OSGi Servlet Plugin)', tactic: 'Persistence / Execution', url: 'https://attack.mitre.org/techniques/T1505/003/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Rapid7 dissected the Apache Struts / XWork getter-chaining vulnerability on /server-info.action (traversing ServerInfoAction.getBootstrapStatusProvider().getApplicationConfig().setSetupComplete(false)); (2) Microsoft Threat Intelligence attributed the initial zero-day exploitation wave to nation-state actor Storm-0062 (DarkShadow); and (3) Joint CISA/FBI/MS-ISAC Advisory AA23-289A documented the full post-exploitation sequence (/setup/setupadministrator.action with X-Atlassian-Token: no-check -> /setup/finishsetup.action -> /rest/plugins/1.0/ OSGi webshell upload).',
    primarySources: [
      {
        id: 'cisa-aa23-289a-confluence',
        organization: 'CISA, FBI & MS-ISAC Joint Advisory',
        title: 'AA23-289A: Threat Actors Exploit Atlassian Confluence CVE-2023-22515 for Initial Access',
        referenceCode: 'CISA-AA23-289A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-289a',
        usageSummary: 'Documents Storm-0062 exploitation, /setup/setupadministrator.action logs, and Sigma/YARA rules.',
      },
      {
        id: 'rapid7-confluence-cve-2023-22515',
        organization: 'Rapid7 Emergent Threat Response',
        title: 'Atlassian Confluence Zero-Day Broken Access Control (CVE-2023-22515) Technical Analysis',
        referenceCode: 'RAPID7-CVE-2023-22515',
        licenseOrTerms: 'Rapid7 Public Security Research',
        url: 'https://attackerkb.com/topics/Q5f0ItSzw5/cve-2023-22515/rapid7-analysis',
        usageSummary: 'Explains XWork ParametersInterceptor traversal of bootstrapStatusProvider.applicationConfig.setupComplete.',
      },
      {
        id: 'atlassian-microsoft-storm0062',
        organization: 'Atlassian Security & Microsoft Threat Intelligence',
        title: 'Confluence Data Center and Server Broken Access Control Vulnerability (CVE-2023-22515)',
        referenceCode: 'CONFSERVER-92475',
        licenseOrTerms: 'Vendor Security Advisory',
        url: 'https://confluence.atlassian.com/security/cve-2023-22515-broken-access-control-vulnerability-in-confluence-data-center-and-server-1295682276.html',
        usageSummary: 'Credits Microsoft Threat Intelligence for tracking Storm-0062 zero-day exploitation and provides fixed versions.',
      },
    ],
    syntheticDataNotice: 'Confluence server IPs and rogue admin usernames are synthetic simulation artifacts.',
  },
  'apache-activemq-cve-2023-46604-openwire': {
    scenarioId: 'apache-activemq-cve-2023-46604-openwire',
    scenarioCode: 'CVE-2023-46604',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (ActiveMQ OpenWire CVE-2023-46604)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1203', name: 'Exploitation for Client/Server Execution (Spring ClassPathXmlApplicationContext)', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1203/' },
      { id: 'T1059.004', name: 'Command and Scripting Interpreter (Spring ProcessBuilder init-method="start")', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1059/004/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Rapid7 reverse-engineered the OpenWire protocol command type 31 (0x1F ExceptionResponse) and BaseDataStreamMarshaller.createThrowable(), showing how it instantiates ClassPathXmlApplicationContext(String) without checking Throwable inheritance; (2) Huntress Labs captured live intrusion telemetry in data/activemq.log ("Loading XML bean definitions from URL") and msiexec.exe/shell process trees from HelloKitty ransomware deployments; and (3) Trend Micro & CISA KEV documented widespread exploitation by Kinsing and LockBit.',
    primarySources: [
      {
        id: 'rapid7-activemq-cve-2023-46604',
        organization: 'Rapid7 Emergent Threat Response',
        title: 'Suspected Ransomware Activity Targeting Apache ActiveMQ (CVE-2023-46604)',
        referenceCode: 'RAPID7-CVE-2023-46604',
        licenseOrTerms: 'Rapid7 Public Security Research',
        url: 'https://www.rapid7.com/blog/post/2023/11/01/etr-suspected-ransomware-activity-targeting-apache-activemq-cve-2023-46604/',
        usageSummary: 'Dissects the OpenWire 0x1F ExceptionResponse packet, createThrowable() reflection, and Spring XML bean RCE.',
      },
      {
        id: 'huntress-activemq-hellokitty',
        organization: 'Huntress Security Research',
        title: 'Active Exploitation of Apache ActiveMQ CVE-2023-46604 in the Wild',
        referenceCode: 'HUNTRESS-CVE-2023-46604',
        licenseOrTerms: 'Huntress Public Threat Research',
        url: 'https://www.huntress.com/blog/active-exploitation-of-apache-activemq-cve-2023-46604',
        usageSummary: 'Provides data/activemq.log forensic artifacts and wrapper.exe -> java.exe -> msiexec/shell detection rules.',
      },
      {
        id: 'apache-trendmicro-cve-2023-46604',
        organization: 'Apache Software Foundation & Trend Micro',
        title: 'Apache ActiveMQ OpenWire Unauthenticated RCE Advisory (CVE-2023-46604)',
        referenceCode: 'APACHE-CVE-2023-46604',
        licenseOrTerms: 'Apache 2.0 / Public Advisory',
        url: 'https://activemq.apache.org/security-advisories.data/CVE-2023-46604-announcement.txt',
        usageSummary: 'Documents the Throwable.class.isAssignableFrom(clazz) patch in ActiveMQ 5.18.3 and Kinsing/LockBit campaigns.',
      },
    ],
    syntheticDataNotice: 'All XML server IPs and broker hostnames are synthetic lab values.',
  },
  'papercut-ng-cve-2023-27350-bl00dy': {
    scenarioId: 'papercut-ng-cve-2023-27350-bl00dy',
    scenarioCode: 'CVE-2023-27350',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application (PaperCut SetupCompleted CVE-2023-27350)', tactic: 'Initial Access', url: 'https://attack.mitre.org/techniques/T1190/' },
      { id: 'T1059.007', name: 'Command and Scripting Interpreter: JavaScript (Mozilla Rhino Sandbox Bypass)', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1059/007/' },
      { id: 'T1059.001', name: 'Command and Scripting Interpreter: PowerShell (pc-app.exe SYSTEM Child)', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1059/001/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Horizon3.ai decompiled pcng-server-web.jar to show how Tapestry’s SetupCompleted.formSubmit() calls UserWebAuth.performLogin("admin") without authentication, and how setting print-and-device.script.enabled=Y and print.script.sandboxed=N unlocks java.lang.Runtime.getRuntime().exec() in the Mozilla Rhino engine; (2) Joint CISA/FBI Advisory AA23-131A documented active exploitation by the Bl00dy Ransomware Gang and provided Sysmon rules for pc-app.exe spawning shells; and (3) Microsoft Threat Intelligence attributed concurrent exploitation to Cl0p (Lace Tempest) and LockBit.',
    primarySources: [
      {
        id: 'cisa-aa23-131a-papercut',
        organization: 'CISA & FBI Joint Advisory',
        title: 'AA23-131A: Malicious Actors Exploit CVE-2023-27350 in PaperCut MF and NG',
        referenceCode: 'CISA-AA23-131A',
        licenseOrTerms: 'U.S. Government Public Domain',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-131a',
        usageSummary: 'Documents Bl00dy Ransomware Gang exploitation, network IOCs, and pc-app.exe child-process Sigma rules.',
      },
      {
        id: 'horizon3-papercut-cve-2023-27350',
        organization: 'Horizon3.ai Attack Team',
        title: 'PaperCut CVE-2023-27350 Deep Dive and Indicators of Compromise',
        referenceCode: 'HORIZON3-CVE-2023-27350',
        licenseOrTerms: 'Horizon3.ai Public Security Research',
        url: 'https://www.horizon3.ai/attack-research/attack-blogs/papercut-cve-2023-27350-deep-dive-and-indicators-of-compromise/',
        usageSummary: 'Details the Tapestry SetupCompleted/$Form session hijack, print.script.sandboxed=N, and Rhino JS RCE.',
      },
      {
        id: 'papercut-microsoft-cve-2023-27350',
        organization: 'PaperCut Software & Microsoft Threat Intelligence',
        title: 'PaperCut MF/NG Security Bulletin (March/April 2023) — CVE-2023-27350 & CVE-2023-27351',
        referenceCode: 'PAPERCUT-CVE-2023-27350',
        licenseOrTerms: 'Vendor Security Bulletin',
        url: 'https://www.papercut.com/kb/Main/PO-1216-and-PO-1219',
        usageSummary: 'Provides server.log forensic indicators and patched versions (20.1.7, 21.2.11, 22.0.9).',
      },
    ],
    syntheticDataNotice: 'Print server IPs and staging URLs are synthetic educational traces.',
  },
  'macos-gatekeeper-achilles-cve-2022-42821': {
    scenarioId: 'macos-gatekeeper-achilles-cve-2022-42821',
    scenarioCode: 'CVE-2022-42821',
    mitreTechniques: [
      { id: 'T1553.001', name: 'Subvert Trust Controls: Gatekeeper Bypass (CVE-2022-42821 Achilles)', tactic: 'Defense Evasion', url: 'https://attack.mitre.org/techniques/T1553/001/' },
      { id: 'T1222.002', name: 'File and Directory Permissions Modification: Linux and Mac (AppleDouble ACL)', tactic: 'Defense Evasion', url: 'https://attack.mitre.org/techniques/T1222/002/' },
      { id: 'T1204.002', name: 'User Execution: Malicious File (Unquarantined Mach-O)', tactic: 'Execution', url: 'https://attack.mitre.org/techniques/T1204/002/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Microsoft Threat Intelligence (Jonathan Bar Or) discovered CVE-2022-42821 ("Achilles"), demonstrating how an AppleDouble metadata file (._Payload.app) inside a ZIP archive restores a restrictive NFSv4 ACL (com.apple.acl.text denying writeextattr) that blocks Safari from writing com.apple.quarantine and bypasses both Gatekeeper and Lockdown Mode; (2) Jamf Threat Labs documented Endpoint Security Framework (ES_EVENT_TYPE_NOTIFY_EXEC) detections for unsigned, unquarantined Mach-O binaries in ~/Downloads; and (3) Apple Security Update HT213532 patched quarantine propagation.',
    primarySources: [
      {
        id: 'microsoft-achilles-cve-2022-42821',
        organization: 'Microsoft Security Threat Intelligence (Jonathan Bar Or)',
        title: 'Gatekeeper’s Achilles heel: Unearthing a macOS vulnerability (CVE-2022-42821)',
        referenceCode: 'MS-ACHILLES-2022-12',
        licenseOrTerms: 'Microsoft Security Blog',
        url: 'https://www.microsoft.com/en-us/security/blog/2022/12/19/gatekeepers-achilles-heel-unearthing-a-macos-vulnerability/',
        usageSummary: 'Original disclosure explaining AppleDouble ._ files, com.apple.acl.text deny writeextattr, and setxattr(com.apple.quarantine) failure.',
      },
      {
        id: 'jamf-macos-gatekeeper-achilles',
        organization: 'Jamf Threat Labs',
        title: 'Monitoring macOS Gatekeeper Bypasses & Unquarantined Execution with Endpoint Security (ESF)',
        referenceCode: 'JAMF-ACHILLES-2022',
        licenseOrTerms: 'Jamf Security Research',
        url: 'https://www.jamf.com/blog/',
        usageSummary: 'Provides ES_EVENT_TYPE_NOTIFY_EXEC and Jamf Protect behavioral analytics for unquarantined ~/Downloads execution.',
      },
      {
        id: 'apple-ht213532-cve-2022-42821',
        organization: 'Apple Product Security',
        title: 'About the security content of macOS Ventura 13.1, Monterey 12.6.2, and Big Sur 11.7.2 (CVE-2022-42821)',
        referenceCode: 'APPLE-HT213532',
        licenseOrTerms: 'Vendor Security Advisory',
        url: 'https://support.apple.com/en-us/HT213532',
        usageSummary: 'Official Apple patch advisory addressing ACL validation in Gatekeeper quarantine tagging.',
      },
    ],
    syntheticDataNotice: 'All macOS user paths and Mach-O bundle names are synthetic lab values.',
  },
  'windows-clfs-ransomware-cve-2023-28252-nokoyawa': {
    scenarioId: 'windows-clfs-ransomware-cve-2023-28252-nokoyawa',
    scenarioCode: 'CVE-2023-28252',
    mitreTechniques: [
      { id: 'T1068', name: 'Exploitation for Privilege Escalation (Windows CLFS.sys CVE-2023-28252)', tactic: 'Privilege Escalation', url: 'https://attack.mitre.org/techniques/T1068/' },
      { id: 'T1134.001', name: 'Access Token Manipulation: Token Impersonation/Theft (EPROCESS Token Swap)', tactic: 'Privilege Escalation', url: 'https://attack.mitre.org/techniques/T1134/001/' },
      { id: 'T1486', name: 'Data Encrypted for Impact (Nokoyawa Ransomware)', tactic: 'Impact', url: 'https://attack.mitre.org/techniques/T1486/' },
    ],
    multiSourceSynthesis:
      'Synthesizes 3 complementary sources: (1) Kaspersky GReAT (Securelist) captured the in-the-wild CVE-2023-28252 zero-day exploit during Nokoyawa ransomware intrusions, dissecting the crafted Base Log File (.blf) CRC32 forgery and the out-of-bounds write in CLFS!CClfsBaseFilePersisted::WriteMetadataBlock; (2) Zscaler ThreatLabz & Fortra analyzed the fake CClfsContainer vtable pivot to CLFS!ClfsEarlierLsn and nt!SeSetAccessStateGenericMapping to overwrite the current process EPROCESS Token with PID 4 (SYSTEM); and (3) Microsoft MSRC & CISA KEV issued the April 2023 Patch Tuesday fix.',
    primarySources: [
      {
        id: 'kaspersky-nokoyawa-clfs-cve-2023-28252',
        organization: 'Kaspersky GReAT (Securelist)',
        title: 'Nokoyawa ransomware attacks use new Windows zero-day vulnerability in CLFS (CVE-2023-28252)',
        referenceCode: 'SECURELIST-CVE-2023-28252',
        licenseOrTerms: 'Kaspersky GReAT Threat Research',
        url: 'https://securelist.com/nokoyawa-ransomware-attacks-use-zero-day/109483/',
        usageSummary: 'Documents discovery of the CVE-2023-28252 zero-day, .blf offset corruption, and Nokoyawa C++ ransomware deployment.',
      },
      {
        id: 'zscaler-clfs-cve-2023-28252-analysis',
        organization: 'Zscaler ThreatLabz',
        title: 'Technical Analysis of Windows CLFS Zero-Day Vulnerability CVE-2023-28252 & Nokoyawa Ransomware',
        referenceCode: 'ZSCALER-CVE-2023-28252',
        licenseOrTerms: 'Zscaler Public Security Research',
        url: 'https://www.zscaler.com/blogs/security-research/technical-analysis-windows-clfs-zero-day-vulnerability-cve-2023-28252',
        usageSummary: 'Details CClfsBaseFilePersisted::ExtendMetadataBlock / WriteMetadataBlock, fake pContainer vtables, and ClfsEarlierLsn gadgets.',
      },
      {
        id: 'msrc-cisa-cve-2023-28252',
        organization: 'Microsoft MSRC & CISA KEV',
        title: 'Windows Common Log File System Driver Elevation of Privilege Vulnerability (CVE-2023-28252)',
        referenceCode: 'MSRC-CVE-2023-28252',
        licenseOrTerms: 'Microsoft Public Security Advisory',
        url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-28252',
        usageSummary: 'Official Microsoft patch advisory and CISA Known Exploited Vulnerabilities mandate.',
      },
    ],
    syntheticDataNotice: 'All kernel pool addresses and workstation hostnames are synthetic educational traces.',
  },
};

export const BATCH_1_TO_4_CURATED_INTEL: Record<
  string,
  Omit<ThreatIntelContextData, 'sourceMode' | 'fetchedAt'>
> = {
  'xz-utils-cve-2024-3094-backdoor': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    scenarioCode: 'CVE-2024-3094',
    scenarioName: 'Andres Freund, Red Hat & Kaspersky — XZ Utils (liblzma) IFUNC sshd Supply Chain Backdoor',
    summary:
      'Discovered by Andres Freund and analyzed by Kaspersky GReAT, Red Hat, and CISA, CVE-2024-3094 (CVSS 10.0) is a multi-year supply chain backdoor inserted into XZ Utils 5.6.0/5.6.1 by "Jia Tan" that uses a glibc IFUNC resolver in liblzma.so to hijack OpenSSL RSA_public_decrypt inside sshd for pre-auth root command execution.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Andres Freund uncovered the ~500ms sshd CPU spike and m4 build extraction from bad-3-corrupt_lzma2.xz; Kaspersky GReAT reverse-engineered the crc64_resolve IFUNC hook of RSA_public_decrypt and Ed448 ChaCha20 command verification; and Red Hat & CISA published distribution impact matrices and YARA rules.',
    cves: [
      { id: 'CVE-2024-3094', cvss: '10.0 CRITICAL', status: 'CISA Alert · Upstream Supply Chain Backdoor', description: 'Malicious code in XZ Utils 5.6.0 and 5.6.1 liblzma hooks RSA_public_decrypt in systemd-linked sshd.' },
    ],
    actorGroups: [
      { name: 'Jia Tan (XZ Utils Maintainer Persona)', aliases: 'Suspected State-Sponsored Supply Chain Unit', targetSectors: 'Linux Distributions (Debian, Fedora, Ubuntu, RHEL), Global SSH Infrastructure', notableCampaign: 'Multi-year social engineering and build-system obfuscation implanting an Ed448-gated backdoor into liblzma.' },
      { name: 'Jigar Kumar / Dennis Ens Sockpuppet Cluster', aliases: 'Upstream Maintainer Pressure Campaign', targetSectors: 'Open-Source Compression & Cryptographic Maintainers', notableCampaign: 'Coordinated mailing-list pressure campaign to transfer XZ Utils repository maintainership to Jia Tan.' },
    ],
    realWorldAdvisories: [
      'Andres Freund (oss-security, Mar 29, 2024): backdoor in upstream xz/liblzma leading to ssh server compromise.',
      'Kaspersky GReAT (Securelist): Technical Analysis of CVE-2024-3094 XZ Utils IFUNC & Ed448 Backdoor.',
      'Red Hat & CISA Alert: Urgent Security Alert for XZ Utils CVE-2024-3094.',
    ],
    groundedSources: [
      { title: 'OpenWall oss-security — Andres Freund XZ Backdoor Disclosure', uri: 'https://www.openwall.com/lists/oss-security/2024/03/29/4' },
      { title: 'Kaspersky Securelist — XZ Backdoor Technical Analysis', uri: 'https://securelist.com/xz-backdoor-story-part-1/112354/' },
      { title: 'Red Hat Security Blog — Urgent Security Alert for CVE-2024-3094', uri: 'https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users' },
    ],
  },
  'cl0p-moveit-transfer-cve-2023-34362': {
    scenarioId: 'cl0p-moveit-transfer-cve-2023-34362',
    scenarioCode: 'CVE-2023-34362',
    scenarioName: 'Mandiant, Huntress & CISA — CL0P MOVEit Transfer SQLi, Deserialization & LEMURLOOT',
    summary:
      'Documented by Mandiant, Huntress, Rapid7, and CISA (AA23-158A), CL0P (FIN11 / TA505) exploited CVE-2023-34362 in Progress MOVEit Transfer by chaining /guestaccess.aspx and /moveitisapi/moveitisapi.dll for SQL injection and .NET BinaryFormatter deserialization to drop the human2.aspx (LEMURLOOT) webshell.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Huntress & Rapid7 reconstructed the guestaccess.aspx + moveitisapi.dll SQLi and BinaryFormatter session deserialization chain; Mandiant reverse-engineered the human2.aspx (LEMURLOOT) webshell and Azure Blob key theft; and CISA AA23-158A provided CL0P attribution and w3wp.exe -> csc.exe Sigma rules.',
    cves: [
      { id: 'CVE-2023-34362', cvss: '9.8 CRITICAL', status: 'CISA KEV · Mass Zero-Day Exploitation', description: 'SQL injection vulnerability in Progress MOVEit Transfer web application allowing unauthenticated database access and RCE.' },
    ],
    actorGroups: [
      { name: 'CL0P Ransomware Group (TA505 / FIN11)', aliases: 'Lace Tempest, DEV-0950', targetSectors: 'Financial Services, Government, Healthcare, Higher Education, Enterprise MFT', notableCampaign: 'Mass zero-day exploitation of MOVEit Transfer (CVE-2023-34362) deploying LEMURLOOT (human2.aspx) for data extortion.' },
      { name: 'FIN11 Zero-Day Acquisition & Extortion Unit', aliases: 'Unc2546 / Accellion FTA & SolarWinds Serv-U Operators', targetSectors: 'Managed File Transfer (MFT) Appliances Globally', notableCampaign: 'Repeatedly weaponized zero-day flaws across Accellion FTA, GoAnywhere MFT, MOVEit Transfer, and Cleo.' },
    ],
    realWorldAdvisories: [
      'CISA & FBI Joint Advisory AA23-158A: CL0P Ransomware Gang Targets MOVEit Transfer (CVE-2023-34362).',
      'Mandiant Threat Intelligence: Zero-Day Vulnerability in MOVEit Transfer Exploited for Data Theft (LEMURLOOT).',
      'Huntress Labs & Rapid7: MOVEit Transfer CVE-2023-34362 Exploit Chain & csc.exe Forensics.',
    ],
    groundedSources: [
      { title: 'CISA Joint Advisory AA23-158A — CL0P MOVEit Transfer', uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a' },
      { title: 'Mandiant — MOVEit Zero-Day & LEMURLOOT Webshell Analysis', uri: 'https://cloud.google.com/blog/topics/threat-intelligence/zero-day-moveit-data-theft' },
      { title: 'Huntress — MOVEit Transfer CVE-2023-34362 Technical Analysis', uri: 'https://www.huntress.com/blog/moveit-transfer-critical-vulnerability-cve-2023-34362-rapid-response' },
    ],
  },
  'openssh-regreSSHion-cve-2024-6387': {
    scenarioId: 'openssh-regreSSHion-cve-2024-6387',
    scenarioCode: 'CVE-2024-6387',
    scenarioName: 'Qualys TRU, OpenSSH & CISA — OpenSSH "regreSSHion" SIGALRM Async-Signal-Unsafe Race RCE',
    summary:
      'Discovered by Qualys Threat Research Unit (TRU), CVE-2024-6387 ("regreSSHion") is an unauthenticated signal-handler race condition in OpenSSH’s sshd on glibc Linux systems where SIGALRM calls async-signal-unsafe syslog() while malloc()/free() holds heap locks, enabling pre-auth root RCE.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Qualys TRU weaponized the SIGALRM ptmalloc2 arena race and _IO_FILE vtable hijack; the OpenSSH Project documented the October 2020 commit that accidentally removed #ifndef DO_LOG_SAFE_IN_SIGHAND from sigdie(); and CISA & Rapid7 provided SSH connection-storm detection guidance.',
    cves: [
      { id: 'CVE-2024-6387', cvss: '8.1 HIGH', status: 'Qualys TRU Advisory · Unauthenticated Root RCE', description: 'Signal handler race condition in OpenSSH sshd (8.5p1–9.7p1) on glibc-based Linux systems.' },
    ],
    actorGroups: [
      { name: 'Opportunistic & APT Linux Infrastructure Operators', aliases: 'Mass SSH Scanning Clusters', targetSectors: 'Internet-Facing Linux Servers, Cloud Workloads, Telecommunications', notableCampaign: 'High-volume SSH LoginGraceTime connection racing targeting unpatched OpenSSH 8.5p1–9.7p1 servers.' },
      { name: 'Cloud & Botnet Initial Access Brokers', aliases: 'SSH Brute-Force & Race Exploiters', targetSectors: 'Public Cloud VPS, Edge Bastion Hosts', notableCampaign: 'Automated scanning and exploitation attempts following public PoC release in July 2024.' },
    ],
    realWorldAdvisories: [
      'Qualys Threat Research Unit (TRU): regreSSHion — RCE in OpenSSH’s server on glibc-based Linux systems (CVE-2024-6387).',
      'OpenSSH 9.8 Release Notes: Security fix for async-signal-unsafe sigdie() regression.',
      'Rapid7 Emergent Threat Response: CVE-2024-6387 regreSSHion Analysis & Detection.',
    ],
    groundedSources: [
      { title: 'Qualys TRU — CVE-2024-6387 regreSSHion Technical Advisory', uri: 'https://www.qualys.com/2024/07/01/cve-2024-6387/regresshion.txt' },
      { title: 'OpenSSH 9.8 Security Advisory & Release Notes', uri: 'https://www.openssh.com/txt/release-9.8' },
      { title: 'Rapid7 — OpenSSH CVE-2024-6387 regreSSHion Analysis', uri: 'https://www.rapid7.com/blog/post/2024/07/01/etr-openssh-remote-unauthenticated-code-execution-cve-2024-6387-regresshion/' },
    ],
  },
  'fortra-goanywhere-mft-cve-2023-0669-cl0p': {
    scenarioId: 'fortra-goanywhere-mft-cve-2023-0669-cl0p',
    scenarioCode: 'CVE-2023-0669',
    scenarioName: 'Huntress, Mandiant & Horizon3 — Fortra GoAnywhere MFT LicenseServlet Deserialization RCE',
    summary:
      'Exploited as a zero-day by CL0P (TA505 / FIN11) and analyzed by Horizon3.ai, Huntress, and Mandiant, CVE-2023-0669 allows unauthenticated attackers to send a "$2" AES-128-CBC encrypted CommonsBeanutils1 deserialization payload to /goanywhere/lic/accept for remote code execution.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Horizon3.ai extracted the hardcoded AES key/IV and "$2" prefix inside LicenseResponseServlet; Huntress captured GoAnywhere log stack traces and Tomcat child process trees; and Mandiant & CISA KEV documented CL0P’s deployment of TrueBot and Cobalt Strike.',
    cves: [
      { id: 'CVE-2023-0669', cvss: '7.2 HIGH / CRITICAL RCE', status: 'CISA KEV · CL0P Zero-Day Campaign', description: 'Pre-authentication insecure deserialization in Fortra GoAnywhere MFT LicenseResponseServlet (/goanywhere/lic/accept).' },
    ],
    actorGroups: [
      { name: 'CL0P Ransomware Group (TA505 / FIN11)', aliases: 'Lace Tempest', targetSectors: 'Healthcare, Financial Services, Manufacturing, Enterprise MFT', notableCampaign: 'Compromised over 130 enterprise GoAnywhere MFT instances using CVE-2023-0669 prior to patch availability.' },
      { name: 'Silence / TrueBot Downloader Affiliates', aliases: 'TA505 Delivery Infrastructure', targetSectors: 'Corporate Windows & Linux MFT Servers', notableCampaign: 'Delivered TrueBot (Silence.Downloader) and Cobalt Strike beacons via GoAnywhere Tomcat JVM shells.' },
    ],
    realWorldAdvisories: [
      'Horizon3.ai: GoAnywhere MFT CVE-2023-0669 Deep Dive and Indicators of Compromise.',
      'Huntress Labs: Investigating GoAnywhere MFT RCE (CVE-2023-0669) Exploitation.',
      'CISA KEV & Mandiant: FIN11 / CL0P Exploitation of GoAnywhere MFT Deploying TrueBot.',
    ],
    groundedSources: [
      { title: 'Horizon3.ai — GoAnywhere MFT CVE-2023-0669 Technical Deep Dive', uri: 'https://www.horizon3.ai/attack-research/attack-blogs/goanywhere-mft-cve-2023-0669-deep-dive-and-indicators-of-compromise/' },
      { title: 'Huntress — Investigating GoAnywhere MFT CVE-2023-0669', uri: 'https://www.huntress.com/blog/investigating-goanywhere-mft-rce-cve-2023-0669' },
      { title: 'CISA Known Exploited Vulnerabilities Catalog — CVE-2023-0669', uri: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
    ],
  },
  '3cx-desktopapp-supply-chain-lazarus': {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    scenarioCode: 'CVE-2023-29059',
    scenarioName: 'CrowdStrike, Kaspersky & Mandiant — 3CXDesktopApp Supply Chain (SmoothOperator / Lazarus)',
    summary:
      'Analyzed by CrowdStrike, Mandiant (UNC4736), and Kaspersky GReAT, the 3CXDesktopApp supply chain attack (CVE-2023-29059) used a trojanized ffmpeg.dll to decrypt a 0xFEEDFACE payload in d3dcompiler_47.dll, fetch AES-GCM C2 URLs from GitHub IconStorages .ico files, and deploy ICONICSTEALER and Gopuram.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: CrowdStrike discovered the ffmpeg.dll + d3dcompiler_47.dll loader and GitHub IconStorages .ico dead-drop; Mandiant proved the 3CX build server was breached via a prior X_TRADER supply chain compromise and analyzed ICONICSTEALER; and Kaspersky GReAT uncovered the Gopuram backdoor on select targets.',
    cves: [
      { id: 'CVE-2023-29059', cvss: '9.8 CRITICAL', status: 'CISA Alert · Cascading Supply Chain Compromise', description: 'Trojanized 3CXDesktopApp Electron softphone (18.12.407 / 18.12.416) containing malicious ffmpeg.dll and d3dcompiler_47.dll.' },
    ],
    actorGroups: [
      { name: 'Lazarus Group (Labyrinth Chollima / UNC4736)', aliases: 'AppleJeus, Citrine Sleet, Diamond Sleet', targetSectors: 'Cryptocurrency Exchanges, Financial Trading, Enterprise VoIP Customers', notableCampaign: 'Cascading X_TRADER -> 3CXDesktopApp supply chain compromise ("SmoothOperator") delivering ICONICSTEALER and Gopuram.' },
      { name: 'Andariel / RGB Bureau 121 Sub-Cluster', aliases: 'DPRK Supply Chain Operations', targetSectors: 'Software Build Pipelines & FinTech Developers', notableCampaign: 'Maintained long-term Gopuram backdoor infrastructure across selective high-value targets.' },
    ],
    realWorldAdvisories: [
      'CrowdStrike: CrowdStrike Detects and Prevents Active Intrusion Campaign Targeting 3CXDesktopApp Customers.',
      'Mandiant: 3CX Software Supply Chain Compromise Initiated by a Prior Software Supply Chain Compromise (UNC4736).',
      'Kaspersky GReAT (Securelist): Gopuram backdoor deployed through 3CX supply chain attack.',
    ],
    groundedSources: [
      { title: 'CrowdStrike — 3CXDesktopApp SmoothOperator Intrusion Analysis', uri: 'https://www.crowdstrike.com/blog/crowdstrike-detects-and-prevents-active-intrusion-campaign-targeting-3cxdesktopapp-customers/' },
      { title: 'Mandiant — 3CX Cascading Supply Chain Compromise (UNC4736)', uri: 'https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise' },
      { title: 'Kaspersky Securelist — Gopuram Backdoor in 3CX Supply Chain', uri: 'https://securelist.com/gopuram-backdoor-deployed-through-3cx-supply-chain-attack/109344/' },
    ],
  },
  'nopac-samaccountname-cve-2021-42278-42287': {
    scenarioId: 'nopac-samaccountname-cve-2021-42278-42287',
    scenarioCode: 'CVE-2021-42287',
    scenarioName: 'Microsoft, CrowdStrike & Splunk — Active Directory "noPac": sAMAccountName Spoofing & KDC Impersonation',
    summary:
      'Documented by Microsoft MSRC, CrowdStrike, and Splunk SURGe, "noPac" chains CVE-2021-42278 (sAMAccountName spoofing without trailing "$") and CVE-2021-42287 (KDC S4U2self trailing "$" fallback) so any domain user can obtain a Domain Admin service ticket and run DCSync.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft MSRC explained the SAM trailing-$ validation gap and KDC S4U2self fallback; CrowdStrike analyzed the ms-DS-MachineAccountQuota=10 abuse and sam-the-admin tooling; and Splunk SURGe provided EventID 4741 + 4781 + 4768 + 4769 detection queries.',
    cves: [
      { id: 'CVE-2021-42287', cvss: '8.8 HIGH / CRITICAL AD EOP', status: 'CISA KEV · Active Directory KDC Pac Bypass', description: 'Active Directory Domain Services KDC falls back to appending "$" when target sAMAccountName is missing during S4U2self.' },
      { id: 'CVE-2021-42278', cvss: '8.8 HIGH', status: 'CISA KEV · sAMAccountName Spoofing', description: 'Security Account Manager (SAM) permits machine accounts to be renamed to match a Domain Controller without a trailing "$".' },
    ],
    actorGroups: [
      { name: 'Ransomware Affiliates & APT Lateral Movement Operators', aliases: 'Conti, BlackCat, APT29, MuddyWater', targetSectors: 'Enterprise Active Directory Environments Globally', notableCampaign: 'Used sam-the-admin / noPac to escalate from initial phishing user access to Domain Admin in under 5 seconds.' },
      { name: 'Deep Instinct / Red Team Exploitation Clusters', aliases: 'noPac / Impacket Operators', targetSectors: 'Corporate Windows Domains with Default MachineAccountQuota=10', notableCampaign: 'Automated TGT/S4U2self ticket forging and immediate DCSync credential dumping.' },
    ],
    realWorldAdvisories: [
      'Microsoft MSRC: CVE-2021-42278 & CVE-2021-42287 Active Directory Elevation of Privilege Advisories.',
      'CrowdStrike Threat Intelligence: Active Directory sAMAccountName Spoofing (noPac) Analysis.',
      'Splunk SURGe: Detecting noPac with Windows Security EventID 4741 and 4781.',
    ],
    groundedSources: [
      { title: 'Microsoft MSRC — CVE-2021-42287 KDC Pac Bypass Advisory', uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-42287' },
      { title: 'Microsoft MSRC — CVE-2021-42278 sAMAccountName Spoofing Advisory', uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-42278' },
      { title: 'CISA KEV — CVE-2021-42287 & CVE-2021-42278', uri: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
    ],
  },
  'zerologon-netlogon-cve-2020-1472': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    scenarioCode: 'CVE-2020-1472',
    scenarioName: 'Secura, CISA & CrowdStrike — Active Directory "Zerologon" Netlogon AES-CFB8 All-Zero IV (CVE-2020-1472)',
    summary:
      'Discovered by Secura (Tom Tervoort) and mandated for emergency patching by CISA ED 20-04, Zerologon (CVE-2020-1472, CVSS 10.0) exploits a hardcoded all-zero IV in MS-NRPC AES-CFB8 (ComputeNetlogonCredential) to spoof NetrServerAuthenticate3 in ~256 tries and reset the Domain Controller’s AD password via NetrServerPasswordSet2.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Secura proved the 1-in-256 AES-CFB8 zero-IV mathematical flaw; CISA ED 20-04 documented the broken DC replication impact and $MACHINE.ACC password recovery; and Microsoft & CrowdStrike published EventID 4742 (ANONYMOUS LOGON) and EventID 5805 detection rules.',
    cves: [
      { id: 'CVE-2020-1472', cvss: '10.0 CRITICAL', status: 'CISA Emergency Directive 20-04 · KEV', description: 'Netlogon Remote Protocol (MS-NRPC) elevation of privilege vulnerability caused by an all-zero AES-CFB8 initialization vector.' },
    ],
    actorGroups: [
      { name: 'APT28, MuddyWater, Chimera & Ryuk/Conti Affiliates', aliases: 'Fancy Bear, Mercury, Pioneer Kitten', targetSectors: 'Government, Defense, Critical Infrastructure, Enterprise AD', notableCampaign: 'Exploited CVE-2020-1472 to take over Domain Controllers immediately after initial network entry.' },
      { name: 'Wizard Spider (Ryuk / Conti Ransomware)', aliases: 'UNC1878, Grim Spider', targetSectors: 'Healthcare, Municipal Networks, Enterprise Forests', notableCampaign: 'Achieved 29-minute time-to-ransomware across hospital networks by chaining TrickBot/BazarLoader with Zerologon.' },
    ],
    realWorldAdvisories: [
      'Secura BV Whitepaper: Zerologon — Unauthenticated Domain Controller Compromise (CVE-2020-1472).',
      'CISA Emergency Directive 20-04: Mitigate Netlogon Elevation of Privilege Vulnerability.',
      'Microsoft Threat Intelligence: New detections for CVE-2020-1472 active exploitation.',
    ],
    groundedSources: [
      { title: 'Secura — Zerologon CVE-2020-1472 Technical Whitepaper', uri: 'https://www.secura.com/blog/zero-logon' },
      { title: 'CISA Emergency Directive 20-04 — Zerologon Mitigation', uri: 'https://www.cisa.gov/news-events/directives/ed-20-04-mitigate-netlogon-elevation-privilege-vulnerability-august-2020-patch' },
      { title: 'Microsoft Security Blog — Detecting CVE-2020-1472 Active Exploitation', uri: 'https://www.microsoft.com/en-us/security/blog/2020/09/28/new-detections-for-cve-2020-1472-active-exploitation/' },
    ],
  },
  'proxyshell-exchange-cve-2021-34473': {
    scenarioId: 'proxyshell-exchange-cve-2021-34473',
    scenarioCode: 'CVE-2021-34473',
    scenarioName: 'DEVCORE (Orange Tsai), CISA & Mandiant — Microsoft Exchange "ProxyShell" 3-CVE Pre-Auth RCE Chain',
    summary:
      'Discovered by Orange Tsai (DEVCORE) and documented in CISA AA21-265A, ProxyShell chains CVE-2021-34473 (/autodiscover/autodiscover.json?@foo.com/powershell/ SSRF), CVE-2021-34523 (X-Rps-CAT token forgery), and CVE-2021-31207 (New-MailboxExportRequest UNC .aspx write) for pre-auth SYSTEM RCE on Exchange.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: DEVCORE (Orange Tsai) discovered the 3-CVE chain and PST-encoded webshell trick; CISA AA21-265A documented Conti/APT mass exploitation; and Mandiant & Huntress provided MSExchange Management EventID 1 and aspnet_client\\ webshell forensics.',
    cves: [
      { id: 'CVE-2021-34473', cvss: '9.8 CRITICAL', status: 'CISA KEV · ProxyShell Pre-Auth Path Confusion', description: 'Microsoft Exchange Server Client Access Service (CAS) Autodiscover explicit-logon URI normalization SSRF.' },
      { id: 'CVE-2021-34523', cvss: '9.8 CRITICAL', status: 'CISA KEV · Exchange PowerShell Elevation', description: 'Exchange PowerShell Backend accepts forged X-Rps-CAT CommonAccessToken headers.' },
      { id: 'CVE-2021-31207', cvss: '7.2 HIGH', status: 'CISA KEV · Arbitrary File Write via MailboxExportRequest', description: 'New-MailboxExportRequest allows writing PST files with .aspx extensions to arbitrary UNC paths.' },
    ],
    actorGroups: [
      { name: 'Conti, LockBit, BlackByte & APT27 / Hafnium Clusters', aliases: 'Emissary Panda, LockFile Operators', targetSectors: 'Enterprise On-Premises Microsoft Exchange Servers Globally', notableCampaign: 'Mass automated exploitation of ProxyShell in August 2021 dropping .aspx webshells into inetpub\\wwwroot\\aspnet_client\\.' },
      { name: 'FIN12 & LockFile Ransomware Operators', aliases: 'Exchange Initial Access Affiliates', targetSectors: 'Financial, Legal, Manufacturing, Government', notableCampaign: 'Chained ProxyShell on internet-facing Exchange servers with PetitPotam and AD CS takeover.' },
    ],
    realWorldAdvisories: [
      'DEVCORE (Orange Tsai): A New Attack Surface on MS Exchange Part 3 — ProxyShell.',
      'CISA & FBI Alert AA21-265A: Conti Ransomware and ProxyShell Exploitation.',
      'Huntress & Mandiant DFIR: Detecting New-MailboxExportRequest Webshells in Exchange.',
    ],
    groundedSources: [
      { title: 'DEVCORE (Orange Tsai) — ProxyShell Technical Research', uri: 'https://devco.re/blog/2021/08/06/a-new-attack-surface-on-ms-exchange-part-3-ProxyShell/' },
      { title: 'CISA Alert — ProxyShell Exchange Exploitation Guidance', uri: 'https://www.cisa.gov/news-events/alerts/2021/08/21/cisa-and-fbi-release-advisory-conti-ransomware-and-proxyshell' },
      { title: 'MSRC — CVE-2021-34473 Exchange Server Advisory', uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34473' },
    ],
  },
  'printnightmare-spooler-cve-2021-34527': {
    scenarioId: 'printnightmare-spooler-cve-2021-34527',
    scenarioCode: 'CVE-2021-34527',
    scenarioName: 'Microsoft, Rapid7 & CISA — Windows Print Spooler "PrintNightmare" RpcAddPrinterDriverEx SYSTEM RCE',
    summary:
      'Analyzed by Microsoft MSRC, Rapid7, Elastic Security Labs, and CISA, PrintNightmare (CVE-2021-34527) allows any authenticated domain user to call RpcAddPrinterDriverEx over MS-RPRN with flag 0x8014 (APD_INSTALL_WARNED_DRIVER) and a UNC path, forcing spoolsv.exe to load a malicious DLL as NT AUTHORITY\\SYSTEM.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft MSRC explained the ValidateObjectAccess bypass in localspl.dll when 0x8014 is set; Rapid7 documented the DRIVER_CONTAINER UNC pConfigFile exploitation; and Elastic & CISA provided PrintService EventID 316 and Sysmon EventID 7/11 rules.',
    cves: [
      { id: 'CVE-2021-34527', cvss: '8.8 HIGH / CRITICAL AD RCE', status: 'CISA KEV · Windows Print Spooler RCE', description: 'Windows Print Spooler service improperly performs privileged file operations in RpcAddPrinterDriverEx.' },
    ],
    actorGroups: [
      { name: 'Vice Society, Conti, Magniber & APT Lateral Movement Teams', aliases: 'DEV-0832', targetSectors: 'Active Directory Domain Controllers, Print Servers, Enterprise Windows Fleets', notableCampaign: 'Used PrintNightmare to immediately compromise Domain Controllers where spoolsv.exe was left running.' },
      { name: 'Sangfor PoC Post-Disclosure Threat Clusters', aliases: 'MS-RPRN / MS-PAR Exploitation Operators', targetSectors: 'Corporate Windows Server Estates', notableCampaign: 'Weaponized Impacket rpcdump/adddriver payloads to load Cobalt Strike DLLs into spool\\drivers\\x64\\3\\.' },
    ],
    realWorldAdvisories: [
      'Microsoft MSRC: CVE-2021-34527 Windows Print Spooler Remote Code Execution Vulnerability.',
      'Rapid7: PrintNightmare Technical Analysis of MS-RPRN RpcAddPrinterDriverEx.',
      'CISA Alert: PrintNightmare Critical Windows Print Spooler Vulnerability Mitigation.',
    ],
    groundedSources: [
      { title: 'Microsoft MSRC — CVE-2021-34527 PrintNightmare Advisory', uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34527' },
      { title: 'Rapid7 — PrintNightmare Technical Analysis', uri: 'https://www.rapid7.com/blog/post/2021/06/30/printnightmare-cve-2021-1675-remote-code-execution-in-windows-spooler-service/' },
      { title: 'CISA Alert — PrintNightmare Mitigation Guidance', uri: 'https://www.cisa.gov/news-events/alerts/2021/06/30/printnightmare-critical-windows-print-spooler-vulnerability' },
    ],
  },
  'sharepoint-cve-2023-29357-24955-chain': {
    scenarioId: 'sharepoint-cve-2023-29357-24955-chain',
    scenarioCode: 'CVE-2023-29357',
    scenarioName: 'STAR Labs, Rapid7 & CISA — Microsoft SharePoint OAuth JWT "alg:none" Spoofing to BCS RCE Chain',
    summary:
      'Discovered by STAR Labs SG (Nguyễn Tiến Giang) at Pwn2Own Vancouver 2023 and analyzed by Rapid7 and CISA, this chain combines CVE-2023-29357 (SharePoint OAuth2 JWT signature bypass via "alg":"none") with CVE-2023-24955 (Business Connectivity Services .bdcm DotNetAssembly execution) for unauthenticated RCE.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: STAR Labs SG discovered both CVE-2023-29357 and the BCS .bdcm DotNetAssembly gadget (CVE-2023-24955); Rapid7 documented the X-PROOF_TOKEN + Bearer JWT bypass and /_api/web/siteusers Farm Admin enumeration; and Microsoft MSRC & CISA KEV issued detection guidance.',
    cves: [
      { id: 'CVE-2023-29357', cvss: '9.8 CRITICAL', status: 'CISA KEV · SharePoint JWT Auth Bypass', description: 'Microsoft SharePoint Server Elevation of Privilege vulnerability via unsigned OAuth JWT tokens ("alg":"none").' },
      { id: 'CVE-2023-24955', cvss: '7.2 HIGH', status: 'Pwn2Own Chain · BCS .bdcm RCE', description: 'Microsoft SharePoint Server Remote Code Execution vulnerability via Business Connectivity Services model import.' },
    ],
    actorGroups: [
      { name: 'Enterprise Intranet & Collaboration Intrusion Operators', aliases: 'SharePoint Exploitation Clusters', targetSectors: 'Government, Enterprise Intranets, Defense, Financial Services', notableCampaign: 'Chained CVE-2023-29357 Farm Admin spoofing with BCS/WebPart gadgets for full IIS w3wp.exe takeover.' },
      { name: 'STAR Labs SG Vulnerability Research Team', aliases: 'Pwn2Own Vancouver 2023 Researchers', targetSectors: 'Microsoft SharePoint Server 2019 / Subscription Edition', notableCampaign: 'Demonstrated full unauthenticated remote code execution chaining CVE-2023-29357 and CVE-2023-24955.' },
    ],
    realWorldAdvisories: [
      'STAR Labs SG: SharePoint Pre-Auth RCE Chain (CVE-2023-29357 & CVE-2023-24955) Technical Writeup.',
      'Rapid7: Analysis of SharePoint Server Elevation of Privilege (CVE-2023-29357).',
      'Microsoft MSRC & CISA KEV: CVE-2023-29357 SharePoint Server Advisory.',
    ],
    groundedSources: [
      { title: 'STAR Labs SG — SharePoint CVE-2023-29357 & CVE-2023-24955 Writeup', uri: 'https://starlabs.sg/blog/2023/09-sharepoint-pre-auth-rce-chain-cve-2023-29357-and-cve-2023-24955/' },
      { title: 'Microsoft MSRC — CVE-2023-29357 Advisory', uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29357' },
      { title: 'CISA KEV Catalog — CVE-2023-29357', uri: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
    ],
  },
  'vmware-vcenter-cve-2023-34048-unc3886': {
    scenarioId: 'vmware-vcenter-cve-2023-34048-unc3886',
    scenarioCode: 'CVE-2023-34048',
    scenarioName: 'Mandiant, VMware & CISA — UNC3886: vCenter vmdird Out-of-Bounds Write & ESXi VIRTUALPITA Backdoor',
    summary:
      'Disclosed by Mandiant (Google Cloud), VMware (VMSA-2023-0023), and CISA KEV, China-nexus espionage actor UNC3886 exploited CVE-2023-34048 (vmdird DCERPC out-of-bounds write) as a zero-day to compromise vCenter, decrypt vpxuser credentials via symkey.dat, and install VIRTUALPITA/VIRTUALPIE VIB backdoors on ESXi hypervisors.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Mandiant uncovered UNC3886’s vmdird crash artifacts, vPostgreSQL vpxuser decryption via symkey.dat, and AF_VSOCK VIRTUALPITA/VIRTUALPIE implants; VMware VMSA-2023-0023 documented the DCERPC heap OOB write; and CISA KEV provided ESXi VIB auditing guidance.',
    cves: [
      { id: 'CVE-2023-34048', cvss: '9.8 CRITICAL', status: 'CISA KEV · UNC3886 Zero-Day', description: 'Out-of-bounds write vulnerability in VMware vCenter Server DCERPC protocol implementation (vmdird).' },
    ],
    actorGroups: [
      { name: 'UNC3886 (China-Nexus Cyber Espionage Group)', aliases: 'Hypervisor & Network Appliance Espionage Unit', targetSectors: 'Defense Industrial Base, Telecommunications, Technology, Government Virtualization', notableCampaign: 'Exploited CVE-2023-34048 across vCenter appliances to deploy persistent VIRTUALPITA and VIRTUALPIE VIB backdoors over AF_VSOCK.' },
      { name: 'VIRTUALPITA / VIRTUALSHINE Hypervisor Developers', aliases: 'ESXi VMCI / VSOCK Implant Authors', targetSectors: 'VMware vSphere & ESXi Control Planes', notableCampaign: 'Engineered custom C and Python backdoors utilizing VMCI sockets to bridge ESXi hosts and guest VMs without network traces.' },
    ],
    realWorldAdvisories: [
      'Mandiant Threat Intelligence: Cloaked and Covert — Uncovering UNC3886 Espionage Operations (CVE-2023-34048).',
      'VMware Security Advisory VMSA-2023-0023: vCenter Server Out-of-Bounds Write Vulnerability.',
      'CISA Known Exploited Vulnerabilities Catalog: CVE-2023-34048.',
    ],
    groundedSources: [
      { title: 'Mandiant — Uncovering UNC3886 Espionage Operations on VMware', uri: 'https://cloud.google.com/blog/topics/threat-intelligence/uncovering-unc3886-espionage-operations' },
      { title: 'VMware / Broadcom — VMSA-2023-0023 Security Advisory', uri: 'https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/23254' },
      { title: 'CISA KEV — CVE-2023-34048 VMware vCenter', uri: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
    ],
  },
  'barracuda-esg-cve-2023-2868-unc4841': {
    scenarioId: 'barracuda-esg-cve-2023-2868-unc4841',
    scenarioCode: 'CVE-2023-2868',
    scenarioName: 'Mandiant, CISA & Barracuda — UNC4841: Barracuda ESG .tar Command Injection & SALTWATER/SUBMARINE Implants',
    summary:
      'Investigated by Mandiant, CISA/FBI (MAR-10454006), and Barracuda Networks, UNC4841 exploited CVE-2023-2868 by sending emails with crafted .tar attachments whose member filenames contained shell metacharacters (`\'|...`) passed to Perl qx{}, deploying SALTWATER, SEASPY, and the SUBMARINE SQLite trigger backdoor.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Mandiant attributed the campaign to UNC4841 and reverse-engineered the .tar Perl qx{} injection, SALTWATER (bsmtp), and SEASPY (libpcap); CISA MAR-10454006 dissected the SUBMARINE implant hidden inside /mail/config/config.db SQLite Triggers; and Barracuda mandated full hardware replacement.',
    cves: [
      { id: 'CVE-2023-2868', cvss: '9.8 CRITICAL', status: 'CISA KEV · Hardware Replacement Mandated', description: 'Remote command injection vulnerability in Barracuda Email Security Gateway (ESG) .tar attachment scanner.' },
    ],
    actorGroups: [
      { name: 'UNC4841 (China-Nexus Espionage Operator)', aliases: 'Barracuda ESG Zero-Day Actors', targetSectors: 'Government, Ministries of Foreign Affairs, Defense, Telecommunications', notableCampaign: 'Global zero-day compromise of Barracuda ESG appliances deploying SALTWATER, SEASPY, WHIRLPOOL, and SUBMARINE.' },
      { name: 'SEASPY / SUBMARINE Appliance Implant Developers', aliases: 'Linux Edge Mail Gateway Persistence Team', targetSectors: 'Enterprise Email Security Appliances', notableCampaign: 'Rapidly evolved persistence from bsmtp hooking (SALTWATER) to SQLite database triggers (SUBMARINE) to survive vendor remediation scripts.' },
    ],
    realWorldAdvisories: [
      'Mandiant: Barracuda ESG Zero-Day Vulnerability (CVE-2023-2868) Exploited Globally by UNC4841.',
      'CISA & FBI MAR-10454006: Malware Analysis Reports on SUBMARINE, SALTWATER, and SEASPY.',
      'Barracuda Networks Trust Center: ESG Vulnerability CVE-2023-2868 Hardware Replacement Notice.',
    ],
    groundedSources: [
      { title: 'Mandiant — UNC4841 Barracuda ESG Zero-Day Analysis', uri: 'https://cloud.google.com/blog/topics/threat-intelligence/barracuda-esg-exploited-globally' },
      { title: 'CISA Alert — SUBMARINE Malware Analysis Report (MAR-10454006)', uri: 'https://www.cisa.gov/news-events/alerts/2023/07/28/cisa-releases-malware-analysis-report-submarine-malware-used-barracuda-esg-exploit' },
      { title: 'Barracuda Networks — CVE-2023-2868 Security Incident Notice', uri: 'https://www.barracuda.com/company/legal/esg-vulnerability' },
    ],
  },
  'cisco-ios-xe-cve-2023-20198-badimplant': {
    scenarioId: 'cisco-ios-xe-cve-2023-20198-badimplant',
    scenarioCode: 'CVE-2023-20198',
    scenarioName: 'Cisco Talos, VulnCheck & CISA — Cisco IOS XE Web UI Double URL-Encode Bypass & BadCandy Lua Implant',
    summary:
      'Disclosed by Cisco Talos, VulnCheck, and CISA, attackers chained CVE-2023-20198 (NGINX /%2577ebui_wsma_http double URL-encoding bypass creating a privilege-15 user) with CVE-2023-20273 (installAdd Linux root injection) across 40,000+ Cisco IOS XE devices to load the in-memory BadCandy NGINX Lua webshell.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Cisco Talos discovered the active zero-day chain and analyzed the BadCandy Lua implant in /usr/binos/conf/nginx-conf/cisco_service.conf; VulnCheck reverse-engineered the NGINX /%2577ebui_wsma_http double URL-encode bypass; and CISA & Shadowserver tracked the patched BadCandy variant hiding behind Authorization headers.',
    cves: [
      { id: 'CVE-2023-20198', cvss: '10.0 CRITICAL', status: 'CISA KEV · 40,000+ Devices Compromised', description: 'Authentication bypass in Cisco IOS XE Web UI allowing unauthenticated creation of a privilege-15 administrator account.' },
      { id: 'CVE-2023-20273', cvss: '7.2 HIGH', status: 'CISA KEV · IOS XE Root Command Injection', description: 'Command injection in Cisco IOS XE Web UI installAdd feature allowing elevation to Linux root.' },
    ],
    actorGroups: [
      { name: 'Unknown Sophisticated Network Infrastructure Actor', aliases: 'BadCandy Operators', targetSectors: 'Telecommunications, ISP Backbone, Enterprise Routing & Switching', notableCampaign: 'Compromised over 40,000 internet-facing Cisco IOS XE devices and deployed the non-persistent BadCandy Lua implant.' },
      { name: 'Secondary BadCandy Mutation Operators', aliases: 'IOS XE Web UI Exploiters', targetSectors: 'Enterprise Branch & Wan Routers (ASR / ISR / Catalyst)', notableCampaign: 'Updated the BadCandy Lua implant in-the-wild to require a secret HTTP Authorization header, concealing infected routers from defenders.' },
    ],
    realWorldAdvisories: [
      'Cisco Talos: Active Exploitation of Cisco IOS XE Software Web Management User Interface.',
      'VulnCheck: Cisco IOS XE CVE-2023-20198 /%2577ebui_wsma_http Technical Analysis.',
      'Cisco PSIRT & CISA: cisco-sa-iosxe-webui-privesc-j22SaA4z Security Advisory.',
    ],
    groundedSources: [
      { title: 'Cisco Talos — Active Exploitation of Cisco IOS XE Web UI', uri: 'https://blog.talosintelligence.com/active-exploitation-of-cisco-ios-xe-software/' },
      { title: 'VulnCheck — Cisco IOS XE CVE-2023-20198 Technical Deep Dive', uri: 'https://vulncheck.com/blog/cisco-ios-xe' },
      { title: 'Cisco PSIRT — CVE-2023-20198 & CVE-2023-20273 Advisory', uri: 'https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-iosxe-webui-privesc-j22SaA4z' },
    ],
  },
  'zyxel-firewall-cve-2023-28771-ike-rce': {
    scenarioId: 'zyxel-firewall-cve-2023-28771-ike-rce',
    scenarioCode: 'CVE-2023-28771',
    scenarioName: 'TRAPA Security, Rapid7 & CISA — Zyxel Firewall UDP/500 IKEv2 Notify Packet Pre-Auth Root RCE',
    summary:
      'Discovered by TRAPA Security and analyzed by Rapid7 and CISA, CVE-2023-28771 (CVSS 9.8) is an unauthenticated OS command injection vulnerability in Zyxel firewalls on UDP port 500 where sshipsecpm decrypts an IKEv2 Notify Type 14 payload with a hardcoded 3DES key and passes it to system("echo ... >> /tmp/sdwan_vpndebug.log").',
    multiSourceSynthesis:
      'Cross-vendor synthesis: TRAPA Security reverse-engineered sshipsecpm’s ike_decoder_notification() function and extracted the hardcoded 24-byte 3DES key; Rapid7 published the weaponized UDP/500 packet layout ("HAXBHAXBHAXB") and Suricata rules; and Zyxel PSIRT & CISA KEV tracked active exploitation.',
    cves: [
      { id: 'CVE-2023-28771', cvss: '9.8 CRITICAL', status: 'CISA KEV · Unauthenticated WAN UDP/500 RCE', description: 'Improper error message handling in Zyxel ZyWALL/ATP/USG FLEX IKEv2 packet decoder allows unauthenticated root OS command injection.' },
    ],
    actorGroups: [
      { name: 'Ransomware Initial Access Brokers & Mirai/Gafgyt Operators', aliases: 'Perimeter Firewall Exploit Clusters', targetSectors: 'Small/Medium Enterprise WAN Perimeters, Branch Offices, MSPs', notableCampaign: 'Exploited UDP/500 on exposed Zyxel VPN firewalls to gain root shell access and pivot into internal LANs.' },
      { name: 'Shadowserver Tracked UDP/500 Exploitation Wave', aliases: 'IKEv2 Command Injection Scanners', targetSectors: 'Zyxel ATP, USG FLEX, VPN, and ZyWALL Appliances', notableCampaign: 'Mass exploitation across tens of thousands of exposed UDP/500 endpoints starting May 2023.' },
    ],
    realWorldAdvisories: [
      'TRAPA Security: Root Cause Analysis of Zyxel Firewall CVE-2023-28771.',
      'Rapid7 AttackerKB: Zyxel CVE-2023-28771 Technical Analysis & Suricata Signatures.',
      'Zyxel PSIRT & CISA KEV: Advisory for Remote Command Injection Vulnerability of Firewalls.',
    ],
    groundedSources: [
      { title: 'TRAPA Security — CVE-2023-28771 Root Cause Analysis', uri: 'https://trapa.security/blog/cve-2023-28771/' },
      { title: 'Rapid7 AttackerKB — CVE-2023-28771 Technical Analysis', uri: 'https://attackerkb.com/topics/N3i8dxpFKS/cve-2023-28771/rapid7-analysis' },
      { title: 'Zyxel Security Advisory — CVE-2023-28771', uri: 'https://www.zyxel.com/global/en/support/security-advisories/zyxel-security-advisory-for-remote-command-injection-vulnerability-of-firewalls' },
    ],
  },
  'juniper-junos-jweb-cve-2023-36845-chain': {
    scenarioId: 'juniper-junos-jweb-cve-2023-36845-chain',
    scenarioCode: 'CVE-2023-36845',
    scenarioName: 'watchTowr, VulnCheck & CISA — Juniper Junos OS J-Web PHPRC=/dev/fd/0 Fileless Pre-Auth RCE',
    summary:
      'Discovered by watchTowr Labs and weaponized into a single-request fileless exploit by VulnCheck, CVE-2023-36845 allows unauthenticated attackers to pass ?PHPRC=/dev/fd/0 to /webauth_operation.php on Juniper SRX and EX devices so php-cgi parses the HTTP POST body as php.ini and executes auto_prepend_file="data://text/plain;base64,...".',
    multiSourceSynthesis:
      'Cross-vendor synthesis: watchTowr Labs discovered how Appweb CGI populates process environment variables (PHPRC) from HTTP query strings; VulnCheck demonstrated the single-request fileless exploit using PHPRC=/dev/fd/0 + data:// stream wrappers; and Juniper SIRT (JSA72300) & CISA KEV documented in-the-wild exploitation.',
    cves: [
      { id: 'CVE-2023-36845', cvss: '9.8 CRITICAL (Chained / Fileless)', status: 'CISA KEV · Fileless Pre-Auth RCE', description: 'PHP environment variable manipulation (PHPRC) in Juniper Junos OS J-Web allowing arbitrary PHP configuration injection and RCE.' },
      { id: 'CVE-2023-36846', cvss: '5.3 MEDIUM', status: 'CISA KEV · J-Web Auth Bypass Upload', description: 'Missing authentication for critical function in J-Web do_upload.' },
    ],
    actorGroups: [
      { name: 'Perimeter Network Device Espionage & Botnet Actors', aliases: 'J-Web Exploitation Clusters', targetSectors: 'Enterprise Firewalls (SRX Series), Campus Switches (EX Series), Telecom', notableCampaign: 'Exploited /webauth_operation.php?PHPRC=/dev/fd/0 across internet-facing Juniper SRX firewalls.' },
      { name: 'GreyNoise & Shadowserver Tracked J-Web Scanners', aliases: 'Fileless PHP CGI Exploiters', targetSectors: 'Internet-Exposed Junos OS Management Interfaces', notableCampaign: 'Adopted VulnCheck’s single-request PHPRC=/dev/fd/0 technique within days of publication in August 2023.' },
    ],
    realWorldAdvisories: [
      'watchTowr Labs: CVEs-2023-36844 to 36847 — RCE in Juniper Firewalls.',
      'VulnCheck: Single-Request Fileless RCE on Juniper J-Web via PHPRC=/dev/fd/0 (CVE-2023-36845).',
      'Juniper SIRT Out-of-Cycle Security Bulletin JSA72300 & CISA KEV.',
    ],
    groundedSources: [
      { title: 'watchTowr Labs — Juniper SRX/EX Pre-Auth RCE Research', uri: 'https://labs.watchtowr.com/cve-2023-36844-and-friends-rce-in-juniper-firewalls/' },
      { title: 'VulnCheck — Fileless Juniper CVE-2023-36845 via PHPRC=/dev/fd/0', uri: 'https://vulncheck.com/blog/juniper-cve-2023-36845' },
      { title: 'Juniper SIRT — JSA72300 Out-of-Cycle Security Bulletin', uri: 'https://supportportal.juniper.net/s/article/2023-08-Out-of-Cycle-Security-Bulletin-Junos-OS-SRX-Series-and-EX-Series-Multiple-vulnerabilities-in-J-Web-can-be-combined-to-allow-a-preAuth-Remote-Code-Execution' },
    ],
  },
  'atlassian-confluence-cve-2023-22515-storm0062': {
    scenarioId: 'atlassian-confluence-cve-2023-22515-storm0062',
    scenarioCode: 'CVE-2023-22515',
    scenarioName: 'Microsoft, Rapid7 & CISA — Storm-0062: Atlassian Confluence XWork OGNL Setup Reset & OSGi Webshell',
    summary:
      'Exploited as a zero-day by Storm-0062 (DarkShadow) and analyzed by Microsoft, Rapid7, and CISA (AA23-289A), CVE-2023-22515 (CVSS 10.0) allows unauthenticated attackers to pass bootstrapStatusProvider.applicationConfig.setupComplete=false to /server-info.action, unlock /setup/setupadministrator.action to create a rogue admin, and upload an OSGi webshell.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Rapid7 reverse-engineered the XWork getter-chaining on ServerInfoAction; Microsoft Threat Intelligence attributed the zero-day campaign to Storm-0062 (DarkShadow); and CISA AA23-289A published the full conf_access_log and OSGi plugin detection playbook.',
    cves: [
      { id: 'CVE-2023-22515', cvss: '10.0 CRITICAL', status: 'CISA KEV · Storm-0062 Zero-Day', description: 'Broken Access Control / XWork parameter injection in Atlassian Confluence Data Center and Server (8.0.0–8.5.1).' },
    ],
    actorGroups: [
      { name: 'Storm-0062 (DarkShadow)', aliases: 'Nation-State Collaboration Software Intrusion Group', targetSectors: 'Enterprise Knowledge Bases, Software Engineering, Government, Defense', notableCampaign: 'Exploited CVE-2023-22515 as a zero-day since September 2023 to provision rogue Confluence admins and deploy OSGi webshells.' },
      { name: 'Cerber2021 / Ransomware Post-Disclosure Affiliates', aliases: 'Confluence Mass Exploiters', targetSectors: 'Public-Facing Atlassian Confluence Data Center Instances', notableCampaign: 'Automated setupComplete=false exploitation after public disclosure to deploy Linux and Windows ransomware.' },
    ],
    realWorldAdvisories: [
      'CISA, FBI & MS-ISAC Joint Advisory AA23-289A: Threat Actors Exploit Atlassian Confluence CVE-2023-22515.',
      'Rapid7 AttackerKB: Atlassian Confluence CVE-2023-22515 Technical Analysis.',
      'Atlassian & Microsoft Threat Intelligence: CVE-2023-22515 Security Advisory.',
    ],
    groundedSources: [
      { title: 'CISA Joint Advisory AA23-289A — Confluence CVE-2023-22515', uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-289a' },
      { title: 'Rapid7 AttackerKB — CVE-2023-22515 XWork Analysis', uri: 'https://attackerkb.com/topics/Q5f0ItSzw5/cve-2023-22515/rapid7-analysis' },
      { title: 'Atlassian Security Advisory — CVE-2023-22515', uri: 'https://confluence.atlassian.com/security/cve-2023-22515-broken-access-control-vulnerability-in-confluence-data-center-and-server-1295682276.html' },
    ],
  },
  'apache-activemq-cve-2023-46604-openwire': {
    scenarioId: 'apache-activemq-cve-2023-46604-openwire',
    scenarioCode: 'CVE-2023-46604',
    scenarioName: 'Rapid7, Huntress & Trend Micro — Apache ActiveMQ OpenWire ExceptionResponse Deserialization RCE',
    summary:
      'Analyzed by Rapid7, Huntress, and Trend Micro, CVE-2023-46604 (CVSS 10.0) allows an unauthenticated attacker on TCP port 61616 to send an OpenWire ExceptionResponse (0x1F) frame that forces BaseDataStreamMarshaller.createThrowable() to instantiate ClassPathXmlApplicationContext with a remote Spring XML URL.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Rapid7 dissected the OpenWire 0x1F frame and createThrowable() reflection; Huntress captured data/activemq.log XML URL load lines and HelloKitty ransomware process trees; and Trend Micro & CISA KEV documented LockBit and Kinsing exploitation.',
    cves: [
      { id: 'CVE-2023-46604', cvss: '10.0 CRITICAL', status: 'CISA KEV · Widespread Ransomware Exploitation', description: 'Unauthenticated arbitrary class instantiation in Apache ActiveMQ OpenWire protocol marshaller.' },
    ],
    actorGroups: [
      { name: 'HelloKitty / TellYouThePass & LockBit Ransomware Affiliates', aliases: 'Gootloader Ransomware Affiliates', targetSectors: 'Enterprise Message Brokers, Cloud Microservices, Financial & Retail Backends', notableCampaign: 'Exploited TCP/61616 OpenWire brokers to load remote Spring XML ProcessBuilder beans deploying msiexec payloads.' },
      { name: 'Kinsing (H2Miner) Linux Cloud Threat Group', aliases: 'MoneyLibrarian, Gadolinium', targetSectors: 'Linux Container & Cloud ActiveMQ Deployments', notableCampaign: 'Deployed Kinsing Golang cryptominers and LD_PRELOAD rootkits via CVE-2023-46604.' },
    ],
    realWorldAdvisories: [
      'Rapid7: Suspected Ransomware Activity Targeting Apache ActiveMQ (CVE-2023-46604).',
      'Huntress Labs: Active Exploitation of Apache ActiveMQ CVE-2023-46604 in the Wild.',
      'Apache Software Foundation & CISA KEV: CVE-2023-46604 Security Advisory.',
    ],
    groundedSources: [
      { title: 'Rapid7 — Apache ActiveMQ CVE-2023-46604 Analysis', uri: 'https://www.rapid7.com/blog/post/2023/11/01/etr-suspected-ransomware-activity-targeting-apache-activemq-cve-2023-46604/' },
      { title: 'Huntress — Active Exploitation of Apache ActiveMQ CVE-2023-46604', uri: 'https://www.huntress.com/blog/active-exploitation-of-apache-activemq-cve-2023-46604' },
      { title: 'Apache ActiveMQ — CVE-2023-46604 Security Announcement', uri: 'https://activemq.apache.org/security-advisories.data/CVE-2023-46604-announcement.txt' },
    ],
  },
  'papercut-ng-cve-2023-27350-bl00dy': {
    scenarioId: 'papercut-ng-cve-2023-27350-bl00dy',
    scenarioCode: 'CVE-2023-27350',
    scenarioName: 'Horizon3.ai, CISA & Microsoft — PaperCut MF/NG SetupCompleted Auth Bypass & Rhino JS SYSTEM RCE',
    summary:
      'Documented by Horizon3.ai, CISA/FBI (AA23-131A), and Microsoft Threat Intelligence, CVE-2023-27350 (CVSS 9.8) lets an unauthenticated attacker invoke SetupCompleted.formSubmit() (/app?service=page/SetupCompleted) to mint an Admin session, disable the Rhino JS sandbox (print.script.sandboxed=N), and run SYSTEM commands inside pc-app.exe.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Horizon3.ai decompiled SetupCompleted.class and demonstrated the Rhino JavaScript Runtime.getRuntime().exec() chain; CISA AA23-131A documented Bl00dy Ransomware Gang intrusions and pc-app.exe child-process rules; and Microsoft attributed concurrent attacks to Cl0p and LockBit.',
    cves: [
      { id: 'CVE-2023-27350', cvss: '9.8 CRITICAL', status: 'CISA KEV · Bl00dy & Cl0p Exploitation', description: 'Improper access control in PaperCut MF/NG SetupCompleted page allowing unauthenticated session hijacking and SYSTEM RCE.' },
    ],
    actorGroups: [
      { name: 'Bl00dy Ransomware Gang, Cl0p (Lace Tempest) & LockBit', aliases: 'Education & Enterprise Print Server Exploiters', targetSectors: 'Education (K-12 & Universities), Healthcare, Government, Enterprise Print Servers', notableCampaign: 'Exploited /app?service=page/SetupCompleted to spawn SYSTEM PowerShell shells from pc-app.exe.' },
      { name: 'Mint Sandstorm (Charming Kitten / APT35) & Mango Sandstorm', aliases: 'Iranian State-Sponsored PaperCut Exploiters', targetSectors: 'Defense, Government, Think Tanks, Middle East & US Organizations', notableCampaign: 'Rapidly adopted CVE-2023-27350 within days of PoC publication for espionage footholds.' },
    ],
    realWorldAdvisories: [
      'CISA & FBI Joint Advisory AA23-131A: Malicious Actors Exploit CVE-2023-27350 in PaperCut MF and NG.',
      'Horizon3.ai: PaperCut CVE-2023-27350 Deep Dive and Indicators of Compromise.',
      'PaperCut Software Security Bulletin: PO-1216 and PO-1219 (CVE-2023-27350).',
    ],
    groundedSources: [
      { title: 'CISA Joint Advisory AA23-131A — PaperCut CVE-2023-27350', uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-131a' },
      { title: 'Horizon3.ai — PaperCut CVE-2023-27350 Technical Deep Dive', uri: 'https://www.horizon3.ai/attack-research/attack-blogs/papercut-cve-2023-27350-deep-dive-and-indicators-of-compromise/' },
      { title: 'PaperCut KB — CVE-2023-27350 Security Bulletin', uri: 'https://www.papercut.com/kb/Main/PO-1216-and-PO-1219' },
    ],
  },
  'macos-gatekeeper-achilles-cve-2022-42821': {
    scenarioId: 'macos-gatekeeper-achilles-cve-2022-42821',
    scenarioCode: 'CVE-2022-42821',
    scenarioName: 'Microsoft Threat Intel & Jamf — macOS Gatekeeper "Achilles" Bypass via AppleDouble Restrictive ACLs',
    summary:
      'Discovered by Microsoft Threat Intelligence (Jonathan Bar Or) and analyzed with Jamf Threat Labs, CVE-2022-42821 ("Achilles") uses an AppleDouble metadata file (._Update.app) containing a restrictive NFSv4 ACL (deny writeextattr) to block Safari from applying com.apple.quarantine, bypassing macOS Gatekeeper and Lockdown Mode.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft Threat Intelligence discovered the AppleDouble com.apple.acl.text deny writeextattr bypass of setxattr(com.apple.quarantine); Jamf Threat Labs provided Endpoint Security (ES_EVENT_TYPE_NOTIFY_EXEC) detections for unquarantined ~/Downloads execution; and Apple HT213532 patched quarantine propagation.',
    cves: [
      { id: 'CVE-2022-42821', cvss: '5.5 MEDIUM / CRITICAL GATEKEEPER BYPASS', status: 'Apple HT213532 · Gatekeeper & Lockdown Mode Bypass', description: 'Logic issue in macOS Gatekeeper where restrictive AppleDouble ACLs prevent com.apple.quarantine extended attribute creation.' },
    ],
    actorGroups: [
      { name: 'macOS Initial Access & InfoStealer Delivery Operators', aliases: 'Atomic Stealer (AMOS) & APT macOS Delivery Clusters', targetSectors: 'macOS Enterprise Endpoints, Software Developers, Cryptocurrency Users', notableCampaign: 'Used archive metadata manipulation to execute unsigned Mach-O binaries from ~/Downloads without Gatekeeper prompts.' },
      { name: 'Microsoft 365 Defender Research Team (Jonathan Bar Or)', aliases: 'macOS Vulnerability Research Unit', targetSectors: 'Apple macOS Monterey, Big Sur & Ventura Security Subsystems', notableCampaign: 'Discovered and responsibly disclosed CVE-2022-42821 ("Achilles") and CVE-2021-30657 (Shlayer Gatekeeper bypass).' },
    ],
    realWorldAdvisories: [
      'Microsoft Security Blog: Gatekeeper’s Achilles heel — Unearthing a macOS vulnerability (CVE-2022-42821).',
      'Jamf Threat Labs: Detecting macOS Gatekeeper Bypasses with Endpoint Security Framework.',
      'Apple Security Update HT213532: macOS Ventura 13.1, Monterey 12.6.2, and Big Sur 11.7.2.',
    ],
    groundedSources: [
      { title: 'Microsoft Security Blog — Gatekeeper Achilles (CVE-2022-42821)', uri: 'https://www.microsoft.com/en-us/security/blog/2022/12/19/gatekeepers-achilles-heel-unearthing-a-macos-vulnerability/' },
      { title: 'Apple Support HT213532 — macOS Ventura 13.1 Security Content', uri: 'https://support.apple.com/en-us/HT213532' },
      { title: 'NIST NVD — CVE-2022-42821 Detail', uri: 'https://nvd.nist.gov/vuln/detail/CVE-2022-42821' },
    ],
  },
  'windows-clfs-ransomware-cve-2023-28252-nokoyawa': {
    scenarioId: 'windows-clfs-ransomware-cve-2023-28252-nokoyawa',
    scenarioCode: 'CVE-2023-28252',
    scenarioName: 'Kaspersky GReAT & Microsoft — Windows CLFS.sys Kernel Zero-Day EoP & Nokoyawa Ransomware',
    summary:
      'Captured in the wild by Kaspersky GReAT and patched by Microsoft MSRC, CVE-2023-28252 is a Windows Common Log File System (CLFS.sys) kernel zero-day EoP vulnerability that corrupts CClfsBaseFilePersisted metadata in a .blf file and pivots through ClfsEarlierLsn to swap the process EPROCESS Token with SYSTEM and deploy Nokoyawa ransomware.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Kaspersky GReAT discovered the in-the-wild zero-day during Nokoyawa ransomware attacks and analyzed the .blf CRC32 forgery; Zscaler ThreatLabz dissected the CClfsBaseFilePersisted::WriteMetadataBlock OOB write and ClfsEarlierLsn vtable gadget; and Microsoft MSRC & CISA KEV issued the April 2023 patch.',
    cves: [
      { id: 'CVE-2023-28252', cvss: '7.8 HIGH / ZERO-DAY KERNEL EOP', status: 'CISA KEV · Nokoyawa Zero-Day', description: 'Windows Common Log File System (CLFS.sys) out-of-bounds write elevation of privilege vulnerability.' },
    ],
    actorGroups: [
      { name: 'Nokoyawa Ransomware Affiliates (Ex-Hive / Play Overlap)', aliases: 'CLFS Zero-Day Ransomware Group', targetSectors: 'Small & Medium Enterprises, Retail, Energy, Manufacturing, Healthcare', notableCampaign: 'Deployed multiple sequential custom CLFS.sys zero-days (including CVE-2023-28252) to escalate to SYSTEM and run Nokoyawa ransomware.' },
      { name: 'FIN11 / RansomVC Zero-Day Exploit Developers', aliases: 'Windows CLFS.sys Exploit Supplier', targetSectors: 'Windows Server 2016/2019/2022 Enterprise Hosts', notableCampaign: 'Developed at least five distinct CLFS.sys zero-day exploits between 2022 and 2023.' },
    ],
    realWorldAdvisories: [
      'Kaspersky GReAT (Securelist): Nokoyawa ransomware attacks use new Windows zero-day vulnerability in CLFS (CVE-2023-28252).',
      'Zscaler ThreatLabz: Technical Analysis of Windows CLFS Zero-Day Vulnerability CVE-2023-28252.',
      'Microsoft MSRC & CISA KEV: CVE-2023-28252 Windows CLFS Driver Advisory.',
    ],
    groundedSources: [
      { title: 'Kaspersky Securelist — Nokoyawa & CVE-2023-28252 Zero-Day Discovery', uri: 'https://securelist.com/nokoyawa-ransomware-attacks-use-zero-day/109483/' },
      { title: 'Zscaler ThreatLabz — CVE-2023-28252 CLFS Technical Analysis', uri: 'https://www.zscaler.com/blogs/security-research/technical-analysis-windows-clfs-zero-day-vulnerability-cve-2023-28252' },
      { title: 'Microsoft MSRC — CVE-2023-28252 Security Update Guide', uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-28252' },
    ],
  },
};
