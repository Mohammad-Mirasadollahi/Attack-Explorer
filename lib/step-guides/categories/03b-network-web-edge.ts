import type { CategoryStandardPatchMap } from './types';

/**
 * Category 3B — NETWORK_WEB (Edge & Application Scenarios, 8 scenarios).
 * Defensive forensic guides enforcing MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11
 * with continuous physical metaphors and Action + Inline Why parentheticals.
 */
export const CATEGORY_03B_NETWORK_WEB_EDGE_PATCHES: CategoryStandardPatchMap = {
  'vmware-vcenter-cve-2023-34048-unc3886': {
    briefing: {
      storyAnalogy:
        'A fleet headquarters keeps every branch-office locker key inside one central dispatch cabinet. An intruder slips a mismeasured parcel through the headquarters directory window to seize the central console, unlocks the key safe to read branch passwords, and installs a hidden intercom wire linking the basement floor directly to upper tenant suites.',
      storyMappings: [
        {
          storyTerm: 'Fleet headquarters console',
          technicalTerm: 'Central VMware vCenter management server',
        },
        {
          storyTerm: 'Directory window memory fault',
          technicalTerm: 'vmdird DCERPC out-of-bounds write (CVE-2023-34048)',
        },
        {
          storyTerm: 'Central branch key safe',
          technicalTerm: 'Encrypted vpxuser credentials and symkey.dat file',
        },
        {
          storyTerm: 'Hidden basement intercom wire',
          technicalTerm: 'ESXi VIRTUALPITA listener over AF_VSOCK sockets',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider sends an oversized directory filing card through the headquarters service window. The filing clerk writes past the edge of the tray into adjacent control dials, handing over supervisor control of the central management hub.',
        storyMappings: [
          {
            storyTerm: 'Headquarters directory clerk',
            technicalTerm: 'vmdird directory service process',
          },
          {
            storyTerm: 'Oversized filing card',
            technicalTerm: 'Malformed DCERPC request triggering CVE-2023-34048',
          },
          {
            storyTerm: 'Writing past the tray edge',
            technicalTerm: 'Out-of-bounds heap write in vmdird',
          },
          {
            storyTerm: 'Central management hub',
            technicalTerm: 'Compromised vCenter Server appliance',
          },
        ],
        detectionAndEvidence:
          'Documented by Mandiant and VMware VMSA-2023-0023 (vendor and incident-response telemetry for vCenter exploitation): vmdird service crash or restart events occurring within minutes of unexpected interactive shell activity on vCenter (signaling memory corruption followed by unauthorized administrative access).',
      },
      2: {
        storyAnalogy:
          'Once inside the headquarters vault, the intruder retrieves the master codebook and unlocks every stored branch-office combination, allowing quiet sign-ins to each remote building floor.',
        storyMappings: [
          {
            storyTerm: 'Master vault codebook',
            technicalTerm: '/etc/vmware-vpx/ssl/symkey.dat decryption key',
          },
          {
            storyTerm: 'Branch-office combinations',
            technicalTerm: 'Decrypted ESXi vpxuser host credentials',
          },
          {
            storyTerm: 'Remote building floors',
            technicalTerm: 'Managed ESXi hypervisor hosts',
          },
          {
            storyTerm: 'Vault access ledger',
            technicalTerm: 'Auditd file-read records and ESXi SSH sign-in logs',
          },
        ],
        detectionAndEvidence:
          'Documented by Mandiant (forensic traces of credential harvesting across virtualization tiers): Auditd and shell history entries showing reads of /etc/vmware-vpx/ssl/symkey.dat paired with anomalous vpxuser SSH logins on ESXi hosts (linking vCenter compromise directly to hypervisor lateral movement).',
      },
      3: {
        storyAnalogy:
          'On the hypervisor floor, the intruder lowers the building inspection standard, installs an unsigned maintenance module, and wires a private basement speaking tube that bypasses hallway guards to reach upper tenant rooms.',
        storyMappings: [
          {
            storyTerm: 'Lowered inspection standard',
            technicalTerm: 'ESXi AcceptanceLevel reduced to CommunitySupported',
          },
          {
            storyTerm: 'Unsigned maintenance module',
            technicalTerm: 'Rogue VIB package deploying VIRTUALPITA',
          },
          {
            storyTerm: 'Basement speaking tube',
            technicalTerm: 'Hypervisor-to-guest AF_VSOCK communication channel',
          },
          {
            storyTerm: 'Floor compliance log',
            technicalTerm: 'ESXi syslog.log and socket listener inventory',
          },
        ],
        detectionAndEvidence:
          'Documented by Mandiant (hypervisor persistence and covert-channel detection guidance): ESXi syslog.log showing AcceptanceLevel lowered to CommunitySupported, unsigned VIB package installations, and lsof -A listing unexpected AF_VSOCK listeners (revealing persistent hypervisor implants communicating across guest boundaries).',
      },
    },
  },

  'barracuda-esg-cve-2023-2868-unc4841': {
    briefing: {
      storyAnalogy:
        'A corporate mail-screening station opens every incoming parcel bundle automatically before forwarding letters inside. An outsider mails a parcel whose wrapped item label slips an instruction into the sorting script, installs two hidden watchers inside the mailroom, and adds a database tripwire that revives access even after routine repairs.',
      storyMappings: [
        {
          storyTerm: 'Corporate mail-screening station',
          technicalTerm: 'Barracuda Email Security Gateway appliance',
        },
        {
          storyTerm: 'Wrapped item label trick',
          technicalTerm: 'Sanitization flaw on tar member filenames (CVE-2023-2868)',
        },
        {
          storyTerm: 'Two hidden mailroom watchers',
          technicalTerm: 'SALTWATER mail module and SEASPY passive listener',
        },
        {
          storyTerm: 'Self-reviving ledger tripwire',
          technicalTerm: 'SUBMARINE persistent SQLite database triggers',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Without anyone opening an email, the automated mail scanner inspects a bundled parcel whose inner label breaks out of the packaging quote marks and hands a direct task to the sorting bench.',
        storyMappings: [
          {
            storyTerm: 'Automated mail scanner',
            technicalTerm: 'Appliance Perl attachment screening parser',
          },
          {
            storyTerm: 'Bundled parcel attachment',
            technicalTerm: 'Inbound SMTP tar archive attachment',
          },
          {
            storyTerm: 'Broken quote-mark label',
            technicalTerm: 'Unsanitized archive member name (CVE-2023-2868)',
          },
          {
            storyTerm: 'Perimeter inspection sensor',
            technicalTerm: 'Network IDS signature monitoring inbound SMTP headers',
          },
        ],
        detectionAndEvidence:
          'Documented by Mandiant, CISA, and Suricata SID 2045992 (network signatures for zero-click email gateway exploitation): Inbound SMTP tar attachments containing malformed quote and pipe delimiters inside the archive member header (flagging exploitation attempts targeting the attachment parser).',
      },
      2: {
        storyAnalogy:
          'Inside the sorting room, the intruder embeds a quiet courier assistant inside the mail delivery program and stations a silent doorframe listener that wakes up only when a secret knock arrives.',
        storyMappings: [
          {
            storyTerm: 'Quiet courier assistant',
            technicalTerm: 'SALTWATER trojanized /usr/sbin/bsmtp module',
          },
          {
            storyTerm: 'Silent doorframe listener',
            technicalTerm: 'SEASPY libpcap passive network monitor',
          },
          {
            storyTerm: 'Mail delivery program',
            technicalTerm: 'Appliance SMTP processing daemon',
          },
          {
            storyTerm: 'Binary authenticity scan',
            technicalTerm: 'CISA YARA signatures checking modified gateway binaries',
          },
        ],
        detectionAndEvidence:
          'Documented in CISA MAR-10454006 (official malware analysis report for UNC4841 implants): YARA signature matches against modified /usr/sbin/bsmtp (SALTWATER) and /usr/sbin/BarracudaMailService (SEASPY) binaries (confirming active trojanization of core email gateway services).',
      },
      3: {
        storyAnalogy:
          'To survive routine building maintenance, the intruder attaches automatic rules inside the station record books that relaunch hidden helpers whenever normal settings refresh, while boxing up sensitive corporate mail for outside pickup.',
        storyMappings: [
          {
            storyTerm: 'Station record book rules',
            technicalTerm: 'SUBMARINE SQLite triggers inside /mail/config/',
          },
          {
            storyTerm: 'Startup relaunch script',
            technicalTerm: 'Unauthorized initialization file /etc/init.d/ee',
          },
          {
            storyTerm: 'Outside pickup transfer',
            technicalTerm: 'Anomalous outbound HTTPS exfiltration from the gateway',
          },
          {
            storyTerm: 'Corporate mail archive',
            technicalTerm: 'Targeted enterprise email data routed through the gateway',
          },
        ],
        detectionAndEvidence:
          'Documented by Mandiant and CISA (post-patch persistence and exfiltration indicators): Unauthorized SQLite triggers under /mail/config/, unexpected startup entries such as /etc/init.d/ee, and large outbound HTTPS transfers initiated directly by the email gateway appliance IP (indicating persistent compromise and data theft).',
      },
    },
  },

  'cisco-ios-xe-cve-2023-20198-badimplant': {
    briefing: {
      storyAnalogy:
        'A network routing station guards its control panel behind a front desk clerk, yet writing the room name in double-coded letters slips straight past the desk. An outsider adds a temporary top-level badge, uses the software-update tray to enter the basement engine room, plants a silent web panel inside the lobby, and erases the temporary badge to hide their tracks.',
      storyMappings: [
        {
          storyTerm: 'Network routing station',
          technicalTerm: 'Cisco IOS XE network device web management UI',
        },
        {
          storyTerm: 'Double-coded room name',
          technicalTerm: 'Encoded path bypass creating privilege-15 admin (CVE-2023-20198)',
        },
        {
          storyTerm: 'Software-update basement hatch',
          technicalTerm: 'Authenticated command flaw in installAdd API (CVE-2023-20273)',
        },
        {
          storyTerm: 'Silent lobby web panel',
          technicalTerm: 'BadCandy Lua backdoor embedded in NGINX',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider addresses a request using twice-encoded lettering so the front reception filter skips the badge check, allowing the caller to stamp a brand-new top-clearance administrator badge directly into the router roster.',
        storyMappings: [
          {
            storyTerm: 'Front reception filter',
            technicalTerm: 'Front-end NGINX authentication proxy layer',
          },
          {
            storyTerm: 'Twice-encoded lettering',
            technicalTerm: 'Double-URL-encoded web management URI path',
          },
          {
            storyTerm: 'Top-clearance badge',
            technicalTerm: 'Unauthorized privilege level 15 local user account',
          },
          {
            storyTerm: 'Router configuration ledger',
            technicalTerm: 'IOS syslog %SYS-5-CONFIG_I audit message',
          },
        ],
        detectionAndEvidence:
          'Documented by Cisco Talos and Suricata SID 2048554 (network and device syslog indicators for CVE-2023-20198): HTTP requests containing double-encoded webui_wsma paths paired with IOS syslog %SYS-5-CONFIG_I: Configured from http by console (signaling unauthenticated local administrator creation via the web UI).',
      },
      2: {
        storyAnalogy:
          'Holding that newly minted top-clearance badge, the intruder submits a crafted label to the software-installation chute, breaking out of the standard control booth into the unrestricted basement operating room.',
        storyMappings: [
          {
            storyTerm: 'Software-installation chute',
            technicalTerm: '/webui/rest/softwareMgmt/installAdd REST handler',
          },
          {
            storyTerm: 'Breaking into the basement',
            technicalTerm: 'Privilege escalation to underlying root OS (CVE-2023-20273)',
          },
          {
            storyTerm: 'Installation activity journal',
            technicalTerm: 'IOS syslog %WEBUI-6-INSTALL_OPERATION_INFO entry',
          },
          {
            storyTerm: 'Chained administrative audit',
            technicalTerm: 'Install event immediately following web configuration change',
          },
        ],
        detectionAndEvidence:
          'Documented by Cisco Talos (chained exploitation telemetry for IOS XE web UI intrusions): Syslog %WEBUI-6-INSTALL_OPERATION_INFO occurring immediately after %SYS-5-CONFIG_I: Configured from http (linking unauthorized account creation directly to software-management abuse).',
      },
      3: {
        storyAnalogy:
          'From the basement room, the intruder splices a silent custom response page into the front lobby web server and immediately tears up the temporary administrator badge so casual roster checks see nothing unusual.',
        storyMappings: [
          {
            storyTerm: 'Silent custom response page',
            technicalTerm: 'BadCandy Lua implant added to NGINX configuration',
          },
          {
            storyTerm: 'Extra lobby config sheet',
            technicalTerm: 'Unauthorized /usr/binos/conf/nginx-conf/occo.conf file',
          },
          {
            storyTerm: 'Torn-up temporary badge',
            technicalTerm: 'Deletion of the rogue privilege-15 user account',
          },
          {
            storyTerm: 'Secret lobby check-in address',
            technicalTerm: 'POST requests to /webui/logoutconfirm.html?logon_hash=1',
          },
        ],
        detectionAndEvidence:
          'Documented by Cisco Talos and VulnCheck (forensic indicators for BadCandy web implants): Presence of unauthorized configuration files such as /usr/binos/conf/nginx-conf/occo.conf and POST requests targeting /webui/logoutconfirm.html?logon_hash=1 (proving an active in-memory web implant despite removed admin accounts).',
      },
    },
  },

  'zyxel-firewall-cve-2023-28771-ike-rce': {
    briefing: {
      storyAnalogy:
        'A perimeter guardhouse validates sealed tunnel-setup envelopes using a single factory stamp shared across every model, and reads only the top flap while copying the rest of the letter straight onto a spoken loudspeaker log. A single unauthenticated envelope carries a hidden command on its lower half, seizing the entire guardhouse before any tunnel handshake finishes.',
      storyMappings: [
        {
          storyTerm: 'Perimeter guardhouse',
          technicalTerm: 'Zyxel VPN firewall gateway appliance',
        },
        {
          storyTerm: 'Shared factory stamp',
          technicalTerm: 'Hardcoded 3DES key decrypting only the first 48 bytes',
        },
        {
          storyTerm: 'Spoken loudspeaker log',
          technicalTerm: 'Unsafe shell invocation writing sdwan_vpndebug.log',
        },
        {
          storyTerm: 'Single-envelope takeover',
          technicalTerm: 'Pre-auth UDP/500 IKEv2 command injection (CVE-2023-28771)',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider seals the first short header strip of a tunnel-setup notice with the factory stamp and leaves the long trailing message in plain text, slipping past the envelope verifier on the first knock.',
        storyMappings: [
          {
            storyTerm: 'Short sealed header strip',
            technicalTerm: '48-byte encrypted IKEv2 Notify Type 14 header',
          },
          {
            storyTerm: 'Plain-text trailing message',
            technicalTerm: 'Unencrypted payload bytes appended beyond offset 48',
          },
          {
            storyTerm: 'Envelope verifier module',
            technicalTerm: 'Appliance libike.so IKEv2 packet parser',
          },
          {
            storyTerm: 'Front tunnel mailbox',
            technicalTerm: 'Publicly reachable UDP port 500 IKEv2 listener',
          },
        ],
        howItWorksInPractice:
          'The appliance parser decrypts only the first 48 bytes of the Notify payload using a static built-in key (allowing an unauthenticated remote sender to craft a valid packet header without prior negotiation) and leaves every byte past offset 48 untouched in plaintext (enabling arbitrary untrusted text to reach the downstream logging function).',
        detectionAndEvidence:
          'Documented by Rapid7 and Suricata SID 2045893 (perimeter IDS rules for Zyxel IKEv2 exploitation): Inbound UDP/500 IKEv2 Notify Type 14 packets exceeding 48 bytes and containing unexpected command-separator characters (flagging pre-authentication packets crafted to exploit CVE-2023-28771).',
      },
      2: {
        storyAnalogy:
          'To record the error notice in the shift notebook, the guard reads the raw visitor message directly into the building command intercom. The extra punctuation inside the message splits the sentence and triggers unauthorized workshop orders.',
        storyMappings: [
          {
            storyTerm: 'Shift debug notebook',
            technicalTerm: '/tmp/sdwan_vpndebug.log diagnostic log file',
          },
          {
            storyTerm: 'Building command intercom',
            technicalTerm: 'C system() call invoking /bin/sh on untrusted input',
          },
          {
            storyTerm: 'Sentence-splitting punctuation',
            technicalTerm: 'Shell metacharacter command injection inside Notify text',
          },
          {
            storyTerm: 'Guardhouse daemon',
            technicalTerm: 'Privileged ssod process spawning shell utilities',
          },
        ],
        howItWorksInPractice:
          'Passing network-supplied strings directly into a C system() call to append lines to a log file (instead of opening the file safely with native file APIs) forces the operating system to invoke a command shell (allowing embedded separator tokens inside the packet to execute arbitrary privileged commands).',
        detectionAndEvidence:
          'Documented by TRAPA Security and Rapid7 (host forensic indicators on compromised appliances): /tmp/sdwan_vpndebug.log containing unexpected command output or the ssod process spawning /bin/sh and outbound download tools (confirming that malformed IKEv2 packets executed system commands).',
      },
      3: {
        storyAnalogy:
          'With a single packet delivered to the front gate, the perimeter guardhouse turns outward to fetch external toolkits, giving the outsider full master control over the network border.',
        storyMappings: [
          {
            storyTerm: 'Single-packet border breach',
            technicalTerm: 'Unauthenticated root compromise over UDP/500',
          },
          {
            storyTerm: 'Outward toolkit pickup',
            technicalTerm: 'Firewall initiating outbound HTTP fetches for shell scripts',
          },
          {
            storyTerm: 'Foreign binary kit',
            technicalTerm: 'Downloaded MIPS64 ELF malware payload',
          },
          {
            storyTerm: 'Egress watchtower log',
            technicalTerm: 'Upstream firewall or DNS logs recording anomalous egress',
          },
        ],
        detectionAndEvidence:
          'Documented in CISA KEV and Shadowserver telemetry (post-exploitation network indicators for perimeter firewalls): Zyxel firewalls initiating outbound HTTP requests to retrieve scripts and MIPS64 ELF binaries immediately after receiving UDP/500 Notify Type 14 packets (demonstrating active post-exploitation staging).',
      },
    },
  },

  'juniper-junos-jweb-cve-2023-36845-chain': {
    briefing: {
      storyAnalogy:
        'A router administration booth lets visitors hand in environment preference slips before the booth clerk reads their own rulebook. An outsider points the rulebook address at the live letter slot itself, feeds custom settings straight through the slot, and runs in-memory commands to copy the entire router blueprint without writing a single file to disk.',
      storyMappings: [
        {
          storyTerm: 'Router administration booth',
          technicalTerm: 'Juniper Junos OS J-Web management interface',
        },
        {
          storyTerm: 'Redirected rulebook slip',
          technicalTerm: 'Unauthenticated PHPRC=/dev/fd/0 setting (CVE-2023-36845)',
        },
        {
          storyTerm: 'Custom slot rule settings',
          technicalTerm: 'allow_url_include and auto_prepend_file runtime directives',
        },
        {
          storyTerm: 'Copied router blueprint',
          technicalTerm: 'Exfiltrated /config/juniper.conf device configuration',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider mails an unauthenticated form to the booth clerk with an environment override instructing the clerk to read their configuration rules directly from the incoming mail envelope instead of the locked wall cabinet.',
        storyMappings: [
          {
            storyTerm: 'Booth clerk form window',
            technicalTerm: 'Publicly exposed /webauth_operation.php endpoint',
          },
          {
            storyTerm: 'Environment override slip',
            technicalTerm: 'Unauthenticated PHPRC environment variable manipulation',
          },
          {
            storyTerm: 'Incoming mail envelope stream',
            technicalTerm: 'Standard input descriptor /dev/fd/0',
          },
          {
            storyTerm: 'Booth visitor ledger',
            technicalTerm: 'J-Web /var/log/httpd.log access records',
          },
        ],
        detectionAndEvidence:
          'Documented by watchTowr, VulnCheck, and Suricata SID 2047892 (network and web log alerts for CVE-2023-36845): HTTP POST requests containing PHPRC= overrides in /var/log/httpd.log (exposing attempts to redirect PHP runtime configuration before authentication).',
      },
      2: {
        storyAnalogy:
          'Inside the very same envelope body, the outsider writes two configuration lines: one allowing live inline notes to run as scripts, and a second instructing the clerk to execute a bundled inline note before opening any regular page.',
        storyMappings: [
          {
            storyTerm: 'Inline script permission line',
            technicalTerm: 'PHP allow_url_include=1 configuration directive',
          },
          {
            storyTerm: 'Mandatory opening note line',
            technicalTerm: 'PHP auto_prepend_file data stream directive',
          },
          {
            storyTerm: 'Envelope body payload',
            technicalTerm: 'HTTP POST body fed directly via /dev/fd/0',
          },
          {
            storyTerm: 'Deep parcel inspection',
            technicalTerm: 'Network packet capture inspecting J-Web POST bodies',
          },
        ],
        detectionAndEvidence:
          'Documented by VulnCheck (deep packet inspection indicators for fileless J-Web exploitation): Network inspection showing allow_url_include and auto_prepend_file directives inside HTTP POST bodies sent to J-Web (confirming an attacker supplied a custom PHP configuration inline).',
      },
      3: {
        storyAnalogy:
          'Before even touching the normal login screen, the clerk executes the inline note purely in memory and reads out the locked master configuration binder containing network routes and secret keys.',
        storyMappings: [
          {
            storyTerm: 'Purely in-memory execution',
            technicalTerm: 'Fileless PHP interpreter command execution',
          },
          {
            storyTerm: 'Router management clerk',
            technicalTerm: 'php-cgi worker spawning /bin/sh or /usr/sbin/cli',
          },
          {
            storyTerm: 'Master configuration binder',
            technicalTerm: 'Protected /config/juniper.conf configuration file',
          },
          {
            storyTerm: 'Security patch advisory',
            technicalTerm: 'Juniper JSA72300 remediation and audit guidance',
          },
        ],
        detectionAndEvidence:
          'Documented in Juniper JSA72300 and CISA KEV (post-exploitation process and web log artifacts): /var/log/httpd.log entries targeting /webauth_operation.php paired with php-cgi spawning /bin/sh or /usr/sbin/cli (confirming remote command execution and configuration access).',
      },
    },
  },

  'atlassian-confluence-cve-2023-22515-storm0062': {
    briefing: {
      storyAnalogy:
        'A team library locks its opening-day setup desk once the building opens, controlled by a single "setup finished" toggle switch behind a glass pane. An outsider reaches through a chained settings dial to flip that switch back to "unfinished", walks up to register a brand-new head librarian account, and uploads a custom tool extension to run commands across the building.',
      storyMappings: [
        {
          storyTerm: 'Team knowledge library',
          technicalTerm: 'Atlassian Confluence Data Center and Server',
        },
        {
          storyTerm: 'Flipped setup-finished switch',
          technicalTerm: 'Resetting setupComplete=false via XWork chaining (CVE-2023-22515)',
        },
        {
          storyTerm: 'New head librarian account',
          technicalTerm: 'Unauthorized confluence-administrators user registration',
        },
        {
          storyTerm: 'Custom tool extension',
          technicalTerm: 'Uploaded malicious OSGi servlet plugin',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider sends a chained property request to the public status desk. Following the chain of internal dials, the server unknowingly flips its own "setup finished" latch back to open.',
        storyMappings: [
          {
            storyTerm: 'Public status desk',
            technicalTerm: 'Unauthenticated /server-info.action endpoint',
          },
          {
            storyTerm: 'Chained internal dials',
            technicalTerm: 'XWork getter/setter parameter traversal',
          },
          {
            storyTerm: 'Setup-finished latch',
            technicalTerm: 'bootstrapStatusProvider.applicationConfig.setupComplete flag',
          },
          {
            storyTerm: 'Library entrance log',
            technicalTerm: 'Tomcat conf_access_log HTTP request records',
          },
        ],
        detectionAndEvidence:
          'Documented in CISA AA23-289A and Rapid7 (web log signatures for CVE-2023-22515 exploitation): Tomcat conf_access_log entries for /server-info.action containing bootstrapStatusProvider.applicationConfig.setupComplete in the query string or POST body (exposing broken access control tampering with setup state).',
      },
      2: {
        storyAnalogy:
          'Because the building now believes it is opening day again, the setup counter gladly accepts a brand-new head librarian profile from the outsider and closes the setup latch afterward.',
        storyMappings: [
          {
            storyTerm: 'Reopened setup counter',
            technicalTerm: '/setup/setupadministrator.action registration endpoint',
          },
          {
            storyTerm: 'Closing the setup latch',
            technicalTerm: '/setup/finishsetup.action completion request',
          },
          {
            storyTerm: 'Head librarian group',
            technicalTerm: 'Privileged confluence-administrators role',
          },
          {
            storyTerm: 'Membership audit trail',
            technicalTerm: 'Application audit logs showing unexpected admin creation',
          },
        ],
        detectionAndEvidence:
          'Documented in CISA AA23-289A (administrative compromise indicators): HTTP 200 or 302 requests to /setup/setupadministrator.action and /setup/finishsetup.action paired with unexpected additions to the confluence-administrators group (confirming unauthenticated administrator creation).',
      },
      3: {
        storyAnalogy:
          'Signed in as head librarian, the outsider uploads a custom library plug-in box through the extension desk. Once mounted, the plug-in opens a direct workshop line to execute building commands.',
        storyMappings: [
          {
            storyTerm: 'Extension upload desk',
            technicalTerm: 'POST /rest/plugins/1.0/ plugin management endpoint',
          },
          {
            storyTerm: 'Custom plug-in box',
            technicalTerm: 'Malicious OSGi Java servlet plugin archive',
          },
          {
            storyTerm: 'Library service engine',
            technicalTerm: 'Confluence Java runtime process',
          },
          {
            storyTerm: 'Workshop command line',
            technicalTerm: 'Spawned shell interpreters (bash, cmd.exe, powershell.exe)',
          },
        ],
        detectionAndEvidence:
          'Documented by Microsoft and CISA AA23-289A (post-takeover execution indicators): POST /rest/plugins/1.0/ followed by the Confluence Java process spawning /bin/sh, bash, cmd.exe, or powershell.exe (proving malicious plugin upload achieved operating system command execution).',
      },
    },
  },

  'apache-activemq-cve-2023-46604-openwire': {
    briefing: {
      storyAnalogy:
        'A railway dispatch broker lets incoming error notices name which official handbook to open when logging a fault. An outsider sends a forged fault notice naming an automated blueprint loader instead of a standard error card, causing the broker to fetch an outside instruction sheet and launch system commands directly.',
      storyMappings: [
        {
          storyTerm: 'Railway dispatch broker',
          technicalTerm: 'Apache ActiveMQ OpenWire messaging server',
        },
        {
          storyTerm: 'Forged fault notice',
          technicalTerm: 'Crafted OpenWire ExceptionResponse (0x1F) frame (CVE-2023-46604)',
        },
        {
          storyTerm: 'Automated blueprint loader',
          technicalTerm: 'Spring ClassPathXmlApplicationContext constructor',
        },
        {
          storyTerm: 'Outside instruction sheet',
          technicalTerm: 'Remote XML bean definition spawning OS commands',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider sends a specially tagged error frame straight to the broker dispatch track. Instead of naming a routine alarm card, the frame names a powerful configuration loader paired with an external street address.',
        storyMappings: [
          {
            storyTerm: 'Broker dispatch track',
            technicalTerm: 'Exposed OpenWire TCP port 61616 listener',
          },
          {
            storyTerm: 'Tagged error frame',
            technicalTerm: 'OpenWire ExceptionResponse command byte 0x1F',
          },
          {
            storyTerm: 'Named configuration loader',
            technicalTerm: 'ClassPathXmlApplicationContext class string',
          },
          {
            storyTerm: 'External street address',
            technicalTerm: 'Attacker-hosted HTTP URL pointing to remote XML',
          },
        ],
        detectionAndEvidence:
          'Documented by Rapid7 and Suricata network rules (wire-level detection for CVE-2023-46604): TCP port 61616 packets carrying OpenWire command byte 0x1F alongside the ASCII string ClassPathXmlApplicationContext (identifying unauthenticated deserialization exploitation over OpenWire).',
      },
      2: {
        storyAnalogy:
          'Without checking whether the named handbook is actually an error card, the broker reflexively constructs the blueprint loader and walks out to fetch the remote instruction sheet from the outsider address.',
        storyMappings: [
          {
            storyTerm: 'Unchecked handbook builder',
            technicalTerm: 'BaseDataStreamMarshaller.createThrowable() reflection call',
          },
          {
            storyTerm: 'Fetching the instruction sheet',
            technicalTerm: 'Loading remote Spring XML bean definitions over HTTP',
          },
          {
            storyTerm: 'Broker operations log',
            technicalTerm: 'data/activemq.log application runtime journal',
          },
          {
            storyTerm: 'Missing safety check',
            technicalTerm: 'Unrestricted arbitrary class instantiation vulnerability',
          },
        ],
        detectionAndEvidence:
          'Documented by Huntress and Rapid7 (application log evidence of ActiveMQ RCE): data/activemq.log entries recording Refreshing org.springframework.context.support.ClassPathXmlApplicationContext and Loading XML bean definitions from an external URL (confirming remote XML configuration retrieval).',
      },
      3: {
        storyAnalogy:
          'As soon as the broker reads the fetched instruction sheet, a pre-wired assembly entry launches the station command console directly under the broker service badge.',
        storyMappings: [
          {
            storyTerm: 'Pre-wired assembly entry',
            technicalTerm: 'Spring bean invoking java.lang.ProcessBuilder',
          },
          {
            storyTerm: 'Broker service process',
            technicalTerm: 'ActiveMQ java or wrapper.exe runtime',
          },
          {
            storyTerm: 'Launched command console',
            technicalTerm: 'Spawned cmd.exe, powershell.exe, msiexec.exe, or /bin/sh',
          },
          {
            storyTerm: 'Process lineage monitor',
            technicalTerm: 'Sysmon EventID 1 and Linux Auditd EXECVE records',
          },
        ],
        detectionAndEvidence:
          'Documented by Huntress and Trend Micro (endpoint execution telemetry for ActiveMQ compromise): Sysmon EventID 1 or Auditd EXECVE showing java or wrapper.exe (ActiveMQ) spawning cmd.exe, powershell.exe, msiexec.exe, or /bin/sh (confirming full remote code execution).',
      },
    },
  },

  'papercut-ng-cve-2023-27350-bl00dy': {
    briefing: {
      storyAnalogy:
        'A print-shop management office leaves its opening-day welcome card unlocked so anyone stepping up to the counter receives an active manager badge without logging in. Using that badge, an outsider disables the safety shield on automated print-job scripts and inserts a direct office-wide command inside a routine printer rule.',
      storyMappings: [
        {
          storyTerm: 'Print-shop management office',
          technicalTerm: 'PaperCut MF/NG print management application server',
        },
        {
          storyTerm: 'Unlocked welcome card',
          technicalTerm: 'SetupCompleted authentication bypass (CVE-2023-27350)',
        },
        {
          storyTerm: 'Print-job safety shield',
          technicalTerm: 'Mozilla Rhino print.script.sandboxed setting',
        },
        {
          storyTerm: 'Direct office-wide command',
          technicalTerm: 'Runtime.getRuntime().exec() inside a printer script',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An outsider opens the old installation completion page and clicks straight through the welcome form. Because the door routine fails to verify prior login, the server stamps and hands back an active manager badge.',
        storyMappings: [
          {
            storyTerm: 'Installation completion page',
            technicalTerm: '/app?service=page/SetupCompleted web route',
          },
          {
            storyTerm: 'Submitted welcome form',
            technicalTerm: 'POST request targeting SetupCompleted/$Form',
          },
          {
            storyTerm: 'Active manager badge',
            technicalTerm: 'Authenticated administrator JSESSIONID cookie',
          },
          {
            storyTerm: 'Missing identity check',
            technicalTerm: 'Improper access control flaw (CVE-2023-27350)',
          },
        ],
        detectionAndEvidence:
          'Documented in CISA AA23-131A and Horizon3.ai (web access log signatures for PaperCut bypass): HTTP requests to /app?service=page/SetupCompleted and POST requests containing SetupCompleted/$Form (identifying unauthenticated attempts to mint an administrator session).',
      },
      2: {
        storyAnalogy:
          'Inside the manager settings drawer, the outsider enables custom print scripting and flips the protective safety barrier off so printer helper rules can reach outside the print room into the main building machinery.',
        storyMappings: [
          {
            storyTerm: 'Custom scripting switch',
            technicalTerm: 'print-and-device.script.enabled configuration option',
          },
          {
            storyTerm: 'Protective safety barrier',
            technicalTerm: 'print.script.sandboxed Mozilla Rhino sandbox flag',
          },
          {
            storyTerm: 'Manager settings audit',
            technicalTerm: 'PaperCut server.log and Admin Audit configuration trail',
          },
          {
            storyTerm: 'Main building machinery',
            technicalTerm: 'Unrestricted underlying Java runtime APIs',
          },
        ],
        detectionAndEvidence:
          'Documented by Horizon3.ai and CISA AA23-131A (application configuration audit evidence): PaperCut server.log and Admin Audit entries showing modifications to print-and-device.script.enabled and print.script.sandboxed (indicating an operator disabled the scripting sandbox to prepare code execution).',
      },
      3: {
        storyAnalogy:
          'With the safety barrier disabled, the outsider pastes a short system instruction into an existing printer rule and triggers a test print, instantly executing commands with the print shop highest building clearance.',
        storyMappings: [
          {
            storyTerm: 'Existing printer rule',
            technicalTerm: 'Device print script executed by Rhino engine',
          },
          {
            storyTerm: 'Inserted system instruction',
            technicalTerm: 'java.lang.Runtime.getRuntime().exec() invocation',
          },
          {
            storyTerm: 'Print shop service engine',
            technicalTerm: 'pc-app.exe running under NT AUTHORITY\\SYSTEM',
          },
          {
            storyTerm: 'Spawned workshop utilities',
            technicalTerm: 'Child cmd.exe, powershell.exe, certutil.exe, or bitsadmin.exe',
          },
        ],
        howItWorksInPractice:
          'On enterprise hosts, the PaperCut Application Server service (pc-app.exe) runs by default under NT AUTHORITY\\SYSTEM (the highest local operating system privilege level), so any command triggered through the unsandboxed Rhino scripting engine immediately inherits full SYSTEM authority (allowing rapid deployment of remote tools without further privilege escalation).',
        detectionAndEvidence:
          'Documented in CISA AA23-131A (endpoint process telemetry for PaperCut post-exploitation): Sysmon EventID 1 showing C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe spawning cmd.exe, powershell.exe, certutil.exe, or bitsadmin.exe (proving print script abuse led to SYSTEM-level command execution).',
      },
    },
  },
};
