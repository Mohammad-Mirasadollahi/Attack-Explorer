import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'unit42-star-blizzard-evilginx-aitm',
  code: 'T1539',
  name: 'Microsoft, Unit 42 & CISA — Star Blizzard / Storm-0539: Evilginx AiTM Cookie Theft',
  shortSubtitle: 'Microsoft Threat Intel / Unit 42 / CISA AA23-341A · AiTM Reverse Proxy, ESTSAUTH Cookie & Inbox Rules',
  category: 'NETWORK_WEB',
  severity: 'HIGH',
  primaryMitrePhase: 5,
  overview:
    'Documented by Microsoft Threat Intelligence, Palo Alto Networks Unit 42, and CISA Joint Advisory AA23-341A, actors such as Star Blizzard (SEABORGIUM / COLDRIVER) and Storm-0539 deploy Evilginx Adversary-in-the-Middle (AiTM) reverse-proxy phishing frameworks. The proxy relays real-time authentication traffic between the victim and login.microsoftonline.com, satisfies TOTP/Push MFA, steals the resulting ESTSAUTH / ESTSAUTHPERSISTENT session cookies, and replays them to create hidden Exchange Inbox rules.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence, Palo Alto Unit 42 & CISA Advisory AA23-341A',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1566.002 (Spearphishing Link) · T1539 (Steal Web Session Cookie) · T1550.004 (Pass the Cookie)',
    },
    {
      term: 'STOLEN ARTIFACT',
      value: 'ESTSAUTH & ESTSAUTHPERSISTENT Session Cookies (Bypassing Non-FIDO2 MFA)',
    },
    {
      term: 'POST-EXPLOIT PERSISTENCE',
      value: 'Exchange Online New-InboxRule (DeleteMessage/MoveToFolder) & Secondary MFA Registration',
    },
  ],
  nodes: [
    {
      id: 'evilginx_aitm_proxy',
      label: 'Evilginx3 AiTM Reverse Proxy',
      sublabel: 'login.corp-verify-sso.com (198.51.100.44)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Evilginx3 Adversary-in-the-Middle Reverse Proxy',
        pidOrPort: 'HTTPS :443 (LetsEncrypt TLS Certificate)',
        privilege: 'Attacker Phishing Infrastructure',
        artifacts: [
          'Phishlet: o365 / login.microsoftonline.com Reverse Proxy',
          'Captured Cookie: ESTSAUTHPERSISTENT=0.AXEA...',
        ],
        description:
          'Attacker-controlled reverse proxy that transparently proxies the legitimate Microsoft Entra ID sign-in and MFA flow while logging Set-Cookie headers.',
      },
    },
    {
      id: 'victim_exec_browser',
      label: 'Target User Browser (WKS-EXEC-01)',
      sublabel: '10.10.20.14 · Chrome Session',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows 11 Executive Workstation',
        pidOrPort: 'chrome.exe -> PDF QR / Link Lure',
        privilege: 'Executive Mailbox & Cloud User',
        artifacts: [
          'Approves Authenticator Push / Enters 6-Digit TOTP Code',
          'Session Request Correlation ID: 9f4c2a10-...',
        ],
        description:
          'Victim workstation tricked into authenticating through the Evilginx reverse proxy domain.',
      },
    },
    {
      id: 'ests_cookie_replay',
      label: 'Cookie Replay Session (Pass-the-Cookie)',
      sublabel: 'ESTSAUTHPERSISTENT Replay via VPN',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Attacker Headless Browser Injecting Stolen Cookie',
        pidOrPort: 'Cookie: ESTSAUTHPERSISTENT (Same SessionId)',
        privilege: 'Authenticated MFA Session',
        artifacts: [
          'Reuses Original CorrelationId / SessionId from Different IP & ASN',
          'Bypasses MFA Challenge via Valid Session Cookie',
        ],
        description:
          'Attacker browser session injecting the captured ESTSAUTHPERSISTENT cookie from a different IP address within seconds of victim login.',
      },
    },
    {
      id: 'm365_outlook_cloud',
      label: 'Entra ID & Exchange Online',
      sublabel: 'login.microsoftonline.com & Outlook Web',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Microsoft 365 Identity & Exchange Cloud',
        pidOrPort: 'HTTPS :443 (ESTS & OWA REST API)',
        privilege: 'Executive Cloud Mailbox',
        artifacts: [
          'New-InboxRule (MoveToFolder: RSS Feeds, MarkAsRead: true)',
          'Entra ID: User registered security info',
        ],
        description:
          'Cloud identity and mailbox service where the replayed cookie is used to hide incoming security alerts via Inbox rules and exfiltrate sensitive emails.',
      },
    },
    {
      id: 'defender_identity_siem',
      label: 'Microsoft Defender XDR & Sentinel',
      sublabel: 'Anomalous Token & InboxRule Detector',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Identity Protection & Cloud SIEM',
        pidOrPort: 'Entra ID RiskEvents & M365 UnifiedAuditLog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: AiTM Phishing & Session Cookie Replay (Same SessionId, Two IPs)',
          'Alert: Suspicious Inbox Rule Hiding Emails in RSS Subscriptions',
        ],
        description:
          'Correlates identical Entra ID SessionId / OriginalRequestId values across two distinct autonomous systems (ASNs) followed by New-InboxRule.',
      },
    },
  ],
  processTree: [
    {
      pid: 8120,
      ppid: 1,
      name: 'evilginx3',
      commandLine: './evilginx -p ./phishlets -d corp-verify-sso.com',
      user: 'root (AiTM Proxy)',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'TLS_Intercept("login.microsoftonline.com")',
        'CaptureSetCookie("ESTSAUTHPERSISTENT")',
      ],
    },
    {
      pid: 8490,
      ppid: 8120,
      name: 'OWA-Cookie-Replayer',
      commandLine: 'POST https://outlook.office365.com/owa/service.svc?action=New-InboxRule',
      user: 'cfo@corp.local (Hijacked Session)',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['InjectCookie("ESTSAUTHPERSISTENT")', 'New-InboxRule("MoveToFolder:RSS")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'EVILGINX AITM REVERSE-PROXY MFA INTERCEPTION',
      subtitle: 'Relaying login.microsoftonline.com and capturing ESTSAUTHPERSISTENT',
      description:
        'The victim clicks a phishing link pointing to login.corp-verify-sso.com. Evilginx proxies the request live to login.microsoftonline.com, relays the victim password and TOTP/Authenticator push approval, and intercepts the Set-Cookie header containing ESTSAUTH and ESTSAUTHPERSISTENT.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1539',
      mitreTechniqueName: 'Steal Web Session Cookie',
      activeNodeIds: ['victim_exec_browser', 'evilginx_aitm_proxy', 'm365_outlook_cloud'],
      compromisedNodeIds: ['victim_exec_browser'],
      keySpecs: [
        { term: 'AITM PROXY', value: 'Evilginx3 Reverse Proxy (login.corp-verify-sso.com)' },
        { term: 'CAPTURED COOKIE', value: 'ESTSAUTH & ESTSAUTHPERSISTENT (Post-MFA Token)' },
        { term: 'BYPASSED CONTROL', value: 'SMS, Voice, TOTP & Push Notification MFA' },
      ],
    },
    {
      index: 2,
      title: 'WEB SESSION COOKIE REPLAY (PASS-THE-COOKIE)',
      subtitle: 'Replaying stolen ESTSAUTHPERSISTENT cookie from a second IP address',
      description:
        'The attacker imports the captured ESTSAUTHPERSISTENT cookie into their own browser session on a different IP/ASN. Because the cookie already carries the MFA claim from the Evilginx proxy session, Microsoft 365 grants immediate access without prompting for MFA again.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1550.004',
      mitreTechniqueName: 'Use Alternate Authentication Material: Web Session Cookie',
      activeNodeIds: ['evilginx_aitm_proxy', 'ests_cookie_replay', 'm365_outlook_cloud', 'defender_identity_siem'],
      compromisedNodeIds: ['victim_exec_browser', 'ests_cookie_replay', 'm365_outlook_cloud'],
      keySpecs: [
        { term: 'FORENSIC ARTIFACT', value: 'Same SessionId / CorrelationId seen from 2 different IPs/ASNs' },
        { term: 'TECHNIQUE', value: 'T1550.004 (Pass the Cookie)' },
        { term: 'RISK EVENT', value: 'anomalousToken / unfamiliarFeatures in Entra ID' },
      ],
    },
    {
      index: 3,
      title: 'STEALTH INBOX RULE CREATION & BEC EXFILTRATION',
      subtitle: 'Creating New-InboxRule to hide security emails in RSS Feeds folder',
      description:
        'Within minutes of session hijack, the attacker calls the Outlook Web API to create a hidden Inbox rule (New-InboxRule) that automatically marks incoming emails containing "security", "phishing", or "invoice" as read and moves them to the RSS Subscriptions or Conversation History folder.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1564.008',
      mitreTechniqueName: 'Hide Artifacts: Email Hiding Rules',
      activeNodeIds: ['ests_cookie_replay', 'm365_outlook_cloud', 'defender_identity_siem'],
      compromisedNodeIds: ['victim_exec_browser', 'ests_cookie_replay', 'm365_outlook_cloud'],
      keySpecs: [
        { term: 'EXCHANGE AUDIT', value: 'Operation="New-InboxRule" MoveToFolder="RSS Feeds" MarkAsRead="True"' },
        { term: 'MITRE TECHNIQUE', value: 'T1564.008 (Email Hiding Rules)' },
        { term: 'DEFENSE COUNTERMEASURE', value: 'FIDO2 / WebAuthn Device-Bound Passkeys + Token Protection' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'u42-aitm-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:30:14.082',
      sourceNodeId: 'evilginx_aitm_proxy',
      targetNodeId: 'm365_outlook_cloud',
      sourceLabel: '198.51.100.44 (Evilginx)',
      targetLabel: 'login.microsoftonline.com',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Entra SignInLogs (AiTM)',
      shortAction: 'AITM PROXY AUTH',
      info: 'UserPrincipalName=cfo@corp.local IPAddress=198.51.100.44 SessionId=7a91b2c0-1122-3344-5566-77889900aabb',
      sizeOrCode: 'ESTSAUTH Issued',
      severity: 'HIGH',
      mitreId: 'T1539',
      explanation:
        'The initial interactive MFA sign-in in Entra ID originates from the Evilginx VPS IP (198.51.100.44) rather than the corporate office egress IP.',
      rawLog: `{
  "Category": "SignInLogs",
  "ResultType": "0",
  "UserPrincipalName": "cfo@corp.local",
  "IPAddress": "198.51.100.44",
  "AutonomousSystemNumber": 14061,
  "SessionId": "7a91b2c0-1122-3344-5566-77889900aabb",
  "AuthenticationRequirement": "multiFactorAuthentication",
  "AppDisplayName": "Office 365 Exchange Online"
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Entra ID Same SessionId Used Across Multiple IP Addresses (AiTM Replay)',
        ruleCode: `SigninLogs
| where ResultType == 0
| summarize IPCount = dcount(IPAddress), IPs = make_set(IPAddress), ASNs = make_set(AutonomousSystemNumber) by UserPrincipalName, SessionId
| where IPCount >= 2 and array_length(ASNs) >= 2`,
        mitigation:
          'Enforce FIDO2 / WebAuthn phishing-resistant MFA (which binds TLS channel / origin domain) and Conditional Access Token Protection.',
      },
    },
    {
      id: 'u42-aitm-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:31:02.419',
      sourceNodeId: 'ests_cookie_replay',
      targetNodeId: 'm365_outlook_cloud',
      sourceLabel: '203.0.113.55 (Attacker)',
      targetLabel: 'Outlook Web (OWA)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'AADNonInteractiveSignIn',
      shortAction: 'COOKIE REPLAY',
      info: 'SessionId=7a91b2c0-1122-3344-5566-77889900aabb Replayed from New IP 203.0.113.55',
      sizeOrCode: 'MFA Bypassed',
      severity: 'CRITICAL',
      mitreId: 'T1550.004',
      explanation:
        'Less than 60 seconds later, the exact same SessionId (7a91b2c0-...) is used from a second external IP (203.0.113.55) to access Exchange Online.',
      rawLog: `{
  "Category": "AADNonInteractiveUserSignInLogs",
  "ResultType": "0",
  "UserPrincipalName": "cfo@corp.local",
  "IPAddress": "203.0.113.55",
  "AutonomousSystemNumber": 9009,
  "SessionId": "7a91b2c0-1122-3344-5566-77889900aabb",
  "ResourceDisplayName": "Office 365 Exchange Online"
}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Microsoft Entra ID AiTM Session Cookie Replay Detection',
        ruleCode: `title: Entra ID Session Token Replay Across Distinct ASNs
logsource:
  product: azure
  service: signinlogs
detection:
  selection:
    ResultType: 0
  condition: selection
level: critical`,
        mitigation:
          'Configure Continuous Access Evaluation (CAE) and automatic session revocation when anomalous token replay is detected.',
      },
    },
    {
      id: 'u42-aitm-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:31:48.990',
      sourceNodeId: 'ests_cookie_replay',
      targetNodeId: 'defender_identity_siem',
      sourceLabel: 'cfo@corp.local (Hijacked)',
      targetLabel: 'Exchange UnifiedAuditLog',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Exchange New-InboxRule',
      shortAction: 'HIDE INBOX RULE',
      info: 'Operation=New-InboxRule SubjectContainsWords="Security;Phishing;Invoice" MoveToFolder="RSS Feeds" MarkAsRead=True',
      sizeOrCode: 'Rule Created',
      severity: 'CRITICAL',
      mitreId: 'T1564.008',
      explanation:
        'Microsoft Threat Intelligence notes that Storm-0539 and Star Blizzard immediately create obfuscated Inbox rules moving security/finance emails to RSS Feeds or Conversation History.',
      rawLog: `{
  "CreationTime": "2024-11-13T10:31:48",
  "Operation": "New-InboxRule",
  "Workload": "Exchange",
  "UserId": "cfo@corp.local",
  "ClientIP": "203.0.113.55",
  "Parameters": [
    { "Name": "Name", "Value": "." },
    { "Name": "SubjectContainsWords", "Value": "Security;Phishing;Invoice;Wire" },
    { "Name": "MoveToFolder", "Value": "RSS Feeds" },
    { "Name": "MarkAsRead", "Value": "True" },
    { "Name": "StopProcessingRules", "Value": "True" }
  ]
}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Suspicious Exchange Inbox Rule Moving Messages to RSS Feeds',
        ruleCode: `title: Suspicious Exchange Online Inbox Rule Hiding Messages
logsource:
  product: m365
  service: exchange
detection:
  selection:
    Operation:
      - 'New-InboxRule'
      - 'Set-InboxRule'
    Parameters.MoveToFolder|contains:
      - 'RSS'
      - 'Conversation History'
      - 'Deleted Items'
    Parameters.MarkAsRead: 'True'
  condition: selection
level: high`,
        mitigation:
          'Alert on any New-InboxRule or Set-InboxRule with single-character names (".", "_") or rules moving mail to RSS Feeds / Deleted Items.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    briefing: {
      headline: 'Scenario Briefing: Star Blizzard (SEABORGIUM / COLDRIVER), Evilginx Adversary-in-the-Middle (AiTM) Session Cookie Theft',
      storyAnalogy:
        'Imagine a fake ATM booth placed right in front of a real bank window with a two-way mirror between them. When you walk up and type your PIN and tap your 6-digit phone MFA code, the fake booth immediately types those exact digits into the real bank window behind the glass. The real bank says: "Welcome! Here is your golden VIP Day Pass (ESTSAUTHPERSISTENT cookie)." The fake booth photocopies your golden Day Pass as it hands it to you, and now the thief can walk into the bank all day using their copy of your pass without ever needing your phone again.',
      plainSummary:
        'In this scenario (T1539, Microsoft, Unit 42 & CISA - Star Blizzard / Storm-0539: Evilginx AiTM Cookie Theft), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: victim Opens the Spear-Phishing Link, then relaying the Victim’s Password, then injecting the Stolen ESTSAUTHPERSISTENT. Steps #1–#3 walk that chain end-to-end by covering Victim Opens the Spear-Phishing Link, then Relaying the Victim’s Password, then Injecting the Stolen ESTSAUTHPERSISTENT, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/③ (Victim Browser clicking the spear-phishing link), trace the live reverse-proxy relay through Node ②/④ (Evilginx AiTM Proxy Server) to the real Node ⑤ (Microsoft Entra ID login.microsoftonline.com), and see how Evilginx captures the ESTSAUTHPERSISTENT cookie in transit while Node ⑥ (Entra Identity Protection / SIEM) flags the session replay.',
      documentedAdvisory: 'Microsoft Threat Intelligence AiTM Phishing Report · CISA Star Blizzard Advisory · MITRE T1557 / T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1566.002',
        plainTitle: 'Victim Opens the Spear-Phishing Link & Evilginx Proxies the Real Microsoft Login Page Live',
        storyAnalogy:
          'The victim clicks a link to view a PDF document and lands at the two-way-mirror booth (Evilginx). Because the booth is relaying the real Microsoft login screen live from behind the glass, every logo, font, and custom company banner looks 100% authentic.',
        simpleExplanation:
          'After building trust via email, the attacker sends a link to a lookalike domain (e.g., login.micros0ft-auth-portal.com, registered with a valid Let’s Encrypt HTTPS certificate so the browser still displays a padlock icon). When the victim clicks the link, the attacker’s Evilginx server fetches the genuine login.microsoftonline.com page live in the background and rewrites the domain names inside the HTML on the fly (so the victim sees their own company’s real logo, custom background image, and live Microsoft login prompts).',
        howItWorksInPractice:
          'Unlike traditional phishing kits that host a static HTML copy of a login page (which breaks when MFA challenges or dynamic JavaScript run), an AiTM reverse proxy relays every HTTP request and response between the victim’s browser and Microsoft Entra ID in real time. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (Victim Browser) through Node ②/④ (Evilginx AiTM Reverse Proxy) to Node ⑤ (Real Identity Provider), and return arrow ⇠#1 rendering the live login page.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intelligence (cloud identity telemetry linking phishing clicks to proxy sign-ins): Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after an email link click in Defender for Office 365 (revealing that a middleman host relayed the authentication session). Correlate Sysmon or Windows Security Event telemetry for T1539 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1557',
        plainTitle: 'Relaying the Victim’s Password & Live MFA Code Through the Reverse Proxy',
        storyAnalogy:
          'The victim types their password and enters the 6-digit MFA code from their phone. The man-in-the-middle booth passes both straight through the window to Microsoft in milliseconds, and when Microsoft hands back the Set-Cookie: ESTSAUTHPERSISTENT VIP pass, the booth records a copy in its database.',
        simpleExplanation:
          'The victim enters their corporate password and completes their real MFA challenge (typing a 6-digit Authenticator code or tapping "Approve" on a push notification). Evilginx forwards both requests straight to login.microsoftonline.com in milliseconds. Once MFA succeeds, Microsoft responds with HTTP 200 OK containing Set-Cookie: ESTSAUTHPERSISTENT=... (the master browser session cookie that Microsoft issues after both password and MFA are verified, which passes through Evilginx in plaintext because the HTTPS connection from the victim terminates on the Evilginx proxy first).',
        howItWorksInPractice:
          'Because the victim’s TLS session terminates on the attacker’s Evilginx server before Evilginx opens a second TLS session to Microsoft, Evilginx can read and save every HTTP header, including Set-Cookie: ESTSAUTHPERSISTENT and ESTSAUTH, the instant MFA completes. In the documented AADNonInteractiveSignIn exchange from DMZ Reverse Proxy & SPAN Tap to Target User Browser (WKS-EXEC-01), Target User Browser (WKS-EXEC-01) responds with RESP MFA Bypassed (confirming that the COOKIE REPLAY request succeeded on Target User Browser (WKS-EXEC-01) and establishing the runtime state required for Step #3 STEALTH INBOX RULE CREATION & BEC EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ relays the credentials + MFA challenge through Node ④ (Evilginx Proxy) to Node ⑤, and return arrow ⇠#2 returns the Set-Cookie: ESTSAUTHPERSISTENT session token captured by Evilginx.',
        detectionAndEvidence:
          'Documented in MITRE T1539 and Microsoft Entra Identity Protection (risk analytics focused on session token theft): high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server (indicating the user did not communicate directly with the identity provider). Correlate Sysmon or Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1539',
        plainTitle: 'Injecting the Stolen ESTSAUTHPERSISTENT Cookie to Access Email Without MFA',
        storyAnalogy:
          'Minutes later, the attacker pastes that photocopied ESTSAUTHPERSISTENT VIP pass into their own browser in another country, walks straight into the victim’s Outlook inbox, and sets up a hidden mail-forwarding rule so they keep getting copies of every email.',
        simpleExplanation:
          'The attacker imports the stolen ESTSAUTHPERSISTENT cookie into their own browser using a cookie editor and opens outlook.office.com. Because holding a valid ESTSAUTHPERSISTENT cookie tells Microsoft "this browser already passed password + MFA checks", Outlook opens the victim’s mailbox immediately without asking for a password or triggering an MFA prompt on the victim’s phone. The attacker then creates a hidden Inbox rule (New-InboxRule, automatically forwarding or moving incoming security/reset emails so the victim never notices ongoing access).',
        howItWorksInPractice:
          'Why did MFA fail to stop this? Because TOTP codes and push approvals only verify the login event, not the domain in the browser bar. Only phishing-resistant FIDO2 / WebAuthn passkeys (which cryptographically bind the login signature to the exact domain name login.microsoftonline.com) or Token Protection (device-bound session cookies) defeat AiTM proxies. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ replays the stolen ESTSAUTHPERSISTENT cookie from Node ①/④ directly against Node ⑤ (Exchange Online / Outlook), while Node ⑥ (SIEM) detects the same session ID used from two different IP addresses and ASNs.',
        detectionAndEvidence:
          'Documented in Microsoft Sentinel and Entra Sign-in Logs (post-compromise session correlation queries): identical UniqueTokenIdentifier / SessionId replayed from a second IP address followed by New-InboxRule creation in Unified Audit Logs (demonstrating session cookie hijack and mailbox persistence). Correlate Sysmon or Windows Security Event telemetry for T1564.008 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A fraudster sets up an identical glass booth directly in front of the real bank lobby. A customer steps into the glass booth, enters both their vault code and live one-time stamp while the fraudster relays everything to the real bank teller, and then the fraudster walks away with the stamped entry pass to open the customer mailroom unchecked.',
        storyMappings: [
          {
            storyTerm: 'Identical glass booth',
            technicalTerm: 'Evilginx adversary-in-the-middle reverse proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Live one-time stamp',
            technicalTerm: 'Real-time multi-factor authentication challenge',
            tone: 'sky',
          },
          {
            storyTerm: 'Stamped entry pass',
            technicalTerm: 'Stolen ESTSAUTHPERSISTENT session cookie',
            tone: 'rose',
          },
          {
            storyTerm: 'Customer mailroom',
            technicalTerm: 'Cloud mailbox and inbox forwarding rules',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'A convincing invitation letter lures the employee to a look-alike glass booth built on a freshly rented storefront. Every word and visual logo inside the booth is mirrored live from the genuine bank lobby just behind the curtain.',
          storyMappings: [
            {
              storyTerm: 'Convincing invitation letter',
              technicalTerm: 'Targeted spear-phishing email link',
              tone: 'amber',
            },
            {
              storyTerm: 'Look-alike glass booth',
              technicalTerm: 'Evilginx transparent reverse-proxy server',
              tone: 'sky',
            },
            {
              storyTerm: 'Genuine bank lobby',
              technicalTerm: 'Legitimate cloud identity login portal',
              tone: 'rose',
            },
            {
              storyTerm: 'Freshly rented storefront',
              technicalTerm: 'Attacker-registered phishing domain and TLS cert',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Microsoft Threat Intelligence (cloud identity telemetry linking phishing clicks to proxy sign-ins): Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after an email link click in Defender for Office 365 (revealing that a middleman host relayed the authentication session). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1539 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        2: {
          storyAnalogy:
            'The employee types their secret passphrase and approves the live security chime on their pocket buzzer. The glass booth forwards both answers straight to the real teller and quietly photocopies the stamped entry pass handed back through the slot.',
          storyMappings: [
            {
              storyTerm: 'Secret passphrase',
              technicalTerm: 'Captured user account password',
              tone: 'amber',
            },
            {
              storyTerm: 'Pocket buzzer approval',
              technicalTerm: 'Completed MFA push or TOTP verification',
              tone: 'sky',
            },
            {
              storyTerm: 'Photocopied entry pass',
              technicalTerm: 'Intercepted Set-Cookie session token',
              tone: 'rose',
            },
            {
              storyTerm: 'Booth handshake signature',
              technicalTerm: 'Reverse-proxy TLS JA3 client fingerprint',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in MITRE T1539 and Microsoft Entra Identity Protection (risk analytics focused on session token theft): high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server (indicating the user did not communicate directly with the identity provider). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
        },
        3: {
          storyAnalogy:
            'From another city, the fraudster flashes the photocopied entry pass at the mailroom door, bypassing both the password desk and the pocket buzzer entirely. Inside, the fraudster adds a secret forwarding tray that diverts sensitive correspondence out of sight.',
          storyMappings: [
            {
              storyTerm: 'Flashing the photocopied pass',
              technicalTerm: 'Replaying ESTSAUTHPERSISTENT session cookie',
              tone: 'amber',
            },
            {
              storyTerm: 'Second city entrance',
              technicalTerm: 'New attacker IP address reusing the same SessionId',
              tone: 'sky',
            },
            {
              storyTerm: 'Secret forwarding tray',
              technicalTerm: 'Malicious New-InboxRule mailbox rule',
              tone: 'rose',
            },
            {
              storyTerm: 'Mailroom ledger',
              technicalTerm: 'Cloud Unified Audit Log telemetry',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Microsoft Sentinel and Entra Sign-in Logs (post-compromise session correlation queries): identical UniqueTokenIdentifier / SessionId replayed from a second IP address followed by New-InboxRule creation in Unified Audit Logs (demonstrating session cookie hijack and mailbox persistence). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1564.008 (pairing parent/child process and destination fields) and contain the offending session.',
        },
      },
    };
