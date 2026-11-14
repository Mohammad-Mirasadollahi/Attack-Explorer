import { RawScenarioStepGuideData } from '../scenario-step-guides';

export const MS_CISCO_KASPERSKY_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'ms-volt-typhoon-lotl': {
    scenarioId: 'ms-volt-typhoon-lotl',
    briefing: {
      headline: 'Scenario Briefing: Volt Typhoon Living-off-the-Land (LotL) — Stealing Active Directory Using Only Built-In Windows Tools',
      plainSummary:
        'Documented in Joint CISA/NSA/FBI Advisory AA23-144A and Microsoft Threat Intelligence, Volt Typhoon (Bronze Silhouette) avoids dropping custom malware that antivirus software might catch. Instead, they route their traffic through compromised small-office routers (KV Botnet) so their connections look local, and then use only legitimate tools already built into Windows (wmic.exe, vssadmin.exe, ntdsutil.exe, and netsh.exe) to copy the Domain Controller’s master password database (ntds.dit) and relay internal traffic.',
      diagramTopologySummary:
        'On the diagram: Node ① (KV Botnet SOHO Edge Router) proxies traffic through Node ② (Perimeter Firewall) to Node ③ (Domain Controller CORP-DC01). On the server, Node ④ (Built-in wmic / vssadmin / ntdsutil / netsh) snapshots and extracts Node ⑤ (NTDS.dit & SYSTEM hive), while Node ⑥ (Microsoft Sentinel SIEM) detects the LotL command sequence.',
      documentedAdvisory: 'CISA/NSA/FBI Joint Advisory AA23-144A · Microsoft Volt Typhoon Report · MITRE ATT&CK T1003.003',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1090.003',
        plainTitle: 'Routing Commands Through a Compromised SOHO Edge Router (KV Botnet) & WMI Execution',
        simpleExplanation:
          'Rather than connecting from a suspicious foreign IP address, the attacker routes their traffic through compromised small-office/home-office (SOHO) routers near the victim’s geographic region. Using stolen administrator credentials, they connect to WMI (Windows Management Instrumentation) on the target server to spawn cmd.exe via wmiprvse.exe.',
        howItWorksInPractice:
          'Because the connection comes from a residential/SOHO IP in the same region and uses built-in Windows WMI administration, it blends in with routine IT remote management unless defenders inspect the exact child commands spawned by wmiprvse.exe.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ flows from Node ① (KV Botnet Router) through Node ② to Node ③ (Target Server wmiprvse.exe), with ⇠#1.2 confirming RPC/DCOM session establishment.',
        detectionAndEvidence:
          'Documented in CISA AA23-144A: wmiprvse.exe spawning cmd.exe /c reconnaissance and credential commands following VPN/router login.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1003.003',
        plainTitle: 'Creating a Disk Snapshot (Shadow Copy) to Bypass Active Directory File Locks',
        simpleExplanation:
          'Windows keeps the Active Directory password database (C:\\Windows\\NTDS\\ntds.dit) permanently locked while the Domain Controller is running, so it cannot simply be copied. To get around this lock without installing any third-party tools, the attacker runs vssadmin create shadow /for=C: (or ntdsutil "ifm") to create a read-only point-in-time snapshot of the C: drive where ntds.dit is unlocked.',
        howItWorksInPractice:
          'The Volume Shadow Copy Service (VSS) creates a virtual device path (\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1) that contains a frozen, unlocked copy of every file on C:, including ntds.dit.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ shows Node ④ (vssadmin.exe / ntdsutil.exe) creating volume snapshot HarddiskVolumeShadowCopy1 on Node ⑤, with ⇠#2.2 returning the shadow volume path.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1: cmd.exe /c vssadmin create shadow /for=C: followed by accessing \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy*.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1090.002',
        plainTitle: 'Extracting ntds.dit + SYSTEM Hive & Setting Up a Built-in Windows Port Relay (netsh portproxy)',
        simpleExplanation:
          'From the newly created shadow copy, the attacker copies both ntds.dit (which holds all domain password hashes) and the registry SYSTEM hive (which holds the boot key needed to decrypt ntds.dit) into C:\\Windows\\Temp\\. To maintain stealthy internal access, they configure Windows’ built-in network relay using netsh interface portproxy add v4tov4.',
        howItWorksInPractice:
          'Using netsh portproxy turns the compromised Windows server itself into a covert TCP relay that forwards incoming traffic to deeper internal servers without installing any proxy malware.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ extracts Node ⑤ (ntds.dit + SYSTEM) via Node ④ and configures portproxy while Node ⑥ (SIEM) flags the registry/process telemetry.',
        detectionAndEvidence:
          'Documented in CISA AA23-144A: reg save HKLM\\SYSTEM, ntds.dit copy from ShadowCopy, and Registry modification under HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4.',
      },
    ],
  },

  'ms-midnight-blizzard-oauth': {
    scenarioId: 'ms-midnight-blizzard-oauth',
    briefing: {
      headline: 'Scenario Briefing: Midnight Blizzard (APT29) — From Legacy Test Tenant to Full Exchange Email Access via OAuth',
      plainSummary:
        'Based on Microsoft Threat Intelligence’s investigation of the Midnight Blizzard (NOBELIUM / APT29) campaign, this scenario shows how attackers compromise cloud email without installing malware on any computer. First, they use slow password spraying through residential proxies to break into an old, forgotten non-production test tenant that lacked MFA. Second, they use an over-privileged account to register malicious OAuth applications in the corporate tenant and grant them the powerful full_access_as_app Exchange role. Third, they use those OAuth app tokens to bulk-read corporate mailboxes via Exchange Web Services (EWS).',
      diagramTopologySummary:
        'On the diagram: Node ① (Residential Proxy Network) sprays Node ② (Legacy Non-Prod OAuth Tenant). From there, the attacker pivots into Node ③ (Corporate Entra ID Tenant), registers malicious OAuth apps in Node ④ (OAuth Service Principal Engine), and exfiltrates mailboxes from Node ⑤ (Exchange Online EWS) while Node ⑥ (Sentinel SIEM) logs the audit trail.',
      documentedAdvisory: 'Microsoft Threat Intelligence Midnight Blizzard Guidance (Jan 2024) · MITRE ATT&CK T1098.003 / T1114.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1110.003',
        plainTitle: 'Low-Volume Password Spraying Against a Forgotten Legacy Test Account Without MFA',
        simpleExplanation:
          'To avoid triggering cloud lockout or rate-limit alarms, the attacker distributes a slow password spray across a pool of residential proxy IPs, testing only a few password combinations per hour against a forgotten legacy test tenant account that did not have multi-factor authentication (MFA) enforced.',
        howItWorksInPractice:
          'High-speed brute-force attacks from datacenter IPs are blocked automatically. Spreading a handful of tries across residential IPs targets one weak link: an old test account left over from a migration.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends low-and-slow authentication requests from Node ① to Node ② (Legacy Tenant), and ⇠#1.2 returns an OAuth 2.0 Bearer Token.',
        detectionAndEvidence:
          'Documented in Entra ID SignInLogs: Distributed ErrorCode 50126 failures across residential IPs followed by single-factor success (ResultType 0) on legacy test account.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.003',
        plainTitle: 'Creating Malicious OAuth Apps & Granting Them "full_access_as_app" Exchange Permission',
        simpleExplanation:
          'Using a legacy cross-tenant synchronization service principal that still had high privileges in the production tenant, the attacker registers new OAuth applications (Service Principals), adds client secrets to them, and grants admin consent for the Office 365 Exchange Online role full_access_as_app.',
        howItWorksInPractice:
          'The full_access_as_app permission is an application-level role that grants an OAuth app unrestricted access to every mailbox in the tenant without requiring any individual user’s password or MFA approval.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ moves from Node ③ to Node ④ (OAuth App Registration), assigning full_access_as_app, and ⇠#2.2 returns HTTP 201 AppRoleAssignment Created.',
        detectionAndEvidence:
          'Documented in Entra ID AuditLogs: "Add service principal credentials" and "Add app role assignment to service principal" (Role: full_access_as_app / dc890d15-9560-4a4c-9b7f-a736ec74ec40).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Using the OAuth App Token to Bulk-Read Executive Mailboxes via Exchange Web Services (EWS)',
        simpleExplanation:
          'Because OAuth application tokens authenticate directly as a trusted app rather than a human user, they completely bypass interactive user MFA prompts. The attacker authenticates with the OAuth app’s client_credentials token and queries Exchange Online’s /EWS/Exchange.asmx endpoint (FindItem / GetItem) to download executive and security team emails.',
        howItWorksInPractice:
          'Defenders catch this phase by monitoring Exchange Unified Audit Logs (MailItemsAccessed) for OAuth AppIds accessing mailboxes from residential proxy networks.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ to Node ⑤ (Exchange Online EWS) to exfiltrate mailboxes while Node ⑥ (Sentinel SIEM) alerts on anomalous EWS volume.',
        detectionAndEvidence:
          'Documented in Exchange Unified Audit Log (MailItemsAccessed) & EWS logs: High-volume SOAP GetItem requests authenticated via OAuth AppId from residential proxy IPs.',
      },
    ],
  },

  'ms-salt-typhoon-telecom': {
    scenarioId: 'ms-salt-typhoon-telecom',
    briefing: {
      headline: 'Scenario Briefing: Salt Typhoon (GhostEmperor) — Telecom Core Router Rootkit & TACACS+ Credential Theft',
      plainSummary:
        'Based on CISA/FBI/NSA joint guidance and Microsoft Threat Intelligence on Salt Typhoon, this scenario explains how nation-state actors infiltrate telecommunications and ISP backbone networks. After compromising an internet-facing Cisco IOS XE Provider Edge router and escaping into its underlying Linux Guest Shell container, the attacker loads a kernel module rootkit to hide their processes, captures network administrators’ TACACS+ authentication credentials in transit, and sets up covert GRE tunnels.',
      diagramTopologySummary:
        'On the diagram: Node ① (Salt Typhoon Operator) exploits Node ②/③ (Cisco IOS XE Provider Edge Router). Inside the router’s Linux environment, Node ④ (Guest Shell & Kernel Rootkit) sniffs TACACS+ credentials and configures GRE tunnels toward Node ⑤ (Core Telecom Backbone), monitored by Node ⑥ (NetFlow & Syslog SIEM).',
      documentedAdvisory: 'CISA/FBI/NSA Joint Telecom Guidance · Cisco Talos IOS XE Advisory · MITRE ATT&CK T1014 / T1040',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Compromising the Provider Edge Router & Escaping the Linux Guest Shell',
        simpleExplanation:
          'The attacker exploits an exposed management interface on a Cisco IOS XE Provider Edge router to gain privilege level 15 administrative access. They immediately enable the router’s Linux-based Guest Shell container (guestshell enable) and escape container restrictions to obtain root access on the underlying Linux host OS that drives the router.',
        howItWorksInPractice:
          'Modern enterprise routers run a Linux operating system underneath the router CLI. Escaping into the underlying Linux shell lets the attacker run custom C programs that normal router administrators never see in the standard IOS CLI.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ compromises Node ②/③ (PE Router Management Plane) and spawns Node ④ (Linux Guest Shell), with ⇠#1.2 logging %SYS-5-CONFIG_I.',
        detectionAndEvidence:
          'Documented in Cisco IOS XE Syslog: Unexpected guestshell enable / app-hosting start commands and web UI local account creation.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1014',
        plainTitle: 'Loading a Kernel Rootkit & Sniffing Network Admin TACACS+ Logins (TCP Port 49)',
        simpleExplanation:
          'From the underlying Linux shell, the attacker loads a custom loadable kernel module (LKM rootkit) that hides specific process IDs and network sockets from standard router CLI commands (like show processes). Simultaneously, a packet sniffer captures TCP port 49 traffic to intercept TACACS+ authentication packets and extract the shared secret from router memory.',
        howItWorksInPractice:
          'Telecom engineers use centralized TACACS+ servers (TCP port 49) to log into core routers. By extracting the router’s TACACS+ key and sniffing port 49, the attacker decrypts admin logins across the ISP backbone.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ loads the kernel module and hooks TCP/49 TACACS+ traffic, with ⇠#2.2 confirming credential capture.',
        detectionAndEvidence:
          'Documented in Telecom Threat Intelligence: Unauthorized kernel module taint flags in /proc/modules and anomalous raw socket listeners on TCP/49.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1572',
        plainTitle: 'Creating Covert GRE Tunnels (IP Protocol 47) & Clearing Router Logs',
        simpleExplanation:
          'Using the stolen TACACS+ credentials to move across core routers, the attacker provisions Generic Routing Encapsulation (GRE, IP Protocol 47) tunnels and SPAN port-mirroring sessions to forward selected network traffic to external collection points, then clears router command history and syslog buffers.',
        howItWorksInPractice:
          'GRE tunnels encapsulate internal network packets inside IP Protocol 47 so the router forwards mirrored traffic directly to an external endpoint.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ establishes the GRE tunnel between Node ④ and Node ⑤ (Core Backbone / External Collector) while Node ⑥ (NetFlow SIEM) flags IP Proto 47.',
        detectionAndEvidence:
          'Documented in CISA Telecom Guidance: Unscheduled GRE tunnel interfaces (Tunnel0/Tunnel10, IP Protocol 47) in NetFlow and %SYS-5-LOG_CONFIG_CHANGE events.',
      },
    ],
  },

  'ms-forest-blizzard-gooseegg': {
    scenarioId: 'ms-forest-blizzard-gooseegg',
    briefing: {
      headline: 'Scenario Briefing: Forest Blizzard (APT28) GooseEgg — Exploiting Windows Print Spooler to Gain SYSTEM Control',
      plainSummary:
        'Published by Microsoft Threat Intelligence (April 2024), this scenario details how Forest Blizzard (APT28 / Fancy Bear) uses a custom post-exploitation tool named GooseEgg to exploit CVE-2022-38028 in the Windows Print Spooler service. Because spoolsv.exe runs with full SYSTEM permissions, GooseEgg modifies a JavaScript printer constraint file so that the Print Spooler registers a rogue driver package (wayzgoose.dll) and spawns a SYSTEM-level command shell for the attacker.',
      diagramTopologySummary:
        'On the diagram: From an initial foothold (Node ①/②), the attacker launches the GooseEgg batch/binary launcher on Node ③ (Windows Host). Inside the host, Node ④ (GooseEgg & spoolsv.exe) modifies the DriverStore JavaScript constraint file and loads Node ⑤ (wayzgoose.dll SYSTEM Backdoor), triggering alerts on Node ⑥ (Defender XDR / SIEM).',
      documentedAdvisory: 'Microsoft Threat Intelligence Forest Blizzard GooseEgg Report · CVE-2022-38028 · MITRE ATT&CK T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Running the GooseEgg Launcher (execute.bat / justice.exe) to Modify Printer Constraint Scripts',
        simpleExplanation:
          'Starting from a standard low-privilege user account, the attacker runs a batch script (execute.bat) that launches the compressed GooseEgg executable (justice.exe). GooseEgg exploits CVE-2022-38028 by modifying a PnP-X / v4 printer driver JavaScript constraints file (MPDW-constraints.js) inside the Windows DriverStore without requiring administrator permissions.',
        howItWorksInPractice:
          'Normally, files inside C:\\Windows\\System32\\DriverStore\\FileRepository\\ cannot be edited by standard users. CVE-2022-38028 temporarily left the permissions on MPDW-constraints.js writable during a Print Spooler operation.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ launching justice.exe into Node ④ (Windows DriverStore MPDW-constraints.js), with ⇠#1.2 logging Sysmon EventID 11 file modification.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intel: justice.exe modifying C:\\Windows\\System32\\DriverStore\\FileRepository\\...\\MPDW-constraints.js.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1547.012',
        plainTitle: 'Forcing the Print Spooler (spoolsv.exe) to Register the Rogue Driver wayzgoose.dll as SYSTEM',
        simpleExplanation:
          'Next, GooseEgg triggers a print spooler COM operation that causes spoolsv.exe (running as NT AUTHORITY\\SYSTEM) to evaluate the modified JavaScript constraint file. This tricks the Print Spooler into creating a custom registry key under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Environments and loading the attacker’s DLL (wayzgoose.dll) with full SYSTEM privileges.',
        howItWorksInPractice:
          'Because spoolsv.exe executes the JavaScript constraint file under its own SYSTEM token, the injected script commands can write directly to protected HKLM registry keys and load custom DLLs.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ connects Node ④ (spoolsv.exe) to Node ⑤ (wayzgoose.dll), loading the DLL in SYSTEM context, with ⇠#2.2 logging Sysmon EventID 7 & 13.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 & 13: spoolsv.exe loading unsigned wayzgoose.dll after registry Print\\Environments driver registration.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.003',
        plainTitle: 'wayzgoose.dll Spawns a SYSTEM Command Shell (whoami / netstat / tasklist)',
        simpleExplanation:
          'Once loaded inside the SYSTEM context, wayzgoose.dll acts as a launcher application capable of spawning arbitrary processes (such as cmd.exe) with SYSTEM permissions, allowing Forest Blizzard to install backdoors, run reconnaissance (whoami, tasklist), and move laterally across the network.',
        howItWorksInPractice:
          'A printer spooler service (spoolsv.exe) should never spawn cmd.exe or powershell.exe. That parent-child process tree is a high-confidence indicator of Print Spooler exploitation.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ shows Node ⑤ (wayzgoose.dll) spawning SYSTEM cmd.exe and triggering a critical alert on Node ⑥ (Defender XDR / SIEM).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1: ParentImage C:\\Windows\\System32\\spoolsv.exe spawning C:\\Windows\\System32\\cmd.exe under NT AUTHORITY\\SYSTEM.',
      },
    ],
  },

  'unit42-star-blizzard-evilginx-aitm': {
    scenarioId: 'unit42-star-blizzard-evilginx-aitm',
    briefing: {
      headline: 'Scenario Briefing: Star Blizzard (SEABORGIUM) — Evilginx Adversary-in-the-Middle (AiTM) Session Cookie Theft',
      plainSummary:
        'Documented by Microsoft Threat Intelligence, Palo Alto Unit 42, and CISA Advisory AA23-341A, this scenario shows how attackers bypass conventional multi-factor authentication (TOTP codes and SMS/Push approvals) using an Adversary-in-the-Middle (AiTM) reverse proxy framework like Evilginx2. When the victim clicks a spear-phishing link, Evilginx proxies the real Microsoft Entra ID login page live in real time. The victim enters their password and MFA code, Microsoft issues a valid session cookie (ESTSAUTHPERSISTENT), and Evilginx captures that cookie in transit—allowing the attacker to replay the authenticated session in their own browser.',
      diagramTopologySummary:
        'On the diagram: Node ① (Victim User Browser) clicks the lure pointing to Node ②/③ (Evilginx2 AiTM Reverse Proxy). Node ③ relays the login and MFA challenge live to Node ④ (Genuine Microsoft Entra ID login.microsoftonline.com), captures the ESTSAUTHPERSISTENT cookie, and replays it against Node ⑤ (Outlook Web App) while Node ⑥ (Cloud SIEM) detects the session replay.',
      documentedAdvisory: 'CISA Advisory AA23-341A · Microsoft Star Blizzard Report · MITRE ATT&CK T1539 / T1557',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1566.002',
        plainTitle: 'Victim Opens the Spear-Phishing Link & Connects Through the Evilginx Reverse Proxy',
        simpleExplanation:
          'After building rapport via email, the attacker sends a PDF link pointing to a lookalike domain running Evilginx2. Instead of hosting a fake static HTML page, Evilginx acts as a live reverse proxy: it fetches the real login.microsoftonline.com page from Microsoft, rewrites the domain links on the fly, and presents it to the victim.',
        howItWorksInPractice:
          'Because the victim is interacting with the real Microsoft sign-in page proxied through Evilginx, all custom company branding, password checks, and MFA prompts behave authentically.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ routes the victim’s HTTPS request through Node ②/③ (Evilginx Reverse Proxy) to Node ④ (Microsoft Login), and ⇠#1.2 returns the live login page.',
        detectionAndEvidence:
          'Documented in Proxy/DNS Telemetry: Newly registered lookalike domain resolving to VPS hosting Evilginx TLS termination.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1557',
        plainTitle: 'Relaying the MFA Code Live & Intercepting the "ESTSAUTHPERSISTENT" Session Cookie',
        simpleExplanation:
          'When the victim enters their password and 6-digit Authenticator TOTP code, Evilginx forwards both directly to Microsoft Entra ID. Microsoft verifies the MFA code and responds with HTTP Set-Cookie headers containing ESTSAUTH and ESTSAUTHPERSISTENT. Because Evilginx terminates the TLS connection in the middle, it copies these decrypted session cookies into its database.',
        howItWorksInPractice:
          'Only hardware-bound FIDO2 WebAuthn keys (which cryptographically bind authentication to the exact domain name in the browser address bar) block this proxy relay; standard 6-digit codes and push approvals are forwarded transparently.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ relays the TOTP MFA code through Node ③ to Node ④, and ⇠#2.2 shows Microsoft returning Set-Cookie: ESTSAUTHPERSISTENT captured by Evilginx.',
        detectionAndEvidence:
          'Documented in Entra ID SignInLogs: Interactive sign-in with MFA satisfied from Evilginx VPS IP address (Shared SessionId/CorrelationId).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1539',
        plainTitle: 'Replaying the Stolen Cookie in a New Browser & Creating Hidden Inbox Forwarding Rules',
        simpleExplanation:
          'The attacker imports the captured ESTSAUTHPERSISTENT cookie into their own browser on a completely different IP address, gaining instant access to Outlook Web App (OWA) without being asked for a password or MFA again. To maintain access, they create a hidden OWA Inbox rule that silently moves or forwards incoming security emails.',
        howItWorksInPractice:
          'Once a session cookie is issued, the server trusts the cookie as proof that both password and MFA were already verified. Replaying that cookie from a second IP address lets the attacker act as the user.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ replays the stolen cookie from Node ③/④ into Node ⑤ (Outlook Web App) while Node ⑥ (Defender for Cloud Apps / SIEM) flags the IP/ASN jump.',
        detectionAndEvidence:
          'Documented in Exchange Audit Logs (New-InboxRule) and Entra ID Risk Detection: Same session cookie ID replayed across two distinct autonomous systems (ASNs) and User-Agents.',
      },
    ],
  },

  'talos-arcanedoor-asa': {
    scenarioId: 'talos-arcanedoor-asa',
    briefing: {
      headline: 'Scenario Briefing: ArcaneDoor (UAT4356 / Storm-1849) — Line Dancer & Line Runner Implants on Cisco ASA Firewalls',
      plainSummary:
        'Published by Cisco Talos and the UK NCSC (April 2024), ArcaneDoor targeted perimeter Cisco Adaptive Security Appliances (ASA). By sending crafted IPSec IKEv2 packets (CVE-2024-20353), the attacker deploys two cooperating implants: "Line Dancer", an in-memory shellcode interpreter that disables crash dumps and runs commands sent inside normal VPN packets, and "Line Runner", a persistent backdoor hidden inside the firewall’s boot-time flash configuration bundle so it survives reboots and firmware upgrades.',
      diagramTopologySummary:
        'On the diagram: Node ① (UAT4356 Attacker) sends crafted IKEv2/HTTPS payloads to Node ②/③ (Cisco ASA 5500-X Perimeter Firewall). Inside the ASA lina engine, Node ④ (Line Dancer In-Memory Interpreter) disables crash dumps and installs Node ⑤ (Line Runner Flash Persistence & Packet Capture), alerted by Node ⑥ (Talos / SIEM Integrity Monitor).',
      documentedAdvisory: 'Cisco Talos ArcaneDoor Report · CVE-2024-20353 & CVE-2024-20359 · MITRE ATT&CK T1542.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting the Cisco ASA IPSec/WebVPN Interface (CVE-2024-20353) to Inject Shellcode',
        simpleExplanation:
          'The attacker sends specially crafted IPSec IKEv2 and HTTPS WebVPN requests to the Cisco ASA perimeter firewall, exploiting CVE-2024-20353 to corrupt memory inside the ASA’s core lina process and hook the AAA authentication handler.',
        howItWorksInPractice:
          'The lina process handles all VPN termination and packet routing on a Cisco ASA appliance. Hooking its memory gives the attacker control over both management commands and transit network traffic.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the crafted IKEv2/HTTPS payload from Node ① to Node ②/③ (Cisco ASA lina engine), and ⇠#1.2 confirms the memory hook.',
        detectionAndEvidence:
          'Documented by Cisco Talos: Anomalous IKEv2 fragmentation payloads and memory text-segment modification detected via show memory region / verify /md5.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Line Dancer Runs in Memory, Disables Crash Dumps & Executes Commands Hidden in VPN Packets',
        simpleExplanation:
          'The injected "Line Dancer" implant acts as an in-memory shellcode interpreter. Its first action is patching the lina_monitor watchdog in memory so the firewall will never write a forensic crashinfo dump if an exploit fails. After that, whenever the attacker sends an IKEv2 packet containing a specific 16-byte magic header, Line Dancer silently executes the embedded command (such as disabling syslog or exporting configuration) without creating any CLI session.',
        howItWorksInPractice:
          'Because commands arrive disguised as standard IKEv2 VPN negotiation packets and are processed directly in memory before CLI logging, no SSH or console login event ever appears in the firewall logs.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ activates Node ④ (Line Dancer Interpreter) and patches lina_monitor, with ⇠#2.2 returning covert command output.',
        detectionAndEvidence:
          'Documented by Cisco Talos: In-memory patching of crashinfo generation and hook in IKEv2/WebVPN packet parser.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542.004',
        plainTitle: 'Installing Line Runner in Boot Flash (CVE-2024-20359) & Exfiltrating Packet Captures',
        simpleExplanation:
          'To survive reboots, the attacker exploits CVE-2024-20359 by placing a malicious script inside a legacy pre-login client bundle on the firewall’s flash drive (disk0:/csco_config.lua). Every time the ASA boots up, it unzips and runs this script ("Line Runner"), which also silently captures network packets flowing through the firewall and sends them to the attacker.',
        howItWorksInPractice:
          'Cisco’s forensic verification command (verify /sha-512 system:memory/text) compares the running lina code in RAM against the clean signed image on flash to expose Line Dancer and Line Runner modifications.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ writes persistence to Node ⑤ (disk0: Flash & Packet Capture Buffer) and triggers Node ⑥ (SIEM / Integrity Verification Alert).',
        detectionAndEvidence:
          'Documented in Cisco Advisory: Unexpected files or modified Lua scripts on disk0: and mismatch in verify /sha-512 system:memory/text.',
      },
    ],
  },

  'talos-fortinet-coathanger-apt': {
    scenarioId: 'talos-fortinet-coathanger-apt',
    briefing: {
      headline: 'Scenario Briefing: COATHANGER RAT (CVE-2024-21762) — Stealthy FortiGate Firewall Implant That Survives Firmware Upgrades',
      plainSummary:
        'Documented by the Dutch Military Intelligence and Security Service (MIVD), NCSC-NL, and Cisco Talos (February 2024), COATHANGER is a stealthy remote access trojan designed specifically for FortiGate firewalls. The attacker exploits an out-of-bounds memory write flaw in the FortiOS SSL-VPN daemon (CVE-2024-21762) without authentication. Once inside, COATHANGER injects an LD_PRELOAD library hook to hide its files from administrators and replaces the legitimate disk-health binary (/bin/smartctl) so the backdoor automatically re-infects the system even after a firmware update.',
      diagramTopologySummary:
        'On the diagram: Node ① (Threat Actor) sends malformed HTTP chunked requests to Node ②/③ (FortiGate SSL-VPN sslvpnd). Inside FortiOS, Node ④ (COATHANGER Preload Hook & /bin/smartctl Injector) hooks Node ⑤ (nvram / Firmware Reboot Handler & Admin Auth), monitored by Node ⑥ (FortiAnalyzer / SIEM).',
      documentedAdvisory: 'NCSC-NL / MIVD Advisory (Feb 2024) · CVE-2024-21762 · MITRE ATT&CK T1574.006 / T1542',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting FortiOS SSL-VPN Chunked Transfer Encoding (CVE-2024-21762)',
        simpleExplanation:
          'The attacker sends crafted HTTPS requests with malformed HTTP Transfer-Encoding: chunked length headers to the FortiGate SSL-VPN daemon (/remote/login). This triggers an out-of-bounds write in the sslvpnd process (CVE-2024-21762), allowing unauthenticated remote code execution on the appliance.',
        howItWorksInPractice:
          'Because the bug sits in the pre-authentication HTTP chunk parser of sslvpnd, any FortiGate appliance with SSL-VPN exposed to the internet could be exploited without valid user credentials.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the malformed chunked HTTP stream from Node ① to Node ②/③ (FortiGate sslvpnd), and ⇠#1.2 confirms shellcode execution.',
        detectionAndEvidence:
          'Documented in NCSC-NL COATHANGER Report: Malformed chunked transfer requests to SSL-VPN endpoints and sslvpnd crash/fork anomalies.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.006',
        plainTitle: 'Hooking System Libraries (preload.so) & Replacing /bin/smartctl to Hide inside FortiOS',
        simpleExplanation:
          'COATHANGER creates a hidden directory (/data/lib/) containing preload.so and sh2. It replaces the legitimate /bin/smartctl utility with a trojanized binary that injects preload.so into running FortiOS daemons (including the HTTPS administrative daemon httpsd and cli). The preload library hooks standard C functions (like readdir and open) so the hidden files never appear in directory listings.',
        howItWorksInPractice:
          'Whenever FortiOS runs /bin/smartctl during boot or health checks, the trojanized binary re-injects preload.so into userland processes, hiding COATHANGER from standard CLI inspection.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ shows Node ④ replacing /bin/smartctl and injecting preload.so into httpsd/init, with ⇠#2.2 confirming userland syscall hooks active.',
        detectionAndEvidence:
          'Documented by MIVD/NCSC-NL: Presence of /data/lib/preload.so, modified /bin/smartctl hash, and /proc/<pid>/maps referencing preload.so.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542',
        plainTitle: 'Intercepting Admin Passwords in Memory & Surviving Firmware Reboots',
        simpleExplanation:
          'Because preload.so hooks the authentication functions inside httpsd and sshd, it captures plaintext administrator passwords whenever an admin logs into the FortiGate. Furthermore, it hooks the reboot and firmware-upgrade routines so that right before the firewall restarts into a newly installed firmware image, COATHANGER copies itself into the new partition.',
        howItWorksInPractice:
          'Because COATHANGER hooks the firmware installer itself, simply upgrading FortiOS does not remove an existing infection—full reformatting and credential rotation are required.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ to Node ⑤ (Firmware Partition & Auth Hook) and triggers Node ⑥ (SIEM File Integrity Alert).',
        detectionAndEvidence:
          'Documented in NCSC-NL Technical Annex: Outbound TLS connection using custom certificate pinning and filesystem modifications across /data2/ partitions.',
      },
    ],
  },

  'f5-bigip-request-smuggling': {
    scenarioId: 'f5-bigip-request-smuggling',
    briefing: {
      headline: 'Scenario Briefing: F5 BIG-IP TMUI Request Smuggling (CVE-2023-46747) — Bypassing Auth via Internal AJP Proxy',
      plainSummary:
        'Based on F5 Security Advisory K000137353 and ProjectDiscovery research, this scenario demonstrates how HTTP/AJP Request Smuggling on an F5 BIG-IP load balancer allows unauthenticated remote code execution. On a BIG-IP appliance, external requests to the Traffic Management User Interface (TMUI) first pass through Apache httpd (which checks authentication) and are then forwarded over the binary Apache JServ Protocol (AJP) to an internal Apache Tomcat server. By sending an oversized HTTP header, the attacker smuggles fake AJP attributes (remote_user=admin) straight to Tomcat, creates an admin user, and executes root bash commands via the iControl REST API.',
      diagramTopologySummary:
        'On the diagram: Node ① (Attacker) sends the smuggled AJP request to Node ②/③ (F5 BIG-IP Apache TMUI Front-End). Inside the appliance, Node ④ (Internal AJP/Tomcat & iControl REST Daemon) processes the forged admin session and accesses Node ⑤ (SSL Private Keys & Traffic Plane), monitored by Node ⑥ (F5 ASM / SIEM).',
      documentedAdvisory: 'F5 Advisory K000137353 · CISA KEV CVE-2023-46747 · MITRE ATT&CK T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Smuggling Forged "remote_user=admin" AJP Attributes Past Apache into Internal Tomcat',
        simpleExplanation:
          'The attacker sends a POST request to /tmui/login.jsp on the BIG-IP management port with carefully crafted Transfer-Encoding and oversized headers. When mod_proxy_ajp translates the request into binary AJP packets for the internal Tomcat server (127.0.0.1:8009), buffer misalignment causes Tomcat to interpret the attacker’s payload as a second, pre-authenticated AJP request with attribute remote_user="admin" targeting /tmui/Control/form.',
        howItWorksInPractice:
          'Internal Tomcat trusts Apache httpd to tell it which user is logged in via the AJP remote_user attribute. By smuggling bytes into the AJP stream, the attacker tricks Tomcat into thinking Apache already authenticated them as "admin".',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the smuggled payload from Node ① through Node ②/③ (Apache mod_proxy_ajp) into Node ④ (Tomcat :8009), and ⇠#1.2 creates a local admin account.',
        detectionAndEvidence:
          'Documented in F5 Advisory K000137353: Anomalous POST requests to /tmui/Control/form and unexpected user creation in /var/log/audit.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Using the Forged Admin Account to Run Root Commands via iControl REST (/mgmt/tm/util/bash)',
        simpleExplanation:
          'Having used the smuggled AJP request to create a temporary administrator account in the BIG-IP database, the attacker authenticates to the local iControl REST API (/mgmt/tm/util/bash) and sends JSON command payloads ({"command":"run","utilCmdArgs":"-c id"}) that execute directly as root.',
        howItWorksInPractice:
          'While the Tomcat web process runs as a restricted user, F5’s iControl REST endpoint (/mgmt/tm/util/bash) allows valid administrators to run arbitrary bash commands with full root privileges.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ invokes /mgmt/tm/util/bash on Node ④ (icrd_child / bash), and ⇠#2.2 returns uid=0(root) command output.',
        detectionAndEvidence:
          'Documented in /var/log/restjavad-audit.0.log and /var/log/ltm: POST /mgmt/tm/util/bash spawning icrd_child -> /bin/bash as root.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.004',
        plainTitle: 'Extracting SSL/TLS Private Keys (/config/filestore) & Deleting Audit Trails',
        simpleExplanation:
          'Because F5 BIG-IP terminates HTTPS encryption for enterprise web applications, the root attacker reads the SSL/TLS private keys stored under /config/filestore/files_d/Common_d/certificate_key_d/ and extracts the master configuration (/config/bigip.conf) before deleting their temporary admin user.',
        howItWorksInPractice:
          'Stealing TLS private keys and bigip.conf gives the attacker both the certificates for public domains and the credentials for backend load-balanced servers.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ reads SSL keys from Node ⑤ (/config/filestore) via Node ④ while Node ⑥ (SIEM) alerts on restjavad and audit events.',
        detectionAndEvidence:
          'Documented in F5 Forensics Guidance: Access to /config/filestore/.../certificate_key_d/ and audit log entries for temporary admin account deletion.',
      },
    ],
  },

  'splunk-ivanti-connect-secure': {
    scenarioId: 'splunk-ivanti-connect-secure',
    briefing: {
      headline: 'Scenario Briefing: Ivanti Connect Secure Zero-Day Chain (CVE-2023-46805 & CVE-2024-21887) — VPN Takeover & Key Theft',
      plainSummary:
        'Based on Volexity (UTA0178), Mandiant (UNC5221), and Splunk SURGe research, this scenario shows how attackers chained two flaws in Ivanti Connect Secure VPN appliances. First, they use a path-traversal URL (/api/v1/totp/user-backup-code/../../license/keys-status/) to bypass authentication (CVE-2023-46805) and reach a command-injection flaw (CVE-2024-21887). Second, they modify Python scripts on the appliance (wirefilter.py) while patching the built-in Integrity Checker Tool (ICT) so the appliance reports "0 modified files". Third, they deploy the GLASSTOKEN webshell and steal cryptographic keys.',
      diagramTopologySummary:
        'On the diagram: Node ① (UTA0178 / UNC5221 Attacker) sends the chained path-traversal + command-injection request to Node ②/③ (Ivanti Connect Secure REST API). Inside the VPN appliance, Node ④ (Python Web Server & Modified wirefilter.py) disables the Integrity Checker and accesses Node ⑤ (Session Store & Cavium Crypto Keys), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA Emergency Directive ED 24-01 · Volexity / Mandiant / Splunk SURGe CVE-2024-21887 · MITRE T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Chaining Path Traversal (CVE-2023-46805) with License-Key Command Injection (CVE-2024-21887)',
        simpleExplanation:
          'On Ivanti Connect Secure, the endpoint /api/v1/totp/user-backup-code/ does not require prior authentication. By appending ../../license/keys-status/;python3%20-c%20..., the attacker traverses out of the unauthenticated TOTP folder into the authenticated license status handler, which passes the semicolon-separated URL parameter directly to popen() as root.',
        howItWorksInPractice:
          'Neither bug alone was enough for unauthenticated RCE: CVE-2023-46805 opened the door past the login check via "../..", and CVE-2024-21887 executed the shell command inside the protected admin endpoint.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the traversal + command injection URI from Node ① to Node ②/③ (Ivanti REST API), and ⇠#1.2 executes python3 via popen().',
        detectionAndEvidence:
          'Documented by Volexity & Splunk SURGe: HTTP requests containing /api/v1/totp/user-backup-code/../../license/keys-status/ or /api/v1/configuration/users/user-roles/.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Injecting a Webshell into wirefilter.py & Tampering with the Integrity Checker Tool (ICT)',
        simpleExplanation:
          'After remounting the read-only root filesystem as read-write (mount -o remount,rw /), the attacker injects a backdoor handler into /home/venv3/lib/python3.6/site-packages/jnpr/hippo/wirefilter.py. To stop administrators from noticing the modified file, they also patch Ivanti’s built-in Integrity Checker Tool (scanner.py) so it always reports a clean snapshot.',
        howItWorksInPractice:
          'Because the internal Integrity Checker Tool was running on the same compromised operating system, the attacker simply edited the checker script to skip or forge the hash check for wirefilter.py.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ modifies wirefilter.py and scanner.py inside Node ④, with ⇠#2.2 returning a forged "0 modified files" ICT report.',
        detectionAndEvidence:
          'Documented by Mandiant (UNC5221): External ICT snapshot comparison showing modified wirefilter.py / visit.py and unscheduled syslog forwarding pauses.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Stealing Active VPN Session Cookies, LDAP Credentials & Cavium Crypto Keys',
        simpleExplanation:
          'Through the implanted webshell (GLASSTOKEN / ZIPLINE), the attacker reads active DSID VPN session cookies and cached Active Directory LDAP bind credentials from memory, extracts private keys from the Cavium cryptographic module, and pivots into internal corporate servers.',
        howItWorksInPractice:
          'Stealing active DSID VPN cookies lets the attacker hijack existing employee VPN tunnels without triggering any new login or MFA prompt.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ harvests credentials from Node ⑤ (Cavium Crypto & Session Store) via Node ④ while Node ⑥ (Splunk SIEM) correlates the post-VPN lateral movement.',
        detectionAndEvidence:
          'Documented in CISA ED 24-01 & Splunk SURGe: DSID session hijacking from mismatched source IPs and unexpected LDAP/SMB binds originating from the VPN internal interface.',
      },
    ],
  },

  'splunk-citrix-bleed-session-hijack': {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    briefing: {
      headline: 'Scenario Briefing: Citrix Bleed (CVE-2023-4966) — Leaking Session Tokens from NetScaler Memory to Bypass MFA',
      plainSummary:
        'Documented by CISA Advisory AA23-325A, Mandiant, and Splunk SURGe, "Citrix Bleed" (CVE-2023-4966) is a memory over-read flaw in Citrix NetScaler ADC and Gateway appliances. When an attacker sends an HTTP GET request to the OpenID Connect configuration page with an abnormally long Host header (around 24,000+ characters), the appliance constructs a JSON response using snprintf() without checking that the buffer overflowed—causing it to dump raw adjacent server memory back in the HTTP response. Inside that leaked memory sits the plaintext NSC_AAAC session cookie of an already logged-in administrator.',
      diagramTopologySummary:
        'On the diagram: Node ① (Attacker) sends the oversized Host header request to Node ②/③ (Citrix NetScaler Gateway nsppe). Node ④ (nsppe Memory Buffer & Session Replay) leaks the 65-byte NSC_AAAC token, allowing the attacker to hijack a Virtual Desktop session and pivot via DCOM to Node ⑤ (Internal Domain Server), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA Advisory AA23-325A · Splunk SURGe Citrix Bleed Analysis · CVE-2023-4966 · MITRE T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending an Oversized HTTP "Host" Header to Leak Adjacent NetScaler RAM (CVE-2023-4966)',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS GET request to /oauth/idp/.well-known/openid-configuration on the Citrix NetScaler Gateway. Normally, the server inserts the HTTP Host header into six fields of a JSON template using snprintf() and uses the return value to send the response. By sending a 24,576-byte Host header, snprintf() returns the theoretical length (~147 KB) rather than the actual buffer size (131 KB), causing the server to transmit ~16 KB of raw adjacent heap memory.',
        howItWorksInPractice:
          'In C programming, snprintf() returns the number of bytes that *would* have been written if the buffer were big enough. Passing that unchecked number to the HTTP response writer tricks NetScaler into sending whatever sensitive data was sitting next to the buffer in RAM.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the 24 KB Host header from Node ① to Node ②/③ (Citrix NetScaler /oauth/idp/), and ⇠#1.2 returns HTTP 200 OK leaking 131 KB of memory.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A & Suricata SID 2048918: GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB HTTP 200 response.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1539',
        plainTitle: 'Extracting the 65-Character "NSC_AAAC" Cookie & Hijacking an Active MFA Session',
        simpleExplanation:
          'Scanning the leaked raw memory bytes with a regular expression ([0-9a-f]{32,65}), the attacker extracts a live NSC_AAAC session token belonging to an administrator who had already completed multi-factor authentication. By setting Cookie: NSC_AAAC=<leaked_token> in their own client, the attacker steps directly into the authenticated Citrix VDI session.',
        howItWorksInPractice:
          'Because the NSC_AAAC token represents an already-authenticated session, replaying it bypasses both password verification and MFA completely, even surviving a password reset unless active sessions are explicitly terminated on the NetScaler.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ replays the leaked NSC_AAAC cookie on Node ③/④ (NetScaler Session Engine), and ⇠#2.2 grants VDI ICA desktop access without MFA.',
        detectionAndEvidence:
          'Documented in NetScaler AAA Syslog: Same NSC_AAAC session identifier active across two different client IP addresses without a new authentication event.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1021.003',
        plainTitle: 'Pivoting from the Hijacked Citrix VDI Desktop into Internal Servers via DCOM/RPC',
        simpleExplanation:
          'Inside the hijacked virtual desktop session, the attacker runs reconnaissance tools (netscan, adfind), dumps credentials from memory, and uses Distributed COM (DCOM / MMC20.Application over RPC port 135) to execute commands laterally on internal Windows servers.',
        howItWorksInPractice:
          'Executing commands via DCOM MMC20.Application causes the remote server to spawn mmc.exe -Embedding, allowing lateral movement without creating a new Windows service.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pivots from Node ④ (VDI Session) to Node ⑤ (Internal Server via DCOM :135) while Node ⑥ (Splunk SIEM) correlates the session hijack.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A: mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change.',
      },
    ],
  },

  'kaspersky-operation-triangulation': {
    scenarioId: 'kaspersky-operation-triangulation',
    briefing: {
      headline: 'Scenario Briefing: Operation Triangulation — Zero-Click iMessage Font Exploit & Undocumented Hardware DMA Bypass',
      plainSummary:
        'Discovered and documented by Kaspersky GReAT (2023–2024), Operation Triangulation is one of the most sophisticated zero-click mobile exploit chains ever analyzed. The victim receives an invisible iMessage attachment that triggers a memory corruption bug in Apple’s TrueType font parser (ADJUST instruction, CVE-2023-41990) without the user ever opening or seeing the message. Next, to bypass Apple’s hardware-enforced page protection (PPL), the exploit writes directly to undocumented CPU Memory-Mapped I/O (MMIO) hardware registers (CVE-2023-38606) using Direct Memory Access (DMA) to plant the TriangleDB memory-only implant.',
      diagramTopologySummary:
        'On the diagram: Node ① (Triangulation Delivery Server) sends the invisible iMessage attachment through Node ② (APNs Push Gateway) to Node ③ (iOS IMAgent Process). Inside the device, Node ④ (FontParser CVE-2023-41990 & Hardware MMIO DMA CVE-2023-38606) patches kernel memory and launches Node ⑤ (TriangleDB In-Memory Implant), detected via forensic traces on Node ⑥ (Kaspersky Mobile Forensics / SIEM).',
      documentedAdvisory: 'Kaspersky GReAT Operation Triangulation Series · CVE-2023-41990 & CVE-2023-38606 · MITRE T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1203',
        plainTitle: 'Zero-Click iMessage Attachment Triggers the TrueType Font "ADJUST" Bug (CVE-2023-41990)',
        simpleExplanation:
          'The target device receives an iMessage containing a disguised archive/PDF with an embedded TrueType font. Background process IMAgent automatically previews the attachment without displaying any notification to the user. Inside libFontParser.dylib, a legacy TrueType bytecode instruction named ADJUST (opcode 0x8F/0x90) causes an out-of-bounds write, giving the attacker initial code execution inside IMAgent.',
        howItWorksInPractice:
          'Because IMAgent parses attachment previews automatically in the background as soon as the push payload arrives, the victim never has to tap or view anything ("Zero-Click").',
        diagramAlignment:
          'On the diagram, arrow #1.1→ delivers the zero-click iMessage payload from Node ①/② to Node ③ (IMAgent FontParser), and ⇠#1.2 triggers RCE in userland.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: MobileBackup/Sysdiagnose artifacts showing anomalous IMAgent attachment processing followed by immediate message deletion.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Bypassing Hardware Memory Protection via Undocumented MMIO Registers (CVE-2023-38606)',
        simpleExplanation:
          'Even after exploiting the kernel, modern Apple silicon chips prevent software—even the kernel itself—from modifying protected page tables (PPL). To bypass this hardware lock, the exploit writes directly to undocumented physical Memory-Mapped I/O (MMIO) addresses belonging to an on-chip hardware block (CVE-2023-38606), instructing the chip’s own Direct Memory Access (DMA) engine to overwrite protected kernel memory.',
        howItWorksInPractice:
          'Because the hardware DMA engine accesses physical RAM directly outside the CPU’s Page Protection Layer checks, it can modify read-only kernel memory structures so the attacker can run unsigned code.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ writes to physical MMIO DMA registers to overwrite kernel memory, with ⇠#2.2 granting full kernel read/write.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT (37C3 presentation): Physical MMIO range writes at 0x206040000 bypassing PPL page table restrictions.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Deleting Message Traces & Running the Memory-Only "TriangleDB" Implant',
        simpleExplanation:
          'With full kernel privileges, the validator stage erases all forensic traces of the incoming iMessage from sms.db and launches the Mach-O implant "TriangleDB" strictly in volatile RAM. TriangleDB monitors microphone, location, and keychain data until the phone is rebooted.',
        howItWorksInPractice:
          'Although TriangleDB leaves no executable file on flash storage, forensic analysts detect the compromise by spotting orphaned network data usage entries in DataUsage.sqlite and modification timestamp gaps in iOS backup files.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ deploys Node ⑤ (TriangleDB in RAM) and beacons out while Node ⑥ (Kaspersky MVT / SIEM) detects the DataUsage.sqlite & OSAnalytics anomalies.',
        detectionAndEvidence:
          'Documented in Kaspersky triangle_check tool: Orphaned network usage records in DataUsage.sqlite for system processes and timestamp gaps in OSAnalytics.',
      },
    ],
  },

  'kaspersky-toddycat-eset-dll': {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    briefing: {
      headline: 'Scenario Briefing: ToddyCat APT (CVE-2024-11859) — Abusing an ESET Command-Line Scanner for DLL Search-Order Hijacking',
      plainSummary:
        'Documented by Kaspersky GReAT and ESET Security Advisory (CVE-2024-11859), this scenario illustrates how the ToddyCat APT group abused a legitimate, digitally signed security tool: the ESET Command Line Scanner (ecls.exe). Due to a DLL search-order hijacking vulnerability in older versions of ecls.exe, placing a malicious DLL named version.dll in the same directory caused the trusted antivirus scanner itself to load and execute the attacker’s TCESB / Samurai loader in memory.',
      diagramTopologySummary:
        'On the diagram: Node ①/② stages the signed ecls.exe binary and malicious version.dll on Node ③ (Target Workstation/Server). Running ecls.exe on Node ③ loads Node ④ (Trojanized version.dll & TCESB Loader), which decrypts the C2 implant communicating with Node ⑤ while Node ⑥ (SIEM / EDR) detects the unsigned DLL load.',
      documentedAdvisory: 'Kaspersky GReAT ToddyCat Report · ESET Advisory CVE-2024-11859 · MITRE ATT&CK T1574.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.001',
        plainTitle: 'Launching the Signed ESET Scanner (ecls.exe) Alongside a Malicious version.dll',
        simpleExplanation:
          'The attacker copies a standalone, validly signed copy of ESET Command Line Scanner (ecls.exe) into a staging directory such as C:\\ProgramData\\ESET\\ alongside a malicious version.dll. Because of CVE-2024-11859, when ecls.exe starts, it loads version.dll from its current directory before checking C:\\Windows\\System32\\.',
        howItWorksInPractice:
          'Using a genuine antivirus scanner binary as the host process helps the attacker blend in on enterprise systems where security binaries are common.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (Signed ecls.exe) loading Node ④ (Malicious version.dll via CVE-2024-11859), with ⇠#1.2 logging Sysmon EventID 7.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 & ESET Advisory CVE-2024-11859: ecls.exe loading unsigned version.dll from outside System32.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'Proxying Legitimate DLL Exports While Decrypting the ToddyCat TCESB Payload in Memory',
        simpleExplanation:
          'To prevent ecls.exe from crashing with missing-function errors, the malicious version.dll forwards normal API calls to the real C:\\Windows\\System32\\version.dll while its DllMain function reads an encrypted payload file from disk and decrypts the ToddyCat TCESB loader in memory.',
        howItWorksInPractice:
          'DLL Export Proxying ensures that the host application continues to function normally while the attacker’s code runs on a background thread inside the same process.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ decrypts the TCESB payload into executable memory while proxying exports, and ⇠#2.2 confirms stage 2 initialization.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: Dual loading of version.dll (both local unsigned and System32 signed) inside ecls.exe process memory.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing an Encrypted C2 Channel From Inside the Trusted ESET Process',
        simpleExplanation:
          'Running inside the memory space of the signed ecls.exe binary, the TCESB backdoor opens an outbound HTTPS tunnel to ToddyCat’s command-and-control infrastructure and harvests local browser and domain credentials.',
        howItWorksInPractice:
          'Because ecls.exe is an offline command-line file scanner, it should never open outbound HTTPS connections to external web servers—making Sysmon EventID 3 network telemetry a clear detection signal.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ (ecls.exe / TCESB) to Node ⑤ (External C2) and triggers an alert on Node ⑥ (SIEM / EDR).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 3 (NetworkConnect): Standalone command-line scanner ecls.exe initiating outbound TCP/443 connections.',
      },
    ],
  },

  'kaspersky-lazarus-byovd-fudmodule': {
    scenarioId: 'kaspersky-lazarus-byovd-fudmodule',
    briefing: {
      headline: 'Scenario Briefing: Lazarus Group FudModule Rootkit — Admin-to-Kernel Zero-Day (CVE-2024-21338) Blinding Windows EDR',
      plainSummary:
        'Discovered by Avast and analyzed by Kaspersky and Microsoft (February 2024), this scenario shows how the Lazarus Group upgraded their "FudModule" rootkit. Previously, attackers had to drop a vulnerable third-party driver onto the system (Bring Your Own Vulnerable Driver). Here, Lazarus exploited a zero-day flaw inside Windows’ own built-in AppLocker driver (appid.sys, CVE-2024-21338). By sending a crafted IOCTL control code from a local service to appid.sys, the attacker achieves arbitrary kernel memory read/write and zeroes out the kernel callback tables and ETW sensors that EDR agents rely on.',
      diagramTopologySummary:
        'On the diagram: From a local admin/service foothold (Node ①/②), the attacker runs the FudModule DLL on Node ③ (Windows Host). Node ④ (FudModule IOCTL Exploit) targets the built-in Windows driver appid.sys (CVE-2024-21338) to overwrite Node ⑤ (Kernel PspCreateProcessNotifyRoutine & ETW Ti-Sensor), detected via pre-blind telemetry on Node ⑥ (SIEM).',
      documentedAdvisory: 'Avast / Kaspersky Lazarus FudModule Report · Microsoft CVE-2024-21338 · MITRE ATT&CK T1068 / T1562.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Opening a Handle to the Built-in Windows AppLocker Driver (\\\\.\\ahcache / appid.sys)',
        simpleExplanation:
          'Because Windows blocks untrusted kernel drivers via Driver Signature Enforcement (DSE) and vulnerable-driver blocklists, the attacker elevates a userland process to LOCAL SERVICE privileges and opens a device handle to Windows’ own digitally signed AppLocker driver (C:\\Windows\\System32\\drivers\\appid.sys).',
        howItWorksInPractice:
          'Because appid.sys is a native, inbox Windows kernel driver present on every modern Windows installation, the attacker does not have to drop or load any external .sys driver file.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (Userland Service Loader) opening a device handle to Node ④ (appid.sys Kernel Driver), with ⇠#1.2 returning the valid driver handle.',
        detectionAndEvidence:
          'Documented in Avast & Microsoft CVE-2024-21338 Analysis: Non-standard service process opening device handle to \\Device\\AppId and issuing IOCTL 0x22A018.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Sending a Crafted IOCTL (0x22A018) to Flip Kernel PreviousMode to 0',
        simpleExplanation:
          'FudModule calls DeviceIoControl with IOCTL code 0x22A018 (AipSmartHashImageFile) and passes carefully forged kernel structure pointers. Because appid.sys trusts the caller’s pointer in CVE-2024-21338, it invokes a kernel gadget that flips the current thread’s KTHREAD.PreviousMode field from UserMode (1) to KernelMode (0).',
        howItWorksInPractice:
          'When a thread’s PreviousMode is set to 0 (KernelMode), Windows system calls like NtReadVirtualMemory and NtWriteVirtualMemory skip user-mode address checks and allow the thread to read and write anywhere in ring-0 kernel memory.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ sends IOCTL 0x22A018 inside Node ④ (appid.sys!AipSmartHashImageFile), and ⇠#2.2 flips KTHREAD.PreviousMode = 0.',
        detectionAndEvidence:
          'Documented in Kernel Crash/ETW Telemetry: IOCTL 0x22A018 targeting appid.sys followed by KTHREAD PreviousMode modification.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Zeroing Out Kernel EDR Callbacks & Disabling Windows Threat-Intelligence ETW',
        simpleExplanation:
          'With full kernel read/write access (Direct Kernel Object Manipulation — DKOM), FudModule walks the Windows kernel’s PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays, zeroing out the callback pointers registered by the endpoint’s EDR security agent, and disables the EtwThreatIntProvRegHandle provider so the EDR agent goes completely blind.',
        howItWorksInPractice:
          'Instead of terminating the EDR service (which would immediately alert the SOC that the agent stopped running), FudModule leaves the EDR process running normally while unhooking its kernel eyes and ears.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ overwrites Node ⑤ (Kernel Callback Arrays & ETW Handle) from Node ④ while Node ⑥ (SIEM) logs the sudden telemetry heartbeat drop.',
        detectionAndEvidence:
          'Documented by Kaspersky & Avast: Kernel Patch Protection (PatchGuard) / Defender Kernel Integrity alert on PspCreateProcessNotifyRoutine and EtwThreatIntProvRegHandle tampering.',
      },
    ],
  },

  'mandiant-apt29-teamcity-jetstream': {
    scenarioId: 'mandiant-apt29-teamcity-jetstream',
    briefing: {
      headline: 'Scenario Briefing: APT29 JetBrains TeamCity Exploitation (CVE-2023-42793) — CI/CD Build Server Takeover',
      plainSummary:
        'Documented by Joint CISA/FBI/NSA/NCSC Advisory and Mandiant (October 2023), this scenario shows how APT29 (Midnight Blizzard) exploited CVE-2023-42793 in on-premises JetBrains TeamCity CI/CD servers. Because an authentication wildcard flaw allowed anyone to reach internal REST paths that ended with /RPC2, the attacker sent a single unauthenticated POST request to mint a permanent administrator bearer token, enabled the hidden internal debug command endpoint, and abused the CI/CD server’s high privileges to compromise software build pipelines and Active Directory.',
      diagramTopologySummary:
        'On the diagram: Node ① (APT29 Operator) sends the unauthenticated /app/rest/users/id:1/tokens/RPC2 request through Node ② (Reverse Proxy) to Node ③ (TeamCity CI/CD Server). Inside TeamCity, Node ④ (REST Token Minter & debug/processes Executor) spawns commands and steals build secrets from Node ⑤ (Signing Keys & AD Vault), monitored by Node ⑥ (SIEM).',
      documentedAdvisory: 'CISA/FBI/NSA/NCSC Joint Advisory (Oct 2023) · Mandiant CVE-2023-42793 · MITRE ATT&CK T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Appending "/RPC2" to Mint an Admin Bearer Token Without Logging In (CVE-2023-42793)',
        simpleExplanation:
          'In vulnerable TeamCity versions, an authentication interceptor rule excluded any URL matching /**/RPC2 from login checks. The attacker exploits this by sending an unauthenticated HTTP POST request to /app/rest/users/id:1/tokens/RPC2. TeamCity treats "/RPC2" as the name of the new token for user ID 1 (the primary super-admin) and immediately returns the newly generated secret bearer token in the HTTP 200 response.',
        howItWorksInPractice:
          'The developer intended /**/RPC2 to only exempt the legacy XML-RPC endpoint at the root path, but the wildcard accidentally exempted every REST API path that ended with "/RPC2".',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends POST /app/rest/users/id:1/tokens/RPC2 from Node ①/② to Node ③ (TeamCity Server), and ⇠#1.2 returns the plaintext admin Bearer token.',
        detectionAndEvidence:
          'Documented in TeamCity teamcity-javaLogging / access logs: POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE /app/rest/users/id:1/tokens/RPC2.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059',
        plainTitle: 'Using the Admin Token to Unlock the Internal Debug Process Executor (/app/rest/debug/processes)',
        simpleExplanation:
          'Authenticating with Authorization: Bearer <token>, the attacker first modifies the internal server property rest.debug.processes.enable=true, and then sends POST requests to /app/rest/debug/processes?exePath=cmd.exe&params=/c+... to execute arbitrary OS commands under the TeamCity service account—immediately deleting the RPC2 token afterward to hide how they got in.',
        howItWorksInPractice:
          'Deleting the RPC2 token seconds after running commands removes it from the active token list, though the creation/deletion events remain in teamcity-activities.log.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ invokes /app/rest/debug/processes on Node ④ (TeamCity JVM Process Spawner), and ⇠#2.2 spawns the child shell process.',
        detectionAndEvidence:
          'Documented by Mandiant: POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Harvesting CI/CD Build Secrets, Code-Signing Keys & Pivoting into Active Directory',
        simpleExplanation:
          'Because CI/CD build servers store credentials for cloud deployments, source-code repositories, and code-signing certificates, APT29 extracts the TeamCity encryption keys and database credentials, creates a backdoor admin account, and deploys a persistent beacon.',
        howItWorksInPractice:
          'Compromising a CI/CD build server gives the attacker access to every environment the build server deploys to, turning a single web bug into enterprise-wide access.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ extracts secrets from Node ⑤ (CI/CD Vault & AD) via Node ④ while Node ⑥ (SIEM) triggers on TeamCity child process and token anomalies.',
        detectionAndEvidence:
          'Documented in Joint CISA Advisory: Creation of new TeamCity admin accounts in teamcity-activities.log and outbound C2 beacon from TeamCity server.',
      },
    ],
  },

  'splunk-screenconnect-slashandgrab': {
    scenarioId: 'splunk-screenconnect-slashandgrab',
    briefing: {
      headline: 'Scenario Briefing: ConnectWise ScreenConnect "SlashAndGrab" (CVE-2024-1709) — Trailing-Slash Setup Wizard Reset',
      plainSummary:
        'Documented by Huntress ("SlashAndGrab"), CISA, and Splunk SURGe (February 2024), CVE-2024-1709 is one of the simplest yet most devastating authentication bypass bugs ever found in remote monitoring and management (RMM) software. On ConnectWise ScreenConnect servers, the initial installation wizard (/SetupWizard.aspx) is supposed to be blocked once the server is configured. However, appending a trailing slash or path suffix (/SetupWizard.aspx/anything) confused the ASP.NET URL path handler into reopening the setup wizard—allowing anyone on the internet to overwrite the server’s primary administrator account and push commands to all connected customer endpoints.',
      diagramTopologySummary:
        'On the diagram: Node ① (Threat Actor) sends the /SetupWizard.aspx/ request through Node ② (Edge Firewall :8040/:443) to Node ③ (ScreenConnect RMM Server). Inside the server, Node ④ (SetupWizard User.xml Overwrite & Extension Engine) resets the admin account and pushes remote PowerShell/MSI payloads to Node ⑤ (Managed Client Endpoints), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA KEV CVE-2024-1709 · Splunk SURGe & Huntress SlashAndGrab Analysis · MITRE ATT&CK T1190 / T1219',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Accessing "/SetupWizard.aspx/anything" to Reopen the Initial Installation Wizard (CVE-2024-1709)',
        simpleExplanation:
          'The ScreenConnect authentication module checked whether the requested URL exactly ended with /SetupWizard.aspx to block access on already-configured servers. By requesting GET /SetupWizard.aspx/anything, the check fails to match, while ASP.NET still routes the request to SetupWizard.aspx with PathInfo="/anything", presenting the unauthenticated initial setup form.',
        howItWorksInPractice:
          'This classic path-normalization mismatch between a custom security filter and the underlying ASP.NET web framework allowed anyone to reach the first-time setup wizard with a single extra "/" character.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends GET /SetupWizard.aspx/anything from Node ①/② to Node ③ (ScreenConnect Server), and ⇠#1.2 returns HTTP 200 SetupWizard form.',
        detectionAndEvidence:
          'Documented by Splunk SURGe & Huntress: HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Submitting the Setup Form to Overwrite the Server’s "User.xml" Administrator Database',
        simpleExplanation:
          'The attacker submits a POST request to /SetupWizard.aspx/anything with a new administrator username and password. ScreenConnect overwrites C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml, replacing all existing administrator accounts with the attacker’s new super-admin credential.',
        howItWorksInPractice:
          'Overwriting User.xml immediately locks out the legitimate IT administrators while logging the attacker directly into the ScreenConnect administrative console.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ overwrites App_Data\\User.xml with the rogue admin account, and ⇠#2.2 returns an authenticated admin session cookie.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 & ScreenConnect Audit Logs: Modification of C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml by ScreenConnect.Service.exe.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1219',
        plainTitle: 'Abusing the RMM Console to Push SYSTEM Commands to Connected Client Machines',
        simpleExplanation:
          'Because ScreenConnect agents (ScreenConnect.ClientService.exe) run as SYSTEM on every managed workstation and server in the organization, the attacker uses their new admin console to broadcast PowerShell scripts and ransomware payloads simultaneously across all connected endpoints via C:\\Windows\\Temp\\ScreenConnect\\.',
        howItWorksInPractice:
          'When an RMM command is sent from the server, the client agent writes a temporary .cmd or .ps1 script into C:\\Windows\\Temp\\ScreenConnect\\<version>\\ and executes it as NT AUTHORITY\\SYSTEM.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pushes remote commands from Node ④ to Node ⑤ (Managed Endpoints running ScreenConnect.ClientService.exe) while Node ⑥ (Splunk SIEM) alerts.',
        detectionAndEvidence:
          'Documented by Huntress & Splunk SURGe: ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd.',
      },
    ],
  },
};
