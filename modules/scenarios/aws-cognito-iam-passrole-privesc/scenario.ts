import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'aws-cognito-iam-passrole-privesc',
  code: 'T1098.001',
  name: 'Rhino Security Labs, Datadog & AWS — IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail StopLogging',
  shortSubtitle: 'Rhino Security Labs · Datadog Security Labs · MITRE Cloud · iam:PassRole + lambda:CreateFunction · AdministratorAccess',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Documented in Rhino Security Labs’ canonical AWS IAM Privilege Escalation taxonomy, Datadog Security Labs cloud research, and MITRE ATT&CK Cloud Matrix (T1098.001 / T1562.008), an attacker who compromises a low-privilege developer IAM identity holding iam:PassRole and lambda:CreateFunction + lambda:InvokeFunction can escalate to full AWS account takeover. By creating a new AWS Lambda function bound via iam:PassRole to an existing over-privileged IAM Service Role (such as LambdaAdminDeploymentRole), the attacker’s Python handler executes boto3 calls inside the Lambda runtime to attach AdministratorAccess to their own user and invoke cloudtrail:StopLogging.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Rhino Security Labs (AWS IAM Privilege Escalation) · Datadog Security Labs · MITRE T1098.001 / T1562.008',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1078.004 (Cloud Accounts) · T1098.001 (Additional Cloud Credentials/Roles) · T1562.008 (Disable Cloud Logs)',
    },
    {
      term: 'PRIVESC PERMISSION PAIR',
      value: 'iam:PassRole + lambda:CreateFunction + lambda:InvokeFunction',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'AWS CloudTrail: CreateFunction20150331 -> AttachUserPolicy (AdministratorAccess) -> StopLogging',
    },
  ],
  nodes: [
    {
      id: 'lowpriv_aws_dev_key',
      label: 'Compromised Dev IAM User',
      sublabel: 'AKIAIOSFODNN7DEVUSER (ci-dev-deployer)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Running Pacu (iam__privesc_scan)',
        pidOrPort: 'HTTPS :443 (lambda.us-east-1.amazonaws.com)',
        privilege: 'Low-Priv IAM User (iam:PassRole + lambda:*)',
        artifacts: [
          'Pacu module: exec iam__privesc_scan',
          'aws lambda create-function --role arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole',
        ],
        description:
          'Developer IAM access key lacked direct IAM admin rights but was granted iam:PassRole(*) and lambda:CreateFunction.',
      },
    },
    {
      id: 'aws_iam_passrole_broker',
      label: 'AWS IAM & Lambda Control Plane',
      sublabel: 'iam:PassRole -> LambdaAdminDeploymentRole',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'AWS IAM Authorization & Lambda Provisioning API',
        pidOrPort: 'CreateFunction20150331 (Runtime: python3.12)',
        privilege: 'Delegates LambdaAdminDeploymentRole to Function',
        artifacts: [
          'requestParameters.role: arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole',
          'functionName: metrics-health-sync-tmp',
        ],
        description:
          'Accepts iam:PassRole from ci-dev-deployer and binds the privileged LambdaAdminDeploymentRole to the newly uploaded Python function.',
      },
    },
    {
      id: 'malicious_lambda_runtime',
      label: 'Lambda Execution MicroVM (Firecracker)',
      sublabel: 'metrics-health-sync-tmp (boto3 handler)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'AWS Lambda Python 3.12 Execution Environment',
        pidOrPort: 'Invoke (lambda_function.lambda_handler)',
        privilege: 'AssumedRole: LambdaAdminDeploymentRole (iam:*, cloudtrail:*)',
        artifacts: [
          'boto3.client("iam").attach_user_policy(UserName="ci-dev-deployer", PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess")',
          'boto3.client("cloudtrail").stop_logging(Name="org-audit-trail")',
        ],
        description:
          'Executes the attacker’s Python payload with the full permissions of the passed LambdaAdminDeploymentRole.',
      },
    },
    {
      id: 'aws_account_admin_plane',
      label: 'AWS Account Root / IAM & CloudTrail',
      sublabel: 'AdministratorAccess Attached + Trail Stopped',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'AWS IAM Policy Store & CloudTrail Logging Service',
        pidOrPort: 'AttachUserPolicy & StopLogging API',
        privilege: 'Full Account Administrator (arn:aws:iam::aws:policy/AdministratorAccess)',
        artifacts: [
          'ci-dev-deployer elevated to AdministratorAccess',
          'CloudTrail org-audit-trail IsLogging=false',
        ],
        description:
          'Target IAM user receives full administrative control while the regional CloudTrail audit stream is halted.',
      },
    },
    {
      id: 'datadog_cloud_siem_guardduty',
      label: 'CloudTrail Lake & Datadog Cloud SIEM',
      sublabel: 'PrivilegeEscalation:IAMUser/AdministrativePermissions',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'AWS GuardDuty & Datadog Cloud SIEM',
        pidOrPort: 'CloudTrail Management Events Stream',
        privilege: 'Cloud Security Posture & SCP Guardrails',
        artifacts: [
          'GuardDuty: PrivilegeEscalation:IAMUser/AdministrativePermissions',
          'Stealth:IAMUser/CloudTrailLoggingDisabled (StopLogging)',
        ],
        description:
          'Correlates CreateFunction + PassRole followed within seconds by AttachUserPolicy(AdministratorAccess) and StopLogging.',
      },
    },
  ],
  processTree: [
    {
      pid: 1,
      ppid: 0,
      name: 'python3.12 (Lambda Runtime)',
      commandLine: '/var/lang/bin/python3.12 /var/runtime/bootstrap.py lambda_function.lambda_handler',
      user: 'sbx_user1051',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'boto3.client("iam").attach_user_policy(PolicyArn="...AdministratorAccess")',
        'boto3.client("cloudtrail").stop_logging(Name="org-audit-trail")',
      ],
      memoryBlocks: [
        {
          address: '0x00007F8810200000',
          section: '/var/task/lambda_function.py (Bytecode)',
          permissions: 'R--',
          size: '16 KB',
          status: 'injected',
          description: 'Uploaded Lambda Python handler executing IAM privilege escalation and CloudTrail blinding.',
          hexPreview: '61 74 74 61 63 68 5F 75 73 65 72 5F 70 6F 6C 69 (attach_user_policy / stop_logging)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'IAM PASSROLE & MALICIOUS LAMBDA FUNCTION CREATION',
      subtitle: 'Binding high-privilege LambdaAdminDeploymentRole to a new Python function via iam:PassRole',
      description:
        'Using the compromised ci-dev-deployer access key (AKIA...), the attacker runs Pacu’s iam__privesc_scan module, identifies that the user holds iam:PassRole(*) and lambda:CreateFunction, and creates a new Lambda function (metrics-health-sync-tmp) bound to the privileged LambdaAdminDeploymentRole.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.001',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Credentials',
      activeNodeIds: ['lowpriv_aws_dev_key', 'aws_iam_passrole_broker', 'datadog_cloud_siem_guardduty'],
      compromisedNodeIds: ['aws_iam_passrole_broker'],
      keySpecs: [
        { term: 'PRIVESC VECTOR', value: 'Rhino Security Labs Vector #13: iam:PassRole + lambda:CreateFunction' },
        { term: 'PASSED IAM ROLE', value: 'arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole' },
        { term: 'CLOUDTRAIL EVENT', value: 'CreateFunction20150331 (runtime: python3.12)' },
      ],
    },
    {
      index: 2,
      title: 'LAMBDA INVOCATION & ADMINISTRATORACCESS POLICY ATTACHMENT',
      subtitle: 'Executing boto3 iam.attach_user_policy(AdministratorAccess) inside the Lambda execution role',
      description:
        'The attacker invokes metrics-health-sync-tmp via aws lambda invoke. Running inside AWS Firecracker with the STS credentials of LambdaAdminDeploymentRole, the Python handler calls iam:AttachUserPolicy to grant arn:aws:iam::aws:policy/AdministratorAccess directly to ci-dev-deployer.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.003',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Roles',
      activeNodeIds: ['aws_iam_passrole_broker', 'malicious_lambda_runtime', 'aws_account_admin_plane', 'datadog_cloud_siem_guardduty'],
      compromisedNodeIds: ['aws_iam_passrole_broker', 'malicious_lambda_runtime', 'aws_account_admin_plane'],
      keySpecs: [
        { term: 'API CALL', value: 'iam:AttachUserPolicy (UserName: ci-dev-deployer)' },
        { term: 'GRANTED POLICY', value: 'arn:aws:iam::aws:policy/AdministratorAccess' },
        { term: 'GUARDDUTY ALERT', value: 'PrivilegeEscalation:IAMUser/AdministrativePermissions' },
      ],
    },
    {
      index: 3,
      title: 'CLOUDTRAIL STOPLOGGING DEFENSE EVASION',
      subtitle: 'Halting regional CloudTrail audit recording via cloudtrail:StopLogging',
      description:
        'To blind SOC analysts to subsequent resource creation and data exfiltration, the escalated identity immediately invokes cloudtrail:StopLogging on the account’s primary audit trail (org-audit-trail)—a critical defense-evasion action (MITRE T1562.008) caught by the final CloudTrail event before logging stops.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.008',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Cloud Logs',
      activeNodeIds: ['malicious_lambda_runtime', 'aws_account_admin_plane', 'datadog_cloud_siem_guardduty'],
      compromisedNodeIds: ['aws_iam_passrole_broker', 'malicious_lambda_runtime', 'aws_account_admin_plane'],
      keySpecs: [
        { term: 'EVASION API', value: 'cloudtrail:StopLogging (Name: org-audit-trail)' },
        { term: 'MITRE TECHNIQUE', value: 'T1562.008 (Disable or Modify Cloud Logs)' },
        { term: 'ARCHITECTURAL FIX', value: 'IAM Permissions Boundary + AWS Organizations SCP Denying StopLogging' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'aws-passrole-1',
      no: 1,
      stageIndex: 1,
      timestamp: '19:31:04.220',
      sourceNodeId: 'lowpriv_aws_dev_key',
      targetNodeId: 'aws_iam_passrole_broker',
      sourceLabel: 'ci-dev-deployer',
      targetLabel: 'AWS Lambda Control Plane',
      sourceType: 'NETWORK',
      protocolOrEventId: 'CLOUDTRAIL CreateFunction',
      shortAction: 'LAMBDA_CREATE_WITH_PASSROLE',
      info: 'eventName=CreateFunction20150331 functionName=metrics-health-sync-tmp role=LambdaAdminDeploymentRole',
      sizeOrCode: 'HTTP 201 Created',
      severity: 'HIGH',
      mitreId: 'T1098.001',
      explanation: 'Low-privileged user creates a Lambda function and passes a privileged IAM role via iam:PassRole.',
      rawLog: `{"eventSource":"lambda.amazonaws.com","eventName":"CreateFunction20150331","userIdentity":{"type":"IAMUser","userName":"ci-dev-deployer"},"requestParameters":{"functionName":"metrics-health-sync-tmp","runtime":"python3.12","role":"arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole","handler":"lambda_function.lambda_handler"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS Lambda Function Created with High-Privilege IAM Role via PassRole',
        ruleCode: `title: Suspicious AWS Lambda CreateFunction with Admin Role
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 'lambda.amazonaws.com'
    eventName: 'CreateFunction20150331'
    requestParameters.role|contains: 'Admin'
  condition: selection`,
        mitigation: 'Scope iam:PassRole to specific non-admin role ARNs and require IAM Permissions Boundaries on all developer-created roles.',
      },
    },
    {
      id: 'aws-passrole-2',
      no: 2,
      stageIndex: 2,
      timestamp: '19:31:07.812',
      sourceNodeId: 'malicious_lambda_runtime',
      targetNodeId: 'aws_account_admin_plane',
      sourceLabel: 'Lambda (LambdaAdminDeploymentRole)',
      targetLabel: 'AWS IAM Service',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL AttachUserPolicy',
      shortAction: 'ADMIN_POLICY_ATTACHED',
      info: 'AssumedRole=LambdaAdminDeploymentRole eventName=AttachUserPolicy userName=ci-dev-deployer policyArn=.../AdministratorAccess',
      sizeOrCode: 'GuardDuty High',
      severity: 'CRITICAL',
      mitreId: 'T1098.003',
      explanation: 'The invoked Lambda function uses its execution role to attach AdministratorAccess to the attacker’s IAM user.',
      rawLog: `{"eventSource":"iam.amazonaws.com","eventName":"AttachUserPolicy","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::123456789012:assumed-role/LambdaAdminDeploymentRole/metrics-health-sync-tmp"},"requestParameters":{"userName":"ci-dev-deployer","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS IAM AdministratorAccess Policy Attached by Lambda Execution Role',
        ruleCode: `title: Lambda Execution Role Attaching AdministratorAccess Policy
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 'iam.amazonaws.com'
    eventName: 'AttachUserPolicy'
    requestParameters.policyArn|endswith: ':policy/AdministratorAccess'
  condition: selection`,
        mitigation: 'Never grant iam:AttachUserPolicy or iam:PutUserPolicy to compute execution roles (Lambda/EC2).',
      },
    },
    {
      id: 'aws-passrole-3',
      no: 3,
      stageIndex: 3,
      timestamp: '19:31:09.104',
      sourceNodeId: 'malicious_lambda_runtime',
      targetNodeId: 'aws_account_admin_plane',
      sourceLabel: 'Escalated Admin Identity',
      targetLabel: 'AWS CloudTrail Service',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL StopLogging',
      shortAction: 'CLOUDTRAIL_LOGGING_DISABLED',
      info: 'eventSource=cloudtrail.amazonaws.com eventName=StopLogging requestParameters.name=org-audit-trail',
      sizeOrCode: 'TRAIL_STOPPED',
      severity: 'CRITICAL',
      mitreId: 'T1562.008',
      explanation: 'Attacker invokes cloudtrail:StopLogging to disable audit telemetry across the AWS account.',
      rawLog: `{"eventSource":"cloudtrail.amazonaws.com","eventName":"StopLogging","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::123456789012:assumed-role/LambdaAdminDeploymentRole/metrics-health-sync-tmp"},"requestParameters":{"name":"arn:aws:cloudtrail:us-east-1:123456789012:trail/org-audit-trail"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS CloudTrail Logging Disabled via StopLogging or DeleteTrail',
        ruleCode: `title: AWS CloudTrail StopLogging Invoked
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 'cloudtrail.amazonaws.com'
    eventName:
      - 'StopLogging'
      - 'DeleteTrail'
  condition: selection`,
        mitigation: 'Use an AWS Organizations Organization Trail managed in a dedicated Log Archive account and block cloudtrail:StopLogging via Service Control Policy (SCP).',
      },
    },
  ],
};
