import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a bank heist crew that replaces slow human lockpickers with a coordinated swarm of high-speed robotic arms controlled by one central planner. Instead of inventing a brand-new laser cutter, the master planner dispatches eight worker robots that test every door handle in parallel, wedge open a service window, collect forged master vouchers, and sprint to the upstairs key vault in under fifteen minutes, forcing the building’s automated defense grid to slam down steel blast doors and shred compromised badges instantly because waiting for a human guard would be far too late.',
      storyMappings: [
        {
          storyTerm: 'Master Planner & Eight Worker Robots',
          technicalTerm: 'ARTEX Go + Next.js Multi-Agent LLM Planner-Worker Framework',
          tone: 'rose',
        },
        {
          storyTerm: 'Testing Every Door Handle in Parallel',
          technicalTerm: 'Autonomous nmap/curl Recon & Storm-0940 Distributed Password Spray',
          tone: 'amber',
        },
        {
          storyTerm: 'Service Window & Forged Vouchers',
          technicalTerm: 'Machine-Speed Web Shell (T1505.003) & RC4 Kerberoasting (etype 0x17)',
          tone: 'sky',
        },
        {
          storyTerm: 'Automated Steel Blast Doors',
          technicalTerm: 'Microsoft Defender XDR Automatic Attack Disruption & Session Revoke',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the start of the raid, the central robotic dispatcher hands out parallel checklists to a team of mechanical scouts that sweep the perimeter walls and gently test common door codes across dozens of staff entrances so the instant one lock clicks open, the next robot is already moving.',
        storyMappings: [
          {
            storyTerm: 'Central Robotic Dispatcher',
            technicalTerm: 'ARTEX Go Planner Server (artex-server) & Next.js Operator Console',
            tone: 'rose',
          },
          {
            storyTerm: 'Mechanical Scouts Sweeping Walls',
            technicalTerm: 'Autonomous Worker Agents Running Parallel nmap -sV & curl Probing',
            tone: 'amber',
          },
          {
            storyTerm: 'Gently Testing Staff Door Codes',
            technicalTerm: 'Storm-0940 Low-and-Slow Distributed Entra ID Password Spray',
            tone: 'sky',
          },
          {
            storyTerm: 'Smart Entrance Lockout',
            technicalTerm: 'FIDO2/Passkey MFA, Entra ID Smart Lockout & Risky Sign-In Blocking',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Without pausing for any human review, the central dispatcher reads the first unlocked door code and immediately sends a second robot to prop open a hidden maintenance window and request weak older-style ticket stubs inside the lobby within minutes, compressing days of manual burglary into seconds.',
        storyMappings: [
          {
            storyTerm: 'Zero-Delay Robot Handoff',
            technicalTerm: 'LLM Planner Parsing Valid Credentials & Dispatching Lateral Worker',
            tone: 'amber',
          },
          {
            storyTerm: 'Propping Open Maintenance Window',
            technicalTerm: 'Obfuscated ASPX Web Shell Drop Under IIS w3wp.exe (T1505.003)',
            tone: 'rose',
          },
          {
            storyTerm: 'Weak Older-Style Ticket Stubs',
            technicalTerm: 'Automated SPN Discovery & RC4 Kerberoasting (EventID 4769, 0x17)',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated Server Surface Block',
            technicalTerm: 'Defender ASR Rules (Block Web Shell & LSASS) & AES-Only Kerberos',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Five minutes later, the cloud scout robot races straight to the upstairs master key safe to scoop out high-value secrets, only for the building’s automated defense grid to spot three rapid alarms on the same badge within a tight window, lock the workstation behind steel doors, and shred the badge automatically.',
        storyMappings: [
          {
            storyTerm: 'Upstairs Master Key Safe',
            technicalTerm: 'Azure Key Vault Targeted by Rapid KeyVaultGetSecret Enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Three Rapid Alarms on Same Badge',
            technicalTerm: 'Defender XDR KQL Multi-Domain Alert Velocity Burst Correlation',
            tone: 'amber',
          },
          {
            storyTerm: 'Slamming Steel Blast Doors',
            technicalTerm: 'Automatic Attack Disruption Isolating Endpoint via sense.exe',
            tone: 'emerald',
          },
          {
            storyTerm: 'Shredding Compromised Badge',
            technicalTerm: 'Automated Entra ID User Containment & Active Session Revocation',
            tone: 'rose',
          },
        ],
      },
    },
  };
