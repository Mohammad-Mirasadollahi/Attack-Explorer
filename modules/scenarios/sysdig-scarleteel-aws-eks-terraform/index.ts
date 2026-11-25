import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'sysdig-scarleteel-aws-eks-terraform',
  code: 'T1610',
  name: 'Sysdig TRT, Permiso & Unit 42 — SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft & Pacu Pivot',
  shortSubtitle: 'Sysdig Threat Research · Permiso P0 Labs · EKS Pod RCE -> IMDS -> S3 terraform.tfstate Plaintext Keys -> Cross-Account Pivot',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 6,
  overview:
    'Uncovered by the Sysdig Threat Research Team (TRT) and analyzed alongside Permiso P0 Labs and Unit 42, SCARLETEEL is an advanced cloud-native intrusion operation targeting Kubernetes (EKS) clusters and AWS environments to steal proprietary source code and cloud infrastructure. After exploiting a public-facing containerized workload in Kubernetes, SCARLETEEL queries the node/pod metadata service for initial IAM role credentials, locates unencrypted Terraform state files (terraform.tfstate) stored in S3 buckets, extracts plaintext AWS IAM access keys for interconnected production accounts from the .tfstate JSON, and uses the Pacu framework and TruffleHog for cross-account intellectual property theft.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Sysdig Threat Research Team (SCARLETEEL & SCARLETEEL 2.0) · Permiso P0 Labs · Unit 42 Cloud Report',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Container Workload RCE) · T1552.001 (Credentials in terraform.tfstate) · T1078.004 (Cross-Account AWS Pivot)',
    },
    {
      term: 'HIGH-VALUE ARTIFACT',
      value: 's3://corp-infra-tfstate/prod/terraform.tfstate (Plaintext aws_iam_access_key secrets)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'Sysdig Falco Container Exec + CloudTrail GetObject (terraform.tfstate) + Pacu User-Agent',
    },
  ],
  nodes: [
    {
      id: 'scarleteel_operator',
      label: 'SCARLETEEL Cloud Operator',
      sublabel: '198.51.100.162 (Pacu & TruffleHog C2)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Cloud-Native Intrusion Operator (Pacu Framework)',
        pidOrPort: 'HTTPS :443 (Kubernetes Ingress & AWS S3/IAM APIs)',
        privilege: 'External Exploiter -> Multi-Account AWS Admin',
        artifacts: [
          'exploit_pod_rce.sh (curl / aws-cli / kubectl / trufflehog)',
          'Pacu session User-Agent: Boto3/1.26.x Python/3.10 Linux/kali',
        ],
        description:
          'Targets exposed Kubernetes workloads to pivot into underlying AWS accounts and steal proprietary ML/software IP.',
      },
    },
    {
      id: 'eks_compromised_pod',
      label: 'EKS Workload Pod (Spring/Jupyter)',
      sublabel: '10.100.14.28 (pod/ml-notebook-prod-6d8f9)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Kubernetes Pod on AWS EKS (Ubuntu 22.04 Container)',
        pidOrPort: 'PID 412 (/bin/bash reconnaissance script)',
        privilege: 'ServiceAccount Token + EC2 Node IAM Role',
        artifacts: [
          '/var/run/secrets/kubernetes.io/serviceaccount/token',
          'http://169.254.169.254/latest/meta-data/iam/security-credentials/eks-node-role',
        ],
        description:
          'Publicly reachable Kubernetes workload exploited for initial shell execution inside the AWS EKS cluster.',
      },
    },
    {
      id: 's3_terraform_state_bucket',
      label: 'S3 Terraform State Backend',
      sublabel: 's3://corp-devops-tfstate-prod/terraform.tfstate',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Amazon S3 Bucket Storing Infrastructure-as-Code State',
        pidOrPort: 's3:GetObject (terraform.tfstate JSON)',
        privilege: 'Readable by EKS Node / DevOps Role',
        artifacts: [
          'resources[].type == "aws_iam_access_key" -> attributes.secret (Plaintext AKIA/Secret)',
          'Database master_password & Peered AWS Account IDs',
        ],
        description:
          'Terraform state file storing a complete plaintext JSON map of the organization’s cloud architecture and created IAM secret keys.',
      },
    },
    {
      id: 'peered_prod_aws_account',
      label: 'Peered Production AWS Account',
      sublabel: 'Account 987654321098 (S3 IP & Lambda Code)',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Production AWS Account (Proprietary Source & S3)',
        pidOrPort: 'STS GetCallerIdentity / S3 Sync / Lambda GetFunction',
        privilege: 'Organization-Admin IAM Key from .tfstate',
        artifacts: [
          'aws lambda list-functions & aws s3 sync s3://proprietary-algorithms-prod',
          'Pacu iam__enum_permissions &iam__backdoor_users_keys',
        ],
        description:
          'Core production AWS account compromised using plaintext IAM access keys harvested from the S3 Terraform state file.',
      },
    },
    {
      id: 'sysdig_and_cloudtrail_siem',
      label: 'Sysdig Secure & AWS CloudTrail SIEM',
      sublabel: 'Falco Container Drift + .tfstate Access Alert',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Sysdig Runtime eBPF & CloudTrail Correlation Engine',
        pidOrPort: 'Falco Binary Drift + S3 Data Events',
        privilege: 'CNAPP & CDR Detection Plane',
        artifacts: [
          'Falco: Download and execute aws-cli / kubectl inside running container',
          'CloudTrail: GetObject on *terraform.tfstate* followed by Pacu enumeration',
        ],
        description:
          'Correlates in-container binary downloads (aws-cli/trufflehog) with S3 GetObject calls on .tfstate files.',
      },
    },
  ],
  processTree: [
    {
      pid: 412,
      ppid: 1,
      name: 'bash (SCARLETEEL Pod Recon)',
      commandLine: '/bin/bash -c "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/eks-node-role && aws s3 cp s3://corp-devops-tfstate-prod/terraform.tfstate - | grep -E \'secret|password|AKIA\'"',
      user: 'root',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'connect("169.254.169.254:80")',
        'execve("/usr/local/bin/aws", ["aws", "s3", "cp", "s3://.../terraform.tfstate", "-"])',
      ],
      memoryBlocks: [
        {
          address: '0x00007F4190800000',
          section: 'Pipe Buffer (Parsed terraform.tfstate JSON)',
          permissions: 'RW-',
          size: '512 KB',
          status: 'injected',
          description: 'In-memory stream of terraform.tfstate exposing plaintext aws_iam_access_key secret values.',
          hexPreview: '22 74 79 70 65 22 3A 20 22 61 77 73 5F 69 61 6D ("type": "aws_iam_access_key", "secret": "...)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'KUBERNETES POD RCE & NODE IMDS CREDENTIAL HARVESTING',
      subtitle: 'Exploiting an exposed EKS container workload and querying 169.254.169.254 for node IAM credentials',
      description:
        'SCARLETEEL exploits an internet-facing container pod running in Amazon EKS, downloads static reconnaissance binaries (aws-cli, kubectl, trufflehog) into /tmp, and queries both /var/run/secrets/kubernetes.io/serviceaccount/token and the EC2 worker node’s IMDS endpoint (169.254.169.254) to harvest temporary IAM role credentials.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application (EKS Pod)',
      activeNodeIds: ['scarleteel_operator', 'eks_compromised_pod', 'sysdig_and_cloudtrail_siem'],
      compromisedNodeIds: ['eks_compromised_pod'],
      keySpecs: [
        { term: 'INITIAL FOOTHOLD', value: 'Exposed Kubernetes Workload Pod in AWS EKS' },
        { term: 'HARVESTED TOKENS', value: 'K8s ServiceAccount JWT + EC2 Node Role STS Credentials' },
        { term: 'RUNTIME DRIFT', value: 'curl downloading aws-cli & trufflehog into container /tmp' },
      ],
    },
    {
      index: 2,
      title: 'S3 TERRAFORM STATE (.TFSTATE) PLAINTEXT SECRET EXTRACTION',
      subtitle: 'Downloading terraform.tfstate from S3 to recover plaintext aws_iam_access_key secrets',
      description:
        'Using the EKS node’s IAM role, the attacker lists S3 buckets and locates s3://corp-devops-tfstate-prod/terraform.tfstate. Because Terraform stores resource attributes in cleartext JSON inside state files, parsing aws_iam_access_key and aws_db_instance blocks reveals permanent AKIA access keys and secrets for privileged admin accounts.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1552.001',
      mitreTechniqueName: 'Unsecured Credentials: Credentials In Files (terraform.tfstate)',
      activeNodeIds: ['eks_compromised_pod', 's3_terraform_state_bucket', 'sysdig_and_cloudtrail_siem'],
      compromisedNodeIds: ['eks_compromised_pod', 's3_terraform_state_bucket'],
      keySpecs: [
        { term: 'TARGET ARTIFACT', value: 's3://corp-devops-tfstate-prod/terraform.tfstate' },
        { term: 'TERRAFORM RESOURCE', value: 'aws_iam_access_key.attributes.id & attributes.secret' },
        { term: 'ARCHITECTURAL RISK', value: 'Terraform state files store created IAM secrets in plaintext JSON' },
      ],
    },
    {
      index: 3,
      title: 'CROSS-ACCOUNT PACU PIVOT & PROPRIETARY CODE EXFILTRATION',
      subtitle: 'Replaying .tfstate admin keys in Pacu to backdoor IAM users and dump proprietary S3/Lambda code',
      description:
        'Armed with the permanent AKIA admin keys from terraform.tfstate, SCARLETEEL imports them into the Pacu cloud exploitation framework, pivots into peered production AWS accounts, runs iam__backdoor_users_keys for persistence, and exfiltrates proprietary Lambda deployment packages and S3 intellectual property.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1078.004',
      mitreTechniqueName: 'Valid Accounts: Cloud Accounts',
      activeNodeIds: ['scarleteel_operator', 's3_terraform_state_bucket', 'peered_prod_aws_account', 'sysdig_and_cloudtrail_siem'],
      compromisedNodeIds: ['eks_compromised_pod', 's3_terraform_state_bucket', 'peered_prod_aws_account'],
      keySpecs: [
        { term: 'EXPLOITATION FRAMEWORK', value: 'Pacu (iam__enum_permissions / iam__backdoor_users_keys)' },
        { term: 'EXFILTRATED ASSETS', value: 'Lambda GetFunction (.zip code) & Proprietary S3 Models' },
        { term: 'DEFENSIVE FIX', value: 'Set HopLimit=1 on EKS Nodes + Restrict S3 .tfstate Bucket via KMS/IAM' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'scarleteel-1',
      no: 1,
      stageIndex: 1,
      timestamp: '04:11:29.308',
      sourceNodeId: 'scarleteel_operator',
      targetNodeId: 'eks_compromised_pod',
      sourceLabel: 'SCARLETEEL Operator',
      targetLabel: 'EKS Workload Pod',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'FALCO CONTAINER_DRIFT',
      shortAction: 'IN_CONTAINER_TOOL_DROP',
      info: 'container=ml-notebook-prod proc=curl args="-sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/aws.zip"',
      sizeOrCode: 'FALCO WARNING',
      severity: 'HIGH',
      mitreId: 'T1190',
      explanation: 'Sysdig Falco detects runtime container drift as the attacker downloads AWS CLI and TruffleHog inside an EKS pod.',
      rawLog: `04:11:29.308112000: Warning New executable downloaded and executed inside container (user=root pod=ml-notebook-prod-6d8f9 ns=prod cmdline=curl -sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/aws.zip)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Sysdig Falco Runtime Container Drift & Cloud CLI Execution in Pod',
        ruleCode: `rule: Cloud CLI Executed Inside Production Container
condition: spawned_process and container and proc.name in (aws, gcloud, az, trufflehog, pacu)
output: "Cloud reconnaissance binary executed in container (pod=%k8s.pod.name cmd=%proc.cmdline)"`,
        mitigation: 'Enforce immutable container filesystems (readOnlyRootFilesystem: true) and block pod access to node IMDS via HttpPutResponseHopLimit=1.',
      },
    },
    {
      id: 'scarleteel-2',
      no: 2,
      stageIndex: 2,
      timestamp: '04:13:02.640',
      sourceNodeId: 'eks_compromised_pod',
      targetNodeId: 's3_terraform_state_bucket',
      sourceLabel: 'EKS Pod (eks-node-role)',
      targetLabel: 'S3 Terraform State Bucket',
      sourceType: 'NETWORK',
      protocolOrEventId: 'CLOUDTRAIL S3 GetObject',
      shortAction: 'TERRAFORM_TFSTATE_READ',
      info: 'AssumedRole=eks-node-role eventName=GetObject bucketName=corp-devops-tfstate-prod key=prod/terraform.tfstate',
      sizeOrCode: '1.8 MB JSON',
      severity: 'CRITICAL',
      mitreId: 'T1552.001',
      explanation: 'Compromised EKS node role downloads the production terraform.tfstate file from S3 to harvest plaintext IAM keys.',
      rawLog: `{"eventSource":"s3.amazonaws.com","eventName":"GetObject","userIdentity":{"type":"AssumedRole","arn":"arn:aws:sts::111122223333:assumed-role/eks-node-role/i-09912a3bc"},"requestParameters":{"bucketName":"corp-devops-tfstate-prod","key":"prod/terraform.tfstate"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'SCARLETEEL S3 Terraform State (.tfstate) Access by Non-CI/CD Role',
        ruleCode: `title: Suspicious S3 GetObject on Terraform State File
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: 's3.amazonaws.com'
    eventName: 'GetObject'
    requestParameters.key|endswith: '.tfstate'
  condition: selection`,
        mitigation: 'Isolate Terraform state buckets with strict S3 Bucket Policies allowing access only to dedicated CI/CD roles, and never create raw aws_iam_access_key resources in Terraform.',
      },
    },
    {
      id: 'scarleteel-3',
      no: 3,
      stageIndex: 3,
      timestamp: '04:16:50.119',
      sourceNodeId: 'scarleteel_operator',
      targetNodeId: 'peered_prod_aws_account',
      sourceLabel: 'SCARLETEEL (Pacu)',
      targetLabel: 'Peered Prod Account',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'CLOUDTRAIL CreateAccessKey',
      shortAction: 'PACU_CROSS_ACCOUNT_BACKDOOR',
      info: 'User=terraform-org-admin eventName=CreateAccessKey & GetFunction sourceIP=198.51.100.162 userAgent="Boto3/1.26.90 Python/3.10.12 Linux/6.1.0-kali"',
      sizeOrCode: 'CROSS_ACCOUNT_COMPROMISE',
      severity: 'CRITICAL',
      mitreId: 'T1078.004',
      explanation: 'Attacker replays the plaintext IAM key extracted from terraform.tfstate using Pacu on Kali Linux to mint persistent keys and download Lambda code.',
      rawLog: `{"eventSource":"iam.amazonaws.com","eventName":"CreateAccessKey","awsRegion":"us-east-1","sourceIPAddress":"198.51.100.162","userAgent":"Boto3/1.26.90 Python/3.10.12 Linux/6.1.0-kali9-amd64","userIdentity":{"type":"IAMUser","userName":"terraform-org-admin"}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Pacu / Kali Linux User-Agent Executing AWS IAM CreateAccessKey',
        ruleCode: `title: AWS IAM API Call From Kali Linux or Pacu Framework
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    userAgent|contains:
      - 'kali'
      - 'parrot'
      - 'pacu'
  condition: selection`,
        mitigation: 'Rotate all secrets present in exposed .tfstate files and migrate cross-account Terraform pipelines to OIDC short-lived AssumeRole sessions.',
      },
    },
  ],
};
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'sysdig-scarleteel-aws-eks-terraform',
    briefing: {
      headline: 'Scenario Briefing: Sysdig SCARLETEEL Cloud Operation, Kubernetes Pod Exploit, S3 terraform.tfstate Theft & Cross-Account Pivot',
      storyAnalogy:
        'Imagine a burglar (SCARLETEEL) who slips through an open window into a small workshop annex (Kubernetes Pod in AWS EKS). The workshop annex only has keys to a hallway supply closet (S3 DevOps Bucket). However, sitting inside that supply closet is the master architectural blueprint book (terraform.tfstate) that the building’s engineers used to construct the entire corporate campus! Because the blueprint tool (Terraform) writes down the actual cleartext combination (aws_iam_access_key.attributes.secret) of every vault it builds right inside that book, reading terraform.tfstate hands the burglar the permanent master keys to the company’s main production bank vaults across the street.',
      plainSummary:
        'In this scenario (T1610, Sysdig TRT, Permiso & Unit 42 - SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft & Pacu Pivot), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: exploiting an Exposed EKS Workload Pod, then extracting Plaintext AWS IAM Secret Keys, then pivoting Across AWS Accounts with Pacu. Steps #1–#3 walk that chain end-to-end by covering Exploiting an Exposed EKS Workload Pod, then Extracting Plaintext AWS IAM Secret Keys, then Pivoting Across AWS Accounts with Pacu, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Sysmon telemetry correlated across the documented kill chain.',
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
          'Documented by Sysdig TRT: Falco eBPF alert for downloading/executing aws or trufflehog inside a running container (container_drift). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
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
