import { TelemetryEvent } from '../types';

export const THREECX_SUPPLY_CHAIN_TELEMETRY: TelemetryEvent[] = [
  {
    id: '3cx-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.210',
    sourceNodeId: 'build_pipeline',
    targetNodeId: 'trading_workstation',
    sourceLabel: '3CX Build Pipeline (X_TRADER)',
    targetLabel: 'WKS-TRD-14 (10.10.8.41)',
    sourceType: 'SYSMON',
    protocolOrEventId: 'Sysmon EID 11 + EID 7',
    shortAction: 'SIGNED TROJAN INSTALL',
    info: 'Validly signed 3CXDesktopApp.exe v18.12.407 installed alongside trojanized ffmpeg.dll & oversized d3dcompiler_47.dll',
    sizeOrCode: 'Signed Valid',
    severity: 'HIGH',
    mitreId: 'T1195.002',
    explanation:
      'Because Lazarus Group compromised the 3CX Windows CI/CD build environment via an upstream X_TRADER breach before code signing, Sysmon Event ID 11 and 7 show a genuinely signed 3CXDesktopApp.exe v18.12.407 dropping trojanized ffmpeg.dll and oversized d3dcompiler_47.dll on WKS-TRD-14.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <TimeCreated SystemTime="2026-11-26T14:08:11.210Z"/>
    <Computer>WKS-TRD-14.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">7120</Data>
    <Data Name="Image">C:\\Users\\d.chen\\AppData\\Local\\Programs\\3CXDesktopApp\\app-18.12.407\\3CXDesktopApp.exe</Data>
    <Data Name="ImageLoaded">C:\\Users\\d.chen\\AppData\\Local\\Programs\\3CXDesktopApp\\app-18.12.407\\ffmpeg.dll</Data>
    <Data Name="Signed">false</Data>
    <Data Name="SignatureStatus">Unsigned (Modified Build Artifact)</Data>
    <Data Name="ParentSignature">Valid (3CX Ltd. Authenticode EV)</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Signed 3CXDesktopApp.exe Loading Trojanized ffmpeg.dll & Oversized d3dcompiler_47.dll',
      ruleCode: `title: 3CXDesktopApp Supply Chain Trojanized DLL Side-Load
logsource:
  product: windows
  category: image_load
detection:
  selection:
    Image|endswith: '\\3CXDesktopApp.exe'
    ImageLoaded|endswith:
      - '\\ffmpeg.dll'
      - '\\d3dcompiler_47.dll'
    Signed: 'false'
  condition: selection
level: critical`,
      mitigation:
        'Enforce Software Bill of Materials (SBOM) hash verification on CI/CD release artifacts and alert when a legitimately signed Electron executable loads unsigned or size-anomalous DLLs.',
    },
  },
  {
    id: '3cx-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:00.590',
    sourceNodeId: 'threecx_process',
    targetNodeId: 'memory_payload',
    sourceLabel: 'ffmpeg.dll (PID 7120)',
    targetLabel: 'd3dcompiler_47.dll -> RWX RAM',
    sourceType: 'MEMORY_SCAN',
    protocolOrEventId: 'EDR Memory + YARA',
    shortAction: '0xFEEDFACE RC4',
    info: 'ffmpeg.dll seeks marker 0xFEEDFACE in d3dcompiler_47.dll and RC4-decrypts SmoothOperator loader into 0x000001C948200000 (RWX)',
    sizeOrCode: '0xFEEDFACE',
    severity: 'CRITICAL',
    mitreId: 'T1574.002',
    explanation:
      'At runtime inside 3CXDesktopApp.exe (PID 7120), side-loaded ffmpeg.dll reads d3dcompiler_47.dll, locates the 4-byte magic marker 0xFEEDFACE, allocates unbacked MEM_PRIVATE RWX memory via VirtualAlloc at 0x000001C948200000, and RC4-decrypts the shellcode using key 3jB(2bsG#@c7.',
    rawLog: `// EDR Memory & Binary-Overlay Inspection Report
Host:             WKS-TRD-14 (10.10.8.41)
Process:          3CXDesktopApp.exe (PID 7120 · Signed: 3CX Ltd.)
TriggerModule:    ffmpeg.dll (Export Hook: av_buffer_create)
OverlayContainer: d3dcompiler_47.dll @ 0x7FF8A1000000 (Magic Marker: FE ED FA CE)
CipherAlgorithm:  RC4 (Key: "3jB(2bsG#@c7")
DecryptedTarget:  0x000001C948200000 (MEM_PRIVATE · PAGE_EXECUTE_READWRITE · 312 KB)
BackingFile:      <NONE - Unbacked Shellcode Inside Signed VoIP Process>`,
    detectionRule: {
      type: 'YARA',
      title: '3CX d3dcompiler_47.dll 0xFEEDFACE Encrypted Shellcode Marker',
      ruleCode: `rule Lazarus_3CX_FEEDFACE_RC4_Loader {
  meta:
    author = "CrowdStrike & Mandiant DFIR"
    cve = "CVE-2023-29059"
    severity = "critical"
  strings:
    $magic = { FE ED FA CE }
    $rc4_key = "3jB(2bsG#@c7" ascii
    $github = "IconStorages/images/main/icon" ascii
  condition:
    $magic and ($rc4_key or $github)
}`,
      mitigation:
        'Monitor signed desktop applications for VirtualAlloc PAGE_EXECUTE_READWRITE allocations originating from side-loaded DLLs and scan companion DLL overlays for high-entropy trailers.',
    },
  },
  {
    id: '3cx-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:01.840',
    sourceNodeId: 'threecx_process',
    targetNodeId: 'github_deaddrop',
    sourceLabel: '3CXDesktopApp.exe (7120)',
    targetLabel: 'raw.githubusercontent.com (.ico)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'Sysmon EID 22 + EID 3',
    shortAction: 'GITHUB .ICO DEAD-DROP',
    info: 'Fetches IconStorages/images/main/icon12.ico, slices trailing Base64 past ICO EOF, and resolves C2 akamaitechcloudservices[.]com',
    sizeOrCode: 'icon12.ico',
    severity: 'CRITICAL',
    mitreId: 'T1102.001',
    explanation:
      'Instead of hardcoding a suspicious IP, the decrypted loader queries raw.githubusercontent.com/IconStorages/images/main/icon12.ico, reads an encrypted Base64 C2 string tucked strictly after the valid ICO image EOF marker, and resolves the live lookalike C2 domain.',
    rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>22</EventID>
    <TimeCreated SystemTime="2026-11-26T14:08:12.840Z"/>
    <Computer>WKS-TRD-14.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">7120</Data>
    <Data Name="Image">C:\\Users\\d.chen\\AppData\\Local\\Programs\\3CXDesktopApp\\app-18.12.407\\3CXDesktopApp.exe</Data>
    <Data Name="QueryName">raw.githubusercontent.com</Data>
    <Data Name="HttpPath">/IconStorages/images/main/icon12.ico</Data>
    <Data Name="TrailingBase64Decoded">https://akamaitechcloudservices[.]com/api/v2/sync</Data>
  </EventData>
</Event>`,
    detectionRule: {
      type: 'SURICATA',
      title: '3CXDesktopApp Fetching GitHub IconStorages Dead-Drop .ico Resolver',
      ruleCode: `alert tls $HOME_NET any -> $EXTERNAL_NET 443 (
  msg:"ET TROJAN Lazarus 3CX SmoothOperator GitHub IconStorages Dead-Drop";
  tls.sni; content:"raw.githubusercontent.com";
  reference:cve,2023-29059; classtype:trojan-activity; sid:2044812; rev:1;
)`,
      mitigation:
        'Restrict outbound DNS and HTTPS egress for VoIP clients to official vendor signaling domains and inspect proxy logs for desktop apps contacting raw.githubusercontent.com.',
    },
  },
  {
    id: '3cx-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:03.110',
    sourceNodeId: 'threecx_process',
    targetNodeId: 'edr_watcher',
    sourceLabel: 'ICONICSTEALER / Gopuram',
    targetLabel: 'Chrome Login Data + VIP C2',
    sourceType: 'IDS_ALERT',
    protocolOrEventId: 'EDR Behavioral + TLS C2',
    shortAction: 'STEALER + GOPURAM',
    info: 'VoIP phone process reads Chrome/Edge Login Data (ICONICSTEALER) & receives selective Stage-2 Gopuram backdoor for crypto/finance target',
    sizeOrCode: 'Gopuram C2',
    severity: 'CRITICAL',
    mitreId: 'T1555.003',
    explanation:
      'CrowdStrike and Kaspersky telemetry show how behavioral EDR exposes the attack even behind a valid 3CX certificate: a desk VoIP phone reading Chrome/Edge Login Data (ICONICSTEALER) and receiving the selective Stage-2 Gopuram modular backdoor for high-value finance/crypto enterprises.',
    rawLog: `// CrowdStrike / Kaspersky Behavioral Detection Alert
AlertTitle:       Signed VoIP Application Accessing Browser Credential Store + Selective Backdoor
Host:             WKS-TRD-14 (10.10.8.41 · Financial Trading Desk)
Process:          3CXDesktopApp.exe (PID 7120 · Valid 3CX Authenticode Signature)
AnomalousAccess:  C:\\Users\\d.chen\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data
Stage2Implant:    ICONICSTEALER -> Selective Stage-2 Gopuram Backdoor (0x000001C948280000)
RemoteC2:         akamaitechcloudservices[.]com:443 (TLS 1.3 Beacon)
Verdict:          CONFIRMED SUPPLY-CHAIN INTRUSION (Lazarus / UNC4736)`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Non-Browser Signed Desktop Application Accessing Chromium Login Data Vault',
      ruleCode: `title: VoIP or Non-Browser App Reading Browser Credential Databases
logsource:
  product: windows
  category: file_access
detection:
  selection_target:
    TargetFilename|endswith:
      - '\\Chrome\\User Data\\Default\\Login Data'
      - '\\Edge\\User Data\\Default\\Login Data'
  filter_browsers:
    Image|endswith:
      - '\\chrome.exe'
      - '\\msedge.exe'
  condition: selection_target and not filter_browsers
level: critical`,
      mitigation:
        'Deploy behavioral EDR rules blocking non-browser processes from reading Chromium Login Data and Local State files regardless of valid code signatures.',
    },
  },
];
