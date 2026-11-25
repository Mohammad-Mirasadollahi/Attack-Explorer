import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'aws-imdsv1-ssrf-capitalone-style',
  code: 'T1552.005',
  name: 'AWS Security, Unit 42 & MITRE — EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3 Exfiltration',
  shortSubtitle: 'AWS Security · Unit 42 · MITRE T1552.005 · 169.254.169.254 IMDSv1 · STS Temporary Credentials & aws s3 sync',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'Documented by AWS Security, Palo Alto Networks Unit 42, and MITRE ATT&CK (T1552.005), Server-Side Request Forgery (SSRF) against cloud workloads with Instance Metadata Service Version 1 (IMDSv1) enabled allows external attackers to query the link-local metadata endpoint (http://169.254.169.254/latest/meta-data/iam/security-credentials/). Because IMDSv1 responds to stateless HTTP GET requests without requiring a session token, the vulnerable EC2 reverse proxy returns the attached IAM Instance Profile’s temporary STS AccessKeyId, SecretAccessKey, and SessionToken—allowing the attacker to replay those credentials from outside AWS via aws s3 sync to exfiltrate private S3 buckets.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'AWS Security Blog (IMDSv2 Defense-in-Depth) · Unit 42 Cloud SSRF Research · MITRE ATT&CK T1552.005',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App SSRF) · T1552.005 (Cloud Instance Metadata API) · T1530 (Cloud Storage)',
    },
    {
      term: 'METADATA ENDPOINT',
      value: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/<RoleName>',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'AWS CloudTrail (ListBuckets / GetObject by AssumedRole from External IP) & GuardDuty InstanceCredentialExfiltration',
    },
  ],
  nodes: [
    {
      id: 'external_ssrf_attacker',
      label: 'External Cloud Adversary',
      sublabel: '198.51.100.88 (AWS CLI v2 Exfil Host)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Linux Host (aws-cli/2.15.0)',
        pidOrPort: 'HTTPS :443 (SSRF Probe & AWS S3 API)',
        privilege: 'Unauthenticated Web Client -> Stolen IAM Role',
        artifacts: [
          'GET /proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/',
          'AWS_ACCESS_KEY_ID=ASIA... AWS_SESSION_TOKEN=FwoGZXIvYXdzE...',
        ],
        description:
          'Attacker exploiting an unvalidated URL fetcher on an EC2 web proxy to extract temporary STS IAM credentials.',
      },
    },
    {
      id: 'ec2_waf_reverse_proxy',
      label: 'EC2 Web Proxy (IMDSv1 Enabled)',
      sublabel: '172.31.12.19 (i-0a84b92c11e3f0412)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Amazon Linux 2 EC2 Instance (HttpTokens=optional)',
        pidOrPort: 'PID 2208 (nginx / node-ssrf-proxy :8443)',
        privilege: 'IAM Instance Profile: WafProxyS3ReadRole',
        artifacts: [
          'MetadataOptions: HttpTokens="optional", HttpPutResponseHopLimit=2',
          'SSRF backend request to 169.254.169.254:80',
        ],
        description:
          'Public-facing EC2 workload running a URL preview/proxy endpoint with legacy IMDSv1 enabled.',
      },
    },
    {
      id: 'aws_imds_link_local',
      label: 'EC2 Instance Metadata Service',
      sublabel: '169.254.169.254:80 (IMDSv1 Link-Local)',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'AWS Nitro Hypervisor Link-Local Metadata Service',
        pidOrPort: 'HTTP :80 (/latest/meta-data/iam/security-credentials/)',
        privilege: 'Instance Role STS Token Generator',
        artifacts: [
          'AccessKeyId: ASIAIOSFODNN7EXAMPLE',
          'SecretAccessKey & Token (Valid for 6 hours)',
        ],
        description:
          'Returns temporary AWS STS credentials in plaintext JSON to any local HTTP GET request when IMDSv1 is active.',
      },
    },
    {
      id: 'aws_s3_production_buckets',
      label: 'AWS S3 Production Data Buckets',
      sublabel: 's3://corp-credit-applications-prod',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Amazon S3 Object Storage Service (us-east-1)',
        pidOrPort: 'HTTPS :443 (s3.us-east-1.amazonaws.com)',
        privilege: 'Accessible via WafProxyS3ReadRole (s3:List*, s3:Get*)',
        artifacts: [
          'aws s3 ls & aws s3 sync s3://corp-credit-applications-prod ./loot',
          'CloudTrail Data Event: GetObject on 14,200 parquet records',
        ],
        description:
          'Sensitive enterprise S3 bucket accessed from an external IP using the stolen EC2 instance role credentials.',
      },
    },
    {
      id: 'aws_guardduty_cloudtrail_siem',
      label: 'AWS GuardDuty & CloudTrail SIEM',
      sublabel: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'AWS GuardDuty & CloudTrail Lake Detection Plane',
        pidOrPort: 'GuardDuty Finding / CloudTrail Management & Data Logs',
        privilege: 'Cloud SOC & SCP Enforcement',
        artifacts: [
          'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
          'aws ec2 modify-instance-metadata-options --http-tokens required',
        ],
        description:
          'Detects EC2 instance profile credentials (`ASIA...`) being used from an IP address outside the AWS VPC.',
      },
    },
  ],
  processTree: [
    {
      pid: 2208,
      ppid: 1,
      name: 'node (SSRF Web Service)',
      commandLine: '/usr/bin/node /srv/proxy-app/server.js --port 8443',
      user: 'ec2-user',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['fetch("http://169.254.169.254/latest/meta-data/iam/security-credentials/WafProxyS3ReadRole")'],
      memoryBlocks: [
        {
          address: '0x00007F2B44100000',
          section: 'V8 Heap (SSRF Response Buffer)',
          permissions: 'RW-',
          size: '64 KB',
          status: 'injected',
          description: 'Buffered JSON response from 169.254.169.254 containing temporary STS AccessKeyId (ASIA...) and SessionToken.',
          hexPreview: '7B 22 43 6F 64 65 22 3A 22 53 75 63 63 65 73 73 ({"Code":"Success","AccessKeyId":"ASIA...)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SSRF INJECTION TO LINK-LOCAL IMDSV1 ROLE DISCOVERY',
      subtitle: 'Coercing EC2 reverse proxy into fetching http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      description:
        'The attacker passes http://169.254.169.254/latest/meta-data/iam/security-credentials/ into a vulnerable URL parameter on the EC2 web server. Because IMDSv1 accepts unauthenticated HTTP GET requests without an X-aws-ec2-metadata-token header, the server returns the attached IAM role name (WafProxyS3ReadRole).',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (SSRF)',
      activeNodeIds: ['external_ssrf_attacker', 'ec2_waf_reverse_proxy', 'aws_imds_link_local'],
      compromisedNodeIds: ['ec2_waf_reverse_proxy'],
      keySpecs: [
        { term: 'VULNERABILITY CLASS', value: 'CWE-918 Server-Side Request Forgery (SSRF) on EC2' },
        { term: 'METADATA URI', value: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/' },
        { term: 'IMDS CONFIGURATION', value: 'HttpTokens: optional (IMDSv1 Enabled)' },
      ],
    },
    {
      index: 2,
      title: 'EXTRACTION OF TEMPORARY AWS STS ROLE CREDENTIALS (ASIA...)',
      subtitle: 'Retrieving AccessKeyId, SecretAccessKey, and Token from the IMDSv1 JSON payload',
      description:
        'A second SSRF GET request to /latest/meta-data/iam/security-credentials/WafProxyS3ReadRole dumps the JSON credential bundle issued by AWS Security Token Service (STS), exposing the temporary AccessKeyId (prefixed ASIA), SecretAccessKey, and SessionToken.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.005',
      mitreTechniqueName: 'Unsecured Credentials: Cloud Instance Metadata API',
      activeNodeIds: ['external_ssrf_attacker', 'ec2_waf_reverse_proxy', 'aws_imds_link_local', 'aws_guardduty_cloudtrail_siem'],
      compromisedNodeIds: ['ec2_waf_reverse_proxy', 'aws_imds_link_local'],
      keySpecs: [
        { term: 'STS ACCESS KEY PREFIX', value: 'ASIA... (Temporary IAM Role Credentials)' },
        { term: 'CREDENTIAL FIELDS', value: 'AccessKeyId + SecretAccessKey + Token (SessionToken)' },
        { term: 'MITRE TECHNIQUE', value: 'T1552.005 (Cloud Instance Metadata API)' },
      ],
    },
    {
      index: 3,
      title: 'OFF-CLOUD CREDENTIAL REPLAY & S3 BUCKET SYNC EXFILTRATION',
      subtitle: 'Running aws s3 sync from external IP and triggering GuardDuty InstanceCredentialExfiltration',
      description:
        'The attacker exports the stolen ASIA credentials into their local AWS CLI environment and runs aws s3 ls and aws s3 sync s3://corp-credit-applications-prod. AWS CloudTrail records the EC2 AssumedRole being invoked from an external WAN IP (198.51.100.88), immediately firing GuardDuty’s InstanceCredentialExfiltration.OutsideAWS alert.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage',
      activeNodeIds: ['external_ssrf_attacker', 'aws_s3_production_buckets', 'aws_guardduty_cloudtrail_siem'],
      compromisedNodeIds: ['ec2_waf_reverse_proxy', 'aws_imds_link_local', 'aws_s3_production_buckets'],
      keySpecs: [
        { term: 'EXFIL COMMAND', value: 'aws s3 sync s3://corp-credit-applications-prod ./loot' },
        { term: 'GUARDDUTY FINDING', value: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS' },
        { term: 'ARCHITECTURAL FIX', value: 'Enforce IMDSv2 (HttpTokens=required, HopLimit=1) + VPC Endpoint Policy' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'aws-imds-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:02:18.104',
      sourceNodeId: 'external_ssrf_attacker',
      targetNodeId: 'ec2_waf_reverse_proxy',
      sourceLabel: 'External Attacker',
      targetLabel: 'EC2 Web Proxy',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP GET SSRF',
      shortAction: 'IMDSV1_ROLE_ENUM',
      info: 'GET /api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      sizeOrCode: 'HTTP 200 (WafProxyS3ReadRole)',
      severity: 'HIGH',
      mitreId: 'T1190',
      explanation: 'SSRF payload forces the EC2 web service to query the link-local IMDSv1 endpoint and return the IAM role name.',
      rawLog: `198.51.100.88 - - [14/Nov/2026:14:02:18 +0000] "GET /api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ HTTP/1.1" 200 18 "-" "curl/8.4.0"`,
      detectionRule: {
        type: 'SURICATA',
        title: 'HTTP Request Parameter Containing AWS/Cloud Link-Local Metadata IP 169.254.169.254',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CLOUD SSRF Attempt to AWS IMDS 169.254.169.254"; content:"169.254.169.254"; http_uri; sid:2028910; rev:2;)`,
        mitigation: 'Block 169.254.169.254 in application URL validators and enforce IMDSv2 (HttpTokens=required) via AWS Service Control Policy.',
      },
    },
    {
      id: 'aws-imds-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:02:19.442',
      sourceNodeId: 'ec2_waf_reverse_proxy',
      targetNodeId: 'aws_imds_link_local',
      sourceLabel: 'EC2 Web Proxy',
      targetLabel: 'IMDSv1 (169.254.169.254)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'IMDSv1 CREDENTIAL_LEAK',
      shortAction: 'STS_TOKEN_DUMPED',
      info: 'GET /latest/meta-data/iam/security-credentials/WafProxyS3ReadRole -> AccessKeyId=ASIAIOSFODNN7EXAMPLE',
      sizeOrCode: '1,340 Bytes JSON',
      severity: 'CRITICAL',
      mitreId: 'T1552.005',
      explanation: 'IMDSv1 returns the temporary STS credentials for WafProxyS3ReadRole without requiring a PUT session token.',
      rawLog: `{"Code":"Success","LastUpdated":"2026-11-14T13:55:00Z","Type":"AWS-HMAC","AccessKeyId":"ASIAIOSFODNN7EXAMPLE","SecretAccessKey":"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY","Token":"FwoGZXIvYXdzEJr//////////wEaD...","Expiration":"2026-11-14T20:00:00Z"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'EC2 Instance Metadata Service v1 (IMDSv1) Credential Access Without Token',
        ruleCode: `title: AWS EC2 IMDSv1 Usage Detected on Production Workload
logsource:
  product: aws
  service: cloudwatch_metrics
detection:
  selection:
    MetricName: 'MetadataNoToken'
    Value|gt: 0
  condition: selection`,
        mitigation: 'Monitor AWS CloudWatch MetadataNoToken metric and run: aws ec2 modify-instance-metadata-options --http-tokens required --http-put-response-hop-limit 1.',
      },
    },
    {
      id: 'aws-imds-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:04:02.918',
      sourceNodeId: 'external_ssrf_attacker',
      targetNodeId: 'aws_s3_production_buckets',
      sourceLabel: 'External Attacker (ASIA Key)',
      targetLabel: 'AWS S3 Prod Bucket',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL / GUARDDUTY',
      shortAction: 'S3_SYNC_OUTSIDE_AWS',
      info: 'AssumedRole=WafProxyS3ReadRole Event=ListBuckets/GetObject SourceIP=198.51.100.88 UserAgent=aws-cli/2.15.0',
      sizeOrCode: 'GuardDuty Severity 8.5',
      severity: 'CRITICAL',
      mitreId: 'T1530',
      explanation: 'Stolen EC2 instance credentials used from an external IP to bulk-sync S3 objects, triggering GuardDuty InstanceCredentialExfiltration.',
      rawLog: `{"eventVersion":"1.08","userIdentity":{"type":"AssumedRole","principalId":"AROAEXAMPLE:i-0a84b92c11e3f0412","arn":"arn:aws:sts::123456789012:assumed-role/WafProxyS3ReadRole/i-0a84b92c11e3f0412"},"eventSource":"s3.amazonaws.com","eventName":"GetObject","sourceIPAddress":"198.51.100.88","userAgent":"aws-cli/2.15.0 Python/3.11.6 Linux/6.5.0 command/s3.sync"}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'AWS GuardDuty EC2 Instance Credential Exfiltration Outside AWS',
        ruleCode: `title: EC2 Instance Profile Credentials Used Outside AWS VPC
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    userIdentity.type: 'AssumedRole'
    userIdentity.sessionContext.sessionIssuer.type: 'Role'
    userAgent|contains: 'aws-cli'
  condition: selection`,
        mitigation: 'Attach an aws:VpcSourceIp / aws:SourceVpce condition to the IAM Role policy so stolen EC2 credentials are rejected outside the VPC.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'aws-imdsv1-ssrf-capitalone-style',
    briefing: {
      headline: 'Scenario Briefing: AWS EC2 SSRF to IMDSv1 (169.254.169.254), Instance Role Credential Theft & S3 Sync Exfiltration',
      storyAnalogy:
        'Imagine an office mailroom clerk (EC2 Reverse Proxy / Web App) whose job is to fetch public brochures from any website address you write on a request slip (?url=...). Inside the building, however, there is an internal pneumatic tube at extension 169.254.169.254 (IMDSv1) that automatically dispenses a temporary master keycard (ASIA... STS IAM Role Credentials) to anyone sitting inside the building who asks for it, no questions asked! By writing http://169.254.169.254/latest/meta-data/iam/security-credentials/ on the public request slip (SSRF), an outsider tricks the mailroom clerk into fetching the building’s master keycard and mailing a photocopy straight back to the street.',
      plainSummary:
        'In this scenario (T1552.005, AWS Security, Unit 42 & MITRE - EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3 Exfiltration), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: exploiting Server-Side Request Forgery, then dumping Temporary AWS STS Credentials, then replaying Stolen EC2 Role Keys Outside AWS. Steps #1–#3 walk that chain end-to-end by covering Exploiting Server-Side Request Forgery, then Dumping Temporary AWS STS Credentials, then Replaying Stolen EC2 Role Keys Outside AWS, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (External Cloud Adversary), send the ?url=http://169.254.169.254/... SSRF request to Node ②/③ (EC2 Web Proxy), watch it query Node ④ (IMDSv1 169.254.169.254 Link-Local Service) for ASIA... STS keys, and trace the external aws s3 sync against Node ⑤ (AWS S3 Production Buckets) caught by Node ⑥ (GuardDuty / CloudTrail SIEM).',
      documentedAdvisory: 'AWS Security IMDSv2 Guidance · Unit 42 Cloud Threat Research · MITRE ATT&CK T1552.005 / T1530',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting Server-Side Request Forgery (SSRF) to Query Link-Local 169.254.169.254 (T1190)',
        storyAnalogy:
          'The attacker hands the web server a URL pointing to 169.254.169.254, an internal-only IP address that only processes running inside the EC2 virtual machine can reach.',
        simpleExplanation:
          'The attacker sends an HTTP GET request to a URL-fetching endpoint on the EC2 web server (/api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/) (exploiting Server-Side Request Forgery so the EC2 instance itself makes an internal HTTP GET request to AWS’s link-local Instance Metadata Service at 169.254.169.254 and returns the name of its attached IAM Role, WafProxyS3ReadRole).',
        howItWorksInPractice:
          'Because 169.254.169.254 is a non-routable link-local IP (RFC 3927) answered directly by the AWS Nitro hypervisor on the local virtual network interface, external firewalls cannot see or block traffic to it once an application inside the instance is tricked into making the request. In the documented HTTP GET SSRF exchange from External Cloud Adversary to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP HTTP 200 (WafProxyS3ReadRole) (confirming that the IMDSV1_ROLE_ENUM request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 EXTRACTION OF TEMPORARY AWS STS ROLE CREDENTIALS (ASIA...)).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (External Attacker) to Node ②/③ (EC2 Web Proxy), and return arrow ⇠#1 revealing the attached IAM Role name (WafProxyS3ReadRole).',
        detectionAndEvidence:
          'Documented by AWS & Suricata SID 2028910: Incoming HTTP URI parameters containing 169.254.169.254 and CloudWatch metric MetadataNoToken > 0.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.005',
        plainTitle: 'Dumping Temporary AWS STS Credentials (ASIA...) from IMDSv1 (T1552.005)',
        storyAnalogy:
          'Because the instance still uses legacy IMDSv1, simply asking for the role’s folder name causes the metadata service to print out the live AccessKeyId, SecretAccessKey, and SessionToken.',
        simpleExplanation:
          'Appending the discovered role name to the SSRF URL (/latest/meta-data/iam/security-credentials/WafProxyS3ReadRole) causes the IMDSv1 endpoint to return a JSON object containing temporary AWS STS credentials, AccessKeyId (starting with the prefix "ASIA", which designates temporary STS role credentials rather than permanent "AKIA" user keys), SecretAccessKey, and Token (all without requiring a preliminary HTTP PUT session token because HttpTokens is set to "optional" instead of "required").',
        howItWorksInPractice:
          'Why does IMDSv2 stop this attack? Because IMDSv2 requires the client to first send an HTTP PUT request with a custom X-aws-ec2-metadata-token-ttl-seconds header to obtain a secret token, and then pass that token in X-aws-ec2-metadata-token, two steps that classic GET-based SSRF vulnerabilities cannot perform. In the documented IMDSv1 CREDENTIAL_LEAK exchange from Perimeter Firewall & NDR Tap to EC2 Web Proxy (IMDSv1 Enabled), EC2 Web Proxy (IMDSv1 Enabled) responds with RESP 1,340 Bytes JSON (confirming that the STS_TOKEN_DUMPED request succeeded on EC2 Web Proxy (IMDSv1 Enabled) and establishing the runtime state required for Step #3 OFF-CLOUD CREDENTIAL REPLAY & S3 BUCKET SYNC EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ queries Node ④ (EC2 IMDSv1 169.254.169.254), and ⇠#2 returns the plaintext JSON credential bundle containing ASIAIOSFODNN7EXAMPLE.',
        detectionAndEvidence:
          'Correlate CloudWatch MetadataNoToken metric spikes (proving IMDSv1 access occurred) with reverse-proxy access logs returning ~1.3 KB responses from /latest/meta-data/iam/security-credentials/ (confirming live EC2 IAM role key extraction). Correlate Sysmon or Windows Security Event telemetry for T1552.005 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Replaying Stolen EC2 Role Keys Outside AWS via aws s3 sync (T1530)',
        storyAnalogy:
          'The thief takes the photocopied EC2 keycard home, plugs it into their own laptop (aws-cli), and downloads every customer file from the company’s S3 cloud vaults, setting off the "Building Keycard Used From Outside the Building!" alarm (GuardDuty).',
        simpleExplanation:
          'The attacker loads the stolen AccessKeyId, SecretAccessKey, and SessionToken into their local AWS CLI environment and runs aws s3 sync s3://corp-credit-applications-prod ./loot (authenticating directly to the public S3 API from their external IP 198.51.100.88 as the EC2 instance’s AssumedRole, which immediately triggers AWS GuardDuty’s UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS finding because an EC2 instance profile credential should only ever originate from an internal AWS EC2 IP).',
        howItWorksInPractice:
          'Even if an attacker steals an EC2 IAM role’s STS token, defenders can render the stolen token useless outside the VPC by attaching an aws:SourceVpce or aws:VpcSourceIp condition to the IAM role policy. In the documented CLOUDTRAIL / GUARDDUTY exchange from EC2 Web Proxy (IMDSv1 Enabled) to EC2 Instance Metadata Service, EC2 Instance Metadata Service responds with ALERT GuardDuty Severity 8.5 (confirming that the S3_SYNC_OUTSIDE_AWS request succeeded on EC2 Instance Metadata Service and completing the final execution objective of AWS Security, Unit 42 & MITRE, EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3 Exfiltration).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes aws s3 sync against Node ⑤ (AWS S3 Production Buckets) while Node ⑥ (GuardDuty & CloudTrail SIEM) fires InstanceCredentialExfiltration.OutsideAWS.',
        detectionAndEvidence:
          'Documented by AWS GuardDuty & CloudTrail: userIdentity.type == "AssumedRole" with principal i-0a84b92c11e3f0412 calling s3:GetObject from an external non-AWS IP.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office building whose public front-desk courier obediently fetches any internal hallway address written on a visitor slip. A clever visitor writes down the secret internal key-box address sitting inside the lobby wall, tricks the front-desk courier into walking over and reading aloud the building temporary master keycard from that unguarded box, and then walks straight to the company off-site storage warehouse to haul out every customer crate.',
      storyMappings: [
        {
          storyTerm: 'Front-desk courier fetching any internal address on a visitor slip',
          technicalTerm: 'Reverse-proxy Server-Side Request Forgery (SSRF) reaching link-local 169.254.169.254',
          tone: 'amber',
        },
        {
          storyTerm: 'Unguarded internal key-box sitting inside the lobby wall',
          technicalTerm: 'AWS EC2 Instance Metadata Service v1 (IMDSv1) requiring no session header token',
          tone: 'sky',
        },
        {
          storyTerm: 'Temporary master keycard read aloud from the box',
          technicalTerm: 'Temporary AWS STS IAM role credentials (ASIA... AccessKeyId, Secret, Token)',
          tone: 'rose',
        },
        {
          storyTerm: 'Hauling customer crates out of the off-site warehouse',
          technicalTerm: 'Replaying stolen EC2 role keys from an external IP via aws s3 sync (T1530)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Approaching the exterior web proxy window, the visitor slips an internal-only wall address into a URL box. Because the proxy fails to check whether the requested address sits inside the building own private wall, it dutifully queries the unguarded internal information panel.',
        storyMappings: [
          {
            storyTerm: 'Exterior web proxy window',
            technicalTerm: 'Misconfigured EC2 reverse proxy or web application vulnerable to SSRF',
            tone: 'amber',
          },
          {
            storyTerm: 'Internal-only wall address written on the slip',
            technicalTerm: 'Link-local AWS metadata address http://169.254.169.254/latest/meta-data/',
            tone: 'sky',
          },
          {
            storyTerm: 'Unguarded information panel lacking a token check',
            technicalTerm: 'IMDSv1 accepting simple HTTP GET requests without an IMDSv2 PUT session token',
            tone: 'rose',
          },
          {
            storyTerm: 'Guard counter catching tokenless panel visits',
            technicalTerm: 'Suricata SID 2028910 and AWS CloudWatch MetadataNoToken metric > 0',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor perimeter IDS rules such as Suricata SID 2028910 (alerting on incoming HTTP parameters containing 169.254.169.254) alongside the AWS CloudWatch MetadataNoToken metric (which counts every tokenless IMDSv1 query on an EC2 instance) and enforce IMDSv2 HopLimit=1.',
      },
      2: {
        storyAnalogy:
          'Learning the exact name of the server attached guard role from the panel, the visitor sends one more proxied slip asking for the role security drawer and receives a crisp JSON bundle containing the server live temporary keycard, secret passcode, and session stamp.',
        storyMappings: [
          {
            storyTerm: 'Server attached guard role drawer',
            technicalTerm: '/latest/meta-data/iam/security-credentials/<role-name> IMDSv1 endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Live temporary keycard, passcode, and session stamp',
            technicalTerm: 'Short-lived AWS STS AccessKeyId (ASIA...), SecretAccessKey, and SessionToken',
            tone: 'sky',
          },
          {
            storyTerm: 'Crisp bundle returned straight through the front window',
            technicalTerm: '1.3 KB JSON credential payload leaked inside the reverse proxy HTTP response',
            tone: 'rose',
          },
          {
            storyTerm: 'Why IMDSv2 blocks this trick',
            technicalTerm: 'IMDSv2 requires an HTTP PUT with X-aws-ec2-metadata-token-ttl-seconds that simple GET SSRF cannot send',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate CloudWatch MetadataNoToken metric spikes (proving IMDSv1 access occurred) with reverse-proxy access logs returning ~1.3 KB responses from /latest/meta-data/iam/security-credentials/ (confirming live EC2 IAM role key extraction). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1552.005 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Loading the stolen temporary keycard onto their own computer far outside the cloud estate, the intruder dials the company cloud storage vault directly and mirrors gigabytes of sensitive buckets before the temporary card expires.',
        storyMappings: [
          {
            storyTerm: 'Loading the stolen keycard outside the cloud estate',
            technicalTerm: 'Configuring stolen ASIA... STS keys on an external attacker workstation',
            tone: 'amber',
          },
          {
            storyTerm: 'Mirroring gigabytes of sensitive buckets',
            technicalTerm: 'Executing aws s3 sync to bulk-download confidential S3 objects',
            tone: 'sky',
          },
          {
            storyTerm: 'Impossible badge-location alarm',
            technicalTerm: 'AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
            tone: 'rose',
          },
          {
            storyTerm: 'Vault ledger naming the exact hijacked server badge',
            technicalTerm: 'CloudTrail AssumedRole event for i-0a84b92c11e3f0412 calling s3:GetObject from non-AWS IP',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert immediately on AWS GuardDuty InstanceCredentialExfiltration.OutsideAWS findings and CloudTrail logs showing userIdentity.type == "AssumedRole" for an EC2 instance principal (such as i-0a84b92c11e3f0412) calling s3:GetObject from an external non-AWS IP address (confirming off-instance key replay).',
      },
    },
  };
