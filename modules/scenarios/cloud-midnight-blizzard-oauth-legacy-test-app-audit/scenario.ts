import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-midnight-blizzard-oauth-legacy-test-app-audit',
    title: 'Microsoft Threat Intel & CISA ED 24-02 — Midnight Blizzard Legacy OAuth Test Application & Exchange Online EWS Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1098.003',
    description:
      'Grounded in Microsoft Threat Intelligence disclosures on Midnight Blizzard (APT29 / NOBELIUM) and CISA Emergency Directive 24-02: DFIR analysts investigate password spray telemetry against a legacy non-production tenant, elevation of an dormant OAuth test application with Exchange Online full_access_as_app role assignments, and Microsoft Purview Unified Audit Log MailItemsAccessed records.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Residential Proxy Spray Node', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Entra ID Sign-In & OAuth Consent API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Legacy Test OAuth App Principal', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Microsoft Sentinel & Purview Audit', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Exchange Online EWS Mailboxes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Low-Volume Residential Proxy Password Spray Against Legacy Tenant Account',
        narration:
          'Threat actors route low-frequency authentication requests through distributed residential proxy subnets targeting a legacy non-production test tenant account that lacks Multifactor Authentication (MFA) enforcement, recorded in Entra ID SignInLogs.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1110.003 - Password Spraying)',
        technicalCommands: [
          'SigninLogs | where ResultType == 0 and AuthenticationRequirement == "singleFactorAuthentication"',
          'Get-MgAuditLogSignIn -Filter "appDisplayName eq \'Azure Portal\'"',
        ],
        defenseMitigation:
          'Decommission legacy test tenants, enforce phishing-resistant MFA across all tenant accounts via Conditional Access, and block legacy authentication protocols.',
        logs: [
          {
            id: 'mb-oauth-1',
            timestamp: '08:12:14.110',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 50126,
            ProcessName: 'EntraSignInService',
            CommandLine: 'POST /organizations/oauth2/v2.0/token (singleFactorAuthentication)',
            raw: 'SigninLogs: {"OperationName":"Sign-in activity","ResultType":"0","UserPrincipalName":"legacy-test-svc@contoso-dev.onmicrosoft.com","AuthenticationRequirement":"singleFactorAuthentication","IPAddress":"198.51.100.42"}',
            parsedFields: {
              LogTable: 'Entra ID SigninLogs',
              AuthRequirement: 'singleFactorAuthentication',
              DirectiveReference: 'CISA ED 24-02',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Service Principal Credential Addition & full_access_as_app Role Assignment',
        narration:
          'Using the compromised tenant session, the actor registers a new client secret on a legacy OAuth Service Principal (Add service principal credentials) and grants the Exchange Online full_access_as_app AppRoleAssignment.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.003 - Additional Cloud Roles)',
        technicalCommands: [
          'AuditLogs | where OperationName has_any ("Add service principal credentials", "Add app role assignment to service principal")',
          'Get-MgServicePrincipalAppRoleAssignment -ServicePrincipalId <app-object-id>',
        ],
        defenseMitigation:
          'Audit all OAuth applications holding high-privilege application permissions (full_access_as_app, Mail.ReadWrite) and require Privileged Identity Management (PIM) approval for AppRoleAssignment changes.',
        logs: [
          {
            id: 'mb-oauth-2',
            timestamp: '08:16:40.502',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'EntraDirectoryAudit',
            CommandLine: 'Add app role assignment to service principal (full_access_as_app)',
            raw: 'AuditLogs: {"OperationName":"Add app role assignment to service principal","Category":"ApplicationManagement","TargetResources":[{"displayName":"Legacy-OAuth-Test-App","modifiedProperties":[{"displayName":"AppRole.Value","newValue":"full_access_as_app"}]}]}',
            parsedFields: {
              OperationName: 'Add app role assignment to service principal',
              GrantedPermission: 'full_access_as_app (Office 365 Exchange Online)',
              TargetServicePrincipal: 'Legacy-OAuth-Test-App',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: OAuth Bearer Token EWS Mailbox Sync & MailItemsAccessed Telemetry',
        narration:
          'Authenticating solely with OAuth 2.0 client_credentials tokens from the malicious Service Principal, the actor queries Exchange Web Services (EWS) without interactive user sign-ins, generating MailItemsAccessed events in the Microsoft Purview Unified Audit Log.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1114.002 - Remote Email Collection)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText "Legacy-OAuth-Test-App"',
          'OfficeActivity | where Operation == "MailItemsAccessed" and ClientAppId == "a8f4c210-1122-4433-9988-776655443322"',
        ],
        defenseMitigation:
          'Enforce Exchange Online Application Access Policies (New-ApplicationAccessPolicy) to restrict EWS/Graph application tokens to explicitly scoped security groups and revoke unauthorized OAuth Service Principals.',
        logs: [
          {
            id: 'mb-oauth-3',
            timestamp: '08:22:09.884',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ExchangeOnlineAudit',
            CommandLine: 'EWS SyncFolderItems via OAuth Application Token (MailItemsAccessed)',
            raw: 'UnifiedAuditLog: {"Operation":"MailItemsAccessed","Workload":"Exchange","ClientAppId":"a8f4c210-1122-4433-9988-776655443322","AppId":"00000002-0000-0ff1-ce00-000000000000","ClientInfoString":"Client=WebServices;","ItemCount":142}',
            parsedFields: {
              AuditOperation: 'MailItemsAccessed',
              ProtocolWorkload: 'Exchange Web Services (EWS)',
              OAuthClientAppId: 'a8f4c210-1122-4433-9988-776655443322',
            },
          },
        ],
      },
    ],
  };
