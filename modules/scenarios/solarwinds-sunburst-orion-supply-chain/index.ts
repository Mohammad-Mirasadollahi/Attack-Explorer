import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';
import { SUNBURST_TELEMETRY } from './telemetry';

export const scenario: AttackScenario = {
  id: 'solarwinds-sunburst-orion-supply-chain',
  code: 'T1195.002',
  name: 'SolarWinds SUNSPOT Build-Server Hijack, SUNBURST Backdoor & Golden SAML',
  shortSubtitle: 'Supply Chain & CI/CD · Mid-Compile Source Swap, Valid Authenticode, DGA CNAME & AD FS Golden SAML',
  category: 'SUPPLY_CHAIN_CICD',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'APT29 deploys the SUNSPOT implant onto SolarWinds build server BLD-ORION-02 to swap InventoryManager.cs mid-compilation, embedding the SUNBURST backdoor inside genuinely Authenticode-signed SolarWinds.Orion.Core.BusinessLayer.dll across ~18,000 organizations before waking after 14 days to beacon via avsvmcloud.com DGA DNS and pivot selectively through TEARDROP into AD FS Golden SAML forgery.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1195.002 (Supply Chain) · T1553.002 (Code Signing) · T1568.002 (DGA) · T1552.004' },
    { term: 'BUILD IMPLANT', value: 'SUNSPOT (taskhostsvc.exe PID 3912) Hooks MsBuild.exe for 4.2s' },
    { term: 'SIGNED BACKDOOR', value: 'SolarWinds.Orion.Core.BusinessLayer.dll (Valid Vendor Authenticode)' },
    { term: 'STEALTH C2', value: '12-14 Day Dormancy + FNV-1a EDR Blocklist + *.avsvmcloud.com CNAME' },
    { term: 'CLOUD PIVOT', value: 'TEARDROP Memory Loader -> AD FS Token-Signing Key -> Golden SAML' },
    { term: 'CASE GROUNDING', value: 'CrowdStrike SUNSPOT, FireEye/Mandiant SUNBURST, CISA ED 21-01 & MSTIC' },
  ],
  nodes: [
    {
      id: 'build-server',
      label: 'Orion CI/CD Build Server',
      sublabel: 'BLD-ORION-02 · SUNSPOT PID 3912',
      role: 'victim_host',
      x: 8,
      y: 26,
      details: {
        osOrType: 'Vendor Windows CI/CD Build Host (BLD-ORION-02)',
        pidOrPort: 'taskhostsvc.exe PID 3912 -> MsBuild.exe',
        privilege: 'NT AUTHORITY\\SYSTEM (Build Pipeline)',
        artifacts: [
          'Polls every second for MsBuild.exe compiling Orion Core solution',
          'Replaces InventoryManager.cs with backdoored source for 4.2 seconds',
          'Restores clean file immediately so Git history shows zero diffs',
        ],
        description:
          'Compromised vendor build machine where SUNSPOT intercepts .NET compilation before signing without modifying Git repositories.',
      },
    },
    {
      id: 'signing-cdn',
      label: 'Code-Signing & Update CDN',
      sublabel: 'Valid SolarWinds Authenticode',
      role: 'server',
      x: 28,
      y: 26,
      details: {
        osOrType: 'Automated Release Signing & Enterprise Update Distribution',
        pidOrPort: 'HTTPS Update CDN · Valid X.509 Cert',
        privilege: 'Trusted Vendor Publisher Authority',
        artifacts: [
          'Signs trojanized BusinessLayer.dll with genuine SolarWinds certificate',
          'Distributes official hotfix to ~18,000 enterprise and government networks',
          'Valid publisher signature bypasses default AV/EDR trust allowlists',
        ],
        description:
          'Legitimate vendor release and signing pipeline that unknowingly certifies and distributes the backdoored Orion update.',
      },
    },
    {
      id: 'orion-host',
      label: 'Victim Orion Server',
      sublabel: 'ORION-MON-01 · PID 4120 SYSTEM',
      role: 'process',
      x: 50,
      y: 22,
      details: {
        osOrType: 'Enterprise IT Monitoring Appliance (ORION-MON-01)',
        pidOrPort: 'SolarWinds.BusinessLayerHost.exe (SYSTEM)',
        privilege: 'NT AUTHORITY\\SYSTEM · AD Domain Joined',
        artifacts: [
          'Loads signed SolarWinds.Orion.Core.BusinessLayer.dll (Sysmon EID 7)',
          'Sleeps 12 to 14 days and checks FNV-1a hashed EDR blocklist',
          'Executes OrionImprovementBusinessLayer.Initialize() silently',
        ],
        description:
          'High-privilege customer monitoring server executing the signed backdoor under SYSTEM privileges after a two-week dormancy period.',
      },
    },
    {
      id: 'dga-dns',
      label: 'SUNBURST DGA DNS',
      sublabel: '*.appsync-api.*.avsvmcloud.com',
      role: 'dns_resolver',
      x: 74,
      y: 24,
      details: {
        osOrType: 'APT29 Selective Triage DGA DNS Infrastructure',
        pidOrPort: 'UDP/53 · Base32 Subdomain -> CNAME',
        privilege: 'External Attacker Command Authority',
        artifacts: [
          'Decodes victim AD domain names embedded in custom Base32 labels',
          'Returns inert IPs to low-priority victims so malware stays dormant',
          'Returns CNAME alias (freescanonline.com) strictly to priority targets',
        ],
        description:
          'External DGA DNS infrastructure enabling selective target triage before issuing stage-2 HTTPS C2 CNAME activation records.',
      },
    },
    {
      id: 'adfs-cloud',
      label: 'AD FS & Cloud Tenant',
      sublabel: 'TEARDROP -> Golden SAML Forgery',
      role: 'domain_controller',
      x: 72,
      y: 66,
      details: {
        osOrType: 'On-Premises AD FS (ADFS-01) & Federated Cloud Identity',
        pidOrPort: 'SAML 2.0 Token-Signing Private Key',
        privilege: 'Federated Tenant-Wide Impersonation',
        artifacts: [
          'TEARDROP memory loader launches Cobalt Strike Beacon on target hosts',
          'Exports AD FS token-signing certificate private key from ADFS-01',
          'Mints offline Golden SAML assertions bypassing MFA with zero AD FS logs',
        ],
        description:
          'Identity federation boundary abused once APT29 steals the AD FS token-signing key to forge offline cloud SAML assertions.',
      },
    },
    {
      id: 'siem-soc',
      label: 'SOC SIEM & CISA ED 21-01',
      sublabel: 'YARA + DNS + ADFS EID 1200 Audit',
      role: 'firewall_siem',
      x: 34,
      y: 68,
      details: {
        osOrType: 'Enterprise DFIR Detection & Reproducible-Build Governance',
        pidOrPort: 'Sysmon 7/11/22 + KQL SAML Anti-Join',
        privilege: 'SOC Threat Hunting & Containment',
        artifacts: [
          'YARA scans catch OrionImprovementBusinessLayer inside signed DLLs',
          'Suricata & RPZ block *.avsvmcloud.com DGA CNAME beacons',
          'KQL left-anti join catches cloud SAML sign-ins lacking AD FS EID 1200',
        ],
        description:
          'Multi-plane DFIR detection layer correlating CI/CD file integrity, signed-DLL YARA scans, DNS DGA blocks, and SAML reconciliation.',
      },
    },
  ],
  processTree: [
    {
      pid: 3912,
      ppid: 680,
      name: 'taskhostsvc.exe (SUNSPOT Build-Server Implant)',
      commandLine: 'C:\\Windows\\System32\\taskhostsvc.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateToolhelp32Snapshot() -> Detects MsBuild.exe compiling Orion Core',
        'ReplaceFileW(InventoryManager.cs) -> Injects SUNBURST & restores clean file in 4.2s',
      ],
    },
    {
      pid: 4120,
      ppid: 680,
      name: 'SolarWinds.BusinessLayerHost.exe (Signed Trojanized Host)',
      commandLine: '"C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'CLR Load: SolarWinds.Orion.Core.BusinessLayer.dll (Valid Authenticode)',
        'DnsQuery_W("7sb13g8e5k2p9r4t.appsync-api.us-west-2.avsvmcloud.com") -> CNAME C2',
      ],
      memoryBlocks: [
        {
          address: '0x000001A420100000',
          section: 'Trojanized MSIL · OrionImprovementBusinessLayer.Initialize()',
          permissions: 'R-X',
          size: '128 KB',
          status: 'injected',
          description:
            'Compiled .NET MSIL bytecode inserted by SUNSPOT inside legitimately signed BusinessLayer.dll containing 14-day sleep and FNV-1a EDR blocklist.',
          hexPreview: '4F 72 69 6F 6E 49 6D 70 72 6F 76 65 6D 65 6E 74  OrionImprovement',
        },
        {
          address: '0x000001A420140000',
          section: 'TEARDROP In-Memory Dropper · Unbacked Cobalt Strike Beacon',
          permissions: 'RWX',
          size: '256 KB',
          status: 'shellcode',
          description:
            'Memory-only C++ loader decoding an embedded Beacon payload from a fake JPG to pivot toward ADFS-01 and export the token-signing private key.',
          hexPreview: '54 45 41 52 44 52 4F 50 5F 4D 45 4D 5F 42 43 4E  TEARDROP_MEM_BCN',
        },
        {
          address: '0x000001A420190000',
          section: 'Reproducible SLSA-3 Build & HSM SAML Verification Posture',
          permissions: 'R--',
          size: '32 KB',
          status: 'clean',
          description:
            'Clean hermetic build hash matching verified Git commit alongside HSM-backed AD FS signing keys and Entra ID/EID 1200 correlation.',
          hexPreview: '53 4C 53 41 5F 4C 33 5F 56 45 52 49 46 49 45 44  SLSA_L3_VERIFIED',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SUNSPOT Build-Server Hook Swaps InventoryManager.cs Mid-Compile',
      subtitle: 'In-Flight Source Tampering Leaves Zero Git Commits or Build Warnings',
      description:
        'On BLD-ORION-02, SUNSPOT (PID 3912) polls for MsBuild.exe, swaps InventoryManager.cs for 4.2 seconds to embed OrionImprovementBusinessLayer.Initialize(), and restores the clean source file immediately.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1195.002',
      mitreTechniqueName: 'Supply Chain Compromise: Compromise Software Supply Chain',
      activeNodeIds: ['build-server', 'signing-cdn', 'siem-soc'],
      compromisedNodeIds: ['build-server'],
      keySpecs: [
        { term: 'BUILD IMPLANT', value: 'SUNSPOT (taskhostsvc.exe PID 3912)' },
        { term: 'SWAP WINDOW', value: 'InventoryManager.cs Replaced & Restored in 4.2s' },
        { term: 'REPO EVASION', value: 'Zero Unauthorized Git Commits or Build Failures' },
      ],
    },
    {
      index: 2,
      title: 'Genuine Authenticode Signing & Enterprise Update Distribution',
      subtitle: 'Valid SolarWinds Digital Signature Carries SUNBURST Into ~18,000 Networks',
      description:
        'SolarWinds release machinery signs the compiled trojanized SolarWinds.Orion.Core.BusinessLayer.dll with a genuine Authenticode certificate, distributing SYSTEM-level backdoor execution worldwide.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1553.002',
      mitreTechniqueName: 'Subvert Trust Controls: Code Signing',
      activeNodeIds: ['signing-cdn', 'orion-host', 'siem-soc'],
      compromisedNodeIds: ['build-server', 'signing-cdn', 'orion-host'],
      keySpecs: [
        { term: 'VALID SIGNER', value: 'SolarWinds Worldwide, LLC (Trusted Authenticode)' },
        { term: 'HOST PROCESS', value: 'SolarWinds.BusinessLayerHost.exe (PID 4120 SYSTEM)' },
        { term: 'BLAST RADIUS', value: '~18,000 Enterprise & Government Monitoring Servers' },
      ],
    },
    {
      index: 3,
      title: '14-Day Dormancy & Encoded avsvmcloud.com DGA DNS Beacon',
      subtitle: 'FNV-1a EDR Blocklist & Selective DNS CNAME Activation for High-Value Victims',
      description:
        'After sleeping 12-14 days and verifying AD membership, SUNBURST encodes the victim domain into Base32 subdomains under *.appsync-api.*.avsvmcloud.com awaiting a selective CNAME C2 cue.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1568.002',
      mitreTechniqueName: 'Dynamic Resolution: Domain Generation Algorithms',
      activeNodeIds: ['orion-host', 'dga-dns', 'siem-soc'],
      compromisedNodeIds: ['build-server', 'signing-cdn', 'orion-host', 'dga-dns'],
      keySpecs: [
        { term: 'DORMANCY TIMER', value: '12-14 Day Randomized Sleep Evades Detonation Sandboxes' },
        { term: 'ANTI-ANALYSIS', value: 'FNV-1a Hashed Security-Tool & Analyst Blocklist' },
        { term: 'TRIAGE CHANNEL', value: 'Custom Base32 Victim Domain -> Selective CNAME Reply' },
      ],
    },
    {
      index: 4,
      title: 'TEARDROP Memory Loader & AD FS Golden SAML Token Forgery',
      subtitle: 'Stealing Token-Signing Keys to Forge Offline MFA-Bypassing Cloud Sessions',
      description:
        'On selected targets, SUNBURST deploys TEARDROP in RAM to escalate to ADFS-01, export the token-signing private key, and forge offline Golden SAML assertions caught by missing AD FS Event ID 1200 logs.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.004',
      mitreTechniqueName: 'Unsecured Credentials: Private Keys (Golden SAML)',
      activeNodeIds: ['adfs-cloud', 'siem-soc'],
      compromisedNodeIds: ['build-server', 'orion-host', 'adfs-cloud'],
      keySpecs: [
        { term: 'MEMORY LOADER', value: 'TEARDROP Decodes Cobalt Strike Beacon Without Disk Drop' },
        { term: 'TARGET SECRET', value: 'AD FS Token-Signing Certificate Private Key (ADFS-01)' },
        { term: 'ORPHAN AUDIT', value: 'Cloud SAML Sign-In With Zero Matching AD FS Event ID 1200' },
      ],
    },
  ],
  telemetry: SUNBURST_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'solarwinds-sunburst-orion-supply-chain',
  briefing: {
    headline: 'How a Ghost Inside the Software Foundry Stamped a Backdoor With a Genuine Seal',
    storyAnalogy:
      'Imagine a famous royal foundry that ships sealed navigation clocks to eighteen thousand treasuries worldwide. Instead of picking locks at each treasury gate, an invisible ghost slips onto the foundry assembly line, watches for the exact second the giant iron blueprint press starts moving, swaps in a rigged brass engraving plate, and puts the clean plate right back before any craftsman turns around. The royal mint press then stamps its real golden wax seal over every finished crate. Once delivered, each clock sleeps quietly in the dark for two full weeks before whispering encoded radio callsigns home, letting the intruders pick only their highest-value targets and forge royal federation passes straight into cloud vaults.',
    plainSummary:
      'In this scenario (MITRE T1195.002, SolarWinds SUNSPOT Build Hijack and SUNBURST Backdoor) targeting the Orion CI/CD pipeline, APT29 compromises software compilation itself so a genuine vendor signature carries stealthy espionage code. The attack unfolds in one continuous arc: swapping InventoryManager.cs mid-build with SUNSPOT, then stamping the trojanized library with an authentic vendor code-signing certificate, then waking after a 14-day sleep to beacon via encoded DGA DNS queries, then pivoting selectively through TEARDROP to forge AD FS Golden SAML tokens. Steps #1 through #4 dissect each build, signing, DNS, and identity link while the Memory tab compares clean Orion MSIL against the trojanized backdoor namespace. Primary detection correlates Sysmon Event ID 7 and 22 with YARA MSIL inspection and AD FS Event ID 1200 SAML reconciliation.',
    diagramTopologySummary:
      'Six-node supply-chain intrusion path connecting Orion CI/CD Build Server (BLD-ORION-02), Code-Signing & Update CDN, Victim Orion Server (ORION-MON-01), SUNBURST DGA DNS (avsvmcloud.com), AD FS & Cloud Tenant, and SOC SIEM & CISA ED 21-01.',
    documentedAdvisory:
      'Grounded in CrowdStrike SUNSPOT Analysis, FireEye/Mandiant SUNBURST & TEARDROP Report, CISA ED 21-01, and Microsoft MSTIC Solorigate.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1195.002',
      plainTitle: 'SUNSPOT Silently Swaps Source Code Mid-Compilation on the Build Server',
      storyAnalogy:
        'Hidden beside the humming foundry conveyor, the translucent factory ghost watches the giant engraving press every single second. The instant the master blueprint plate rolls beneath the steel rollers, the ghost lifts the genuine plate aside, slides in an identical brass plate hiding one extra secret gear, and puts the untouched original right back on the rack four seconds later so the factory inspectors never spot a scratch.',
      simpleExplanation:
        'Deployed as a disguised Windows service named taskhostsvc.exe (PID 3912) on build server BLD-ORION-02, the SUNSPOT implant (a dedicated CI/CD build-hijacking tool written by APT29) inspects running processes once every second waiting for MsBuild.exe (Microsoft automated build engine that turns C# source files into compiled binaries). When MsBuild targets the Orion Core solution, SUNSPOT replaces InventoryManager.cs (a routine Orion polling file) with a trojanized copy containing OrionImprovementBusinessLayer.Initialize() and immediately restores the original file after compilation succeeds.',
      howItWorksInPractice:
        'SUNSPOT reads the target MsBuild.exe process command line from memory, verifies MD5 hashes of InventoryManager.cs to avoid breaking compilation (preventing noisy build errors that would alert SolarWinds engineers), and writes the backdoored C# file to disk for only 4.2 seconds while the compiler parses it into Intermediate Language. Because the clean file is restored immediately afterward and never committed to Git, source-code reviews and repository integrity audits see zero unauthorized changes while the compiled DLL carries the implant.',
      diagramAlignment:
        'Follow Step #1 from Node 1 (Orion CI/CD Build Server) toward Node 2 (Code-Signing & Update CDN) as SUNSPOT tampers with MsBuild.exe compilation.',
      detectionAndEvidence:
        'Deploy Sysmon Event ID 11 file-creation monitoring on CI/CD build runners to alert whenever non-VCS processes modify .cs source files during active MsBuild.exe execution, and enforce reproducible-build hash verification.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1553.002',
      plainTitle: 'Genuine Vendor Code Signing Carries the Backdoor Past Trust Controls',
      storyAnalogy:
        'Rolling down the assembly line straight into the royal mint chamber, the tampered navigation clock looks completely authentic from the outside. The towering golden wax-seal press drops with a heavy thud, pressing the genuine royal crest onto the shipping crate so every border guard and vault gatekeeper across eighteen thousand cities waves the shipment inside without opening the lid.',
      simpleExplanation:
        'Because SUNSPOT injected the malicious class before packaging, SolarWinds automated release infrastructure signs SolarWinds.Orion.Core.BusinessLayer.dll (a core .NET library loaded automatically by SolarWinds.BusinessLayerHost.exe running as NT AUTHORITY\\SYSTEM) with a legitimate SolarWinds Worldwide LLC Authenticode certificate (a cryptographic publisher signature trusted by Windows and enterprise security agents). When customer servers install the official hotfix, Sysmon Event ID 7 logs a Valid signature status.',
      howItWorksInPractice:
        'Enterprise security teams routinely configure antivirus and EDR tools to reduce false positives on high-volume monitoring servers by trusting signed vendor directories. Inside SolarWinds.BusinessLayerHost.exe (PID 4120), the Common Language Runtime loads the trojanized MSIL (Microsoft Intermediate Language bytecode compiled from C#) directly alongside legitimate Orion polling classes, giving SUNBURST silent SYSTEM-level execution across roughly 18,000 organizations without dropping a single unsigned executable.',
      diagramAlignment:
        'Follow Step #2 from Node 2 (Code-Signing & Update CDN) to Node 3 (Victim Orion Server) while Node 6 (SOC SIEM) inspects Sysmon Event ID 7 hashes.',
      detectionAndEvidence:
        'Correlate Sysmon Event ID 7 ImageLoaded SHA-256 hashes against known-compromised release advisories and scan signed vendor DLLs with YARA rules targeting the OrionImprovementBusinessLayer MSIL namespace.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1568.002',
      plainTitle: 'Two-Week Dormancy Followed by Encoded DGA DNS Beaconing',
      storyAnalogy:
        'Installed inside the quiet customer hall, the clock refuses to tick for two whole weeks behind a frosted glass timer so hurried inspectors move on. Only after confirming no watchmen are listening does it begin whispering tiny scrambled letters from a rooftop radio spire, waiting for a single coded reply before opening its hidden workshop.',
      simpleExplanation:
        'Inside SolarWinds.BusinessLayerHost.exe, SUNBURST executes a randomized 12-to-14 day dormancy delay (defeating automated sandbox detonation and short-window update monitoring), verifies the machine belongs to a real Active Directory domain, and hashes every running process name with FNV-1a (a fast non-cryptographic hash used to hide its list of avoided security tools). It then encodes the victim organization domain name into custom Base32 labels queried under *.appsync-api.*.avsvmcloud.com (a Domain Generation Algorithm C2 channel logged by Sysmon Event ID 22).',
      howItWorksInPractice:
        'By encoding the victim domain name inside outbound DNS A-record queries, APT29 operators passively inspect incoming DNS logs at avsvmcloud.com and triage which of the 18,000 infected companies are high-value intelligence targets. Uninteresting networks receive inert IP addresses that tell SUNBURST to stay silent forever, whereas selected targets receive a crafted DNS CNAME record (an alias pointing to a bespoke stage-2 HTTPS C2 server such as freescanonline.com) authorizing interactive tasking.',
      diagramAlignment:
        'Follow Step #3 from Node 3 (Victim Orion Server) to Node 4 (SUNBURST DGA DNS) as Sysmon Event ID 22 and Suricata capture the CNAME activation.',
      detectionAndEvidence:
        'Inspect Sysmon Event ID 22 and Zeek DNS logs with Suricata rules alerting on *.avsvmcloud.com lookups or abnormal high-entropy Base32 subdomains queried by management infrastructure servers that should never have internet DNS egress.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1552.004',
      plainTitle: 'Selective TEARDROP Memory Loader & AD FS Golden SAML Forgery',
      storyAnalogy:
        'For the handful of high-value treasuries selected by the radio reply, the hidden compartment deploys a silent master thief who copies the treasury chief own wax-seal signet stamp. Back in their own workshop far outside the city walls, the intruders press brand-new royal federation passes anytime they wish, walking straight into cloud reading rooms without ever signing the front-gate ledger.',
      simpleExplanation:
        'Once activated on a priority target, SUNBURST deploys TEARDROP (a memory-only C++ dropper that decodes an embedded Cobalt Strike Beacon from a fake JPG file without touching disk) to pivot from the privileged Orion server to the on-premises AD FS server (Active Directory Federation Services, which vouches for user identities to cloud tenants). After stealing the AD FS token-signing certificate private key, the attackers forge Golden SAML assertions (cryptographically valid XML login tokens minted completely offline for any user, bypassing multi-factor authentication).',
      howItWorksInPractice:
        'Because the forged SAML assertion is signed with the organization genuine stolen AD FS private key, cloud identity providers such as Microsoft Entra ID accept the token (issuing a fresh cloud session for Exchange Online or Graph API from attacker-controlled IPs without MFA prompts). However, because the token was forged offline rather than minted by the real ADFS-01 server, correlating cloud SigninLogs against on-premises AD FS Event ID 1200 issuance logs reveals an unmistakable orphan SAML login with zero matching local issuance record.',
      diagramAlignment:
        'Follow Step #4 between Node 5 (AD FS & Cloud Tenant) and Node 6 (SOC SIEM & CISA ED 21-01) as KQL anti-join exposes orphan SAML sign-ins.',
      detectionAndEvidence:
        'Run SIEM KQL left-anti joins correlating Entra ID SAML SigninLogs against on-premises AD FS Event ID 1200 token issuance events, and audit HSM protection plus emergency double-rotation of AD FS token-signing certificates.',
    },
  ],
};
