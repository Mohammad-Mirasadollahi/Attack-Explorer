import type { CategoryStandardPatchMap } from './types';

/**
 * Category 2: ACTIVE_DIRECTORY (16 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 16 Active Directory scenarios.
 */
export const ACTIVE_DIRECTORY_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'ad-kerberoasting': {
    briefing: {
      storyAnalogy:
        'Imagine a grand hotel where any ordinary guest can walk up to the concierge desk and request a wax-sealed banquet voucher for the executive kitchen, sealed with the head chef personal passcode. A clever guest asks the concierge to seal the voucher with an outdated weak wax cipher, walks back to their private room to crack the chef passcode offline at leisure, and then marches straight into the executive kitchen to install a permanent back-door helper.',
      storyMappings: [
        {
          storyTerm: 'Ordinary guest requesting a weak wax-sealed banquet voucher',
          technicalTerm: 'Standard domain user requesting an RC4-downgraded (0x17) Kerberos TGS ticket',
        },
        {
          storyTerm: 'Cracking the head chef passcode privately offline',
          technicalTerm: 'Exporting $krb5tgs$23$* hash and offline Hashcat brute-forcing of svc_mssql',
        },
        {
          storyTerm: 'Walking into the executive kitchen with the chef pass',
          technicalTerm: 'Lateral SMB LogonType 3 authentication to SQL01.corp.local as svc_mssql',
        },
        {
          storyTerm: 'Installing a permanent back-door helper in the kitchen',
          technicalTerm: 'PsExec remote PSEXESVC.exe service installation executing as SYSTEM',
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
          },
          {
            storyTerm: 'Public roster of special dining-hall accounts',
            technicalTerm: 'Active Directory LDAP query enumerating Service Principal Names (SPNs)',
          },
          {
            storyTerm: 'Executive kitchen pass with an older soft wax stamp',
            technicalTerm: 'Kerberos TGS ticket for svc_mssql requested with TicketEncryptionType 0x17 (RC4-HMAC)',
          },
          {
            storyTerm: 'Hotel concierge ledger logging the odd stamp',
            technicalTerm: 'Domain Controller Windows Security EventID 4769 recording RC4 downgrade',
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
          },
          {
            storyTerm: 'Head chef real password unlocked',
            technicalTerm: 'Recovered cleartext password or NTLM hash for service account svc_mssql',
          },
          {
            storyTerm: 'Unlocking the kitchen server room down the hall',
            technicalTerm: 'Lateral SMB network authentication to SQL01.corp.local (10.10.5.20)',
          },
          {
            storyTerm: 'Kitchen door ledger logging the network arrival',
            technicalTerm: 'Windows Security EventID 4624 (LogonType 3, NtLmSsp) on SQL01',
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
          },
          {
            storyTerm: 'Automated assistant package',
            technicalTerm: 'Uploaded PSEXESVC.exe service binary dropped via PsExec',
          },
          {
            storyTerm: 'Registering with the hotel shift foreman',
            technicalTerm: 'Remote Service Control Manager installation logged as System EventID 7045',
          },
          {
            storyTerm: 'Full master-keyed command console',
            technicalTerm: 'Interactive NT AUTHORITY\\SYSTEM shell executed on SQL01',
          },
        ],
      },
    },
  },

  'unit42-scattered-spider-cloud': {
    briefing: {
      storyAnalogy:
        'Imagine a smooth-talking con artist who calls a corporate campus helpdesk reciting an engineer employee number and manager name gathered from public directories, convincing the clerk to pair a brand-new pocket buzzer onto that engineer badge. Walking calmly through the front gate, the impostor reads internal instruction binders, installs commercial remote-support intercoms onto office desks, and quietly adds their own master keys to both the penthouse cloud suite and the basement server racks.',
      storyMappings: [
        {
          storyTerm: 'Con artist phoning the helpdesk to pair a rogue pocket buzzer',
          technicalTerm: 'Helpdesk vishing social engineering registering an attacker MFA device',
        },
        {
          storyTerm: 'Reading instruction binders and bolting on commercial intercoms',
          technicalTerm: 'SSO dashboard access harvesting Confluence/SharePoint runbooks and installing RMM tools',
        },
        {
          storyTerm: 'Adding a private master pass to the penthouse cloud suite',
          technicalTerm: 'AWS CreateSAMLProvider, UpdateAssumeRolePolicy, and privileged AssumeRole calls',
        },
        {
          storyTerm: 'Adding themselves to the basement server-rack board',
          technicalTerm: 'Active Directory privilege escalation into the VMware ESX Admins group',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Armed with personal facts scraped from public profiles, the caller phones the IT helpdesk pretending to be a locked-out engineer who lost their phone, smoothly persuading the clerk to reset the password and enroll the caller own pocket buzzer.',
        storyMappings: [
          {
            storyTerm: 'Personal facts scraped from public profiles',
            technicalTerm: 'Employee ID, birth date, and manager name gathered via OSINT reconnaissance',
          },
          {
            storyTerm: 'Persuading the helpdesk clerk by voice',
            technicalTerm: 'Voice phishing (vishing) targeting enterprise IT service desk personnel',
          },
          {
            storyTerm: 'Enrolling the caller own pocket buzzer',
            technicalTerm: 'Registering an attacker-controlled MFA authenticator or SIM-swapped number',
          },
          {
            storyTerm: 'Locked-out engineer badge hijacked',
            technicalTerm: 'Takeover of a high-privilege IT or DevOps engineer corporate identity',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Stepping effortlessly through the company central single-door portal, the impostor browses the internal wiki binders for vault maps and cloud keys, then installs ordinary commercial tech-support intercoms on virtual desks so they look just like routine IT staff.',
        storyMappings: [
          {
            storyTerm: 'Company central single-door portal',
            technicalTerm: 'Enterprise Okta or Entra ID Single Sign-On (SSO) dashboard',
          },
          {
            storyTerm: 'Internal wiki binders holding vault maps',
            technicalTerm: 'Confluence, SharePoint, and Slack runbooks containing infrastructure credentials',
          },
          {
            storyTerm: 'Commercial tech-support intercoms',
            technicalTerm: 'Legitimate Remote Monitoring and Management (RMM) tools deployed for stealthy access',
          },
          {
            storyTerm: 'Virtual desks inside the campus',
            technicalTerm: 'Corporate Citrix or VDI jump desktops providing internal network reach',
          },
        ],
      },
      3: {
        storyAnalogy:
          'From the trusted identity hub, the impostor walks into both the rooftop cloud control center and the basement server vault, registering a rogue backdoor identity bridge in the cloud while writing their own name onto the master hypervisor committee list.',
        storyMappings: [
          {
            storyTerm: 'Rogue backdoor identity bridge in the cloud',
            technicalTerm: 'AWS CreateSAMLProvider and UpdateAssumeRolePolicy federation backdoor',
          },
          {
            storyTerm: 'Stepping into supreme cloud authority',
            technicalTerm: 'Anomalous AWS STS AssumeRole calls targeting administrative roles',
          },
          {
            storyTerm: 'Master hypervisor committee list',
            technicalTerm: 'Active Directory ESX Admins group granting full VMware ESXi root control',
          },
          {
            storyTerm: 'Dual control-plane takeover',
            technicalTerm: 'Simultaneous compromise of cloud IaaS and on-premises virtualization infrastructure',
          },
        ],
        detectionAndEvidence:
          'Correlate AWS CloudTrail and Microsoft Entra Audit Logs (central cloud identity ledgers capturing control-plane mutations) for CreateSAMLProvider, UpdateAssumeRolePolicy, and anomalous AssumeRole events alongside Active Directory EventID 4728 group membership additions to ESX Admins (catching dual cloud and hypervisor takeover).',
      },
    },
  },

  'ms-volt-typhoon-lotl': {
    briefing: {
      storyAnalogy:
        'Imagine a patient industrial spy who never carries foreign lockpicks or masks across the border. First, the spy blends in by riding ordinary neighborhood delivery vans right up to the factory gate; next, the spy uses the factory own official backup photocopier to copy the locked master employee vault ledger cleanly; finally, the spy props silent mirror-boxes inside a hallway utility closet to bounce stolen parcels back out through standard building plumbing.',
      storyMappings: [
        {
          storyTerm: 'Riding ordinary neighborhood delivery vans to the gate',
          technicalTerm: 'Proxying connections through compromised KV-Botnet SOHO home and office routers',
        },
        {
          storyTerm: 'Using the factory own official backup photocopier',
          technicalTerm: 'Built-in ntdsutil.exe "ac i ntds" "ifm" dumping locked ntds.dit without malware',
        },
        {
          storyTerm: 'Silent mirror-boxes wired inside a hallway closet',
          technicalTerm: 'Windows netsh interface portproxy multi-hop traffic relay (Sysmon EventID 13)',
        },
        {
          storyTerm: 'Carrying zero foreign lockpicks',
          technicalTerm: 'Pure Living-off-the-Land (LotL) execution using signed native Windows binaries',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Instead of arriving in a marked foreign truck that gate guards instantly stop, the spy hops through a chain of ordinary local neighborhood vans and issues a quiet remote maintenance instruction over the building standard management intercom straight to the main vault office.',
        storyMappings: [
          {
            storyTerm: 'Chain of ordinary local neighborhood vans',
            technicalTerm: 'KV-Botnet proxy mesh of compromised small-office/home-office (SOHO) routers',
          },
          {
            storyTerm: 'Standard management intercom',
            technicalTerm: 'Windows Management Instrumentation (WMI / WmiPrvSE.exe) lateral execution',
          },
          {
            storyTerm: 'Main vault office',
            technicalTerm: 'Active Directory Domain Controller CORP-DC01 (10.10.0.5)',
          },
          {
            storyTerm: 'Quiet remote maintenance instruction',
            technicalTerm: 'WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm"',
          },
        ],
        detectionAndEvidence:
          'Correlate CISA AA24-038A indicators with Sysmon EventID 1 (Process Creation recording exact parent-child lineage and arguments) on CORP-DC01 showing WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm" (high-confidence proof of Living-off-the-Land credential harvesting on a Domain Controller).',
      },
      2: {
        storyAnalogy:
          'Because the master password ledger stays clamped shut under heavy lock while the office is open, the spy simply flips on the office own official emergency migration photocopier, cleanly copying both the ledger book and its matching key drawer into a neat staging tray.',
        storyMappings: [
          {
            storyTerm: 'Master password ledger clamped shut during business hours',
            technicalTerm: 'Exclusively locked Active Directory database C:\\Windows\\NTDS\\ntds.dit',
          },
          {
            storyTerm: 'Official emergency migration photocopier',
            technicalTerm: 'Signed Windows utility ntdsutil.exe invoked with Install From Media (ifm) mode',
          },
          {
            storyTerm: 'Matching key drawer copied alongside the ledger',
            technicalTerm: 'SYSTEM registry hive saved alongside ntds.dit to decrypt every domain hash',
          },
          {
            storyTerm: 'Built-in engine stamp left in the copier log',
            technicalTerm: 'ESENT Application Event logs documenting snapshot creation and database streaming',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To keep moving quietly through internal corridors without ever installing foreign radio gear, the spy configures a built-in hallway forwarding mirror on an intermediate jump desk that bounces traffic silently from inner rooms straight out to the external neighborhood van.',
        storyMappings: [
          {
            storyTerm: 'Built-in hallway forwarding mirror',
            technicalTerm: 'Windows netsh interface portproxy add v4tov4 TCP relay rule',
          },
          {
            storyTerm: 'Intermediate jump desk',
            technicalTerm: 'Internal management jump host SRV-MGMT-01 (10.10.15.20)',
          },
          {
            storyTerm: 'Permanent brass label bolted inside the control panel',
            technicalTerm: 'Registry write under HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp',
          },
          {
            storyTerm: 'Silent alarm noting the panel change',
            technicalTerm: 'Sysmon EventID 13 (RegistryValueSet) capturing unauthorized PortProxy configuration',
          },
        ],
      },
    },
  },

  'ms-midnight-blizzard-oauth': {
    briefing: {
      storyAnalogy:
        'Imagine a patient espionage crew softly trying one spare key per evening from scattered neighborhood cars against a forgotten backyard testing shed that never got a modern two-factor deadbolt. Once inside the dusty shed, they discover an old cross-campus courier badge that was accidentally left with master mailroom powers, use it to print brand-new official courier badges inside the corporate headquarters, and silently haul out executive mailbags through the automated mail chute.',
      storyMappings: [
        {
          storyTerm: 'Trying one key per evening from scattered neighborhood cars',
          technicalTerm: 'Low-volume residential-proxy password spray evading IP lockouts and alerts',
        },
        {
          storyTerm: 'Forgotten backyard testing shed lacking a two-factor deadbolt',
          technicalTerm: 'Legacy non-production test tenant account without MFA enabled',
        },
        {
          storyTerm: 'Old cross-campus courier badge printing fresh headquarters badges',
          technicalTerm: 'Legacy OAuth test app with elevated permissions registering new privileged Service Principals',
        },
        {
          storyTerm: 'Hauling out executive mailbags through the automated mail chute',
          technicalTerm: 'Machine-to-machine client_credentials OAuth exfiltration via Exchange Web Services (EWS)',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Avoiding noisy repeated knocks that would wake the guard dogs, the spy crew tries only a handful of common passwords slowly across hundreds of ordinary household street addresses until a forgotten back-lot testing shed with no second-factor padlock quietly clicks open.',
        storyMappings: [
          {
            storyTerm: 'Hundreds of ordinary household street addresses',
            technicalTerm: 'Distributed residential proxy IP network defeating IP reputation blocks',
          },
          {
            storyTerm: 'Trying only a handful of passwords slowly',
            technicalTerm: 'Low-and-slow password spray staying below Entra ID Smart Lockout thresholds',
          },
          {
            storyTerm: 'Forgotten back-lot testing shed with no second padlock',
            technicalTerm: 'Legacy non-production test tenant account lacking MFA enforcement',
          },
          {
            storyTerm: 'Gate sign-in book recording dispersed arrivals',
            technicalTerm: 'Microsoft Entra ID SigninLogs showing distributed ASNs hitting legacy accounts',
          },
        ],
        detectionAndEvidence:
          'Analyze Microsoft Entra ID SigninLogs (cloud identity telemetry capturing every authentication attempt, ASN, and MFA claim) for low-volume distributed password sprays rotating across residential proxy ASNs against single-factor legacy or non-production accounts.',
      },
      2: {
        storyAnalogy:
          'Rummaging inside the unlocked testing shed, the spies uncover an abandoned automated courier badge that still carries wide building-wide authority into the main corporate tower, and immediately use it to mint shiny new official machine badges armed with full mailroom keys.',
        storyMappings: [
          {
            storyTerm: 'Abandoned automated courier badge in the shed',
            technicalTerm: 'Legacy cross-tenant OAuth test application holding elevated Graph permissions',
          },
          {
            storyTerm: 'Minting shiny new official machine badges',
            technicalTerm: 'Creating new rogue Entra ID OAuth applications and Service Principals',
          },
          {
            storyTerm: 'Full mailroom master keys assigned to the new badges',
            technicalTerm: 'Granting full_access_as_app Exchange Web Services (EWS) application role',
          },
          {
            storyTerm: 'Stepping from the back shed into the main corporate tower',
            technicalTerm: 'Cross-tenant pivot from legacy test environment into production Microsoft 365',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Presenting their freshly minted machine-only courier badge straight at the automated postal bay, the spies bypass human lobby guards altogether and quietly wheel out corporate leadership correspondence without ever triggering a human sign-in prompt.',
        storyMappings: [
          {
            storyTerm: 'Machine-only courier badge skipping lobby guards',
            technicalTerm: 'OAuth 2.0 grant_type=client_credentials non-interactive daemon authentication',
          },
          {
            storyTerm: 'Automated postal bay',
            technicalTerm: 'Exchange Web Services (EWS) API accessed with full_access_as_app scope',
          },
          {
            storyTerm: 'Corporate leadership correspondence wheeled out',
            technicalTerm: 'Targeted exfiltration of senior executive and security team email mailboxes',
          },
          {
            storyTerm: 'Silent access surviving user password resets',
            technicalTerm: 'Persistent OAuth app secret credentials independent of human user accounts',
          },
        ],
      },
    },
  },

  'nopac-samaccountname-cve-2021-42278-42287': {
    briefing: {
      storyAnalogy:
        'Imagine a government passport office where any regular clerk is allowed to create up to ten trainee badges. A crafty clerk creates a blank trainee badge, rubs off the trainee symbol so the badge name reads identically to the Chief Director name, grabs an entry voucher under that name, restores the trainee name, and then hands the voucher to a confused back-office clerk who cannot find the old name and blindly assumes the voucher belongs to the real Chief Director.',
      storyMappings: [
        {
          storyTerm: 'Creating a trainee badge and rubbing off the trainee symbol',
          technicalTerm: 'Abusing ms-DS-MachineAccountQuota to rename sAMAccountName to CORP-DC01 without trailing $ (CVE-2021-42278)',
        },
        {
          storyTerm: 'Restoring the trainee name and confusing the back-office clerk',
          technicalTerm: 'Renaming back to FAKEPC01$ and triggering KDC S4U2self trailing-$ fallback (CVE-2021-42287)',
        },
        {
          storyTerm: 'Confused clerk handing over a Chief Director master pass',
          technicalTerm: 'KDC issuing a privileged cifs/CORP-DC01 service ticket containing DC PAC groups',
        },
        {
          storyTerm: 'Emptying the national registry vault with the forged pass',
          technicalTerm: 'Executing DCSync against CORP-DC01.corp.local to dump all domain hashes',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a generous default office rule that lets any standard employee register up to ten helper badges, the intruder registers a fresh machine badge, strips away its trailing helper mark so its label matches the Chief Vault Controller exactly, and collects a freshly stamped lobby voucher.',
        storyMappings: [
          {
            storyTerm: 'Generous rule allowing ten helper badges',
            technicalTerm: 'Default Active Directory ms-DS-MachineAccountQuota attribute value of 10',
          },
          {
            storyTerm: 'Stripping the trailing helper mark to match the Chief Controller',
            technicalTerm: 'Renaming machine account sAMAccountName to CORP-DC01 without trailing $ (CVE-2021-42278)',
          },
          {
            storyTerm: 'Collecting a freshly stamped lobby voucher',
            technicalTerm: 'Requesting a valid Kerberos TGT issued for the spoofed name CORP-DC01',
          },
          {
            storyTerm: 'Missing clerk check on the badge suffix',
            technicalTerm: 'Lack of AD enforcement requiring computer accounts to retain a trailing $',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Before presenting that lobby voucher, the intruder hastily renames their helper badge back to a harmless name so no badge named CORP-DC01 exists anymore. When the ticket window searches for CORP-DC01 and finds nothing, its built-in fallback rule automatically tacks a dollar sign onto the search and mistakenly pulls out the real Chief Controller master privileges instead.',
        storyMappings: [
          {
            storyTerm: 'Renaming the helper badge back to a harmless label',
            technicalTerm: 'Renaming sAMAccountName back to FAKEPC01$ over LDAP while holding the TGT',
          },
          {
            storyTerm: 'Ticket window failing to find the exact name',
            technicalTerm: 'KDC S4U2self lookup failing to locate CORP-DC01 during service ticket issuance',
          },
          {
            storyTerm: 'Fallback rule tacking a dollar sign onto the search',
            technicalTerm: 'CVE-2021-42287 KDC fallback resolving CORP-DC01$ (the real Domain Controller)',
          },
          {
            storyTerm: 'Issuing a real Chief Controller pass to an impostor',
            technicalTerm: 'Forged cifs/CORP-DC01 service ticket stamped with Domain Controller PAC authority',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Walking directly up to the master vault counter with the genuinely stamped Chief Controller pass in hand, the intruder invokes the emergency vault-sync command and walks away with every secret seal in the entire organization in under thirty seconds.',
        storyMappings: [
          {
            storyTerm: 'Genuinely stamped Chief Controller pass',
            technicalTerm: 'Valid cifs/CORP-DC01.corp.local Kerberos TGS carrying Enterprise Domain Controller PAC',
          },
          {
            storyTerm: 'Invoking the emergency vault-sync command',
            technicalTerm: 'Executing DRSUAPI DCSync replication directly against CORP-DC01',
          },
          {
            storyTerm: 'Every secret seal in the organization',
            technicalTerm: 'Domain krbtgt and Administrator NTLM and Kerberos AES-256 keys',
          },
          {
            storyTerm: 'Zero prior privileged access needed',
            technicalTerm: 'Full unprivileged-user to Domain Admin escalation in seconds',
          },
        ],
      },
    },
  },

  'zerologon-netlogon-cve-2020-1472': {
    briefing: {
      storyAnalogy:
        'Imagine a fortress gatehouse whose high-tech scrambling lock accidentally clicks open roughly once in every 256 attempts whenever someone pushes in a completely blank row of all-zero pins. Standing outside without a single credential, an intruder rattles the gate with blank pins for a fraction of a second until the bolt springs open, wipes the fortress own master vault password completely blank, empties the royal registry safe, and hastily screws the original lock back in place so the gate does not jam.',
      storyMappings: [
        {
          storyTerm: 'Rattling the gate with blank all-zero pins (~256 tries)',
          technicalTerm: 'NetrServerAuthenticate3 AES-CFB8 all-zero IV/ClientChallenge bypass (CVE-2020-1472)',
        },
        {
          storyTerm: 'Wiping the fortress own master vault password completely blank',
          technicalTerm: 'NetrServerPasswordSet2 overwriting CORP-DC01$ machine password to empty string',
        },
        {
          storyTerm: 'Emptying the royal registry safe as the fortress itself',
          technicalTerm: 'Authenticating as CORP-DC01$ to execute DCSync and dump krbtgt/Administrator hashes',
        },
        {
          storyTerm: 'Hastily screwing the original lock back in place',
          technicalTerm: 'Restoring original $MACHINE.ACC secret to avoid breaking AD replication',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Because the fortress gatehouse lock mistakenly reuses an all-zero starting position every time it scrambles a visitor knock, roughly one in every 256 blank zero-pin knocks produces an all-zero match. In under three seconds, the intruder sends 256 blank knocks and swings the fortress gate wide open with zero credentials.',
        storyMappings: [
          {
            storyTerm: 'Reusing an all-zero starting position in the lock',
            technicalTerm: 'Flawed AES-CFB8 mode using a static all-zero Initialization Vector in MS-NRPC',
          },
          {
            storyTerm: '256 blank zero-pin knocks in under three seconds',
            technicalTerm: 'Burst of NetrServerReqChallenge / NetrServerAuthenticate3 calls with 0x0000000000000000',
          },
          {
            storyTerm: 'Gate swinging open with zero prior credentials',
            technicalTerm: 'Unauthenticated Netlogon session established to CORP-DC01 (CVE-2020-1472)',
          },
          {
            storyTerm: 'Watchtower alarm triggered by the rapid knocks',
            technicalTerm: 'Suricata SID 2030870 alert and Windows System EventID 5805 failure burst',
          },
        ],
        detectionAndEvidence:
          'Monitor IDS signatures such as Suricata SID 2030870 (network rule flagging NetrServerAuthenticate3 RPC bursts carrying 8-byte all-zero 0x0000000000000000 challenges) alongside Windows System EventID 5805 bursts on Domain Controllers (documenting rapid failed Netlogon computer authentications).',
      },
      2: {
        storyAnalogy:
          'Once past the gatehouse latch, the intruder turns off the sealed-envelope requirement on the conversation and hands the vault clerk an order replacing the fortress own computer lock combination with an empty blank password.',
        storyMappings: [
          {
            storyTerm: 'Turning off the sealed-envelope requirement',
            technicalTerm: 'Clearing the Netlogon Sealing flag (NegotiateFlags = 0x212fffff) during auth',
          },
          {
            storyTerm: 'Order replacing the fortress lock with an empty password',
            technicalTerm: 'NetrServerPasswordSet2 RPC call setting CORP-DC01$ password to empty',
          },
          {
            storyTerm: 'Anonymous stranger signing the official change ledger',
            technicalTerm: 'Windows Security EventID 4742 showing ANONYMOUS LOGON altering CORP-DC01$',
          },
          {
            storyTerm: 'Fortress temporarily locked out of its own twin towers',
            technicalTerm: 'Active Directory inter-DC trust disruption until original machine password is restored',
          },
        ],
        detectionAndEvidence:
          'Alert immediately on Windows Security EventID 4742 (Computer Account Changed on a Domain Controller) where SubjectUserName is ANONYMOUS LOGON and TargetUserName matches a Domain Controller computer account such as CORP-DC01$ (providing definitive proof of Zerologon password overwrite).',
      },
      3: {
        storyAnalogy:
          'Logging straight back into the fortress using the blank password of the fortress own master badge, the intruder copies every single household key out of the central vault, reads the fortress original brass key out of its private wall cabinet, and carefully puts the original lock back so nobody notices the gate broke.',
        storyMappings: [
          {
            storyTerm: 'Logging in with the blank fortress master badge',
            technicalTerm: 'Authenticating as CORP-DC01$ (member of Enterprise Domain Controllers)',
          },
          {
            storyTerm: 'Copying every household key from the central vault',
            technicalTerm: 'Executing DCSync to dump all Active Directory NTLM and Kerberos hashes',
          },
          {
            storyTerm: 'Reading the original key from the wall cabinet',
            technicalTerm: 'Extracting original $MACHINE.ACC secret from the DC local LSA registry',
          },
          {
            storyTerm: 'Putting the original lock back in place',
            technicalTerm: 'Restoring the authentic CORP-DC01$ computer account password to repair AD health',
          },
        ],
      },
    },
  },

  'printnightmare-spooler-cve-2021-34527': {
    briefing: {
      storyAnalogy:
        'Imagine a busy office tower whose central print-shop foreman carries master keys to every room in the building. Any ordinary worker can walk up to the print shop and submit a new printer driver request; by attaching a special skip-verification sticker and pointing the parts-configuration line to a remote warehouse outside the building, the worker tricks the foreman into fetching a rigged roller straight from the outsider warehouse and spinning it inside the master print room with full building authority.',
      storyMappings: [
        {
          storyTerm: 'Print-shop foreman carrying master keys to every room',
          technicalTerm: 'Windows Print Spooler service (spoolsv.exe) running as NT AUTHORITY\\SYSTEM',
        },
        {
          storyTerm: 'Special skip-verification sticker on the request form',
          technicalTerm: 'APD_INSTALL_WARNED_DRIVER (0x8000) flag bypassing ValidateObjectAccess() (CVE-2021-34527)',
        },
        {
          storyTerm: 'Pointing the parts line to an outsider warehouse',
          technicalTerm: 'DRIVER_CONTAINER pConfigFile pointing to an attacker UNC SMB share (evil.dll)',
        },
        {
          storyTerm: 'Foreman spinning the rigged roller inside the print room',
          technicalTerm: 'spoolsv.exe invoking LoadLibraryW() and executing DllMain as SYSTEM',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Approaching the print-shop request window with an ordinary low-rank employee badge, the intruder checks an obscure internal waiver box on the printer installation slip that accidentally causes the foreman to skip checking whether the requester actually has manager clearance.',
        storyMappings: [
          {
            storyTerm: 'Print-shop request window',
            technicalTerm: 'MS-RPRN / MS-PAR RpcAddPrinterDriverEx() remote RPC interface on spoolsv.exe',
          },
          {
            storyTerm: 'Obscure internal waiver box on the slip',
            technicalTerm: 'APD_INSTALL_WARNED_DRIVER (0x8000) flag passed in dwFileCopyFlags',
          },
          {
            storyTerm: 'Skipping the manager clearance check',
            technicalTerm: 'CVE-2021-34527 logic flaw bypassing ValidateObjectAccess() authorization',
          },
          {
            storyTerm: 'Ordinary low-rank employee badge',
            technicalTerm: 'Standard authenticated domain user remotely escalating to Domain Controller SYSTEM',
          },
        ],
      },
      2: {
        storyAnalogy:
          'On the driver installation form, the intruder pairs a legitimate factory manual on the top line with a sneaky external warehouse address on the configuration-file line, tricking the trusting foreman into walking across the street to copy the intruder rigged metal roller straight into the tower official spooler cabinet.',
        storyMappings: [
          {
            storyTerm: 'Legitimate factory manual on the top line',
            technicalTerm: 'Genuine Microsoft pDriverPath supplied inside DRIVER_CONTAINER',
          },
          {
            storyTerm: 'External warehouse address on the configuration line',
            technicalTerm: 'Attacker-controlled UNC path (\\\\attacker\\share\\evil.dll) placed in pConfigFile',
          },
          {
            storyTerm: 'Copying the rigged roller into the official cabinet',
            technicalTerm: 'spoolsv.exe copying evil.dll into C:\\Windows\\System32\\spool\\drivers\\x64\\3\\',
          },
          {
            storyTerm: 'Foreman acting as a blind courier',
            technicalTerm: 'Privileged SYSTEM spooler service fetching untrusted remote binaries over SMB',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The instant the print foreman snaps the copied roller into the master press to test its alignment, the rigged mechanism springs to life right inside the foreman own master-keyed room, handing the intruder total command of the entire server.',
        storyMappings: [
          {
            storyTerm: 'Snapping the copied roller into the press to test alignment',
            technicalTerm: 'spoolsv.exe calling LoadLibraryW() and DrvConvertDevMode() on evil.dll',
          },
          {
            storyTerm: 'Rigged mechanism springing to life',
            technicalTerm: 'Malicious DllMain payload executing immediately upon DLL load',
          },
          {
            storyTerm: 'Master-keyed room authority',
            technicalTerm: 'Code execution running as NT AUTHORITY\\SYSTEM inside spoolsv.exe',
          },
          {
            storyTerm: 'Print-shop security ledger recording the new part',
            technicalTerm: 'PrintService Operational EventID 316 and Sysmon EventID 7 / 11 alerts',
          },
        ],
      },
    },
  },

  'dfir-ntds-dit-vssadmin-esentutl-extraction': {
    briefing: {
      storyAnalogy:
        'Imagine a bank whose master account ledger stays bolted down to the vault floor while the bank is open so nobody can walk out with it. An intruder snaps a frozen carbon-copy photograph of the entire floor, uses the bank own official bookbinding copier to stream the ledger cleanly out of the frozen photograph, and separately steals the four-part decoder dial from the wall safe so they can read every password seal offline.',
      storyMappings: [
        {
          storyTerm: 'Snapping a frozen carbon-copy photograph of the vault floor',
          technicalTerm: 'Creating a Volume Shadow Copy via vssadmin.exe and vssvc.exe (EventID 1 & 7036)',
        },
        {
          storyTerm: 'Official bookbinding copier streaming the ledger out of the photo',
          technicalTerm: 'esentutl.exe /y /vss copying locked ntds.dit (ESENT EventID 325 / 326)',
        },
        {
          storyTerm: 'Four-part decoder dial stolen from the wall safe',
          technicalTerm: 'reg.exe save HKLM\\SYSTEM capturing the BootKey across four scrambled registry keys',
        },
        {
          storyTerm: 'Reading every password seal offline in a hideout',
          technicalTerm: 'Offline secretsdump.py decryption of ntds.dit PekList NTLM hashes',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Unable to pry the live master ledger off the vault desk while clerks are using it, the intruder activates the building built-in instant camera to capture a frozen read-only snapshot of the entire drive floor.',
        storyMappings: [
          {
            storyTerm: 'Live ledger bolted to the vault desk',
            technicalTerm: 'Exclusively locked C:\\Windows\\NTDS\\ntds.dit held open by lsass.exe',
          },
          {
            storyTerm: 'Activating the building built-in instant camera',
            technicalTerm: 'Running vssadmin.exe create shadow /for=C: triggering vssvc.exe',
          },
          {
            storyTerm: 'Frozen read-only snapshot of the floor',
            technicalTerm: 'Newly mounted Volume Shadow Copy device (\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1)',
          },
          {
            storyTerm: 'Building security log noting the camera flash',
            technicalTerm: 'Sysmon EventID 1 and System EventID 7036 (Volume Shadow Copy service started)',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Stepping up to the frozen floor photograph, the intruder calls over the bank own signed book-repair utility to peel a clean copy of the master ledger right out of the snapshot while the database engine quietly stamps an internal audit ticket.',
        storyMappings: [
          {
            storyTerm: 'Bank own signed book-repair utility',
            technicalTerm: 'Native Windows Extensible Storage Engine utility esentutl.exe /y /vss',
          },
          {
            storyTerm: 'Peeling a clean copy out of the frozen snapshot',
            technicalTerm: 'Streaming ntds.dit from the shadow copy path into a staging folder',
          },
          {
            storyTerm: 'Internal audit ticket stamped by the database engine',
            technicalTerm: 'Application ESENT EventID 325 and 326 logging database attachment and copy',
          },
          {
            storyTerm: 'Staging folder holding the copied ledger',
            technicalTerm: 'Exfiltration staging directory such as C:\\Temp\\ntds.dit',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because every password line inside the stolen ledger is scrambled by a secret master cipher wheel bolted inside the wall cabinet, the intruder also exports that entire system cabinet so they can unwind every employee secret offline without touching the bank again.',
        storyMappings: [
          {
            storyTerm: 'Secret master cipher wheel inside the wall cabinet',
            technicalTerm: 'Domain Controller BootKey scrambled across four keys in HKLM\\SYSTEM',
          },
          {
            storyTerm: 'Exporting the entire system cabinet',
            technicalTerm: 'reg.exe save HKLM\\SYSTEM C:\\Temp\\SYSTEM.hiv',
          },
          {
            storyTerm: 'Scrambled password lines inside the ledger',
            technicalTerm: 'Encrypted PekList entries storing every domain NTLM and Kerberos key',
          },
          {
            storyTerm: 'Unwinding every employee secret offline',
            technicalTerm: 'Offline credential extraction combining ntds.dit and SYSTEM.hiv via secretsdump',
          },
        ],
      },
    },
  },

  'dfir-dcsync-drsuapi-replication-eid4662': {
    briefing: {
      storyAnalogy:
        'Imagine a royal mint where sister vaults regularly synchronize their master gold ledgers over a private courier channel. Wearing a compromised supervisor badge from an ordinary office workstation, an intruder calls the royal mint pretending to be a sister vault, clears the special ledger-sync checkpoint, and receives a freshly packaged copy of every master household seal without ever setting foot inside the vault room.',
      storyMappings: [
        {
          storyTerm: 'Pretending to be a sister vault on the private courier channel',
          technicalTerm: 'MS-DRSR RPC bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 from workstation IP',
        },
        {
          storyTerm: 'Clearing the special ledger-sync checkpoint',
          technicalTerm: 'Domain Controller Security EventID 4662 logging DS-Replication-Get-Changes-All GUIDs',
        },
        {
          storyTerm: 'Receiving a freshly packaged copy of every household seal',
          technicalTerm: 'DRS_MSG_GETNCCHANGESREPLY delivering krbtgt AES-256 and NTLM hashes',
        },
        {
          storyTerm: 'Calling from an ordinary office workstation instead of a real sister vault',
          technicalTerm: 'Non-DC source IP (10.10.4.22) requesting directory replication over RPC',
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
          },
          {
            storyTerm: 'Exclusive directory-sync extension',
            technicalTerm: 'MS-DRSR DRSUAPI interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2',
          },
          {
            storyTerm: 'Hijacked high-clearance pass',
            technicalTerm: 'Compromised account holding Replicating Directory Changes extended rights',
          },
          {
            storyTerm: 'Royal mint central registrar',
            technicalTerm: 'Target Active Directory Domain Controller CORP-DC01',
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
          },
          {
            storyTerm: 'First permission stamp for directory changes',
            technicalTerm: 'DS-Replication-Get-Changes GUID (1131f6aa-9c07-11d1-f79f-00c04fc2dcd2)',
          },
          {
            storyTerm: 'Second permission stamp for secret fields',
            technicalTerm: 'DS-Replication-Get-Changes-All GUID (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
          },
          {
            storyTerm: 'Unforgeable receipt in the vault access book',
            technicalTerm: 'Windows Security EventID 4662 (ControlAccess) logged on CORP-DC01',
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
          },
          {
            storyTerm: 'Master kingdom stamp inside the pouch',
            technicalTerm: 'krbtgt account AES-256 and NTLM hashes enabling Golden Ticket forgery',
          },
          {
            storyTerm: 'Additional citizen secret seals',
            technicalTerm: 'Replicated SupplementalCredentials and unicodePwd password hashes',
          },
          {
            storyTerm: 'No physical files ever touched on the vault floor',
            technicalTerm: 'Pure network-level memory extraction avoiding ntds.dit disk access',
          },
        ],
      },
    },
  },

  'dfir-rdp-lateral-movement-tsclient-bitmap-cache': {
    briefing: {
      storyAnalogy:
        'Imagine an intruder sitting at one factory desk who opens a live remote video-and-keyboard booth into a restricted server room down the hall. Both the local desk diary and the distant room sign-in book automatically stamp matching connection receipts, while the local booth quietly saves hundreds of tiny square photo tiles of every window the intruder views, allowing forensic detectives to piece the intruder screen back together like a mosaic.',
      storyMappings: [
        {
          storyTerm: 'Local desk diary stamping the outgoing booth call',
          technicalTerm: 'Source workstation mstsc.exe MRU registry keys and RDPClient EventID 1024 / 1102',
        },
        {
          storyTerm: 'Distant server room sign-in book recording the arrival',
          technicalTerm: 'Destination EventID 4624 (LogonType 10/7), RdpCoreTS 131, and LocalSessionManager logs',
        },
        {
          storyTerm: 'Tiny square photo tiles saved quietly at the local desk',
          technicalTerm: 'Client-side 64x64 pixel RDP Bitmap Cache (Cache0000.bin) under %LOCALAPPDATA%',
        },
        {
          storyTerm: 'Detectives piecing the intruder screen back together like a mosaic',
          technicalTerm: 'Visual screen reconstruction via bmc2-tools exposing attacker commands on disk',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the starting desk, the intruder types a target room address into the remote-viewing console. Even before the distant room answers, the desk personal address book and outgoing call ledger faithfully record the destination room and timestamp.',
        storyMappings: [
          {
            storyTerm: 'Remote-viewing console at the starting desk',
            technicalTerm: 'mstsc.exe launched on source workstation WKS-07 (10.10.4.19)',
          },
          {
            storyTerm: 'Personal address book saving recent rooms',
            technicalTerm: 'HKCU\\Software\\Microsoft\\Terminal Server Client\\Default MRU registry values',
          },
          {
            storyTerm: 'Outgoing call ledger recording the destination',
            technicalTerm: 'Microsoft-Windows-TerminalServices-RDPClient/Operational EventID 1024 and 1102',
          },
          {
            storyTerm: 'Target room down the hall',
            technicalTerm: 'Destination server SRV-APP02 (10.10.20.45) listening on TCP/3389',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the connection lands in the restricted server room, three separate lobby ledgers wake up in sequence: the front network door logs the arriving IP address, the badge desk logs an interactive remote check-in, and the session desk notes whether the visitor started a fresh chair or slipped back into a disconnected one.',
        storyMappings: [
          {
            storyTerm: 'Front network door logging the arriving IP',
            technicalTerm: 'RdpCoreTS/Operational EventID 131 capturing source IP 10.10.4.19',
          },
          {
            storyTerm: 'Badge desk logging an interactive remote check-in',
            technicalTerm: 'Windows Security EventID 4624 with LogonType 10 (RemoteInteractive) or 7 (Reconnect)',
          },
          {
            storyTerm: 'Session desk tracking fresh versus reconnected chairs',
            technicalTerm: 'TerminalServices-LocalSessionManager/Operational EventID 21, 24, and 25',
          },
          {
            storyTerm: 'Pre-entry badge inspection gate',
            technicalTerm: 'Network Level Authentication (NLA) validating credentials before session render',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To keep the remote video screen fast and smooth, the viewer console on the starting desk secretly stores hundreds of 64-by-64-pixel square picture tiles of every button, terminal line, and file folder shown on screen, leaving behind a visual mosaic that investigators can stitch back together even after the intruder clears every text log.',
        storyMappings: [
          {
            storyTerm: 'Hundreds of square picture tiles saved for speed',
            technicalTerm: 'Persistent 64x64 pixel RDP Bitmap Cache files (Cache0000.bin / bcache24.bmc)',
          },
          {
            storyTerm: 'Hidden desk drawer storing the tiles',
            technicalTerm: '%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache on WKS-07',
          },
          {
            storyTerm: 'Stitching the mosaic back together',
            technicalTerm: 'Forensic parsing with bmc2-tools rendering visual screenshots of attacker activity',
          },
          {
            storyTerm: 'Evidence surviving cleared text logs',
            technicalTerm: 'Client-side visual proof of commands typed on SRV-APP02',
          },
        ],
      },
    },
  },

  'dfir-smb-psexec-named-pipe-eid5145-7045': {
    briefing: {
      storyAnalogy:
        'Imagine an intruder standing in a corridor who drops a remote worker kit onto a neighbor administrative loading dock, phones the shift foreman to register that kit as a brand-new building service, and hooks up a control tube plus three pneumatic speaking tubes (one to send typed orders, one to hear normal replies, and one to hear error shouts) straight back to their own desk, leaving a crisp four-step trail even if they repaint the kit name.',
      storyMappings: [
        {
          storyTerm: 'Dropping the worker kit onto the administrative loading dock',
          technicalTerm: 'SMB ADMIN$ write and IPC$ svcctl bind logged by EventID 5140 and 5145',
        },
        {
          storyTerm: 'Phoning the shift foreman to register a brand-new service',
          technicalTerm: 'services.exe CreateServiceW over \\pipe\\svcctl logged by System EventID 7045',
        },
        {
          storyTerm: 'Control tube plus three pneumatic speaking tubes',
          technicalTerm: 'PSEXESVC named pipes for control, stdin, stdout, and stderr (Sysmon EventID 17 & 18)',
        },
        {
          storyTerm: 'Detectable even after repainting the kit name',
          technicalTerm: 'Behavioral named-pipe triplet signature surviving PsExec -r binary renaming',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'From a neighboring workstation, the intruder unlocks the target administrative loading bay, drops a packaged service helper onto the dock, and opens the shift-foreman intercom channel to prepare an installation order.',
        storyMappings: [
          {
            storyTerm: 'Administrative loading bay',
            technicalTerm: 'Remote SMB ADMIN$ share accessed on 10.10.20.15 (Security EventID 5140)',
          },
          {
            storyTerm: 'Dropping the packaged service helper onto the dock',
            technicalTerm: 'Security EventID 5145 logging PSEXESVC.exe creation inside ADMIN$',
          },
          {
            storyTerm: 'Shift-foreman intercom channel',
            technicalTerm: 'SMB IPC$ RPC bind to \\pipe\\svcctl (Service Control Manager interface)',
          },
          {
            storyTerm: 'Remote launch order',
            technicalTerm: 'Attacker running PsExec.exe \\\\10.10.20.15 -s cmd.exe',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Receiving the installation order over the foreman intercom, the building shift supervisor writes a brand-new service entry onto the master roster and starts the uploaded helper with full building-wide master keys.',
        storyMappings: [
          {
            storyTerm: 'Building shift supervisor',
            technicalTerm: 'Windows Service Control Manager (services.exe) invoking CreateServiceW',
          },
          {
            storyTerm: 'Brand-new service entry on the master roster',
            technicalTerm: 'System EventID 7045 (A service was installed in the system) for PSEXESVC',
          },
          {
            storyTerm: 'Starting the helper with master keys',
            technicalTerm: 'PSEXESVC.exe spawning cmd.exe under NT AUTHORITY\\SYSTEM (Sysmon EventID 1)',
          },
          {
            storyTerm: 'Temporary registration cleaned up afterward',
            technicalTerm: 'Short-lived remote execution service whose EventID 7045 log persists on disk',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder paints a brand-new cover name over the worker kit to dodge simple name filters, the live helper still opens one master control pipe and three matching pneumatic speaking tubes (one for incoming commands, one for normal output, and one for error messages), creating a dead-giveaway architectural fingerprint.',
        storyMappings: [
          {
            storyTerm: 'Painting a brand-new cover name over the kit',
            technicalTerm: 'Using PsExec -r <custom_name> to rename the service and binary',
          },
          {
            storyTerm: 'Master control pipe',
            technicalTerm: 'Control named pipe coordinating interactive command session startup',
          },
          {
            storyTerm: 'Three pneumatic speaking tubes (commands, output, errors)',
            technicalTerm: 'Paired stdin, stdout, and stderr named pipes (e.g., *-stdin, *-stdout, *-stderr)',
          },
          {
            storyTerm: 'Architectural fingerprint caught by hallway sensors',
            technicalTerm: 'Sysmon EventID 17 (PipeEvent Created) and EventID 18 (PipeEvent Connected)',
          },
        ],
      },
    },
  },

  'dfir-dpapi-masterkey-lsass-browser-vault-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine an office campus where every employee desk safe is locked by a personal brass key whose spare backup copy sits inside the headquarters central vault. An intruder gathers the locked desk safes containing browser passwords and saved credentials, flashes stolen headquarters authority to ask the central backup window to unwrap the personal brass key, and then unlocks every private employee pouch quietly offline.',
      storyMappings: [
        {
          storyTerm: 'Locked desk safes storing browser notebooks and credential pouches',
          technicalTerm: 'Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials and Chromium Login Data',
        },
        {
          storyTerm: 'Personal brass key paired with a headquarters backup copy',
          technicalTerm: 'Preferred DPAPI MasterKey GUID file in %APPDATA%\\Microsoft\\Protect containing Domain Backup Key',
        },
        {
          storyTerm: 'Asking the headquarters backup window to unwrap the brass key',
          technicalTerm: 'Domain Controller MS-BKRP BackupKey RPC recovery logged as EventID 4693',
        },
        {
          storyTerm: 'Unlocking every employee pouch quietly offline',
          technicalTerm: 'CryptUnprotectData / dpapick3 decrypting .vcrd vaults, Chromium Login Data, and cookies',
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
          },
          {
            storyTerm: 'Tiny serial tag stamped on each pouch',
            technicalTerm: 'Embedded MasterKey GUID referencing the matching file under %APPDATA%\\Microsoft\\Protect',
          },
          {
            storyTerm: 'Personal brass key kept inside a locked case',
            technicalTerm: 'User-encrypted 64-byte DPAPI MasterKey file protected by user password and domain backup key',
          },
          {
            storyTerm: 'Workstation secret inventory',
            technicalTerm: 'Target saved web passwords, session cookies, RDP credentials, and Windows Vault items',
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
          },
          {
            storyTerm: 'Headquarters emergency key-recovery desk',
            technicalTerm: 'Domain Controller MS-BKRP (BackupKey Remote Protocol) RPC service',
          },
          {
            storyTerm: 'Official vault receipt stamped during key unwrap',
            technicalTerm: 'Domain Controller Windows Security EventID 4693 (Recovery of DPAPI backup key)',
          },
          {
            storyTerm: 'Unwrapped personal brass key returned',
            technicalTerm: 'Plaintext 64-byte SHA-1 DPAPI MasterKey recovered without cracking the user password',
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
          },
          {
            storyTerm: 'Opening every credential pouch offline',
            technicalTerm: 'Invoking CryptUnprotectData or offline dpapick3 against stolen DPAPI blobs',
          },
          {
            storyTerm: 'Browser safe contents spilled out',
            technicalTerm: 'Decrypted Chromium Login Data passwords, Local State AES key, and session cookies',
          },
          {
            storyTerm: 'Windows Vault credentials exposed',
            technicalTerm: 'Decrypted .vcrd Windows Credential Manager secrets enabling further lateral movement',
          },
        ],
      },
    },
  },

  'dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly': {
    briefing: {
      storyAnalogy:
        'Imagine a giant theme park where every visitor must first visit the front admission booth to receive an official stamped day wristband before any ride operator will issue a ride pass. Having stolen the park master ink stamp earlier, an intruder prints an impossible ten-year VIP wristband at home and walks straight up to an inner ride gate without ever passing through the front booth, immediately tripping forensic auditors who spot a VIP ride pass with zero front-gate admission record.',
      storyMappings: [
        {
          storyTerm: 'Printing an impossible ten-year VIP wristband at home',
          technicalTerm: 'Offline Golden Ticket TGT forgery using stolen krbtgt AES-256 key and Pass-the-Ticket injection',
        },
        {
          storyTerm: 'Walking straight up to a ride gate with zero front-gate check-in',
          technicalTerm: 'Orphaned KRB_TGS_REQ (EventID 4769) with no preceding AS-REQ (EventID 4768)',
        },
        {
          storyTerm: 'Synthetic VIP committee seals stamped onto the wristband',
          technicalTerm: 'Forged Privilege Attribute Certificate (PAC) injecting Domain Admin SIDs',
        },
        {
          storyTerm: 'Walking straight into the vault room with the forged ride pass',
          technicalTerm: 'Target host Security EventID 4624 (LogonType 3) accessing \\\\CORP-DC01\\C$ with forged groups',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sitting quietly at a compromised desk away from the park entrance, the intruder presses the stolen master ink stamp onto a homemade VIP wristband claiming ten years of executive authority and slips it straight into their local memory pocket.',
        storyMappings: [
          {
            storyTerm: 'Stolen master ink stamp',
            technicalTerm: 'Previously compromised Active Directory krbtgt AES-256 or RC4 key',
          },
          {
            storyTerm: 'Homemade VIP wristband claiming executive authority',
            technicalTerm: 'Forged Kerberos TGT crafted offline with kerberos::golden and domain SID',
          },
          {
            storyTerm: 'Slipping the wristband into the local memory pocket',
            technicalTerm: 'Pass-the-Ticket injection via LsaCallAuthenticationPackage into the current logon session',
          },
          {
            storyTerm: 'Zero visit to the front admission booth',
            technicalTerm: 'Complete absence of any legitimate KDC AS-REQ / EventID 4768 ticket grant',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Approaching the main vault service desk, the intruder flashes their homemade wristband to request a door pass. Because the ink stamp matches mathematically, the desk hands over a vault pass, yet the audit ledger immediately exposes two glaring anomalies: no front-gate entry ever existed, and the wristband expiration date stretches far beyond normal park hours.',
        storyMappings: [
          {
            storyTerm: 'Flashing the homemade wristband for a vault door pass',
            technicalTerm: 'Workstation sending KRB_TGS_REQ for \\\\CORP-DC01\\C$ using the forged TGT',
          },
          {
            storyTerm: 'Audit ledger showing zero front-gate entry',
            technicalTerm: 'Orphaned Security EventID 4769 with no matching prior EventID 4768 for that session',
          },
          {
            storyTerm: 'Impossible wristband expiration date',
            technicalTerm: 'Anomalous TGT lifetime (e.g., 10 years instead of default 10 hours) and PAC discrepancies',
          },
          {
            storyTerm: 'Vault desk verifying the ink stamp mathematically',
            technicalTerm: 'KDC validating the krbtgt signature on the TGT without noticing offline forgery',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Holding the freshly minted vault door pass, the intruder steps straight into the Domain Controller storage room carrying fabricated executive group badges that do not even match the real employee directory.',
        storyMappings: [
          {
            storyTerm: 'Stepping into the Domain Controller storage room',
            technicalTerm: 'Mounting \\\\CORP-DC01\\C$ using the forged Kerberos service ticket',
          },
          {
            storyTerm: 'Fabricated executive group badges inside the pass',
            technicalTerm: 'Synthetic Domain Admin and Enterprise Admin RIDs embedded in the forged PAC',
          },
          {
            storyTerm: 'Door ledger logging the network arrival',
            technicalTerm: 'Security EventID 4624 (LogonType 3, Kerberos) recording forged privileged logon',
          },
          {
            storyTerm: 'Permanent cure invalidating every counterfeit stamp',
            technicalTerm: 'Double rotation of the krbtgt password spaced by the maximum ticket lifetime',
          },
        ],
      },
    },
  },

  'dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886': {
    briefing: {
      storyAnalogy:
        'Imagine a corporate ID-card print shop that offers one carelessly designed visitor badge template allowing any requester to handwrite whoever they please on the official nameplate line with zero manager approval. A junior clerk spots that sloppy template, types the Chief Executive name onto the application slip, picks up a genuinely embossed executive photo ID straight from the print shop, and exchanges that real badge at the front gate for master keys to the entire company.',
      storyMappings: [
        {
          storyTerm: 'Carelessly designed badge template allowing handwritten names',
          technicalTerm: 'ESC1 vulnerable AD CS template with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT and no approval',
        },
        {
          storyTerm: 'Junior clerk writing the Chief Executive name on the application slip',
          technicalTerm: 'PKCS#10 CSR with spoofed SAN UPN (/altname:Administrator@corp.local) logged in EventID 4886',
        },
        {
          storyTerm: 'Exchanging the genuinely embossed badge at the front gate',
          technicalTerm: 'Kerberos PKINIT authentication via Rubeus.exe asktgt returning an Administrator TGT',
        },
        {
          storyTerm: 'Extracting the executive raw vault key from the badge response',
          technicalTerm: 'Unpac-the-Hash recovering the Administrator NT hash from the PKINIT PAC structure',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Browsing the print shop public catalog of available ID templates, a low-ranking clerk hunts for one dangerous combination: any ordinary worker can apply, no supervisor signature is required, the badge grants building entry, and the applicant is allowed to type any name they want onto the nameplate.',
        storyMappings: [
          {
            storyTerm: 'Public catalog of available ID templates',
            technicalTerm: 'LDAP query against CN=Certificate Templates,CN=Public Key Services in AD',
          },
          {
            storyTerm: 'Applicant allowed to type any name onto the nameplate',
            technicalTerm: 'msPKI-Certificate-Name-Flag bit CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT enabled',
          },
          {
            storyTerm: 'Badge granting building entry with no supervisor signature',
            technicalTerm: 'Client Authentication EKU paired with no Manager Approval and Domain Users enroll rights',
          },
          {
            storyTerm: 'Clerk inspecting the catalog',
            technicalTerm: 'Certify.exe find /vulnerable or Certipy enumerating ESC1 misconfigurations',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Filling out an official badge order under their own lowly employee name, the junior clerk neatly writes the Chief Administrator address inside the alternate-identity box. Without pausing for human review, the automated print shop embosses and hands over a cryptographically genuine executive badge while stamping a permanent print-shop log.',
        storyMappings: [
          {
            storyTerm: 'Junior employee submitting the badge order',
            technicalTerm: 'Low-privileged user CORP\\jdoe submitting a PKCS#10 CSR to CORP-CA01',
          },
          {
            storyTerm: 'Chief Administrator written in the alternate-identity box',
            technicalTerm: 'Spoofed Subject Alternative Name (SAN) UPN /altname:Administrator@corp.local',
          },
          {
            storyTerm: 'Automated print shop embossing the genuine badge',
            technicalTerm: 'Enterprise CA issuing a valid X.509 authentication certificate for Administrator',
          },
          {
            storyTerm: 'Permanent print-shop receipt exposing the mismatch',
            technicalTerm: 'CA Security EventID 4886 and 4887 showing requester jdoe requesting Administrator SAN',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Walking up to the central gatehouse with the newly minted executive badge, the clerk trades the photo ID for an official executive master pass and peels the Administrator permanent vault key straight out of the returned pass packet.',
        storyMappings: [
          {
            storyTerm: 'Trading the executive photo ID at the gatehouse',
            technicalTerm: 'Kerberos PKINIT authentication via Rubeus.exe asktgt /user:Administrator /certificate:...',
          },
          {
            storyTerm: 'Official executive master pass issued by the gatehouse',
            technicalTerm: 'Domain Administrator Kerberos TGT logged in KDC EventID 4768 with certificate thumbprint',
          },
          {
            storyTerm: 'Peeling the permanent vault key out of the returned packet',
            technicalTerm: 'Unpac-the-Hash extracting the Administrator NTLM hash from the Kerberos PAC',
          },
          {
            storyTerm: 'Full kingdom takeover from one sloppy template',
            technicalTerm: 'Instant low-privileged user to Enterprise Domain Admin escalation',
          },
        ],
      },
    },
  },

  'dfir-winrm-wsman-remote-powershell-eid91-4624': {
    briefing: {
      storyAnalogy:
        'Imagine a corporate office tower linked by a fast pneumatic canister-tube system built for remote IT administration. An intruder sitting at an ordinary desk drops a sealed command canister down the tube to a database server, where the receiving dock opens a dedicated remote-command bench and executes every instruction inside while both sending and receiving ledgers stamp detailed receipts of the canister and every line of code run.',
      storyMappings: [
        {
          storyTerm: 'Dropping a sealed command canister from the sending desk',
          technicalTerm: 'Invoke-Command initiating outbound WSMan session (WinRM EventID 142 & 6 on source)',
        },
        {
          storyTerm: 'Receiving dock accepting the canister on the database server',
          technicalTerm: 'HTTP.sys POST /wsman on TCP/5985 logging WinRM EventID 91 and Security EventID 4624',
        },
        {
          storyTerm: 'Dedicated remote-command bench running the instructions',
          technicalTerm: 'wsmprovhost.exe -Embedding spawning child tools with ServerRemoteHost ScriptBlock logs',
        },
        {
          storyTerm: 'Paired receipts stamped on both sending and receiving desks',
          technicalTerm: 'Correlated source WinRM EventID 6, target EventID 91, and PowerShell EventID 4104',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the originating workstation, the intruder loads an automated script into a sealed remote-administration canister and launches it through the campus pneumatic tube toward the target database server, leaving an outbound dispatch ticket in the local tube log.',
        storyMappings: [
          {
            storyTerm: 'Loading a script into a remote-administration canister',
            technicalTerm: 'PowerShell Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... }',
          },
          {
            storyTerm: 'Campus pneumatic tube network',
            technicalTerm: 'WS-Management (WinRM) SOAP protocol over HTTP port 5985 or HTTPS 5986',
          },
          {
            storyTerm: 'Outbound dispatch ticket on the sending desk',
            technicalTerm: 'Microsoft-Windows-WinRM/Operational EventID 6 and 142 on source workstation',
          },
          {
            storyTerm: 'Target database server down the hall',
            technicalTerm: 'Destination host SRV-SQL01 receiving the remote management session',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the canister pops into the receiving tube at the database server, the front door receptionist stamps the visitor network arrival pass and immediately opens a freshly numbered remote workbench slot for the incoming session.',
        storyMappings: [
          {
            storyTerm: 'Receiving tube at the database server',
            technicalTerm: 'Windows HTTP.sys kernel listener accepting SOAP POST /wsman on port 5985',
          },
          {
            storyTerm: 'Front door receptionist stamping the arrival pass',
            technicalTerm: 'Windows Security EventID 4624 (LogonType 3 Network) on SRV-SQL01',
          },
          {
            storyTerm: 'Opening a freshly numbered remote workbench slot',
            technicalTerm: 'WinRM/Operational EventID 91 (Creating WSMan shell on server with ResourceUri)',
          },
          {
            storyTerm: 'Authenticated remote management session',
            technicalTerm: 'Kerberos or Negotiate-authenticated administrative session established on target',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Inside the newly opened workbench slot, a dedicated remote-host clerk wakes up to run the intruder commands and child utilities, while the room built-in security camera records the full verbatim transcript of every single script block executed.',
        storyMappings: [
          {
            storyTerm: 'Dedicated remote-host clerk waking up',
            technicalTerm: 'C:\\Windows\\System32\\wsmprovhost.exe -Embedding spawned by the WinRM service',
          },
          {
            storyTerm: 'Child utilities launched from the remote bench',
            technicalTerm: 'Anomalous child processes spawned under wsmprovhost.exe (Sysmon EventID 1)',
          },
          {
            storyTerm: 'Built-in camera recording the verbatim script transcript',
            technicalTerm: 'PowerShell Operational EventID 4104 and 400 (ServerRemoteHost engine startup)',
          },
          {
            storyTerm: 'Reconstructing exact lateral actions',
            technicalTerm: 'Correlating wsmprovhost.exe PID with ScriptBlock text and network LogonID',
          },
        ],
      },
    },
  },

  'dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion': {
    briefing: {
      storyAnalogy:
        'Imagine a fortified courthouse whose encrypted-file clerk is required to inspect any document path mentioned by an outside caller. A trickster phones the clerk naming a fake folder sitting at the trickster own street booth; obediently, the courthouse chief courier marches straight out to the street booth flashing the courthouse master identity badge, while the trickster holds up a live mirror reflecting that exact badge straight into a neighboring notary office to mint a permanent master credential.',
      storyMappings: [
        {
          storyTerm: 'Trickster phoning the encrypted-file clerk with a fake street-booth path',
          technicalTerm: 'PetitPotam MS-EFSRPC EfsRpcOpenFileRaw coercion over \\pipe\\lsarpc',
        },
        {
          storyTerm: 'Courthouse chief courier marching out flashing the master badge',
          technicalTerm: 'Coerced CORP-DC01$ (System PID 4) outbound SMB NTLMv2 authentication to attacker IP',
        },
        {
          storyTerm: 'Live mirror reflecting the badge into a neighboring notary office',
          technicalTerm: 'Cross-protocol NTLM relay (SMB to HTTP/LDAP) forwarding NTLMSSP_NEGOTIATE and NTLMSSP_AUTH',
        },
        {
          storyTerm: 'Audit discrepancy exposing the mirror trick',
          technicalTerm: 'Target Security EventID 4624 where CORP-DC01$ authenticates from an attacker workstation IP',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Ringing the courthouse built-in encrypted-file service counter over an open office pipe, the trickster asks the clerk to open a raw file located at a street address owned by the trickster, forcing the courthouse to initiate an outgoing house call.',
        storyMappings: [
          {
            storyTerm: 'Built-in encrypted-file service counter',
            technicalTerm: 'MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e on \\pipe\\lsarpc',
          },
          {
            storyTerm: 'Asking the clerk to open a file at the trickster street address',
            technicalTerm: 'PetitPotam calling EfsRpcOpenFileRaw() pointing to \\\\attacker-ip\\share\\file',
          },
          {
            storyTerm: 'Wiretap catching the unusual clerk call',
            technicalTerm: 'Zeek dce_rpc.log capturing EfsRpcOpenFileRaw invocation targeting a Domain Controller',
          },
          {
            storyTerm: 'Forcing an outgoing house call',
            technicalTerm: 'Authentication coercion triggering an involuntary outbound server connection',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Obeying the file-opening request immediately, the courthouse core engine dispatches its own official machine courier straight out to the trickster street booth and dutifully flashes its cryptographically signed courthouse badge to open the door.',
        storyMappings: [
          {
            storyTerm: 'Courthouse core engine dispatching its own courier',
            technicalTerm: 'Windows NT kernel (System PID 4) on CORP-DC01 opening outbound TCP/445 SMB',
          },
          {
            storyTerm: 'Flashing the cryptographically signed courthouse badge',
            technicalTerm: 'Outbound NTLMv2 challenge-response authentication as machine account CORP-DC01$',
          },
          {
            storyTerm: 'Trickster street booth receiving the courier',
            technicalTerm: 'Attacker-controlled ntlmrelayx listener capturing the incoming SMB handshake',
          },
          {
            storyTerm: 'Unusual outbound visit from a master vault',
            technicalTerm: 'Domain Controller initiating outbound SMB traffic to an untrusted workstation IP',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Instead of answering the courier themselves, the trickster holds up a real-time mirror that bounces every handshake phrase straight into a neighboring certificate notary office lacking tamper-proof channel seals, minting a Domain Controller badge while leaving an impossible address mismatch in the notary guestbook.',
        storyMappings: [
          {
            storyTerm: 'Real-time mirror bouncing every handshake phrase',
            technicalTerm: 'Cross-protocol NTLM relay forwarding NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages',
          },
          {
            storyTerm: 'Neighboring notary office lacking tamper-proof channel seals',
            technicalTerm: 'AD CS HTTP enrollment (/certsrv) or LDAP server without EPA / signing enabled',
          },
          {
            storyTerm: 'Impossible address mismatch in the notary guestbook',
            technicalTerm: 'Security EventID 4624 showing TargetUserName=CORP-DC01$ arriving from attacker IP',
          },
          {
            storyTerm: 'Minting a permanent Domain Controller badge',
            technicalTerm: 'Issued CORP-DC01$ certificate or RBCD delegation granting full domain compromise',
          },
        ],
      },
    },
  },
};
