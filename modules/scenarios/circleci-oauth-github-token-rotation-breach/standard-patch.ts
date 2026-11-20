import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a master build-automation vault that safeguards secret keys for thousands of software companies. An intruder infects a single senior engineer laptop with a silent pocket-picking program that lifts an already-stamped two-factor entry pass straight from the browser, replays that active pass from abroad to copy both the encrypted customer lockboxes and the live decoding key from the vault control room, and unlocks thousands of customer cloud and code keys offline.',
      storyMappings: [
        {
          storyTerm: 'Silent pocket-picking program lifting a stamped two-factor pass',
          technicalTerm: 'macOS infostealer stealing a 2FA-authenticated browser session cookie',
          tone: 'amber',
        },
        {
          storyTerm: 'Replaying the active pass from abroad to enter the control room',
          technicalTerm: 'Foreign proxy session replay accessing CircleCI production databases and KMS keys',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying both the encrypted lockboxes and the decoding key',
          technicalTerm: 'Exfiltrating customer secret databases alongside runtime encryption keys',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking customer cloud and code keys offline',
          technicalTerm: 'Offline decryption and replay of customer GitHub OAuth tokens and AWS keys',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After a senior engineer installs a trojanized helper tool on a work laptop, a quiet stealer slips inside the browser drawer and copies an already-verified security wristband, skipping the two-factor badge gate entirely because the wristband already carries its fresh stamp.',
        storyMappings: [
          {
            storyTerm: 'Trojanized helper tool on a work laptop',
            technicalTerm: 'Third-party macOS infostealer executing on a privileged engineer endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Already-verified security wristband inside the browser drawer',
            technicalTerm: 'Active 2FA-backed SSO browser session cookie stolen from disk/keychain',
            tone: 'sky',
          },
          {
            storyTerm: 'Skipping the two-factor badge gate',
            technicalTerm: 'Session cookie theft bypassing hardware MFA and antivirus detection',
            tone: 'rose',
          },
          {
            storyTerm: 'Privileged engineer identity',
            technicalTerm: 'Production access rights capable of generating customer data tokens',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Wearing the stolen wristband from an overseas relay booth, the intruder walks straight into the central vault control room, wheels out copies of the encrypted customer secret ledgers, and separately grabs the live master decoding key sitting in the vault engine room.',
        storyMappings: [
          {
            storyTerm: 'Wearing the stolen wristband from an overseas booth',
            technicalTerm: 'Replaying the hijacked session cookie from a foreign proxy IP address',
            tone: 'amber',
          },
          {
            storyTerm: 'Encrypted customer secret ledgers',
            technicalTerm: 'Exfiltrated CircleCI production database dumps containing encrypted CI secrets',
            tone: 'sky',
          },
          {
            storyTerm: 'Live master decoding key in the engine room',
            technicalTerm: 'Stolen runtime encryption / KMS key material protecting customer vaults',
            tone: 'rose',
          },
          {
            storyTerm: 'Central vault control room',
            technicalTerm: 'Privileged internal CircleCI production data and secrets infrastructure',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Safe inside their own hideout, the intruder pairs the stolen master decoding key with the copied ledgers to crack open customer build secrets offline, then replays those freshly uncovered GitHub and cloud keys across downstream company estates.',
        storyMappings: [
          {
            storyTerm: 'Pairing the master key with copied ledgers offline',
            technicalTerm: 'Offline decryption of customer environment variables, SSH keys, and OAuth tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Freshly uncovered code and cloud keys',
            technicalTerm: 'Decrypted customer GitHub OAuth tokens, AWS IAM keys, and project API tokens',
            tone: 'sky',
          },
          {
            storyTerm: 'Entering downstream company estates',
            technicalTerm: 'Downstream replay of stolen CI/CD secrets against customer repos and clouds',
            tone: 'rose',
          },
          {
            storyTerm: 'Emergency lock replacement across all tenants',
            technicalTerm: 'Mandatory global rotation of all CircleCI-stored OAuth, SSH, and cloud secrets',
            tone: 'emerald',
          },
        ],
      },
    },
  };
