import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'elastic-grimresource-msc',
    briefing: {
      headline: 'Scenario Briefing: GrimResource (CVE-2024-43572 / MMC Attack), Code Execution via Crafted .msc Files',
      storyAnalogy:
        'Imagine a company that banned employees from opening .exe packages, but still trusts official-looking "Settings Binder" files (.msc) opened by the built-in Windows Management Console (mmc.exe). The attacker hides a legacy 1990s self-running gadget (apds.dll XSS) inside a Settings Binder; when opened, mmc.exe automatically runs the hidden script inside its own trusted process.',
      plainSummary:
        'Synthesizing research from Elastic Security Labs (who discovered "GrimResource" in June 2024), MDSec (DotNetToJScript), and Microsoft MSRC (CVE-2024-43572), this technique achieves arbitrary code execution inside Windows Management Console (mmc.exe, the signed Microsoft binary used for Event Viewer and Device Manager) when a user opens a crafted Microsoft Saved Console (.msc) file. By abusing a cross-site scripting (XSS) flaw in the legacy Windows apds.dll library (res://apds.dll/redirect.html, which blindly executes javascript: URLs inside mmc.exe’s HTML view) together with DotNetToJScript (deserializing a .NET assembly directly in RAM via BinaryFormatter) and RwSection injection into dllhost.exe, the attacker runs Cobalt Strike inside a trusted system process.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Phishing Delivery of invoice_audit.msc), follow user execution on Node ③ (Windows Workstation mmc.exe), trace the apds.dll DOM XSS and DotNetToJScript memory injection inside Node ④ (mmc.exe / dllhost.exe), and watch the final C2 connection to Node ⑤ detected by Node ⑥ (Elastic Defend / SIEM).',
      documentedAdvisory: 'Elastic Security Labs "GrimResource" Report · Microsoft MSRC CVE-2024-43572 · MDSec DotNetToJScript · MITRE T1218.014',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1218.014',
        plainTitle: 'Opening a Malicious .msc File Triggers the Legacy apds.dll Redirect Vulnerability (CVE-2024-43572)',
        storyAnalogy:
          'The employee double-clicks an administrative binder (invoice_audit.msc). Inside the binder’s cover page (StringTables), a hidden reference tells the Windows Management Console to open an ancient help-viewer page (res://apds.dll/redirect.html) that blindly executes whatever script is written in its target parameter.',
        simpleExplanation:
          'The victim double-clicks a weaponized console file (invoice_audit.msc, an XML-based Windows Management Console file used to bypass email and browser blocks on .exe and .lnk files), which Windows automatically opens using the trusted system binary C:\\Windows\\System32\\mmc.exe. Inside the .msc XML structure, the <StringTables> section points an embedded HTML panel to res://C:\\Windows\\System32\\apds.dll/redirect.html?target=javascript:eval(...) (abusing an ancient HTML page baked inside Microsoft’s own apds.dll library that blindly passes its "target=" parameter into a browser redirect, CVE-2024-43572, immediately executing the attacker’s VBScript/JavaScript inside mmc.exe).',
        howItWorksInPractice:
          'C:\\Windows\\System32\\apds.dll (the legacy Microsoft Help Center library shipped on every Windows installation) contains an embedded resource (redirect.html) that passes the target query parameter directly to document.location.replace() without sanitizing javascript: or vbscript: URI schemes, giving the .msc file full script execution inside mmc.exe’s privileged MSHTML Zone.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② into Node ③ (mmc.exe loading invoice_audit.msc and apds.dll), and return arrow ⇠#1 triggering JScript execution inside mmc.exe.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & MSRC CVE-2024-43572: Sysmon EventID 7 showing mmc.exe loading both apds.dll and jscript.dll / vbscript.dll while parsing a non-standard .msc file.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Using DotNetToJScript to Reconstruct a .NET Loader Inside mmc.exe Memory',
        storyAnalogy:
          'Once the legacy script starts running inside mmc.exe, it acts like a 3D printer inside the building: it reads an encoded blueprint from the binder and materializes a full .NET loader (BinaryFormatter.Deserialize) directly in RAM.',
        simpleExplanation:
          'Plain JScript cannot call low-level Windows memory APIs directly, so the script inside mmc.exe uses the DotNetToJScript technique: it creates a .NET BinaryFormatter COM object via ActiveX (new ActiveXObject("System.Runtime.Serialization.Formatters.Binary.BinaryFormatter")) and deserializes a Base64-encoded .NET assembly ("GrimLoader") directly in RAM (allowing the attacker to bridge from limited JScript into a full .NET program with complete Win32 API access inside mmc.exe, without ever dropping a .dll or .exe file onto the hard drive).',
        howItWorksInPractice:
          'Deserializing a crafted gadget chain via BinaryFormatter loads the .NET Common Language Runtime (clr.dll / mscoree.dll) into mmc.exe and invokes Assembly.Load(byte[]) in memory (giving the attacker full P/Invoke access to kernel32.dll and ntdll.dll from inside a Microsoft-signed console process).',
        diagramAlignment:
          'On the diagram, arrow #2→ deserializes the .NET assembly inside Node ④ (mmc.exe CLR Runtime clr.dll / mscoree.dll), and return arrow ⇠#2 initializes the in-memory injector.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: mmc.exe loading jscript9.dll / jscript.dll followed immediately by .NET CLR (clr.dll) and amsi.dll in the same process.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055',
        plainTitle: 'Spawning dllhost.exe & Injecting the Cobalt Strike Beacon via RwSection / DirtyVanity',
        storyAnalogy:
          'Finally, so the employee can close the Settings Binder without killing the malware, the in-memory loader spawns a quiet background helper (dllhost.exe) and hands the active C2 radio over to it.',
        simpleExplanation:
          'If the victim notices an empty console window and clicks "X" to close mmc.exe, any malware running inside mmc.exe would die immediately. To survive, the in-memory .NET loader spawns a hidden background C:\\Windows\\System32\\dllhost.exe process (COM Surrogate, a legitimate Windows background host that runs without a visible taskbar window), maps a shared Read-Write-Execute memory section via NtCreateSection / NtMapViewOfSection ("RwSection" technique documented by Elastic Security Labs, avoiding suspicious VirtualAllocEx calls), and injects the Cobalt Strike C2 beacon into dllhost.exe.',
        howItWorksInPractice:
          'Migrating execution from the interactive mmc.exe process into a headless dllhost.exe process via shared section mapping (RwSection) or Asynchronous Procedure Call (NtQueueApcThread) ensures the C2 beacon stays alive in the background long after the victim closes the .msc window. In the documented Sysmon EID 1 & 8 exchange from mmc.exe (Management Console) to apds.dll & DotNetToJScript, apds.dll & DotNetToJScript responds with ACK PID 6088 (confirming that the INJECT DLLHOST.EXE request succeeded on apds.dll & DotNetToJScript and completing the final execution objective of Elastic Security Labs, GrimResource: MMC & apds.dll XSS-to-RCE Execution).',
        diagramAlignment:
          'On the diagram, arrow #3→ injects from Node ④ (mmc.exe) into dllhost.exe and connects out to Node ⑤ (C2 Server), while Node ⑥ (Elastic Defend / SIEM) correlates the .msc → apds.dll → dllhost.exe chain.',
        detectionAndEvidence:
          'Documented in Elastic Detection Rule execution_via_mmc_apds_dll: mmc.exe loading apds.dll and spawning or injecting into dllhost.exe.',
      },
    ],
  };
