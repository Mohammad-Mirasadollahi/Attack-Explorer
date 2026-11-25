import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'mandiant-apt29-teamcity-jetstream',
  code: 'CVE-2023-42793',
  name: 'Mandiant & CISA — APT29 (Midnight Blizzard): JetBrains TeamCity RCE & GraphicalProton',
  shortSubtitle: 'CISA AA23-347A / Mandiant · CVE-2023-42793 / CVE-2024-27198 Auth Bypass, Token Minting & OneDrive C2',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Detailed in Joint CISA/FBI/NSA/NCSC Advisory AA23-347A and Mandiant / Rapid7 threat research, Russian Foreign Intelligence Service (SVR / APT29 / Midnight Blizzard) actors exploited authentication bypass flaws in JetBrains TeamCity CI/CD servers (CVE-2023-42793 and CVE-2024-27198). Attackers minted an administrative access token via /app/rest/users/id:1/tokens/RPC2, enabled debug process execution (/app/rest/debug/processes), harvested CI/CD cloud secrets, and deployed the GraphicalProton backdoor using OneDrive for C2.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'CISA / FBI / NSA / NCSC Joint Advisory AA23-347A & Mandiant / Rapid7 Research',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (CVE-2023-42793 / CVE-2024-27198) · T1059 (TeamCity Debug RCE) · T1102.002 (OneDrive C2)',
    },
    {
      term: 'EXPLOIT ENDPOINTS',
      value: 'POST /app/rest/users/id:1/tokens/RPC2 -> POST /app/rest/debug/processes',
    },
    {
      term: 'APT29 IMPLANT',
      value: 'GraphicalProton (DLL Side-Loaded via Defender / Win32 Binary + OneDrive Graph API C2)',
    },
  ],
  nodes: [
    {
      id: 'apt29_svr_actor',
      label: 'APT29 (Midnight Blizzard)',
      sublabel: '198.51.100.91 (SVR Operator)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Russian SVR (APT29 / Cozy Bear) Infrastructure',
        pidOrPort: 'HTTP/S :8111 / :443 -> TeamCity Server',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /app/rest/users/id:1/tokens/RPC2',
          'DELETE /app/rest/users/id:1/tokens/RPC2 (Token Cleanup)',
        ],
        description:
          'APT29 operator exploiting unauthenticated REST API endpoints on internet-exposed JetBrains TeamCity CI/CD servers.',
      },
    },
    {
      id: 'teamcity_cicd_srv',
      label: 'JetBrains TeamCity CI/CD',
      sublabel: '10.10.12.50:8111 (BUILD-TC-01)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows Server 2022 · JetBrains TeamCity Server',
        pidOrPort: 'java.exe (Tomcat / TeamCity Service)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'teamcity-javaLogging-*.log & teamcity-server.log',
          'internal.properties (rest.debug.processes.enable=true)',
        ],
        description:
          'Enterprise CI/CD build server compromised via CVE-2023-42793 / CVE-2024-27198.',
      },
    },
    {
      id: 'graphical_proton_implant',
      label: 'GraphicalProton Backdoor',
      sublabel: 'aclui.dll Side-Load + OneDrive C2',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'APT29 GraphicalProton C2 Implant (AA23-347A)',
        pidOrPort: 'PID 6740 · Side-Loaded aclui.dll',
        privilege: 'SYSTEM / Build Agent Admin',
        artifacts: [
          'Uses Microsoft OneDrive / Dropbox REST API for C2 Tasking',
          'whoami, netstat, systeminfo & AD Kerberos Ticket Collection',
        ],
        description:
          'APT29 custom backdoor deployed onto the TeamCity server that communicates over legitimate Microsoft Graph / OneDrive endpoints.',
      },
    },
    {
      id: 'cicd_secrets_repo',
      label: 'CI/CD Secrets & Prod Cloud Keys',
      sublabel: 'SSH Keys, kubeconfig & Signing Certs',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Build Pipeline Secret Store & Source Control',
        pidOrPort: 'C:\\ProgramData\\JetBrains\\TeamCity\\config\\projects\\',
        privilege: 'Production Deployment Credentials',
        artifacts: [
          'credentials.json & params.xml (Encrypted Build Secrets)',
          'database.properties & Cloud Deployment Tokens',
        ],
        description:
          'TeamCity project configuration store containing production deployment keys and software signing certificates.',
      },
    },
    {
      id: 'cisa_splunk_siem',
      label: 'Enterprise SIEM & EDR',
      sublabel: 'teamcity-server.log & Sysmon EID 1',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'SOC SIEM & Endpoint Detection',
        pidOrPort: 'TeamCity Access Logs & Sysmon EID 1 / 7',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: CVE-2023-42793 /app/rest/users/id:1/tokens/RPC2 Request',
          'Alert: java.exe Spawning Shell via /app/rest/debug/processes',
        ],
        description:
          'Monitors TeamCity access logs for token creation on user id:1 and java.exe child processes.',
      },
    },
  ],
  processTree: [
    {
      pid: 2240,
      ppid: 680,
      name: 'java.exe (TeamCity Server)',
      commandLine: 'C:\\TeamCity\\jre\\bin\\java.exe -Dcatalina.base=C:\\TeamCity ...',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'RequestInterceptor.preHandle() [Auth Bypassed]',
        'ProcessBuilder("/app/rest/debug/processes").start()',
      ],
    },
    {
      pid: 6740,
      ppid: 2240,
      name: 'Defender.exe (GraphicalProton)',
      commandLine: 'C:\\Windows\\Temp\\Defender.exe (Side-loads malicious aclui.dll)',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'LoadLibraryW("aclui.dll")',
        'WinHttpConnect("graph.microsoft.com")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'TEAMCITY REST API AUTH BYPASS & TOKEN MINTING (CVE-2023-42793)',
      subtitle: 'POST /app/rest/users/id:1/tokens/RPC2 mints SuperAdmin Bearer token',
      description:
        'As documented in CISA AA23-347A, the TeamCity RequestPermissionsInterceptor fails to authenticate requests matching /app/rest/users/id:1/tokens/RPC2 (CVE-2023-42793) or matrix parameter paths /hax?jsp=/app/rest/users;.jsp (CVE-2024-27198). APT29 sends a single HTTP POST to mint an administrative Bearer token for user id:1.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['apt29_svr_actor', 'teamcity_cicd_srv', 'cisa_splunk_siem'],
      compromisedNodeIds: ['teamcity_cicd_srv'],
      keySpecs: [
        { term: 'VULNERABILITIES', value: 'CVE-2023-42793 & CVE-2024-27198 (TeamCity Auth Bypass)' },
        { term: 'TOKEN ENDPOINT', value: 'POST /app/rest/users/id:1/tokens/RPC2' },
        { term: 'CLEANUP STEP', value: 'DELETE /app/rest/users/id:1/tokens/RPC2 immediately after RCE' },
      ],
    },
    {
      index: 2,
      title: 'DEBUG PROCESS RCE & CI/CD SECRET HARVESTING',
      subtitle: 'Enabling rest.debug.processes.enable and executing commands via java.exe',
      description:
        'Authenticating with the minted Bearer token, APT29 modifies internal.properties to set rest.debug.processes.enable=true and invokes POST /app/rest/debug/processes?exePath=cmd.exe, executing arbitrary commands as NT AUTHORITY\\SYSTEM and dumping TeamCity project secrets (credentials.json) and database.properties.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.003',
      mitreTechniqueName: 'Command and Scripting Interpreter: Windows Command Shell',
      activeNodeIds: ['apt29_svr_actor', 'teamcity_cicd_srv', 'cicd_secrets_repo', 'cisa_splunk_siem'],
      compromisedNodeIds: ['teamcity_cicd_srv', 'cicd_secrets_repo'],
      keySpecs: [
        { term: 'RCE ENDPOINT', value: 'POST /app/rest/debug/processes?exePath=cmd.exe&params=/c+...' },
        { term: 'PARENT PROCESS', value: 'C:\\TeamCity\\jre\\bin\\java.exe (NT AUTHORITY\\SYSTEM)' },
        { term: 'HARVESTED SECRETS', value: 'config\\projects\\*\\pluginData\\secure\\credentials.json' },
      ],
    },
    {
      index: 3,
      title: 'GRAPHICALPROTON IMPLANT & ONEDRIVE GRAPH API C2',
      subtitle: 'Deploying DLL side-loaded GraphicalProton communicating via Microsoft OneDrive',
      description:
        'To maintain stealthy long-term access after deleting the RPC2 token, APT29 deploys GraphicalProton (a trojanized aclui.dll side-loaded by a signed binary) which uses legitimate Microsoft OneDrive / Graph API endpoints for encrypted Command and Control (T1102.002).',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1102.002',
      mitreTechniqueName: 'Web Service: Bidirectional Communication',
      activeNodeIds: ['teamcity_cicd_srv', 'graphical_proton_implant', 'cisa_splunk_siem'],
      compromisedNodeIds: ['teamcity_cicd_srv', 'cicd_secrets_repo', 'graphical_proton_implant'],
      keySpecs: [
        { term: 'BACKDOOR FAMILY', value: 'GraphicalProton (APT29 / Midnight Blizzard)' },
        { term: 'C2 TRANSPORT', value: 'Microsoft Graph / OneDrive REST API (api.onedrive.com)' },
        { term: 'CISA ADVISORY', value: 'AA23-347A (SVR Exploitation of JetBrains TeamCity)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'man-tc-1',
      no: 1,
      stageIndex: 1,
      timestamp: '22:14:03.118',
      sourceNodeId: 'apt29_svr_actor',
      targetNodeId: 'teamcity_cicd_srv',
      sourceLabel: '198.51.100.91',
      targetLabel: 'TeamCity :8111',
      sourceType: 'NETWORK',
      protocolOrEventId: 'TeamCity Access Log',
      shortAction: 'MINT RPC2 TOKEN',
      info: 'POST /app/rest/users/id:1/tokens/RPC2 HTTP/1.1 -> 200 OK (Admin Token Created)',
      sizeOrCode: 'CVE-2023-42793',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'CISA AA23-347A highlights that CVE-2023-42793 exploitation is logged in TeamCity access logs as an unauthenticated POST to /app/rest/users/id:1/tokens/RPC2.',
      rawLog: `198.51.100.91 - - [13/Nov/2024:22:14:03 +0000] "POST /app/rest/users/id:1/tokens/RPC2 HTTP/1.1" 200 142 "-" "Mozilla/5.0"
198.51.100.91 - - [13/Nov/2024:22:14:04 +0000] "POST /admin/dataDir.html?action=edit&fileName=config/internal.properties&content=rest.debug.processes.enable=true HTTP/1.1" 200 -
198.51.100.91 - - [13/Nov/2024:22:14:08 +0000] "DELETE /app/rest/users/id:1/tokens/RPC2 HTTP/1.1" 204 -`,
      detectionRule: {
        type: 'SIGMA',
        title: 'CISA AA23-347A — JetBrains TeamCity Auth Bypass Token Creation (CVE-2023-42793)',
        ruleCode: `title: JetBrains TeamCity Unauthenticated Admin Token Creation
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains:
      - '/app/rest/users/id:1/tokens'
      - '/app/rest/debug/processes'
      - ';.jsp'
  condition: selection
level: critical`,
        mitigation:
          'Upgrade JetBrains TeamCity to patched versions fixing CVE-2023-42793 and CVE-2024-27198 and never expose CI/CD management ports directly to the internet.',
      },
    },
    {
      id: 'man-tc-2',
      no: 2,
      stageIndex: 2,
      timestamp: '22:14:05.490',
      sourceNodeId: 'teamcity_cicd_srv',
      targetNodeId: 'cicd_secrets_repo',
      sourceLabel: 'java.exe (TeamCity)',
      targetLabel: 'cmd.exe / debug/processes',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1',
      shortAction: 'TEAMCITY DEBUG RCE',
      info: 'ParentImage=C:\\TeamCity\\jre\\bin\\java.exe CommandLine="cmd.exe /c curl -o C:\\Windows\\Temp\\Defender.exe ..."',
      sizeOrCode: 'PID 6740',
      severity: 'CRITICAL',
      mitreId: 'T1059.003',
      explanation:
        'Invoking /app/rest/debug/processes causes the TeamCity java.exe server process (not a build agent) to spawn cmd.exe / powershell.exe.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>1</EventID>
    <Computer>BUILD-TC-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="ProcessId">6740</Data>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c C:\\Windows\\Temp\\Defender.exe</Data>
    <Data Name="ParentProcessId">2240</Data>
    <Data Name="ParentImage">C:\\TeamCity\\jre\\bin\\java.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'JetBrains TeamCity Server Spawning Suspicious Shell Process',
        ruleCode: `title: TeamCity Server Java Process Spawning Shell
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|contains: '\\TeamCity\\'
    ParentImage|endswith: '\\java.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\whoami.exe'
  condition: selection
level: critical`,
        mitigation:
          'Rotate all secrets, SSH keys, and code-signing certificates stored in TeamCity config\\projects\\*\\pluginData\\secure\\.',
      },
    },
    {
      id: 'man-tc-3',
      no: 3,
      stageIndex: 3,
      timestamp: '22:14:11.820',
      sourceNodeId: 'graphical_proton_implant',
      targetNodeId: 'cisa_splunk_siem',
      sourceLabel: 'Defender.exe (PID 6740)',
      targetLabel: 'aclui.dll -> OneDrive C2',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 & 3',
      shortAction: 'GRAPHICALPROTON C2',
      info: 'Image=C:\\Windows\\Temp\\Defender.exe ImageLoaded=C:\\Windows\\Temp\\aclui.dll -> api.onedrive.com:443',
      sizeOrCode: 'OneDrive C2',
      severity: 'HIGH',
      mitreId: 'T1102.002',
      explanation:
        'CISA AA23-347A details APT29 side-loading aclui.dll (GraphicalProton) and polling Microsoft OneDrive APIs for C2 tasking.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon"/>
    <EventID>7</EventID>
    <Computer>BUILD-TC-01.corp.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\Temp\\Defender.exe</Data>
    <Data Name="ImageLoaded">C:\\Windows\\Temp\\aclui.dll</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'SIGMA',
        title: 'APT29 GraphicalProton aclui.dll Side-Loading (CISA AA23-347A)',
        ruleCode: `title: APT29 GraphicalProton DLL Side-Loading of aclui.dll
logsource:
  category: image_load
  product: windows
detection:
  selection:
    ImageLoaded|endswith: '\\aclui.dll'
    Signed: 'false'
  condition: selection
level: critical`,
        mitigation:
          'Block unsigned aclui.dll loads outside C:\\Windows\\System32\\ and restrict outbound connections from build servers to cloud storage APIs.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    briefing: {
      headline: 'Scenario Briefing: APT29 JetBrains TeamCity Exploitation (CVE-2023-42793), CI/CD Build Server Takeover',
      storyAnalogy:
        'Imagine a high-security software factory (a JetBrains TeamCity CI/CD server) where the security gate has a sloppy rule written on its clipboard: "Anyone walking to a door whose name ends with /RPC2 doesn’t need to show an ID badge." The attacker walks up to the Super-Admin Key Minting machine (/app/rest/users/id:1/tokens/) and asks it to print a new master key named RPC2 (/app/rest/users/id:1/tokens/RPC2). Because the URL ends with /RPC2, the gate lets them right through, and the machine prints a permanent Super-Admin Bearer Token on the spot!',
      plainSummary:
        'In this scenario (CVE-2023-42793, Mandiant & CISA - APT29 (Midnight Blizzard): JetBrains TeamCity RCE & GraphicalProton), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: appending "/RPC2" to Mint an Admin Bearer, then using the Admin Token to Unlock the Internal, then harvesting CI/CD Build Secrets, Deploying. Steps #1–#3 walk that chain end-to-end by covering Appending "/RPC2" to Mint an Admin Bearer, then Using the Admin Token to Unlock the Internal, then Harvesting CI/CD Build Secrets, Deploying, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Node ① (APT29 Operator) sends the unauthenticated /app/rest/users/id:1/tokens/RPC2 request through Node ② (Reverse Proxy) to Node ③ (TeamCity CI/CD Server). Inside TeamCity, Node ④ (REST Token Minter & debug/processes Executor) spawns commands and steals build secrets from Node ⑤ (Signing Keys & AD Vault), monitored by Node ⑥ (SIEM).',
      documentedAdvisory: 'SonarSource & Rapid7 CVE-2023-42793 Root-Cause · CISA/FBI/NSA/NCSC & Mandiant APT29 Advisory · MITRE ATT&CK T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Appending "/RPC2" to Mint an Admin Bearer Token Without Logging In (CVE-2023-42793)',
        storyAnalogy:
          'The developer meant to exempt only the root /RPC2 path from login checks, but wrote /**/RPC2, accidentally exempting every URL in the entire server that ends with /RPC2. Requesting /app/rest/users/id:1/tokens/RPC2 tricks TeamCity into creating a new admin token named "RPC2" for User ID 1 without asking for a password.',
        simpleExplanation:
          'As detailed by SonarSource and Rapid7, in vulnerable TeamCity versions the RequestInterceptors authentication filter excluded any URL matching //RPC2 from login checks (intended only to exempt the legacy XML-RPC endpoint at /RPC2, but the leading "/" Ant-path wildcard accidentally exempted every URL on the server that ended with "/RPC2"). The attacker exploits this by sending an unauthenticated HTTP POST request to /app/rest/users/id:1/tokens/RPC2 (where "id:1" targets the primary built-in Super-Administrator account, and the REST API interprets the trailing "/RPC2" simply as the name to give the new token, causing TeamCity to mint and return a full Super-Admin Bearer token in the HTTP 200 response without asking for a password).',
        howItWorksInPractice:
          'Because TeamCity’s REST API endpoint for creating access tokens follows the URL template /app/rest/users/{userLocator}/tokens/{tokenName}, naming the token "RPC2" satisfies both the REST controller parameter and the /**/RPC2 authentication-bypass wildcard simultaneously (CVE-2023-42793). In the documented TeamCity Access Log exchange from APT29 (Midnight Blizzard) to DMZ Reverse Proxy & SPAN Tap, DMZ Reverse Proxy & SPAN Tap responds with RESP CVE-2023-42793 (confirming that the MINT RPC2 TOKEN request succeeded on DMZ Reverse Proxy & SPAN Tap and establishing the runtime state required for Step #2 DEBUG PROCESS RCE & CI/CD SECRET HARVESTING).',
        diagramAlignment:
          'On the diagram, arrow #1→ sends POST /app/rest/users/id:1/tokens/RPC2 from Node ①/② to Node ③ (TeamCity Server), and ⇠#1 returns the plaintext admin Bearer token.',
        detectionAndEvidence:
          'Documented in TeamCity teamcity-javaLogging and access logs (web server audit records of token minting): POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE /app/rest/users/id:1/tokens/RPC2 (showing unauthenticated creation and cleanup of an administrator bearer token). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059',
        plainTitle: 'Using the Admin Token to Unlock the Internal Debug Process Executor (/app/rest/debug/processes)',
        storyAnalogy:
          'Holding the freshly minted Super-Admin token, the attacker flips on a hidden "Developer Debug Terminal" switch (rest.debug.processes.enable=true), runs their operating-system commands, and then immediately shreds the RPC2 token so admins checking the active token list see nothing.',
        simpleExplanation:
          'Authenticating with Authorization: Bearer <token>, the attacker first sets the internal server property rest.debug.processes.enable=true (unlocking a hidden administrative diagnostic feature that is disabled by default), and then sends POST requests to /app/rest/debug/processes?exePath=cmd.exe&params=/c+... (telling the TeamCity Java server to spawn arbitrary OS commands on the underlying host). Seconds later, the attacker sends DELETE /app/rest/users/id:1/tokens/RPC2 (erasing the "RPC2" token right after creating a stealthier backdoor so an administrator checking the active tokens page in the UI sees nothing suspicious).',
        howItWorksInPractice:
          'Although deleting the RPC2 token removes it from the current UI token table, the token creation and deletion events remain recorded in logs/teamcity-activities.log and child process creations are captured by endpoint telemetry. In the documented Sysmon EID 1 exchange from DMZ Reverse Proxy & SPAN Tap to JetBrains TeamCity CI/CD, JetBrains TeamCity CI/CD responds with ACK PID 6740 (confirming that the TEAMCITY DEBUG RCE request succeeded on JetBrains TeamCity CI/CD and establishing the runtime state required for Step #3 GRAPHICALPROTON IMPLANT & ONEDRIVE GRAPH API C2).',
        diagramAlignment:
          'On the diagram, arrow #2→ invokes /app/rest/debug/processes on Node ④ (TeamCity JVM Process Spawner), and ⇠#2 spawns the child shell process.',
        detectionAndEvidence:
          'Documented by Mandiant (post-exploitation telemetry from build server compromises): POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl (confirming remote command execution from the build management service). Correlate Sysmon or Windows Security Event telemetry for T1059.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Harvesting CI/CD Build Secrets, Deploying GraphicalProton & Pivoting into Active Directory',
        storyAnalogy:
          'Because the CI/CD build server is the automated assembly line that deploys software to every cloud and server in the company, taking over this one room hands the attacker the master keys to cloud deployments, source code, and code-signing certificates.',
        simpleExplanation:
          'Because a CI/CD build server is the central factory that compiles software and deploys it into production, it stores high-privilege secrets (AWS/Azure deployment keys, GitHub SSH keys, and Authenticode code-signing certificates). As documented by Mandiant and CISA, APT29 extracts TeamCity’s encryption keys (encryption-config.xml, allowing them to decrypt every stored cloud and database password in the CI/CD database), sideloads their GraphicalProton backdoor via DLL hijacking (using Microsoft OneDrive and Dropbox Graph APIs for encrypted C2), and pivots into Active Directory.',
        howItWorksInPractice:
          'Compromising a CI/CD server gives the attacker a force-multiplier: they can both steal production cloud credentials stored in build variables and inject malicious code into software packages being built and signed by the server. In the documented Sysmon EID 7 & 3 exchange from JetBrains TeamCity CI/CD to GraphicalProton Backdoor, GraphicalProton Backdoor responds with ACK OneDrive C2 (confirming that the GRAPHICALPROTON C2 request succeeded on GraphicalProton Backdoor and completing the final execution objective of Mandiant & CISA, APT29 (Midnight Blizzard): JetBrains TeamCity RCE & GraphicalProton).',
        diagramAlignment:
          'On the diagram, arrow #3→ extracts secrets from Node ⑤ (CI/CD Vault & AD) via Node ④ while Node ⑥ (SIEM) triggers on TeamCity child process and token anomalies.',
        detectionAndEvidence:
          'Documented in Joint CISA Advisory and Mandiant (long-term persistence and C2 indicators): Creation of new TeamCity admin accounts in teamcity-activities.log and GraphicalProton OneDrive C2 beacons (revealing persistent administrative access and covert cloud exfiltration). Correlate Sysmon or Windows Security Event telemetry for T1102.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A factory assembly hub locks its supervisor offices behind a strict badge reader, yet an old side-door bell lets anyone mint a fresh master badge without showing identification. With that freshly minted badge, an intruder unlocks the factory repair console, steals product blueprints, and opens a covert courier drop to an outside locker.',
        storyMappings: [
          {
            storyTerm: 'Factory assembly hub',
            technicalTerm: 'JetBrains TeamCity build automation server',
            tone: 'amber',
          },
          {
            storyTerm: 'Old side-door bell',
            technicalTerm: 'Unauthenticated /RPC2 route bypass (CVE-2023-42793)',
            tone: 'sky',
          },
          {
            storyTerm: 'Factory repair console',
            technicalTerm: 'Internal debug process execution API',
            tone: 'rose',
          },
          {
            storyTerm: 'Outside courier locker',
            technicalTerm: 'Cloud-hosted command-and-control channel',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider rings a legacy service bell tagged onto the badge-printer route. Because the guard desk exempts that legacy bell from badge checks, the printer immediately issues a shiny master supervisor keycard.',
          storyMappings: [
            {
              storyTerm: 'Legacy service bell',
              technicalTerm: 'Appended /RPC2 URL suffix bypassing auth filter',
              tone: 'amber',
            },
            {
              storyTerm: 'Badge-printer route',
              technicalTerm: 'REST endpoint /app/rest/users/id:1/tokens/',
              tone: 'sky',
            },
            {
              storyTerm: 'Master supervisor keycard',
              technicalTerm: 'Minted administrator Bearer authentication token',
              tone: 'rose',
            },
            {
              storyTerm: 'Guard desk exemption',
              technicalTerm: 'Path-matching authentication flaw (CVE-2023-42793)',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in TeamCity teamcity-javaLogging and access logs (web server audit records of token minting): POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE /app/rest/users/id:1/tokens/RPC2 (showing unauthenticated creation and cleanup of an administrator bearer token). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'Holding the newly minted keycard, the intruder flips the maintenance switch that enables direct workshop commands and sends a discovery checklist straight through the factory supervisor terminal.',
          storyMappings: [
            {
              storyTerm: 'Maintenance switch',
              technicalTerm: 'Internal debug property enabling process execution',
              tone: 'amber',
            },
            {
              storyTerm: 'Factory supervisor terminal',
              technicalTerm: 'POST /app/rest/debug/processes endpoint',
              tone: 'sky',
            },
            {
              storyTerm: 'Discovery checklist',
              technicalTerm: 'Executed reconnaissance commands (whoami, nltest, curl)',
              tone: 'rose',
            },
            {
              storyTerm: 'Assembly controller process',
              technicalTerm: 'Server java.exe runtime spawning child utilities',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Mandiant (post-exploitation telemetry from build server compromises): POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl (confirming remote command execution from the build management service). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1059.003 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        3: {
          storyAnalogy:
            'Now roaming the assembly floor, the intruder copies signing seals and vault combinations from the build lockers, registers a backup supervisor account, and drops a quiet messenger beacon synced to a public storage shelf.',
          storyMappings: [
            {
              storyTerm: 'Build locker combinations',
              technicalTerm: 'Harvested CI/CD credentials and repository tokens',
              tone: 'amber',
            },
            {
              storyTerm: 'Backup supervisor account',
              technicalTerm: 'Newly created rogue TeamCity administrator',
              tone: 'sky',
            },
            {
              storyTerm: 'Quiet messenger beacon',
              technicalTerm: 'GraphicalProton backdoor implant',
              tone: 'rose',
            },
            {
              storyTerm: 'Public storage shelf',
              technicalTerm: 'Abused OneDrive cloud C2 communication channel',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Joint CISA Advisory and Mandiant (long-term persistence and C2 indicators): Creation of new TeamCity admin accounts in teamcity-activities.log and GraphicalProton OneDrive C2 beacons (revealing persistent administrative access and covert cloud exfiltration). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1102.002 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
