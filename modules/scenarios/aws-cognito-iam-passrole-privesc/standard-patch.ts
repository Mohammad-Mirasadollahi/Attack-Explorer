import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
