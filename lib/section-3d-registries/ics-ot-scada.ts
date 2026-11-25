import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for ICS_OT_SCADA (5 scenarios).
 */
export const ICS_OT_SCADA_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "ics-frostygoop-modbus-tcp-district-heating-controller-audit": {
    "briefing": {
      "scenarioId": "ics-frostygoop-modbus-tcp-district-heating-controller-audit",
      "sectionKey": "briefing",
      "sceneKind": "ics-frostygoop-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Industrial ENCO Controller Modbus TCP Port 502 Register Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a city district-heating boiler house whose basement thermostat panel was accidentally wired to an unlocked public intercom outside on the street. In the dead of winter, an outside caller rings the intercom to ask which boiler model is running, reads every water-temperature gauge across the apartment blocks, and then dials false temperature calibration numbers directly into the panel so the heaters shut down during freezing weather.",
      "technicalCue": "INITIAL ACCESS: External Modbus TCP Port 502 Session & Device Identification (FC 43 / MEI) -> EXFIL & IMPACT: Bulk Holding Register Enumeration via Function Code 0x03 -> EXFIL & IMPACT: Holding Register Overwrite via Function Codes 0x06 & 0x10 and Firmware Inspection",
      "storyMappings": [
        {
          "storyTerm": "Unlocked Street Intercom",
          "technicalTerm": "Internet-Exposed Modbus TCP Service (Port 502, No Auth)",
          "tone": "amber"
        },
        {
          "storyTerm": "Outside Winter Caller",
          "technicalTerm": "FrostyGoop Golang Client Operated from External IP 198.51.100.84",
          "tone": "rose"
        },
        {
          "storyTerm": "Boiler Thermostat Panel",
          "technicalTerm": "ENCO Industrial District Heating Controller (10.60.12.40)",
          "tone": "sky"
        },
        {
          "storyTerm": "Dialing False Temperature Calibration",
          "technicalTerm": "Modbus Write Single (0x06) & Write Multiple Registers (0x10)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F97316",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ics-frostygoop-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unlocked Street Intercom",
          "subtitle": "Internet-Exposed Modbus TCP Service (Port 502, No Auth)",
          "tone": "amber"
        },
        {
          "id": "ics-frostygoop-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Outside Winter Caller",
          "subtitle": "FrostyGoop Golang Client Operated from External IP 198.51.100.84",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Asks",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "External Modbus TCP Port 502 Session & Device Identification (FC 43 / MEI)",
          "storyExcerpt": "Walking up to the unlocked street intercom, the outside caller presses the doorbell and asks the boiler panel to read back its manufacturer nameplate and firmware sticker so they know the exact dial…",
          "technicalParallel": "Under the hood, the observed step executes zeek-cut id.orig_h id.resp_h func < modbus.log | sort | uniq -c (which executes the technical command / telemetry directive , zeek-cut id.orig_h id.resp_h func…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Room Down",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Bulk Holding Register Enumeration via Function Code 0x03",
          "storyExcerpt": "Guided by a prewritten checklist of room numbers, the caller sweeps down the entire bank of boiler gauges one row after another, copying every valve position, water-temperature readout, and pressure…",
          "technicalParallel": "Under the hood, the observed step executes awk '$7 == \"READ_HOLDING_REGISTERS\" {print $1, $3, $5, $8, $9}' /opt/zeek/logs/current/modbus_detailed.log (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Out Over",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Holding Register Overwrite via Function Codes 0x06 & 0x10 and Firmware Inspection",
          "storyExcerpt": "With the boiler layout mapped out, the caller sends rapid overwrite commands over the intercom to twist the thermal calibration screws and valve actuators off target, forcing city engineers to pull their…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r ot_substation_capture.pcap -Y \"modbus.func_code == 6 || modbus.func_code == 16\" -T fields -e frame.time -e ip.src -e modbus.reference_num -e…",
          "accentHex": "#F97316",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boiler Panel",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Street Intercom",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "False Dial",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ics-frostygoop-modbus-tcp-district-heating-controller-audit",
      "sectionKey": "step-1",
      "sceneKind": "ics-frostygoop-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "External Modbus TCP Port 502 Session & Device Identification (FC 43 / MEI)",
      "storyCue": "Walking up to the unlocked street intercom, the outside caller presses the doorbell and asks the boiler panel to read back its manufacturer nameplate and firmware sticker so they know the exact dial layout inside.",
      "technicalCue": "T1190 · INITIAL ACCESS — OT network sensors record an unauthenticated TCP handshake on port 502 reaching an internet-accessible municipal heating controller, followed by Modbus Encapsulated Interface (Function Code 43…",
      "storyMappings": [
        {
          "storyTerm": "Pressing Unlocked Doorbell",
          "technicalTerm": "Unauthenticated TCP Handshake on Port 502 to 10.60.12.40",
          "tone": "amber"
        },
        {
          "storyTerm": "Requesting Manufacturer Nameplate",
          "technicalTerm": "Modbus Encapsulated Interface Read Device ID (0x2B / MEI Type 14)",
          "tone": "rose"
        },
        {
          "storyTerm": "Boiler Panel Identity",
          "technicalTerm": "ENCO Industrial Heating Controller Vendor & Firmware Strings",
          "tone": "sky"
        },
        {
          "storyTerm": "Boiler Room Intercom Log",
          "technicalTerm": "Zeek ICS Modbus Telemetry Capturing External Port 502 Inquiry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-frostygoop-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Pressing Unlocked Doorbell",
          "subtitle": "Unauthenticated TCP Handshake on Port 502 to 10.60.12.40",
          "tone": "amber"
        },
        {
          "id": "ics-frostygoop-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Requesting Manufacturer Nameplate",
          "subtitle": "Modbus Encapsulated Interface Read Device ID (0x2B / MEI Type…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Asks",
          "stageTag": "STEP 01 · SETUP",
          "title": "Pressing Unlocked Doorbell",
          "storyExcerpt": "Walking up to the unlocked street intercom, the outside caller presses the doorbell and asks the boiler panel to read back its manufacturer nameplate and firmware sticker so they know the exact…",
          "technicalParallel": "Under the hood, the observed step executes zeek-cut id.orig_h id.resp_h func < modbus.log | sort | uniq -c (which executes the technical command / telemetry directive , zeek-cut id.orig_h id.resp_h func…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Requesting Manufacturer Nameplate",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses requesting manufacturer nameplate to advance toward boiler panel identity.",
          "technicalParallel": "OT network sensors record an unauthenticated TCP handshake on port 502 reaching an internet-accessible municipal heating controller, followed by Modbus Encapsulated Interface (Function Code 43 / 0x2B…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room Log",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Boiler Room Intercom Log",
          "storyExcerpt": "Behind the scenes, boiler room intercom log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Zeek ICS Event 502 (recording Protocol=Modbus TCP , Port 502, FunctionCode=0x2B , 43, Read Device Identification, TargetDevice=ENCO Industrial Heating Controller , 10.60.12.40 under T1190)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boiler Panel",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Street Intercom",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "False Dial",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "ics-frostygoop-modbus-tcp-district-heating-controller-audit",
      "sectionKey": "step-2",
      "sceneKind": "ics-frostygoop-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Bulk Holding Register Enumeration via Function Code 0x03",
      "storyCue": "Guided by a prewritten checklist of room numbers, the caller sweeps down the entire bank of boiler gauges one row after another, copying every valve position, water-temperature readout, and pressure limit back to their notebook.",
      "technicalCue": "T1005 · EXFIL & IMPACT — The FrostyGoop Golang client reads JSON tasking files and issues sequential Modbus Function Code 0x03 (Read Holding Registers) requests across address ranges 40001–40120 to baseline current…",
      "storyMappings": [
        {
          "storyTerm": "Prewritten Checklist of Rooms",
          "technicalTerm": "FrostyGoop JSON Tasking File Driving Automated Polling",
          "tone": "amber"
        },
        {
          "storyTerm": "Sweeping Bank of Boiler Gauges",
          "technicalTerm": "Sequential Modbus Function Code 0x03 (Read Holding Registers)",
          "tone": "rose"
        },
        {
          "storyTerm": "Valve & Temperature Readouts",
          "technicalTerm": "Holding Registers 40001 to 40132 (Heating Loop Setpoints)",
          "tone": "sky"
        },
        {
          "storyTerm": "Non-Operator Polling Alarm",
          "technicalTerm": "Passive OT Sensor Alerting on Non-HMI Source IP 198.51.100.84",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-frostygoop-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Prewritten Checklist of Rooms",
          "subtitle": "FrostyGoop JSON Tasking File Driving Automated Polling",
          "tone": "amber"
        },
        {
          "id": "ics-frostygoop-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Sweeping Bank of Boiler Gauges",
          "subtitle": "Sequential Modbus Function Code 0x03 (Read Holding Registers)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Down",
          "stageTag": "STEP 02 · SETUP",
          "title": "Prewritten Checklist of Rooms",
          "storyExcerpt": "Guided by a prewritten checklist of room numbers, the caller sweeps down the entire bank of boiler gauges one row after another, copying every valve position, water-temperature readout, and…",
          "technicalParallel": "Under the hood, the observed step executes awk '$7 == \"READ_HOLDING_REGISTERS\" {print $1, $3, $5, $8, $9}' /opt/zeek/logs/current/modbus_detailed.log (which executes the technical command / telemetry…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bank",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Sweeping Bank of Boiler Gauges",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses sweeping bank of boiler gauges to advance toward valve & temperature readouts.",
          "technicalParallel": "The FrostyGoop Golang client reads JSON tasking files and issues sequential Modbus Function Code 0x03 (Read Holding Registers) requests across address ranges 40001–40120 to baseline current valve…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Non-operator",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Non-Operator Polling Alarm",
          "storyExcerpt": "Behind the scenes, non-operator polling alarm captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Zeek ICS Event 3 (recording ModbusFunction=0x03 , Read Holding Registers, RegisterRange=40101–40132 , Heating Loop Setpoints & Sensor Calibration, PollingSourceIp=198.51.100.84…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boiler Panel",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Street Intercom",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "False Dial",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1005"
    },
    "step-3": {
      "scenarioId": "ics-frostygoop-modbus-tcp-district-heating-controller-audit",
      "sectionKey": "step-3",
      "sceneKind": "ics-frostygoop-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Holding Register Overwrite via Function Codes 0x06 & 0x10 and Firmware Inspection",
      "storyCue": "With the boiler layout mapped out, the caller sends rapid overwrite commands over the intercom to twist the thermal calibration screws and valve actuators off target, forcing city engineers to pull their offline paper schematics and inspect the live gauges.",
      "technicalCue": "T1565.002 · EXFIL & IMPACT — Zeek ICS logs capture Function Code 0x06 (Write Single Register) and Function Code 0x10 (Write Multiple Registers) modifying heating controller parameters and inaccurate temperature calibration…",
      "storyMappings": [
        {
          "storyTerm": "Twisting Calibration Screws",
          "technicalTerm": "Modbus Function Code 0x06 (Write Single) & 0x10 (Write Multiple)",
          "tone": "rose"
        },
        {
          "storyTerm": "Valve & Thermal Targets",
          "technicalTerm": "Holding Registers 40101 to 40108 (Actuator & Thermal Offset)",
          "tone": "sky"
        },
        {
          "storyTerm": "Perimeter Alarm Bell",
          "technicalTerm": "Suricata & Zeek Alert for External Subnet Modbus Write (0x10)",
          "tone": "emerald"
        },
        {
          "storyTerm": "Offline Paper Schematics",
          "technicalTerm": "Golden Offline Engineering Register Backup Verification",
          "tone": "amber"
        }
      ],
      "accentHex": "#F97316",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-frostygoop-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Twisting Calibration Screws",
          "subtitle": "Modbus Function Code 0x06 (Write Single) & 0x10 (Write Multiple)",
          "tone": "rose"
        },
        {
          "id": "ics-frostygoop-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Valve & Thermal Targets",
          "subtitle": "Holding Registers 40101 to 40108 (Actuator & Thermal Offset)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Over",
          "stageTag": "STEP 03 · SETUP",
          "title": "Twisting Calibration Screws",
          "storyExcerpt": "With the boiler layout mapped out, the caller sends rapid overwrite commands over the intercom to twist the thermal calibration screws and valve actuators off target, forcing city engineers to…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r ot_substation_capture.pcap -Y \"modbus.func_code == 6 || modbus.func_code == 16\" -T fields -e frame.time -e ip.src -e modbus.reference_num -e…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Bell",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Valve & Thermal Targets",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses valve & thermal targets to advance toward perimeter alarm bell.",
          "technicalParallel": "Zeek ICS logs capture Function Code 0x06 (Write Single Register) and Function Code 0x10 (Write Multiple Registers) modifying heating controller parameters and inaccurate temperature calibration offsets…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bell",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Offline Paper Schematics",
          "storyExcerpt": "Behind the scenes, offline paper schematics captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Zeek ICS Event 16 (recording ModbusFunction=0x10 , Write Multiple Registers, ModifiedAddresses=Registers 40101–40108 , Valve Actuator & Thermal Setpoint, DetectionAlert=SURICATA Modbus…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boiler Panel",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Street Intercom",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "False Dial",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1565.002"
    }
  },
  "ics-industroyer2-iec-60870-5-104-substation-telemetry": {
    "briefing": {
      "scenarioId": "ics-industroyer2-iec-60870-5-104-substation-telemetry",
      "sectionKey": "briefing",
      "sceneKind": "ics-industroyer2-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1489",
      "title": "Industroyer2 IEC 60870-5-104 Substation Telecontrol & Protection Relay… — Story-to-Technical Overview",
      "storyCue": "Imagine a rogue dispatcher breaking into a regional electrical substation control booth during a night shift. First, they lock the legitimate chief operator out of the radio room and hide the official control handset so nobody can override their orders. Next, they open a direct dedicated hotline to every high-voltage breaker cabinet along the grid and flip the heavy circuit switches off one by one from a prewritten target list.",
      "technicalCue": "EXFIL & IMPACT: Legitimate SCADA Service Termination (PServiceControl.exe) Prior to Port 2404 Takeover -> LATERAL & C2: IEC 60870-5-104 STARTDT_ACT Handshake & Interrogation Frame on TCP Port 2404 -> EXFIL & IMPACT: ASDU Type 46 (C_DC_NA_1 Double Command) IOA Telecontrol Frame Audit",
      "storyMappings": [
        {
          "storyTerm": "Rogue Night-Shift Dispatcher",
          "technicalTerm": "Industroyer2 Automated ICS Executable (108_100.exe)",
          "tone": "rose"
        },
        {
          "storyTerm": "Locking Out Chief Operator",
          "technicalTerm": "Terminating & Renaming PServiceControl.exe SCADA Master",
          "tone": "amber"
        },
        {
          "storyTerm": "Direct Substation Hotline",
          "technicalTerm": "IEC 60870-5-104 Telecontrol Link over TCP Port 2404 (STARTDT_ACT)",
          "tone": "sky"
        },
        {
          "storyTerm": "Flipping High-Voltage Breakers",
          "technicalTerm": "ASDU Type 45 (Single) & Type 46 (Double Command) IOA Frames",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ics-industroyer2-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Rogue Night-Shift Dispatcher",
          "subtitle": "Industroyer2 Automated ICS Executable (108_100.exe)",
          "tone": "rose"
        },
        {
          "id": "ics-industroyer2-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Locking Out Chief Operator",
          "subtitle": "Terminating & Renaming PServiceControl.exe SCADA Master",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down Out",
          "stageTag": "STAGE 01 · EXFIL & IMPACT",
          "title": "Legitimate SCADA Service Termination (PServiceControl.exe) Prior to Port 2404 Takeover",
          "storyExcerpt": "Stepping inside the substation control booth, the rogue dispatcher first shuts down the legitimate chief operator’s console and moves their official radio handset out of reach so the real control desk…",
          "technicalParallel": "Under the hood, the observed step executes taskkill.exe /F /IM PServiceControl.exe (which executes the technical command / telemetry directive , taskkill.exe /F /IM PServiceControl.exe via taskkill.exe…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "IEC 60870-5-104 STARTDT_ACT Handshake & Interrogation Frame on TCP Port 2404",
          "storyExcerpt": "Reading from a laminated card of substation phone numbers tucked in their pocket, the rogue dispatcher dials each remote breaker cabinet over the dedicated utility line and sends the official wake-up…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r substation.pcap -Y \"iec60870_104\" -T fields -e ip.src -e ip.dst -e iec60870_104.type -e iec60870_104.utype (which executes the technical command /…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Down List",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "ASDU Type 46 (C_DC_NA_1 Double Command) IOA Telecontrol Frame Audit",
          "storyExcerpt": "As soon as the remote cabinets chime back ready, the rogue dispatcher marches straight down the laminated list, throwing switch after switch to trip the high-voltage breakers open and darken the…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r substation.pcap -Y \"iec60870_asdu.typeid == 45 || iec60870_asdu.typeid == 46\" -T fields -e iec60870_asdu.ca -e iec60870_asdu.ioa (which Captures or…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Breaker Bank",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Radio Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trip Command",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ics-industroyer2-iec-60870-5-104-substation-telemetry",
      "sectionKey": "step-1",
      "sceneKind": "ics-industroyer2-step-1",
      "stageBadge": "STEP #1 · EXFIL & IMPACT",
      "title": "Legitimate SCADA Service Termination (PServiceControl.exe) Prior to Port 2404 Takeover",
      "storyCue": "Stepping inside the substation control booth, the rogue dispatcher first shuts down the legitimate chief operator’s console and moves their official radio handset out of reach so the real control desk cannot fight back once the breaker orders begin.",
      "technicalCue": "T1489 · EXFIL & IMPACT — Before opening its own IEC-104 socket connections, the Industroyer2 executable terminates the legitimate substation telecontrol service (PServiceControl.exe) and renames its binary on disk so…",
      "storyMappings": [
        {
          "storyTerm": "Substation Control Booth",
          "technicalTerm": "Windows SCADA Control Server Hosting Telecontrol Service",
          "tone": "sky"
        },
        {
          "storyTerm": "Legitimate Chief Operator Console",
          "technicalTerm": "PServiceControl.exe Substation Telecontrol Master Process",
          "tone": "amber"
        },
        {
          "storyTerm": "Moving Radio Handset Out of Reach",
          "technicalTerm": "Process Termination & On-Disk Binary Rename (T1489)",
          "tone": "rose"
        },
        {
          "storyTerm": "Control Room Audit Log",
          "technicalTerm": "Sysmon Event ID 1 / Process Termination & File Rename Telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#FACC15",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-industroyer2-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Substation Control Booth",
          "subtitle": "Windows SCADA Control Server Hosting Telecontrol Service",
          "tone": "sky"
        },
        {
          "id": "ics-industroyer2-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Legitimate Chief Operator Console",
          "subtitle": "PServiceControl.exe Substation Telecontrol Master Process",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down Out",
          "stageTag": "STEP 01 · SETUP",
          "title": "Substation Control Booth",
          "storyExcerpt": "Stepping inside the substation control booth, the rogue dispatcher first shuts down the legitimate chief operator’s console and moves their official radio handset out of reach so the real…",
          "technicalParallel": "Under the hood, the observed step executes taskkill.exe /F /IM PServiceControl.exe (which executes the technical command / telemetry directive , taskkill.exe /F /IM PServiceControl.exe via taskkill.exe…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Legitimate Chief Operator Console",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses legitimate chief operator console to advance toward moving radio handset out of reach.",
          "technicalParallel": "Before opening its own IEC-104 socket connections, the Industroyer2 executable terminates the legitimate substation telecontrol service (PServiceControl.exe) and renames its binary on disk so the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room Log",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Control Room Audit Log",
          "storyExcerpt": "Behind the scenes, control room audit log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording ParentBinary=C:\\Temp\\108_100.exe , Industroyer2 Binary, StoppedServiceBinary=PServiceControl.exe , Substation SCADA Service, CertUaReference=CERT-UA#4435 under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Breaker Bank",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Radio Booth",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trip Command",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1489"
    },
    "step-2": {
      "scenarioId": "ics-industroyer2-iec-60870-5-104-substation-telemetry",
      "sectionKey": "step-2",
      "sceneKind": "ics-industroyer2-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "IEC 60870-5-104 STARTDT_ACT Handshake & Interrogation Frame on TCP Port 2404",
      "storyCue": "Reading from a laminated card of substation phone numbers tucked in their pocket, the rogue dispatcher dials each remote breaker cabinet over the dedicated utility line and sends the official wake-up chime that puts every relay on standby for live commands.",
      "technicalCue": "T1071 · LATERAL & C2 — The binary reads its embedded configuration table (containing target RTU IP addresses, Common Address of ASDU, and IOA lists) and sends an IEC-104 U-format STARTDT_ACT (0x68 0x04 0x07 0x00 0x00…",
      "storyMappings": [
        {
          "storyTerm": "Laminated Card of Numbers",
          "technicalTerm": "Hardcoded Configuration Table (RTU IPs, Common Address & IOA List)",
          "tone": "amber"
        },
        {
          "storyTerm": "Dedicated Utility Hotline",
          "technicalTerm": "IEC 60870-5-104 Protocol Connection on TCP Port 2404",
          "tone": "sky"
        },
        {
          "storyTerm": "Official Wake-Up Chime",
          "technicalTerm": "U-Format STARTDT_ACT Control Frame (0x68 0x04 0x07 0x00 0x00 0x00)",
          "tone": "rose"
        },
        {
          "storyTerm": "Relay Standby Confirmation",
          "technicalTerm": "RTU STARTDT_CON Reply Monitored by Passive OT Sensors",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#FACC15",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-industroyer2-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Laminated Card of Numbers",
          "subtitle": "Hardcoded Configuration Table (RTU IPs, Common Address & IOA…",
          "tone": "amber"
        },
        {
          "id": "ics-industroyer2-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Dedicated Utility Hotline",
          "subtitle": "IEC 60870-5-104 Protocol Connection on TCP Port 2404",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card",
          "stageTag": "STEP 02 · SETUP",
          "title": "Laminated Card of Numbers",
          "storyExcerpt": "Reading from a laminated card of substation phone numbers tucked in their pocket, the rogue dispatcher dials each remote breaker cabinet over the dedicated utility line and sends the official…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r substation.pcap -Y \"iec60870_104\" -T fields -e ip.src -e ip.dst -e iec60870_104.type -e iec60870_104.utype (which executes the technical command /…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Wake-up",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Dedicated Utility Hotline",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses dedicated utility hotline to advance toward official wake-up chime.",
          "technicalParallel": "The binary reads its embedded configuration table (containing target RTU IP addresses, Common Address of ASDU, and IOA lists) and sends an IEC-104 U-format STARTDT_ACT (0x68 0x04 0x07 0x00 0x00 0x00)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wake-up",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Relay Standby Confirmation",
          "storyExcerpt": "Behind the scenes, relay standby confirmation captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 2404 (recording Protocol=IEC 60870-5-104 , TCP 2404, ApciControlFrame=STARTDT_ACT , Start Data Transfer Activation, AsduType100=C_IC_NA_1 , Interrogation Command under T1071)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Breaker Bank",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Radio Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trip Command",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1071"
    },
    "step-3": {
      "scenarioId": "ics-industroyer2-iec-60870-5-104-substation-telemetry",
      "sectionKey": "step-3",
      "sceneKind": "ics-industroyer2-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "ASDU Type 46 (C_DC_NA_1 Double Command) IOA Telecontrol Frame Audit",
      "storyCue": "As soon as the remote cabinets chime back ready, the rogue dispatcher marches straight down the laminated list, throwing switch after switch to trip the high-voltage breakers open and darken the substation feeders.",
      "technicalCue": "T1565.002 · EXFIL & IMPACT — After receiving STARTDT_CON, the binary iterates through its configured Information Object Addresses (IOAs) and transmits ASDU Type 45 (C_SC_NA_1 Single Command) and Type 46 (C_DC_NA_1 Double…",
      "storyMappings": [
        {
          "storyTerm": "Marching Down Laminated List",
          "technicalTerm": "Iterating Configured Information Object Addresses (IOAs)",
          "tone": "amber"
        },
        {
          "storyTerm": "Throwing High-Voltage Switches",
          "technicalTerm": "ASDU Type 45 (C_SC_NA_1) & Type 46 (C_DC_NA_1) Double Command",
          "tone": "rose"
        },
        {
          "storyTerm": "Immediate Action Order",
          "technicalTerm": "Cause of Transmission = 6 (Activation) Telecontrol Flag",
          "tone": "sky"
        },
        {
          "storyTerm": "Substation Wire Inspection",
          "technicalTerm": "Zeek / Suricata IEC-104 ASDU Type 46 Anomaly Detection",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-industroyer2-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Marching Down Laminated List",
          "subtitle": "Iterating Configured Information Object Addresses (IOAs)",
          "tone": "amber"
        },
        {
          "id": "ics-industroyer2-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Throwing High-Voltage Switches",
          "subtitle": "ASDU Type 45 (C_SC_NA_1) & Type 46 (C_DC_NA_1) Double Command",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down List",
          "stageTag": "STEP 03 · SETUP",
          "title": "Marching Down Laminated List",
          "storyExcerpt": "As soon as the remote cabinets chime back ready, the rogue dispatcher marches straight down the laminated list, throwing switch after switch to trip the high-voltage breakers open and darken…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r substation.pcap -Y \"iec60870_asdu.typeid == 45 || iec60870_asdu.typeid == 46\" -T fields -e iec60870_asdu.ca -e iec60870_asdu.ioa (which Captures or…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. High-voltage",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Throwing High-Voltage Switches",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses throwing high-voltage switches to advance toward immediate action order.",
          "technicalParallel": "After receiving STARTDT_CON, the binary iterates through its configured Information Object Addresses (IOAs) and transmits ASDU Type 45 (C_SC_NA_1 Single Command) and Type 46 (C_DC_NA_1 Double Command)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wire",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Substation Wire Inspection",
          "storyExcerpt": "Behind the scenes, substation wire inspection captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 46 (recording AsduTypeId=46 , C_DC_NA_1, Double Command, CauseOfTransmission=6 , Activation, InformationObjectAddress=COA=12, IOA=1104 under T1565.002): Implement OT…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Breaker Bank",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Radio Booth",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trip Command",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1565.002"
    }
  },
  "ics-pipedream-incontroller-codesys-modbus-opcua": {
    "briefing": {
      "scenarioId": "ics-pipedream-incontroller-codesys-modbus-opcua",
      "sectionKey": "briefing",
      "sceneKind": "ics-pipedream-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1046",
      "title": "Industrial PLC CODESYS & Modbus/OPC-UA Protocol Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a saboteur sneaking onto a power plant floor with a Swiss-army toolbox built for three different factory machines. First, they walk the control hallway scanning every dial plate to catalog each machine model. Next, they slide a forged maintenance cartridge into the main assembly controller to rewrite its operating instructions, and finally they twist the raw manual pressure valves directly on the pipe manifold while floor monitors log every unauthorized turn.",
      "technicalCue": "CREDENTIAL ACCESS: Industrial Asset Discovery via OPC-UA (Port 4840) & ENIP/Modbus Enumeration (TAGRUN) -> LATERAL & C2: CODESYS v2/v3 Runtime Authentication Bypass & Logic Upload Inspection (CODECALL) -> EXFIL & IMPACT: Direct Modbus TCP Register Write (Function Code 06/16) & Physical Switch Verification",
      "storyMappings": [
        {
          "storyTerm": "Swiss-Army Factory Toolbox",
          "technicalTerm": "Modular ICS Framework · PIPEDREAM / INCONTROLLER (TAGRUN, CODECALL, OMWORM)",
          "tone": "rose"
        },
        {
          "storyTerm": "Control Hallway Dial Scan",
          "technicalTerm": "OPC-UA (TCP/4840), EtherNet/IP (44818) & Modbus Device ID (0x2B)",
          "tone": "amber"
        },
        {
          "storyTerm": "Forged Maintenance Cartridge",
          "technicalTerm": "CODESYS v2/v3 Runtime Toolkit (TCP/1217 & 2455) Logic Upload",
          "tone": "rose"
        },
        {
          "storyTerm": "Floor Monitors Logging Turns",
          "technicalTerm": "CISA ICS-NPP Zeek Parsers (modbus.log, opcua.log) & OT Sensor",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ics-pipedream-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Swiss-Army Factory Toolbox",
          "subtitle": "Modular ICS Framework · PIPEDREAM / INCONTROLLER (TAGRUN…",
          "tone": "rose"
        },
        {
          "id": "ics-pipedream-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Control Hallway Dial Scan",
          "subtitle": "OPC-UA (TCP/4840), EtherNet/IP (44818) & Modbus Device ID (0x2B)",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Past",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Industrial Asset Discovery via OPC-UA (Port 4840) & ENIP/Modbus Enumeration (TAGRUN)",
          "storyExcerpt": "Starting from a hijacked supervisor console on the plant floor, the saboteur pulls out the scouting gauge from the Swiss-army toolbox and walks past every controller rack, knocking on each inspection…",
          "technicalParallel": "Under the hood, the observed step executes zeek -C -r ot-capture.pcap icsnpp-opcua-binary icsnpp-modbus (which Captures or inspects industrial control system , ICS/OT protocol frames and engineering…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Dial Scan",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "CODESYS v2/v3 Runtime Authentication Bypass & Logic Upload Inspection (CODECALL)",
          "storyExcerpt": "Knowing the exact controller models on the line, the saboteur switches to the forged maintenance cartridge from the same toolbox, bypasses the technician padlock on the controller cabinet, and tries to…",
          "technicalParallel": "Under the hood, the observed step executes suricata -c /etc/suricata/suricata.yaml -r ot-substation.pcap (which executes the technical command / telemetry directive , suricata -c…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Raw Pipe",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Direct Modbus TCP Register Write (Function Code 06/16) & Physical Switch Verification",
          "storyExcerpt": "For machines on the raw pipe manifold that lack a safety lock, the saboteur grabs the heavy wrench from the toolbox and cranks the physical pressure dials past their safe markings, unaware that passive…",
          "technicalParallel": "Under the hood, the observed step executes zeek -C -r modbus-traffic.pcap icsnpp-modbus (which Captures or inspects industrial control system , ICS/OT protocol frames and engineering workstation logs…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PLC Toolbox",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Rack",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hallway Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ics-pipedream-incontroller-codesys-modbus-opcua",
      "sectionKey": "step-1",
      "sceneKind": "ics-pipedream-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Industrial Asset Discovery via OPC-UA (Port 4840) & ENIP/Modbus Enumeration (TAGRUN)",
      "storyCue": "Starting from a hijacked supervisor console on the plant floor, the saboteur pulls out the scouting gauge from the Swiss-army toolbox and walks past every controller rack, knocking on each inspection window so the machines proudly announce their make, model, and firmware badge.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — From a compromised Level 2/3 Engineering Workstation, the TAGRUN module enumerates OPC-UA servers on TCP port 4840 (OpenSecureChannel / CreateSession / Browse) and scans industrial subnets on…",
      "storyMappings": [
        {
          "storyTerm": "Hijacked Supervisor Console",
          "technicalTerm": "Compromised Level 2/3 OT Engineering Workstation",
          "tone": "amber"
        },
        {
          "storyTerm": "Scouting Gauge Tool",
          "technicalTerm": "TAGRUN Discovery Module (OPC-UA / ENIP / Modbus Scanner)",
          "tone": "rose"
        },
        {
          "storyTerm": "Knocking on Inspection Windows",
          "technicalTerm": "OPC-UA OpenSecureChannel (TCP/4840) & ENIP ListIdentity (44818)",
          "tone": "sky"
        },
        {
          "storyTerm": "Machine Model & Firmware Badge",
          "technicalTerm": "Modbus MEI Read Device Identification (Function 0x2B / Type 0x0E)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-pipedream-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Hijacked Supervisor Console",
          "subtitle": "Compromised Level 2/3 OT Engineering Workstation",
          "tone": "amber"
        },
        {
          "id": "ics-pipedream-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Scouting Gauge Tool",
          "subtitle": "TAGRUN Discovery Module (OPC-UA / ENIP / Modbus Scanner)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Past",
          "stageTag": "STEP 01 · SETUP",
          "title": "Hijacked Supervisor Console",
          "storyExcerpt": "Starting from a hijacked supervisor console on the plant floor, the saboteur pulls out the scouting gauge from the Swiss-army toolbox and walks past every controller rack, knocking on each…",
          "technicalParallel": "Under the hood, the observed step executes zeek -C -r ot-capture.pcap icsnpp-opcua-binary icsnpp-modbus (which Captures or inspects industrial control system , ICS/OT protocol frames and engineering…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tool",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Scouting Gauge Tool",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses scouting gauge tool to advance toward knocking on inspection windows.",
          "technicalParallel": "From a compromised Level 2/3 Engineering Workstation, the TAGRUN module enumerates OPC-UA servers on TCP port 4840 (OpenSecureChannel / CreateSession / Browse) and scans industrial subnets on UDP/TCP…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out Past",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Machine Model & Firmware Badge",
          "storyExcerpt": "Behind the scenes, machine model & firmware badge captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 4840 (recording IndustrialProtocol=OPC-UA Binary , TCP 4840, ServiceInvoked=GetEndpointsRequest / BrowseRequest, AdvisoryReference=CISA AA22-103A , APT Tools Targeting…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PLC Toolbox",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Rack",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hallway Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1046"
    },
    "step-2": {
      "scenarioId": "ics-pipedream-incontroller-codesys-modbus-opcua",
      "sectionKey": "step-2",
      "sceneKind": "ics-pipedream-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "CODESYS v2/v3 Runtime Authentication Bypass & Logic Upload Inspection (CODECALL)",
      "storyCue": "Knowing the exact controller models on the line, the saboteur switches to the forged maintenance cartridge from the same toolbox, bypasses the technician padlock on the controller cabinet, and tries to load rewritten operating instructions straight onto the factory brain.",
      "technicalCue": "T1021 · LATERAL & C2 — The CODECALL module targets the CODESYS Runtime Toolkit on TCP port 1217/2455, crafting Layer 4 block driver frames to enumerate PLC device parameters and attempt unauthorized IEC 61131-3…",
      "storyMappings": [
        {
          "storyTerm": "Forged Maintenance Cartridge",
          "technicalTerm": "CODECALL Module Targeting CODESYS Runtime (TCP/1217 & 2455)",
          "tone": "rose"
        },
        {
          "storyTerm": "Controller Cabinet",
          "technicalTerm": "Industrial PLC Running CODESYS Control Runtime Toolkit",
          "tone": "sky"
        },
        {
          "storyTerm": "Technician Padlock Bypass",
          "technicalTerm": "Layer 4 Block Driver Frame Enumeration (ServiceGroup 0x0002)",
          "tone": "amber"
        },
        {
          "storyTerm": "Rewritten Operating Instructions",
          "technicalTerm": "Unauthorized IEC 61131-3 Control Logic Upload Attempt",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-pipedream-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Forged Maintenance Cartridge",
          "subtitle": "CODECALL Module Targeting CODESYS Runtime (TCP/1217 & 2455)",
          "tone": "rose"
        },
        {
          "id": "ics-pipedream-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Controller Cabinet",
          "subtitle": "Industrial PLC Running CODESYS Control Runtime Toolkit",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Line Same",
          "stageTag": "STEP 02 · SETUP",
          "title": "Forged Maintenance Cartridge",
          "storyExcerpt": "Knowing the exact controller models on the line, the saboteur switches to the forged maintenance cartridge from the same toolbox, bypasses the technician padlock on the controller cabinet, and…",
          "technicalParallel": "Under the hood, the observed step executes suricata -c /etc/suricata/suricata.yaml -r ot-substation.pcap (which executes the technical command / telemetry directive , suricata -c…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Controller Cabinet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses controller cabinet to advance toward technician padlock bypass.",
          "technicalParallel": "The CODECALL module targets the CODESYS Runtime Toolkit on TCP port 1217/2455, crafting Layer 4 block driver frames to enumerate PLC device parameters and attempt unauthorized IEC 61131-3 control logic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Line Same",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Rewritten Operating Instructions",
          "storyExcerpt": "Behind the scenes, rewritten operating instructions captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 2455 (recording TargetPlcRuntime=CODESYS Control Runtime , TCP 2455, ServiceGroup=0x0002 , CmpApp Application Manager, NdrSignature=CISA-AA22-103A CODECALL Activity under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PLC Toolbox",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Rack",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hallway Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021"
    },
    "step-3": {
      "scenarioId": "ics-pipedream-incontroller-codesys-modbus-opcua",
      "sectionKey": "step-3",
      "sceneKind": "ics-pipedream-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Direct Modbus TCP Register Write (Function Code 06/16) & Physical Switch Verification",
      "storyCue": "For machines on the raw pipe manifold that lack a safety lock, the saboteur grabs the heavy wrench from the toolbox and cranks the physical pressure dials past their safe markings, unaware that passive hallway cameras are recording every non-operator hand touching the valves.",
      "technicalCue": "T1565.002 · EXFIL & IMPACT — At the Modbus TCP layer (port 502), unauthorized Function Code 06 (Write Single Register) or Function Code 16 (Write Multiple Registers) PDUs modify holding registers controlling actuator…",
      "storyMappings": [
        {
          "storyTerm": "Raw Pipe Manifold",
          "technicalTerm": "Unauthenticated Modbus TCP Service (TCP Port 502)",
          "tone": "sky"
        },
        {
          "storyTerm": "Cranking Pressure Dials",
          "technicalTerm": "Modbus Function Code 0x06 (Write Single) & 0x10 (Write Multiple)",
          "tone": "rose"
        },
        {
          "storyTerm": "Safe Pressure Markings",
          "technicalTerm": "PLC Holding Registers Controlling Physical Actuator Setpoints",
          "tone": "amber"
        },
        {
          "storyTerm": "Passive Hallway Cameras",
          "technicalTerm": "Zeek ICS-NPP modbus.log & Physical PLC Mode Switch Verification",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-pipedream-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Raw Pipe Manifold",
          "subtitle": "Unauthenticated Modbus TCP Service (TCP Port 502)",
          "tone": "sky"
        },
        {
          "id": "ics-pipedream-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Cranking Pressure Dials",
          "subtitle": "Modbus Function Code 0x06 (Write Single) & 0x10 (Write Multiple)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raw Pipe",
          "stageTag": "STEP 03 · SETUP",
          "title": "Raw Pipe Manifold",
          "storyExcerpt": "For machines on the raw pipe manifold that lack a safety lock, the saboteur grabs the heavy wrench from the toolbox and cranks the physical pressure dials past their safe markings, unaware that…",
          "technicalParallel": "Under the hood, the observed step executes zeek -C -r modbus-traffic.pcap icsnpp-modbus (which Captures or inspects industrial control system , ICS/OT protocol frames and engineering workstation logs…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Safe",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Cranking Pressure Dials",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses cranking pressure dials to advance toward safe pressure markings.",
          "technicalParallel": "At the Modbus TCP layer (port 502), unauthorized Function Code 06 (Write Single Register) or Function Code 16 (Write Multiple Registers) PDUs modify holding registers controlling actuator setpoints…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Safe",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Passive Hallway Cameras",
          "storyExcerpt": "Behind the scenes, passive hallway cameras captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 502 (recording Protocol=Modbus TCP , Port 502 · CISA ICSNPP-Modbus, ModbusFunction=Function Code 16 , 0x10, Write Multiple Registers, TargetRegisterRange=Holding Registers…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PLC Toolbox",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Rack",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Hallway Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1565.002"
    }
  },
  "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit": {
    "briefing": {
      "scenarioId": "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit",
      "sectionKey": "briefing",
      "sceneKind": "ics-stuxnet-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1574.001",
      "title": "SIMATIC STEP 7 s7otbxdx.dll Interception & S7comm PLC Logic Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a precision centrifuge hall where engineers program high-speed spinning controllers through a single glass translation booth. An intruder secretly replaces the official glass translator with a double-agent imposter who passes routine messages along cleanly, slips hidden speed-tampering instructions down the cable into the spinning controllers, and then lies back through the glass whenever engineers inspect the machines, until an independent auditor taps the raw copper cable and catches the size mismatch.",
      "technicalCue": "PERSISTENCE: Engineering Workstation STEP 7 s7otbxdx.dll Wrapper Replacement Audit -> EXECUTION: S7comm Port 102 PLC Block Download (OB1, OB35 & System Data Block SDB) -> DEFENSE EVASION: S7comm Upload Block (0x1D) Readback Spoofing & Offline Checksum Verification",
      "storyMappings": [
        {
          "storyTerm": "Double-Agent Glass Translator",
          "technicalTerm": "Unsigned Wrapper DLL C:\\Windows\\System32\\s7otbxdx.dll",
          "tone": "rose"
        },
        {
          "storyTerm": "Original Official Translator",
          "technicalTerm": "Legitimate Siemens Library Renamed to s7otbxsx.dll",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden Speed-Tampering Instructions",
          "technicalTerm": "S7comm Port 102 Download (0x1A/0x1B) of OB1, OB35 & FC1865..FC1874",
          "tone": "amber"
        },
        {
          "storyTerm": "Tapping the Raw Copper Cable",
          "technicalTerm": "Zeek S7comm Upload Block (0x1D) Wire Size vs STEP 7 GUI Audit",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ics-stuxnet-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Double-Agent Glass Translator",
          "subtitle": "Unsigned Wrapper DLL C:\\Windows\\System32\\s7otbxdx.dll",
          "tone": "rose"
        },
        {
          "id": "ics-stuxnet-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Original Official Translator",
          "subtitle": "Legitimate Siemens Library Renamed to s7otbxsx.dll",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Real Side",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Engineering Workstation STEP 7 s7otbxdx.dll Wrapper Replacement Audit",
          "storyExcerpt": "Inside the engineering booth, the intruder moves the real factory translator into a side closet under a slightly different name badge and puts an unsigned double-agent imposter at the front window so…",
          "technicalParallel": "Under the hood, the observed step executes sigcheck.exe -u -e C:\\Windows\\System32\\s7otbx*.dll (which executes the technical command / telemetry directive , sigcheck.exe -u -e…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Down Hall",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "S7comm Port 102 PLC Block Download (OB1, OB35 & System Data Block SDB)",
          "storyExcerpt": "Once the double-agent translator confirms the exact centrifuge drive model wired down the hall, it piggybacks on the official cable to download hidden main-loop and timed-interrupt instructions straight…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r step7_plc_traffic.pcap -Y \"s7comm.param.func == 0x1a || s7comm.param.func == 0x1b\" -T fields -e ip.src -e ip.dst -e s7comm.param.filename (which…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Up Fake",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "S7comm Upload Block (0x1D) Readback Spoofing & Offline Checksum Verification",
          "storyExcerpt": "When a suspicious engineer opens the console to compare the live controller against the clean master blueprint, the double-agent translator intercepts the readback and holds up a fake photocopy showing…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r step7_plc_traffic.pcap -Y \"s7comm.param.func == 0x1d\" -T fields -e frame.number -e s7comm.data.length (which executes the technical command /…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Centrifuges",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Copper Tap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit",
      "sectionKey": "step-1",
      "sceneKind": "ics-stuxnet-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Engineering Workstation STEP 7 s7otbxdx.dll Wrapper Replacement Audit",
      "storyCue": "Inside the engineering booth, the intruder moves the real factory translator into a side closet under a slightly different name badge and puts an unsigned double-agent imposter at the front window so every routine button press passes through the imposter first.",
      "technicalCue": "T1574.001 · PERSISTENCE — On the SIMATIC STEP 7 engineering workstation, host forensic sensors detect the original Siemens communication library C:\\Windows\\System32\\s7otbxdx.dll renamed to s7otbxsx.dll and replaced by…",
      "storyMappings": [
        {
          "storyTerm": "Engineering Control Booth",
          "technicalTerm": "SIMATIC Manager Engineering Workstation (s7tgtopx.exe)",
          "tone": "sky"
        },
        {
          "storyTerm": "Real Translator Moved to Closet",
          "technicalTerm": "Legitimate s7otbxdx.dll Renamed to s7otbxsx.dll on Disk",
          "tone": "amber"
        },
        {
          "storyTerm": "Unsigned Double-Agent Imposter",
          "technicalTerm": "Malicious s7otbxdx.dll Wrapper Exporting All 109 s7ag_* APIs",
          "tone": "rose"
        },
        {
          "storyTerm": "Booth Security Sensor",
          "technicalTerm": "Sysmon Event ID 7 (ImageLoad) & WDAC Unsigned DLL Policy",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-stuxnet-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Engineering Control Booth",
          "subtitle": "SIMATIC Manager Engineering Workstation (s7tgtopx.exe)",
          "tone": "sky"
        },
        {
          "id": "ics-stuxnet-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Real Translator Moved to Closet",
          "subtitle": "Legitimate s7otbxdx.dll Renamed to s7otbxsx.dll on Disk",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Real Side",
          "stageTag": "STEP 01 · SETUP",
          "title": "Engineering Control Booth",
          "storyExcerpt": "Inside the engineering booth, the intruder moves the real factory translator into a side closet under a slightly different name badge and puts an unsigned double-agent imposter at the front…",
          "technicalParallel": "Under the hood, the observed step executes sigcheck.exe -u -e C:\\Windows\\System32\\s7otbx*.dll (which executes the technical command / telemetry directive , sigcheck.exe -u -e…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Real",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Real Translator Moved to Closet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses real translator moved to closet to advance toward unsigned double-agent imposter.",
          "technicalParallel": "On the SIMATIC STEP 7 engineering workstation, host forensic sensors detect the original Siemens communication library C:\\Windows\\System32\\s7otbxdx.dll renamed to s7otbxsx.dll and replaced by an unsigned…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Real Side",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Booth Security Sensor",
          "storyExcerpt": "Behind the scenes, booth security sensor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 7 (recording HostApplication=SIMATIC Manager , s7tgtopx.exe, InterceptedLibrary=C:\\Windows\\System32\\s7otbxdx.dll , Unsigned Wrapper…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Centrifuges",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Booth",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Copper Tap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1574.001"
    },
    "step-2": {
      "scenarioId": "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit",
      "sectionKey": "step-2",
      "sceneKind": "ics-stuxnet-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "S7comm Port 102 PLC Block Download (OB1, OB35 & System Data Block SDB)",
      "storyCue": "Once the double-agent translator confirms the exact centrifuge drive model wired down the hall, it piggybacks on the official cable to download hidden main-loop and timed-interrupt instructions straight into the controller’s memory.",
      "technicalCue": "T1059 · EXECUTION — Over ISO-on-TCP (RFC 1006 port 102), the wrapper library checks attached System Data Blocks (SDBs) for specific Profibus CP 342-5 / drive signatures (7050h / 9500h) and transmits S7comm…",
      "storyMappings": [
        {
          "storyTerm": "Confirming Centrifuge Drive Model",
          "technicalTerm": "Inspecting System Data Blocks (SDBs) for Profibus 7050h / 9500h",
          "tone": "amber"
        },
        {
          "storyTerm": "Official Hallway Cable",
          "technicalTerm": "Siemens S7comm Protocol over ISO-on-TCP (RFC 1006 Port 102)",
          "tone": "sky"
        },
        {
          "storyTerm": "Downloading Hidden Loop Rules",
          "technicalTerm": "S7comm Function 0x1A (Request Download) & 0x1B (Download Block)",
          "tone": "rose"
        },
        {
          "storyTerm": "Modified Controller Memory",
          "technicalTerm": "Injected OB1 Main Sweep, OB35 100ms Interrupt & FC1865..FC1874",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-stuxnet-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Confirming Centrifuge Drive Model",
          "subtitle": "Inspecting System Data Blocks (SDBs) for Profibus 7050h / 9500h",
          "tone": "amber"
        },
        {
          "id": "ics-stuxnet-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Official Hallway Cable",
          "subtitle": "Siemens S7comm Protocol over ISO-on-TCP (RFC 1006 Port 102)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down Hall",
          "stageTag": "STEP 02 · SETUP",
          "title": "Confirming Centrifuge Drive Model",
          "storyExcerpt": "Once the double-agent translator confirms the exact centrifuge drive model wired down the hall, it piggybacks on the official cable to download hidden main-loop and timed-interrupt instructions…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r step7_plc_traffic.pcap -Y \"s7comm.param.func == 0x1a || s7comm.param.func == 0x1b\" -T fields -e ip.src -e ip.dst -e s7comm.param.filename (which…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Loop",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Official Hallway Cable",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses official hallway cable to advance toward downloading hidden loop rules.",
          "technicalParallel": "Over ISO-on-TCP (RFC 1006 port 102), the wrapper library checks attached System Data Blocks (SDBs) for specific Profibus CP 342-5 / drive signatures (7050h / 9500h) and transmits S7comm Function 0x1A…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Loop",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Modified Controller Memory",
          "storyExcerpt": "Behind the scenes, modified controller memory captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Zeek ICS Event 102 (recording Protocol=Siemens S7comm over ISO-on-TCP , Port 102, S7FunctionCode=0x1B , Download Block to PLC RAM/EPROM, TargetBlocks=OB1 , Main Sweep, OB35 , 100ms Cyclic…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Centrifuges",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Copper Tap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059"
    },
    "step-3": {
      "scenarioId": "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit",
      "sectionKey": "step-3",
      "sceneKind": "ics-stuxnet-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "S7comm Upload Block (0x1D) Readback Spoofing & Offline Checksum Verification",
      "storyCue": "When a suspicious engineer opens the console to compare the live controller against the clean master blueprint, the double-agent translator intercepts the readback and holds up a fake photocopy showing normal code, until a clean auditor taps the wire directly and spots that the real packet traveling over the cable is seven times larger than what the screen claims.",
      "technicalCue": "T1564 · DEFENSE EVASION — When an operator opens SIMATIC Manager to compare online PLC blocks with the offline project, the s7otbxdx.dll wrapper intercepts s7ag_read_szl and s7ag_bub_read_var_seg calls to hide the…",
      "storyMappings": [
        {
          "storyTerm": "Holding Up a Fake Photocopy",
          "technicalTerm": "s7otbxdx.dll!s7ag_bub_read_var_seg Filtering Hidden FC Blocks",
          "tone": "rose"
        },
        {
          "storyTerm": "Engineer Inspection Screen",
          "technicalTerm": "SIMATIC STEP 7 GUI Displaying Spoofed 412-Byte OB1 Block",
          "tone": "amber"
        },
        {
          "storyTerm": "Tapping the Raw Cable Directly",
          "technicalTerm": "Network Capture of S7comm Function 0x1D (Upload Block = 2,940 B)",
          "tone": "sky"
        },
        {
          "storyTerm": "Clean Master Blueprint Restore",
          "technicalTerm": "Air-Gapped Verification Laptop & Golden PLC Memory Card Restore",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-stuxnet-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Holding Up a Fake Photocopy",
          "subtitle": "s7otbxdx.dll!s7ag_bub_read_var_seg Filtering Hidden FC Blocks",
          "tone": "rose"
        },
        {
          "id": "ics-stuxnet-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Engineer Inspection Screen",
          "subtitle": "SIMATIC STEP 7 GUI Displaying Spoofed 412-Byte OB1 Block",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Fake",
          "stageTag": "STEP 03 · SETUP",
          "title": "Holding Up a Fake Photocopy",
          "storyExcerpt": "When a suspicious engineer opens the console to compare the live controller against the clean master blueprint, the double-agent translator intercepts the readback and holds up a fake photocopy…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r step7_plc_traffic.pcap -Y \"s7comm.param.func == 0x1d\" -T fields -e frame.number -e s7comm.data.length (which executes the technical command /…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Raw",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Engineer Inspection Screen",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses engineer inspection screen to advance toward tapping the raw cable directly.",
          "technicalParallel": "When an operator opens SIMATIC Manager to compare online PLC blocks with the offline project, the s7otbxdx.dll wrapper intercepts s7ag_read_szl and s7ag_bub_read_var_seg calls to hide the injected FC…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live Up",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Clean Master Blueprint Restore",
          "storyExcerpt": "Behind the scenes, clean master blueprint restore captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Zeek ICS Event 29 (recording ForensicDiscrepancy=Wire S7comm OB1 size , 2,940 bytes != STEP 7 GUI displayed size , 412 bytes, InterceptedApiCall=s7otbxdx.dll!s7ag_bub_read_var_seg…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Centrifuges",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Copper Tap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1564"
    }
  },
  "ics-trisis-triton-schneider-triconex-sis-telemetry": {
    "briefing": {
      "scenarioId": "ics-trisis-triton-schneider-triconex-sis-telemetry",
      "sectionKey": "briefing",
      "sceneKind": "ics-trisis-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1036.005",
      "title": "TRISIS / TRITON Safety Instrumented System (SIS) TriStation Protocol… — Story-to-Technical Overview",
      "storyCue": "Imagine a chemical plant protected by an independent emergency fire-suppression brain that trips a safe shutdown whenever pressure climbs too high. An intruder slips onto the safety engineer’s desk wearing a forged inspector jacket, checks whether the physical brass maintenance key was accidentally left turned to the unlock position, and tries to rewrite the emergency shutdown brain, only for three twin safety judges working in lockstep to spot a disagreement and sound a hardware fault alarm.",
      "technicalCue": "DEFENSE EVASION: Masqueraded Py2EXE Binary (trilog.exe) & Library.zip Extraction on SIS Workstation -> CREDENTIAL ACCESS: TriStation Protocol UDP 1502 Ping & Controller Program Mode Status Check -> PERSISTENCE: TriStation Program Allocation & Triple-Modular Redundant (TMR) Validation Check",
      "storyMappings": [
        {
          "storyTerm": "Forged Inspector Jacket",
          "technicalTerm": "Masqueraded Py2EXE Binary (trilog.exe) Bundling TriStation Scripts",
          "tone": "rose"
        },
        {
          "storyTerm": "Brass Maintenance Key Unlocked",
          "technicalTerm": "Triconex Front-Panel Physical Keyswitch Left in PROGRAM Mode",
          "tone": "amber"
        },
        {
          "storyTerm": "Emergency Fire-Suppression Brain",
          "technicalTerm": "Schneider Electric Triconex Safety Instrumented System (UDP/1502)",
          "tone": "sky"
        },
        {
          "storyTerm": "Three Twin Safety Judges",
          "technicalTerm": "Triple-Modular Redundant (TMR) Processor Voting & Fault Alarm",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ics-trisis-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Forged Inspector Jacket",
          "subtitle": "Masqueraded Py2EXE Binary (trilog.exe) Bundling TriStation…",
          "tone": "rose"
        },
        {
          "id": "ics-trisis-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Brass Maintenance Key Unlocked",
          "subtitle": "Triconex Front-Panel Physical Keyswitch Left in PROGRAM Mode",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Same Logo",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Masqueraded Py2EXE Binary (trilog.exe) & Library.zip Extraction on SIS Workstation",
          "storyExcerpt": "At the safety engineer’s workbench, the intruder unpacks a counterfeit diagnostic clipboard bearing the same logo as the factory safety tool, concealing four custom helper blueprints stitched neatly…",
          "technicalParallel": "Under the hood, the observed step executes sigcheck.exe -u -e C:\\Triconex\\Tristation\\trilog.exe (which Captures or inspects industrial control system , ICS/OT protocol frames and engineering workstation…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Test Tap",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "TriStation Protocol UDP 1502 Ping & Controller Program Mode Status Check",
          "storyExcerpt": "Using the counterfeit clipboard, the intruder sends a polite test tap down the safety cabinet intercom and inspects the cabinet’s front-panel status light, confirming that a maintenance crew accidentally…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r sis-network.pcap -Y \"udp.port == 1502\" -T fields -e ip.src -e ip.dst -e data.data (which executes the technical command / telemetry directive , tshark…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Fire-suppression",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "TriStation Program Allocation & Triple-Modular Redundant (TMR) Validation Check",
          "storyExcerpt": "Seeing the cabinet unlocked, the intruder slides custom replacement rules into the emergency brain’s memory slots, but the three twin safety judges constantly vote on every instruction and instantly slam…",
          "technicalParallel": "Under the hood, the observed step executes snort -c /etc/snort/tristation-cisa-17-356.rules -r sis-network.pcap (which Captures or inspects industrial control system , ICS/OT protocol frames and…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Safety Judges",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Vessel",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Brass Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ics-trisis-triton-schneider-triconex-sis-telemetry",
      "sectionKey": "step-1",
      "sceneKind": "ics-trisis-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Masqueraded Py2EXE Binary (trilog.exe) & Library.zip Extraction on SIS Workstation",
      "storyCue": "At the safety engineer’s workbench, the intruder unpacks a counterfeit diagnostic clipboard bearing the same logo as the factory safety tool, concealing four custom helper blueprints stitched neatly inside its backing folder.",
      "technicalCue": "T1036.005 · DEFENSE EVASION — On the Safety Instrumented System engineering workstation, an unauthorized executable named trilog.exe (compiled with Py2EXE and bundling TS_cnames.py, TsHi.py, TsLow.py, and TsBase.py inside…",
      "storyMappings": [
        {
          "storyTerm": "Safety Engineer Workbench",
          "technicalTerm": "Safety Instrumented System (SIS) Engineering Workstation",
          "tone": "sky"
        },
        {
          "storyTerm": "Counterfeit Diagnostic Clipboard",
          "technicalTerm": "Py2EXE-Compiled trilog.exe Impersonating TriStation 1131 Utility",
          "tone": "rose"
        },
        {
          "storyTerm": "Four Custom Helper Blueprints",
          "technicalTerm": "library.zip Modules (TS_cnames.py, TsHi.py, TsLow.py, TsBase.py)",
          "tone": "amber"
        },
        {
          "storyTerm": "Workbench Integrity Check",
          "technicalTerm": "Sysmon Event ID 1 / Unsigned Py2EXE Binary Execution Alert",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-trisis-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Safety Engineer Workbench",
          "subtitle": "Safety Instrumented System (SIS) Engineering Workstation",
          "tone": "sky"
        },
        {
          "id": "ics-trisis-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Counterfeit Diagnostic Clipboard",
          "subtitle": "Py2EXE-Compiled trilog.exe Impersonating TriStation 1131 Utility",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Same Logo",
          "stageTag": "STEP 01 · SETUP",
          "title": "Safety Engineer Workbench",
          "storyExcerpt": "At the safety engineer’s workbench, the intruder unpacks a counterfeit diagnostic clipboard bearing the same logo as the factory safety tool, concealing four custom helper blueprints stitched…",
          "technicalParallel": "Under the hood, the observed step executes sigcheck.exe -u -e C:\\Triconex\\Tristation\\trilog.exe (which Captures or inspects industrial control system , ICS/OT protocol frames and engineering workstation…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Four",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Counterfeit Diagnostic Clipboard",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses counterfeit diagnostic clipboard to advance toward four custom helper blueprints.",
          "technicalParallel": "On the Safety Instrumented System engineering workstation, an unauthorized executable named trilog.exe (compiled with Py2EXE and bundling TS_cnames.py, TsHi.py, TsLow.py, and TsBase.py inside…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Four",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Workbench Integrity Check",
          "storyExcerpt": "Behind the scenes, workbench integrity check captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording MasqueradedBinary=C:\\Triconex\\Tristation\\trilog.exe , Unsigned Py2EXE, BundledPythonModules=TsHi.py, TsLow.py, TsBase.py, TS_cnames.py…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Safety Judges",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Vessel",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Brass Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1036.005"
    },
    "step-2": {
      "scenarioId": "ics-trisis-triton-schneider-triconex-sis-telemetry",
      "sectionKey": "step-2",
      "sceneKind": "ics-trisis-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "TriStation Protocol UDP 1502 Ping & Controller Program Mode Status Check",
      "storyCue": "Using the counterfeit clipboard, the intruder sends a polite test tap down the safety cabinet intercom and inspects the cabinet’s front-panel status light, confirming that a maintenance crew accidentally left the brass safety key turned to the unlocked rewrite setting.",
      "technicalCue": "T1082 · CREDENTIAL ACCESS — The TsLow.py module transmits a UDP port 1502 TriStation connect/ping packet to the Triconex controller and queries the front-panel keyswitch state, verifying whether the physical keyswitch is…",
      "storyMappings": [
        {
          "storyTerm": "Polite Test Tap on Intercom",
          "technicalTerm": "TsLow.py TriStation Connect/Ping Frame on UDP Port 1502",
          "tone": "rose"
        },
        {
          "storyTerm": "Front-Panel Status Light",
          "technicalTerm": "Triconex Controller Mode Status Query Response",
          "tone": "sky"
        },
        {
          "storyTerm": "Brass Key in Unlocked Setting",
          "technicalTerm": "Physical Keyswitch Position = PROGRAM (Permits Logic Writes)",
          "tone": "amber"
        },
        {
          "storyTerm": "Safety Network Monitor",
          "technicalTerm": "OT Passive IDS Detecting Non-Standard UDP/1502 TriStation Traffic",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-trisis-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Polite Test Tap on Intercom",
          "subtitle": "TsLow.py TriStation Connect/Ping Frame on UDP Port 1502",
          "tone": "rose"
        },
        {
          "id": "ics-trisis-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Front-Panel Status Light",
          "subtitle": "Triconex Controller Mode Status Query Response",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Test Tap",
          "stageTag": "STEP 02 · SETUP",
          "title": "Polite Test Tap on Intercom",
          "storyExcerpt": "Using the counterfeit clipboard, the intruder sends a polite test tap down the safety cabinet intercom and inspects the cabinet’s front-panel status light, confirming that a maintenance crew…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r sis-network.pcap -Y \"udp.port == 1502\" -T fields -e ip.src -e ip.dst -e data.data (which executes the technical command / telemetry directive , tshark…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Front-Panel Status Light",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses front-panel status light to advance toward brass key in unlocked setting.",
          "technicalParallel": "The TsLow.py module transmits a UDP port 1502 TriStation connect/ping packet to the Triconex controller and queries the front-panel keyswitch state, verifying whether the physical keyswitch is left in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Test Tap",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Safety Network Monitor",
          "storyExcerpt": "Behind the scenes, safety network monitor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 1502 (recording Protocol=Triconex TriStation , UDP 1502, CommandCode=GetCpStatus , Controller Status Query, KeyswitchPosition=PROGRAM Mode , Remote Write Permitted under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Safety Judges",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Vessel",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Brass Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1082"
    },
    "step-3": {
      "scenarioId": "ics-trisis-triton-schneider-triconex-sis-telemetry",
      "sectionKey": "step-3",
      "sceneKind": "ics-trisis-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "TriStation Program Allocation & Triple-Modular Redundant (TMR) Validation Check",
      "storyCue": "Seeing the cabinet unlocked, the intruder slides custom replacement rules into the emergency brain’s memory slots, but the three twin safety judges constantly vote on every instruction and instantly slam the plant into a safe-state diagnostic fault the moment their memory ledgers diverge.",
      "technicalCue": "T1542 · PERSISTENCE — When an unauthorized program table modification (inject.bin / imain.bin) is transmitted over UDP 1502, the Triconex Triple-Modular Redundant (TMR) processors compare memory state across the…",
      "storyMappings": [
        {
          "storyTerm": "Custom Replacement Rules",
          "technicalTerm": "Unauthorized Program Table Payloads (inject.bin & imain.bin)",
          "tone": "rose"
        },
        {
          "storyTerm": "Emergency Brain Memory Slots",
          "technicalTerm": "Triconex Controller Program Memory Allocation over UDP/1502",
          "tone": "sky"
        },
        {
          "storyTerm": "Three Twin Safety Judges Voting",
          "technicalTerm": "Triple-Modular Redundant (TMR) 3-Leg Memory Consistency Check",
          "tone": "amber"
        },
        {
          "storyTerm": "Safe-State Diagnostic Fault",
          "technicalTerm": "Triconex Safe-State Halt & Hardware Validation Mismatch Log",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ics-trisis-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Custom Replacement Rules",
          "subtitle": "Unauthorized Program Table Payloads (inject.bin & imain.bin)",
          "tone": "rose"
        },
        {
          "id": "ics-trisis-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Emergency Brain Memory Slots",
          "subtitle": "Triconex Controller Program Memory Allocation over UDP/1502",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. But Twin",
          "stageTag": "STEP 03 · SETUP",
          "title": "Custom Replacement Rules",
          "storyExcerpt": "Seeing the cabinet unlocked, the intruder slides custom replacement rules into the emergency brain’s memory slots, but the three twin safety judges constantly vote on every instruction and…",
          "technicalParallel": "Under the hood, the observed step executes snort -c /etc/snort/tristation-cisa-17-356.rules -r sis-network.pcap (which Captures or inspects industrial control system , ICS/OT protocol frames and…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Twin",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Emergency Brain Memory Slots",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses emergency brain memory slots to advance toward three twin safety judges voting.",
          "technicalParallel": "When an unauthorized program table modification (inject.bin / imain.bin) is transmitted over UDP 1502, the Triconex Triple-Modular Redundant (TMR) processors compare memory state across the three…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Twin",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Safe-State Diagnostic Fault",
          "storyExcerpt": "Behind the scenes, safe-state diagnostic fault captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 35601 (recording AlertSignature=CISA ICS-ALERT-17-356-01 , TRISIS / TRITON TriStation Write, TargetArchitecture=MPC860 PowerPC Triple-Modular Redundant , TMR…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Safety Judges",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Plant Vessel",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Brass Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1542"
    }
  }
};
