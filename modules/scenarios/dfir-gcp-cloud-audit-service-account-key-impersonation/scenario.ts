import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-gcp-cloud-audit-service-account-key-impersonation',
    title: 'Google Cloud Mandiant IR & MITRE DFIR — GCP Cloud Audit ServiceAccountKey Creation & Impersonation Chain Forensics',
    category: 'CLOUD_SAAS',
    mitreId: 'T1098.001',
    description:
      'Grounded in Google Cloud Mandiant Incident Response guides, GCP Cloud Audit Logs documentation, and MITRE ATT&CK T1098.001 / T1530: an attacker compromises a workload identity, invokes iam.serviceAccounts.getAccessToken (producing a serviceAccountDelegationInfo impersonation chain in Admin Activity / Data Access logs), creates an exported JSON private key via google.iam.admin.v1.CreateServiceAccountKey, and runs a BigQuery export job (JobInserted).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised GCP Workload', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IAM Credentials API', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Privileged Service Account', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'GCP Cloud Audit Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'BigQuery JobInserted Exfil', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Service Account Impersonation via iamcredentials.googleapis.com GenerateAccessToken',
        narration:
          'Starting from a compromised Compute Engine default service account, the actor calls iamcredentials.googleapis.com method GenerateAccessToken to impersonate prod-data-admin@corp-prod.iam.gserviceaccount.com. GCP Data Access Audit Logs record the caller in authenticationInfo.serviceAccountDelegationInfo.firstPartyPrincipal.principalEmail.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1078.004 - Valid Accounts: Cloud Service Account Impersonation)',
        technicalCommands: [
          'GCP Audit Log: logName="projects/corp-prod/logs/cloudaudit.googleapis.com%2Fdata_access"',
          'protoPayload.serviceName: "iamcredentials.googleapis.com" | methodName: "GenerateAccessToken"',
          'authenticationInfo.serviceAccountDelegationInfo[0].firstPartyPrincipal.principalEmail',
        ],
        defenseMitigation:
          'Enable Data Access audit logs for iam.googleapis.com and iamcredentials.googleapis.com and restrict roles/iam.serviceAccountTokenCreator.',
        logs: [
          {
            id: 'dfir-gcp-1',
            timestamp: '07:22:10.104',
            source: 'Network',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'gcloud',
            CommandLine: 'GCP Audit: iamcredentials.googleapis.com GenerateAccessToken for prod-data-admin',
            raw: '{"protoPayload":{"@type":"type.googleapis.com/google.cloud.audit.AuditLog","serviceName":"iamcredentials.googleapis.com","methodName":"GenerateAccessToken","resourceName":"projects/-/serviceAccounts/prod-data-admin@corp-prod.iam.gserviceaccount.com","authenticationInfo":{"principalEmail":"prod-data-admin@corp-prod.iam.gserviceaccount.com","serviceAccountDelegationInfo":[{"firstPartyPrincipal":{"principalEmail":"ci-runner@corp-prod.iam.gserviceaccount.com"}}]}}}',
            parsedFields: {
              ServiceName: 'iamcredentials.googleapis.com',
              MethodName: 'GenerateAccessToken',
              ImpersonatedAccount: 'prod-data-admin@corp-prod.iam.gserviceaccount.com',
              DelegatingCaller: 'ci-runner@corp-prod.iam.gserviceaccount.com',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Persistent User-Managed JSON Key Creation (google.iam.admin.v1.CreateServiceAccountKey)',
        narration:
          'To maintain long-lived external access, the actor invokes google.iam.admin.v1.CreateServiceAccountKey, which is always logged in GCP Admin Activity Audit Logs (cloudaudit.googleapis.com%2Factivity) along with the newly minted key ID (response.name) and keyAlgorithm (KEY_ALG_RSA_2048).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1098.001 - Additional Cloud Credentials: CreateServiceAccountKey)',
        technicalCommands: [
          'GCP Admin Activity Log: serviceName="iam.googleapis.com" methodName="google.iam.admin.v1.CreateServiceAccountKey"',
          'response.name: "projects/corp-prod/serviceAccounts/prod-data-admin@.../keys/9f81a20b3c4d..."',
        ],
        defenseMitigation:
          'Enforce the GCP Organization Policy constraint constraints/iam.disableServiceAccountKeyCreation across all production folders and projects.',
        logs: [
          {
            id: 'dfir-gcp-2',
            timestamp: '07:22:14.612',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'gcloud',
            CommandLine: 'GCP Admin Activity: google.iam.admin.v1.CreateServiceAccountKey',
            raw: '{"protoPayload":{"serviceName":"iam.googleapis.com","methodName":"google.iam.admin.v1.CreateServiceAccountKey","authenticationInfo":{"principalEmail":"prod-data-admin@corp-prod.iam.gserviceaccount.com"},"requestMetadata":{"callerIp":"198.51.100.84"},"response":{"name":"projects/corp-prod/serviceAccounts/prod-data-admin@corp-prod.iam.gserviceaccount.com/keys/9f81a20b3c4d"}}}',
            parsedFields: {
              AuditLogStream: 'cloudaudit.googleapis.com/activity (Admin Activity)',
              MethodName: 'google.iam.admin.v1.CreateServiceAccountKey',
              CreatedKeyResource: 'keys/9f81a20b3c4d',
              CallerIp: '198.51.100.84',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: BigQuery Table Export & Query Exfiltration Attribution (JobInserted & totalBilledBytes)',
        narration:
          'Using the exported JSON key from 198.51.100.84, the actor queries BigQuery dataset corp_prod.customer_records. GCP BigQuery Audit Logs (bigquery.googleapis.com, methodName="jobservice.insert" / BigQueryAuditMetadata.JobInsertion) record the exact SQL query text, referencedTables, outputRowCount, and totalBilledBytes.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1530 - Data from Cloud Storage: BigQuery JobInserted)',
        technicalCommands: [
          'GCP BigQuery Audit: serviceName="bigquery.googleapis.com" methodName="google.cloud.bigquery.v2.JobService.InsertJob"',
          'metadata.jobChange.job.jobStats.queryStats.totalBilledBytes: "2147483648"',
          'metadata.jobChange.job.jobStats.queryStats.referencedTables: ["projects/corp-prod/datasets/finance/tables/ledger"]',
        ],
        defenseMitigation:
          'Place sensitive BigQuery datasets and Cloud Storage buckets inside a Google Cloud VPC Service Controls (VPC-SC) perimeter to block data access from external IPs even with a valid ServiceAccountKey.',
        logs: [
          {
            id: 'dfir-gcp-3',
            timestamp: '07:23:01.400',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'bq',
            CommandLine: 'GCP BigQuery InsertJob SELECT * FROM corp-prod.finance.ledger from 198.51.100.84',
            raw: '{"protoPayload":{"serviceName":"bigquery.googleapis.com","methodName":"google.cloud.bigquery.v2.JobService.InsertJob","authenticationInfo":{"principalEmail":"prod-data-admin@corp-prod.iam.gserviceaccount.com","serviceAccountKeyName":"//iam.googleapis.com/projects/corp-prod/serviceAccounts/prod-data-admin@corp-prod.iam.gserviceaccount.com/keys/9f81a20b3c4d"},"requestMetadata":{"callerIp":"198.51.100.84"},"metadata":{"jobChange":{"job":{"jobConfig":{"queryConfig":{"query":"SELECT * FROM `corp-prod.finance.ledger`"}},"jobStats":{"queryStats":{"totalBilledBytes":"2147483648"}}}}}}}',
            parsedFields: {
              ServiceName: 'bigquery.googleapis.com',
              AuthenticatedViaKey: 'keys/9f81a20b3c4d (User-Managed Key)',
              ReferencedTable: 'projects/corp-prod/datasets/finance/tables/ledger',
              TotalBilledBytes: '2,147,483,648 bytes (2.0 GB)',
            },
          },
        ],
      },
    ],
  };
