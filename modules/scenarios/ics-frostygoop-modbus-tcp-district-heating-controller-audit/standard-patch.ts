import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
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
  };
