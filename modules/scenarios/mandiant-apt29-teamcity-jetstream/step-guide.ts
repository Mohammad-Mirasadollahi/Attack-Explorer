import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    briefing: {
      headline: 'Scenario Briefing: APT29 JetBrains TeamCity Exploitation (CVE-2023-42793), CI/CD Build Server Takeover',
      storyAnalogy:
        'Imagine a high-security software factory (a JetBrains TeamCity CI/CD server) where the security gate has a sloppy rule written on its clipboard: "Anyone walking to a door whose name ends with /RPC2 doesn’t need to show an ID badge." The attacker walks up to the Super-Admin Key Minting machine (/app/rest/users/id:1/tokens/) and asks it to print a new master key named RPC2 (/app/rest/users/id:1/tokens/RPC2). Because the URL ends with /RPC2, the gate lets them right through, and the machine prints a permanent Super-Admin Bearer Token on the spot!',
      plainSummary:
        'Synthesizing SonarSource & Rapid7’s Java servlet root-cause analysis with the Joint CISA/FBI/NSA/NCSC & Mandiant APT29 Advisory (October 2023), this scenario shows how APT29 (Midnight Blizzard) exploited CVE-2023-42793 in on-premises JetBrains TeamCity CI/CD servers. Because an authentication wildcard flaw (/**/RPC2 inside TeamCity’s RequestInterceptors class) allowed anyone to reach internal REST paths that ended with "/RPC2" without logging in, the attacker sent a single unauthenticated POST request (/app/rest/users/id:1/tokens/RPC2) to mint a permanent administrator bearer token for User ID 1, enabled the hidden internal debug command endpoint (/app/rest/debug/processes), and deployed the GraphicalProton backdoor.',
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
          'Documented in TeamCity teamcity-javaLogging / access logs: POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE /app/rest/users/id:1/tokens/RPC2.',
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
          'Documented by Mandiant: POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl.',
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
          'Documented in Joint CISA Advisory & Mandiant: Creation of new TeamCity admin accounts in teamcity-activities.log and GraphicalProton OneDrive C2 beacons.',
      },
    ],
  };
