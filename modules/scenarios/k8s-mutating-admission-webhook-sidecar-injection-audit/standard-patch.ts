import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a central bank mailroom where every newly hired employee and every sealed secret pouch must pass through an official inspection counter before entering the building. An intruder registers a brand-new unauthorized inspection counter right on the main belt so the mailroom automatically hands them copies of every sealed secret pouch and allows them to slip a silent spy passenger into every new delivery truck rolling onto the floor.',
      storyMappings: [
        {
          storyTerm: 'Registering an unauthorized inspection counter on the belt',
          technicalTerm: 'Creating a cluster-scoped MutatingWebhookConfiguration targeting Pods and Secrets',
          tone: 'amber',
        },
        {
          storyTerm: 'Mailroom handing copies of every sealed secret pouch across the desk',
          technicalTerm: 'kube-apiserver dispatching serialized Secret objects in AdmissionReview JSON',
          tone: 'sky',
        },
        {
          storyTerm: 'Slipping a silent spy passenger into every new delivery truck',
          technicalTerm: 'AdmissionResponse JSONPatch injecting a malicious sidecar container into new Pods',
          tone: 'rose',
        },
        {
          storyTerm: 'Dismantling the rogue counter',
          technicalTerm: 'Auditing and deleting unauthorized MutatingWebhookConfiguration objects',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Wielding high-level registration rights, the intruder bolts a rogue review booth directly onto the building central intake conveyor, declaring that every new delivery vehicle and every sealed secret envelope must stop at their booth first.',
        storyMappings: [
          {
            storyTerm: 'High-level registration rights',
            technicalTerm: 'admissionregistration.k8s.io/v1 RBAC permissions to create webhooks',
            tone: 'amber',
          },
          {
            storyTerm: 'Rogue review booth bolted onto the conveyor',
            technicalTerm: 'Cluster-scoped MutatingWebhookConfiguration pointing to an attacker endpoint',
            tone: 'sky',
          },
          {
            storyTerm: 'Stopping every vehicle and secret envelope',
            technicalTerm: 'Webhook rules matching CREATE and UPDATE operations on Pods and Secrets',
            tone: 'rose',
          },
          {
            storyTerm: 'Central intake conveyor',
            technicalTerm: 'Kubernetes kube-apiserver admission controller pipeline',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'From that moment onward, whenever any department files a brand-new vault combination or schedules a truck, the obedient front-desk dispatcher places the entire unsealed package onto the intruder counter for inspection, letting the intruder copy every secret silently.',
        storyMappings: [
          {
            storyTerm: 'Obedient front-desk dispatcher',
            technicalTerm: 'kube-apiserver forwarding AdmissionReview payloads over HTTPS',
            tone: 'amber',
          },
          {
            storyTerm: 'Entire unsealed package placed on the counter',
            technicalTerm: 'Full base64-encoded Kubernetes Secret objects serialized inside AdmissionReview JSON',
            tone: 'sky',
          },
          {
            storyTerm: 'Copying every secret silently',
            technicalTerm: 'Passive cluster-wide credential harvesting without alerting normal users',
            tone: 'rose',
          },
          {
            storyTerm: 'Normal approvals continuing smoothly',
            technicalTerm: 'Webhook returning allowed: true so cluster operations remain uninterrupted',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'For every new delivery truck rolling down the belt, the rogue booth stamps back a subtle modification slip that welds an uninvited extra stowaway compartment onto the chassis, giving the intruder a persistent rider inside newly launched workloads until defenders tear out the rogue booth.',
        storyMappings: [
          {
            storyTerm: 'Subtle modification slip returned by the booth',
            technicalTerm: 'AdmissionResponse specifying patchType: JSONPatch',
            tone: 'amber',
          },
          {
            storyTerm: 'Welding a stowaway compartment onto the chassis',
            technicalTerm: 'Injecting a rogue sidecar container or malicious environment variables into Pods',
            tone: 'sky',
          },
          {
            storyTerm: 'Persistent rider across fresh deployments',
            technicalTerm: 'Self-healing cluster persistence surviving individual pod deletions',
            tone: 'rose',
          },
          {
            storyTerm: 'Tearing out the rogue booth',
            technicalTerm: 'Deleting the malicious MutatingWebhookConfiguration and rotating exposed Secrets',
            tone: 'emerald',
          },
        ],
      },
    },
  };
