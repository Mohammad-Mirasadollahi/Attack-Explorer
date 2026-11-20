import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
