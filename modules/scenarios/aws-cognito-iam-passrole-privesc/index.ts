import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'aws-cognito-iam-passrole-privesc',
    briefing: {
      headline: 'Scenario Briefing: AWS IAM iam:PassRole + lambda:CreateFunction Privilege Escalation & CloudTrail StopLogging',
      storyAnalogy:
        'Imagine a junior clerk (ci-dev-deployer) at a bank who is forbidden from opening the main vault (no iam:AttachUserPolicy permission). However, the clerk has two seemingly harmless permissions: they are allowed to build small automated mail-sorting robots (lambda:CreateFunction), and they are allowed to clip any existing employee badge onto a robot (iam:PassRole). The clerk spots the Bank President’s spare badge (LambdaAdminDeploymentRole) hanging on the wall, clips that badge onto a brand-new 5-line Python robot (metrics-health-sync-tmp), and presses the robot’s "Start" button (lambda:InvokeFunction). Wearing the President’s badge, the robot walks over to HR, promotes the junior clerk to Bank President (AdministratorAccess), and unplugs the security cameras (cloudtrail:StopLogging)!',
      plainSummary:
        'In this scenario (T1098.001, Rhino Security Labs, Datadog & AWS - IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail StopLogging), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: passing a Privileged IAM Role to a Newly, then invoking the Lambda Function to Attach, then disabling AWS CloudTrail Auditing. Steps #1–#3 walk that chain end-to-end by covering Passing a Privileged IAM Role to a Newly, then Invoking the Lambda Function to Attach, then Disabling AWS CloudTrail Auditing, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail telemetry correlated across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Compromised Dev IAM User running Pacu), call CreateFunction with iam:PassRole on Node ②/③ (AWS IAM & Lambda Control Plane), execute the boto3 payload inside Node ④ (Lambda Firecracker Runtime), and watch AttachUserPolicy(AdministratorAccess) + StopLogging hit Node ⑤ (AWS Account Admin Plane) detected by Node ⑥ (GuardDuty & Datadog Cloud SIEM).',
      documentedAdvisory: 'Rhino Security Labs AWS IAM Privilege Escalation · Datadog Security Labs · MITRE ATT&CK T1098.001 / T1562.008',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1098.001',
        plainTitle: 'Passing a Privileged IAM Role (iam:PassRole) to a Newly Created AWS Lambda Function (T1098.001)',
        storyAnalogy:
          'The junior clerk builds a tiny Python robot (metrics-health-sync-tmp) and uses iam:PassRole to attach the LambdaAdminDeploymentRole badge to it.',
        simpleExplanation:
          'Using the compromised ci-dev-deployer access key, the attacker runs Pacu’s iam__privesc_scan module, discovers that the user policy permits iam:PassRole on Resource: "*" alongside lambda:CreateFunction, and invokes aws lambda create-function (binding the existing over-privileged role arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole to a 10-line Python handler named metrics-health-sync-tmp).',
        howItWorksInPractice:
          'Why does AWS require iam:PassRole? Because compute services like Lambda, EC2, ECS, and Glue execute code using the IAM Role attached to them; if iam:PassRole is granted with a wildcard ("*"), any user who can create a compute resource can impersonate any role trusted by that service. In the documented CLOUDTRAIL CreateFunction exchange from Compromised Dev IAM User to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP HTTP 201 Created (confirming that the LAMBDA_CREATE_WITH_PASSROLE request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 LAMBDA INVOCATION & ADMINISTRATORACCESS POLICY ATTACHMENT).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (ci-dev-deployer) to Node ②/③ (AWS IAM & Lambda Control Plane), and return arrow ⇠#1 confirming CreateFunction20150331 with LambdaAdminDeploymentRole.',
        detectionAndEvidence:
          'Documented by Rhino Security Labs & Datadog: CloudTrail CreateFunction20150331 event where requestParameters.role references an administrative or deployment IAM role.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.003',
        plainTitle: 'Invoking the Lambda Function to Attach AdministratorAccess via boto3 (T1098.003)',
        storyAnalogy:
          'The clerk presses the robot’s "Run" button (aws lambda invoke). Running with the admin role’s authority, the Python script calls iam.attach_user_policy to promote ci-dev-deployer to full AdministratorAccess.',
        simpleExplanation:
          'The attacker triggers the function via aws lambda invoke --function-name metrics-health-sync-tmp. Inside the AWS Lambda Firecracker microVM, the Python runtime automatically receives temporary STS credentials for LambdaAdminDeploymentRole in its environment variables and executes boto3.client("iam").attach_user_policy(UserName="ci-dev-deployer", PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess") (permanently elevating the attacker’s IAM user to full AWS account administrator).',
        howItWorksInPractice:
          'In CloudTrail, the AttachUserPolicy call appears as originating from AssumedRole/LambdaAdminDeploymentRole/metrics-health-sync-tmp rather than directly from the ci-dev-deployer IAM user. In the documented CLOUDTRAIL AttachUserPolicy exchange from Perimeter Firewall & NDR Tap to AWS IAM & Lambda Control Plane, AWS IAM & Lambda Control Plane responds with ALERT GuardDuty High (confirming that the ADMIN_POLICY_ATTACHED request succeeded on AWS IAM & Lambda Control Plane and establishing the runtime state required for Step #3 CLOUDTRAIL STOPLOGGING DEFENSE EVASION).',
        diagramAlignment:
          'On the diagram, arrow #2→ executes the Python handler inside Node ④ (Lambda Runtime) against Node ⑤ (AWS IAM Service), and ⇠#2 attaches AdministratorAccess.',
        detectionAndEvidence:
          'Documented by AWS GuardDuty: PrivilegeEscalation:IAMUser/AdministrativePermissions and CloudTrail AttachUserPolicy with policyArn ending in :policy/AdministratorAccess called by a Lambda execution role.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.008',
        plainTitle: 'Disabling AWS CloudTrail Auditing via cloudtrail:StopLogging (T1562.008)',
        storyAnalogy:
          'Right after promoting the clerk, the robot reaches up and switches off the building’s security camera recorder (cloudtrail:StopLogging), though the camera records the exact hand that flipped the switch!',
        simpleExplanation:
          'To conceal follow-on data theft or resource creation, the Lambda payload (or the newly elevated ci-dev-deployer user) calls boto3.client("cloudtrail").stop_logging(Name="org-audit-trail") (halting CloudTrail management and data event delivery for the regional trail, an action that records one final StopLogging event in CloudTrail and triggers GuardDuty’s Stealth:IAMUser/CloudTrailLoggingDisabled alert).',
        howItWorksInPractice:
          'Organizations prevent even full account administrators from blinding audit logs by configuring an AWS Organizations Trail in a separate management account and applying a Service Control Policy (SCP) that explicitly denies cloudtrail:StopLogging and cloudtrail:DeleteTrail. In the documented CLOUDTRAIL StopLogging exchange from AWS IAM & Lambda Control Plane to Lambda Execution MicroVM (Firecracker), Lambda Execution MicroVM (Firecracker) responds with ALERT TRAIL_STOPPED (confirming that the CLOUDTRAIL_LOGGING_DISABLED request succeeded on Lambda Execution MicroVM (Firecracker) and completing the final execution objective of Rhino Security Labs, Datadog & AWS, IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail StopLogging).',
        diagramAlignment:
          'On the diagram, arrow #3→ sends StopLogging to Node ⑤ (AWS CloudTrail Service) while Node ⑥ (Datadog Cloud SIEM & GuardDuty) fires a critical alert.',
        detectionAndEvidence:
          'Documented by MITRE T1562.008 & AWS GuardDuty: CloudTrail eventName == "StopLogging" or DeleteTrail and GuardDuty finding Stealth:IAMUser/CloudTrailLoggingDisabled.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office where a junior clerk is forbidden from unlocking the executive safe directly, yet holds two seemingly harmless permissions: hiring a temporary robot worker and handing that robot any spare manager badge off the wall. The junior clerk hires a one-line robot worker, hangs a senior manager badge around the robot neck, tells the robot to promote the junior clerk straight to Chief Administrator, and then switches off the hallway security cameras.',
      storyMappings: [
        {
          storyTerm: 'Hiring a robot worker and hanging a senior manager badge on it',
          technicalTerm: 'Chaining iam:PassRole with lambda:CreateFunction20150331 using an admin role',
          tone: 'amber',
        },
        {
          storyTerm: 'Telling the robot to promote the junior clerk to Chief Administrator',
          technicalTerm: 'Invoking Lambda boto3 code to call iam:AttachUserPolicy (AdministratorAccess)',
          tone: 'sky',
        },
        {
          storyTerm: 'Switching off the hallway security cameras',
          technicalTerm: 'Executing cloudtrail:StopLogging or DeleteTrail to blind cloud auditing (T1562.008)',
          tone: 'rose',
        },
        {
          storyTerm: 'Two seemingly harmless permissions creating a master key',
          technicalTerm: 'Classic AWS IAM privilege escalation path via PassRole + Lambda execution',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Noticing they hold both permission to deploy a tiny automated worker and permission to assign an existing senior role badge to that worker, the low-privileged user creates a fresh cloud script and hangs a powerful administrative role right around its neck.',
        storyMappings: [
          {
            storyTerm: 'Tiny automated worker deployed on demand',
            technicalTerm: 'Newly created AWS Lambda function via lambda:CreateFunction20150331',
            tone: 'amber',
          },
          {
            storyTerm: 'Hanging a powerful administrative role around its neck',
            technicalTerm: 'iam:PassRole assigning an administrative or deployment IAM role to the Lambda',
            tone: 'sky',
          },
          {
            storyTerm: 'Junior clerk acting indirectly',
            technicalTerm: 'Low-privileged IAM user lacking direct iam:AttachUserPolicy rights',
            tone: 'rose',
          },
          {
            storyTerm: 'Cloud ledger recording the role handoff',
            technicalTerm: 'AWS CloudTrail CreateFunction20150331 logging requestParameters.role',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on AWS CloudTrail CreateFunction20150331 events (immutable API logs capturing serverless deployments) whenever requestParameters.role assigns a high-privilege administrative or deployment IAM role passed by a non-CI user identity (catching PassRole escalation setup).',
      },
      2: {
        storyAnalogy:
          'Pressing the start button on the newly created robot worker, the clerk watches the robot use its borrowed manager badge to walk straight into the identity room and pin a permanent Chief Administrator ribbon onto the clerk own account.',
        storyMappings: [
          {
            storyTerm: 'Pressing the start button on the robot worker',
            technicalTerm: 'Calling lambda:InvokeFunction to run the embedded Python boto3 escalation script',
            tone: 'amber',
          },
          {
            storyTerm: 'Pinning a permanent Chief Administrator ribbon onto the clerk',
            technicalTerm: 'Lambda role calling iam:AttachUserPolicy with arn:aws:iam::aws:policy/AdministratorAccess',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated cloud watchdog sounding the alarm',
            technicalTerm: 'AWS GuardDuty finding PrivilegeEscalation:IAMUser/AdministrativePermissions',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent full-account control achieved',
            technicalTerm: 'Original low-privileged user now holding unrestricted AWS AdministratorAccess',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor AWS GuardDuty PrivilegeEscalation:IAMUser/AdministrativePermissions findings alongside CloudTrail AttachUserPolicy events (which track IAM permission grants) where policyArn ends in :policy/AdministratorAccess invoked by a Lambda execution role.',
      },
      3: {
        storyAnalogy:
          'Now wearing the freshly pinned Chief Administrator badge, the intruder rushes straight to the cloud security booth and flips the master recording switch to off so future vault raids vanish from the central diary.',
        storyMappings: [
          {
            storyTerm: 'Cloud security booth master recording switch',
            technicalTerm: 'AWS CloudTrail audit trail recording account-wide API calls',
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping the recording switch to off',
            technicalTerm: 'Calling cloudtrail:StopLogging or cloudtrail:DeleteTrail (MITRE T1562.008)',
            tone: 'sky',
          },
          {
            storyTerm: 'Dedicated stealth alarm catching the blackout',
            technicalTerm: 'AWS GuardDuty Stealth:IAMUser/CloudTrailLoggingDisabled alert',
            tone: 'rose',
          },
          {
            storyTerm: 'Preventing anyone from touching the switch',
            technicalTerm: 'AWS Organizations Service Control Policy (SCP) denying StopLogging account-wide',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure real-time CloudWatch EventBridge alarms and AWS GuardDuty Stealth:IAMUser/CloudTrailLoggingDisabled alerts on any CloudTrail eventName matching StopLogging or DeleteTrail (which indicate deliberate anti-forensic blinding of cloud audit logs).',
      },
    },
  };
