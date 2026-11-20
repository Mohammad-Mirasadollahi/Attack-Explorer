import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ics-trisis-triton-schneider-triconex-sis-telemetry',
    title: 'CISA ICS-ALERT-17-356-01, Mandiant & Dragos — TRISIS / TRITON Safety Instrumented System (SIS) TriStation Protocol Forensics',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1542',
    description:
      'Grounded in CISA ICS-ALERT-17-356-01, Mandiant TRITON analysis, and Dragos TRISIS documentation: OT forensic specialists analyze a masqueraded Python/Py2EXE binary (trilog.exe) on a Safety Instrumented System (SIS) engineering workstation communicating over the UDP port 1502 TriStation protocol with Schneider Electric Triconex safety controllers.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'SIS Engineering WS (trilog.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'UDP 1502 TriStation Link', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Triconex SIS Controller (MPC860)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'OT Network Tap & Host EDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Physical Keyswitch (PROGRAM Mode)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Masqueraded Py2EXE Binary (trilog.exe) & Library.zip Extraction on SIS Workstation',
        narration:
          'On the Safety Instrumented System engineering workstation, an unauthorized executable named trilog.exe (compiled with Py2EXE and bundling TS_cnames.py, TsHi.py, TsLow.py, and TsBase.py inside library.zip) is launched to impersonate legitimate Triconex TriStation 1131 diagnostic utilities.',
        activeNodes: ['attacker', 'siem'],
        mitreTactic: 'Defense Evasion (T1036.005 - Masquerading: Match Legitimate Name or Location)',
        technicalCommands: [
          'sigcheck.exe -u -e C:\\Triconex\\Tristation\\trilog.exe',
          'unzip -l C:\\Triconex\\Tristation\\library.zip | grep -E "TsHi|TsLow|TsBase"',
        ],
        defenseMitigation:
          'Isolate Safety Instrumented System (SIS) engineering workstations completely from the Distributed Control System (DCS) and corporate networks, and verify digital signatures on all binaries in C:\\Triconex\\.',
        logs: [
          {
            id: 'ics-triton-1',
            timestamp: '14:20:10.050',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'trilog.exe',
            CommandLine: 'C:\\Triconex\\Tristation\\trilog.exe 10.70.5.10',
            raw: 'EventID=1 Image="C:\\Triconex\\Tristation\\trilog.exe" CommandLine="trilog.exe 10.70.5.10" Signed="false" Description="Py2EXE Bundled TriStation Client"',
            parsedFields: {
              MasqueradedBinary: 'C:\\Triconex\\Tristation\\trilog.exe (Unsigned Py2EXE)',
              BundledPythonModules: 'TsHi.py, TsLow.py, TsBase.py, TS_cnames.py',
              TargetControllerIp: '10.70.5.10',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: TriStation Protocol UDP 1502 Ping & Controller Program Mode Status Check',
        narration:
          'The TsLow.py module transmits a UDP port 1502 TriStation connect/ping packet to the Triconex controller and queries the front-panel keyswitch state, verifying whether the physical keyswitch is left in PROGRAM mode (which permits memory/program modifications).',
        activeNodes: ['attacker', 'firewall', 'target', 'ad'],
        mitreTactic: 'Discovery (T1082 - System Information Discovery / SIS Keyswitch Status)',
        technicalCommands: [
          'tshark -r sis-network.pcap -Y "udp.port == 1502" -T fields -e ip.src -e ip.dst -e data.data',
        ],
        defenseMitigation:
          'Keep Triconex SIS hardware keyswitches locked in RUN mode at all times except during physically supervised maintenance, and monitor hardware keyswitch state telemetry independently.',
        logs: [
          {
            id: 'ics-triton-2',
            timestamp: '14:20:11.320',
            source: 'Network',
            severity: 'high',
            EventCode: 1502,
            ProcessName: 'trilog.exe',
            CommandLine: 'TriStation UDP/1502 Function=GetCpStatus KeyswitchState=PROGRAM',
            raw: 'ot_tristation_log: src=10.70.1.15 dst=10.70.5.10 proto=UDP dst_port=1502 cmd_code=0x06 status="Keyswitch=PROGRAM_MODE"',
            parsedFields: {
              Protocol: 'Triconex TriStation (UDP 1502)',
              CommandCode: 'GetCpStatus (Controller Status Query)',
              KeyswitchPosition: 'PROGRAM Mode (Remote Write Permitted)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: TriStation Program Allocation & Triple-Modular Redundant (TMR) Validation Check',
        narration:
          'When an unauthorized program table modification (inject.bin / imain.bin) is transmitted over UDP 1502, the Triconex Triple-Modular Redundant (TMR) processors compare memory state across the three independent main processor legs and log a diagnostic fault if a validation mismatch occurs.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1542 - Pre-OS Boot / Controller Firmware & Logic Modification)',
        technicalCommands: [
          'snort -c /etc/snort/tristation-cisa-17-356.rules -r sis-network.pcap',
        ],
        defenseMitigation:
          'Deploy CISA ICS-ALERT-17-356-01 Snort/Suricata signatures on all network segments carrying UDP 1502 traffic to detect unauthorized TriStation function codes and MPC860 memory writes.',
        logs: [
          {
            id: 'ics-triton-3',
            timestamp: '14:20:15.804',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 35601,
            ProcessName: 'suricata-ics',
            CommandLine: 'ALERT CISA-ICS-17-356-01 TriStation Unauthorized Function Table Write on UDP 1502',
            raw: 'suricata_ics: alert="ET SCADA TRISIS/TRITON TriStation Memory Write Attempt" src=10.70.1.15 dst=10.70.5.10 proto=UDP dport=1502 sid=2025145',
            parsedFields: {
              AlertSignature: 'CISA ICS-ALERT-17-356-01 (TRISIS / TRITON TriStation Write)',
              TargetArchitecture: 'MPC860 PowerPC Triple-Modular Redundant (TMR)',
              TelemetrySource: 'Passive OT Span Port Sensor',
            },
          },
        ],
      },
    ],
  };
