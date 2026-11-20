import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ics-industroyer2-iec-60870-5-104-substation-telemetry',
    title: 'CERT-UA #4435, ESET & CISA ICS — Industroyer2 IEC 60870-5-104 Substation Telecontrol & Protection Relay Forensics',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1489',
    description:
      'Grounded in CERT-UA Advisory #4435, ESET Industroyer2 technical analysis, and CISA ICS guidance: forensic investigators analyze an automated ICS binary communicating over IEC 60870-5-104 (TCP port 2404) with electrical substation RTUs and protection relays using ASDU Type 45 (Single Command) and Type 46 (Double Command) Information Object Addresses (IOAs).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'SCADA HMI Server (108_100.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Substation Gateway (:2404)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Substation RTU & Bay Controller', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'OT Packet Broker & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PServiceControl Legitimate Service', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Legitimate SCADA Service Termination (PServiceControl.exe) Prior to Port 2404 Takeover',
        narration:
          'Before opening its own IEC-104 socket connections, the Industroyer2 executable terminates the legitimate substation telecontrol service (PServiceControl.exe) and renames its binary on disk so the legitimate SCADA master cannot override the rogue commands.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Impact (T1489 - Service Stop)',
        technicalCommands: [
          'taskkill.exe /F /IM PServiceControl.exe',
          'cmd.exe /c move C:\\SCADA\\bin\\PServiceControl.exe C:\\SCADA\\bin\\PServiceControl.exe.bak',
        ],
        defenseMitigation:
          'Enforce Windows AppLocker / WDAC rules on SCADA HMI servers and alert immediately on termination or renaming of operational telecontrol binaries.',
        logs: [
          {
            id: 'ics-ind2-1',
            timestamp: '16:00:01.120',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: '108_100.exe',
            CommandLine: 'taskkill.exe /F /IM PServiceControl.exe',
            raw: 'EventID=1 Image="C:\\Windows\\System32\\taskkill.exe" CommandLine="taskkill.exe /F /IM PServiceControl.exe" ParentImage="C:\\Temp\\108_100.exe"',
            parsedFields: {
              ParentBinary: 'C:\\Temp\\108_100.exe (Industroyer2 Binary)',
              StoppedServiceBinary: 'PServiceControl.exe (Substation SCADA Service)',
              CertUaReference: 'CERT-UA#4435',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: IEC 60870-5-104 STARTDT_ACT Handshake & Interrogation Frame on TCP Port 2404',
        narration:
          'The binary reads its embedded configuration table (containing target RTU IP addresses, Common Address of ASDU, and IOA lists) and sends an IEC-104 U-format STARTDT_ACT (0x68 0x04 0x07 0x00 0x00 0x00) control frame over TCP port 2404 to activate data transfer with each substation RTU.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1071 - Application Layer Protocol / IEC 60870-5-104)',
        technicalCommands: [
          'tshark -r substation.pcap -Y "iec60870_104" -T fields -e ip.src -e ip.dst -e iec60870_104.type -e iec60870_104.utype',
        ],
        defenseMitigation:
          'Deploy IEC 62351 TLS encryption and MAC authentication for IEC 60870-5-104 links, and restrict TCP port 2404 sessions to hardware-bound SCADA master interfaces.',
        logs: [
          {
            id: 'ics-ind2-2',
            timestamp: '16:00:02.450',
            source: 'Network',
            severity: 'high',
            EventCode: 2404,
            ProcessName: '108_100.exe',
            CommandLine: 'IEC 60870-5-104 U-Frame STARTDT_ACT (0x07) -> RTU 10.60.12.10:2404',
            raw: 'zeek_iec104: ts=1763308802.450 orig_h=10.60.1.50 resp_h=10.60.12.10 resp_p=2404 apci_type="U_FORMAT" u_func="STARTDT_ACT" asdu_type=100 cause_tx="ACTIVATION"',
            parsedFields: {
              Protocol: 'IEC 60870-5-104 (TCP 2404)',
              ApciControlFrame: 'STARTDT_ACT (Start Data Transfer Activation)',
              AsduType100: 'C_IC_NA_1 (Interrogation Command)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: ASDU Type 46 (C_DC_NA_1 Double Command) IOA Telecontrol Frame Audit',
        narration:
          'After receiving STARTDT_CON, the binary iterates through its configured Information Object Addresses (IOAs) and transmits ASDU Type 45 (C_SC_NA_1 Single Command) and Type 46 (C_DC_NA_1 Double Command) frames with Cause of Transmission = 6 (Activation) to toggle telecontrol state points.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1565.002 - Transmitted Data Manipulation / IEC-104 Telecontrol)',
        technicalCommands: [
          'tshark -r substation.pcap -Y "iec60870_asdu.typeid == 45 || iec60870_asdu.typeid == 46" -T fields -e iec60870_asdu.ca -e iec60870_asdu.ioa',
        ],
        defenseMitigation:
          'Implement OT protocol anomaly detection that alerts on rapid sequential bursts of ASDU Type 45/46 commands across multiple IOAs without preceding operator Select-Before-Operate (SBO) sequences.',
        logs: [
          {
            id: 'ics-ind2-3',
            timestamp: '16:00:04.890',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 46,
            ProcessName: 'suricata-ics',
            CommandLine: 'IEC-104 ASDU Type 46 (C_DC_NA_1 Double Command) COA=12 IOA=1104COT=6 (Activation)',
            raw: 'zeek_iec104_asdu: orig_h=10.60.1.50 resp_h=10.60.12.10 type_id=46 type_name="C_DC_NA_1" cot=6 common_addr=12 ioa=1104 dco_state="OFF"',
            parsedFields: {
              AsduTypeId: '46 (C_DC_NA_1 - Double Command)',
              CauseOfTransmission: '6 (Activation)',
              InformationObjectAddress: 'COA=12, IOA=1104',
            },
          },
        ],
      },
    ],
  };
