import type { CategoryStandardPatchMap } from './types';

/**
 * Category 6: ZERO_DAY_APPLIANCES (9 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 9 appliance & zero-day scenarios.
 */
export const ZERO_DAY_APPLIANCES_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'check-point-vpn-cve-2024-24919-info-leak': {
    briefing: {
      storyAnalogy:
        'Imagine a fortified castle gatehouse with a public certificate window where travelers can ask to see revoked pass lists. Instead of naming a public notice, a spy slides a stair-stepping folder slip under the glass that tells the clerk to walk backward out of the public booth and into the castle private archives. The clerk obediently hands over the local guard password book and the courier badge for the royal palace, allowing the spy to walk right through the main drawbridge and empty the kingdom directory vault.',
      storyMappings: [
        {
          storyTerm: 'Public certificate window',
          technicalTerm: 'Check Point /clients/MyCRL HTTPS endpoint on vpnd',
        },
        {
          storyTerm: 'Stair-stepping folder slip',
          technicalTerm: 'Directory traversal payload (aCSHELL/../../../../../../../etc/shadow)',
        },
        {
          storyTerm: 'Local guard password book and courier badge',
          technicalTerm: '/etc/shadow hashes, SSH keys, and AD LDAP service credentials',
        },
        {
          storyTerm: 'Kingdom directory vault',
          technicalTerm: 'Active Directory ntds.dit database on the Domain Controller',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the castle gatehouse certificate window, the spy hands the clerk a forged request slip packed with backward step markers instead of a valid public list name. Because the clerk follows the backward steps blindly without checking whether they stay inside the public shelf, the spy peeks straight into restricted archive rooms.',
        storyMappings: [
          {
            storyTerm: 'Gatehouse certificate window',
            technicalTerm: 'Unauthenticated POST /clients/MyCRL handler in vpnd',
          },
          {
            storyTerm: 'Backward step markers',
            technicalTerm: 'Relative path traversal sequences (../) bypassing web root confinement',
          },
          {
            storyTerm: 'Public shelf boundary',
            technicalTerm: 'Check Point CRL directory scope on the Security Gateway',
          },
          {
            storyTerm: 'Restricted archive rooms',
            technicalTerm: 'Underlying Gaia Linux root filesystem files (/etc/shadow)',
          },
        ],
        detectionAndEvidence:
          'Inspect Check Point web and VPN gateway logs alongside IPS signatures alerting on HTTP POST requests to /clients/MyCRL or /clients/MyCRL/ containing .. directory traversal sequences (identifying unauthenticated CVE-2024-24919 arbitrary file-read probing before credentials are harvested).',
      },
      2: {
        storyAnalogy:
          'Using the open archive chute, the spy pulls out two distinct stolen secrets: first, the local gatehouse password book to unlock spare traveler accounts, and second, the palace courier badge that the gatehouse uses to ask the royal palace who is allowed inside.',
        storyMappings: [
          {
            storyTerm: 'Open archive chute',
            technicalTerm: 'Repeatable CVE-2024-24919 arbitrary file-read primitive',
          },
          {
            storyTerm: 'Local gatehouse password book',
            technicalTerm: '/etc/shadow password hashes for local password-only VPN accounts',
          },
          {
            storyTerm: 'Palace courier badge',
            technicalTerm: 'Active Directory LDAP bind service account credentials on the gateway',
          },
          {
            storyTerm: 'Spare traveler accounts',
            technicalTerm: 'Legacy password-only Remote Access VPN accounts lacking MFA',
          },
        ],
        detectionAndEvidence:
          'Audit Check Point gateway logs for sequential /clients/MyCRL POST requests followed shortly by Remote Access VPN login attempts from commercial VPS or Tor exit IPs using legacy local firewall accounts (correlating the file-read phase directly with cracked credential reuse).',
      },
      3: {
        storyAnalogy:
          'Wearing a cracked traveler pass, the spy strolls straight across the front drawbridge into the inner courtyard, then flashes the stolen palace courier badge at the royal registry to copy the entire kingdom master ledger of every citizen secret.',
        storyMappings: [
          {
            storyTerm: 'Front drawbridge',
            technicalTerm: 'Remote Access VPN tunnel into the internal corporate network',
          },
          {
            storyTerm: 'Stolen palace courier badge',
            technicalTerm: 'Firewall LDAP service account (svc_*) authenticating to the Domain Controller',
          },
          {
            storyTerm: 'Royal registry',
            technicalTerm: 'Internal Windows Active Directory Domain Controller',
          },
          {
            storyTerm: 'Kingdom master ledger',
            technicalTerm: 'Extracted ntds.dit database dumped via ntdsutil.exe or vssadmin.exe',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 1 (Process Creation recording exact parent-child command lines) on Domain Controllers for ntdsutil.exe or vssadmin.exe spawned under firewall LDAP service accounts (svc_*), paired with unexpected Remote Access VPN logins (confirming end-to-end perimeter-to-domain escalation).',
      },
    },
  },

  'sonicwall-sslvpn-cve-2024-40766-akira': {
    briefing: {
      storyAnalogy:
        'Imagine a modern office tower whose lobby revolving door has a faulty lock mechanism on its remote visitor keypad. An intruder exploits that latch flaw to slip through the front lobby using a local staff door code with no second-factor check, walks upstairs to map every department and bolt a private remote intercom onto the maintenance room, and finally shreds every backup binder before padlocking every filing cabinet across the building for ransom.',
      storyMappings: [
        {
          storyTerm: 'Lobby revolving door keypad',
          technicalTerm: 'Internet-exposed SonicWall SonicOS SSLVPN portal (TCP/4433 or 443)',
        },
        {
          storyTerm: 'Faulty lock mechanism',
          technicalTerm: 'CVE-2024-40766 improper access control vulnerability in SonicOS',
        },
        {
          storyTerm: 'Private remote intercom',
          technicalTerm: 'Unauthorized AnyDesk remote management tool deployed for persistence',
        },
        {
          storyTerm: 'Shredding backup binders and padlocking cabinets',
          technicalTerm: 'Win32_ShadowCopy deletion followed by Akira or Fog ransomware encryption',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing outside the office tower lobby, the intruder triggers the faulty latch on the remote visitor door and walks inside under a local staff code that never asks for a pocket token, quietly claiming an internal building pass.',
        storyMappings: [
          {
            storyTerm: 'Remote visitor door',
            technicalTerm: 'WAN-facing SonicWall SSLVPN service (Gen 5, Gen 6, or Gen 7)',
          },
          {
            storyTerm: 'Faulty latch flaw',
            technicalTerm: 'CVE-2024-40766 improper access control bypass',
          },
          {
            storyTerm: 'Local staff code without a pocket token',
            technicalTerm: 'Local SonicOS firewall user account lacking TOTP MFA enforcement',
          },
          {
            storyTerm: 'Internal building pass',
            technicalTerm: 'Allocated corporate SSLVPN IP lease inside the internal LAN',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once past the lobby, the intruder reads the hallway floor directory to locate the executive offices, sends remote maintenance orders down the building service pipes to take over neighboring rooms, and bolts a private intercom box onto the wall so they can walk back in even if the lobby lock gets repaired.',
        storyMappings: [
          {
            storyTerm: 'Hallway floor directory',
            technicalTerm: 'Active Directory enumeration via nltest /dclist and net group queries',
          },
          {
            storyTerm: 'Remote maintenance orders over service pipes',
            technicalTerm: 'Impacket wmiexec.py lateral execution over SMB and WMI (WmiPrvSE.exe)',
          },
          {
            storyTerm: 'Private intercom box',
            technicalTerm: 'Unauthorized AnyDesk.exe installation for out-of-band persistence',
          },
          {
            storyTerm: 'Neighboring rooms',
            technicalTerm: 'Internal Windows domain servers and workstations',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation telemetry capturing full process lineage and command lines) showing WmiPrvSE.exe spawning cmd.exe /Q /c redirected to \\\\127.0.0.1\\ADMIN$\\__* (the unmistakable Impacket wmiexec.py output redirection pattern) alongside unauthorized AnyDesk.exe binaries or services.',
      },
      3: {
        storyAnalogy:
          'After wheeling cartons of confidential company files out the loading dock, the intruder runs an industrial shredder through every backup binder in the storage vault and snaps heavy combination padlocks onto every filing cabinet, leaving a ransom note demanding payment for the combinations.',
        storyMappings: [
          {
            storyTerm: 'Wheeling cartons out the loading dock',
            technicalTerm: 'Data exfiltration using Rclone or WinSCP to attacker-controlled storage',
          },
          {
            storyTerm: 'Industrial shredder destroying backup binders',
            technicalTerm: 'PowerShell Get-CimInstance Win32_ShadowCopy | Remove-CimInstance',
          },
          {
            storyTerm: 'Heavy combination padlocks on filing cabinets',
            technicalTerm: 'Akira or Fog ransomware mass file encryption (.akira / .fog extensions)',
          },
          {
            storyTerm: 'Ransom note demanding payment',
            technicalTerm: 'Double-extortion ransom note dropped after volume shadow copy wipe',
          },
        ],
        detectionAndEvidence:
          'Correlate PowerShell ScriptBlock Logging EventID 4104 (which records full deobfuscated PowerShell script contents executed in memory) capturing Win32_ShadowCopy | Remove-CimInstance with EDR high-velocity file-rename alerts appending .akira or .fog extensions (confirming active ransomware impact).',
      },
    },
  },

  'fortimanager-fgd-jump-cve-2024-47575': {
    briefing: {
      storyAnalogy:
        'Imagine a national railway central switchboard tower that controls track signals for hundreds of branch stations. Because the tower side telegraph line accepts any caller presenting a homemade brass emblem without checking the official station roster, an intruder registers a counterfeit branch box, slips a forged override note into the tower blueprint checkout lever to seize master keys, and packs every real station schematic and vault code into a single steamer trunk.',
      storyMappings: [
        {
          storyTerm: 'Central switchboard tower',
          technicalTerm: 'FortiManager central management appliance (fgfmsd daemon)',
        },
        {
          storyTerm: 'Side telegraph line accepting homemade brass emblems',
          technicalTerm: 'TCP port 541 FGFM protocol lacking certificate validation (CVE-2024-47575)',
        },
        {
          storyTerm: 'Blueprint checkout lever',
          technicalTerm: 'Internal action=put_json rcs_checkout command injection handler',
        },
        {
          storyTerm: 'Steamer trunk of branch schematics and vault codes',
          technicalTerm: 'Exfiltrated /tmp/.tm.tar.gz archive of /var/fwclient and globaldb configs',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'From outside the rail yard, the intruder dials the tower side telegraph line, flashes a self-stamped brass emblem, and registers a phantom branch station on the live switchboard without anyone verifying whether that station exists in the company registry.',
        storyMappings: [
          {
            storyTerm: 'Tower side telegraph line',
            technicalTerm: 'Internet-exposed FortiManager FGFM service on TCP port 541',
          },
          {
            storyTerm: 'Self-stamped brass emblem',
            technicalTerm: 'Arbitrary or self-signed TLS client certificate accepted by fgfmsd',
          },
          {
            storyTerm: 'Phantom branch station registration',
            technicalTerm: 'Unauthenticated FGFM device registration request (CVE-2024-47575)',
          },
          {
            storyTerm: 'Live switchboard',
            technicalTerm: 'Active fgfmsd management session granted to the rogue peer',
          },
        ],
        detectionAndEvidence:
          'Inspect FortiManager event logs for unregistered device registration entries containing hostname="localhost" or unknown serial numbers originating from external WAN IP addresses on TCP port 541 (confirming unauthenticated FortiJump CVE-2024-47575 session setup).',
      },
      2: {
        storyAnalogy:
          'Over the newly approved telegraph line, the intruder sends a blueprint-checkout order with hidden workshop commands tucked behind a punctuation break. The switchboard tower passes the whole note straight to the master mechanic, who executes the hidden commands with full building authority.',
        storyMappings: [
          {
            storyTerm: 'Blueprint-checkout order',
            technicalTerm: 'FGFM action=put_json request invoking rcs_checkout',
          },
          {
            storyTerm: 'Hidden commands behind a punctuation break',
            technicalTerm: 'Unsanitized shell metacharacters injected into /usr/bin/rcs -l',
          },
          {
            storyTerm: 'Master mechanic with full building authority',
            technicalTerm: '/bin/fgfmsd spawning /bin/sh -c running as root (UID 0)',
          },
          {
            storyTerm: 'Secret workshop drop folder',
            technicalTerm: 'Staged attacker payload and staging path in /tmp/.tm',
          },
        ],
        detectionAndEvidence:
          'Monitor Linux process telemetry on FortiManager for /bin/fgfmsd spawning /bin/sh -c /usr/bin/rcs -l containing shell metacharacters such as semicolons or backticks, alongside unexplained files under /tmp/.tm (providing high-confidence proof of post-registration command injection).',
      },
      3: {
        storyAnalogy:
          'Holding master tower keys, the intruder sweeps every branch-station filing cabinet, packs all firewall maps, tunnel passphrases, and master password records into a tightly bound steamer trunk, and ships the entire bundle out of the rail yard.',
        storyMappings: [
          {
            storyTerm: 'Branch-station filing cabinets',
            technicalTerm: 'Managed FortiGate configuration stores in /var/fwclient and /var/fds/data',
          },
          {
            storyTerm: 'Tightly bound steamer trunk',
            technicalTerm: 'Compressed staging archive /tmp/.tm.tar.gz',
          },
          {
            storyTerm: 'Firewall maps and tunnel passphrases',
            technicalTerm: 'FortiOS configurations, IPsec VPN pre-shared keys, and admin password hashes',
          },
          {
            storyTerm: 'Shipping the bundle out of the rail yard',
            technicalTerm: 'Exfiltration of managed device configurations by UNC5820',
          },
        ],
        detectionAndEvidence:
          'Hunt for staging artifacts in /tmp/.tm or /var/tmp, unexpected archive creation targeting /var/fwclient or /var/fds/data, and unauthorized FGFM configuration pushes to downstream FortiGates (detecting bulk credential theft and downstream appliance compromise).',
      },
    },
  },

  'paloalto-expedition-cve-2024-5910-chain': {
    briefing: {
      storyAnalogy:
        'Imagine a master locksmith migration workshop that holds spare keys and floor plans for every fortress gate across an entire kingdom. An intruder spots an unguarded emergency reset button on the front counter that resets the shop manager lock back to the factory code, then slides a forged work ticket onto the workshop automated task belt to seize full control of the shop, and finally unlocks the safe to copy every live fortress gate key.',
      storyMappings: [
        {
          storyTerm: 'Locksmith migration workshop',
          technicalTerm: 'Palo Alto Networks Expedition configuration migration server',
        },
        {
          storyTerm: 'Unguarded emergency reset button',
          technicalTerm: 'Unauthenticated /OS/startup/restoreAdmin.php endpoint (CVE-2024-5910)',
        },
        {
          storyTerm: 'Workshop automated task belt',
          technicalTerm: 'CHECKPOINT.php import handler and MySQL cron job execution (CVE-2024-9463)',
        },
        {
          storyTerm: 'Live fortress gate keys in the workshop safe',
          technicalTerm: 'Decrypted PAN-OS XML API keys (LUFRPT1) stored in pandb.devices',
        },
      ],
      plainSummary:
        'Palo Alto Networks Expedition is a migration utility used by network engineers to convert Cisco, Check Point, and Fortinet firewall configurations into PAN-OS format and push them to live firewalls via XML API keys (long-lived administrative tokens granting direct firewall configuration control). In 2024, attackers chained CVE-2024-5910 (missing authentication on /OS/startup/restoreAdmin.php that resets the Expedition admin password to factory defaults) with CVE-2024-9463 (OS command injection in the migration import and cron job subsystem) to execute commands as root and harvest decrypted PAN-OS firewall API keys alongside multi-vendor network blueprints.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the locksmith workshop front counter without showing an employee badge, the intruder presses the exposed emergency reset switch. Instantly, the shop manager padlock reverts to the factory combination printed in the public manual.',
        storyMappings: [
          {
            storyTerm: 'Exposed emergency reset switch',
            technicalTerm: 'Unauthenticated HTTP request to /OS/startup/restoreAdmin.php',
          },
          {
            storyTerm: 'Missing employee badge check',
            technicalTerm: 'CVE-2024-5910 missing session authentication check',
          },
          {
            storyTerm: 'Factory combination in the public manual',
            technicalTerm: 'Default Expedition admin credentials restored on the appliance',
          },
          {
            storyTerm: 'Shop manager padlock',
            technicalTerm: 'Expedition web interface administrative account',
          },
        ],
        detectionAndEvidence:
          'Inspect Apache web access logs on the Expedition host for any GET or POST requests to /OS/startup/restoreAdmin.php (which should never be invoked during normal operations and directly confirms CVE-2024-5910 admin password reset exploitation).',
      },
      2: {
        storyAnalogy:
          'Now holding the shop manager key, the intruder writes hidden workshop commands into a migration intake form and drops them onto the shop automated scheduling belt, tricking the back-room web clerk into running full operating commands across the workshop.',
        storyMappings: [
          {
            storyTerm: 'Migration intake form with hidden commands',
            technicalTerm: 'Crafted shell metacharacters submitted to CHECKPOINT.php (CVE-2024-9463)',
          },
          {
            storyTerm: 'Automated scheduling belt',
            technicalTerm: 'Expedition MySQL cron job table and periodic task runner',
          },
          {
            storyTerm: 'Back-room web clerk',
            technicalTerm: '/usr/sbin/apache2 process running as www-data',
          },
          {
            storyTerm: 'Full operating commands across the workshop',
            technicalTerm: 'Spawned /bin/sh -c command execution escalating to root',
          },
        ],
        detectionAndEvidence:
          'Monitor Linux process execution logs for /usr/sbin/apache2 spawning /bin/sh -c from CHECKPOINT.php alongside unauthorized rows inserted into the Expedition MySQL cron job table (identifying active CVE-2024-9463 or CVE-2024-9464 remote code execution).',
      },
      3: {
        storyAnalogy:
          'With complete control of the locksmith shop, the intruder opens the ledger cabinet, grabs the shop own master decoding key off the wall, and unlocks every stored fortress gate key and backup blueprint for the kingdom perimeter walls.',
        storyMappings: [
          {
            storyTerm: 'Ledger cabinet',
            technicalTerm: 'Expedition pandb.devices MySQL database table',
          },
          {
            storyTerm: 'Master decoding key off the wall',
            technicalTerm: 'Stored decryption key extracted from the Expedition PHP codebase',
          },
          {
            storyTerm: 'Stored fortress gate keys',
            technicalTerm: 'Decrypted PAN-OS XML API keys (LUFRPT1 administrative bearer tokens)',
          },
          {
            storyTerm: 'Backup blueprints for the perimeter walls',
            technicalTerm: 'Imported Cisco ASA, Fortinet, and Check Point firewall configurations',
          },
        ],
      },
    },
  },

  'sophos-firewall-cve-2022-3236-asnarok': {
    briefing: {
      storyAnalogy:
        'Imagine a two-desk embassy reception hall where every visitor hands over a written entry slip. The front guard inspects the slip for forbidden instructions, but stops reading the instant they hit an invisible blank stamp. Behind the curtain, the back-office director reads right past the blank stamp and obeys the hidden orders written after it, handing the spy master control to wire a secret carbon-copy pad under the login book and tunnel straight into the embassy.',
      storyMappings: [
        {
          storyTerm: 'Front guard stopping at an invisible blank stamp',
          technicalTerm: 'Java servlet filter stopping validation at a null byte (\\u0000 / %00)',
        },
        {
          storyTerm: 'Back-office director obeying hidden orders',
          technicalTerm: 'Privileged backend csc daemon evaluating injected shell commands as root',
        },
        {
          storyTerm: 'Secret carbon-copy pad under the login book',
          technicalTerm: 'Trojanized User Portal and Webadmin login scripts logging cleartext credentials',
        },
        {
          storyTerm: 'Hidden tunnel into the embassy',
          technicalTerm: 'Persistent socat TLS reverse relay into the internal corporate LAN',
        },
      ],
      plainSummary:
        'In September 2022, Sophos and Volexity disclosed CVE-2022-3236 (a CVSS 9.8 unauthenticated remote code injection flaw affecting Sophos Firewall v19.0 MR1 and older) exploited as a zero-day by China-nexus espionage group DriftingCloud. By sending a crafted mode=151 JSON login request containing a null byte (%00 or \\u0000, a non-printable terminator that halts front-end input validation early) followed by shell commands to /userportal/Controller or /webconsole/Controller, attackers bypassed the front-end Java filter and executed arbitrary commands as root inside the backend Cyberoam System Controller (csc) daemon.',
    },
    steps: {
      1: {
        storyAnalogy:
          'At the front reception desk, the spy submits a normal-looking entry slip with an invisible blank stamp placed right before a line of secret orders. The front guard checks the harmless name before the blank stamp, marks the slip clean, and slides it through the slot to the back room.',
        storyMappings: [
          {
            storyTerm: 'Front reception desk',
            technicalTerm: 'Pre-authentication /userportal/Controller and /webconsole/Controller endpoints',
          },
          {
            storyTerm: 'Normal-looking entry slip',
            technicalTerm: 'HTTP POST mode=151 JSON authentication request',
          },
          {
            storyTerm: 'Invisible blank stamp',
            technicalTerm: 'Null byte (\\u0000 or %00) triggering the CVE-2022-3236 parser differential',
          },
          {
            storyTerm: 'Front guard marking the slip clean',
            technicalTerm: 'Java servlet input filter halting inspection before the injected commands',
          },
        ],
        detectionAndEvidence:
          'Review Sophos /log/apache_access.log and perimeter WAF alerts for HTTP POST mode=151 requests containing %00, \\u0000, %0a, or shell metacharacters inside the json parameter (identifying pre-authentication CVE-2022-3236 parser-differential exploitation).',
      },
      2: {
        storyAnalogy:
          'In the back room, the senior controller who carries master building keys reads the entire slip past the blank stamp and executes the hidden instructions immediately, fetching a second stage of spy tools straight into memory without leaving papers on the desk.',
        storyMappings: [
          {
            storyTerm: 'Senior controller with master building keys',
            technicalTerm: 'Cyberoam System Controller (/bin/csc) running as root (UID 0)',
          },
          {
            storyTerm: 'Executing hidden instructions immediately',
            technicalTerm: 'Unsanitized Perl/shell evaluation spawning /bin/sh -c',
          },
          {
            storyTerm: 'Fetching spy tools straight into memory',
            technicalTerm: 'In-memory fetch and execution of DriftingCloud second-stage shell script',
          },
          {
            storyTerm: 'Leaving no papers on the desk',
            technicalTerm: 'Minimal on-disk payload footprint during initial memory staging',
          },
        ],
        detectionAndEvidence:
          'Check /log/csc.log for malformed opcode or JSON parsing errors paired with host telemetry showing /bin/csc spawning child /bin/sh processes (confirming that the payload crossed from the Java servlet into root-level csc command evaluation).',
      },
      3: {
        storyAnalogy:
          'Now owning the embassy gatehouse, the spy slips a carbon-copy sheet underneath the reception sign-in book so every employee badge code gets silently copied into a hidden pocket, and opens a private encrypted crawlspace leading straight into the inner embassy offices.',
        storyMappings: [
          {
            storyTerm: 'Carbon-copy sheet under the sign-in book',
            technicalTerm: 'Trojanized User Portal and Webadmin CGI login authentication scripts',
          },
          {
            storyTerm: 'Hidden pocket storing copied badge codes',
            technicalTerm: 'Cleartext credential stash file written to /var/tmp/.auth.log',
          },
          {
            storyTerm: 'Private encrypted crawlspace',
            technicalTerm: 'Persistent socat TLS reverse tunnel proxying into the internal corporate LAN',
          },
          {
            storyTerm: 'Employee badge codes',
            technicalTerm: 'Harvested VPN and Active Directory credentials remaining valid after patching',
          },
        ],
        detectionAndEvidence:
          'Run filesystem integrity checks across /usr/share/userportal and /usr/share/webconsole, audit running firewall processes for unauthorized socat or ssh binaries, and inspect outbound TLS connections from the appliance (catching post-patch credential stealers and reverse relays).',
      },
    },
  },

  'array-networks-ag-vxag-cve-2023-28461': {
    briefing: {
      storyAnalogy:
        'Imagine a private coastal harbor customs depot where every barge must clear a badge check before entering the warehouse. A smuggler stamps an internal cargo-handling flag onto an uninspected manifest and slips a blank pause into the berth address, tricking the gatekeeper into waving the barge straight into the records room. Once inside, the smuggler copies the harbor master ledger, hides a secret radio clerk behind the crates, and ferries stowaways onto internal city freight trains.',
      storyMappings: [
        {
          storyTerm: 'Internal cargo-handling flag on an uninspected manifest',
          technicalTerm: 'Crafted X-AN-FILESHARE flags=00300 HTTP header (CVE-2023-28461)',
        },
        {
          storyTerm: 'Harbor master ledger',
          technicalTerm: 'Gateway configuration file /ca/conf/default.ampled with VPN and LDAP secrets',
        },
        {
          storyTerm: 'Secret radio clerk behind the crates',
          technicalTerm: 'Dropped PHP webshell and /tmp/s5n proxy listener on ArrayOS',
        },
        {
          storyTerm: 'Stowaways boarded onto internal city trains',
          technicalTerm: 'Internal lateral movement deploying LODEINFO and NOOPDOOR in memory',
        },
      ],
      plainSummary:
        'Reported by JPCERT/CC and analyzed by Trend Micro and Unit 42 in espionage campaigns attributed to Earth Kasha (also tracked as MirrorFace), CVE-2023-28461 (CVSS 9.8) is a critical pre-authentication bypass and arbitrary file-access vulnerability in Array Networks AG and vxAG SSL VPN gateways. By supplying a crafted X-AN-FILESHARE header (an internal file-sharing directive trusted without session verification) alongside a null-byte URI path, attackers read sensitive gateway configuration secrets, planted webshells and proxy relays, and pivoted into internal Windows networks with LODEINFO and NOOPDOOR memory implants.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Approaching the harbor customs booth with zero credentials, the smuggler flashes a stamped internal cargo-sharing tag and inserts a blank pause into the berth path. The automated gatekeeper mistakes the request for an authorized internal transfer and unlocks the customs barrier.',
        storyMappings: [
          {
            storyTerm: 'Stamped internal cargo-sharing tag',
            technicalTerm: 'HTTP request header X-AN-FILESHARE: flags=00300',
          },
          {
            storyTerm: 'Berth path with a blank pause',
            technicalTerm: 'Target URI /prx/000/http/localhost/client_sec/%00/add_folder',
          },
          {
            storyTerm: 'Automated gatekeeper unlocking the barrier',
            technicalTerm: 'CVE-2023-28461 authentication bypass on ArrayOS SSL VPN gateway',
          },
          {
            storyTerm: 'Uninspected external barge',
            technicalTerm: 'Unauthenticated WAN HTTP request from Earth Kasha infrastructure',
          },
        ],
        detectionAndEvidence:
          'Configure perimeter WAF and IDS rules to inspect external HTTP requests containing the X-AN-FILESHARE header or /prx/000/http/localhost/client_sec URIs carrying %00 null-byte or .. traversal sequences (catching CVE-2023-28461 exploitation at the network edge).',
      },
      2: {
        storyAnalogy:
          'Inside the unlocked customs warehouse, the smuggler copies the harbor master book holding local crew codes and inland rail directory keys, then hides both a silent message clerk and a private relay station behind the crates to route traffic straight into the city.',
        storyMappings: [
          {
            storyTerm: 'Harbor master book',
            technicalTerm: 'Gateway file /ca/conf/default.ampled containing VPN and RADIUS/LDAP secrets',
          },
          {
            storyTerm: 'Silent message clerk',
            technicalTerm: 'Dropped PHP webshell written onto the ArrayOS web filesystem',
          },
          {
            storyTerm: 'Private relay station behind the crates',
            technicalTerm: 'Unauthorized ELF SOCKS proxy binary running as /tmp/s5n',
          },
          {
            storyTerm: 'Inland rail directory keys',
            technicalTerm: 'Extracted internal RADIUS and Active Directory LDAP bind credentials',
          },
        ],
        detectionAndEvidence:
          'Perform ArrayOS filesystem integrity auditing for newly written .php webshells, unauthorized ELF listener binaries in /tmp (such as /tmp/s5n), and unexpected outbound SMB or WMI connections originating from the VPN gateway internal IP (confirming gateway weaponization as a pivot).',
      },
      3: {
        storyAnalogy:
          'Tunneling through the hidden warehouse relay with stolen rail passes, the smuggler boards internal office workstations and hides live espionage gear inside trusted maintenance builders and signed security helper tools so guards overlook the active payload.',
        storyMappings: [
          {
            storyTerm: 'Hidden warehouse relay',
            technicalTerm: 'SOCKS pivot through /tmp/s5n into the internal corporate network',
          },
          {
            storyTerm: 'Trusted maintenance builder',
            technicalTerm: 'Abused MSBuild.exe executing malicious XML project payloads from C:\\ProgramData',
          },
          {
            storyTerm: 'Signed security helper tool carrying hidden gear',
            technicalTerm: 'DLL side-loading of unsigned K7DbgMN.dll by legitimate K7SysMn1.exe',
          },
          {
            storyTerm: 'Live espionage gear in memory',
            technicalTerm: 'LODEINFO and NOOPDOOR in-memory backdoor implants',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 1 (Process Creation) and EventID 7 (Image Loaded, tracking DLLs mapped into processes) alerting on MSBuild.exe compiling XML files from C:\\ProgramData and signed K7SysMn1.exe side-loading an unsigned K7DbgMN.dll (detecting Earth Kasha internal endpoint staging).',
      },
    },
  },

  'vulncheck-cwp-preauth-module-dispatch-rce': {
    briefing: {
      storyAnalogy:
        'Imagine a multi-tenant apartment building with a distracted lobby receptionist and an unlocked basement dumbwaiter leading straight to the superintendent boiler room. First, an intruder tests mailbox names and notices that even after the receptionist writes a move-along slip, she still fetches and opens whatever tenant folder was named on the form. Next, the intruder uses that unlocked folder to trigger a self-starting workshop drawer inside a tenant unit, rides the unguarded basement dumbwaiter up to the superintendent office, and slips a forged pass formula into the superintendent guestbook to seize full control of the whole building.',
      storyMappings: [
        {
          storyTerm: 'Lobby receptionist opening folders after a move-along slip',
          technicalTerm: 'Execution-after-redirect (CVE-2026-73696) and module LFI (CVE-2026-73695) on port 2083',
        },
        {
          storyTerm: 'Self-starting workshop drawer inside a tenant unit',
          technicalTerm: 'File-scope pre-auth PHP execution in phpini_editor.php (CVE-2026-73697)',
        },
        {
          storyTerm: 'Unguarded basement dumbwaiter to the boiler room',
          technicalTerm: 'Loopback root API on 127.0.0.1:2302 lacking authentication (CVE-2026-77877..104080)',
        },
        {
          storyTerm: 'Forged pass formula in the superintendent guestbook',
          technicalTerm: 'OAuth SQL injection bypass (CVE-2026-77879) and /v1/newpass/ root RCE (CVE-2026-77880)',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the apartment lobby counter, the intruder reads the timing of buzzer responses to discover a real tenant name, then asks for an internal room folder without showing a key. The clerk stamps a redirect notice telling the intruder to leave, yet forgets to stop working and still pulls the requested folder off the shelf.',
        storyMappings: [
          {
            storyTerm: 'Buzzer responses revealing a real tenant name',
            technicalTerm: 'Per-user PHP-FPM socket routing oracle on https://host:2083/<username>/',
          },
          {
            storyTerm: 'Redirect notice that fails to stop work',
            technicalTerm: 'Missing exit after Location redirect header (CVE-2026-73696)',
          },
          {
            storyTerm: 'Pulling the requested folder off the shelf',
            technicalTerm: 'Unauthenticated module parameter local file inclusion (CVE-2026-73695)',
          },
          {
            storyTerm: 'Apartment lobby counter',
            technicalTerm: 'Internet-facing cwpsrv nginx proxy forwarding to user PHP-FPM pools',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because one of the tenant workshop drawers starts running its tools the instant anyone slides it open, the intruder simply names that drawer on the lobby request and immediately gains command execution inside that tenant apartment with zero login.',
        storyMappings: [
          {
            storyTerm: 'Self-running tenant workshop drawer',
            technicalTerm: 'modules/phpini_editor.php and protected_directory.php executing at file scope',
          },
          {
            storyTerm: 'Naming the drawer on the lobby request',
            technicalTerm: 'Unauthenticated ?module=phpini_editor dispatch chaining CVE-2026-73697',
          },
          {
            storyTerm: 'Command execution inside the tenant apartment',
            technicalTerm: 'Pre-auth remote code execution running under the hosting user UID',
          },
          {
            storyTerm: 'Secondary unlocked tool tray',
            technicalTerm: 'protected_directory.php command injection fallback (CVE-2026-77876)',
          },
        ],
      },
      3: {
        storyAnalogy:
          'From inside the tenant apartment, the intruder opens the building internal basement dumbwaiter shaft that connects straight to the superintendent boiler room. Because the boiler-room intercom assumes only trusted staff can reach the basement shaft, it blindly runs the intruder maintenance command with master building privileges.',
        storyMappings: [
          {
            storyTerm: 'Basement dumbwaiter shaft',
            technicalTerm: 'Localhost-only Slim v2 User API listening on https://127.0.0.1:2302',
          },
          {
            storyTerm: 'Boiler-room intercom skipping badge checks',
            technicalTerm: 'Missing authentication middleware on /v1/restoredatabase/ and /valid_token/ (CVE-2026-77877)',
          },
          {
            storyTerm: 'Maintenance command with hidden separators',
            technicalTerm: 'Root shell injection via unsanitized parameters (CVE-2026-77878 & CVE-2026-104080)',
          },
          {
            storyTerm: 'Master building privileges',
            technicalTerm: 'Root PHP-FPM worker pool executing /bin/sh -c as UID 0',
          },
        ],
        detectionAndEvidence:
          'Monitor Linux auditd execve (syscall 59, which logs every program launch with its exact user ID and arguments) where uid=0 and euid=0 spawn /bin/sh -c running mysql or grep with shell separators (; or |), and inspect loopback PHP-FPM logs for hits to 127.0.0.1:2302/v1/restoredatabase/ and /valid_token/ (catching local user-to-root escalation).',
      },
      4: {
        storyAnalogy:
          'Even on the locked doors inside the superintendent office that do check a visitor passbook, the intruder writes a clever trick question into the pass lookup line that makes the ledger reply yes automatically, unlocking the master password reset desk to claim permanent control of the entire apartment complex.',
        storyMappings: [
          {
            storyTerm: 'Locked doors checking a visitor passbook',
            technicalTerm: 'access_token() middleware in services/user_api/v1/index.php',
          },
          {
            storyTerm: 'Trick question making the ledger reply yes',
            technicalTerm: 'SQL injection bypass in OAuth token lookup as root@localhost (CVE-2026-77879)',
          },
          {
            storyTerm: 'Master password reset desk',
            technicalTerm: '/v1/newpass/ endpoint root command injection (CVE-2026-77880)',
          },
          {
            storyTerm: 'Hidden yes-or-no ledger peephole',
            technicalTerm: 'Blind SQL injection information disclosure vector (CVE-2026-77881)',
          },
        ],
      },
    },
  },

  'ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a busy highway toll-plaza control tower whose initial setup side window was left unlatched facing a public access ramp. An intruder reaches straight through the setup window without showing an employee badge, writes a brand-new supervisor name directly into the tower permanent staffing roster, and then walks calmly through the front supervisor door to swap the automated traffic-routing rules.',
      storyMappings: [
        {
          storyTerm: 'Unlatched initial setup side window',
          technicalTerm: 'Unauthenticated wizard.fcgi handler exposed on management port 9090 (CVE-2024-7593)',
        },
        {
          storyTerm: 'Tower permanent staffing roster',
          technicalTerm: 'Local administrator user file at $ZEUSHOME/zxtm/conf/users',
        },
        {
          storyTerm: 'Brand-new supervisor name',
          technicalTerm: 'Unauthorized Full Administrator account (support_svc) written to disk',
        },
        {
          storyTerm: 'Swapping automated traffic-routing rules',
          technicalTerm: 'Authenticated upload and execution of custom Action Programs on vTM',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Driving up the exposed management ramp, the intruder bypasses the locked main guard booth completely and reaches straight through the unlatched setup-wizard side window, which fails to demand any employee badge before accepting changes.',
        storyMappings: [
          {
            storyTerm: 'Exposed management ramp',
            technicalTerm: 'Ivanti vTM management interface reachable on TCP port 9090',
          },
          {
            storyTerm: 'Unlatched setup-wizard side window',
            technicalTerm: 'CVE-2024-7593 authentication bypass in wizard.fcgi',
          },
          {
            storyTerm: 'Locked main guard booth',
            technicalTerm: 'Normal authenticated vTM Admin UI login workflow',
          },
          {
            storyTerm: 'Missing badge check',
            technicalTerm: 'Unauthenticated HTTP POST accepted directly by the setup controller',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Reaching through the open setup window, the intruder writes a brand-new Full Supervisor name and password straight into the toll-plaza master employee ledger, creating a legitimate-looking insider credential that survives ordinary shift changes.',
        storyMappings: [
          {
            storyTerm: 'Toll-plaza master employee ledger',
            technicalTerm: '$ZEUSHOME/zxtm/conf/users local administrator configuration file',
          },
          {
            storyTerm: 'Brand-new Full Supervisor name',
            technicalTerm: 'Rogue Full Administrator account (support_svc) provisioned via wizard.fcgi',
          },
          {
            storyTerm: 'Open setup window',
            technicalTerm: 'Unauthenticated wizard.fcgi account provisioning routine',
          },
          {
            storyTerm: 'Surviving ordinary shift changes',
            technicalTerm: 'Persistent local admin access remaining active even after patching',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Returning to the front supervisor door with the freshly minted badge, the intruder signs in like an authorized manager and installs a custom automated lane-switching script, gaining direct command over the control tower machinery.',
        storyMappings: [
          {
            storyTerm: 'Front supervisor door',
            technicalTerm: 'Authenticated vTM Admin UI session on TCP port 9090',
          },
          {
            storyTerm: 'Freshly minted supervisor badge',
            technicalTerm: 'Rogue support_svc administrator login credentials',
          },
          {
            storyTerm: 'Custom automated lane-switching script',
            technicalTerm: 'Uploaded Custom Action Program executed by the vTM appliance',
          },
          {
            storyTerm: 'Control tower machinery',
            technicalTerm: 'Underlying Linux appliance OS and enterprise load-balanced traffic plane',
          },
        ],
      },
    },
  },

  'versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a regional air-traffic dispatch center with a side emblem chute meant solely for small painted station logos. Because the chute never checks whether an incoming emblem is truly a flat picture or a folded clockwork mechanism, an intruder slides a hidden gear assembly disguised as a logo inside, snaps that gear directly onto the spinning dispatch turntable while it runs, and then shreds the original paper wrapper so a routine desk inspection sees nothing until investigators photograph the spinning turntable itself.',
      storyMappings: [
        {
          storyTerm: 'Side emblem chute meant for painted station logos',
          technicalTerm: 'Port 4566 /portalapi change_Dynamic_Favicon upload endpoint (CVE-2024-39717)',
        },
        {
          storyTerm: 'Folded clockwork gear disguised as a logo',
          technicalTerm: 'Malicious JAR archive with ZIP magic bytes (50 4B 03 04) saved as favicon_brand.png',
        },
        {
          storyTerm: 'Snapping the gear onto the spinning dispatch turntable',
          technicalTerm: 'JVM VirtualMachine.attach loading VersaMem Java Instrumentation Agent into Tomcat',
        },
        {
          storyTerm: 'Shredding the paper wrapper while investigators photograph the turntable',
          technicalTerm: 'On-disk unlinkat deletion countered by live jmap JVM heap forensic dump',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Approaching the dispatch center side coordination chute, the intruder drops in a dense metal clockwork assembly painted to look like a harmless little station badge. Because the chute only checks the paper label instead of weighing or X-raying the package, it shelves the disguised mechanism inside the station emblem drawer.',
        storyMappings: [
          {
            storyTerm: 'Side coordination chute',
            technicalTerm: 'Exposed Versa Director port 4566 change_Dynamic_Favicon API (CVE-2024-39717)',
          },
          {
            storyTerm: 'Metal clockwork assembly painted like a badge',
            technicalTerm: 'Executable JAR payload carrying ZIP magic bytes (50 4B 03 04)',
          },
          {
            storyTerm: 'Paper label check without X-raying',
            technicalTerm: 'Filename extension check (.png) without file magic-byte verification',
          },
          {
            storyTerm: 'Station emblem drawer',
            technicalTerm: '/var/versa/vnms/web/custom_logo/favicon_brand.png on disk',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using an official maintenance coupling socket built into the live dispatch console, the intruder snaps the disguised clockwork gear directly onto the spinning traffic-routing turntable. From that moment on, every visitor message passing across the turntable silently runs through the intruder hidden teeth.',
        storyMappings: [
          {
            storyTerm: 'Official maintenance coupling socket',
            technicalTerm: 'JVM Dynamic Attach Unix domain socket (/tmp/.java_pid2418)',
          },
          {
            storyTerm: 'Snapping the gear onto the spinning turntable',
            technicalTerm: 'VirtualMachine.attach loading the VersaMem Java Instrumentation Agent',
          },
          {
            storyTerm: 'Spinning traffic-routing turntable',
            technicalTerm: 'Running Apache Tomcat ApplicationFilterChain.internalDoFilter method',
          },
          {
            storyTerm: 'Hidden teeth intercepting every message',
            technicalTerm: 'In-memory Javassist bytecode hook harvesting credentials and commands',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Once the clockwork gear is locked onto the spinning turntable, the intruder sweeps the original badge package into an incinerator so a casual look inside the emblem drawer finds nothing unusual. Skilled investigators must freeze and photograph the spinning turntable itself before anyone flips the power switch and erases the evidence.',
        storyMappings: [
          {
            storyTerm: 'Sweeping the original package into an incinerator',
            technicalTerm: 'Anti-forensic unlinkat (syscall 263) deleting favicon_brand.png from disk',
          },
          {
            storyTerm: 'Casual look inside the emblem drawer',
            technicalTerm: 'Standard filesystem antivirus scan missing the memory-resident agent',
          },
          {
            storyTerm: 'Photographing the spinning turntable before power-off',
            technicalTerm: 'Live JVM heap acquisition via jmap -dump:live to /cases/versa_tomcat_heap.hprof',
          },
          {
            storyTerm: 'Captured turntable blueprint showing foreign teeth',
            technicalTerm: 'Recovered hooked ApplicationFilterChain bytecode attributed to Volt Typhoon',
          },
        ],
      },
    },
  },
};
