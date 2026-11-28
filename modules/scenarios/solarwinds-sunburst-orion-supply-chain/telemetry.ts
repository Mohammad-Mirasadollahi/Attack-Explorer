import type { TelemetryEvent } from '../types';

export const SUNBURST_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'sunburst-log-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.114',
    sourceNodeId: 'build-server',
    targetNodeId: 'signing-cdn',
    sourceLabel: 'BLD-ORION-02 (taskhostsvc.exe)',
    targetLabel: 'MsBuild.exe (Orion Solution)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 11 (SUNSPOT Swap)',
    shortAction: 'SOURCE SWAP IN BUILD',
    info: 'SUNSPOT (taskhostsvc.exe PID 3912) hooks active MsBuild.exe and swaps InventoryManager.cs for 4.2s to inject OrionImprovementBusinessLayer.Initialize()',
    sizeOrCode: '4.2s Swap',
    severity: 'CRITICAL',
    mitreId: 'T1195.002',
    explanation:
      'Running silently on the build server, SUNSPOT polls for MsBuild.exe compiling the Orion solution, swaps in backdoored C# source code during compilation, and restores the clean file seconds later so Git shows zero commits.',
    rawLog: `Sysmon EventID=11 (FileCreate) | Computer=BLD-ORION-02.build.local
ProcessId=3912 | Image=C:\\Windows\\System32\\taskhostsvc.exe (SUNSPOT)
TargetFilename=D:\\Builds\\OrionCore\\InventoryManager.cs | DurationSwapped=4.2s
InjectedCall=OrionImprovementBusinessLayer.Initialize() | GitDiff=NONE`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Non-VCS Process Modifying C# Source Files During Active MsBuild.exe Compilation',
      ruleCode: `title: Suspicious Source File Tampering During Active MSBuild Compilation
status: stable
logsource:
  category: file_event
  product: windows
detection:
  selection:
    TargetFilename|endswith: '.cs'
  filter_legit:
    Image|endswith:
      - '\\git.exe'
      - '\\devenv.exe'
      - '\\msbuild.exe'
  condition: selection and not filter_legit
level: critical`,
      mitigation:
        'Use ephemeral hermetic CI/CD build runners with SLSA Level 3 provenance and verify reproducible-build hashes prior to code signing.',
    },
  },
  {
    id: 'sunburst-log-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:18.490',
    sourceNodeId: 'signing-cdn',
    targetNodeId: 'orion-host',
    sourceLabel: 'SolarWinds Release & Signing CDN',
    targetLabel: 'ORION-MON-01 (PID 4120)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 7 (Valid Authenticode)',
    shortAction: 'SIGNED DLL LOADED',
    info: 'SolarWinds.BusinessLayerHost.exe (SYSTEM) loads genuinely signed SolarWinds.Orion.Core.BusinessLayer.dll containing the trojanized SUNBURST MSIL class',
    sizeOrCode: 'Signed Valid',
    severity: 'CRITICAL',
    mitreId: 'T1553.002',
    explanation:
      'Because SUNSPOT injected source code before packaging, SolarWinds signing infrastructure stamps the trojanized DLL with a genuine Authenticode certificate that bypasses trust-based AV/EDR exclusions across ~18,000 networks.',
    rawLog: `Sysmon EventID=7 (ImageLoaded) | Computer=ORION-MON-01.corp.local
ProcessId=4120 | Image=C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe
ImageLoaded=C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.Orion.Core.BusinessLayer.dll
Signed=true | Signature=SolarWinds Worldwide, LLC | SignatureStatus=Valid
SHA256=32519b85c0b422e4656de6e6c41878e95fd95026267daab4215ee59c107d6c77`,
    detectionRule: {
      type: 'YARA',
      title: 'SUNBURST Backdoor Namespace Inside Signed SolarWinds.Orion.Core.BusinessLayer.dll',
      ruleCode: `rule APT29_SUNBURST_Orion_BusinessLayer_Backdoor {
  meta:
    author = "DFIR Supply-Chain Hunt"
    mitre = "T1195.002"
  strings:
    $ns = "OrionImprovementBusinessLayer" ascii wide
    $dom = "avsvmcloud.com" ascii wide
  condition:
    uint16(0) == 0x5A4D and all of them
}`,
      mitigation:
        'Isolate Orion management servers into zero-internet-egress VLANs and verify installed binaries against vendor-published SHA-256 advisories.',
    },
  },
  {
    id: 'sunburst-log-3',
    no: 3,
    stageIndex: 3,
    timestamp: '14d 02:11.005',
    sourceNodeId: 'orion-host',
    targetNodeId: 'dga-dns',
    sourceLabel: 'ORION-MON-01 (PID 4120)',
    targetLabel: 'SUNBURST DGA DNS (avsvmcloud.com)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 22 (DGA CNAME)',
    shortAction: 'DGA DNS BEACON',
    info: 'After 14-day dormancy and FNV-1a EDR checks, SUNBURST beacons custom Base32 victim domain labels to *.appsync-api.*.avsvmcloud.com and receives CNAME C2 activation',
    sizeOrCode: 'CNAME Active',
    severity: 'CRITICAL',
    mitreId: 'T1568.002',
    explanation:
      'Encoding the victim AD domain name inside DNS queries lets APT29 passively triage 18,000 infected networks and return a stage-2 CNAME C2 alias strictly to selected espionage targets.',
    rawLog: `Sysmon EventID=22 (DnsQuery) | Computer=ORION-MON-01.corp.local | ProcessId=4120
Image=C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe
QueryName=7sb13g8e5k2p9r4t.appsync-api.us-west-2.avsvmcloud.com
QueryResults=type: 5 freescanonline.com (Stage-2 C2 Activation CNAME)`,
    detectionRule: {
      type: 'SURICATA',
      title: 'SUNBURST DGA Subdomain Lookup to avsvmcloud.com From Management Server',
      ruleCode: `alert dns $HOME_NET any -> any 53 (msg:"APT29 SUNBURST avsvmcloud.com DGA Beacon"; dns.query; content:"avsvmcloud.com"; endswith; nocase; sid:2031401; rev:2;)`,
      mitigation:
        'Sinkhole avsvmcloud.com via DNS RPZ and block unrestricted outbound internet DNS/HTTPS egress from monitoring appliances.',
    },
  },
  {
    id: 'sunburst-log-4',
    no: 4,
    stageIndex: 4,
    timestamp: '15d 04:09.772',
    sourceNodeId: 'adfs-cloud',
    targetNodeId: 'siem-soc',
    sourceLabel: 'AD FS & Entra ID Tenant',
    targetLabel: 'SOC SIEM & CISA ED 21-01',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'Entra SAML vs ADFS EID 1200',
    shortAction: 'GOLDEN SAML CAUGHT',
    info: 'TEARDROP memory loader escalates to ADFS-01 token-signing key theft; SIEM KQL flags offline-forged cloud SAML sign-in with zero matching AD FS Event ID 1200',
    sizeOrCode: 'Orphan SAML',
    severity: 'CRITICAL',
    mitreId: 'T1552.004',
    explanation:
      'Forged Golden SAML assertions carry a valid stolen AD FS signature and bypass MFA, but leaving zero on-premises AD FS Event ID 1200 issuance log exposes the offline forgery in SIEM reconciliation.',
    rawLog: `Alert=GOLDEN_SAML_ORPHAN_CLOUD_LOGIN | EntraSigninId=8f92e41c-9a01
UserPrincipalName=exec.admin@corp.example | AuthMethod=SAML2_Federated (Bypassed MFA)
SourceIP=198.51.100.204 | MatchingOnPremADFS_EID1200=ZERO_RECORDS (Offline Forgery Confirmed)`,
    detectionRule: {
      type: 'KQL',
      title: 'Cloud SAML Federation Sign-In Lacking Matching On-Premises AD FS Event ID 1200',
      ruleCode: `SigninLogs
| where AuthenticationRequirement == "singleFactorAuthentication" and AppDisplayName has "Microsoft"
| join kind=leftanti (SecurityEvent | where EventID == 1200) on $left.UserPrincipalName == $right.Account
| project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName`,
      mitigation:
        'Store AD FS token-signing keys in hardware security modules (HSMs), double-rotate signing certificates on compromise, and migrate authentication to cloud-native Entra ID.',
    },
  },
];
