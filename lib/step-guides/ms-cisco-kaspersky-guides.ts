import { RawScenarioStepGuideData } from '../scenario-step-guides';

export const MS_CISCO_KASPERSKY_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'ms-volt-typhoon-lotl': {
    scenarioId: 'ms-volt-typhoon-lotl',
    briefing: {
      headline: 'Scenario Briefing: Volt Typhoon (CISA AA23-144A) — "Living off the Land" & Extracting ntds.dit Without Malware',
      storyAnalogy:
        'Imagine an infiltrator who enters a high-security facility carrying zero weapons or burglar tools in their pockets. Instead, they pick up the facility’s own maintenance clipboard (`wmic.exe`), use the building’s built-in port-forwarding intercom (`netsh interface portproxy`) to relay messages through retired home routers (KV Botnet), and ask the facility’s official backup machine (`ntdsutil.exe`) to print a full copy of the master key vault (`ntds.dit`). Because every single action is performed by an official, factory-installed Windows utility, file-based antivirus scanners see zero foreign malware.',
      plainSummary:
        'Documented by Joint CISA/NSA/FBI/Microsoft Advisory AA23-144A, the Volt Typhoon APT group specializes in "Living off the Land" (LotL): compromising critical infrastructure networks and staying hidden for years without dropping custom malware binaries. Instead of using hacktools like Mimikatz that trigger antivirus immediately, Volt Typhoon routes traffic through a botnet of compromised SOHO routers ("KV Botnet"), runs built-in Windows administration commands (`wmic`, `ntdsutil`, `netsh`) that are already signed by Microsoft, creates a stealthy port-forwarding relay (`netsh interface portproxy`), and extracts the entire Active Directory password database (`ntds.dit`) using native backup utilities.',
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
          'Instead of connecting from a known datacenter IP, the attacker connects from a compromised small-office/home-office (SOHO) router in the same geographic region, and runs `netsh interface portproxy add v4tov4 listenport=8443 connectaddress=10.20.1.10 connectport=445` on a compromised Windows server to turn it into an internal traffic relay.',
        howItWorksInPractice:
          '`netsh.exe` is a built-in Windows networking utility. Its `portproxy` feature creates a persistent kernel/service-level TCP forwarder stored in the registry (`HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4`) so the attacker can reach the internal Domain Controller without installing any third-party proxy software.',
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
          'Active Directory locks `C:\\Windows\\NTDS\\ntds.dit` while the Domain Controller is running, so nobody can simply copy the file. To bypass that lock without dropping third-party dumping tools, the attacker runs `wmic process call create "cmd.exe /c ntdsutil \"ac i ntds\" \"ifm\" \"create full C:\\Windows\\Temp\\pro\" q q"`—telling Windows’ own AD maintenance tool to create a clean backup snapshot of `ntds.dit` and the `SYSTEM` registry hive.',
        howItWorksInPractice:
          'The `ifm` (Install From Media) option in `ntdsutil.exe` automatically creates a Volume Shadow Copy snapshot, copies `ntds.dit` (which contains the password hashes of every user and administrator in the company) plus the `SYSTEM` decryption bootkey into a temporary folder, and then deletes the shadow copy.',
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
          'The attacker compresses the dumped `ntds.dit` and `SYSTEM` files into a password-protected archive, transfers it back out through the `netsh portproxy` relay tunnel, deletes the temporary staging folder, and runs `wevtutil cl Security` / `wevtutil cl System` to clear Windows Event Logs.',
        howItWorksInPractice:
          'Once the attacker has both `ntds.dit` and the `SYSTEM` registry hive offline, they can decrypt the NTLM hash of every user—including `krbtgt` and all Domain Admins—giving them total control of the domain.',
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
        'Documented by Microsoft Security Response Center (MSRC) and Microsoft Threat Intelligence (January 2024), this scenario illustrates how Midnight Blizzard (APT29) compromised corporate Exchange Online mailboxes through an identity-and-OAuth chain. First, the attacker used a low-and-slow residential-proxy password spray to compromise a forgotten, non-production test tenant account that lacked MFA. From there, they abused an old OAuth application that had elevated permissions in the corporate environment, created additional malicious OAuth applications, granted them the powerful `full_access_as_app` Exchange Online role, and read corporate emails via EWS/Graph API without ever needing individual executives’ passwords.',
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
          'To avoid triggering automated IP lockouts, the attacker routes authentication requests through a rotating pool of residential proxy IPs and tries a small number of passwords against a legacy, non-production test tenant account that had not been enforced with Multi-Factor Authentication (MFA).',
        howItWorksInPractice:
          'Because each residential proxy IP only sends a handful of login attempts per day, traditional rate-based brute-force rules do not fire, allowing the attacker to quietly log into the forgotten test account.',
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
          'Inside the test environment, the attacker discovers a legacy OAuth test application that had been granted privileged directory permissions (`AppRoleAssignment.ReadWrite.All`) inside the main corporate tenant. Using that OAuth app’s credentials, the attacker registers new OAuth Service Principals, adds client secrets (`Add servicePrincipal credentials`), and assigns the `full_access_as_app` Office 365 Exchange Online role.',
        howItWorksInPractice:
          'In Microsoft Entra ID, `AppRoleAssignment.ReadWrite.All` allows an application to grant *itself* or another application any application-level permission—including `full_access_as_app`—without requiring interactive approval from a human Global Administrator.',
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
          'Authenticating purely as the rogue OAuth application (`grant_type=client_credentials`), the attacker calls Exchange Web Services (`https://outlook.office365.com/EWS/Exchange.asmx`) and Microsoft Graph API from the same residential proxy infrastructure to search and download emails from targeted corporate mailboxes.',
        howItWorksInPractice:
          'Because `full_access_as_app` is an application-level permission rather than a delegated user login, the attacker can access any mailbox in the Exchange tenant without ever logging in as that user or triggering user MFA prompts.',
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
        'Documented by CISA, FBI, NSA, and Microsoft Threat Intelligence (2024), the Salt Typhoon APT campaign targeted major telecommunications and ISP core networks. Rather than attacking regular office workstations, Salt Typhoon compromised internet-facing edge and core routing appliances (such as Cisco IOS XE routers), abused the router’s built-in Linux container environment ("Guest Shell") to run persistent Linux implants and SSH tunnels, captured network administrator `TACACS+` / `RADIUS` credentials in transit, and accessed sensitive core routing and lawful-intercept management planes.',
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
          'The attacker exploits an exposed management interface or stolen configuration credential on a telecom edge router (such as Cisco IOS XE Web UI `webui_wsma_http`) to execute privileged CLI commands (`privilege 15`) and create a hidden local administrator account.',
        howItWorksInPractice:
          'In Cisco IOS XE, Privilege Level 15 is the highest administrative tier (equivalent to `root`), allowing full modification of running configurations, routing tables (BGP/MPLS), and container services.',
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
          'Instead of dropping files on the standard IOS flash where `dir flash:` would easily reveal them, the attacker enables `iox` and starts the router’s built-in **Guest Shell** (`guestshell enable`)—a full Linux container running inside the router—where they deploy an encrypted tunnel and packet-capture utilities.',
        howItWorksInPractice:
          'Guest Shell is a legitimate Linux environment built into modern IOS XE routers for automated Python scripts. Standard router CLI commands (`show processes`) do not list processes running inside the Linux Guest Shell container, allowing the attacker’s tools to hide from routine router inspections.',
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
          'From inside the compromised router, the attacker uses Embedded Packet Capture (EPC) or `tcpdump` inside Guest Shell to sniff management traffic, extracts `TACACS+`, `RADIUS`, and SNMP credentials belonging to senior network engineers, and uses those credentials to hop across core MPLS/BGP routers and sensitive internal enclaves.',
        howItWorksInPractice:
          'Because core routers sit at the crossroads of administrative and subscriber traffic, compromising a single router allows passive credential harvesting (`MITRE T1040`) without generating noisy active scans.',
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
        'Documented by Microsoft Threat Intelligence (April 2024), the Forest Blizzard APT group (APT28 / STRONTIUM) used a custom post-exploitation tool named **GooseEgg** to escalate from a regular user account to `NT AUTHORITY\\SYSTEM` via CVE-2022-38028 in the Windows Print Spooler service (`spoolsv.exe`). GooseEgg modifies a JavaScript constraints file (`mpdw-constraints.js`) used by the Microsoft XPS Document Writer printer driver, triggers the Print Spooler to corrupt permissions so a custom driver DLL (`wayzgoose.dll`) can be planted, and forces `spoolsv.exe` (which runs as `SYSTEM`) to load that DLL and spawn a hidden backdoor.',
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
          'Starting from a standard low-privilege user session, the attacker runs a batch script (`doit.bat` / `justice.bat`) that launches the **GooseEgg** binary. GooseEgg creates a custom registry key under `HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Environments\\Windows x64\\Drivers` and crafts a malformed JavaScript constraints file (`mpdw-constraints.js`) for the built-in XPS Document Writer.',
        howItWorksInPractice:
          'When `spoolsv.exe` (running as `NT AUTHORITY\\SYSTEM`) parses the crafted `mpdw-constraints.js` file via CVE-2022-38028, an out-of-bounds write allows the low-privilege user to redirect the printer driver’s `PnPData` / `DriverFile` path.',
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
          'GooseEgg copies its companion malicious DLL (`wayzgoose.dll`) into a staging folder and invokes a COM/RPC call to the Print Spooler service (`spoolsv.exe`). Because `spoolsv.exe` runs as `NT AUTHORITY\\SYSTEM`, when it loads the registered printer driver DLL, `wayzgoose.dll` executes immediately with full `SYSTEM` privileges.',
        howItWorksInPractice:
          'Instead of injecting memory into `spoolsv.exe` from outside (which EDR hooks easily block), CVE-2022-38028 tricks `spoolsv.exe` into voluntarily calling `LoadLibrary()` on `wayzgoose.dll` as a printer driver.',
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
          'Running inside `spoolsv.exe` as `SYSTEM`, `wayzgoose.dll` executes the command passed to GooseEgg (such as `who.bat`), registers a persistent Windows service or scheduled task, and opens an outbound C2 channel so Forest Blizzard can harvest credentials across the host.',
        howItWorksInPractice:
          'Any child process spawned by `spoolsv.exe` inherits its `NT AUTHORITY\\SYSTEM` security token—making `spoolsv.exe` spawning `cmd.exe` or `powershell.exe` one of the clearest high-severity detections in Windows forensics.',
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
        'Documented by Microsoft Threat Intelligence, CISA, and Palo Alto Networks Unit 42, this scenario explains how **Adversary-in-the-Middle (AiTM)** phishing frameworks like **Evilginx** defeat traditional Multi-Factor Authentication (MFA) such as SMS codes, authenticator apps (TOTP), and push notifications. Instead of hosting a static fake login page that only steals a password, the attacker’s Evilginx server acts as a live reverse proxy sitting between the victim’s browser and the real `login.microsoftonline.com` server. When the victim types their password and approves their MFA prompt, Evilginx forwards that traffic to Microsoft in real time, and intercepts the resulting `ESTSAUTHPERSISTENT` session cookie as Microsoft sends it back.',
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
          'After building rapport via email, the attacker sends a link to a lookalike domain (e.g., `login.micros0ft-auth-portal.com`). When the victim’s browser opens that link, the attacker’s **Evilginx** server fetches the real `login.microsoftonline.com` page live in the background, rewrites the domain links on the fly, and serves the genuine Microsoft login UI to the victim.',
        howItWorksInPractice:
          'Because Evilginx proxies the real identity provider in real time rather than serving a static HTML copy, company branding, custom backgrounds, and dynamic JavaScript challenges all work identically to the real login page.',
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
          'The victim enters their corporate password and completes their real MFA challenge (entering a 6-digit Authenticator code or tapping "Approve" on their phone). Evilginx forwards both requests straight to `login.microsoftonline.com`. Microsoft verifies the MFA and responds with `HTTP 200 OK` containing `Set-Cookie: ESTSAUTHPERSISTENT=...`—which passes right through Evilginx in plaintext.',
        howItWorksInPractice:
          'Because TLS terminates on the Evilginx server before being re-encrypted to Microsoft, Evilginx can read and log every HTTP header—including `Set-Cookie: ESTSAUTHPERSISTENT` and `ESTSAUTH`—the instant MFA succeeds.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ relays the credentials + MFA challenge through Node ④ (Evilginx Proxy) to Node ⑤, and return arrow ⇠#2.2 returns the `Set-Cookie: ESTSAUTHPERSISTENT` session token captured by Evilginx.',
        detectionAndEvidence:
          'Documented inMITRE T1539 & Microsoft Entra Identity Protection: high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1539',
        plainTitle: 'Injecting the Stolen `ESTSAUTHPERSISTENT` Cookie to Access Email Without MFA',
        storyAnalogy:
          'Minutes later, the attacker pastes that photocopied `ESTSAUTHPERSISTENT` VIP pass into their own browser in another country, walks straight into the victim’s Outlook inbox, and sets up a hidden mail-forwarding rule so they keep getting copies of every email.',
        simpleExplanation:
          'The attacker imports the captured `ESTSAUTHPERSISTENT` cookie into their own browser using a cookie editor and navigates to `outlook.office.com`. Because the session cookie proves that MFA was already completed, Outlook opens the victim’s mailbox immediately without asking for a password or MFA—and the attacker creates a hidden Inbox forwarding rule to maintain access.',
        howItWorksInPractice:
          'Only phishing-resistant FIDO2 / WebAuthn passkeys or Token Protection (binding the cookie cryptographically to the device’s TPM) prevent AiTM proxy attacks, because FIDO2 binds the signature to the exact domain name in the browser’s address bar.',
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
        'Documented by Cisco Talos, the UK NCSC, and CISA (April 2024), the **ArcaneDoor** espionage campaign targeted perimeter network devices—specifically Cisco Adaptive Security Appliances (ASA)—using two custom implants: **Line Dancer** (an in-memory shellcode interpreter that executes arbitrary commands sent inside legitimate-looking VPN post-authentication HTTP requests) and **Line Runner** (a persistent backdoor that survives reboots and firmware upgrades by modifying a legacy pre-configuration zip archive on `disk0:`).',
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
          'To communicate with the compromised Cisco ASA firewall without opening any suspicious ports, the attacker sends standard HTTPS POST requests to the AnyConnect SSL VPN endpoint (`/CSCOSSLC/config-auth`) containing a 32-byte magic identifier and a Base64-encoded command payload inside the `<host-scan-reply>` XML tag.',
        howItWorksInPractice:
          'Because `/CSCOSSLC/config-auth` is the normal URL that every remote employee’s AnyConnect VPN client connects to, the attacker’s C2 traffic blends into ordinary corporate VPN login traffic on port 443.',
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
          'Inside the ASA’s core `lina` process, the **Line Dancer** memory-only implant intercepts the `<host-scan-reply>` buffer, verifies the 16-byte hash, and executes arbitrary position-independent shellcode—allowing the attacker to temporarily disable `syslog` logging, suppress crash dumps, and run privileged ASA CLI commands without generating log entries.',
        howItWorksInPractice:
          'Because perimeter firewalls do not run traditional Windows/Linux EDR agents, an implant that hooks the `lina` executable in RAM and suppresses outbound syslog messages can operate invisibly unless administrators verify `lina` memory integrity (`verify /md5 system:memory/text`).',
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
          'To ensure the backdoor survives even if the firewall is rebooted, the attacker exploits CVE-2024-20359: planting a maliciously crafted archive on the flash drive (`disk0:`) that the ASA’s legacy boot script automatically unzips and executes as `root` every time the appliance starts up (**Line Runner**).',
        howItWorksInPractice:
          'By combining **Line Runner** (disk boot persistence via CVE-2024-20359) with **Line Dancer** (volatile RAM command execution), the attacker achieves both stealthy runtime operation and persistence across reboots.',
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
        'Documented by the Dutch Military Intelligence and Security Service (MIVD), NCTV, and Fortinet (February 2024), **COATHANGER** is a stealthy Remote Access Trojan (RAT) designed specifically for Fortinet FortiGate firewalls. After gaining initial entry via a heap buffer overflow in the FortiOS SSL-VPN daemon (`sslvpnd`, CVE-2022-42475 or CVE-2023-27997), COATHANGER hooks Linux userland libraries via `/etc/ld.so.preload` to hide its own files and processes from administrators, intercepts the `init` / `flatkc` boot sequence so it survives firmware upgrades, and opens a covert backdoor on the firewall.',
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
          'The attacker sends a specially crafted HTTPS request with a manipulated `Content-Length` or `enc` parameter to the FortiGate SSL-VPN web endpoint (`/remote/logincheck` or `/remote/hostcheck_validate`). A heap-based buffer overflow in the `sslvpnd` binary allows the attacker to overwrite function pointers on the heap and execute arbitrary code on the firewall.',
        howItWorksInPractice:
          'Because FortiOS compiles `sslvpnd` and nearly all system utilities into a single large multi-call binary (`/bin/init`), exploiting `sslvpnd` gives the attacker immediate access to the underlying Linux environment of the firewall.',
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
          'COATHANGER writes its files into the hidden `/data2/` partition and injects a malicious shared library (`preload.so`) into `/etc/ld.so.preload`. This forces every dynamically linked program on the FortiGate to load COATHANGER’s library first, hooking system calls so the implant’s files and network connections are invisible to standard diagnostic commands.',
        howItWorksInPractice:
          'By intercepting `readdir`, `open`, and process-listing calls in user space via `ld.so.preload`, even if an administrator runs CLI diagnostics on the FortiGate, the operating system lies to them and hides the `/data2` backdoor files.',
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
          'To survive even when an administrator reboots or upgrades the FortiGate firmware, COATHANGER modifies `/bin/smartctl` and hooks the `flatkc` kernel/init unpacking process so the backdoor automatically re-injects itself into the newly booted filesystem and beacons out over TLS.',
        howItWorksInPractice:
          'Standard firmware patches replace the main root filesystem image, but because COATHANGER hides a copy of itself in persistent flash storage (`/data2`) and hooks the boot sequence, simply patching FortiOS without a full factory format leaves the backdoor active.',
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
        'Documented by ProjectDiscovery, Praetorian, and CISA (October–November 2023), CVE-2023-46747 is a critical unauthenticated Remote Code Execution vulnerability in the F5 BIG-IP Traffic Management User Interface (TMUI). The BIG-IP management web interface uses a two-tier architecture: a front-end **Apache httpd** server checks authentication and forwards requests over the binary **Apache JServ Protocol (AJP)** to a back-end **Apache Tomcat** server. By sending an HTTP request with an oversized header to a public `.jsp` page, the attacker triggers an AJP buffer boundary flaw (**AJP Request Smuggling**)—injecting a forged second AJP request straight into Tomcat with `REMOTE_USER=admin` to create an admin user and run `bash` commands as `root`.',
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
          'The attacker sends an unauthenticated HTTPS POST request to a publicly reachable TMUI endpoint (`/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp`). By carefully sizing the HTTP headers inside the request body, `mod_proxy_ajp` on the front-end Apache server miscalculates the AJP packet boundary and forwards the attacker’s raw bytes as a brand-new, separate AJP request to the back-end Tomcat server—with the AJP attribute `SC_A_REMOTE_USER` set to `admin`.',
        howItWorksInPractice:
          'Back-end Apache Tomcat implicitly trusts the `SC_A_REMOTE_USER` attribute inside an AJP packet because it assumes only the front-end Apache server could have set it after verifying the user’s password. Smuggling a raw AJP header (`0x12 0x34`) lets the attacker spoof `REMOTE_USER=admin` without ever logging in.',
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
          'Executing inside Tomcat as the forged `admin` user, the smuggled request invokes the internal TMUI `UserCreate` handler (`/tmui/Control/form`) to create a new local BIG-IP administrator account with full `Advanced Shell (bash)` privileges.',
        howItWorksInPractice:
          'Because the smuggled AJP request never passes back through Apache’s outer authentication filter, the attacker can invoke internal TMUI administrative handlers directly.',
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
          'Using the newly created account (or directly via a smuggled `tmshCmd.jsp` call), the attacker executes `tmsh run /util bash -c "..."` to gain an interactive `root` shell on the BIG-IP appliance, harvesting SSL private keys and backend server credentials.',
        howItWorksInPractice:
          'Because F5 BIG-IP load balancers terminate TLS and hold SSL certificates for the organization’s most critical web applications, root access on the BIG-IP allows the attacker to decrypt traffic and pivot into backend application servers.',
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
        'Documented by Volexity, Mandiant, CISA (Emergency Directive 24-01), and Splunk SURGe (January 2024), this scenario traces the two-bug zero-day chain used by UTA0178 to compromise Ivanti Connect Secure (formerly Pulse Connect Secure) VPN appliances. By combining **CVE-2023-46805** (an authentication bypass using `../` path traversal in `/api/v1/totp/user-backup-code/../../license/keys-status/`) with **CVE-2024-21887** (an authenticated command injection flaw in the Python `keys-status` handler), an unauthenticated attacker executes arbitrary `root` commands and implants the **WIREFIRE** Python webshell directly inside the VPN’s web interface.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0178 Operator), send the path-traversal + command-injection request to Node ②/③ (Ivanti Connect Secure `/api/v1/totp/user-backup-code/../../license/keys-status/`), trace the `popen()` root execution and **WIREFIRE** webshell injection inside Node ④ (`web` REST Daemon & `visits.py`), and follow the VPN credential harvesting on Node ⑤ monitored by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA Emergency Directive 24-01 · Volexity & Mandiant Ivanti Zero-Day Analysis · CVE-2023-46805 & CVE-2024-21887',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Bypassing Authentication With `../../` Traversal Through `/api/v1/totp/user-backup-code/` (CVE-2023-46805)',
        storyAnalogy:
          'The outer door guard (`web` daemon) has a checklist that says: "Anyone walking down the `/api/v1/totp/user-backup-code/` hallway does not need to be logged in yet." The attacker starts down that hallway, but immediately takes two `../../` steps backward into the restricted `/license/keys-status/` room—slipping right past the outer guard.',
        simpleExplanation:
          'In Ivanti Connect Secure, the REST API gateway checked whether a URL started with `/api/v1/totp/user-backup-code/`—an endpoint that is intentionally unauthenticated so users can enter backup codes during login. By requesting `/api/v1/totp/user-backup-code/../../license/keys-status/`, the outer gateway allows the request through without authentication, while the internal router resolves `../../` and hands the request to the restricted administrative `/api/v1/license/keys-status/` endpoint.',
        howItWorksInPractice:
          'This classic prefix-whitelist vs. path-normalization mismatch (CVE-2023-46805) turns every authenticated administrative REST endpoint on the VPN appliance into an unauthenticated endpoint.',
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
          'Once the traversal reaches `/api/v1/license/keys-status/;python%20-c%20...`, the backend Python handler takes the URL path parameter and passes it directly into a shell command (`popen()`) without sanitization (CVE-2024-21887)—executing the attacker’s shell command with `root` privileges.',
        howItWorksInPractice:
          'Neither bug alone is an unauthenticated RCE: CVE-2023-46805 is an auth bypass, and CVE-2024-21887 is an authenticated command injection. Chaining them together in a single HTTP GET/POST request yields instant unauthenticated `root` code execution.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers `popen()` inside Node ④ (Ivanti Python REST Backend), and ⇠#2.2 executes the stage-1 payload as `root`.',
        detectionAndEvidence:
          'Documented by Volexity & Mandiant: Ivanti unallocated log / syslog entries showing `/api/v1/license/keys-status/;` followed by unexpected child processes of the `web` daemon.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Implanting the "WIREFIRE" Webshell in `visits.py` & Harvesting Plaintext VPN Credentials',
        storyAnalogy:
          'To stay inside permanently, the attacker remounts the read-only floor tiles as writable and slips the **WIREFIRE** webshell directly into the appliance’s legitimate `/api/v1/cav/client/visits` Python handler—so they can send encrypted commands and steal every employee’s plaintext VPN password as they log in.',
        simpleExplanation:
          'With `root` access, the attacker temporarily remounts the read-only filesystem as read-write (`mount -o remount,rw /`), injects the **WIREFIRE** Python webshell directly into `/home/venv3/lib/python3.6/site-packages/cav-0.1-py3.6.egg/cav/api/resources/visits.py`, and hooks the authentication daemon to capture plaintext Active Directory credentials of employees logging into the VPN.',
        howItWorksInPractice:
          'Modifying an existing legitimate Python API file (`visits.py`) in-place means the attacker does not create any new `.php` or `.jsp` file that a simple file-count check would notice, and then runs `/pkg/do-ict` with modified exclusions to hide from the built-in Integrity Checker Tool.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ implants WIREFIRE on Node ④ and harvests VPN user credentials on Node ⑤, while Node ⑥ (Splunk SIEM / External ICT) detects the `visits.py` modification and outbound traffic.',
        detectionAndEvidence:
          'Documented by Mandiant (UNC5221): modification of `visits.py` and `ComponentIntegrity.pm` discovered via external Integrity Checker Tool (ICT) snapshots.',
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
        'Documented by CISA Advisory AA23-325A, Mandiant, and Splunk SURGe, "Citrix Bleed" (CVE-2023-4966) is a memory over-read flaw in Citrix NetScaler ADC and Gateway appliances. When an attacker sends an HTTP GET request to the OpenID Connect configuration page with an abnormally long `Host` header (around 24,000+ characters), the appliance constructs a JSON response using `snprintf()` without checking that the buffer overflowed—causing it to dump raw adjacent server memory back in the HTTP response. Inside that leaked memory sits the plaintext `NSC_AAAC` session cookie of an already logged-in administrator.',
      diagramTopologySummary:
        'On the diagram: Node ① (Attacker) sends the oversized `Host` header request to Node ②/③ (Citrix NetScaler Gateway `nsppe`). Node ④ (`nsppe` Memory Buffer & Session Replay) leaks the 65-byte `NSC_AAAC` token, allowing the attacker to hijack a Virtual Desktop session and pivot via DCOM to Node ⑤ (Internal Domain Server), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA Advisory AA23-325A · Splunk SURGe Citrix Bleed Analysis · CVE-2023-4966 · MITRE T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending an Oversized HTTP "Host" Header to Leak Adjacent NetScaler RAM (CVE-2023-4966)',
        storyAnalogy:
          'The attacker asks the public OpenID info desk (`/oauth/idp/.well-known/openid-configuration`) for its standard welcome sheet while supplying a 24,576-byte `Host` name. Because `snprintf()` reports how many bytes it *wanted* to write (147 KB) rather than the size of the 131 KB paper sheet, the server sends back 16 KB of raw adjacent RAM right after the welcome sheet.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS GET request to `/oauth/idp/.well-known/openid-configuration` on the Citrix NetScaler Gateway. Normally, the server inserts the HTTP `Host` header into six fields of a JSON template using `snprintf()` and uses the return value to send the response. By sending a 24,576-byte `Host` header, `snprintf()` returns the theoretical length (~147 KB) rather than the actual buffer size (131 KB), causing the server to transmit ~16 KB of raw adjacent heap memory.',
        howItWorksInPractice:
          'In C programming, `snprintf()` returns the number of bytes that *would* have been written if the buffer were big enough. Passing that unchecked number to the HTTP response writer tricks NetScaler into sending whatever sensitive data was sitting next to the buffer in RAM.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the 24 KB `Host` header from Node ① to Node ②/③ (Citrix NetScaler `/oauth/idp/`), and ⇠#1.2 returns HTTP 200 OK leaking 131 KB of memory.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A & Suricata SID 2048918: `GET /oauth/idp/.well-known/openid-configuration` with oversized `Host` header and >130 KB HTTP 200 response.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1539',
        plainTitle: 'Extracting the 65-Character "NSC_AAAC" Cookie & Hijacking an Active MFA Session',
        storyAnalogy:
          'Scanning the accidentally photocopied desk pages, the attacker spots a 65-digit hexadecimal VIP wristband (`NSC_AAAC`) belonging to an administrator who is currently logged in. Clipping that wristband onto their own browser lets the attacker step straight into the admin’s active Citrix Virtual Desktop without any password or MFA prompt.',
        simpleExplanation:
          'Scanning the leaked raw memory bytes with a regular expression (`[0-9a-f]{32,65}`), the attacker extracts a live `NSC_AAAC` session token belonging to an administrator who had already completed multi-factor authentication. By setting `Cookie: NSC_AAAC=<leaked_token>` in their own client, the attacker steps directly into the authenticated Citrix VDI session.',
        howItWorksInPractice:
          'Because the `NSC_AAAC` token represents an already-authenticated session, replaying it bypasses both password verification and MFA completely, even surviving a password reset unless active sessions are explicitly terminated (`kill aaa session`) on the NetScaler.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ replays the leaked `NSC_AAAC` cookie on Node ③/④ (NetScaler Session Engine), and ⇠#2.2 grants VDI ICA desktop access without MFA.',
        detectionAndEvidence:
          'Documented in NetScaler AAA Syslog: Same `NSC_AAAC` session identifier active across two different client IP addresses without a new authentication event.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1021.003',
        plainTitle: 'Pivoting from the Hijacked Citrix VDI Desktop into Internal Servers via DCOM/RPC',
        storyAnalogy:
          'Now sitting at the administrator’s virtual desk inside the building, the attacker uses the internal intercom (`DCOM MMC20.Application` over port 135) to command neighboring Windows servers to run commands on their behalf.',
        simpleExplanation:
          'Inside the hijacked virtual desktop session, the attacker runs reconnaissance tools (`netscan`, `adfind`), dumps credentials from memory, and uses Distributed COM (`DCOM` / `MMC20.Application` over RPC port 135) to execute commands laterally on internal Windows servers.',
        howItWorksInPractice:
          'Executing commands via DCOM `MMC20.Application` causes the remote server to spawn `mmc.exe -Embedding`, allowing lateral movement without creating a new Windows service.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pivots from Node ④ (VDI Session) to Node ⑤ (Internal Server via DCOM `:135`) while Node ⑥ (Splunk SIEM) correlates the session hijack.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A: `mmc.exe -Embedding` spawned on remote servers via DCOM following Citrix ICA session IP change.',
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
        'Discovered and documented by Kaspersky GReAT (2023–2024), Operation Triangulation is one of the most sophisticated zero-click mobile exploit chains ever analyzed. The victim receives an invisible iMessage attachment that triggers a memory corruption bug in Apple’s TrueType font parser (`ADJUST` instruction, CVE-2023-41990) without the user ever opening or seeing the message. Next, to bypass Apple’s hardware-enforced page protection (PPL), the exploit writes directly to undocumented CPU Memory-Mapped I/O (MMIO) hardware registers (CVE-2023-38606) using Direct Memory Access (DMA) to plant the `TriangleDB` memory-only implant.',
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
          'The target device receives an iMessage containing a disguised archive/PDF with an embedded TrueType font. Background process `IMAgent` automatically previews the attachment without displaying any notification to the user. Inside `libFontParser.dylib`, a legacy TrueType bytecode instruction named `ADJUST` (opcode `0x8F`/`0x90`) causes an out-of-bounds write, giving the attacker initial code execution inside `IMAgent`.',
        howItWorksInPractice:
          'Because `IMAgent` parses attachment previews automatically in the background as soon as the push payload arrives, the victim never has to tap or view anything ("Zero-Click").',
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
          'Even after exploiting the kernel, modern Apple silicon chips prevent software—even the kernel itself—from modifying protected page tables (PPL). To bypass this hardware lock, the exploit writes directly to undocumented physical Memory-Mapped I/O (MMIO) addresses belonging to an on-chip hardware block (CVE-2023-38606), instructing the chip’s own Direct Memory Access (DMA) engine to overwrite protected kernel memory.',
        howItWorksInPractice:
          'Because the hardware DMA engine accesses physical RAM directly outside the CPU’s Page Protection Layer checks, it can modify read-only kernel memory structures so the attacker can run unsigned code.',
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
          'With full kernel privileges, the validator stage erases all forensic traces of the incoming iMessage from `sms.db` and launches the Mach-O implant `TriangleDB` strictly in volatile RAM. `TriangleDB` monitors microphone, location, and keychain data until the phone is rebooted.',
        howItWorksInPractice:
          'Although `TriangleDB` leaves no executable file on flash storage, forensic analysts detect the compromise by spotting orphaned network data usage entries in `DataUsage.sqlite` and modification timestamp gaps in iOS backup files.',
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
        'Documented by Kaspersky GReAT and ESET Security Advisory (CVE-2024-11859), this scenario illustrates how the ToddyCat APT group abused a legitimate, digitally signed security tool: the ESET Command Line Scanner (`ecls.exe`). Due to a DLL search-order hijacking vulnerability in older versions of `ecls.exe`, placing a malicious DLL named `version.dll` in the same directory caused the trusted antivirus scanner itself to load and execute the attacker’s **TCESB** / **Samurai** loader in memory.',
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
          'The attacker copies a standalone, validly signed copy of ESET Command Line Scanner (`ecls.exe`) into a staging directory such as `C:\\ProgramData\\ESET\\` alongside a malicious `version.dll`. Because of CVE-2024-11859, when `ecls.exe` starts, it loads `version.dll` from its current directory before checking `C:\\Windows\\System32\\`.',
        howItWorksInPractice:
          'Using a genuine antivirus scanner binary as the host process helps the attacker blend in on enterprise systems where security binaries are common.',
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
          'To prevent `ecls.exe` from crashing with missing-function errors, the malicious `version.dll` forwards normal API calls to the real `C:\\Windows\\System32\\version.dll` while its `DllMain` function reads an encrypted payload file from disk and decrypts the ToddyCat **TCESB** loader in memory.',
        howItWorksInPractice:
          'DLL Export Proxying ensures that the host application continues to function normally while the attacker’s code runs on a background thread inside the same process.',
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
          'Running inside the memory space of the signed `ecls.exe` binary, the TCESB backdoor opens an outbound HTTPS tunnel to ToddyCat’s command-and-control infrastructure and harvests local browser and domain credentials.',
        howItWorksInPractice:
          'Because `ecls.exe` is an offline command-line file scanner, it should never open outbound HTTPS connections to external web servers—making Sysmon EventID 3 network telemetry a clear detection signal.',
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
        'In the past, attackers who wanted to cut the security cameras inside the Windows kernel had to smuggle an old, flawed third-party security guard (`Bring Your Own Vulnerable Driver`) into the building—which modern Windows blocklists immediately spot at the gate. In this scenario, Lazarus Group found a zero-day flaw (`CVE-2024-21338`) in a guard who is *already* hired and pre-installed inside every Windows building (`appid.sys`, the built-in AppLocker driver). By whispering a forged instruction (`IOCTL 0x22A018`) to `appid.sys`, the attacker tricks the driver into flipping their own clearance badge from "Visitor (`UserMode = 1`)" to "Supreme Kernel Architect (`KernelMode = 0`)"—and then quietly unplugs the EDR security agent’s cameras (`Kernel Callbacks` & `ETW`) without turning the EDR light off.',
      plainSummary:
        'Discovered by Avast and analyzed by Kaspersky and Microsoft (February 2024), this scenario shows how the Lazarus Group upgraded their **FudModule** rootkit. Previously, attackers had to drop a vulnerable third-party driver onto the system (Bring Your Own Vulnerable Driver). Here, Lazarus exploited a zero-day flaw inside Windows’ own built-in AppLocker driver (`appid.sys`, CVE-2024-21338). By sending a crafted IOCTL control code from a local service to `appid.sys`, the attacker achieves arbitrary kernel memory read/write and zeroes out the kernel callback tables and ETW sensors that EDR agents rely on.',
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
          'Because Windows blocks untrusted kernel drivers via Driver Signature Enforcement (DSE) and vulnerable-driver blocklists, the attacker elevates a userland process to `LOCAL SERVICE` privileges and opens a device handle to Windows’ own digitally signed AppLocker driver (`C:\\Windows\\System32\\drivers\\appid.sys`).',
        howItWorksInPractice:
          'Because `appid.sys` is a native, inbox Windows kernel driver present on every modern Windows installation, the attacker does not have to drop or load any external `.sys` driver file.',
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
          'FudModule calls `DeviceIoControl` with IOCTL code `0x22A018` (`AipSmartHashImageFile`) and passes carefully forged kernel structure pointers. Because `appid.sys` trusts the caller’s pointer in CVE-2024-21338, it invokes a kernel gadget that flips the current thread’s `KTHREAD.PreviousMode` field from `UserMode (1)` to `KernelMode (0)`.',
        howItWorksInPractice:
          'When a thread’s `PreviousMode` is set to `0` (`KernelMode`), Windows system calls like `NtReadVirtualMemory` and `NtWriteVirtualMemory` skip user-mode address checks and allow the thread to read and write anywhere in Ring-0 kernel memory.',
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
          'With full kernel read/write access (Direct Kernel Object Manipulation — DKOM), FudModule walks the Windows kernel’s `PspCreateProcessNotifyRoutine`, `PspCreateThreadNotifyRoutine`, and `ObRegisterCallbacks` arrays, zeroing out the callback pointers registered by the endpoint’s EDR security agent, and disables the `EtwThreatIntProvRegHandle` provider so the EDR agent goes completely blind.',
        howItWorksInPractice:
          'Instead of terminating the EDR service (which would immediately alert the SOC that the agent stopped running), FudModule leaves the EDR process running normally while unhooking its kernel eyes and ears.',
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
        'Documented by Joint CISA/FBI/NSA/NCSC Advisory and Mandiant (October 2023), this scenario shows how APT29 (Midnight Blizzard) exploited CVE-2023-42793 in on-premises JetBrains TeamCity CI/CD servers. Because an authentication wildcard flaw allowed anyone to reach internal REST paths that ended with `/RPC2`, the attacker sent a single unauthenticated POST request to mint a permanent administrator bearer token, enabled the hidden internal debug command endpoint, and abused the CI/CD server’s high privileges to compromise software build pipelines and Active Directory.',
      diagramTopologySummary:
        'On the diagram: Node ① (APT29 Operator) sends the unauthenticated `/app/rest/users/id:1/tokens/RPC2` request through Node ② (Reverse Proxy) to Node ③ (TeamCity CI/CD Server). Inside TeamCity, Node ④ (REST Token Minter & `debug/processes` Executor) spawns commands and steals build secrets from Node ⑤ (Signing Keys & AD Vault), monitored by Node ⑥ (SIEM).',
      documentedAdvisory: 'CISA/FBI/NSA/NCSC Joint Advisory (Oct 2023) · Mandiant CVE-2023-42793 · MITRE ATT&CK T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Appending "/RPC2" to Mint an Admin Bearer Token Without Logging In (CVE-2023-42793)',
        storyAnalogy:
          'The developer meant to exempt only the root `/RPC2` path from login checks, but wrote `/**/RPC2`—accidentally exempting *every* URL in the entire server that ends with `/RPC2`. Requesting `/app/rest/users/id:1/tokens/RPC2` tricks TeamCity into creating a new admin token named `"RPC2"` for User ID 1 without asking for a password.',
        simpleExplanation:
          'In vulnerable TeamCity versions, an authentication interceptor rule excluded any URL matching `/**/RPC2` from login checks. The attacker exploits this by sending an unauthenticated HTTP POST request to `/app/rest/users/id:1/tokens/RPC2`. TeamCity treats `"/RPC2"` as the name of the new token for user ID 1 (the primary super-admin) and immediately returns the newly generated secret bearer token in the HTTP 200 response.',
        howItWorksInPractice:
          'The developer intended `/**/RPC2` to only exempt the legacy XML-RPC endpoint at the root path, but the wildcard accidentally exempted every REST API path that ended with `"/RPC2"`.',
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
          'Authenticating with `Authorization: Bearer <token>`, the attacker first modifies the internal server property `rest.debug.processes.enable=true`, and then sends POST requests to `/app/rest/debug/processes?exePath=cmd.exe&params=/c+...` to execute arbitrary OS commands under the TeamCity service account—immediately deleting the `RPC2` token afterward to hide how they got in.',
        howItWorksInPractice:
          'Deleting the `RPC2` token seconds after running commands removes it from the active token list, though the creation/deletion events remain in `teamcity-activities.log`.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ invokes `/app/rest/debug/processes` on Node ④ (TeamCity JVM Process Spawner), and ⇠#2.2 spawns the child shell process.',
        detectionAndEvidence:
          'Documented by Mandiant: `POST /app/rest/debug/processes` in `teamcity-server.log` and `java.exe` spawning `whoami` / `nltest` / `curl`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Harvesting CI/CD Build Secrets, Code-Signing Keys & Pivoting into Active Directory',
        storyAnalogy:
          'Because the CI/CD build server is the automated assembly line that deploys software to every cloud and server in the company, taking over this one room hands the attacker the master keys to cloud deployments, source code, and code-signing certificates.',
        simpleExplanation:
          'Because CI/CD build servers store credentials for cloud deployments, source-code repositories, and code-signing certificates, APT29 extracts the TeamCity encryption keys and database credentials, creates a backdoor admin account, and deploys a persistent beacon.',
        howItWorksInPractice:
          'Compromising a CI/CD build server gives the attacker access to every environment the build server deploys to, turning a single web bug into enterprise-wide access.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ extracts secrets from Node ⑤ (CI/CD Vault & AD) via Node ④ while Node ⑥ (SIEM) triggers on TeamCity child process and token anomalies.',
        detectionAndEvidence:
          'Documented in Joint CISA Advisory: Creation of new TeamCity admin accounts in `teamcity-activities.log` and outbound C2 beacon from TeamCity server.',
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
        'Documented by Huntress ("SlashAndGrab"), CISA, and Splunk SURGe (February 2024), CVE-2024-1709 is one of the simplest yet most devastating authentication bypass bugs ever found in remote monitoring and management (RMM) software. On ConnectWise ScreenConnect servers, the initial installation wizard (`/SetupWizard.aspx`) is supposed to be blocked once the server is configured. However, appending a trailing slash or path suffix (`/SetupWizard.aspx/anything`) confused the ASP.NET URL path handler into reopening the setup wizard—allowing anyone on the internet to overwrite the server’s primary administrator account and push commands to all connected customer endpoints.',
      diagramTopologySummary:
        'On the diagram: Node ① (Threat Actor) sends the `/SetupWizard.aspx/` request through Node ② (Edge Firewall `:8040`/`:443`) to Node ③ (ScreenConnect RMM Server). Inside the server, Node ④ (SetupWizard `User.xml` Overwrite & Extension Engine) resets the admin account and pushes remote PowerShell/MSI payloads to Node ⑤ (Managed Client Endpoints), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA KEV CVE-2024-1709 · Splunk SURGe & Huntress SlashAndGrab Analysis · MITRE ATT&CK T1190 / T1219',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Accessing "/SetupWizard.aspx/anything" to Reopen the Initial Installation Wizard (CVE-2024-1709)',
        storyAnalogy:
          'Adding `/anything` after `/SetupWizard.aspx` fools the security filter into thinking you are visiting a different page, while ASP.NET treats `/anything` as harmless `PathInfo` metadata and opens the First-Time Setup Wizard anyway.',
        simpleExplanation:
          'The ScreenConnect authentication module checked whether the requested URL *exactly ended* with `/SetupWizard.aspx` to block access on already-configured servers. By requesting `GET /SetupWizard.aspx/anything`, the check fails to match, while ASP.NET still routes the request to `SetupWizard.aspx` with `PathInfo="/anything"`, presenting the unauthenticated initial setup form.',
        howItWorksInPractice:
          'This classic path-normalization mismatch between a custom security filter and the underlying ASP.NET web framework allowed anyone to reach the first-time setup wizard with a single extra `"/"` character.',
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
          'The attacker submits a POST request to `/SetupWizard.aspx/anything` with a new administrator username and password. ScreenConnect overwrites `C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml`, replacing all existing administrator accounts with the attacker’s new super-admin credential.',
        howItWorksInPractice:
          'Overwriting `User.xml` immediately locks out the legitimate IT administrators while logging the attacker directly into the ScreenConnect administrative console.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ overwrites `App_Data\\User.xml` with the rogue admin account, and ⇠#2.2 returns an authenticated admin session cookie.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 & ScreenConnect Audit Logs: Modification of `C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml` by `ScreenConnect.Service.exe`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1219',
        plainTitle: 'Abusing the RMM Console to Push SYSTEM Commands to Connected Client Machines',
        storyAnalogy:
          'Because ScreenConnect is the official remote-support tool installed on every employee laptop and server in the company (`ScreenConnect.ClientService.exe` running as `SYSTEM`), the attacker simply clicks "Run Command on All Machines" in their new admin console to deploy payloads everywhere at once.',
        simpleExplanation:
          'Because ScreenConnect agents (`ScreenConnect.ClientService.exe`) run as `SYSTEM` on every managed workstation and server in the organization, the attacker uses their new admin console to broadcast PowerShell scripts and ransomware payloads simultaneously across all connected endpoints via `C:\\Windows\\Temp\\ScreenConnect\\`.',
        howItWorksInPractice:
          'When an RMM command is sent from the server, the client agent writes a temporary `.cmd` or `.ps1` script into `C:\\Windows\\Temp\\ScreenConnect\\<version>\\` and executes it as `NT AUTHORITY\\SYSTEM`.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pushes remote commands from Node ④ to Node ⑤ (Managed Endpoints running `ScreenConnect.ClientService.exe`) while Node ⑥ (Splunk SIEM) alerts.',
        detectionAndEvidence:
          'Documented by Huntress & Splunk SURGe: `ScreenConnect.ClientService.exe` spawning `cmd.exe` / `powershell.exe` from `C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd`.',
      },
    ],
  },
};
