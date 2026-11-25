import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics',
    title: 'AWS CIRT & Unit 42 DFIR — AWS CloudTrail IMDSv1 Role Theft, Off-Instance Replay & S3 Data Events Forensics',
    category: 'CLOUD_SAAS',
    mitreId: 'T1552.005',
    description:
      'Grounded in the AWS Security Incident Response Guide (AWS CIRT), Palo Alto Networks Unit 42 Cloud Threat Reports, and MITRE ATT&CK T1552.005: an attacker exploits an SSRF vulnerability on an EC2 web application to query the Instance Metadata Service (http://169.254.169.254/latest/meta-data/iam/security-credentials/) and exfiltrates the temporary ASIA... STS session token, replaying it from an external ASN IP—detectable in AWS CloudTrail via userIdentity.arn AssumedRole usage from a non-EC2 sourceIPAddress and GuardDuty InstanceCredentialExfiltration.OutsideAWS.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Host (198.51.100.55)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'EC2 Web App & IMDS 169.254', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'STS AssumedRole (ASIA...)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AWS CloudTrail & GuardDuty', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'S3 Bucket (GetObject Data Log)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: EC2 Instance Metadata Service (IMDSv1) SSRF Query & STS Token Retrieval',
        narration:
          'The attacker sends an HTTP request to a vulnerable web proxy on EC2 instance i-0a1b2c3d4e5f60001 pointing to http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole. Because IMDSv1 does not require a PUT session token with a TTL hop limit of 1, the metadata endpoint returns the temporary AccessKeyId (ASIA...), SecretAccessKey, and Token.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1552.005 - Unsecured Credentials: Cloud Instance Metadata API)',
        technicalCommands: [
          'HTTP SSRF Target: http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole',
          'Returned JSON Fields: AccessKeyId="ASIAIOSFODNN7EXAMPLE", SecretAccessKey, Token, Expiration',
        ],
        defenseMitigation:
          'Enforce IMDSv2 across all EC2 instances via aws ec2 modify-instance-metadata-options --http-tokens required --http-put-response-hop-limit 1.',
        logs: [
          {
            id: 'dfir-aws-imds-1',
            timestamp: '14:10:02.115',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'nginx',
            CommandLine: 'GET http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole',
            raw: 'nginx_proxy_log: client=198.51.100.55 request="GET /proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole HTTP/1.1" status=200 bytes=1420',
            parsedFields: {
              MetadataEndpoint: '169.254.169.254/latest/meta-data/iam/security-credentials/',
              IamRoleName: 'ProdAppInstanceRole',
              IssuedAccessKeyPrefix: 'ASIA... (Temporary STS Credential)',
              ImdsVersion: 'IMDSv1 (No X-aws-ec2-metadata-token header)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Off-Instance STS GetCallerIdentity Replay & GuardDuty OutsideAWS Detection (CloudTrail)',
        narration:
          'From their external workstation (198.51.100.55, aws-cli/2.15.0 Python/3.11 Linux), the attacker invokes sts:GetCallerIdentity and s3:ListBuckets using the stolen ASIA... EC2 role credentials. AWS CloudTrail logs userIdentity.principalId="<RoleId>:i-0a1b2c3d4e5f60001" alongside sourceIPAddress="198.51.100.55" (an external IP not belonging to the EC2 instance elastic IP), triggering Amazon GuardDuty finding UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS.',
        activeNodes: ['attacker', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1550.001 - Use Alternate Authentication Material: Application Access Token)',
        technicalCommands: [
          'CloudTrail Event: eventSource="sts.amazonaws.com" eventName="GetCallerIdentity"',
          'userIdentity.arn: "arn:aws:sts::123456789012:assumed-role/ProdAppInstanceRole/i-0a1b2c3d4e5f60001"',
          'sourceIPAddress: "198.51.100.55" (Mismatch against EC2 public IP) -> GuardDuty OutsideAWS Alert',
        ],
        defenseMitigation:
          'Attach an IAM VPC Endpoint / SourceIP condition policy (aws:SourceVpc or ec2:SourceInstanceARN) to EC2 instance profiles so stolen STS tokens cannot be used outside the VPC.',
        logs: [
          {
            id: 'dfir-aws-imds-2',
            timestamp: '14:10:08.450',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail sts:GetCallerIdentity from 198.51.100.55 using i-0a1b2c3d4e5f60001 role',
            raw: '{"eventVersion":"1.09","userIdentity":{"type":"AssumedRole","principalId":"AROA123456789:i-0a1b2c3d4e5f60001","arn":"arn:aws:sts::123456789012:assumed-role/ProdAppInstanceRole/i-0a1b2c3d4e5f60001","accessKeyId":"ASIAIOSFODNN7EXAMPLE"},"eventSource":"sts.amazonaws.com","eventName":"GetCallerIdentity","sourceIPAddress":"198.51.100.55","userAgent":"aws-cli/2.15.0 Python/3.11.6 Linux"}',
            parsedFields: {
              CloudTrailEvent: 'sts.amazonaws.com : GetCallerIdentity',
              PrincipalId: 'AROA123456789:i-0a1b2c3d4e5f60001',
              ExternalSourceIp: '198.51.100.55 (External ASN Mismatch)',
              GuardDutyFinding: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: S3 Data Event GetObject Burst & bytesTransferred Quantification in CloudTrail',
        narration:
          'The attacker enumerates and downloads sensitive objects from s3://corp-prod-customer-backups/. By querying AWS CloudTrail S3 Data Events (eventSource="s3.amazonaws.com", eventName="GetObject"), the DFIR team reconstructs every exact object key accessed and sums additionalEventData.bytesTransferredOut.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'CloudTrail S3 Data Event: eventSource="s3.amazonaws.com" eventName="GetObject"',
          'requestParameters.bucketName: "corp-prod-customer-backups" | requestParameters.key: "db-dump-2026-11.sql.gz"',
          'additionalEventData.bytesTransferredOut: 524288000',
        ],
        defenseMitigation:
          'Enable CloudTrail Data Events for S3 buckets holding sensitive data and immediately revoke active role sessions by attaching an inline AWSRevokeOlderSessions (DateLessThan aws:TokenIssueTime) policy.',
        logs: [
          {
            id: 'dfir-aws-imds-3',
            timestamp: '14:10:15.920',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws',
            CommandLine: 'CloudTrail s3:GetObject corp-prod-customer-backups/db-dump-2026-11.sql.gz',
            raw: '{"eventSource":"s3.amazonaws.com","eventName":"GetObject","sourceIPAddress":"198.51.100.55","requestParameters":{"bucketName":"corp-prod-customer-backups","key":"db-dump-2026-11.sql.gz"},"additionalEventData":{"bytesTransferredOut":524288000}}',
            parsedFields: {
              CloudTrailEvent: 's3.amazonaws.com : GetObject (Data Event)',
              BucketName: 'corp-prod-customer-backups',
              ExfiltratedObjectKey: 'db-dump-2026-11.sql.gz',
              BytesTransferredOut: '524,288,000 bytes (500 MB)',
            },
          },
        ],
      },
    ],
  };
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
