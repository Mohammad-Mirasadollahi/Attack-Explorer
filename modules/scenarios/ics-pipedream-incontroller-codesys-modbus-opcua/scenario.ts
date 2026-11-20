import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'ics-pipedream-incontroller-codesys-modbus-opcua',
    title: 'CISA AA22-103A, Dragos PIPEDREAM & Mandiant INCONTROLLER — Industrial PLC CODESYS & Modbus/OPC-UA Protocol Forensics',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1046',
    description:
      'Grounded in Joint Cybersecurity Advisory AA22-103A (CISA, NSA, FBI, DOE), Dragos PIPEDREAM analysis, and Mandiant INCONTROLLER research: OT security analysts investigate modular ICS frameworks (TAGRUN, CODECALL, OMWORM) interacting with industrial Programmable Logic Controllers (PLCs) over OPC-UA (TCP 4840), Modbus TCP (TCP 502), and CODESYS Gateway protocols.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Engineering WS', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Purdue Level 3/2 OT Firewall', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Schneider / Omron PLC (Level 1)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Zeek ICS & Nozomi/Dragos NDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'OPC-UA Server & Historian', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Industrial Asset Discovery via OPC-UA (Port 4840) & ENIP/Modbus Enumeration (TAGRUN)',
        narration:
          'From a compromised Level 2/3 Engineering Workstation, the TAGRUN module enumerates OPC-UA servers on TCP port 4840 (OpenSecureChannel / CreateSession / Browse) and scans industrial subnets on UDP/TCP 44818 (EtherNet/IP ListIdentity) and TCP 502 (Modbus Device ID 0x2B/0x0E) to inventory PLC models and firmware versions.',
        activeNodes: ['attacker', 'firewall', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery / ICS Asset Enumeration)',
        technicalCommands: [
          'zeek -C -r ot-capture.pcap icsnpp-opcua-binary icsnpp-modbus',
          'python3 tagrun_discovery.py --opcua-endpoint opc.tcp://10.50.10.20:4840 --browse-nodes',
        ],
        defenseMitigation:
          'Enforce Purdue Model network segmentation between IT (Level 4), DMZ (Level 3.5), and OT Control Zones (Levels 1-2), and require mutual X.509 certificate authentication on OPC-UA endpoints.',
        logs: [
          {
            id: 'ics-pipe-1',
            timestamp: '12:05:10.115',
            source: 'Network',
            severity: 'high',
            EventCode: 4840,
            ProcessName: 'python3.exe',
            CommandLine: 'python3 tagrun_discovery.py --opcua-endpoint opc.tcp://10.50.10.20:4840 --browse-nodes',
            raw: 'zeek_opcua_binary: ts=1763294710.115 orig_h=10.50.30.12 resp_h=10.50.10.20 resp_p=4840 msg_type="OPN" service="GetEndpointsRequest" security_mode="None"',
            parsedFields: {
              IndustrialProtocol: 'OPC-UA Binary (TCP 4840)',
              ServiceInvoked: 'GetEndpointsRequest / BrowseRequest',
              AdvisoryReference: 'CISA AA22-103A (APT Tools Targeting ICS/SCADA)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CODESYS v2/v3 Runtime Authentication Bypass & Logic Upload Inspection (CODECALL)',
        narration:
          'The CODECALL module targets the CODESYS Runtime Toolkit on TCP port 1217/2455, crafting Layer 4 block driver frames to enumerate PLC device parameters and attempt unauthorized IEC 61131-3 control logic transfers.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021 - Remote Services / CODESYS Gateway Protocol)',
        technicalCommands: [
          'suricata -c /etc/suricata/suricata.yaml -r ot-substation.pcap',
          'zeek-cut id.orig_h id.resp_h function pdu_type < codesys.log',
        ],
        defenseMitigation:
          'Enable mandatory user management and X.509 signed project downloads in CODESYS Runtime v3.5+, and alert on any PLC program download or stop command outside scheduled maintenance windows.',
        logs: [
          {
            id: 'ics-pipe-2',
            timestamp: '12:05:44.820',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 2455,
            ProcessName: 'codesys_client',
            CommandLine: 'CODESYS Gateway TCP/2455 ServiceGroup=0x0002 (CmpApp) SubCommand=Login/DownloadApplication',
            raw: 'ot_ndr_alert: signature="CISA-AA22-103A CODECALL CODESYS Runtime Command" src=10.50.30.12 dst=10.50.10.45 dst_port=2455 service_group=0x0002',
            parsedFields: {
              TargetPlcRuntime: 'CODESYS Control Runtime (TCP 2455)',
              ServiceGroup: '0x0002 (CmpApp Application Manager)',
              NdrSignature: 'CISA-AA22-103A CODECALL Activity',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Direct Modbus TCP Register Write (Function Code 06/16) & Physical Switch Verification',
        narration:
          'At the Modbus TCP layer (port 502), unauthorized Function Code 06 (Write Single Register) or Function Code 16 (Write Multiple Registers) PDUs modify holding registers controlling actuator setpoints, which CISA ICS-NPP Zeek parsers log in modbus.log.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1565.002 - Data Manipulation: Transmitted Data / PLC Register Write)',
        technicalCommands: [
          'zeek -C -r modbus-traffic.pcap icsnpp-modbus',
          'jq \'select(.func=="WRITE_SINGLE_REGISTER" or .func=="WRITE_MULTIPLE_REGISTERS")\' modbus.log',
        ],
        defenseMitigation:
          'Place physical PLC keyswitches in RUN (hard-locked) mode rather than REMOTE/PROGRAM mode so remote network commands cannot overwrite ladder logic, and deploy CISA ICSNPP-Modbus deep packet inspection.',
        logs: [
          {
            id: 'ics-pipe-3',
            timestamp: '12:06:12.004',
            source: 'Network',
            severity: 'critical',
            EventCode: 502,
            ProcessName: 'zeek-icsnpp',
            CommandLine: 'Modbus TCP UnitID=1 FunctionCode=16 (Write Multiple Holding Registers) Address=40001',
            raw: 'zeek_modbus: ts=1763294772.004 uid=Cmod91 orig_h=10.50.30.12 resp_h=10.50.10.45 resp_p=502 unit_id=1 func="WRITE_MULTIPLE_REGISTERS" address=40001 quantity=4',
            parsedFields: {
              Protocol: 'Modbus TCP (Port 502 · CISA ICSNPP-Modbus)',
              ModbusFunction: 'Function Code 16 (0x10 - Write Multiple Registers)',
              TargetRegisterRange: 'Holding Registers 40001 - 40004',
            },
          },
        ],
      },
    ],
  };
