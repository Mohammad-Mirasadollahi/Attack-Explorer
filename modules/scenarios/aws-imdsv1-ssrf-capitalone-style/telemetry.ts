import type { TelemetryEvent } from '../types';

export const IMDS_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'imds-log-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.218',
    sourceNodeId: 'attacker',
    targetNodeId: 'ec2-proxy',
    sourceLabel: 'External Attacker (198.51.100.88)',
    targetLabel: 'ec2-waf-edge-01 (nginx PID 2418)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'PROXY-4001 (HTTP Host SSRF)',
    shortAction: 'HOST HEADER SSRF',
    info: 'Misconfigured reverse proxy ec2-waf-edge-01 forwards crafted Host: 169.254.169.254 GET request to link-local IMDSv1 and returns role name ISRM-WAF-Role',
    sizeOrCode: '200 OK · 13B',
    severity: 'HIGH',
    mitreId: 'T1190',
    explanation:
      'An unsafe proxy_pass directive dynamically interpolates the attacker-controlled Host header, causing nginx worker PID 2418 on ec2-waf-edge-01 to query the host-only AWS link-local metadata address 169.254.169.254 and leak the attached IAM role name.',
    rawLog: `198.51.100.88 - - [14/May/2025:09:12:04 +0000] "GET /latest/meta-data/iam/security-credentials/ HTTP/1.1" 200 13 "-" "curl/8.4.0" host="169.254.169.254" upstream_addr="169.254.169.254:80" request_time=0.004`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Reverse Proxy SSRF Upstream Pivot to Cloud IMDS (169.254.169.254)',
      ruleCode: `title: Reverse Proxy SSRF to Link-Local Cloud Metadata Service
status: stable
logsource:
  category: proxy
detection:
  selection:
    upstream_addr|startswith: '169.254.169.254'
    cs-uri-stem|contains: '/latest/meta-data/'
  condition: selection
level: critical`,
      mitigation:
        'Enforce strict allowlists on reverse-proxy upstream Host resolution, block 169.254.169.254 in proxy egress rules, and require IMDSv2 across all EC2 launch templates.',
    },
  },
  {
    id: 'imds-log-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:07.602',
    sourceNodeId: 'ec2-proxy',
    targetNodeId: 'imds-endpoint',
    sourceLabel: 'ec2-waf-edge-01 (nginx PID 2418)',
    targetLabel: 'IMDSv1 (169.254.169.254:80)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'PROXY-4002 (IMDSv1 GET)',
    shortAction: 'IMDSV1 STS HARVEST',
    info: 'Unauthenticated IMDSv1 GET returns 1,342-byte JSON containing temporary STS credentials (ASIA5LABEXAMPLE9Q2W) for over-privileged ISRM-WAF-Role',
    sizeOrCode: '1,342 Bytes',
    severity: 'CRITICAL',
    mitreId: 'T1552.005',
    explanation:
      'Because IMDSv1 requires no prior PUT session token, the second proxied HTTP GET returns live temporary AWS STS credentials straight to the external caller while generating zero AWS CloudTrail API events.',
    rawLog: `198.51.100.88 - - [14/May/2025:09:12:11 +0000] "GET /latest/meta-data/iam/security-credentials/ISRM-WAF-Role HTTP/1.1" 200 1342 "-" "curl/8.4.0" upstream_addr="169.254.169.254:80" response_fields="Code=Success,AccessKeyId=ASIA5LABEXAMPLE9Q2W,Expiration=2025-05-14T15:12:11Z"`,
    detectionRule: {
      type: 'KQL',
      title: 'IMDSv1 Unauthenticated IAM Security Credentials Retrieval via Proxy',
      ruleCode: `WebProxyLogs
| where UpstreamIp == "169.254.169.254"
| where RequestUri has "/latest/meta-data/iam/security-credentials/"
| where HttpMethod == "GET" and StatusCode == 200
| project TimeGenerated, SrcIp, HostHeader, RequestUri, ResponseBytes`,
      mitigation:
        'Set HttpTokens=required (IMDSv2) on every EC2 instance so simple GET SSRF requests return HTTP 401 Unauthorized without a prior PUT session token.',
    },
  },
  {
    id: 'imds-log-3',
    no: 3,
    stageIndex: 3,
    timestamp: '02:45.094',
    sourceNodeId: 'sts-role',
    targetNodeId: 's3-vault',
    sourceLabel: 'ISRM-WAF-Role (198.51.100.88)',
    targetLabel: 'Amazon S3 (corp-credit-applications-prod)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'CloudTrail S3 Data Event',
    shortAction: 'OFF-VPC S3 SYNC',
    info: 'Stolen EC2 instance-profile STS token executes ListBuckets and bulk GetObject from external non-AWS IP 198.51.100.88 against corp-credit-applications-prod',
    sizeOrCode: '200 OK · Sync',
    severity: 'CRITICAL',
    mitreId: 'T1530',
    explanation:
      'Importing the temporary STS credentials into an external CLI bypasses the WAF proxy completely; CloudTrail records the EC2 instance ARN accessing sensitive S3 objects from a public IP lacking any corporate VPC endpoint.',
    rawLog: `{"eventTime":"2025-05-14T09:14:49Z","eventSource":"s3.amazonaws.com","eventName":"GetObject","awsRegion":"us-east-1","sourceIPAddress":"198.51.100.88","userIdentity":{"type":"AssumedRole","principalId":"AROA5LABEXAMPLE:i-0a9f21c84d7e301b2","arn":"arn:aws:sts::111122223333:assumed-role/ISRM-WAF-Role/i-0a9f21c84d7e301b2","accessKeyId":"ASIA5LABEXAMPLE9Q2W"},"requestParameters":{"bucketName":"corp-credit-applications-prod","key":"archive/2025-q1-applicants.parquet"}}`,
    detectionRule: {
      type: 'SIGMA',
      title: 'CloudTrail EC2 Instance Role STS Token Replayed Outside AWS VPC',
      ruleCode: `title: EC2 AssumedRole Temporary Credentials Used From External IP
status: stable
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    userIdentity.type: 'AssumedRole'
    userIdentity.arn|contains: ':assumed-role/'
    eventSource: 's3.amazonaws.com'
    eventName:
      - 'ListBuckets'
      - 'ListObjectsV2'
      - 'GetObject'
  filter_vpc:
    vpcEndpointId|exists: true
  condition: selection and not filter_vpc
level: critical`,
      mitigation:
        'Attach least-privilege IAM policies to EC2 roles and enforce aws:SourceVpce bucket-policy conditions on sensitive S3 buckets.',
    },
  },
  {
    id: 'imds-log-4',
    no: 4,
    stageIndex: 4,
    timestamp: '03:02.411',
    sourceNodeId: 's3-vault',
    targetNodeId: 'siem-guardduty',
    sourceLabel: 'AWS GuardDuty & EC2 Control Plane',
    targetLabel: 'CloudTrail & GuardDuty SOC',
    sourceType: 'IDS_ALERT',
    protocolOrEventId: 'GuardDuty OutsideAWS + IMDSv2',
    shortAction: 'REVOKE & IMDSV2 LOCK',
    info: 'GuardDuty fires InstanceCredentialExfiltration.OutsideAWS; defenders revoke active sessions and enforce IMDSv2 HttpTokens=required + HopLimit=1',
    sizeOrCode: '401 Denied',
    severity: 'CRITICAL',
    mitreId: 'T1552.005',
    explanation:
      'AWS GuardDuty flags the off-AWS replay of an EC2 instance credential within seconds; responders attach an inline session-revocation deny policy and lock ec2-waf-edge-01 to IMDSv2 with HopLimit=1.',
    rawLog: `{"findingType":"UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS","severity":8.0,"instanceId":"i-0a9f21c84d7e301b2","remoteIp":"198.51.100.88","remediation":"ModifyInstanceMetadataOptions(HttpTokens=required,HttpPutResponseHopLimit=1) -> HTTP 401 on subsequent GET"}`,
    detectionRule: {
      type: 'KQL',
      title: 'GuardDuty EC2 Instance Credential Exfiltration Outside AWS + IMDSv2 Audit',
      ruleCode: `AWSGuardDuty
| where ActivityType == "UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS"
| project TimeGenerated, ResourceInstanceId, RemoteIp, PrincipalArn, Severity`,
      mitigation:
        'Automate EventBridge revocation of active IAM role sessions on OutsideAWS findings and enforce IMDSv2 organization-wide via AWS SCP.',
    },
  },
];
