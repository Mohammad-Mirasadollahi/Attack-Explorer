import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
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
  };
