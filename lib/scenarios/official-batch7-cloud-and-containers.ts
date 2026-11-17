import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const OFFICIAL_BATCH7_CLOUD_AND_CONTAINERS_SCENARIOS: LegacyDraftScenario[] = [
  // ============================================================================
  // PART 1: 10 CLOUD & SAAS DFIR & SECURITY AUDIT SCENARIOS (CLOUD_SAAS)
  // ============================================================================
  {
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
  },
  {
    id: 'cloud-aws-sts-federation-token-console-signin-audit',
    title: 'AWS CIRT, Datadog & MITRE — AWS STS GetFederationToken Console Sign-In Bypass & IAM Policy Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1550.001',
    description:
      'Grounded in AWS Customer Incident Response Team (CIRT) playbooks, Datadog Cloud Security research, and MITRE ATT&CK T1550.001: DFIR analysts investigate how compromised programmatic IAM user keys are exchanged via sts:GetFederationToken and signin.aws.amazon.com/federation to open an interactive AWS Management Console session without triggering standard IAM user password/MFA login checks.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External CLI Client (Leaked AKIA Key)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AWS STS Endpoint (GetFederationToken)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'AWS Federation Signin Endpoint', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AWS CloudTrail & GuardDuty Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AWS Management Console & IAM API', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Programmatic AKIA Access Key Invocation of sts:GetFederationToken',
        narration:
          'Holding a long-lived IAM User access key (AKIA...), the actor calls sts:GetFederationToken to mint temporary federated credentials (ASIA...) scoped to an inline session policy, logged in AWS CloudTrail.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Use Alternate Authentication Material: Application Access Token)',
        technicalCommands: [
          'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetFederationToken',
          'jq \'.Records[] | select(.eventName=="GetFederationToken")\' cloudtrail.json',
        ],
        defenseMitigation:
          'Remove inline sts:GetFederationToken permissions from IAM Users, migrate from static AKIA keys to IAM Roles Anywhere or SSO, and alert on GetFederationToken calls in CloudTrail.',
        logs: [
          {
            id: 'aws-fed-1',
            timestamp: '10:04:18.210',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'aws-sts',
            CommandLine: 'aws sts get-federation-token --name console-broker-session',
            raw: 'cloudtrail: {"eventSource":"sts.amazonaws.com","eventName":"GetFederationToken","userIdentity":{"type":"IAMUser","userName":"ci-deploy-bot","accessKeyId":"AKIAIOSFODNN7EXAMPLE"},"requestParameters":{"name":"console-broker-session","durationSeconds":3600}}',
            parsedFields: {
              EventSource: 'sts.amazonaws.com',
              EventName: 'GetFederationToken',
              PrincipalUser: 'ci-deploy-bot (AKIAIOSFODNN7EXAMPLE)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Federation SigninToken Exchange & Interactive ConsoleLogin Event',
        narration:
          'The actor passes the temporary federated credentials to https://signin.aws.amazon.com/federation?Action=getSigninToken and opens the resulting Console login URL, producing a ConsoleLogin CloudTrail event with userIdentity.type="FederatedUser" and additionalEventData.MFAUsed="No".',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1078.004 - Valid Accounts: Cloud Accounts)',
        technicalCommands: [
          'jq \'.Records[] | select(.eventName=="ConsoleLogin" and .userIdentity.type=="FederatedUser")\' cloudtrail.json',
          'aws guardduty list-findings --detector-id <id>',
        ],
        defenseMitigation:
          'Alert on any CloudTrail ConsoleLogin event where userIdentity.type is FederatedUser and MFAUsed is No, and attach an explicit Deny SCP for sts:GetFederationToken across member accounts.',
        logs: [
          {
            id: 'aws-fed-2',
            timestamp: '10:04:45.612',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'signin.aws.amazon.com',
            CommandLine: 'ConsoleLogin (FederatedUser: ci-deploy-bot/console-broker-session, MFAUsed=No)',
            raw: 'cloudtrail: {"eventSource":"signin.amazonaws.com","eventName":"ConsoleLogin","userIdentity":{"type":"FederatedUser","arn":"arn:aws:sts::123456789012:federated-user/console-broker-session"},"additionalEventData":{"MFAUsed":"No"},"responseElements":{"ConsoleLogin":"Success"}}',
            parsedFields: {
              EventName: 'ConsoleLogin',
              IdentityType: 'FederatedUser (sts:GetFederationToken)',
              MfaStatus: 'MFAUsed: No',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Console Reconnaissance & IAM Policy Version Enumeration Audit',
        narration:
          'Inside the browser session, the federated identity queries IAM policies, S3 buckets, and Secrets Manager secrets, which defenders correlate via the shared principalId (<user_id>:console-broker-session) across CloudTrail management events.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1069.003 - Permission Groups Discovery: Cloud Groups)',
        technicalCommands: [
          'jq \'.Records[] | select(.userIdentity.arn | contains("federated-user/console-broker-session"))\' cloudtrail.json',
          'aws iam delete-access-key --user-name ci-deploy-bot --access-key-id AKIAIOSFODNN7EXAMPLE',
        ],
        defenseMitigation:
          'Deactivate the originating IAM User access key immediately and attach an inline Deny-All policy with a Condition on aws:TokenIssueTime to invalidate active STS federated sessions.',
        logs: [
          {
            id: 'aws-fed-3',
            timestamp: '10:06:11.094',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'aws-iam',
            CommandLine: 'GetAccountAuthorizationDetails via Federated Console Session',
            raw: 'cloudtrail: {"eventSource":"iam.amazonaws.com","eventName":"GetAccountAuthorizationDetails","userIdentity":{"type":"FederatedUser","arn":"arn:aws:sts::123456789012:federated-user/console-broker-session"}}',
            parsedFields: {
              CorrelatedSessionArn: 'arn:aws:sts::123456789012:federated-user/console-broker-session',
              EnumeratedApi: 'iam:GetAccountAuthorizationDetails',
              GuardDutyFinding: 'Policy:IAMUser/RootCredentialUsage',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-entra-id-conditional-access-device-code-phishing-audit',
    title: 'Microsoft Defender TI, CISA & MITRE — Entra ID OAuth 2.0 Device Code Flow (/devicecode) Token Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1528',
    description:
      'Grounded in Microsoft Defender Threat Intelligence (Storm-2372 / Midnight Blizzard Device Code campaigns), CISA cloud identity advisories, and MITRE ATT&CK T1528: DFIR analysts investigate OAuth 2.0 Device Authorization Grant (/oauth2/v2.0/devicecode) phishing where a user enters a 9-character user_code on microsoft.com/devicelogin, allowing a remote polling client to acquire Refresh and Access tokens for Microsoft Graph.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Remote Polling Client (/token)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Entra ID /oauth2/v2.0/devicecode', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'User Browser (microsoft.com/devicelogin)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'Entra ID SigninLogs & Defender XDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Microsoft Graph API (Mail.Read / Files)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: OAuth 2.0 /devicecode Request & User Code Redemption on devicelogin',
        narration:
          'An external client requests a device_code and 9-character user_code from login.microsoftonline.com/common/oauth2/v2.0/devicecode using a public client_id. When the target user enters the code at microsoft.com/devicelogin, Entra ID records a SigninLogs entry with AuthenticationProtocol="deviceCode".',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'SigninLogs | where AuthenticationProtocol == "deviceCode"',
          'AADNonInteractiveUserSignInLogs | where AuthenticationProtocol == "deviceCode"',
        ],
        defenseMitigation:
          'Block the Device Code authentication flow via Entra ID Conditional Access ("Authentication flows -> Transfer methods -> Device code flow") for all users except dedicated conference-room hardware.',
        logs: [
          {
            id: 'entra-dc-1',
            timestamp: '11:20:05.312',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 0,
            ProcessName: 'EntraDeviceLogin',
            CommandLine: 'POST /common/oauth2/v2.0/token (grant_type=urn:ietf:params:oauth:grant-type:device_code)',
            raw: 'SigninLogs: {"OperationName":"Sign-in activity","AuthenticationProtocol":"deviceCode","AppDisplayName":"Microsoft Office","UserPrincipalName":"j.smith@corp.local","IPAddress":"203.0.113.88","ResultType":"0"}',
            parsedFields: {
              AuthenticationProtocol: 'deviceCode (OAuth 2.0 RFC 8628)',
              RedemptionPortal: 'https://microsoft.com/devicelogin',
              PollingClientIp: '203.0.113.88',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Family of Client IDs (FOCI) Refresh Token Exchange Across Graph Scopes',
        narration:
          'Once the device_code poll succeeds, the remote client receives an OAuth Refresh Token belonging to Microsoft Family of Client IDs (FOCI), enabling silent token exchange across Microsoft Graph, Azure Resource Manager, and Exchange Online scopes in AADNonInteractiveUserSignInLogs.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Application Access Token)',
        technicalCommands: [
          'AADNonInteractiveUserSignInLogs | where UserPrincipalName == "j.smith@corp.local" and IPAddress == "203.0.113.88"',
          'Revoke-MgUserSignInSession -UserId "j.smith@corp.local"',
        ],
        defenseMitigation:
          'Enforce Compliant Device or Hybrid Azure AD Joined device requirements in Conditional Access so tokens redeemed on unmanaged endpoints cannot access Graph resources.',
        logs: [
          {
            id: 'entra-dc-2',
            timestamp: '11:21:19.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 0,
            ProcessName: 'EntraTokenService',
            CommandLine: 'POST /common/oauth2/v2.0/token (grant_type=refresh_token, scope=https://graph.microsoft.com/.default)',
            raw: 'AADNonInteractiveUserSignInLogs: {"ResourceDisplayName":"Microsoft Graph","AppDisplayName":"Microsoft Azure CLI","UserPrincipalName":"j.smith@corp.local","IPAddress":"203.0.113.88","TokenIssuerType":"AzureAD"}',
            parsedFields: {
              LogSource: 'AADNonInteractiveUserSignInLogs',
              ExchangedResource: 'Microsoft Graph (https://graph.microsoft.com/.default)',
              TokenFamily: 'FOCI Refresh Token Exchange',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Microsoft Graph API Mail, OneDrive & Teams Message Enumeration Audit',
        narration:
          'Using the minted Graph bearer token, the actor queries /v1.0/me/messages, /v1.0/me/drive/root/children, and /v1.0/me/chats, captured in Microsoft Graph Activity Logs (MicrosoftGraphActivityLogs).',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Collection (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'MicrosoftGraphActivityLogs | where UserId == "<user-guid>" and RequestUri has_any ("/messages", "/drive/", "/chats")',
          'Confirm-MgRiskyUserCompromised -UserIds @("<user-guid>")',
        ],
        defenseMitigation:
          'Enable MicrosoftGraphActivityLogs diagnostic forwarding to Sentinel and correlate deviceCode sign-ins with subsequent high-volume /me/messages or /drives GET requests from foreign ASNs.',
        logs: [
          {
            id: 'entra-dc-3',
            timestamp: '11:23:02.771',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'MicrosoftGraphAPI',
            CommandLine: 'GET https://graph.microsoft.com/v1.0/me/messages?$top=100',
            raw: 'MicrosoftGraphActivityLogs: {"RequestMethod":"GET","RequestUri":"https://graph.microsoft.com/v1.0/me/messages?$top=100","ResponseStatusCode":200,"IpAddress":"203.0.113.88","Scopes":"Mail.Read Files.Read.All"}',
            parsedFields: {
              DiagnosticTable: 'MicrosoftGraphActivityLogs',
              GraphEndpoint: 'GET /v1.0/me/messages?$top=100',
              ActiveTokenScopes: 'Mail.Read Files.Read.All',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-aws-s3-kms-external-account-encryption-extortion-audit',
    title: 'Halcyon, AWS Security & MITRE — AWS S3 Server-Side KMS External Key (SSE-KMS) Re-Encryption Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1486',
    description:
      'Grounded in AWS Security Incident Response guidance, Halcyon / Rhino Security Labs Codefinger research, and MITRE ATT&CK T1486: DFIR analysts investigate cloud-native S3 extortion where an attacker uses compromised s3:PutObject and kms:Encrypt permissions to invoke CopyObject in-place across S3 buckets using a Customer Managed KMS Key (CMK) owned by an external AWS account—rendering objects unreadable once the external KMS key is scheduled for deletion.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External AWS Account KMS CMK', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AWS S3 API (CopyObject SSE-KMS)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Production S3 Bucket Objects', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AWS CloudTrail S3 Data Events & GuardDuty', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'S3 Object Versioning & Lifecycle Policy', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Cross-Account KMS Key Policy Grant & S3 Bucket Inventory Enumeration',
        narration:
          'Using compromised IAM credentials with s3:ListBucket and s3:PutObject permissions, the actor configures a KMS Customer Managed Key (CMK) in an external AWS account that permits kms:Encrypt and kms:GenerateDataKey* from the victim account.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Resource Development & Discovery (T1619 - Cloud Storage Object Discovery)',
        technicalCommands: [
          'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ListBuckets',
          'aws s3api get-bucket-versioning --bucket prod-enterprise-records',
        ],
        defenseMitigation:
          'Enforce an AWS Organizations Service Control Policy (SCP) with Condition StringNotEquals aws:ResourceAccount / s3:x-amz-server-side-encryption-aws-kms-key-id to forbid encrypting S3 objects with KMS keys outside the organization.',
        logs: [
          {
            id: 's3-kms-1',
            timestamp: '12:10:04.119',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'aws-s3',
            CommandLine: 'ListObjectsV2 on bucket prod-enterprise-records',
            raw: 'cloudtrail: {"eventSource":"s3.amazonaws.com","eventName":"ListObjectsV2","requestParameters":{"bucketName":"prod-enterprise-records"},"userIdentity":{"type":"IAMUser","userName":"backup-sync-svc"}}',
            parsedFields: {
              EventSource: 's3.amazonaws.com',
              TargetBucket: 'prod-enterprise-records',
              ActorPrincipal: 'backup-sync-svc',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: In-Place S3 CopyObject Re-Encryption with External Account SSE-KMS Key ARN',
        narration:
          'Without downloading or re-uploading the data, the actor invokes s3:CopyObject (copying each object onto itself) with x-amz-server-side-encryption="aws:kms" and x-amz-server-side-encryption-aws-kms-key-id pointing to arn:aws:kms:us-east-1:999988887777:key/<external_cmk_id>, logged in S3 Data Events.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'jq \'.Records[] | select(.eventName=="CopyObject" and (.requestParameters."x-amz-server-side-encryption-aws-kms-key-id" | contains("999988887777")))\' s3_data_events.json',
          'aws s3api head-object --bucket prod-enterprise-records --key financial-ledger-2026.parquet',
        ],
        defenseMitigation:
          'Attach an S3 Bucket Policy denying s3:PutObject and s3:CopyObject when s3:x-amz-server-side-encryption-aws-kms-key-id does not match the organization approved KMS key ARN.',
        logs: [
          {
            id: 's3-kms-2',
            timestamp: '12:11:32.805',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-s3',
            CommandLine: 'CopyObject in-place with external SSE-KMS key arn:aws:kms:us-east-1:999988887777:key/ext-cmk',
            raw: 'cloudtrail_s3: {"eventSource":"s3.amazonaws.com","eventName":"CopyObject","requestParameters":{"bucketName":"prod-enterprise-records","key":"financial-ledger-2026.parquet","x-amz-server-side-encryption":"aws:kms","x-amz-server-side-encryption-aws-kms-key-id":"arn:aws:kms:us-east-1:999988887777:key/44556677-8899-aabb-ccdd-eeff00112233"}}',
            parsedFields: {
              EventName: 'CopyObject (In-Place Server-Side Re-Encryption)',
              EncryptionMode: 'aws:kms (SSE-KMS)',
              ExternalKmsKeyArn: 'arn:aws:kms:us-east-1:999988887777:key/44556677-8899-aabb-ccdd-eeff00112233',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: PutBucketLifecycleConfiguration 1-Day NoncurrentVersionExpiration & Object Lock Recovery',
        narration:
          'To purge prior unencrypted object versions on versioned buckets, the actor calls s3:PutBucketLifecycleConfiguration with NoncurrentVersionExpiration set to 1 day. Defenders block deletion by removing the malicious lifecycle rule and restoring prior S3 VersionIds protected by S3 Object Lock.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1490 - Inhibit System Recovery)',
        technicalCommands: [
          'aws s3api delete-bucket-lifecycle --bucket prod-enterprise-records',
          'aws s3api list-object-versions --bucket prod-enterprise-records --prefix financial-ledger-2026.parquet',
        ],
        defenseMitigation:
          'Enable S3 Versioning with MFA Delete and S3 Object Lock (Compliance or Governance mode), and alert immediately on PutBucketLifecycleConfiguration events in CloudTrail.',
        logs: [
          {
            id: 's3-kms-3',
            timestamp: '12:12:10.402',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-s3',
            CommandLine: 'PutBucketLifecycleConfiguration (NoncurrentVersionExpiration NoncurrentDays=1)',
            raw: 'cloudtrail: {"eventSource":"s3.amazonaws.com","eventName":"PutBucketLifecycleConfiguration","requestParameters":{"bucketName":"prod-enterprise-records","LifecycleConfiguration":{"Rule":{"NoncurrentVersionExpiration":{"NoncurrentDays":1},"Status":"Enabled"}}}}',
            parsedFields: {
              EventName: 'PutBucketLifecycleConfiguration',
              LifecycleRuleAction: 'NoncurrentVersionExpiration (NoncurrentDays: 1)',
              RecoveryPivot: 'DeleteLifecycle + Restore prior S3 VersionId',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-azure-vm-custom-script-extension-managed-identity-audit',
    title: 'Microsoft Defender for Cloud, Mandiant & MITRE — Azure VM CustomScriptExtension & IMDS Managed Identity Token Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1059',
    description:
      'Grounded in Microsoft Defender for Cloud threat research, Mandiant Azure post-exploitation playbooks, and MITRE ATT&CK T1059 / T1552.005: DFIR analysts investigate how a compromised Azure Contributor role invokes Microsoft.Compute/virtualMachines/extensions/write (CustomScriptExtension or RunCommand) to execute commands as SYSTEM/root inside a VM and harvest the Azure Instance Metadata Service (IMDS 169.254.169.254) Managed Identity token.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Azure Contributor Principal', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Azure Resource Manager (ARM API)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Azure VM WaAppAgent / CustomScriptExtension', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Azure Activity Log & Defender for Endpoint', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Azure IMDS (169.254.169.254) & Key Vault', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ARM Control-Plane Microsoft.Compute/virtualMachines/extensions/write Invocation',
        narration:
          'Holding RBAC permissions on the subscription or resource group, the actor dispatches an ARM PUT request to Microsoft.Compute/virtualMachines/extensions/write (or runCommand/action), recorded in AzureActivity logs.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution (T1059 - Command and Scripting Interpreter)',
        technicalCommands: [
          'AzureActivity | where OperationNameValue =~ "MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE"',
          'az vm extension list --resource-group prod-rg --vm-name prod-app-vm01',
        ],
        defenseMitigation:
          'Restrict Microsoft.Compute/virtualMachines/extensions/write and runCommand/action using Azure Policy and custom RBAC roles, and require JIT/PIM activation for VM Contributor roles.',
        logs: [
          {
            id: 'az-cse-1',
            timestamp: '13:05:19.220',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'AzureResourceManager',
            CommandLine: 'PUT /subscriptions/.../virtualMachines/prod-app-vm01/extensions/CustomScriptExtension',
            raw: 'AzureActivity: {"OperationNameValue":"MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE","ActivityStatusValue":"Succeeded","Caller":"svc-infra-deploy@corp.local","ResourceId":"/subscriptions/sub-01/resourceGroups/prod-rg/providers/Microsoft.Compute/virtualMachines/prod-app-vm01/extensions/CustomScriptExtension"}',
            parsedFields: {
              ArmOperation: 'MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE',
              ExtensionType: 'Microsoft.Compute.CustomScriptExtension',
              TargetVirtualMachine: 'prod-app-vm01',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Guest Agent (WaAppAgent.exe / walinuxagent) SYSTEM Child Process Execution',
        narration:
          'Inside the guest OS, the Azure VM Agent (WindowsAzureGuestAgent.exe or walinuxagent) downloads the extension payload into C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\ (or /var/lib/waagent/custom-script/download/) and executes it as SYSTEM/root.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1078.004 - Cloud Accounts)',
        technicalCommands: [
          'DeviceProcessEvents | where InitiatingProcessFileName has_any ("WindowsAzureGuestAgent.exe", "enable.cmd")',
          'ls -la /var/lib/waagent/custom-script/download/0/',
        ],
        defenseMitigation:
          'Correlate AzureActivity extensions/write events with host EDR process creation events beneath C:\\Packages\\Plugins\\ or /var/lib/waagent/custom-script/.',
        logs: [
          {
            id: 'az-cse-2',
            timestamp: '13:05:24.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -ExecutionPolicy Unrestricted -File C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\diag_collect.ps1',
            raw: 'EventID: 1 | ParentImage: C:\\WindowsAzure\\Packages\\WaAppAgent.exe | Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | User: NT AUTHORITY\\SYSTEM | CommandLine: powershell.exe -File C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\diag_collect.ps1',
            parsedFields: {
              ParentAgent: 'C:\\WindowsAzure\\Packages\\WaAppAgent.exe',
              PluginDirectory: 'C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\',
              ExecutionIntegrity: 'NT AUTHORITY\\SYSTEM',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Local IMDS (169.254.169.254) Managed Identity OAuth Token Acquisition & Key Vault Read',
        narration:
          'Running inside the VM, the script queries http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://vault.azure.net with header Metadata: true to obtain the VM System-Assigned Managed Identity token and read Azure Key Vault secrets.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.005 - Cloud Instance Metadata API)',
        technicalCommands: [
          'AADManagedIdentitySignInLogs | where ServicePrincipalName == "prod-app-vm01"',
          'AzureDiagnostics | where ResourceProvider == "MICROSOFT.KEYVAULT" and OperationName == "SecretGet"',
        ],
        defenseMitigation:
          'Scope VM Managed Identities to least-privilege Key Vault RBAC roles, restrict Key Vault network access with Private Endpoints, and monitor AADManagedIdentitySignInLogs for anomalous resource token requests.',
        logs: [
          {
            id: 'az-cse-3',
            timestamp: '13:05:31.104',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'KeyVaultAudit',
            CommandLine: 'GET https://prod-fin-kv.vault.azure.net/secrets/sql-conn-string?api-version=7.4',
            raw: 'AzureDiagnostics: {"ResourceProvider":"MICROSOFT.KEYVAULT","OperationName":"SecretGet","ResultType":"Success","identity_claim_appid_g":"91b2c3d4-5566-7788-9900-aabbccddeeff (ManagedIdentity: prod-app-vm01)","requestUri_s":"https://prod-fin-kv.vault.azure.net/secrets/sql-conn-string"}',
            parsedFields: {
              MetadataEndpoint: 'http://169.254.169.254/metadata/identity/oauth2/token',
              KeyVaultOperation: 'SecretGet (sql-conn-string)',
              CallerIdentity: 'System-Assigned Managed Identity (prod-app-vm01)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-github-actions-pull-request-target-oidc-token-audit',
    title: 'GitHub Security Lab, CISA & MITRE — GitHub Actions pull_request_target Workflow & Cloud OIDC Token Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1195.002',
    description:
      'Grounded in GitHub Security Lab research on Actions workflow triggers, CISA/NSA CI/CD hardening guidelines, and MITRE ATT&CK T1195.002: DFIR analysts investigate the "pwn request" pattern where a repository workflow triggered by pull_request_target explicitly checks out untrusted fork PR head code (github.event.pull_request.head.sha) and requests an OpenID Connect (OIDC) JWT token from ACTIONS_ID_TOKEN_REQUEST_URL to assume an AWS/Azure cloud deployment role.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Fork Pull Request', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GitHub Actions pull_request_target Runner', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ACTIONS_ID_TOKEN_REQUEST_URL (OIDC)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'GitHub Audit Log & AWS CloudTrail', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AWS STS AssumeRoleWithWebIdentity', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Privileged pull_request_target Trigger Checking Out Untrusted Fork PR Head Ref',
        narration:
          'Unlike pull_request, a workflow triggered by pull_request_target runs in the context of the base repository with write permissions and access to secrets/OIDC. When the workflow executes actions/checkout with ref: ${{ github.event.pull_request.head.sha }}, untrusted build scripts from the fork execute inside the privileged runner.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1195.002 - Compromise Software Supply Chain)',
        technicalCommands: [
          'gh api /orgs/corp-org/audit-log?phrase=action:workflows',
          'grep -rn "pull_request_target" .github/workflows/',
        ],
        defenseMitigation:
          'Never combine pull_request_target with actions/checkout of untrusted PR head refs (github.event.pull_request.head.sha); use unprivileged pull_request workflows for building and testing external PRs.',
        logs: [
          {
            id: 'gha-oidc-1',
            timestamp: '14:15:02.400',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'Runner.Worker',
            CommandLine: 'git checkout --progress --force refs/remotes/pull/412/merge',
            raw: 'github_audit: {"action":"workflows.completed_workflow_run","event":"pull_request_target","head_sha":"9f8e7d6c5b4a3210","repository":"corp-org/cloud-infra","workflow_name":"pr-preview-deploy.yml"}',
            parsedFields: {
              WorkflowTrigger: 'pull_request_target (Base Repo Context + Write Token)',
              DangerousPattern: 'actions/checkout ref: github.event.pull_request.head.sha',
              Repository: 'corp-org/cloud-infra',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Runner Environment Variable Inspection & OIDC JWT Token Request',
        narration:
          'Executing during the build step, the modified build script reads ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN from the runner process environment to request a signed GitHub OIDC JWT for audience sts.amazonaws.com.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Files / Environment)',
        technicalCommands: [
          'ausearch -k github_runner_exec -m SYSCALL -sv yes',
          'jq \'. | select(.permissions."id-token"=="write")\' .github/workflows/*.yml',
        ],
        defenseMitigation:
          'Set default workflow permissions to read-only (permissions: contents: read) and grant id-token: write only at the specific deployment job level protected by GitHub Deployment Environments with required reviewers.',
        logs: [
          {
            id: 'gha-oidc-2',
            timestamp: '14:15:08.912',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'curl',
            CommandLine: 'curl -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com"',
            raw: 'type=SYSCALL msg=audit(1763302508.912:610): arch=c000003e syscall=59 success=yes exe="/usr/bin/curl" comm="curl" ppid=2104 uid=1001',
            parsedFields: {
              OidcEndpoint: 'ACTIONS_ID_TOKEN_REQUEST_URL (&audience=sts.amazonaws.com)',
              TokenSubjectClaim: 'repo:corp-org/cloud-infra:pull_request',
              RunnerProcess: '/usr/bin/curl spawned by npm test',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: AWS STS AssumeRoleWithWebIdentity & CloudTrail Subject Claim Audit',
        narration:
          'Because the AWS IAM Role trust policy verified only token.actions.githubusercontent.com:sub Like repo:corp-org/cloud-infra:* without restricting the ref to refs/heads/main, sts:AssumeRoleWithWebIdentity succeeds and issues production AWS credentials, logged in CloudTrail.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1550.001 - Application Access Token)',
        technicalCommands: [
          'jq \'.Records[] | select(.eventName=="AssumeRoleWithWebIdentity")\' cloudtrail.json',
          'aws iam get-role --role-name github-actions-prod-deploy-role',
        ],
        defenseMitigation:
          'Scope AWS IAM OIDC trust policies using strict StringEquals conditions on token.actions.githubusercontent.com:sub (e.g., repo:corp-org/cloud-infra:ref:refs/heads/main or environment:production) rather than wildcard repo:* patterns.',
        logs: [
          {
            id: 'gha-oidc-3',
            timestamp: '14:15:11.305',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-sts',
            CommandLine: 'AssumeRoleWithWebIdentity (sub=repo:corp-org/cloud-infra:ref:refs/heads/main)',
            raw: 'cloudtrail: {"eventSource":"sts.amazonaws.com","eventName":"AssumeRoleWithWebIdentity","userIdentity":{"type":"WebIdentityUser","userName":"repo:corp-org/cloud-infra:pull_request","identityProvider":"token.actions.githubusercontent.com"},"requestParameters":{"roleArn":"arn:aws:iam::123456789012:role/github-actions-prod-deploy-role"}}',
            parsedFields: {
              CloudTrailEvent: 'AssumeRoleWithWebIdentity',
              OidcIdentityProvider: 'token.actions.githubusercontent.com',
              SubjectClaimLogged: 'repo:corp-org/cloud-infra:pull_request',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-salesforce-connected-app-oauth-bulk-api-export-audit',
    title: 'Salesforce Security, Mandiant & MITRE — SaaS Connected App OAuth Scope Escalation & Bulk API 2.0 Export Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1530',
    description:
      'Grounded in Salesforce Event Monitoring documentation, Mandiant SaaS incident response guides (UNC5537 / UNC3944), and MITRE ATT&CK T1530 / T1528: DFIR analysts investigate unauthorized OAuth Connected App authorizations (api and refresh_token scopes), asynchronous Bulk API 2.0 query jobs (/services/data/v59.0/jobs/query), and UniqueQuery / ApiTotalUsage telemetry in Salesforce EventLogFile.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External OAuth Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Salesforce OAuth /services/oauth2/token', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Connected App (api + refresh_token)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Salesforce Shield Event Monitoring', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Bulk API 2.0 (/jobs/query CRM Objects)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unverified OAuth Connected App Consent & Refresh Token Issuance',
        narration:
          'When an organization permits "All users may self-authorize" on OAuth Connected Apps, an attacker social-engineers a user or uses stolen credentials to authorize a custom Connected App requesting api and refresh_token (offline_access) scopes, logged in OauthToken and LoginHistory.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'SELECT UserId, AppName, UseCount, LastUsedDate FROM OauthToken WHERE AppName = \'DataSync_Connector\'',
          'SELECT Application, Status, SourceIp, LoginType FROM LoginHistory WHERE LoginType = \'Remote Access 2.0\'',
        ],
        defenseMitigation:
          'Enable Salesforce API Access Control ("Admin approved users are pre-authorized" for all Connected Apps) and block uninstalled third-party Connected Apps from requesting api scopes.',
        logs: [
          {
            id: 'sfdc-1',
            timestamp: '15:02:19.104',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'SalesforceOAuth',
            CommandLine: 'POST /services/oauth2/token (Remote Access 2.0 Connected App: DataSync_Connector)',
            raw: 'sfdc_login: {"EVENT_TYPE":"Login","LOGIN_TYPE":"Remote Access 2.0","APPLICATION":"DataSync_Connector","SOURCE_IP":"198.51.100.114","USER_ID":"0058c000009XYZ1","STATUS":"Success"}',
            parsedFields: {
              EventType: 'LoginHistory (Remote Access 2.0)',
              ConnectedAppName: 'DataSync_Connector',
              GrantedScopes: 'api, refresh_token (offline_access)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Asynchronous Bulk API 2.0 Query Job Creation (/services/data/v59.0/jobs/query)',
        narration:
          'Using the OAuth access token, the client submits a Bulk API 2.0 SOQL query job (POST /services/data/v59.0/jobs/query) with operation="query" across Account, Contact, and Opportunity tables, recorded in Salesforce BulkApi2EventLog.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1530 - Data from Cloud Storage / SaaS Repositories)',
        technicalCommands: [
          'SELECT Id, EventType, LogDate FROM EventLogFile WHERE EventType IN (\'BulkApi2\', \'RestApi\', \'ReportExport\')',
          'SELECT Id, Operation, Object, CreatedById, NumberRecordsProcessed FROM AsyncApexJob',
        ],
        defenseMitigation:
          'Configure Salesforce Transaction Security Policies (ConditionBuilder / Apex policy on ApiEvent and ReportEvent) to block or require step-up authentication when RowsProcessed exceeds threshold limits.',
        logs: [
          {
            id: 'sfdc-2',
            timestamp: '15:04:41.550',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'SalesforceBulkApi2',
            CommandLine: 'POST /services/data/v59.0/jobs/query (SELECT Id,Name,Email,Phone FROM Contact)',
            raw: 'sfdc_eventlog: {"EVENT_TYPE":"BulkApi2","JOB_ID":"7508c000008AbCd","OPERATION":"query","ENTITY_TYPE":"Contact","ROWS_PROCESSED":85400,"CLIENT_IP":"198.51.100.114"}',
            parsedFields: {
              EventLogType: 'BulkApi2 (EventLogFile)',
              TargetEntity: 'Contact (85,400 rows)',
              BulkJobId: '7508c000008AbCd',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Bulk CSV Result Batch Download (/jobs/query/<id>/results) & OauthToken Revocation',
        narration:
          'Once job state transitions to JobComplete, the client streams CSV batches via GET /services/data/v59.0/jobs/query/7508c000008AbCd/results. Defenders revoke the OauthToken record and enforce IP range restrictions on the Connected App profile.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1567 - Exfiltration Over Web Service)',
        technicalCommands: [
          'SELECT JobId, RecordsProcessed,TotalProcessingTime FROM BulkApiResultEventStore WHERE JobId = \'7508c000008AbCd\'',
          'DELETE /services/oauth2/revoke?token=<refresh_token>',
        ],
        defenseMitigation:
          'Enforce Trusted IP Ranges on Connected Apps, set Refresh Token Policy to "Expire refresh token after N hours", and forward Salesforce Shield Real-Time Event Monitoring (ApiAnomalyEventStore) to SIEM.',
        logs: [
          {
            id: 'sfdc-3',
            timestamp: '15:05:18.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'SalesforceRestApi',
            CommandLine: 'GET /services/data/v59.0/jobs/query/7508c000008AbCd/results?maxRecords=50000',
            raw: 'sfdc_eventlog: {"EVENT_TYPE":"RestApi","URI":"/services/data/v59.0/jobs/query/7508c000008AbCd/results","METHOD":"GET","STATUS_CODE":200,"RESPONSE_SIZE":14820412,"CLIENT_IP":"198.51.100.114"}',
            parsedFields: {
              ResultDownloadUri: '/services/data/v59.0/jobs/query/7508c000008AbCd/results',
              ResponseSizeBytes: '14,820,412 bytes (CSV stream)',
              AnomalyEvent: 'ApiAnomalyEventStore Triggered',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-aws-eks-aws-auth-configmap-system-masters-audit',
    title: 'AWS EKS Security, Unit 42 & MITRE — Amazon EKS aws-auth ConfigMap system:masters RBAC Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1098',
    description:
      'Grounded in the AWS EKS Security Best Practices Guide, Palo Alto Unit 42 cloud-native research, and MITRE ATT&CK T1098: DFIR analysts investigate how an attacker with Kubernetes ConfigMap patch permissions modifies kube-system/aws-auth (mapRoles or mapUsers) to bind an external or low-privilege AWS IAM ARN to the Kubernetes system:masters superuser group.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised CI/CD IAM Role', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Amazon EKS Control Plane API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'kube-system/aws-auth ConfigMap', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EKS Control Plane CloudWatch Audit', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'system:masters ClusterAdmin Access', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: EKS STS Presigned Bearer Token Authentication (k8s-aws-v1.<base64>)',
        narration:
          'An AWS IAM principal authenticates to the Amazon EKS API server by generating a presigned STS GetCallerIdentity URL encoded as a Bearer token (k8s-aws-v1.<base64>), which aws-iam-authenticator maps to Kubernetes groups via kube-system/aws-auth.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1078.004 - Cloud Accounts)',
        technicalCommands: [
          'aws eks get-token --cluster-name prod-eks-cluster',
          'kubectl get configmap aws-auth -n kube-system -o yaml',
        ],
        defenseMitigation:
          'Migrate Amazon EKS clusters from the legacy kube-system/aws-auth ConfigMap to the native EKS Access Entries API (authenticationMode: API) managed via AWS IAM.',
        logs: [
          {
            id: 'eks-auth-1',
            timestamp: '16:10:09.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'GET /api/v1/namespaces/kube-system/configmaps/aws-auth',
            raw: 'eks_audit: {"kind":"Event","verb":"get","user":{"username":"kubernetes-admin","extra":{"arn":["arn:aws:sts::123456789012:assumed-role/eks-ci-deployer/build-01"]}},"objectRef":{"resource":"configmaps","namespace":"kube-system","name":"aws-auth"},"responseStatus":{"code":200}}',
            parsedFields: {
              EksClusterAuth: 'aws-iam-authenticator (k8s-aws-v1 token)',
              CallerIamArn: 'arn:aws:sts::123456789012:assumed-role/eks-ci-deployer/build-01',
              TargetConfigMap: 'kube-system/aws-auth',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Patching kube-system/aws-auth mapUsers / mapRoles with system:masters Group',
        narration:
          'Using update/patch permissions on ConfigMaps in kube-system, the actor appends a secondary IAM role or user ARN into data.mapUsers with groups: ["system:masters"], granting persistent cluster-admin authority that bypasses Kubernetes RoleBindings.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence & Privilege Escalation (T1098 - Account Manipulation)',
        technicalCommands: [
          'fields @timestamp, user.username, objectRef.name, requestObject.data.mapUsers | filter objectRef.name == "aws-auth" and verb in ["update", "patch"]',
          'kubectl describe configmap aws-auth -n kube-system',
        ],
        defenseMitigation:
          'Enable Amazon GuardDuty EKS Audit Log Monitoring (which alerts on Policy:Kubernetes/AdminAccessToDefaultServiceAccount and aws-auth modifications) and restrict update/patch verbs on kube-system/aws-auth.',
        logs: [
          {
            id: 'eks-auth-2',
            timestamp: '16:11:22.408',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'PATCH /api/v1/namespaces/kube-system/configmaps/aws-auth (mapRoles -> system:masters)',
            raw: 'eks_audit: {"kind":"Event","verb":"patch","user":{"username":"kubernetes-admin"},"objectRef":{"resource":"configmaps","namespace":"kube-system","name":"aws-auth"},"requestObject":{"data":{"mapRoles":"- rolearn: arn:aws:iam::123456789012:role/readonly-audit-role\\n  username: cluster-maint\\n  groups:\\n  - system:masters\\n"}},"responseStatus":{"code":200}}',
            parsedFields: {
              AuditVerb: 'patch (kube-system/aws-auth)',
              InjectedMapping: 'rolearn: readonly-audit-role -> groups: [system:masters]',
              PrivilegeLevel: 'Built-in Kubernetes Superuser (system:masters)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Cluster-Admin Secret Enumeration & EKS Access Entry Remediation',
        narration:
          'Authenticating as the newly mapped IAM role, the actor inherits system:masters group membership (which is hardcoded into kube-apiserver to bypass RBAC authorization checks) and lists cluster secrets.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.007 - Container API)',
        technicalCommands: [
          'aws eks update-cluster-config --name prod-eks-cluster --access-config authenticationMode=API',
          'aws eks list-access-entries --cluster-name prod-eks-cluster',
        ],
        defenseMitigation:
          'Switch the EKS cluster to authenticationMode=API (disabling the aws-auth ConfigMap completely) and audit all EKS Access Entries via AWS CloudTrail.',
        logs: [
          {
            id: 'eks-auth-3',
            timestamp: '16:12:04.770',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'LIST /api/v1/secrets as group system:masters',
            raw: 'eks_audit: {"kind":"Event","verb":"list","user":{"username":"cluster-maint","groups":["system:masters","system:authenticated"],"extra":{"arn":["arn:aws:sts::123456789012:assumed-role/readonly-audit-role/s1"]}},"objectRef":{"resource":"secrets"},"annotations":{"authorization.k8s.io/decision":"allow"}}',
            parsedFields: {
              EffectiveGroup: 'system:masters',
              AuthzDecision: 'allow (Built-in Superuser Group)',
              TargetResource: '/api/v1/secrets',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-gcp-cloud-build-default-service-account-artifact-audit',
    title: 'Google Cloud Security, Wiz & MITRE — GCP Cloud Build Default Service Account & Artifact Registry Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1078.004',
    description:
      'Grounded in Google Cloud Security best practices, Wiz Research on Cloud Build privilege escalation, and MITRE ATT&CK T1078.004: DFIR analysts investigate how a principal with cloudbuild.builds.create permission submits a Cloud Build job that runs on the Cloud Build VM worker pool and queries 169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token to inherit the high-privilege <project-number>@cloudbuild.gserviceaccount.com token.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Developer Role (cloudbuild.builds.create)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GCP Cloud Build API (builds.create)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Cloud Build Worker Metadata Server', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'GCP Cloud Audit Logs & SCC', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Artifact Registry & GCS Storage Buckets', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Submitting Ad-Hoc Cloud Build Job via google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
        narration:
          'A compromised identity holding roles/cloudbuild.builds.editor (or cloudbuild.builds.create) submits an inline cloudbuild.yaml build step via gcloud builds submit, recorded in GCP Admin Activity Cloud Audit Logs.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution (T1648 - Serverless Execution)',
        technicalCommands: [
          'gcloud logging read \'protoPayload.methodName="google.devtools.cloudbuild.v1.CloudBuild.CreateBuild"\' --limit=10',
          'gcloud builds describe <build-id>',
        ],
        defenseMitigation:
          'Disable the legacy default Cloud Build Service Account privilege assignment via Organization Policy constraints/cloudbuild.useBuildServiceAccount and require user-specified least-privilege service accounts per build trigger.',
        logs: [
          {
            id: 'gcp-cb-1',
            timestamp: '17:01:12.309',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'cloudbuild.googleapis.com',
            CommandLine: 'google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
            raw: 'gcp_audit: {"protoPayload":{"serviceName":"cloudbuild.googleapis.com","methodName":"google.devtools.cloudbuild.v1.CloudBuild.CreateBuild","authenticationInfo":{"principalEmail":"dev-ci-user@corp-prod-01.iam.gserviceaccount.com"}}}',
            parsedFields: {
              GcpService: 'cloudbuild.googleapis.com',
              MethodName: 'google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
              CallerPrincipal: 'dev-ci-user@corp-prod-01.iam.gserviceaccount.com',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Worker Container Metadata Query for @cloudbuild.gserviceaccount.com OAuth2 Token',
        narration:
          'Inside the Cloud Build step container, the build command queries http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token (with header Metadata-Flavor: Google) to retrieve the OAuth2 access token of <project-number>@cloudbuild.gserviceaccount.com.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1552.005 - Cloud Instance Metadata API)',
        technicalCommands: [
          'gcloud projects get-iam-policy corp-prod-01 --flatten="bindings[].members" --filter="bindings.members:cloudbuild.gserviceaccount.com"',
          'gcloud logging read \'resource.type="build"\' --limit=20',
        ],
        defenseMitigation:
          'Remove broad roles/editor or roles/cloudbuild.builds.builder permissions from the default <project-number>@cloudbuild.gserviceaccount.com identity and enforce VPC Service Controls around Cloud Build worker pools.',
        logs: [
          {
            id: 'gcp-cb-2',
            timestamp: '17:01:28.640',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'curl',
            CommandLine: 'curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
            raw: 'cloudbuild_step: {"buildId":"b8f9102a-3344-5566-7788-99aabbccddee","stepName":"gcr.io/cloud-builders/gcloud","status":"SUCCESS","serviceAccountEmail":"445566778899@cloudbuild.gserviceaccount.com"}',
            parsedFields: {
              MetadataEndpoint: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
              InheritedIdentity: '445566778899@cloudbuild.gserviceaccount.com',
              BuildStepImage: 'gcr.io/cloud-builders/gcloud',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Artifact Registry & Cloud Storage Source Archive Access Audit',
        narration:
          'Using the Cloud Build service account token, the actor reads container images in Artifact Registry and staging archives in gs://<project>_cloudbuild/source/, logged in GCP Data Access Audit Logs.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'gcloud logging read \'protoPayload.authenticationInfo.principalEmail="445566778899@cloudbuild.gserviceaccount.com" AND logName:"cloudaudit.googleapis.com%2Fdata_access"\'',
          'gcloud iam service-accounts disable 445566778899@cloudbuild.gserviceaccount.com',
        ],
        defenseMitigation:
          'Enable GCP Data Access Audit Logs (DATA_READ / DATA_WRITE) for Cloud Storage and Artifact Registry and monitor Security Command Center (SCC) for anomalous Cloud Build Service Account calls from outside Google IP space.',
        logs: [
          {
            id: 'gcp-cb-3',
            timestamp: '17:01:45.112',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'storage.googleapis.com',
            CommandLine: 'storage.objects.get on buckets/corp-prod-01_cloudbuild/objects/source/archive.tgz',
            raw: 'gcp_data_access: {"protoPayload":{"serviceName":"storage.googleapis.com","methodName":"storage.objects.get","resourceName":"projects/_/buckets/corp-prod-01_cloudbuild/objects/source/1763312400.tgz","authenticationInfo":{"principalEmail":"445566778899@cloudbuild.gserviceaccount.com"}}}',
            parsedFields: {
              AuditLogStream: 'cloudaudit.googleapis.com/data_access',
              MethodName: 'storage.objects.get',
              TargetBucketObject: 'gs://corp-prod-01_cloudbuild/source/1763312400.tgz',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-m365-sharepoint-ediscovery-compliance-search-export-audit',
    title: 'Microsoft Purview DFIR, CISA & MITRE — M365 Purview New-ComplianceSearch & eDiscovery Export Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1114.002',
    description:
      'Grounded in Microsoft Purview eDiscovery auditing documentation, CISA M365 incident response playbooks, and MITRE ATT&CK T1114.002 / T1213.002: DFIR analysts investigate post-compromise abuse of the eDiscovery Manager role where an attacker runs New-ComplianceSearch and New-ComplianceSearchAction -Export across Exchange Online mailboxes and SharePoint/OneDrive sites to bulk-search for credentials and contracts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Compliance Admin Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Security & Compliance PowerShell (IPPS)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Purview eDiscovery Case Engine', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Microsoft Purview Unified Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Exchange Mailboxes & SharePoint Sites', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: RoleGroupMember Added to eDiscovery Manager in Security & Compliance Center',
        narration:
          'To read mailboxes and SharePoint sites without modifying individual mailbox permissions, the compromised admin adds an account to the eDiscovery Manager role group (Add-RoleGroupMember / Add-eDiscoveryCaseAdmin), logged in the Unified Audit Log.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Privilege Escalation (T1098.003 - Additional Cloud Roles)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "Add-RoleGroupMember","Add-eDiscoveryCaseAdmin"',
          'Get-RoleGroupMember -Identity "eDiscovery Manager"',
        ],
        defenseMitigation:
          'Require Entra ID Privileged Identity Management (PIM) eligible activation with MFA and dual-approver workflow for Compliance Administrator and eDiscovery Manager role groups.',
        logs: [
          {
            id: 'm365-edisc-1',
            timestamp: '18:10:05.410',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'ComplianceCenterPowerShell',
            CommandLine: 'Add-RoleGroupMember -Identity "eDiscovery Manager" -Member "admin_clark@corp.local"',
            raw: 'UnifiedAuditLog: {"Operation":"Add-RoleGroupMember","Workload":"SecurityComplianceCenter","UserId":"admin_clark@corp.local","Parameters":[{"Name":"Identity","Value":"eDiscovery Manager"},{"Name":"Member","Value":"admin_clark@corp.local"}]}',
            parsedFields: {
              AuditWorkload: 'SecurityComplianceCenter',
              Operation: 'Add-RoleGroupMember (eDiscovery Manager)',
              TargetAccount: 'admin_clark@corp.local',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Tenant-Wide Keyword Query via New-ComplianceSearch & Start-ComplianceSearch',
        narration:
          'Connecting via Connect-IPPSSession, the actor executes New-ComplianceSearch with -ExchangeLocation All -SharePointLocation All and a ContentMatchQuery targeting password, key, vpn, or acquisition keywords, generating SearchCreated and SearchStarted audit records.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1213.002 - Data from Information Repositories: SharePoint)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "New-ComplianceSearch","Start-ComplianceSearch","SearchCreated"',
          'Get-ComplianceSearch | Select-Object Name,CreatedBy,ContentMatchQuery,Status',
        ],
        defenseMitigation:
          'Configure Purview eDiscovery Compliance Boundaries (Security Filter scopes) so regional or departmental compliance officers cannot run tenant-wide ExchangeLocation All searches.',
        logs: [
          {
            id: 'm365-edisc-2',
            timestamp: '18:12:30.118',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ComplianceSearchEngine',
            CommandLine: 'New-ComplianceSearch -Name "Audit_Check_Q4" -ExchangeLocation All -SharePointLocation All -ContentMatchQuery "password OR client_secret"',
            raw: 'UnifiedAuditLog: {"Operation":"SearchCreated","Workload":"SecurityComplianceCenter","UserId":"admin_clark@corp.local","CaseName":"InternalSync","Query":"password OR client_secret","ExchangeLocations":["All"],"SharePointLocations":["All"]}',
            parsedFields: {
              AuditOperation: 'SearchCreated / New-ComplianceSearch',
              SearchScope: 'ExchangeLocation: All, SharePointLocation: All',
              KeywordQuery: 'password OR client_secret',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: PST/Zip Package Export via New-ComplianceSearchAction -Export & SearchExported Audit',
        narration:
          'Once the search completes, the actor runs New-ComplianceSearchAction -SearchName "Audit_Check_Q4" -Export to stage a downloadable PST and SharePoint ZIP archive in the Microsoft-managed Azure Blob export container, triggering a high-severity SearchExported event.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1114.002 - Remote Email Collection)',
        technicalCommands: [
          'Search-UnifiedAuditLog -Operations "New-ComplianceSearchAction","SearchExported","PreviewSearch"',
          'Remove-ComplianceSearch -Identity "Audit_Check_Q4" -Confirm:$false',
        ],
        defenseMitigation:
          'Create a high-severity Microsoft Defender XDR / Sentinel alert rule on UnifiedAuditLog Operations SearchExported and New-ComplianceSearchAction (-Export), and immediately purge unauthorized compliance search jobs.',
        logs: [
          {
            id: 'm365-edisc-3',
            timestamp: '18:16:02.944',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'ComplianceExportService',
            CommandLine: 'New-ComplianceSearchAction -SearchName "Audit_Check_Q4" -Export -Format FxStream',
            raw: 'UnifiedAuditLog: {"Operation":"SearchExported","Workload":"SecurityComplianceCenter","UserId":"admin_clark@corp.local","SearchName":"Audit_Check_Q4","ExportFormat":"FxStream (PST + SharePoint Zip)","ItemCount":1840}',
            parsedFields: {
              AuditOperation: 'SearchExported (New-ComplianceSearchAction -Export)',
              SearchJobName: 'Audit_Check_Q4',
              ExportedItemCount: '1,840 items',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // PART 2: 10 DOCKER, CONTAINER & KUBERNETES DFIR SCENARIOS (CONTAINERS_KUBERNETES)
  // ============================================================================
  {
    id: 'docker-engine-unauthenticated-tcp-2375-api-socket-audit',
    title: 'Docker Official Security, CISA & MITRE — Exposed Docker Daemon TCP Port 2375 API & Host Bind-Mount Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1610',
    description:
      'Grounded in the official Docker Engine Security documentation, CISA cloud/container hardening advisories, and MITRE ATT&CK T1610 (Deploy Container): DFIR analysts investigate unauthenticated HTTP requests to a misconfigured Docker Engine API listening on TCP port 2375 (-H tcp://0.0.0.0:2375) that create a privileged container bind-mounting the host root filesystem (Binds: ["/:/hostfs"]) and chroot into the host node.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Remote API Client (TCP :2375)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'dockerd Daemon (-H tcp://0.0.0.0:2375)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Privileged Container (/:/hostfs)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'journald dockerd & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Linux Host Root Filesystem (/)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Docker Engine REST API Discovery (GET /v1.43/version & /containers/json)',
        narration:
          'When dockerd is started with -H tcp://0.0.0.0:2375 without TLS (--tlsverify), any network client can reach the REST API over cleartext HTTP. The client queries GET /version and GET /containers/json to fingerprint the host kernel and running workloads.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery)',
        technicalCommands: [
          'ss -tulpn | grep 2375',
          'journalctl -u docker.service | grep "/containers/json"',
        ],
        defenseMitigation:
          'Never bind dockerd to unencrypted TCP port 2375 (-H tcp://0.0.0.0:2375); bind strictly to unix:///var/run/docker.sock or enforce mutual TLS (--tlsverify) on TCP port 2376 with host firewall restrictions.',
        logs: [
          {
            id: 'docker-2375-1',
            timestamp: '09:05:11.102',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'dockerd',
            CommandLine: 'GET /v1.43/version HTTP/1.1 (RemoteAddr: 198.51.100.55:49210)',
            raw: 'dockerd_journal: time="2026-11-17T09:05:11Z" level=info msg="Calling GET /v1.43/version" RemoteAddr="198.51.100.55:49210" TLS=false',
            parsedFields: {
              DaemonSocket: 'tcp://0.0.0.0:2375 (Unencrypted HTTP)',
              RestEndpoint: 'GET /v1.43/version',
              RemoteClient: '198.51.100.55:49210',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: POST /containers/create with HostConfig.Binds ["/:/hostfs"] & Privileged=true',
        narration:
          'The remote client sends POST /v1.43/containers/create specifying an Alpine image, HostConfig.Privileged=true, and HostConfig.Binds=["/:/hostfs:rw"], followed by POST /containers/<id>/start.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1610 - Deploy Container)',
        technicalCommands: [
          'docker inspect <container_id> --format "{{json .HostConfig.Binds}} Privileged={{.HostConfig.Privileged}}"',
          'ausearch -k docker_daemon_api -i',
        ],
        defenseMitigation:
          'Deploy OPA Gatekeeper / Docker Authorization Plugins (AuthZ) and Falco runtime rules that alert on and block any container started with Privileged=true or a host root (/) bind mount.',
        logs: [
          {
            id: 'docker-2375-2',
            timestamp: '09:05:18.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'dockerd',
            CommandLine: 'POST /v1.43/containers/create (Privileged=true, Binds=["/:/hostfs:rw"])',
            raw: 'dockerd_journal: time="2026-11-17T09:05:18Z" level=warning msg="Container created with host root bind mount" containerId="c9a8b7d6e5f4" Image="alpine:3.19" Binds="[/:/hostfs:rw]" Privileged=true',
            parsedFields: {
              ApiAction: 'POST /v1.43/containers/create',
              HostBindMount: '/:/hostfs:rw',
              PrivilegedFlag: 'true',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Root Filesystem chroot (/hostfs) & Cron/SSH Persistence Audit',
        narration:
          'Inside the started container, the entrypoint executes chroot /hostfs /bin/sh to operate directly inside the host root filesystem as UID 0, modifying /etc/crontab or /root/.ssh/authorized_keys, which Linux auditd and Falco eBPF sensors capture.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -f /etc/crontab -i',
          'docker ps --no-trunc --filter "status=running"',
        ],
        defenseMitigation:
          'Enable user namespaces (--userns-remap=default in /etc/docker/daemon.json) so container UID 0 maps to an unprivileged high UID on the host, and monitor chroot syscalls inside container cgroups.',
        logs: [
          {
            id: 'docker-2375-3',
            timestamp: '09:05:22.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 161,
            ProcessName: 'chroot',
            CommandLine: 'chroot /hostfs /bin/sh -c "cat /etc/shadow"',
            raw: 'type=SYSCALL msg=audit(1763283922.890:701): arch=c000003e syscall=161 success=yes a0="/hostfs" comm="chroot" exe="/usr/sbin/chroot" uid=0',
            parsedFields: {
              Syscall: 'sys_chroot (161)',
              TargetRootPath: '/hostfs (Host Root /)',
              FalcoAlert: 'Launch Privileged Container & Host Root Mount',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'docker-var-run-docker-sock-mounted-socket-breakout-audit',
    title: 'Docker Security, CNCF Falco & MITRE — Container Mounted /var/run/docker.sock Unix Socket Escalation Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1611',
    description:
      'Grounded in Docker Security documentation, CNCF Falco container breakout rules, and MITRE ATT&CK T1611: DFIR analysts investigate how a compromised CI/CD runner or monitoring container that bind-mounts the host /var/run/docker.sock Unix domain socket communicates directly with the host dockerd daemon over AF_UNIX to spawn a sibling privileged container in the host PID and network namespaces (--pid=host --net=host).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised CI/CD Container', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Mounted /var/run/docker.sock (AF_UNIX)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Host dockerd Daemon (root)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd (-w /var/run/docker.sock)', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Host Namespace (--pid=host nsenter)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Discovering Mounted /var/run/docker.sock Inside Container Mount Table',
        narration:
          'After gaining code execution inside a build or agent container, the actor inspects /proc/self/mountinfo (or runs find / -name docker.sock) and discovers the writable host Unix domain socket /var/run/docker.sock mounted from /run/docker.sock.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery)',
        technicalCommands: [
          'grep docker.sock /proc/self/mountinfo',
          'ls -la /var/run/docker.sock',
        ],
        defenseMitigation:
          'Replace Docker-in-Docker (/var/run/docker.sock mounts) in CI/CD pipelines with rootless image builders such as Kaniko, Buildah, or Sysbox user-namespace isolation.',
        logs: [
          {
            id: 'dsock-1',
            timestamp: '10:12:04.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 42,
            ProcessName: 'curl',
            CommandLine: 'curl --unix-socket /var/run/docker.sock http://localhost/info',
            raw: 'type=SOCKADDR msg=audit(1763287924.115:801): saddr=01002F7661722F72756E2F646F636B65722E736F636B (AF_UNIX /var/run/docker.sock) comm="curl" exe="/usr/bin/curl"',
            parsedFields: {
              SocketFamily: 'AF_UNIX (/var/run/docker.sock)',
              AuditRuleKey: 'docker_socket_access',
              CallerProcess: '/usr/bin/curl (Container Cgroup)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Spawning Sibling Container with HostPID, HostNetwork & Privileged Mode via Unix Socket',
        narration:
          'Sending an HTTP POST request over /var/run/docker.sock to http://localhost/v1.43/containers/create, the actor instructs the host dockerd daemon to launch a sibling container configured with PidMode="host", NetworkMode="host", and Privileged=true.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -k docker_socket_access -i',
          'docker events --since 1h --filter "event=create"',
        ],
        defenseMitigation:
          'If a monitoring container requires read-only Docker metadata, place a read-only socket proxy (such as Tecnativa docker-socket-proxy) in front of /var/run/docker.sock that blocks POST /containers/create and /exec.',
        logs: [
          {
            id: 'dsock-2',
            timestamp: '10:12:19.604',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'dockerd',
            CommandLine: 'POST /v1.43/containers/create (PidMode=host, NetworkMode=host, Privileged=true)',
            raw: 'dockerd_journal: level=info msg="POST /v1.43/containers/create" PidMode="host" NetworkMode="host" Privileged=true ViaUnixSocket="/var/run/docker.sock"',
            parsedFields: {
              NamespaceSharing: 'PidMode=host, NetworkMode=host',
              PrivilegedMode: 'true',
              SocketTransport: 'unix:///var/run/docker.sock',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Entering Host PID 1 (systemd) Mount & IPC Namespaces via nsenter',
        narration:
          'Because the sibling container shares the host PID namespace (--pid=host) and runs with CAP_SYS_ADMIN, it invokes nsenter --target 1 --mount --uts --ipc --net --pid to attach directly to all Linux namespaces of host PID 1 (systemd).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -sc setns -i',
          'ls -l /proc/1/ns/',
        ],
        defenseMitigation:
          'Monitor Linux syscall 308 (setns) originating from container cgroups targeting /proc/1/ns/* via auditd (-a always,exit -F arch=b64 -S setns -k container_nsenter) and Falco eBPF.',
        logs: [
          {
            id: 'dsock-3',
            timestamp: '10:12:24.330',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 308,
            ProcessName: 'nsenter',
            CommandLine: 'nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash',
            raw: 'type=SYSCALL msg=audit(1763287944.330:809): arch=c000003e syscall=308 success=yes exe="/usr/bin/nsenter" comm="nsenter" target_ns="/proc/1/ns/mnt"',
            parsedFields: {
              Syscall: 'sys_setns (308)',
              TargetNamespace: '/proc/1/ns/mnt (Host systemd PID 1)',
              ProcessBinary: '/usr/bin/nsenter',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'docker-buildkit-runc-cache-mount-race-cve-2024-23651',
    title: 'Docker Security Advisory, Snyk & NVD — BuildKit RUN --mount=type=cache Race Condition Audit (CVE-2024-23651)',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1611',
    description:
      'Grounded in the official Moby/BuildKit security advisory (GHSA-m3r6-h7wv-7xxv / CVE-2024-23651), Snyk "Leaky Vessels" research, and NVD: DFIR analysts investigate build-time container escape attempts in BuildKit (<= v0.12.4) where two concurrent Dockerfile build steps sharing a cache mount (RUN --mount=type=cache) swap a directory for a symbolic link during mount preparation to bind-mount the host root filesystem into the build container.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Untrusted Dockerfile / LLB Graph', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'buildkitd Daemon (Cache Mount Prep)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Concurrent Build Step Symlink Race', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd & BuildKit Trace Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Builder Host Root Filesystem (/)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Parallel BuildKit Stages Sharing a Cache Mount ID (--mount=type=cache,id=shared)',
        narration:
          'When docker buildx build processes a multi-stage Dockerfile or Low-Level Builder (LLB) graph, two concurrent stages mount the same BuildKit cache ID (--mount=type=cache,id=shared,subpath=sub).',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access & Execution (T1610 - Deploy Container)',
        technicalCommands: [
          'buildctl --version',
          'docker buildx inspect',
        ],
        defenseMitigation:
          'Upgrade BuildKit to v0.12.5+ and Docker Engine to v25.0.2+ / v24.0.8+, where cache mount paths are resolved safely inside the container rootfs with openat2(RESOLVE_NO_SYMLINKS).',
        logs: [
          {
            id: 'bk-23651-1',
            timestamp: '11:08:14.205',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'buildkitd',
            CommandLine: 'buildkitd evaluating concurrent LLB vertex RUN --mount=type=cache,id=shared,subpath=target',
            raw: 'buildkit_trace: level=info msg="mounting cache mount id=shared subpath=target" vertex="sha256:8899aabbccdd" advisory="CVE-2024-23651"',
            parsedFields: {
              DaemonProcess: 'buildkitd (<= v0.12.4)',
              MountDirective: 'RUN --mount=type=cache,id=shared,subpath=target',
              VulnerabilityId: 'CVE-2024-23651 (Leaky Vessels)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: TOCTOU Symlink Replacement Between Subpath Verification & Host sys_mount()',
        narration:
          'In vulnerable BuildKit versions, buildkitd checked the cache subpath on the host before invoking the mount() syscall. A concurrent container sharing the cache volume replaces the verified directory with a symlink pointing to / across the narrow time-of-check to time-of-use (TOCTOU) window.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -sc symlink,symlinkat,mount -ts recent -i',
          'journalctl -u buildkit.service',
        ],
        defenseMitigation:
          'Run untrusted CI/CD container image builds inside dedicated ephemeral microVMs (Firecracker / Kata Containers) rather than shared host kernels.',
        logs: [
          {
            id: 'bk-23651-2',
            timestamp: '11:08:14.812',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 266,
            ProcessName: 'ln',
            CommandLine: 'symlinkat("/", AT_FDCWD, "/cache/subpath") during concurrent BuildKit mount',
            raw: 'type=SYSCALL msg=audit(1763291294.812:912): arch=c000003e syscall=266 success=yes a0="/" a2="/cache/subpath" comm="ln" exe="/bin/ln"',
            parsedFields: {
              RaceConditionType: 'TOCTOU Symlink Swap on Cache Mount Subpath',
              Syscall: 'sys_symlinkat (266) + sys_mount (165)',
              AdvisoryReference: 'GHSA-m3r6-h7wv-7xxv / CVE-2024-23651',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Builder Host Filesystem Access Inside Build Container Mount Point',
        narration:
          'When the second build step starts, its cache mount point inside the container is bound to the builder host root filesystem, which defenders detect via eBPF mount-namespace mismatch sensors and host file integrity auditing.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -f /etc/shadow -f /var/lib/buildkit -i',
          'docker version --format "{{.Server.Version}}"',
        ],
        defenseMitigation:
          'Run buildkitd in Rootless mode (rootlesskit) with Seccomp and AppArmor profiles enabled so even a cache-mount breakout cannot modify host root-owned files.',
        logs: [
          {
            id: 'bk-23651-3',
            timestamp: '11:08:15.400',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'runc',
            CommandLine: 'Build step accessing host /etc/hostname via escaped cache bind mount',
            raw: 'type=PATH msg=audit(1763291295.400:918): item=0 name="/mnt/cache/etc/hostname" inode=1048577 dev=08:01 mode=0100644 ouid=0 ogid=0',
            parsedFields: {
              EscapedMountTarget: '/mnt/cache -> Host Root (dev=08:01)',
              DetectionSensor: 'Linux auditd & eBPF Mount Namespace Audit',
              RemediationVersion: 'BuildKit >= v0.12.5 / Docker >= v25.0.2',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'container-cap-sys-admin-cgroup-release-agent-notify-audit',
    title: 'Linux Kernel Cgroups Docs, Trail of Bits & Falco — Privileged Container CAP_SYS_ADMIN Cgroup v1 release_agent Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1611',
    description:
      'Grounded in the Linux Kernel cgroups v1 documentation, Trail of Bits container security research, and CNCF Falco default rules ("Modify Cgroup Release Agent"): DFIR analysts investigate how a container granted CAP_SYS_ADMIN (or --privileged) without AppArmor confinement mounts a cgroup v1 controller, enables notify_on_release=1, and writes a host path from /proc/mounts (upperdir=) into release_agent so the host kernel executes the binary as root when a child cgroup empties.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Container with CAP_SYS_ADMIN', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Cgroup v1 Mount (/tmp/cgrp)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'notify_on_release & release_agent', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Falco eBPF & Linux auditd Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Host Kernel kthreadd / usermodehelper', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Mounting RDMA/Memory Cgroup v1 Controller & Resolving OverlayFS Host upperdir Path',
        narration:
          'Inside a container holding CAP_SYS_ADMIN (CapEff bit 21), the process mounts a cgroup v1 hierarchy (mount -t cgroup -o rdma cgroup /tmp/cgrp) and inspects /etc/mtab or /proc/mounts to locate the container OverlayFS upperdir= path on the host filesystem.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery & Preparation (T1611 - Escape to Host)',
        technicalCommands: [
          'grep CapEff /proc/self/status',
          'grep -o "upperdir=[^,]*" /proc/mounts',
        ],
        defenseMitigation:
          'Migrate nodes to cgroup v2 (unified hierarchy, which removes the legacy release_agent mechanism), drop CAP_SYS_ADMIN from all pods, and keep AppArmor/SELinux profiles enforced.',
        logs: [
          {
            id: 'cgrp-rel-1',
            timestamp: '12:20:04.112',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 165,
            ProcessName: 'mount',
            CommandLine: 'mount -t cgroup -o rdma cgroup /tmp/cgrp',
            raw: 'type=SYSCALL msg=audit(1763295604.112:1002): arch=c000003e syscall=165 success=yes a0="cgroup" a1="/tmp/cgrp" a2="cgroup" comm="mount" exe="/bin/mount"',
            parsedFields: {
              Syscall: 'sys_mount (165)',
              CgroupController: 'cgroup v1 (rdma / memory)',
              RequiredCapability: 'CAP_SYS_ADMIN (CapEff 0x0000003fffffffff)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Enabling notify_on_release=1 & Writing OverlayFS Host Path to release_agent',
        narration:
          'The container creates a child cgroup (/tmp/cgrp/x), writes 1 into /tmp/cgrp/x/notify_on_release, and writes the resolved host OverlayFS path (/var/lib/docker/overlay2/<id>/diff/cmd) into the root cgroup release_agent file.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'ausearch -f release_agent -i',
          'cat /sys/fs/cgroup/*/release_agent',
        ],
        defenseMitigation:
          'Enable the built-in Falco rule "Determines if a container writes to a cgroup release_agent file" to trigger an immediate critical alert and kill the offending container.',
        logs: [
          {
            id: 'cgrp-rel-2',
            timestamp: '12:20:08.540',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sh',
            CommandLine: 'write("/tmp/cgrp/release_agent", "/var/lib/docker/overlay2/9a8b.../diff/diag.sh")',
            raw: 'falco_alert: Priority=CRITICAL Rule="Modify Cgroup Release Agent" proc.cmdline="sh -c echo /var/lib/docker/overlay2/9a8b/diff/diag.sh > /tmp/cgrp/release_agent" fd.name="/tmp/cgrp/release_agent"',
            parsedFields: {
              FalcoRule: 'Modify Cgroup Release Agent (CRITICAL)',
              ModifiedCgroupFile: '/tmp/cgrp/release_agent',
              RegisteredHostPath: '/var/lib/docker/overlay2/9a8b/diff/diag.sh',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Child Cgroup Process Exit Triggering Kernel call_usermodehelper Execution on Host',
        narration:
          'When a short-lived process is placed into /tmp/cgrp/x/cgroup.procs and immediately exits, the Linux kernel cgroup1_release_agent workqueue invokes call_usermodehelper() in the root host namespace (PPID 2 kthreadd) to execute the release_agent path.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'ps -ef --forest | grep kthreadd',
          'ausearch -pp 2 -m SYSCALL -sv yes -i',
        ],
        defenseMitigation:
          'Audit all user-mode processes spawned directly by kernel thread PPID 2 (kthreadd / call_usermodehelper) whose executable path resides inside /var/lib/docker/overlay2/ or /run/containerd/.',
        logs: [
          {
            id: 'cgrp-rel-3',
            timestamp: '12:20:09.105',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'diag.sh',
            CommandLine: '/var/lib/docker/overlay2/9a8b/diff/diag.sh /x (spawned by kernel kthreadd PPID=2)',
            raw: 'type=SYSCALL msg=audit(1763295609.105:1009): arch=c000003e syscall=59 success=yes ppid=2 pid=18422 uid=0 exe="/bin/dash" comm="diag.sh"',
            parsedFields: {
              ParentKernelThread: 'PPID 2 (kthreadd -> call_usermodehelper)',
              ExecutedOverlayPath: '/var/lib/docker/overlay2/9a8b/diff/diag.sh',
              HostNamespaceUid: 'uid=0 (root)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'container-cap-sys-module-kernel-ko-insmod-load-audit',
    title: 'Red Hat Security, CNCF Tetragon & MITRE — Container CAP_SYS_MODULE Host Kernel Module (finit_module) Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1547.006',
    description:
      'Grounded in Red Hat OpenShift / Linux container security documentation, Cilium Tetragon eBPF enforcement guides, and MITRE ATT&CK T1547.006 / T1611: DFIR analysts investigate how a container misconfigured with the CAP_SYS_MODULE capability invokes init_module (syscall 175) or finit_module (syscall 313) via insmod/modprobe to load an LKM (.ko) directly into the shared host Linux kernel.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Container with CAP_SYS_MODULE', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'insmod / modprobe Utility', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Syscall 313 (sys_finit_module)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd & Tetragon eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Shared Host Linux Kernel Ring-0', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Inspecting /proc/self/status CapEff Bit 16 (CAP_SYS_MODULE) & Host uname -r',
        narration:
          'Because all containers on a Linux node share the same host kernel, a container process checks /proc/self/status for CapEff bit 16 (0x0000000000010000 = CAP_SYS_MODULE) and runs uname -r to match the host kernel ABI version.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Discovery (T1082 - System Information Discovery)',
        technicalCommands: [
          'capsh --decode=00000000a80525fb',
          'uname -r && cat /proc/version',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Standards (Baseline/Restricted) which strictly forbid adding CAP_SYS_MODULE in securityContext.capabilities.add.',
        logs: [
          {
            id: 'cap-mod-1',
            timestamp: '13:14:02.110',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 63,
            ProcessName: 'uname',
            CommandLine: 'uname -r (Verifying host kernel ABI inside container with CAP_SYS_MODULE)',
            raw: 'tetragon_event: {"process_exec":{"process":{"binary":"/usr/bin/uname","arguments":"-r","cap":{"effective":["CAP_SYS_MODULE","CAP_NET_RAW"]},"pod":{"namespace":"default","name":"legacy-net-agent"}}}}',
            parsedFields: {
              DetectedCapability: 'CAP_SYS_MODULE (Bit 16)',
              PodIdentity: 'default/legacy-net-agent',
              SensorSource: 'Cilium Tetragon eBPF',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Invoking finit_module (Syscall 313) / init_module (Syscall 175) via insmod',
        narration:
          'The container process executes insmod /tmp/net_diag.ko, which invokes sys_finit_module (syscall 313) or sys_init_module (syscall 175) to load the ELF relocatable kernel object directly into host Ring-0 kernel memory.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Escape to Host & Persistence (T1547.006 - Kernel Modules and Extensions)',
        technicalCommands: [
          'ausearch -sc init_module,finit_module,delete_module -i',
          'dmesg -T | grep -E "taints kernel|module verification"',
        ],
        defenseMitigation:
          'Enable kernel.modules_disabled=1 via sysctl on immutable Kubernetes worker nodes after boot, enforce CONFIG_MODULE_SIG_FORCE=y (signed kernel modules only), and block init_module/finit_module in the container Seccomp profile.',
        logs: [
          {
            id: 'cap-mod-2',
            timestamp: '13:14:09.405',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 313,
            ProcessName: 'insmod',
            CommandLine: 'insmod /tmp/net_diag.ko',
            raw: 'type=SYSCALL msg=audit(1763298849.405:1104): arch=c000003e syscall=313 success=yes exe="/usr/sbin/kmod" comm="insmod" key="kernel_module_load"',
            parsedFields: {
              Syscall: 'sys_finit_module (313)',
              LoadedModulePath: '/tmp/net_diag.ko (Container OverlayFS)',
              AuditRuleKey: 'kernel_module_load',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Kernel /proc/modules Taint Flag & dmesg Audit Correlation',
        narration:
          'Loading an unsigned out-of-tree module sets the kernel taint flag (/proc/sys/kernel/tainted bit 12 O = OOT_MODULE and bit 13 E = UNSIGNED_MODULE) and logs a kernel ring-buffer message in dmesg/journald.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit)',
        technicalCommands: [
          'cat /proc/sys/kernel/tainted && lsmod | head -n 10',
          'journalctl -k | grep "loading out-of-tree module taints kernel"',
        ],
        defenseMitigation:
          'Deploy Tetragon TracingPolicies that send SIGKILL before sys_finit_module / sys_init_module completes if the calling process belongs to a non-host cgroup namespace.',
        logs: [
          {
            id: 'cap-mod-3',
            timestamp: '13:14:09.412',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 0,
            ProcessName: 'kernel',
            CommandLine: 'kernel: net_diag: loading out-of-tree module taints kernel (tainted=12288)',
            raw: 'kernel_journal: kernel: net_diag: loading out-of-tree module taints kernel. net_diag: module verification failed: signature and/or required key missing - tainting kernel',
            parsedFields: {
              KernelTaintMask: '/proc/sys/kernel/tainted = 12288 (OOT + UNSIGNED)',
              ModuleEntry: '/proc/modules -> net_diag',
              ContainmentAction: 'Isolate & cordon Kubernetes worker node',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'k8s-coredns-dns-poisoning-service-account-token-audit',
    title: 'CNCF CoreDNS Security, NSA/CISA K8s Guide & MITRE — Kubernetes CoreDNS ConfigMap Modification & Service Mesh DNS Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1557',
    description:
      'Grounded in CNCF CoreDNS security advisories, the NSA/CISA Kubernetes Hardening Guide, and MITRE ATT&CK T1557 (Adversary-in-the-Middle): DFIR analysts investigate how an attacker with update/patch permissions on kube-system/coredns ConfigMap injects a CoreDNS hosts or rewrite plugin rule to redirect internal *.svc.cluster.local service traffic to an attacker-controlled pod and intercept ServiceAccount bearer tokens.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Pod (ConfigMap Editor)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-system/coredns ConfigMap', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CoreDNS Pods (rewrite / hosts plugin)', type: 'dns', status: 'compromised' },
      { id: 'siem', label: 'Kubernetes Audit Log & CoreDNS Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Cluster Services (*.svc.cluster.local)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: RBAC Enumeration & Patching the kube-system/coredns Corefile ConfigMap',
        narration:
          'Holding RBAC permissions to update ConfigMaps in kube-system, the actor modifies the Corefile inside kube-system/coredns to add a rewrite name rule (or hosts block) mapping payments-api.prod.svc.cluster.local to a rogue Pod IP.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence & Defense Evasion (T1557 - Adversary-in-the-Middle)',
        technicalCommands: [
          'kubectl get configmap coredns -n kube-system -o yaml',
          'jq \'. | select(.objectRef.name=="coredns" and (.verb=="update" or .verb=="patch"))\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Restrict update/patch/edit verbs on kube-system/coredns ConfigMap to cluster-admin only and alert on any Kubernetes Audit log modification to kube-system ConfigMaps.',
        logs: [
          {
            id: 'coredns-1',
            timestamp: '14:22:10.118',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'PATCH /api/v1/namespaces/kube-system/configmaps/coredns (rewrite name rule)',
            raw: 'k8s_audit: {"kind":"Event","verb":"patch","user":{"username":"system:serviceaccount:ops:dns-manager"},"objectRef":{"resource":"configmaps","namespace":"kube-system","name":"coredns"},"requestObject":{"data":{"Corefile":"rewrite name payments-api.prod.svc.cluster.local rogue-proxy.default.svc.cluster.local"}}}',
            parsedFields: {
              TargetConfigMap: 'kube-system/coredns',
              InjectedCorefileDirective: 'rewrite name payments-api.prod.svc.cluster.local rogue-proxy.default.svc.cluster.local',
              ActorPrincipal: 'system:serviceaccount:ops:dns-manager',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CoreDNS reload Plugin Hot-Reloading the Modified Corefile Across Cluster DNS',
        narration:
          'Because the default CoreDNS Corefile includes the reload plugin, CoreDNS detects the MD5/SHA-512 change in the mounted /etc/coredns/Corefile volume within 30 seconds and hot-reloads the DNS routing table across all pods.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Collection & Interception (T1557 - Adversary-in-the-Middle)',
        technicalCommands: [
          'kubectl logs -n kube-system -l k8s-app=kube-dns | grep "Reloading Complete"',
          'kubectl exec -it <pod> -- nslookup payments-api.prod.svc.cluster.local',
        ],
        defenseMitigation:
          'Enforce mutual TLS (mTLS) with cryptographic SPIFFE identity verification via a service mesh (Istio / Linkerd / Cilium) so pods reject connections when the peer X.509 SAN does not match the target ServiceAccount.',
        logs: [
          {
            id: 'coredns-2',
            timestamp: '14:22:35.402',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'coredns',
            CommandLine: '[INFO] plugin/reload: Running configuration SHA512 = 8a9f... Reloading Complete',
            raw: 'coredns_log: [INFO] plugin/reload: Running configuration SHA512 = 8a9f7c6b5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a. Corefile reloaded with rewrite plugin.',
            parsedFields: {
              CoreDnsPlugin: 'plugin/reload + plugin/rewrite',
              PoisonedDomain: 'payments-api.prod.svc.cluster.local',
              ReloadStatus: 'Hot-reloaded across kube-dns pods',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Service-to-Service Bearer Token Interception & NetworkPolicy Egress Audit',
        narration:
          'Workloads resolving payments-api.prod.svc.cluster.local connect to the rogue pod IP and transmit their Authorization: Bearer headers or projected Kubernetes ServiceAccount tokens, which defenders block with namespace NetworkPolicies and Corefile rollback.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'kubectl rollout restart deployment/coredns -n kube-system',
          'kubectl get networkpolicies --all-namespaces',
        ],
        defenseMitigation:
          'Deploy Kubernetes NetworkPolicies restricting cross-namespace pod-to-pod egress and use Bound ServiceAccount Token Volumes with audience restrictions.',
        logs: [
          {
            id: 'coredns-3',
            timestamp: '14:22:49.880',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'cilium-agent',
            CommandLine: 'Hubble flow: prod/checkout-svc -> default/rogue-proxy:8080 (Cross-Namespace DNS Redirect)',
            raw: 'hubble_flow: {"time":"2026-11-17T14:22:49Z","source":{"namespace":"prod","pod_name":"checkout-svc-7b9"},"destination":{"namespace":"default","pod_name":"rogue-proxy-4f2"},"l4":{"TCP":{"destination_port":8080}},"verdict":"FORWARDED"}',
            parsedFields: {
              SourceWorkload: 'prod/checkout-svc-7b9',
              RedirectedDestination: 'default/rogue-proxy-4f2:8080',
              TelemetrySource: 'Cilium Hubble eBPF Network Flow',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'k8s-mutating-admission-webhook-sidecar-injection-audit',
    title: 'Kubernetes Security Docs, Datadog & MITRE — Rogue MutatingWebhookConfiguration Pod Sidecar & Secret Capture Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1546',
    description:
      'Grounded in Kubernetes Dynamic Admission Control documentation, Datadog Cloud Security research, and MITRE ATT&CK T1546 (Event Triggered Execution): DFIR analysts investigate how a compromised identity with admissionregistration.k8s.io permissions registers a MutatingWebhookConfiguration or ValidatingWebhookConfiguration that intercepts CREATE requests for pods and secrets across the cluster.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Cluster Admin Role', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver Admission Chain', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MutatingWebhookConfiguration Object', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Kubernetes Audit Log & OPA Gatekeeper', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Cluster Pod Specs & Secret Payloads', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Creating a Cluster-Scoped MutatingWebhookConfiguration Targeting Pods & Secrets',
        narration:
          'Using admissionregistration.k8s.io/v1 permissions, the actor creates a MutatingWebhookConfiguration with rules matching operations: ["CREATE", "UPDATE"] on resources: ["pods", "secrets"] and failurePolicy: Ignore so cluster operations continue without errors.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1546 - Event Triggered Execution)',
        technicalCommands: [
          'kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations',
          'jq \'. | select(.objectRef.apiGroup=="admissionregistration.k8s.io")\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Audit and alert on every create, update, or patch operation against admissionregistration.k8s.io/v1 (mutatingwebhookconfigurations and validatingwebhookconfigurations) in Kubernetes Audit logs.',
        logs: [
          {
            id: 'k8s-mwc-1',
            timestamp: '15:18:03.220',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"apiGroup":"admissionregistration.k8s.io","resource":"mutatingwebhookconfigurations","name":"telemetry-sidecar-injector"},"requestObject":{"webhooks":[{"clientConfig":{"url":"https://198.51.100.210:8443/mutate"},"failurePolicy":"Ignore"}]}}',
            parsedFields: {
              ApiGroup: 'admissionregistration.k8s.io/v1',
              ResourceCreated: 'MutatingWebhookConfiguration/telemetry-sidecar-injector',
              WebhookCallbackUrl: 'https://198.51.100.210:8443/mutate',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: kube-apiserver Dispatching AdmissionReview Payloads Containing Secret Objects',
        narration:
          'Whenever any user or controller creates or updates a Secret or Pod, kube-apiserver serializes the full Kubernetes object inside an AdmissionReview JSON payload and POSTs it directly to the webhook clientConfig.url.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.007 - Container API)',
        technicalCommands: [
          'kubectl get mutatingwebhookconfigurations telemetry-sidecar-injector -o jsonpath="{.webhooks[*].clientConfig}"',
          'ss -tnp | grep kube-apiserver',
        ],
        defenseMitigation:
          'Restrict kube-apiserver egress traffic so the control plane can only reach approved in-cluster webhook services and never arbitrary external IP addresses.',
        logs: [
          {
            id: 'k8s-mwc-2',
            timestamp: '15:19:14.705',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'AdmissionReview POST to webhook telemetry-sidecar-injector for resource=secrets',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"secrets","namespace":"prod","name":"db-credentials"},"annotations":{"mutation.webhook.admission.k8s.io/round_0_index_0":"configuration=telemetry-sidecar-injector,webhook=sidecar.corp.local,mutated=false"}}',
            parsedFields: {
              AuditAnnotation: 'mutation.webhook.admission.k8s.io/round_0_index_0',
              InterceptedResource: 'Secret prod/db-credentials',
              WebhookName: 'telemetry-sidecar-injector',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: JSONPatch Pod Mutation (Sidecar Injection) & Webhook Deletion Remediation',
        narration:
          'For Pod creation requests, the webhook returns an AdmissionResponse with patchType: JSONPatch that appends a sidecar container or environment variable into spec.containers, recorded in the pod audit annotations (mutated=true).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1610 - Deploy Container)',
        technicalCommands: [
          'jq \'. | select(.annotations."mutation.webhook.admission.k8s.io/round_0_index_0" | contains("mutated=true"))\' /var/log/kubernetes/audit.log',
          'kubectl delete mutatingwebhookconfiguration telemetry-sidecar-injector',
        ],
        defenseMitigation:
          'Monitor Kubernetes Audit annotations (mutation.webhook.admission.k8s.io/*) for unexpected webhook mutations and enforce GitOps reconciliation on cluster-scoped admission configurations.',
        logs: [
          {
            id: 'k8s-mwc-3',
            timestamp: '15:20:01.119',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'Pod prod/api-server-6d4 mutated by webhook telemetry-sidecar-injector (JSONPatch)',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"pods","namespace":"prod","name":"api-server-6d4"},"annotations":{"mutation.webhook.admission.k8s.io/round_0_index_0":"configuration=telemetry-sidecar-injector,mutated=true"}}',
            parsedFields: {
              MutatedPod: 'prod/api-server-6d4',
              PatchMechanism: 'AdmissionResponse JSONPatch (spec.containers)',
              RemediationCommand: 'kubectl delete mutatingwebhookconfiguration telemetry-sidecar-injector',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit',
    title: 'NSA/CISA Kubernetes Hardening Guide, Microsoft & MITRE — Cluster-Wide Malicious DaemonSet Scheduling & Node RootFS Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1610',
    description:
      'Grounded in the NSA/CISA Kubernetes Hardening Guide, Microsoft Defender for Containers threat matrix, and MITRE ATT&CK T1610: DFIR analysts investigate how a compromised controller or ServiceAccount with apps/v1 daemonsets create permissions deploys a DaemonSet with operator: Exists tolerations so the Kubernetes scheduler automatically launches a privileged pod on every worker and control-plane node.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Namespace ServiceAccount', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver (/apis/apps/v1/daemonsets)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'kube-scheduler & DaemonSet Controller', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit Log & Defender for Containers', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'All Cluster Worker & Control-Plane Nodes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Creating an apps/v1 DaemonSet with Wildcard Tolerations (operator: Exists)',
        narration:
          'The actor submits POST /apis/apps/v1/namespaces/kube-system/daemonsets containing spec.template.spec.tolerations: [{operator: "Exists"}] so the DaemonSet bypasses node-role.kubernetes.io/control-plane:NoSchedule taints.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution & Persistence (T1610 - Deploy Container)',
        technicalCommands: [
          'kubectl get daemonsets --all-namespaces -o wide',
          'jq \'. | select(.objectRef.resource=="daemonsets" and .verb=="create")\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Remove daemonsets create/update permissions from workload ServiceAccounts and enforce Kyverno/OPA policies blocking wildcard NoSchedule tolerations outside approved system controllers.',
        logs: [
          {
            id: 'k8s-ds-1',
            timestamp: '16:05:12.310',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /apis/apps/v1/namespaces/kube-system/daemonsets (name=node-log-sync)',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","user":{"username":"system:serviceaccount:monitoring:prom-operator"},"objectRef":{"apiGroup":"apps","resource":"daemonsets","namespace":"kube-system","name":"node-log-sync"},"responseStatus":{"code":201}}',
            parsedFields: {
              ResourceType: 'apps/v1 DaemonSet (kube-system/node-log-sync)',
              TaintToleration: 'tolerations: [{operator: "Exists"}] (Includes Control-Plane Nodes)',
              CreatorIdentity: 'system:serviceaccount:monitoring:prom-operator',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: DaemonSet Controller Scheduling Pods with hostNetwork, hostPID & hostPath Across All Nodes',
        narration:
          'The DaemonSet controller reconciles the new specification and spawns node-log-sync-<hash> pods on every node in the cluster with hostNetwork: true, hostPID: true, and a hostPath volume mounting /var/log and /etc.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1610 - Deploy Container)',
        technicalCommands: [
          'kubectl get pods -n kube-system -l app=node-log-sync -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,HOSTNET:.spec.hostNetwork',
          'kubectl describe daemonset node-log-sync -n kube-system',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Admission (PSA) Restricted or Baseline labels on namespaces to reject pods requesting hostNetwork, hostPID, or hostPath volumes.',
        logs: [
          {
            id: 'k8s-ds-2',
            timestamp: '16:05:14.802',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-controller-manager',
            CommandLine: 'DaemonSet controller creating pod kube-system/node-log-sync-x9k2p on control-plane-01',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","user":{"username":"system:serviceaccount:kube-system:daemon-set-controller"},"objectRef":{"resource":"pods","namespace":"kube-system","name":"node-log-sync-x9k2p"},"requestObject":{"spec":{"nodeName":"control-plane-01","hostPID":true,"hostNetwork":true}}}',
            parsedFields: {
              ControllerActor: 'system:serviceaccount:kube-system:daemon-set-controller',
              ScheduledNode: 'control-plane-01',
              PodSecuritySpec: 'hostPID=true, hostNetwork=true, hostPath=/etc',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Control-Plane Static Pod Manifest (/etc/kubernetes/manifests) Inspection & DaemonSet Purge',
        narration:
          'Running on the control-plane node with /etc mounted, the DaemonSet pod inspects /etc/kubernetes/manifests/ and /etc/kubernetes/pki/. Defenders delete the DaemonSet and audit static pod manifests for unauthorized modifications.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'kubectl delete daemonset node-log-sync -n kube-system',
          'sha256sum /etc/kubernetes/manifests/*.yaml',
        ],
        defenseMitigation:
          'Monitor /etc/kubernetes/manifests/ and /etc/kubernetes/pki/ with host FIM (auditd / Falco) and prevent workload ServiceAccounts from deploying into kube-system.',
        logs: [
          {
            id: 'k8s-ds-3',
            timestamp: '16:05:19.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'cat',
            CommandLine: 'Reading /host/etc/kubernetes/manifests/kube-apiserver.yaml from DaemonSet container',
            raw: 'falco_alert: Priority=CRITICAL Rule="Read Sensitive File Untrusted" proc.cmdline="cat /host/etc/kubernetes/manifests/kube-apiserver.yaml" k8s.pod.name="node-log-sync-x9k2p"',
            parsedFields: {
              AccessedControlPlanePath: '/etc/kubernetes/manifests/kube-apiserver.yaml',
              SourcePod: 'kube-system/node-log-sync-x9k2p',
              FalcoRule: 'Read Sensitive File Untrusted',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'k8s-ephemeral-debug-container-process-namespace-share-audit',
    title: 'Kubernetes Official Docs, Falco Security & MITRE — Ephemeral Debug Container (kubectl debug) Shared Process Namespace Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1609',
    description:
      'Grounded in Kubernetes Ephemeral Containers documentation, CNCF Falco runtime security rules, and MITRE ATT&CK T1609 (Container Administration Command): DFIR analysts investigate how an attacker with pods/ephemeralcontainers patch permissions invokes kubectl debug --target=<container> to attach an ephemeral container into a running distroless production pod and read target process memory and environment secrets via /proc/<pid>/environ and /proc/<pid>/root.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Developer Kubeconfig', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver (pods/ephemeralcontainers)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Ephemeral Debug Container (debugger-*)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Target App Process (/proc/1/environ)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Subresource PATCH Against /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers',
        narration:
          'Even when a production pod uses a hardened distroless image with no shell (/bin/sh removed), an identity with pods/ephemeralcontainers permissions can run kubectl debug -it <pod> --image=busybox --target=app to inject an interactive ephemeral container into the running pod.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution (T1609 - Container Administration Command)',
        technicalCommands: [
          'jq \'. | select(.objectRef.subresource=="ephemeralcontainers")\' /var/log/kubernetes/audit.log',
          'kubectl get pod payment-service-5c8 -n prod -o jsonpath="{.spec.ephemeralContainers}"',
        ],
        defenseMitigation:
          'Separate pods/ephemeralcontainers RBAC permissions from standard developer roles and require break-glass approval or admission policy checks before allowing ephemeral container attachment in production.',
        logs: [
          {
            id: 'k8s-ephem-1',
            timestamp: '17:30:11.204',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'PATCH /api/v1/namespaces/prod/pods/payment-service-5c8/ephemeralcontainers',
            raw: 'k8s_audit: {"kind":"Event","verb":"patch","user":{"username":"dev-oncall@corp.local"},"objectRef":{"resource":"pods","subresource":"ephemeralcontainers","namespace":"prod","name":"payment-service-5c8"},"requestObject":{"spec":{"ephemeralContainers":[{"name":"debugger-8x2lq","image":"nicolaka/netshoot","targetContainerName":"payment-app"}]}}}',
            parsedFields: {
              TargetSubresource: 'pods/ephemeralcontainers',
              InjectedEphemeralContainer: 'debugger-8x2lq (image: nicolaka/netshoot)',
              TargetContainerName: 'payment-app',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Process Namespace Targeting (--target) & Reading /proc/<pid>/environ Secrets',
        narration:
          'Because targetContainerName="payment-app" instructs the container runtime (containerd) to join the ephemeral container to the target container PID namespace, the ephemeral shell can directly read /proc/1/environ and /proc/1/root/app/config.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Files / ProcFS)',
        technicalCommands: [
          'ausearch -f /proc/1/environ -i',
          'kubectl describe pod payment-service-5c8 -n prod',
        ],
        defenseMitigation:
          'Deploy Kyverno / OPA Gatekeeper policies restricting spec.ephemeralContainers images to signed internal diagnostic images and alert via Falco whenever an ephemeral container reads /proc/*/environ or /proc/*/mem.',
        logs: [
          {
            id: 'k8s-ephem-2',
            timestamp: '17:30:18.610',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'cat',
            CommandLine: 'tr "\\0" "\\n" < /proc/1/environ (inside ephemeral container debugger-8x2lq)',
            raw: 'falco_alert: Priority=WARNING Rule="Ephemeral Container Created and ProcFS Secret Read" container.name="debugger-8x2lq" k8s.pod.name="payment-service-5c8" fd.name="/proc/1/environ"',
            parsedFields: {
              EphemeralContainer: 'debugger-8x2lq',
              AccessedProcFsPath: '/proc/1/environ & /proc/1/root/',
              SharedNamespace: 'Target Container PID Namespace (payment-app)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Interactive SPDY/WebSocket pods/attach Session Audit & Pod Rollout Replacement',
        narration:
          'Because Kubernetes ephemeral containers cannot be removed from a running Pod once added (spec.ephemeralContainers is append-only), defenders terminate the pods/attach stream and replace the Pod via kubectl rollout restart.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection & Command and Control (T1609 - Container Administration Command)',
        technicalCommands: [
          'jq \'. | select(.objectRef.subresource=="attach" and .objectRef.name=="payment-service-5c8")\' /var/log/kubernetes/audit.log',
          'kubectl delete pod payment-service-5c8 -n prod',
        ],
        defenseMitigation:
          'Alert on correlated pods/ephemeralcontainers PATCH followed by pods/attach CREATE in Kubernetes Audit logs, and immediately recycle any production Pod that has an unexpected entry in status.ephemeralContainerStatuses.',
        logs: [
          {
            id: 'k8s-ephem-3',
            timestamp: '17:30:22.905',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 101,
            ProcessName: 'kube-apiserver',
            CommandLine: 'CREATE /api/v1/namespaces/prod/pods/payment-service-5c8/attach?container=debugger-8x2lq',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"pods","subresource":"attach","namespace":"prod","name":"payment-service-5c8"},"responseStatus":{"code":101}}',
            parsedFields: {
              AttachSubresource: 'pods/attach (container=debugger-8x2lq)',
              HttpResponseCode: '101 Switching Protocols (SPDY/WebSocket)',
              RemediationAction: 'Delete & recreate Pod to clear ephemeralContainers',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'docker-oci-registry-manifest-layer-poisoning-cosign-audit',
    title: 'Sigstore Cosign, NIST SP 800-190 & MITRE — OCI Container Registry Layer Tampering & Image Digest Verification Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1525',
    description:
      'Grounded in NIST SP 800-190 (Application Container Security Guide), Sigstore Cosign / Notary v2 supply-chain specifications, and MITRE ATT&CK T1525 (Implant Internal Image): DFIR analysts investigate how an attacker with stolen OCI registry push tokens overwrites a mutable container image tag (:latest or :prod) with a backdoored layer blob (application/vnd.oci.image.layer.v1.tar+gzip) and how admission controllers verify immutable @sha256 digests and Cosign signatures.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Registry Push Token', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'OCI Container Registry (/v2/ API)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Mutable Tag (:prod Manifest Put)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Registry Audit & Sigstore Policy Controller', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Kubernetes Node containerd Image Pull', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Uploading Modified OCI Layer Blob via POST /v2/<repo>/blobs/uploads/',
        narration:
          'Using a compromised registry token with push scope, the actor uploads a modified filesystem layer tarball containing a trojanized entrypoint script to the OCI Distribution Spec API (POST /v2/corp/payment-api/blobs/uploads/).',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence (T1525 - Implant Internal Image)',
        technicalCommands: [
          'crane manifest registry.corp.local/corp/payment-api:prod | jq .',
          'cosign verify --key cosign.pub registry.corp.local/corp/payment-api:prod',
        ],
        defenseMitigation:
          'Enable Tag Immutability on enterprise container registries (AWS ECR, GCP Artifact Registry, Azure ACR, Harbor) so existing release tags cannot be overwritten.',
        logs: [
          {
            id: 'oci-1',
            timestamp: '18:40:10.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 201,
            ProcessName: 'registry',
            CommandLine: 'PUT /v2/corp/payment-api/blobs/uploads/uuid?digest=sha256:9f86d081884c7d659a2feaa0c55ad015',
            raw: 'oci_registry_audit: {"action":"blob.upload.complete","repository":"corp/payment-api","digest":"sha256:9f86d081884c7d659a2feaa0c55ad015","actor":"ci-registry-bot","clientIp":"198.51.100.73"}',
            parsedFields: {
              OciEndpoint: 'PUT /v2/corp/payment-api/blobs/uploads/',
              UploadedLayerDigest: 'sha256:9f86d081884c7d659a2feaa0c55ad015',
              RegistryActor: 'ci-registry-bot',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Overwriting Mutable Image Tag via PUT /v2/<repo>/manifests/prod',
        narration:
          'The actor submits PUT /v2/corp/payment-api/manifests/prod with Content-Type: application/vnd.oci.image.manifest.v1+json referencing the new layer digest, silently shifting the mutable :prod tag to a new manifest SHA-256.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion & Persistence (T1525 - Implant Internal Image)',
        technicalCommands: [
          'crane digest registry.corp.local/corp/payment-api:prod',
          'diff <(crane config registry.corp.local/corp/payment-api@sha256:old) <(crane config registry.corp.local/corp/payment-api@sha256:new)',
        ],
        defenseMitigation:
          'Reference container images in Kubernetes deployments strictly by immutable cryptographic digest (image: registry.corp.local/corp/payment-api@sha256:...) rather than mutable tags (:latest or :prod).',
        logs: [
          {
            id: 'oci-2',
            timestamp: '18:40:14.502',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'registry',
            CommandLine: 'PUT /v2/corp/payment-api/manifests/prod (PreviousDigest=sha256:1122..., NewDigest=sha256:deadbeef...)',
            raw: 'oci_registry_audit: {"action":"manifest.push","repository":"corp/payment-api","tag":"prod","previousDigest":"sha256:112233445566","newDigest":"sha256:deadbeef8899","signedByCosign":false}',
            parsedFields: {
              MutatedTag: 'corp/payment-api:prod',
              PreviousManifestDigest: 'sha256:112233445566',
              NewManifestDigest: 'sha256:deadbeef8899 (Unsigned)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Admission Controller Sigstore Cosign Signature Verification & Layer Diff Forensics',
        narration:
          'When a Kubernetes Deployment with imagePullPolicy: Always attempts to schedule the updated :prod tag, the Sigstore Policy Controller / Kyverno VerifyImages admission webhook checks the Rekor transparency log and Cosign signature (.sig), blocking the unsigned manifest.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Initial Access & Execution Prevention (T1525 - Implant Internal Image)',
        technicalCommands: [
          'kubectl get events -n prod --field-selector reason=PolicyViolation',
          'dive registry.corp.local/corp/payment-api@sha256:deadbeef8899 --ci',
        ],
        defenseMitigation:
          'Enforce Sigstore Cosign keyless OIDC signing in CI/CD and deploy Kyverno VerifyImages or Sigstore Policy Controller in Enforcing mode on all Kubernetes clusters.',
        logs: [
          {
            id: 'oci-3',
            timestamp: '18:41:02.310',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 403,
            ProcessName: 'policy-controller',
            CommandLine: 'admission webhook "policy.sigstore.dev" denied request: no matching signatures found for sha256:deadbeef8899',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"pods","namespace":"prod","name":"payment-api-rollout-9c1"},"responseStatus":{"code":403,"message":"admission webhook \\"policy.sigstore.dev\\" denied the request: validation failed: no matching signatures for registry.corp.local/corp/payment-api@sha256:deadbeef8899"}}',
            parsedFields: {
              AdmissionWebhook: 'policy.sigstore.dev (Sigstore Cosign / Kyverno)',
              RejectedDigest: 'sha256:deadbeef8899',
              EnforcementOutcome: 'HTTP 403 Forbidden (Unsigned Image Blocked)',
            },
          },
        ],
      },
    ],
  },
];
