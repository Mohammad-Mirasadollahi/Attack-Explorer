import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'gcp-service-account-hmac-key-pivot',
  code: 'T1098.001',
  name: 'Mandiant, Wiz & Google Cloud — GCP iam.serviceAccountKeys.create & serviceAccounts.actAs Impersonation Escalation',
  shortSubtitle: 'Mandiant · Wiz · Rhino Security Labs · iam.serviceAccountKeys.create · Default Compute SA Editor Pivot & GCS Exfil',
  category: 'CLOUD_SAAS',
  severity: 'CRITICAL',
  primaryMitrePhase: 3,
  overview:
    'Analyzed by Mandiant (Google Cloud Threat Intelligence), Wiz Research, and Rhino Security Labs, Google Cloud Platform (GCP) identity privilege escalation frequently exploits two high-blast-radius IAM permissions: iam.serviceAccountKeys.create and iam.serviceAccounts.actAs. When an attacker compromises a build or workload identity granted Service Account Key Admin or Service Account User over the project’s privileged Default Compute Engine Service Account (<project-number>-compute@developer.gserviceaccount.com, which historically defaults to roles/editor), the attacker generates a persistent JSON private key or mints an OAuth2 access token via generateAccessToken to exfiltrate Cloud Storage (GCS) buckets and BigQuery datasets.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Mandiant / Google Cloud IAM Hardening · Wiz Cloud Attack Path Research · Rhino Security Labs GCP PriVesc',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1098.001 (Additional Cloud Credentials: SA Key Creation) · T1550.001 (Application Access Token) · T1530 (Cloud Storage)',
    },
    {
      term: 'GCP PERMISSIONS ABUSED',
      value: 'iam.serviceAccountKeys.create & iam.serviceAccounts.actAs / iam.serviceAccounts.getAccessToken',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: 'GCP Cloud Audit Logs (Admin Activity): google.iam.admin.v1.CreateServiceAccountKey',
    },
  ],
  nodes: [
    {
      id: 'gcp_compromised_ci_caller',
      label: 'Compromised GCP Workload Caller',
      sublabel: '198.51.100.73 (ci-runner@corp-prod.iam)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Using gcloud CLI',
        pidOrPort: 'HTTPS :443 (iam.googleapis.com)',
        privilege: 'roles/iam.serviceAccountKeyAdmin on Project',
        artifacts: [
          'gcloud iam service-accounts list',
          'gcloud iam service-accounts keys create loot_key.json',
        ],
        description:
          'Attacker holding a compromised low-tier CI service account that has key-creation rights over other service accounts in the project.',
      },
    },
    {
      id: 'gcp_iam_admin_api',
      label: 'GCP IAM Control Plane API',
      sublabel: 'iam.googleapis.com (CreateServiceAccountKey)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Google Cloud IAM & IAMCredentials Service',
        pidOrPort: 'POST /v1/projects/corp-prod/serviceAccounts/.../keys',
        privilege: 'Mints RSA-2048 User-Managed JSON Key',
        artifacts: [
          'methodName: google.iam.admin.v1.CreateServiceAccountKey',
          'private_key_id: 9f8e7d6c5b4a32109876543210fedcba98765432',
        ],
        description:
          'Issues a persistent user-managed RSA private key JSON file for the target service account.',
      },
    },
    {
      id: 'default_compute_editor_sa',
      label: 'Default Compute Service Account',
      sublabel: '482910492810-compute@developer.gserviceaccount.com',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'GCP Privileged Service Account Identity',
        pidOrPort: 'OAuth2 Bearer Token (ya29.c.b0Aaekm1...)',
        privilege: 'roles/editor (Project-Wide Read/Write)',
        artifacts: [
          'gcloud auth activate-service-account --key-file=loot_key.json',
          'Inherited roles/editor across all project GCS & BigQuery resources',
        ],
        description:
          'Legacy Default Compute Engine Service Account pre-configured with project-wide Editor permissions.',
      },
    },
    {
      id: 'gcp_gcs_bigquery_vault',
      label: 'GCP Cloud Storage & BigQuery Prod',
      sublabel: 'gs://corp-financial-ledger-prod',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Google Cloud Storage (GCS) & BigQuery Data Warehouse',
        pidOrPort: 'storage.objects.get / gcloud storage cp -r',
        privilege: 'Accessible via Default Compute SA (roles/editor)',
        artifacts: [
          'gcloud storage cp -r gs://corp-financial-ledger-prod ./dump/',
          'Data Access Audit Log: storage.objects.get on 8,900 objects',
        ],
        description:
          'Production GCS buckets and BigQuery tables exfiltrated using the newly minted Default Compute SA key.',
      },
    },
    {
      id: 'gcp_scc_cloud_audit_siem',
      label: 'Google Cloud SCC & Chronicle SIEM',
      sublabel: 'CreateServiceAccountKey + OrgPolicy Monitor',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Security Command Center (SCC) & Cloud Audit Logs',
        pidOrPort: 'cloudaudit.googleapis.com/activity',
        privilege: 'GCP Security Operations & OrgPolicy Guardrail',
        artifacts: [
          'SCC Finding: Persistence: IAM Anomalous Service Account Key Created',
          'OrgPolicy: constraints/iam.disableServiceAccountKeyCreation',
        ],
        description:
          'Alerts on user-managed service account key creation and cross-IP service account key authentication.',
      },
    },
  ],
  processTree: [
    {
      pid: 8104,
      ppid: 2100,
      name: 'gcloud (GCP SDK CLI)',
      commandLine: 'gcloud iam service-accounts keys create loot_key.json --iam-account=482910492810-compute@developer.gserviceaccount.com',
      user: 'attacker',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'POST https://iam.googleapis.com/v1/projects/corp-prod/serviceAccounts/.../keys',
        'POST https://oauth2.googleapis.com/token (grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer)',
      ],
      memoryBlocks: [
        {
          address: '0x00007F1108400000',
          section: 'loot_key.json (RSA Private Key Buffer)',
          permissions: 'RW-',
          size: '8 KB',
          status: 'injected',
          description: 'Downloaded GCP service account JSON key file containing PKCS#8 private_key for the Editor service account.',
          hexPreview: '7B 0A 20 20 22 74 79 70 65 22 3A 20 22 73 65 72 ({"type": "service_account", "private_key": "...)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ENUMERATING PRIVILEGED DEFAULT COMPUTE SERVICE ACCOUNT',
      subtitle: 'Identifying 482910492810-compute@developer.gserviceaccount.com with project-wide roles/editor',
      description:
        'Using a compromised CI/CD service account, the attacker queries the GCP IAM API to enumerate service accounts in the project and identifies the Default Compute Engine Service Account (482910492810-compute@developer.gserviceaccount.com), which holds the broad primitive role roles/editor.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1087.004',
      mitreTechniqueName: 'Account Discovery: Cloud Account',
      activeNodeIds: ['gcp_compromised_ci_caller', 'gcp_iam_admin_api', 'gcp_scc_cloud_audit_siem'],
      compromisedNodeIds: ['gcp_iam_admin_api'],
      keySpecs: [
        { term: 'TARGET IDENTITY', value: '482910492810-compute@developer.gserviceaccount.com' },
        { term: 'ATTACHED ROLE', value: 'roles/editor (Project-Wide Read/Write Primitive Role)' },
        { term: 'PRIVESC PERMISSION', value: 'iam.serviceAccountKeys.create (or iam.serviceAccounts.actAs)' },
      ],
    },
    {
      index: 2,
      title: 'MINTING USER-MANAGED RSA JSON KEY VIA CREATESERVICEACCOUNTKEY',
      subtitle: 'Calling google.iam.admin.v1.CreateServiceAccountKey to download a persistent private key',
      description:
        'Because the compromised caller possesses iam.serviceAccountKeys.create at the project level (rather than scoped only to its own account), it invokes gcloud iam service-accounts keys create to generate a new user-managed RSA-2048 private key (loot_key.json) for the Default Compute Service Account.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1098.001',
      mitreTechniqueName: 'Account Manipulation: Additional Cloud Credentials',
      activeNodeIds: ['gcp_iam_admin_api', 'default_compute_editor_sa', 'gcp_scc_cloud_audit_siem'],
      compromisedNodeIds: ['gcp_iam_admin_api', 'default_compute_editor_sa'],
      keySpecs: [
        { term: 'AUDIT LOG METHOD', value: 'google.iam.admin.v1.CreateServiceAccountKey' },
        { term: 'CREDENTIAL TYPE', value: 'USER_MANAGED JSON Private Key (PKCS#8 RSA-2048)' },
        { term: 'OAUTH EXCHANGE', value: 'Signed JWT exchanged at oauth2.googleapis.com/token for ya29.* token' },
      ],
    },
    {
      index: 3,
      title: 'IMPERSONATED EDITOR AUTHENTICATION & GCS BUCKET EXFILTRATION',
      subtitle: 'Activating loot_key.json to inherit roles/editor and bulk-download gs://corp-financial-ledger-prod',
      description:
        'The attacker activates loot_key.json via gcloud auth activate-service-account, mints an OAuth2 access token (ya29.*) carrying full roles/editor privileges, and runs gcloud storage cp -r gs://corp-financial-ledger-prod to exfiltrate sensitive cloud storage buckets.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage',
      activeNodeIds: ['default_compute_editor_sa', 'gcp_gcs_bigquery_vault', 'gcp_scc_cloud_audit_siem'],
      compromisedNodeIds: ['gcp_iam_admin_api', 'default_compute_editor_sa', 'gcp_gcs_bigquery_vault'],
      keySpecs: [
        { term: 'EXFIL COMMAND', value: 'gcloud storage cp -r gs://corp-financial-ledger-prod ./dump/' },
        { term: 'DATA ACCESS LOG', value: 'storage.objects.get by 482910492810-compute@developer.gserviceaccount.com' },
        { term: 'ORG POLICY FIX', value: 'Enforce constraints/iam.disableServiceAccountKeyCreation + constraints/iam.automaticIamGrantsForDefaultServiceAccounts' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'gcp-sa-1',
      no: 1,
      stageIndex: 1,
      timestamp: '21:05:11.090',
      sourceNodeId: 'gcp_compromised_ci_caller',
      targetNodeId: 'gcp_iam_admin_api',
      sourceLabel: 'ci-runner@corp-prod.iam',
      targetLabel: 'GCP IAM API',
      sourceType: 'NETWORK',
      protocolOrEventId: 'GCP ADMIN_ACTIVITY',
      shortAction: 'LIST_SERVICE_ACCOUNTS',
      info: 'methodName=google.iam.admin.v1.ListServiceAccounts principalEmail=ci-runner@corp-prod.iam.gserviceaccount.com',
      sizeOrCode: 'HTTP 200',
      severity: 'MEDIUM',
      mitreId: 'T1087.004',
      explanation: 'Attacker enumerates all service accounts in the GCP project to locate over-privileged default service accounts.',
      rawLog: `{"protoPayload":{"@type":"type.googleapis.com/google.cloud.audit.AuditLog","serviceName":"iam.googleapis.com","methodName":"google.iam.admin.v1.ListServiceAccounts","authenticationInfo":{"principalEmail":"ci-runner@corp-prod.iam.gserviceaccount.com"},"requestMetadata":{"callerIp":"198.51.100.73"}}}`,
      detectionRule: {
        type: 'KQL',
        title: 'GCP Service Account Enumeration from External Non-Cloud IP',
        ruleCode: `gcp_cloudaudit_activity | where methodName == "google.iam.admin.v1.ListServiceAccounts" and not(ipv4_is_in_range(callerIp, "34.0.0.0/8"))`,
        mitigation: 'Enforce VPC Service Controls (VPC-SC) perimeters around IAM and Cloud Storage APIs.',
      },
    },
    {
      id: 'gcp-sa-2',
      no: 2,
      stageIndex: 2,
      timestamp: '21:05:18.442',
      sourceNodeId: 'gcp_iam_admin_api',
      targetNodeId: 'default_compute_editor_sa',
      sourceLabel: 'GCP IAM API',
      targetLabel: 'Default Compute SA',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'GCP CreateServiceAccountKey',
      shortAction: 'USER_MANAGED_SA_KEY_CREATED',
      info: 'methodName=google.iam.admin.v1.CreateServiceAccountKey resourceName=.../482910492810-compute@developer.gserviceaccount.com',
      sizeOrCode: 'KEY_ID 9f8e7d6c5b',
      severity: 'CRITICAL',
      mitreId: 'T1098.001',
      explanation: 'A lower-privileged CI service account creates a persistent JSON private key for the Editor-level Default Compute Service Account.',
      rawLog: `{"protoPayload":{"serviceName":"iam.googleapis.com","methodName":"google.iam.admin.v1.CreateServiceAccountKey","authenticationInfo":{"principalEmail":"ci-runner@corp-prod.iam.gserviceaccount.com"},"resourceName":"projects/corp-prod/serviceAccounts/482910492810-compute@developer.gserviceaccount.com","requestMetadata":{"callerIp":"198.51.100.73","callerSuppliedUserAgent":"google-cloud-sdk gcloud/462.0.1"}}}`,
      detectionRule: {
        type: 'SIGMA',
        title: 'GCP User-Managed Service Account Key Created for Privileged Account',
        ruleCode: `title: GCP CreateServiceAccountKey Audit Alert
logsource:
  product: gcp
  service: gcp.audit
detection:
  selection:
    data.protoPayload.methodName: 'google.iam.admin.v1.CreateServiceAccountKey'
  condition: selection`,
        mitigation: 'Enable GCP Organization Policy constraints/iam.disableServiceAccountKeyCreation and constraints/iam.automaticIamGrantsForDefaultServiceAccounts.',
      },
    },
    {
      id: 'gcp-sa-3',
      no: 3,
      stageIndex: 3,
      timestamp: '21:06:40.715',
      sourceNodeId: 'default_compute_editor_sa',
      targetNodeId: 'gcp_gcs_bigquery_vault',
      sourceLabel: 'Impersonated Compute SA',
      targetLabel: 'GCS Bucket (corp-financial-ledger)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'GCP DATA_ACCESS storage.objects.get',
      shortAction: 'GCS_BULK_DOWNLOAD',
      info: 'principalEmail=482910492810-compute@developer.gserviceaccount.com methodName=storage.objects.get callerIp=198.51.100.73',
      sizeOrCode: '8,900 Objects Read',
      severity: 'CRITICAL',
      mitreId: 'T1530',
      explanation: 'Default Compute Engine Service Account is used from an external IP (198.51.100.73) outside GCE to bulk-download GCS objects.',
      rawLog: `{"protoPayload":{"serviceName":"storage.googleapis.com","methodName":"storage.objects.get","resourceName":"projects/_/buckets/corp-financial-ledger-prod/objects/q4_settlements.parquet","authenticationInfo":{"principalEmail":"482910492810-compute@developer.gserviceaccount.com","serviceAccountKeyName":"//iam.googleapis.com/projects/corp-prod/serviceAccounts/482910492810-compute@developer.gserviceaccount.com/keys/9f8e7d6c5b4a"},"requestMetadata":{"callerIp":"198.51.100.73"}}}`,
      detectionRule: {
        type: 'KQL',
        title: 'GCP Default Compute Service Account Authenticated Using Static Key Outside GCE',
        ruleCode: `gcp_cloudaudit_data_access | where principalEmail endswith "-compute@developer.gserviceaccount.com" and isnotempty(serviceAccountKeyName)`,
        mitigation: 'Delete all user-managed keys on *-compute@developer.gserviceaccount.com and alert whenever serviceAccountKeyName is non-empty.',
      },
    },
  ],
};
