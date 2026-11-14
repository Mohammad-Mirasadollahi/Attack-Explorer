import { AttackScenario, MITRE_PHASES } from './scenarios/types';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import { BATCH_1_TO_4_CURATED_INTEL } from './batch1-to-4-attributions-and-intel';

export interface MitreTacticFrequencyItem {
  phase: number;
  shortName: string;
  fullName: string;
  scenarioStageCount: number;
  scenarioTelemetryCount: number;
  libraryTotalCount: number;
  techniques: string[];
  isPrimaryScenarioPhase: boolean;
  fillHex: string;
}

export interface GroundedSourceLink {
  title: string;
  uri: string;
}

export interface ThreatIntelContextData {
  scenarioId: string;
  scenarioCode: string;
  scenarioName: string;
  summary: string;
  /** Explains how multiple independent security vendor/CERT reports complement one another for this scenario */
  multiSourceSynthesis: string;
  cves: Array<{
    id: string;
    cvss: string;
    status: string;
    description: string;
  }>;
  actorGroups: Array<{
    name: string;
    aliases: string;
    targetSectors: string;
    notableCampaign: string;
  }>;
  realWorldAdvisories: string[];
  groundedSources: GroundedSourceLink[];
  sourceMode: 'LIVE_SEARCH_GROUNDING' | 'CURATED_INTELLIGENCE_CACHE';
  fetchedAt: string;
}

const TACTIC_PHASE_COLORS: Record<number, string> = {
  1: '#D97706', // Initial Access - Amber
  2: '#E11D48', // Execution - Crimson
  3: '#9333EA', // Persistence - Purple
  4: '#4F46E5', // Defense Evasion - Indigo
  5: '#0284C7', // Credential Access - Sky
  6: '#0D9488', // Lateral & C2 - Teal
  7: '#DC2626', // Exfil & Impact - Red
};

/**
 * Computes MITRE ATT&CK Tactic frequency coverage for the selected scenario
 * (and across the scenario library) to power the Recharts MitreStats component.
 */
export function computeMitreTacticFrequency(
  scenario: AttackScenario,
  allScenarios: AttackScenario[] = ATTACK_SCENARIOS
): MitreTacticFrequencyItem[] {
  return MITRE_PHASES.map((mp) => {
    const matchingStages = scenario.stages.filter(
      (st) => st.mitreTacticPhase === mp.phase
    );
    const stageIndices = new Set(matchingStages.map((s) => s.index));
    const matchingTelemetry = scenario.telemetry.filter((t) =>
      stageIndices.has(t.stageIndex)
    );

    const techniquesSet = new Set<string>();
    matchingStages.forEach((st) => {
      if (st.mitreTechniqueId) {
        techniquesSet.add(st.mitreTechniqueId);
      }
    });
    matchingTelemetry.forEach((t) => {
      if (t.mitreId) {
        techniquesSet.add(t.mitreId);
      }
    });

    let libraryTotalCount = 0;
    for (const sc of allScenarios) {
      libraryTotalCount += sc.stages.filter(
        (st) => st.mitreTacticPhase === mp.phase
      ).length;
    }

    const isPrimaryScenarioPhase = scenario.primaryMitrePhase === mp.phase;

    return {
      phase: mp.phase,
      shortName: mp.shortName,
      fullName: mp.fullName,
      scenarioStageCount: matchingStages.length,
      scenarioTelemetryCount: matchingTelemetry.length,
      libraryTotalCount,
      techniques: Array.from(techniquesSet),
      isPrimaryScenarioPhase,
      fillHex:
        matchingStages.length > 0
          ? isPrimaryScenarioPhase
            ? '#E11D48'
            : TACTIC_PHASE_COLORS[mp.phase] || '#4F46E5'
          : '#94A3B8',
    };
  });
}

const CURATED_THREAT_INTEL: Record<
  string,
  Omit<ThreatIntelContextData, 'sourceMode' | 'fetchedAt'>
> = {
  'process-hollowing': {
    scenarioId: 'process-hollowing',
    scenarioCode: 'T1055.012',
    scenarioName: 'Process Hollowing (svchost.exe Replacement)',
    summary:
      'Process Hollowing (MITRE T1055.012) remains a premier defense-evasion technique used by banking trojans, state-sponsored loaders, and ransomware initial-access brokers to masquerade malicious code inside suspended Windows system binaries such as svchost.exe, RuntimeBroker.exe, or werfault.exe.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft Win32 docs define the CREATE_SUSPENDED (0x4), NtUnmapViewOfSection, and SetThreadContext (RCX) mechanics; Elastic Security Labs details unbacked PAGE_EXECUTE_READWRITE (0x40) VAD detection via kernel EtwTiLogAllocVMRemote; and Microsoft Sysinternals documents Sysmon EventID 25 (ProcessTampering).',
    cves: [
      {
        id: 'CVE-2023-36884',
        cvss: '8.8 HIGH',
        status: 'CISA KEV · Exploited in Wild',
        description:
          'Microsoft Office & Windows HTML RCE chain delivering SmokeLoader / RomCom payloads that hollow legitimate Windows system processes.',
      },
      {
        id: 'CVE-2024-21412',
        cvss: '8.1 HIGH',
        status: 'CISA KEV · SmartScreen Bypass',
        description:
          'Internet Shortcut (.url) SmartScreen bypass used by DarkGate and Lumma Stealer loaders prior to NtUnmapViewOfSection process hollowing.',
      },
    ],
    actorGroups: [
      {
        name: 'APT29 (Midnight Blizzard)',
        aliases: 'Cozy Bear, NOBELIUM',
        targetSectors: 'Government, Diplomatic, Think Tanks, Cloud Providers',
        notableCampaign:
          'Uses custom native loaders that spawn suspended system processes and unmap image sections to evade user-mode hooks.',
      },
      {
        name: 'TA551 (Shathak) & QakBot Affiliates',
        aliases: 'Gold Cabin',
        targetSectors: 'Financial Services, Manufacturing, Legal',
        notableCampaign:
          'Phishing ZIP/ISO chains spawning wscript.exe -> dropper.exe -> hollowed svchost.exe (Sysmon EID 25) for C2 beacon persistence.',
      },
    ],
    realWorldAdvisories: [
      'CISA AA23-242A: QakBot Infrastructure Disrupted — details svchost.exe / wermgr.exe process hollowing chains.',
      'Microsoft Defender Threat Intelligence: Detecting NtUnmapViewOfSection & PAGE_EXECUTE_READWRITE anomalies via ETW Ti.',
      'Elastic Security Labs: Hunting Unbacked RWX VAD Regions & Process Tampering (Sysmon EID 25).',
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1055.012 — Process Injection: Process Hollowing',
        uri: 'https://attack.mitre.org/techniques/T1055/012/',
      },
      {
        title: 'Microsoft Sysinternals — Sysmon Event ID 25 (ProcessTampering)',
        uri: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-25-processtampering',
      },
      {
        title: 'Elastic Security Labs — Memory Injection & ETW Threat Research',
        uri: 'https://www.elastic.co/security-labs',
      },
    ],
  },
  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    scenarioCode: 'T1190 / CVE-2021-44228',
    scenarioName: 'Log4Shell JNDI Injection & Post-Exploitation',
    summary:
      'Apache Log4j2 JNDI lookup injection (CVE-2021-44228) enables unauthenticated remote code execution when untrusted HTTP headers or parameters containing ${jndi:ldap://...} strings are logged by vulnerable JVM services.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Apache Foundation & NIST NVD define the MessagePatternConverter JNDI lookup flaw; Swiss GOVCERT.ch & LunaSec dissect the LDAP JavaNamingReference (javaCodeBase + javaFactory) and URLClassLoader remote bytecode execution; and CISA ED 22-02 correlates Nginx HTTP logs, Zeek LDAP flows, and Linux auditd execve events.',
    cves: [
      {
        id: 'CVE-2021-44228',
        cvss: '10.0 CRITICAL',
        status: 'CISA KEV · Active Exploitation',
        description:
          'Apache Log4j2 JNDI features do not protect against attacker-controlled LDAP and RMI directory endpoints, allowing remote class loading.',
      },
      {
        id: 'CVE-2021-45046',
        cvss: '9.0 CRITICAL',
        status: 'CISA KEV · Bypass Patch',
        description:
          'Incomplete fix in Log4j 2.15.0 allowing Thread Context Map (MDC) input data to trigger JNDI lookup RCE.',
      },
    ],
    actorGroups: [
      {
        name: 'APT41 (Winnti / Barium)',
        aliases: 'Wicked Panda, Brass Typhoon',
        targetSectors: 'Telecommunications, Healthcare, Technology, Gaming',
        notableCampaign:
          'Exploited public-facing VMware Horizon and Spring Boot servers within hours of disclosure to deploy stealthy Linux backdoors.',
      },
      {
        name: 'Lazarus Group (Aquatic Panda / MuddyWater)',
        aliases: 'HIDDEN COBRA, Seedworm',
        targetSectors: 'Financial, Defense, Energy, Critical Infrastructure',
        notableCampaign:
          'Targeted unpatched enterprise Java appliances with LDAP/RMI JNDI callbacks to establish reverse bash shells and lateral tunnels.',
      },
    ],
    realWorldAdvisories: [
      'CISA Alert AA22-174A: Iranian Government-Sponsored Actors Exploit Log4Shell in VMware Horizon Systems.',
      'NSA & CISA Joint Guidance: Mitigating Log4Shell and Other Log4j-Related Vulnerabilities.',
      'Swiss NCSC / GOVCERT.ch: Technical Anatomy of Log4Shell JNDI Remote Class Loading.',
    ],
    groundedSources: [
      {
        title: 'NVD — CVE-2021-44228 Detail (Apache Log4j2)',
        uri: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
      },
      {
        title: 'CISA Apache Log4j Vulnerability Guidance',
        uri: 'https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance',
      },
      {
        title: 'Swiss NCSC / GOVCERT.ch — Log4j Zero-Day Technical Analysis',
        uri: 'https://www.ncsc.admin.ch/ncsc/en/home/aktuell/im-fokus/log4j.html',
      },
    ],
  },
  'amsi-reflective-dll': {
    scenarioId: 'amsi-reflective-dll',
    scenarioCode: 'T1562.001 / T1620',
    scenarioName: 'In-Memory AMSI Bypass & Reflective DLL Loading',
    summary:
      'Fileless PowerShell and CLR post-exploitation frameworks routinely patch amsi.dll!AmsiScanBuffer in virtual memory before invoking [System.Reflection.Assembly]::Load() or reflective PE loaders so payloads never touch NTFS disk.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft Learn defines how amsi.dll!AmsiScanBuffer bridges PowerShell to Windows Defender; MDSec & MITRE T1562.001/T1620 dissect the 6-byte VirtualProtect prologue patch (mov eax, 0x80070057; ret) and in-memory CLR reflection; and Microsoft PowerShell Team documents pre-patch EventID 4104 and kernel EtwTiLogProtectVM detections.',
    cves: [
      {
        id: 'CVE-2023-23397',
        cvss: '9.8 CRITICAL',
        status: 'CISA KEV · Privilege / Relay',
        description:
          'Frequently paired with fileless PowerShell reflective stages to harvest credentials and load in-memory C2 implants without disk artifacts.',
      },
      {
        id: 'CVE-2024-21351',
        cvss: '7.6 HIGH',
        status: 'CISA KEV · Windows SmartScreen',
        description:
          'Security feature bypass enabling initial script execution that immediately patches AMSI and ETW in user-mode memory.',
      },
    ],
    actorGroups: [
      {
        name: 'APT28 (Fancy Bear / Forest Blizzard)',
        aliases: 'STRONTIUM, Sofacy, Pawn Storm',
        targetSectors: 'Defense, Aerospace, Government Ministries, NATO',
        notableCampaign:
          'Deploys fileless PowerShell stagers that overwrite AmsiScanBuffer with 0x80070057 (E_INVALIDARG) before loading reflective C# implants.',
      },
      {
        name: 'FIN7 (Carbanak / Sangria Tempest)',
        aliases: 'Carbon Spider, ELBRUS',
        targetSectors: 'Retail, Hospitality, Financial, Point-of-Sale',
        notableCampaign:
          'Uses POWERTRASH and reflective Cobalt Strike / Brute Ratel badgers residing strictly in unbacked RWX heap regions.',
      },
    ],
    realWorldAdvisories: [
      'MITRE ATT&CK T1562.001: Impair Defenses — Disable or Modify Tools (AMSI & ETW Patching).',
      'MITRE ATT&CK T1620: Reflective Code Loading in CLR & Native Process Heaps.',
      'Microsoft PowerShell Team: Detecting Memory Patching via Script Block Logging (EventID 4104) & ETW.',
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1620 — Reflective Code Loading',
        uri: 'https://attack.mitre.org/techniques/T1620/',
      },
      {
        title: 'MITRE ATT&CK T1562.001 — Impair Defenses',
        uri: 'https://attack.mitre.org/techniques/T1562/001/',
      },
      {
        title: 'Microsoft Learn — Antimalware Scan Interface (AMSI) Architecture',
        uri: 'https://learn.microsoft.com/en-us/windows/win32/amsi/antimalware-scan-interface-portal',
      },
    ],
  },
  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    scenarioCode: 'T1558.003 / T1550.002',
    scenarioName: 'Active Directory Kerberoasting & Pass-the-Hash Lateral Movement',
    summary:
      'Kerberoasting abuses the Kerberos Ticket Granting Service (TGS-REQ) by requesting RC4-HMAC (0x17) encrypted service tickets for Active Directory accounts with registered SPNs, cracking them offline to escalate privileges and move laterally.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: SpecterOps & MITRE T1558.003 explain LDAP SPN discovery and why requesting RC4-HMAC (0x17) forces the KDC to encrypt TGS tickets with the service account’s NTLM hash; Microsoft Auditing defines EventID 4769 (0x17) and EventID 4624 (LogonType 3); and NSA/CISA guidance mandates AES256-only and gMSA accounts.',
    cves: [
      {
        id: 'CVE-2022-33679',
        cvss: '9.8 CRITICAL',
        status: 'Windows Kerberos RC4 Downgrade',
        description:
          'Windows Kerberos elevation of privilege vulnerability involving RC4-MD4 encryption negotiation downgrade.',
      },
      {
        id: 'CVE-2021-42287 / CVE-2021-42278',
        cvss: '8.8 HIGH',
        status: 'CISA KEV · sAMAccountName / NoPac',
        description:
          'Active Directory Kerberos ticket manipulation frequently chained with SPN enumeration and KDC ticket harvesting.',
      },
    ],
    actorGroups: [
      {
        name: 'Volt Typhoon & Scattered Spider (UNC3944)',
        aliases: 'Bronze Silhouette, Octo Tempest',
        targetSectors: 'Critical Infrastructure, Telecom, Identity Providers',
        notableCampaign:
          'Enumerates high-privilege SQL and Exchange SPNs via LDAP, extracts RC4 TGS tickets (EID 4769), and pivots to Tier-0 Domain Controllers.',
      },
      {
        name: 'Wizard Spider (Conti / Ryuk / BlackBasta)',
        aliases: 'UNC1878, Grim Spider',
        targetSectors: 'Healthcare, Enterprise Corporate Networks, Municipal',
        notableCampaign:
          'Executes Rubeus.exe in-memory to request 0x17 tickets, cracks service passwords offline, and uses SMB Pass-the-Hash for domain dominance.',
      },
    ],
    realWorldAdvisories: [
      'NSA & CISA Advisory: Active Directory Security — Mitigating Kerberoasting (Enforce AES256 & gMSA 25+ char passwords).',
      'Microsoft Security Guidance: Monitoring Event ID 4769 with TicketEncryptionType 0x17.',
      'MITRE ATT&CK T1558.003 & T1550.002: Offline Hashcat 13100 Cracking & NTLM Pass-the-Hash.',
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1558.003 — Steal or Forge Kerberos Tickets: Kerberoasting',
        uri: 'https://attack.mitre.org/techniques/T1558/003/',
      },
      {
        title: 'MITRE ATT&CK T1550.002 — Use Alternate Authentication Material: Pass the Hash',
        uri: 'https://attack.mitre.org/techniques/T1550/002/',
      },
      {
        title: 'Microsoft Security Auditing — Event ID 4769 (Kerberos Service Ticket Requested)',
        uri: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769',
      },
    ],
  },
  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    scenarioCode: 'T1071.004 / T1048.003',
    scenarioName: 'Covert DNS Tunneling Data Exfiltration & C2',
    summary:
      'DNS Tunneling encapsulates sensitive data chunks and C2 commands inside high-entropy Base32/Hex subdomain labels over UDP port 53, bypassing perimeter firewalls that block direct outbound HTTP/S traffic by abusing recursive corporate DNS resolvers.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: IETF RFC 1035 specifies the 63-byte label and 253-byte FQDN protocol boundaries; Palo Alto Unit 42 & SANS DFIR dissect APT34 (OilRig) Base32 chunking, cache-busting nonces, and Shannon entropy (>4.2 bits/byte) anomalies; and Microsoft Sysinternals Sysmon EventID 22 attributes DNS queries to the exact host process.',
    cves: [
      {
        id: 'CVE-2024-21887',
        cvss: '9.1 CRITICAL',
        status: 'CISA KEV · Ivanti Connect Secure',
        description:
          'Command injection exploited in the wild where threat actors used DNS beacons and covert UDP/53 exfiltration from restricted DMZ segments.',
      },
      {
        id: 'CVE-2023-4966',
        cvss: '9.4 CRITICAL',
        status: 'CISA KEV · Citrix Bleed',
        description:
          'Post-exploitation actors deployed custom DNS tunneling agents (iodine / dnscat2 / Symbiote) on segmented internal database hosts.',
      },
    ],
    actorGroups: [
      {
        name: 'OilRig (APT34 / Hazel Sandstorm)',
        aliases: 'Crambus, Helix Kitten, EUROPIUM',
        targetSectors: 'Energy, Government, Financial, Aviation, Telecom',
        notableCampaign:
          'Pioneered custom DNS tunneling trojans (BONDUPDATER, AlmaCommunicator, Saitama) encoding stolen archives in A/TXT queries.',
      },
      {
        name: 'xHunt Campaign & DarkHydrus',
        aliases: 'LazyCargo',
        targetSectors: 'Middle East & Global Critical Infrastructure',
        notableCampaign:
          'Uses RogueRobin and custom .NET agents issuing high-entropy subdomain queries through internal DNS forwarders.',
      },
    ],
    realWorldAdvisories: [
      'CISA & NSA DNS Security Guidance: Inspecting Recursive Resolver Logs (Zeek dns.log) and Blocking Unauthorised Authoritative Domains.',
      'SANS DFIR: Detecting DNS Tunneling via Subdomain Shannon Entropy (>4.2 bits) and Unusual TXT/NULL Record Ratios.',
      'Palo Alto Networks Unit 42: OilRig / APT34 DNS Tunneling Protocol Anatomy.',
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1071.004 — Application Layer Protocol: DNS',
        uri: 'https://attack.mitre.org/techniques/T1071/004/',
      },
      {
        title: 'Palo Alto Unit 42 — DNS Tunneling Abuse & Detection',
        uri: 'https://unit42.paloaltonetworks.com/dns-tunneling-how-dns-can-be-abused-by-malicious-actors/',
      },
      {
        title: 'Microsoft Sysinternals — Sysmon Event ID 22 (DNSEvent)',
        uri: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-22-dnsevent',
      },
    ],
  },
  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    scenarioCode: 'T1490 / T1486',
    scenarioName: 'LockBit-Style Volume Shadow Copy Wipe & Encryption',
    summary:
      'Human-operated ransomware groups systematically inhibit system recovery (T1490) by deleting Volume Shadow Copies via vssadmin.exe, wmic, or WMI COM APIs and disabling Windows Recovery Environment via bcdedit.exe before launching multi-threaded hybrid encryption (T1486).',
    multiSourceSynthesis:
      'Cross-vendor synthesis: CISA/FBI/MS-ISAC Advisory AA23-165A documents LockBit 3.0 PsExec lateral deployment (EventID 7045) and vssadmin/bcdedit recovery wiping; Trend Micro & Sophos X-Ops dissect LockBit Black’s intermittent head-only encryption using Windows I/O Completion Ports; and Microsoft Learn defines VSS & Sysmon EventID 1/11 telemetry.',
    cves: [
      {
        id: 'CVE-2023-4966 & CVE-2024-1709',
        cvss: '10.0 CRITICAL',
        status: 'CISA KEV · Ransomware Initial Access',
        description:
          'ConnectWise ScreenConnect & Citrix NetScaler vulnerabilities exploited by LockBit 3.0 and BlackCat affiliates prior to VSS shadow wipe.',
      },
      {
        id: 'CVE-2021-36934',
        cvss: '7.8 HIGH',
        status: 'HiveNightmare / SeriousSAM',
        description:
          'Volume Shadow Copy ACL flaw underscoring how VSS snapshots are targeted for both credential extraction and destructive deletion.',
      },
    ],
    actorGroups: [
      {
        name: 'LockBit 3.0 (Bitwise Spider)',
        aliases: 'LockBit Black, ABCD Ransomware',
        targetSectors: 'Healthcare, Manufacturing, Financial, Government, Logistics',
        notableCampaign:
          'Pushes locker binary over SMB (EID 7045), runs vssadmin delete shadows /all /quiet & bcdedit /set recoveryenabled no, then encrypts shares.',
      },
      {
        name: 'ALPHV / BlackCat & Akira Affiliates',
        aliases: 'Noberus, Storm-0501',
        targetSectors: 'Enterprise Networks, Critical Manufacturing, Education',
        notableCampaign:
          'Uses WMI Win32_ShadowCopy deletion and high-speed Rust/C++ ChaCha20/AES I/O encryption across SAN volumes.',
      },
    ],
    realWorldAdvisories: [
      'CISA / FBI / MS-ISAC Joint Cybersecurity Advisory AA23-165A: Understanding Ransomware Threat Actors: LockBit 3.0.',
      'MITRE ATT&CK T1490 & T1486: Inhibit System Recovery & Data Encrypted for Impact.',
      'Trend Micro & Sophos X-Ops: LockBit Black Intermittent Encryption & I/O Completion Port Analysis.',
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1490 — Inhibit System Recovery',
        uri: 'https://attack.mitre.org/techniques/T1490/',
      },
      {
        title: 'CISA Joint Advisory AA23-165A — LockBit 3.0 Ransomware',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a',
      },
      {
        title: 'Microsoft Learn — Volume Shadow Copy Service (VSS)',
        uri: 'https://learn.microsoft.com/en-us/windows-server/storage/file-server/volume-shadow-copy-service',
      },
    ],
  },
  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    scenarioCode: 'CVE-2024-3400',
    scenarioName: 'Unit 42 — Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor',
    summary:
      'Synthesizing findings from Volexity (UTA0218 discovery), Palo Alto Networks Unit 42 (Operation MidnightEclipse), and Rapid7, attackers exploited zero-day CVE-2024-3400 (CVSS 10.0) in PAN-OS GlobalProtect via SESSID cookie path traversal and sendTelemetry cron command injection to implant the UPSTYLE Python backdoor in system.pth and exfiltrate running-config.xml.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Volexity discovered the zero-day campaign (UTA0218), capturing the initial firewall breach, running-config.xml theft, and internal SMB/DPAPI lateral movement; Unit 42 reverse-engineered the UPSTYLE Python backdoor in /usr/lib/python3.6/site-packages/system.pth and its sslvpn_ngx_error.log inotify monitor; and Rapid7 & PAN PSIRT detailed the SESSID filename backtick injection inside sendTelemetry.',
    cves: [
      {
        id: 'CVE-2024-3400',
        cvss: '10.0 CRITICAL',
        status: 'CISA KEV · Zero-Day Exploited in Wild',
        description:
          'Arbitrary file creation in `/opt/panlogs/tmp/device_telemetry/minute/` leading to unauthenticated root OS command injection in PAN-OS GlobalProtect.',
      },
    ],
    actorGroups: [
      {
        name: 'UTA0218 (Operation MidnightEclipse Actor)',
        aliases: 'Velvet Ant Overlaps, State-Sponsored Perimeter Intrusion Group',
        targetSectors: 'Government, Defense, Telecommunications, Critical Infrastructure',
        notableCampaign:
          'Exploited CVE-2024-3400 zero-day to plant the in-memory UPSTYLE backdoor in system.pth / update.py and exfiltrate running-config.xml.',
      },
      {
        name: 'Opportunistic Post-Disclosure Clusters',
        aliases: 'UNC-PANOS-Groups',
        targetSectors: 'Enterprise VPN Appliances Worldwide',
        notableCampaign:
          'Scanned GlobalProtect portals for SESSID directory traversal and cron execution.',
      },
    ],
    realWorldAdvisories: [
      'Palo Alto Networks Unit 42 Threat Brief: Operation MidnightEclipse (CVE-2024-3400 & UPSTYLE Backdoor).',
      'Volexity Threat Research: Zero-Day Exploitation of Unauthenticated RCE in GlobalProtect (UTA0218).',
      'Palo Alto Networks Security Advisory PAN-SA-2024-0005 & Rapid7 AttackerKB Root-Cause Analysis.',
    ],
    groundedSources: [
      {
        title: 'Unit 42 — Operation MidnightEclipse & CVE-2024-3400 Analysis',
        uri: 'https://unit42.paloaltonetworks.com/cve-2024-3400/',
      },
      {
        title: 'Volexity — Zero-Day Exploitation of GlobalProtect CVE-2024-3400 (UTA0218)',
        uri: 'https://www.volexity.com/blog/2024/04/12/zero-day-exploitation-of-unauthenticated-remote-code-execution-vulnerability-in-globalprotect-cve-2024-3400/',
      },
      {
        title: 'Palo Alto Networks Security Advisory CVE-2024-3400',
        uri: 'https://security.paloaltonetworks.com/CVE-2024-3400',
      },
    ],
  },
  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    scenarioCode: 'T1218.014',
    scenarioName: 'Elastic Security Labs — GrimResource: MMC & apds.dll XSS-to-RCE Execution',
    summary:
      'Discovered by Elastic Security Labs and patched by Microsoft (CVE-2024-43572), GrimResource abuses a cross-site scripting (XSS) flaw in Windows apds.dll (res://apds.dll/redirect.html) inside crafted Microsoft Management Console (.msc) files to trigger DotNetToJScript deserialization in mmc.exe and inject Cobalt Strike into dllhost.exe via RwSection.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Elastic Security Labs discovered GrimResource in the wild and dissected the apds.dll XSS redirect and RwSection dirty-CLR injection into dllhost.exe; MDSec’s DotNetToJScript research explains how VBScript/JScript inside mmc.exe deserializes arbitrary .NET payloads in RAM; and Microsoft MSRC (CVE-2024-43572) documents the official MMC snap-in validation fix.',
    cves: [
      {
        id: 'CVE-2024-43572',
        cvss: '7.8 HIGH',
        status: 'CISA KEV · Exploited in Wild',
        description:
          'Microsoft Management Console (MMC) remote code execution vulnerability related to untrusted .msc snap-in execution.',
      },
    ],
    actorGroups: [
      {
        name: 'APT41 & Initial Access Brokers (GrimResource Users)',
        aliases: 'Wicked Panda, Brass Typhoon',
        targetSectors: 'Government, Defense, Financial, Aviation',
        notableCampaign:
          'Delivered weaponized .msc files that trigger apds.dll DOM redirects and inject Cobalt Strike into dllhost.exe via RwSection.',
      },
      {
        name: 'Swallowingrone & Red-Team Adversaries',
        aliases: 'UNC-MSC-Clusters',
        targetSectors: 'East Asian & Global Enterprise Networks',
        notableCampaign:
          'Rapidly adopted GrimResource .msc lures to bypass Mark-of-the-Web and Office macro policies.',
      },
    ],
    realWorldAdvisories: [
      'Elastic Security Labs (June 2024): GrimResource — Microsoft Management Console for Initial Access and Evasion.',
      'Microsoft Security Response Center (MSRC): CVE-2024-43572 MMC Remote Code Execution Advisory.',
      'MITRE ATT&CK T1218.014: System Binary Proxy Execution — MMC & DotNetToJScript.',
    ],
    groundedSources: [
      {
        title: 'Elastic Security Labs — GrimResource Technical Analysis',
        uri: 'https://www.elastic.co/security-labs/grimresource',
      },
      {
        title: 'Microsoft MSRC — CVE-2024-43572 MMC RCE Vulnerability',
        uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-43572',
      },
      {
        title: 'MITRE ATT&CK T1218.014 — System Binary Proxy Execution: MMC',
        uri: 'https://attack.mitre.org/techniques/T1218/014/',
      },
    ],
  },
  'elastic-lotus-blossom-chrysalis': {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    scenarioCode: 'T1574.002',
    scenarioName: 'Elastic Security Labs — Lotus Blossom APT: WinGUp DLL Side-Loading & CHRYSALIS Backdoor',
    summary:
      'Documented by Elastic Security Labs and Cisco Talos, Lotus Blossom (Spring Dragon / Billbug) uses a legitimate signed Notepad++ updater binary (GUP.exe) to side-load a malicious libcurl.dll, decrypting the CHRYSALIS and Sagerunex backdoors in memory with custom API hashing and HTTPS C2.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Elastic Security Labs reverse-engineered the 3-piece WinGUp (GUP.exe) + malicious libcurl.dll + encrypted conf.bin loader chain and the CHRYSALIS implant; Cisco Talos correlated Lotus Blossom’s Sagerunex backdoor evolution and regional telecom/defense targeting; and MITRE G0030/T1574.002 mapped the Sysmon EventID 7 unsigned-DLL detection rules.',
    cves: [
      {
        id: 'MITRE-T1574.002',
        cvss: '8.6 HIGH',
        status: 'Active Nation-State Espionage (Lotus Blossom)',
        description:
          'DLL Side-Loading of malicious libcurl.dll via signed Notepad++ WinGUp (GUP.exe) binary to decrypt and execute CHRYSALIS in memory.',
      },
    ],
    actorGroups: [
      {
        name: 'Lotus Blossom (Spring Dragon)',
        aliases: 'Billbug, Thrip, Bronze Elgin, Dragonfish',
        targetSectors: 'Southeast Asian Governments, Defense, Telecommunications, Aviation',
        notableCampaign:
          'Deployed WinGUp GUP.exe + libcurl.dll side-loading chains to stage the CHRYSALIS and Sagerunex backdoors.',
      },
      {
        name: 'Mustang Panda / Stately Taurus Overlaps',
        aliases: 'Regional Espionage Clusters',
        targetSectors: 'Diplomatic & Maritime Infrastructure',
        notableCampaign:
          'Uses multi-stage signed binary side-loading and encrypted shellcode blobs for long-dwell persistence.',
      },
    ],
    realWorldAdvisories: [
      'Elastic Security Labs: Lotus Blossom Espionage Tradecraft & CHRYSALIS Backdoor Analysis.',
      'Cisco Talos Intelligence: Spring Dragon / Lotus Blossom Sagerunex Backdoor & Side-Loading Campaigns.',
      'MITRE ATT&CK Group G0030 (Lotus Blossom) & T1574.002 (DLL Side-Loading).',
    ],
    groundedSources: [
      {
        title: 'Elastic Security Labs — Threat Research & APT Intrusion Analysis',
        uri: 'https://www.elastic.co/security-labs',
      },
      {
        title: 'Cisco Talos Intelligence — Lotus Blossom / Sagerunex Research',
        uri: 'https://blog.talosintelligence.com/',
      },
      {
        title: 'MITRE ATT&CK Group G0030 — Lotus Blossom',
        uri: 'https://attack.mitre.org/groups/G0030/',
      },
    ],
  },
  'unit42-scattered-spider-cloud': {
    scenarioId: 'unit42-scattered-spider-cloud',
    scenarioCode: 'T1078.004',
    scenarioName: 'Unit 42 & CISA — Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot',
    summary:
      'Profiled by Palo Alto Networks Unit 42, CISA (AA23-320A), and Mandiant (UNC3944), Muddled Libra (Scattered Spider / Octo Tempest) combines IT helpdesk social engineering ("vishing") and rogue MFA device registration in Okta/Entra ID with signed commercial RMM tools and rogue SAML IdP federation to compromise AWS and VMware ESXi.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: CISA/FBI Advisory AA23-320A documents the helpdesk voice-phishing scripts, SIM swapping, and commercial RMM tools (AnyDesk, ScreenConnect, Tailscale, ngrok); Unit 42 ("Muddled Libra") details the SSO-to-AWS sts:AssumeRole / CreateSAMLProvider and VMware ESXi pivot; and Mandiant (UNC3944) adds internal Confluence/SharePoint runbook harvesting.',
    cves: [
      {
        id: 'MITRE-T1078.004',
        cvss: '9.3 CRITICAL',
        status: 'CISA Advisory AA23-320A · Active Cloud/ESXi Intrusion',
        description:
          'Social engineering of IT helpdesks to reset passwords and register attacker-controlled FIDO2/TOTP MFA authenticators for SSO/SAML pivot.',
      },
    ],
    actorGroups: [
      {
        name: 'Muddled Libra (Scattered Spider)',
        aliases: 'UNC3944, Octo Tempest, 0ktapus, Starfraud',
        targetSectors: 'Hospitality, Casinos, Telecommunications, BPO, Financial, Retail',
        notableCampaign:
          'Pivoted from Okta/Entra ID SSO tenants into AWS EC2/S3 and on-prem VMware ESXi clusters via commercial RMM tools.',
      },
      {
        name: 'ALPHV / BlackCat & RansomHub Affiliates',
        aliases: 'Western English-Speaking Intrusion Collectives',
        targetSectors: 'Enterprise Cloud & Virtualized Datacenters',
        notableCampaign:
          'Partnered with Muddled Libra for hypervisor-level VMDK encryption and cloud data extortion.',
      },
    ],
    realWorldAdvisories: [
      'Palo Alto Networks Unit 42 Threat Actor Profile: Muddled Libra (Scattered Spider).',
      'CISA & FBI Joint Cybersecurity Advisory AA23-320A: Scattered Spider.',
      'Mandiant Threat Intelligence: UNC3944 Identity-Driven Cloud & Hypervisor Intrusions.',
    ],
    groundedSources: [
      {
        title: 'Unit 42 — Muddled Libra (Scattered Spider) Threat Research',
        uri: 'https://unit42.paloaltonetworks.com/muddled-libra/',
      },
      {
        title: 'CISA Joint Advisory AA23-320A — Scattered Spider',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a',
      },
      {
        title: 'Mandiant / Google Cloud Threat Intel — UNC3944 Research',
        uri: 'https://cloud.google.com/blog/topics/threat-intelligence/',
      },
    ],
  },
  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    scenarioCode: 'T1620',
    scenarioName: 'Elastic & Mandiant — APT41 (Brass Typhoon): DodgeBox, Call-Stack Spoofing & DUSTPAN Loader',
    summary:
      'Analyzed by Google Mandiant, Elastic Security Labs, and Trend Micro, APT41 (Brass Typhoon / Earth Freybug) injects the DUSTPAN stage-1 loader into wermgr.exe, uses STEALTHVECTOR to overwrite ntdll.dll in RAM (erasing user-mode EDR hooks) with synthetic call-stack spoofing, and loads the 16-plugin DUSTTRAP framework.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Mandiant uncovered the DUSTPAN memory launcher and the 16-plugin DUSTTRAP mTLS framework; Elastic Security Labs dissected DodgeBox and STEALTHVECTOR’s ntdll.dll .text unhooking (VirtualProtect RX -> RWX -> RX) and synthetic BaseThreadInitThunk call-stack spoofing; and Trend Micro (Earth Freybug) documented wermgr.exe process hollowing.',
    cves: [
      {
        id: 'MITRE-T1620',
        cvss: '8.9 HIGH',
        status: 'Active APT41 Evasion Tradecraft',
        description:
          'Reflective code loading with synthetic call-stack spoofing and DLL hollowing to evade user-mode EDR memory walkers.',
      },
    ],
    actorGroups: [
      {
        name: 'APT41 (Brass Typhoon / Wicked Panda)',
        aliases: 'Barium, Winnti, Earth Baku, Earth Freybug, HOODOO',
        targetSectors: 'Telecommunications, Government, Technology, Healthcare, Media',
        notableCampaign:
          'Deployed DodgeBox, DUSTPAN, STEALTHVECTOR, and DUSTTRAP across global enterprise targets.',
      },
      {
        name: 'Earth Freybug & ShadowPad Affiliates',
        aliases: 'APT41 Sub-Clusters',
        targetSectors: 'Semiconductor, Aviation, Logistics',
        notableCampaign:
          'Uses wermgr.exe injection, ntdll.dll unhooking, and call-stack spoofing to blind endpoint memory scanners.',
      },
    ],
    realWorldAdvisories: [
      'Elastic Security Labs: APT41 DodgeBox and STEALTHVECTOR Call-Stack Spoofing Analysis.',
      'Google Mandiant: APT41 DUSTPAN Loader and DUSTTRAP Multi-Stage In-Memory Plugin Ecosystem.',
      'MITRE ATT&CK Group G0096 (APT41) & Trend Micro Earth Freybug wermgr.exe Analysis.',
    ],
    groundedSources: [
      {
        title: 'Elastic Security Labs — APT & Loader Evasion Research',
        uri: 'https://www.elastic.co/security-labs',
      },
      {
        title: 'Mandiant — APT41 DUSTPAN & DUSTTRAP Technical Analysis',
        uri: 'https://cloud.google.com/blog/topics/threat-intelligence/apt41-us-state-governments',
      },
      {
        title: 'MITRE ATT&CK Group G0096 — APT41',
        uri: 'https://attack.mitre.org/groups/G0096/',
      },
    ],
  },
  'ms-volt-typhoon-lotl': {
    scenarioId: 'ms-volt-typhoon-lotl',
    scenarioCode: 'T1003.003',
    scenarioName: 'Microsoft Threat Intel — Volt Typhoon LOTL: KV Botnet, ntdsutil IFM & netsh portproxy',
    summary:
      'Detailed by Microsoft Threat Intelligence, CISA/NSA/FBI (AA24-038A), and Lumen Black Lotus Labs, Volt Typhoon (Bronze Silhouette) compromises SOHO routers (KV Botnet) and maintains multi-year stealth inside critical infrastructure using exclusively native Windows binaries (wmic, ntdsutil IFM media creation, and netsh interface portproxy).',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft Threat Intelligence identified the hands-on-keyboard wmic, ntdsutil "ac i ntds" ifm "create full", and netsh portproxy commands; Lumen Black Lotus Labs & Secureworks dissected the KV Botnet SOHO router relay mesh; and CISA/NSA/FBI Advisory AA24-038A provided PortProxy registry paths and ESent EventID 325 hunting rules.',
    cves: [
      {
        id: 'CVE-2022-42475 / SOHO-0DAY',
        cvss: '9.8 CRITICAL',
        status: 'CISA KEV · Perimeter Appliance Intrusion',
        description:
          'FortiOS, ManageEngine, and SOHO router vulnerabilities exploited by Volt Typhoon to establish initial perimeter access.',
      },
    ],
    actorGroups: [
      {
        name: 'Volt Typhoon (Bronze Silhouette)',
        aliases: 'Vanguard Panda, Insidious Taurus, DEV-0391',
        targetSectors: 'Communications, Energy, Transportation, Water/Wastewater, Maritime',
        notableCampaign:
          'Used wmic process call create, ntdsutil create full, and netsh interface portproxy v4tov4 across US critical infrastructure.',
      },
      {
        name: 'KV Botnet Operations Team',
        aliases: 'SOHO Router Relay Operators',
        targetSectors: 'End-of-Life Cisco, Netgear, Asus & DrayTek Routers',
        notableCampaign:
          'Maintained covert multi-hop proxy nodes to mask Volt Typhoon operator origin IPs.',
      },
    ],
    realWorldAdvisories: [
      'Microsoft Threat Intelligence: Volt Typhoon targets US critical infrastructure with living-off-the-land techniques.',
      'CISA / NSA / FBI Joint Advisory AA24-038A: PRC State-Sponsored Actors Compromise U.S. Critical Infrastructure.',
      'Lumen Black Lotus Labs & MITRE G1017: KV Botnet SOHO Router Relay Infrastructure.',
    ],
    groundedSources: [
      {
        title: 'Microsoft Security Blog — Volt Typhoon LOTL Analysis',
        uri: 'https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/',
      },
      {
        title: 'CISA Joint Advisory AA24-038A — Volt Typhoon',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a',
      },
      {
        title: 'MITRE ATT&CK Group G1017 — Volt Typhoon',
        uri: 'https://attack.mitre.org/groups/G1017/',
      },
    ],
  },
  'ms-midnight-blizzard-oauth': {
    scenarioId: 'ms-midnight-blizzard-oauth',
    scenarioCode: 'T1098.003',
    scenarioName: 'Microsoft Threat Intel — Midnight Blizzard (APT29): OAuth App Privilege Escalation',
    summary:
      'Reported by Microsoft Threat Intelligence, CISA (ED 24-02), and Mandiant, Midnight Blizzard (APT29 / Cozy Bear) used a distributed residential proxy password spray to breach a legacy non-production test tenant, then abused an OAuth application with Directory.ReadWrite.All to grant full_access_as_app across corporate Exchange Online.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft Threat Intelligence disclosed the low-volume residential-proxy password spray and the legacy OAuth Service Principal elevation to full_access_as_app; Mandiant documented APT29’s multi-app backdoor registration and EWS client_credentials collection; and CISA ED 24-02 mandated Entra ID Service Principal credential auditing.',
    cves: [
      {
        id: 'MITRE-T1098.003',
        cvss: '9.4 CRITICAL',
        status: 'CISA Emergency Directive 24-02',
        description:
          'Cloud OAuth Service Principal privilege escalation and Exchange Online full_access_as_app role assignment.',
      },
    ],
    actorGroups: [
      {
        name: 'Midnight Blizzard (APT29)',
        aliases: 'Cozy Bear, NOBELIUM, The Dukes, Cloaked Ursa',
        targetSectors: 'Cloud Service Providers, Government Agencies, Diplomatic, Tech',
        notableCampaign:
          'Abused legacy OAuth applications in Microsoft Entra ID to pivot from a test tenant into corporate Exchange Online mailboxes.',
      },
      {
        name: 'SVR Foreign Intelligence Cyber Units',
        aliases: 'BlueBravo, Iron Hemlock',
        targetSectors: 'Western Governments, Think Tanks, Defense Contractors',
        notableCampaign:
          'Uses residential proxy networks and token replay to evade cloud identity anomaly detection.',
      },
    ],
    realWorldAdvisories: [
      'Microsoft Threat Intelligence (Jan 2024): Midnight Blizzard — Guidance for responders on nation-state attack.',
      'CISA Emergency Directive 24-02: Mitigating Nation-State Compromise of Cloud Email.',
      'Mandiant Threat Intelligence: APT29 Cloud Identity & Service Principal Persistence Tradecraft.',
    ],
    groundedSources: [
      {
        title: 'Microsoft Security Blog — Midnight Blizzard OAuth Attack Guidance',
        uri: 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/',
      },
      {
        title: 'CISA Emergency Directive 24-02 — Midnight Blizzard Response',
        uri: 'https://www.cisa.gov/news-events/directives/ed-24-02-mitigating-significant-risk-nation-state-compromise-microsoft-corporate-email',
      },
      {
        title: 'Mandiant — APT29 Cloud & OAuth Persistence Research',
        uri: 'https://cloud.google.com/blog/topics/threat-intelligence/',
      },
    ],
  },
  'ms-salt-typhoon-telecom': {
    scenarioId: 'ms-salt-typhoon-telecom',
    scenarioCode: 'T1014',
    scenarioName: 'Microsoft Threat Intel & CISA — Salt Typhoon: Telecom Core Router Compromise & Demodex Rootkit',
    summary:
      'Documented by CISA/FBI/NSA (AA24-338A), Kaspersky GReAT, and Cisco Talos, Salt Typhoon (GhostEmperor / FamousSparrow) compromises telecommunications backbone routers via Cisco IOS XE (CVE-2023-20198 Guest Shell), captures TACACS+/RADIUS credentials, and deploys the kernel-mode Demodex rootkit (Nguv64.sys) on Windows mediation servers.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: CISA/NSA/FBI Advisory AA24-338A & Cisco Talos detail Cisco IOS XE exploitation (CVE-2023-20198), Guest Shell container abuse, and TACACS+/RADIUS capture; Kaspersky GReAT reverse-engineered the GhostEmperor Demodex kernel rootkit (BYOVD EPROCESS unlinking); and Microsoft Threat Intelligence linked the GhostSpider user-mode C2 framework.',
    cves: [
      {
        id: 'CVE-2023-20198 / CVE-2023-20273',
        cvss: '10.0 CRITICAL',
        status: 'CISA KEV · Advisory AA24-338A',
        description:
          'Cisco IOS XE Web UI privilege escalation and command injection exploited to enable Guest Shell Linux containers on core routers.',
      },
    ],
    actorGroups: [
      {
        name: 'Salt Typhoon (GhostEmperor)',
        aliases: 'FamousSparrow, Earth Estries, UNC2286',
        targetSectors: 'Global Telecommunications Providers, ISP Backbones, Government',
        notableCampaign:
          'Infiltrated telecom core routers and mediation systems using Cisco Guest Shell, Demodex rootkit, and GhostSpider.',
      },
      {
        name: 'Earth Estries Telecom Intrusion Cluster',
        aliases: 'Backbone Router Espionage Teams',
        targetSectors: 'Telecommunications & Critical Infrastructure',
        notableCampaign:
          'Harvested TACACS+ keys and BGP/MPLS routing configurations across carrier networks.',
      },
    ],
    realWorldAdvisories: [
      'CISA / NSA / FBI Joint Guide (AA24-338A): Enhanced Visibility and Hardening Guidance for Communications Infrastructure.',
      'Kaspersky GReAT: GhostEmperor — From ProxyLogon to Kernel Mode with Demodex Rootkit.',
      'Cisco Talos & Microsoft Threat Intelligence: IOS XE Guest Shell & Salt Typhoon Telecom Analysis.',
    ],
    groundedSources: [
      {
        title: 'CISA — Enhanced Visibility & Hardening for Communications Infrastructure (AA24-338A)',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-338a',
      },
      {
        title: 'Kaspersky Securelist — GhostEmperor & Demodex Kernel Rootkit',
        uri: 'https://securelist.com/ghostemperor-from-proxylogon-to-kernel-mode/104407/',
      },
      {
        title: 'MITRE ATT&CK T1014 — Rootkit (Demodex / GhostEmperor)',
        uri: 'https://attack.mitre.org/techniques/T1014/',
      },
    ],
  },
  'ms-forest-blizzard-gooseegg': {
    scenarioId: 'ms-forest-blizzard-gooseegg',
    scenarioCode: 'CVE-2022-38028',
    scenarioName: 'Microsoft Threat Intel — Forest Blizzard (APT28): Print Spooler CVE-2022-38028 & GooseEgg',
    summary:
      'Published by Microsoft Threat Intelligence, MSRC, and ESET, Forest Blizzard (APT28 / Fancy Bear / Fighting Ursa) deployed the custom GooseEgg launcher (execute.bat + justice.exe) to exploit CVE-2022-38028 in Windows Print Spooler by modifying MPDW-constraints.js in the DriverStore and registering wayzgoose.dll as a SYSTEM COM server.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Microsoft MSRC (CVE-2022-38028) defines the DriverStore MPDW-constraints.js permissions flaw; Microsoft Threat Intelligence dissected the GooseEgg launcher (execute.bat / justice.exe) and wayzgoose.dll COM registration inside PrintFilterPipelineSvc.exe; and ESET & CISA correlated APT28’s post-escalation SYSTEM credential harvesting.',
    cves: [
      {
        id: 'CVE-2022-38028',
        cvss: '7.8 HIGH',
        status: 'CISA KEV · Exploited in Wild by APT28',
        description:
          'Windows Print Spooler elevation of privilege vulnerability in `printfilterpipelinesvc.exe` JavaScript constraint handling.',
      },
    ],
    actorGroups: [
      {
        name: 'Forest Blizzard (APT28 / STRONTIUM)',
        aliases: 'Fancy Bear, Fighting Ursa, Sofacy, Sednit, Pawn Storm',
        targetSectors: 'Government, Defense, Energy, Transportation, NGOs (Ukraine, NATO)',
        notableCampaign:
          'Deployed GooseEgg batch/binary launcher (`execute.bat` + `wayzgoose.dll`) to escalate to SYSTEM and steal credentials.',
      },
      {
        name: 'GRU Unit 26165 Cyber Operations',
        aliases: 'APT28 Operational Teams',
        targetSectors: 'Military & Diplomatic Ministries',
        notableCampaign:
          'Chained Print Spooler and Outlook zero-days for persistent network access.',
      },
    ],
    realWorldAdvisories: [
      'Microsoft Threat Intelligence (April 2024): Forest Blizzard uses novel GooseEgg tool for post-compromise activities.',
      'Microsoft Security Update Guide: CVE-2022-38028 Windows Print Spooler Elevation of Privilege.',
      'ESET & MITRE ATT&CK G0007: APT28 (Forest Blizzard) Post-Compromise Toolset Analysis.',
    ],
    groundedSources: [
      {
        title: 'Microsoft Security Blog — Forest Blizzard GooseEgg Tool Analysis',
        uri: 'https://www.microsoft.com/en-us/security/blog/2024/04/22/analyzing-forest-blizzards-custom-post-compromise-tool-for-exploiting-cve-2022-38028-to-obtain-credentials/',
      },
      {
        title: 'Microsoft MSRC — CVE-2022-38028 Windows Print Spooler Advisory',
        uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38028',
      },
      {
        title: 'MITRE ATT&CK Group G0007 — APT28 (Forest Blizzard)',
        uri: 'https://attack.mitre.org/groups/G0007/',
      },
    ],
  },
  'unit42-star-blizzard-evilginx-aitm': {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    scenarioCode: 'T1539',
    scenarioName: 'Microsoft, Unit 42 & CISA — Star Blizzard / Storm-0539: Evilginx AiTM Cookie Theft',
    summary:
      'Documented by Microsoft Threat Intelligence, Palo Alto Networks Unit 42, and CISA/NCSC-UK (AA23-341A), Star Blizzard (SEABORGIUM / COLDRIVER) and Storm-0539 deploy Evilginx Adversary-in-the-Middle (AiTM) reverse proxies in front of Microsoft Entra ID login endpoints to intercept MFA-authenticated ESTSAUTH / ESTSAUTHPERSISTENT session cookies.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: CISA & NCSC-UK (AA23-341A) document Star Blizzard’s target reconnaissance and cloud-hosted PDF lures; Microsoft Threat Intelligence dissects how Evilginx reverse proxies relay live MFA challenges, steal ESTSAUTHPERSISTENT cookies, and create hidden Exchange New-InboxRule forwarding rules; and Unit 42 details FIDO2 Token Binding mitigations.',
    cves: [
      {
        id: 'MITRE-T1539 / T1557',
        cvss: '9.0 CRITICAL',
        status: 'CISA Advisory AA23-341A · Active AiTM Phishing',
        description:
          'Adversary-in-the-Middle reverse proxy TLS termination capturing post-MFA session cookies and OAuth refresh tokens.',
      },
    ],
    actorGroups: [
      {
        name: 'Star Blizzard (SEABORGIUM / Callisto)',
        aliases: 'COLDRIVER, Gossamer Bear, BlueCharlie, TA446',
        targetSectors: 'Defense Think Tanks, Nuclear Research, Diplomatic, Academia, NGOs',
        notableCampaign:
          'Used Evilginx AiTM proxies and PDF lures hosted on cloud storage to steal M365 session cookies and configure hidden inbox forwarding rules.',
      },
      {
        name: 'Storm-0539 (Atlas Lion)',
        aliases: 'Cloud Identity AiTM Intrusion Group',
        targetSectors: 'Retail, Hospitality, Financial Services, Cloud Tenants',
        notableCampaign:
          'Bypassed SMS/TOTP MFA via AiTM proxies and registered rogue MFA devices in Entra ID.',
      },
    ],
    realWorldAdvisories: [
      'CISA / NCSC UK / NSA / FBI Joint Advisory AA23-341A: Russian FSB Cyber Actor Star Blizzard Continues Worldwide Spear-Phishing.',
      'Microsoft Threat Intelligence: From cookie theft to BEC — Attackers use AiTM phishing sites as entry point.',
      'Palo Alto Networks Unit 42 & MITRE T1539: Defending Against AiTM Reverse-Proxy Session Hijacking.',
    ],
    groundedSources: [
      {
        title: 'CISA Joint Advisory AA23-341A — Star Blizzard Spear-Phishing',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-341a',
      },
      {
        title: 'Microsoft Security Blog — AiTM Phishing & Session Cookie Theft',
        uri: 'https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/',
      },
      {
        title: 'MITRE ATT&CK T1539 — Steal Web Session Cookie',
        uri: 'https://attack.mitre.org/techniques/T1539/',
      },
    ],
  },
  'talos-arcanedoor-asa': {
    scenarioId: 'talos-arcanedoor-asa',
    scenarioCode: 'CVE-2024-20353',
    scenarioName: 'Cisco Talos — ArcaneDoor: UAT4356 ASA/FTD Line Dancer & Line Runner Espionage',
    summary:
      'Uncovered by Cisco Talos, Cisco PSIRT, and NCSC-UK in April 2024, the ArcaneDoor campaign (UAT4356 / STORM-1849) targeted Cisco ASA and FTD perimeter firewalls using CVE-2024-20353 and CVE-2024-20359 to deploy Line Dancer (in-memory shellcode interpreter via <host-scan-reply> WebVPN POSTs) and Line Runner (persistent vpn_dessert.zip boot backdoor).',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Cisco Talos reverse-engineered the Line Dancer volatile memory implant (which hooks lina to disable syslog/crashdumps and captures PCAPs) and the Line Runner persistent backdoor; Cisco PSIRT documented CVE-2024-20353 and CVE-2024-20359; and NCSC-UK & Canadian Cyber Centre published the verify /md5 system:memory/text forensic integrity check.',
    cves: [
      {
        id: 'CVE-2024-20353',
        cvss: '8.6 HIGH',
        status: 'CISA KEV · Zero-Day Exploited in Wild',
        description:
          'Cisco ASA and FTD Web Services vulnerability exploited alongside CVE-2024-20359 to achieve root code execution on perimeter appliances.',
      },
      {
        id: 'CVE-2024-20359',
        cvss: '6.0 MEDIUM (Chained Root Persistence)',
        status: 'CISA KEV · Exploited in Wild',
        description:
          'Cisco ASA legacy pre-loading VPN file execution flaw abused by Line Runner to survive reboots and firmware upgrades.',
      },
    ],
    actorGroups: [
      {
        name: 'UAT4356 (STORM-1849)',
        aliases: 'ArcaneDoor Threat Actor',
        targetSectors: 'Government Network Perimeters, Telecommunications, Critical Infrastructure',
        notableCampaign:
          'Disabled syslog and crashdumps in ASA `lina` memory, captured PCAPs, and exfiltrated configurations via Line Dancer and Line Runner.',
      },
      {
        name: 'State-Sponsored Edge Router Intrusion Teams',
        aliases: 'Zero-Log Network Implant Operators',
        targetSectors: 'Defense & Diplomatic Edge Gateways',
        notableCampaign:
          'Targeted unmonitored network security appliances lacking EDR coverage.',
      },
    ],
    realWorldAdvisories: [
      'Cisco Talos Intelligence Group: ArcaneDoor — New Espionage-Focused Campaign Found Targeting Perimeter Network Devices.',
      'Cisco PSIRT Security Advisory: CVE-2024-20353 & CVE-2024-20359 ASA/FTD Web Services & Persistence.',
      'NCSC UK, CISA & Canadian Cyber Centre Joint Advisory on ArcaneDoor Memory Forensics.',
    ],
    groundedSources: [
      {
        title: 'Cisco Talos — ArcaneDoor Campaign Technical Report',
        uri: 'https://blog.talosintelligence.com/arcanedoor-new-espionage-focused-campaign-found-targeting-perimeter-network-devices/',
      },
      {
        title: 'Cisco Security Advisory — CVE-2024-20353 & CVE-2024-20359',
        uri: 'https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-persist-rce-FLsNXF4h',
      },
      {
        title: 'NCSC-UK — ArcaneDoor Perimeter Campaign Advisory',
        uri: 'https://www.ncsc.gov.uk/news/arcanedoor-espionage-campaign-targeting-perimeter-network-devices',
      },
    ],
  },
  'talos-fortinet-coathanger-apt': {
    scenarioId: 'talos-fortinet-coathanger-apt',
    scenarioCode: 'CVE-2024-21762',
    scenarioName: 'FortiGuard, NCSC-NL & Talos — COATHANGER RAT: FortiOS SSL-VPN & preload.so Rootkit',
    summary:
      'Disclosed by the Dutch Military Intelligence and Security Service (MIVD), NCSC-NL, and FortiGuard Labs in February 2024, state-sponsored actors exploited FortiOS SSL-VPN vulnerabilities (CVE-2022-42475 / CVE-2024-21762) to deploy COATHANGER, a stealthy persistent RAT that hooks userland libc calls via /etc/ld.so.preload and survives firmware updates by patching the flatkc boot unpacker and smartctl.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Dutch MIVD/AIVD & NCSC-NL reverse-engineered COATHANGER—showing how preload.so in /etc/ld.so.preload hides /data2/ files from CLI commands and how hooking flatkc survives FortiOS firmware upgrades; FortiGuard PSIRT documented the sslvpnd heap/out-of-bounds write bugs (CVE-2022-42475 / CVE-2024-21762); and Mandiant detailed monolithic /bin/init ROP chains.',
    cves: [
      {
        id: 'CVE-2024-21762',
        cvss: '9.6 CRITICAL',
        status: 'CISA KEV · Exploited in Wild',
        description:
          'Fortinet FortiOS SSL-VPN (`sslvpnd`) out-of-bounds write vulnerability allowing unauthenticated remote code execution via crafted HTTP chunked requests.',
      },
      {
        id: 'CVE-2022-42475',
        cvss: '9.8 CRITICAL',
        status: 'CISA KEV · Exploited in COATHANGER Campaign',
        description:
          'FortiOS SSL-VPN heap-based buffer overflow exploited to implant the COATHANGER rootkit on military firewall appliances.',
      },
    ],
    actorGroups: [
      {
        name: 'COATHANGER Espionage Actor (Volt/Red Menshen Overlap)',
        aliases: 'MIVD / NCSC-NL Tracked State Actor',
        targetSectors: 'Defense Ministries, Military Networks, Diplomatic Gateways',
        notableCampaign:
          'Deployed COATHANGER (`preload.so`, `httpsd`, and modified `smartctl` / `flatkc`) on FortiGate appliances to maintain hidden access across firmware upgrades.',
      },
      {
        name: 'UNC3886 & Perimeter Appliance Actors',
        aliases: 'FortiOS Zero-Day Exploit Teams',
        targetSectors: 'Government, Aerospace, Telecommunications',
        notableCampaign:
          'Targets edge VPN appliances with custom ELF implants that hook system calls to hide files and processes.',
      },
    ],
    realWorldAdvisories: [
      'NCSC-NL & MIVD/AIVD Technical Advisory (Feb 2024): Ministry of Defence of the Netherlands Uncovers COATHANGER Stealthy Malware.',
      'Fortinet PSIRT Advisory FG-IR-24-015 (CVE-2024-21762) & FG-IR-22-398 (CVE-2022-42475).',
      'MITRE ATT&CK T1574.006 & Mandiant Appliance Forensics: Detecting /etc/ld.so.preload Rootkits.',
    ],
    groundedSources: [
      {
        title: 'NCSC-NL & MIVD — COATHANGER Malware Publication',
        uri: 'https://english.ncsc.nl/publications/publications/2024/february/6/mivd-and-aivd-alert-on-coathanger-malware',
      },
      {
        title: 'FortiGuard PSIRT Advisory FG-IR-24-015 (CVE-2024-21762)',
        uri: 'https://www.fortiguard.com/psirt/FG-IR-24-015',
      },
      {
        title: 'MITRE ATT&CK T1574.006 — Dynamic Linker Hijacking (LD_PRELOAD)',
        uri: 'https://attack.mitre.org/techniques/T1574/006/',
      },
    ],
  },
  'f5-bigip-request-smuggling': {
    scenarioId: 'f5-bigip-request-smuggling',
    scenarioCode: 'CVE-2023-46747',
    scenarioName: 'F5 SIRT & ProjectDiscovery — BIG-IP TMUI AJP Request Smuggling & Root RCE',
    summary:
      'Documented by F5 SIRT (K000137353), Praetorian, and ProjectDiscovery, CVE-2023-46747 (CVSS 9.8) exploits an Apache httpd mod_proxy_ajp request smuggling flaw on F5 BIG-IP TMUI to inject a forged 0x1234 AJP frame with SC_A_REMOTE_USER=admin into Tomcat (:8009), create a rogue admin user in /config/bigip_user.conf, and execute root commands via tmsh run /util bash.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Praetorian & ProjectDiscovery dissected the Apache mod_proxy_ajp packet-boundary miscalculation that smuggles a second 0x1234 AJP frame with SC_A_REMOTE_USER=admin into Tomcat; F5 SIRT (K000137353) published the mitigation script and /var/log/audit mcpd/tmsh indicators; and CISA KEV documented post-exploitation SSL private key theft.',
    cves: [
      {
        id: 'CVE-2023-46747',
        cvss: '9.8 CRITICAL',
        status: 'CISA KEV · Exploited in Wild',
        description:
          'F5 BIG-IP Traffic Management User Interface (TMUI) unauthenticated remote code execution via AJP request smuggling.',
      },
    ],
    actorGroups: [
      {
        name: 'UNC5174 & Perimeter Appliance Exploiters',
        aliases: 'F5 BIG-IP Intrusion Operators',
        targetSectors: 'Enterprise Data Centers, Financial, Government, Telecom',
        notableCampaign:
          'Exploited CVE-2023-46747 AJP smuggling on exposed BIG-IP TMUI interfaces to execute bash commands as root and dump `/config/bigip.conf`.',
      },
      {
        name: 'Initial Access Brokers Targeting Load Balancers',
        aliases: 'TMUI / iControl REST Exploit Clusters',
        targetSectors: 'Cloud Hosting, E-Commerce, Banking',
        notableCampaign:
          'Chained AJP request smuggling with iControl REST `/mgmt/tm/util/bash` for full appliance takeover.',
      },
    ],
    realWorldAdvisories: [
      'F5 Security Advisory K000137353: BIG-IP Configuration Utility Unauthenticated RCE (CVE-2023-46747).',
      'ProjectDiscovery & Praetorian Technical Reproduction of CVE-2023-46747 AJP Smuggling.',
      'NIST NVD & CISA KEV: CVE-2023-46747 Remediation & Audit Log Hunting.',
    ],
    groundedSources: [
      {
        title: 'F5 Security Advisory K000137353 — CVE-2023-46747',
        uri: 'https://my.f5.com/manage/s/article/K000137353',
      },
      {
        title: 'ProjectDiscovery Blog — F5 BIG-IP Unauthenticated RCE (CVE-2023-46747)',
        uri: 'https://blog.projectdiscovery.io/f5-big-ip-unauthenticated-rce-cve-2023-46747/',
      },
      {
        title: 'NVD — CVE-2023-46747 Detail',
        uri: 'https://nvd.nist.gov/vuln/detail/CVE-2023-46747',
      },
    ],
  },
  'splunk-ivanti-connect-secure': {
    scenarioId: 'splunk-ivanti-connect-secure',
    scenarioCode: 'CVE-2024-21887',
    scenarioName: 'Mandiant, Volexity & Splunk SURGe — UNC5221 Ivanti Connect Secure Zero-Day & WIREFIRE / ZIPLINE',
    summary:
      'Discovered by Volexity (UTA0178) and analyzed by Mandiant (UNC5221), Splunk SURGe, and CISA (ED 24-01), attackers chained zero-days CVE-2023-46805 (../../ path-traversal auth bypass) and CVE-2024-21887 (Python popen command injection) on Ivanti Connect Secure VPN appliances to implant the WIREFIRE webshell in visits.py, the ZIPLINE LD_PRELOAD backdoor (libsecure.so), and the WARPWIRE credential harvester.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Volexity discovered the zero-day chain (/api/v1/totp/user-backup-code/../../license/keys-status/) and the WIREFIRE Python webshell injected into visits.py; Mandiant (UNC5221) reverse-engineered ZIPLINE (libsecure.so LD_PRELOAD), WARPWIRE, and ComponentIntegrity.pm ICT tampering; and CISA ED 24-01 & Splunk SURGe authored the external ICT and SIEM detections.',
    cves: [
      {
        id: 'CVE-2024-21887',
        cvss: '9.1 CRITICAL',
        status: 'CISA KEV · Zero-Day Exploited in Wild',
        description:
          'Command injection in Ivanti Connect Secure and Policy Secure web components (`/api/v1/license/keys-status/`).',
      },
      {
        id: 'CVE-2023-46805',
        cvss: '8.2 HIGH',
        status: 'CISA KEV · Zero-Day Auth Bypass',
        description:
          'Path traversal authentication bypass (`/api/v1/totp/user-backup-code/../../`) allowing unauthenticated access to restricted endpoints.',
      },
    ],
    actorGroups: [
      {
        name: 'UNC5221 / UTA0178',
        aliases: 'Cutting Edge Campaign Espionage Actor',
        targetSectors: 'Defense Industrial Base, Government, Aerospace, Finance, Telecom',
        notableCampaign:
          'Deployed WIREFIRE in visits.py, ZIPLINE (LD_PRELOAD libsecure.so), and WARPWIRE on Ivanti VPN gateways while patching ComponentIntegrity.pm.',
      },
      {
        name: 'UNC5325 & Post-Disclosure Clusters',
        aliases: 'LITTLELAMB.WOOLTEA / BUSHWALK Operators',
        targetSectors: 'Global Enterprise VPN Gateways',
        notableCampaign:
          'Exploited Ivanti Connect Secure appliances to plant web shells and persist across factory resets.',
      },
    ],
    realWorldAdvisories: [
      'Volexity Threat Research: Active Exploitation of Two Zero-Day Vulnerabilities in Ivanti Connect Secure (WIREFIRE).',
      'Mandiant: Cutting Edge — Suspected APT Targets Ivanti Connect Secure VPN in New Zero-Day Exploitation (ZIPLINE & WARPWIRE).',
      'CISA Emergency Directive 24-01 & Splunk SURGe: Mitigate Ivanti Connect Secure Vulnerabilities.',
    ],
    groundedSources: [
      {
        title: 'Volexity — Active Exploitation of Two Zero-Days in Ivanti Connect Secure',
        uri: 'https://www.volexity.com/blog/2024/01/10/active-exploitation-of-two-zero-day-vulnerabilities-in-ivanti-connect-secure/',
      },
      {
        title: 'Mandiant — Cutting Edge Ivanti Zero-Day & ZIPLINE Analysis',
        uri: 'https://cloud.google.com/blog/topics/threat-intelligence/suspected-apt-targets-ivanti-zero-day',
      },
      {
        title: 'CISA Emergency Directive 24-01 — Ivanti Vulnerabilities',
        uri: 'https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities',
      },
    ],
  },
  'splunk-citrix-bleed-session-hijack': {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    scenarioCode: 'CVE-2023-4966',
    scenarioName: 'Splunk SURGe, Assetnote & CISA — Citrix Bleed (CVE-2023-4966) NSC_AAAC Session Hijack',
    summary:
      'Analyzed by Assetnote, Splunk SURGe, Mandiant, and CISA (AA23-325A), Citrix Bleed (CVE-2023-4966) exploits an unsafe snprintf() return-value usage in Citrix NetScaler ADC/Gateway (/oauth/idp/.well-known/openid-configuration) via a ~24,576-byte HTTP Host header to over-read ~16 KB of adjacent heap memory containing active 65-character NSC_AAAC session tokens, bypassing MFA.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Assetnote reverse-engineered the NetScaler binary to prove how inserting a 24 KB Host header 6 times into a 131 KB buffer causes snprintf() to return ~147 KB and leak ~16 KB of adjacent heap RAM; Mandiant & CISA (AA23-325A) documented LockBit 3.0 post-MFA hijacking and kill aaa session -all remediation; and Splunk SURGe authored the multi-ASN cookie-replay SPL rules.',
    cves: [
      {
        id: 'CVE-2023-4966',
        cvss: '9.4 CRITICAL',
        status: 'CISA KEV · Mass Exploitation by LockBit 3.0 & Medusa',
        description:
          'Sensitive information disclosure in NetScaler ADC and NetScaler Gateway allowing unauthenticated extraction of active session tokens from memory.',
      },
    ],
    actorGroups: [
      {
        name: 'LockBit 3.0 Affiliates (Citrix Bleed Campaign)',
        aliases: 'Bitwise Spider, Boeing/ICBC Intrusion Affiliates',
        targetSectors: 'Aerospace, Financial Services, Healthcare, Legal, Government',
        notableCampaign:
          'Automated CVE-2023-4966 memory dumps to hijack MFA-authenticated Citrix VDI sessions and deploy LockBit 3.0.',
      },
      {
        name: 'Medusa & Rhysida Ransomware Groups',
        aliases: 'Initial Access Broker Partners',
        targetSectors: 'Healthcare, Education, Critical Infrastructure',
        notableCampaign:
          'Replayed stolen NSC_AAAC cookies from different ASN/GeoIP origins to pivot into internal Active Directory.',
      },
    ],
    realWorldAdvisories: [
      'Assetnote Security Research: Citrix Bleed — Leaking Session Tokens with CVE-2023-4966 (snprintf Root Cause).',
      'Splunk SURGe: Citrix Bleed (CVE-2023-4966) Vulnerability Analysis and Detection Guidance.',
      'CISA / FBI / MS-ISAC Joint Advisory AA23-325A: Threat Actors Exploit Citrix Bleed (CVE-2023-4966).',
    ],
    groundedSources: [
      {
        title: 'Assetnote — Citrix Bleed CVE-2023-4966 Technical Root-Cause Research',
        uri: 'https://www.assetnote.io/resources/research/citrix-bleed-leaking-session-tokens-with-cve-2023-4966',
      },
      {
        title: 'Splunk SURGe — Citrix Bleed CVE-2023-4966 Detection Guide',
        uri: 'https://www.splunk.com/en_us/blog/security/citrix-bleed-cve-2023-4966-vulnerability-analysis-and-detection.html',
      },
      {
        title: 'CISA Joint Advisory AA23-325A — Citrix Bleed Exploitation',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-325a',
      },
    ],
  },
  'kaspersky-operation-triangulation': {
    scenarioId: 'kaspersky-operation-triangulation',
    scenarioCode: 'CVE-2023-38606',
    scenarioName: 'Kaspersky GReAT — Operation Triangulation: Zero-Click iMessage, Hardware MMIO & TriangleDB',
    summary:
      'Discovered by Kaspersky GReAT in 2023 and patched by Apple, Operation Triangulation chained 4 zero-days—a zero-click Apple iMessage TrueType font ADJUST (0x90) instruction RCE (CVE-2023-41990), integer overflow (CVE-2023-32434), undocumented Apple A12–A16 SoC hardware MMIO register PPL bypass (CVE-2023-38606), and Safari stage—to deploy the in-memory TriangleDB implant.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Kaspersky GReAT’s 37C3 hardware analysis solved CVE-2023-38606 (undocumented SoC MMIO DMA register 0x206040000 writes bypassing Apple PPL); Kaspersky’s TriangleDB report dissected the volatile in-memory Mach-O implant and sms.db wiping; and Apple Security Engineering / NVD documented CVE-2023-41990 (FontParser ADJUST instruction) and DataUsage.sqlite BackupAgent indicators.',
    cves: [
      {
        id: 'CVE-2023-38606',
        cvss: '8.8 HIGH',
        status: 'CISA KEV · Zero-Day Hardware MMIO PPL Bypass',
        description:
          'Undocumented hardware MMIO register range on Apple A12–A16 SoCs allowing DMA physical memory writes that bypass Page Protection Layer (PPL).',
      },
      {
        id: 'CVE-2023-41990',
        cvss: '7.8 HIGH',
        status: 'CISA KEV · Zero-Click iMessage Font RCE',
        description:
          'Undocumented TrueType font bytecode instruction (0x90 ADJUST) vulnerability in Apple FontParser triggered via zero-click iMessage attachment.',
      },
    ],
    actorGroups: [
      {
        name: 'Operation Triangulation Threat Actor',
        aliases: 'TriangleDB / BackupAgent Espionage Operator',
        targetSectors: 'Cybersecurity Researchers, Diplomatic Missions, Government Officials',
        notableCampaign:
          'Compromised iOS devices via invisible zero-click iMessage attachments, erased the message from sms.db, and ran TriangleDB in RAM.',
      },
      {
        name: 'Zero-Click Mobile Surveillance Operators',
        aliases: 'Advanced Mobile Exploit Developers',
        targetSectors: 'High-Profile Executive & Diplomatic Mobile Endpoints',
        notableCampaign:
          'Chains FontParser/ImageIO zero-click vulnerabilities with kernel privilege escalation.',
      },
    ],
    realWorldAdvisories: [
      'Kaspersky GReAT (37C3 & Securelist): Operation Triangulation — The Last (Hardware) Mystery (CVE-2023-38606).',
      'Kaspersky GReAT: Dissecting TriangleDB, the Operation Triangulation iOS Implant.',
      'Apple Security Updates & NIST NVD: CVE-2023-41990 (FontParser) & CVE-2023-38606 (Kernel MMIO).',
    ],
    groundedSources: [
      {
        title: 'Kaspersky Securelist — Operation Triangulation Hardware Mystery',
        uri: 'https://securelist.com/operation-triangulation-the-last-hardware-mystery/111669/',
      },
      {
        title: 'Kaspersky Securelist — Dissecting the TriangleDB iOS Implant',
        uri: 'https://securelist.com/triangledb-iostriangulation-implant/110050/',
      },
      {
        title: 'NIST NVD — CVE-2023-38606 Apple SoC MMIO Vulnerability',
        uri: 'https://nvd.nist.gov/vuln/detail/CVE-2023-38606',
      },
    ],
  },
  'kaspersky-toddycat-eset-dll': {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    scenarioCode: 'T1574.002',
    scenarioName: 'Kaspersky GReAT & ESET — ToddyCat APT: ESET DLL Side-Loading (CVE-2024-11859), TCESB & Samurai',
    summary:
      'Documented by Kaspersky GReAT and ESET (CVE-2024-11859), ToddyCat APT abuses the standalone signed ESET Command Line Scanner (ecls.exe) to side-load a malicious version.dll / http_dll.dll proxy loader (TCESB / LoFiSe), decrypting the modular Samurai passive backdoor in memory and deploying the TomBerBil credential stealer while forwarding exports to the real DLL.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Kaspersky GReAT uncovered ToddyCat’s TCESB, Samurai, and TomBerBil toolset and how export forwarding (#pragma comment(linker, "/export:...")) keeps the host binary running cleanly; ESET PSIRT (CVE-2024-11859) documented the DLL search-order flaw in ecls.exe; and MITRE T1574.002 defines the Sysmon EventID 7 unsigned-DLL detection rule.',
    cves: [
      {
        id: 'CVE-2024-11859',
        cvss: '6.7 MEDIUM (Abused for Stealth APT Execution)',
        status: 'ESET Advisory · Exploited by ToddyCat APT',
        description:
          'DLL search-order hijacking vulnerability in ESET Command Line Scanner (`ecls.exe`) abused by ToddyCat to side-load TCESB / Samurai.',
      },
    ],
    actorGroups: [
      {
        name: 'ToddyCat APT',
        aliases: 'Samurai / Ninja / TomBerBil / TCESB Operator',
        targetSectors: 'Government Ministries, Military, Defense Contractors (Europe & Asia)',
        notableCampaign:
          'Pivoted from Exchange servers to workstations using ESET ecls.exe side-loading (CVE-2024-11859), TCESB/Samurai C2, and TomBerBil credential theft.',
      },
      {
        name: 'UNC-Exchange-Samurai Clusters',
        aliases: 'Advanced Asian Espionage Group',
        targetSectors: 'Diplomatic & Telecommunications Networks',
        notableCampaign:
          'Uses multi-stage loaders and named-pipe C2 forwarding to maintain stealth inside segmented networks.',
      },
    ],
    realWorldAdvisories: [
      'Kaspersky GReAT (Securelist): ToddyCat — Keep Calm and Continue Espionage (Samurai, Ninja, LoFiSe & TCESB).',
      'ESET Security Advisory & NIST NVD: CVE-2024-11859 DLL Search Order Hijacking in ESET Command Line Scanner.',
      'MITRE ATT&CK T1574.002: Hijack Execution Flow — DLL Side-Loading.',
    ],
    groundedSources: [
      {
        title: 'Kaspersky Securelist — ToddyCat Technical Analysis',
        uri: 'https://securelist.com/toddycat-keep-calm-and-continue-espionage/110698/',
      },
      {
        title: 'NIST NVD — CVE-2024-11859 ESET Command Line Scanner DLL Hijacking',
        uri: 'https://nvd.nist.gov/vuln/detail/CVE-2024-11859',
      },
      {
        title: 'MITRE ATT&CK T1574.002 — Hijack Execution Flow: DLL Side-Loading',
        uri: 'https://attack.mitre.org/techniques/T1574/002/',
      },
    ],
  },
  'kaspersky-lazarus-byovd-fudmodule': {
    scenarioId: 'kaspersky-lazarus-byovd-fudmodule',
    scenarioCode: 'CVE-2024-21338',
    scenarioName: 'Avast, Kaspersky & Microsoft — Lazarus Group: AppLocker appid.sys Zero-Day & FudModule Rootkit',
    summary:
      'Disclosed by Avast Decoded Threat Labs and analyzed by Kaspersky GReAT and Microsoft MSRC, the North Korean Lazarus Group (Diamond Sleet) exploited a zero-day object pointer manipulation flaw (CVE-2024-21338) in the built-in Windows AppLocker driver (appid.sys IOCTL 0x22A018 AipSmartHashImageFile) to flip KTHREAD.PreviousMode to 0 and deploy the FudModule DKOM rootkit, blinding EDR ETW Ti providers and PPL flags without loading any third-party driver.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Avast Threat Labs captured the CVE-2024-21338 zero-day in the wild and dissected how IOCTL 0x22A018 tricks appid.sys into calling ObfDereferenceObjectWithTag on KTHREAD.PreviousMode; Kaspersky GReAT analyzed the KaolinRAT loader and FudModule’s DKOM array (zeroing EPROCESS.Protection and EtwThreatIntProvRegHandle); and MSRC documented the kernel patch and EventID 7040 AppIDSvc telemetry.',
    cves: [
      {
        id: 'CVE-2024-21338',
        cvss: '7.8 HIGH (Local Kernel 0-Day)',
        status: 'CISA KEV · Zero-Day Exploited by Lazarus Group',
        description:
          'Windows AppLocker driver (`appid.sys`) elevation of privilege vulnerability via untrusted function pointer dereference in `AipSmartHashImageFile`.',
      },
    ],
    actorGroups: [
      {
        name: 'Lazarus Group (Diamond Sleet / Labyrinth Chollima)',
        aliases: 'HIDDEN COBRA, Zinc, Nickel Academy',
        targetSectors: 'Defense, Aerospace, Nuclear, Cryptocurrency, Security Researchers',
        notableCampaign:
          'Transitioned from Dell dbutil_2_3.sys BYOVD to native Windows appid.sys CVE-2024-21338 zero-day to run the FudModule DKOM rootkit.',
      },
      {
        name: 'Andariel & BlueNoroff Subgroups',
        aliases: 'DPRK Strategic Cyber Operations',
        targetSectors: 'Financial Institutions, Semiconductor, Defense Industrial Base',
        notableCampaign:
          'Uses kernel-mode DKOM rootkits to zero out EPROCESS protection flags and EtwThreatIntProvRegHandle.',
      },
    ],
    realWorldAdvisories: [
      'Avast Decoded Threat Labs: Lazarus and the FudModule Rootkit — Beyond BYOVD with an Admin-to-Kernel Zero-Day (CVE-2024-21338).',
      'Microsoft Security Response Center (MSRC): CVE-2024-21338 Windows Kernel Elevation of Privilege.',
      'Kaspersky GReAT: Lazarus Group KaolinRAT & FudModule Kernel Callback Blinding Analysis.',
    ],
    groundedSources: [
      {
        title: 'Avast Decoded — Lazarus FudModule & CVE-2024-21338 Zero-Day Analysis',
        uri: 'https://decoded.avast.io/janvojtesek/lazarus-and-the-fudmodule-rootkit-beyond-byovd-with-an-admin-to-kernel-zero-day/',
      },
      {
        title: 'Microsoft MSRC — CVE-2024-21338 Windows Kernel Advisory',
        uri: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21338',
      },
      {
        title: 'MITRE ATT&CK Group G0032 — Lazarus Group',
        uri: 'https://attack.mitre.org/groups/G0032/',
      },
    ],
  },
  'mandiant-apt29-teamcity-jetstream': {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    scenarioCode: 'CVE-2023-42793',
    scenarioName: 'Mandiant, Rapid7/SonarSource & CISA — APT29: JetBrains TeamCity RCE & GraphicalProton',
    summary:
      'Detailed by CISA/FBI/NSA/NCSC-UK (AA23-347A), Mandiant, and SonarSource/Rapid7, APT29 (Midnight Blizzard / Cozy Bear) exploited JetBrains TeamCity CI/CD servers via CVE-2023-42793 (POST /app/rest/users/id:1/tokens/RPC2 RequestInterceptors wildcard bypass) to mint admin bearer tokens, enable /app/rest/debug/processes, and deploy the GraphicalProton backdoor.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: SonarSource & Rapid7 dissected the Java RequestInterceptors /**/RPC2 wildcard bug that leaves /app/rest/users/id:1/tokens/RPC2 unauthenticated and explained how internal.debug.processes.enable=true unlocks RCE; CISA, NSA, FBI & Mandiant (AA23-347A) documented APT29’s GraphicalProton backdoor and CI/CD secret theft; and JetBrains Security published the token-creation audit indicators.',
    cves: [
      {
        id: 'CVE-2023-42793',
        cvss: '9.8 CRITICAL',
        status: 'CISA KEV · Advisory AA23-347A (APT29)',
        description:
          'JetBrains TeamCity on-premises authentication bypass vulnerability allowing unauthenticated creation of administrative bearer tokens and RCE.',
      },
    ],
    actorGroups: [
      {
        name: 'APT29 (Midnight Blizzard / Cozy Bear)',
        aliases: 'NOBELIUM, Cloaked Ursa, BlueBravo, The Dukes',
        targetSectors: 'Software Vendors, IT Providers, Energy, Government, Medical Research',
        notableCampaign:
          'Compromised dozens of JetBrains TeamCity build servers via CVE-2023-42793 to deploy GraphicalProton with DLL side-loading and OneDrive C2.',
      },
      {
        name: 'Lazarus & Ransomware Post-Disclosure Exploiters',
        aliases: 'TeamCity CI/CD Intrusion Clusters',
        targetSectors: 'Software Development & Enterprise Build Pipelines',
        notableCampaign:
          'Abused `/app/rest/debug/processes` to harvest cloud CI/CD secrets and signing certificates.',
      },
    ],
    realWorldAdvisories: [
      'CISA / FBI / NSA / NCSC-UK / CERT.PL Joint Advisory AA23-347A: Russian SVR Exploiting JetBrains TeamCity CVE-2023-42793.',
      'SonarSource & Rapid7 Vulnerability Research: JetBrains TeamCity RequestInterceptors /**/RPC2 Root-Cause Analysis.',
      'JetBrains Security Bulletin: CVE-2023-42793 Critical Authentication Bypass in TeamCity.',
    ],
    groundedSources: [
      {
        title: 'CISA Joint Advisory AA23-347A — SVR Exploiting TeamCity CVE-2023-42793',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-347a',
      },
      {
        title: 'SonarSource — JetBrains TeamCity CVE-2023-42793 Technical Root Cause',
        uri: 'https://www.sonarsource.com/blog/jetbrains-teamcity-averted-supply-chain-attack/',
      },
      {
        title: 'NVD — CVE-2023-42793 JetBrains TeamCity Auth Bypass',
        uri: 'https://nvd.nist.gov/vuln/detail/CVE-2023-42793',
      },
    ],
  },
  'splunk-screenconnect-slashandgrab': {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    scenarioCode: 'CVE-2024-1709',
    scenarioName: 'Huntress & Splunk SURGe — ScreenConnect SlashAndGrab (CVE-2024-1709) Auth Bypass',
    summary:
      'Documented by Huntress ("SlashAndGrab"), Splunk SURGe, and ConnectWise, CVE-2024-1709 (CVSS 10.0) allows unauthenticated attackers to append an extra slash (/SetupWizard.aspx/) so ASP.NET populates Request.PathInfo, bypassing the setup-lock check to re-run the installation wizard, overwrite App_Data\\User.xml with a rogue admin account, and push SYSTEM scripts across managed endpoints via ScreenConnect.ClientService.exe.',
    multiSourceSynthesis:
      'Cross-vendor synthesis: Huntress ("SlashAndGrab") reverse-engineered the ASP.NET Request.PathInfo /SetupWizard.aspx/ authentication bypass, App_Data\\User.xml overwrite, and C:\\Windows\\Temp\\ScreenConnect\\ endpoint execution; Splunk SURGe authored the SIEM SPL & Sysmon EventID 1/11 detection queries; and ConnectWise & CISA KEV documented the companion CVE-2024-1708 ZipSlip extension path-traversal bug.',
    cves: [
      {
        id: 'CVE-2024-1709',
        cvss: '10.0 CRITICAL',
        status: 'CISA KEV · Exploited in Wild',
        description:
          'ConnectWise ScreenConnect authentication bypass using an alternate path or channel (`/SetupWizard.aspx/`).',
      },
      {
        id: 'CVE-2024-1708',
        cvss: '8.4 HIGH',
        status: 'CISA KEV · Path Traversal ZipSlip',
        description:
          'ConnectWise ScreenConnect path traversal vulnerability allowing extension archives to write files outside the intended directory.',
      },
    ],
    actorGroups: [
      {
        name: 'BlackBasta, LockBit & ToddyCat Affiliates',
        aliases: 'MSP Supply-Chain Intrusion Operators',
        targetSectors: 'Managed Service Providers (MSPs), Healthcare, Local Government',
        notableCampaign:
          'Exploited `/SetupWizard.aspx/` within hours of disclosure to overwrite User.xml and mass-deploy Cobalt Strike and ransomware to customer agents.',
      },
      {
        name: 'Static Tundra & State Espionage Actors',
        aliases: 'Opportunistic RMM Exploitation Clusters',
        targetSectors: 'IT Services, Defense Contractors, Enterprise Networks',
        notableCampaign:
          'Abused compromised ScreenConnect servers as persistent SYSTEM command-and-control hubs.',
      },
    ],
    realWorldAdvisories: [
      'Huntress Security Research: SlashAndGrab — ScreenConnect Post-Exploitation in the Wild (CVE-2024-1709 & CVE-2024-1708).',
      'Splunk SURGe: ConnectWise ScreenConnect Authentication Bypass (CVE-2024-1709 & CVE-2024-1708) Detection.',
      'ConnectWise Security Bulletin (Feb 19, 2024): ScreenConnect 23.9.8 Critical Patch.',
    ],
    groundedSources: [
      {
        title: 'Huntress — SlashAndGrab ScreenConnect CVE-2024-1709 Technical Analysis',
        uri: 'https://www.huntress.com/blog/slashandgrab-screen-connect-post-exploitation-in-the-wild-cve-2024-1709-cve-2024-1708',
      },
      {
        title: 'Splunk SURGe — ScreenConnect CVE-2024-1709 Analysis & SPL Rules',
        uri: 'https://www.splunk.com/en_us/blog/security/connectwise-screenconnect-cve-2024-1709-cve-2024-1708.html',
      },
      {
        title: 'ConnectWise Trust Center — ScreenConnect 23.9.8 Security Bulletin',
        uri: 'https://www.connectwise.com/company/trust/security-bulletins/connectwise-screenconnect-23.9.8',
      },
    ],
  },
  ...BATCH_1_TO_4_CURATED_INTEL,
};

export function getCuratedThreatIntel(
  scenario: AttackScenario
): ThreatIntelContextData {
  const base =
    CURATED_THREAT_INTEL[scenario.id] ||
    CURATED_THREAT_INTEL['process-hollowing'];
  return {
    ...base,
    scenarioId: scenario.id,
    scenarioCode: scenario.code,
    scenarioName: scenario.name,
    sourceMode: 'CURATED_INTELLIGENCE_CACHE',
    fetchedAt: new Date().toISOString(),
  };
}
