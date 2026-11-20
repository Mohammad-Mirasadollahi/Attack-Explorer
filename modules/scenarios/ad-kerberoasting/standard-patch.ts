import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a grand hotel where any ordinary guest can walk up to the concierge desk and request a wax-sealed banquet voucher for the executive kitchen, sealed with the head chef personal passcode. A clever guest asks the concierge to seal the voucher with an outdated weak wax cipher, walks back to their private room to crack the chef passcode offline at leisure, and then marches straight into the executive kitchen to install a permanent back-door helper.',
      storyMappings: [
        {
          storyTerm: 'Ordinary guest requesting a weak wax-sealed banquet voucher',
          technicalTerm: 'Standard domain user requesting an RC4-downgraded (0x17) Kerberos TGS ticket',
          tone: 'amber',
        },
        {
          storyTerm: 'Cracking the head chef passcode privately offline',
          technicalTerm: 'Exporting $krb5tgs$23$* hash and offline Hashcat brute-forcing of svc_mssql',
          tone: 'sky',
        },
        {
          storyTerm: 'Walking into the executive kitchen with the chef pass',
          technicalTerm: 'Lateral SMB LogonType 3 authentication to SQL01.corp.local as svc_mssql',
          tone: 'rose',
        },
        {
          storyTerm: 'Installing a permanent back-door helper in the kitchen',
          technicalTerm: 'PsExec remote PSEXESVC.exe service installation executing as SYSTEM',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing at the hotel concierge desk with nothing more than a regular guest room key, the intruder browses the public roster of special dining-hall accounts and asks for an executive kitchen pass sealed with an older, softer wax stamp that is easy to break later.',
        storyMappings: [
          {
            storyTerm: 'Regular guest room key',
            technicalTerm: 'Standard unprivileged domain user account (CORP\\m.davis)',
            tone: 'amber',
          },
          {
            storyTerm: 'Public roster of special dining-hall accounts',
            technicalTerm: 'Active Directory LDAP query enumerating Service Principal Names (SPNs)',
            tone: 'sky',
          },
          {
            storyTerm: 'Executive kitchen pass with an older soft wax stamp',
            technicalTerm: 'Kerberos TGS ticket for svc_mssql requested with TicketEncryptionType 0x17 (RC4-HMAC)',
            tone: 'rose',
          },
          {
            storyTerm: 'Hotel concierge ledger logging the odd stamp',
            technicalTerm: 'Domain Controller Windows Security EventID 4769 recording RC4 downgrade',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Windows Security EventID 4769 (Kerberos Service Ticket Operations on the Domain Controller) where TicketEncryptionType equals 0x17 (RC4-HMAC downgrade instead of AES-256) and ServiceName targets a high-privilege user service account such as svc_mssql from workstation 10.10.20.45 (identifying classic Kerberoasting ticket harvesting).',
      },
      2: {
        storyAnalogy:
          'Retreating to a private room far away from hotel cameras, the intruder runs thousands of rapid key guesses against the soft wax seal until the head chef real password pops open, then uses that genuine password to unlock the kitchen server room over the internal hallway.',
        storyMappings: [
          {
            storyTerm: 'Running rapid guesses privately away from cameras',
            technicalTerm: 'Offline Hashcat GPU cracking of exported $krb5tgs$23$* RC4 ticket hash',
            tone: 'amber',
          },
          {
            storyTerm: 'Head chef real password unlocked',
            technicalTerm: 'Recovered cleartext password or NTLM hash for service account svc_mssql',
            tone: 'sky',
          },
          {
            storyTerm: 'Unlocking the kitchen server room down the hall',
            technicalTerm: 'Lateral SMB network authentication to SQL01.corp.local (10.10.5.20)',
            tone: 'rose',
          },
          {
            storyTerm: 'Kitchen door ledger logging the network arrival',
            technicalTerm: 'Windows Security EventID 4624 (LogonType 3, NtLmSsp) on SQL01',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Windows Security EventID 4624 (Successful Account Logon) on SQL01.corp.local recording LogonType 3 (Network logon), AuthenticationPackageName NtLmSsp, and TargetUserName svc_mssql originating from workstation 10.10.20.45 (flagging interactive/lateral abuse of a database service account).',
      },
      3: {
        storyAnalogy:
          'Inside the unlocked kitchen corridor, the intruder slides an automated assistant package onto the staff supply shelf and registers it with the hotel shift foreman, launching a full master-keyed command console inside the kitchen vault.',
        storyMappings: [
          {
            storyTerm: 'Staff supply shelf',
            technicalTerm: 'Administrative SMB share \\\\sql01.corp.local\\ADMIN$',
            tone: 'amber',
          },
          {
            storyTerm: 'Automated assistant package',
            technicalTerm: 'Uploaded PSEXESVC.exe service binary dropped via PsExec',
            tone: 'sky',
          },
          {
            storyTerm: 'Registering with the hotel shift foreman',
            technicalTerm: 'Remote Service Control Manager installation logged as System EventID 7045',
            tone: 'rose',
          },
          {
            storyTerm: 'Full master-keyed command console',
            technicalTerm: 'Interactive NT AUTHORITY\\SYSTEM shell executed on SQL01',
            tone: 'emerald',
          },
        ],
      },
    },
  };
