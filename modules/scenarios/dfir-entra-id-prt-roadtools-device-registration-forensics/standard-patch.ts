import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office park that issues long-lived resident smartcards to company-owned laptops so workers stay signed in seamlessly across every building. Using a hijacked login token, an intruder walks up to the laptop-enrollment desk, registers a completely fake phantom laptop into the corporate directory, and collects a genuine long-lived smartcard that lets them mint fresh building passes quietly even from off-site machines.',
      storyMappings: [
        {
          storyTerm: 'Requesting an appointment ticket for the laptop-enrollment desk',
          technicalTerm: 'Acquiring an OAuth token for Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net)',
          tone: 'amber',
        },
        {
          storyTerm: 'Registering a completely fake phantom laptop in the directory',
          technicalTerm: 'ROADtools rogue device join logged in Entra Directory Audit Operation="Register device"',
          tone: 'sky',
        },
        {
          storyTerm: 'Collecting a genuine long-lived resident smartcard',
          technicalTerm: 'Issuance of a Primary Refresh Token (PRT) and encrypted session key bound to the rogue device',
          tone: 'rose',
        },
        {
          storyTerm: 'Minting fresh passes silently across every cloud building',
          technicalTerm: 'Using the stolen PRT cookie to satisfy device-based Conditional Access persistently',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding a stolen user sign-in credential, the intruder asks the identity gatehouse for a special pass scoped specifically to the company Device Enrollment Desk, preparing to add an attacker-controlled machine to the trusted fleet.',
        storyMappings: [
          {
            storyTerm: 'Special pass scoped to the Device Enrollment Desk',
            technicalTerm: 'Access token requested for resource urn:ms-drs:enterpriseregistration.windows.net',
            tone: 'amber',
          },
          {
            storyTerm: 'Stolen user sign-in credential',
            technicalTerm: 'Compromised corporate user identity or MFA-satisfied refresh token',
            tone: 'sky',
          },
          {
            storyTerm: 'Gatehouse diary recording the enrollment token',
            technicalTerm: 'Entra ID Sign-In Logs recording non-Windows or ROADtools DRS token requests',
            tone: 'rose',
          },
          {
            storyTerm: 'Gateway to trusted fleet membership',
            technicalTerm: 'Default Entra ID setting allowing standard users to register personal or joined devices',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Presenting that enrollment pass alongside a freshly generated machine key pair, the intruder registers a phantom computer directly into the corporate directory, receiving a genuine company device certificate while the directory audit ledger stamps a brand-new registration line.',
        storyMappings: [
          {
            storyTerm: 'Registering a phantom computer into the directory',
            technicalTerm: 'ROADtools roadtx device registration creating a rogue Entra ID Device object',
            tone: 'amber',
          },
          {
            storyTerm: 'Genuine company device certificate returned',
            technicalTerm: 'X.509 device certificate signed by the tenant Device Registration Service',
            tone: 'sky',
          },
          {
            storyTerm: 'Directory audit ledger stamping the new device',
            technicalTerm: 'Entra ID Directory Audit Log Operation="Register device" or "Add device"',
            tone: 'rose',
          },
          {
            storyTerm: 'Sneaking past managed-device checks',
            technicalTerm: 'Attacker laptop masquerading as an Entra-joined corporate endpoint',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Using the newly issued phantom device certificate, the intruder requests a long-lived Primary Resident Smartcard and its matching cryptographic session key, allowing them to stamp fresh multi-factor-satisfied cloud passes persistently until defenders delete the rogue device.',
        storyMappings: [
          {
            storyTerm: 'Long-lived Primary Resident Smartcard',
            technicalTerm: 'Entra ID Primary Refresh Token (PRT) carrying persistent MFA claims',
            tone: 'amber',
          },
          {
            storyTerm: 'Matching cryptographic session key',
            technicalTerm: 'Derived PRT session key enabling ROADtools to mint fresh x-ms-RefreshTokenCredential cookies',
            tone: 'sky',
          },
          {
            storyTerm: 'Persistent access across cloud applications',
            technicalTerm: 'Replaying PRT-derived cookies to access Microsoft 365, Azure, and Graph APIs',
            tone: 'rose',
          },
          {
            storyTerm: 'Ejecting the phantom laptop permanently',
            technicalTerm: 'Disabling/deleting the rogue DeviceId in Entra ID and revoking all refresh tokens',
            tone: 'emerald',
          },
        ],
      },
    },
  };
