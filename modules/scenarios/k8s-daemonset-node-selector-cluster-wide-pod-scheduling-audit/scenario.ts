import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit',
    title: 'NSA/CISA Kubernetes Hardening Guide, Microsoft & MITRE — Cluster-Wide Malicious DaemonSet Scheduling & Node RootFS Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1610',
    description:
      'Grounded in the NSA/CISA Kubernetes Hardening Guide, Microsoft Defender for Containers threat matrix, and MITRE ATT&CK T1610: DFIR analysts investigate how a compromised controller or ServiceAccount with apps/v1 daemonsets create permissions deploys a DaemonSet with operator: Exists tolerations so the Kubernetes scheduler automatically launches a privileged pod on every worker and control-plane node.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Namespace ServiceAccount', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver (/apis/apps/v1/daemonsets)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'kube-scheduler & DaemonSet Controller', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit Log & Defender for Containers', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'All Cluster Worker & Control-Plane Nodes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Creating an apps/v1 DaemonSet with Wildcard Tolerations (operator: Exists)',
        narration:
          'The actor submits POST /apis/apps/v1/namespaces/kube-system/daemonsets containing spec.template.spec.tolerations: [{operator: "Exists"}] so the DaemonSet bypasses node-role.kubernetes.io/control-plane:NoSchedule taints.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution & Persistence (T1610 - Deploy Container)',
        technicalCommands: [
          'kubectl get daemonsets --all-namespaces -o wide',
          'jq \'. | select(.objectRef.resource=="daemonsets" and .verb=="create")\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Remove daemonsets create/update permissions from workload ServiceAccounts and enforce Kyverno/OPA policies blocking wildcard NoSchedule tolerations outside approved system controllers.',
        logs: [
          {
            id: 'k8s-ds-1',
            timestamp: '16:05:12.310',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /apis/apps/v1/namespaces/kube-system/daemonsets (name=node-log-sync)',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","user":{"username":"system:serviceaccount:monitoring:prom-operator"},"objectRef":{"apiGroup":"apps","resource":"daemonsets","namespace":"kube-system","name":"node-log-sync"},"responseStatus":{"code":201}}',
            parsedFields: {
              ResourceType: 'apps/v1 DaemonSet (kube-system/node-log-sync)',
              TaintToleration: 'tolerations: [{operator: "Exists"}] (Includes Control-Plane Nodes)',
              CreatorIdentity: 'system:serviceaccount:monitoring:prom-operator',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: DaemonSet Controller Scheduling Pods with hostNetwork, hostPID & hostPath Across All Nodes',
        narration:
          'The DaemonSet controller reconciles the new specification and spawns node-log-sync-<hash> pods on every node in the cluster with hostNetwork: true, hostPID: true, and a hostPath volume mounting /var/log and /etc.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1610 - Deploy Container)',
        technicalCommands: [
          'kubectl get pods -n kube-system -l app=node-log-sync -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,HOSTNET:.spec.hostNetwork',
          'kubectl describe daemonset node-log-sync -n kube-system',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Admission (PSA) Restricted or Baseline labels on namespaces to reject pods requesting hostNetwork, hostPID, or hostPath volumes.',
        logs: [
          {
            id: 'k8s-ds-2',
            timestamp: '16:05:14.802',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-controller-manager',
            CommandLine: 'DaemonSet controller creating pod kube-system/node-log-sync-x9k2p on control-plane-01',
            raw: 'k8s_audit: {"kind":"Event","verb":"create","user":{"username":"system:serviceaccount:kube-system:daemon-set-controller"},"objectRef":{"resource":"pods","namespace":"kube-system","name":"node-log-sync-x9k2p"},"requestObject":{"spec":{"nodeName":"control-plane-01","hostPID":true,"hostNetwork":true}}}',
            parsedFields: {
              ControllerActor: 'system:serviceaccount:kube-system:daemon-set-controller',
              ScheduledNode: 'control-plane-01',
              PodSecuritySpec: 'hostPID=true, hostNetwork=true, hostPath=/etc',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Control-Plane Static Pod Manifest (/etc/kubernetes/manifests) Inspection & DaemonSet Purge',
        narration:
          'Running on the control-plane node with /etc mounted, the DaemonSet pod inspects /etc/kubernetes/manifests/ and /etc/kubernetes/pki/. Defenders delete the DaemonSet and audit static pod manifests for unauthorized modifications.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'kubectl delete daemonset node-log-sync -n kube-system',
          'sha256sum /etc/kubernetes/manifests/*.yaml',
        ],
        defenseMitigation:
          'Monitor /etc/kubernetes/manifests/ and /etc/kubernetes/pki/ with host FIM (auditd / Falco) and prevent workload ServiceAccounts from deploying into kube-system.',
        logs: [
          {
            id: 'k8s-ds-3',
            timestamp: '16:05:19.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'cat',
            CommandLine: 'Reading /host/etc/kubernetes/manifests/kube-apiserver.yaml from DaemonSet container',
            raw: 'falco_alert: Priority=CRITICAL Rule="Read Sensitive File Untrusted" proc.cmdline="cat /host/etc/kubernetes/manifests/kube-apiserver.yaml" k8s.pod.name="node-log-sync-x9k2p"',
            parsedFields: {
              AccessedControlPlanePath: '/etc/kubernetes/manifests/kube-apiserver.yaml',
              SourcePod: 'kube-system/node-log-sync-x9k2p',
              FalcoRule: 'Read Sensitive File Untrusted',
            },
          },
        ],
      },
    ],
  };
