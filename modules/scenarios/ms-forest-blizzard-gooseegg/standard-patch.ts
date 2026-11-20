import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an ordinary office employee who wants master building keys without triggering front-door alarms. The employee edits a tiny text helper file tucked inside the official print-shop cabinet so the next time the building print foreman wakes up, the foreman automatically loads a rigged counterfeit print module with full building-master authority, unlocking a permanent secret back-office command room.',
      storyMappings: [
        {
          storyTerm: 'Editing a tiny text helper inside the official print-shop cabinet',
          technicalTerm: 'GooseEgg modifying mpdw-constraints.js in DriverStore and Print Spooler registry keys (CVE-2022-38028)',
          tone: 'amber',
        },
        {
          storyTerm: 'Print foreman loading a rigged counterfeit print module',
          technicalTerm: 'spoolsv.exe (SYSTEM) executing unsigned wayzgoose.dll via JavaScript constraint trigger',
          tone: 'sky',
        },
        {
          storyTerm: 'Unlocking a secret back-office command room with master keys',
          technicalTerm: 'spoolsv.exe spawning SYSTEM cmd.exe (who.bat) and installing persistent backdoor',
          tone: 'rose',
        },
        {
          storyTerm: 'Escalating from an ordinary office desk to full building authority',
          technicalTerm: 'Local Privilege Escalation (LPE) from standard user to NT AUTHORITY\\SYSTEM by APT28',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Running from a standard low-privilege user desk, the GooseEgg tool slips a crafted redirection into the print-driver registry shelf and alters a built-in JavaScript print-rule helper inside the system driver cabinet.',
        storyMappings: [
          {
            storyTerm: 'Built-in JavaScript print-rule helper',
            technicalTerm: 'mpdw-constraints.js located inside C:\\Windows\\System32\\DriverStore\\FileRepository',
            tone: 'amber',
          },
          {
            storyTerm: 'Crafted redirection on the print-driver registry shelf',
            technicalTerm: 'Anomalous Print Spooler registry edits exploiting CVE-2022-38028',
            tone: 'sky',
          },
          {
            storyTerm: 'Low-privilege local elevation tool',
            technicalTerm: 'Forest Blizzard (APT28) GooseEgg post-exploitation launcher',
            tone: 'rose',
          },
          {
            storyTerm: 'Setting the trap for the privileged foreman',
            technicalTerm: 'Staging malicious JavaScript constraints evaluated by SYSTEM spoolsv.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor file integrity and registry auditing for unauthorized edits to mpdw-constraints.js inside DriverStore\\FileRepository paired with anomalous Print Spooler registry key modifications (the exact CVE-2022-38028 GooseEgg staging signature documented by Microsoft).',
      },
      2: {
        storyAnalogy:
          'When the Print Spooler foreman runs under supreme building authority to evaluate the altered print rules, it obediently loads the attacker unsigned counterfeit driver right into its own master-keyed memory room.',
        storyMappings: [
          {
            storyTerm: 'Print Spooler foreman under supreme building authority',
            technicalTerm: 'C:\\Windows\\System32\\spoolsv.exe running as NT AUTHORITY\\SYSTEM',
            tone: 'amber',
          },
          {
            storyTerm: 'Unsigned counterfeit driver loaded into memory',
            technicalTerm: 'Rogue wayzgoose.dll (wayzgoose*.dll) mapped outside signed Microsoft print drivers',
            tone: 'sky',
          },
          {
            storyTerm: 'Crossing the privilege boundary silently',
            technicalTerm: 'Standard user code executing inside Ring-3 SYSTEM service context',
            tone: 'rose',
          },
          {
            storyTerm: 'Module watchman catching the foreign part',
            technicalTerm: 'Sysmon EventID 7 (ImageLoaded) alerting on spoolsv.exe loading unsigned wayzgoose*.dll',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 7 (Image Loaded recording DLL signatures and image paths) when C:\\Windows\\System32\\spoolsv.exe loads any unsigned DLL such as wayzgoose*.dll located outside standard signed Microsoft print driver paths.',
      },
      3: {
        storyAnalogy:
          'Now holding master keys inside the print foreman\'s office, the rogue module launches an elevated command list to plant a durable secret side door and harvest badges across the compromised building.',
        storyMappings: [
          {
            storyTerm: 'Elevated command list launched from the print room',
            technicalTerm: 'spoolsv.exe spawning cmd.exe /c who.bat or powershell.exe as SYSTEM',
            tone: 'amber',
          },
          {
            storyTerm: 'Durable secret side door planted in the building',
            technicalTerm: 'Persistent SYSTEM-level execution enabling credential theft and lateral movement',
            tone: 'sky',
          },
          {
            storyTerm: 'Classic suspicious parent-child alarm',
            technicalTerm: 'Sigma rule proc_creation_win_spoolsv_susp_child_processes firing on Sysmon EventID 1',
            tone: 'rose',
          },
          {
            storyTerm: 'Immediate containment verification',
            technicalTerm: 'Disabling unnecessary Print Spooler services and patching CVE-2022-38028',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enforce Sigma rule proc_creation_win_spoolsv_susp_child_processes on Sysmon EventID 1 (Process Creation parent-child monitoring) alerting whenever C:\\Windows\\System32\\spoolsv.exe spawns cmd.exe, powershell.exe, or batch scripts such as who.bat.',
      },
    },
  };
