import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a courier bridge building connecting an on-premises castle registry to a rooftop cloud headquarters. Inside the bridge cellar sits a locked database holding the courier master password that syncs every castle citizen into the cloud; an intruder breaks into the bridge building, uses the bridge own built-in unscrambling lens to read that courier password aloud, empties the castle ledger, and stamps forged seamless-entry passes straight into the cloud tower.',
      storyMappings: [
        {
          storyTerm: 'Locked cellar database inside the courier bridge building',
          technicalTerm: 'Entra Connect ADSync SQL LocalDB (ADSync.mdf / mms_management_agent table)',
          tone: 'amber',
        },
        {
          storyTerm: 'Bridge own built-in unscrambling lens',
          technicalTerm: 'PowerShell loading mcrypt.dll to DPAPI-decrypt the encrypted MSOL_<hex> password',
          tone: 'sky',
        },
        {
          storyTerm: 'Emptying the castle master ledger with the courier key',
          technicalTerm: 'Executing Active Directory DCSync using the over-privileged MSOL_ service account',
          tone: 'rose',
        },
        {
          storyTerm: 'Stamping forged seamless-entry passes into the cloud tower',
          technicalTerm: 'Extracting AZUREADSSOACC$ Kerberos key to forge Silver Tickets into Microsoft 365',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After gaining administrator keys on the directory-sync bridge server, the intruder impersonates the local sync clerk to open the cellar database drawer holding the encrypted courier secret and its locked key wrapper.',
        storyMappings: [
          {
            storyTerm: 'Directory-sync bridge server',
            technicalTerm: 'On-premises Microsoft Entra Connect (Azure AD Connect) synchronization host',
            tone: 'amber',
          },
          {
            storyTerm: 'Impersonating the local sync clerk',
            technicalTerm: 'Querying ADSync SQL LocalDB running under NT SERVICE\\ADSync privileges',
            tone: 'sky',
          },
          {
            storyTerm: 'Cellar database drawer holding encrypted secrets',
            technicalTerm: 'ADSync.mdf tables mms_management_agent and mms_server_configuration',
            tone: 'rose',
          },
          {
            storyTerm: 'Watchdog noticing unauthorized cellar entry',
            technicalTerm: 'Sysmon EventID 1 flagging SqlLocalDB.exe info ADSync or odd access to ADSync.mdf',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation recording command lines) showing SqlLocalDB.exe info ADSync or non-ADSync binaries accessing C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf (exposing credential extraction attempts against the hybrid identity bridge).',
      },
      2: {
        storyAnalogy:
          'Rather than breaking the encryption mathematically, the intruder loads the bridge server own official decryption library directly into a script, letting the bridge politely unwrap and hand over the plaintext MSOL master courier password.',
        storyMappings: [
          {
            storyTerm: 'Bridge server own official decryption library',
            technicalTerm: 'Signed Microsoft mcrypt.dll loaded directly inside PowerShell (AADInternals)',
            tone: 'amber',
          },
          {
            storyTerm: 'Politely unwrapping the encrypted wrapper',
            technicalTerm: 'DPAPI decryption of the keyset protecting the MSOL_<hex> connector credential',
            tone: 'sky',
          },
          {
            storyTerm: 'Plaintext master courier password',
            technicalTerm: 'Recovered cleartext password for the on-premises MSOL_<hex> AD sync account',
            tone: 'rose',
          },
          {
            storyTerm: 'Why this key is a crown jewel',
            technicalTerm: 'MSOL_ holds Replicating Directory Changes All rights across the entire AD forest',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Armed with the courier password, the intruder synchronizes every single password hash out of the on-premises castle vault, lifts the cloud seamless-login stamp, and mints forged cloud passes that walk straight into corporate cloud mailboxes without typing a password.',
        storyMappings: [
          {
            storyTerm: 'Synchronizing every hash out of the castle vault',
            technicalTerm: 'Executing DCSync against the Domain Controller using the MSOL_ account',
            tone: 'amber',
          },
          {
            storyTerm: 'Lifting the cloud seamless-login stamp',
            technicalTerm: 'Dumping the AZUREADSSOACC$ computer account Kerberos key via DCSync',
            tone: 'sky',
          },
          {
            storyTerm: 'Minting forged passes walking straight into cloud mailboxes',
            technicalTerm: 'Forging Seamless SSO Kerberos tickets to impersonate any synced Entra ID user',
            tone: 'rose',
          },
          {
            storyTerm: 'Total hybrid on-prem to cloud takeover',
            technicalTerm: 'Compromise of both local Active Directory and federated Microsoft 365 cloud accounts',
            tone: 'emerald',
          },
        ],
      },
    },
  };
