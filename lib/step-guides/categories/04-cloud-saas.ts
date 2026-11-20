import type { CategoryStandardPatchMap } from './types';

/**
 * Category 4: CLOUD_SAAS (25 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 25 cloud and SaaS scenarios.
 */
export const CLOUD_SAAS_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'snowflake-unc5537-saas-extortion': {
    briefing: {
      storyAnalogy:
        'Imagine a massive cloud data warehouse where hundreds of companies store customer archives behind a front door that still relies solely on static passwords without pocket codes. Using passwords scooped earlier from home computers, an intruder drives up through anonymous rental vans, sends a fast automated catalog robot down every aisle to locate the richest vaults, and stages giant customer tables into personal loading bays before hauling them away with a standard database viewer.',
      storyMappings: [
        {
          storyTerm: 'Passwords scooped from home computers used at a single-lock front door',
          technicalTerm: 'Infostealer credential replay against single-factor Snowflake accounts lacking MFA',
        },
        {
          storyTerm: 'Fast automated catalog robot scanning every aisle',
          technicalTerm: 'FROSTBITE (Rapeflake) utility rapidly enumerating Snowflake schemas and roles',
        },
        {
          storyTerm: 'Staging giant customer tables into personal loading bays',
          technicalTerm: 'SQL COPY INTO @~ staging multi-gigabyte tables into user internal stages',
        },
        {
          storyTerm: 'Hauling archives away with a standard database viewer',
          technicalTerm: 'Bulk GET downloads through DBeaver Ultimate for mass extortion',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Arriving through masked commercial relay vans, the intruder tests a stack of stolen employee passwords harvested months earlier from infected personal laptops against cloud warehouse accounts that never required a second pocket-code lock.',
        storyMappings: [
          {
            storyTerm: 'Masked commercial relay vans',
            technicalTerm: 'Mullvad VPN and commercial anonymizer exit IPs masking UNC5537 origin',
          },
          {
            storyTerm: 'Stolen employee passwords from infected laptops',
            technicalTerm: 'Infostealer-harvested credentials replayed across enterprise Snowflake tenants',
          },
          {
            storyTerm: 'Front door lacking a second pocket-code lock',
            technicalTerm: 'FIRST_AUTHENTICATION_FACTOR = PASSWORD with SECOND_AUTHENTICATION_FACTOR IS NULL',
          },
          {
            storyTerm: 'Warehouse front-desk sign-in ledger',
            technicalTerm: 'SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY recording single-factor external logins',
          },
        ],
        detectionAndEvidence:
          'Query SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY (the warehouse immutable sign-in audit table) for sessions where FIRST_AUTHENTICATION_FACTOR = PASSWORD and SECOND_AUTHENTICATION_FACTOR IS NULL originating from Mullvad VPN or commercial proxy IP ranges (pinpointing UNC5537 single-factor credential replay).',
      },
      2: {
        storyAnalogy:
          'Once past the front turnstile, the intruder releases a custom high-speed inventory scout that races through every warehouse aisle, listing all databases, privileges, and billing tables in seconds while leaving its distinct maker stamp in the visitor log.',
        storyMappings: [
          {
            storyTerm: 'Custom high-speed inventory scout',
            technicalTerm: 'FROSTBITE (Rapeflake) automated Snowflake reconnaissance utility',
          },
          {
            storyTerm: 'Listing every aisle, privilege, and billing table',
            technicalTerm: 'Rapid schema, role, and high-value table enumeration across customer databases',
          },
          {
            storyTerm: 'Distinct maker stamp left in the visitor log',
            technicalTerm: 'CLIENT_ENVIRONMENT JSON containing "APPLICATION": "Rapeflake" or "DBeaver_DBeaverUltimate"',
          },
          {
            storyTerm: 'Warehouse session register',
            technicalTerm: 'SNOWFLAKE.ACCOUNT_USAGE.SESSIONS tracking client tool metadata',
          },
        ],
        detectionAndEvidence:
          'Inspect CLIENT_ENVIRONMENT metadata inside SNOWFLAKE.ACCOUNT_USAGE.SESSIONS (which records exact client software identifiers for every authenticated connection) for "APPLICATION": "Rapeflake" or "DBeaver_DBeaverUltimate" (high-confidence UNC5537 tooling signatures).',
      },
      3: {
        storyAnalogy:
          'Selecting the richest customer vaults, the intruder orders the warehouse own bulk forklift to pack entire archives onto their personal loading platform and then downloads the multi-gigabyte crates straight through an ordinary desktop query app.',
        storyMappings: [
          {
            storyTerm: 'Warehouse own bulk forklift packing archives',
            technicalTerm: 'SQL COPY INTO @~ exporting full production tables into the user internal stage',
          },
          {
            storyTerm: 'Personal loading platform',
            technicalTerm: 'Snowflake per-user internal stage (@~) holding compressed CSV/Parquet dumps',
          },
          {
            storyTerm: 'Ordinary desktop query app hauling crates out',
            technicalTerm: 'SQL GET commands executed via DBeaver Ultimate pulling staged files externally',
          },
          {
            storyTerm: 'Loading-dock scale flagging massive outbound weight',
            technicalTerm: 'QUERY_HISTORY showing QUERY_TYPE IN (COPY, GET) with massive BYTES_WRITTEN_TO_RESULT',
          },
        ],
        detectionAndEvidence:
          'Alert on SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY (which logs every executed SQL statement and data volume) where QUERY_TYPE IN (COPY, GET) exhibits anomalous spikes in BYTES_WRITTEN_TO_RESULT from DBeaver_DBeaverUltimate sessions (catching bulk data staging and exfiltration).',
      },
    },
  },

  'aws-imdsv1-ssrf-capitalone-style': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office building whose public front-desk courier obediently fetches any internal hallway address written on a visitor slip. A clever visitor writes down the secret internal key-box address sitting inside the lobby wall, tricks the front-desk courier into walking over and reading aloud the building temporary master keycard from that unguarded box, and then walks straight to the company off-site storage warehouse to haul out every customer crate.',
      storyMappings: [
        {
          storyTerm: 'Front-desk courier fetching any internal address on a visitor slip',
          technicalTerm: 'Reverse-proxy Server-Side Request Forgery (SSRF) reaching link-local 169.254.169.254',
        },
        {
          storyTerm: 'Unguarded internal key-box sitting inside the lobby wall',
          technicalTerm: 'AWS EC2 Instance Metadata Service v1 (IMDSv1) requiring no session header token',
        },
        {
          storyTerm: 'Temporary master keycard read aloud from the box',
          technicalTerm: 'Temporary AWS STS IAM role credentials (ASIA... AccessKeyId, Secret, Token)',
        },
        {
          storyTerm: 'Hauling customer crates out of the off-site warehouse',
          technicalTerm: 'Replaying stolen EC2 role keys from an external IP via aws s3 sync (T1530)',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Approaching the exterior web proxy window, the visitor slips an internal-only wall address into a URL box. Because the proxy fails to check whether the requested address sits inside the building own private wall, it dutifully queries the unguarded internal information panel.',
        storyMappings: [
          {
            storyTerm: 'Exterior web proxy window',
            technicalTerm: 'Misconfigured EC2 reverse proxy or web application vulnerable to SSRF',
          },
          {
            storyTerm: 'Internal-only wall address written on the slip',
            technicalTerm: 'Link-local AWS metadata address http://169.254.169.254/latest/meta-data/',
          },
          {
            storyTerm: 'Unguarded information panel lacking a token check',
            technicalTerm: 'IMDSv1 accepting simple HTTP GET requests without an IMDSv2 PUT session token',
          },
          {
            storyTerm: 'Guard counter catching tokenless panel visits',
            technicalTerm: 'Suricata SID 2028910 and AWS CloudWatch MetadataNoToken metric > 0',
          },
        ],
        detectionAndEvidence:
          'Monitor perimeter IDS rules such as Suricata SID 2028910 (alerting on incoming HTTP parameters containing 169.254.169.254) alongside the AWS CloudWatch MetadataNoToken metric (which counts every tokenless IMDSv1 query on an EC2 instance) and enforce IMDSv2 HopLimit=1.',
      },
      2: {
        storyAnalogy:
          'Learning the exact name of the server attached guard role from the panel, the visitor sends one more proxied slip asking for the role security drawer and receives a crisp JSON bundle containing the server live temporary keycard, secret passcode, and session stamp.',
        storyMappings: [
          {
            storyTerm: 'Server attached guard role drawer',
            technicalTerm: '/latest/meta-data/iam/security-credentials/<role-name> IMDSv1 endpoint',
          },
          {
            storyTerm: 'Live temporary keycard, passcode, and session stamp',
            technicalTerm: 'Short-lived AWS STS AccessKeyId (ASIA...), SecretAccessKey, and SessionToken',
          },
          {
            storyTerm: 'Crisp bundle returned straight through the front window',
            technicalTerm: '1.3 KB JSON credential payload leaked inside the reverse proxy HTTP response',
          },
          {
            storyTerm: 'Why IMDSv2 blocks this trick',
            technicalTerm: 'IMDSv2 requires an HTTP PUT with X-aws-ec2-metadata-token-ttl-seconds that simple GET SSRF cannot send',
          },
        ],
        detectionAndEvidence:
          'Correlate CloudWatch MetadataNoToken metric spikes (proving IMDSv1 access occurred) with reverse-proxy access logs returning ~1.3 KB responses from /latest/meta-data/iam/security-credentials/ (confirming live EC2 IAM role key extraction).',
      },
      3: {
        storyAnalogy:
          'Loading the stolen temporary keycard onto their own computer far outside the cloud estate, the intruder dials the company cloud storage vault directly and mirrors gigabytes of sensitive buckets before the temporary card expires.',
        storyMappings: [
          {
            storyTerm: 'Loading the stolen keycard outside the cloud estate',
            technicalTerm: 'Configuring stolen ASIA... STS keys on an external attacker workstation',
          },
          {
            storyTerm: 'Mirroring gigabytes of sensitive buckets',
            technicalTerm: 'Executing aws s3 sync to bulk-download confidential S3 objects',
          },
          {
            storyTerm: 'Impossible badge-location alarm',
            technicalTerm: 'AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
          },
          {
            storyTerm: 'Vault ledger naming the exact hijacked server badge',
            technicalTerm: 'CloudTrail AssumedRole event for i-0a84b92c11e3f0412 calling s3:GetObject from non-AWS IP',
          },
        ],
        detectionAndEvidence:
          'Alert immediately on AWS GuardDuty InstanceCredentialExfiltration.OutsideAWS findings and CloudTrail logs showing userIdentity.type == "AssumedRole" for an EC2 instance principal (such as i-0a84b92c11e3f0412) calling s3:GetObject from an external non-AWS IP address (confirming off-instance key replay).',
      },
    },
  },

  'k8s-runc-cve-2024-21626-leaky-vessels': {
    briefing: {
      storyAnalogy:
        'Imagine a high-security container ship where sealed steel boxes keep every guest isolated from the ship hull. Due to a latch slip during startup, the container loader leaves a side peephole door to the ship outside engine frame open right as it seats a guest inside, leaving the guest standing with one foot on the open hull so walking backward up a few flights of stairs leads straight into the ship master bridge and credential cabinet.',
      storyMappings: [
        {
          storyTerm: 'Side peephole door left open during box startup',
          technicalTerm: 'Leaked host /sys/fs/cgroup file descriptor (fd 7/8/9) inside runc:[2:INIT] (CVE-2024-21626)',
        },
        {
          storyTerm: 'Guest standing with one foot on the open hull',
          technicalTerm: 'Container process CWD retaining host VFS dentry via WORKDIR /proc/self/fd/7',
        },
        {
          storyTerm: 'Walking backward up a few flights of stairs onto the bridge',
          technicalTerm: 'Relative traversal ../../../../ escaping container root to the host filesystem',
        },
        {
          storyTerm: 'Raiding the ship master credential cabinet',
          technicalTerm: 'Reading host /etc/shadow, /etc/crontab, and Kubelet node certificates',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'During box assembly, the container launcher opens an internal pass to the ship outside maintenance frame and forgets to close it before honoring the guest custom starting room address, accidentally placing the guest starting mat right inside the leaked pass.',
        storyMappings: [
          {
            storyTerm: 'Container launcher assembling the sealed box',
            technicalTerm: 'runc:[2:INIT] runtime process initializing container namespaces',
          },
          {
            storyTerm: 'Unclosed pass to the ship outside maintenance frame',
            technicalTerm: 'Leaked host /sys/fs/cgroup file descriptor (fd 7, 8, or 9) missing O_CLOEXEC',
          },
          {
            storyTerm: 'Custom starting room address pointing into the pass',
            technicalTerm: 'Crafted OCI image WORKDIR /proc/self/fd/7 triggering chdir() to host cgroup',
          },
          {
            storyTerm: 'Hull audit camera catching the odd step',
            technicalTerm: 'Linux auditd SYSCALL chdir targeting /proc/self/fd/7 inside runc:[2:INIT]',
          },
        ],
        detectionAndEvidence:
          'Monitor Linux auditd SYSCALL chdir events (kernel-level syscall auditing capturing exact directory change targets) where runc:[2:INIT] resolves /proc/self/fd/7, /proc/self/fd/8, or /proc/self/fd/9 (direct proof of CVE-2024-21626 Leaky Vessels exploitation).',
      },
      2: {
        storyAnalogy:
          'Even after the steel box walls slam shut around the room, the guest shoes remain planted on an unreachable outside floor tile belonging to the ship main deck, bypassing the entire wall boundary from the very first heartbeat.',
        storyMappings: [
          {
            storyTerm: 'Steel box walls slamming shut',
            technicalTerm: 'pivot_root confining the container root filesystem (/)',
          },
          {
            storyTerm: 'Shoes still planted on an unreachable outside floor tile',
            technicalTerm: 'Container proc.cwd anchored to an outside host VFS dentry ((unreachable))',
          },
          {
            storyTerm: 'Real-time floor-tile sensor spotting the breach',
            technicalTerm: 'Falco / Sysdig eBPF runtime alert flagging proc.cwd starting with (unreachable)',
          },
          {
            storyTerm: 'Broken wall isolation',
            technicalTerm: 'Host filesystem reachable via relative paths despite intact container mount view',
          },
        ],
        detectionAndEvidence:
          'Deploy Sysdig or CNCF Falco eBPF runtime rules (kernel sensors monitoring live process directory pointers) alerting whenever a containerized process exhibits proc.cwd starting with (unreachable) or /proc/self/fd/ (catching live container escape state).',
      },
      3: {
        storyAnalogy:
          'Stepping backward up four staircases from that outside tile, the escaped guest reaches the ship central control floor to open the master password ledger, read Kubelet station keys, and slip a recurring job onto the ship schedule.',
        storyMappings: [
          {
            storyTerm: 'Stepping backward up four staircases',
            technicalTerm: 'Relative openat syscalls traversing ../../../../ above the leaked cgroup directory',
          },
          {
            storyTerm: 'Master password ledger on the control floor',
            technicalTerm: 'Host root filesystem files ../../../../etc/shadow and ../../../../etc/crontab',
          },
          {
            storyTerm: 'Station keys stolen for fleet-wide takeover',
            technicalTerm: 'Host Kubelet client certificates and kubeconfig enabling cluster lateral movement',
          },
          {
            storyTerm: 'Hallway sensor catching cross-boundary reads',
            technicalTerm: 'Auditd openat telemetry flagging containerized PIDs traversing ../../../../etc/*',
          },
        ],
        detectionAndEvidence:
          'Alert on Linux auditd openat syscalls (low-level kernel file-open tracking) originating from a containerized PID accessing relative traversal paths such as ../../../../etc/shadow or ../../../../etc/crontab (confirming full host root filesystem compromise).',
      },
    },
  },

  'microsoft-storm-0558-msa-signing-key': {
    briefing: {
      storyAnalogy:
        'Imagine a global postal system operating two completely separate mail buildings: a public consumer mailroom and a high-security diplomatic embassy mailroom. After salvaging an old 2016 consumer ink stamp that accidentally leaked into an engineer crash notebook, a state spy stamps counterfeit visitor passes for diplomatic staff; because a subtle rule flaw inside the embassy mailroom forgets to check whether the ink stamp came from the consumer desk, the embassy hands over sealed government correspondence silently.',
      storyMappings: [
        {
          storyTerm: 'Old 2016 consumer ink stamp salvaged from a crash notebook',
          technicalTerm: 'Inactive 2016 MSA consumer signing key acquired from a Windows crash dump',
        },
        {
          storyTerm: 'Subtle flaw letting consumer ink stamps pass at the embassy mailroom',
          technicalTerm: 'Exchange Online / OWA realm validation flaw accepting MSA-signed tokens for enterprise tenants',
        },
        {
          storyTerm: 'Forged passes with zero record in the embassy front-gate book',
          technicalTerm: 'Forged OWA access tokens with empty ClientAppId and zero Entra ID SignInLogs entries',
        },
        {
          storyTerm: 'Silently reading sealed diplomatic mailbags',
          technicalTerm: 'OWA GetItem mailbox exfiltration caught via Purview MailItemsAccessed Action=ViaProxy',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Having compromised an engineer workstation and combed through a diagnostic memory crash notebook, the espionage crew extracts a retired 2016 consumer-mailroom master wax stamp and begins embossing self-signed access passes at will.',
        storyMappings: [
          {
            storyTerm: 'Diagnostic memory crash notebook',
            technicalTerm: 'Corporate engineer Windows crash dump containing leaked 2016 MSA consumer signing key',
          },
          {
            storyTerm: 'Retired 2016 consumer-mailroom wax stamp',
            technicalTerm: 'Inactive Microsoft Account (MSA) cryptographic key identified by its 2016 kid header',
          },
          {
            storyTerm: 'Embossing self-signed access passes at will',
            technicalTerm: 'Offline minting of arbitrary forged OWA authentication JWTs for target users',
          },
          {
            storyTerm: 'Stamp serial number exposing the forgery',
            technicalTerm: 'JWT header referencing the retired 2016 MSA consumer kid against enterprise endpoints',
          },
        ],
        detectionAndEvidence:
          'Inspect OWA and Exchange Online token validation telemetry alongside CISA AA23-193A indicators (forensic guidance on Storm-0558) flagging JWT headers referencing the retired 2016 MSA consumer signing kid presented to enterprise Exchange Online tenants.',
      },
      2: {
        storyAnalogy:
          'Walking up to the enterprise diplomatic mailroom with a pass embossed by the consumer stamp, the spy slips straight through a validation blind spot that checks whether the ink stamp is authentic without checking whether it belongs to the enterprise vault rather than the consumer desk.',
        storyMappings: [
          {
            storyTerm: 'Validation blind spot between consumer and enterprise desks',
            technicalTerm: 'Exchange Online GetAccessTokenForResource realm isolation bypass',
          },
          {
            storyTerm: 'Zero entry in the main corporate front-gate logbook',
            technicalTerm: 'Complete absence of corresponding Microsoft Entra ID SignInLogs authentication events',
          },
          {
            storyTerm: 'Distinctive blank badge-issuer field',
            technicalTerm: 'Exchange audit entries showing AppId 00000002-0000-0ff1-ce00-000000000000 with empty ClientAppId',
          },
          {
            storyTerm: 'Entering diplomatic mailrooms silently',
            technicalTerm: 'Unauthenticated enterprise OWA session minted from a forged consumer-signed token',
          },
        ],
        detectionAndEvidence:
          'Audit Exchange Online Unified Audit Logs (central Microsoft 365 activity records) for AppId == "00000002-0000-0ff1-ce00-000000000000" paired with an empty ClientAppId and zero matching Entra ID SignInLogs entries (the exact Storm-0558 token forgery gap).',
      },
      3: {
        storyAnalogy:
          'Inside the diplomatic post office, the spy quietly pulls selected executive letters through the web mail reader without leaving an ordinary sign-in trail, until federal defenders cross-check detailed mail-access logs and spot the unusual proxy-relay stamp.',
        storyMappings: [
          {
            storyTerm: 'Pulling selected executive letters quietly',
            technicalTerm: 'OWA GetItem REST calls harvesting high-value diplomatic and government emails',
          },
          {
            storyTerm: 'Detailed mail-access ledger catching the raid',
            technicalTerm: 'Microsoft Purview MailItemsAccessed (OfficeActivity / CloudAppEvents) telemetry',
          },
          {
            storyTerm: 'Unusual proxy-relay stamp inside the receipt',
            technicalTerm: 'ClientInfoString containing Action=ViaProxy paired with Exchange Online AppId',
          },
          {
            storyTerm: 'Global key revocation shutting every forged pass',
            technicalTerm: 'Microsoft revoking all legacy MSA consumer keys and tightening enterprise token scope checks',
          },
        ],
        detectionAndEvidence:
          'Run KQL hunting queries across OfficeActivity and CloudAppEvents (Microsoft Purview advanced mailbox audit streams) filtering for Operation == "MailItemsAccessed", AppId == "00000002-0000-0ff1-ce00-000000000000", and ClientInfoString containing Action=ViaProxy (isolating Storm-0558 diplomatic mailbox theft).',
      },
    },
  },

  'azure-ad-connect-pass-the-certificate': {
    briefing: {
      storyAnalogy:
        'Imagine a courier bridge building connecting an on-premises castle registry to a rooftop cloud headquarters. Inside the bridge cellar sits a locked database holding the courier master password that syncs every castle citizen into the cloud; an intruder breaks into the bridge building, uses the bridge own built-in unscrambling lens to read that courier password aloud, empties the castle ledger, and stamps forged seamless-entry passes straight into the cloud tower.',
      storyMappings: [
        {
          storyTerm: 'Locked cellar database inside the courier bridge building',
          technicalTerm: 'Entra Connect ADSync SQL LocalDB (ADSync.mdf / mms_management_agent table)',
        },
        {
          storyTerm: 'Bridge own built-in unscrambling lens',
          technicalTerm: 'PowerShell loading mcrypt.dll to DPAPI-decrypt the encrypted MSOL_<hex> password',
        },
        {
          storyTerm: 'Emptying the castle master ledger with the courier key',
          technicalTerm: 'Executing Active Directory DCSync using the over-privileged MSOL_ service account',
        },
        {
          storyTerm: 'Stamping forged seamless-entry passes into the cloud tower',
          technicalTerm: 'Extracting AZUREADSSOACC$ Kerberos key to forge Silver Tickets into Microsoft 365',
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
          },
          {
            storyTerm: 'Impersonating the local sync clerk',
            technicalTerm: 'Querying ADSync SQL LocalDB running under NT SERVICE\\ADSync privileges',
          },
          {
            storyTerm: 'Cellar database drawer holding encrypted secrets',
            technicalTerm: 'ADSync.mdf tables mms_management_agent and mms_server_configuration',
          },
          {
            storyTerm: 'Watchdog noticing unauthorized cellar entry',
            technicalTerm: 'Sysmon EventID 1 flagging SqlLocalDB.exe info ADSync or odd access to ADSync.mdf',
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
          },
          {
            storyTerm: 'Politely unwrapping the encrypted wrapper',
            technicalTerm: 'DPAPI decryption of the keyset protecting the MSOL_<hex> connector credential',
          },
          {
            storyTerm: 'Plaintext master courier password',
            technicalTerm: 'Recovered cleartext password for the on-premises MSOL_<hex> AD sync account',
          },
          {
            storyTerm: 'Why this key is a crown jewel',
            technicalTerm: 'MSOL_ holds Replicating Directory Changes All rights across the entire AD forest',
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
          },
          {
            storyTerm: 'Lifting the cloud seamless-login stamp',
            technicalTerm: 'Dumping the AZUREADSSOACC$ computer account Kerberos key via DCSync',
          },
          {
            storyTerm: 'Minting forged passes walking straight into cloud mailboxes',
            technicalTerm: 'Forging Seamless SSO Kerberos tickets to impersonate any synced Entra ID user',
          },
          {
            storyTerm: 'Total hybrid on-prem to cloud takeover',
            technicalTerm: 'Compromise of both local Active Directory and federated Microsoft 365 cloud accounts',
          },
        ],
      },
    },
  },

  'aws-cognito-iam-passrole-privesc': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office where a junior clerk is forbidden from unlocking the executive safe directly, yet holds two seemingly harmless permissions: hiring a temporary robot worker and handing that robot any spare manager badge off the wall. The junior clerk hires a one-line robot worker, hangs a senior manager badge around the robot neck, tells the robot to promote the junior clerk straight to Chief Administrator, and then switches off the hallway security cameras.',
      storyMappings: [
        {
          storyTerm: 'Hiring a robot worker and hanging a senior manager badge on it',
          technicalTerm: 'Chaining iam:PassRole with lambda:CreateFunction20150331 using an admin role',
        },
        {
          storyTerm: 'Telling the robot to promote the junior clerk to Chief Administrator',
          technicalTerm: 'Invoking Lambda boto3 code to call iam:AttachUserPolicy (AdministratorAccess)',
        },
        {
          storyTerm: 'Switching off the hallway security cameras',
          technicalTerm: 'Executing cloudtrail:StopLogging or DeleteTrail to blind cloud auditing (T1562.008)',
        },
        {
          storyTerm: 'Two seemingly harmless permissions creating a master key',
          technicalTerm: 'Classic AWS IAM privilege escalation path via PassRole + Lambda execution',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Noticing they hold both permission to deploy a tiny automated worker and permission to assign an existing senior role badge to that worker, the low-privileged user creates a fresh cloud script and hangs a powerful administrative role right around its neck.',
        storyMappings: [
          {
            storyTerm: 'Tiny automated worker deployed on demand',
            technicalTerm: 'Newly created AWS Lambda function via lambda:CreateFunction20150331',
          },
          {
            storyTerm: 'Hanging a powerful administrative role around its neck',
            technicalTerm: 'iam:PassRole assigning an administrative or deployment IAM role to the Lambda',
          },
          {
            storyTerm: 'Junior clerk acting indirectly',
            technicalTerm: 'Low-privileged IAM user lacking direct iam:AttachUserPolicy rights',
          },
          {
            storyTerm: 'Cloud ledger recording the role handoff',
            technicalTerm: 'AWS CloudTrail CreateFunction20150331 logging requestParameters.role',
          },
        ],
        detectionAndEvidence:
          'Alert on AWS CloudTrail CreateFunction20150331 events (immutable API logs capturing serverless deployments) whenever requestParameters.role assigns a high-privilege administrative or deployment IAM role passed by a non-CI user identity (catching PassRole escalation setup).',
      },
      2: {
        storyAnalogy:
          'Pressing the start button on the newly created robot worker, the clerk watches the robot use its borrowed manager badge to walk straight into the identity room and pin a permanent Chief Administrator ribbon onto the clerk own account.',
        storyMappings: [
          {
            storyTerm: 'Pressing the start button on the robot worker',
            technicalTerm: 'Calling lambda:InvokeFunction to run the embedded Python boto3 escalation script',
          },
          {
            storyTerm: 'Pinning a permanent Chief Administrator ribbon onto the clerk',
            technicalTerm: 'Lambda role calling iam:AttachUserPolicy with arn:aws:iam::aws:policy/AdministratorAccess',
          },
          {
            storyTerm: 'Automated cloud watchdog sounding the alarm',
            technicalTerm: 'AWS GuardDuty finding PrivilegeEscalation:IAMUser/AdministrativePermissions',
          },
          {
            storyTerm: 'Permanent full-account control achieved',
            technicalTerm: 'Original low-privileged user now holding unrestricted AWS AdministratorAccess',
          },
        ],
        detectionAndEvidence:
          'Monitor AWS GuardDuty PrivilegeEscalation:IAMUser/AdministrativePermissions findings alongside CloudTrail AttachUserPolicy events (which track IAM permission grants) where policyArn ends in :policy/AdministratorAccess invoked by a Lambda execution role.',
      },
      3: {
        storyAnalogy:
          'Now wearing the freshly pinned Chief Administrator badge, the intruder rushes straight to the cloud security booth and flips the master recording switch to off so future vault raids vanish from the central diary.',
        storyMappings: [
          {
            storyTerm: 'Cloud security booth master recording switch',
            technicalTerm: 'AWS CloudTrail audit trail recording account-wide API calls',
          },
          {
            storyTerm: 'Flipping the recording switch to off',
            technicalTerm: 'Calling cloudtrail:StopLogging or cloudtrail:DeleteTrail (MITRE T1562.008)',
          },
          {
            storyTerm: 'Dedicated stealth alarm catching the blackout',
            technicalTerm: 'AWS GuardDuty Stealth:IAMUser/CloudTrailLoggingDisabled alert',
          },
          {
            storyTerm: 'Preventing anyone from touching the switch',
            technicalTerm: 'AWS Organizations Service Control Policy (SCP) denying StopLogging account-wide',
          },
        ],
        detectionAndEvidence:
          'Configure real-time CloudWatch EventBridge alarms and AWS GuardDuty Stealth:IAMUser/CloudTrailLoggingDisabled alerts on any CloudTrail eventName matching StopLogging or DeleteTrail (which indicate deliberate anti-forensic blinding of cloud audit logs).',
      },
    },
  },

  'sysdig-scarleteel-aws-eks-terraform': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud shipping port where an unguarded storefront kiosk accidentally lets an outsider peek into the local dockworker badge tray. Lifting the dockworker temporary badge, the intruder opens a storage locker holding the port complete paper blueprint book, which still has plaintext master cloud keys scribbled in the margins, and uses an automated cloud-raiding toolkit to sweep proprietary designs and compute power across neighboring accounts.',
      storyMappings: [
        {
          storyTerm: 'Unguarded storefront kiosk leaking the dockworker badge tray',
          technicalTerm: 'Exposed EKS workload pod RCE harvesting worker node IMDS IAM credentials',
        },
        {
          storyTerm: 'Port blueprint book with plaintext master keys in the margins',
          technicalTerm: 'S3 terraform.tfstate files leaking plaintext AWS IAM static secret keys',
        },
        {
          storyTerm: 'Automated cloud-raiding toolkit sweeping neighboring accounts',
          technicalTerm: 'Pacu AWS exploitation framework pivoting across accounts via CreateAccessKey',
        },
        {
          storyTerm: 'Stealing proprietary designs and hijacking compute rigs',
          technicalTerm: 'Exfiltrating intellectual property (GetFunction / S3) and launching crypto miners',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a public web flaw on a containerized kiosk inside the cluster, the intruder reaches straight out to the underlying server local badge dispenser and grabs the temporary cloud key assigned to the entire worker node.',
        storyMappings: [
          {
            storyTerm: 'Public web flaw on a containerized kiosk',
            technicalTerm: 'Initial RCE inside an internet-exposed Amazon EKS workload pod',
          },
          {
            storyTerm: 'Underlying server local badge dispenser',
            technicalTerm: 'EC2 Instance Metadata Service (169.254.169.254) reachable from pod network',
          },
          {
            storyTerm: 'Temporary cloud key assigned to the entire worker node',
            technicalTerm: 'Over-privileged eks-node-role STS credentials shared by all pods on the node',
          },
          {
            storyTerm: 'Stepping out of the container into the cloud control plane',
            technicalTerm: 'Transition from application RCE to AWS API access using harvested node IAM keys',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using the borrowed dockworker badge to browse cloud storage buckets, the intruder spots the engineering team infrastructure state ledgers sitting unguarded and pulls out long-lived master cloud keys written right inside them in plain sight.',
        storyMappings: [
          {
            storyTerm: 'Infrastructure state ledgers sitting in cloud storage',
            technicalTerm: 'Amazon S3 objects ending in terraform.tfstate storing full deployment state',
          },
          {
            storyTerm: 'Long-lived master keys written inside in plain sight',
            technicalTerm: 'Unencrypted plaintext AWS IAM Access Keys and Secret Keys inside tfstate JSON',
          },
          {
            storyTerm: 'Dockworker opening an architect-only locker',
            technicalTerm: 'eks-node-role reading .tfstate objects normally accessed only by CI/CD pipelines',
          },
          {
            storyTerm: 'Storage ledger recording the suspicious read',
            technicalTerm: 'AWS CloudTrail S3 Data Event GetObject on *.tfstate by eks-node-role',
          },
        ],
        detectionAndEvidence:
          'Enable AWS CloudTrail S3 Data Events (object-level storage audit logs recording every file download) and alert whenever GetObject targets keys ending in .tfstate from an EKS worker node role (eks-node-role) instead of the authorized CI/CD Terraform pipeline role.',
      },
      3: {
        storyAnalogy:
          'Armed with the freshly discovered permanent master keys, the intruder spins up an automated cloud-exploitation toolkit to mint backdoor keys, cross over into linked corporate cloud accounts, download proprietary code, and hijack expensive compute engines.',
        storyMappings: [
          {
            storyTerm: 'Automated cloud-exploitation toolkit',
            technicalTerm: 'Pacu open-source AWS exploitation framework running from Kali Linux',
          },
          {
            storyTerm: 'Minting permanent backdoor keys',
            technicalTerm: 'iam:CreateAccessKey persistence ensuring access after node role rotation',
          },
          {
            storyTerm: 'Downloading proprietary code across accounts',
            technicalTerm: 'Cross-account pivot calling lambda:GetFunction and S3 exfiltration',
          },
          {
            storyTerm: 'Distinctive tool fingerprint left in the audit diary',
            technicalTerm: 'CloudTrail userAgent containing kali or pacu immediately following tfstate reads',
          },
        ],
        detectionAndEvidence:
          'Monitor AWS CloudTrail CreateAccessKey and GetFunction API logs (tracking persistence creation and proprietary code retrieval) for userAgent strings containing kali or pacu occurring shortly after S3 terraform.tfstate downloads (confirming SCARLETEEL post-exploitation).',
      },
    },
  },

  'gcp-service-account-hmac-key-pivot': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud campus where every new virtual office comes pre-assigned a shared default maintenance badge that accidentally carries wide editor authority across the whole estate. Discovering that overly generous badge from outside the campus, an intruder walks up to the key-duplication kiosk, cuts a permanent offline steel copy of that badge, and takes the steel copy back to their own hideout to empty corporate cloud storage vaults at leisure.',
      storyMappings: [
        {
          storyTerm: 'Shared default maintenance badge carrying wide editor authority',
          technicalTerm: 'Over-privileged Default Compute Engine Service Account (*-compute@developer.gserviceaccount.com)',
        },
        {
          storyTerm: 'Cutting a permanent offline steel copy at the key kiosk',
          technicalTerm: 'Calling iam.serviceAccountKeys.create to mint persistent loot_key.json',
        },
        {
          storyTerm: 'Taking the steel copy outside the campus to empty storage vaults',
          technicalTerm: 'Activating loot_key.json from an external IP to exfiltrate GCS buckets (storage.objects.get)',
        },
        {
          storyTerm: 'Campus key-duplication ledger catching cross-identity cutting',
          technicalTerm: 'GCP Admin Activity Audit Log CreateServiceAccountKey where principalEmail != resourceName',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Peeking into the cloud staff roster from an outside street address, the intruder immediately spots the default Compute maintenance badge still holding broad project-wide Editor powers across storage, databases, and servers.',
        storyMappings: [
          {
            storyTerm: 'Peeking into the cloud staff roster from outside',
            technicalTerm: 'google.iam.admin.v1.ListServiceAccounts called from external IP 198.51.100.73',
          },
          {
            storyTerm: 'Default Compute maintenance badge with broad powers',
            technicalTerm: 'Default *-compute@developer.gserviceaccount.com carrying roles/editor',
          },
          {
            storyTerm: 'Campus directory audit book',
            technicalTerm: 'Google Cloud IAM Admin Activity Audit Logs recording enumeration calls',
          },
          {
            storyTerm: 'High-value lateral pivot target',
            technicalTerm: 'Single service account granting read/write access to GCS and compute resources',
          },
        ],
        detectionAndEvidence:
          'Monitor Google Cloud IAM Audit Logs (central control-plane logs tracking identity queries and mutations) for google.iam.admin.v1.ListServiceAccounts calls originating from unexpected external non-GCP IP addresses such as 198.51.100.73 (early cloud reconnaissance).',
      },
      2: {
        storyAnalogy:
          'Rather than relying on short-lived lobby passes that expire in an hour, the intruder uses key-creation rights to step up to the badge printer and stamp a permanent, user-managed JSON master key belonging to that powerful default maintenance account.',
        storyMappings: [
          {
            storyTerm: 'Badge printer stamping a permanent master key',
            technicalTerm: 'google.iam.admin.v1.CreateServiceAccountKey (iam.serviceAccountKeys.create)',
          },
          {
            storyTerm: 'Permanent offline steel copy',
            technicalTerm: 'User-managed private RSA JSON key file (loot_key.json) valid indefinitely until revoked',
          },
          {
            storyTerm: 'One person printing keys for a different account',
            technicalTerm: 'Audit log anomaly where principalEmail does not match resourceName',
          },
          {
            storyTerm: 'Cloud guard alarm flagging key minting',
            technicalTerm: 'Google Cloud Security Command Center (SCC) persistent key creation finding',
          },
        ],
        detectionAndEvidence:
          'Alert on Google Cloud Admin Activity Audit Logs and Security Command Center (SCC) findings for google.iam.admin.v1.CreateServiceAccountKey (permanent key minting) especially where principalEmail != resourceName (indicating cross-identity key creation for persistence).',
      },
      3: {
        storyAnalogy:
          'Loading the permanent steel key onto an external laptop far away from Google Cloud, the intruder signs in directly as the powerful Compute maintenance account and empties sensitive customer buckets straight over the public internet.',
        storyMappings: [
          {
            storyTerm: 'Loading the steel key onto an external laptop',
            technicalTerm: 'gcloud auth activate-service-account --key-file=loot_key.json from an external IP',
          },
          {
            storyTerm: 'Emptying sensitive customer storage vaults',
            technicalTerm: 'Bulk Cloud Storage exfiltration generating storage.objects.get Data Access events',
          },
          {
            storyTerm: 'Distinctive external steel-key stamp in the vault diary',
            technicalTerm: 'Non-empty authenticationInfo.serviceAccountKeyName paired with a non-GCP source IP',
          },
          {
            storyTerm: 'Organization-wide lock preventing steel copies',
            technicalTerm: 'GCP Org Policy constraints/iam.disableServiceAccountKeyCreation',
          },
        ],
        detectionAndEvidence:
          'Correlate Google Cloud Data Access Audit Logs (which track individual bucket object downloads) for storage.objects.get invoked by *-compute@developer.gserviceaccount.com carrying a non-empty authenticationInfo.serviceAccountKeyName from an external IP address (confirming off-cloud exfiltration).',
      },
    },
  },

  'okta-har-file-session-token-hijack': {
    briefing: {
      storyAnalogy:
        'Imagine a busy customer-support desk where enterprise administrators mail in full browser traffic recordings to help troubleshoot login glitches, forgetting to black out their own live master wristbands printed inside the packet headers. After breaching the support ticket vault, an intruder lifts those still-live master wristbands straight out of the uploaded recordings, replays them from an overseas proxy to walk straight past multi-factor locks, and mints permanent master API keys before alert response teams slam the door.',
      storyMappings: [
        {
          storyTerm: 'Uploaded troubleshooting recordings leaking live wristbands',
          technicalTerm: 'Unsanitized browser .har files exposing Cookie: sid=... and X-Okta-XsrfToken headers',
        },
        {
          storyTerm: 'Replaying live wristbands from an overseas proxy past MFA locks',
          technicalTerm: 'Hijacking *-admin.okta.com Super Admin sessions from a foreign VPN ASN (T1550.004)',
        },
        {
          storyTerm: 'Minting permanent master keys before defenders slam the door',
          technicalTerm: 'Calling system.api_token.create to mint Okta SSWS API tokens or rogue IdPs',
        },
        {
          storyTerm: 'Real-time security desk catching the teleporting wristband',
          technicalTerm: 'Okta System Log alerting on externalSessionId ASN shift followed by privilege grants',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Ransacking a compromised support-case filing cabinet, the intruder opens raw browser network recordings uploaded by helpful IT admins and immediately extracts active, unredacted administrator session wristbands still stamped inside the headers.',
        storyMappings: [
          {
            storyTerm: 'Raw browser network recordings in support tickets',
            technicalTerm: 'HTTP Archive (.har) JSON diagnostic files uploaded to the Okta support portal',
          },
          {
            storyTerm: 'Active unredacted administrator wristbands inside headers',
            technicalTerm: 'Live Cookie: sid=... session cookies and X-Okta-XsrfToken values for *-admin.okta.com',
          },
          {
            storyTerm: 'Forgetting to black out secrets before mailing',
            technicalTerm: 'Unsanitized HAR exports preserving live authentication cookies in plaintext JSON',
          },
          {
            storyTerm: 'Support cabinet breach feeding downstream targets',
            technicalTerm: 'Upstream support-system access enabling targeted downstream enterprise takeovers',
          },
        ],
        detectionAndEvidence:
          'Scan outbound support attachments and CI/browser diagnostic dumps for .har JSON files containing "name": "sid" and "X-Okta-XsrfToken" headers targeting *-admin.okta.com (enforcing automated HAR sanitization before external upload).',
      },
      2: {
        storyAnalogy:
          'Pasting the lifted session wristband straight into their own browser from an overseas VPN booth, the intruder walks straight into the victim Super Admin control panel without ever typing a password or touching a hardware security key.',
        storyMappings: [
          {
            storyTerm: 'Pasting the lifted wristband into their own browser',
            technicalTerm: 'Injecting stolen sid cookie to impersonate the authenticated Okta administrator',
          },
          {
            storyTerm: 'Walking straight past passwords and hardware security keys',
            technicalTerm: 'Web Session Cookie replay (MITRE T1550.004) bypassing FIDO2/WebAuthn MFA completely',
          },
          {
            storyTerm: 'Impossible geographic jump of the same wristband',
            technicalTerm: 'Identical externalSessionId suddenly appearing from a foreign commercial VPN ASN',
          },
          {
            storyTerm: 'Super Admin control panel reached',
            technicalTerm: 'Full administrative access to the victim enterprise *-admin.okta.com tenant',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Racing against the clock before the temporary wristband expires or defenders spot the sudden address jump, the intruder attempts to print permanent master API keys or bolt on a rogue identity bridge, triggering real-time security alarms at vigilant defender centers.',
        storyMappings: [
          {
            storyTerm: 'Printing permanent master API keys before the clock runs out',
            technicalTerm: 'Okta System Log event system.api_token.create minting long-lived SSWS API tokens',
          },
          {
            storyTerm: 'Bolting on a rogue identity bridge or boosting privileges',
            technicalTerm: 'user.account.privilege.grant or system.idp.lifecycle.create persistence attempts',
          },
          {
            storyTerm: 'Vigilant defender centers spotting the ASN jump',
            technicalTerm: 'Cloudflare SIRT and BeyondTrust real-time correlation on externalSessionId ASN shift',
          },
          {
            storyTerm: 'Slamming the door shut instantly',
            technicalTerm: 'Automated session revocation and IP-binding policies invalidating replayed cookies',
          },
        ],
        detectionAndEvidence:
          'Correlate Okta System Logs (central identity audit events) for system.api_token.create, user.account.privilege.grant, or system.idp.lifecycle.create occurring immediately after an ASN or IP change on the same externalSessionId (the exact Cloudflare and BeyondTrust containment trigger).',
      },
    },
  },

  'dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape': {
    briefing: {
      storyAnalogy:
        'Imagine a guarded container warehouse where a rogue worker first asks the front-desk policy book what rooms their badge can unlock, then orders a brand-new privileged inspection booth with its back door hinged directly onto the warehouse master floor, and finally steps straight out of that booth into the warehouse chief control room while a kernel-level floor sensor sounds an immediate alarm.',
      storyMappings: [
        {
          storyTerm: 'Asking the front-desk policy book what rooms the badge can unlock',
          technicalTerm: 'ServiceAccount RBAC SelfSubjectRulesReview logged in kube-apiserver audit logs',
        },
        {
          storyTerm: 'Ordering a booth with its back door hinged onto the master floor',
          technicalTerm: 'Creating a privileged Pod with hostPID: true and hostPath: /',
        },
        {
          storyTerm: 'Stepping straight into the warehouse chief control room',
          technicalTerm: 'nsenter -t 1 -m -u -i -n escaping into host PID 1 namespaces',
        },
        {
          storyTerm: 'Kernel-level floor sensor sounding an immediate alarm',
          technicalTerm: 'CNCF Falco eBPF runtime alert catching container namespace breakout',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Checking what doors their stolen container badge can open, the intruder submits a self-audit inquiry to the central cluster clerk, who dutifully prints out their exact permissions while recording the reconnaissance query in the master audit diary.',
        storyMappings: [
          {
            storyTerm: 'Submitting a self-audit inquiry to the cluster clerk',
            technicalTerm: 'kubectl auth can-i --list invoking authorization.k8s.io SelfSubjectRulesReview',
          },
          {
            storyTerm: 'Stolen container badge',
            technicalTerm: 'Compromised Kubernetes pod ServiceAccount bearer JWT token',
          },
          {
            storyTerm: 'Master audit diary recording the check',
            technicalTerm: 'kube-apiserver Audit Log capturing SelfSubjectRulesReview verb=create',
          },
          {
            storyTerm: 'Discovering pod-creation authority',
            technicalTerm: 'Confirming RBAC permission to create privileged Pods in the target namespace',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using their newly confirmed pod-creation rights, the intruder submits a blueprint for a stripped-down breakout booth with all safety guards disabled, full visibility into host workers, and the host entire root hallway mounted straight inside.',
        storyMappings: [
          {
            storyTerm: 'Breakout booth blueprint with all safety guards disabled',
            technicalTerm: 'Pod manifest setting securityContext.privileged: true',
          },
          {
            storyTerm: 'Full visibility into host workers',
            technicalTerm: 'Pod spec enabling hostPID: true sharing the worker node PID namespace',
          },
          {
            storyTerm: 'Host root hallway mounted straight inside',
            technicalTerm: 'hostPath volume binding host / directly into the container filesystem',
          },
          {
            storyTerm: 'Audit diary preserving the full submitted blueprint',
            technicalTerm: 'Kubernetes Audit Log RequestObject capturing privileged pod creation',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Stepping inside the newly launched breakout booth, the intruder flips the namespace master switch straight into the underlying node main supervisor process, triggering an unmistakable kernel-level breakout siren.',
        storyMappings: [
          {
            storyTerm: 'Flipping the namespace master switch into the supervisor',
            technicalTerm: 'Executing nsenter -t 1 -m -u -i -n to enter host PID 1 mount, UTS, IPC, and net spaces',
          },
          {
            storyTerm: 'Underlying node main supervisor process',
            technicalTerm: 'Host Linux init / systemd process (PID 1) running with full node root privileges',
          },
          {
            storyTerm: 'Unmistakable kernel-level breakout siren',
            technicalTerm: 'Falco eBPF alert detecting setns / nsenter execution inside a container',
          },
          {
            storyTerm: 'Preventive gate blocking privileged blueprints upfront',
            technicalTerm: 'Kubernetes Pod Security Admission (PSA) enforcing the restricted standard',
          },
        ],
      },
    },
  },

  'dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a forensic reconstruction of a cloud storage heist from three matching security ledgers: first, catching the tricked web server handing an unguarded temporary building pass out its side window; second, spotting that exact pass suddenly authenticating from a distant street outside the cloud campus; and third, tallying the exact weight of every archive box hauled out of the warehouse to quantify breach scope.',
      storyMappings: [
        {
          storyTerm: 'Tricked server handing a temporary pass out its side window',
          technicalTerm: 'EC2 IMDSv1 SSRF request retrieving temporary STS role credentials',
        },
        {
          storyTerm: 'Same pass authenticating from a distant street outside campus',
          technicalTerm: 'Off-instance sts:GetCallerIdentity replay triggering GuardDuty OutsideAWS alert',
        },
        {
          storyTerm: 'Tallying the exact weight of every hauled-out archive box',
          technicalTerm: 'CloudTrail S3 Data Event GetObject burst and bytesTransferredOut quantification',
        },
        {
          storyTerm: 'Three matching security ledgers proving end-to-end attribution',
          technicalTerm: 'Correlating proxy logs, GuardDuty findings, and CloudTrail S3 Data Events',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Abusing a vulnerable web proxy endpoint, the intruder persuades a cloud server to fetch its own local identity drawer over the older unauthenticated channel and hand back its temporary role pass.',
        storyMappings: [
          {
            storyTerm: 'Older unauthenticated local identity drawer',
            technicalTerm: 'EC2 Instance Metadata Service v1 (IMDSv1) at 169.254.169.254',
          },
          {
            storyTerm: 'Persuading the web proxy to fetch internal pages',
            technicalTerm: 'Server-Side Request Forgery (SSRF) returning IAM role STS credentials',
          },
          {
            storyTerm: 'Temporary role pass leaked',
            technicalTerm: 'Short-lived AccessKeyId (ASIA...), SecretAccessKey, and SessionToken',
          },
          {
            storyTerm: 'Counter tracking tokenless drawer opens',
            technicalTerm: 'CloudWatch MetadataNoToken metric confirming IMDSv1 usage',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Moments later, the intruder tests the stolen keycard from an outside internet connection to check who they have become, immediately tripping the cloud campus perimeter sensor that knows an internal server badge should never be swiped from outside.',
        storyMappings: [
          {
            storyTerm: 'Testing the keycard to verify identity',
            technicalTerm: 'aws sts get-caller-identity invoked off-instance using stolen EC2 role keys',
          },
          {
            storyTerm: 'Perimeter sensor catching an outside swipe',
            technicalTerm: 'AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
          },
          {
            storyTerm: 'Exact server identity named in the alarm',
            technicalTerm: 'CloudTrail principalId mapping the stolen token directly to the compromised EC2 instance ID',
          },
          {
            storyTerm: 'Foreign street address logged',
            technicalTerm: 'External non-AWS sourceIPAddress recorded on the AssumedRole API call',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With the stolen badge confirmed live, the intruder sweeps through sensitive storage buckets downloading object after object, while investigators tally every single GetObject receipt and byte count to prove exact regulatory impact.',
        storyMappings: [
          {
            storyTerm: 'Sweeping through sensitive storage buckets',
            technicalTerm: 'High-velocity s3:GetObject burst executed via the stolen EC2 AssumedRole',
          },
          {
            storyTerm: 'Tallying every receipt and exact box weight',
            technicalTerm: 'CloudTrail S3 Data Events quantifying object keys and bytesTransferredOut',
          },
          {
            storyTerm: 'Proving exact regulatory breach scope',
            technicalTerm: 'Forensic Athena/CloudTrail query enumerating every exfiltrated S3 object',
          },
          {
            storyTerm: 'Revoking active sessions immediately',
            technicalTerm: 'Attaching a date-scoped Deny inline policy to invalidate active STS tokens',
          },
        ],
      },
    },
  },

  'dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud forensics case study of a shadow-administrator takeover: an ordinary developer who cannot grant themselves master keys uses a delegated robot builder to pass a powerful role to a custom script, commands that script to attach full Administrator ribbons onto their own badge, and then tries to unplug the central security recorder, leaving three unmistakable sequential entries in the tamper-proof cloud ledger.',
      storyMappings: [
        {
          storyTerm: 'Passing a powerful role to a custom script robot',
          technicalTerm: 'iam:PassRole + lambda:CreateFunction20150331 privilege escalation in CloudTrail',
        },
        {
          storyTerm: 'Script attaching full Administrator ribbons onto the developer badge',
          technicalTerm: 'Lambda invocation executing iam:AttachUserPolicy (AdministratorAccess)',
        },
        {
          storyTerm: 'Trying to unplug the central security recorder',
          technicalTerm: 'cloudtrail:StopLogging / DeleteTrail anti-forensics logged right before silencing',
        },
        {
          storyTerm: 'Shadow-administrator loophole closed proactively',
          technicalTerm: 'IAM Permission Boundaries and least-privilege iam:PassRole resource scoping',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a hidden shadow-admin permission pair, the developer registers a brand-new serverless helper function and assigns it a broad administrative execution role that the developer themselves could not directly assume.',
        storyMappings: [
          {
            storyTerm: 'Hidden shadow-admin permission pair',
            technicalTerm: 'Combined iam:PassRole and lambda:CreateFunction permissions on a non-admin user',
          },
          {
            storyTerm: 'Registering a brand-new serverless helper function',
            technicalTerm: 'CloudTrail event lambda:CreateFunction20150331 with embedded escalation payload',
          },
          {
            storyTerm: 'Broad administrative execution role assigned',
            technicalTerm: 'Privileged IAM execution role passed via requestParameters.role',
          },
          {
            storyTerm: 'Audit trail recording both actor and target role',
            technicalTerm: 'CloudTrail userIdentity linked directly to the newly created Lambda ARN',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Triggering the newly built helper function immediately, the developer watches the function step into the IAM control room under its privileged role and attach the full Administrator policy straight back onto the developer own identity.',
        storyMappings: [
          {
            storyTerm: 'Triggering the helper function immediately',
            technicalTerm: 'lambda:InvokeFunction running the attacker escalation routine',
          },
          {
            storyTerm: 'Attaching full Administrator policy back onto the developer',
            technicalTerm: 'CloudTrail iam:AttachUserPolicy granting AdministratorAccess from the Lambda role',
          },
          {
            storyTerm: 'Circular privilege promotion exposed',
            technicalTerm: 'Correlating Lambda creator ARN with the target userName receiving AdministratorAccess',
          },
          {
            storyTerm: 'Guardrail that stops self-promotion',
            technicalTerm: 'IAM Permission Boundaries capping maximum effective permissions of passed roles',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Moments after receiving full Administrator keys, the intruder attempts to turn off or erase the central cloud activity trail, ironically stamping the loudest possible red flare right onto the final recorded page.',
        storyMappings: [
          {
            storyTerm: 'Attempting to turn off or erase the activity trail',
            technicalTerm: 'cloudtrail:StopLogging or cloudtrail:DeleteTrail API invocation',
          },
          {
            storyTerm: 'Loudest red flare stamped on the final recorded page',
            technicalTerm: 'CloudTrail logging the StopLogging event itself before halting delivery',
          },
          {
            storyTerm: 'Backup security ledger preserved outside the account',
            technicalTerm: 'AWS Organizations immutable organization trail streaming to a separate Security account',
          },
          {
            storyTerm: 'Automated incident containment',
            technicalTerm: 'EventBridge rule alerting SOC and quarantining the compromised IAM principal',
          },
        ],
      },
    },
  },

  'dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule': {
    briefing: {
      storyAnalogy:
        'Imagine a corporate mailroom intrusion reconstructed through three distinct security-desk receipts: first, catching the intruder quietly installing a hidden mail-sorting chute that diverts security alerts straight into the trash bin; second, reading the exact barcode scans that distinguish whether the intruder opened specific letters one by one or synced an entire mailbag at once; and third, uncovering a rogue automated courier pass left behind so the intruder can keep reading mail even after the victim changes their password.',
      storyMappings: [
        {
          storyTerm: 'Hidden mail-sorting chute diverting alerts into the trash bin',
          technicalTerm: 'M365 Unified Audit Log Operation="New-InboxRule" hiding security emails in RSS/Deleted Items',
        },
        {
          storyTerm: 'Barcode scans distinguishing single opened letters from full bag syncs',
          technicalTerm: 'MailItemsAccessed telemetry differentiating Bind (individual view) vs Sync (folder dump)',
        },
        {
          storyTerm: 'Rogue automated courier pass surviving password resets',
          technicalTerm: 'Malicious OAuth persistence logged via Operation="Consent to application"',
        },
        {
          storyTerm: 'Central mailroom ledger preserving every action',
          technicalTerm: 'Microsoft Purview Unified Audit Log (UAL) end-to-end BEC investigation',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after slipping into an executive mailbox, the intruder bolts a silent auto-sorting rule onto the inbox so any invoice disputes or security warnings automatically mark themselves read and vanish into an obscure back drawer.',
        storyMappings: [
          {
            storyTerm: 'Silent auto-sorting rule bolted onto the inbox',
            technicalTerm: 'Exchange Online New-InboxRule matching keywords (invoice, wire, security)',
          },
          {
            storyTerm: 'Vanishing into an obscure back drawer',
            technicalTerm: 'Inbox rule actions setting MarkAsRead=True and MoveToFolder=RSS Feeds or Deleted Items',
          },
          {
            storyTerm: 'Mailroom ledger recording the rule creation',
            technicalTerm: 'Unified Audit Log Operation="New-InboxRule" with ClientIP and Parameters',
          },
          {
            storyTerm: 'Keeping the victim blind to business email compromise',
            technicalTerm: 'Hiding attacker-sent phishing replies and bank fraud warnings from the mailbox owner',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To determine whether the intruder merely peeked at three contracts or hauled away the entire executive inbox, investigators examine the mailroom barcode ledger, which marks individual letter opens differently from bulk folder synchronizations.',
        storyMappings: [
          {
            storyTerm: 'Barcode ledger tracking every touched message',
            technicalTerm: 'Microsoft Purview MailItemsAccessed audit event recording InternetMessageId lists',
          },
          {
            storyTerm: 'Peeking at individual letters one by one',
            technicalTerm: 'MailAccessType="Bind" listing exact MessageIds viewed over OWA or Graph API',
          },
          {
            storyTerm: 'Hauling away an entire mailbag at once',
            technicalTerm: 'MailAccessType="Sync" indicating bulk IMAP/ActiveSync/Outlook folder download',
          },
          {
            storyTerm: 'Exact legal breach scoping',
            technicalTerm: 'Correlating SessionId and ClientIPAddress against compromised message inventory',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Before logging off, the intruder approves a shady third-party mail-reader app carrying broad reading rights so that even when the executive changes their door key, the rogue app keeps slipping in through the side mail slot until investigators revoke both the app grant and every live session.',
        storyMappings: [
          {
            storyTerm: 'Approving a shady third-party mail-reader app',
            technicalTerm: 'Unified Audit Log Operation="Consent to application" granting Mail.Read / offline_access',
          },
          {
            storyTerm: 'Surviving ordinary employee password changes',
            technicalTerm: 'Persistent OAuth refresh tokens valid independently of user password resets',
          },
          {
            storyTerm: 'Revoking both the rogue app and every active wristband',
            technicalTerm: 'Removing malicious Enterprise App Service Principal and calling Revoke-MgUserSignInSession',
          },
          {
            storyTerm: 'Locking the side mail slot',
            technicalTerm: 'Enforcing Admin Consent Workflow so users cannot approve unverified OAuth apps',
          },
        ],
      },
    },
  },

  'dfir-entra-id-prt-roadtools-device-registration-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office park that issues long-lived resident smartcards to company-owned laptops so workers stay signed in seamlessly across every building. Using a hijacked login token, an intruder walks up to the laptop-enrollment desk, registers a completely fake phantom laptop into the corporate directory, and collects a genuine long-lived smartcard that lets them mint fresh building passes quietly even from off-site machines.',
      storyMappings: [
        {
          storyTerm: 'Requesting an appointment ticket for the laptop-enrollment desk',
          technicalTerm: 'Acquiring an OAuth token for Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net)',
        },
        {
          storyTerm: 'Registering a completely fake phantom laptop in the directory',
          technicalTerm: 'ROADtools rogue device join logged in Entra Directory Audit Operation="Register device"',
        },
        {
          storyTerm: 'Collecting a genuine long-lived resident smartcard',
          technicalTerm: 'Issuance of a Primary Refresh Token (PRT) and encrypted session key bound to the rogue device',
        },
        {
          storyTerm: 'Minting fresh passes silently across every cloud building',
          technicalTerm: 'Using the stolen PRT cookie to satisfy device-based Conditional Access persistently',
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
          },
          {
            storyTerm: 'Stolen user sign-in credential',
            technicalTerm: 'Compromised corporate user identity or MFA-satisfied refresh token',
          },
          {
            storyTerm: 'Gatehouse diary recording the enrollment token',
            technicalTerm: 'Entra ID Sign-In Logs recording non-Windows or ROADtools DRS token requests',
          },
          {
            storyTerm: 'Gateway to trusted fleet membership',
            technicalTerm: 'Default Entra ID setting allowing standard users to register personal or joined devices',
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
          },
          {
            storyTerm: 'Genuine company device certificate returned',
            technicalTerm: 'X.509 device certificate signed by the tenant Device Registration Service',
          },
          {
            storyTerm: 'Directory audit ledger stamping the new device',
            technicalTerm: 'Entra ID Directory Audit Log Operation="Register device" or "Add device"',
          },
          {
            storyTerm: 'Sneaking past managed-device checks',
            technicalTerm: 'Attacker laptop masquerading as an Entra-joined corporate endpoint',
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
          },
          {
            storyTerm: 'Matching cryptographic session key',
            technicalTerm: 'Derived PRT session key enabling ROADtools to mint fresh x-ms-RefreshTokenCredential cookies',
          },
          {
            storyTerm: 'Persistent access across cloud applications',
            technicalTerm: 'Replaying PRT-derived cookies to access Microsoft 365, Azure, and Graph APIs',
          },
          {
            storyTerm: 'Ejecting the phantom laptop permanently',
            technicalTerm: 'Disabling/deleting the rogue DeviceId in Entra ID and revoking all refresh tokens',
          },
        ],
      },
    },
  },

  'dfir-gcp-cloud-audit-service-account-key-impersonation': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud research campus where an intruder uses a compromised junior badge to borrow the temporary voice of a senior data-warehouse account, uses that borrowed authority to stamp a permanent offline spare key at the badge kiosk, and then steps directly into the analytics warehouse to export entire confidential tables out to an external bucket.',
      storyMappings: [
        {
          storyTerm: 'Borrowing the temporary voice of a senior warehouse account',
          technicalTerm: 'Service Account impersonation via iamcredentials.googleapis.com GenerateAccessToken',
        },
        {
          storyTerm: 'Stamping a permanent offline spare key at the badge kiosk',
          technicalTerm: 'google.iam.admin.v1.CreateServiceAccountKey persisting access as a JSON key',
        },
        {
          storyTerm: 'Exporting entire confidential tables out of the analytics warehouse',
          technicalTerm: 'BigQuery JobInserted export and query exfiltration tracked by totalBilledBytes',
        },
        {
          storyTerm: 'Chained audit receipts proving the escalation path',
          technicalTerm: 'GCP Cloud Audit Logs correlating GenerateAccessToken, CreateServiceAccountKey, and BigQuery jobs',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Discovering that their starting badge holds token-borrowing rights over a higher-privilege warehouse service account, the intruder requests a short-lived impersonation pass from the cloud identity desk to step smoothly into the senior role.',
        storyMappings: [
          {
            storyTerm: 'Token-borrowing rights over a senior account',
            technicalTerm: 'roles/iam.serviceAccountTokenCreator binding on a privileged GCP service account',
          },
          {
            storyTerm: 'Requesting a short-lived impersonation pass',
            technicalTerm: 'API call iamcredentials.googleapis.com GenerateAccessToken logged in Data Access logs',
          },
          {
            storyTerm: 'Stepping smoothly into the senior role',
            technicalTerm: 'Short-lived OAuth2 bearer token inheriting all BigQuery and IAM rights of the target',
          },
          {
            storyTerm: 'Identity desk log recording the delegation',
            technicalTerm: 'GCP Audit Log authorizationInfo and requestMetadata.callerIp attribution',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To avoid losing access when the borrowed one-hour pass expires, the intruder uses their elevated privileges to print a permanent user-managed JSON key file that works indefinitely from any computer on the internet.',
        storyMappings: [
          {
            storyTerm: 'Printing a permanent JSON key file',
            technicalTerm: 'google.iam.admin.v1.CreateServiceAccountKey creating a user-managed private key',
          },
          {
            storyTerm: 'Working indefinitely from outside the cloud',
            technicalTerm: 'Persistent off-GCP credential immune to initial-access session revocation',
          },
          {
            storyTerm: 'Admin activity ledger recording the key birth',
            technicalTerm: 'Immutable GCP Admin Activity Log showing exact key ID and creator principal',
          },
          {
            storyTerm: 'Preventive campus rule blocking permanent keys',
            technicalTerm: 'Organization Policy constraints/iam.disableServiceAccountKeyCreation',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Signing straight into the analytics warehouse with the newly printed key, the intruder submits bulk extraction jobs that sweep entire customer datasets out of the vault while the warehouse metering log records every query and exact gigabyte moved.',
        storyMappings: [
          {
            storyTerm: 'Bulk extraction jobs sweeping customer datasets',
            technicalTerm: 'BigQuery table extract and SELECT * queries logged as JobInserted / JobCompleted',
          },
          {
            storyTerm: 'Warehouse metering log recording exact gigabytes moved',
            technicalTerm: 'BigQuery Data Access audit fields totalBilledBytes and referencedTables',
          },
          {
            storyTerm: 'External destination bucket receiving stolen tables',
            technicalTerm: 'Export job writing CSV/Parquet archives to an attacker-controlled GCS bucket',
          },
          {
            storyTerm: 'Forensic breach quantification',
            technicalTerm: 'Correlating serviceAccountKeyName across BigQuery job logs to list all exposed tables',
          },
        ],
      },
    },
  },

  'cloud-midnight-blizzard-oauth-legacy-test-app-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a high-security government campus where an overlooked backyard testing shed still lacks a two-factor deadbolt. After slowly trying common keys from residential driveways until the shed opens, a spy discovers an old automated courier app inside, attaches their own fresh secret key and full-mailroom badge to that app, and quietly syncs sensitive executive mailboxes straight out through the automated postal chute.',
      storyMappings: [
        {
          storyTerm: 'Slowly trying keys from residential driveways on an unguarded test shed',
          technicalTerm: 'Low-volume residential proxy password spray against a legacy non-MFA tenant account',
        },
        {
          storyTerm: 'Attaching a fresh secret key and full-mailroom badge to an old courier app',
          technicalTerm: 'Service Principal Add service principal credentials and full_access_as_app role grant',
        },
        {
          storyTerm: 'Quietly syncing executive mailboxes through the automated postal chute',
          technicalTerm: 'OAuth Bearer token Exchange Web Services (EWS) mailbox sync logged via MailItemsAccessed',
        },
        {
          storyTerm: 'Emergency directive closing every legacy side door',
          technicalTerm: 'CISA ED 24-02 audit of OAuth Service Principals, credentials, and EWS access',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Spreading tiny bursts of password guesses across thousands of home internet connections so threshold alarms never ring, the intruder unlocks an old non-production testing account left without multi-factor protection.',
        storyMappings: [
          {
            storyTerm: 'Thousands of home internet connections hiding the spray',
            technicalTerm: 'Residential proxy network distributing low-volume Entra ID password sprays',
          },
          {
            storyTerm: 'Old non-production account lacking a second lock',
            technicalTerm: 'Legacy test tenant account without Conditional Access MFA enforcement',
          },
          {
            storyTerm: 'Stepping inside the quiet testing wing',
            technicalTerm: 'Initial authenticated foothold inside the victim cloud test tenant',
          },
          {
            storyTerm: 'Sign-in ledger showing spread-out guesses',
            technicalTerm: 'Entra ID SigninLogs correlating distributed residential ASNs against one legacy user',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Spotting an over-privileged legacy automated courier application inside the tenant, the intruder stamps a brand-new secret password onto the app badge and assigns it the master full-access mailroom key covering corporate mailboxes.',
        storyMappings: [
          {
            storyTerm: 'Over-privileged legacy automated courier app',
            technicalTerm: 'Legacy OAuth Enterprise Application / Service Principal holding elevated Graph rights',
          },
          {
            storyTerm: 'Stamping a brand-new secret password onto the app badge',
            technicalTerm: 'Entra Audit Log "Update application – Certificates and secrets management" key addition',
          },
          {
            storyTerm: 'Assigning the master full-access mailroom key',
            technicalTerm: 'Granting Exchange Online full_access_as_app application role to the Service Principal',
          },
          {
            storyTerm: 'Non-human persistence channel',
            technicalTerm: 'Machine-to-machine OAuth credentials immune to human user password resets',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Presenting the newly minted courier token directly to the Exchange postal gateway, the intruder systematically pulls targeted executive correspondence while leaving clear machine-access footprints inside the Purview mail-access diary.',
        storyMappings: [
          {
            storyTerm: 'Presenting the courier token to the postal gateway',
            technicalTerm: 'OAuth 2.0 Bearer token authenticating directly to Exchange Web Services (EWS)',
          },
          {
            storyTerm: 'Systematically pulling executive correspondence',
            technicalTerm: 'Programmatic EWS SyncFolderItems / GetItem exfiltration of sensitive mailboxes',
          },
          {
            storyTerm: 'Machine-access footprints in the mail diary',
            technicalTerm: 'Purview MailItemsAccessed telemetry naming the exact hijacked AppId',
          },
          {
            storyTerm: 'Restricting which mailboxes an app may ever touch',
            technicalTerm: 'Exchange Application Access Policies scoping OAuth apps strictly to designated mailboxes',
          },
        ],
      },
    },
  },

  'cloud-aws-sts-federation-token-console-signin-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud bank where a thief steals a long-lived machine delivery badge designed only for automated back-door shipping, not for walking through the executive web lobby. Using a special exchange counter, the thief trades that machine badge for a federated visitor pass, exchanges the pass at the lobby ticket booth for a live browser wristband, and strolls straight into the graphical management console to read every security policy on screen.',
      storyMappings: [
        {
          storyTerm: 'Trading a back-door machine badge at the exchange counter',
          technicalTerm: 'Programmatic AKIA access key invoking sts:GetFederationToken',
        },
        {
          storyTerm: 'Exchanging the federated pass for a live browser wristband',
          technicalTerm: 'signin.aws.amazon.com/federation SigninToken exchange triggering ConsoleLogin',
        },
        {
          storyTerm: 'Strolling into the graphical console to read security policies',
          technicalTerm: 'Interactive AWS Management Console reconnaissance and IAM PolicyVersion enumeration',
        },
        {
          storyTerm: 'Audit discrepancy exposing back-door-to-lobby pivot',
          technicalTerm: 'CloudTrail GetFederationToken immediately followed by ConsoleLogin without MFA',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding a leaked static programmer key meant solely for automated scripts, the intruder calls the cloud token-exchange counter asking for a federated session pass that can bridge into interactive web access.',
        storyMappings: [
          {
            storyTerm: 'Leaked static programmer key',
            technicalTerm: 'Compromised long-lived AWS IAM access key (AKIA...) without console password',
          },
          {
            storyTerm: 'Cloud token-exchange counter',
            technicalTerm: 'AWS Security Token Service API call sts:GetFederationToken',
          },
          {
            storyTerm: 'Federated session pass returned',
            technicalTerm: 'Temporary ASIA... federated credentials scoped by inline session policy',
          },
          {
            storyTerm: 'Ledger entry marking the unusual conversion',
            technicalTerm: 'CloudTrail GetFederationToken event initiated by a programmatic IAM user',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Handing that temporary federated pass straight to the web lobby ticket booth, the intruder receives a single-use browser entry link and logs smoothly into the interactive graphical console without ever needing a user password or MFA token.',
        storyMappings: [
          {
            storyTerm: 'Web lobby ticket booth',
            technicalTerm: 'https://signin.aws.amazon.com/federation?Action=getSigninToken endpoint',
          },
          {
            storyTerm: 'Single-use browser entry link',
            technicalTerm: 'Returned SigninToken pasted into Action=login URL launching the AWS Console',
          },
          {
            storyTerm: 'Entering the graphical lobby without password or MFA',
            technicalTerm: 'Bypassing console password requirements and user MFA checks via federation',
          },
          {
            storyTerm: 'Lobby camera recording the browser check-in',
            technicalTerm: 'CloudTrail ConsoleLogin event showing userIdentity.type == "FederatedUser"',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now clicking freely through the visual web dashboards, the intruder inspects account blueprints and digs through older saved editions of company security policies hunting for over-privileged rules or hidden secrets.',
        storyMappings: [
          {
            storyTerm: 'Clicking freely through visual web dashboards',
            technicalTerm: 'Interactive AWS Management Console reconnaissance across IAM, S3, and Secrets Manager',
          },
          {
            storyTerm: 'Digging through older editions of security policies',
            technicalTerm: 'Calling iam:ListPolicyVersions and iam:GetPolicyVersion hunting privilege escalation paths',
          },
          {
            storyTerm: 'Tracing every click back to the leaked machine key',
            technicalTerm: 'Correlating CloudTrail FederatedUser ARN back to the originating AKIA AccessKeyId',
          },
          {
            storyTerm: 'Shutting down both key and active browser session',
            technicalTerm: 'Deactivating the compromised AKIA key and attaching an explicit Deny revocation policy',
          },
        ],
      },
    },
  },

  'cloud-entra-id-conditional-access-device-code-phishing-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office park that offers a handy short pairing code so smart TVs and printers without keyboards can sign in easily. A con artist walks up to the pairing booth, grabs a fresh nine-character code, mails it to an employee claiming it unlocks an urgent meeting invite, and waits while the employee types the code on the official corporate login page; the instant the employee clicks approve, the con artist receives a master family-of-apps pass that unlocks email, file lockers, and team chat.',
      storyMappings: [
        {
          storyTerm: 'Grabbing a nine-character smart-TV pairing code for an employee to type',
          technicalTerm: 'OAuth 2.0 /devicecode request and victim redemption on microsoft.com/devicelogin',
        },
        {
          storyTerm: 'Master family-of-apps pass unlocking multiple doors at once',
          technicalTerm: 'Family of Client IDs (FOCI) refresh token exchange across Microsoft Graph scopes',
        },
        {
          storyTerm: 'Reading mail, file lockers, and team chat silently',
          technicalTerm: 'Microsoft Graph API enumeration of Mail, OneDrive, and Teams messages',
        },
        {
          storyTerm: 'Closing the keyless pairing loophole',
          technicalTerm: 'Entra ID Conditional Access policy blocking authenticationTransfer / deviceCodeFlow',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Requesting a legitimate nine-character device-pairing code from the cloud lobby, the phisher sends it to a targeted employee inside a realistic invitation lure so the employee unwittingly signs in with their real password and MFA on the genuine company login page.',
        storyMappings: [
          {
            storyTerm: 'Requesting a legitimate device-pairing code',
            technicalTerm: 'Attacker POST to /oauth2/v2.0/devicecode obtaining user_code and device_code',
          },
          {
            storyTerm: 'Genuine company login page fooled by the lure',
            technicalTerm: 'Victim authenticating with full MFA at https://microsoft.com/devicelogin',
          },
          {
            storyTerm: 'Attacker silently polling until the green light flashes',
            technicalTerm: 'Polling /oauth2/v2.0/token until Entra ID delivers the victim access and refresh tokens',
          },
          {
            storyTerm: 'Sign-in log showing the distinct pairing protocol',
            technicalTerm: 'Entra ID SigninLogs flagging authenticationProtocol == "deviceCode"',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because Microsoft trusted family of workplace applications shares a single interchangeable master refresh voucher, the intruder immediately swaps the freshly captured token for brand-new passes spanning multiple high-value office wings without ever prompting the employee again.',
        storyMappings: [
          {
            storyTerm: 'Interchangeable master refresh voucher across apps',
            technicalTerm: 'Family of Client IDs (FOCI) refresh token exchanged across sibling first-party client IDs',
          },
          {
            storyTerm: 'Swapping for fresh passes spanning multiple wings',
            technicalTerm: 'Minting new access tokens for Microsoft Graph, Teams, SharePoint, and Azure CLI',
          },
          {
            storyTerm: 'Zero second prompt shown to the employee',
            technicalTerm: 'Silent token refresh operating seamlessly from attacker infrastructure',
          },
          {
            storyTerm: 'Cross-app token trail in audit logs',
            technicalTerm: 'Multiple Entra Sign-In events sharing the same SessionId across different AppIds',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Armed with broad Graph reading passes, the intruder programmatically searches the victim inbox, downloads sensitive shared documents from cloud lockers, and scans internal chat channels for passwords and wire-transfer threads.',
        storyMappings: [
          {
            storyTerm: 'Programmatically searching inbox, lockers, and chat channels',
            technicalTerm: 'Automated Microsoft Graph API calls to /me/messages, /me/drive, and /me/chats',
          },
          {
            storyTerm: 'Hunting passwords and wire-transfer threads',
            technicalTerm: 'Keyword search queries targeting credentials, VPN guides, and financial approvals',
          },
          {
            storyTerm: 'Unified audit trail exposing accessed items',
            technicalTerm: 'Purview MailItemsAccessed and SharePoint FileDownloaded events tied to the rogue session',
          },
          {
            storyTerm: 'Blocking device-code abuse proactively',
            technicalTerm: 'Conditional Access authentication flow policy blocking Device Code Flow',
          },
        ],
      },
    },
  },

  'cloud-aws-s3-kms-external-account-encryption-extortion-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud-native ransomware crew that never drops a single piece of malware on any computer. Instead, using stolen cloud warehouse keys, they bring their own external padlock from an outside account, use the warehouse own built-in copier to re-seal every customer box in place under their external padlock, and set the warehouse automatic trash chute to one day so all previous unlocked editions are swept away before the ransom note arrives.',
      storyMappings: [
        {
          storyTerm: 'Bringing an external padlock from an outside account',
          technicalTerm: 'Cross-account AWS KMS key policy granting victim IAM role kms:GenerateDataKey',
        },
        {
          storyTerm: 'Using the warehouse built-in copier to re-seal every box in place',
          technicalTerm: 'In-place s3:CopyObject with SSE-KMS pointing to the attacker external KMS Key ARN',
        },
        {
          storyTerm: 'Setting the warehouse automatic trash chute to one day',
          technicalTerm: 'PutBucketLifecycleConfiguration setting 1-day NoncurrentVersionExpiration',
        },
        {
          storyTerm: 'Zero malware required on any server',
          technicalTerm: 'Pure cloud control-plane S3 ransomware extortion via native AWS APIs',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inside their own separate cloud account, the extortionist forges a brand-new encryption padlock and authorizes the victim cloud badge to lock boxes with it, while quietly mapping every valuable storage bucket inside the victim estate.',
        storyMappings: [
          {
            storyTerm: 'Forging an encryption padlock inside an outside account',
            technicalTerm: 'Attacker-owned AWS KMS Customer Managed Key (CMK) in an external AWS account',
          },
          {
            storyTerm: 'Authorizing the victim badge to lock boxes with it',
            technicalTerm: 'Cross-account KMS Key Policy allowing victim role kms:Encrypt and GenerateDataKey',
          },
          {
            storyTerm: 'Mapping every valuable storage bucket',
            technicalTerm: 'CloudTrail s3:ListBuckets and s3:ListObjectsV2 inventory enumeration',
          },
          {
            storyTerm: 'Locking without downloading a single byte',
            technicalTerm: 'Server-side encryption design avoiding slow external download-and-reupload bottlenecks',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Issuing rapid in-place copy orders straight through the cloud storage service itself, the extortionist forces the warehouse to overwrite every file with a fresh copy sealed strictly under the attacker external padlock, instantly locking the rightful owner out once the attacker revokes access to their external key.',
        storyMappings: [
          {
            storyTerm: 'Rapid in-place copy orders straight through the warehouse',
            technicalTerm: 's3:CopyObject targeting source == destination with x-amz-server-side-encryption: aws:kms',
          },
          {
            storyTerm: 'Sealing every file under the attacker external padlock',
            technicalTerm: 'x-amz-server-side-encryption-aws-kms-key-id referencing an external AWS Account ID',
          },
          {
            storyTerm: 'Locking the rightful owner out in one flip',
            technicalTerm: 'Attacker deleting or revoking their external KMS key policy until ransom is paid',
          },
          {
            storyTerm: 'High-signal external-key alarm',
            technicalTerm: 'CloudTrail S3 Data Event flagging CopyObject specifying an untrusted external KMS Key ARN',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the warehouse keeps older unlocked versions of every box on a safety shelf, the extortionist silently adjusts the warehouse automated housekeeping rule to incinerate all non-current versions after a single day unless Object Lock bolts the shelf shut.',
        storyMappings: [
          {
            storyTerm: 'Safety shelf holding older unlocked versions',
            technicalTerm: 'S3 Bucket Versioning preserving pre-encryption noncurrent object versions',
          },
          {
            storyTerm: 'Adjusting automated housekeeping to burn old versions in one day',
            technicalTerm: 's3:PutBucketLifecycleConfiguration setting NoncurrentVersionExpiration to 1 day',
          },
          {
            storyTerm: 'Unbreakable safety bolt preventing early destruction',
            technicalTerm: 'S3 Object Lock in Compliance Mode protecting versions from lifecycle deletion',
          },
          {
            storyTerm: 'Emergency containment before midnight sweep',
            technicalTerm: 'Alerting immediately on PutBucketLifecycleConfiguration to remove malicious rules within 24h',
          },
        ],
      },
    },
  },

  'cloud-azure-vm-custom-script-extension-managed-identity-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office tower where building managers can slide a remote work-order envelope through the central dispatch wall straight into any locked virtual room without knowing the room own password. Using hijacked cloud manager rights, an intruder slips a custom script envelope through the wall, makes the room built-in guest butler execute it with full master keys, and reaches into the room internal badge box to lift the room cloud identity pass and widen their reach across the estate.',
      storyMappings: [
        {
          storyTerm: 'Sliding a remote work-order envelope through the central dispatch wall',
          technicalTerm: 'Azure ARM Microsoft.Compute/virtualMachines/extensions/write CustomScriptExtension',
        },
        {
          storyTerm: 'Room built-in guest butler executing the order with master keys',
          technicalTerm: 'WaAppAgent.exe or walinuxagent spawning child commands as SYSTEM or root',
        },
        {
          storyTerm: 'Reaching into the internal badge box for the cloud identity pass',
          technicalTerm: 'Querying local Azure IMDS (169.254.169.254) for Managed Identity OAuth tokens',
        },
        {
          storyTerm: 'Widening reach from one server back into the cloud control plane',
          technicalTerm: 'Using stolen Managed Identity tokens to access Azure Key Vault and Storage',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Without needing any SSH key or Windows password for the target server, the intruder uses compromised Azure management permissions to push a Custom Script Extension order straight down from the cloud control plane.',
        storyMappings: [
          {
            storyTerm: 'Pushing a script order from the cloud control plane',
            technicalTerm: 'ARM API call Microsoft.Compute/virtualMachines/extensions/write (CustomScriptExtension)',
          },
          {
            storyTerm: 'Skipping SSH keys and Windows passwords entirely',
            technicalTerm: 'Control-plane-to-data-plane bridge executing code inside the VM OS directly',
          },
          {
            storyTerm: 'Cloud management diary recording the push',
            technicalTerm: 'Azure Activity Log capturing exact caller identity, extension name, and target VM',
          },
          {
            storyTerm: 'Over-privileged cloud contributor role',
            technicalTerm: 'Compromised Virtual Machine Contributor or Owner RBAC assignment',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the virtual server, the always-running official Azure guest butler dutifully opens the incoming work order and launches the attacker script under supreme operating-system authority, leaving an unmistakable parent-child tree on disk.',
        storyMappings: [
          {
            storyTerm: 'Official Azure guest butler inside the server',
            technicalTerm: 'WaAppAgent.exe (Windows) or walinuxagent (Linux) receiving extension payloads',
          },
          {
            storyTerm: 'Launching the script under supreme OS authority',
            technicalTerm: 'Guest agent spawning powershell.exe or /bin/sh as NT AUTHORITY\\SYSTEM or root',
          },
          {
            storyTerm: 'Unmistakable parent-child tree on the host',
            technicalTerm: 'EDR / Sysmon EventID 1 flagging WaAppAgent.exe spawning encoded PowerShell or curl',
          },
          {
            storyTerm: 'Bridging cloud rights into live OS memory',
            technicalTerm: 'Host-level execution enabling credential dumping and local metadata queries',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Standing inside the server with supreme local rights, the script taps the room local identity window (supplying the required Metadata header) to withdraw the server own Managed Identity cloud pass and immediately unlocks connected Key Vaults and storage accounts.',
        storyMappings: [
          {
            storyTerm: 'Tapping the room local identity window',
            technicalTerm: 'HTTP GET http://169.254.169.254/metadata/identity/oauth2/token with Metadata: true header',
          },
          {
            storyTerm: 'Withdrawing the server Managed Identity pass',
            technicalTerm: 'Short-lived Azure AD OAuth JWT issued for the VM System-Assigned or User-Assigned Identity',
          },
          {
            storyTerm: 'Unlocking connected vaults and storage accounts',
            technicalTerm: 'Using the stolen Managed Identity token against Azure Key Vault and Storage APIs',
          },
          {
            storyTerm: 'Detecting off-box token replay',
            technicalTerm: 'Microsoft Defender for Cloud alerting on Managed Identity tokens used from external IPs',
          },
        ],
      },
    },
  },

  'cloud-github-actions-pull-request-target-oidc-token-audit': {
    briefing: {
      storyAnalogy:
        'Imagine an automated software workshop whose intake conveyor accidentally invites untrusted blueprints submitted by outside strangers directly into the privileged assembly vault. The instant the vault runs the stranger build script, the script lifts a temporary cloud identity voucher straight from the workshop workbench and trades it at the cloud front gate for live production AWS credentials.',
      storyMappings: [
        {
          storyTerm: 'Inviting untrusted outside blueprints straight into the privileged vault',
          technicalTerm: 'GitHub Actions pull_request_target workflow checking out untrusted fork PR HEAD',
        },
        {
          storyTerm: 'Lifting a temporary cloud identity voucher from the workbench',
          technicalTerm: 'Querying ACTIONS_ID_TOKEN_REQUEST_URL to mint a signed GitHub OIDC JWT',
        },
        {
          storyTerm: 'Trading the voucher at the cloud gate for production credentials',
          technicalTerm: 'Calling AWS sts:AssumeRoleWithWebIdentity using the forged PR-context OIDC JWT',
        },
        {
          storyTerm: 'Checking the fine print stamped on the cloud gate receipt',
          technicalTerm: 'Auditing AWS CloudTrail OIDC sub claim and tightening IAM trust conditions',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An external contributor opens a seemingly helpful change proposal from a public fork. Because the repository workflow triggers with full privileged vault access and explicitly checks out the untrusted stranger branch code, the workshop executes attacker code inside its trusted build zone.',
        storyMappings: [
          {
            storyTerm: 'Workflow triggering with full privileged vault access',
            technicalTerm: 'GitHub Actions pull_request_target trigger inheriting base repository secrets and OIDC rights',
          },
          {
            storyTerm: 'Explicitly checking out the untrusted stranger branch',
            technicalTerm: 'actions/checkout configured with ref: ${{ github.event.pull_request.head.sha }}',
          },
          {
            storyTerm: 'Executing attacker build commands inside the trusted zone',
            technicalTerm: 'Arbitrary code execution via modified Makefile, package.json, or test scripts in the PR',
          },
          {
            storyTerm: 'Classic CI/CD PwnRequest pattern',
            technicalTerm: 'Mixing untrusted fork code execution with privileged base-repo permissions',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Running inside the privileged build workbench, the stranger script reads two secret workbench notes (one holding the voucher-booth URL and one holding the booth entry pass) and requests a freshly signed OpenID identity card proving it belongs to the trusted repository.',
        storyMappings: [
          {
            storyTerm: 'Workbench note holding the voucher-booth URL',
            technicalTerm: 'Runner environment variable ACTIONS_ID_TOKEN_REQUEST_URL',
          },
          {
            storyTerm: 'Workbench note holding the booth entry pass',
            technicalTerm: 'Runner environment variable ACTIONS_ID_TOKEN_REQUEST_TOKEN',
          },
          {
            storyTerm: 'Freshly signed OpenID identity card',
            technicalTerm: 'Signed GitHub OIDC JWT issued with audience sts.amazonaws.com and id-token: write',
          },
          {
            storyTerm: 'Zero static long-lived secrets needed',
            technicalTerm: 'Abusing modern keyless OIDC federation through overly broad trust policies',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Carrying that freshly signed OIDC identity card straight to the cloud front gate, the script swaps it for temporary AWS administrative credentials because the cloud trust policy checked only the repository name and forgot to insist on the protected main branch.',
        storyMappings: [
          {
            storyTerm: 'Swapping the OIDC card at the cloud front gate',
            technicalTerm: 'AWS STS AssumeRoleWithWebIdentity returning temporary production IAM credentials',
          },
          {
            storyTerm: 'Trust policy checking only the repository name',
            technicalTerm: 'Over-broad IAM StringLike condition repo:org/app:* allowing pull_request subjects',
          },
          {
            storyTerm: 'Fine print on the cloud gate receipt',
            technicalTerm: 'CloudTrail requestParameters and OIDC sub claim showing pull_request instead of refs/heads/main',
          },
          {
            storyTerm: 'Locking the trust gate strictly to main releases',
            technicalTerm: 'Restricting IAM trust policies strictly to repo:org/app:ref:refs/heads/main or environments',
          },
        ],
      },
    },
  },

  'cloud-salesforce-connected-app-oauth-bulk-api-export-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a giant corporate customer-records library where an employee gets tricked into authorizing an unverified third-party research cart with broad library borrowing powers. Handed a reusable library pass, the intruder orders the library own automated overnight forklift to pack entire customer shelves into downloadable spreadsheet crates and wheels them straight out of the building until librarians revoke the rogue cart pass.',
      storyMappings: [
        {
          storyTerm: 'Tricking an employee into authorizing an unverified research cart',
          technicalTerm: 'Unverified Salesforce OAuth Connected App consent minting a persistent Refresh Token',
        },
        {
          storyTerm: 'Ordering the library automated forklift to pack entire shelves',
          technicalTerm: 'Asynchronous Bulk API 2.0 Query Job via /services/data/v59.0/jobs/query',
        },
        {
          storyTerm: 'Wheeling downloadable spreadsheet crates out of the building',
          technicalTerm: 'Bulk CSV result batch export via /jobs/query/<id>/results',
        },
        {
          storyTerm: 'Canceling the rogue cart pass across the library',
          technicalTerm: 'Salesforce Event Monitoring BulkApiResult audit and OauthToken revocation',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Lured by a smooth social-engineering call or phishing link, an employee clicks Approve on a disguised external Connected App, silently handing the attacker a renewable OAuth key ring scoped to read and export company CRM records.',
        storyMappings: [
          {
            storyTerm: 'Disguised external Connected App approved by a user',
            technicalTerm: 'Unverified third-party Salesforce OAuth Connected App (e.g., modified Data Loader)',
          },
          {
            storyTerm: 'Renewable key ring handed to the attacker',
            technicalTerm: 'Issued OAuth Access Token and long-lived Refresh Token (refresh_token / api scopes)',
          },
          {
            storyTerm: 'Bypasses ongoing interactive login prompts',
            technicalTerm: 'Persistent API access operating independently of user browser sessions',
          },
          {
            storyTerm: 'Library approval policy stopping rogue apps',
            technicalTerm: 'Salesforce Connected App API Access Control restricting unapproved OAuth clients',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Instead of copying customer index cards slowly one by one where noisy page counters might trigger, the intruder submits a high-speed asynchronous bulk export order asking the CRM engine itself to gather every Account, Contact, and Opportunity record into clean batches.',
        storyMappings: [
          {
            storyTerm: 'High-speed asynchronous bulk export order',
            technicalTerm: 'HTTP POST to /services/data/v59.0/jobs/query creating a Bulk API 2.0 Query Job',
          },
          {
            storyTerm: 'Gathering every customer record automatically',
            technicalTerm: 'SOQL queries dumping Account, Contact, Case, and Lead CRM tables wholesale',
          },
          {
            storyTerm: 'Server doing all the heavy packing',
            technicalTerm: 'Asynchronous background job staging millions of rows for rapid retrieval',
          },
          {
            storyTerm: 'Library bulk-job log recording the order',
            technicalTerm: 'Salesforce Event Monitoring API and BulkApi2 job creation audit records',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As soon as the bulk forklift signals the crates are ready, the intruder pulls down every finished CSV batch straight to external servers, leaving high-volume result-download receipts that guide responders to revoke the rogue Connected App token immediately.',
        storyMappings: [
          {
            storyTerm: 'Pulling down every finished spreadsheet batch',
            technicalTerm: 'GET /services/data/v59.0/jobs/query/<id>/results downloading bulk CSV chunks',
          },
          {
            storyTerm: 'High-volume result-download receipts',
            technicalTerm: 'Salesforce Event Monitoring BulkApiResult logs capturing row counts and source IP',
          },
          {
            storyTerm: 'Revoking the rogue cart pass immediately',
            technicalTerm: 'Invalidating the compromised OauthToken and blocking the Connected App org-wide',
          },
          {
            storyTerm: 'Preventing unauthorized data exports',
            technicalTerm: 'Transaction Security Policies alerting or blocking anomalous Bulk API exports',
          },
        ],
      },
    },
  },

  'cloud-aws-eks-aws-auth-configmap-system-masters-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud-managed Kubernetes complex whose front reception desk translates AWS corporate badges into inner building keys using one hand-edited paper seating chart taped behind the desk. Using a pre-signed AWS badge to sign in, an intruder edits that single paper seating chart to write their own ordinary cloud role straight into the Supreme Master Guild line, instantly unlocking every secret vault in the entire cluster.',
      storyMappings: [
        {
          storyTerm: 'Pre-signed corporate badge unlocking the cluster reception desk',
          technicalTerm: 'EKS STS presigned GetCallerIdentity bearer token (k8s-aws-v1.<base64>)',
        },
        {
          storyTerm: 'Hand-edited paper seating chart translating cloud badges to cluster keys',
          technicalTerm: 'kube-system/aws-auth ConfigMap mapUsers and mapRoles YAML entries',
        },
        {
          storyTerm: 'Writing an ordinary role straight into the Supreme Master Guild line',
          technicalTerm: 'Patching aws-auth to bind an attacker IAM principal to the system:masters group',
        },
        {
          storyTerm: 'Unlocking every secret vault until modernized locks replace the paper chart',
          technicalTerm: 'Cluster-admin Secret enumeration remediated by migrating to EKS Access Entries',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Generating a short-lived pre-signed AWS identity voucher wrapped inside a special cluster prefix, the intruder presents it to the Kubernetes front gate to authenticate smoothly with an existing cloud IAM badge.',
        storyMappings: [
          {
            storyTerm: 'Short-lived pre-signed AWS identity voucher',
            technicalTerm: 'aws eks get-token generating k8s-aws-v1.<base64> presigned STS GetCallerIdentity URL',
          },
          {
            storyTerm: 'Kubernetes front gate validating the voucher',
            technicalTerm: 'EKS aws-iam-authenticator verifying the STS signature and mapping the IAM ARN',
          },
          {
            storyTerm: 'Existing cloud IAM badge with ConfigMap editing rights',
            technicalTerm: 'Compromised IAM principal authorized to modify kube-system ConfigMaps',
          },
          {
            storyTerm: 'Dual audit trail bridging AWS and Kubernetes',
            technicalTerm: 'Correlating AWS IAM ARN with Kubernetes kube-apiserver audit user identity',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Opening the delicate translation chart taped inside the system room, the intruder appends a second backdoor cloud user directly underneath the unrestrictable Supreme Master Guild, granting permanent cluster-wide sovereignty that survives even RBAC cleanups.',
        storyMappings: [
          {
            storyTerm: 'Delicate translation chart inside the system room',
            technicalTerm: 'Legacy kube-system/aws-auth ConfigMap controlling IAM-to-RBAC mapping',
          },
          {
            storyTerm: 'Unrestrictable Supreme Master Guild',
            technicalTerm: 'Hardcoded Kubernetes superuser group system:masters bypassing all RBAC checks',
          },
          {
            storyTerm: 'Appending a backdoor cloud user to the chart',
            technicalTerm: 'kubectl patch cm aws-auth adding an attacker ARN to mapUsers or mapRoles',
          },
          {
            storyTerm: 'Audit log capturing the chart mutation',
            technicalTerm: 'EKS Control Plane Audit Log showing patch/update on kube-system/aws-auth',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now holding Supreme Master Guild status across the entire cluster, the intruder reads every application secret in every namespace until security engineers migrate the cluster off the fragile paper chart onto managed, auditable cloud access entries.',
        storyMappings: [
          {
            storyTerm: 'Reading every application secret in every namespace',
            technicalTerm: 'Cluster-admin kubectl get secrets --all-namespaces credential dump',
          },
          {
            storyTerm: 'Retiring the fragile paper seating chart',
            technicalTerm: 'Migrating EKS authentication mode from CONFIG_MAP to API (EKS Access Entries)',
          },
          {
            storyTerm: 'Centralized cloud-logged access grants',
            technicalTerm: 'EKS Access Entries recorded directly in AWS CloudTrail rather than editable ConfigMaps',
          },
          {
            storyTerm: 'Removing unauthorized superuser entries',
            technicalTerm: 'Scrubbing rogue ARNs from aws-auth and rotating all cluster Secrets',
          },
        ],
      },
    },
  },

  'cloud-gcp-cloud-build-default-service-account-artifact-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a cloud software factory whose automated build bay runs every submitted assembly job wearing a generously powered default factory badge that holds keys to both the artifact vault and the source storage warehouse. Submitting an ad-hoc build order containing one sneaky command, an intruder walks into the worker booth, reads the default factory badge straight off the wall metadata box, and uses it to raid both finished packages and private source archives.',
      storyMappings: [
        {
          storyTerm: 'Submitting an ad-hoc build order containing a sneaky command',
          technicalTerm: 'google.devtools.cloudbuild.v1.CloudBuild.CreateBuild ad-hoc job submission',
        },
        {
          storyTerm: 'Reading the default factory badge straight off the wall box',
          technicalTerm: 'Worker container querying metadata server for @cloudbuild.gserviceaccount.com OAuth token',
        },
        {
          storyTerm: 'Raiding finished packages and private source archives',
          technicalTerm: 'Unauthorized access to GCP Artifact Registry and Cloud Storage source buckets',
        },
        {
          storyTerm: 'Replacing the shared master badge with narrow per-job badges',
          technicalTerm: 'Enforcing user-specified least-privilege Cloud Build service accounts',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using compromised developer permissions that allow triggering builds, the intruder submits a quick custom assembly job straight to the cloud build queue carrying an inline shell step designed purely to harvest credentials.',
        storyMappings: [
          {
            storyTerm: 'Quick custom assembly job submitted directly',
            technicalTerm: 'gcloud builds submit invoking google.devtools.cloudbuild.v1.CloudBuild.CreateBuild',
          },
          {
            storyTerm: 'Inline shell step designed to harvest credentials',
            technicalTerm: 'Custom cloudbuild.yaml step executing curl against the local metadata endpoint',
          },
          {
            storyTerm: 'No source repository change required',
            technicalTerm: 'Ad-hoc build submission bypassing Git pull-request review and branch protections',
          },
          {
            storyTerm: 'Cloud audit ledger logging the ad-hoc job',
            technicalTerm: 'GCP Admin Activity Audit Log capturing CreateBuild parameters and caller',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The moment the automated build bay spins up the attacker worker container, the container taps the booth local metadata wall panel and lifts the live OAuth badge belonging to the overly privileged default Cloud Build service account.',
        storyMappings: [
          {
            storyTerm: 'Booth local metadata wall panel',
            technicalTerm: 'GCP instance metadata endpoint metadata.google.internal (Metadata-Flavor: Google)',
          },
          {
            storyTerm: 'Overly privileged default factory badge',
            technicalTerm: '<project-number>@cloudbuild.gserviceaccount.com OAuth2 access token',
          },
          {
            storyTerm: 'Sneaking the stolen badge out of the build bay',
            technicalTerm: 'Exfiltrating the live Bearer token via outbound HTTP or build logs',
          },
          {
            storyTerm: 'Privilege escalation from build submitter to builder',
            technicalTerm: 'Escalating from Cloud Build Editor to broad project deployment permissions',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Wielding the stolen default builder badge, the intruder opens both the finished-software Artifact Registry and the private Cloud Storage source archives to steal proprietary builds or plant tampered release images.',
        storyMappings: [
          {
            storyTerm: 'Finished-software Artifact Registry opened',
            technicalTerm: 'Pulling or pushing poisoned container images in GCP Artifact Registry',
          },
          {
            storyTerm: 'Private source archives accessed',
            technicalTerm: 'Reading Cloud Storage source staging buckets (_cloudbuild) via storage.objects.get',
          },
          {
            storyTerm: 'Data access trail attributing the raid',
            technicalTerm: 'GCP Audit Logs showing @cloudbuild.gserviceaccount.com used from external IPs',
          },
          {
            storyTerm: 'Hardening the factory against badge theft',
            technicalTerm: 'Disabling default Cloud Build SA and assigning custom least-privilege build SAs',
          },
        ],
      },
    },
  },

  'cloud-m365-sharepoint-ediscovery-compliance-search-export-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a corporate courthouse that houses an official legal-discovery archive machine built to search every single employee email drawer, file cabinet, and chat room across the entire company at once. After secretly adding their own hijacked badge onto the Legal Discovery Manager roster, an intruder runs a company-wide keyword search for passwords and mergers, then packs every matching document across thousands of employees into neat downloadable shipping trunks without ever touching a single employee desk.',
      storyMappings: [
        {
          storyTerm: 'Adding a hijacked badge onto the Legal Discovery Manager roster',
          technicalTerm: 'Adding RoleGroupMember to eDiscovery Manager in Microsoft Purview Compliance Center',
        },
        {
          storyTerm: 'Running a company-wide search for passwords and merger files',
          technicalTerm: 'Executing tenant-wide New-ComplianceSearch and Start-ComplianceSearch queries',
        },
        {
          storyTerm: 'Packing every matching document into downloadable shipping trunks',
          technicalTerm: 'Running New-ComplianceSearchAction -Export to download PST and Zip packages',
        },
        {
          storyTerm: 'Courthouse compliance ledger catching the silent mass export',
          technicalTerm: 'Purview Unified Audit Log SearchExportDownloaded and Add-RoleGroupMember alerts',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding compromised high-level tenant rights, the intruder quietly adds a controlled account onto the prestigious Legal eDiscovery Manager committee, unlocking company-wide search powers that bypass ordinary individual mailbox permissions.',
        storyMappings: [
          {
            storyTerm: 'Prestigious Legal eDiscovery Manager committee',
            technicalTerm: 'Microsoft Purview eDiscovery Manager / eDiscovery Administrator role group',
          },
          {
            storyTerm: 'Quietly adding a controlled account to the roster',
            technicalTerm: 'Add-RoleGroupMember logged in Purview Unified Audit Log',
          },
          {
            storyTerm: 'Bypassing individual employee mailbox permissions',
            technicalTerm: 'Cross-tenant read access spanning Exchange Online, SharePoint, OneDrive, and Teams',
          },
          {
            storyTerm: 'First high-priority warning flare',
            technicalTerm: 'SIEM alert on any unexpected membership change to Compliance Role Groups',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Stepping up to the central legal-discovery console, the intruder launches a sweeping tenant-wide keyword search hunting for passwords, M&A contracts, legal filings, and executive spreadsheets across every employee simultaneously.',
        storyMappings: [
          {
            storyTerm: 'Central legal-discovery search console',
            technicalTerm: 'Microsoft Purview Content Search / Compliance PowerShell cmdlets',
          },
          {
            storyTerm: 'Sweeping tenant-wide keyword search',
            technicalTerm: 'New-ComplianceSearch -ExchangeLocation All -SharePointLocation All + Start-ComplianceSearch',
          },
          {
            storyTerm: 'Zero disturbance on individual employee desks',
            technicalTerm: 'Silent backend indexing search invisible to targeted mailbox or SharePoint owners',
          },
          {
            storyTerm: 'Compliance diary logging the exact search terms',
            technicalTerm: 'UAL SearchCreated and SearchStarted events preserving the attacker keyword query',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Once the search finishes indexing thousands of sensitive hits, the intruder triggers an official export job that bundles every matching email and SharePoint file into ready-to-download PST and Zip shipping trunks and pulls them straight off the platform.',
        storyMappings: [
          {
            storyTerm: 'Triggering an official export job',
            technicalTerm: 'New-ComplianceSearchAction -SearchName <name> -Export generating PST/Zip bundles',
          },
          {
            storyTerm: 'Pulling shipping trunks straight off the platform',
            technicalTerm: 'Downloading the generated export package triggering SearchExportDownloaded audit logs',
          },
          {
            storyTerm: 'Massive single-click enterprise data breach',
            technicalTerm: 'Bulk multi-mailbox and SharePoint exfiltration masquerading as routine legal hold',
          },
          {
            storyTerm: 'Dual-approval legal safeguard',
            technicalTerm: 'Requiring Privileged Identity Management (PIM) JIT approval for eDiscovery Manager activation',
          },
        ],
      },
    },
  },
};
