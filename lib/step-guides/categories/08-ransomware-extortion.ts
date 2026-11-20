import type { CategoryStandardPatchMap } from './types';

/**
 * Category 8: RANSOMWARE_EXTORTION (20 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 20 ransomware, wiper, and extortion scenarios.
 */
export const RANSOMWARE_EXTORTION_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'blackbasta-qakbot-backstab-ransomware': {
    briefing: {
      storyAnalogy:
        'Imagine a burglar who jams a victim mailbox with thousands of junk flyers and then calls right away dressed as a helpful postal technician offering to fix the jam over a built-in home intercom. Once invited onto the desk, the fake technician flashes an outdated inspector badge to unplug the security alarm wires, wheels boxes of family records out the back door, shreds the spare backup notebooks, and snaps heavy padlocks onto every filing cabinet.',
      storyMappings: [
        {
          storyTerm: 'Jamming the mailbox and calling as a helpful technician',
          technicalTerm: 'Email bombing followed by external Microsoft Teams vishing and QuickAssist.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Outdated inspector badge unplugging security alarm wires',
          technicalTerm: 'Backstab BYOVD tool abusing signed PROCEXP.SYS to strip EDR handles',
          tone: 'sky',
        },
        {
          storyTerm: 'Wheeling boxes of records out the back door',
          technicalTerm: 'SoftPerfect network discovery and Rclone cloud data exfiltration',
          tone: 'rose',
        },
        {
          storyTerm: 'Shredding backup notebooks and padlocking every cabinet',
          technicalTerm: 'vssadmin delete shadows /all /quiet followed by ChaCha20/RSA-4096 (.basta) encryption',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Documented in joint CISA, FBI, and HHS Advisory AA24-131A and Microsoft Threat Intelligence reporting on Storm-1811, Black Basta affiliates shifted from QakBot email malspam to human-operated Microsoft Teams voice phishing (social engineering over external Teams chats and calls). After flooding a target inbox with spam subscriptions, the operator poses as IT helpdesk staff, persuades the victim to launch Windows QuickAssist.exe (Microsoft built-in remote assistance tool), deploys the Backstab BYOVD driver (PROCEXP.SYS) to kill EDR sensors, exfiltrates data with Rclone, and encrypts network shares using ChaCha20 and RSA-4096 (.basta).',
    },
    steps: {
      1: {
        storyAnalogy:
          'First, the intruder floods an employee office inbox with thousands of noisy junk circulars so the desk looks overwhelmed, then immediately rings the employee on an external office intercom posing as IT support and talks them into typing a six-digit remote-control code.',
        storyMappings: [
          {
            storyTerm: 'Thousands of noisy junk circulars flooding the inbox',
            technicalTerm: 'Automated SMTP email bombing via mass newsletter subscription forms',
            tone: 'amber',
          },
          {
            storyTerm: 'External office intercom posing as IT support',
            technicalTerm: 'External tenant Microsoft Teams chat and voice phishing by Storm-1811',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in remote-control code',
            technicalTerm: 'Windows QuickAssist.exe interactive remote screen-control session',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing email attachment scanners',
            technicalTerm: 'Human-authorized screen takeover requiring zero malicious email attachments',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate sudden inbound SMTP spam bursts (thousands of subscription confirmations in minutes) with external tenant Microsoft Teams calls and Sysmon EventID 1 (Process Creation) execution of QuickAssist.exe (exposing the Storm-1811 helpdesk pretext before payload staging).',
      },
      2: {
        storyAnalogy:
          'Taking control of the mouse straight through the remote-help window, the fake technician pulls down a toolbox, flashes an older officially signed maintenance badge to sever the office alarm monitors, scans every hallway for open file rooms, and ships confidential folders out through a hidden courier tunnel.',
        storyMappings: [
          {
            storyTerm: 'Pulling down a toolbox through the remote-help window',
            technicalTerm: 'QuickAssist.exe spawning curl.exe or msiexec.exe to stage payloads',
            tone: 'amber',
          },
          {
            storyTerm: 'Older signed maintenance badge severing alarm monitors',
            technicalTerm: 'backstab.exe loading signed PROCEXP.SYS to close EDR protected process handles',
            tone: 'sky',
          },
          {
            storyTerm: 'Scanning hallways for open file rooms',
            technicalTerm: 'SoftPerfect Network Scanner enumerating internal servers and SMB shares',
            tone: 'rose',
          },
          {
            storyTerm: 'Shipping confidential folders through a courier tunnel',
            technicalTerm: 'Rclone exfiltrating staged archives to attacker cloud storage',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation capturing parent-child trees) and EventID 6 (DriverLoaded logging kernel driver images) when QuickAssist.exe spawns cmd.exe, powershell.exe, or msiexec.exe and when backstab.exe loads signed PROCEXP.SYS (catching BYOVD EDR blinding).',
      },
      3: {
        storyAnalogy:
          'Spreading rapidly down every connected corridor, the intruder runs a shredder through every backup recovery ledger on every server and snaps strong double-keyed locks across every shared cabinet, leaving a printed ransom letter on every desk.',
        storyMappings: [
          {
            storyTerm: 'Spreading down every connected corridor',
            technicalTerm: 'Domain-wide lateral propagation using PsExec or WMI across enterprise hosts',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding every backup recovery ledger',
            technicalTerm: 'vssadmin.exe delete shadows /all /quiet wiping Volume Shadow Copies',
            tone: 'sky',
          },
          {
            storyTerm: 'Double-keyed locks across every cabinet',
            technicalTerm: 'Black Basta ChaCha20 stream encryption wrapped by RSA-4096 appending .basta',
            tone: 'rose',
          },
          {
            storyTerm: 'Printed ransom letter on every desk',
            technicalTerm: 'Dropped readme.faa.txt extortion note demanding payment for decryption',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure EDR behavioral prevention to block vssadmin.exe delete shadows /all /quiet (which destroys native Windows recovery snapshots) and trigger immediate containment on rapid .basta file renames paired with readme.faa.txt creation.',
      },
    },
  },

  'akira-ransomware-cisco-anyconnect-esxi': {
    briefing: {
      storyAnalogy:
        'Imagine a corporate data center whose front lobby keycard reader still honors single-factor staff passwords without a pocket code. A burglar slips through the lobby door, threads a hidden garden hose out through a back vent to bring in extra helpers, raids the backup-vault clerk desk to steal the master building-basement keys, and then marches down to the basement to shut off every virtual apartment simultaneously and padlock their heavy foundation files.',
      storyMappings: [
        {
          storyTerm: 'Front lobby door accepting single-factor passwords',
          technicalTerm: 'Cisco ASA / FTD AnyConnect SSLVPN breach via CVE-2023-20269 or CVE-2020-3259',
          tone: 'amber',
        },
        {
          storyTerm: 'Hidden garden hose threaded out through a back vent',
          technicalTerm: 'chisel.exe reverse SOCKS tunnel bridging attacker tools into the internal LAN',
          tone: 'sky',
        },
        {
          storyTerm: 'Raiding the backup-vault clerk desk for basement keys',
          technicalTerm: 'Dumping [VeeamBackup].[dbo].[Credentials] via sqlcmd.exe and DPAPI decryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Shutting off every virtual apartment and padlocking foundation files',
          technicalTerm: 'SSH esxcli vm process kill followed by Rust-based Akira ESXi VMDK encryption',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Testing the exterior remote-access lobby door from an outside commercial warehouse, the intruder exploits a flaw in the single-password gate and walks cleanly into the internal office corridor without ever passing a second-factor badge check.',
        storyMappings: [
          {
            storyTerm: 'Exterior remote-access lobby door',
            technicalTerm: 'WAN-facing Cisco ASA or Firepower Threat Defense (FTD) AnyConnect VPN',
            tone: 'amber',
          },
          {
            storyTerm: 'Single-password gate flaw',
            technicalTerm: 'CVE-2023-20269 / CVE-2020-3259 or credential stuffing against non-MFA VPN groups',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside commercial warehouse',
            technicalTerm: 'External VPS and commercial hosting ASNs initiating VPN sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Lobby guard book recording the unusual entry',
            technicalTerm: 'Cisco ASA syslog %ASA-6-722022 and %ASA-6-113004 authentication events',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Cisco ASA syslog events %ASA-6-722022 and %ASA-6-113004 (which log AnyConnect IP assignment and group authentication) for logins hitting DefaultWEBVPNGroup or DefaultRAGroup from external hosting ASNs without MFA (detecting initial Akira perimeter entry).',
      },
      2: {
        storyAnalogy:
          'Once inside the building, the intruder snakes a concealed reverse speaking tube out to their hideout, then visits the corporate backup-scheduler office to unlock its credential safe and lift the master keys to the basement hypervisor racks.',
        storyMappings: [
          {
            storyTerm: 'Concealed reverse speaking tube out to the hideout',
            technicalTerm: 'chisel.exe client https://<c2>:8443 R:socks reverse SOCKS proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Corporate backup-scheduler credential safe',
            technicalTerm: 'Veeam Backup SQL table [VeeamBackup].[dbo].[Credentials] queried via sqlcmd.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Unwrapping the locked backup safe keys',
            technicalTerm: 'DPAPI CryptUnprotectData decryption of stored vCenter and ESXi root passwords',
            tone: 'rose',
          },
          {
            storyTerm: 'Stairwell leading straight to the basement racks',
            technicalTerm: 'Lateral SSH pivot directly onto VMware ESXi hypervisor management interfaces',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation recording command lines) for chisel.exe reverse proxy launches or sqlcmd.exe querying [VeeamBackup].[dbo].[Credentials] paired with unexpected DPAPI CryptUnprotectData calls on the Veeam backup server (catching hypervisor credential theft).',
      },
      3: {
        storyAnalogy:
          'Descending into the basement hypervisor hall with stolen master keys, the intruder flips the hard power breakers on every running virtual office so their disk bolts release, then unleashes a fast Rust padlocking machine that encrypts entire virtual servers in minutes.',
        storyMappings: [
          {
            storyTerm: 'Flipping hard power breakers on running virtual offices',
            technicalTerm: 'Shell loop invoking esxcli vm process list and esxcli vm process kill --type=force',
            tone: 'amber',
          },
          {
            storyTerm: 'Releasing heavy disk bolts',
            technicalTerm: 'Releasing exclusive hypervisor locks held on *-flat.vmdk virtual disk files',
            tone: 'sky',
          },
          {
            storyTerm: 'Fast Rust padlocking machine',
            technicalTerm: 'Linux ELF Rust-compiled Akira ESXi encryptor launched from /tmp',
            tone: 'rose',
          },
          {
            storyTerm: 'Basement audit logs recording the shutdowns',
            technicalTerm: 'ESXi /var/log/shell.log and /var/log/hostd.log forwarded off-host to SIEM',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Forward ESXi /var/log/shell.log and /var/log/hostd.log off-host to a central SIEM (preserving hypervisor audit records before local wipe) and alert immediately on esxcli vm process kill bursts paired with unsigned ELF binaries executing from /tmp.',
      },
    },
  },

  'play-ransomware-grixba-vss-copy': {
    briefing: {
      storyAnalogy:
        'Imagine a disciplined burglary crew that arrives in three quiet waves. First, they send a custom mechanical scout tucked inside a music closet to map every guard station and storage room; next, they use a custom instant-camera lens to photocopy bolted-down database ledgers without waking normal backup clerks; finally, they push a nimble lock-crew across every floor that snaps a padlock on alternating pages of every large filing cabinet so the whole building freezes at lightning speed.',
      storyMappings: [
        {
          storyTerm: 'Custom mechanical scout tucked inside a music closet',
          technicalTerm: 'Grixba .NET reconnaissance scanner (C:\\Users\\Public\\Music\\inf_g.exe)',
          tone: 'amber',
        },
        {
          storyTerm: 'Custom instant-camera lens photocopying bolted ledgers',
          technicalTerm: 'AlphaVSS.x64.dll and AlphaFS.dll mounting Volume Shadow Copies directly via COM',
          tone: 'sky',
        },
        {
          storyTerm: 'Bypassing lobby camera tripwires before locking cabinets',
          technicalTerm: 'PEB dynamic API resolution and userland API unhooking inside Play encryptor',
          tone: 'rose',
        },
        {
          storyTerm: 'Padlocking alternating pages across every cabinet at lightning speed',
          technicalTerm: 'Intermittent 0x100000-byte stride encryption appending .play and 0xdeadbeef footer',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Dropping a self-contained scouting robot into a public media folder, the crew maps every connected computer, active guard software, and backup server across the campus in a single clean sweep.',
        storyMappings: [
          {
            storyTerm: 'Self-contained scouting robot in a public media folder',
            technicalTerm: 'Unsigned .NET Costura-packed Grixba scanner staged at C:\\Users\\Public\\Music\\inf_g.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Full-sweep scouting orders',
            technicalTerm: 'Command-line flags -m:all or -m:s instructing full domain and AV enumeration',
            tone: 'sky',
          },
          {
            storyTerm: 'Mapped guard stations and backup vaults',
            technicalTerm: 'Exported CSV inventory of endpoints, AV products, and Veeam/backup servers',
            tone: 'rose',
          },
          {
            storyTerm: 'Bundled spare parts hidden inside one shell',
            technicalTerm: 'Costura.Fody embedded .NET assemblies loaded directly from memory',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 1 (Process Creation) and EventID 7 (Image Loaded tracking DLL assemblies) flagging unsigned .NET binaries executing from C:\\Users\\Public\\Music\\ that load embedded Costura assemblies with -m:all or -m:s discovery flags (catching Play Grixba reconnaissance).',
      },
      2: {
        storyAnalogy:
          'Because live corporate databases stay clamped shut while clerks are working, the crew slips a pair of specialized shadow-camera helper lenses into their own toolkit to lift clean copies of locked password ledgers and accounting books without calling the noisy standard shadow-copy tool.',
        storyMappings: [
          {
            storyTerm: 'Pair of specialized shadow-camera helper lenses',
            technicalTerm: 'AlphaVSS.x64.dll (shadow copy COM wrapper) and AlphaFS.dll (long-path volume I/O)',
            tone: 'amber',
          },
          {
            storyTerm: 'Clamped-shut corporate ledgers',
            technicalTerm: 'Exclusively locked C:\\Windows\\NTDS\\ntds.dit and live SQL Server .mdf databases',
            tone: 'sky',
          },
          {
            storyTerm: 'Skipping the noisy standard shadow-copy tool',
            technicalTerm: 'Direct IVssBackupComponents COM invocation bypassing vssadmin.exe CLI alerts',
            tone: 'rose',
          },
          {
            storyTerm: 'Quiet extraction before extortion',
            technicalTerm: 'Staged database theft fueling Play double-extortion pressure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 7 (Image Loaded recording every DLL mapped into memory) for AlphaVSS.x64.dll or AlphaFS.dll alongside Windows VSSEvent operational logs flagging non-backup binaries invoking IVssBackupComponents (exposing covert locked-file theft).',
      },
      3: {
        storyAnalogy:
          'Broadcast across every floor via the building master policy board, the Play lock-crew wipes off the security monitors inspection tape from its own tools and races through every filing cabinet locking alternating one-megabyte blocks so massive archives become unusable in mere seconds.',
        storyMappings: [
          {
            storyTerm: 'Master policy board broadcasting across every floor',
            technicalTerm: 'Active Directory Group Policy Object (GPO) pushing Play ransomware domain-wide',
            tone: 'amber',
          },
          {
            storyTerm: 'Wiping security inspection tape off its own tools',
            technicalTerm: 'Dynamic PEB API resolution and userland EDR hook removal',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking alternating one-megabyte blocks at high speed',
            technicalTerm: 'Intermittent 0x100000-byte stride encryption maximizing corruption velocity',
            tone: 'rose',
          },
          {
            storyTerm: 'Calling card stamped at the bottom of every file',
            technicalTerm: '.play filename extension paired with an embedded 0xdeadbeef file footer marker',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy filesystem minifilter behavioral monitors (kernel-level disk I/O sensors that inspect write patterns in real time) to detect rapid 0x100000-byte stride partial file overwrites, .play extension renames, and trailing 0xdeadbeef file footers.',
      },
    },
  },

  'rhysida-ransomware-zerologon-ps-silentskill': {
    briefing: {
      storyAnalogy:
        'Imagine an organized heist crew preparing a museum takeover in three calculated phases. First, they prop open a hidden basement bulkhead door and punch a custom hole through the museum security fence; next, they run an automated checklist script that unplugs over two hundred guard stations and cameras while propping the remote-entry latch open; finally, they roll a multi-lane mechanical padlocking press down every gallery and hang a bright red warning poster over every wall display.',
      storyMappings: [
        {
          storyTerm: 'Hidden bulkhead door punching a hole through the security fence',
          technicalTerm: 'PortStarter Golang backdoor adding Windows Firewall allow rules via netsh.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Automated script unplugging two hundred guard stations and cameras',
          technicalTerm: 'SilentKill PowerShell script (g.ps1) unhooking AMSI, killing 200+ services, and enabling RestrictedAdmin',
          tone: 'sky',
        },
        {
          storyTerm: 'Multi-lane mechanical padlocking press rolled across every gallery',
          technicalTerm: 'psexec.exe -d -s deploying MinGW rhysida.exe with LibTomCrypt AES-256-CTR encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Bright red warning poster hung over every wall display',
          technicalTerm: 'Desktop wallpaper replacement, .rhysida extensions, and CriticalBreachDetected.pdf',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after slipping inside the perimeter, the crew hides a compact custom courier engine inside a shared utility closet and commands the building own firewall guard to cut a fresh permanent doorway for incoming traffic.',
        storyMappings: [
          {
            storyTerm: 'Compact custom courier engine in a utility closet',
            technicalTerm: 'PortStarter custom Golang backdoor staged under C:\\ProgramData',
            tone: 'amber',
          },
          {
            storyTerm: 'Commanding the firewall guard to cut a fresh doorway',
            technicalTerm: 'netsh.exe advfirewall firewall add rule opening attacker listening ports',
            tone: 'sky',
          },
          {
            storyTerm: 'Building perimeter fence audit log',
            technicalTerm: 'Windows Firewall EventID 2004 logging unauthorized rule additions',
            tone: 'rose',
          },
          {
            storyTerm: 'Cross-crew shared burglary tool',
            technicalTerm: 'Shared PortStarter backdoor infrastructure linking Rhysida and Vice Society',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation) when unsigned Golang binaries in C:\\ProgramData spawn netsh.exe advfirewall firewall add rule alongside Windows Firewall Operational EventID 2004 (which records every newly inserted host firewall allow rule).',
      },
      2: {
        storyAnalogy:
          'Before locking a single vault, the crew fires a sweeping silence script that first blinds the script-inspection window, switches off more than two hundred database and backup services so every file lock releases, and alters a security bolt so stolen badge hashes work straight at remote desks.',
        storyMappings: [
          {
            storyTerm: 'Blinding the script-inspection window first',
            technicalTerm: 'SilentKill (g.ps1) patching AMSI in memory before executing payload commands',
            tone: 'amber',
          },
          {
            storyTerm: 'Switching off two hundred database and backup services',
            technicalTerm: 'PowerShell service-termination loops stopping SQL, backup, and AV services',
            tone: 'sky',
          },
          {
            storyTerm: 'Altering the security bolt for stolen badge hashes',
            technicalTerm: 'Registry write modifying HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\DisableRestrictedAdmin',
            tone: 'rose',
          },
          {
            storyTerm: 'Verbatim transcript caught by script cameras',
            technicalTerm: 'PowerShell Operational EventID 4104 capturing SilentKill deobfuscated commands',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor PowerShell EventID 4104 (ScriptBlock Logging recording full runtime script contents) for SilentKill mass service-termination loops correlated with Sysmon EventID 13 (RegistryValueSet) modifications to Lsa\\DisableRestrictedAdmin (enabling Pass-the-Hash RDP).',
      },
      3: {
        storyAnalogy:
          'Pushing their heavy padlocking press down every hallway simultaneously via the remote-service tool, the crew runs parallel locking gears across every office cabinet, stamps a bright ransom notice onto every screen, and drops printed extortion booklets in every folder.',
        storyMappings: [
          {
            storyTerm: 'Pushing the padlocking press down every hallway',
            technicalTerm: 'Domain-wide execution via psexec.exe -d -s launching 64-bit MinGW rhysida.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Parallel locking gears sealing every cabinet',
            technicalTerm: 'Multi-threaded statically linked LibTomCrypt AES-256-CTR file encryption',
            tone: 'sky',
          },
          {
            storyTerm: 'Bright ransom notice stamped on every screen',
            technicalTerm: 'Forced desktop wallpaper lock paired with .rhysida file extensions',
            tone: 'rose',
          },
          {
            storyTerm: 'Printed extortion booklets dropped in every folder',
            technicalTerm: 'CriticalBreachDetected.pdf ransom demand files generated across directories',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy YARA memory and file signatures matching statically linked LibTomCrypt constants inside MinGW-compiled PE binaries (identifying Rhysida encryptors even when repacked) paired with EDR alerts on CriticalBreachDetected.pdf and rapid .rhysida renames.',
      },
    },
  },

  'bianlian-extortion-go-backdoor-rdp': {
    briefing: {
      storyAnalogy:
        'Imagine a slick extortion crew that decides padlocking a building is too loud and attracts every fire alarm on the block. Instead, they craft a custom one-of-a-kind secret radio tailored for that single victim, split that single radio line into dozens of parallel whispering corridors to map every shared file room, and quietly truck out every confidential blueprint in disguised moving vans so they can threaten public exposure without ever breaking a single lock.',
      storyMappings: [
        {
          storyTerm: 'Custom one-of-a-kind secret radio tailored for one victim',
          technicalTerm: 'Per-victim compiled Golang mTLS backdoor with hardcoded X.509 certificate pinning',
          tone: 'amber',
        },
        {
          storyTerm: 'Splitting one radio line into dozens of parallel whispering corridors',
          technicalTerm: 'In-memory hashicorp/yamux multiplexing paired with armon/go-socks5 lateral proxy',
          tone: 'sky',
        },
        {
          storyTerm: 'Mapping every shared file room silently',
          technicalTerm: 'SharpShares enumerating accessible SMB shares across internal servers',
          tone: 'rose',
        },
        {
          storyTerm: 'Trucking out blueprints without breaking a single lock',
          technicalTerm: 'Pure data-exfiltration extortion via renamed rclone.exe (Win.exe) and FTP with zero encryption',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Documented in joint CISA, FBI, and ASD Advisory AA23-136A alongside Red Canary and Avast research, BianLian shifted by 2023 and 2024 to a pure data-exfiltration extortion model (stealing sensitive records to threaten public release while skipping file encryption completely to bypass anti-ransomware sensors). After breaching a network via RDP or edge flaws, BianLian drops a per-victim Golang backdoor using mutual TLS (mTLS) multiplexed with hashicorp/yamux and an embedded armon/go-socks5 proxy, maps shares with SharpShares, and exfiltrates archives to Mega.io or FTP via a renamed rclone.exe (Win.exe).',
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after crossing the perimeter, the crew drops a bespoke compact radio built specifically for this single victim that refuses to speak to anyone except one hardcoded wax-sealed command tower, preventing security analysts from impersonating or hijacking the line.',
        storyMappings: [
          {
            storyTerm: 'Bespoke compact radio compiled per victim',
            technicalTerm: 'Uniquely compiled 64-bit Golang backdoor masquerading in C:\\Windows\\Temp or ProgramData',
            tone: 'amber',
          },
          {
            storyTerm: 'Refusing to speak except to one hardcoded wax-sealed tower',
            technicalTerm: 'Mutual TLS (mTLS) authentication with hardcoded X.509 client and server pinning',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinct internal radio parts stamped inside',
            technicalTerm: 'Embedded Go package symbols main.backconnect, hashicorp/yamux, and armon/go-socks5',
            tone: 'rose',
          },
          {
            storyTerm: 'Sensor catching the unsigned newcomer',
            technicalTerm: 'Sysmon EventID 1 and EventID 3 flagging unsigned Go binaries making external TLS calls',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 1 (Process Creation) and EventID 3 (Network Connection) to identify unsigned Golang executables in C:\\Windows\\Temp or C:\\ProgramData containing Go symbols main.backconnect, hashicorp/yamux, and armon/go-socks5 (unmistakable BianLian backdoor indicators).',
      },
      2: {
        storyAnalogy:
          'Over that single quiet encrypted radio line, the backdoor splits open dozens of virtual internal hallway lanes at once, allowing remote operators to probe internal file rooms and directory cabinets as if sitting directly inside the corporate office.',
        storyMappings: [
          {
            storyTerm: 'Splitting one radio line into dozens of hallway lanes',
            technicalTerm: 'HashiCorp Yamux stream multiplexing layered inside the mTLS connection',
            tone: 'amber',
          },
          {
            storyTerm: 'Internal doorway relay into corporate rooms',
            technicalTerm: 'Embedded armon/go-socks5 proxy forwarding operator traffic into the internal LAN',
            tone: 'sky',
          },
          {
            storyTerm: 'Probing internal file rooms and directory cabinets',
            technicalTerm: 'Rapid internal SMB (TCP/445) and LDAP (TCP/389) fan-out from one compromised host',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero extra proxy tools dropped on disk',
            technicalTerm: 'All-in-one memory-resident proxy evading standalone Chisel/ngrok detections',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor NDR and EDR network telemetry (which correlates internal east-west bursts with external sessions) for a single non-Domain-Controller host initiating rapid fan-out SMB (port 445) and LDAP (port 389) connections while holding a long-lived external TLS tunnel.',
      },
      3: {
        storyAnalogy:
          'Leaving every filing cabinet unlocked so anti-lockdown alarms stay completely silent, the crew renames a standard cloud-sync moving van to blend into Windows utilities, hauls out gigabytes of corporate records, and leaves behind an extortion threat demanding payment to prevent public leaks.',
        storyMappings: [
          {
            storyTerm: 'Leaving every cabinet unlocked to keep lockdown alarms silent',
            technicalTerm: 'Zero file encryption bypassing behavioral ransomware rollback and entropy detectors',
            tone: 'amber',
          },
          {
            storyTerm: 'Renamed cloud-sync moving van',
            technicalTerm: 'rclone.exe renamed to Win.exe syncing staged shares to Mega.io or FTP servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Inventorying valuable corporate rooms first',
            technicalTerm: 'SharpShares mapping readable finance, legal, and HR SMB network shares',
            tone: 'rose',
          },
          {
            storyTerm: 'Extortion threat without encryption',
            technicalTerm: 'Pure data-theft ransom demand backed by threat of public leak-site publication',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'hermeticwiper-ukraine-easeus-mbr-wipe': {
    briefing: {
      storyAnalogy:
        'Imagine a wartime saboteur who is not after ransom money at all, but wants every computer in an organization turned into a permanent brick before sunrise. First, the saboteur unpacks an authentic, validly signed disk-partitioning guard badge from its own coat pocket to gain direct physical access to the raw floor tiles; next, it disables every backup and crash log while shattering the building index directory; finally, it smashes the front entrance map of every hard drive with pure random static so no floor can ever start up again.',
      storyMappings: [
        {
          storyTerm: 'Unpacking a validly signed disk-partitioning badge from its pocket',
          technicalTerm: 'Extracting signed EaseUS empntdrv.sys driver from PE RCDATA resource (BYOVD)',
          tone: 'amber',
        },
        {
          storyTerm: 'Disabling backups and shattering the building index directory',
          technicalTerm: 'Stopping Volume Shadow Copy (vss) and fragmenting NTFS $MFT and metadata files',
          tone: 'sky',
        },
        {
          storyTerm: 'Smashing every drive entrance map with pure random static',
          technicalTerm: 'Overwriting \\\\.\\PhysicalDrive0..100 MBR and NTFS $MFT with CSPRNG bytes',
          tone: 'rose',
        },
        {
          storyTerm: 'Turning every machine into a permanent brick before sunrise',
          technicalTerm: 'Destructive Sandworm wiper attack forcing unbootable system reboot',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Pushed simultaneously across hundreds of offices by the central policy board, the saboteur unlocks special driver-loading clearance, pulls an authentic signed disk-utility driver out of its own hidden pocket, and bolts it straight into the building core engine.',
        storyMappings: [
          {
            storyTerm: 'Unlocking special driver-loading clearance',
            technicalTerm: 'Enabling SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Pulling an authentic disk-utility driver from its hidden pocket',
            technicalTerm: 'Decompressing embedded signed EaseUS empntdrv.sys from PE RCDATA resource',
            tone: 'sky',
          },
          {
            storyTerm: 'Bolting it into the building core engine',
            technicalTerm: 'Registering C:\\Windows\\System32\\drivers\\??dr.sys signed by CHENGDU YIWO Tech',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing modern storage locks',
            technicalTerm: 'Gaining unrestricted Ring-0 raw physical disk write capability via BYOVD',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 6 (DriverLoaded tracking kernel driver signatures and file paths) for empntdrv.sys or randomized C:\\Windows\\System32\\drivers\\??dr.sys binaries signed by CHENGDU YIWO Tech Development Co., Ltd. (the exact EaseUS driver abused by HermeticWiper).',
      },
      2: {
        storyAnalogy:
          'Before swinging the sledgehammer, the saboteur pulls the power plugs on the building automatic backup vault and crash-diary recorder, then deliberately shatters the floor index catalog into thousands of broken fragments so recovery teams cannot piece files back together.',
        storyMappings: [
          {
            storyTerm: 'Pulling power plugs on the backup vault and crash recorder',
            technicalTerm: 'ChangeServiceConfigW and ControlService disabling Volume Shadow Copy (vss) and crash dumps',
            tone: 'amber',
          },
          {
            storyTerm: 'Shattering the floor index catalog into fragments',
            technicalTerm: 'Fragmenting NTFS metadata structures ($Bitmap, $LogFile, $MFT) across disks',
            tone: 'sky',
          },
          {
            storyTerm: 'Preventing forensic recovery teams from rebuilding files',
            technicalTerm: 'Destroying filesystem allocation maps prior to raw sector wiping',
            tone: 'rose',
          },
          {
            storyTerm: 'Covering every internal storage room',
            technicalTerm: 'Targeting all attached local and mounted Windows NTFS volumes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Walking methodically from storage bay zero up to bay one hundred, the saboteur uses its raw disk pass to blast every drive opening directory and master file catalog with irreversible random noise, then flips the building power breaker so no machine ever boots again.',
        storyMappings: [
          {
            storyTerm: 'Walking from storage bay zero up to bay one hundred',
            technicalTerm: 'Iterating handles across \\\\.\\PhysicalDrive0 through \\\\.\\PhysicalDrive100',
            tone: 'amber',
          },
          {
            storyTerm: 'Blasting opening directories with irreversible random noise',
            technicalTerm: 'CryptGenRandom CSPRNG bytes overwriting MBR sector 0 and NTFS $MFT',
            tone: 'sky',
          },
          {
            storyTerm: 'Flipping the building power breaker',
            technicalTerm: 'Forced InitiateSystemShutdownEx locking victims out of unbootable hosts',
            tone: 'rose',
          },
          {
            storyTerm: 'Pre-emptive shield blocking raw disk strikes',
            technicalTerm: 'WDAC driver blocklist for empntdrv.sys and EDR blocking raw WriteFile to sector 0',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Block empntdrv.sys via Windows Defender Application Control (WDAC kernel driver allowlisting) and enforce EDR kernel disk filters blocking unauthorized raw WriteFile operations targeting sector 0 of \\\\.\\PhysicalDrive* (stopping MBR destruction mid-flight).',
      },
    },
  },

  'acidrain-viasat-ka-sat-modem-wiper': {
    briefing: {
      storyAnalogy:
        'Imagine a satellite television control hub wired to tens of thousands of rooftop receiver boxes across an entire continent. Breaking into the trusted central management deck, a saboteur pushes one tiny remote-maintenance package down to every rooftop dish simultaneously; inside each box, the package first sweeps all ordinary storage cards and then fires raw hardware erase bolts directly into the soldered memory chips themselves, permanently silencing tens of thousands of satellite modems in one stroke.',
      storyMappings: [
        {
          storyTerm: 'Central management deck pushing one maintenance package to every dish',
          technicalTerm: 'Management plane compromise and mass TR-069 CWMP push of MIPS ELF wiper (ukrop)',
          tone: 'amber',
        },
        {
          storyTerm: 'Sweeping all ordinary storage cards sequentially',
          technicalTerm: 'Recursive overwrite of /dev/sda, /dev/mmcblk, and non-essential filesystem directories',
          tone: 'sky',
        },
        {
          storyTerm: 'Firing raw hardware erase bolts into soldered memory chips',
          technicalTerm: 'Raw SPI flash /dev/mtd0..99 destruction via MEMUNLOCK, MEMERASE, and MEMWRITEOOB',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanently silencing tens of thousands of satellite modems',
          technicalTerm: 'Irrecoverable bricking of Viasat KA-SAT consumer and wind-turbine terminals',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping past a misconfigured perimeter gate into the satellite ground-station master control room, the saboteur hijacks the official remote-update broadcaster and beams a tiny specialized demolition program simultaneously into tens of thousands of distant rooftop modems.',
        storyMappings: [
          {
            storyTerm: 'Satellite ground-station master control room',
            technicalTerm: 'Trusted management segment of the Viasat KA-SAT satellite network',
            tone: 'amber',
          },
          {
            storyTerm: 'Official remote-update broadcaster',
            technicalTerm: 'TR-069 CPE WAN Management Protocol (CWMP) pushing mass firmware commands',
            tone: 'sky',
          },
          {
            storyTerm: 'Tiny specialized demolition program',
            technicalTerm: 'Compact MIPS ELF AcidRain wiper binary (ukrop) staged into /tmp',
            tone: 'rose',
          },
          {
            storyTerm: 'Simultaneous fleet-wide arrival',
            technicalTerm: 'Mass execution across tens of thousands of SurfBeam 2 embedded Linux modems',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor SATCOM management-plane telemetry for sudden mass TR-069 Download or firmware execution broadcasts (which deviate sharply from staged maintenance waves) paired with embedded host alerts for unsigned ELF binaries executing out of /tmp.',
      },
      2: {
        storyAnalogy:
          'Waking up inside each modem with master system authority, the demolition program forks quietly into the background and sweeps across every attached storage partition and memory card, scrubbing every directory clean before turning to the raw hardware chips.',
        storyMappings: [
          {
            storyTerm: 'Forking quietly into the background with master authority',
            technicalTerm: 'AcidRain daemonizing as root (UID 0) on the embedded Linux modem OS',
            tone: 'amber',
          },
          {
            storyTerm: 'Sweeping every attached storage partition and memory card',
            technicalTerm: 'Iterative overwrite across /dev/sda*, /dev/mmcblk*, and non-essential directories',
            tone: 'sky',
          },
          {
            storyTerm: 'Writing straight over raw block devices',
            technicalTerm: 'Opening /dev/mtdblock* and /dev/mmcblk* with O_WRONLY / O_RDWR flags',
            tone: 'rose',
          },
          {
            storyTerm: 'Embedded system watchman catching the wipe',
            technicalTerm: 'Syscall auditing alerting on raw block-device writes outside firmware upgraders',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable embedded Linux syscall auditing (monitoring low-level kernel open and write calls) alerting whenever processes other than signed firmware upgrade daemons open /dev/mtdblock* or /dev/mmcblk* with O_WRONLY or O_RDWR write flags.',
      },
      3: {
        storyAnalogy:
          'Finally, the wiper speaks straight to the modem raw soldered flash chips from slot zero through ninety-nine, reading each chip physical geometry, flipping off hardware write-locks, and issuing direct chip-erase pulses so the modem cannot even read its own startup instructions after reboot.',
        storyMappings: [
          {
            storyTerm: 'Raw soldered flash chips from slot zero through ninety-nine',
            technicalTerm: 'Character-mode Memory Technology Devices /dev/mtd0 through /dev/mtd99',
            tone: 'amber',
          },
          {
            storyTerm: 'Reading physical geometry and flipping off hardware locks',
            technicalTerm: 'Linux MTD ioctl calls MEMGETINFO followed by MEMUNLOCK',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct chip-erase pulses destroying startup instructions',
            technicalTerm: 'Raw hardware flash erasure via MEMERASE and MEMWRITEOOB ioctls',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanently silenced hardware requiring physical replacement',
            technicalTerm: 'Unbootable bricked modems requiring hardware swap across European deployments',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'caddywiper-arguepatch-gpo-destruction': {
    briefing: {
      storyAnalogy:
        'Imagine a cunning saboteur operating inside a company headquarters who deliberately spares the central dispatch tower itself so the tower stays alive long enough to broadcast destruction orders to every branch office. Using a disguised repair-tool wrapper pushed from the central policy board, the wiper checks whether each machine is the dispatch tower first; on every regular office computer, it seizes ownership of every user drawer, scrubs every document to blank zeros, and erases the floor plan of every hard drive.',
      storyMappings: [
        {
          storyTerm: 'Disguised repair-tool wrapper pushed from the central policy board',
          technicalTerm: 'Active Directory GPO pushing ArguePatch patched IDA debugger loader from SYSVOL',
          tone: 'amber',
        },
        {
          storyTerm: 'Checking whether each machine is the dispatch tower so it stays alive',
          technicalTerm: 'DsRoleGetPrimaryDomainInformation check sparing Primary Domain Controllers',
          tone: 'sky',
        },
        {
          storyTerm: 'Seizing ownership of every drawer and scrubbing documents to blank zeros',
          technicalTerm: 'SeTakeOwnershipPrivilege recursive C:\\Users file zeroing via SetNamedSecurityInfoA',
          tone: 'rose',
        },
        {
          storyTerm: 'Erasing the floor plan of every hard drive',
          technicalTerm: 'Raw partition table wipe via IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing inside the central dispatch tower, the saboteur takes a genuinely known software debugger, surgically splices a hidden trigger into its opening routine, and pushes it out across the entire company through the official morning policy board.',
        storyMappings: [
          {
            storyTerm: 'Central dispatch tower policy board',
            technicalTerm: 'Compromised Domain Controller SYSVOL share and Group Policy Object (GPO) push',
            tone: 'amber',
          },
          {
            storyTerm: 'Surgically altered known software debugger',
            technicalTerm: 'ArguePatch trojanized legitimate IDA Pro debugger binary (win32_remote.exe)',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden trigger spliced into the opening routine',
            technicalTerm: 'Patched entry point decrypting and launching the CaddyWiper shellcode payload',
            tone: 'rose',
          },
          {
            storyTerm: 'Company-wide synchronized deployment',
            technicalTerm: 'Scheduled task created across all domain-joined workstations and member servers',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Assembling its own command labels secretly piece by piece so casual code scanners read nothing suspicious, the wiper very first action is checking the room nameplate: if it realizes it is standing inside the central dispatch tower, it immediately steps back so the tower stays online to keep wrecking every other room.',
        storyMappings: [
          {
            storyTerm: 'Assembling command labels piece by piece in private',
            technicalTerm: 'Stack-constructed API strings hiding imports from the PE Import Address Table (IAT)',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking the room nameplate first',
            technicalTerm: 'Calling DsRoleGetPrimaryDomainInformation to inspect machine domain role',
            tone: 'sky',
          },
          {
            storyTerm: 'Stepping back when standing inside the central dispatch tower',
            technicalTerm: 'Exiting immediately if role equals DsRole_RolePrimaryDomainController',
            tone: 'rose',
          },
          {
            storyTerm: 'Keeping the dispatch tower alive to spread destruction',
            technicalTerm: 'Preserving Active Directory GPO replication while wiping all member endpoints',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert via behavioral sandboxes and EDR memory scanners detecting stack-constructed API strings for DsRoleGetPrimaryDomainInformation, SeTakeOwnershipPrivilege, and PhysicalDrive inside trojanized binaries such as win32_remote.exe (catching CaddyWiper pre-wipe staging).',
      },
      3: {
        storyAnalogy:
          'On every ordinary workstation and branch server, the wiper claims legal ownership of every locked desk drawer, overwrites every personal file with blank zeros from top to bottom, and sends a single raw control blast that erases the master partition blueprint of every attached hard drive.',
        storyMappings: [
          {
            storyTerm: 'Claiming legal ownership of every locked desk drawer',
            technicalTerm: 'Enabling SeTakeOwnershipPrivilege and calling SetNamedSecurityInfoA across C:\\Users',
            tone: 'amber',
          },
          {
            storyTerm: 'Overwriting every file with blank zeros',
            technicalTerm: 'Recursive zero-byte file destruction across local folders and mapped network drives',
            tone: 'sky',
          },
          {
            storyTerm: 'Single raw control blast erasing the drive blueprint',
            technicalTerm: 'DeviceIoControl IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) wiping partition tables',
            tone: 'rose',
          },
          {
            storyTerm: 'Kernel shield blocking drive layout wipes',
            technicalTerm: 'EDR kernel disk filter blocking zeroed IOCTL_DISK_SET_DRIVE_LAYOUT_EX calls',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure EDR kernel disk filters to block IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054, the raw disk control code that overwrites partition tables) when passed zeroed partition entries, paired with behavioral alerts on rapid SetNamedSecurityInfoA ownership sweeps across C:\\Users.',
      },
    },
  },

  'dfir-evtx-log-clearing-wevtutil-eid1102-104': {
    briefing: {
      storyAnalogy:
        'Imagine a burglar who breaks into a bank security booth right before leaving and rips out every single page from every logbook on the shelf. Unbeknownst to the burglar, the moment the security logbook is ripped empty, an automatic brass stamper permanently embosses a fresh Page One declaring exactly who emptied the book and at what second, while the building master floor-tile register still keeps carbon impressions of every ripped page underneath.',
      storyMappings: [
        {
          storyTerm: 'Ripping out every single page from every logbook on the shelf',
          technicalTerm: 'wevtutil.exe el loop executing wevtutil.exe cl across all Windows EVTX channels',
          tone: 'amber',
        },
        {
          storyTerm: 'Automatic brass stamper embossing a fresh Page One receipt',
          technicalTerm: 'Immutable Security EventID 1102 and System EventID 104 audit log cleared records',
          tone: 'sky',
        },
        {
          storyTerm: 'Building master floor-tile register logging the destruction',
          technicalTerm: 'NTFS Change Journal ($Extend\\$UsnJrnl:$J) recording USN_REASON_DATA_TRUNCATION',
          tone: 'rose',
        },
        {
          storyTerm: 'Carbon impressions recovered from beneath the floor tiles',
          technicalTerm: 'Carving deleted EVTX XML chunks from unallocated disk clusters during forensics',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Trying to cover their tracks right before slipping out the door, the intruder runs an automated sweeper that lists every single diary binder on the building shelf and commands the event clerk to wipe them clean one by one.',
        storyMappings: [
          {
            storyTerm: 'Automated sweeper listing every diary binder',
            technicalTerm: 'cmd.exe /c for /F %i in (wevtutil.exe el) do wevtutil.exe cl %i',
            tone: 'amber',
          },
          {
            storyTerm: 'Commanding the event clerk to wipe each binder',
            technicalTerm: 'Native Windows utility wevtutil.exe cl invoking EvtClearLog across channels',
            tone: 'sky',
          },
          {
            storyTerm: 'Security camera catching the sweeper command line',
            technicalTerm: 'Sysmon EventID 1 (Process Creation) recording the exact wevtutil loop before clear',
            tone: 'rose',
          },
          {
            storyTerm: 'Anti-forensic trace erasure attempt',
            technicalTerm: 'MITRE ATT&CK T1070.001 indicator removal on Windows hosts',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The instant the event clerk empties the master Security binder or System binder, the operating system refuses to leave the binder truly blank and immediately stamps a single unforgeable first entry naming the exact badge holder and timestamp of the erasure.',
        storyMappings: [
          {
            storyTerm: 'Event clerk emptying the binder files',
            technicalTerm: 'svchost.exe (-s EventLog) calling EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\',
            tone: 'amber',
          },
          {
            storyTerm: 'Unforgeable Page One stamp in the Security binder',
            technicalTerm: 'Windows Security EventID 1102 (The audit log was cleared) naming SubjectUserName',
            tone: 'sky',
          },
          {
            storyTerm: 'Unforgeable Page One stamp in the System binder',
            technicalTerm: 'Windows System EventID 104 (The log file was cleared) naming the cleared channel',
            tone: 'rose',
          },
          {
            storyTerm: 'Central SIEM vault keeping copies untouched',
            technicalTerm: 'Real-time log forwarding preserving pre-clear logs off the compromised host',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even after the binders appear empty on the desk, a skilled forensic investigator checks the building automatic paper-movement ledger showing the exact truncation event and gently lifts intact torn log scraps straight out of the unallocated storage bin underneath.',
        storyMappings: [
          {
            storyTerm: 'Automatic paper-movement ledger',
            technicalTerm: 'NTFS Change Journal ($Extend\\$UsnJrnl:$J) logging USN_REASON_DATA_TRUNCATION',
            tone: 'amber',
          },
          {
            storyTerm: 'Intact torn log scraps in the storage bin underneath',
            technicalTerm: 'Deleted 64KB ElfChnk EVTX chunks still residing in unallocated NTFS disk space',
            tone: 'sky',
          },
          {
            storyTerm: 'Gently lifting and reassembling the scraps',
            technicalTerm: 'Raw disk carving tools recovering cleared binary XML event records',
            tone: 'rose',
          },
          {
            storyTerm: 'Proving deliberate cover-up with exact timestamps',
            technicalTerm: 'Correlating $UsnJrnl timestamps against EventID 1102 and carved pre-wipe logs',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace': {
    briefing: {
      storyAnalogy:
        'Imagine a huge warehouse holding dozens of locked steel office pods stacked on one master concrete foundation. An intruder logs into the warehouse basement console with stolen superintendent keys, pulls the emergency power cord on every running office pod so their steel floor bolts spring open, and runs a high-speed partial padlocking tool across every pod shell while three separate basement logbooks quietly record every command, every shutdown, and every tampered descriptor.',
      storyMappings: [
        {
          storyTerm: 'Logging into the warehouse basement console with superintendent keys',
          technicalTerm: 'Root SSH login or DCUI ESXi Shell activation recorded in /var/log/auth.log and shell.log',
          tone: 'amber',
        },
        {
          storyTerm: 'Pulling the emergency power cord so steel floor bolts spring open',
          technicalTerm: 'esxcli vm process kill freeing exclusive vmx locks on *-flat.vmdk (logged in hostd.log)',
          tone: 'sky',
        },
        {
          storyTerm: 'Running a partial padlocking tool across every pod shell',
          technicalTerm: 'ELF encryptor from /tmp intermittently encrypting /vmfs/volumes/*/*/*.vmdk, .vmx, and .nvram',
          tone: 'rose',
        },
        {
          storyTerm: 'Rebuilding undamaged pod maps from partial locks',
          technicalTerm: 'CISA ESXiArgs flat-file descriptor reconstruction recovering unencrypted VMDK blocks',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Unlocking the basement management terminal as the chief superintendent, the intruder opens an interactive console session while the warehouse built-in authentication diary and command ticker silently record every single keystroke.',
        storyMappings: [
          {
            storyTerm: 'Basement management terminal',
            technicalTerm: 'VMware ESXi SSH daemon or DCUI/vCenter-enabled ESXi Shell',
            tone: 'amber',
          },
          {
            storyTerm: 'Chief superintendent key',
            technicalTerm: 'Root hypervisor account login logged in /var/log/auth.log',
            tone: 'sky',
          },
          {
            storyTerm: 'Command ticker recording every keystroke',
            technicalTerm: 'ESXi /var/log/shell.log auditing interactive CLI commands executed by root',
            tone: 'rose',
          },
          {
            storyTerm: 'Warning bell noting console activation',
            technicalTerm: '/var/log/vobd.log flagging SSH or ESXi Shell enablement events',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because every live office pod clamps down heavy locks on its own floor foundation while running, the intruder walks down the breaker panel flipping every pod off hard so every foundation slab pops unlocked simultaneously.',
        storyMappings: [
          {
            storyTerm: 'Live pods clamping locks on their floor foundations',
            technicalTerm: 'Running vmx hypervisor processes holding exclusive locks on *-flat.vmdk disks',
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping every pod breaker off hard',
            technicalTerm: 'Batch execution of esxcli vm process kill --type=force across active World IDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Breaker-panel audit book',
            technicalTerm: 'ESXi /var/log/hostd.log documenting abrupt power-off events for every guest VM',
            tone: 'rose',
          },
          {
            storyTerm: 'Unlocked foundation slabs ready for attack',
            technicalTerm: 'Released datastore file handles under /vmfs/volumes/',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Launching a portable padlocking press out of a temporary basement closet, the intruder races across the datastore locking slices of every virtual disk, configuration card, and memory file, leaving forensic responders to audit the footprint and check whether skipped disk slices allow recovery.',
        storyMappings: [
          {
            storyTerm: 'Portable padlocking press in a temporary closet',
            technicalTerm: 'Unsigned Linux ELF ransomware encryptor executed from /tmp/',
            tone: 'amber',
          },
          {
            storyTerm: 'Virtual disks, configuration cards, and memory files',
            technicalTerm: 'Target files matching /vmfs/volumes/*/*/*.vmdk, *.vmx, and *.nvram',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking slices intermittently for speed',
            technicalTerm: 'Intermittent block encryption corrupting VM files in seconds',
            tone: 'rose',
          },
          {
            storyTerm: 'Rebuilding intact blueprints from skipped slices',
            technicalTerm: 'CISA ESXiArgs forensic descriptor reconstruction restoring untouched *-flat.vmdk data',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'alphv-blackcat-sphynx-rust-impacket-exmatter': {
    briefing: {
      storyAnalogy:
        'Imagine a disciplined heist syndicate carrying three precision tools across a corporate campus. First, a silent courier sweeps high-value folders out to an external van and burns its own footprints behind it; next, the syndicate unlocks a locked briefcase using a unique job passcode, opens cross-room shortcut paths, and shreds every backup binder; finally, the briefcase automatically copies itself down every corridor and basement server rack to snap fast modern locks across both office desks and virtual servers at once.',
      storyMappings: [
        {
          storyTerm: 'Silent courier sweeping folders out and burning its footprints',
          technicalTerm: 'ExMatter .NET exfiltration tool staging data and self-erasing prior to encryption',
          tone: 'amber',
        },
        {
          storyTerm: 'Unlocking a briefcase with a unique job passcode and opening shortcuts',
          technicalTerm: 'Rust BlackCat/Sphynx -k <access_token>, fsutil R2R symlink enablement, and shadow wipe',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying itself automatically down every corridor and basement rack',
          technicalTerm: 'Embedded NetExec/Impacket --propagate PsExec worm and ESXi VM termination',
          tone: 'rose',
        },
        {
          storyTerm: 'Fast modern locks snapped across desks and virtual servers',
          technicalTerm: 'Cross-platform Rust AES-CTR and ChaCha20 encryption across Windows and ESXi',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Before locking a single door, the affiliate deploys a quiet file-gathering courier disguised as routine office paperwork that filters out junk, packs high-value contracts onto an external truck, and erases its own executable file when finished.',
        storyMappings: [
          {
            storyTerm: 'Quiet file-gathering courier disguised as routine paperwork',
            technicalTerm: 'Compiled .NET ExMatter utility enumerating high-value file extensions',
            tone: 'amber',
          },
          {
            storyTerm: 'Packing contracts onto an external truck',
            technicalTerm: 'Automated SFTP/WebDAV exfiltration to affiliate-controlled servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing its own footprints upon completion',
            technicalTerm: 'Self-deletion routine overwriting or removing the ExMatter binary post-theft',
            tone: 'rose',
          },
          {
            storyTerm: 'Double-extortion leverage secured first',
            technicalTerm: 'Stolen corporate data guaranteed before noisy encryption triggers alarms',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The operator unlocks the Rust padlocking briefcase by typing a secret job token on the command line (keeping the inner blueprint scrambled from curious analysts), flips a building shortcut switch so linked remote hallways stay reachable, and shreds every backup snapshot.',
        storyMappings: [
          {
            storyTerm: 'Secret job token unlocking the scrambled briefcase',
            technicalTerm: 'Mandatory -k <access_token> CLI key deriving the internal ChaCha20 config key',
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping a building shortcut switch for remote hallways',
            technicalTerm: 'fsutil behavior set SymlinkEvaluation R2L:1 R2R:1 enabling remote symlink traversal',
            tone: 'sky',
          },
          {
            storyTerm: 'Shredding every backup snapshot',
            technicalTerm: 'vssadmin / WMI Volume Shadow Copy deletion and event log clearing',
            tone: 'rose',
          },
          {
            storyTerm: 'Scrambling the blueprint against casual inspection',
            technicalTerm: 'Encrypted embedded JSON affiliate configuration protecting credentials and keys',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Armed with stolen master passes packed inside its own pocket, the briefcase marches itself down every office hallway and into the basement hypervisor room, halting running virtual servers and locking both Windows offices and Linux server pods simultaneously.',
        storyMappings: [
          {
            storyTerm: 'Marching itself down every office hallway',
            technicalTerm: 'Built-in --propagate routine using embedded Impacket/PsExec over SMB with harvested creds',
            tone: 'amber',
          },
          {
            storyTerm: 'Halting running virtual servers in the basement',
            technicalTerm: 'Automated ESXi esxcli vm process kill releasing virtual disk locks',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking both Windows offices and Linux pods simultaneously',
            technicalTerm: 'Multi-threaded Rust AES-CTR and ChaCha20 encryption across platforms',
            tone: 'rose',
          },
          {
            storyTerm: 'Hardware-accelerated locking speed',
            technicalTerm: 'Dynamic selection of AES-NI hardware cipher or ChaCha20 software fallback',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'royal-blacksuit-ransomware-chacha20-restartmanager': {
    briefing: {
      storyAnalogy:
        'Imagine a burglar crew that lures an office worker into calling a fake subscription-cancellation hotline so the worker willingly installs a remote-support doorway, threads a quiet reverse tunnel back to the crew hideout, uses the building own gentle maintenance-restart clerk to ask busy workers to let go of locked ledgers politely, and then locks an operator-chosen percentage of every file across the building at blistering speed.',
      storyMappings: [
        {
          storyTerm: 'Fake cancellation hotline tricking a worker into opening a remote doorway',
          technicalTerm: 'Callback phishing / BatLoader delivering commercial RMM and Chisel reverse tunnel',
          tone: 'amber',
        },
        {
          storyTerm: 'Building gentle maintenance-restart clerk releasing locked ledgers',
          technicalTerm: 'Windows Restart Manager API (RstrtMgr.dll) closing processes holding open file handles',
          tone: 'sky',
        },
        {
          storyTerm: 'Shredding backup recovery binders first',
          technicalTerm: 'vssadmin.exe Volume Shadow Copy deletion prior to encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Locking an operator-chosen percentage of every file across parallel lanes',
          technicalTerm: 'OpenSSL AES-256-CBC partial encryption controlled by -ep percentage over 2x-CPU IOCP threads',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending an alarming fake renewal invoice that begs the employee to call a help desk immediately, the crew talks the employee into installing a commercial remote-management intercom and opens a quiet reverse tunnel straight into the corporate lobby.',
        storyMappings: [
          {
            storyTerm: 'Alarming fake renewal invoice urging a phone call',
            technicalTerm: 'Subscription-cancellation callback phishing (TOAD) or trojanized BatLoader SEO lure',
            tone: 'amber',
          },
          {
            storyTerm: 'Commercial remote-management intercom',
            technicalTerm: 'Legitimate RMM tools (AnyDesk, Atera, ScreenConnect) abused for hands-on access',
            tone: 'sky',
          },
          {
            storyTerm: 'Quiet reverse tunnel back to the hideout',
            technicalTerm: 'Chisel encrypted SOCKS reverse tunnel traversing corporate egress firewalls',
            tone: 'rose',
          },
          {
            storyTerm: 'Blending with routine helpdesk work',
            technicalTerm: 'Signed commercial remote-control software evading basic malware blocklists',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When ready to strike, the crew destroys all backup snapshots and calls upon the building built-in software-update clerk to politely tap every open database and document editor on the shoulder, forcing them to drop their locks on open files so nothing escapes encryption.',
        storyMappings: [
          {
            storyTerm: 'Destroying all backup snapshots',
            technicalTerm: 'vssadmin.exe delete shadows wiping Windows recovery points',
            tone: 'amber',
          },
          {
            storyTerm: 'Building built-in software-update clerk',
            technicalTerm: 'Windows Restart Manager API (RstrtMgr.dll RmStartSession / RmShutdown)',
            tone: 'sky',
          },
          {
            storyTerm: 'Forcing open editors and databases to drop their file locks',
            technicalTerm: 'Graceful termination of processes holding exclusive handles on target files',
            tone: 'rose',
          },
          {
            storyTerm: 'Custom operator job switch',
            technicalTerm: 'Command-line flags royal.exe -id <32_char_id> -ep 50 configuring encryption depth',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Spinning up twice as many parallel locksmith lanes as the building has processor cores, the crew races across local cabinets and shared network hallways locking only the exact percentage of each large file requested by the operator, finishing the entire building before responders can pull the plug.',
        storyMappings: [
          {
            storyTerm: 'Twice as many parallel locksmith lanes as processor cores',
            technicalTerm: 'Multi-threaded I/O Completion Port (IOCP) worker queue sized at 2x CPU core count',
            tone: 'amber',
          },
          {
            storyTerm: 'Exact operator-chosen percentage of each large file',
            technicalTerm: 'Configurable -ep partial encryption mode speeding corruption of huge files',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in standard steel padlock library',
            technicalTerm: 'Statically linked OpenSSL AES-256-CBC routines wrapped with RSA public key',
            tone: 'rose',
          },
          {
            storyTerm: 'Sweeping across both local cabinets and shared hallways',
            technicalTerm: 'Simultaneous encryption of local drives and reachable SMB network shares',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'ransomhub-edrkiller-tdsskiller-golocks': {
    briefing: {
      storyAnalogy:
        'Imagine a nimble extortion crew that brings an authentic antivirus cleanup utility and a shape-shifting driver smuggler to knock out every security guard first, then slips a special asterisk-marked wake-up note onto the building emergency-repair startup clipboard so the building reboots into stripped-down maintenance mode where guards stay asleep, and finally requires a long secret passphrase before unpacking its fast modern locking gear.',
      storyMappings: [
        {
          storyTerm: 'Authentic cleanup utility and shape-shifting driver smuggler',
          technicalTerm: 'Signed Kaspersky TDSSKiller.exe (klbg.sys) and EDRKillShifter BYOVD loader',
          tone: 'amber',
        },
        {
          storyTerm: 'Asterisk-marked note waking up inside stripped-down maintenance mode',
          technicalTerm: 'Safe-Mode RunOnce persistence (*safemode) paired with bcdedit safeboot reboot',
          tone: 'sky',
        },
        {
          storyTerm: 'Requiring a long secret passphrase before unpacking locking gear',
          technicalTerm: 'Mandatory 64-character hex -pass <sha256_key> decrypting embedded configuration',
          tone: 'rose',
        },
        {
          storyTerm: 'Fast modern locking gear sealing every volume',
          technicalTerm: 'Curve25519 key exchange and XChaCha20 multi-platform encryption',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after entering the estate, the affiliate turns an authentic signed rootkit-removal utility or a shape-shifting vulnerable-driver wrapper against the building own security monitors, silencing every guard station before staging the encryptor.',
        storyMappings: [
          {
            storyTerm: 'Authentic signed rootkit-removal utility',
            technicalTerm: 'Legitimate Kaspersky TDSSKiller.exe loading signed klbg.sys to disable EDR services',
            tone: 'amber',
          },
          {
            storyTerm: 'Shape-shifting vulnerable-driver wrapper',
            technicalTerm: 'EDRKillShifter BYOVD loader unpacking vulnerable signed kernel drivers in memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Silencing every guard station before locking doors',
            technicalTerm: 'Kernel-level termination of EDR and antivirus sensors prior to encryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Initial perimeter entry',
            technicalTerm: 'Breach via exposed VPN appliances or ZeroLogon lateral compromise',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When instructed to strike in stripped-down emergency mode, the crew pins a special asterisk-prefixed work order onto the startup board and reboots the computer into Safe Mode, where normal security guards never wake up yet the asterisk note still launches automatically to mount hidden storage shelves and wipe backups.',
        storyMappings: [
          {
            storyTerm: 'Special asterisk-prefixed work order on the startup board',
            technicalTerm: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce entry prefixed with *',
            tone: 'amber',
          },
          {
            storyTerm: 'Rebooting into stripped-down emergency mode',
            technicalTerm: 'Triggering Windows Safe Mode (-safeboot) where most third-party EDR agents do not load',
            tone: 'sky',
          },
          {
            storyTerm: 'Mounting hidden storage shelves',
            technicalTerm: 'Enumerating and mounting unmounted local volumes so hidden drives get encrypted',
            tone: 'rose',
          },
          {
            storyTerm: 'Wiping recovery snapshots before locking',
            technicalTerm: 'Automated Volume Shadow Copy deletion inside the quiet Safe Mode boot',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because the encryptor keeps its master instructions tightly sealed against curious defenders, it refuses to budge until the operator supplies a 64-character secret passkey, unlocking modern curve-based locks that seal Windows desktops, Linux hosts, and ESXi servers alike.',
        storyMappings: [
          {
            storyTerm: 'Refusing to budge without a 64-character secret passkey',
            technicalTerm: 'Mandatory -pass <sha256_key> CLI argument decrypting the embedded config',
            tone: 'amber',
          },
          {
            storyTerm: 'Tightly sealed against automated sandbox inspection',
            technicalTerm: 'Anti-analysis runtime key check preventing detonation without affiliate credentials',
            tone: 'sky',
          },
          {
            storyTerm: 'Modern curve-based locking gear',
            technicalTerm: 'Curve25519 asymmetric key exchange paired with XChaCha20 symmetric encryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Uniform Go/C++ fleet across every server room',
            technicalTerm: 'Cross-platform RansomHub payloads targeting Windows, Linux, and ESXi',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'medusa-ransomware-gaze-abyss-pdqdeploy': {
    briefing: {
      storyAnalogy:
        'Imagine a burglary crew that slips into an office building through an unpatched remote-support console, maps every room with an ordinary floor scanner and trucks data out via cloud sync, pulls a signed laptop-cooling utility out of its bag to blind every security camera in the building core, and then hijacks the company own official software-delivery trolley to roll its padlocking crew into every office simultaneously.',
      storyMappings: [
        {
          storyTerm: 'Slipping in via remote-support console and trucking data out',
          technicalTerm: 'ScreenConnect RMM foothold, Advanced IP Scanner discovery, and Rclone exfiltration',
          tone: 'amber',
        },
        {
          storyTerm: 'Signed laptop-cooling utility blinding security cameras in the core',
          technicalTerm: 'gaze.exe loading signed ThrottleStop.sys (rwdrv.sys) to strip kernel EDR callbacks',
          tone: 'sky',
        },
        {
          storyTerm: 'Hijacking the company own official software-delivery trolley',
          technicalTerm: 'PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass ransomware rollout',
          tone: 'rose',
        },
        {
          storyTerm: 'Wiping backups and sealing every office with branded locks',
          technicalTerm: 'VSS deletion and AES-256-CBC encryption appending .medusa extensions',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Entering through an unpatched perimeter remote-support doorway, the crew runs an off-the-shelf network scanner to map every room in the building and quietly uploads sensitive company folders through a cloud moving utility before sounding any alarms.',
        storyMappings: [
          {
            storyTerm: 'Unpatched perimeter remote-support doorway',
            technicalTerm: 'Exploited ConnectWise ScreenConnect or Fortinet perimeter appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Off-the-shelf room scanner',
            technicalTerm: 'Advanced IP Scanner mapping active internal servers and SMB shares',
            tone: 'sky',
          },
          {
            storyTerm: 'Cloud moving utility shipping out folders',
            technicalTerm: 'Rclone exfiltrating sensitive corporate archives prior to ransomware execution',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual-purpose remote access',
            technicalTerm: 'Living-off-the-land RMM persistence blending into legitimate IT operations',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Before rolling out the padlocking crew, the intruders drop a specialized guard-killer carrying a legitimately signed laptop-tuning driver, using its raw core access to cut the security cameras master notification wires.',
        storyMappings: [
          {
            storyTerm: 'Specialized guard-killer tool',
            technicalTerm: 'gaze.exe (Abyss Locker / Medusa EDR killer wrapper)',
            tone: 'amber',
          },
          {
            storyTerm: 'Legitimately signed laptop-tuning driver',
            technicalTerm: 'Vulnerable signed ThrottleStop.sys / rwdrv.sys kernel driver (BYOVD)',
            tone: 'sky',
          },
          {
            storyTerm: 'Cutting security cameras master notification wires',
            technicalTerm: 'Patching or wiping Ring-0 kernel EDR callback arrays to blind telemetry',
            tone: 'rose',
          },
          {
            storyTerm: 'Unmonitored network ready for mass deployment',
            technicalTerm: 'Disabled endpoint protection across domain servers and workstations',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Climbing aboard the IT department own official software-deployment cart, the crew broadcasts the Medusa padlocking machine across the entire campus at once, shredding shadow backups and snapping branded padlocks across every document.',
        storyMappings: [
          {
            storyTerm: 'IT department official software-deployment cart',
            technicalTerm: 'Abused PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass distribution',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding shadow backups across the campus',
            technicalTerm: 'Volume Shadow Copy (VSS) deletion blocking native Windows file recovery',
            tone: 'sky',
          },
          {
            storyTerm: 'Branded padlocks snapped across every document',
            technicalTerm: 'Medusa AES-256-CBC encryption renaming files with the .medusa extension',
            tone: 'rose',
          },
          {
            storyTerm: 'Coordinated single-wave impact',
            technicalTerm: 'Simultaneous domain-wide detonation maximizing operational disruption',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'qilin-agenda-rust-chrome-cred-harvester-esxi': {
    briefing: {
      storyAnalogy:
        'Imagine a clever heist crew that compromises a corporate headquarters and quietly pins a tiny extra morning-checkin chore onto the official employee welcome board so every worker who sits down at their desk unknowingly hands over every password saved inside their web browser. Armed with that giant ring of stolen keys, the crew unlocks every shared office vault and basement virtual server simultaneously and seals both estates in one synchronized sweep.',
      storyMappings: [
        {
          storyTerm: 'Pinning a tiny morning-checkin chore onto the welcome board',
          technicalTerm: 'Active Directory GPO PowerShell logon script harvesting Chrome and Edge DPAPI credentials',
          tone: 'amber',
        },
        {
          storyTerm: 'Unlocking shared vaults with the stolen key ring before shredding backups',
          technicalTerm: 'Rust Qilin binary invoked with -d credentials mounting shares, killing services, and wiping VSS',
          tone: 'sky',
        },
        {
          storyTerm: 'Sealing both office desktops and basement virtual servers at once',
          technicalTerm: 'Simultaneous Windows and ESXi ChaCha20 or AES-256-GCM encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Tailored affiliate locking profile',
          technicalTerm: 'Configurable per-affiliate cipher mode wrapped with RSA public key',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After seizing the headquarters policy board, the crew attaches a covert morning login script that waits patiently for employees to sign in across the company, silently scooping up every saved web password and cookie out of their browser vaults.',
        storyMappings: [
          {
            storyTerm: 'Headquarters policy board',
            technicalTerm: 'Compromised Active Directory Domain Controller Group Policy Object (GPO)',
            tone: 'amber',
          },
          {
            storyTerm: 'Covert morning login script waiting for employees',
            technicalTerm: 'GPO PowerShell logon script running inside each authenticated user context',
            tone: 'sky',
          },
          {
            storyTerm: 'Scooping up saved web passwords from browser vaults',
            technicalTerm: 'DPAPI decryption of Chrome and Edge Login Data across hundreds of user sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Staged credential harvest for lateral expansion',
            technicalTerm: 'Centralized collection of VPN, SaaS, vCenter, and administrative passwords',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Feeding the freshly harvested master keys directly into their Rust-forged utility, the crew automatically unlocks remote shared cabinets, shuts down noisy database clerks holding files open, and shreds every local backup copy.',
        storyMappings: [
          {
            storyTerm: 'Feeding freshly harvested master keys into the utility',
            technicalTerm: 'Rust Qilin encryptor invoked with -d domain and credential arguments',
            tone: 'amber',
          },
          {
            storyTerm: 'Automatically unlocking remote shared cabinets',
            technicalTerm: 'Authenticated SMB share mounting across discovered network servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Shutting down database clerks holding files open',
            technicalTerm: 'Automated termination of SQL, mail, and backup Windows services',
            tone: 'rose',
          },
          {
            storyTerm: 'Shredding every local backup copy',
            technicalTerm: 'Volume Shadow Copy wipe eliminating local restore points',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Switching seamlessly between high-speed locking gears tailored for each affiliate job, the crew seals both Windows office files and basement ESXi virtual servers at the exact same time, leaving the enterprise paralyzed across physical and virtual floors.',
        storyMappings: [
          {
            storyTerm: 'Tailored locking gears chosen per job',
            technicalTerm: 'Per-affiliate Qilin profile selecting ChaCha20 or AES-256-GCM with RSA wrapping',
            tone: 'amber',
          },
          {
            storyTerm: 'Basement virtual servers halted and sealed',
            technicalTerm: 'ESXi Linux ELF encryptor stopping VMs and encrypting datastore VMDK images',
            tone: 'sky',
          },
          {
            storyTerm: 'Office files locked simultaneously',
            technicalTerm: 'Multi-threaded Windows file encryption appending affiliate-specific extensions',
            tone: 'rose',
          },
          {
            storyTerm: 'Maximized cross-platform extortion pressure',
            technicalTerm: 'Synchronized Windows desktop, file server, and virtualization outage',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'hunters-international-hive-rust-wsus-sharpwmi': {
    briefing: {
      storyAnalogy:
        'Imagine a successor heist crew that buys the blueprint of an infamous retired vault-cracking machine and upgrades it to run even cleaner and quieter. First, they send remote maintenance orders to wipe backup catalogs; next, instead of loudly shouting the usual shadow-shredder command that wakes every hallway guard, they quietly walk up to the vault backup engine itself and whisper a direct internal delete order; finally, they run a fast multi-lane Rust padlocking press and sweep the empty floor clean so deleted scraps can never be pieced back together.',
      storyMappings: [
        {
          storyTerm: 'Sending remote orders to wipe backup catalogs',
          technicalTerm: 'SharpWMI.exe lateral execution invoking wbadmin delete catalog',
          tone: 'amber',
        },
        {
          storyTerm: 'Whispering a direct internal delete order instead of shouting',
          technicalTerm: 'Commandless COM IVssBackupComponents::DeleteSnapshots bypassing vssadmin CLI alerts',
          tone: 'sky',
        },
        {
          storyTerm: 'Upgraded multi-lane Rust padlocking press',
          technicalTerm: 'Hunters International Rust encryptor evolved from Hive codebase (.locked)',
          tone: 'rose',
        },
        {
          storyTerm: 'Sweeping empty floor space so scraps cannot be recovered',
          technicalTerm: 'Free-space wiping after encryption alongside Contact Us.txt ransom notes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'From a hijacked supervisor desk, the crew dispatches lightweight remote management commands down the corporate wiring to erase the building official backup directory catalog before any locking begins.',
        storyMappings: [
          {
            storyTerm: 'Hijacked supervisor desk',
            technicalTerm: 'Compromised administrative workstation initiating lateral movement',
            tone: 'amber',
          },
          {
            storyTerm: 'Lightweight remote management orders',
            technicalTerm: 'SharpWMI.exe executing remote commands over WMI across domain servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing the official backup directory catalog',
            technicalTerm: 'wbadmin delete catalog removing Windows Backup recovery metadata',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing the runway for extortion',
            technicalTerm: 'Eliminating server-level recovery options prior to mass encryption',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Knowing that security sensors watch closely for the noisy standard shadow-copy command tool, the Rust program skips the command line altogether and speaks directly to the operating system internal backup clerk through its private office door to erase every snapshot in silence.',
        storyMappings: [
          {
            storyTerm: 'Skipping the noisy command line altogether',
            technicalTerm: 'Avoiding vssadmin.exe delete shadows and wmic.exe shadowcopy delete SIEM rules',
            tone: 'amber',
          },
          {
            storyTerm: 'Speaking directly through the backup clerk private door',
            technicalTerm: 'Direct COM API call to IVssBackupComponents::DeleteSnapshots in memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Erasing every snapshot in silence',
            technicalTerm: 'Commandless Volume Shadow Copy deletion leaving zero CLI process artifacts',
            tone: 'rose',
          },
          {
            storyTerm: 'Catching the quiet internal call',
            technicalTerm: 'Monitoring VSS EventID 8224 / COM telemetry rather than CLI strings alone',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With every backup gone, the streamlined Rust locking press races across every storage aisle sealing files under a locked tag, scrubs blank shelf space to prevent undelete forensics, and leaves neat negotiation cards in every cabinet.',
        storyMappings: [
          {
            storyTerm: 'Streamlined Rust locking press evolved from Hive',
            technicalTerm: 'Hunters International multi-threaded Rust encryptor simplifying Hive encryption',
            tone: 'amber',
          },
          {
            storyTerm: 'Scrubbing blank shelf space against undelete tools',
            technicalTerm: 'Post-encryption free-space wiping preventing forensic carving of plaintext files',
            tone: 'sky',
          },
          {
            storyTerm: 'Locked tag stamped on every file',
            technicalTerm: 'Encrypted documents renamed with the .locked extension',
            tone: 'rose',
          },
          {
            storyTerm: 'Negotiation cards left in every cabinet',
            technicalTerm: 'Contact Us.txt extortion note directing victims to leak-site chat',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'inc-ransom-lynx-citrix-netscaler-wmic-mega': {
    briefing: {
      storyAnalogy:
        'Imagine a burglary crew that breaks in through a cracked front-door security gateway, scans every hallway to ship boxes of files out to a public cloud storage locker, copies a compact padlocking cartridge onto every office desk using an automated list of room numbers, and then locks every cabinet while printing out ransom demands straight through every office paper printer across the building.',
      storyMappings: [
        {
          storyTerm: 'Cracked front-door gateway and cloud storage locker shipment',
          technicalTerm: 'Citrix NetScaler ADC breach, NetScan discovery, and MEGASync cloud exfiltration',
          tone: 'amber',
        },
        {
          storyTerm: 'Copying a padlocking cartridge down an automated list of rooms',
          technicalTerm: 'WMIC /node:@"hosts.txt" mass DLL staging and rundll32.exe execution',
          tone: 'sky',
        },
        {
          storyTerm: 'Fast modern locks across every office cabinet',
          technicalTerm: 'INC Ransom / Lynx AES-128-CTR and Curve25519 file encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Printing ransom demands straight through every office paper printer',
          technicalTerm: 'Desktop wallpaper change plus physical network printer ransom note printing',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping past an unpatched edge access gateway into the corporate interior, the crew runs a swift floor scanner to chart every active room and uploads stolen corporate files directly to an outside consumer cloud locker.',
        storyMappings: [
          {
            storyTerm: 'Unpatched edge access gateway',
            technicalTerm: 'Exploited Citrix NetScaler ADC or VPN perimeter appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Swift floor scanner charting every active room',
            technicalTerm: 'NetScan discovering live hosts, shares, and IP lists saved to hosts.txt',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside consumer cloud locker',
            technicalTerm: 'MEGASync client exfiltrating staged corporate documents to Mega.nz',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual-brand criminal family',
            technicalTerm: 'Shared INC Ransom and Lynx codebase and affiliate playbooks',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Holding a neat roster of every room number in the building, the operator copies a compact padlocking cartridge into each room temporary closet and uses the building built-in remote runner to trigger every cartridge across the entire roster in one single command.',
        storyMappings: [
          {
            storyTerm: 'Neat roster of every room number',
            technicalTerm: 'Target host list hosts.txt fed into WMIC /node:@"hosts.txt"',
            tone: 'amber',
          },
          {
            storyTerm: 'Compact padlocking cartridge placed in each closet',
            technicalTerm: 'inc.dll or lynx.dll copied to \\\\<host>\\C$\\Windows\\Temp\\',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in remote runner triggering every cartridge',
            technicalTerm: 'WMIC process call create invoking signed rundll32.exe to execute the DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Single-command fleet-wide launch',
            technicalTerm: 'Rapid horizontal detonation across Windows workstations and servers',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'As modern elliptical-key padlocks clamp down on every document, the crew flips every monitor screen to a stark warning banner and even sends their ransom letter straight to every networked paper printer in the hallways so nobody can miss the takeover.',
        storyMappings: [
          {
            storyTerm: 'Modern elliptical-key padlocks',
            technicalTerm: 'AES-128-CTR symmetric file encryption paired with Curve25519 key exchange',
            tone: 'amber',
          },
          {
            storyTerm: 'Stark warning banner across every monitor',
            technicalTerm: 'Automated Windows desktop wallpaper replacement announcing compromise',
            tone: 'sky',
          },
          {
            storyTerm: 'Ransom letters pouring out of hallway paper printers',
            technicalTerm: 'Physical network printer job dispatch printing extortion notices on paper',
            tone: 'rose',
          },
          {
            storyTerm: 'Shared cryptographic DNA',
            technicalTerm: 'Identical encryption workflow shared between INC Ransom and its Lynx rebrand',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'cactus-ransomware-qlik-sense-ssh-batch-unpacker': {
    briefing: {
      storyAnalogy:
        'Imagine a stealthy burglar who sneaks through a warped side tunnel inside an analytics server and bolts a permanent hidden skylight onto the building schedule so they can return anytime. Rather than carrying an exposed lockpicker that guards immediately recognize, the burglar drops a password-locked suitcase onto every desk, unpacks a scrambled inner box using a secret key at runtime, and marks each file twice (first with an in-progress tag while taking tiny sips of data, then with a finished lock tag once sealed).',
      storyMappings: [
        {
          storyTerm: 'Warped side tunnel and permanent hidden skylight on the schedule',
          technicalTerm: 'Qlik Sense CVE-2023-41265 tunneling RCE and persistent OpenSSH scheduled task',
          tone: 'amber',
        },
        {
          storyTerm: 'Password-locked suitcase unpacking a scrambled inner box at runtime',
          technicalTerm: '7z.exe archive extraction and self-decrypting Cactus binary via -i AES key',
          tone: 'sky',
        },
        {
          storyTerm: 'Marking each file in-progress then finished while taking tiny sips',
          technicalTerm: 'Multi-stream micro-read encryption renaming files from .cts0 to .cts1',
          tone: 'rose',
        },
        {
          storyTerm: 'Extortion letter dropped across sealed rooms',
          technicalTerm: 'cAcTuS.readme.txt ransom note generated after completion',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Exploiting a bent routing tunnel inside a public analytics portal, the burglar slips straight into the back office and wires a repeating scheduled task that keeps a private encrypted back door propped open outward toward their own server.',
        storyMappings: [
          {
            storyTerm: 'Bent routing tunnel inside an analytics portal',
            technicalTerm: 'Qlik Sense Enterprise HTTP request tunneling and path traversal (CVE-2023-41265)',
            tone: 'amber',
          },
          {
            storyTerm: 'Repeating scheduled task holding a skylight open',
            technicalTerm: 'Scheduled task maintaining a persistent reverse OpenSSH tunnel',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing inbound perimeter doors',
            technicalTerm: 'Outbound SSH reverse tunnel surviving perimeter IP blocks',
            tone: 'rose',
          },
          {
            storyTerm: 'Staging ground for enterprise spread',
            technicalTerm: 'Compromised analytics server used to pivot into Active Directory',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To fool hallway security inspectors who X-ray every file sitting on disk, the crew sprays a locked archive across every workstation, unzips it with a batch script, and passes an unlocking key directly on the command line so the padlocking machine only unscrambles itself inside live working memory.',
        storyMappings: [
          {
            storyTerm: 'Spraying a locked archive across every workstation',
            technicalTerm: 'PowerShell sprayer (s.ps1) and PsExec distributing a password-protected 7-Zip archive',
            tone: 'amber',
          },
          {
            storyTerm: 'Unzipping with a batch helper script',
            technicalTerm: '7z.exe extracting the encrypted Cactus payload (ntuser.dat) on target hosts',
            tone: 'sky',
          },
          {
            storyTerm: 'Unlocking key passed on the command line',
            technicalTerm: 'Mandatory -i flag supplying the AES key for runtime self-decryption',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating static X-ray inspection on disk',
            technicalTerm: 'Encrypted on-disk payload remaining unreadable to static AV signatures until -i runs',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Running in quiet multi-stream mode, the unscrambled encryptor takes small sips of each file so heavy disk-thrashing alarms stay calm, tagging active files with a temporary work badge before flipping them to a final sealed tag and leaving its signature cactus ransom card.',
        storyMappings: [
          {
            storyTerm: 'Taking small sips so disk-thrashing alarms stay calm',
            technicalTerm: 'Multi-stream micro-read encryption under the -r flag evading I/O spike heuristics',
            tone: 'amber',
          },
          {
            storyTerm: 'Temporary work badge during active locking',
            technicalTerm: 'Target files temporarily renamed to .cts0 while encryption is underway',
            tone: 'sky',
          },
          {
            storyTerm: 'Final sealed tag upon completion',
            technicalTerm: 'Completed encrypted files renamed from .cts0 to .cts1',
            tone: 'rose',
          },
          {
            storyTerm: 'Signature cactus ransom card',
            technicalTerm: 'Dropped cAcTuS.readme.txt extortion demand file',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'eightbase-phobos-smoke-loader-process-hacker': {
    briefing: {
      storyAnalogy:
        'Imagine a street-level burglary crew that slips into an office through an open desk door or booby-trapped attachment, opens a hidden relay pipe and borrows a signed technician wrench to disable security guards, then climbs past the desk confirmation prompt to tear down the firewall, snap the emergency-recovery levers off the wall, and clamp heavy locks onto every cabinet while popping open a full-screen ransom placard on every desk.',
      storyMappings: [
        {
          storyTerm: 'Hidden relay pipe and signed technician wrench disabling guards',
          technicalTerm: 'SmokeLoader, SystemBC SOCKS5 proxy, and Process Hacker (kprocesshacker.sys) BYOVD',
          tone: 'amber',
        },
        {
          storyTerm: 'Climbing past confirmation prompts to tear down fences and recovery levers',
          technicalTerm: 'UAC bypass, netsh firewall disablement, and vssadmin / bcdedit recovery wipe',
          tone: 'sky',
        },
        {
          storyTerm: 'Clamping heavy locks onto small files whole and huge files in chunks',
          technicalTerm: 'Phobos AES-256-CBC encryption renaming files with the .8base extension',
          tone: 'rose',
        },
        {
          storyTerm: 'Popping open a full-screen ransom placard on every desk',
          technicalTerm: 'info.hta HTML Application ransom notice launched via mshta.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping onto a victim workstation through an exposed remote-desktop doorway or poisoned email attachment, a compact delivery agent sets up a quiet relay pipe and deploys a signed system-diagnostics driver to knock out active endpoint guards.',
        storyMappings: [
          {
            storyTerm: 'Compact delivery agent from a poisoned doorway',
            technicalTerm: 'SmokeLoader delivered via exposed RDP or phishing attachments',
            tone: 'amber',
          },
          {
            storyTerm: 'Quiet relay pipe bridging back to operators',
            technicalTerm: 'SystemBC SOCKS5 proxy maintaining persistent C2 tunneling',
            tone: 'sky',
          },
          {
            storyTerm: 'Signed system-diagnostics wrench knocking out guards',
            technicalTerm: 'Abused Process Hacker kernel driver (kprocesshacker.sys) terminating security agents',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing the host before lockdown',
            technicalTerm: 'Initial foothold and defense evasion preparing for Phobos/8Base detonation',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Planting copies of itself inside both the morning startup folder and the master launch registry so it survives reboots, the payload hops past user permission prompts, shuts off the building firewall walls, and cuts off both shadow backups and emergency boot-repair switches.',
        storyMappings: [
          {
            storyTerm: 'Planting copies in the startup folder and launch registry',
            technicalTerm: 'Persistence in %APPDATA%\\...\\Startup and HKLM Run keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Hopping past user permission prompts',
            technicalTerm: 'User Account Control (UAC) bypass elevating to high integrity',
            tone: 'sky',
          },
          {
            storyTerm: 'Shutting off the building firewall walls',
            technicalTerm: 'netsh advfirewall set allprofiles state off disabling host firewall rules',
            tone: 'rose',
          },
          {
            storyTerm: 'Cutting off backups and boot-repair switches',
            technicalTerm: 'Deleting Volume Shadow Copies and disabling Windows recovery via bcdedit',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Sweeping across every non-system drawer on the machine, the Phobos locking engine seals small documents completely and seals giant files rapidly in slices, stamps every locked item with an 8base tag, and pops open an interactive ransom placard right on the desktop.',
        storyMappings: [
          {
            storyTerm: 'Sealing small documents whole and giant files in slices',
            technicalTerm: 'Phobos AES-256-CBC full encryption under 1.5 MB and partial encryption on larger files',
            tone: 'amber',
          },
          {
            storyTerm: 'Stamping every locked item with a branded tag',
            technicalTerm: 'Encrypted files renamed with the .8base suffix and victim identifier',
            tone: 'sky',
          },
          {
            storyTerm: 'Interactive ransom placard popped onto the desktop',
            technicalTerm: 'info.hta HTML Application rendered automatically on infected hosts',
            tone: 'rose',
          },
          {
            storyTerm: 'Shared Phobos criminal family lineage',
            technicalTerm: '8Base affiliate configuration running atop the established Phobos encryptor',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'cl0p-truebot-flawedgrace-sdbbot-ransomware': {
    briefing: {
      storyAnalogy:
        'Imagine a veteran corporate heist syndicate that moves with industrial precision. First, they slip a quiet scout into the lobby to unlock a full remote-control toolkit; next, they stride down to the master switchboard with a tiny command launcher and flip off over six hundred different database, backup, and office services so zero locks hold any files open; finally, they unleash dedicated locking teams down every local aisle and shared storage hallway simultaneously to clamp every vault shut.',
      storyMappings: [
        {
          storyTerm: 'Quiet lobby scout unlocking a full remote-control toolkit',
          technicalTerm: 'TrueBot (Silence.Downloader) deploying FlawedGrace and SDBbot RAT implants',
          tone: 'amber',
        },
        {
          storyTerm: 'Tiny command launcher flipping off six hundred building services',
          technicalTerm: 'TinyMet lateral stager followed by mass net stop termination of 600+ services',
          tone: 'sky',
        },
        {
          storyTerm: 'Dedicated locking teams sweeping local aisles and shared hallways',
          technicalTerm: 'Multi-threaded CL0P worker threads encrypting local drives and SMB shares',
          tone: 'rose',
        },
        {
          storyTerm: 'Branded vault locks and printed extortion demand',
          technicalTerm: 'RC4/AES + RSA-1024 encryption appending .CIop and dropping ClopReadMe.txt',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Entering through a crafted email lure or a perimeter file-transfer flaw, the syndicate wakes up a nimble download scout that fingerprints the office network and quietly brings inside full-featured espionage puppets.',
        storyMappings: [
          {
            storyTerm: 'Nimble download scout fingerprinting the network',
            technicalTerm: 'TrueBot (Silence.Downloader) executed after spearphishing or MFT/web zero-days',
            tone: 'amber',
          },
          {
            storyTerm: 'Full-featured espionage puppets brought inside',
            technicalTerm: 'FlawedGrace and SDBbot Remote Access Trojans establishing interactive C2',
            tone: 'sky',
          },
          {
            storyTerm: 'Seasoned financial syndicate operators',
            technicalTerm: 'TA505 / FIN11 threat actors orchestrating enterprise-scale intrusion',
            tone: 'rose',
          },
          {
            storyTerm: 'Mapping high-value servers quietly',
            technicalTerm: 'Active Directory reconnaissance identifying Domain Controllers and file servers',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Pivoting straight into the central server room with a featherweight command stager, the syndicate runs down a massive checklist of over six hundred database engines, accounting apps, and security monitors, shutting every single one down so every file lock falls open.',
        storyMappings: [
          {
            storyTerm: 'Featherweight command stager pivoting to core servers',
            technicalTerm: 'TinyMet (minimal Meterpreter/Cobalt Strike stager) reaching Domain Controllers',
            tone: 'amber',
          },
          {
            storyTerm: 'Massive checklist of six hundred services shut down',
            technicalTerm: 'Automated net stop and process kill loops targeting 600+ DB, backup, and AV services',
            tone: 'sky',
          },
          {
            storyTerm: 'Releasing every active file lock',
            technicalTerm: 'Ensuring live SQL, Exchange, and backup files can be encrypted cleanly',
            tone: 'rose',
          },
          {
            storyTerm: 'Distinctive noisy precursor right before impact',
            technicalTerm: 'Rapid burst of Windows Service Control Manager stop events (EventID 7036)',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Unleashing dedicated parallel locking squads across every local drive and every mapped corporate file hall at once, the crew clamps fast symmetric locks wrapped inside a master asymmetric seal onto every document and posts their ransom letter on every floor.',
        storyMappings: [
          {
            storyTerm: 'Dedicated parallel locking squads across local and shared halls',
            technicalTerm: 'Dedicated CL0P worker threads for local volumes and enumerated SMB network shares',
            tone: 'amber',
          },
          {
            storyTerm: 'Fast locks wrapped inside a master asymmetric seal',
            technicalTerm: 'RC4/AES file encryption with per-file keys protected by RSA-1024',
            tone: 'sky',
          },
          {
            storyTerm: 'Signature deceptive extension tag',
            technicalTerm: 'Encrypted files renamed with the .CIop extension (capital I mimicking lowercase l)',
            tone: 'rose',
          },
          {
            storyTerm: 'Extortion letter posted on every floor',
            technicalTerm: 'ClopReadMe.txt ransom note placed across affected directories',
            tone: 'emerald',
          },
        ],
      },
    },
  },
};
