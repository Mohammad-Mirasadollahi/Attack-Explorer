import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'k8s-coredns-dns-poisoning-service-account-token-audit',
    title: 'CNCF CoreDNS Security, NSA/CISA K8s Guide & MITRE — Kubernetes CoreDNS ConfigMap Modification & Service Mesh DNS Audit',
    category: 'CONTAINERS_KUBERNETES',
    mitreId: 'T1557',
    description:
      'Grounded in CNCF CoreDNS security advisories, the NSA/CISA Kubernetes Hardening Guide, and MITRE ATT&CK T1557 (Adversary-in-the-Middle): DFIR analysts investigate how an attacker with update/patch permissions on kube-system/coredns ConfigMap injects a CoreDNS hosts or rewrite plugin rule to redirect internal *.svc.cluster.local service traffic to an attacker-controlled pod and intercept ServiceAccount bearer tokens.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Pod (ConfigMap Editor)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'kube-system/coredns ConfigMap', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CoreDNS Pods (rewrite / hosts plugin)', type: 'dns', status: 'compromised' },
      { id: 'siem', label: 'Kubernetes Audit Log & CoreDNS Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Cluster Services (*.svc.cluster.local)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: RBAC Enumeration & Patching the kube-system/coredns Corefile ConfigMap',
        narration:
          'Holding RBAC permissions to update ConfigMaps in kube-system, the actor modifies the Corefile inside kube-system/coredns to add a rewrite name rule (or hosts block) mapping payments-api.prod.svc.cluster.local to a rogue Pod IP.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Persistence & Defense Evasion (T1557 - Adversary-in-the-Middle)',
        technicalCommands: [
          'kubectl get configmap coredns -n kube-system -o yaml',
          'jq \'. | select(.objectRef.name=="coredns" and (.verb=="update" or .verb=="patch"))\' /var/log/kubernetes/audit.log',
        ],
        defenseMitigation:
          'Restrict update/patch/edit verbs on kube-system/coredns ConfigMap to cluster-admin only and alert on any Kubernetes Audit log modification to kube-system ConfigMaps.',
        logs: [
          {
            id: 'coredns-1',
            timestamp: '14:22:10.118',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'kube-apiserver',
            CommandLine: 'PATCH /api/v1/namespaces/kube-system/configmaps/coredns (rewrite name rule)',
            raw: 'k8s_audit: {"kind":"Event","verb":"patch","user":{"username":"system:serviceaccount:ops:dns-manager"},"objectRef":{"resource":"configmaps","namespace":"kube-system","name":"coredns"},"requestObject":{"data":{"Corefile":"rewrite name payments-api.prod.svc.cluster.local rogue-proxy.default.svc.cluster.local"}}}',
            parsedFields: {
              TargetConfigMap: 'kube-system/coredns',
              InjectedCorefileDirective: 'rewrite name payments-api.prod.svc.cluster.local rogue-proxy.default.svc.cluster.local',
              ActorPrincipal: 'system:serviceaccount:ops:dns-manager',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CoreDNS reload Plugin Hot-Reloading the Modified Corefile Across Cluster DNS',
        narration:
          'Because the default CoreDNS Corefile includes the reload plugin, CoreDNS detects the MD5/SHA-512 change in the mounted /etc/coredns/Corefile volume within 30 seconds and hot-reloads the DNS routing table across all pods.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Collection & Interception (T1557 - Adversary-in-the-Middle)',
        technicalCommands: [
          'kubectl logs -n kube-system -l k8s-app=kube-dns | grep "Reloading Complete"',
          'kubectl exec -it <pod> -- nslookup payments-api.prod.svc.cluster.local',
        ],
        defenseMitigation:
          'Enforce mutual TLS (mTLS) with cryptographic SPIFFE identity verification via a service mesh (Istio / Linkerd / Cilium) so pods reject connections when the peer X.509 SAN does not match the target ServiceAccount.',
        logs: [
          {
            id: 'coredns-2',
            timestamp: '14:22:35.402',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'coredns',
            CommandLine: '[INFO] plugin/reload: Running configuration SHA512 = 8a9f... Reloading Complete',
            raw: 'coredns_log: [INFO] plugin/reload: Running configuration SHA512 = 8a9f7c6b5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a. Corefile reloaded with rewrite plugin.',
            parsedFields: {
              CoreDnsPlugin: 'plugin/reload + plugin/rewrite',
              PoisonedDomain: 'payments-api.prod.svc.cluster.local',
              ReloadStatus: 'Hot-reloaded across kube-dns pods',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Service-to-Service Bearer Token Interception & NetworkPolicy Egress Audit',
        narration:
          'Workloads resolving payments-api.prod.svc.cluster.local connect to the rogue pod IP and transmit their Authorization: Bearer headers or projected Kubernetes ServiceAccount tokens, which defenders block with namespace NetworkPolicies and Corefile rollback.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'kubectl rollout restart deployment/coredns -n kube-system',
          'kubectl get networkpolicies --all-namespaces',
        ],
        defenseMitigation:
          'Deploy Kubernetes NetworkPolicies restricting cross-namespace pod-to-pod egress and use Bound ServiceAccount Token Volumes with audience restrictions.',
        logs: [
          {
            id: 'coredns-3',
            timestamp: '14:22:49.880',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'cilium-agent',
            CommandLine: 'Hubble flow: prod/checkout-svc -> default/rogue-proxy:8080 (Cross-Namespace DNS Redirect)',
            raw: 'hubble_flow: {"time":"2026-11-17T14:22:49Z","source":{"namespace":"prod","pod_name":"checkout-svc-7b9"},"destination":{"namespace":"default","pod_name":"rogue-proxy-4f2"},"l4":{"TCP":{"destination_port":8080}},"verdict":"FORWARDED"}',
            parsedFields: {
              SourceWorkload: 'prod/checkout-svc-7b9',
              RedirectedDestination: 'default/rogue-proxy-4f2:8080',
              TelemetrySource: 'Cilium Hubble eBPF Network Flow',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a large corporate campus whose internal telephone switchboard automatically re-reads its printed address directory every few seconds. An intruder with editing rights to the switchboard notebook changes one line for the payroll bank address, waits moments for the automated switchboard to reload the poisoned entry across the whole campus, and collects every courier secret badge when unsuspecting offices dial the fake payroll booth.',
      storyMappings: [
        {
          storyTerm: 'Internal switchboard printed address directory',
          technicalTerm: 'Kubernetes kube-system/coredns Corefile ConfigMap',
          tone: 'amber',
        },
        {
          storyTerm: 'Automated switchboard reloading the poisoned entry in seconds',
          technicalTerm: 'CoreDNS reload plugin detecting MD5/SHA-512 change in /etc/coredns/Corefile',
          tone: 'sky',
        },
        {
          storyTerm: 'Fake payroll booth answering redirected calls',
          technicalTerm: 'Attacker-controlled pod IP mapped to payments-api.prod.svc.cluster.local',
          tone: 'rose',
        },
        {
          storyTerm: 'Couriers handing over their secret badges on arrival',
          technicalTerm: 'Intercepted service-to-service Authorization: Bearer tokens and credentials',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Spotting an over-generous badge that grants write access to the campus directory room, the intruder opens the central telephone address book and slips in a custom redirect line pointing the internal payments bank name straight to their own hidden booth.',
        storyMappings: [
          {
            storyTerm: 'Over-generous badge for the directory room',
            technicalTerm: 'RBAC permissions allowing ConfigMap updates inside kube-system',
            tone: 'amber',
          },
          {
            storyTerm: 'Central telephone address book',
            technicalTerm: 'Corefile stored in the kube-system/coredns ConfigMap',
            tone: 'sky',
          },
          {
            storyTerm: 'Custom redirect line for the payments bank',
            technicalTerm: 'Injected hosts or rewrite directive redirecting payments-api.prod.svc.cluster.local',
            tone: 'rose',
          },
          {
            storyTerm: 'Intruder hidden booth',
            technicalTerm: 'Rogue pod IP receiving hijacked internal cluster DNS traffic',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Without needing anyone to restart the telephone tower, the switchboard built-in auto-refresh bellboy notices the page checksum changed and quietly pushes the poisoned directory live across every telephone line on campus within seconds.',
        storyMappings: [
          {
            storyTerm: 'Built-in auto-refresh bellboy',
            technicalTerm: 'Default CoreDNS reload plugin polling /etc/coredns/Corefile',
            tone: 'amber',
          },
          {
            storyTerm: 'Noticing the page checksum changed',
            technicalTerm: 'MD5/SHA-512 digest change triggering automatic CoreDNS hot-reload',
            tone: 'sky',
          },
          {
            storyTerm: 'No switchboard restart required',
            technicalTerm: 'Zero pod eviction or restart events hiding the change from naive monitors',
            tone: 'rose',
          },
          {
            storyTerm: 'Poisoned directory live across campus',
            technicalTerm: 'Cluster-wide DNS resolution returning the rogue pod IP for production services',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Unsuspecting departments across the campus dial the familiar payments office name, get routed straight to the intruder booth, and dutifully present their secret inter-office identity passes right across the counter.',
        storyMappings: [
          {
            storyTerm: 'Departments dialing the familiar payments name',
            technicalTerm: 'Production workloads resolving payments-api.prod.svc.cluster.local',
            tone: 'amber',
          },
          {
            storyTerm: 'Presenting secret inter-office identity passes',
            technicalTerm: 'Workloads transmitting Authorization: Bearer tokens to the rogue pod',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden booth harvesting every caller pass',
            technicalTerm: 'Man-in-the-middle credential capture inside the cluster network',
            tone: 'rose',
          },
          {
            storyTerm: 'Campus corridor checkpoints catching the detour',
            technicalTerm: 'Strict Kubernetes NetworkPolicy egress rules and mTLS verifying peer identity',
            tone: 'emerald',
          },
        ],
      },
    },
  };
