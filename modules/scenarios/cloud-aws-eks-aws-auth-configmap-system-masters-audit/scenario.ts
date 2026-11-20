import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-aws-eks-aws-auth-configmap-system-masters-audit',
    title: 'AWS EKS Security, Unit 42 & MITRE — Amazon EKS aws-auth ConfigMap system:masters RBAC Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1098',
    description:
      'Grounded in the AWS EKS Security Best Practices Guide, Palo Alto Unit 42 cloud-native research, and MITRE ATT&CK T1098: DFIR analysts investigate how an attacker with Kubernetes ConfigMap patch permissions modifies kube-system/aws-auth (mapRoles or mapUsers) to bind an external or low-privilege AWS IAM ARN to the Kubernetes system:masters superuser group.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised CI/CD IAM Role', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Amazon EKS Control Plane API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'kube-system/aws-auth ConfigMap', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EKS Control Plane CloudWatch Audit', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'system:masters ClusterAdmin Access', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: EKS STS Presigned Bearer Token Authentication (k8s-aws-v1.<base64>)',
        narration:
          'An AWS IAM principal authenticates to the Amazon EKS API server by generating a presigned STS GetCallerIdentity URL encoded as a Bearer token (k8s-aws-v1.<base64>), which aws-iam-authenticator maps to Kubernetes groups via kube-system/aws-auth.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1078.004 - Cloud Accounts)',
        technicalCommands: [
          'aws eks get-token --cluster-name prod-eks-cluster',
          'kubectl get configmap aws-auth -n kube-system -o yaml',
        ],
        defenseMitigation:
          'Migrate Amazon EKS clusters from the legacy kube-system/aws-auth ConfigMap to the native EKS Access Entries API (authenticationMode: API) managed via AWS IAM.',
        logs: [
          {
            id: 'eks-auth-1',
            timestamp: '16:10:09.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'GET /api/v1/namespaces/kube-system/configmaps/aws-auth',
            raw: 'eks_audit: {"kind":"Event","verb":"get","user":{"username":"kubernetes-admin","extra":{"arn":["arn:aws:sts::123456789012:assumed-role/eks-ci-deployer/build-01"]}},"objectRef":{"resource":"configmaps","namespace":"kube-system","name":"aws-auth"},"responseStatus":{"code":200}}',
            parsedFields: {
              EksClusterAuth: 'aws-iam-authenticator (k8s-aws-v1 token)',
              CallerIamArn: 'arn:aws:sts::123456789012:assumed-role/eks-ci-deployer/build-01',
              TargetConfigMap: 'kube-system/aws-auth',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Patching kube-system/aws-auth mapUsers / mapRoles with system:masters Group',
        narration:
          'Using update/patch permissions on ConfigMaps in kube-system, the actor appends a secondary IAM role or user ARN into data.mapUsers with groups: ["system:masters"], granting persistent cluster-admin authority that bypasses Kubernetes RoleBindings.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence & Privilege Escalation (T1098 - Account Manipulation)',
        technicalCommands: [
          'fields @timestamp, user.username, objectRef.name, requestObject.data.mapUsers | filter objectRef.name == "aws-auth" and verb in ["update", "patch"]',
          'kubectl describe configmap aws-auth -n kube-system',
        ],
        defenseMitigation:
          'Enable Amazon GuardDuty EKS Audit Log Monitoring (which alerts on Policy:Kubernetes/AdminAccessToDefaultServiceAccount and aws-auth modifications) and restrict update/patch verbs on kube-system/aws-auth.',
        logs: [
          {
            id: 'eks-auth-2',
            timestamp: '16:11:22.408',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'PATCH /api/v1/namespaces/kube-system/configmaps/aws-auth (mapRoles -> system:masters)',
            raw: 'eks_audit: {"kind":"Event","verb":"patch","user":{"username":"kubernetes-admin"},"objectRef":{"resource":"configmaps","namespace":"kube-system","name":"aws-auth"},"requestObject":{"data":{"mapRoles":"- rolearn: arn:aws:iam::123456789012:role/readonly-audit-role\\n  username: cluster-maint\\n  groups:\\n  - system:masters\\n"}},"responseStatus":{"code":200}}',
            parsedFields: {
              AuditVerb: 'patch (kube-system/aws-auth)',
              InjectedMapping: 'rolearn: readonly-audit-role -> groups: [system:masters]',
              PrivilegeLevel: 'Built-in Kubernetes Superuser (system:masters)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Cluster-Admin Secret Enumeration & EKS Access Entry Remediation',
        narration:
          'Authenticating as the newly mapped IAM role, the actor inherits system:masters group membership (which is hardcoded into kube-apiserver to bypass RBAC authorization checks) and lists cluster secrets.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.007 - Container API)',
        technicalCommands: [
          'aws eks update-cluster-config --name prod-eks-cluster --access-config authenticationMode=API',
          'aws eks list-access-entries --cluster-name prod-eks-cluster',
        ],
        defenseMitigation:
          'Switch the EKS cluster to authenticationMode=API (disabling the aws-auth ConfigMap completely) and audit all EKS Access Entries via AWS CloudTrail.',
        logs: [
          {
            id: 'eks-auth-3',
            timestamp: '16:12:04.770',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'LIST /api/v1/secrets as group system:masters',
            raw: 'eks_audit: {"kind":"Event","verb":"list","user":{"username":"cluster-maint","groups":["system:masters","system:authenticated"],"extra":{"arn":["arn:aws:sts::123456789012:assumed-role/readonly-audit-role/s1"]}},"objectRef":{"resource":"secrets"},"annotations":{"authorization.k8s.io/decision":"allow"}}',
            parsedFields: {
              EffectiveGroup: 'system:masters',
              AuthzDecision: 'allow (Built-in Superuser Group)',
              TargetResource: '/api/v1/secrets',
            },
          },
        ],
      },
    ],
  };
