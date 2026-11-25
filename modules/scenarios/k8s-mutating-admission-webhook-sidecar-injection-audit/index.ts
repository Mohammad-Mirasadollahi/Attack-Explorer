import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'k8s-mutating-admission-webhook-sidecar-injection-audit',
    title: 'Kubernetes Security Docs, Datadog & MITRE — Rogue MutatingWebhookConfiguration Pod Sidecar & Secret Capture Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1546',
    description:
      'Grounded in Kubernetes Dynamic Admission Control documentation, Datadog Cloud Security research, and MITRE ATT&CK T1546 (Event Triggered Execution): DFIR analysts investigate how a compromised identity with admissionregistration.k8s.io permissions registers a MutatingWebhookConfiguration or ValidatingWebhookConfiguration that intercepts CREATE requests for pods and secrets across the cluster.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Cluster Admin Role', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver Admission Chain', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MutatingWebhookConfiguration Object', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Kubernetes Audit Log & OPA Gatekeeper', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Cluster Pod Specs & Secret Payloads', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Creating a Cluster-Scoped MutatingWebhookConfiguration Targeting Pods & Secrets',
        narration:
          'Using admissionregistration.k8s.io/v1 permissions, the actor creates a MutatingWebhookConfiguration with rules matching operations: ["CREATE", "UPDATE"] on resources: ["pods", "secrets"] and failurePolicy: Ignore so cluster operations continue without errors.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1546 - Event Triggered Execution)',
        technicalCommands: [
          'kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations',
          'jq \'. | select(.objectRef.apiGroup=="admissionregistration.k8s.io")\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Audit and alert on every create, update, or patch operation against admissionregistration.k8s.io/v1 (mutatingwebhookconfigurations and validatingwebhookconfigurations) in Kubernetes Audit logs.',
        logs: [
          {
            id: 'k8s-mwc-1',
            timestamp: '15:18:03.220',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"apiGroup":"admissionregistration.k8s.io","resource":"mutatingwebhookconfigurations","name":"telemetry-sidecar-injector"},"requestObject":{"webhooks":[{"clientConfig":{"url":"https://198.51.100.210:8443/mutate"},"failurePolicy":"Ignore"}]}}',
            parsedFields: {
              ApiGroup: 'admissionregistration.k8s.io/v1',
              ResourceCreated: 'MutatingWebhookConfiguration/telemetry-sidecar-injector',
              WebhookCallbackUrl: 'https://198.51.100.210:8443/mutate',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: kube-apiserver Dispatching AdmissionReview Payloads Containing Secret Objects',
        narration:
          'Whenever any user or controller creates or updates a Secret or Pod, kube-apiserver serializes the full Kubernetes object inside an AdmissionReview JSON payload and POSTs it directly to the webhook clientConfig.url.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.007 - Container API)',
        technicalCommands: [
          'kubectl get mutatingwebhookconfigurations telemetry-sidecar-injector -o jsonpath="{.webhooks[*].clientConfig}"',
          'ss -tnp | grep kube-apiserver',
        ],
        defenseMitigation:
          'Restrict kube-apiserver egress traffic so the control plane can only reach approved in-cluster webhook services and never arbitrary external IP addresses.',
        logs: [
          {
            id: 'k8s-mwc-2',
            timestamp: '15:19:14.705',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'AdmissionReview POST to webhook telemetry-sidecar-injector for resource=secrets',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"secrets","namespace":"prod","name":"db-credentials"},"annotations":{"mutation.webhook.admission.k8s.io/round_0_index_0":"configuration=telemetry-sidecar-injector,webhook=sidecar.corp.local,mutated=false"}}',
            parsedFields: {
              AuditAnnotation: 'mutation.webhook.admission.k8s.io/round_0_index_0',
              InterceptedResource: 'Secret prod/db-credentials',
              WebhookName: 'telemetry-sidecar-injector',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: JSONPatch Pod Mutation (Sidecar Injection) & Webhook Deletion Remediation',
        narration:
          'For Pod creation requests, the webhook returns an AdmissionResponse with patchType: JSONPatch that appends a sidecar container or environment variable into spec.containers, recorded in the pod audit annotations (mutated=true).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1610 - Deploy Container)',
        technicalCommands: [
          'jq \'. | select(.annotations."mutation.webhook.admission.k8s.io/round_0_index_0" | contains("mutated=true"))\' /var/log/kubernetes/audit.log',
          'kubectl delete mutatingwebhookconfiguration telemetry-sidecar-injector',
        ],
        defenseMitigation:
          'Monitor Kubernetes Audit annotations (mutation.webhook.admission.k8s.io/*) for unexpected webhook mutations and enforce GitOps reconciliation on cluster-scoped admission configurations.',
        logs: [
          {
            id: 'k8s-mwc-3',
            timestamp: '15:20:01.119',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'Pod prod/api-server-6d4 mutated by webhook telemetry-sidecar-injector (JSONPatch)',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"pods","namespace":"prod","name":"api-server-6d4"},"annotations":{"mutation.webhook.admission.k8s.io/round_0_index_0":"configuration=telemetry-sidecar-injector,mutated=true"}}',
            parsedFields: {
              MutatedPod: 'prod/api-server-6d4',
              PatchMechanism: 'AdmissionResponse JSONPatch (spec.containers)',
              RemediationCommand: 'kubectl delete mutatingwebhookconfiguration telemetry-sidecar-injector',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a central bank mailroom where every newly hired employee and every sealed secret pouch must pass through an official inspection counter before entering the building. An intruder registers a brand-new unauthorized inspection counter right on the main belt so the mailroom automatically hands them copies of every sealed secret pouch and allows them to slip a silent spy passenger into every new delivery truck rolling onto the floor.',
      storyMappings: [
        {
          storyTerm: 'Registering an unauthorized inspection counter on the belt',
          technicalTerm: 'Creating a cluster-scoped MutatingWebhookConfiguration targeting Pods and Secrets',
          tone: 'amber',
        },
        {
          storyTerm: 'Mailroom handing copies of every sealed secret pouch across the desk',
          technicalTerm: 'kube-apiserver dispatching serialized Secret objects in AdmissionReview JSON',
          tone: 'sky',
        },
        {
          storyTerm: 'Slipping a silent spy passenger into every new delivery truck',
          technicalTerm: 'AdmissionResponse JSONPatch injecting a malicious sidecar container into new Pods',
          tone: 'rose',
        },
        {
          storyTerm: 'Dismantling the rogue counter',
          technicalTerm: 'Auditing and deleting unauthorized MutatingWebhookConfiguration objects',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Wielding high-level registration rights, the intruder bolts a rogue review booth directly onto the building central intake conveyor, declaring that every new delivery vehicle and every sealed secret envelope must stop at their booth first.',
        storyMappings: [
          {
            storyTerm: 'High-level registration rights',
            technicalTerm: 'admissionregistration.k8s.io/v1 RBAC permissions to create webhooks',
            tone: 'amber',
          },
          {
            storyTerm: 'Rogue review booth bolted onto the conveyor',
            technicalTerm: 'Cluster-scoped MutatingWebhookConfiguration pointing to an attacker endpoint',
            tone: 'sky',
          },
          {
            storyTerm: 'Stopping every vehicle and secret envelope',
            technicalTerm: 'Webhook rules matching CREATE and UPDATE operations on Pods and Secrets',
            tone: 'rose',
          },
          {
            storyTerm: 'Central intake conveyor',
            technicalTerm: 'Kubernetes kube-apiserver admission controller pipeline',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'From that moment onward, whenever any department files a brand-new vault combination or schedules a truck, the obedient front-desk dispatcher places the entire unsealed package onto the intruder counter for inspection, letting the intruder copy every secret silently.',
        storyMappings: [
          {
            storyTerm: 'Obedient front-desk dispatcher',
            technicalTerm: 'kube-apiserver forwarding AdmissionReview payloads over HTTPS',
            tone: 'amber',
          },
          {
            storyTerm: 'Entire unsealed package placed on the counter',
            technicalTerm: 'Full base64-encoded Kubernetes Secret objects serialized inside AdmissionReview JSON',
            tone: 'sky',
          },
          {
            storyTerm: 'Copying every secret silently',
            technicalTerm: 'Passive cluster-wide credential harvesting without alerting normal users',
            tone: 'rose',
          },
          {
            storyTerm: 'Normal approvals continuing smoothly',
            technicalTerm: 'Webhook returning allowed: true so cluster operations remain uninterrupted',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'For every new delivery truck rolling down the belt, the rogue booth stamps back a subtle modification slip that welds an uninvited extra stowaway compartment onto the chassis, giving the intruder a persistent rider inside newly launched workloads until defenders tear out the rogue booth.',
        storyMappings: [
          {
            storyTerm: 'Subtle modification slip returned by the booth',
            technicalTerm: 'AdmissionResponse specifying patchType: JSONPatch',
            tone: 'amber',
          },
          {
            storyTerm: 'Welding a stowaway compartment onto the chassis',
            technicalTerm: 'Injecting a rogue sidecar container or malicious environment variables into Pods',
            tone: 'sky',
          },
          {
            storyTerm: 'Persistent rider across fresh deployments',
            technicalTerm: 'Self-healing cluster persistence surviving individual pod deletions',
            tone: 'rose',
          },
          {
            storyTerm: 'Tearing out the rogue booth',
            technicalTerm: 'Deleting the malicious MutatingWebhookConfiguration and rotating exposed Secrets',
            tone: 'emerald',
          },
        ],
      },
    },
  };
