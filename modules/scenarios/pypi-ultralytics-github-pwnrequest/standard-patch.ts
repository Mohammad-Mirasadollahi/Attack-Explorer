import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a busy community recipe factory whose automated tasting robot reads external visitor suggestion cards while standing inside the locked head-chef kitchen. An intruder writes hidden kitchen commands straight onto the corner of a suggestion card label, steals the factory official distribution stamp, slips a hidden coin-minting gadget into the factory flagship recipe kit, and silently hijacks thousands of research kitchens worldwide.',
      storyMappings: [
        {
          storyTerm: 'Tasting robot reading visitor cards inside the locked head-chef kitchen',
          technicalTerm: 'GitHub Actions pull_request_target workflow interpolating untrusted fork branch names',
          tone: 'amber',
        },
        {
          storyTerm: 'Stealing the factory official distribution stamp',
          technicalTerm: 'Harvested PYPI_TOKEN used to publish poisoned ultralytics v8.3.41 to v8.3.46',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden coin-minting gadget inside the recipe kit',
          technicalTerm: 'Backdoored ultralytics/utils/downloads.py fetching XMRig cryptocurrency miner',
          tone: 'rose',
        },
        {
          storyTerm: 'Hijacked research kitchens worldwide',
          technicalTerm: 'Downstream ML workstations and Colab notebooks executing /tmp/ultralytics_runner',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing outside the recipe factory gate, the intruder submits a public suggestion card whose title label hides extra shell punctuation marks. Because the automated tasting robot pastes that external label straight into a privileged kitchen command without stripping punctuation, the robot obeys the outsider from inside the secure vault.',
        storyMappings: [
          {
            storyTerm: 'Public suggestion card from outside the gate',
            technicalTerm: 'External fork pull request triggering a pull_request_target GitHub Actions workflow',
            tone: 'amber',
          },
          {
            storyTerm: 'Title label hiding extra shell punctuation marks',
            technicalTerm: 'Crafted Git branch name containing command separators injecting shell execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated tasting robot inside the secure vault',
            technicalTerm: 'Privileged CI workflow runner holding repository write tokens and release secrets',
            tone: 'rose',
          },
          {
            storyTerm: 'Obeying the outsider during routine intake',
            technicalTerm: 'PwnRequest remote command execution inside the Ultralytics CI pipeline',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Now holding the factory shipping-house distribution stamp, the intruder tucks a silent remote-fetching routine inside the kit standard download helper and ships poisoned fresh editions directly onto the public pantry shelves, bypassing the clean recipe ledger.',
        storyMappings: [
          {
            storyTerm: 'Factory shipping-house distribution stamp',
            technicalTerm: 'Compromised PYPI_TOKEN publishing credentials',
            tone: 'amber',
          },
          {
            storyTerm: 'Silent remote-fetching routine inside the download helper',
            technicalTerm: 'Malicious code injected into ultralytics/utils/downloads.py safe_download()',
            tone: 'sky',
          },
          {
            storyTerm: 'Poisoned fresh editions on public pantry shelves',
            technicalTerm: 'Compromised PyPI releases ultralytics v8.3.41 through v8.3.46',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean recipe ledger left behind',
            technicalTerm: 'Mismatch between signed Git source tags and published PyPI wheel archives',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enforce PyPI provenance attestation verification (PEP 740 cryptographic proof linking a package strictly to its trusted CI build) and diff published wheel contents against signed Git repository tags using tools like git-pypi-diff (catching unauthorized release tampering).',
      },
      3: {
        storyAnalogy:
          'Whenever a data-science lab or cloud notebook unpacks the fresh kit and opens the manual, the hidden routine quietly downloads a coin-mining engine into a temporary closet, burns the closet door tag so simple checks miss it, and puts the lab powerful graphics ovens to work for the intruder.',
        storyMappings: [
          {
            storyTerm: 'Unpacking the fresh kit in a research lab',
            technicalTerm: 'Installing poisoned ultralytics on ML workstations or Google Colab notebooks',
            tone: 'amber',
          },
          {
            storyTerm: 'Coin-mining engine hidden in a temporary closet',
            technicalTerm: 'Downloaded XMRig miner executing as /tmp/ultralytics_runner',
            tone: 'sky',
          },
          {
            storyTerm: 'Burning the closet door tag',
            technicalTerm: 'Self-unlinked Linux binary running from /tmp/* (deleted)',
            tone: 'rose',
          },
          {
            storyTerm: 'Phoning the intruder mining depot',
            technicalTerm: 'Outbound mining pool connection to connect.consrensys.com:8080',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure Linux EDR alerts for processes executing out of /tmp/* (deleted) (identifying unlinked temporary payloads hiding in RAM) correlated with outbound network connections to connect.consrensys.com:8080 (the attacker XMRig command-and-control endpoint).',
      },
    },
  };
