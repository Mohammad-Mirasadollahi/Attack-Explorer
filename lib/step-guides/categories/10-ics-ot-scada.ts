import type { CategoryStandardPatchMap } from './types';

export const ICS_OT_SCADA_PATCHES: CategoryStandardPatchMap = {
  'ics-pipedream-incontroller-codesys-modbus-opcua': {
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
  },

  'ics-industroyer2-iec-60870-5-104-substation-telemetry': {
    briefing: {
      storyAnalogy:
        'Imagine a rogue dispatcher breaking into a regional electrical substation control booth during a night shift. First, they lock the legitimate chief operator out of the radio room and hide the official control handset so nobody can override their orders. Next, they open a direct dedicated hotline to every high-voltage breaker cabinet along the grid and flip the heavy circuit switches off one by one from a prewritten target list.',
      storyMappings: [
        {
          storyTerm: 'Rogue Night-Shift Dispatcher',
          technicalTerm: 'Industroyer2 Automated ICS Executable (108_100.exe)',
          tone: 'rose',
        },
        {
          storyTerm: 'Locking Out Chief Operator',
          technicalTerm: 'Terminating & Renaming PServiceControl.exe SCADA Master',
          tone: 'amber',
        },
        {
          storyTerm: 'Direct Substation Hotline',
          technicalTerm: 'IEC 60870-5-104 Telecontrol Link over TCP Port 2404 (STARTDT_ACT)',
          tone: 'sky',
        },
        {
          storyTerm: 'Flipping High-Voltage Breakers',
          technicalTerm: 'ASDU Type 45 (Single) & Type 46 (Double Command) IOA Frames',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Stepping inside the substation control booth, the rogue dispatcher first shuts down the legitimate chief operator’s console and moves their official radio handset out of reach so the real control desk cannot fight back once the breaker orders begin.',
        storyMappings: [
          {
            storyTerm: 'Substation Control Booth',
            technicalTerm: 'Windows SCADA Control Server Hosting Telecontrol Service',
            tone: 'sky',
          },
          {
            storyTerm: 'Legitimate Chief Operator Console',
            technicalTerm: 'PServiceControl.exe Substation Telecontrol Master Process',
            tone: 'amber',
          },
          {
            storyTerm: 'Moving Radio Handset Out of Reach',
            technicalTerm: 'Process Termination & On-Disk Binary Rename (T1489)',
            tone: 'rose',
          },
          {
            storyTerm: 'Control Room Audit Log',
            technicalTerm: 'Sysmon Event ID 1 / Process Termination & File Rename Telemetry',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Reading from a laminated card of substation phone numbers tucked in their pocket, the rogue dispatcher dials each remote breaker cabinet over the dedicated utility line and sends the official wake-up chime that puts every relay on standby for live commands.',
        storyMappings: [
          {
            storyTerm: 'Laminated Card of Numbers',
            technicalTerm: 'Hardcoded Configuration Table (RTU IPs, Common Address & IOA List)',
            tone: 'amber',
          },
          {
            storyTerm: 'Dedicated Utility Hotline',
            technicalTerm: 'IEC 60870-5-104 Protocol Connection on TCP Port 2404',
            tone: 'sky',
          },
          {
            storyTerm: 'Official Wake-Up Chime',
            technicalTerm: 'U-Format STARTDT_ACT Control Frame (0x68 0x04 0x07 0x00 0x00 0x00)',
            tone: 'rose',
          },
          {
            storyTerm: 'Relay Standby Confirmation',
            technicalTerm: 'RTU STARTDT_CON Reply Monitored by Passive OT Sensors',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As soon as the remote cabinets chime back ready, the rogue dispatcher marches straight down the laminated list, throwing switch after switch to trip the high-voltage breakers open and darken the substation feeders.',
        storyMappings: [
          {
            storyTerm: 'Marching Down Laminated List',
            technicalTerm: 'Iterating Configured Information Object Addresses (IOAs)',
            tone: 'amber',
          },
          {
            storyTerm: 'Throwing High-Voltage Switches',
            technicalTerm: 'ASDU Type 45 (C_SC_NA_1) & Type 46 (C_DC_NA_1) Double Command',
            tone: 'rose',
          },
          {
            storyTerm: 'Immediate Action Order',
            technicalTerm: 'Cause of Transmission = 6 (Activation) Telecontrol Flag',
            tone: 'sky',
          },
          {
            storyTerm: 'Substation Wire Inspection',
            technicalTerm: 'Zeek / Suricata IEC-104 ASDU Type 46 Anomaly Detection',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'ics-trisis-triton-schneider-triconex-sis-telemetry': {
    briefing: {
      storyAnalogy:
        'Imagine a chemical plant protected by an independent emergency fire-suppression brain that trips a safe shutdown whenever pressure climbs too high. An intruder slips onto the safety engineer’s desk wearing a forged inspector jacket, checks whether the physical brass maintenance key was accidentally left turned to the unlock position, and tries to rewrite the emergency shutdown brain, only for three twin safety judges working in lockstep to spot a disagreement and sound a hardware fault alarm.',
      storyMappings: [
        {
          storyTerm: 'Forged Inspector Jacket',
          technicalTerm: 'Masqueraded Py2EXE Binary (trilog.exe) Bundling TriStation Scripts',
          tone: 'rose',
        },
        {
          storyTerm: 'Brass Maintenance Key Unlocked',
          technicalTerm: 'Triconex Front-Panel Physical Keyswitch Left in PROGRAM Mode',
          tone: 'amber',
        },
        {
          storyTerm: 'Emergency Fire-Suppression Brain',
          technicalTerm: 'Schneider Electric Triconex Safety Instrumented System (UDP/1502)',
          tone: 'sky',
        },
        {
          storyTerm: 'Three Twin Safety Judges',
          technicalTerm: 'Triple-Modular Redundant (TMR) Processor Voting & Fault Alarm',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the safety engineer’s workbench, the intruder unpacks a counterfeit diagnostic clipboard bearing the same logo as the factory safety tool, concealing four custom helper blueprints stitched neatly inside its backing folder.',
        storyMappings: [
          {
            storyTerm: 'Safety Engineer Workbench',
            technicalTerm: 'Safety Instrumented System (SIS) Engineering Workstation',
            tone: 'sky',
          },
          {
            storyTerm: 'Counterfeit Diagnostic Clipboard',
            technicalTerm: 'Py2EXE-Compiled trilog.exe Impersonating TriStation 1131 Utility',
            tone: 'rose',
          },
          {
            storyTerm: 'Four Custom Helper Blueprints',
            technicalTerm: 'library.zip Modules (TS_cnames.py, TsHi.py, TsLow.py, TsBase.py)',
            tone: 'amber',
          },
          {
            storyTerm: 'Workbench Integrity Check',
            technicalTerm: 'Sysmon Event ID 1 / Unsigned Py2EXE Binary Execution Alert',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using the counterfeit clipboard, the intruder sends a polite test tap down the safety cabinet intercom and inspects the cabinet’s front-panel status light, confirming that a maintenance crew accidentally left the brass safety key turned to the unlocked rewrite setting.',
        storyMappings: [
          {
            storyTerm: 'Polite Test Tap on Intercom',
            technicalTerm: 'TsLow.py TriStation Connect/Ping Frame on UDP Port 1502',
            tone: 'rose',
          },
          {
            storyTerm: 'Front-Panel Status Light',
            technicalTerm: 'Triconex Controller Mode Status Query Response',
            tone: 'sky',
          },
          {
            storyTerm: 'Brass Key in Unlocked Setting',
            technicalTerm: 'Physical Keyswitch Position = PROGRAM (Permits Logic Writes)',
            tone: 'amber',
          },
          {
            storyTerm: 'Safety Network Monitor',
            technicalTerm: 'OT Passive IDS Detecting Non-Standard UDP/1502 TriStation Traffic',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Seeing the cabinet unlocked, the intruder slides custom replacement rules into the emergency brain’s memory slots, but the three twin safety judges constantly vote on every instruction and instantly slam the plant into a safe-state diagnostic fault the moment their memory ledgers diverge.',
        storyMappings: [
          {
            storyTerm: 'Custom Replacement Rules',
            technicalTerm: 'Unauthorized Program Table Payloads (inject.bin & imain.bin)',
            tone: 'rose',
          },
          {
            storyTerm: 'Emergency Brain Memory Slots',
            technicalTerm: 'Triconex Controller Program Memory Allocation over UDP/1502',
            tone: 'sky',
          },
          {
            storyTerm: 'Three Twin Safety Judges Voting',
            technicalTerm: 'Triple-Modular Redundant (TMR) 3-Leg Memory Consistency Check',
            tone: 'amber',
          },
          {
            storyTerm: 'Safe-State Diagnostic Fault',
            technicalTerm: 'Triconex Safe-State Halt & Hardware Validation Mismatch Log',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'ics-frostygoop-modbus-tcp-district-heating-controller-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a city district-heating boiler house whose basement thermostat panel was accidentally wired to an unlocked public intercom outside on the street. In the dead of winter, an outside caller rings the intercom to ask which boiler model is running, reads every water-temperature gauge across the apartment blocks, and then dials false temperature calibration numbers directly into the panel so the heaters shut down during freezing weather.',
      storyMappings: [
        {
          storyTerm: 'Unlocked Street Intercom',
          technicalTerm: 'Internet-Exposed Modbus TCP Service (Port 502, No Auth)',
          tone: 'amber',
        },
        {
          storyTerm: 'Outside Winter Caller',
          technicalTerm: 'FrostyGoop Golang Client Operated from External IP 198.51.100.84',
          tone: 'rose',
        },
        {
          storyTerm: 'Boiler Thermostat Panel',
          technicalTerm: 'ENCO Industrial District Heating Controller (10.60.12.40)',
          tone: 'sky',
        },
        {
          storyTerm: 'Dialing False Temperature Calibration',
          technicalTerm: 'Modbus Write Single (0x06) & Write Multiple Registers (0x10)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the unlocked street intercom, the outside caller presses the doorbell and asks the boiler panel to read back its manufacturer nameplate and firmware sticker so they know the exact dial layout inside.',
        storyMappings: [
          {
            storyTerm: 'Pressing Unlocked Doorbell',
            technicalTerm: 'Unauthenticated TCP Handshake on Port 502 to 10.60.12.40',
            tone: 'amber',
          },
          {
            storyTerm: 'Requesting Manufacturer Nameplate',
            technicalTerm: 'Modbus Encapsulated Interface Read Device ID (0x2B / MEI Type 14)',
            tone: 'rose',
          },
          {
            storyTerm: 'Boiler Panel Identity',
            technicalTerm: 'ENCO Industrial Heating Controller Vendor & Firmware Strings',
            tone: 'sky',
          },
          {
            storyTerm: 'Boiler Room Intercom Log',
            technicalTerm: 'Zeek ICS Modbus Telemetry Capturing External Port 502 Inquiry',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Guided by a prewritten checklist of room numbers, the caller sweeps down the entire bank of boiler gauges one row after another, copying every valve position, water-temperature readout, and pressure limit back to their notebook.',
        storyMappings: [
          {
            storyTerm: 'Prewritten Checklist of Rooms',
            technicalTerm: 'FrostyGoop JSON Tasking File Driving Automated Polling',
            tone: 'amber',
          },
          {
            storyTerm: 'Sweeping Bank of Boiler Gauges',
            technicalTerm: 'Sequential Modbus Function Code 0x03 (Read Holding Registers)',
            tone: 'rose',
          },
          {
            storyTerm: 'Valve & Temperature Readouts',
            technicalTerm: 'Holding Registers 40001 to 40132 (Heating Loop Setpoints)',
            tone: 'sky',
          },
          {
            storyTerm: 'Non-Operator Polling Alarm',
            technicalTerm: 'Passive OT Sensor Alerting on Non-HMI Source IP 198.51.100.84',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With the boiler layout mapped out, the caller sends rapid overwrite commands over the intercom to twist the thermal calibration screws and valve actuators off target, forcing city engineers to pull their offline paper schematics and inspect the live gauges.',
        storyMappings: [
          {
            storyTerm: 'Twisting Calibration Screws',
            technicalTerm: 'Modbus Function Code 0x06 (Write Single) & 0x10 (Write Multiple)',
            tone: 'rose',
          },
          {
            storyTerm: 'Valve & Thermal Targets',
            technicalTerm: 'Holding Registers 40101 to 40108 (Actuator & Thermal Offset)',
            tone: 'sky',
          },
          {
            storyTerm: 'Perimeter Alarm Bell',
            technicalTerm: 'Suricata & Zeek Alert for External Subnet Modbus Write (0x10)',
            tone: 'emerald',
          },
          {
            storyTerm: 'Offline Paper Schematics',
            technicalTerm: 'Golden Offline Engineering Register Backup Verification',
            tone: 'amber',
          },
        ],
      },
    },
  },

  'ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a precision centrifuge hall where engineers program high-speed spinning controllers through a single glass translation booth. An intruder secretly replaces the official glass translator with a double-agent imposter who passes routine messages along cleanly, slips hidden speed-tampering instructions down the cable into the spinning controllers, and then lies back through the glass whenever engineers inspect the machines, until an independent auditor taps the raw copper cable and catches the size mismatch.',
      storyMappings: [
        {
          storyTerm: 'Double-Agent Glass Translator',
          technicalTerm: 'Unsigned Wrapper DLL C:\\Windows\\System32\\s7otbxdx.dll',
          tone: 'rose',
        },
        {
          storyTerm: 'Original Official Translator',
          technicalTerm: 'Legitimate Siemens Library Renamed to s7otbxsx.dll',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden Speed-Tampering Instructions',
          technicalTerm: 'S7comm Port 102 Download (0x1A/0x1B) of OB1, OB35 & FC1865..FC1874',
          tone: 'amber',
        },
        {
          storyTerm: 'Tapping the Raw Copper Cable',
          technicalTerm: 'Zeek S7comm Upload Block (0x1D) Wire Size vs STEP 7 GUI Audit',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inside the engineering booth, the intruder moves the real factory translator into a side closet under a slightly different name badge and puts an unsigned double-agent imposter at the front window so every routine button press passes through the imposter first.',
        storyMappings: [
          {
            storyTerm: 'Engineering Control Booth',
            technicalTerm: 'SIMATIC Manager Engineering Workstation (s7tgtopx.exe)',
            tone: 'sky',
          },
          {
            storyTerm: 'Real Translator Moved to Closet',
            technicalTerm: 'Legitimate s7otbxdx.dll Renamed to s7otbxsx.dll on Disk',
            tone: 'amber',
          },
          {
            storyTerm: 'Unsigned Double-Agent Imposter',
            technicalTerm: 'Malicious s7otbxdx.dll Wrapper Exporting All 109 s7ag_* APIs',
            tone: 'rose',
          },
          {
            storyTerm: 'Booth Security Sensor',
            technicalTerm: 'Sysmon Event ID 7 (ImageLoad) & WDAC Unsigned DLL Policy',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once the double-agent translator confirms the exact centrifuge drive model wired down the hall, it piggybacks on the official cable to download hidden main-loop and timed-interrupt instructions straight into the controller’s memory.',
        storyMappings: [
          {
            storyTerm: 'Confirming Centrifuge Drive Model',
            technicalTerm: 'Inspecting System Data Blocks (SDBs) for Profibus 7050h / 9500h',
            tone: 'amber',
          },
          {
            storyTerm: 'Official Hallway Cable',
            technicalTerm: 'Siemens S7comm Protocol over ISO-on-TCP (RFC 1006 Port 102)',
            tone: 'sky',
          },
          {
            storyTerm: 'Downloading Hidden Loop Rules',
            technicalTerm: 'S7comm Function 0x1A (Request Download) & 0x1B (Download Block)',
            tone: 'rose',
          },
          {
            storyTerm: 'Modified Controller Memory',
            technicalTerm: 'Injected OB1 Main Sweep, OB35 100ms Interrupt & FC1865..FC1874',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'When a suspicious engineer opens the console to compare the live controller against the clean master blueprint, the double-agent translator intercepts the readback and holds up a fake photocopy showing normal code, until a clean auditor taps the wire directly and spots that the real packet traveling over the cable is seven times larger than what the screen claims.',
        storyMappings: [
          {
            storyTerm: 'Holding Up a Fake Photocopy',
            technicalTerm: 's7otbxdx.dll!s7ag_bub_read_var_seg Filtering Hidden FC Blocks',
            tone: 'rose',
          },
          {
            storyTerm: 'Engineer Inspection Screen',
            technicalTerm: 'SIMATIC STEP 7 GUI Displaying Spoofed 412-Byte OB1 Block',
            tone: 'amber',
          },
          {
            storyTerm: 'Tapping the Raw Cable Directly',
            technicalTerm: 'Network Capture of S7comm Function 0x1D (Upload Block = 2,940 B)',
            tone: 'sky',
          },
          {
            storyTerm: 'Clean Master Blueprint Restore',
            technicalTerm: 'Air-Gapped Verification Laptop & Golden PLC Memory Card Restore',
            tone: 'emerald',
          },
        ],
      },
    },
  },
};
