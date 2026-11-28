import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';
import { IMDS_TELEMETRY } from './telemetry';

export const scenario: AttackScenario = {
  id: 'aws-imdsv1-ssrf-capitalone-style',
  code: 'T1552.005',
  name: 'AWS EC2 Reverse-Proxy SSRF to IMDSv1 IAM Role & S3 Exfiltration',
  shortSubtitle: 'Cloud & SaaS · Host-Header SSRF, Link-Local IMDSv1 STS Harvest, Off-VPC S3 Sync & IMDSv2 HopLimit=1',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'A misconfigured EC2 reverse proxy (ec2-waf-edge-01) honors an attacker-supplied HTTP Host header targeting link-local IMDSv1 (169.254.169.254), leaking short-lived AWS STS credentials for the over-privileged ISRM-WAF-Role and enabling external aws s3 sync exfiltration until GuardDuty OutsideAWS and IMDSv2 HopLimit=1 containment lock the metadata boundary.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1190 (Public-Facing SSRF) · T1552.005 (Cloud IMDS) · T1530 (Cloud Storage)' },
    { term: 'METADATA TARGET', value: 'Link-Local 169.254.169.254:80 (/latest/meta-data/iam/security-credentials/)' },
    { term: 'STOLEN IDENTITY', value: 'ISRM-WAF-Role (STS ASIA5LABEXAMPLE9Q2W · 6-Hour Temporary Token)' },
    { term: 'CLOUD TELEMETRY', value: 'Reverse-Proxy Upstream Logs + CloudTrail S3 Data Events + GuardDuty' },
    { term: 'HARDENING FIX', value: 'IMDSv2 (HttpTokens=required, HttpPutResponseHopLimit=1) + aws:SourceVpce' },
    { term: 'CASE GROUNDING', value: 'AWS IMDSv2 Architecture, Unit 42 Cloud SSRF & MITRE ATT&CK T1552.005' },
  ],
  nodes: [
    {
      id: 'attacker',
      label: 'External Attacker Host',
      sublabel: '198.51.100.88 · curl / aws-cli',
      role: 'attacker',
      x: 8,
      y: 26,
      details: {
        osOrType: 'External Adversary Workstation (198.51.100.88)',
        pidOrPort: 'HTTPS 443 / HTTP 80 · Off-VPC',
        privilege: 'Unauthenticated Internet Caller',
        artifacts: [
          'Sends forged Host: 169.254.169.254 HTTP GET request to EC2 proxy',
          'Extracts temporary STS AccessKeyId, SecretAccessKey, and SessionToken',
          'Runs aws s3 ls and aws s3 sync directly from off-VPC public IP',
        ],
        description:
          'External workstation outside the corporate AWS VPC that pivots through a misconfigured WAF reverse proxy and replays stolen STS tokens.',
      },
    },
    {
      id: 'ec2-proxy',
      label: 'EC2 Reverse Proxy (WAF)',
      sublabel: 'ec2-waf-edge-01 · nginx PID 2418',
      role: 'victim_host',
      x: 28,
      y: 26,
      details: {
        osOrType: 'Amazon EC2 Linux Instance (i-0a9f21c84d7e301b2)',
        pidOrPort: 'PID 2418 · TCP/80 & TCP/443',
        privilege: 'www-data (Host-Local IMDS Access)',
        artifacts: [
          'Unsafe proxy_pass dynamically honors client-supplied Host header',
          'Relays GET /latest/meta-data/iam/security-credentials/ over link-local interface',
          'Access log records upstream_addr=169.254.169.254:80 (sole host witness)',
        ],
        description:
          'Public-facing EC2 reverse proxy whose dynamic upstream routing allows SSRF into the host-only link-local metadata service.',
      },
    },
    {
      id: 'imds-endpoint',
      label: 'EC2 IMDSv1 Metadata',
      sublabel: '169.254.169.254:80 · Link-Local',
      role: 'server',
      x: 50,
      y: 20,
      details: {
        osOrType: 'AWS Hypervisor Link-Local Metadata Service (IMDSv1)',
        pidOrPort: '169.254.169.254:80 · No PUT Token',
        privilege: 'Instance Hypervisor Control Channel',
        artifacts: [
          'Responds to single unauthenticated HTTP GET with ISRM-WAF-Role name',
          'Serves 1,342-byte STS JSON credential bundle without challenge header',
          'Generates zero AWS CloudTrail API events on local metadata reads',
        ],
        description:
          'Link-local EC2 metadata service configured in legacy IMDSv1 mode without mandatory PUT session-token enforcement.',
      },
    },
    {
      id: 'sts-role',
      label: 'IAM Role STS Issuer',
      sublabel: 'ISRM-WAF-Role · ASIA5LAB...',
      role: 'domain_controller',
      x: 72,
      y: 26,
      details: {
        osOrType: 'AWS IAM Instance Profile & STS Token Session',
        pidOrPort: 'ARN assumed-role/ISRM-WAF-Role',
        privilege: 'Over-Privileged s3:ListAllMyBuckets & s3:GetObject',
        artifacts: [
          'Mints 6-hour temporary STS credentials automatically rotated on EC2',
          'Excessive IAM policy grants read access across production S3 buckets',
          'Credentials remain valid off-VPC unless revoked or VPC-conditioned',
        ],
        description:
          'Over-scoped IAM instance profile attached to the WAF EC2 host whose temporary STS keys authorize production S3 bucket access.',
      },
    },
    {
      id: 's3-vault',
      label: 'Amazon S3 Data Buckets',
      sublabel: 'corp-credit-applications-prod',
      role: 'memory',
      x: 72,
      y: 66,
      details: {
        osOrType: 'Private Amazon S3 Object Storage Bucket',
        pidOrPort: 's3.us-east-1.amazonaws.com:443',
        privilege: 'Confidential Customer Parquet Archives',
        artifacts: [
          'Receives SigV4-signed ListBuckets, ListObjectsV2, and GetObject calls',
          'CloudTrail S3 Data Events log sourceIPAddress 198.51.100.88 without VPC ID',
          'Hardened via aws:SourceVpce bucket-policy condition',
        ],
        description:
          'Production Amazon S3 bucket storing sensitive archives targeted once the attacker obtains the WAF instance-profile STS token.',
      },
    },
    {
      id: 'siem-guardduty',
      label: 'CloudTrail & GuardDuty SOC',
      sublabel: 'OutsideAWS + IMDSv2 HopLimit=1',
      role: 'firewall_siem',
      x: 34,
      y: 68,
      details: {
        osOrType: 'AWS GuardDuty, CloudTrail & EC2 Hardening Control Plane',
        pidOrPort: 'OutsideAWS Finding · HttpTokens=required',
        privilege: 'SOC Detection & Automated Containment',
        artifacts: [
          'Fires UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
          'Attaches inline Deny-All session revocation policy to ISRM-WAF-Role',
          'Enforces IMDSv2 (HttpTokens=required, HttpPutResponseHopLimit=1)',
        ],
        description:
          'Cloud detection and governance plane that spots off-AWS instance-token replay, revokes sessions, and enforces IMDSv2.',
      },
    },
  ],
  processTree: [
    {
      pid: 2418,
      ppid: 1,
      name: 'nginx: worker process (ec2-waf-edge-01)',
      commandLine: 'nginx -g "daemon off;" (proxy_pass http://$http_host$request_uri;)',
      user: 'www-data',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'GET http://169.254.169.254/latest/meta-data/iam/security-credentials/ -> 200 ISRM-WAF-Role',
        'GET http://169.254.169.254/latest/meta-data/iam/security-credentials/ISRM-WAF-Role -> 1,342B STS JSON',
      ],
      memoryBlocks: [
        {
          address: '0x00007F8A10400000',
          section: 'Proxy Upstream Buffer · IMDSv1 Unauthenticated GET Response',
          permissions: 'RW-',
          size: '64 KB',
          status: 'injected',
          description:
            'Nginx upstream response buffer holding raw temporary STS AccessKeyId, SecretAccessKey, and SessionToken relayed verbatim to 198.51.100.88.',
          hexPreview: '7B 22 41 63 63 65 73 73 4B 65 79 49 64 22 3A 22  {"AccessKeyId":"',
        },
        {
          address: '0x00007F8A10418000',
          section: 'STS Session Replay Cache · External SigV4 S3 Sync Context',
          permissions: 'RW-',
          size: '32 KB',
          status: 'patched',
          description:
            'AssumedRole identity arn:aws:sts::111122223333:assumed-role/ISRM-WAF-Role/i-0a9f21c84d7e301b2 replayed off-VPC for s3:GetObject.',
          hexPreview: '41 53 49 41 35 4C 41 42 45 58 41 4D 50 4C 45 39  ASIA5LABEXAMPLE9',
        },
        {
          address: '0x00007F8A10424000',
          section: 'IMDSv2 Challenge Guard · HttpTokens=required & HopLimit=1',
          permissions: 'R--',
          size: '16 KB',
          status: 'clean',
          description:
            'Hardened EC2 metadata policy requiring PUT /latest/api/token with TTL=1 so proxied GET SSRF returns HTTP 401 Unauthorized.',
          hexPreview: '48 54 54 50 2F 31 2E 31 20 34 30 31 20 55 6E 61  HTTP/1.1 401 Una',
        },
      ],
    },
    {
      pid: 8821,
      ppid: 1,
      name: 'aws s3 sync (External Attacker CLI · 198.51.100.88)',
      commandLine: 'aws s3 sync s3://corp-credit-applications-prod ./loot --region us-east-1',
      user: 'attacker@198.51.100.88',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        's3:ListBuckets + s3:ListObjectsV2 (Signed With Stolen ASIA5LAB... Token)',
        's3:GetObject archive/2025-q1-applicants.parquet -> GuardDuty OutsideAWS Alert',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Reverse-Proxy SSRF Pivot to Link-Local IMDSv1',
      subtitle: 'Crafted Host Header Tricks ec2-waf-edge-01 Into Dialing 169.254.169.254',
      description:
        'External attacker 198.51.100.88 sends an HTTP GET request carrying Host: 169.254.169.254 through a misconfigured reverse proxy, enumerating attached IAM role name ISRM-WAF-Role.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (Reverse-Proxy SSRF)',
      activeNodeIds: ['attacker', 'ec2-proxy', 'imds-endpoint'],
      compromisedNodeIds: ['attacker', 'ec2-proxy'],
      keySpecs: [
        { term: 'TARGET HOST', value: 'ec2-waf-edge-01 (i-0a9f21c84d7e301b2 · nginx PID 2418)' },
        { term: 'SSRF VECTOR', value: 'Host: 169.254.169.254 -> GET /latest/meta-data/iam/security-credentials/' },
        { term: 'RETURNED ROLE', value: 'HTTP 200 OK · ISRM-WAF-Role' },
      ],
    },
    {
      index: 2,
      title: 'Unauthenticated IMDSv1 STS Credential Harvest',
      subtitle: 'Single GET Request Extracts 6-Hour Temporary AWS STS Credentials With Zero CloudTrail Log',
      description:
        'Because IMDSv1 accepts single-request HTTP GET calls without a prior session token, the attacker requests /latest/meta-data/iam/security-credentials/ISRM-WAF-Role and receives live STS JSON credentials.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.005',
      mitreTechniqueName: 'Unsecured Credentials: Cloud Instance Metadata API',
      activeNodeIds: ['ec2-proxy', 'imds-endpoint', 'sts-role'],
      compromisedNodeIds: ['attacker', 'ec2-proxy', 'imds-endpoint', 'sts-role'],
      keySpecs: [
        { term: 'PROTOCOL FLAW', value: 'IMDSv1 Accepts Unauthenticated HTTP GET (No PUT Token)' },
        { term: 'STOLEN TOKEN', value: 'AccessKeyId ASIA5LABEXAMPLE9Q2W + SecretAccessKey + SessionToken' },
        { term: 'BLIND SPOT', value: 'Zero AWS CloudTrail API Event Generated on Local IMDS Read' },
      ],
    },
    {
      index: 3,
      title: 'Off-VPC S3 Bucket Discovery & Bulk Sync Exfiltration',
      subtitle: 'Replaying Stolen EC2 Instance Credentials From External IP 198.51.100.88',
      description:
        'Importing the stolen STS credentials into an external workstation outside the AWS VPC, the attacker runs aws s3 ls and aws s3 sync against corp-credit-applications-prod using over-privileged ISRM-WAF-Role.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage (Off-VPC S3 Sync)',
      activeNodeIds: ['sts-role', 's3-vault', 'siem-guardduty'],
      compromisedNodeIds: ['attacker', 'ec2-proxy', 'imds-endpoint', 'sts-role', 's3-vault'],
      keySpecs: [
        { term: 'OFF-VPC SOURCE', value: '198.51.100.88 (Zero vpcEndpointId in CloudTrail S3 Data Event)' },
        { term: 'CLOUDTRAIL APIS', value: 'ListBuckets -> ListObjectsV2 -> GetObject Parquet Archives' },
        { term: 'IAM OVER-SCOPE', value: 'WAF Edge Role Holds Wildcard Production S3 Read Access' },
      ],
    },
    {
      index: 4,
      title: 'GuardDuty OutsideAWS Alert & IMDSv2 HopLimit=1 Lock',
      subtitle: 'Revoking Active Sessions & Blocking Proxy Relays With Mandatory PUT Session Tokens',
      description:
        'AWS GuardDuty fires UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS; defenders revoke active sessions and enforce IMDSv2 (HttpTokens=required, HttpPutResponseHopLimit=1).',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.005',
      mitreTechniqueName: 'Cloud Instance Metadata Hardening & Token Revocation',
      activeNodeIds: ['s3-vault', 'siem-guardduty', 'imds-endpoint'],
      compromisedNodeIds: ['attacker'],
      keySpecs: [
        { term: 'GUARDDUTY ALERT', value: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS' },
        { term: 'IMDSV2 LOCK', value: 'HttpTokens=required + HttpPutResponseHopLimit=1 (HTTP 401)' },
        { term: 'BUCKET GUARD', value: 'Revoke Prior Sessions + Enforce aws:SourceVpce Policy' },
      ],
    },
  ],
  telemetry: IMDS_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'aws-imdsv1-ssrf-capitalone-style',
  briefing: {
    headline: 'How a Front-Desk Proxy SSRF Hands Cloud IAM Keys to an Outside Attacker',
    storyAnalogy:
      'Picture a gleaming glass luxury hotel whose rooftop safe-deposit vault can only be opened with temporary brass master keycards printed by a private lobby intercom kiosk behind the reception desk. Outsiders on the street can never walk up to that kiosk, yet a distracted front-desk concierge blindly obeys any room-service slip handed through the glass window. A clever street courier slides across a slip addressed to the private lobby kiosk, tricks the concierge into printing a fresh brass master keycard without any signature check, and walks straight up to the rooftop gallery to empty locked customer drawers before security desk radar notices a hotel-only keycard being swiped from the street.',
    plainSummary:
      'In this scenario (MITRE T1552.005, EC2 Reverse-Proxy SSRF to IMDSv1 IAM Role and S3 Exfiltration) on ec2-waf-edge-01, an external attacker pivots through a misconfigured reverse proxy into the cloud metadata endpoint and drains private S3 storage. The attack unfolds in one continuous arc: abusing a reverse-proxy Host header to reach link-local 169.254.169.254, then harvesting unauthenticated IMDSv1 temporary STS credentials, then replaying those keys from an off-VPC host to run aws s3 sync, then triggering GuardDuty OutsideAWS containment and IMDSv2 hardening. Steps #1 through #4 trace each request and CloudTrail event end-to-end while the Memory tab compares vulnerable IMDSv1 proxy response buffers against hardened IMDSv2 session-token checks. Primary detection correlates AWS CloudTrail S3 data events with GuardDuty InstanceCredentialExfiltration.OutsideAWS alerts.',
    diagramTopologySummary:
      'Six-node cloud intrusion chain connecting External Attacker Host (198.51.100.88), EC2 Reverse Proxy (ec2-waf-edge-01), Link-Local IMDSv1 (169.254.169.254), IAM Role STS Issuer (ISRM-WAF-Role), Amazon S3 Buckets (corp-credit-applications-prod), and CloudTrail & GuardDuty SOC.',
    documentedAdvisory:
      'Grounded in AWS Security IMDSv2 Architecture, Palo Alto Networks Unit 42 Cloud SSRF Analysis, and MITRE ATT&CK T1552.005.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1190',
      plainTitle: 'Tricking the Reverse Proxy Into Calling Link-Local Metadata',
      storyAnalogy:
        'Walking up to the glass lobby counter from the public sidewalk, the street courier slides across a printed room-service slip whose destination line quietly points to the hotel private lobby intercom kiosk instead of an ordinary guest room. Because the distracted concierge never verifies whether a destination belongs to an approved guest suite, they pick up the internal brass receiver and read back the name of the house master keycard cabinet straight to the stranger outside.',
      simpleExplanation:
        'From external address 198.51.100.88, the attacker sends an HTTP GET request to ec2-waf-edge-01 (the public-facing EC2 web application firewall and reverse proxy) with the HTTP Host header rewritten to 169.254.169.254 (the special AWS link-local metadata IP address reachable strictly from inside the virtual machine). Because the proxy dynamically forwards requests using that unvalidated Host header (Server-Side Request Forgery, where an attacker forces a server to make internal network calls on their behalf), nginx queries /latest/meta-data/iam/security-credentials/ and echoes back the attached role name ISRM-WAF-Role.',
      howItWorksInPractice:
        'Inside nginx worker process PID 2418 on ec2-waf-edge-01, an unsafe directive such as proxy_pass http://$http_host$request_uri (a reverse-proxy configuration that trusts the raw client Host header to pick the upstream destination) resolves 169.254.169.254:80 over the instance local loopback interface. Because the TCP socket originates from the EC2 guest kernel rather than the internet, AWS hypervisor routing delivers the GET request straight to IMDSv1 (Instance Metadata Service version 1, which trusts any local HTTP GET without requiring custom headers or session tokens), returning HTTP 200 OK with body ISRM-WAF-Role.',
      diagramAlignment:
        'Follow Step #1 as Node 1 (External Attacker Host) sends crafted Host headers through Node 2 (EC2 Reverse Proxy) into Node 3 (EC2 IMDSv1 Metadata).',
      detectionAndEvidence:
        'Inspect Nginx and WAF access_log streams for upstream_addr matching 169.254.169.254 or request paths containing /latest/meta-data/, and correlate with Sigma proxy SSRF rules before credential theft occurs.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1552.005',
      plainTitle: 'Harvesting Unauthenticated IMDSv1 STS Temporary Credentials',
      storyAnalogy:
        'Now knowing the exact cabinet label inside the lobby kiosk, the courier passes a second room-service slip asking the concierge to push the dispense button on that specific slot. Because the old brass kiosk never asks for a signed two-step lobby challenge pass, it immediately spits out a glowing golden master keycard envelope stamped with six full hours of valid building access and slides it straight back under the glass window.',
      simpleExplanation:
        'Appending the discovered role name to the metadata path, the attacker sends a second proxied HTTP GET request for /latest/meta-data/iam/security-credentials/ISRM-WAF-Role (the exact IMDSv1 endpoint that serves active short-lived credentials for the virtual machine). With zero authentication challenge, IMDSv1 returns a 1,342-byte JSON document containing AccessKeyId ASIA5LABEXAMPLE9Q2W (the temporary public identifier), SecretAccessKey (the cryptographic signing key), and SessionToken (the AWS STS bearer proof validating the assumed role session).',
      howItWorksInPractice:
        'AWS automatically rotates EC2 instance-profile credentials through AWS STS (Security Token Service, which issues short-lived assumed-role tokens rather than static long-term keys) and exposes the current bundle on 169.254.169.254:80. Critically, reading IMDSv1 inside the host generates zero AWS CloudTrail API events (because metadata reads occur locally on the hypervisor link-local channel rather than against the regional STS control plane), meaning the proxy access log on ec2-waf-edge-01 is the sole host-side witness to the credential theft.',
      diagramAlignment:
        'Follow Step #2 from Node 2 (EC2 Reverse Proxy) to Node 3 (EC2 IMDSv1 Metadata) and Node 4 (IAM Role STS Issuer) as the 1,342-byte STS JSON returns.',
      detectionAndEvidence:
        'Monitor reverse-proxy access_log entries for HTTP 200 responses exceeding 800 bytes from upstream 169.254.169.254 on /latest/meta-data/iam/security-credentials/, and audit EC2 MetadataNoToken CloudWatch metrics to eliminate IMDSv1 calls.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1530',
      plainTitle: 'Replaying Stolen EC2 Credentials Outside AWS to Sync S3 Buckets',
      storyAnalogy:
        'Holding the freshly minted golden master keycard outside the hotel perimeter, the courier no longer needs the concierge at all. They walk directly to the rooftop safe-deposit gallery, swipe the hotel badge to list every locked archive vault, and steadily hoist crates of customer records off-property because the front-desk badge was carelessly granted keys to the entire rooftop floor.',
      simpleExplanation:
        'Exporting AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN into a local shell on 198.51.100.88 (the attacker external workstation completely outside the corporate VPC), the attacker bypasses the EC2 reverse proxy altogether and talks directly to s3.us-east-1.amazonaws.com over HTTPS. Because ISRM-WAF-Role was mistakenly granted broad S3 permissions (violating least-privilege separation between edge web proxies and backend data lakes), aws s3 ls and aws s3 sync copy sensitive Parquet archives straight off-cloud.',
      howItWorksInPractice:
        'Every AWS CLI request signs the HTTPS payload using Signature Version 4 (AWS cryptographic request signing computed with the stolen SecretAccessKey and SessionToken) and presents the EC2 assumed-role identity arn:aws:sts::111122223333:assumed-role/ISRM-WAF-Role/i-0a9f21c84d7e301b2. While S3 authorizes the ListBuckets, ListObjectsV2, and GetObject calls because the IAM policy permits them, AWS CloudTrail S3 Data Events (detailed object-level audit logging in CloudTrail) record sourceIPAddress 198.51.100.88 without any corporate vpcEndpointId.',
      diagramAlignment:
        'Follow Step #3 from Node 4 (IAM Role STS Issuer) to Node 5 (Amazon S3 Data Buckets) while Node 6 (CloudTrail & GuardDuty SOC) captures off-VPC GetObject telemetry.',
      detectionAndEvidence:
        'Alert in CloudTrail and SIEM whenever an EC2 AssumedRole principal ARN ending in an instance ID invokes ListBuckets, ListObjectsV2, or GetObject from a public sourceIPAddress lacking a corporate vpcEndpointId.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1552.005',
      plainTitle: 'GuardDuty OutsideAWS Detection, Session Revocation & IMDSv2 Lock',
      storyAnalogy:
        'At the hotel security desk, the automated keycard radar catches the unmistakable mismatch: a lobby-only master badge assigned to the front-desk computer is suddenly unlocking rooftop vaults from an unknown street address. Security officers instantly void the active keycard batch and bolt an emerald two-step turnstile over the lobby kiosk so simple front-desk requests can never print a keycard again.',
      simpleExplanation:
        'AWS GuardDuty continuously compares the source network of every EC2 instance-profile STS token against the AWS IP space of the owning instance, immediately firing UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS (a high-severity managed alert proving a host role credential left its EC2 boundary). Responders attach an inline Deny-All-Prior-Sessions policy to ISRM-WAF-Role and run modify-instance-metadata-options to enforce IMDSv2 (session-oriented metadata requiring a special PUT token request first).',
      howItWorksInPractice:
        'Enabling IMDSv2 with HttpTokens=required (rejecting any legacy GET request lacking an X-aws-ec2-metadata-token header with HTTP 401 Unauthorized) and HttpPutResponseHopLimit=1 (setting the IP Time-to-Live on the PUT token response packet to exactly 1 so the token drops before crossing a reverse proxy or container NAT boundary) mathematically neutralizes simple SSRF relays. Pairing IMDSv2 with an S3 bucket policy condition requiring aws:SourceVpce ensures even a leaked token fails from external networks.',
      diagramAlignment:
        'Follow Step #4 from Node 5 (Amazon S3 Data Buckets) to Node 6 (CloudTrail & GuardDuty SOC) as IMDSv2 locks Node 3 (EC2 IMDSv1 Metadata).',
      detectionAndEvidence:
        'Subscribe AWS GuardDuty finding UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS to EventBridge SOAR playbooks, verify CloudTrail ModifyInstanceMetadataOptions audit records, and enforce IMDSv2 via AWS Organizations SCP.',
    },
  ],
};
