import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'ms-forest-blizzard-gooseegg',
  code: 'CVE-2022-38028',
  name: 'Microsoft Threat Intel — Forest Blizzard (APT28): Print Spooler CVE-2022-38028 & GooseEgg',
  shortSubtitle: 'Microsoft Threat Intelligence · pnms009.inf Driver Store Symlink, GooseEgg (justice.exe) & wayzgoose.dll',
  category: 'MALWARE',
  severity: 'HIGH',
  primaryMitrePhase: 3,
  overview:
    'Published by Microsoft Threat Intelligence (April 2024), Russian state-sponsored actor Forest Blizzard (APT28 / STRONTIUM / Sofacy) deployed a custom post-compromise tool named GooseEgg (execute.bat / justice.exe) to exploit CVE-2022-38028 in the Windows Print Spooler service. GooseEgg modifies permissions on the pnms009.inf printer driver store directory via NTFS symbolic links and deploys a custom JavaScript constraint script that causes spoolsv.exe to load a malicious DLL (wayzgoose23.dll) as NT AUTHORITY\\SYSTEM.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence — Forest Blizzard GooseEgg (CVE-2022-38028) Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1068 (PrivEsc CVE-2022-38028) · T1547.012 (Print Processors) · T1546.015 (COM Hijacking)',
    },
    {
      term: 'GOOSEEGG ARTIFACTS',
      value: 'execute.bat, justice.exe (doit.exe), wayzgoose23.dll & who.exe',
    },
    {
      term: 'TARGET DRIVER STORE',
      value: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_*',
    },
  ],
  nodes: [
    {
      id: 'apt28_foothold_script',
      label: 'GooseEgg Batch Launcher',
      sublabel: 'execute.bat -> justice.exe',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Forest Blizzard (APT28) Post-Compromise Toolset',
        pidOrPort: 'C:\\ProgramData\\execute.bat & justice.exe',
        privilege: 'Standard User Foothold',
        artifacts: [
          'execute.bat (Sets up Registry & Invokes justice.exe)',
          'justice.exe / doit.exe (CVE-2022-38028 Exploit Binary)',
        ],
        description:
          'Initial batch script and GooseEgg executable deployed by Forest Blizzard on a compromised workstation or mail server.',
      },
    },
    {
      id: 'driverstore_pnms009',
      label: 'DriverStore (pnms009.inf)',
      sublabel: 'NTFS Symlink & JS Constraint Script',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows DriverStore FileRepository',
        pidOrPort: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_*',
        privilege: 'Modified DACL via CVE-2022-38028',
        artifacts: [
          'Modified JavaScript Constraint File inside pnms009.inf_amd64_*',
          'Dropped Payload: wayzgoose23.dll',
        ],
        description:
          'Windows Printer DriverStore folder whose permissions are overwritten via CVE-2022-38028 so spoolsv.exe loads wayzgoose23.dll.',
      },
    },
    {
      id: 'spoolsv_system_proc',
      label: 'spoolsv.exe -> wayzgoose23.dll',
      sublabel: 'PID 1984 (NT AUTHORITY\\SYSTEM)',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Windows Print Spooler Service',
        pidOrPort: 'PID 1984 · C:\\Windows\\System32\\spoolsv.exe',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'Sysmon EID 7: spoolsv.exe loads wayzgoose23.dll',
          'Spawns who.exe (Four-Command Backdoor)',
        ],
        description:
          'Privileged Windows Print Spooler service coerced into loading Forest Blizzard wayzgoose23.dll with SYSTEM privileges.',
      },
    },
    {
      id: 'who_exe_backdoor',
      label: 'who.exe SYSTEM Backdoor',
      sublabel: 'PID 6240 · COM Hijack & Task Persistence',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'GooseEgg Embedded Launcher Application (who.exe)',
        pidOrPort: 'PID 6240 (Spawned by wayzgoose23.dll)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'CLSID {7D096C5F-AC08-4F1F-BEB7-5C22C517CE39} COM Hijack',
          'Scheduled Task: \\Microsoft\\Windows\\Defrag\\ScheduledDefrag',
        ],
        description:
          'GooseEgg secondary payload (who.exe) supporting 4 commands: spawn SYSTEM shell, execute arbitrary binary, test status, and establish COM/Scheduled Task persistence.',
      },
    },
    {
      id: 'mde_defender_siem',
      label: 'Microsoft Defender XDR',
      sublabel: 'Sysmon EID 1, 7, 11 & 13',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Microsoft Defender for Endpoint & Sentinel',
        pidOrPort: 'Win32/Hive.ZY & HackTool:Win64/GooseEgg',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: HackTool:Win64/GooseEgg!MTB',
          'Alert: spoolsv.exe Loading Unsigned DLL from DriverStore',
        ],
        description:
          'Detects modifications inside DriverStore\\FileRepository\\pnms009.inf* and spoolsv.exe loading wayzgoose23.dll.',
      },
    },
  ],
  processTree: [
    {
      pid: 4512,
      ppid: 3100,
      name: 'justice.exe (GooseEgg)',
      commandLine: 'C:\\ProgramData\\justice.exe -d C:\\ProgramData\\wayzgoose23.dll',
      user: 'CORP\\v.parker',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateSymbolicLinkW',
        'OpenPrinterW',
        'WriteFile("pnms009.inf_amd64_.../MPDW-constraints.js")',
      ],
    },
    {
      pid: 1984,
      ppid: 680,
      name: 'spoolsv.exe',
      commandLine: 'C:\\Windows\\System32\\spoolsv.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: ['LoadLibraryW("wayzgoose23.dll")', 'CreateProcessAsUserW("who.exe")'],
    },
    {
      pid: 6240,
      ppid: 1984,
      name: 'who.exe',
      commandLine: 'C:\\ProgramData\\who.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['RegSetValueExW("InprocServer32")', 'CreateProcessW("cmd.exe")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'GOOSEEGG SYMLINK & PNMS009.INF DRIVERSTORE TAMPERING',
      subtitle: 'justice.exe exploits CVE-2022-38028 to modify MPDW-constraints.js',
      description:
        'As detailed by Microsoft Threat Intelligence, Forest Blizzard runs execute.bat to launch justice.exe (GooseEgg). The exploit creates NTFS symbolic links and triggers CVE-2022-38028 in the Print Spooler, making the C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_* directory writable to a standard user and overwriting its JavaScript constraint script.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['apt28_foothold_script', 'driverstore_pnms009', 'mde_defender_siem'],
      compromisedNodeIds: ['driverstore_pnms009'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2022-38028 (Windows Print Spooler EoP)' },
        { term: 'EXPLOIT BINARY', value: 'justice.exe / doit.exe (HackTool:Win64/GooseEgg)' },
        { term: 'MODIFIED PATH', value: 'DriverStore\\FileRepository\\pnms009.inf_amd64_*\\MPDW-constraints.js' },
      ],
    },
    {
      index: 2,
      title: 'SPOOLSV.EXE LOADS WAYZGOOSE23.DLL AS SYSTEM',
      subtitle: 'Print Spooler evaluates tampered JS constraint and loads malicious DLL',
      description:
        'When spoolsv.exe processes the printer constraint script, it loads the attacker-supplied wayzgoose23.dll from the DriverStore folder under the NT AUTHORITY\\SYSTEM security context.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1547.012',
      mitreTechniqueName: 'Boot or Logon Autostart Execution: Print Processors',
      activeNodeIds: ['driverstore_pnms009', 'spoolsv_system_proc', 'mde_defender_siem'],
      compromisedNodeIds: ['driverstore_pnms009', 'spoolsv_system_proc'],
      keySpecs: [
        { term: 'HOST SERVICE', value: 'C:\\Windows\\System32\\spoolsv.exe (NT AUTHORITY\\SYSTEM)' },
        { term: 'MALICIOUS DLL', value: 'wayzgoose23.dll (Loaded via MPDW-constraints.js)' },
        { term: 'SYSMON EVENT', value: 'Sysmon Event ID 7 (Unsigned DLL loaded by spoolsv.exe)' },
      ],
    },
    {
      index: 3,
      title: 'WHO.EXE SYSTEM BACKDOOR & COM SERVER HIJACK',
      subtitle: 'Spawning SYSTEM command shell and registering ScheduledDefrag COM hijack',
      description:
        'wayzgoose23.dll launches who.exe as SYSTEM. who.exe establishes persistence by modifying the ScheduledDefrag task and hijacking a COM server CLSID in HKLM\\SOFTWARE\\Classes\\CLSID\\, then spawns a SYSTEM command shell for credential theft and network espionage.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1546.015',
      mitreTechniqueName: 'Event Triggered Execution: Component Object Model Hijacking',
      activeNodeIds: ['spoolsv_system_proc', 'who_exe_backdoor', 'mde_defender_siem'],
      compromisedNodeIds: ['driverstore_pnms009', 'spoolsv_system_proc', 'who_exe_backdoor'],
      keySpecs: [
        { term: 'BACKDOOR BINARY', value: 'who.exe (Spawned by spoolsv.exe as SYSTEM)' },
        { term: 'PERSISTENCE', value: 'COM Server InprocServer32 Hijack + ScheduledDefrag Task' },
        { term: 'THREAT ACTOR', value: 'Forest Blizzard (APT28 / GRU Unit 26165)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ms-fb-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:04:15.202',
      sourceNodeId: 'apt28_foothold_script',
      targetNodeId: 'driverstore_pnms009',
      sourceLabel: 'justice.exe (PID 4512)',
      targetLabel: 'DriverStore\\pnms009.inf',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11',
      shortAction: 'WRITE WAYZGOOSE.DLL',
      info: 'Image=C:\\ProgramData\\justice.exe TargetFilename=C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_...\\wayzgoose23.dll',
      sizeOrCode: 'FileCreate',
      severity: 'HIGH',
      mitreId: 'T1068',
      explanation:
        'Microsoft Threat Intelligence identified GooseEgg writing wayzgoose.dll and modifying JavaScript constraint files inside the pnms009.inf DriverStore repository.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
    <Computer>WKS-GOV-03.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\ProgramData\\justice.exe</Data>
    <Data Name="TargetFilename">C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_3108b2c4\\wayzgoose23.dll</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Forest Blizzard GooseEgg File Creation in pnms009.inf DriverStore',
        ruleCode: `title: Forest Blizzard GooseEgg CVE-2022-38028 DriverStore Modification
logsource:
  category: file_event
  product: windows
detection:
  selection:
    TargetFilename|contains: '\\DriverStore\\FileRepository\\pnms009.inf'
    TargetFilename|endswith:
      - '.dll'
      - '.js'
  filter_system:
    Image|endswith:
      - '\\drvinst.exe'
      - '\\TiWorker.exe'
  condition: selection and not filter_system
level: critical`,
        mitigation:
          'Apply the October 2022 Windows security update for CVE-2022-38028 and disable the Print Spooler service on servers that do not require printing.',
      },
    },
    {
      id: 'ms-fb-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:04:16.810',
      sourceNodeId: 'driverstore_pnms009',
      targetNodeId: 'spoolsv_system_proc',
      sourceLabel: 'pnms009.inf DriverStore',
      targetLabel: 'spoolsv.exe (PID 1984)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7',
      shortAction: 'SPOOLSV LOAD DLL',
      info: 'Image=C:\\Windows\\System32\\spoolsv.exe ImageLoaded=...\\pnms009.inf_amd64_3108b2c4\\wayzgoose23.dll Signed=false',
      sizeOrCode: 'SYSTEM Load',
      severity: 'CRITICAL',
      mitreId: 'T1547.012',
      explanation:
        'spoolsv.exe loading an unsigned DLL (wayzgoose23.dll) from the pnms009.inf DriverStore folder grants Forest Blizzard immediate SYSTEM code execution.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>WKS-GOV-03.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\spoolsv.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\System32\\DriverStore\\FileRepository\\pnms009.inf_amd64_3108b2c4\\wayzgoose23.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Print Spooler (spoolsv.exe) Loading Unsigned DLL from DriverStore',
        ruleCode: `title: Spoolsv Loading Unsigned DLL (CVE-2022-38028 GooseEgg)
logsource:
  category: image_load
  product: windows
detection:
  selection:
    Image|endswith: '\\spoolsv.exe'
    ImageLoaded|contains: '\\DriverStore\\FileRepository\\pnms009.inf'
    Signed: 'false'
  condition: selection
level: critical`,
        mitigation:
          'Block unsigned DLL loads inside spoolsv.exe via Attack Surface Reduction (ASR) rules and audit DriverStore integrity.',
      },
    },
    {
      id: 'ms-fb-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:04:17.445',
      sourceNodeId: 'spoolsv_system_proc',
      targetNodeId: 'who_exe_backdoor',
      sourceLabel: 'spoolsv.exe (SYSTEM)',
      targetLabel: 'who.exe (PID 6240)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'SPAWN WHO.EXE',
      info: 'ParentImage=C:\\Windows\\System32\\spoolsv.exe Image=C:\\ProgramData\\who.exe User=NT AUTHORITY\\SYSTEM',
      sizeOrCode: 'PID 6240',
      severity: 'CRITICAL',
      mitreId: 'T1546.015',
      explanation:
        'spoolsv.exe spawning an executable (who.exe) out of C:\\ProgramData\\ confirms successful privilege escalation via GooseEgg.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>WKS-GOV-03.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6240</Data>
    <Data Name="Image">C:\\ProgramData\\who.exe</Data>
    <Data Name="ParentProcessId">1984</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\spoolsv.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Print Spooler Spawning Suspicious Child Process (GooseEgg who.exe)',
        ruleCode: `title: Suspicious Child Process of Spoolsv.exe
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\spoolsv.exe'
    Image|contains:
      - '\\ProgramData\\'
      - '\\Users\\Public\\'
      - '\\Windows\\Temp\\'
  condition: selection
level: critical`,
        mitigation:
          'Isolate any endpoint where spoolsv.exe spawns a child process from C:\\ProgramData\\ or C:\\Windows\\Temp\\.',
      },
    },
  ],
};
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
          'Monitor file integrity and registry auditing for unauthorized edits to mpdw-constraints.js inside DriverStore\\FileRepository paired with anomalous Print Spooler registry key modifications (the exact CVE-2022-38028 GooseEgg staging signature documented by Microsoft). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1068 (pairing parent/child process and destination fields) and contain the offending session.',
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
