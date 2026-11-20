import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
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
  };
