import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglary crew that breaks in through a cracked front-door security gateway, scans every hallway to ship boxes of files out to a public cloud storage locker, copies a compact padlocking cartridge onto every office desk using an automated list of room numbers, and then locks every cabinet while printing out ransom demands straight through every office paper printer across the building.',
      storyMappings: [
        {
          storyTerm: 'Cracked front-door gateway and cloud storage locker shipment',
          technicalTerm: 'Citrix NetScaler ADC breach, NetScan discovery, and MEGASync cloud exfiltration',
          tone: 'amber',
        },
        {
          storyTerm: 'Copying a padlocking cartridge down an automated list of rooms',
          technicalTerm: 'WMIC /node:@"hosts.txt" mass DLL staging and rundll32.exe execution',
          tone: 'sky',
        },
        {
          storyTerm: 'Fast modern locks across every office cabinet',
          technicalTerm: 'INC Ransom / Lynx AES-128-CTR and Curve25519 file encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Printing ransom demands straight through every office paper printer',
          technicalTerm: 'Desktop wallpaper change plus physical network printer ransom note printing',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping past an unpatched edge access gateway into the corporate interior, the crew runs a swift floor scanner to chart every active room and uploads stolen corporate files directly to an outside consumer cloud locker.',
        storyMappings: [
          {
            storyTerm: 'Unpatched edge access gateway',
            technicalTerm: 'Exploited Citrix NetScaler ADC or VPN perimeter appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Swift floor scanner charting every active room',
            technicalTerm: 'NetScan discovering live hosts, shares, and IP lists saved to hosts.txt',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside consumer cloud locker',
            technicalTerm: 'MEGASync client exfiltrating staged corporate documents to Mega.nz',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual-brand criminal family',
            technicalTerm: 'Shared INC Ransom and Lynx codebase and affiliate playbooks',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Holding a neat roster of every room number in the building, the operator copies a compact padlocking cartridge into each room temporary closet and uses the building built-in remote runner to trigger every cartridge across the entire roster in one single command.',
        storyMappings: [
          {
            storyTerm: 'Neat roster of every room number',
            technicalTerm: 'Target host list hosts.txt fed into WMIC /node:@"hosts.txt"',
            tone: 'amber',
          },
          {
            storyTerm: 'Compact padlocking cartridge placed in each closet',
            technicalTerm: 'inc.dll or lynx.dll copied to \\\\<host>\\C$\\Windows\\Temp\\',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in remote runner triggering every cartridge',
            technicalTerm: 'WMIC process call create invoking signed rundll32.exe to execute the DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Single-command fleet-wide launch',
            technicalTerm: 'Rapid horizontal detonation across Windows workstations and servers',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As modern elliptical-key padlocks clamp down on every document, the crew flips every monitor screen to a stark warning banner and even sends their ransom letter straight to every networked paper printer in the hallways so nobody can miss the takeover.',
        storyMappings: [
          {
            storyTerm: 'Modern elliptical-key padlocks',
            technicalTerm: 'AES-128-CTR symmetric file encryption paired with Curve25519 key exchange',
            tone: 'amber',
          },
          {
            storyTerm: 'Stark warning banner across every monitor',
            technicalTerm: 'Automated Windows desktop wallpaper replacement announcing compromise',
            tone: 'sky',
          },
          {
            storyTerm: 'Ransom letters pouring out of hallway paper printers',
            technicalTerm: 'Physical network printer job dispatch printing extortion notices on paper',
            tone: 'rose',
          },
          {
            storyTerm: 'Shared cryptographic DNA',
            technicalTerm: 'Identical encryption workflow shared between INC Ransom and its Lynx rebrand',
            tone: 'emerald',
          },
        ],
      },
    },
  };
