import type { RawScenarioStepGuideData } from '../scenario-step-guides';
import type { LegacyDraftScenario } from '../scenarios/normalize-legacy-draft-scenario';
import { explainCommandLine } from '../command-line-explanations';
import { VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS } from '../scenarios/vulncheck-cwp-and-dfir-batch1';
import { DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS } from '../scenarios/dfir-official-batch2-windows-artifacts';
import { DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS } from '../scenarios/dfir-official-batch3-linux-cloud-containers';
import { DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS } from '../scenarios/dfir-official-batch4-network-appliances-memory';
import { OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS } from '../scenarios/official-batch5-specialized-categories';

const ALL_NEW_DFIR_AND_CWP_DRAFTS: LegacyDraftScenario[] = [
  ...VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS,
  ...OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS,
];

interface CustomScenarioNarrativeMeta {
  advisory: string;
  briefingAnalogy: string;
  stepAnalogies: [string, string, string];
}

const CUSTOM_DFIR_NARRATIVE_META: Record<string, CustomScenarioNarrativeMeta> = {
  'dfir-ntds-dit-vssadmin-esentutl-extraction': {
    advisory:
      'CISA Joint Advisory AA23-075A, Microsoft ESENT Event Logging Specification (EventID 325/326) & MITRE ATT&CK T1003.003',
    briefingAnalogy:
      'Imagine a high-security bank vault where the master ledger book (ntds.dit) is bolted to the teller desk while the bank is open, so an insider uses the building photocopy system (Volume Shadow Copy vssvc.exe) to photograph the entire room and uses the official ledger binding machine (esentutl.exe) to print a duplicate copy alongside the safe combination key (SYSTEM registry hive).',
    stepAnalogies: [
      'Think of asking the facility camera system to freeze-frame the locked vault room (creating a read-only Volume Shadow Copy of C: so the exclusively locked ntds.dit file can be read without stopping the Active Directory service).',
      'Think of using the bank own certified archive copier to duplicate the ledger from the freeze-frame (invoking Microsoft signed esentutl.exe /y /vss, which silently logs ESENT EventID 325 and 326 in the Windows Application log).',
      'Think of copying the four-part cipher wheel needed to read the encrypted ledger entries (exporting HKLM\\SYSTEM via reg.exe save to extract the scrambled JD, Skew1, GBG, and Data BootKey classes).',
    ],
  },
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': {
    advisory:
      'Microsoft Sysinternals Sysmon EventID 10 Specification, Splunk SURGe Credential Dumping Research & MITRE ATT&CK T1003.001',
    briefingAnalogy:
      'Imagine a guard station (lsass.exe) holding every employee active badge in memory: instead of bringing in a suspicious burglary tool, an intruder calls the building own maintenance utility (rundll32.exe loading comsvcs.dll MiniDump) to take a complete crash-diagnostic photograph of the guard station desk.',
    stepAnalogies: [
      'Think of activating a master maintenance pass before approaching the security office (enabling SeDebugPrivilege in the process token via AdjustTokenPrivileges, recorded by Windows Security EventID 4703).',
      'Think of instructing a trusted maintenance worker to photocopy the entire badge cabinet (calling comsvcs.dll MiniDump or ordinal #24 via rundll32.exe, which opens lsass.exe with 0x1FFFFF access and logs Sysmon EventID 10).',
      'Think of sealing the photographed badge sheets into a labeled diagnostic binder on disk (writing the MDMP 4D 44 4D 50 minidump file to C:\\Windows\\Temp\\debug.bin, captured by Sysmon EventID 11).',
    ],
  },
  'dfir-dcsync-drsuapi-replication-eid4662': {
    advisory:
      'Microsoft Security Auditing EventID 4662 Specification, CISA Active Directory Hardening Guide & MITRE ATT&CK T1003.006',
    briefingAnalogy:
      'Imagine a regular desktop cubicle pretending to be a regional branch headquarters and calling the central bank vault over the internal synchronization phone line (MS-DRSR DRSUAPI) to request a full copy of every customer PIN and master signing key.',
    stepAnalogies: [
      'Think of a regular office phone dialing the dedicated inter-branch synchronization line (binding from a non-DC workstation IP to the drsuapi RPC UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 on CORP-DC01).',
      'Think of the central vault checking whether the caller has the inter-branch sync stamp (CORP-DC01 logging Security EventID 4662 with AccessMask 0x100 for Extended Right GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2).',
      'Think of the vault faxing the master key book directly to the cubicle without ever opening the physical safe door (streaming krbtgt NTLM and AES-256 keys in DRS_MSG_GETNCCHANGESREPLY over RPC).',
    ],
  },
  'dfir-wmi-event-subscription-persistence-sysmon': {
    advisory:
      'Microsoft Sysinternals Sysmon v15 (EventID 19/20/21), Mandiant WMI Forensics Whitepaper & MITRE ATT&CK T1546.003',
    briefingAnalogy:
      'Imagine wiring a hidden motion sensor (__EventFilter) inside the building automation database (OBJECTS.DATA) and connecting it with a splice cable (__FilterToConsumerBinding) to an automated loudspeaker (CommandLineEventConsumer) that fires every 60 seconds.',
    stepAnalogies: [
      'Think of installing a timer switch inside the building central control room (creating a permanent WMI __EventFilter in root\\subscription with a WQL polling query, logged by Sysmon EventID 19).',
      'Think of wiring that timer switch to an automated command dispatcher stored inside the master blueprint repository (registering CommandLineEventConsumer and __FilterToConsumerBinding in OBJECTS.DATA, logged by Sysmon EventID 20, 21, and WMI-Activity 5861).',
      'Think of the building automation daemon flipping the switch on schedule as the chief engineer (wmiprvse.exe or scrcons.exe spawning the payload as NT AUTHORITY\\SYSTEM, logged by Sysmon EventID 1).',
    ],
  },
  'dfir-bitsadmin-qmgr-persistence-bits-client': {
    advisory:
      'Microsoft BITS Operational Logging Documentation, Mandiant qmgr.db Forensics & MITRE ATT&CK T1197',
    briefingAnalogy:
      'Imagine scheduling a recurring courier pickup with the corporate mailroom (Windows Background Intelligent Transfer Service) and attaching a standing instruction (/SetNotifyCmdLine) that forces the mailroom clerk (svchost.exe) to open and run whatever package arrives.',
    stepAnalogies: [
      'Think of opening a persistent shipping ticket in the corporate mailroom ledger (creating a BITS download job via bitsadmin.exe, recorded in Microsoft-Windows-Bits-Client/Operational EventID 3 and 59).',
      'Think of writing a permanent callback instruction into the mailroom database so a program runs whenever the parcel lands (configuring SetNotifyCmdLine serialized into C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db).',
      'Think of the mailroom clerk completing the delivery and immediately launching the attached program under system authority (Bits-Client EventID 60 followed by svchost.exe -k netsvcs -s BITS spawning regsvr32.exe).',
    ],
  },
  'dfir-schtasks-xml-registry-taskcache-forensics': {
    advisory:
      'Microsoft MSTIC Tarrask Research, Microsoft Security Auditing EventID 4698 & SANS DFIR Windows Forensics',
    briefingAnalogy:
      'Imagine adding a recurring job to the factory master wall calendar (Scheduled Tasks) and then erasing its entry from the public index board (deleting the TaskCache\\Tree SD Security Descriptor value) while leaving the internal clockwork gear (TaskCache\\Tasks\\{GUID}) spinning.',
    stepAnalogies: [
      'Think of registering a new recurring shift on the factory master schedule (creating a SYSTEM scheduled task that logs Security EventID 4698 with the full XML payload and writes the task file under C:\\Windows\\System32\\Tasks\\).',
      'Think of using master janitor keys to peel the label off the public schedule board so inspectors cannot list it (elevating to SYSTEM and deleting the SD registry value under Schedule\\TaskCache\\Tree\\, captured by Sysmon EventID 12).',
      'Think of forensic auditors opening the internal gearbox to find the hidden cog still firing every 15 minutes (correlating TaskScheduler EventID 200 with the intact binary Actions blob inside Schedule\\TaskCache\\Tasks\\{GUID}).',
    ],
  },
  'dfir-rdp-lateral-movement-tsclient-bitmap-cache': {
    advisory:
      'SANS DFIR Windows RDP Forensics Poster, ANSSI BMC-Tools Research & Microsoft TerminalServices Event Log Docs',
    briefingAnalogy:
      'Imagine an intruder remote-controlling a server from a hallway kiosk (mstsc.exe): not only do both doors log the badge swipe (RDPClient 1024 and LocalSessionManager 21/25), but the hallway kiosk silently saves 64x64 puzzle pieces of every screen frame (Cache0000.bin) on its own hard drive.',
    stepAnalogies: [
      'Think of the hallway kiosk recording which remote room number it dialed in its speed-dial list (mstsc.exe logging TerminalServices-RDPClient EventID 1024/1102 and writing the target IP and UsernameHint into NTUSER.DAT).',
      'Think of the destination room logging the remote visitor arrival and any subsequent session reconnections (RdpCoreTS EventID 131, Security EventID 4624 Type 10/7, and LocalSessionManager EventID 21, 24, and 25).',
      'Think of reassembling thousands of cached 64x64 screen puzzle tiles saved on the kiosk to see what the intruder typed (carving %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin with ANSSI bmc-tools).',
    ],
  },
  'dfir-smb-psexec-named-pipe-eid5145-7045': {
    advisory:
      'CISA Joint Advisory AA23-165A, Microsoft Security Auditing EventID 5145 / System EventID 7045 & SigmaHQ',
    briefingAnalogy:
      'Imagine dropping a temporary robot worker (PSEXESVC.exe) through a server delivery chute (ADMIN$ share), registering it with the building supervisor (Service Control Manager EventID 7045), and speaking to it through dedicated intercom tubes (named pipes -stdin/-stdout/-stderr).',
    stepAnalogies: [
      'Think of sliding the service binary through the administrative loading dock and dialing the supervisor extension (writing PSEXESVC.exe to \\\\*\\ADMIN$ and accessing \\\\*\\IPC$\\svcctl, logged by Security EventID 5145).',
      'Think of the building supervisor logging the installation of a brand-new LocalSystem service (services.exe recording System EventID 7045 and Security EventID 4697 for %SystemRoot%\\PSEXESVC.exe).',
      'Think of the robot worker opening three labeled intercom pipes that give away its true identity even if its uniform was renamed (Sysmon EventID 17 and 18 capturing \\PSEXESVC-<Host>-<PID>-stdin, -stdout, and -stderr).',
    ],
  },
  'dfir-evtx-log-clearing-wevtutil-eid1102-104': {
    advisory:
      'NIST SP 800-86 DFIR Guide, Microsoft Security EventID 1102 / System EventID 104 Specification & SANS Windows Forensics',
    briefingAnalogy:
      'Imagine an intruder shredding the security desk visitor logbook (wevtutil cl Security), only for the shredder to automatically stamp a bright red receipt ("Logbook shredded by badge #1104 at 03:55", EventID 1102) onto page 1 of the new book while shredded pages remain recoverable in the bin (NTFS $UsnJrnl:$J and unallocated ElfChnk clusters).',
    stepAnalogies: [
      'Think of the intruder feeding every log channel into the shredder command loop (running wevtutil.exe cl across channels, which real-time SIEM forwarding captures via Sysmon EventID 1 prior to truncation).',
      'Think of the Windows EventLog service immediately stamping an indelible audit-cleared notice into the fresh file (writing Security EventID 1102 and System EventID 104 with the SubjectUserSid of the account that cleared the log).',
      'Think of forensic investigators inspecting the building master ledger of file size changes and pulling intact pages out of the wastebasket (correlating USN_REASON_DATA_TRUNCATION in $UsnJrnl:$J and carving 64KB ElfChnk chunks from unallocated disk space).',
    ],
  },
  'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2': {
    advisory:
      'SANS FOR508 NTFS Master File Table ($MFT) Analysis, Microsoft Sysinternals Sysmon EventID 2 & MITRE ATT&CK T1070.006',
    briefingAnalogy:
      'Imagine a counterfeiter backdating the ink date printed on the front of a newly forged passport ($STANDARD_INFORMATION attribute 0x10) to 2022, while the government immigration vault ($FILE_NAME attribute 0x30) and the security camera (Sysmon EventID 2) still record the exact nanosecond it was printed today.',
    stepAnalogies: [
      'Think of the passport office minting a new document and stamping the true nanosecond creation time in two separate registry books (Ntfs.sys populating both $STANDARD_INFORMATION 0x10 and $FILE_NAME 0x30 in the $MFT record).',
      'Think of the counterfeiter calling a user-mode API to roll back the public date stamp while a tripwire photographs both the old and new dates (NtSetInformationFile triggering Sysmon EventID 2 with Forged CreationUtcTime vs True PreviousCreationUtcTime).',
      'Think of a forensic examiner comparing the two ledger books side-by-side and spotting that the public date is four years earlier than the kernel-locked date with all nanoseconds zeroed out (MFTECmd revealing Created0x10 < Created0x30 and uSecZeros=True).',
    ],
  },
};

const VULNCHECK_CWP_STEP_GUIDE: RawScenarioStepGuideData = {
  scenarioId: 'vulncheck-cwp-preauth-module-dispatch-rce',
  briefing: {
    headline:
      'Scenario Briefing: How the 10-CVE Control Web Panel (CWP2Shell) Chain Pivots from Pre-Auth Execution After Redirect to Root RCE',
    storyAnalogy:
      'Imagine a multi-tenant apartment building (Control Web Panel port 2083) where the front-desk guard (CWPUserIndex::__construct) tells unauthenticated visitors "Please go to the lobby login desk" (emitting an HTTP 302 Location header, CVE-2026-73696) but forgets to actually lock the inner hallway door (omitting exit()). The visitor walks straight past the desk into any tenant suite (include_once modules/$module.php, CVE-2026-73695), uses the suite maintenance panel (phpini_editor.php, CVE-2026-73697) to run commands as that tenant, and then picks up the building internal house phone (loopback API 127.0.0.1:2302, CVE-2026-77877 & CVE-2026-77878) which executes every request as the building master superintendent (root uid=0).',
    plainSummary:
      'Disclosed by VulnCheck in November 2026 ("Control Web Panel: Pre-Auth Module Dispatch to Root RCE"), this 10-CVE chain compromises Control Web Panel (CWP) instances in two network hops. First, an unauthenticated attacker enumerates a valid hosting username via an HTTP 302 vs 404 oracle on port 2083 and exploits an Execution After Redirect (EAR) flaw in UnauthenticatedFlowTrait::toLoginWithIntendedUri() (CVE-2026-73696) combined with unvalidated module LFI in services/users/index.php (CVE-2026-73695) to reach any of the 170+ user modules without a session. Second, the attacker triggers pre-auth file write or command injection in modules/phpini_editor.php (CVE-2026-73697) or modules/protected_directory.php (CVE-2026-77876) as the hosting user, and immediately relays a loopback request to the root-privileged Slim v2 User API on 127.0.0.1:2302 (/v1/restoredatabase/ CVE-2026-77877 & CVE-2026-77878, /valid_token/ CVE-2026-104080, or OAuth SQLi CVE-2026-77879 + /v1/newpass/ CVE-2026-77880) to achieve unauthenticated root RCE.',
    diagramTopologySummary:
      'The topology traces 4 sequential stages across Node ① (External Attacker on port 2083), Node ② (cwpsrv Nginx reverse proxy), Node ③ (per-user cwp-phpfpm pool running as uid=1000 labtest), Node ④ (pre-auth module sink in phpini_editor.php), Node ⑤ (Loopback User API on 127.0.0.1:2302 running as uid=0 root & MySQL root@localhost), and Node ⑥ (Linux Auditd & cwpsrv SIEM sensor).',
    documentedAdvisory:
      'VulnCheck Research Advisory (Nov 3, 2026): CVE-2026-73695, CVE-2026-73696, CVE-2026-73697, CVE-2026-77876, CVE-2026-77877, CVE-2026-77878, CVE-2026-77879, CVE-2026-77880, CVE-2026-77881 & CVE-2026-104080',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1190',
      plainTitle:
        'Account Enumeration Oracle, Execution After Redirect (CVE-2026-73696) & Module LFI (CVE-2026-73695)',
      storyAnalogy:
        'Think of ringing apartment buzzers until one clicks (GET /labtest/ returning 302 instead of 404), and then walking past a receptionist who hands you a "Redirect to Login" slip (header Location: /login/) but never blocks you from walking into the back office (missing exit() before include_once).',
      simpleExplanation:
        'On port 2083, cwpsrv (nginx) routes requests matching https://host:2083/<username>/ to a dedicated per-user PHP-FPM Unix socket (returning HTTP 302 Found when the hosting account exists and HTTP 404 Not Found when the socket is absent, giving attackers a free pre-auth username oracle). When an unauthenticated caller requests /labtest/index.php?module=..., CWPUserIndex::__construct() invokes unauthenticatedFlow() and UnauthenticatedFlowTrait::toLoginWithIntendedUri() (which emits header Location: /login/?intended=... without calling exit() under CVE-2026-73696, allowing PHP execution to fall straight through to the file-scope module dispatcher). At file scope, services/users/index.php reads CWPHttpRequest::get(module) through an anti-XSS filter that leaves ../, /, and . intact and executes include_once /usr/local/cwpsrv/var/services/user_files/modules/ . $module_name . .php (bypassing setModuleVars() and checkIfModuleExists() under CVE-2026-73695 so any user module or relative .php path on disk is included pre-authentication).',
      howItWorksInPractice:
        'In the admin panel on port 2031, CWP correctly calls header(Location: /login) followed immediately by exit(), whereas the refactored user panel on port 2083 omitted exit() in UnauthenticatedFlowTrait::toLoginWithIntendedUri() and omitted checkIfModuleExists() before include_once (meaning every single HTTP request to /<valid_user>/index.php?module=<target> executes the target module inside the hosting account PHP-FPM pool before PHP flushes the cosmetic 302 redirect response).',
      diagramAlignment:
        'On the diagram, follow Step #1 / Link #1 from Node ① (External Attacker) through Node ② (cwpsrv Nginx :2083) to Node ③ (cwp-phpfpm Pool uid=1000).',
      detectionAndEvidence:
        'Inspect /usr/local/cwpsrv/logs/access_log for HTTP 302 responses on POST or GET requests to /<user>/index.php?module=... that contain a Location: /login/?intended= header alongside non-zero response bodies or module query parameters (indicating pre-auth Execution After Redirect exploitation of CVE-2026-73696 and CVE-2026-73695).',
    },
    {
      stepNumber: 2,
      mitreId: 'T1059.004',
      plainTitle:
        'Pre-Auth Hosting User RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876)',
      storyAnalogy:
        'Once inside the tenant suite without a key, the intruder uses two unguarded maintenance tools on the wall: a configuration notepad that saves custom text to any file path on the machine (acc=update file_put_contents) and a file-cleanup button that passes unquoted filenames straight to a system shell (acc=addlabelphpiniadv shell_exec rm -f).',
      simpleExplanation:
        'Because modules/phpini_editor.php executes at file scope as soon as it is included by Stage 1, an unauthenticated attacker reaches two pre-auth sinks running as the hosting user uid=1000(labtest) under CVE-2026-73697 (first, acc=update reads $_POST[file] without path validation and writes <title>=<value> lines via file_put_contents, allowing the attacker to split a quote-free PHP payload across title=<?php system($_GET[c]);//,x and value= ?>,y into /tmp/evilmod.php and execute it in-band via module=../../../../../../../tmp/evilmod&c=id; second, acc=addlabelphpiniadv reads $_POST[hfilename] via trim() and passes it unquoted into shell_exec(rm -f  . $hfilename)). In addition, modules/protected_directory.php exposes a third pre-auth command injection sink under CVE-2026-77876 (where acc=deletedp interpolates unescaped $_POST[file] into shell_exec(sed -i ...  . $_POST[file] . .htaccess)).',
      howItWorksInPractice:
        'Even though CWPHttpRequest strips single and double quotes from $_POST parameters, splitting <?php system($_GET[c]);// and ?> across the title and value arrays in phpini_editor.php acc=update requires zero quotes, and shell_exec(rm -f  . $hfilename) in acc=addlabelphpiniadv is already unquoted (allowing semicolon command chaining such as hfilename=x ; <command> ; echo to execute arbitrary bash commands as uid=1000 in a single POST request).',
      diagramAlignment:
        'On the diagram, follow Step #2 / Link #2 from Node ② (cwpsrv Nginx :2083) and Node ③ (cwp-phpfpm Pool) into Node ④ (phpini_editor.php Sink).',
      detectionAndEvidence:
        'Correlate cwpsrv access logs showing POST /<user>/index.php?module=phpini_editor&acc=update or acc=addlabelphpiniadv (and module=protected_directory&acc=deletedp) with Linux auditd SYSCALL execve records (syscall=59) where parent comm="php-fpm" (running under a hosting account UID >= 1000) spawns /bin/sh -c "rm -f ..." or writes .php files into /tmp/.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1068',
      plainTitle:
        'Loopback User API 127.0.0.1:2302 Missing Auth (CVE-2026-77877) to Root Command Injection (CVE-2026-77878 & CVE-2026-104080)',
      storyAnalogy:
        'From the tenant apartment, the intruder picks up the internal building intercom wired to 127.0.0.1:2302: because the superintendent assumed only trusted scripts could dial that internal extension, several buttons require no passcode at all (CVE-2026-77877) and run every request directly as root (uid=0).',
      simpleExplanation:
        'Control Web Panel runs an internal Slim v2 User API bound to https://127.0.0.1:2302 whose PHP-FPM pool executes as root (uid=0) rather than the hosting user. In services/user_api/v1/app/routes/api.php, multiple sensitive routes omit the access_token() middleware entirely (tracked as CVE-2026-77877, CWE-306 Missing Authentication for Critical Function). From the Stage 2 command injection, the attacker issues a single loopback curl request to https://127.0.0.1:2302/v1/restoredatabase/ passing file=/dev/null ; <root-command> ; echo (which BackupHandler::restoreDBBackup() in includes/backup_handler.php concatenates directly into shell_exec(mysql --defaults-extra-file=/root/.my.cnf <  . $file .  > /dev/null 2>&1 &) as uid=0 root under CVE-2026-77878). A second tokenless route on the same loopback service, /valid_token/, passes raw POST user into shell_exec(grep -c  . $user . : /etc/passwd) as root (giving a second independent one-shot root command injection primitive under CVE-2026-104080).',
      howItWorksInPractice:
        'Because Stage 2 (CVE-2026-73697) can invoke curl directly inside its hfilename command injection payload, the entire unauthenticated remote-to-root chain completes in a single external HTTP POST to port 2083 (which spawns sh as uid=1000, relays POST /v1/restoredatabase/ to 127.0.0.1:2302, and executes the injected shell pipeline as uid=0(root) gid=0(root)).',
      diagramAlignment:
        'On the diagram, follow Step #3 / Link #3 from Node ③ (cwp-phpfpm Pool uid=1000) to Node ⑤ (Loopback User API 127.0.0.1:2302 running as root).',
      detectionAndEvidence:
        'Monitor Linux auditd execve (syscall=59) events where uid=0 and euid=0 spawn /bin/sh -c "mysql --defaults-extra-file=/root/.my.cnf < ..." or "grep -c ... /etc/passwd" with shell metacharacters (; or |), and inspect loopback traffic or PHP-FPM slow/error logs for requests to 127.0.0.1:2302/v1/restoredatabase/ and /valid_token/.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1552.001',
      plainTitle:
        'OAuth Gate SQLi Bypass as root@localhost (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)',
      storyAnalogy:
        'Even on the loopback intercom buttons that do ask for a security token, the intercom checks the token by pasting the caller raw words into a master database query running as the database superuser (MySQL root@localhost), letting the caller forge a fake 2099 expiration pass (UNION SELECT) and unlock the root password-reset machine (/v1/newpass/).',
      simpleExplanation:
        'For routes on 127.0.0.1:2302 that do invoke the access_token() middleware in services/user_api/v1/index.php, the function connects to MySQL using /root/.my.cnf (root@localhost) and concatenates raw POST fields into SELECT * FROM oauth_authorization_codes WHERE authorization_code = $access_token AND client_id = $user (enabling an unquoted UNION SELECT SQL injection under CVE-2026-77879 where supplying access_token=\' UNION SELECT \'a\',\'x\',\'c\',\'d\',\'2099-01-01 00:00:00\',\'f\' -- - fabricates a 6-column row whose 5th column expires lies in the future, bypassing authentication on every token-gated route). With the gate bypassed, the attacker reaches /v1/newpass/, which validates password complexity on $pass but interpolates raw $user directly into shell_exec(( echo $pass; echo $pass ) | /usr/bin/passwd  . $user) as root (achieving root RCE via user=z;id;true under CVE-2026-77880). Furthermore, the tokenless /user_panel_dashboard/ and /valid_token/ routes concatenate $user into SELECT * FROM oauth_clients WHERE client_id="$user" as root@localhost (exposing time-based blind SQLi over root_cwp and mysql.user under CVE-2026-77881).',
      howItWorksInPractice:
        'As documented in VulnCheck IonCube bytecode recovery (using icunpack across CWP patches 1.8 through 1.30), CWP initially patched only filemanager for CVE-2025-48703 in August 2026 while leaving the EAR flaw, module dispatcher, and loopback root API untouched until the incremental September–November 2026 patches (1.12, 1.16, 1.23, 1.27, 1.29, and 1.30) added exit(), basename/realpath module confinement, prepared statements, cwp_clean_username(), and cwp_api_as_user() privilege dropping.',
      diagramAlignment:
        'On the diagram, follow Step #4 / Link #4 between Node ⑤ (Loopback User API 127.0.0.1:2302 & MySQL root@localhost) and Node ⑥ (Linux Auditd & SIEM Sensor).',
      detectionAndEvidence:
        'Audit MySQL general/slow query logs for UNION SELECT against oauth_authorization_codes or SLEEP() subqueries against oauth_clients from root@localhost, and verify CWP is updated to build 0.9.8.1213+ / patch 1.30 (confirming cwp_api_as_user and prepared statements are present in /usr/local/cwpsrv/var/services/user_api/v1/).',
    },
  ],
};

function cleanForStepGuide(raw: string): string {
  return (raw || '')
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*—\s*/g, ', ')
    .replace(/WHY\s*\/\s*(?:SPEC|PROTOCOL\s*EFFECT)\s*:?\s*/gi, '')
    .replace(/\(\s*why\s*:/gi, '(because ')
    .trim();
}

function buildOfficialDfirStepGuide(
  draft: LegacyDraftScenario
): RawScenarioStepGuideData {
  if (draft.id === 'vulncheck-cwp-preauth-module-dispatch-rce') {
    return VULNCHECK_CWP_STEP_GUIDE;
  }

  const customMeta = CUSTOM_DFIR_NARRATIVE_META[draft.id];
  const mitreCode = draft.mitreId || 'T1003';
  const cleanTitle = cleanForStepGuide(draft.title);
  const cleanDesc = cleanForStepGuide(draft.description);
  const nodes = draft.NodesGenerator ? draft.NodesGenerator() : [];
  const n1 = cleanForStepGuide(nodes[0]?.label || 'Origin Host');
  const n2 = cleanForStepGuide(nodes[1]?.label || 'Telemetry Gateway');
  const n3 = cleanForStepGuide(nodes[2]?.label || 'Target System');
  const n4 = cleanForStepGuide(nodes[3]?.label || 'SIEM & DFIR Sensor');
  const n5 = cleanForStepGuide(nodes[4]?.label || 'Forensic Artifact Store');

  const briefingAnalogy =
    customMeta?.briefingAnalogy ||
    `Imagine a high-security facility where an intruder attempts to operate covertly across ${n1}, ${n2}, and ${n3}, unaware that every system call, protocol handshake, and on-disk structural table (${n5}) automatically records an immutable forensic ledger entry correlated by ${n4}.`;

  const advisoryText =
    customMeta?.advisory ||
    `Official Vendor & CERT DFIR Documentation (${mitreCode}) · ${cleanTitle}`;

  return {
    scenarioId: draft.id,
    briefing: {
      headline: `Scenario Briefing: Official DFIR & Log Forensics Guide for ${cleanTitle}`,
      storyAnalogy: briefingAnalogy,
      plainSummary: `${cleanDesc} Across this ${draft.stages.length}-step forensic reconstruction, incident responders correlate primary host, kernel, identity, and network telemetry (capturing exact Event IDs, syscall numbers, registry/filesystem structures, and protocol fields so defenders can verify root cause and scope compromise with high confidence).`,
      diagramTopologySummary: `The forensic topology spans Node ① (${n1}), Node ② (${n2}), Node ③ (${n3}), Node ④ (Runtime Process & Artifact Context), Node ⑤ (${n5}), and Node ⑥ (${n4}) across ${draft.stages.length} chronological steps (#1 to #${draft.stages.length}).`,
      documentedAdvisory: advisoryText,
    },
    steps: draft.stages.map((stage, idx) => {
      const stepNo = stage.id || idx + 1;
      const stageMitre =
        (stage.mitreTactic || '').match(/T\d{4}(?:\.\d{3})?/)?.[0] || mitreCode;
      const cleanStageTitle = cleanForStepGuide(
        stage.title.replace(/^Stage\s+\d+:\s*/i, '')
      );
      const cleanNarration = cleanForStepGuide(stage.narration).replace(
        /\.+\s*$/,
        ''
      );
      const log = stage.logs?.[0];
      const cmd0 = cleanForStepGuide(
        stage.technicalCommands?.[0] || log?.CommandLine || cleanStageTitle
      );
      const rawStageCommands =
        stage.technicalCommands && stage.technicalCommands.length > 0
          ? stage.technicalCommands
          : [log?.CommandLine || cmd0];
      const commandNarratives = rawStageCommands
        .map((rawCmd, cIdx) => {
          const cleanCmd = cleanForStepGuide(rawCmd);
          const explained = explainCommandLine(cleanCmd, {
            termLabel: `COMMAND ${cIdx + 1}`,
            stageTitle: cleanStageTitle,
            stageDescription: cleanNarration,
            mitreId: stageMitre,
            scenarioName: cleanTitle,
          });
          const meaningClean = cleanForStepGuide(explained.whatItMeans).replace(
            /\.+\s*$/,
            ''
          );
          const purposeClean = cleanForStepGuide(
            explained.exactPurpose
          ).replace(/\.+\s*$/, '');
          return `Command #${cIdx + 1} executes ${cleanCmd}, where ${meaningClean} (exact tactical and forensic purpose: ${purposeClean}).`;
        })
        .join(' ');
      const mitigation = cleanForStepGuide(
        stage.defenseMitigation ||
          'Enforce centralized telemetry forwarding and correlate multi-source forensic artifacts.'
      ).replace(/\.+\s*$/, '');
      const parsedSummary = Object.entries(log?.parsedFields || {})
        .map(([k, v]) => `${k}=${cleanForStepGuide(v)}`)
        .join(', ');

      const stepAnalogy =
        customMeta?.stepAnalogies?.[idx] ||
        `Think of Step #${stepNo} as a forensic checkpoint where the action "${cleanStageTitle}" leaves a permanent, verifiable signature in the system audit trail (${log?.source || 'Telemetry'} Event ${log?.EventCode ?? stageMitre}) even if surface indicators are disguised.`;

      return {
        stepNumber: stepNo,
        mitreId: stageMitre,
        plainTitle: cleanStageTitle,
        storyAnalogy: stepAnalogy,
        simpleExplanation: `${cleanNarration} (specifically recording ${parsedSummary || cmd0} inside the ${log?.source || 'system'} telemetry stream so DFIR investigators can attribute the exact process, principal, and timestamp).`,
        howItWorksInPractice: commandNarratives,
        diagramAlignment: `On the diagram, follow Step #${stepNo} / Link #${stepNo} across the topology from ${n1} and ${n2} toward ${n3} and ${n4}.`,
        detectionAndEvidence: `${mitigation} (correlating ${log?.source || 'SIEM'} EventCode ${log?.EventCode ?? stageMitre} and ${parsedSummary || cmd0} to confirm the forensic indicator).`,
      };
    }),
  };
}

export const VULNCHECK_CWP_AND_DFIR_STEP_GUIDES: Record<
  string,
  RawScenarioStepGuideData
> = Object.fromEntries(
  ALL_NEW_DFIR_AND_CWP_DRAFTS.map((draft) => [
    draft.id,
    buildOfficialDfirStepGuide(draft),
  ])
);
