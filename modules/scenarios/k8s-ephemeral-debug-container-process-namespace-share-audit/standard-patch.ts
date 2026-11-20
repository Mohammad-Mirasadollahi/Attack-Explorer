import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an armored cash-transport van engineered with zero interior door handles and zero toolboxes so nobody can operate inside it. Using a special roadside-mechanic pass, an intruder bolts a temporary diagnostic side cabin directly onto the armored van shared interior cabin, reads every secret vault note taped beside the driver seat, and leaves a permanent weld scar that forces the bank to retire and replace the entire vehicle.',
      storyMappings: [
        {
          storyTerm: 'Armored cash van with zero door handles or toolboxes',
          technicalTerm: 'Hardened distroless production container lacking /bin/sh or utilities',
          tone: 'amber',
        },
        {
          storyTerm: 'Bolting a temporary diagnostic side cabin onto the van',
          technicalTerm: 'PATCH /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers (kubectl debug)',
          tone: 'sky',
        },
        {
          storyTerm: 'Reading secret notes taped beside the driver seat',
          technicalTerm: 'Process namespace sharing (--target) reading /proc/<pid>/environ secrets',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanent weld scar forcing full vehicle replacement',
          technicalTerm: 'Append-only spec.ephemeralContainers requiring full Pod rollout replacement',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Even though the armored payments van carries no shell or repair tools inside its cabin, the intruder flashes a specialized roadside-debug permit to weld a fully equipped temporary service booth straight onto the live moving vehicle.',
        storyMappings: [
          {
            storyTerm: 'Armored payments van with no shell or tools',
            technicalTerm: 'Hardened distroless production pod with /bin/sh removed',
            tone: 'amber',
          },
          {
            storyTerm: 'Specialized roadside-debug permit',
            technicalTerm: 'RBAC permission on pods/ephemeralcontainers subresource',
            tone: 'sky',
          },
          {
            storyTerm: 'Welding a temporary service booth onto the live van',
            technicalTerm: 'PATCH request creating an ephemeral debug container via kubectl debug',
            tone: 'rose',
          },
          {
            storyTerm: 'Live vehicle continuing down the highway',
            technicalTerm: 'Running production pod mutated without restarting the target app',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Linking the temporary service booth directly into the main driver cabin wall, the intruder reaches straight into the active driver workspace and photocopies every live vault key and database password taped inside memory.',
        storyMappings: [
          {
            storyTerm: 'Linking directly into the main driver cabin wall',
            technicalTerm: 'targetContainerName="payment-app" sharing the PID namespace via containerd',
            tone: 'amber',
          },
          {
            storyTerm: 'Active driver workspace',
            technicalTerm: 'Target application process space visible under /proc/<pid>/',
            tone: 'sky',
          },
          {
            storyTerm: 'Vault keys and database passwords taped inside',
            technicalTerm: 'Runtime secrets harvested from /proc/<pid>/environ and open file descriptors',
            tone: 'rose',
          },
          {
            storyTerm: 'Tools brought along inside the service booth',
            technicalTerm: 'Attacker-chosen debug container image carrying shells and forensic utilities',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because the bolted-on diagnostic booth can never be unbolted while the armored van remains on the road, investigators audit the live radio session log and dispatch a clean replacement van while retiring the compromised vehicle completely.',
        storyMappings: [
          {
            storyTerm: 'Diagnostic booth that can never be unbolted on the road',
            technicalTerm: 'Immutable append-only spec.ephemeralContainers array on a running Pod',
            tone: 'amber',
          },
          {
            storyTerm: 'Live radio session log',
            technicalTerm: 'Kubernetes Audit logs recording interactive SPDY/WebSocket pods/attach sessions',
            tone: 'sky',
          },
          {
            storyTerm: 'Dispatching a clean replacement van',
            technicalTerm: 'Full Pod eviction and clean Deployment rollout replacement',
            tone: 'rose',
          },
          {
            storyTerm: 'Locking down roadside-debug permits',
            technicalTerm: 'Restricting RBAC access to pods/ephemeralcontainers and pods/attach',
            tone: 'emerald',
          },
        ],
      },
    },
  };
