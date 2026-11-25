import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud software factory whose automated build bay runs every submitted assembly job wearing a generously powered default factory badge that holds keys to both the artifact vault and the source storage warehouse. Submitting an ad-hoc build order containing one sneaky command, an intruder walks into the worker booth, reads the default factory badge straight off the wall metadata box, and uses it to raid both finished packages and private source archives.',
      storyMappings: [
        {
          storyTerm: 'Submitting an ad-hoc build order containing a sneaky command',
          technicalTerm: 'google.devtools.cloudbuild.v1.CloudBuild.CreateBuild ad-hoc job submission',
          tone: 'amber',
        },
        {
          storyTerm: 'Reading the default factory badge straight off the wall box',
          technicalTerm: 'Worker container querying metadata server for @cloudbuild.gserviceaccount.com OAuth token',
          tone: 'sky',
        },
        {
          storyTerm: 'Raiding finished packages and private source archives',
          technicalTerm: 'Unauthorized access to GCP Artifact Registry and Cloud Storage source buckets',
          tone: 'rose',
        },
        {
          storyTerm: 'Replacing the shared master badge with narrow per-job badges',
          technicalTerm: 'Enforcing user-specified least-privilege Cloud Build service accounts',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using compromised developer permissions that allow triggering builds, the intruder submits a quick custom assembly job straight to the cloud build queue carrying an inline shell step designed purely to harvest credentials.',
        storyMappings: [
          {
            storyTerm: 'Quick custom assembly job submitted directly',
            technicalTerm: 'gcloud builds submit invoking google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
            tone: 'amber',
          },
          {
            storyTerm: 'Inline shell step designed to harvest credentials',
            technicalTerm: 'Custom cloudbuild.yaml step executing curl against the local metadata endpoint',
            tone: 'sky',
          },
          {
            storyTerm: 'No source repository change required',
            technicalTerm: 'Ad-hoc build submission bypassing Git pull-request review and branch protections',
            tone: 'rose',
          },
          {
            storyTerm: 'Cloud audit ledger logging the ad-hoc job',
            technicalTerm: 'GCP Admin Activity Audit Log capturing CreateBuild parameters and caller',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The moment the automated build bay spins up the attacker worker container, the container taps the booth local metadata wall panel and lifts the live OAuth badge belonging to the overly privileged default Cloud Build service account.',
        storyMappings: [
          {
            storyTerm: 'Booth local metadata wall panel',
            technicalTerm: 'GCP instance metadata endpoint metadata.google.internal (Metadata-Flavor: Google)',
            tone: 'amber',
          },
          {
            storyTerm: 'Overly privileged default factory badge',
            technicalTerm: '<project-number>@cloudbuild.gserviceaccount.com OAuth2 access token',
            tone: 'sky',
          },
          {
            storyTerm: 'Sneaking the stolen badge out of the build bay',
            technicalTerm: 'Exfiltrating the live Bearer token via outbound HTTP or build logs',
            tone: 'rose',
          },
          {
            storyTerm: 'Privilege escalation from build submitter to builder',
            technicalTerm: 'Escalating from Cloud Build Editor to broad project deployment permissions',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Wielding the stolen default builder badge, the intruder opens both the finished-software Artifact Registry and the private Cloud Storage source archives to steal proprietary builds or plant tampered release images.',
        storyMappings: [
          {
            storyTerm: 'Finished-software Artifact Registry opened',
            technicalTerm: 'Pulling or pushing poisoned container images in GCP Artifact Registry',
            tone: 'amber',
          },
          {
            storyTerm: 'Private source archives accessed',
            technicalTerm: 'Reading Cloud Storage source staging buckets (_cloudbuild) via storage.objects.get',
            tone: 'sky',
          },
          {
            storyTerm: 'Data access trail attributing the raid',
            technicalTerm: 'GCP Audit Logs showing @cloudbuild.gserviceaccount.com used from external IPs',
            tone: 'rose',
          },
          {
            storyTerm: 'Hardening the factory against badge theft',
            technicalTerm: 'Disabling default Cloud Build SA and assigning custom least-privilege build SAs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
