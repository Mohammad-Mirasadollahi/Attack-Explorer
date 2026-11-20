import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
