import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'solarwinds-sunburst-orion-supply-chain',
    title: 'SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29)',
    category: 'SUPPLY_CHAIN_CICD',
    mitreId: 'T1195.002',
    description:
      'APT29 (UNC2452 / Nobelium) compromises the SolarWinds Orion build server with SUNSPOT to swap InventoryManager.cs during MSBuild compilation, shipping the signed SUNBURST backdoor inside SolarWinds.BusinessLayerHost.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'APT29 C2 (*.avsvmcloud.com)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'TeamCity / MSBuild Server', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Orion Server (BusinessLayerHost)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EDR & DNS Security Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AD Federation Services (SAML)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SUNSPOT Build-Time Source Injection into MSBuild',
        narration:
          'APT29 deploys SUNSPOT (taskhostsvc.exe) onto the SolarWinds Orion build server. SUNSPOT monitors running processes for MsBuild.exe and transiently replaces InventoryManager.cs with a backdoored version containing the SUNBURST OrionImprovementBusinessLayer class before restoring the clean source file.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'SUNSPOT Service: C:\\Windows\\Temp\\vmware-vmdmp.log (AES-encrypted build log)',
          'Target Process Poll: MsBuild.exe compiling SolarWinds.Orion.Core.BusinessLayer.csproj',
          'Transient File Swap: Replace InventoryManager.cs -> Compile SolarWinds.Orion.Core.BusinessLayer.dll -> Restore InventoryManager.cs',
        ],
        defenseMitigation:
          'Enforce hermetic, ephemeral build environments (SLSA Build L3) with hardware-backed code signing and post-compilation reproducible binary verification.',
        logs: [
          {
            id: 'sunspot-1',
            timestamp: '03:12:04.112',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            CommandLine: 'C:\\Windows\\System32\\taskhostsvc.exe (SUNSPOT build monitor)',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\taskhostsvc.exe | TargetFilename: C:\\Builds\\Orion\\Src\\Lib\\SolarWinds.Orion.Core.BusinessLayer\\BackgroundInventory\\InventoryManager.cs | Note: Source file overwritten during active MSBuild.exe execution',
            parsedFields: {
              Implant: 'SUNSPOT (taskhostsvc.exe)',
              TargetedBuildProcess: 'MsBuild.exe',
              ModifiedSourceFile: 'InventoryManager.cs',
              CompiledArtifact: 'SolarWinds.Orion.Core.BusinessLayer.dll',
            },
          },
        ],
        packets: [
          {
            id: 'sunspot-pkt-1',
            timestamp: '03:14:22.400',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.70',
            destIp: '10.20.4.15',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 4096,
            hexDump: '48 54 54 50 2F 31 2E 31 20 32 30 30 20 4F 4B 0D 0A 53 6F 6C 61 72 57 69 6E 64 73 2E 4F 72 69 6F 6E 2E 43 6F 72 65 2E 42 75 73 69 6E 65 73 73 4C 61 79 65 72 2E 64 6C 6C',
            decodedString: 'Signed Hotfix Download: SolarWinds-Orion-Core-2020.2.1-HF1.msp (Authenticode Signed with Backdoored OrionImprovementBusinessLayer)',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon',
        narration:
          'Loaded inside SolarWinds.BusinessLayerHost.exe on customer networks, SUNBURST remains dormant for 12–14 days, hashes running processes and drivers using 64-bit FNV-1a plus XOR to check for EDR tools, and encodes the victim AD domain name into a CNAME DNS query to *.avsvmcloud.com.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Command and Control (T1568.002 - Domain Generation Algorithms)',
        technicalCommands: [
          'Host Process: C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe',
          'Defense Check: FNV-1a 64-bit hash comparison against hardcoded EDR process/driver hashes',
          'DNS DGA Beacon: <encoded_guid_and_domain>.appsync-api.us-east-1.avsvmcloud.com',
        ],
        defenseMitigation:
          'Monitor passive DNS for high-entropy subdomains resolving to unexpected CNAME targets and block outbound internet access from network management servers.',
        logs: [
          {
            id: 'sunspot-2',
            timestamp: '03:18:45.809',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 22,
            ProcessName: 'SolarWinds.BusinessLayerHost.exe',
            raw: 'EventID: 22 | Image: C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe | QueryName: 7sbvaem201253652b890.appsync-api.us-east-1.avsvmcloud.com | QueryResults: type: 5 (CNAME) -> 13.59.205.66',
            parsedFields: {
              ParentProcess: 'SolarWinds.BusinessLayerHost.exe',
              DgaQuery: '7sbvaem201253652b890.appsync-api.us-east-1.avsvmcloud.com',
              CnameRedirect: 'Stage 2 TEARDROP / Cobalt Strike C2',
              DormancyPeriod: '12-14 Days Elapsed',
            },
          },
        ],
        packets: [
          {
            id: 'sunspot-pkt-2',
            timestamp: '03:18:45.812',
            protocol: 'DNS',
            sourceIp: '10.20.4.15',
            destIp: '8.8.8.8',
            port: 53,
            flag: 'NONE',
            payloadSize: 128,
            hexDump: '37 73 62 76 61 65 6D 32 30 31 32 35 33 36 35 32 62 38 39 30 0B 61 70 70 73 79 6E 63 2D 61 70 69 09 75 73 2D 65 61 73 74 2D 31 0A 61 76 73 76 6D 63 6C 6F 75 64 03 63 6F 6D',
            decodedString: 'DNS Query A: 7sbvaem201253652b890.appsync-api.us-east-1.avsvmcloud.com -> CNAME custom C2',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft',
        narration:
          'When the C2 operator responds with a CNAME pointing to a dedicated server, SUNBURST switches to HTTPS mimicking Orion Improvement Program (OIP) JSON traffic, drops the memory-only TEARDROP loader via Image File Execution Options (IFEO), and steals the ADFS token-signing certificate.',
        activeNodes: ['attacker', 'target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.004 - Private Keys / Golden SAML)',
        technicalCommands: [
          'HTTP OIP Camouflage: POST /swip/upd/SolarWinds.CortexPlugin.Components.xml HTTP/1.1',
          'TEARDROP Loader: Reads fake JPEG header from grumbles.jpg and maps Cobalt Strike Beacon in RAM',
          'ADFS Key Extraction: Export EncryptedPFX blob from ADFS configuration database + DKM decryption key',
        ],
        defenseMitigation:
          'Store ADFS token-signing keys in hardware security modules (HSMs) and audit remote WMI/IFEO registry modifications across Tier-0 servers.',
        logs: [
          {
            id: 'sunspot-3',
            timestamp: '03:24:19.004',
            source: 'EDR',
            severity: 'critical',
            EventCode: 13,
            ProcessName: 'SolarWinds.BusinessLayerHost.exe',
            raw: 'Alert: IFEO Debugger Persistence & Memory-Only TEARDROP Loader | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\dllhost.exe\\Debugger | Follow-up: Remote WMI execution to ADFS Server extracting EncryptedPFX',
            parsedFields: {
              Stage2Implant: 'TEARDROP (Memory-Only Loader)',
              PersistenceMechanism: 'IFEO Debugger Injection',
              Tier0Target: 'ADFS Token-Signing Certificate (Golden SAML)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'solarwinds-sunburst-orion-supply-chain',
    briefing: {
      headline:
        'APT29 (UNC2452 / Nobelium) compromises the SolarWinds Orion build server with SUNSPOT to inject the SUNBURST backdoor during MSBuild compilation, shipping a digitally signed trojan to 18,000+ organizations.',
      storyAnalogy:
        'Imagine a master counterfeiter who does not break into 18,000 bank vaults one by one. Instead, they sneak onto the assembly floor of the factory that manufactures the banks’ vault doors. Right as the molten steel is poured, a robotic arm swaps a single blueprint for three seconds, embeds a hidden radio receiver inside the door, and puts the original blueprint back before the quality inspector looks.',
      plainSummary:
        'In this scenario (T1195.002, SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sUNSPOT Build-Time Source Injection, then sUNBURST Dormancy, FNV-1a Blocklist Check, then tEARDROP Memory-Only Dropper. Steps #1–#3 walk that chain end-to-end by covering SUNSPOT Build-Time Source Injection, then SUNBURST Dormancy, FNV-1a Blocklist Check, then TEARDROP Memory-Only Dropper, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 11 with the documented host and network chain.',
      diagramTopologySummary:
        'APT29 C2 (*.avsvmcloud.com) -> TeamCity / MSBuild Server (SUNSPOT) -> Orion Server (BusinessLayerHost.exe) -> AD Federation Services (Golden SAML) -> EDR & DNS Sensor.',
      documentedAdvisory:
        'Mandiant UNC2452 SUNBURST Analysis / CrowdStrike SUNSPOT Technical Analysis / CISA Emergency Directive 21-01',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'SUNSPOT Build-Time Source Injection into MSBuild',
        storyAnalogy:
          'A saboteur stands next to the factory printing press, swapping a single page of the master template only while the press rollers are spinning and immediately restoring the clean page afterward.',
        simpleExplanation:
          'APT29 deployed SUNSPOT (taskhostsvc.exe, a custom build-hijacking service that polls running processes every second for MsBuild.exe) onto the SolarWinds Orion build server. When a build of SolarWinds.Orion.Core.BusinessLayer.csproj began, SUNSPOT temporarily replaced InventoryManager.cs on disk (injecting the OrionImprovementBusinessLayer backdoor class right before the C# compiler read the file and restoring the original file immediately after compilation) so zero malicious commits ever appeared in the source control repository.',
        howItWorksInPractice:
          'SUNSPOT checks the command-line arguments of MsBuild.exe, verifies target file hashes with MD5, acquires a mutex, replaces InventoryManager.cs, logs any compilation errors to an AES-encrypted log at C:\\Windows\\Temp\\vmware-vmdmp.log, and restores the original .cs file before the build finishes and enters the code-signing step.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the APT29 operator and the TeamCity / MSBuild Server as InventoryManager.cs is swapped during compilation.',
        detectionAndEvidence:
          'Sysmon EventID 11 file modifications to .cs source files by non-SCM processes (taskhostsvc.exe) during active MsBuild.exe execution, and post-build reproducible compilation verification.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1568.002',
        plainTitle: 'SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon',
        storyAnalogy:
          'Once installed inside the customer’s building, the hidden radio waits silently for two full weeks, checks if any security guards are standing nearby, and then whispers the building’s name inside a standard maintenance check.',
        simpleExplanation:
          'When customers installed the signed Orion update, SolarWinds.BusinessLayerHost.exe loaded the trojanized DLL. SUNBURST enforced a 12-to-14-day dormancy period, hashed running processes, services, and drivers using 64-bit FNV-1a + XOR (comparing them against hardcoded hashes of EDR and analysis tools without storing plaintext process names in the binary), and then issued a DNS query to *.avsvmcloud.com (encoding the victim’s Active Directory domain name and MAC address into the subdomain label).',
        howItWorksInPractice:
          'By encoding the victim’s internal domain name into the DNS DGA query, APT29 could passively inspect DNS lookups at their authoritative nameserver and selectively reply with a CNAME record pointing to a Stage-2 server only for high-value government and technology targets. In the documented EventID 22 exchange from Perimeter Firewall & NDR Tap to TeamCity / MSBuild Server, TeamCity / MSBuild Server responds with ACK 22 (confirming that the SolarWinds.BusinessLayerHost.exe request succeeded on TeamCity / MSBuild Server and establishing the runtime state required for Step #3 Stage 3: TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) traces the Orion Server (SolarWinds.BusinessLayerHost.exe) sending the encoded DNS beacon to *.avsvmcloud.com while the EDR & DNS Sensor observes the CNAME resolution.',
        detectionAndEvidence:
          'Sysmon EventID 22 DNS queries from SolarWinds.BusinessLayerHost.exe to *.avsvmcloud.com returning CNAME redirects to non-SolarWinds IP space.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.004',
        plainTitle: 'TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft',
        storyAnalogy:
          'After confirming the target is a high-value vault, the intruder uses the hidden radio to print a master identity stamp that lets them forge signed entry passes for any employee at any time.',
        simpleExplanation:
          'For selected victims, SUNBURST communicated over HTTPS disguised as SolarWinds Orion Improvement Program (OIP) JSON telemetry, deployed the memory-only TEARDROP dropper via Image File Execution Options (IFEO) (registering a debugger hijack that loaded a custom Cobalt Strike Beacon from a fake JPEG file in RAM), and laterally moved to the ADFS server to extract the token-signing private key (Golden SAML, enabling the attacker to forge cryptographically valid SAML assertions for any cloud user without touching Active Directory passwords).',
        howItWorksInPractice:
          'Using the stolen ADFS EncryptedPFX blob and Distributed Key Manager (DKM) decryption key from Active Directory, the attacker mints arbitrary SAML 2.0 tokens offline to access Microsoft 365 and Azure resources. In the documented EventID 13 exchange from TeamCity / MSBuild Server to Orion Server (BusinessLayerHost), Orion Server (BusinessLayerHost) responds with ALERT 13 (confirming that the SolarWinds.BusinessLayerHost.exe request succeeded on Orion Server (BusinessLayerHost) and completing the final execution objective of SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) connects the Orion Server to the AD Federation Services (SAML) node as TEARDROP extracts the token-signing certificate.',
        detectionAndEvidence:
          'EDR detection of IFEO Debugger registry keys on dllhost.exe and unexpected remote WMI/PowerShell access to ADFS configuration databases and DKM containers in Active Directory.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a famous armored-truck factory whose blueprints are inspected every evening by careful engineers. Instead of editing the master blueprint on paper where someone would notice, a hidden saboteur watches the factory assembly press and swaps a tiny counterfeit circuit board into the mold for two seconds right as the factory stamps its genuine gold warranty seal onto the finished truck. Eighteen thousand banks buy the sealed truck, where the hidden board sleeps quietly for two weeks before whispering home and unlocking each bank identity vault.',
      storyMappings: [
        {
          storyTerm: 'Hidden saboteur watching the assembly press',
          technicalTerm: 'SUNSPOT build-hijack service (taskhostsvc.exe) polling MsBuild.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Swapping a counterfeit board before the gold warranty seal is stamped',
          technicalTerm: 'Transient InventoryManager.cs swap compiled into signed SolarWinds.Orion.Core.BusinessLayer.dll',
          tone: 'sky',
        },
        {
          storyTerm: 'Sleeping for two weeks before whispering home',
          technicalTerm: 'SUNBURST 12-to-14 day dormancy and *.avsvmcloud.com DGA DNS beacon',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking each bank identity vault',
          technicalTerm: 'Memory-only TEARDROP loader and ADFS Golden SAML token-signing theft',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In this scenario (T1195.002, SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sUNSPOT Build-Time Source Injection, then sUNBURST Dormancy, FNV-1a Blocklist Check, then tEARDROP Memory-Only Dropper. Steps #1–#3 walk that chain end-to-end by covering SUNSPOT Build-Time Source Injection, then SUNBURST Dormancy, FNV-1a Blocklist Check, then TEARDROP Memory-Only Dropper, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 11 with the documented host and network chain.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing silently beside the factory stamping press, the saboteur checks the conveyor belt every second. The instant the press lowers to forge a new fleet module, the saboteur slips in a poisoned page, waits for the factory official gold seal to stamp it, and swaps the clean page straight back onto the blueprint table.',
        storyMappings: [
          {
            storyTerm: 'Saboteur checking the conveyor belt every second',
            technicalTerm: 'SUNSPOT (taskhostsvc.exe) polling for MsBuild.exe every 1,000 milliseconds',
            tone: 'amber',
          },
          {
            storyTerm: 'Poisoned page slipped in and swapped back',
            technicalTerm: 'Temporary replacement and restoration of InventoryManager.cs during compilation',
            tone: 'sky',
          },
          {
            storyTerm: 'Official gold seal stamped on the finished module',
            technicalTerm: 'Valid SolarWinds Authenticode code-signing certificate applied to the trojanized DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean blueprint table left untouched',
            technicalTerm: 'Unmodified Git source repository evading developer code review',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Delivered inside an official sealed factory shipment, the counterfeit board sits completely silent for two full weeks so test inspectors hear nothing. After confirming it is not sitting inside a security workshop, it sends coded postal inquiries disguised as routine check-ins to ask its remote handler whether this customer is worth robbing.',
        storyMappings: [
          {
            storyTerm: 'Counterfeit board sitting silent for two weeks',
            technicalTerm: 'SUNBURST 12-to-14 day random dormancy delay inside SolarWinds.BusinessLayerHost.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking it is not inside a security workshop',
            technicalTerm: 'FNV-1a hash blocklist checking for antivirus drivers, debuggers, and analysis domains',
            tone: 'sky',
          },
          {
            storyTerm: 'Coded postal inquiries disguised as routine check-ins',
            technicalTerm: 'Domain Generation Algorithm (DGA) DNS beacons to *.avsvmcloud.com',
            tone: 'rose',
          },
          {
            storyTerm: 'Remote handler signaling whether to rob the bank',
            technicalTerm: 'CNAME DNS response redirecting high-value victims to dedicated C2 infrastructure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 22 (DNSEvent recording the exact originating process and resolved domain name) showing SolarWinds.BusinessLayerHost.exe querying *.avsvmcloud.com and receiving CNAME redirects to non-SolarWinds IP addresses (exposing active SUNBURST victim triaging).',
      },
      3: {
        storyAnalogy:
          'For hand-picked targets, the counterfeit board quietly unfolds a paperless lockpicker straight inside the bank memory, steps into the corporate badge-printing vault, and steals the master embossing plate so the spies can stamp flawless executive badges for any cloud office whenever they please.',
        storyMappings: [
          {
            storyTerm: 'Paperless lockpicker unfolded inside memory',
            technicalTerm: 'TEARDROP memory-only dropper delivered over disguised OIP JSON HTTPS traffic',
            tone: 'amber',
          },
          {
            storyTerm: 'Corporate badge-printing vault',
            technicalTerm: 'Active Directory Federation Services (ADFS) server and DKM key container',
            tone: 'sky',
          },
          {
            storyTerm: 'Stealing the master embossing plate',
            technicalTerm: 'Extraction of the ADFS token-signing private key certificate',
            tone: 'rose',
          },
          {
            storyTerm: 'Stamping flawless executive badges for cloud offices',
            technicalTerm: 'Golden SAML forgery granting persistent access to Microsoft 365 and federated SaaS',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate EDR alerts on Image File Execution Options (IFEO) Debugger registry keys targeting dllhost.exe (used to hijack trusted binary execution for persistence) with Windows Security logs tracking unexpected remote WMI or PowerShell access to ADFS configuration databases and DKM containers in Active Directory.',
      },
    },
  };
