import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
