import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a street-level burglary crew that slips into an office through an open desk door or booby-trapped attachment, opens a hidden relay pipe and borrows a signed technician wrench to disable security guards, then climbs past the desk confirmation prompt to tear down the firewall, snap the emergency-recovery levers off the wall, and clamp heavy locks onto every cabinet while popping open a full-screen ransom placard on every desk.',
      storyMappings: [
        {
          storyTerm: 'Hidden relay pipe and signed technician wrench disabling guards',
          technicalTerm: 'SmokeLoader, SystemBC SOCKS5 proxy, and Process Hacker (kprocesshacker.sys) BYOVD',
          tone: 'amber',
        },
        {
          storyTerm: 'Climbing past confirmation prompts to tear down fences and recovery levers',
          technicalTerm: 'UAC bypass, netsh firewall disablement, and vssadmin / bcdedit recovery wipe',
          tone: 'sky',
        },
        {
          storyTerm: 'Clamping heavy locks onto small files whole and huge files in chunks',
          technicalTerm: 'Phobos AES-256-CBC encryption renaming files with the .8base extension',
          tone: 'rose',
        },
        {
          storyTerm: 'Popping open a full-screen ransom placard on every desk',
          technicalTerm: 'info.hta HTML Application ransom notice launched via mshta.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping onto a victim workstation through an exposed remote-desktop doorway or poisoned email attachment, a compact delivery agent sets up a quiet relay pipe and deploys a signed system-diagnostics driver to knock out active endpoint guards.',
        storyMappings: [
          {
            storyTerm: 'Compact delivery agent from a poisoned doorway',
            technicalTerm: 'SmokeLoader delivered via exposed RDP or phishing attachments',
            tone: 'amber',
          },
          {
            storyTerm: 'Quiet relay pipe bridging back to operators',
            technicalTerm: 'SystemBC SOCKS5 proxy maintaining persistent C2 tunneling',
            tone: 'sky',
          },
          {
            storyTerm: 'Signed system-diagnostics wrench knocking out guards',
            technicalTerm: 'Abused Process Hacker kernel driver (kprocesshacker.sys) terminating security agents',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing the host before lockdown',
            technicalTerm: 'Initial foothold and defense evasion preparing for Phobos/8Base detonation',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Planting copies of itself inside both the morning startup folder and the master launch registry so it survives reboots, the payload hops past user permission prompts, shuts off the building firewall walls, and cuts off both shadow backups and emergency boot-repair switches.',
        storyMappings: [
          {
            storyTerm: 'Planting copies in the startup folder and launch registry',
            technicalTerm: 'Persistence in %APPDATA%\\...\\Startup and HKLM Run keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Hopping past user permission prompts',
            technicalTerm: 'User Account Control (UAC) bypass elevating to high integrity',
            tone: 'sky',
          },
          {
            storyTerm: 'Shutting off the building firewall walls',
            technicalTerm: 'netsh advfirewall set allprofiles state off disabling host firewall rules',
            tone: 'rose',
          },
          {
            storyTerm: 'Cutting off backups and boot-repair switches',
            technicalTerm: 'Deleting Volume Shadow Copies and disabling Windows recovery via bcdedit',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Sweeping across every non-system drawer on the machine, the Phobos locking engine seals small documents completely and seals giant files rapidly in slices, stamps every locked item with an 8base tag, and pops open an interactive ransom placard right on the desktop.',
        storyMappings: [
          {
            storyTerm: 'Sealing small documents whole and giant files in slices',
            technicalTerm: 'Phobos AES-256-CBC full encryption under 1.5 MB and partial encryption on larger files',
            tone: 'amber',
          },
          {
            storyTerm: 'Stamping every locked item with a branded tag',
            technicalTerm: 'Encrypted files renamed with the .8base suffix and victim identifier',
            tone: 'sky',
          },
          {
            storyTerm: 'Interactive ransom placard popped onto the desktop',
            technicalTerm: 'info.hta HTML Application rendered automatically on infected hosts',
            tone: 'rose',
          },
          {
            storyTerm: 'Shared Phobos criminal family lineage',
            technicalTerm: '8Base affiliate configuration running atop the established Phobos encryptor',
            tone: 'emerald',
          },
        ],
      },
    },
  };
