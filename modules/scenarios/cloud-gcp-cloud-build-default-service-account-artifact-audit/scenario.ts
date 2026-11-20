import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-gcp-cloud-build-default-service-account-artifact-audit',
    title: 'Google Cloud Security, Wiz & MITRE — GCP Cloud Build Default Service Account & Artifact Registry Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1078.004',
    description:
      'Grounded in Google Cloud Security best practices, Wiz Research on Cloud Build privilege escalation, and MITRE ATT&CK T1078.004: DFIR analysts investigate how a principal with cloudbuild.builds.create permission submits a Cloud Build job that runs on the Cloud Build VM worker pool and queries 169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token to inherit the high-privilege <project-number>@cloudbuild.gserviceaccount.com token.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Developer Role (cloudbuild.builds.create)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GCP Cloud Build API (builds.create)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Cloud Build Worker Metadata Server', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'GCP Cloud Audit Logs & SCC', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Artifact Registry & GCS Storage Buckets', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Submitting Ad-Hoc Cloud Build Job via google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
        narration:
          'A compromised identity holding roles/cloudbuild.builds.editor (or cloudbuild.builds.create) submits an inline cloudbuild.yaml build step via gcloud builds submit, recorded in GCP Admin Activity Cloud Audit Logs.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution (T1648 - Serverless Execution)',
        technicalCommands: [
          'gcloud logging read \'protoPayload.methodName="google.devtools.cloudbuild.v1.CloudBuild.CreateBuild"\' --limit=10',
          'gcloud builds describe <build-id>',
        ],
        defenseMitigation:
          'Disable the legacy default Cloud Build Service Account privilege assignment via Organization Policy constraints/cloudbuild.useBuildServiceAccount and require user-specified least-privilege service accounts per build trigger.',
        logs: [
          {
            id: 'gcp-cb-1',
            timestamp: '17:01:12.309',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'cloudbuild.googleapis.com',
            CommandLine: 'google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
            raw: 'gcp_audit: {"protoPayload":{"serviceName":"cloudbuild.googleapis.com","methodName":"google.devtools.cloudbuild.v1.CloudBuild.CreateBuild","authenticationInfo":{"principalEmail":"dev-ci-user@corp-prod-01.iam.gserviceaccount.com"}}}',
            parsedFields: {
              GcpService: 'cloudbuild.googleapis.com',
              MethodName: 'google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
              CallerPrincipal: 'dev-ci-user@corp-prod-01.iam.gserviceaccount.com',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Worker Container Metadata Query for @cloudbuild.gserviceaccount.com OAuth2 Token',
        narration:
          'Inside the Cloud Build step container, the build command queries http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token (with header Metadata-Flavor: Google) to retrieve the OAuth2 access token of <project-number>@cloudbuild.gserviceaccount.com.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1552.005 - Cloud Instance Metadata API)',
        technicalCommands: [
          'gcloud projects get-iam-policy corp-prod-01 --flatten="bindings[].members" --filter="bindings.members:cloudbuild.gserviceaccount.com"',
          'gcloud logging read \'resource.type="build"\' --limit=20',
        ],
        defenseMitigation:
          'Remove broad roles/editor or roles/cloudbuild.builds.builder permissions from the default <project-number>@cloudbuild.gserviceaccount.com identity and enforce VPC Service Controls around Cloud Build worker pools.',
        logs: [
          {
            id: 'gcp-cb-2',
            timestamp: '17:01:28.640',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'curl',
            CommandLine: 'curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
            raw: 'cloudbuild_step: {"buildId":"b8f9102a-3344-5566-7788-99aabbccddee","stepName":"gcr.io/cloud-builders/gcloud","status":"SUCCESS","serviceAccountEmail":"445566778899@cloudbuild.gserviceaccount.com"}',
            parsedFields: {
              MetadataEndpoint: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
              InheritedIdentity: '445566778899@cloudbuild.gserviceaccount.com',
              BuildStepImage: 'gcr.io/cloud-builders/gcloud',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Artifact Registry & Cloud Storage Source Archive Access Audit',
        narration:
          'Using the Cloud Build service account token, the actor reads container images in Artifact Registry and staging archives in gs://<project>_cloudbuild/source/, logged in GCP Data Access Audit Logs.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection (T1530 - Data from Cloud Storage)',
        technicalCommands: [
          'gcloud logging read \'protoPayload.authenticationInfo.principalEmail="445566778899@cloudbuild.gserviceaccount.com" AND logName:"cloudaudit.googleapis.com%2Fdata_access"\'',
          'gcloud iam service-accounts disable 445566778899@cloudbuild.gserviceaccount.com',
        ],
        defenseMitigation:
          'Enable GCP Data Access Audit Logs (DATA_READ / DATA_WRITE) for Cloud Storage and Artifact Registry and monitor Security Command Center (SCC) for anomalous Cloud Build Service Account calls from outside Google IP space.',
        logs: [
          {
            id: 'gcp-cb-3',
            timestamp: '17:01:45.112',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'storage.googleapis.com',
            CommandLine: 'storage.objects.get on buckets/corp-prod-01_cloudbuild/objects/source/archive.tgz',
            raw: 'gcp_data_access: {"protoPayload":{"serviceName":"storage.googleapis.com","methodName":"storage.objects.get","resourceName":"projects/_/buckets/corp-prod-01_cloudbuild/objects/source/1763312400.tgz","authenticationInfo":{"principalEmail":"445566778899@cloudbuild.gserviceaccount.com"}}}',
            parsedFields: {
              AuditLogStream: 'cloudaudit.googleapis.com/data_access',
              MethodName: 'storage.objects.get',
              TargetBucketObject: 'gs://corp-prod-01_cloudbuild/source/1763312400.tgz',
            },
          },
        ],
      },
    ],
  };
