import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'ms-midnight-blizzard-oauth',
  code: 'T1098.003',
  name: 'Microsoft Threat Intel — Midnight Blizzard (APT29): OAuth App Persistence & EWS Exfiltration',
  shortSubtitle: 'Microsoft Threat Intelligence · Legacy Tenant Password Spray, OAuth full_access_as_app & EWS',
  category: 'ACTIVE_DIRECTORY',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Documented by Microsoft Threat Intelligence (January 2024), Midnight Blizzard (APT29 / NOBELIUM / Cozy Bear) executed a low-volume residential-proxy password spray to compromise a legacy non-production test tenant account without MFA. From that foothold, the actor abused an over-privileged legacy OAuth application, registered new malicious OAuth applications in Microsoft Entra ID, granted them the Exchange Online full_access_as_app role, and exfiltrated corporate emails via Exchange Web Services (EWS).',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Microsoft Threat Intelligence — Midnight Blizzard OAuth Application Intrusion Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1110.003 (Password Spraying) · T1098.003 (Additional Cloud Roles) · T1528 (Steal App Token)',
    },
    {
      term: 'OAUTH PERMISSION',
      value: 'Office 365 Exchange Online -> full_access_as_app (Role ID dc890d15-...)',
    },
    {
      term: 'AUDIT LOG CHANNELS',
      value: 'Entra ID AuditLogs (Add service principal, Consent to application) & Exchange EWS',
    },
  ],
  nodes: [
    {
      id: 'nobelium_res_proxy',
      label: 'Midnight Blizzard Proxy Pool',
      sublabel: 'Residential Proxy Network (Low-and-Slow)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Distributed Residential Proxy Infrastructure (SVR / APT29)',
        pidOrPort: 'HTTPS :443 -> login.microsoftonline.com',
        privilege: 'External Nation-State Actor',
        artifacts: [
          'Low-Volume Password Spray (<1 attempt per account per hour)',
          'OAuth Client Credentials Grant Requests',
        ],
        description:
          'Geo-distributed residential proxy network used by Midnight Blizzard to evade IP-based throttling during password spraying and EWS mail collection.',
      },
    },
    {
      id: 'entra_id_tenant',
      label: 'Microsoft Entra ID Control Plane',
      sublabel: 'Legacy Test Tenant & App Registrations',
      role: 'domain_controller',
      x: 44,
      y: 26,
      details: {
        osOrType: 'Cloud Identity & OAuth Authorization Server',
        pidOrPort: 'Graph API / OAuth 2.0 Token Endpoint',
        privilege: 'Application.ReadWrite.All / Directory Role',
        artifacts: [
          'Compromised Account: legacy-test-svc@tenant.onmicrosoft.com (No MFA)',
          'Entra Audit: Add application & Add OAuth2PermissionGrant',
        ],
        description:
          'Entra ID directory where the attacker abused a legacy test OAuth app with elevated directory privileges to create new malicious OAuth service principals.',
      },
    },
    {
      id: 'rogue_oauth_sp',
      label: 'Malicious OAuth Service Principal',
      sublabel: 'AppId: 8c4a... · full_access_as_app',
      role: 'process',
      x: 54,
      y: 72,
      details: {
        osOrType: 'Entra ID Enterprise Application / Service Principal',
        pidOrPort: 'OAuth2 Client Secret Credential + Bearer JWT',
        privilege: 'Exchange Online full_access_as_app',
        artifacts: [
          'Add service principal credentials (PasswordCredential)',
          'Consent to application (AppRoleAssignment: full_access_as_app)',
        ],
        description:
          'Attacker-created OAuth application consented to the Exchange Online full_access_as_app role, allowing access to any mailbox without user interaction.',
      },
    },
    {
      id: 'exchange_online_ews',
      label: 'Exchange Online (EWS API)',
      sublabel: 'outlook.office365.com/EWS/Exchange.asmx',
      role: 'server',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Microsoft 365 Exchange Online Mailboxes',
        pidOrPort: 'HTTPS EWS SOAP API (:443)',
        privilege: 'Executive & Security Team Mailboxes',
        artifacts: [
          'MailItemsAccessed (AppId = Rogue OAuth App)',
          'EWS FindItem / GetItem / ExportItems SOAP Calls',
        ],
        description:
          'Corporate Exchange Online environment queried by the rogue OAuth application using Bearer tokens via EWS.',
      },
    },
    {
      id: 'ms_sentinel_cloud_siem',
      label: 'Microsoft Sentinel & Defender XDR',
      sublabel: 'Entra AuditLogs + UnifiedAuditLog',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'Cloud SOC & Identity Threat Detection',
        pidOrPort: 'Entra ID SignInLogs, AuditLogs & M365 UnifiedAuditLog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'KQL Rule: OAuth App Granted full_access_as_app',
          'KQL Rule: Anomalous Service Principal Credential Addition',
        ],
        description:
          'Monitors Entra ID service principal creation, high-privilege app role assignments, and anomalous EWS MailItemsAccessed telemetry.',
      },
    },
  ],
  processTree: [
    {
      pid: 9001,
      ppid: 1,
      name: 'EntraID-OAuth-Controller',
      commandLine: 'POST https://graph.microsoft.com/v1.0/applications (Create Rogue OAuth App)',
      user: 'legacy-test-svc@corp.onmicrosoft.com',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'POST /v1.0/applications',
        'POST /v1.0/servicePrincipals/{id}/addPassword',
        'POST /v1.0/servicePrincipals/{id}/appRoleAssignments',
      ],
    },
    {
      pid: 9045,
      ppid: 9001,
      name: 'EWS-Mailbox-Collector',
      commandLine: 'POST https://outlook.office365.com/EWS/Exchange.asmx (Bearer JWT AppId=8c4a...)',
      user: 'ServicePrincipal: SyncConnector-Prod',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['EWS::FindItem', 'EWS::GetItem', 'EWS::GetAttachment'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'LOW-VOLUME PASSWORD SPRAY ON LEGACY TEST TENANT',
      subtitle: 'Compromising non-production account lacking MFA via residential proxies',
      description:
        'As documented by Microsoft Threat Intelligence, Midnight Blizzard routed low-volume password spray traffic through a rotating residential proxy pool to compromise a legacy test account in a non-production tenant that did not have Multifactor Authentication (MFA) enforced.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1110.003',
      mitreTechniqueName: 'Brute Force: Password Spraying',
      activeNodeIds: ['nobelium_res_proxy', 'entra_id_tenant', 'ms_sentinel_cloud_siem'],
      compromisedNodeIds: ['entra_id_tenant'],
      keySpecs: [
        { term: 'SPRAY CADENCE', value: 'Low-volume distributed across residential proxy IPs' },
        { term: 'ENTRY ACCOUNT', value: 'Legacy non-production test tenant account (MFA disabled)' },
        { term: 'SIGN-IN LOG', value: 'AADNonInteractiveUserSignInLogs / SignInLogs ResultType 0' },
      ],
    },
    {
      index: 2,
      title: 'MALICIOUS OAUTH APP REGISTRATION & ROLE CONSENT',
      subtitle: 'Abusing legacy test OAuth app to grant full_access_as_app in Exchange',
      description:
        'Using a legacy test OAuth application that possessed elevated directory permissions, the actor registered new malicious OAuth applications, added client secret credentials (Add service principal credentials), and consented to the Office 365 Exchange Online full_access_as_app role (Role ID dc890d15-9560-4a4c-9b7f-a736ec74ec40).',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.003',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Roles',
      activeNodeIds: ['entra_id_tenant', 'rogue_oauth_sp', 'ms_sentinel_cloud_siem'],
      compromisedNodeIds: ['entra_id_tenant', 'rogue_oauth_sp'],
      keySpecs: [
        { term: 'ENTRA OPERATION', value: 'Add application -> Add service principal credentials -> Add app role assignment' },
        { term: 'APP PERMISSION', value: 'full_access_as_app (dc890d15-9560-4a4c-9b7f-a736ec74ec40)' },
        { term: 'PERSISTENCE', value: 'OAuth 2.0 Client Credentials token survives user password resets' },
      ],
    },
    {
      index: 3,
      title: 'OAUTH BEARER TOKEN EWS MAILBOX EXFILTRATION',
      subtitle: 'Querying outlook.office365.com/EWS/Exchange.asmx via residential proxies',
      description:
        'Authenticating with the rogue OAuth application client secret, Midnight Blizzard requested OAuth 2.0 Bearer tokens and queried Exchange Web Services (EWS) across residential proxy nodes to harvest messages and attachments from targeted corporate mailboxes.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1528',
      mitreTechniqueName: 'Steal Application Access Token',
      activeNodeIds: ['nobelium_res_proxy', 'rogue_oauth_sp', 'exchange_online_ews', 'ms_sentinel_cloud_siem'],
      compromisedNodeIds: ['entra_id_tenant', 'rogue_oauth_sp', 'exchange_online_ews'],
      keySpecs: [
        { term: 'EXFIL ENDPOINT', value: 'https://outlook.office365.com/EWS/Exchange.asmx' },
        { term: 'UNIFIED AUDIT LOG', value: 'MailItemsAccessed & ApplicationImpersonation via AppId' },
        { term: 'MITRE TECHNIQUE', value: 'T1528 (Steal Application Access Token) & T1114.002 (Remote Email Collection)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ms-mb-1',
      no: 1,
      stageIndex: 1,
      timestamp: '19:04:12.110',
      sourceNodeId: 'nobelium_res_proxy',
      targetNodeId: 'entra_id_tenant',
      sourceLabel: '198.51.100.89 (Residential Proxy)',
      targetLabel: 'Entra ID SignInLogs',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Entra SignInLogs',
      shortAction: 'LEGACY TENANT SPRAY',
      info: 'UserPrincipalName=legacy-test-svc@tenant.onmicrosoft.com AuthenticationRequirement=singleFactorAuthentication',
      sizeOrCode: 'ResultType 0',
      severity: 'HIGH',
      mitreId: 'T1110.003',
      explanation:
        'Entra ID Sign-In logs capture a single-factor authentication success on an unmanaged legacy test account from a residential proxy IP.',
      rawLog: `{
  "Category": "SignInLogs",
  "OperationName": "Sign-in activity",
  "ResultType": "0",
  "UserPrincipalName": "legacy-test-svc@tenant.onmicrosoft.com",
  "IPAddress": "198.51.100.89",
  "AuthenticationRequirement": "singleFactorAuthentication",
  "ConditionalAccessStatus": "notApplied",
  "AppDisplayName": "Azure Portal"
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Single-Factor Sign-In to Legacy or Test Tenant Accounts',
        ruleCode: `SigninLogs
| where ResultType == 0 and AuthenticationRequirement == "singleFactorAuthentication"
| where UserPrincipalName has_any ("test", "legacy", "svc")
| project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName, ConditionalAccessStatus`,
        mitigation:
          'Decommission unused legacy tenants/accounts and enforce Conditional Access with phishing-resistant MFA across 100% of accounts and service principals.',
      },
    },
    {
      id: 'ms-mb-2',
      no: 2,
      stageIndex: 2,
      timestamp: '19:11:28.540',
      sourceNodeId: 'entra_id_tenant',
      targetNodeId: 'rogue_oauth_sp',
      sourceLabel: 'Entra AuditLogs',
      targetLabel: 'SyncConnector-Prod (AppId 8c4a...)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'Entra AuditLogs',
      shortAction: 'GRANT FULL_ACCESS_AS_APP',
      info: 'OperationName="Add app role assignment to service principal" AppRoleId="dc890d15-9560-4a4c-9b7f-a736ec74ec40"',
      sizeOrCode: 'Role Granted',
      severity: 'CRITICAL',
      mitreId: 'T1098.003',
      explanation:
        'Microsoft Threat Intelligence highlights auditing AppRoleId dc890d15-9560-4a4c-9b7f-a736ec74ec40 (Exchange full_access_as_app) and Mail.ReadWrite grants on newly created OAuth service principals.',
      rawLog: `{
  "Category": "AuditLogs",
  "OperationName": "Add app role assignment to service principal",
  "Result": "success",
  "InitiatedBy": { "app": { "displayName": "Legacy-Directory-Provisioner", "servicePrincipalId": "41b2..." } },
  "TargetResources": [
    {
      "displayName": "Office 365 Exchange Online",
      "modifiedProperties": [
        { "displayName": "AppRole.Id", "newValue": "\\"dc890d15-9560-4a4c-9b7f-a736ec74ec40\\"" },
        { "displayName": "AppRole.Value", "newValue": "\\"full_access_as_app\\"" }
      ]
    }
  ]
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Microsoft Threat Intel — OAuth App Assigned Exchange full_access_as_app',
        ruleCode: `AuditLogs
| where OperationName == "Add app role assignment to service principal"
| mv-expand TargetResources
| mv-expand TargetResources.modifiedProperties
| where tostring(TargetResources_modifiedProperties.newValue) has_any ("dc890d15-9560-4a4c-9b7f-a736ec74ec40", "full_access_as_app", "Mail.ReadWrite")`,
        mitigation:
          'Audit all OAuth service principals holding Application.ReadWrite.All or AppRoleAssignment.ReadWrite.All and replace EWS full_access_as_app with scoped RBAC for Applications.',
      },
    },
    {
      id: 'ms-mb-3',
      no: 3,
      stageIndex: 3,
      timestamp: '19:18:05.902',
      sourceNodeId: 'rogue_oauth_sp',
      targetNodeId: 'exchange_online_ews',
      sourceLabel: 'AppId 8c4a... (OAuth JWT)',
      targetLabel: 'Exchange Online EWS',
      sourceType: 'NETWORK',
      protocolOrEventId: 'M365 MailItemsAccessed',
      shortAction: 'EWS MAIL EXFIL',
      info: 'Operation=MailItemsAccessed ClientAppId=8c4a91f0-... ClientInfoString="Client=WebServices" ItemCount=412',
      sizeOrCode: '412 Items',
      severity: 'CRITICAL',
      mitreId: 'T1528',
      explanation:
        'Exchange Online Unified Audit Log (MailItemsAccessed) captures the rogue OAuth ClientAppId reading hundreds of mailbox items over EWS.',
      rawLog: `{
  "RecordType": 50,
  "Operation": "MailItemsAccessed",
  "Workload": "Exchange",
  "ClientIPAddress": "198.51.100.89",
  "ClientInfoString": "Client=WebServices;UserAgent=Python-urllib/3.11",
  "AppId": "8c4a91f0-3e12-4b99-a102-998877665544",
  "OperationCount": 412
}`,
      detectionRule: {
        type: 'KQL',
        title: 'Anomalous EWS MailItemsAccessed by Newly Registered OAuth AppId',
        ruleCode: `CloudAppEvents
| where ActionType == "MailItemsAccessed"
| where RawEventData.ClientInfoString has "Client=WebServices"
| summarize AccessedCount = count() by tostring(RawEventData.AppId), IPAddress
| where AccessedCount > 100`,
        mitigation:
          'Disable legacy Exchange Web Services (EWS) application impersonation where unneeded and enforce Workload Identity Conditional Access policies.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-midnight-blizzard-oauth',
    briefing: {
      headline: 'Scenario Briefing: Midnight Blizzard (NOBELIUM / APT29), Legacy Test Tenant to OAuth full_access_as_app Exchange Takeover',
      storyAnalogy:
        'Imagine a burglar who finds a forgotten, dusty side cottage on a corporate estate (a legacy non-production test tenant) whose door still uses a simple single-key lock (no MFA). Inside that cottage, the burglar finds an old master maintenance badge (a legacy OAuth application) that happens to have cross-building authority in the main corporate headquarters. Using that badge, they mint new automated robot passes (Service Principals) granted the full_access_as_app stamp, letting them silently read any executive’s mailbox without ever needing any executive’s password.',
      plainSummary:
        'In this scenario (T1098.003, Microsoft Threat Intel - Midnight Blizzard (APT29): OAuth App Persistence & EWS Exfiltration), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: low-Volume Residential-Proxy Password Spray, then abusing a Legacy Cross-Tenant OAuth App, then exfiltrating Corporate Mailboxes. Steps #1–#3 walk that chain end-to-end by covering Low-Volume Residential-Proxy Password Spray, then Abusing a Legacy Cross-Tenant OAuth App, then Exfiltrating Corporate Mailboxes, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Midnight Blizzard Residential Proxy Spray targeting the Legacy Test Tenant), pivot through the shared OAuth Service Principal into Node ③/④ (Corporate Entra ID & Malicious OAuth App Registration), and query mailboxes on Node ⑤ (Exchange Online full_access_as_app), detected by Node ⑥ (Entra Audit & Unified Audit Log SIEM).',
      documentedAdvisory: 'Microsoft Threat Intelligence Midnight Blizzard Blog (Jan 2024) · MITRE ATT&CK T1110.003 / T1098.003 / T1114.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1110.003',
        plainTitle: 'Low-Volume Residential-Proxy Password Spray Against a Forgotten Legacy Test Account',
        storyAnalogy:
          'Instead of rattling the front door of the main corporate tower 1,000 times from one suspicious van, the attacker has dozens of local couriers (residential proxy IPs) try just one password at a time on a forgotten side-cottage test door that never had a two-factor keypad installed.',
        simpleExplanation:
          'To avoid triggering automated IP blocks or account lockouts, the attacker routes authentication requests through a rotating pool of residential proxy IPs (home internet routers in the same country as the target, making login traffic look like legitimate local employees rather than a datacenter botnet) and performs a low-volume password spray (trying just one common password at a time across a small list of accounts) against a forgotten, non-production legacy test tenant account that had never been enforced with Multi-Factor Authentication (MFA).',
        howItWorksInPractice:
          'Because each residential proxy IP sends only a tiny fraction of the total login attempts and stays well below the bad-password lockout threshold (e.g., 1 attempt per hour), traditional velocity-based brute-force rules do not fire, allowing the attacker to quietly log into the forgotten single-factor test account. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② (Residential Proxy Pool) to Node ③ (Legacy Test Tenant Entra ID Sign-In), and return arrow ⇠#1 issuing the initial OAuth token.',
        detectionAndEvidence:
          'Analyze Microsoft Entra ID SigninLogs (cloud identity telemetry capturing every authentication attempt, ASN, and MFA claim) for low-volume distributed password sprays rotating across residential proxy ASNs against single-factor legacy or non-production accounts. Correlate Sysmon or Windows Security Event telemetry for T1110.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.003',
        plainTitle: 'Abusing a Legacy Cross-Tenant OAuth App to Register New Privileged Service Principals',
        storyAnalogy:
          'Once inside the side cottage, the intruder discovers an old "Universal Maintenance App" that was accidentally given admin rights over the main corporate tower. Using that app’s authority, they print brand-new client secret keys (Add servicePrincipal credentials) and stamp them with the highest mail-reading clearance (full_access_as_app).',
        simpleExplanation:
          'Inside the test environment, the attacker discovers a legacy OAuth test application whose Service Principal had been granted privileged directory permissions, specifically AppRoleAssignment.ReadWrite.All (a high-privilege Microsoft Graph permission that allows an app to grant any permission role to itself or to other apps without asking a human Global Administrator), inside the main corporate tenant. Using that legacy app, the attacker creates new malicious OAuth Service Principals, attaches new client secret keys (Add servicePrincipal credentials, creating long-lived API passwords for the app), and assigns them the Office 365 Exchange Online full_access_as_app role.',
        howItWorksInPractice:
          'In Microsoft Entra ID, an application holding AppRoleAssignment.ReadWrite.All can call the Graph API (/servicePrincipals/{id}/appRoleAssignments) to self-assign full_access_as_app (Role ID dc890d15-9560-4a4c-9b7f-a736ec74ec40, the highest application-level Exchange permission), escalating from a forgotten test account to full tenant-wide mail access without touching a human admin’s account.',
        diagramAlignment:
          'On the diagram, arrow #2→ uses the legacy OAuth app on Node ③ to create and privilege the rogue OAuth Service Principal on Node ④ (Add app role assignment to service principal), with ⇠#2 returning the OAuth2 client_credentials bearer token.',
        detectionAndEvidence:
          'Documented in Microsoft Entra Audit Logs: Add servicePrincipal, Add servicePrincipal credentials, and Add app role assignment to service principal for full_access_as_app (dc890d15-9560-4a4c-9b7f-a736ec74ec40). Correlate Sysmon or Windows Security Event telemetry for T1098.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Exfiltrating Corporate Mailboxes via Exchange Web Services (EWS) Using OAuth Bearer Tokens',
        storyAnalogy:
          'Holding the full_access_as_app robot pass, the attacker walks straight up to the Exchange mailroom window (outlook.office365.com/EWS/Exchange.asmx) and downloads executive inbox folders in bulk, never triggering a single phone MFA prompt on any executive’s device.',
        simpleExplanation:
          'Authenticating purely as the rogue OAuth application using grant_type=client_credentials (machine-to-machine authentication that uses the app’s client secret and never involves a human user login or MFA prompt), the attacker calls Exchange Web Services (https://outlook.office365.com/EWS/Exchange.asmx) through the same residential proxy pool to search and download emails from senior executive and security-team mailboxes.',
        howItWorksInPractice:
          'Because full_access_as_app is an application-level permission (Application Permission) rather than a delegated user permission (Delegated Permission), the OAuth Bearer token grants direct read/export access to any mailbox in the Exchange Online tenant without ever logging in as those users or triggering Conditional Access user-MFA policies. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ queries Node ⑤ (Exchange Online EWS /EWS/Exchange.asmx MailItemsAccessed) from Node ④, while Node ⑥ (Microsoft Sentinel / SIEM) correlates the Entra role grant with EWS MailItemsAccessed telemetry.',
        detectionAndEvidence:
          'Documented in Microsoft Purview Unified Audit Log (MailItemsAccessed / EWS) correlated with Entra Service Principal sign-ins using AppId holding full_access_as_app. Correlate Sysmon or Windows Security Event telemetry for T1528 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a patient espionage crew softly trying one spare key per evening from scattered neighborhood cars against a forgotten backyard testing shed that never got a modern two-factor deadbolt. Once inside the dusty shed, they discover an old cross-campus courier badge that was accidentally left with master mailroom powers, use it to print brand-new official courier badges inside the corporate headquarters, and silently haul out executive mailbags through the automated mail chute.',
      storyMappings: [
        {
          storyTerm: 'Trying one key per evening from scattered neighborhood cars',
          technicalTerm: 'Low-volume residential-proxy password spray evading IP lockouts and alerts',
          tone: 'amber',
        },
        {
          storyTerm: 'Forgotten backyard testing shed lacking a two-factor deadbolt',
          technicalTerm: 'Legacy non-production test tenant account without MFA enabled',
          tone: 'sky',
        },
        {
          storyTerm: 'Old cross-campus courier badge printing fresh headquarters badges',
          technicalTerm: 'Legacy OAuth test app with elevated permissions registering new privileged Service Principals',
          tone: 'rose',
        },
        {
          storyTerm: 'Hauling out executive mailbags through the automated mail chute',
          technicalTerm: 'Machine-to-machine client_credentials OAuth exfiltration via Exchange Web Services (EWS)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Avoiding noisy repeated knocks that would wake the guard dogs, the spy crew tries only a handful of common passwords slowly across hundreds of ordinary household street addresses until a forgotten back-lot testing shed with no second-factor padlock quietly clicks open.',
        storyMappings: [
          {
            storyTerm: 'Hundreds of ordinary household street addresses',
            technicalTerm: 'Distributed residential proxy IP network defeating IP reputation blocks',
            tone: 'amber',
          },
          {
            storyTerm: 'Trying only a handful of passwords slowly',
            technicalTerm: 'Low-and-slow password spray staying below Entra ID Smart Lockout thresholds',
            tone: 'sky',
          },
          {
            storyTerm: 'Forgotten back-lot testing shed with no second padlock',
            technicalTerm: 'Legacy non-production test tenant account lacking MFA enforcement',
            tone: 'rose',
          },
          {
            storyTerm: 'Gate sign-in book recording dispersed arrivals',
            technicalTerm: 'Microsoft Entra ID SigninLogs showing distributed ASNs hitting legacy accounts',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Analyze Microsoft Entra ID SigninLogs (cloud identity telemetry capturing every authentication attempt, ASN, and MFA claim) for low-volume distributed password sprays rotating across residential proxy ASNs against single-factor legacy or non-production accounts. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1110.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Rummaging inside the unlocked testing shed, the spies uncover an abandoned automated courier badge that still carries wide building-wide authority into the main corporate tower, and immediately use it to mint shiny new official machine badges armed with full mailroom keys.',
        storyMappings: [
          {
            storyTerm: 'Abandoned automated courier badge in the shed',
            technicalTerm: 'Legacy cross-tenant OAuth test application holding elevated Graph permissions',
            tone: 'amber',
          },
          {
            storyTerm: 'Minting shiny new official machine badges',
            technicalTerm: 'Creating new rogue Entra ID OAuth applications and Service Principals',
            tone: 'sky',
          },
          {
            storyTerm: 'Full mailroom master keys assigned to the new badges',
            technicalTerm: 'Granting full_access_as_app Exchange Web Services (EWS) application role',
            tone: 'rose',
          },
          {
            storyTerm: 'Stepping from the back shed into the main corporate tower',
            technicalTerm: 'Cross-tenant pivot from legacy test environment into production Microsoft 365',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Presenting their freshly minted machine-only courier badge straight at the automated postal bay, the spies bypass human lobby guards altogether and quietly wheel out corporate leadership correspondence without ever triggering a human sign-in prompt.',
        storyMappings: [
          {
            storyTerm: 'Machine-only courier badge skipping lobby guards',
            technicalTerm: 'OAuth 2.0 grant_type=client_credentials non-interactive daemon authentication',
            tone: 'amber',
          },
          {
            storyTerm: 'Automated postal bay',
            technicalTerm: 'Exchange Web Services (EWS) API accessed with full_access_as_app scope',
            tone: 'sky',
          },
          {
            storyTerm: 'Corporate leadership correspondence wheeled out',
            technicalTerm: 'Targeted exfiltration of senior executive and security team email mailboxes',
            tone: 'rose',
          },
          {
            storyTerm: 'Silent access surviving user password resets',
            technicalTerm: 'Persistent OAuth app secret credentials independent of human user accounts',
            tone: 'emerald',
          },
        ],
      },
    },
  };
