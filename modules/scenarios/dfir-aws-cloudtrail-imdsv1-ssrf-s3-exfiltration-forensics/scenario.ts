import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
