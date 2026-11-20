import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
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
  };
