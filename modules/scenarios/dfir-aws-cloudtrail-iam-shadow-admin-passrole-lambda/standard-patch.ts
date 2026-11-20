import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud forensics case study of a shadow-administrator takeover: an ordinary developer who cannot grant themselves master keys uses a delegated robot builder to pass a powerful role to a custom script, commands that script to attach full Administrator ribbons onto their own badge, and then tries to unplug the central security recorder, leaving three unmistakable sequential entries in the tamper-proof cloud ledger.',
      storyMappings: [
        {
          storyTerm: 'Passing a powerful role to a custom script robot',
          technicalTerm: 'iam:PassRole + lambda:CreateFunction20150331 privilege escalation in CloudTrail',
          tone: 'amber',
        },
        {
          storyTerm: 'Script attaching full Administrator ribbons onto the developer badge',
          technicalTerm: 'Lambda invocation executing iam:AttachUserPolicy (AdministratorAccess)',
          tone: 'sky',
        },
        {
          storyTerm: 'Trying to unplug the central security recorder',
          technicalTerm: 'cloudtrail:StopLogging / DeleteTrail anti-forensics logged right before silencing',
          tone: 'rose',
        },
        {
          storyTerm: 'Shadow-administrator loophole closed proactively',
          technicalTerm: 'IAM Permission Boundaries and least-privilege iam:PassRole resource scoping',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a hidden shadow-admin permission pair, the developer registers a brand-new serverless helper function and assigns it a broad administrative execution role that the developer themselves could not directly assume.',
        storyMappings: [
          {
            storyTerm: 'Hidden shadow-admin permission pair',
            technicalTerm: 'Combined iam:PassRole and lambda:CreateFunction permissions on a non-admin user',
            tone: 'amber',
          },
          {
            storyTerm: 'Registering a brand-new serverless helper function',
            technicalTerm: 'CloudTrail event lambda:CreateFunction20150331 with embedded escalation payload',
            tone: 'sky',
          },
          {
            storyTerm: 'Broad administrative execution role assigned',
            technicalTerm: 'Privileged IAM execution role passed via requestParameters.role',
            tone: 'rose',
          },
          {
            storyTerm: 'Audit trail recording both actor and target role',
            technicalTerm: 'CloudTrail userIdentity linked directly to the newly created Lambda ARN',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Triggering the newly built helper function immediately, the developer watches the function step into the IAM control room under its privileged role and attach the full Administrator policy straight back onto the developer own identity.',
        storyMappings: [
          {
            storyTerm: 'Triggering the helper function immediately',
            technicalTerm: 'lambda:InvokeFunction running the attacker escalation routine',
            tone: 'amber',
          },
          {
            storyTerm: 'Attaching full Administrator policy back onto the developer',
            technicalTerm: 'CloudTrail iam:AttachUserPolicy granting AdministratorAccess from the Lambda role',
            tone: 'sky',
          },
          {
            storyTerm: 'Circular privilege promotion exposed',
            technicalTerm: 'Correlating Lambda creator ARN with the target userName receiving AdministratorAccess',
            tone: 'rose',
          },
          {
            storyTerm: 'Guardrail that stops self-promotion',
            technicalTerm: 'IAM Permission Boundaries capping maximum effective permissions of passed roles',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Moments after receiving full Administrator keys, the intruder attempts to turn off or erase the central cloud activity trail, ironically stamping the loudest possible red flare right onto the final recorded page.',
        storyMappings: [
          {
            storyTerm: 'Attempting to turn off or erase the activity trail',
            technicalTerm: 'cloudtrail:StopLogging or cloudtrail:DeleteTrail API invocation',
            tone: 'amber',
          },
          {
            storyTerm: 'Loudest red flare stamped on the final recorded page',
            technicalTerm: 'CloudTrail logging the StopLogging event itself before halting delivery',
            tone: 'sky',
          },
          {
            storyTerm: 'Backup security ledger preserved outside the account',
            technicalTerm: 'AWS Organizations immutable organization trail streaming to a separate Security account',
            tone: 'rose',
          },
          {
            storyTerm: 'Automated incident containment',
            technicalTerm: 'EventBridge rule alerting SOC and quarantining the compromised IAM principal',
            tone: 'emerald',
          },
        ],
      },
    },
  };
