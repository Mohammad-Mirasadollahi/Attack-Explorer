import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'rhysida-ransomware-zerologon-ps-silentskill',
    briefing: {
      headline:
        'Rhysida ransomware operators (Vice Society nexus) deploy the PortStarter Golang firewall backdoor, execute the SilentKill PowerShell script (g.ps1) to stop 200+ AV/backup services, and run the LibTomCrypt-based Rhysida encryptor (AES-256-CTR + RSA-4096, AA23-319A).',
      storyAnalogy:
        'Imagine a burglary crew that first props open a secret window in the building’s outer wall (PortStarter), then sends in an advance demolition script (SilentKill / g.ps1) that runs down a checklist of 214 security guards, database clerks, and backup systems, knocking every single one unconscious and unlocking all the interior doors (RestrictedAdmin RDP), before the main vault-locking team (Rhysida) marches through.',
      plainSummary:
        'Covered in joint CISA/FBI/MS-ISAC Advisory AA23-319A and Sekoia/Cisco Talos intelligence reports linking Rhysida to Vice Society (DEV-0832), Rhysida intrusions follow a disciplined three-phase playbook: (1) deploying PortStarter (a Golang backdoor that adds an inbound Windows Firewall rule via netsh for mTLS C2), (2) executing SilentKill (g.ps1, a PowerShell script that unhooks AMSI, stops 200+ AV/SQL/backup services, and enables RestrictedAdmin RDP), and (3) pushing rhysida.exe via PsExec to encrypt files using LibTomCrypt AES-256-CTR and RSA-4096 (.rhysida + CriticalBreachDetected.pdf).',
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
          'Enabling DisableRestrictedAdmin = 0 across the domain allows the operator to Pass-the-Hash over RDP (mstsc.exe /restrictedadmin) without exposing their own cleartext credentials on target hosts.',
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
          'Unlike most ransomware families that drop .txt or .hta ransom notes, Rhysida generates a standalone .pdf document (CriticalBreachDetected.pdf) in every encrypted directory.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces SilentKill handing off to the LibTomCrypt AES-256-CTR (.rhysida) encryption stage across the enterprise.',
        detectionAndEvidence:
          'YARA rules matching LibTomCrypt constants in MinGW PE binaries, creation of CriticalBreachDetected.pdf, and .rhysida file extensions.',
      },
    ],
  };
