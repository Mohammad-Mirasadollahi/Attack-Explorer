import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud shipping port where an unguarded storefront kiosk accidentally lets an outsider peek into the local dockworker badge tray. Lifting the dockworker temporary badge, the intruder opens a storage locker holding the port complete paper blueprint book, which still has plaintext master cloud keys scribbled in the margins, and uses an automated cloud-raiding toolkit to sweep proprietary designs and compute power across neighboring accounts.',
      storyMappings: [
        {
          storyTerm: 'Unguarded storefront kiosk leaking the dockworker badge tray',
          technicalTerm: 'Exposed EKS workload pod RCE harvesting worker node IMDS IAM credentials',
          tone: 'amber',
        },
        {
          storyTerm: 'Port blueprint book with plaintext master keys in the margins',
          technicalTerm: 'S3 terraform.tfstate files leaking plaintext AWS IAM static secret keys',
          tone: 'sky',
        },
        {
          storyTerm: 'Automated cloud-raiding toolkit sweeping neighboring accounts',
          technicalTerm: 'Pacu AWS exploitation framework pivoting across accounts via CreateAccessKey',
          tone: 'rose',
        },
        {
          storyTerm: 'Stealing proprietary designs and hijacking compute rigs',
          technicalTerm: 'Exfiltrating intellectual property (GetFunction / S3) and launching crypto miners',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a public web flaw on a containerized kiosk inside the cluster, the intruder reaches straight out to the underlying server local badge dispenser and grabs the temporary cloud key assigned to the entire worker node.',
        storyMappings: [
          {
            storyTerm: 'Public web flaw on a containerized kiosk',
            technicalTerm: 'Initial RCE inside an internet-exposed Amazon EKS workload pod',
            tone: 'amber',
          },
          {
            storyTerm: 'Underlying server local badge dispenser',
            technicalTerm: 'EC2 Instance Metadata Service (169.254.169.254) reachable from pod network',
            tone: 'sky',
          },
          {
            storyTerm: 'Temporary cloud key assigned to the entire worker node',
            technicalTerm: 'Over-privileged eks-node-role STS credentials shared by all pods on the node',
            tone: 'rose',
          },
          {
            storyTerm: 'Stepping out of the container into the cloud control plane',
            technicalTerm: 'Transition from application RCE to AWS API access using harvested node IAM keys',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using the borrowed dockworker badge to browse cloud storage buckets, the intruder spots the engineering team infrastructure state ledgers sitting unguarded and pulls out long-lived master cloud keys written right inside them in plain sight.',
        storyMappings: [
          {
            storyTerm: 'Infrastructure state ledgers sitting in cloud storage',
            technicalTerm: 'Amazon S3 objects ending in terraform.tfstate storing full deployment state',
            tone: 'amber',
          },
          {
            storyTerm: 'Long-lived master keys written inside in plain sight',
            technicalTerm: 'Unencrypted plaintext AWS IAM Access Keys and Secret Keys inside tfstate JSON',
            tone: 'sky',
          },
          {
            storyTerm: 'Dockworker opening an architect-only locker',
            technicalTerm: 'eks-node-role reading .tfstate objects normally accessed only by CI/CD pipelines',
            tone: 'rose',
          },
          {
            storyTerm: 'Storage ledger recording the suspicious read',
            technicalTerm: 'AWS CloudTrail S3 Data Event GetObject on *.tfstate by eks-node-role',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable AWS CloudTrail S3 Data Events (object-level storage audit logs recording every file download) and alert whenever GetObject targets keys ending in .tfstate from an EKS worker node role (eks-node-role) instead of the authorized CI/CD Terraform pipeline role.',
      },
      3: {
        storyAnalogy:
          'Armed with the freshly discovered permanent master keys, the intruder spins up an automated cloud-exploitation toolkit to mint backdoor keys, cross over into linked corporate cloud accounts, download proprietary code, and hijack expensive compute engines.',
        storyMappings: [
          {
            storyTerm: 'Automated cloud-exploitation toolkit',
            technicalTerm: 'Pacu open-source AWS exploitation framework running from Kali Linux',
            tone: 'amber',
          },
          {
            storyTerm: 'Minting permanent backdoor keys',
            technicalTerm: 'iam:CreateAccessKey persistence ensuring access after node role rotation',
            tone: 'sky',
          },
          {
            storyTerm: 'Downloading proprietary code across accounts',
            technicalTerm: 'Cross-account pivot calling lambda:GetFunction and S3 exfiltration',
            tone: 'rose',
          },
          {
            storyTerm: 'Distinctive tool fingerprint left in the audit diary',
            technicalTerm: 'CloudTrail userAgent containing kali or pacu immediately following tfstate reads',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor AWS CloudTrail CreateAccessKey and GetFunction API logs (tracking persistence creation and proprietary code retrieval) for userAgent strings containing kali or pacu occurring shortly after S3 terraform.tfstate downloads (confirming SCARLETEEL post-exploitation).',
      },
    },
  };
