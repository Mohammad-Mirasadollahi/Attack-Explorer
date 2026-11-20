import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'aws-cognito-iam-passrole-privesc',
    briefing: {
      headline: 'Scenario Briefing: AWS IAM iam:PassRole + lambda:CreateFunction Privilege Escalation & CloudTrail StopLogging',
      storyAnalogy:
        'Imagine a junior clerk (ci-dev-deployer) at a bank who is forbidden from opening the main vault (no iam:AttachUserPolicy permission). However, the clerk has two seemingly harmless permissions: they are allowed to build small automated mail-sorting robots (lambda:CreateFunction), and they are allowed to clip any existing employee badge onto a robot (iam:PassRole). The clerk spots the Bank President’s spare badge (LambdaAdminDeploymentRole) hanging on the wall, clips that badge onto a brand-new 5-line Python robot (metrics-health-sync-tmp), and presses the robot’s "Start" button (lambda:InvokeFunction). Wearing the President’s badge, the robot walks over to HR, promotes the junior clerk to Bank President (AdministratorAccess), and unplugs the security cameras (cloudtrail:StopLogging)!',
      plainSummary:
        'Grounded in Rhino Security Labs’ canonical AWS IAM Privilege Escalation research, Datadog Security Labs, and MITRE ATT&CK (T1098.001 / T1562.008), this scenario models one of the most common privilege escalation paths in AWS cloud environments. A compromised developer IAM user (ci-dev-deployer) lacking administrative rights abuses the intersection of iam:PassRole, lambda:CreateFunction, and lambda:InvokeFunction to create a Python Lambda function bound to a privileged service role (LambdaAdminDeploymentRole). When invoked, the Lambda function executes boto3 calls under the privileged role to attach arn:aws:iam::aws:policy/AdministratorAccess to the attacker’s IAM user and disable CloudTrail logging via cloudtrail:StopLogging.',
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
