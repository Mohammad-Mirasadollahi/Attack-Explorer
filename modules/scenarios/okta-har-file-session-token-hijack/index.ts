import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'okta-har-file-session-token-hijack',
    briefing: {
      headline: 'Scenario Briefing: Okta Support Case .har File Breach, sid Session Cookie Replay & Post-MFA Admin Hijack',
      storyAnalogy:
        'Imagine a bank manager (IT Super Admin) who notices a minor display glitch on their computer screen while logged into the master vault console (Okta Admin Console). To show the vendor’s helpdesk what the glitch looks like, the manager turns on a high-definition video camera (Chrome DevTools Save all as HAR with content) that films the screen, and accidentally films a close-up of the live, already-unlocked temporary master keycard (Cookie: sid=102f8a9c...) sitting on the desk! When a burglar compromises the helpdesk’s file cabinet, they grab that .har recording, 3D-print an exact copy of the sid keycard within 30 minutes, walk past both the password guard and the MFA guard because the session is already open, and try to mint a permanent master key (SSWS API Token).',
      plainSummary:
        'In this scenario (T1539, Okta Security, Cloudflare & BeyondTrust - Support Case .har File sid Session Token Theft & Admin API Token Minting), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: harvesting Live Cookie: sid= Tokens, then replaying the sid Cookie from a Foreign VPN, then minting an Okta SSWS API Token. Steps #1–#3 walk that chain end-to-end by covering Harvesting Live Cookie: sid= Tokens, then Replaying the sid Cookie from a Foreign VPN, then Minting an Okta SSWS API Token, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Okta telemetry correlated across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Support Case Threat Actor), extract Cookie: sid=... from Node ②/③ (Uploaded Browser .har Capture), replay the sid cookie from a foreign VPN IP into Node ④ (Customer Okta Admin Console), and trace system.api_token.create on Node ⑤ (Okta API Tokens) terminated in real time by Node ⑥ (Cloudflare/BeyondTrust SIRT SIEM).',
      documentedAdvisory: 'Okta Support System Security Advisory · Cloudflare SIRT & BeyondTrust Post-Mortems (Oct–Nov 2023) · MITRE T1539 / T1550.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1539',
        plainTitle: 'Harvesting Live Cookie: sid=... Tokens from Unsanitized Browser .har Captures (T1539)',
        storyAnalogy:
          'When an admin saves a .har troubleshooting file in Chrome DevTools while logged into Okta, the JSON file records their live post-MFA sid session cookie in cleartext.',
        simpleExplanation:
          'Using a compromised Okta support service account, the threat actor downloads HTTP Archive (.har) files attached to customer support tickets and parses the JSON entries[].request.cookies array to extract Cookie: sid=102f8a9c7e4b... (the primary bearer session cookie issued by Okta after the Super Administrator has already completed password and FIDO2/Okta Verify Multi-Factor Authentication).',
        howItWorksInPractice:
          'A .har file is not just a screenshot or timing chart; by specification, it is a full JSON archive of every HTTP request and response header, cookie, and POST body transmitted by the browser tab during recording. In the documented HAR JSON PARSE exchange from Support Case Threat Actor to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP SID Token Live (confirming that the HAR_SID_COOKIE_EXTRACTED request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 REPLAYING SID COOKIE TO BYPASS MFA IN OKTA ADMIN CONSOLE).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Threat Actor) to Node ②/③ (Uploaded .har Capture), and return arrow ⇠#1 extracting Cookie: sid=102f8a9c7e4b....',
        detectionAndEvidence:
          'Documented by Okta, Cloudflare & BeyondTrust: .har JSON files containing "name": "sid" and "X-Okta-XsrfToken" headers from *-admin.okta.com.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.004',
        plainTitle: 'Replaying the sid Cookie from a Foreign VPN ASN to Bypass MFA (T1550.004)',
        storyAnalogy:
          'Because the sid cookie represents an already-unlocked session, replaying it from a VPN IP in another country skips the login and MFA screens completely, unless IP binding is turned on.',
        simpleExplanation:
          'Within 30 minutes of the .har file upload, the attacker sends an HTTPS GET request from a commercial VPN exit node (198.51.100.205, ASN 9009) to https://corp-admin.okta.com/admin/dashboard carrying Cookie: sid=102f8a9c7e4b... (hijacking the existing authenticated session trs102f8a9c7e4b without triggering any password check or MFA push notification, which Okta logs as user.session.access_admin_app under the exact same authenticationContext.externalSessionId).',
        howItWorksInPractice:
          'Why did BeyondTrust’s identity policy block the attacker at the console while other tenants allowed access? Because enforcing Admin Session IP Binding or device-bound Okta FastPass policies causes Okta to reject a valid sid cookie the moment the client IP or device posture changes. In the documented OKTA user.session.access_admin_app exchange from Perimeter Firewall & NDR Tap to Uploaded Browser .har Capture, Uploaded Browser .har Capture responds with ALERT MFA Bypassed via sid (confirming that the SESSION_ASN_ROAMING_DETECTED request succeeded on Uploaded Browser .har Capture and establishing the runtime state required for Step #3 MINTING PERSISTENT SSWS API TOKENS & SIRT SESSION REVOCATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ replays Cookie: sid=... into Node ④ (Okta Admin Console), and ⇠#2 grants Super Admin dashboard access under externalSessionId=trs102f8a9c7e4b.',
        detectionAndEvidence:
          'Documented by Cloudflare SIRT & Okta: Okta System Log showing a single authenticationContext.externalSessionId associated with count_distinct(securityContext.asNumber) > 1 or changing client.userAgent.os.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1098.001',
        plainTitle: 'Minting an Okta SSWS API Token (system.api_token.create) & Real-Time SIRT Revocation (T1098.001)',
        storyAnalogy:
          'Knowing the stolen browser cookie will expire when the real admin logs out, the attacker rushes to mint a permanent SSWS API token, until the SOC’s ASN-roaming detector fires and kills both the session and the token!',
        simpleExplanation:
          'Because the stolen sid cookie is tied to the victim admin’s browser session lifetime, the attacker immediately navigates to Security -> API -> Tokens in the Okta Admin Console to invoke system.api_token.create (minting a static SSWS bearer token named "BackupSyncToken" and creating a secondary Super Admin user, which Cloudflare SIRT detected in real time via SIEM alerts on session ASN roaming and neutralized by calling DELETE /api/v1/users/{id}/sessions and revoking all newly created API tokens).',
        howItWorksInPractice:
          'Following this incident, Cloudflare released an open-source client-side HAR Sanitizer (har-sanitizer.pages.dev) that automatically strips Cookie, Set-Cookie, and Authorization values before engineers share .har files. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ calls system.api_token.create on Node ⑤ (Okta API Tokens) while Node ⑥ (Cloudflare/BeyondTrust SIRT SIEM) detects the ASN jump and revokes the session.',
        detectionAndEvidence:
          'Documented by Cloudflare SIRT & BeyondTrust: Okta System Log system.api_token.create, user.account.privilege.grant, or system.idp.lifecycle.create following an ASN change on externalSessionId.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a busy customer-support desk where enterprise administrators mail in full browser traffic recordings to help troubleshoot login glitches, forgetting to black out their own live master wristbands printed inside the packet headers. After breaching the support ticket vault, an intruder lifts those still-live master wristbands straight out of the uploaded recordings, replays them from an overseas proxy to walk straight past multi-factor locks, and mints permanent master service keys before alert response teams slam the door.',
      storyMappings: [
        {
          storyTerm: 'Uploaded troubleshooting recordings leaking live wristbands',
          technicalTerm: 'Unsanitized browser .har files exposing Cookie: sid=... and X-Okta-XsrfToken headers',
          tone: 'amber',
        },
        {
          storyTerm: 'Replaying live wristbands from an overseas proxy past MFA locks',
          technicalTerm: 'Hijacking *-admin.okta.com Super Admin sessions from a foreign VPN ASN (T1550.004)',
          tone: 'sky',
        },
        {
          storyTerm: 'Minting permanent master keys before defenders slam the door',
          technicalTerm: 'Calling system.api_token.create to mint Okta SSWS API tokens or rogue IdPs',
          tone: 'rose',
        },
        {
          storyTerm: 'Real-time security desk catching the teleporting wristband',
          technicalTerm: 'Okta System Log alerting on externalSessionId ASN shift followed by privilege grants',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Ransacking a compromised support-case filing cabinet, the intruder opens raw browser network recordings uploaded by helpful IT admins and immediately extracts active, unredacted administrator session wristbands still stamped inside the headers.',
        storyMappings: [
          {
            storyTerm: 'Raw browser network recordings in support tickets',
            technicalTerm: 'HTTP Archive (.har) JSON diagnostic files uploaded to the Okta support portal',
            tone: 'amber',
          },
          {
            storyTerm: 'Active unredacted administrator wristbands inside headers',
            technicalTerm: 'Live Cookie: sid=... session cookies and X-Okta-XsrfToken values for *-admin.okta.com',
            tone: 'sky',
          },
          {
            storyTerm: 'Forgetting to black out secrets before mailing',
            technicalTerm: 'Unsanitized HAR exports preserving live authentication cookies in plaintext JSON',
            tone: 'rose',
          },
          {
            storyTerm: 'Support cabinet breach feeding downstream targets',
            technicalTerm: 'Upstream support-system access enabling targeted downstream enterprise takeovers',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Scan outbound support attachments and CI/browser diagnostic dumps for .har JSON files containing "name": "sid" and "X-Okta-XsrfToken" headers targeting *-admin.okta.com (enforcing automated HAR sanitization before external upload).',
      },
      2: {
        storyAnalogy:
          'Pasting the lifted session wristband straight into their own browser from an overseas VPN booth, the intruder walks straight into the victim Super Admin control panel without ever typing a password or touching a hardware security key.',
        storyMappings: [
          {
            storyTerm: 'Pasting the lifted wristband into their own browser',
            technicalTerm: 'Injecting stolen sid cookie to impersonate the authenticated Okta administrator',
            tone: 'amber',
          },
          {
            storyTerm: 'Walking straight past passwords and hardware security keys',
            technicalTerm: 'Web Session Cookie replay (MITRE T1550.004) bypassing FIDO2/WebAuthn MFA completely',
            tone: 'sky',
          },
          {
            storyTerm: 'Impossible geographic jump of the same wristband',
            technicalTerm: 'Identical externalSessionId suddenly appearing from a foreign commercial VPN ASN',
            tone: 'rose',
          },
          {
            storyTerm: 'Super Admin control panel reached',
            technicalTerm: 'Full administrative access to the victim enterprise *-admin.okta.com tenant',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Racing against the clock before the temporary wristband expires or defenders spot the sudden address jump, the intruder attempts to print permanent master service keys or bolt on a rogue identity bridge, triggering real-time security alarms at vigilant defender centers.',
        storyMappings: [
          {
            storyTerm: 'Printing permanent master service keys before the clock runs out',
            technicalTerm: 'Okta System Log event system.api_token.create minting long-lived SSWS API tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Bolting on a rogue identity bridge or boosting privileges',
            technicalTerm: 'user.account.privilege.grant or system.idp.lifecycle.create persistence attempts',
            tone: 'sky',
          },
          {
            storyTerm: 'Vigilant defender centers spotting the ASN jump',
            technicalTerm: 'Cloudflare SIRT and BeyondTrust real-time correlation on externalSessionId ASN shift',
            tone: 'rose',
          },
          {
            storyTerm: 'Slamming the door shut instantly',
            technicalTerm: 'Automated session revocation and IP-binding policies invalidating replayed cookies',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Okta System Logs (central identity audit events) for system.api_token.create, user.account.privilege.grant, or system.idp.lifecycle.create occurring immediately after an ASN or IP change on the same externalSessionId (the exact Cloudflare and BeyondTrust containment trigger).',
      },
    },
  };
