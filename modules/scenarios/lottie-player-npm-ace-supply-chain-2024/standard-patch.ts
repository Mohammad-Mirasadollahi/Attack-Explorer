import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an animation studio whose lightweight flipbook player is embedded via an unpinned live delivery link on thousands of websites. An intruder steals a studio publishing pass, pushes three backdoored editions in quick succession so every site loading the live link immediately runs a hidden radio beacon, and uses that live radio to drop a fake glass login sheet directly over trusted finance pages to drain visitor wallets.',
      storyMappings: [
        {
          storyTerm: 'Studio publishing pass pushing three backdoored flipbooks',
          technicalTerm: 'Compromised NPM token publishing @lottiefiles/lottie-player v2.0.5, 2.0.6, and 2.0.7',
          tone: 'amber',
        },
        {
          storyTerm: 'Hidden radio beacon dialing an outside handler',
          technicalTerm: 'Obfuscated bundle opening WebSocket C2 to wss://castleservices.org',
          tone: 'sky',
        },
        {
          storyTerm: 'Fake glass login sheet laid over trusted pages',
          technicalTerm: 'Dynamic DOM modal overlay injected inside victim Web3 applications',
          tone: 'rose',
        },
        {
          storyTerm: 'Draining visitor wallets through the fake sheet',
          technicalTerm: 'AceDrainer eth_sendTransaction and Permit2 malicious signing requests',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a stolen studio access token, the intruder uploads three rapid-fire compromised editions of the popular animation player onto the public shelf, banking on thousands of websites that pull the newest major version live without locking a specific version hash.',
        storyMappings: [
          {
            storyTerm: 'Stolen studio access token',
            technicalTerm: 'Compromised @lottiefiles NPM maintainer publish credential',
            tone: 'amber',
          },
          {
            storyTerm: 'Three rapid-fire compromised editions',
            technicalTerm: 'Poisoned @lottiefiles/lottie-player versions 2.0.5, 2.0.6, and 2.0.7',
            tone: 'sky',
          },
          {
            storyTerm: 'Sites pulling the newest edition live without a hash lock',
            technicalTerm: 'Unpinned CDN script tags loading @lottiefiles/lottie-player@latest or @2',
            tone: 'rose',
          },
          {
            storyTerm: 'Appended hidden payload inside the flipbook',
            technicalTerm: 'Obfuscated AceDrainer JavaScript loader bundled into lottie-player.js',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'As soon as a visitor opens any webpage playing a decorative animation, the hidden code appended to the player opens a live two-way radio channel to an outside command post, asking whether this browser holds valuable digital keys worth targeting.',
        storyMappings: [
          {
            storyTerm: 'Webpage playing a decorative animation',
            technicalTerm: 'Victim browser loading unpinned lottie-player.js inside a trusted site',
            tone: 'amber',
          },
          {
            storyTerm: 'Live two-way radio channel',
            technicalTerm: 'Outbound WebSocket connection established to wss://castleservices.org',
            tone: 'sky',
          },
          {
            storyTerm: 'Checking for valuable digital keys',
            technicalTerm: 'Browser wallet extension detection (window.ethereum) inside the page context',
            tone: 'rose',
          },
          {
            storyTerm: 'Outside command post directing next moves',
            technicalTerm: 'Remote AceDrainer C2 server issuing real-time DOM overlay instructions',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'On cue from the live radio channel, the hijacked animation player drops a crystal-clear counterfeit prompt straight over the trusted storefront window, fooling visitors into signing a sweeping vault-transfer slip under the host site own trusted banner.',
        storyMappings: [
          {
            storyTerm: 'Crystal-clear counterfeit prompt over the trusted window',
            technicalTerm: 'Injected full-screen AceDrainer modal overlay inside the host DOM',
            tone: 'amber',
          },
          {
            storyTerm: 'Host site own trusted banner',
            technicalTerm: 'Legitimate victim domain URL bar lending visual authenticity to the prompt',
            tone: 'sky',
          },
          {
            storyTerm: 'Sweeping vault-transfer slip',
            technicalTerm: 'Crafted eth_sendTransaction and Permit2 approval prompts sent to the wallet',
            tone: 'rose',
          },
          {
            storyTerm: 'Direct asset transfer to the attacker',
            technicalTerm: 'On-chain draining of user tokens immediately upon wallet signature',
            tone: 'emerald',
          },
        ],
      },
    },
  };
