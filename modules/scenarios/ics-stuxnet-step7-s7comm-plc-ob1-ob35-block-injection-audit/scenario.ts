import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
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
  };
