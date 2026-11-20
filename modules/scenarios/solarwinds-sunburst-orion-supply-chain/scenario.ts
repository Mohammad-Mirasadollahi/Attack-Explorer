import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
