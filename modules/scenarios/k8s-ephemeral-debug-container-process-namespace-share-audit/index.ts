import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an armored cash-transport van engineered with zero interior door handles and zero toolboxes so nobody can operate inside it. Using a special roadside-mechanic pass, an intruder bolts a temporary diagnostic side cabin directly onto the armored van shared interior cabin, reads every secret vault note taped beside the driver seat, and leaves a permanent weld scar that forces the bank to retire and replace the entire vehicle.',
      storyMappings: [
        {
          storyTerm: 'Armored cash van with zero door handles or toolboxes',
          technicalTerm: 'Hardened distroless production container lacking /bin/sh or utilities',
          tone: 'amber',
        },
        {
          storyTerm: 'Bolting a temporary diagnostic side cabin onto the van',
          technicalTerm: 'PATCH /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers (kubectl debug)',
          tone: 'sky',
        },
        {
          storyTerm: 'Reading secret notes taped beside the driver seat',
          technicalTerm: 'Process namespace sharing (--target) reading /proc/<pid>/environ secrets',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanent weld scar forcing full vehicle replacement',
          technicalTerm: 'Append-only spec.ephemeralContainers requiring full Pod rollout replacement',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Even though the armored payments van carries no shell or repair tools inside its cabin, the intruder flashes a specialized roadside-debug permit to weld a fully equipped temporary service booth straight onto the live moving vehicle.',
        storyMappings: [
          {
            storyTerm: 'Armored payments van with no shell or tools',
            technicalTerm: 'Hardened distroless production pod with /bin/sh removed',
            tone: 'amber',
          },
          {
            storyTerm: 'Specialized roadside-debug permit',
            technicalTerm: 'RBAC permission on pods/ephemeralcontainers subresource',
            tone: 'sky',
          },
          {
            storyTerm: 'Welding a temporary service booth onto the live van',
            technicalTerm: 'PATCH request creating an ephemeral debug container via kubectl debug',
            tone: 'rose',
          },
          {
            storyTerm: 'Live vehicle continuing down the highway',
            technicalTerm: 'Running production pod mutated without restarting the target app',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Linking the temporary service booth directly into the main driver cabin wall, the intruder reaches straight into the active driver workspace and photocopies every live vault key and database password taped inside memory.',
        storyMappings: [
          {
            storyTerm: 'Linking directly into the main driver cabin wall',
            technicalTerm: 'targetContainerName="payment-app" sharing the PID namespace via containerd',
            tone: 'amber',
          },
          {
            storyTerm: 'Active driver workspace',
            technicalTerm: 'Target application process space visible under /proc/<pid>/',
            tone: 'sky',
          },
          {
            storyTerm: 'Vault keys and database passwords taped inside',
            technicalTerm: 'Runtime secrets harvested from /proc/<pid>/environ and open file descriptors',
            tone: 'rose',
          },
          {
            storyTerm: 'Tools brought along inside the service booth',
            technicalTerm: 'Attacker-chosen debug container image carrying shells and forensic utilities',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because the bolted-on diagnostic booth can never be unbolted while the armored van remains on the road, investigators audit the live radio session log and dispatch a clean replacement van while retiring the compromised vehicle completely.',
        storyMappings: [
          {
            storyTerm: 'Diagnostic booth that can never be unbolted on the road',
            technicalTerm: 'Immutable append-only spec.ephemeralContainers array on a running Pod',
            tone: 'amber',
          },
          {
            storyTerm: 'Live radio session log',
            technicalTerm: 'Kubernetes Audit logs recording interactive SPDY/WebSocket pods/attach sessions',
            tone: 'sky',
          },
          {
            storyTerm: 'Dispatching a clean replacement van',
            technicalTerm: 'Full Pod eviction and clean Deployment rollout replacement',
            tone: 'rose',
          },
          {
            storyTerm: 'Locking down roadside-debug permits',
            technicalTerm: 'Restricting RBAC access to pods/ephemeralcontainers and pods/attach',
            tone: 'emerald',
          },
        ],
      },
    },
  };
