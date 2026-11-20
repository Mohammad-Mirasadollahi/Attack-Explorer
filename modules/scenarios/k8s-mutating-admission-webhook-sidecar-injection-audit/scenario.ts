import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
