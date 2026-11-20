import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a forensic reconstruction of a cloud storage heist from three matching security ledgers: first, catching the tricked web server handing an unguarded temporary building pass out its side window; second, spotting that exact pass suddenly authenticating from a distant street outside the cloud campus; and third, tallying the exact weight of every archive box hauled out of the warehouse to quantify breach scope.',
      storyMappings: [
        {
          storyTerm: 'Tricked server handing a temporary pass out its side window',
          technicalTerm: 'EC2 IMDSv1 SSRF request retrieving temporary STS role credentials',
          tone: 'amber',
        },
        {
          storyTerm: 'Same pass authenticating from a distant street outside campus',
          technicalTerm: 'Off-instance sts:GetCallerIdentity replay triggering GuardDuty OutsideAWS alert',
          tone: 'sky',
        },
        {
          storyTerm: 'Tallying the exact weight of every hauled-out archive box',
          technicalTerm: 'CloudTrail S3 Data Event GetObject burst and bytesTransferredOut quantification',
          tone: 'rose',
        },
        {
          storyTerm: 'Three matching security ledgers proving end-to-end attribution',
          technicalTerm: 'Correlating proxy logs, GuardDuty findings, and CloudTrail S3 Data Events',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Abusing a vulnerable web proxy endpoint, the intruder persuades a cloud server to fetch its own local identity drawer over the older unauthenticated channel and hand back its temporary role pass.',
        storyMappings: [
          {
            storyTerm: 'Older unauthenticated local identity drawer',
            technicalTerm: 'EC2 Instance Metadata Service v1 (IMDSv1) at 169.254.169.254',
            tone: 'amber',
          },
          {
            storyTerm: 'Persuading the web proxy to fetch internal pages',
            technicalTerm: 'Server-Side Request Forgery (SSRF) returning IAM role STS credentials',
            tone: 'sky',
          },
          {
            storyTerm: 'Temporary role pass leaked',
            technicalTerm: 'Short-lived AccessKeyId (ASIA...), SecretAccessKey, and SessionToken',
            tone: 'rose',
          },
          {
            storyTerm: 'Counter tracking tokenless drawer opens',
            technicalTerm: 'CloudWatch MetadataNoToken metric confirming IMDSv1 usage',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Moments later, the intruder tests the stolen keycard from an outside internet connection to check who they have become, immediately tripping the cloud campus perimeter sensor that knows an internal server badge should never be swiped from outside.',
        storyMappings: [
          {
            storyTerm: 'Testing the keycard to verify identity',
            technicalTerm: 'aws sts get-caller-identity invoked off-instance using stolen EC2 role keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Perimeter sensor catching an outside swipe',
            technicalTerm: 'AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
            tone: 'sky',
          },
          {
            storyTerm: 'Exact server identity named in the alarm',
            technicalTerm: 'CloudTrail principalId mapping the stolen token directly to the compromised EC2 instance ID',
            tone: 'rose',
          },
          {
            storyTerm: 'Foreign street address logged',
            technicalTerm: 'External non-AWS sourceIPAddress recorded on the AssumedRole API call',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With the stolen badge confirmed live, the intruder sweeps through sensitive storage buckets downloading object after object, while investigators tally every single GetObject receipt and byte count to prove exact regulatory impact.',
        storyMappings: [
          {
            storyTerm: 'Sweeping through sensitive storage buckets',
            technicalTerm: 'High-velocity s3:GetObject burst executed via the stolen EC2 AssumedRole',
            tone: 'amber',
          },
          {
            storyTerm: 'Tallying every receipt and exact box weight',
            technicalTerm: 'CloudTrail S3 Data Events quantifying object keys and bytesTransferredOut',
            tone: 'sky',
          },
          {
            storyTerm: 'Proving exact regulatory breach scope',
            technicalTerm: 'Forensic Athena/CloudTrail query enumerating every exfiltrated S3 object',
            tone: 'rose',
          },
          {
            storyTerm: 'Revoking active sessions immediately',
            technicalTerm: 'Attaching a date-scoped Deny inline policy to invalidate active STS tokens',
            tone: 'emerald',
          },
        ],
      },
    },
  };
