import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a central factory parts depot where finished software crates are stacked from numbered modular layers and labeled with movable shipping tags. A thief using a stolen warehouse push badge slips a tampered top layer onto the shelf and moves the floating production tag onto the poisoned stack, until the loading-dock cryptographic seal inspector detects the missing official wax stamp and blocks the tampered crate before it can enter the live factory floor.',
      storyMappings: [
        {
          storyTerm: 'Slipping a tampered modular layer onto the warehouse shelf',
          technicalTerm: 'Uploading trojanized OCI layer blob via POST /v2/<repo>/blobs/uploads/',
          tone: 'amber',
        },
        {
          storyTerm: 'Moving the floating production tag onto the poisoned stack',
          technicalTerm: 'Overwriting mutable :prod tag via PUT /v2/corp/payment-api/manifests/prod',
          tone: 'sky',
        },
        {
          storyTerm: 'Loading-dock cryptographic seal inspector',
          technicalTerm: 'Kubernetes Sigstore Policy Controller verifying Cosign image signatures',
          tone: 'rose',
        },
        {
          storyTerm: 'Missing official wax stamp blocking deployment',
          technicalTerm: 'Failed Cosign digest signature check halting tampered image rollout',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a stolen warehouse stocking pass, the thief wheels a freshly altered crate layer carrying hidden spy gear through the depot upload dock and registers its new fingerprint in the warehouse bin.',
        storyMappings: [
          {
            storyTerm: 'Stolen warehouse stocking pass',
            technicalTerm: 'Compromised OCI container registry token with repository push scope',
            tone: 'amber',
          },
          {
            storyTerm: 'Altered crate layer carrying hidden spy gear',
            technicalTerm: 'Trojanized filesystem layer tarball containing backdoored binaries',
            tone: 'sky',
          },
          {
            storyTerm: 'Depot upload dock',
            technicalTerm: 'OCI Distribution API POST /v2/<repo>/blobs/uploads/ endpoint',
            tone: 'rose',
          },
          {
            storyTerm: 'New fingerprint registered in the bin',
            technicalTerm: 'New SHA-256 content-addressable blob digest stored in the registry',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the thief drafts a brand-new packing list that replaces the clean top layer with the tampered layer and hangs the well-known movable production tag straight onto the poisoned packing list so automatic deliveries grab it next.',
        storyMappings: [
          {
            storyTerm: 'Brand-new packing list referencing the tampered layer',
            technicalTerm: 'OCI image manifest (application/vnd.oci.image.manifest.v1+json) listing the rogue digest',
            tone: 'amber',
          },
          {
            storyTerm: 'Movable production tag hung on the poisoned stack',
            technicalTerm: 'PUT /v2/corp/payment-api/manifests/prod overwriting mutable :prod tag',
            tone: 'sky',
          },
          {
            storyTerm: 'Automatic deliveries configured to pull the latest tag',
            technicalTerm: 'Kubernetes Deployments referencing mutable :prod with imagePullPolicy: Always',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean historical stack left unreferenced',
            technicalTerm: 'Original clean manifest digest replaced as the active tag target',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'When the live factory floor tries to pull the refreshed production crate, the loading-dock seal inspector checks the crate cryptographic wax stamp against the official builder ledger, immediately catches the forged unsealed stack, halts the shipment, and flags the exact swapped layer for forensic investigators.',
        storyMappings: [
          {
            storyTerm: 'Factory floor pulling the refreshed crate',
            technicalTerm: 'Kubernetes scheduling pods with imagePullPolicy: Always on :prod',
            tone: 'amber',
          },
          {
            storyTerm: 'Loading-dock seal inspector checking the wax stamp',
            technicalTerm: 'Sigstore Policy Controller validating Cosign signatures and Rekor transparency logs',
            tone: 'sky',
          },
          {
            storyTerm: 'Halting the unsealed shipment',
            technicalTerm: 'Admission rejection blocking deployment of the unsigned tampered digest',
            tone: 'rose',
          },
          {
            storyTerm: 'Flagging the exact swapped layer for investigators',
            technicalTerm: 'OCI manifest and layer diff forensics isolating the injected malicious blob',
            tone: 'emerald',
          },
        ],
      },
    },
  };
