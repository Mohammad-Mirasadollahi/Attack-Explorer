import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const OFFICIAL_BATCH8_SPECIALIZED_EXPANSION_SCENARIOS: LegacyDraftScenario[] = [
  // ============================================================================
  // 1. ICS_OT_SCADA (2 Scenarios -> Total 5)
  // ============================================================================
  {
    id: 'ics-frostygoop-modbus-tcp-district-heating-controller-audit',
    title: 'Dragos FrostyGoop Report, CERT-UA & CISA ICS — Industrial ENCO Controller Modbus TCP Port 502 Register Audit',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1190',
    description:
      'Grounded in the Dragos FrostyGoop ICS Malware analysis, CERT-UA municipal district heating incident response reports, and CISA ICS security guidance: OT defenders investigate external TCP port 502 Modbus connections targeting ENCO industrial controllers, correlate Modbus function codes 0x03 (Read Holding Registers) and 0x10 (Write Multiple Registers), and audit Zeek ICS protocol logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Router Pivot Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Municipal OT Perimeter Router', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ENCO Heating Controller (:502)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Zeek ICS & Dragos OT Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Modbus Holding Register Map', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: External Modbus TCP Port 502 Session & Device Identification (FC 43 / MEI)',
        narration:
          'OT network sensors record an unauthenticated TCP handshake on port 502 reaching an internet-accessible municipal heating controller, followed by Modbus Encapsulated Interface (Function Code 43 / 0x2B, MEI Type 14) Read Device Identification queries enumerating vendor and firmware strings.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'zeek-cut id.orig_h id.resp_h func < modbus.log | sort | uniq -c',
          'jq \'. | select(.dest_port==502 and .modbus.function_code==43)\' /var/log/suricata/eve.json',
        ],
        defenseMitigation:
          'Remove all Modbus TCP (port 502) industrial controllers from direct internet exposure, enforce IPsec/WireGuard VPNs with MFA for remote vendor maintenance, and deploy Purdue Model Level 3.5 DMZ segmentation.',
        logs: [
          {
            id: 'ics-frostygoop-1',
            timestamp: '03:14:09.112',
            source: 'Zeek ICS',
            severity: 'high',
            EventCode: 502,
            ProcessName: 'zeek-modbus',
            CommandLine: 'modbus_tcp unit_id=1 func=READ_DEVICE_IDENTIFICATION (0x2B) mei_type=14',
            raw: 'ts=1763358849.112 uid=CHw91L2k0 orig_h=198.51.100.84 resp_h=10.60.12.40 resp_p=502 proto=tcp service=modbus func=ENCAPSULATED_INTERFACE_TRANSPORT',
            parsedFields: {
              Protocol: 'Modbus TCP (Port 502)',
              FunctionCode: '0x2B (43 - Read Device Identification)',
              TargetDevice: 'ENCO Industrial Heating Controller (10.60.12.40)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Bulk Holding Register Enumeration via Function Code 0x03',
        narration:
          'The FrostyGoop Golang client reads JSON tasking files and issues sequential Modbus Function Code 0x03 (Read Holding Registers) requests across address ranges 40001–40120 to baseline current valve positions, water temperature telemetry, and pressure setpoints.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Collection (T1005 - Data from Local System)',
        technicalCommands: [
          'awk \'$7 == "READ_HOLDING_REGISTERS" {print $1, $3, $5, $8, $9}\' /opt/zeek/logs/current/modbus_detailed.log',
          'tshark -r ot_substation_capture.pcap -Y "modbus.func_code == 3" -T fields -e ip.src -e modbus.reference_num -e modbus.word_cnt',
        ],
        defenseMitigation:
          'Deploy passive OT network monitoring (Zeek Modbus parser or Dragos/Nozomi sensors) to baseline authorized HMI polling intervals and alert on non-HMI source IPs issuing Function Code 0x03 sweeps.',
        logs: [
          {
            id: 'ics-frostygoop-2',
            timestamp: '03:15:22.408',
            source: 'Zeek ICS',
            severity: 'high',
            EventCode: 3,
            ProcessName: 'zeek-modbus',
            CommandLine: 'modbus_tcp unit_id=1 func=READ_HOLDING_REGISTERS (0x03) start_addr=0x0064 count=32',
            raw: 'ts=1763358922.408 uid=CHw91L2k0 orig_h=198.51.100.84 resp_h=10.60.12.40 resp_p=502 func=READ_HOLDING_REGISTERS address=100 quantity=32',
            parsedFields: {
              ModbusFunction: '0x03 (Read Holding Registers)',
              RegisterRange: '40101–40132 (Heating Loop Setpoints & Sensor Calibration)',
              PollingSourceIp: '198.51.100.84 (Unauthorized Non-SCADA Host)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Holding Register Overwrite via Function Codes 0x06 & 0x10 and Firmware Inspection',
        narration:
          'Zeek ICS logs capture Function Code 0x06 (Write Single Register) and Function Code 0x10 (Write Multiple Registers) modifying heating controller parameters and inaccurate temperature calibration offsets, prompting OT incident responders to verify controller register state from engineering backups.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1565.002 - Data Manipulation: Transmitted Data Manipulation)',
        technicalCommands: [
          'tshark -r ot_substation_capture.pcap -Y "modbus.func_code == 6 || modbus.func_code == 16" -T fields -e frame.time -e ip.src -e modbus.reference_num -e modbus.regval_uint16',
          'jq \'. | select(.modbus.function_code==16)\' /var/log/suricata/eve.json',
        ],
        defenseMitigation:
          'Enforce hardware physical write-protect switches on PLCs/RTUs where supported, restrict Modbus write function codes (0x05, 0x06, 0x0F, 0x10) at industrial application-layer firewalls to a single engineering workstation IP, and maintain offline golden register backups.',
        logs: [
          {
            id: 'ics-frostygoop-3',
            timestamp: '03:16:04.890',
            source: 'Zeek ICS',
            severity: 'critical',
            EventCode: 16,
            ProcessName: 'zeek-modbus',
            CommandLine: 'modbus_tcp unit_id=1 func=WRITE_MULTIPLE_REGISTERS (0x10) start_addr=0x0064 count=8',
            raw: 'ts=1763358964.890 uid=CHw91L2k0 orig_h=198.51.100.84 resp_h=10.60.12.40 resp_p=502 func=WRITE_MULTIPLE_REGISTERS address=100 quantity=8 values=[0,0,0,0,65535,0,0,0]',
            parsedFields: {
              ModbusFunction: '0x10 (Write Multiple Registers)',
              ModifiedAddresses: 'Registers 40101–40108 (Valve Actuator & Thermal Setpoint)',
              DetectionAlert: 'SURICATA Modbus Unauthorized Write Multiple Registers from External Subnet',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit',
    title: 'CISA ICS-ALERT-10-196-01, Symantec Dossier & MITRE ICS — SIMATIC STEP 7 s7otbxdx.dll Interception & S7comm PLC Logic Audit',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1574.001',
    description:
      'Grounded in CISA Advisory ICS-ALERT-10-196-01, Symantec W32.Stuxnet technical documentation, and MITRE ATT&CK for ICS: forensic analysts examine DLL search-order interception of Siemens SIMATIC STEP 7 communication library s7otbxdx.dll (renamed to s7otbxsx.dll), inspect S7comm TCP port 102 block download telegrams (OB1, OB35, DP_RECV), and audit offline PLC project checksum mismatches.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Engineering Workstation (STEP 7)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 's7otbxdx.dll API Wrapper', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'PLC CPU 315-2 / 417 (:102)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'OT Packet & Host Integrity Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Profibus Frequency Converter Bus', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Engineering Workstation STEP 7 s7otbxdx.dll Wrapper Replacement Audit',
        narration:
          'On the SIMATIC STEP 7 engineering workstation, host forensic sensors detect the original Siemens communication library C:\\Windows\\System32\\s7otbxdx.dll renamed to s7otbxsx.dll and replaced by an unsigned wrapper DLL that forwards all 109 exported s7ag_* API functions while intercepting PLC block read/write calls.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence (T1574.001 - Hijack Execution Flow: DLL Search Order Hijacking)',
        technicalCommands: [
          'sigcheck.exe -u -e C:\\Windows\\System32\\s7otbx*.dll',
          'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-Sysmon/Operational"; Id=7} | Where-Object {$_.Message -match "s7otbxdx.dll"}',
        ],
        defenseMitigation:
          'Enforce Windows Defender Application Control (WDAC) on OT engineering workstations to block unsigned DLLs from loading into s7tgtopx.exe, and monitor C:\\Windows\\System32\\s7otbxdx.dll cryptographic hashes.',
        logs: [
          {
            id: 'ics-s7comm-1',
            timestamp: '10:04:18.205',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 's7tgtopx.exe',
            CommandLine: 'C:\\Program Files\\Siemens\\Step7\\s7bin\\s7tgtopx.exe',
            raw: 'EventID=7 Image="C:\\Program Files\\Siemens\\Step7\\s7bin\\s7tgtopx.exe" ImageLoaded="C:\\Windows\\System32\\s7otbxdx.dll" Signed="false" OriginalFileName="s7otbxsx.dll"',
            parsedFields: {
              HostApplication: 'SIMATIC Manager (s7tgtopx.exe)',
              InterceptedLibrary: 'C:\\Windows\\System32\\s7otbxdx.dll (Unsigned Wrapper)',
              OriginalRenamedDll: 'C:\\Windows\\System32\\s7otbxsx.dll (Legitimate Siemens DLL)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: S7comm Port 102 PLC Block Download (OB1, OB35 & System Data Block SDB)',
        narration:
          'Over ISO-on-TCP (RFC 1006 port 102), the wrapper library checks attached System Data Blocks (SDBs) for specific Profibus CP 342-5 / drive signatures (7050h / 9500h) and transmits S7comm Function 0x1A (Request Download) and 0x1B (Download Block) telegrams writing organization blocks OB1 and cyclic interrupt OB35.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Execution (T1059 - Command and Scripting Interpreter)',
        technicalCommands: [
          'tshark -r step7_plc_traffic.pcap -Y "s7comm.param.func == 0x1a || s7comm.param.func == 0x1b" -T fields -e ip.src -e ip.dst -e s7comm.param.filename',
          'zeek-cut ts id.orig_h id.resp_h rosctr function_name block_type block_number < s7comm.log',
        ],
        defenseMitigation:
          'Keep PLC physical mode selector keyswitches in RUN (rather than RUN-P) during production operations so remote S7comm block downloads (0x1A/0x1B) are hardware-rejected by the CPU.',
        logs: [
          {
            id: 'ics-s7comm-2',
            timestamp: '10:05:41.612',
            source: 'Zeek ICS',
            severity: 'critical',
            EventCode: 102,
            ProcessName: 'zeek-s7comm',
            CommandLine: 's7comm port=102 func=0x1B (Download Block) block=OB35 (Cyclic Watchdog Interrupt)',
            raw: 'ts=1763383541.612 orig_h=10.60.5.12 resp_h=10.60.20.101 resp_p=102 proto=tcp service=iso_tsap s7comm_func=0x1B block_type=OB block_num=35',
            parsedFields: {
              Protocol: 'Siemens S7comm over ISO-on-TCP (Port 102)',
              S7FunctionCode: '0x1B (Download Block to PLC RAM/EPROM)',
              TargetBlocks: 'OB1 (Main Sweep), OB35 (100ms Cyclic Interrupt), FC1865..FC1874',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: S7comm Upload Block (0x1D) Readback Spoofing & Offline Checksum Verification',
        narration:
          'When an operator opens SIMATIC Manager to compare online PLC blocks with the offline project, the s7otbxdx.dll wrapper intercepts s7ag_read_szl and s7ag_bub_read_var_seg calls to hide the injected FC blocks, requiring defenders to perform a clean-boot workstation verification or direct network capture of S7comm Function 0x1D (Upload Block).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1564 - Hide Artifacts)',
        technicalCommands: [
          'tshark -r step7_plc_traffic.pcap -Y "s7comm.param.func == 0x1d" -T fields -e frame.number -e s7comm.data.length',
          'Get-FileHash C:\\Siemens\\Step7\\S7proj\\Plant_01\\ombstx\\offline\\* -Algorithm SHA256',
        ],
        defenseMitigation:
          'Perform periodic PLC logic integrity comparisons from a read-only, air-gapped verification laptop booted from trusted media, and compare network-level S7comm Upload Block (0x1D) byte lengths against what the engineering GUI displays.',
        logs: [
          {
            id: 'ics-s7comm-3',
            timestamp: '10:08:02.930',
            source: 'Zeek ICS',
            severity: 'high',
            EventCode: 29,
            ProcessName: 'zeek-s7comm',
            CommandLine: 's7comm port=102 func=0x1D (Upload Block) OB1 wire_bytes=2940 gui_displayed_bytes=412',
            raw: 'ts=1763383682.930 orig_h=10.60.5.12 resp_h=10.60.20.101 resp_p=102 s7comm_func=0x1D block=OB1 wire_len=2940 expected_offline_len=412',
            parsedFields: {
              ForensicDiscrepancy: 'Wire S7comm OB1 size (2,940 bytes) != STEP 7 GUI displayed size (412 bytes)',
              InterceptedApiCall: 's7otbxdx.dll!s7ag_bub_read_var_seg (User-Mode Readback Filter)',
              RemediationAction: 'Restore PLC memory card from verified golden backup after replacing s7otbxdx.dll',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 2. MOBILE_TELECOM_SPYWARE (2 Scenarios -> Total 5)
  // ============================================================================
  {
    id: 'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics',
    title: 'Citizen Lab FORCEDENTRY, Google Project Zero & Apple CVE-2021-30860 — iOS JBIG2 Stream & MVT Shutdown/DataUsage Forensics',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1203',
    description:
      'Grounded in Citizen Lab FORCEDENTRY research, Google Project Zero technical analysis of the JBIG2 emulated logic circuit in CoreGraphics (CVE-2021-30860), and Amnesty International Mobile Verification Toolkit (MVT) forensic methodology: mobile DFIR investigators examine iMessage attachment staging directories, IMTransferAgent network records in DataUsage.sqlite, and CrashReporter jetsam/diagnostic logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'iMessage Attachment Delivery', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IMTransferAgent & BlastDoor', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CoreGraphics JBIG2 Parser', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'MVT iOS Backup & Sysdiagnose Analyzer', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'DataUsage.sqlite & CrashReporter', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Zero-Click iMessage Attachment Retrieval via IMTransferAgent & attachment-dir Audit',
        narration:
          'When a zero-click iMessage attachment (.gif wrapping a PDF/JBIG2 stream) arrives from Apple Push Notification service (APNs), IMTransferAgent automatically downloads the attachment from iCloud MMCS servers into ~/Library/SMS/Attachments/ without user interaction.',
        activeNodes: ['attacker', 'firewall', 'ad'],
        mitreTactic: 'Initial Access (T1203 - Exploitation for Client Execution)',
        technicalCommands: [
          'mvt-ios check-backup --iocs pegasus_forcedentry.stix2 /cases/ios_backup_decrypted/',
          'sqlite3 sms.db "SELECT rowid, filename, mime_type, total_bytes FROM attachment WHERE filename LIKE \'%.gif\';"',
        ],
        defenseMitigation:
          'Enable Apple iOS Lockdown Mode on high-risk devices (which strictly blocks complex iMessage attachment parsing including PDF/JBIG2 streams inside Messages) and update iOS to current releases.',
        logs: [
          {
            id: 'mobile-forcedentry-1',
            timestamp: '02:41:11.094',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 101,
            ProcessName: 'IMTransferAgent',
            CommandLine: '/System/Library/PrivateFrameworks/IMTransferServices.framework/IMTransferAgent',
            raw: 'mvt_sms_attachment: {"rowid":418,"guid":"at_0_9F82A1C0","filename":"~/Library/SMS/Attachments/9f/15/FA812B/IMG_0041.gif","mime_type":"image/gif","magic_header":"%PDF-1.3 (JBIG2Decode)"}',
            parsedFields: {
              ProcessName: 'IMTransferAgent',
              AttachmentPath: '~/Library/SMS/Attachments/9f/15/FA812B/IMG_0041.gif',
              HeaderMismatch: 'File extension .gif contains %PDF-1.3 header with /Filter /JBIG2Decode',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CoreGraphics Xpdf JBIG2Decode Segment Integer Overflow (CVE-2021-30860) CrashReporter Trace',
        narration:
          'As CoreGraphics renders the masqueraded attachment outside the BlastDoor sandboxed image path, the JBIG2Stream::readTextRegionSeg parser processes over 70,000 segment commands using bitwise AND/OR/XOR/XNOR refinement operators, leaving diagnostic traces in CrashReporter and system logs.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1203 - Exploitation for Client Execution)',
        technicalCommands: [
          'grep -rnE "CoreGraphics|JBIG2Stream|IMTranscoderAgent" /cases/sysdiagnose/logs/CrashReporter/',
          'mvt-ios check-fs --output /cases/mvt_out/ /cases/ios_filesystem_dump/',
        ],
        defenseMitigation:
          'Collect full iOS sysdiagnose archives prior to rebooting suspected devices so volatile CrashReporter .ips files and unified log tracev3 buffers are preserved for MVT analysis.',
        logs: [
          {
            id: 'mobile-forcedentry-2',
            timestamp: '02:41:13.620',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 30860,
            ProcessName: 'IMTranscoderAgent',
            CommandLine: '/System/Library/PrivateFrameworks/IMTranscoding.framework/XPCServices/IMTranscoderAgent.xpc',
            raw: 'ips_crash_trace: {"procName":"IMTranscoderAgent","exception":"EXC_BAD_ACCESS (SIGSEGV)","frames":["CoreGraphics!JBIG2Stream::readTextRegionSeg","CoreGraphics!JBIG2Bitmap::combine"]}',
            parsedFields: {
              VulnerabilityId: 'CVE-2021-30860 (FORCEDENTRY CoreGraphics JBIG2 Integer Overflow)',
              TargetProcess: 'IMTranscoderAgent / SpringBoard',
              ForensicArtifact: '/private/var/mobile/Library/Logs/CrashReporter/IMTranscoderAgent-*.ips',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: DataUsage.sqlite & netusage.sqlite Masqueraded Process Network Attribution',
        narration:
          'Even after the staged files under /private/var/tmp/ are deleted (since Pegasus runs purely in memory and does not persist across reboots), iOS SQLite databases DataUsage.sqlite and netusage.sqlite permanently record cellular and Wi-Fi byte counts attributed to anomalous process names (such as RoleAccountd or Stagingd) with zero bundle ID.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Command and Control (T1071.001 - Application Layer Protocol: Web Protocols)',
        technicalCommands: [
          'sqlite3 DataUsage.sqlite "SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT, datetime(ZPROCESS.ZFIRSTTIMESTAMP+978307200,\'unixepoch\') FROM ZLIVEUSAGE JOIN ZPROCESS ON ZLIVEUSAGE.ZHASPROCESS = ZPROCESS.Z_PK WHERE ZPROCESS.ZBUNDLENAME IS NULL;"',
        ],
        defenseMitigation:
          'Audit ZPROCESS tables in /private/var/wireless/Library/Databases/DataUsage.sqlite and /private/var/networkd/netusage.sqlite using MVT to identify non-Apple daemon names transmitting megabytes of outbound traffic within seconds of an IMTransferAgent event.',
        logs: [
          {
            id: 'mobile-forcedentry-3',
            timestamp: '02:41:19.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'RoleAccountd',
            CommandLine: 'sqlite3 DataUsage.sqlite ZPROCESS ZPROCNAME=RoleAccountd ZBUNDLENAME=NULL',
            raw: 'mvt_datausage: {"proc_name":"RoleAccountd","bundle_id":null,"first_timestamp":"2026-11-17T02:41:18Z","wifi_in_bytes":1482910,"wifi_out_bytes":8421900,"delta_from_imtransferagent_sec":7}',
            parsedFields: {
              DatabaseArtifact: '/private/var/wireless/Library/Databases/DataUsage.sqlite (ZPROCESS / ZLIVEUSAGE)',
              AnomalousProcessName: 'RoleAccountd (ZPROCNAME with NULL ZBUNDLENAME)',
              TemporalCorrelation: 'Spawned 7 seconds after IMTransferAgent attachment download',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit',
    title: 'CISA/NSA/FBI Telecom Guidance, GSMA FS.31 & ENISA 5G — 5G Core Service-Based Interface (SBI) NRF/UDM & Diameter Roaming Audit',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1557',
    description:
      'Grounded in the joint CISA/NSA/FBI Enhanced Visibility and Hardening Guidance for Communications Infrastructure, GSMA FS.31/FS.37 interconnect security standards, and ENISA 5G Core Threat Landscape: telecom SOC analysts investigate unauthorized HTTP/2 requests on the 5G Service-Based Interface (SBI), audit Network Repository Function (NRF) OAuth2 token grants, and inspect Unified Data Management (UDM) subscriber location queries.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Roaming SEPP / Diameter Peer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: '5G Security Edge Proxy (SEPP)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '5G Core NRF & UDM (HTTP/2 SBI)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Telecom Signaling & SBI IDS', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'UDR Subscriber & LI Database', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: 5G NRF (Network Repository Function) NFRegister & OAuth2 Token Request Audit (3GPP TS 29.510)',
        narration:
          'On the 5G Core Service-Based Architecture (SBA), a compromised management host or rogue Network Function (NF) queries the Network Repository Function (NRF) via HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ and requests an OAuth 2.0 access token via POST /oauth2/token carrying scope nudm-sdm and nudm-uecm.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'jq \'. | select(.http2.path | test("/nnrf-nfm/v1/nf-instances|/oauth2/token"))\' /var/log/5gc/nrf_sbi_access.json',
          'tshark -r sbi_core_vlan.pcap -Y "http2.headers.path contains \\"oauth2/token\\"" -T fields -e ip.src -e http2.data.data',
        ],
        defenseMitigation:
          'Enforce mutual TLS (mTLS) with X.509 client certificate validation on all 3GPP TS 33.501 Service-Based Interfaces (SBI), validating that the NF Type in the certificate Subject Alternative Name matches the requested OAuth2 scope on the NRF.',
        logs: [
          {
            id: 'telecom-5gsbi-1',
            timestamp: '04:12:08.310',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'free5gc-nrf',
            CommandLine: 'POST /oauth2/token grant_type=client_credentials nfType=AMF targetNfType=UDM scope=nudm-sdm',
            raw: 'sbi_nrf_audit: {"timestamp":"2026-11-17T04:12:08.310Z","method":"POST","path":"/oauth2/token","srcIp":"10.180.14.99","nfInstanceId":"f81d4fae-7dec-11d0-a765-00a0c91e6bf6","targetNfType":"UDM","scope":"nudm-sdm nudm-uecm","status":200}',
            parsedFields: {
              Specification: '3GPP TS 29.510 (5G NRF Access Token Service)',
              RequestedScope: 'nudm-sdm (Subscriber Data Management) & nudm-uecm',
              SourceAddress: '10.180.14.99 (Unregistered OAM Subnet Host)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: UDM Subscriber Data & Serving AMF/gNodeB Location Query (/nudm-sdm/v2/)',
        narration:
          'Using the NRF-minted Bearer JWT, the caller invokes GET /nudm-sdm/v2/{supi}/am-data and /nudm-uecm/v1/{supi}/registrations/amf-3gpp-access on the Unified Data Management (UDM) function to retrieve Subscription Permanent Identifiers (SUPI/IMSI), slice selection data, and current serving gNodeB cell tower tracking area identities (TAI).',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Collection (T1557 - Adversary-in-the-Middle)',
        technicalCommands: [
          'jq \'. | select(.path | contains("/nudm-sdm/v2/") or contains("/nudm-uecm/v1/"))\' /var/log/5gc/udm_audit.json',
        ],
        defenseMitigation:
          'Implement GSMA FS.37 / 3GPP TS 33.501 authorization policies on UDM/UDR so only registered, IP-allowlisted AMF and SMF instances can query subscriber location or authentication vectors.',
        logs: [
          {
            id: 'telecom-5gsbi-2',
            timestamp: '04:12:45.772',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'free5gc-udm',
            CommandLine: 'GET /nudm-uecm/v1/imsi-310260991827364/registrations/amf-3gpp-access HTTP/2',
            raw: 'sbi_udm_audit: {"timestamp":"2026-11-17T04:12:45.772Z","method":"GET","path":"/nudm-uecm/v1/imsi-310260991827364/registrations/amf-3gpp-access","srcIp":"10.180.14.99","supi":"imsi-310260991827364","status":200}',
            parsedFields: {
              TargetService: '3GPP TS 29.503 / 29.504 Unified Data Management (UDM)',
              QueriedResource: '/nudm-uecm/v1/{supi}/registrations/amf-3gpp-access',
              ExposedMetadata: 'SUPI/IMSI, Serving AMF GUAMI & Cell Tracking Area Identity (TAI)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Diameter S6a Insert-Subscriber-Data (IDR) & SEPP Interconnect Anomaly Correlation',
        narration:
          'In parallel across the 4G/5G interworking boundary, signaling firewalls inspect Diameter S6a Authentication-Information-Request (AIR, Command Code 318) and Insert-Subscriber-Data-Request (IDR, Command Code 319) frames arriving from external PLMN roaming peers with mismatched Origin-Host and source SCTP/IP bindings.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery)',
        technicalCommands: [
          'tshark -r diameter_s6a_interconnect.pcap -Y "diameter.cmd.code == 318 || diameter.cmd.code == 319" -T fields -e sctp.srcport -e diameter.Origin-Host -e diameter.Origin-Realm -e diameter.User-Name',
        ],
        defenseMitigation:
          'Enforce GSMA FS.19 Diameter Signaling Firewall Category 1–3 rules at the roaming edge: verify Origin-Host/Origin-Realm against the peer SCTP IP association and correlate subscriber location against previous attach velocity.',
        logs: [
          {
            id: 'telecom-5gsbi-3',
            timestamp: '04:13:19.105',
            source: 'Suricata IDS',
            severity: 'critical',
            EventCode: 318,
            ProcessName: 'diameter-fw',
            CommandLine: 'Diameter S6a cmd=318 (AIR) Origin-Realm=epc.mnc099.mcc250.3gppnetwork.org velocity_anomaly=true',
            raw: 'gsma_fs19_alert: {"protocol":"Diameter-S6a","cmdCode":318,"cmdName":"Authentication-Information-Request","originHost":"mme01.roam-partner.net","userName":"310260991827364","rule":"FS.19-CAT2-VELOCITY-CHECK","action":"BLOCKED_AND_LOGGED"}',
            parsedFields: {
              SignalingProtocol: 'Diameter S6a (3GPP TS 29.272 Command Code 318 AIR)',
              FirewallRuleTriggered: 'GSMA FS.19 Category 2 Velocity & Home-Network Location Mismatch',
              DefensiveAction: 'Signaling frame dropped at DEA / SEPP and correlated with SBI UDM query',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 3. DATABASE_DATA_PLATFORMS (2 Scenarios -> Total 5)
  // ============================================================================
  {
    id: 'db-snowflake-unc5537-single-factor-auth-data-egress-audit',
    title: 'Mandiant & Snowflake Joint Report (UNC5537), CISA & MITRE T1530 — Snowflake Single-Factor Session & QUERY_HISTORY Egress Forensics',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1078.004',
    description:
      'Grounded in the joint Mandiant and Snowflake incident response guide for UNC5537 ("frostea" / Rapeflake), CISA cloud database security guidance, and MITRE ATT&CK T1078.004 / T1530: cloud data platform responders query SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY and SESSIONS for single-factor password logins from non-corporate IPs, inspect client application identifiers, and audit QUERY_HISTORY for bulk COPY INTO stage exports.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External SQL Client (DBeaver)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Snowflake Network Policy Gate', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Snowflake Virtual Warehouse', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'ACCOUNT_USAGE Audit & SIEM', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Customer PII Tables & Internal Stage', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Single-Factor Password Authentication in ACCOUNT_USAGE.LOGIN_HISTORY',
        narration:
          'Using historical credentials harvested from an infostealer infection on a contractor workstation, an external client authenticates to a Snowflake tenant account that lacks a Network Policy IP allowlist and has not enforced multi-factor authentication (SECOND_AUTHENTICATION_FACTOR = NULL in LOGIN_HISTORY).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1078.004 - Valid Accounts: Cloud Accounts)',
        technicalCommands: [
          'SELECT EVENT_TIMESTAMP, USER_NAME, CLIENT_IP, REPORTED_CLIENT_TYPE, FIRST_AUTHENTICATION_FACTOR, SECOND_AUTHENTICATION_FACTOR FROM SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY WHERE IS_SUCCESS = \'YES\' AND SECOND_AUTHENTICATION_FACTOR IS NULL;',
        ],
        defenseMitigation:
          'Enforce Snowflake Authentication Policies requiring MFA or OAuth/SAML SSO for all human users, mandate RSA key-pair or OAuth Workload Identity for service accounts (TYPE = SERVICE), and attach account-level and user-level Network Policies.',
        logs: [
          {
            id: 'db-snowflake-1',
            timestamp: '01:22:14.502',
            source: 'CloudTrail',
            severity: 'high',
            EventCode: 1001,
            ProcessName: 'snowflake-authn',
            CommandLine: 'LOGIN_HISTORY user=SVC_BI_ANALYTICS first_factor=PASSWORD second_factor=NULL client=JDBC_DRIVER',
            raw: 'snowflake_login_history: {"EVENT_ID":9481024,"USER_NAME":"SVC_BI_ANALYTICS","CLIENT_IP":"198.51.100.214","REPORTED_CLIENT_TYPE":"JDBC_DRIVER","REPORTED_CLIENT_VERSION":"3.14.4","FIRST_AUTHENTICATION_FACTOR":"PASSWORD","SECOND_AUTHENTICATION_FACTOR":null,"IS_SUCCESS":"YES"}',
            parsedFields: {
              AuditView: 'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY & SESSIONS',
              AuthenticationFactors: 'FIRST_AUTHENTICATION_FACTOR=PASSWORD, SECOND_AUTHENTICATION_FACTOR=NULL',
              ClientApplication: 'DBeaver_DBeaverUltimate / JDBC_DRIVER 3.14.4 from 198.51.100.214',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Schema Discovery & Privilege Enumeration in ACCOUNT_USAGE.QUERY_HISTORY',
        narration:
          'Once authenticated, the session executes automated discovery queries (SHOW GRANTS TO USER, SHOW DATABASES, SHOW SCHEMAS, and SELECT * FROM INFORMATION_SCHEMA.TABLES) recorded in SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY with SESSION_ID linkage.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Discovery (T1087.004 - Account Discovery: Cloud Account)',
        technicalCommands: [
          'SELECT QUERY_ID, USER_NAME, ROLE_NAME, QUERY_TYPE, QUERY_TEXT, ROWS_PRODUCED FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE SESSION_ID = 884120994102 ORDER BY START_TIME;',
        ],
        defenseMitigation:
          'Stream SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and SESSIONS into the enterprise SIEM and alert on non-scheduled SHOW GRANTS / INFORMATION_SCHEMA enumeration from interactive SQL clients (DBeaver, Rapeflake, SnowSQL).',
        logs: [
          {
            id: 'db-snowflake-2',
            timestamp: '01:23:05.819',
            source: 'CloudTrail',
            severity: 'high',
            EventCode: 1002,
            ProcessName: 'snowflake-sql',
            CommandLine: 'SHOW GRANTS TO USER SVC_BI_ANALYTICS; SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, ROW_COUNT, BYTES FROM INFORMATION_SCHEMA.TABLES;',
            raw: 'snowflake_query_history: {"QUERY_ID":"01b84f10-0002-91a4-0000-44810029a10e","SESSION_ID":884120994102,"USER_NAME":"SVC_BI_ANALYTICS","ROLE_NAME":"ACCOUNTADMIN","QUERY_TYPE":"SHOW","EXECUTION_STATUS":"SUCCESS"}',
            parsedFields: {
              ActiveRole: 'ACCOUNTADMIN (Over-Privileged Legacy Service Account)',
              DiscoveryQueries: 'SHOW GRANTS TO USER; SHOW TERSE DATABASES; INFORMATION_SCHEMA.TABLES',
              SessionId: '884120994102',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Bulk Table Staging via COPY INTO @~ & GET File Egress Forensics',
        narration:
          'To compress and export high-row-count tables rapidly, the session executes COPY INTO @~/export_stage/ FROM PROD_DB.PUBLIC.CUSTOMER_RECORDS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP) followed by GET @~/export_stage/ file:///tmp/, logging large BYTES_WRITTEN_TO_RESULT and DATA_TRANSFER_HISTORY anomalies.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'SELECT QUERY_ID, USER_NAME, QUERY_TEXT, ROWS_UNLOADED, BYTES_WRITTEN_TO_RESULT FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY WHERE QUERY_TYPE IN (\'UNLOAD\', \'GET_FILES\') AND START_TIME >= DATEADD(day, -7, CURRENT_TIMESTAMP());',
        ],
        defenseMitigation:
          'Restrict CREATE STAGE and user stage (@~) unload operations using least-privilege RBAC roles, configure STORAGE_INTEGRATION allowed locations, and immediately rotate credentials and terminate active sessions via SYSTEM$ABORT_SESSION.',
        logs: [
          {
            id: 'db-snowflake-3',
            timestamp: '01:26:49.330',
            source: 'CloudTrail',
            severity: 'critical',
            EventCode: 1003,
            ProcessName: 'snowflake-sql',
            CommandLine: 'COPY INTO @~/staging_dump/customers.csv.gz FROM PROD_DB.PUBLIC.CUSTOMER_RECORDS FILE_FORMAT=(TYPE=CSV COMPRESSION=GZIP);',
            raw: 'snowflake_query_history: {"QUERY_ID":"01b84f12-0002-91a4-0000-44810029b412","SESSION_ID":884120994102,"QUERY_TYPE":"UNLOAD","ROWS_UNLOADED":4820190,"BYTES_SCANNED":1948201984,"EXECUTION_STATUS":"SUCCESS"}',
            parsedFields: {
              QueryType: 'UNLOAD (COPY INTO @~ User Stage) followed by GET_FILES',
              RowsUnloaded: '4,820,190 rows (~1.94 GB scanned)',
              IncidentResponseAction: 'ALTER USER SVC_BI_ANALYTICS SET DISABLED = TRUE; SELECT SYSTEM$ABORT_SESSION(884120994102);',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'db-mongodb-mongobleed-unauthenticated-replication-oplog-audit',
    title: 'MongoDB Official Security Guide, CISA & MITRE T1530 — Exposed MongoDB Wire Protocol Port 27017 & local.oplog.rs Audit Forensics',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1213',
    description:
      'Grounded in the MongoDB Official Security Checklist, CISA database exposure advisories, and MITRE ATT&CK T1213 / T1530: database forensic analysts investigate MongoDB instances bound to 0.0.0.0:27017 without security.authorization enabled, analyze OP_MSG wire protocol commands (listDatabases, find on local.oplog.rs), and correlate MongoDB structured JSON audit logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Wire Protocol Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'mongod TCP Socket (:27017)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MongoDB ReplicaSet Primary', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'MongoDB Audit Log & SIEM', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'local.oplog.rs & Collections', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated OP_MSG Handshake (isMaster / hello) & listDatabases Enumeration',
        narration:
          'When a MongoDB daemon (mongod) is started with net.bindIp: 0.0.0.0 and security.authorization: disabled, an external client connects to TCP port 27017 and sends OP_MSG (opcode 2013) hello and listDatabases commands, receiving the complete catalog of database names and byte sizes without authentication.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery)',
        technicalCommands: [
          'jq \'. | select(.id==20426 or .attr.command.listDatabases==1)\' /var/log/mongodb/mongod.log',
          'ss -tulpn | grep 27017',
        ],
        defenseMitigation:
          'Configure security.authorization: enabled in /etc/mongod.conf, bind net.bindIp strictly to localhost (127.0.0.1) or private VPC subnets, and require SCRAM-SHA-256 or X.509 mutual TLS authentication.',
        logs: [
          {
            id: 'db-mongodb-1',
            timestamp: '05:18:04.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 51800,
            ProcessName: 'mongod',
            CommandLine: 'mongod OP_MSG {"listDatabases":1,"$db":"admin"} client=198.51.100.73:52190',
            raw: 'mongod_json: {"t":{"$date":"2026-11-17T05:18:04.115Z"},"s":"I","c":"NETWORK","id":51800,"ctx":"conn412","msg":"client metadata","attr":{"remote":"198.51.100.73:52190","doc":{"driver":{"name":"PyMongo","version":"4.6.1"}}}}',
            parsedFields: {
              WireProtocolOpcode: 'OP_MSG (2013) — hello & listDatabases: 1',
              ClientDriverMetadata: 'PyMongo 4.6.1 from 198.51.100.73:52190',
              ConfigVulnerability: 'net.bindIp: 0.0.0.0 with security.authorization: disabled',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Replication Oplog (local.oplog.rs) Inspection for Historical Credentials & Tokens',
        narration:
          'Beyond active collections, the client queries the MongoDB replication operation log (local.oplog.rs), which stores a rolling history of every insert, update, and delete operation across the replica set—allowing recovery of recently deleted API keys, session JWTs, and password reset tokens.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Credential Access (T1552 - Unsecured Credentials)',
        technicalCommands: [
          'jq \'. | select(.attr.ns=="local.oplog.rs")\' /var/log/mongodb/mongod.log',
          'jq \'. | select(.atype=="authCheck" and .param.ns=="local.oplog.rs")\' /var/log/mongodb/auditLog.json',
        ],
        defenseMitigation:
          'Enable MongoDB Enterprise/Percona Audit Logging (auditLog.destination: file, auditLog.filter) to capture all authCheck events against admin, config, and local.oplog.rs namespaces.',
        logs: [
          {
            id: 'db-mongodb-2',
            timestamp: '05:19:12.640',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 20429,
            ProcessName: 'mongod',
            CommandLine: 'mongod command local.oplog.rs appName="PyMongo" command: find { "ns": /users|sessions|tokens/ }',
            raw: 'mongod_audit: {"atype":"authCheck","ts":{"$date":"2026-11-17T05:19:12.640Z"},"remote":{"ip":"198.51.100.73","port":52190},"users":[],"param":{"command":"find","ns":"local.oplog.rs"},"result":0}',
            parsedFields: {
              TargetNamespace: 'local.oplog.rs (Replica Set Rolling Operation Log)',
              QueryFilter: 'find { "ns": /users|sessions|tokens/, "op": { "$in": ["i", "u", "d"] } }',
              AuditResult: 'result: 0 (Authorized due to missing RBAC enforcement)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Bulk Collection Cursor Exhaustion (getMore) & Destructive dropDatabase Audit',
        narration:
          'In automated MongoDB extortion campaigns (Mongobleed / Kraken0), the script streams production collections via rapid getMore cursor batches, inserts a single ransom note document into a new WARNING collection, and issues dropDatabase (atype: dropDatabase) against the original database.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1485 - Data Destruction)',
        technicalCommands: [
          'jq \'. | select(.atype=="dropDatabase" or .atype=="dropCollection")\' /var/log/mongodb/auditLog.json',
        ],
        defenseMitigation:
          'Enforce custom MongoDB RBAC roles that omit dropDatabase and dropCollection privileges from application accounts, and maintain immutable point-in-time oplog snapshots on isolated object storage.',
        logs: [
          {
            id: 'db-mongodb-3',
            timestamp: '05:21:48.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 20435,
            ProcessName: 'mongod',
            CommandLine: 'mongod command prod_crm.$cmd command: dropDatabase { dropDatabase: 1 }',
            raw: 'mongod_audit: {"atype":"dropDatabase","ts":{"$date":"2026-11-17T05:21:48.902Z"},"remote":{"ip":"198.51.100.73","port":52190},"param":{"ns":"prod_crm"},"result":0}',
            parsedFields: {
              AuditActionType: 'atype: dropDatabase on namespace prod_crm',
              PrecedingActivity: 'High-volume getMore cursor reads + insert into READ_ME_TO_RECOVER.note',
              RecoveryProcedure: 'Replay point-in-time backup and oplog slices prior to timestamp 05:21:48Z',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 4. AI_LLM_MLOPS_SECURITY (2 Scenarios -> Total 6)
  // ============================================================================
  {
    id: 'ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928',
    title: 'NIST NVD CVE-2024-2928, Protect AI & MITRE ATLAS AML.T0018 — MLflow Tracking Server URI Fragment Path Traversal & Artifact Store Audit',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1190',
    description:
      'Grounded in NIST NVD CVE-2024-2928, Protect AI MLOps vulnerability disclosures, and MITRE ATLAS AML.T0018: MLOps security engineers investigate unauthenticated REST API calls to an MLflow Tracking Server (:5000), analyze crafted artifact_location URI fragment path traversal sequences (/ajax-api/2.0/mlflow/experiments/create), and audit access to cloud credentials and model artifacts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External REST API Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MLflow Flask/Gunicorn (:5000)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MLflow Artifact Handler', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'MLOps Reverse Proxy & Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Host ~/.aws/credentials & Model Store', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Experiment Creation with URI Fragment Bypass (CVE-2024-2928)',
        narration:
          'An external client sends a POST request to /ajax-api/2.0/mlflow/experiments/create on an unauthenticated MLflow Tracking Server (port 5000), supplying an artifact_location URI with a crafted URL fragment (#) that causes urllib.parseurl validation to disagree with the downstream local file path resolver.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'jq \'. | select(.uri | contains("/ajax-api/2.0/mlflow/experiments/create"))\' /var/log/nginx/mlflow_access.json',
          'grep -rn "artifact_location" /var/lib/mlflow/mlruns/*/meta.yaml',
        ],
        defenseMitigation:
          'Upgrade MLflow to v2.11.3+, enable the built-in MLflow Authentication plugin (--app-name basic-auth) or place MLflow behind an OAuth2/OIDC reverse proxy, and never expose port 5000 directly to untrusted networks.',
        logs: [
          {
            id: 'ai-mlflow-1',
            timestamp: '12:08:19.220',
            source: 'Web Access Log',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'gunicorn',
            CommandLine: 'POST /ajax-api/2.0/mlflow/experiments/create artifact_location=http://localhost#/../../../../etc/',
            raw: 'mlflow_access: {"ts":"2026-11-17T12:08:19.220Z","client_ip":"198.51.100.119","method":"POST","uri":"/ajax-api/2.0/mlflow/experiments/create","status":200,"experiment_id":"14"}',
            parsedFields: {
              VulnerabilityId: 'CVE-2024-2928 (MLflow URI Fragment Local File Inclusion)',
              Endpoint: 'POST /ajax-api/2.0/mlflow/experiments/create',
              CraftedArtifactLocation: 'http://localhost#/../../../../root/.aws/ (Fragment Validation Differential)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Run Registration & Model Version Source Traversal (/mlflow/model-versions/create)',
        narration:
          'The client creates a run within the crafted experiment (/api/2.0/mlflow/runs/create) and registers a model version via POST /ajax-api/2.0/mlflow/model-versions/create whose source parameter points relative to the traversed experiment artifact root.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Collection (T1005 - Data from Local System)',
        technicalCommands: [
          'jq \'. | select(.uri | contains("/mlflow/model-versions/create"))\' /var/log/nginx/mlflow_access.json',
        ],
        defenseMitigation:
          'Configure MLflow in --serve-artifacts mode with an isolated S3/GCS bucket backend rather than local filesystem paths, and restrict the OS service account running gunicorn to a chroot or read-only container filesystem.',
        logs: [
          {
            id: 'ai-mlflow-2',
            timestamp: '12:08:44.510',
            source: 'Web Access Log',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'gunicorn',
            CommandLine: 'POST /ajax-api/2.0/mlflow/model-versions/create name="audit-model" run_id="8f91a2c4"',
            raw: 'mlflow_access: {"ts":"2026-11-17T12:08:44.510Z","client_ip":"198.51.100.119","method":"POST","uri":"/ajax-api/2.0/mlflow/model-versions/create","status":200,"model_name":"audit-model","version":"1"}',
            parsedFields: {
              ApiEndpoint: 'POST /ajax-api/2.0/mlflow/model-versions/create',
              LinkedRunId: '8f91a2c4e0194810b92a',
              ResolvedLocalPath: '/root/.aws/credentials & /proc/self/environ',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Arbitrary Host File Read via GET /model-versions/get-artifact & S3 Model Store Pivot',
        narration:
          'When GET /model-versions/get-artifact?name=audit-model&version=1&path=credentials is invoked, MLflow serves the host ~/.aws/credentials file over HTTP, which the attacker then uses to access the production S3 model registry bucket.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Unsecured Credentials: Credentials In Files)',
        technicalCommands: [
          'ausearch -k mlflow_file_read -m SYSCALL -sv yes',
          'jq \'. | select(.uri | contains("/model-versions/get-artifact"))\' /var/log/nginx/mlflow_access.json',
        ],
        defenseMitigation:
          'Block requests containing URL-encoded path traversal or fragment tokens (%23, ../) at the WAF/Ingress layer, and replace static ~/.aws/credentials files on MLOps servers with short-lived IAM Roles for Service Accounts (IRSA).',
        logs: [
          {
            id: 'ai-mlflow-3',
            timestamp: '12:09:02.884',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'python3',
            CommandLine: 'GET /model-versions/get-artifact?name=audit-model&version=1&path=credentials HTTP/1.1',
            raw: 'type=SYSCALL msg=audit(1763390942.884:819): arch=c000003e syscall=257 success=yes exe="/usr/bin/python3.11" comm="gunicorn" name="/root/.aws/credentials"',
            parsedFields: {
              ArtifactEndpoint: 'GET /model-versions/get-artifact',
              AccessedHostFile: '/root/.aws/credentials (opened by gunicorn worker PID 4120)',
              DownstreamImpact: 'Compromise of AWS S3 MLflow Artifact Bucket IAM Credentials',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit',
    title: 'Oligo Security, Wiz AI Research & OWASP LLM04/LLM06 — Exposed Ollama Inference API (:11434) Rogue Registry Pull & Modelfile Audit',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1190',
    description:
      'Grounded in Oligo Security and Wiz AI research on exposed LLM inference servers, OWASP Top 10 for LLM Applications (LLM04 Model Poisoning / LLM06 Excessive Agency), and MITRE ATLAS: AI infrastructure defenders audit unauthenticated Ollama REST API endpoints on TCP port 11434, inspect POST /api/pull Server-Side Request Forgery (SSRF) and rogue OCI registry interactions, and verify GGUF/Safetensors SHA-256 digests.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External API Caller', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Ollama REST Server (:11434)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'GGUF Model Store & Runner', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AI Gateway & eBPF Network Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Rogue OCI Registry & Internal Metadata', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Model Enumeration via GET /api/tags & POST /api/show',
        narration:
          'When an Ollama inference server is bound to OLLAMA_HOST=0.0.0.0:11434 without an authenticating reverse proxy, an external client calls GET /api/tags and POST /api/show to enumerate loaded enterprise fine-tuned models, system prompts, LoRA adapters, and template parameters.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery (T1518 - Software Discovery)',
        technicalCommands: [
          'ss -tulpn | grep 11434',
          'journalctl -u ollama -n 100 --no-pager | grep -E "/api/tags|/api/show"',
        ],
        defenseMitigation:
          'Bind Ollama strictly to loopback (OLLAMA_HOST=127.0.0.1:11434) and place an authenticating AI Gateway (with API key or mTLS verification) in front of all /api/* endpoints.',
        logs: [
          {
            id: 'ai-ollama-1',
            timestamp: '14:15:08.112',
            source: 'Web Access Log',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'ollama',
            CommandLine: 'GIN /api/tags & POST /api/show {"name":"corp-finance-assistant:latest"}',
            raw: '[GIN] 2026/11/17 - 14:15:08 | 200 | 1.42ms | 198.51.100.62 | POST "/api/show" model="corp-finance-assistant:latest"',
            parsedFields: {
              ExposedService: 'Ollama Inference API (TCP Port 11434, OLLAMA_HOST=0.0.0.0)',
              EnumeratedEndpoint: 'GET /api/tags & POST /api/show',
              LeakedConfiguration: 'System Prompt, Fine-Tuned LoRA Adapter Path & GGUF SHA-256 Digest',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Arbitrary Registry Model Pull & SSRF via POST /api/pull',
        narration:
          'The external caller invokes POST /api/pull with a custom registry host URL ({"name":"registry.attacker-infra.net/library/poisoned-llm:v1"}), causing the Ollama server daemon to initiate outbound HTTPS requests to the untrusted registry (SSRF) and download tampered GGUF layer blobs into ~/.ollama/models/blobs/.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Stage Capabilities (T1608.001 - Stage Capabilities: Upload Malware)',
        technicalCommands: [
          'journalctl -u ollama --no-pager | grep "/api/pull"',
          'sha256sum /usr/share/ollama/.ollama/models/blobs/sha256-*',
        ],
        defenseMitigation:
          'Restrict outbound egress from GPU inference nodes via network firewall rules to approved internal model registries only, and block external access to /api/pull, /api/push, /api/create, and /api/delete.',
        logs: [
          {
            id: 'ai-ollama-2',
            timestamp: '14:16:22.490',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ollama',
            CommandLine: 'POST /api/pull {"name":"198.51.100.62:5000/namespace/backdoored-adapter:latest"}',
            raw: '[GIN] 2026/11/17 - 14:16:22 | 200 | 4.81s | 198.51.100.62 | POST "/api/pull" pulling manifest from https://198.51.100.62:5000/v2/namespace/backdoored-adapter/manifests/latest',
            parsedFields: {
              AbusedEndpoint: 'POST /api/pull (Custom Registry SSRF & Untrusted Blob Ingestion)',
              OutboundConnection: 'ollama -> https://198.51.100.62:5000/v2/.../blobs/sha256:9f4a8b...',
              BlobStoragePath: '/usr/share/ollama/.ollama/models/blobs/sha256-9f4a8b...',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Production Model Alias Overwrite via POST /api/create & Prompt Backdoor Audit',
        narration:
          'By calling POST /api/create with {"name":"corp-finance-assistant:latest","modelfile":"FROM ... SYSTEM ..."}, the caller overwrites the production model tag in ~/.ollama/models/manifests/ to embed a hidden system prompt instruction or poisoned weights that alter downstream application responses.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1565.001 - Data Manipulation: Stored Data Manipulation)',
        technicalCommands: [
          'cat /usr/share/ollama/.ollama/models/manifests/registry.ollama.ai/library/corp-finance-assistant/latest | jq .',
          'ausearch -f /usr/share/ollama/.ollama/models/manifests -m SYSCALL',
        ],
        defenseMitigation:
          'Mount ~/.ollama/models as read-only (ro) in production inference containers after pre-loading verified model digests during CI/CD build time, and monitor manifest files with Linux auditd / Falco.',
        logs: [
          {
            id: 'ai-ollama-3',
            timestamp: '14:17:05.918',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'ollama',
            CommandLine: 'POST /api/create {"name":"corp-finance-assistant:latest"} manifest digest modified',
            raw: 'type=SYSCALL msg=audit(1763398625.918:942): arch=c000003e syscall=257 success=yes exe="/usr/local/bin/ollama" name="/usr/share/ollama/.ollama/models/manifests/registry.ollama.ai/library/corp-finance-assistant/latest"',
            parsedFields: {
              AbusedEndpoint: 'POST /api/create (Production Model Tag Overwrite)',
              ModifiedManifest: 'manifests/registry.ollama.ai/library/corp-finance-assistant/latest',
              OWASPCategory: 'OWASP LLM04:2025 (Data and Model Poisoning)',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 5. ZERO_DAY_APPLIANCES (2 Scenarios -> Total 9)
  // ============================================================================
  {
    id: 'ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit',
    title: 'CISA KEV, Ivanti Security Advisory & CERT-EU — Ivanti Virtual Traffic Manager (vTM) Admin UI Auth Bypass Audit (CVE-2024-7593)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'T1190',
    description:
      'Grounded in the Ivanti Official Security Advisory for CVE-2024-7593, CISA Known Exploited Vulnerabilities (KEV) catalog, and CERT-EU technical guidance: appliance DFIR analysts investigate unauthenticated HTTP POST requests to the Ivanti Virtual Traffic Manager (vTM) Admin UI on TCP port 9090 (/apps/zxtm/wizard.fcgi), audit unauthorized local administrator account creation, and inspect TrafficScript / Action Program execution logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Scanner / Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Ivanti vTM Admin UI (:9090)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'wizard.fcgi Auth Handler', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'vTM Event Log & SIEM Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'zeus.zxtm Admin Users & Action Scripts', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Access to wizard.fcgi on Port 9090 (CVE-2024-7593)',
        narration:
          'When the Ivanti Virtual Traffic Manager (vTM) management interface on TCP port 9090 is reachable from untrusted networks, an unauthenticated request to /apps/zxtm/wizard.fcgi invokes the password-reset / wizard authentication algorithm with crafted parameters that bypass authentication verification (CVE-2024-7593).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'grep -rn "wizard.fcgi" /var/log/zeus/admin_access.log',
          'ss -tulpn | grep 9090',
        ],
        defenseMitigation:
          'Apply the official Ivanti vTM patch (22.2R1 / 22.7R2+), bind the port 9090 Admin UI and port 9070 REST API strictly to an isolated out-of-band management VLAN, and block external access to /apps/zxtm/wizard.fcgi.',
        logs: [
          {
            id: 'zday-ivanti-vtm-1',
            timestamp: '06:30:14.120',
            source: 'Web Access Log',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'zeus.admin',
            CommandLine: 'POST /apps/zxtm/wizard.fcgi HTTP/1.1 status=200 client=198.51.100.142',
            raw: '198.51.100.142 - - [17/Nov/2026:06:30:14 +0000] "POST /apps/zxtm/wizard.fcgi HTTP/1.1" 200 4182 "-" "Mozilla/5.0"',
            parsedFields: {
              VulnerabilityId: 'CVE-2024-7593 (CVSS 9.8 Critical — Ivanti vTM Authentication Bypass)',
              TargetEndpoint: 'POST https://vtm-mgmt.corp.local:9090/apps/zxtm/wizard.fcgi',
              SourceIp: '198.51.100.142 (Unauthenticated External Caller)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Unauthorized Local Administrator Account Creation in $ZEUSHOME/zxtm/conf/users',
        narration:
          'Through the wizard.fcgi handler, the unauthenticated request creates a new Full Administrator user inside the local vTM configuration file ($ZEUSHOME/zxtm/conf/users) and emits an INFO/AUDIT entry in the vTM event log indicating user group modification.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Persistence (T1136.001 - Create Account: Local Account)',
        technicalCommands: [
          'grep -E "user|admin|wizard" /usr/local/zeus/zxtm/log/events',
          'ls -la --time-style=full-iso /usr/local/zeus/zxtm/conf/users',
        ],
        defenseMitigation:
          'Monitor /usr/local/zeus/zxtm/conf/users and /usr/local/zeus/zxtm/log/events in real time via SIEM file integrity monitoring (FIM) and alert on any new account added to the Admin group.',
        logs: [
          {
            id: 'zday-ivanti-vtm-2',
            timestamp: '06:30:14.690',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1136,
            ProcessName: 'wizard.fcgi',
            CommandLine: 'modify /usr/local/zeus/zxtm/conf/users add_user="support_svc" group="Admin"',
            raw: '[17/Nov/2026:06:30:14 +0000] INFO config/usersModified: Configuration file "users" modified by user "wizard" from 198.51.100.142 (added user "support_svc" to group "Admin")',
            parsedFields: {
              ModifiedConfigFile: '/usr/local/zeus/zxtm/conf/users',
              CreatedAccount: 'support_svc (Assigned to Group: Admin)',
              AuditLogSource: '/usr/local/zeus/zxtm/log/events (config/usersModified)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Authenticated Admin Session & Custom Action Program Execution Audit',
        narration:
          'Authenticating with the newly created support_svc administrator account on port 9090, the operator uploads or configures a vTM Action Program ($ZEUSHOME/zxtm/conf/actions/ or extra/ scripts) that spawns a child shell under the zeus root process.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Command and Scripting Interpreter: Unix Shell)',
        technicalCommands: [
          'ls -la /usr/local/zeus/zxtm/conf/actions/ /usr/local/zeus/zxtm/conf/extra/',
          'ausearch -k zeus_child_exec -m SYSCALL -sv yes',
        ],
        defenseMitigation:
          'Audit all files under $ZEUSHOME/zxtm/conf/actions/ and $ZEUSHOME/zxtm/conf/extra/ against known configuration management baselines, and remove any unauthorized accounts from $ZEUSHOME/zxtm/conf/users.',
        logs: [
          {
            id: 'zday-ivanti-vtm-3',
            timestamp: '06:31:02.310',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'zeus.zxtm',
            CommandLine: '/bin/sh -c /usr/local/zeus/zxtm/conf/extra/healthcheck_diag.sh',
            raw: 'type=SYSCALL msg=audit(1763370662.310:614): arch=c000003e syscall=59 success=yes ppid=1840 pid=9912 uid=0 euid=0 exe="/usr/bin/dash" comm="sh" cmd="/bin/sh -c /usr/local/zeus/zxtm/conf/extra/healthcheck_diag.sh"',
            parsedFields: {
              ParentProcess: 'zeus.zxtm (PID 1840, running as uid=0 root)',
              ExecutedArtifact: '/usr/local/zeus/zxtm/conf/extra/healthcheck_diag.sh',
              ForensicIndicator: 'Config file actions/* modified by support_svc immediately after wizard.fcgi call',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit',
    title: 'Black Lotus Labs (Volt Typhoon), CISA KEV & Versa Advisory — Versa Director SD-WAN Port 4566 Favicon Upload & Java Agent Audit (CVE-2024-39717)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'T1190',
    description:
      'Grounded in Black Lotus Labs (Lumen) Volt Typhoon research on the VersaMem web shell, CISA KEV CVE-2024-39717, and the Versa Networks official security advisory: network appliance responders audit high-port HA/management listeners (TCP 4566 / 443), inspect /portalapi/v1/users/username/options/change_Dynamic_Favicon file upload requests masquerading a .jar archive with a .png extension, and analyze Java Virtual Machine (JVM) Dynamic Attach / Instrumentation memory artifacts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Authenticated Tenant / Port 4566', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Versa Director Portal API (:4566)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Apache Tomcat JVM & /var/versa/', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Versa Audit & Linux Memory Forensics', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'In-Memory Java Instrumentation Agent', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Port 4566 /portalapi change_Dynamic_Favicon File Type Validation Bypass (CVE-2024-39717)',
        narration:
          'When Versa Director SD-WAN orchestration port 4566 (intended for internal HA/Spring Boot communication) or the tenant portal API is reachable, a caller invokes POST /portalapi/v1/users/username/options/change_Dynamic_Favicon to upload a Java archive (.jar) disguised with a .png file extension into /var/versa/vnms/web/custom_logo/ (CVE-2024-39717).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'grep -rn "change_Dynamic_Favicon" /var/log/versa/vnms/',
          'file /var/versa/vnms/web/custom_logo/*',
        ],
        defenseMitigation:
          'Upgrade Versa Director to 21.2.3+ / 22.1.2+ (patched for CVE-2024-39717), apply Versa firewall hardening scripts so TCP ports 4566 and 4570 are restricted strictly to peer HA Director IP addresses, and verify file magic bytes in /var/versa/vnms/web/custom_logo/.',
        logs: [
          {
            id: 'zday-versa-1',
            timestamp: '08:42:11.090',
            source: 'Web Access Log',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'java',
            CommandLine: 'POST /portalapi/v1/users/provider_admin/options/change_Dynamic_Favicon filename="favicon_brand.png" magic="PK\\x03\\x04 (Java JAR)"',
            raw: 'versa_portal_access: {"ts":"2026-11-17T08:42:11.090Z","src_ip":"198.51.100.201","port":4566,"uri":"/portalapi/v1/users/provider_admin/options/change_Dynamic_Favicon","uploaded_file":"/var/versa/vnms/web/custom_logo/favicon_brand.png","status":200}',
            parsedFields: {
              VulnerabilityId: 'CVE-2024-39717 (Versa Director Unrestricted Upload of File with Dangerous Type)',
              TargetEndpoint: 'POST /portalapi/v1/users/.../options/change_Dynamic_Favicon (Port 4566)',
              FileMagicMismatch: '/var/versa/vnms/web/custom_logo/favicon_brand.png has ZIP/JAR magic header (50 4B 03 04)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: JVM VirtualMachine.attach & Java Instrumentation Agent Injection (VersaMem)',
        narration:
          'Once the disguised JAR is written to disk, it is loaded into the running Apache Tomcat JVM process via the Java Attach API (com.sun.tools.attach.VirtualMachine) and java.lang.instrument.ClassFileTransformer, hooking org.apache.catalina.core.ApplicationFilterChain.internalDoFilter in memory.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Persistence (T1505.003 - Server Software Component: Web Shell)',
        technicalCommands: [
          'jcmd $(pgrep -f tomcat) VM.class_hierarchy -i org.apache.catalina.core.ApplicationFilterChain',
          'ls -la /tmp/.java_pid*',
        ],
        defenseMitigation:
          'Add -XX:+DisableAttachMechanism to the production Tomcat JVM startup flags so runtime VirtualMachine.attach agent injection is blocked by the JVM.',
        logs: [
          {
            id: 'zday-versa-2',
            timestamp: '08:42:19.540',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'java',
            CommandLine: 'JVM Attach API loadAgent("/var/versa/vnms/web/custom_logo/favicon_brand.png") -> ClassFileTransformer retransformClasses(ApplicationFilterChain)',
            raw: 'jvm_instrument_audit: {"pid":2418,"process":"org.apache.catalina.startup.Bootstrap","socket":"/tmp/.java_pid2418","agentJar":"/var/versa/vnms/web/custom_logo/favicon_brand.png","hookedMethod":"org.apache.catalina.core.ApplicationFilterChain.internalDoFilter"}',
            parsedFields: {
              MemoryImplant: 'VersaMem Java Instrumentation Agent (Javassist Bytecode Hook)',
              HookedTomcatClass: 'org.apache.catalina.core.ApplicationFilterChain.internalDoFilter',
              HostSocketArtifact: '/tmp/.java_pid2418 (JVM Dynamic Attach Unix Domain Socket)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: On-Disk JAR Deletion & Live JVM Heap / Class Dump Forensics',
        narration:
          'After attaching to the Tomcat process, the loader deletes /var/versa/vnms/web/custom_logo/favicon_brand.png from disk so filesystem scans find nothing; DFIR analysts recover the hooked bytecode by dumping loaded classes from the live JVM heap using jmap or HSDB (sa-jdi.jar).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.004 - Indicator Removal: File Deletion)',
        technicalCommands: [
          'jmap -dump:live,format=b,file=/cases/versa_tomcat_heap.hprof $(pgrep -f tomcat)',
          'grep -a "ApplicationFilterChain" /cases/versa_tomcat_heap.hprof',
        ],
        defenseMitigation:
          'Before restarting a suspected Versa Director appliance, capture a full JVM heap dump (jmap -dump:live) and /proc/<pid>/maps snapshot so in-memory Java instrumentation agents are preserved for forensic extraction.',
        logs: [
          {
            id: 'zday-versa-3',
            timestamp: '08:42:24.110',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 263,
            ProcessName: 'java',
            CommandLine: 'unlinkat("/var/versa/vnms/web/custom_logo/favicon_brand.png") while Agent remains resident in JVM PID 2418',
            raw: 'type=SYSCALL msg=audit(1763378544.110:709): arch=c000003e syscall=263 success=yes pid=2418 comm="java" name="/var/versa/vnms/web/custom_logo/favicon_brand.png"',
            parsedFields: {
              AntiForensicAction: 'unlinkat (syscall 263) deleted /var/versa/vnms/web/custom_logo/favicon_brand.png after JVM load',
              MemoryForensicEvidence: 'Modified ApplicationFilterChain bytecode recovered from /cases/versa_tomcat_heap.hprof',
              AttributedThreatActor: 'Volt Typhoon (Bronze Silhouette / Vanguard Panda)',
            },
          },
        ],
      },
    ],
  },
];
