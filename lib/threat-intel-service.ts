import { AttackScenario, MITRE_PHASES } from './scenarios/types';
import { ATTACK_SCENARIOS } from './attack-scenarios';

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
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1055.012 — Process Injection: Process Hollowing',
        uri: 'https://attack.mitre.org/techniques/T1055/012/',
      },
      {
        title: 'CISA Known Exploited Vulnerabilities (KEV) Catalog',
        uri: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
      },
    ],
  },
  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    scenarioCode: 'T1190 / CVE-2021-44228',
    scenarioName: 'Log4Shell JNDI Injection & Post-Exploitation',
    summary:
      'Apache Log4j2 JNDI lookup injection (CVE-2021-44228) enables unauthenticated remote code execution when untrusted HTTP headers or parameters containing ${jndi:ldap://...} strings are logged by vulnerable JVM services.',
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
    ],
  },
  'amsi-reflective-dll': {
    scenarioId: 'amsi-reflective-dll',
    scenarioCode: 'T1562.001 / T1620',
    scenarioName: 'In-Memory AMSI Bypass & Reflective DLL Loading',
    summary:
      'Fileless PowerShell and CLR post-exploitation frameworks routinely patch amsi.dll!AmsiScanBuffer in virtual memory before invoking [System.Reflection.Assembly]::Load() or reflective PE loaders so payloads never touch NTFS disk.',
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
    ],
  },
  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    scenarioCode: 'T1558.003 / T1550.002',
    scenarioName: 'Active Directory Kerberoasting & Pass-the-Hash Lateral Movement',
    summary:
      'Kerberoasting abuses the Kerberos Ticket Granting Service (TGS-REQ) by requesting RC4-HMAC (0x17) encrypted service tickets for Active Directory accounts with registered SPNs, cracking them offline to escalate privileges and move laterally.',
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
    ],
  },
  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    scenarioCode: 'T1071.004 / T1048.003',
    scenarioName: 'Covert DNS Tunneling Data Exfiltration & C2',
    summary:
      'DNS Tunneling encapsulates sensitive data chunks and C2 commands inside high-entropy Base32/Hex subdomain labels over UDP port 53, bypassing perimeter firewalls that block direct outbound HTTP/S traffic by abusing recursive corporate DNS resolvers.',
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
    ],
    groundedSources: [
      {
        title: 'MITRE ATT&CK T1071.004 — Application Layer Protocol: DNS',
        uri: 'https://attack.mitre.org/techniques/T1071/004/',
      },
      {
        title: 'MITRE ATT&CK T1048.003 — Exfiltration Over Alternative Protocol',
        uri: 'https://attack.mitre.org/techniques/T1048/003/',
      },
    ],
  },
  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    scenarioCode: 'T1490 / T1486',
    scenarioName: 'LockBit-Style Volume Shadow Copy Wipe & Encryption',
    summary:
      'Human-operated ransomware groups systematically inhibit system recovery (T1490) by deleting Volume Shadow Copies via vssadmin.exe, wmic, or WMI COM APIs and disabling Windows Recovery Environment via bcdedit.exe before launching multi-threaded hybrid encryption (T1486).',
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
    ],
  },
  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    scenarioCode: 'CVE-2024-3400',
    scenarioName: 'Unit 42 — Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor',
    summary:
      'Disclosed by Palo Alto Networks Unit 42 in April 2024, Operation MidnightEclipse (UTA0218) exploited zero-day CVE-2024-3400 (CVSS 10.0) in PAN-OS GlobalProtect via SESSID cookie path traversal and sendTelemetry cron command injection to deploy the UPSTYLE Python backdoor.',
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
          'Exploited CVE-2024-3400 zero-day to plant the in-memory UPSTYLE backdoor in update.py and exfiltrate running-config.xml.',
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
      'Palo Alto Networks Unit 42 Threat Brief: Operation MidnightEclipse (CVE-2024-3400).',
      'Palo Alto Networks Security Advisory PAN-SA-2024-0005 (CVE-2024-3400).',
    ],
    groundedSources: [
      {
        title: 'Unit 42 — Operation MidnightEclipse & CVE-2024-3400 Analysis',
        uri: 'https://unit42.paloaltonetworks.com/cve-2024-3400/',
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
      'Discovered by Elastic Security Labs in June 2024, GrimResource abuses a cross-site scripting (XSS) flaw in Windows apds.dll (apds:// URI protocol) inside crafted Microsoft Management Console (.msc) files to execute arbitrary JScript/VBScript and .NET payloads via mmc.exe without macro warnings.',
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
      'MITRE ATT&CK T1218.014: System Binary Proxy Execution — MMC.',
    ],
    groundedSources: [
      {
        title: 'Elastic Security Labs — GrimResource Technical Analysis',
        uri: 'https://www.elastic.co/security-labs/grimresource',
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
      'Documented by Elastic Security Labs, Lotus Blossom (Spring Dragon / Billbug) uses a legitimate signed Notepad++ updater binary (GUP.exe) to side-load a malicious libcurl.dll, decrypting the CHRYSALIS backdoor in memory with API hashing and custom HTTPS C2.',
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
      'MITRE ATT&CK Group G0030 (Lotus Blossom) & T1574.002 (DLL Side-Loading).',
    ],
    groundedSources: [
      {
        title: 'Elastic Security Labs — Threat Research & APT Intrusion Analysis',
        uri: 'https://www.elastic.co/security-labs',
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
      'Profiled by Palo Alto Networks Unit 42 and CISA (AA23-320A), Muddled Libra (Scattered Spider / Octo Tempest) combines IT helpdesk social engineering and rogue MFA device registration in Okta/Entra ID with commercial RMM tools and Active Directory ESX Admins group manipulation to compromise AWS and VMware ESXi.',
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
    ],
  },
  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    scenarioCode: 'T1620',
    scenarioName: 'Elastic & Mandiant — APT41 (Brass Typhoon): DodgeBox, Call-Stack Spoofing & DUSTPAN Loader',
    summary:
      'Analyzed by Elastic Security Labs and Mandiant/Google TAG, APT41 (Brass Typhoon / Wicked Panda) uses the DodgeBox and DUSTPAN loaders with synthetic thread call-stack spoofing (RtlUserThreadStart -> BaseThreadInitThunk), CFG bypass, and AES-GCM decryption to execute STEALTHVECTOR and MOONWALK in memory.',
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
        aliases: 'Barium, Winnti, Earth Baku, HOODOO',
        targetSectors: 'Telecommunications, Government, Technology, Healthcare, Media',
        notableCampaign:
          'Deployed DodgeBox, DUSTPAN, STEALTHVECTOR, and MOONWALK (Google Drive C2) across global enterprise targets.',
      },
      {
        name: 'Earth Freyja & ShadowPad Affiliates',
        aliases: 'APT41 Sub-Clusters',
        targetSectors: 'Semiconductor, Aviation, Logistics',
        notableCampaign:
          'Uses signed binary side-loading and call-stack spoofing to blind endpoint memory scanners.',
      },
    ],
    realWorldAdvisories: [
      'Elastic Security Labs & Mandiant: APT41 DUSTPAN, DodgeBox, and STEALTHVECTOR Analysis.',
      'MITRE ATT&CK Group G0096 (APT41) & Technique T1620 (Reflective Code Loading).',
    ],
    groundedSources: [
      {
        title: 'Elastic Security Labs — APT & Loader Evasion Research',
        uri: 'https://www.elastic.co/security-labs',
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
      'Detailed by Microsoft Threat Intelligence and CISA (AA24-038A), Volt Typhoon (Bronze Silhouette) compromises SOHO routers (KV Botnet) and maintains multi-year stealth inside critical infrastructure using exclusively native Windows binaries (wmic, ntdsutil IFM media creation, and netsh interface portproxy).',
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
    ],
  },
  'ms-midnight-blizzard-oauth': {
    scenarioId: 'ms-midnight-blizzard-oauth',
    scenarioCode: 'T1098.003',
    scenarioName: 'Microsoft Threat Intel — Midnight Blizzard (APT29): OAuth App Privilege Escalation',
    summary:
      'Reported by Microsoft Threat Intelligence in January 2024, Midnight Blizzard (APT29 / Cozy Bear) used a distributed residential proxy password spray to breach a legacy non-production test tenant, then abused an OAuth application with Directory.ReadWrite.All to grant full_access_as_app across Exchange Online.',
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
    ],
  },
  'ms-salt-typhoon-telecom': {
    scenarioId: 'ms-salt-typhoon-telecom',
    scenarioCode: 'T1014',
    scenarioName: 'Microsoft Threat Intel & CISA — Salt Typhoon: Telecom Core Router Compromise & Demodex Rootkit',
    summary:
      'Documented by Microsoft Threat Intelligence and CISA/FBI/NSA (AA24-338A), Salt Typhoon (GhostEmperor / FamousSparrow) compromises telecommunications backbone routers (Cisco IOS XE Guest Shell), captures TACACS+/RADIUS credentials, and deploys the signed kernel-mode Demodex rootkit (`Nguv64.sys`) on Windows mediation servers.',
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
      'CISA / NSA / FBI Joint Guide (Dec 2024): Enhanced Visibility and Hardening Guidance for Communications Infrastructure (Salt Typhoon).',
      'Kaspersky & Microsoft Threat Intelligence: GhostEmperor Demodex Rootkit & Telecom Intrusion Analysis.',
    ],
    groundedSources: [
      {
        title: 'CISA — Enhanced Visibility & Hardening for Communications Infrastructure',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-338a',
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
      'Published by Microsoft Threat Intelligence in April 2024, Forest Blizzard (APT28 / Fancy Bear / Fighting Ursa) deployed the custom GooseEgg launcher to exploit CVE-2022-38028 in Windows Print Spooler (`spoolsv.exe`) by modifying a JavaScript constraints file (`MPDW-constraints.js`) to register a malicious COM server (`wayzgoose.dll`) as SYSTEM.',
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
    ],
    groundedSources: [
      {
        title: 'Microsoft Security Blog — Forest Blizzard GooseEgg Tool Analysis',
        uri: 'https://www.microsoft.com/en-us/security/blog/2024/04/22/analyzing-forest-blizzards-custom-post-compromise-tool-for-exploiting-cve-2022-38028-to-obtain-credentials/',
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
      'Documented by Microsoft Threat Intelligence, Palo Alto Networks Unit 42, and CISA (AA23-341A), Star Blizzard (SEABORGIUM / Callisto) and Storm-0539 deploy Evilginx Adversary-in-the-Middle (AiTM) reverse proxies in front of Microsoft Entra ID login endpoints to intercept MFA-authenticated `ESTSAUTH` / `ESTSAUTHPERSISTENT` session cookies.',
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
    ],
  },
  'talos-arcanedoor-asa': {
    scenarioId: 'talos-arcanedoor-asa',
    scenarioCode: 'CVE-2024-20353',
    scenarioName: 'Cisco Talos — ArcaneDoor: UAT4356 ASA/FTD Line Dancer & Line Runner Espionage',
    summary:
      'Uncovered by Cisco Talos in April 2024, the ArcaneDoor campaign (UAT4356 / STORM-1849) targeted Cisco ASA and FTD perimeter firewalls using CVE-2024-20353 and CVE-2024-20359 to deploy Line Dancer (in-memory shellcode interpreter via AAA SAML/IPsec fields) and Line Runner (persistent Lua/WebVPN backdoor).',
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
      'NCSC UK, CISA & Canadian Cyber Centre Joint Advisory on ArcaneDoor (UAT4356).',
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
    ],
  },
  'talos-fortinet-coathanger-apt': {
    scenarioId: 'talos-fortinet-coathanger-apt',
    scenarioCode: 'CVE-2024-21762',
    scenarioName: 'FortiGuard, NCSC-NL & Talos — COATHANGER RAT: FortiOS SSL-VPN & preload.so Rootkit',
    summary:
      'Disclosed by the Dutch Military Intelligence and Security Service (MIVD), NCSC-NL, and FortiGuard Labs in February 2024, state-sponsored actors exploited FortiOS SSL-VPN out-of-bounds write vulnerabilities (CVE-2022-42475 / CVE-2024-21762) against the Dutch Ministry of Defence to deploy COATHANGER, a stealthy persistent RAT that hooks `ld.so` via `preload.so` and survives firmware updates by infecting `smartctl`.',
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
          'Deployed COATHANGER (`preload.so`, `httpsd`, and modified `smartctl`) on FortiGate appliances to maintain hidden access across firmware upgrades.',
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
    ],
    groundedSources: [
      {
        title: 'NCSC-NL & MIVD — COATHANGER Technical Analysis Report',
        uri: 'https://www.ncsc.nl/binaries/ncsc/documenten/publicaties/2024/februari/6/mivd-aivd-advisory-coathanger-tlp-clear/TLP-CLEAR+MIVD+AIVD+Advisory+COATHANGER.pdf',
      },
      {
        title: 'FortiGuard PSIRT Advisory FG-IR-24-015 (CVE-2024-21762)',
        uri: 'https://www.fortiguard.com/psirt/FG-IR-24-015',
      },
    ],
  },
  'f5-bigip-request-smuggling': {
    scenarioId: 'f5-bigip-request-smuggling',
    scenarioCode: 'CVE-2023-46747',
    scenarioName: 'F5 SIRT & ProjectDiscovery — BIG-IP TMUI AJP Request Smuggling & Root RCE',
    summary:
      'Documented by F5 SIRT (K000137353), Praetorian, and ProjectDiscovery, CVE-2023-46747 (CVSS 9.8) exploits an Apache httpd `mod_proxy_ajp` request smuggling flaw on F5 BIG-IP TMUI (`/tmui/Control/jspmap/tmui/system/user/authproperties.jsp`) to inject `REMOTEROLE: 0` and `REMOTEUSER: admin` into Tomcat, create a rogue admin user, and execute arbitrary root commands via `/mgmt/tm/util/bash`.',
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
    ],
  },
  'splunk-ivanti-connect-secure': {
    scenarioId: 'splunk-ivanti-connect-secure',
    scenarioCode: 'CVE-2024-21887',
    scenarioName: 'Mandiant & Splunk SURGe — UNC5221 Ivanti Connect Secure Zero-Day & ZIPLINE',
    summary:
      'Uncovered by Mandiant and analyzed by Splunk SURGe in January 2024, UNC5221 chained zero-days CVE-2023-46805 (authentication bypass) and CVE-2024-21887 (command injection) on Ivanti Connect Secure VPN appliances to inject the ZIPLINE passive ELF backdoor (`libsecure.so`) and WARPWIRE JavaScript credential harvester.',
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
        name: 'UNC5221',
        aliases: 'Cutting Edge Campaign Espionage Actor',
        targetSectors: 'Defense Industrial Base, Government, Aerospace, Finance, Telecom',
        notableCampaign:
          'Deployed ZIPLINE (LD_PRELOAD libsecure.so hooking accept() for SSH-2.0-OpenSSH_0.3xx) and WARPWIRE on Ivanti VPN gateways.',
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
      'Mandiant: Cutting Edge — Suspected APT Targets Ivanti Connect Secure VPN in New Zero-Day Exploitation.',
      'CISA Emergency Directive 24-01: Mitigate Ivanti Connect Secure and Policy Secure Vulnerabilities.',
    ],
    groundedSources: [
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
    scenarioName: 'Splunk SURGe & CISA — Citrix Bleed (CVE-2023-4966) NSC_AAAC Session Hijack',
    summary:
      'Analyzed by Splunk SURGe and CISA (AA23-325A), Citrix Bleed (CVE-2023-4966) exploits an unsafe `snprintf` return-value usage in Citrix NetScaler ADC/Gateway (`/oauth/idp/.well-known/openid-configuration`) via an oversized HTTP Host header to leak uninitialized heap memory containing valid 64-byte `NSC_AAAC` session tokens, bypassing MFA.',
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
      'Splunk SURGe: Citrix Bleed (CVE-2023-4966) Vulnerability Analysis and Detection Guidance.',
      'CISA / FBI / MS-ISAC Joint Advisory AA23-325A: Threat Actors Exploit Citrix Bleed (CVE-2023-4966).',
    ],
    groundedSources: [
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
      'Discovered by Kaspersky GReAT in 2023, Operation Triangulation used a 4-zero-day chain—a zero-click Apple iMessage TrueType font ADJUST instruction RCE (CVE-2023-41990), integer overflow (CVE-2023-32434), undocumented Apple A-series SoC hardware MMIO register PPL bypass (CVE-2023-38606), and Safari stage—to deploy the in-memory TriangleDB implant.',
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
      'Kaspersky GReAT (37C3 & Securelist): Operation Triangulation — The Last (Hardware) Mystery.',
      'Kaspersky GReAT: Dissecting TriangleDB, the Operation Triangulation iOS Implant.',
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
    ],
  },
  'kaspersky-toddycat-eset-dll': {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    scenarioCode: 'T1574.002',
    scenarioName: 'Kaspersky GReAT — ToddyCat APT: ESET DLL Side-Loading, Samurai & TomBerBil',
    summary:
      'Documented by Kaspersky GReAT, ToddyCat APT uses legitimate signed ESET Command Line Scanner (`ecls.exe`) to side-load a malicious `version.dll` / `eclsLang.dll` loader (`LoFiSe`), injecting the modular Samurai passive backdoor into `svchost.exe` and deploying the TomBerBil stealer to extract browser DPAPI tokens.',
    cves: [
      {
        id: 'MITRE-T1574.002',
        cvss: '8.7 HIGH',
        status: 'Active ToddyCat Espionage Campaign',
        description:
          'DLL Side-Loading via signed ESET ecls.exe binary to decrypt and inject Samurai and Ninja implants into svchost.exe.',
      },
    ],
    actorGroups: [
      {
        name: 'ToddyCat APT',
        aliases: 'Samurai / Ninja / TomBerBil Operator',
        targetSectors: 'Government Ministries, Military, Defense Contractors (Europe & Asia)',
        notableCampaign:
          'Pivoted from Exchange servers to workstations using ESET ecls.exe side-loading, Samurai passive C2, and TomBerBil credential theft.',
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
      'Kaspersky GReAT (Securelist): ToddyCat — Keep Calm and Check Logs & Staying Under the Radar.',
      'MITRE ATT&CK Software & Technique Analysis: ToddyCat Samurai & Ninja Toolset.',
    ],
    groundedSources: [
      {
        title: 'Kaspersky Securelist — ToddyCat Technical Analysis',
        uri: 'https://securelist.com/toddycat-keep-calm-and-check-logs/110696/',
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
    scenarioName: 'Kaspersky & Avast — Lazarus Group: AppLocker appid.sys Zero-Day & FudModule Rootkit',
    summary:
      'Disclosed by Avast and analyzed by Kaspersky GReAT in 2024, the North Korean Lazarus Group exploited a zero-day object pointer manipulation vulnerability (CVE-2024-21338) in the native Windows AppLocker driver (`appid.sys` IOCTL `0x22A018` `AipSmartHashImageFile`) to achieve arbitrary kernel read/write and deploy the FudModule rootkit, blinding EDR ETW Ti providers and PPL flags without loading third-party drivers.',
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
      'Avast Threat Labs & Kaspersky GReAT: Lazarus Group FudModule Rootkit and CVE-2024-21338 Zero-Day Analysis.',
      'Microsoft Security Response Center (MSRC): CVE-2024-21338 Windows Kernel Elevation of Privilege.',
    ],
    groundedSources: [
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
    scenarioName: 'Mandiant, Microsoft & CISA — APT29: JetBrains TeamCity RCE & GraphicalProton',
    summary:
      'Detailed by CISA/FBI/NSA/NCSC-UK (AA23-347A), Mandiant, and Microsoft Threat Intelligence, APT29 (Midnight Blizzard / Cozy Bear) conducted mass exploitation of JetBrains TeamCity CI/CD servers via CVE-2023-42793 (`GET /app/rest/users/id:1/tokens/RPC2` authentication bypass) to execute commands via `/app/rest/debug/processes` and deploy the GraphicalProton backdoor (OneDrive/Dropbox C2).',
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
      'CISA / FBI / NSA / NCSC-UK / CERT.PL Joint Advisory AA23-347A: Russian Foreign Intelligence Service (SVR) Exploiting JetBrains TeamCity CVE-2023-42793.',
      'JetBrains Security Bulletin: CVE-2023-42793 Critical Authentication Bypass in TeamCity.',
    ],
    groundedSources: [
      {
        title: 'CISA Joint Advisory AA23-347A — SVR Exploiting TeamCity CVE-2023-42793',
        uri: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-347a',
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
    scenarioName: 'Splunk SURGe & Huntress — ScreenConnect SlashAndGrab (CVE-2024-1709) Auth Bypass',
    summary:
      'Documented by Splunk SURGe and Huntress ("SlashAndGrab"), CVE-2024-1709 (CVSS 10.0) allows unauthenticated attackers to append an extra slash (`/SetupWizard.aspx/`) to ConnectWise ScreenConnect URLs, re-run the installation wizard, overwrite `App_Data\\User.xml` with a rogue admin account, and push SYSTEM commands across managed endpoints via `ScreenConnect.ClientService.exe`.',
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
      'Splunk SURGe: ConnectWise ScreenConnect Authentication Bypass (CVE-2024-1709 & CVE-2024-1708) Detection.',
      'ConnectWise Security Bulletin (Feb 19, 2024): ScreenConnect 23.9.8 Critical Patch.',
    ],
    groundedSources: [
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


