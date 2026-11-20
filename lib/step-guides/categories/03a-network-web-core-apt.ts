import type { CategoryStandardPatchMap } from './types';

/**
 * Category 3A — NETWORK_WEB (Core & APT Network/Web Scenarios, 15 scenarios).
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 with continuous
 * jargon-free physical metaphors, 4-pair Story-to-Technical keys, and
 * Action + Inline Why parentheticals across defensive detection fields.
 */
export const CATEGORY_03A_NETWORK_WEB_CORE_APT_PATCHES: CategoryStandardPatchMap =
  {
    'log4shell-dfir': {
      briefing: {
        storyAnalogy:
          'A hotel reception clerk writes every guest badge note verbatim into a smart ledger that automatically phones any directory number printed on the paper. A visitor hands over a slip listing an outside phone bureau, so the clerk dials out, fetches an unsigned instruction booklet from a street kiosk, and hands the master phone line to the caller.',
        storyMappings: [
          {
            storyTerm: 'Smart reception ledger',
            technicalTerm: 'Vulnerable Log4j 2 message lookup engine',
            tone: 'amber',
          },
          {
            storyTerm: 'Guest badge note',
            technicalTerm: 'HTTP User-Agent request header',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside phone bureau',
            technicalTerm: 'Attacker-controlled LDAP referral server',
            tone: 'rose',
          },
          {
            storyTerm: 'Unsigned instruction booklet',
            technicalTerm: 'Remote Java bytecode class file',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The visitor walks up to the front desk and presents a paper badge note containing a special lookup code instead of a normal guest name. The desk clerk copies the entire line directly into the smart ledger without checking whether the note contains a directory command.',
          storyMappings: [
            {
              storyTerm: 'Front desk counter',
              technicalTerm: 'Public web application login endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Paper badge note',
              technicalTerm: 'Crafted User-Agent HTTP header string',
              tone: 'sky',
            },
            {
              storyTerm: 'Special lookup code',
              technicalTerm: 'JNDI lookup expression (CVE-2021-44228)',
              tone: 'rose',
            },
            {
              storyTerm: 'Smart reception ledger',
              technicalTerm: 'Log4j 2 logging library formatter',
              tone: 'emerald',
            },
          ],
        },
        2: {
          storyAnalogy:
            'As soon as the ledger reads the special lookup code, its built-in dialer automatically places an outgoing call through the lobby switchboard to the outside phone bureau printed on the slip.',
          storyMappings: [
            {
              storyTerm: 'Built-in ledger dialer',
              technicalTerm: 'Java Naming and Directory Interface client',
              tone: 'amber',
            },
            {
              storyTerm: 'Lobby switchboard',
              technicalTerm: 'Perimeter egress firewall',
              tone: 'sky',
            },
            {
              storyTerm: 'Outgoing phone call',
              technicalTerm: 'Outbound LDAP connection on TCP port 389',
              tone: 'rose',
            },
            {
              storyTerm: 'Outside phone bureau',
              technicalTerm: 'External rogue directory listener',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The outside phone bureau does not give a simple name; instead, it hands back a forwarding slip pointing to a nearby street kiosk. The trusting clerk walks over to that kiosk and carries back an unsigned instruction booklet.',
          storyMappings: [
            {
              storyTerm: 'Forwarding slip',
              technicalTerm: 'LDAP javaCodeBase reference attribute',
              tone: 'amber',
            },
            {
              storyTerm: 'Nearby street kiosk',
              technicalTerm: 'External HTTP payload staging server',
              tone: 'sky',
            },
            {
              storyTerm: 'Unsigned instruction booklet',
              technicalTerm: 'Compiled Exploit.class Java bytecode',
              tone: 'rose',
            },
            {
              storyTerm: 'Trusting desk clerk',
              technicalTerm: 'Application JVM URLClassLoader',
              tone: 'emerald',
            },
          ],
        },
        4: {
          storyAnalogy:
            'The clerk opens the cover page of the instruction booklet, which triggers a built-in setup checklist before any chapter is even read. Following that opening page, the clerk picks up the hotel back-office handset and opens a live private line straight to the outsider.',
          storyMappings: [
            {
              storyTerm: 'Cover page setup checklist',
              technicalTerm: 'Java static initializer block',
              tone: 'amber',
            },
            {
              storyTerm: 'Back-office handset',
              technicalTerm: 'Spawned /bin/sh command interpreter',
              tone: 'sky',
            },
            {
              storyTerm: 'Live private line',
              technicalTerm: 'Outbound interactive reverse session',
              tone: 'rose',
            },
            {
              storyTerm: 'Hotel building staff role',
              technicalTerm: 'Application service user context',
              tone: 'emerald',
            },
          ],
        },
      },
    },

    'dns-tunneling-exfil': {
      briefing: {
        storyAnalogy:
          'A strict warehouse bans all delivery trucks from leaving the yard, allowing only tiny postal inquiry slips through the front mail slot. An insider breaks a thick customer ledger into coded postcard labels, mails each label as a routine address lookup, and receives brief coded replies tucked into the return postage stamps.',
        storyMappings: [
          {
            storyTerm: 'Front mail slot',
            technicalTerm: 'Permitted UDP port 53 DNS egress path',
            tone: 'amber',
          },
          {
            storyTerm: 'Coded postcard label',
            technicalTerm: 'Hex-encoded high-entropy DNS subdomain',
            tone: 'sky',
          },
          {
            storyTerm: 'Local post office relay',
            technicalTerm: 'Internal corporate recursive DNS resolver',
            tone: 'rose',
          },
          {
            storyTerm: 'Return postage stamp',
            technicalTerm: 'Authoritative DNS TXT response record',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'Inside the locked archive room, a rogue clerk slices a private customer sheet into tiny numbered strips and converts every letter into pairs of digits. Each coded strip becomes the street label on an outgoing postal lookup card.',
          storyMappings: [
            {
              storyTerm: 'Rogue archive clerk',
              technicalTerm: 'Compromised sync_agent.exe process',
              tone: 'amber',
            },
            {
              storyTerm: 'Numbered digit strips',
              technicalTerm: 'Chunked hexadecimal subdomain labels',
              tone: 'sky',
            },
            {
              storyTerm: 'Outgoing postal lookup card',
              technicalTerm: 'DNS TXT query packet',
              tone: 'rose',
            },
            {
              storyTerm: 'External mail district',
              technicalTerm: 'Attacker-owned authoritative domain',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Sysmon EventID 22 (DNSEvent, which records every process-level domain lookup so defenders can tie abnormal queries back to a specific binary): ProcessId = 4412, Image = C:\\ProgramData\\sync_agent.exe, QueryName = 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net, QueryStatus = 0, QueryResults = "type: 16 ACK:001:NEXT;" (confirming a long hex-encoded subdomain returning a TXT acknowledgment string).',
        },
        2: {
          storyAnalogy:
            'The clerk drops the lookup card into the company mailroom rather than walking to the front gate. Because the gate guard trusts every bag stamped by the company mailroom, the coded inquiry sails straight outside to the remote district office.',
          storyMappings: [
            {
              storyTerm: 'Company mailroom',
              technicalTerm: 'Internal recursive DNS resolver (10.50.1.53)',
              tone: 'amber',
            },
            {
              storyTerm: 'Front gate guard',
              technicalTerm: 'Corporate egress perimeter firewall',
              tone: 'sky',
            },
            {
              storyTerm: 'Mailroom stamped bag',
              technicalTerm: 'Forwarded upstream UDP/53 recursive query',
              tone: 'rose',
            },
            {
              storyTerm: 'Remote district office',
              technicalTerm: 'External authoritative DNS nameserver',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The remote district office copies the digit strip off each incoming card to rebuild the stolen customer ledger in order. It then writes a short receipt and next-task note on a return slip marked to expire immediately so the company mailroom never keeps a cached copy.',
          storyMappings: [
            {
              storyTerm: 'Rebuilt customer ledger',
              technicalTerm: 'Reassembled exfiltrated CSV records',
              tone: 'amber',
            },
            {
              storyTerm: 'Return slip note',
              technicalTerm: 'DNS TXT response carrying ACK and sleep directives',
              tone: 'sky',
            },
            {
              storyTerm: 'Immediate expiry stamp',
              technicalTerm: 'Zero-second TTL value preventing resolver caching',
              tone: 'rose',
            },
            {
              storyTerm: 'Archive room workstation',
              technicalTerm: 'Source database backup host (10.50.1.12)',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Sigma and Suricata DNS rules (network and host detection signatures that flag covert command-and-control over domain lookups): 188-byte DNS TXT response with TTL = 0.000000 carrying "TXT ACK:001:CMD:SLEEP_60" from 45.133.1.99:53 through 10.50.1.53 to DB-BACKUP-02 (10.50.1.12) (because legitimate business records rarely pair zero-second caching with high-entropy hex subdomains).',
        },
      },
    },

    'unit42-panos-midnight-eclipse': {
      briefing: {
        storyAnalogy:
          'A border tollhouse stamps every traveler ticket into a scratch folder, and an automated courier sweeps that folder every minute while reading each folder label aloud as a spoken order. An outsider submits a twisted ticket label that places a disguised order slip into the courier bin, tricks the courier into running it, and tucks a permanent listener card into the tollhouse rulebook.',
        storyMappings: [
          {
            storyTerm: 'Border tollhouse gateway',
            technicalTerm: 'PAN-OS GlobalProtect firewall appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Twisted ticket label',
            technicalTerm: 'Path-traversal SESSID cookie string',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated minute courier',
            technicalTerm: 'Root device telemetry cron job (dt_curl)',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent listener card',
            technicalTerm: 'UPSTYLE Python persistence script in system.pth',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider sends a traveler pass whose ticket stamp climbs backward out of the ordinary ticket drawer and drops a blank file into the hourly courier tray. The file name itself secretly spells out an instruction for the courier to follow later.',
          storyMappings: [
            {
              storyTerm: 'Traveler pass ticket stamp',
              technicalTerm: 'SESSID HTTP cookie header',
              tone: 'amber',
            },
            {
              storyTerm: 'Climbing backward out of the drawer',
              technicalTerm: 'Directory traversal sequence (CVE-2024-3400)',
              tone: 'sky',
            },
            {
              storyTerm: 'Hourly courier tray',
              technicalTerm: 'Device telemetry minute staging directory',
              tone: 'rose',
            },
            {
              storyTerm: 'Instruction spelled in the file label',
              technicalTerm: 'Shell command embedded inside a zero-byte filename',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Unit 42, Volexity, and Rapid7 CVE-2024-3400 advisories (incident response reports detailing perimeter appliance exploitation): PAN-OS appweb3 logs showing Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/ and zero-byte file creation errors (which expose path traversal attempts targeting the telemetry staging folder).',
        },
        2: {
          storyAnalogy:
            'When the tollhouse clock strikes the next minute, the privileged automated courier gathers every filename from the tray and hands the raw label straight to the building command desk. The disguised label executes immediately with master supervisor authority.',
          storyMappings: [
            {
              storyTerm: 'Privileged automated courier',
              technicalTerm: 'Scheduled root dt_curl telemetry utility',
              tone: 'amber',
            },
            {
              storyTerm: 'Building command desk',
              technicalTerm: 'Underlying operating system shell interpreter',
              tone: 'sky',
            },
            {
              storyTerm: 'Master supervisor authority',
              technicalTerm: 'Root privilege execution context',
              tone: 'rose',
            },
            {
              storyTerm: 'External pickup call',
              technicalTerm: 'Outbound staging retrieval initiated by dt_curl',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Unit 42 and Volexity (forensic analysis of compromised PAN-OS telemetry logs): /var/log/pan/device_telemetry_send.log containing shell syntax fragments and unexpected outbound connections initiated by dt_curl (proving that a crafted filename was evaluated as an operating system command).',
        },
        3: {
          storyAnalogy:
            'To keep quiet access after the courier finishes, the outsider slips an extra instruction sheet into the tollhouse startup manual so the front gate quietly checks error logs for hidden requests. From that foothold, the outsider copies the master vault directory listing.',
          storyMappings: [
            {
              storyTerm: 'Tollhouse startup manual',
              technicalTerm: 'Python site-packages system.pth loader file',
              tone: 'amber',
            },
            {
              storyTerm: 'Quiet error-log watcher',
              technicalTerm: 'UPSTYLE web error log command handler',
              tone: 'sky',
            },
            {
              storyTerm: 'Master vault directory',
              technicalTerm: 'Firewall running configuration and credential store',
              tone: 'rose',
            },
            {
              storyTerm: 'Front gate web counter',
              technicalTerm: 'GlobalProtect SSL portal web server',
              tone: 'emerald',
            },
          ],
        },
      },
    },

    'unit42-star-blizzard-evilginx-aitm': {
      briefing: {
        storyAnalogy:
          'A fraudster sets up an identical glass booth directly in front of the real bank lobby. A customer steps into the glass booth, enters both their vault code and live one-time stamp while the fraudster relays everything to the real bank teller, and then the fraudster walks away with the stamped entry pass to open the customer mailroom unchecked.',
        storyMappings: [
          {
            storyTerm: 'Identical glass booth',
            technicalTerm: 'Evilginx adversary-in-the-middle reverse proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Live one-time stamp',
            technicalTerm: 'Real-time multi-factor authentication challenge',
            tone: 'sky',
          },
          {
            storyTerm: 'Stamped entry pass',
            technicalTerm: 'Stolen ESTSAUTHPERSISTENT session cookie',
            tone: 'rose',
          },
          {
            storyTerm: 'Customer mailroom',
            technicalTerm: 'Cloud mailbox and inbox forwarding rules',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'A convincing invitation letter lures the employee to a look-alike glass booth built on a freshly rented storefront. Every word and visual logo inside the booth is mirrored live from the genuine bank lobby just behind the curtain.',
          storyMappings: [
            {
              storyTerm: 'Convincing invitation letter',
              technicalTerm: 'Targeted spear-phishing email link',
              tone: 'amber',
            },
            {
              storyTerm: 'Look-alike glass booth',
              technicalTerm: 'Evilginx transparent reverse-proxy server',
              tone: 'sky',
            },
            {
              storyTerm: 'Genuine bank lobby',
              technicalTerm: 'Legitimate cloud identity login portal',
              tone: 'rose',
            },
            {
              storyTerm: 'Freshly rented storefront',
              technicalTerm: 'Attacker-registered phishing domain and TLS cert',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Microsoft Threat Intelligence (cloud identity telemetry linking phishing clicks to proxy sign-ins): Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after an email link click in Defender for Office 365 (revealing that a middleman host relayed the authentication session).',
        },
        2: {
          storyAnalogy:
            'The employee types their secret passphrase and approves the live security chime on their pocket buzzer. The glass booth forwards both answers straight to the real teller and quietly photocopies the stamped entry pass handed back through the slot.',
          storyMappings: [
            {
              storyTerm: 'Secret passphrase',
              technicalTerm: 'Captured user account password',
              tone: 'amber',
            },
            {
              storyTerm: 'Pocket buzzer approval',
              technicalTerm: 'Completed MFA push or TOTP verification',
              tone: 'sky',
            },
            {
              storyTerm: 'Photocopied entry pass',
              technicalTerm: 'Intercepted Set-Cookie session token',
              tone: 'rose',
            },
            {
              storyTerm: 'Booth handshake signature',
              technicalTerm: 'Reverse-proxy TLS JA3 client fingerprint',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in MITRE T1539 and Microsoft Entra Identity Protection (risk analytics focused on session token theft): high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step belong to a reverse-proxy server (indicating the user did not communicate directly with the identity provider).',
        },
        3: {
          storyAnalogy:
            'From another city, the fraudster flashes the photocopied entry pass at the mailroom door, bypassing both the password desk and the pocket buzzer entirely. Inside, the fraudster adds a secret forwarding tray that diverts sensitive correspondence out of sight.',
          storyMappings: [
            {
              storyTerm: 'Flashing the photocopied pass',
              technicalTerm: 'Replaying ESTSAUTHPERSISTENT session cookie',
              tone: 'amber',
            },
            {
              storyTerm: 'Second city entrance',
              technicalTerm: 'New attacker IP address reusing the same SessionId',
              tone: 'sky',
            },
            {
              storyTerm: 'Secret forwarding tray',
              technicalTerm: 'Malicious New-InboxRule mailbox rule',
              tone: 'rose',
            },
            {
              storyTerm: 'Mailroom ledger',
              technicalTerm: 'Cloud Unified Audit Log telemetry',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Microsoft Sentinel and Entra Sign-in Logs (post-compromise session correlation queries): identical UniqueTokenIdentifier / SessionId replayed from a second IP address followed by New-InboxRule creation in Unified Audit Logs (demonstrating session cookie hijack and mailbox persistence).',
        },
      },
    },

    'talos-arcanedoor-asa': {
      briefing: {
        storyAnalogy:
          'A fortress gatekeeper checks visitor clearance cards using an internal handbook kept on a live workbench. An outsider slips a coded message into the clearance envelope that rewrites pages on the live workbench, turns off the watchtower alarm bell, and plants a hidden archive package in the basement vault so the backdoor returns after every seasonal rebuild.',
        storyMappings: [
          {
            storyTerm: 'Fortress gatekeeper',
            technicalTerm: 'Perimeter network security firewall appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Clearance envelope message',
            technicalTerm: 'Oversized encoded authentication POST payload',
            tone: 'sky',
          },
          {
            storyTerm: 'Live workbench rewrite',
            technicalTerm: 'Line Dancer in-memory resident implant',
            tone: 'rose',
          },
          {
            storyTerm: 'Basement vault archive',
            technicalTerm: 'Line Runner persistent web package across reboots',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An uninvited courier mails an oversized clearance envelope to the fortress side window. Inside the reply form, folded rows of coded symbols slip past the gatekeeper check and place raw instructions onto the active guard workbench.',
          storyMappings: [
            {
              storyTerm: 'Fortress side window',
              technicalTerm: 'SSL remote-access authentication endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Oversized clearance envelope',
              technicalTerm: 'Crafted host-scan-reply POST body',
              tone: 'sky',
            },
            {
              storyTerm: 'Folded coded symbols',
              technicalTerm: 'Base64-encoded binary instruction payload',
              tone: 'rose',
            },
            {
              storyTerm: 'Active guard workbench',
              technicalTerm: 'Running appliance process memory',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Cisco Talos (CVE-2024-20353 advisory covering perimeter firewall exploitation): anomalous POST requests to /CSCOSSLC/config-auth with oversized <host-scan-reply> payloads from non-VPN client IPs (flagging malformed pre-authentication requests used to trigger the flaw).',
        },
        2: {
          storyAnalogy:
            'Once active on the workbench, a silent in-memory agent mutes the watchtower logbook bell and redirects incoming check-in packets so the outsider can inspect traffic and run custom gate commands without leaving paper records.',
          storyMappings: [
            {
              storyTerm: 'Silent workbench agent',
              technicalTerm: 'Line Dancer memory-only implant',
              tone: 'amber',
            },
            {
              storyTerm: 'Muting the logbook bell',
              technicalTerm: 'Suppression of outbound syslog audit alerts',
              tone: 'sky',
            },
            {
              storyTerm: 'Guard handbook text',
              technicalTerm: 'Running appliance executable code segment',
              tone: 'rose',
            },
            {
              storyTerm: 'Custom gate commands',
              technicalTerm: 'Arbitrary memory-dispatched appliance actions',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Cisco Talos ArcaneDoor IOC Guide (integrity validation steps for hardware security appliances): verify /md5 system:memory/text hash mismatch on the running ASA lina text segment and unexpected gaps in ASA syslog sequence numbers (proving in-memory code tampering and suppressed logging).',
        },
        3: {
          storyAnalogy:
            'To survive a full guard shift change and fortress restart, the outsider places a concealed spare bundle inside the basement storage cabinet that automatically unpacks a hidden side-door script every time the fortress powers back on.',
          storyMappings: [
            {
              storyTerm: 'Basement storage cabinet',
              technicalTerm: 'Persistent flash storage boot filesystem',
              tone: 'amber',
            },
            {
              storyTerm: 'Concealed spare bundle',
              technicalTerm: 'Line Runner archive exploiting CVE-2024-20359',
              tone: 'sky',
            },
            {
              storyTerm: 'Fortress shift restart',
              technicalTerm: 'Device reboot and firmware upgrade cycle',
              tone: 'rose',
            },
            {
              storyTerm: 'Hidden side-door script',
              technicalTerm: 'Persistent unauthorized Lua web handler',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Cisco Advisory CVE-2024-20359 and NCSC Guidance (post-incident persistence checks for edge firewalls): unauthorized files on disk0: boot paths and system:memory/text integrity verification failure (confirming that a persistent archive survived appliance reboots).',
        },
      },
    },

    'f5-bigip-request-smuggling': {
      briefing: {
        storyAnalogy:
          'A front lobby receptionist counts sealed parcels differently from the back-office clerk receiving them on a conveyor belt. An outsider packs a second hidden work order inside one parcel so it bypasses the lobby badge desk, creates a new master clerk account, and runs unrestricted commands in the engine room.',
        storyMappings: [
          {
            storyTerm: 'Front lobby receptionist',
            technicalTerm: 'Front-end Apache reverse-proxy web server',
            tone: 'amber',
          },
          {
            storyTerm: 'Back-office conveyor clerk',
            technicalTerm: 'Internal Tomcat AJP servlet container',
            tone: 'sky',
          },
          {
            storyTerm: 'Second hidden work order',
            technicalTerm: 'Smuggled AJP administrative request (CVE-2023-46747)',
            tone: 'rose',
          },
          {
            storyTerm: 'Engine room terminal',
            technicalTerm: 'Root shell execution through management utility',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The outsider hands over a single oversized parcel at the lobby desk. The receptionist stamps the outer wrapper as harmless, while the back-office clerk splits the parcel along a hidden crease and treats the inner slip as a pre-approved manager order.',
          storyMappings: [
            {
              storyTerm: 'Outer parcel wrapper',
              technicalTerm: 'Benign front-end HTTP request headers',
              tone: 'amber',
            },
            {
              storyTerm: 'Hidden parcel crease',
              technicalTerm: 'AJP request framing desynchronization flaw',
              tone: 'sky',
            },
            {
              storyTerm: 'Pre-approved manager order',
              technicalTerm: 'Smuggled request targeting /tmui/Control/jspmap/',
              tone: 'rose',
            },
            {
              storyTerm: 'Back-office clerk',
              technicalTerm: 'Backend Tomcat AJP connector listener',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by ProjectDiscovery and F5 K000137353 (vendor advisory detailing authentication bypass traces): /var/log/httpd/httpd_errors and Tomcat logs showing anomalous AJP header parsing and unauthenticated hits to /tmui/Control/jspmap/ (indicating a smuggled request reached the internal management servlet).',
        },
        2: {
          storyAnalogy:
            'Acting under that smuggled manager stamp, the back-office clerk opens the staff roster book and writes in a brand-new senior supervisor badge with full building and workshop keys, even though nobody ever signed in at the front desk.',
          storyMappings: [
            {
              storyTerm: 'Staff roster book',
              technicalTerm: 'Appliance configuration user database',
              tone: 'amber',
            },
            {
              storyTerm: 'Senior supervisor badge',
              technicalTerm: 'Rogue administrator account with role=admin',
              tone: 'sky',
            },
            {
              storyTerm: 'Workshop master key',
              technicalTerm: 'Assigned advanced interactive shell access',
              tone: 'rose',
            },
            {
              storyTerm: 'Missing front-desk sign-in',
              technicalTerm: 'Account creation with no prior web login event',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in /var/log/audit and /var/log/ltm (local appliance configuration audit trails): creation of a new user account with role=admin and shell=bash without a preceding interactive web login (a high-confidence indicator of administrative authentication bypass).',
        },
        3: {
          storyAnalogy:
            'Wearing the newly forged supervisor badge, the outsider walks directly to the engine-room command console and dispatches unrestricted maintenance directives across the entire traffic-routing building.',
          storyMappings: [
            {
              storyTerm: 'Engine-room command console',
              technicalTerm: 'Management tmshCmd.jsp execution endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Unrestricted maintenance directive',
              technicalTerm: 'Arbitrary root command via util bash -c',
              tone: 'sky',
            },
            {
              storyTerm: 'Building traffic hub',
              technicalTerm: 'Compromised enterprise load-balancer appliance',
              tone: 'rose',
            },
            {
              storyTerm: 'Shift audit ledger',
              technicalTerm: 'Control-plane audit log recording shell runs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in F5 K000137353 (/var/log/audit appliance command logs): mcpd / tmsh audit log entries showing run /util bash -c executed from tmui / tomcat (confirming that the web management interface spawned underlying root shell commands).',
        },
      },
    },

    'splunk-ivanti-connect-secure': {
      briefing: {
        storyAnalogy:
          'A secure commuter tunnel checks entry badges at the main turnstile, but a side stairwell lets someone step back a hallway and walk into the control booth unchallenged. Once inside, the intruder writes a hidden command into the license meter and alters three permanent booth manuals so every future inspection still reports all systems normal.',
        storyMappings: [
          {
            storyTerm: 'Commuter tunnel gate',
            technicalTerm: 'Ivanti Connect Secure VPN gateway appliance',
            tone: 'amber',
          },
          {
            storyTerm: 'Side stairwell shortcut',
            technicalTerm: 'Path traversal authentication bypass (CVE-2023-46805)',
            tone: 'sky',
          },
          {
            storyTerm: 'License meter dial',
            technicalTerm: 'Command injection in keys-status endpoint (CVE-2024-21887)',
            tone: 'rose',
          },
          {
            storyTerm: 'Altered booth manuals',
            technicalTerm: 'Persistent web, library, and integrity-checker implants',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider knocks on a public helper window and adds backward hallway steps onto the room number. The door guard checks only the starting corridor and waves the visitor straight into the restricted control booth.',
          storyMappings: [
            {
              storyTerm: 'Public helper window',
              technicalTerm: 'Unauthenticated backup-code API path prefix',
              tone: 'amber',
            },
            {
              storyTerm: 'Backward hallway steps',
              technicalTerm: 'Relative ../ directory traversal path segments',
              tone: 'sky',
            },
            {
              storyTerm: 'Restricted control booth',
              technicalTerm: 'Protected internal administrative REST endpoints',
              tone: 'rose',
            },
            {
              storyTerm: 'Tunnel door guard',
              technicalTerm: 'Gateway URL route authorization filter',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in CISA ED 24-01 and Splunk SURGe (emergency federal directive and detection rules for gateway traversal): HTTP requests containing /api/v1/totp/user-backup-code/.. or /api/v1/cav/client/status/.. (which reveal attempts to step out of public routes into restricted administrative handlers).',
        },
        2: {
          storyAnalogy:
            'Inside the control booth, the visitor types a semicolon and extra workshop orders directly into the license status gauge. The gauge passes the raw text straight to the basement machinery, granting instant full control.',
          storyMappings: [
            {
              storyTerm: 'License status gauge',
              technicalTerm: 'Internal /api/v1/license/keys-status/ parameter',
              tone: 'amber',
            },
            {
              storyTerm: 'Semicolon extra order',
              technicalTerm: 'OS command injection payload (CVE-2024-21887)',
              tone: 'sky',
            },
            {
              storyTerm: 'Basement machinery',
              technicalTerm: 'Underlying Linux shell spawned by web daemon',
              tone: 'rose',
            },
            {
              storyTerm: 'Control booth intercom',
              technicalTerm: 'Appliance syslog and unallocated access logs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Volexity and Mandiant (incident investigations of chained gateway compromises): Ivanti unallocated log / syslog entries showing /api/v1/license/keys-status/; followed by unexpected child processes of the web daemon (proving command injection after authentication bypass).',
        },
        3: {
          storyAnalogy:
            'Before leaving, the intruder edits a visitor log page to accept secret requests, inserts a quiet traffic filter ahead of normal booth tools, and rewrites the safety inspector checklist so internal self-audits report a clean bill of health.',
          storyMappings: [
            {
              storyTerm: 'Edited visitor log page',
              technicalTerm: 'WIREFIRE web backdoor inside visits.py',
              tone: 'amber',
            },
            {
              storyTerm: 'Quiet traffic filter',
              technicalTerm: 'ZIPLINE passive interceptor via LD_PRELOAD',
              tone: 'sky',
            },
            {
              storyTerm: 'Rewritten inspector checklist',
              technicalTerm: 'Tampered ComponentIntegrity.pm checker module',
              tone: 'rose',
            },
            {
              storyTerm: 'External auditor snapshot',
              technicalTerm: 'Out-of-band Integrity Checker Tool verification',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Volexity (UTA0178) and Mandiant (UNC5221) (forensic artifact lists for persistent gateway backdoors): modification of visits.py, libsecure.so (ZIPLINE), and ComponentIntegrity.pm discovered via external Integrity Checker Tool (ICT) snapshots (because on-box checkers can be blinded by the intruder).',
        },
      },
    },

    'splunk-citrix-bleed-session-hijack': {
      briefing: {
        storyAnalogy:
          'A coatroom clerk copies your claim label onto a fixed-size receipt slip, but when a guest hands in an overly long name card, the clerk accidentally prints neighboring coat tickets from the counter drawer onto the back. An outsider grabs a printed executive coat ticket, skips the front check-in desk, and strolls straight into the private corporate office floor.',
        storyMappings: [
          {
            storyTerm: 'Overly long name card',
            technicalTerm: 'Oversized HTTP Host request header (CVE-2023-4966)',
            tone: 'amber',
          },
          {
            storyTerm: 'Neighboring counter tickets',
            technicalTerm: 'Leaked adjacent NetScaler process memory',
            tone: 'sky',
          },
          {
            storyTerm: 'Executive coat ticket',
            technicalTerm: '65-character NSC_AAAC authenticated session cookie',
            tone: 'rose',
          },
          {
            storyTerm: 'Private office floor',
            technicalTerm: 'Internal virtual desktop and remote server tier',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider approaches the public information counter with an unusually long address label. While preparing the printed directory reply, the counter machine overruns its tray and dumps handfuls of neighboring scratch memory straight into the response.',
          storyMappings: [
            {
              storyTerm: 'Public information counter',
              technicalTerm: 'Exposed OpenID discovery endpoint on NetScaler',
              tone: 'amber',
            },
            {
              storyTerm: 'Unusually long address label',
              technicalTerm: 'Oversized HTTP Host header triggering buffer over-read',
              tone: 'sky',
            },
            {
              storyTerm: 'Neighboring scratch memory',
              technicalTerm: 'Adjacent uninitialized heap memory disclosure',
              tone: 'rose',
            },
            {
              storyTerm: 'Thick printed reply',
              technicalTerm: 'Abnormally large HTTP 200 response exceeding 130 KB',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Assetnote, CISA AA23-325A, and Suricata SID 2048918 (network detection signatures for Citrix Bleed): GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB HTTP 200 response (which signals an active out-of-bounds memory disclosure).',
        },
        2: {
          storyAnalogy:
            'Sifting through the spilled counter scraps, the outsider spots an active sixty-five-symbol coat claim ticket belonging to a signed-in manager. Presenting that copied ticket at the VIP entrance opens the manager desk immediately without any password or buzzer check.',
          storyMappings: [
            {
              storyTerm: 'Spilled counter scraps',
              technicalTerm: 'Raw leaked memory buffer contents',
              tone: 'amber',
            },
            {
              storyTerm: 'Sixty-five-symbol claim ticket',
              technicalTerm: 'Valid NSC_AAAC session cookie token',
              tone: 'sky',
            },
            {
              storyTerm: 'VIP entrance bypass',
              technicalTerm: 'Authenticated session hijack skipping MFA',
              tone: 'rose',
            },
            {
              storyTerm: 'Two separate entry gates',
              technicalTerm: 'Same session cookie observed from two distinct client IPs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Splunk SURGe and NetScaler AAA Syslog (ns.log session tracking records): Same NSC_AAAC session identifier active across two different client IP addresses / ASNs without a new authentication event (confirming that a stolen session cookie was replayed from an external host).',
        },
        3: {
          storyAnalogy:
            'Seated inside the hijacked manager workspace, the outsider picks up the internal office intercom and issues remote administration orders to adjacent floor vaults across the corporate building.',
          storyMappings: [
            {
              storyTerm: 'Hijacked manager workspace',
              technicalTerm: 'Active remote virtual desktop session',
              tone: 'amber',
            },
            {
              storyTerm: 'Internal office intercom',
              technicalTerm: 'Remote DCOM management interface',
              tone: 'sky',
            },
            {
              storyTerm: 'Remote administration order',
              technicalTerm: 'Spawned mmc.exe -Embedding execution on target hosts',
              tone: 'rose',
            },
            {
              storyTerm: 'Adjacent floor vaults',
              technicalTerm: 'Internal enterprise servers targeted during lateral movement',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in CISA AA23-325A and Mandiant (post-hijack lateral movement indicators): mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change (linking the hijacked remote session to internal network movement).',
        },
      },
    },

    'mandiant-apt29-teamcity-jetstream': {
      briefing: {
        storyAnalogy:
          'A factory assembly hub locks its supervisor offices behind a strict badge reader, yet an old side-door bell lets anyone mint a fresh master badge without showing identification. With that freshly minted badge, an intruder unlocks the factory repair console, steals product blueprints, and opens a covert courier drop to an outside locker.',
        storyMappings: [
          {
            storyTerm: 'Factory assembly hub',
            technicalTerm: 'JetBrains TeamCity build automation server',
            tone: 'amber',
          },
          {
            storyTerm: 'Old side-door bell',
            technicalTerm: 'Unauthenticated /RPC2 route bypass (CVE-2023-42793)',
            tone: 'sky',
          },
          {
            storyTerm: 'Factory repair console',
            technicalTerm: 'Internal debug process execution API',
            tone: 'rose',
          },
          {
            storyTerm: 'Outside courier locker',
            technicalTerm: 'Cloud-hosted command-and-control channel',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider rings a legacy service bell tagged onto the badge-printer route. Because the guard desk exempts that legacy bell from badge checks, the printer immediately issues a shiny master supervisor keycard.',
          storyMappings: [
            {
              storyTerm: 'Legacy service bell',
              technicalTerm: 'Appended /RPC2 URL suffix bypassing auth filter',
              tone: 'amber',
            },
            {
              storyTerm: 'Badge-printer route',
              technicalTerm: 'REST endpoint /app/rest/users/id:1/tokens/',
              tone: 'sky',
            },
            {
              storyTerm: 'Master supervisor keycard',
              technicalTerm: 'Minted administrator Bearer authentication token',
              tone: 'rose',
            },
            {
              storyTerm: 'Guard desk exemption',
              technicalTerm: 'Path-matching authentication flaw (CVE-2023-42793)',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in TeamCity teamcity-javaLogging and access logs (web server audit records of token minting): POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE /app/rest/users/id:1/tokens/RPC2 (showing unauthenticated creation and cleanup of an administrator bearer token).',
        },
        2: {
          storyAnalogy:
            'Holding the newly minted keycard, the intruder flips the maintenance switch that enables direct workshop commands and sends a discovery checklist straight through the factory supervisor terminal.',
          storyMappings: [
            {
              storyTerm: 'Maintenance switch',
              technicalTerm: 'Internal debug property enabling process execution',
              tone: 'amber',
            },
            {
              storyTerm: 'Factory supervisor terminal',
              technicalTerm: 'POST /app/rest/debug/processes endpoint',
              tone: 'sky',
            },
            {
              storyTerm: 'Discovery checklist',
              technicalTerm: 'Executed reconnaissance commands (whoami, nltest, curl)',
              tone: 'rose',
            },
            {
              storyTerm: 'Assembly controller process',
              technicalTerm: 'Server java.exe runtime spawning child utilities',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Mandiant (post-exploitation telemetry from build server compromises): POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl (confirming remote command execution from the build management service).',
        },
        3: {
          storyAnalogy:
            'Now roaming the assembly floor, the intruder copies signing seals and vault combinations from the build lockers, registers a backup supervisor account, and drops a quiet messenger beacon synced to a public storage shelf.',
          storyMappings: [
            {
              storyTerm: 'Build locker combinations',
              technicalTerm: 'Harvested CI/CD credentials and repository tokens',
              tone: 'amber',
            },
            {
              storyTerm: 'Backup supervisor account',
              technicalTerm: 'Newly created rogue TeamCity administrator',
              tone: 'sky',
            },
            {
              storyTerm: 'Quiet messenger beacon',
              technicalTerm: 'GraphicalProton backdoor implant',
              tone: 'rose',
            },
            {
              storyTerm: 'Public storage shelf',
              technicalTerm: 'Abused OneDrive cloud C2 communication channel',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Joint CISA Advisory and Mandiant (long-term persistence and C2 indicators): Creation of new TeamCity admin accounts in teamcity-activities.log and GraphicalProton OneDrive C2 beacons (revealing persistent administrative access and covert cloud exfiltration).',
        },
      },
    },

    'splunk-screenconnect-slashandgrab': {
      briefing: {
        storyAnalogy:
          'A remote help-desk dispatch center locks away its opening-day setup desk after launch, yet adding one extra slash to the hallway sign reopens the empty setup form. An outsider walks in, overwrites the master dispatcher roster with their own name, and uses the built-in dispatch radio to push instant orders to every managed workstation.',
        storyMappings: [
          {
            storyTerm: 'Remote dispatch center',
            technicalTerm: 'ConnectWise ScreenConnect RMM server',
            tone: 'amber',
          },
          {
            storyTerm: 'Extra slash hallway sign',
            technicalTerm: 'Path-traversal bypass on /SetupWizard.aspx/ (CVE-2024-1709)',
            tone: 'sky',
          },
          {
            storyTerm: 'Master dispatcher roster',
            technicalTerm: 'App_Data\\User.xml administrator credential file',
            tone: 'rose',
          },
          {
            storyTerm: 'Built-in dispatch radio',
            technicalTerm: 'Backstage administrative command runner',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider appends a trailing slash and random word to the closed setup-room doorway. The hallway lock checks only for an exact room name, so the setup desk swings wide open on a fully operating dispatch center.',
          storyMappings: [
            {
              storyTerm: 'Closed setup-room doorway',
              technicalTerm: 'Initial installation /SetupWizard.aspx page',
              tone: 'amber',
            },
            {
              storyTerm: 'Trailing slash and random word',
              technicalTerm: 'Path suffix bypass (/SetupWizard.aspx/anything)',
              tone: 'sky',
            },
            {
              storyTerm: 'Exact-name hallway lock',
              technicalTerm: 'Flawed URL path check (CVE-2024-1709)',
              tone: 'rose',
            },
            {
              storyTerm: 'Open setup desk',
              technicalTerm: 'HTTP 200 access to setup wizard on a live server',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Splunk SURGe and Huntress (web access log detections for SlashAndGrab): HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server (proving an unauthenticated caller reopened the initial configuration wizard).',
        },
        2: {
          storyAnalogy:
            'Sitting at the reopened setup desk, the outsider fills in a fresh owner name and password. The dispatch system dutifully wipes the old supervisor roster book, saves the newcomer as sole owner, and hands over a valid master badge.',
          storyMappings: [
            {
              storyTerm: 'Fresh owner registration form',
              technicalTerm: 'Submitted SetupWizard administrator creation POST',
              tone: 'amber',
            },
            {
              storyTerm: 'Supervisor roster book',
              technicalTerm: 'App_Data\\User.xml credential database',
              tone: 'sky',
            },
            {
              storyTerm: 'Valid master badge',
              technicalTerm: 'Authenticated administrator session cookie',
              tone: 'rose',
            },
            {
              storyTerm: 'Custom desk add-on',
              technicalTerm: 'Malicious extension file placed in App_Extensions',
              tone: 'emerald',
            },
          ],
          howItWorksInPractice:
            'Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch (overwriting existing administrator hashes with attacker-chosen credentials) and returns an authenticated administrator session cookie to the caller (granting full web console control without knowing prior passwords).',
          detectionAndEvidence:
            'Documented in Sysmon EventID 11 (file creation and overwrite telemetry) and ScreenConnect Audit Logs: Modification of C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml and App_Extensions\\*.ashx by ScreenConnect.Service.exe (confirming administrator credential replacement and extension deployment).',
        },
        3: {
          storyAnalogy:
            'With the master badge in hand, the outsider does not need to pick a single lock on employee desks. They simply press the legitimate dispatch intercom to broadcast silent maintenance orders to hundreds of connected offices at once.',
          storyMappings: [
            {
              storyTerm: 'Legitimate dispatch intercom',
              technicalTerm: 'ScreenConnect Backstage non-interactive shell',
              tone: 'amber',
            },
            {
              storyTerm: 'Connected branch offices',
              technicalTerm: 'Managed client endpoints running ClientService',
              tone: 'sky',
            },
            {
              storyTerm: 'Master building clearance',
              technicalTerm: 'NT AUTHORITY\\SYSTEM execution privilege',
              tone: 'rose',
            },
            {
              storyTerm: 'Broadcast maintenance order',
              technicalTerm: 'Temporary batch scripts invoking cmd.exe or powershell.exe',
              tone: 'emerald',
            },
          ],
          howItWorksInPractice:
            'Without needing a single exploit on the client workstations, the operator uses the built-in Backstage command runner (a legitimate remote-management console hidden from the logged-in desktop user) to execute arbitrary commands as NT AUTHORITY\\SYSTEM across hundreds or thousands of managed endpoints simultaneously (turning one RMM server compromise into fleet-wide code execution).',
          detectionAndEvidence:
            'Documented by Huntress and Splunk SURGe (endpoint process creation indicators for abused RMM sessions): ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from C:\\Windows\\Temp\\ScreenConnect\\<version>\\*.cmd (signaling mass Backstage command execution across managed workstations).',
        },
      },
    },

    'cl0p-moveit-transfer-cve-2023-34362': {
      briefing: {
        storyAnalogy:
          'A courier transfer vault accepts guest drop-off tickets before forwarding them to an internal filing clerk. An outsider writes hidden database instructions inside a guest ticket to slip a self-assembling toolbox into the vault ledger, plants a secret back-door teller window, and quietly drains stored client archives.',
        storyMappings: [
          {
            storyTerm: 'Courier transfer vault',
            technicalTerm: 'Progress MOVEit Transfer managed file server',
            tone: 'amber',
          },
          {
            storyTerm: 'Hidden database instruction',
            technicalTerm: 'SQL injection via ISAPI session header (CVE-2023-34362)',
            tone: 'sky',
          },
          {
            storyTerm: 'Self-assembling toolbox',
            technicalTerm: 'Malicious .NET BinaryFormatter gadget payload',
            tone: 'rose',
          },
          {
            storyTerm: 'Secret back-door teller',
            technicalTerm: 'LEMURLOOT human2.aspx web shell',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider visits the public guest counter to collect a fresh visitor slip, then immediately submits that slip to the internal filing chute with tampered ledger phrases tucked into the margin to rewrite vault session records.',
          storyMappings: [
            {
              storyTerm: 'Public guest counter',
              technicalTerm: 'POST /guestaccess.aspx session initialization',
              tone: 'amber',
            },
            {
              storyTerm: 'Internal filing chute',
              technicalTerm: 'POST /moveitisapi/moveitisapi.dll handler',
              tone: 'sky',
            },
            {
              storyTerm: 'Tampered ledger phrases',
              technicalTerm: 'SQL injection statements inside X-siLock headers',
              tone: 'rose',
            },
            {
              storyTerm: 'Vault session records',
              technicalTerm: 'Backend MOVEit ActiveSessions database table',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Huntress and Mandiant (web log correlation for MOVEit exploitation chains): IIS W3SVC logs showing POST /guestaccess.aspx immediately followed by POST /moveitisapi/moveitisapi.dll action=m2 (a tight request pair characteristic of automated CVE-2023-34362 exploitation).',
        },
        2: {
          storyAnalogy:
            'Using the forged session privileges, the outsider stores a folded clockwork package inside the vault session ledger. When the clerk pulls that entry back out to read it, the package springs open and installs a hidden teller window on the web wall.',
          storyMappings: [
            {
              storyTerm: 'Folded clockwork package',
              technicalTerm: 'Serialized .NET BinaryFormatter exploit object',
              tone: 'amber',
            },
            {
              storyTerm: 'Clerk unfolding the entry',
              technicalTerm: 'Unsafe deserialization during session processing',
              tone: 'sky',
            },
            {
              storyTerm: 'Hidden teller window',
              technicalTerm: 'Dropped /human2.aspx web shell script',
              tone: 'rose',
            },
            {
              storyTerm: 'Vault wall directory',
              technicalTerm: 'Webroot folder served by IIS',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The outsider returns to the hidden teller window and whispers a secret passphrase printed on a custom envelope margin. Recognizing the passphrase, the window exports customer files and cloud locker credentials directly out the door.',
          storyMappings: [
            {
              storyTerm: 'Hidden teller window',
              technicalTerm: 'Deployed human2.aspx web backdoor',
              tone: 'amber',
            },
            {
              storyTerm: 'Envelope margin passphrase',
              technicalTerm: 'Custom X-siLock-Comment authentication header',
              tone: 'sky',
            },
            {
              storyTerm: 'Order slip code',
              technicalTerm: 'X-siLock-Step1 command selector header',
              tone: 'rose',
            },
            {
              storyTerm: 'Customer storage lockers',
              technicalTerm: 'Stored tenant files and Azure Blob credentials',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Mandiant and CISA AA23-158A (web telemetry for LEMURLOOT data theft): HTTP requests to /human2.aspx with X-siLock-Comment and X-siLock-Step1 headers (which act as the backdoor password and action flags used to enumerate and extract stored files).',
        },
      },
    },

    'openssh-regreSSHion-cve-2024-6387': {
      briefing: {
        storyAnalogy:
          'A night watchman tidies a filing cabinet while a strict wall-clock alarm waits to chime whenever a visitor lingers too long. By flooding the doorway with carefully sized packages right before the bell rings, an outsider catches the watchman mid-shuffle, scrambles the cabinet layout, and redirects the alarm routine into opening the master building vault.',
        storyMappings: [
          {
            storyTerm: 'Night watchman service',
            technicalTerm: 'Privileged OpenSSH sshd authentication daemon',
            tone: 'amber',
          },
          {
            storyTerm: 'Strict wall-clock alarm',
            technicalTerm: 'LoginGraceTime SIGALRM timeout signal handler',
            tone: 'sky',
          },
          {
            storyTerm: 'Filing cabinet shuffle',
            technicalTerm: 'glibc heap memory allocation and free routines',
            tone: 'rose',
          },
          {
            storyTerm: 'Redirected alarm routine',
            technicalTerm: 'Hijacked _IO_FILE vtable yielding root execution',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The outsider sends thousands of timed knock-and-wait packets of alternating sizes to the doorway, arranging empty and occupied slots inside the watchman filing cabinet in a predictable checkerboard right before the timeout bell.',
          storyMappings: [
            {
              storyTerm: 'Alternating knock-and-wait packets',
              technicalTerm: 'Crafted SSH public-key authentication messages',
              tone: 'amber',
            },
            {
              storyTerm: 'Filing cabinet checkerboard',
              technicalTerm: 'Groomed glibc heap chunk layout',
              tone: 'sky',
            },
            {
              storyTerm: 'Doorway timeout bell',
              technicalTerm: 'Default 120-second LoginGraceTime threshold',
              tone: 'rose',
            },
            {
              storyTerm: 'Watchman visitor register',
              technicalTerm: 'System /var/log/auth.log authentication log',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Qualys TRU and CISA (host log indicators for CVE-2024-6387 race attempts): High-rate bursts of Timeout before authentication for <IP> in /var/log/auth.log across thousands of connections (revealing sustained heap grooming and timeout racing from a single source).',
        },
        2: {
          storyAnalogy:
            'At the exact split second the watchman is halfway through updating a cabinet index card, the wall-clock alarm rings and forces an unsafe logging clerk to reach into the same half-updated drawer, corrupting adjacent drawer pointers.',
          storyMappings: [
            {
              storyTerm: 'Half-updated index card',
              technicalTerm: 'Interrupted non-reentrant glibc free() operation',
              tone: 'amber',
            },
            {
              storyTerm: 'Wall-clock alarm interruption',
              technicalTerm: 'Asynchronous SIGALRM signal delivery',
              tone: 'sky',
            },
            {
              storyTerm: 'Unsafe logging clerk',
              technicalTerm: 'Async-signal-unsafe syslog() call inside handler',
              tone: 'rose',
            },
            {
              storyTerm: 'Corrupted drawer pointers',
              technicalTerm: 'Overwritten heap metadata and structure pointers',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Qualys TRU (crash forensics produced during race-condition exploitation): sshd child processes crashing with SIGABRT / SIGSEGV in libc.so.6 during unsuccessful race attempts (signaling active memory corruption attempts against the login daemon).',
        },
        3: {
          storyAnalogy:
            'When the timing aligns, the corrupted drawer pointer swaps out the watchman instruction table for a forged dispatch card. The very next routine action hands the outsider the master building keys without any login badge.',
          storyMappings: [
            {
              storyTerm: 'Watchman instruction table',
              technicalTerm: 'glibc _IO_FILE _IO_wfile_jumps vtable structure',
              tone: 'amber',
            },
            {
              storyTerm: 'Forged dispatch card',
              technicalTerm: 'Attacker-controlled fake file stream structure',
              tone: 'sky',
            },
            {
              storyTerm: 'Master building keys',
              technicalTerm: 'Un-sandboxed root (uid=0) shell execution',
              tone: 'rose',
            },
            {
              storyTerm: 'Building security camera',
              technicalTerm: 'Linux auditd SYSCALL execve telemetry',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Qualys TRU and CISA (post-exploitation host telemetry for unauthenticated sshd takeover): Auditd SYSCALL execve from sshd with uid=0 following repeated Timeout before authentication events (confirming successful pre-authentication root code execution).',
        },
      },
    },

    'fortra-goanywhere-mft-cve-2023-0669-cl0p': {
      briefing: {
        storyAnalogy:
          'A shipping warehouse exposes its private license-renewal drop box to the street and seals every envelope with the same printed factory padlock key. An outsider wraps a spring-loaded package with that public factory key, drops it through the renewal slot, and watches the clerk automatically unpack it into full control of the shipping floor.',
        storyMappings: [
          {
            storyTerm: 'Private license drop box',
            technicalTerm: 'Exposed GoAnywhere MFT admin console on port 8000/8001',
            tone: 'amber',
          },
          {
            storyTerm: 'Printed factory padlock key',
            technicalTerm: 'Hardcoded AES encryption key in License Response Handler',
            tone: 'sky',
          },
          {
            storyTerm: 'Spring-loaded package',
            technicalTerm: 'Serialized Java CommonsBeanutils1 gadget chain',
            tone: 'rose',
          },
          {
            storyTerm: 'Shipping floor archive',
            technicalTerm: 'Managed customer file transfer repositories',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'Because the warehouse reused one fixed factory padlock key across every branch, the outsider locks a custom-built trick package with that exact key and posts it straight into the street-facing license acceptance slot.',
          storyMappings: [
            {
              storyTerm: 'Fixed factory padlock key',
              technicalTerm: 'Hardcoded "$2" AES/CBC/PKCS5Padding key',
              tone: 'amber',
            },
            {
              storyTerm: 'Street-facing acceptance slot',
              technicalTerm: 'Unauthenticated POST /goanywhere/lic/accept endpoint',
              tone: 'sky',
            },
            {
              storyTerm: 'Custom-built trick package',
              technicalTerm: 'Encrypted serialized Java payload bundle',
              tone: 'rose',
            },
            {
              storyTerm: 'Branch perimeter monitor',
              technicalTerm: 'Network IDS signature monitoring port 8000/8001',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Huntress and Suricata SID 2043881 (network alert rules for GoAnywhere MFT pre-auth exploitation): Unauthenticated POST /goanywhere/lic/accept requests on TCP port 8000/8001 (flagging external traffic hitting the administrative license servlet).',
        },
        2: {
          storyAnalogy:
            'The warehouse clerk unlocks the envelope with the matching factory key and dumps the contents directly onto the sorting table. As the parts click together automatically, the sorting machine fires up a command terminal for the outsider.',
          storyMappings: [
            {
              storyTerm: 'Sorting table unpacker',
              technicalTerm: 'Java ObjectInputStream.readObject() deserializer',
              tone: 'amber',
            },
            {
              storyTerm: 'Self-clicking mechanical parts',
              technicalTerm: 'CommonsBeanutils1 BeanComparator gadget chain',
              tone: 'sky',
            },
            {
              storyTerm: 'Warehouse clerk process',
              technicalTerm: 'Service runtime tomcat9.exe',
              tone: 'rose',
            },
            {
              storyTerm: 'Fired-up command terminal',
              technicalTerm: 'Spawned cmd.exe child shell process',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Huntress (application stack traces and process lineage for CVE-2023-0669): BeanComparator.compare and PriorityQueue.readObject stack trace in userdata/logs/goanywhere.log paired with tomcat9.exe spawning cmd.exe (proving unsafe deserialization achieved command execution).',
        },
        3: {
          storyAnalogy:
            'From the open terminal, the outsider installs a quiet scouting kit and remote courier relay in the shared storeroom, then packs out confidential partner shipping records.',
          storyMappings: [
            {
              storyTerm: 'Quiet scouting kit',
              technicalTerm: 'TrueBot (acl.dll) reconnaissance library',
              tone: 'amber',
            },
            {
              storyTerm: 'Remote courier relay',
              technicalTerm: 'Cobalt Strike post-exploitation beacon',
              tone: 'sky',
            },
            {
              storyTerm: 'Shared storeroom folder',
              technicalTerm: 'C:\\ProgramData\\ payload staging directory',
              tone: 'rose',
            },
            {
              storyTerm: 'Partner shipping records',
              technicalTerm: 'Exfiltrated MFT customer archives',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Mandiant and CISA (post-exploitation process chain for CL0P MFT intrusions): tomcat9.exe -> cmd.exe -> powershell.exe -> rundll32.exe loading unsigned DLLs from C:\\ProgramData\\ (highlighting rapid staging of follow-on malware after initial web takeover).',
        },
      },
    },

    'proxyshell-exchange-cve-2021-34473': {
      briefing: {
        storyAnalogy:
          'A corporate mail building has a polite front concierge who forwards requests to an inner vault room. An outsider writes a deceptive hallway address that tricks the concierge into forwarding directly to the vault, flashes a forged supervisor ribbon to grant mail-export rights, and prints an executable backdoor tucked inside a routine mail export bag.',
        storyMappings: [
          {
            storyTerm: 'Front lobby concierge',
            technicalTerm: 'Exchange Client Access front-end proxy',
            tone: 'amber',
          },
          {
            storyTerm: 'Deceptive hallway address',
            technicalTerm: 'URL confusion path /autodiscover/autodiscover.json (CVE-2021-34473)',
            tone: 'sky',
          },
          {
            storyTerm: 'Forged supervisor ribbon',
            technicalTerm: 'Crafted X-Rps-CAT Kerberos/Windows token (CVE-2021-34523)',
            tone: 'rose',
          },
          {
            storyTerm: 'Mail export bag backdoor',
            technicalTerm: 'PST/ASPX polyglot webshell via New-MailboxExportRequest (CVE-2021-31207)',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The outsider hands the front concierge an inquiry envelope addressed to a public directory desk, with a real back-office command room tucked behind the street label. The concierge checks the outer stamp and delivers the envelope straight to the locked back office.',
          storyMappings: [
            {
              storyTerm: 'Public directory desk',
              technicalTerm: '/autodiscover/autodiscover.json prefix',
              tone: 'amber',
            },
            {
              storyTerm: 'Locked back office',
              technicalTerm: 'Internal /powershell and /mapi/nspi backend endpoints',
              tone: 'sky',
            },
            {
              storyTerm: 'Front lobby concierge',
              technicalTerm: 'Exchange front-end IIS proxy service',
              tone: 'rose',
            },
            {
              storyTerm: 'Concierge delivery log',
              technicalTerm: 'IIS W3SVC front-end access logs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in CISA AA21-265A and Splunk SURGe (web server detections for ProxyShell pre-auth SSRF): IIS W3SVC logs showing /autodiscover/autodiscover.json paired with /powershell or /mapi/nspi (revealing path-confusion routing to restricted backend endpoints).',
        },
        2: {
          storyAnalogy:
            'Inside the back office, the outsider attaches a hand-crafted supervisor clearance ribbon to their request. Trusting the concierge delivery stamp, the office elevates the caller to mail administrator and activates full mailbox export privileges.',
          storyMappings: [
            {
              storyTerm: 'Hand-crafted supervisor ribbon',
              technicalTerm: 'Forged X-Rps-CAT query string token',
              tone: 'amber',
            },
            {
              storyTerm: 'Mail administrator status',
              technicalTerm: 'Impersonated Exchange Administrator SID',
              tone: 'sky',
            },
            {
              storyTerm: 'Activated export privilege',
              technicalTerm: 'Assigned Mailbox Import Export management role',
              tone: 'rose',
            },
            {
              storyTerm: 'Management policy log',
              technicalTerm: 'MSExchange Management administrative event log',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Mandiant and DEVCORE (privilege escalation evidence in ProxyShell chains): X-Rps-CAT= in IIS query strings and New-ManagementRoleAssignment -Role "Mailbox Import Export" in MSExchange Management logs (confirming forged token impersonation and export role elevation).',
        },
        3: {
          storyAnalogy:
            'The intruder saves a draft message containing hidden shop-floor instructions, then commands the mailroom to export that mailbox straight onto the public noticeboard with a web-script label so any visitor can trigger commands on demand.',
          storyMappings: [
            {
              storyTerm: 'Draft message with hidden instructions',
              technicalTerm: 'Encoded webshell payload embedded in mailbox draft',
              tone: 'amber',
            },
            {
              storyTerm: 'Mailbox export command',
              technicalTerm: 'New-MailboxExportRequest targeting a web-accessible path',
              tone: 'sky',
            },
            {
              storyTerm: 'Public noticeboard wall',
              technicalTerm: 'Exchange IIS inetpub webroot directory',
              tone: 'rose',
            },
            {
              storyTerm: 'Web-script label',
              technicalTerm: 'Written .aspx polyglot webshell file',
              tone: 'emerald',
            },
          ],
        },
      },
    },

    'sharepoint-cve-2023-29357-24955-chain': {
      briefing: {
        storyAnalogy:
          'A document archive verifies visitor passes using a wax seal stamp, but a misread rule accepts any pass marked "no seal required". An outsider presents a blank-seal pass to copy the head archivist ID, prints a second blank-seal pass under that director name, and loads an unsigned plug-in cartridge that runs commands inside the archive engine.',
        storyMappings: [
          {
            storyTerm: 'Document archive portal',
            technicalTerm: 'On-premises Microsoft SharePoint Server',
            tone: 'amber',
          },
          {
            storyTerm: 'Blank-seal visitor pass',
            technicalTerm: 'Unsigned "alg": "none" OAuth JWT token (CVE-2023-29357)',
            tone: 'sky',
          },
          {
            storyTerm: 'Head archivist ID',
            technicalTerm: 'Site administrator nameid claim from siteusers API',
            tone: 'rose',
          },
          {
            storyTerm: 'Unsigned plug-in cartridge',
            technicalTerm: 'Malicious BCS .bdcm DotNetAssembly model (CVE-2023-24955)',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider writes a homemade pass labeled "no signature needed" and hands it to the archive directory window. The clerk skips the seal check and hands back the full roster of head archivists and their badge numbers.',
          storyMappings: [
            {
              storyTerm: 'Homemade unsigned pass',
              technicalTerm: 'Bearer JWT with header {"alg":"none"}',
              tone: 'amber',
            },
            {
              storyTerm: 'Archive directory window',
              technicalTerm: '/_api/web/siteusers REST endpoint',
              tone: 'sky',
            },
            {
              storyTerm: 'Skipped wax-seal check',
              technicalTerm: 'Broken signature validation in CVE-2023-29357',
              tone: 'rose',
            },
            {
              storyTerm: 'Head archivist roster',
              technicalTerm: 'Enumerated administrator NameId and login accounts',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by STAR Labs, Rapid7, and Suricata SID 2048312 (network detection rules for SharePoint JWT spoofing): Authorization: Bearer eyJhbGciOiJub25l header targeting /_api/web/siteusers (exposing an unsigned JWT attempting to query privileged user identities).',
        },
        2: {
          storyAnalogy:
            'Copying the chief director badge number onto a second blank-seal pass marked "internal desk call", the outsider steps past every outer gate and enters the archive control room with full farm-wide authority.',
          storyMappings: [
            {
              storyTerm: 'Second blank-seal pass',
              technicalTerm: 'Spoofed administrator JWT containing stolen nameid',
              tone: 'amber',
            },
            {
              storyTerm: 'Internal desk call stamp',
              technicalTerm: 'Forged isloopback=true claim in token payload',
              tone: 'sky',
            },
            {
              storyTerm: 'Archive control room',
              technicalTerm: 'SharePoint Farm Administrator management plane',
              tone: 'rose',
            },
            {
              storyTerm: 'Security desk trace book',
              technicalTerm: 'SharePoint ULS token validation log',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in SharePoint ULS Logs (application-layer authentication audit traces): SPJsonWebSecurityTokenHandler validating an isloopback=true token for an administrator nameid from an external IP (a clear impossibility during legitimate local loopback authentication).',
        },
        3: {
          storyAnalogy:
            'Using chief director authority, the outsider uploads a custom business connector blueprint packed with hidden assembly code. The archive server compiles and executes that blueprint directly inside its live workspace.',
          storyMappings: [
            {
              storyTerm: 'Business connector blueprint',
              technicalTerm: 'Imported BCS .bdcm application model file',
              tone: 'amber',
            },
            {
              storyTerm: 'Hidden assembly code',
              technicalTerm: 'Embedded DotNetAssembly compiled in memory',
              tone: 'sky',
            },
            {
              storyTerm: 'Archive server workspace',
              technicalTerm: 'SharePoint w3wp.exe application pool process',
              tone: 'rose',
            },
            {
              storyTerm: 'Direct machine execution',
              technicalTerm: 'Authenticated remote code execution (CVE-2023-24955)',
              tone: 'emerald',
            },
          ],
        },
      },
    },
  };
