import type { AttackScenario } from '../types';

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
