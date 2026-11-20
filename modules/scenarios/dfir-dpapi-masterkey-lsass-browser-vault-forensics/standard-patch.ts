import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an office campus where every employee desk safe is locked by a personal brass key whose spare backup copy sits inside the headquarters central vault. An intruder gathers the locked desk safes containing browser passwords and saved credentials, flashes stolen headquarters authority to ask the central backup window to unwrap the personal brass key, and then unlocks every private employee pouch quietly offline.',
      storyMappings: [
        {
          storyTerm: 'Locked desk safes storing browser notebooks and credential pouches',
          technicalTerm: 'Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials and Chromium Login Data',
          tone: 'amber',
        },
        {
          storyTerm: 'Personal brass key paired with a headquarters backup copy',
          technicalTerm: 'Preferred DPAPI MasterKey GUID file in %APPDATA%\\Microsoft\\Protect containing Domain Backup Key',
          tone: 'sky',
        },
        {
          storyTerm: 'Asking the headquarters backup window to unwrap the brass key',
          technicalTerm: 'Domain Controller MS-BKRP BackupKey RPC recovery logged as EventID 4693',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking every employee pouch quietly offline',
          technicalTerm: 'CryptUnprotectData / dpapick3 decrypting .vcrd vaults, Chromium Login Data, and cookies',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Quietly rifling through an employee workstation drawers, the intruder collects the locked credential pouches and checks the tiny serial tag stamped on each pouch to see which personal brass MasterKey unlocks them.',
        storyMappings: [
          {
            storyTerm: 'Locked credential pouches in workstation drawers',
            technicalTerm: 'Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\ and Chromium Login Data',
            tone: 'amber',
          },
          {
            storyTerm: 'Tiny serial tag stamped on each pouch',
            technicalTerm: 'Embedded MasterKey GUID referencing the matching file under %APPDATA%\\Microsoft\\Protect',
            tone: 'sky',
          },
          {
            storyTerm: 'Personal brass key kept inside a locked case',
            technicalTerm: 'User-encrypted 64-byte DPAPI MasterKey file protected by user password and domain backup key',
            tone: 'rose',
          },
          {
            storyTerm: 'Workstation secret inventory',
            technicalTerm: 'Target saved web passwords, session cookies, RDP credentials, and Windows Vault items',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Rather than guessing the employee personal lock code, the intruder walks up to the headquarters emergency key-recovery desk with the encrypted backup wrapper from the employee key file, triggering an official recovery call that hands back the unwrapped personal brass key while stamping a vault receipt.',
        storyMappings: [
          {
            storyTerm: 'Encrypted backup wrapper inside the key file',
            technicalTerm: 'Domain Backup MasterKey encrypted with the Active Directory Domain PVK key',
            tone: 'amber',
          },
          {
            storyTerm: 'Headquarters emergency key-recovery desk',
            technicalTerm: 'Domain Controller MS-BKRP (BackupKey Remote Protocol) RPC service',
            tone: 'sky',
          },
          {
            storyTerm: 'Official vault receipt stamped during key unwrap',
            technicalTerm: 'Domain Controller Windows Security EventID 4693 (Recovery of DPAPI backup key)',
            tone: 'rose',
          },
          {
            storyTerm: 'Unwrapped personal brass key returned',
            technicalTerm: 'Plaintext 64-byte SHA-1 DPAPI MasterKey recovered without cracking the user password',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Holding the freshly unwrapped personal brass key in their hand, the intruder opens every stolen credential pouch and browser safe offline in seconds, pouring out saved passwords, authentication cookies, and cloud logins.',
        storyMappings: [
          {
            storyTerm: 'Freshly unwrapped personal brass key',
            technicalTerm: 'Recovered plaintext 64-byte DPAPI MasterKey material',
            tone: 'amber',
          },
          {
            storyTerm: 'Opening every credential pouch offline',
            technicalTerm: 'Invoking CryptUnprotectData or offline dpapick3 against stolen DPAPI blobs',
            tone: 'sky',
          },
          {
            storyTerm: 'Browser safe contents spilled out',
            technicalTerm: 'Decrypted Chromium Login Data passwords, Local State AES key, and session cookies',
            tone: 'rose',
          },
          {
            storyTerm: 'Windows Vault credentials exposed',
            technicalTerm: 'Decrypted .vcrd Windows Credential Manager secrets enabling further lateral movement',
            tone: 'emerald',
          },
        ],
      },
    },
  };
