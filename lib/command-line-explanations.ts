import {
  AttackScenario,
  AttackStage,
  ProcessTreeNode,
  TelemetryEvent,
} from '@/modules/scenarios/types';

export interface CommandParameterExplanation {
  token: string;
  meaning: string;
}

export interface StageCommandBreakdownItem {
  id: string;
  commandIndex: number;
  badgeLabel: string;
  rawCommand: string;
  toolOrSubsystem: string;
  whatItMeans: string;
  exactPurpose: string;
  parameters: CommandParameterExplanation[];
}

interface ToolRule {
  pattern: RegExp;
  toolOrSubsystem: string;
  meaningBuilder: (cmd: string, contextTitle: string) => string;
  purposeBuilder: (cmd: string, contextTitle: string, mitreId: string) => string;
}

const TOOL_KNOWLEDGE_BASE: ToolRule[] = [
  {
    pattern: /\bbitsadmin(?:\.exe)?\b/i,
    toolOrSubsystem:
      'bitsadmin.exe · Windows Background Intelligent Transfer Service (BITS) CLI',
    meaningBuilder: (cmd) => {
      if (/\/create\b/i.test(cmd)) {
        return `Invokes Microsoft's signed Background Intelligent Transfer Service CLI utility (bitsadmin.exe) to instantiate a new asynchronous download job queue inside the svchost.exe (-k netsvcs -s BITS) service state database (qmgr.db).`;
      }
      if (/\/addfile\b/i.test(cmd)) {
        return `Calls bitsadmin.exe with /addfile to bind a remote HTTP/HTTPS staging URL and a local writable file destination path to the active BITS transfer job via IBackgroundCopyJob::AddFile.`;
      }
      if (/\/SetNotifyCmdLine\b/i.test(cmd)) {
        return `Configures a persistent BITS job completion/error callback command line via IBackgroundCopyJob2::SetNotifyCmdLine, serializing the executable and arguments directly into C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db.`;
      }
      if (/\/SetMinRetryDelay\b/i.test(cmd)) {
        return `Configures the minimum retry interval in seconds (IBackgroundCopyJob::SetMinimumRetryDelay) so the BITS service repeatedly re-triggers the job or notification callback on a predictable timer.`;
      }
      if (/\/resume\b|\/complete\b/i.test(cmd)) {
        return `Instructs the BITS COM service to activate (/resume) or finalize and commit (/complete) the queued transfer job inside svchost.exe.`;
      }
      return `Executes the native Windows bitsadmin.exe administration utility to manipulate asynchronous file transfer jobs and notification callbacks managed by the BITS svchost.exe service.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/\/create\b/i.test(cmd)) {
        return `Creates a legitimate-looking background transfer container (masquerading as a Windows Update task under ${mitreId}) so all subsequent network connections and child processes execute under the trusted svchost.exe service rather than an untrusted attacker shell.`;
      }
      if (/\/addfile\b/i.test(cmd)) {
        return `Offloads payload downloading to the Windows BITS service (svchost.exe) so perimeter and host firewalls observe outbound HTTPS traffic originating from a signed Microsoft OS binary, while recording EventID 59 in Microsoft-Windows-Bits-Client/Operational.`;
      }
      if (/\/SetNotifyCmdLine\b/i.test(cmd)) {
        return `Establishes stealthy service-level persistence (${mitreId}): whenever the BITS job finishes transferring or hits a retry condition, svchost.exe automatically launches the specified payload (e.g., regsvr32.exe or cmd.exe) under SYSTEM/service authority.`;
      }
      return `Abuses Windows Background Intelligent Transfer Service (BITS · ${mitreId}) during "${contextTitle}" to perform living-off-the-land payload staging and persistent callback execution.`;
    },
  },
  {
    pattern: /\bvssadmin(?:\.exe)?\b|\bDeleteSnapshots\b|\bWin32_ShadowCopy\b/i,
    toolOrSubsystem:
      'vssadmin.exe / vssvc.exe · Windows Volume Shadow Copy Service (VSS)',
    meaningBuilder: (cmd) => {
      if (/create\s+shadow/i.test(cmd)) {
        return `Invokes the Volume Shadow Copy Service administration CLI (vssadmin.exe create shadow /for=C:) to instruct vssvc.exe and volsnap.sys to freeze a read-only point-in-time block snapshot (\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopyN) of the active C: volume.`;
      }
      if (/delete\s+shadows/i.test(cmd)) {
        return `Executes vssadmin.exe delete shadows /all /quiet (or WMI Win32_ShadowCopy.Delete) to invoke IVssBackupComponents::DeleteSnapshots and purge all existing Volume Shadow Copy restore points without interactive confirmation prompts.`;
      }
      return `Interacts with the Windows Volume Shadow Copy Service (VSS) subsystem to create, enumerate, or destroy point-in-time NTFS volume snapshots.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/create\s+shadow/i.test(cmd)) {
        return `Bypasses the exclusive kernel file lock held by lsass.exe/NTDS on C:\\Windows\\NTDS\\ntds.dit and HKLM\\SYSTEM (${mitreId}), allowing the attacker to copy the Active Directory password database from the unlocked shadow volume.`;
      }
      return `Inhibits system recovery (${mitreId}) during "${contextTitle}" by destroying local disk shadow copies before or after payload execution so defenders cannot roll back encrypted files or inspect historical volume state.`;
    },
  },
  {
    pattern: /\besentutl(?:\.exe)?\b|\bESENT\b/i,
    toolOrSubsystem:
      'esentutl.exe · Microsoft Extensible Storage Engine (ESE) Database Utility',
    meaningBuilder: () =>
      `Executes Microsoft's signed Extensible Storage Engine utility (esentutl.exe) with the /y (file copy) and /vss (Volume Shadow Copy) switches to stream a locked ESE database file (such as ntds.dit or qmgr.db) to an attacker-accessible destination path.`,
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Performs Living-off-the-Land credential database extraction (${mitreId}) during "${contextTitle}" using a trusted Microsoft binary in C:\\Windows\\System32, while inadvertently generating deterministic ESENT EventID 325/326 telemetry in the Windows Application log.`,
  },
  {
    pattern: /\bntdsutil(?:\.exe)?\b|\bntds\.dit\b/i,
    toolOrSubsystem:
      'ntdsutil.exe · Active Directory Domain Services Management Utility',
    meaningBuilder: () =>
      `Runs the native Active Directory maintenance CLI (ntdsutil.exe) with chained interactive subcommands ("ac i ntds" -> activate instance ntds, "ifm" -> Install From Media, "create full <path>") to generate a complete offline replica of the Active Directory database (ntds.dit) alongside the SYSTEM and SECURITY registry hives.`,
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Extracts every domain user, administrator, and krbtgt password hash in a single signed utility invocation (${mitreId}) during "${contextTitle}" so the attacker can crack hashes or forge Golden Tickets offline.`,
  },
  {
    pattern: /\brundll32(?:\.exe)?\b|\bcomsvcs\.dll\b/i,
    toolOrSubsystem:
      'rundll32.exe · Windows 32/64-bit DLL Export Host & Proxy Execution Binary',
    meaningBuilder: (cmd) => {
      if (/comsvcs\.dll/i.test(cmd)) {
        return `Invokes the signed Windows proxy binary rundll32.exe to load C:\\Windows\\System32\\comsvcs.dll and call its MiniDump export (or ordinal #24), passing the target LSASS Process ID, output dump path, and the "full" memory dump flag.`;
      }
      return `Executes Microsoft's signed rundll32.exe host binary to load a target DLL into memory and directly invoke its exported function entrypoint (${cmd}).`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/comsvcs\.dll/i.test(cmd)) {
        return `Dumps the full virtual memory of lsass.exe to disk (${mitreId}) using a built-in Microsoft DLL (comsvcs.dll -> MiniDumpWriteDump) instead of dropping third-party tools like procdump.exe or mimikatz.exe, triggering Sysmon EventID 10 with GrantedAccess=0x1FFFFF.`;
      }
      return `Proxies execution of malicious DLL code (${mitreId}) through a trusted, Microsoft-signed system binary during "${contextTitle}" to evade application allowlisting and process-name heuristics.`;
    },
  },
  {
    pattern: /\breg(?:\.exe)?\s+(?:save|add|delete|export|query)\b|\bHKLM\\|\bHKCU\\/i,
    toolOrSubsystem: 'reg.exe · Windows Registry Console Manipulation Utility',
    meaningBuilder: (cmd) => {
      if (/\bsave\b/i.test(cmd)) {
        return `Executes reg.exe save to serialize an active kernel-mounted Windows Registry hive (such as HKLM\\SYSTEM, HKLM\\SAM, or HKLM\\SECURITY) into a portable binary hive file on disk using SeBackupPrivilege.`;
      }
      if (/\bdelete\b/i.test(cmd)) {
        return `Runs reg.exe delete (or NtDeleteValueKey) to strip a specific registry key or security descriptor value (such as the TaskCache\\Tree SD value) from the Windows Registry.`;
      }
      return `Modifies or queries Windows Registry keys and values (${cmd}) via the Windows Configuration Manager (Cm) kernel subsystem.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/SYSTEM/i.test(cmd)) {
        return `Extracts the 16-byte SysKey / BootKey (stored across the JD, Skew1, GBG, and Data registry classes under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa) required to decrypt the PEK and password hashes inside ntds.dit or SAM (${mitreId}).`;
      }
      return `Manipulates persistent Windows Registry configuration or credential material (${mitreId}) during "${contextTitle}" to establish persistence, alter system behavior, or harvest secrets.`;
    },
  },
  {
    pattern: /\bwevtutil(?:\.exe)?\b|\bClear-EventLog\b|\bEventID\s*(?:1102|104)\b/i,
    toolOrSubsystem:
      'wevtutil.exe / EventLog Service · Windows Event Log Management CLI',
    meaningBuilder: () =>
      `Invokes the Windows Event Collector CLI utility (wevtutil.exe) with the cl (clear-log) or el (enum-logs) parameter to instruct svchost.exe (EventLog service) to truncate the active .evtx ring buffer under C:\\Windows\\System32\\winevt\\Logs\\.`,
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Attempts anti-forensic indicator removal (${mitreId}) during "${contextTitle}" by wiping recorded Windows Security, System, PowerShell, or Sysmon audit trails—which immediately causes the OS to write Security EventID 1102 or System EventID 104 and USN_REASON_DATA_TRUNCATION in $UsnJrnl:$J.`,
  },
  {
    pattern: /\bschtasks(?:\.exe)?\b|\bTaskCache\b|\b4698\b/i,
    toolOrSubsystem:
      'schtasks.exe / Schedule Service · Windows Task Scheduler Subsystem',
    meaningBuilder: () =>
      `Calls the Windows Task Scheduler CLI (schtasks.exe) or ITaskService RPC interface to register, modify, or execute a scheduled task XML definition under C:\\Windows\\System32\\Tasks\\ and HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache.`,
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Establishes recurring execution persistence (${mitreId}) during "${contextTitle}" under SYSTEM or privileged account authority so the implant automatically respawns on schedule, boot, or user logon.`,
  },
  {
    pattern: /\bwmic(?:\.exe)?\b|\bwmiprvse(?:\.exe)?\b|\b__EventFilter\b|\bCommandLineEventConsumer\b|\b__FilterToConsumerBinding\b/i,
    toolOrSubsystem:
      'wmic.exe / wmiprvse.exe · Windows Management Instrumentation (WMI) CIM Repository',
    meaningBuilder: (cmd) => {
      if (/__EventFilter|CommandLineEventConsumer|__FilterToConsumerBinding/i.test(cmd)) {
        return `Registers permanent WMI MOF class instances (__EventFilter WQL trigger, CommandLineEventConsumer payload, and __FilterToConsumerBinding link) inside the root\\subscription namespace persisted on disk in C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA.`;
      }
      return `Invokes the Windows Management Instrumentation command-line interface (wmic.exe) or DCOM/WinRM provider host (wmiprvse.exe) to execute Win32_Process.Create or query CIM system classes.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/__EventFilter|CommandLineEventConsumer|__FilterToConsumerBinding/i.test(cmd)) {
        return `Creates fileless, repository-backed SYSTEM persistence (${mitreId}) during "${contextTitle}" that runs outside normal Startup folders and Services lists, detectable via Sysmon EventID 19, 20, and 21 and WMI-Activity EventID 5861.`;
      }
      return `Executes lateral movement or local process creation (${mitreId}) via the trusted WMI provider daemon (wmiprvse.exe) during "${contextTitle}" to decouple the child process parent PID from the attacker's session.`;
    },
  },
  {
    pattern: /\bpowershell(?:\.exe)?\b|\bpwsh\b|\bIEX\b|\bInvoke-|\bFromBase64String\b|\bScriptBlock\b|\b4104\b/i,
    toolOrSubsystem:
      'powershell.exe / System.Management.Automation.dll · Windows PowerShell CLR Engine',
    meaningBuilder: (cmd) => {
      if (/-v(?:ersion)?\s*2\b/i.test(cmd)) {
        return `Launches powershell.exe with the -Version 2 downgrade switch, forcing the .NET Common Language Runtime to load the legacy CLR v2.0.50727 engine instead of CLR v4.0.`;
      }
      return `Invokes the Windows PowerShell host (powershell.exe) with stealth and execution-policy bypass flags (such as -NoP, -NonI, -W Hidden, -Exec Bypass, or -EncodedCommand) to evaluate and execute dynamic PowerShell expressions or reflective .NET assemblies in memory.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/-v(?:ersion)?\s*2\b/i.test(cmd)) {
        return `Bypasses AMSI (AmsiScanBuffer) and PowerShell v5 Constrained Language Mode / ScriptBlock Logging (${mitreId}) during "${contextTitle}", which defenders catch by correlating EngineVersion=2.0 in EventID 400/800.`;
      }
      return `Achieves fileless in-memory staging and execution (${mitreId}) during "${contextTitle}" without writing compiled binaries to disk, while generating PowerShell Operational EventID 4104 (ScriptBlock) and 4103 (Module/Pipeline) telemetry.`;
    },
  },
  {
    pattern: /\bpsexec(?:\.exe|svc\.exe)?\b|\bsvcctl\b|\b5145\b|\b7045\b/i,
    toolOrSubsystem:
      'PsExec / PSEXESVC.exe · SMB ADMIN$ Share & Service Control Manager (SCM) RPC',
    meaningBuilder: () =>
      `Uploads a service binary (such as PSEXESVC.exe) over SMB2/3 to the target's administrative \\\\<target>\\ADMIN$ share (C:\\Windows\\), opens the \\\\<target>\\IPC$\\svcctl RPC pipe to call CreateServiceW and StartServiceW, and redirects interactive console I/O over named pipes (-stdin, -stdout, -stderr).`,
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Executes lateral movement with immediate NT AUTHORITY\\SYSTEM privileges on the remote host (${mitreId}) during "${contextTitle}", leaving correlated forensic traces in Security EventID 5145, System EventID 7045, and Sysmon EventID 17/18.`,
  },
  {
    pattern: /\brubeus(?:\.exe)?\b|\bkerberoast\b|\bkrbtgt\b|\b4768\b|\b4769\b|\bdcsync\b|\bdrsuapi\b|\b4662\b|\bmimikatz\b/i,
    toolOrSubsystem:
      'Kerberos KDC / MS-DRSR Active Directory Identity & Replication Protocol',
    meaningBuilder: (cmd) => {
      if (/drsuapi|4662|dcsync|GetNCChanges/i.test(cmd)) {
        return `Binds to the Domain Controller's MS-DRSR Directory Replication Service RPC interface (UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2) and invokes IDL_DRSGetNCChanges with DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2).`;
      }
      if (/4768|4769|kerberoast|krbtgt|Golden/i.test(cmd)) {
        return `Constructs or requests Kerberos AS-REQ (EventID 4768) or TGS-REQ (EventID 4769) tickets against the Key Distribution Center (KDC), specifying custom encryption types (such as 0x17 RC4-HMAC) or forged PAC claims signed with the krbtgt key.`;
      }
      return `Executes Active Directory credential harvesting or Kerberos ticket manipulation (${cmd}) against the domain identity infrastructure.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/drsuapi|4662|dcsync|GetNCChanges/i.test(cmd)) {
        return `Impersonates a Domain Controller over the network (${mitreId}) during "${contextTitle}" to replicate NTLM hashes, AES-256 keys, and password history for krbtgt and Domain Admins without touching lsass.exe or ntds.dit on disk.`;
      }
      return `compromises Active Directory authentication and service ticket cryptography (${mitreId}) during "${contextTitle}" to escalate domain privileges or crack service account credentials offline.`;
    },
  },
  {
    pattern: /\bcertreq(?:\.exe)?\b|\bcertify(?:\.exe)?\b|\bcertutil(?:\.exe)?\b|\b4886\b|\b4887\b|\bESC1\b|\bPetitPotam\b|\bEfsRpc/i,
    toolOrSubsystem:
      'Active Directory Certificate Services (AD CS) & MS-EFSRPC Coercion Subsystem',
    meaningBuilder: (cmd) => {
      if (/EfsRpc|PetitPotam|lsarpc|efsrpc/i.test(cmd)) {
        return `Connects to the MS-EFSRPC named pipe (\\pipe\\lsarpc or \\pipe\\efsrpc) on a remote server and invokes EfsRpcOpenFileRaw with an attacker-controlled UNC path (\\\\<attacker>\\share\\file), forcing the target's SYSTEM account to authenticate back over SMB/HTTP.`;
      }
      return `Submits a PKCS#10 / CMC certificate enrollment request (via certreq.exe or ICertRequestD2) to the Enterprise CA specifying an Enrollable template and a custom Subject Alternative Name (SAN / szOID_NT_PRINCIPAL_NAME) for a Domain Admin account.`;
    },
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Abuses Active Directory Certificate Services (AD CS ESC1/ESC8) or NTLM relay coercion (${mitreId}) during "${contextTitle}" to mint a valid X.509 client authentication certificate for a privileged domain identity and obtain a Kerberos TGT via PKINIT (EventID 4768).`,
  },
  {
    pattern: /\bCreateProcess[AW]?\b|\bNtUnmapViewOfSection\b|\bVirtualAlloc(?:Ex)?\b|\bWriteProcessMemory\b|\bSetThreadContext\b|\bResumeThread\b|\bVirtualProtect(?:Ex)?\b|\bNtAllocateVirtualMemory\b|\bNtWriteVirtualMemory\b|\bMiniDumpWriteDump\b|\bDeviceIoControl\b|\bAdjustTokenPrivileges\b/i,
    toolOrSubsystem:
      'Win32 / Windows Native System Call (ntdll.dll / kernel32.dll Ring-3 ──▶ Ring-0 Bridge)',
    meaningBuilder: (cmd) => {
      if (/\bCreateProcess[AW]?\b|CREATE_SUSPENDED|0x0*4\b/i.test(cmd)) {
        return `Calls the Win32 CreateProcessW API (with dwCreationFlags = CREATE_SUSPENDED = 0x00000004 during hollowing/injection stages), instructing the Windows kernel (ntdll!NtCreateUserProcess) to allocate the target process EPROCESS structure, PEB, and primary thread in RAM while holding execution before the entry point runs.`;
      }
      if (/NtUnmapViewOfSection/i.test(cmd)) {
        return `Invokes the undocumented native system call NtUnmapViewOfSection(hProcess, BaseAddress) in ntdll.dll to unmap the legitimate signed PE image section from the target process's PEB ImageBaseAddress (e.g., 0x00400000).`;
      }
      if (/VirtualAlloc|NtAllocateVirtualMemory/i.test(cmd)) {
        return `Calls VirtualAllocEx / NtAllocateVirtualMemory across process boundaries to reserve and commit private, unbacked Virtual Address Descriptor (VAD) pages with executable memory permissions (e.g., PAGE_EXECUTE_READWRITE 0x40).`;
      }
      if (/WriteProcessMemory|NtWriteVirtualMemory/i.test(cmd)) {
        return `Invokes WriteProcessMemory / NtWriteVirtualMemory to copy raw MZ/PE headers, unpacked sections, or shellcode bytes directly into the target process's virtual address space.`;
      }
      if (/SetThreadContext|NtSetContextThread/i.test(cmd)) {
        return `Calls SetThreadContext to overwrite the suspended thread's CPU instruction pointer / entry register (RCX/EAX/RIP) inside the CONTEXT structure so execution points to the injected implant entry address.`;
      }
      if (/ResumeThread|NtResumeThread/i.test(cmd)) {
        return `Calls ResumeThread to decrement the primary thread's kernel suspend count from 1 to 0, releasing the hollowed or injected thread to execute the implanted payload.`;
      }
      if (/VirtualProtect|NtProtectVirtualMemory/i.test(cmd)) {
        return `Invokes VirtualProtect / NtProtectVirtualMemory to modify page table protection bits in place (such as flipping R-X code pages in amsi.dll or ntdll.dll to RWX so in-memory hooks or patches can be written).`;
      }
      if (/DeviceIoControl/i.test(cmd)) {
        return `Sends a raw I/O Control Code (IRP_MJ_DEVICE_CONTROL / IOCTL) from user mode to a loaded Ring-0 kernel driver device object (\\Device\\...) to trigger an arbitrary kernel read/write or process termination primitive.`;
      }
      if (/AdjustTokenPrivileges/i.test(cmd)) {
        return `Calls Advapi32!AdjustTokenPrivileges on the current process access token to enable a high-impact privilege (such as SeDebugPrivilege or SeBackupPrivilege, logged in Security EventID 4703).`;
      }
      return `Invokes low-level Windows Win32 / Native API functions (${cmd}) to manipulate virtual memory, threads, tokens, or kernel objects directly in RAM.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/DeviceIoControl/i.test(cmd)) {
        return `Exploits a vulnerable signed kernel driver (BYOVD · ${mitreId}) during "${contextTitle}" to transition from user-mode administrator to Ring-0 kernel execution and blind EDR kernel callbacks (ObRegisterCallbacks / ETW Ti).`;
      }
      return `Executes stealthy in-memory process manipulation (${mitreId}) during "${contextTitle}" so malicious code runs inside the virtual address space and trusted identity of a legitimate signed Windows binary.`;
    },
  },
  {
    pattern: /\bcurl\b|\bwget\b|\b127\.0\.0\.1:2302\b|\bphpini_editor\b|\bprotected_directory\b|\brestoredatabase\b|\bvalid_token\b|\bnewpass\b|\buser_loader\b/i,
    toolOrSubsystem:
      'HTTP / Loopback API & Web Application Command Dispatch Subsystem',
    meaningBuilder: (cmd) => {
      if (/127\.0\.0\.1:2302|restoredatabase|valid_token|newpass/i.test(cmd)) {
        return `Dispatches a loopback HTTPS POST request to Control Web Panel's internal Slim v2 User API bound to 127.0.0.1:2302 (whose PHP-FPM worker pool runs as uid=0 root), targeting unauthenticated or SQLi-bypassed endpoints (/v1/restoredatabase/, /valid_token/, or /v1/newpass/) with shell metacharacters (; <cmd> ;).`;
      }
      if (/phpini_editor|protected_directory|user_loader|module=/i.test(cmd)) {
        return `Sends a crafted HTTP request to Control Web Panel (/index.php?module=... or / user_loader .php) exploiting basename($_SERVER['PHP_SELF']) authentication bypass / Execution After Redirect (CVE-2026-24061 / CVE-2026-73696) and unvalidated module inclusion (CVE-2026-73695) to reach pre-auth file-write or shell_exec() command injection sinks.`;
      }
      return `Executes the HTTP/HTTPS transfer client (${cmd}) to transmit crafted exploit requests, fetch remote stage-2 payloads, or relay internal loopback API calls.`;
    },
    purposeBuilder: (cmd, contextTitle, mitreId) => {
      if (/127\.0\.0\.1:2302|restoredatabase|valid_token|newpass/i.test(cmd)) {
        return `Escalates privileges from a low-privileged hosting account (uid=1000) to full Linux root (uid=0 · ${mitreId}) during "${contextTitle}" by abusing missing authentication (CVE-2026-77877) and root shell_exec concatenation (CVE-2026-77878 / CVE-2026-104080 / CVE-2026-77880).`;
      }
      if (/phpini_editor|protected_directory|user_loader|module=/i.test(cmd)) {
        return `Bypasses Control Web Panel authentication (CVE-2026-24061 / CVE-2026-73696) and dispatches the target module (such as phpini_editor or protected_directory · ${mitreId}) during "${contextTitle}" to achieve pre-authentication remote code execution.`;
      }
      return `Delivers the network exploit payload or retrieves the next-stage execution script (${mitreId}) during "${contextTitle}" over HTTP/HTTPS.`;
    },
  },
  {
    pattern: /\bSELECT\s+.*\bFROM\b|\bUNION\s+SELECT\b|\bxp_cmdshell\b|\bsp_OACreate\b|\bCOPY\s+.*\bFROM\s+PROGRAM\b|\bsqlservr\b|\bpsql\b|\bmysql\b/i,
    toolOrSubsystem:
      'Relational Database Engine & SQL Command Execution Subsystem (MSSQL / PostgreSQL / MySQL)',
    meaningBuilder: (cmd) => {
      if (/xp_cmdshell|sp_OACreate|sp_configure/i.test(cmd)) {
        return `Executes privileged T-SQL stored procedures (sp_configure 'xp_cmdshell', 1; RECONFIGURE; followed by xp_cmdshell or sp_OACreate 'WScript.Shell') inside Microsoft SQL Server (sqlservr.exe) to spawn OS commands via cmd.exe.`;
      }
      if (/COPY\s+.*\bFROM\s+PROGRAM/i.test(cmd)) {
        return `Executes the PostgreSQL superuser SQL statement COPY <table_name> FROM PROGRAM '<shell_command>', which instructs the postgres backend process to invoke popen() and run the string inside /bin/sh.`;
      }
      if (/UNION\s+SELECT/i.test(cmd)) {
        return `Injects a crafted UNION SELECT SQL query into an unparameterized string concatenation sink to fabricate a synthetic database row (such as a valid OAuth authorization code with a 2099 expiration timestamp) in memory.`;
      }
      return `Executes a structured SQL query or database administration command (${cmd}) against the relational database engine.`;
    },
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Pivots from database query access or SQL injection to direct operating system command execution or authentication bypass (${mitreId}) during "${contextTitle}" under the database daemon's service account.`,
  },
  {
    pattern: /\bkubectl\b|\bdocker\b|\brunc\b|\bnsenter\b|\bchroot\b|\bcapsh\b|\bhostPath\b|\bkube-apiserver\b/i,
    toolOrSubsystem:
      'Kubernetes / Linux Container Runtime & Namespace Isolation Subsystem',
    meaningBuilder: (cmd) => {
      if (/nsenter|chroot/i.test(cmd)) {
        return `Invokes nsenter (targeting /proc/1/ns/*) or chroot /host inside a privileged container to attach the process to the underlying Linux node's root PID, mount, network, and IPC namespaces.`;
      }
      return `Executes a Kubernetes API request or container runtime command (${cmd}) configuring pod security contexts, volume mounts (hostPath: /), or cluster role bindings.`;
    },
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Breaks out of container cgroup/namespace isolation (${mitreId}) during "${contextTitle}" to gain unrestricted root execution on the underlying Kubernetes worker node and access host credentials (kubelet / systemd).`,
  },
  {
    pattern: /\baws\s+|\bgcloud\s+|\baz\s+|\bAssumeRole\b|\bPassRole\b|\bCreateAccessKey\b|\bGetSecretValue\b|\b169\.254\.169\.254\b|\bMailItemsAccessed\b|\bNew-InboxRule\b|\broadrecon\b|\broadtx\b/i,
    toolOrSubsystem:
      'Cloud Control Plane & Identity Federation API (AWS IAM / GCP IAM / Microsoft Entra ID & M365)',
    meaningBuilder: (cmd) => {
      if (/169\.254\.169\.254/i.test(cmd)) {
        return `Queries the link-local Instance Metadata Service endpoint (http://169.254.169.254/latest/meta-data/iam/security-credentials/<RoleName>) to retrieve temporary AWS STS AccessKeyId, SecretAccessKey, and SessionToken credentials.`;
      }
      if (/PassRole|UpdateFunctionCode|CreateAccessKey|AttachUserPolicy/i.test(cmd)) {
        return `Calls AWS IAM / Lambda control-plane APIs (iam:PassRole, lambda:UpdateFunctionCode, or iam:AttachUserPolicy) to bind a privileged IAM role or administrator policy and execute code under that elevated identity.`;
      }
      if (/MailItemsAccessed|New-InboxRule/i.test(cmd)) {
        return `Invokes Microsoft 365 Exchange Online / Graph API operations to silently read victim mailbox items (MailItemsAccessed) or create hidden inbox forwarding/deletion rules (New-InboxRule).`;
      }
      if (/roadtx|roadrecon|PRT|DeviceRegistration/i.test(cmd)) {
        return `Interacts with Microsoft Entra ID Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net) and OAuth2 token endpoints using X.509 device certificates and TPM/session keys to mint a Primary Refresh Token (PRT).`;
      }
      return `Executes a cloud control-plane API or CLI operation (${cmd}) against AWS CloudTrail, GCP Cloud Audit, or Microsoft Entra ID / M365.`;
    },
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Harvests cloud identity tokens, escalates IAM privileges, or exfiltrates cloud data (${mitreId}) during "${contextTitle}" without deploying traditional endpoint malware, captured in CloudTrail / Unified Audit Log telemetry.`,
  },
  {
    pattern: /\bbcdedit(?:\.exe)?\b/i,
    toolOrSubsystem:
      'bcdedit.exe · Windows Boot Configuration Data (BCD) Store Editor',
    meaningBuilder: () =>
      `Invokes Microsoft's signed Boot Configuration Data editor (bcdedit.exe) to disable Windows Recovery Environment auto-repair (recoveryenabled No) and suppress startup failure prompts (bootstatuspolicy ignoreallfailures) in the BCD registry store.`,
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Locks the compromised server out of Windows Automatic Repair and WinRE rollback (${mitreId}) during "${contextTitle}" so administrators cannot recover from local boot snapshots after ransomware encryption.`,
  },
  {
    pattern: /\blb3_black(?:\.exe)?\b|\bCreateIoCompletionPort\b|\bChaCha20\b|\bRestore-My-Files\.txt\b/i,
    toolOrSubsystem:
      'LockBit 3.0 Locker (lb3_black.exe) · Windows I/O Completion Port (IOCP) Encryption Engine',
    meaningBuilder: (cmd) => {
      if (/-pass\b/i.test(cmd)) {
        return `Executes the password-gated LockBit 3.0 (LockBit Black) binary using the required decryption key argument (-pass) to unlock its packed configuration block in memory before starting anti-recovery and encryption threads.`;
      }
      if (/CreateIoCompletionPort|ChaCha20|IOCP/i.test(cmd)) {
        return `Spawns an asynchronous Windows I/O Completion Port (CreateIoCompletionPort) worker pool that encrypts only the opening 4 KB–64 KB header stripe of each targeted file with ChaCha20, wraps per-file keys with RSA-2048, and renames files with the .lockbit extension.`;
      }
      return `Runs LockBit 3.0 locker routines (${cmd}) under SYSTEM authority to drop Restore-My-Files.txt, set the extortion wallpaper, and encrypt enterprise file shares.`;
    },
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Maximizes enterprise file-share encryption speed while defeating sandbox detonation (${mitreId}) during "${contextTitle}", leaving high-velocity file-rename telemetry and ransom-note creation artifacts (Sysmon EID 11 / 13).`,
  },
  {
    pattern: /\b3CXDesktopApp(?:\.exe)?\b|\bffmpeg\.dll\b|\bd3dcompiler_47\.dll\b|\b0xFEEDFACE\b|\bICONICSTEALER\b|\bGopuram\b/i,
    toolOrSubsystem:
      '3CXDesktopApp.exe (Electron / VoIP) · Signed Host DLL Sideloading & Supply-Chain Implant',
    meaningBuilder: (cmd) => {
      if (/ffmpeg\.dll|d3dcompiler_47\.dll|0xFEEDFACE|RC4/i.test(cmd)) {
        return `Executes the genuinely EV-signed 3CXDesktopApp.exe Electron host, which side-loads trojanized unsigned ffmpeg.dll; ffmpeg.dll locates the 0xFEEDFACE marker inside d3dcompiler_47.dll and RC4-decrypts trailing shellcode into unbacked MEM_PRIVATE RWX memory.`;
      }
      if (/icon\d+\.ico|IconStorages|raw\.githubusercontent\.com/i.test(cmd)) {
        return `Fetches a benign-looking .ico asset from the attacker-controlled GitHub repository (IconStorages/images) and parses the trailing Base64 string appended past the valid ICO end-of-file to resolve the live C2 server.`;
      }
      if (/Login Data|ICONICSTEALER|Gopuram/i.test(cmd)) {
        return `Executes the in-memory ICONICSTEALER module inside 3CXDesktopApp.exe to harvest Chromium/Edge Login Data databases and profile high-value finance/crypto hosts for selective Gopuram backdoor deployment.`;
      }
      return `Runs the supply-chain-trojanized 3CXDesktopApp.exe runtime (${cmd}) inside a legitimate Electron desktop application context.`;
    },
    purposeBuilder: (_cmd, contextTitle, mitreId) =>
      `Exploits software supply-chain trust in a valid 3CX EV Authenticode signature (${mitreId}) during "${contextTitle}", exposing the intrusion via Sysmon EventID 7 (unsigned child DLL), unbacked RWX memory, GitHub .ico DNS/TLS queries (EID 22/3), and behavioral EDR alerts on a VoIP process reading browser credential stores.`,
  },
];

// Build active rules list
const ACTIVE_TOOL_RULES = TOOL_KNOWLEDGE_BASE.filter((r) =>
  Boolean(r.toolOrSubsystem)
);

/**
 * Extracts individual flag, switch, path, API parameter, or key=value explanations
 * from any raw CommandLine or technical command string so every argument is explained.
 */
export function extractCommandParameterExplanations(
  rawCommand: string
): CommandParameterExplanation[] {
  const cmd = (rawCommand || '').trim();
  const params: CommandParameterExplanation[] = [];
  const seen = new Set<string>();

  const addParam = (token: string, meaning: string) => {
    const cleanToken = token.trim();
    if (!cleanToken || seen.has(cleanToken.toLowerCase())) return;
    seen.add(cleanToken.toLowerCase());
    params.push({ token: cleanToken, meaning });
  };

  // 1. Check well-known CLI switches & flags
  if (/\bbitsadmin(?:\.exe)?\b/i.test(cmd)) {
    addParam(
      'bitsadmin.exe',
      'Signed Windows Background Intelligent Transfer Service (BITS) CLI controller binary.'
    );
  }
  if (/\/create\b/i.test(cmd)) {
    addParam(
      '/create',
      'Creates a new asynchronous background transfer job in the BITS service queue (qmgr.db).'
    );
  }
  if (/\/download\b/i.test(cmd)) {
    addParam(
      '/download',
      'Configures the BITS job transfer direction as an asynchronous remote-to-local download.'
    );
  }
  if (/\/addfile\b/i.test(cmd)) {
    addParam(
      '/addfile',
      'Appends a remote URL and local destination file path to the specified BITS transfer job.'
    );
  }
  if (/\/SetNotifyCmdLine\b/i.test(cmd)) {
    addParam(
      '/SetNotifyCmdLine <Job> <Prog> <Args>',
      'Registers an executable and command-line arguments that svchost.exe (BITS) will launch upon job completion or error.'
    );
  }
  if (/\/SetMinRetryDelay\b/i.test(cmd)) {
    addParam(
      '/SetMinRetryDelay',
      'Sets the delay in seconds before BITS retries a failed transfer and re-triggers the notification command.'
    );
  }
  if (/\/resume\b/i.test(cmd)) {
    addParam(
      '/resume',
      'Activates the suspended BITS job in the transfer queue so svchost.exe immediately initiates network I/O.'
    );
  }
  if (/\bvssadmin(?:\.exe)?\b/i.test(cmd)) {
    addParam(
      'vssadmin.exe',
      'Windows Volume Shadow Copy Service administrative CLI binary.'
    );
  }
  if (/create\s+shadow/i.test(cmd)) {
    addParam(
      'create shadow /for=C:',
      'Instructs vssvc.exe to create a read-only point-in-time shadow copy of volume C: to bypass exclusive file locks.'
    );
  }
  if (/delete\s+shadows/i.test(cmd)) {
    addParam(
      'delete shadows /all /quiet',
      'Deletes all Volume Shadow Copies on the system (/all) while suppressing interactive confirmation prompts (/quiet).'
    );
  }
  if (/recoveryenabled\s+No/i.test(cmd)) {
    addParam(
      '/set {default} recoveryenabled No',
      'Disables Windows Recovery Environment (WinRE) automatic boot recovery for the default OS loader entry.'
    );
  }
  if (/bootstatuspolicy\s+ignoreallfailures/i.test(cmd)) {
    addParam(
      '/set {default} bootstatuspolicy ignoreallfailures',
      'Suppresses Windows startup failure recovery menus so the host boots normally into the encrypted desktop without offering repair options.'
    );
  }
  if (/-pass\s+[0-9a-f]+/i.test(cmd)) {
    const match = cmd.match(/-pass\s+[0-9a-f]+/i);
    if (match) {
      addParam(
        match[0],
        'LockBit 3.0 anti-analysis execution password required to decrypt the binary configuration and payload body in memory.'
      );
    }
  }
  if (/0xFEEDFACE/i.test(cmd)) {
    addParam(
      '0xFEEDFACE',
      '4-byte magic delimiter embedded inside trojanized d3dcompiler_47.dll marking the start of the RC4-encrypted stage-2 shellcode blob.'
    );
  }
  if (/Login Data/i.test(cmd)) {
    addParam(
      'Login Data',
      'Chromium/Edge SQLite credential store targeted by ICONICSTEALER to extract saved website passwords and user profiles.'
    );
  }
  if (/\besentutl(?:\.exe)?\b/i.test(cmd)) {
    addParam(
      'esentutl.exe /y /vss /d',
      'Uses Microsoft Extensible Storage Engine utility to copy a source file (/y) via Volume Shadow Copy (/vss) to destination (/d).'
    );
  }
  if (/\bntdsutil(?:\.exe)?\b/i.test(cmd)) {
    addParam(
      '"ac i ntds" "ifm" "create full <Dir>"',
      'Activates the NTDS instance, enters Install From Media (IFM) mode, and dumps ntds.dit + SYSTEM/SECURITY hives to the target folder.'
    );
  }
  if (/\brundll32(?:\.exe)?\b/i.test(cmd)) {
    addParam(
      'rundll32.exe <DLL>,<Export>',
      'Signed Windows host binary that loads the specified DLL and invokes its exported function with the trailing arguments.'
    );
  }
  if (/comsvcs\.dll.*MiniDump|#24/i.test(cmd)) {
    addParam(
      'comsvcs.dll,MiniDump <PID> <DumpFile> full',
      'Calls exported function MiniDump (ordinal #24) inside comsvcs.dll to write a full memory minidump of the target PID (lsass.exe).'
    );
  }
  if (/\breg(?:\.exe)?\s+save\b/i.test(cmd)) {
    addParam(
      'reg.exe save <Hive> <OutFile> [/y]',
      'Exports an active kernel-locked registry hive (such as HKLM\\SYSTEM or HKLM\\SAM) to a binary file on disk.'
    );
  }
  if (/\bwevtutil(?:\.exe)?\s+cl\b/i.test(cmd)) {
    addParam(
      'wevtutil.exe cl <Channel>',
      'Truncates and clears all recorded events inside the specified Windows Event Log (.evtx) channel.'
    );
  }
  if (/-NoP(?:rofile)?\b/i.test(cmd)) {
    addParam(
      '-NoP (-NoProfile)',
      'Skips loading user and system PowerShell profile scripts to avoid profile-based logging or environment hooks.'
    );
  }
  if (/-NonI(?:nteractive)?\b/i.test(cmd)) {
    addParam(
      '-NonI (-NonInteractive)',
      'Runs PowerShell without presenting an interactive prompt to the user.'
    );
  }
  if (/-W(?:indowStyle)?\s+Hidden\b/i.test(cmd)) {
    addParam(
      '-W Hidden (-WindowStyle Hidden)',
      'Hides the console window completely from the desktop taskbar and user view.'
    );
  }
  if (/-Exec(?:utionPolicy)?\s+Bypass\b/i.test(cmd)) {
    addParam(
      '-Exec Bypass (-ExecutionPolicy Bypass)',
      'Overrides local PowerShell script execution restrictions so unsigned scripts and stagers execute without warnings.'
    );
  }
  if (/-enc(?:odedcommand)?\b/i.test(cmd)) {
    addParam(
      '-enc (-EncodedCommand <Base64>)',
      'Passes a UTF-16LE Base64-encoded PowerShell script directly on the command line to evade quote/special-character parsing and naive string filters.'
    );
  }
  if (/CREATE_SUSPENDED|0x00000004/i.test(cmd)) {
    addParam(
      'CREATE_SUSPENDED (0x00000004)',
      'Process creation flag that halts the primary thread before its entry point runs so the address space can be hollowed out in RAM.'
    );
  }
  if (/PAGE_EXECUTE_READWRITE|0x40\b|\bRWX\b/i.test(cmd)) {
    addParam(
      'PAGE_EXECUTE_READWRITE (0x40 / RWX)',
      'Memory protection constant granting simultaneous Read, Write, and Execute permissions to a virtual memory page.'
    );
  }
  if (/0x1FFFFF|PROCESS_ALL_ACCESS|0x1410|0x1010/i.test(cmd)) {
    const match = cmd.match(/0x1FFFFF|PROCESS_ALL_ACCESS|0x1410|0x1010/i);
    if (match) {
      addParam(
        match[0],
        'Process handle access mask requesting full virtual memory read/query permissions (PROCESS_VM_READ | PROCESS_QUERY_INFORMATION) on the target process.'
      );
    }
  }
  if (/syscall=59|\bexecve\b/i.test(cmd)) {
    addParam(
      'syscall=59 (sys_execve)',
      'Linux x86_64 kernel system call that replaces the calling process image with a new executable and command-line argument vector.'
    );
  }
  if (/LD_PRELOAD|ld\.so\.preload/i.test(cmd)) {
    addParam(
      '/etc/ld.so.preload / LD_PRELOAD',
      'Instructs the Linux dynamic linker (ld-linux.so) to map a shared library into every dynamically linked process before libc.so.6.'
    );
  }
  if (/--defaults-extra-file=\/root\/\.my\.cnf/i.test(cmd)) {
    addParam(
      '--defaults-extra-file=/root/.my.cnf',
      'Loads MySQL root superuser credentials from /root/.my.cnf; in CWP CVE-2026-77878, unescaped input after "<" injects arbitrary root shell commands.'
    );
  }
  if (/module=phpini_editor|module=protected_directory|module=/i.test(cmd)) {
    addParam(
      'module=<target_module>',
      'CWP dispatcher parameter that includes /usr/local/cwpsrv/var/services/user_files/modules/<module>.php prior to exiting on unauthenticated redirects.'
    );
  }

  // 2. Extract URLs / IP endpoints if present
  const urlMatch = cmd.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) {
    addParam(
      urlMatch[0],
      'Target HTTP/HTTPS network endpoint or remote staging URI contacted during this command execution.'
    );
  }

  // 3. Extract Windows or Linux file paths if present
  const winPaths = cmd.match(/[A-Za-z]:\\[^\s"',;)]+/g) || [];
  for (const wp of winPaths.slice(0, 2)) {
    addParam(
      wp,
      /\\Temp\\|\\Public\\|\\Downloads\\|\\AppData\\|\\ProgramData\\/i.test(wp)
        ? 'User-writable or staging filesystem path used to drop, read, or execute stage artifacts.'
        : 'Protected Windows system binary, database, or configuration path targeted by the command.'
    );
  }

  const nixPaths =
    cmd.match(
      /\/(?:usr|bin|sbin|etc|opt|var|tmp|home|proc|dev|lib|root|data2|config|vmfs)[^\s"',;)]*/g
    ) || [];
  for (const np of nixPaths.slice(0, 2)) {
    addParam(
      np,
      /\/tmp\/|\/dev\/shm\/|\/var\/tmp\//i.test(np)
        ? 'World-writable temporary Linux path used for staging payloads or command output.'
        : 'System binary, daemon socket, configuration file, or log path accessed by the operation.'
    );
  }

  // 4. Extract EventID / CVE / MITRE tokens if present
  const eventMatch = cmd.match(/\bEvent\s*ID\s*\d+(?:\s*\/\s*\d+)?/i);
  if (eventMatch) {
    addParam(
      eventMatch[0],
      'Deterministic audit event identifier emitted by the operating system or security sensor when this operation executes.'
    );
  }

  const cveMatch = cmd.match(/\bCVE-\d{4}-\d{4,7}\b/i);
  if (cveMatch) {
    addParam(
      cveMatch[0],
      'Official Common Vulnerabilities and Exposures identifier for the exploited security flaw.'
    );
  }

  // 5. Fallback: if no specific tokens matched yet, parse key=value or primary command verb
  if (params.length === 0) {
    const kvMatches = cmd.match(/\b[A-Za-z0-9_.-]+=[^\s,;]+/g) || [];
    for (const kv of kvMatches.slice(0, 3)) {
      const [k, v] = kv.split('=');
      addParam(
        kv,
        `Recorded telemetry or command parameter setting "${k}" to "${v}" during stage execution.`
      );
    }
  }

  if (params.length === 0) {
    const tokens = cmd.split(/\s+/).filter(Boolean);
    const first = tokens[0] || cmd;
    addParam(
      first,
      'Primary executable, API entrypoint, or protocol directive initiating this stage operation.'
    );
    if (tokens.length > 1) {
      addParam(
        tokens.slice(1).join(' ').slice(0, 96),
        'Arguments and target parameters passed to the primary command invocation.'
      );
    }
  }

  return params.slice(0, 4);
}

/**
 * Generates a complete, domain-accurate explanation of any CommandLine or technical command:
 * - toolOrSubsystem: which binary, daemon, API, or subsystem executes it
 * - whatItMeans: what the command and its flags/syntax mean technically
 * - exactPurpose: what its exact tactical & forensic purpose is in the stage
 * - parameters: token-by-token breakdown of flags, paths, and arguments
 */
export function explainCommandLine(
  rawCommand: string,
  options: {
    termLabel?: string;
    stageTitle?: string;
    stageDescription?: string;
    mitreId?: string;
    scenarioName?: string;
  } = {}
): StageCommandBreakdownItem {
  const cmd = (rawCommand || '').trim();
  const stageTitle = options.stageTitle || 'Stage Execution';
  const mitreId = options.mitreId || 'ATT&CK';
  const termLabel = options.termLabel || 'COMMANDLINE';

  const parameters = extractCommandParameterExplanations(cmd);

  // Check specialized tool rules first
  for (const rule of ACTIVE_TOOL_RULES) {
    if (rule.pattern.test(cmd)) {
      return {
        id: `${termLabel}-${cmd.slice(0, 24)}`,
        commandIndex: 1,
        badgeLabel: termLabel,
        rawCommand: cmd,
        toolOrSubsystem: rule.toolOrSubsystem,
        whatItMeans: rule.meaningBuilder(cmd, stageTitle),
        exactPurpose: rule.purposeBuilder(cmd, stageTitle, mitreId),
        parameters,
      };
    }
  }

  // Additional specialized domain matchers covering ESXi, Linux rootkits, NTFS, Registry, RDP, SMB, Zeek, Volatility, IIS, Exchange, SharePoint, Tomcat, Supply Chain
  if (/\besxcli\b|\bvim-cmd\b|\bvmkfstools\b|\/var\/log\/hostd\.log|\/var\/log\/shell\.log/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'VMware ESXi Hypervisor CLI (esxcli / vim-cmd / hostd)',
      whatItMeans: `Executes VMware ESXi hypervisor management commands (${cmd}) via the root ESXi Shell to enumerate running Virtual Machine World IDs, disable firewall rules, or force-terminate vmx processes prior to encrypting /vmfs/volumes/ datastores.`,
      exactPurpose: `Releases exclusive hypervisor locks on Guest VM flat disk files (*-flat.vmdk, *.nvram · ${mitreId}) during "${stageTitle}" so the ransomware encryptor can overwrite virtual disks at high speed, leaving audit trails in /var/log/shell.log and /var/log/hostd.log.`,
      parameters,
    };
  }

  if (/\bvol\.py\b|\bvolatility\b|\bmalfind\b|\bpslist\b|\bvadinfo\b|\bcallbacks\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem:
        'Volatility 3 Memory Forensics Framework (windows.malfind / vadinfo / callbacks)',
      whatItMeans: `Runs the Volatility 3 memory forensics analyzer against a captured physical RAM image (memory.dmp) to walk kernel EPROCESS structures, Virtual Address Descriptor (VAD) trees, and kernel notification callback arrays.`,
      exactPurpose: `Detects fileless process hollowing, unbacked PAGE_EXECUTE_READWRITE (RWX) shellcode regions, MZ/PE headers (4D 5A) in private memory, and malicious Ring-0 kernel callbacks (${mitreId}) during "${stageTitle}".`,
      parameters,
    };
  }

  if (/\bMFTECmd\b|\b\$MFT\b|\b\$STANDARD_INFORMATION\b|\b\$FILE_NAME\b|\b\$UsnJrnl\b|\bCreated0x10\b|\bCreated0x30\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'NTFS Master File Table ($MFT) & USN Change Journal Forensics',
      whatItMeans: `Parses or manipulates low-level NTFS Master File Table ($MFT) record attributes—comparing the user-modifiable $STANDARD_INFORMATION (0x10) timestamps against the kernel-controlled $FILE_NAME (0x30) timestamps and $UsnJrnl:$J transaction records.`,
      exactPurpose: `Exposes anti-forensic timestomping (NtSetInformationFile · ${mitreId}) or deleted file activity during "${stageTitle}" by proving that the 0x10 creation timestamp was backdated earlier than the immutable 0x30 kernel creation timestamp.`,
      parameters,
    };
  }

  if (/\bAppCompatCacheParser\b|\bAmcacheParser\b|\bPECmd\b|\bShimCache\b|\bAmcache\.hve\b|\bPrefetch\b|\bSRUM\b|\bSRUDB\.dat\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem:
        'Windows Execution & Application Compatibility Artifact Parser (ShimCache / AmCache / Prefetch / SRUM)',
      whatItMeans: `Extracts and parses persistent Windows execution artifacts from HKLM\\SYSTEM AppCompatCache (ShimCache), C:\\Windows\\AppCompat\\Programs\\Amcache.hve, C:\\Windows\\Prefetch\\*.pf (MAM-compressed), or C:\\Windows\\System32\\sru\\SRUDB.dat.`,
      exactPurpose: `Reconstructs historical binary execution, SHA-1 file hashes, run counts, last execution timestamps, and per-process network bytes sent (${mitreId}) during "${stageTitle}" even after the attacker deletes the malware executable from disk.`,
      parameters,
    };
  }

  if (/\bbpf\b|\bebpf\b|\bBPFDoor\b|\bSO_ATTACH_FILTER\b|\bPACKET_FANOUT\b|\b0x7255\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem:
        'Linux Socket Filter (cBPF / eBPF) & Raw Packet Inspection Subsystem',
      whatItMeans: `Opens a Linux raw packet socket (AF_PACKET / SOCK_RAW) and attaches a compiled Berkeley Packet Filter bytecode program via setsockopt(SO_ATTACH_FILTER) or bpf() to inspect every inbound frame in kernel space before iptables/nftables.`,
      exactPurpose: `Maintains a zero-listening-port passive backdoor (${mitreId}) during "${contextOrDefault(stageTitle)}" that stays invisible to netstat/ss until triggered by a single magic packet containing the secret signature (e.g., 0x7255).`,
      parameters,
    };
  }

  if (/^(?:GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s+\S+|\bHTTP\/1\.[01]\b|\bCookie:\s*|\bHeader:\s*/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'HTTP / HTTPS Application Layer Request & Header Conduit',
      whatItMeans: `Transmits a crafted HTTP request (${cmd}) targeting a web server, reverse proxy, or appliance management endpoint with specific URI parameters, headers, or serialized body content.`,
      exactPurpose: `Triggers the web/appliance vulnerability, authentication bypass, or C2 communication channel (${mitreId}) required to accomplish "${stageTitle}".`,
      parameters,
    };
  }

  if (/\betcdctl\b|\bkubelet\b|\brunc\b|\/proc\/self\/fd\/|AdmissionReview|nginx\s+-t/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'Kubernetes Control Plane / OCI Container Runtime (runc / kubelet / etcdctl)',
      whatItMeans: `Executes or inspects a container runtime or Kubernetes control-plane operation (${cmd}) involving OCI container namespaces, leaked host file descriptors (/proc/self/fd/*), AdmissionReview webhook verification, or etcd v3 key-value store snapshots.`,
      exactPurpose: `Provides forensic visibility and runtime verification for container boundary isolation or cluster secret access (${mitreId}) during "${stageTitle}".`,
      parameters,
    };
  }

  if (/\bicsnpp-modbus\b|\biec60870\b|\btrilog\.exe\b|\bOPC-UA\b|\bCODESYS\b|\bTriStation\b|\bASDU\b|\bIOA\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'ICS / OT Industrial Protocol & PLC/SIS Telemetry (Modbus / IEC-104 / OPC-UA / TriStation)',
      whatItMeans: `Captures or inspects industrial control system (ICS/OT) protocol frames and engineering workstation logs (${cmd}) across Modbus TCP (502), OPC-UA (4840), IEC 60870-5-104 (2404), CODESYS, or Schneider Electric TriStation 1131 (UDP 1502).`,
      exactPurpose: `Reconstructs PLC logic transfers, substation breaker telecontrol commands, or Safety Instrumented System (SIS) controller state changes (${mitreId}) during "${stageTitle}".`,
      parameters,
    };
  }

  if (/\bmvt-ios\b|\bmvt-android\b|\bShutdown\.log\b|\bDataUsage\.sqlite\b|\bgtp_v1\b|\bgtp_create_pdp_context\b|\bmali_kbase\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'Mobile Spyware Forensics (MVT) & 5G/LTE Telecom GTP/SS7 Interconnect Audit',
      whatItMeans: `Runs Mobile Verification Toolkit (mvt-ios / mvt-android) forensic parsers or inspects cellular GRX/IPX GTP-C/GTP-U roaming signaling (${cmd}) across iOS Shutdown.log, DataUsage.sqlite, Android SELinux auditd, or telecom SGSN/GGSN nodes.`,
      exactPurpose: `Identifies zero-click mobile spyware execution traces, kernel driver privilege escalation, or anomalous cross-carrier roaming tunnels (${mitreId}) during "${stageTitle}".`,
      parameters,
    };
  }

  if (/\bredis-cli\b|\bpsql\b|\bpgaudit\b|\bsqlservr\.exe\b|\bpackage\.loadlib\b|\bsp_addlinkedserver\b|\bCOPY\b.*\bPROGRAM\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'Database Engine Runtime & Audit Subsystem (PostgreSQL pgAudit / Redis Lua / MS SQL Server)',
      whatItMeans: `Executes or audits database engine statements and administrative procedures (${cmd}) across PostgreSQL libpq/pgAudit, Redis Lua scripting (EVAL / MONITOR), or Microsoft SQL Server TDS RPC and CLR assembly catalogs.`,
      exactPurpose: `Detects multi-statement SQL injection, Lua sandbox breakouts, or administrative OS command spawning from the database service account (${mitreId}) during "${stageTitle}".`,
      parameters,
    };
  }

  if (/\bray\b|\bfickling\b|\bpickletools\b|\btorch\.load\b|\bsafetensors\b|\bmcp\.call_tool\b|\b8265\/api\/jobs\b/i.test(cmd)) {
    return {
      id: `${termLabel}-${cmd.slice(0, 24)}`,
      commandIndex: 1,
      badgeLabel: termLabel,
      rawCommand: cmd,
      toolOrSubsystem: 'AI / LLM Agent & MLOps Infrastructure Security (Ray Cluster / PyTorch Pickle / MCP Tool Audit)',
      whatItMeans: `Inspects or executes AI/ML infrastructure operations (${cmd}) across Ray Dashboard Jobs API (:8265/api/jobs/), PyTorch pickle opcode streams (fickling / pickletools), safetensors weight loading, or LLM Model Context Protocol (MCP) tool invocations.`,
      exactPurpose: `Exposes unauthenticated ML cluster job submission, unsafe model checkpoint deserialization, or indirect prompt injection via RAG context retrieval (${mitreId}) during "${stageTitle}".`,
      parameters,
    };
  }

  // General high-precision analysis based on command structure
  const cleanStageDesc = (options.stageDescription || '')
    .replace(/\s+/g, ' ')
    .trim();
  const firstSentenceMatch = cleanStageDesc.match(/^[^.!?]+[.!?]/);
  const conciseContext =
    cleanStageDesc.length > 220 && firstSentenceMatch
      ? firstSentenceMatch[0].replace(/[.!?]+$/, '').trim()
      : cleanStageDesc.replace(/[.!?]+$/, '').trim() || stageTitle;

  const isServiceDaemon =
    /services\.exe|systemd|\/sbin\/init|sshd|w3wp\.exe|tomcat|nginx|httpd|sqlservr|lsass\.exe|explorer\.exe|spoolsv\.exe/i.test(
      cmd
    );

  const detectedBin =
    cmd.match(
      /\b([A-Za-z0-9_.-]+\.(?:exe|dll|sys|sh|py|ps1|bat|vbs|msc|msi|jar|jsp|aspx|php|elf|ko|so)|powershell|cmd|bash|sh|python3?|java|curl|wget|ssh|sshd|sudo|crontab|auditctl|zeek|suricata)\b/i
    )?.[1] || 'System / Runtime Execution Interface';

  return {
    id: `${termLabel}-${cmd.slice(0, 24)}`,
    commandIndex: 1,
    badgeLabel: termLabel,
    rawCommand: cmd,
    toolOrSubsystem: `${detectedBin} · Stage Runtime & Telemetry Operation`,
    whatItMeans: isServiceDaemon
      ? `Invokes or targets the host daemon/process (${cmd}) with its runtime command-line arguments and service group parameters, establishing the execution context and process lineage (PPID ──▶ PID) for "${stageTitle}".`
      : `Executes the technical command / telemetry directive (${cmd}) via ${detectedBin}, passing the exact arguments, target paths, and protocol parameters required to carry out "${stageTitle}".`,
    exactPurpose: `Advances the scenario kill-chain under MITRE ${mitreId} during "${stageTitle}" (${conciseContext}) while generating verifiable host or network telemetry for DFIR attribution.`,
    parameters,
  };
}

function contextOrDefault(title: string): string {
  return title || 'Stage Execution';
}

const NON_COMMAND_SPEC_TERMS = new Set([
  'DEFENSE / MITIGATION',
  'MITRE CONTEXT',
  'MITRE TECHNIQUE',
  'MITRE TECHNIQUES',
  'MITRE ID',
  'PRIMARY MITRE',
  'CATEGORY',
  'STAGE COUNT',
  'RISK LEVEL',
  'THREAT ACTOR',
  'MANDIANT CLUSTER',
  'ADVISORY REF',
  'CISA ADVISORY',
  'PRIMARY SOURCES',
  'DEFENSE WINDOW',
  'DEFENSIVE FIX',
  'ARCHITECTURAL FIX',
  'F5 MITIGATION',
  'MITIGATION',
  'EDR RESPONSE',
  'EDR IMPACT',
  'IMPACT',
]);

/**
 * Builds the complete, ordered list of explained CommandLines and technical commands
 * for a given stage of any scenario (guaranteeing every COMMAND 1..N, CLI invocation,
 * API call, and active process CommandLine is explained in detail).
 */
export function buildStageCommandBreakdowns(
  scenario: AttackScenario,
  stage: AttackStage
): StageCommandBreakdownItem[] {
  const results: StageCommandBreakdownItem[] = [];
  const seenCommands = new Set<string>();

  const pushCommand = (
    rawCmd: string,
    badgeLabel: string,
    extraToolHint?: string
  ) => {
    const cleaned = (rawCmd || '').trim();
    if (!cleaned) return;
    const normKey = cleaned.toLowerCase();
    if (seenCommands.has(normKey)) return;
    seenCommands.add(normKey);

    const item = explainCommandLine(cleaned, {
      termLabel: badgeLabel,
      stageTitle: stage.title,
      stageDescription: stage.description,
      mitreId: stage.mitreTechniqueId || scenario.code,
      scenarioName: scenario.name,
    });

    results.push({
      ...item,
      id: `S${stage.index}-CMD-${results.length + 1}`,
      commandIndex: results.length + 1,
      badgeLabel: `CMD #${results.length + 1} · ${badgeLabel}`,
      toolOrSubsystem: extraToolHint || item.toolOrSubsystem,
    });
  };

  // 1. Extract explicit COMMAND 1..N, COMMAND LINE, API CALL, SYSCALL, CLI, HTTP/SQL commands from stage.keySpecs
  const COMMAND_SPEC_TERM_REGEX =
    /\b(?:COMMAND|CMDLINE|CLI|CMDLET|API\s+CALL|SYSCALL|SCRIPT|URI|GADGET|QUERY|INJECTION|PAYLOAD|REQUEST|EXECUTION|STAGER|LOADER|EXPLOIT)\b/i;
  const COMMAND_VALUE_REGEX =
    /\b(?:bitsadmin|vssadmin|esentutl|ntdsutil|rundll32|reg(?:\.exe)?\s+(?:save|add|delete|query|export)|wevtutil|schtasks|wmic|powershell|pwsh|cmd\.exe|psexec|rubeus|certreq|mimikatz|curl|wget|CreateProcess|NtUnmapViewOfSection|VirtualAlloc|WriteProcessMemory|SetThreadContext|ResumeThread|VirtualProtect|DeviceIoControl|AdjustTokenPrivileges|MiniDumpWriteDump|esxcli|vim-cmd|vol\.py|volatility|kubectl|docker|nsenter|chroot|aws\s+|gcloud\s+|az\s+|roadtx|SELECT\s+|UNION\s+SELECT|COPY\s+|xp_cmdshell)\b|^(?:GET|POST|PUT|DELETE)\s+\S+/i;

  for (const spec of stage.keySpecs || []) {
    const termUpper = spec.term.trim().toUpperCase();
    if (NON_COMMAND_SPEC_TERMS.has(termUpper)) continue;
    if (
      COMMAND_SPEC_TERM_REGEX.test(termUpper) ||
      COMMAND_VALUE_REGEX.test(spec.value)
    ) {
      pushCommand(spec.value, spec.term);
    }
  }

  // 2. Also include active process CommandLines from scenario.processTree for this stage
  const stageProcs = (scenario.processTree || []).filter(
    (p) => p.activeFromStage === stage.index
  );
  const fallbackProcs =
    stageProcs.length > 0
      ? stageProcs
      : (scenario.processTree || []).slice(0, 2);

  for (const proc of fallbackProcs) {
    if (proc.commandLine) {
      pushCommand(
        proc.commandLine,
        `PROCESS CMDLINE (${proc.name} · PID ${proc.pid})`,
        `${proc.name} (PID ${proc.pid}, PPID ${proc.ppid} · ${proc.user})`
      );
    }
    for (const api of (proc.apiCalls || []).slice(0, 2)) {
      if (
        api &&
        api.length >= 6 &&
        !/^(InitializeServiceHost|ListenEndpoint|fork\(\)|clone\(\)|execve\(\))$/i.test(
          api
        )
      ) {
        pushCommand(
          api,
          `API / SYSCALL (${proc.name})`,
          `${proc.name} (PID ${proc.pid}) Runtime Invocation`
        );
      }
    }
  }

  // 3. Also check telemetry events for this stage for any explicit CommandLine= or shortAction command
  const stageTelemetry = (scenario.telemetry || []).filter(
    (t: TelemetryEvent) => t.stageIndex === stage.index
  );
  for (const tel of stageTelemetry) {
    const rawCmdMatch = tel.rawLog?.match(
      /(?:CommandLine|ProcessCommandLine|ParentCommandLine)\s*[:=]\s*([^|\n]+)/i
    );
    if (rawCmdMatch?.[1]) {
      pushCommand(
        rawCmdMatch[1].trim(),
        `TELEMETRY CMDLINE (${tel.protocolOrEventId})`
      );
    }
    if (results.length === 0 && tel.shortAction) {
      pushCommand(tel.shortAction, `TELEMETRY ACTION (${tel.protocolOrEventId})`);
    }
  }

  // 4. Fallback if stage still has < 2 commands: include primary technical keySpecs
  if (results.length < 2) {
    for (const spec of stage.keySpecs || []) {
      const termUpper = spec.term.trim().toUpperCase();
      if (NON_COMMAND_SPEC_TERMS.has(termUpper)) continue;
      pushCommand(spec.value, spec.term);
      if (results.length >= 3) break;
    }
  }

  return results;
}

/**
 * Explains a single ProcessTreeNode's CommandLine and API calls in detail.
 */
export function explainProcessNodeCommandLine(
  proc: ProcessTreeNode,
  scenario?: AttackScenario,
  stage?: AttackStage | null
): StageCommandBreakdownItem {
  const matchedStage =
    stage ||
    scenario?.stages.find((s) => s.index === proc.activeFromStage) ||
    scenario?.stages[0];

  const item = explainCommandLine(proc.commandLine || proc.name, {
    termLabel: `PROCESS CMDLINE · PID ${proc.pid}`,
    stageTitle: matchedStage?.title || `${proc.name} Execution`,
    stageDescription: matchedStage?.description || scenario?.overview,
    mitreId: matchedStage?.mitreTechniqueId || scenario?.code || 'ATT&CK',
    scenarioName: scenario?.name,
  });

  return {
    ...item,
    id: `PROC-${proc.pid}`,
    badgeLabel: `PROCESS CMDLINE · ${proc.name} (PID ${proc.pid})`,
    toolOrSubsystem: `${proc.name} (PID ${proc.pid}, PPID ${proc.ppid} · ${proc.user} · ${proc.integrity})`,
  };
}
