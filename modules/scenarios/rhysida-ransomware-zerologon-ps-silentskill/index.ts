import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'rhysida-ransomware-zerologon-ps-silentskill',
    title: 'Rhysida Ransomware SilentKill PowerShell Preparation, PortStarter & LibTomCrypt AES-CTR (AA23-319A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Rhysida ransomware operators (overlapping Vice Society / DEV-0832) deploy the PortStarter Golang firewall-opening backdoor, execute the SilentKill PowerShell script (g.ps1) to terminate 200+ AV/backup services and modify RDP registry keys, and run the LibTomCrypt-based Rhysida encryptor (AES-256-CTR + RSA-4096).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rhysida Affiliate (Vice Society Nexus)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'PortStarter Go Backdoor (Firewall Rule)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SilentKill PowerShell Script (g.ps1)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-319A / Sekoia XDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'LibTomCrypt AES-256-CTR (.rhysida)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: PortStarter Golang Backdoor & Windows Firewall Rule Tampering',
        narration:
          'Following initial VPN/Phishing access, the operator deploys PortStarter—a custom Golang backdoor shared with Vice Society that registers as a Windows service, adds an inbound Windows Firewall rule (`netsh advfirewall firewall add rule`), and listens on a high TCP port for mTLS C2 commands.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Persistence & Defense Evasion (T1562.004 - Disable or Modify System Firewall)',
        technicalCommands: [
          'sc.exe create WinDefendUpdate binPath= "C:\\ProgramData\\portstarter.exe"',
          'netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155',
        ],
        defenseMitigation:
          'Monitor Windows Firewall EventID 2004 (rule added) and Sysmon EventID 1 invocations of `netsh advfirewall firewall add rule` opening inbound TCP ports on internal hosts.',
        logs: [
          {
            id: 'rhy-1',
            timestamp: '02:09:14.330',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'netsh.exe',
            CommandLine: 'netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155',
            raw: 'EventID: 1 | ParentImage: C:\\ProgramData\\portstarter.exe (Go Binary) | Image: C:\\Windows\\System32\\netsh.exe | CommandLine: netsh advfirewall firewall add rule ... localport=49155 | Note: Vice Society / Rhysida PortStarter implant',
            parsedFields: {
              ImplantName: 'PortStarter (Golang Firewall Backdoor)',
              FirewallCommand: 'netsh advfirewall firewall add rule ... localport=49155',
              AdvisoryId: 'CISA AA23-319A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI',
        narration:
          'Prior to encryption, the operator runs SilentKill (g.ps1)—a comprehensive PowerShell preparation script that patches AmsiScanBuffer in memory, stops over 200 hardcoded antivirus, SQL, Exchange, and backup services, deletes shadow copies, and enables RestrictedAdmin RDP.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion & Service Stop (T1562.001 / T1489)',
        technicalCommands: [
          'powershell.exe -ExecutionPolicy Bypass -File C:\\Users\\Public\\g.ps1 (SilentKill)',
          'Stop-Service -Name "Veeam*","SQL*","Sophos*","SepMasterService" -Force; reg add "HKLM\\System\\CurrentControlSet\\Control\\Lsa" /v DisableRestrictedAdmin /t REG_DWORD /d 0 /f',
        ],
        defenseMitigation:
          'Enforce PowerShell Constrained Language Mode (CLM) and ScriptBlock Logging (EventID 4104) to detect bulk `Stop-Service` loops and `DisableRestrictedAdmin` registry modifications.',
        logs: [
          {
            id: 'rhy-2',
            timestamp: '02:18:45.102',
            source: 'EDR',
            severity: 'critical',
            EventCode: 4104,
            ProcessName: 'powershell.exe',
            raw: 'PowerShell ScriptBlock Alert (EventID 4104) | Script: C:\\Users\\Public\\g.ps1 (SilentKill) | Actions: Patched amsi.dll, executed Stop-Service across 214 AV/DB/Backup services, enabled RDP RestrictedAdmin',
            parsedFields: {
              PreparationScript: 'SilentKill (g.ps1)',
              StoppedServicesCount: '214 AV, Database, and Backup Services',
              RegistryModified: 'HKLM\\...\\Lsa\\DisableRestrictedAdmin = 0',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)',
        narration:
          'Distributed across the domain via PsExec (`-d -s cmd.exe`), the 64-bit MinGW-compiled Rhysida binary uses the statically linked LibTomCrypt library to encrypt files with AES-256-CTR and a 4096-bit RSA public key, appending .rhysida, dropping CriticalBreachDetected.pdf, and changing the desktop wallpaper.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1491.001 - Internal Defacement)',
        technicalCommands: [
          'psexec.exe \\\\* -u CORP\\admin -p <pass> -d -s cmd.exe /c "C:\\Windows\\Temp\\rhysida.exe -d C:\\"',
          'LibTomCrypt AES-256-CTR + RSA-4096 -> Appends .rhysida & drops CriticalBreachDetected.pdf',
        ],
        defenseMitigation:
          'Block `PsExec` (`PSEXESVC`) execution via Windows Firewall and Endpoint ASR rules, and monitor for binaries statically linking `LibTomCrypt` strings (`ctr_start`, `aes_setup`, `rsa_import`).',
        logs: [
          {
            id: 'rhy-3',
            timestamp: '02:25:19.770',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rhysida.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\rhysida.exe (MinGW C++ / LibTomCrypt) | TargetFilename: C:\\Users\\Admin\\Desktop\\CriticalBreachDetected.pdf | Cipher: AES-256-CTR + RSA-4096 | Extension: .rhysida',
            parsedFields: {
              CryptoLibrary: 'LibTomCrypt v1.18.2 (AES-256-CTR + RSA-4096)',
              RansomNotePdf: 'CriticalBreachDetected.pdf',
              AppendedExtension: '.rhysida',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'rhysida-ransomware-zerologon-ps-silentskill',
    briefing: {
      headline:
        'Rhysida ransomware operators (Vice Society nexus) deploy the PortStarter Golang firewall backdoor, execute the SilentKill PowerShell script (g.ps1) to stop 200+ AV/backup services, and run the LibTomCrypt-based Rhysida encryptor (AES-256-CTR + RSA-4096, AA23-319A).',
      storyAnalogy:
        'Imagine a burglary crew that first props open a secret window in the building’s outer wall (PortStarter), then sends in an advance demolition script (SilentKill / g.ps1) that runs down a checklist of 214 security guards, database clerks, and backup systems, knocking every single one unconscious and unlocking all the interior doors (RestrictedAdmin RDP), before the main vault-locking team (Rhysida) marches through.',
      plainSummary:
        'In this scenario (T1562.004, Rhysida Ransomware SilentKill PowerShell Preparation, PortStarter & LibTomCrypt AES-CTR (AA23-319A)) on DEV-0832, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: portStarter Golang Backdoor, then silentKill PowerShell Script Disabling 200+, then multi-Threaded LibTomCrypt AES-256-CTR. Steps #1–#3 walk that chain end-to-end by covering PortStarter Golang Backdoor, then SilentKill PowerShell Script Disabling 200+, then Multi-Threaded LibTomCrypt AES-256-CTR, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Rhysida Affiliate (Vice Society Nexus) -> PortStarter Go Backdoor (Firewall Rule) -> SilentKill PowerShell Script (g.ps1) -> LibTomCrypt AES-256-CTR (.rhysida) -> CISA AA23-319A / Sekoia XDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / MS-ISAC Joint Advisory AA23-319A (#StopRansomware: Rhysida) / Sekoia & Trend Micro SilentKill / PortStarter Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1562.004',
        plainTitle: 'PortStarter Golang Backdoor & Windows Firewall Rule Tampering',
        storyAnalogy:
          'The intruder installs a disguised service that punches a custom hole in the Windows Firewall so their command server can connect directly into a high port.',
        simpleExplanation:
          'After initial VPN or credential access, the operator installed PortStarter (a custom Golang backdoor shared between Vice Society and Rhysida affiliates that registers itself as a Windows service and executes netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155 to punch an inbound hole in the host firewall for encrypted C2 communication).',
        howItWorksInPractice:
          'The shared use of PortStarter and SilentKill provided high-confidence forensic proof that Vice Society (DEV-0832) operators transitioned directly to the Rhysida ransomware payload in mid-2023. In the documented EventID 1 exchange from Rhysida Affiliate (Vice Society Nexus) to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 1 (confirming that the netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155 request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Rhysida Affiliate to the PortStarter Go Backdoor (Firewall Rule) on the compromised host.',
        detectionAndEvidence:
          'Sysmon EventID 1 for netsh.exe advfirewall firewall add rule spawned by unsigned Golang binaries in C:\\ProgramData and Windows Firewall EventID 2004.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI',
        storyAnalogy:
          'A single master PowerShell script blinds the script scanner, shuts down over 200 security and database services so no files are locked, and flips on pass-the-hash RDP.',
        simpleExplanation:
          'To prepare the environment for unobstructed encryption, the operator ran SilentKill (g.ps1), which first patched AmsiScanBuffer in amsi.dll memory, iterated through a hardcoded list of over 200 Windows services (Stop-Service -Force targeting Sophos, Symantec, Veeam, SQL Server, Exchange, and shadow copies so database files were unlocked for encryption), and set HKLM\\System\\CurrentControlSet\\Control\\Lsa\\DisableRestrictedAdmin = 0 (enabling RestrictedAdmin RDP mode so the attacker could log into downstream servers via RDP using NTLM password hashes without cleartext passwords).',
        howItWorksInPractice:
          'Enabling DisableRestrictedAdmin = 0 across the domain allows the operator to Pass-the-Hash over RDP (mstsc.exe /restrictedadmin) without exposing their own cleartext credentials on target hosts. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the PortStarter host to the SilentKill PowerShell Script (g.ps1) and triggers the CISA AA23-319A / Sekoia XDR Sensor.',
        detectionAndEvidence:
          'PowerShell EventID 4104 capturing SilentKill service-termination loops and Registry EventID 13 modifications to Lsa\\DisableRestrictedAdmin.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1486',
        plainTitle: 'Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)',
        storyAnalogy:
          'Using PsExec to launch simultaneously on every machine, the encryptor scrambles files with military-grade AES-256-CTR, drops a PDF ransom note, and replaces every employee’s desktop wallpaper.',
        simpleExplanation:
          'Pushed domain-wide via psexec.exe -d -s, the 64-bit MinGW-compiled rhysida.exe binary invoked its statically linked LibTomCrypt v1.18.2 cryptographic library (aes_setup and ctr_start in AES-256-CTR mode paired with a hardcoded 4096-bit RSA public key) to encrypt files across all local drives, appending .rhysida, writing a PDF ransom note (CriticalBreachDetected.pdf), and modifying HKCU\\Control Panel\\Desktop\\Wallpaper to display an extortion warning.',
        howItWorksInPractice:
          'Unlike most ransomware families that drop .txt or .hta ransom notes, Rhysida generates a standalone .pdf document (CriticalBreachDetected.pdf) in every encrypted directory. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces SilentKill handing off to the LibTomCrypt AES-256-CTR (.rhysida) encryption stage across the enterprise.',
        detectionAndEvidence:
          'YARA rules matching LibTomCrypt constants in MinGW PE binaries, creation of CriticalBreachDetected.pdf, and .rhysida file extensions.',
      },
    ],
  };
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
