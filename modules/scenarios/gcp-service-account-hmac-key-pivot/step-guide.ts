import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'gcp-service-account-hmac-key-pivot',
    briefing: {
      headline: 'Scenario Briefing: GCP Service Account Privilege Escalation, iam.serviceAccountKeys.create & Default Compute Editor Pivot',
      storyAnalogy:
        'Imagine a cloud office building (GCP Project) where every virtual machine comes with a default janitor robot (<project-number>-compute@developer.gserviceaccount.com) that was accidentally given a master key to every room in the building (roles/editor). A contractor (ci-runner service account) doesn’t have access to the financial vault (gs://corp-financial-ledger-prod), but their badge allows them to print new ID cards for any robot in the building (iam.serviceAccountKeys.create). The contractor walks up to the card printer (iam.googleapis.com), prints a brand-new JSON private key card (loot_key.json) in the name of the Editor janitor robot, puts on that card, and empties the financial vault!',
      plainSummary:
        'Synthesizing research by Mandiant (Google Cloud Threat Intelligence), Wiz Research, and Rhino Security Labs, this scenario models the classic Google Cloud Platform (GCP) IAM privilege escalation chain abusing iam.serviceAccountKeys.create (or iam.serviceAccounts.actAs) against the over-privileged Default Compute Engine Service Account (<project-number>-compute@developer.gserviceaccount.com). Because GCP projects historically granted the Default Compute Service Account the broad primitive role roles/editor, any identity with project-wide Service Account Key Admin permissions can mint a persistent user-managed RSA private key JSON file for that account and inherit full read/write control over Cloud Storage (GCS) and BigQuery.',
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
          'Documented by Google Cloud Audit Logs: google.iam.admin.v1.ListServiceAccounts called from an external non-GCP IP address (198.51.100.73).',
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
          'Documented by Google Cloud SCC & Mandiant: Admin Activity Audit Log google.iam.admin.v1.CreateServiceAccountKey where principalEmail != resourceName.',
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
          'Documented by Mandiant & Google Cloud SCC: Data Access Audit Log storage.objects.get by *-compute@developer.gserviceaccount.com with non-empty authenticationInfo.serviceAccountKeyName from an external IP.',
      },
    ],
  };
