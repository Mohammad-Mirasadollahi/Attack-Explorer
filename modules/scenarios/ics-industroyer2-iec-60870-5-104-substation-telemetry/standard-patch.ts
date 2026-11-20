import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
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
  };
