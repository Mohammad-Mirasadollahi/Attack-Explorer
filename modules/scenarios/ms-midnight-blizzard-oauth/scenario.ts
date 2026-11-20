import type { AttackScenario } from '../types';

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
