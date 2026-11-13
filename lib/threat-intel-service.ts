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
