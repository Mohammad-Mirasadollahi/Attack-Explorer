import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
