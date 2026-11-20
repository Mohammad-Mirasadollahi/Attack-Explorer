import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a locksmith guild whose widely trusted key-handling library is pulled automatically into thousands of automated currency vaults. An impostor tricks a guild maintainer on a lookalike courier website to steal their publishing seal, slips a silent key-copying scribe inside the vault key-loading latch, and mails every copied private vault key out of the building disguised as ordinary delivery-address stamps on routine postal envelopes.',
      storyMappings: [
        {
          storyTerm: 'Lookalike courier website stealing a publishing seal',
          technicalTerm: 'Spear-phishing NPM maintainer to hijack @solana/web3.js and @rspack/core publish tokens',
          tone: 'amber',
        },
        {
          storyTerm: 'Silent key-copying scribe inside the key-loading latch',
          technicalTerm: 'Injected addToQueue() hook inside Keypair.fromSecretKey and Keypair.fromSeed',
          tone: 'sky',
        },
        {
          storyTerm: 'Disguised delivery-address stamps on routine envelopes',
          technicalTerm: '64-byte private keys smuggled inside fake CF-Connecting-IP and CF-Ray HTTP headers',
          tone: 'rose',
        },
        {
          storyTerm: 'Secret external mailbox receiving the stolen keys',
          technicalTerm: 'Attacker collection endpoint at sol-rpc.xyz harvesting wallet and CI secrets',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending a realistic notice from a lookalike guild portal, the attacker tricks a busy package maintainer into entering their publishing passkey, then pushes freshly backdoored editions straight into the public parts registry.',
        storyMappings: [
          {
            storyTerm: 'Lookalike guild portal notice',
            technicalTerm: 'Spoofed NPM security domain spear-phishing package maintainers',
            tone: 'amber',
          },
          {
            storyTerm: 'Hijacked publishing passkey',
            technicalTerm: 'Stolen NPM automation and publish token for @solana/web3.js and @rspack/core',
            tone: 'sky',
          },
          {
            storyTerm: 'Freshly backdoored editions in the registry',
            technicalTerm: 'Malicious @solana/web3.js versions 1.95.6 and 1.95.7 published to npmjs',
            tone: 'rose',
          },
          {
            storyTerm: 'Downstream automated workshops',
            technicalTerm: 'Developer workstations and CI pipelines using unpinned caret ranges (^1.95.0)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Whenever an automated vault refreshes its parts shelf and loads a wallet key into memory, a newly hidden scribe tucked inside the official key-loading hinge silently copies the raw 64-byte master secret into a small outbound queue without slowing down the vault.',
        storyMappings: [
          {
            storyTerm: 'Refreshing the parts shelf automatically',
            technicalTerm: 'npm update resolving unpinned caret version ^1.95.0 to poisoned 1.95.6',
            tone: 'amber',
          },
          {
            storyTerm: 'Official key-loading hinge',
            technicalTerm: 'Keypair.fromSecretKey() and Keypair.fromSeed() core SDK methods',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden scribe copying the master secret',
            technicalTerm: 'Injected addToQueue() exfiltration hook capturing raw private key bytes',
            tone: 'rose',
          },
          {
            storyTerm: 'Normal vault work continuing without interruption',
            technicalTerm: 'Silent background staging preventing immediate runtime errors or crashes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To slip past watchful mailroom inspectors, the hidden scribe encodes each copied master vault key into fake transit-routing stamps on normal-looking web envelopes and mails them quietly to an impostor courier depot.',
        storyMappings: [
          {
            storyTerm: 'Watchful mailroom inspectors',
            technicalTerm: 'Outbound proxy, DLP, and RPC network telemetry monitors',
            tone: 'amber',
          },
          {
            storyTerm: 'Fake transit-routing stamps on web envelopes',
            technicalTerm: 'Stolen keys hidden inside spoofed CF-Connecting-IP and CF-Ray HTTP headers',
            tone: 'sky',
          },
          {
            storyTerm: 'Impostor courier depot',
            technicalTerm: 'Attacker-controlled exfiltration server at sol-rpc.xyz',
            tone: 'rose',
          },
          {
            storyTerm: 'Empty customer vaults after receipt',
            technicalTerm: 'Automated wallet sweeping using recovered 64-byte Solana private keys',
            tone: 'emerald',
          },
        ],
      },
    },
  };
