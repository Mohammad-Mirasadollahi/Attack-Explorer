import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape',
    title: 'NSA/CISA Kubernetes Guide & CNCF Falco DFIR — Kubernetes Audit Log Privileged Pod & hostPath Container Escape',
    category: 'CLOUD_SAAS',
    mitreId: 'T1611',
    description:
      'Grounded in the NSA/CISA Kubernetes Hardening Guidance, Official Kubernetes Auditing Documentation, and CNCF Falco eBPF runtime security rules: an attacker with a compromised ServiceAccount token creates a privileged pod mounting the worker node root filesystem (hostPath: / and hostPID: true), logged in the Kubernetes API Server audit.log (ObjectRef Resource="pods" Subresource="" Verb="create"), and uses nsenter -t 1 -m -u -i -n to enter the host OS namespaces.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Stolen ServiceAccount Token', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-apiserver (audit.log)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Privileged Pod (hostPath: /)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'K8s Audit & Falco eBPF Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Worker Node Host PID 1 (nsenter)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ServiceAccount RBAC SelfSubjectRulesReview Reconnaissance in kube-apiserver audit.log',
        narration:
          'After compromising an application pod, the actor reads /var/run/secrets/kubernetes.io/serviceaccount/token and queries POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews (kubectl auth can-i --list). The Kubernetes API Server audit log records the exact user.username (system:serviceaccount:cicd:runner-sa), sourceIPs, and userAgent.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Discovery (T1613 - Container and Resource Discovery: K8s RBAC Enumeration)',
        technicalCommands: [
          'K8s Audit Event: apiVersion="audit.k8s.io/v1" verb="create" resource="selfsubjectrulesreviews"',
          'user.username: "system:serviceaccount:cicd:runner-sa"',
          'responseStatus.code: 201 (Reveals verbs=["create","get","list"] on resource="pods")',
        ],
        defenseMitigation:
          'Set automountServiceAccountToken: false on pods that do not require Kubernetes API access and enforce least-privilege RBAC Roles instead of ClusterAdmin bindings.',
        logs: [
          {
            id: 'dfir-k8s-1',
            timestamp: '11:02:14.112',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews by system:serviceaccount:cicd:runner-sa',
            raw: '{"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","auditID":"91a2b3c4","stage":"ResponseComplete","requestURI":"/apis/authorization.k8s.io/v1/selfsubjectrulesreviews","verb":"create","user":{"username":"system:serviceaccount:cicd:runner-sa"},"sourceIPs":["10.244.1.18"],"responseStatus":{"code":201}}',
            parsedFields: {
              LogSource: 'Kubernetes API Server Audit Log (audit.k8s.io/v1)',
              RequestUri: '/apis/authorization.k8s.io/v1/selfsubjectrulesreviews',
              Principal: 'system:serviceaccount:cicd:runner-sa',
              SourcePodIp: '10.244.1.18',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Privileged Pod Creation with hostPID: true & hostPath: / (K8s Audit RequestObject)',
        narration:
          'The actor submits POST /api/v1/namespaces/cicd/pods creating a pod named node-debug-helper with securityContext.privileged=true, hostPID=true, and a volume mount with hostPath.path="/". At the RequestResponse audit level, kube-apiserver logs the complete requestObject JSON specification.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host: Privileged Pod & hostPath Mount)',
        technicalCommands: [
          'K8s Audit Event: requestURI="/api/v1/namespaces/cicd/pods" verb="create" responseStatus.code=201',
          'requestObject.spec.hostPID: true | requestObject.spec.hostNetwork: true',
          'requestObject.spec.containers[0].securityContext.privileged: true | volumes[0].hostPath.path: "/"',
        ],
        defenseMitigation:
          'Enforce Kubernetes Pod Security Admission (PSA) with the "baseline" or "restricted" profile to block privileged: true, hostPID: true, and hostPath volumes at admission time.',
        logs: [
          {
            id: 'dfir-k8s-2',
            timestamp: '11:02:19.504',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 201,
            ProcessName: 'kube-apiserver',
            CommandLine: 'POST /api/v1/namespaces/cicd/pods (node-debug-helper privileged=true hostPath=/)',
            raw: '{"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","requestURI":"/api/v1/namespaces/cicd/pods","verb":"create","user":{"username":"system:serviceaccount:cicd:runner-sa"},"objectRef":{"resource":"pods","namespace":"cicd","name":"node-debug-helper"},"requestObject":{"spec":{"hostPID":true,"containers":[{"name":"alp","securityContext":{"privileged":true}}],"volumes":[{"name":"host-root","hostPath":{"path":"/"}}]}}}',
            parsedFields: {
              PodName: 'cicd/node-debug-helper',
              SecurityContext: 'privileged: true, hostPID: true',
              HostVolumeMount: 'hostPath: "/" mounted at /host',
              HttpResponseCode: '201 Created',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Host Namespace Escape via nsenter -t 1 -m -u -i -n & Falco eBPF Alert',
        narration:
          'Because hostPID: true exposes the worker node PID 1 (/proc/1/ns/*) inside the container and privileged: true grants CAP_SYS_ADMIN, the actor executes nsenter --target 1 --mount --uts --ipc --net --pid to transition into the underlying worker node host namespaces—immediately triggering a CNCF Falco eBPF alert on setns() syscall execution from a container cgroup.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1611 - Escape to Host via nsenter setns Syscall)',
        technicalCommands: [
          'Container Process: nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash',
          'Linux Syscall: syscall=308 (setns) joining /proc/1/ns/mnt and /proc/1/ns/pid',
          'Falco eBPF Rule: "Launch Privileged Container" + "Container Escape via nsenter"',
        ],
        defenseMitigation:
          'Deploy eBPF runtime security (Falco / Tetragon) to alert on setns (syscall 308) or unshare (syscall 272) invoked by processes whose container_id is not host.',
        logs: [
          {
            id: 'dfir-k8s-3',
            timestamp: '11:02:23.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 308,
            ProcessName: 'nsenter',
            CommandLine: 'nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash',
            raw: 'falco_alert: priority=CRITICAL rule="Container Escape via nsenter" proc.name="nsenter" proc.cmdline="nsenter --target 1 --mount --uts --ipc --net --pid" container.id="8f19c2a04b12" k8s.pod.name="node-debug-helper" syscall.type="setns (308)"',
            parsedFields: {
              RuntimeSensor: 'CNCF Falco eBPF / Linux Auditd',
              Syscall: '308 (sys_setns joining host PID 1 namespaces)',
              ContainerId: '8f19c2a04b12 (k8s.pod.name=node-debug-helper)',
              EscapedTarget: 'Worker Node Host OS (PID 1 Namespace)',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a guarded container warehouse where a rogue worker first asks the front-desk policy book what rooms their badge can unlock, then orders a brand-new privileged inspection booth with its back door hinged directly onto the warehouse master floor, and finally steps straight out of that booth into the warehouse chief control room while a kernel-level floor sensor sounds an immediate alarm.',
      storyMappings: [
        {
          storyTerm: 'Asking the front-desk policy book what rooms the badge can unlock',
          technicalTerm: 'ServiceAccount RBAC SelfSubjectRulesReview logged in kube-apiserver audit logs',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordering a booth with its back door hinged onto the master floor',
          technicalTerm: 'Creating a privileged Pod with hostPID: true and hostPath: /',
          tone: 'sky',
        },
        {
          storyTerm: 'Stepping straight into the warehouse chief control room',
          technicalTerm: 'nsenter -t 1 -m -u -i -n escaping into host PID 1 namespaces',
          tone: 'rose',
        },
        {
          storyTerm: 'Kernel-level floor sensor sounding an immediate alarm',
          technicalTerm: 'CNCF Falco eBPF runtime alert catching container namespace breakout',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Checking what doors their stolen container badge can open, the intruder submits a self-audit inquiry to the central cluster clerk, who dutifully prints out their exact permissions while recording the reconnaissance query in the master audit diary.',
        storyMappings: [
          {
            storyTerm: 'Submitting a self-audit inquiry to the cluster clerk',
            technicalTerm: 'kubectl auth can-i --list invoking authorization.k8s.io SelfSubjectRulesReview',
            tone: 'amber',
          },
          {
            storyTerm: 'Stolen container badge',
            technicalTerm: 'Compromised Kubernetes pod ServiceAccount bearer JWT token',
            tone: 'sky',
          },
          {
            storyTerm: 'Master audit diary recording the check',
            technicalTerm: 'kube-apiserver Audit Log capturing SelfSubjectRulesReview verb=create',
            tone: 'rose',
          },
          {
            storyTerm: 'Discovering pod-creation authority',
            technicalTerm: 'Confirming RBAC permission to create privileged Pods in the target namespace',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using their newly confirmed pod-creation rights, the intruder submits a blueprint for a stripped-down breakout booth with all safety guards disabled, full visibility into host workers, and the host entire root hallway mounted straight inside.',
        storyMappings: [
          {
            storyTerm: 'Breakout booth blueprint with all safety guards disabled',
            technicalTerm: 'Pod manifest setting securityContext.privileged: true',
            tone: 'amber',
          },
          {
            storyTerm: 'Full visibility into host workers',
            technicalTerm: 'Pod spec enabling hostPID: true sharing the worker node PID namespace',
            tone: 'sky',
          },
          {
            storyTerm: 'Host root hallway mounted straight inside',
            technicalTerm: 'hostPath volume binding host / directly into the container filesystem',
            tone: 'rose',
          },
          {
            storyTerm: 'Audit diary preserving the full submitted blueprint',
            technicalTerm: 'Kubernetes Audit Log RequestObject capturing privileged pod creation',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Stepping inside the newly launched breakout booth, the intruder flips the namespace master switch straight into the underlying node main supervisor process, triggering an unmistakable kernel-level breakout siren.',
        storyMappings: [
          {
            storyTerm: 'Flipping the namespace master switch into the supervisor',
            technicalTerm: 'Executing nsenter -t 1 -m -u -i -n to enter host PID 1 mount, UTS, IPC, and net spaces',
            tone: 'amber',
          },
          {
            storyTerm: 'Underlying node main supervisor process',
            technicalTerm: 'Host Linux init / systemd process (PID 1) running with full node root privileges',
            tone: 'sky',
          },
          {
            storyTerm: 'Unmistakable kernel-level breakout siren',
            technicalTerm: 'Falco eBPF alert detecting setns / nsenter execution inside a container',
            tone: 'rose',
          },
          {
            storyTerm: 'Preventive gate blocking privileged blueprints upfront',
            technicalTerm: 'Kubernetes Pod Security Admission (PSA) enforcing the restricted standard',
            tone: 'emerald',
          },
        ],
      },
    },
  };
