import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'aws-imdsv1-ssrf-capitalone-style',
    briefing: {
      headline: 'Scenario Briefing: AWS EC2 SSRF to IMDSv1 (169.254.169.254), Instance Role Credential Theft & S3 Sync Exfiltration',
      storyAnalogy:
        'Imagine an office mailroom clerk (EC2 Reverse Proxy / Web App) whose job is to fetch public brochures from any website address you write on a request slip (?url=...). Inside the building, however, there is an internal pneumatic tube at extension 169.254.169.254 (IMDSv1) that automatically dispenses a temporary master keycard (ASIA... STS IAM Role Credentials) to anyone sitting inside the building who asks for it, no questions asked! By writing http://169.254.169.254/latest/meta-data/iam/security-credentials/ on the public request slip (SSRF), an outsider tricks the mailroom clerk into fetching the building’s master keycard and mailing a photocopy straight back to the street.',
      plainSummary:
        'In this scenario (T1552.005, AWS Security, Unit 42 & MITRE - EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3 Exfiltration), the attacker follows one continuous arc: exploiting Server-Side Request Forgery to Query, then dumping Temporary AWS STS Credentials from IMDSv1, then replaying Stolen EC2 Role Keys Outside AWS via aws. Steps #1–#3 examine #1 Exploiting Server-Side Request Forgery to Query; #2 Dumping Temporary AWS STS Credentials from IMDSv1; #3 Replaying Stolen EC2 Role Keys Outside AWS via aws. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection pivots on Suricata SID 2028910 (alerting on incoming HTTP telemetry correlated across the documented kill chain.',
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
