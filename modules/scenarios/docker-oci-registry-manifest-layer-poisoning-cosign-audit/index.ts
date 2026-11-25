import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'docker-oci-registry-manifest-layer-poisoning-cosign-audit',
    title: 'Sigstore Cosign, NIST SP 800-190 & MITRE — OCI Container Registry Layer Tampering & Image Digest Verification Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1525',
    description:
      'Grounded in NIST SP 800-190 (Application Container Security Guide), Sigstore Cosign / Notary v2 supply-chain specifications, and MITRE ATT&CK T1525 (Implant Internal Image): DFIR analysts investigate how an attacker with stolen OCI registry push tokens overwrites a mutable container image tag (:latest or :prod) with a backdoored layer blob (application/vnd.oci.image.layer.v1.tar+gzip) and how admission controllers verify immutable @sha256 digests and Cosign signatures.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Registry Push Token', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'OCI Container Registry (/v2/ API)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Mutable Tag (:prod Manifest Put)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Registry Audit & Sigstore Policy Controller', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Kubernetes Node containerd Image Pull', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Uploading Modified OCI Layer Blob via POST /v2/<repo>/blobs/uploads/',
        narration:
          'Using a compromised registry token with push scope, the actor uploads a modified filesystem layer tarball containing a trojanized entrypoint script to the OCI Distribution Spec API (POST /v2/corp/payment-api/blobs/uploads/).',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence (T1525 - Implant Internal Image)',
        technicalCommands: [
          'crane manifest registry.corp.local/corp/payment-api:prod | jq .',
          'cosign verify --key cosign.pub registry.corp.local/corp/payment-api:prod',
        ],
        defenseMitigation:
          'Enable Tag Immutability on enterprise container registries (AWS ECR, GCP Artifact Registry, Azure ACR, Harbor) so existing release tags cannot be overwritten.',
        logs: [
          {
            id: 'oci-1',
            timestamp: '18:40:10.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 201,
            ProcessName: 'registry',
            CommandLine: 'PUT /v2/corp/payment-api/blobs/uploads/uuid?digest=sha256:9f86d081884c7d659a2feaa0c55ad015',
            raw: 'oci_registry_audit: {"action":"blob.upload.complete","repository":"corp/payment-api","digest":"sha256:9f86d081884c7d659a2feaa0c55ad015","actor":"ci-registry-bot","clientIp":"198.51.100.73"}',
            parsedFields: {
              OciEndpoint: 'PUT /v2/corp/payment-api/blobs/uploads/',
              UploadedLayerDigest: 'sha256:9f86d081884c7d659a2feaa0c55ad015',
              RegistryActor: 'ci-registry-bot',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Overwriting Mutable Image Tag via PUT /v2/<repo>/manifests/prod',
        narration:
          'The actor submits PUT /v2/corp/payment-api/manifests/prod with Content-Type: application/vnd.oci.image.manifest.v1+json referencing the new layer digest, silently shifting the mutable :prod tag to a new manifest SHA-256.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion & Persistence (T1525 - Implant Internal Image)',
        technicalCommands: [
          'crane digest registry.corp.local/corp/payment-api:prod',
          'diff <(crane config registry.corp.local/corp/payment-api@sha256:old) <(crane config registry.corp.local/corp/payment-api@sha256:new)',
        ],
        defenseMitigation:
          'Reference container images in Kubernetes deployments strictly by immutable cryptographic digest (image: registry.corp.local/corp/payment-api@sha256:...) rather than mutable tags (:latest or :prod).',
        logs: [
          {
            id: 'oci-2',
            timestamp: '18:40:14.502',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'registry',
            CommandLine: 'PUT /v2/corp/payment-api/manifests/prod (PreviousDigest=sha256:1122..., NewDigest=sha256:deadbeef...)',
            raw: 'oci_registry_audit: {"action":"manifest.push","repository":"corp/payment-api","tag":"prod","previousDigest":"sha256:112233445566","newDigest":"sha256:deadbeef8899","signedByCosign":false}',
            parsedFields: {
              MutatedTag: 'corp/payment-api:prod',
              PreviousManifestDigest: 'sha256:112233445566',
              NewManifestDigest: 'sha256:deadbeef8899 (Unsigned)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Admission Controller Sigstore Cosign Signature Verification & Layer Diff Forensics',
        narration:
          'When a Kubernetes Deployment with imagePullPolicy: Always attempts to schedule the updated :prod tag, the Sigstore Policy Controller / Kyverno VerifyImages admission webhook checks the Rekor transparency log and Cosign signature (.sig), blocking the unsigned manifest.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Initial Access & Execution Prevention (T1525 - Implant Internal Image)',
        technicalCommands: [
          'kubectl get events -n prod --field-selector reason=PolicyViolation',
          'dive registry.corp.local/corp/payment-api@sha256:deadbeef8899 --ci',
        ],
        defenseMitigation:
          'Enforce Sigstore Cosign keyless OIDC signing in CI/CD and deploy Kyverno VerifyImages or Sigstore Policy Controller in Enforcing mode on all Kubernetes clusters.',
        logs: [
          {
            id: 'oci-3',
            timestamp: '18:41:02.310',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 403,
            ProcessName: 'policy-controller',
            CommandLine: 'admission webhook "policy.sigstore.dev" denied request: no matching signatures found for sha256:deadbeef8899',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"pods","namespace":"prod","name":"payment-api-rollout-9c1"},"responseStatus":{"code":403,"message":"admission webhook \\"policy.sigstore.dev\\" denied the request: validation failed: no matching signatures for registry.corp.local/corp/payment-api@sha256:deadbeef8899"}}',
            parsedFields: {
              AdmissionWebhook: 'policy.sigstore.dev (Sigstore Cosign / Kyverno)',
              RejectedDigest: 'sha256:deadbeef8899',
              EnforcementOutcome: 'HTTP 403 Forbidden (Unsigned Image Blocked)',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a central factory parts depot where finished software crates are stacked from numbered modular layers and labeled with movable shipping tags. A thief using a stolen warehouse push badge slips a tampered top layer onto the shelf and moves the floating production tag onto the poisoned stack, until the loading-dock cryptographic seal inspector detects the missing official wax stamp and blocks the tampered crate before it can enter the live factory floor.',
      storyMappings: [
        {
          storyTerm: 'Slipping a tampered modular layer onto the warehouse shelf',
          technicalTerm: 'Uploading trojanized OCI layer blob via POST /v2/<repo>/blobs/uploads/',
          tone: 'amber',
        },
        {
          storyTerm: 'Moving the floating production tag onto the poisoned stack',
          technicalTerm: 'Overwriting mutable :prod tag via PUT /v2/corp/payment-api/manifests/prod',
          tone: 'sky',
        },
        {
          storyTerm: 'Loading-dock cryptographic seal inspector',
          technicalTerm: 'Kubernetes Sigstore Policy Controller verifying Cosign image signatures',
          tone: 'rose',
        },
        {
          storyTerm: 'Missing official wax stamp blocking deployment',
          technicalTerm: 'Failed Cosign digest signature check halting tampered image rollout',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a stolen warehouse stocking pass, the thief wheels a freshly altered crate layer carrying hidden spy gear through the depot upload dock and registers its new fingerprint in the warehouse bin.',
        storyMappings: [
          {
            storyTerm: 'Stolen warehouse stocking pass',
            technicalTerm: 'Compromised OCI container registry token with repository push scope',
            tone: 'amber',
          },
          {
            storyTerm: 'Altered crate layer carrying hidden spy gear',
            technicalTerm: 'Trojanized filesystem layer tarball containing backdoored binaries',
            tone: 'sky',
          },
          {
            storyTerm: 'Depot upload dock',
            technicalTerm: 'OCI Distribution API POST /v2/<repo>/blobs/uploads/ endpoint',
            tone: 'rose',
          },
          {
            storyTerm: 'New fingerprint registered in the bin',
            technicalTerm: 'New SHA-256 content-addressable blob digest stored in the registry',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the thief drafts a brand-new packing list that replaces the clean top layer with the tampered layer and hangs the well-known movable production tag straight onto the poisoned packing list so automatic deliveries grab it next.',
        storyMappings: [
          {
            storyTerm: 'Brand-new packing list referencing the tampered layer',
            technicalTerm: 'OCI image manifest (application/vnd.oci.image.manifest.v1+json) listing the rogue digest',
            tone: 'amber',
          },
          {
            storyTerm: 'Movable production tag hung on the poisoned stack',
            technicalTerm: 'PUT /v2/corp/payment-api/manifests/prod overwriting mutable :prod tag',
            tone: 'sky',
          },
          {
            storyTerm: 'Automatic deliveries configured to pull the latest tag',
            technicalTerm: 'Kubernetes Deployments referencing mutable :prod with imagePullPolicy: Always',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean historical stack left unreferenced',
            technicalTerm: 'Original clean manifest digest replaced as the active tag target',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'When the live factory floor tries to pull the refreshed production crate, the loading-dock seal inspector checks the crate cryptographic wax stamp against the official builder ledger, immediately catches the forged unsealed stack, halts the shipment, and flags the exact swapped layer for forensic investigators.',
        storyMappings: [
          {
            storyTerm: 'Factory floor pulling the refreshed crate',
            technicalTerm: 'Kubernetes scheduling pods with imagePullPolicy: Always on :prod',
            tone: 'amber',
          },
          {
            storyTerm: 'Loading-dock seal inspector checking the wax stamp',
            technicalTerm: 'Sigstore Policy Controller validating Cosign signatures and Rekor transparency logs',
            tone: 'sky',
          },
          {
            storyTerm: 'Halting the unsealed shipment',
            technicalTerm: 'Admission rejection blocking deployment of the unsigned tampered digest',
            tone: 'rose',
          },
          {
            storyTerm: 'Flagging the exact swapped layer for investigators',
            technicalTerm: 'OCI manifest and layer diff forensics isolating the injected malicious blob',
            tone: 'emerald',
          },
        ],
      },
    },
  };
