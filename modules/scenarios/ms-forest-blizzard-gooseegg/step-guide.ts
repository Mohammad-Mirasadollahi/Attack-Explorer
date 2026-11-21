import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-forest-blizzard-gooseegg',
    briefing: {
      headline: 'Scenario Briefing: Forest Blizzard (APT28 / Fancy Bear), "GooseEgg" Print Spooler Elevation of Privilege (CVE-2022-38028)',
      storyAnalogy:
        'Imagine a building where the mailroom’s high-privilege Printer Robot (spoolsv.exe, running as SYSTEM) uses a shared ledger (PnPData) to look up which driver helper (mpdwconstr.dll) it should load. Because a flaw lets a regular visitor edit the folder path in that ledger, the attacker changes the ledger to point to their own locker (wayzgoose.dll). When the Printer Robot wakes up, it loads the attacker’s library with full SYSTEM master-key authority.',
      plainSummary:
        'In this scenario (CVE-2022-38028, Microsoft Threat Intel - Forest Blizzard (APT28): Print Spooler CVE-2022-38028 & GooseEgg) on WKS-GOV-03, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: gooseEgg Modifies the Print Driver Registry, then forcing spoolsv.exe to Load the Rogue, then spawning a SYSTEM Command Shell. Steps #1–#3 walk that chain end-to-end by covering GooseEgg Modifies the Print Driver Registry, then Forcing spoolsv.exe to Load the Rogue, then Spawning a SYSTEM Command Shell, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Initial Low-Privilege Foothold), launch the GooseEgg launcher (justice.bat / doit.bat) on Node ③ (Windows Host), exploit the Print Spooler driver store (spoolsv.exe CVE-2022-38028) on Node ④ to load wayzgoose.dll as SYSTEM, and spawn the elevated backdoor toward Node ⑤ while Node ⑥ (Defender / SIEM) captures the driver-store write.',
      documentedAdvisory: 'Microsoft Threat Intelligence Forest Blizzard "GooseEgg" Report (Apr 2024) · CVE-2022-38028 · MITRE T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'GooseEgg Modifies the Print Driver Registry & mpdw-constraints.js to Trigger CVE-2022-38028',
        storyAnalogy:
          'The intruder runs a batch script (doit.bat) that edits the XPS Printer’s instruction sheet (mpdw-constraints.js) so the next time the Printer Service checks its settings, it accidentally unlocks its own protected driver cabinet.',
        simpleExplanation:
          'On WKS-GOV-03.corp.local, starting from a standard low-privilege user session (which cannot install programs or read other users’ passwords), the attacker runs execute.bat which launches justice.exe (also referenced as doit.bat / justice.bat in some GooseEgg packages) to execute the GooseEgg binary. GooseEgg creates a custom printer driver key in the Registry and modifies mpdw-constraints.js (a JavaScript configuration file used by the built-in Microsoft XPS Document Writer printer driver to validate print ticket settings, crafted with oversized data to trigger CVE-2022-38028 when the Print Spooler reads it).',
        howItWorksInPractice:
          'When C:\\Windows\\System32\\spoolsv.exe (which runs as NT AUTHORITY\\SYSTEM) parses the malformed mpdw-constraints.js file inside the DriverStore\\FileRepository directory, a memory corruption / permission flaw (CVE-2022-38028) allows the low-privilege user to overwrite the printer driver’s PnPData / DriverFile path. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (GooseEgg Launcher doit.bat) to Node ④ (spoolsv.exe Print Spooler CVE-2022-38028), and return arrow ⇠#1 corrupting the driver descriptor as SYSTEM.',
        detectionAndEvidence:
          'Monitor file integrity and registry auditing for unauthorized edits to mpdw-constraints.js inside DriverStore\\FileRepository paired with anomalous Print Spooler registry key modifications (the exact CVE-2022-38028 GooseEgg staging signature documented by Microsoft). Correlate Sysmon or Windows Security Event telemetry for T1068 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.001',
        plainTitle: 'Forcing spoolsv.exe (SYSTEM) to Load the Rogue wayzgoose.dll Driver Module',
        storyAnalogy:
          'Now that the printer ledger points to wayzgoose.dll, GooseEgg sends a dummy print job, waking up spoolsv.exe (SYSTEM), which dutifully loads wayzgoose.dll into its own SYSTEM-privileged memory.',
        simpleExplanation:
          'With the driver path redirected by the exploit, GooseEgg drops its companion malicious library (wayzgoose.dll) into a writable folder and sends an RPC print-configuration call to wake up spoolsv.exe. Because spoolsv.exe runs as NT AUTHORITY\\SYSTEM (the highest local operating-system account on Windows), when it calls LoadLibrary() on the registered printer driver, wayzgoose.dll is loaded directly into spoolsv.exe’s memory and executes with full SYSTEM master-key privileges.',
        howItWorksInPractice:
          'Instead of injecting memory into a SYSTEM process from the outside (which Windows Protected Process Light and EDR memory hooks block), CVE-2022-38028 tricks spoolsv.exe into voluntarily loading wayzgoose.dll as if it were an official Microsoft printer driver. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ loads wayzgoose.dll into spoolsv.exe (NT AUTHORITY\\SYSTEM), and ⇠#2 confirms SYSTEM token acquisition.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoaded): C:\\Windows\\System32\\spoolsv.exe loading an unsigned DLL (wayzgoose*.dll) outside standard signed Microsoft print drivers.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1543.003',
        plainTitle: 'Spawning a SYSTEM Command Shell (who.bat) & Installing a Persistent Service Backdoor',
        storyAnalogy:
          'Running inside the SYSTEM Printer Robot, wayzgoose.dll opens a master-key backdoor service and connects out to the operator’s command center.',
        simpleExplanation:
          'Now executing inside spoolsv.exe as NT AUTHORITY\\SYSTEM, wayzgoose.dll launches the attacker’s post-exploitation script (who.bat, which inherits spoolsv.exe’s SYSTEM security token so every command it runs has total control of the computer), registers a persistent Windows service backdoor, and opens an outbound C2 channel so Forest Blizzard can dump LSASS credentials and move laterally.',
        howItWorksInPractice:
          'In Windows, any child process created via CreateProcess inherits the security token of its parent process by default. However, because a legitimate Print Spooler (spoolsv.exe) should only talk to printers and never spawn cmd.exe or powershell.exe, this parent-child relationship is a classic high-confidence detection signal. In the documented Sysmon EID 1 exchange from DriverStore (pnms009.inf) to spoolsv.exe -> wayzgoose23.dll, spoolsv.exe -> wayzgoose23.dll responds with ACK PID 6240 (confirming that the SPAWN WHO.EXE request succeeded on spoolsv.exe -> wayzgoose23.dll and completing the final execution objective of Microsoft Threat Intel, Forest Blizzard (APT28): Print Spooler CVE-2022-38028 & GooseEgg).',
        diagramAlignment:
          'On the diagram, arrow #3→ spawns the SYSTEM payload from Node ④ (spoolsv.exe) and connects to Node ⑤ (Forest Blizzard C2), while Node ⑥ (SIEM / Defender) triggers a critical alert.',
        detectionAndEvidence:
          'Documented in Sigma Rule proc_creation_win_spoolsv_susp_child_processes & Sysmon EventID 1: ParentImage: C:\\Windows\\System32\\spoolsv.exe spawning cmd.exe or powershell.exe.',
      },
    ],
  };
