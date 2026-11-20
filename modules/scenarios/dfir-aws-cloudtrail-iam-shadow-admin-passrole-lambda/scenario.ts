import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda',
    title: 'AWS CIRT & CISA Cloud DFIR — AWS IAM PassRole + Lambda Privilege Escalation & StopLogging Tampering',
    category: 'CLOUD_SAAS',
    mitreId: 'T1098.001',
    description:
      'Grounded in AWS CIRT IAM Privilege Escalation Playbooks, Rhino Security Labs AWS IAM research, and CISA Cloud Security Technical Reference Architecture: an attacker with iam:PassRole and lambda:CreateFunction/InvokeFunction privileges passes an existing AdministratorExecutionRole to a new Lambda function that calls iam:AttachUserPolicy (AdministratorAccess) and attempts cloudtrail:StopLogging—all captured in immutable CloudTrail Management Events.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Dev IAM User', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AWS IAM & Lambda API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Lambda (AdminExecRole)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CloudTrail Management Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AttachUserPolicy (AdminAccess)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: IAM Privilege Escalation via iam:PassRole + lambda:CreateFunction20150331v2',
        narration:
          'A compromised developer IAM user (dev-ci-user) lacks direct iam:AttachUserPolicy rights but holds iam:PassRole and lambda:CreateFunction. The actor invokes CreateFunction20150331v2 passing role="arn:aws:iam::123456789012:role/AdminLambdaExecutionRole", embedding a handler that calls boto3.client("iam").attach_user_policy().',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1098.001 - Account Manipulation: IAM PassRole Escalation)',
        technicalCommands: [
          'CloudTrail Event: eventSource="lambda.amazonaws.com" eventName="CreateFunction20150331v2"',
          'userIdentity.userName: "dev-ci-user"',
          'requestParameters.role: "arn:aws:iam::123456789012:role/AdminLambdaExecutionRole"',
        ],
        defenseMitigation:
          'Restrict iam:PassRole with explicit Resource ARNs (never Resource: "*") and apply IAM Permissions Boundaries to all developer and CI/CD roles.',
        logs: [
          {
            id: 'dfir-aws-iam-1',
            timestamp: '18:05:10.112',
            source: 'Network',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail lambda:CreateFunction20150331v2 passing AdminLambdaExecutionRole',
            raw: '{"eventSource":"lambda.amazonaws.com","eventName":"CreateFunction20150331v2","userIdentity":{"type":"IAMUser","userName":"dev-ci-user"},"requestParameters":{"functionName":"metrics-sync-helper","role":"arn:aws:iam::123456789012:role/AdminLambdaExecutionRole","runtime":"python3.12"}}',
            parsedFields: {
              CloudTrailEvent: 'lambda.amazonaws.com : CreateFunction20150331v2',
              InitiatingUser: 'dev-ci-user',
              PassedPrivilegedRole: 'arn:aws:iam::123456789012:role/AdminLambdaExecutionRole',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Lambda Invocation & Shadow Admin Policy Attachment (iam:AttachUserPolicy)',
        narration:
          'When dev-ci-user invokes the function, the Lambda execution environment assumes AdminLambdaExecutionRole and calls iam:AttachUserPolicy to attach arn:aws:iam::aws:policy/AdministratorAccess directly to dev-ci-user.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1098.001 - AttachUserPolicy AdministratorAccess)',
        technicalCommands: [
          'CloudTrail Event: eventSource="iam.amazonaws.com" eventName="AttachUserPolicy"',
          'userIdentity.arn: "arn:aws:sts::123456789012:assumed-role/AdminLambdaExecutionRole/metrics-sync-helper"',
          'requestParameters: {"userName":"dev-ci-user","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}',
        ],
        defenseMitigation:
          'Alert immediately via Amazon EventBridge / SIEM on any iam:AttachUserPolicy, iam:PutUserPolicy, or iam:CreateAccessKey call originating from a Lambda function or non-Terraform role.',
        logs: [
          {
            id: 'dfir-aws-iam-2',
            timestamp: '18:05:14.308',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'CloudTrail iam:AttachUserPolicy AdministratorAccess to dev-ci-user',
            raw: '{"eventSource":"iam.amazonaws.com","eventName":"AttachUserPolicy","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::123456789012:assumed-role/AdminLambdaExecutionRole/metrics-sync-helper"},"requestParameters":{"userName":"dev-ci-user","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}}',
            parsedFields: {
              CloudTrailEvent: 'iam.amazonaws.com : AttachUserPolicy',
              ExecutingPrincipal: 'AssumedRole/AdminLambdaExecutionRole/metrics-sync-helper',
              ElevatedTargetUser: 'dev-ci-user',
              AttachedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: CloudTrail Anti-Forensics Attempt (cloudtrail:StopLogging / DeleteTrail) Blocked by SCP',
        narration:
          'Now holding AdministratorAccess, the actor calls cloudtrail:StopLogging on the organization trail to blind subsequent actions. AWS Organizations Service Control Policies (SCPs) deny the call with errorCode="AccessDenied" while CloudTrail records the StopLogging attempt for DFIR investigators.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.008 - Impair Defenses: Disable or Modify Cloud Logs)',
        technicalCommands: [
          'CloudTrail Event: eventSource="cloudtrail.amazonaws.com" eventName="StopLogging"',
          'errorCode: "AccessDenied" (Blocked by AWS Organizations SCP Deny cloudtrail:StopLogging)',
        ],
        defenseMitigation:
          'Configure an AWS Organizations Trail writing to a dedicated Log Archive account with S3 Object Lock and an SCP denying cloudtrail:StopLogging, DeleteTrail, and UpdateTrail.',
        logs: [
          {
            id: 'dfir-aws-iam-3',
            timestamp: '18:05:19.720',
            source: 'Network',
            severity: 'critical',
            EventCode: 403,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail cloudtrail:StopLogging attempt by dev-ci-user',
            raw: '{"eventSource":"cloudtrail.amazonaws.com","eventName":"StopLogging","userIdentity":{"type":"IAMUser","userName":"dev-ci-user"},"requestParameters":{"name":"arn:aws:cloudtrail:us-east-1:123456789012:trail/org-audit-trail"},"errorCode":"AccessDenied","errorMessage":"User is not authorized to perform: cloudtrail:StopLogging with an explicit deny in a service control policy"}',
            parsedFields: {
              CloudTrailEvent: 'cloudtrail.amazonaws.com : StopLogging',
              TargetedTrail: 'org-audit-trail',
              ErrorCode: 'AccessDenied (Blocked by Organization SCP)',
              MitreTechnique: 'T1562.008 (Disable Cloud Logs)',
            },
          },
        ],
      },
    ],
  };
