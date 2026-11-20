import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    briefing: {
      headline: 'Scenario Briefing: ConnectWise ScreenConnect "SlashAndGrab" (CVE-2024-1709), Trailing-Slash Setup Wizard Reset',
      storyAnalogy:
        'Imagine a smart-lock system on an office building where the "First-Time Factory Setup Screen" (/SetupWizard.aspx) is supposed to be permanently locked after Day 1. However, the guard only checks if the visitor’s request ends with the exact letters /SetupWizard.aspx. By simply adding one extra forward slash at the end (/SetupWizard.aspx/), the guard says "That doesn’t end with .aspx, go right ahead!" while the web server behind the guard still opens /SetupWizard.aspx, letting any stranger on the internet re-run the Day-1 Factory Setup Wizard, overwrite the building’s master administrator database (User.xml), and broadcast commands to every computer managed by the IT team.',
      plainSummary:
        'Synthesizing Huntress ("SlashAndGrab"), ConnectWise Security Advisory (CVE-2024-1709 & CVE-2024-1708), and Splunk SURGe (February 2024), CVE-2024-1709 is one of the simplest yet most devastating authentication bypass bugs ever found in remote monitoring and management (RMM) software. On ConnectWise ScreenConnect servers, the initial installation wizard (/SetupWizard.aspx) is supposed to be blocked once the server is configured. However, appending a trailing slash or path suffix (/SetupWizard.aspx/anything, which fools the custom security check while ASP.NET still loads SetupWizard.aspx) reopens the first-time setup wizard, allowing anyone on the internet to overwrite the server’s primary administrator database (User.xml) and push SYSTEM commands to all connected customer endpoints.',
      diagramTopologySummary:
        'On the diagram: Node ① (Threat Actor) sends the /SetupWizard.aspx/ request through Node ② (Edge Firewall :8040/:443) to Node ③ (ScreenConnect RMM Server). Inside the server, Node ④ (SetupWizard User.xml Overwrite & Extension Engine) resets the admin account and pushes remote PowerShell/MSI payloads to Node ⑤ (Managed Client Endpoints), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA KEV CVE-2024-1709 & CVE-2024-1708 · Huntress SlashAndGrab & Splunk SURGe Analysis · MITRE ATT&CK T1190 / T1219',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Accessing "/SetupWizard.aspx/anything" to Reopen the Initial Installation Wizard (CVE-2024-1709)',
        storyAnalogy:
          'Adding /anything after /SetupWizard.aspx fools the security filter into thinking you are visiting a different page, while ASP.NET treats /anything as harmless PathInfo metadata and opens the First-Time Setup Wizard anyway.',
        simpleExplanation:
          'As reverse-engineered by Huntress, to block access to the initial setup page after Day 1, ScreenConnect’s authentication filter checked whether the requested URL ended with the exact string /SetupWizard.aspx. By simply adding a trailing slash or suffix, GET /SetupWizard.aspx/anything, the string-ending check returns false and lets the request through without authentication, while Microsoft’s ASP.NET web engine still routes the request to SetupWizard.aspx (treating the trailing "/anything" as harmless Request.PathInfo metadata, CVE-2024-1709).',
        howItWorksInPractice:
          'In ASP.NET, a URL like /Page.aspx/extra is routed to the handler for /Page.aspx with Request.PathInfo set to "/extra". Because the security check tested Request.Path instead of Request.FilePath, a single trailing "/" bypassed the lock completely. In the documented Sysmon EID 11 exchange from Threat Actor (BlackBasta / LockBit) to DMZ Reverse Proxy & SPAN Tap, DMZ Reverse Proxy & SPAN Tap responds with ACK CVE-2024-1709 (confirming that the OVERWRITE USER.XML request succeeded on DMZ Reverse Proxy & SPAN Tap and establishing the runtime state required for Step #2 MALICIOUS .ASHX EXTENSION UPLOAD & SYSTEM RCE).',
        diagramAlignment:
          'On the diagram, arrow #1→ sends GET /SetupWizard.aspx/anything from Node ①/② to Node ③ (ScreenConnect Server), and ⇠#1 returns HTTP 200 SetupWizard form.',
        detectionAndEvidence:
          'Documented by Splunk SURGe & Huntress: HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Submitting the Setup Form to Overwrite the Server’s "User.xml" Administrator Database',
        storyAnalogy:
          'With the Day-1 Setup Wizard open in their browser, the attacker types in their own username and password and clicks "Finish", wiping out the company’s real IT administrators in App_Data\\User.xml and making the attacker the sole super-admin.',
        simpleExplanation:
          'With the first-time setup wizard open in their browser, the attacker submits a new administrator username and password. ScreenConnect immediately overwrites C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml (the local XML database file that stores all administrator accounts and password hashes on the server, wiping out the company’s legitimate IT administrators and logging the attacker straight in as the sole Super-Admin). Furthermore, attackers can chain CVE-2024-1708 (a ZipSlip path-traversal flaw in ScreenConnect’s Extension uploader that writes .ashx webshells directly into App_Extensions\\ for server-side persistence).',
        howItWorksInPractice:
          'Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch and returns an authenticated administrator session cookie to the attacker’s browser.',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ overwrites App_Data\\User.xml with the rogue admin account, and ⇠#2 returns an authenticated admin session cookie.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 & ScreenConnect Audit Logs: Modification of C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml and App_Extensions\\*.ashx by ScreenConnect.Service.exe.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1219',
        plainTitle: 'Abusing the RMM Console to Push SYSTEM Commands to Connected Client Machines',
        storyAnalogy:
          'Because ScreenConnect is the official remote-support tool installed on every employee laptop and server in the company (ScreenConnect.ClientService.exe running as SYSTEM), the attacker simply clicks "Run Command on All Machines" in their new admin console to deploy payloads everywhere at once.',
        simpleExplanation:
          'Why is compromising an RMM server so catastrophic? Because every laptop and server managed by the IT team has the ScreenConnect client agent (ScreenConnect.ClientService.exe, a trusted background service running with full NT AUTHORITY\\SYSTEM privileges) permanently connected to this server. From their hijacked admin console, the attacker selects all connected computers and broadcasts PowerShell or ransomware commands (which each endpoint agent writes into C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd and executes immediately as SYSTEM).',
        howItWorksInPractice:
          'Without needing a single exploit on the client workstations, the attacker uses ScreenConnect’s built-in "Backstage" command runner to execute arbitrary commands as NT AUTHORITY\\SYSTEM across hundreds or thousands of managed endpoints simultaneously.',
        diagramAlignment:
          'On the diagram, arrow #3→ pushes remote commands from Node ④ to Node ⑤ (Managed Endpoints running ScreenConnect.ClientService.exe) while Node ⑥ (Splunk SIEM) alerts.',
        detectionAndEvidence:
          'Documented by Huntress & Splunk SURGe: ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd.',
      },
    ],
  };
