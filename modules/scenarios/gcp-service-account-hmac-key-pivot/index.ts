import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'gcp-service-account-hmac-key-pivot',
    briefing: {
      headline: 'Scenario Briefing: GCP Service Account Privilege Escalation, iam.serviceAccountKeys.create & Default Compute Editor Pivot',
      storyAnalogy:
        'Imagine a cloud office building (GCP Project) where every virtual machine comes with a default janitor robot (<project-number>-compute@developer.gserviceaccount.com) that was accidentally given a master key to every room in the building (roles/editor). A contractor (ci-runner service account) doesn’t have access to the financial vault (gs://corp-financial-ledger-prod), but their badge allows them to print new ID cards for any robot in the building (iam.serviceAccountKeys.create). The contractor walks up to the card printer (iam.googleapis.com), prints a brand-new JSON private key card (loot_key.json) in the name of the Editor janitor robot, puts on that card, and empties the financial vault!',
      plainSummary:
        'In this scenario (T1098.001, Mandiant, Wiz & Google Cloud - GCP iam.serviceAccountKeys.create & serviceAccounts.actAs Impersonation Escalation), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: discovering the Over-Privileged Default, then minting a Persistent User-Managed JSON Key, then activating loot_key.json Outside GCP. Steps #1–#3 walk that chain end-to-end by covering Discovering the Over-Privileged Default, then Minting a Persistent User-Managed JSON Key, then Activating loot_key.json Outside GCP, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Compromised GCP Workload Caller ci-runner), invoke CreateServiceAccountKey on Node ②/③ (GCP IAM Control Plane API) targeting Node ④ (Default Compute Service Account with roles/editor), and use the downloaded loot_key.json to bulk-copy Node ⑤ (GCP Cloud Storage & BigQuery Prod) monitored by Node ⑥ (Google Cloud SCC & Audit Logs).',
      documentedAdvisory: 'Mandiant / Google Cloud IAM Security Best Practices · Wiz Cloud Threat Research · MITRE ATT&CK T1098.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1087.004',
        plainTitle: 'Discovering the Over-Privileged Default Compute Engine Service Account (T1087.004)',
        storyAnalogy:
          'First, the attacker lists all service accounts in the GCP project and spots <project-number>-compute@developer.gserviceaccount.com, which carries project-wide roles/editor permissions.',
        simpleExplanation:
          'Using a compromised low-privilege CI service account (ci-runner@corp-prod.iam.gserviceaccount.com), the attacker runs gcloud iam service-accounts list (calling google.iam.admin.v1.ListServiceAccounts) and identifies 482910492810-compute@developer.gserviceaccount.com (the Default Compute Engine Service Account that GCP automatically creates and historically binds to the primitive role roles/editor, granting read/write access to almost every service in the project).',
        howItWorksInPractice:
          'As Wiz Research documented, unless an organization explicitly enables constraints/iam.automaticIamGrantsForDefaultServiceAccounts, newly created Compute Engine and App Engine default service accounts receive project-wide Editor rights. In the documented GCP ADMIN_ACTIVITY exchange from Compromised GCP Workload Caller to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with RESP HTTP 200 (confirming that the LIST_SERVICE_ACCOUNTS request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 MINTING USER-MANAGED RSA JSON KEY VIA CREATESERVICEACCOUNTKEY).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (ci-runner) to Node ②/③ (GCP IAM API), and return arrow ⇠#1 listing 482910492810-compute@developer.gserviceaccount.com.',
        detectionAndEvidence:
          'Monitor Google Cloud IAM Audit Logs (central control-plane logs tracking identity queries and mutations) for google.iam.admin.v1.ListServiceAccounts calls originating from unexpected external non-GCP IP addresses such as 198.51.100.73 (early cloud reconnaissance). Correlate Sysmon or Windows Security Event telemetry for T1087.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.001',
        plainTitle: 'Minting a Persistent User-Managed JSON Key via iam.serviceAccountKeys.create (T1098.001)',
        storyAnalogy:
          'Because ci-runner was granted Service Account Key Admin at the project level, it asks GCP’s IAM API to generate and download a fresh RSA private key (loot_key.json) for the Editor service account.',
        simpleExplanation:
          'Because the ci-runner identity holds roles/iam.serviceAccountKeyAdmin (which includes iam.serviceAccountKeys.create) scoped at the project level rather than restricted to a single non-privileged account, the attacker runs gcloud iam service-accounts keys create loot_key.json --iam-account=482910492810-compute@developer.gserviceaccount.com (causing GCP IAM to generate a 2048-bit RSA key pair, store the public key on the Default Compute Service Account, and download the PKCS#8 private key in loot_key.json to the attacker’s machine).',
        howItWorksInPractice:
          'Unlike short-lived metadata tokens on a GCE VM, a user-managed service account key JSON file does not expire for 10 years by default and can be used from anywhere on the internet unless blocked by VPC Service Controls. In the documented GCP CreateServiceAccountKey exchange from Perimeter Firewall & NDR Tap to GCP IAM Control Plane API, GCP IAM Control Plane API responds with ALERT KEY_ID 9f8e7d6c5b (confirming that the USER_MANAGED_SA_KEY_CREATED request succeeded on GCP IAM Control Plane API and establishing the runtime state required for Step #3 IMPERSONATED EDITOR AUTHENTICATION & GCS BUCKET EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ calls CreateServiceAccountKey on Node ④ (Default Compute Service Account), and ⇠#2 downloads loot_key.json (keyId 9f8e7d6c5b).',
        detectionAndEvidence:
          'Alert on Google Cloud Admin Activity Audit Logs and Security Command Center (SCC) findings for google.iam.admin.v1.CreateServiceAccountKey (permanent key minting) especially where principalEmail != resourceName (indicating cross-identity key creation for persistence). Correlate Sysmon or Windows Security Event telemetry for T1098.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Activating loot_key.json Outside GCP to Exfiltrate Cloud Storage (GCS) Buckets (T1530)',
        storyAnalogy:
          'The attacker signs in with loot_key.json, exchanges a signed JWT for an Editor OAuth2 bearer token (ya29.*), and copies the entire gs://corp-financial-ledger-prod bucket.',
        simpleExplanation:
          'The attacker runs gcloud auth activate-service-account --key-file=loot_key.json (which signs a JWT assertion locally with the RSA private key and exchanges it at oauth2.googleapis.com/token for a 1-hour OAuth2 access token ya29.* carrying the Default Compute Service Account’s roles/editor permissions) and executes gcloud storage cp -r gs://corp-financial-ledger-prod ./dump/ to exfiltrate 8,900 financial Parquet files.',
        howItWorksInPractice:
          'In GCP Data Access audit logs, when a Compute Engine service account authenticates via a downloaded JSON key rather than the internal GCE metadata server, authenticationInfo.serviceAccountKeyName is populated with the exact key ID, giving defenders a 100% deterministic indicator of key theft. In the documented GCP DATA_ACCESS storage.objects.get exchange from GCP IAM Control Plane API to Default Compute Service Account, Default Compute Service Account responds with RESP 8,900 Objects Read (confirming that the GCS_BULK_DOWNLOAD request succeeded on Default Compute Service Account and completing the final execution objective of Mandiant, Wiz & Google Cloud, GCP iam.serviceAccountKeys.create & serviceAccounts.actAs Impersonation Escalation).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes storage.objects.get against Node ⑤ (GCS Bucket) while Node ⑥ (Google Cloud SCC & Chronicle SIEM) alerts on external key usage.',
        detectionAndEvidence:
          'Correlate Google Cloud Data Access Audit Logs (which track individual bucket object downloads) for storage.objects.get invoked by *-compute@developer.gserviceaccount.com carrying a non-empty authenticationInfo.serviceAccountKeyName from an external IP address (confirming off-cloud exfiltration). Correlate Sysmon or Windows Security Event telemetry for T1530 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud campus where every new virtual office comes pre-assigned a shared default maintenance badge that accidentally carries wide editor authority across the whole estate. Discovering that overly generous badge from outside the campus, an intruder walks up to the key-duplication kiosk, cuts a permanent offline steel copy of that badge, and takes the steel copy back to their own hideout to empty corporate cloud storage vaults at leisure.',
      storyMappings: [
        {
          storyTerm: 'Shared default maintenance badge carrying wide editor authority',
          technicalTerm: 'Over-privileged Default Compute Engine Service Account (*-compute@developer.gserviceaccount.com)',
          tone: 'amber',
        },
        {
          storyTerm: 'Cutting a permanent offline steel copy at the key kiosk',
          technicalTerm: 'Calling iam.serviceAccountKeys.create to mint persistent loot_key.json',
          tone: 'sky',
        },
        {
          storyTerm: 'Taking the steel copy outside the campus to empty storage vaults',
          technicalTerm: 'Activating loot_key.json from an external IP to exfiltrate GCS buckets (storage.objects.get)',
          tone: 'rose',
        },
        {
          storyTerm: 'Campus key-duplication ledger catching cross-identity cutting',
          technicalTerm: 'GCP Admin Activity Audit Log CreateServiceAccountKey where principalEmail != resourceName',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Peeking into the cloud staff roster from an outside street address, the intruder immediately spots the default Compute maintenance badge still holding broad project-wide Editor powers across storage, databases, and servers.',
        storyMappings: [
          {
            storyTerm: 'Peeking into the cloud staff roster from outside',
            technicalTerm: 'google.iam.admin.v1.ListServiceAccounts called from external IP 198.51.100.73',
            tone: 'amber',
          },
          {
            storyTerm: 'Default Compute maintenance badge with broad powers',
            technicalTerm: 'Default *-compute@developer.gserviceaccount.com carrying roles/editor',
            tone: 'sky',
          },
          {
            storyTerm: 'Campus directory audit book',
            technicalTerm: 'Google Cloud IAM Admin Activity Audit Logs recording enumeration calls',
            tone: 'rose',
          },
          {
            storyTerm: 'High-value lateral pivot target',
            technicalTerm: 'Single service account granting read/write access to GCS and compute resources',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Google Cloud IAM Audit Logs (central control-plane logs tracking identity queries and mutations) for google.iam.admin.v1.ListServiceAccounts calls originating from unexpected external non-GCP IP addresses such as 198.51.100.73 (early cloud reconnaissance). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1087.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Rather than relying on short-lived lobby passes that expire in an hour, the intruder uses key-creation rights to step up to the badge printer and stamp a permanent, user-managed JSON master key belonging to that powerful default maintenance account.',
        storyMappings: [
          {
            storyTerm: 'Badge printer stamping a permanent master key',
            technicalTerm: 'google.iam.admin.v1.CreateServiceAccountKey (iam.serviceAccountKeys.create)',
            tone: 'amber',
          },
          {
            storyTerm: 'Permanent offline steel copy',
            technicalTerm: 'User-managed private RSA JSON key file (loot_key.json) valid indefinitely until revoked',
            tone: 'sky',
          },
          {
            storyTerm: 'One person printing keys for a different account',
            technicalTerm: 'Audit log anomaly where principalEmail does not match resourceName',
            tone: 'rose',
          },
          {
            storyTerm: 'Cloud guard alarm flagging key minting',
            technicalTerm: 'Google Cloud Security Command Center (SCC) persistent key creation finding',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Google Cloud Admin Activity Audit Logs and Security Command Center (SCC) findings for google.iam.admin.v1.CreateServiceAccountKey (permanent key minting) especially where principalEmail != resourceName (indicating cross-identity key creation for persistence). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1098.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Loading the permanent steel key onto an external laptop far away from Google Cloud, the intruder signs in directly as the powerful Compute maintenance account and empties sensitive customer buckets straight over the public internet.',
        storyMappings: [
          {
            storyTerm: 'Loading the steel key onto an external laptop',
            technicalTerm: 'gcloud auth activate-service-account --key-file=loot_key.json from an external IP',
            tone: 'amber',
          },
          {
            storyTerm: 'Emptying sensitive customer storage vaults',
            technicalTerm: 'Bulk Cloud Storage exfiltration generating storage.objects.get Data Access events',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinctive external steel-key stamp in the vault diary',
            technicalTerm: 'Non-empty authenticationInfo.serviceAccountKeyName paired with a non-GCP source IP',
            tone: 'rose',
          },
          {
            storyTerm: 'Organization-wide lock preventing steel copies',
            technicalTerm: 'GCP Org Policy constraints/iam.disableServiceAccountKeyCreation',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Google Cloud Data Access Audit Logs (which track individual bucket object downloads) for storage.objects.get invoked by *-compute@developer.gserviceaccount.com carrying a non-empty authenticationInfo.serviceAccountKeyName from an external IP address (confirming off-cloud exfiltration). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1530 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
