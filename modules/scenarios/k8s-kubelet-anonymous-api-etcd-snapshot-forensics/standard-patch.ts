import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
