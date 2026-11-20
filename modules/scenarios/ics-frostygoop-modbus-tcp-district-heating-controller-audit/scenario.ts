import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
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
  };
