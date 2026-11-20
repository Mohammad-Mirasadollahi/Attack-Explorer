import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'sysdig-scarleteel-aws-eks-terraform',
    briefing: {
      headline: 'Scenario Briefing: Sysdig SCARLETEEL Cloud Operation, Kubernetes Pod Exploit, S3 terraform.tfstate Theft & Cross-Account Pivot',
      storyAnalogy:
        'Imagine a burglar (SCARLETEEL) who slips through an open window into a small workshop annex (Kubernetes Pod in AWS EKS). The workshop annex only has keys to a hallway supply closet (S3 DevOps Bucket). However, sitting inside that supply closet is the master architectural blueprint book (terraform.tfstate) that the building’s engineers used to construct the entire corporate campus! Because the blueprint tool (Terraform) writes down the actual cleartext combination (aws_iam_access_key.attributes.secret) of every vault it builds right inside that book, reading terraform.tfstate hands the burglar the permanent master keys to the company’s main production bank vaults across the street.',
      plainSummary:
        'Discovered and analyzed by the Sysdig Threat Research Team (SCARLETEEL & SCARLETEEL 2.0), Permiso P0 Labs, and Palo Alto Unit 42, this scenario models a sophisticated cloud-native intrusion chain that pivots from a single Kubernetes container into multi-account AWS dominance. After exploiting an internet-facing workload pod in Amazon EKS, the attacker queries the worker node’s Instance Metadata Service (169.254.169.254), uses the node role to download terraform.tfstate from an S3 backend bucket, extracts plaintext aws_iam_access_key secret keys belonging to privileged cross-account administrators, and uses the Pacu framework to steal proprietary source code and S3 datasets.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (SCARLETEEL Operator), exploit the public container on Node ②/③ (EKS Workload Pod), download and parse s3://corp-devops-tfstate-prod/terraform.tfstate from Node ④ (S3 Terraform State Backend), and replay the extracted AKIA admin keys via Pacu against Node ⑤ (Peered Production AWS Account) monitored by Node ⑥ (Sysdig Falco & CloudTrail SIEM).',
      documentedAdvisory: 'Sysdig Threat Research Team (SCARLETEEL Report) · Permiso P0 Labs · MITRE ATT&CK T1610 / T1552.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting an Exposed EKS Workload Pod & Harvesting Node IMDS Credentials (T1190)',
        storyAnalogy:
          'The attacker breaks into a web container running inside Kubernetes (ml-notebook-prod), drops aws-cli into /tmp, and asks the underlying EC2 worker node’s metadata service (169.254.169.254) for its IAM role token.',
        simpleExplanation:
          'SCARLETEEL exploits a remote code execution flaw on a public-facing Kubernetes workload pod (ml-notebook-prod-6d8f9), downloads static binaries (aws-cli, kubectl, and trufflehog) into /tmp (triggering a Sysdig Falco container runtime drift alert), and queries http://169.254.169.254/latest/meta-data/iam/security-credentials/eks-node-role (which succeeds whenever the EKS worker node’s IMDS hop limit is left at 2 instead of restricted to 1).',
        howItWorksInPractice:
          'On Kubernetes nodes hosted on EC2, pods operate one network router hop inside the node; if HttpPutResponseHopLimit is >= 2, any compromised pod can reach the underlying EC2 worker node’s IMDS endpoint and steal the node-level IAM role. In the documented FALCO CONTAINER_DRIFT exchange from SCARLETEEL Cloud Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK FALCO WARNING (confirming that the IN_CONTAINER_TOOL_DROP request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 S3 TERRAFORM STATE (.TFSTATE) PLAINTEXT SECRET EXTRACTION).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (SCARLETEEL Operator) to Node ②/③ (EKS Workload Pod), and return arrow ⇠#1 harvesting the eks-node-role STS token.',
        detectionAndEvidence:
          'Documented by Sysdig TRT: Falco eBPF alert for downloading/executing aws or trufflehog inside a running container (container_drift).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Extracting Plaintext AWS IAM Secret Keys from S3 terraform.tfstate Files (T1552.001)',
        storyAnalogy:
          'Using the node role to browse S3 buckets, the attacker finds terraform.tfstate, a JSON blueprint file that stores every Terraform-created IAM secret key and database password in unencrypted plaintext!',
        simpleExplanation:
          'Using the stolen eks-node-role credentials, the attacker lists accessible S3 buckets, spots the Infrastructure-as-Code state backend (s3://corp-devops-tfstate-prod/prod/terraform.tfstate), and streams the JSON file through grep (because whenever an engineer uses a Terraform resource like aws_iam_access_key or aws_db_instance, Terraform writes the generated SecretAccessKey and master password in cleartext inside the .tfstate JSON file).',
        howItWorksInPractice:
          'As Sysdig highlighted in their SCARLETEEL analysis, Terraform state files are a goldmine for cloud attackers: they not only contain plaintext secrets, but also map out every VPC, account ID, and S3 bucket across the organization. In the documented CLOUDTRAIL S3 GetObject exchange from Perimeter Firewall & NDR Tap to EKS Workload Pod (Spring/Jupyter), EKS Workload Pod (Spring/Jupyter) responds with RESP 1.8 MB JSON (confirming that the TERRAFORM_TFSTATE_READ request succeeded on EKS Workload Pod (Spring/Jupyter) and establishing the runtime state required for Step #3 CROSS-ACCOUNT PACU PIVOT & PROPRIETARY CODE EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ executes s3:GetObject on Node ④ (S3 Terraform State Backend), and ⇠#2 returns the plaintext terraform-org-admin AKIA key pair from terraform.tfstate.',
        detectionAndEvidence:
          'Documented by Sysdig TRT: AWS CloudTrail S3 Data Event GetObject on keys ending in .tfstate by an EKS worker node role (eks-node-role) rather than the CI/CD pipeline role.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Pivoting Across AWS Accounts with Pacu to Exfiltrate Proprietary Code & S3 Buckets (T1078.004)',
        storyAnalogy:
          'With the master terraform-org-admin key from .tfstate, the attacker loads the Pacu toolkit on Kali Linux, walks into the company’s crown-jewel production AWS account, mints backup keys, and downloads all proprietary code.',
        simpleExplanation:
          'The attacker imports the permanent AKIA access key extracted from terraform.tfstate into the Pacu cloud exploitation framework on their Kali Linux machine (generating a distinctive User-Agent containing "Boto3/... Linux/6.1.0-kali9-amd64"), runs iam__enum_permissions and iam__backdoor_users_keys to create persistent access keys in the peered production AWS account, and executes aws lambda get-function and aws s3 sync to steal proprietary algorithms.',
        howItWorksInPractice:
          'While SCARLETEEL sometimes deploys XMRig miners on compromised Kubernetes nodes, Sysdig proved that cryptomining is often a noisy distraction while the operators exfiltrate high-value intellectual property via S3 and Lambda APIs. In the documented CLOUDTRAIL CreateAccessKey exchange from EKS Workload Pod (Spring/Jupyter) to S3 Terraform State Backend, S3 Terraform State Backend responds with ALERT CROSS_ACCOUNT_COMPROMISE (confirming that the PACU_CROSS_ACCOUNT_BACKDOOR request succeeded on S3 Terraform State Backend and completing the final execution objective of Sysdig TRT, Permiso & Unit 42, SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft & Pacu Pivot).',
        diagramAlignment:
          'On the diagram, arrow #3→ pivots from Node ①/④ into Node ⑤ (Peered Production AWS Account) while Node ⑥ (Sysdig & CloudTrail SIEM) flags the Kali/Pacu CreateAccessKey and GetFunction calls.',
        detectionAndEvidence:
          'Documented by Sysdig TRT & Permiso: CloudTrail CreateAccessKey / GetFunction calls with userAgent containing kali or pacu following terraform.tfstate access.',
      },
    ],
  };
