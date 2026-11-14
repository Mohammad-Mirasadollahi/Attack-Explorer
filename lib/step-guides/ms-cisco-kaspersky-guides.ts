import { RawScenarioStepGuideData } from '../scenario-step-guides';

export const MS_CISCO_KASPERSKY_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'ms-volt-typhoon-lotl': {
    scenarioId: 'ms-volt-typhoon-lotl',
    briefing: {
      headline: 'Scenario Briefing: Volt Typhoon (CISA AA23-144A) — "Living off the Land" & Extracting ntds.dit Without Malware',
      storyAnalogy:
        'Imagine an infiltrator who enters a high-security facility carrying zero weapons or burglar tools in their pockets. Instead, they pick up the facility’s own maintenance clipboard (`wmic.exe`), use the building’s built-in port-forwarding intercom (`netsh interface portproxy`) to relay messages through retired home routers (KV Botnet), and ask the facility’s official backup machine (`ntdsutil.exe`) to print a full copy of the master key vault (`ntds.dit`). Because every single action is performed by an official, factory-installed Windows utility, file-based antivirus scanners see zero foreign malware.',
      plainSummary:
        'Documented by Joint CISA/NSA/FBI/Microsoft Advisory AA23-144A, the Volt Typhoon APT group specializes in "Living off the Land" (LotL — executing attacks exclusively with built-in operating system tools so zero custom malware files ever touch the disk). Instead of using hacktools like Mimikatz that trigger antivirus immediately, Volt Typhoon routes traffic through a botnet of compromised SOHO routers ("KV Botnet" — making traffic originate from local residential/small-business IPs), runs built-in Windows administration commands (wmic, ntdsutil, netsh — all validly signed by Microsoft), creates a stealthy port-forwarding relay (netsh interface portproxy), and extracts the entire Active Directory password database (ntds.dit) using native backup utilities.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (KV Botnet SOHO Router Relay & Compromised Edge Appliance), pivot into Node ③ (Windows Jump Server via `wmic` / `netsh portproxy`), extract `ntds.dit` and `SYSTEM` hive on Node ④ (Active Directory Domain Controller via `ntdsutil`), and exfiltrate to Node ⑤ while Node ⑥ (SIEM / Defender for Identity) correlates the anomalous native-binary command lines.',
      documentedAdvisory: 'CISA/NSA/FBI/Microsoft Joint Advisory AA23-144A · Microsoft Threat Intelligence Volt Typhoon · MITRE T1003.003 / T1090',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1090',
        plainTitle: 'Routing Through SOHO Routers & Setting Up `netsh interface portproxy` Relays',
        storyAnalogy:
          'Rather than calling the target’s server from an overseas phone number that would raise an instant red flag, the operator routes the call through a neighborhood home router down the street (`KV Botnet`) and programs a compromised internal Windows server (`netsh portproxy`) to quietly forward every packet deeper into the vault.',
        simpleExplanation:
          'Instead of connecting from a rented cloud VPS that threat-intelligence feeds would block, the attacker connects through a compromised small-office/home-office (SOHO) router in the same geographic region (KV Botnet — so geo-IP filters see normal local ISP traffic), and runs netsh interface portproxy add v4tov4 listenport=8443 connectaddress=10.20.1.10 connectport=445 on an internal Windows server (using Windows’ own built-in network configuration tool to turn the compromised server into a stealthy TCP traffic relay toward the Domain Controller, without dropping any third-party proxy software onto the hard drive).',
        howItWorksInPractice:
          'C:\\Windows\\System32\\netsh.exe is a Microsoft-signed system binary present on every Windows machine. Its portproxy subcommand registers a persistent kernel/service-level TCP forwarder inside the IpHlpSvc service and saves the rule in the Registry (HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp — allowing the relay tunnel to automatically survive server reboots).',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ①/② (KV Botnet SOHO Relay) to Node ③ (Windows Server configuring `netsh interface portproxy`), and return arrow ⇠#1.2 confirming the registry port-forwarding rule.',
        detectionAndEvidence:
          'Documented in CISA AA23-144A: Sysmon EventID 1 (`netsh.exe interface portproxy add v4tov4`) and Registry EventID 13 under `Services\\PortProxy\\v4tov4\\tcp`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1003.003',
        plainTitle: 'Using Built-in `ntdsutil.exe` ("create full") to Dump Every Domain Password Hash',
        storyAnalogy:
          'The Domain Controller keeps its master password book (`ntds.dit`) locked inside a glass case while Windows is running so nobody can copy the file directly. Instead of smashing the glass, the infiltrator asks the official Active Directory maintenance robot (`ntdsutil "ac i ntds" "ifm"`) to take a temporary backup snapshot and place an unlocked copy right into `C:\\Windows\\Temp\\`.',
        simpleExplanation:
          'Active Directory exclusively locks C:\\Windows\\NTDS\\ntds.dit (the master database file containing the password hashes of every employee, service, and Domain Admin in the company) while the Domain Controller is running, so normal copy commands fail. To bypass that lock without dropping Mimikatz, the attacker runs wmic process call create "cmd.exe /c ntdsutil \"ac i ntds\" \"ifm\" \"create full C:\\Windows\\Temp\\pro\" q q" (where "ac i ntds" selects the Active Directory database instance, and "ifm" / "create full" instructs Microsoft’s own signed backup tool to take a Volume Shadow Copy snapshot and write an unlocked copy of ntds.dit plus the SYSTEM decryption hive into C:\\Windows\\Temp\\pro).',
        howItWorksInPractice:
          'The ifm (Install From Media — originally designed so admins could build a new Domain Controller from a backup folder) command in ntdsutil.exe automatically spawns a temporary Volume Shadow Copy, extracts both Active Directory\\ntds.dit and registry\\SYSTEM (which holds the BootKey required to decrypt the hashes inside ntds.dit), and then deletes the temporary shadow copy to clean up.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ pivots from Node ③ to Node ④ (Domain Controller running `ntdsutil "ac i ntds" "ifm"`), and ⇠#2.2 writes `Active Directory\\ntds.dit` and `registry\\SYSTEM` to `C:\\Windows\\Temp\\`.',
        detectionAndEvidence:
          'Documented in CISA AA23-144A: Sysmon EventID 1 showing `ntdsutil.exe` with `ifm` and `create full` arguments, plus Application EventID 325/326/327 (ESENT database creation in a temp folder).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1560.001',
        plainTitle: 'Packing the Stolen AD Database With `makecab` / `7z` & Scrubbing Event Logs',
        storyAnalogy:
          'Finally, the infiltrator compresses the copied master password book into an ordinary-looking archive file, carries it back out through the `netsh` intercom relay, and uses the security office’s own log-cleaner (`wevtutil cl`) to erase the visitor log entries.',
        simpleExplanation:
          'The attacker compresses the dumped ntds.dit and SYSTEM files into a cabinet/archive file (reducing file size and encrypting the contents before network transfer), exfiltrates the archive back out through the netsh portproxy relay tunnel, deletes the C:\\Windows\\Temp\\pro staging folder, and runs wevtutil cl Security and wevtutil cl System (Windows’ built-in Event Log utility with the "cl" / clear-log flag — wiping local login and service-creation audit trails to delay forensic investigation).',
        howItWorksInPractice:
          'Once the attacker possesses both ntds.dit and the SYSTEM registry hive offline, they use Impacket secretsdump.py on their own machine to extract every account’s NTLM hash—including the krbtgt account (allowing them to forge Golden Tickets and log in as any user at will without ever needing malware on the network).',
        diagramAlignment:
          'On the diagram, arrow #3.1→ exfiltrates the compressed `ntds.dit` archive from Node ④ through Node ③ to Node ⑤ while Node ⑥ (SIEM) alerts on the `ntdsutil` + `wevtutil` LotL sequence.',
        detectionAndEvidence:
          'Documented in CISA AA23-144A & Windows Security EventID 1102 (The audit log was cleared): `ntdsutil ifm` execution followed by archive creation and `wevtutil.exe cl`.',
      },
    ],
  },

  'ms-midnight-blizzard-oauth': {
    scenarioId: 'ms-midnight-blizzard-oauth',
    briefing: {
      headline: 'Scenario Briefing: Midnight Blizzard (NOBELIUM / APT29) — Legacy Test Tenant to OAuth `full_access_as_app` Exchange Takeover',
      storyAnalogy:
        'Imagine a burglar who finds a forgotten, dusty side cottage on a corporate estate (a legacy non-production test tenant) whose door still uses a simple single-key lock (no MFA). Inside that cottage, the burglar finds an old master maintenance badge (a legacy OAuth application) that happens to have cross-building authority in the main corporate headquarters. Using that badge, they mint new automated robot passes (`Service Principals`) granted the `full_access_as_app` stamp—letting them silently read any executive’s mailbox without ever needing any executive’s password.',
      plainSummary:
        'Documented by Microsoft Security Response Center (MSRC) and Microsoft Threat Intelligence (January 2024), this scenario illustrates how Midnight Blizzard (APT29) compromised corporate Exchange Online mailboxes through an identity-and-OAuth chain. First, the attacker used a low-and-slow residential-proxy password spray (sending only a few login attempts per IP so rate-based lockouts never trigger) to compromise a forgotten, non-production test tenant account that lacked MFA. From there, they abused an old OAuth application that had elevated permissions in the corporate environment, registered new malicious OAuth Service Principals, granted them the powerful full_access_as_app Exchange Online role (which allows reading any mailbox in the company via API without user interaction), and exfiltrated emails over EWS.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Midnight Blizzard Residential Proxy Spray targeting the Legacy Test Tenant), pivot through the shared OAuth Service Principal into Node ③/④ (Corporate Entra ID & Malicious OAuth App Registration), and query mailboxes on Node ⑤ (Exchange Online `full_access_as_app`), detected by Node ⑥ (Entra Audit & Unified Audit Log SIEM).',
      documentedAdvisory: 'Microsoft Threat Intelligence Midnight Blizzard Blog (Jan 2024) · MITRE ATT&CK T1110.003 / T1098.003 / T1114.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1110.003',
        plainTitle: 'Low-Volume Residential-Proxy Password Spray Against a Forgotten Legacy Test Account',
        storyAnalogy:
          'Instead of rattling the front door of the main corporate tower 1,000 times from one suspicious van, the attacker has dozens of local couriers (residential proxy IPs) try just one password at a time on a forgotten side-cottage test door that never had a two-factor keypad installed.',
        simpleExplanation:
          'To avoid triggering automated IP blocks or account lockouts, the attacker routes authentication requests through a rotating pool of residential proxy IPs (home internet routers in the same country as the target — making login traffic look like legitimate local employees rather than a datacenter botnet) and performs a low-volume password spray (trying just one common password at a time across a small list of accounts) against a forgotten, non-production legacy test tenant account that had never been enforced with Multi-Factor Authentication (MFA).',
        howItWorksInPractice:
          'Because each residential proxy IP sends only a tiny fraction of the total login attempts and stays well below the bad-password lockout threshold (e.g., 1 attempt per hour), traditional velocity-based brute-force rules do not fire—allowing the attacker to quietly log into the forgotten single-factor test account.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ①/② (Residential Proxy Pool) to Node ③ (Legacy Test Tenant Entra ID Sign-In), and return arrow ⇠#1.2 issuing the initial OAuth token.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intelligence: Entra ID Sign-in Logs (`SigninLogs`) showing distributed password spray across residential proxy ASNs targeting single-factor legacy accounts.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.003',
        plainTitle: 'Abusing a Legacy Cross-Tenant OAuth App to Register New Privileged Service Principals',
        storyAnalogy:
          'Once inside the side cottage, the intruder discovers an old "Universal Maintenance App" that was accidentally given admin rights over the main corporate tower. Using that app’s authority, they print brand-new client secret keys (`Add servicePrincipal credentials`) and stamp them with the highest mail-reading clearance (`full_access_as_app`).',
        simpleExplanation:
          'Inside the test environment, the attacker discovers a legacy OAuth test application whose Service Principal had been granted privileged directory permissions—specifically AppRoleAssignment.ReadWrite.All (a high-privilege Microsoft Graph permission that allows an app to grant *any* permission role to itself or to other apps without asking a human Global Administrator)—inside the main corporate tenant. Using that legacy app, the attacker creates new malicious OAuth Service Principals, attaches new client secret keys (Add servicePrincipal credentials — creating long-lived API passwords for the app), and assigns them the Office 365 Exchange Online full_access_as_app role.',
        howItWorksInPractice:
          'In Microsoft Entra ID, an application holding AppRoleAssignment.ReadWrite.All can call the Graph API (/servicePrincipals/{id}/appRoleAssignments) to self-assign full_access_as_app (Role ID dc890d15-9560-4a4c-9b7f-a736ec74ec40 — the highest application-level Exchange permission)—escalating from a forgotten test account to full tenant-wide mail access without touching a human admin’s account.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ uses the legacy OAuth app on Node ③ to create and privilege the rogue OAuth Service Principal on Node ④ (`Add app role assignment to service principal`), with ⇠#2.2 returning the OAuth2 `client_credentials` bearer token.',
        detectionAndEvidence:
          'Documented in Microsoft Entra Audit Logs: `Add servicePrincipal`, `Add servicePrincipal credentials`, and `Add app role assignment to service principal` for `full_access_as_app` (`dc890d15-9560-4a4c-9b7f-a736ec74ec40`).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Exfiltrating Corporate Mailboxes via Exchange Web Services (EWS) Using OAuth Bearer Tokens',
        storyAnalogy:
          'Holding the `full_access_as_app` robot pass, the attacker walks straight up to the Exchange mailroom window (`outlook.office365.com/EWS/Exchange.asmx`) and downloads executive inbox folders in bulk—never triggering a single phone MFA prompt on any executive’s device.',
        simpleExplanation:
          'Authenticating purely as the rogue OAuth application using grant_type=client_credentials (machine-to-machine authentication that uses the app’s client secret and never involves a human user login or MFA prompt), the attacker calls Exchange Web Services (https://outlook.office365.com/EWS/Exchange.asmx) through the same residential proxy pool to search and download emails from senior executive and security-team mailboxes.',
        howItWorksInPractice:
          'Because full_access_as_app is an application-level permission (Application Permission) rather than a delegated user permission (Delegated Permission), the OAuth Bearer token grants direct read/export access to any mailbox in the Exchange Online tenant without ever logging in as those users or triggering Conditional Access user-MFA policies.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ queries Node ⑤ (Exchange Online EWS `/EWS/Exchange.asmx` `MailItemsAccessed`) from Node ④, while Node ⑥ (Microsoft Sentinel / SIEM) correlates the Entra role grant with EWS `MailItemsAccessed` telemetry.',
        detectionAndEvidence:
          'Documented in Microsoft Purview Unified Audit Log (`MailItemsAccessed` / `EWS`) correlated with Entra Service Principal sign-ins using `AppId` holding `full_access_as_app`.',
      },
    ],
  },

  'ms-salt-typhoon-telecom': {
    scenarioId: 'ms-salt-typhoon-telecom',
    briefing: {
      headline: 'Scenario Briefing: Salt Typhoon (GhostEmperor) — Telecom Core Router Compromise & Guest Shell Pivot',
      storyAnalogy:
        'Imagine a telephone company’s central switching building. Instead of bugging a single office phone, the attacker slips into the core highway router (`Cisco IOS XE`), enables a hidden Linux maintenance room built right inside the router (`Guest Shell`), and taps the core fiber backbone (`RADIUS` / `TACACS+` and packet capture pipes) so they can harvest network engineer credentials and silently copy traffic passing through the ISP.',
      plainSummary:
        'Documented by CISA, FBI, NSA, and Microsoft Threat Intelligence (2024), the Salt Typhoon APT campaign targeted major telecommunications and ISP core networks. Rather than attacking regular office workstations, Salt Typhoon compromised internet-facing edge and core routing appliances (such as Cisco IOS XE routers), abused the router’s built-in Linux container environment ("Guest Shell" — a legitimate Linux environment inside the router where processes are invisible to standard router CLI commands) to run persistent implants and SSH tunnels, captured network administrator TACACS+ / RADIUS credentials in transit, and accessed sensitive core routing planes.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Salt Typhoon Operator & Edge Telecom Router), trace the IOS XE privilege escalation and Linux Guest Shell container activation on Node ③/④ (Core ISP Router & Guest Shell Container), and follow the credential capture and core network pivot to Node ⑤, monitored by Node ⑥ (Telecom SOC / NetFlow & Syslog SIEM).',
      documentedAdvisory: 'Joint CISA/NSA/FBI Telecom Infrastructure Advisory (2024) · Microsoft Salt Typhoon · MITRE T1190 / T1610 / T1040',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Compromising the Edge Router Web UI & Creating a Level-15 Admin Account',
        storyAnalogy:
          'The intruder exploits a flaw in the router’s front management web desk (`webui_wsma_http`) to forge a "Privilege 15 Master Engineer" badge right inside the router’s local user roster.',
        simpleExplanation:
          'The attacker exploits an exposed management interface or captured configuration credential on a telecom edge router (such as the Cisco IOS XE Web UI / webui_wsma_http endpoint) to execute privileged configuration commands and create a hidden local user account with privilege 15 (in Cisco IOS XE, Privilege Level 15 is the highest "enable" administrative tier — granting unrestricted control over routing tables, packet capture, and system containers).',
        howItWorksInPractice:
          'Creating a local fallback account with username <name> privilege 15 secret <hash> allows the attacker to log directly into the router with full administrative authority whenever local authentication fallback is enabled or by bypassing centralized AAA checks.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ①/② into Node ③ (Telecom Edge/Core Router IOS XE), and return arrow ⇠#1.2 granting Privilege 15 CLI execution.',
        detectionAndEvidence:
          'Documented in CISA/Cisco IOS XE advisories: `%SYS-5-CONFIG_I: Configured from http by console` and unexpected `username ... privilege 15` entries in AAA accounting logs.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1610',
        plainTitle: 'Activating the Router’s Linux "Guest Shell" Container to Hide Persistent Implants',
        storyAnalogy:
          'Inside the router, there is a legitimate, factory-built Linux workshop (`guestshell`) meant for automation scripts. When an admin inspects the normal router command line (`show processes`), they cannot see inside that Linux workshop—making it the perfect hidden room to run a covert SSH tunnel.',
        simpleExplanation:
          'Instead of dropping files onto the router’s standard flash storage (where any network engineer running "dir flash:" would immediately spot an unfamiliar file), the attacker enables iox (Cisco’s Application Hosting framework) and runs guestshell enable (which boots a built-in Linux container inside the router — originally designed by Cisco so engineers could run Python automation scripts, but abused by the attacker because processes and files inside the Linux Guest Shell are completely hidden from standard IOS CLI commands like "show processes").',
        howItWorksInPractice:
          'Inside the Guest Shell Linux container, the attacker has a full bash environment with network access to the router’s interfaces—allowing them to compile and run custom C2 tunnels, SSH relays, and packet sniffers inside an isolated container where no traditional endpoint EDR agent can be installed.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ enables `iox` / `guestshell` inside Node ④ (Router Linux Guest Shell Container), and ⇠#2.2 launches the persistent Linux C2 tunnel.',
        detectionAndEvidence:
          'Documented in CISA Telecom Hardening Guide: IOS XE syslog `%IOX-6-GUESTSHELL_ENABLED` and unexpected `guestshell` NAT/VirtualPortGroup interfaces when Guest Shell is not used by operations.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1040',
        plainTitle: 'Sniffing Core `TACACS+` / `RADIUS` Credentials & Pivoting Into Core Telecom Enclaves',
        storyAnalogy:
          'From their hidden room inside the highway router, the attacker clips a wiretap (`EPC` / `tcpdump`) onto the router’s management line, records the passwords of senior network engineers as they log in, and uses those keys to walk into the core switching center.',
        simpleExplanation:
          'From inside the compromised router, the attacker activates Embedded Packet Capture (EPC — monitor capture, the router’s built-in traffic recording feature) or runs tcpdump inside Guest Shell to sniff management-plane traffic passing through the router. They intercept TACACS+ (TCP port 49) and RADIUS (UDP port 1812) authentication packets alongside weak/obfuscated Type-7 passwords in router configs (harvesting the credentials of senior telecom engineers so the attacker can log into core MPLS/BGP backbone routers as a legitimate administrator).',
        howItWorksInPractice:
          'Because core telecom routers sit at the intersection of administrative management networks and subscriber trunks, passive packet capture on the router itself harvests authentication secrets in transit without generating noisy port scans across the internal network.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ captures credentials and pivots from Node ④ into Node ⑤ (Core Telecom Management & Routing Plane), while Node ⑥ (Telecom SIEM) correlates AAA and Guest Shell anomalies.',
        detectionAndEvidence:
          'Documented in CISA Telecom Advisory: unauthorized `monitor capture` (EPC) sessions, GRE/IPsec tunnel creation, and TACACS+ logins from router loopback addresses.',
      },
    ],
  },

  'ms-forest-blizzard-gooseegg': {
    scenarioId: 'ms-forest-blizzard-gooseegg',
    briefing: {
      headline: 'Scenario Briefing: Forest Blizzard (APT28 / Fancy Bear) — "GooseEgg" Print Spooler Elevation of Privilege (CVE-2022-38028)',
      storyAnalogy:
        'Imagine a building where the mailroom’s high-privilege Printer Robot (`spoolsv.exe`, running as `SYSTEM`) uses a shared ledger (`PnPData`) to look up which driver helper (`mpdwconstr.dll`) it should load. Because a flaw lets a regular visitor edit the folder path in that ledger, the attacker changes the ledger to point to their own locker (`wayzgoose.dll`). When the Printer Robot wakes up, it loads the attacker’s library with full `SYSTEM` master-key authority.',
      plainSummary:
        'Documented by Microsoft Threat Intelligence (April 2024), the Forest Blizzard APT group (APT28 / STRONTIUM) used a custom post-exploitation tool named GooseEgg to escalate from a regular low-privilege user account to NT AUTHORITY\\SYSTEM via CVE-2022-38028 in the Windows Print Spooler service (spoolsv.exe — chosen because it runs as SYSTEM on every Windows machine by default). GooseEgg modifies a JavaScript constraints file (mpdw-constraints.js) used by the Microsoft XPS Document Writer printer driver, triggers the Print Spooler to corrupt permissions so a custom driver DLL (wayzgoose.dll) can be planted, and forces spoolsv.exe to load that DLL with full SYSTEM privileges.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Initial Low-Privilege Foothold), launch the GooseEgg launcher (`justice.bat` / `doit.bat`) on Node ③ (Windows Host), exploit the Print Spooler driver store (`spoolsv.exe` CVE-2022-38028) on Node ④ to load `wayzgoose.dll` as `SYSTEM`, and spawn the elevated backdoor toward Node ⑤ while Node ⑥ (Defender / SIEM) captures the driver-store write.',
      documentedAdvisory: 'Microsoft Threat Intelligence Forest Blizzard "GooseEgg" Report (Apr 2024) · CVE-2022-38028 · MITRE T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'GooseEgg Modifies the Print Driver Registry & `mpdw-constraints.js` to Trigger CVE-2022-38028',
        storyAnalogy:
          'The intruder runs a batch script (`doit.bat`) that edits the XPS Printer’s instruction sheet (`mpdw-constraints.js`) so the next time the Printer Service checks its settings, it accidentally unlocks its own protected driver cabinet.',
        simpleExplanation:
          'Starting from a standard low-privilege user session (which cannot install programs or read other users’ passwords), the attacker runs a batch launcher (doit.bat / justice.bat) that executes the GooseEgg binary. GooseEgg creates a custom printer driver key in the Registry and modifies mpdw-constraints.js (a JavaScript configuration file used by the built-in Microsoft XPS Document Writer printer driver to validate print ticket settings — crafted with oversized data to trigger CVE-2022-38028 when the Print Spooler reads it).',
        howItWorksInPractice:
          'When C:\\Windows\\System32\\spoolsv.exe (which runs as NT AUTHORITY\\SYSTEM) parses the malformed mpdw-constraints.js file inside the DriverStore\\FileRepository directory, a memory corruption / permission flaw (CVE-2022-38028) allows the low-privilege user to overwrite the printer driver’s PnPData / DriverFile path.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (GooseEgg Launcher `doit.bat`) to Node ④ (`spoolsv.exe` Print Spooler CVE-2022-38028), and return arrow ⇠#1.2 corrupting the driver descriptor as `SYSTEM`.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intelligence: modification of `mpdw-constraints.js` in the `DriverStore\\FileRepository` and anomalous Print Spooler registry edits.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.001',
        plainTitle: 'Forcing `spoolsv.exe` (SYSTEM) to Load the Rogue `wayzgoose.dll` Driver Module',
        storyAnalogy:
          'Now that the printer ledger points to `wayzgoose.dll`, GooseEgg sends a dummy print job—waking up `spoolsv.exe` (`SYSTEM`), which dutifully loads `wayzgoose.dll` into its own `SYSTEM`-privileged memory.',
        simpleExplanation:
          'With the driver path redirected by the exploit, GooseEgg drops its companion malicious library (wayzgoose.dll) into a writable folder and sends an RPC print-configuration call to wake up spoolsv.exe. Because spoolsv.exe runs as NT AUTHORITY\\SYSTEM (the highest local operating-system account on Windows), when it calls LoadLibrary() on the registered printer driver, wayzgoose.dll is loaded directly into spoolsv.exe’s memory and executes with full SYSTEM master-key privileges.',
        howItWorksInPractice:
          'Instead of injecting memory into a SYSTEM process from the outside (which Windows Protected Process Light and EDR memory hooks block), CVE-2022-38028 tricks spoolsv.exe into voluntarily loading wayzgoose.dll as if it were an official Microsoft printer driver.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ loads `wayzgoose.dll` into `spoolsv.exe` (`NT AUTHORITY\\SYSTEM`), and ⇠#2.2 confirms `SYSTEM` token acquisition.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoaded): `C:\\Windows\\System32\\spoolsv.exe` loading an unsigned DLL (`wayzgoose*.dll`) outside standard signed Microsoft print drivers.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1543.003',
        plainTitle: 'Spawning a SYSTEM Command Shell (`who.bat`) & Installing a Persistent Service Backdoor',
        storyAnalogy:
          'Running inside the `SYSTEM` Printer Robot, `wayzgoose.dll` opens a master-key backdoor service and connects out to the operator’s command center.',
        simpleExplanation:
          'Now executing inside spoolsv.exe as NT AUTHORITY\\SYSTEM, wayzgoose.dll launches the attacker’s post-exploitation script (who.bat — which inherits spoolsv.exe’s SYSTEM security token so every command it runs has total control of the computer), registers a persistent Windows service backdoor, and opens an outbound C2 channel so Forest Blizzard can dump LSASS credentials and move laterally.',
        howItWorksInPractice:
          'In Windows, any child process created via CreateProcess inherits the security token of its parent process by default. However, because a legitimate Print Spooler (spoolsv.exe) should only talk to printers and never spawn cmd.exe or powershell.exe, this parent-child relationship is a classic high-confidence detection signal.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ spawns the `SYSTEM` payload from Node ④ (`spoolsv.exe`) and connects to Node ⑤ (Forest Blizzard C2), while Node ⑥ (SIEM / Defender) triggers a critical alert.',
        detectionAndEvidence:
          'Documented in Sigma Rule `proc_creation_win_spoolsv_susp_child_processes` & Sysmon EventID 1: `ParentImage: C:\\Windows\\System32\\spoolsv.exe` spawning `cmd.exe` or `powershell.exe`.',
      },
    ],
  },

  'unit42-star-blizzard-evilginx-aitm': {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    briefing: {
      headline: 'Scenario Briefing: Star Blizzard (SEABORGIUM / COLDRIVER) — Evilginx Adversary-in-the-Middle (AiTM) Session Cookie Theft',
      storyAnalogy:
        'Imagine a fake ATM booth placed right in front of a real bank window with a two-way mirror between them. When you walk up and type your PIN and tap your 6-digit phone MFA code, the fake booth immediately types those exact digits into the real bank window behind the glass. The real bank says: "Welcome! Here is your golden VIP Day Pass (`ESTSAUTHPERSISTENT` cookie)." The fake booth photocopies your golden Day Pass as it hands it to you—and now the thief can walk into the bank all day using their copy of your pass without ever needing your phone again.',
      plainSummary:
        'Documented by Microsoft Threat Intelligence, CISA, and Palo Alto Networks Unit 42, this scenario explains how Adversary-in-the-Middle (AiTM) phishing frameworks like Evilginx defeat traditional Multi-Factor Authentication (MFA) such as SMS codes, authenticator apps (TOTP), and push notifications. Instead of hosting a static fake login page that only steals a password, the attacker’s Evilginx server acts as a live reverse proxy sitting between the victim’s browser and the real login.microsoftonline.com server. When the victim types their password and approves their MFA prompt, Evilginx forwards that traffic to Microsoft in real time, and intercepts the resulting ESTSAUTHPERSISTENT session cookie (the post-MFA proof-of-login token) as Microsoft sends it back.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/③ (Victim Browser clicking the spear-phishing link), trace the live reverse-proxy relay through Node ②/④ (Evilginx AiTM Proxy Server) to the real Node ⑤ (Microsoft Entra ID `login.microsoftonline.com`), and see how Evilginx captures the `ESTSAUTHPERSISTENT` cookie in transit while Node ⑥ (Entra Identity Protection / SIEM) flags the session replay.',
      documentedAdvisory: 'Microsoft Threat Intelligence AiTM Phishing Report · CISA Star Blizzard Advisory · MITRE T1557 / T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1566.002',
        plainTitle: 'Victim Opens the Spear-Phishing Link & Evilginx Proxies the Real Microsoft Login Page Live',
        storyAnalogy:
          'The victim clicks a link to view a PDF document and lands at the two-way-mirror booth (`Evilginx`). Because the booth is relaying the real Microsoft login screen live from behind the glass, every logo, font, and custom company banner looks 100% authentic.',
        simpleExplanation:
          'After building trust via email, the attacker sends a link to a lookalike domain (e.g., login.micros0ft-auth-portal.com — registered with a valid Let’s Encrypt HTTPS certificate so the browser still displays a padlock icon). When the victim clicks the link, the attacker’s Evilginx server fetches the genuine login.microsoftonline.com page live in the background and rewrites the domain names inside the HTML on the fly (so the victim sees their own company’s real logo, custom background image, and live Microsoft login prompts).',
        howItWorksInPractice:
          'Unlike traditional phishing kits that host a static HTML copy of a login page (which breaks when MFA challenges or dynamic JavaScript run), an AiTM reverse proxy relays every HTTP request and response between the victim’s browser and Microsoft Entra ID in real time.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (Victim Browser) through Node ②/④ (Evilginx AiTM Reverse Proxy) to Node ⑤ (Real Identity Provider), and return arrow ⇠#1.2 rendering the live login page.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intelligence: Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after an email link click in Defender for Office 365.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1557',
        plainTitle: 'Relaying the Victim’s Password & Live MFA Code Through the Reverse Proxy',
        storyAnalogy:
          'The victim types their password and enters the 6-digit MFA code from their phone. The man-in-the-middle booth passes both straight through the window to Microsoft in milliseconds, and when Microsoft hands back the `Set-Cookie: ESTSAUTHPERSISTENT` VIP pass, the booth records a copy in its database.',
        simpleExplanation:
          'The victim enters their corporate password and completes their real MFA challenge (typing a 6-digit Authenticator code or tapping "Approve" on a push notification). Evilginx forwards both requests straight to login.microsoftonline.com in milliseconds. Once MFA succeeds, Microsoft responds with HTTP 200 OK containing Set-Cookie: ESTSAUTHPERSISTENT=... (the master browser session cookie that Microsoft issues *after* both password and MFA are verified — which passes through Evilginx in plaintext because the HTTPS connection from the victim terminates on the Evilginx proxy first).',
        howItWorksInPractice:
          'Because the victim’s TLS session terminates on the attacker’s Evilginx server before Evilginx opens a second TLS session to Microsoft, Evilginx can read and save every HTTP header—including Set-Cookie: ESTSAUTHPERSISTENT and ESTSAUTH—the instant MFA completes.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ relays the credentials + MFA challenge through Node ④ (Evilginx Proxy) to Node ⑤, and return arrow ⇠#2.2 returns the `Set-Cookie: ESTSAUTHPERSISTENT` session token captured by Evilginx.',
        detectionAndEvidence:
          'Documented in MITRE T1539 & Microsoft Entra Identity Protection: high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1539',
        plainTitle: 'Injecting the Stolen `ESTSAUTHPERSISTENT` Cookie to Access Email Without MFA',
        storyAnalogy:
          'Minutes later, the attacker pastes that photocopied `ESTSAUTHPERSISTENT` VIP pass into their own browser in another country, walks straight into the victim’s Outlook inbox, and sets up a hidden mail-forwarding rule so they keep getting copies of every email.',
        simpleExplanation:
          'The attacker imports the stolen ESTSAUTHPERSISTENT cookie into their own browser using a cookie editor and opens outlook.office.com. Because holding a valid ESTSAUTHPERSISTENT cookie tells Microsoft "this browser already passed password + MFA checks", Outlook opens the victim’s mailbox immediately without asking for a password or triggering an MFA prompt on the victim’s phone. The attacker then creates a hidden Inbox rule (New-InboxRule — automatically forwarding or moving incoming security/reset emails so the victim never notices ongoing access).',
        howItWorksInPractice:
          'Why did MFA fail to stop this? Because TOTP codes and push approvals only verify the login event, not the domain in the browser bar. Only phishing-resistant FIDO2 / WebAuthn passkeys (which cryptographically bind the login signature to the exact domain name login.microsoftonline.com) or Token Protection (device-bound session cookies) defeat AiTM proxies.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ replays the stolen `ESTSAUTHPERSISTENT` cookie from Node ①/④ directly against Node ⑤ (Exchange Online / Outlook), while Node ⑥ (SIEM) detects the same session ID used from two different IP addresses and ASNs.',
        detectionAndEvidence:
          'Documented in Microsoft Sentinel & Entra Sign-in Logs: identical `UniqueTokenIdentifier` / `SessionId` replayed from a second IP address followed by `New-InboxRule` creation in Unified Audit Logs.',
      },
    ],
  },

  'talos-arcanedoor-asa': {
    scenarioId: 'talos-arcanedoor-asa',
    briefing: {
      headline: 'Scenario Briefing: ArcaneDoor Campaign (UAT4356 / STORM-1849) — Cisco ASA Line Dancer & Line Runner Implants',
      storyAnalogy:
        'Imagine a border checkpoint guardhouse (a Cisco ASA VPN firewall) that has no security cameras inside its own booth. The attacker slips a hidden radio receiver (**Line Dancer**) into the guardhouse’s memory that listens for secret commands disguised inside regular traveler visa forms (`/CSCOSSLC/config-auth`), and welds a hidden spare key (**Line Runner**) into the checkpoint’s boot firmware (`disk0:`) so even if the building loses power and restarts, the backdoor comes right back to life.',
      plainSummary:
        'Documented by Cisco Talos, the UK NCSC, and CISA (April 2024), the ArcaneDoor espionage campaign targeted perimeter network devices—specifically Cisco Adaptive Security Appliances (ASA)—using two custom implants: Line Dancer (an in-memory shellcode interpreter that hooks the firewall’s core lina process so the attacker can send commands disguised inside normal VPN login requests on port 443) and Line Runner (a persistent boot backdoor that abuses a legacy startup archive on disk0: so the implant automatically reloads even if the firewall is rebooted).',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UAT4356 Operator), send crafted HTTPS requests to Node ②/③ (Cisco ASA Perimeter Firewall `/CSCOSSLC/config-auth`), trace the **Line Dancer** in-memory shellcode dispatcher and **Line Runner** boot persistence inside Node ④ (`lina` Process Memory & `disk0:`), and follow the silent packet capture and config exfiltration to Node ⑤ while Node ⑥ (NetFlow / Memory Integrity SIEM) detects the anomaly.',
      documentedAdvisory: 'Cisco Talos "ArcaneDoor" Report · CVE-2024-20353 & CVE-2024-20359 · MITRE ATT&CK T1542 / T1059',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Delivering Base64-Encoded Shellcode Payloads Inside AnyConnect `/CSCOSSLC/config-auth` Requests',
        storyAnalogy:
          'Every day, thousands of remote employees send `<config-auth>` XML forms to the Cisco ASA VPN gate to log in. The attacker sends that exact same XML form, but tucks a 32-byte secret handshake and Base64 shellcode inside the `<host-scan-reply>` field.',
        simpleExplanation:
          'To control the compromised Cisco ASA firewall without opening any suspicious new network port, the attacker sends standard HTTPS POST requests on port 443 to /CSCOSSLC/config-auth (the exact URL that every remote employee’s Cisco AnyConnect VPN client connects to every morning — allowing the attacker’s command-and-control traffic to blend seamlessly into legitimate corporate VPN logins). Inside the XML body’s <host-scan-reply> tag, the attacker places a 32-byte magic identifier followed by a Base64-encoded shellcode command.',
        howItWorksInPractice:
          'Normally, the ASA’s XML parser processes <host-scan-reply> during AnyConnect posture checks. Because the Line Dancer hook intercepts the buffer inside the lina process as soon as it spots the 32-byte magic header (before standard VPN authentication even finishes), the attacker can send commands without needing a valid VPN username or password.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (UAT4356 Operator) to Node ②/③ (Cisco ASA `/CSCOSSLC/config-auth`), and return arrow ⇠#1.2 passing the XML body to the hooked `lina` handler.',
        detectionAndEvidence:
          'Documented by Cisco Talos (CVE-2024-20353): anomalous POST requests to `/CSCOSSLC/config-auth` with oversized `<host-scan-reply>` payloads from non-VPN client IPs.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: '"Line Dancer" In-Memory Implant Disables Syslog & Executes Arbitrary CLI Commands',
        storyAnalogy:
          'When the **Line Dancer** implant inside the firewall’s `lina` process spots that 32-byte secret handshake, its first move is to unplug the guardhouse’s alarm bell (disabling Syslog and crash dumps) before silently running the attacker’s router commands.',
        simpleExplanation:
          'Inside the ASA’s main lina executable (the monolithic process that handles all firewalling, routing, and VPN sessions on a Cisco ASA), the Line Dancer memory-only implant decodes the incoming shellcode and executes it directly in RAM. Before running reconnaissance or capturing packets, Line Dancer patches the in-memory syslog logging function (temporarily silencing outbound syslog alerts so the SOC’s SIEM server never sees that someone just ran "show running-config" or started a packet capture) and disables crash dumps (so if an exploit attempt crashes a thread, no forensic core dump is written to disk).',
        howItWorksInPractice:
          'Because perimeter network appliances cannot run standard Windows/Linux EDR agents, modifying the running lina process in volatile RAM hides the implant from normal CLI checks—and can only be caught on-box by hashing the live memory text segment via verify /md5 system:memory/text.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ (`lina` Process Memory) invokes the Line Dancer shellcode dispatcher, and ⇠#2.2 returns the command output inside the HTTPS VPN response.',
        detectionAndEvidence:
          'Documented in Cisco Talos ArcaneDoor IOC Guide: `verify /md5 system:memory/text` hash mismatch on the running ASA `lina` text segment and unexpected gaps in ASA syslog sequence numbers.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542',
        plainTitle: '"Line Runner" Abuses `vpn_dessert.zip` (CVE-2024-20359) to Survive Firewall Reboots',
        storyAnalogy:
          'Every time a Cisco ASA firewall boots up, it automatically unzips and runs an old factory setup archive (`disk0:/.private/startup-config`) if one exists. **Line Runner** plants a booby-trapped zip file in that exact spot so every reboot automatically re-installs the backdoor.',
        simpleExplanation:
          'Because Line Dancer lives purely in RAM, rebooting the firewall would normally wipe it out. To survive reboots, the attacker exploits CVE-2024-20359 (a legacy feature in Cisco ASA where the boot sequence automatically looks for a leftover pre-configuration zip archive on the flash drive disk0: and runs the scripts inside it as root during startup). By planting their persistent backdoor (**Line Runner**) inside that legacy boot archive path, the firewall automatically re-infects its own memory every time the power is cycled.',
        howItWorksInPractice:
          'Combining Line Runner (disk0: boot persistence via CVE-2024-20359) with Line Dancer (volatile RAM command execution inside lina) gives the attacker both reboot survival and zero-footprint daily operation.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ persists Line Runner on Node ④ (`disk0:`) and exfiltrates captured VPN sessions and configs to Node ⑤, while Node ⑥ (SIEM / Forensic Check) detects the `.private` boot archive and `memory/text` hash divergence.',
        detectionAndEvidence:
          'Documented in Cisco Advisory CVE-2024-20359 & NCSC Guidance: unauthorized files on `disk0:` boot paths and `system:memory/text` integrity verification failure.',
      },
    ],
  },

  'talos-fortinet-coathanger-apt': {
    scenarioId: 'talos-fortinet-coathanger-apt',
    briefing: {
      headline: 'Scenario Briefing: COATHANGER RAT (CVE-2022-42475 / CVE-2023-27997) — FortiGate SSL-VPN Rootkit & `ld.so.preload` Hijack',
      storyAnalogy:
        'Imagine a fortress gate (a FortiGate firewall) where a burglar uses an oversized battering ram (`Heap Overflow` in `sslvpnd`) to slip inside. Once inside, the burglar hooks a tiny invisible coat hanger (`ld.so.preload` rootkit) onto the fortress’s coat rack so that every time an administrator runs the inspection command (`ps` or `ls`) to check if anyone is hiding in the room, the coat hanger intercepts the administrator’s glasses and erases the burglar from their field of view—and even hides a spare copy inside the emergency recovery partition (`flatkc`) to survive firmware updates.',
      plainSummary:
        'Documented by the Dutch Military Intelligence and Security Service (MIVD), NCTV, and Fortinet (February 2024), COATHANGER is a stealthy Remote Access Trojan (RAT) designed specifically for Fortinet FortiGate firewalls. After gaining initial entry via a heap buffer overflow in the FortiOS SSL-VPN daemon (sslvpnd, CVE-2022-42475 / CVE-2023-27997), COATHANGER hooks Linux userland libraries via /etc/ld.so.preload (forcing every program on the firewall to load the attacker’s filter library first, so the implant can hide its own files and processes from administrators) and hooks the flatkc boot unpacker so it survives firmware upgrades.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (APT Operator), send the heap-overflow payload to Node ②/③ (FortiGate SSL-VPN `/remote/logincheck` `sslvpnd`), trace the `/data2` filesystem implant and `ld.so.preload` system-call hooking inside Node ④ (COATHANGER Rootkit), and follow the hidden C2 channel to Node ⑤ while Node ⑥ (SIEM / Out-of-Band Forensics) detects the `sslvpnd` crash and preload hook.',
      documentedAdvisory: 'Dutch MIVD / NCTV Technical Report on COATHANGER (Feb 2024) · CVE-2022-42475 & CVE-2023-27997 · MITRE T1574.006',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Heap Buffer Overflow in FortiOS `sslvpnd` (`CVE-2022-42475` / `CVE-2023-27997`)',
        storyAnalogy:
          'The attacker sends an HTTPS request to the FortiGate VPN login gate with a falsified `Content-Length` label, causing the `sslvpnd` gatekeeper to pour extra bytes past the end of its memory bucket (`Heap Overflow`) and overwrite its own instruction pointer.',
        simpleExplanation:
          'The attacker sends a specially crafted HTTPS request with a manipulated Content-Length header or encrypted parameter (enc) to the FortiGate SSL-VPN web endpoint (/remote/logincheck or /remote/hostcheck_validate — public VPN login pages reachable from the internet without prior authentication). This triggers a heap-based buffer overflow inside the sslvpnd daemon (writing attacker-controlled bytes past the end of the allocated heap buffer to overwrite adjacent function pointers in RAM and hijack the CPU into running the attacker’s code).',
        howItWorksInPractice:
          'In FortiOS, sslvpnd and almost all system utilities are compiled into a single monolithic multi-call binary (/bin/init). By chaining Return-Oriented Programming (ROP) gadgets inside that binary, exploiting sslvpnd gives the attacker immediate code execution inside the underlying Linux OS of the firewall.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (APT Operator) to Node ②/③ (FortiGate `/remote/logincheck` `sslvpnd`), and return arrow ⇠#1.2 triggering the ROP chain and shell execution.',
        detectionAndEvidence:
          'Documented in Fortinet FG-IR-22-398 & MIVD Report: `Application sslvpnd crashed` entries in FortiOS crash logs (`diagnose debug crashlog read`) and anomalous requests to `/remote/logincheck`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.006',
        plainTitle: 'Hooking System Calls via `/etc/ld.so.preload` (`smartctl` / `preload.so`) to Hide From Admins',
        storyAnalogy:
          'Once inside, COATHANGER places a filter lens (`preload.so`) in `/etc/ld.so.preload`. Whenever any program on the firewall asks Linux "What files are in `/data2`?" or "What processes are running?", the filter lens intercepts the answer and deletes COATHANGER’s name before showing the list.',
        simpleExplanation:
          'COATHANGER stores its backdoor files inside the persistent /data2/ partition and writes the path of its malicious shared library (preload.so) into /etc/ld.so.preload (a special Linux dynamic-linker configuration file that forces every single program launched on the system to load preload.so *before* the standard C library libc.so). Because preload.so is loaded first, it intercepts file-listing and process-listing calls (removing COATHANGER’s files and PIDs from the results so an admin inspecting the firewall sees nothing unusual).',
        howItWorksInPractice:
          'By hooking user-space libc functions like readdir(), open(), and stat() via /etc/ld.so.preload, whenever an administrator runs a diagnostic CLI command on the FortiGate, the hooked library filters out any path containing the implant’s directory before returning the output to the terminal.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ writes the implant to `/data2` and hooks `/etc/ld.so.preload`, with ⇠#2.2 intercepting userland `libc` calls.',
        detectionAndEvidence:
          'Documented by Dutch MIVD: presence of `/etc/ld.so.preload` hooks and unauthorized binaries inside `/data2/` or `/bin/smartctl` when inspected via offline disk/memory forensics.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542',
        plainTitle: 'Patching the `flatkc` Reboot Binary to Survive FortiOS Firmware Upgrades',
        storyAnalogy:
          'Even if the IT team installs a brand-new FortiOS firmware update, COATHANGER has already tucked a backup copy of itself inside the emergency kernel unpacker (`flatkc`) so that as soon as the newly updated firewall reboots, it re-infects itself on startup.',
        simpleExplanation:
          'Normally, rebooting a FortiGate or installing a FortiOS firmware update wipes the temporary root filesystem in RAM and loads a clean image. To survive both reboots and firmware updates, COATHANGER replaces /bin/smartctl and hooks the flatkc boot binary (the low-level FortiOS unpacker that initializes the filesystem whenever the appliance boots up — causing the firewall to automatically copy the hidden backdoor from the persistent /data2 flash partition back into the freshly updated system on startup).',
        howItWorksInPractice:
          'Because standard firmware upgrades replace the main rootfs image but preserve persistent flash partitions like /data2 alongside hooked boot components, simply installing a FortiOS patch without wiping and reformatting the appliance leaves COATHANGER active.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ persists across boot inside Node ④ and opens the TLS C2 channel to Node ⑤, while Node ⑥ (SIEM / Out-of-Band NetFlow) detects the undocumented outbound TLS sessions from the firewall’s external interface.',
        detectionAndEvidence:
          'Documented in MIVD COATHANGER Advisory: outbound TLS traffic initiated by the FortiGate appliance itself to unknown external IPs and modified hashes on `/bin/smartctl`.',
      },
    ],
  },

  'f5-bigip-request-smuggling': {
    scenarioId: 'f5-bigip-request-smuggling',
    briefing: {
      headline: 'Scenario Briefing: F5 BIG-IP TMUI Auth Bypass & AJP Request Smuggling (CVE-2023-46747)',
      storyAnalogy:
        'Imagine a building with a strict front-door security guard (`Apache httpd`) and a trusting back-office clerk (`Apache Tomcat`) who talk to each other over an internal pneumatic tube (`AJP protocol`). A visitor sends a single long envelope whose outer label says it is just a public login-page check—so the front-door guard lets it through. Inside the pneumatic tube, however, the oversized message spills over and creates a brand-new second internal work order marked `REMOTE_USER = admin`. The back-office clerk reads that second forged work order and believes the front guard already verified the visitor as the building’s master administrator.',
      plainSummary:
        'Documented by ProjectDiscovery, Praetorian, and CISA (October–November 2023), CVE-2023-46747 is a critical unauthenticated Remote Code Execution vulnerability in the F5 BIG-IP Traffic Management User Interface (TMUI). The BIG-IP management web interface uses a two-tier architecture: a front-end Apache httpd server checks authentication and forwards requests over the binary Apache JServ Protocol (AJP) to a back-end Apache Tomcat server. By sending an HTTP request with a carefully sized header to a public .jsp page, the attacker triggers AJP Request Smuggling—injecting a forged second AJP packet straight into Tomcat with SC_A_REMOTE_USER=admin (tricking Tomcat into believing the front-end Apache server already authenticated the attacker as the master administrator).',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Attacker), send the crafted HTTP request to Node ②/③ (F5 BIG-IP TMUI Front-End Apache `:443`), trace the smuggled AJP packet (`0x1234` prefix + `SC_A_REMOTE_USER = admin`) entering Node ④ (Back-End Tomcat & `tmsh` Engine), and watch the `tmsh` root command execution on Node ⑤ detected by Node ⑥ (BIG-IP Audit & SIEM).',
      documentedAdvisory: 'F5 Security Advisory K000137353 · ProjectDiscovery CVE-2023-46747 Analysis · CISA KEV · MITRE T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Smuggling a Forged Second AJP Request Past Front-End Apache via `CVE-2023-46747`',
        storyAnalogy:
          'The attacker sends a request to a public login helper page (`/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp`) with a precisely sized HTTP header that overflows the internal AJP pneumatic tube packet—sneaking a hidden second AJP message (`REMOTE_USER=admin`) right behind it.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to a reachable TMUI endpoint (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp). By carefully sizing the HTTP headers and body, mod_proxy_ajp on the front-end Apache server miscalculates the binary AJP packet boundary and forwards the attacker’s raw payload bytes as a brand-new, second AJP request (starting with the AJP magic bytes 0x12 0x34) to the back-end Tomcat server on port 8009—with the internal AJP header attribute SC_A_REMOTE_USER set to "admin" (spoofing a fully authenticated administrator session because Tomcat blindly trusts whichever username the front-end Apache proxy puts in SC_A_REMOTE_USER).',
        howItWorksInPractice:
          'In a two-tier Apache + Tomcat AJP architecture, Tomcat does not re-verify passwords; it assumes the front-end Apache server already checked the user’s login before setting SC_A_REMOTE_USER. Smuggling a raw second AJP frame inside the socket stream lets an unauthenticated attacker inject SC_A_REMOTE_USER=admin directly into Tomcat.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① to Node ②/③ (F5 BIG-IP Apache `mod_proxy_ajp`), and return arrow ⇠#1.2 smuggling the forged `REMOTE_USER=admin` AJP packet into Node ④ (Tomcat `:8009`).',
        detectionAndEvidence:
          'Documented by ProjectDiscovery & F5 K000137353: `/var/log/httpd/httpd_errors` and Tomcat logs showing anomalous AJP header parsing and unauthenticated hits to `/tmui/Control/jspmap/`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Using the Smuggled Admin Context to Create a Rogue BIG-IP Administrator via `form_page`',
        storyAnalogy:
          'Fooled by the forged `REMOTE_USER=admin` stamp on the smuggled work order, the back-end Tomcat clerk opens the internal `UserCreate` ledger and registers a brand-new administrator account with full bash terminal access.',
        simpleExplanation:
          'Executing inside Tomcat under the forged REMOTE_USER=admin identity (which bypasses the outer Apache authentication filter entirely because the smuggled request was born *behind* the Apache gatekeeper inside the internal AJP pipe), the request invokes the internal TMUI UserCreate handler (/tmui/Control/form) to create a new local BIG-IP administrator account granted Administrator role and Advanced Shell (/bin/bash) terminal access.',
        howItWorksInPractice:
          'When Tomcat processes the smuggled /tmui/Control/form request with SC_A_REMOTE_USER=admin, it communicates with the BIG-IP master control daemon (mcpd) to write the new administrator account into /config/bigip_user.conf.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ invokes the TMUI `UserCreate` handler as `admin`, and ⇠#2.2 registers the rogue administrator in `/config/bigip_user.conf`.',
        detectionAndEvidence:
          'Documented in `/var/log/audit` & `/var/log/ltm`: creation of a new user account with `role=admin` and `shell=bash` without a preceding interactive web login.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.004',
        plainTitle: 'Executing Arbitrary `root` Commands via `tmshCmd.jsp` (`util bash -c`)',
        storyAnalogy:
          'With their newly minted administrator account, the attacker calls the `tmsh` command runner to launch `bash -c` as `root` and extract all SSL private keys and internal server credentials managed by the load balancer.',
        simpleExplanation:
          'Using the newly created admin account (or directly via a smuggled tmshCmd.jsp request), the attacker runs tmsh run /util bash -c "..." (abusing the Traffic Management Shell’s built-in "/util bash" utility to break out of the restricted appliance CLI into an unrestricted Linux root shell). With root access on the load balancer, they extract SSL/TLS private keys (/config/filestore/files_d/Common_d/certificate_key_d/ — allowing them to decrypt HTTPS traffic for the company’s web apps) and backend server credentials.',
        howItWorksInPractice:
          'Because an F5 BIG-IP sits at the front of the datacenter terminating TLS connections and load-balancing internal servers, root access on the appliance exposes both private TLS keys and direct network paths into internal application VLANs.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `tmsh run /util bash` on Node ⑤ (BIG-IP Root OS & SSL Vault) while Node ⑥ (SIEM) alerts on `auditd` `tmsh` bash execution.',
        detectionAndEvidence:
          'Documented in F5 K000137353 (`/var/log/audit`): `mcpd` / `tmsh` audit log entries showing `run /util bash -c` executed from `tmui` / `tomcat`.',
      },
    ],
  },

  'splunk-ivanti-connect-secure': {
    scenarioId: 'splunk-ivanti-connect-secure',
    briefing: {
      headline: 'Scenario Briefing: Ivanti Connect Secure Zero-Day Chain (CVE-2023-46805 & CVE-2024-21887) — "WIREFIRE" Webshell',
      storyAnalogy:
        'Imagine a secure government building where visitors must show an ID badge at the outer checkpoint before reaching any internal office. However, a hallway shortcut (`../` path traversal) lets anyone walk around the outer checkpoint straight to the Python maintenance office (`/api/v1/license/keys-status/`). Once at the maintenance office window, the visitor hands over a form containing `; shell_command #`—and the clerk types it straight into the building’s `root` terminal and installs a hidden translator (**WIREFIRE**) inside the public login page.',
      plainSummary:
        'Documented by Volexity, Mandiant, CISA (Emergency Directive 24-01), and Splunk SURGe (January 2024), this scenario traces the two-bug zero-day chain used by UTA0178 to compromise Ivanti Connect Secure VPN appliances. By combining CVE-2023-46805 (an authentication bypass using "../../" path traversal inside /api/v1/totp/user-backup-code/../../license/keys-status/ so the outer web gatekeeper thinks the user is visiting an unauthenticated login-helper page) with CVE-2024-21887 (an OS command injection flaw where the backend Python service passes the URL parameter directly into a root popen() shell call), an unauthenticated attacker executes arbitrary root commands and implants the WIREFIRE Python webshell.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0178 Operator), send the path-traversal + command-injection request to Node ②/③ (Ivanti Connect Secure `/api/v1/totp/user-backup-code/../../license/keys-status/`), trace the `popen()` root execution and **WIREFIRE** webshell injection inside Node ④ (`web` REST Daemon & `visits.py`), and follow the VPN credential harvesting on Node ⑤ monitored by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA Emergency Directive 24-01 · Volexity UTA0178 & Mandiant UNC5221 Ivanti Zero-Day Analysis · CVE-2023-46805 & CVE-2024-21887',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Bypassing Authentication With `../../` Traversal Through `/api/v1/totp/user-backup-code/` (CVE-2023-46805)',
        storyAnalogy:
          'The outer door guard (`web` daemon) has a checklist that says: "Anyone walking down the `/api/v1/totp/user-backup-code/` hallway does not need to be logged in yet." The attacker starts down that hallway, but immediately takes two `../../` steps backward into the restricted `/license/keys-status/` room—slipping right past the outer guard.',
        simpleExplanation:
          'In Ivanti Connect Secure, the outer web gatekeeper checks whether a requested URL starts with a public prefix like /api/v1/totp/user-backup-code/ (an endpoint that *must* be reachable before login so users who lost their phone can submit a backup 2FA code). By requesting /api/v1/totp/user-backup-code/../../license/keys-status/, the outer gatekeeper sees the allowed prefix and waves the request through without asking for a password—while the internal Python router resolves the "../../" path traversal and hands the request straight to the restricted admin-only /api/v1/license/keys-status/ endpoint.',
        howItWorksInPractice:
          'Because the authentication filter checked the raw un-normalized URI prefix (startswith("/api/v1/totp/user-backup-code")) before the backend web framework normalized "../" segments (CVE-2023-46805), any unauthenticated internet client can reach any internal REST API endpoint on the VPN appliance.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Attacker) to Node ②/③ (Ivanti VPN Gateway `/api/v1/totp/user-backup-code/../../license/keys-status/`), and return arrow ⇠#1.2 bypassing the auth filter.',
        detectionAndEvidence:
          'Documented in CISA ED 24-01 & Splunk SURGe: HTTP requests containing `/api/v1/totp/user-backup-code/..` or `/api/v1/cav/client/status/..`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Injecting Shell Commands Into `keys-status` URL Parameters (CVE-2024-21887)',
        storyAnalogy:
          'Now standing at the restricted `/license/keys-status/` counter without ever logging in, the attacker writes `;python -c ... #` in the node-name field. The Python clerk pastes that string straight into a `popen()` shell command and runs it as `root`.',
        simpleExplanation:
          'Once the path-traversal request reaches /api/v1/license/keys-status/;python%20-c%20..., the backend Python handler takes the URL parameter and passes it directly into subprocess.Popen(..., shell=True) without input sanitization (CVE-2024-21887 — an OS command injection flaw where untrusted URL characters are interpreted as live Linux shell commands). Inside that string, the semicolon (; — which in Bash/sh terminates the legitimate license-check command and immediately executes the attacker’s python -c payload right behind it) runs the attacker’s code with full root privileges.',
        howItWorksInPractice:
          'Why did the attacker chain two CVEs? Because CVE-2024-21887 (command injection in keys-status) normally required an administrator login, and CVE-2023-46805 (path traversal) only bypassed authentication without running code. Combining both inside a single HTTP URL turns them into a 1-packet unauthenticated root RCE.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers `popen()` inside Node ④ (Ivanti Python REST Backend), and ⇠#2.2 executes the stage-1 payload as `root`.',
        detectionAndEvidence:
          'Documented by Volexity & Mandiant: Ivanti unallocated log / syslog entries showing `/api/v1/license/keys-status/;` followed by unexpected child processes of the `web` daemon.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Implanting "WIREFIRE" in `visits.py`, "ZIPLINE" via `LD_PRELOAD` & "WARPWIRE" Credential Stealer',
        storyAnalogy:
          'To stay inside permanently, the attacker remounts the read-only floor tiles as writable, slips the **WIREFIRE** webshell into `visits.py`, plants the **ZIPLINE** `LD_PRELOAD` rootkit in `libsecure.so`, and modifies the login page JavaScript (`WARPWIRE`) to steal every employee’s plaintext VPN password as they log in.',
        simpleExplanation:
          'Synthesizing Volexity (UTA0178) and Mandiant (UNC5221) findings, with root access on the VPN appliance the attacker runs mount -o remount,rw / (temporarily unlocking the appliance’s read-only system partition so built-in files can be edited) and deploys a multi-layered malware suite: (1) Volexity’s WIREFIRE Python webshell injected directly inside visits.py (modifying an already-existing API file so basic file-count checks do not spot an extra file) and WARPWIRE JavaScript credential harvester injected into the VPN login page to steal plaintext Active Directory passwords; plus (2) Mandiant’s ZIPLINE passive backdoor loaded via LD_PRELOAD inside libsecure.so (intercepting accept() network calls inside the legitimate Ivanti web daemon).',
        howItWorksInPractice:
          'As Mandiant UNC5221 documented, the threat actor also patches ComponentIntegrity.pm (so Ivanti’s built-in Integrity Checker Tool reports "0 modified files" when an admin runs an internal self-check, which is why CISA ED 24-01 mandated running the external offline ICT snapshot tool).',
        diagramAlignment:
          'On the diagram, arrow #3.1→ implants WIREFIRE/ZIPLINE on Node ④ and harvests VPN user credentials via WARPWIRE on Node ⑤, while Node ⑥ (Splunk SIEM / External ICT) detects the `visits.py` modification and outbound traffic.',
        detectionAndEvidence:
          'Documented by Volexity (UTA0178) & Mandiant (UNC5221): modification of `visits.py`, `libsecure.so` (`ZIPLINE`), and `ComponentIntegrity.pm` discovered via external Integrity Checker Tool (ICT) snapshots.',
      },
    ],
  },

  'splunk-citrix-bleed-session-hijack': {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    briefing: {
      headline: 'Scenario Briefing: Citrix Bleed (CVE-2023-4966) — Leaking Session Tokens from NetScaler Memory to Bypass MFA',
      storyAnalogy:
        'Imagine asking a hotel clerk to write your name on six lines of a 1-page welcome form, and then photocopy that page for you. Instead of giving a normal 10-letter name, you hand the clerk a 24,000-letter name (`Host:` header). The clerk’s 1-page form runs out of space after line 5, so the clerk stops writing—but when they walk over to the photocopier, they tell the machine: "Copy 147,000 letters worth of paper from my desk!" The photocopier copies the 1-page welcome form PLUS the confidential ledger sitting right next to it on the desk—which contains the active VIP room key (`NSC_AAAC` session cookie) of an administrator who already passed MFA.',
      plainSummary:
        'Synthesizing Assetnote’s vulnerability root-cause research, CISA/Mandiant Advisory AA23-325A, and Splunk SURGe detection telemetry, "Citrix Bleed" (CVE-2023-4966) is a memory over-read flaw in Citrix NetScaler ADC and Gateway appliances. When an attacker sends an HTTP GET request to the OpenID Connect configuration page with an abnormally long Host header (~24,576 characters), the appliance constructs a JSON response using snprintf() without checking that the buffer overflowed—causing it to dump ~16 KB of raw adjacent server RAM back in the HTTP response. Inside that leaked memory sits the plaintext NSC_AAAC session cookie (the active post-MFA session token of a logged-in user or administrator).',
      diagramTopologySummary:
        'On the diagram: Node ① (Attacker) sends the oversized `Host` header request to Node ②/③ (Citrix NetScaler Gateway `nsppe`). Node ④ (`nsppe` Memory Buffer & Session Replay) leaks the 65-byte `NSC_AAAC` token, allowing the attacker to hijack a Virtual Desktop session and pivot via DCOM to Node ⑤ (Internal Domain Server), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'Assetnote CVE-2023-4966 Root-Cause · CISA/Mandiant AA23-325A · Splunk SURGe Citrix Bleed Analysis · MITRE T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending an Oversized HTTP "Host" Header to Leak Adjacent NetScaler RAM (CVE-2023-4966)',
        storyAnalogy:
          'The attacker asks the public OpenID info desk (`/oauth/idp/.well-known/openid-configuration`) for its standard welcome sheet while supplying a 24,576-byte `Host` name. Because `snprintf()` reports how many bytes it *wanted* to write (147 KB) rather than the size of the 131 KB paper sheet, the server sends back 16 KB of raw adjacent RAM right after the welcome sheet.',
        simpleExplanation:
          'As reverse-engineered by Assetnote, the attacker sends an unauthenticated HTTPS GET request to /oauth/idp/.well-known/openid-configuration (a public discovery page on the Citrix NetScaler Gateway whose ns_aaa_oauthrp_send_openid_config function inserts the caller’s HTTP Host header into six JSON URL fields: issuer, authorization_endpoint, token_endpoint, jwks_uri, userinfo_endpoint, and end_session_endpoint). By sending a 24,576-byte Host header, the 6 copies total ~147 KB—exceeding the server’s 131,072-byte (`0x20000`) stack response buffer. Because C’s snprintf() function returns how many bytes it *wanted* to write (147 KB) rather than how many bytes actually fit in the 128 KB buffer, NetScaler’s SSL_write transmits the 128 KB buffer PLUS ~16 KB of raw adjacent nsppe memory straight back to the attacker.',
        howItWorksInPractice:
          'In the C standard library, snprintf(buf, size, fmt, ...) stops writing at size bytes to prevent a crash, but returns the theoretical total length of the formatted string. Passing that unchecked return value directly to the HTTP socket writer causes an out-of-bounds memory over-read (CVE-2023-4966) from the NetScaler packet engine (nsppe).',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the 24 KB `Host` header from Node ① to Node ②/③ (Citrix NetScaler `/oauth/idp/`), and ⇠#1.2 returns HTTP 200 OK leaking 131 KB of memory.',
        detectionAndEvidence:
          'Documented in Assetnote, CISA AA23-325A & Suricata SID 2048918: `GET /oauth/idp/.well-known/openid-configuration` with oversized `Host` header and >130 KB HTTP 200 response.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1539',
        plainTitle: 'Extracting the 65-Character "NSC_AAAC" Cookie & Hijacking an Active MFA Session',
        storyAnalogy:
          'Scanning the accidentally photocopied desk pages, the attacker spots a 65-digit hexadecimal VIP wristband (`NSC_AAAC`) belonging to an administrator who is currently logged in. Clipping that wristband onto their own browser lets the attacker step straight into the admin’s active Citrix Virtual Desktop without any password or MFA prompt.',
        simpleExplanation:
          'Scanning the leaked raw memory dump with a regular expression ([0-9a-f]{32,65}), the attacker extracts a 65-character hexadecimal string: a live NSC_AAAC session cookie (the master authentication token stored in nsppe memory for a user who has already logged in and passed Multi-Factor Authentication). By pasting Cookie: NSC_AAAC=<leaked_token> into their own browser, the attacker hijacks the administrator’s active Citrix session (bypassing both the password screen and MFA completely).',
        howItWorksInPractice:
          'Because the NSC_AAAC cookie represents an active server-side AAA session in NetScaler memory, even patching the appliance or resetting the victim’s Active Directory password does not kick the attacker out unless the administrator explicitly flushes active sessions on the appliance via kill aaa session -all and kill icaconnection -all.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ replays the leaked `NSC_AAAC` cookie on Node ③/④ (NetScaler Session Engine), and ⇠#2.2 grants VDI ICA desktop access without MFA.',
        detectionAndEvidence:
          'Documented in Splunk SURGe & NetScaler AAA Syslog (`ns.log`): Same `NSC_AAAC` session identifier active across two different client IP addresses / ASNs without a new authentication event.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1021.003',
        plainTitle: 'Pivoting from the Hijacked Citrix VDI Desktop into Internal Servers via DCOM/RPC',
        storyAnalogy:
          'Now sitting at the administrator’s virtual desk inside the building, the attacker uses the internal intercom (`DCOM MMC20.Application` over port 135) to command neighboring Windows servers to run commands on their behalf.',
        simpleExplanation:
          'Inside the hijacked Citrix Virtual Desktop (VDI) session, the attacker runs Active Directory discovery tools (adfind / SoftPerfect netscan), deploys remote management tunnels (AnyDesk / eHorus), and uses Distributed COM (DCOM — invoking the MMC20.Application COM object over RPC port 135, which instructs a remote Windows server to silently launch mmc.exe -Embedding and execute commands via Document.ActiveView.ExecuteShellCommand without creating a noisy new Windows service).',
        howItWorksInPractice:
          'Unlike PsExec or sc.exe (which register a new Windows Service and trigger System EventID 7045 on the target server), lateral movement via DCOM MMC20.Application abuses an already-registered Microsoft COM class over TCP/135.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pivots from Node ④ (VDI Session) to Node ⑤ (Internal Server via DCOM `:135`) while Node ⑥ (Splunk SIEM) correlates the session hijack.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A & Mandiant: `mmc.exe -Embedding` spawned on remote servers via DCOM following Citrix ICA session IP change.',
      },
    ],
  },

  'kaspersky-operation-triangulation': {
    scenarioId: 'kaspersky-operation-triangulation',
    briefing: {
      headline: 'Scenario Briefing: Operation Triangulation — Zero-Click iMessage Font Exploit & Undocumented Hardware DMA Bypass',
      storyAnalogy:
        'Imagine someone slips an invisible envelope under a locked door (`Zero-Click iMessage`), and the automatic mail-sorting machine (`IMAgent`) jams on a rigged font instruction (`ADJUST`, CVE-2023-41990) before the homeowner even knows a letter arrived. Once inside, the intruder discovers that the vault’s memory walls are protected by an unbreakable software lock (`Apple PPL`). Instead of fighting the software guard, the intruder walks over to a secret, undocumented maintenance panel wired directly into the silicon chip (`MMIO DMA Registers`, CVE-2023-38606) and orders the hardware’s own Direct Memory Access crane to lift the vault roof from the outside.',
      plainSummary:
        'Discovered and documented by Kaspersky GReAT (2023–2024), Operation Triangulation is one of the most sophisticated zero-click mobile exploit chains ever analyzed. The victim receives an invisible iMessage attachment that triggers a memory corruption bug in Apple’s TrueType font parser (the legacy ADJUST bytecode instruction, CVE-2023-41990 — executing automatically inside the background IMAgent daemon without the user ever tapping or seeing a notification). Next, to bypass Apple’s hardware-enforced Page Protection Layer (PPL), the exploit writes directly to undocumented CPU Memory-Mapped I/O (MMIO) hardware registers (CVE-2023-38606 — instructing the chip’s hardware DMA engine to overwrite protected kernel RAM from the outside) and plants the TriangleDB memory-only implant.',
      diagramTopologySummary:
        'On the diagram: Node ① (Triangulation Delivery Server) sends the invisible iMessage attachment through Node ② (APNs Push Gateway) to Node ③ (iOS `IMAgent` Process). Inside the device, Node ④ (`FontParser` CVE-2023-41990 & Hardware MMIO DMA CVE-2023-38606) patches kernel memory and launches Node ⑤ (`TriangleDB` In-Memory Implant), detected via forensic traces on Node ⑥ (Kaspersky Mobile Forensics / SIEM).',
      documentedAdvisory: 'Kaspersky GReAT Operation Triangulation Series · CVE-2023-41990 & CVE-2023-38606 · MITRE T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1203',
        plainTitle: 'Zero-Click iMessage Attachment Triggers the TrueType Font "ADJUST" Bug (CVE-2023-41990)',
        storyAnalogy:
          'An invisible iMessage arrives while the phone is sitting untouched on a table. As the background mail-preview clerk (`IMAgent`) tries to render a custom font inside the attachment, an obsolete 1990s font command (`ADJUST`) tricks the clerk into writing outside the page boundary.',
        simpleExplanation:
          'The target iPhone receives an iMessage containing a disguised PDF/archive attachment with an embedded TrueType font. Even while the phone is locked in a pocket, the background daemon IMAgent (the iOS process that automatically pre-processes incoming iMessage attachments before showing a notification) parses the font using libFontParser.dylib. Inside the font, an obsolete 1990s TrueType bytecode instruction named ADJUST (opcode 0x8F/0x90 — CVE-2023-41990) triggers an out-of-bounds memory write, giving the attacker instant code execution inside IMAgent with zero user clicks ("Zero-Click").',
        howItWorksInPractice:
          'TrueType fonts are not just static shapes; they contain a Turing-complete virtual machine (font hinting bytecode) designed in the early 1990s. Abusing the legacy ADJUST instruction corrupts the C++ vtable on the heap inside IMAgent before any UI notification is ever rendered.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ delivers the zero-click iMessage payload from Node ①/② to Node ③ (`IMAgent` FontParser), and ⇠#1.2 triggers RCE in userland.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: MobileBackup/Sysdiagnose artifacts showing anomalous `IMAgent` attachment processing followed by immediate message deletion.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Bypassing Hardware Memory Protection via Undocumented MMIO Registers (CVE-2023-38606)',
        storyAnalogy:
          'Even after taking over the kernel, the chip’s hardware Page Protection Layer (`PPL`) blocks any software from altering protected memory pages. So the exploit talks directly to an undocumented hardware controller on the Apple Silicon die (`0x206040000`) and commands its hardware DMA engine to overwrite the protected RAM directly—going completely around the CPU’s software guard.',
        simpleExplanation:
          'Even after escalating into the iOS kernel, Apple Silicon chips enforce a hardware-backed Page Protection Layer (PPL — which blocks even the operating system kernel itself from modifying protected user-signing tables or injecting unsigned code). To bypass PPL, the exploit writes directly to undocumented physical Memory-Mapped I/O (MMIO) hardware registers at address 0x206040000 (CVE-2023-38606 — an unmapped hardware debugging/DMA block built into the Apple A12–A16 System-on-Chip). By commanding this hardware DMA engine to write directly to physical RAM, the attacker overwrites PPL-protected kernel memory completely outside the CPU’s security checks.',
        howItWorksInPractice:
          'Because the CPU’s MMU/PPL checks only apply to memory writes executed by the CPU cores themselves, instructing an on-chip peripheral DMA engine via MMIO registers to write to physical memory bypasses PPL page-table write protection.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ writes to physical MMIO DMA registers to overwrite kernel memory, with ⇠#2.2 granting full kernel read/write.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT (37C3 presentation): Physical MMIO range writes at `0x206040000` bypassing PPL page table restrictions.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Deleting Message Traces & Running the Memory-Only "TriangleDB" Implant',
        storyAnalogy:
          'Once inside the vault, the exploit shreds the incoming iMessage from `sms.db` so the user never sees a trace, and runs the **TriangleDB** spyware strictly in volatile RAM—leaving behind only subtle water-meter readings (`DataUsage.sqlite` network byte counters) that forensic investigators can spot.',
        simpleExplanation:
          'With full kernel privileges, the exploit first deletes the triggering iMessage record from sms.db and attachment caches (so the victim never sees an unread message and forensic investigators cannot extract the exploit file from the phone), and then launches the TriangleDB spyware implant strictly in volatile RAM (meaning zero implant files are written to flash storage; if the phone is rebooted, the implant vanishes completely to avoid capture).',
        howItWorksInPractice:
          'Even though TriangleDB deletes its iMessage entry and runs only in RAM, iOS automatically records how many bytes of cellular/Wi-Fi data each process uses inside DataUsage.sqlite—leaving orphaned network-usage rows and timestamp gaps that Kaspersky’s triangle_check forensic tool uses to prove infection.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ deploys Node ⑤ (`TriangleDB` in RAM) and beacons out while Node ⑥ (Kaspersky MVT / SIEM) detects the `DataUsage.sqlite` & `OSAnalytics` anomalies.',
        detectionAndEvidence:
          'Documented in Kaspersky `triangle_check` tool: Orphaned network usage records in `DataUsage.sqlite` for system processes and timestamp gaps in `OSAnalytics`.',
      },
    ],
  },

  'kaspersky-toddycat-eset-dll': {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    briefing: {
      headline: 'Scenario Briefing: ToddyCat APT (CVE-2024-11859) — Abusing an ESET Command-Line Scanner for DLL Search-Order Hijacking',
      storyAnalogy:
        'Imagine a thief who brings a genuine, uniformed security officer (`ESET Command Line Scanner ecls.exe`) into a building, knowing that the officer has a habit of picking up whichever walkie-talkie (`version.dll`) is sitting on the nearest table before checking the official equipment locker (`System32`). The thief places a rigged walkie-talkie (`version.dll`) on the table right next to the officer; when the officer turns it on, the rigged walkie-talkie still forwards normal radio calls to headquarters so the officer doesn’t suspect a thing, while secretly running ToddyCat’s **TCESB** spy radio inside the officer’s own uniform.',
      plainSummary:
        'Documented by Kaspersky GReAT and ESET Security Advisory (CVE-2024-11859), this scenario illustrates how the ToddyCat APT group abused a legitimate, digitally signed security tool: the ESET Command Line Scanner (ecls.exe — chosen because security tools and IT administrators implicitly trust a binary signed by a major antivirus vendor). Due to a DLL search-order hijacking flaw in older versions of ecls.exe, placing a malicious DLL named version.dll in the same directory caused the trusted antivirus scanner itself to load and execute ToddyCat’s TCESB loader in memory.',
      diagramTopologySummary:
        'On the diagram: Node ①/② stages the signed `ecls.exe` binary and malicious `version.dll` on Node ③ (Target Workstation/Server). Running `ecls.exe` on Node ③ loads Node ④ (Trojanized `version.dll` & TCESB Loader), which decrypts the C2 implant communicating with Node ⑤ while Node ⑥ (SIEM / EDR) detects the unsigned DLL load.',
      documentedAdvisory: 'Kaspersky GReAT ToddyCat Report · ESET Advisory CVE-2024-11859 · MITRE ATT&CK T1574.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.001',
        plainTitle: 'Launching the Signed ESET Scanner (`ecls.exe`) Alongside a Malicious `version.dll`',
        storyAnalogy:
          'The attacker places a real, digitally signed ESET scanner (`ecls.exe`) and a forged helper library (`version.dll`) in the same folder (`C:\\ProgramData\\ESET\\`). Because of CVE-2024-11859, the moment `ecls.exe` starts, it grabs the `version.dll` sitting right next to it instead of the real Windows `System32\\version.dll`.',
        simpleExplanation:
          'The attacker drops a standalone, validly signed copy of ESET Command Line Scanner (ecls.exe — an authentic antivirus utility whose valid digital signature passes Windows AppLocker and antivirus file checks) into a writable folder like C:\\ProgramData\\ESET\\ right next to a malicious library named version.dll. Because of CVE-2024-11859 (where ecls.exe did not restrict its DLL load path to System32), the moment ecls.exe starts, Windows loads the attacker’s version.dll from C:\\ProgramData\\ESET\\ before checking C:\\Windows\\System32\\version.dll.',
        howItWorksInPractice:
          'Unlike KnownDLLs (such as kernel32.dll or ntdll.dll, which Windows forces every program to load exclusively from System32), version.dll is not on the Default KnownDLLs list—so any executable that imports version.dll without specifying LOAD_LIBRARY_SEARCH_SYSTEM32 will load a local version.dll from its own folder first.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (Signed `ecls.exe`) loading Node ④ (Malicious `version.dll` via CVE-2024-11859), with ⇠#1.2 logging Sysmon EventID 7.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 & ESET Advisory CVE-2024-11859: `ecls.exe` loading unsigned `version.dll` from outside `System32`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'Proxying Legitimate DLL Exports While Decrypting the ToddyCat TCESB Payload in Memory',
        storyAnalogy:
          'If the rigged `version.dll` didn’t know how to answer normal version-check questions, `ecls.exe` would crash immediately. So the rigged DLL acts as a middleman ("Export Proxying"): it forwards every real question to `C:\\Windows\\System32\\version.dll` while quietly decrypting ToddyCat’s **TCESB** backdoor in the background.',
        simpleExplanation:
          'If the attacker’s version.dll failed to answer the normal version-check functions that ecls.exe calls on startup (like GetFileVersionInfoW), ecls.exe would crash immediately with an error popup. To prevent a crash, the malicious version.dll uses DLL Export Proxying (forwarding every normal API call straight through to the real C:\\Windows\\System32\\version.dll so ecls.exe runs smoothly), while its background thread reads an encrypted file from disk and decrypts ToddyCat’s TCESB backdoor directly into RAM.',
        howItWorksInPractice:
          'By adding linker export forwarders in the malicious DLL’s Export Address Table (pointing functions like GetFileVersionInfoW to C:\\Windows\\System32\\version.GetFileVersionInfoW), the host program continues to work normally while the attacker’s decrypted shellcode runs in the same process memory.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ decrypts the TCESB payload into executable memory while proxying exports, and ⇠#2.2 confirms stage 2 initialization.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: Dual loading of `version.dll` (both local unsigned and `System32` signed) inside `ecls.exe` process memory.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing an Encrypted C2 Channel From Inside the Trusted ESET Process',
        storyAnalogy:
          'The malware now phones home from inside the signed `ecls.exe` process. However, defenders catch the trick because `ecls.exe` is an *offline* command-line file scanner—it has zero reason to ever open an outbound HTTPS connection to the internet!',
        simpleExplanation:
          'Running inside the memory space of the signed ecls.exe process (so process lists show a legitimate ESET security scanner), the decrypted TCESB backdoor opens an encrypted HTTPS tunnel on TCP port 443 to ToddyCat’s command-and-control server to harvest domain credentials and browser cookies.',
        howItWorksInPractice:
          'Why is this still detectable by defenders? Because ecls.exe is a standalone, offline on-demand file scanner that never connects to the internet during normal operation—meaning any Sysmon EventID 3 (NetworkConnect) log showing ecls.exe opening an outbound TCP/443 socket is an immediate indicator of compromise.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ (`ecls.exe` / TCESB) to Node ⑤ (External C2) and triggers an alert on Node ⑥ (SIEM / EDR).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 3 (NetworkConnect): Standalone command-line scanner `ecls.exe` initiating outbound TCP/443 connections.',
      },
    ],
  },

  'kaspersky-lazarus-byovd-fudmodule': {
    scenarioId: 'kaspersky-lazarus-byovd-fudmodule',
    briefing: {
      headline: 'Scenario Briefing: Lazarus Group FudModule Rootkit — Admin-to-Kernel Zero-Day (CVE-2024-21338) Blinding Windows EDR',
      storyAnalogy:
        'In the past, attackers who wanted to cut the security cameras inside the Windows kernel had to smuggle an old, flawed third-party security guard (`Bring Your Own Vulnerable Driver`) into the building—which modern Windows blocklists immediately spot at gate. In this scenario, Lazarus Group found a zero-day flaw (`CVE-2024-21338`) in a guard who is *already* hired and pre-installed inside every Windows building (`appid.sys`, the built-in AppLocker driver). By whispering a forged instruction (`IOCTL 0x22A018`) to `appid.sys`, the attacker tricks the driver into flipping their own clearance badge from "Visitor (`UserMode = 1`)" to "Supreme Kernel Architect (`KernelMode = 0`)"—and then quietly unplugs the EDR security agent’s cameras (`Kernel Callbacks` & `ETW`) without turning the EDR light off.',
      plainSummary:
        'Discovered by Avast and analyzed by Kaspersky and Microsoft (February 2024), this scenario shows how the Lazarus Group upgraded their FudModule rootkit. Previously, attackers had to drop a vulnerable third-party driver onto the system (Bring Your Own Vulnerable Driver — which Microsoft’s Vulnerable Driver Blocklist now blocks). Here, Lazarus exploited a zero-day flaw inside Windows’ own built-in AppLocker driver (appid.sys, CVE-2024-21338 — pre-installed and signed by Microsoft on every Windows machine). By sending a crafted IOCTL control code (0x22A018) to appid.sys, the attacker flips their thread’s kernel privilege bit (PreviousMode = 0) and zeroes out the kernel callback tables and ETW sensors that EDR agents rely on.',
      diagramTopologySummary:
        'On the diagram: From a local admin/service foothold (Node ①/②), the attacker runs the FudModule DLL on Node ③ (Windows Host). Node ④ (FudModule IOCTL Exploit) targets the built-in Windows driver `appid.sys` (CVE-2024-21338) to overwrite Node ⑤ (Kernel `PspCreateProcessNotifyRoutine` & ETW Ti-Sensor), detected via pre-blind telemetry on Node ⑥ (SIEM).',
      documentedAdvisory: 'Avast / Kaspersky Lazarus FudModule Report · Microsoft CVE-2024-21338 · MITRE ATT&CK T1068 / T1562.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Opening a Handle to the Built-in Windows AppLocker Driver (`\\\\.\\ahcache` / `appid.sys`)',
        storyAnalogy:
          'Instead of sneaking an untrusted third-party driver file onto the disk, the attacker simply walks up to the office door of Windows’ own pre-installed AppLocker driver (`\\Device\\AppId` / `appid.sys`) using a `LOCAL SERVICE` badge.',
        simpleExplanation:
          'Because modern Windows blocks untrusted kernel drivers via Driver Signature Enforcement (DSE) and Microsoft’s Vulnerable Driver Blocklist, the attacker does not drop any third-party .sys file onto the disk. Instead, they elevate a user-mode process to LOCAL SERVICE privileges (required because \\Device\\AppId’s access control list only lets LOCAL SERVICE, rather than standard Administrators, open a communication handle to it) and open a device handle to Windows’ own built-in AppLocker driver: C:\\Windows\\System32\\drivers\\appid.sys.',
        howItWorksInPractice:
          'Abusing a pre-installed inbox Windows driver (appid.sys — Living off the Land in the Kernel) completely sidesteps HVCI / Vulnerable Driver Blocklist checks because appid.sys is an official part of the Windows operating system.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (Userland Service Loader) opening a device handle to Node ④ (`appid.sys` Kernel Driver), with ⇠#1.2 returning the valid driver handle.',
        detectionAndEvidence:
          'Documented in Avast & Microsoft CVE-2024-21338 Analysis: Non-standard service process opening device handle to `\\Device\\AppId` and issuing IOCTL `0x22A018`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Sending a Crafted IOCTL (`0x22A018`) to Flip Kernel `PreviousMode` to `0`',
        storyAnalogy:
          'Every thread in Windows wears a tag (`KTHREAD.PreviousMode`) that says `1` (User Mode: check all permissions) or `0` (Kernel Mode: trust everything). By passing a forged pointer in `IOCTL 0x22A018`, FudModule tricks `appid.sys` into reaching over and flipping the attacker thread’s tag from `1` to `0`.',
        simpleExplanation:
          'FudModule calls DeviceIoControl with control code IOCTL 0x22A018 (which invokes the internal function AipSmartHashImageFile inside appid.sys) and passes a crafted structure containing a spoofed function/object pointer (CVE-2024-21338). This tricks the kernel driver into decrementing the attacker thread’s KTHREAD.PreviousMode byte in kernel memory from 1 (UserMode — where Windows blocks the thread from touching kernel RAM) to 0 (KernelMode — telling the Windows kernel to treat every subsequent NtReadVirtualMemory and NtWriteVirtualMemory call from this thread as if it came from the kernel itself, granting unlimited Ring-0 memory read/write).',
        howItWorksInPractice:
          'When a thread calls NtWriteVirtualMemory, the kernel checks KTHREAD->PreviousMode: if it is 1 (UserMode), the kernel rejects any target address above 0x7FFFFFFEFFFF (protecting kernel space). Once CVE-2024-21338 flips PreviousMode to 0 (KernelMode), the thread can read and overwrite any address in the Windows kernel directly from user mode.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ sends IOCTL `0x22A018` inside Node ④ (`appid.sys!AipSmartHashImageFile`), and ⇠#2.2 flips `KTHREAD.PreviousMode = 0`.',
        detectionAndEvidence:
          'Documented in Kernel Crash/ETW Telemetry: IOCTL `0x22A018` targeting `appid.sys` followed by `KTHREAD PreviousMode` modification.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Zeroing Out Kernel EDR Callbacks & Disabling Windows Threat-Intelligence ETW',
        storyAnalogy:
          'If a burglar shoots out a security camera, the guard desk immediately sees a "CAMERA OFFLINE" alarm. Instead, FudModule leaves the EDR security program running happily so its green status light stays on, while erasing its phone number from the kernel’s notification list (`PspCreateProcessNotifyRoutine`) so the kernel never tells the EDR about new malware.',
        simpleExplanation:
          'Instead of killing the endpoint’s EDR security service (which would immediately set off a "Sensor Offline" alarm on the SOC dashboard), FudModule uses its new kernel read/write access (Direct Kernel Object Manipulation — DKOM) to overwrite the kernel’s PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays with zeroes (erasing the kernel notification hooks that tell the EDR whenever a new process or thread starts) and disables EtwThreatIntProvRegHandle (shutting off Microsoft’s Kernel Threat-Intelligence telemetry feed so the EDR agent stays running with a green status light, but is completely blind and deaf).',
        howItWorksInPractice:
          'By surgically zeroing out the callback pointers registered by the security vendor’s kernel driver (.sys) and flipping the ProviderEnableInfo bit on the ETW Threat-Intelligence provider, Lazarus can subsequently dump LSASS and run malware with zero EDR alerts.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ overwrites Node ⑤ (Kernel Callback Arrays & ETW Handle) from Node ④ while Node ⑥ (SIEM) logs the sudden telemetry heartbeat drop.',
        detectionAndEvidence:
          'Documented by Kaspersky & Avast: Kernel Patch Protection (PatchGuard) / Defender Kernel Integrity alert on `PspCreateProcessNotifyRoutine` and `EtwThreatIntProvRegHandle` tampering.',
      },
    ],
  },

  'mandiant-apt29-teamcity-jetstream': {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    briefing: {
      headline: 'Scenario Briefing: APT29 JetBrains TeamCity Exploitation (CVE-2023-42793) — CI/CD Build Server Takeover',
      storyAnalogy:
        'Imagine a high-security software factory (a JetBrains TeamCity CI/CD server) where the security gate has a sloppy rule written on its clipboard: "Anyone walking to a door whose name ends with `/RPC2` doesn’t need to show an ID badge." The attacker walks up to the Super-Admin Key Minting machine (`/app/rest/users/id:1/tokens/`) and asks it to print a new master key named `RPC2` (`/app/rest/users/id:1/tokens/RPC2`). Because the URL ends with `/RPC2`, the gate lets them right through, and the machine prints a permanent Super-Admin Bearer Token on the spot!',
      plainSummary:
        'Synthesizing SonarSource & Rapid7’s Java servlet root-cause analysis with the Joint CISA/FBI/NSA/NCSC & Mandiant APT29 Advisory (October 2023), this scenario shows how APT29 (Midnight Blizzard) exploited CVE-2023-42793 in on-premises JetBrains TeamCity CI/CD servers. Because an authentication wildcard flaw (/**/RPC2 inside TeamCity’s RequestInterceptors class) allowed anyone to reach internal REST paths that ended with "/RPC2" without logging in, the attacker sent a single unauthenticated POST request (/app/rest/users/id:1/tokens/RPC2) to mint a permanent administrator bearer token for User ID 1, enabled the hidden internal debug command endpoint (/app/rest/debug/processes), and deployed the GraphicalProton backdoor.',
      diagramTopologySummary:
        'On the diagram: Node ① (APT29 Operator) sends the unauthenticated `/app/rest/users/id:1/tokens/RPC2` request through Node ② (Reverse Proxy) to Node ③ (TeamCity CI/CD Server). Inside TeamCity, Node ④ (REST Token Minter & `debug/processes` Executor) spawns commands and steals build secrets from Node ⑤ (Signing Keys & AD Vault), monitored by Node ⑥ (SIEM).',
      documentedAdvisory: 'SonarSource & Rapid7 CVE-2023-42793 Root-Cause · CISA/FBI/NSA/NCSC & Mandiant APT29 Advisory · MITRE ATT&CK T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Appending "/RPC2" to Mint an Admin Bearer Token Without Logging In (CVE-2023-42793)',
        storyAnalogy:
          'The developer meant to exempt only the root `/RPC2` path from login checks, but wrote `/**/RPC2`—accidentally exempting *every* URL in the entire server that ends with `/RPC2`. Requesting `/app/rest/users/id:1/tokens/RPC2` tricks TeamCity into creating a new admin token named `"RPC2"` for User ID 1 without asking for a password.',
        simpleExplanation:
          'As detailed by SonarSource and Rapid7, in vulnerable TeamCity versions the RequestInterceptors authentication filter excluded any URL matching /**/RPC2 from login checks (intended only to exempt the legacy XML-RPC endpoint at /RPC2, but the leading "/**" Ant-path wildcard accidentally exempted *every* URL on the server that ended with "/RPC2"). The attacker exploits this by sending an unauthenticated HTTP POST request to /app/rest/users/id:1/tokens/RPC2 (where "id:1" targets the primary built-in Super-Administrator account, and the REST API interprets the trailing "/RPC2" simply as the *name* to give the new token — causing TeamCity to mint and return a full Super-Admin Bearer token in the HTTP 200 response without asking for a password).',
        howItWorksInPractice:
          'Because TeamCity’s REST API endpoint for creating access tokens follows the URL template /app/rest/users/{userLocator}/tokens/{tokenName}, naming the token "RPC2" satisfies both the REST controller parameter and the /**/RPC2 authentication-bypass wildcard simultaneously (CVE-2023-42793).',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `POST /app/rest/users/id:1/tokens/RPC2` from Node ①/② to Node ③ (TeamCity Server), and ⇠#1.2 returns the plaintext admin Bearer token.',
        detectionAndEvidence:
          'Documented in TeamCity `teamcity-javaLogging` / access logs: `POST /app/rest/users/id:1/tokens/RPC2` returning HTTP 200 followed by `DELETE /app/rest/users/id:1/tokens/RPC2`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059',
        plainTitle: 'Using the Admin Token to Unlock the Internal Debug Process Executor (`/app/rest/debug/processes`)',
        storyAnalogy:
          'Holding the freshly minted Super-Admin token, the attacker flips on a hidden "Developer Debug Terminal" switch (`rest.debug.processes.enable=true`), runs their operating-system commands, and then immediately shreds the `RPC2` token so admins checking the active token list see nothing.',
        simpleExplanation:
          'Authenticating with Authorization: Bearer <token>, the attacker first sets the internal server property rest.debug.processes.enable=true (unlocking a hidden administrative diagnostic feature that is disabled by default), and then sends POST requests to /app/rest/debug/processes?exePath=cmd.exe&params=/c+... (telling the TeamCity Java server to spawn arbitrary OS commands on the underlying host). Seconds later, the attacker sends DELETE /app/rest/users/id:1/tokens/RPC2 (erasing the "RPC2" token right after creating a stealthier backdoor so an administrator checking the active tokens page in the UI sees nothing suspicious).',
        howItWorksInPractice:
          'Although deleting the RPC2 token removes it from the current UI token table, the token creation and deletion events remain recorded in logs/teamcity-activities.log and child process creations are captured by endpoint telemetry.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ invokes `/app/rest/debug/processes` on Node ④ (TeamCity JVM Process Spawner), and ⇠#2.2 spawns the child shell process.',
        detectionAndEvidence:
          'Documented by Mandiant: `POST /app/rest/debug/processes` in `teamcity-server.log` and `java.exe` spawning `whoami` / `nltest` / `curl`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Harvesting CI/CD Build Secrets, Deploying GraphicalProton & Pivoting into Active Directory',
        storyAnalogy:
          'Because the CI/CD build server is the automated assembly line that deploys software to every cloud and server in the company, taking over this one room hands the attacker the master keys to cloud deployments, source code, and code-signing certificates.',
        simpleExplanation:
          'Because a CI/CD build server is the central factory that compiles software and deploys it into production, it stores high-privilege secrets (AWS/Azure deployment keys, GitHub SSH keys, and Authenticode code-signing certificates). As documented by Mandiant and CISA, APT29 extracts TeamCity’s encryption keys (encryption-config.xml — allowing them to decrypt every stored cloud and database password in the CI/CD database), sideloads their GraphicalProton backdoor via DLL hijacking (using Microsoft OneDrive and Dropbox Graph APIs for encrypted C2), and pivots into Active Directory.',
        howItWorksInPractice:
          'Compromising a CI/CD server gives the attacker a force-multiplier: they can both steal production cloud credentials stored in build variables and inject malicious code into software packages being built and signed by the server.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ extracts secrets from Node ⑤ (CI/CD Vault & AD) via Node ④ while Node ⑥ (SIEM) triggers on TeamCity child process and token anomalies.',
        detectionAndEvidence:
          'Documented in Joint CISA Advisory & Mandiant: Creation of new TeamCity admin accounts in `teamcity-activities.log` and `GraphicalProton` OneDrive C2 beacons.',
      },
    ],
  },

  'splunk-screenconnect-slashandgrab': {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    briefing: {
      headline: 'Scenario Briefing: ConnectWise ScreenConnect "SlashAndGrab" (CVE-2024-1709) — Trailing-Slash Setup Wizard Reset',
      storyAnalogy:
        'Imagine a smart-lock system on an office building where the "First-Time Factory Setup Screen" (`/SetupWizard.aspx`) is supposed to be permanently locked after Day 1. However, the guard only checks if the visitor’s request *ends* with the exact letters `/SetupWizard.aspx`. By simply adding one extra forward slash at the end (`/SetupWizard.aspx/`), the guard says "That doesn’t end with `.aspx`, go right ahead!" while the web server behind the guard still opens `/SetupWizard.aspx`—letting any stranger on the internet re-run the Day-1 Factory Setup Wizard, overwrite the building’s master administrator database (`User.xml`), and broadcast commands to every computer managed by the IT team.',
      plainSummary:
        'Synthesizing Huntress ("SlashAndGrab"), ConnectWise Security Advisory (CVE-2024-1709 & CVE-2024-1708), and Splunk SURGe (February 2024), CVE-2024-1709 is one of the simplest yet most devastating authentication bypass bugs ever found in remote monitoring and management (RMM) software. On ConnectWise ScreenConnect servers, the initial installation wizard (/SetupWizard.aspx) is supposed to be blocked once the server is configured. However, appending a trailing slash or path suffix (/SetupWizard.aspx/anything — which fools the custom security check while ASP.NET still loads SetupWizard.aspx) reopens the first-time setup wizard—allowing anyone on the internet to overwrite the server’s primary administrator database (User.xml) and push SYSTEM commands to all connected customer endpoints.',
      diagramTopologySummary:
        'On the diagram: Node ① (Threat Actor) sends the `/SetupWizard.aspx/` request through Node ② (Edge Firewall `:8040`/`:443`) to Node ③ (ScreenConnect RMM Server). Inside the server, Node ④ (SetupWizard `User.xml` Overwrite & Extension Engine) resets the admin account and pushes remote PowerShell/MSI payloads to Node ⑤ (Managed Client Endpoints), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA KEV CVE-2024-1709 & CVE-2024-1708 · Huntress SlashAndGrab & Splunk SURGe Analysis · MITRE ATT&CK T1190 / T1219',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Accessing "/SetupWizard.aspx/anything" to Reopen the Initial Installation Wizard (CVE-2024-1709)',
        storyAnalogy:
          'Adding `/anything` after `/SetupWizard.aspx` fools the security filter into thinking you are visiting a different page, while ASP.NET treats `/anything` as harmless `PathInfo` metadata and opens the First-Time Setup Wizard anyway.',
        simpleExplanation:
          'As reverse-engineered by Huntress, to block access to the initial setup page after Day 1, ScreenConnect’s authentication filter checked whether the requested URL *ended* with the exact string /SetupWizard.aspx. By simply adding a trailing slash or suffix—GET /SetupWizard.aspx/anything—the string-ending check returns false and lets the request through without authentication, while Microsoft’s ASP.NET web engine still routes the request to SetupWizard.aspx (treating the trailing "/anything" as harmless Request.PathInfo metadata — CVE-2024-1709).',
        howItWorksInPractice:
          'In ASP.NET, a URL like /Page.aspx/extra is routed to the handler for /Page.aspx with Request.PathInfo set to "/extra". Because the security check tested Request.Path instead of Request.FilePath, a single trailing "/" bypassed the lock completely.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `GET /SetupWizard.aspx/anything` from Node ①/② to Node ③ (ScreenConnect Server), and ⇠#1.2 returns HTTP 200 SetupWizard form.',
        detectionAndEvidence:
          'Documented by Splunk SURGe & Huntress: HTTP GET/POST requests matching `/SetupWizard.aspx/*` returning status 200 on an already provisioned server.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Submitting the Setup Form to Overwrite the Server’s "User.xml" Administrator Database',
        storyAnalogy:
          'With the Day-1 Setup Wizard open in their browser, the attacker types in their own username and password and clicks "Finish"—wiping out the company’s real IT administrators in `App_Data\\User.xml` and making the attacker the sole super-admin.',
        simpleExplanation:
          'With the first-time setup wizard open in their browser, the attacker submits a new administrator username and password. ScreenConnect immediately overwrites C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml (the local XML database file that stores all administrator accounts and password hashes on the server — wiping out the company’s legitimate IT administrators and logging the attacker straight in as the sole Super-Admin). Furthermore, attackers can chain CVE-2024-1708 (a ZipSlip path-traversal flaw in ScreenConnect’s Extension uploader that writes `.ashx` webshells directly into `App_Extensions\\` for server-side persistence).',
        howItWorksInPractice:
          'Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch and returns an authenticated administrator session cookie to the attacker’s browser.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ overwrites `App_Data\\User.xml` with the rogue admin account, and ⇠#2.2 returns an authenticated admin session cookie.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 & ScreenConnect Audit Logs: Modification of `C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml` and `App_Extensions\\*.ashx` by `ScreenConnect.Service.exe`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1219',
        plainTitle: 'Abusing the RMM Console to Push SYSTEM Commands to Connected Client Machines',
        storyAnalogy:
          'Because ScreenConnect is the official remote-support tool installed on every employee laptop and server in the company (`ScreenConnect.ClientService.exe` running as `SYSTEM`), the attacker simply clicks "Run Command on All Machines" in their new admin console to deploy payloads everywhere at once.',
        simpleExplanation:
          'Why is compromising an RMM server so catastrophic? Because every laptop and server managed by the IT team has the ScreenConnect client agent (ScreenConnect.ClientService.exe — a trusted background service running with full NT AUTHORITY\\SYSTEM privileges) permanently connected to this server. From their hijacked admin console, the attacker selects all connected computers and broadcasts PowerShell or ransomware commands (which each endpoint agent writes into C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd and executes immediately as SYSTEM).',
        howItWorksInPractice:
          'Without needing a single exploit on the client workstations, the attacker uses ScreenConnect’s built-in "Backstage" command runner to execute arbitrary commands as NT AUTHORITY\\SYSTEM across hundreds or thousands of managed endpoints simultaneously.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pushes remote commands from Node ④ to Node ⑤ (Managed Endpoints running `ScreenConnect.ClientService.exe`) while Node ⑥ (Splunk SIEM) alerts.',
        detectionAndEvidence:
          'Documented by Huntress & Splunk SURGe: `ScreenConnect.ClientService.exe` spawning `cmd.exe` / `powershell.exe` from `C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd`.',
      },
    ],
  },
};
