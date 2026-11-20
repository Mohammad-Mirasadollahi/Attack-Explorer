import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a royal mint where sister vaults regularly synchronize their master gold ledgers over a private courier channel. Wearing a compromised supervisor badge from an ordinary office workstation, an intruder calls the royal mint pretending to be a sister vault, clears the special ledger-sync checkpoint, and receives a freshly packaged copy of every master household seal without ever setting foot inside the vault room.',
      storyMappings: [
        {
          storyTerm: 'Pretending to be a sister vault on the private courier channel',
          technicalTerm: 'MS-DRSR RPC bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 from workstation IP',
          tone: 'amber',
        },
        {
          storyTerm: 'Clearing the special ledger-sync checkpoint',
          technicalTerm: 'Domain Controller Security EventID 4662 logging DS-Replication-Get-Changes-All GUIDs',
          tone: 'sky',
        },
        {
          storyTerm: 'Receiving a freshly packaged copy of every household seal',
          technicalTerm: 'DRS_MSG_GETNCCHANGESREPLY delivering krbtgt AES-256 and NTLM hashes',
          tone: 'rose',
        },
        {
          storyTerm: 'Calling from an ordinary office workstation instead of a real sister vault',
          technicalTerm: 'Non-DC source IP (10.10.4.22) requesting directory replication over RPC',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dialing straight from a regular employee desk rather than a registered sister vault, the intruder rings the royal mint exclusive directory-sync extension using a hijacked high-clearance pass.',
        storyMappings: [
          {
            storyTerm: 'Regular employee desk dialing the mint',
            technicalTerm: 'Compromised workstation IP (10.10.4.22) authenticating over SMB/RPC (EventID 4624 Type 3)',
            tone: 'amber',
          },
          {
            storyTerm: 'Exclusive directory-sync extension',
            technicalTerm: 'MS-DRSR DRSUAPI interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2',
            tone: 'sky',
          },
          {
            storyTerm: 'Hijacked high-clearance pass',
            technicalTerm: 'Compromised account holding Replicating Directory Changes extended rights',
            tone: 'rose',
          },
          {
            storyTerm: 'Royal mint central registrar',
            technicalTerm: 'Target Active Directory Domain Controller CORP-DC01',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the caller asks to download the secret password ledger, the royal mint security clerk checks two distinct special permission stamps on the caller badge (one permitting directory changes and a second permitting secret fields) and writes an unforgeable receipt in the vault access book.',
        storyMappings: [
          {
            storyTerm: 'Asking to download the secret password ledger',
            technicalTerm: 'Invoking IDL_DRSGetNCChanges (Opnum 3) replication request',
            tone: 'amber',
          },
          {
            storyTerm: 'First permission stamp for directory changes',
            technicalTerm: 'DS-Replication-Get-Changes GUID (1131f6aa-9c07-11d1-f79f-00c04fc2dcd2)',
            tone: 'sky',
          },
          {
            storyTerm: 'Second permission stamp for secret fields',
            technicalTerm: 'DS-Replication-Get-Changes-All GUID (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
            tone: 'rose',
          },
          {
            storyTerm: 'Unforgeable receipt in the vault access book',
            technicalTerm: 'Windows Security EventID 4662 (ControlAccess) logged on CORP-DC01',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Satisfied by the permission stamps, the royal mint seals up the master kingdom stamp and every citizen secret seal inside an encrypted courier pouch and ships them straight back to the intruder desk.',
        storyMappings: [
          {
            storyTerm: 'Encrypted courier pouch shipped back',
            technicalTerm: 'DRS_MSG_GETNCCHANGESREPLY encrypted with the RPC session key',
            tone: 'amber',
          },
          {
            storyTerm: 'Master kingdom stamp inside the pouch',
            technicalTerm: 'krbtgt account AES-256 and NTLM hashes enabling Golden Ticket forgery',
            tone: 'sky',
          },
          {
            storyTerm: 'Additional citizen secret seals',
            technicalTerm: 'Replicated SupplementalCredentials and unicodePwd password hashes',
            tone: 'rose',
          },
          {
            storyTerm: 'No physical files ever touched on the vault floor',
            technicalTerm: 'Pure network-level memory extraction avoiding ntds.dit disk access',
            tone: 'emerald',
          },
        ],
      },
    },
  };
