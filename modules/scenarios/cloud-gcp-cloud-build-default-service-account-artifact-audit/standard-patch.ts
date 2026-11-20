import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
