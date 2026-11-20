import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a corporate office tower whose automated staffing dispatcher ensures one janitor is stationed on every single floor automatically. An intruder files a rogue staffing order stamped with a pass-all-restrictions seal, forcing the dispatcher to place a master-keyed spy onto every single floor (including the locked executive penthouse) so the spy can photocopy the building core blueprints and master certificates.',
      storyMappings: [
        {
          storyTerm: 'Rogue staffing order with a pass-all-restrictions seal',
          technicalTerm: 'apps/v1 DaemonSet using wildcard tolerations (operator: Exists)',
          tone: 'amber',
        },
        {
          storyTerm: 'Placing a master-keyed spy onto every single floor automatically',
          technicalTerm: 'DaemonSet controller scheduling pods with hostNetwork, hostPID, and hostPath on all nodes',
          tone: 'sky',
        },
        {
          storyTerm: 'Locked executive penthouse',
          technicalTerm: 'Tainted Kubernetes control-plane nodes bypassed by wildcard tolerations',
          tone: 'rose',
        },
        {
          storyTerm: 'Photocopying building core blueprints and master certificates',
          technicalTerm: 'Inspecting /etc/kubernetes/manifests and /etc/kubernetes/pki from the hostPath mount',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Submitting a fake building-maintenance schedule to the central staffing office, the intruder stamps a universal ignore-all-warnings sticker onto the order so even restricted executive floors cannot turn the worker away.',
        storyMappings: [
          {
            storyTerm: 'Fake building-maintenance schedule',
            technicalTerm: 'POST /apis/apps/v1/namespaces/kube-system/daemonsets disguised as node-log-sync',
            tone: 'amber',
          },
          {
            storyTerm: 'Universal ignore-all-warnings sticker',
            technicalTerm: 'Wildcard toleration spec.template.spec.tolerations: [{operator: "Exists"}]',
            tone: 'sky',
          },
          {
            storyTerm: 'Restricted executive floors',
            technicalTerm: 'Control-plane nodes protected by NoSchedule taints',
            tone: 'rose',
          },
          {
            storyTerm: 'Central staffing office',
            technicalTerm: 'Kubernetes API server accepting the privileged workload manifest',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Following the schedule obediently, the automated dispatcher immediately sends one spy worker to every single floor in the tower, handing each spy direct access to the floor hallways, the local switchboard, and the floor master filing room.',
        storyMappings: [
          {
            storyTerm: 'Automated dispatcher placing one spy per floor',
            technicalTerm: 'DaemonSet controller spawning node-log-sync-<hash> pods on every cluster node',
            tone: 'amber',
          },
          {
            storyTerm: 'Direct access to floor switchboards and hallways',
            technicalTerm: 'hostNetwork: true and hostPID: true exposing host sockets and processes',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct door into the floor master filing room',
            technicalTerm: 'hostPath volume mounting host /etc or / directly inside each DaemonSet pod',
            tone: 'rose',
          },
          {
            storyTerm: 'Self-healing staffing loop',
            technicalTerm: 'Controller automatically respawning deleted pods until the DaemonSet itself is removed',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'From the spy stationed inside the executive penthouse, the intruder opens the wall cabinet holding the tower architectural blueprints and master vault seals, gaining total control over the entire skyscraper until defenders cancel the staffing order.',
        storyMappings: [
          {
            storyTerm: 'Spy stationed inside the executive penthouse',
            technicalTerm: 'DaemonSet pod running on the Kubernetes control-plane node',
            tone: 'amber',
          },
          {
            storyTerm: 'Architectural blueprints in the wall cabinet',
            technicalTerm: 'Static pod manifests in /etc/kubernetes/manifests/',
            tone: 'sky',
          },
          {
            storyTerm: 'Master vault seals',
            technicalTerm: 'Cluster root CA and signing keys stored in /etc/kubernetes/pki/',
            tone: 'rose',
          },
          {
            storyTerm: 'Canceling the staffing order',
            technicalTerm: 'Deleting the rogue DaemonSet and enforcing Pod Security Admission restricted policies',
            tone: 'emerald',
          },
        ],
      },
    },
  };
