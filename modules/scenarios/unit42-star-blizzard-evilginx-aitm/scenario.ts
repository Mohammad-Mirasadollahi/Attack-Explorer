import type { AttackScenario } from '../types';

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
