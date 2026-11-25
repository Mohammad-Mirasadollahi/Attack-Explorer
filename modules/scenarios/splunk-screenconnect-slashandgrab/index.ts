import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'splunk-screenconnect-slashandgrab',
  code: 'CVE-2024-1709',
  name: 'Splunk STRT & Huntress — ConnectWise ScreenConnect "SlashAndGrab" Auth Bypass & RMM RCE',
  shortSubtitle: 'Splunk STRT / Huntress · CVE-2024-1709 /SetupWizard.aspx/ Traversal, User.xml Overwrite & .ashx RCE',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Huntress Labs ("SlashAndGrab") and the Splunk Threat Research Team (STRT, February 2024), CVE-2024-1709 (CVSS 10.0) is a trivial path-confusion authentication bypass in ConnectWise ScreenConnect. By simply appending a trailing slash or path segment to the setup wizard URL (/SetupWizard.aspx/anything), an unauthenticated attacker accesses the initial setup wizard on an already-configured server, overwrites User.xml with a new administrator account, uploads a malicious .ashx extension to execute commands as SYSTEM, and pushes ransomware/Cobalt Strike to managed endpoints.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Splunk Threat Research Team (STRT) & Huntress Labs — CVE-2024-1709 SlashAndGrab Analysis',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (CVE-2024-1709 SetupWizard.aspx/) · T1505.003 (.ashx Webshell Extension) · T1219 (RMM Abuse)',
    },
    {
      term: 'OVERWRITTEN DB',
      value: 'C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml',
    },
    {
      term: 'RCE ARTIFACT',
      value: 'App_Extensions\\<GUID>\\*.ashx compiled by csc.exe under ScreenConnect.Service.exe',
    },
  ],
  nodes: [
    {
      id: 'slashandgrab_actor',
      label: 'Threat Actor (BlackBasta / LockBit)',
      sublabel: '198.51.100.129 (RMM Exploit Operator)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Ransomware Affiliate / Initial Access Broker',
        pidOrPort: 'HTTP/S :8040 / :443 -> ScreenConnect Server',
        privilege: 'Unauthenticated External',
        artifacts: [
          'GET /SetupWizard.aspx/ HTTP/1.1',
          'POST /Services/ExtensionService.ashx/InstallExtension',
        ],
        description:
          'Attacker sending a trailing-slash request to /SetupWizard.aspx/ to reset the ScreenConnect administrator database.',
      },
    },
    {
      id: 'screenconnect_srv',
      label: 'ConnectWise ScreenConnect Server',
      sublabel: '172.16.15.20 · RMM-SRV-01',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 · ScreenConnect RMM Host',
        pidOrPort: 'ScreenConnect.Service.exe (TCP 8040 / 8041)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml',
          'C:\\Program Files (x86)\\ScreenConnect\\App_Extensions\\',
        ],
        description:
          'On-premises ConnectWise ScreenConnect server managing hundreds of enterprise endpoints.',
      },
    },
    {
      id: 'ashx_extension_rce',
      label: 'Malicious .ashx Extension & csc.exe',
      sublabel: 'App_Extensions\\<GUID>\\payload.ashx',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'ASP.NET Dynamic Web Handler (.ashx) in ScreenConnect',
        pidOrPort: 'PID 5912 · ScreenConnect.Service.exe -> csc.exe -> cmd.exe',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'App_Extensions\\e3a1c8...\\handler.ashx',
          'Process.Start("cmd.exe", "/c powershell -enc ...")',
        ],
        description:
          'Malicious ScreenConnect extension ZIP uploaded by the attacker containing an ASP.NET .ashx webshell that executes as SYSTEM.',
      },
    },
    {
      id: 'managed_fleet_hosts',
      label: 'Managed Endpoint Fleet (Relay)',
      sublabel: '10.10.20.0/24 (TCP 8041 Agent Channel)',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Enterprise Endpoints Running ScreenConnect Client',
        pidOrPort: 'C:\\Windows\\Temp\\ScreenConnect\\<Version>\\*.cmd',
        privilege: 'SYSTEM Across All Managed Hosts',
        artifacts: [
          'Mass Command Dispatch from Compromised RMM Server',
          'nltest /dclist: & Cobalt Strike Stager Deployment',
        ],
        description:
          'Downstream enterprise endpoints that automatically execute commands pushed over TCP 8041 from the compromised ScreenConnect server.',
      },
    },
    {
      id: 'splunk_huntress_siem',
      label: 'Splunk Enterprise Security (STRT)',
      sublabel: 'Sysmon EID 1, 11 & IIS/HTTP Logs',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Splunk SIEM running STRT ESCU Detections',
        pidOrPort: 'Sysmon EID 1, 11 (User.xml / .ashx)',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Splunk ESCU: ConnectWise ScreenConnect User.xml Modification',
          'Splunk ESCU: ScreenConnect.Service.exe Spawning Shell',
        ],
        description:
          'Detects modifications to App_Data\\User.xml, new .ashx files in App_Extensions\\, and ScreenConnect.Service.exe child processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 1890,
      ppid: 680,
      name: 'ScreenConnect.Service.exe',
      commandLine: '"C:\\Program Files (x86)\\ScreenConnect\\ScreenConnect.Service.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'WriteFile("C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml")',
        'CreateProcessW("csc.exe") [Compile .ashx Extension]',
      ],
    },
    {
      pid: 5912,
      ppid: 1890,
      name: 'cmd.exe',
      commandLine:
        'cmd.exe /c "whoami & nltest /dclist:corp.local & powershell -nop -w hidden -enc ..."',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['CreateProcessW("nltest.exe")', 'CreateProcessW("powershell.exe")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SETUPWIZARD.ASPX/ TRAVERSAL & USER.XML OVERWRITE (CVE-2024-1709)',
      subtitle: 'Accessing /SetupWizard.aspx/ to overwrite App_Data\\User.xml',
      description:
        'As detailed by Huntress and Splunk STRT, ScreenConnect checks whether /SetupWizard.aspx is requested directly, but fails when a trailing slash (/SetupWizard.aspx/) is appended (CVE-2024-1709). The attacker completes the setup wizard, overwriting C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml with a new SuperAdmin account.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['slashandgrab_actor', 'screenconnect_srv', 'splunk_huntress_siem'],
      compromisedNodeIds: ['screenconnect_srv'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-1709 (CVSS 10.0 Authentication Bypass)' },
        { term: 'BYPASS URI', value: 'GET /SetupWizard.aspx/ (or /SetupWizard.aspx/anything)' },
        { term: 'MODIFIED FILE', value: 'C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml' },
      ],
    },
    {
      index: 2,
      title: 'MALICIOUS .ASHX EXTENSION UPLOAD & SYSTEM RCE',
      subtitle: 'Installing rogue extension in App_Extensions\\ to spawn cmd.exe as SYSTEM',
      description:
        'Logged in as the newly created ScreenConnect administrator, the attacker uploads a malicious extension ZIP via /Services/ExtensionService.ashx. ScreenConnect extracts a .ashx web handler into App_Extensions\\<GUID>\\, compiles it with csc.exe, and spawns cmd.exe / powershell.exe under ScreenConnect.Service.exe as NT AUTHORITY\\SYSTEM.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell',
      activeNodeIds: ['screenconnect_srv', 'ashx_extension_rce', 'splunk_huntress_siem'],
      compromisedNodeIds: ['screenconnect_srv', 'ashx_extension_rce'],
      keySpecs: [
        { term: 'EXTENSION PATH', value: 'C:\\Program Files (x86)\\ScreenConnect\\App_Extensions\\<GUID>\\*.ashx' },
        { term: 'PARENT PROCESS', value: 'ScreenConnect.Service.exe (NT AUTHORITY\\SYSTEM)' },
        { term: 'COMPILER ARTIFACT', value: 'csc.exe compiling dynamic ASP.NET handler DLL' },
      ],
    },
    {
      index: 3,
      title: 'DOWNSTREAM FLEET COMMAND PUSH OVER TCP 8041',
      subtitle: 'Pushing .cmd scripts to managed endpoints via ScreenConnect ClientService',
      description:
        'Using the compromised ScreenConnect console, the attacker selects connected enterprise workstations and servers and dispatches batch commands over the TCP 8041 relay channel, executing payloads out of C:\\Windows\\Temp\\ScreenConnect\\<Version>\\*.cmd across the fleet.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1219',
      mitreTechniqueName: 'Remote Access Software',
      activeNodeIds: ['ashx_extension_rce', 'managed_fleet_hosts', 'splunk_huntress_siem'],
      compromisedNodeIds: ['screenconnect_srv', 'ashx_extension_rce', 'managed_fleet_hosts'],
      keySpecs: [
        { term: 'FLEET ARTIFACT', value: 'C:\\Windows\\Temp\\ScreenConnect\\<Version>\\*.cmd / *.ps1' },
        { term: 'CLIENT SERVICE', value: 'ScreenConnect.ClientService.exe spawning cmd.exe' },
        { term: 'SPLUNK ESCU', value: 'ConnectWise ScreenConnect Path Traversal CVE-2024-1709' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'spl-sc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '13:08:11.204',
      sourceNodeId: 'slashandgrab_actor',
      targetNodeId: 'screenconnect_srv',
      sourceLabel: '198.51.100.129',
      targetLabel: 'ScreenConnect User.xml',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11',
      shortAction: 'OVERWRITE USER.XML',
      info: 'Image=ScreenConnect.Service.exe TargetFilename=C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml',
      sizeOrCode: 'CVE-2024-1709',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Splunk STRT and Huntress note that exploiting /SetupWizard.aspx/ causes ScreenConnect.Service.exe to overwrite App_Data\\User.xml.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
    <Computer>RMM-SRV-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Program Files (x86)\\ScreenConnect\\ScreenConnect.Service.exe</Data>
    <Data Name="TargetFilename">C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Splunk STRT — ConnectWise ScreenConnect User.xml or .ashx Creation (CVE-2024-1709)',
        ruleCode: `title: ConnectWise ScreenConnect CVE-2024-1709 User.xml or Extension Creation
logsource:
  category: file_event
  product: windows
detection:
  selection:
    Image|endswith: '\\ScreenConnect.Service.exe'
    TargetFilename|contains:
      - '\\ScreenConnect\\App_Data\\User.xml'
      - '\\ScreenConnect\\App_Extensions\\'
  condition: selection
level: critical`,
        mitigation:
          'Upgrade ConnectWise ScreenConnect to version 23.9.8 or later immediately and audit App_Data\\User.xml and App_Extensions\\ for unauthorized modifications.',
      },
    },
    {
      id: 'spl-sc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '13:08:19.650',
      sourceNodeId: 'screenconnect_srv',
      targetNodeId: 'ashx_extension_rce',
      sourceLabel: 'ScreenConnect.Service.exe',
      targetLabel: 'cmd.exe (PID 5912)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'ASHX EXTENSION RCE',
      info: 'ParentImage=ScreenConnect.Service.exe Image=cmd.exe CommandLine="cmd.exe /c whoami & nltest /dclist:corp.local"',
      sizeOrCode: 'PID 5912',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'ScreenConnect.Service.exe (the server daemon, as opposed to the client agent) should never directly spawn cmd.exe or powershell.exe.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>RMM-SRV-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">5912</Data>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c "whoami &amp; nltest /dclist:corp.local &amp; powershell -nop -w hidden -enc ..."</Data>
    <Data Name="ParentProcessId">1890</Data>
    <Data Name="ParentImage">C:\\Program Files (x86)\\ScreenConnect\\ScreenConnect.Service.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ScreenConnect Server Service Spawning Command Shell (CVE-2024-1709 RCE)',
        ruleCode: `title: ConnectWise ScreenConnect Server Spawning Shell Process
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|endswith: '\\ScreenConnect.Service.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\pwsh.exe'
  condition: selection
level: critical`,
        mitigation:
          'Isolate the ScreenConnect server if ScreenConnect.Service.exe spawns a command shell and inspect App_Extensions\\ for rogue .ashx files.',
      },
    },
    {
      id: 'spl-sc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '13:10:04.112',
      sourceNodeId: 'ashx_extension_rce',
      targetNodeId: 'managed_fleet_hosts',
      sourceLabel: 'ScreenConnect Relay :8041',
      targetLabel: 'Temp\\ScreenConnect\\*.cmd',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 11 & 1',
      shortAction: 'FLEET MASS PUSH',
      info: 'ScreenConnect.ClientService.exe writes and executes C:\\Windows\\Temp\\ScreenConnect\\23.9.7\\8f2a1c.cmd across endpoints',
      sizeOrCode: 'Fleet Push',
      severity: 'CRITICAL',
      mitreId: 'T1219',
      explanation:
        'When commands are pushed from the ScreenConnect server to managed endpoints, ScreenConnect.ClientService.exe writes temporary .cmd/.ps1 scripts into C:\\Windows\\Temp\\ScreenConnect\\<version>\\.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>11</EventID>
    <Computer>WKS-CORP-22.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Program Files (x86)\\ScreenConnect Client (3a9f)\\ScreenConnect.ClientService.exe</Data>
    <Data Name="TargetFilename">C:\\Windows\\Temp\\ScreenConnect\\23.9.7.8804\\8f2a1c90-b412.cmd</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'ScreenConnect Client Executing Script from Windows Temp Directory',
        ruleCode: `title: ScreenConnect ClientService Script Execution in Temp
logsource:
  category: file_event
  product: windows
detection:
  selection:
    Image|endswith: '\\ScreenConnect.ClientService.exe'
    TargetFilename|contains: '\\Windows\\Temp\\ScreenConnect\\'
    TargetFilename|endswith:
      - '.cmd'
      - '.bat'
      - '.ps1'
  condition: selection
level: high`,
        mitigation:
          'Audit all .cmd and .ps1 scripts executed out of C:\\Windows\\Temp\\ScreenConnect\\ across managed endpoints.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    briefing: {
      headline: 'Scenario Briefing: ConnectWise ScreenConnect "SlashAndGrab" (CVE-2024-1709), Trailing-Slash Setup Wizard Reset',
      storyAnalogy:
        'Imagine a smart-lock system on an office building where the "First-Time Factory Setup Screen" (/SetupWizard.aspx) is supposed to be permanently locked after Day 1. However, the guard only checks if the visitor’s request ends with the exact letters /SetupWizard.aspx. By simply adding one extra forward slash at the end (/SetupWizard.aspx/), the guard says "That doesn’t end with .aspx, go right ahead!" while the web server behind the guard still opens /SetupWizard.aspx, letting any stranger on the internet re-run the Day-1 Factory Setup Wizard, overwrite the building’s master administrator database (User.xml), and broadcast commands to every computer managed by the IT team.',
      plainSummary:
        'In this scenario (CVE-2024-1709, Splunk STRT & Huntress - ConnectWise ScreenConnect "SlashAndGrab" Auth Bypass & RMM RCE), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: accessing "/SetupWizard.aspx/anything", then submitting the Setup Form to Overwrite, then abusing the RMM Console to Push SYSTEM. Steps #1–#3 walk that chain end-to-end by covering Accessing "/SetupWizard.aspx/anything", then Submitting the Setup Form to Overwrite, then Abusing the RMM Console to Push SYSTEM, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
          'Documented by Splunk SURGe and Huntress (web access log detections for SlashAndGrab): HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server (proving an unauthenticated caller reopened the initial configuration wizard). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
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
          'Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch (overwriting existing administrator hashes with attacker-chosen credentials) and returns an authenticated administrator session cookie to the caller (granting full web console control without knowing prior passwords). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
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
          'Documented by Huntress and Splunk SURGe (endpoint process creation indicators for abused RMM sessions): ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd (signaling mass Backstage command execution across managed workstations). Correlate Sysmon or Windows Security Event telemetry for T1219 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A remote help-desk dispatch center locks away its opening-day setup desk after launch, yet adding one extra slash to the hallway sign reopens the empty setup form. An outsider walks in, overwrites the master dispatcher roster with their own name, and uses the built-in dispatch radio to push instant orders to every managed workstation.',
        storyMappings: [
          {
            storyTerm: 'Remote dispatch center',
            technicalTerm: 'ConnectWise ScreenConnect RMM server',
            tone: 'amber',
          },
          {
            storyTerm: 'Extra slash hallway sign',
            technicalTerm: 'Path-traversal bypass on /SetupWizard.aspx/ (CVE-2024-1709)',
            tone: 'sky',
          },
          {
            storyTerm: 'Master dispatcher roster',
            technicalTerm: 'App_Data\\User.xml administrator credential file',
            tone: 'rose',
          },
          {
            storyTerm: 'Built-in dispatch radio',
            technicalTerm: 'Backstage administrative command runner',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider appends a trailing slash and random word to the closed setup-room doorway. The hallway lock checks only for an exact room name, so the setup desk swings wide open on a fully operating dispatch center.',
          storyMappings: [
            {
              storyTerm: 'Closed setup-room doorway',
              technicalTerm: 'Initial installation /SetupWizard.aspx page',
              tone: 'amber',
            },
            {
              storyTerm: 'Trailing slash and random word',
              technicalTerm: 'Path suffix bypass (/SetupWizard.aspx/anything)',
              tone: 'sky',
            },
            {
              storyTerm: 'Exact-name hallway lock',
              technicalTerm: 'Flawed URL path check (CVE-2024-1709)',
              tone: 'rose',
            },
            {
              storyTerm: 'Open setup desk',
              technicalTerm: 'HTTP 200 access to setup wizard on a live server',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Splunk SURGe and Huntress (web access log detections for SlashAndGrab): HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server (proving an unauthenticated caller reopened the initial configuration wizard). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'Sitting at the reopened setup desk, the outsider fills in a fresh owner name and password. The dispatch system dutifully wipes the old supervisor roster book, saves the newcomer as sole owner, and hands over a valid master badge.',
          storyMappings: [
            {
              storyTerm: 'Fresh owner registration form',
              technicalTerm: 'Submitted SetupWizard administrator creation POST',
              tone: 'amber',
            },
            {
              storyTerm: 'Supervisor roster book',
              technicalTerm: 'App_Data\\User.xml credential database',
              tone: 'sky',
            },
            {
              storyTerm: 'Valid master badge',
              technicalTerm: 'Authenticated administrator session cookie',
              tone: 'rose',
            },
            {
              storyTerm: 'Custom desk add-on',
              technicalTerm: 'Malicious extension file placed in App_Extensions',
              tone: 'emerald',
            },
          ],
          howItWorksInPractice:
            'Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch (overwriting existing administrator hashes with attacker-chosen credentials) and returns an authenticated administrator session cookie to the caller (granting full web console control without knowing prior passwords). Mechanically, defenders treat this stage as complete only after the T1505.003 control point is observed as live runtime state (the concrete checkpoint proving prior-stage output now drives the next action) and confirmed in host or network telemetry (the channel that timestamps the handoff).',
          detectionAndEvidence:
            'Documented in Sysmon EventID 11 (file creation and overwrite telemetry) and ScreenConnect Audit Logs: Modification of C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml and App_Extensions\\*.ashx by ScreenConnect.Service.exe (confirming administrator credential replacement and extension deployment).',
        },
        3: {
          storyAnalogy:
            'With the master badge in hand, the outsider does not need to pick a single lock on employee desks. They simply press the legitimate dispatch intercom to broadcast silent maintenance orders to hundreds of connected offices at once.',
          storyMappings: [
            {
              storyTerm: 'Legitimate dispatch intercom',
              technicalTerm: 'ScreenConnect Backstage non-interactive shell',
              tone: 'amber',
            },
            {
              storyTerm: 'Connected branch offices',
              technicalTerm: 'Managed client endpoints running ClientService',
              tone: 'sky',
            },
            {
              storyTerm: 'Master building clearance',
              technicalTerm: 'NT AUTHORITY\\SYSTEM execution privilege',
              tone: 'rose',
            },
            {
              storyTerm: 'Broadcast maintenance order',
              technicalTerm: 'Temporary batch scripts invoking cmd.exe or powershell.exe',
              tone: 'emerald',
            },
          ],
          howItWorksInPractice:
            'Without needing a single exploit on the client workstations, the operator uses the built-in Backstage command runner (a legitimate remote-management console hidden from the logged-in desktop user) to execute arbitrary commands as NT AUTHORITY\\SYSTEM across hundreds or thousands of managed endpoints simultaneously (turning one RMM server compromise into fleet-wide code execution).',
          detectionAndEvidence:
            'Documented by Huntress and Splunk SURGe (endpoint process creation indicators for abused RMM sessions): ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd (signaling mass Backstage command execution across managed workstations). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1219 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
