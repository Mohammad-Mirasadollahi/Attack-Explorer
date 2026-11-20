import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'k8s-ephemeral-debug-container-process-namespace-share-audit',
    title: 'Kubernetes Official Docs, Falco Security & MITRE — Ephemeral Debug Container (kubectl debug) Shared Process Namespace Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1609',
    description:
      'Grounded in Kubernetes Ephemeral Containers documentation, CNCF Falco runtime security rules, and MITRE ATT&CK T1609 (Container Administration Command): DFIR analysts investigate how an attacker with pods/ephemeralcontainers patch permissions invokes kubectl debug --target=<container> to attach an ephemeral container into a running distroless production pod and read target process memory and environment secrets via /proc/<pid>/environ and /proc/<pid>/root.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Developer Kubeconfig', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver (pods/ephemeralcontainers)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Ephemeral Debug Container (debugger-*)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Target App Process (/proc/1/environ)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Subresource PATCH Against /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers',
        narration:
          'Even when a production pod uses a hardened distroless image with no shell (/bin/sh removed), an identity with pods/ephemeralcontainers permissions can run kubectl debug -it <pod> --image=busybox --target=app to inject an interactive ephemeral container into the running pod.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution (T1609 - Container Administration Command)',
        technicalCommands: [
          'jq \'. | select(.objectRef.subresource=="ephemeralcontainers")\' /var/log/kubernetes/audit.log',
          'kubectl get pod payment-service-5c8 -n prod -o jsonpath="{.spec.ephemeralContainers}"',
        ],
        defenseMitigation:
          'Separate pods/ephemeralcontainers RBAC permissions from standard developer roles and require break-glass approval or admission policy checks before allowing ephemeral container attachment in production.',
        logs: [
          {
            id: 'k8s-ephem-1',
            timestamp: '17:30:11.204',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'PATCH /api/v1/namespaces/prod/pods/payment-service-5c8/ephemeralcontainers',
            raw: 'k8s_audit: {"kind":"Event","verb":"patch","user":{"username":"dev-oncall@corp.local"},"objectRef":{"resource":"pods","subresource":"ephemeralcontainers","namespace":"prod","name":"payment-service-5c8"},"requestObject":{"spec":{"ephemeralContainers":[{"name":"debugger-8x2lq","image":"nicolaka/netshoot","targetContainerName":"payment-app"}]}}}',
            parsedFields: {
              TargetSubresource: 'pods/ephemeralcontainers',
              InjectedEphemeralContainer: 'debugger-8x2lq (image: nicolaka/netshoot)',
              TargetContainerName: 'payment-app',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Process Namespace Targeting (--target) & Reading /proc/<pid>/environ Secrets',
        narration:
          'Because targetContainerName="payment-app" instructs the container runtime (containerd) to join the ephemeral container to the target container PID namespace, the ephemeral shell can directly read /proc/1/environ and /proc/1/root/app/config.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Files / ProcFS)',
        technicalCommands: [
          'ausearch -f /proc/1/environ -i',
          'kubectl describe pod payment-service-5c8 -n prod',
        ],
        defenseMitigation:
          'Deploy Kyverno / OPA Gatekeeper policies restricting spec.ephemeralContainers images to signed internal diagnostic images and alert via Falco whenever an ephemeral container reads /proc/*/environ or /proc/*/mem.',
        logs: [
          {
            id: 'k8s-ephem-2',
            timestamp: '17:30:18.610',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'cat',
            CommandLine: 'tr "\\0" "\\n" < /proc/1/environ (inside ephemeral container debugger-8x2lq)',
            raw: 'falco_alert: Priority=WARNING Rule="Ephemeral Container Created and ProcFS Secret Read" container.name="debugger-8x2lq" k8s.pod.name="payment-service-5c8" fd.name="/proc/1/environ"',
            parsedFields: {
              EphemeralContainer: 'debugger-8x2lq',
              AccessedProcFsPath: '/proc/1/environ & /proc/1/root/',
              SharedNamespace: 'Target Container PID Namespace (payment-app)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Interactive SPDY/WebSocket pods/attach Session Audit & Pod Rollout Replacement',
        narration:
          'Because Kubernetes ephemeral containers cannot be removed from a running Pod once added (spec.ephemeralContainers is append-only), defenders terminate the pods/attach stream and replace the Pod via kubectl rollout restart.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Collection & Command and Control (T1609 - Container Administration Command)',
        technicalCommands: [
          'jq \'. | select(.objectRef.subresource=="attach" and .objectRef.name=="payment-service-5c8")\' /var/log/kubernetes/audit.log',
          'kubectl delete pod payment-service-5c8 -n prod',
        ],
        defenseMitigation:
          'Alert on correlated pods/ephemeralcontainers PATCH followed by pods/attach CREATE in Kubernetes Audit logs, and immediately recycle any production Pod that has an unexpected entry in status.ephemeralContainerStatuses.',
        logs: [
          {
            id: 'k8s-ephem-3',
            timestamp: '17:30:22.905',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 101,
            ProcessName: 'kube-apiserver',
            CommandLine: 'CREATE /api/v1/namespaces/prod/pods/payment-service-5c8/attach?container=debugger-8x2lq',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","objectRef":{"resource":"pods","subresource":"attach","namespace":"prod","name":"payment-service-5c8"},"responseStatus":{"code":101}}',
            parsedFields: {
              AttachSubresource: 'pods/attach (container=debugger-8x2lq)',
              HttpResponseCode: '101 Switching Protocols (SPDY/WebSocket)',
              RemediationAction: 'Delete & recreate Pod to clear ephemeralContainers',
            },
          },
        ],
      },
    ],
  };
