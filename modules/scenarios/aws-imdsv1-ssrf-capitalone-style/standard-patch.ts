import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
          'Correlate CloudWatch MetadataNoToken metric spikes (proving IMDSv1 access occurred) with reverse-proxy access logs returning ~1.3 KB responses from /latest/meta-data/iam/security-credentials/ (confirming live EC2 IAM role key extraction).',
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
