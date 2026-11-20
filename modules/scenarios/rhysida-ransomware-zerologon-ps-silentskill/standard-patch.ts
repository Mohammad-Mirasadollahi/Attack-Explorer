import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an organized heist crew preparing a museum takeover in three calculated phases. First, they prop open a hidden basement bulkhead door and punch a custom hole through the museum security fence; next, they run an automated checklist script that unplugs over two hundred guard stations and cameras while propping the remote-entry latch open; finally, they roll a multi-lane mechanical padlocking press down every gallery and hang a bright red warning poster over every wall display.',
      storyMappings: [
        {
          storyTerm: 'Hidden bulkhead door punching a hole through the security fence',
          technicalTerm: 'PortStarter Golang backdoor adding Windows Firewall allow rules via netsh.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Automated script unplugging two hundred guard stations and cameras',
          technicalTerm: 'SilentKill PowerShell script (g.ps1) unhooking AMSI, killing 200+ services, and enabling RestrictedAdmin',
          tone: 'sky',
        },
        {
          storyTerm: 'Multi-lane mechanical padlocking press rolled across every gallery',
          technicalTerm: 'psexec.exe -d -s deploying MinGW rhysida.exe with LibTomCrypt AES-256-CTR encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Bright red warning poster hung over every wall display',
          technicalTerm: 'Desktop wallpaper replacement, .rhysida extensions, and CriticalBreachDetected.pdf',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after slipping inside the perimeter, the crew hides a compact custom courier engine inside a shared utility closet and commands the building own firewall guard to cut a fresh permanent doorway for incoming traffic.',
        storyMappings: [
          {
            storyTerm: 'Compact custom courier engine in a utility closet',
            technicalTerm: 'PortStarter custom Golang backdoor staged under C:\\ProgramData',
            tone: 'amber',
          },
          {
            storyTerm: 'Commanding the firewall guard to cut a fresh doorway',
            technicalTerm: 'netsh.exe advfirewall firewall add rule opening attacker listening ports',
            tone: 'sky',
          },
          {
            storyTerm: 'Building perimeter fence audit log',
            technicalTerm: 'Windows Firewall EventID 2004 logging unauthorized rule additions',
            tone: 'rose',
          },
          {
            storyTerm: 'Cross-crew shared burglary tool',
            technicalTerm: 'Shared PortStarter backdoor infrastructure linking Rhysida and Vice Society',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation) when unsigned Golang binaries in C:\\ProgramData spawn netsh.exe advfirewall firewall add rule alongside Windows Firewall Operational EventID 2004 (which records every newly inserted host firewall allow rule).',
      },
      2: {
        storyAnalogy:
          'Before locking a single vault, the crew fires a sweeping silence script that first blinds the script-inspection window, switches off more than two hundred database and backup services so every file lock releases, and alters a security bolt so stolen badge hashes work straight at remote desks.',
        storyMappings: [
          {
            storyTerm: 'Blinding the script-inspection window first',
            technicalTerm: 'SilentKill (g.ps1) patching AMSI in memory before executing payload commands',
            tone: 'amber',
          },
          {
            storyTerm: 'Switching off two hundred database and backup services',
            technicalTerm: 'PowerShell service-termination loops stopping SQL, backup, and AV services',
            tone: 'sky',
          },
          {
            storyTerm: 'Altering the security bolt for stolen badge hashes',
            technicalTerm: 'Registry write modifying HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\DisableRestrictedAdmin',
            tone: 'rose',
          },
          {
            storyTerm: 'Verbatim transcript caught by script cameras',
            technicalTerm: 'PowerShell Operational EventID 4104 capturing SilentKill deobfuscated commands',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor PowerShell EventID 4104 (ScriptBlock Logging recording full runtime script contents) for SilentKill mass service-termination loops correlated with Sysmon EventID 13 (RegistryValueSet) modifications to Lsa\\DisableRestrictedAdmin (enabling Pass-the-Hash RDP).',
      },
      3: {
        storyAnalogy:
          'Pushing their heavy padlocking press down every hallway simultaneously via the remote-service tool, the crew runs parallel locking gears across every office cabinet, stamps a bright ransom notice onto every screen, and drops printed extortion booklets in every folder.',
        storyMappings: [
          {
            storyTerm: 'Pushing the padlocking press down every hallway',
            technicalTerm: 'Domain-wide execution via psexec.exe -d -s launching 64-bit MinGW rhysida.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Parallel locking gears sealing every cabinet',
            technicalTerm: 'Multi-threaded statically linked LibTomCrypt AES-256-CTR file encryption',
            tone: 'sky',
          },
          {
            storyTerm: 'Bright ransom notice stamped on every screen',
            technicalTerm: 'Forced desktop wallpaper lock paired with .rhysida file extensions',
            tone: 'rose',
          },
          {
            storyTerm: 'Printed extortion booklets dropped in every folder',
            technicalTerm: 'CriticalBreachDetected.pdf ransom demand files generated across directories',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy YARA memory and file signatures matching statically linked LibTomCrypt constants inside MinGW-compiled PE binaries (identifying Rhysida encryptors even when repacked) paired with EDR alerts on CriticalBreachDetected.pdf and rapid .rhysida renames.',
      },
    },
  };
