import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'okta-har-file-session-token-hijack',
  code: 'T1539',
  name: 'Okta Security, Cloudflare & BeyondTrust — Support Case .har File sid Session Token Theft & Admin API Token Minting',
  shortSubtitle: 'Okta Security · Cloudflare SIRT · BeyondTrust · HTTP Archive (.har) Cookie: sid=... Replay · Post-MFA Admin Hijack',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by Okta Security, Cloudflare SIRT, BeyondTrust, and 1Password (October–November 2023), a threat actor compromised Okta’s customer support case-management system and downloaded HTTP Archive (.har) troubleshooting files uploaded by enterprise administrators. Because browser .har captures record raw HTTP request headers including live Cookie: sid=<session_token> values from authenticated admin sessions, the attacker replayed the stolen sid cookie from anonymizing VPN nodes within minutes—bypassing passwords and MFA—to access the victim’s Okta Admin Console, create backdoor Super Administrator accounts, and mint permanent SSWS API tokens.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Okta Security Advisory (Support System Incident) · Cloudflare SIRT Post-Mortem · BeyondTrust Incident Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1539 (Steal Web Session Cookie: .har sid) · T1550.004 (Web Session Cookie Replay) · T1098.001 (Okta SSWS API Token Creation)',
    },
    {
      term: 'STOLEN ARTIFACT',
      value: 'Unsanitized Browser HTTP Archive (.har) Containing Cookie: sid=102f8a9c...',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Okta System Log: user.session.access_admin_app (New ASN/IP on existing externalSessionId) & system.api_token.create',
    },
  ],
  nodes: [
    {
      id: 'har_token_thief_actor',
      label: 'Support Case Threat Actor',
      sublabel: '198.51.100.205 (Commercial VPN Exit Node)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Parsing Customer Support .har Files',
        pidOrPort: 'HTTPS :443 (Cookie: sid=102f8a9c... Replay)',
        privilege: 'Hijacked Okta Super Administrator Session',
        artifacts: [
          'support_ticket_debug.har -> headers: {"name": "Cookie", "value": "sid=102f8a9c7e4b..."}',
          'cURL / Burp Suite replaying sid cookie from new ASN',
        ],
        description:
          'Extracts live sid session cookies from uploaded .har troubleshooting files and replays them against customer Okta tenants.',
      },
    },
    {
      id: 'okta_support_har_artifact',
      label: 'Uploaded Browser .har Capture',
      sublabel: 'admin_troubleshooting.har (Cleartext Headers)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Chrome DevTools HTTP Archive (.har JSON File)',
        pidOrPort: 'Recorded on corp-admin.okta.com',
        privilege: 'Contains Post-MFA Super Admin sid Cookie',
        artifacts: [
          'entries[].request.cookies: [{"name": "sid", "value": "102f8a9c7e4b..."}]',
          'entries[].request.headers: Authorization / X-Okta-XsrfToken',
        ],
        description:
          'Troubleshooting recording created by an IT administrator while logged into the Okta Admin Console without sanitizing cookies.',
      },
    },
    {
      id: 'okta_admin_console_session',
      label: 'Customer Okta Admin Console',
      sublabel: 'corp-admin.okta.com (/admin/dashboard)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Okta Identity Provider Admin Control Plane',
        pidOrPort: 'externalSessionId: trs102f8a9c7e4b',
        privilege: 'Super Administrator (ORG_ADMIN)',
        artifacts: [
          'user.session.access_admin_app (Same externalSessionId, New IP/ASN)',
          'Bypassed primary password + FIDO2/Okta Verify MFA prompt',
        ],
        description:
          'Accepts the replayed sid session cookie if Admin Session IP Binding is not enforced on the tenant.',
      },
    },
    {
      id: 'okta_ssws_api_and_idp',
      label: 'Okta API Tokens & Inbound IdP',
      sublabel: '/api/v1/tokens (SSWS Minting & Rogue IdP)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Okta API Token Management & Identity Federation',
        pidOrPort: 'system.api_token.create & user.lifecycle.create',
        privilege: 'Persistent Super Admin API Access (SSWS Token)',
        artifacts: [
          'system.api_token.create (Token Name: "BackupSyncToken")',
          'user.account.privilege.grant (Super Administrator)',
        ],
        description:
          'Attacker converts the temporary hijacked browser session into a long-lived SSWS API token and creates a backdoor admin account.',
      },
    },
    {
      id: 'cloudflare_beyondtrust_sirt_siem',
      label: 'Okta System Log & SIRT SIEM',
      sublabel: 'Session ASN Roaming + Token Revocation',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise SIEM & Okta Identity Threat Protection',
        pidOrPort: 'Okta System Log API (/api/v1/logs)',
        privilege: 'Real-Time Session Revocation & IP Binding',
        artifacts: [
          'Alert: Single externalSessionId used across >1 Autonomous System (ASN)',
          'DELETE /api/v1/users/{id}/sessions (Immediate Session Kill)',
        ],
        description:
          'Detects a single Okta externalSessionId jumping from the corporate office ASN to an external VPN ASN and revokes the session.',
      },
    },
  ],
  processTree: [
    {
      pid: 9204,
      ppid: 1,
      name: 'har_sid_extractor.py',
      commandLine: 'python3 har_sid_extractor.py --input admin_troubleshooting.har --replay-target https://corp-admin.okta.com/admin/dashboard',
      user: 'actor',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'json.load("admin_troubleshooting.har")',
        'requests.get("https://corp-admin.okta.com/admin/dashboard", cookies={"sid": "102f8a9c..."})',
        'requests.post("https://corp-admin.okta.com/api/internal/tokens")',
      ],
      memoryBlocks: [
        {
          address: '0x00007F3D20108000',
          section: 'Parsed .har Cookie Entry (Heap)',
          permissions: 'RW-',
          size: '16 KB',
          status: 'injected',
          description: 'Extracted Okta sid session token and _xsrfToken parsed from the support case .har file.',
          hexPreview: '22 6E 61 6D 65 22 3A 22 73 69 64 22 2C 22 76 61 ("name":"sid","value":"102f8a9c7e4b...")',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'EXTRACTING LIVE SID SESSION COOKIES FROM SUPPORT .HAR FILES',
      subtitle: 'Parsing unsanitized Chrome DevTools HTTP Archive (.har) files for Cookie: sid=...',
      description:
        'When an IT administrator records a browser HTTP Archive (.har) file while troubleshooting an issue in the Okta Admin Console, the JSON file captures every HTTP request header in cleartext—including the active post-MFA session cookie (Cookie: sid=102f8a9c7e4b...). The attacker downloads the .har file and extracts the live sid token.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1539',
      mitreTechniqueName: 'Steal Web Session Cookie',
      activeNodeIds: ['har_token_thief_actor', 'okta_support_har_artifact', 'cloudflare_beyondtrust_sirt_siem'],
      compromisedNodeIds: ['okta_support_har_artifact'],
      keySpecs: [
        { term: 'SOURCE ARTIFACT', value: 'Browser HTTP Archive (.har) Uploaded to Support Portal' },
        { term: 'STOLEN CREDENTIAL', value: 'Cookie: sid=102f8a9c7e4b... & X-Okta-XsrfToken' },
        { term: 'MITRE TECHNIQUE', value: 'T1539 (Steal Web Session Cookie)' },
      ],
    },
    {
      index: 2,
      title: 'REPLAYING SID COOKIE TO BYPASS MFA IN OKTA ADMIN CONSOLE',
      subtitle: 'Impersonating the Super Administrator session from a foreign VPN IP (T1550.004)',
      description:
        'Within minutes of the .har upload, the attacker injects Cookie: sid=102f8a9c7e4b... into a browser/cURL request from an anonymizing VPN IP (198.51.100.205) to https://corp-admin.okta.com/admin/dashboard. Because the sid cookie represents an already-authenticated session, Okta grants access without prompting for password or MFA if Session IP Binding is disabled.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1550.004',
      mitreTechniqueName: 'Use Alternate Authentication Material: Web Session Cookie',
      activeNodeIds: ['har_token_thief_actor', 'okta_admin_console_session', 'cloudflare_beyondtrust_sirt_siem'],
      compromisedNodeIds: ['okta_support_har_artifact', 'okta_admin_console_session'],
      keySpecs: [
        { term: 'SESSION IDENTIFIER', value: 'authenticationContext.externalSessionId = trs102f8a9c7e4b' },
        { term: 'OKTA EVENT TYPE', value: 'user.session.access_admin_app' },
        { term: 'ANOMALY SIGNAL', value: 'Same externalSessionId roaming across distinct ASNs/Countries' },
      ],
    },
    {
      index: 3,
      title: 'MINTING PERSISTENT SSWS API TOKENS & SIRT SESSION REVOCATION',
      subtitle: 'Creating an Okta SSWS API token before SIRT detects ASN roaming and kills the session',
      description:
        'Inside the hijacked Super Admin session, the attacker immediately calls Okta’s token management API (system.api_token.create) to mint a static SSWS API token and create a secondary admin account. As documented by Cloudflare and BeyondTrust, real-time SIEM rules correlating multiple ASNs on a single externalSessionId detect the anomaly and revoke the session and API token.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.001',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Credentials',
      activeNodeIds: ['okta_admin_console_session', 'okta_ssws_api_and_idp', 'cloudflare_beyondtrust_sirt_siem'],
      compromisedNodeIds: ['okta_support_har_artifact', 'okta_admin_console_session', 'okta_ssws_api_and_idp'],
      keySpecs: [
        { term: 'PERSISTENCE EVENT', value: 'system.api_token.create & user.account.privilege.grant' },
        { term: 'SIRT DETECTION', value: 'distinct_count(client.ipAddress) > 1 per externalSessionId' },
        { term: 'DEFENSIVE FIX', value: 'Sanitize .har files (Cloudflare HAR Sanitizer) + Enforce Admin Session IP Binding' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'okta-har-1',
      no: 1,
      stageIndex: 1,
      timestamp: '10:15:02.114',
      sourceNodeId: 'har_token_thief_actor',
      targetNodeId: 'okta_support_har_artifact',
      sourceLabel: 'Threat Actor',
      targetLabel: 'Support .har File',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HAR JSON PARSE',
      shortAction: 'HAR_SID_COOKIE_EXTRACTED',
      info: 'File=admin_troubleshooting.har Extracted="Cookie: sid=102f8a9c7e4b; DT=DI1..."',
      sizeOrCode: 'SID Token Live',
      severity: 'HIGH',
      mitreId: 'T1539',
      explanation: 'Attacker extracts the live Okta sid session token from an unsanitized .har file.',
      rawLog: `{"log":{"entries":[{"request":{"method":"GET","url":"https://corp-admin.okta.com/admin/dashboard","cookies":[{"name":"sid","value":"102f8a9c7e4b9910a"}]}}]}}`,
      detectionRule: {
        type: 'YARA',
        title: 'Detect Unsanitized Okta sid or Authorization Tokens Inside .har Files',
        ruleCode: `rule Unsanitized_HAR_Okta_Session_Cookie {
  strings:
    $har = "\\"log\\": {\\"version\\":"
    $sid = "{\\"name\\": \\"sid\\", \\"value\\": \\""
  condition:
    $har and $sid
}`,
        mitigation: 'Always scrub cookies, Authorization headers, and query tokens using a HAR sanitizer before uploading .har files to any vendor.',
      },
    },
    {
      id: 'okta-har-2',
      no: 2,
      stageIndex: 2,
      timestamp: '10:42:19.608',
      sourceNodeId: 'har_token_thief_actor',
      targetNodeId: 'okta_admin_console_session',
      sourceLabel: 'VPN Exit Node (198.51.100.205)',
      targetLabel: 'Okta Admin Console',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'OKTA user.session.access_admin_app',
      shortAction: 'SESSION_ASN_ROAMING_DETECTED',
      info: 'eventType=user.session.access_admin_app externalSessionId=trs102f8a9c7e4b prevASN=AS13335 newASN=AS9009 clientIP=198.51.100.205',
      sizeOrCode: 'MFA Bypassed via sid',
      severity: 'CRITICAL',
      mitreId: 'T1550.004',
      explanation: 'Okta System Log records an existing authenticated externalSessionId suddenly accessing the Admin Console from a new ASN and IP.',
      rawLog: `{"eventType":"user.session.access_admin_app","actor":{"alternateId":"it-admin@corp.com"},"client":{"ipAddress":"198.51.100.205","userAgent":{"rawUserAgent":"Mozilla/5.0 (X11; Linux x86_64)"}},"authenticationContext":{"externalSessionId":"trs102f8a9c7e4b"},"securityContext":{"asNumber":9009,"asOrg":"M247 Europe SRL"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Okta externalSessionId Roaming Across Multiple ASNs or Operating Systems',
        ruleCode: `title: Okta Session Cookie Replay Across Distinct ASNs
logsource:
  product: okta
  service: okta
detection:
  selection:
    eventType: 'user.session.access_admin_app'
  condition: selection | count(securityContext.asNumber) by authenticationContext.externalSessionId > 1`,
        mitigation: 'Enable Okta Admin Console Session IP Binding and Continuous Access Evaluation to reject mid-session ASN changes.',
      },
    },
    {
      id: 'okta-har-3',
      no: 3,
      stageIndex: 3,
      timestamp: '10:43:05.912',
      sourceNodeId: 'okta_admin_console_session',
      targetNodeId: 'okta_ssws_api_and_idp',
      sourceLabel: 'Hijacked Admin Session',
      targetLabel: 'Okta Token API',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'OKTA system.api_token.create',
      shortAction: 'SSWS_API_TOKEN_CREATED',
      info: 'eventType=system.api_token.create target.displayName="BackupSyncToken" externalSessionId=trs102f8a9c7e4b',
      sizeOrCode: 'TOKEN_REVOKED_BY_SIRT',
      severity: 'CRITICAL',
      mitreId: 'T1098.001',
      explanation: 'Attacker mints an Okta SSWS API token from the hijacked session before SIRT automation revokes the session and token.',
      rawLog: `{"eventType":"system.api_token.create","actor":{"alternateId":"it-admin@corp.com"},"client":{"ipAddress":"198.51.100.205"},"authenticationContext":{"externalSessionId":"trs102f8a9c7e4b"},"target":[{"type":"Token","displayName":"BackupSyncToken"}],"outcome":{"result":"SUCCESS"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Okta SSWS API Token Created or Super Admin Granted From Untrusted IP',
        ruleCode: `title: Okta API Token Created in Admin Console
logsource:
  product: okta
  service: okta
detection:
  selection:
    eventType:
      - 'system.api_token.create'
      - 'user.account.privilege.grant'
      - 'system.idp.lifecycle.create'
  condition: selection`,
        mitigation: 'Require phishing-resistant FIDO2 re-authentication on every privileged Admin Console action and restrict API token creation to trusted corporate IP zones.',
      },
    },
  ],
};
