import type { RawScenarioStepGuideData } from '../scenario-step-guides';
import type { LegacyDraftScenario } from '../scenarios/normalize-legacy-draft-scenario';
import { explainCommandLine } from '../command-line-explanations';
import { VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS } from '../scenarios/vulncheck-cwp-and-dfir-batch1';
import { DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS } from '../scenarios/dfir-official-batch2-windows-artifacts';
import { DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS } from '../scenarios/dfir-official-batch3-linux-cloud-containers';
import { DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS } from '../scenarios/dfir-official-batch4-network-appliances-memory';
import { OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS } from '../scenarios/official-batch5-specialized-categories';
import { OFFICIAL_BATCH6_RANSOMWARE_SUPPLYCHAIN_CLR_SCENARIOS } from '../scenarios/official-batch6-ransomware-supplychain-clr';
import { OFFICIAL_BATCH7_CLOUD_AND_CONTAINERS_SCENARIOS } from '../scenarios/official-batch7-cloud-and-containers';
import { OFFICIAL_BATCH8_SPECIALIZED_EXPANSION_SCENARIOS } from '../scenarios/official-batch8-specialized-expansion';

const ALL_NEW_DFIR_AND_CWP_DRAFTS: LegacyDraftScenario[] = [
  ...VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS,
  ...OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS,
  ...OFFICIAL_BATCH6_RANSOMWARE_SUPPLYCHAIN_CLR_SCENARIOS,
  ...OFFICIAL_BATCH7_CLOUD_AND_CONTAINERS_SCENARIOS,
  ...OFFICIAL_BATCH8_SPECIALIZED_EXPANSION_SCENARIOS,
];

interface CustomScenarioNarrativeMeta {
  advisory: string;
  briefingAnalogy: string;
  stepAnalogies: [string, string, string];
}

const CUSTOM_DFIR_NARRATIVE_META: Record<string, CustomScenarioNarrativeMeta> = {
  'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr': {
    advisory:
      'Jeffrey Appel Security Research ("ARTEX: Old Attacks at Machine Speed, and how Microsoft Defender keeps up"), Microsoft Threat Intelligence (Storm-0940 & Defender XDR Automatic Attack Disruption) & MITRE ATT&CK T1110.003 / T1558.003 / T1552.004',
    briefingAnalogy:
      'Imagine a bank heist crew that replaces slow human lockpickers with a coordinated swarm of high-speed robotic arms (the ARTEX Go + Next.js LLM Planner-Worker framework): instead of inventing a brand-new laser cutter, the master robot (LLM Planner) dispatches 8 worker robots that test every door handle (nmap/curl + Storm-0940 password spray), prop open a side window (web shell + RC4 Kerberoasting), and empty the upstairs safe (Azure Key Vault SecretGet) in under 15 minutes, forcing the building security system (Microsoft Defender XDR) to slam down steel blast doors automatically (Automatic Attack Disruption) because waiting for a human guard to read the alarm log would be too late.',
    stepAnalogies: [
      'Think of a central AI dispatcher (artex-server Go Planner) handing out parallel checklists to robotic scouts (Worker agents running nmap -sV, curl, and Storm-0940 low-and-slow OAuth2 password sprays) so the moment one password clicks open, the next robot is already in motion.',
      'Think of the second robot immediately wedging open a service door (dropping an ASPX web shell under w3wp.exe) and requesting a downgraded RC4 ticket voucher (EventID 4769 etype 0x17) within 8 minutes, compressing what used to take human hackers days of manual typing into seconds.',
      'Think of the cloud robot sprinting straight to the master key vault (Azure Key Vault SecretGet) within 5 minutes, only for the building automated defense grid (Microsoft Defender XDR KQL multi-alert burst correlation + Automatic Attack Disruption) to spot 3+ alarms on the same badge in a 15-minute window, isolate the machine (sense.exe), and shred the badge (Entra ID session revocation).',
    ],
  },
  'pikered-clr-profiler-trusted-binary-loader-chain': {
    advisory:
      'PikeRed Security Research ("Abusing the CLR Profiler: A Trusted-Binary Loader Chain for Initial Access"), Microsoft .NET Unmanaged Profiling API Specification & MITRE ATT&CK T1574.012',
    briefingAnalogy:
      'Imagine shipping a locked virtual cargo container (.vhdx) so individual items inside bypass the customs stamp (Mark-of-the-Web Zone.Identifier), hiding the real engine parts behind a false wall (attrib +h +s), and setting an official diagnostic inspection flag (COR_ENABLE_PROFILING=1 and COR_PROFILER_PATH) before starting a trusted, digitally signed vehicle (KeePass.exe) so the vehicle own runtime engine (clr.dll) automatically bolts on and executes the attacker custom module (PerformanceTrace.dll).',
    stepAnalogies: [
      'Think of mounting a sealed virtual shipping crate (.vhdx) where only the outer crate has a customs tag, so the shortcut inside runs without SmartScreen warnings while real binaries stay invisible behind super-hidden OS flags (+h +s).',
      'Think of writing diagnostic override instructions onto the workshop clipboard (process environment block COR_ENABLE_PROFILING=1, COR_PROFILER, COR_PROFILER_PATH) right before launching a trusted, signed .NET application (KeePass.exe).',
      'Think of the .NET engine (mscoree.dll and clr.dll) obediently reading that clipboard at startup, loading the attacker unmanaged DLL without touching the Windows Registry, and running its Initialize() callback inside the signed process.',
    ],
  },
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
      'Imagine a multi-tenant apartment building where the front-desk guard tells unauthenticated visitors to go to the lobby login desk but forgets to lock the inner hallway door. The visitor walks straight past the desk into any tenant suite, uses the suite maintenance panel to run commands as that tenant, and then picks up the building\'s internal house phone which executes every request as the building master superintendent.',
    plainSummary:
      'Disclosed by VulnCheck in November 2026 ("Control Web Panel: Pre-Auth Module Dispatch to Root RCE"), this 10-CVE chain compromises Control Web Panel on TCP port 2083 in two network hops. First, an unauthenticated attacker enumerates a valid hosting username via an HTTP 302 vs 404 oracle and exploits an Execution After Redirect flaw in UnauthenticatedFlowTrait::toLoginWithIntendedUri (CVE-2026-73696, which emits a redirect header without calling exit so PHP continues executing) combined with unvalidated module inclusion in services/users/index.php (CVE-2026-73695, letting callers load any of 170+ user modules without a session). Second, the attacker triggers pre-auth file write or command injection in modules/phpini_editor.php (CVE-2026-73697) or modules/protected_directory.php (CVE-2026-77876) as the hosting user, then relays a loopback request to the root-privileged Slim v2 User API on 127.0.0.1:2302 (abusing missing authentication under CVE-2026-77877 and root command injection under CVE-2026-77878, CVE-2026-104080, or OAuth SQLi CVE-2026-77879 plus CVE-2026-77880) for full root code execution.',
    diagramTopologySummary:
      'The topology traces 4 sequential stages across Node ① (External Attacker on port 2083), Node ② (cwpsrv Nginx reverse proxy), Node ③ (per-user cwp-phpfpm pool running as uid=1000 labtest), Node ④ (pre-auth module sink in phpini_editor.php), Node ⑤ (Loopback User API on 127.0.0.1:2302 running as uid=0 root and MySQL root@localhost), and Node ⑥ (Linux Auditd and cwpsrv SIEM sensor).',
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
        'The intruder rings apartment buzzers until one clicks open, then walks right past a receptionist who hands out a redirect slip to the lobby without ever locking the inner hallway door behind the desk.',
      simpleExplanation:
        'On port 2083, cwpsrv routes requests matching https://host:2083/<username>/ to a dedicated per-user PHP-FPM Unix socket (returning HTTP 302 Found when the hosting account exists and HTTP 404 Not Found when the socket is absent, giving attackers a pre-auth username oracle). When an unauthenticated caller requests /labtest/index.php?module=..., CWPUserIndex::__construct invokes unauthenticatedFlow and UnauthenticatedFlowTrait::toLoginWithIntendedUri (which emits header Location: /login/?intended=... without calling exit under CVE-2026-73696, letting PHP execution fall straight through to the file-scope module dispatcher). At file scope, services/users/index.php reads CWPHttpRequest::get(module) through an anti-XSS filter that leaves ../, /, and . intact and executes include_once on /usr/local/cwpsrv/var/services/user_files/modules/$module_name.php (bypassing setModuleVars and checkIfModuleExists under CVE-2026-73695 so any user module or relative PHP file on disk is included without authentication).',
      howItWorksInPractice:
        'In the admin panel on port 2031, CWP calls header Location: /login followed immediately by exit (halting execution before any protected code loads), whereas the refactored user panel on port 2083 omitted exit inside UnauthenticatedFlowTrait::toLoginWithIntendedUri and omitted checkIfModuleExists before include_once (meaning every HTTP request to /<valid_user>/index.php?module=<target> executes the target module inside the hosting account\'s PHP-FPM pool before PHP flushes the cosmetic 302 redirect response).',
      diagramAlignment:
        'On the diagram, follow Step #1 / Link #1 from Node ① (External Attacker) through Node ② (cwpsrv Nginx :2083) to Node ③ (cwp-phpfpm Pool uid=1000).',
      detectionAndEvidence:
        'Inspect /usr/local/cwpsrv/logs/access_log (the CWP Nginx web access log recording every port 2083 request and response size) for HTTP 302 responses on POST or GET requests to /<user>/index.php?module=... that contain non-zero response bodies or module query parameters, indicating pre-auth Execution After Redirect exploitation of CVE-2026-73696 and CVE-2026-73695.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1059.004',
      plainTitle:
        'Pre-Auth Hosting User RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876)',
      storyAnalogy:
        'Once inside the tenant suite without a key, the intruder uses two unguarded maintenance tools on the wall: first, a configuration notepad that saves custom text to any file path in the building, and second, a file-cleanup button that passes raw labels straight into the building\'s workshop command line.',
      simpleExplanation:
        'Because modules/phpini_editor.php executes at file scope as soon as Stage 1 includes it, an unauthenticated attacker reaches two pre-auth sinks running as hosting user uid=1000 under CVE-2026-73697: first, acc=update reads $_POST[file] without path validation and writes title=value lines via file_put_contents (allowing a quote-free PHP payload to be split across title and value parameters into /tmp/evilmod.php and executed in-band via module path traversal), and second, acc=addlabelphpiniadv reads $_POST[hfilename] via trim and passes it unquoted into shell_exec rm -f (allowing semicolon command injection as the hosting user). In addition, modules/protected_directory.php exposes a third pre-auth command injection sink under CVE-2026-77876 (where acc=deletedp interpolates unescaped $_POST[file] directly into a shell_exec sed command targeting .htaccess).',
      howItWorksInPractice:
        'Even though CWPHttpRequest strips single and double quotes from POST parameters (attempting to neutralize basic string breakouts), splitting PHP open and close tags across the title and value arrays in phpini_editor.php acc=update requires zero quotes, and the shell_exec rm -f sink in acc=addlabelphpiniadv leaves $hfilename completely unquoted (letting semicolon chaining such as hfilename=x ; id ; echo run arbitrary commands as uid=1000 in a single POST request).',
      diagramAlignment:
        'On the diagram, follow Step #2 / Link #2 from Node ② (cwpsrv Nginx :2083) and Node ③ (cwp-phpfpm Pool) into Node ④ (phpini_editor.php Sink).',
      detectionAndEvidence:
        'Correlate cwpsrv access logs showing POST /<user>/index.php?module=phpini_editor&acc=update or acc=addlabelphpiniadv with Linux auditd SYSCALL execve records (syscall 59 capturing every newly spawned process and its parent) where php-fpm under a hosting UID >= 1000 spawns /bin/sh running rm -f or writes .php files into /tmp/.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1068',
      plainTitle:
        'Loopback User API 127.0.0.1:2302 Missing Auth (CVE-2026-77877) to Root Command Injection (CVE-2026-77878 & CVE-2026-104080)',
      storyAnalogy:
        'From the tenant apartment, the intruder picks up the building\'s internal intercom wired to the superintendent\'s office: because the superintendent assumed only trusted staff could dial that internal line, several buttons require no passcode at all and carry out every order with full master authority.',
      simpleExplanation:
        'Control Web Panel runs an internal Slim v2 User API bound to https://127.0.0.1:2302 whose PHP-FPM pool executes as root uid=0 (granting unrestricted OS control to any request that reaches its handlers). In services/user_api/v1/app/routes/api.php, multiple sensitive routes omit the access_token middleware entirely under CVE-2026-77877 (leaving critical root endpoints callable from localhost without credentials). From the Stage 2 command injection, the attacker sends a single loopback curl request to /v1/restoredatabase/ passing a semicolon-injected file parameter (which BackupHandler::restoreDBBackup concatenates directly into a root shell_exec mysql command under CVE-2026-77878), while the tokenless /valid_token/ route passes raw POST user into a root shell_exec grep command against /etc/passwd (providing a second independent root command injection under CVE-2026-104080).',
      howItWorksInPractice:
        'Because Stage 2 under CVE-2026-73697 can invoke curl directly inside its hfilename command injection payload (bridging the external port 2083 web session to the internal 127.0.0.1:2302 listener), the entire unauthenticated remote-to-root chain completes in one external HTTP POST request (spawning /bin/sh as uid=1000, relaying POST /v1/restoredatabase/ to localhost, and executing the injected pipeline as uid=0 root).',
      diagramAlignment:
        'On the diagram, follow Step #3 / Link #3 from Node ③ (cwp-phpfpm Pool uid=1000) to Node ⑤ (Loopback User API 127.0.0.1:2302 running as root).',
      detectionAndEvidence:
        'Monitor Linux auditd execve syscall 59 events (recording every root process launch and full argument vector) where uid=0 spawns /bin/sh running mysql --defaults-extra-file=/root/.my.cnf or grep against /etc/passwd with shell metacharacters, and inspect PHP-FPM logs for loopback hits to 127.0.0.1:2302/v1/restoredatabase/ and /valid_token/.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1552.001',
      plainTitle:
        'OAuth Gate SQLi Bypass as root@localhost (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)',
      storyAnalogy:
        'Even on the internal intercom buttons that ask for a security pass, the intercom checks the pass by pasting the caller\'s raw words straight into the master ledger, letting the caller forge a fake future-dated pass and trigger the superintendent\'s password-reset machine.',
      simpleExplanation:
        'For routes on 127.0.0.1:2302 that do invoke the access_token middleware in services/user_api/v1/index.php, the function connects to MySQL using /root/.my.cnf as root@localhost and concatenates raw POST fields into SELECT * FROM oauth_authorization_codes (enabling a UNION SELECT SQL injection under CVE-2026-77879 that fabricates a 6-column row with a 2099 expiration timestamp, bypassing authentication on every token-gated route). With the gate bypassed, the attacker invokes /v1/newpass/, which validates password complexity on $pass but interpolates raw $user directly into shell_exec calling /usr/bin/passwd as root (achieving root RCE via semicolon injection in $user under CVE-2026-77880). Furthermore, /user_panel_dashboard/ and /valid_token/ concatenate $user into SELECT * FROM oauth_clients as root@localhost (exposing time-based blind SQLi over root_cwp and mysql.user under CVE-2026-77881).',
      howItWorksInPractice:
        'VulnCheck\'s IonCube bytecode analysis across CWP patches 1.8 through 1.30 (using icunpack to inspect obfuscated PHP handlers) showed that August 2026 updates patched only filemanager for CVE-2025-48703 while leaving the EAR flaw, module dispatcher, and loopback root API exposed until incremental September to November 2026 patches 1.12 through 1.30 added exit calls, basename/realpath module confinement, prepared SQL statements, cwp_clean_username, and cwp_api_as_user privilege dropping.',
      diagramAlignment:
        'On the diagram, follow Step #4 / Link #4 between Node ⑤ (Loopback User API 127.0.0.1:2302 & MySQL root@localhost) and Node ⑥ (Linux Auditd & SIEM Sensor).',
      detectionAndEvidence:
        'Audit MySQL general and slow query logs (recording every SQL statement executed by root@localhost against oauth_authorization_codes and oauth_clients) for UNION SELECT or SLEEP subqueries, and verify CWP is updated to build 0.9.8.1213+ / patch 1.30 confirming cwp_api_as_user and prepared statements are active.',
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

/**
 * Removes parentheses from a text fragment that will be embedded inside an outer
 * inline parenthetical `(...)`, preventing nested parentheses so clause parsing
 * and readability stay crisp across all scenarios.
 */
function stripParensForInnerText(text: string): string {
  return cleanForStepGuide(text)
    .replace(/\(\s*/g, ', ')
    .replace(/\s*\)/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*/, '')
    .replace(/,\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Flattens any accidental nested parentheses in top-level prose while keeping
 * top-level inline purpose parentheticals completely intact.
 */
function flattenNestedParensInProse(text: string): string {
  let out = '';
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') {
      if (depth === 0) {
        out += '(';
      } else {
        out += ', ';
      }
      depth++;
    } else if (ch === ')') {
      if (depth > 0) depth--;
      if (depth === 0) {
        out += ')';
      }
    } else {
      out += ch;
    }
  }
  return out
    .replace(/\(\s*,\s*/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
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
  const cleanDesc = flattenNestedParensInProse(
    cleanForStepGuide(draft.description)
  );
  const nodes = draft.NodesGenerator ? draft.NodesGenerator() : [];
  const n1 = cleanForStepGuide(nodes[0]?.label || 'Origin Host');
  const n2 = cleanForStepGuide(nodes[1]?.label || 'Telemetry Gateway');
  const n3 = cleanForStepGuide(nodes[2]?.label || 'Target System');
  const n4 = cleanForStepGuide(nodes[3]?.label || 'SIEM & DFIR Sensor');
  const n5 = cleanForStepGuide(nodes[4]?.label || 'Forensic Artifact Store');

  const briefingAnalogy =
    customMeta?.briefingAnalogy ||
    `Imagine a high-security facility where an intruder attempts to operate covertly across ${n1}, ${n2}, and ${n3}, unaware that every system call, protocol handshake, and on-disk structural table automatically records an immutable forensic ledger entry correlated by ${n4}.`;

  const advisoryText =
    customMeta?.advisory ||
    `Official Vendor & CERT DFIR Documentation (${mitreCode}) · ${cleanTitle}`;

  const stageLogSources = Array.from(
    new Set(
      draft.stages
        .map((st) => st.logs?.[0]?.source)
        .filter((s): s is string => Boolean(s))
    )
  );
  const stageEventCodes = Array.from(
    new Set(
      draft.stages
        .map((st) => st.logs?.[0]?.EventCode)
        .filter((c) => c !== undefined && c !== null && String(c).length > 0)
        .map((c) => String(c))
    )
  );
  const sourceList =
    stageLogSources.length > 0 ? stageLogSources.join(' and ') : 'host SIEM';
  const codeClause =
    stageEventCodes.length > 0
      ? `Event IDs ${stageEventCodes.join(', ')}`
      : `${mitreCode} indicators`;
  const hasBriefingParen = /\([^()]{20,}\)/.test(cleanDesc);
  const plainSummary = hasBriefingParen
    ? cleanDesc
    : `${cleanDesc.replace(/\.+\s*$/, '')}. Across all ${draft.stages.length} documented stages, defenders correlate ${sourceList} logs (linking ${codeClause} across ${stripParensForInnerText(n3)} and ${stripParensForInnerText(n5)} to verify root cause and scope impact).`;

  return {
    scenarioId: draft.id,
    briefing: {
      headline: `Scenario Briefing: Official DFIR & Log Forensics Guide for ${cleanTitle}`,
      storyAnalogy: briefingAnalogy,
      plainSummary: flattenNestedParensInProse(plainSummary),
      diagramTopologySummary: `The forensic topology spans Node ① (${stripParensForInnerText(n1)}), Node ② (${stripParensForInnerText(n2)}), Node ③ (${stripParensForInnerText(n3)}), Node ④ (Runtime Process & Artifact Context), Node ⑤ (${stripParensForInnerText(n5)}), and Node ⑥ (${stripParensForInnerText(n4)}) across ${draft.stages.length} chronological steps (#1 to #${draft.stages.length}).`,
      documentedAdvisory: advisoryText,
    },
    steps: draft.stages.map((stage, idx) => {
      const stepNo = stage.id || idx + 1;
      const stageMitre =
        (stage.mitreTactic || '').match(/T\d{4}(?:\.\d{3})?/)?.[0] || mitreCode;
      const cleanStageTitle = cleanForStepGuide(
        stage.title.replace(/^Stage\s+\d+:\s*/i, '')
      );
      const cleanNarration = flattenNestedParensInProse(
        cleanForStepGuide(stage.narration).replace(/\.+\s*$/, '')
      );
      const log = stage.logs?.[0];
      const logSource = cleanForStepGuide(log?.source || 'SIEM');
      const eventCode =
        log?.EventCode !== undefined && log?.EventCode !== null
          ? String(log.EventCode)
          : stageMitre;
      const cmd0 = cleanForStepGuide(
        stage.technicalCommands?.[0] || log?.CommandLine || cleanStageTitle
      );
      const rawStageCommands = (
        stage.technicalCommands && stage.technicalCommands.length > 0
          ? stage.technicalCommands
          : [log?.CommandLine || cmd0]
      ).slice(0, 2);

      const parsedEntries = Object.entries(log?.parsedFields || {}).map(
        ([k, v]) => `${k}=${stripParensForInnerText(v)}`
      );
      const parsedSummary = parsedEntries.join(', ');

      // Build clean, non-boilerplate, flat-parenthetical deep-dive explanation from stage commands & telemetry
      const commandSentences = rawStageCommands.map((rawCmd, cIdx) => {
        const cleanCmd = cleanForStepGuide(rawCmd);
        const explained = explainCommandLine(cleanCmd, {
          termLabel: `COMMAND ${cIdx + 1}`,
          stageTitle: cleanStageTitle,
          stageDescription: cleanNarration,
          mitreId: stageMitre,
          scenarioName: cleanTitle,
        });
        const meaningClean = stripParensForInnerText(explained.whatItMeans)
          .replace(/\.+\s*$/, '')
          .replace(/^(?:Executes|Invokes|Inspects or executes)\s+/i, (m) =>
            m.toLowerCase()
          );
        const purposeClean = stripParensForInnerText(explained.exactPurpose)
          .replace(/\.\.\./g, '')
          .replace(/\.+\s*$/, '')
          .replace(/^([A-Z])/, (m) => m.toLowerCase());
        const compactMeaning =
          meaningClean.length > 150
            ? `${meaningClean.slice(0, 147).replace(/[\s,;:-]+$/, '')}`
            : meaningClean;
        const leadVerb =
          cIdx === 0
            ? `Under the hood, the observed step executes ${cleanCmd}`
            : `Next, the follow-up artifact ${cleanCmd} runs`;
        return `${leadVerb} (which ${compactMeaning} so that ${purposeClean || `defenders can trace ${stageMitre} on ${stripParensForInnerText(n3)}`}).`;
      });

      const howItWorksInPractice = flattenNestedParensInProse(
        commandSentences.join(' ')
      );

      const mitigation = flattenNestedParensInProse(
        cleanForStepGuide(
          stage.defenseMitigation ||
            'Enforce centralized telemetry forwarding and correlate multi-source forensic artifacts.'
        ).replace(/\.+\s*$/, '')
      );

      const telemetryEvidenceParen = parsedSummary
        ? `logged in ${logSource} Event ${eventCode} with ${parsedSummary} so analysts can verify the exact actor and target artifact`
        : `logged in ${logSource} Event ${eventCode} capturing ${stripParensForInnerText(cmd0)} for deterministic triage`;

      const simpleExplanation = flattenNestedParensInProse(
        `${cleanNarration} (${telemetryEvidenceParen}).`
      );

      const detectionAndEvidence = flattenNestedParensInProse(
        `Documented in ${logSource} Event ${eventCode} (recording ${parsedSummary || stripParensForInnerText(cmd0)} under ${stageMitre}): ${mitigation}.`
      );

      const stepAnalogy =
        customMeta?.stepAnalogies?.[idx] ||
        `At this stage of the intrusion, the intruder carries out the next covert action while every checkpoint ledger silently stamps an unforgeable receipt of the maneuver.`;

      return {
        stepNumber: stepNo,
        mitreId: stageMitre,
        plainTitle: cleanStageTitle,
        storyAnalogy: stepAnalogy,
        simpleExplanation,
        howItWorksInPractice,
        diagramAlignment: `On the diagram, follow Step #${stepNo} / Link #${stepNo} across the topology from ${stripParensForInnerText(n1)} and ${stripParensForInnerText(n2)} toward ${stripParensForInnerText(n3)} and ${stripParensForInnerText(n4)}.`,
        detectionAndEvidence,
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
