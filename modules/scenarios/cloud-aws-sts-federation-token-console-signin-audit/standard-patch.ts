import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud bank where a thief steals a long-lived machine delivery badge designed only for automated back-door shipping, not for walking through the executive web lobby. Using a special exchange counter, the thief trades that machine badge for a federated visitor pass, exchanges the pass at the lobby ticket booth for a live browser wristband, and strolls straight into the graphical management console to read every security policy on screen.',
      storyMappings: [
        {
          storyTerm: 'Trading a back-door machine badge at the exchange counter',
          technicalTerm: 'Programmatic AKIA access key invoking sts:GetFederationToken',
          tone: 'amber',
        },
        {
          storyTerm: 'Exchanging the federated pass for a live browser wristband',
          technicalTerm: 'signin.aws.amazon.com/federation SigninToken exchange triggering ConsoleLogin',
          tone: 'sky',
        },
        {
          storyTerm: 'Strolling into the graphical console to read security policies',
          technicalTerm: 'Interactive AWS Management Console reconnaissance and IAM PolicyVersion enumeration',
          tone: 'rose',
        },
        {
          storyTerm: 'Audit discrepancy exposing back-door-to-lobby pivot',
          technicalTerm: 'CloudTrail GetFederationToken immediately followed by ConsoleLogin without MFA',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding a leaked static programmer key meant solely for automated scripts, the intruder calls the cloud token-exchange counter asking for a federated session pass that can bridge into interactive web access.',
        storyMappings: [
          {
            storyTerm: 'Leaked static programmer key',
            technicalTerm: 'Compromised long-lived AWS IAM access key (AKIA...) without console password',
            tone: 'amber',
          },
          {
            storyTerm: 'Cloud token-exchange counter',
            technicalTerm: 'AWS Security Token Service API call sts:GetFederationToken',
            tone: 'sky',
          },
          {
            storyTerm: 'Federated session pass returned',
            technicalTerm: 'Temporary ASIA... federated credentials scoped by inline session policy',
            tone: 'rose',
          },
          {
            storyTerm: 'Ledger entry marking the unusual conversion',
            technicalTerm: 'CloudTrail GetFederationToken event initiated by a programmatic IAM user',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Handing that temporary federated pass straight to the web lobby ticket booth, the intruder receives a single-use browser entry link and logs smoothly into the interactive graphical console without ever needing a user password or MFA token.',
        storyMappings: [
          {
            storyTerm: 'Web lobby ticket booth',
            technicalTerm: 'https://signin.aws.amazon.com/federation?Action=getSigninToken endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Single-use browser entry link',
            technicalTerm: 'Returned SigninToken pasted into Action=login URL launching the AWS Console',
            tone: 'sky',
          },
          {
            storyTerm: 'Entering the graphical lobby without password or MFA',
            technicalTerm: 'Bypassing console password requirements and user MFA checks via federation',
            tone: 'rose',
          },
          {
            storyTerm: 'Lobby camera recording the browser check-in',
            technicalTerm: 'CloudTrail ConsoleLogin event showing userIdentity.type == "FederatedUser"',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now clicking freely through the visual web dashboards, the intruder inspects account blueprints and digs through older saved editions of company security policies hunting for over-privileged rules or hidden secrets.',
        storyMappings: [
          {
            storyTerm: 'Clicking freely through visual web dashboards',
            technicalTerm: 'Interactive AWS Management Console reconnaissance across IAM, S3, and Secrets Manager',
            tone: 'amber',
          },
          {
            storyTerm: 'Digging through older editions of security policies',
            technicalTerm: 'Calling iam:ListPolicyVersions and iam:GetPolicyVersion hunting privilege escalation paths',
            tone: 'sky',
          },
          {
            storyTerm: 'Tracing every click back to the leaked machine key',
            technicalTerm: 'Correlating CloudTrail FederatedUser ARN back to the originating AKIA AccessKeyId',
            tone: 'rose',
          },
          {
            storyTerm: 'Shutting down both key and active browser session',
            technicalTerm: 'Deactivating the compromised AKIA key and attaching an explicit Deny revocation policy',
            tone: 'emerald',
          },
        ],
      },
    },
  };
