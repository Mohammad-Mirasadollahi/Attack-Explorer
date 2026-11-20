import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud research campus where an intruder uses a compromised junior badge to borrow the temporary voice of a senior data-warehouse account, uses that borrowed authority to stamp a permanent offline spare key at the badge kiosk, and then steps directly into the analytics warehouse to export entire confidential tables out to an external bucket.',
      storyMappings: [
        {
          storyTerm: 'Borrowing the temporary voice of a senior warehouse account',
          technicalTerm: 'Service Account impersonation via iamcredentials.googleapis.com GenerateAccessToken',
          tone: 'amber',
        },
        {
          storyTerm: 'Stamping a permanent offline spare key at the badge kiosk',
          technicalTerm: 'google.iam.admin.v1.CreateServiceAccountKey persisting access as a JSON key',
          tone: 'sky',
        },
        {
          storyTerm: 'Exporting entire confidential tables out of the analytics warehouse',
          technicalTerm: 'BigQuery JobInserted export and query exfiltration tracked by totalBilledBytes',
          tone: 'rose',
        },
        {
          storyTerm: 'Chained audit receipts proving the escalation path',
          technicalTerm: 'GCP Cloud Audit Logs correlating GenerateAccessToken, CreateServiceAccountKey, and BigQuery jobs',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Discovering that their starting badge holds token-borrowing rights over a higher-privilege warehouse service account, the intruder requests a short-lived impersonation pass from the cloud identity desk to step smoothly into the senior role.',
        storyMappings: [
          {
            storyTerm: 'Token-borrowing rights over a senior account',
            technicalTerm: 'roles/iam.serviceAccountTokenCreator binding on a privileged GCP service account',
            tone: 'amber',
          },
          {
            storyTerm: 'Requesting a short-lived impersonation pass',
            technicalTerm: 'API call iamcredentials.googleapis.com GenerateAccessToken logged in Data Access logs',
            tone: 'sky',
          },
          {
            storyTerm: 'Stepping smoothly into the senior role',
            technicalTerm: 'Short-lived OAuth2 bearer token inheriting all BigQuery and IAM rights of the target',
            tone: 'rose',
          },
          {
            storyTerm: 'Identity desk log recording the delegation',
            technicalTerm: 'GCP Audit Log authorizationInfo and requestMetadata.callerIp attribution',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To avoid losing access when the borrowed one-hour pass expires, the intruder uses their elevated privileges to print a permanent user-managed JSON key file that works indefinitely from any computer on the internet.',
        storyMappings: [
          {
            storyTerm: 'Printing a permanent JSON key file',
            technicalTerm: 'google.iam.admin.v1.CreateServiceAccountKey creating a user-managed private key',
            tone: 'amber',
          },
          {
            storyTerm: 'Working indefinitely from outside the cloud',
            technicalTerm: 'Persistent off-GCP credential immune to initial-access session revocation',
            tone: 'sky',
          },
          {
            storyTerm: 'Admin activity ledger recording the key birth',
            technicalTerm: 'Immutable GCP Admin Activity Log showing exact key ID and creator principal',
            tone: 'rose',
          },
          {
            storyTerm: 'Preventive campus rule blocking permanent keys',
            technicalTerm: 'Organization Policy constraints/iam.disableServiceAccountKeyCreation',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Signing straight into the analytics warehouse with the newly printed key, the intruder submits bulk extraction jobs that sweep entire customer datasets out of the vault while the warehouse metering log records every query and exact gigabyte moved.',
        storyMappings: [
          {
            storyTerm: 'Bulk extraction jobs sweeping customer datasets',
            technicalTerm: 'BigQuery table extract and SELECT * queries logged as JobInserted / JobCompleted',
            tone: 'amber',
          },
          {
            storyTerm: 'Warehouse metering log recording exact gigabytes moved',
            technicalTerm: 'BigQuery Data Access audit fields totalBilledBytes and referencedTables',
            tone: 'sky',
          },
          {
            storyTerm: 'External destination bucket receiving stolen tables',
            technicalTerm: 'Export job writing CSV/Parquet archives to an attacker-controlled GCS bucket',
            tone: 'rose',
          },
          {
            storyTerm: 'Forensic breach quantification',
            technicalTerm: 'Correlating serviceAccountKeyName across BigQuery job logs to list all exposed tables',
            tone: 'emerald',
          },
        ],
      },
    },
  };
