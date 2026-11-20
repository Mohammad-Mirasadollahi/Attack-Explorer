import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'solarwinds-sunburst-orion-supply-chain',
    briefing: {
      headline:
        'APT29 (UNC2452 / Nobelium) compromises the SolarWinds Orion build server with SUNSPOT to inject the SUNBURST backdoor during MSBuild compilation, shipping a digitally signed trojan to 18,000+ organizations.',
      storyAnalogy:
        'Imagine a master counterfeiter who does not break into 18,000 bank vaults one by one. Instead, they sneak onto the assembly floor of the factory that manufactures the banks’ vault doors. Right as the molten steel is poured, a robotic arm swaps a single blueprint for three seconds, embeds a hidden radio receiver inside the door, and puts the original blueprint back before the quality inspector looks.',
      plainSummary:
        'Rather than modifying source code in Git where developers would spot the diff, APT29 installed a custom C++ service called SUNSPOT on the SolarWinds build server. SUNSPOT watched for MsBuild.exe and transiently replaced InventoryManager.cs in milliseconds so the resulting SolarWinds.Orion.Core.BusinessLayer.dll was officially signed with SolarWinds’ legitimate Authenticode certificate.',
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
