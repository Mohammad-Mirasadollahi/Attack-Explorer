import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a saboteur sneaking onto a power plant floor with a Swiss-army toolbox built for three different factory machines. First, they walk the control hallway scanning every dial plate to catalog each machine model. Next, they slide a forged maintenance cartridge into the main assembly controller to rewrite its operating instructions, and finally they twist the raw manual pressure valves directly on the pipe manifold while floor monitors log every unauthorized turn.',
      storyMappings: [
        {
          storyTerm: 'Swiss-Army Factory Toolbox',
          technicalTerm: 'Modular ICS Framework · PIPEDREAM / INCONTROLLER (TAGRUN, CODECALL, OMWORM)',
          tone: 'rose',
        },
        {
          storyTerm: 'Control Hallway Dial Scan',
          technicalTerm: 'OPC-UA (TCP/4840), EtherNet/IP (44818) & Modbus Device ID (0x2B)',
          tone: 'amber',
        },
        {
          storyTerm: 'Forged Maintenance Cartridge',
          technicalTerm: 'CODESYS v2/v3 Runtime Toolkit (TCP/1217 & 2455) Logic Upload',
          tone: 'rose',
        },
        {
          storyTerm: 'Floor Monitors Logging Turns',
          technicalTerm: 'CISA ICS-NPP Zeek Parsers (modbus.log, opcua.log) & OT Sensor',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Starting from a hijacked supervisor console on the plant floor, the saboteur pulls out the scouting gauge from the Swiss-army toolbox and walks past every controller rack, knocking on each inspection window so the machines proudly announce their make, model, and firmware badge.',
        storyMappings: [
          {
            storyTerm: 'Hijacked Supervisor Console',
            technicalTerm: 'Compromised Level 2/3 OT Engineering Workstation',
            tone: 'amber',
          },
          {
            storyTerm: 'Scouting Gauge Tool',
            technicalTerm: 'TAGRUN Discovery Module (OPC-UA / ENIP / Modbus Scanner)',
            tone: 'rose',
          },
          {
            storyTerm: 'Knocking on Inspection Windows',
            technicalTerm: 'OPC-UA OpenSecureChannel (TCP/4840) & ENIP ListIdentity (44818)',
            tone: 'sky',
          },
          {
            storyTerm: 'Machine Model & Firmware Badge',
            technicalTerm: 'Modbus MEI Read Device Identification (Function 0x2B / Type 0x0E)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Knowing the exact controller models on the line, the saboteur switches to the forged maintenance cartridge from the same toolbox, bypasses the technician padlock on the controller cabinet, and tries to load rewritten operating instructions straight onto the factory brain.',
        storyMappings: [
          {
            storyTerm: 'Forged Maintenance Cartridge',
            technicalTerm: 'CODECALL Module Targeting CODESYS Runtime (TCP/1217 & 2455)',
            tone: 'rose',
          },
          {
            storyTerm: 'Controller Cabinet',
            technicalTerm: 'Industrial PLC Running CODESYS Control Runtime Toolkit',
            tone: 'sky',
          },
          {
            storyTerm: 'Technician Padlock Bypass',
            technicalTerm: 'Layer 4 Block Driver Frame Enumeration (ServiceGroup 0x0002)',
            tone: 'amber',
          },
          {
            storyTerm: 'Rewritten Operating Instructions',
            technicalTerm: 'Unauthorized IEC 61131-3 Control Logic Upload Attempt',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'For machines on the raw pipe manifold that lack a safety lock, the saboteur grabs the heavy wrench from the toolbox and cranks the physical pressure dials past their safe markings, unaware that passive hallway cameras are recording every non-operator hand touching the valves.',
        storyMappings: [
          {
            storyTerm: 'Raw Pipe Manifold',
            technicalTerm: 'Unauthenticated Modbus TCP Service (TCP Port 502)',
            tone: 'sky',
          },
          {
            storyTerm: 'Cranking Pressure Dials',
            technicalTerm: 'Modbus Function Code 0x06 (Write Single) & 0x10 (Write Multiple)',
            tone: 'rose',
          },
          {
            storyTerm: 'Safe Pressure Markings',
            technicalTerm: 'PLC Holding Registers Controlling Physical Actuator Setpoints',
            tone: 'amber',
          },
          {
            storyTerm: 'Passive Hallway Cameras',
            technicalTerm: 'Zeek ICS-NPP modbus.log & Physical PLC Mode Switch Verification',
            tone: 'emerald',
          },
        ],
      },
    },
  };
